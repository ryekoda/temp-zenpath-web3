import { FC } from "react";
import Hero from './Hero';
import Benefits from './Benefits';
import Showcase from './Showcase';
import FinalCTA from './FinalCTA';



interface Props {}

// Landing page for signed-out visitors. Only EmailSignup runs in the browser; the rest is server-rendered.
const SplashPage: FC<Props> = ({}) => {
    return (
        <div className='bg-white'>
            <Hero/>
            <Benefits/>
            <Showcase/>
            <FinalCTA/>
        </div>
    )
};


export default SplashPage;
