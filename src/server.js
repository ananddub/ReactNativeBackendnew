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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var Cors = require("cors");
var mysql = require("mysql");
var multer = require("multer");
var bodyParser = require("body-parser");
var fs = require("fs");
var path = require("path");
var app = express();
app.use(Cors({
    origin: ["*"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTION"],
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.text());
function sqlQuery(query) {
    return __awaiter(this, void 0, void 0, function () {
        var db, value, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    db = mysql.createConnection({
                        host: "89.117.188.154",
                        user: "u932299896_eduware",
                        password: "Webgen@220310",
                        database: "u932299896_sisdb",
                        // host: "localhost",
                        // user: "root",
                        // password: "root",
                        // database: "sisdb",
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            db.connect(function (err) {
                                if (err)
                                    reject(err);
                                resolve("done");
                                console.log("Connected to database");
                            });
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            db.query(query, function (err, result) {
                                if (err)
                                    reject(err);
                                resolve(result);
                            });
                        })];
                case 3:
                    value = _a.sent();
                    db.end();
                    console.log("conection end");
                    return [2 /*return*/, value];
                case 4:
                    err_1 = _a.sent();
                    console.error("Error:", err_1);
                    db.end();
                    console.log("conection end");
                    return [2 /*return*/, { status: "error" }];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function sqlQueryStatus(query) {
    return __awaiter(this, void 0, void 0, function () {
        var db, value, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    db = mysql.createConnection({
                        host: "89.117.188.154",
                        user: "u932299896_eduware",
                        password: "Webgen@220310",
                        database: "u932299896_sisdb",
                        // host: "localhost",
                        // user: "root",
                        // password: "root",
                        // database: "sisdb",
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            db.connect(function (err) {
                                if (err) {
                                    console.log(err);
                                    reject(err);
                                }
                                resolve("done");
                                console.log("Connected to database");
                            });
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            db.query(query, function (err, result) {
                                try {
                                    if (err) {
                                        console.log(err);
                                        reject(false);
                                    }
                                    console.log(result);
                                    if (result.length > 0)
                                        resolve(result);
                                    else
                                        resolve(false);
                                }
                                catch (err) {
                                    resolve(false);
                                }
                            });
                        })];
                case 3:
                    value = _a.sent();
                    db.end();
                    console.log("conection end");
                    console.log("result of sql :", value);
                    if (value == false)
                        return [2 /*return*/, { status: false, data: value }];
                    else
                        return [2 /*return*/, { status: true, data: value }];
                    return [3 /*break*/, 5];
                case 4:
                    err_2 = _a.sent();
                    console.error("Error:", err_2);
                    db.end();
                    console.log("conection end");
                    return [2 /*return*/, { status: false, data: [] }];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function sqlQueryUpdate(query) {
    return __awaiter(this, void 0, void 0, function () {
        var db, value, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    db = mysql.createConnection({
                        host: "89.117.188.154",
                        user: "u932299896_eduware",
                        password: "Webgen@220310",
                        database: "u932299896_sisdb",
                        // host: "localhost",
                        // user: "root",
                        // password: "root",
                        // database: "sisdb",
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            db.connect(function (err) {
                                if (err)
                                    reject(err);
                                resolve("done");
                                console.log("Connected to database");
                            });
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            db.query(query, function (err, result) {
                                try {
                                    if (err) {
                                        console.log(err);
                                        reject(false);
                                    }
                                    resolve(true);
                                }
                                catch (err) {
                                    console.log(err);
                                    resolve(false);
                                }
                            });
                        })];
                case 3:
                    value = _a.sent();
                    db.end();
                    console.log("conection end");
                    console.log("result of sql :", value);
                    return [2 /*return*/, { status: value }];
                case 4:
                    err_3 = _a.sent();
                    console.error("Error:", err_3);
                    db.end();
                    console.log("conection end");
                    return [2 /*return*/, { status: false }];
                case 5: return [2 /*return*/];
            }
        });
    });
}
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            cb(null, file.originalname);
            return [2 /*return*/];
        });
    }); },
});
function paymentDetails(admno, session) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, admission, transportFee, stdTransDetail, hostelFee, stdFeeMaster, monthFee, stdMonthFeeDetail, _b, latefinedate, examfee, miscfee, monthlyfeesetup, objects;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        sqlQuery("select * from tbl_admission where admno='".concat(admno, "' AND session= '").concat(session, "' AND active=1;")),
                        sqlQuery("select * from tbl_transportfee where admno='".concat(admno, "' AND session= '").concat(session, "';")),
                        sqlQuery("select * from tbl_stdtransdetail WHERE admno='".concat(admno, "';")),
                        sqlQuery("select * from tbl_hostelfee WHERE admno='".concat(admno, "' AND session= '").concat(session, "';")),
                        sqlQuery("select * from tbl_stdfeemaster where admno='".concat(admno, "' AND session= '").concat(session, "'")),
                        sqlQuery("select * from tbl_monthfee where admno='".concat(admno, "' AND session= '").concat(session, "' ")),
                        sqlQuery("SELECT * FROM tbl_stdmonthfeedetail WHERE admno = \"".concat(admno, "\" ORDER BY pdate DESC")),
                    ])];
                case 1:
                    _a = _c.sent(), admission = _a[0], transportFee = _a[1], stdTransDetail = _a[2], hostelFee = _a[3], stdFeeMaster = _a[4], monthFee = _a[5], stdMonthFeeDetail = _a[6];
                    return [4 /*yield*/, Promise.all([
                            sqlQuery("SELECT * FROM tbl_latefinedate;"),
                            sqlQuery("SELECT * FROM tbl_examfee WHERE class=\"".concat(admission[0].class, "\";")),
                            sqlQuery("SELECT * FROM tbl_miscfee WHERE class=\"".concat(admission[0].class, "\";")),
                            sqlQuery("SELECT * FROM tbl_monthlyfeesetup WHERE class=\"".concat(admission[0].class, "\";")),
                        ])];
                case 2:
                    _b = _c.sent(), latefinedate = _b[0], examfee = _b[1], miscfee = _b[2], monthlyfeesetup = _b[3];
                    console.log(examfee, miscfee, stdTransDetail);
                    objects = {
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
                    return [2 /*return*/, objects];
            }
        });
    });
}
(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var phone, query, data;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                phone = (_a = req.query) === null || _a === void 0 ? void 0 : _a.phone;
                query = "SELECT * FROM tbl_admission where session=\"2023-2024\" and  active=1 and fmob='".concat(phone, "'");
                return [4 /*yield*/, sqlQueryStatus(query)];
            case 1:
                data = _b.sent();
                console.log(data);
                res.send({ status: data });
                return [2 /*return*/];
        }
    });
}); });
var upload = multer({ storage: storage });
app.put("/imageupload", upload.single("image"), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            console.log("uploaded sucess fully");
            res.status(200).send({ status: "success" });
        }
        catch (err) {
            res.status(400).send(err.message);
        }
        return [2 /*return*/];
    });
}); });
app.put("/profileupdate", upload.single("image"), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, admno, imagename, name_1, fname, mname, pdist, update, data, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, admno = _a.admno, imagename = _a.imagename, name_1 = _a.name, fname = _a.fname, mname = _a.mname, pdist = _a.pdist;
                update = "UPDATE tbl_admission SET \n                        name  = '".concat(name_1, "',\n                        fname = '").concat(fname, "',\n                        mname = '").concat(mname, "', \n                        pdist = '").concat(pdist, "'\n                        ").concat(imagename !== undefined
                    ? ", imagepath = '".concat(imagename, "'")
                    : "", "\n                        WHERE admno = '").concat(admno, "' AND active = 1 AND session = '2023-2024';");
                return [4 /*yield*/, sqlQueryUpdate(update)];
            case 1:
                data = _b.sent();
                console.clear();
                console.log([name_1, fname, mname, pdist, admno]);
                // console.log("parsed data:", data);
                console.log("updated sucess fully ", data, imagename, typeof imagename);
                res.status(200).send(data);
                return [3 /*break*/, 3];
            case 2:
                err_4 = _b.sent();
                res.status(400).send(err_4.message);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get("/phoneVerfication", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var phone, query, data, image, _i, _a, value, imagePath, img, obj, obj, err_5;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                phone = (_b = req.query) === null || _b === void 0 ? void 0 : _b.phone;
                query = "SELECT * FROM tbl_admission where session=\"2023-2024\" and  active=1 and fmob='".concat(phone, "'");
                return [4 /*yield*/, sqlQueryStatus(query)];
            case 1:
                data = _c.sent();
                image = new Array();
                if (data.status === true)
                    for (_i = 0, _a = data.data; _i < _a.length; _i++) {
                        value = _a[_i];
                        try {
                            imagePath = path.join(__dirname, "uploads/".concat(value.imagepath));
                            img = fs.readFileSync(imagePath, "base64");
                            obj = {
                                type: "image/jpeg",
                                name: "".concat(value.imagepath),
                                data: img,
                            };
                            console.log("sucess");
                            image.push(obj);
                        }
                        catch (err) {
                            obj = {
                                type: "",
                                name: "",
                                data: "",
                            };
                            image.push(obj);
                        }
                    }
                // console.log(data);
                res.status(200).send({ status: data, image: image });
                return [3 /*break*/, 3];
            case 2:
                err_5 = _c.sent();
                res.status(400).send({ status: false, image: null });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get("/paymentDetails", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var admno, data, imagePath, image, err_6;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                admno = (_a = req.query) === null || _a === void 0 ? void 0 : _a.admno;
                return [4 /*yield*/, paymentDetails("".concat(admno), "2023-2024")];
            case 1:
                data = _b.sent();
                try {
                    imagePath = path.join(__dirname, "uploads/".concat(data.tbl_admission.imagepath));
                    image = fs.readFileSync(imagePath, "base64");
                    res.contentType("content/json");
                    res.status(200).send({ status: true, data: data, image: image });
                }
                catch (err) {
                    res.status(200).send({ status: data, data: data, image: null });
                }
                return [3 /*break*/, 3];
            case 2:
                err_6 = _b.sent();
                res.status(400).send(err_6.message);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get("/BasicDetails", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var admno, query, data, imagePath, image, err_7;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                admno = (_a = req.query) === null || _a === void 0 ? void 0 : _a.admno;
                console.log("admno numer :", admno);
                query = "SELECT * FROM tbl_admission where session=\"2023-2024\" and admno=\"".concat(admno, "\" and active=1; ");
                return [4 /*yield*/, sqlQueryStatus(query)];
            case 1:
                data = _b.sent();
                console.log("basic details :", data);
                try {
                    imagePath = path.join(__dirname, "uploads/".concat(data === null || data === void 0 ? void 0 : data.data.imagepath));
                    image = fs.readFileSync(imagePath, "base64");
                    res.contentType("multipart/mixed");
                    res.status(200).send({ status: data, image: image });
                }
                catch (err) {
                    res.status(200).send({ status: data, image: null });
                }
                return [3 /*break*/, 3];
            case 2:
                err_7 = _b.sent();
                res.status(400).send(err_7.message);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get("/", function (req, res) {
    res.status(200).send("<h1>Welcome to Eduware Android</h1>");
});
// const EPORT =process.env.PORT||3000;
// app.listen(EPORT, () => {
//     console.log("Server is running on port localhost:", EPORT);
// });
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var httpServer = (0, http_1.createServer)(app);
var io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
        credentials: true,
    }
});
var dbActive = [];
function removeDup(arr, admno) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].admno === admno) {
            arr.splice(i, 1);
            break;
        }
    }
}
function getLength(admno) {
    return __awaiter(this, void 0, void 0, function () {
        var usersel, unseen;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    usersel = "SELECT  COUNT(a.messageid) as c FROM tbl_adminannounce a\n    LEFT JOIN tbl_stdannounce u ON a.messageid = u.messageid\n    WHERE (a.to = '".concat(admno, "' OR a.to= 'all') \n      AND u.messageid IS NULL ORDER BY a.messageid DESC;");
                    return [4 /*yield*/, Promise.all([sqlQueryStatus(usersel)])];
                case 1:
                    unseen = (_a.sent())[0];
                    console.log("length :", unseen.data[0].c);
                    return [2 /*return*/, unseen.data[0].c];
            }
        });
    });
}
io.on("connection", function (socket) {
    console.log("A user connected");
    socket.on("register", function (response) {
        removeDup(dbActive, response.admno);
        if (response.admno !== undefined) {
            dbActive.push({
                admno: response.admno,
                socketid: socket.id,
                class: response.class,
                sec: response.sec
            });
        }
        console.log("active user", dbActive);
    });
    socket.on("seen", function (response) {
        var insert = "INSERT INTO tbl_stdannounce (admno,name,messaged,messageid) \n                        VALUES ('".concat(response.admno, "','").concat(response.name, "','").concat(response.message, "','").concat(response.messageid, "');");
        sqlQueryUpdate(insert);
    });
    socket.on('getchat', function (response) { return __awaiter(void 0, void 0, void 0, function () {
        var admno, usersel, _a, seen, unseen, err_8;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    admno = "SELECT  a.messageid, a.message, a.to, a.from, a.date , a.time  FROM tbl_adminannounce a\n                    LEFT JOIN tbl_stdannounce u ON a.messageid = u.messageid\n                    WHERE (a.to = '".concat(response.admno, "' OR a.to = 'all' or a.class='").concat(response.class, "' \n                                    AND (a.sec='all' or a.sec='").concat(response.sec, "')) ORDER BY a.messageid DESC;");
                    usersel = "SELECT  a.messageid, a.message, a.to, a.from, a.date , a.time  FROM tbl_adminannounce a\n                            LEFT JOIN tbl_stdannounce u ON a.messageid = u.messageid\n                            WHERE (a.to = '".concat(response.admno, "' OR a.to = 'all' or a.class='").concat(response.class, "' \n                            AND (a.sec='all' or a.sec='").concat(response.sec, "')) \n                            AND u.messageid IS NULL ORDER BY a.messageid DESC;");
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, Promise.all([sqlQueryStatus(admno), sqlQueryStatus(usersel)])];
                case 2:
                    _a = _b.sent(), seen = _a[0], unseen = _a[1];
                    console.log(seen, unseen);
                    socket.emit('getchat', { seen: seen.data, unseen: unseen.data });
                    return [3 /*break*/, 4];
                case 3:
                    err_8 = _b.sent();
                    console.log(err_8);
                    socket.emit('getchat', { seen: null, unseen: null });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    socket.on('getAdminChat', function (response) { return __awaiter(void 0, void 0, void 0, function () {
        var query, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    query = "SELECT  *  FROM tbl_adminannounce ORDER BY messageid DESC";
                    return [4 /*yield*/, sqlQueryStatus(query)];
                case 1:
                    data = _a.sent();
                    socket.emit('getAdminChat', { data: data.data });
                    return [2 /*return*/];
            }
        });
    }); });
    socket.on('getlength', function (response) { return __awaiter(void 0, void 0, void 0, function () {
        var usersel, unseen;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    usersel = "SELECT  COUNT(a.messageid) as c FROM tbl_adminannounce a\n                            LEFT JOIN tbl_stdannounce u ON a.messageid = u.messageid\n                            WHERE (a.to = '".concat(response.admno, "' OR a.to = 'all' or a.class='").concat(response.class, "' AND (a.sec='all' or a.sec='").concat(response.sec, "')) \n                            AND u.messageid IS NULL ORDER BY a.messageid DESC;");
                    return [4 /*yield*/, Promise.all([sqlQueryStatus(usersel)])];
                case 1:
                    unseen = (_c.sent())[0];
                    console.log("length :", (_a = unseen === null || unseen === void 0 ? void 0 : unseen.data[0]) === null || _a === void 0 ? void 0 : _a.c);
                    socket.emit('getlength', { unseen: (_b = unseen === null || unseen === void 0 ? void 0 : unseen.data[0]) === null || _b === void 0 ? void 0 : _b.c });
                    return [2 /*return*/];
            }
        });
    }); });
    socket.on("admin", function (response) { return __awaiter(void 0, void 0, void 0, function () {
        var _i, _a, admno, insert, insert, _b, _c, _d, i, j;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    console.log('repsponse :', response);
                    if (!(Array.isArray(response.to) === true)) return [3 /*break*/, 4];
                    _i = 0, _a = response.to;
                    _e.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    admno = _a[_i];
                    insert = "INSERT INTO tbl_adminannounce (message,`from`, `to`,class,sec) VALUES ('".concat(response.message, "','").concat(response.from, "','").concat(admno, "','").concat(response.class, "','").concat(response.sec, "');");
                    return [4 /*yield*/, sqlQueryUpdate(insert)];
                case 2:
                    _e.sent();
                    _e.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    if (!(response.class !== '')) return [3 /*break*/, 6];
                    console.log("we entered");
                    insert = "INSERT INTO tbl_adminannounce (message,`from`,`to`,class,sec) VALUES ('".concat(response.message, "','").concat(response.from, "','").concat(response.class, "','").concat(response.class, "','").concat(response.sec, "');");
                    _c = (_b = console).log;
                    _d = ["status :"];
                    return [4 /*yield*/, sqlQueryUpdate(insert)];
                case 5:
                    _c.apply(_b, _d.concat([_e.sent()]));
                    io.emit("notice", "check message");
                    io.emit('getAdminStatus');
                    return [3 /*break*/, 7];
                case 6:
                    if (response.to[0] === "all") {
                        console.log('emited :', response.message);
                        io.emit("notice", { "message": response.message });
                        io.emit('getAdminStatus');
                    }
                    else {
                        for (i = 0; i < response.to.length; i++) {
                            for (j = 0; j < dbActive.length; j++) {
                                if (dbActive[j].admno === response.to[i]) {
                                    console.log(j, 'passed ', dbActive[j]);
                                    io.to(dbActive[j].socketid).emit("notice", response.message);
                                    io.emit('getAdminStatus');
                                }
                            }
                        }
                    }
                    _e.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    }); });
    socket.on("disconnect", function () {
        for (var i = 0; i < dbActive.length; i++) {
            if (dbActive[i].socketid == socket.id) {
                dbActive.splice(i, 1);
            }
        }
        console.log("A user disconnected", dbActive);
    });
});
var PORT = process.env.PORT || 4000;
httpServer.listen(PORT, function () {
    console.log("Socket is running on port localhost:", PORT);
});
