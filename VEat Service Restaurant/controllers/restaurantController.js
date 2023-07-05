const Restaurant = require('../models/restaurantSchema');
const Log = require('../middleware/logMiddleware');
const axios = require('axios');
const uuidv4 = require('uuid').v4;

const addRestaurant = async (req, res) => {
  try {
    const {
      restaurantOwnerId,
      restaurantName,
      address,
      tags,
      logo,
      photos,
      menus,
      articles,
      schedule,
    } = req.body;

    const uid = uuidv4();
    const pos = await axios.get(`http://api.positionstack.com/v1/forward?access_key=${process.env.ACCESS_KEY}&query=%22${address}%22`)

    const newRestaurant = new Restaurant({
      uid,
      restaurantOwnerId,
      restaurantName,
      address: {longitude : pos.data.data[0].longitude, latitude : pos.data.data[0].latitude, fullAddress : address},
      tags,
      logo,
      photos,
      menus,
      articles,
      schedule,
    });

    await newRestaurant.save();

    const response = {
      state: 'success',
      message: 'Restaurant added successfully',
      restaurant: newRestaurant,
    };

    Log.log("info", `${response.message} ${newRestaurant.uid}`)
    res.status(201).json(response);
  } catch (error) {
    const response = {
      state: 'error',
      message: 'Failed to add restaurant',
      error: error.message,
    };

    res.status(200).json(response);
  }
};

const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({});

    const response = {
      state: 'success',
      message: 'All restaurants retrieved successfully',
      restaurants,
    };

    res.status(200).json(response);
  } catch (error) {
    const response = {
      state: 'error',
      message: 'Failed to retrieve restaurants',
      error: error.message,
    };
    
    Log.log("error", response.message)
    res.status(200).json(response);
  }
};

const getRestaurantByUid = async (req, res) => {
  try {
    const { uid } = req.params;

    const restaurant = await Restaurant.findOne({ uid });

    if (!restaurant) {
      const response = {
        state: 'error',
        message: 'Restaurant not found',
      };

      res.status(200).json(response);
    } else {
      const response = {
        state: 'success',
        message: 'Restaurant retrieved successfully',
        restaurant,
      };

      res.status(200).json(response);
    }
  } catch (error) {
    const response = {
      state: 'error',
      message: 'Failed to retrieve restaurant',
      error: error.message,
    };

    Log.log("error", `${response.message} ${uid}`)
    res.status(200).json(response);
  }
};

// Update a specific restaurant by UID
const updateRestaurantByUid = async (req, res) => {
  try {
    const { uid } = req.params;
    const updatedRestaurant = req.body;

    if (updatedRestaurant.address) {
      const pos = await axios.get(`http://api.positionstack.com/v1/forward?access_key=${process.env.ACCESS_KEY}&query=%22${updatedRestaurant.address}%22`)
      updatedRestaurant.latitude = pos.data.data[0].latitude;
      updatedRestaurant.longitude = pos.data.data[0].longitude;
      updatedRestaurant.fullAddress = updatedRestaurant.address;
      delete updatedRestaurant.address;
    }

    const restaurant = await Restaurant.findOneAndUpdate({ uid }, updatedRestaurant, {
      new: true,
    });

    if (!restaurant) {
      const response = {
        state: 'error',
        message: 'Restaurant not found',
      };

      res.status(200).json(response);
    } else {
      const response = {
        state: 'success',
        message: 'Restaurant updated successfully',
        restaurant,
      };

      Log.log("info", `${response.message} ${uid}`)
      res.status(200).json(response);
    }
  } catch (error) {
    const response = {
      state: 'error',
      message: 'Failed to update restaurant',
      error: error.message,
    };

    res.status(200).json(response);
  }
};

// Delete a specific restaurant by UID
const deleteRestaurantByUid = async (req, res) => {
  try {
    const { uid } = req.params;

    const restaurant = await Restaurant.findOneAndDelete({ uid });

    if (!restaurant) {
      const response = {
        state: 'error',
        message: 'Restaurant not found',
      };

      res.status(200).json(response);
    } else {
      const response = {
        state: 'success',
        message: 'Restaurant deleted successfully',
      };

      Log.log("info", `${response.message} ${newRestaurant.uid}`)
      res.status(200).json(response);
    }
  } catch (error) {
    const response = {
      state: 'error',
      message: 'Failed to delete restaurant',
      error: error.message,
    };

    Log.log("notice", `${response.message} ${newRestaurant.uid}`)
    res.status(200).json(response);
  }
};


const getRestaurantsInRadius = async (req, res) => {
  try {
    const { latitude, longitude, radius } = req.query;

    const restaurants = await Restaurant.find({
      address: {
        $geoWithin: {
          $centerSphere: [[parseFloat(longitude), parseFloat(latitude)], parseFloat(radius) / 6371]
        }
      }
    });

    const response = {
      state: 'success',
      message: 'Restaurants retrieved successfully',
      restaurants,
    };

    res.status(200).json(response);
  } catch (error) {
    const response = {
      state: 'error',
      message: 'Failed to retrieve restaurants',
      error: error.message,
    };

    Log.log("notice", `${response.message}`)
    res.status(200).json(response);
  }
};

const getOpenRestaurantsInRadius = async (req, res) => {
  try {
    const { latitude, longitude, radius, dayOfWeek, time } = req.query;
    const currentDay = dayOfWeek.toLowerCase().slice(0, 3);
    const currentTime = new Date(`1970-01-01T${time}:00`);

    const restaurants = await Restaurant.find({
      address: {
        $geoWithin: {
          $centerSphere: [[parseFloat(longitude), parseFloat(latitude)], parseFloat(radius) / 6371]
        }
      },
      'schedule.day': currentDay,
      'schedule.timeSpan': { $elemMatch: { openTime: { $lt: currentTime }, closureTime: { $gt: currentTime } } }
    });

    const response = {
      state: 'success',
      message: 'Open restaurants in radius retrieved successfully',
      restaurants,
    };

    res.status(200).json(response);
  } catch (error) {
    const response = {
      state: 'error',
      message: 'Failed to retrieve open restaurants in radius',
      error: error.message,
    };

    Log.log("notice", `${response.message}`)
    res.status(200).json(response);
  }
};


const getMenuById = async (req, res) => {
  try {
    const { uid } = req.params;

    const restaurant = await Restaurant.findOne({ 'menus.uid': uid }, { 'menus.$': 1 });

    if (!restaurant || !restaurant.menus || restaurant.menus.length === 0) {
      const response = {
        state: 'error',
        message: 'Menu not found',
      };

      res.status(200).json(response);
    } else {
      const menu = restaurant.menus[0];
      const response = {
        state: 'success',
        message: 'Menu retrieved successfully',
        menu,
      };

      res.status(200).json(response);
    }
  } catch (error) {
    const response = {
      state: 'error',
      message: 'Failed to retrieve menu',
      error: error.message,
    };

    Log.log("notice", `${response.message}`)
    res.status(200).json(response);
  }
};

const getArticleById = async (req, res) => {
  try {
    const { uid } = req.params;

    const restaurant = await Restaurant.findOne({ 'articles.uid': uid }, { 'articles.$': 1 });

    if (!restaurant || !restaurant.articles || restaurant.articles.length === 0) {
      const response = {
        state: 'error',
        message: 'Article not found',
      };

      res.status(200).json(response);
    } else {
      const article = restaurant.articles[0];
      const response = {
        state: 'success',
        message: 'Article retrieved successfully',
        article,
      };

      res.status(200).json(response);
    }
  } catch (error) {
    const response = {
      state: 'error',
      message: 'Failed to retrieve article',
      error: error.message,
    };

    Log.log("notice", `${response.message}`)
    res.status(200).json(response);
  }
};

const addArticleByIdMenu = async (req, res) => {
  try {
    const { uid } = req.params;
    const { article } = req.body;

    const restaurant = await Restaurant.findOneAndUpdate(
      { 'menus.uid': uid },
      { $push: { 'menus.$.articles': article } },
      { new: true }
    );

    if (!restaurant || !restaurant.menus || restaurant.menus.length === 0) {
      const response = {
        state: 'error',
        message: 'Menu not found',
      };

      res.status(200).json(response);
    } else {
      const updatedMenu = restaurant.menus.find((menu) => menu.uid.toString() === uid);
      const response = {
        state: 'success',
        message: 'Article added to menu successfully',
        menu: updatedMenu,
      };

      Log.log("info", `${response.message} ${uid}`)
      res.status(200).json(response);
    }
  } catch (error) {
    const response = {
      state: 'error',
      message: 'Failed to add article to menu',
      error: error.message,
    };

    Log.log("notice", `${response.message} ${newRestaurant.uid}`)
    res.status(200).json(response);
  }
};

const addArticleByIdRestaurant = async (req, res) => {
  try {
    const { uid } = req.params;
    const { article } = req.body;

    const restaurant = await Restaurant.findByIdAndUpdate(
      uid,
      { $push: { articles: article } },
      { new: true }
    );

    if (!restaurant) {
      const response = {
        state: 'error',
        message: 'Restaurant not found',
      };

      res.status(200).json(response);
    } else {
      const response = {
        state: 'success',
        message: 'Article added to restaurant successfully',
        restaurant,
      };

      res.status(200).json(response);
    }
  } catch (error) {
    const response = {
      state: 'error',
      message: 'Failed to add article to restaurant',
      error: error.message,
    };

    Log.log("notice", `${response.message} ${uid}`)
    res.status(200).json(response);
  }
};

const addMenuByIdRestaurant = async (req, res) => {
  try {
    const { uid } = req.params;
    const { menu } = req.body;

    const restaurant = await Restaurant.findByIdAndUpdate(
      uid,
      { $push: { menus: menu } },
      { new: true }
    );

    if (!restaurant) {
      const response = {
        state: 'error',
        message: 'Restaurant not found',
      };

      res.status(200).json(response);
    } else {
      const response = {
        state: 'success',
        message: 'Menu added to restaurant successfully',
        restaurant,
      };

      res.status(200).json(response);
    }
  } catch (error) {
    const response = {
      state: 'error',
      message: 'Failed to add menu to restaurant',
      error: error.message,
    };

    Log.log("notice", `${response.message} ${newRestaurant.uid}`)
    res.status(200).json(response);
  }
};


const getRestaurantByOwnerId = async (req, res) => {
  try {
    const { ownerId } = req.params;

    // Find the restaurant by owner ID
    const restaurant = await Restaurant.findOne({ restaurantOwnerId: ownerId });

    if (!restaurant) {
      const response = {
        state: 'error',
        message: 'Restaurant not found',
      };

      res.status(200).json(response);
    } else {
      const response = {
        state: 'success',
        message: 'Restaurant retrieved successfully',
        restaurant,
      };

      res.status(200).json(response);
    }
  } catch (error) {
    const response = {
      state: 'error',
      message: 'Failed to retrieve restaurant',
      error: error.message,
    };

    Log.log("notice", `${response.message} ${ownerId}`)
    res.status(200).json(response);
  }
};

const getArticleByMenuUid = async (req, res) => {
  try {
    const { menuUid } = req.params;

    const restaurant = await Restaurant.findOne({ 'menus.uid': menuUid });

    if (!restaurant) {
      const response = {
        state: 'error',
        message: 'Restaurant or menu not found',
      };

      res.status(202).json(response);
    } else {
      const menu = restaurant.menus.find((menu) => menu.uid === menuUid);

      const response = {
        state: 'success',
        message: 'Article retrieved successfully',
        article: menu.articles,
      };

      res.status(200).json(response);
    }
  } catch (error) {
    const response = {
      state: 'error',
      message: 'Failed to retrieve article',
      error: error.message,
    };

    Log.log("notice", `${response.message} ${menuUid}`)
    res.status(202).json(response);
  }
};

module.exports = { 
  addRestaurant, 
  getAllRestaurants, 
  getRestaurantByUid, 
  updateRestaurantByUid ,
  deleteRestaurantByUid, 
  getRestaurantsInRadius, 
  getOpenRestaurantsInRadius, 
  getMenuById,
  getArticleById,
  addArticleByIdMenu,
  addArticleByIdRestaurant,
  addMenuByIdRestaurant,
  getRestaurantByOwnerId,
  getArticleByMenuUid
};