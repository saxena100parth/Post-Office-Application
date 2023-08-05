const IP = localStorage.getItem("ip");
console.log(IP);
document.getElementById("ip").innerText = IP;
let data = {};

function initMap(latt, long) {
  // Replace YOUR_LATITUDE and YOUR_LONGITUDE with the actual latitude and longitude values
  var myLatLng = { lat: "", lng: "" };
  myLatLng.lat = parseFloat(latt);
  myLatLng.lng = parseFloat(long);

  // Create a map centered at the specified location
  var map = new google.maps.Map(document.getElementById("map"), {
    center: myLatLng,
    zoom: 10, // You can adjust the zoom level as needed
  });

  // Add a marker to the map at the specified location
  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    title: "Location Marker",
  });
}

async function fetchIPInfo() {
  try {
    const response = await fetch(
      `https://ipinfo.io/${IP}?token=53abce53bb77df`
    );
    data = await response.json();

    const [latitude, longitude] = data.loc.split(",");

    document.getElementById("lat").innerText = latitude;
    document.getElementById("long").innerText = longitude;
    document.getElementById("city").innerText = data.city;
    document.getElementById("region").innerText = data?.region;
    document.getElementById("organisation").innerText = data?.org;
    document.getElementById("hostname").innerText = data?.hostname;
    document.getElementById("timeZone").innerText = data?.timezone;
    document.getElementById("pincode").innerText = data?.postal;

    // console.log(data);
    initMap(latitude, longitude);

    const Zone = await fetch(
      `https://worldtimeapi.org/api/timezone/${data.timezone}`
    );
    const ZoneData = await Zone.json();
    // console.log(ZoneData);
    document.getElementById("dateTime").innerText = ZoneData.datetime;

    const postOffices = await fetch(
      `https://api.postalpincode.in/pincode/${data.postal}`
    );
    let allPostOffice = await postOffices.json();
    document.getElementById("allPins").innerText = allPostOffice[0].Message;
    let postOfficeCard = allPostOffice[0].PostOffice;
    console.log(postOfficeCard);
    let cardsDiv = document.getElementById("cards");
    let filter = document.getElementById("filter");
    filterValue = filter.value;
    console.log(filterValue);
    postOfficeCard.forEach((element) => {
      let card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `<p>Name: <span>${element.Name}</span></p>
      <p>Branch Type: <span>${element.BranchType}</span></p>
      <p>Delivery Status: <span>${element.DeliveryStatus} </span></p>
      <p>District: <span>
      ${element.District} </span></p>
      <p>Division: <span>${element.Division} </span></p>`;
      cardsDiv.appendChild(card);
    });
  } catch (error) {
    console.error(error);
  }
}

fetchIPInfo();
