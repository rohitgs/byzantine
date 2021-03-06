var fs = require('fs'),
    nstatic = require('node-static'),
    users = require('../models/user');

var usersLoggedIn = users.loggedInUsers,
    logs = users.logs;

exports.index = function(req, res){
    if (req.session.loggedIn) {
        var files = fs.readdirSync(__dirname + '/../user-files/');
        console.log(usersLoggedIn);
        res.render('dashboard', {files: files, users: usersLoggedIn});
    } else {
        res.render('index', {error: false});
    }
};

exports.renderSignUpPage = function (req, res) {
    res.render('sign-up-page');
};

exports.dashboard = function(req, res){
    if (req.session.loggedIn) {
        var files = fs.readdirSync(__dirname + '/../user-files/');
        res.render('dashboard', {files: files, users: usersLoggedIn});
    } else {
        res.redirect('/');
    }
};

exports.managerLogin = function (req, res) {
    res.render('manager-login');
};

exports.managerDashboard = function(req, res){
    if (req.session.loggedIn) {
        res.render('manager-dashboard', {logs: logs});
    } else {
        res.redirect('/');
    }
};

exports.fileUpload = function (req, res) {
    var uploadedFileName = req.files.inputFile.name;
    fs.readFile(req.files.inputFile.path, function (err, data) {
        if (err) {
            console.log('Error occured while file upload: ' + err);
            res.send(400);
        }
        var newPath = __dirname + "/../user-files/" + uploadedFileName;
        fs.writeFile(newPath, data, function (err) {
            if (err) {
                console.log(err);
                res.send(400);
            } else {
                res.render('file-upload-ok');
            }
        });
    });
};

exports.fileDownload = function (req, res) {
    var filename = req.params.filename;
    var fileServer = new nstatic.Server('./user-files');
    fileServer.serveFile(filename, 200, {}, req, res);
};
