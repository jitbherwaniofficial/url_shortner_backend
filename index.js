const express = require('express')
const app = express()
const mongoose = require('mongoose')
const { nanoid } = require('nanoid');
const cors = require('cors')
require('dotenv/config')


app.use(cors())
app.options('*',cors())

app.use(express.json())
const port = process.env.PORT || 3000;

app.post('/shortner', async(req,res)=>{ 
    const {longUrl} = req.body;
    const shortUrl = nanoid(7);
    const url = new Url({longUrl,shortUrl});
    await url.save()
    res.status(200).json({shortUrl})
})

app.get('/:shortUrl', async (req, res) => {
    const { shortUrl } = req.params;
    const url = await Url.findOne({ shortUrl });
    if (url) {
        res.redirect(url.longUrl);
    } else {
        res.status(404).send('Not Found'); 
    } 
});


const urlSchema = new mongoose.Schema({
    longUrl: String,
    shortUrl: String
})

const Url = mongoose.model('urls', urlSchema)

mongoose.set('strictQuery',false)
mongoose.connect(process.env.CONNECTION_STRING)
    .then(()=>{
        console.log("Database Connected")
    }).catch((err)=>{
        console.log(err) 
    })


app.listen(port, ()=> {
    console.log(`LISTENING TO URL: http://localhost:${port}`);
})    