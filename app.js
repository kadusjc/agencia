var express = require('express')
, http = require('http')
, db   = require('./models')
, load = require('express-load')
, path = require('path')
, logfmt = require('logfmt')
, favicon = require('static-favicon')
, cookieParser = require('cookie-parser')
, compress = require('compression')
, bodyParser = require('body-parser')
, app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logfmt.requestLogger());
app.use(favicon());
app.use(compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

load('controllers')
  .then('routes')
  .into(app);

var port = Number(process.env.PORT || 3000);

db
  .sequelize
  .sync({ force: true })
  .complete(function(err) {
    if (err) {
      throw err[0]
    } else {
      http.createServer(app).listen(port, function(){
        console.log('Agencia do Namoro Gay running on port ' + port);
      })
    }
  });

module.exports = app;
