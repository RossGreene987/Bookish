let bookishToken = sessionStorage.getItem("token");

function fetchCatalogue() {
    let xhttp = new XMLHttpRequest();
    xhttp.open('POST', '/process_fetchCatalogue', true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.onload = function () {
        console.log(xhttp.response);
        // let response = JSON.parse(xhttp.response);
        // if (response.redirect) {
        //     sessionStorage.SessionName = "SessionData" ;
        //
        //     sessionStorage.setItem("token",response.token);
        //
        //     window.location.href = `/Bookish?token=${response.token}`;
        // }
    };
    xhttp.send();
}

// <table style="width:100%">
//     <tr>
//     <th>Firstname</th>
//     <th>Lastname</th>
//     <th>Age</th>
//     </tr>
//     <tr>
//     <td>Jill</td>
//     <td>Smith</td>
//     <td>50</td>
//     </tr>
//     <tr>
//     <td>Eve</td>
//     <td>Jackson</td>
//     <td>94</td>
//     </tr>
//     </table>