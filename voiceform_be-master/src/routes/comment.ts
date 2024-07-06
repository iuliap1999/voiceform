import { Request, Response, Router } from "express";
import { prisma } from "../dbclient";
import { PublicUser } from "../types/types";
import { withAuth } from "../middleware";
import { getRandomPassword, hasPrivilege } from "../utils";

const router = Router();
router.use(withAuth);

