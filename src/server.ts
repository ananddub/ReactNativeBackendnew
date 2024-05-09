import * as express from "express";
import { Express, Request, Response } from "express";
import * as Cors from "cors";
import * as mysql from "mysql";
import * as multer from "multer";
import * as bodyParser from "body-parser";
import * as fs from "fs";
import * as path from "path";
// const puppeteer = require("puppeteer");
const app = express();
app.use(
    Cors({
        origin: ["*"],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTION"],
    })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.text());
const nextSession = (): string => {
    const date = new Date();
    const year = date.getFullYear() + 1;
    return `${year}-${new Date().getFullYear() + 2}`;
};
const curSession = (): string => {
    const date = new Date();
    const year = date.getFullYear() + 1;
    return `${new Date().getFullYear()}-${year}`;
};
async function sqlQuerys(query: string) {
    const db = mysql.createConnection({
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
        await new Promise((resolve, reject) => {
            db.connect((err: any) => {
                if (err) reject(err);
                resolve("done");
                console.log("Connected to database");
            });
        });

        const value: [] = await new Promise((resolve, reject) => {
            db.query(query, (err: any, result: any) => {
                if (err) reject(err);
                resolve(result);
            });
        });
        db.end();
        console.log("conection end");
        return value;
    } catch (err) {
        console.error("Error:", err);
        db.end();
        console.log("conection end");
        return [];
    }
}

function getImage(img: string): string {
    try {
        const imagePath = path.join(__dirname, `uploads/${img}`);
        const image = fs.readFileSync(imagePath, "base64");
        return image;
    } catch (e) {
        // const image = fs.readFileSync('uploads/profile.png', "base64");
        return "";
    }
}
async function sqlQuery(query: string) {
    const db = mysql.createConnection({
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
        await new Promise((resolve, reject) => {
            db.connect((err) => {
                if (err) reject(err);
                resolve("done");
                console.log("Connected to database");
            });
        });

        const value: [] = await new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
        db.end();
        console.log("conection end");
        return value;
    } catch (err) {
        console.error("Error:", err);
        db.end();
        console.log("conection end");
        return { status: "error" };
    }
}
async function sqlQueryStatus(query: string) {
    const db = mysql.createConnection({
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
        await new Promise((resolve, reject) => {
            db.connect((err) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                resolve("done");
                console.log("Connected to database");
            });
        });
        const value = await new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
                try {
                    if (err) {
                        console.log(err);
                        reject(false);
                    }
                    // console.log(result);
                    if (result.length > 0) resolve(result);
                    else {
                        // console.log(result);
                        resolve(false);
                    }
                } catch (err) {
                    console.log(err);
                    resolve(false);
                }
            });
        });
        db.end();
        console.log("conection end");
        // console.log("result of sql :", value);
        if (value == false) return { status: false, data: value };
        else return { status: true, data: value };
    } catch (err) {
        console.error("Error:", err);
        db.end();
        console.log("conection end");
        return { status: false, data: [] };
    }
}

async function sqlQueryUpdate(query: string) {
    const db = mysql.createConnection({
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
        await new Promise((resolve, reject) => {
            db.connect((err) => {
                if (err) reject(err);
                resolve("done");
                console.log("Connected to database");
            });
        });
        const value = await new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
                try {
                    if (err) {
                        console.log(err);
                        reject(false);
                    }
                    resolve(true);
                } catch (err) {
                    console.log(err);
                    resolve(false);
                }
            });
        });
        db.end();
        // console.log("conection end");
        // console.log("result of sql :", value);
        return { status: value };
    } catch (err) {
        console.error("Error:", err);
        db.end();
        console.log("conection end");
        return { status: false };
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: async (req: Request, file, cb) => {
        cb(null, file.originalname);
    },
});
async function paymentDetails(admno: string, session: string) {
    const [
        admission,
        transportFee,
        stdTransDetail,
        hostelFee,
        stdFeeMaster,
        monthFee,
        stdMonthFeeDetail,
    ]: any = await Promise.all([
        sqlQuery(
            `select * from tbl_admission where admno='${admno}' AND session= '${session}' AND active=1;`
        ),
        sqlQuery(
            `select * from tbl_transportfee where admno='${admno}' AND session= '${session}';`
        ),
        sqlQuery(`select * from tbl_stdtransdetail WHERE admno='${admno}';`),
        sqlQuery(
            `select * from tbl_hostelfee WHERE admno='${admno}' AND session= '${session}';`
        ),
        sqlQuery(
            `select * from tbl_stdfeemaster where admno='${admno}' AND session= '${session}'`
        ),
        sqlQuery(
            `select * from tbl_monthfee where admno='${admno}' AND session= '${session}' `
        ),
        sqlQuery(
            `SELECT * FROM tbl_stdmonthfeedetail WHERE admno = "${admno}" ORDER BY pdate DESC`
        ),
    ]);
    const [latefinedate, examfee, miscfee, monthlyfeesetup]: any =
        await Promise.all([
            sqlQuery(`SELECT * FROM tbl_latefinedate;`),
            sqlQuery(
                `SELECT * FROM tbl_examfee WHERE class="${admission[0].class}";`
            ),
            sqlQuery(
                `SELECT * FROM tbl_miscfee WHERE class="${admission[0].class}";`
            ),
            sqlQuery(
                `SELECT * FROM tbl_monthlyfeesetup WHERE class="${admission[0].class}";`
            ),
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
}

async (req: Request, res: Response) => {
    const phone = req.query?.phone;
    const query = `SELECT * FROM tbl_admission where session="${curSession()}" and  active=1 and fmob='${phone}'`;
    const data = await sqlQueryStatus(query);
    console.log(data);
    res.send({ status: data });
};

const upload = multer({ storage: storage });
app.put(
    "/imageupload",
    upload.single("image"),
    async (req: Request, res: Response) => {
        try {
            const { admno, imagename } = req.body;
            console.log("uploaded sucess fully ", req.body);
            res.status(200).send({ status: "success" });
        } catch (err: any) {
            res.status(400).send(err.message);
        }
    }
);

app.put(
    "/profileupdate",
    upload.single("image"),
    async (req: Request, res: Response) => {
        try {
            const { admno, imagename, name, fname, mname, pdist } = req.body;
            const update = `UPDATE tbl_admission SET 
                        name  = '${name}',
                        fname = '${fname}',
                        mname = '${mname}', 
                        pdist = '${pdist}'
                        WHERE admno = '${admno}' AND active = 1 AND session = '${curSession()}';`;

            const data = await sqlQueryUpdate(update);
            console.clear();
            console.log([name, fname, mname, pdist, admno]);
            // console.log("parsed data:", data);
            console.log(
                "updated sucess fully ",
                data,
                imagename,
                typeof imagename
            );
            res.status(200).send(data);
        } catch (err: any) {
            res.status(400).send(err.message);
        }
    }
);
app.get("/phoneVerfication", async (req: Request, res: Response) => {
    try {
        console.log("phoneVerfication called");
        const phone = req.query?.phone;
        const query = `SELECT * FROM tbl_admission where session="${curSession()}" and  active=1 and fmob='${phone}'`;
        const data: {
            status: boolean;
            data: any;
        } = await sqlQueryStatus(query);
        const image: {
            type: string;
            name: string;
            data: string;
        }[] = new Array();
        if (data.status === true)
            for (let value of data.data) {
                try {
                    const imagePath = path.join(
                        __dirname,
                        `uploads/${value.admno}.jpg`
                    );
                    const img = fs.readFileSync(imagePath, "base64");
                    const obj: {
                        type: string;
                        name: string;
                        data: string;
                    } = {
                        type: "image/jpg",
                        name: `${value.admno}.jpg`,
                        data: img,
                    };
                    console.log("sucess");
                    image.push(obj);
                } catch (err) {
                    const obj = {
                        type: "",
                        name: "",
                        data: "",
                    };
                    image.push(obj);
                }
            }
        // console.log(data);
        res.status(200).send({ status: data, image: image });
    } catch (err) {
        res.status(400).send({ status: false, image: null });
    }
});

app.get("/paymentDetails", async (req: Request, res: Response) => {
    try {
        const admno = req.query?.admno;
        const data = await paymentDetails(`${admno}`, `${curSession()}`);
        try {
            const imagePath = path.join(
                __dirname,
                `uploads/${data.tbl_admission.imagepath}`
            );
            const image = fs.readFileSync(imagePath, "base64");
            res.contentType("content/json");
            res.status(200).send({ status: true, data: data, image: image });
        } catch (err) {
            res.status(200).send({ status: data, data: data, image: null });
        }
    } catch (err: any) {
        res.status(400).send(err.message);
    }
});

app.get("/BasicDetails", async (req: Request, res: Response) => {
    try {
        const admno = req.query?.admno;
        console.log("admno numer :", admno);
        const query = `SELECT * FROM tbl_admission where session="${curSession()}" and admno="${admno}" and active=1; `;
        const data: any = await sqlQueryStatus(query);
        console.log("basic details :", data);
        try {
            const imagePath = path.join(
                __dirname,
                `uploads/${data?.data.imagepath}`
            );
            const image = fs.readFileSync(imagePath, "base64");
            res.contentType("multipart/mixed");
            res.status(200).send({ status: data, image: image });
        } catch (err) {
            res.status(200).send({ status: data, image: null });
        }
    } catch (err: any) {
        res.status(400).send(err.message);
    }
});

app.get("/", (req: Request, res: Response) => {
    res.status(200).send("<h1>Welcome to Eduware Android</h1>");
});
app.get("/searchstd", async (req: Request, res: Response) => {
    if (req.query.class === "all" || req.query.class === "null") {
        res.status(400).send("Invalid Request");
        return;
    }
    console.log(req.query);
    const clas = req.query.class !== "null" ? `class="${req.query.class}"` : "";
    const sec =
        req.query.sec !== "null" ? `and section="${req.query.sec}"` : "";
    const roll =
        req.query.roll !== "null" ? `and roll="${req.query.roll}"` : "";
    const query = `SELECT admno,name,class,roll,fname,section FROM tbl_admission where   ${clas} ${sec} ${roll} and session="${curSession()}" and active=1  ORDER BY roll `;
    const data = await sqlQueryStatus(query);
    if (data.status === true) {
        // await pdfHTML(data.data);
        res.status(200).send(data.data);
    } else {
        res.status(404).send("Invalid Request");
    }
});

app.get("/dues", async (req: Request, res: Response) => {
    const clas = req.query.class;
    const section = req.query.section;
    console.log(req.query);

    const query = `select admno from tbl_admission where class="${clas}" AND section="${section}" AND session="${curSession()}" AND active=1;`;
    const data = await sqlQuerys(query);
    const arrays = await Promise.all(
        data.map((val: any) => new StdDuesCal(val.admno).getAllDues())
    );
    const marray = arrays.filter((x) => x.total > 0);
    console.log("send sucess fully");
    res.status(200).send({ data: marray });
});

// app.get("/getPDF", async (req: Request, res: Response) => {});
// const EPORT =process.env.PORT||3000;
// app.listen(EPORT, () => {
//     console.log("Server is running on port localhost:", EPORT);
// });

import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { StdDuesCal } from "./dues";
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        credentials: true,
    },
});
interface sdb {
    admno: string;
    socketid: string;
    class?: string;
    sec?: string;
}
const dbActive: sdb[] = [];

function removeDup(arr: sdb[], admno: string) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].admno === admno) {
            arr.splice(i, 1);
            break;
        }
    }
}

async function getLength(admno: string): Promise<number> {
    const usersel = `SELECT  COUNT(a.messageid) as c FROM tbl_adminannounce a
    LEFT JOIN tbl_stdannounce u ON a.messageid = u.messageid
    WHERE (a.to = '${admno}' OR a.to= 'all') 
      AND u.messageid IS NULL ORDER BY a.messageid DESC;`;
    const [unseen]: any = await Promise.all([sqlQueryStatus(usersel)]);
    console.log("length :", unseen.data[0].c);
    return unseen.data[0].c;
}

io.on("connection", (socket) => {
    console.log("A user connected");
    // socket.on("getPDF", async (response: { class: string; sec: string }) => {
    //     try {
    //         console.log(response);
    //         const query = `SELECT admno,name,class,section,roll,fname,ptown,fmob,imagepath FROM tbl_admission WHERE class='${
    //             response.class
    //         }' AND section='${
    //             response.sec
    //         }' AND session='${curSession()}' AND active=1  ORDER BY roll  ASC;`;
    //         const data: any = (await sqlQueryStatus(query)).data;
    //         if (data.length > 0) {
    //             await createPDF(data);
    //             // console.log(data)
    //             const value = await fs.readFileSync(
    //                 path.join(__dirname, "example.pdf"),
    //                 "base64"
    //             );
    //             socket.emit("getPDF", {
    //                 name: `${response.class}${response.sec}.pdf`,
    //                 pdf: value,
    //             });
    //         } else {
    //             socket.emit("error", "No Data Found");
    //         }
    //     } catch (e) {
    //         console.log(e);
    //     }
    // });
    socket.on(
        "register",
        (response: { admno: string; class: string; sec: string }) => {
            removeDup(dbActive, response.admno);
            if (response.admno !== undefined) {
                dbActive.push({
                    admno: response.admno,
                    socketid: socket.id,
                    class: response.class,
                    sec: response.sec,
                });
            }
            console.log("active user", dbActive);
        }
    );

    socket.on(
        "seen",
        (response: {
            admno: string;
            name: string;
            message: string;
            messageid: string;
        }): void => {
            const insert = `INSERT INTO tbl_stdannounce (admno,name,messaged,messageid) 
                        VALUES ('${response.admno}','${response.name}','${response.message}','${response.messageid}');`;
            sqlQueryUpdate(insert);
        }
    );

    socket.on(
        "getchat",
        async (response: {
            admno: string;
            class: string;
            sec: string;
        }): Promise<void> => {
            const admno = `SELECT  a.messageid, a.message, a.to, a.from, a.date , a.time  FROM tbl_adminannounce a
                    LEFT JOIN tbl_stdannounce u ON a.messageid = u.messageid
                    WHERE (a.to = '${response.admno}' OR a.to = 'all' or a.class='${response.class}' 
                                    AND (a.sec='all' or a.sec='${response.sec}')) ORDER BY a.messageid DESC;`;

            const usersel = `SELECT  a.messageid, a.message, a.to, a.from, a.date , a.time  FROM tbl_adminannounce a
                            LEFT JOIN tbl_stdannounce u ON a.messageid = u.messageid
                            WHERE (a.to = '${response.admno}' OR a.to = 'all' or a.class='${response.class}' 
                            AND (a.sec='all' or a.sec='${response.sec}')) 
                            AND u.messageid IS NULL ORDER BY a.messageid DESC;`;
            try {
                const [seen, unseen] = await Promise.all([
                    sqlQueryStatus(admno),
                    sqlQueryStatus(usersel),
                ]);
                console.log(seen, unseen);
                socket.emit("getchat", {
                    seen: seen.data,
                    unseen: unseen.data,
                });
            } catch (err) {
                console.log(err);
                socket.emit("getchat", { seen: null, unseen: null });
            }
        }
    );
    socket.on(
        "getAdminChat",
        async (response: { admin: string; pass: string }) => {
            const query =
                "SELECT  *  FROM tbl_adminannounce ORDER BY messageid DESC";
            const data = await sqlQueryStatus(query);
            socket.emit("getAdminChat", { data: data.data });
        }
    );

    socket.on(
        "getlength",
        async (response: {
            admno: string;
            class: string;
            sec: string;
        }): Promise<void> => {
            const usersel = `SELECT  COUNT(a.messageid) as c FROM tbl_adminannounce a
                            LEFT JOIN tbl_stdannounce u ON a.messageid = u.messageid
                            WHERE (a.to = '${response.admno}' OR a.to = 'all' or a.class='${response.class}' AND (a.sec='all' or a.sec='${response.sec}')) 
                            AND u.messageid IS NULL ORDER BY a.messageid DESC;`;
            const [unseen]: any = await Promise.all([sqlQueryStatus(usersel)]);
            console.log("length :", unseen?.data[0]?.c);
            socket.emit("getlength", { unseen: unseen?.data[0]?.c });
        }
    );

    // {message: string,to: string[],from:string,class:string,sec:string }
    socket.on("admin", async (response: any): Promise<void> => {
        console.log("repsponse :", response);
        if (Array.isArray(response.to) === true) {
            let i = 0;
            for (let admno of response.to) {
                const insert = `INSERT INTO tbl_adminannounce (message,\`from\`, \`to\`,name,fname,mclass,msec,mroll) 
                VALUES ('${response.message}','${response.from}','${admno}','${response.name[i]}','${response.fname[i]}','${response.mclass[i]}','${response.msec[i]}','${response.mroll[i]}');`;
                await sqlQueryUpdate(insert);
                i += 1;
            }
            for (let i = 0; i < response.to.length; i++) {
                for (let j = 0; j < dbActive.length; j++) {
                    if (dbActive[j].admno === response.to[i]) {
                        console.log(j, "passed ", dbActive[j]);
                        io.to(dbActive[j].socketid).emit(
                            "notice",
                            response.message
                        );
                        io.emit("getAdminStatus");
                    }
                }
            }
        } else if (response.class !== "") {
            console.log("we entered");
            const insert = `INSERT INTO tbl_adminannounce (message,\`from\`,\`to\`,class,sec) VALUES ('${response.message}','${response.from}','${response.class}','${response.class}','${response.sec}');`;
            console.log("status :", await sqlQueryUpdate(insert));
            io.emit("notice", "check message");
            io.emit("getAdminStatus");
        } else if (response.to[0] === "all") {
            console.log("emited :", response.message);
            io.emit("notice", { message: response.message });
            io.emit("getAdminStatus");
        }
        socket.disconnect();
    });
    socket.on("getImage", async (response: { class: string }) => {
        try {
            const query = `SELECT admno,name,class,section,roll,fname,ptown,fmob,imagepath FROM tbl_admission WHERE class='${
                response.class
            }' AND session='${curSession()}' AND active=1  ORDER BY roll  ASC;`;
            const data: any = (await sqlQueryStatus(query)).data;
            const image = [];
            for (let x of data) {
                x.imagepath = getImage(`${x.admno}.jpg`);
                image.push(x);
            }
            socket.emit("getImage", image);
        } catch (err) {
            socket.emit("getImage", []);
        }
    });

    socket.on("disconnect", (): void => {
        for (let i = 0; i < dbActive.length; i++) {
            if (dbActive[i].socketid == socket.id) {
                dbActive.splice(i, 1);
            }
        }
        console.log("A user disconnected", dbActive);
    });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
    console.log("Socket is running on port localhost:", PORT);
});

// async function stdHTML(item: any) {
//     let image: any = "";
//     try {
//         image = await fs.readFileSync(
//             path.join(__dirname, `uploads/${item.imagepath}`),
//             "base64"
//         );
//     } catch (e) {
//         image = await fs.readFileSync(
//             path.join(__dirname, "uploads/profile.png"),
//             "base64"
//         );
//     }
//     const str = `<div id="card">
//                 <img src='data:image/jpeg;base64,${image}'
//                     width="120px"
//                     height="120px"
//                 class="bg-gray-300 rounded-full"
//                 >
//             <div id="details">
//                 <div class="dm">
//                     <p class="dom">Name</p>
//                     <p class="nom">${item.name}</p>
//                 </div>
//                 <div class="dm">
//                     <p class="dom">class </p>
//                     <p class="nom">${item.class},${item.section},${item.roll}</p>
//                 </div>
//                 <div class="dm">
//                     <p class="dom">F.Name</p>
//                     <p class="nom">${item.fname}</p>
//                 </div>
//                 <div class="dm">
//                     <p class="dom">Address</p>
//                     <p class="nom">${item.ptown}</p>
//                 </div>
//                 <div class="dm">
//                     <p class="dom">Mob</p>
//                     <p class="nom">${item.fmob}</p>
//                 </div>
//             </div>
//         </div>`;
//     return str;
// }
// async function pdfHTML(item: any) {
//     let str = "";
//     for (let element of item) {
//         str += await stdHTML(element);
//     }
//     console.log(str);
//     return `<html>
//                 <style>
//                     #card{
//                         display: flex;
//                         flex: 1;
//                         flex-direction: row;
//                         outline-width: 2px;
//                         outline-color: gray;
//                         padding: 8px;
//                         gap: 10px;
//                         height: 300px;
//                         width: 500px;
//                         outline-style: solid;
//                         border-radius: 20px;
//                     }
//                     .dm{
//                         display: flex;
//                         flex-direction: row;
//                         gap: 10px;
//                         height: 30px;
//                         color:#2B2B2B ;
//                     }
//                     #details{
//                         display: flex;
//                         flex-direction: column;
//                         margin
//                     }
//                     #mcontainer{
//                         display: flex;
//                         flex-direction: column;
//                         gap: 10px;
//                         align-items: center;
//                         color:#2B2B2B ;
//                     }

//                     img{
//                         border-radius: 100%;
//                     }
//                 </style>
//                 <body>
//                     <div id="mcontainer">
//                         <h1 style="color: #2B2B2B;" >Class ${item[0].class}  Sec ${item[0].section}</h1>
//                         ${str}
//                 </div>
//                 </body>
//             </html>`;
// }
// async function createPDF(item: any) {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     const imagepath = path.join(__dirname, "uploads/profile.png");
//     const image = await fs.readFileSync(imagepath, "base64");
//     await page.setContent(await pdfHTML(item));
//     await page.pdf({ path: "example.pdf", format: "A4" });
//     await browser.close();
// }
