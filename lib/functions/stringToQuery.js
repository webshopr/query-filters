"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFromString = void 0;
var lodash_1 = require("lodash");
var constants_1 = require("../constants");
function parseFromString(query) {
    var _a;
    var filters = {};
    if (!query || !(0, lodash_1.isString)(query) || !query.length)
        return {};
    var rawRules = query.split(constants_1.RULES_SEPARATOR);
    var parsedRules = rawRules.map(function (rule) { return rule.trim().split(constants_1.RULES_DIVIDER).map(function (r) { return r.trim(); }); });
    for (var _i = 0, parsedRules_1 = parsedRules; _i < parsedRules_1.length; _i++) {
        var rule = parsedRules_1[_i];
        var _b = parseRule(rule), key = _b[0], operator = _b[1], value = _b[2];
        filters[key] = __assign(__assign({}, filters[key]), (_a = {}, _a[operator] = value, _a));
    }
    return filters;
}
exports.parseFromString = parseFromString;
// Private functions
function parseRule(rule) {
    if (!(Array.isArray(rule) && rule.length === 3))
        throw new Error("Invalid rule: ".concat(rule));
    // Key
    var key = rule[0];
    if (!key || !(0, lodash_1.isString)(key))
        throw new Error("Invalid key: ".concat(key));
    // Operator
    var operator = rule[1];
    if (!operator || !isOperator(operator))
        throw new Error("Invalid operator: ".concat(operator));
    // Value
    var rawValue = rule[2];
    var value = parseValue(rawValue);
    // Return
    return [key, operator, value];
}
function parseValue(value) {
    if (!value || !(0, lodash_1.isString)(value))
        throw new Error("Invalid value: ".concat(value));
    if (isValidArray(value)) {
        var rawValues = parseValidArray(value);
        return rawValues.map(function (v) { return parseSingleValue(v); });
    }
    else {
        return parseSingleValue(value);
    }
    function isValidArray(value) {
        return (0, lodash_1.isString)(value) && value.startsWith(constants_1.ARRAY_START_TAG) && value.endsWith(constants_1.ARRAY_END_TAG);
    }
    function parseValidArray(value) {
        var rawArrValue = value.slice(constants_1.ARRAY_START_TAG.length, -(constants_1.ARRAY_END_TAG.length));
        if (!rawArrValue || !rawArrValue.length) {
            return [];
        }
        return rawArrValue.trim().split(constants_1.ARRAY_DIVIDER).map(function (v) { return v.trim(); });
    }
}
function parseSingleValue(value) {
    if (isValueKeyword(value)) {
        return getValueKeyword(value);
    }
    if (isValidNumber(value)) {
        return Number(value);
    }
    if (isValidString(value)) {
        return parseValidString(value);
    }
    throw new Error("Invalid value: ".concat(value));
    function isValidString(value) {
        return (0, lodash_1.isString)(value) && value.startsWith(constants_1.STRING_START_TAG) && value.endsWith(constants_1.STRING_END_TAG);
    }
    function parseValidString(value) {
        return value.slice(constants_1.STRING_START_TAG.length, -(constants_1.STRING_END_TAG.length));
    }
}
function isOperator(value) {
    return (0, lodash_1.keys)(constants_1.filterOperators).includes(value);
}
function isValueKeyword(value) {
    return (0, lodash_1.keys)(constants_1.filterValueKeywords).includes(value);
}
function getValueKeyword(value) {
    return constants_1.filterValueKeywords[value];
}
function isValidNumber(value) {
    return !(0, lodash_1.isNaN)(parseInt(value));
}
