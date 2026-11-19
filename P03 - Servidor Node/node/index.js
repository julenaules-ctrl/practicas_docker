import express from 'express'
//import mongoose from 'mongoose'

//const Animal = mongoose.model('Animal', new mongoose.Schema({
//  tipo: String,
//  estado: String,
//}))

const app = express()

//mongoose.connect('mongodb://usuario:password@servidor:puerto/miapp?authSource=admin')

app.get('/', async (_req, res) => {
  console.log('listando...')
  //const animales = await Animal.find();
  return res.send('Hola mundo!')
})
//app.get('/crear', async (_req, res) => {
//  console.log('creando...')
//  await Animal.create({ tipo: 'animalico', estado: 'Feliz' })
//  return res.send('ok')
//})

app.listen(3000, () => console.log('listening...'))