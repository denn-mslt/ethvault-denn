const Cart = require("../../models/Cart");
const Review = require("../../models/Review");
const Order = require("../../models/Order");
const Whislist = require("../../models/WishList");

module.exports = async (product, user, type) => {
  let hasOnCart = null;
  let hasBought = null;
  let hasOnWishlist = null;
  let hasReviewed = null;
  if (user) {
    //cart bahek aru ko lagi check gareko
    if (type !== "carts") {
      //has on cart?
      hasOnCart = await Cart.findOne({
        user: user._id,
        product: product._id,
        isDeleted: null,
      });
      if (!hasOnCart) hasOnCart = false;
    }

    //wishlist bahek aru ko lagi check gareko
    if (type !== "wishlists") {
      // has on wishlist?
      hasOnWishlist = await Whislist.findOne({
        user: user._id,
        product: product._id,
        isDeleted: null,
      });
      if (!hasOnWishlist) hasOnWishlist = false;
    }

    if (type === "product") {
      // TODO: Fixed duplicate key bug — "tobereturned" was silently overwritten by "return".
      // Verify with BE dev that all three statuses are correct. This query needs test coverage.
      //has bought?
      hasBought = await Order.findOne({
        user: user,
        $or: [
          { "status.currentStatus": "complete" },
          { "status.currentStatus": "tobereturned" },
          { "status.currentStatus": "return" },
        ],
      });
      hasBought ? (hasBought = true) : (hasBought = false);

      //has reviewed?
      hasReviewed = await Review.findOne({
        user: user,
        product: product._id,
      }).select("comment star user");
      if (!hasReviewed) hasReviewed = false;
    }
  }

  return { hasBought, hasOnCart, hasOnWishlist, hasReviewed };
};
