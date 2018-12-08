const Joi = require('joi');
const express = require('express');

const app = express();


app.use(express.json());

// Create in-mem database
const courses = [
    {id:1, name: 'Pebble Beach'},
    {id:2, name: 'Spyglass Hill'},
    {id:3, name: 'Torrey Pines'},
];

// What to show on /
app.get('/', (req, res) => {
    res.send('Jonas list of golf courses played!');
});

// List Courses
app.get('/api/courses', (req, res) => {
    res.send(courses);
});

//Add course
app.post('/api/courses', (req, res) => {

    const { error } = validateCourse(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

// Get course by ID
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with that ID was not found');
    res.send(course);
});

// Update course 
app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with that ID was not found');
    
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    course.name = req.body.name;
    res.send(course);
})

// Remove Course
app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with that ID was not found');

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
});

// Function for validating input
function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);
}

//Server starting
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));