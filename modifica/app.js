const url =
  "https://registrazione-utenti-eb17b-default-rtdb.europe-west1.firebasedatabase.app/people";

let myForm = document.querySelector("form");
myForm.addEventListener("submit", sendData);

let backButton = document.querySelector('button[type="button"]');
backButton.addEventListener("click", () => {
  location.assign("http://localhost:3000/tabella-persone/index.html");
});

location.search; // ?param1=value1&param2=value2

const params = new URLSearchParams(location.search);
// url?index=3
let indice = params.get("index");
getSelectedUserData(indice);

function getSelectedUserData(index) {
  fetch(url + `/${index}.json`)
    .then((response) => response.json())
    .then((selectedUser) => {
      for (let key in selectedUser) {
        myForm.elements.namedItem(key).value = selectedUser[key];
      }
    });
}

function sendData(e) {
  e.preventDefault();

  const formattedPerson = { [indice]: getUserData(new FormData(myForm)) };
  fetch(url + ".json", {
    method: "PATCH",
    body: JSON.stringify(formattedPerson),
  }).then((response) => {
    location.assign("http://localhost:3000/tabella-persone/index.html");
  });
}

function getUserData(formData) {
  let user = {};
  formData.forEach((value, key) => {
    user[key] = value;
  });
  return user;
}
