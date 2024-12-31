import { IMainMenuProps } from '@/app/components/UI/molecules/MainMenu/MainMenu.interface';

export interface IMainPageLayoutProps {
  children: React.ReactNode;
  profileImageAlt: IMainMenuProps['profileImageAlt'];
}
