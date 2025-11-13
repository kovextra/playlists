function PlaylistToolbar(props) {
  const { onListTracks, onNotify, onSourceTracks, onTransfer } = props;

  function clearNotificationsThenCall(callback) {
    onNotify(null);
    callback();
  }

  return (
    <div id="playlist-buttons" className="">
      <button
        id="list-tracks-button"
        className="playlist-buttons"
        onClick={() => clearNotificationsThenCall(onListTracks)}
      >
        List Tracks
      </button>
      <button
        id="source-mode-button"
        className="playlist-buttons"
        onClick={() => clearNotificationsThenCall(onSourceTracks)}
      >
        Source Tracks
      </button>
      <button
        id="transfer-playlist-button"
        className="playlist-buttons"
        onClick={() => clearNotificationsThenCall(onTransfer)}
      >
        Transfer Platform
      </button>
    </div>
  );
}
export default PlaylistToolbar;
