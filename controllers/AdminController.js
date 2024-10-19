const User = require("../models/User");
const Booking = require("../models/Booking");
const Image = require("../models/Image");

class AdminController {
  async totalClients() {
    let total = await User.find();

    if (total) {
      // Some clients found
      return total.length;
    }

    // None found
    return 0;
  }
  async viewClients() {
    const users = await User.find();

    if (users.length <= 0) {
      return false;
    }

    return users;
  }

  async deleteClient(id) {
    const target = await User.findById(id);

    if (!target) {
      // console.log('blovcked')
      return false;
    }

    // console.log(`got pass barrier: ${target._id}`)
    await User.deleteOne({ _id: target._id });
  }

  async totalBookings() {
    let total = await Booking.find();

    if (total) {
      // Some clients found
      return total.length;
    }

    // None found
    return 0;
  }

  async viewBookings() {
    const bookings = await Booking.find();
    const users = await User.find();

    if (bookings.length > 0) {
      return {
        bookings: bookings,
        users: users,
      };
    }

    return false;
  }

  async viewPhotos() {
    const photos = await Image.find(); // Fetch all images
    return photos; // Return the images (could be empty if none found)
  }

  async viewClientImages(clientId) {
    const images = await Image.find({ clientId: clientId }); // Filter by clientId
    return images; // Return the images array (will be empty if none found)
  }
  
  
}

const admin = new AdminController();

module.exports = admin;
