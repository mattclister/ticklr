export interface StateProps {
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>}

export type ReminderType = {
    pk_reminder_id: number,
    title: string,
    date: string,
    reminder_date: string,
    fk_user_id: number,
    unit_time?: "day" | "week" | "month" | "year" | undefined 
    unit_count?: number,
    fk_trigger_id?: number,
    files?: BinaryType,
    recurring: boolean,
    body?: string,
}