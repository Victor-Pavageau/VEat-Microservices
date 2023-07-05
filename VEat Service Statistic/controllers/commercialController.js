const axios = require('axios');

const getCommercialStatistics = async (req, res) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const allOrdersResponse = await axios.get('http://order-service:4001/order', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const allOrders = allOrdersResponse.data.orders;

    const orderCounts = {
      orderNotApproved: 0,
      orderPlaced: 0,
      orderAccepted: 0,
      deliveryAccepted: 0,
      deliveryAcknowledged: 0,
    };

    for (const order of allOrders) {
      if (!order.isHidden) {
        if (!order.isApprovedByRestaurant){
          orderCounts.orderNotApproved++;
        } else if (order.isApprovedByRestaurant && !order.isApprovedByDriver && !order.isDelivered) {
          orderCounts.orderPlaced++;
        } else if (order.isApprovedByRestaurant && order.isApprovedByDriver && !order.isDelivered) {
          orderCounts.orderAccepted++;
        } else if (order.isApprovedByRestaurant && order.isApprovedByDriver && order.isDelivered) {
          orderCounts.deliveryAccepted++;
        } else if (order.isApprovedByRestaurant && order.isApprovedByDriver && order.isDelivered && !order.isHidden) {
          orderCounts.deliveryAcknowledged++;
        }
      }
    }

    const totalRevenue = allOrders.reduce((sum, order) => sum + order.price.totalPrice, 0);

    const activeOrders = allOrders.filter(order => order.isApprovedByRestaurant && !order.isDelivered);
    const activeRevenue = activeOrders.reduce((sum, order) => sum + order.price.totalPrice, 0);

    const response = {
      state: 'success',
      message: 'Commercial statistics retrieved successfully',
      statistics: {
        orderCounts,
        totalRevenue,
        activeRevenue
      },
    };

    res.status(200).json(response);
  } catch (error) {
    const response = {
      state: 'error',
      message: 'Failed to retrieve commercial statistics',
      error: error.message,
    };

    res.status(200).json(response);
  }
};

module.exports = { getCommercialStatistics };
