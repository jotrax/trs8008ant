const DEBUG = false;

const speedMeter = function (SensorPin){
    // const gpio = require('rpi-gpio');
    
    const treadmillLength = 293;   //cm
    
    let watchDog = 0;
    let timePrev;
    let speed = 10;
    let increment = 1;
    let prevSpeed = 0;

    // gpio.setup(7, gpio.DIR_IN, gpio.EDGE_FALLING);	// Pin used on raspberry pi for sensor

    /*gpio.on('change', function (channel, value) {
        let timeDelta = Date.now() - timePrev;
        speed = ((((1000 / timeDelta) * 3600) * treadmillLength) / 100000).toFixed(1);
        timePrev = Date.now();
        watchDog = 0;
    });*/

    this.getSpeed = function () {

        if (speed > 20) {
            increment = -1;
        }
        if (speed < 10) {
            increment = 1;
        }

        speed = speed + increment;

        return speed;
    }
};
module.exports.speedMeter = speedMeter;
