function generateNextTwoWeeks() {
    const dates = [];
    const currentDate = new Date();
  
    for (let i = 0; i < 14; i++) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() + i);
  
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
  
      const label = `${year}/${month}/${day}`;
      const value = `${year}-${month}-${day}`;
  
      dates.push({ label, value });
    }
  
    return dates;
  }

export default generateNextTwoWeeks