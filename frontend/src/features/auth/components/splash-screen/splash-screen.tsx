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
import Container from '@/components/ui/container/container';
import Flex from '@/components/ui/flex/flex';
import Icon from '@/components/ui/icon/icon';
import Text from '@/components/ui/text/text';
import { ISplashScreenProps } from '@/features/auth/components/splash-screen/splash-screen.types';

const SplashScreen = (props: ISplashScreenProps): JSX.Element => {
  const { labels, googleLoginUrl, authorUrl, onContinueAsGuest, isContinuingAsGuest } = props;

  return (
    <Flex
      align="center"
      className="min-h-screen px-6 py-12 md:py-16"
      direction="col"
      gapY={10}
      justify="between"
    >
      <Flex align="center" className="w-full flex-1" direction="col" justify="center">
        <Flex
          className="w-full max-w-120 overflow-hidden rounded-2xl bg-white drop-shadow-xl dark:bg-blue-03"
          direction="col"
        >
          <Flex
            align="center"
            className="bg-gray-09 px-8 py-10 text-center md:px-12"
            direction="col"
            gapY={3}
          >
            {/* The shared `.text` class hardcodes text-align:left, so centering
                has to be set explicitly rather than inherited from the band. */}
            <Text className="text-center text-white" tag={'h1'} variant="h1">
              {labels.title}
            </Text>
            <Text className="text-gray-05 text-center leading-relaxed" tag={'p'}>
              {labels.description}
            </Text>
          </Flex>

          <Container className="px-8 py-10 md:px-12">
            <Flex direction="col" gapY={3}>
              {/* Google's branding guidelines: white surface, neutral border,
                  full-colour mark, and the wordmark left untranslated. */}
              <a
                className="flex w-full items-center justify-center gap-x-3 rounded-full border border-gray-05 bg-white px-6 py-4 text-[15px] font-bold whitespace-nowrap text-gray-08 transition-colors hover:bg-gray-05b dark:border-blue-04 dark:bg-white"
                href={googleLoginUrl}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" name="google" />
                {labels.continueWithGoogle}
              </a>
              <Button
                className="w-full justify-center whitespace-nowrap"
                disabled={isContinuingAsGuest}
                label={labels.continueAsGuest}
                variant="secondary"
                onClick={onContinueAsGuest}
              />
            </Flex>

            <Text
              className="text-gray-06 dark:text-gray-05 mt-5 text-center text-[13px] leading-4.5"
              tag={'p'}
            >
              {labels.guestWarning}
            </Text>
          </Container>
        </Flex>
      </Flex>

      <Text className="text-gray-06 dark:text-gray-05 text-center text-[13px]" tag={'p'}>
        {labels.madeWith}{' '}
        <a
          className="text-blue-01 font-bold hover:underline dark:text-blue-02"
          href={authorUrl}
          rel="noreferrer"
          target="_blank"
        >
          {labels.authorName}
        </a>
      </Text>
    </Flex>
  );
};

export default SplashScreen;
