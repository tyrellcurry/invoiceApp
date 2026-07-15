import React, { JSX } from 'react';
import { IMainMenuProps } from '@/components/layouts/main-menu/main-menu.types';
import Button from '@/components/ui/button/button';
import Flex from '@/components/ui/flex/flex';
import Image from 'next/image';
import { DARK_MODE } from '@/config/constants';
import Link from 'next/link';
const MainMenu = (props: IMainMenuProps): JSX.Element => {
  const { darkmode, darkmodeToggle, profile, darkmodeBtn, ...rest } = props;
  return (
    <Flex
      align="stretch"
      as="nav"
      className="bg-gray-09 lg:flex-col lg:w-fit lg:rounded-r-[20px] lg:rounded-tr-3xl lg:h-screen lg:fixed lg:left-0"
      justify="between"
      {...rest}
    >
      <Button
        className="w-12.5 h-12.5 xs:w-18 xs:h-18 md:w-20 md:h-20"
        href="/"
        iconLeft={'menu-logo-btn'}
        iconLeftClassName="w-full h-full"
        variant="custom"
      />
      <Flex className="px-6 md:gap-8 md:px-8 lg:flex-col lg:gap-5 lg:px-0 lg:py-6" gap={5}>
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
      </Flex>
    </Flex>
  );
};

export default MainMenu;
