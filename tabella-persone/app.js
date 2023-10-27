const endpoint =
  "https://registrazione-utenti-eb17b-default-rtdb.europe-west1.firebasedatabase.app/people.json";

const tableBody = document.querySelector("tbody");

let backButton = document.querySelector('button[type="button"]');
backButton.addEventListener("click", () => {
  location.assign("http://localhost:3000/index.html");
});

let people = [];

async function retrivePeopleData() {
  let response = await fetch(endpoint);
  people = await response.json();
  console.log(people);
  people = people.filter((el) => el != null);
  createTableRows(people);
}

function createTableRows(array) {
  tableBody.innerHTML = "";
  array.forEach((element, index) => {
    let tableRow = `
        <tr>
            <th scope="row">${index + 1}</th>
            <td>${element.firstname}</td>
            <td>${element.lastname}</td>
            <td>${element.age}</td>
            <td>${element.email}</td>
            <td>${element.phone}</td>
            <td class="actions">
              <span class="material-symbols-outlined edit" data-index="${
                index + 1
              }">edit</span>
              <span class="material-symbols-outlined remove" data-index="${
                index + 1
              }">delete</span>
            </td>
        </tr>`;

    tableBody.insertAdjacentHTML("beforeend", tableRow);
  });
  let editSpans = document.querySelectorAll(".edit");
  let removeSpans = document.querySelectorAll(".remove");
  editSpans.forEach((span) => span.addEventListener("click", editPerson));
  removeSpans.forEach((span) => span.addEventListener("click", removePerson));
}

function editPerson(e) {
  if (confirm("Sicuro di voler modificare l'elemento selezionato?")) {
    location.replace(
      `http://localhost:3000/modifica/index.html?index=${e.target.dataset["index"]}`
    );
  }
}

function removePerson(e) {
  if (confirm("Sicuro di voler rimuovere l'elemento selezionato?")) {
    people = people.filter((el, index) => index != e.target.dataset["index"]);
    fetch(endpoint, {
      method: "PUT",
      body: JSON.stringify(people),
    })
      .then((res) => console.log(res))
      .finally(() => location.reload());
  }
}

let filters = document.querySelectorAll('[type="search"]');
filters.forEach((input) => input.addEventListener("input", applyFilters));

function applyFilters() {
  createTableRows(
    people.filter((el) =>
      Array.from(filters).reduce((prev, curr) => {
        return (
          prev &&
          el[curr.name].toLowerCase().startsWith(curr.value.toLowerCase())
        );
      }, true)
    )
  );
}

retrivePeopleData();
