//Εμφάνιση φόρμας login με πάτημα του κουμπιού "Είσοδος"
document.querySelector(".log-in").addEventListener("click",function(){
    document.querySelector(".login").classList.add("active");
    document.querySelector("body").classList.add("active");
});
//Κλείσιμο φόρμας login
document.querySelector(".login .close").addEventListener("click",function(){
    document.querySelector(".login").classList.remove("active");
    document.querySelector("body").classList.remove("active");
});