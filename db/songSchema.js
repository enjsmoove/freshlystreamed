const Schema = require('mongoose').Schema
const mongoose = require('mongoose')

var SongSchema = new Schema({
id:String,
title:String,
artist:String,
description:String,
link:String,
url:String,
albumart:String,
album:String,
size:String,
speed:String,
counter:String,
time:String
})

 var Song = mongoose.model('Song',SongSchema)

module.exports =Song
