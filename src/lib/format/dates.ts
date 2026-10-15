// Reading and formatting dates and times.

export function ParseDate(value: any): Date | null {
  if (value === null || value === undefined || value === '') return null

  let date: Date
  if (value instanceof Date) {
    date = value
  } else if (typeof value?.toDate === 'function') {
    date = value.toDate()
  } else if (typeof value === 'object' && (typeof value.seconds === 'number' || typeof value._seconds === 'number')) {
    date = new Date((value.seconds ?? value._seconds) * 1000)
  } else if (typeof value === 'string' && /^\d{1,2}-\d{1,2}-\d{4}$/.test(value)) {
    const [month, day, year] = value.split('-').map(Number)
    date = new Date(year, month - 1, day)
  } else {
    date = new Date(value)
  }

  return isNaN(date.getTime()) ? null : date
}


export function FormatDate(date: any) {
  const d = ParseDate(date)
  if (!d) return ''

  var month = '' + (d.getMonth() + 1),
  day = '' + d.getDate(),
  year = d.getFullYear();

  if (month.length < 2) {
    month = '0' + month;
  }

  if (day.length < 2) {
    day = '0' + day;
  }

  return [month, day, year].join('-');
}


export function TimeConverter(rawTime: any) {

  if (rawTime) {
    if (typeof rawTime === 'string') {
      let hour = rawTime.substring(0, 2)
      let mins = rawTime.substring(3, 5)

      if (hour < "12") {
        // AM
        switch(hour) {
          case "00":
            return ("12").concat(":", mins, " AM")
          default:
            return (hour).concat(":", mins, " AM")
        }
      } else {
        // PM
        switch(hour) {
          case "12":
            return (hour).concat(":", mins, " PM")
          case "13":
            return ("1").concat(":", mins, " PM")
          case "14":
            return ("2").concat(":", mins, " PM")
          case "15":
            return ("3").concat(":", mins, " PM")
          case "16":
            return ("4").concat(":", mins, " PM")
          case "17":
            return ("5").concat(":", mins, " PM")
          case "18":
            return ("6").concat(":", mins, " PM")
          case "19":
            return ("7").concat(":", mins, " PM")
          case "20":
            return ("8").concat(":", mins, " PM")
          case "21":
            return ("9").concat(":", mins, " PM")
          case "22":
            return ("10").concat(":", mins, " PM")
          case "23":
            return ("11").concat(":", mins, " PM")
          case "24":
            return ("12").concat(":", mins, " AM")
          default:
            return (hour).concat(":", mins, " PM")
        }
      }
    } else {
      // number
      return TimeConverterFromDate(new Date(rawTime))
    }
  } else {
    return ''
  }
}


export function UTCTimeToLocalTime(utcTime: Date) {
  const offset = utcTime.getTimezoneOffset();
  const local = new Date(utcTime.getTime() + offset * 60000);
  return local
}


export function toDate(dStr: any, format: any) {
    var now = new Date();
    if (format == "h:m") {
         now.setHours(dStr.substr(0,dStr.indexOf(":")));
         now.setMinutes(dStr.substr(dStr.indexOf(":")+1));
         now.setSeconds(0);
         return now;
    }else 
        return "Invalid Format";
}


// '3:05 PM' from a Date
export function TimeConverterFromDate(date: any) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}
