// These are our required libraries to make the server work.

import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.route("/api")
  .get((req, res) => {
      console.log("GET request detected");
  })
  .post((req, res) => {
    console.log("POST request detected");
  });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
