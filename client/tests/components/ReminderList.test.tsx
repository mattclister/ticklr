import { it, expect, describe, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { RemindersList } from '../../src/components/RemindersList.tsx';
import React from 'react';
import '@testing-library/jest-dom/vitest';

const mockReminders = [
    {
      pk_reminder_id: 179,
      date: "2024-12-01T00:00:00.000Z",
      fk_user_id: 19,
      recurs: "1w",
      reminder_date: "Sun, 08 Dec 2024 00:00:00 GMT",
      title: "1st of December - 1 Week"
    },
    {
      pk_reminder_id: 181,
      date: "2024-10-14T23:00:00.000Z",
      fk_user_id: 19,
      recurs: "15w",
      reminder_date: "Tue, 28 Jan 2025 00:00:00 GMT",
      title: "New item"
    },
    {
      pk_reminder_id: 182,
      date: "2024-12-12T00:00:00.000Z",
      fk_user_id: 19,
      recurs: "16w",
      reminder_date: "Wed, 02 Apr 2025 23:00:00 GMT",
      title: "New item 3"
    }
  ]

describe('RemindersList', () => {
  it('Should render a list of scheduled events/reminders', async () => {
    // Mock props
    const setBottomBarVisible = vi.fn();
    const setActive = vi.fn();
    const setReminderData = vi.fn();
    const setTopBarVisible = vi.fn();

    // Render component
    render(
      <RemindersList
        setBottomBarVisible={setBottomBarVisible}
        setActive={setActive}
        active={undefined}
        reminderdata={mockReminders}
        setReminderData={setReminderData}
        setTopBarVisible={setTopBarVisible}
        topBarVisible={false}
        bottomBarVisible={false}
      />
    );

    // Wait for the data to load and check rendering
    await waitFor(() => {
        console.log(screen.debug())
        expect(screen.getByText(/1st of December - 1 Week/)).toBeInTheDocument();
        expect(screen.getByText(/New item 3/)).toBeInTheDocument();
      });

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(4);
  });
});