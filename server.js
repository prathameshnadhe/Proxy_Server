const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

// Import the routes from the separate file
const swiggyRoutes = require("./swiggyRoutes");

// Middleware to set CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Use the routes from the swiggyRoutes file
app.use("/", swiggyRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
