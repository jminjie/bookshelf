const CANVAS_HEIGHT = document.getElementById("bookshelfSvg").height.animVal.value;
const MIN_BOOK_HEIGHT = 300;
const MIN_BOOK_WIDTH = 50;
const SVGNS = "http://www.w3.org/2000/svg";

function main() {
    var books = document.getElementsByClassName('book');
    var shelf = document.getElementById("shelf");
    books = shuffle(Array.from(books));

    for (var i = 0; i < books.length; i++) {
        var book = books[i];
        hideBook(book);
        var title = book.getElementsByClassName('title')[0].innerHTML;
        var about = book.getElementsByClassName('about')[0].innerHTML;
        book = new Book(title, about);
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

    titleIsLong = book.title.length > 20;
    titleIsShort = book.title.length < 10;

    var bookHeight = Math.random()*50 + MIN_BOOK_HEIGHT;
    var bookWidth = Math.random()*20 + MIN_BOOK_WIDTH;
    var verticalOffset = CANVAS_HEIGHT-bookHeight;
    // titleSpaceRatio is how far up the spine of the book the title appears
    var titleSpaceRatio = 4/5;
    if (titleIsLong) {
        titleSpaceRatio = 6/7;
    } else if (titleIsShort) {
        titleSpaceRatio = 3/4;
    }
    var verticalTextOffset = CANVAS_HEIGHT - titleSpaceRatio*bookHeight;
    var horizontalOffset = addBook.offset;
    var horizontalTextOffset = addBook.offset + bookWidth*5/12;
    var textRotationPoint = horizontalTextOffset + ", " + verticalTextOffset;
    var bookColor = getRandomColor();
    var textColor = isDark(bookColor) ? 'beige' : 'black';
    var textSize = 16 + Math.random();

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
    text.setAttribute('font-size', textSize);
    text.setAttribute('transform', "rotate(90, " + textRotationPoint + ")");
    text.setAttribute('onclick', "setAbout(\"" + book.about + "\")");
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
