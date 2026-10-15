// import { analytics } from './Firebase.js'
import { analytics } from '@/config/firebase/Firebase';




export function Analytics_Fir() {

  // Actions
  function login() {
    analytics.logEvent("login", {
      method: "email"
    });
  }

  function loginError() {
    analytics.logEvent("login_error", {
      method: "email"
    });
  }

  function signup() {
    analytics.logEvent("sign_up", {
      method: "email"
    });
  }

  function signupError() {
    analytics.logEvent("sign_up_error", {
      method: "email"
    });
  }

  function submitEmail_splash() {
    analytics.logEvent('submitEmail_splash');
  }

  function create_trip() {
    analytics.logEvent('create_trip');
  }

  function create_workspace() {
    analytics.logEvent('create_workspace');
  }

  function create_workspaceError() {
    analytics.logEvent('create_workspace_Error');
  }

  function create_employee() {
    analytics.logEvent('create_employee');
  }

  function create_client() {
    analytics.logEvent('create_client');
  }

  function print_schedule() {
    analytics.logEvent('print_schedule');
  }

  function sent_invite() {
    analytics.logEvent('sent_invite');
  }

  function accepted_invite() {
    analytics.logEvent('accepted_invite');
  }

  function rejected_invite() {
    analytics.logEvent('rejected_invite');
  }


  // Page views
  function pageViewed(pageTitle) {
    analytics.logEvent('screen_view', {
      firebase_screen: pageTitle
    });
  }



  return {
    login: login,
    loginError: loginError,
    signup: signup,
    signupError: signupError,
    submitEmail_splash: submitEmail_splash,
    create_workspace: create_workspace,
    create_workspaceError: create_workspaceError,
    create_trip: create_trip,
    create_employee: create_employee,
    create_client: create_client,
    print_schedule: print_schedule,
    sent_invite: sent_invite,
    accepted_invite: accepted_invite,
    rejected_invite: rejected_invite,
    pageViewed: pageViewed
  }
}
