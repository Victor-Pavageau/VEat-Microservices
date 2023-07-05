const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const authMiddleware = require('../middleware/authMiddleware');
const revocationMiddleware = require('../middleware/revocationMiddleware');

router.post('/logs', logController.createLog);
/**
 * @swagger
 * /logs:
 *   post:
 *     summary: Create Log
 *     description: Create a new log
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Log'
 *     responses:
 *       201:
 *         description: Log created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Log'
 */
router.get('/logs', revocationMiddleware.checkTokenRevocation,authMiddleware.authenticate,logController.getLogs);
/**
 * @swagger
 * /logs:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get all logs
 *     description: Retrieve all logs
 *     responses:
 *       200:
 *         description: List of logs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Log'
 */
router.get('/logs/:serviceName',revocationMiddleware.checkTokenRevocation,authMiddleware.authenticate, logController.getLogsByService);
/**
 * @swagger
 * /logs:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get all logs
 *     description: Retrieve all logs
 *     responses:
 *       200:
 *         description: List of logs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Log'
 */

module.exports = router;