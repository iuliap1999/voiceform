import { PublicUser } from "./types";

//@ts-ignore
export const narrow = <T> (v: unknown): v is T => true;

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