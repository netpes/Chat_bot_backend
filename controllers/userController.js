const userSchema = require("../schema/signupSchema");
// const bcrypt = require('bcrypt')

module.exports = {
  getAllUser: (req, res) => {
    try {
      userSchema
        .find()
        .then((users) => {
          res.status(200).json({
            users,
          });
        })
        .catch((error) => {
          res.status(500).json({
            message: error,
          });
        });
    } catch (e) {
      console.log(e);
    }
  },
  createUser: (req, res) => {
    try {
      const { name, password, email } = req.body;
      // const salt = bcrypt.genSalt(10);
      // const hashed = bcrypt.hash(password, salt)
      const user = new userSchema({
        name,
        password,
        email,
      });
      user
        .save()
        .then(() => {
          res.status(200).json({
            message: "Post saved successfully!",
            data: req.body,
          });
        })
        .catch((error) => {
          res.status(500).json({
            message: error,
          });
        });
    } catch (e) {
      console.log(e);
    }
  },
  login: (req, res) => {
    try {
      const { email, password } = req.body;
      userSchema
        .findOne({ email, password })
        .then((users) => {
          if (users) {
            res.status(200).json({
              id: users._id,
              name: users.name,
              role: users.role,
            });
          }
          console.log(users);
        })
        .catch((error) => {
          res.status(500).json({
            message: error,
            sorry: "error",
          });
        });
    } catch (e) {
      console.log(e);
    }
  },
};
