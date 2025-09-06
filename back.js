import express from "express";
import bodyParser from "body-parser";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.get("/", (req, res) => {
  if (!res.session || !req.session.user) {
    return res.sendFile(__dirname + "/login-register/login.html");
  }
  res.redirect("index.html");
});
app.get()
app.listen(port, () => {
  console.log(`listning to the port ${port}`);
});

// Nodemon is a development dependency and should be installed using npm
// Run the following command in your terminal to install Nodemon
// npm install --save-dev nodemon
