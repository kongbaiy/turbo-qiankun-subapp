// import { Navigate } from 'react-router-dom'
import { getAccessToken } from '@repo/utils'

const Auth = (props: { children: React.ReactElement }) => {
    const accessToken = getAccessToken()

    if (!Reflect.ownKeys(accessToken)?.length) {
        window.location.href = '/login'
        return
    }
    return <>{props.children}</>
}

export default Auth
