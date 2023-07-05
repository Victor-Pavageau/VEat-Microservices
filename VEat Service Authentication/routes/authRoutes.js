const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const driverController = require('../controllers/driverController');
const restaurantController = require('../controllers/restaurantController');
const developerController = require('../controllers/developerController');
const commercialController = require('../controllers/commercialController');
const technicalController = require('../controllers/technicalController');

const redisController = require('../controllers/revokeController');

router.post('/login/client', clientController.login);
/**
 * @swagger
 * /login/client:
 *   post:
 *     summary: Login to client
 *     description: Login to client to get the JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/login'
 *     responses:
 *       201:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/login'
 */
router.post('/login/driver', driverController.login);
/**
 * @swagger
 * /login/driver:
 *   post:
 *     summary: Login to driver
 *     description: Login to driver to get the JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/login'
 *     responses:
 *       201:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/login'
 */
router.post('/login/restaurant', restaurantController.login);
/**
 * @swagger
 * /login/restaurant:
 *   post:
 *     summary: Login to restaurant
 *     description: Login to restaurant to get the JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/login'
 *     responses:
 *       201:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/login'
 */
router.post('/login/developer', developerController.login);
/**
 * @swagger
 * /login/developer:
 *   post:
 *     summary: Login to developer
 *     description: Login to developer to get the JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/login'
 *     responses:
 *       201:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/login'
 */
router.post('/login/commercial', commercialController.login);
/**
 * @swagger
 * /login/commercial:
 *   post:
 *     summary: Login to commercial
 *     description: Login to commercial to get the JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/login'
 *     responses:
 *       201:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/login'
 */
router.post('/login/technical', technicalController.login);
/**
 * @swagger
 * /login/technical:
 *   post:
 *     summary: Login to technical
 *     description: Login to technical to get the JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/login'
 *     responses:
 *       201:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/login'
 */

router.post('/logout', redisController.logout);
/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logout
 *     description: Logout from the account
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/logout'
 */

router.get('/check-revoked', async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const revoked = await redisController.isTokenRevoked(token);
    
        res.json({ revoked });
    } catch (error) {
    console.error('Error checking token revocation:', error.message);
    res.status(401).json({ message: 'Failed to check token revocation' });
    }
});
/**
 * @swagger
 * /check-revoked:
 *   get:
 *     summary: Check Token Revocation
 *     description: Checks whether the given bearer token has been revoked
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully checked token status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 revoked:
 *                   type: boolean
 *                   description: True if the token has been revoked, false otherwise
 *       401:
 *         description: Failed to check token revocation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */

module.exports = router;