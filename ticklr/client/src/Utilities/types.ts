export interface StateProps {
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>}

export type ReminderType = {
    pk_reminder_id: Number,
    title: String,
    date: String,
    reminder_date: String,
    fk_user_id: Number,
    recurs: String
}