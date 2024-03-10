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

function * getPage(list, pageSize = 50) {
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

    this.random = document.getElementById("random");
    this.random.addEventListener("click", e => this.showRandom());

    this.paginator = null;

    fetch("indices/hellnet.work.txt")
      .then(res => res.text())
      .then(text => this.setIndex(text));

    this.search.addEventListener("input", (e) => this.onSearchTermChanged(e));
  }

  onSearchTermChanged(event) {
    const searchTerm = event.target.value;
    if (searchTerm.length > 0) {
      const found = [];
      for (let filename of this.getIndex()) {
        if (filename.toLowerCase().includes(searchTerm.toLowerCase())) {
          found.push(filename);
        }
      }

      this.paginator = getPage(found);
      this.buttons.innerHTML = "";
      this.showButtons();
    } else {
      this.showRandom();
    }
  }

  setIndex(index) {
    this.index = index.split("\n");
    this.showRandom();
  }

  getIndex() {
    return this.index;
  }

  showButtons() {
    const page = this.paginator.next();
    const remaining = page.value.remaining;
    for (let filename of page.value.page) {
      this.buttons.append(this.makeButton(filename));
    }

    if (remaining > 0) {
      const next = document.createElement("button");
      next.addEventListener("click", e => {
        this.showButtons();
        e.target.style.display = "none";
      });
      next.textContent = `Load ${Math.min(50, remaining)} more`;
      this.buttons.append(next);
    }
  }

  showRandom() {
    this.buttons.innerHTML = "";
    const sample = getRandomSample(this.index, 50);
    for (let filename of sample) {
      this.buttons.append(this.makeButton(filename));
    }
  }

  makeButton(filename) {
    const newButton = this.buttonTemplate.content.cloneNode(true);

    const img = newButton.querySelector(".img-88x31");
    img.src = "buttons/hellnet.work/" + filename;
    img.setAttribute("alt", filename);

    const filenameDisplay = newButton.querySelector(".filename-88x31");
    filenameDisplay.textContent = filename;

    return newButton;
  }
}

new ButtonViewer();