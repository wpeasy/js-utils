### JS Loader
This library can be used to load JavaScript libraries dynamically.

You then run a dependency check to ensure all wanted libraries are loaded. before initialising your code.

## V-0.0.1 - initial version
CDN URL: https://wpeasy.b-cdn.net/js-loader-v1/js-loader.min.js

Ensure this library is loaded early.

### Usage:
Example usage to load two GSAP Libraries and wait for them to load before initialising code
<pre><code>
    const {
        loadJS,
        checkDependencies, 
        debug, 
        globals
    } = window.WPG_JS_Loader;
    globals.IS_DEBUG = true; //enable outputting info to console
    globals.CHECK_TIMEOUT = 2000; //Wait up to 2 seconds for dependencies before dispatching an error. Defaults to 1600.


    //loadJS(windowPropertyName, URl, optionalCallbackOnLoad)
    loadJS('gsap', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.10.4/gsap.min.js');
    loadJS('ScrollTrigger', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.10.4/ScrollTrigger.min.js');

    //Asynchronously Check dependencies have loaded
    //checkDependencies(DependencyArray, successEventName, failEventName);
    checkDependencies(['ScrollTrigger', 'gsap',], 'success/ScrollTrigger/gsap', 'failed/ScrollTrigger/gsap');

    
    //Log an error if dependencies haven't loaded before the timeout
    window.addEventListener('failed/ScrollTrigger/gsap', (e) => {
        console.error(e.detail);
    });

    window.addEventListener('success/ScrollTrigger/gsap', () => {
        gsap.registerPlugin(ScrollTrigger);
        //Rest of GSAP code here
    });

</code></pre>

