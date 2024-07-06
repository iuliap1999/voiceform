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
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const user_1 = require("./routes/user");
const profile_1 = require("./routes/profile");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 5000;
const { performance } = require('perf_hooks');
// if (app.get('env') === 'production') {
//   app.set('trust proxy', 1) // trust first proxy
//   sess.cookie.secure = true // serve secure cookies
// }
var startTime = performance.now();
app.use((0, cors_1.default)({
    credentials: true,
    origin: "http://localhost:5173"
}));
app.use((0, express_session_1.default)({
    secret: 'keyboard cat',
}));
app.use(express_1.default.json());
app.use("/user", user_1.UserRouter);
app.use("/profile", profile_1.ProfileRouter);
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.send("Hello");
}));
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
var endTime = performance.now();
console.log(`Timp masurat: ${endTime - startTime} ms`);
