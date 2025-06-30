//base URL for JSON Server endpoint
const BASE_URL = "http://localhost:3000/contacts";

//get references to the form and input elements in html
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

// this is to handle form submission for adding or updating contacts
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  //create a contact object from form inputs
  const contact = {
    name: nameInput.value,
    username: usernameInput.value,
    email: emailInput.value,
    address: addressInput.value,
    phone: phoneInput.value,
  };

  const id = contactIdInput.value;

// suppose the contact has an ID, we will update it (PATCH)
  if (id) {
    await fetch(`${BASE_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contact),
    });
  } else {
    //If no ID, add new contact (POST), and let the server auto-assign the ID
    await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contact),
    });
  }

//reset form and reload contacts
  form.reset();
  contactIdInput.value = "";
  loadContacts();
});

//load contacts from the server and update the list
async function loadContacts() {
  const res = await fetch(BASE_URL);
  contacts = await res.json();
  renderContacts();
}


// this function will filter and sort contacts based on search input and sort order
function renderContacts() {
  const searchTerm = searchInput.value.toLowerCase();
  const sortOrder = sortSelect.value;

  //filter contacts based on search term
  let filtered = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm) ||
    contact.username.toLowerCase().includes(searchTerm) ||
    contact.email.toLowerCase().includes(searchTerm)
  );

  //sort alphabetically
  filtered.sort((a, b) => {
    if (sortOrder === "asc") {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  // for clear and rebuild the contact list
  contactsList.innerHTML = "";

  // loop through each contact and display it
  filtered.forEach((contact) => {
    const card = document.createElement("div");
    card.className = "contact-card";

    // this is to create the contact details
    const details = document.createElement("div");
    details.className = "contact-details";
    details.innerHTML = `
      <strong>${contact.name}</strong><br />
      ${contact.username}<br />
      ${contact.email}<br />
      ${contact.address}<br />
      ${contact.phone} 
    `;

    // this is to create actions for edit and delete
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

    // append details and actions to the card
    card.appendChild(details);
    card.appendChild(actions);

   // add the card to the contacts list 
    contactsList.appendChild(card);
  });
}

//this is to load contact data into the form for editing
function loadForEdit(contact) {
  contactIdInput.value = contact.id;
  nameInput.value = contact.name;
  usernameInput.value = contact.username;
  emailInput.value = contact.email;
  addressInput.value = contact.address;
  phoneInput.value = contact.phone;
}

//deleting a contact with a confirmation
async function deleteContact(id) {
  const confirmDelete = confirm("Are you sure you want to delete this contact?");
  if (!confirmDelete) return;

  await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  loadContacts();
}

//event listeners for search and sort
searchInput.addEventListener("input", renderContacts);
sortSelect.addEventListener("change", renderContacts);
// load for contacts
loadContacts();
