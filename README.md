# shadcn-rte

A rich text editor built on [shadcn/ui](https://ui.shadcn.com) components. It has no editor-engine dependency: it is a single React component on top of `contentEditable`, with a built-in HTML sanitizer.

## Features

**Formatting**

- Bold, italic, underline, strikethrough, inline code, subscript, superscript
- Headings (H1–H4), paragraph, quote, code block
- Font family, font size, line height
- Text color and highlight color (presets plus custom hex)
- Text alignment and indent / outdent
- Change case (UPPERCASE, lowercase, Title Case)
- Clear formatting

**Content**

- Bullet, numbered and checklist (clickable checkboxes) lists
- Links (with open-in-new-tab, edit and remove)
- Images and videos: upload, URL, drag & drop and paste. YouTube and Vimeo links are embedded.
- Tables with a grid picker: add/delete rows and columns, toggle header row, delete table
- Horizontal divider, emoji and symbols picker

**Editing experience**

- Floating toolbar on text selection
- `/` command menu
- Markdown-style shortcuts
- Find & replace with match highlighting and match case
- Undo / redo
- Image and video resize, align and alt text
- Fullscreen mode
- HTML source view
- Word, character and selected-word counts, estimated reading time
- Optional character limit

**Output**

- Export menu: copy HTML, copy plain text, download `.html`, print
- `RichTextViewer` for safely rendering saved content
- Sanitized output: only allowed tags, attributes, styles, URLs and embed hosts are kept

## Requirements

- React 18 or later
- Tailwind CSS (shadcn/ui setup)
- [`lucide-react`](https://lucide.dev)
- These shadcn/ui components:

```bash
npx shadcn@latest add button dropdown-menu input label popover select separator switch tabs textarea tooltip
```

The editor imports them from `@/components/ui/*`, so adjust the paths if your alias is different.

## Installation

Copy the editor file into your project, for example `src/package/editor/index.tsx`, and install the dependencies above.

```bash
npm install lucide-react
```

## Usage

```tsx
'use client';

import * as React from 'react';
import { RichTextEditor } from '@/package/editor';

export default function Example() {
  const [html, setHtml] = React.useState('');

  return (
    <RichTextEditor
      value={html}
      onChange={setHtml}
      placeholder="Write something..."
    />
  );
}
```

### Rendering saved content

```tsx
import { RichTextViewer } from '@/package/editor';

<RichTextViewer value={html} />;
```

### Custom uploads

By default, images and videos are embedded as base64 data URLs. Pass an upload function to store files yourself and return the public URL.

```tsx
<RichTextEditor
  value={html}
  onChange={setHtml}
  maxFileSizeMB={5}
  onImageUpload={async (file) => {
    const body = new FormData();
    body.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body });
    const { url } = await res.json();
    return url;
  }}
  onVideoUpload={async (file) => uploadVideo(file)}
  onError={(message) => toast.error(message)}
  onSuccess={(message) => toast.success(message)}
/>
```

## Props

| Prop            | Type                              | Default                | Description                                                                                                     |
| --------------- | --------------------------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------- |
| `value`         | `string`                          | required               | HTML content.                                                                                                   |
| `onChange`      | `(value: string) => void`         | required               | Called with sanitized HTML. Empty content returns `''`.                                                         |
| `placeholder`   | `string`                          | `'Write something...'` | Shown when the editor is empty.                                                                                 |
| `disabled`      | `boolean`                         | `false`                | Makes the editor read-only and disables the toolbar.                                                            |
| `style`         | `React.CSSProperties`             | –                      | Styles for the outer container.                                                                                 |
| `minHeight`     | `number`                          | `240`                  | Minimum editing area height in px.                                                                              |
| `maxHeight`     | `number`                          | `600`                  | Maximum editing area height in px before scrolling.                                                             |
| `maxLength`     | `number`                          | –                      | Character limit. Typing is blocked at the limit and the counter turns red if exceeded (for example by pasting). |
| `maxFileSizeMB` | `number`                          | `10`                   | Maximum image/video upload size.                                                                                |
| `onImageUpload` | `(file: File) => Promise<string>` | –                      | Custom image upload. Return the file URL.                                                                       |
| `onVideoUpload` | `(file: File) => Promise<string>` | –                      | Custom video upload. Return the file URL.                                                                       |
| `onError`       | `(message: string) => void`       | –                      | Called for invalid URLs, oversized files, upload and copy failures.                                             |
| `onSuccess`     | `(message: string) => void`       | –                      | Called after successful actions such as copy.                                                                   |

## Keyboard shortcuts

| Shortcut                   | Action                                                                            |
| -------------------------- | --------------------------------------------------------------------------------- |
| `Ctrl/Cmd + B` / `I` / `U` | Bold / italic / underline                                                         |
| `Ctrl/Cmd + Shift + X`     | Strikethrough                                                                     |
| `Ctrl/Cmd + K`             | Insert or edit link                                                               |
| `Ctrl/Cmd + Shift + V`     | Paste as plain text                                                               |
| `Tab` / `Shift + Tab`      | Indent / outdent in lists, move between table cells, insert spaces in code blocks |
| `Esc`                      | Exit fullscreen, or close the `/` menu                                            |

## Slash commands

Type `/` at the start of an empty line, then keep typing to filter. Use `↑` `↓` to move, `Enter` or `Tab` to insert, `Esc` to dismiss.

Heading 1–3, bullet list, numbered list, checklist, quote, code block, divider, table.

## Markdown shortcuts

Type the marker at the start of a line, then press space.

| Type                  | Result        |
| --------------------- | ------------- |
| `#` `##` `###` `####` | Heading 1–4   |
| `>`                   | Quote         |
| `-` or `*`            | Bullet list   |
| `1.`                  | Numbered list |
| `[]`                  | Checklist     |
| ` ``` `               | Code block    |

## Security

Everything that goes in or out of the editor passes through a sanitizer:

- Only a safe list of tags, attributes and CSS properties is kept. Scripts, styles, forms and similar tags are removed.
- Links allow `http(s)`, `mailto`, `tel`, relative paths and anchors only.
- Images and videos allow `http(s)`, relative paths and base64 data of known media types.
- Iframes are limited to YouTube, YouTube (no-cookie) and Vimeo embeds.

Still sanitize on your server before storing or rendering content from untrusted users.

## Browser support

Built for modern browsers. The editor uses `document.execCommand`, which all major browsers still support. Find & replace highlighting uses the CSS Highlight API: in browsers without it, search still works but matches are not colored.

## License

Add your license here.
