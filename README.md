Proofread Reminder
A Chrome extension that places a floating proofreading checklist on every Google Doc — including Docs embedded on other sites like Google Classroom. You have to check off every item before you can close the tab.

## Why

If you lose points on assignments because you forget to proofread, this extension builds the habit for you. It doesn’t proofread for you — it just makes sure you do it yourself before submitting.

## Features

- **Floating checklist** appears on every Google Doc with 5 proofreading steps
- **Blocks tab close** — if you try to close or navigate away without finishing, the browser asks “Leave site?”
- **Per-document progress** — your checkmarks are saved for each Doc, so refreshing won’t reset them
- **Draggable** — move the panel anywhere on screen
- **Minimizable** — collapse it to a small button when you need space
- **Reset button** — start the checklist over anytime
- **Works embedded** — runs inside Google Classroom and any site that embeds Google Docs

## Checklist Items

Read the whole thing out loud
Check spelling & grammar
Make sure you answered the prompt
Check formatting (font, spacing, margins)
Verify your name & date are on it
You can customize these by editing the `ITEMS` array in `content.js`.

## Install

Download or clone this repo
Go to `chrome://extensions`
Turn on **Developer mode** (top right)
Click **Load unpacked**
Select the extension folder
Or install from the [Chrome Web Store](https://chromewebstore.google.com/).

## Privacy

This extension collects no data. All checklist progress is stored locally on your device using Chrome’s storage API. Nothing is ever sent to any server.

## License

MIT

