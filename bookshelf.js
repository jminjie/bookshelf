const CANVAS_HEIGHT = document.getElementById("bookshelfSvg").height.animVal.value;
const MIN_BOOK_HEIGHT = 200;
const MIN_BOOK_WIDTH = 35;
const SVGNS = "http://www.w3.org/2000/svg";

function main() {
  var books = document.getElementsByClassName('book');
  var shelf = document.getElementById("shelf");

  for (var i = 0; i < books.length; i++) {
    var book = books[i];
    hideBook(book);
    var title = book.getElementsByClassName('title')[0].innerHTML;
    var about = book.getElementsByClassName('about')[0].innerHTML;
    book = new Book(title, about);
    addBook(book);
  }
}

function hideBook(book) {
    book.setAttribute("style", "visibility:hidden");
}

class Book {
  constructor(title, about) {
    this.title = title;
    this.about = about;
  }
}

function addBook(book) {
  if (typeof addBook.offset == 'undefined') {
    addBook.offset = 0;
  }
  var bookHeight = Math.random()*50 + MIN_BOOK_HEIGHT;
  var bookWidth = Math.random()*20 + MIN_BOOK_WIDTH;
  var verticalOffset = CANVAS_HEIGHT-bookHeight;
  var verticalTextOffset = CANVAS_HEIGHT - 4/5*bookHeight;
  var horizontalOffset = addBook.offset;
  var horizontalTextOffset = addBook.offset + bookWidth/3;
  var textRotationPoint = horizontalTextOffset + ", " + verticalTextOffset;
  var bookColor = getRandomColor();
  var textColor = isDark(bookColor) ? 'beige' : 'black';

  var rect = document.createElementNS(SVGNS, 'rect');
  rect.setAttribute('x', horizontalOffset);
  rect.setAttribute('y', verticalOffset);
  rect.setAttribute('height', bookHeight);
  rect.setAttribute('width', bookWidth);
  rect.setAttribute('fill', bookColor);
  rect.setAttribute('onclick', "setAbout(\"" + book.about + "\")");
  document.getElementById('bookshelfSvg').appendChild(rect);

  var text = document.createElementNS(SVGNS, 'text');
  text.textContent = book.title;
  text.setAttribute('x', horizontalTextOffset);
  text.setAttribute('y', verticalTextOffset);
  text.setAttribute('fill', textColor);
  text.setAttribute('transform', "rotate(90, " + textRotationPoint + ")");
  text.setAttribute('onclick', "setAbout(\"" + book.about + "\")");
  document.getElementById('bookshelfSvg').appendChild(text);

  addBook.offset += bookWidth;
}

function setAbout(about) {
  document.getElementById("aboutTheBook").innerHTML = about;
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function isDark(color) {
  var c = color.substring(1);  // strip #
  var rgb = parseInt(c, 16);   // convert rrggbb to decimal
  var r = (rgb >> 16) & 0xff;  // extract red
  var g = (rgb >>  8) & 0xff;  // extract green
  var b = (rgb >>  0) & 0xff;  // extract blue

  var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
  return luma < 80;
}

main();
