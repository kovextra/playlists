import { useState } from "react";
import CenterDisplay from "./CenterDisplay";
function TransferForm({
  loggedIn,
  onLogin,
  destination,
  handleDestinationSelection,
}) {
  const transferForm = (
    <>
      <h1 className="sm:text-3xl md:text-5xl m-6 pt-15">
        Transfer your playlist to another streaming platform
      </h1>
      <select
        id="platform-selector"
        value={destination}
        className="m-20 p-3 sm:text-2xl md:text-4xl text-blue-800 text-center border-2 rounded-xl h-20 bg-white"
        onChange={handleDestinationSelection}
      >
        <option>Choose Destination</option>
        <option>Tidal</option>
        <option disabled>Apple Music (Coming Soon)</option>
        <option disabled>SoundCloud (Coming Soon)</option>
      </select>
      <div id="transfer-data" className="middle">
        {loggedIn ? (
          <button id="transfer-start-button" className="">
            {" "}
            Initiate Transfer
          </button>
        ) : (
          <button
            id="authorize-platform-button"
            className="dynamic-label-1 disabled:opacity-50 disabled:pointer-events-none w-l"
            onClick={onLogin}
            disabled={
              destination == null || destination === "Choose Destination"
            }
          >
            {destination === "Tidal" ? "Login to Tidal" : "Login to Account"}
          </button>
        )}
      </div>
    </>
  );
  return <CenterDisplay props={transferForm} />;
}

export default TransferForm;
