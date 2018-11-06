
var net=require('net');
var pg = require('pg');
var HOST_SERVER='127.0.0.1';
var PORT_SERVER=6969;

var conString = "postgres://postgres:NorjEpWy@localhost:5432/lentejasbd";

//var clientTCP=new net.Socket();
var host_client='127.0.0.1';
var port_client=9000;

var objSensors={"device":1,"sensors":{"agua_temp":20.56,"ph":35.31,"lux":1240},"timestamp":"17/07/25,11:05:28-20"};

//Conexión con la bd
var client = new pg.Client(conString);
client.connect(function(err) {
  if(err) {
    return console.error('could not connect to postgres', err);
  }
	else
	console.log('connection succed!');
  });

var serverTcp=net.createServer(function(sock)
{

  // We have a connection - a socket object is assigned to the connection automatically
    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);

    // Add a 'data' event handler to this instance of socket
    sock.on('data', function(data) {
        //data = objSensors 
        console.log('DATA ' + sock.remoteAddress + ': ' + data);
        sock.write('You said "' + data + '"');
        data=JSON.parse(data);
        console.log(data['sensors']['agua_temp']);
        console.log("Tipo de dato: "+typeof(data));
        var currentTime=data['timestamp'];
        /*var currentTime2="20"+(data['timestamp']);
	currentTime2=new Date(currentTime2);
	console.log("currentTime: "+currentTime );
	console.log("currentTime2: "+currentTime2 );*/
	//data['sensors']['ph'] = data['sensors']['ph']  <= 0 ? 6.00 : data['sensors]['ph'];

      client.query("INSERT INTO sensors (ph, temp, temp_agua, light, date, device) VALUES ("+data['sensors']['ph']
      +", "+data['sensors']['agua_temp']+", "+data['sensors']['lux']+", TIMESTAMP '"+currentTime+"', "+data["device"]+")", function(err, result)
      {
        if(err) {
          return console.error('error running query', err);
        }
      });

      });

      // Add a 'close' event handler to this instance of socket
    sock.on('close', function(data) {
        console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
    });
});
serverTcp.listen(PORT_SERVER);
console.log('Server listening on ' + HOST_SERVER +':'+ PORT_SERVER);


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
