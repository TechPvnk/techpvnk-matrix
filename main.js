let splash

const {
    app,
    BrowserWindow,
    screen,
    ipcMain
} = require('electron')

let windows = []

function createWindow() {

    splash = new BrowserWindow({

    fullscreen: true,

    frame: false,

    autoHideMenuBar: true,

    alwaysOnTop: true,

    transparent: false,

    icon: 'assets/icon.ico'
    })

    splash.loadFile('splash.html')

const displays =
    screen.getAllDisplays()

displays.forEach(display => {

    const win =
        new BrowserWindow({

            x: display.bounds.x,

            y: display.bounds.y,

            width: display.bounds.width,

            height: display.bounds.height,

            frame: false,

            fullscreen: true,

            autoHideMenuBar: true,

            show: false,

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

    setTimeout(() => {

        splash.close()

        windows.forEach(win => {

    win.show()
})

    }, 3500)
}

app.commandLine.appendSwitch(
    'disable-http-cache'
)

app.commandLine.appendSwitch(
    'disable-renderer-backgrounding'
)

app.commandLine.appendSwitch(
    'disable-background-networking'
)

app.commandLine.appendSwitch(
    'disable-breakpad'
)

app.commandLine.appendSwitch(
    'disable-sync'
)

app.commandLine.appendSwitch(
    'disable-translate'
)

app.whenReady().then(createWindow)

ipcMain.on('quit-app', () => {

    app.quit()
})