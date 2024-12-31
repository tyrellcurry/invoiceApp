'use client';
import MainMenu from '@/app/components/UI/molecules/MainMenu/MainMenu';
import { JSX, useEffect, useState } from 'react';
import { useDarkMode } from '@/utils/hooks/useDarkMode';
import { IMainPageLayoutProps } from '@/app/components/UI/organisms/PageLayout/MainPageLayout.interface';

const MainPageLayout = ({ children, profileImageAlt }: IMainPageLayoutProps): JSX.Element => {
  const { theme, toggleTheme } = useDarkMode();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <>
      {isHydrated && (
        <MainMenu darkmodeToggle={toggleTheme} darkmode={theme} profileImageAlt={profileImageAlt} />
      )}
      <main className="lg:ml-20">{children}</main>
    </>
  );
};

export default MainPageLayout;
