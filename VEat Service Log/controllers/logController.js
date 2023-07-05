const Log = require('../models/logSchema');

const createLog = async (req, res) => {
  try {
    const log = req.body;

    if (log.level && log.message && log.service) {
      const logEntry = new Log({
        level: log.level,
        service: log.service,
        message: log.message
      });
      logEntry.save()
        .then(() => res.status(200).send())
    } else {
      res.status(400).send();
    }
  }
  catch (error) {
    const response = {
      state: 'error',
      message: 'Failed to create log',
      error: error.message,
    };
    res.status(500).json(response);
  }
};

const getLogs = async (req, res) => {
  try {
    const logs = await Log.find({});

    const response = {
      state: 'success',
      message: 'All logs retrieved successfully',
      logs
    };

    res.status(200).json(response);
  } catch (error) {
    const response = {
      state: 'error',
      message: 'Failed to retrieve logs',
      error: error.message
    };

    res.status(500).json(response);
  }
};

const getLogsByService = async (req, res) => {
  try {
    const serviceName = req.params.serviceName;
    const logs = await Log.find({ service: `${serviceName}` });

    const response = {
      state: 'success',
      message: 'All logs retrieved successfully',
      logs
    };

    res.status(200).json(response);
  } catch (error) {
    const response = {
      state: 'error',
      message: 'Failed to retrieve logs',
      error: error.message
    };

    res.status(500).json(response);
  }
};

module.exports = {
  createLog,
  getLogs,
  getLogsByService
};