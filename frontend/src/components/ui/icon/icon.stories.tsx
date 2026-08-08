import type { StoryObj } from '@storybook/react-vite';

import Icon from '@/components/ui/icon/icon';

const meta = {
  title: 'UI/Icon',
  component: Icon,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Sample: Story = {
  args: {
    name: 'dm-moon',
    fill: '#252945',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '50px' }}>
        <Story />
      </div>
    ),
  ],
};
