var express = require('express');
var app = express();
const port = 3000;

var five = require("johnny-five");
var board = new five.Board({port: "COM8"});


board.on("ready", function() {
    let led = new five.Led(6);
    // let photoresistor = new five.Sensor({
    //     pin: "A0",
    //     freq: 250
    // });
    //
    // board.repl.inject({
    //     pot: photoresistor
    // });\
    //
    // photoresistor.on("data", function() {
    //     console.log(this.value);
    // });

    app.get('/start', (req, res) => {
        led.on();
        res.send("led on")
    });

    app.get('/brightness', (req, res) => {
        led.brightness(req.query.brightness);
        res.send("brightness level = " + req.query.brightness)
    });

    app.get('/stop', (req, res) => {
        led.off();
        res.send("led off")
    });
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});


module.exports = app;
