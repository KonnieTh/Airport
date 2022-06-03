import pg from "pg";
// import dotenv from "dotenv";

// dotenv.config();

const pool = new pg.Pool({
    user:"postgres",
    password:"abcd123!",
    host:"localhost",
    port:5432,
    database:"Airport"
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

async function getAirlineName(id,callback){
    const sql =   `select * from "Airline" where "airline_ID"='${id}'`;
    try{
        const client = await connect();
        const res = await client.query(sql);
        await client.release();
        console.log(res.rows);
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

async function insertAirline(airline,callback){
    const sql1 = `select * from "Airline" where "airline_name"='${airline.name}' or "IATA" = '${airline.iata}'`;
    try{
        const client = await connect();
        const res = await client.query(sql1);
        await client.release();
        if(res.rows.length>0){
            console.log("Η αεροπορική εταιρεία που πήγες να προσθέσεις ήδη υπάρχει! Μπορείς να αλλάξεις τα στοιχεία της πατώντας επεξεργασία στην συγκεκριμένη αεροπορική εταιρεία!");
        }   
        else{
            const sql2 = `insert into "Airline" ("airline_ID","airline_name","IATA","ICAO","telephone","email","gate_code") VALUES((select max("airline_ID")+1 from "Airline"),'${airline.name}','${airline.iata}','${airline.icao}','${airline.telephone}','${airline.email}', (select "gate_ID" from "Gate" where "terminal"='${airline.terminal}' and "gate_name"='${airline.gate}' and "gate_number" = '${airline.gate_number}'))`;
            try{
                const client = await connect();
                const res1 = await client.query(sql2);
                await client.release();
                callback(null,res1.rows);
            }
            catch(err){
                callback(err,null);
            }
        }
    }
    catch(err){
        callback(err,null);
    }
}

async function getText(textTitle,callback){
    const sql = `select * from "General_info" where "title"='${textTitle}' `;
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


async function editInfo(text,callback){
    console.log(2,text);
    const sql = `update "General_info" set "description"='${text.keimeno}' where "title"='${text.titlos}' `;
    try{
        const client = await connect();
        const res = await client.query(sql);
        await client.release();
        console.log(res.rows);
        callback(null,res.rows);
    }
    catch(err){
        callback(err,null);
    }
}

async function createAnnouncement(text,callback){
    const sql1 = 'select "announcement_ID" from "Announcement"'
    try{
        const client = await connect();
        const res = await client.query(sql1);
        await client.release();
        let sql;
        if (res.rows.length>0){
            sql = `insert into "Announcement" ("announcement_ID","username","theme","ann_text","ann_date","ann_time","priority") VALUES((select max("announcement_ID")+1 from "Announcement"),'test','${text.titlos}','${text.keimeno}','${text.date}','${text.time}','${text.priority}') `;
            try{
                const client = await connect();
                const res = await client.query(sql);
                await client.release();
                console.log(res.rows)
                callback(null,res.rows);
            }
            catch(err){
                callback(err,null);
            }
        }
        else{
            sql = `insert into "Announcement" ("announcement_ID","username","theme","ann_text","ann_date","ann_time","priority") VALUES(0,'test','${text.titlos}','${text.keimeno}','${text.date}','${text.time}','${text.priority}') `;
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
    }
    catch(err){
        callback(err,null);
    }
}

async function getAnnouncements(callback){
    const sql = ` Select * from "Announcement"`;
    try{
        const client = await connect();
        const res = await client.query(sql);
        await client.release();
        console.log(res.rows)
        callback(null,res.rows);
    }
    catch(err){
        callback(err,null);
    }
}


async function getAnnouncementsByPriority(priority,callback){
    if(priority=="all"){
        const sql = ` Select * from "Announcement"`;
        try{
            const client = await connect();
            const res = await client.query(sql);
            await client.release();
            console.log(res.rows)
            callback(null,res.rows);
        }
        catch(err){
            callback(err,null);
        }
    }
    else{
        const sql = ` Select * from "Announcement" where "priority"='${priority}'`;
        try{
            const client = await connect();
            const res = await client.query(sql);
            await client.release();
            console.log(res.rows)
            callback(null,res.rows);
        }
        catch(err){
            callback(err,null);
        }
    }
}

async function getAnnouncementById(id,callback){
    const sql = ` Select * from "Announcement" where "announcement_ID" = ${id}`;
    try{
        const client = await connect();
        const res = await client.query(sql);
        await client.release();
        console.log(res.rows)
        callback(null,res.rows);
    }
    catch(err){
        callback(err,null);
    }
}

async function addFlightFrom(callback){
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = ("0" + (date_ob.getHours())).slice(-2);
    let minutes = ("0" + (date_ob.getMinutes())).slice(-2);
    let full_date=year + "-" + month + "-" + date;
    let cur_time=hours + ":" + minutes + ":00"
    console.log(parseInt(hours))
    if(parseInt(hours)+1>24){
        var cur_time_2=(parseInt(hours)+1-24).toString() + ":" + minutes + ":00"
    }else{
        var cur_time_2=(parseInt(hours)+1).toString() + ":" + minutes + ":00"
    }
    const sql = `Select "airline_name","flight_ID" ,"city","flight_date"::text,"expected_time","terminal","gate_number","gate_name" from "flies" natural join "Airport" join "Airline" on "flies"."airline_ID" = "Airline"."airline_ID" join "Gate" on "Airline".gate_code = "Gate"."gate_ID"  WHERE "flight_date"='${full_date}' and "is_destination"=false and "Airport"."IATA"!='ATH' and "expected_time">'${cur_time}' and "expected_time"<'${cur_time_2}' order by expected_time `;
    try{
        const client = await connect();
        const res = await client.query(sql);
        await client.release();
        console.log(res.rows)
        callback(null,res.rows);
    }
    catch(err){
        callback(err,null);
    }
}

async function addFlightTo(callback){
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = ("0" + (date_ob.getHours())).slice(-2);
    let minutes = ("0" + (date_ob.getMinutes() + 1)).slice(-2);
    let full_date=year + "-" + month + "-" + date;
    let cur_time=hours + ":" + minutes + ":00"
    
    if(parseInt(hours)+1>24){
        var cur_time_2=(parseInt(hours)+1-24).toString() + ":" + minutes + ":00"
    }else{
        var cur_time_2=(parseInt(hours)+1).toString() + ":" + minutes + ":00"
    }
    const sql = `Select "airline_name","flight_ID" ,"city","flight_date"::text,"expected_time","terminal","gate_number","gate_name" from "flies" natural join "Airport" join "Airline" on "flies"."airline_ID" = "Airline"."airline_ID" join "Gate" on "Airline".gate_code = "Gate"."gate_ID"  WHERE "flight_date"='${full_date}' and "is_destination"=true and "Airport"."IATA"!='ATH' and "expected_time">'${cur_time}' and "expected_time"<'${cur_time_2}' order by expected_time `;
    try{
        const client = await connect();
        const res = await client.query(sql);
        await client.release();
        console.log(res.rows)
        callback(null,res.rows);
    }
    catch(err){
        callback(err,null);
    }
}

export{getAnnouncementsByPriority,getAnnouncements,getAnnouncementById,getAirlinebyletter,getAirlineName,editAirline,deleteAirline,insertAirline,getText,editInfo,createAnnouncement,addFlightFrom,addFlightTo}















