function arrivals_form(){
    document.querySelector(".arr").style.display="block";
    documentquerySelector(".dep").style.display="none";
}

function departures_form(){
    document.querySelector(".arr").style.display="none";
    document.querySelector(".dep").style.display="block";
}

function covid_on() {
    document.getElementById("covid").style.display = "block";
}
function covid_off() {
    document.getElementById("covid").style.display = "none";
}
fetch(`/text/covid`)
    .then(response=>response.json())
        .then(data=>{
            const text = document.querySelector('.covidtext');
            text.innerHTML="";
            for(let i of data){
                text.innerHTML = i.description;
            }
        })
    .catch((error)=>{
    console.log("Error:",error);
})