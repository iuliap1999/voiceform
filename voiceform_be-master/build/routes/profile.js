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
exports.ProfileRouter = void 0;
const express_1 = require("express");
const dbclient_1 = require("../dbclient");
const middleware_1 = require("../middleware");
const utils_1 = require("../utils");
const moment_1 = __importDefault(require("moment"));
const router = (0, express_1.Router)();
exports.ProfileRouter = router;
router.use(middleware_1.withAuth);
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const data = yield dbclient_1.prisma.profile.findUnique({
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
        });
        return res.send(data);
    }
    catch (e) {
        return res.status(500).send((_a = e.message) !== null && _a !== void 0 ? _a : "");
    }
}));
router.get("/cnp/:cnp", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    if (req.user.role === "pacient")
        return res.status(401).send();
    try {
        const data = yield dbclient_1.prisma.profile.findFirst({
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
        });
        if (!data)
            return res.status(400).send();
        return res.send(data);
    }
    catch (e) {
        return res.status(500).send((_b = e.message) !== null && _b !== void 0 ? _b : "");
    }
}));
router.post("/cnp/:cnp", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const data = yield dbclient_1.prisma.user.findFirst({
            where: {
                cnp: req.params.cnp
            }
        });
        if (req.user.role === "pacient" && req.params.cnp !== req.user.cnp)
            return res.status(401).send();
        if (!data || (!(0, utils_1.hasPrivilege)(req.user.role, data.role) && req.user.role !== "pacient"))
            return res.status(400).send();
        delete req.body.id;
        delete req.body.comments;
        delete req.body.userId;
        console.log(req.body);
        const updateData = yield dbclient_1.prisma.user.update({
            where: {
                cnp: req.params.cnp,
            },
            data: {
                profile: {
                    update: {
                        data: Object.assign({}, req.body)
                    }
                }
            },
            select: {
                profile: true
            }
        });
        if (!updateData)
            return res.status(400).send();
        return res.send(updateData.profile);
    }
    catch (e) {
        return res.status(500).send((_c = e.message) !== null && _c !== void 0 ? _c : "");
    }
}));
router.post("/deletecomment/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    if (req.user.role === "pacient")
        return res.status(401).send();
    try {
        yield dbclient_1.prisma.comment.delete({
            where: {
                id: parseInt(req.params.id)
            }
        });
        res.send({});
    }
    catch (e) {
        res.status(400).send((_d = e.message) !== null && _d !== void 0 ? _d : "");
    }
}));
router.post("/cnp/:cnp/addcomment", middleware_1.withAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    if (req.user.role === "pacient")
        return res.status(401).send();
    if (!req.body.content)
        return res.status(401).send();
    try {
        const profile = yield dbclient_1.prisma.profile.findFirst({
            where: {
                user: {
                    is: {
                        cnp: req.params.cnp
                    }
                }
            },
        });
        const author = yield dbclient_1.prisma.profile.findFirst({
            where: {
                user: {
                    is: {
                        cnp: req.user.cnp
                    }
                }
            },
        });
        const comment = yield dbclient_1.prisma.comment.create({
            data: {
                content: req.body.content,
                timestamp: (0, moment_1.default)().toISOString(),
                profileId: profile.id,
                authorId: author.id
            },
            include: {
                profile: true,
                author: true
            }
        });
        return res.send(comment);
    }
    catch (e) {
        res.status(400).send((_e = e.message) !== null && _e !== void 0 ? _e : "");
    }
}));
