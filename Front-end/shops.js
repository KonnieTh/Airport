let button = document.querySelectorAll('.shop button');
console.log(button);

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
