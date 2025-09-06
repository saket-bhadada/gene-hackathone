// document.addEventListener("DOMContentLoaded", function () {
//   const loginButton = document.getElementById("loginButton");
//   const loginBox = document.querySelector(".login");

//   loginButton.addEventListener("mouseover", () => {
//     loginBox.style.display = "block";
//   });

//   loginButton.addEventListener("mouseout", () => {
//     setTimeout(() => {
//       if (!loginBox.matches(':hover')) {
//         loginBox.style.display = "none";
//       }
//     }, 200);
//   });

//   loginBox.addEventListener("mouseleave", () => {
//     loginBox.style.display = "none";
//   });

//   loginBox.addEventListener("mouseenter", () => {
//     loginBox.style.display = "block";
//   });
// });
$("button"),popover({trigger:'hover', placement:'bottom', title:'Title!', content:'Content'});