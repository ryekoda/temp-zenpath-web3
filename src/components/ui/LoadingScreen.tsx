'use client'

import { FC } from "react";
import { ColorRing } from 'react-loader-spinner';



interface Props {}

const LoadingScreen: FC<Props> = ({}) => {
    return (
        <div className='h-screen w-full flex items-center justify-center'>
            <ColorRing visible={true} height="80" width="80" ariaLabel="blocks-loading" wrapperStyle={{}} wrapperClass="blocks-wrapper" colors={['#26C797', '#717FF6', '#D93F67', '#F0E44F', '#FCBC05']}/>
        </div>
    )
};


export default LoadingScreen;
