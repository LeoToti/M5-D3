/*
****************** STUDENTS CRUD ********************
1. CREATE → POST http://localhost:3001/reviews (+ body)
2. READ → GET http://localhost:3001/reviews (+ optional query parameters)
3. READ → GET http://localhost:3001/reviews/:id
4. UPDATE → PUT http://localhost:3001/reviews/:id (+ body)
5. DELETE → DELETE http://localhost:3001/reviews/:id

*/

import express from "express" // 3rd party module
import fs from "fs" // core module
import { fileURLToPath } from "url" // core module
import { dirname, join } from "path" // core module
import uniqid from "uniqid" // 3rd party module
import { validationResult } from "express-validator"
import createError from "http-errors"

import { reviewValidation } from "./validation.js"

const reviewsRouter = express.Router()

const filePath = fileURLToPath(import.meta.url) // C:\Strive\FullStack\2021\Mar21\M5\D2\src\reviews\index.js <-- CURRENT FILE PATH
const reviewsFolderPath = dirname(filePath) // C:\Strive\FullStack\2021\Mar21\M5\D2\src\reviews
const reviewJSONPath = join(reviewsFolderPath, "reviews.json")
// WINDOWS STYLE --> C:\Strive\FullStack\2021\Mar21\M5\D2\src\reviews\reviews.json
// UNIX STYLE --> M5//D2//src//reviews//reviews.json

// DO NOT CONCATENATE PATHS WITH PLUS SYMBOL!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// USE JOIN INSTEAD!!!!!!!!!!!!!!!!!!!!!!!!!!!

reviewsRouter.post("/", reviewValidation, (req, res, next) => {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      // if we had errors

      next(createError(400, { errorList: errors }))
    } else {
      // 1. read request body
      const newReview = { ...req.body, createdAt: new Date(), _id: uniqid() }

      // 2. read the old content of the file reviews.json

      const reviews = JSON.parse(fs.readFileSync(reviewJSONPath).toString())

      // 3. push the new review into reviews array
      reviews.push(newReview)

      // 4. write the array back into the file reviews.json
      fs.writeFileSync(reviewJSONPath, JSON.stringify(reviews))

      // 5. send back proper response

      res.status(201).send(newReview._id)
    }
  } catch (error) {
    next(error)
  }
}) // (URL, ROUTE HANDLER), Route handler (req, res, next) => {}

reviewsRouter.get("/", (req, res, next) => {
  try {
    // 1. read reviews.json content

    const contentAsABuffer = fs.readFileSync(reviewJSONPath) // we get back a buffer which is MACHINE READABLE
    //const contentAsAString = contentAsABuffer.toString() // we need to convert it to a string to have it in a HUMAN READABLE form

    // 2. send the content as a response
    const reviews = JSON.parse(contentAsABuffer) // string needs to be converted into a JSON
    res.send(reviews)
  } catch (error) {
    next(error)
  }
})

reviewsRouter.get("/:id", (req, res, next) => {
  try {
    // 1. read the content of the file
    const reviews = JSON.parse(fs.readFileSync(reviewJSONPath).toString())

    // 2. find the one with the correspondant id

    const review = reviews.find(s => s._id === req.params.id)

    if (review) {
      // 3. send it as a response
      res.send(review)
    } else {
      next(createError(404, `Review ${req.params.id} not found`))
    }
  } catch (error) {
    next(error)
  }
})

reviewsRouter.put("/:id", (req, res, next) => {
  try {
    // 1. read the old content of the file
    const reviews = JSON.parse(fs.readFileSync(reviewJSONPath).toString())

    // 2. modify the specified review

    const remainingReviews = reviews.filter(review => review._id !== req.params.id)

    const updatedReview = { ...req.body, _id: req.params.id }

    remainingReviews.push(updatedReview)

    // 3. write the file with the updated list
    fs.writeFileSync(reviewJSONPath, JSON.stringify(remainingReviews))
    // 4. send a proper response

    res.send(updatedReview)
  } catch (error) {
    next(error)
  }
})

reviewsRouter.delete("/:id", (req, res, next) => {
  try {
    // 1. read the old content of the file
    const reviews = JSON.parse(fs.readFileSync(reviewJSONPath).toString())

    // 2. filter out the specified id

    const remainingReviews = reviews.filter(review => review._id !== req.params.id) // ! = =

    // 3. write the remaining reviews into the file reviews.json
    fs.writeFileSync(reviewJSONPath, JSON.stringify(remainingReviews))

    // 4. send back a proper response

    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

export default reviewsRouter
