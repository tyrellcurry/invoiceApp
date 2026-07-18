import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import MainMenu from '@/components/layouts/main-menu/main-menu';

describe('Main Menu Component', () => {
  it('renders correctly with default props', () => {
    const { container } = render(
      <MemoryRouter>
        <MainMenu
          darkmode={'dark'}
          darkmodeToggle={() => {}}
          profile={{
            profileImage: '/assets/profile-default.png',
            profileImageAlt: 'lorem ipsum',
          }}
        />
      </MemoryRouter>
    );
    expect(container).toMatchSnapshot();
  });
});
