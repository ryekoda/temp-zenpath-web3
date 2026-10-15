import { logEvent } from "firebase/analytics";
import { analytics } from '@/config/firebase/Firebase';



export function AnalyticsFIR() {

  function login() {
    // logEvent(analytics, 'login', {
    //     method: "email"
    // });
  }

  function loginError() {
    // logEvent(analytics, 'login_error', {
    //     method: "email"
    // });
  }

  function signup() {
    // logEvent(analytics, 'sign_up', {
    //     method: "email"
    // });
  }

  function signupError() {
    // logEvent(analytics, 'sign_up_error', {
    //     method: "email"
    // });
  }

  function submitEmail_splash() {
    // logEvent(analytics, 'submitEmail_splash');
  }

  function create_trip() {
    // logEvent(analytics, 'create_trip');
  }

  function create_workspace() {
    // logEvent(analytics, 'create_workspace');
  }

  function create_workspaceError() {
    // logEvent(analytics, 'create_workspace_Error');
  }

  function create_employee() {
    // logEvent(analytics, 'create_employee');
  }

  function create_client() {
    // logEvent(analytics, 'create_client');
  }

  function print_schedule() {
    // logEvent(analytics, 'print_schedule');
  }

  function sent_invite() {
    // logEvent(analytics, 'sent_invite');
  }

  function accepted_invite() {
    // logEvent(analytics, 'accepted_invite');
  }

  function rejected_invite() {
    // logEvent(analytics, 'rejected_invite');
  }


  // Page views
  function pageViewed(pageTitle: string) {
    // logEvent(analytics, 'page_view', {
    //     firebase_screen: pageTitle
    // });
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
