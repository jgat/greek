import { VERSES } from "./verses.js";

export { quiz };

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function normalise(qere) {
  return qere.replace(/[,.;[\]·]/g, "");
}

class Quiz {
  constructor() {
    this.verse = null;
    this.questions = [];
  }

  chooseVerse() {
    // If a verse is specified in the URL params, choose it.
    const ref = new URLSearchParams(window.location.search).get('v');
    if (ref != null) {
      for (let i = 0; i < VERSES.length; i++) {
        if (VERSES[i].ref == ref) {
          return VERSES[i]
        }
      }
    }

    // Otherwise, choose a verse at random. (It will be added to the URL params
    // later.)
    return randomElement(VERSES);
  }

  chooseQuestion() {
    this.verse = this.chooseVerse();
    console.log(this.verse.ref);
    console.log(this.verse.text);
    console.log(this.verse.words);
    this.questions = this.chooseParsingQuestions();
    console.log(this.questions);
    this.setDom();
  }

  chooseParsingQuestions() {
    const questions = [];
    for (let i = 0; i < 100 && questions.length < 5; i++) {
      const word = randomElement(this.verse.words);
      const qere = normalise(word[0]);
      const morph = word[1];
      if (this.verse.words.filter(w => normalise(w[0]).toLowerCase() == qere.toLowerCase()).length > 1) {
        continue;  // word is not unique in the verse
      }
      if (this.verse.extra.filter(e => e.term == word[0]).length > 0) {
        continue;  // word is not in known vocab
      }
      let typesToAsk = ['case', 'number', 'gender', 'tense', 'mood', 'person', 'voice'];
      typesToAsk = Object.keys(morph).filter(k => typesToAsk.includes(k));
      if (typesToAsk.length == 0) {
        continue;
      }
      const type = randomElement(typesToAsk);
      const q = [type, qere, morph[type]];
      if (questions.filter(x => x[0] == q[0] && x[1] == q[1] && x[2] == q[2]).length > 0) {
        continue;
      }
      questions.push(q);
    }
    return questions;
  }

  setDom() {
    window.history.pushState(quiz.verse, quiz.verse.ref, '?v=' + quiz.verse.ref)

    document.getElementById("verse-text").innerHTML = this.verse.text;
    document.getElementById("verse-ref").innerHTML = this.verse.ref;
    document.getElementById("translation-link1").href = "https://biblemenus.com/searchgreekheb.php?q=" + this.verse.ref;
    document.getElementById("translation-link2").href = "https://biblemenus.com/search.php?q=" + this.verse.ref;

    if (this.verse.extra.length > 0) {
      document.getElementById("extra-vocab").innerHTML = ("Extra vocab:<ul class=\"vocab\">"
      + this.verse.extra.map(e => "<li>" + e.dom() + "</li>").join('\n')
      + "</ul>");
    } else {
      document.getElementById("extra-vocab").innerHTML = "";
    }

    const questionsHtml = this.questions.map(
      q => ("<li><span class=\"question\">What " + q[0] + " is <span class=\"greek\">" + q[1] + "</span>?</span><br /><input type=\"text\"></input></li>")
    ).join('\n');
    document.getElementById("parsing-questions").innerHTML = questionsHtml;
    const answersHtml = this.questions.map(
      q => ("<li><span class=\"question\">What " + q[0] + " is <span class=\"greek\">" + q[1] + "</span>?</span><br /><span class=\"answer\">" + q[2] + "</span></li>")
    ).join('\n');
    document.getElementById("parsing-answers").innerHTML = answersHtml;
  }
}

const quiz = new Quiz();

function toggleAnswer() {
  const elem = document.getElementById("answer");
  const button = document.getElementById("answer-button");
  if (elem.style.display === "none") {
    elem.style.display = "block";
    button.innerHTML = "Hide Answers";
  } else {
    elem.style.display = "none";
    button.innerHTML = "Show Answers";
  }
}

window.onload = function() {
  document.getElementById("answer-button").onclick = toggleAnswer;
  quiz.chooseQuestion();
  window.quiz = quiz;
};

