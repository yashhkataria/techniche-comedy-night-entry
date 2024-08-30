const express = require('express');
const mongoose = require('mongoose');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');

const corsOptions = {
    origin: "*"
}

const upload = multer({ dest: 'uploads/' });

app.use(cors(corsOptions));

dotenv.config();

const PORT = process.env.PORT || 3001;

const MONGODB_URI = process.env.MONGODB_URI

app.use(express.json());

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/api', (req, res) => {
    res.send('Hello API World!');
});

const visitorSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    passNumber: { type: String, required: true },
    visited: { type: Boolean, default: false }
});

const Visitor = mongoose.model('Visitor', visitorSchema);

app.post('/api/add-visitor', async (req, res) => {
    const { email, passNumber } = req.body;
    const visitor = new Visitor({ email, passNumber });
    try {
        await visitor.save();
        res.json(visitor);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// app.post('/api/upload-csv', upload.single('file'), async (req, res) => {
//     const results = [];
    
//     if (!req.file) {
//         return res.status(400).json({ error: 'No file uploaded' });
//     }

//     fs.createReadStream(req.file.path)
//         .pipe(csv({
//             mapHeaders: ({ header }) => header.trim()
//         }))
//         .on('data', (data) => {

//             const email = data.email;
//             const passNumber = data.passNumber ? data.passNumber.trim() : '';

//             if (email && passNumber) {
//                 results.push({ email, passNumber });
//             }
//         })
//         .on('end', async () => {
//             for (const { email, passNumber } of results) {
//                 const visitor = new Visitor({ email, passNumber });
//                 try {
//                     await visitor.save();
//                 } catch (error) {
//                     console.error(`Error saving visitor ${email}:`, error.message);
//                 }
//             }
//             res.json({ message: 'CSV processed successfully', data: results });
//         })
//         .on('error', (error) => {
//             res.status(500).json({ error: error.message });
//         });
// });

app.put('/api/mark-visited', async (req, res) => {
    const { email, passNumber } = req.body;
    try {
        const visitor = await Visitor.findOne({ email, passNumber });
        if (!visitor) {
            return res.status(404).json({ error: 'Not found, please check your email and pass number' });
        }
        if (visitor.visited) {
            return res.status(400).json({ error: 'This user has already entered the auditorium' });
        }
        visitor.visited = true;
        await visitor.save();
        res.json(visitor);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
