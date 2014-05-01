var tls = require('tls'),
    fs = require('fs'),
dir = '/Users/prometheansacrifice/development/js/byzantine/Network';

var options = {
    key: fs.readFileSync(dir + '/client-keys/client-key.pem'),
    cert: fs.readFileSync(dir + '/client-keys/client-cert.pem'),
    rejectUnauthorized: true,
    ca: [ fs.readFileSync(dir + '/server-keys/server-cert.pem') ]
};

var conn = tls.connect(8000, '127.0.0.1', options, function() {
    if (conn.authorized) {
        $('#id').html("Connection authorized by a Certificate Authority.");
        conn.write(JSON.stringify({
            name: 'admin',
            password: 'admin',
            type: 'auth'
        }));
    } else {
        $('#id').html("Connection not authorized: " + conn.authorizationError);
    }
});

conn.on("data", function (data) {
    console.log(data.toString());
});