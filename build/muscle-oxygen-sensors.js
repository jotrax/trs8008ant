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
var MuscleOxygenSensorState = /** @class */ (function () {
    function MuscleOxygenSensorState(deviceID) {
        this.DeviceID = deviceID;
    }
    return MuscleOxygenSensorState;
}());
var MuscleOxygenScanState = /** @class */ (function (_super) {
    __extends(MuscleOxygenScanState, _super);
    function MuscleOxygenScanState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MuscleOxygenScanState;
}(MuscleOxygenSensorState));
var MuscleOxygenSensor = /** @class */ (function (_super) {
    __extends(MuscleOxygenSensor, _super);
    function MuscleOxygenSensor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MuscleOxygenSensor.prototype.attach = function (channel, deviceID) {
        _super.prototype.attach.call(this, channel, 'receive', deviceID, MuscleOxygenSensor.deviceType, 0, 255, 8192);
        this.state = new MuscleOxygenSensorState(deviceID);
    };
    MuscleOxygenSensor.prototype.updateState = function (deviceId, data) {
        this.state.DeviceID = deviceId;
        updateState(this, this.state, data);
    };
    MuscleOxygenSensor.prototype._sendTimeCmd = function (cmd, cbk) {
        var now = new Date();
        var utc = Math.round((now.getTime() - Date.UTC(1989, 11, 31, 0, 0, 0, 0)) / 1000);
        var offset = -Math.round(now.getTimezoneOffset() / 15);
        var payload = [0x10, cmd & 0xFF, 0xFF, offset & 0xFF, (utc >> 0) & 0xFF, (utc >> 8) & 0xFF, (utc >> 16) & 0xFF, (utc >> 24) & 0xFF];
        var msg = ant_1.Messages.acknowledgedData(this.channel, payload);
        this.send(msg, cbk);
    };
    MuscleOxygenSensor.prototype.setUTCTime = function (cbk) {
        this._sendTimeCmd(0x00, cbk);
    };
    MuscleOxygenSensor.prototype.startSession = function (cbk) {
        this._sendTimeCmd(0x01, cbk);
    };
    MuscleOxygenSensor.prototype.stopSession = function (cbk) {
        this._sendTimeCmd(0x02, cbk);
    };
    MuscleOxygenSensor.prototype.setLap = function (cbk) {
        this._sendTimeCmd(0x03, cbk);
    };
    MuscleOxygenSensor.deviceType = 0x1F;
    return MuscleOxygenSensor;
}(ant_1.AntPlusSensor));
exports.MuscleOxygenSensor = MuscleOxygenSensor;
var MuscleOxygenScanner = /** @class */ (function (_super) {
    __extends(MuscleOxygenScanner, _super);
    function MuscleOxygenScanner() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.states = {};
        return _this;
    }
    MuscleOxygenScanner.prototype.deviceType = function () {
        return MuscleOxygenSensor.deviceType;
    };
    MuscleOxygenScanner.prototype.createStateIfNew = function (deviceId) {
        if (!this.states[deviceId]) {
            this.states[deviceId] = new MuscleOxygenScanState(deviceId);
        }
    };
    MuscleOxygenScanner.prototype.updateRssiAndThreshold = function (deviceId, rssi, threshold) {
        this.states[deviceId].Rssi = rssi;
        this.states[deviceId].Threshold = threshold;
    };
    MuscleOxygenScanner.prototype.updateState = function (deviceId, data) {
        updateState(this, this.states[deviceId], data);
    };
    return MuscleOxygenScanner;
}(ant_1.AntPlusScanner));
exports.MuscleOxygenScanner = MuscleOxygenScanner;
function updateState(sensor, state, data) {
    var oldEventCount = state._EventCount || 0;
    var page = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA);
    switch (page) {
        case 0x01: {
            var eventCount = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 1);
            var notifications = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 2);
            var capabilities = data.readUInt16LE(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 3);
            var total = data.readUInt16LE(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 4) & 0xFFF;
            var previous = (data.readUInt16LE(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 5) >> 4) & 0x3FF;
            var current = (data.readUInt16LE(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 6) >> 6) & 0x3FF;
            if (eventCount !== oldEventCount) {
                state._EventCount = eventCount;
                if (oldEventCount > eventCount) { //Hit rollover value
                    eventCount += 255;
                }
            }
            state.UTCTimeRequired = (notifications & 0x01) === 0x01;
            state.SupportANTFS = (capabilities & 0x01) === 0x01;
            switch ((capabilities >> 1) & 0x7) {
                case 1:
                    state.MeasurementInterval = 0.25;
                    break;
                case 2:
                    state.MeasurementInterval = 0.5;
                    break;
                case 3:
                    state.MeasurementInterval = 1;
                    break;
                case 4:
                    state.MeasurementInterval = 2;
                    break;
                default: delete state.MeasurementInterval;
            }
            switch (total) {
                case 0xFFE:
                    state.TotalHemoglobinConcentration = 'AmbientLightTooHigh';
                    break;
                case 0xFFF:
                    state.TotalHemoglobinConcentration = 'Invalid';
                    break;
                default: state.TotalHemoglobinConcentration = total;
            }
            switch (previous) {
                case 0x3FE:
                    state.PreviousSaturatedHemoglobinPercentage = 'AmbientLightTooHigh';
                    break;
                case 0x3FF:
                    state.PreviousSaturatedHemoglobinPercentage = 'Invalid';
                    break;
                default: state.PreviousSaturatedHemoglobinPercentage = previous;
            }
            switch (current) {
                case 0x3FE:
                    state.CurrentSaturatedHemoglobinPercentage = 'AmbientLightTooHigh';
                    break;
                case 0x3FF:
                    state.CurrentSaturatedHemoglobinPercentage = 'Invalid';
                    break;
                default: state.CurrentSaturatedHemoglobinPercentage = current;
            }
            break;
        }
        case 0x50: {
            state.HwVersion = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 3);
            state.ManId = data.readUInt16LE(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 4);
            state.ModelNum = data.readUInt16LE(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 6);
            break;
        }
        case 0x51: {
            var swRevSup = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 2);
            var swRevMain = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 3);
            var serial = data.readInt32LE(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 4);
            state.SwVersion = swRevMain;
            if (swRevSup !== 0xFF) {
                state.SwVersion += swRevSup / 1000;
            }
            if (serial !== 0xFFFFFFFF) {
                state.SerialNumber = serial;
            }
            break;
        }
        case 0x52: {
            var batteryId = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 2);
            var operatingTime = data.readUInt32LE(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 3) & 0xFFFFFF;
            var batteryFrac = data.readInt32LE(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 6);
            var batteryStatus = data.readInt32LE(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 7);
            state.OperatingTime = operatingTime * (((batteryStatus & 0x80) === 0x80) ? 2 : 16);
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
        default:
            return;
    }
    if (page !== 0x01 || state._EventCount !== oldEventCount) {
        sensor.emit('oxygenData', state);
    }
}
//# sourceMappingURL=muscle-oxygen-sensors.js.map