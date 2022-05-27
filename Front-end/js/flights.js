airports_arrivals=document.getElementById('departure-airport');
airports_departures=document.getElementById('arrival-airport');
airlines_arrivals=document.getElementById('airline_arrival');
airlines_departures=document.getElementById('airline_departure');

fetch("http://localhost:3000/airports/arrivals")
.then(response=>{
    return response.json()
})
.then(data => {
    const locations = [];
    const airlines = [];
    for(let i of data){
        if(i.location!=undefined){
            const str = i.location;
            const str1 = str + "," +i.iata;  
            locations.push(str1);
            
        }
        if(i.airline_name!=undefined){
            const str = i.airline_name.name;
            const str1 = str.charAt(0).toUpperCase() + str.slice(1);
            // const str2 = i.iata;
            // const str3 = str1 + ","+ str2
            airlines.push(str1);
        }
    }
    let locations_new = [];
    let airlines_new = [];
    for(let i of locations){
        if (locations.includes(i)==true && locations_new.includes(i)!=true){
            locations_new.push(i);
        }
    }
    for(let i of airlines){
        if (airlines.includes(i)==true && airlines_new.includes(i)!=true){
            airlines_new.push(i);
        }
    }   
    locations_new = locations_new.sort();
    airlines_new = airlines_new.sort();
    for(let i of locations_new){
        const airport_option = document.createElement("option");
        airport_option.appendChild(document.createTextNode(i));
        airport_option.value = i;
        airports_arrivals.appendChild(airport_option);
    }
    for(let i of airlines_new){
        const airline_option = document.createElement("option");
        airline_option.appendChild(document.createTextNode(i));
        airline_option.value = i;
        airlines_arrivals.appendChild(airline_option);
    }
})
.catch(error =>{
    console.log(error);
})

fetch("http://localhost:3000/airports/departures")
    .then(response=>{
        return response.json()
    })
    .then(data => {
        const locations = [];
        const airlines = [];
        for(let i of data){
            if(i.location!=undefined){
                const str = i.location;
                const str1 = str + "," +i.iata;  
                locations.push(str1);
            }
            if(i.airline_name!=undefined){
                const str = i.airline_name.name;
                const str1 = str.charAt(0).toUpperCase() + str.slice(1);
                // const str2 = i.iata;
                // const str3 = str1 + ","+ str2
                airlines.push(str1);
            }
        }
        let locations_new = [];
        let airlines_new = [];
        for(let i of locations){
            if (locations.includes(i)==true && locations_new.includes(i)!=true){
                locations_new.push(i);
            }
        }
        for(let i of airlines){
            if (airlines.includes(i)==true && airlines_new.includes(i)!=true){
                airlines_new.push(i);
            }
        }   
        locations_new = locations_new.sort();
        airlines_new = airlines_new.sort();
        for(let i of locations_new){
            const airport_option = document.createElement("option");
            airport_option.appendChild(document.createTextNode(i));
            airport_option.value = i;
            airports_departures.appendChild(airport_option);
        }
        for(let i of airlines_new){
            const airline_option = document.createElement("option");
            airline_option.appendChild(document.createTextNode(i));
            airline_option.value = i;
            airlines_departures.appendChild(airline_option);
        }
    })
    .catch(error =>{
        console.log(error);
    })

const arrivalbutton=document.querySelector("button.arrivals");
arrivalbutton.classList.add("touched");
document.getElementById("arrivals").style.display="block";
const departures=document.querySelector(".flight-departures");
departures.classList.add("nonvisible");
document.querySelector(".departures-table").style.display="none";
// document.querySelector(".flights-info").style.display="none";

function arrivals_form(){
    document.getElementById("arrivals").style.display="block";
    document.getElementById("departures").style.display="none";
    const arrivalbutton=document.querySelector("button.arrivals");
    arrivalbutton.classList.add("touched");
    const departuresbutton=document.querySelector("button.departures");
    departuresbutton.classList.remove("touched");
}

function departures_form(){
    document.getElementById("arrivals").style.display="none";
    document.getElementById("departures").style.display="block";
    const departuresbutton=document.querySelector("button.departures");
    departuresbutton.classList.add("touched");
    const arrivalbutton=document.querySelector("button.arrivals");
    arrivalbutton.classList.remove("touched");
}

function arrivals_on(){
    document.querySelector(".flights-info").style.display="block";
    // document.getElementById("departures").style.display="none";
    // document.getElementById("arrivals").style.display="block";
    // document.querySelector(".arrivals-table").style.display="table";
    // document.querySelector(".departures-table").style.display="none";
    const arrivalbutton=document.querySelector("button.arrivals");
    arrivalbutton.classList.add("touched");
    const departuresbutton=document.querySelector("button.departures");
    departuresbutton.classList.remove("touched");
    const departures=document.querySelector(".flight-departures");
    departures.classList.add("nonvisible");
    const arrivals=document.querySelector(".flight-arrivals");
    arrivals.classList.remove("nonvisible");

    // url = `http://localhost:8080/arrivals/${}`;
    // getflights(url,"arrival");
}


function departures_on(){
    document.querySelector(".flights-info").style.display="block";
    // document.getElementById("departures").style.display="block";
    // document.getElementById("arrivals").style.display="none";
    // document.querySelector(".arrivals-table").style.display="none";
    // document.querySelector(".departures-table").style.display="table";
    const departuresbutton=document.querySelector("button.departures");
    departuresbutton.classList.add("touched");
    const arrivalbutton=document.querySelector("button.arrivals");
    arrivalbutton.classList.remove("touched");
    const departuretable=document.querySelector(".departures-table");
    const departures=document.querySelector(".flight-departures");
    departures.classList.remove("nonvisible");
    const arrivals=document.querySelector(".flight-arrivals");
    arrivals.classList.add("nonvisible");
    url = `http://localhost:3000/results`;
    getflights(url,"departures");  
}


function covid_on() {
    document.getElementById("covid").style.display = "block";
}
function covid_off() {
    document.getElementById("covid").style.display = "none";
}


// function getflights(url,type){
//     fetch(url)
//     .then(response => {
//         return response.json();
//     })
//     .then(data => {
//         if (type==="arrival"){
//             console.log(data);
//             const table = document.querySelector('.flight-arrivals tbody');
//             for (let i of data){
//                 const row = document.createElement("tr");
//                 row.classList.add("row");
//                 const td1 = document.createElement("td");
//                 td1.appendChild(document.createTextNode(i.departure.airport));
//                 row.appendChild(td1);
//                 const td2 = document.createElement("td");
//                 td2.appendChild(document.createTextNode(i.flight.iata));
//                 row.appendChild(td2);
//                 const td3 = document.createElement("td");
//                 td3.appendChild(document.createTextNode(i.arrival.scheduled));
//                 row.appendChild(td3);
//                 const td4 = document.createElement("td");
//                 td4.appendChild(document.createTextNode(i.arrival.actual));
//                 row.appendChild(td4);
//                 const td5 = document.createElement("td");
//                 td5.appendChild(document.createTextNode(i.arrival.terminal));
//                 row.appendChild(td5);
//                 table.appendChild(row);
//             }
//         }
//         else if(type==="departures"){
//             console.log(data);
//             const table = document.querySelector('.flight-departures tbody');
//             for (let i of data){
//                 const row = document.createElement("tr");
//                 row.classList.add("row");
//                 const td1 = document.createElement("td");
//                 td1.appendChild(document.createTextNode(i.arrival.airport));
//                 row.appendChild(td1);
//                 const td2 = document.createElement("td");
//                 td2.appendChild(document.createTextNode(i.flight.iata));
//                 row.appendChild(td2);
//                 const td3 = document.createElement("td");
//                 td3.appendChild(document.createTextNode(i.departure.scheduled));
//                 row.appendChild(td3);
//                 const td4 = document.createElement("td");
//                 td4.appendChild(document.createTextNode(i.departure.actual));
//                 row.appendChild(td4);
//                 const td5 = document.createElement("td");
//                 td5.appendChild(document.createTextNode(i.arrival.terminal));
//                 row.appendChild(td5);
//                 table.appendChild(row);
//             }
//         }
//     })
//     .catch(error => {
//         let table;
//         if (type==="arrival"){
//             table = document.querySelector('.arrivals-table tbody');
//         }else{
//             table = document.querySelector('.departures-table tbody');
//         }        
//         let count=0;
//         if (error=="TypeError: data is not iterable"){
//             if (count<1){
//                 const div = document.createElement("div");
//                 div.appendChild(document.createTextNode("No flights found from this airline"));
//                 table.appendChild(div);
//                 count+=1;
//             }
//         }
//         else{
//             console.log(error);
//         }
//     })
// }






// const options = {
//     method: 'GET',
//     headers: {
//         'X-RapidAPI-Host': 'airport-info.p.rapidapi.com',
//         'X-RapidAPI-Key': '72241a884dmsh8de9c7fffb619bep154dbejsn38d304e0a370'
//     }
// };

// fetch('https://airport-info.p.rapidapi.com/airport', options)
//     .then(response => response.json())
//     .then(response => console.log(response))
//     .catch(err => console.error(err));   




