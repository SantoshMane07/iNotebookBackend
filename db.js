const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path:__dirname+'/config.env'});
//MONGO_URI = "mongodb://127.0.0.1/inotebook";
const MONGO_URI = process.env.DB;
const connectToMongo = async () => {
    try {
      let result = await mongoose.connect(MONGO_URI);
      console.log("Connected to mongo successfully");
    } catch (error) {
      console.log(error);
      process.exit();
    }
  };

module.exports = connectToMongo;