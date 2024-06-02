const express = require("express");
const request = require("request");
const app = express();
const axios = require("axios");
const PORT = process.env.PORT || 5000;

// Middleware to set CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Proxy endpoint
app.get("/restaurants", (req, res) => {
  const apiUrl =
    "https://www.swiggy.com/dapi/restaurants/list/v5?lat=18.5162434&lng=73.8428574&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING";

  const options = {
    url: apiUrl,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      Accept: "application/json",
      Origin: "https://www.swiggy.com",
    },
  };

  request(options, (error, response, body) => {
    if (error) {
      return res.status(500).send("Error occurred");
    }

    // If response status is not 200, forward the status and body
    if (response.statusCode !== 200) {
      return res.status(response.statusCode).send(body);
    }

    // Forward the response
    res.send(body);
  });
});

// Endpoint to fetch the menu for a specific restaurant
app.get("/restaurant/:restaurantId", async (req, res) => {
  const { restaurantId } = req.params;
  const lat = "18.5162434"; // Replace with actual latitude if needed
  const lng = "73.8428574"; // Replace with actual longitude if needed

  const swiggyUrl = `https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=${lat}&lng=${lng}&restaurantId=${restaurantId}&catalog_qa=undefined&submitAction=ENTER`;

  const options = {
    url: swiggyUrl,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      Accept: "application/json",
      Origin: "https://www.swiggy.com",
    },
  };

  try {
    const response = await axios.get(swiggyUrl, { headers: options.headers });
    res.send(response.data);
  } catch (error) {
    res.status(500).send("Error occurred while fetching restaurant menu");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
