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

module.exports = {
    calcReminderDate,
  };