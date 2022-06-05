//Εμφάνιση φόρμας signup με πάτημα του κουμπιού "Εγγραφή"
document.querySelector(".sign-up").addEventListener("click",function(){
    document.querySelector(".signup").classList.add("active");
    document.querySelector("body").classList.add("active");
});
//Κλείσιμο φόρμας signup
document.querySelector(".signup .close").addEventListener("click",function(){
    document.querySelector(".signup").classList.remove("active");
    document.querySelector("body").classList.remove("active");
});