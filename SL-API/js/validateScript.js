var form = document.getElementById("myForm");
function handleForm(event) {
  event.preventDefault();
  test();
}
form.addEventListener("submit", handleForm);

const makeAdress = (regionCode, adressLines) => {
  const adress = {
    regionCode: regionCode,
    adressLines: adressLines,
  };
  return adress;
};

const validateSaidAdress = async () => {
//   const req = await fetch(
//     "https://addressvalidation.googleapis.com/v2:validateAddress?key=" + googleKey,
//     {
//       Headers: {
//         "Content-Type": "application/json",
//       },
//       Body: {
//         address: {
//           regionCode: "US",
//           locality: "Mountain View",
//           addressLines: ["1600 Amphitheatre Pkwy"],
//         },
//       },
//     }
//   );
//   console.log(req);

    const req = await fetch('')


};
validateSaidAdress();