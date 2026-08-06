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
    // Same max width as the invoice list below it, so the two edges line up.
    <Flex
      align="center"
      className="mx-auto mb-8 max-w-250 gap-x-4 rounded-lg bg-white px-6 py-4 drop-shadow-lg dark:bg-blue-03"
      justify="between"
      role="status"
    >
      <Flex align="center" gapX={3}>
        <span className="h-2 w-2 shrink-0 rounded-full bg-green-05" aria-hidden />
        <Text className="text-gray-07 dark:text-gray-05 text-[13px] leading-4.5" tag="p">
          {t('message')}
        </Text>
      </Flex>
      <button
        aria-label={t('dismiss')}
        className="text-gray-06 hover:text-gray-08 shrink-0 cursor-pointer px-1 text-xl leading-none dark:hover:text-white"
        type="button"
        onClick={handleDismiss}
      >
        ×
      </button>
    </Flex>
  );
};

export default PreloadBanner;
