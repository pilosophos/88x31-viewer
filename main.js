class ButtonViewer {
  constructor() {
    this.index = [];
    this.buttons = document.getElementById("buttons");
    this.search = document.getElementById("search");
    this.buttonTemplate = document.getElementById("button-template");

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
  
      this.showButtons(found);
    });
  }

  setIndex(index) {
    this.index = index.split("\n");
  }

  getIndex() {
    return this.index;
  }

  showButtons(filenames) {
    this.buttons.innerHTML = "";

    const showAmount = Math.min(filenames.length, 50);
    for (let i = 0; i < showAmount; i++) {
      const filename = filenames[i];
      const newButton = this.buttonTemplate.content.cloneNode(true);

      const img = newButton.querySelector(".img-88x31");
      img.src = "buttons/hellnet.work/" + filename;
      img.setAttribute("alt", filename);

      const filenameDisplay = newButton.querySelector(".filename-88x31");
      filenameDisplay.textContent = filename;

      this.buttons.append(newButton);
    }
  }
}

new ButtonViewer();