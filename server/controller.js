import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User, Message } from './db/models.js'

const handlerFunctions = {

    postUser: async (req, res) => {
        const {userName, userPass} = req.body

        const user = await User.findOne({where: {userName: userName}})

        if (user) {
            bcrypt.compare(userPass, user.userPass, (err, result) => {
                if (err) {
                    console.error('Error comparing passwords:', err)
                    res.status(500).json({message: 'Internal server error'})
                } else {
                    if (result) {
                        req.session.user = user
                        const token = jwt.sign({userId: user.userId}, 'secretKey', {expiresIn: '1hr'})
                        res.status(200).json({user, token})
                    } else {
                        res.status(401).json({message: 'Invalid credentials'})
                    }
                }
            })
        } else {
            res.status(404).json({message: 'Invalid credentials'})
        }
    }
}

export default handlerFunctions