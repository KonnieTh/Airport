function covid_on() {
    document.getElementById("covid").style.display = "block";
}
function covid_off() {
    document.getElementById("covid").style.display = "none";
}

let dates = document.querySelectorAll("tbody tr td");
for(let i=0;i<dates.length;i++){
    if (i%2!=0){
        const date = dates[i].innerText.slice(0,15);
        const time = dates[i].innerText.slice(-9);
        dates[i].innerText = `${date} ${time}`;
    }
}

const text = document.querySelector("table .message");
const keimeno= text.innerText;
text.innerHTML = keimeno;


// async function getAnnouncements(index){
//     const element = document.querySelector("#priority");
//     const priority=element.value;
//     console.log(index,priority);
//     fetch(`http://localhost:3000/announcements/next/${index}/${priority}`)
//     .then(response=>response.json())
//     .catch((err)=>console.error(err));

// }


// function getAnnouncements(start,limit){
//     fetch(`/announcements/`)
//     .then(response=>response.json())
//     .catch((error)=>{
//         console.log("Error:",error);
//     })
// }

// getAnnouncements(index,limit);
// index=limit;
// fetch('http://localhost:3000/index/limit',{
//         method:"POST",
//         headers:{
//             'Content-Type': 'application/json',
//         },
//         body:JSON.stringify(inputs)
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log("Success:",data);
//     })
//     .catch((error) =>{
//         console.error("Error:",error);
//     })

function createAnnouncement(){
    document.querySelector(`.main`).style.display = "none";
    document.querySelector(`.head`).style.display = "none";
    document.querySelector('.text-editor-title').style.display = "block";
    document.getElementById("text-editor").style.display = "block";
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
    // document.getElementById("main-menu").style.display = "none";
    // document.querySelector('.header').style.backgroundImage = "none";
    // document.querySelector('.header').style.backgroundColor = "rgb(46, 46, 46)";
    // document.querySelector('.header').style.minHeight = "10em";
    // let text = document.querySelector(`${a}`);
    // let text2 = document.getElementById("textarea");
    // text2.innerHTML = text.innerHTML;

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
    fetch('http://localhost:3000/create_announcement',{
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
    // document.getElementById("customs_insection_text").style.display = "none";
    // document.getElementById("text-editor").style.display = "none";
    // document.getElementById("description").style.display = "block";
    // document.getElementById("main-menu").style.display = "block";
    // document.querySelector('.header').style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),url('/Front-end/images/athens.jpg')";
    // document.querySelector('.header').style.minHeight = "100vh";
}




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