import * as React from 'react';
import Organizer from './Organizer';
import Restriction from '@/components/ui/Restriction';



interface Props {
  params: { id: string }
}

const Clients: React.FC<Props> = ({ params }) => {  
  return (
    <div className='h-screen overflow-hidden'>
      <div className='h-full hidden md:block'>
        <Organizer companyUID={ params.id }/>
      </div>

      <div className='h-full block md:hidden'>
        <Restriction/>
      </div>
    </div>
  );
}


export default Clients;