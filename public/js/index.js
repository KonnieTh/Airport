const express = require('express');
const app = express();
const path = require("path");
const https = require('https');
const cors = require('cors');
const axios = require('axios');
const cheerio = require("cheerio");
const { request } = require('https');
const res = require('express/lib/response');
const { Console } = require('console');
const { createCipheriv } = require('crypto');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const Datastore = require('nedb');
const { nextTick } = require('process');
const { json } = require('express/lib/response');
const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const { insertBefore } = require('parse5-htmlparser2-tree-adapter');
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get('/arrivals/airline/:iata', (req,res) =>{
    async function getData(){
        const iata = req.params.iata;
        // const response = await fetch(`https://app.goflightlabs.com/flights?access_key=${key}&arr_iata=ATH&airline_iata=${iata}`)
        // const data = await response.json();
        let data;
        let data_sorted = [];
        if (iata=="A3"){
            data = await A_arr;
            for(let i=0;i<data.length;i++){
                const datetime = data[i].arrival.scheduled.split("T");
                let actual_time = data[i].arrival.actual;
                if(actual_time!=null){
                    actual_time = data[i].arrival.actual.split("T");
                    if(actual_time!=null){
                      actual_time = actual_time.split("T");
                      actual_time = "Αφίχθη" + " " + actual_time[1].slice(0,5);
                  }
                    actual_time = str.slice(0,str.length-1);
                }
                data_sorted.push([datetime[0],datetime[1].slice(0,5),data[i].departure.airport,data[i].flight.iata,actual_time,data[i].arrival.terminal]);
            }
            data_sorted = data_sorted.sort();
        }
        res.json(data_sorted);
    }
    getData().catch(error => {
        console.log(error);
    })
})


app.get('/departures/airline/:iata', (req,res) =>{
    async function getData(){
        const iata = req.params.iata;
        // const response = await fetch(`https://app.goflightlabs.com/flights?access_key=${key}&dep_iata=ATH&airline_iata=${iata}`)
        // const data = await response.json();
        let data;
        let data_sorted = [];
        if (iata=="A3"){
            data = await A_dep;
            for(let i=0;i<data.length;i++){
                const datetime = data[i].departure.scheduled.split("T");
                let actual_time = data[i].departure.actual_runway;
                if(actual_time!=null){
                    actual_time = actual_time.split("T");
                    actual_time = "Αναχώρησε" + " " + actual_time[1].slice(0,5);
                }
                data_sorted.push([datetime[0],datetime[1].slice(0,5),data[i].arrival.airport,data[i].flight.iata,actual_time,data[i].departure.gate]);
            }
            data_sorted = data_sorted.sort();
        }
        res.json(data_sorted);
    }
    getData().catch(error => {
        console.log(error);
    })
})



app.put('/airlines_edit',(req,res)=>{
  console.log(req.body);
  const airlines = new Database('airport.db',Database.OPEN_READWRITE,(err) =>{
      if (err) {
          console.log(err)
      }
      else{
          console.log("Connection successful")
      }
  });

  const sql = `update airlines
                set telephone = '${req.body.telephone}',email='${req.body.email}',entrance='${req.body.entrance}',airport_tel='${req.body.airport}',lostfound='${req.body.lostfound}'
                where iata='${req.body.iata}';`;
  airlines.exec(sql);
})


app.delete('/airlines_delete',(req,res)=>{
  const airlines = new Database('airport.db',Database.OPEN_READWRITE,(err) =>{
      if (err) {
          console.log(err)
      }
      else{
          console.log("Connection successful")
      }
  });
  const sql = `delete from airlines
                where iata='${req.body.iata}';`;
  airlines.exec(sql);
})

app.post('/new_airline',(req,res)=>{
  const airlines = new Database('airport.db',Database.OPEN_READWRITE,(err) =>{
    if (err) {
        console.log(err)
    }
    else{
        console.log("Connection successful")
    }
});
  const sql = `INSERT INTO airlines (name,iata,icao,telephone,airport_tel,email,lostfound,entrance,iconsrc) VALUES(?,?,?,?,?,?,?,?,?)`;
  const insert = airlines.prepare(sql);
  const name  = req.body.name;
  const iata = req.body.iata;
  const icao = req.body.icao;
  const tel = req.body.telephone;
  const airport = req.body.airport;
  const email = req.body.email;
  const lostfound = req.body.lostfound;
  const  entrance= req.body.entrance;
  const iconsrc= req.body.iconsrc;
  insert.run(name,iata,icao,tel,airport,email,lostfound,entrance,iconsrc);
  airlines.close((err)=>{
    if(err) return console.log(err);
  })
})



app.get('/airlines/filter/:letter',(req,res)=>{
    const db = new Database('airport.db',Database.OPEN_READWRITE,(err) =>{
    if (err) {
        console.log(err)
    }
    else{
        console.log("Connection successful")
    }
    });
    const sql =   `select * from airlines where substr(name,1,1)='${req.params.letter}' order by name`;
    const getAll = db.prepare(sql).all();
    res.json(getAll);
})


app.get('/airlines',(req,res)=>{
    const db = new Database('airport.db',Database.OPEN_READWRITE,(err) =>{
    if (err) {
        console.log(err)
    }
    else{
        console.log("Connection successful")
    }
    });
    const sql =   `select * from airlines order by name`;
    const getAll = db.prepare(sql).all();
    res.json(getAll);
})


// Creation of Database of airlines
// const db = new Database('airport.db',Database.OPEN_READWRITE,(err) =>{
//     if (err) {
//         console.log(err)
//     }
//     else{
//         console.log("Connection successful")
//     }
// });

// let sql = `CREATE TABLE IF NOT EXISTS airlines('id' INTEGER PRIMARY KEY AUTOINCREMENT,'name' TEXT,'iata' TEXT,'icao' TEXT,'telephone' TEXT,'airport_tel' TEXT,'email' TEXT,'lostfound' TEXT,'entrance' TEXT,'iconsrc' TEXT);`

// db.exec(sql);


// sql = `INSERT INTO airlines (name,iata,icao,telephone,airport_tel,email,lostfound,entrance,iconsrc) VALUES(?,?,?,?,?,?,?,?,?)`;

// const insert = db.prepare(sql);

// const url = 'https://iata-and-icao-codes.p.rapidapi.com/airlines';

// const options = {
//   method: 'GET',
//   headers: {
//     'X-RapidAPI-Host': 'iata-and-icao-codes.p.rapidapi.com',
//     'X-RapidAPI-Key': '72241a884dmsh8de9c7fffb619bep154dbejsn38d304e0a370'
//   }
// };

// fetch(url, options)
// 	.then(res => res.json())
// 	.then(data =>{
//         for(let i of data){
//             let str = i.name.split(" ");
//             console.log(str);
//             let name="";
//             for(let j=0;j<str.length-1;j++){
//                 str[j] = str[j].toLowerCase();
//                 name += str[j].charAt(0).toUpperCase() + str[j].slice(1) + " ";
//             }
//             str[str.length-1] = str[str.length-1].toLowerCase();
//             name += str[str.length-1].charAt(0).toUpperCase() + str[str.length-1].slice(1);
//             console.log(name);
//             const iata_code = i.iata_code;
//             const icao_code = i.icao_code;
//             insert.run(name,iata_code,icao_code,null,null,null,null,null,null);
//             console.log("A new row has been created");
//         }
//         console.log("DONE");
//         db.close((err) =>{
//             if (err) return console.log(err);
//         })
//     })
// 	.catch(err => console.error('error:' + err));


/////Creation of database of text

// const db = new Database('airport.db',Database.OPEN_READWRITE,(err) =>{
//     if (err) {
//         console.log(err)
//     }
//     else{
//         console.log("Connection successful")
//     }
// });

// let sql = `CREATE TABLE IF NOT EXISTS innerTexts('id' INTEGER PRIMARY KEY AUTOINCREMENT,'titlos' TEXT,'keimeno' TEXT);`
// db.exec(sql);



app.get('/text/:titlos',(req,res)=>{
  console.log(req.params);
  
  const airlines = new Database('airport.db',Database.OPEN_READWRITE,(err) =>{
    if (err) {
        console.log(err)
    }
    else{
        console.log("Connection successful")
    }
  });
  const sql = `select * from innerTexts where titlos='${req.params.titlos}'`;
  const getresult = airlines.prepare(sql).all();
  res.json(getresult);
  airlines.close((err)=>{
    if(err) return console.log(err);
  })
})


app.put('/edit_text',(req,res)=>{
  console.log(req.body);
  const airlines = new Database('airport.db',Database.OPEN_READWRITE,(err) =>{
    if (err) {
        console.log(err)
    }
    else{
        console.log("Connection successful")
    }
  });
  const sql = `update innerTexts
              set keimeno='${req.body.keimeno}'
              where titlos='${req.body.titlos}'`;
  airlines.exec(sql);

  airlines.close((err)=>{
    if(err) return console.log(err);
  })
})


app.listen(3000);


//Creation of Database of airports

// const airports = new Datastore('airports_database.db');

// airports.loadDatabase(); //#load database

// const letters = [ "A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]

// function Airport(iata,icao,name,location){
//     this.name = name;
//     this.iata = iata;
//     this.icao = icao;
//     this.location = location;
// }

// const getRawData = (URL) => {
//     return fetch(URL)
//        .then((response) => response.text())
//        .then((data) => {
//           return data;
//     });
// };

// const listOfAirports = async(url) =>{
//     let airports_data = await getRawData(url);
//     let parsedAirportsData = cheerio.load(airports_data);
//     let airportsDataTable = parsedAirportsData("table.wikitable")[0].children[1].children;
//     if(url=="https://en.wikipedia.org/wiki/List_of_airports_by_IATA_airport_code:_W"){
//         let airportsDataTable = parsedAirportsData("table.wikitable")[0].children[3].children;
//         airportsDataTable.forEach((row) => {
//             if (row.name ==='tr'){
//                 const columns = row.children.filter((column) => column.name === "td");
//                 let name;
//                 let iata;
//                 let icao;
//                 let place="";
    
//                 let iata_code = columns[0];
//                 if(iata_code){
//                     iata = iata_code.children[0];
//                     if (iata){
//                         iata = iata.data;
//                     }
//                 }
                
//                 let icao_code = columns[1];
//                 if(icao_code){
//                     icao = icao_code.children[0];
//                     if (icao){
//                         icao = icao.data;
//                     }
//                 }
    
//                 let airport_name = columns[2];
//                 if (airport_name){
//                     name = airport_name.children[0];
//                     try{
//                         if(name!==undefined){
//                             name = name.children[0];
//                             if(name){
//                                 name = name.data;
//                             }
//                         }
//                     }
//                     catch(error){
//                         name = airport_name.children[0];
//                         name = name.data;
//                     }
//                 }
    
//                 let airport_location = columns[3];
//                 if (airport_location){
//                     let locations = airport_location.children;
//                     locations.forEach((child) => {
//                         if(child.name==='a'){
//                             place=place + "," + child.children[0].data;
//                         }
//                     })
//                 }
//                 if(iata!=undefined & name!=undefined & place!=""){
//                     let p = new Airport(iata,icao,name,place.slice(1,place.length));
//                     airports.insert(p);
//                 }
//             }
//         })
//     }
//     airportsDataTable.forEach((row) => {
//         if (row.name ==='tr'){
//             const columns = row.children.filter((column) => column.name === "td");
//             let name;
//             let iata;
//             let icao;
//             let place="";

//             let iata_code = columns[0];
//             if(iata_code){
//                 iata = iata_code.children[0];
//                 if (iata){
//                     iata = iata.data;
//                 }
//             }
            
//             let icao_code = columns[1];
//             if(icao_code){
//                 icao = icao_code.children[0];
//                 if (icao){
//                     icao = icao.data;
//                 }
//             }

//             let airport_name = columns[2];
//             if (airport_name){
//                 name = airport_name.children[0];
//                 try{
//                     if(name!==undefined){
//                         name = name.children[0];
//                         if(name){
//                             name = name.data;
//                         }
//                     }
//                 }
//                 catch(error){
//                     name = airport_name.children[0];
//                     name = name.data;
//                 }
//             }

//             let airport_location = columns[3];
//             if (airport_location){
//                 let locations = airport_location.children;
//                 locations.forEach((child) => {
//                     if(child.name==='a'){
//                         place=place + "," + child.children[0].data;
//                     }
//                 })
//             }
//             if(iata!=undefined & name!=undefined & place!=""){
//                 let p = new Airport(iata,icao,name,place.slice(1,place.length));
//                 airports.insert(p);
//             }
//         }
//     })
// }


// for(let i of letters){
//     url = `https://en.wikipedia.org/wiki/List_of_airports_by_IATA_airport_code:_${i}`;
//     listOfAirports(url);
// }







// app.use(express.urlencoded({extended:false}));

// app.get('/arrivals', async (req,res) =>{
//     async function getData(){
//         const db = new Datastore('airports_database.db');
//         db.loadDatabase();
//         const airlines = new Database('airport.db',Database.OPEN_READWRITE,(err) =>{
//             if (err) {
//                 console.log(err)
//             }
//             else{
//                 console.log("Connection successful")
//             }
//         });
//         let data = [];
//         const response1 = await fetch(`https://app.goflightlabs.com/flights?access_key=${key}&arr_iata=ATH&flight_status=active`)
//         const data1 = await response1.json();
//         const response2 = await fetch(`https://app.goflightlabs.com/flights?access_key=${key}&arr_iata=ATH&flight_status=scheduled`)
//         const data2 = await response2.json();
//         const response3 = await fetch(`https://app.goflightlabs.com/flights?access_key=${key}&arr_iata=ATH&flight_status=cancelled`)
//         const data3 = await response3.json();
//         const response4 = await fetch(`https://app.goflightlabs.com/flights?access_key=${key}&arr_iata=ATH&flight_status=landed`)
//         const data4 = await response4.json();
//         const response5 = await fetch(`https://app.goflightlabs.com/flights?access_key=${key}&arr_iata=ATH&flight_status=incident`)
//         const data5 = await response5.json();
//         const response6 = await fetch(`https://app.goflightlabs.com/flights?access_key=${key}&arr_iata=ATH&flight_status=diverted`)
//         const data6 = await response6.json();
//         const response7 = await fetch(`https://app.goflightlabs.com/flights?access_key=${key}&arr_iata=ATH`)
//         const data7 = await response7.json();
//         if (data1.success !=false){
//             data = data.concat(data1);
//         }
//         if (data2.success !=false){
//             data = data.concat(data2);
//         }
//         if (data3.success !=false){
//             data = data.concat(data3);
//         }
//         if (data4.success !=false){
//             data = data.concat(data4);
//         }
//         if (data5.success !=false){
//             data = data.concat(data5);
//         }
//         if (data6.success !=false){
//             data = data.concat(data6);
//         }
//         if (data7.success !=false){
//             data = data.concat(data7);
//         }
//         res.json(data);
//         const airports_arrivals=[];
//         for(let i=0;i<data.length-1;i++){
//             const air_iata = data[i].airline.iata;
//             const sql = `select name from airlines where iata=?`;
//             const airline = airlines.prepare(sql).get(air_iata);
//             db.find({ iata: `${data[i].departure.iata}` }, function (err, docs) {
//                 const airport = {
//                     name :docs[0].name,
//                     iata :docs[0].iata,
//                     icao :docs[0].icao,
//                     location: docs[0].location,
//                     airline_iata : air_iata,
//                     airline_name : airline
//                 }
//                 // console.log(airport);
//                 airports_arrivals.push(airport);
//                 app.get('/airports/arrivals',(req,res) => {
//                     res.json(airports_arrivals);
//                 })
//             })
//         }
//     }
//     getData().catch(error => {
//         console.log(error);
//     })
// })


// app.get('/departures', async (req,res) =>{
//     async function getData(){
//         const db = new Datastore('airports_database.db');
//         db.loadDatabase();
//         const airlines = new Database('airport.db',Database.OPEN_READWRITE,(err) =>{
//             if (err) {
//                 console.log(err)
//             }
//             else{
//                 console.log("Connection successful")
//             }
//         });
//         let data = [];
//         const response1 = await fetch(`https://app.goflightlabs.com/flights?access_key=${key}&dep_iata=ATH&flight_status=active`)
//         const data1 = await response1.json();
//         const response2 = await fetch(`https://app.goflightlabs.com/flights?access_key=${key}&dep_iata=ATH&flight_status=scheduled`)
//         const data2 = await response2.json();
//         const response3 = await fetch(`https://app.goflightlabs.com/flights?access_key=${key}&dep_iata=ATH&flight_status=cancelled`)
//         const data3 = await response3.json();
//         const response4 = await fetch(`https://app.goflightlabs.com/flights?access_key=${key}&dep_iata=ATH&flight_status=landed`)
//         const data4 = await response4.json();
//         const response5 = await fetch(`https://app.goflightlabs.com/flights?access_key=${key}&dep_iata=ATH&flight_status=incident`)
//         const data5 = await response5.json();
//         const response6 = await fetch(`https://app.goflightlabs.com/flights?access_key=${key}&dep_iata=ATH&flight_status=diverted`)
//         const data6 = await response6.json();
//         const response7 = await fetch(`https://app.goflightlabs.com/flights?access_key=${key}&dep_iata=ATH`)
//         const data7 = await response7.json();
//         if (data1.success !=false){
//             data = data.concat(data1);
//         }
//         if (data2.success !=false){
//             data = data.concat(data2);
//         }
//         if (data3.success !=false){
//             data = data.concat(data3);
//         }
//         if (data4.success !=false){
//             data = data.concat(data4);
//         }
//         if (data5.success !=false){
//             data = data.concat(data5);
//         }
//         if (data6.success !=false){
//             data = data.concat(data6);
//         }
//         if (data7.success !=false){
//             data = data.concat(data7);
//         }
//         res.json(data);
//         const airports_departures=[]
//         for(let i=0;i<data.length-1;i++){
//             const air_iata = data[i].airline.iata;
//             const sql = `select name from airlines where iata=?`;
//             const airline = airlines.prepare(sql).get(air_iata);
//             db.find({ iata: `${data[i].arrival.iata}` }, function (err, docs) {
//                 const airport = {
//                     name :docs[0].name,
//                     iata :docs[0].iata,
//                     icao :docs[0].icao,
//                     location: docs[0].location,
//                     airline_iata : air_iata,
//                     airline_name : airline
//                 }
//                 // console.log(airport);
//                 airports_departures.push(airport);
//                 app.get('/airports/departures',(req,res) => {
//                     res.json(airports_departures);
//                 })
//             })
//         }
//     }
//     getData().catch(error => {
//         console.log(error);
//     })
// })



// const url_arrivals_form = `https://app.goflightlabs.com/flights?access_key=${key}&arr_iata=ATH&dep_iata=${}&airline_iata=${}&flight_number=${}&arr_scheduled_time_arr=${}`;

// const url_departures_form = `https://app.goflightlabs.com/flights?access_key=${key}&arr_iata=${}&dep_iata=ATH&airline_iata=${}&flight_number=${}&arr_scheduled_time_dept=${}`;


// app.post("/user_arrivals", async (req,res) => {
//     res.send("post ok");
// })

// app.use(express.urlencoded({extended:false}));

// app.post("/user_departures",(req,res) =>{
//     res.send("post ok");
//     const user_input={
//         user_airport:req.body.user_arrival_airport,
//         user_airline:req.body.user_airline_departure,
//         user_flight_code:req.body.user_number_of_flight,
//         user_date:req.body.date
//     };
//     console.log(user_input);
//     app.get("/results",async(request,result) =>{
//         const db = new Datastore('airports_database.db');
//         db.loadDatabase();
//         const str = user_input.user_airport.split(',');
//         const airport_iata = str[str.length-1];
//         const airlines = new Database('airport.db',Database.OPEN_READWRITE,(err) =>{
//             if (err) {
//                 console.log(err)
//             }
//             else{
//                 console.log("Connection successful")
//             }
//         });
//         const sql=`select iata from airlines where name=?`;
//         const airline_iata = airlines.prepare(sql).get(user_input.user_airline);
//         console.log(airport_iata,airline_iata.iata,user_input.user_flight_code,user_input.user_date);
//         const url_departures_form = `https://app.goflightlabs.com/flights?access_key=${key}&arr_iata=${airport_iata}&dep_iata=ATH&airline_iata=${airline_iata.iata}&flight_number=${user_input.user_flight_code}&arr_scheduled_time_dept=${user_input.user_date}`;
//         console.log(url_departures_form);
//         const response = await fetch(url_departures_form);
//         const data =await response.json();
//         console.log(data);
//         result.json(data);
//     })
// })

// let http = require('http'),
//     fs = require('fs');


// fs.readFile('./main-page.html', function (err, html) {
//     if (err) {
//         throw err; 
//     }       
//     http.createServer(function(request, response) {  
//         response.writeHeader(200, {"Content-Type": "main-page/html"});  
//         response.write(html);  
//         response.end();  
//     }).listen(3000);
// });





// const key = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiNDUzMmEzMWJmNTliNmIxNzZiODJmY2U1YzMxOGZmMjhiY2U2N2ZhYjhjN2ZkMTc1MjUxNjEyYjQzNjRiMjExMTExZmJhOTY3NDAwNWQwODkiLCJpYXQiOjE2NTMzNDIxMjcsIm5iZiI6MTY1MzM0MjEyNywiZXhwIjoxNjg0ODc4MTI3LCJzdWIiOiI1MDQ0Iiwic2NvcGVzIjpbXX0.ldJdoFmo6gIiDaslelHnxxssWPhZgpCU_cvym36pGMOzHQdJnrt4fJCuhX0WUWCZ3ZneC35gJpN2nsekuFvL1g";
// A_arr=[{
//   "flight_date": "2022-05-26",
//   "flight_status": "scheduled",
//   "departure": {
//     "airport": "Beirut Rafic Hariri Airport",
//     "timezone": "Asia/Beirut",
//     "iata": "BEY",
//     "icao": "OLBA",
//     "terminal": null,
//     "gate": null,
//     "delay": null,
//     "scheduled": "2022-05-26T04:30:00+00:00",
//     "estimated": "2022-05-26T04:30:00+00:00",
//     "actual": null,
//     "estimated_runway": null,
//     "actual_runway": null
//   },
//   "arrival": {
//     "airport": "Athens International Airport \"Eleftherios Venizelos\"",
//     "timezone": "Europe/Athens",
//     "iata": "ATH",
//     "icao": "LGAV",
//     "terminal": null,
//     "gate": null,
//     "baggage": null,
//     "delay": null,
//     "scheduled": "2022-05-26T06:30:00+00:00",
//     "estimated": "2022-05-26T06:30:00+00:00",
//     "actual": null,
//     "estimated_runway": null,
//     "actual_runway": null
//   },
//   "airline": {
//     "name": "Aegean Airlines",
//     "iata": "A3",
//     "icao": "AEE"
//   },
//   "flight": {
//     "number": "947",
//     "iata": "A3947",
//     "icao": "AEE947",
//     "codeshared": null
//   },
//   "aircraft": null,
//   "live": null
// },
// {
//   "flight_date": "2022-05-26",
//   "flight_status": "scheduled",
//   "departure": {
//     "airport": "Larnaca",
//     "timezone": "Asia/Nicosia",
//     "iata": "LCA",
//     "icao": "LCLK",
//     "terminal": null,
//     "gate": null,
//     "delay": null,
//     "scheduled": "2022-05-26T05:15:00+00:00",
//     "estimated": "2022-05-26T05:15:00+00:00",
//     "actual": null,
//     "estimated_runway": null,
//     "actual_runway": null
//   },
//   "arrival": {
//     "airport": "Athens International Airport \"Eleftherios Venizelos\"",
//     "timezone": "Europe/Athens",
//     "iata": "ATH",
//     "icao": "LGAV",
//     "terminal": null,
//     "gate": null,
//     "baggage": null,
//     "delay": null,
//     "scheduled": "2022-05-26T07:00:00+00:00",
//     "estimated": "2022-05-26T07:00:00+00:00",
//     "actual": null,
//     "estimated_runway": null,
//     "actual_runway": null
//   },
//   "airline": {
//     "name": "Aegean Airlines",
//     "iata": "A3",
//     "icao": "AEE"
//   },
//   "flight": {
//     "number": "901",
//     "iata": "A3901",
//     "icao": "AEE901",
//     "codeshared": null
//   },
//   "aircraft": null,
//   "live": null
// },
// {
//   "flight_date": "2022-05-26",
//   "flight_status": "scheduled",
//   "departure": {
//     "airport": "Ben Gurion International",
//     "timezone": "Asia/Jerusalem",
//     "iata": "TLV",
//     "icao": "LLBG",
//     "terminal": "3",
//     "gate": null,
//     "delay": null,
//     "scheduled": "2022-05-26T05:10:00+00:00",
//     "estimated": "2022-05-26T05:10:00+00:00",
//     "actual": null,
//     "estimated_runway": null,
//     "actual_runway": null
//   },
//   "arrival": {
//     "airport": "Athens International Airport \"Eleftherios Venizelos\"",
//     "timezone": "Europe/Athens",
//     "iata": "ATH",
//     "icao": "LGAV",
//     "terminal": null,
//     "gate": null,
//     "baggage": null,
//     "delay": null,
//     "scheduled": "2022-05-26T07:20:00+00:00",
//     "estimated": "2022-05-26T07:20:00+00:00",
//     "actual": null,
//     "estimated_runway": null,
//     "actual_runway": null
//   },
//   "airline": {
//     "name": "Aegean Airlines",
//     "iata": "A3",
//     "icao": "AEE"
//   },
//   "flight": {
//     "number": "929",
//     "iata": "A3929",
//     "icao": "AEE929",
//     "codeshared": null
//   },
//   "aircraft": null,
//   "live": null
// },
// {
//   "flight_date": "2022-05-26",
//   "flight_status": "scheduled",
//   "departure": {
//     "airport": "Macedonia International",
//     "timezone": "Europe/Athens",
//     "iata": "SKG",
//     "icao": "LGTS",
//     "terminal": null,
//     "gate": null,
//     "delay": null,
//     "scheduled": "2022-05-26T06:20:00+00:00",
//     "estimated": "2022-05-26T06:20:00+00:00",
//     "actual": null,
//     "estimated_runway": null,
//     "actual_runway": null
//   },
//   "arrival": {
//     "airport": "Athens International Airport \"Eleftherios Venizelos\"",
//     "timezone": "Europe/Athens",
//     "iata": "ATH",
//     "icao": "LGAV",
//     "terminal": null,
//     "gate": null,
//     "baggage": null,
//     "delay": null,
//     "scheduled": "2022-05-26T07:15:00+00:00",
//     "estimated": "2022-05-26T07:15:00+00:00",
//     "actual": null,
//     "estimated_runway": null,
//     "actual_runway": null
//   },
//   "airline": {
//     "name": "Aegean Airlines",
//     "iata": "A3",
//     "icao": "AEE"
//   },
//   "flight": {
//     "number": "101",
//     "iata": "A3101",
//     "icao": "AEE101",
//     "codeshared": null
//   },
//   "aircraft": null,
//   "live": null
// },
// {
//   "flight_date": "2022-05-26",
//   "flight_status": "scheduled",
//   "departure": {
//     "airport": "Novo Alexeyevka International",
//     "timezone": "Asia/Tbilisi",
//     "iata": "TBS",
//     "icao": "UGTB",
//     "terminal": null,
//     "gate": null,
//     "delay": null,
//     "scheduled": "2022-05-26T05:10:00+00:00",
//     "estimated": "2022-05-26T05:10:00+00:00",
//     "actual": null,
//     "estimated_runway": null,
//     "actual_runway": null
//   },
//   "arrival": {
//     "airport": "Athens International Airport \"Eleftherios Venizelos\"",
//     "timezone": "Europe/Athens",
//     "iata": "ATH",
//     "icao": "LGAV",
//     "terminal": null,
//     "gate": null,
//     "baggage": null,
//     "delay": null,
//     "scheduled": "2022-05-26T07:10:00+00:00",
//     "estimated": "2022-05-26T07:10:00+00:00",
//     "actual": null,
//     "estimated_runway": null,
//     "actual_runway": null
//   },
//   "airline": {
//     "name": "Aegean Airlines",
//     "iata": "A3",
//     "icao": "AEE"
//   },
//   "flight": {
//     "number": "897",
//     "iata": "A3897",
//     "icao": "AEE897",
//     "codeshared": null
//   },
//   "aircraft": null,
//   "live": null
// },
// {
//   "flight_date": "2022-05-26",
//   "flight_status": "scheduled",
//   "departure": {
//     "airport": "Carthage",
//     "timezone": "Africa/Tunis",
//     "iata": "TUN",
//     "icao": "DTTA",
//     "terminal": null,
//     "gate": null,
//     "delay": null,
//     "scheduled": "2022-05-26T01:10:00+00:00",
//     "estimated": "2022-05-26T01:10:00+00:00",
//     "actual": null,
//     "estimated_runway": null,
//     "actual_runway": null
//   },
//   "arrival": {
//     "airport": "Athens International Airport \"Eleftherios Venizelos\"",
//     "timezone": "Europe/Athens",
//     "iata": "ATH",
//     "icao": "LGAV",
//     "terminal": "M",
//     "gate": null,
//     "baggage": null,
//     "delay": null,
//     "scheduled": "2022-05-26T05:00:00+00:00",
//     "estimated": "2022-05-26T05:00:00+00:00",
//     "actual": null,
//     "estimated_runway": null,
//     "actual_runway": null
//   },
//   "airline": {
//     "name": "Aegean Airlines",
//     "iata": "A3",
//     "icao": "AEE"
//   },
//   "flight": {
//     "number": "735",
//     "iata": "A3735",
//     "icao": "AEE735",
//     "codeshared": null
//   },
//   "aircraft": null,
//   "live": null
// },
// {
//   "flight_date": "2022-05-26",
//   "flight_status": "scheduled",
//   "departure": {
//     "airport": "Cairo International Airport",
//     "timezone": "Africa/Cairo",
//     "iata": "CAI",
//     "icao": "HECA",
//     "terminal": "3",
//     "gate": null,
//     "delay": null,
//     "scheduled": "2022-05-26T03:10:00+00:00",
//     "estimated": "2022-05-26T03:10:00+00:00",
//     "actual": null,
//     "estimated_runway": null,
//     "actual_runway": null
//   },
//   "arrival": {
//     "airport": "Athens International Airport \"Eleftherios Venizelos\"",
//     "timezone": "Europe/Athens",
//     "iata": "ATH",
//     "icao": "LGAV",
//     "terminal": null,
//     "gate": null,
//     "baggage": null,
//     "delay": null,
//     "scheduled": "2022-05-26T06:10:00+00:00",
//     "estimated": "2022-05-26T06:10:00+00:00",
//     "actual": null,
//     "estimated_runway": null,
//     "actual_runway": null
//   },
//   "airline": {
//     "name": "Aegean Airlines",
//     "iata": "A3",
//     "icao": "AEE"
//   },
//   "flight": {
//     "number": "931",
//     "iata": "A3931",
//     "icao": "AEE931",
//     "codeshared": null
//   },
//   "aircraft": null,
//   "live": null
// },
// {
//   "flight_date": "2022-05-26",
//   "flight_status": "scheduled",
//   "departure": {
//     "airport": "Santorini (Thira)",
//     "timezone": "Europe/Athens",
//     "iata": "JTR",
//     "icao": "LGSR",
//     "terminal": null,
//     "gate": null,
//     "delay": null,
//     "scheduled": "2022-05-26T06:20:00+00:00",
//     "estimated": "2022-05-26T06:20:00+00:00",
//     "actual": null,
//     "estimated_runway": null,
//     "actual_runway": null
//   },
//   "arrival": {
//     "airport": "Athens International Airport \"Eleftherios Venizelos\"",
//     "timezone": "Europe/Athens",
//     "iata": "ATH",
//     "icao": "LGAV",
//     "terminal": null,
//     "gate": null,
//     "baggage": null,
//     "delay": null,
//     "scheduled": "2022-05-26T07:05:00+00:00",
//     "estimated": "2022-05-26T07:05:00+00:00",
//     "actual": null,
//     "estimated_runway": null,
//     "actual_runway": null
//   },
//   "airline": {
//     "name": "Aegean Airlines",
//     "iata": "A3",
//     "icao": "AEE"
//   },
//   "flight": {
//     "number": "351",
//     "iata": "A3351",
//     "icao": "AEE351",
//     "codeshared": null
//   },
//   "aircraft": null,
//   "live": null
// },
// {
//   "flight_date": "2022-05-26",
//   "flight_status": "scheduled",
//   "departure": {
//     "airport": "Larnaca",
//     "timezone": "Asia/Nicosia",
//     "iata": "LCA",
//     "icao": "LCLK",
//     "terminal": null,
//     "gate": null,
//     "delay": null,
//     "scheduled": "2022-05-26T07:25:00+00:00",
//     "estimated": "2022-05-26T07:25:00+00:00",
//     "actual": null,
//     "estimated_runway": null,
//     "actual_runway": null
//   },
//   "arrival": {
//     "airport": "Athens International Airport \"Eleftherios Venizelos\"",
//     "timezone": "Europe/Athens",
//     "iata": "ATH",
//     "icao": "LGAV",
//     "terminal": null,
//     "gate": null,
//     "baggage": null,
//     "delay": null,
//     "scheduled": "2022-05-26T09:10:00+00:00",
//     "estimated": "2022-05-26T09:10:00+00:00",
//     "actual": null,
//     "estimated_runway": null,
//     "actual_runway": null
//   },
//   "airline": {
//     "name": "Aegean Airlines",
//     "iata": "A3",
//     "icao": "AEE"
//   },
//   "flight": {
//     "number": "913",
//     "iata": "A3913",
//     "icao": "AEE913",
//     "codeshared": null
//   },
//   "aircraft": null,
//   "live": null
// },
// {
//   "flight_date": "2022-05-26",
//   "flight_status": "scheduled",
//   "departure": {
//     "airport": "Souda",
//     "timezone": "Europe/Athens",
//     "iata": "CHQ",
//     "icao": "LGSA",
//     "terminal": null,
//     "gate": "05",
//     "delay": null,
//     "scheduled": "2022-05-26T06:20:00+00:00",
//     "estimated": "2022-05-26T06:20:00+00:00",
//     "actual": null,
//     "estimated_runway": null,
//     "actual_runway": null
//   },
//   "arrival": {
//     "airport": "Athens International Airport \"Eleftherios Venizelos\"",
//     "timezone": "Europe/Athens",
//     "iata": "ATH",
//     "icao": "LGAV",
//     "terminal": null,
//     "gate": null,
//     "baggage": null,
//     "delay": null,
//     "scheduled": "2022-05-26T07:10:00+00:00",
//     "estimated": "2022-05-26T07:10:00+00:00",
//     "actual": null,
//     "estimated_runway": null,
//     "actual_runway": null
//   },
//   "airline": {
//     "name": "Aegean Airlines",
//     "iata": "A3",
//     "icao": "AEE"
//   },
//   "flight": {
//     "number": "331",
//     "iata": "A3331",
//     "icao": "AEE331",
//     "codeshared": null
//   },
//   "aircraft": null,
//   "live": null
// }]



// A_dep = [
//   {
//       "flight_date": "2022-05-26",
//       "flight_status": "scheduled",
//       "departure": {
//         "airport": "Athens International Airport \"Eleftherios Venizelos\"",
//         "timezone": "Europe/Athens",
//         "iata": "ATH",
//         "icao": "LGAV",
//         "terminal": "M",
//         "gate": "B29",
//         "delay": null,
//         "scheduled": "2022-05-26T06:55:00+00:00",
//         "estimated": "2022-05-26T06:55:00+00:00",
//         "actual": null,
//         "estimated_runway": null,
//         "actual_runway": null
//       },
//       "arrival": {
//         "airport": "Frankfurt International Airport",
//         "timezone": "Europe/Berlin",
//         "iata": "FRA",
//         "icao": "EDDF",
//         "terminal": "1",
//         "gate": "A30",
//         "baggage": null,
//         "delay": null,
//         "scheduled": "2022-05-26T09:00:00+00:00",
//         "estimated": "2022-05-26T09:00:00+00:00",
//         "actual": null,
//         "estimated_runway": null,
//         "actual_runway": null
//       },
//       "airline": {
//         "name": "Aegean Airlines",
//         "iata": "A3",
//         "icao": "AEE"
//       },
//       "flight": {
//         "number": "1835",
//         "iata": "A31835",
//         "icao": "AEE1835",
//         "codeshared": {
//           "airline_name": "lufthansa",
//           "airline_iata": "lh",
//           "airline_icao": "dlh",
//           "flight_number": "1285",
//           "flight_iata": "lh1285",
//           "flight_icao": "dlh1285"
//         }
//       },
//       "aircraft": null,
//       "live": null
//     },
//     {
//       "flight_date": "2022-05-26",
//       "flight_status": "scheduled",
//       "departure": {
//         "airport": "Athens International Airport \"Eleftherios Venizelos\"",
//         "timezone": "Europe/Athens",
//         "iata": "ATH",
//         "icao": "LGAV",
//         "terminal": null,
//         "gate": null,
//         "delay": null,
//         "scheduled": "2022-05-26T07:35:00+00:00",
//         "estimated": "2022-05-26T07:35:00+00:00",
//         "actual": null,
//         "estimated_runway": null,
//         "actual_runway": null
//       },
//       "arrival": {
//         "airport": "Ioannis Kapodistrias",
//         "timezone": "Europe/Athens",
//         "iata": "CFU",
//         "icao": "LGKR",
//         "terminal": null,
//         "gate": null,
//         "baggage": null,
//         "delay": null,
//         "scheduled": "2022-05-26T08:35:00+00:00",
//         "estimated": "2022-05-26T08:35:00+00:00",
//         "actual": null,
//         "estimated_runway": null,
//         "actual_runway": null
//       },
//       "airline": {
//         "name": "Aegean Airlines",
//         "iata": "A3",
//         "icao": "AEE"
//       },
//       "flight": {
//         "number": "282",
//         "iata": "A3282",
//         "icao": "AEE282",
//         "codeshared": null
//       },
//       "aircraft": null,
//       "live": null
//     },
//     {
//       "flight_date": "2022-05-26",
//       "flight_status": "scheduled",
//       "departure": {
//         "airport": "Athens International Airport \"Eleftherios Venizelos\"",
//         "timezone": "Europe/Athens",
//         "iata": "ATH",
//         "icao": "LGAV",
//         "terminal": null,
//         "gate": null,
//         "delay": null,
//         "scheduled": "2022-05-26T07:05:00+00:00",
//         "estimated": "2022-05-26T07:05:00+00:00",
//         "actual": null,
//         "estimated_runway": null,
//         "actual_runway": null
//       },
//       "arrival": {
//         "airport": "Zakinthos International Airport",
//         "timezone": "Europe/Athens",
//         "iata": "ZTH",
//         "icao": "LGZA",
//         "terminal": null,
//         "gate": null,
//         "baggage": null,
//         "delay": null,
//         "scheduled": "2022-05-26T08:15:00+00:00",
//         "estimated": "2022-05-26T08:15:00+00:00",
//         "actual": null,
//         "estimated_runway": null,
//         "actual_runway": null
//       },
//       "airline": {
//         "name": "Aegean Airlines",
//         "iata": "A3",
//         "icao": "AEE"
//       },
//       "flight": {
//         "number": "7050",
//         "iata": "A37050",
//         "icao": "AEE7050",
//         "codeshared": {
//           "airline_name": "olympic air",
//           "airline_iata": "oa",
//           "airline_icao": "oal",
//           "flight_number": "50",
//           "flight_iata": "oa50",
//           "flight_icao": "oal50"
//         }
//       },
//       "aircraft": null,
//       "live": null
//     },
//     {
//       "flight_date": "2022-05-26",
//       "flight_status": "scheduled",
//       "departure": {
//         "airport": "Athens International Airport \"Eleftherios Venizelos\"",
//         "timezone": "Europe/Athens",
//         "iata": "ATH",
//         "icao": "LGAV",
//         "terminal": null,
//         "gate": "B30",
//         "delay": null,
//         "scheduled": "2022-05-26T06:55:00+00:00",
//         "estimated": "2022-05-26T06:55:00+00:00",
//         "actual": null,
//         "estimated_runway": null,
//         "actual_runway": null
//       },
//       "arrival": {
//         "airport": "Nikos Kazantzakis Airport",
//         "timezone": "Europe/Athens",
//         "iata": "HER",
//         "icao": "LGIR",
//         "terminal": null,
//         "gate": null,
//         "baggage": null,
//         "delay": null,
//         "scheduled": "2022-05-26T07:45:00+00:00",
//         "estimated": "2022-05-26T07:45:00+00:00",
//         "actual": null,
//         "estimated_runway": null,
//         "actual_runway": null
//       },
//       "airline": {
//         "name": "Aegean Airlines",
//         "iata": "A3",
//         "icao": "AEE"
//       },
//       "flight": {
//         "number": "300",
//         "iata": "A3300",
//         "icao": "AEE300",
//         "codeshared": null
//       },
//       "aircraft": null,
//       "live": null
//     },
//     {
//       "flight_date": "2022-05-26",
//       "flight_status": "scheduled",
//       "departure": {
//         "airport": "Athens International Airport \"Eleftherios Venizelos\"",
//         "timezone": "Europe/Athens",
//         "iata": "ATH",
//         "icao": "LGAV",
//         "terminal": null,
//         "gate": null,
//         "delay": null,
//         "scheduled": "2022-05-26T08:00:00+00:00",
//         "estimated": "2022-05-26T08:00:00+00:00",
//         "actual": null,
//         "estimated_runway": null,
//         "actual_runway": null
//       },
//       "arrival": {
//         "airport": "Larnaca",
//         "timezone": "Asia/Nicosia",
//         "iata": "LCA",
//         "icao": "LCLK",
//         "terminal": null,
//         "gate": null,
//         "baggage": null,
//         "delay": null,
//         "scheduled": "2022-05-26T09:35:00+00:00",
//         "estimated": "2022-05-26T09:35:00+00:00",
//         "actual": null,
//         "estimated_runway": null,
//         "actual_runway": null
//       },
//       "airline": {
//         "name": "Aegean Airlines",
//         "iata": "A3",
//         "icao": "AEE"
//       },
//       "flight": {
//         "number": "902",
//         "iata": "A3902",
//         "icao": "AEE902",
//         "codeshared": null
//       },
//       "aircraft": null,
//       "live": null
//     },
//     {
//       "flight_date": "2022-05-26",
//       "flight_status": "scheduled",
//       "departure": {
//         "airport": "Athens International Airport \"Eleftherios Venizelos\"",
//         "timezone": "Europe/Athens",
//         "iata": "ATH",
//         "icao": "LGAV",
//         "terminal": null,
//         "gate": "B26",
//         "delay": null,
//         "scheduled": "2022-05-26T07:00:00+00:00",
//         "estimated": "2022-05-26T07:00:00+00:00",
//         "actual": null,
//         "estimated_runway": null,
//         "actual_runway": null
//       },
//       "arrival": {
//         "airport": "Santorini (Thira)",
//         "timezone": "Europe/Athens",
//         "iata": "JTR",
//         "icao": "LGSR",
//         "terminal": null,
//         "gate": null,
//         "baggage": null,
//         "delay": null,
//         "scheduled": "2022-05-26T07:45:00+00:00",
//         "estimated": "2022-05-26T07:45:00+00:00",
//         "actual": null,
//         "estimated_runway": null,
//         "actual_runway": null
//       },
//       "airline": {
//         "name": "Aegean Airlines",
//         "iata": "A3",
//         "icao": "AEE"
//       },
//       "flight": {
//         "number": "352",
//         "iata": "A3352",
//         "icao": "AEE352",
//         "codeshared": null
//       },
//       "aircraft": null,
//       "live": null
//     },
//     {
//       "flight_date": "2022-05-26",
//       "flight_status": "scheduled",
//       "departure": {
//         "airport": "Athens International Airport \"Eleftherios Venizelos\"",
//         "timezone": "Europe/Athens",
//         "iata": "ATH",
//         "icao": "LGAV",
//         "terminal": null,
//         "gate": null,
//         "delay": null,
//         "scheduled": "2022-05-26T08:05:00+00:00",
//         "estimated": "2022-05-26T08:05:00+00:00",
//         "actual": null,
//         "estimated_runway": null,
//         "actual_runway": null
//       },
//       "arrival": {
//         "airport": "Brussels Airport",
//         "timezone": "Europe/Brussels",
//         "iata": "BRU",
//         "icao": "EBBR",
//         "terminal": null,
//         "gate": null,
//         "baggage": null,
//         "delay": null,
//         "scheduled": "2022-05-26T10:25:00+00:00",
//         "estimated": "2022-05-26T10:25:00+00:00",
//         "actual": null,
//         "estimated_runway": null,
//         "actual_runway": null
//       },
//       "airline": {
//         "name": "Aegean Airlines",
//         "iata": "A3",
//         "icao": "AEE"
//       },
//       "flight": {
//         "number": "620",
//         "iata": "A3620",
//         "icao": "AEE620",
//         "codeshared": null
//       },
//       "aircraft": null,
//       "live": null
//     },
//     {
//       "flight_date": "2022-05-26",
//       "flight_status": "scheduled",
//       "departure": {
//         "airport": "Athens International Airport \"Eleftherios Venizelos\"",
//         "timezone": "Europe/Athens",
//         "iata": "ATH",
//         "icao": "LGAV",
//         "terminal": null,
//         "gate": null,
//         "delay": null,
//         "scheduled": "2022-05-26T08:05:00+00:00",
//         "estimated": "2022-05-26T08:05:00+00:00",
//         "actual": null,
//         "estimated_runway": null,
//         "actual_runway": null
//       },
//       "arrival": {
//         "airport": "Souda",
//         "timezone": "Europe/Athens",
//         "iata": "CHQ",
//         "icao": "LGSA",
//         "terminal": null,
//         "gate": null,
//         "baggage": null,
//         "delay": null,
//         "scheduled": "2022-05-26T08:55:00+00:00",
//         "estimated": "2022-05-26T08:55:00+00:00",
//         "actual": null,
//         "estimated_runway": null,
//         "actual_runway": null
//       },
//       "airline": {
//         "name": "Aegean Airlines",
//         "iata": "A3",
//         "icao": "AEE"
//       },
//       "flight": {
//         "number": "332",
//         "iata": "A3332",
//         "icao": "AEE332",
//         "codeshared": null
//       },
//       "aircraft": null,
//       "live": null
//     },
//     {
//       "flight_date": "2022-05-26",
//       "flight_status": "scheduled",
//       "departure": {
//         "airport": "Athens International Airport \"Eleftherios Venizelos\"",
//         "timezone": "Europe/Athens",
//         "iata": "ATH",
//         "icao": "LGAV",
//         "terminal": null,
//         "gate": "A03",
//         "delay": 12,
//         "scheduled": "2022-05-26T00:40:00+00:00",
//         "estimated": "2022-05-26T00:40:00+00:00",
//         "actual": "2022-05-26T00:51:00+00:00",
//         "estimated_runway": "2022-05-26T00:51:00+00:00",
//         "actual_runway": "2022-05-26T00:51:00+00:00"
//       },
//       "arrival": {
//         "airport": "Novo Alexeyevka International",
//         "timezone": "Asia/Tbilisi",
//         "iata": "TBS",
//         "icao": "UGTB",
//         "terminal": null,
//         "gate": null,
//         "baggage": null,
//         "delay": null,
//         "scheduled": "2022-05-26T04:20:00+00:00",
//         "estimated": "2022-05-26T04:20:00+00:00",
//         "actual": null,
//         "estimated_runway": null,
//         "actual_runway": null
//       },
//       "airline": {
//         "name": "Aegean Airlines",
//         "iata": "A3",
//         "icao": "AEE"
//       },
//       "flight": {
//         "number": "896",
//         "iata": "A3896",
//         "icao": "AEE896",
//         "codeshared": null
//       },
//       "aircraft": {
//         "registration": "SX-NED",
//         "iata": "A20N",
//         "icao": "A20N",
//         "icao24": "46B8A4"
//       },
//       "live": {
//         "updated": "2022-05-25T22:29:56+00:00",
//         "latitude": 38.48,
//         "longitude": 27.68,
//         "altitude": 11277.6,
//         "direction": 81.51,
//         "speed_horizontal": 840.744,
//         "speed_vertical": -2.34,
//         "is_ground": false
//       }
//     },
//     {
//       "flight_date": "2022-05-26",
//       "flight_status": "scheduled",
//       "departure": {
//         "airport": "Athens International Airport \"Eleftherios Venizelos\"",
//         "timezone": "Europe/Athens",
//         "iata": "ATH",
//         "icao": "LGAV",
//         "terminal": null,
//         "gate": "B22",
//         "delay": null,
//         "scheduled": "2022-05-26T06:40:00+00:00",
//         "estimated": "2022-05-26T06:40:00+00:00",
//         "actual": null,
//         "estimated_runway": null,
//         "actual_runway": null
//       },
//       "arrival": {
//         "airport": "Leros",
//         "timezone": "Europe/Athens",
//         "iata": "LRS",
//         "icao": "LGLE",
//         "terminal": null,
//         "gate": null,
//         "baggage": null,
//         "delay": null,
//         "scheduled": "2022-05-26T07:40:00+00:00",
//         "estimated": "2022-05-26T07:40:00+00:00",
//         "actual": null,
//         "estimated_runway": null,
//         "actual_runway": null
//       },
//       "airline": {
//         "name": "Aegean Airlines",
//         "iata": "A3",
//         "icao": "AEE"
//       },
//       "flight": {
//         "number": "7030",
//         "iata": "A37030",
//         "icao": "AEE7030",
//         "codeshared": {
//           "airline_name": "olympic air",
//           "airline_iata": "oa",
//           "airline_icao": "oal",
//           "flight_number": "30",
//           "flight_iata": "oa30",
//           "flight_icao": "oal30"
//         }
//       },
//       "aircraft": null,
//       "live": null
//     }
// ]