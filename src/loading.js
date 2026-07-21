import { CONFIG } from "./config.js"
import { buildLoadingBuffer } from "./gallery.js";

const app = document.getElementById("app");

export function setupLoading() {
    app.innerHTML = `
    <p id="loading-status">001 / 260</p>
    <p id="author-mark">Elijah DeBusk</p>
    <p id="project-mark">${CONFIG.project}</p>
  `;

    setupConfigStyles();
    buildLoadingCube();

    buildLoadingBuffer();
}

function setupConfigStyles() {
    document.querySelector("*").setAttribute("style", `--bg: ${CONFIG.ink_color}; --accent: ${CONFIG.accent_color}; --ink: ${CONFIG.background_color};`);
}

function buildLoadingCube() {
    const loadingCube = document.createElement("div");
    loadingCube.classList.add("loading-cube");
    playAnim(loadingCube)
    app.appendChild(loadingCube);
  }

  let loadingActive = true;

  function playAnim(loadingCube) {
    if(!loadingActive) return;
    let anim = loadingCube.animate([
        { transform: "translate(-50%, -50%) rotate(0deg)" },
        { transform: "translate(-50%, -50%) rotate(90deg)", offset: 0.8},
        { transform: "translate(-50%, -50%) rotate(90deg)" }],
        {
          duration: 500,
          iterations: 1,
          fill: 'forwards',
          easing: 'ease-out'
        }
      )
    
      anim.onfinish = () => {
        playAnim(loadingCube)
      }
  }

  export function stopLoadingAnim() {
    loadingActive = false;
  }