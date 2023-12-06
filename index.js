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

// !: Tools
const GenerateKey = require("./Tools/GenerateKey");

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

app.post("/api/register", (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var key = GenerateKey();
    console.log(key);

    var body1 = new URLSearchParams();
    body1.append("username", username);

    axios // ?: Check for username used or not.
        .post(
            "https://mushroom-db.vercel.app/users/check/username",
            body1.toString(),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        )
        .then((response) => {
            let data = response.data;
            console.log(data);
            if (data) {
                var body2 = new URLSearchParams();
                body2.append("username", username);
                body2.append("password", password);
                body2.append("key", key);

                axios // ?: Create new user
                    .post(
                        "https://mushroom-db.vercel.app/users",
                        body2.toString(),
                        {
                            headers: {
                                "Content-Type":
                                    "application/x-www-form-urlencoded",
                            },
                        }
                    )
                    .then((response) => {
                        let data = response.data;
                        console.log(data);
                        res.send(data.key);
                    })
                    .catch((error) => {
                        res.send("Error");
                        console.error("Error:", error);
                    });
            } else {
                res.send(false);
            }
        })
        .catch((error) => {
            res.send("Error");
            console.error("Error:", error);
        });
});

app.post("/api/update/records", (req, res) => {
    var key = req.body.key;
    var time = req.body.time;
    var temp = req.body.temp;
    var humi = req.body.humi;
    var elec = req.body.elec;
    var fan = req.body.fan;

    var body = new URLSearchParams();
    body.append("key", key);
    body.append("time", time);
    body.append("temp", temp);
    body.append("humi", humi);
    body.append("elec", elec);
    body.append("fan", fan);

    console.log(req.body);

    axios
        .post("https://mushroom-db.vercel.app/records", body.toString(), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })
        .then((response) => {
            let data = response.data;
            console.log(data);

            res.send(data);
        })
        .catch((error) => {
            res.send("Error");
            console.error("Error:", error);
        });
});

app.post("/api/get/records", (req, res) => {
    var key = req.body.key;

    console.log(key);

    var body = new URLSearchParams();
    body.append("key", key);

    axios
        .post("https://mushroom-db.vercel.app/records/get", body.toString(), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })
        .then((response) => {
            let data = response.data;
            console.log(data);
            console.log(data[0]);
            res.send(data[0].records);
        })
        .catch((error) => {
            res.send("Error");
            console.error("Error:", error);
        });
});

app.post("/api/get/name", (req, res) => {
    var key = req.body.key;

    console.log(key);

    var body = new URLSearchParams();
    body.append("key", key);

    axios
        .post("https://mushroom-db.vercel.app/get/name", body.toString(), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })
        .then((response) => {
            var data = response.data;
            res.send(data);
        })
        .catch((error) => {
            res.send("Error");
            console.error("Error:", error);
        });
});

app.post("/api/delete/users", (req, res) => {
    var key = req.body.key;

    var body = new URLSearchParams();
    body.append("key", key);

    axios
        .post("https://mushroom-db.vercel.app/users/delete", body.toString(), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })
        .then((response) => {
            var data = response.data;
            res.send(data);
        })
        .catch((error) => {
            res.send("Error");
            console.error("Error:", error);
        });
});

app.post("/api/mode", (req, res) => {
    var key = req.body.key;

    var body = new URLSearchParams();
    body.append("key", key);

    axios
        .post(
            "https://mushroom-db.vercel.app/records/get/mode",
            body.toString(),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        )
        .then((response) => {
            var data = response.data;
            res.send(data);
        })
        .catch((error) => {
            res.send("Error");
            console.error("Error:", error);
        });
});

app.post("/api/change/mode", (req, res) => {
    var key = req.body.key;
    var change_to = req.body.change_to;

    var body = new URLSearchParams();
    body.append("key", key);
    body.append("change_to", change_to);

    axios
        .post(
            "https://mushroom-db.vercel.app/records/change/mode",
            body.toString(),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        )
        .then((response) => {
            var data = response.data;
            res.send(data);
        })
        .catch((error) => {
            res.send("Error");
            console.error("Error:", error);
        });
});

app.listen(process.env.port || 3000); // Server lisening to localhost and port 3000

module.exports = app;
