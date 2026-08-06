import { fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from 'use-intl';
import WelcomeModal from '@/features/auth/components/welcome-modal/welcome-modal';
import { markPreloaded, shouldShowWelcomeModal } from '@/lib/welcome-modal';
import en from '../../../../../messages/en.json';

const renderModal = () =>
  render(
    <IntlProvider locale="en" messages={en}>
      <WelcomeModal />
    </IntlProvider>
  );

beforeEach(() => {
  localStorage.clear();
});

it('renders nothing when the account was not just preloaded', () => {
  const { container } = renderModal();

  expect(container).toBeEmptyDOMElement();
});

it('shows the welcome message when the account was just preloaded', () => {
  markPreloaded();

  renderModal();

  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(screen.getByText(/preloaded with 3 example invoices/i)).toBeInTheDocument();
});

it('dismissing via the bottom button clears the flag and hides the modal', () => {
  markPreloaded();

  renderModal();
  fireEvent.click(screen.getByRole('button', { name: /got it/i }));

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(shouldShowWelcomeModal()).toBe(false);
});

it('dismissing via the close button clears the flag and hides the modal', () => {
  markPreloaded();

  renderModal();
  fireEvent.click(screen.getByRole('button', { name: /close/i }));

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(shouldShowWelcomeModal()).toBe(false);
});

it('dismissing via a backdrop click clears the flag and hides the modal', () => {
  markPreloaded();

  const { container } = renderModal();
  const backdrop = container.querySelector('[aria-hidden="true"]');
  expect(backdrop).not.toBeNull();
  fireEvent.click(backdrop as Element);

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(shouldShowWelcomeModal()).toBe(false);
});

it('dismissing via Escape clears the flag and hides the modal', () => {
  markPreloaded();

  renderModal();
  fireEvent.keyDown(document, { key: 'Escape' });

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(shouldShowWelcomeModal()).toBe(false);
});
