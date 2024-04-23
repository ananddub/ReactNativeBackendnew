import express, { Express, Request, Response } from "express";
import Cors from "cors";
import mysql from "mysql";
import bodyParser from "body-parser";
import { useNavigation } from "@react-navigation/native";
const app = express();
app.use(
    Cors({
        origin: "*",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTION"],
    })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.text());

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
        return { status: false };
    }
}
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

app.get("/phoneVerfication", async (req: Request, res: Response) => {
    const phone = req.query?.phone;
    const query = `SELECT * FROM tbl_admission where session="2023-2024" and  active=1 and fmob='${phone}'`;
    const data = await sqlQueryStatus(query);
    console.log(data);
    res.send({ status: data });
});

app.get("/paymentDetails", async (req: Request, res: Response) => {
    const admno = req.query?.admno;

    const data = await paymentDetails(`${admno}`, `2023-2024`);
    res.send({ status: true, data: data });
});

app.get("/BasicDetails", async (req: Request, res: Response) => {
    const admno = req.query?.admno;
    console.log("admno numer :", admno);

    const query = `SELECT * FROM tbl_admission where session="2023-2024" and admno="${admno}" and active=1; `;
    const data = await sqlQueryStatus(query);
    console.log(data);

    res.send({ status: data });
});
app.get("/", (req: Request, res: Response) => {
    res.send("<h1>Welcome to Eduware Android</h1>");
});
app.listen(4003, () => {
    console.log("Server is running on port localhost:0.0.0.0,4003");
});
