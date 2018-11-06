const PORT_SERVER   =  6969;
const INIT_DATABASE = "postgres://postgres:NorjEpWy@localhost:5432/lentejasbd";

var net = require('net');
var pg  = require('pg');

//var objSensors={"device":1,"sensors":{"agua_temp":20.56,"ph":35.31,"lux":1240},"timestamp":"17/07/25,11:05:28-20"};

//CONEXION A LA BASE DE DATOS
var client_database = new pg.Client(INIT_DATABASE);

client_database.connect(function(err) {
  if(err) 
  {
    return console.error('could not connect to postgres', err);
  }
  else
  {
    console.log('connection succed!');
  }
});

net.createServer(function(sock)
{
  //MUESTRA LOS DATOS DE LA NUEVA CONEXCION
  console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
  sock.on('data', function(data) {
    //data = objSensors 
    console.log('DATA ' + sock.remoteAddress + ': ' + data);
    sock.write('You said "' + data + '"');
    data=JSON.parse(data);
    console.log(data['sensors']['agua_temp']);
    console.log("Tipo de dato: "+typeof(data));
    save_data(data).then((message)=>
    {
      console.log(message)
    }).then((data)=>
    {
      socket.end();
    });  
  });

    //EVENTO PARA CERRAR CONEXION CON SOCKET
    sock.on('close', function(data) 
    {
      console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
    });
}).listen(PORT_SERVER, function(){
  console.log('Server listening on ' + PORT_SERVER);
});

function save_data(data)
{
  return new Promise((resolve, reject) => {
    client_database.query("INSERT INTO sensors (ph, temp, light, date, device) VALUES ("+
    data['ph']+", "+
    data['agua_temp']+", "+
    data['lux']+", "+
    data['timestamp']+", "+
    data["device"]+")", 
    function(err, result)
    {
      if(err) 
      {
        resolve('error running query');
      }
      resolve('Save data');
    });
  })
}

/*
//console.log('Server listening on ' + PORT_SERVER);


function timeStamp() {
// Create a date object with the current time
  var now = new Date();

// Create an array with the current month, day and time
  var date = [  now.getFullYear(), now.getMonth() + 1, now.getDate()];
    //var date = [now.getMonth() + 1 , now.getDate(),  now.getFullYear() ];

// Create an array with the current hour, minute and second
  var time = [ now.getHours(+1), now.getMinutes(), now.getSeconds() ];

// Determine AM or PM suffix based on the hour
  var suffix = ( time[0] < 12 ) ? "AM" : "PM";

// Convert hour from military time
  //time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;

// If hour is 0, set it to 12
  //time[0] = time[0] || 12;

// If seconds and minutes are less than 10, add a zero
  for ( var i = 1; i < 3; i++ ) {
    if ( time[i] < 10 ) {
      time[i] = "0" + time[i];
    }
  }

// Return the formatted string
  return date.join("-") + " " + time.join(":");// + " " + suffix;
}
*/