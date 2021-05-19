/*
****************** STUDENTS CRUD ********************
1. CREATE → POST http://localhost:3001/students (+ body)
2. READ → GET http://localhost:3001/students (+ optional query parameters)
3. READ → GET http://localhost:3001/students/:id
4. UPDATE → PUT http://localhost:3001/students/:id (+ body)
5. DELETE → DELETE http://localhost:3001/students/:id

*/

import express from "express" // 3rd party module
import fs from "fs" // core module
import { fileURLToPath } from "url" // core module
import { dirname, join } from "path" // core module
import uniqid from "uniqid" // 3rd party module
import { validationResult } from "express-validator"
import createError from "http-errors"

import { studentValidation } from "./validation.js"

const studentsRouter = express.Router()

const filePath = fileURLToPath(import.meta.url) // C:\Strive\FullStack\2021\Mar21\M5\D2\src\students\index.js <-- CURRENT FILE PATH
const studentsFolderPath = dirname(filePath) // C:\Strive\FullStack\2021\Mar21\M5\D2\src\students
const studentJSONPath = join(studentsFolderPath, "students.json")
// WINDOWS STYLE --> C:\Strive\FullStack\2021\Mar21\M5\D2\src\students\students.json
// UNIX STYLE --> M5//D2//src//students//students.json

// DO NOT CONCATENATE PATHS WITH PLUS SYMBOL!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// USE JOIN INSTEAD!!!!!!!!!!!!!!!!!!!!!!!!!!!

studentsRouter.post("/", studentValidation, (req, res, next) => {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      // if we had errors

      next(createError(400, { errorList: errors }))
    } else {
      // 1. read request body
      const newStudent = { ...req.body, createdAt: new Date(), _id: uniqid() }

      // 2. read the old content of the file students.json

      const students = JSON.parse(fs.readFileSync(studentJSONPath).toString())

      // 3. push the new student into students array
      students.push(newStudent)

      // 4. write the array back into the file students.json
      fs.writeFileSync(studentJSONPath, JSON.stringify(students))

      // 5. send back proper response

      res.status(201).send(newStudent._id)
    }
  } catch (error) {
    next(error)
  }
}) // (URL, ROUTE HANDLER), Route handler (req, res, next) => {}

studentsRouter.get("/", (req, res, next) => {
  try {
    // 1. read students.json content

    const contentAsABuffer = fs.readFileSync(studentJSONPath) // we get back a buffer which is MACHINE READABLE
    //const contentAsAString = contentAsABuffer.toString() // we need to convert it to a string to have it in a HUMAN READABLE form

    // 2. send the content as a response
    const students = JSON.parse(contentAsABuffer) // string needs to be converted into a JSON
    res.send(students)
  } catch (error) {
    next(error)
  }
})

studentsRouter.get("/:id", (req, res, next) => {
  try {
    // 1. read the content of the file
    const students = JSON.parse(fs.readFileSync(studentJSONPath).toString())

    // 2. find the one with the correspondant id

    const student = students.find(s => s._id === req.params.id)

    if (student) {
      // 3. send it as a response
      res.send(student)
    } else {
      next(createError(404, `Student ${req.params.id} not found`))
    }
  } catch (error) {
    next(error)
  }
})

studentsRouter.put("/:id", (req, res, next) => {
  try {
    // 1. read the old content of the file
    const students = JSON.parse(fs.readFileSync(studentJSONPath).toString())

    // 2. modify the specified student

    const remainingStudents = students.filter(student => student._id !== req.params.id)

    const updatedStudent = { ...req.body, _id: req.params.id }

    remainingStudents.push(updatedStudent)

    // 3. write the file with the updated list
    fs.writeFileSync(studentJSONPath, JSON.stringify(remainingStudents))
    // 4. send a proper response

    res.send(updatedStudent)
  } catch (error) {
    next(error)
  }
})

studentsRouter.delete("/:id", (req, res, next) => {
  try {
    // 1. read the old content of the file
    const students = JSON.parse(fs.readFileSync(studentJSONPath).toString())

    // 2. filter out the specified id

    const remainingStudents = students.filter(student => student._id !== req.params.id) // ! = =

    // 3. write the remaining students into the file students.json
    fs.writeFileSync(studentJSONPath, JSON.stringify(remainingStudents))

    // 4. send back a proper response

    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

export default studentsRouter
