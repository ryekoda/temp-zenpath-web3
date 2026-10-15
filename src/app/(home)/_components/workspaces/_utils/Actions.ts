import { SaveCompany } from "@/helpers/database/Companies";
import { SaveEmployee } from '@/helpers/database/Employees';
import { SearchPhoto } from '@/helpers/unsplash/Unsplash';



export interface WorkspaceTheme {
    uid: string
    color: string | null
    image: string | null
    label: string
}

// Solid backgrounds from the design system. All are dark enough for white workspace titles.
// Existing workspaces keep whatever color they were saved with.
export function DefaultThemeColors(): WorkspaceTheme[] {
    return [
      { uid: 'brand', color: '#0FA978', image: null, label: 'Green' },
      { uid: 'brand-dark', color: '#087F5B', image: null, label: 'Forest' },
      { uid: 'info', color: '#2798D8', image: null, label: 'Blue' },
      { uid: 'ink', color: '#263B5A', image: null, label: 'Navy' },
      { uid: 'slate', color: '#607895', image: null, label: 'Slate' },
      { uid: 'warning', color: '#B7800E', image: null, label: 'Amber' },
      { uid: 'danger', color: '#C2385A', image: null, label: 'Rose' },
    ]
}


// Creates the workspace and adds the current user as its first member. Returns true on success.
export async function SaveWorkspace(name: string, theme: WorkspaceTheme, currentUser: any, dbURL: string) {
    const themeData = { color: theme.color ?? '', image: theme.image ?? '' }
    const companyUID = await SaveCompany(name.trim().toLowerCase(), themeData, currentUser.id, dbURL).catch((err) => console.log('company error: ', err))
    if (!companyUID) return false

    const item = {
      'fName': currentUser.fName,
      'lName': currentUser.lName,
      'dateHired': new Date(),
      'userUID': currentUser.id
    }
    const employeeUID = await SaveEmployee(item, companyUID, dbURL).catch((err) => console.log('employee error: ', err))

    // Analytics_Fir().create_workspace()
    return Boolean(employeeUID)
}


// A few Unsplash photos for the given category, followed by the solid colors.
export async function UnsplashImageSearch(category: string, dbURL: string): Promise<WorkspaceTheme[]> {
  const data = await SearchPhoto(category, dbURL).catch((err: any) => console.log('unsplash error: ', err))

  const photos: WorkspaceTheme[] = (data ?? []).slice(0, 4).map((photo: any) => ({
    uid: photo.id,
    color: null,
    image: photo.urls.small,
    label: photo.alt_description || `${category} photo`,
  }))

  return [...photos, ...DefaultThemeColors()]
}
