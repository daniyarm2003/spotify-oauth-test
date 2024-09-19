import useSpotifyRedirectCallback from '../../hooks/spotify-auth/useSpotifyRedirectCallback'
import './Login.css'

export default function LoginRedirector() {
    const doOauthRedirect = useSpotifyRedirectCallback(['user-read-email', 'user-library-read'])

    return (
        <div className='login-div'>
            <h1>Login to Spotify</h1>
            <button className='login-button' onClick={doOauthRedirect}>Login</button>
        </div>
    )
}