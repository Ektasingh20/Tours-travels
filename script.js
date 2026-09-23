(function(){
  var PHONE = "919660635136";
  // Collectorate Circle, Chittorgarh 312001; coordinates await verification.
  var OFFICE_LAT = null;
  var OFFICE_LNG = null;

  function buildBookingMessage(data){
    var lines = [
      "Namaste, I'd like to book a car with Jai Shri Shyam Tour & Travels.",
      "Name: " + (data.name || "-"),
      "Phone: " + (data.phone || "-"),
      "Trip type: " + (data.tripType || "-"),
      "Preferred car: " + (data.car || "-"),
      "Pickup: " + (data.pickup || "-"),
      "Drop: " + (data.drop || "-"),
      "Date: " + (data.date || "-"),
      "Passengers: " + (data.passengers || "-")
    ];
    if(data.notes){ lines.push("Notes: " + data.notes); }
    return lines.join("\n");
  }

  var form = document.getElementById("booking-form");
  form.addEventListener("submit", function(e){
    e.preventDefault();
    var fd = new FormData(form);
    var data = {};
    fd.forEach(function(v,k){ data[k] = v; });
    var msg = buildBookingMessage(data);
    var url = "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(msg);
    window.open(url, "_blank", "noopener");
  });

  var quickMsg = "Namaste, I'd like to enquire about booking a car with Jai Shri Shyam Tour & Travels.";
  var quickUrl = "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(quickMsg);
  document.getElementById("hero-whatsapp").href = quickUrl;
  document.getElementById("fab-whatsapp").href = quickUrl;

  // ---- Location trace ----
  function toRad(v){ return v * Math.PI / 180; }
  function haversine(lat1, lon1, lat2, lon2){
    var R = 6371;
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var a = Math.sin(dLat/2)*Math.sin(dLat/2) +
            Math.cos(toRad(lat1))*Math.cos(toRad(lat2)) *
            Math.sin(dLon/2)*Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
  function bearing(lat1, lon1, lat2, lon2){
    var y = Math.sin(toRad(lon2-lon1)) * Math.cos(toRad(lat2));
    var x = Math.cos(toRad(lat1))*Math.sin(toRad(lat2)) -
            Math.sin(toRad(lat1))*Math.cos(toRad(lat2))*Math.cos(toRad(lon2-lon1));
    var brng = Math.atan2(y, x) * 180 / Math.PI;
    return (brng + 360) % 360;
  }

  var readout = document.getElementById("loc-readout");
  var needle = document.getElementById("needle");
  var directionsLink = document.getElementById("directions-link");
  var locateBtn = document.getElementById("locate-btn");

  locateBtn.addEventListener("click", function(){
    if(OFFICE_LAT === null || OFFICE_LNG === null){
      readout.textContent = "Our office is at Collectorate Circle, Chittorgarh 312001. Open in Google Maps for distance and directions.";
      return;
    }
    if(!("geolocation" in navigator)){
      readout.textContent = "Your browser doesn't support location lookup — use the Google Maps link instead.";
      return;
    }
    readout.textContent = "Locating you…";
    navigator.geolocation.getCurrentPosition(function(pos){
      var lat = pos.coords.latitude, lng = pos.coords.longitude;
      var dist = haversine(lat, lng, OFFICE_LAT, OFFICE_LNG);
      var brng = bearing(lat, lng, OFFICE_LAT, OFFICE_LNG);
      needle.style.transform = "rotate(" + brng + "deg)";
      readout.textContent = "You're roughly " + dist.toFixed(1) + " km from our office, heading " + compassLabel(brng) + ".";
    }, function(err){
      readout.textContent = "Couldn't get your location (" + err.message + "). You can still use the Google Maps link.";
    }, { enableHighAccuracy:true, timeout:10000 });
  });

  function compassLabel(deg){
    var dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
    return dirs[Math.round(deg / 22.5) % 16];
  }
})();
