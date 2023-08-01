
const express = require('express')
const cors = require('cors')
const getToken = require('./getToken')
const apiProtheus = require('./apiProtheus')
const app = express()
const port = 3003

app.use(cors())
app.use(express.json());

app.get('/protheus/orders', async (req, res) => {
    const accessToken = req.headers['x-access-token'];
    if (accessToken === 'undefined') {
        res.status(401).send({ statusText: 'Token is required.' })
    }

    const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: req.query
    };

    try {
        const response = await apiProtheus.get(`/tecadi/api/v1/ordens`, config)
        res.status(200).send(response.data)
    } catch (error) {
        const err = error.response ? error.response : ''
        res.status(401).send({ statusText: err.statusText });
    }
})

app.post('/protheus/auth', async (req, res) => {
    console.log("bateu")
    getToken(res, req);
})

app.listen(port, () => {
    console.log('Servidor rodando...');
})