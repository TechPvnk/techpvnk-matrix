const canvas = document.getElementById('matrix')
const ctx = canvas.getContext('2d')
const bootLogo = new Image()

bootLogo.src = 'assets/bootlogo.png'

canvas.width = window.innerWidth
canvas.height = window.innerHeight

// =========================
// TECHPVNK MATRIX SETTINGS
// =========================

const glyphs = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890Zᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᚿᛃᛄᛇᛈᛉᛊᛋᛏᛒᛖᛗᛚᛜᛝᛟᛞ'

const fontSize = 24 // Slightly smaller font allows for a massive surge in total elements
const columnSpacing = fontSize * 0.75 // Tightly packed, overlapping columns for extreme density

const columns = Math.floor(canvas.width / columnSpacing)
const streams = []

let lastUpdateTime = 0
const frameInterval = 100 // Increased interval slowing down the overall grid ticks for a steady rain

for(let i = 0; i < columns; i++) {
    const streamLength = 14 + Math.floor(Math.random() * 25)
    
    // Determine depth layer: 1 = Foreground (Bright/Fast), 0 = Background (Dimmer/Slower)
    const layer = Math.random() > 0.35 ? 1 : 0 
    
    streams.push({
        x: i * columnSpacing,
        currentRow: Math.floor(Math.random() * -40), // Staggered entry points
        speed: layer === 1 ? 1 : 0.5,                // Slower fractional grid increments for background depth
        length: streamLength,
        layer: layer,
        gridHistory: {} 
    })
}

// =========================
// BOOT SEQUENCE
// =========================

const bootLines = [
    'TECHPVNK SYSTEMS',
    'BIOS REVISION 6.66',
    '',
    'Initializing hardware...',
    'Checking memory...',
    'Loading kernel modules...',
    'Authenticating user...',
    '',
    'Call trans opt: received.',
    '2-19-96 13:24:18 REC:Log>.',
    'Trace program: running.'
]

let bootIndex = 0
let bootComplete = false

function drawBootSequence() {

    ctx.fillStyle = 'black'

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    )

    // subtle CRT flicker
    ctx.globalAlpha =
        0.85 + Math.random() * 0.15

    ctx.globalAlpha =
    0.85 + Math.random() * 0.15

const logoWidth = 500

const aspect =
    bootLogo.width / bootLogo.height

const logoHeight =
    logoWidth / aspect

ctx.drawImage(

    bootLogo,

    canvas.width / 2 - (logoWidth / 2),

    40,

    logoWidth,

    logoHeight
)


    ctx.globalAlpha = 1

    ctx.fillStyle = '#ff2020'

    ctx.font = 'bold 20px monospace'

    ctx.shadowBlur = 4

    for(let i = 0; i < bootIndex; i++) {

        ctx.fillText(
            bootLines[i],
            80,
            100 + (i * 40)
        )
    }
}

// =========================
// MAIN MATRIX DRAW
// =========================

function drawMatrix(timestamp) {
    // Semi-transparent overlay canvas pass. 
    // A slightly lower opacity (0.05) keeps trails alive longer, matching your reference photo perfectly.
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)' 
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.font = `bold ${fontSize}px monospace`
    ctx.textBaseline = 'top'

    const shouldUpdateGrid = (timestamp - lastUpdateTime) > frameInterval
    if (shouldUpdateGrid) {
        lastUpdateTime = timestamp
    }

    for(const stream of streams) {
        if (shouldUpdateGrid) {
            // Update active grid index based on custom stream depth speeds
            stream.currentRow += stream.speed
            
            // Text matrix flash/mutation mutations
            Object.keys(stream.gridHistory).forEach(row => {
                if(Math.random() > 0.94) {
                    stream.gridHistory[row] = glyphs.charAt(Math.floor(Math.random() * glyphs.length))
                }
            })

            // Store new grid glyph values
            const headIndex = Math.floor(stream.currentRow)
            if (headIndex >= 0 && headIndex * fontSize < canvas.height + 100) {
                if (!stream.gridHistory[headIndex]) {
                    stream.gridHistory[headIndex] = glyphs.charAt(Math.floor(Math.random() * glyphs.length))
                }
            }
        }

        const currentHeadIndex = Math.floor(stream.currentRow)

        // Draw the tail sequence
        for (let i = 0; i < stream.length; i++) {
            const targetRow = currentHeadIndex - i
            const y = targetRow * fontSize

            if (y < -fontSize || y > canvas.height || !stream.gridHistory[targetRow]) continue

            const glyph = stream.gridHistory[targetRow]
            const alpha = 1 - (i / stream.length)

            if (i === 0) {
                // Foreground vs Background dynamic head coloring
                if (stream.layer === 1) {
                    ctx.fillStyle = '#ffffff'      // Pure stark white core
                    ctx.shadowColor = '#ff2222'
                    ctx.shadowBlur = 10
                } else {
                    ctx.fillStyle = '#ff5555'      // Soft crimson background core
                    ctx.shadowColor = '#aa0000'
                    ctx.shadowBlur = 4
                }
            } else if (i < 4) {
                // Saturated neon mid-glow blocks
                ctx.fillStyle = stream.layer === 1 ? '#ff1a1a' : '#b30000'
                ctx.shadowColor = '#990000'
                ctx.shadowBlur = stream.layer === 1 ? 5 : 2
            } else {
                // Graceful falling code tail fading into darkness
                const redValue = stream.layer === 1 ? 150 : 85
                ctx.fillStyle = `rgba(${redValue}, 0, 0, ${alpha * 0.85})`
                ctx.shadowBlur = 0 
                ctx.shadowColor = 'transparent'
            }

            let finalGlyph = glyph
let drawX = stream.x
let drawY = y

if(revealActive) {

    const target =
        logoTargets.find(t => {

            return (
                Math.abs(t.x - stream.x) < 10 &&
                Math.abs(t.y - y) < 10
            )
        })

    if(target) {

        finalGlyph = target.glyph

        drawX = target.x
        drawY = target.y

        ctx.fillStyle = '#ff3030'
        ctx.shadowBlur = 3
    }
}

ctx.fillText(
    finalGlyph,
    drawX,
    drawY
)
        }

        // Reset system loops
        if ((currentHeadIndex - stream.length) * fontSize > canvas.height) {
            stream.currentRow = Math.floor(Math.random() * -40)
            stream.gridHistory = {} 
            stream.layer = Math.random() > 0.4 ? 1 : 0
            stream.speed = stream.layer === 1 ? 1 : 0.5
        }
    }
    
    ctx.shadowBlur = 0
    ctx.shadowColor = 'transparent'
}

// =========================
// CRT OVERLAY EFFECT
// =========================

function drawCRT() {
    // Tight 2px micro-scanlines to create that awesome monitor texture from the image
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)' 
    for(let y = 0; y < canvas.height; y += 3) {
        ctx.fillRect(0, y, canvas.width, 1)
    }

    // Heavy background vignette wrap
    const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, canvas.height * 0.1,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.8
    )
    gradient.addColorStop(0, 'rgba(0,0,0,0)')
    gradient.addColorStop(1, 'rgba(0,0,0,0.75)')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

// =========================
// LOGO REVEAL
// =========================

let revealActive = false
let revealProgress = 0
let revealDirection = 1

function drawLogoReveal() {
    ctx.font = 'bold 11px monospace';
    ctx.textBaseline = 'top';

    // 1. DYNAMICALLY MEASURE THE VISUAL FOOTPRINT FOR PERFECT ALIGNMENT
    let minCol = Infinity;
    let maxCol = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    const lineHeight = 13;

    // We quickly scan the array structure just to find the physical bounding box size
    for (let row = 0; row < logoPattern.length; row++) {
        const line = logoPattern[row];
        const firstChar = line.search(/[^\s\u00A0]/);
        const lastChar = line.length - 1 - line.split('').reverse().join('').search(/[^\s\u00A0]/);
        if (firstChar !== -1) {
            if (firstChar < minCol) minCol = firstChar;
            if (lastChar > maxCol) maxCol = lastChar;
            const rawY = row * lineHeight;
            if (rawY < minY) minY = rawY;
            if (rawY > maxY) maxY = rawY;
        }
    }

    const charWidth = ctx.measureText('A').width;
    const visualWidth = (maxCol - minCol + 1) * charWidth;
    const visualHeight = (maxY - minY) + lineHeight;

    // Establish the absolute screen center offsets
    const centerOffsetX = (canvas.width / 2) - (visualWidth / 2);
    const centerOffsetY = (canvas.height / 2) - (visualHeight / 2);
    const totalColumns = maxCol - minCol;

    // 2. RENDER THE LOGO FROM THE ANIMATION-AWARE TARGETS ARRAY
    // This allows your out-animation framework to successfully hide/fade individual elements
    for (let i = 0; i < logoTargets.length; i++) {
        const target = logoTargets[i];

        // --- OUT-ANIMATION GUARD TRIPS ---
        // If your out-animation relies on custom flags like target.active, target.alpha, etc.,
        // uncomment or add those checks right here! For example:
        // if (target.alpha <= 0) continue; 
        // ---------------------------------

        // Subtle CRT jitter
        const jitterX = (Math.random() - 0.5) * 1.5;
        const jitterY = (Math.random() - 0.5) * 1.5;

        // Subtle phosphor flicker
        const brightness = 120 + Math.random() * 60;

        // Use target alpha if your code has one (defaults to 0.92 if undefined)
        const currentAlpha = target.alpha !== undefined ? target.alpha : 0.92;

        ctx.fillStyle = `rgba(${brightness}, 20, 20, ${currentAlpha})`;
        ctx.shadowColor = '#770000';
        ctx.shadowBlur = 2;

        // Draw character using the unified layout tracking positions
        ctx.fillText(
            target.glyph,
            target.x + jitterX,
            target.y + jitterY
        );
    }

    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
}

const logoPattern = [

'                                                                                            ##                                                                                                 ',
'                                                                                          ###                                                                                                  ',
'                                                                                       ##**#                                                                                                   ',
'                                                                                      #*+*#######################                                                                              ',
'                                                                                   #*+++*##*+++++++++++++++++++++#                                                                             ',
'                                                                                 ##++++*##*+++++++++++++++++++++*#                                                                             ',
'      ######################################################################     #+++++*###+++++++########++++++########        ################     #################    *###########          ',
'    #*++++++++++++++++++++++*#*++++++++++++++++##*+++++++++++++++*#*+++++*#     *+++++*##*+++++++*     #*++++++*#*+++++#       *++++++*#+++++++#    #++++++#**+++++*#  #**+++++++*##            ',
'  #*+++++++++++++++++++++++*#*++++++++++++++++*#*+++++++++++++++*#*+++++*#     #+++++*##*+++++++*#    #*++++++*##*+++++#     #*++++++##*+++++++*#  #*+++++* *+++++*###*++++++++*#               ',
'  ###********#*+++++*#*****##+++++*##########* #+++++*#*********##+++++*#######++++++##*+++++++*######*+++++++# #*+++++#   #*++++++*##*+++++++++# #*+++++*##*+++++**++++++++*##                 ',
'            #*+++++*#     #*+++++++++++++++# #*+++++*#          #++++++++++++++++++*##*++++++++++++++++++++++#  #*+++++#  #*+++++*# #*++++++++++*#*+++++*##*++++++++++++++*#                    ',
'           #*++++++#      *+++++++++++++++* #*+++++*#          #++++++++++++++++++*##*+++++++++++++++++++++*#   #*+++++##*++++++*# #*+++++**+++++*+++++*##*++++++++++++*##                      ',
'          #*+++++*#      #++++++**********# *+++++*#          *++++++********+++++##*++++++++*************#     #*+++++#++++++*#  #*+++++*#*+++++++++++# *++++++*+++++++*#                      ',
'         #*++++++#      #++++++#############+++++*##########*#*+++++*     #*+++++###+++++++*#                   #*+++++++++++*#  ##+++++*# #++++++++++* #++++++##**+++++++##                    ',
'        #*++++++#      #+++++++++++++++++##++++++++++++++++##*+++++*#    #*++++*##*+++++++*#                    #*+++++++++*#   #*++++++#   #++++++++*##++++++*    #*+++++++*#                  ',
'       #*++++++#      *+++++++++++++++++#*++++++++++++++++##*+++++*#     *++++*##*+++++++*#                     #*++++++++*    #*++++++#    #*++++++*##*+++++*#      #*+++++++##                ',
'      #*++++++#      ##****************###***************###*****##     #+++++# *+++++++*#                      ##*******#     ##*****#      #*****####*****##         ##*+++++*#               ',
'     #*+++++*#                                                          #*+++##*++++++*####################****#                                                          #**++++*#             ',
'    #*+++*##       ##################*+++++++++++++++++++++++++++++++++* *+*##*++++++**#*++++++++++++++++++++++++++++*# ##*++++++++++++++++++++++++++++++*******************##**+++*##*******###',
'    *++*#*#*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++* #*##*+++++###*+++++++++++++++++++++++++++++***++++++++++++++++++++++++++++++++++++++*****############# ##*++*#         ',
'  #*+*# ##############################++++++++++++++++++++++++++++++++++####*++++*##*+++++++++++++++++++++++++++**********+************#############                               ##***#       ',
' ####                                ############################*##***+*##*+++*###++++++++++++++*######*####*                                                                         ###*     ',
'###                                                                      #*++*#                                                                                                          *##    ',
'#                                                                        *+*##                                                                                                                  ',
'                                                                       #*+*#                                                                                                                    ',
'                                                                      ##*#                                                                                                                      ',
'                                                                     ###                                                                                                                        ',
'                                                                     #                                                                                                                          '

]

let logoTargets = []

function buildLogoTargets() {
    // FORCE RESET: Wipes out the array completely to prevent ghosting or duplicating coordinates
    logoTargets.length = 0; 

    ctx.font = 'bold 11px monospace'; 
    const lineHeight = 13; 

    let rawGlyphs = [];
    let minGridX = Infinity;
    let maxGridX = -Infinity;

    // Phase 1: Scan the text pattern layout
    for (let row = 0; row < logoPattern.length; row++) {
        const line = logoPattern[row];
        for (let col = 0; col < line.length; col++) {
            const char = line[col];

            if (char && !/\s|\u00A0/.test(char)) {
                if (col < minGridX) minGridX = col;
                if (col > maxGridX) maxGridX = col;

                rawGlyphs.push({
                    gridX: col,
                    gridY: row,
                    glyph: char
                });
            }
        }
    }

    if (rawGlyphs.length === 0) return;

    // ========================================================
    // CONTAINER CONTROLS (Tweak these now—they WILL work!)
    // ========================================================
    const containerWidthPercent = 0.65; 
    
    // Changing this now forces an immediate pixel-shift update
    const containerCenterAnchor = 0.50;  // 0.50 = Dead Center | 0.30 = Far Left | 0.70 = Far Right

    // ========================================================
    // CONTAINER MATH ENGINE
    // ========================================================
    const containerWidth = canvas.width * containerWidthPercent;
    const containerHeight = logoPattern.length * lineHeight;

    const containerOffsetX = (canvas.width * containerCenterAnchor) - (containerWidth / 2);
    const containerOffsetY = (canvas.height / 2) - (containerHeight / 2);

    const totalLogoColumns = (maxGridX - minGridX);

    // Phase 2: Repopulate the clean global target array
    for (const item of rawGlyphs) {
        const localXPercent = totalLogoColumns > 0 ? (item.gridX - minGridX) / totalLogoColumns : 0;

        logoTargets.push({
            x: containerOffsetX + (localXPercent * containerWidth),
            y: containerOffsetY + (item.gridY * lineHeight),
            glyph: item.glyph
        });
    }
}

// Call rebuild
buildLogoTargets();

// =========================
// MAIN ANIMATION LOOP
// =========================

function animate(timestamp) {
    if(!bootComplete) {
        drawBootSequence()
    } else {
        drawMatrix(timestamp)
        if(revealActive) {
            drawLogoReveal()
        }
        drawCRT()
    }
    requestAnimationFrame(animate)
}

requestAnimationFrame(animate)

// =========================
// BOOT TIMING
// =========================

const bootInterval = setInterval(() => {
    bootIndex++
    if(bootIndex > bootLines.length) {
        clearInterval(bootInterval)
        setTimeout(() => {
            bootComplete = true
        }, 600)
    }
}, 200)

// =========================
// LOGO REVEAL TIMER
// =========================

setInterval(() => {

    if(bootComplete && !revealActive) {
        // 1. Kick off the introduction animation
        revealActive = true;
        revealDirection = 1;

        // 2. Add a timed delay to trigger the out-animation automatically!
        // (For example, let the logo stay visible for 8 seconds before disappearing)
        setTimeout(() => {
            // Set direction to backwards/fade-out mode
            revealDirection = -1; 
            
            // Wait for your out-animation to finish processing its frames (e.g., 2 seconds)
            // then flip the main switch to false so the loop resets.
            setTimeout(() => {
                revealActive = false;
            }, 2000); 

        }, 8000); // 8000ms = 8 seconds of screen time
    }

}, 45000); // Runs the full sequence cycle every 45 seconds

// =========================
// RESIZE SUPPORT
// =========================
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    buildLogoTargets();
})

let mouseX = null
let mouseY = null

document.addEventListener('mousemove', e => {

    if(mouseX === null) {

        mouseX = e.screenX
        mouseY = e.screenY

        return
    }

    const dx =
        Math.abs(e.screenX - mouseX)

    const dy =
        Math.abs(e.screenY - mouseY)

    if(dx > 5 || dy > 5) {

        require('electron').ipcRenderer.send(
            'quit-app'
        )
    }
})

document.addEventListener('mousedown', () => {

require('electron').ipcRenderer.send(
    'quit-app'
)
})

document.addEventListener('keydown', () => {

require('electron').ipcRenderer.send(
    'quit-app'
)
})