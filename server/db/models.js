import { DataTypes, Model } from 'sequelize'
import url from 'url'
import connectToDB from './db.js'

const db = await connectToDB('postgresql:///sockets')

class User extends Model {}

User.init (
    {
        userId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        userName: {
            type: DataTypes.STRING(30),
            unique: true
        },
        userPass: {
            type: DataTypes.STRING
        }
    }, {
        sequelize: db
    }
)

class Message extends Model {}

Message.init (
    {
        messageId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            foreignKey: true
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false
        },
        timestamp: {
            type: DataTypes.STRING(30),
            allowNull: false
        }
    }, {
        sequelize: db
    }
)

User.hasMany(Message, {foreignKey: 'userId'})

if (process.argv[1] === url.fileURLToPath(import.meta.url)) {
    console.log('Syncing database...');
    await db.sync({force: true})
    console.log('Finished syncing database!');
}

export { User, Message, db }