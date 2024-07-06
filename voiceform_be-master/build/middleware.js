"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withAuth = void 0;
const dbclient_1 = require("./dbclient");
const withAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.session);
    if (!req.session.uid)
        return res.status(401).send();
    const user = yield dbclient_1.prisma.user.findUnique({
        where: {
            id: req.session.uid
        },
        select: {
            id: true,
            cnp: true,
            role: true,
        }
    });
    if (!user) {
        return res.status(401).send();
    }
    req.user = user;
    return next();
});
exports.withAuth = withAuth;
