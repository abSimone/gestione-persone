const url =
  "https://registrazione-utenti-eb17b-default-rtdb.europe-west1.firebasedatabase.app/people.json";

let myForm = document.querySelector("form");
myForm.addEventListener("submit", sendData);

let backButton = document.querySelector('button[type="button"]');
backButton.addEventListener("click", () => {
  location.assign("http://localhost:5500/");
});

function retrivePeopleData() {
  let people = [];
}

function sendData(e) {
  e.preventDefault();

  //   console.log(getUserData(new FormData(myForm)));

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      let indice = data.length; // 4 con indici che vanno da 0 a 3
      const formattedPerson = { [indice]: getUserData(new FormData(myForm)) };
      return fetch(url, {
        method: "PATCH",
        body: JSON.stringify(formattedPerson),
      });
    })
    .then((response) => {location.assign("http://localhost:5500/tabella-persone/")});
}

function getUserData(formData) {
  let user = {};
  formData.forEach((value, key) => {
    user[key] = value;
  });
  return user;
}
