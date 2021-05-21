import express from "express" // importing 3rd part module
import listEndpoints from "express-list-endpoints"
import cors from "cors"

import reviewsRoutes from "./students/index.js"

import { badRequestErrorHandler, notFoundErrorHandler, forbiddenErrorHandler, catchAllErrorHandler } from "./errorHandlers.js"

const server = express()

const port = process.env.PORT || 3001 // loading the environment variable called PORT, contained in .env file

// ******** MIDDLEWARES ************
const loggerMiddleware = (req, res, next) => {
  console.log(`Request method: ${req.method} ${req.url} -- ${new Date()}`)
  next() // mandatory to give the control to what is happening next (next middleware in chain or route handler)
}

server.use(loggerMiddleware)
server.use(cors())
server.use(express.json()) // If I do not specify this line of code BEFORE the routes, all the request bodies are going to be undefined

// ******** ROUTES ************
server.use("/reviews", reviewsRoutes) // /reviews will be the prefix for all the endpoints contained in the reviews Router


// ******** ERROR MIDDLEWARES ************

server.use(badRequestErrorHandler)
server.use(notFoundErrorHandler)
server.use(forbiddenErrorHandler)
server.use(catchAllErrorHandler)

console.table(listEndpoints(server))

server.listen(port, () => {
  console.log("Server listening on port ", port)
})
