const express = require('express');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpack = require('webpack');
// const webpackConfig = require('./webpack.config.js');
const jsonp = require('jsonp-fallback')
const request = require('then-jsonp')
const app = express();
const db= require('./db/db')
const axios = require('axios')
const Song = require('./db/songSchema')
// const compiler = webpack(webpackConfig);
const bodyParser = require('body-parser')
var rp = require('request-promise');
app.use(express.static(__dirname + '/www'));
app.use(bodyParser.json())
// app.use(webpackDevMiddleware(compiler, {
//   hot: true,
//   filename: 'bundle.js',
//   publicPath: '/',
//   stats: {
//     colors: true,
//   },
//   historyApiFallback: true,
// }));
var jQuery11110801340709435391_1517564576425 = (data) =>{
  console.log(data)
  data = data.substring(41,data.length-1)
  console.log(JSON.stringify(data))
  return JSON.stringify(data)
}
var call = 'jQuery11110801340709435391_1517564576425'
app.set('jsonp callback name', call);
app.get('/s/:query',function(req,res){
  var query = req.params.query
  console.log('searching '+query)
  var endpoint = 'https://databrainz.com/api/search_api.cgi?jsoncallback=jQuery11110801340709435391_1517564576425&qry='+query+'&format=json&mh=50&where=mpl&r=&y=0721190802155c415d5c40545d415f59405b5d49585e455f5441&_=1517564576430'
  var options = {
    uri: endpoint,
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response
  };

  rp(options)
    .then(response=>{
      if(!response){
        return res.send([])
      }
      response = response.substring(41,response.length-1)
      console.log('['+response+']')
      res.send(response)
      // console.log(err)
    })
})
app.get('/songs',(req,res)=>{
  Song.find((err,songs)=>{
    if(err) return console.error(err)
    console.log(songs)
    res.send(songs)
  })
})
app.delete('/songs',(req,res)=>{
  Song.deleteMany({},err=>{
    if(err) return console.error(err)
    res.send('Cleared table')
  })
})
app.delete('/song/:id',(req,res)=>{
  var id = req.params.id
  Song.deleteOne({id:id})
    .then(respond=>{
      res.send(respond)
      // Song.find({$where:'this.title.length>0'})
      //   .then(respond=>{
      //     console.log('get me something ',respond)
      //   })
      // console.log(songs)
    }).catch(err=>{
      console.log('error deleting',err)
      res.status(500).send(err)
    })
})
app.get('/song/:id',(req,res)=>{
  var query = req.params.id
  var endpoint='http://databrainz.com/api/data_api_new.cgi?jsoncallback=jQuery111103918095124353549_1520236403361&id='+query+'&r=mpl&format=json'
  jsonp(endpoint)
    .then(results=>{
      res.send(results)
    }).catch(err=>{
      console.log(err)
      res.send(err)
    })

})
app.post('/add/',(req,res)=>{
console.log('got song',req.body)
  // var song = new Song(req.body)
  var song = req.body
  song['id']=req.body.url
  // console.log(song)
  Song.create(song,(err,song)=>{
    if(err) return res.status(200).send(err)
    res.status(200).send(song)
  })

})

// app.
module.exports = app
