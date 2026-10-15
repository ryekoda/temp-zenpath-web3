import { FC, FormEvent, useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import TextField from '@/components/ui/TextField';
import ThemePicker from './ThemePicker';
import WorkspaceCover from '@/components/workspace/WorkspaceCover';
import { DefaultThemeColors, SaveWorkspace, UnsplashImageSearch, WorkspaceTheme } from './_utils/Actions';



const photoCategories = ['pets', 'ocean', 'animals', 'beach', 'summer', 'coffee shop', 'sunset', 'city', 'pattern', 'abstract']

interface Props {
  currentUser: any
  dbURL: string
  onCancel: () => void
  onCreated: () => void
}

const CreateWorkspaceForm: FC<Props> = ({ currentUser, dbURL, onCancel, onCreated }) => {
  const [name, setName] = useState('')
  const [themes, setThemes] = useState<WorkspaceTheme[]>(DefaultThemeColors())
  const [selectedTheme, setSelectedTheme] = useState<WorkspaceTheme>(DefaultThemeColors()[0])
  const [isSaving, setIsSaving] = useState(false)
  const [hasError, setHasError] = useState(false)



  useEffect(() => {
    const category = photoCategories[Math.floor(Math.random() * photoCategories.length)]

    UnsplashImageSearch(category, dbURL).then(newThemes => {
      setThemes(newThemes)
      // Start with the first photo, if any came back
      if (newThemes[0]?.image) setSelectedTheme(newThemes[0])
    })
  }, [dbURL])

  async function submitPressed(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!name.trim()) return

    setHasError(false)
    setIsSaving(true)

    const isSaved = await SaveWorkspace(name, selectedTheme, currentUser, dbURL)
    setIsSaving(false)

    if (isSaved) {
      onCreated()
    } else {
      setHasError(true)
    }
  }


  return (
    <form onSubmit={ submitPressed } className='space-y-6'>
      <WorkspaceCover color={ selectedTheme.color } image={ selectedTheme.image } className='h-28 rounded-[var(--radius-card)]'>
        <p className='absolute bottom-3 left-4 right-4 truncate text-lg font-semibold text-white'>
          { name.trim() || 'Your workspace' }
        </p>
      </WorkspaceCover>

      <TextField
        id='workspace-name'
        name='compName'
        label='Workspace name'
        placeholder='e.g. Riverside Care Transit'
        autoComplete='off'
        required
        maxLength={ 60 }
        value={ name }
        onChange={ (e) => { setHasError(false); setName(e.target.value) } }
      />

      <ThemePicker themes={ themes } selectedTheme={ selectedTheme } onSelect={ setSelectedTheme }/>

      {
        hasError &&
          <div role='alert' className='flex items-start gap-2.5 rounded-[var(--radius-button)] bg-status-danger-soft px-4 py-3 text-sm text-ink-900'>
            <AlertCircle aria-hidden="true" className='mt-0.5 h-4 w-4 shrink-0 text-status-danger' strokeWidth={2}/>
            <span>We couldn&apos;t create your workspace. Please try again.</span>
          </div>
      }

      <div className='flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
        <Button type='button' variant='secondary' size='xl' onClick={ onCancel } disabled={ isSaving }>
          Cancel
        </Button>
        <Button type='submit' variant='primary' size='xl' isLoading={ isSaving }>
          { isSaving ? 'Creating…' : 'Create workspace' }
        </Button>
      </div>
    </form>
  )
};


export default CreateWorkspaceForm;
