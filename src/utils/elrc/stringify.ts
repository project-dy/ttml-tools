function parseTime(miliseconds: number): string {
  const minutes = Math.floor(miliseconds / 60000);
  const seconds = Math.floor((miliseconds % 60000) / 1000);
  const milliseconds = Math.floor((miliseconds % 1000) / 10);
  // [mm:ss.ms]
  return `${minutes}:${seconds}.${milliseconds}`;
}
