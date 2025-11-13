export function convertMSToMinutesSeconds(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  // Optional: Add leading zero for single-digit seconds for better formatting
  const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;
  return `${minutes}:${formattedSeconds}`;
}
