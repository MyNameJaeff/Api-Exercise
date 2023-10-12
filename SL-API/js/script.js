const getCodes = async (input) => {
    //var input = $("#station").val();
  fetch(
    `https://api.sl.se/api2/typeahead.json?key=${codesKey}&searchstring=${input}&stationsonly=true&maxresults10`
  )
    .then((res) => res.json())
    .then((data) => searchStop(data));
};

const searchStop = async(data) => {
  //console.log(data.ResponseData[0]);
  var id = data.ResponseData[0].SiteId;
  fetch(
    `https://api.sl.se/api2/realtimedeparturesV4.json?key=${departuresKey}&siteid=${id}&timewindow=30`
  )
  .then((res) => res.json())
  .then((data) => console.log(data));
};

const printBusses = async(stop) => {
    await getCodes(stop);
}

printBusses("Huddinge Sjukhus");