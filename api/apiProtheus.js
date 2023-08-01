const axios = require('axios');
const https = require('https')

const apiProtheus = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    }),
    baseURL: 'https://10.3.50.3:8020/',
    headers: { "Content-Type": "application/json" }
})

module.exports = apiProtheus;