/**
 * User: mark <mark@wosai-inc>
 * Created at: 3/9/14 8:55 PM
 */
exports.showCompanyLogin = function(req,res) {
  res.render('company/login');
  return ;
};

exports.doCompanyLogin = function(req,res) {
  var jobsDb = config.mongo.jobs;
  var db = new Mongo(jobsDb).getConn();
  var company = db.collection('company');
  var username = req.body.username;
  var password = req.body.password;
  var query = {
    username : username
  };
  company.find(query).toArray(function(err,record){
    if(err) {
      console.log(err);
      res.render('error/failed',{msg:'系统繁忙'});
    }
    if(record.length == 0) {
      res.render('error/failed',{msg:'用户名不存在'});
    } else if(record.length == 1) {
      if(record[0].password == password) {
        var companyName = record[0].name;
        req.session.companyName = companyName;
        res.redirect('company/index');
      }
    }
  });
};
exports.showCompanyRegister = function(req,res) {
  res.render('company/register');
  return ;
};
exports.doCompanyRegister = function(req,res) {
  var data =req.body;
  var jobsDb = config.mongo.jobs;
  var db = new Mongo(jobsDb).getConn();
  var company = db.collection('company');
  company.insert(data,function(err,result){
    if(err) {
      res.render('error/failed',{msg:'注册失败'});
      return;
    }
    res.redirect('/companyLogin');
  });
};


exports.showSeekerLogin = function(req,res) {
  res.render('seeker/login');
  return ;
};

exports.doSeekerLogin = function(req,res) {
  var jobsDb = config.mongo.jobs;
  var db = new Mongo(jobsDb).getConn();
  var seeker = db.collection('seeker');
  var username = req.body.username;
  var password = req.body.password;
  var query = {
    username : username
  };
  seeker.find(query).toArray(function(err,record){
    if(err) {
      console.log(err);
      res.render('error/failed',{msg:'系统繁忙'});
    }
    if(record.length == 0) {
      res.render('error/failed',{msg:'用户名不存在'});
    } else if(record.length == 1) {
      if(record[0].password == password) {
        var seekerName = record[0].name;
        req.session.seekerName = seekerName;
        res.redirect('seeker/index');
      }
    }
  });
};

exports.showSeekerRegister = function(req,res) {
  res.render('seeker/register');
  return ;
};

exports.doSeekerRegister = function(req,res) {
  var data =req.body;
  var jobsDb = config.mongo.jobs;
  var db = new Mongo(jobsDb).getConn();
  var company = db.collection('seeker');
  company.insert(data,function(err,result){
    if(err) {
      res.render('error/failed',{msg:'注册失败'});
      return;
    }
    res.redirect('/seekerLogin');
  });
}

exports.companyAuth = function(req,res,next) {
  if(!req.session.companyName) {
    res.redirect('/companyLogin');
  } else {
    next();
  }
};

exports.seekerAuth = function(req,res,next) {
  if(!req.session.seekerName) {
    res.redirect('/seekerLogin');
  } else {
    next();
  }
};