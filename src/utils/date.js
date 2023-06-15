 const currentDate = () => {

    const curr = new Date();
    const cYear = curr.getFullYear()
    const cMonth = curr.getMonth()
    const cDay = curr.getDay()
    const cHour = curr.getHours()
    const cMins = curr.getMinutes()
    const cSecs = curr.getSeconds()

    return `${cYear}-${cMonth}-${cDay}_H${cHour}-${cMins}-${cSecs}`
 }

 export {currentDate}