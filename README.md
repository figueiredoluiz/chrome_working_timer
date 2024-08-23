# Working Hours Timer Chrome Extension

## Overview

The **Working Hours Timer** is a simple and intuitive Chrome extension designed to help users track their working hours. It features a start/stop timer, an hourly sound alert option, and a badge display on the Chrome toolbar showing the elapsed time in hours and minutes.

## Features

- **Start/Stop/Pause Timer**: Easily control the timer with intuitive buttons.
- **Hourly Sound Alert**: Option to play a gentle sound every hour to remind you of the elapsed time.
- **Badge Display**: Displays the current time in `h:mm` format on the Chrome toolbar icon.
- **Persistent State**: The timer's state (running/paused) and elapsed time persist even after closing the browser or the popup.

## Usage

1. Click on the extension icon in the Chrome toolbar to open the timer popup.
2. Use the **Start** button to begin tracking time. The button will change to **Pause** while the timer is running.
3. Use the **Stop** button to reset the timer back to zero.
4. If you wish to be alerted every hour, check the **Play sound every hour** checkbox.

## File Structure

- **background.js**: Contains the logic for managing the timer, including starting, pausing, resetting, and updating the badge text.
- **popup.js**: Handles the UI interactions in the popup, such as button clicks and updating the timer display.
- **popup.html**: The HTML structure for the popup window.
- **manifest.json**: The configuration file for the Chrome extension, defining permissions and linking the background script and popup.
- **icons/**: Contains the various icon sizes used for the extension.
- **sounds/**: Contains the sound file used for the hourly alert.

## How It Works

- **Timer State Management**: The timer's state (running/paused) and elapsed time are stored using Chrome's `chrome.storage.local` API, allowing the timer to maintain its state across browser sessions.
- **Badge Display**: The elapsed time is displayed in hours and minutes format on the Chrome toolbar icon using the `chrome.action.setBadgeText` method.
- **Hourly Sound Alert**: When enabled, the extension plays a soft chime sound every hour using the `Audio` API.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue with any suggestions or bug reports.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
