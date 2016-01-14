'use strict';

var path = require('path'),
  rootPath = path.normalize(__dirname + '/../..');

var applicationPort=3000;
var applicationUrl="http://localhost:3000/";
var fbAppID="1695445710701793";
if ( process.env.NODE_ENV === 'production' ){
  fbAppID="1695437487369282";
  applicationPort=80;
  applicationUrl="http://54.83.55.140/";
}

module.exports = {
  root: rootPath,
  http: {
    port: process.env.PORT || applicationPort
  },
  https: {
    port: false,

    // Paths to key and cert as string
    ssl: {
      key: '',
      cert: '',
      ca: ''
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
  useLiveData:true,
  applicationUrl:applicationUrl,
  fbAppID:fbAppID
};
