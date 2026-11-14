# Changelog

All notable changes to this project are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

## [1.0.0] - 2026-11-15

### Added

- `RichTextEditor` component with formatting, block, list, link, media, table, find and replace, slash command, and markdown shortcut support
- `RichTextViewer` component for displaying sanitized HTML
- HTML sanitizer with an allowlist of tags, attributes, inline styles, and URL schemes
- Export to HTML, plain text, `.html` file, and print
- HTML source mode and fullscreen mode
- Character and word counts with an optional `maxLength` limit
- Props for `minHeight`, `maxHeight`, `maxFileSizeMB`, `placeholder`, `disabled`, `style`, and upload handlers for images and videos
- `onError` and `onSuccess` callbacks
