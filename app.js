require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const routesUsers = require("./routes/users");
const routesCards = require("./routes/cards");
const nonExistentRoute = require("./routes/nonExistentRoute");
const { login, createUser } = require("./controllers/users");

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use((req, res, next) => {
  req.user = {
    _id: "60b651e56165e93410f9c16f",
  };

  next();
});

app.post("/signin", login);
app.post("/signup", createUser);
app.use(routesCards);
app.use(routesUsers);
app.use(nonExistentRoute);

app.listen(PORT);
