function TrackPreviewTable({ trackData }) {
  return (
    <div
      id="track-preview-table"
      className="border-2 shadow-md m-auto max-h-75 overflow-y-auto inline-block"
    >
      <table
        style={{}}
        id="track-table"
        className="m-auto text-left table-auto border "
      >
        <thead>
          <tr className="text-left sticky top:0">
            <th>Order</th>
            <th>Song Name</th>
            <th>Artist</th>
            <th>Length</th>
            <th>ISRC</th>
          </tr>
        </thead>
        <tbody className="">
          {trackData.map((track) => (
            <tr key={track.order} className="odd:bg-[var(--translucent-white)]">
              <td>{track.order}</td>
              <td>{track.songName}</td>
              <td>{track.artists}</td>
              <td>{track.length}</td>
              <td>{track.isrc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default TrackPreviewTable;
// could add this for able stripe styling: className="odd:bg-white"
