const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const authMiddleware = require('../middleware/authMiddleware');
const revocationMiddleware = require('../middleware/revocationMiddleware');


router.get('/restaurants', restaurantController.getAllRestaurants);
/**
 * @swagger
 * /restaurants:
 *   get:
 *     summary: Get all restaurants
 *     description: Retrieve a list of all restaurants
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '../models/restaurantSchema'
 */

router.post('/restaurants',revocationMiddleware.checkTokenRevocation,authMiddleware.authenticate, restaurantController.addRestaurant);
/**
 * @swagger
 * /restaurants:
 *   post:
 *     summary: Add a new restaurant
 *     description: Add a new restaurant to the database
 *     requestBody:
 *       description: Restaurant object
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '../models/restaurantSchema'
 *     responses:
 *       201:
 *         description: Restaurant created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '../models/restaurantSchema'
 */
router.get('/restaurants/:uid', restaurantController.getRestaurantByUid);
/**
 * @swagger
 * /restaurants/{uid}:
 *   get:
 *     summary: Get a restaurant by UID
 *     description: Retrieve a restaurant by its UID
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: UID of the restaurant
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '../models/restaurantSchema'
 */
router.put('/restaurants/:uid',revocationMiddleware.checkTokenRevocation,authMiddleware.authenticate, restaurantController.updateRestaurantByUid);
/**
 * @swagger
 * /restaurants/{uid}:
 *   put:
 *     summary: Update a restaurant by UID
 *     description: Update a restaurant by its UID
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: UID of the restaurant
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Updated restaurant object
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '../models/restaurantSchema'
 *     responses:
 *       200:
 *         description: Restaurant updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '../models/restaurantSchema'
 */
router.delete('/restaurants/:uid',revocationMiddleware.checkTokenRevocation,authMiddleware.authenticate, restaurantController.deleteRestaurantByUid);
/**
 * @swagger
 * /restaurants/{uid}:
 *   delete:
 *     summary: Delete a restaurant by UID
 *     description: Delete a restaurant by its UID
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: UID of the restaurant
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Restaurant deleted successfully
 */

// Get restaurants within a radius (GET /restaurants/radius?latitude={latitude}&longitude={longitude}&radius={radius})
router.get('/restaurants/radius',revocationMiddleware.checkTokenRevocation,authMiddleware.authenticate, restaurantController.getRestaurantsInRadius);
/**
 * @swagger
 * /restaurants/radius:
 *   get:
 *     summary: Get restaurants within a radius
 *     description: Retrieve restaurants within a given radius from a specific location
 *     parameters:
 *       - in: query
 *         name: latitude
 *         required: true
 *         description: Latitude of the center location
 *         schema:
 *           type: number
 *       - in: query
 *         name: longitude
 *         required: true
 *         description: Longitude of the center location
 *         schema:
 *           type: number
 *       - in: query
 *         name: radius
 *         required: true
 *         description: Radius in meters
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '../models/restaurantSchema'
 */
// Get restaurants within a radius (GET /restaurants/open?latitude={latitude}&longitude={longitude}&radius={radius}&dayOfWeek={dayOfWeek}&time={time})
router.get('/restaurants/open',revocationMiddleware.checkTokenRevocation,authMiddleware.authenticate, restaurantController.getOpenRestaurantsInRadius);

/**
 * @swagger
 * /restaurants/open:
 *   get:
 *     summary: Get open restaurants within a radius
 *     description: Retrieve open restaurants within a given radius from a specific location and time
 *     parameters:
 *       - in: query
 *         name: latitude
 *         required: true
 *         description: Latitude of the center location
 *         schema:
 *           type: number
 *       - in: query
 *         name: longitude
 *         required: true
 *         description: Longitude of the center location
 *         schema:
 *           type: number
 *       - in: query
 *         name: radius
 *         required: true
 *         description: Radius in meters
 *         schema:
 *           type: number
 *       - in: query
 *         name: dayOfWeek
 *         required: true
 *         description: Day of the week (e.g., Monday, Tuesday, etc.)
 *         schema:
 *           type: string
 *       - in: query
 *         name: time
 *         required: true
 *         description: Time in the format HH:mm (e.g., 10:30)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '../models/restaurantSchema'
 */


// Get menu by ID
router.get('/restaurants/menu/:uid', restaurantController.getMenuById);
/**
 * @swagger
 * /restaurants/menu/{uid}:
 *    get:
 *     summary: Get menu by UID
 *     description: Retrieve a menu by its UID
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: UID of the restaurant
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '../models/restaurantSchema'
 */

// Get article by ID
router.get('/restaurants/article/:uid', restaurantController.getArticleById);
/**
 * @swagger
 * /restaurants/article/{uid}:
 *    get:
 *     summary: Get article by UID
 *     description: Retrieve an article by its UID
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: UID of the restaurant
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '../models/restaurantSchema'
 */

// Get a specific restaurant by owner ID
router.get('/restaurants/owner/:ownerId',revocationMiddleware.checkTokenRevocation,authMiddleware.authenticate, restaurantController.getRestaurantByOwnerId);
/**
 * @swagger
 * /restaurants/owner/{ownerId}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a specific restaurant by owner ID
 *     description: Retrieve a specific restaurant by owner ID
 *     parameters:
 *       - in: path
 *         name: ownerId
 *         schema:
 *           type: string
 *         required: true
 *         description: The owner id
 *     responses:
 *       200:
 *         description: Restaurant data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '../models/restaurantSchema'
 */

// Get an article by menu UID
router.get('/restaurants/menu/:menuUid/article', restaurantController.getArticleByMenuUid);
/**
 * @swagger
 * /restaurants/menu/{menuUid}/article:
 *   get:
 *     summary: Get an article by menu UID
 *     description: Retrieve an article by menu UID
 *     parameters:
 *       - in: path
 *         name: menuUid
 *         schema:
 *           type: string
 *         required: true
 *         description: The menu UID
 *     responses:
 *       200:
 *         description: Article data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '../models/restaurantSchema'
 */

module.exports = router;
