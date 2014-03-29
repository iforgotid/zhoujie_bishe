/**
 * User: mark <mark@wosai-inc>
 * Created at: 3/29/14 10:01 AM
 */
exports.showCompanyIndex = function(req,res) {
  var companyName = req.session.companyName;
  res.render('company/index',{companyName:companyName});
};

exports.showCompanyPositions = function(req,res) {
  var companyName = req.session.companyName;
  var jobsDb = config.mongo.jobs;
  var db = new Mongo(jobsDb).getConn();
  var positionCollection = db.collection('position');
  positionCollection.find({companyName:companyName}).toArray(function(err,records){
    if(err) {
      res.render('error/failed',{msg:'查询职位列表失败'});
      return;
    }
    var json = {
      companyName: companyName
    };
    json.positionList = records;
    res.render('company/position',json);
  });
};

exports.showSeeker = function(req,res) {
  var jobsDb = config.mongo.jobs;
  var db = new Mongo(jobsDb).getConn();
  var companyName = req.session.companyName;
  var seekerPositionCollection = db.collection('seeker_position');
  seekerPositionCollection.find({companyName:companyName}).toArray(function(err,records){
    if(err) {
      res.render('error/failed',{msg:'查询求职者列表失败'});
      return;
    }
    res.render('company/seeker',{companyName:companyName,postedPositions : records});
  });
};