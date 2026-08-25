import { initMarquee } from "./modules/marquee.js";
import { initNavigation } from "./modules/navigation.js";

import "./assets/css/marquee.css";

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initMarquee();
});
