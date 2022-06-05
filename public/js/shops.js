let button = document.querySelectorAll('.shop button');
console.log(button);
//Δημιουργία πεδίων HTML των καταστημάτων
for(let i=0;i<6;i++){
    button[i].addEventListener('click', function(){
        let tag = document.querySelectorAll('.shopss p');
        if (tag[i].style.display === "block") {
            tag[i].style.display = "none";
        } else {
            tag[i].style.display = "block";
        }
    });
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