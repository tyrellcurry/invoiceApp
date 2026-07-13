import React, { JSX } from 'react';
import { IMainMenuProps } from '@/components/layouts/main-menu/main-menu.types';
import Button from '@/components/ui/button/button';
import Image from 'next/image';
import { DARK_MODE } from '@/config/constants';
import Link from 'next/link';
const MainMenu = (props: IMainMenuProps): JSX.Element => {
  const { darkmode, darkmodeToggle, profile, darkmodeBtn, ...rest } = props;
  return (
    <nav
      className="bg-gray-09 flex justify-between items-stretch lg:flex-col lg:w-fit lg:rounded-r-[20px] lg:rounded-tr-3xl lg:h-screen lg:fixed lg:left-0"
      {...rest}
    >
      <Button
        className="w-[50px] h-[50px] xs:w-[72px] xs:h-[72px] md:w-[80px] md:h-[80px]"
        href="/"
        iconLeft={'menu-logo-btn'}
        iconLeftClassName="w-full h-full"
        variant="custom"
      />
      <div className="flex gap-5 px-6 md:gap-8 md:px-8 lg:flex-col lg:gap-5 lg:px-0 lg:py-6">
        <Button
          aria-label={darkmode === DARK_MODE ? darkmodeBtn?.lightAria : darkmodeBtn?.darkAria}
          className="h-fit self-center"
          iconLeft={darkmode === DARK_MODE ? 'dm-sun' : 'dm-moon'}
          iconLeftClassName="w-8 h-8 fill-gray-07 hover:fill-gray-05"
          variant="custom"
          onClick={darkmodeToggle}
        />
        <hr className="border-none w-0.5 h-full bg-gray-04 self-stretch lg:w-full lg:h-0.5" />
        <Link
          className="h-fit self-center relative"
          data-testid="profile-link"
          href={profile?.link || '#'}
        >
          <Image
            alt={profile?.profileImageAlt}
            className="rounded-full w-full h-auto max-w-8"
            height={64}
            src={!!profile?.profileImage ? profile?.profileImage : '/assets/profile-default.png'}
            width={64}
          />
        </Link>
      </div>
    </nav>
  );
};

export default MainMenu;
