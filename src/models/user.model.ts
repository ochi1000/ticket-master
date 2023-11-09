import { DataTypes } from "sequelize";
import { sequelize } from "../config.js";
import jwt from "jsonwebtoken";
const User = sequelize.define('users',
{
    id:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    username:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
    }
});

export default User;
