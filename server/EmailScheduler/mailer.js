const nodemailer = require('nodemailer');

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
        user: 'arnavanand710@gmail.com',
        pass: 'egxr yiwl mfqb wtfc',
    },
    secure: true,
});

const scheduleEmail = (email, dateTime) => {
    const targetTime = new Date(dateTime).getTime(); 
    const currentTime = Date.now();
    const delay = targetTime - currentTime; 

    if (delay > 0) {
        setTimeout(() => {
            const mailOptions = {
                from: "arnavanand710@gmail.com",
                to: email,
                subject: 'Scheduled File Access',
                text: 'Your file is now accessible!'
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                } else {
                    console.log('Email sent:', info.response);
                }
            });
        }, delay);
        
        console.log(`Email scheduled to be sent in ${delay / 1000} seconds.`);
    } else {
        console.error('Error: Scheduled time is in the past');
    }
};

module.exports = { scheduleEmail };
