let totalAcumulado = 0;
let clienteRegistrado = false;

function togglePlaca() {
    document.getElementById("placaDiv").style.display =
        document.getElementById("tienePlaca").value === "S" ? "block" : "none";
}

function showSnackbar(msg) {
    const sb = document.getElementById("snackbar");
    sb.textContent = msg;
    sb.classList.add("show");
    setTimeout(() => sb.classList.remove("show"), 2500);
}

function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function(m) {
        return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[m];
    });
}

function calcular() {
    let ruc = document.getElementById("ruc").value.trim();
    let placa = document.getElementById("placa").value.trim();
    let tienePlaca = document.getElementById("tienePlaca").value;

    let nombre = document.getElementById("nombre").value.trim();
    let cantidad = Number(document.getElementById("cantidad").value);
    let importe = Number(document.getElementById("importe").value);

    if (!ruc) return showSnackbar("Ingrese el RUC del cliente");
    if (!nombre || cantidad <= 0 || importe <= 0)
        return showSnackbar("Complete todos los campos del producto");

    if (!clienteRegistrado) {
        document.getElementById("infoCliente").innerHTML = `
            <strong>RUC:</strong> ${ruc}<br>
            <strong>Placa:</strong> ${tienePlaca === "S" ? placa : "No tiene"}
        `;
        clienteRegistrado = true;
    }

    let A = importe / cantidad;
    let SIGV = (A * 100) / 118;
    //let IGV = importe - (cantidad * SIGV);

    totalAcumulado += importe;
    actualizarTotal();

    const resultadosDiv = document.getElementById("resultados");
    const entry = document.createElement("div");
    entry.className = "result-box";

    entry.innerHTML = `
        <button class="btn-delete" onclick="eliminar(this, ${importe})">✖</button>
        <p><strong>Producto:</strong> ${escapeHtml(nombre)}</p>
        <p><strong>Cantidad:</strong> ${cantidad}</p>
        <p><strong>Valor unit SIN IGV:</strong> ${SIGV.toFixed(10)}</p>
        <p><strong>Total:</strong> ${importe.toFixed(2)}</p>
    `;

    //<p><strong>IGV:</strong> ${IGV.toFixed(10)}</p> muestra el igv si se desea, ponlo en innerHTML

    resultadosDiv.appendChild(entry);
    resultadosDiv.scrollTop = resultadosDiv.scrollHeight;

    document.getElementById("nombre").value = "";
    document.getElementById("cantidad").value = "";
    document.getElementById("importe").value = "";
    document.getElementById("nombre").focus();
}

function actualizarTotal() {
    document.getElementById("totalGeneral").textContent =
        "TOTAL ACUMULADO: " + totalAcumulado.toFixed(2);
}

function eliminar(btn, importe) {
    totalAcumulado -= importe;
    actualizarTotal();
    btn.parentElement.remove();
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("nombre").addEventListener("keydown", e => {
        if (e.key === "Enter") document.getElementById("cantidad").focus();
    });
    document.getElementById("cantidad").addEventListener("keydown", e => {
        if (e.key === "Enter") document.getElementById("importe").focus();
    });
    document.getElementById("importe").addEventListener("keydown", e => {
        if (e.key === "Enter") document.getElementById("btnCalcular").click();
    });
});
