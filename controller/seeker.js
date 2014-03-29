/**
 * User: mark <mark@wosai-inc>
 * Created at: 3/29/14 4:04 PM
 */
var ObjectID = require('mongodb').ObjectID;
exports.showIndex = function(req,res) {
  var seekerName = req.session.seekerName;
  var jobsDb = config.mongo.jobs;
  var db = new Mongo(jobsDb).getConn();
  var positionCollection = db.collection('position');
  positionCollection.find({}).toArray(function(err,records){
    if(err) {
      res.render('error/failed',{msg:'查询职位列表失败'});
      return;
    }
    var json = {
      seekerName: seekerName
    };
    json.positionList = records;
    res.render('seeker/index',json);
  });
};

exports.showPostPosition = function(req,res) {
  var _id = req.params.id;
  _id = new ObjectID(_id);
  var jobsDb = config.mongo.jobs;
  var db = new Mongo(jobsDb).getConn();
  var positionCollection = db.collection('position');
  positionCollection.find({_id:_id}).toArray(function(err,records){
    if(err) {
      res.render('error/failed',{msg:'查询职位详情失败'});
      return;
    }
    var json = records[0];
    var seekerName = req.session.seekerName;
    json.seekerName = seekerName;
    res.render('seeker/postPosition',json);
  });
};

exports.doPostPosition = function(req,res) {
  var _id = req.params.id;
  _id = new ObjectID(_id);
  var jobsDb = config.mongo.jobs;
  var db = new Mongo(jobsDb).getConn();
  var seekerPositionCollection = db.collection('seeker_position');
  var positionCollection = db.collection('position');
  positionCollection.find({_id:_id}).toArray(function(err,records){
    if(err) {
      res.render('error/failed',{msg:'查询职位详情失败'});
      return;
    }
    var seekerName = req.session.seekerName;
    var companyName = records[0].companyName;
    var positionName = records[0].name;
    var data = req.body;
    data.seekerName = seekerName;
    data.companyName = companyName;
    data.positionName = positionName;
    data.positionId = records[0]._id;
    seekerPositionCollection.insert(data,function(err,position){
      if(err) {
        res.render('error/failed',{msg:'投递职位失败'});
        return;
      }
      res.redirect('/seeker/position/posted');
    });
  });
};

exports.showPostedPosition = function(req,res) {
  var jobsDb = config.mongo.jobs;
  var db = new Mongo(jobsDb).getConn();
  var seekerName = req.session.seekerName;
  var seekerPositionCollection = db.collection('seeker_position');
  seekerPositionCollection.find({seekerName:seekerName}).toArray(function(err,records){
    if(err) {
      res.render('error/failed',{msg:'查询已投递职位失败'});
      return;
    }
    res.render('seeker/postedPosition',{seekerName:seekerName,postedPositions : records});
  });
};

exports.showResume = function(req,res) {
  var _id = req.params.id;
  _id = new ObjectID(_id);
  var jobsDb = config.mongo.jobs;
  var db = new Mongo(jobsDb).getConn();
  var seekerPositionCollection = db.collection('seeker_position');
  seekerPositionCollection.find({_id:_id}).toArray(function(err,records){
    if(err) {
      res.render('error/failed',{msg:'查询简历失败'});
      return;
    }
    var resume = records[0];
    var seekerName = resume.seekerName;
    var seekerCollection = db.collection('seeker');
    var renderData = {};
    renderData.resume = resume;
    seekerCollection.find({name:seekerName}).toArray(function(err,seekers){
      if(err) {
        res.render('error/failed',{msg:'查询简历失败'});
        return;
      }
      var seeker = seekers[0];
      renderData.seeker = seeker;
      res.render('seeker/resume',renderData);
    });
  });
}