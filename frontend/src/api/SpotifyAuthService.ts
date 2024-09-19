import { AxiosInstance } from 'axios'

export type SpotifyTokenResponse = {
    accessToken: string,
    tokenExpiryTime: string
}

export default class SpotifyAuthService {
    private apiClient: AxiosInstance

    constructor(apiClient: AxiosInstance) {
        this.apiClient = apiClient
    }

    public async login(code: string) {
        const res = await this.apiClient.post('/api/spotify/login', {
            code
        })

        return res.data as SpotifyTokenResponse
    }
}