
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , index = require('./routes/index')
  , user = require('./routes/user')
  , http = require('http')
  , mongoose = require('mongoose')
  , Facebook = require('facebook-node-sdk')
  , path = require('path');

var app = express();

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/facebook');


app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('secret stuff'));
  app.use(express.session());
  app.use(Facebook.middleware({ appId: '208663422611236', secret:'b8a21d995dfd86ba8ac9b5bb142dd120'}))
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/login', Facebook.loginRequired({
  scope: ['user_photos', 'friends_photos', 'publish_stream']
}), index.login);

app.get('/', index.homepage);
app.get('/logout', facebookGetUser(), index.logout);

app.post('/color', facebookGetUser(), index.color);
app.post('/comment', facebookGetUser(), index.comment);

app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

function facebookGetUser() {
  return function(req, res, next) {
    req.facebook.getUser( function(err, user) {
      if (!user || err){
        res.send("Please login");
      } else {
        req.user = user;
        next();
      }
    });
  }
}