const axios = require("axios");

function lineNotification(lineId, body) {
    console.log(body);

    var date = new Date(body.date);
    var temp = body.temp;
    var humi = body.humi;
    var elec = body.elec;
    var auto_temp = body.auto_temp;

    var mode = body.mode == "auto" ? "อัตโนมัติ" : "อิสระ";
    var status = body.status == "on" ? "เปิด" : "ปิด";

    var type = body.type;

    var notificationText = "";
    if (type == "mode") {
        notificationText = `มีการเปลี่ยนโหมดเป็น${mode} โดย ณ ขณะนี้เวลา ${date} 
มีสถานะปัจจุบัน ดังนี้
อุณหภูมิ : ${temp} °C
ความชื้น : ${humi} %
การใช้ไฟฟ้า : ${elec} W
โหมด : ${mode}
ตัวทำความเย็น : ${status}
อุณหภูมิตั้งต้น : ${auto_temp} °C
        `;
    } else if (type == "status") {
        notificationText = `มีการ${status}ตัวทำความเย็น โดย ณ ขณะนี้เวลา ${date} 
มีสถานะปัจจุบัน ดังนี้
อุณหภูมิ : ${temp} °C
ความชื้น : ${humi} %
การใช้ไฟฟ้า : ${elec} W
โหมด : ${mode}
ตัวทำความเย็น : ${status}
อุณหภูมิตั้งต้น : ${auto_temp} °C
        `;
    } else if (type == "auto_temp") {
        notificationText = `มีการเปลี่ยนค่าอุณหภูมิตั้งตันเป็น ${auto_temp} °C โดย ณ ขณะนี้เวลา ${date} 
มีสถานะปัจจุบัน ดังนี้
อุณหภูมิ : ${temp} °C
ความชื้น : ${humi} %
การใช้ไฟฟ้า : ${elec} W
โหมด : ${mode}
ตัวทำความเย็น : ${status}
อุณหภูมิตั้งต้น : ${auto_temp} °C
        `;
    }

    const dataString = JSON.stringify({
        to: "Ubd6fa77b626c13094b6359d9dd41814b",
        messages: [
            {
                type: "text",
                text: notificationText,
            },
        ],
    });

    axios
        .post("https://api.line.me/v2/bot/message/push", dataString, {
            headers: {
                "Content-Type": "application/json",
                Authorization:
                    "Bearer 5dkn1Tg/JaEaiLFtG5zAE/NBLQBImDiOYqPPHaaUEc8LUEOoTqn4H0hYKQ7DrTe552u539kNwXs+OsdC7+9XJFBuQw9db9XYl//GRWiHeteu4FRwD7pkdoRu3DWz8ThIZ2cEKrqSC6CvrGlakcRLswdB04t89/1O/w1cDnyilFU=",
            },
        })
        .then((response) => {
            // console.log(response);
        });
}

module.exports = lineNotification;
