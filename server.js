const express = require('express');
const morgan = require('morgan');
const app = express();
const port = 80;
const walletRoute = require("./app/routes/wallet.route");
const bodyParser = require('body-parser');
const cors = require('cors');
// require('dotenv').config();

app.use(bodyParser.json())

app.use(cors())

app.use('/', walletRoute);

const db = require("./app/models");
db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

app.listen((port), () => {
  console.log(`Example app listening on port ${port}`)
})
