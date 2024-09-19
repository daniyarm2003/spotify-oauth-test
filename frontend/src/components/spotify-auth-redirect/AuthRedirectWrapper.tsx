import { useNavigate } from 'react-router-dom'
import useSpotifyToken from '../../hooks/spotify-auth/useSpotifyToken'
import { useEffect } from 'react'

interface Props extends React.PropsWithChildren {
    redirectOnAuthState?: boolean
}

export default function AuthRedirectWrapper({ children, redirectOnAuthState }: Props) {
    const { loading, isAuthenticated } = useSpotifyToken()
    const navigate = useNavigate()

    useEffect(() => {
        const authCheckState = redirectOnAuthState ?? false

        if(!loading && isAuthenticated === authCheckState) {
            navigate(authCheckState ? '/' : '/login')
        }

    }, [loading, isAuthenticated, navigate, redirectOnAuthState])

    if(loading) {
        return (<p>Loading...</p>)
    }

    return <>{children}</>
}