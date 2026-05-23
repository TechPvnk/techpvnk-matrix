let splash

const {
    app,
    BrowserWindow,
    screen,
    ipcMain
} = require('electron')

let windows = []

function createWindow() {
    // 1. Initialize the boot splash screen window on the primary display
    splash = new BrowserWindow({
        fullscreen: true,
        frame: false,
        autoHideMenuBar: true,
        alwaysOnTop: true,
        transparent: false,
        backgroundColor: '#000000', // Keeps screen blank while loading HTML asset
        icon: 'assets/icon.ico'
    })

    splash.loadFile('splash.html')

    // 2. Map and spawn instances across all active user monitors
    const displays = screen.getAllDisplays()

    displays.forEach(display => {
        const win = new BrowserWindow({
            x: display.bounds.x,
            y: display.bounds.y,
            width: display.bounds.width,
            height: display.bounds.height,
            frame: false,
            fullscreen: true,
            autoHideMenuBar: true,
            show: false, // Intentionally kept hidden in background memory
            backgroundColor: '#000000',
            icon: 'assets/icon.ico',
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            }
        })

        win.loadFile('index.html')
        windows.push(win)
    })

    // 3. UNIFIED LIFECYCLE CONTROLLER
    // Wait exactly 3.5 seconds for the splash sequence to play out completely...
    setTimeout(() => {
        if (!splash.isDestroyed()) {
            splash.close()
        }

        // Show all monitor matrix matrices simultaneously AND reload their page contents
        // This forces renderer.js to execute its frame-0 boot sequence right as it appears!
        windows.forEach(win => {
            win.show()
            win.webContents.reload() // Clears background execution lag
        })
    }, 3500)
}

// Optimization layout flags to maximize frame delivery stability
app.commandLine.appendSwitch('disable-http-cache')
app.commandLine.appendSwitch('disable-renderer-backgrounding')
app.commandLine.appendSwitch('disable-background-networking')
app.commandLine.appendSwitch('disable-breakpad')
app.commandLine.appendSwitch('disable-sync')
app.commandLine.appendSwitch('disable-translate')

app.whenReady().then(createWindow)

ipcMain.on('quit-app', () => {
    app.quit()
})