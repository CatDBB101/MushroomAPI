// !: Express
const express = require("express");
const app = express();

// !: Axios & QueryString
const axios = require("axios");
const querystring = require("querystring");

// !: BodyParser
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

// !: Enable CORS
const cors = require("cors");
app.use(cors());

// !: API path way section
app.get("/api/", (req, res) => {
    res.send("Server is running...");
});

app.get("/api/test", (req, res) => {
    axios
        .get("https://mushroom-db.vercel.app/")
        .then((response) => {
            let data = response.data;
            if (data == "Server is running...") {
                console.log("[Action | GET] - Database API is running");
                res.send("Working");
            } else {
                console.log("[Action | GET] - Database API isn't running");
                res.send("Not working");
            }
        })
        .catch((error) => {
            res.send("Error");
            console.error("Error:", error);
        });
});

app.post("/api/login/", (req, res) => {
    var username = req.body.username;
    var password = req.body.password;

    var body = new URLSearchParams();
    body.append("username", username);
    body.append("password", password);

    axios
        .post("https://mushroom-db.vercel.app/users/key", body.toString(), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })
        .then((response) => {
            let data = response.data;
            let key = data[2];
            console.log(data);

            if (data[0] && data[1]) {
                console.log("[Action | GET] - Sent key to user");
                res.send(["ok", key]);
            } else if (data[0] && !data[1]) {
                console.log("[Action | GET] - Password incorrect");
                res.send(["Password incorrect"]);
            } else {
                console.log("[Action | GET] - Username not found");
                res.send(["Username not fonud"]);
            }
        })
        .catch((error) => {
            res.send("Error");
            console.error("Error:", error);
        });
});

app.listen(process.env.port || 3000); // Server lisening to localhost and port 3000

module.exports = app;
