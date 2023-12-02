import  Holidays from 'date-holidays';

export interface RequestParams {
	[paramName: string]: string | string[] | number;
}

export interface UdfResponse {
	s: string;
}

export interface UdfOkResponse extends UdfResponse {
	s: 'ok';
}

export interface UdfErrorResponse {
	s: 'error';
	errmsg: string;
}

/**
 * If you want to enable logs from datafeed set it to `true`
 */
const isLoggingEnabled = false;
export function logMessage(message: string): void {
	if (isLoggingEnabled) {
		const now = new Date();
		// tslint:disable-next-line:no-console
		console.log(`${now.toLocaleTimeString()}.${now.getMilliseconds()}> ${message}`);
	}
}

export function getErrorMessage(error: string | Error | undefined): string {
	if (error === undefined) {
		return '';
	} else if (typeof error === 'string') {
		return error;
	}

	return error.message;
}


export function getHolidays(fromTime: number, toTime: number){
  let hd = new Holidays();
  hd.init('US');
  const holidays: Date[] = [];
  const start = new Date(fromTime);
  const end = new Date(toTime);

  while (start <= end) {
    const holiday = hd.isHoliday(start);
    if (holiday) {
      holidays.push(new Date(start));
    }
    start.setDate(start.getDate() + 1);
  }

  return holidays;
}

// Function to adjust fromTime by subtracting only holidays
function adjustFromTime(fromTime: number, toTime: number, numberOfNonHolidays: number): number {
  let adjustedFromTime = fromTime;
  let remainingNonHolidays = numberOfNonHolidays;

  const holidays = getHolidays(fromTime, toTime);

  while (remainingNonHolidays > 0) {
    const workingTime = subtractHolidays(adjustedFromTime, toTime, holidays);
    const adjustedToTime = adjustedFromTime + workingTime;

    if (adjustedToTime > toTime) {
      // Adjusted fromTime to ensure the adjustedToTime does not go beyond toTime
      adjustedFromTime -= 24 * 60 * 60 * 1000; // Subtract one day in milliseconds
    } else {
      adjustedFromTime = adjustedToTime;
    }

    remainingNonHolidays -= 1;
  }

  return adjustedFromTime;
}

// Function to subtract holidays from the time duration
function subtractHolidays(fromTime: number, toTime: number, holidays: Date[]): number {
  let workingTime = toTime - fromTime;

  holidays.forEach((holiday) => {
    const holidayTimestamp = holiday.getTime();
    if (fromTime < holidayTimestamp && toTime > holidayTimestamp) {
      workingTime -= 24 * 60 * 60 * 1000; // Subtract one day in milliseconds
    }
  });

  return workingTime;
}
