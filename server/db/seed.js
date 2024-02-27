import bcrypt from 'bcrypt'
import userData from './data/user.json' assert { type: 'json' }
import lobbyData from './data/lobby.json' assert { type: 'json' }
import { User, Lobby, db } from './models.js' 

console.log('Syncing database...')
await db.sync({force: true})
console.log('Seeding database');

const usersInDB = await Promise.all(
    userData.map(async (user) => {
        const {userName, userPass} = user

        const hashedPassword = await bcrypt.hash(userPass, 10)

        const newUser = await User.create({
            userName,
            userPass: hashedPassword
        })
        return newUser
    })
)

const lobbiesInDB = await Promise.all(
    lobbyData.map(async (lobby) => {
        const {entryCode} = lobby
        const newLobby = await Lobby.create({
            entryCode
        })
        return newLobby
    })
)

await db.close()
console.log('Finished seeding database');