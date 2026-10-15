import { Login, ResetPassword } from '@/helpers/firebase/FirebaseAuth';
// import { AnalyticsFIR } from '@/helpers/firebase/FirebaseAnalytics';



export async function LoginFIR(email: string, password: string, setErrorCode: any, setIsSubmitButtonDisabled: any, router: any) {
    setIsSubmitButtonDisabled(true)

    if (email.trim() && password.trim()) {
        const userData: any = await Login(email.trim(), password)

        const user = userData['user']
        if (user) {
          // Keep the button disabled until we leave the page, so it can't be submitted twice.
          setTimeout(() => {
            // AnalyticsFIR().login()
            router.push('/')
          }, 300);
        } else {
            setErrorCode(2)
            setIsSubmitButtonDisabled(false)
            // AnalyticsFIR().loginError()
        }

        return
    } else {
      setErrorCode(1)
      // AnalyticsFIR().loginError()
      setIsSubmitButtonDisabled(false)

      return
    }
}


// Sends a Firebase password reset email. Returns an error code for ErrorMessage, or 0 on success.
export async function SendPasswordReset(email: string) {
    if (!email.trim()) return 6

    const error = await ResetPassword(email.trim())
    if (!error) return 0
    // Don't reveal whether an account exists; only flag addresses that are malformed.
    if (error === 'auth/user-not-found') return 0
    if (error === 'auth/invalid-email') return 1
    return 7
}


export function ErrorMessage(errorCode: number) {
    var info = { message: '' }

    switch(errorCode) {
      case 1:
        info['message'] = 'Please enter a valid email address'
        break;
      case 2:
        info['message'] = 'Password or email is incorrect. Please enter correct credentials'
        break;
      case 3:
        info['message'] = 'Password is incorrect. Please enter correct password'
        break;
      case 4:
        info['message'] = 'Password is incorrect. Please try again'
        break;
      case 5:
        info['message'] = 'No user found with this email in our database'
        break;
      case 6:
        info['message'] = 'Enter your email above, then select "Forgot password?" again'
        break;
      case 7:
        info['message'] = "We couldn't send a reset email right now. Please try again in a moment"
        break;
      default:
        info['message'] = ''
        break;
    }

    return info
  }
