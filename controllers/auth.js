const userUtil = require('../db/userUtil');
const bcrypt = require('bcrypt');

exports.signup = (req, res, next) => {
  let user = req.user;
  
  bcrypt
    .hash(user.password, 12)
    .then(hashedPw => {
      user.password = hashedPw;
      // add user to db
      userUtil.putUser(user)
        .then(data => {
          console.log(data);
          res.status(201).send({
            message: "Successfully created user"
          })
        })
        .catch(error => {
          console.log(error);
          res.status(500).send({
            message: error.message ||
            "An error occured when creating the user"
          })
        });
    });
}