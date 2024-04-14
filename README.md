# WhatAPI #

## Description ##
WhatsApp REST API

## Requirements ##
* [NodeJs](https://nodejs.org/en)
* [whatsapp-web.js](https://wwebjs.dev/)

## Installation ##
~~~
1.- Create environment variable WA_KEY.
2.- Create environment variable WA_PORT.
3.- Clone repository and run npm install to install dependencies.
4.- Execute node index.js.
5.- Scan QR generated qrcode.png with WhatsApp application and enjoy.
~~~

## Usage ##
~~~
1.- Send message.
curl -X POST -d '{"tel":"10_digits_number", "msg":"My message"}' -H "Content-Type: application/json" -H "wa-key: your_api_key" http://localhost:PORT/sendmsg

2.- Send media.
curl -X POST -d '{"tel":"10_digits_number", "msg":"Media message", "url":"url_media"}' -H "wa-key: your_api_key" http://localhost:PORT/sendmed

3.- Send location.
curl -X POST -d '{"tel":"10_digits_number", "name":"My place", "address":"My address", "lat":22.7415061, "lng":-98.979159}' -H "Content-Type: application/json" -H "wa-key: your_api_key" http://localhost:PORT/sendloc
~~~

## Donate ##
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=GXT4C7UZ3HFA8)

P.D. Let's go play !!!