var net	=	require('net');
var pg 	=	require('pg');

var PORT_SERVER=6969;

//var conString = "postgres://postgres:NorjEpWy@localhost:5432/lentejasbd";
//var objSensors={"device":1,"sensors":{"agua_temp":20.56,"ph":35.31,"lux":1240},"timestamp":"17/07/25,11:05:28-20"};

/*
var client = new pg.Client(conString);
client.connect(function(err) 
{
	if(err) 
	{
		return console.error('could not connect to postgres', err);
	}
	else
	{
		console.log('connection succed!');
	}	
});
*/

net.createServer(function(socket)
{
	console.log('CONNECTED: ' + socket.remoteAddress + ':' + socket.remotePort);
	socket.on('data', function(data) 
	{
		console.log(save_data(data));
		/*
        console.log('DATA ' + socket.remoteAddress + ': ' + data);
		//socket.write('You said "' + data + '"');
		socket.write("1");
		data=JSON.parse(data);
		var sentence_query = "INSERT INTO sensors (ph, temp, light, date, device) VALUES ("+
		data['sensors']['ph']+", "+
		data['sensors']['agua_temp']+", "+
		data['sensors']['lux']+", TIMESTAMP '"+
		data['timestamp']+"', "+
		data["device"]+")";
		client.query(sentence_query, function(err, result)
		{
			if(err) 
			{
				return console.error('error running query', err);
			}
		});
		*/
	});

    // Add a 'close' event handler to this instance of socketet
	socket.on('close', function(data) 
	{
        console.log('CLOSED: ' + socket.remoteAddress +' '+ socket.remotePort);
    });
}).listen(PORT_SERVER, function()
{
	console.log('Server listening on port' + PORT_SERVER);
});
function save_data(data)
{
	pg.connect("postgres://postgres:NorjEpWy@localhost:5432/lentejasbd", (err, client, done)=>
	{
		if(err)
		{
			return console.error("Error al conectarse", err);
		}
		var sentence_query = "INSERT INTO sensors (ph, temp, light, date, device) VALUES ("+
			data['sensors']['ph']+", "+
			data['sensors']['agua_temp']+", "+
			data['sensors']['lux']+", TIMESTAMP '"+
			data['timestamp']+"', "+
			data["device"]+")";
		
		client.query(sentence_query, function(err, result)
		{
			done();
			if(err) 
			{
				return console.error('error running query', err);
			}
			console.log(result)
			return 1;
		});
	});
};