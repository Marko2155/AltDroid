const http = require("http")
const url = require("url")
const fs = require("fs")
const port = 80
let questuas = JSON.parse(fs.readFileSync(__dirname + "/uas.json")).uas
let appsList = JSON.parse(fs.readFileSync(__dirname + "/dist/apps.json"))

function checkDevice(req, uas) {
	let deviceInfo = {
		device: ""
	}
	for (let i = 0; i < uas.length - 1; i++) {
		if (req.headers["user-agent"] == uas[i]) {
			deviceInfo.device = "Oculus"
			break
		} else {
			deviceInfo.device = "Other"
		}
	}
	if (String(req.headers["user-agent"]).includes("Android")) {
		deviceInfo.device = "Android"
	} else {
		deviceInfo.device = "Other"
	}
	return deviceInfo
}

http.createServer(function(req, res) {
	const urlpath = url.parse(req.url, true)
    	const parsedpath = urlpath.path
    	const query = urlpath.query
    	const path = parsedpath.split("?")[0]
    	if (path.charAt(path.length - 1) == "?") {
    	    query = parsedpath.split("?")[1].replace("?", "")
    	}
	let device = checkDevice(req, questuas).device
	if (req.method == "GET") {
		console.log(`Device ${device} requested ${path} with method ${req.method} and query parameters ${JSON.stringify(query)}!`)
		if (path == "/app/android") {
			res.writeHead(200)
			res.write(fs.readFileSync(__dirname + "/app/android.html"))
			res.end()
		} else if (path == "/app/oculus") {
			res.writeHead(200)
			res.write(fs.readFileSync(__dirname + "/app/oculus.html"))
			res.end()
		} else if (path == "/") {
			res.writeHead(200)
			res.write(fs.readFileSync(__dirname + "/index.html"))
			res.end()
		} else if (path == "/developers") {
			res.writeHead(200)
			res.write(fs.readFileSync(__dirname + "/devs.html"))
			res.end()
		} else if (path == "/getApk") {
			if (query.id != null || query.id != undefined) {
				if (fs.existsSync(`${__dirname}/dist/${String(query.id)}.apk`) {
					res.writeHead(200)
					res.write(fs.readFileSync(`${__dirname}/dist/${String(query.id)}.apk`))
					res.end()
				} else {
					res.write(404)
					res.write(`APK with ID ${String(query.id)} not found!`)
					res.end()
				}
			} else {
				res.writeHead(401)
				res.write("Please give ID!")
				res.end()
			}
		} else if (path == "/listApk") {
			res.writeHead(200)
			res.write(JSON.stringify(appsList))
			res.end()
		} else {
			res.writeHead(404)
			res.write("404 Not Found")
			res.end()
		}
	} else if (req.method == "POST") {

	} else {
		res.writeHead(404)
		res.write("???")
		res.end()
	}
}).listen(port, function() {
	console.log(`AltDroid is listening on port ${port}!`)
})
