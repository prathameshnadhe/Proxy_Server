const express = require("express");
const request = require("request");
const axios = require("axios");
const router = express.Router();

// Swiggy's Proxy endpoint for Restaurants
router.get("/restaurants", (req, res) => {
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

// Swiggy's Proxy endpoint to infinite scroll for Restaurants
router.get("/restaurantsUpdate", async (req, res) => {
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
        nextOffset: nextOffset,
        widgetOffset: {
          NewListingView_category_bar_chicletranking_TwoRows: "",
          NewListingView_category_bar_chicletranking_TwoRows_Rendition: "",
          Restaurant_Group_WebView_PB_Theme: "",
          Restaurant_Group_WebView_SEO_PB_Theme: "",
          collectionV5RestaurantListWidget_SimRestoRelevance_food_seo:
            collection,
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

// Swiggy's Proxy endpoint to fetch the menu for a specific Restaurant
router.get("/restaurant/:restaurantId", async (req, res) => {
  const { restaurantId } = req.params;
  const lat = "18.5162434";
  const lng = "73.8428574";

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

// Swiggy's Proxy endpoint to search the Restaurant/Menu
router.get("/restaurantSearch", async (req, res) => {
  const { str } = req.query;
  const lat = "18.5162434";
  const lng = "73.8428574";

  const swiggyUrl = `https://www.swiggy.com/dapi/restaurants/search/suggest?lat=${lat}&lng=${lng}&str=${str}&trackingId=undefined&includeIMItem=true`;

  const cookies =
    "_SW=3ey9qDDNkbrYJ79el6TiWoMYJ5k5ldek; _device_id=2f6f2f0f-11c1-fe31-e71c-922060a09607; fontsLoaded=1; _ot=REGULAR; _is_logged_in=1; _session_tid=9d61182ecee2bcb8bc891d496429df38dd0f9c172710cdc577403731f60ec425e3bac0bf0ec065668cef45c32332e7efe96d8dd4ed4788719b15232ba1f1fcb750254c1d9178e73aaacdf48d3404c0287bb2df48cad22701abc37d92a3b9248232ced0d92c0e38a1c50a26245a964f2f; deliveryAddressId=138114441; userLocation=%7B%22lat%22%3A%2218.523835%22%2C%22lng%22%3A%2273.826698%22%2C%22address%22%3A%22Gokhalenagar%2C%20Pune%2C%20Maharashtra%2C%20India%22%2C%22area%22%3A%22Gokhalenagar%22%2C%22id%22%3A%22138114441%22%2C%22showUserDefaultAddressHint%22%3Afalse%7D; _sid=ft986b19-c7a3-4726-b577-4b3bf71f4c5b";

  const options = {
    url: swiggyUrl,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      Accept: "application/json",
      Origin: "https://www.swiggy.com",
      Cookie: cookies,
    },
  };

  try {
    const response = await axios.get(swiggyUrl, { headers: options.headers });
    res.send(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error occurred while fetching restaurant menu");
  }
});

// Swiggy's Proxy endpoint to search the Restaurant/Menu
router.get("/allRestaurantSearch", async (req, res) => {
  const { str } = req.query;
  const lat = "18.5162434";
  const lng = "73.8428574";

  const swiggyUrl = `https://www.swiggy.com/dapi/restaurants/search/v3?lat=${lat}&lng=${lng}&str=${str}&trackingId=null&submitAction=DEFAULT_SUGGESTION&queryUniqueId=201adedd-aed3-9ed5-f929-e0a5049c1717&selectedPLTab=RESTAURANT`;

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
    console.error("Error fetching data:", error);
    res.status(500).send("Error occurred while fetching restaurant menu");
  }
});

// Swiggy's Proxy endpoint to search the Restaurant/Menu
router.get("/recommendedDishRestoList/:collectionId", async (req, res) => {
  const { collectionId } = req.params;
  const lat = "18.5162434";
  const lng = "73.8428574";

  console.log(collectionId);

  const swiggyUrl = `https://www.swiggy.com/dapi/restaurants/list/v5?lat=${lat}&lng=${lng}&collection=${collectionId}&sortBy=&filters=&type=rcv2&offset=0&page_type=null
`;

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
    console.error("Error fetching data:", error);
    res.status(500).send("Error occurred while fetching restaurant menu");
  }
});

module.exports = router;
