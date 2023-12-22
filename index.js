const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.post("/api/", (req, res) => {
    res.send("Server is running.");
    console.log(req.body);
});

app.listen(process.env.port || 3000);
module.exports = app;
