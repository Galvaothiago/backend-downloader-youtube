const express = require('express')
const ytdl = require('ytdl-core')
const crypto = require('crypto');
const cors = require('cors')

const PORT = process.env.PORT || 3333
const app = express()

app.use(express.json())
app.use(cors())

app.post('/youtube', async (request, response) => {
    try {
        const url = request.body.url

        const info = await ytdl.getBasicInfo(url)
        
        const { title, viewCount, thumbnails, lengthSeconds } = info.videoDetails
        
    
        response.send({ url, title, viewCount, lengthSeconds, thumbnail: thumbnails[thumbnails.length - 1].url })
    } catch (error) {
        alert('Something went wrong', error)
    }
})

app.get('/download', async (request, response) => {
    try {
        const url = request.query.url
    
        const info = await ytdl.getBasicInfo(url)
        const { title } = info.videoDetails
        const hash = crypto.randomBytes(4)

        response.header('Content-Disposition', `attachement; filename=${title}-${hash.toString('hex')}.mp4`)
        
        ytdl(url, {
            format: 'mp4'
        }).pipe(response)

    } catch (error) {
        response.status(404).send({ error: 'Something went wrong, verify the url and try again' })
    }
 
})

app.listen(PORT)
