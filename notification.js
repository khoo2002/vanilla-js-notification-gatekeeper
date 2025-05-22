
  // --- SVG Icon Definition ---
  const lockSVGIcon = `<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="display: inline-block; vertical-align: -2px; margin-right: 4px; opacity: 0.8;"><path fill-rule="evenodd" clip-rule="evenodd" d="M6 0C4.34315 0 3 1.34315 3 3V4H2C1.44772 4 1 4.44772 1 5V11C1 11.5523 1.44772 12 2 12H10C10.5523 12 11 11.5523 11 11V5C11 4.44772 10.5523 4 10 4H9V3C9 1.34315 7.65685 0 6 0ZM4 3C4 1.89543 4.89543 1 6 1C7.10457 1 8 1.89543 8 3V4H4V3ZM2 5V11H10V5H2Z"/><path d="M6 7C5.72386 7 5.5 7.22386 5.5 7.5V8.5C5.5 8.77614 5.72386 9 6 9C6.27614 9 6.5 8.77614 6.5 8.5V7.5C6.5 7.22386 6.27614 7 6 7Z"/></svg>`;

  // --- Helper function to inject CSS ---
  function addGlobalStyles(css) {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);
  }

  // --- Modal and Overlay Elements ---
  let notificationOverlayElement = null;
  let notificationModalElement = null;
  let notificationModalContentElement = null;
  const siteFriendlyName = window.location.hostname || "This site";

  function initializeModalAndOverlay() {
    if (document.getElementById('notificationPermissionOverlay')) return;
    addGlobalStyles(`
      #notificationPermissionOverlay {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background-color: rgba(0, 0, 0, 0.75);
        backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px);
        z-index: 10000; display: none;
        align-items: center; justify-content: center;
      }
      #notificationPermissionModal {
        background-color: white; padding: 25px 35px; border-radius: 10px;
        box-shadow: 0 6px 25px rgba(0,0,0,0.3); z-index: 10001;
        text-align: center; width: 90%; max-width: 520px;
      }
      #notificationPermissionModal h3 { margin-top: 0; margin-bottom: 18px; color: #2c3e50; font-size: 1.4em; }
      #notificationPermissionModal p { margin-bottom: 22px; line-height: 1.7; color: #34495e; font-size: 1.05em; }
      #notificationPermissionModal .important-note { font-size: 0.9em; color: #7f8c8d; margin-top: -12px; margin-bottom: 22px; }
      #notificationPermissionModal button {
        padding: 14px 28px; border: none; border-radius: 7px;
        background-color: #3498db; color: white; cursor: pointer;
        font-size: 1.05em; margin-top: 12px; min-width: 180px;
        transition: background-color 0.2s ease;
      }
      #notificationPermissionModal button:hover { background-color: #2980b9; }
      #notificationPermissionModal button:disabled { background-color: #bdc3c7; cursor: not-allowed; }
      #notificationPermissionModal .secondary-action-button { background-color: #95a5a6; margin-left: 10px; }
      #notificationPermissionModal .secondary-action-button:hover { background-color: #7f8c8d; }
      #notificationPermissionModal .spinner {
        border: 4px solid #f3f3f3; border-top: 4px solid #3498db;
        border-radius: 50%; width: 24px; height: 24px; animation: spin 1s linear infinite;
        display: inline-block; margin-left: 10px; vertical-align: middle;
      }
      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    `);
    notificationOverlayElement = document.createElement('div');
    notificationOverlayElement.id = 'notificationPermissionOverlay';
    document.body.appendChild(notificationOverlayElement);
    notificationModalElement = document.createElement('div');
    notificationModalElement.id = 'notificationPermissionModal';
    notificationOverlayElement.appendChild(notificationModalElement);
    notificationModalContentElement = document.createElement('div');
    notificationModalElement.appendChild(notificationModalContentElement);
  }

  function displayGuidanceModal(title, messageHTML, primaryButtonText, primaryButtonAction, showSecondaryButton = false, secondaryButtonText = "", secondaryButtonAction = null) {
    initializeModalAndOverlay();
    let buttonsHTML = `<button id="modalPrimaryButton">${primaryButtonText}</button>`;
    if (showSecondaryButton) {
      buttonsHTML += `<button id="modalSecondaryButton" class="secondary-action-button">${secondaryButtonText}</button>`;
    }
    notificationModalContentElement.innerHTML = `
      <h3>${title}</h3>
      <div id="modalMessageContainer">${messageHTML}</div>
      <div>${buttonsHTML}</div>
    `;
    document.getElementById('modalPrimaryButton').onclick = primaryButtonAction;
    if (showSecondaryButton && document.getElementById('modalSecondaryButton')) {
      document.getElementById('modalSecondaryButton').onclick = secondaryButtonAction;
    }
    if (notificationOverlayElement) notificationOverlayElement.style.display = 'flex';
  }

  function hideSystemOverlay() {
    if (notificationOverlayElement) notificationOverlayElement.style.display = 'none';
  }

  function getNotificationPermissionState() {
    if (!("Notification" in window)) return 'unsupported';
    return Notification.permission;
  }

  function updatePageUIAfterPermissionChange(permission) {
    // No specific page elements to update in this version.
  }

  function showLoadingInModal(message, showButton = false, buttonText = "", buttonAction = null) {
    const messageContainer = document.getElementById('modalMessageContainer');
    const primaryButton = document.getElementById('modalPrimaryButton');
    const secondaryButton = document.getElementById('modalSecondaryButton');

    if(messageContainer) messageContainer.innerHTML = `<p>${message} <span class="spinner"></span></p>`;
    
    if(primaryButton) primaryButton.style.display = showButton ? 'inline-block' : 'none';
    if(secondaryButton) secondaryButton.style.display = 'none';

    if(showButton && primaryButton) {
        primaryButton.textContent = buttonText;
        primaryButton.onclick = buttonAction;
        primaryButton.disabled = false;
    } else if (primaryButton) {
        primaryButton.disabled = true;
    }
  }

  function attemptPermissionRecheck() {
    showLoadingInModal("Re-checking permission status...");
    setTimeout(() => {
        const currentPermission = getNotificationPermissionState();
        if (currentPermission === 'granted') {
            displayGuidanceModal(
                "Notifications Successfully Enabled!",
                `<p>Great! Notifications are active. You can now use the system.</p>`,
                "Continue to System",
                hideSystemOverlay
            );
        } else {
            const recheckGuidanceMessage = `
                <p>It appears notifications are still disabled for <strong>${siteFriendlyName}</strong>.</p>
                <p class="important-note">This system requires notifications. Please ensure you've gone to your browser's site settings (often by clicking the ${lockSVGIcon} lock icon near the website address), found <strong>${siteFriendlyName}</strong>, and set its notification permission to "Allow".</p>
                <p>If you've just changed it, sometimes the browser needs a moment or a page refresh to recognize the new setting.</p>`;
            displayGuidanceModal(
                "Action Still Required",
                recheckGuidanceMessage,
                "Ok. I have enabled it. Please check.",
                attemptPermissionRecheck,
                false
            );
        }
    }, 2000);
  }

  function requestNativePermission() {
    showLoadingInModal("Waiting for your response in the browser prompt...");
    Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
            displayGuidanceModal(
                "Notifications Enabled!",
                `<p>Excellent! Notifications are active. You can now proceed.</p>`,
                "Start Using System",
                hideSystemOverlay
            );
        } else if (permission === "denied") {
            const deniedGuidanceMessage = `
                <p>You have chosen not to allow notifications. However, they are required for this system.</p>
                <p class="important-note">To proceed, please go to your browser's notification settings (often by clicking the ${lockSVGIcon} lock icon near the website address) for <strong>${siteFriendlyName}</strong>, set the permission to "Allow", and then click the button below.</p>`;
            displayGuidanceModal(
                "Notifications Required",
                deniedGuidanceMessage,
                "Ok. I have enabled it. Please check.",
                attemptPermissionRecheck
            );
        } else {
            presentDefaultStateGuidance();
        }
    }).catch(function(err) {
        console.error("Error during Notification.requestPermission():", err);
        displayGuidanceModal(
            "Error Requesting Permission",
            "<p>An unexpected error occurred. Please refresh the page. If the problem persists, ensure your browser is up to date.</p>",
            "Refresh Page",
            () => window.location.reload(),
            false
        );
    });
  }

  function presentDefaultStateGuidance() {
    const prePromptMessage = `
        <p>To use this system effectively, browser notifications are required.</p>
        <p class="important-note">Click "Setup Notifications" below. Your browser will then ask for your permission – please click <strong>"Allow"</strong>.</p>`;
    displayGuidanceModal(
        "Notification Setup Required",
        prePromptMessage,
        "Setup Notifications",
        requestNativePermission,
        false
    );
  }

  function initializeNotificationGate() {
    initializeModalAndOverlay();
    const currentPermission = getNotificationPermissionState();

    if (currentPermission === 'granted') {
        hideSystemOverlay();
        console.log("Notifications are granted. System accessible.");
        return;
    }
    
    if (notificationOverlayElement) notificationOverlayElement.style.display = 'flex';

    if (currentPermission === 'unsupported') {
        displayGuidanceModal(
            "Browser Not Supported",
            `<p>This system requires browser notifications to function, but your current browser does not support them or they are disabled globally.</p><p>Please try a modern browser like Chrome, Firefox, Edge, or Safari with notifications enabled.</p>`,
            "Understood (System Inaccessible)",
            () => { /* No action */ },
            false
        );
    } else if (currentPermission === 'denied') {
        const deniedGuidanceMessage = `
            <p>Notifications are required to use this system. They are currently <strong>disabled</strong> for <strong>${siteFriendlyName}</strong> in your browser.</p>
            <p class="important-note">Please go to your browser's notification settings (often found by clicking the ${lockSVGIcon} lock icon near the website address, then 'Site Settings' or 'Permissions'), find <strong>${siteFriendlyName}</strong>, and change its notification permission to "Allow".</p>`;
        displayGuidanceModal(
            "Enable Notifications to Continue",
            deniedGuidanceMessage,
            "Ok. I have enabled it. Please check.",
            attemptPermissionRecheck
        );
    } else if (currentPermission === 'default') {
        presentDefaultStateGuidance();
    }
  }

  // --- Setup on Page Load ---
  document.addEventListener('DOMContentLoaded', () => {
    initializeNotificationGate();
    console.log("Mandatory notification script loaded. Gate active if permission not granted.");
  });
