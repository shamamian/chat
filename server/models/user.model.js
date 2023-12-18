module.exports = (sequelize, DataTypes) => {
  const { STRING } = DataTypes;
  const User = sequelize.define(
    "users",
    {
      username: STRING,
      password: STRING,
      country: STRING,
      gender: STRING
    },
    {
      timestamps: true,
      freezeTableName: true,
    }
  );
  return User;
};
