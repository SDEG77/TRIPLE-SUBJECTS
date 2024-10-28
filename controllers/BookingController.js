const Booking = require('../models/Booking');
const Receipt = require("../models/Receipt");
const User = require('../models/User');
const UnavailableDate = require('../models/UnavailableDate');


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

  async update(data) {
    await Booking.updateOne({_id: data.id}, {$set: {
          status: "re-scheduled",
          time: data.time,
          date: data.date,
        }
      }
    )
  }

  async getAllBookings() {
    try {
      const bookings = await Booking.find(); // Retrieve all bookings

      // Fetch user details for each booking
      const bookingsWithClientData = await Promise.all(
          bookings.map(async (booking) => {
              const client = await User.findOne({ _id: booking.client_id });
              return {
                  ...booking.toObject(),
                  client, // Attach client (user) details to each booking
              };
          })
      );

      return bookingsWithClientData;
  } catch (error) {
      console.error("Error fetching bookings with client data:", error);
      throw error;
  }
}


async getUnavailableDates(req, res) {
  try {
    const unavailableDates = await UnavailableDate.find({});
    res.json(unavailableDates);
  } catch (error) {
    res.status(500).json({ message: "Error fetching unavailable dates", error });
  }
}

async getBookingsByDate(date) {
  try {
    const bookings = await Booking.find({ date });
    return bookings.map(booking => ({ date: booking.date, time: booking.time }));
  } catch (error) {
    console.error("Error fetching bookings by date:", error);
    throw error;
  }
}
}

const bookingController = new BookingController();
module.exports = bookingController;