import { fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from 'use-intl';
import PreloadBanner from '@/features/auth/components/preload-banner/preload-banner';
import { markPreloaded, shouldShowPreloadBanner } from '@/lib/preload-banner';
import en from '../../../../../messages/en.json';

const renderBanner = () =>
  render(
    <IntlProvider locale="en" messages={en}>
      <PreloadBanner />
    </IntlProvider>
  );

beforeEach(() => {
  localStorage.clear();
});

it('renders nothing when the account was not just preloaded', () => {
  const { container } = renderBanner();

  expect(container).toBeEmptyDOMElement();
});

it('shows the message when the account was just preloaded', () => {
  markPreloaded();

  renderBanner();

  expect(screen.getByText(/preloaded with 3 example invoices/i)).toBeInTheDocument();
});

it('dismissing clears the flag and hides the banner', () => {
  markPreloaded();

  renderBanner();
  fireEvent.click(screen.getByRole('button', { name: /dismiss/i }));

  expect(screen.queryByText(/preloaded with 3 example invoices/i)).not.toBeInTheDocument();
  expect(shouldShowPreloadBanner()).toBe(false);
});
