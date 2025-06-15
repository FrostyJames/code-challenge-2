document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formy");
  const input = document.getElementById("Names");
  const guestList = document.getElementById("Guests");

  const maxGuests = 10;
  let savedGuests = JSON.parse(localStorage.getItem("guests")) || [];

  // Limit checkboxes to one selection at a time
  document.querySelectorAll('input[name="category"]').forEach(box => {
    box.addEventListener("change", () => {
      document.querySelectorAll('input[name="category"]').forEach(other => {
        if (other !== box) other.checked = false;
      });
    });
  });

  function saveToStorage() {
    localStorage.setItem("guests", JSON.stringify(savedGuests));
  }

  function renderList() {
    guestList.innerHTML = "";

    savedGuests.forEach((guest, index) => {
      const li = document.createElement("li");

      const nameSpan = document.createElement("span");
      nameSpan.textContent = `${guest.name} (${guest.category}) — ${guest.time}`;
      nameSpan.classList.add(guest.category.toLowerCase());
      li.appendChild(nameSpan);

      const rsvpBtn = document.createElement("button");
      rsvpBtn.textContent = guest.rsvp ? "Attending" : "Not Attending";
      rsvpBtn.addEventListener("click", () => {
        guest.rsvp = !guest.rsvp;
        saveToStorage();
        renderList();
      });
      li.appendChild(rsvpBtn);

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.addEventListener("click", () => {
        const newName = prompt("Edit guest name:", guest.name);
        if (newName) {
          guest.name = newName.trim();
          saveToStorage();
          renderList();
        }
      });
      li.appendChild(editBtn);

      const removeBtn = document.createElement("button");
      removeBtn.textContent = "Remove";
      removeBtn.addEventListener("click", () => {
        savedGuests.splice(index, 1);
        saveToStorage();
        renderList();
      });
      li.appendChild(removeBtn);

      guestList.appendChild(li);
    });
  }

  renderList();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = input.value.trim();
    if (name === "") return;

    if (savedGuests.length >= maxGuests) {
      alert("Guest limit reached (10 guests max).");
      return;
    }

    // Get selected category from checkboxes
    const categoryInputs = document.querySelectorAll('input[name="category"]');
    let category = "";
    categoryInputs.forEach((input) => {
      if (input.checked) category = input.value;
    });

    if (!category) {
      alert("Please select a category for the guest.");
      return;
    }

    const colorMap = {
      friend: "green",
      family: "blue",
      colleague: "orange"
    };

    const newGuest = {
      name,
      rsvp: false,
      category,
      time: new Date().toLocaleTimeString(),
      color: colorMap[category] || "gray"
    };

    savedGuests.push(newGuest);
    saveToStorage();
    renderList();
    input.value = "";

    // Reset checkboxes
    categoryInputs.forEach(input => input.checked = false);
  });
});