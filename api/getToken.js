const apiProtheus = require('./apiProtheus');

async function getToken(res, req) {
    try {
        const { user, password } = req.body
        const response = await apiProtheus.post(`/tecadi/api/oauth2/v1/token?grant_type=password&username=${user}&password=${password}`)
        res.send(response.data)
    } catch (error) {
        res.sendStatus(401)
    }
}

module.exports = getToken;