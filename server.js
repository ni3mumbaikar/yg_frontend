const express = require("express");
const app = express();

const path = require("path");
const tf = require("@tensorflow/tfjs");
const tfn = require("@tensorflow/tfjs-node-gpu");
const handler = tfn.io.fileSystem(
  path.join(__dirname, "public/yg-tfjsmodel/model.json")
);
// const socketIO = require("socket.io");
var yg_model = undefined;

// const WebSocket = require("ws");

const preprocessor = require("./preprocessor");
const { logicalAnd } = require("@tensorflow/tfjs");

async function load() {
  yg_model = await tf.loadLayersModel(handler);
  console.log("YogTark Loaded");
  yg_model.summary();
}

load();

var classes = ["downdog", "chair", "tree", "goddess", "warrior2", "no_pose"];

app.use(express.static(`${__dirname}/public`));

app.use(express.json());

app.get("/", (request, response) => {
  response.sendFile(path.join(__dirname, "public/index.html"));
});

app.post("/points", (req, res) => {
  try {
    arr = preprocessor(req, res);
    if (yg_model) {
      if (typeof arr[0] !== "undefined" && arr[0].length > 0) {
        val = yg_model.predict(tf.reshape(arr[1], [1, 34]));
        x = tf.squeeze(val);
        a = x.argMax().dataSync()[0];
        res.send(JSON.stringify(classes[a]));
      } else {
        res.send(JSON.stringify("no_pose"));
      }
      // console.log(arr);
    }
  } catch (exception) {
    console.log(exception);
  }
});

app.listen(3000, () => {
  console.log("Listen on the port 3000...");
});
