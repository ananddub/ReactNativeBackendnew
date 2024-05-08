const mysql = require("mysql");
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
interface FeeStructure {
    admno: string;
    apr: number | null;
    may: number | null;
    jun: number | null;
    jul: number | null;
    aug: number | null;
    sep: number | null;
    oct: number | null;
    nov: number | null;
    dece: number | null;
    jan: number | null;
    feb: number | null;
    mar: number | null;
    billdues: number;
    session: string | null;
}
interface stdFeeMaster {
    admno: string;
    monthfee: number;
    transportfee: number;
    hostelfee: number;
    session: string;
}
interface Dues {
    name: string;
    fees: number;
}
class StdDuesCal {
    private transfee: any[] = [];
    private hostelfee: any[] = [];
    private monthfee: any[] = [];
    private monthdues: Dues[] = [];
    private transdues: Dues[] = [];
    private hosteldues: Dues[] = [];
    private tbl_admduesamt: number = 0;
    private tbl_itemduesamt: number = 0;
    private tbl_sessionfee: number = 0;
    private lday: number = 0;
    private stdfeemaster: stdFeeMaster = {
        admno: "",
        monthfee: 0,
        transportfee: 0,
        hostelfee: 0,
        session: "",
    };
    private billdues = 0;
    constructor(private admno: string) {}
    private curSession(): string {
        const date = new Date();
        const year = date.getFullYear() - 1;
        return `${year}-${new Date().getFullYear()}`;
    }
    private nextSession(): string {
        const date = new Date();
        const year = date.getFullYear() + 1;
        return `${new Date().getFullYear()}-${year}`;
    }
    private curMonthIndex = () => {
        const mnum = new Date().getMonth();
        const busnessMonth = [
            "apr",
            "may",
            "jun",
            "jul",
            "aug",
            "sep",
            "oct",
            "nov",
            "dec",
            "jan",
            "feb",
            "mar",
        ];
        const month = [
            "jan",
            "feb",
            "mar",
            "apr",
            "may",
            "jun",
            "jul",
            "aug",
            "sep",
            "oct",
            "nov",
            "dec",
        ];
        const index = busnessMonth.find((m: string) => month[mnum] === m);
        return busnessMonth.indexOf(`${index}`);
    };
    private getMonthIndex = (index: string) => {
        const busnessMonth = [
            "apr",
            "may",
            "jun",
            "jul",
            "aug",
            "sep",
            "oct",
            "nov",
            "dec",
            "jan",
            "feb",
            "mar",
        ];
        if (index === "dece") index = "dec";
        return busnessMonth.indexOf(`${index}`);
    };
    async setAdmDuesAmt() {
        const tempdata: { dues: number }[] = await sqlQuery(
            `SELECT duesamt FROM tbl_admissionfeepmt WHERE admno="${
                this.admno
            }" AND session in("${this.curSession()}","${this.nextSession()}") AND duesstatus='NP';`
        );
        if (tempdata.length > 0) this.tbl_admduesamt = tempdata[0].dues;
        console.log("sesion dues fee :", this.tbl_admduesamt);
    }
    async setItemDuesAmt() {
        const query = `SELECT dues
        FROM tbl_itemreceipt 
        WHERE admno="${this.admno}" 
        AND srno = (SELECT MAX(srno) FROM tbl_itemreceipt WHERE admno="${this.admno}");`;
        const tempdata: any = await sqlQuery(query);
        if (tempdata.length > 0) this.tbl_itemduesamt = tempdata[0].dues;
        console.log(query, [tempdata]);
    }
    async setSessionFee() {
        const tempdata: any = await sqlQuery(
            `SELECT dues FROM tbl_sessionfee WHERE admno="${
                this.admno
            }" AND session="${this.curSession()}" AND duesstatus="NP";`
        );
        if (tempdata.length > 0) this.tbl_sessionfee = tempdata[0].sessionfee;
        console.log(tempdata);
    }
    async setStdFee() {
        const tempdata = await sqlQuery(
            `SELECT * FROM tbl_stdfeemaster where admno="${admno}" AND session="${this.curSession()}";`
        );
        console.log(tempdata);
        if (tempdata.length > 0) this.stdfeemaster = tempdata[0];
        console.log(tempdata);
    }
    async setLday() {
        const tempdata: { lday: number }[] = await sqlQuery(
            "SELECT * FROM `tbl_latefinedate`"
        );
        if (tempdata.length > 0) this.lday = tempdata[0].lday;
    }
    async setMonthFee() {
        await this.setLday();
        await this.setStdFee();
        const query = `SELECT * FROM tbl_monthfee  WHERE admno="${
            this.admno
        }" AND session="${this.curSession()}";`;
        const data: FeeStructure[] = await sqlQuery(query);
        for (let [keys, value] of Object.entries(data[0])) {
            if (keys.length < 5) {
                if (keys === "dece") keys = "dec";
                this.monthfee.push([keys, value]);
            }
        }
        this.billdues = data[0].billdues;
        console.log("billdues :", this.billdues);
    }
    async setTransFee() {
        const query = `SELECT * FROM tbl_transportfee  WHERE admno="${
            this.admno
        }" AND session="${this.curSession()}";`;
        const data: FeeStructure[] = await sqlQuery(query);
        for (let [keys, value] of Object.entries(data[0])) {
            if (keys.length < 5) {
                if (keys === "dece") keys = "dec";
                this.transfee.push([keys, value]);
            }
        }
    }
    async setHostelFee() {
        const query = `SELECT * FROM tbl_hostelfee  WHERE admno="${
            this.admno
        }" AND session="${this.curSession()}";`;
        const data: FeeStructure[] = await sqlQuery(query);
        for (let [keys, value] of Object.entries(data[0])) {
            if (keys.length < 5) {
                if (keys === "dece") keys = "dec";
                this.transfee.push([keys, value]);
            }
        }
    }
    setTransDues() {
        const day = new Date().getDate();
        for (let v of this.transfee) {
            if (
                (this.getMonthIndex(v[0]) < this.curMonthIndex() &&
                    v[1] === 0) ||
                (this.getMonthIndex(v[0]) == this.curMonthIndex() &&
                    v[1] === 0 &&
                    day > this.lday)
            ) {
                this.transdues.push({
                    name: v[0],
                    fees: this.stdfeemaster.transportfee,
                });
            }
        }
    }
    setHostelDues() {
        const day = new Date().getDate();
        for (let v of this.hostelfee) {
            if (
                (this.getMonthIndex(v[0]) < this.curMonthIndex() &&
                    v[1] === 0) ||
                (this.getMonthIndex(v[0]) == this.curMonthIndex() &&
                    v[1] === 0 &&
                    day > this.lday)
            ) {
                this.hosteldues.push({
                    name: v[0],
                    fees: this.stdfeemaster.hostelfee,
                });
            }
        }
    }
    setMonthDues() {
        const day = new Date().getDate();
        for (let v of this.monthfee) {
            if (
                (this.getMonthIndex(v[0]) < this.curMonthIndex() &&
                    v[1] === 0) ||
                (this.getMonthIndex(v[0]) == this.curMonthIndex() &&
                    v[1] === 0 &&
                    day > this.lday)
            ) {
                this.monthdues.push({
                    name: v[0],
                    fees: this.stdfeemaster.monthfee,
                });
            }
        }
    }
    async getStdDues() {}
}

const admno = "ASIS192000173";
const obj = new StdDuesCal(admno);
console.log(new Date().getDate());
// (async () => {
//     console.log("started ");
//     await obj.setMonthFee();
//     console.log("started count");
//     await obj.setMonthDues();

// })();
// obj.setAdmDuesAmt();
obj.setSessionFee();
// obj.setItemDuesAmt();
obj.setMonthFee();
