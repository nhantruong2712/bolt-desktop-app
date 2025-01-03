window.electron.getAppPath().then((appPath) => {
    console.log('App path is:', appPath); // The path will be printed in the renderer process
});