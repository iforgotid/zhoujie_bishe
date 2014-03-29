/**
 * User: mark <mark@wosai-inc>
 * Created at: 3/29/14 10:12 AM
 */
var ObjectID = require('mongodb').ObjectID;
exports.showPositionById = function(req,res) {
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
    json = records[0];
    if(!!req.session.companyName) {
      json.isCompany = true;
    } else if(!!req.session.seekerName) {
      json.isSeeker = true;
    }
    res.render('position/detail',json);
  });
};

exports.showPositionEditById = function(req,res) {
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
    json = records[0];
    if(req.session.companyName !== records[0].companyName) {
      return res.render('error/failed',{msg:'您无权编辑该职位'});
    }
    res.render('position/edit',json);
  });
};

exports.editPositionEditById = function(req,res) {
  var _id = req.params.id;
  _id = new ObjectID(_id);
  var position = req.body;
  var companyName = req.session.companyName;
  position.companyName = companyName;
  var jobsDb = config.mongo.jobs;
  var db = new Mongo(jobsDb).getConn();
  var positionCollection = db.collection('position');
  positionCollection.update({_id:_id},position,function(err,result){
    if(err) {
      res.render('error/failed',{msg:'查询职位详情失败'});
      return;
    }
    res.redirect('/position/' + req.params.id);
  });
};

exports.createPosition = function(req,res) {
  var position = req.body;
  if(!req.session.companyName) {
    res.redirect('/companyLogin');
  }
  var companyName = req.session.companyName;
  position.companyName = companyName;
  var jobsDb = config.mongo.jobs;
  var db = new Mongo(jobsDb).getConn();
  var positionCollection = db.collection('position');
  positionCollection.insert(position,function(err,result){
    if(err) {
      res.render('error/failed',{msg:'新建职位失败'});
      return;
    }
    res.redirect('/company/position');
  });
};