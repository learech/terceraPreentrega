const nodemailer = require('nodemailer');
const config = require('../config');
const { logger } = require('../config/loggerCustom');
const { generateToken } = require('../config/jwt');

// Crear un objeto de transporte de nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.mail,
        pass: config.passMail
    }
});

// Función para verificar la configuración del transporte
const verifyMail = () => {
    transporter.verify(function (error, success) {
        if (error) {
            logger.error(error);
        } else {
            logger.info('OK for send mails');
        }
    });
}

// Función para enviar un correo electrónico
const sendEmail = (req, res) => {
    try {
        const to = req.user.email;
        if (!to) {
            return res.status(400).send({ message: 'Falta la dirección de correo del destinatario' });
        }

        const mailOptions = {
            from: 'Tu Nombre', // Remitente (cambia "Tu Nombre" por tu nombre o el nombre deseado)
            to,
            subject: 'Demo de correo electrónico',
            html: '<div><h1>Hola, soy Leandro desde NodeMailer</h1></div>'
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                logger.error(error);
                res.status(400).send({ message: 'Error', payload: error });
            } else {
                logger.info('Mensaje enviado: %s', info.messageId);
                res.send({ message: 'Éxito', payload: info });
            }
        });
    } catch (error) {
        logger.error(error);
        res.status(500).send({ error, message: 'Error al intentar enviar correo desde ' + config.mail });
    }
};




const sendEmailWithImages = (req, res, email) => {
    try {
        const { to } = email;

        if (!to) {
            return res.status(400).send({ message: 'Missing recipient email address' });
        }

        const mailOptionsWithImages = {
            front: 'Test for Mail - Matias Andrade',
            to,
            subject: 'Mail demo with images',
            html: `
                <div>
                    <h1>Hi, I'm Lea sending mail with Nodemailer!<h1>
                    <img src="cid:image" />
                </div>`,
            attachments: [
                {
                    fileName: 'Imagen',
                    path: myDirname + '/storage/products/banana.jpg',
                    cid: 'image'
                }
            ]
        };

        const result = transporter.sendMail(mailOptionsWithImages, (error, info) => {
            if (error) {
                logger.error(error);
                res.status(400).send({ message: 'Error', payload: error });
            }
            logger.info('Message sent: %s', info.messageId);
            res.status(201).send('Mail enviado');
        });
    } catch (error) {
        logger.error(error);
        res.status(500).send({ error, message: 'Error trying to send mail from ' + config.mail });
    }
};


const recoveryPass = (email, res) => {
    try {
        const token = generateToken(email);
        const to = email;
        if (!to) {
            return res.status(400).send({ message: 'Falta la dirección de correo electrónico del destinatario' });
        }

        const resetPasswordUrl = `http://localhost:8080/api/recoveryPassword?token=${token}`;

        const mailOptions = {
            from: 'Bot de recuperación de contraseña',
            to,
            subject: 'Restablecer tu contraseña',
            html: `<div><h1>Hola, soy tu bot de recuperación de contraseña!!!</h1>
            <a href="${resetPasswordUrl}"><button>Haz clic aquí</button></a>
            </div>`
        };

        const result = transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                logger.error(error);
                res.status(400).send({ message: 'Error', payload: error });
            }
            logger.info('Mensaje enviado: %s', info.messageId);
            res.status(201).send('Mail enviado');
        });
    } catch (error) {
        logger.error(error);
        res.status(500).send({ error, message: 'Error al intentar enviar el correo desde ' + config.mail });
    }
};



module.exports = { verifyMail, sendEmail, sendEmailWithImages, recoveryPass }