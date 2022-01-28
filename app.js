const express = require('express')
const ytdl = require('ytdl-core')
const crypto = require('crypto');
const cors = require('cors')

const PORT = process.env.PORT || 3333
const app = express()

app.use(express.json())
app.use(cors())

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

app.post('/youtube', async (request, response) => {
    const url = request.body.url

    try {
        const isValidUrl = ytdl.validateURL(url)
        if(!isValidUrl) {
            throw new Error('Url invalid')
        }

        const info = await ytdl.getBasicInfo(url)
        
        const { title, viewCount, thumbnails, lengthSeconds } = info.videoDetails
    
        response.send({ url, title, viewCount, lengthSeconds, thumbnail: thumbnails[thumbnails.length - 1].url })
    } catch (error) {
        response.status(400).send({ error })
    }
})

app.get('/download', async (request, response) => {
    const url = request.query.url
    const isValidUrl = ytdl.validateURL(url)

    try {
        if(!isValidUrl) {
            throw new Error('Url invalid')
        }

        let info = await ytdl.getBasicInfo(url)
        const { title } = info.videoDetails

        const hash = crypto.randomBytes(4)
        response.header('Content-Disposition', `attachement; filename="${title}-${hash.toString('hex')}.mp4"`)

        ytdl(url, {
            format: "mp4"
        }).pipe(response)

    } catch (error) {
        response.status(404).send({ error })
    }
})



