import type { StoryObj } from '@storybook/nextjs';
import { fn } from 'storybook/test';
import Button from '@/components/ui/button/button';

const meta = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  args: { onClick: fn() },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Hello, World!',
  },
};

export const Secondary: Story = {
  args: {
    label: 'Hello, World!',
    variant: 'secondary',
  },
};

export const Dark: Story = {
  args: {
    label: 'Hello, Dark World!',
    variant: 'dark',
  },
};

export const Danger: Story = {
  args: {
    label: 'Hello, Delete World!',
    variant: 'danger',
  },
};

export const ButtonWithIcon: Story = {
  args: {
    label: 'Button w/ icon',
    className: 'gap-1',
    iconRight: 'dm-moon',
    iconRightClassName: 'w-6 h-6 fill-blue-03',
  },
};

export const ButtonAsLink: Story = {
  args: {
    label: 'Button As Link',
    className: 'gap-1',
    href: '#',
  },
};

export const ButtonWithText: Story = {
  args: {
    className: 'gap-1',
    href: '#',
    label: 'test',
  },
};
