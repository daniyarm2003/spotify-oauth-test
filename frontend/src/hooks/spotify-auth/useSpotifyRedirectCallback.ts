import { useCallback } from 'react'
import { STATE_STORAGE_KEY } from './spotifyAuthConsts'

export default function useSpotifyRedirectCallback(scopes: string[]) {
    const stateStorageKey = STATE_STORAGE_KEY

    const generateAuthState = useCallback(() => {
        const stateLength = 16
        const stateCharSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'

        const stateBuffer = new Uint8Array(stateLength)
        window.crypto.getRandomValues(stateBuffer)

        return stateBuffer.reduce((prev, n) => prev + stateCharSet.charAt(n % stateCharSet.length), '')
    }, [])

    const doOauthRedirect = useCallback(() => {
        const state = generateAuthState()
        window.sessionStorage.setItem(stateStorageKey, state)

        const queryParams = new URLSearchParams({
            response_type: 'code',
            client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID ?? '',
            state,
            scope: scopes.join(' '),
            redirect_uri: window.location.origin + process.env.REACT_APP_SPOTIFY_REDIRECT_PATHNAME
        })

        window.location.assign(`https://accounts.spotify.com/authorize?${queryParams.toString()}`)

    }, [scopes])

    return doOauthRedirect
}