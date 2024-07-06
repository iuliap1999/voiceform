import { PrismaClient } from '@prisma/client'
export const prisma = new PrismaClient()

  // await prisma.user.create({
  //   data: {
  //     cnp: "admin",
  //     password: "admin",
  //     role: "admin",
  //   }
  // })
  // await prisma.profile.create({
  //   data: {
  //     address: "",
  //     birthDate: new Date,
  //     bloodType: "",
  //     firstName: "",
  //     gender: "",
  //     height: 0,
  //     lastName: "",
  //     weight: 0,
  //     userId: 1
  //   }
  // })