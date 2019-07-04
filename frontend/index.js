function fetchData(){
    let xhttp = new XMLHttpRequest();
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    xhttp.open('POST', '/process_get', true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xhttp.onload = function () {
        let response = JSON.parse(xhttp.response);
        if (response.redirect) {
            window.location.href = "/Bookish";
        }
    };

    xhttp.send(`username=${username}&password=${password}`);
}