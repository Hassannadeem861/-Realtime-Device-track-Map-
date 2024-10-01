const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      // console.log("latitude, longitude: ", latitude, longitude);
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      if (error.code === 3) {
        console.error("Timeout expired. Trying again...");
      } else {
        console.error("Geolocation error: ", error);
      }
    },
    {
      enableHighAccuracy: false,
      timeout: 10000, // Increase timeout
      maximumAge: 0,
    }
  );
}

const map = L.map("map").setView([0, 0], 16);
console.log("map: ", map);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "Shah faisal colony",
}).addTo(map);

const markers = {};

socket.on("recive-message", (data) => {
  const { id, latitude, longitude } = data;
  console.log("id, latitude, longitude: ", data);
  map.setView([latitude, longitude]);
  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
});

socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]); 
    delete markers[id];
  }
});
