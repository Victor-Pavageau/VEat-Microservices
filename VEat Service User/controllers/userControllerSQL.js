const User = require('../models/userSchemaSQL');
const bcrypt = require('bcrypt');
const axios = require('axios');
const Log = require('../middleware/logMiddleware');
const uuidv4 = require('uuid').v4;

const addUser = async (req, res) => {
    try {
        const {
            type,
            name,
            surname,
            password,
            fullAddress,
            phoneNumber,
            email,
            referedBy,
            hasRefered,
        } = req.body;
        
        const existingUser = await User.getUserByEmail(email);
        
        if (existingUser) {
            return res.status(200).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const pos = await axios.get(`http://api.positionstack.com/v1/forward?access_key=${process.env.ACCESS_KEY}&query=%22${fullAddress}%22`)

        const uid = uuidv4();
        const newUser = { 
            uid,
            type,
            name,
            surname,
            password: hashedPassword,
            longitude : pos.data.data[0].longitude,
            latitude : pos.data.data[0].latitude,
            fullAddress,
            phoneNumber,
            email,
            referedBy,
            hasRefered,
        };
        await User.createUser(newUser); 

        const response = {
            state: 'success',
            message: 'User registered successfully',
            user: newUser,
        };

        Log.log("info", `${response.message} ${newUser.uid}`)
        res.status(201).json(response);
    } catch (error) {
        const response = {
            state: 'error',
            message: 'Failed to regiter user',
            error: error.message,
          };
      
        Log.log("notice", `${response.message}`)
        res.status(404).json(response);
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers();

        const response = {
            state: 'success',
            message: 'All users retrieved successfully',
            users,
        };
      
        res.status(200).json(response);
    } catch (error) {
        const response = {
        state: 'error',
        message: 'Failed to retrieve users',
        error: error.message,
        };

        Log.log("notice", `${response.message}`)
        res.status(404).json(response);
    }
  };
  
const getUserByUid = async (req, res) => {
try {
    const { uid } = req.params;
    const user = await User.getUserByUid(uid);

    if (!user) {
        const response = {
            state: 'error',
            message: 'User not found',
        };

        res.status(200).json(response);
    } else {
        const response = {
            state: 'success',
            message: 'User retrieved successfully',
            user,
        };

        res.status(200).json(response);
    }
} catch (error) {
    const response = {
        state: 'error',
        message: 'Failed to retrieve user',
        error: error.message,
        };
    
        Log.log("notice", `${response.message} ${uid}`)
        res.status(200).json(response);
    }
};
  
const updateUserByUid = async (req, res) => {
    try {
        const { uid } = req.params;
        const updatedUser = req.body;

        if (updatedUser.fullAddress) {
            const pos = await axios.get(`http://api.positionstack.com/v1/forward?access_key=${process.env.ACCESS_KEY}&query=%22${updatedUser.fullAddress}%22`)
            updatedUser.latitude = pos.data.data[0].latitude;
            updatedUser.longitude = pos.data.data[0].longitude;
        }
        
        if (updatedUser.password) {
            const hashedPassword = await bcrypt.hash(updatedUser.password, 10);
            updatedUser.password = hashedPassword;
        }
        
        const user = await User.updateUserByUid(uid, updatedUser);

        if (!user) {
            const response = {
            state: 'error',
            message: 'User not found',
            };
    
            res.status(200).json(response);
        } else {
            const response = {
            state: 'success',
            message: 'User updated successfully',
            updatedUser,
            };
    
            Log.log("info", `${response.message} ${uid}`)
            res.status(200).json(response);
        }
    } catch (error) {
      const response = {
        state: 'error',
        message: 'Failed to update user',
        error: error.message,
      };
  
      //Log.log("notice", `${response.message} ${uid}`)
      res.status(404).json(response);
    }
};
  
const deleteUserByUid = async (req, res) => {
    try {
        const { uid } = req.params;
        const user = await User.deleteUserByUid(uid);

        if (!user) {
        const response = {
            state: 'error',
            message: 'User not found',
        };

        res.status(200).json(response);
        } else {
        const response = {
            state: 'success',
            message: 'User deleted successfully',
        };

        Log.log("info", `${response.message} ${uid}`)
        res.status(200).json(response);
        }
    } catch (error) {
        const response = {
        state: 'error',
        message: 'Failed to delete user',
        error: error.message,
        };

        Log.log("notice", `${response.message} ${uid}`)
        res.status(404).json(response);
    }
};

const getClosestDriver = async (req, res) => {
    try {
        const { latitude, longitude } = req.query;

        const closestDriver = await User.getUserByLocation(latitude, longitude);

        if (!closestDriver) {
        const response = {
            state: 'error',
            message: 'No driver found',
        };

        res.status(200).json(response);
        } else {
        const response = {
            state: 'success',
            message: 'Closest driver found',
            driver: closestDriver,
        };

        Log.log("info", `${response.message} ${latitude} ${longitude}`)
        res.status(200).json(response);
        }
    } catch (error) {
        const response = {
        state: 'error',
        message: 'Failed to find the closest driver',
        error: error.message,
        };

        Log.log("notice", `${response.message} ${latitude} ${longitude}`)
        res.status(200).json(response);
    }
};

const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const user = await User.getUserByEmail(email);
        
        if (!user) {
        const response = {
            state: 'error',
            message: 'User not found',
        };

        res.status(200).json(response);
        } else {
        const response = {
            state: 'success',
            message: 'User retrieved successfully',
            user,
        };

        res.status(200).json(response);
        }
    } catch (error) {
        const response = {
        state: 'error',
        message: 'Failed to retrieve user',
        error: error.message,
        };

        Log.log("notice", `${response.message} ${email}`)
        res.status(200).json(response);
    }
};
  
  module.exports = {
    addUser,
    getAllUsers,
    getUserByUid,
    updateUserByUid,
    deleteUserByUid,

    getClosestDriver,
    getUserByEmail
  };