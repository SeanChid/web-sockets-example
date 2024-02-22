import bcrypt from 'bcrypt'
import userData from './data/user.json' assert { type: 'json' }
import { User, db } from './models.js' 

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

await db.close()
console.log('Finished seeding database');