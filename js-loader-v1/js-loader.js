;(() => {
    /*****************
     *
     * WPGET JS Dependency Checker
     */
    const checkInterval = 200;
    const globals = {
        CHECK_TIMEOUT: 1600,
        IS_DEBUG: false,
        DEBUG_TYPE_LOG: 'log',
        DEBUG_TYPE_INFO: 'info',
        DEBUG_TYPE_WARN: 'warn',
        DEBUG_TYPE_ERROR: 'error'
    }

    const debug = (obj, type = globals.DEBUG_TYPE_LOG) => {
        if (globals.IS_DEBUG) {
            console[type](obj)
        }
    }

    /*
    Load Dynamic JS
     */
    let requested = []; //This is so we don't add the same object in quick succession.
    const loadJS = (windowObjectToTest, url, callback = null)=>{
        if(window[windowObjectToTest] || requested.contains(windowObjectToTest)){ return true }

        requested.push(windowObjectToTest);

        const scriptTag = document.createElement('script');
        scriptTag.src = url;
        document.body.appendChild(scriptTag);
        if(callback){
            scriptTag.onload(()=>{ callback()})
        }
    }

    /* Check for JS Dependencies on the JS Object */
    function checkDependenciesPromise(deps) {
        let elapsed = 0;
        const depsCount = deps.length;
        debug('First Dependency Check', globals.DEBUG_TYPE_INFO);
        return new Promise((resolve, reject) => {
            let timer = setInterval(() => {
                let depsFound = 0;
                deps.forEach(dep => {
                    if (window[dep]) {
                        depsFound++
                    }
                })
                if (depsFound === depsCount) {
                    debug('All dependencies found', globals.DEBUG_TYPE_INFO);
                    clearInterval(timer);
                    resolve('OK');
                } else {
                    elapsed += checkInterval;
                    if (elapsed > globals.CHECK_TIMEOUT) {
                        clearInterval(timer);
                        debug('Dependencies not found before timeout', globals.DEBUG_TYPE_ERROR);
                        reject('Missing dependencies');
                    }
                    debug('Next Check:' + elapsed, globals.DEBUG_TYPE_INFO);
                }
            }, checkInterval);
        });
    }

    async function checkDependencies(deps, eventNameToFireOnSuccess, eventNameToFireOnFail) {
        await checkDependenciesPromise(deps)
            .then(() => {
                const event = new CustomEvent(eventNameToFireOnSuccess);
                window.dispatchEvent(event);
            })
            .catch(e => {
                const event = new CustomEvent(
                    eventNameToFireOnFail,
                    {
                        detail: {
                            error: e
                        }
                    }
                );
                window.dispatchEvent(event);
            });
    }

    if (undefined === window.WPG_JS_Loader) (window.WPG_JS_Loader = {});
    window.WPG_JS_Loader.loadJS = loadJS;
    window.WPG_JS_Loader.globals = globals;
    window.WPG_JS_Loader.debug = debug;
    window.WPG_JS_Loader.checkDependencies = checkDependencies;
})();