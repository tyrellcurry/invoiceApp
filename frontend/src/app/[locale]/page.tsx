import React from 'react';
import { useTranslations } from 'next-intl';
import Text from '@/app/components/UI/atoms/Text/Text';
import MainPageLayout from '@/app/components/UI/organisms/PageLayout/MainPageLayout';

export default function Home() {
  const t = useTranslations();
  return (
    <MainPageLayout profileImageAlt={t('MainMenu.profileImageAlt')}>
      <div>
        <Text variant="h1">{t('HomePage.title')}</Text>
      </div>
    </MainPageLayout>
  );
}
