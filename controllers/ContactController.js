const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

exports.submitContactForm = async (req, res) => {
    const { name, email, subject, message } = req.body;

    try {
        // Validate inputs
        if (!name || !email || !message) {
            return res.render('index', { error: 'Please fill in all required fields.', success: null });
        }

        // Save to the database
        const contact = new Contact({ name, email, subject, message });
        await contact.save();

        // Render the view with a success message
        res.render('general/index', { success: 'Your message has been sent successfully!', error: null });
    } catch (error) {
        // Render the view with an error message
        res.render('general/index', { error: 'Something went wrong. Please try again later.', success: null });
    }
};


// Fetch feedbacks for admin
exports.getFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Contact.find();  // Fetch feedback from the database
        console.log(feedbacks);  // Debugging - Log to ensure feedback is fetched
        res.render('admin/feedback', { feedbacks });  // Pass 'feedbacks' to the view
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};


exports.replyToFeedback = async (req, res) => {
    const { email, message } = req.body;

    try {
        // Set up nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',  // Or your preferred email service
            auth: {
                user: 'arkvisionsmoments@gmail.com',
                pass: 'xwmu toeh mxji gket',
            },
        });

        // Email options
        const mailOptions = {
            from: 'arkvisionsmoments@gmail.com',
            to: email,
            subject: 'Reply from ArkVisions',
            text: message,
        };

       // Send the email
       await transporter.sendMail(mailOptions);

       // Redirect back to the feedback page after sending email
       if (req.session.isAdminLogged) {
        res.redirect('/ark/admin/feedback'); 
       } else {
           res.redirect('/login');  // If admin session is lost, redirect to login
       }
   } catch (error) {
       console.error(error);
       res.status(500).send('Server error');
   }
};