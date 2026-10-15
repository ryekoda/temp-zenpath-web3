import { Register } from '@/helpers/firebase/FirebaseAuth';
// import { AnalyticsFIR } from '@/helpers/firebase/FirebaseAnalytics';



export function FormData(props: any) {
  var info = {
    signup: [
      {
        title: 'your name', name: 'name', type: 'text', placeholder: 'Enter your first & last name', frameType: 'text', hideRequiredAsterisk: true, isRequired: true
      },
      {
        title: 'email', name: 'email', type: 'email', placeholder: 'Enter your email', frameType: 'text', value: props.value, hideRequiredAsterisk: true, isRequired: true
      },
      {
        title: 'password', name: 'password', type: 'password', placeholder: 'Enter your password', frameType: 'text', hideRequiredAsterisk: true, isRequired: true
      }
    ]
  }

  return info
}


export function InputChanged(target: any, fields: any, setFields: any) {
  const name = target.name
  const value = target.value

  setFields(fields.map((field: any) => {
      if (field.name !== name) return field
      return {...field, value: value ? value : ''}
  }))
}


export async function RegisterFIR(fields: any[], dbURL: string, stripeInfo: any, setErrorCode: any, setIsSubmitButtonDisabled: any, router: any) {
  const fullName = fields.find(({ name }) => name === 'name').value;
  const email = fields.find(({ name }) => name === 'email').value;
  const password = fields.find(({ name }) => name === 'password').value;
  
  const wholeName = fullName.split(" ")
  const fName = wholeName[0]
  const lName = wholeName.length > 1 && wholeName[wholeName.length - 1]
  setIsSubmitButtonDisabled(true)

  if (fName && lName) {
    if (password.length > 6) {
        const userData: any = await Register(email, password, fName, lName, dbURL, stripeInfo)

        const user = userData['user']
        if (user) {
          // Keep the button disabled until we leave the page, so it can't be submitted twice.
          setTimeout(() => {
            // Analytics_Fir().signup()
            router.push('/')
          }, 2000);
        } else {
            setErrorCode(FirebaseErrorCode(userData['error']))
            setIsSubmitButtonDisabled(false)
            // Analytics_Fir().signupError()
        }

        return
    } else {
      setErrorCode(2)
    //   AnalyticsFIR().signupError()
      setIsSubmitButtonDisabled(false)
      return
    }
  } else {
      setErrorCode(1)
      setIsSubmitButtonDisabled(false)
      return
  }
}


// Maps Firebase Auth error codes to this page's error codes.
function FirebaseErrorCode(firebaseError: string | null) {
  switch(firebaseError) {
    case 'auth/email-already-in-use':
      return 5
    case 'auth/invalid-email':
      return 6
    case 'auth/weak-password':
      return 2
    default:
      return 4
  }
}


export function ErrorMessage(errorCode: number) {
  var info = { message: '' }

  switch(errorCode) {
    case 1:
      info['message'] = 'Please enter first & last name'
      break;
    case 2:
      info['message'] = 'Your password is too short. Password should be at least 7 characters long'
      break;
    case 3:
      info['message'] = 'Something went wrong, please try again later'
      break;
    case 4:
      info['message'] = 'Something went wrong, please try again later'
      break;
    case 5:
      info['message'] = 'An account with this email already exists.'
      break;
    case 6:
      info['message'] = 'Please enter a valid email address'
      break;
    default:
      info['message'] = ''
      break;
  }

  return info
}
