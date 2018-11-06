var net=require('net');
var HOST_SERVER='127.0.0.1';
var PORT_SERVER=6969;

var clientTCP=new net.Socket();
var host_client='127.0.0.1';
var port_client=9000;

var objSensors={"sensors":{"agua_temp":20.56,"ph":35.31,"lux":1240},"timestamp":"17/07/25,11:05:28-20"};

var serverTcp=net.createServer(function(sock)
{
  // We have a connection - a socket object is assigned to the connection automatically
    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);

    // Add a 'data' event handler to this instance of socket
    sock.on('data', function(data) {
        console.log('DATA ' + sock.remoteAddress + ': ' + data);
        sock.write('You said "' + data + '"');
        console.log("Tipo de dato: "+typeof(data));
        clientTCP.connect({port:port_client, host: host_client}, function(err)
        {
          if(err)
          {
            return console.log("Error connecting to server: ", err.message);
          }
          console.log("connectado a: "+host_client+':'+port_client);

          //console.log("Enviar: "+JSON.stringify(objSensors));
          clientTCP.write(data);
          clientTCP.destroy();
        }
        );
      });

      // Add a 'close' event handler to this instance of socket
    sock.on('close', function(data) {
        console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
    });
});
serverTcp.listen(PORT_SERVER, HOST_SERVER);
console.log('Server listening on ' + HOST_SERVER +':'+ PORT_SERVER);
