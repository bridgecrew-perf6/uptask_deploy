const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const util = require('util');
const emailConfig = require('../config/email');


let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
      user: emailConfig.user,
      pass: emailConfig.password
    }
  });


  //generar html
  const generarHtml = (archivo, opciones= {})=>{
      const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}`, opciones);
      return juice(html);
  }

exports.enviar = async (opciones) =>{
    const html = generarHtml(opciones.archivo, opciones);
    const text = htmlToText.fromString(html);
    let mailOptions = {
        from : 'Uptask <no-reply@uptask.com>',
        to: opciones.usuario.email,
        subject: opciones.subject,
        text,
        html
    };
    
    //promisify convierte elementos que no soportan async await a que si lo soporten
    const enviarEmail = util.promisify(transport.sendMail, transport)
    return enviarEmail.call(transport, mailOptions);
    
    
}


