const express = require('express');
const multer = require('multer');
const fs = require('fs');

const app = express();
const port = 3000;

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Serve a simple HTML form for testing
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle file upload using chunks
app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  const buffer = file.buffer;

  // Change the destination path as needed
  const filePath = __dirname + '/uploads/' + file.originalname;

  // Use fs.createWriteStream to write the file in chunks
  const stream = fs.createWriteStream(filePath);
  stream.write(buffer);
  stream.end();

  stream.on('finish', () => {
    console.log('File saved successfully!');
    res.send('File uploaded successfully!');
  });

  stream.on('error', (err) => {
    console.error('Error writing file:', err);
    res.status(500).send('Error uploading file');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

