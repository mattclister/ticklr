const dayjs = require ("./node_modules/dayjs")

// Calculate Reminder Date from start date and recurance. 

const calcReminderDate = function (newReminder) {
    const conversions = {
        week: { initial: "w" },
        day: { initial: "d" },
        month: { initial: "m" },
        year: { initial: "y" }
    }
    const { date, number, unit_time } = newReminder

    const dateObject = dayjs(date)
    const newDate = dateObject.add(number, unit_time);

    return {
        ...newReminder, date: dateObject, reminder_date: newDate, recurs: `${number}${conversions[unit_time].initial}`
    }
}

// Return reminder date 

const returnReminderDate = function (date, number, unit_time) {
    const dateObject = dayjs(date)
    return dateObject.add(number, unit_time).toString()
}

// Combine Number and Unit Time

const UnitAndNumberToRecurs = function (number, unit_time) {

    const conversions = {
        week: "w",
        day: "d",
        month: "m",
        year: "y",
    }

    return number.toString() && conversions[unit_time]
}

// Uncombine Number and Unit Time

// Take recurs and return unit

const RecursToUnit = function (recurs) {

    const conversions = {
        w: "week",
        d: "day",
        m: "month",
        y: "year",
        default: "day"
    }

    const key = recurs[recurs.length - 1];
    return conversions[key]
}

// Take recurs and return number

const RecursToNumber = function (recurs) {
    return parseInt(recurs.slice(0,recurs.length-1))
}


// Convert New Reminder Type to Reminder Type
// If no reminder ID sets a temporary id of -1. This is used for optamistic updates.

const ConvertNewReminderToReminder = function (NewReminder, fk_user_id = -1, pk_reminder_id = -1) {

    return {
        date: NewReminder.date,
        fk_user_id: fk_user_id,
        pk_reminder_id: pk_reminder_id,
        title: NewReminder.reminder,
        recurs: UnitAndNumberToRecurs(NewReminder.number, NewReminder.unit_time),
        reminder_date: returnReminderDate(NewReminder.date, NewReminder.number, NewReminder.unit_time)
    }
}

// Convert Reminder Type to New Remininder Type

 const ConvertReminderToNewReminder = function (Reminder) {

    return {
            date: Reminder.date,
            reminder: Reminder.title,
            number: RecursToNumber(Reminder.recurs),
            unit_time: RecursToUnit(Reminder.recurs)
    }
 }

module.exports = {
    calcReminderDate,
    returnReminderDate,
    UnitAndNumberToRecurs,
    RecursToUnit,
    RecursToNumber,
    ConvertNewReminderToReminder,
    ConvertReminderToNewReminder
  };