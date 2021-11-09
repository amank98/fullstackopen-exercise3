const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
morgan.token('body', function (req:any, res:any) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())

interface IPerson {
    id: number,
    name: string,
    number: string
}

let people = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
] as IPerson[]

app.get("/", (request:any, response:any) => {
  response.send('WE OUT HERE BOII')
})

app.get("/info", (request:any, response:any) => {
  response.send('There are currently ' + people.length + ' people in the phonebook. <br><br> Request was made at ' + Date().toLocaleString())
})

app.get("/api/people", (request: any, response: any) => {
  response.json(people)
})

app.get("/api/people/:id", (request: any, response: any) => {
  const id = Number(request.params.id)
  const person = people.find(people => people.id === id)

  if (person) {
    response.json(person)
  }
  else {
    response.status(404)
    response.end()
  }
})

app.delete("/api/people/:id", (request: any, response: any) => {
  const id = Number(request.params.id)
  const person = people.find(people => people.id === id)
  
  if (person) {
    people = people.filter(person => person.id !== id)
    response.json(person)
  }
  else {
    response.status(404)
    response.end()
  }
})

app.post("/api/people", (request: any, response: any) => {
  if (!request.body.name || !request.body.number) {
    response.status(400)
    return response.json({
      "error": "missing name and/or number from post request body"
    })
  }

  if (people.find(person => person.name === request.body.name)) {
    response.status(409)
    return response.json({
      "error": "name must be unique"
    })
  }
  const person = {id: Math.ceil(1000*Math.random()), ...request.body} as IPerson
  people = people.concat(person)

  response.json(person)
})

const unknownEndpoint = (request:any, response:any, next:any) => {
  response.json({
    "error": "cannot find the endpoint specified"
  })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log('server running')
})