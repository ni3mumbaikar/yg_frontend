const express = require("express");
const app = express();
const path = require("path");
const tf = require("@tensorflow/tfjs");
const tfn = require("@tensorflow/tfjs-node-gpu");
const handler = tfn.io.fileSystem(
  path.join(__dirname, "public/yg-tfjsmodel/model.json")
);

async function load() {
  const model = await tf.loadLayersModel(handler);
  console.log("YogTark Loaded");
  model.summary();
}

load();

app.use(express.static(`${__dirname}/public`));

app.get("/", (request, response) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(3000, () => {
  console.log("Listen on the port 3000...");
});
