const express = require('express');
const router = express.Router();
const supportTicketController = require('../controllers/supportTicketController');
const authMiddleware = require('../middleware/authMiddleware');
const revocationMiddleware = require('../middleware/revocationMiddleware');

// Route: POST /support-tickets
router.post('/tickets',revocationMiddleware.checkTokenRevocation,authMiddleware.authenticate, supportTicketController.addSupportTicket);
/**
 * @swagger
 * /tickets:
 *   post:
 *     summary: Add a support ticket
 *     description: Create a new support ticket
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SupportTicket'
 *     responses:
 *       201:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupportTicket'
 */

// Route: GET /tickets
router.get('/tickets',revocationMiddleware.checkTokenRevocation,authMiddleware.authenticate, supportTicketController.getAllSupportTickets);
/**
 * @swagger
 * /tickets:
 *   get:
 *     summary: Get all support tickets
 *     description: Retrieve all support tickets
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SupportTicket'
 */

// Route: GET /tickets/:id
router.get('/tickets/:uid', revocationMiddleware.checkTokenRevocation,authMiddleware.authenticate, supportTicketController.getSupportTicketByUid);
/**
 * @swagger
 * /tickets/{uid}:
 *   get:
 *     summary: Get a support ticket by UID
 *     description: Retrieve a support ticket based on the UID
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: UID of the support ticket to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupportTicket'
 */

// Route: PUT /tickets/:uid
router.put('/tickets/:uid',revocationMiddleware.checkTokenRevocation,authMiddleware.authenticate, supportTicketController.updateSupportTicketByUid);
/**
 * @swagger
 * /tickets/{uid}:
 *   put:
 *     summary: Update a support ticket by UID
 *     description: Update an existing support ticket based on the UID
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: UID of the support ticket to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SupportTicket'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupportTicket'
 */

// Route: DELETE /tickets/:uid
router.delete('/tickets/:uid',revocationMiddleware.checkTokenRevocation,authMiddleware.authenticate, supportTicketController.deleteSupportTicketByUid);
/**
 * @swagger
 * /tickets/{uid}:
 *   delete:
 *     summary: Delete a support ticket by UID
 *     description: Delete a support ticket based on the UID
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: UID of the support ticket to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
module.exports = router;
