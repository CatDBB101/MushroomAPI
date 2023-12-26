// ! Express
const express = require("express");
const app = express();

// ! Mongoose
const mongoose = require("mongoose");
mongoose
    .connect(
        "mongodb+srv://catdbb1000:Q6AROqpJXeTWWVXi@cluster0.aud9pyi.mongodb.net/"
    )
    .then(() => console.log("connection success"))
    .catch((err) => console.error(err));

// ! Body-Parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

// ! Cors Enable
const cors = require("cors");
app.use(cors());

// !: Tools
const generateKey = require("./Tools/generateKey");
const checkPassword = require("./Tools/checkPassword");
const checkUsername = require("./Tools/checkUsername");
const getRecord = require("./Tools/getRecord");
const getFilter = require("./Tools/getFilter");

// !: Schemas & Models
const UsersSchema = new mongoose.Schema({
    username: String,
    password: String,
    key: String,
});
const UsersModel = mongoose.model("users", UsersSchema);

const RecordsSchema = new mongoose.Schema({
    key: String,
    records: [],
    mode: String,
    status: String,
    auto_temp: String,
});
const RecordsModel = mongoose.model("records", RecordsSchema);

const LineSchema = new mongoose.Schema({
    key: String,
    time: String,
    temp: String,
    humi: String,
    elec: String,
    fan: String,
    mode: String,
    status: String,
    auto_temp: String,
    got_it: String,
});
const LineModel = mongoose.model("lines", LineSchema);

// TODO: Check API's status
app.post("/api/", async (req, res) => {
    console.log("[POST | /api/] - Check API's status.", req.body);
    res.send("Server is running.");
});

// TODO: Register
app.post("/api/register", async (req, res) => {
    console.log("[POST | /api/register] - Register new user", req.body);
    var body = req.body;

    var username = body.username;
    var password = body.password;
    var confirm_password = body.confirm_password;

    // ? Check username follow the rule
    var raw_username_feedback = checkUsername(username);

    // ? Check password follow the rule
    var raw_password_feedback = checkPassword(password, confirm_password);
    var password_accepted =
        raw_password_feedback[0] +
            raw_password_feedback[1] +
            raw_password_feedback[2] ==
        3
            ? true
            : false;

    if (!password_accepted) {
        // ! Password unaccepted
        raw_username_feedback[1] == undefined;
        res.send({
            username: raw_username_feedback,
            password: raw_password_feedback,
            key: undefined,
        });
        return;
    }

    // ? Check username already used
    var findUsername = await UsersModel.find({ username: username });
    console.log(findUsername.length);

    var checkUsernameAlreadyUse =
        findUsername.length != 0
            ? true // TODO: Already use
            : false; // ! Never use
    console.log(await UsersModel.find({ username: username }));

    console.log(checkUsernameAlreadyUse);

    if (checkUsernameAlreadyUse) {
        // ! Username already use
        raw_username_feedback[1] = 0;
        res.send({
            username: raw_username_feedback,
            password: raw_password_feedback,
            key: undefined,
        });
        return;
    }

    // ? Generate key
    var key = generateKey();

    // ? Create new user in database
    var saving_user_data = {
        username: username,
        password: password,
        key: key,
    };
    var status_user = await UsersModel.create(saving_user_data);

    // ? Create standard record in database
    var saving_record_data = {
        key: key,
        records: [],
        mode: "auto",
        status: "off",
        auto_temp: "25",
    };
    var status_record = await RecordsModel.create(saving_record_data);

    // ? Create standard line in database
    var saving_line_data = {
        key: key,
        time: "undefined",
        temp: "undefined",
        humi: "undefined",
        elec: "undefined",
        fan: "undefined",
        mode: "undefined",
        status: "undefined",
        auto_temp: "undefined",
        got_it: "undefined",
    };
    var status_line = await LineModel.create(saving_line_data);

    raw_username_feedback[1] = 1;
    res.send({
        username: raw_username_feedback,
        password: raw_password_feedback,
        key: key,
    });
});

//TODO: Login
app.post("/api/login", async (req, res) => {
    console.log("[POST | /api/login] - Login & Get key", req.body);

    var body = req.body;
    var username = body.username;
    var password = body.password;

    /* 
        login rule: [{1}, {2}]
        1. found username in database
        2. password correct
    */
    var login_feedback = [undefined, undefined];

    // ? Get key from username
    var findUsername = await UsersModel.find({
        username: username,
    });

    if (findUsername.length == 0) {
        // ! Not found user
        login_feedback[0] = 0;
        res.send([login_feedback]);
        return;
    }

    // ? Check password
    login_feedback[0] = 1;

    var correct_password = findUsername[0].password;
    if (password !== correct_password) {
        // ! Password incorrect
        login_feedback[1] = 0;
        res.send([login_feedback]);
        return;
    }

    // ? Send key
    login_feedback[1] = 1;
    res.send([login_feedback, findUsername[0].key]);
});

//TODO: Delete account
app.post("/api/delete", async (req, res) => {
    console.log("[POST | DELETE] - Delete account", req.body);

    var body = req.body;
    var username = body.username;
    var password = body.password;
    var key = body.key;

    /* 
        delete account rule: [{1}, {2}, {3}]
        1. check key
        2. check username
        3. check password
    */
    var delete_feedback = [undefined, undefined, undefined];

    // ? Check key
    var findKey = await UsersModel.find({
        key: key,
    });

    if (findKey.length == 0) {
        // ! Not found key
        delete_feedback[0] = 0;
        res.send(delete_feedback);
        return;
    }

    // ? Check username
    delete_feedback[0] = 1;

    var correct_username = findKey[0].username;
    if (username !== correct_username) {
        // ! Username incorrect
        delete_feedback[1] = 0;
        res.send(delete_feedback);
        return;
    }

    // ? Check password
    delete_feedback[1] = 1;

    var correct_password = findKey[0].password;
    if (password !== correct_password) {
        // ! Password incorrect
        delete_feedback[2] = 0;
        res.send(delete_feedback);
        return;
    }

    // ? Delete account & Send feedback
    delete_feedback[2] = 1;

    RecordsModel.deleteOne({
        key: key,
    }).then(async () => {});

    UsersModel.deleteOne({
        key: key,
    }).then(async () => {});

    LineModel.deleteOne({
        key: key,
    }).then(async () => {});

    res.send(delete_feedback);
});

//TODO: Add new record
app.post("/api/records/add", async (req, res) => {
    console.log("[POST | AddRecord] - Add Record", req.body);

    var body = req.body;

    var key = body.key;
    var temp = body.temp;
    var humi = body.humi;
    var elec = body.elec;
    var fan = body.fan;

    /* 
        add record rule: [{1}]
        1. check key
    */
    var add_feedback = [undefined];

    // ? Check key
    var findKey = await UsersModel.find({
        key: key,
    });

    if (findKey.length == 0) {
        // ! Not found key
        add_feedback[0] = 0;
        res.send(add_feedback);
        return;
    }

    // ? Create new record & Send record
    add_feedback[0] = 1;

    var current_time = new Date();

    var addStatus = await RecordsModel.findOneAndUpdate(
        { key: key },
        { $push: { records: [current_time, temp, humi, elec, fan] } }
    );
    console.log(addStatus);

    res.send(add_feedback);
});

//TODO: Clear record
app.post("/api/records/clear", async (req, res) => {
    console.log("[POST | ClearRecrod] - Clear Record", req.body);

    var body = req.body;
    var key = body.key;

    /* 
        clear record rule: [{1}]
        1. check key
    */
    clear_feedback = [0];

    // ? Check key
    var findKey = await UsersModel.find({
        key: key,
    });

    if (findKey.length == 0) {
        // ! Not found key
        clear_feedback[0] = 0;
        res.send(clear_feedback);
        return;
    }

    // ? Clear record
    clear_feedback[0] = 1;

    var clear_status = await RecordsModel.updateOne(
        { key: key },
        {
            $set: {
                records: [],
            },
        }
    );

    res.send(clear_feedback);
});

// TODO: Setting mode
app.post("/api/settings/mode", async (req, res) => {
    console.log("[POST | /api/settings/mode] - change mode", req.body);

    var body = req.body;
    var key = body.key;
    var change_to = body.change_to;

    /* 
        change mode rule: [{1}]
        1. check key
    */
    mode_feedback = [0];

    // ? Check key
    var findKey = await UsersModel.find({
        key: key,
    });

    if (findKey.length == 0) {
        // ! Not found key
        mode_feedback[0] = 0;
        res.send(mode_feedback);
        return;
    }

    // ? Change mode & Send feedback
    mode_feedback[0] = 1;

    var mode_change_status = await RecordsModel.updateOne(
        { key: key },
        {
            $set: {
                mode: change_to,
            },
        }
    );

    // ? Get temp, humi, elec, fan, status, auto_temp
    var setting = await RecordsModel.find({
        key: key,
    });
    var last_record = setting[0].records[setting[0].records.length - 1];
    var time = last_record[0];
    var temp = last_record[1];
    var humi = last_record[2];
    var elec = last_record[3];
    var fan = last_record[4];

    var status = setting[0].status;
    var auto_temp = setting[0].auto_temp;

    // ? Change line record
    var line_status = await LineModel.updateOne(
        { key: key },
        {
            $set: {
                time: time,
                temp: temp,
                humi: humi,
                elec: elec,
                fan: fan,
                mode: change_to,
                status: status,
                auto_temp: auto_temp,
                got_it: "false",
            },
        }
    );

    res.send(mode_feedback);
});

// TODO: Setting fan status
app.post("/api/settings/status", async (req, res) => {
    console.log("[POST | /api/settings/status] - change fan status", req.body);

    var body = req.body;
    var key = body.key;
    var change_to = body.change_to;

    /* 
        change status rule: [{1}]
        1. check key
    */
    status_feedback = [0];

    // ? Check key
    var findKey = await UsersModel.find({
        key: key,
    });

    if (findKey.length == 0) {
        // ! Not found key
        status_feedback[0] = 0;
        res.send(status_feedback);
        return;
    }

    // ? Change fan status & Send feedback
    status_feedback[0] = 1;

    var status_change_status = await RecordsModel.updateOne(
        { key: key },
        {
            $set: {
                status: change_to,
            },
        }
    );

    // ? Get temp, humi, elec, fan, status, auto_temp
    var setting = await RecordsModel.find({
        key: key,
    });
    var last_record = setting[0].records[setting[0].records.length - 1];
    var time = last_record[0];
    var temp = last_record[1];
    var humi = last_record[2];
    var elec = last_record[3];
    var fan = last_record[4];

    var mode = setting[0].mode;
    var auto_temp = setting[0].auto_temp;

    // ? Change line record
    var line_status = await LineModel.updateOne(
        { key: key },
        {
            $set: {
                time: time,
                temp: temp,
                humi: humi,
                elec: elec,
                fan: fan,
                mode: mode,
                status: change_to,
                auto_temp: auto_temp,
                got_it: "false",
            },
        }
    );

    res.send(status_feedback);
});

// TODO: Setting auto temperature setting
app.post("/api/settings/auto_temp", async (req, res) => {
    console.log(
        "[POST | /api/settings/auto_temp] - change auto_temp",
        req.body
    );

    var body = req.body;
    var key = body.key;
    var change_to = body.change_to;

    /* 
        change temp in auto rule: [{1}]
        1. check key
    */
    auto_feedback = [0];

    // ? Check key
    var findKey = await UsersModel.find({
        key: key,
    });

    if (findKey.length == 0) {
        // ! Not found key
        auto_feedback[0] = 0;
        res.send(auto_feedback);
        return;
    }

    // ? Change auto temperature & Send feedback
    auto_feedback[0] = 1;

    var auto_change_status = await RecordsModel.updateOne(
        { key: key },
        {
            $set: {
                auto_temp: change_to,
            },
        }
    );

    res.send(auto_feedback);
});

// TODO: Get records
app.post("/api/records/get", async (req, res) => {
    console.log("[POST | /api/record/get] - get record", req.body);

    var body = req.body;
    var key = body.key;
    var min = body.min;
    var max = body.max;
    var filter = body.filter;

    /* 
        get record rule: [{1}]
        1. check key
    */
    get_feedback = [0];

    // ? Check key
    var findKey = await UsersModel.find({
        key: key,
    });

    if (findKey.length == 0) {
        // ! Not found key
        get_feedback[0] = 0;
        res.send([get_feedback]);
        return;
    }

    // ? Change auto temperature & Send feedback
    get_feedback[0] = 1;

    var allRecord = await RecordsModel.find({ key: key });

    var responseRecords = getRecord(allRecord[0].records, min, max);

    var responseRecords = getFilter(responseRecords, filter);

    res.send([get_feedback, responseRecords]);
});

// TODO: Set line got it
app.post("/api/line/set", async (req, res) => {
    console.log("[POST | /api/line/set] - set line", req.body);

    var body = req.body;
    var key = body.key;
    var change_to = body.change_to;

    /* 
        set line rule: [{1}]
        1. check key
    */
    line_feedback = [0];

    // ? Check key
    var findKey = await UsersModel.find({
        key: key,
    });

    if (findKey.length == 0) {
        // ! Not found key
        line_feedback[0] = 0;
        res.send(line_feedback);
        return;
    }

    // ? Change auto temperature & Send feedback
    line_feedback[0] = 1;

    var line_status = await LineModel.updateOne(
        { key: key },
        {
            $set: {
                got_it: change_to,
            },
        }
    );

    res.send(line_feedback);
});

// TODO: Get line record
app.post("/api/line/get", async (req, res) => {
    console.log("[POST | /api/line/get] - get line record", req.body);

    var body = req.body;
    var key = body.key;

    /* 
        get line record rule: [{1}]
        1. check key
    */
    line_feedback = [0];

    // ? Check key
    var findKey = await UsersModel.find({
        key: key,
    });

    if (findKey.length == 0) {
        // ! Not found key
        line_feedback[0] = 0;
        res.send([line_feedback]);
        return;
    }

    // ? Change auto temperature & Send feedback
    line_feedback[0] = 1;

    var findLineRecord = await LineModel.find({
        key: key,
    });

    res.send([line_feedback, findLineRecord[0]]);
});

app.listen(process.env.port || 3000);
module.exports = app;
