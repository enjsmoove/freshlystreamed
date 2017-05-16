const app = require('./server-config')

app.listen(process.env.PORT || 2003)
console.log('listening on port 2003')
