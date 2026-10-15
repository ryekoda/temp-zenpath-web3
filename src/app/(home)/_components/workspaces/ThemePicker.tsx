import { FC } from "react";
import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';
import { WorkspaceTheme } from './_utils/Actions';



interface Props {
    themes: WorkspaceTheme[]
    selectedTheme?: WorkspaceTheme
    onSelect: (theme: WorkspaceTheme) => void
}

// Background choices for a workspace: Unsplash photos first, then solid colors.
const ThemePicker: FC<Props> = ({ themes, selectedTheme, onSelect }) => {
    const hasPhotos = themes.some(theme => theme.image)

    return (
        <fieldset>
            <legend className='mb-2 block text-sm font-medium text-ink-700'>Background</legend>

            <div role='radiogroup' className='grid grid-cols-4 gap-2.5 sm:grid-cols-6'>
                {
                    themes.map(theme => {
                        const isSelected = selectedTheme?.uid === theme.uid

                        return (
                            <button
                                key={ theme.uid }
                                type='button'
                                role='radio'
                                aria-checked={ isSelected }
                                aria-label={ theme.label }
                                title={ theme.label }
                                onClick={ () => onSelect(theme) }
                                className={cn(
                                    'relative aspect-[4/3] overflow-hidden rounded-lg bg-cover bg-center ring-offset-2 transition-shadow duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600',
                                    isSelected ? 'ring-2 ring-brand-600' : 'hover:ring-2 hover:ring-line'
                                )}
                                style={{ backgroundColor: theme.color ?? undefined, backgroundImage: theme.image ? `url(${theme.image})` : undefined }}>
                                {
                                    isSelected &&
                                        <span className='absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-brand-700 shadow'>
                                            <Check aria-hidden="true" className='h-3.5 w-3.5' strokeWidth={3}/>
                                        </span>
                                }
                            </button>
                        )
                    })
                }
            </div>

            { hasPhotos && <p className='mt-2 text-xs text-ink-500'>Photos from Unsplash</p> }
        </fieldset>
    )
};


export default ThemePicker;
