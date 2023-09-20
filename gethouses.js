// function getHouses() {
//     const data = null;

//     const xhr = new XMLHttpRequest();
//     xhr.withCredentials = true;

//     xhr.addEventListener("readystatechange", function () {
//         if (this.readyState === this.DONE) {
//             console.log(this.responseText);
//         }
//     });

//     xhr.open(
//         "GET",
//         "https://zillow56.p.rapidapi.com/search?location=houston%2C%20tx"
//     );
//     xhr.setRequestHeader(
//         "X-RapidAPI-Key",
//         "ee115d60d1msh8550a345d01d7bbp1d2ac6jsnb6480e8c01d6"
//     );
//     xhr.setRequestHeader("X-RapidAPI-Host", "zillow56.p.rapidapi.com");

//     xhr.send();
// }