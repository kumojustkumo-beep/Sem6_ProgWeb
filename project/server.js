const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("publico"));

const ARCHIVO_DATOS = path.join(__dirname, "data", "datos.json");

if (!fs.existsSync(ARCHIVO_DATOS)) {
  fs.writeFileSync(ARCHIVO_DATOS, "[]");
}

function leerDatos() {
  try {
    const contenido = fs.readFileSync(ARCHIVO_DATOS, "utf-8");
    return JSON.parse(contenido);
  } catch (error) {
    console.error("Error leyendo datos:", error);
    return [];
  }
}

function guardarDatos(datos) {
  try {
    fs.writeFileSync(ARCHIVO_DATOS, JSON.stringify(datos, null, 2));
  } catch (error) {
    console.error("Error guardando datos:", error);
  }
}

function agregarSolicitud(solicitud) {
  const datos = leerDatos();
  datos.push(solicitud);
  guardarDatos(datos);
}

function listarSolicitudes() {
  return leerDatos();
}

app.post("/enviar", (req, res) => {
  const { nombre, correo, mensaje } = req.body;

  if (!nombre || !correo) {
    return res.status(400).send("Faltan datos obligatorios");
  }

  const nuevaSolicitud = {
    nombre,
    correo,
    mensaje: mensaje || "",
    fecha: new Date().toISOString()
  };

  agregarSolicitud(nuevaSolicitud);

  res.send("Formulario enviado correctamente");
});

app.get("/datos", (req, res) => {
  const datos = listarSolicitudes();
  res.json(datos);
});

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
