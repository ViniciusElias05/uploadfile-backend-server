const fs = require('fs');
const express = require('express');
const {google} = require('googleapis');
const multer = require('multer');
const cors = require('cors');

const client_id ="12518003289-gebjgvupglk8bgaem1vutb4e93if4lrd.apps.googleusercontent.com";
const client_secret = "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";
const DRIVE_FOLDER_ID = '1he03Yh-_iJggbofCkAvM2OO7FwrKB75Z';
const REFRESH_TOKEN = '1//0hY_zfqFIHR7bCgYIARAAGBESNwF-L9IrH6FM8RJfG-IVjpT-iNgbuVKdMsS6ypSxbTYiols4zxAdEHZYJGVlpAVXcza8x9-zGp8';

const app = express();

const upload = multer({dest: "uploads/"});


app.use(cors())
app.use(express.json())

app.post('/upload', upload.single('file'), async (req, res)=>{
    try{
        if(!req.file) {
            return res.status(400).json({error: "Nenhum arquivo enviado!"});
        }
        if(req.file){
            console.log("Arquivo enviado");
        }
        const auth = new google.auth.OAuth2(client_id, client_secret)
            auth.setCredentials({refresh_token:REFRESH_TOKEN })
        const drive = google.drive({version:"v3", auth})

        const response = await drive.files.create({
            requestBody: {
                name: new Date().getTime(),
                mimeType: req.file.mimetype,
                parents: [DRIVE_FOLDER_ID]
            },
            media: {
                mimeType: req.file.mimetype,
                body: fs.createReadStream(req.file.path),
                uploadType: 'resumable'
            }
        })

        fs.unlinkSync(req.file.path);

        res.json({success: true, fileData: response.data})
    } 
    catch(err){
        console.log(err);
        res.status(500).json({err})
    }

})

app.listen(8080, () => console.log('Rodando...'))