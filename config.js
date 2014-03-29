/**
 * User: mark <mark@wosai-inc>
 * Created at: 2/27/14 12:09 PM
 */
module.exports = {
  port : 12306,
  mongo : {
    jobs : {
      url : '127.0.0.1:27017',
      name: 'jobs',
      database: 'jobs',
      username: 'zhoujie',
      password: '18806211915',
      serverOptions: {
        poolSize: 1
      }
    }
  }
};