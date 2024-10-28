const User = require("../models/User");
const Booking = require("../models/Booking");
const Image = require("../models/Image");
const Receipt = require("../models/Receipt");

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
    async viewClients(conditions) {      
      let users;
      let ser = conditions.search || false; 

      if(ser) {
        users = await User.find({
          $expr: {
            $regexMatch: {
              input: { $concat: ["$fname", " ", "$lname"] },
              regex: conditions.search,
              options: "i"
            }
          }
        });

        users = users.length > 0 ? users : await User.find();

      } else {
        users = await User.find();
      }
  
      let mentioned = [];
  
      users.map(use => {
        mentioned.push({_id: use._id})
      });

      // console.log(mentioned)
    
      const page = conditions.page || 1; 
      const pageSize = 15;
      
      let totalPage = await User.find({ $or: mentioned });
  
      const pageCalc = Math.round(totalPage.length / pageSize) + 1;
  
      totalPage = pageCalc ? pageCalc : 1;
    
      if (conditions.search) {
        users = await User.find({ $or: mentioned })
        .skip((page - 1) * pageSize)
        .limit(pageSize).sort({ date: -1 });
      } else {
        users = await User.find()
        .skip((page - 1) * pageSize)
        .limit(pageSize).sort({ date: -1 });
      }

      if (users.length <= 0) {
        return false;
      }

      return {
        clients: users,
        total_page: totalPage,
        current_page: page,
        current_search: conditions.search,
      };
    }
  
    async deleteClient(id) {
      const target = await User.findById(id);
      
      if (!target) {
        // console.log('blovcked')
        return false;
      }
      
      // console.log(got pass barrier: ${target._id})
      
      await Booking.deleteMany({client_id: target._id});
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

  async viewBookings(conditions) {
    let users;

    if(conditions.search) {
      users = await User.find({
        $expr: {
          $regexMatch: {
            input: { $concat: ["$fname", " ", "$lname"] },
            regex: conditions.search,
            options: "i"
          }
        }
      });

      users = users.length > 0 ? users : await User.find();
    } else {
      users = await User.find();
    }

    let mentioned = [];

    users.map(use => {
      mentioned.push({client_id: use.id})
    });

    console.log(mentioned)

    const page = conditions.page || 1; 
    const status = conditions.status ? {status: conditions.status} : {};
    const pageSize = 15;
    
    let totalPage = await Booking.find({...status, $or: mentioned});

    const pageCalc = Math.round(totalPage.length / pageSize) + 1;

    totalPage = pageCalc ? pageCalc : 1;

    let bookings;

    if (conditions.search) {
      bookings = await Booking.find({...status, $or: mentioned})
      .skip((page - 1) * pageSize)
      .limit(pageSize).sort({ date: -1 });
    } else {
      bookings = await Booking.find({...status})
      .skip((page - 1) * pageSize)
      .limit(pageSize).sort({ date: -1 });
    }

    const receipts = await Receipt.find();

    if (bookings.length > 0) {
      return {
        bookings: bookings,
        users: users,
        receipts: receipts,
        current_page: page,
        current_status: conditions.status,
        current_search: conditions.search,
        total_page: totalPage,
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
        $or: [
          {status: "accepted"},
          {status: "done"},
        ],
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
      { $match: { date: { $gte: startDate }, $or: [{status: 'accepted'}, {status: 'done'}] } },
      { $group: { _id: "$service", count: { $sum: 1 } } },
      { $sort: { count: -1 } } // Sort by booking count in descending order
  ]);

  console.log(topServices)

  return topServices;
}


async getRevenueOverview(timeFrame) {
  let matchCondition = { $or: [{status: "accepted"}, {status: "done"}] };
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

const admin = new AdminController();

module.exports = admin;
