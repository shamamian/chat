module.exports = (sequelize, DataTypes) => {
    const { STRING } = DataTypes;
    const Token = sequelize.define(
        'usertoken',
        {
            refreshToken: STRING
        },
        {   
            timestamps: false,
            freezeTableName: true
        }
    );
    return Token
}