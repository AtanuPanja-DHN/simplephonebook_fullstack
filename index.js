const express = require('express')
const app = express()
const morgan = require('morgan') // middleware for logging data of a request (available as an npm package)

// adding the middleware static which would be useful for the react build.
app.use(express.static('build'))

// allowing requests from all origins using cors module
const cors = require('cors')
app.use(cors())

// step8: modifying the log of POST request using morgan
app.use(morgan(function (tokens, req, res) {
    const method = tokens.method(req, res)
    let arr = [
      method,
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms'
    ]
    // console.log(tokens)
    // console.log(method,typeof method)
    if(method === 'POST'){
        console.log('The method is post');
        // arr.push(tokens.req.body)
        // console.log(req.body)

        arr.push(JSON.stringify(req.body))
    }

    return arr.join(' ')
}))

let persons = [
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
]

// step7: add morgan middleware for logging the requests data (npm install morgan)
// app.use(morgan('tiny'))

// step1 : http://localhost:3001/api/persons
app.get('/',(request,response)=>{
    response.send('<h1>Phonebook backend</h1>')
})

app.get('/api/persons',(request,response)=>{
    response.json(persons)
})

// step2 : http://localhost:3001/info
app.get('/info',(request,response)=>{
    const info = `
        <p>Phonebook has info for ${persons.length} people</p>
        <br/>
        <p>${new Date()}</p>
    `;
    response.send(info)
})

// step3: http://localhost:3001/api/persons/5 (some id)
app.get('/api/persons/:id',(request,response)=>{
    const matches = persons.filter(person => person.id === parseInt(request.params.id))
    if(matches.length === 0){
        response.status(404).end()
    }
    else{
        response.json(matches)
    }
})

// step4: deleting a persons entry from the phonebook
app.delete('/api/persons/:id',(request,response)=>{
    const id = request.params.id
    const matches = persons.filter(person => person.id === parseInt(id))
    if(matches.length === 0){
        response.status(400).end()
    }
    else{
        persons = persons.filter(person => person.id !== parseInt(id))
        response.json(persons)
    }
})

// step5: adding new resources to our backend
app.use(express.json()) // uses json-parser 

app.post('/api/persons',(request,response)=>{
    const entry = request.body // the post data is added to the request.body object
    // step6: name missing
    if(!entry || (!entry.name && !entry.number)){
        return response.status(404).send(
            {
                error: "entry missing"
            }
        )
    }
    if(!entry.name){
        return response.status(404).send(
            {
                error: "name should not be empty"
            }
        )
    }
    if(!entry.number){
        return response.status(404).send(
            {
                error: "number should not be empty"
            }
        )
    }
    if(persons.filter(person=>person.name === entry.name).length > 0){
        return response.status(404).send(
            {
                error: "name must be unique"
            }
        )
    }
    console.log(entry)
    const person = {
        ...entry,
        id: 5 + parseInt(Math.random() * 1000)
    }
    console.log(person)
    persons = persons.concat(person)
    response.json(persons)
})

const PORT = process.env.PORT || 3001
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})