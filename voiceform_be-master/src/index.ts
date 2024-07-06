import express, { Request, Response } from "express"
import session from "express-session"
import { prisma } from "./dbclient"
import { UserRouter } from "./routes/user";
import { PublicUser } from "./types/types";
import { ProfileRouter } from "./routes/profile";
import cors from "cors";
const app = express()
const port = 5000;
const { performance } = require('perf_hooks');


// if (app.get('env') === 'production') {
//   app.set('trust proxy', 1) // trust first proxy
//   sess.cookie.secure = true // serve secure cookies
// }
var startTime = performance.now();

app.use(cors({
  credentials: true,
  origin: "http://localhost:5173"
}));

app.use(session({
  secret: 'keyboard cat',
}))

app.use(express.json());

app.use("/user", UserRouter);
app.use("/profile", ProfileRouter);

app.get('/', async (req: Request, res: Response) => {
  return res.send("Hello");
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

var endTime = performance.now();
console.log(`Timp masurat: ${endTime - startTime} ms`)