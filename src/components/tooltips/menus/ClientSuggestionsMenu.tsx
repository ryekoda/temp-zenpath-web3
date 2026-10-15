"use client"
import { FC } from 'react';
import InitialsAvatar from '@/components/ui/InitialsAvatar';
import { CapitalizeFirstLetterOfEachWord } from '@/lib/format/text';
import { MenuHeading } from './MenuParts';



interface Props {
    clients: any[]
    onPress: (name: string, data?: any) => void
}

// Matching clients while typing a name in the trip form ('form-autocomplete').
// Focus stays in the text field, so these are plain options picked with the mouse or tap.
const ClientSuggestionsMenu: FC<Props> = ({ clients, onPress }) => {
    if (!clients || clients.length === 0) return null

    return (
        <div className='w-[min(400px,calc(100vw-48px))]'>
            <MenuHeading>Matching clients</MenuHeading>
            <ul role='listbox' aria-label='Matching clients' className='max-h-72 overflow-y-auto'>
                {
                    clients.map((client, i) => (
                        <li key={ client.id || i } role='option' aria-selected={ false }>
                            <button type='button' tabIndex={ -1 } onClick={ () => onPress('form-autocomplete', client.id) } className='flex w-full items-center gap-2.5 rounded-[var(--radius-button)] px-2.5 py-2 text-left text-sm text-ink-900 transition-colors duration-150 hover:bg-surface-soft'>
                                <InitialsAvatar first={ client.fName } last={ client.lName } className='h-7 w-7 text-[11px]'/>
                                <span className='min-w-0 truncate'>{ CapitalizeFirstLetterOfEachWord(`${client.fName || ''} ${client.lName || ''}`) }</span>
                            </button>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}


export default ClientSuggestionsMenu;
