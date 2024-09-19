import { useEffect, useRef, useState } from 'react'
import SpotifyAuthService from '../../api/SpotifyAuthService'
import { AUTH_TOKEN_STORAGE_KEY, STATE_STORAGE_KEY } from './spotifyAuthConsts'
import { AxiosError } from 'axios'

export default function useSpotifyRedirectAcceptor(spotifyAuthService: SpotifyAuthService, code: string, state: string) {
    const [ loading, setLoading ] = useState(true)
    const [ errorType, setErrorType ] = useState<'MISMATCHED_STATE' | 'INVALID_CODE' | 'UNEXPECTED_ERROR' | null>(null)

    const tokenRetrievalComplete = useRef(false)

    const retrieveToken = async (code: string, state: string) => {
        const localState = window.sessionStorage.getItem(STATE_STORAGE_KEY)

        if(localState !== state) {
            return 'MISMATCHED_STATE'
        }

        try {
            const tokenData = await spotifyAuthService.login(code)
            const tokenStr = JSON.stringify(tokenData)

            window.sessionStorage.setItem(AUTH_TOKEN_STORAGE_KEY, tokenStr)

            return null
        }
        catch(err) {
            const axiosErr = err as AxiosError

            if(!axiosErr.response || axiosErr.response.status !== 401) {
                return 'UNEXPECTED_ERROR'
            }

            return 'INVALID_CODE'
        }
    }

    useEffect(() => {
        if(tokenRetrievalComplete.current) {
            return
        }

        setLoading(true)

        retrieveToken(code, state)
        .then(err => {
            setErrorType(err)
            setLoading(false)
        })
        .catch(err => {
            console.log(err)

            setErrorType('UNEXPECTED_ERROR')
            setLoading(false)
        })

        return () => {
            tokenRetrievalComplete.current = true
        }
    }, [code, state])

    return { loading, errorType }
}