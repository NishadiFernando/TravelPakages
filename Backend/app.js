const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
require("dotenv").config();
var cors = require('cors');
const path = require('path');



// import routes
const packageRoute = require('./routes/packageRoute');


const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/error");

const mongoURI = process.env.DATABASE
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
    useCreateIndex: true
})
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

//MIDDLEWARE
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({
  limit: "5mb",
  extended: true
}));
app.use(cookieParser());
app.use(cors());


// app.use('/api', jobTypeRoute);
app.use('/api', packageRoute);
app.use('/uploads', express.static('uploads'));

__dirname = path.resolve()

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')))

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running....')
  })
}

// error middleware
app.use(errorHandler);

//port
const port = process.env.PORT || 9000

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

//integrate

// Creating Schema for Todos (including NIC field)
const todoSchema = new mongoose.Schema({
  title: {
      required: true,
      type: String
  },
  description: String,
  email: {
      required: true,
      type: String
  },
  dob: {
      required: true,
      type: Date
  },
  contactNumber: {
      required: true,
      type: String
  },
  nic: {  // Added NIC field to schema
      required: true,
      type: String
  },
  role: {  // Role field for driver or tour guide
      required: true,
      type: String,
      enum: ['driver', 'tour guide']
  }
});

// Creating Schema for Appointments
const appointmentSchema = new mongoose.Schema({
  todoId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Todo'
  },
  appointmentDate: {
      type: Date,
      required: true
  },
  details: String
});

// Creating models
const Todo = mongoose.model('Todo', todoSchema);
const Appointment = mongoose.model('Appointment', appointmentSchema);

// Create a new todo item
app.post('/todos', async (req, res) => {
  const { title, description, email, dob, contactNumber, nic, role } = req.body;  // Include NIC

  try {
      const newTodo = new Todo({ title, description, email, dob, contactNumber, nic, role });
      await newTodo.save();
      res.status(201).json(newTodo);
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
  }
});

// Get all todo items (optional filter by role)
app.get('/todos', async (req, res) => {
  const role = req.query.role;

  try {
      const filter = role ? { role } : {};
      const todos = await Todo.find(filter);
      res.json(todos);
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
  }
});

// Update a todo item (including NIC)
app.put('/todos/:id', async (req, res) => {
  try {
      const { title, description, email, dob, contactNumber, nic, role } = req.body;  // Include NIC
      const id = req.params.id;

      const updatedTodo = await Todo.findByIdAndUpdate(
          id,
          { title, description, email, dob, contactNumber, nic, role },  // Update with NIC
          { new: true }
      );

      if (!updatedTodo) {
          return res.status(404).json({ message: 'Todo not found' });
      }

      res.json(updatedTodo);
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
  }
});

// Delete a todo item
app.delete('/todos/:id', async (req, res) => {
  try {
      const id = req.params.id;
      await Todo.findByIdAndDelete(id);
      res.status(204).end();
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
  }
});

// Create a new appointment
app.post('/appointments', async (req, res) => {
  const { todoId, appointmentDate, details } = req.body;

  try {
      const newAppointment = new Appointment({ todoId, appointmentDate, details });
      await newAppointment.save();
      res.status(201).json(newAppointment);
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
  }
});

// Get appointments for a specific todo (driver/tour guide)
app.get('/appointments/:todoId', async (req, res) => {
  const todoId = req.params.todoId;

  try {
      const appointments = await Appointment.find({ todoId });
      res.json(appointments);
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
  }
});

// Update an appointment
app.put('/appointments/:id', async (req, res) => {
  const id = req.params.id;
  const { appointmentDate, details } = req.body;

  try {
      const updatedAppointment = await Appointment.findByIdAndUpdate(
          id,
          { appointmentDate, details },
          { new: true }
      );

      if (!updatedAppointment) {
          return res.status(404).json({ message: 'Appointment not found' });
      }

      res.json(updatedAppointment);
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
  }
});

// Delete an appointment
app.delete('/appointments/:id', async (req, res) => {
  const id = req.params.id;

  try {
      await Appointment.findByIdAndDelete(id);
      res.status(204).end();
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
  }
});