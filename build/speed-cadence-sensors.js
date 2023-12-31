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
var SpeedCadenceSensorState = /** @class */ (function () {
    function SpeedCadenceSensorState(deviceID) {
        this.DeviceID = deviceID;
    }
    return SpeedCadenceSensorState;
}());
var SpeedCadenceScanState = /** @class */ (function (_super) {
    __extends(SpeedCadenceScanState, _super);
    function SpeedCadenceScanState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SpeedCadenceScanState;
}(SpeedCadenceSensorState));
var SpeedCadenceSensor = /** @class */ (function (_super) {
    __extends(SpeedCadenceSensor, _super);
    function SpeedCadenceSensor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.wheelCircumference = 2.199; // default 70cm wheel
        return _this;
    }
    SpeedCadenceSensor.prototype.setWheelCircumference = function (wheelCircumference) {
        this.wheelCircumference = wheelCircumference;
    };
    SpeedCadenceSensor.prototype.attach = function (channel, deviceID) {
        _super.prototype.attach.call(this, channel, 'receive', deviceID, SpeedCadenceSensor.deviceType, 0, 255, 8086);
        this.state = new SpeedCadenceSensorState(deviceID);
    };
    SpeedCadenceSensor.prototype.updateState = function (deviceId, data) {
        this.state.DeviceID = deviceId;
        updateState(this, this.state, data);
    };
    SpeedCadenceSensor.deviceType = 0x79;
    return SpeedCadenceSensor;
}(ant_1.AntPlusSensor));
exports.SpeedCadenceSensor = SpeedCadenceSensor;
var SpeedCadenceScanner = /** @class */ (function (_super) {
    __extends(SpeedCadenceScanner, _super);
    function SpeedCadenceScanner() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.wheelCircumference = 2.199; // default 70cm wheel
        _this.states = {};
        return _this;
    }
    SpeedCadenceScanner.prototype.deviceType = function () {
        return SpeedCadenceSensor.deviceType;
    };
    SpeedCadenceScanner.prototype.setWheelCircumference = function (wheelCircumference) {
        this.wheelCircumference = wheelCircumference;
    };
    SpeedCadenceScanner.prototype.createStateIfNew = function (deviceId) {
        if (!this.states[deviceId]) {
            this.states[deviceId] = new SpeedCadenceScanState(deviceId);
        }
    };
    SpeedCadenceScanner.prototype.updateRssiAndThreshold = function (deviceId, rssi, threshold) {
        this.states[deviceId].Rssi = rssi;
        this.states[deviceId].Threshold = threshold;
    };
    SpeedCadenceScanner.prototype.updateState = function (deviceId, data) {
        updateState(this, this.states[deviceId], data);
    };
    return SpeedCadenceScanner;
}(ant_1.AntPlusScanner));
exports.SpeedCadenceScanner = SpeedCadenceScanner;
function updateState(sensor, state, data) {
    //get old state for calculating cumulative values
    var oldCadenceTime = state.CadenceEventTime;
    var oldCadenceCount = state.CumulativeCadenceRevolutionCount;
    var oldSpeedTime = state.SpeedEventTime;
    var oldSpeedCount = state.CumulativeSpeedRevolutionCount;
    var cadenceTime = data.readUInt16LE(ant_1.Messages.BUFFER_INDEX_MSG_DATA);
    var cadenceCount = data.readUInt16LE(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 2);
    var speedEventTime = data.readUInt16LE(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 4);
    var speedRevolutionCount = data.readUInt16LE(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 6);
    if (cadenceTime !== oldCadenceTime) {
        state.CadenceEventTime = cadenceTime;
        state.CumulativeCadenceRevolutionCount = cadenceCount;
        if (oldCadenceTime > cadenceTime) { //Hit rollover value
            cadenceTime += (1024 * 64);
        }
        if (oldCadenceCount > cadenceCount) { //Hit rollover value
            cadenceCount += (1024 * 64);
        }
        var cadence = ((60 * (cadenceCount - oldCadenceCount) * 1024) / (cadenceTime - oldCadenceTime));
        if (!isNaN(cadence)) {
            state.CalculatedCadence = cadence;
            sensor.emit('cadenceData', state);
        }
    }
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
//# sourceMappingURL=speed-cadence-sensors.js.map