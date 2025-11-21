import { useState } from "react";
import CenterDisplay from "./CenterDisplay";
import ProgressBar from "./ProgressBar";

function SourceTracksForm({
  source,
  onSourceFromYoutube,
  onSourceFromBandcamp,
  onSelectionChange,
  setNotification,
  completed,
  trackData,
}) {
  const [showProgress, setShowProgress] = useState(false);
  const sourceTrackForm = (
    <div id="source-tracks-page" className="form">
      <h1 className="sm:text-3xl md:text-5xl m-6 pt-15">
        Receive file downloads for the songs in this playlist
      </h1>
      <select
        id="source-selector"
        value={source}
        className="shadow-xl m-20 p-3 lg:w-150 sm:w-75 sm:text-2xl md:text-4xl text-blue-800 text-center border-2 rounded-xl h-20 bg-white"
        onChange={onSelectionChange}
      >
        <option>Select Source</option>
        <option>YouTube</option>
        <option>Bandcamp</option>
      </select>
      <div id="source-details" className="middle">
        <div></div>
        <button
          id="source-tracks-button"
          className="disabled:opacity-50 disabled:pointer-events-none w-l"
          disabled={source == null || source === "Select Source"}
          onClick={() => {
            if (source === "YouTube") {
              setShowProgress(true);
              onSourceFromYoutube();
            }
            if (source === "Bandcamp") {
              setNotification({
                type: "good",
                message: "Finding tracks on Bandcamp...",
              });
              onSourceFromBandcamp();
            }
          }}
        >
          Start Download
        </button>
      </div>
      {showProgress ? (
        <div>
          <br />
          <br />
          <ProgressBar
            completed={completed}
            total={trackData.length}
            title="Tracks Downloaded:"
          />
        </div>
      ) : null}
    </div>
  );

  return <CenterDisplay props={sourceTrackForm} />;
}

export default SourceTracksForm;
