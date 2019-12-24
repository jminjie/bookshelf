const CANVAS_HEIGHT = document.getElementById("bookshelfSvg").height.animVal.value;
const CANVAS_WIDTH = 700;
const MIN_BOOK_HEIGHT = 300;
const BOOK_HEIGHT_RANGE = 50;
const MIN_BOOK_WIDTH = 50;
const BOOK_WIDTH_RANGE = 20;
const SVGNS = "http://www.w3.org/2000/svg";
const MIN_FONT = 15;
const FONT_RANGE = 1;

allBooks = new Map();

function main() {
    var bookElements = document.getElementsByClassName('book');
    bookArray = shuffle(Array.from(bookElements));

    for (var i = 0; i < bookArray.length; i++) {
        var currentBook = bookArray[i];
        hideBookHtml(currentBook);
        var title = currentBook.getElementsByClassName('title')[0].innerHTML;
        var about = currentBook.getElementsByClassName('about')[0].innerHTML;
        var book = new Book(title, about);
        addBook(book);
    }
}

// Shuffle an array
function shuffle(arr) {
    var i, j, temp;
    for (i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}

function hideBookHtml(book) {
    book.setAttribute("style", "visibility:hidden");
}

class Book {
    constructor(title, about) {
        Book.nextId = Book.nextId ? Book.nextId + 1 : 1;
        this.title = title;
        this.about = about;
        this.id = Book.nextId;
    }
}

shelfCount = 0;

function nextShelf() {
    shelfCount++;
}

function getShelfHeight() {
    return shelfCount * (MIN_BOOK_HEIGHT + BOOK_HEIGHT_RANGE + 10);
}


function addBook(book) {
    if (typeof addBook.offset == 'undefined') {
        addBook.offset = 0;
    }
    if (addBook.offset + MIN_BOOK_WIDTH + BOOK_WIDTH_RANGE >= CANVAS_WIDTH) {
        nextShelf();
        addBook.offset = 0;
    }

    allBooks.set(book.id, book);

    titleIsLong = book.title.length > 20;
    titleIsShort = book.title.length < 10;

    var bookHeight = Math.random()*BOOK_HEIGHT_RANGE + MIN_BOOK_HEIGHT;
    var bookWidth = Math.random()*BOOK_WIDTH_RANGE + MIN_BOOK_WIDTH;
    var verticalOffset = CANVAS_HEIGHT-bookHeight - getShelfHeight();
    // titleSpaceRatio is how far up the spine of the book the title appears
    var titleSpaceRatio = 4/5;
    if (titleIsLong) {
        titleSpaceRatio = 6/7;
    } else if (titleIsShort) {
        titleSpaceRatio = 3/4;
    }
    var verticalTextOffset = CANVAS_HEIGHT - titleSpaceRatio*bookHeight - getShelfHeight();
    var horizontalOffset = addBook.offset;
    var horizontalTextOffset = addBook.offset + bookWidth*5/12;
    var textRotationPoint = horizontalTextOffset + ", " + verticalTextOffset;
    var bookColor = getRandomColor();
    var textColor = isDark(bookColor) ? 'beige' : 'black';
    var textSize = MIN_FONT + Math.random()*FONT_RANGE;

    var rect = document.createElementNS(SVGNS, 'rect');
    rect.setAttribute('x', horizontalOffset);
    rect.setAttribute('y', verticalOffset);
    rect.setAttribute('height', bookHeight);
    rect.setAttribute('width', bookWidth);
    rect.setAttribute('fill', bookColor);
    rect.setAttribute('onclick', "setAbout(\"" + book.id + "\")");
    document.getElementById('bookshelfSvg').appendChild(rect);

    var text = document.createElementNS(SVGNS, 'text');
    text.textContent = book.title;
    text.setAttribute('x', horizontalTextOffset);
    text.setAttribute('y', verticalTextOffset);
    text.setAttribute('fill', textColor);
    text.setAttribute('font-size', textSize);
    text.setAttribute('transform', "rotate(90, " + textRotationPoint + ")");
    text.setAttribute('onclick', "setAbout(\"" + book.id + "\")");
    document.getElementById('bookshelfSvg').appendChild(text);

    addBook.offset += bookWidth;
}

// TODO this doesn't work because SVG text doesn't support line breaks. If we
// want this behavior we'll have to do it by manually creating two text objects
function addLineBreakIfNeeded(text) {
    if (text.length > 20) {
        for (i = 19; i > 0; i--) {
            if (text.charAt(i) == " ") {
                start = text.substring(0, i);
                end = text.substring(i+1);
                return start + "<br>" + end;
            }
        }
    }
    return text;
}

function setAbout(id) {
    // setAbout gets the id as a string, so convert to int
    book = allBooks.get(parseInt(id));
    document.getElementById("aboutTheBook").innerHTML = book.about;
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
