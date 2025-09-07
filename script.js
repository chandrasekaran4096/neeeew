function setCookie(name, value, minutes) {
  let d = new Date();
  d.setTime(d.getTime() + (minutes * 60 * 1000));
  document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
  localStorage.setItem(name + "_expiry", d.getTime());
}

function getCookie(name) {
  let cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    let [key, val] = cookie.split("=");
    if (key === name) return val;
  }
  return "";
}

function deleteCookie(name) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
  localStorage.removeItem(name + "_expiry");
}

//LOGIN PAGE
$(document).ready(function () {
  let loginForm = $("#loginForm");
  let userForm = $("#userForm");
  let tableBody = $("#dataTableBody");

  //LOGIN
  if (loginForm.length) {
    loginForm.on("submit", function (e) {
      e.preventDefault();
      let username = $("#username").val().trim();

      if (username === "") {
        alert("Enter a valid username");
        return;
      }

      // Cookie set 1 minute expiry
      setCookie("username", username, 1);

      // Redirect to form.html
      window.location.href = "form.html";
    });
  }

  //FORM PAGE 
  if (userForm.length) {
    let user = getCookie("username");

    if (!user) {
      alert("Session expired! Please login again....");
      window.location.href = "index.html";
    } else {
      // Welcome message
      $("#welcomeMsg").text("Welcome, " + user);

      // Cookie expiry check every second
      setInterval(() => {
        let expiry = localStorage.getItem("username_expiry");
        if (expiry && Date.now() > expiry) {
          alert("Session expired! Please login again.....");
          deleteCookie("username");
          window.location.href = "index.html";
        }
      }, 1000);

      // Load saved data into table
      renderTable();

      // Form submit → save to localStorage
      userForm.on("submit", function (e) {
        e.preventDefault();

        let formData = {
          name: $("#name").val(),
          email: $("#email").val(),
          phone: $("#phone").val(),
          dob: $("#dob").val(),
          gender: $("#gender").val(),
          address: $("#address").val(),
        };

        let data = JSON.parse(localStorage.getItem("users")) || [];
        data.push(formData);
        localStorage.setItem("users", JSON.stringify(data));

        userForm[0].reset();
        renderTable();
      });
    }

    // ---- RENDER TABLE ---- //
    function renderTable() {
      let data = JSON.parse(localStorage.getItem("users")) || [];
      tableBody.empty();

      data.forEach((row, index) => {
        let tr = $(`
          <tr class="odd:bg-gray-50 even:bg-white">
            <td class="p-2 border">${row.name}</td>
            <td class="p-2 border">${row.email}</td>
            <td class="p-2 border">${row.phone}</td>
            <td class="p-2 border">${row.dob}</td>
            <td class="p-2 border">${row.gender}</td>
            <td class="p-2 border">${row.address}</td>
            <td class="p-2 border space-x-2" >
              <button class="editBtn bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded" data-index="${index}">Edit</button>
              <button class="deleteBtn bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded" data-index="${index}">Delete</button>
            </td>
          </tr>
        `);
        tableBody.append(tr);
      });

      // Delete
      $(".deleteBtn").on("click", function () {
        let idx = $(this).data("index");
        let data = JSON.parse(localStorage.getItem("users")) || [];
        data.splice(idx, 1);
        localStorage.setItem("users", JSON.stringify(data));
        renderTable();
      });

      // Edit
      $(".editBtn").on("click", function () {
        let idx = $(this).data("index");
        let data = JSON.parse(localStorage.getItem("users")) || [];

        // Fill form with selected row
        $("#name").val(data[idx].name);
        $("#email").val(data[idx].email);
        $("#phone").val(data[idx].phone);
        $("#dob").val(data[idx].dob);
        $("#gender").val(data[idx].gender);
        $("#address").val(data[idx].address);

        // Remove old entry
        data.splice(idx, 1);
        localStorage.setItem("users", JSON.stringify(data));
        renderTable();
      });
    }
  }
});
