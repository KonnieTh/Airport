const data = null;
const xhr = new XMLHttpRequest();
xhr.withCredentials = true;
const xhr1 = new XMLHttpRequest();
xhr1.withCredentials = true;
let airlines;
let airline_details;
let airline_name = document.querySelector('.companies-flights .company');
let dis = document.querySelector(".company-info");
let selected_airline_iata;
// const insert_form = document.querySelector(".new_airline");
// console.log(insert_form);
// insert_form.style.display="block";

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

function arrivals_on(){
    console.log(1);
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
    console.log(airline);
    airline_name.innerText = airline.name;
    let url;
    selected_airline_iata=airline.iata;
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

async function display(letter){
    fetch(`/companies-admin/${letter}`)
    .then(response=>response.json())
    .then(data=>{
        console.log(data);
    })
    .catch((error)=>{
        console.log("Error:",error);
    })
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
//             const buttons = document.createElement("div");
//             buttons.classList.add("buttons");

//             const editbtn = document.createElement("button");
//             editbtn.classList.add("edit");
//             editbtn.addEventListener('click', function(){
//                 editInfo(i,data[i],editbtn);
//                 console.log(i,data[i]);
//             });
//             const comment1 = document.createTextNode("Επεξεργασία");
//             editbtn.appendChild(comment1);
//             editbtns.push(editbtn);
//             buttons.appendChild(editbtn);

//             const deletebtn = document.createElement("button");
//             deletebtn.classList.add("remove");
//             deletebtn.addEventListener('click', function(){
//                 console.log(i,data[i]);
//                 deleteInfo(data[i]);
//             });
//             const comment2 = document.createTextNode("Διαγραφή");
//             deletebtn.appendChild(comment2);
//             deletebtns.push(deletebtn);
//             buttons.appendChild(deletebtn);

//             details.appendChild(buttons);
//             index+=1;
//         }
//     }
// }

async function editInfo(airline){
    const telephonevalid = /[0-9]{10}/;
    const emailvalid = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    let index = 0;
    let infos = airline.split(" ");
    let response = await fetch(`/airline_name/${infos[0]}`);
    if(response.status==200){
        let data = await response.json();
        const name = data[0].airline_name;
        const elements = document.querySelectorAll(".company-info .row .company");
        for(let i=0;i<elements.length;i++){
            if (elements[i].innerText == name){
                console.log(i);
                index = i;
            }
        }
        const details = document.querySelectorAll(".row-info .details .buttons")[index];
        const deletebtn = details.querySelector(".remove");
        details.removeChild(deletebtn);
        const submitbtn = document.createElement("button");
        submitbtn.classList.add("submit");
        const comment = document.createTextNode("Υποβολή");
        submitbtn.appendChild(comment);
        const editbtn = details.querySelector(".edit");

        editbtn.classList.add("touched");
        editbtn.disabled = "true";

        let telephone = document.querySelectorAll(".details .telephone")[index];
        telephone = telephone.querySelector("div");
        const newItem = document.createElement("input");
        newItem.setAttribute("type", "tel");
        newItem.setAttribute("placeholder","Τηλέφωνο");
        telephone.parentNode.replaceChild(newItem, telephone);  

        let website = document.querySelectorAll(".details .website")[index];
        website = website.querySelector("div");
        const newItem1 = document.createElement("input");
        newItem1.setAttribute("type", "email");
        newItem1.placeholder="Διεύθυνση email";
        website.parentNode.replaceChild(newItem1, website);

        let entrance = document.querySelectorAll(".details .entrance")[index];
        entrance.innerHTML="";
        
        const terminal = document.createElement("div");
        terminal.appendChild(document.createTextNode("Terminal: "))
        const newItem2 = document.createElement("select");
        for(let i=0;i<4;i++){
            let option = document.createElement("option");
            option.value = `${i+1}`;
            option.appendChild(document.createTextNode(`${i+1}`));
            newItem2.appendChild(option);
        }

        terminal.appendChild(newItem2);

        const gate = document.createElement("div");
        gate.appendChild(document.createTextNode("Gate: "))
        const newItem3 = document.createElement("select");
        let option = document.createElement("option");
        option.value = "A";
        option.appendChild(document.createTextNode("A"));
        newItem3.appendChild(option);
        option = document.createElement("option");
        option.value = "B";
        option.appendChild(document.createTextNode("B"));
        newItem3.appendChild(option);
        gate.appendChild(newItem3);


        const gate_number = document.createElement("div");
        gate_number.appendChild(document.createTextNode("Αριθμός Πύλης: "))
        const newItem4 = document.createElement("select");
        for(let i=0;i<20;i++){
            let option = document.createElement("option");
            option.value = `${i+1}`;
            option.appendChild(document.createTextNode(`${i+1}`));
            newItem4.appendChild(option);
        }
        gate_number.appendChild(newItem4);
        
        entrance.appendChild(terminal);
        entrance.appendChild(gate);
        entrance.appendChild(gate_number);
        entrance.style.fontSize="0.8em";
        entrance.style.display="flex";
        entrance.style.flexWrap="wrap";
        entrance.style.flexDirection="row";
        entrance.style.justifyContent="center";


        submitbtn.addEventListener("click",function(){
            const iata = data[0].IATA;
            const telephone = newItem.value;
            const email = newItem1.value;
            const terminal = newItem2.value;
            const gate = newItem3.value;
            const gate_number=newItem4.value;
            let errors = 0;
            const length = telephone.length;
            if(length!=10){
                errors+=1;
            }
            // && telephonevalid.test(airport) && telephonevalid.test(lostfound) && emailvalid.test(email)
            if(telephonevalid.test(telephone)==false && telephone!=""){
                errors+=1;
            }
            if(emailvalid.test(email)==false && email!=""){
                errors+=1;
            }
            if(errors>0){
                alert("Κάτι δεν πήγε καλά με τα στοιχεία που έβαλες. Προσπάθησε ξανά!!!")
            }
            if(errors==0){
                inputs = {iata,telephone,email,terminal,gate,gate_number};
                console.log(inputs);
                fetch('/airlines_edit',{
                    method:"PUT",
                    headers:{
                        'Content-Type': 'application/json',
                    },
                    body:JSON.stringify(inputs)
                })
                .then(response => response.json())
                .then(data => {
                    console.log("Success:",data);
                })
                .catch((error) =>{
                    console.error("Error:",error);
                })
            }
        })
        details.appendChild(submitbtn);
    }
};


async function deleteInfo(airline){
    let index = 0;
    let infos = airline.split(" ");
    let response = await fetch(`/airline_name/${infos[0]}`);
    if(response.status==200){
        let data = await response.json();
        const name = data[0].airline_name;
        const elements = document.querySelectorAll(".company-info .row .company");
        for(let i=0;i<elements.length;i++){
            if (elements[i].innerText == name){
                console.log(i);
                index = i;
            }
        }
        alert("Προσοχή! Η ακόλουθη κίνηση οδηγεί στη διαγραφή του στοιχείου από τη βάση δεδομένων!");
        fetch('http://localhost:3000/airlines_delete',{
            method:"DELETE",
            headers:{
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(data[0])
        })
        .then(response => response.json())
        .then(data => {
            console.log("Success:",data);
        })
        .catch((error) =>{
            console.error("Error:",error);
        })
    }
};

// function deleteInfo(data){
//     alert("Προσοχή! Η ακόλουθη κίνηση οδηγεί στη διαγραφή του στοιχείου από τη βάση δεδομένων!")
//     fetch('http://localhost:3000/airlines_delete',{
//         method:"DELETE",
//         headers:{
//             'Content-Type': 'application/json',
//         },
//         body:JSON.stringify(data)
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log("Success:",data);
//     })
//     .catch((error) =>{
//         console.error("Error:",error);
//     })
// }

function add_airline() {
    const insert_form = document.querySelector(".new_airline");
    insert_form.style.display="block";
}

let Div = document.querySelector("div.choices");
for (let i = 65; i < 91; i++) {
    const link = document.createElement("a");
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
    link.appendChild(newButton);
    link.setAttribute("href",`http://localhost:3000/companies-admin/${letter}`)
    Div.appendChild(link);
}

const link = window.location.href;
const selected_letter = link.slice(-1);
const place = selected_letter.charCodeAt(0);
const selected_button = document.querySelectorAll(".btn")[place-65];
selected_button.classList.add("touched");

display("A");


