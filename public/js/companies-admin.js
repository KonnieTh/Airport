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
//Άνοιγμα πεδίου covid από τον footer της σελίδας
function covid_on() {
    document.getElementById("covid").style.display = "block";
}
//Κλείσιμο πεδίου covid
function covid_off() {
    document.getElementById("covid").style.display = "none";
}

//Φόρτωμα αεροπορικών εταιρειών που ξεκινάνε με το γράμμα που επιλέγει ο χρήστης
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

//Φόρτωμα εικόνων των αεροπορικών από την ιστοσελίδα http://pics.avs.io/150/150/${IATA}.png
async function getImages(){
    const elements_row = document.querySelectorAll(".company-info .row .company");
    const images = document.querySelectorAll(".company-info .row-info .icon");
    for(let i=0;i<elements_row.length;i++){
        const name = elements_row[i].innerText;
        const response = await fetch(`/airlines/${name}`);
        if(response.status==200){
            const data = await response.json();
            for(let j of data){
                console.log(j.IATA);
                fetch(`http://pics.avs.io/150/150/${j.IATA}.png`)
                .then(response=> response.blob())
                .then(blob =>{
                    images[i].src = URL.createObjectURL(blob) ;
                })
                .catch(error => console.log(error))
            }
        }
    }
}

getImages();

//Δημιουργία φόρμας Επεξεργασίας Στοιχείων Αεροπορικής Εταιρείας και έλεγχος στοιχείων
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

//Διαγραφή Αεροπορικής Εταιρείας
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
        fetch('/airlines_delete',{
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

//Εμφάνιση φόρμας για προσθήκη Αεροπορικής Εταιρείας 
function add_airline() {
    const insert_form = document.querySelector(".new_airline");
    insert_form.style.display="block";
}

//Δημιουργία Κουμπιών Αναζήτησης στα οποία εμφανίζονται οι Αεροπορικές Εταιρείες που ξεκινάνε με το αντίστοιχο γράμμα.
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
    link.setAttribute("href",`/companies-admin/${letter}`)
    Div.appendChild(link);
}
//Προκειμένου να φαίνεται πατημένο το κουμπί
const link = window.location.href;
const selected_letter = link.slice(-1);
const place = selected_letter.charCodeAt(0);
const selected_button = document.querySelectorAll(".btn")[place-65];
selected_button.classList.add("touched");

//Κάνουμε fetch το κείμενο σχετικό με το covid από τη βάση δεδομένων
fetch(`/text/covid`)
.then(response=>response.json())
.then(data=>{
    console.log(data);
    const text = document.querySelector('.covidtext');
    text.innerHTML="";
    for(let i of data){
        text.innerHTML = i.description;
    }
})
.catch((error)=>{
    console.log("Error:",error);
})
