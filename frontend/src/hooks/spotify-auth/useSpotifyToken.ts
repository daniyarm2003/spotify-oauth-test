import { useEffect, useRef, useState } from 'react'
import { AUTH_TOKEN_STORAGE_KEY } from './spotifyAuthConsts'
import { SpotifyTokenResponse } from '../../api/SpotifyAuthService'
import { useNavigate } from 'react-router-dom'

export default function useSpotifyToken(validateToken: boolean = false) {
    const [ authCheckLoading, setAuthCheckLoading ] = useState(true)
    const [ logoutLoading, setLogoutLoading ] = useState(false)

    const [ authToken, setAuthToken ] = useState<SpotifyTokenResponse | null>(null)

    const navigate = useNavigate()

    const authCheckComplete = useRef(false)

    const loading = authCheckLoading || logoutLoading

    const verifyStoredTokenFormat = (tokenStr: string) => {
        let tokenData: SpotifyTokenResponse

        try {
            tokenData = JSON.parse(tokenStr) as SpotifyTokenResponse
        }
        catch {
            return null
        }

        if(!tokenData.accessToken || isNaN(Date.parse(tokenData.tokenExpiryTime))) {
            return null
        }

        return tokenData
    }

    const checkAuthStatus = async () => {
        const tokenStr = window.sessionStorage.getItem(AUTH_TOKEN_STORAGE_KEY)

        if(tokenStr) {
            const tokenData = verifyStoredTokenFormat(tokenStr)

            if(tokenData && new Date().getTime() < Date.parse(tokenData.tokenExpiryTime)) {
                return tokenData
            }
            else {
                window.sessionStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
            }
        }

        return null
    }

    const getAuthToken = () => {
        const tokenStr = window.sessionStorage.getItem(AUTH_TOKEN_STORAGE_KEY)

        if(!tokenStr) {
            return null
        }

        return JSON.parse(tokenStr) as SpotifyTokenResponse
    }

    const logout = async () => {
        setLogoutLoading(true)

        window.sessionStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
        navigate('/login')

        setLogoutLoading(false)
    }

    useEffect(() => {
        if(authCheckComplete.current) {
            return
        }

        setAuthCheckLoading(true)

        if(validateToken) {
            checkAuthStatus()
            .then(tokenData => {
                setAuthToken(tokenData)
                setAuthCheckLoading(false)
            })
            .catch(err => {
                console.error(err)
                setAuthCheckLoading(false)
            })
        }
        else {
            setAuthToken(getAuthToken())
            setAuthCheckLoading(false)
        }

        return () => {
            authCheckComplete.current = true
        }

    }, [validateToken])

    return { loading, authToken, isAuthenticated: !loading && authToken !== null, logout }
}