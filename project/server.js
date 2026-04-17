const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("publico"));

const ARCHIVO_DATOS = "./data/datos.json";

if (!fs.existsSync(ARCHIVO_DATOS)) {
  fs.writeFileSync(ARCHIVO_DATOS, "[]");
}

app.post("/enviar", (req, res) => {
  const { nombre, correo, mensaje } = req.body;

  const datos = JSON.parse(fs.readFileSync(ARCHIVO_DATOS));
  datos.push({ nombre, correo, mensaje });

  fs.writeFileSync(ARCHIVO_DATOS, JSON.stringify(datos, null, 2));

  res.send("Formulario enviado correctamente");
});

app.get("/datos", (req, res) => {
  const datos = JSON.parse(fs.readFileSync(ARCHIVO_DATOS));
  res.json(datos);
});

app.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");
});