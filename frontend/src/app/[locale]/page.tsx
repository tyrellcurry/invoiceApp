import { useTranslations } from 'next-intl';
import Text from '../components/UI/atoms/Text/Text';

export default function Home() {
  const t = useTranslations('HomePage');
  return (
    <div>
      <Text variant="h1">{t('title')}</Text>
    </div>
  );
}
