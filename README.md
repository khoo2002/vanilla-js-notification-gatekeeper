Check the demo https://khoo2002.github.io/vanilla-js-notification-gatekeeper
# Mandatory Notification Gate

A lightweight, vanilla JavaScript snippet that enforces mandatory browser notification permissions before allowing users to access page content. It uses a clear, guided modal dialog to manage the permission process, ensuring users enable notifications to proceed.

## Features

* **Mandatory Permissions:** Gates access to your site/application until browser notification permissions are granted.
* **Guided Modal UI:** Provides a user-friendly modal dialog to explain why notifications are needed and how to enable them.
* **Handles All Permission States:**
    * **Default:** Prompts the user to allow notifications via the browser's native request.
    * **Denied:** Instructs the user on how to manually change the permission in their browser settings and includes a "re-check" mechanism.
    * **Granted:** Allows immediate access to the site.
    * **Unsupported:** Informs the user if their browser doesn't support notifications.
* **Persistent Guidance:** If permission is not granted, the modal overlay remains, blocking interaction with the main page.
* **Visual Cues:** Includes an SVG lock icon in guidance messages for better visual understanding.
* **No Dependencies:** Written in pure, vanilla JavaScript. No external libraries are required.
* **Single Script Solution:** Designed to be easily dropped into your HTML.

## How to Use

This script is designed to be a self-contained snippet.

1.  **Copy the Code:** Take the entire JavaScript code provided.
2.  **Paste into your HTML:**
    * You can place the `<script>` tag containing this code within the `<head>` section of your HTML document, as it uses `DOMContentLoaded` to ensure the DOM is ready before execution.
    * Alternatively, for a common best practice, you can place it just before the closing `</body>` tag.

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>My Awesome App</title>
        <script>
            // PASTE THE ENTIRE JAVASCRIPT SNIPPET HERE
            // (Including the const lockSVGIcon = ... down to the closing }); of DOMContentLoaded)
        </script>
        <style>
            /* Your site's main styles */
            body { font-family: sans-serif; }
        </style>
    </head>
    <body>
        <h1>Welcome to My Awesome App!</h1>
        <p>This content will be gated until notifications are enabled.</p>

        <!-- 
        <script>
            // PASTE THE ENTIRE JAVASCRIPT SNIPPET HERE
        </script>
        -->
    </body>
    </html>
    ```

3.  **That's it!** The script will automatically run when the page loads, check notification permissions, and display the guidance modal if necessary.

## User Experience Flow

1.  **Page Load:**
    * If notifications are **already granted**, the user can access the page content immediately. The modal system remains hidden.
    * If notifications are **unsupported** by the browser, a modal informs the user, and access remains gated.
    * If notification permission is **denied**, a modal appears, explaining that notifications are required and guiding the user to their browser settings (with a lock icon cue) to change the permission. It provides a button like "Ok. I have enabled it. Please check."
    * If notification permission is **default** (not yet set), a modal appears, explaining the need for notifications and prompting the user to click a button which will trigger the browser's native permission request.

2.  **Interaction with Modal (Denied State):**
    * User clicks "Ok. I have enabled it. Please check."
    * The script re-checks the permission.
    * If still denied, the modal reappears with further guidance.
    * If granted, a success message appears, and the modal overlay is removed, allowing access.

3.  **Interaction with Modal (Default State):**
    * User clicks "Setup Notifications" (or similar).
    * The browser's native notification permission prompt appears.
    * If the user allows, a success message is shown, and the overlay is removed.
    * If the user denies via the native prompt, the script transitions to the "denied" state flow.
    * If the user dismisses the native prompt, the initial "default" state modal is shown again.

## Customization

While the script is designed to be plug-and-play, you can customize:

* **Text Content:** Modify the messages within the `displayGuidanceModal` calls and other string literals to better suit your application's tone and specific needs.
* **Styling:** The CSS for the modal and overlay is injected directly by the script. You can modify these styles within the `addGlobalStyles` function if needed.
* **`siteFriendlyName`:** This constant is used in messages. It defaults to `window.location.hostname` but can be changed to a more user-friendly name for your site.

## License

This project is open source and available under the [MIT License](LICENSE.md). (You would need to create a LICENSE.md file with the MIT license text if you choose this). Or simply state "Feel free to use and modify this script as needed." if you don't want a formal license.
