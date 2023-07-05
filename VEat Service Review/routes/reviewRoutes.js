const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');
const revocationMiddleware = require('../middleware/revocationMiddleware');


router.post('/reviews',revocationMiddleware.checkTokenRevocation,authMiddleware.authenticate, reviewController.createReview);
/**
 * @swagger
 * /reviews:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create review
 *     description: Create a new review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '../models/reviewSchema.js'
 *     responses:
 *       201:
 *         description: Review created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '../models/reviewSchema.js'
 */
router.get('/reviews',revocationMiddleware.checkTokenRevocation,authMiddleware.authenticate, reviewController.getAllReviews);
/**
 * @swagger
 * /reviews:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get all reviews
 *     description: Retrieve all reviews
 *     responses:
 *       200:
 *         description: List of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 */
router.get('/reviews/:uid',revocationMiddleware.checkTokenRevocation,authMiddleware.authenticate, reviewController.getReviewByUid);
/**
 * @swagger
 * /reviews/{uid}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get review by uid
 *     description: Retrieve review by uid
 *     parameters:
 *       - in: path
 *         name: uid
 *         schema:
 *           type: string
 *         required: true
 *         description: The review uid
 *     responses:
 *       200:
 *         description: Review data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 */
router.put('/reviews/:uid',revocationMiddleware.checkTokenRevocation,authMiddleware.authenticate, reviewController.updateReviewByUid);
/**
 * @swagger
 * /reviews/{uid}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update review by uid
 *     description: Update review by uid
 *     parameters:
 *       - in: path
 *         name: uid
 *         schema:
 *           type: string
 *         required: true
 *         description: The review uid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       200:
 *         description: Review updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 */
router.delete('/reviews/:uid',revocationMiddleware.checkTokenRevocation,authMiddleware.authenticate, reviewController.deleteReviewByUid);
/**
 * @swagger
 * /reviews/{uid}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete review by uid
 *     description: Delete review by uid
 *     parameters:
 *       - in: path
 *         name: uid
 *         schema:
 *           type: string
 *         required: true
 *         description: The review uid
 *     responses:
 *       200:
 *         description: Review deleted
 */

//Get mean review by restaurant ID
router.get('/reviews/restaurants/:restaurantId',authMiddleware.authenticate, reviewController.getMeanReviewByRestaurant);
/**
 * @swagger
 * /reviews/restaurants/{restaurantId}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get mean review by restaurant ID
 *     description: Retrieve mean review by restaurant ID
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         schema:
 *           type: string
 *         required: true
 *         description: The restaurant id
 *     responses:
 *       200:
 *         description: Mean review data
 *         content:
 *           application/json:
 *             schema:
 *               type: number
 *               format: float
 *               description: Mean review
 */

module.exports = router;