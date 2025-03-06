const mongoose = require("mongoose");

const sortResultSchema = new mongoose.Schema({
  inputArray: [Number],
  bubbleSorted: [Number],
  quickSorted: [Number],
  mergeSorted: [Number],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("SortResult", sortResultSchema);
