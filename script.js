const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const maxCharacters = 100;

document.getElementById("add-btn").addEventListener("click", addTask);
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target === inputBox) {
    addTask();
  }
});

function addTask() {
  if (inputBox.value === "") {
    alert("You must write something!");
  } else if (inputBox.value.length > maxCharacters) {
    alert("Task cannot exceed 100 characters!");
  } else {
    let li = document.createElement("li");
    li.innerHTML = formatText(inputBox.value, 50);
    listContainer.appendChild(li);

    let span = document.createElement("span");
    span.innerHTML = "<i class='fa-solid fa-trash'></i>";
    li.appendChild(span);

    // Add event listener for editing
    li.addEventListener("dblclick", editTask);
  }
  inputBox.value = "";
  saveData();
}

function formatText(text, limit) {
  const regex = new RegExp(`(.{1,${limit}})(\\s|$)`, 'g');
  return text.match(regex).join("<br>");
}

// Edit task on double-click
function editTask(e) {
  let li = e.target;

  // Create an input box with the current task's text
  let input = document.createElement("input");
  input.type = "text";
  input.value = li.textContent.trim(); // Get the current task text without span (trash icon)

  // Replace the <li> content with the input field
  li.innerHTML = "";
  li.appendChild(input);
  input.focus();

  // Add a character limit check
  input.addEventListener("input", function () {
    if (input.value.length > maxCharacters) {
      alert("Task cannot exceed 100 characters!");
      input.value = input.value.slice(0, maxCharacters); // Trim excess characters
    }
  });

  // Save the edited task on pressing Enter or clicking outside the input field
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      saveEditedTask(li, input.value);
    }
  });

  input.addEventListener("blur", function () {
    saveEditedTask(li, input.value);
  });
}

function saveEditedTask(li, newValue) {
  if (newValue.trim() !== "") {
    li.innerHTML = formatText(newValue, 50); // Update the <li> with the edited task
    let span = document.createElement("span");
    span.innerHTML = "<i class='fa-solid fa-trash'></i>";
    li.appendChild(span);
    saveData(); // Save updated task list to localStorage

    // Add the event listener again for editing
    li.addEventListener("dblclick", editTask);
  } else {
    alert("You must write something!"); // Alert if empty task
  }
}

function saveData() {
  localStorage.setItem("data", listContainer.innerHTML);
}

listContainer.addEventListener("click", function (e) {
  if (e.target.tagName.toUpperCase() === "LI") {
    e.target.classList.toggle("checked");
    saveData();
  } else if (e.target.tagName.toUpperCase() === "SPAN") {
    e.target.parentElement.remove();
    saveData();
  }
});

function showTask() {
  listContainer.innerHTML = localStorage.getItem("data");
  // Re-add event listeners for editing existing tasks from localStorage
  document.querySelectorAll("li").forEach(li => {
    li.addEventListener("dblclick", editTask);
  });
}
showTask();
