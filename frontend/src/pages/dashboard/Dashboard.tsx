import useSpotifyToken from "../../hooks/spotify-auth/useSpotifyToken";

export default function Dashboard() {
    const { loading, authToken, logout } = useSpotifyToken(false)

    if(loading) {
        return <p>Loading...</p>
    }

    return (
        <div>
            <p>{authToken?.accessToken}</p>
            <p>{new Date(authToken?.tokenExpiryTime ?? '').toISOString()}</p>
            <button onClick={logout}>Log Out</button>
        </div>
    )
}