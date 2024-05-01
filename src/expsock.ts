import { createServer } from "http";
import { Server, Socket } from "socket.io";
import * as mysql from "mysql";
import { response } from "express";
import * as express from "express";
const httpServer = createServer(express());
const io = new Server(httpServer, {
    cors: {
		origin: "*",
        credentials: true,
	}
});
interface sdb {
    admno: string;
    socketid: string;
    class?:string;
    sec?:string;
}
const dbActive:sdb[] = [];


io.on("connection", (socket) => {
    console.log("A user connected");
    
    socket.on("register", (response: { admno: string,class:string,sec:string}) => {
        removeDup(dbActive,response.admno)
        if(response.admno!==undefined){

            dbActive.push({
                admno: response.admno,
                socketid: socket.id,
                class:response.class,
                sec:response.sec
            })
        }
        console.log("active user", dbActive);
    });
    
    socket.on("seen",(response: {admno: string,name:string,message:string,messageid:string,class:string,section:string}) => {
        const insert = `INSERT INTO userAnnoucment (admno,name,messaged,messageid,class,section) VALUES ('${response.admno}','${response.name}','${response.message}','${response.messageid}','${response.class}','${response.section}');`
        sqlQueryUpdate(insert);
    })
    
    socket.on('getchat',async (response: {admno: string,class:string,sec:string}) => {
        const admno= `SELECT  a.messageid, a.message, a.receiver, a.sender, a.date , a.time  FROM adminAnnoucment a
        LEFT JOIN userAnnoucment u ON a.messageid = u.messageid
        WHERE (a.receiver = '${response.admno}' OR a.receiver = 'all' ) ORDER BY a.messageid DESC;;
                        `
        const usersel =`SELECT  a.messageid, a.message, a.receiver, a.sender, a.date , a.time  FROM adminAnnoucment a
        LEFT JOIN userAnnoucment u ON a.messageid = u.messageid
        WHERE (a.receiver = '${response.admno}' OR a.receiver = 'all' or class='${response.class}' or sec='${response.sec}') 
          AND u.messageid IS NULL ORDER BY a.messageid DESC;
          `        
        const [seen,unseen]  = await Promise.all([sqlQueryStatus(admno),sqlQueryStatus(usersel)]);
        console.log(seen,unseen);
        socket.emit('getchat',{seen:seen.data,unseen:unseen.data});
    })
    
    socket.on('getlength',async (response: {admno: string,class:string,sec:string}) => {
        const usersel =`SELECT  COUNT(a.messageid) as c FROM adminAnnoucment a
        LEFT JOIN userAnnoucment u ON a.messageid = u.messageid
        WHERE (a.receiver = '${response.admno}' OR a.receiver = 'all') 
          AND u.messageid IS NULL ORDER BY a.messageid DESC;
          `        
        const [unseen]:any  = await Promise.all([sqlQueryStatus(usersel)]);
        console.log("length :",unseen.data[0].c)
        
        socket.emit('getlength',{unseen:unseen.data[0].c});
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

io.engine.on("connection_error", (err) => {
    console.log(err.req);      
    console.log(err.code);     
    console.log(err.message);  
    console.log(err.context);  
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log("server is running on port localhost:434");
});








async function getLength(admno:string):Promise<number>{
    const usersel =`SELECT  COUNT(a.messageid) as c FROM adminAnnoucment a
    LEFT JOIN userAnnoucment u ON a.messageid = u.messageid
    WHERE (a.receiver = '${admno}' OR a.receiver = 'all') 
      AND u.messageid IS NULL ORDER BY a.messageid DESC;`
    const [unseen]:any  = await Promise.all([sqlQueryStatus(usersel)]);
    console.log("length :",unseen.data[0].c)
    return unseen.data[0].c
}

function removeDup(arr:sdb[],admno:string) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].admno === admno) {
            arr.splice(i, 1);
            break;
        }
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
                    if (err){
                        console.log(err)
                        reject(false);}
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