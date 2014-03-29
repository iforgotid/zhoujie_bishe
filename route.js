/**
 * User: mark <mark@wosai-inc>
 * Created at: 2/27/14 10:45 AM
 */

var index = require('./controller/index');
var sign = require('./controller/sign');
var company = require('./controller/company');
var position = require('./controller/position');
var seeker = require('./controller/seeker');
module.exports = function(app){
  app.get('/',index.showIndex);
  app.get('/companyLogin',sign.showCompanyLogin);
  app.post('/companyLogin',sign.doCompanyLogin);
  app.get('/companyRegister',sign.showCompanyRegister);
  app.post('/companyRegister',sign.doCompanyRegister);
  app.get('/company/index',sign.companyAuth,company.showCompanyIndex);
  app.get('/company/position',sign.companyAuth,company.showCompanyPositions);
  app.get('/company/seeker',sign.companyAuth,company.showSeeker);
  app.get('/position/:id',position.showPositionById);
  app.get('/position/edit/:id',sign.companyAuth,position.showPositionEditById);
  app.post('/position/edit/:id',sign.companyAuth,position.editPositionEditById);
  app.post('/position',sign.companyAuth,position.createPosition);
  app.get('/seekerLogin',sign.showSeekerLogin);
  app.post('/seekerLogin',sign.doSeekerLogin);
  app.get('/seekerRegister',sign.showSeekerRegister);
  app.post('/seekerRegister',sign.doSeekerRegister);
  app.get('/seeker/index',sign.seekerAuth,seeker.showIndex);
  app.get('/seeker/postPosition/:id',sign.seekerAuth,seeker.showPostPosition);
  app.post('/seeker/postPosition/:id',seeker.doPostPosition);
  app.get('/seeker/position/posted',sign.seekerAuth,seeker.showPostedPosition);
  app.get('/seeker/postedPosition/:id',seeker.showResume);
};