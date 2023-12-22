const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header(
//         "Access-Control-Allow-Headers",
//         "Origin, X-Requested-With, Content-Type, Accept"
//     );
//     next();
// });

app.get("/api/", (req, res) => {
    res.send("Server is running.");
    console.log(req.body);
});

app.listen(process.env.port || 3000);
module.exports = app;
