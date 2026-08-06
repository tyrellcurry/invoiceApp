import type { MouseEvent as ReactMouseEvent } from 'react';

export interface IMainMenuProps {
  darkmode: string | undefined;
  darkmodeToggle: (event: ReactMouseEvent<HTMLElement, MouseEvent>) => void;
  profile: {
    link?: string;
    profileImage?: string;
    profileImageAlt: string;
  };
  darkmodeBtn?: {
    darkAria?: string;
    lightAria?: string;
  };
  /** Shown as a title on the logout button when signed in with Google. */
  userEmail?: string;
  logoutLabel?: string;
  onLogout?: () => void;
}
