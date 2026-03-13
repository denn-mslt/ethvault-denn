const mongoose = require("mongoose");
const manualOrderSchema = mongoose.Schema(
  {
    productName: {
      type: String,
    },
    link: {
      type: String,
    },
    description: {
      type: String,
    },
    isDeleted: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);
module.exports = mongoose.model("manualorder", manualOrderSchema);
