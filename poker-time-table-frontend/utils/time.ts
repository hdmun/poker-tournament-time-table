interface TimeDto {
  hours: string
  minutes: string
  seconds: string
}

export function convertMsToTimeString(milliseconds: number): string {
  // https://bobbyhadz.com/blog/typescript-calculate-time-between-dates
  const time = convertMsToTime(milliseconds)

  // 👇️ If you want to roll hours over, e.g. 00 to 24
  // 👇️ uncomment the line below
  // uncommenting next line gets you `00:00:00` instead of `24:00:00`
  // or `12:15:31` instead of `36:15:31`, etc.
  // 👇️ (roll hours over)
  // hours = hours % 24;
  if (time.hours === '00') {
    return `${time.minutes}:${time.seconds}`
  }

  return `${time.hours}:${time.minutes}:${time.seconds}`
}

function convertMsToTime(milliseconds: number): TimeDto {
  let seconds = Math.floor(milliseconds / 1000)
  let minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  seconds = seconds % 60
  minutes = minutes % 60

  return {
    hours: padTo2Digits(hours),
    minutes: padTo2Digits(minutes),
    seconds: padTo2Digits(seconds),
  }
}

function padTo2Digits(num: number): string {
  return num.toString().padStart(2, '0')
}
