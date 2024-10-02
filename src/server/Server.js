require('dotenv').config(); // Load environment variablesno

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
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Include allowed methods if needed
    credentials: true, // Include credentials if necessary (for cookies, etc.)
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
    present: { type: Boolean, default: false }, // Default to false (not present)
});

const Officer = mongoose.model('Officer', OfficerSchema);

// Student schema and model
const StudentSchema = new mongoose.Schema({
    customId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    section: { type: String, required: true },
});

const Student = mongoose.model('Student', StudentSchema);

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

// Get all students route
app.get('/main/attendance', async (req, res) => {
    try {
        const students = await Student.find();
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
