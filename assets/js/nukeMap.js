var anim = (function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function ( /* function */ callback, /* DOMElement */ element) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

var dataElem = document.getElementById("data"),
    rawData = dataElem.innerText || dataElem.textContent,
    isBlank = (function(blank) {
      return function(str) { return blank.test(str); };
    })(/^\s*$/);

var Position = (function() {
  var parser = /(\d+\.?\d*)\s*([NnSs])\s+(\d+\.?\d*)\s*([EeWw])/,
      siteToLatLon = {
        "ANM": [32.900411,-105.960478],
        "HRJ": [34.385278,132.455278],
        "NGJ": [32.783333,129.866667],
        "BKN": [11.583333,165.383333],
        "ENW": [11.5,162.333333],
        "NTS": [37.116667,-116.05],
        "MBI": [-20.798,115.406],
        "EMU": [-28.698333,132.371389],
        "PAC": [11.583333,165.383333], // unknown location, assume bikini atoll
        "MAR": [-30.15,131.583333],
        "CHR": [-10.483333,105.633333],
        "NZ ": [74,56],
        "KTS": [49.95,82.616667],
        "REG": [26.283565,-0.046692],
        "CLS": [32.411944,-104.236389],
        "JON": [16.75,-169.516667],
        "FAL": [39.472778,-118.778889],
        "LNR": [42.35, 88.30],
        "AMC": [51.542222,178.983333],
        "MUR": [-21.833333,-138.833333],
        "FAN": [-22.25,-138.75],
        "HTB": [31.315833,-89.308611],
        "GRV": [39.183333,-108.716667],
        "SAT": [-35.0, -20.0],
        "KPY": [48.586,45.72],
        "SYS": [46.383333,72.866667]
      };

  function lookup(site) {
    var latlon;
    if(latlon = siteToLatLon[site]) {
      this.lat = latlon[0];
      this.lon = latlon[1];
    }
  }
  
  return function(raw, site) {
    var results = parser.exec(raw);
    if(!results) {
      lookup.call(this, site);
    } else {
      this.lat = Number(results[1]) * (results[2].toUpperCase() == "S" ? -1 : 1);
      this.lon = Number(results[3]) * (results[4].toUpperCase() == "W" ? -1 : 1);
    }
  };
})();

var removeExtraDetails = function(str, index, arr) {
  if(arr.length > index + 1) {
    var detailMatch = arr[index+1].substr(68,8) == str.substr(16,8);
    var dateMatch = arr[index+1].substr(0,6) == str.substr(0,6);
    if (detailMatch && dateMatch) return false;
  }
  
  return str.substring(15,16) !== "#";
};

var processRow = function(row) {
  var extract = String.prototype.substring.bind(row);

  return {
    when: +(new Date(1900 + parseInt(extract(0,2), 10), parseInt(extract(2,4), 10)-1, parseInt(extract(4,6), 10))),
    party: extract(16,18),
    type: extract(22,26),
    kt: extract(36,41),
    position: new Position(extract(42, 58), extract(18,21))
  };
};

// Parse all the data
var data = _.chain(rawData.split("\n"))
  .filter(removeExtraDetails)
  .map(processRow).value();

// Animation loop
var cnvs = document.getElementById("stage"),
    ctx = cnvs.getContext("2d"),
    width = cnvs.width,
    height = cnvs.height,
    partyColors = {
      "US": "#66f",
      "GB": "purple",
      "CP": "red",
      "FR": "green",
      "IN": "orange",
      "PC": "yellow",
      "IS": "cyan"
    };

// Set stage transformation
ctx.setTransform(width/2/180, 0, 0, -height/2/90, width/2, height/2);
ctx.shadowBlur = "15";

;(function() {
  var day = 1000*60*60*24,
      head = 0, tail = 0,
      currentTime = data[head].when - (day*360),
      
      updateTime = (function(elem) {
        return function(val) {
          var d = new Date(val);
          elem.dataset.month = d.getMonth()+1; 
          elem.dataset.year = 1900 + d.getYear();
        };
      })(document.getElementById("time")),
      
      createScoreIncrementor = function(elem) {
        var count = 0,
            active = false;
        
        return function() {
          if(active === false) {
            active = true;
            elem.classList.add("active");
          }
          elem.dataset.score = (++count).toString();
        };
      },
      totalScore = createScoreIncrementor(document.getElementById("total")),
      partyScore = {
        "US": createScoreIncrementor(document.getElementById("US")),
        "CP": createScoreIncrementor(document.getElementById("CP")),
        "GB": createScoreIncrementor(document.getElementById("GB")),
        "FR": createScoreIncrementor(document.getElementById("FR")),
        "IN": createScoreIncrementor(document.getElementById("IN")),
        "PC": createScoreIncrementor(document.getElementById("PC")),
        "IS": createScoreIncrementor(document.getElementById("IS"))
      },
      i, detonation, glowAge, age, glowAge, lastTick;
  
  var render = function(tick) {
    
    ctx.clearRect(-185,-95,370,190);
    
    if(!lastTick) lastTick = tick;
    
    updateTime(currentTime += ((tick-lastTick)/1000)*(day * 120));
    
    while(data[head] && data[head].when < currentTime) {
      detonation = data[head];
      totalScore();
      var partyFn = partyScore[detonation.party];
      if(partyFn) partyFn();
      head++;
    }
    
    for(i=tail;i<head;i++) {
      detonation = data[i];
      age = 2 - (currentTime - detonation.when) / (day * 180);
      glowAge = 8 - (currentTime - detonation.when) / (day * 10);

      if(age < 0) {
        tail++;
        continue;
      }
            
      if(glowAge > 0) {
        ctx.beginPath();
        ctx.arc(detonation.position.lon, detonation.position.lat, glowAge, 0, Math.PI*2);
        ctx.shadowColor=ctx.fillStyle = partyColors[detonation.party];
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(detonation.position.lon, detonation.position.lat, age, 0, Math.PI*2);
      ctx.shadowColor = "transparent";
      ctx.fillStyle = "white";
      ctx.fill();
    }
    
    lastTick = tick;
    if(data[tail]) anim(render);
  };
  
  anim(render);
})();