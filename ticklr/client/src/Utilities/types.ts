export interface StateProps {
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>}

export type ReminderType = {
    id: Number,
    title: String,
    date: String,
    userId: Number,
    recurs: String
}