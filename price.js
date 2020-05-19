const Nightmare = require("nightmare");
const fs = require('fs');


const mob = {
  "User-Agent":
    "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Mobile Safari/537.36"
};

const users = [
  { username: "umnik", password: "sherin27" },
  { username: "_Anmol_", password: "Anamica_5" }
];

const settings = {
  user: users[0]
};


async function getMonsters() {
  const nightmare = Nightmare({
    show: false
  });
  return await nightmare
  .goto("http://heroeswm.com", mob)
  .type(".form_input_field[name=login]", settings.user.username)
  .type(".form_input_field[name=pass]", settings.user.password)
  .click(".btn_enter")
  .wait(2000)
  .goto("https://www.lordswm.com/naym_event_set.php")
  .wait(2000)
  .evaluate(() => {
    const tableSelector = "body > center > table:nth-child(2) > tbody > tr > td > table:nth-child(3) > tbody > tr > td:nth-child(2) > table";
    const table = document.querySelector(tableSelector);
    const elements = Array.from(table.querySelectorAll(".wbwhite > tbody > tr"));

    const monsters = elements.map(element => {
      const title = element.querySelectorAll("td")[1].querySelector("b").innerText;
      const price = element.querySelectorAll("td")[1].innerText.match("Cost\: ([0-9]*)")[1];
      const image = element.querySelector(".cre_creature img").src;

      return { title, price, image };
    });

    return monsters;
  })
  .end()
  .then(async monsters => {
    const data = await fs.readFileSync("records.json");
    const dataJson = JSON.parse(data);
  
    dataJson.items.push({ date: new Date().toDateString(), time: new Date().toTimeString(), monsters });
  
    fs.writeFileSync("records.json", JSON.stringify(dataJson));
  
  
    /* Update HTML */
    const html = fs.readFileSync("index.html", "utf8");
    var regex = /\/\* replace start \*\/(...*)\/\* replace end \*\//;
    const newhtml = html.replace(regex, `/* replace start */const data = ${JSON.stringify(dataJson)};/* replace end */`);
    fs.writeFileSync("index.html", newhtml, {encoding: "utf8"});
    console.log("done");
  })
  .catch(error => {
    console.error("Search failed:", error);
  });
}

setInterval(async () => await getMonsters(), 30000);
getMonsters().then();