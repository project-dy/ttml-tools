function parseTime(miliseconds: number): string {
  const minutes = String(Math.floor(miliseconds / 60000)).padStart(2, "0");
  const seconds = String(Math.floor((miliseconds % 60000) / 1000)).padStart(2, "0");
  const milliseconds = String(Math.floor((miliseconds % 1000) / 10)).padStart(2, "0");
  // [mm:ss.ms]
  return `${minutes}:${seconds}.${milliseconds}`;
}
