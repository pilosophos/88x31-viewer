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
    this.paginator = null;

    fetch("indices/hellnet.work.txt")
      .then(res => res.text())
      .then(text => this.setIndex(text));

    this.search.addEventListener("input", (e) => {
      const searchTerm = e.target.value;
      const found = [];
      for (let filename of this.getIndex()) {
        if (filename.includes(searchTerm)) {
          found.push(filename);
        }
      }
  
      this.paginator = getPage(found, 50);
      this.buttons.innerHTML = "";
      this.showButtons();
    });
  }

  setIndex(index) {
    this.index = index.split("\n");
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