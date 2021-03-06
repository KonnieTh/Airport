import pg from "pg";
import bcrypt from 'bcrypt';

//Σύνδεση με τη βάση Δεδομένων
const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL, //μεταβλητή περιβάλλοντος
    ssl: {
      rejectUnauthorized: false
    }
});

async function connect(){
    try{
        const client = await pool.connect();
        return client;
    }
    catch(e){
        console.error(`Failed to connect ${e}`)
    }
}
//Εύρεση Αεροπορικής Εταιρείας με βάση το όνομα της
async function getAirline(name,callback){
    const sql =   `select * from "Airline" where "airline_name"='${name}'`;
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
//Εύρεση Αεροπορικής Εταιρείας με βάση το γράμμα με το οποίο ξεκινάει
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
//Εύρεση Αεροπορικής Εταιρείας με βάση το id της
async function getAirlineName(id,callback){
    const sql =   `select * from "Airline" where "airline_ID"='${id}'`;
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
//Ανανέωση στοιχείων Αεροπορικής Εταιρείας και εγγραφή στον πίνακα processing.
async function editAirline(airline,date,id,callback){
    const sql = `update "Airline" 
                set telephone='${airline.telephone}',email='${airline.email}',"gate_code" = (SELECT "gate_ID" from "Gate" where terminal='${airline.terminal}' and gate_name='${airline.gate}' and gate_number='${airline.gate_number}')
                where "IATA" = '${airline.iata}'`;
    const sql2 = `insert into "processing" ("username","airline_ID","processing_date") VALUES('${id}',(select "airline_ID" from "Airline" where "IATA"='${airline.iata}'),'${date}')`;
    try{
        const client = await connect();
        const res = await client.query(sql);
        await client.release();
        const client2 = await connect();
        const res1 = await client2.query(sql2);
        await client2.release();
        callback(null,res.rows);
    }
    catch(err){
        callback(err,null);
    }
}

//Διαγραφή Αεροπορικής Εταιρείας
async function deleteAirline(airline,date,id,callback){
    const sql = `delete from "Airline" where "IATA" = '${airline.IATA}'`;
    const sql2 = `insert into "processing" ("username","airline_ID","processing_date") VALUES('${id}',(select "airline_ID" from "Airline" where "IATA"='${airline.IATA}'),'${date}')`;
    try{
        const client = await connect();
        const res1 = await client.query(sql2);
        const res = await client.query(sql);
        await client.release();
        callback(null,res.rows);
    }
    catch(err){
        callback(err,null);
    }
}
//Δημιουργία Αεροπορικής Εταιρείας και εγγραφή στον πίνακα processing.
async function insertAirline(airline,date,id,callback){
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
            const sql3 = `insert into "processing" ("username","airline_ID","processing_date") VALUES('${id}',(select "airline_ID" from "Airline" where "IATA"='${airline.iata}'),'${date}')`;
            try{
                const client = await connect();
                const res1 = await client.query(sql2);
                const res2 = await client.query(sql3);
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
//Εύρεση κειμένου Γενικών Ανακοινώσεων με βάση τον τίτλο
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

//Ανανέωση κειμένου Γενικών Ανακοινώσεων και εγγραφή της αλλαγή στον πίνακα modifies
async function editInfo(text,date,id,callback){
    const sql = `update "General_info" set "description"='${text.keimeno}' where "title"='${text.titlos}' `;
    const sql1 = `insert into "modifies" ("username","info_ID","modification_date") VALUES('${id}',(select "info_ID" from "General_info" where "title"='${text.titlos}'),'${date}')`;
    try{
        const client = await connect();
        const res = await client.query(sql);
        const res1 = await client.query(sql1);
        await client.release();
        callback(null,res.rows);
    }
    catch(err){
        callback(err,null);
    }
}
//Δημιουργία Ανακοίνωσης
async function createAnnouncement(text,id,callback){
    const sql1 = 'select "announcement_ID" from "Announcement"'
    try{
        const client = await connect();
        const res = await client.query(sql1);
        await client.release();
        let sql;
        if (res.rows.length>0){
            sql = `insert into "Announcement" ("announcement_ID","username","theme","ann_text","ann_date","ann_time","priority") VALUES((select max("announcement_ID")+1 from "Announcement"),'${id}','${text.titlos}','${text.keimeno}','${text.date}','${text.time}','${text.priority}') `;
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
        else{
            sql = `insert into "Announcement" ("announcement_ID","username","theme","ann_text","ann_date","ann_time","priority") VALUES((select max("announcement_ID")+1 from "Announcement"),'${id}','${text.titlos}','${text.keimeno}','${text.date}','${text.time}','${text.priority}') `;            
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
//Εύρεση όλων των ανακοινώσεων
async function getAnnouncements(callback){
    const sql = ` Select * from "Announcement"`;
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

//Εύρεση ανακοινώσεων βάση τη προτεραιότητα που δίνει ο χρήστης
async function getAnnouncementsByPriority(priority,callback){
    if(priority=="all"){
        const sql = ` Select * from "Announcement"`;
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
    else{
        const sql = ` Select * from "Announcement" where "priority"='${priority}'`;
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
//Εύρεση ανακοινώσεων με βάση το id.
async function getAnnouncementById(id,callback){
    const sql = ` Select * from "Announcement" where "announcement_ID" = ${id}`;
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
//Εύρεση αφίξεων με βάση την τωρινή ημερομηνία από ακριβώς μέχρι και μία ώρα μετά την τωρινή ώρα.
async function addFlightFrom(callback){
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = ("0" + (date_ob.getHours())).slice(-2);
    let minutes = ("0" + (date_ob.getMinutes())).slice(-2);
    let full_date=year + "-" + month + "-" + date;
    let cur_time_3=hours + ":" + minutes + ":00";
    let cur_time=hours + ":" + "00" + ":00";
    if(parseInt(hours)+1>24){
        var cur_time_2=("0" + (parseInt(hours)+1-24).toString()).slice(-2); + ":" + minutes + ":00"
    }else{
        var cur_time_2=("0" + (parseInt(hours)+1).toString()).slice(-2) + ":" + minutes + ":00"
    }
    const sql = `Select "airline_name","flight_ID" ,"city","flight_date"::text,"expected_time","terminal","gate_number","gate_name",CASE WHEN "expected_time"<='${cur_time_3}' THEN 1 WHEN "expected_time">'${cur_time_3}' THEN 0 END AS "left" 
    from "flies" natural join "Airport" join "Airline" on "flies"."airline_ID" = "Airline"."airline_ID" join "Gate" on "Airline".gate_code = "Gate"."gate_ID"  
    WHERE "flight_date"='${full_date}' and "is_destination"=false and "Airport"."IATA"!='ATH' and "expected_time">'${cur_time}' and "expected_time"<'${cur_time_2}'  
    order by expected_time;`;    
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
//Εύρεση αναχωρήσεων με βάση την τωρινή ημερομηνία από ακριβώς μέχρι και μία ώρα μετά την τωρινή ώρα.
async function addFlightTo(callback){
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = ("0" + (date_ob.getHours())).slice(-2);
    let minutes = ("0" + (date_ob.getMinutes() + 1)).slice(-2);
    let full_date=year + "-" + month + "-" + date;
    let cur_time=hours + ":" + "00" + ":00"
    
    if(parseInt(hours)+1>24){
        var cur_time_2=("0" + (parseInt(hours)+1-24).toString()).slice(-2); + ":" + minutes + ":00"
    }else{
        var cur_time_2=("0" + (parseInt(hours)+1).toString()).slice(-2) + ":" + minutes + ":00"
    }
    let cur_time_3=hours + ":" + minutes + ":00";
    const sql = `Select "airline_name","flight_ID" ,"city","flight_date"::text,"expected_time","terminal","gate_number","gate_name",CASE WHEN "expected_time"<='${cur_time_3}' THEN 1 WHEN "expected_time">'${cur_time_3}' THEN 0 END AS "left" 
            from "flies" natural join "Airport" join "Airline" on "flies"."airline_ID" = "Airline"."airline_ID" join "Gate" on "Airline".gate_code = "Gate"."gate_ID"  
            WHERE "flight_date"='${full_date}' and "is_destination"=true and "Airport"."IATA"!='ATH' and "expected_time">'${cur_time}' and "expected_time"<'${cur_time_2}'  
            order by expected_time;`;    
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
//Εύρεση διακριτών αεροδρομίων που έχουν πτήσεις
async function getAirports(callback){
    const sql = ` select distinct "airport_name" from "flies" natural join "Airport" order by "airport_name"`;
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
//Εύρεση διακριτών αεροπορικών εταιρειών που έχουν πτήσεις.
async function getAirlines(callback){
    const sql = ` select distinct "airline_name" from "flies" natural join "Airline" order by "airline_name"`;
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

//Εύρεση χρήστη με βάση το username του.
async function getUserByUsername(username, callback) {
    const sql= `SELECT "username", "password","is_admin" FROM "General_User" WHERE "username" = '${username}' ORDER BY "username" LIMIT 1`
    try{
        const client = await connect();
        const res = await client.query(sql);
        await client.release();
        callback(null,res.rows[0]);
    }
    catch(err){
        callback(err,null);
    }
}

//Εισαγωγή καινούργιου user που κάνει εγγραφή
async function insertUser(username,password,fname,lname,age,sex,email,phone,country,is_adm,callback){
    getUserByUsername(username, async (err, userId) => {
        if (userId != undefined) {
            callback(null, null, { message: "Υπάρχει ήδη χρήστης με αυτό το όνομα" })
        } else {
            try {
                const hashedPassword = await bcrypt.hash(password, 10);
                const sql = ` insert into "General_User"("username","password","first_name","last_name","email","telephone","age","country", "is_admin", "sex") values ('${username}','${hashedPassword}', '${fname}', '${lname}' ,'${email}','${phone}','${age}','${country}','${is_adm}','${sex}')`;
                if(is_adm===true){
                    var sql2 = ` insert into "Admin"("username") values ('${username}')`;
                }else{
                    var sql2 = ` insert into "User"("username") values ('${username}')`;
                }
                try{
                    const client = await connect();
                    const res = await client.query(sql);
                    await client.release();
                    const client2 = await connect();
                    const res2 = await client2.query(sql2);
                    await client2.release();
                    callback(null,res.rows);
                }
                catch(err){
                    callback(err,null);
                }
            }catch (err) {
                callback(err)
            }
        }
    })
}

//Εύρεση με πτήσεων με βάση τα στοιχεία που συμπληρώνει ο χρήστης στη φόρμα που υπάρχει στη σελίδα Πτήσεις
async function getRoutes(airlineName,date_c,airportName,isDest,id1,callback){
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = ("0" + (date_ob.getHours())).slice(-2);
    let minutes = ("0" + (date_ob.getMinutes())).slice(-2);
    let full_date=year+'-'+month+'-'+date
    let cur_time=hours + ":" + minutes + ":00"
    if(airlineName!='-' && airportName!='-' && id1!=''){
        var sql = ` Select "airline_name","flight_ID" ,"city","flight_date"::text,"expected_time","terminal","gate_number","gate_name",CASE WHEN "expected_time"<='${cur_time}' and "flight_date"='${full_date}' THEN 1 ELSE 0 END AS "left" from "flies" natural join "Airport" join "Airline" on "flies"."airline_ID" = "Airline"."airline_ID" join "Gate" on "Airline".gate_code = "Gate"."gate_ID"  WHERE "flight_date"='${date_c}' and "Airport"."IATA"!='ATH'and  "is_destination"=${isDest} and "Airport"."airport_name"='${airportName}'and "Airline"."airline_name"='${airlineName}' and "flies"."flight_ID"='${id1}' order by "expected_time"`;
    }else if(airlineName=='-' && airportName!='-' && id1!=''){
        var sql = ` Select "airline_name","flight_ID" ,"city","flight_date"::text,"expected_time","terminal","gate_number","gate_name",CASE WHEN "expected_time"<='${cur_time}' and "flight_date"='${full_date}' THEN 1 ELSE 0 END AS "left" from "flies" natural join "Airport" join "Airline" on "flies"."airline_ID" = "Airline"."airline_ID" join "Gate" on "Airline".gate_code = "Gate"."gate_ID"  WHERE "flight_date"='${date_c}' and "Airport"."IATA"!='ATH' and "is_destination"=${isDest} and "Airport"."airport_name"='${airportName}' and "flies"."flight_ID"='${id1}' order by "expected_time"`;
    }else if(airlineName=='-' && airportName=='-' && id1!=''){
        var sql = ` Select "airline_name","flight_ID" ,"city","flight_date"::text,"expected_time","terminal","gate_number","gate_name",CASE WHEN "expected_time"<='${cur_time}' and "flight_date"='${full_date}' THEN 1 ELSE 0 END AS "left" from "flies" natural join "Airport" join "Airline" on "flies"."airline_ID" = "Airline"."airline_ID" join "Gate" on "Airline".gate_code = "Gate"."gate_ID"  WHERE "flight_date"='${date_c}' and "Airport"."IATA"!='ATH' and "is_destination"=${isDest} and "flies"."flight_ID"='${id1}' order by "expected_time"`;
    }else if(airlineName!='-' && airportName!='-' && id1==''){
        var sql = ` Select "airline_name","flight_ID" ,"city","flight_date"::text,"expected_time","terminal","gate_number","gate_name",CASE WHEN "expected_time"<='${cur_time}' and "flight_date"='${full_date}' THEN 1 ELSE 0 END AS "left" from "flies" natural join "Airport" join "Airline" on "flies"."airline_ID" = "Airline"."airline_ID" join "Gate" on "Airline".gate_code = "Gate"."gate_ID"  WHERE "flight_date"='${date_c}' and "Airport"."IATA"!='ATH' and "is_destination"=${isDest} and "Airport"."airport_name"='${airportName}'and "Airline"."airline_name"='${airlineName}' order by "expected_time"`;
    }else if(airlineName=='-' && airportName!='-' && id1==''){
        var sql = ` Select "airline_name","flight_ID" ,"city","flight_date"::text,"expected_time","terminal","gate_number","gate_name",CASE WHEN "expected_time"<='${cur_time}' and "flight_date"='${full_date}' THEN 1 ELSE 0 END AS "left" from "flies" natural join "Airport" join "Airline" on "flies"."airline_ID" = "Airline"."airline_ID" join "Gate" on "Airline".gate_code = "Gate"."gate_ID"  WHERE "flight_date"='${date_c}' and "Airport"."IATA"!='ATH' and "is_destination"=${isDest} and "Airport"."airport_name"='${airportName}' order by "expected_time"`;
    }else if(airlineName=='-' && airportName=='-' && id1==''){
        var sql = ` Select "airline_name","flight_ID" ,"city","flight_date"::text,"expected_time","terminal","gate_number","gate_name",CASE WHEN "expected_time"<='${cur_time}' and "flight_date"='${full_date}' THEN 1 ELSE 0 END AS "left" from "flies" natural join "Airport" join "Airline" on "flies"."airline_ID" = "Airline"."airline_ID" join "Gate" on "Airline".gate_code = "Gate"."gate_ID"  WHERE "flight_date"='${date_c}' and "Airport"."IATA"!='ATH' and "is_destination"=${isDest} order by "expected_time"`;
    }else if(airlineName!='-' && airportName=='-' && id1==''){
        var sql = ` Select "airline_name","flight_ID" ,"city","flight_date"::text,"expected_time","terminal","gate_number","gate_name",CASE WHEN "expected_time"<='${cur_time}' and "flight_date"='${full_date}' THEN 1 ELSE 0 END AS "left" from "flies" natural join "Airport" join "Airline" on "flies"."airline_ID" = "Airline"."airline_ID" join "Gate" on "Airline".gate_code = "Gate"."gate_ID"  WHERE "flight_date"='${date_c}' and "Airport"."IATA"!='ATH' and "is_destination"=${isDest} and "Airline"."airline_name"='${airlineName}' order by "expected_time"`;
    }else if(airlineName!='-' && airportName=='-' && id1!=''){
        var sql = ` Select "airline_name","flight_ID" ,"city","flight_date"::text,"expected_time","terminal","gate_number","gate_name",CASE WHEN "expected_time"<='${cur_time}' and "flight_date"='${full_date}' THEN 1 ELSE 0 END AS "left" from "flies" natural join "Airport" join "Airline" on "flies"."airline_ID" = "Airline"."airline_ID" join "Gate" on "Airline".gate_code = "Gate"."gate_ID"  WHERE "flight_date"='${date_c}' and "Airport"."IATA"!='ATH' and "is_destination"=${isDest} and "Airport"."airline_name"='${airlineName}' and "flies"."flight_ID"='${id1}' order by "expected_time"`;
    }
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



export{getUserByUsername,insertUser,getAirline,getRoutes,getAirlines,getAirports,getAnnouncementsByPriority,getAnnouncements,getAnnouncementById,getAirlinebyletter,getAirlineName,editAirline,deleteAirline,insertAirline,getText,editInfo,createAnnouncement,addFlightFrom,addFlightTo}