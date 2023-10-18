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
  console.log(datas); // If Error check : http://status.trafiklab.se/
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
            <th scope="row">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bus-front" viewBox="0 0 16 16">
                <path d="M5 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm8 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-6-1a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2H7Zm1-6c-1.876 0-3.426.109-4.552.226A.5.5 0 0 0 3 4.723v3.554a.5.5 0 0 0 .448.497C4.574 8.891 6.124 9 8 9c1.876 0 3.426-.109 4.552-.226A.5.5 0 0 0 13 8.277V4.723a.5.5 0 0 0-.448-.497A44.303 44.303 0 0 0 8 4Zm0-1c-1.837 0-3.353.107-4.448.22a.5.5 0 1 1-.104-.994A44.304 44.304 0 0 1 8 2c1.876 0 3.426.109 4.552.226a.5.5 0 1 1-.104.994A43.306 43.306 0 0 0 8 3Z"/>
                <path d="M15 8a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1V2.64c0-1.188-.845-2.232-2.064-2.372A43.61 43.61 0 0 0 8 0C5.9 0 4.208.136 3.064.268 1.845.408 1 1.452 1 2.64V4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v3.5c0 .818.393 1.544 1 2v2a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5V14h6v1.5a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-2c.607-.456 1-1.182 1-2V8ZM8 1c2.056 0 3.71.134 4.822.261.676.078 1.178.66 1.178 1.379v8.86a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 11.5V2.64c0-.72.502-1.301 1.178-1.379A42.611 42.611 0 0 1 8 1Z"/>
              </svg>
            </th>
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
          <th scope="row">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-train-front" viewBox="0 0 16 16">
              <path d="M5.621 1.485c1.815-.454 2.943-.454 4.758 0 .784.196 1.743.673 2.527 1.119.688.39 1.094 1.148 1.094 1.979V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V4.583c0-.831.406-1.588 1.094-1.98.784-.445 1.744-.922 2.527-1.118Zm5-.97C8.647.02 7.353.02 5.38.515c-.924.23-1.982.766-2.78 1.22C1.566 2.322 1 3.432 1 4.582V13.5A2.5 2.5 0 0 0 3.5 16h9a2.5 2.5 0 0 0 2.5-2.5V4.583c0-1.15-.565-2.26-1.6-2.849-.797-.453-1.855-.988-2.779-1.22ZM5 13a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm0 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm7 1a1 1 0 1 0-1-1 1 1 0 1 0-2 0 1 1 0 0 0 2 0 1 1 0 0 0 1 1ZM4.5 5a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h3V5h-3Zm4 0v3h3a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5h-3ZM3 5.5A1.5 1.5 0 0 1 4.5 4h7A1.5 1.5 0 0 1 13 5.5v2A1.5 1.5 0 0 1 11.5 9h-7A1.5 1.5 0 0 1 3 7.5v-2ZM6.5 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3Z"/>
            </svg>
          </th>
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

printTable("Huddinge Sjukhus", "Buss");
getAndPrintBooks();
generateWeather("Huddinge");
printTable("Flemmingsberg Station", "Tåg");
