const ndb = require("../../databasePool");

const emailTemplateById = (req, res) => {
    const id = req.params.id;
  
    const db = ndb();
    db.query(
      "SELECT name, subject_en, subject_fr, content_en, content_fr FROM email_templates WHERE id = ?",
      id,
      (err, result) => {
        if (err) {
          res.send({ err: err });
        }
        res.send(result);
      }
    );
    db.end();
}

const updateEmailTemplateById = (req, res) => {
  const id = req.params.id;
  const {
    subject_en, subject_fr, content_en, content_fr
  } = req.body;

  let template = {
    subject_en, subject_fr, content_en, content_fr
  };

  const db = ndb();
  db.query(
    "UPDATE email_templates SET ? WHERE id = ?",
    [template, id],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      res.send(result);
    }
  );
  db.end();
}

const getEmailTemplates = (req, res) => {
  const db = ndb();
  db.query(
    "SELECT id, name, subject_en, subject_fr, content_en, content_fr FROM email_templates",
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      res.send(result);
    }
  );
  db.end();
}

module.exports = {
  updateEmailTemplateById,
  emailTemplateById,
  getEmailTemplates
};
