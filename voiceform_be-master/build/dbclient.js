"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient();
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
