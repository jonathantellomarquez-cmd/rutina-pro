const app = document.getElementById("app");

let timers = {};
const sonidoFin = new Audio("assets/sounds/finish.mp3");

// ================= RUTINA =================

const rutina = {
  dia1: {
    titulo: "Día 1 – Pecho prioridad + Antebrazo",
    ejercicios: [
      { nombre: "Press inclinado barra", musculo: "Pecho", gif: "press_inclinado_barra.gif", series: 4, repsMin: 6, repsMax: 8, descanso: 180 },
      { nombre: "Press plano mancuernas", musculo: "Pecho", gif: "press_plano_mancuernas.gif", series: 3, repsMin: 8, repsMax: 10, descanso: 120 },
      { nombre: "Cruces en polea", musculo: "Pecho", gif: "cruces_polea.gif", series: 4, repsMin: 12, repsMax: 15, descanso: 90 },
      { nombre: "Elevaciones laterales", musculo: "Hombro", gif: "elevaciones_laterales.gif", series: 5, repsMin: 15, repsMax: 20, descanso: 60 },
      { nombre: "Fondos inclinados", musculo: "Pecho", gif: "fondos_inclinados.gif", series: 3, repsMin: 8, repsMax: 12, descanso: 90 }
    ]
  },

  dia2: {
    titulo: "Día 2 – Espalda anchura + Bíceps",
    ejercicios: [
      { nombre: "Dominadas", musculo: "Espalda", gif: "dominadas.gif", series: 4, repsMin: 6, repsMax: 10, descanso: 120 },
      { nombre: "Jalón abierto", musculo: "Espalda", gif: "jalon_abierto.gif", series: 3, repsMin: 8, repsMax: 12, descanso: 90 },
      { nombre: "Remo barra", musculo: "Espalda", gif: "remo_barra.gif", series: 3, repsMin: 6, repsMax: 8, descanso: 120 },
      { nombre: "Curl barra", musculo: "Biceps", gif: "curl_barra.gif", series: 3, repsMin: 8, repsMax: 10, descanso: 90 }
    ]
  },

  dia3: {
    titulo: "Día 3 – Pierna fuerte",
    ejercicios: [
      { nombre: "Sentadilla", musculo: "Pierna", gif: "sentadilla.gif", series: 4, repsMin: 5, repsMax: 8, descanso: 180 },
      { nombre: "Prensa", musculo: "Pierna", gif: "prensa.gif", series: 3, repsMin: 8, repsMax: 12, descanso: 120 },
      { nombre: "Curl femoral", musculo: "Pierna", gif: "curl_femoral.gif", series: 4, repsMin: 10, repsMax: 12, descanso: 90 }
    ]
  },

  dia4: {
    titulo: "Día 4 – Pecho volumen + Hombro",
    ejercicios: [
      { nombre: "Press plano barra", musculo: "Pecho", gif: "press_plano_barra.gif", series: 3, repsMin: 6, repsMax: 8, descanso: 120 },
      { nombre: "Aperturas", musculo: "Pecho", gif: "aperturas.gif", series: 3, repsMin: 12, repsMax: 15, descanso: 90 }
    ]
  },

  dia5: {
    titulo: "Día 5 – Espalda grosor",
    ejercicios: [
      { nombre: "Peso muerto rumano", musculo: "Espalda", gif: "peso_muerto_rumano.gif", series: 3, repsMin: 6, repsMax: 8, descanso: 180 }
    ]
  },

  dia6: {
    titulo: "Día 6 – Pierna completa",
    ejercicios: [
      { nombre: "Zancadas", musculo: "Pierna", gif: "zancadas.gif", series: 3, repsMin: 10, repsMax: 12, descanso: 120 }
    ]
  }
};

// ================= HOME =================

function renderHome() {
  app.innerHTML = "";

  Object.keys(rutina).forEach(diaKey => {
    const dia = rutina[diaKey];

    app.innerHTML += `
      <div class="card">
        <h2>${dia.titulo}</h2>
        <button onclick="renderDia('${diaKey}')">Entrar</button>
      </div>
    `;
  });

  app.innerHTML += `
    <div class="card">
      <h2>Estadísticas</h2>
      <button onclick="renderStats()">Ver estadísticas</button>
    </div>
  `;
}

// ================= MOSTRAR DÍA =================

function renderDia(diaKey) {
  const dia = rutina[diaKey];
  app.innerHTML = `<h2>${dia.titulo}</h2>`;

  dia.ejercicios.forEach(ej => {

    const pesoGuardado = localStorage.getItem(ej.nombre + "_peso") || "";
    const prGuardado = localStorage.getItem(ej.nombre + "_pr") || 0;

    app.innerHTML += `
      <div class="card">
        <img src="assets/gifs/${ej.gif}">
        <h3>${ej.nombre}</h3>
        <p>${ej.series} series – ${ej.repsMin}-${ej.repsMax} reps</p>
        <p>PR actual: ${prGuardado} kg</p>
        <p>Descanso: ${ej.descanso} seg</p>

        <input type="number"
          placeholder="Peso máximo hoy (kg)"
          value="${pesoGuardado}"
          id="${ej.nombre}">

        <button onclick="guardarPeso('${ej.nombre}')">Guardar</button>

        <div>
          <button onclick="iniciarTimer('${ej.nombre}', ${ej.descanso})">Iniciar</button>
          <button onclick="pausarTimer('${ej.nombre}')">Pausar</button>
        </div>

        <h2 id="timer_${ej.nombre}">00:00</h2>
      </div>
    `;
  });

  app.innerHTML += `<button onclick="renderHome()">Volver</button>`;
}

// ================= GUARDAR PESO =================

function guardarPeso(nombre) {
  const input = document.getElementById(nombre);
  const peso = parseFloat(input.value);
  if (!peso) return;

  localStorage.setItem(nombre + "_peso", peso);

  const prActual = parseFloat(localStorage.getItem(nombre + "_pr")) || 0;

  if (peso > prActual) {
    localStorage.setItem(nombre + "_pr", peso);
  }
}

// ================= TIMER =================

function iniciarTimer(nombre, segundos) {

  if (!timers[nombre]) {
    timers[nombre] = {
      tiempo: segundos,
      intervalo: null,
      pausado: false
    };
  }

  if (timers[nombre].intervalo) {
    clearInterval(timers[nombre].intervalo);
  }

  timers[nombre].pausado = false;

  timers[nombre].intervalo = setInterval(() => {

    if (!timers[nombre].pausado) {
      timers[nombre].tiempo--;
      actualizarDisplay(nombre);

      if (timers[nombre].tiempo <= 0) {
        clearInterval(timers[nombre].intervalo);
        sonidoFin.currentTime = 0;
        sonidoFin.play();
      }
    }

  }, 1000);

  actualizarDisplay(nombre);
}

function pausarTimer(nombre) {
  if (timers[nombre]) {
    timers[nombre].pausado = true;
  }
}

function actualizarDisplay(nombre) {

  const tiempo = timers[nombre]?.tiempo || 0;

  const minutos = Math.floor(tiempo / 60);
  const segundos = tiempo % 60;

  const formato =
    String(minutos).padStart(2, "0") +
    ":" +
    String(segundos).padStart(2, "0");

  const display = document.getElementById("timer_" + nombre);
  if (display) {
    display.textContent = formato;
  }
}

// ================= ESTADÍSTICAS =================

function renderStats() {

  let volumenPorMusculo = {};

  Object.values(rutina).forEach(dia => {
    dia.ejercicios.forEach(ej => {

      const peso = parseFloat(localStorage.getItem(ej.nombre + "_peso")) || 0;

      if (peso > 0) {

        const repsProm = (ej.repsMin + ej.repsMax) / 2;
        const volumen = ej.series * repsProm * peso;

        if (!volumenPorMusculo[ej.musculo]) {
          volumenPorMusculo[ej.musculo] = 0;
        }

        volumenPorMusculo[ej.musculo] += volumen;
      }
    });
  });

  app.innerHTML = `<h2>Estadísticas</h2>`;

  Object.keys(volumenPorMusculo).forEach(musculo => {
    app.innerHTML += `
      <div class="card">
        <h3>${musculo}</h3>
        <p>Volumen estimado: ${volumenPorMusculo[musculo].toFixed(0)} kg</p>
      </div>
    `;
  });

  app.innerHTML += `<button onclick="renderHome()">Volver</button>`;
}

renderHome();

// ================= SERVICE WORKER =================

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}