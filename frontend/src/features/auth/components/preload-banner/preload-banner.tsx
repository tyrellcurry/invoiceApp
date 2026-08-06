/**
 * @name PreloadBanner
 * @author Tyrell Curry <tyrellcurryio@gmail.com>
 *
 * Dismissable banner shown once, right after a fresh guest session or a
 * user's first-ever Google sign-in gets pre-populated with example
 * invoices. Reads and writes its own visibility via `lib/preload-banner`
 * (localStorage), so it drops into the app shell with no wiring from the
 * caller.
 *
 * @returns {JSX.Element | null}
 */
import { JSX, useState } from 'react';
import { useTranslations } from 'use-intl';
import Flex from '@/components/ui/flex/flex';
import Text from '@/components/ui/text/text';
import { dismissPreloadBanner, shouldShowPreloadBanner } from '@/lib/preload-banner';

const PreloadBanner = (): JSX.Element | null => {
  const t = useTranslations('PreloadBanner');
  const [visible, setVisible] = useState(shouldShowPreloadBanner);

  if (!visible) {
    return null;
  }

  const handleDismiss = () => {
    dismissPreloadBanner();
    setVisible(false);
  };

  return (
    <Flex
      align="center"
      className="mb-6 rounded-lg bg-blue-01 px-4 py-3 text-white md:px-6"
      justify="between"
      role="status"
    >
      <Text tag="p" variant="body-alt">
        {t('message')}
      </Text>
      <button
        aria-label={t('dismiss')}
        className="cursor-pointer px-2 text-xl leading-none"
        type="button"
        onClick={handleDismiss}
      >
        ×
      </button>
    </Flex>
  );
};

export default PreloadBanner;
