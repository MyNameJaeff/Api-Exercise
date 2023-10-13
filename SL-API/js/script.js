const getCodes = async (input) => {
  //var input = $("#station").val();
  const res = await fetch(
    `https://api.sl.se/api2/typeahead.json?key=${codesKey}&searchstring=${input}&stationsonly=true&maxresults10`
  );
  const data = await res.json();
  return data;
};

const searchStop = async (stop) => {
  //console.log(data.ResponseData[0]);
  const data = await getCodes(stop);

  var id = data.ResponseData[0].SiteId;
  const res = await fetch(
    `https://api.sl.se/api2/realtimedeparturesV4.json?key=${departuresKey}&siteid=${id}&timewindow=30`
  );
  const datas = await res.json();
  return datas;
};

const printBusses = async (stop) => {
  var i = 1;
  const busses = await searchStop(stop);
  const busList = busses.ResponseData.Buses;
  $("#bussList").html("");
  busList.forEach((bus) => {
    $("#bussList").append(
      `<tr>
      <th scope="row">${i}</th>
      <td>${bus.Destination}</td>
      <td>${bus.DisplayTime}</td> 
      <td>${bus.LineNumber}</td>
      <td>${bus.StopPointDesignation}</td></tr>`
    );
    i++;
  });
  console.log(busses);
};

$("#search-btn").click(() => {
  var input = $("#input-form").val();
  if (input != "") {
    printBusses(input);
    $("#input-form").val("");
  }
});
