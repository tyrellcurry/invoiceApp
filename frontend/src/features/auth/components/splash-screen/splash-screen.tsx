/**
 * @name SplashScreen
 * @author Tyrell Curry <tyrellcurryio@gmail.com>
 *
 * First-load gate shown until a session exists: sign in with Google, or
 * continue as an ephemeral guest whose data is deleted when the session
 * expires. Presentation only; the caller owns the actions and copy.
 *
 * @param props - see {@link ISplashScreenProps}
 *
 * @returns {JSX.Element}
 */
import { JSX } from 'react';
import Button from '@/components/ui/button/button';
import Flex from '@/components/ui/flex/flex';
import Text from '@/components/ui/text/text';
import { ISplashScreenProps } from '@/features/auth/components/splash-screen/splash-screen.types';

const SplashScreen = (props: ISplashScreenProps): JSX.Element => {
  const { labels, googleLoginUrl, onContinueAsGuest, isContinuingAsGuest } = props;

  return (
    <Flex align="center" className="min-h-screen px-6 py-20" direction="col" justify="center">
      <Flex
        align="center"
        className="w-full max-w-100 rounded-lg bg-white p-8 text-center drop-shadow-lg md:p-12 dark:bg-blue-03"
        direction="col"
        gapY={6}
      >
        <Text className="text-gray-08 dark:text-white" tag={'h1'} variant="h1">
          {labels.title}
        </Text>
        <Text className="text-gray-06 dark:text-gray-05" tag={'p'}>
          {labels.description}
        </Text>

        <Flex className="w-full" direction="col" gapY={3}>
          <Button
            className="w-full justify-center"
            href={googleLoginUrl}
            label={labels.continueWithGoogle}
            variant="primary"
          />
          <Button
            className="w-full justify-center"
            disabled={isContinuingAsGuest}
            label={labels.continueAsGuest}
            variant="secondary"
            onClick={onContinueAsGuest}
          />
        </Flex>

        <Text className="text-gray-06 dark:text-gray-05 text-[13px] leading-4.5" tag={'p'}>
          {labels.guestWarning}
        </Text>
      </Flex>
    </Flex>
  );
};

export default SplashScreen;
