import { FC, useState, useEffect } from "react";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/cn';
import { fieldClassName } from '../fieldStyles';



interface Props {
    id?: string
    name: string
    value: any
    onChange?: any
}

const Address: FC<Props> = ({ id, name, value, onChange }) => {
    const [autocompleteValue, setAutocompleteValue] = useState('')



    useEffect(() => {
        setAutocompleteValue(value)
    },[ value ])

    async function itemChanged(newValue: any) {
        setAutocompleteValue(newValue)
    }

    async function itemSelected(newValue: any) {
        const results = await geocodeByAddress(newValue)
        const latLng = await getLatLng(results[0])

        const address = { address: newValue, latLng: latLng }
        const item = { target: { 'name': name, 'value': address } }
        onChange(item)
    }


    return (
        <PlacesAutocomplete value={ autocompleteValue } onChange={ (e) => itemChanged(e) } onSelect={ (e) => itemSelected(e) }>
            {
                ({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div className='relative'>
                        <input name={ name } {...getInputProps({ id, className: fieldClassName, placeholder: 'Search for an address' })}/>

                        {
                            (loading || suggestions.length > 0) &&
                                <div className='absolute inset-x-0 top-full z-10 mt-1 overflow-hidden rounded-[var(--radius-button)] border border-line bg-white py-1 shadow-[0_12px_32px_-12px_rgba(16,26,51,0.25)]'>
                                    { loading && <p className='px-3.5 py-2 text-sm text-ink-500'>Searching…</p> }
                                    {
                                        suggestions.map(suggestion => (
                                            <div {...getSuggestionItemProps(suggestion, { className: cn('flex cursor-pointer items-start gap-2 px-3.5 py-2 text-sm text-ink-900', suggestion.active && 'bg-brand-50') })} key={ suggestion.placeId || suggestion.description }>
                                                <MapPin aria-hidden="true" className='mt-0.5 h-4 w-4 shrink-0 text-ink-400'/>
                                                { suggestion.description }
                                            </div>
                                        ))
                                    }
                                </div>
                        }
                    </div>
                )
            }
        </PlacesAutocomplete>
    )
};


export default Address;
