import React, { useEffect } from 'react';
import SpotifyWebApi from "spotify-web-api-js";
import './App.css';
import Login from "./Login";
import { getTokenFromUrl } from './spotify';
import Player from "./Player";
import { useDataLayerValue } from "./DataLayer"; 

const spotify = new SpotifyWebApi();

function App() {
  const [{ token }, dispatch] = useDataLayerValue();

  //Run code on a given condition  
  useEffect(() => {
    const hash = getTokenFromUrl();
    window.location.hash = "";
    const _token = hash.access_token;

    if(_token) {
      dispatch({
        type: "SET_TOKEN",
        token: _token,
      });
      spotify.setAccessToken(_token);
      spotify.getMe().then((user) => {
        dispatch({
          type: 'SET_USER',
          user: user,
        });
      });

      spotify.getPlaylist('574boLylqMepUCTiPY5Zws')
      .then(response => {
        dispatch({
          type: "SET_DISCOVER_WEEKLY",
          discover_weekly: response,
        });
      });  
     


      spotify.getUserPlaylists().then((playlists) => {
        dispatch({
          type: "SET_PLAYLISTS",
          playlists: playlists,
        });
      }); 
    }
  }, [token, dispatch]);

  return (
    <div className="app">
      {
        token ? (
          <Player spotify={spotify} />
        ) : (
            <Login />
          )
      }
    </div>
  );
}

export default App;
