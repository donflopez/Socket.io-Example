
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

//Declaramos una variable con el número de clicks.
var clicks = 0;

app.get('/', routes.index);

//Asignamos a server la creación del servidor http.
var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

//Importamos socket.io utilizando el servidor creado anteriormente.
var io = require('socket.io').listen(server);

//Iniciamos la conexión.
io.sockets.on('connection', function(socket){
  //Emitimos nuestro evento connected
  socket.emit('connected');

  //Permanecemos a la escucha del evento click
  socket.on('click', function(){
    //Sumamos el click
    clicks++;

    //Emitimos el evento que dirá al cliente que hemos recibido el click
    //y el número de clicks que llevamos
    socket.emit('otherClick', clicks);
  });
});