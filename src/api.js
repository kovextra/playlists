const rootPath = process.env.REACT_APP_API_ROOT_PATH; // where the Node API is hosted

const fetchWithCookies = async function (url) {
  return fetch(url, { credentials: "include" });
};

export const requestPlaylistFromSpotify = async function (playlistId) {
  console.log(`Preparing to request to ${rootPath}`);
  let url = new URL(rootPath + "/playlist");
  url.search = new URLSearchParams({ id: playlistId }).toString();
  let response = await fetchWithCookies(url);
  let jsonData = await response.json();
  console.log(`"${jsonData.name}" playlist received`);
  // the regex replace code in the following line is intended to prevent HTML injection
  return response.status == 200
    ? {
        notification: {
          type: "good",
          message: `Successfully received Spotify data for playlist "${
            jsonData.name
              ? jsonData.name.replace(/</g, "&lt;").replace(/>/g, "&gt;")
              : ""
          }"`,
        },
        value: jsonData,
      }
    : {
        notification: {
          type: "bad",
          message: `Error. Failed to connect to Spotify - ${jsonData.reason}`,
        },
        value: jsonData,
      };
};

export const requestAllYoutubeConversions = function (trackData, callback) {
  if (!trackData || trackData.length == 0) return;

  const endpoint = rootPath + "/yt-conversion";

  // construct an array of Promises (fetch calls)
  // perform up to 3 retries for youtube links
  // we send separate requests so that we can track independent returns and incremental progress
  const youtubeConversionPromises = trackData.map((track) => {
    let nameParam = `${track.artists}-${track.songName}`;

    return new Promise((resolve, reject) => {
      let evaluateApiResult = (response) => {
        if (!response.ok) return reject("Failed to download song " + nameParam);
        callback && callback();
        return resolve();
      };
      findYoutubeLinks(track)
        .then((links) => {
          fetchWithCookies(`${endpoint}?url=${links[0]}&name=${nameParam}`)
            .then(evaluateApiResult)
            .catch(() =>
              fetchWithCookies(`${endpoint}?url=${links[1]}&name=${nameParam}`)
                .then(evaluateApiResult)
                .catch(() =>
                  fetchWithCookies(
                    `${endpoint}?url=${links[2]}&name=${nameParam}`
                  ).then(evaluateApiResult)
                )
            );
        })
        .catch((e) =>
          reject(
            `Failed to convert after 3 link attempts for song ${nameParam}. ${e}`
          )
        );
    });
  });

  return youtubeConversionPromises;
};

export const fetchZipForPlaylist = async function (playlistName) {
  let response = await fetchWithCookies(rootPath + `/zip?name=${playlistName}`);
  let blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  return url;
};

// TODO: implement web scraping to find actual hyperlinks
export const findYoutubeLinks = async function (track) {
  try {
    const response = await fetchWithCookies(
      `${rootPath}/gapi-search?q=${track.songName} ${track.artists}`
    );
    if (!response.ok)
      throw new Error(
        `Youtube API request failed with status ${response.status}`
      );
    const threeYoutubeIdsFromSearch = await response.json();
    console.log(
      `Retrieved Youtube IDs for ${track.songName} - ${track.artists}: ${threeYoutubeIdsFromSearch}`
    );
    return threeYoutubeIdsFromSearch.map(
      (id) => "https://www.youtube.com/watch?v=" + id
    );
  } catch (e) {
    console.error(
      `Failed to retrieve Youtube ID for ${track.songName} - ${track.artists}: ${e}`
    );
    return "";
  }
};

export const findBandcampLinks = async function (trackData) {
  try {
    let response = await fetch(rootPath + "/bandcamp-search", {
      method: "POST",
      body: JSON.stringify(trackData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok)
      throw new Error(`Bandcamp request failed with status ${response.status}`);
    let jsonData = await response.json();
    console.log(`Bandcamp response:`);
    console.log(jsonData);
    return jsonData;
  } catch (e) {
    console.log(`Bandcamp communication failed - ${e}`);
  }
};

export const scrapeLowestBandcampPrice = async function (links) {
  try {
    let response = await fetch(rootPath + "/bandcamp-data", {
      method: "POST",
      body: JSON.stringify(links),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok)
      throw new Error(`Bandcamp request failed with status ${response.status}`);
    return response.text();
  } catch (e) {
    console.log("Failed to gather Bandcamp price data", e);
  }
};

export const setupTidal = async function () {
  return false;
};
