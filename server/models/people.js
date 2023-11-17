module.exports = (sequelize, DataType) => {
  let model = sequelize.define('People', {
    name: {
      type: DataType.TEXT
    },
    surname: {
      type: DataType.TEXT
    },
    ssn: {
      type: DataType.BIGINT
    },
    age: {
      type: DataType.INTEGER
    },
    cars: {
      type: DataType.TEXT
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
