const express=require("express");
const mysql= require("mysql2");
const ejs= require("ejs");
const multer =require("multer");
const path=require("path");
const fs=require('fs');

const app = express();
port=4501;

//create mysql database connection

const db=mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'hal987@@@',
  database:'videoupload'
})



db.connect((err)=>{
  if(err){
    console.error('database connection failed:' + db.stack);
    return;
  }
  else{
    console.log('connected to database as id' + db.threadId);
  }
})





// to server static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// set view engine 

app.set('views' , path.join(__dirname, 'views'));
app.set('view engine' , 'ejs');

// to encoded json data 
app.use(express.json());
app.use(express.urlencoded({extended:false}));


// Multer Configuration
const storage=multer.memoryStorage();
const upload = multer({storage: storage });


// root api
app.get('/',(req, res)=>{
  res.render('index');
})



// app.post('/upload', upload.single('videoFile'), (req, res) => {
//   const videoName = req.body.videoName;
//   const videoData = req.file.buffer;

//   const sql = 'INSERT INTO videodetails (videoName, video) VALUES (?, ?)';
//   db.query(sql, [videoName, videoData], (err, result) => {
//       if (err) {
//           console.error('Error storing video in database:', err);
//           res.status(500).json({ success: false, error: 'Failed to store video in database' });
//       } else {
//           res.json({ success: true, message: 'Video uploaded successfully' });
//       }
//   });
// });

// Updated version: Stream the file directly to the database
app.post('/upload', upload.single('videoFile'), (req, res) => {
  const videoName = req.body.videoName;

  const sql = 'INSERT INTO videodetails (videoName, video) VALUES (?, ?)';
  db.query(sql, [videoName, req.file.buffer], (err, result) => {
    if (err) {
      console.error('Error storing video in database:', err);
      res.status(500).json({ success: false, error: 'Failed to store video in database' });
    } else {
      res.json({ success: true, message: 'Video uploaded successfully' });
    }
  });
});


app.listen(port, ()=>{
  console.log(`suman server is runnig on port ${port}`);
})


