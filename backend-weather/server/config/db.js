const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://karandeepkaur266:Karan99@cluster0.uvek08m.mongodb.net/weather").then(() => {
    console.log("DB Connected");
}).catch((err) => {
    console.log("Error in db connection", err);
})


