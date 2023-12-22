/* 
    Password rule: [{1}, {2}, {3}]
    1. password === confirm_password
    2. password.length >= 8 && password.length <= 12
    3. password have 4 number
*/

function checkPassword(password, confirm_password) {
    feedback_rule = [0, 0, 0];

    if (password === confirm_password) {
        feedback_rule[0] = 1;
    }
    if (password.length >= 8 && password.length <= 12) {
        feedback_rule[1] = 1;
    }
    if (password.replace(/[^0-9]/g,"").length == 4) {
        feedback_rule[2] = 1;
    }

    return feedback_rule;
}

module.exports = checkPassword;