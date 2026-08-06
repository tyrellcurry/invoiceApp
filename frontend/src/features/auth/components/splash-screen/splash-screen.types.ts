export interface SplashScreenLabels {
  title: string;
  description: string;
  continueWithGoogle: string;
  continueAsGuest: string;
  guestWarning: string;
  /** Credit line preceding the author link, e.g. "Made with ❤️ by". The space
   *  before the link is added by the component, not carried in the string. */
  madeWith: string;
  authorName: string;
}

export interface ISplashScreenProps {
  labels: SplashScreenLabels;
  googleLoginUrl: string;
  /** The author link target for the credit line in the footer. */
  authorUrl: string;
  onContinueAsGuest: () => void;
  isContinuingAsGuest?: boolean;
}
