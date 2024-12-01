require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

console.log('MONGODB_URI:', process.env.MONGODB_URI);

const app = express();
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000', 'https://blyn04.github.io'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
}));

// Logging middleware
app.use((req, res, next) => {
    console.log(`Received ${req.method} request for '${req.url}'`);
    next();
});

// Connect to MongoDB Atlas using the environment variable
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// User schema and model for authentication
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);

// Officer schema and model
const OfficerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    position: { type: String, required: true },
    present: { type: Boolean, default: false },
});

const Officer = mongoose.model('Officer', OfficerSchema);

// Student schema and model
const StudentSchema = new mongoose.Schema({
    customId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    section: { type: String, required: true },
});

const Student = mongoose.model('Student', StudentSchema);

// Updated Event schema and model
const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    location: { type: String },
    students: [
        {
            studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
            name: { type: String },
            present: { type: Boolean, default: false },
        },
    ],
});

const Event = mongoose.model('Event', EventSchema);

app.post('/main/events', async (req, res) => {
    const { title, description, date, location, students } = req.body;

    try {
        const event = new Event({ title, description, date, location, students });
        await event.save();
        res.status(201).json(event);
    } catch (err) {
        console.error('Error creating event:', err.message);
        res.status(500).json({ message: 'Failed to create event' });
    }
});

app.post('/main/events/:id/students', async (req, res) => {
    const { studentId, name, present } = req.body;

    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        event.students.push({ studentId, name, present });
        await event.save();
        res.status(201).json(event);
    } catch (err) {
        console.error('Error adding student to event:', err.message);
        res.status(500).json({ message: 'Failed to add student to event' });
    }
});


app.put('/main/events/:eventId/students/:studentId', async (req, res) => {
    const { present } = req.body;

    try {
        const event = await Event.findById(req.params.eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const student = event.students.find((s) => s.studentId.toString() === req.params.studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found in event' });
        }

        student.present = present;
        await event.save();
        res.json(event);
    } catch (err) {
        console.error('Error updating student attendance:', err.message);
        res.status(500).json({ message: 'Failed to update student attendance' });
    }
});

app.get('/main/events/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('students.studentId');
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (err) {
        console.error('Error fetching event:', err.message);
        res.status(500).json({ message: 'Failed to fetch event' });
    }
});

app.delete('/main/events/:eventId/students/:studentId', async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        event.students = event.students.filter((s) => s.studentId.toString() !== req.params.studentId);
        await event.save();
        res.status(204).send();
    } catch (err) {
        console.error('Error removing student from event:', err.message);
        res.status(500).json({ message: 'Failed to remove student from event' });
    }
});

app.get('/main/events', async (req, res) => {
    try {
      const events = await Event.find();
      const formattedEvents = events.map((event) => ({
        _id: event._id,
        title: event.title,
        description: event.description,
        date: event.date.toISOString().split('T')[0], // Format date to YYYY-MM-DD
        students: event.students,
      }));
      res.json(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ error: 'Failed to fetch events' });
    }
  });

  app.get('/main/students/:date', async (req, res) => {
    try {
      const eventDate = new Date(req.params.date);
      const students = await Student.find(); // Fetch all students
      res.json(students);
    } catch (error) {
      console.error('Error fetching students:', error);
      res.status(500).json({ error: 'Failed to fetch students' });
    }
  });
  

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// CRUD operations for Officers

// Add officer route
app.post('/main/jpcs-officers', async (req, res) => {
    const { name, position, present } = req.body;

    try {
        const officer = new Officer({ name, position, present });
        await officer.save();
        res.status(201).json(officer);
    } catch (err) {
        console.error('Error adding officer:', err.message);
        res.status(500).json({ message: 'Failed to add officer' });
    }
});

// Get all officers route
app.get('/main/jpcs-officers', async (req, res) => {
    try {
        const officers = await Officer.find();
        res.json(officers);
    } catch (err) {
        console.error('Error fetching officers:', err);
        res.status(500).json({ message: 'Failed to fetch officers' });
    }
});

// Update officer presence status
app.put('/main/jpcs-officers/:id', async (req, res) => {
    const { present } = req.body;

    try {
        const updatedOfficer = await Officer.findByIdAndUpdate(req.params.id, { present }, { new: true });
        if (!updatedOfficer) {
            return res.status(404).json({ message: 'Officer not found' });
        }
        res.json(updatedOfficer);
    } catch (err) {
        console.error('Error updating officer:', err);
        res.status(500).json({ message: 'Failed to update officer' });
    }
});


// Delete officer route
app.delete('/main/jpcs-officers/:id', async (req, res) => {
    try {
        const deletedOfficer = await Officer.findByIdAndDelete(req.params.id);
        if (!deletedOfficer) {
            return res.status(404).json({ message: 'Officer not found' });
        }
        res.status(204).send();
    } catch (err) {
        console.error('Error deleting officer:', err);
        res.status(500).json({ message: 'Failed to delete officer' });
    }
});

// CRUD operations for Students
// Add student route
app.post('/main/attendance', async (req, res) => {
    const { name, section, customId } = req.body;

    try {
        const existingStudent = await Student.findOne({ name, section });
        if (existingStudent) {
            return res.status(400).json({ message: 'Student with this name already exists in this section' });
        }

        const student = new Student({ name, section, customId });
        await student.save();
        res.status(201).json(student);
    } catch (err) {
        console.error('Error adding student:', err.message);
        res.status(500).json({ message: 'Failed to add student' });
    }
});

// Get all students route (updated to filter by section)
app.get('/main/attendance', async (req, res) => {
    const { section } = req.query; // Get the section from query parameters
    try {
        const query = section ? { section } : {}; // Create a query object
        const students = await Student.find(query); // Fetch students based on the query
        res.json(students);
    } catch (err) {
        console.error('Error fetching students:', err);
        res.status(500).json({ message: 'Failed to fetch students' });
    }
});

// Update student route
app.put('/main/attendance/:id', async (req, res) => {
    const { name, section } = req.body;
    try {
        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, { name, section }, { new: true });
        if (!updatedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(updatedStudent);
    } catch (err) {
        console.error('Error updating student:', err);
        res.status(500).json({ message: 'Failed to update student' });
    }
});

// Delete student route
app.delete('/main/attendance/:id', async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);
        if (!deletedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(204).send();
    } catch (err) {
        console.error('Error deleting student:', err);
        res.status(500).json({ message: 'Failed to delete student' });
    }
});

// Start server
app.listen(5000, () => {
    console.log('Server running on port 5000');
});
