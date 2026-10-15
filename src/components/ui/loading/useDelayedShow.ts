import { useEffect, useState } from 'react';



// True once `delay` ms have passed. Loaders use it so quick loads finish before anything flashes on screen.
export default function useDelayedShow(delay = 200) {
    const [isShown, setIsShown] = useState(delay === 0)

    useEffect(() => {
        if (delay === 0) return
        const timer = setTimeout(() => setIsShown(true), delay)
        return () => clearTimeout(timer)
    }, [delay])

    return isShown
}
