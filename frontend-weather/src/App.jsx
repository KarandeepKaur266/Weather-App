import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Searchhistory from "./components/searchhistory";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const handleFetchWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name.");
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      // 👇 This calls your Node.js API
      const response = await axios.get(
        `http://localhost:5000/weather/${city}`
      );

      setWeather(response.data.data);
    } catch (err) {
      console.error(err);
      setError("City not found or server error.");
    } finally {
      setLoading(false);
    }
  };
 
  

  useEffect(() => {fetchHistory();}, [loading]);

  const fetchHistory = async () => {
    try {
      const response = await axios.get("http://localhost:5000/searchhistory");
      setHistory(response.data.data || []);
    } catch (err) {
      console.error("Error fetching history:", err);
      setError("Failed to load search history.");
    }
  };

  
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;

    try {
      await axios.delete(`http://localhost:5000/weather/historydelete/${id}`);
      setHistory(history.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Error deleting record:", err);
      setError("Failed to delete this record.");
    }
  };
  return (
    <div className="container-fluid">
      <div className="app-container d-flex shadow-lg align-items-center justify-content-center">
        <div className="card weather-card p-4 shadow-lg text-center">
          <h2 className="mb-4 fw-bold text-light">🌦 Indian Weather App</h2>

          {/* 🔍 Search Input */}
          <div className="input-group mb-3">
            <input type="text"  className="form-control"
              placeholder="Enter any Indian city name..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <button
              className="btn btn-light fw-bold"
              onClick={handleFetchWeather}
            >
              Get Weather
            </button>
          </div>

          {/* 🌀 Loading Spinner */}
          {loading && (
            <div className="spinner-border text-light mt-3" role="status"></div>
          )}

          {/* ⚠️ Error Message */}
          {error && <div className="alert alert-danger mt-3">{error}</div>}

          {/* 🌤 Weather Display */}
          {weather && (
            <div className="weather-info fade-in mt-4 text-light">
              <div className="main-weather mb-4">
                <img
                  src={`https://openweathermap.org/img/wn/10d@4x.png`}
                  alt="weather icon"
                  className="weather-icon"
                />
                <h1 className="display-3 fw-bold">
                  {Math.round(weather.temperature)}°C
                </h1>
                <p className="lead text-capitalize">{weather.description}</p>
                <p className="fw-bold text-uppercase">{weather.city}</p>
                <p>Feels like: {weather.feelsLike}°C</p>
                <p>Humidity: {weather.humidity}%</p>
                <p>Wind Speed: {weather.windSpeed} m/s</p>
                <p>Date: {new Date(weather.date).toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* <Searchhistory/> */}
       <div className="app-container d-flex justify-content-center">
      <div className="card weather-cardhistory p-4 shadow-lg justify-content-center text-center">
        <h3 className="mb-4 fw-bold">🌦 Search History</h3>

        {loading && (
          <div className="spinner-border text-light mt-3" role="status"></div>
        )}

        {error && <div className="alert alert-danger mt-3">{error}</div>}

        {history.length > 0 ? (
          <ul className="list-group">
            {history.map((item) => (
              <li key={item._id} className="list-group-item d-flex justify-content-between align-items-center" >
                <div>
                  <strong>{item.city.toUpperCase()}</strong> —{" "}
                  {Math.round(item.temperature)}°C |{" "}
                  {new Date(item.date).toLocaleDateString()}
                </div>

                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item._id)} >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-secondary mt-4">No search history found.</p>
        )}
      </div>
    </div>
    </div>
    
  );
}

export default App;
