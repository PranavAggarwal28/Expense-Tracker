import dbconnect from "./db/index.js";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

dbconnect()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGODB connection failed:", err);
  });
