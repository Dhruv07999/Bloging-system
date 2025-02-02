const mongoose = require('mongoose');

// offline 
// mongoose.connect('mongodb://127.0.0.1:27017/AdminPanelLTE');

// online 
mongoose.connect('mongodb+srv://dhruvbhavsar07999:bqH9wt7nsrCjmhCP@cluster0.fzd5r.mongodb.net/AdminPanelLTE');

const db = mongoose.connection;

db.once('open', (err) => {
    if(err){
        console.log(err);        
    }
    console.log("Db is connected");
})