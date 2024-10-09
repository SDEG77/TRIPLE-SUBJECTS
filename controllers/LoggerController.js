const User = require('../models/User');
const route = require('express').Router();
const bcrypt = require('bcrypt');

class Register {  
  async register(params) {
    if(params.fname || params.lname || params.email || params.password) {
      let unique = await User.find({ email: params.email });
      
      if(unique.length > 0) {
        // console.log(unique.length)
        return false;
        
      } else {
        // console.log('true in register')
        const salt = await bcrypt.genSalt();
        const hashed = await bcrypt.hash(params.password, salt);

        await User.insertMany({
          fname: params.fname,
          lname: params.lname,
          email: params.email,
          password: hashed,
        })
  
        return true;
      }
    }
  }

  async login(params) {
    if(params.email || params.password) {
      const check = await User.find({email: params.email});  

      if(await bcrypt.compare(params.password, check[0].password)) {
        // console.log('password correct')
        return true;
      } else {
        // console.log('password incorrect')
        return false;
      }
    }
  }
}

const register = new Register();

module.exports = register;