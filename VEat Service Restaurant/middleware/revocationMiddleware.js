const axios = require('axios');

const checkTokenRevocation = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const response = await axios.get('http://auth-service:3999/check-revoked', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const { revoked } = response.data;

    if (revoked) {
      return res.status(201).json({ message: 'Token revoked' });
    }

    next();
  } catch (error) {
    res.status(201).json({ message: 'Unauthorized' });
  }
};

module.exports = { checkTokenRevocation };