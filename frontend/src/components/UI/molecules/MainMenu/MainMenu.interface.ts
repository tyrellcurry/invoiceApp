export interface IMainMenuProps {
  darkmode: string | undefined;
  darkmodeToggle: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  profile: {
    link?: string;
    profileImage?: string;
    profileImageAlt: string;
  };
  darkmodeBtn?: {
    darkAria?: string;
    lightAria?: string;
  };
}
