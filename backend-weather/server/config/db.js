const mongoose = require("mongoose")

mongoose.mongoose.connect("mongodb://127.0.0.1:27017/weather").then(() => {
    console.log("DB Connected");
}).catch((err) => {
    console.log("Error in db connection", err);
})



