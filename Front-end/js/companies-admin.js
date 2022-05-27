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


async function display(firstletter){
    let editbtns = [];
    let deletebtns = [];
    let index=0;
    dis.innerHTML="";
    dis = document.querySelector(".company-info");
    let response = await fetch(`http://localhost:3000/airlines/filter/${firstletter}`);
    if(response.status==200){
        let data = await response.json();
        for(let i=0;i<data.length;i++){
            const element_row = document.createElement("div");
            element_row.classList.add("row");
            const airline_name = document.createElement("div");
            airline_name.classList.add("company");
            const text = document.createTextNode(data[i].name);
            airline_name.appendChild(text);
            const links = document.createElement("a");
            links.addEventListener('click',function(){
                const flights = document.getElementById("companies-flights");
                flights.style.display = "block";
            });
            links.href="#companies-flights";
            links.target="_self";
            const text1 = document.createTextNode("Πτήσεις >");
            links.appendChild(text1);
            links.addEventListener("click",function(){
                flights_catalog(data[i],"arrivals");
            })
            element_row.appendChild(airline_name);
            element_row.appendChild(links);
            dis.appendChild(element_row);
            const element_row_info = document.createElement("div");
            element_row_info.classList.add("row-info");
            const icon = document.createElement('img');
            icon.classList.add("icon");
            // console.log(names[index],airlines[index].iata_code);
            fetch(`http://pics.avs.io/150/150/${data[i].iata}.png`)
                .then(response=> response.blob())
                .then(blob =>
                     icon.src = URL.createObjectURL(blob))
                .catch(error => console.log(error))
            
            icon.style.backgroundColor="white";
            element_row_info.appendChild(icon);
            const details = document.createElement('div');
            details.classList.add("details");
            
            const tel = document.createElement('div');
            tel.classList.add("telephone");
            const text2 = document.createTextNode(`Κρατήσεις: `);
            tel.appendChild(text2);
            const teltext = document.createElement('div');
            teltext.appendChild(document.createTextNode(data[i].telephone));
            tel.appendChild(teltext);

            const tel1 = document.createElement('div');
            tel1.classList.add("airport");
            const text6 = document.createTextNode(`Αεροδρόμιο: `);
            tel1.appendChild(text6);
            const teltext1 = document.createElement('div');
            teltext1.appendChild(document.createTextNode(data[i].airport_tel));
            tel1.appendChild(teltext1);
            
            
            const web = document.createElement('div');
            web.classList.add("website");
            const text3 = document.createTextNode(`Email: `);
            web.appendChild(text3);
            const telweb = document.createElement('div');
            telweb.appendChild(document.createTextNode(data[i].email));
            web.appendChild(telweb);

            const lostfound = document.createElement('div');
            lostfound.classList.add("lost-found");
            const text4 = document.createTextNode(`Lost&Found: `);
            lostfound.appendChild(text4);
            const tellostfound = document.createElement('div');
            tellostfound.appendChild(document.createTextNode(data[i].lostfound));
            lostfound.appendChild(tellostfound);

            const entrance = document.createElement("div");
            entrance.classList.add("entrance");
            const text5 = document.createTextNode(`Entrance: `);
            entrance.appendChild(text5);
            const en = document.createElement('div');
            en.appendChild(document.createTextNode(data[i].entrance));
            entrance.appendChild(en);
            
            details.appendChild(tel);
            details.appendChild(tel1);
            details.appendChild(web);
            details.appendChild(lostfound);
            details.appendChild(entrance);


            element_row_info.appendChild(details);
            dis.appendChild(element_row_info);
            const buttons = document.createElement("div");
            buttons.classList.add("buttons");

            const editbtn = document.createElement("button");
            editbtn.classList.add("edit");
            editbtn.addEventListener('click', function(){
                editInfo(i,data[i],editbtn);
            });
            const comment1 = document.createTextNode("Επεξεργασία");
            editbtn.appendChild(comment1);
            editbtns.push(editbtn);
            buttons.appendChild(editbtn);

            const deletebtn = document.createElement("button");
            deletebtn.classList.add("remove");
            deletebtn.addEventListener('click', function(){
                console.log(i,data[i]);
                deleteInfo(data[i]);
            });
            const comment2 = document.createTextNode("Διαγραφή");
            deletebtn.appendChild(comment2);
            deletebtns.push(deletebtn);
            buttons.appendChild(deletebtn);

            details.appendChild(buttons);
            index+=1;
        }
    }
}





function editInfo(index,data,editbtn){
    const telephonevalid = /[0-9]{10}/;
    const emailvalid = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    const details = document.querySelectorAll(".row-info .details .buttons")[index];
    const deletebtn = details.querySelector(".remove");
    details.removeChild(deletebtn);
    const submitbtn = document.createElement("button");
    submitbtn.classList.add("submit");
    const comment = document.createTextNode("Υποβολή");
    submitbtn.appendChild(comment);

    editbtn.classList.add("touched");
    editbtn.disabled = "true";

    let telephone = document.querySelectorAll(".details .telephone")[index];
    telephone = telephone.querySelector("div");
    const newItem = document.createElement("input");
    newItem.setAttribute("type", "tel");
    newItem.setAttribute("placeholder","Τηλέφωνο");
    telephone.parentNode.replaceChild(newItem, telephone);  

    let telephone1 = document.querySelectorAll(".details .airport")[index];
    telephone1 = telephone1.querySelector("div");
    const newItem3 = document.createElement("input");
    newItem3.setAttribute("type", "tel");
    newItem3.setAttribute("placeholder","Τηλέφωνο");
    telephone1.parentNode.replaceChild(newItem3, telephone1);  

    let website = document.querySelectorAll(".details .website")[index];
    website = website.querySelector("div");
    const newItem1 = document.createElement("input");
    newItem1.setAttribute("type", "email");
    newItem1.placeholder="Διεύθυνση email";
    website.parentNode.replaceChild(newItem1, website);

    let entrance = document.querySelectorAll(".details .entrance")[index];
    entrance = entrance.querySelector("div");
    const newItem2 = document.createElement("input");
    newItem2.setAttribute("type", "number");
    newItem2.min="1";
    newItem2.max="10";
    entrance.parentNode.replaceChild(newItem2, entrance);

    let lostfound = document.querySelectorAll(".details .lost-found")[index]
    lostfound = lostfound.querySelector("div");
    const newItem4 = document.createElement("input");
    newItem4.setAttribute("type", "tel");
    newItem4.placeholder="Τηλέφωνο";
    lostfound.parentNode.replaceChild(newItem4, lostfound);  

    submitbtn.addEventListener("click",function(){
        
        const iata = data.iata;
        const telephone = newItem.value;
        const airport = newItem3.value;
        const email = newItem1.value;
        const lostfound = newItem4.value;
        const entrance = newItem2.value;
        let errors = 0;
        // && telephonevalid.test(airport) && telephonevalid.test(lostfound) && emailvalid.test(email)
        if(telephonevalid.test(telephone)==false && telephone!=""){
            errors+=1;
        }
        if(telephonevalid.test(airport)==false && airport!=""){
            console.log(airport)
            errors+=1;
        }
        if(telephonevalid.test(lostfound)==false && lostfound!=""){
            errors+=1;
        }
        if(emailvalid.test(email)==false && email!=""){
            errors+=1;
        }
        if(errors>0){
            alert("Κάτι δεν πήγε καλά με τα στοιχεία που έβαλες. Προσπάθησε ξανά!!!")
        }
        if(errors==0){
            inputs = {iata,telephone,airport,email,lostfound,entrance};
            fetch('http://localhost:3000/airlines_edit',{
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

function deleteInfo(data){
    alert("Προσοχή! Η ακόλουθη κίνηση οδηγεί στη διαγραφή του στοιχείου από τη βάση δεδομένων!")
    fetch('http://localhost:3000/airlines_delete',{
        method:"DELETE",
        headers:{
            'Content-Type': 'application/json',
        },
        body:JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Success:",data);
    })
    .catch((error) =>{
        console.error("Error:",error);
    })
}

function add_airline() {
    const insert_form = document.querySelector(".new_airline");
    insert_form.style.display="block";
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

display("A");


