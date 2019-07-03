

function fetchData(){
    let xhttp = new XMLHttpRequest();
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    xhttp.open('POST', '/process_get', true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xhttp.onload = function () {
        console.log(this.responseText);
    };
    xhttp.send(`username=${username}&password=${password}`);



}