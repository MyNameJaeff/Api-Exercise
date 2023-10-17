const genDate = () => {
  const date = new Date();
  let day = date.getDate();
  let month = date.toLocaleString("default", { month: "short" });
  let hours = date.getHours();
  let minutes = date.getMinutes();
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  let dateStr = `${day}-${month} | ${hours}:${minutes}`;
  updateTime(dateStr);
};

const updateTime = (dateStr) => {
  $("#currentDate").html(dateStr);
};
setInterval(() => {
  genDate();
}, 200);
genDate();