import Review from "../models/review.model.js";
import Product from "../models/product.model.js";

export const addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const productId = req.params.productId;
        const userId = req.user._id; // Extract user ID from auth middleware

        // Check if the user has already reviewed this product
        const existingReview = await Review.findOne({
            product: productId,
            user: userId,
        });

        if (existingReview) {
            return res
                .status(400)
                .json({ message: "You have already reviewed this product." });
        }

        // Create a new review
        const review = await Review.create({
            user: userId,
            product: productId,
            rating,
            comment,
        });

        // Add the review to the product
        const product = await Product.findById(productId);
        product.reviews.push(review._id);

        // Update the product's average rating
        const reviews = await Review.find({ product: productId });
        product.averageRating =
            reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

        await product.save();

        res.status(201).json({ message: "Review added successfully", review });
    }
    catch (error) {
        console.log("Error in addReview controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
    
};

export const editReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const reviewId = req.params.reviewId;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You can only edit your own review" });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    await review.save();

    // Update product's average rating
    const product = await Product.findById(review.product);
    const reviews = await Review.find({ product: review.product });
    product.averageRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await product.save();

    res.json({ message: "Review updated successfully", review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You can only delete your own review" });
    }

    await review.deleteOne();

    // Remove review from product & update average rating
    const product = await Product.findById(review.product);
    product.reviews = product.reviews.filter(
      (id) => id.toString() !== reviewId
    );
    const reviews = await Review.find({ product: review.product });

    product.averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    await product.save();

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};