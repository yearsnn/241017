var fonts = ["Futura", "Didot", "Verdana", "Baskerville", "Avenir", "Gill Sans", "Source Code Pro", "Cooper", "Helvetica", "Rockwell", "Didot"];
let size = 800;

var index;
let offscreen, mask;
let stringInput;
let rowsSlider;
let colsSlider;
let backgroundColor;
let textColor;
let fontGrid;
let h;
let capture;
let usingWebcam = false;
let webcamReady = false;

function setup() {
    createCanvas(windowWidth, windowHeight);
    offscreen = createGraphics(windowWidth, windowHeight);
    mask = createGraphics(windowWidth, windowHeight);
    offscreen.textAlign(CENTER, CENTER);
    capture = createCapture({
        video: {
            width: 640,
            height: 480,
            frameRate: 15
        }
    });
    capture.hide();
    capture.elt.onloadedmetadata = function() {
        webcamReady = true;
    };
    stringInput = createInput('以管窺天');
    stringInput.style('width', '400px');
    stringInput.style('height', '30px');
    stringInput.position((windowWidth - 400) / 2, 5);
    stringInput.input(scramble);
    stringInput.mousePressed(() => {
        if (stringInput.value() === '以管窺天') {
            stringInput.value('');
        }
        usingWebcam = true;
        drawGraphic();
    });
    rowsSlider = createSlider(1, 10, 4, 1);
    rowsSlider.position(10, 5);
    rowsSlider.input(scramble);
    colsSlider = createSlider(1, 30, 10, 1);
    colsSlider.position(10, 35);
    colsSlider.input(scramble);
    backgroundColor = createColorPicker('#0c2e3b');
    backgroundColor.position(10, 70);
    backgroundColor.style('width', '75px');
    backgroundColor.input(() => {
        usingWebcam = false;
        drawGraphic();
    });
    textColor = createColorPicker('#ff1f1f');
    textColor.position(100, 70);
    textColor.style('width', '75px');
    textColor.input(drawGraphic);
    scramble();
}

function scramble() {
    fontGrid = new Array();
    var rows = rowsSlider.value();
    var cols = colsSlider.value();
    for (var j = 0; j < rows; j++) {
        fontGrid[j] = new Array();
        for (var i = 0; i < cols; i++) {
            fontGrid[j].push(fonts[floor(random(0, fonts.length))]);
        }
    }
    getHeight();
    drawGraphic();
}

function getHeight() {
    var x = 0;
    for (var i = 0; i < fonts.length; i++) {
        offscreen.textFont(fonts[i]);
        offscreen.textSize(windowWidth);
        offscreen.textSize(windowWidth * windowWidth / offscreen.textWidth(stringInput.value()));
        x = Math.max(x, offscreen.textAscent());
    }
    h = x;
}

function mouseClicked() {
    var rows = rowsSlider.value();
    var cols = colsSlider.value();
    var col = floor(mouseX / (windowWidth / cols));
    var row = floor((mouseY - (windowHeight / 2 - h / 2)) / (h / rows));
    if (row < rows && col < cols) {
        var font = fontGrid[row][col];
        while (fontGrid[row][col] == font) {
            fontGrid[row][col] = fonts[floor(random(0, fonts.length))];
        }
        drawGraphic();
    }
}

function getSector(row, col) {
    var rows = rowsSlider.value();
    var cols = colsSlider.value();
    var out = createGraphics(floor(windowWidth / cols), floor(h / rows));
    out.fill(color(textColor.value()));
    out.textFont(fontGrid[row][col]);
    out.textSize(windowWidth);
    out.textAlign(CENTER, CENTER);
    out.textSize(windowWidth * windowWidth / out.textWidth(stringInput.value()));
    out.text(stringInput.value(), windowWidth / 2 - col * windowWidth / cols, h / 2 - row * h / rows);
    return out.get();
}

function drawGraphic() {
    clear();
    let numCharacters = stringInput.value().length;
    let scaleFactor = map(numCharacters, 0, 7, 5, 1);
    if (usingWebcam && webcamReady) {
        push();
        translate(windowWidth / 2, windowHeight / 2);
        scale(scaleFactor);
        translate(-windowWidth / 2, -windowHeight / 2);
        image(capture, 0, 0, windowWidth, windowHeight);
        pop();
    } else {
        background(color(backgroundColor.value()));
    }
    fill(color(textColor.value()));
    textAlign(LEFT);
    textSize(20);
    let offsetX = windowWidth - 150;
    text('input: ' + stringInput.value(), offsetX, 25);
    text('row: ' + rowsSlider.value(), offsetX, 55);
    text('column: ' + colsSlider.value(), offsetX, 85);
    var rows = rowsSlider.value();
    var cols = colsSlider.value();
    for (var row = 0; row < rows; row++) {
        for (var col = 0; col < cols; col++) {
            fill(255, 0);
            noStroke();
            rect(col * windowWidth / cols, windowHeight / 2 - h / 2 + row * h / rows, windowWidth / cols, h / rows);
            image(getSector(row, col), col * windowWidth / cols, windowHeight / 2 - h / 2 + row * h / rows, windowWidth / cols, h / rows);
        }
    }
    textAlign(CENTER);
    textSize(20);
    fill(color(textColor.value()));
    text("이관규천, 부분 아닌 전체를 보아라.", width / 2, height - 50);
    text("부분이 전체를 이룰 때 그 가치가 보일 것이니.", width / 2, height - 20);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    scramble();
}
