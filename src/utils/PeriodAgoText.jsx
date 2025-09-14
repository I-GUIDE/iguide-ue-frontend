/**
 * Get a text indicating how much time has passed. e.g. "Contributed 10 days ago"
 * @param {string} pretext The text before "xxx {time unit} ago"
 * @param {string} pastTimestamp the timestamp in the past
 * @return {string} text indicating how much time has passed
 */
export function PeriodAgoText(pretext, pastTimestamp) {
  const TIME_TO_DAY = 1000 * 60 * 60 * 24;
  const DAY_TO_MON = 30.4;

  const past = new Date(pastTimestamp);

  if (!isValidDate(past)) {
    return;
  }

  const now = new Date();

  const diffInTime = now.getTime() - past.getTime();
  const diffInDay = diffInTime / TIME_TO_DAY;
  const diffInMon = diffInDay / DAY_TO_MON;

  if (diffInDay < 1.0) {
    return pretext + " within 24 hrs";
  } else if (diffInMon < 1.0) {
    const roundedDay = Math.floor(diffInDay);
    return pretext + " " + roundedDay + ` day${roundedDay > 1 ? "s" : ""} ago`;
  } else {
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(past);
    return pretext + formattedDate;
  }
}

export function formatIsoStringToYYYYMMDD(isoString) {
  const date = new Date(isoString);

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function isValidDate(date) {
  return date instanceof Date && !isNaN(date.getTime());
}
