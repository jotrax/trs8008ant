"use strict";
/*
 * ANT+ profile: https://www.thisisant.com/developer/ant-plus/device-profiles/#526_tab
 * Spec sheet: https://www.thisisant.com/resources/heart-rate-monitor/
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
var HeartRateSensorState = /** @class */ (function () {
    function HeartRateSensorState(deviceId) {
        this.DeviceID = deviceId;
    }
    return HeartRateSensorState;
}());
var HeartRateScannerState = /** @class */ (function (_super) {
    __extends(HeartRateScannerState, _super);
    function HeartRateScannerState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return HeartRateScannerState;
}(HeartRateSensorState));
var PageState;
(function (PageState) {
    PageState[PageState["INIT_PAGE"] = 0] = "INIT_PAGE";
    PageState[PageState["STD_PAGE"] = 1] = "STD_PAGE";
    PageState[PageState["EXT_PAGE"] = 2] = "EXT_PAGE";
})(PageState || (PageState = {}));
var HeartRateSensor = /** @class */ (function (_super) {
    __extends(HeartRateSensor, _super);
    function HeartRateSensor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.page = {
            oldPage: -1,
            pageState: PageState.INIT_PAGE,
        };
        return _this;
    }
    HeartRateSensor.prototype.attach = function (channel, deviceID) {
        _super.prototype.attach.call(this, channel, 'receive', deviceID, HeartRateSensor.deviceType, 0, 255, 8070);
        this.state = new HeartRateSensorState(deviceID);
    };
    HeartRateSensor.prototype.updateState = function (deviceId, data) {
        this.state.DeviceID = deviceId;
        updateState(this, this.state, this.page, data);
    };
    HeartRateSensor.deviceType = 120;
    return HeartRateSensor;
}(ant_1.AntPlusSensor));
exports.HeartRateSensor = HeartRateSensor;
var HeartRateScanner = /** @class */ (function (_super) {
    __extends(HeartRateScanner, _super);
    function HeartRateScanner() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.states = {};
        _this.pages = {};
        return _this;
    }
    HeartRateScanner.prototype.deviceType = function () {
        return HeartRateSensor.deviceType;
    };
    HeartRateScanner.prototype.createStateIfNew = function (deviceId) {
        if (!this.states[deviceId]) {
            this.states[deviceId] = new HeartRateScannerState(deviceId);
        }
        if (!this.pages[deviceId]) {
            this.pages[deviceId] = { oldPage: -1, pageState: PageState.INIT_PAGE };
        }
    };
    HeartRateScanner.prototype.updateRssiAndThreshold = function (deviceId, rssi, threshold) {
        this.states[deviceId].Rssi = rssi;
        this.states[deviceId].Threshold = threshold;
    };
    HeartRateScanner.prototype.updateState = function (deviceId, data) {
        updateState(this, this.states[deviceId], this.pages[deviceId], data);
    };
    return HeartRateScanner;
}(ant_1.AntPlusScanner));
exports.HeartRateScanner = HeartRateScanner;
var TOGGLE_MASK = 0x80;
function updateState(sensor, state, page, data) {
    var pageNum = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA);
    if (page.pageState === PageState.INIT_PAGE) {
        page.pageState = PageState.STD_PAGE; // change the state to STD_PAGE and allow the checking of old and new pages
        // decode with pages if the page byte or toggle bit has changed
    }
    else if ((pageNum !== page.oldPage) || (page.pageState === PageState.EXT_PAGE)) {
        page.pageState = PageState.EXT_PAGE; // set the state to use the extended page format
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
            case 4:
                //decode the previous heart beat measurement time
                state.PreviousBeat = data.readUInt16LE(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 2);
                break;
            case 5:
                state.IntervalAverage = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 1);
                state.IntervalMax = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 2);
                state.SessionAverage = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 3);
                break;
            case 6:
                state.SupportedFeatures = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 2);
                state.EnabledFeatures = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 3);
                break;
            case 7: {
                var batteryLevel = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 1);
                var batteryFrac = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 2);
                var batteryStatus = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 3);
                if (batteryLevel !== 0xFF) {
                    state.BatteryLevel = batteryLevel;
                }
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
                break;
        }
    }
    // decode the last four bytes of the HRM format, the first byte of this message is the channel number
    DecodeDefaultHRM(state, data.slice(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 4));
    page.oldPage = pageNum;
    sensor.emit('hbdata', state);
    sensor.emit('hbData', state);
}
function DecodeDefaultHRM(state, pucPayload) {
    // decode the measurement time data (two bytes)
    state.BeatTime = pucPayload.readUInt16LE(0);
    // decode the measurement count data
    state.BeatCount = pucPayload.readUInt8(2);
    // decode the measurement count data
    state.ComputedHeartRate = pucPayload.readUInt8(3);
}
//# sourceMappingURL=heart-rate-sensors.js.map