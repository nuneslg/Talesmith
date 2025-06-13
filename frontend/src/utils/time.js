export const formatTime = (now = new Date()) => {
    const hours = now.getHours()
    const minutes = now.getMinutes()

    let pos = 'AM'
    let hoursFormat = String(hours)
    let minutesFormat = String(minutes)

    if (hours >= 12) {
        pos = 'PM'
        hoursFormat = `${hours < 10 ? "0" : ""}${hours - 12}`
    }
    
    if (minutes < 10) {
        minutesFormat = `0${minutes}`
    }

    return `${hoursFormat}:${minutesFormat} ${pos}`
}