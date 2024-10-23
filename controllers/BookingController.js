const Booking = require('../models/Booking');
const Receipt = require("../models/Receipt");

class BookingController {
  async store(params) {
    let newArr = []; 
    
    if(params.addOns){
      params.addOns.forEach(add => {
        newArr.push(add.split(" - ")[1])
      });
    }

    try {
      await Booking.insertMany({
        client_id: params.client_id,
        receipt_uploaded: "no",
        service: params.service,
        total: params.total,
        addOns: newArr,
        date: params.date,
        time: params.time,
        status: "pending",
        payment_status: "pending",
      });

      return true;
    } catch (err) {
      return false;
    }
  }

  async accept(id) {
    await Booking.updateOne({_id: id}, {status: "accepted"});
  }

  async cancel(id) {
    await Booking.updateOne({_id: id}, {status: "cancelled"});
  }

  async reject(id) {
    await Booking.updateOne({_id: id}, {status: "rejected"});
  }
  
  async done(id) {
    await Booking.updateOne({_id: id}, {status: "done"});
  }

  async remove(id) {
    await Booking.deleteOne({_id: id});
  }
}


const BookingCon = new BookingController();

module.exports = BookingCon;