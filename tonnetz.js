let soundObj = [];
let mouseClickedOnOff = false; // Steuerungsvariable für die Mausklick-Interaktion.
let clickedID = -1; // Steuerungsvariable für die Mausklick-Interaktion.
let objectDist = []; 
let midi12Note = [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72]; // MIDI-Noten und Notennamen
let name12Note = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C2"]; // MIDI-Noten und Notennamen
let midiCMajNote = [60, 62, 64, 65, 67, 69, 71, 72];
let nameCMajNote = ["C", "D", "E", "F", "G", "A", "B", "C2"];
let currentChord = ""; //erkannter Akkord 
let fixedText = "Bewege die Noten";
let customImages = []; //Bilder der Noten
let lastMouseActivityTime;
let showText = false;

//------------------------------------------------------------------------
function preload() {
    // Pfade zu den Illustrationen 
    let imagePath1 = 'noten/c.png';
    let imagePath2 = 'noten/d.png';
    let imagePath3 = 'noten/e.png';
    let imagePath4 = 'noten/f.png';
    let imagePath5 = 'noten/g.png';
    let imagePath6 = 'noten/a.png';
    let imagePath7 = 'noten/h.png';
    let imagePath8 = 'noten/c2.png';

    // Laden der Illustrationen
    customImages[0] = loadImage(imagePath1);
    customImages[1] = loadImage(imagePath2);
    customImages[2] = loadImage(imagePath3);
    customImages[3] = loadImage(imagePath4);
    customImages[4] = loadImage(imagePath5);
    customImages[5] = loadImage(imagePath6);
    customImages[6] = loadImage(imagePath7);
    customImages[7] = loadImage(imagePath8);
}

//------------------------------------------------------------------------
function setup() {
    createCanvas(windowWidth, windowHeight);
    lastMouseActivityTime = millis(); // Initialisierung der Zeit

    for (let i = 0; i < 8; i++) {
        let _x = i % 4;
        let _y = floor(i / 4);
        let _step = 200;
        let _offset = 150;
        let _o = new Soundobject(_x * (_step + 80) + _offset, _y * (_step + 80) + _offset, i % nameCMajNote.length);
        soundObj.push(_o);
    }

    for (let i = 0; i < 6; i++) {
        objectDist[i] = 10000;
    }
}

//------------------------------------------------------------------------
function draw() {
    background(20);
    textSize(20);
    textAlign(LEFT, TOP);
    fill(255);
    text(fixedText, 10, 10);

    if (millis() - lastMouseActivityTime > 15000) {
        showText = true;
    } else {
        showText = false;
    }

    if (showText) {
        textSize(18);
        textAlign(LEFT, TOP);
        fill(119, 255, 0);
        text("Klicke die Noten an", mouseX + 15, mouseY);
    }

    for (let i = 0; i < soundObj.length; i++) {
        soundObj[i].mouseDragged();
        soundObj[i].draw();
        soundObj[i].synthPlay();
        soundObj[i].contact = 0;
        if (soundObj[i].locked == true) {
            soundObj[i].contact = 1;
        }
    }

    for (let i = 0; i < soundObj.length; i++) {
        let _v1 = soundObj[i].pos;
        for (let j = 0; j < soundObj.length; j++) {
            let _v2 = soundObj[j].pos;

            let _d = _v1.dist(_v2);
            if (_d >= 10 && _d < 150) {
                push();
                stroke(119, 255, 0);
                line(soundObj[i].x, soundObj[i].y, soundObj[j].x, soundObj[j].y)
                pop();
                soundObj[i].contact = 1;
            }
        }
    }

    let cNote = soundObj.find(obj => obj.name === "C" && obj.contact === 1);
    let dNote = soundObj.find(obj => obj.name === "D" && obj.contact === 1);
    let eNote = soundObj.find(obj => obj.name === "E" && obj.contact === 1);
    let fNote = soundObj.find(obj => obj.name === "F" && obj.contact === 1);
    let gNote = soundObj.find(obj => obj.name === "G" && obj.contact === 1);
    let aNote = soundObj.find(obj => obj.name === "A" && obj.contact === 1);
    let bNote = soundObj.find(obj => obj.name === "B" && obj.contact === 1);
    let c2Note = soundObj.find(obj => obj.name === "C2" && obj.contact === 1);
   
    if (cNote && eNote && gNote) {
        currentChord = "C-Dur";
    } else if (aNote && cNote && eNote) {
        currentChord = "a-moll";
    } else if (aNote && bNote && dNote) {
        currentChord = "G-Dur";
    } else if (cNote && dNote) {
        currentChord = "kleine Sekunde";
    } else if (cNote && eNote) {
        currentChord = "große Terz";
    } else if (cNote && fNote) {
        currentChord = "Quarte";
    } else if (cNote && gNote) {
        currentChord = "Quinte";
    } else if (cNote && aNote) {
        currentChord = "große Sexte";
    } else if (cNote && bNote) {
        currentChord = "große Septime";
    } else if (cNote && c2Note) {
        currentChord = "Oktave";
    } else if (dNote && eNote) {
        currentChord = "kleine Terz";
    } else if (dNote && fNote) {
        currentChord = "übermäßige Quarte";
    } else if (dNote && gNote) {
        currentChord = "übermäßige Quinte";
    } else if (dNote && aNote) {
        currentChord = "kleine Sexte";
    } else if (dNote && bNote) {
        currentChord = "kleine Septime";
    } else if (eNote && fNote) {
        currentChord = "kleine Sekunde";
    } else if (eNote && gNote) {
        currentChord = "kleine Terz";
    } else if (eNote && aNote) {
        currentChord = "übermäßige Quarte";
    } else if (eNote && bNote) {
        currentChord = "übermäßige Quinte";

    } else {
        currentChord = ""; // Kein Akkord
    }

    // Anzeige des aktuellen Akkords in der oberen rechten Ecke
    textSize(22);
    textAlign(RIGHT, TOP);
    fill(255);
    text(currentChord, width - 10, 10);
}
function mouseMoved() {
    // Aktualisiere die Zeit der letzten Mausaktivität
    lastMouseActivityTime = millis();
}
function mouseDragged() {
    // Aktualisiere die Zeit der letzten Mausaktivität
    lastMouseActivityTime = millis();

    for (let i = 0; i < soundObj.length; i++) {
        soundObj[i].mouseDragged();
    }
}
//------------------------------------------------------------------------
function mousePressed() {
    for (let i = 0; i < soundObj.length; i++) {
        soundObj[i].mousePressed();
    }
}

//------------------------------------------------------------------------
function mouseReleased() {
    for (let i = 0; i < soundObj.length; i++) {
        soundObj[i].mouseReleased();
    }
    lastMouseActivityTime = millis();
}

//------------------------------------------------------------------------
class Soundobject {

    

    constructor(x, y, id) {
        this.osc = new p5.Oscillator('triangle');
        this.playing = false;
        this.freq = midiToFreq(midiCMajNote[id]);
        this.name = nameCMajNote[id];
        this.amp = 0.75;
        this.x = x;
        this.y = y;
        this.pos = createVector(this.x + 40, this.y + 40); // Mitte des Bildes
        this.size = 80;
        this.id = id;
        this.hover = false;
        this.colorFactor = 0;
        this.contact = 0;
        this.overBox = false;
        this.locked = false;
        this.xOffset = 0.0;
        this.yOffset = 0.0;
        this.colorOnOff = 0;
        this.toneOnOff = false;
        this.objectDist = [];
    }

    draw() {
        push();
        translate(this.x, this.y);
        
        // Zeichnen der eigenen Illustration 
        let imageIndex = this.id % customImages.length;
        imageMode(CENTER); // Setzen des Bildmodus auf Mitte
        image(customImages[imageIndex], 0, 0, 120, 120);

        fill(0);
        textSize(25);
        textAlign(CENTER, CENTER);
        text(this.name, 0, 0);
        pop();
    }

    synthPlay() {
        if (this.contact == 1 && this.toneOnOff == false) {
            this.osc.start();
            this.toneOnOff = true;
        }

        if (this.contact == 0) {
            this.osc.amp(0, 0.01);
            this.osc.stop(0.1);
            this.toneOnOff = false;
        }

        if (this.toneOnOff) {
            this.osc.freq(this.freq, 0.1);
            this.osc.amp(this.amp, 0.01);
        } else {
            this.osc.amp(0, 0.01);
            this.osc.stop(0.1);
        }
    }

    mousePressed() {
        if (this.overBox) {
            this.locked = true;
        } else {
            this.locked = false;
        }
        this.xOffset = mouseX - this.x;
        this.yOffset = mouseY - this.y;
    }

    mouseDragged() {
        let _mousePos = createVector(mouseX, mouseY);
        let _pos = createVector(this.x, this.y);
        let _d = _mousePos.dist(_pos);

        if (_d < this.size * 0.5) {
            this.overBox = true;
            if (!this.locked) {
                
            }
        } else {
            this.overBox = false;
        }

        if (this.locked) {
            this.x = mouseX - this.xOffset;
            this.y = mouseY - this.yOffset;
        }

        this.pos = createVector(this.x + this.size / 2, this.y + this.size / 2);
    }

    mouseReleased() {
        this.locked = false;
        this.contact = 0;
    }
}
