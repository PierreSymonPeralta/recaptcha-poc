
const express = require('express'), 
      bodyParser = require('body-parser'),
      path = require('path'),
      request = require('request');
      fs = require('fs'),
      dotenv = require('dotenv');

dotenv.config();
const port = 3000;
const public = path.join(__dirname, 'public');
const app = express();

app.get('/', function(req, res) {
  let doc = fs.readFileSync(path.join(public, 'index.html'), 'utf-8');
  doc = doc.replace(/\${SITE_KEY}/g, process.env.SITE_KEY)
  res.send(doc);
});

app.use(bodyParser.json());

app.post('/captcha', function(req, res) {
  console.log(req.body);
  const token = req.body.response;
  if(!token){
    return res.json({"responseError" : "something goes to wrong"});
  }
  const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_KEY }&response=${token}`;
  request(verificationURL,function(error,response,body) {
    body = JSON.parse(body);
    if(body.success !== undefined && !body.success) {
      return res.json({"responseError" : "Failed captcha verification"});
    }
    console.log(body);
    res.json(body);
  });
});

app.listen(port, function(){
    console.log('Server is running at port: ',port);
});