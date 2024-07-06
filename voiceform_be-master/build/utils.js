"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasPrivilege = exports.hasStrictPivilege = exports.getRandomPassword = void 0;
const getRandomPassword = () => {
    var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!#$%&'()*+,-./:;<=>?@[\]^_`{|}~";
    var passwordLength = 15;
    var password = "";
    for (var i = 0; i < passwordLength; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber + 1);
    }
    return password;
};
exports.getRandomPassword = getRandomPassword;
const hasStrictPivilege = (x, y) => {
    if (x === "doctor" && y !== "pacient")
        return false;
    if (x === "pacient")
        return false;
    return true;
};
exports.hasStrictPivilege = hasStrictPivilege;
const hasPrivilege = (x, y) => {
    if (x === "doctor" && y === "admin")
        return false;
    if (x === "pacient")
        return false;
    return true;
};
exports.hasPrivilege = hasPrivilege;
