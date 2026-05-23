const canvas = document.getElementById('matrix')
const ctx = canvas.getContext('2d')
const bootLogo = new Image()

// Re-calculate targets automatically once the physical image file is fully loaded
bootLogo.onload = () => {
    buildLogoTargets();
}
bootLogo.src = 'assets/bootlogo.png'

canvas.width = window.innerWidth
canvas.height = window.innerHeight

// =========================
// TECHPVNK MATRIX SETTINGS
// =========================

const glyphs = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890Zᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᚿᛃᛄᛇᛈᛉᛊᛋᛏᛒᛖᛗᛚᛜᛝᛟᛞ'

const fontSize = 24 
const columnSpacing = fontSize * 0.75 

const columns = Math.floor(canvas.width / columnSpacing)
const streams = []

let lastUpdateTime = 0
const frameInterval = 100 

for(let i = 0; i < columns; i++) {
    const streamLength = 14 + Math.floor(Math.random() * 25)
    const layer = Math.random() > 0.35 ? 1 : 0 
    
    streams.push({
        x: i * columnSpacing,
        currentRow: Math.floor(Math.random() * -40), 
        speed: layer === 1 ? 1 : 0.5,                
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
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Subtle CRT flicker
    ctx.globalAlpha = 0.85 + Math.random() * 0.15

    const logoWidth = 500
    // Prevent Division-by-Zero errors if the asset image hasn't completed loading yet
    const aspect = bootLogo.width ? (bootLogo.width / bootLogo.height) : 1.6;
    const logoHeight = logoWidth / aspect

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
            stream.currentRow += stream.speed
            
            Object.keys(stream.gridHistory).forEach(row => {
                if(Math.random() > 0.94) {
                    stream.gridHistory[row] = glyphs.charAt(Math.floor(Math.random() * glyphs.length))
                }
            })

            const headIndex = Math.floor(stream.currentRow)
            if (headIndex >= 0 && headIndex * fontSize < canvas.height + 100) {
                if (!stream.gridHistory[headIndex]) {
                    stream.gridHistory[headIndex] = glyphs.charAt(Math.floor(Math.random() * glyphs.length))
                }
            }
        }

        const currentHeadIndex = Math.floor(stream.currentRow)

        for (let i = 0; i < stream.length; i++) {
            const targetRow = currentHeadIndex - i
            const y = targetRow * fontSize

            if (y < -fontSize || y > canvas.height || !stream.gridHistory[targetRow]) continue

            const glyph = stream.gridHistory[targetRow]
            const alpha = 1 - (i / stream.length)

            if (i === 0) {
                if (stream.layer === 1) {
                    ctx.fillStyle = '#ffffff'      
                    ctx.shadowColor = '#ff2222'
                    ctx.shadowBlur = 10
                } else {
                    ctx.fillStyle = '#ff5555'      
                    ctx.shadowColor = '#aa0000'
                    ctx.shadowBlur = 4
                }
            } else if (i < 4) {
                ctx.fillStyle = stream.layer === 1 ? '#ff1a1a' : '#b30000'
                ctx.shadowColor = '#990000'
                ctx.shadowBlur = stream.layer === 1 ? 5 : 2
            } else {
                const redValue = stream.layer === 1 ? 150 : 85
                ctx.fillStyle = `rgba(${redValue}, 0, 0, ${alpha * 0.85})`
                ctx.shadowBlur = 0 
                ctx.shadowColor = 'transparent'
            }

            let finalGlyph = glyph
            let drawX = stream.x
            let drawY = y

            // If the digital rain is over our logo boundary container, lock the coordinates down
            if(revealActive && currentLogoAlpha > 0.05) {
                const target = logoTargets.find(t => {
                    return (
                        Math.abs(t.x - stream.x) < 10 &&
                        Math.abs(t.y - y) < 10
                    )
                })

                if(target) {
                    finalGlyph = target.glyph
                    drawX = target.x
                    drawY = target.y

                    // Tie the intercepting rain droplets to match the dynamic fading opacity curves
                    ctx.fillStyle = `rgba(255, 48, 48, ${currentLogoAlpha})`
                    ctx.shadowColor = '#770000'
                    ctx.shadowBlur = 3
                }
            }

            ctx.fillText(finalGlyph, drawX, drawY)
        }

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
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)' 
    for(let y = 0; y < canvas.height; y += 3) {
        ctx.fillRect(0, y, canvas.width, 1)
    }

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
let revealDirection = 1
let currentLogoAlpha = 0.0 // Handle precise fade scaling states

function drawLogoReveal() {
    ctx.font = 'bold 11px monospace';
    ctx.textBaseline = 'top';

    // 1. Process Fade Transparency Frames Smoothly
    if (revealDirection === 1) {
        if (currentLogoAlpha < 0.92) currentLogoAlpha += 0.04; // Fade In Rate
    } else {
        if (currentLogoAlpha > 0) currentLogoAlpha -= 0.04;    // Fade Out Rate
    }

    // Guard trip to skip math loop if the text is completely transparent
    if (currentLogoAlpha <= 0) return;

    // 2. DYNAMICALLY MEASURE THE VISUAL FOOTPRINT FOR PERFECT ALIGNMENT
    let minCol = Infinity;
    let maxCol = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    const lineHeight = 13;

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

    // Establish absolute screen centers
    const centerOffsetX = (canvas.width / 2) - (visualWidth / 2);
    const centerOffsetY = (canvas.height / 2) - (visualHeight / 2);

    // 3. RENDER LOGO GLYPHS
    for (let i = 0; i < logoTargets.length; i++) {
        const target = logoTargets[i];

        const jitterX = (Math.random() - 0.5) * 1.5;
        const jitterY = (Math.random() - 0.5) * 1.5;
        const brightness = 120 + Math.random() * 60;

        ctx.fillStyle = `rgba(${brightness}, 20, 20, ${currentLogoAlpha})`;
        ctx.shadowColor = '#770000';
        ctx.shadowBlur = 2;

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
'                                                                                            ##                                                                                                  ',
'                                                                                           ###                                                                                                  ',
'                                                                                        ##**#                                                                                                   ',
'                                                                                      #*+*#######################                                                                               ',
'                                                                                   #*+++*##*+++++++++++++++++++++#                                                                              ',
'                                                                                 ##++++*##*+++++++++++++++++++++*#                                                                              ',
'      ######################################################################     #+++++*###+++++++########++++++########        ################     ################* *###########          ',
'    #*++++++++++++++++++++++*#*++++++++++++++++##*+++++++++++++++*#*+++++*#     *+++++*##*+++++++* #*++++++*#*+++++#       *++++++*#+++++++#    #++++++#**+++++*#  #**+++++++*##            ',
'  #*+++++++++++++++++++++++*#*++++++++++++++++*#*+++++++++++++++*#*+++++*#     #+++++*##*+++++++*#    #*++++++*##*+++++#     #*++++++##*+++++++*#  #*+++++* *+++++*###*++++++++*#               ',
'  ###********#*+++++*#*****##+++++*##########* #+++++*#*********##+++++*#######++++++##*+++++++*######*+++++++# #*+++++#   #*++++++*##*精度++++# #*+++++*##*+++++**++++++++*##                 ',
'            #*+++++*#     #*+++++++++++++++# #*+++++*#          #++++++++++++++++++*##*++++++++++++++++++++++#  #*+++++#  #*+++++*# #*++++++++++*#*+++++*##*++++++++++++++*#                    ',
'           #*++++++#      *+++++++++++++++* #*+++++*#          #++++++++++++++++++*##*+++++++++++++++++++++*#   #*+++++##*++++++*# #*+++++**+++++*+++++*##*++++++++++++*##                      ',
'          #*+++++*#      #++++++**********# *+++++*#          *++++++********+++++##*++++++++*************#     #*+++++#++++++*#  #*+++++*#*+++++++++++# *++++++*+++++++*#                      ',
'         #*++++++#      #++++++#############+++++*##########*#*+++++* #*+++++###+++++++*#                   #*+++++++++++*#  ##+++++*# #++++++++++* #++++++##**+++++++##                    ',
'        #*++++++#      #+++++++++++++++++##++++++++++++++++##*+++++*#    #*++++*##*+++++++*#                    #*+++++++++*#   #*++++++#   #++++++++*##++++++* #*+++++++*#                  ',
'       #*++++++#      *+++++++++++++++++#*++++++++++++++++##*+++++*#     *++++*##*+++++++*#                     #*++++++++* #*++++++#    #*++++++*##*+++++*#      #*+++++++##                ',
'      #*++++++#      ##****************###***************###*****##     #+++++# *+++++++*#                      ##*******#     ##*****#      #*****####*****##         ##*+++++*#               ',
'     #*+++++*#                                                          #*+++##*++++++*####################****#                                                           #**++++*#             ',
'    #*+++*##       ##################*+++++++++++++++++++++++++++++++++* *+*##*++++++**#*++++++++++++++++++++++++++++*# ##*++++++++++++++++++++++++++++++*******************##**+++*##*******###',
'    *++*#*#*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++* #*##*+++++###*+++++++++++++++++++++++++++++***++++++++++++++++++++++++++++++++++++++*****############# ##*++*#         ',
'  #*+*# ##############################++++++++++++++++++++++++++++++++++####*++++*##*+++++++++++++++++++++++++++**********+************#############                               ##***#       ',
' ####                                ############################*##***+*##*+++*###++++++++++++++*######*####* ###* ',
'###                                                                      #*++*#                                                                                                                 *##    ',
'#                                                                        *+*##                                                                                                                         ',
'                                                                        #*+*#                                                                                                                          ',
'                                                                       ##*#                                                                                                                            ',
'                                                                      ###                                                                                                                              ',
'                                                                      #                                                                                                                                '
]

let logoTargets = []

function buildLogoTargets() {
    logoTargets.length = 0; 
    ctx.font = 'bold 11px monospace'; 
    const lineHeight = 13; 

    let rawGlyphs = [];
    let minGridX = Infinity;
    let maxGridX = -Infinity;

    for (let row = 0; row < logoPattern.length; row++) {
        const line = logoPattern[row];
        for (let col = 0; col < line.length; col++) {
            const char = line[col];
            if (char && !/\s|\u00A0/.test(char)) {
                if (col < minGridX) minGridX = col;
                if (col > maxGridX) maxGridX = col;
                rawGlyphs.push({ gridX: col, gridY: row, glyph: char });
            }
        }
    }

    if (rawGlyphs.length === 0) return;

    const containerWidthPercent = 0.65; 
    const containerCenterAnchor = 0.50;  

    const containerWidth = canvas.width * containerWidthPercent;
    const containerHeight = logoPattern.length * lineHeight;

    const containerOffsetX = (canvas.width * containerCenterAnchor) - (containerWidth / 2);
    const containerOffsetY = (canvas.height / 2) - (containerHeight / 2);
    const totalLogoColumns = (maxGridX - minGridX);

    for (const item of rawGlyphs) {
        const localXPercent = totalLogoColumns > 0 ? (item.gridX - minGridX) / totalLogoColumns : 0;
        logoTargets.push({
            x: containerOffsetX + (localXPercent * containerWidth),
            y: containerOffsetY + (item.gridY * lineHeight),
            glyph: item.glyph
        });
    }
}

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

// Start drawing frames to the user screen immediately on load!
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
        }, 800) // Slight pause at the end of text streams before dropping matrix rain
    }
}, 220) // Clean pace for manual visual scan

// =========================
// LOGO REVEAL TIMER
// =========================
setInterval(() => {
    if(bootComplete && !revealActive) {
        revealActive = true;
        revealDirection = 1;

        // Display on screen for 9 seconds before initializing the clean exit alpha fade
        setTimeout(() => {
            revealDirection = -1; 
            
            // Allow 2 full seconds for transparency values to reach 0.0 before completely resetting structural loop switches
            setTimeout(() => {
                revealActive = false;
            }, 2000); 

        }, 9000); 
    }
}, 45000); 

// =========================
// RESIZE SUPPORT
// =========================
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    buildLogoTargets();
})

// =========================
// INTERACTION APP ESCAPE CLOSES
// =========================
let mouseX = null
let mouseY = null

document.addEventListener('mousemove', e => {
    if(mouseX === null) {
        mouseX = e.screenX
        mouseY = e.screenY
        return
    }
    const dx = Math.abs(e.screenX - mouseX)
    const dy = Math.abs(e.screenY - mouseY)
    if(dx > 5 || dy > 5) {
        require('electron').ipcRenderer.send('quit-app')
    }
})

document.addEventListener('mousedown', () => {
    require('electron').ipcRenderer.send('quit-app')
})

document.addEventListener('keydown', () => {
    require('electron').ipcRenderer.send('quit-app')
})