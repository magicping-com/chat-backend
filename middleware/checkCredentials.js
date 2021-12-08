const { request } = require("express");

const checkCredentials = (req, res, next) => {
  const app_id = process.env.APP_ID;
  const app_secret = process.env.APP_SECRET;

  if (req.headers['app-id']==app_id && req.headers['app-secret']==app_secret){
    next();
  }
  else{
    res.status(404);
    res.json({message: "invalid credentials"});
  }
}

module.exports = checkCredentials
