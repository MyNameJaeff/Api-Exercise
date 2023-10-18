const getCalendar = async (link) => {
    const req = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${link}/events?key=${googleKey}`);
    const data = await req.json();
    processCal(data);
}

const processCal = async (data) => {
  console.log(data);
} 

getCalendar("c_d9aaaa6aa5b776b23b57ec82ab49a0b39b34177b8390aa055f926d10033e3648@group.calendar.google.com");