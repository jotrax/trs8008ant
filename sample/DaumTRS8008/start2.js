const DEBUG = false;

const daumErgo = require('./daumTRSSerial');
const daum = new daumErgo.daumErgometer('/dev/ttyUSB0');


function a() {

    daum.requestRunData();
    
    setTimeout(a, 1000);
}

a();
