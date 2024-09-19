import 'dotenv/config'

import express from 'express'
import cors from 'cors'
import axios, { AxiosError } from 'axios'

type SpotifyAuthTokenData = {
    access_token: string,
    token_type: 'Bearer',
    scope: string[],
    expires_in: number,
    refresh_token: string
}

const app = express()

const spotifyAuthClient = axios.create({
    baseURL: 'https://accounts.spotify.com'
})

app.use(cors({
    origin: 'http://localhost:3000'
}))

app.use(express.urlencoded({
    extended: true
}))

app.use(express.json())

app.post('/api/spotify/login', async (req, res) => {
    const code = req.body?.code as string | undefined

    const reqStartTime = Date.now()

    if(!code) {
        res.status(400).json({
            message: 'code not found in request body'
        })

        return
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

    const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

    const queryParams = new URLSearchParams({
        code,
        redirect_uri: 'http://localhost:3000/login',
        grant_type: 'authorization_code'
    })

    try {
        const tokenRes = await spotifyAuthClient.post('/api/token', queryParams.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${authString}`
            }
        })

        const tokenData = tokenRes.data as SpotifyAuthTokenData

        res.status(200).send({
            accessToken: tokenData.access_token,
            tokenExpiryTime: new Date(reqStartTime + tokenData.expires_in * 1000)
        })
    }
    catch(err) {
        const axiosErr = err as AxiosError

        if(axiosErr.response) {
            type errorResponseData = {
                status: number,
                body: {
                    message: string,
                    [key: string]: any
                }
            }

            const responseMap: Record<number, errorResponseData> = {
                400: {
                    status: 401,
                    body: {
                        message: 'Unauthorized request'
                    }
                },
                500: {
                    status: 500,
                    body: {
                        message: 'An unexpected error has occurred with Spotify\'s auth service'
                    }
                }
            }

            const status = axiosErr.response.status in responseMap ? responseMap[axiosErr.response.status].status : 500

            const resBody = axiosErr.response.status in responseMap ? responseMap[axiosErr.response.status].body : {
                mesage: 'An unexpected status code was returned from Spotify\'s auth service',
                status: axiosErr.response.status,
                serviceMessage: axiosErr.response.data
            }

            res.status(status).json(resBody)

            return
        }

        res.status(500).json({
            message: 'An unexpected error has occurred within the application'
        })
    }
})

app.listen(8000, () => console.log('Server is listening...'))