import { Request, Response } from "express";
import { prisma } from "./dbclient";
import { PublicUser } from "./types/types";

export const withAuth = async (req: Request, res: Response, next: () => unknown) => {
  console.log(req.session);
  if (!req.session.uid) return res.status(401).send();
  const user = await prisma.user.findUnique({
    where: {
      id: req.session.uid
    },
    select: {
      id: true,
      cnp: true,
      role: true,
    }
  }) as PublicUser;
  if (!user) {
    return res.status(401).send();
  }
  req.user = user;
  return next();
}