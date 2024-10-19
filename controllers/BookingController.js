const Booking = require('../models/Booking');

class BookingController {
  async store(params) {
    try {
      await Booking.insertMany({
        client_id: params.client_id,
        service: params.service,
        date: params.date,
        time: params.time,
        status: "Pending",
        payment_status: "Pending",
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

  async remove(id) {
    await Booking.deleteOne({_id: id});
  }
}


const BookingCon = new BookingController();

module.exports = BookingCon;