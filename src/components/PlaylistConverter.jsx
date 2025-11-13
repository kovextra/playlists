import { useState, useEffect } from "react";
import PlaylistInput from "./PlaylistInput";
import PlaylistDisplay from "./PlaylistDisplay";
import NotificationBar from "./NotificationBar";
import PlaylistToolbar from "./PlaylistToolbar";
import TrackPreviewTable from "./TrackPreviewTable";
import TransferForm from "./TransferForm";
import SourceTracksForm from "./SourceTracksForm";

import {
  fetchZipForPlaylist,
  requestPlaylistFromSpotify,
  requestAllYoutubeConversions,
  findBandcampLinks,
  setupTidal,
  scrapeLowestBandcampPrice,
} from "../api";
import { convertMSToMinutesSeconds } from "../utils";
import ProgressBar from "./ProgressBar";
import BandcampSourceTable from "./BandcampSourceTable";

function PlaylistConverter() {
  const [hideTitle, setHideTitle] = useState(false);
  const [playlistId, setPlaylistId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [playlistData, setPlaylistData] = useState(null);
  const [showTracks, setShowTracks] = useState(false);
  const [trackData, setTrackData] = useState(null);
  const [status, setStatus] = useState("input");
  const [loggedInExternally, setLoggedInExternally] = useState(false);
  const [transferDestination, setTransferDestination] =
    useState("Choose Destination");
  const [source, setSource] = useState("Select Source");
  const [bandcampTotalCost, setBandcampTotalCost] = useState(null);
  const [numberOfTracksLoaded, setNumberOfTracksLoaded] = useState(0);

  const BACKEND_URL = "http://localhost:8081";

  function toggleTitle(val) {
    setHideTitle(!hideTitle);
  }

  function toggleTrackPreview() {
    setShowTracks(!showTracks);
  }

  function incrementTrackLoadingProgress() {
    setNumberOfTracksLoaded((previous) => previous + 1);
  }

  function onSubmitPlaylist(playlistId) {
    console.log("received id: ", playlistId);
    setPlaylistId(playlistId);
    setNotification({
      type: "good",
      message: `Processing Playlist ID: ${playlistId}`,
    });
  }

  useEffect(() => {
    if (playlistId) gatherPlaylistData();
  }, [playlistId]);

  async function gatherPlaylistData() {
    let fetchResponse = await requestPlaylistFromSpotify(playlistId);
    setNotification(fetchResponse.notification);
    let intialPlaylistData = fetchResponse.value;

    if (!intialPlaylistData) return;

    let loadedTrackData = [];

    let playlistObject = null;

    do {
      if (playlistObject) {
        // continue to call API to pull next batch of tracks
        console.log(playlistObject.next);
        fetchResponse = await requestPlaylistFromSpotify(
          playlistObject.next.substring(
            playlistObject.next.indexOf("playlists") + 10
          )
        );
        playlistObject = fetchResponse.value;
      } else playlistObject = intialPlaylistData.tracks;

      let tracksInThisPlaylistObject = playlistObject.items;
      let indexOffset = loadedTrackData.length; // if there are already tracks loaded, maintain index integrity

      tracksInThisPlaylistObject.forEach((track, index) => {
        loadedTrackData.push({
          order: index + indexOffset + 1,
          songName: track.track.name,
          artists: track.track.artists.reduce(
            (accumulator, artist, artistIndex) => {
              return artistIndex === 0
                ? artist.name
                : accumulator + ", " + artist.name;
            },
            ""
          ),
          album: track.track.album.name,
          length: convertMSToMinutesSeconds(track.track.duration_ms),
          isrc: track.track.external_ids.isrc,
        });
      });
    } while (playlistObject.next);

    setPlaylistData(intialPlaylistData);
    setTrackData(loadedTrackData);
    setStatus("display");
  }

  async function sourceFromYoutube() {
    try {
      setNotification({
        type: "good",
        message: "Connecting to YouTube sourcing service",
      });
      setNumberOfTracksLoaded(0);
      let promises = requestAllYoutubeConversions(
        trackData,
        incrementTrackLoadingProgress
      );
      // console.log("We got the promises", promises);
      setNotification({
        type: "good",
        message: "Downloading tracks",
      });
      await Promise.all(promises);
      // then call to pull the whole compressed folder
      setNotification({
        type: "good",
        message: "Compressing playlist into zip folder...",
      });
      console.log("Promises all completed");
    } catch (error) {
      setNotification({
        type: "bad",
        message: "Failed to load tracks from Youtube.",
      });
      console.error("Failed to source tracks from Youtube: " + error);
      return;
    }

    try {
      let url = await fetchZipForPlaylist(playlistData.name);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${playlistData.name}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setNotification({ type: "good", message: "Download Completed" });
    } catch (error) {
      setNotification({
        type: "bad",
        message: "Failed to compress tracks for download.",
      });
      console.error("Failed to compress and deliver zip file: " + error);
    }
  }

  async function sourceFromBandcamp() {
    let bandcampLinks = await findBandcampLinks(trackData);
    console.log("Finished retreiving links from Bandcamp");
    setStatus("sourced-from-bandcamp");

    let sourcedTrackCount = 0;
    setTrackData(
      trackData.map((track, index) => {
        if (bandcampLinks[index]) sourcedTrackCount++;
        return { ...track, bandcampLink: bandcampLinks[index] };
      })
    );

    let totalCost = await scrapeLowestBandcampPrice(bandcampLinks);
    setBandcampTotalCost(totalCost);
    setNotification({
      type: "good",
      message: `Sourced ${sourcedTrackCount} of ${trackData.length} Tracks from Bandcamp.`,
    });
  }

  function toggleTransferMode() {
    setStatus(status === "transfer" ? "display" : "transfer");
  }

  function toggleSourceTracksForm() {
    setStatus(status === "sourcing" ? "display" : "sourcing");
  }

  function handleDestinationSelection(e) {
    setTransferDestination(e.target.value);
    if (transferDestination != "Choose destination")
      setLoggedInExternally(false);
  }

  function authenticateExternalPlatformAccount() {
    setNotification({
      type: "good",
      message: `Redirecting to ${transferDestination} authentication...`,
    });
    // TODO switch behavior based on transfer selection
    switch (transferDestination) {
      case "Tidal":
        setupTidal();
      case "Apple Music":
      case "SoundCloud":
      default:
    }
    setLoggedInExternally(true);
  }

  const titleComponents = (
    <span id="landing-title" className="">
      <h1 className="sm:text-3xl md:text-6xl lg:text-8xl mb-10 text-white">
        Playlist Converter
      </h1>
      <h2 className="sm:text-lg md:text-3xl lg:text-4xl mb-20">
        Pay Artists. Own Music. Listen on Your Terms.
      </h2>
    </span>
  );

  const notificationComponents = notification ? (
    <NotificationBar notification={notification} />
  ) : null;

  const toolbarComponents = playlistData ? (
    <PlaylistToolbar
      onListTracks={toggleTrackPreview}
      onSourceTracks={toggleSourceTracksForm}
      onNotify={setNotification}
      status={status}
      onTransfer={toggleTransferMode}
    />
  ) : null;

  const trackTableComponents = showTracks ? (
    <TrackPreviewTable trackData={trackData}></TrackPreviewTable>
  ) : null;

  if (status === "input")
    return (
      <div className="p-10">
        {titleComponents}
        <PlaylistInput onSubmit={onSubmitPlaylist} onNotify={setNotification} />
        {notificationComponents}
      </div>
    );
  if (status === "display")
    return (
      <div className="p-10">
        {titleComponents}
        <PlaylistDisplay playlistData={playlistData} />
        {notificationComponents}
        {toolbarComponents}
        {trackTableComponents}
      </div>
    );
  if (status === "sourcing")
    return (
      <div className="p-10">
        {titleComponents}
        <SourceTracksForm
          onSourceFromYoutube={sourceFromYoutube}
          onSourceFromBandcamp={sourceFromBandcamp}
          setNotification={setNotification}
          onSelectionChange={(e) => {
            setNotification(null);
            setSource(e.target.value);
          }}
          source={source}
          completed={numberOfTracksLoaded}
          trackData={trackData}
        />
        {notificationComponents}
        {toolbarComponents}
        {trackTableComponents}
      </div>
    );
  if (status === "sourced-from-bandcamp")
    return (
      <div className="p-10">
        {titleComponents}
        <BandcampSourceTable
          trackData={trackData}
          totalCost={bandcampTotalCost}
        />
        {notificationComponents}
        {toolbarComponents}
        {trackTableComponents}
      </div>
    );
  if (status === "transfer")
    return (
      <div className="p-10">
        {titleComponents}
        <TransferForm
          playlistData={playlistData}
          loggedIn={loggedInExternally}
          onLogin={authenticateExternalPlatformAccount}
          destination={transferDestination}
          handleDestinationSelection={handleDestinationSelection}
        />
        {notificationComponents}
        {toolbarComponents}
        {trackTableComponents}
      </div>
    );

  // return (
  //   <div className="p-10">
  //     {/* <a href="PlaylistConverter.jsx">HOME</a> */}

  //     {hideTitle ? (
  //       <div />
  //     ) : (
  //       <h1 id="landing-title" className="major-title">
  //         Spotify Playlist Converter
  //       </h1>
  //     )}
  //     {playlistData ? (
  //       <>
  //         <PlaylistDisplay playlistData={playlistData} />
  //       </>
  //     ) : (
  //       <PlaylistInput onSubmit={onSubmitPlaylist} onNotify={setNotification} />
  //     )}
  //     {notification ? <NotificationBar notification={notification} /> : null}
  //     {playlistData ? (
  //       <PlaylistToolbar onListTracks={toggleTrackPreview} />
  //     ) : null}
  //     {showTracks ? (
  //       <TrackPreviewTable trackData={trackData}></TrackPreviewTable>
  //     ) : null}
  //   </div>
  // );
}

export default PlaylistConverter;
