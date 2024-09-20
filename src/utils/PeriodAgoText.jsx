/**
 * Get a text indicating how much time has passed. e.g. "Contributed 10 days ago"
 * @param {string} pretext The text before "xxx {time unit} ago"
 * @param {string} pastTimestamp the timestamp in the past
 * @return {string} text indicating how ,uch time has passed
 */
export function PeriodAgoText(pretext, pastTimestamp) {
  const TIME_TO_DAY = 1000 * 60 * 60 * 24;
  const DAY_TO_MON = 30.4;
  const MON_TO_YR = 12;

  let now = new Date();
  let past = new Date(pastTimestamp);

  let diffInTime = now.getTime() - past.getTime();
  let diffInDay = diffInTime / TIME_TO_DAY;
  let diffInMon = diffInDay / DAY_TO_MON;
  let diffInYr = diffInMon / MON_TO_YR;

  if (diffInYr >= 1.0) {
    const roundedYr = Math.floor(diffInYr);
    return pretext + " " + roundedYr + ` year${roundedYr > 1 ? "s" : ""} ago`;
  } else if (diffInMon >= 1.0) {
    const roundedMon = Math.floor(diffInMon);
    return (
      pretext + " " + roundedMon + ` month${roundedMon > 1 ? "s" : ""} ago`
    );
  } else if (diffInDay >= 1.0) {
    const roundedDay = Math.floor(diffInDay);
    return pretext + " " + roundedDay + ` day${roundedDay > 1 ? "s" : ""} ago`;
  } else {
    return pretext + " with 24 hrs";
  }
}
