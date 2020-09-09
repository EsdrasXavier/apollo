
class Queue {
  constructor(connection) {
    this._connection = connection;
    this.currentIndex = -1;
    this.items = [];
    this.isPlaying = false;
  }

  isRunning = () => {
    return this.isPlaying;
  }

  enqueue = (element) => {
    this.items.push(element);
  }

  dequeue = () => {
    if (this.isEmpty())
      return null;

    return this.items.shift();
  }

  front = () => {
    if (this.isEmpty())
      return null;

    return this.items[0];
  }

  isEmpty = () => {
    return this.items.length == 0;
  }

  printQueue = () => {
    var str = "";

    for (var i = 0; i < this.items.length; i++)
      str += this.items[i] + " ";

    return str;
  }

  contains = (element) => {
    if (this.isEmpty()) return false;
    const size = this.items.length - 1;

    for (let i = 0; i < size / 2; i++) {
      if (this.items[i] === element || this.items[size - i] === element) {
        return true;
      }
    }

    return false;
  }

  current = () => {
    return this.items[this.currentIndex];
  }

  next = () => {
    this.currentIndex++;

    if (this.currentIndex > (this.items.length - 1)) {
      this.isPlaying = false;
      return null;
    }

    this.isPlaying = true;

    return this.items[this.currentIndex];
  }

  previous = () => {
    this.currentIndex--;

    if (this.currentIndex < 0) {
      this.currentIndex = 0;
      return null;
    }

    return this.items[this.currentIndex];
  }

  _play = () => {

  }
}

module.exports = Queue;
