class Tower {
  constructor(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
  }

  getTowerData() {
    return { towerId: this.id, x: this.x, y: this.y };
  }
}

export default Tower;
