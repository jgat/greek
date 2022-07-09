import { VERSES } from "./verses.js";

function listVerses() {
  VERSES.sort((a, b) => (a.lesson - b.lesson));
  let html = '';
  let lesson = -1;
  for (let i = 0; i < VERSES.length; i++) {
    const verse = VERSES[i];
    if (verse.lesson != lesson) {
      if (lesson > 0) {
        html += '</ul></li>\n';
      }
      if (lesson == 43) { // End of first semester
        html += '<hr/>';
      }
      html += '<li>Lesson ' + verse.lesson + ':<ul>\n';
      lesson = verse.lesson;
    }
    const href = './quiz/?v=' + verse.ref;
    const text = verse.ref;
    html += '  <li><a href="' + href + '">' + text + '</a></li>\n';
  }
  if (lesson > 0) {
    html += '</ul>\n</li>\n';
  }
  document.getElementById("quiz-list").innerHTML = html;
}

window.onload = function() {
  listVerses();
};

