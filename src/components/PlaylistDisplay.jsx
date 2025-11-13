import CenterDisplay from "./CenterDisplay";

function PlaylistDisplay({ playlistData }) {
  const playlistDisplay = (
    <>
      <h1 id="playlist-title" className="text-7xl -mt-5">
        {playlistData.name}
      </h1>
      <h1 className="text-xl m-6">
        Curated by {playlistData.owner.display_name} •
        {" " + playlistData.tracks.total} Track
        {playlistData.tracks.total > 1 ? "s" : ""}
      </h1>
      <img
        id="playlist-image"
        className="max-w-1/3 m-auto"
        src={playlistData.images[0].url}
      />
    </>
  );
  return <CenterDisplay props={playlistDisplay} />;
}
export default PlaylistDisplay;
