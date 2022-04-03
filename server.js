const express = require("express");
const app = express();

app.use(express.static(`${__dirname}/public`));

app.get("/", (request, response) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(3000, () => {
  console.log("Listen on the port 3000...");
});
