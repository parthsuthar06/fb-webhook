const express = require('express'),
    bodyParser = require('body-parser'),
    xhub = require('express-x-hub'),
    cors = require('cors');


const PORT = 3000;
const app = express();
/**
 * enable cors
 */
app.use(cors());
/**
 * app dashboard : APP_SECRET
 */
require('dotenv').config();
const { APP_SECRET } = process.env;
const secret = APP_SECRET;

const token = 'mysuperdubersecret';

/**
 * configure sha1 for verification
 */
app.use(xhub({ algorithm: 'sha1', secret }));
/**
 * configure body-parser
 */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    console.log(`app is running on ${PORT}`)
    return res.status(200).json({
        code: 0,
        data: `app is running on ${PORT}`
    });
});

app.get(['/facebook', '/instagram'], (req, res) => {
    //validate xhub
    console.log(req.isXHub)
    // const isXHubValid = req.isXHubValid();
    // console.log('validate xhub',isXHubValid);
    // if (!isXHubValid) {
    //     console.log('Warning - request header X-Hub-Signature not present or invalid');
    //     res.sendStatus(401);
    //     return;
    // }

    if (
        req.param('hub.mode') == 'subscribe'
        &&
        req.param('hub.verify_token') == token
    ) {
        console.log('challenge', req.param('hub.challenge'))
        res.send(req.param('hub.challenge'));
    } else {
        res.sendStatus(400);
    }
})

app.post('/facebook', function (req, res) {
    console.log('Facebook request body:', req.body);

    // if (!req.isXHubValid()) {
    //   console.log('Warning - request header X-Hub-Signature not present or invalid');
    //   res.sendStatus(401);
    //   return;
    // }

    console.log('request header X-Hub-Signature validated');
    console.log(JSON.stringify(req.body, null, 2))
    // Process the Facebook updates here
    res.sendStatus(200);
});

app.post('/instagram', function (req, res) {
    //validate xhub
    console.log('isXhub', req.isXHub)
    const isXHubValid = req.isXHubValid();
    console.log('validate xhub', isXHubValid);
    if (!isXHubValid) {
        console.log('Warning - request header X-Hub-Signature not present or invalid');
        res.sendStatus(401);
        return;
    }

    console.log('Instagram request body:');
    console.log(JSON.stringify(req.body, null, 2));
    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`server running on ${PORT}...`)
});