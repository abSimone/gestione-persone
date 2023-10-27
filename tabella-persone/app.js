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
  people = people.filter((el) => el != null);
  createTableRows(people);
  // createChart();
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

// CHART FUNCTIONS AND CRETION

function countLessThan20() {
  console.log("E");
  let count = 0;
  people.forEach((el) => {
    if (parseInt(el.age) <= 20) {
      count++;
    }
  });
  return count;
}
function between20and30() {
  let count = 0;
  people.forEach((el) => {
    if (parseInt(el.age) > 20 && el.age <= 30) {
      count++;
    }
    console.log(count);
  });
  return count;
}

function countOthers() {
  let count = 0;
  people.forEach((el) => {
    if (parseInt(el.age) > 30) {
      count++;
    }
  });
  return count;
}
const wrapper = document.getElementById("chart-wrapper");

function createChart() {
  const config = {
    type: "pie",
    options: {
      plugins: {
        legend: {
          position: "top",
        },
      },
    },
    data: {
      labels: ["Youngest", "Young", "Adults"],
      datasets: [
        {
          data: [countLessThan20(), between20and30(), countOthers()],
          backgroundColor: ["#ff7700", "#40ff12", "#236fff"],
          hoverOffset: 4,
        },
      ],
    },
  };

  const chart = document.createElement("canvas");
  wrapper.append(chart);
  chart.id = "chart";
  new Chart(chart, config);

  chartButton.innerHTML = "Hide chart";
  chartButton.removeEventListener("click", createChart);
  chartButton.addEventListener("click", removeChart);
}

function removeChart() {
  wrapper.innerHTML = "";
  chartButton.innerHTML = "Show age chart";
  chartButton.removeEventListener("click", removeChart);
  chartButton.addEventListener("click", createChart);
}

const chartButton = document.getElementById("show-chart");

chartButton.addEventListener("click", createChart);
