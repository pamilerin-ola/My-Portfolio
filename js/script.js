// ===== Shared helpers =====
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile navigation toggle
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
navToggle.addEventListener("click", function () {
  navLinks.classList.toggle("open");
});

// Simulated demo links
// document.querySelectorAll(".demo-link").forEach(function (link) {
//   link.addEventListener("click", function (e) {
//     e.preventDefault();
//     alert("Live demo coming soon!");
//   });
// });

// ===== Academic Planner =====
const taskForm = document.getElementById("taskForm");
if (taskForm) {
  const STORAGE_KEY = "amara_tasks";
  let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  let currentFilter = "all";
  const taskInput = document.getElementById("taskInput");
  const taskDate = document.getElementById("taskDate");
  const taskList = document.getElementById("taskList");
  const taskError = document.getElementById("taskError");
  const taskCount = document.getElementById("taskCount");
  const emptyMsg = document.getElementById("emptyMsg");

  function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function renderTasks() {
    taskList.innerHTML = "";
    const visible = tasks.filter(function (t) {
      if (currentFilter === "active") return !t.done;
      if (currentFilter === "done") return t.done;
      return true;
    });
    visible.forEach(function (task) {
      const li = document.createElement("li");
      li.className = "task-item" + (task.done ? " done" : "");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.done;
      checkbox.addEventListener("change", function () { toggleTask(task.id); });

      const text = document.createElement("span");
      text.className = "task-text";
      text.textContent = task.text;

      const date = document.createElement("small");
      date.className = "task-date";
      date.textContent = task.date ? "Due " + task.date : "";

      const del = document.createElement("button");
      del.className = "delete-btn";
      del.textContent = "Delete";
      del.addEventListener("click", function () { deleteTask(task.id); });

      li.append(checkbox, text, date, del);
      taskList.appendChild(li);
    });
    const remaining = tasks.filter(function (t) { return !t.done; }).length;
    taskCount.textContent = tasks.length + " tasks · " + remaining + " remaining";
    emptyMsg.style.display = visible.length ? "none" : "block";
  }

  function addTask(text, date) {
    tasks.push({ id: Date.now(), text: text, date: date, done: false });
    saveTasks();
    renderTasks();
  }
  function toggleTask(id) {
    tasks = tasks.map(function (t) { return t.id === id ? Object.assign({}, t, { done: !t.done }) : t; });
    saveTasks();
    renderTasks();
  }
  function deleteTask(id) {
    tasks = tasks.filter(function (t) { return t.id !== id; });
    saveTasks();
    renderTasks();
  }

  taskForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (text === "") {
      taskError.textContent = "Please enter a task.";
      return;
    }
    taskError.textContent = "";
    addTask(text, taskDate.value);
    taskForm.reset();
  });

  document.querySelectorAll(".filters button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelector(".filters .active").classList.remove("active");
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      renderTasks();
    });
  });

  renderTasks();
}

// ===== Contact form validation =====

 // ===== Contact form validation =====
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const digitsPattern = /^[0-9]+$/;

  function setError(input, message) {
    const small = input.parentElement.querySelector(".error");
    small.textContent = message;
    input.classList.toggle("invalid", message !== "");
  }

  contactForm.addEventListener("submit", function (e) {
    let valid = true;

    const fields = ["name", "email", "phone", "message"];

    fields.forEach(function (id) {
      const input = document.getElementById(id);
      const value = input.value.trim();
      let msg = "";

      if (value === "") {
        msg = "This field is required.";
      } else if (
        id === "email" &&
        !emailPattern.test(value)
      ) {
        msg = "Enter a valid email address.";
      } else if (
        id === "phone" &&
        !digitsPattern.test(value)
      ) {
        msg = "Phone number must contain digits only.";
      }

      setError(input, msg);

      if (msg) valid = false;
    });

    if (!valid) {
      e.preventDefault();
      document.getElementById("formSuccess").textContent = "";
    }
  });
}
