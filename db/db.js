const mongoose = require('mongoose')
var login ='mongodb://user:user@ds111791.mlab.com:11791/testing'
mongoose.connect(login)

var db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('were connected!')
});

module.exports = db
