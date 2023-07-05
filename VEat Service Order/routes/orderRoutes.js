const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const orderController = require('../controllers/orderController');
const revocationMiddleware = require('../middleware/revocationMiddleware');

// CRUD Order
router.post('/order',revocationMiddleware.checkTokenRevocation,authMiddleware.authenticate, orderController.addOrder);
/**
 * @swagger
 * /order:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Add Order
 *     description: Add a new order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '../models/orderSchema.js'
 *     responses:
 *       201:
 *         description: Order created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '../models/orderSchema.js'
 */
router.get('/order',revocationMiddleware.checkTokenRevocation,authMiddleware.authenticate, orderController.getAllOrders);
/**
 * @swagger
 * /order:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get all orders
 *     description: Retrieve all orders
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '../models/orderSchema.js'
 */
router.get('/order/:uid',revocationMiddleware.checkTokenRevocation,authMiddleware.authenticate, orderController.getOrderByUid);
/**
 * @swagger
 * /order/{uid}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get order by uid
 *     description: Retrieve order by uid
 *     parameters:
 *       - in: path
 *         name: uid
 *         schema:
 *           type: string
 *         required: true
 *         description: The order uid
 *     responses:
 *       200:
 *         description: Order data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '../models/orderSchema.js'
 */
router.put('/order/:uid',revocationMiddleware.checkTokenRevocation,authMiddleware.authenticate, orderController.updateOrderByUid);
/**
 * @swagger
 * /order/{uid}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update order by uid
 *     description: Update order by uid
 *     parameters:
 *       - in: path
 *         name: uid
 *         schema:
 *           type: string
 *         required: true
 *         description: The order uid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '../models/orderSchema.js'
 *     responses:
 *       200:
 *         description: Order updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '../models/orderSchema.js'
 */
router.delete('/order/:uid',revocationMiddleware.checkTokenRevocation,authMiddleware.authenticate, orderController.deleteOrderByUid);
/**
 * @swagger
 * /order/{uid}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete order by uid
 *     description: Delete order by uid
 *     parameters:
 *       - in: path
 *         name: uid
 *         schema:
 *           type: string
 *         required: true
 *         description: The order uid
 *     responses:
 *       200:
 *         description: Order deleted
 */

// Get active order by user ID
router.get('/orders/active/:userId',revocationMiddleware.checkTokenRevocation,authMiddleware.authenticate, orderController.getActiveOrderByUserId);
/**
 * @swagger
 * /orders/active/{userId}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get active order by user id
 *     description: Retrieve active order by user id
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: Active order for the user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '../models/orderSchema.js'
 */

module.exports = router;
