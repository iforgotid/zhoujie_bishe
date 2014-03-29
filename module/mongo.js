/**
 * User: mark <mark@wosai-inc>
 * Created at: 2/27/14 12:06 PM
 */
var _ = require('underscore');
var MongoClient = require('mongodb').MongoClient;
var connPool = {};
var mongo = function (params) {
  if (typeof params == 'undefined') {
    params = {};
  }
  var serverInfo = getConnectionInfo(params);
  this.url = serverInfo.url;
  this.options = {server: serverInfo.options};
  this.name = serverInfo.name
};
mongo.prototype.init = function (callback) {
  var connection = connPool[this.name];
  if (!connection) {
    //没有cache
    var key = this.name;
    MongoClient.connect(this.url, this.options, function (err, db) {
      if (err) {
        callback(err);
      }
      connPool[key] = db;
      callback(null, db);
    });
  } else {
    //直接从cache中拿connection
    callback(null, connection.db);
  }
  return;
};

mongo.prototype.getConn = function () {
  var connection = connPool[this.name];
  if (!connection) {
    //没有cache
    return null;
  } else {
    //直接从cache中拿connection
    return connection;
  }
};

function getConnectionInfo(connectionInfo) {
  if (typeof connectionInfo == 'undefined') {
    connectionInfo = {};
  }
  connectionInfo = _.extend({
    needAuth: true,
    serverOptions: {
      poolSize: 3,
      auto_reconnect: true,
      socketOptions: {
        keepAlive: 1
      }
    }
  }, connectionInfo);
  var serverUrl = 'mongodb://';
  if (connectionInfo.needAuth) {
    serverUrl += (connectionInfo.username + ':' + connectionInfo.password + '@');
  }
  if (_.isArray(connectionInfo.url)) {
    _.each(connectionInfo.url, function (address, index) {
      serverUrl += (address);
      if (index !== connectionInfo.url.length - 1) {
        serverUrl += ','
      }
    });
  } else {
    serverUrl += connectionInfo.url;
  }
  serverUrl += ('/' + connectionInfo.database);
  return {
    url: serverUrl,
    name: connectionInfo.name,
    options: connectionInfo.serverOptions
  };
};
module.exports = mongo;
