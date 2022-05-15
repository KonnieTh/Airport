

function pets_on() {
    document.getElementById("pets_text").style.display = "block";
}
function pets_off() {
    document.getElementById("pets_text").style.display = "none";
}

function currency_on() {
    document.getElementById("currency_text").style.display = "block";
}
function currency_off() {
    document.getElementById("currency_text").style.display = "none";
}

function customs_on() {
    document.getElementById("customs_insection_text").style.display = "block";
}
function customs_off() {
    document.getElementById("customs_insection_text").style.display = "none";
}


let d;

function edit(a, b) {
    d = a;
    document.getElementById(b).style.display = "none";
    document.getElementById("text-editor").style.display = "block";
    document.getElementById("description").style.display = "none";
    document.getElementById("main-menu").style.display = "none";
    document.getElementById('lo').style.backgroundImage = "none";
    document.getElementById('lo').style.backgroundColor = "rgb(46, 46, 46)";
    document.getElementById('lo').style.minHeight = "10em";
    let text = document.getElementById(a);
    let text2 = document.getElementById("textarea");
    text2.innerHTML = text.innerHTML;
}

function save() {
    let text2 = document.getElementById("textarea");
    let text = document.getElementById(d);
    text.innerHTML = text2.innerHTML;
    document.getElementById("customs_insection_text").style.display = "none";
    document.getElementById("text-editor").style.display = "none";
    document.getElementById("description").style.display = "block";
    document.getElementById("main-menu").style.display = "block";
    document.getElementById('lo').style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),url('/images/athens.jpg')";
    document.getElementById('lo').style.minHeight = "100vh";
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
