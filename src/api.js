const rootPath = "https://kk3lcd2z76.execute-api.us-east-2.amazonaws.com"; // where the Node API is hosted

const fetchWithCookies = async function (url) {
  return fetch(url, { credentials: "include" });
};

export const requestPlaylistFromSpotify = async function (playlistId) {
  console.log("Preparing to request to localhost:8081/playlist");
  let url = new URL(rootPath + "/playlist");
  url.search = new URLSearchParams({ id: playlistId }).toString();
  let response = await fetchWithCookies(url);
  let jsonData = await response.json();
  console.log(`"${jsonData.name}" playlist received`);
  // the code regex replace code in the following line is intended to prevent HTML injection
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

  const endpoint = rootPath + "/convert-yt";
  // resetProgressBar();
  // updateProgressDisplay(0);

  // construct an array of Promises (fetch calls)
  // perform up to 3 retries for youtube links
  const youtubeConversionPromises = trackData.map((track) => {
    let nameParam = `${track.artists}-${track.songName}`;

    return new Promise((resolve, reject) => {
      let successCase = () => {
        callback && callback();
        resolve();
      };
      findYoutubeLinks(track)
        .then((links) => {
          fetchWithCookies(`${endpoint}?url=${links[0]}&name=${nameParam}`)
            .then(successCase)
            .catch(() =>
              fetchWithCookies(`${endpoint}?url=${links[1]}&name=${nameParam}`)
                .then(successCase)
                .catch(() =>
                  fetchWithCookies(
                    `${endpoint}?url=${links[2]}&name=${nameParam}`
                  ).then(successCase)
                )
            );
        })
        .catch((e) => reject("Failed to convert after 3 link attempts. " + e));
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
    let jsonData = await response.json();
    console.log(`Bandcamp response:`);
    console.log(jsonData);
    return jsonData;
    // let sourcedTrackCount = buildBandcampTable(jsonData);
    // return sourcedTrackCount;
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
    return response.text();
  } catch (e) {
    console.log("Failed to gather Bandcamp price data", e);
  }
};

export async function setupTidal() {
  /*
  try {
    console.log("Tidal Auth starting");
    let res = await auth.init({
      clientId,
      clientSecret,
      credentialsStorageKey: "key",
      scopes: [],
    });

    console.log("Tidal Auth processing");
    // await setCredentialsProvider(auth.credentialsProvider);

    const apiClient = await createAPIClient(auth.credentialsProvider);
    const credentials = await auth.credentialsProvider.getCredentials();

    console.log("response: ", res);
    console.log("credentials: ", credentials);
    console.log("apiClient: ", apiClient);

    // Example of an API request
    await getAlbum("75413011");
    // await createPlaylist();

    console.log("Redirecting to Tidal Login");

    // await loginUser();

    console.log("Tidal Auth complete");

    async function loginUser() {
      //TODO store local state so that whe you return to this site, you still have
      // the original Spotify playlist ID and you also have
      // a flag that indicates a successful auth to Tidal

      const redirectUri = "http://localhost:3000/playlist";
      const loginUrl = await auth.initializeLogin({
        redirectUri,
      });

      window.open(loginUrl, "_self");
    }

    async function getAlbum(id) {
      const { data, error } = await apiClient.GET("/albums/{id}", {
        params: {
          path: { id },
          query: { countryCode: "NO" },
        },
      });

      if (error) {
        error.errors.forEach(
          // err => (results.innerHTML += `<li>${err.detail}</li>`),
          (err) => console.log
        );
      } else {
        // for (const [key, value] of Object.entries(data.data.attributes)) {
        //     results.innerHTML += `<li><b>${key}:</b>${JSON.stringify(value)}</li>`;
        // }
        console.log("testAlbum: ", data);
      }
    }

    async function createPlaylist() {
      const { data, error } = await apiClient.POST("/playlists", {
        params: {
          query: { countryCode: "US" },
        },
        requestBody: {
          data: {
            attributes: {
              accessType: "PUBLIC",
              description: "string",
              name: "test_gap01",
            },
            type: "playlists",
          },
        },
      });

      if (error) {
        error.errors.forEach(console.log);
      } else console.log("playlist creation output : ", data);
    }
  } catch (e) {
    console.log("error -> ", e);
    console.log("error.cause -> ", e.cause);
    console.log("error.message -> ", e.message);
  }

  */
}
