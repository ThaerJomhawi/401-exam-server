const express = require("express");

const cors = require("cors");

const axios = require("axios");

require("dotenv").config();

const app = express();

app.use(cors());

app.use(express.json());
const mongoose = require("mongoose");

const PORT = process.env.PORT;

mongoose.connect("mongodb://localhost:27017/Crypto", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const cryptoSchema = new mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  toUSD: String,
  image_url: String,
});

const userSchema = new mongoose.Schema({
  email: String,
  cryptos: [cryptoSchema],
});

const UserModel = mongoose.model("User", userSchema);

function SeedUserData() {
  let thaer = new UserModel({
    email: "thaer.fjomhawi@gmail.com",
    cryptos: [
      {
        id: 2,
        title: "Bitcoin",
        description:
          "Bitcoin is a decentralized digital currency, without a central bank or single administrator, that can be sent from user to user on the peer-to-peer bitcoin network without the need for intermediaries.",
        toUSD: "48,285.50",
        image_url:
          "https://m.economictimes.com/thumb/msid-79280279,width-1200,height-900,resizemode-4,imgsize-678018/bitcoin.jpg",
      },
    ],
  });

  let yahya = new UserModel({
    email: "v.salvatore7.gs@gmail.com",
    cryptos: [
      {
        id: 1,
        title: "Ethereum",
        description:
          "Ethereum is a decentralized, open-source blockchain with smart contract functionality. Ether is the native cryptocurrency of the platform. After Bitcoin, it is the largest cryptocurrency by market capitalization. Ethereum was invented in 2013 by programmer Vitalik Buterin.",
        toUSD: "3,288.49",
        image_url:
          "https://media.wired.com/photos/598a36a7f15ef46f2c68ebab/master/pass/iStock-696221484.jpg",
      },
    ],
  });
  thaer.save();
  yahya.save();
  console.log(thaer, yahya);
}

// SeedUserData();

function home(req, res) {
  res.send("Hello Exam");
}

function getApiData(req, res) {
  let apiUrl = process.env.API_URL;
  axios.get(apiUrl).then((result) => {
    res.send(result.data);
  });
}

function getFav(req, res) {
  let email = req.params.email;
  UserModel.find({ email: email }, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
}

function createFav(req, res) {
  const { id, title, description, toUSD, image_url } = req.body;
  let email = req.params.email;
  UserModel.findOne({ email: email }, (err, result) => {
    result.cryptos.push({
      id: id,
      title: title,
      description: description,
      toUSD: toUSD,
      image_url: image_url,
    });
    result.save();
    res.send(result);
  });
}

function deleteFav(req, res) {
  let email = req.params.email;
  let id = req.params.id;

  UserModel.findOne({ email: email }, (err, result) => {
    result.cryptos.splice(id, 1);
    result.save();
    res.send(result);
  });
}

function updateFav(req, res) {
  let email = req.params.email;
  let id = req.params.id;
  let data = {
    id: req.body.id,
    title: req.body.title,
    description: req.body.description,
    toUSD: req.body.toUSD,
    image_url: req.body.image_url,
  };

  UserModel.findOne({email:email},(err,result)=>{
    if(err){
      res.send(err)
    }else{
      result.cryptos.splice(id,1,data)
    }
    result.save();
    res.send(result)
  })
}
app.get("/", home);
app.get("/retrieve", getApiData);
app.get("/fav-list/:email", getFav);
app.post("/create/:email", createFav);
app.delete("/delete/:email/:id", deleteFav);
app.put("/update/:email/:id", updateFav);

app.listen(PORT, () => {
  console.log(`I am at port ${PORT}`);
});
