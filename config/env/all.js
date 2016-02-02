'use strict';

var path = require('path'),
  rootPath = path.normalize(__dirname + '/../..');

var applicationPort=3000;
var nonSSLPort=applicationPort;
var applicationUrl="http://localhost:3000/";
var fbAppID="1695445710701793";
var applicationName="2016 Rizers";  //check rizeHead.html, rizeSEO.html - used in title/meta
var applicationDescription="The movers, shakers and next generation leaders to watch in 2016";
var defaultSocialImage="https://africa.rizing.org/wp-content/uploads/2015/12/cropped-Rize-socialprofiles.png";
var isSSL=false;
var useSSLOnProd=true;
var sslKey='';
var sslCert='';
var sslCa='';
var sslPort=false;
if ( process.env.NODE_ENV === 'production' ){
  fbAppID="1695437487369282";
  nonSSLPort=80;
  applicationUrl="http://watch2016.rizing.org/";
  
  if (useSSLOnProd) {
    sslPort=443;
    applicationUrl="https://watch2016.rizing.org/";
    sslKey='/etc/apache2/SSL/rizing.org.key';
    sslCert='/etc/apache2/SSL/rizing.org.crt';
    sslCa='/etc/apache2/SSL/gd_bundle-g2-g1.crt';
  }
}

module.exports = {
  root: rootPath,
  http: {
    port: nonSSLPort
  },
  https: {
    port: sslPort,

    // Paths to key and cert as string
    ssl: {
      key: sslKey,
      cert: sslCert,
      ca: sslCa
    }
  },
  hostname: process.env.HOST || process.env.HOSTNAME,
  db: process.env.MONGOHQ_URL,
  templateEngine: 'swig',

  // The secret should be set to a non-guessable string that
  // is used to compute a session hash
  sessionSecret: 'MEAN',

  // The name of the MongoDB collection to store sessions in
  sessionCollection: 'sessions',

  // The session cookie settings
  sessionCookie: {
    path: '/',
    httpOnly: true,
    // If secure is set to true then it will cause the cookie to be set
    // only when SSL-enabled (HTTPS) is used, and otherwise it won't
    // set a cookie. 'true' is recommended yet it requires the above
    // mentioned pre-requisite.
    secure: false,
    // Only set the maxAge to null if the cookie shouldn't be expired
    // at all. The cookie will expunge when the browser is closed.
    maxAge: null
  },
  public: {
    languages: [{
      locale: 'en',
      direction: 'ltr',
    }, {
      locale: 'he',
      direction: 'rtl',
    }],
    currentLanguage: 'en',
    loginPage: '/auth/login',
    cssFramework: 'bootstrap'
  }, 
  // The session cookie name
  sessionName: 'connect.sid',
  // Set bodyParser options
  bodyParser: {
    json: {limit: '100kb'},
    urlencoded: {limit: '100kb', extended: true}
  },
  spreadsheet_URL: 'https://docs.google.com/spreadsheets/d/1KTpCMF4_5TBEIyM-g2tLxHcq2XUaAqMc3IaqnKbJEHs/pubhtml',
  accounts_api_URL:'http://api.rizing.org/api/accounts',
  profileFlatPath:'/packages/custom/rizers/server/models/profiles.json',
  apiFlatPath:'/packages/custom/rizers/server/models/api.json',
  categoryFlatPath:'/packages/custom/rizers/server/models/categories.json',
  useLiveData:false,
  applicationUrl:applicationUrl,
  applicationName:applicationName,
  applicationDescription:applicationDescription,
  defaultSocialImage:defaultSocialImage,
  fbAppID:fbAppID
};
