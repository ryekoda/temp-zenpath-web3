import Container from '@/components/ui/Container';
import RouteCard from '@/components/marketing/preview/RouteCard';
import AuthPanel from '../_components/AuthPanel';
import RegisterForm from './_components/RegisterForm';



export const metadata = {
    title: 'Create your account · Zenpath',
}

export default function RegisterPage() {
    return (
        <Container className='grid items-stretch gap-12 lg:min-h-screen pb-12 pt-[104px] lg:grid-cols-2 lg:gap-16 lg:pb-16 lg:pt-[112px]'>
            {/* Panel on the left on desktop; hidden on smaller screens so the form comes first */}
            <div className='hidden lg:block'>
                <AuthPanel
                    title='Dispatch smarter from day one'
                    highlights={[
                        'No credit card required',
                        'Nothing to install. Works in your browser',
                        'Plan rides, coordinate drivers, and track trips in one place',
                    ]}
                    preview={ <RouteCard className='shadow-[0_20px_50px_-24px_rgba(16,26,51,0.3)]'/> }
                    previewLabel="Preview of a driver's route in Zenpath, with numbered stops and pickup times"
                />
            </div>

            <div className='mx-auto flex w-full max-w-[440px] flex-col justify-center lg:py-8'>
                <h1 className='text-[34px] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink-900 sm:text-[40px]'>
                    Create your Zenpath account
                </h1>
                <p className='mb-9 mt-4 text-lg text-ink-500'>
                    Start free. No credit card required.
                </p>

                <RegisterForm/>
            </div>
        </Container>
    )
}
