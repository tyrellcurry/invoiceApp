import React, { JSX } from 'react';
import { IMainMenuProps } from '@/app/components/UI/molecules/MainMenu/MainMenu.interface';
import Button from '@/app/components/UI/atoms/Button/Button';
import Image from 'next/image';
const MainMenu = (props: IMainMenuProps): JSX.Element => {
  const { darkmode, darkmodeToggle, profileImage, profileImageAlt } = props;
  return (
    <nav className="bg-gray-09 flex justify-between items-stretch lg:flex-col lg:w-fit lg:rounded-r-[20px] lg:rounded-tr-3xl lg:h-screen lg:fixed lg:left-0">
      <Button
        className="w-[50px] h-[50px] xs:w-[72px] xs:h-[72px] md:w-[80px] md:h-[80px]"
        iconLeft={'menu-logo-btn'}
        iconLeftClassName="w-full h-full"
        variant="custom"
      />
      <div className="flex gap-5 px-6 md:gap-8 md:px-8 lg:flex-col lg:gap-5 lg:px-0 lg:py-6">
        <Button
          className="h-fit self-center"
          iconLeft={darkmode ? 'dm-sun' : 'dm-moon'}
          iconLeftClassName="w-8 h-8 fill-gray-07 hover:fill-gray-05"
          variant="custom"
          onClick={() => darkmodeToggle}
        />
        <hr className="border-none w-0.5 h-full bg-gray-04 self-stretch lg:w-full lg:h-0.5" />
        <Button className="h-fit self-center relative" variant="custom">
          <Image
            className="rounded-full w-full h-auto max-w-8"
            src={!!profileImage ? profileImage : '/assets/profile-default.png'}
            alt={profileImageAlt}
            width={64}
            height={64}
          />
        </Button>
      </div>
    </nav>
  );
};

export default MainMenu;
