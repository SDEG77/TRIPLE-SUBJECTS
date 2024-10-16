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
}


const BookingCon = new BookingController();

module.exports = BookingCon;