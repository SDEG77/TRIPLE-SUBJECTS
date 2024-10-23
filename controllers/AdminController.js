const Booking = require('../models/Booking');
const User = require('../models/User');
const Image = require('../models/Image');
const Package = require('../models/Package')

class AdminController {
    
    // Fetch total number of clients
    async totalClients() {
      let total = await User.find();
  
      if (total) {
        // Some clients found
        return total.length;
      }
  
      // None found
      return 0;
    }
    async totalImage() {
      let total = await Image.find();
      if (total) {
        return total.length;
      }
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
  
      // console.log(got pass barrier: ${target._id})
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
      const photos = await Image.find();
      return photos;
    }
  
    async viewClientImages(clientId) {
      const images = await Image.find({ clientId: clientId });
      return images;
    }
  
    //delete image
    async deletePhoto(id) {
      const image = await Image.findById(id);
      if (!image) {
        throw new Error("Image not found");
      }
      await Image.deleteOne({ _id: image._id });
    }
  
  
    // Fetch approved bookings (today and future)
    async getApprovedBookings() {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start from midnight
        const bookings = await Booking.find({
            status: "accepted",
            date: { $gte: today } // Only future or today bookings
        }).populate('client_id'); // Populate client details
        return bookings;
    }

    async getTopServicesOverview(timeFrame) {
      const currentDate = new Date();
      let startDate;
  
      // Determine the start date based on the selected time frame
      if (timeFrame === 'month') {
          startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      } else if (timeFrame === 'year') {
          startDate = new Date(currentDate.getFullYear(), 0, 1);
      } else {
          startDate = new Date(0); // For "all time"
      }
  
      // Fetch top services/packages data from the database
      const topServices = await Booking.aggregate([
          { $match: { date: { $gte: startDate }, status: 'accepted' } },
          { $group: { _id: "$service", count: { $sum: 1 } } },
          { $sort: { count: -1 } } // Sort by booking count in descending order
      ]);
  
      return topServices;
  }


    async getRevenueOverview(timeFrame) {
      let matchCondition = { status: "accepted" };
      const currentDate = new Date();
  
      // Set the match condition based on the selected time frame
      if (timeFrame === "month") {
          currentDate.setDate(1); // Start from the first day of the current month
          matchCondition.date = { $gte: currentDate };
      } else if (timeFrame === "year") {
          currentDate.setMonth(0, 1); // Start from the first day of the current year
          matchCondition.date = { $gte: currentDate };
      }
      // For "all-time", we don't need to set any date condition
  
      const totalRevenue = await Booking.aggregate([
          { $match: matchCondition },
          {
              $project: {
                  total: {
                      $toDouble: {
                          $trim: {
                              input: {
                                  $replaceAll: {
                                      input: {
                                          $replaceAll: {
                                              input: "$total",
                                              find: "₱",
                                              replacement: ""
                                          }
                                      },
                                      find: ",",
                                      replacement: ""
                                  }
                              },
                              chars: " "
                          }
                      }
                  }
              }
          },
          {
              $group: {
                  _id: null,
                  total: { $sum: "$total" }
              }
          }
      ]);
  
      const revenueByService = await Booking.aggregate([
          { $match: matchCondition },
          {
              $project: {
                  total: {
                      $toDouble: {
                          $trim: {
                              input: {
                                  $replaceAll: {
                                      input: {
                                          $replaceAll: {
                                              input: "$total",
                                              find: "₱",
                                              replacement: ""
                                          }
                                      },
                                      find: ",",
                                      replacement: ""
                                  }
                              },
                              chars: " "
                          }
                      }
                  },
                  service: 1
              }
          },
          {
              $group: {
                  _id: "$service",
                  total: { $sum: "$total" }
              }
          },
          { $sort: { total: -1 } }
      ]);
  
      return {
          totalRevenue: totalRevenue[0]?.total || 0,
          revenueByService
      };
  }
  
    // Fetch pending bookings
    async totalPendingBookings() {
        const total = await Booking.find({ status: "pending" });
        return total ? total.length : 0;
    }
}

module.exports = new AdminController();
