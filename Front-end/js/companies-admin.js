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

function getflights(url,type){
    fetch(url)
    .then(response => {
        return response.json();
    })
    .then(data => {
        if (type==="arrival"){
            console.log(data);
            const table = document.querySelector('.arrivals-table tbody');
            for (let i of data){
                const row = document.createElement("tr");
                row.classList.add("row");
                const td1 = document.createElement("td");
                td1.appendChild(document.createTextNode(i.departure.airport));
                row.appendChild(td1);
                const td2 = document.createElement("td");
                td2.appendChild(document.createTextNode(i.flight.iata));
                row.appendChild(td2);
                const td3 = document.createElement("td");
                td3.appendChild(document.createTextNode(i.arrival.scheduled));
                row.appendChild(td3);
                const td4 = document.createElement("td");
                td4.appendChild(document.createTextNode(i.arrival.actual));
                row.appendChild(td4);
                const td5 = document.createElement("td");
                td5.appendChild(document.createTextNode(i.arrival.terminal));
                row.appendChild(td5);
                table.appendChild(row);
            }
        }
        else if(type==="departures"){
            console.log(data);
            const table = document.querySelector('.departures-table tbody');
            for (let i of data){
                const row = document.createElement("tr");
                row.classList.add("row");
                const td1 = document.createElement("td");
                td1.appendChild(document.createTextNode(i.arrival.airport));
                row.appendChild(td1);
                const td2 = document.createElement("td");
                td2.appendChild(document.createTextNode(i.flight.iata));
                row.appendChild(td2);
                const td3 = document.createElement("td");
                td3.appendChild(document.createTextNode(i.departure.scheduled));
                row.appendChild(td3);
                const td4 = document.createElement("td");
                td4.appendChild(document.createTextNode(i.departure.actual));
                row.appendChild(td4);
                const td5 = document.createElement("td");
                td5.appendChild(document.createTextNode(i.arrival.terminal));
                row.appendChild(td5);
                table.appendChild(row);
            }
        }
    })
    // .catch(error => {
    //     let table;
    //     if (type==="arrival"){
    //         table = document.querySelector('.arrivals-table tbody');
    //     }else{
    //         table = document.querySelector('.departures-table tbody');
    //     }        
    //     let count=0;
    //     if (error=="TypeError: data is not iterable"){
    //         if (count<1){
    //             const div = document.createElement("div");
    //             div.appendChild(document.createTextNode("No flights found from this airline"));
    //             table.appendChild(div);
    //             count+=1;
    //         }
    //     }
    //     else{
    //         console.log(error);
    //     }
    // })
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
    console.log(airline);
    airline_name.innerText = airline.name;
    let url;
    selected_airline_iata=airline.iata_code;
    const arrivals = document.querySelector('.arrivals-table tbody');
    arrivals.innerHTML = "";
    const departures = document.querySelector('.departures-table tbody');
    departures.innerHTML = "";
    // airline_name.appendChild(document.createTextNode(airline.name))
    if (flight_type = "arrivals"){
        arrivals_on();
        url = `http://localhost:3000/arrivals/airline/${airline.iata_code}`;
        getflights(url,"arrival");   
    }
    else{
        departures_on();
        url = `http://localhost:8081/departures/airline/${airline.iata_code}`;
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
                .then(blob => icon.src = URL.createObjectURL(blob))
                .catch(error => console.log(error))
            icon.style.backgroundColor="white";
            element_row_info.appendChild(icon);
            const details = document.createElement('div');
            details.classList.add("details");
            
            const tel = document.createElement('div');
            tel.classList.add("telephone");
            const text2 = document.createTextNode(`Τηλέφωνο: `);
            tel.appendChild(text2);
            const teltext = document.createElement('div');
            teltext.appendChild(document.createTextNode(data[i].telephone));
            tel.appendChild(teltext);
            
            const web = document.createElement('div');
            web.classList.add("website");
            const text3 = document.createTextNode(`Website: `);
            web.appendChild(text3);
            const telweb = document.createElement('div');
            telweb.appendChild(document.createTextNode(data[i].website));
            web.appendChild(telweb);


            // const lostfound = document.createElement('div');
            // lostfound.classList.add("lost-found");
            // const text4 = document.createTextNode(`Lost & Found: `);
            // lostfound.appendChild(text4);
            // const tellostfound = document.createElement('div');
            // tellostfound.appendChild(document.createTextNode("Αριθμός"));
            // lostfound.appendChild(tellostfound);

            details.appendChild(tel);
            details.appendChild(web);
            // details.appendChild(lostfound);

            const entrance = document.createElement("div");
            entrance.classList.add("entrance");
            const text5 = document.createTextNode(`Entrance: `);
            entrance.appendChild(text5);
            const en = document.createElement('div');
            en.appendChild(document.createTextNode(data[i].gate));
            entrance.appendChild(en);
            
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
    console.log(index,data);
    editbtn.classList.add("touched");
    editbtn.disabled = "true";
    console.log(index);
    let telephone = document.querySelectorAll(".details .telephone")[index];
    telephone = telephone.querySelector("div");
    const newItem = document.createElement("input");
    newItem.setAttribute("type", "telephone");
    newItem.addEventListener('keyup', (e) => {
        if (e.keyCode === 13) {
            let newcontent = document.createTextNode(e.target.value);
            console.log(newcontent);
            telephone.innerText = newcontent;
            let newItem4 = document.createElement("div");
            newItem4.appendChild(newcontent);
            newItem.parentNode.replaceChild(newItem4, newItem);
        }
    })
    telephone.parentNode.replaceChild(newItem, telephone);  
    
    let website = document.querySelectorAll(".details .website")[index];
    website = website.querySelector("div");
    const newItem1 = document.createElement("input");
    newItem1.setAttribute("type", "website");
    newItem1.addEventListener('keyup', (e) => {
        if (e.keyCode === 13) {
            let newcontent = document.createTextNode(e.target.value);
            console.log(newcontent);
            let newItem4 = document.createElement("div");
            newItem4.appendChild(newcontent);
            newItem1.parentNode.replaceChild(newItem4, newItem1);
        }
    })
    website.parentNode.replaceChild(newItem1, website);

    // const lostfound = document.querySelector(".details .lost-found div");
    // const newItem2 = document.createElement("input");
    // newItem2.setAttribute("type", "telephone");
    // newItem2.addEventListener('keyup', (e) => {
    //     if (e.keyCode === 13) {
    //         let newcontent = document.createTextNode(e.target.value);
    //         console.log(newcontent);
    //         let newItem4 = document.createElement("div");
    //         newItem4.appendChild(newcontent);
    //         newItem2.parentNode.replaceChild(newItem4, newItem2);
    //     }
    // })
    // lostfound.parentNode.replaceChild(newItem2, lostfound);

    let entrance = document.querySelectorAll(".details .entrance")[index];
    entrance = entrance.querySelector("div");
    const newItem3 = document.createElement("input");
    newItem3.setAttribute("type", "number");
    newItem3.addEventListener('keyup', (e) => {
        if (e.keyCode === 13) {
            let newcontent = document.createTextNode(e.target.value);
            console.log(newcontent);
            let newItem4 = document.createElement("div");
            newItem4.appendChild(newcontent);
            newItem3.parentNode.replaceChild(newItem4, newItem3);
            editbtn.classList.remove("touched");
            editbtn.removeAttribute("disabled");
        }
    })
    entrance.parentNode.replaceChild(newItem3, entrance);
}

// console.log(i.name);
//                 editbtn.classList.add("touched");
//                 editbtn.disabled = "true";
//                 const telephone = document.querySelector(".details .telephone div");
//                 const newItem = document.createElement("input");
//                 newItem.setAttribute("type", "telephone");
//                 newItem.addEventListener('keyup', (e) => {
//                     if (e.keyCode === 13) {
//                         let newcontent = document.createTextNode(e.target.value);
//                         console.log(newcontent);
//                         telephone.innerText = newcontent;
//                         let newItem4 = document.createElement("div");
//                         newItem4.appendChild(newcontent);
//                         newItem.parentNode.replaceChild(newItem4, newItem);
//                     }
//                 })
//                 telephone.parentNode.replaceChild(newItem, telephone);  
                
//                 const website = document.querySelector(".details .website div");
//                 const newItem1 = document.createElement("input");
//                 newItem1.setAttribute("type", "website");
//                 newItem1.addEventListener('keyup', (e) => {
//                     if (e.keyCode === 13) {
//                         let newcontent = document.createTextNode(e.target.value);
//                         console.log(newcontent);
//                         let newItem4 = document.createElement("div");
//                         newItem4.appendChild(newcontent);
//                         newItem1.parentNode.replaceChild(newItem4, newItem1);
//                     }
//                 })
//                 website.parentNode.replaceChild(newItem1, website);

//                 // const lostfound = document.querySelector(".details .lost-found div");
//                 // const newItem2 = document.createElement("input");
//                 // newItem2.setAttribute("type", "telephone");
//                 // newItem2.addEventListener('keyup', (e) => {
//                 //     if (e.keyCode === 13) {
//                 //         let newcontent = document.createTextNode(e.target.value);
//                 //         console.log(newcontent);
//                 //         let newItem4 = document.createElement("div");
//                 //         newItem4.appendChild(newcontent);
//                 //         newItem2.parentNode.replaceChild(newItem4, newItem2);
//                 //     }
//                 // })
//                 // lostfound.parentNode.replaceChild(newItem2, lostfound);

//                 const entrance = document.querySelector(".details .entrance div");
//                 const newItem3 = document.createElement("input");
//                 newItem3.setAttribute("type", "number");
//                 newItem3.addEventListener('keyup', (e) => {
//                     if (e.keyCode === 13) {
//                         let newcontent = document.createTextNode(e.target.value);
//                         console.log(newcontent);
//                         let newItem4 = document.createElement("div");
//                         newItem4.appendChild(newcontent);
//                         newItem3.parentNode.replaceChild(newItem4, newItem3);
//                         editbtn.classList.remove("touched");
//                         editbtn.removeAttribute("disabled");
//                     }
//                 })
//                 entrance.parentNode.replaceChild(newItem3, entrance);
//             })
            
//             const comment1 = document.createTextNode("Επεξεργασία");
//             editbtn.appendChild(comment1);
//             editbtns.push(editbtn);
//             details.appendChild(editbtn);
//             index+=1;

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



// details.appendChild(entrance);
//                 element_row_info.appendChild(details);
//                 // element_row_info.appendChild(entrance);

//                 const editbtn = document.createElement("button");
//                 editbtn.classList.add("edit");
//                 editbtn.addEventListener('click', function () {
//                     editbtn.classList.add("touched");
//                     editbtn.disabled = "true";
//                     const telephone = document.querySelector(".details .telephone div");
//                     const newItem = document.createElement("input");
//                     newItem.setAttribute("type", "telephone");
//                     newItem.addEventListener('keyup', (e) => {
//                         if (e.keyCode === 13) {
//                             let newcontent = document.createTextNode(e.target.value);
//                             console.log(newcontent);
//                             telephone.innerText = newcontent;
//                             let newItem4 = document.createElement("div");
//                             newItem4.appendChild(newcontent);
//                             newItem.parentNode.replaceChild(newItem4, newItem);
//                         }
//                     })
//                     telephone.parentNode.replaceChild(newItem, telephone);  
                    
//                     const website = document.querySelector(".details .website div");
//                     const newItem1 = document.createElement("input");
//                     newItem1.setAttribute("type", "website");
//                     newItem1.addEventListener('keyup', (e) => {
//                         if (e.keyCode === 13) {
//                             let newcontent = document.createTextNode(e.target.value);
//                             console.log(newcontent);
//                             let newItem4 = document.createElement("div");
//                             newItem4.appendChild(newcontent);
//                             newItem1.parentNode.replaceChild(newItem4, newItem1);
//                         }
//                     })
//                     website.parentNode.replaceChild(newItem1, website);

//                     const lostfound = document.querySelector(".details .lost-found div");
//                     const newItem2 = document.createElement("input");
//                     newItem2.setAttribute("type", "telephone");
//                     newItem2.addEventListener('keyup', (e) => {
//                         if (e.keyCode === 13) {
//                             let newcontent = document.createTextNode(e.target.value);
//                             console.log(newcontent);
//                             let newItem4 = document.createElement("div");
//                             newItem4.appendChild(newcontent);
//                             newItem2.parentNode.replaceChild(newItem4, newItem2);
//                         }
//                     })
//                     lostfound.parentNode.replaceChild(newItem2, lostfound);

//                     const entrance = document.querySelector(".details .entrance div");
//                     const newItem3 = document.createElement("input");
//                     newItem3.setAttribute("type", "number");
//                     newItem3.addEventListener('keyup', (e) => {
//                         if (e.keyCode === 13) {
//                             let newcontent = document.createTextNode(e.target.value);
//                             console.log(newcontent);
//                             let newItem4 = document.createElement("div");
//                             newItem4.appendChild(newcontent);
//                             newItem3.parentNode.replaceChild(newItem4, newItem3);
//                             editbtn.classList.remove("touched");
//                             editbtn.removeAttribute("disabled");
//                         }
//                     })
//                     entrance.parentNode.replaceChild(newItem3, entrance);
//                 })
                
//                 const comment1 = document.createTextNode("Επεξεργασία");
//                 editbtn.appendChild(comment1);
//                 details.appendChild(editbtn);
