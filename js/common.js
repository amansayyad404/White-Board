// utility fn to handle handleHamburger icon
let isActive = true;
function handleHamburger() {
  if (isActive == true) {
    hamburger.classList.remove("is-active");
    toolPanel.classList.remove("add-animation");
    boardSize.classList.add("add-size");
  } else {
    hamburger.classList.add("is-active");
    toolPanel.classList.add("add-animation");
    boardSize.classList.remove("add-size")
  }

  isActive = !isActive;
}
