import logo from "./logo.svg";
import "./App.css";
import "./output.css";
import PlaylistConverter from "./components/PlaylistConverter.jsx";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import { useState } from "react";

// TODO : set up a session token here and put it as key to the PlaylistConverter component
function App() {
  const [converterKey, setConverterKey] = useState(0); // this key is used to reset entire PLaylistConverter state
  return (
    <div className="App">
      <BrowserRouter>
        <nav className="nav-bar">
          <Link
            to="/playlist"
            className="m-5 text-xl"
            onClick={() => setConverterKey((i) => i + 1)}
          >
            <img src="../stopify-images/stopify-21.png" className="ml-7" />
          </Link>
        </nav>
        <Routes>
          <Route path="/" element={<PlaylistConverter key={converterKey} />} />
          <Route
            path="/playlist"
            element={<PlaylistConverter key={converterKey} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
