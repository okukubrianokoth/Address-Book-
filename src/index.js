const BASE_URL = "http://localhost:3000/contacts";

const form = document.getElementById("contact-form");
const contactIdInput = document.getElementById("contact-id");
const nameInput = document.getElementById("name");
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const addressInput = document.getElementById("address");
const phoneInput = document.getElementById("phone");
const contactsList = document.getElementById("contacts-list");
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");

let contacts = [];

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const contact = {
    name: nameInput.value,
    username: usernameInput.value,
    email: emailInput.value,
    address: addressInput.value,
    phone: phoneInput.value,
  };

  const id = contactIdInput.value;

  if (id) {
    await fetch(`${BASE_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contact),
    });
  } else {
  await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contact),
  });
}


  form.reset();
  contactIdInput.value = "";
  loadContacts();
});

async function loadContacts() {
  const res = await fetch(BASE_URL);
  contacts = await res.json();
  renderContacts();
}

function renderContacts() {
  const searchTerm = searchInput.value.toLowerCase();
  const sortOrder = sortSelect.value;

  let filtered = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm) ||
    contact.username.toLowerCase().includes(searchTerm) ||
    contact.email.toLowerCase().includes(searchTerm)
  );

  filtered.sort((a, b) => {
    if (sortOrder === "asc") {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  contactsList.innerHTML = "";

  filtered.forEach((contact) => {
    const card = document.createElement("div");
    card.className = "contact-card";

    const details = document.createElement("div");
    details.className = "contact-details";
    details.innerHTML = `
      <strong>${contact.name}</strong><br />
      ${contact.username}<br />
      ${contact.email}<br />
      ${contact.address}<br />
      ${contact.phone}
    `;

    const actions = document.createElement("div");
    actions.className = "contact-actions";

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.onclick = () => loadForEdit(contact);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => deleteContact(contact.id);

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    card.appendChild(details);
    card.appendChild(actions);

    contactsList.appendChild(card);
  });
}

function loadForEdit(contact) {
  contactIdInput.value = contact.id;
  nameInput.value = contact.name;
  usernameInput.value = contact.username;
  emailInput.value = contact.email;
  addressInput.value = contact.address;
  phoneInput.value = contact.phone;
}

async function deleteContact(id) {
  const confirmDelete = confirm("Are you sure you want to delete this contact?");
  if (!confirmDelete) return;

  await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  loadContacts();
}

searchInput.addEventListener("input", renderContacts);
sortSelect.addEventListener("change", renderContacts);

loadContacts();
