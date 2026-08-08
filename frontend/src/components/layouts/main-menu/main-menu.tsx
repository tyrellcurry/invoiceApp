import { JSX, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { IMainMenuProps } from '@/components/layouts/main-menu/main-menu.types';
import Button from '@/components/ui/button/button';
import Flex from '@/components/ui/flex/flex';
import { DARK_MODE } from '@/config/constants';
const MainMenu = (props: IMainMenuProps): JSX.Element => {
  const {
    darkmode,
    darkmodeToggle,
    profile,
    darkmodeBtn,
    userEmail,
    logoutLabel,
    accountMenuLabel,
    onLogout,
    ...rest
  } = props;

  // Account menu behind the profile avatar. Only rendered when there's
  // something to put in it (i.e. a logout handler); otherwise the avatar
  // stays the plain link it was.
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAccountMenuOpen) {
      return;
    }
    const handlePointerDown = (event: MouseEvent) => {
      if (!accountMenuRef.current?.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAccountMenuOpen]);

  const avatar = (
    <img
      alt={profile?.profileImageAlt}
      className="rounded-full w-full h-auto max-w-10 min-w-7"
      src={!!profile?.profileImage ? profile?.profileImage : '/assets/profile-default.png'}
      onError={(event) => {
        // Google avatar URLs can 404 (photo removed, or rate-limited hotlink);
        // fall back to the bundled default rather than a broken image.
        event.currentTarget.src = '/assets/profile-default.png';
      }}
    />
  );

  return (
    <Flex
      align="stretch"
      as="nav"
      className="bg-gray-09 lg:flex-col lg:w-fit lg:rounded-r-[20px] lg:rounded-tr-3xl lg:h-screen lg:fixed lg:left-0 lg:z-20"
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
          iconLeftClassName="w-7 h-7 max-h-7 md:w-8 md:h-8 md:max-h-8 fill-gray-07 hover:fill-gray-05"
          variant="custom"
          onClick={darkmodeToggle}
        />
        <hr className="border-none w-0.5 h-full bg-gray-04 self-stretch lg:w-full lg:h-0.5" />
        {onLogout ? (
          <Flex className="h-fit self-center relative" ref={accountMenuRef}>
            <button
              aria-expanded={isAccountMenuOpen}
              aria-haspopup="menu"
              aria-label={accountMenuLabel}
              className="cursor-pointer"
              data-testid="profile-menu-button"
              title={userEmail}
              type="button"
              onClick={() => setIsAccountMenuOpen((open) => !open)}
            >
              {avatar}
            </button>
            {/* Mobile/tablet: the nav is a top bar, so the menu drops below the
                avatar. Large screens: the nav is a left sidebar, so it opens to
                the right of it instead. */}
            {isAccountMenuOpen && (
              <Flex
                as="menu"
                className="absolute top-full right-0 z-30 mt-3 min-w-45 rounded-lg bg-white p-2 drop-shadow-lg dark:bg-blue-03 lg:top-auto lg:bottom-0 lg:left-full lg:right-auto lg:mt-0 lg:ml-3"
                direction="col"
                role="menu"
              >
                {userEmail && (
                  <span className="truncate px-3 py-2 text-[13px] text-gray-06 dark:text-gray-05">
                    {userEmail}
                  </span>
                )}
                <button
                  className="cursor-pointer rounded-sm px-3 py-2 text-left text-[13px] font-medium text-gray-08 hover:bg-gray-05b dark:text-white dark:hover:bg-blue-04"
                  role="menuitem"
                  type="button"
                  onClick={() => {
                    setIsAccountMenuOpen(false);
                    onLogout();
                  }}
                >
                  {logoutLabel}
                </button>
              </Flex>
            )}
          </Flex>
        ) : (
          <Link
            className="h-fit self-center relative"
            data-testid="profile-link"
            to={profile?.link || '#'}
          >
            {avatar}
          </Link>
        )}
      </Flex>
    </Flex>
  );
};

export default MainMenu;
