import "express-session"; 
import "express"
import { PublicUser } from "./types";

declare module "express-session" {
    interface SessionData {
      uid: number
    }
}

declare module "express" {
  interface Request {
    user?: PublicUser
  }
}
