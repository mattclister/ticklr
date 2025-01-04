import { NewReminderType } from "../Components/ItemDetails"
import { ReminderType } from "./types"
import dayjs from "dayjs"


// Calculate Reminder Date from start date and recurance. 

export const convertRecurs = function (newReminder: NewReminderType) {
    const conversions = {
        week: { initial: "w" },
        day: { initial: "d" },
        month: { initial: "m" },
        year: { initial: "y" }
    }
    const { date, number, unit_time } = newReminder

    const dateObject = dayjs(date)

    return {
        ...newReminder, date: dateObject, reminder_date: dateObject, recurs: `${number}${conversions[unit_time].initial}`
    }

}

// Return reminder date 

export const returnReminderDate = function (date: string, number: number, unit_time: "day" | "week" | "month" | "year") {
    const dateObject = dayjs(date)
    return dateObject.add(number, unit_time).toString()
}

// Combine Number and Unit Time

export const UnitAndNumberToRecurs = function (number: number, unit_time: "day" | "week" | "month" | "year"): string {
    console.log('Converting Unit and Number')
    console.log(number)
    console.log(unit_time)

    const conversions = {
        week: "w",
        day: "d",
        month: "m",
        year: "y",
    } as const;

    return number.toString() + conversions[unit_time]
}

// Uncombine Number and Unit Time

// Take recurs and return unit

export const RecursToUnit = function (recurs:string): typeof conversions[keyof typeof conversions] {

    const conversions = {
        w: "week",
        d: "day",
        m: "month",
        y: "year",
        default: "day"
    } as const;

    const key = recurs[recurs.length - 1] as keyof typeof conversions;
    return conversions[key]
}

// Take recurs and return number

export const RecursToNumber = function (recurs:string): number {
    return parseInt(recurs.slice(0,recurs.length-1))
}


// Convert New Reminder Type to Reminder Type
// If no reminder ID sets a temporary id of -1. This is used for optamistic updates.

export const ConvertNewReminderToReminder = function (NewReminder: NewReminderType, fk_user_id: number, pk_reminder_id: number): ReminderType {

    return {
        date: NewReminder.date,
        fk_user_id: fk_user_id,
        pk_reminder_id: pk_reminder_id,
        title: NewReminder.reminder,
        recurs: UnitAndNumberToRecurs(NewReminder.number, NewReminder.unit_time),
        reminder_date: NewReminder.date
    }
}

// // Convert Reminder Type to New Remininder Type


export const ConvertReminderToNewReminder = function (Reminder: ReminderType): NewReminderType {

    return {
            date: Reminder.date,
            reminder: Reminder.title,
            number: RecursToNumber(Reminder.recurs),
            unit_time: RecursToUnit(Reminder.recurs)
    }
 }