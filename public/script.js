let detector;
let poses;
let video;
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

// async function draw_connections(poses) {}

async function init() {
  // const detectorConfig = {
  //   modelType: poseDetection.movenet.modelType,
  // };
  // detector = await poseDetection.createDetector(
  //   poseDetection.SupportedModels.PoseNet,
  //   detectorConfig
  // );

  // const detector = await poseDetection.createDetector(
  //   poseDetection.SupportedModels.MoveNet,
  //   { modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER }
  // );

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
  createCanvas(640, 480);
  video = createCapture(VIDEO, videoReady);
  // video.size(320, 240);
  video.hide();
  await init();
}

async function getPoses() {
  if (detector) {
    poses = await detector.estimatePoses(video.elt);
  }
  setTimeout(getPoses, 0);
}

// async function draw_points(poses) {}

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
  fheight = 480;
  fwidth = 640;

  let kp = await poses[0].keypoints;

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
}

function draw() {
  background(220);

  image(video, 0, 0);
  if (poses && poses.length > 0) {
    draw_skeleton(poses);
  }
}
