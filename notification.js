// --- SVG Icon Definitions ---
const lockSVGIcon = `<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="display: inline-block; vertical-align: -2px; margin-right: 4px; opacity: 0.8;"><path fill-rule="evenodd" clip-rule="evenodd" d="M6 0C4.34315 0 3 1.34315 3 3V4H2C1.44772 4 1 4.44772 1 5V11C1 11.5523 1.44772 12 2 12H10C10.5523 12 11 11.5523 11 11V5C11 4.44772 10.5523 4 10 4H9V3C9 1.34315 7.65685 0 6 0ZM4 3C4 1.89543 4.89543 1 6 1C7.10457 1 8 1.89543 8 3V4H4V3ZM2 5V11H10V5H2Z"/><path d="M6 7C5.72386 7 5.5 7.22386 5.5 7.5V8.5C5.5 8.77614 5.72386 9 6 9C6.27614 9 6.5 8.77614 6.5 8.5V7.5C6.5 7.22386 6.27614 7 6 7Z"/></svg>`;
const soundSVGIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="display: inline-block; vertical-align: -2px; margin-right: 4px; opacity: 0.8;"><path d="M3 9v6h4l5 5V4L7 9H3zm7-.17L7.83 11H5v2h2.83L10 15.17V8.83zM16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`;
const checkboxSVGIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="display: inline-block; vertical-align: -2px; margin-right: 4px; opacity: 0.8;"><path d="M20 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM4 19V5h16l.002 14H4zm8.293-7.293l-2.293 2.293L8.586 12.5l-1.414 1.414L9.293 16H10v-.001l.707-.706 3.586-3.586-1.414-1.414L11 11.172l1.293-1.293z"/></svg>`;
const settingsSVGIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="display: inline-block; vertical-align: -2px; margin-right: 4px; opacity: 0.8;"><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69-.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61.22l2-3.46c.12-.22-.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/></svg>`;


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

// --- Configuration ---
const settingsPagePath = '/app/accounts/1/profile/settings'; 
const rootPagePath = '/'; 
const masterNotificationSwitchSelector = '#profile-settings-notifications button[role="switch"]';
const gateActivationPathPrefix = '/app/accounts/'; 

const checkboxIdsToConfirm = [
  'checkbox-assigned', 'checkbox-unassigned', 'checkbox-notme',
  'checkbox-condition-tab_is_inactive', 'checkbox-condition-conversations_are_read',
  'email_conversation_creation', 'push_conversation_creation',
  'email_conversation_assignment', 'push_conversation_assignment',
  'email_conversation_mention', 'push_conversation_mention',
  'email_assigned_conversation_new_message', 'push_assigned_conversation_new_message',
  'email_participating_conversation_new_message', 'push_participating_conversation_new_message'
];
// --- State variables ---
let soundOutputConfirmed = false;

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
      text-align: center; width: 90%; max-width: 580px;
    }
    #permissionModal h3 { margin-top: 0; margin-bottom: 18px; color: #2c3e50; font-size: 1.3em; }
    #permissionModal p { margin-bottom: 18px; line-height: 1.6; color: #34495e; font-size: 1.0em; }
    #permissionModal .important-note { font-size: 0.85em; color: #7f8c8d; margin-top: -10px; margin-bottom: 20px; text-align: left;}
    #permissionModal ul { text-align: left; margin-left: 20px; padding-left: 0; margin-bottom: 20px;}
    #permissionModal li { margin-bottom: 8px; }
    #permissionModal .error-list li { color: #c0392b; font-weight: bold; }
    #permissionModal .button-container { display: flex; flex-direction: column; gap: 10px; margin-top: 20px; }
    #permissionModal button {
      padding: 12px 20px; border: none; border-radius: 7px;
      background-color: #3498db; color: white; cursor: pointer;
      font-size: 1.0em; min-width: 170px;
      transition: background-color 0.2s ease;
    }
    #permissionModal button:hover { background-color: #2980b9; }
    #permissionModal button:disabled { background-color: #bdc3c7; cursor: not-allowed; }
    #permissionModal .secondary-action-button { background-color: #7f8c8d; }
    #permissionModal .secondary-action-button:hover { background-color: #6c757d; }
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

function acknowledgeAndHide() {
    console.log("User acknowledged incomplete setup and chose to proceed for this session.");
    sessionStorage.setItem('temporaryUnblockAcknowledged', 'true');
    hideSystemOverlay();
}

function displayGuidanceModal(title, messageHTML, primaryButtonText, primaryButtonAction, showAcknowledgeButton = false, acknowledgeButtonText = "Acknowledge & Continue") {
  initializeModalAndOverlay();
  let buttonsHTML = `<div class="button-container">`; // Use a container for better button layout
  buttonsHTML += `<button id="modalPrimaryButton">${primaryButtonText}</button>`;
  if (showAcknowledgeButton) {
    buttonsHTML += `<button id="modalAcknowledgeButton" class="secondary-action-button">${acknowledgeButtonText}</button>`;
  }
  buttonsHTML += `</div>`;

  permissionModalContentElement.innerHTML = `
    <h3>${title}</h3>
    <div id="modalMessageContainer">${messageHTML}</div>
    ${buttonsHTML}
  `;
  document.getElementById('modalPrimaryButton').onclick = primaryButtonAction;
  if (showAcknowledgeButton && document.getElementById('modalAcknowledgeButton')) {
    document.getElementById('modalAcknowledgeButton').onclick = acknowledgeAndHide;
  }
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

function getSoundOutputState() {
  if (typeof AudioContext === "undefined" && typeof webkitAudioContext === "undefined") return 'unsupported';
  if (sessionStorage.getItem('soundOutputConfirmedSession') === 'true') {
    soundOutputConfirmed = true;
    return 'granted';
  }
  return soundOutputConfirmed ? 'granted' : 'default';
}

function getSettingsConfirmationState() {
  if (sessionStorage.getItem('settingsConfirmedSession') === 'true') {
    if (!window.location.pathname.endsWith(settingsPagePath)) {
      return 'granted';
    }
    return 'granted';
  }

  if (!window.location.pathname.endsWith(settingsPagePath)) {
    return 'redirect_required';
  }

  const masterSwitch = document.querySelector(masterNotificationSwitchSelector);
  if (!masterSwitch || masterSwitch.getAttribute('aria-checked') !== 'true') {
    return 'default';
  }
  const allCheckboxesChecked = checkboxIdsToConfirm.every(id => {
    const checkbox = document.getElementById(id);
    return checkbox && checkbox.checked;
  });
  return allCheckboxesChecked ? 'granted_on_page' : 'default';
}


function showLoadingInModal(message) {
  const messageContainer = document.getElementById('modalMessageContainer');
  const primaryButton = document.getElementById('modalPrimaryButton');
  const acknowledgeButton = document.getElementById('modalAcknowledgeButton');

  if (messageContainer) messageContainer.innerHTML = `<p>${message} <span class="spinner"></span></p>`;
  if (primaryButton) primaryButton.disabled = true;
  if (acknowledgeButton) acknowledgeButton.style.display = 'none'; // Hide acknowledge during loading
}

// --- Permission Request and Re-check Logic ---
async function attemptFullRecheck() {
  showLoadingInModal("Re-checking settings and permissions...");
  setTimeout(async () => {
    await initializePermissionGate();
  }, 1500);
}

async function requestNativeNotificationPermission() {
  showLoadingInModal("Waiting for your response to the Notification prompt...");
  try {
    await Notification.requestPermission();
  } catch (err) {
    console.error("Error requesting Notification permission:", err);
  }
  await initializePermissionGate();
}

async function testSoundOutput() {
  showLoadingInModal("Attempting to play a test sound...");
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) {
    soundOutputConfirmed = false;
    sessionStorage.removeItem('soundOutputConfirmedSession');
    await initializePermissionGate();
    return;
  }
  const audioCtx = new AudioContext();
  if (audioCtx.state === 'suspended') {
    try { await audioCtx.resume(); } catch (e) { console.warn("AudioContext resume failed:", e); }
  }

  if (audioCtx.state === 'running') {
    try {
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.5);
      soundOutputConfirmed = true;
      sessionStorage.setItem('soundOutputConfirmedSession', 'true');
      setTimeout(async () => { if(audioCtx.state !== 'closed') audioCtx.close(); await initializePermissionGate(); }, 600);
    } catch (error) {
      soundOutputConfirmed = false;
      sessionStorage.removeItem('soundOutputConfirmedSession');
      if(audioCtx.state !== 'closed') audioCtx.close();
      await initializePermissionGate();
    }
  } else {
    soundOutputConfirmed = false;
    sessionStorage.removeItem('soundOutputConfirmedSession');
    await initializePermissionGate();
  }
}

async function confirmSettingsCheckedAndRedirect() {
    if (!window.location.pathname.endsWith(settingsPagePath)) {
        await initializePermissionGate(); 
        return;
    }

    showLoadingInModal("Applying and verifying settings...");
    await new Promise(resolve => setTimeout(resolve, 50)); 

    const masterSwitch = document.querySelector(masterNotificationSwitchSelector);
    if (masterSwitch && masterSwitch.getAttribute('aria-checked') !== 'true') {
        masterSwitch.click(); 
        await new Promise(resolve => setTimeout(resolve, 50)); 
    }

    const midpoint = Math.ceil(checkboxIdsToConfirm.length / 2);
    let currentCheckbox = 0;

    for (let i = 0; i < midpoint; i++) {
        const id = checkboxIdsToConfirm[currentCheckbox++];
        const checkbox = document.getElementById(id);
        if (checkbox && !checkbox.checked) {
            checkbox.checked = true;
            checkbox.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }
    await new Promise(resolve => setTimeout(resolve, 500));
    for (let i = 0; i < checkboxIdsToConfirm.length - midpoint; i++) {
        const id = checkboxIdsToConfirm[currentCheckbox++];
        const checkbox = document.getElementById(id);
        if (checkbox && !checkbox.checked) {
            checkbox.checked = true;
            checkbox.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }
    await new Promise(resolve => setTimeout(resolve, 500));

    const isMasterSwitchOn = masterSwitch && masterSwitch.getAttribute('aria-checked') === 'true';
    const stillUncheckedItems = []; 
    if (!isMasterSwitchOn) {
        stillUncheckedItems.push({ id: 'masterSwitch', labelText: "The main 'Notification preferences' switch" });
    }
    checkboxIdsToConfirm.forEach(id => {
        const checkbox = document.getElementById(id);
        if (!(checkbox && checkbox.checked)) {
            const label = document.querySelector(`label[for='${id}']`);
            stillUncheckedItems.push({ id: id, labelText: label ? label.textContent.trim() : id });
        }
    });

    if (isMasterSwitchOn && stillUncheckedItems.length === 0) {
        sessionStorage.setItem('settingsConfirmedSession', 'true');
        window.location.href = rootPagePath;
    } else {
        sessionStorage.removeItem('settingsConfirmedSession');
        let specificIssuesMessage = "<p>The following settings still require your attention:</p><ul class='error-list'>";
        stillUncheckedItems.forEach(item => {
            specificIssuesMessage += `<li><strong>${item.labelText}</strong> must be enabled/checked.</li>`;
        });
        specificIssuesMessage += "</ul><p>Please manually adjust these settings or click below to try applying them again.</p>";
        
        displayGuidanceModal(
            "Settings Still Required",
            specificIssuesMessage,
            "Try Applying Settings Again", 
            confirmSettingsCheckedAndRedirect,
            true, // Show acknowledge button
            "Acknowledge & Continue Anyway"
        );
    }
}


// --- Main Gating Logic ---
async function initializePermissionGate() {
  if (sessionStorage.getItem('temporaryUnblockAcknowledged') === 'true') {
    console.log("User previously acknowledged temporary unblock for this session. Bypassing gate.");
    hideSystemOverlay(); // Ensure overlay is hidden
    return; 
  }
  
  initializeModalAndOverlay();

  const notifPermission = getNotificationPermissionState();
  const soundState = getSoundOutputState();
  const settingsState = getSettingsConfirmationState();

  console.log(`Current Status - Notifications: ${notifPermission}, Sound Output: ${soundState}, Settings: ${settingsState}`);

  if (notifPermission === 'granted' && soundState === 'granted' && settingsState === 'granted') {
    hideSystemOverlay();
    console.log("All permissions and settings confirmed. System accessible.");
    return;
  }

  if (permissionOverlayElement && permissionOverlayElement.style.display !== 'flex') {
      if (!(notifPermission === 'granted' && soundState === 'granted' && settingsState === 'granted')) {
          permissionOverlayElement.style.display = 'flex';
      }
  }

  let unsupportedFeature = "";
  if (notifPermission === 'unsupported') unsupportedFeature = "Notifications";
  else if (soundState === 'unsupported') unsupportedFeature = "Web Audio API (for sound)";

  if (unsupportedFeature) {
    displayGuidanceModal(
      "Browser Feature Not Supported",
      `<p>The <strong>${unsupportedFeature}</strong> feature is not supported by your browser.</p><p>This system requires this feature. Please try a modern browser.</p>`,
      "Understood",
      () => {}, // No primary action if unsupported, just acknowledge
      true, // Show acknowledge button
      "Acknowledge & Continue (Limited Functionality)"
    );
    return;
  }

  // 1. Notifications
  if (notifPermission !== 'granted') {
    if (notifPermission === 'denied') {
      const message = `
        <p><strong>Notifications are required.</strong> They are currently <strong>disabled</strong> for ${siteFriendlyName}.</p>
        <p class="important-note">Please go to your browser's settings (often via the ${lockSVGIcon} lock icon), find <strong>${siteFriendlyName}</strong>, and set Notification permission to "Allow".</p>
        <p>After enabling notifications, we'll proceed with other setups.</p>`;
      displayGuidanceModal("Enable Notifications to Continue", message, "Ok, I've enabled Notifications. Check Again.", attemptFullRecheck, true, "Proceed without Notifications");
    } else { // 'default'
      const message = `
        <p>This system uses <strong>Notifications</strong> for important alerts.</p>
        <p class="important-note">Click "Setup Notifications" below. Your browser will ask for permission – please click "Allow". Afterwards, we'll continue with other setups.</p>`;
      displayGuidanceModal("Notification Setup Required", message, "Setup Notifications", requestNativeNotificationPermission, true, "Proceed without Notifications");
    }
    return;
  }

  // 2. Sound Output (Notifications are 'granted' at this point)
  if (soundState !== 'granted') {
    const message = `
      <p>This system also uses <strong>Sound ${soundSVGIcon}</strong> for alerts and feedback. A short test sound will play when you click the button.</p>
      <p class="important-note">If you don't hear the test sound, please check the following:</p>
      <ul>
        <li>Is this site muted? (Right-click the browser tab and check for a "Unmute Site" option).</li>
        <li>Is your system volume turned up and not muted?</li>
        <li>In your browser's site settings (often via the ${lockSVGIcon} lock icon near the address bar), ensure "Sound" is set to "Allow" or "Automatic" for <strong>${siteFriendlyName}</strong>.</li>
      </ul>
      <p>After sound setup, we'll confirm some alert settings.</p>`;
    displayGuidanceModal("Sound Setup Required", message, "Play Test Sound & Continue", testSoundOutput, true, "Proceed without Sound Alerts");
    return;
  }

  // 3. Settings Confirmation (Notifications and Sound are 'granted' at this point)
  if (settingsState !== 'granted') {
    if (settingsState === 'redirect_required') {
        const message = `
            <p>The final step is to configure your <strong>Alert Settings ${settingsSVGIcon}</strong>.</p>
            <p class="important-note">Please navigate to the settings page to complete this setup.</p>`;
        displayGuidanceModal(
            "Navigate to Settings",
            message,
            "Go to My Settings Page",
            () => { window.location.href = settingsPagePath; },
            true, // Show acknowledge button
            "Continue with Default/Current Settings"
        );
    } else { // 'default' or 'granted_on_page'
        const message = `
            <p>Please configure your <strong>Alert Settings ${settingsSVGIcon}</strong> on this page.</p>
            <p class="important-note">Ensure the main "Notification preferences" switch (usually at the top of notification settings) is <strong>ON</strong>, and check all the following required alert options. Clicking the button below will attempt to set these for you if they aren't already.</p>
            <ul>
                <li>A new conversation is created (Email & Push)</li>
                <li>A conversation is assigned to you (Email & Push)</li>
                <li>You are mentioned in a conversation (Email & Push)</li>
                <li>A new message is created in an assigned conversation (Email & Push)</li>
                <li>A new message is created in a participating conversation (Email & Push)</li>
                <li>Alert for: My assigned conversations</li>
                <li>Alert for: Unassigned conversations</li>
                <li>Alert for: Open conversations assigned to others</li>
                <li>Condition: Send audio alerts only if the browser window is not active</li>
                <li>Condition: Send alerts every 30s until all the assigned conversations are read</li>
            </ul>
            <p>Once you're ready, click the button below to apply and continue to the main application.</p>`;
        displayGuidanceModal(
            "Confirm Alert Settings", 
            message, 
            "Apply Settings & Continue", 
            confirmSettingsCheckedAndRedirect,
            true, // Show acknowledge button
            "Use Site with Current Settings"
            );
    }
    return;
  }
}

// --- Setup on Page Load ---
document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname;

  if (currentPath.startsWith(gateActivationPathPrefix) || currentPath.endsWith(settingsPagePath)) {
    console.log(`Current path ${currentPath} requires permission/settings check. Initializing gate.`);

    if (sessionStorage.getItem('soundOutputConfirmedSession') === 'true') {
      soundOutputConfirmed = true;
    }
    initializePermissionGate(); // This will now check for 'temporaryUnblockAcknowledged' first
    console.log("Mandatory Notification, Sound & Settings script loaded and active.");
  } else {
    console.log(`Current path ${currentPath} does not require permission/settings gate. Gate not activated.`);
    const overlay = document.getElementById('permissionOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
  }
});
