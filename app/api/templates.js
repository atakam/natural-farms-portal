const db = require("../../databasePool");

const emailTemplateById = (req, res) => {
    const id = req.params.id;
  
    db.query(
      "SELECT subject_en, subject_fr, content_en, content_fr FROM email_templates WHERE id = ?",
      id,
      (err, result) => {
        if (err) {
          res.send({ err: err });
        }
        res.send(result);
      }
    );
}

const updateEmailTemplateById = (req, res) => {
  const id = req.params.id;
  const {
    subject_en, subject_fr, content_en, content_fr
  } = req.body;

  let template = {
    subject_en, subject_fr, content_en, content_fr
  };

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
}

const getEmailTemplates = (req, res) => {
  db.query(
    "SELECT id, subject_en, subject_fr, content_en, content_fr FROM email_templates",
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      res.send(result);
    }
  );
}

module.exports = {
  updateEmailTemplateById,
  emailTemplateById,
  getEmailTemplates
};
