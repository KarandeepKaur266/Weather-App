const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const weatherModel = require('./server/apis/weather/weatherModel');
const dbConnect = require('./server/config/db');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.get('/weather/:city', async (req, res) => {
  try {
    const city = req.params.city.toLowerCase();

    const existingData = await weatherModel.findOne({ city });

    if (existingData) {
      console.log("Data get from database:", existingData);
      return res.json({
        success: true,
        message: 'Weather get successfully from DB!',
        data: existingData
      });
    }

    console.log("No data in DB, fetching from Cloud");

  
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );

    const data = {
      city: response.data.name.toLowerCase(), // ensure lowercase before saving
      temperature: response.data.main.temp,
      description: response.data.weather[0].description,
      windSpeed: response.data.wind.speed,
      humidity: response.data.main.humidity,
      feelsLike: response.data.main.feels_like,
      date: new Date()
    };

    // 3️⃣ Save to DB for next time
    const weatherObj = new weatherModel(data);
    await weatherObj.save();

    console.log("☁️ New data saved to database!");

    // 4️⃣ Send response to frontend
    res.json({
      success: true,
      message: 'Weather fetched successfully from API!',
      data
    });

  } catch (err) {
    console.error("❌ Error fetching weather:", err.response?.data || err.message);
    res.status(500).json({
      success: false,
      message: err.response?.data?.message || 'City not found or API error'
    });
  }
});

app.get('/searchhistory', async (req, res) => {
  try {
    const history = await weatherModel.find().sort({ createdAt: -1 }).limit(10);
    res.json({
      success: true,
      message: 'Search history fetched successfully!',
      data: history
    });
  } catch (err) {
    console.error("Error fetching search history:", err.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching search history'
    });
  }
});

app.delete('/weather/historydelete/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const deletedData = await weatherModel.findByIdAndDelete(id);

    if (!deletedData) {
      return res.status(404).json({
        success: false,
        message: 'No record found with that ID',
      });
    }

    console.log("Entry deleted from database:", deletedData);

    res.json({
      success: true,
      message: 'History deleted successfully!',
      data: deletedData,
    });
  } catch (err) {
    console.error("data deleted:", err.message);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting history',
      error: err.message,
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
