import { connectionDB } from './DB/connection.js'
import authController from './modules/auth/auth.controller.js'
import userController from './modules/user/user.controller.js'
import { globalErrorHandling } from './utils/response/error.response.js'
import cors from 'cors'


const bootstrap = (app, express) => { 
    app.use(cors())
    app.use(express.json())

    app.get("/", (req, res, next) => {
        return res.status(200).json({ message: "Welcome in node.js project powered by express and ES6" })
    })
    app.use("/auth", authController)
    app.use("/user", userController)
    app.use(globalErrorHandling)

    app.all("*", (req, res, next) => {
        return res.status(404).json({ message: "In-valid routing" })
    })
    connectionDB()

}

export default bootstrap
