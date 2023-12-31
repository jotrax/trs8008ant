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
var CadenceSensorState = /** @class */ (function () {
    function CadenceSensorState(deviceID) {
        this.DeviceID = deviceID;
    }
    return CadenceSensorState;
}());
var CadenceScanState = /** @class */ (function (_super) {
    __extends(CadenceScanState, _super);
    function CadenceScanState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CadenceScanState;
}(CadenceSensorState));
var CadenceSensor = /** @class */ (function (_super) {
    __extends(CadenceSensor, _super);
    function CadenceSensor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.wheelCircumference = 2.199; // default 70cm wheel
        return _this;
    }
    CadenceSensor.prototype.setWheelCircumference = function (wheelCircumference) {
        this.wheelCircumference = wheelCircumference;
    };
    CadenceSensor.prototype.attach = function (channel, deviceID) {
        _super.prototype.attach.call(this, channel, 'receive', deviceID, CadenceSensor.deviceType, 0, 255, 8086);
        this.state = new CadenceSensorState(deviceID);
    };
    CadenceSensor.prototype.updateState = function (deviceId, data) {
        this.state.DeviceID = deviceId;
        updateState(this, this.state, data);
    };
    CadenceSensor.deviceType = 0x7A;
    return CadenceSensor;
}(ant_1.AntPlusSensor));
exports.CadenceSensor = CadenceSensor;
var CadenceScanner = /** @class */ (function (_super) {
    __extends(CadenceScanner, _super);
    function CadenceScanner() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.wheelCircumference = 2.199; // default 70cm wheel
        _this.states = {};
        return _this;
    }
    CadenceScanner.prototype.deviceType = function () {
        return CadenceSensor.deviceType;
    };
    CadenceScanner.prototype.setWheelCircumference = function (wheelCircumference) {
        this.wheelCircumference = wheelCircumference;
    };
    CadenceScanner.prototype.createStateIfNew = function (deviceId) {
        if (!this.states[deviceId]) {
            this.states[deviceId] = new CadenceScanState(deviceId);
        }
    };
    CadenceScanner.prototype.updateRssiAndThreshold = function (deviceId, rssi, threshold) {
        this.states[deviceId].Rssi = rssi;
        this.states[deviceId].Threshold = threshold;
    };
    CadenceScanner.prototype.updateState = function (deviceId, data) {
        updateState(this, this.states[deviceId], data);
    };
    return CadenceScanner;
}(ant_1.AntPlusScanner));
exports.CadenceScanner = CadenceScanner;
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
    var oldCadenceTime = state.CadenceEventTime;
    var oldCadenceCount = state.CumulativeCadenceRevolutionCount;
    var cadenceTime = data.readUInt16LE(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 4);
    var cadenceCount = data.readUInt16LE(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 6);
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
}
//# sourceMappingURL=cadence-sensors.js.map