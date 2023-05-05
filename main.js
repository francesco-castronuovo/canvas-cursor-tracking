let components = document.querySelectorAll('[fc-cursor-tracking = component]')
  
for(let component of components)
{
  let canvas = component.querySelector('[fc-cursor-tracking = canvas] canvas')
  let c = canvas.getContext('2d')

  let strokeColor = component.getAttribute('fc-cursor-tracking-stroke-color') === null ? '#4353ff' : component.getAttribute('fc-cursor-tracking-stroke-color')

  let strokeThickness = isNaN(parseInt(component.getAttribute('fc-cursor-tracking-stroke-thickness'))) ? 4 : parseInt(component.getAttribute('fc-cursor-tracking-stroke-thickness'))

  let strokeLength = isNaN(parseInt(component.getAttribute('fc-cursor-tracking-stroke-length'))) ? 15 : parseInt(component.getAttribute('fc-cursor-tracking-stroke-length'))

  console.log(strokeLength)

  let mousePositions = []
  let lastMousePosition = {
    x: undefined,
    y: undefined
  }

  let collectMousePositionTimerElapsed = false;

  let collectMousePositionTimer = setInterval(function() {
    collectMousePositionTimerElapsed = true;
  }, 50)

  let mouseIsStoppedTimer

  canvas.width = component.clientWidth
  canvas.height = component.clientHeight

  c.strokeStyle = strokeColor
  c.lineWidth = strokeThickness

  component.addEventListener('mousemove', function(event) {

    lastMousePosition = {
      x: event.offsetX,
      y: event.offsetY
    }

    clearTimeout(mouseIsStoppedTimer)
    mouseIsStoppedTimerElapsed = false

    mouseIsStoppedTimer = setTimeout(function() {

      if(mousePositions.length == strokeLength)
        mousePositions.shift()

      mousePositions.push(lastMousePosition)

    }, 50)

    if(collectMousePositionTimerElapsed)
    { 
      collectMousePositionTimerElapsed = false

      if(mousePositions.length == strokeLength)
        mousePositions.shift()

      mousePositions.push({
        x: event.offsetX,
        y: event.offsetY
      })
    }
  })

  function animate() {
    requestAnimationFrame(animate)

    c.clearRect(0, 0, innerWidth, innerHeight)

    if(mousePositions.length <= 0)
      return

    c.beginPath()
    c.moveTo(mousePositions[0].x, mousePositions[0].y)

    for(let i = 1; i < mousePositions.length; i++)
      c.lineTo(mousePositions[i].x, mousePositions[i].y)

    c.stroke()
  }

  animate()
}
