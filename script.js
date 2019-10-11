const video = document.getElementById('video')
model_url = 'https://cdn.jsdelivr.net/gh/rizwanishaq/facedetection/dist/models/'

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri(model_url),
  faceapi.nets.faceLandmark68Net.loadFromUri(model_url),
  faceapi.nets.faceRecognitionNet.loadFromUri(model_url),
  faceapi.nets.faceExpressionNet.loadFromUri(model_url)
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
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
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 100)
})