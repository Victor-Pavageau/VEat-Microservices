const express = require('express');
const router = express.Router();
const userControllerSQL = require('../controllers/userControllerSQL');
const authMiddleware = require('../middleware/authMiddleware');
const revocationMiddleware = require('../middleware/revocationMiddleware');

router.post('/users', userControllerSQL.addUser);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Add a user
 *     description: Add a new user
 *     requestBody:
 *       description: User object
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */

router.get('/users',revocationMiddleware.checkTokenRevocation,authMiddleware.authenticate, userControllerSQL.getAllUsers);
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve all users
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

router.get('/users/:uid',revocationMiddleware.checkTokenRevocation,authMiddleware.authenticate, userControllerSQL.getUserByUid);
/**
 * @swagger
 * /users/{uid}:
 *   get:
 *     summary: Get a user by UID
 *     description: Retrieve a user by their UID
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: UID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */

router.put('/users/:uid', revocationMiddleware.checkTokenRevocation,authMiddleware.authenticate, userControllerSQL.updateUserByUid);
/**
 * @swagger
 * /users/{uid}:
 *   put:
 *     summary: Update a user by UID
 *     description: Update a user by their UID
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: UID of the user
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Updated user object
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */

router.delete('/users/:uid',revocationMiddleware.checkTokenRevocation,authMiddleware.authenticate, userControllerSQL.deleteUserByUid);
/**
 * @swagger
 * /users/{uid}:
 *   delete:
 *     summary: Delete a user by UID
 *     description: Delete a user by their UID
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: UID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 */


//Get Closest Driver (GET /users/driver/closest?latitude=0.000&longitude=0.000)
router.get('/users/driver/closest',revocationMiddleware.checkTokenRevocation,authMiddleware.authenticate, userControllerSQL.getClosestDriver);
/**
 * @swagger
 * /users/driver/closest:
 *   get:
 *     summary: Get the closest driver
 *     description: Retrieve the closest driver based on the given latitude and longitude
 *     parameter    s:
 *       - in: query
 *         name: latitude
 *         required: true
 *         description: Latitude of the current location
 *         schema:
 *           type: number
 *       - in: query
 *         name: longitude
 *         required: true
 *         description: Longitude of the current location
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Driver'
 */

router.get('/users/email/:email', userControllerSQL.getUserByEmail);


module.exports = router;

