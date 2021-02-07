const ndb = require("../../databasePool");
const transporter = require("../../emailserver");

const sendEmail = (req, res) => {
    let id = req.params.id;
    const {
      formid,
      name,
      email,
      language,
      hostname,
      repName,
      repEmail,
      phoneNumber,
      nff,
      isCustomer,

      deliveryDate,
      deliveryNumber,
      deliveryStatus,
      newPassword
    } = req.body;
    id = id == undefined ? req.body.id : id;

    console.log({
      id,
      formid,
      name,
      email,
      language,
      hostname,
      repName,
      repEmail,
      phoneNumber,
      nff,
      isCustomer,

      deliveryDate,
      deliveryNumber,
      deliveryStatus
    })

    let subject_en;
    let subject_fr;
    let content_en;
    let content_fr;
    let staff_id;
    let sendStaff = true;
  
    const db = ndb();
    db.query(
      "SELECT id, name, subject_en, subject_fr, content_en, content_fr FROM email_templates ORDER BY id ASC",
      (err, result) => {
        if (err) {
          res && res.send({ err: err });
        }
        if (id == 1) {
          subject_en = result[0].subject_en;
          subject_fr = result[0].subject_fr;
          content_en = result[0].content_en;
          content_fr = result[0].content_fr;
          staff_id = 1;
          if (!repName) sendStaff = false;
        }
        else if (id == 3) {
          subject_en = result[2].subject_en;
          subject_fr = result[2].subject_fr;
          content_en = result[2].content_en;
          content_fr = result[2].content_fr;
          staff_id = 3;
        }
        else if (id == 5) {
          subject_en = result[4].subject_en;
          subject_fr = result[4].subject_fr;
          content_en = result[4].content_en;
          content_fr = result[4].content_fr;
          staff_id = 4;
          sendStaff = false;
        }

        else if (id == 6) {
          subject_en = result[5].subject_en;
          subject_fr = result[5].subject_fr;
          content_en = result[5].content_en;
          content_fr = result[5].content_fr;
          sendStaff = false;
        }

        if (content_en && content_fr && subject_en && subject_fr) {
          email && (content_en = content_en.replace(/{customer_email}/g, email));
          name && (content_en = content_en.replace(/{customer_name}/g, name));
          formid && (content_en = content_en.replace(/{formid}/g, formid));
          hostname && (content_en = content_en.replace(/{host_name}/g, hostname));
          nff && (content_en = content_en.replace(/{nff}/g, nff));
          newPassword && (content_en = content_en.replace(/{new_password}/g, newPassword));

          deliveryNumber && (content_en = content_en.replace(/{delivery_number}/g, deliveryNumber));
          deliveryDate && (content_en = content_en.replace(/{delivery_date}/g, deliveryDate.split('T')[0]));
          deliveryStatus && (content_en = content_en.replace(/{delivery_status}/g, deliveryStatus));
  
          email && (content_fr = content_fr.replace(/{customer_email}/g, email));
          name && (content_fr = content_fr.replace(/{customer_name}/g, name));
          formid && (content_fr = content_fr.replace(/{formid}/g, formid));
          hostname && (content_fr = content_fr.replace(/{host_name}/g, hostname));
          nff && (content_fr = content_fr.replace(/{nff}/g, nff));
          newPassword && (content_fr = content_fr.replace(/{new_password}/g, newPassword));
          
          deliveryNumber && (content_fr = content_fr.replace(/{delivery_number}/g, deliveryNumber));
          deliveryDate && (content_fr = content_fr.replace(/{delivery_date}/g, deliveryDate.split('T')[0]));
          deliveryStatus && (content_fr = content_fr.replace(/{delivery_status}/g, deliveryStatus));
  
          if (language === 'en') {
              // send mail with defined transport object
              transporter.sendMail({
                from: '"Natural Farms Portal" <no_reply@portal.naturalfarms.ca>', // sender address
                to: email, // list of receivers
                subject: subject_en, // Subject line
                text: content_en.replace(/<[^>]*>/g, ''), // plain text body
                html: template({subject: subject_en, content_en}).english, // html body
              }).then((info) => console.log("Message sent: %s", info.messageId));
          } else {
              // send mail with defined transport object
              transporter.sendMail({
                from: '"Portail - La Ferme au Naturel" <no_reply@portal.naturalfarms.ca>', // sender address
                to: email, // list of receivers
                subject: subject_fr, // Subject line
                text: content_fr.replace(/<[^>]*>/g, ''), // plain text body
                html: template({subject: subject_fr, content_fr}).french, // html body
              }).then((info) => console.log("Message sent: %s", info.messageId));
          }
  
          // SEND TO STAFF
          if (sendStaff) {
            subject_en = isCustomer ? result[staff_id].subject_en + ' - Needs Attention - From Customer' : result[staff_id].subject_en;
            content_en = result[staff_id].content_en;
    
            email && (content_en = content_en.replace(/{customer_email}/g, email));
            phoneNumber && (content_en = content_en.replace(/{customer_phone}/g, phoneNumber));
            name && (content_en = content_en.replace(/{customer_name}/g, name));
            formid && (content_en = content_en.replace(/{formid}/g, formid));
            hostname && (content_en = content_en.replace(/{host_name}/g, hostname));
            repName && (content_en = content_en.replace(/{sales_rep_name}/g, repName));
            nff && (content_en = content_en.replace(/{nff}/g, nff));
    
            // send mail with defined transport object
            transporter.sendMail({
              from: '"Natural Farms Portal" <no_reply@portal.naturalfarms.ca>', // sender address
              to: repEmail, // list of receivers
              //cc: "admin@naturalfarms.ca",
              subject: subject_en, // Subject line
              text: content_en.replace(/<[^>]*>/g, '') + '\n' + content_en.replace(/<[^>]*>/g, ''), // plain text body
              html: template({subject: subject_en, content_en}).english, // html body
            }).then((info) => console.log("Message sent: %s", info.messageId));

            res && res.send({message: 'Successfully sent!'});
          }
        }
      }
    );
    db.end();
}

const template = ({subject, content_en, content_fr}) => {
  return (
    {
      english: `<body style='margin: 0;background: #eee;padding: 20px 0;'><div class='content' style='width: 100%;
      margin: 2% auto;
      background: #fff;'><div class='inner-content'><div class='subject' style='padding: 1.6em;
      color: #414141;
      font-size: 1.85em;
      font-weight: 300;
      font-family: ProximaNova-Light,Avenir-Light,Avenir,segoeuisl,Segoe UI Semilight,Segoe UI,Roboto-Light,Roboto,HelveticaNeue-Light,Helvetica Neue,Arial,sans-serif;
      text-align: left;
      line-height: 1;'>${subject}</div><div class='message' style='padding: 0 3.75em;
      color: #414141;
      font-weight: 400;
      font-family: ProximaNova-Regular,Avenir-Roman,Avenir,segoeui,Segoe UI,Roboto-Regular,Roboto,HelveticaNeue,Helvetica Neue,Arial,sans-serif;
      line-height: 1.5;
      padding-bottom: 2.75em;'>
      ${content_en}
      </div><div class='footer' style='padding: 3.75em;
      background: #f8f8f8;
      color: #737373;
      font-size: 10px;
      font-weight: 400;
      font-family: ProximaNova-Regular,Avenir-Roman,Avenir,segoeui,Segoe UI,Roboto-Regular,Roboto,HelveticaNeue,Helvetica Neue,Arial,sans-serif;
      text-align: justify;
      line-height: 1.3;'><div class='footer-message' style='text-align: center;
      margin-top: -2.5em;
      margin-bottom: 1.5em;
      font-style: oblique;'>Thanks for trusting us.</div>This message is from Natural Farms Inc. Natural Farms Inc. treats your personal information with the utmost care. <br>To report abuse related to this email, please contact us at admin@naturalfarms.ca.<br><span class='footer-logo' style='float:right;'><img width='100' src='https://naturalfarms.ca/wp-content/uploads/2017/03/logo-1.png' alt='Natural Farms'/></span></div></div></div></body>
      `,

      french: `<body style='margin: 0;background: #eee;padding: 20px 0;'><div class='content' style='width: 100%;
      margin: 2% auto;
      background: #fff;'><div class='inner-content'><div class='subject' style='padding: 1.6em;
      color: #414141;
      font-size: 1.85em;
      font-weight: 300;
      font-family: ProximaNova-Light,Avenir-Light,Avenir,segoeuisl,Segoe UI Semilight,Segoe UI,Roboto-Light,Roboto,HelveticaNeue-Light,Helvetica Neue,Arial,sans-serif;
      text-align: left;
      line-height: 1;'>${subject}</div><div class='message' style='padding: 0 3.75em;
      color: #414141;
      font-weight: 400;
      font-family: ProximaNova-Regular,Avenir-Roman,Avenir,segoeui,Segoe UI,Roboto-Regular,Roboto,HelveticaNeue,Helvetica Neue,Arial,sans-serif;
      line-height: 1.5;
      padding-bottom: 2.75em;'>
      ${content_fr}
      </div><div class='footer' style='padding: 3.75em;
      background: #f8f8f8;
      color: #737373;
      font-size: 10px;
      font-weight: 400;
      font-family: ProximaNova-Regular,Avenir-Roman,Avenir,segoeui,Segoe UI,Roboto-Regular,Roboto,HelveticaNeue,Helvetica Neue,Arial,sans-serif;
      text-align: justify;
      line-height: 1.3;'><div class='footer-message' style='text-align: center;
      margin-top: -2.5em;
      margin-bottom: 1.5em;
      font-style: oblique;'>Merci de nous avoir fait confiance.</div>Ce message est de La Ferme au Naturel. La Ferme au Naturel traite vos informations personnelles avec le plus grand soin.<br> Pour signaler un abus lié à cet e-mail, veuillez nous contacter à admin@lafermeaunaturel.com.<br><span class='footer-logo' style='float:right;'><img width='100' src='https://naturalfarms.ca/wp-content/uploads/2017/03/logo-1.png' alt='La Ferme au Naturel'/></span></div></div></div></body>
      `
  });
}

module.exports = {
  sendEmail
};
