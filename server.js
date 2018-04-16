const app = require('./server-config')

app.listen(process.env.PORT || 2009)
console.log('listening on port 2009')
