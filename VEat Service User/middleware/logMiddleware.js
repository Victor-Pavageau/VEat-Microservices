const axios = require('axios');

const log = async (level, message) => {
    try {
        axios.post('http://log-service:3998/logs', {
            level: level,
            service: "User",
            message: message
        });
    }
    catch (error) {
        throw new Error(`Log Error : ${error}`)
    }
}

module.exports = {log};