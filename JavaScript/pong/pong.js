const { body } = document;

//canvas 
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
const width = 500;
const height = 700;
const screenWidth = window.screen.width;
const canvasPosition = screenWidth / 2 - width / 2;
const isMobile = window.matchMedia('(max-width: 600px)');

//Paddles
const paddleHeight = 10;
const paddleWidth = 50;
let paddleBottomX = 225; //center the paddles
let paddleTopX = 225;

//display canvas

const renderCanvas = () => {
    context.fillStyle = 'black';
    context.fillRect( 0, 0, width, height);

     //paddle colour
    context.fillStyle = 'white';

    //user paddle
    context.fillRect(paddleBottomX, height - 20, paddleWidth, paddleHeight);
    //bot paddle
    context.fillRect(paddleTopX, 10, paddleWidth, paddleHeight);
}

const createCanvas = () => {
    canvas.width = width;
    canvas.height = height;
    body.appendChild(canvas);
    renderCanvas();
}
createCanvas();

