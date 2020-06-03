const first = (req, res, next) => {
  console.log("i'm a middleware!");
  next();
};



module.exports = first;