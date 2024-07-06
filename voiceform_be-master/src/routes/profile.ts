import { Request, Response, Router } from "express";
import { prisma } from "../dbclient";
import { PublicUser } from "../types/types";
import { withAuth } from "../middleware";
import { getRandomPassword, hasPrivilege } from "../utils";
import moment from "moment";

const router = Router();
router.use(withAuth);

router.get("/", async (req: Request, res:Response) => {
  try {
    const data = await prisma.profile.findUnique({
      where: {
        userId: req.session.uid
      },
      include: {
        comments: {
          include: {
            profile: true,
            author: true,
          }
        }
      },
      
    })
    return res.send(data);
  }
  catch(e) {
    return res.status(500).send((e as Error).message ?? "");
  }
});

router.get("/cnp/:cnp", async (req: Request, res:Response) => {
  if (req.user!.role === "pacient") return res.status(401).send();
  try {
    const data = await prisma.profile.findFirst({
      // include: {
      //   user: true,
      // },
      where: {
        user: {
          is: {
            cnp: req.params.cnp
          }
        }
      },
      include: {
        comments: {
          include: {
            profile: true,
            author: true
          },
          orderBy: {
            timestamp: 'desc'
          }
        }
      }
    })
    if (!data) return res.status(400).send();
    return res.send(data);
  }
  catch(e) {
    return res.status(500).send((e as Error).message ?? "");
  }
});

router.post("/cnp/:cnp", async (req: Request, res: Response) => {
  try {
    const data = await prisma.user.findFirst({
      where: {
        cnp: req.params.cnp
      }
    }) as PublicUser;
    if (req.user!.role === "pacient" && req.params.cnp !== req.user!.cnp) return res.status(401).send();
    if (!data || (!hasPrivilege(req.user!.role, data.role) && req.user!.role !== "pacient")) return res.status(400).send();
    delete req.body.id;
    delete req.body.comments;
    delete req.body.userId;
    console.log(req.body);
    const updateData = await prisma.user.update({
      where: {
        cnp: req.params.cnp,
      },
      data: {
        profile: {
          update: {
            data: {
              ...req.body,
            }
          }
        }
      },
      select: {
        profile: true
      }
    })
    if (!updateData) return res.status(400).send();
    return res.send(updateData.profile);
  }
  catch(e) {
    return res.status(500).send((e as Error).message ?? "");
  }
})

router.post ("/deletecomment/:id", async (req: Request, res: Response) =>{
  if (req.user!.role === "pacient") return res.status(401).send();
  try {
    await prisma.comment.delete({
      where: {
        id: parseInt(req.params.id)
      }
    })
    res.send({});
  }
  catch(e) {
    res.status(400).send((e as Error).message ?? "");
  }
})

router.post("/cnp/:cnp/addcomment", withAuth, async (req: Request, res:Response) => {
  if (req.user!.role === "pacient") return res.status(401).send();
  if (!req.body.content) return res.status(401).send();
  try {
    const profile = await prisma.profile.findFirst({
      where: {
        user: {
          is: {
            cnp: req.params.cnp
          }
        }
      },
    })
    const author = await prisma.profile.findFirst({
      where: {
        user: {
          is: {
            cnp: req.user!.cnp
          }
        }
      },
    })
    const comment = await prisma.comment.create({
      data: {
        content: req.body.content,
        timestamp: moment().toISOString(),
        profileId: profile!.id,
        authorId: author!.id
      },
      include: {
        profile: true,
        author: true
      }
    })
    return res.send(comment);
  }
  catch(e) {
    res.status(400).send((e as Error).message ?? "");
  }
})

export {router as ProfileRouter};