const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

app.use(express.json());

app.get("/api/", (req, res) => {
    res.send("Server is running.");
    console.log(req.body);
});


app.listen(process.env.port || 3000);
module.exports = app;