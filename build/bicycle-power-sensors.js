"use strict";
/*
* ANT+ profile: https://www.thisisant.com/developer/ant-plus/device-profiles/#521_tab
* Spec sheet: https://www.thisisant.com/resources/bicycle-power/
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
var BicyclePowerSensorState = /** @class */ (function () {
    function BicyclePowerSensorState(deviceID) {
        this.offset = 0;
        this.DeviceID = deviceID;
    }
    return BicyclePowerSensorState;
}());
var BicyclePowerScanState = /** @class */ (function (_super) {
    __extends(BicyclePowerScanState, _super);
    function BicyclePowerScanState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return BicyclePowerScanState;
}(BicyclePowerSensorState));
var BicyclePowerSensor = /** @class */ (function (_super) {
    __extends(BicyclePowerSensor, _super);
    function BicyclePowerSensor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BicyclePowerSensor.prototype.attach = function (channel, deviceID) {
        _super.prototype.attach.call(this, channel, 'receive', deviceID, BicyclePowerSensor.deviceType, 0, 255, 8182);
        this.state = new BicyclePowerSensorState(deviceID);
    };
    BicyclePowerSensor.prototype.updateState = function (deviceId, data) {
        this.state.DeviceID = deviceId;
        updateState(this, this.state, data);
    };
    BicyclePowerSensor.deviceType = 0x0B;
    return BicyclePowerSensor;
}(ant_1.AntPlusSensor));
exports.BicyclePowerSensor = BicyclePowerSensor;
var BicyclePowerScanner = /** @class */ (function (_super) {
    __extends(BicyclePowerScanner, _super);
    function BicyclePowerScanner() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.states = {};
        return _this;
    }
    BicyclePowerScanner.prototype.deviceType = function () {
        return BicyclePowerSensor.deviceType;
    };
    BicyclePowerScanner.prototype.createStateIfNew = function (deviceId) {
        if (!this.states[deviceId]) {
            this.states[deviceId] = new BicyclePowerScanState(deviceId);
        }
    };
    BicyclePowerScanner.prototype.updateRssiAndThreshold = function (deviceId, rssi, threshold) {
        this.states[deviceId].Rssi = rssi;
        this.states[deviceId].Threshold = threshold;
    };
    BicyclePowerScanner.prototype.updateState = function (deviceId, data) {
        updateState(this, this.states[deviceId], data);
    };
    return BicyclePowerScanner;
}(ant_1.AntPlusScanner));
exports.BicyclePowerScanner = BicyclePowerScanner;
function updateState(sensor, state, data) {
    var page = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA);
    switch (page) {
        case 0x01: {
            var calID = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 1);
            if (calID === 0x10) {
                var calParam = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 2);
                if (calParam === 0x01) {
                    state.offset = data.readUInt16LE(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 6);
                }
            }
            break;
        }
        case 0x10: {
            var pedalPower = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 2);
            if (pedalPower !== 0xFF) {
                if (pedalPower & 0x80) {
                    state.PedalPower = pedalPower & 0x7F;
                    state.RightPedalPower = state.PedalPower;
                    state.LeftPedalPower = 100 - state.RightPedalPower;
                }
                else {
                    state.PedalPower = pedalPower & 0x7F;
                    state.RightPedalPower = undefined;
                    state.LeftPedalPower = undefined;
                }
            }
            else {
                state.PedalPower = undefined;
                state.RightPedalPower = undefined;
                state.LeftPedalPower = undefined;
            }
            var cadence = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 3);
            if (cadence !== 0xFF) {
                state.Cadence = cadence;
            }
            else {
                state.Cadence = undefined;
            }
            state.AccumulatedPower = data.readUInt16LE(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 4);
            state.Power = data.readUInt16LE(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 6);
            break;
        }
        case 0x20: {
            var oldEventCount = state.EventCount;
            var oldTimeStamp = state.TimeStamp;
            var oldTorqueTicksStamp = state.TorqueTicksStamp;
            var eventCount = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 1);
            var slope = data.readUInt16LE(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 3);
            var timeStamp = data.readUInt16LE(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 5);
            var torqueTicksStamp = data.readUInt16LE(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 7);
            if (timeStamp !== oldTimeStamp && eventCount !== oldEventCount) {
                state.EventCount = eventCount;
                if (oldEventCount > eventCount) { //Hit rollover value
                    eventCount += 255;
                }
                state.TimeStamp = timeStamp;
                if (oldTimeStamp > timeStamp) { //Hit rollover value
                    timeStamp += 65400;
                }
                state.Slope = slope;
                state.TorqueTicksStamp = torqueTicksStamp;
                if (oldTorqueTicksStamp > torqueTicksStamp) { //Hit rollover value
                    torqueTicksStamp += 65535;
                }
                var elapsedTime = (timeStamp - oldTimeStamp) * 0.0005;
                var torqueTicks = torqueTicksStamp - oldTorqueTicksStamp;
                var cadencePeriod = elapsedTime / (eventCount - oldEventCount); // s
                var cadence = Math.round(60 / cadencePeriod); // rpm
                state.CalculatedCadence = cadence;
                var torqueFrequency = (1 / (elapsedTime / torqueTicks)) - state.offset; // Hz
                var torque = torqueFrequency / (slope / 10); // Nm
                state.CalculatedTorque = torque;
                state.CalculatedPower = torque * cadence * Math.PI / 30; // Watts
            }
            break;
        }
        default:
            return;
    }
    sensor.emit('powerData', state);
}
//# sourceMappingURL=bicycle-power-sensors.js.map