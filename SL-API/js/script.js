const getCodes = async (input) => {
  //var input = $("#station").val();
  const res = await fetch(
    `https://api.sl.se/api2/typeahead.json?key=${codesKey}&searchstring=${input}&stationsonly=true&maxresults10`
  );
  const data = await res.json();
  return data;
};

const searchStop = async (stop) => {
  const data = await getCodes(stop);

  var id = data.ResponseData[0].SiteId;
  const res = await fetch(
    `https://api.sl.se/api2/realtimedeparturesV4.json?key=${departuresKey}&siteid=${id}&timewindow=60`
  );
  const datas = await res.json();
  return datas;
};

const printTable = async (stop, what) => {
  const request = await searchStop(stop);
  const LinesGoing = [];
  const tempSave = [];
  switch (what) {
    case "Buss":
      const busList = request.ResponseData.Buses;
      $("#bussList").html("");
      busList.forEach((bus) => {
        var color = "";
        if (bus.GroupOfLine == "blåbuss") {
          color = "blå";
        } else {
          color = "röd";
        }
        if (
          !LinesGoing.includes(bus.Destination) &&
          !tempSave.includes(bus.Destination)
        ) {
          tempSave.push(bus.Destination);
          $("#bussList").append(
            `<tr>
            <th scope="row"><img class="icon busIcon" src="../images/bus.png" alt="bus ikon"></th>
            <td><div><p class="${color}">${bus.LineNumber}</p></div></td>
            <td>${bus.Destination}</td>
            <td>${bus.DisplayTime}</td>
            <td id="${bus.Destination.replace(/ /g, "")}"></td> 
            <td>${bus.StopPointDesignation}</td></tr>`
          );
          LinesGoing.push(bus.Destination);
        } else if (
          LinesGoing.includes(bus.Destination) &&
          tempSave.includes(bus.Destination) &&
          LinesGoing.filter((v) => v === bus.Destination).length < 2
        ) {
          LinesGoing.push(bus.Destination);
          tempSave.push(bus.Destination);
          $(`#${bus.Destination.replace(/ /g, "")}`).html(bus.DisplayTime);
        }
      });
      break;
    case "Tåg":
      const tågList = request.ResponseData.Trains;
      $("#tågList").html("");
      tågList.forEach((tåg) => {
        if (
          !LinesGoing.includes(tåg.Destination) &&
          !tempSave.includes(tåg.Destination)
        ) {
          $("#tågList").append(
            `<tr>
          <th scope="row"><img class="icon tågIcon" src="../images/tåg.webp" alt="bus ikon"></th>
          <td>${tåg.LineNumber}</td>
          <td>${tåg.Destination}</td>
          <td>${tåg.DisplayTime}</td>
          <td id="${tåg.Destination.replace(/ /g, "")}"></td>
          <td>${tåg.StopPointDesignation}</td></tr>`
          );
          LinesGoing.push(tåg.Destination);
          tempSave.push(tåg.Destination);
        } else if (
          LinesGoing.includes(tåg.Destination) &&
          tempSave.includes(tåg.Destination) &&
          LinesGoing.filter((v) => v === tåg.Destination).length < 2
        ) {
          LinesGoing.push(tåg.Destination);
          tempSave.push(tåg.Destination);
          $(`#${tåg.Destination.replace(/ /g, "")}`).html(tåg.DisplayTime);
        }
      });
      break;
  }
};

/*$("#search-btn").click(() => {
  var input = $("#input-form").val();
  if (input != "") {
    printTable(input, "Bus");
    $("#input-form").val("");
  }
});*/

const getWeather = async (CityName) => {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${CityName}&appid=${weatherKey}&units=metric`
  );
  const data = await res.json();
  return data;
};

const generateWeather = async (CityName) => {
  const data = await getWeather(CityName);
  const weatherList = data.list;
  const currentWeather = weatherList.pop();
  $("#vaderDayTitle").append(`<h3>${data.city.name},${data.city.country}</h3>`);
  $("#vaderDayIcon").append(
    `<img src="https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png">`
  );
  $("#vaderDayIcon").append(`<h3>${currentWeather.main.temp}&#8451</h3>`);
  $("#vaderDayFeels").append(`
  <p>
  Feels like ${Math.round(currentWeather.main.feels_like)}&#8451. 
  ${currentWeather.weather[0].main}.
  </p>`);
  $("#vaderDayDiv").append(`<p>
  <img src="../images/arrow.png" class="arrowImg" alt="wind direction">
  ${currentWeather.wind.speed}m/s W, ${currentWeather.main.pressure}hPa <br>
  Humidity: ${currentWeather.main.humidity}, Dew pont: ${Math.round(
    currentWeather.main.temp - (100 - currentWeather.main.humidity) / 5
  )}&#8451 <br>
  Visibility: ${Math.round(currentWeather.visibility / 1000)}km
  `);
  let i = 1;
  weatherList.map((x) => {
    if (i % 8 == 0) {
      $("#vaderDays").append(`<tr>
          <th>${x.dt_txt}</th>
          <td><img src="https://openweathermap.org/img/wn/${
            x.weather[0].icon
          }@2x.png" alt="weatherIcon" class="weatherIcon">
          ${
            Math.ceil(x.main.temp_max) + "/" + Math.floor(x.main.temp_min)
          }&#8451</td>
          <td>${x.weather[0].description}</td><tr>`);
    }
    i++;
  });
};

const getAndPrintBooks = async () => {
  var i = 1;
  const res = await fetch(
    `https://api.nytimes.com/svc/books/v3/lists/best-sellers/history.json?api-key=${bookApiKey}`
  );
  const data = await res.json();
  data.results.map((book) => {
    if (i <= 5) {
      $("#bookDiv").append(`
      <div class="bookSubDiv">
        <h2>${i}</h2>
        <div id="bookExtraDiv">
          <p>${book.title}</p>
          <p>${book.author}</p>
        </div>
      </div>`);
      if (book.reviews[0].book_review_link != "") {
        $("#bookExtraDiv").append(
          `<a href="${book.reviews[0].book_review_link}">Review</a>`
        );
      }
    }
    i++;
  });
};


getAndPrintBooks();
generateWeather("Huddinge");
genDate();
printTable("Huddinge Sjukhus", "Buss");
printTable("Flemmingsberg Station", "Tåg");
