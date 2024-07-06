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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = require("express");
const dbclient_1 = require("../dbclient");
const middleware_1 = require("../middleware");
const utils_1 = require("../utils");
const moment_1 = __importDefault(require("moment"));
const romanian_personal_identity_code_validator_1 = require("romanian-personal-identity-code-validator");
const router = (0, express_1.Router)();
exports.UserRouter = router;
const { performance } = require('perf_hooks');
var startTime = performance.now();
router.get("/stats", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const doctors = yield dbclient_1.prisma.user.count({
            where: {
                role: {
                    equals: "doctor"
                }
            }
        });
        const pacients = yield dbclient_1.prisma.user.count({
            where: {
                role: {
                    equals: "pacient"
                }
            }
        });
        const comments = yield dbclient_1.prisma.comment.count();
        const recentComments = yield dbclient_1.prisma.comment.count({
            where: {
                timestamp: {
                    gte: (0, moment_1.default)().subtract(1, "day").toISOString(),
                }
            }
        });
        return res.send({
            doctors,
            pacients,
            comments,
            recentComments
        });
    }
    catch (e) {
        res.status(500).send((_a = e.message) !== null && _a !== void 0 ? _a : "");
    }
}));
router.get("/", middleware_1.withAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const user = yield dbclient_1.prisma.user.findUnique({
            where: {
                id: req.session.uid,
            },
            select: {
                id: true,
                cnp: true,
                role: true,
                profile: true
            },
        });
        if (!user)
            return res.status(400).send();
        req.session.uid = user.id;
        return res.send(user);
    }
    catch (e) {
        res.status(500).send((_b = e.message) !== null && _b !== void 0 ? _b : "");
    }
}));
router.post("/logout", middleware_1.withAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        req.session.destroy(() => { });
        return res.send({});
    }
    catch (e) {
        res.status(500).send((_c = e.message) !== null && _c !== void 0 ? _c : "");
    }
}));
router.get("/list", middleware_1.withAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e;
    try {
        if (req.user.role === "pacient")
            return res.status(401).send();
        let where = req.user.role === "admin" ? undefined : { role: "pacient" };
        const user = yield dbclient_1.prisma.user.findMany({
            where,
            select: {
                id: true,
                cnp: true,
                role: true,
                password: ((_d = req.user) === null || _d === void 0 ? void 0 : _d.role) === "admin",
                profile: true
            }
        });
        if (!user)
            return res.status(400).send();
        return res.send(user);
    }
    catch (e) {
        res.status(500).send((_e = e.message) !== null && _e !== void 0 ? _e : "");
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    console.log(req.body);
    if (!req.body.cnp || !req.body.password)
        return res.status(400).send();
    try {
        const user = yield dbclient_1.prisma.user.findUnique({
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
        });
        if (!user)
            return res.status(400).send();
        req.session.uid = user.id;
        return res.send(user);
    }
    catch (e) {
        res.status(500).send((_f = e.message) !== null && _f !== void 0 ? _f : "");
    }
}));
router.post("/delete/:cnp", middleware_1.withAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    if (!(0, utils_1.hasPrivilege)(req.user.role, req.body.role))
        return res.status(401).send();
    if (!req.params.cnp)
        res.status(400).send();
    try {
        const user = yield dbclient_1.prisma.user.findUnique({
            where: {
                cnp: req.params.cnp,
            },
            select: {
                id: true,
                cnp: true,
                role: true,
                profile: true
            },
        });
        yield dbclient_1.prisma.user.delete({
            where: {
                id: user.id
            }
        });
        res.send({});
    }
    catch (e) {
        res.status(400).send((_g = e.message) !== null && _g !== void 0 ? _g : "");
    }
}));
router.post("/create", middleware_1.withAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _h;
    const cnp = new romanian_personal_identity_code_validator_1.CNP(req.body.cnp);
    if (!cnp.isValid())
        return res.status(501).send();
    console.log(req.user);
    if (!req.body.cnp || !req.body.role)
        return res.status(400).send();
    if (!(0, utils_1.hasPrivilege)(req.user.role, req.body.role))
        return res.status(401).send();
    try {
        const newUser = yield dbclient_1.prisma.user.create({
            data: {
                cnp: req.body.cnp,
                password: (0, utils_1.getRandomPassword)(),
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
    catch (e) {
        res.status(402).send((_h = e.message) !== null && _h !== void 0 ? _h : "");
    }
}));
var endTime = performance.now();
console.log(`Timp masurat: ${endTime - startTime} ms`);
