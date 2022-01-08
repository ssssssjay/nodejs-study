const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const postRoute = require("./routes/posts");

dotenv.config();
app.use(express.json());

// 경로직접입력하지않고 닷엔브활용
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(console.log("제발 몽고야 연결되라"))
  .catch((err) => console.log(err));

app.use("/api/posts", postRoute);

app.listen("8080", () => {
  console.log("제발 서버야 돌아가라");
});