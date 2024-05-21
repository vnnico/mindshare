// const button = document.querySelector(".button-edit");
// const buttonUpdate = document.querySelector(".button-submit");
// button.addEventListener("click", function (e) {
//   e.preventDefault();
//   const inputs = document.querySelectorAll("input");
//   inputs.forEach((input) => {
//     if (!input.classList.contains("email")) {
//       if (input.hasAttribute("readonly")) {
//         input.removeAttribute("readonly");
//         input.classList.remove("form-control-plaintext");
//         input.classList.add("form-control");

//         button.textContent = "CANCEL";

//         button.classList.remove("btn-warning");
//         button.classList.add("btn-danger");

//         buttonUpdate.classList.remove("visually-hidden");
//         const profileInput = document.querySelector(".profile-input");
//         profileInput.classList.remove("visually-hidden");

//         if (input.classList.contains("visually-hidden")) {
//           input.classList.remove("visually-hidden");
//           const nameBox = document.querySelector("div.name-box");
//           nameBox.classList.add("visually-hidden");
//         }
//       } else {
//         input.setAttribute("readonly", "");
//         input.classList.add("form-control-plaintext");
//         input.classList.remove("form-control");
//         button.textContent = "EDIT";
//         button.classList.remove("btn-danger");
//         button.classList.add("btn-warning");

//         buttonUpdate.classList.add("visually-hidden");
//         const profileInput = document.querySelector(".profile-input");
//         profileInput.classList.add("visually-hidden");

//         if (!input.classList.contains("visually-hidden")) {
//           input.classList.add("visually-hidden");
//           const nameBox = document.querySelector(".name-box");
//           nameBox.classList.remove("visually-hidden");
//         }
//       }
//     }
//   });
// });

document.addEventListener("DOMContentLoaded", function () {
  const buttonEdit = document.querySelector(".button-edit");
  const buttonUpdate = document.querySelector(".button-submit");
  const profileInput = document.querySelector(".profile-input");
  const nameBox = document.querySelector(".name-box");
  const nameInput = document.querySelector("#name");

  buttonEdit.addEventListener("click", function (e) {
    e.preventDefault();
    const inputs = document.querySelectorAll("input");

    if (buttonEdit.textContent === "EDIT") {
      inputs.forEach((input) => {
        if (!input.classList.contains("email")) {
          input.removeAttribute("readonly");
          input.classList.remove("form-control-plaintext");
          input.classList.add("form-control");
        }
      });

      buttonEdit.textContent = "CANCEL";
      buttonEdit.classList.remove("btn-warning");
      buttonEdit.classList.add("btn-danger");
      buttonUpdate.classList.remove("visually-hidden");
      profileInput.classList.remove("visually-hidden");
      nameBox.classList.add("visually-hidden");
      nameInput.classList.remove("visually-hidden");
    } else {
      inputs.forEach((input) => {
        if (!input.classList.contains("email")) {
          input.setAttribute("readonly", "");
          input.classList.add("form-control-plaintext");
          input.classList.remove("form-control");
        }
      });

      buttonEdit.textContent = "EDIT";
      buttonEdit.classList.remove("btn-danger");
      buttonEdit.classList.add("btn-warning");
      buttonUpdate.classList.add("visually-hidden");
      profileInput.classList.add("visually-hidden");
      nameBox.classList.remove("visually-hidden");
      nameInput.classList.add("visually-hidden");
    }
  });
});

const popoverTriggerList = document.querySelectorAll(
  '[data-bs-toggle="popover"]'
);
const popoverList = [...popoverTriggerList].map(
  (popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl)
);
