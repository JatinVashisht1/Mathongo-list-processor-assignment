import "dotenv/config";
import app from "./src/app.js";
import mongoose from "mongoose";

const port = process.env.PORT ?? 5000;

// Connect to mongodb instance
mongoose.connect(process.env.DB_CONNECTION_STRING).then(() => {
  console.log("Connected to mongodb");

  // Start server only if connection to mongodb was successful
  app.listen(port, () => {
    console.log(`server up on http://localhost:${port}`);
  });
});
