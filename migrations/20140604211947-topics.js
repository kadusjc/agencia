module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable('tb_topicos_gls', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id_cliente: DataTypes.INTEGER,
      assunto: DataTypes.STRING,
      mensagem: DataTypes.TEXT,
      data: DataTypes.DATE
    });
    done();
  },
  down: function(migration, DataTypes, done) {
    done()
  }
}
