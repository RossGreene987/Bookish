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


function addBook(){
    let xhttp = new XMLHttpRequest();
    let bookName = document.getElementById("nameOfBook").value;
    let author = document.getElementById("author").value;
    let ISBN = document.getElementById("ISBN").value;
    let copiesAvailable = document.getElementById("copiesAvailable").value;
    let copiesInLibrary = document.getElementById("copiesInLibrary").value;

    xhttp.open('POST', '/process_addBook', true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xhttp.onload = function () {
        let response = JSON.parse(xhttp.response);
        if(response.success){
            console.log("Successfully added")
        } else {
            console.log(response.Error)
        }
    };

    xhttp.send(`bookName=${bookName}&author=${author}&ISBN=${ISBN}&copiesAvailable=${copiesAvailable}&copiesInLibrary=${copiesInLibrary}`);
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