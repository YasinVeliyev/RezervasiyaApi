const mongoose = require("mongoose");

exports.errorHandler = (err, req, res, next) => {
  let msg = err.message;
  if (msg.includes("User validation failed: ", "")) {
    let { email, password, username } = err.errors;
    let errors = [email, password, username];

    return res.status(400).json(errors.filter((error) => Boolean(error)).map((error) => error.message));
  }
  //   else if (err instanceof mongoose.Error.Mon)
  else if (msg.includes("E11000 duplicate key error collection: rezervasiya_test.users index:")) {
    msg = msg.replace("E11000 duplicate key error collection: rezervasiya_test.users index:", "");
    if (msg.includes("email")) {
      return res.status(400).json("Bu email artıq qeydiyyatdan keçibdir");
    } else if (msg.includes("username")) {
      return res.status(400).json("Belə İstifadəçi adı mövcuddur");
    }
  } else {
    console.log(err);
    res.end();
  }
};
