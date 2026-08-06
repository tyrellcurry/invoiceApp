export interface SplashScreenLabels {
  title: string;
  description: string;
  continueWithGoogle: string;
  continueAsGuest: string;
  guestWarning: string;
}

export interface ISplashScreenProps {
  labels: SplashScreenLabels;
  googleLoginUrl: string;
  onContinueAsGuest: () => void;
  isContinuingAsGuest?: boolean;
}
