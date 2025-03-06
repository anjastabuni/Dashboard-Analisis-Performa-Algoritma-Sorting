const express = require("express");
const router = express.Router();
const SortResult = require("../models/SortResult");

// Bubble Sort dengan langkah-langkah
function bubbleSort(arr) {
  let steps = [];
  let n = arr.length;
  let newArr = [...arr];

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (newArr[j] > newArr[j + 1]) {
        [newArr[j], newArr[j + 1]] = [newArr[j + 1], newArr[j]];
      }
      steps.push([...newArr]); // Simpan setiap langkah
    }
  }
  return { sortedArray: newArr, steps };
}

// Quick Sort dengan langkah-langkah
function quickSort(arr, steps = []) {
  if (arr.length <= 1) return { sortedArray: arr, steps };

  const pivot = arr[arr.length - 1];
  const left = [];
  const right = [];
  const equal = [];

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else if (arr[i] > pivot) {
      right.push(arr[i]);
    } else {
      equal.push(arr[i]);
    }
  }

  const leftResult = quickSort(left, steps);
  const rightResult = quickSort(right, steps);

  const combined = [...leftResult.sortedArray, ...equal, ...rightResult.sortedArray];
  steps.push([...combined]); // Simpan langkah-langkah sorting

  return { sortedArray: combined, steps };
}

// Merge Sort dengan langkah-langkah
function mergeSort(arr, steps = []) {
  if (arr.length <= 1) return { sortedArray: arr, steps };

  const mid = Math.floor(arr.length / 2);
  const leftResult = mergeSort(arr.slice(0, mid), steps);
  const rightResult = mergeSort(arr.slice(mid), steps);

  let merged = [];
  let i = 0,
    j = 0;

  while (i < leftResult.sortedArray.length && j < rightResult.sortedArray.length) {
    if (leftResult.sortedArray[i] < rightResult.sortedArray[j]) {
      merged.push(leftResult.sortedArray[i]);
      i++;
    } else {
      merged.push(rightResult.sortedArray[j]);
      j++;
    }
  }

  merged = [...merged, ...leftResult.sortedArray.slice(i), ...rightResult.sortedArray.slice(j)];
  steps.push([...merged]); // Simpan setiap langkah

  return { sortedArray: merged, steps };
}

// Routes
router.get("/", (req, res) => {
  res.render("index", { inputArray: null, bubbleSteps: [], quickSteps: [], mergeSteps: [] });
});

router.post("/sort", async (req, res) => {
  let inputArray = req.body.numbers.split(",").map(Number);

  // Lakukan sorting
  let { sortedArray: bubbleSorted, steps: bubbleSteps } = bubbleSort([...inputArray]);
  let { sortedArray: quickSorted, steps: quickSteps } = quickSort([...inputArray]);
  let { sortedArray: mergeSorted, steps: mergeSteps } = mergeSort([...inputArray]);

  // Simpan ke database
  const sortResult = new SortResult({ inputArray, bubbleSorted, quickSorted, mergeSorted });
  await sortResult.save();

  res.render("index", {
    inputArray,
    bubbleSteps,
    quickSteps,
    mergeSteps,
  });
});

module.exports = router;
