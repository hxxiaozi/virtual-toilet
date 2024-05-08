// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// https://learn.ml5js.org/#/reference/posenet

/* ===
ml5 Example
PoseNet example using p5.js
=== */

let capture;
let poseNet;
let poses = []; // this array will contain our detected poses (THIS IS THE IMPORTANT STUFF)
let font;
let object;
let mtl;
let textures = [];
let squatted = false;

let poop = false;
let poopVolume = 0;
let dirtyAss = false;
let paper = false;
let waterConsumption = 0;
let paperConsumption = 0;
let cleaness = 0;
let poopS;
let flushS;
let paperS;
let wipeS;

const cam_w = 1280;
const cam_h = 720;

const options = {
    architecture: "MobileNetV1",
    imageScaleFactor: 0.3,
    outputStride: 16, // 8, 16 (larger = faster/less accurate)
    flipHorizontal: true,
    minConfidence: 0.5,
    maxPoseDetections: 3, // 5 is the max
    scoreThreshold: 0.5,
    nmsRadius: 20,
    detectionType: "multiple",
    inputResolution: 257, // 161, 193, 257, 289, 321, 353, 385, 417, 449, 481, 513, or 801, smaller = faster/less accurate
    multiplier: 0.5, // 1.01, 1.0, 0.75, or 0.50, smaller = faster/less accurate
    quantBytes: 2,
};

function preload() {
    // object = loadModel("toilet.obj");
    png = loadImage("toilet.png")
    poopS = loadSound('poop.wav');
    flushS = loadSound('flush.wav');
    paperS = loadSound('paper.wav');
    wipeS = loadSound('wipe.wav');
}

function setup() {
    createCanvas(cam_w, cam_h);
    capture = createCapture(VIDEO);
    capture.size(cam_w, cam_h);

    // Create a new poseNet method with a single detection
    poseNet = ml5.poseNet(capture, options, modelReady);

    // This sets up an event that fills the global variable "poses"
    // with an array every time new poses are detected.
    poseNet.on("pose", function (results) {
        poses = results;
    });

    // Hide the capture element, and just show the canvas
    capture.hide();

    let button = createButton('reset');
    textSize(50);
    button.position(360, 500);

    button.size(120, 50);
    // Call repaint() when the button is pressed.
    button.mousePressed(reset);

}

// this function gets called once the model loads successfully.
function modelReady() {
    console.log("Model loaded");
}

function draw() {
    // mirror the capture being drawn to the canvas
    push();
    //translate(-width / 2, -height / 2);
    translate(width, 0);
    scale(-1, 1);
    image(capture, 0, 0);
    pop();

    if (poses.length > 0) {
        let pose = poses[0].pose;

        let wristL = createVector(pose.keypoints[9].position.x, pose.keypoints[9].position.y);
        let wristR = createVector(pose.keypoints[10].position.x, pose.keypoints[10].position.y)



        let leftHipX = pose.keypoints[11].position.x;
        let leftHipY = pose.keypoints[11].position.y;
        let rightHipX = pose.keypoints[12].position.x;
        let rightHipY = pose.keypoints[12].position.y;

        let leftKneeY = pose.keypoints[13].position.x;
        let leftKneeX = pose.keypoints[13].position.y;
        let rightKneeX = pose.keypoints[14].position.x;
        let rightKneeY = pose.keypoints[14].position.y;

        let leftAnkleX = pose.keypoints[15].position.x;
        let leftAnkleY = pose.keypoints[15].position.y;
        let rightAnkleX = pose.keypoints[16].position.x;
        let rightAnkleY = pose.keypoints[16].position.y;

        let assPos = createVector((rightHipX + leftHipX) / 2, (rightHipY + leftHipY) / 2);

        // let wristDis = sqrt(sq(wristlx - wristrx) + sq(wristly - wristry));
        // let wristMPx = abs(wristlx + wristrx) / 2;
        // let wristMPy = abs(wristly + wristry) / 2;

        //squat check trigonometry nonononon

        // let O1 = leftAnkleY - leftKneeY;
        // let A1 = leftAnkleX - leftKneeX;
        // let ankleKneeAngleL = atan(O1 / A1);

        // let O2 = leftHipX - leftKneeX;
        // let A2 = leftHipY - leftKneeY;
        // let HipKneeAngleL = atan(O2 / A2);
        // let squatAngleL = ankleKneeAngleL + HipKneeAngleL;

        // let O3 = rightAnkleY - rightKneeY;
        // let A3 = rightAnkleX - rightKneeX;
        // let ankleKneeAngleR = atan(O3 / A3);
        // let O4 = rightHipX - rightKneeX;
        // let A4 = rightHipY - rightKneeY;
        // let HipKneeAngleR = atan(O4 / A4);
        // let squatAngleR = ankleKneeAngleR + HipKneeAngleR;

        // let leftHipAnkleDis = sqrt(
        //     abs((leftHipX - leftAnkleX) * (leftHipX - leftAnkleX)) + abs((leftHipY - leftAnkleY) * (leftHipY - leftAnkleY))
        //   );

        // if ((squatAngleL + squatAngleR) / 2 < 2.1
        //     //&& Hip Position close to toilet
        // ) {
        //     squat()

        // }
        push();
        //translate(-width / 2, -height / 2);
        image(png, -100, -50, 1500, 1000);

        let toiletPos = createVector(655, 500); //*

        let Thres = 30;

        if (assPos.dist(toiletPos) <= Thres && poopVolume < 1) {
            //squat();
            poopS.play();
            poop = true;
            dirtyAss = true;

            cleaness -= 0.01;
            poopVolume += 0.01

            //squatted = true;
        } else {
            //poopVolume = 0;
        }

        if (poop) {

            push();
            textSize(200);
            textAlign(CENTER);
            text("💩", toiletPos.x, toiletPos.y - 10);
            pop();
        }

        let flushPos = createVector(475, 385);


        //flush
        if (flushPos.dist(wristL) <= Thres || flushPos.dist(wristR) <= Thres) {
            if (poop) { flush(); }

        }
        //grab toilet paper
        let paperTorn = false;
        let paperPos = createVector(827, 355);
        if (paperPos.dist(wristL) <= Thres || paperPos.dist(wristR) <= Thres) {
            
            // load model paper sheet at  wrist pos;
            paper = true;


            paperConsumption += 1;
     
             paperS.play(); 
          

        }
        if (paper) {
            noStroke();
            square(wristR.x - 5, wristR.y - 5, 60);
        }

        if (assPos.dist(wristL) <= Thres || assPos.dist(wristR) <= Thres) {
            if (dirtyAss && paper) {
                wipe();
            }
            if (paper) {
                paper == false;
                cleaness += 0.01;
            }
        }

        //if(dirtyHand == true && wristposition at sink){
        //
        //    wash();
        //}
        // }

        // textFont(font);
        //textAlign(CENTER);


        // push();
        // noStroke();


        // orbitControl();
        // // translate(0, 180, 100);
        // // rotateY(PI / 2);
        // // rotateX(PI);

        // // normalMaterial();
        // // model(object);

        // pop();

        // //  if (squat == true){
        //     text(int(ankleKneeAngleL * 180 / PI),0,-50);
        //     text(int(HipKneeAngleL* 180 / PI),0,-70)
        // text("Your left squat angle " + abs(int(squatAngleL * 180 / PI)) + "°", 0, -20);
        // text("Your right squat angle " + abs(int(squatAngleR * 180 / PI)) + "°", 0, 20);



        console.log(mouseX, mouseY);
        push();
        fill(255, 0, 0);
        circle(655, 500, 20);
        circle(475, 385, 15);
        circle(827, 355, 15);
        pop();

        textFont('Courier New');
        textStyle(BOLD);
        stroke(250);
        strokeWeight(3);
        textSize(100);
        text("🫱", wristR.x, wristR.y);
        text("🫲", wristL.x, wristL.y);
        text("🦵", rightKneeX, rightKneeY);
        text("🦴", leftKneeX, leftKneeY);
        text("🍑", assPos.x, assPos.y);


        textSize(30);
        text("Instruction of How to Use a Virtual Toilet", 500, 40);

        text("🍑 @ 🚽 -> 💩", 500, 90);
        text("🫲/🫱 @ 🧻 -> grab 🧻", 500, 120);
        text("🫲/🫱 w 🧻 @ 🍑 -> wipe", 500, 150);
        text("🫲/🫱 @ flush🔘 -> 🌊", 500, 180);
        // text("L knee", leftKneeX, leftKneeY);
        // text("R knee", rightKneeX, rightKneeY);
        // text("L Ankle", leftAnkleX, leftAnkleY);
        // text("R Ankle", rightAnkleX, rightAnkleY);
        // text("wristR", wristR.x, wristR.y);
        // text("wristL", wristL.x, wristL.y);

        textSize(20);
        // text("squatted: " + squatted, 100, 140);
        text("poop: " + poop, 100, 100);
        text("poopVolume: " + (Math.round(poopVolume * 100) / 100).toFixed(2), 100, 120);
        text("dirtyAss: " + dirtyAss, 100, 140);
        text("paper: " + paper, 100, 160);


        text("cleaness: " + (Math.round(cleaness * 100) / 100).toFixed(2), 100, 20);
        text("paper consumption: " + paperConsumption, 100, 40);
        text("water consumption: " + waterConsumption, 100, 60);

        line(leftHipX, leftHipY, rightHipX, rightHipY);
        line(leftHipX, leftHipY, leftKneeX, leftKneeY);
        line(leftKneeX, leftKneeY, leftAnkleX, leftAnkleY);
        line(rightHipX, rightHipY, rightKneeX, rightKneeY);
        line(rightKneeX, rightKneeY, rightAnkleX, rightAnkleY);
        pop();
    }


}

function DisCheck(x1, y1, x2, y2, threshold) {
    return (abs(x1 - x2) <= threshold) && (abs(y1 - y2) <= threshold);
}

function squat() {

}

function wipe() {
    //play animation toilet paper;
    wipeS.play();
    //if(dirtyAss == true){
    cleaness++;
    //;}else{
    //cleaness +0.1;
    // }
    paper = false;
    dirtyAss = false;
    //dirtyHand2 == true;
}

function flush() {
    //display img flush;
    flushS.play();
    //destroy model poop;
    poop = false;
    poopVolume = 0;
    //dirtyHand = true;
    waterConsumption++;
    cleaness++;
}

function reset() {

    poop = false;
    poopVolume = 0;
    dirtyAss = false;
    paper = false;
    waterConsumption = 0;
    paperConsumption = 0;
    cleaness = 0;
}

// function wash() {
//     //play sound wash;
//     dirtyHands = false;
//     //cleaness +*time?;
//     //water consumption +*time;
// }
