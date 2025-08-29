const generateTimeOptions = (start = 5, end = 23, step = 30) => {
  const options: string[] = [];
  for (let minutes = start * 60; minutes <= end * 60; minutes += step) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    options.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
  }
  return options;
};

export const timeOptions = generateTimeOptions(); // 05:00, 05:30, ..., 23:30
