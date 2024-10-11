const User = require('../models/User');
const route = require('express').Router();
const bcrypt = require('bcrypt');

class Register {  
  async register(params) {
    let unique;

    // check if not empty
    if(params.fname || params.lname || params.email || params.password) {
      unique = await User.find({ email: params.email });
    }

    // checks if email already exists
    if(unique.length > 0) {
      return false;      
    } 
    
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

  async login(params) {
    let check;
    let compare;

    if(params.email || params.password) {
      check = await User.find({email: params.email})  
    }

    if(check.length > 0) {
      compare = await bcrypt.compare(params.password, check[0].password);
    }

    if(compare) {
      // console.log('password correct')
      return true;
    } 
    
    // console.log('password incorrect')
    return false;
  
  }
}

const register = new Register();

module.exports = register;