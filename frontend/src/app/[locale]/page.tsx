import React from 'react';
import { useTranslations } from 'next-intl';
import Text from '@/components/UI/atoms/Text/Text';

export default function Home() {
  const t = useTranslations();
  return (
    <div>
      <Text variant="h1">{t('HomePage.title')}</Text>
    </div>
  );
}
