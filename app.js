import { jsPDF } from "https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js";

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
    inputNombre.disabled = item.nombre.trim() !== "";
    inputNombre.oninput = (e) => {
      datos[idx].nombre = e.target.value;
    };
    celdaNombre.appendChild(inputNombre);

    const celdaPago = document.createElement("td");
    const checkPago = document.createElement("input");
    checkPago.type = "checkbox";
    checkPago.checked = item.pagado;
    checkPago.onchange = (e) => {
      datos[idx].pagado = e.target.checked;
    };
    celdaPago.appendChild(checkPago);

    const celdaAccion = document.createElement("td");
    const btnDesbloquear = document.createElement("button");
    btnDesbloquear.textContent = "Desbloquear";
    btnDesbloquear.onclick = () => {
      inputNombre.disabled = false;
      datos[idx].nombre = "";
      inputNombre.value = "";
    };
    celdaAccion.appendChild(btnDesbloquear);

    fila.appendChild(celdaNum);
    fila.appendChild(celdaNombre);
    fila.appendChild(celdaPago);
    fila.appendChild(celdaAccion);
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

async function generarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text("Listado de Números de Rifa - Bisutería", 10, 10);

  const headers = [["Número", "Nombre", "Pagado"]];
  const rows = datos.map(d => [
    d.numero,
    d.nombre || "Disponible",
    d.pagado ? "Sí" : "No"
  ]);

  doc.autoTable({
    head: headers,
    body: rows,
    startY: 20
  });

  doc.save("rifa_bisuteria.pdf");
}

function exportarCSV() {
  const csv = ["Número,Nombre,Pagado"];
  datos.forEach(d => {
    csv.push(`${d.numero},"${d.nombre}",${d.pagado ? "Sí" : "No"}`);
  });
  const blob = new Blob([csv.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "rifa_bisuteria.csv";
  a.click();
}

window.onload = inicializar;