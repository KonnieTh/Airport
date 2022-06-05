//Εμφάνιση του table των αφίξεων
function arrivals_form(){
    document.querySelector(".arr").style.display="block";
    documentquerySelector(".dep").style.display="none";
}
//Εμφάνιση του table των αναχωρίσεων
function departures_form(){
    document.querySelector(".arr").style.display="none";
    document.querySelector(".dep").style.display="block";
}
//Άνοιγμα πεδίου covid από τον footer της σελίδας
function covid_on() {
    document.getElementById("covid").style.display = "block";
}
//Κλείσιμο πεδίου covid
function covid_off() {
    document.getElementById("covid").style.display = "none";
}
//Κάνουμε fetch το κείμενο σχετικό με το covid από τη βάση δεδομένων
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