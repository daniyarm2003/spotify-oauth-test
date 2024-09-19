import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApiClientContext } from '../../api/server'
import SpotifyAuthService from '../../api/SpotifyAuthService'
import useSpotifyRedirectAcceptor from '../../hooks/spotify-auth/useSpotifyRedirectAcceptor'

interface RedirectURIProps {
    code: string,
    state: string
}

export default function LoginCodeAcceptor({ code, state }: RedirectURIProps) {
    const navigate = useNavigate()

    const apiClient = useContext(ApiClientContext)
    const spotifyAuthService = new SpotifyAuthService(apiClient)

    const { loading, errorType } = useSpotifyRedirectAcceptor(spotifyAuthService, code, state)

    useEffect(() => {
        if(loading) {
            return
        }
        if(!errorType) {
            navigate('/')
        }

    }, [loading, errorType, navigate])

    return <p>Logging In...</p>
}