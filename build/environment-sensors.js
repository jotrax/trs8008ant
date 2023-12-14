"use strict";
/*
 * Copyright (c) 2019 Tom Cosgrove
 * Copyright (c) 2015 Alessandro Vergani
 *
 * This file is licensed under the MIT License (MIT):
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
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
/*
 * ANT+ profile: https://www.thisisant.com/developer/ant-plus/device-profiles/#524_tab
 * Spec sheet: https://www.thisisant.com/resources/environment/
 */
var ant_1 = require("./ant");
var EnvironmentSensorState = /** @class */ (function () {
    function EnvironmentSensorState(deviceId) {
        this.DeviceID = deviceId;
    }
    return EnvironmentSensorState;
}());
var EnvironmentScanState = /** @class */ (function (_super) {
    __extends(EnvironmentScanState, _super);
    function EnvironmentScanState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return EnvironmentScanState;
}(EnvironmentSensorState));
var EnvironmentSensor = /** @class */ (function (_super) {
    __extends(EnvironmentSensor, _super);
    function EnvironmentSensor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EnvironmentSensor.prototype.attach = function (channel, deviceID) {
        _super.prototype.attach.call(this, channel, 'receive', deviceID, EnvironmentSensor.deviceType, 0, 255, 8192);
        this.state = new EnvironmentSensorState(deviceID);
    };
    EnvironmentSensor.prototype.updateState = function (deviceId, data) {
        this.state.DeviceID = deviceId;
        updateState(this, this.state, data);
    };
    EnvironmentSensor.deviceType = 25;
    return EnvironmentSensor;
}(ant_1.AntPlusSensor));
exports.EnvironmentSensor = EnvironmentSensor;
var EnvironmentScanner = /** @class */ (function (_super) {
    __extends(EnvironmentScanner, _super);
    function EnvironmentScanner() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.states = {};
        return _this;
    }
    EnvironmentScanner.prototype.deviceType = function () {
        return EnvironmentSensor.deviceType;
    };
    EnvironmentScanner.prototype.createStateIfNew = function (deviceId) {
        if (!this.states[deviceId]) {
            this.states[deviceId] = new EnvironmentScanState(deviceId);
        }
    };
    EnvironmentScanner.prototype.updateRssiAndThreshold = function (deviceId, rssi, threshold) {
        this.states[deviceId].Rssi = rssi;
        this.states[deviceId].Threshold = threshold;
    };
    EnvironmentScanner.prototype.updateState = function (deviceId, data) {
        updateState(this, this.states[deviceId], data);
    };
    return EnvironmentScanner;
}(ant_1.AntPlusScanner));
exports.EnvironmentScanner = EnvironmentScanner;
function updateState(sensor, state, data) {
    var page = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA);
    if (page === 1) {
        state.EventCount = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 2);
        state.Temperature = data.readUInt16LE(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 6) / 100;
    }
    sensor.emit('envdata', state);
    sensor.emit('envData', state);
}
//# sourceMappingURL=environment-sensors.js.map