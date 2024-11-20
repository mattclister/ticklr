import { NewReminderType } from "../Components/ItemDetails"

// Calculate Reminder Date

export const calcReminderDate = function(newReminder: NewReminderType) {
    console.log("Calculating Reminder Date...");
    console.log(newReminder);
    const {date, number, unit_time} = newReminder;
    console.log(date);
    console.log(number);
    console.log(unit_time);
}