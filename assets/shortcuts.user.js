// ==UserScript==
// @name         Video keyboard shortcuts
// @namespace    https://github.com/buzamahmooza
// @version      0.5
// @description  Adds keyboard shortcuts to HTML5 videos.
//               Left Click:  Toggle Pause/Play
//               F or dblClk: Toggle Fullscreen
//               SpaceBar:    Toggle Pause/Play
//               Left/Right:  Navigate back/forward
//               -,[ / =,]:   - / + Playback speed
//               Zero (0):    Reset playback speed
// @author       Faris Hijazi
// @match        *
// @include      *
// @updateURL    https://gist.github.com/buzamahmooza/b940c84b16f0b5719fa994d54c785cab/raw/
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

const alwaysFastPlayBack = true;
var vids = document.getElementsByTagName('video');
if (!vids) { console.log('No videos found.'); return; }

function observeDocument(callback) {
    callback(document.body);
    new MutationObserver(function(mutations) {
        for (var i = 0; i < mutations.length; i++) {
            if (!mutations[i].addedNodes.length) continue;
            callback(mutations[i].target);
        }
    }).observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });
}
// observeDocument(go);
go();

function go() {
    for (var i = 0; i < vids.length; i++) {
        var vid = vids[i];
        var getVideo = function() { return vid; };

        if (alwaysFastPlayBack)
            vid.playbackRate = GM_getValue('startingPlaybackRate', 1.7);

        console.log('Found video: ' + vid.src + '\nAdding video shortcuts.');
        // keyboard listener
        document.addEventListener('keydown', function(e) {
            let vid = getVideo();
            if (!e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
                switch (e.keyCode) {
                    case 221: // (])
                    case 187: // (=)
                        vid.playbackRate += 0.1;
                        e.preventDefault();
                        savePlaybackRate(vid.playbackRate);
                        break;
                    case 219: // ([)
                    case 189: // (-)
                        vid.playbackRate -= 0.1;
                        e.preventDefault();
                        savePlaybackRate(vid.playbackRate);
                        break;
                    case 48: // Alpha 0 (zero)
                        vid.playbackRate = 1;
                        console.log('reset playback speed');
                        savePlaybackRate(vid.playbackRate);
                        break;
                    case 70: // F
                        //Full screen
                        toggleFullScreen();
                        // getVideo().webkitEnterFullScreen();
                        console.log('Full screen');
                        break;
                }
                if (!/youtube.com/.test(document.location.href)) // skip this listener for youtube
                    switch (e.keyCode) {
                    case 75: // K
                    case 32: //Space bar
                        if (vid.paused)
                            vid.play();
                        else
                            vid.pause();
                        e.preventDefault();
                        break;
                    case 76: // L
                    case 39: // RightArrow
                        vid.currentTime += 10;
                        e.preventDefault();
                        break;
                    case 74: // J
                    case 37: // LeftArrow
                        vid.currentTime -= 10;
                        e.preventDefault();
                        break;
                    case 38: // UpArrow
                        vid.volume += 0.1;
                        e.preventDefault();
                        break;
                    case 40: // DownArrow
                        vid.volume -= 0.1;
                        e.preventDefault();
                        break;
                }
            }
        }, false);

        if (/youtube.com/.test(document.location.href)) {
            console.log("Skipping mouse listener in video cuz it's youtube");
            continue; // don't run on youtube (ruins the click functions)
        }
        // mouse click listener
        getVideo().addEventListener("click", function() {
            console.log('clicked on video');
            var vid = document.querySelector('video');
            if (vid.paused)
                vid.play();
            else
                vid.pause();
        });
        // mouse dblclick listener
        var isFullScreen;
        getVideo().addEventListener("dblclick", function() {
            console.log('double click');
            toggleFullScreen();
        }, false);
        var toggleFullScreen = function() {
            if (!isFullScreen) {
                getVideo().webkitEnterFullScreen();
                isFullScreen = true;
            } else {
                getVideo().webkitExitFullScreen();
                isFullScreen = false;
            }
        };
    }

}

function savePlaybackRate(newPlaybackRate) {
    if (newPlaybackRate)
        GM_setValue('startingPlaybackRate', newPlaybackRate);
}

//     console.log('Videos found:');
//     for(var j=0; j< vids.length ;j++){
//         console.log(vids[j].src);
//         console.log(vids[j].outerHTML);
//     }