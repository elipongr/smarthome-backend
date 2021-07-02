var express = require('express');
var app = express();
var cors = require('cors');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(cors());
const port = 3000;

var five = require("johnny-five");
var board = new five.Board({port: "COM8"});


board.on("ready", function () {
    const leds = [
        {
            name: 'Schlafzimmer EG',
            led: new five.Led(3),
            state: false,
            brightness: 250
        },
        {
            name: 'Schlafzimmer OG',
            led: new five.Led(5),
            state: false,
            brightness: 250
        },
        {
            name: 'Wohnzimmer',
            led: new five.Led(6),
            state: false,
            brightness: 250
        },
        {
            name: 'Reduit',
            led: new five.Led(10),
            state: false,
            brightness: 255
        },
        {
            name: 'Balkon OG',
            led: new five.Led(11),
            state: false,
            brightness: 250
        },
        {
            name: 'Garage',
            led: new five.Led(9),
            state: false,
            brightness: 250,
            listenToSensor: false,
            threshold: 100
        },
        {
            name: 'Garage draussen',
            led: new five.Led(2),
            state: false,
            listenToSensor: true,
            threshold: 100
        }
    ];

    const photoresistor = {
        sensor: new five.Sensor({
            pin: "A2",
            freq: 250
        })
    };
    board.repl.inject({
        pot: photoresistor.sensor
    });


    app.get('/leds', (req, res) => {
        const ledsDTO = leds.map((led) => {
            let newLed = {...led};
            delete newLed.led;
            return newLed;
        });
        res.header("Access-Control-Allow-Origin", "*");
        res.setHeader('Content-Type', 'application/json');
        res.json(ledsDTO);
    });

    photoresistor.sensor.on("data", function (value) {
        leds.map((ledObj) => {
            if (ledObj.listenToSensor) {
                if (ledObj.threshold < value) {
                    ledObj.led.off();
                } else {
                    ledObj.led.on();
                }
            }
        })
    });

    app.post('/leds', (req, res) => {
        leds.map((ledObj, i) => {
            let led = ledObj.led;
            let ledDTO = req.body[i];
            if (ledDTO.state && !ledObj.state) {
                led.on();
            } else if (!ledDTO.state && ledObj.state) {
                led.off();
            }
            if (ledDTO.brightness !== ledObj.brightness) {
                led.brightness(ledDTO.brightness);
            }

            ledObj.state = ledDTO.state;
            ledObj.brightness = ledDTO.brightness;
            ledObj.listenToSensor = ledDTO.listenToSensor;
            ledObj.threshold = ledDTO.threshold;
            return ledObj;
        });
        res.sendStatus(200);
    });
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});


module.exports = app;

