const data = null;
const xhr = new XMLHttpRequest();
xhr.withCredentials = true;
const xhr1 = new XMLHttpRequest();
xhr1.withCredentials = true;
let airlines;
let images = [];
let airline_details;
let airline_name = document.querySelector('.companies-flights .company');
let dis = document.querySelector(".company-info");
let selected_airline_iata;


function covid_on() {
    document.getElementById("covid").style.display = "block";
}
function covid_off() {
    document.getElementById("covid").style.display = "none";
}



function getflights(url,type){
    console.log(url);
    fetch(url)
    .then(response => {
        return response.json();
    })
    .then(data => {
        if (type==="arrival"){
            console.log(data);
            const table = document.querySelector('.arrivals-table tbody');
            table.innerHTML="";
            if(data.length>0){
                for (let i of data){
                    const row = document.createElement("tr");
                    row.classList.add("row");
                    const td1 = document.createElement("td");
                    td1.appendChild(document.createTextNode(i[2]));
                    row.appendChild(td1);
                    const td2 = document.createElement("td");
                    td2.appendChild(document.createTextNode(i[3]));
                    row.appendChild(td2);
                    const td3 = document.createElement("td");
                    td3.appendChild(document.createTextNode(i[0]+" "+i[1]));
                    row.appendChild(td3);
                    const td4 = document.createElement("td");
                    td4.appendChild(document.createTextNode(i[4]));
                    row.appendChild(td4);
                    const td5 = document.createElement("td");
                    td5.appendChild(document.createTextNode(i[5]));
                    row.appendChild(td5);
                    table.appendChild(row);
                }
            }
            else{
                const row = document.createElement("div");
                row.appendChild(document.createTextNode("Δεν γίνονται πτήσεις αυτή τη στιγμή"));
                row.style.width="120%";
                row.style.margin="1em";
                table.appendChild(row);
            }
        }
        else if(type==="departures"){
            console.log(data);
            const table = document.querySelector('.departures-table tbody');
            table.innerHTML="";
            if(data.length>0){
                for (let i of data){
                    const row = document.createElement("tr");
                    row.classList.add("row");
                    const td1 = document.createElement("td");
                    td1.appendChild(document.createTextNode(i[2]));
                    row.appendChild(td1);
                    const td2 = document.createElement("td");
                    td2.appendChild(document.createTextNode(i[3]));
                    row.appendChild(td2);
                    const td3 = document.createElement("td");
                    td3.appendChild(document.createTextNode(i[0]+" "+i[1]));
                    row.appendChild(td3);
                    const td4 = document.createElement("td");
                    td4.appendChild(document.createTextNode(i[4]));
                    row.appendChild(td4);
                    const td5 = document.createElement("td");
                    td5.appendChild(document.createTextNode(i[5]));
                    row.appendChild(td5);
                    table.appendChild(row);
                }
            }
            else{
                const row = document.createElement("div");
                row.appendChild(document.createTextNode("Δεν γίνονται πτήσεις αυτή τη στιγμή"));
                row.style.width="120%";
                row.style.margin="1em";
                table.appendChild(row);
            }
        }
    })
}


function arrivals_on() {
    const arrivalbutton = document.querySelector("button.arrivals");
    arrivalbutton.classList.add("touched");
    const departuresbutton = document.querySelector("button.departures");
    departuresbutton.classList.remove("touched");
    const arrivals = document.querySelector('.arrivals-table');
    arrivals.style.display = "block";
    const departures = document.querySelector('.departures-table');
    departures.style.display = "none";
    url = `http://localhost:3000/arrivals/airline/${selected_airline_iata}`;
    getflights(url,"arrival");  
}

function departures_on() {
    const departuresbutton = document.querySelector("button.departures");
    departuresbutton.classList.add("touched");
    const arrivalbutton = document.querySelector("button.arrivals");
    arrivalbutton.classList.remove("touched");
    const arrivals = document.querySelector('.arrivals-table');
    arrivals.style.display = "none";
    const departures = document.querySelector('.departures-table');
    departures.style.display = "block";
    url = `http://localhost:3000/departures/airline/${selected_airline_iata}`;
    getflights(url,"departures");  
}

function flights_catalog(airline,flight_type){
    airline_name.innerText = airline.name;
    let url;
    selected_airline_iata = airline.iata;
    const arrivals = document.querySelector('.arrivals-table tbody');
    arrivals.innerHTML = "";
    const departures = document.querySelector('.departures-table tbody');
    departures.innerHTML = "";
    // airline_name.appendChild(document.createTextNode(airline.name))
    if (flight_type = "arrivals"){
        arrivals_on();
        url = `http://localhost:3000/arrivals/airline/${airline.iata}`;
        getflights(url,"arrival");   
    }
    else{
        departures_on();
        url = `http://localhost:3000/departures/airline/${airline.iata}`;
        getflights(url,"departure");
    }
}


// async function display(firstletter){
//     let editbtns = [];
//     let deletebtns = [];
//     let index=0;
//     dis.innerHTML="";
//     dis = document.querySelector(".company-info");
//     let response = await fetch(`http://localhost:3000/airlines/filter/${firstletter}`);
//     if(response.status==200){
//         let data = await response.json();
//         console.log(data);
//         for(let i=0;i<data.length;i++){
//             const element_row = document.createElement("div");
//             element_row.classList.add("row");
//             const airline_name = document.createElement("div");
//             airline_name.classList.add("company");
//             const text = document.createTextNode(data[i].airline_name);
//             airline_name.appendChild(text);
//             const links = document.createElement("a");
//             links.addEventListener('click',function(){
//                 const flights = document.getElementById("companies-flights");
//                 flights.style.display = "block";
//             });
//             links.href="#companies-flights";
//             links.target="_self";
//             const text1 = document.createTextNode("Πτήσεις >");
//             links.appendChild(text1);
//             links.addEventListener("click",function(){
//                 flights_catalog(data[i],"arrivals");
//             })
//             element_row.appendChild(airline_name);
//             element_row.appendChild(links);
//             dis.appendChild(element_row);
//             const element_row_info = document.createElement("div");
//             element_row_info.classList.add("row-info");
//             const icon = document.createElement('img');
//             icon.classList.add("icon");
//             // console.log(names[index],airlines[index].iata_code);
//             fetch(`http://pics.avs.io/150/150/${data[i].IATA}.png`)
//                 .then(response=> response.blob())
//                 .then(blob =>
//                      icon.src = URL.createObjectURL(blob))
//                 .catch(error => console.log(error))
            
//             icon.style.backgroundColor="white";
//             element_row_info.appendChild(icon);
//             const details = document.createElement('div');
//             details.classList.add("details");
            
//             const tel = document.createElement('div');
//             tel.classList.add("telephone");
//             const text2 = document.createTextNode(`Τηλέφωνο: `);
//             tel.appendChild(text2);
//             const teltext = document.createElement('div');
//             teltext.appendChild(document.createTextNode(data[i].telephone));
//             tel.appendChild(teltext);          
            
//             const web = document.createElement('div');
//             web.classList.add("website");
//             const text3 = document.createTextNode(`Email: `);
//             web.appendChild(text3);
//             const telweb = document.createElement('div');
//             telweb.appendChild(document.createTextNode(data[i].email));
//             web.appendChild(telweb);

//             const gate = document.createElement("div");
//             gate.classList.add("entrance");
//             const text5 = document.createTextNode(`Τερματικός: `);
//             gate.appendChild(text5);
//             const en = document.createElement('div');
//             en.appendChild(document.createTextNode(data[i].terminal + " - Πύλη: " + data[i].gate_name + data[i].gate_number));
//             gate.appendChild(en);
            
//             details.appendChild(tel);
//             details.appendChild(web);
//             details.appendChild(gate);

//             element_row_info.appendChild(details);
//             dis.appendChild(element_row_info);
//         }
//     }
// }

function display(firstletter){
    fetch(`/airlines/filter/${firstletter}`)
    .then(response => response.json())
    .then(data => console.log(data))
}


let Div = document.querySelector("div.choices");
for (let i = 65; i < 91; i++) {
    const newButton = document.createElement("button");
    newButton.classList.add("btn");
    newButton.addEventListener("click", function () {
        const buttons = Div.childNodes;
        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].classList.contains("touched")==true){
                buttons[i].classList.remove("touched");
                buttons[i].classList.add("btn");
            }
        }
        newButton.classList.add("touched");
        newButton.classList.remove("btn");
        display(newButton.innerText);
    })
    const letter = String.fromCodePoint(i);
    const content = document.createTextNode(letter);
    newButton.appendChild(content);
    Div.appendChild(newButton);
}

const buttonA = document.querySelector(".btn");
buttonA.classList.add("touched");

fetch(`/airlines/filter/${"A"}`)
.then(response => response.json())
.then(data => console.log(data))