const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');

class AdminAuth {
  async login(params) {
    if (params.email && params.password) {
      // Find admin by email
      const admin = await Admin.findOne({ email: params.email });
      if (admin && await bcrypt.compare(params.password, admin.password)) {
        // Login success
        return true;
      } else {
        // Login failure
        return false;
      }
    }
  }
}

const adminAuth = new AdminAuth();

module.exports = adminAuth;
