import { FC } from "react";
import Image from 'next/image';
import Paragraph from '@/components/ui/Paragraph';



interface Props {}

const Restriction: FC<Props> = ({}) => {
    return (
        <div className='px-[50px] py-[0px] overflow-hidden'>
            <div style={{ width: '120px', display: 'block', margin: '0 auto', marginTop: '250px' }}>
                <Image src="/images/LogoIcon.png" alt="logo" width={120} height={120}/>
            </div>
            <Paragraph className='py-8'>
                To get started with Zenpath come back on desktop or open mobile app
            </Paragraph>
        </div>
    )
};


export default Restriction;
