import { VERSES } from "../verses.js";

function listVerses() {
  let html = '';
  for (let i = 0; i < VERSES.length; i++) {
    const href = '../?v=' + VERSES[i].ref;
    const text = VERSES[i].ref;
    html += '<li><a href="' + href + '">' + text + '</a></li>\n';
  }
  document.getElementById("quiz-list").innerHTML = html;
}

window.onload = function() {
  listVerses();
};

