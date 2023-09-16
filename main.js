const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
//const {MongoClient} = require('mongodb');
app.use((req, res, next) => {
  const logData = `${new Date().toISOString()} - ${req.method} ${req.originalUrl}\n`;

  fs.appendFile(path.join(__dirname, 'log.txt'), logData, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    }
  });

  next();
});
const mongoose = require('mongoose');
const connection ='mongodb://127.0.0.1:27017/movies';
mongoose.connect(connection)
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});
const movieSchema = new mongoose.Schema({name:String,year:Number});
const Movie= mongoose.model('movie',movieSchema);
app.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  }
  catch (e){
    res.status(500);
    }
 });
 app.post('/movies', async (req, res) => {
  const {name, year} = req.body;
try {
const movie= new Movie( {name, year});
await movie.save();
res.status(201).json(movie);
}
catch (e){
res.status(500);
}
 });
 app.get('/movies/:id', async (req, res) => {
  const {id }=req.params;
  try {
    const movie = await Movie.findById(id);
    if(movie==null){
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.json(movie);
  }
  catch (e){
    res.status(500);
    }
 });
 app.delete('/movies/:id', async (req, res) => {
  const {id }=req.params;
  try {
    const movie = await Movie.findByIdAndRemove(id);
    if(movie==null){
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.json(movie);
  }
  catch (e){
    res.status(500);
    }
 });
 app.put('/movies/:id', async (req, res) => {
  const {id }=req.params;
  const{name,year}=req.body;
  try {
    const movie = await Movie.findByIdAndUpdate(id,{name,year});
    if(movie==null){
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.json(movie);
  }
  catch (e){
    res.status(500);
    }
 });

app.listen(4000,()=>{
  console.log('running on 4000');
});
