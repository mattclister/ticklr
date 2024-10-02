import type { Meta, StoryObj } from '@storybook/react';

import { RemindersList } from './RemindersList';

const meta = {
  component: RemindersList,
} satisfies Meta<typeof RemindersList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};