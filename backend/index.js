const express = require('express');
const multer = require('multer');
const fs = require('fs');

const app = express();
const port = 3000;

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 300 * 1024 * 1024 }, 
});


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle file upload using chunks
app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  const filePath = __dirname + '/uploads/' + file.originalname;

  const readStream = fs.createReadStream(filePath);
  const writeStream = fs.createWriteStream(filePath);

  readStream.pipe(writeStream);

  writeStream.on('finish', () => {
    console.log('File saved successfully!');
    res.send('File uploaded successfully!');
  });

  writeStream.on('error', (err) => {
    console.error('Error writing file:', err);
    res.status(500).send('Error uploading file');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
