const app = document.getElementById("app");
const backBtn = document.getElementById("backBtn");
const scrollBtn = document.getElementById("scrollTopBtn");

let intervalo = null;
let tiempoRestante = 0;
let timerActivoId = null;
let pausado = false;

const sonido = new Audio("assets/sounds/finish.mp3");

const rutina = [
  {
    nombre: "DÍA 1 – PECHO PRIORIDAD + ANTEBRAZO",
    ejercicios: [
      { nombre: "Press inclinado barra", series: "4", reps: "6–8", descanso: 180 },
      { nombre: "Press plano mancuernas", series: "3", reps: "8–10", descanso: 120 },
      { nombre: "Cruces en polea", series: "4", reps: "12–15", descanso: 90 },
      { nombre: "Elevaciones laterales", series: "5", reps: "15–20", descanso: 60 },
      { nombre: "Fondos inclinados", series: "3", reps: "8–12", descanso: 90 },
      { nombre: "Curl muñeca barra", series: "3", reps: "15–20", descanso: 60 },
      { nombre: "Curl muñeca inverso", series: "3", reps: "15–20", descanso: 45 }
    ]
  },
  {
    nombre: "DÍA 2 – ESPALDA ANCHURA + BÍCEPS",
    ejercicios: [
      { nombre: "Dominadas", series: "4", reps: "6–10", descanso: 120 },
      { nombre: "Jalón abierto", series: "3", reps: "8–12", descanso: 90 },
      { nombre: "Remo barra", series: "3", reps: "6–8", descanso: 120 },
      { nombre: "Curl barra", series: "3", reps: "8–10", descanso: 90 },
      { nombre: "Curl inclinado", series: "3", reps: "10–12", descanso: 60 },
      { nombre: "Farmer walk", series: "3", reps: "30–40 seg", descanso: 60 }
    ]
  },
  {
    nombre: "DÍA 3 – PIERNA + PANTORRILLA FUERTE",
    ejercicios: [
      { nombre: "Sentadilla", series: "4", reps: "5–8", descanso: 180 },
      { nombre: "Prensa", series: "3", reps: "8–12", descanso: 120 },
      { nombre: "Extensión cuádriceps", series: "3", reps: "12–15", descanso: 90 },
      { nombre: "Curl femoral", series: "4", reps: "10–12", descanso: 90 },
      { nombre: "Pantorrilla en prensa", series: "4", reps: "15–20", descanso: 60 },
      { nombre: "Pantorrilla de pie", series: "4", reps: "12–15", descanso: 60 }
    ]
  },
  {
    nombre: "DÍA 4 – PECHO VOLUMEN + HOMBRO 3D",
    ejercicios: [
      { nombre: "Press inclinado mancuernas", series: "4", reps: "8–10", descanso: 120 },
      { nombre: "Press plano barra", series: "3", reps: "6–8", descanso: 120 },
      { nombre: "Aperturas", series: "3", reps: "12–15", descanso: 90 },
      { nombre: "Elevaciones laterales", series: "6", reps: "15–20", descanso: 60 },
      { nombre: "Pájaros (posterior)", series: "4", reps: "12–15", descanso: 90 },
      { nombre: "Curl martillo cruzado", series: "3", reps: "10–12", descanso: 60 }
    ]
  },
  {
    nombre: "DÍA 5 – ESPALDA GROSOR + BÍCEPS + ANTEBRAZO",
    ejercicios: [
      { nombre: "Peso muerto rumano", series: "3", reps: "6–8", descanso: 180 },
      { nombre: "Remo polea", series: "3", reps: "8–12", descanso: 90 },
      { nombre: "Jalón neutro", series: "3", reps: "10–12", descanso: 90 },
      { nombre: "Curl predicador", series: "3", reps: "10–12", descanso: 60 },
      { nombre: "Curl martillo", series: "3", reps: "10–12", descanso: 60 },
      { nombre: "Curl reverso barra", series: "3", reps: "12–15", descanso: 60 }
    ]
  },
  {
    nombre: "DÍA 6 – PIERNA COMPLETA + PANTORRILLA",
    ejercicios: [
      { nombre: "Hack o sentadilla", series: "4", reps: "6–8", descanso: 180 },
      { nombre: "Zancadas", series: "3", reps: "10–12", descanso: 90 },
      { nombre: "Curl femoral", series: "3", reps: "12", descanso: 90 },
      { nombre: "Extensión", series: "3", reps: "12–15", descanso: 60 },
      { nombre: "Pantorrilla sentado", series: "4", reps: "15–20", descanso: 60 },
      { nombre: "Pantorrilla de pie", series: "4", reps: "12–15", descanso: 60 }
    ]
  }
];

function renderHome() {
  backBtn.style.display = "none";
  app.innerHTML = "";

  rutina.forEach((dia, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h2>${dia.nombre}</h2>
      <button onclick="renderDia(${i})">Entrar</button>
    `;
    app.appendChild(card);
  });
}

function renderDia(index) {
  backBtn.style.display = "block";
  app.innerHTML = `<h2>${rutina[index].nombre}</h2>`;

  rutina[index].ejercicios.forEach((ej, i) => {
    const id = "timer_" + index + "_" + i;
    const gifNombre = ej.nombre.toLowerCase().replace(/\s/g, "_").replace(/[()]/g, "");

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="assets/gifs/${gifNombre}.gif" onerror="this.style.display='none'">
      <h3>${ej.nombre}</h3>
      <p><strong>Series:</strong> ${ej.series}</p>
      <p><strong>Reps:</strong> ${ej.reps}</p>
      <button onclick="iniciarTimer(${ej.descanso}, '${id}')">Descanso</button>
      <button onclick="pausarTimer()">Pausa / Reanudar</button>
      <h2 id="${id}"></h2>
    `;
    app.appendChild(card);
  });
}

function iniciarTimer(segundos, id) {
  clearInterval(intervalo);
  pausado = false;
  tiempoRestante = segundos;
  timerActivoId = id;

  actualizarTimer();

  intervalo = setInterval(() => {
    if (!pausado) {
      tiempoRestante--;
      actualizarTimer();

      if (tiempoRestante <= 0) {
        clearInterval(intervalo);
        sonido.play();
      }
    }
  }, 1000);
}

function actualizarTimer() {
  const el = document.getElementById(timerActivoId);
  if (!el) return;

  const min = Math.floor(tiempoRestante / 60);
  const seg = tiempoRestante % 60;
  el.textContent = `${min}:${seg < 10 ? "0" : ""}${seg}`;

  if (tiempoRestante <= 10) {
    el.style.color = "red";
  } else {
    el.style.color = "";
  }
}

function pausarTimer() {
  pausado = !pausado;
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

window.onscroll = function () {
  if (document.documentElement.scrollTop > 300) {
    scrollBtn.style.display = "block";
  } else {
    scrollBtn.style.display = "none";
  }
};

renderHome();