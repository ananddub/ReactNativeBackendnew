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
const cors_1 = __importDefault(require("cors"));
const mysql_1 = __importDefault(require("mysql"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTION"],
}));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use(express_1.default.text());
function sqlQuery(query) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = mysql_1.default.createConnection({
            host: "89.117.188.154",
            user: "u932299896_eduware",
            password: "Webgen@220310",
            database: "u932299896_sisdb",
            // host: "localhost",
            // user: "root",
            // password: "root",
            // database: "sisdb",
        });
        try {
            yield new Promise((resolve, reject) => {
                db.connect((err) => {
                    if (err)
                        reject(err);
                    resolve("done");
                    console.log("Connected to database");
                });
            });
            const value = yield new Promise((resolve, reject) => {
                db.query(query, (err, result) => {
                    if (err)
                        reject(err);
                    resolve(result);
                });
            });
            db.end();
            console.log("conection end");
            return value;
        }
        catch (err) {
            console.error("Error:", err);
            db.end();
            console.log("conection end");
            return { status: "error" };
        }
    });
}
function sqlQueryStatus(query) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = mysql_1.default.createConnection({
            host: "89.117.188.154",
            user: "u932299896_eduware",
            password: "Webgen@220310",
            database: "u932299896_sisdb",
            // host: "localhost",
            // user: "root",
            // password: "root",
            // database: "sisdb",
        });
        try {
            yield new Promise((resolve, reject) => {
                db.connect((err) => {
                    if (err)
                        reject(err);
                    resolve("done");
                    console.log("Connected to database");
                });
            });
            const value = yield new Promise((resolve, reject) => {
                db.query(query, (err, result) => {
                    try {
                        if (err)
                            reject(false);
                        // console.log(result);
                        if (result.length > 0)
                            resolve(result);
                        else
                            resolve(false);
                    }
                    catch (err) {
                        resolve(false);
                    }
                });
            });
            db.end();
            console.log("conection end");
            console.log("result of sql :", value);
            if (value == false)
                return { status: false, data: value };
            else
                return { status: true, data: value };
        }
        catch (err) {
            console.error("Error:", err);
            db.end();
            console.log("conection end");
            return { status: false };
        }
    });
}
function paymentDetails(admno, session) {
    return __awaiter(this, void 0, void 0, function* () {
        const [admission, transportFee, stdTransDetail, hostelFee, stdFeeMaster, monthFee, stdMonthFeeDetail,] = yield Promise.all([
            sqlQuery(`select * from tbl_admission where admno='${admno}' AND session= '${session}' AND active=1;`),
            sqlQuery(`select * from tbl_transportfee where admno='${admno}' AND session= '${session}';`),
            sqlQuery(`select * from tbl_stdtransdetail WHERE admno='${admno}';`),
            sqlQuery(`select * from tbl_hostelfee WHERE admno='${admno}' AND session= '${session}';`),
            sqlQuery(`select * from tbl_stdfeemaster where admno='${admno}' AND session= '${session}'`),
            sqlQuery(`select * from tbl_monthfee where admno='${admno}' AND session= '${session}' `),
            sqlQuery(`SELECT * FROM tbl_stdmonthfeedetail WHERE admno = "${admno}" ORDER BY pdate DESC`),
        ]);
        const [latefinedate, examfee, miscfee, monthlyfeesetup] = yield Promise.all([
            sqlQuery(`SELECT * FROM tbl_latefinedate;`),
            sqlQuery(`SELECT * FROM tbl_examfee WHERE class="${admission[0].class}";`),
            sqlQuery(`SELECT * FROM tbl_miscfee WHERE class="${admission[0].class}";`),
            sqlQuery(`SELECT * FROM tbl_monthlyfeesetup WHERE class="${admission[0].class}";`),
        ]);
        console.log(examfee, miscfee, stdTransDetail);
        const objects = {
            tbl_admission: admission[0],
            tbl_transfee: transportFee[0],
            tbl_stdtransdetail: stdTransDetail[0],
            tbl_hostelfee: hostelFee[0],
            tbl_monthfee: monthFee[0],
            tbl_stdmonthfeedetail: stdMonthFeeDetail[0],
            tbl_latefinedate: latefinedate[0],
            tbl_examfee: examfee[0],
            tbl_miscfee: miscfee[0],
            tbl_stdfeemaster: stdFeeMaster[0],
            tbl_monthlyfeesetup: monthlyfeesetup[0],
        };
        return objects;
    });
}
app.get("/phoneVerfication", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const phone = (_a = req.query) === null || _a === void 0 ? void 0 : _a.phone;
    const query = `SELECT * FROM tbl_admission where session="2023-2024" and  active=1 and fmob='${phone}'`;
    const data = yield sqlQueryStatus(query);
    console.log(data);
    res.send({ status: data });
}));
app.get("/paymentDetails", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const admno = (_b = req.query) === null || _b === void 0 ? void 0 : _b.admno;
    const data = yield paymentDetails(`${admno}`, `2023-2024`);
    res.send({ status: true, data: data });
}));
app.get("/BasicDetails", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const admno = (_c = req.query) === null || _c === void 0 ? void 0 : _c.admno;
    console.log("admno numer :", admno);
    const query = `SELECT * FROM tbl_admission where session="2023-2024" and admno="${admno}" and active=1; `;
    const data = yield sqlQueryStatus(query);
    console.log(data);
    res.send({ status: data });
}));
app.get("/", (req, res) => {
    res.send("<h1>Welcome to Eduware Android</h1>");
});
app.listen(4003, () => {
    console.log("Server is running on port localhost:0.0.0.0,4003");
});
