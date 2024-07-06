import { Request, Response, Router } from "express";
import { prisma } from "../dbclient";
import { PublicUser } from "../types/types";
import { withAuth } from "../middleware";
import { getRandomPassword, hasPrivilege, hasStrictPivilege } from "../utils";
import moment from "moment";
import { CNP } from 'romanian-personal-identity-code-validator';

const router = Router();
const { performance } = require('perf_hooks');

var startTime = performance.now();

router.get("/stats", async (req: Request, res: Response) => {
  try {
    const doctors = await prisma.user.count({
      where: {
        role: {
          equals: "doctor"
        }
      }
    })
    const pacients = await prisma.user.count({
      where: {
        role: {
          equals: "pacient"
        }
      }
    })
    const comments = await prisma.comment.count()
    const recentComments = await prisma.comment.count({
      where: {
        timestamp:{
          gte: moment().subtract(1, "day").toISOString(),
        }
      }
    })
    return res.send({
      doctors,
      pacients,
      comments,
      recentComments
    })
  }
  catch (e) {
    res.status(500).send((e as Error).message ?? "");
  }
});

router.get("/", withAuth, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.session.uid,
      },
      select: {
        id: true,
        cnp: true,
        role: true,
        profile: true
      },
    }) as PublicUser;
    if (!user) return res.status(400).send();
    req.session.uid = user.id;
    return res.send(user);
  }
  catch (e) {
    res.status(500).send((e as Error).message ?? "");
  }
})

router.post("/logout", withAuth, async (req: Request, res: Response) => {
  try {
    req.session.destroy(() => {});
    return res.send({});
  }
  catch (e) {
    res.status(500).send((e as Error).message ?? "");
  }
})

router.get("/list", withAuth, async (req: Request, res: Response) => {
  try {
    if (req.user!.role === "pacient") return res.status(401).send();
    let where: any = req.user!.role === "admin" ? undefined : {role: "pacient"};
    const user = await prisma.user.findMany({
      where,
      select: {
        id: true,
        cnp: true,
        role: true,
        password: req.user?.role === "admin",
        profile: true
      }
    }) as PublicUser[];
    if (!user) return res.status(400).send();
    return res.send(user);
  }
  catch (e) {
    res.status(500).send((e as Error).message ?? "");
  }
})


router.post("/login", async (req: Request, res: Response) => {
  console.log(req.body);
  if (!req.body.cnp || !req.body.password) return res.status(400).send();
  try {
    const user = await prisma.user.findUnique({
      where: {
        cnp: req.body.cnp,
        password: req.body.password
      },
      select: {
        id: true,
        cnp: true,
        role: true,
        profile: true
      },
    }) as PublicUser;
    if (!user) return res.status(400).send();
    req.session.uid = user.id;
    return res.send(user);
  }
  catch (e) {
    res.status(500).send((e as Error).message ?? "");
  }
})

router.post ("/delete/:cnp", withAuth, async (req: Request, res: Response) =>{
  if (!hasPrivilege(req.user!.role, req.body.role)) return res.status(401).send();
  if (!req.params.cnp) res.status(400).send();
  try {
    const user = await prisma.user.findUnique({
      where: {
        cnp: req.params.cnp,
      },
      select: {
        id: true,
        cnp: true,
        role: true,
        profile: true
      },
    }) as PublicUser;
    await prisma.user.delete({
      where: {
        id: user.id
      }
    })
    res.send({});
  }
  catch(e) {
    res.status(400).send((e as Error).message ?? "");
  }
})

router.post("/create", withAuth, async (req: Request, res: Response) => {
  const cnp = new CNP(req.body.cnp);
  if(!cnp.isValid()) return res.status(501).send();
  console.log(req.user);
  if (!req.body.cnp || !req.body.role) return res.status(400).send();
  if (!hasPrivilege(req.user!.role, req.body.role)) return res.status(401).send();
  try {
    const newUser = await prisma.user.create({
      data: {
        cnp: req.body.cnp,
        password: getRandomPassword(),
        role: req.body.role,
        profile: {
          create: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            address: "",
            birthDate: "",
            bloodType: "",
            gender: "",
            height: "",
            weight: "",
          }
        }
      },
      include: {
        profile: true
      }
    });
    return res.send(newUser);
  }
  catch(e) {
    res.status(402).send((e as Error).message ?? "");
  }
})
var endTime = performance.now();
console.log(`Timp masurat: ${endTime - startTime} ms`)
export {router as UserRouter};