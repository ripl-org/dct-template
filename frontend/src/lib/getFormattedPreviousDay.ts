import dayjs from 'dayjs';

function getFormattedPreviousDay(dateString: string) {
  const currentDate = dayjs(dateString ? dateString : new Date());
  const previousDay = currentDate.subtract(1, 'day');
  return previousDay.format('MMM D, YYYY');
}

export default getFormattedPreviousDay;
