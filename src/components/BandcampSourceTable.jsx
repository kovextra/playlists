import CenterDisplay from "./CenterDisplay";

function BandcampSourceTable({ trackData, totalCost }) {
  let message = totalCost
    ? `Estimated Total Cost: ${totalCost}`
    : `Estimating Total Costs for Available Downloads...`;
  const bcTable = (
    <div>
      <h1 className="sm:text-3xl md:text-5xl m-6 pt-15 pb-5">
        Bandcamp sources - available for purchase/download
      </h1>
      <div
        id="bandcamp-table"
        className="shadow-md  m-auto max-h-75 overflow-y-auto inline-block"
      >
        <table
          id="track-table"
          className="p-5 m-auto text-left table-auto border"
        >
          <thead>
            <tr className="text-left sticky top:0">
              <th>Order</th>
              <th>Song Name</th>
              <th>Artist</th>
              <th>Bandcamp Link</th>
            </tr>
          </thead>
          <tbody>
            {trackData.map((track) => (
              <tr
                key={track.order}
                className="odd:bg-[var(--translucent-white)]"
              >
                <td>{track.order}</td>
                <td>{track.songName}</td>
                <td>{track.artists}</td>
                <td>
                  {track.bandcampLink ? (
                    <a href={track.bandcampLink} target="blank">
                      <button className="h-6 w-28 mt-1 mb-1 font-medium text-center !p-0">
                        DOWNLOAD
                      </button>
                    </a>
                  ) : (
                    "Not Found"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h1 className="pt-10 sm:text-xl md:text-2xl">
        <i>{message}</i>
      </h1>
      {totalCost ? (
        <button className="mt-8">
          <b>PURCHASE ALL FROM BANDCAMP</b>
        </button>
      ) : null}
    </div>
  );

  return <CenterDisplay props={bcTable} />;
}

export default BandcampSourceTable;
