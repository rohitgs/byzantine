var tls = require('tls');
var fs = require('fs');

var options = {
  key: fs.readFileSync('ryans-key.pem'),
  cert: fs.readFileSync('ryans-cert.pem'),

  // This is necessary only if using the client certificate authentication.
 requestCert: true,

  // This is necessary only if the client uses the self-signed certificate.
 ca: [ fs.readFileSync('ryans-cert.pem') ]
};

var server = tls.createServer(options, function(cleartextStream) {
  console.log('server connected',
              cleartextStream.authorized ? 'authorized' : 'unauthorized');
    console.log(cleartextStream.getPeerCertificate());
  cleartextStream.write("welcome!\n");
  cleartextStream.setEncoding('utf8');
  cleartextStream.pipe(cleartextStream);
});
server.listen(8000, function() {
  console.log('server bound');
});
