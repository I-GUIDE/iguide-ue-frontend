/**
 * Get a text indicating how much time has passed. e.g. "Contributed 10 days ago"
 * @param {string} pretext The text before "xxx {time unit} ago"
 * @param {string} pastTimestamp the timestamp in the past
 * @return {string} text indicating how much time has passed
 */
export function PeriodAgoText(pretext, pastTimestamp) {
  const TIME_TO_DAY = 1000 * 60 * 60 * 24;
  const DAY_TO_MON = 30.4;
  const MON_TO_YR = 12;

  const now = new Date();
  const past = new Date(pastTimestamp);

  const diffInTime = now.getTime() - past.getTime();
  const diffInDay = diffInTime / TIME_TO_DAY;
  const diffInMon = diffInDay / DAY_TO_MON;
  const diffInYr = diffInMon / MON_TO_YR;

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
    return pretext + " within 24 hrs";
  }
}

export function formatIsoStringToYYYYMMDD(isoString) {
  const date = new Date(isoString);

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
