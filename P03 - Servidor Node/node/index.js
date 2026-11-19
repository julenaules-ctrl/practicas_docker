import express from 'express'
//import mongoose from 'mongoose'

//const Animal = mongoose.model('Animal', new mongoose.Schema({
//  tipo: String,
//  estado: String,
//}))

const app = express()

//mongoose.connect('mongodb://usuario:password@servidor:puerto/miapp?authSource=admin')


// Ejemplos profe
app.get('/', async (_req, res) => {
  console.log('listando...')
  //const animales = await Animal.find();
  return res.send('Hola mundo Julen!')
})

app.get('/alumno/:id', async (_req, res) => {
  const id = _req.params.id;
  console.log(`Consultando alumno ${id}`)
  return res.send(`Alumno Favorito: ${id}`)
}) 

app.get('/buscar', async (_req, res) => {
  const nombre = _req.query.nombre;
  console.log(`Buscando alumno ${nombre}`)
  return res.send(`Te he encontrado: ${nombre}`)
})

//Ejemplos alumnos
app.get('/suma', async (_req, res) => {
  const op1 = Number(_req.query.op1);
  const op2 = Number(_req.query.op2);

  console.log(`Sumando ${op1} + ${op2}...`)

  return res.send(`Resultado: ${op1} + ${op2} = ${op1 + op2}`)
})

app.get('/resta', async (_req, res) => {
  const op1 = Number(_req.query.op1);
  const op2 = Number(_req.query.op2);

  console.log(`Resta ${op1} - ${op2}...`)

  return res.send(`Resultado: ${op1} - ${op2} = ${op1 - op2}`)
})

app.get('/comparar', async (_req, res) => {
  let txt1 = _req.query.txt1;
  let txt2 = _req.query.txt2;
  let resultado = "";

  console.log(`Comparando ${txt1} y ${txt2}...`)
  if(txt1 == txt2) resultado = "Son iguales";
  else resultado = "NO son iguales";

  return res.send(`${txt1} y ${txt2}: ${resultado}`)
})

app.get('/examenes', async (_req, res) => {
  const nombre = _req.query.nombre;
  let info;
  let resultado = "";

  console.log(`Buscando informacion sobre el examen de ${nombre}...`)
  switch(nombre) {
    case "Acceso a datos":
      info = new Date(2026, 11, 1);
      break;
    case "Desarrollo de Interfaces":
      info = new Date(2026, 12, 5)
      break;
    case "Programación multimedia":
      info = new Date(2026, 11, 27)
      break;
    default:
      info = null;
      break;
  }
  if (info == null) resultado = "Asignatura no encontrada";
  else resultado = info.toLocaleDateString("es-ES", { dateStyle: "long" });


  return res.send(`El examen de ${nombre} es el dia ${resultado}`)
})

//app.get('/crear', async (_req, res) => {
//  console.log('creando...')
//  await Animal.create({ tipo: 'animalico', estado: 'Feliz' })
//  return res.send('ok')
//})

app.listen(3000, () => console.log('listening...'))