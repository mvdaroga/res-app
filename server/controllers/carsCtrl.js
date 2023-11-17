module.exports = db => {
  return {
    create: (req, res) => {
      console.log(req,res)
      db.models.Cars.create(req.body).then(() => {
        res.send({ success: true });
      }).catch(() => res.status(401));
    },

    update: (req, res) => {
      db.models.Cars.update(req.body, { where: { id: req.body.id } }).then(() => {
        res.send({ success: true })
      }).catch(() => res.status(401));
    },

    findAll: (req, res) => {
      db.query(`SELECT id, brend, model, year, engine, tax
      FROM "Cars"
      ORDER BY id`, { type: db.QueryTypes.SELECT }).then(resp => {
        res.send(resp);
      }).catch(() => res.status(401));
    },

    find: (req, res) => {
      db.query(`SELECT id, brend, model, year, engine, tax
      FROM "Cars"`, { type: db.QueryTypes.SELECT }).then(resp => {
        res.send(resp[0]);
      }).catch(() => res.status(401));
    },

    destroy: (req, res) => {
      db.query(`DELETE FROM "Cars" WHERE id = ${req.params.id}`, { type: db.QueryTypes.DELETE }).then(() => {
        res.send({ success: true });
      }).catch(() => res.status(401));
    }
  };
};
