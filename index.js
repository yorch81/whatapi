const qrcode = require('qrcode-terminal');

const { Client } = require('whatsapp-web.js');
const { MessageMedia } = require('whatsapp-web.js');
const { Location } = require('whatsapp-web.js');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

var flag = false;

// Validate ENV
if (typeof process.env.WA_KEY === 'undefined') {
    console.log("API Key is undefined, execute: setx WA_KEY your_api_key");

    return;
}

if (typeof process.env.WA_PORT === 'undefined') {
    console.log("API port is undefined, execute: setx WA_PORT 3000");

    return;
}

const apiKey = process.env.WA_KEY;
const port = process.env.WA_PORT;

// Start WhatsApp Client
const client = new Client();

// Create QR
client.on('qr', qr => {
    console.log('Scan QR image with WhatsApp application');
    qrcode.generate(qr, {small: true});
});

// Client is ready
client.on('ready', () => {
    console.log('WhatsApp REST API is ready');
    flag = true;
});

console.log("Initializing WhatsApp REST API");

client.initialize();

console.log("Press CTRL+C to crash application");

// Error function
function error(err, req, res, next) {
  // log it
  console.error(err.stack);

  res.status(500);
  res.send('Internal Server Error');
}

app.use(error);

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

            console.log("MSG =  " + msg);
            console.log("TO =  " + contact);

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

            console.log("MSG =  " + msg);
            console.log("TO =  " + contact);
            console.log("URL =  " + url);

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

            console.log("LOC =  " + name);
            console.log("TO =  " + contact);
            console.log("ADR =  " + address);

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
    console.log(`WhatsApp REST API listening on port ${port}`);
});
