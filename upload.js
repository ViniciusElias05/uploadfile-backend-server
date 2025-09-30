const {google} = require('googleapis');
const client_id ="12518003289-gebjgvupglk8bgaem1vutb4e93if4lrd.apps.googleusercontent.com";
const client_secret = "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";
const DRIVE_FOLDER_ID = '1he03Yh-_iJggbofCkAvM2OO7FwrKB75Z';
const REFRESH_TOKEN = '1//0hY_zfqFIHR7bCgYIARAAGBESNwF-L9IrH6FM8RJfG-IVjpT-iNgbuVKdMsS6ypSxbTYiols4zxAdEHZYJGVlpAVXcza8x9-zGp8';

const uploadFile = async (data) => {
    try{
        const auth = new google.auth.OAuth2(client_id, client_secret)
        auth.setCredentials({refresh_token:REFRESH_TOKEN })

        const driveService = google.drive({
            version: 'v3',
            auth
        })

        const fileMetadata = {
            'name': 'video3.mp4',
            'parents': [DRIVE_FOLDER_ID]
        }

        const media = {
            mimeType: 'video/mp4',
            body: data
        }

        const response = await driveService.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id',
            uploadType: 'resumable'
        })
        return response.data
    }
    catch(err){
        return err
    }
}

export default uploadFile;