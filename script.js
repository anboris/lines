// Controls for carousel left/right buttons
const list = document.querySelector(".program-list");

document.querySelector(".next")?.addEventListener("click", () => {
  list.scrollBy({ left: list.clientWidth * 0.8, behavior: "smooth" });
});

document.querySelector(".prev")?.addEventListener("click", () => {
  list.scrollBy({ left: -list.clientWidth * 0.8, behavior: "smooth" });
});