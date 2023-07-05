const Order = require('../models/orderSchema');
const Log = require('../middleware/logMiddleware')
const uuidv4 = require('uuid').v4;
const axios = require('axios')

const addOrder = async (req, res) => {
  try {
    const {
      addresses,
      clientId,
      restaurantId,
      driverId,
      isApprovedByRestaurant,
      isApprovedByDriver,
      isDelivered,
      isHidden,
      price,
      dates,
      orderDetails,
    } = req.body;

    const uid = uuidv4();
    const pos_restaurant = await axios.get(`http://api.positionstack.com/v1/forward?access_key=${process.env.ACCESS_KEY}&query=%22${addresses.restaurantAddress}%22`)
    const pos_client = await axios.get(`http://api.positionstack.com/v1/forward?access_key=${process.env.ACCESS_KEY}&query=%22${addresses.clientAddress}%22`)

    const addressesData = {
      restaurantAddress: {
        longitude: pos_restaurant.data.data[0].longitude,
        latitude: pos_restaurant.data.data[0].latitude,
        fullAddress: addresses.restaurantAddress,
      },
      clientAddress: {
        longitude: pos_client.data.data[0].longitude,
        latitude: pos_client.data.data[0].latitude,
        fullAddress: addresses.clientAddress,
      },
    };

    const newOrder = new Order({
      uid,
      addresses : addressesData,
      clientId,
      restaurantId,
      driverId,
      isApprovedByRestaurant,
      isApprovedByDriver,
      isDelivered,
      isHidden,
      price,
      dates,
      orderDetails,
    });

    await newOrder.save();

    const response = {
      state: 'success',
      message: 'Order added successfully',
      order: newOrder,
    };

    Log.log("info", `${response.message} ${newOrder.uid}`)
    await axios.post(`http://websocket-service:4005/send-message/${newOrder.restaurantId}`, JSON.stringify(newOrder))
    .catch(function (error) {
      axios.post(`http://websocket-service:4005/send-message/${newOrder.clientId}`, `Could not send order to ${newOrder.restaurantId} ${error}`)
    });

    res.status(201).json(response);


  } catch (error) {
    const response = {
      state: 'error',
      message: 'Failed to add order',
      error: error.message,
    };

    Log.log("info", `${response.message}`)
    res.status(500).json(response);
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({});

    const response = {
      state: 'success',
      message: 'All orders retrieved successfully',
      orders,
    };

    res.status(200).json(response);
  } catch (error) {
    const response = {
      state: 'error',
      message: 'Failed to retrieve orders',
      error: error.message,
    };

    Log.log("notice", `${response.message}`)
    res.status(500).json(response);
  }
};

const getOrderByUid = async (req, res) => {
  try {
    const { uid } = req.params;

    const order = await Order.findOne({uid});

    if (!order) {
      const response = {
        state: 'error',
        message: 'Order not found',
      };

      res.status(404).json(response);
    } else {
      const response = {
        state: 'success',
        message: 'Order retrieved successfully',
        order,
      };

      res.status(200).json(response);
    }
  } catch (error) {
    const response = {
      state: 'error',
      message: 'Failed to retrieve order',
      error: error.message,
    };

    Log.log("notice", `${response.message}`)
    res.status(500).json(response);
  }
};

// Update a specific order by UID
const updateOrderByUid = async (req, res) => {
  try {
    const { uid } = req.params;
    const updatedOrder = req.body;

    if (updatedOrder.addresses) {
      const pos_restaurant = await axios.get(`http://api.positionstack.com/v1/forward?access_key=${process.env.ACCESS_KEY}&query=%22${updatedOrder.addresses.restaurantAddress}%22`)
      const pos_client = await axios.get(`http://api.positionstack.com/v1/forward?access_key=${process.env.ACCESS_KEY}&query=%22${updatedOrder.addresses.clientAddress}%22`)
      updatedOrder.addresses.restaurantAddress.latitude = pos_restaurant.data.data[0].latitude;
      updatedOrder.addresses.restaurantAddress.longitude = pos_restaurant.data.data[0].longitude;
      updatedOrder.addresses.restaurantAddress.fullAddress = updatedOrder.addresses.restaurantAddress
      delete updatedOrder.addresses.restaurantAddress.fullAddress

      updatedOrder.addresses.clientAddress.latitude = pos_client.data.data[0].latitude;
      updatedOrder.addresses.clientAddress.longitude = pos_client.data.data[0].longitude;
      updatedOrder.addresses.clientAddress.fullAddress = updatedOrder.addresses.clientAddress
      delete updatedOrder.addresses.clientAddress.fullAddress
    }

    const orderBefore = await Order.findOne({ uid });

    // Order approved by restaurant
    if(!orderBefore.isApprovedByRestaurant && updatedOrder.isApprovedByRestaurant){
      const driverId = await axios.get(`http://user-service/users/driver/closest?latitude=${order.addresses.restaurantAddress.latitude}&longitude=${order.addresses.restaurantAddress.longitude}`)
      await axios.post(`http://websocket-service:4005/send-message/${driverId}`, JSON.stringify(newOrder))
      .catch(function (error) {
        axios.post(`http://websocket-service:4005/send-message/${orderBefore.clientId}`, `Could not send order to ${driverID} ${error}`)
      });
      updatedOrder.driverId = driverId;
    }


    const order = await Order.findOneAndUpdate({ uid }, updatedOrder, {
      new: true,
    });

    // Order approved by driver
    if(!orderBefore.isApprovedByDriver && updatedOrder.isApprovedByDriver) {
      await axios.post(`http://websocket-service:4005/send-message/${orderBefore.clientId}`, JSON.stringify(order))
      .catch(function (error) {
        axios.post(`http://websocket-service:4005/send-message/${order.driverId}`, `Could not send order to ${orderBefore.clientId} ${error}`)
      });
    }

    if (!order) {
      const response = {
        state: 'error',
        message: 'Order not found',
      };

      res.status(404).json(response);
    } else {
      const response = {
        state: 'success',
        message: 'Order updated successfully',
        order,
      };

      

      Log.log("info", `${response.message} ${uid}`)
      res.status(200).json(response);
    }
  } catch (error) {
    const response = {
      state: 'error',
      message: 'Failed to update order',
      error: error.message,
    };

    Log.log("notice", `${response.message} ${uid}`)
    res.status(500).json(response);
  }
};

// Delete a specific order by UID
const deleteOrderByUid = async (req, res) => {
  try {
    const { uid } = req.params;

    const order = await Order.findOneAndDelete({ uid });

    if (!order) {
      const response = {
        state: 'error',
        message: 'Order not found',
      };

      res.status(404).json(response);
    } else {
      const response = {
        state: 'success',
        message: 'Order deleted successfully',
      };

      Log.log("info", `${response.message} ${uid}`)
      res.status(200).json(response);
    }
  } catch (error) {
    const response = {
      state: 'error',
      message: 'Failed to delete order',
      error: error.message,
    };

    Log.log("notice", `${response.message} ${uid}`)
    res.status(500).json(response);
  }
};

const getActiveOrderByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const order = await Order.findOne({
      clientId: userId,
      isDelivered: false,
    });

    if (!order) {
      const response = {
        state: 'error',
        message: 'Active order not found',
      };

      res.status(404).json(response);
    } else {
      const response = {
        state: 'success',
        message: 'Active order retrieved successfully',
        order,
      };

      res.status(200).json(response);
    }
  } catch (error) {
    const response = {
      state: 'error',
      message: 'Failed to retrieve active order',
      error: error.message,
    };

    Log.log("notice", `${response.message}`)
    res.status(500).json(response);
  }
};

module.exports = { addOrder, getAllOrders, getOrderByUid, updateOrderByUid ,deleteOrderByUid, getActiveOrderByUserId  };
