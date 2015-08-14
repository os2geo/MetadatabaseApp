/*jslint nomen: true */
/*jslint plusplus: true */
/*global require, console, __dirname, process, Buffer*/
(function () {
    'use strict';
    var argv = require('minimist')(process.argv.slice(2)),
        jf = require('jsonfile'),
        request = require('request'),
        http = require('http'),
        os = require("os"),
        hostname = os.hostname(),
        express = require('express'),
        compress = require('compression'),
        basicAuth = require('basic-auth'),
        cors = require('cors'),
        bodyParser = require('body-parser'),
        Busboy = require('busboy'),
        inspect = require('util').inspect,
        path = require('path'),
        fs = require('fs'),
        config,
        app = express();

    if (argv.config) {
        config = jf.readFileSync(argv.config);
    } else {
        console.log("Du skal angive config fil, f.eks.:  --config=config.json");
    }
app.all('/api*', function (req, res) {
        res.set('Access-Control-Allow-Credentials', 'true');
        res.set('Access-Control-Allow-Origin', 'http://localhost:8100');
        res.set('Access-Control-Allow-Methods', 'GET, PUT, POST, HEAD, DELETE');
        res.set('Access-Control-Allow-Headers', 'accept, authorization, content-type, origin, referer');
        var url = "http://geo.os2geo.dk" + req.url;
        if (req.method === 'PUT') {
            req.pipe(request.put(url)).pipe(res);
        } else if (req.method === 'POST') {
            req.pipe(request.post(url)).pipe(res);
        } else if (req.method === 'GET') {
            req.pipe(request.get(url)).pipe(res);
        } else if (req.method === 'DELETE') {
            req.pipe(request.del(url)).pipe(res);
        } else if (req.method === 'OPTIONS') {
            res.end();
        }

    });

    app.all('/es*', function (req, res) {
        res.set('Access-Control-Allow-Credentials', 'true');
        res.set('Access-Control-Allow-Origin', 'http://localhost:8100');
        res.set('Access-Control-Allow-Methods', 'GET, PUT, POST, HEAD, DELETE');
        res.set('Access-Control-Allow-Headers', 'accept, authorization, content-type, origin, referer');
        var url = "http://geo.os2geo.dk" + req.url;
        if (req.method === 'PUT') {
            req.pipe(request.put(url)).pipe(res);
        } else if (req.method === 'POST') {
            req.pipe(request.post(url)).pipe(res);
        } else if (req.method === 'GET') {
            req.pipe(request.get(url)).pipe(res);
        } else if (req.method === 'DELETE') {
            req.pipe(request.del(url)).pipe(res);
        } else if (req.method === 'OPTIONS') {
            res.end();
        }

    });

    app.all('/couchdb*', function (req, res) {
        res.set('Access-Control-Allow-Credentials', 'true');
        res.set('Access-Control-Allow-Origin', 'http://localhost:8100');
        res.set('Access-Control-Allow-Methods', 'GET, PUT, POST, HEAD, DELETE');
        res.set('Access-Control-Allow-Headers', 'accept, authorization, content-type, origin, referer');
        var url = "http://geo.os2geo.dk" + req.url;
        if (req.method === 'PUT') {
            req.pipe(request.put(url)).pipe(res);
        } else if (req.method === 'POST') {
            req.pipe(request.post(url)).pipe(res);
        } else if (req.method === 'GET') {
            req.pipe(request.get(url)).pipe(res);
        } else if (req.method === 'DELETE') {
            req.pipe(request.del(url)).pipe(res);
        } else if (req.method === 'OPTIONS') {
            res.end();
        }

    });
    app.use(compress());
    app.use(cors({
        credentials: true,
        origin: function (origin, callback) {
            callback(null, true);
        }
    }));

    app.use(bodyParser.json({
        limit: '100mb'
    }));

    app.use(express["static"](__dirname)); //  "public" off of current is root

    app.listen(4001);
    console.log('Listening on port 4001');
}());
