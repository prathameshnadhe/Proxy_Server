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

app.get("/restaurantsUpdate", async (req, res) => {
  const nextOffset = req.query.offset || "CJhlELQ4KICQ4IWS1ZmFNzCnEzgC";
  const collection = req.query.collection || "12";

  const apiUrl =
    "https://www.swiggy.com/dapi/restaurants/list/update?lat=18.5162434&lng=73.8428574&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING";

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "application/json",
        Origin: "https://www.swiggy.com",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lat: 18.5162434,
        lng: 73.8428574,
        nextOffset: nextOffset, // Pass the current offset
        widgetOffset: {
          NewListingView_category_bar_chicletranking_TwoRows: "",
          NewListingView_category_bar_chicletranking_TwoRows_Rendition: "",
          Restaurant_Group_WebView_PB_Theme: "",
          Restaurant_Group_WebView_SEO_PB_Theme: "",
          collectionV5RestaurantListWidget_SimRestoRelevance_food_seo:
            collection, // Use dynamic collection value
          inlineFacetFilter: "",
          restaurantCountWidget: "",
        },
        filters: {},
        seoParams: {
          apiName: "FoodHomePage",
          pageType: "FOOD_HOMEPAGE",
          seoUrl: "https://www.swiggy.com/",
        },
        page_type: "DESKTOP_WEB_LISTING",
        _csrf: "Wa4479CuNAHS-24Ynwws3k2hSsD6G6fhPXyFTBaM",
      }),
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .send("Error occurred: " + response.statusText);
    }

    const data = await response.json();
    res.send(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred while fetching data");
  }
});

// Endpoint to fetch the menu for a specific restaurant
app.get("/restaurant/:restaurantId", async (req, res) => {
  const { restaurantId } = req.params;
  const lat = "18.5162434"; // Replace with your latitude if needed
  const lng = "73.8428574"; // Replace with your longitude if needed

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
  console.log(`http://localhost:${PORT}`);
});
