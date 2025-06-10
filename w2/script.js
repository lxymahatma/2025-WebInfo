const toggleStyleBtn = document.getElementById("toggle-style-btn");
toggleStyleBtn.addEventListener("click", () => {
  document.body.classList.toggle("bg-gray-100");
  document.body.classList.toggle("bg-blue-100");
});

const addHobbyBtn = document.getElementById("add-hobby-btn");
const hobbyInput = document.getElementById("hobby-input");
const hobbyList = document.getElementById("hobby-list");

addHobbyBtn.addEventListener("click", () => {
  const hobby = hobbyInput.value.trim();
  if (hobby) {
    const hobbyItem = document.createElement("p");
    hobbyItem.className = "hobby-item";
    hobbyItem.textContent = hobby;
    hobbyList.appendChild(hobbyItem);
    hobbyInput.value = "";
  }
});
