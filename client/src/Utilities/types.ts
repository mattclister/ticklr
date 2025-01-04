export interface StateProps {
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>}

export type ReminderType = {
    pk_reminder_id: number,
    title: string,
    date: string,
    reminder_date: string,
    fk_user_id: number,
    recurs: string
}
