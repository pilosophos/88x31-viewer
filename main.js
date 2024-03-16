function getRandom(length) { return Math.floor(Math.random()*(length)); }

function getRandomSample(array, size) {
  var length = array.length, start = getRandom(length);

  for(var i = size; i--;) {
      var index = (start + i)%length, rindex = getRandom(length);
      var temp = array[rindex];
      array[rindex] = array[index];
      array[index] = temp;
  }
  var end = start + size, sample = array.slice(start, end);
  if(end > length)
      sample = sample.concat(array.slice(0, end - length));
  return sample;
}

function * getPage(list, pageSize = 100) {
  for (let index = 0; index < list.length; index += pageSize) {
    yield {
      page: list.slice(index, index + pageSize),
      remaining: Math.max(0, list.length - (index + pageSize))
    };
  }
}

class ButtonViewer {
  constructor() {
    this.index = [];
    this.buttons = document.getElementById("buttons");
    this.search = document.getElementById("search");
    this.buttonTemplate = document.getElementById("button-template");

    this.archive = null;
    this.archiveSelect = document.getElementById("archive-switch");

    this.shown = document.getElementById("shown");
    this.count = document.getElementById("count");

    this.random = document.getElementById("random");
    this.random.addEventListener("click", e => this.showRandom());

    this.paginator = null;

    this.onArchiveSelected(this.archiveSelect.querySelector("input:checked").value);

    this.search.addEventListener("input", () => this.onSearchTermChanged(this.search.value));
    Array.from(this.archiveSelect.querySelectorAll("input")).forEach(radio => {
      radio.addEventListener("change", (e => this.onArchiveSelected(e.target.value)).bind(this));
    });
  }

  onArchiveSelected(archive) {
    this.archive = archive;
    fetch(`indices/${archive}.txt`)
      .then(res => res.text())
      .then(text => this.setIndex(text));
  }

  onSearchTermChanged(searchTerm) {
    if (searchTerm.length > 0) {
      const found = [];
      for (let filename of this.getIndex()) {
        if (filename.toLowerCase().includes(searchTerm.toLowerCase())) {
          found.push(filename);
        }
      }

      this.count.textContent = found.length;
      this.paginator = getPage(found);
      this.buttons.innerHTML = "";
      this.showButtons();
    } else {
      this.showRandom();
    }
  }

  setIndex(index) {
    this.index = index.split("\n");
    this.count.textContent = index.length;
    this.onSearchTermChanged(this.search.value);
  }

  getIndex() {
    return this.index;
  }

  showButtons() {
    const page = this.paginator.next();
    const remaining = page.value?.remaining;

    if (remaining === undefined) {
      this.shown.textContent = 0;
      return;
    }

    for (let filename of page.value.page) {
      this.buttons.append(this.makeButton(filename));
    }
    this.shown.textContent = this.buttons.querySelectorAll(".img-88x31").length;

    if (remaining > 0) {
      const next = document.createElement("button");
      next.addEventListener("click", e => {
        this.showButtons();
        e.target.style.display = "none";
      });
      next.textContent = `Load ${Math.min(100, remaining)} more`;
      this.buttons.append(next);
    }
  }

  showRandom() {
    this.buttons.innerHTML = "";
    const sample = getRandomSample(this.index, 100);
    for (let filename of sample) {
      this.buttons.append(this.makeButton(filename));
    }
    this.shown.textContent = this.buttons.querySelectorAll(".img-88x31").length;
    this.count.textContent = this.index.length;
  }

  makeButton(filename) {
    const newButton = this.buttonTemplate.content.cloneNode(true);

    const img = newButton.querySelector(".img-88x31");
    img.src = `buttons/${this.archive}/${filename}`;
    img.setAttribute("alt", filename);

    const filenameDisplay = newButton.querySelector(".filename-88x31");
    filenameDisplay.textContent = filename;

    return newButton;
  }
}

new ButtonViewer();