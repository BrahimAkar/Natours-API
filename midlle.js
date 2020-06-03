const checkLogin = (req, res, next) => {
  console.log("i'm a middleware");
  next();
};

const seconMid = (req, res, next) => {
  console.log("i'm a second midlleware");
  next();
};

const userMid = (req, res, next) => {
  console.log("Users path is protected");
  next();
};

module.exports = { checkLogin, seconMid, userMid };
