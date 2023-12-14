
const DEBUG = true;
const SIMULATE = true;

const { SerialPort } = require('serialport')
const { InterByteTimeoutParser } = require('@serialport/parser-inter-byte-timeout')

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}


const daumErgometer = function (serialportName)
{    
    const read_run_data = new Uint8Array([0x40, 0x00]);

    let stopwatchStart = 0;

    let ergoPower = 0;
    let ergoCadence = 0;
    let ergoSpeed = 0;

    // create serial port handle and open it
    const ergoSerialPort = new SerialPort({ path: serialportName, baudRate: 9600 }, function (err) 
    {
        if (err) 
        {
            return console.log('Error: ', err.message)
        }
    })

    ergoSerialPort.on('error', function(err)
    {
        console.log('Error: ', err.message)
    })

    // will emit data if there is a pause between packets (in milliseconds)
    const parser = ergoSerialPort.pipe(new InterByteTimeoutParser({ interval: 100 }))
    parser.on('data', function (data) {

        if (DEBUG)
        {
            var elapsedMS = Date.now() - stopwatchStart;
            console.log('Received ' + data.length + ' bytes after ' + elapsedMS + 'ms.');
        }

        
        var cmd = data[0];
        var address = data[1];

        var movement = data[4]; // 0..idle, 1..movement

        /*
        var person_id = data[2];
        var program_id = data[3];
        var power = data[5] * 5; // watt
        var cadence = data[6]; // rpm
        var speed = data[7]; // km/h
        var distance = data[8] + data[9]*256 / 10; // km
        var movement_duration = data[10]*256 + data[11];
        var energy = data[12]*256 + data[13];
        var heartrate = data[14];
        var heartrate_status = data[15];
        var gear = data[16];
        var energy_cumulated = data[17]*256 + data[18];
        */

        if ( (cmd == 0x40) && (address == 0x00) )
        {
            ergoPower = data[5] * 5; // watt
            
            if (movement == 1)
            {
                ergoCadence = data[6]; // rpm
            }
            else
            {
                ergoCadence = 0;
            }
            ergoSpeed = data[7]; // km/h

            if (DEBUG)
            {
                console.log('Power:', ergoPower, 'Cadence: ', ergoCadence, 'Speed: ', ergoSpeed);
            }
        }
        else
        {
            if (DEBUG)
            {
                console.log('Invalid data received');
            }
        }

    })


    this.requestRunData = function ()
    {
        if (SIMULATE)
        {
            ergoPower = getRandomInt(100, 120);
            ergoCadence = getRandomInt(70, 90);
            ergoSpeed = getRandomInt(20, 25);

            console.log('SIM-MODE - Power:', ergoPower, 'Cadence: ', ergoCadence, 'Speed: ', ergoSpeed);

            return;
        }

        if (DEBUG)
        {
            console.log('Requesting run data...');
        }
        ergoSerialPort.write(read_run_data);
        stopwatchStart = Date.now();
    }

    this.getPower = function ()
    {
        return ergoPower;
    }

    this.getCadence = function ()
    {
        return ergoCadence;
    }

    this.getSpeed = function ()
    {
        return ergoSpeed;
    }

};
module.exports.daumErgometer = daumErgometer;

