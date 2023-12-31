"use strict";
/*
 * ANT+ profile: https://www.thisisant.com/developer/ant-plus/device-profiles/#528_tab
 * Spec sheet: https://www.thisisant.com/resources/stride-based-speed-and-distance-monitor/
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
var StrideSpeedDistanceSensorState = /** @class */ (function () {
    function StrideSpeedDistanceSensorState(deviceId) {
        this.DeviceID = deviceId;
    }
    return StrideSpeedDistanceSensorState;
}());
var StrideSpeedDistanceScanState = /** @class */ (function (_super) {
    __extends(StrideSpeedDistanceScanState, _super);
    function StrideSpeedDistanceScanState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return StrideSpeedDistanceScanState;
}(StrideSpeedDistanceSensorState));
var StrideSpeedDistanceSensor = /** @class */ (function (_super) {
    __extends(StrideSpeedDistanceSensor, _super);
    function StrideSpeedDistanceSensor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StrideSpeedDistanceSensor.prototype.attach = function (channel, deviceID) {
        _super.prototype.attach.call(this, channel, 'receive', deviceID, StrideSpeedDistanceSensor.deviceType, 0, 255, 8134);
        this.state = new StrideSpeedDistanceSensorState(deviceID);
    };
    StrideSpeedDistanceSensor.prototype.updateState = function (deviceId, data) {
        this.state.DeviceID = deviceId;
        updateState(this, this.state, data);
    };
    StrideSpeedDistanceSensor.deviceType = 124;
    return StrideSpeedDistanceSensor;
}(ant_1.AntPlusSensor));
exports.StrideSpeedDistanceSensor = StrideSpeedDistanceSensor;
var StrideSpeedDistanceScanner = /** @class */ (function (_super) {
    __extends(StrideSpeedDistanceScanner, _super);
    function StrideSpeedDistanceScanner() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.states = {};
        return _this;
    }
    StrideSpeedDistanceScanner.prototype.deviceType = function () {
        return StrideSpeedDistanceSensor.deviceType;
    };
    StrideSpeedDistanceScanner.prototype.createStateIfNew = function (deviceId) {
        if (!this.states[deviceId]) {
            this.states[deviceId] = new StrideSpeedDistanceScanState(deviceId);
        }
    };
    StrideSpeedDistanceScanner.prototype.updateRssiAndThreshold = function (deviceId, rssi, threshold) {
        this.states[deviceId].Rssi = rssi;
        this.states[deviceId].Threshold = threshold;
    };
    StrideSpeedDistanceScanner.prototype.updateState = function (deviceId, data) {
        updateState(this, this.states[deviceId], data);
    };
    return StrideSpeedDistanceScanner;
}(ant_1.AntPlusScanner));
exports.StrideSpeedDistanceScanner = StrideSpeedDistanceScanner;
function updateState(sensor, state, data) {
    var page = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA);
    if (page === 1) {
        state.TimeFractional = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 1);
        state.TimeInteger = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 2);
        state.DistanceInteger = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 3);
        state.DistanceFractional = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 4) >>> 4;
        state.SpeedInteger = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 4) & 0x0F;
        state.SpeedFractional = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 5);
        state.StrideCount = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 6);
        state.UpdateLatency = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 7);
    }
    else if (page >= 2 && page <= 15) {
        state.CadenceInteger = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 3);
        state.CadenceFractional = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 4) >>> 4;
        state.SpeedInteger = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 4) & 0x0F;
        state.SpeedFractional = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 5);
        state.Status = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 7);
        switch (page) {
            case 3:
                state.Calories = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 6);
                break;
            default:
                break;
        }
    }
    sensor.emit('ssddata', state);
    sensor.emit('ssdData', state);
}
//# sourceMappingURL=stride-speed-distance-sensors.js.map