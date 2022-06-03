function arrivals_form(){
    document.querySelector(".arr").style.display="block";
    documentquerySelector(".dep").style.display="none !important";
}

function departures_form(){
    document.querySelector(".arr").style.display="none !important";
    document.querySelector(".dep").style.display="block";
}

function arrivals_on(){
    document.querySelector(".flights-info").style.display="block";
    const arrivalbutton=document.querySelector("button.arrivals");
    arrivalbutton.classList.add("touched");
    const departuresbutton=document.querySelector("button.departures");
    departuresbutton.classList.remove("touched");
    const departures=document.querySelector(".flight-departures");
    departures.classList.add("nonvisible");
    const arrivals=document.querySelector(".flight-arrivals");
    arrivals.classList.remove("nonvisible");
}


function departures_on(){
    document.querySelector(".flights-info").style.display="block";
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