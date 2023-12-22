const express = require("express");
const app = express();

// const cors = require("cors");
// app.use(cors());

app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
});

app.use(express.json());

app.get("/api/", (req, res) => {
    res.json("Server is running.");
    console.log(req.body);
});

app.listen(process.env.port || 3000);
module.exports = app;
