/* 
    Username rule: [{1}, {2}]
    1. username.length >= 1 && username.length <= 12
    2. username not already use
*/

function checkUsername(username) {
    feedback_rule = [0];

    if (username.length >= 1 && username.length <= 12) {
        feedback_rule[0] = 1;
    }

    return feedback_rule;
}

module.exports = checkUsername;
