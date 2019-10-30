const express = require('express');
const app = express();
const request = require('request');
const port = 3000;
const path = require('path');
const bodyParser = require('body-parser');
const router = express.Router();
const payment = require('./routes/payment')(router);
var cors = require('cors')

app.use(cors())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());
app.use('/payment', payment)
app.get('/', (req, res) => {
    res.json({ success: true, message: 'You are home' })
})

app.get('*', (req, res) => {
    res.json({ success: true, message: 'failed to 404' })
})
// create our webhook endpoint to recive webhooks from Safaricom



app.listen(port, (err) => {
    if (err) {
        console.log('failed' + err);

    } else {
        console.log('server listening on port', port);

    }
})