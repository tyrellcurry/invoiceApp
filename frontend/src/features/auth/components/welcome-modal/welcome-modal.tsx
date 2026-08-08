/**
 * @name WelcomeModal
 * @author Tyrell Curry <tyrellcurryio@gmail.com>
 *
 * Modal shown once, right after a fresh guest session or a user's
 * first-ever Google sign-in gets pre-populated with example invoices.
 * Reads and writes its own visibility via `lib/welcome-modal`
 * (localStorage), so it drops into the app shell with no wiring from the
 * caller. Dismissable via the footer button, the corner close button, a
 * backdrop click, or Escape — all equivalent.
 *
 * @returns {JSX.Element | null}
 */
import { JSX, useEffect, useState } from 'react';
import { useTranslations } from 'use-intl';
import Button from '@/components/ui/button/button';
import Container from '@/components/ui/container/container';
import Flex from '@/components/ui/flex/flex';
import Text from '@/components/ui/text/text';
import { dismissWelcomeModal, shouldShowWelcomeModal } from '@/lib/welcome-modal';

const WelcomeModal = (): JSX.Element | null => {
  const t = useTranslations('WelcomeModal');
  const [visible, setVisible] = useState(shouldShowWelcomeModal);

  const handleDismiss = () => {
    dismissWelcomeModal();
    setVisible(false);
  };

  // Close on Escape while open.
  useEffect(() => {
    if (!visible) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleDismiss();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [visible]);

  if (!visible) {
    return null;
  }

  return (
    <Container className="fixed inset-0 z-50 flex items-center justify-center p-6">
      {/* Backdrop */}
      <Container className="absolute inset-0 bg-black/50" aria-hidden onClick={handleDismiss} />

      {/* Dialog */}
      <Flex
        aria-label={t('title')}
        as="section"
        className="relative z-10 w-full max-w-120 rounded-lg bg-white p-8 shadow-[0px_10px_10px_-10px_rgba(72,84,159,0.1)] md:p-12 dark:bg-blue-03"
        direction="col"
        gapY={4}
        role="dialog"
        aria-modal
      >
        <button
          aria-label={t('close')}
          className="text-gray-06 hover:text-gray-08 absolute top-6 right-6 cursor-pointer text-xl leading-none dark:hover:text-white"
          type="button"
          onClick={handleDismiss}
        >
          ×
        </button>

        <Text className="text-gray-08 pr-6 dark:text-white" tag={'h2'} variant="h2">
          {t('title')}
        </Text>
        <Text className="text-gray-06 dark:text-gray-05 leading-5.5" tag={'p'} variant="body-alt">
          {t('message')}
        </Text>
        <Button
          className="mt-2 w-full justify-center"
          label={t('dismiss')}
          type="button"
          variant="primary"
          onClick={handleDismiss}
        />
      </Flex>
    </Container>
  );
};

export default WelcomeModal;
