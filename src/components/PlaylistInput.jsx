import { useState, useEffect, useRef } from "react";
import { apiPull } from "../api";

function PlaylistInput(props) {
  const defaultURL = "https://open.spotify.com/playlist/...";
  const [inputText, setInputText] = useState(defaultURL);
  const { onSubmit, onNotify } = props;
  const inputRef = useRef();

  function handleChange(e) {
    setInputText(e.target.value);
  }

  function handleSubmit(notificationMethod) {
    console.log(inputText);

    if (!validateInput(inputText)) {
      notificationMethod({
        type: "bad",
        message: `Error: Please enter a valid playlist URL. Copy the link from the 'Share Playlist' option in Spotify.`,
      });
      return;
    }

    let playlistID = inputText.substring(inputText.indexOf("playlist") + 9);
    let queryIndex = playlistID.indexOf("?");
    if (queryIndex > 0) playlistID = playlistID.substring(0, queryIndex);
    onSubmit(playlistID);
  }

  const validateInput = function (formData) {
    // TODO: could add more validation here, using explicit regex for URL characters
    formData = formData.trimEnd();
    if (
      formData == defaultURL ||
      /\s/.test(formData) ||
      !formData.includes("spotify.com/playlist")
    ) {
      shakeInput();
      setInputText(defaultURL);
      console.log("Input failed validation.");
      return false;
    }
    return true;
  };

  const shakeInput = async function () {
    let inputBox = document.querySelector("#link-input");
    inputBox.style.position = "relative";
    let positions = [-10, 20, -20, 20, -20, 20];
    let shakeID = 0;
    let index = 0;

    let shake = function () {
      inputBox.style.left = positions[index] + "px";
      index++;
      if (index >= positions.length) {
        clearInterval(shakeID);
        inputBox.style.left = 0;
      }
    };
    let shakeSpeed = 20;
    shakeID = setInterval(() => shake(index), shakeSpeed);
  };

  function checkForEmptyInput() {
    console.log("checking");
    if (inputText.trim() === "") setInputText(defaultURL);
  }

  // perform once on load
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div
      id="data-input-components"
      className="m-auto mt-20 w-1/2 rounded-2xl  bg-slate-800 p-6 shadow-lg outline outline-black/5"
    >
      <h1 className="sm:text-2xl md:text-4xl m-10 text-white font-bold">
        Paste your Spotify playlist link
      </h1>
      <input
        id="link-input"
        ref={inputRef}
        type="text"
        className="text-2xl bg-blue-50"
        value={inputText}
        onFocus={() => setInputText("")}
        onChange={handleChange}
        onBlur={checkForEmptyInput}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit(onNotify);
        }}
        placeholder={defaultURL}
      />
      <div>
        <button id="submit-button" onClick={() => handleSubmit(onNotify)}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default PlaylistInput;
