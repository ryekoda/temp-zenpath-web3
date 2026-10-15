import { FC, useState, useEffect } from "react";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';



interface Props {
    name: string
    value: any
    onChange?: any
}

const Address: FC<Props> = ({ name, value, onChange }) => {
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
                    <>
                        <input className='dark:bg-white w-full p-3 border-solid border border-slate-400 rounded-md' name={ name }
                            {...getInputProps({

                            })}
                        />

                        <div>
                            { loading ? <div>...loading</div> : null }

                            { 
                                suggestions.map(suggestion => {
                                    const style = {
                                        backgroundColor: suggestion.active ? '#41b6e6' : '#fff',
                                        cursor: suggestion.active ? 'pointer' : 'input'
                                    }
                                    // key={ suggestion.description }
                                    return (
                                        <div key={ suggestion.description }>
                                            <div {...getSuggestionItemProps(suggestion, { style })}>
                                                { suggestion.description }
                                            </div>
                                        </div>
                                    )
                                }) 
                            }
                        </div>
                    </>
                )
            }
        </PlacesAutocomplete>
    )
};


export default Address;
