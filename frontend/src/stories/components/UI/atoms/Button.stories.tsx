import type { StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import Button from '@/app/components/UI/atoms/Button/Button';

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
    children: 'Hello, World!',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Hello, World!',
    variant: 'secondary',
  },
};

export const Dark: Story = {
  args: {
    children: 'Hello, Dark World!',
    variant: 'dark',
  },
};

export const Danger: Story = {
  args: {
    children: 'Hello, Delete World!',
    variant: 'danger',
  },
};

export const ButtonWithIcon: Story = {
  args: {
    children: 'Button w/ icon',
    className: 'gap-1',
    iconRight: 'dm-moon',
    iconRightClassName: 'w-6 h-6 fill-blue-03',
  },
};
