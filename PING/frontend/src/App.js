import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { useState, useEffect } from "react";
import { Room, Star } from "@material-ui/icons";
import "./app.css"
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from "axios";
import { format } from "timeago.js"
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
  const myStorge = window.localStorage;
  const [currentUser, setCurrentUser] = useState(myStorge.getItem("user"));  //prevent refresh of current user in memory
  const [pins, setPins] = useState([]); //for getting pins from backend
  const [currentPlaceId, setcurrentPlaceId] = useState(null);  //this hook is to open one pin detail at a time
  const [newPlaceId, setnewPlaceId] = useState(null); //double click to generate new pin
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(0);
  const [viewport, setViewport] = useState({  //related to map style
    width: "100vw",
    height: "100vh",
    latitude: 20,
    longitude: 80,
    zoom: 3,
  });

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/pins");
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins()
  }, []); //[] to eneter dependency empty[] == fire at begin



  const handleMarkerClick = (id, lat, long) => {
    setcurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long })
  }

  const handleAddClick = (e) => {
    const { lat, lng } = e.lngLat; // Destructure lat and lng directly from e.lngLat
    setnewPlaceId({
      lat,
      long: lng, // Assuming you want to use 'long' instead of 'lng'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlaceId.lat,
      long: newPlaceId.long,

    }
    try {
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setnewPlaceId(null);
    } catch (err) {
      console.log(err);

    }

  };

  const handleLogout = ()=>{
    myStorge.removeItem("user");
    setCurrentUser(null);  //after insertion of pin i dont want to see my form  popup
  }
  return (
    <div className="App">
      <ReactMapGL
        {...viewport}
        mapboxAccessToken="pk.eyJ1Ijoic2hhYW5yYW0zMyIsImEiOiJjbHcyMmFhbjcwZGh0MmtsOGY4enlwemNpIn0.O9-3TlEeZOCkqxeMuaR-Ug"
        onViewportChange={nextViewport => setViewport(nextViewport)}
        style={{ width: "100vw", height: "100vh" }}
        // mapStyle="mapbox://styles/mapbox/streets-v9"
        mapStyle="mapbox://styles/safak/cknndpyfq268f17p53nmpwira"
        onDblClick={handleAddClick}
        transitionDuration="200"
      >

        {pins.map(p => (
          <>
            <Marker latitude={p.lat}
              longitude={p.long}
              offsetLeft={-viewport.zoom * 3.5}
              offsetTop={-viewport.zoom * 7}
            >
              <Room
                style={{
                  fontSize: viewport.zoom * 7,
                  color: p.username === currentUser ? "tomato" : "slateblue",
                  cursor: "pointer"
                }}
                onClick={() => handleMarkerClick(p._id, p.lat, p.long
                )}
              />
            </Marker>

            {p._id === currentPlaceId && (
              < Popup                              //this pop up showing pin details  
                latitude={p.lat}
                longitude={p.long}
                closeButton={true}
                closeOnClick={false}
                anchor="right"
                onClose={() => setcurrentPlaceId(null)}
              >

                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{p.title}</h4>
                  <label>Review</label>
                  <p className="desc">{p.desc}</p>
                  <label>Rating</label>
                  <div className="stars">
                    {Array(p.rating).fill(<Star className="star" />)}

                  </div>

                  <label>Information</label>
                  <span className="username">Created By <b>{p.username}</b></span>
                  <span className="date">{format(p.createdAt)}</span>
                </div>
              </Popup >
            )
            }
          </>
        ))}

        {newPlaceId && (              //this pop up for enter new place by double click

          < Popup
            latitude={newPlaceId.lat}
            longitude={newPlaceId.long}
            closeButton={true}
            closeOnClick={false}
            anchor="right"
            onClose={() => setnewPlaceId(null)}
          >
            <div>
              <form onSubmit={handleSubmit}>
                <lable>Title</lable>
                <input placeholder="Enter a title"
                  onChange={(e) => setTitle(e.target.value)}
                />
                <lable>Review</lable>
                <textarea placeholder="Tell us something about this place."
                  onChange={(e) => setDesc(e.target.value)}
                />
                <lable>Rating</lable>
                <select onChange={(e) => setRating(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button className="submitButton" type="submit">Add Pin</button>

              </form>
            </div>
          </Popup >

        )}
        {currentUser ? (
          <button className="button logout"
          onClick={handleLogout}>Logout</button>
        ) : (
          <div className="buttons">
            <button className="button login"
              onClick={() => setShowLogin(true)}>Login</button>


            <button className="button register"
              onClick={() => setShowRegister(true)}>
              Register</button>
          </div>
        )}

        {showRegister && <Register setShowRegister={setShowRegister} /> }

        {showLogin && <Login setShowLogin={setShowLogin} myStorage={myStorge} 
        setCurrentUser={setCurrentUser} />}



      </ReactMapGL>
    </div >
  );
}


export default App;
