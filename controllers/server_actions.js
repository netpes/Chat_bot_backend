const userSchema = require("../schema/signupSchema");
async function getAllUsersData() {
  try {
    const users = await userSchema.find({ active: true });
    if (users) {
      const Fusers = users.map((user) => {
        return { name: user.name, id: user._id };
      });

      return Fusers;
    }
  } catch (e) {
    console.log(e);
  }
}
async function getInactiveChats() {
  try {
    const users = await userSchema.find({ active: false });
    if (users) {
      const Fusers = users.map((user) => {
        return { name: user.name, id: user._id };
      });

      return Fusers;
    }
  } catch (e) {
    console.log(e);
  }
}
async function setActive(id) {
  try {
    const user = await userSchema.findById(id);
    if (user.active === true) {
      console.log("changed to false");
      user.active = false;
    } else {
      console.log("changed to true");
      user.active = true;
    }
    user.save();
  } catch (e) {
    console.log(e);
  }
}

module.exports = { getAllUsersData, setActive, getInactiveChats };
