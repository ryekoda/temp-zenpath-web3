import { cookies } from 'next/headers';
import HomeGate from './_components/HomeGate';
import SplashPage from './_components/splash/SplashPage';



// Signed-out visitors get the Splash page straight from the server, without waiting on Firebase.
export default function Home() {
    const isLoggedIn = cookies().get('isLoggedIn')?.value === 'true'

    return isLoggedIn ? <HomeGate/> : <SplashPage/>
}
