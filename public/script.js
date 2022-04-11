let detector;
let poses;
let video;
let p;
const point_confidance_threshold = 0.5;

const EDGES = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 4],
  [5, 7],
  [7, 9],
  [6, 8],
  [8, 10],
  [5, 6],
  [5, 11],
  [6, 12],
  [11, 12],
  [11, 13],
  [13, 15],
  [12, 14],
  [14, 16],
];

async function init() {
  const detectorConfig = {
    modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
    enableSmoothing: true,
    multiPoseMaxDimension: 256,
    enableTracking: true,
    trackerType: poseDetection.TrackerType.BoundingBox,
  };
  detector = await poseDetection.createDetector(
    poseDetection.SupportedModels.MoveNet,
    detectorConfig
  );
}

async function videoReady() {
  console.log("video ready");
  await getPoses();
}

async function setup() {
  createCanvas(640, 640);
  video = createCapture(VIDEO, videoReady);
  video.hide();
  p = createP("Please wait loading model ...");
  p.style("font-size", "24px");
  p.style("color", "#ffffff");
  p.style("-webkit-text-stroke-color", "#00ff00");
  p.style(" -webkit-text-stroke-width", "2px");
  p.position(10, 0);
  // tf.setBackend("wasm");
  await init();
}

async function getPoses() {
  if (detector) {
    poses = await detector.estimatePoses(video.elt);
  }
  setTimeout(getPoses, 0);
}

async function draw_skeleton(poses) {
  for (let kp of poses[0].keypoints) {
    const { x, y, score } = kp;
    if (score > point_confidance_threshold) {
      fill(255);
      stroke(0);
      strokeWeight(4);
      circle(x, y, 16);
    }
  }

  let kp = poses[0].keypoints;

  for (index in EDGES) {
    part1 = EDGES[index][0];
    part2 = EDGES[index][1];

    pt1 = kp[part1];
    pt2 = kp[part2];

    if (
      pt1.score > point_confidance_threshold &&
      pt2.score > point_confidance_threshold
    ) {
      stroke(255);
      strokeWeight(5);
      line(pt1.x, pt1.y, pt2.x, pt2.y);
    }
  }
  await post_call(JSON.stringify(poses[0].keypoints));
}

async function post_call(postData) {
  let url = "http://127.0.0.1:3000/points";

  await httpDo(
    url,
    { headers: { "Content-Type": "application/json" } },
    "POST",
    "json",
    postData,
    function (response) {
      console.log(response);
      p.html(response);
    }
  );
}

function draw() {
  background(255);
  image(video, 0, 0);
  if (poses && poses.length > 0) {
    draw_skeleton(poses);
  }
}
