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

async function display(letter){
    fetch(`/companies/${letter}`)
    .then(response=>response.json())
    .then(data=>{
        console.log(data);
    })
    .catch((error)=>{
        console.log("Error:",error);
    })
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
    link.setAttribute("href",`/companies/${letter}`)
    Div.appendChild(link);
}

const link = window.location.href;
console.log(link);
const selected_letter = link.slice(-1);
console.log(selected_letter);
if(selected_letter=="1"){
    const selected_button = document.querySelectorAll(".btn")[0];
    selected_button.classList.add("touched");
}
else{
    const place = selected_letter.charCodeAt(0);
    const selected_button = document.querySelectorAll(".btn")[place-65];
    selected_button.classList.add("touched");
}
// display("A");



async function getImages(){
    const elements_row = document.querySelectorAll(".company-info .row .company");
    const images = document.querySelectorAll(".company-info .row-info .icon");
    for(let i=0;i<elements_row.length;i++){
        const name = elements_row[i].innerText;
        const response = await fetch(`http://icarus-airport.herokuapp.com/airlines/${name}`);
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


