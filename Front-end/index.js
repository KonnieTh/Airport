const express = require('express');
const app = express();
const path = require("path");
const https = require('https');
const cors = require('cors');
const axios = require('axios');
const { request } = require('http');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

app.use(cors())

const key = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiMGE4MWJjM2M3NWQ1NjU0YTVmMmIxZDQxNGIzNTZiNGQ2N2Q2ZTIzMzY0ODQ5NDlkOTJkMTM3ZmFmZGQ5MmFjMzM5M2JkZjRjZDY0ZmZjNmIiLCJpYXQiOjE2NTI0NzE2NDgsIm5iZiI6MTY1MjQ3MTY0OCwiZXhwIjoxNjg0MDA3NjQ4LCJzdWIiOiI0NTQ0Iiwic2NvcGVzIjpbXX0.diJfw46iVWSpsAqIGLB0dao6Oq2GrKYb3-dgtiE3wlyhOPn_ZYkZCsxWsgrjUevEGixh9TEylTaBRfUclguv2w";

app.get('/arrivals/:iata', (req,res) =>{
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

app.listen(8080,function(){
    console.log("8080");
})


app.get('/departures/:iata', (req,res) =>{
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

app.listen(8081,function(){
    console.log("8081");
})



app.get('/arrivals', (req,res) =>{
    async function getData(){
        const iata = req.params.iata;
        const response = await fetch(`https://app.goflightlabs.com/flights?access_key=${key}&arr_iata=ATH`)
        const data = await response.json();
        res.json(data);
    }
    getData().catch(error => {
        console.log(error);
    })
})

app.listen(8082,function(){
    console.log("8082");
})


app.get('/departures', (req,res) =>{
    async function getData(){
        const iata = req.params.iata;
        const response = await fetch(`https://app.goflightlabs.com/flights?access_key=${key}&dep_iata=ATH`)
        const data = await response.json();
        res.json(data);
    }
    getData().catch(error => {
        console.log(error);
    })
})

app.listen(8083,function(){
    console.log("8083");
})
