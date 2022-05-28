function sn_on() {
    document.getElementById("special-needs-text").style.display = "block";
}
function sn_off() {
    document.getElementById("special-needs-text").style.display = "none";
}
function covid_on() {
    document.getElementById("covid").style.display = "block";
}
function covid_off() {
    document.getElementById("covid").style.display = "none";
}

function parking_on() {
    document.getElementById("parking").style.display = "block";
}
function parking_off() {
    document.getElementById("parking").style.display = "none";
}

function pets_on() {
    document.getElementById("pets_text").style.display = "block";
}
function pets_off() {
    document.getElementById("pets_text").style.display = "none";
}

function currency_on() {
    document.getElementById("currency_text").style.display = "block";
}
function currency_off() {
    document.getElementById("currency_text").style.display = "none";
}

function customs_on() {
    document.getElementById("customs_insection_text").style.display = "block";
}
function customs_off() {
    document.getElementById("customs_insection_text").style.display = "none";
}

// fetch('http://localhost:3000/airlines_edit',{
//     method:"PUT",
//     headers:{
//         'Content-Type': 'application/json',
//     },
//     body:JSON.stringify(inputs)
// })
// .then(response => response.json())
// .then(data => {
//     console.log("Success:",data);
// })
// .catch((error) =>{
//     console.error("Error:",error);
// })

let d;
let titlos; 

function edit(a, b) {
    d = a;
    const list = [[".currencytext","currency"],[".parkingtext","parking"],[".covidtext","covid"],[".specialneedstext","special_needs"],[".petstext","pets"],[".customstext","customs"]]
    for(let i of list){
        if (i[0]==a){
            titlos = i[1];
        }
    }
    console.log(a,b);
    document.querySelector(`#${b}`).style.display = "none";
    document.getElementById("text-editor").style.display = "block";
    document.getElementById("description").style.display = "none";
    document.getElementById("main-menu").style.display = "none";
    document.querySelector('.header').style.backgroundImage = "none";
    document.querySelector('.header').style.backgroundColor = "rgb(46, 46, 46)";
    document.querySelector('.header').style.minHeight = "10em";
    let text = document.querySelector(`${a}`);
    let text2 = document.getElementById("textarea");
    text2.innerHTML = text.innerHTML;
}

function save() {
    let text2 = document.getElementById("textarea");
    const keimeno = text2.innerHTML;
    const inputs = {titlos,keimeno};
    fetch('http://localhost:3000/edit_text',{
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
    document.getElementById("customs_insection_text").style.display = "none";
    document.getElementById("text-editor").style.display = "none";
    document.getElementById("description").style.display = "block";
    document.getElementById("main-menu").style.display = "block";
    document.querySelector('.header').style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),url('/Front-end/images/athens.jpg')";
    document.querySelector('.header').style.minHeight = "100vh";
}

const elements = document.querySelectorAll(".text-editor-header .btn");

elements.forEach(element => {
    element.addEventListener('click', () => {
        let command = element.dataset['element'];

        if (command == 'createLink') {
            let url = prompt('Enter the link here:', "http://");
            document.execCommand(command, false, url);
        }
        else {
            document.execCommand(command, false, null);
        }

    });
});


function getTexts(){
    texts=[[".currencytext","currency"],[".parkingtext","parking"],[".covidtext","covid"],[".specialneedstext","special_needs"],[".petstext","pets"],[".customstext","customs"]]
    for(let i of texts){
        console.log(i[1]);
        const text = document.querySelector(`${i[0]}`);
        text.innerHTML="";
        fetch(`http://localhost:3000/text/${i[1]}`)
        .then(response => response.json())
        .then(data => {
            console.log("Success:",data);
            for(let i of data){
                text.innerHTML = i.keimeno;
            }
        })
        .catch((error) =>{
            console.error("Error:",error);
        })
    }
}

getTexts();


// ,[".parkingtext","parking"],[".covidtext","covid"],[".specialneedstext","special_needs"],[".petstext","pets"],[".customstext","customs"]