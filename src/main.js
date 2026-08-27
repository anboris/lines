import { initCarousel } from "./modules/carousel.js";
import { initMarquee } from "./modules/marquee.js";
import { initNavigation } from "./modules/navigation.js";
import { initQuiz } from "./modules/quiz.js";

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initMarquee();
  initCarousel();
  initQuiz();
});
