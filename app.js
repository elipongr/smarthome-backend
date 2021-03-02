var express = require('express');
var app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
const port = 3000;

var five = require("johnny-five");
var board = new five.Board({port: "COM8"});


board.on("ready", function () {
    const leds = [
        {
            name: 'led3',
            led: new five.Led(3),
            state: false,
            brightness: 250
        },
        {
            name: 'led5',
            led: new five.Led(5),
            state: false,
            brightness: 250
        },
        {
            name: 'led6',
            led: new five.Led(6),
            state: false,
            brightness: 250
        },
        {
            name: 'led9',
            led: new five.Led(9),
            state: false,
            brightness: 250
        },
        {
            name: 'led10',
            led: new five.Led(10),
            state: false,
            brightness: 255
        },
        {
            name: 'led11',
            led: new five.Led(11),
            state: false,
            brightness: 250
        }];


    app.get('/leds', (req, res) => {
        const ledsDTO = leds.map((led) => {
            let newLed = {...led};
            delete newLed.led;
            return newLed;
        });
        res.header("Access-Control-Allow-Origin", "*");
        res.setHeader('Content-Type', 'application/json');
        console.log("get leds");
        res.json(ledsDTO);
    });


    app.post('/leds', (req, res) => {
        leds.map((ledObj, i) => {
            let led = ledObj.led;
            let ledDTO = req.body[i];
            if (ledDTO.state && !ledObj.state) {
                led.on();
                ledObj.state = true;
            } else if (!ledDTO.state && ledObj.state) {
                led.off();
                ledObj.state = false;
            }
            if (ledDTO.brightness !== ledObj.brightness) {
                led.brightness(ledDTO.brightness);
                ledObj.brightness = ledDTO.brightness;
            }
            return ledObj;
        });
        res.header("Access-Control-Allow-Origin", "*");
        res.sendStatus(200);
    });

});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});


module.exports = app;

