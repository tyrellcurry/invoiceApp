import React from 'react';
import { render } from '@testing-library/react';
import MainMenu from '@/app/components/UI/molecules/MainMenu/MainMenu';

describe('Main Menu Component', () => {
  it('renders correctly with default props', () => {
    const { container } = render(
      <MainMenu
        darkmode={'dark'}
        darkmodeToggle={() => {}}
        profileImage={'/assets/profile-default.png'}
        profileImageAlt="lorem ipsum"
      />
    );
    expect(container).toMatchSnapshot();
  });
});
