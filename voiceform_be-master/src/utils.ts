import { PublicUser } from "./types/types";

export const getRandomPassword = () => {
  var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!#$%&'()*+,-./:;<=>?@[\]^_`{|}~";
  var passwordLength = 15;
  var password = "";
  for (var i = 0; i < passwordLength; i++) {
    var randomNumber = Math.floor(Math.random() * chars.length);
    password += chars.substring(randomNumber, randomNumber + 1);
  }
  return password;
}


export const hasStrictPivilege = (x: PublicUser["role"], y: PublicUser["role"]) => {
  if (x === "doctor" && y !== "pacient") return false;
  if (x === "pacient") return false;
  return true;
}

export const hasPrivilege = (x: PublicUser["role"], y: PublicUser["role"]) => {
  if (x === "doctor" && y === "admin") return false;
  if (x === "pacient") return false;
  return true;
}