import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({
    user:"postgres",
    password:"test1234",
    host:"localhost",
    port:5432,
    database:"airport"
})

async function connect(){
    try{
        const client = await pool.connect();
        return client;
    }
    catch(e){
        console.error(`Failed to connect ${e}`)
    }
}

async function getAirlinebyletter(letter,callback){
    const sql =   `select * from "Airline" INNER JOIN "Gate" on "Airline"."gate_code"="Gate"."gate_ID" where substr(airline_name,1,1)='${letter}' order by airline_name`;
    try{
        const client = await connect();
        const res = await client.query(sql);
        await client.release();
        callback(null,res.rows);
    }
    catch(err){
        callback(err,null);
    }
}

async function editAirline(airline,callback){
    const sql = `update "Airline" 
                set telephone='${airline.telephone}',email='${airline.email}',"gate_code" = (SELECT "gate_ID" from "Gate" where terminal='${airline.terminal}' and gate_name='${airline.gate}' and gate_number='${airline.gate_number}')
                where "IATA" = '${airline.iata}'`;
    try{
        const client = await connect();
        const res = await client.query(sql);
        console.log(res);
        await client.release();
        callback(null,res.rows);
    }
    catch(err){
        callback(err,null);
    }
}


async function deleteAirline(airline,callback){
    const sql = `delete from "Airline" where "IATA" = '${airline.IATA}'`;
    try{
        const client = await connect();
        const res = await client.query(sql);
        await client.release();
        callback(null,res.rows);
    }
    catch(err){
        callback(err,null);
    }
}

// async function insertAirline(airline,callback){
//     const sql = `insert into "Airline" ("airline_name","IATA","ICAO","telephone","email","gate_code") VALUES('${}','${}','${}','${}','${}','${}')`;
//     try{
//         const client = await connect();
//         const res = await client.query(sql);
//         await client.release();
//         callback(null,res.rows);
//     }
//     catch(err){
//         callback(err,null);
//     }
// }

// async function editGeneralInfo(text,callback){
//     const sql = ;
//     try{
//         const client = await connect();
//         const res = await client.query(sql);
//         await client.release();
//         callback(null,res.rows);
//     }
//     catch(err){
//         callback(err,null);
//     }
// }

export{getAirlinebyletter,editAirline,deleteAirline}

// ,editAirline,deleteAirline,insertAirline,editGeneralInfo














