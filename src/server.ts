import * as express from "express";
import { Express, Request, Response } from "express";
import * as Cors from "cors";
import * as mysql from "mysql";
import * as multer from "multer";
import * as bodyParser from "body-parser";
import * as fs from "fs";
import * as path from "path";

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

async function sqlQuery(query: string) {
    const db = mysql.createConnection({
        // host: "89.117.188.154",
        // user: "u932299896_eduware",
        // password: "Webgen@220310",
        // database: "u932299896_sisdb",
        host: "localhost",
        user: "root",
        password: "root",
        database: "sisdb",
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
        // host: "89.117.188.154",
        // user: "u932299896_eduware",
        // password: "Webgen@220310",
        // database: "u932299896_sisdb",
        host: "localhost",
        user: "root",
        password: "root",
        database: "sisdb",
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
                    if (err) reject(false);
                    // console.log(result);
                    if (result.length > 0) resolve(result);
                    else resolve(false);
                } catch (err) {
                    resolve(false);
                }
            });
        });
        db.end();
        console.log("conection end");
        console.log("result of sql :", value);
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
        // host: "89.117.188.154",
        // user: "u932299896_eduware",
        // password: "Webgen@220310",
        // database: "u932299896_sisdb",
        host: "localhost",
        user: "root",
        password: "root",
        database: "sisdb",
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
                    resolve(false);
                }
            });
        });
        db.end();
        console.log("conection end");
        console.log("result of sql :", value);
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
    const query = `SELECT * FROM tbl_admission where session="2023-2024" and  active=1 and fmob='${phone}'`;
    const data = await sqlQueryStatus(query);
    console.log(data);
    res.send({ status: data });
};

const upload = multer({ storage: storage });
app.put(
    "/imageupload",
    upload.single("image"),
    async (req: Request, res: Response) => {
        console.log("uploaded sucess fully");
        res.send({ status: "success" });
    }
);

app.put(
    "/profileupdate",
    upload.single("image"),
    async (req: Request, res: Response) => {
        const { admno, imagename, name, fname, mname, pdist } = req.body;
        const update = `UPDATE tbl_admission SET 
                    name  = '${name}',
                    fname = '${fname}',
                    mname = '${mname}', 
                    pdist = '${pdist}'
                    ${
                        imagename !== undefined
                            ? `, imagepath = '${imagename}'`
                            : ""
                    }
                    WHERE admno = '${admno}' AND active = 1 AND session = '2023-2024';`;

        const data = await sqlQueryUpdate(update);
        console.clear();
        console.log([name, fname, mname, pdist, admno]);
        // console.log("parsed data:", data);
        console.log("updated sucess fully ", data, imagename, typeof imagename);
        res.send(data);
    }
);
app.get("/phoneVerfication", async (req: Request, res: Response) => {
    try {
        const phone = req.query?.phone;
        const query = `SELECT * FROM tbl_admission where session="2023-2024" and  active=1 and fmob='${phone}'`;
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
                        `uploads/${value.imagepath}`
                    );
                    const img = fs.readFileSync(imagePath, "base64");
                    const obj: {
                        type: string;
                        name: string;
                        data: string;
                    } = {
                        type: "image/jpeg",
                        name: `${value.imagepath}`,
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
        res.send({ status: data, image: image });
    } catch (err) {
        res.send({ status: false, image: null });
    }
});

app.get("/paymentDetails", async (req: Request, res: Response) => {
    const admno = req.query?.admno;
    const data = await paymentDetails(`${admno}`, `2023-2024`);
    try {
        const imagePath = path.join(
            __dirname,
            `uploads/${data.tbl_admission.imagepath}`
        );
        const image = fs.readFileSync(imagePath, "base64");
        res.contentType("content/json");
        res.send({ status: true, data: data, image: image });
    } catch (err) {
        res.send({ status: data, data: data, image: null });
    }
});

app.get("/BasicDetails", async (req: Request, res: Response) => {
    const admno = req.query?.admno;
    console.log("admno numer :", admno);
    const query = `SELECT * FROM tbl_admission where session="2023-2024" and admno="${admno}" and active=1; `;
    const data: any = await sqlQueryStatus(query);
    console.log("basic details :", data);
    try {
        const imagePath = path.join(
            __dirname,
            `uploads/${data?.data.imagepath}`
        );
        const image = fs.readFileSync(imagePath, "base64");
        res.contentType("multipart/mixed");
        res.send({ status: data, image: image });
    } catch (err) {
        res.send({ status: data, image: null });
    }
});

app.get("/", (req: Request, res: Response) => {
    res.send("<h1>Welcome to Eduware Android</h1>");
});

const EPORT = process.env.SPORT || 3000;
app.listen(EPORT, () => {
    console.log("Server is running on port localhost:", EPORT);
});




import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { response } from "express";
const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
		origin: "*",
        credentials: true,
	}
});
interface sdb {
    admno: string;
    socketid: string;
}
const dbActive:sdb[] = [];

function removeDup(arr:sdb[],admno:string) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].admno === admno) {
            arr.splice(i, 1);
            break;
        }
    }
}




async function getLength(admno:string):Promise<number>{
    const usersel =`SELECT  COUNT(a.messageid) as c FROM adminAnnoucment a
    LEFT JOIN userAnnoucment u ON a.messageid = u.messageid
    WHERE (a.receiver = '${admno}' OR a.receiver = 'all') 
      AND u.messageid IS NULL ORDER BY a.messageid DESC;`
    const [unseen]:any  = await Promise.all([sqlQueryStatus(usersel)]);
    console.log("length :",unseen.data[0].c)
    return unseen.data[0].c
}
io.on("connection", (socket) => {
    console.log("A user connected");
    
    socket.on("register", (response: { admno: string}) => {
        removeDup(dbActive,response.admno)
        if(response.admno!==undefined){

            dbActive.push({
                admno: response.admno,
                socketid: socket.id,
            })
        }
        console.log("active user", dbActive);
    });
    
    socket.on("seen",(response: {admno: string,name:string,message:string,messageid:string}) => {
        const insert = `INSERT INTO userAnnoucment (admno,name,messaged,messageid) VALUES ('${response.admno}','${response.name}','${response.message}','${response.messageid}');`
        sqlQueryUpdate(insert);
    })
    
    socket.on('getchat',async (response: {admno: string}) => {
        const admno= `SELECT  a.messageid, a.message, a.receiver, a.sender, a.date , a.time  FROM adminAnnoucment a
        LEFT JOIN userAnnoucment u ON a.messageid = u.messageid
        WHERE (a.receiver = '${response.admno}' OR a.receiver = 'all') ORDER BY a.messageid DESC;;
                        `
        const usersel =`SELECT  a.messageid, a.message, a.receiver, a.sender, a.date , a.time  FROM adminAnnoucment a
        LEFT JOIN userAnnoucment u ON a.messageid = u.messageid
        WHERE (a.receiver = '${response.admno}' OR a.receiver = 'all') 
          AND u.messageid IS NULL ORDER BY a.messageid DESC;
          `        
        const [seen,unseen]  = await Promise.all([sqlQueryStatus(admno),sqlQueryStatus(usersel)]);
        console.log(seen,unseen);
        socket.emit('getchat',{seen:seen.data,unseen:unseen.data});
    })
    
    socket.on('getlength',async (response: {admno: string}) => {
        
        const usersel =`SELECT  COUNT(a.messageid) as c FROM adminAnnoucment a
        LEFT JOIN userAnnoucment u ON a.messageid = u.messageid
        WHERE (a.receiver = '${response.admno}' OR a.receiver = 'all') 
          AND u.messageid IS NULL ORDER BY a.messageid DESC;
          `        
        const [unseen]:any  = await Promise.all([sqlQueryStatus(usersel)]);
        console.log("length :",unseen?.data[0]?.c)
        socket.emit('getlength',{unseen:unseen?.data[0]?.c});
    })


    socket.on("admin", async(response: {message: string,reciver: string[],sender:string }) => {
        console.log(response.message);
        if(Array.isArray(response.reciver)===true){
            for (let admno of response.reciver) {
                const insert = `INSERT INTO adminAnnoucment (message,sender, receiver) VALUES ('${response.message}','${response.sender}','${admno}');`
                sqlQueryUpdate(insert);
            }
        }else{
            console.log('send aa array')
            return;
        }
        if(response.reciver[0] === "all"){
            console.log('emited :',response.message);
            io.emit("notice", {"message":response.message});
        }
        else{
            for (let i = 0; i < response.reciver.length; i++) {
                for (let j = 0; j < dbActive.length; j++) {
                    if (dbActive[j].admno === response.reciver[i]) {
                        console.log(j,'passed ',dbActive[j]);
                        io.to(dbActive[j].socketid).emit("notice", response.message);
                    }
                }
            }
        }
    });

    socket.on("disconnect", () => {
        for (let i = 0; i < dbActive.length; i++) {
            if (dbActive[i].socketid == socket.id) {
                dbActive.splice(i, 1);
            }
        }
        console.log("A user disconnected",dbActive);
    });
});

const PORT = process.env.PORT||443;
httpServer.listen(PORT, () => {
    console.log("Socket is running on port localhost:",PORT);
});
