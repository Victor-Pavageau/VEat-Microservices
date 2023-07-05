const Review = require('../models/reviewSchema');
const Log = require('../middleware/logMiddleware')
const uuidv4 = require('uuid').v4;

const createReview = async (req, res) => {
  try {
    const {
      restaurantId,
      userId,
      note,
      comment
    } = req.body;

    const uid = uuidv4();

    const newReview = new Review({
      uid,
      restaurantId,
      userId,
      note,
      comment
    });

    await newReview.save();

    const response = {
      state: 'success',
      message: 'Review created successfully',
      review: newReview
    };

    Log.log("info", `${response.message} ${newReview.uid}`)
    res.status(201).json(response);
  } catch (error) {
    const response = {
      state: 'error',
      message: 'Failed to create review',
      error: error.message
    };

    Log.log("notice", `${response.message}`)
    res.status(500).json(response);
  }
};

const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({});

    const response = {
      state: 'success',
      message: 'All reviews retrieved successfully',
      reviews
    };

    res.status(200).json(response);
  } catch (error) {
    const response = {
      state: 'error',
      message: 'Failed to retrieve reviews',
      error: error.message
    };

    Log.log("notice", `${response.message}`)
    res.status(500).json(response);
  }
};

const getReviewByUid = async (req, res) => {
  try {
    const { uid } = req.params;

    const review = await Review.findOne({ uid });

    if (!review) {
      const response = {
        state: 'error',
        message: 'Review not found'
      };

      res.status(200).json(response);
    } else {
      const response = {
        state: 'success',
        message: 'Review retrieved successfully',
        review
      };

      res.status(200).json(response);
    }
  } catch (error) {
    const response = {
      state: 'error',
      message: 'Failed to retrieve review',
      error: error.message
    };

    Log.log("notice", `${response.message}`)
    res.status(500).json(response);
  }
};

const updateReviewByUid = async (req, res) => {
  try {
    const { uid } = req.params;
    const updatedReview = req.body;

    const review = await Review.findOneAndUpdate({ uid }, updatedReview, {
      new: true
    });

    if (!review) {
      const response = {
        state: 'error',
        message: 'Review not found'
      };

      res.status(200).json(response);
    } else {
      const response = {
        state: 'success',
        message: 'Review updated successfully',
        review
      };

      Log.log("notice", `${response.message} ${uid}`)
      res.status(200).json(response);
    }
  } catch (error) {
    const response = {
      state: 'error',
      message: 'Failed to update review',
      error: error.message
    };

    Log.log("notice", `${response.message} ${uid}`)
    res.status(500).json(response);
  }
};

const deleteReviewByUid = async (req, res) => {
  try {
    const { uid } = req.params;

    const review = await Review.findOneAndDelete({ uid });

    if (!review) {
      const response = {
        state: 'error',
        message: 'Review not found'
      };

      res.status(200).json(response);
    } else {
      const response = {
        state: 'success',
        message: 'Review deleted successfully',
        review
      };

      Log.log("notice", `${response.message} ${uid}`)
      res.status(200).json(response);
    }
  } catch (error) {
    const response = {
      state: 'error',
      message: 'Failed to delete review',
      error: error.message
    };

    Log.log("notice", `${response.message} ${uid}`)
    res.status(500).json(response);
  }
};

const getMeanReviewByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const reviews = await Review.find({ restaurantId });
    const reviewCount = reviews.length;

    if (reviewCount === 0) {
      const response = {
        state: 'success',
        message: 'No reviews found for the restaurant',
        meanReview: 0,
      };
      res.status(200).json(response);
    } else {

      const totalReviewScore = reviews.reduce((sum, review) => sum + review.note, 0);
      const meanReview = totalReviewScore / reviewCount;

      const response = {
        state: 'success',
        message: 'Mean review score retrieved successfully',
        meanReview,
      };
      res.status(200).json(response);
    }
  } catch (error) {
    const response = {
      state: 'error',
      message: 'Failed to retrieve mean review score',
      error: error.message,
    };
    Log.log("notice", `${response.message} ${restaurantId}`)
    res.status(500).json(response);
  }
};

module.exports = {
  createReview,
  getAllReviews,
  getReviewByUid,
  updateReviewByUid,
  deleteReviewByUid,
  getMeanReviewByRestaurant
};