import dayjs from "dayjs"

// Return reminder date 

export const returnReminderDate = function (date: string, number: number, unit_time: "day" | "week" | "month" | "year") {
    const dateObject = dayjs(date)
    return dateObject.add(number, unit_time).toString()
}
