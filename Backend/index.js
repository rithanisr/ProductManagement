require("dotenv").config();
const express = require("express");
const cors = require("cors");
const productroutes = require("./src/routes/productroutes");
const categoryroutes = require("./src/routes/categoryroutes");
const userroutes = require("./src/routes/userroutes");
const authroutes = require("./src/routes/authroutes");
const orderroutes = require("./src/routes/orderroutes");

const app = express();

app.use(cors());
app.use(express.json());

// Health check route for root
app.get("/", (req, res) => {
  res.send("API is running!");
});

app.use("/products", productroutes);
app.use("/categories", categoryroutes);
app.use("/user", userroutes);
app.use("/auth", authroutes);
app.use("/", orderroutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
