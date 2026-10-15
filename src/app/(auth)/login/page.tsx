import Container from '@/components/ui/Container';
import TripsTable from '@/components/marketing/preview/TripsTable';
import AuthPanel from '../_components/AuthPanel';
import LoginForm from './_components/LoginForm';



export const metadata = {
    title: 'Log in · Zenpath',
}

export default function LoginPage() {
    return (
        <Container className='grid items-stretch gap-12 lg:min-h-screen pb-12 pt-[104px] lg:grid-cols-2 lg:gap-16 lg:pb-16 lg:pt-[112px]'>
            {/* Panel on the left on desktop; hidden on smaller screens so the form comes first */}
            <div className='hidden lg:block'>
                <AuthPanel
                    title="Pick up right where you left off"
                    preview={
                        <div className='rounded-[var(--radius-card)] border border-line bg-white p-4 shadow-[0_20px_50px_-24px_rgba(16,26,51,0.3)] sm:p-5'>
                            <TripsTable/>
                        </div>
                    }
                    previewLabel="Preview of today's trips in Zenpath, with each ride's status and pickup time"
                />
            </div>

            <div className='mx-auto flex w-full max-w-[440px] flex-col justify-center lg:py-8'>
                <h1 className='text-[34px] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink-900 sm:text-[40px]'>
                    Welcome back
                </h1>
                <p className='mb-9 mt-4 text-lg text-ink-500'>
                    Log in to your Zenpath account.
                </p>

                <LoginForm/>
            </div>
        </Container>
    )
}
