const { request } = require("express");

const checkCredentials = (req, res, next) => {
  console.log(req.headers['app_secret']);
  const app_id = process.env.APP_ID;
  const app_secret = process.env.APP_SECRET;

  console.log(app_id);
  if (req.headers['app_id']==app_id && req.headers['app_secret']==app_secret){
    next();
  }
  else{
    res.status(404);
    res.json({message: "invalid credentials"});
  }
}

module.exports = checkCredentials
