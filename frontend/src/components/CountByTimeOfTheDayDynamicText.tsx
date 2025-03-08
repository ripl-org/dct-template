import getFormattedPreviousDay from '@/lib/getFormattedPreviousDay';
import { Fragment } from 'react';

function CountByTimeOfTheDayDynamicText(props: { counts: number[]; activity: string; dateString: string }) {
  const timeRanges = ['Morning (6am–12pm)', 'Afternoon (12pm–6pm)', 'Evening (6pm–12am)', 'Late Night (12am–6am)'];
  const indexToShowActivity = props.counts.findIndex((count) => count > 0);
  const lastIndexWithValue = props.counts.reduce((acc, count, index) => (count > 0 ? index : acc), -1);

  if (indexToShowActivity === -1)
    return <>There were zero traffic stops on {getFormattedPreviousDay(props.dateString)}.</>;

  return (
    <>
      During this period,{' '}
      {props.counts.map(
        (count, index) =>
          Boolean(count) && (
            <Fragment key={index}>
              {count} {indexToShowActivity === index && props.activity} occurred in the {timeRanges[index]}
              {lastIndexWithValue === index ? '.' : ', '}
            </Fragment>
          ),
      )}
    </>
  );
}

export default CountByTimeOfTheDayDynamicText;
