var net	=	require('net');
var pg 	=	require('pg');

var PORT_SERVER=6969;

//var objSensors={"device":1,"sensors":{"agua_temp":20.56,"ph":35.31,"lux":1240},"timestamp":"17/07/25,11:05:28-20"};

net.createServer(function(socket)
{
	console.log('CONNECTED: ' + socket.remoteAddress + ':' + socket.remotePort);
	socket.on('data', function(data) 
	{
		var date_time = new Date(JSON.parse(data)['timestamp']);
		if(date_time.isValid())
		{
			save_data(JSON.parse(data))
			.then((value)=>
			{
				if(value)
				{
					socket.write("1");
				}
			});
		}
		else
		{
			console.log("Fecha invalida");
			socket.write("2");
		}
	});

	socket.on('close', function(data) 
	{
        console.log('CLOSED: ' + socket.remoteAddress +' '+ socket.remotePort);
    });
}).listen(PORT_SERVER, function()
{
	console.log('Server listening on port' + PORT_SERVER);
});
Date.prototype.isValid = function () 
{
    return this.getTime() === this.getTime();
};  
function save_data(data)
{
	console.log(data);
	return new Promise((resolve, reject)=>
	{
		pg.connect("postgres://postgres:NorjEpWy@localhost:5432/lentejasbd", (err, client, done)=>
		{
			if(err)
			{
				console.log("Error al conectarse", err);
				console.log(err);
				resolve(0);
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
					console.log('error running query', err);
					resolve(0);
				}
				console.log(result)
				resolve(1);
			});
		});
	})
};
