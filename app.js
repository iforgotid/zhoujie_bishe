/**
 * User: mark <mark@wosai-inc>
 * Created at: 2/27/14 10:45 AM
 */
var express = require('express');
var routes = require('./route');
var mustacheExpress = require('mustache-express');
var app = express();
global.Mongo = require('./module/mongo');
global.config = require('./config');

// configuration in all env
app.configure(function () {
  app.enable('view cache');
  app.set('view engine', 'html');
  app.set('views', __dirname + '/view');
  app.engine('html', mustacheExpress());
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: 'jkafskl234123!@#'
  }));
});

// routes
routes(app);
var jobsDb = config.mongo.jobs;
new Mongo(jobsDb).init(function(err,result){
  if(err) {
    console.log(err);
    return;
  }
});
/*
s.parallel([
  function (callback) {
    var jikeDev = config.mongo.jike.dev;
    new Mongo(jikeDev).init(callback);
  },
  function (callback) {
    var jikeProd = config.mongo.jike.prod;
    new Mongo(jikeProd).init(callback);
  }
], function (err, results) {
  if (err) {
    console.log('[%s] connect to mongodb failed with error:[%s]', new Date(), JSON.stringify(err));
    process.exit(1001);
  }
  console.log('[%s] connect to mongodb successfully', new Date());
});
*/

app.listen(config.port);
console.log("You can debug your app with http://127.0.0.1:" + config.port);

module.exports = app;
