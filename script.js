// Se validen al enviar formulario
// 2 apartados correos y psicologico
// apartado correos 25 preguntas y 5 de lo otro
// boton hacer otro test
// validacion visual cuando se corrigen


let preguntas = [];

async function cargarPreguntas() {
  try {
    const res = await fetch('examenes.json');

    if (!res.ok) {
      throw new Error(`Error al cargar el JSON: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    preguntas = data;
    generarNuevoTest(); // Llama a tu función para generar el test

  } catch (error) {
    console.error("Hubo un problema al cargar las preguntas:", error);
    document.getElementById("test-container").innerHTML = `
      <p style="color: red;"><strong>Error al cargar el test. Intenta recargar la página.</strong></p>
    `;
  }
}

cargarPreguntas();

    let seleccionadas = [];

    function shuffle(arr) {
      return [...arr].sort(() => Math.random() - 0.5);
    }

    function generarNuevoTest() {
      const container = document.getElementById("test-container");
      const resultado = document.getElementById("resultado");

      container.innerHTML = "";     // Limpia el test anterior
      resultado.innerText = "";     // Limpia el resultado

      const tema1 = shuffle(preguntas.filter(p => p.tema === "tema1")).slice(0, 25);//cambiar a 25
      const tema2 = shuffle(preguntas.filter(p => p.tema === "tema2")).slice(0, 5);//cambiar a 5

      seleccionadas = [...tema1, ...tema2];

      seleccionadas.forEach((p, i) => {
        const div = document.createElement("div");
        div.className = "pregunta radio-button";
        div.dataset.id = p.id;
        div.innerHTML = `
          <p><strong>${i + 1}. ${p.pregunta}</strong></p>
          ${p.opciones.map(op => `
            <label class="radio-button__label" >
              <input type="radio" class="radio-button__input" name="p-${p.id}" value="${op}"><span class="radio-button__custom"></span>
             <span class="radio-button__text">${op}</span>
            </label><br>
          `).join("")}
        `;
        container.appendChild(div);
      });
    }
    

   function corregir() {
  let correctas = 0;

  seleccionadas.forEach(p => {
    const preguntaDiv = document.querySelector(`.pregunta[data-id="${p.id}"]`);
    const seleccionada = document.querySelector(`input[name="p-${p.id}"]:checked`);

    preguntaDiv.classList.remove("acierto", "fallo");

    // Elimina feedback previo si existe
    preguntaDiv.querySelectorAll('.feedback').forEach(el => el.remove());

    const inputs = preguntaDiv.querySelectorAll(`input[name="p-${p.id}"]`);


    inputs.forEach(input => {
      input.disabled = true; // deshabilitamos la opción para no cambiar

      const label = input.parentElement;
      // Quitar cualquier icono previo
      label.querySelectorAll('.feedback').forEach(el => el.remove());

      if (input.value === p.respuestaCorrecta) {
        // Añadimos ✔️ verde para la respuesta correcta
        const checkMark = document.createElement('span');
        checkMark.textContent = ' ✔️';
        checkMark.className = 'feedback';
        
        label.appendChild(checkMark);
      }

      if (seleccionada && input === seleccionada && input.value !== p.respuestaCorrecta) {
        // Añadimos ❌ rojo para la respuesta seleccionada incorrecta
        const crossMark = document.createElement('span');
        crossMark.textContent = ' ❌';
        crossMark.className = 'feedback';
      
        label.appendChild(crossMark);
      }
    });

    if (seleccionada && seleccionada.value === p.respuestaCorrecta) {
      correctas++;
      preguntaDiv.classList.add("acierto");
    } else {
      preguntaDiv.classList.add("fallo");
    }
  });

  document.getElementById("resultado").innerText = `Has acertado ${correctas} de ${seleccionadas.length}`;
}