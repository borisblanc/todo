var http = require("http");
var fs = require('fs');
var path = require('path');

var server = http.createServer(function(req, res) {
	var filename;
	var savefile = "./tasks.json";

	switch(req.url) {
		case "/app.js": 
			filename = 'app.js';
			break;
		case '/':
			filename = 'index.html';
			break;
		case '/tasks':
			if (req.method == "POST") {
				var ws = fs.createWriteStream(savefile);
				req.on('data', function (chunk) {
					console.log("Received body data:");
					console.log(chunk.toString());
				});
				req.pipe(ws);
				req.on('end', function () {
					res.writeHead(200, "OK", {'Content-Type': 'text/html'});
					res.end();
				});
				return;
			}
			if (req.method == "GET") {
				var savedtasks = fs.createReadStream(savefile);
				savedtasks.pipe(res);
				return;
			}
			break;
		default:
			res.writeHead(404, "file does not exists");
			res.end();
			return;
	}
	var fpath = path.join(__dirname, '../front', filename);
	var rs = fs.createReadStream(fpath);
	rs.pipe(res);
});

server.listen(8080, "localhost", function(){
	console.log("server is listening...");
});


