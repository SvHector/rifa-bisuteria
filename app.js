let datos = [];

function inicializar() {
  const almacenados = localStorage.getItem("rifa");
  if (almacenados) {
    datos = JSON.parse(almacenados);
  } else {
    datos = Array.from({ length: 100 }, (_, i) => ({
      numero: i.toString().padStart(2, "0"),
      nombre: "",
      pagado: false,
    }));
  }
  renderizarTabla(datos);
}

function renderizarTabla(lista) {
  const tbody = document.querySelector("#tabla tbody");
  tbody.innerHTML = "";
  lista.forEach((item, idx) => {
    const fila = document.createElement("tr");

    const celdaNum = document.createElement("td");
    celdaNum.textContent = item.numero;

    const celdaNombre = document.createElement("td");
    const inputNombre = document.createElement("input");
    inputNombre.type = "text";
    inputNombre.value = item.nombre;
    inputNombre.oninput = (e) => { datos[idx].nombre = e.target.value; };
    celdaNombre.appendChild(inputNombre);

    const celdaPago = document.createElement("td");
    const checkPago = document.createElement("input");
    checkPago.type = "checkbox";
    checkPago.checked = item.pagado;
    checkPago.onchange = (e) => { datos[idx].pagado = e.target.checked; };
    celdaPago.appendChild(checkPago);

    fila.appendChild(celdaNum);
    fila.appendChild(celdaNombre);
    fila.appendChild(celdaPago);
    tbody.appendChild(fila);
  });
}

function guardarDatos() {
  localStorage.setItem("rifa", JSON.stringify(datos));
  alert("Datos guardados.");
}

function filtrar(tipo) {
  if (tipo === "todos") {
    renderizarTabla(datos);
  } else if (tipo === "libres") {
    renderizarTabla(datos.filter(d => d.nombre.trim() === ""));
  } else if (tipo === "ocupados") {
    renderizarTabla(datos.filter(d => d.nombre.trim() !== ""));
  }
}

function generarPDF() {
  let texto = "Listado de Rifa de Bisutería\n\n";
  datos.forEach(d => {
    texto += `${d.numero} - ${d.nombre || "Disponible"} - ${d.pagado ? "Pagado" : "Pendiente"}\n`;
  });

  const blob = new Blob([texto], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "rifa_bisuteria.pdf";
  a.click();
}

window.onload = inicializar;