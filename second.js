const IP = localStorage.getItem("ip");
const filter = document.getElementById("filter");
const cardsDiv = document.getElementById("cards");
let postOfficeCard = [];

async function fetchIPInfo() {
  try {
    const response = await fetch(
      `https://ipinfo.io/${IP}?token=53abce53bb77df`
    );
    const data = await response.json();
    const [latitude, longitude] = data.loc.split(",");
    document.getElementById("ip").innerText = IP;
    document.getElementById("lat").innerText = latitude;
    document.getElementById("long").innerText = longitude;
    document.getElementById("city").innerText = data.city;
    document.getElementById("region").innerText = data?.region;
    document.getElementById("organisation").innerText = data?.org;
    document.getElementById("hostname").innerText = data?.hostname;
    document.getElementById("timeZone").innerText = data?.timezone;
    document.getElementById("pincode").innerText = data?.postal;

    initMap(latitude, longitude);

    const Zone = await fetch(
      `https://worldtimeapi.org/api/timezone/${data.timezone}`
    );
    const ZoneData = await Zone.json();
    document.getElementById("dateTime").innerText = ZoneData.datetime;

    const postOffices = await fetch(
      `https://api.postalpincode.in/pincode/${data.postal}`
    );
    const allPostOffice = await postOffices.json();
    document.getElementById("allPins").innerText = allPostOffice[0].Message;
    postOfficeCard = allPostOffice[0].PostOffice;
    updatePostOfficeCards(postOfficeCard);
  } catch (error) {
    console.error(error);
  }
}

function initMap(latt, long) {
  const myLatLng = { lat: parseFloat(latt), lng: parseFloat(long) };
  const map = new google.maps.Map(document.getElementById("map"), {
    center: myLatLng,
    zoom: 10,
  });
  const marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    title: "Location Marker",
  });
}

function updatePostOfficeCards(postOffices) {
  cardsDiv.innerHTML = ""; // Clear existing cards
  postOffices.forEach((element) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<p>Name: <span>${element.Name}</span></p>
      <p>Branch Type: <span>${element.BranchType}</span></p>
      <p>Delivery Status: <span>${element.DeliveryStatus}</span></p>
      <p>District: <span>${element.District}</span></p>
      <p>Division: <span>${element.Division}</span></p>`;
    cardsDiv.appendChild(card);
  });
}

function handleChange(event) {
  const inputValue = event.target.value;
  const filteredPostOffices = postOfficeCard.filter((element) => {
    return element.Name.toLowerCase().includes(inputValue.toLowerCase());
  });
  updatePostOfficeCards(filteredPostOffices);
}

filter.addEventListener("input", handleChange);

fetchIPInfo();
