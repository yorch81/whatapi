var qrImg = require('qr-image');

const { Client } = require('whatsapp-web.js');
const { MessageMedia } = require('whatsapp-web.js');
const { Location } = require('whatsapp-web.js');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

var log4js = require("log4js");
var logger = log4js.getLogger();
logger.level = "debug";

var flag = false;

// Validate ENV
if (typeof process.env.WA_KEY === 'undefined') {
    logger.error("API Key is undefined, execute: setx WA_KEY your_api_key");

    return;
}

if (typeof process.env.WA_PORT === 'undefined') {
    logger.error("API port is undefined, execute: setx WA_PORT 3000");

    return;
}

const apiKey = process.env.WA_KEY;
const port = process.env.WA_PORT;

// Start WhatsApp Client
const client = new Client({
    webVersionCache: {
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
        type: 'remote'
    } 
});

// Create QR
client.on('qr', qr => {
    logger.info('Generating QR Code Session');
    
    var qr_png = qrImg.image(qr, { type: 'png' });

    qr_png.pipe(require('fs').createWriteStream('qrcode.png'));

    logger.info('Please scan image of file qrcode.png');
});

// Client is ready
client.on('ready', () => {
    logger.info('WhatsApp REST API is ready');
    flag = true;
});

logger.info("Initializing WhatsApp REST API");

client.initialize();

logger.info("Press CTRL+C to crash application");

// Error function
function error(err, req, res, next) {
  // log it
  console.error(err.stack);

  res.status(500);
  res.send('Internal Server Error');
}

app.use(error);

// For serve qrcode.png
app.use(express.static('./'));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

// Index
app.get('/', (req, res) => {
    var retValue = {"msg":"Welcome to WhatsApp REST API !!!"};

    res.send(retValue);
});

// Send message
app.post('/sendmsg', (req, res) => {
    if (flag) {
        var retValue = {"msg":"Ok"};
        var wakey = req.headers["wa-key"];

        if (wakey == apiKey) {
            var tel = req.body["tel"];
            var msg = req.body["msg"];

            var contact = "521" + tel.substr(tel.length - 10) + "@c.us";

            logger.info("SEND TEXT " + contact);

            client.sendMessage(contact, msg);

            res.status(200);
            res.send(retValue);
      }
      else {
            res.status(400);
            res.send("Invalid key");
      }  
    }
    else {
        res.status(400);
        res.send("Client not started");
    }
});

app.post('/sendmed', async function(req, res) {
    if (flag) {
        var retValue = {"msg":"Ok"};
        var wakey = req.headers["wa-key"];

        if (wakey == apiKey) {
            var tel = req.body["tel"];
            var msg = req.body["msg"];
            var url = req.body["url"];

            var contact = "521" + tel.substr(tel.length - 10) + "@c.us";

            logger.info("SEND MEDIA " + contact);

            var media = await MessageMedia.fromUrl(url);

            client.sendMessage(contact, media, {caption: msg});

            res.status(200);
            res.send(retValue);
      }
      else {
            res.status(400);
            res.send("Invalid key");
      }  
    }
    else {
        res.status(400);
        res.send("Client not started");
    }
});

app.post('/sendloc', async function(req, res) {
    if (flag) {
        var retValue = {"msg":"Ok"};
        var wakey = req.headers["wa-key"];

        if (wakey == apiKey) {
            var tel = req.body["tel"];
            var name = req.body["name"];
            var address = req.body["address"];
            var lat = req.body["lat"];
            var lng = req.body["lng"];

            var contact = "521" + tel.substr(tel.length - 10) + "@c.us";

            logger.info("SEND LOCATION " + contact);

            var location = new Location(lat, lng, {name:name, address:address});
            client.sendMessage(contact, location);

            res.status(200);
            res.send(retValue);
      }
      else {
            res.status(400);
            res.send("Invalid key");
      }  
    }
    else {
        res.status(400);
        res.send("Client not started");
    }
});

app.listen(port, () => {
    logger.info(`WhatsApp REST API listening on port ${port}`);
});
