"use client"
import { FC } from 'react';



interface Props {}

const Feedback_Container: React.FC<Props> = ({ }) => {
    return (
        <div className='relative w-full h-full bg-[#D3D6F4] rounded-md' style={{ margin: '0 auto' }}>
            <div className='relative w-[640px] h-[1477px]' style={{ margin: '0 auto' }}>
                <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSfHO2gGKkydTQfYKcfSwy4KrMJ72Ny8sO1WpPFjWIF0R9wOng/viewform?embedded=true" width="640" height="1477">Loading…</iframe>
            </div>
        </div>
    )
}


export default Feedback_Container;