//Άνοιγμα πεδίου covid από τον footer της σελίδας
function covid_on() {
    document.getElementById("covid").style.display = "block";
}
//Κλείσιμο πεδίου covid
function covid_off() {
    document.getElementById("covid").style.display = "none";
}
//Εύρεση τωρινής ημερομηνίας και ώρας
let dates = document.querySelectorAll("tbody tr td");
for(let i=0;i<dates.length;i++){
    if (i%2!=0){
        const date = dates[i].innerText.slice(0,10);
        const time = dates[i].innerText.slice(-9);
        dates[i].innerText = `${date} ${time}`;
    }
}

//Δημιουργία νέας ανακοίνωσης και εμφάνιση του text-editor για σύνταξη ανακοίνωσης
function createAnnouncement(){
    document.querySelector(`.main`).style.display = "none";
    document.querySelector(`.head`).style.display = "none";
    document.querySelector('.text-editor-title').style.display = "block";
    document.getElementById("text-editor").style.display = "block";
}

const elements = document.querySelectorAll(".text-editor-header .btn");
//Για links που βάζει στον text-editor
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
//Κουμπί αποθήκευσης, δημιουργία ανακοίνωσης και εμφάνιση του αρχικού περιεχομένου της Σελίδας των Ανακοινώσεων
function save() {
    let text = document.getElementById("textarea");
    const keimeno = text.innerHTML;
    text.innerHTML="";
    let text2 = document.getElementById("title");
    const titlos = text2.value;
    text2.value="";
    let text3 = document.getElementById("priority-admin");
    const priority = text3.value;
    let datetime = getDateTime();
    datetime = datetime.split(" ");
    const date = datetime[0];
    const time = datetime[1];
    const inputs = {titlos,keimeno,priority,date,time};
    fetch('/create_announcement',{
        method:"POST",
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

    document.querySelector(`.main`).style.display = "block";
    document.querySelector(`.head`).style.display = "block";
    document.querySelector('.text-editor-title').style.display = "none";
    document.getElementById("text-editor").style.display = "none";
}



//Συνάρτηση εύρεσης τωρινής ημερομηνίας και ώρας
function getDateTime(){
    const date = new Date();
    const year = date.getFullYear();
    let month;
    if (date.getMonth()+1<10){
        month = '0' + (date.getMonth()+1);
    }
    else{
        month = date.getMonth()+1;
    }
    let day;
    if (date.getDate()<10){
        day = '0' +date.getDate();
    }
    else{
        day = date.getDate();
    }
    let hours;
    if (date.getHours()<10){
        hours = '0' +date.getHours();
    }
    else{
        hours = date.getHours();
    }
    let minutes;
    if (date.getMinutes()<10){
        minutes = '0' +date.getMinutes();
    }
    else{
        minutes = date.getMinutes();
    }
    let seconds;
    if (date.getSeconds()<10){
        seconds = '0' +date.getSeconds();
    }
    else{
        seconds = date.getSeconds();
    }

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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
//Σε περίπτωση που κάνει κλικ ο χρήστης σε κάποια ανακοίνωση φορτώνεται το κείμενο της στο HTML του κομματιού αυτού, ώστε να φαίνεται η μορφοποίησή του.
const text = document.querySelector("table .message");
const keimeno= text.innerText;
text.innerHTML = keimeno;