"use strict";
/*
 * ANT+ profile: https://www.thisisant.com/developer/ant-plus/device-profiles/#523_tab
 * Spec sheet: https://www.thisisant.com/resources/bicycle-speed-and-cadence/
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ant_1 = require("./ant");
var SpeedSensorState = /** @class */ (function () {
    function SpeedSensorState(deviceID) {
        this.DeviceID = deviceID;
    }
    return SpeedSensorState;
}());
var SpeedScanState = /** @class */ (function (_super) {
    __extends(SpeedScanState, _super);
    function SpeedScanState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SpeedScanState;
}(SpeedSensorState));
var SpeedSensor = /** @class */ (function (_super) {
    __extends(SpeedSensor, _super);
    function SpeedSensor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.wheelCircumference = 2.199; // default 70cm wheel
        return _this;
    }
    SpeedSensor.prototype.setWheelCircumference = function (wheelCircumference) {
        this.wheelCircumference = wheelCircumference;
    };
    SpeedSensor.prototype.attach = function (channel, deviceID) {
        _super.prototype.attach.call(this, channel, 'receive', deviceID, SpeedSensor.deviceType, 0, 255, 8086);
        this.state = new SpeedSensorState(deviceID);
    };
    SpeedSensor.prototype.updateState = function (deviceId, data) {
        this.state.DeviceID = deviceId;
        updateState(this, this.state, data);
    };
    SpeedSensor.deviceType = 0x7B;
    return SpeedSensor;
}(ant_1.AntPlusSensor));
exports.SpeedSensor = SpeedSensor;
var SpeedScanner = /** @class */ (function (_super) {
    __extends(SpeedScanner, _super);
    function SpeedScanner() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.wheelCircumference = 2.199; // default 70cm wheel
        _this.states = {};
        return _this;
    }
    SpeedScanner.prototype.deviceType = function () {
        return SpeedSensor.deviceType;
    };
    SpeedScanner.prototype.setWheelCircumference = function (wheelCircumference) {
        this.wheelCircumference = wheelCircumference;
    };
    SpeedScanner.prototype.createStateIfNew = function (deviceId) {
        if (!this.states[deviceId]) {
            this.states[deviceId] = new SpeedScanState(deviceId);
        }
    };
    SpeedScanner.prototype.updateRssiAndThreshold = function (deviceId, rssi, threshold) {
        this.states[deviceId].Rssi = rssi;
        this.states[deviceId].Threshold = threshold;
    };
    SpeedScanner.prototype.updateState = function (deviceId, data) {
        updateState(this, this.states[deviceId], data);
    };
    return SpeedScanner;
}(ant_1.AntPlusScanner));
exports.SpeedScanner = SpeedScanner;
var TOGGLE_MASK = 0x80;
function updateState(sensor, state, data) {
    var pageNum = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA);
    switch (pageNum & ~TOGGLE_MASK) { //check the new pages and remove the toggle bit
        case 1:
            //decode the cumulative operating time
            state.OperatingTime = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 1);
            state.OperatingTime |= data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 2) << 8;
            state.OperatingTime |= data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 3) << 16;
            state.OperatingTime *= 2;
            break;
        case 2:
            //decode the Manufacturer ID
            state.ManId = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 1);
            //decode the 4 byte serial number
            state.SerialNumber = state.DeviceID;
            state.SerialNumber |= data.readUInt16LE(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 2) << 16;
            state.SerialNumber >>>= 0;
            break;
        case 3:
            //decode HW version, SW version, and model number
            state.HwVersion = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 1);
            state.SwVersion = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 2);
            state.ModelNum = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 3);
            break;
        case 4: {
            var batteryFrac = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 2);
            var batteryStatus = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 3);
            state.BatteryVoltage = (batteryStatus & 0x0F) + (batteryFrac / 256);
            var batteryFlags = (batteryStatus & 0x70) >>> 4;
            switch (batteryFlags) {
                case 1:
                    state.BatteryStatus = 'New';
                    break;
                case 2:
                    state.BatteryStatus = 'Good';
                    break;
                case 3:
                    state.BatteryStatus = 'Ok';
                    break;
                case 4:
                    state.BatteryStatus = 'Low';
                    break;
                case 5:
                    state.BatteryStatus = 'Critical';
                    break;
                default:
                    state.BatteryVoltage = undefined;
                    state.BatteryStatus = 'Invalid';
                    break;
            }
            break;
        }
        case 5:
            state.Motion = (data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 1) & 0x01) === 0x01;
            break;
        default:
            break;
    }
    //get old state for calculating cumulative values
    var oldSpeedTime = state.SpeedEventTime;
    var oldSpeedCount = state.CumulativeSpeedRevolutionCount;
    var speedEventTime = data.readUInt16LE(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 4);
    var speedRevolutionCount = data.readUInt16LE(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 6);
    if (speedEventTime !== oldSpeedTime) {
        state.SpeedEventTime = speedEventTime;
        state.CumulativeSpeedRevolutionCount = speedRevolutionCount;
        if (oldSpeedTime > speedEventTime) { //Hit rollover value
            speedEventTime += (1024 * 64);
        }
        if (oldSpeedCount > speedRevolutionCount) { //Hit rollover value
            speedRevolutionCount += (1024 * 64);
        }
        var distance = sensor.wheelCircumference * (speedRevolutionCount - oldSpeedCount);
        state.CalculatedDistance = distance;
        //speed in m/sec
        var speed = (distance * 1024) / (speedEventTime - oldSpeedTime);
        if (!isNaN(speed)) {
            state.CalculatedSpeed = speed;
            sensor.emit('speedData', state);
        }
    }
}
//# sourceMappingURL=speed-sensors.js.map