module.exports = (sequelize, DataType) => {
  let model = sequelize.define('Cars', {
    brend: {
      type: DataType.TEXT
    },
    model: {
      type: DataType.TEXT
    },
    year: {
      type: DataType.INTEGER
    },
    engine: {
      type: DataType.INTEGER
    },
    tax: {
      type: DataType.INTEGER
    }
  }, {
    timestamps: true
  });
  /*
    Aceasta linie este comentata pentru a demonstra legatura dintre tabelul Information si tabelul Post prin id
  */
  // model.belongsTo(sequelize.models.Post, {foreignKey: 'id_post', onDelete: 'set null'});
  return model;
};
