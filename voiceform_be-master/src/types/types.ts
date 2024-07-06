export interface PublicUser {
  id: number,
  cnp: string,
  role: "admin" | "doctor" | "pacient",
}