const nodemailer = require("nodemailer");

let transporter=nodemailer.createTransport({
    host:"smtp.gmail.com",
    port: 465,
    secure:true,
    user:'Virtualgadget',
    pass:'pxigfkbnsostiynh'
});
transporter.verify().then(()=>{
    console.log("Listo para enviar mensajes")
})