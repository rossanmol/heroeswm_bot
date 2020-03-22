const Nightmare = require("nightmare");
const nightmare = Nightmare({
  show: true
});
const mob = {
  "User-Agent":
    "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Mobile Safari/537.36"
};

const users = [
  { username: "vzetka", password: "sherin27 " },
  { username: "_Anmol_", password: "Anamica_5" }
];

const settings = {
  user: users[1]
};

// ignore below
Nightmare.action("reloadEvery", function(_done) {
  var isWar = false;
  var refreshIntervalId;
  function done(x, isWar) {
    console.log(isWar);
    // if (isWar) {
    //   console.log("Done");
    //   clearInterval(refreshIntervalId);
    //   _done();
    // }
  }

  this.evaluate_now(async () => {
    var makeRequest = function(url, method) {
      // Create the XHR request
      var request = new XMLHttpRequest();

      // Return it as a Promise
      return new Promise(function(resolve, reject) {
        // Setup our listener to process compeleted requests
        request.onreadystatechange = function() {
          // Only run if the request is complete
          if (request.readyState !== 4) return;

          // Process the response
          if (request.status >= 200 && request.status < 300) {
            // If successful
            resolve(request);
          } else {
            // If failed
            reject({
              status: request.status,
              statusText: request.statusText
            });
          }
        };

        // Setup our HTTP request
        request.open(method || "GET", url, true);

        // Send the request
        request.send();
      });
    };

    const currentUrl = location.href;
    await makeRequest("https://www.lordswm.com/map.php").then(x => {
      document.body.append("before");
      var el = document.createElement("html");
      el.innerHTML = x.response;
      el.getElementsByTagName("a");
      const creatures = Array.from(el.querySelectorAll(".cre_creature"));

      return creatures
        .map(creature => creature.innerHTML)
        .forEach((image, index) => {
          const div = document.createElement("div");
          div.innerHTML = `
			${image}
			<input type="radio" name="selection" ${index === 0 ? "checked" : ""} value="${
            index === 0 ? "" : index + 1
          }">
		  `;
          const img = div.querySelector("input");
          div.append;
          if (index === 0) {
            img.value = "";
          }
          document.body.appendChild(div);
        });
    });

    refreshIntervalId = setInterval(async () => {
      document.body.append("Wow");
      const response = await makeRequest(currentUrl).then(x => x.responseText);

      isWar = !response.includes("battle not found-");
      const div = document.createElement("div");
      const divContent = document.createTextNode(`${new Date()}: ${isWar}`);
      div.appendChild(divContent);
      document.body.appendChild(div);

      const selectedRadio = document.querySelector(
        'input[name="selection"]:checked'
      ).value;

      const url = `https://www.lordswm.com/map.php?action=attack${selectedRadio}`;

      if (isWar) {
        location.replace(url);
      }

      return isWar;
    }, 2000);
  }, done);
});

nightmare
  .goto("http://heroeswm.com", mob)
  .type(".form_input_field[name=login]", settings.user.username)
  .type(".form_input_field[name=pass]", settings.user.password)
  .click(".btn_enter")
  .wait(3000)
  .click("a[href='bselect.php']")
  .wait(1000)
  .click("a[href='bselect.php?all=1']")
  .wait(1000)
  .evaluate(() => {
    const anchors = Array.from(document.querySelectorAll("a"));
    const lastWar = anchors[anchors.length - 2];
    const lastWarID = lastWar.getAttribute("href").match(/\d+/)[0];
    const nextBigWar = Math.ceil(lastWarID / 100) * 100 - 1 + 100;
    const lastWarUrl = `warlog.php?warid=${lastWarID}`;
    const nextBigWarUrl = `warlog.php?warid=${nextBigWar}`;

    document
      .querySelector(`a[href='${lastWarUrl}']`)
      .setAttribute("href", nextBigWarUrl);

    document.querySelector(`a[href='${nextBigWarUrl}']`).click();
  })
  .wait(1000)
  .reloadEvery()
  .then(console.log)
  .catch(error => {
    console.error("Search failed:", error);
  });
