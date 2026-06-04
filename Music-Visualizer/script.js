const startBtn = document.getElementById('start-btn');
const overlay = document.getElementById('overlay');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let audioCtx;
let analyser;
let dataArray;
let bufferLength;

// Resize canvas to fill the window
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

startBtn.addEventListener('click', async () => {
    try {
        // 1. Request Microphone Access
        // Browsers require explicit user permission to access media devices
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // 2. Set up the Web Audio API Context
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        // 3. Create an audio source from the microphone stream
        const source = audioCtx.createMediaStreamSource(stream);
        
        // 4. Create an Analyser Node to extract frequency data
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512; // Controls the number of bars (higher = more bars)
        
        // Connect the microphone to the analyser
        source.connect(analyser);
        // Note: We do NOT connect analyser.connect(audioCtx.destination) 
        // because that would echo the mic input back through the speakers!
        
        // 5. Prepare arrays to hold the frequency data
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        
        // Hide the start overlay
        overlay.classList.add('hidden');
        
        // 6. Start the visualizer loop
        draw();
        
    } catch (err) {
        console.error("Error accessing microphone:", err);
        alert("Microphone access denied or not available. Note: Mic access requires running on localhost or a secure HTTPS connection.");
    }
});

function draw() {
    // Schedule the next frame
    requestAnimationFrame(draw);
    
    // Grab the latest frequency data from the audio
    analyser.getByteFrequencyData(dataArray);
    
    // Clear the canvas
    ctx.fillStyle = 'rgba(15, 16, 22, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Calculate bar dimensions
    const barWidth = (canvas.width / bufferLength) * 1.5;
    let barHeight;
    let x = 0;
    
    // Draw each bar
    for (let i = 0; i < bufferLength; i++) {
        // Scale up the frequency data to make the bars taller
        barHeight = dataArray[i] * 2.5; 
        
        // Create a dynamic neon gradient based on bar height and position
        const r = barHeight + (25 * (i / bufferLength));
        const g = 250 * (i / bufferLength);
        const b = 255;
        
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        
        // Draw the bar originating from the bottom of the canvas
        ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
        
        // Move X coordinate to the right for the next bar
        x += barWidth + 2; 
    }
}
