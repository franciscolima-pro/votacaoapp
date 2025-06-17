const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const appCustom = require("./config/appCustom");

app.use(cors());
appCustom(app, express);

app.listen(port, (error) => {
  if (error) {
    console.log(error);
    return;
  }
  console.log("Rodando...");
});
