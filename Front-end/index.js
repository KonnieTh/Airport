// const express = require("express");
// const cors = require("cors");
// const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

import express from "express";
import cors from "cors";
import fetch from 'node-fetch';
import exphbs from "express-handlebars";
import path from "path";
import session from "express-session";


const app = express();


import * as model from './model/airport-queries.js';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/airlines/filter/:letter',(req,res)=>{
    const letter = req.params.letter;
    model.getAirlinebyletter(letter,(err,rows) => {
        if(err){
            return console.error(err.message);
        }
        res.json(rows);
    })
})


app.put('/airlines_edit',(req,res)=>{
    const airline=req.body;
    model.editAirline(airline,(err,data) =>{
        if(err){
            return console.error(err.message);
        }
        else{
            res.json(data);
        }
    })
})
  
app.delete('/airlines_delete',(req,res)=>{
    const airline=req.body;
    model.deleteAirline(airline,(err,data) =>{
        if(err){
            return console.error(err.message);
        }
        else{
            res.json(data);
        }
    })
})
  
app.post('/new_airline',(req,res)=>{
    const airline=req.body;
    model.insertAirline(airline,(err,data) =>{
        if(err){
            return console.error(err.message);
        }
        else{
            res.json(data);
        }
    })
});


app.get('/text/:titlos',(req,res)=>{
    const title = req.params.titlos;
    model.insertText(title,(err,data) =>{
        if(err){
            return console.error(err.message);
        }
        else{
            res.json(data);
        }
    })
})

app.put('/edit_text',(req,res)=>{
    const text = req.body;
    console.log(text,req.body);
    model.editText(text,(err,data) =>{
        if(err){
            return console.error(err.message);
        }
        else{
            res.json(data);
        }
    })
})

app.post('/create_announcement',(req,res)=>{
    const text = req.body;
    console.log(text);
    model.createAnnouncement(text,(err,data) =>{
        if(err){
            return console.error(err.message);
        }
        else{
            res.json(data);
        }
    })

})

app.get('/get_announcements/start/:start/limit/:limit',(req,res)=>{
    const params = req.body;
    model.createAnnouncement((err,data) =>{
        if(err){
            return console.error(err.message);
        }        else{
            res.json(data);
        }
    })
})


app.post('/get_announcements',(req,res)=>{
    const params = req.body;
    console.log(params);
    model.getAnnouncements((err,data) =>{
        if(err){
            return console.error(err.message);
        }        
        else{
            res.json(data);
        }
    })

})

app.listen(3000,()=>{
    console.log("I listen in port 3000...");
});