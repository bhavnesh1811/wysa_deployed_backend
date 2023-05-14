const express = require("express");
require("dotenv").config();
const { userAuthentication } = require("../Middlewares/User.auth.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { UserModel } = require("../Models/User.model.js");

const UserRouter = express.Router();

//To register a user
UserRouter.post("/register", async (req, res) => {
  const { nickname, password } = req.body;

  const user = await UserModel.find({ nickname });
  if (user.length === 0) {
    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) {
        res.status(400).send({ message: "Something Went Wrong" });
      } else {
        try {
          const newUser = new UserModel({
            nickname,
            password: hash,
          });
          await newUser.save();
          res.status(200).send({ message: "User Registration Suceessful" });
        } catch (e) {
          res.status(401).send({ message: "Something Went Wrong" });
        }
      }
    });
  } else {
    res.status(201).send({ message: "User already exist, Please login" });
  }
});



UserRouter.post("/sleepStuggle",userAuthentication, async (req, res) => {
  let { nickname, userResponse } = req.body;
  await UserModel.findOneAndUpdate(
    { nickname },
    { sleepStuggle: userResponse }
  );
  res
    .status(200)
    .send({
      message: "Sleep Struggle response added",
      displayMessage: "Successful",
    });
});
UserRouter.post("/goTobed",userAuthentication, async (req, res) => {
  let { nickname, userResponse } = req.body;

  await UserModel.findOneAndUpdate({ nickname }, { goTobed: userResponse });
  res
    .status(200)
    .send({
      message: "Go to bed response added",
      displayMessage: "Successful",
    });
});
UserRouter.post("/getOutofBed",userAuthentication, async (req, res) => {
  let { nickname, userResponse } = req.body;

  await UserModel.findOneAndUpdate({ nickname }, { getOutofBed: userResponse });
  res
    .status(200)
    .send({
      message: "Get out of Bed response added",
      displayMessage: "Successful",
    });
});

UserRouter.post("/sleepHours",userAuthentication, async (req, res) => {
  let { nickname, userResponse } = req.body;
  await UserModel.findOneAndUpdate({ nickname }, { sleepHours: userResponse });
  res
    .status(200)
    .send({
      message: "Sleep Hours response added",
      displayMessage: "Successful",
    });
});

UserRouter.get("/sleepEfficiency",userAuthentication, async (req, res) => {
  let { nickname } = req.body;

  let user = await UserModel.findOne({ nickname });
  // console.log(user);
  let sleepHours = +user.sleepHours;
  let getOutofBed = user.getOutofBed; //[11:00 Am]
  let goTobed = user.goTobed; //[11:40 Am]

  function getTime(Time) {
    const [time, modifier] = Time.split(" ");
    let [hours, minutes] = Time.split(":");

    if (modifier == "Pm" && hours < 12) {
      hours = parseInt(hours) + 12;
    }
    if (modifier == "Am" && hours == 12) {
      hours = parseInt(hours) - 12;
    }
    return hours;
  }

  let sleepingTime = getTime(goTobed);
  let wakingTime = getTime(getOutofBed);

  if (wakingTime < sleepingTime) {
    wakingTime = +wakingTime + 24;
  }

  let sleepEfficiency = Math.ceil(
    (Number(sleepHours) * 100) / (Number(wakingTime) - Number(sleepingTime))
  );

  res
    .status(200)
    .send({ sleepEfficiency: sleepEfficiency, displayMessage: "Successful" });
});


module.exports = { UserRouter };
