document.addEventListener("DOMContentLoaded", loadRequests);

document
  .getElementById("video-request-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const request = document.getElementById("request").value;
    const name = document.getElementById("name").value;

    await fetch("/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ request, name }),
    });

    loadRequests();
  });

async function loadRequests() {
  const response = await fetch("/requests");
  const requests = await response.json();

  const tableBody = document.querySelector("#requests-table tbody");
  tableBody.innerHTML = "";

  requests.forEach((req, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td contenteditable="true" data-index="${index}" data-field="request">${req.request}</td>
      <td contenteditable="true" data-index="${index}" data-field="name">${req.name}</td>
      <td>
        <button onclick="saveRequest(${index})">Save</button>
        <button onclick="deleteRequest(${index})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

async function saveRequest(index) {
  const row = document.querySelector(
    `#requests-table tbody tr:nth-child(${index + 1})`
  );
  const request = row.querySelector('[data-field="request"]').textContent;
  const name = row.querySelector('[data-field="name"]').textContent;

  await fetch("/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ index, request, name }),
  });

  loadRequests();
}

async function deleteRequest(index) {
  await fetch("/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ index }),
  });

  loadRequests();
}
