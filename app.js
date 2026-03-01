const app = document.getElementById("app");
const backBtn = document.getElementById("backBtn");

const dias = [
  { nombre: "Día 1 - Pecho" },
  { nombre: "Día 2 - Espalda" },
  { nombre: "Día 3 - Pierna" },
  { nombre: "Día 4 - Pecho Volumen" },
  { nombre: "Día 5 - Espalda Grosor" },
  { nombre: "Día 6 - Pierna Completa" }
];

function renderHome() {
  backBtn.style.display = "none";
  app.innerHTML = "";

  dias.forEach((dia, index) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h2>${dia.nombre}</h2>
      <button onclick="renderDia(${index})">Entrar</button>
    `;

    app.appendChild(card);
  });
}

function renderDia(index) {
  backBtn.style.display = "block";
  app.innerHTML = "";

  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <h2>${dias[index].nombre}</h2>
    <p>Ejemplo de ejercicio</p>
    <img src="assets/gifs/press_inclinado_barra.gif" />
    <button onclick="iniciarTimer(60)">Iniciar descanso 60s</button>
    <h2 id="timerDisplay">60</h2>
  `;

  app.appendChild(card);
}

let tiempo = 0;
let intervalo;

function iniciarTimer(segundos) {
  tiempo = segundos;
  const display = document.getElementById("timerDisplay");
  const sonido = new Audio("assets/sounds/finish.mp3");

  clearInterval(intervalo);

  intervalo = setInterval(() => {
    tiempo--;
    display.textContent = tiempo;

    if (tiempo <= 0) {
      clearInterval(intervalo);
      sonido.play();
    }
  }, 1000);
}

renderHome();