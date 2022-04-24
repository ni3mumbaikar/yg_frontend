var nj = require("numjs");

function process(req, res, callback) {
  let kp = req.body;
  return processWithCenterOfBody(kp, 640, 640, res);
}

function processWithCenterOfBody(keypoints, width, height, res) {
  center_threshold = 0.5;
  // To scale up coordinates
  // normalize(keypoints, width, height);
  // console.log(keypoints);
  // # To calculate center of the body
  centerBody = getBodyCentre(keypoints, center_threshold, res);
  // console.log(centerBody);
  // # To get distance of each kp from center
  distance_list = get_distance_from_centre(keypoints, centerBody);
  distance_list = normalize2d(distance_list).tolist();
  console.log(distance_list);
  return [centerBody, distance_list];
}

function normalize(keypoints, width, height) {
  for (let kp of keypoints) {
    kp["y"] = parseInt(keypoint[1] * height);
    kp["x"] = parseInt(keypoint[0] * width);
  }
}

function normalize2d(data) {
  data = nj.array(data);
  // console.log(data);
  return nj.divide(
    nj.subtract(data, nj.min(data)),
    nj.array(nj.subtract(nj.max(data), nj.min(data))).tolist()[0]
  );
}

function getBodyCentre(keypoints, center_threshold = 0.5, res) {
  var centerBody = [];
  if (
    keypoints[11]["score"] > center_threshold &&
    keypoints[12]["score"] > center_threshold
  ) {
    centerBody = [
      (keypoints[11]["x"] + keypoints[12]["x"]) / 2,
      (keypoints[11]["y"] + keypoints[12]["y"]) / 2,
    ];
    return centerBody;

    // console.log("Center of the body is", centerBody[0], centerBody[1]);
  } else {
    console.log(
      "Important keypoints are not available with threshold confidence value or above"
    );
    return [];
    // res.send("no_pose");
  }
}

function get_distance_from_centre(keypoints, centerBody) {
  distanceList = [];

  for (let kp of keypoints) {
    kpnp = [kp["x"], kp["y"]];
    distance = [];
    distance.push(kpnp[0] - centerBody[0]);
    distance.push(kpnp[1] - centerBody[1]);
    // distance = np.subtract(kpnp, centernp);
    distanceList.push(distance);
  }

  return distanceList;
}

module.exports = process;
