const video = document.getElementById('video'),
capturedPhoto       = document.getElementById('capturedPhoto'),
captureCanvas       = document.getElementById('captureCanvas'), 
uploadCanvas        = document.getElementById('uploadCanvas'), 
captureContext      = captureCanvas.getContext('2d');

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
  if(navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
    .then(function(stream) {
      video.srcObject = stream;
    }).catch(function(error) {
      console.log(error)
    })
  }
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    //faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    //faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  })
})

function setImageToCanvas(image, id, canvas, context, width=image.width, height=image.height) {
  var ratio = width / height;
  var newWidth = canvas.width;
  var newHeight = newWidth / ratio;
  if (newHeight > canvas.height) {
    newHeight = canvas.height;
    newWidth = newHeight * ratio;
}
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, newWidth, newHeight);
  id.setAttribute('src', canvas.toDataURL('image/png'));

  
}

const captureButton = document.getElementById('capture');
function captured() {
    setImageToCanvas(video, capturedPhoto, captureCanvas, captureContext, video.videoWidth, video.videoHeight);
    //document.getElementById('capture').style.display = 'none';
}
 document.getElementById('capture').addEventListener('click', captured);
//     setTimeout(function() {
//         // On Take Photo Button Click
//         captureButton.dispatchEvent(new Event("click"));
   
//    }, 5000);