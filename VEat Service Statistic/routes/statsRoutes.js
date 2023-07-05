const express = require('express');
const router = express.Router();
const restaurantStatsController = require('../controllers/restaurantController');
const authMiddleware = require('../middleware/authMiddleware');
const revocationMiddleware = require('../middleware/revocationMiddleware');
const commercialStatsController = require('../controllers/commercialController')

// Get restaurant statistics for a specific restaurant
router.get('/restaurant/:restaurantId',revocationMiddleware.checkTokenRevocation,authMiddleware.authenticate, restaurantStatsController.getRestaurantStatistics);
/**
 * @swagger
 * /restaurant/{restaurantId}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get restaurant statistics for a specific restaurant
 *     description: Retrieve statistics for a specific restaurant
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         schema:
 *           type: string
 *         required: true
 *         description: The restaurant id
 *     responses:
 *       200:
 *         description: Restaurant statistics data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RestaurantStatistics'
 */

// Get sales statistics
router.get('/sales/:restaurantId',revocationMiddleware.checkTokenRevocation,authMiddleware.authenticate, restaurantStatsController.getSalesStatistics);
/**
 * @swagger
 * /sales/{restaurantId}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get sales statistics
 *     description: Retrieve sales statistics for a specific restaurant
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         schema:
 *           type: string
 *         required: true
 *         description: The restaurant id
 *     responses:
 *       200:
 *         description: Sales statistics data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SalesStatistics'
 */

// Get most ordered items
router.get('/most-ordered-items/:restaurantId',revocationMiddleware.checkTokenRevocation,authMiddleware.authenticate, restaurantStatsController.getMostOrderedItems);
/**
 * @swagger
 * /most-ordered-items/{restaurantId}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get most ordered items
 *     description: Retrieve most ordered items for a specific restaurant
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         schema:
 *           type: string
 *         required: true
 *         description: The restaurant id
 *     responses:
 *       200:
 *         description: Most ordered items data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MenuItem'
 */

// Get commercial statistics
router.get('/commercial', revocationMiddleware.checkTokenRevocation,authMiddleware.authenticate, commercialStatsController.getCommercialStatistics);
/**
 * @swagger
 * /commercial:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get commercial statistics
 *     description: Retrieve commercial statistics
 *     responses:
 *       200:
 *         description: Commercial statistics data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommercialStatistics'
 */

module.exports = router;