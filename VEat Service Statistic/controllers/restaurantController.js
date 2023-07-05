const Log = require('../middleware/logMiddleware')
const axios = require('axios');


const getRestaurantStatistics = async (req, res) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const allOrdersResponse = await axios.get('http://order-service:4001/order', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const allOrders = allOrdersResponse.data.orders;

    const restaurantId = req.params.restaurantId;
    const restaurantOrders = allOrders.filter(order => order.restaurantId === restaurantId);

    const totalOrders = restaurantOrders.length;
    const activeOrders = restaurantOrders.filter(order => order.isApprovedByRestaurant && !order.isDelivered).length;

    const response = {
      state: 'success',
      message: 'Restaurant statistics retrieved successfully',
      statistics: {
        totalOrders,
        activeOrders,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    const response = {
      state: 'error',
      message: 'Failed to retrieve restaurant statistics',
      error: error.message,
    };

    res.status(200).json(response);
  }
};

const getSalesStatistics = async (req, res) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const allOrdersResponse = await axios.get('http://order-service:4001/order', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const allOrders = allOrdersResponse.data.orders;

    const restaurantId = req.params.restaurantId;
    const restaurantOrders = allOrders.filter(order => order.restaurantId === restaurantId);

    const totalSales = restaurantOrders.reduce((sum, order) => sum + order.price.totalPrice, 0);

    const salesPerDay = calculateSalesPerTime(restaurantOrders, 'day');
    const salesPerMonth = calculateSalesPerTime(restaurantOrders, 'month');

    const response = {
      state: 'success',
      message: 'Sales statistics retrieved successfully',
      statistics: {
        totalSales,
        salesPerDay,
        salesPerMonth,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    const response = {
      state: 'error',
      message: 'Failed to retrieve sales statistics',
      error: error.message,
    };

    res.status(200).json(response);
  }
};

const calculateSalesPerTime = (orders, timePeriod) => {
  const salesPerTime = {};

  for (const order of orders) {
    const formattedTime = formatTimePeriod(order.dates.orderTimestamp * 1000, timePeriod);

    if (!salesPerTime[formattedTime]) {
      salesPerTime[formattedTime] = 0;
    }

    salesPerTime[formattedTime] += order.price.totalPrice;
  }

  return salesPerTime;
};

const formatTimePeriod = (timestamp, timePeriod) => {
  const date = new Date(timestamp);

  if (timePeriod === 'day') {
    return date.toISOString().split('T')[0];
  } else if (timePeriod === 'month') {
    return `${date.getFullYear()}-${date.getMonth() + 1}`;
  }

  return null;
};

const getMostOrderedItems = async (req, res) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const allOrdersResponse = await axios.get('http://order-service:4001/order', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const allOrders = allOrdersResponse.data.orders;

    const restaurantId = req.params.restaurantId;
    const restaurantOrders = allOrders.filter(order => order.restaurantId === restaurantId);

    const itemCounts = {};

    for (const order of restaurantOrders) {
      for (const orderDetail of order.orderDetails) {
        const itemId = orderDetail.itemId;
        const itemType = orderDetail.itemType;

        if (!itemCounts[itemId]) {
          itemCounts[itemId] = {
            count: 0,
            type: itemType,
          };
        }

        itemCounts[itemId].count += orderDetail.quantity;
      }
    }

    const mostOrderedItems = Object.entries(itemCounts)
      .sort((a, b) => b[1].count - a[1].count)
      .map(([itemId, { count, type }]) => ({
        itemId,
        count,
        type,
      }));

    const response = {
      state: 'success',
      message: 'Most ordered items retrieved successfully',
      statistics: {
        mostOrderedItems,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    const response = {
      state: 'error',
      message: 'Failed to retrieve most ordered items',
      error: error.message,
    };

    res.status(200).json(response);
  }
};

module.exports = { getRestaurantStatistics, getSalesStatistics, getMostOrderedItems };
