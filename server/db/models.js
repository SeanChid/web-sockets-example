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

class Lobby extends Model {}

Lobby.init (
    {
        lobbyId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        entryCode: {
            type: DataTypes.STRING(30),
            unique: true,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            foreignKey: true
        }
    }, {
        sequelize: db
    }
)

// class UserLobby extends Model {}

// UserLobby.init({}, {
//     sequelize: db
// })

class Message extends Model {}

Message.init (
    {
        messageId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        lobbyId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            foreignKey: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            foreignKey: true
        },
        userName: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        type: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        message: {
            type: DataTypes.TEXT,
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

// User.belongsToMany(Lobby, {through: UserLobby})
// Lobby.belongsToMany(User, {through: UserLobby})
// Lobby.hasMany(Message, {foreignKey: 'lobbyId'})
User.hasMany(Message, {foreignKey: 'userId'})
User.hasMany(Lobby, {foreignKey: 'userId'})

if (process.argv[1] === url.fileURLToPath(import.meta.url)) {
    console.log('Syncing database...');
    await db.sync({force: true})
    console.log('Finished syncing database!');
}

export { User, Lobby, Message, db }