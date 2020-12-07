import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import Mail, { Attachment } from 'nodemailer/lib/mailer';
import { getManager } from 'typeorm';
import { MonitorAlarmPeople } from './entities/MonitorAlarmPeople';
import { MonitoredSystem } from './entities/MonitoredSystem';
import { MonitorSystemsErrors } from './entities/MonitorSystemsErrors';

import * as fs from 'fs';
import * as handlebars from 'handlebars';
import * as moment from 'moment';

export class MailController {
    protected NodemailerTransporter: nodemailer.Transporter;

    protected emailAccount = 'sf.buzonfinanzas@tabasco.gob.mx';
    protected passwordAccount = <string>process.env.password;
    protected nodemailerConfig = {
        pool: true,
        maxConnections: 10,
        host: "correo.tabasco.gob.mx",
        port: 465,
        secure: true,
        auth: { user: this.emailAccount, pass: this.passwordAccount },
        tls: {
            // do not fail on invalid certs
            ciphers: 'SSLv3',
            rejectUnauthorized: false
        }
    };
    protected templateDir = __dirname.slice(0, __dirname.indexOf('dist'));

    constructor() {
        let options: SMTPTransport.Options = this.nodemailerConfig;
        this.NodemailerTransporter = nodemailer.createTransport(options);
    }
}

export class AlertMail extends MailController {

    private System: MonitoredSystem;

    constructor() {
        super();
    }

    set CurrentSystem(system: MonitoredSystem) {
        this.System = system;
    }

    /**
     * Enviar correo de alerta.
     */
    public SendEmail(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const response = await getManager().find(MonitorAlarmPeople, { where: { system: this.System } });
            const errors = await getManager().find(MonitorSystemsErrors, { relations: ["error"] });

            // console.log(response, errors);

            if (response.length > 0) {
                console.log(`Intentando acceder al template de correo ${this.templateDir + 'server/email-template.html'}`);
                const html = handlebars.compile(fs.readFileSync(this.templateDir + 'server/email-template.html', 'utf-8'))({
                    administrador: response.map(r => r.name).join(', '),
                    sistema: this.System.systemName,
                    errors: errors,
                    fecha: moment().format('YYYY-MM-DD'),
                    hora: moment().format('HH:mm:ss'),
                })

                const emails = response.map(r => r.email);
                // send mail with defined transport object
                this.NodemailerTransporter.sendMail(<Mail.Options>{
                    from: `<${this.emailAccount}>`, // sender address
                    to: emails, // list of receivers
                    subject: `[${this.System.systemName}][ERROR DE SISTEMA] - SISTEMA DE MONITOREO`, // Subject line
                    text: `El sistema ha sufrido un error, para más detalles verifique el sistema de monitoreo. http://10.14.20.89:3009`,
                    html: html
                }).then(info => {
                    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                    console.log('Message sent: %s', info.messageId);
                    // Preview only available when sending through an Ethereal account
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou..    
                    resolve(info)
                }).catch(e => {
                    console.log("Ocurrio un problema al enviar el correo electronico ", e)
                    reject(e)
                });
            } else {
                reject("No hay correos configurados para este sistema.")
            }
        })
    }
}
