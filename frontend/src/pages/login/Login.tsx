import { useSearchParams } from 'react-router-dom'
import LoginRedirector from './LoginRedirector'
import LoginCodeAcceptor from './LoginCodeAcceptor'
import AuthRedirectWrapper from '../../components/spotify-auth-redirect/AuthRedirectWrapper'

export default function Login() {
    const [ searchParams ] = useSearchParams()

    const hasCodeAndState = searchParams.has('code') && searchParams.has('state')

    if(!hasCodeAndState) {
        return (
            <AuthRedirectWrapper redirectOnAuthState>
                <LoginRedirector />
            </AuthRedirectWrapper>
        )
    }
    else {
        return <LoginCodeAcceptor code={searchParams.get('code') ?? ''} state={searchParams.get('state') ?? ''} />
    }
}