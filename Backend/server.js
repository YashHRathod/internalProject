require("dotenv").config()
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const PORT=process.env.PORT
const userRoute=require("./router/authenicationRoute")
const workSpaceRoute=require("./router/workSpaceRoute")
const taskRoute=require("./router/taskRoute")
// console.log(PORT);
app.use(cors({ origin: "*" }));
app.use(express.json());
// console.log(process.env.MONGO_URI)

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully!"))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  });
app.use("/",userRoute)
app.use("/workspace",workSpaceRoute)
app.use("/task",taskRoute)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



