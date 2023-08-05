let startBtn = document.getElementById("start");
startBtn.addEventListener("click", () => {
  window.location.href = "second.html";
});

function getUserIP() {
  fetch("https://api.ipify.org?format=json")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("ip").innerHTML = data.ip;
      localStorage.setItem("ip", data.ip);
    })
    .catch((error) => console.error(error));
}
getUserIP();
