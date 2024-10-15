const User = require('../models/User');

class AdminController {
  async totalClients() {
    let total = await User.find();

    if(total) {
      // Some clients found
      return total.length;
    }

    // None found
    return 0;
  }

  async viewClients() {
    const users = await User.find();

    if(users.length <= 0) {
      return false;
    }

    return users;
  }

  async deleteClient(id) {
    const target = await User.findById(id);

    if(!target) {
      // console.log('blovcked')
      return false
    }

    // console.log(`got pass barrier: ${target._id}`)
    await User.deleteOne({_id: target._id});
  }
}

const admin = new AdminController();

module.exports = admin;