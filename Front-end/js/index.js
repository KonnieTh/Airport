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
app.use(cors());


const key = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiNDUzMmEzMWJmNTliNmIxNzZiODJmY2U1YzMxOGZmMjhiY2U2N2ZhYjhjN2ZkMTc1MjUxNjEyYjQzNjRiMjExMTExZmJhOTY3NDAwNWQwODkiLCJpYXQiOjE2NTMzNDIxMjcsIm5iZiI6MTY1MzM0MjEyNywiZXhwIjoxNjg0ODc4MTI3LCJzdWIiOiI1MDQ0Iiwic2NvcGVzIjpbXX0.ldJdoFmo6gIiDaslelHnxxssWPhZgpCU_cvym36pGMOzHQdJnrt4fJCuhX0WUWCZ3ZneC35gJpN2nsekuFvL1g";


app.get('/arrivals/airline/:iata', (req,res) =>{
    async function getData(){
        const iata = req.params.iata;
        const response = await fetch(`https://app.goflightlabs.com/flights?access_key=${key}&arr_iata=ATH&airline_iata=${iata}`)
        const data = await response.json();
        res.json(data);
    }
    getData().catch(error => {
        console.log(error);
    })
})


app.get('/departures/airline/:iata', (req,res) =>{
    async function getData(){
        const iata = req.params.iata;
        const response = await fetch(`https://app.goflightlabs.com/flights?access_key=${key}&dep_iata=ATH&airline_iata=${iata}`)
        const data = await response.json();
        res.json(data);
    }
    getData().catch(error => {
        console.log(error);
    })
})

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

const user_input=[];


// const url_arrivals_form = `https://app.goflightlabs.com/flights?access_key=${key}&arr_iata=ATH&dep_iata=${}&airline_iata=${}&flight_number=${}&arr_scheduled_time_arr=${}`;

// const url_departures_form = `https://app.goflightlabs.com/flights?access_key=${key}&arr_iata=${}&dep_iata=ATH&airline_iata=${}&flight_number=${}&arr_scheduled_time_dept=${}`;


// app.post("/user_arrivals", async (req,res) => {
//     res.send("post ok");
// })

app.use(express.urlencoded({extended:false}));

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







// Creation of Database of airlines

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


// const db = new Database('airport.db',Database.OPEN_READWRITE,(err) =>{
//     if (err) {
//         console.log(err)
//     }
//     else{
//         console.log("Connection successful")
//     }
// });

// let sql = `CREATE TABLE IF NOT EXISTS airlines('id' INTEGER PRIMARY KEY AUTOINCREMENT,'name' TEXT,'iata' TEXT,'icao' TEXT,'telephone' TEXT,'website' TEXT,'gate' TEXT);`

// db.exec(sql);


// sql = `INSERT INTO airlines (name,iata,icao,telephone,website,gate) VALUES(?,?,?,?,?,?)`;

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
//             insert.run(name,iata_code,icao_code,null,null,null);
//             console.log("A new row has been created");
//         }
//         console.log("DONE");
//         db.close((err) =>{
//             if (err) return console.log(err);
//         })
//     })
// 	.catch(err => console.error('error:' + err));


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

app.listen(3000);
