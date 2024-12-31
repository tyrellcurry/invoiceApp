export interface IMainMenuProps {
  darkmode: string | undefined;
  darkmodeToggle: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  profileImage?: string;
  profileImageAlt: string;
}
