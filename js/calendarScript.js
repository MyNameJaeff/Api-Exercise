const getCalendar = async (link) => {
  const req = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${link}/events?key=${googleKey}&singleEvents=true&orderBy=startTime`
  );
  const data = await req.json();
  processCal(data);
};
const days = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag", "Söndag"]

const processCal = async (data) => {
  let items = data.items;
  var curr = new Date; // get current date
  var first = curr.getDate() - curr.getDay() + 1; // First day is the day of the month - the day of the week
  var last = first + 6; // last day is the first day + 6

  var firstday = new Date(curr.setDate(first)).toISOString();
  var lastday = new Date(curr.setDate(last)).toISOString();
  let day = firstday.split("T")[0].split("-");
  console.log(day);
  for(let i = 0; i < 7; i++){
    $(`#calendarDiv>.${days[i]}>h2`).html(`${days[i] + "<br>" + day[0] + "-" + day[1] + "-" + (parseInt(day[2])+i)}`)
  }
  items.map((item) => {
    let split = (item.start.dateTime);//.split("+")[0];
    if(split > firstday && split < lastday){

      let betterStartDate = (item.start.dateTime).split("T");
      betterStartDate[1] = betterStartDate[1].split("+")[0];

      let betterEndDate = (item.end.dateTime).split("T");
      betterEndDate[1] = betterEndDate[1].split("+")[0];

      const test = new Date(item.start.dateTime);
      // style="grid-area:${startCol[0] - 8} / 1 / ${endCol[0] - 8} / 1"
      $(`#calendarDiv>.${days[test.getDay()-1]}`).append(`
      <div class="calendarItem" id="${(item.summary).replace(/ /g,'')}">
        <p>${item.summary}</p>
        <p>${betterStartDate[1] + " - " + betterEndDate[1]}</p>
      </div>`);
    }
  });
};
getCalendar(
  "c_d9aaaa6aa5b776b23b57ec82ab49a0b39b34177b8390aa055f926d10033e3648@group.calendar.google.com"
);
