function generateTimeIntervals() {
    const intervals = [];
    const startHour = 0;
    const endHour = 24;
    const intervalMinutes = 15;
  
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minutes = 0; minutes < 60; minutes += intervalMinutes) {
        const labelHour = hour.toString().padStart(2, '0');
        const labelMinutes = minutes.toString().padStart(2, '0');
  
        const label = `${labelHour}:${labelMinutes}`;
        const value = `${labelHour}:${labelMinutes}`;
  
        intervals.push({ label, value });
      }
    }
  
    return intervals;
  }

export default generateTimeIntervals
