const crypto = require('crypto');

module.exports = function (password, salt) {
    const hash = crypto.createHmac('sha256', salt)
                    .update(password)
                    .digest('hex');
    return hash
}
