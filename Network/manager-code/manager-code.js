var tls = require('tls'),
    fs = require('fs'),
dir = require('./config').path + '/Network';

function handleData (buf) {

    var res = JSON.parse(buf.toString());
    if(typeof res.type === 'undefined') {
        console.log('Invalid request');
    } else {
        switch (res.type) {
        case 'loginSuccess':
            displayDashboard();
            break;

        default:
            console.log('Unknown request type: ' + res.type);
            break;
        }
    }
}

function displayDashboard () {
    var dashboardTemplate = $('#dashboard-template').html();
    $('#body-container').html(dashboardTemplate);

    $('.operation img').on('click', function () {
        var operationTemplate = $('#' + $(this).attr('data-op') +
                                  '-template').html();
        $('#workspace').html(operationTemplate);
    });

    $('#workspace form').on('submit',function (event) {
        event.preventDefault();
        console.log( $( this ).serialize() );
    });


}


var options = {
    key: fs.readFileSync(dir + '/client-keys/client-key.pem'),
    cert: fs.readFileSync(dir + '/client-keys/client-cert.pem'),
    rejectUnauthorized: true,
    ca: [ fs.readFileSync(dir + '/server-keys/server-cert.pem') ]
};

var conn = tls.connect(8000, '127.0.0.1', options, function() {
    if (conn.authorized) {
        userLogin();
    } else {
        $('#body-container').html("Connection not authorized: " +
                                conn.authorizationError);
    }
});

conn.on("data", function (data) {
    handleData(data);
});


function userLogin () {
    console.log('Connection authorized by a Certificate Authority.');
    var loginTemplate = $('#login-template').html();
    $('#body-container').html(loginTemplate);

    //--- UI Event ---//
    $('#manager-login-submit').on('click', function () {
        // conn.write(JSON.stringify({
        //     name: 'admin',
        //     password: 'admin',
        //     type: 'auth'
        // }));

        conn.write(JSON.stringify({
            name: $('#userId').val(),
            password: $('#password').val(),
            type: 'auth'
        }));
    });
}
