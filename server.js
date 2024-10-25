// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const cors = require('cors');

// Express ilovasini yaratish
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB ulanishi
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB'); // Ulanish muvaffaqiyatli bo'lsa
})
.catch((error) => {
    console.error('MongoDB ulanishida xato:', error); // Ulanish xatosi
});


// Mongoose modelini yaratish
const fileSchema = new mongoose.Schema({
    url: { type: String, required: true },
    pinCode: { type: String, required: true, unique: true },
    type: { type: String, required: true }, // Fayl turini saqlash
});

const File = mongoose.model('File', fileSchema);

// Faylni yuklash va pin kodini saqlash
app.post('/upload', async (req, res) => {
    const { url, pinCode, type } = req.body;

    try {
        const newFile = new File({ url, pinCode, type }); // type ni qo'shish
        await newFile.save();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Xato: Fayl saqlashda xato' });
    }
});

// Barcha fayllarni olish
app.get('/files', async (req, res) => {
    try {
        const files = await File.find({});
        res.json(files); // Barcha fayllarni yuborish
    } catch (error) {
        res.status(500).json({ error: 'Xato: Fayllarni olishda xato' });
    }
});

// Faylni o'chirish
app.get('/getFileByPin/:pinCode', async (req, res) => {
    const pinCode = req.params.pinCode;
    // Faylni pin kodga qarab topish uchun kod yozing
    const file = await File.findOne({ pinCode }); // Mavjud faylni izlash
  
    if (file) {
      return res.json(file); // Fayl ma'lumotlarini yuborish
    } else {
      return res.status(404).json(null); // Fayl mavjud emas
    }
  });
  
// Serverni ishga tushirish
app.listen(3000, () => {
    console.log('Server 3000 portida ishga tushdi');
});
