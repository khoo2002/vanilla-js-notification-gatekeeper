<script>

// --- SVG Icon Definitions ---
const lockSVGIcon = `<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="display: inline-block; vertical-align: -2px; margin-right: 4px; opacity: 0.8;"><path fill-rule="evenodd" clip-rule="evenodd" d="M6 0C4.34315 0 3 1.34315 3 3V4H2C1.44772 4 1 4.44772 1 5V11C1 11.5523 1.44772 12 2 12H10C10.5523 12 11 11.5523 11 11V5C11 4.44772 10.5523 4 10 4H9V3C9 1.34315 7.65685 0 6 0ZM4 3C4 1.89543 4.89543 1 6 1C7.10457 1 8 1.89543 8 3V4H4V3ZM2 5V11H10V5H2Z"/><path d="M6 7C5.72386 7 5.5 7.22386 5.5 7.5V8.5C5.5 8.77614 5.72386 9 6 9C6.27614 9 6.5 8.77614 6.5 8.5V7.5C6.5 7.22386 6.27614 7 6 7Z"/></svg>`;
const soundSVGIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="display: inline-block; vertical-align: -2px; margin-right: 4px; opacity: 0.8;"><path d="M3 9v6h4l5 5V4L7 9H3zm7-.17L7.83 11H5v2h2.83L10 15.17V8.83zM16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`; // Updated sound icon for clarity

// --- Helper function to inject CSS ---
function addGlobalStyles(css) {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = css;
  document.head.appendChild(styleSheet);
}

// --- Modal and Overlay Elements ---
let permissionOverlayElement = null;
let permissionModalElement = null;
let permissionModalContentElement = null;
const siteFriendlyName = window.location.hostname || "This site";

// --- State for sound check ---
let soundOutputConfirmed = false; // Assume false until successfully tested or retrieved from session

function initializeModalAndOverlay() {
  if (document.getElementById('permissionOverlay')) return;
  addGlobalStyles(`
    #permissionOverlay {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background-color: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px);
      z-index: 10000; display: none;
      align-items: center; justify-content: center;
    }
    #permissionModal {
      background-color: white; padding: 25px 35px; border-radius: 10px;
      box-shadow: 0 6px 25px rgba(0,0,0,0.3); z-index: 10001;
      text-align: center; width: 90%; max-width: 540px;
    }
    #permissionModal h3 { margin-top: 0; margin-bottom: 18px; color: #2c3e50; font-size: 1.3em; }
    #permissionModal p { margin-bottom: 18px; line-height: 1.6; color: #34495e; font-size: 1.0em; }
    #permissionModal .important-note { font-size: 0.85em; color: #7f8c8d; margin-top: -10px; margin-bottom: 20px; text-align: left;}
    #permissionModal ul { text-align: left; margin-left: 20px; padding-left: 0; margin-bottom: 20px;}
    #permissionModal li { margin-bottom: 8px; }
    #permissionModal button {
      padding: 13px 26px; border: none; border-radius: 7px;
      background-color: #3498db; color: white; cursor: pointer;
      font-size: 1.0em; margin-top: 10px; min-width: 170px;
      transition: background-color 0.2s ease;
    }
    #permissionModal button:hover { background-color: #2980b9; }
    #permissionModal button:disabled { background-color: #bdc3c7; cursor: not-allowed; }
    #permissionModal .spinner {
      border: 4px solid #f3f3f3; border-top: 4px solid #3498db;
      border-radius: 50%; width: 22px; height: 22px; animation: spin 1s linear infinite;
      display: inline-block; margin-left: 10px; vertical-align: middle;
    }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  `);
  permissionOverlayElement = document.createElement('div');
  permissionOverlayElement.id = 'permissionOverlay';
  document.body.appendChild(permissionOverlayElement);
  permissionModalElement = document.createElement('div');
  permissionModalElement.id = 'permissionModal';
  permissionOverlayElement.appendChild(permissionModalElement);
  permissionModalContentElement = document.createElement('div');
  permissionModalElement.appendChild(permissionModalContentElement);
}

function displayGuidanceModal(title, messageHTML, primaryButtonText, primaryButtonAction) {
  initializeModalAndOverlay();
  const buttonsHTML = `<button id="modalPrimaryButton">${primaryButtonText}</button>`;
  permissionModalContentElement.innerHTML = `
    <h3>${title}</h3>
    <div id="modalMessageContainer">${messageHTML}</div>
    <div>${buttonsHTML}</div>
  `;
  document.getElementById('modalPrimaryButton').onclick = primaryButtonAction;
  if (permissionOverlayElement) permissionOverlayElement.style.display = 'flex';
}

function hideSystemOverlay() {
  if (permissionOverlayElement) permissionOverlayElement.style.display = 'none';
}

// --- Permission State Checkers ---
function getNotificationPermissionState() {
  if (!("Notification" in window)) return 'unsupported';
  return Notification.permission;
}

// Sound "state" is now just a boolean flag updated by testing sound output
function getSoundOutputState() {
  // Check if HTMLAudioElement is supported at a basic level
  if (typeof AudioContext === "undefined" && typeof webkitAudioContext === "undefined") {
    // Web Audio API not supported
    return 'unsupported';
  }
  
  // Check session storage first for persistence within the session
  if (sessionStorage.getItem('soundOutputConfirmedSession') === 'true') {
    soundOutputConfirmed = true; // Update global flag if session says so
    return 'granted';
  }
  // If not in session, rely on the global flag (which is false on load, or after a failed test)
  return soundOutputConfirmed ? 'granted' : 'default';
}

function showLoadingInModal(message) {
  const messageContainer = document.getElementById('modalMessageContainer');
  const primaryButton = document.getElementById('modalPrimaryButton');
  if (messageContainer) messageContainer.innerHTML = `<p>${message} <span class="spinner"></span></p>`;
  if (primaryButton) primaryButton.disabled = true;
}

// --- Permission Request and Re-check Logic ---
async function attemptFullRecheck() {
  showLoadingInModal("Re-checking settings...");
  setTimeout(async () => {
    await initializePermissionGate(); // Re-evaluate everything
  }, 1500);
}

async function requestNativeNotificationPermission() {
  showLoadingInModal("Waiting for your response to the Notification prompt...");
  try {
    await Notification.requestPermission();
  } catch (err) {
    console.error("Error requesting Notification permission:", err);
  }
  await initializePermissionGate(); // Re-initialize to determine next step
}

async function testSoundOutput() {
  showLoadingInModal("Attempting to play a test sound...");

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) {
    console.error("Web Audio API not supported.");
    soundOutputConfirmed = false;
    sessionStorage.removeItem('soundOutputConfirmedSession');
    await initializePermissionGate();
    return;
  }

  const audioCtx = new AudioContext();
  
  // Check if audio context is running (it might be suspended initially due to autoplay policies)
  // User interaction (clicking the button) should allow it to resume.
  if (audioCtx.state === 'suspended') {
    await audioCtx.resume();
  }

  if (audioCtx.state === 'running') {
    try {
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine'; // A simple sine wave
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4 note
      gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime); // Set volume (0 to 1)
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5); // Fade out over 0.5s

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.5); // Play for 0.5 seconds

      // We assume success if no immediate error and context is running.
      // The actual audibility depends on user's system volume and site mute status.
      soundOutputConfirmed = true;
      sessionStorage.setItem('soundOutputConfirmedSession', 'true');
      console.log("Test sound played (or attempted).");

      // Give a moment for the sound to play before closing context and re-initializing
      setTimeout(async () => {
        audioCtx.close();
        await initializePermissionGate();
      }, 600); // Slightly longer than sound duration

    } catch (error) {
      console.error("Error playing test sound with Web Audio API:", error);
      soundOutputConfirmed = false;
      sessionStorage.removeItem('soundOutputConfirmedSession');
      audioCtx.close();
      await initializePermissionGate();
    }
  } else {
    console.error("AudioContext could not be started/resumed. Sound test failed.");
    soundOutputConfirmed = false;
    sessionStorage.removeItem('soundOutputConfirmedSession');
    // No need to close if it never started properly
    await initializePermissionGate();
  }
}


// --- Main Gating Logic ---
async function initializePermissionGate() {
  initializeModalAndOverlay();

  const notifPermission = getNotificationPermissionState();
  const soundState = getSoundOutputState(); 

  console.log(`Current Status - Notifications: ${notifPermission}, Sound Output Test: ${soundState}`);

  if (notifPermission === 'granted' && soundState === 'granted') {
    hideSystemOverlay();
    console.log("Notifications granted and Sound output test passed. System accessible.");
    return;
  }

  if (permissionOverlayElement) permissionOverlayElement.style.display = 'flex';

  if (notifPermission === 'unsupported' || soundState === 'unsupported') {
    let msg = "";
    if (notifPermission === 'unsupported' && soundState === 'unsupported') {
      msg = `Notifications and Web Audio API (for sound) are not supported by your browser.`;
    } else if (notifPermission === 'unsupported') {
      msg = `The Notification feature is not supported by your browser.`;
    } else { // soundState === 'unsupported'
      msg = `The Web Audio API (for sound playback) is not supported by your browser.`;
    }
    displayGuidanceModal(
      "Browser Feature Not Supported",
      `<p>${msg}</p><p>This system requires these features. Please try a modern browser.</p>`,
      "Understood",
      () => {}
    );
    return;
  }

  // 1. Notifications
  if (notifPermission !== 'granted') {
    if (notifPermission === 'denied') {
      const message = `
        <p><strong>Notifications are required.</strong> They are currently <strong>disabled</strong> for ${siteFriendlyName}.</p>
        <p class="important-note">Please go to your browser's settings (often via the ${lockSVGIcon} lock icon), find <strong>${siteFriendlyName}</strong>, and set Notification permission to "Allow".</p>
        <p>After enabling notifications, we'll check sound settings.</p>`;
      displayGuidanceModal("Enable Notifications to Continue", message, "Ok, I've enabled Notifications. Check Again.", attemptFullRecheck);
    } else { // 'default'
      const message = `
        <p>This system uses <strong>Notifications</strong> for important alerts.</p>
        <p class="important-note">Click "Setup Notifications" below. Your browser will ask for permission – please click "Allow". Afterwards, we'll check sound settings.</p>`;
      displayGuidanceModal("Notification Setup Required", message, "Setup Notifications", requestNativeNotificationPermission);
    }
    return;
  }

  // 2. Sound Output (Notifications are 'granted' at this point)
  if (soundState !== 'granted') { // 'default' means not yet tested or failed test
    const message = `
      <p>This system also uses <strong>Sound ${soundSVGIcon}</strong> for alerts and feedback. A short test sound will play when you click the button.</p>
      <p class="important-note">If you don't hear the test sound, please check the following:</p>
      <ul>
        <li>Is this site muted? (Right-click the browser tab and check for a "Unmute Site" option).</li>
        <li>Is your system volume turned up and not muted?</li>
        <li>In your browser's site settings (often via the ${lockSVGIcon} lock icon near the address bar), ensure "Sound" is set to "Allow" or "Automatic" for <strong>${siteFriendlyName}</strong>.</li>
      </ul>`;
    displayGuidanceModal("Sound Setup Required", message, "Play Test Sound & Continue", testSoundOutput);
    return;
  }
}

// --- Setup on Page Load ---
document.addEventListener('DOMContentLoaded', () => {
  // Initialize soundOutputConfirmed from sessionStorage at the very beginning of the session
  if (sessionStorage.getItem('soundOutputConfirmedSession') === 'true') {
    soundOutputConfirmed = true;
  }
  initializePermissionGate();
  console.log("Mandatory Notification & Sound Output Test script loaded.");
});


</script>
