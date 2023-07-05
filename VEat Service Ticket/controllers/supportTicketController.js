const SupportTicket = require('../models/supportTicketSchema');
const Log = require('../middleware/logMiddleware')
const uuidv4 = require('uuid').v4;

const addSupportTicket = async (req, res) => {
  try {
    const {
      content,
      category,
      clientID,
      orderID,
      files,
      status,
    } = req.body;

    const uid = uuidv4();
    
    const newSupportTicket = new SupportTicket({
      uid,
      content,
      category,
      clientID,
      orderID,
      files,
      status,
    });

    await newSupportTicket.save();

    const response = {
      state: 'success',
      message: 'Support ticket added successfully',
      supportTicket: newSupportTicket,
    };

    Log.log("info", `${response.message} ${newSupportTicket.uid}`)
    res.status(201).json(response);
  } catch (error) {
    const response = {
      state: 'error',
      message: 'Failed to add support ticket',
      error: error.message,
    };

    Log.log("notice", `${response.message}`)
    res.status(500).json(response);
  }
};

const getAllSupportTickets = async (req, res) => {
  try {
    const supportTickets = await SupportTicket.find({});

    const response = {
      state: 'success',
      message: 'All support tickets retrieved successfully',
      supportTickets,
    };

    res.status(200).json(response);
  } catch (error) {
    const response = {
      state: 'error',
      message: 'Failed to retrieve support tickets',
      error: error.message,
    };

    Log.log("notice", `${response.message}`)
    res.status(500).json(response);
  }
};
const getSupportTicketByUid = async (req, res) => {
  try {
    const { uid } = req.params;

    const supportTickets = await SupportTicket.findOne({ uid });

    if (!supportTickets) {
      const response = {
        state: 'error',
        message: 'SupportTicket not found',
      };

      res.status(404).json(response);
    } else {
      const response = {
        state: 'success',
        message: 'SupportTicket retrieved successfully',
        supportTickets,
      };

      res.status(200).json(response);
    }
  } catch (error) {
    const response = {
      state: 'error',
      message: 'Failed to retrieve supportTickets',
      error: error.message,
    };

    Log.log("notice", `${response.message} ${uid}`)
    res.status(500).json(response);
  }
};

// Update a specific supportTickets by UID
const updateSupportTicketByUid = async (req, res) => {
  try {
    const { uid } = req.params;
    const updatedSupportTicket = req.body;

    const supportTickets = await SupportTicket.findOneAndUpdate({ uid }, updatedSupportTicket, {
      new: true,
    });

    if (!supportTickets) {
      const response = {
        state: 'error',
        message: 'SupportTicket not found',
      };

      res.status(404).json(response);
    } else {
      const response = {
        state: 'success',
        message: 'SupportTicket updated successfully',
        supportTickets,
      };

      Log.log("info", `${response.message} ${uid}`)
      res.status(200).json(response);
    }
  } catch (error) {
    const response = {
      state: 'error',
      message: 'Failed to update supportTickets',
      error: error.message,
    };

    Log.log("notice", `${response.message} ${uid}`)
    res.status(500).json(response);
  }
};

// Delete a specific supportTickets by UID
const deleteSupportTicketByUid = async (req, res) => {
  try {
    const { uid } = req.params;

    const supportTickets = await SupportTicket.findOneAndDelete({ uid });

    if (!supportTickets) {
      const response = {
        state: 'error',
        message: 'SupportTicket not found',
      };

      res.status(404).json(response);
    } else {
      const response = {
        state: 'success',
        message: 'SupportTicket deleted successfully',
      };

      Log.log("info", `${response.message} ${uid}`)
      res.status(200).json(response);
    }
  } catch (error) {
    const response = {
      state: 'error',
      message: 'Failed to delete supportTickets',
      error: error.message,
    };

    Log.log("notice", `${response.message} ${uid}`)
    res.status(500).json(response);
  }
};

module.exports = {
  addSupportTicket,
  getAllSupportTickets,
  getSupportTicketByUid,
  updateSupportTicketByUid,
  deleteSupportTicketByUid,
};
