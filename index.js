const express = require("express");
const app = express();

// const bodyParser = require("body-parser");
// app.use(bodyParser.json());
// app.use(
//     bodyParser.urlencoded({
//         extended: true,
//     })
// );

app.use(express.json);

const cors = require("cors");
app.use(cors());

app.post("/api/", (req, res) => {
    console.log(req.body);
    res.send("Server is running.");
});

app.listen(process.env.port || 3000);
module.exports = app;
