# shadcn-rte

[![npm version](https://img.shields.io/npm/v/shadcn-rte.svg)](https://www.npmjs.com/package/shadcn-rte)
[![license](https://img.shields.io/npm/l/shadcn-rte.svg)](./LICENSE)

A rich text editor for React, built on [shadcn/ui](https://ui.shadcn.com). It has no editor-engine dependency: it is a single component on top of `contentEditable`, with a built-in HTML sanitizer.

## Features

**Formatting**

- Bold, italic, underline, strikethrough, inline code, subscript, superscript
- Headings (H1–H4), paragraph, quote, code block
- Font family, font size, line height
- Text color and highlight color (presets plus custom hex)
- Text alignment, indent / outdent, change case
- Clear formatting

**Content**

- Bullet, numbered and checklist (clickable checkboxes) lists
- Links with open-in-new-tab, edit and remove
- Images and videos: upload, URL, drag & drop and paste. YouTube and Vimeo links are embedded.
- Tables with a grid picker: add/delete rows and columns, toggle header row, delete table
- Horizontal divider, emoji and symbols picker

**Editing experience**

- Floating toolbar on text selection
- `/` command menu
- Markdown-style shortcuts
- Find & replace with match highlighting
- Undo / redo
- Image and video resize, align and alt text
- Fullscreen mode and HTML source view
- Word, character and selected-word counts, reading time
- Optional character limit

**Output**

- Export menu: copy HTML, copy plain text, download `.html`, print
- `RichTextViewer` to render saved content safely
- Sanitized output: only allowed tags, attributes, styles, URLs and embed hosts are kept

## Installation

```bash
npm install shadcn-rte
# or
pnpm add shadcn-rte
# or
yarn add shadcn-rte
```

### Peer requirements

| Requirement                        | Notes                                                                                                                  |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `react` and `react-dom`            | 18 or later                                                                                                            |
| `lucide-react`                     | Icons                                                                                                                  |
| Tailwind CSS with shadcn/ui set up | The editor uses your theme tokens (`bg-popover`, `text-popover-foreground`, and so on)                                 |
| shadcn/ui components               | `button`, `dropdown-menu`, `input`, `label`, `popover`, `select`, `separator`, `switch`, `tabs`, `textarea`, `tooltip` |

Install the shadcn/ui components if you don't have them yet:

```bash
npx shadcn@latest add button dropdown-menu input label popover select separator switch tabs textarea tooltip
```

The editor imports these from `@/components/ui/*`, so your project needs that path alias to point at them.

### Tailwind setup

Tailwind has to scan the package so the classes it uses are generated.

**Tailwind v4** — add a `@source` line to your global CSS:

```css
@import 'tailwindcss';
@source '../node_modules/shadcn-rte';
```

**Tailwind v3** — add the package to `content` in `tailwind.config.js`:

```js
module.exports = {
  content: ['./src/**/*.{ts,tsx}', './node_modules/shadcn-rte/**/*.{js,mjs}'],
};
```

## Quick start

```tsx
'use client';

import * as React from 'react';
import { RichTextEditor } from 'shadcn-rte';

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

The editor needs the browser. In Next.js (App Router), use it inside a file that starts with `'use client'`.

### Render saved content

```tsx
import { RichTextViewer } from 'shadcn-rte';

export function Post({ html }: { html: string }) {
  return <RichTextViewer value={html} />;
}
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

### With a form (React Hook Form)

```tsx
<Controller
  name="content"
  control={control}
  render={({ field }) => (
    <RichTextEditor value={field.value} onChange={field.onChange} />
  )}
/>
```

## API

### `<RichTextEditor />`

| Prop            | Type                              | Default                | Description                                                                                                            |
| --------------- | --------------------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `value`         | `string`                          | required               | HTML content.                                                                                                          |
| `onChange`      | `(value: string) => void`         | required               | Called with sanitized HTML. Empty content returns `''`.                                                                |
| `placeholder`   | `string`                          | `'Write something...'` | Shown when the editor is empty.                                                                                        |
| `disabled`      | `boolean`                         | `false`                | Makes the editor read-only and disables the toolbar.                                                                   |
| `style`         | `React.CSSProperties`             | –                      | Styles for the outer container.                                                                                        |
| `minHeight`     | `number`                          | `240`                  | Minimum editing area height in px.                                                                                     |
| `maxHeight`     | `number`                          | `600`                  | Maximum editing area height in px before scrolling.                                                                    |
| `maxLength`     | `number`                          | –                      | Character limit. Typing is blocked at the limit, and the counter turns red if it is exceeded (for example by pasting). |
| `maxFileSizeMB` | `number`                          | `10`                   | Maximum image/video upload size.                                                                                       |
| `onImageUpload` | `(file: File) => Promise<string>` | –                      | Custom image upload. Return the file URL.                                                                              |
| `onVideoUpload` | `(file: File) => Promise<string>` | –                      | Custom video upload. Return the file URL.                                                                              |
| `onError`       | `(message: string) => void`       | –                      | Called for invalid URLs, oversized files, upload and copy failures.                                                    |
| `onSuccess`     | `(message: string) => void`       | –                      | Called after successful actions such as copy.                                                                          |

### `<RichTextViewer />`

| Prop    | Type                  | Description                                     |
| ------- | --------------------- | ----------------------------------------------- |
| `value` | `string`              | HTML to render. It is sanitized before display. |
| `style` | `React.CSSProperties` | Styles for the wrapper.                         |

### Types

```ts
import type { RichTextEditorProps } from 'shadcn-rte';
```

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

The sanitizer runs in the browser. Sanitize again on your server before storing or rendering content from untrusted users.

## Browser support

Modern browsers. The editor uses `document.execCommand`, which all major browsers still support. Find & replace highlighting uses the CSS Highlight API: in browsers without it, search still works but matches are not colored.

## Troubleshooting

| Problem                                    | Fix                                                                                                     |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| `Module not found: @/components/ui/...`    | Install the shadcn/ui components listed above and make sure the `@/` alias points to your `src` folder. |
| Floating toolbar or menus look unstyled    | Add the package to Tailwind's sources (see Tailwind setup).                                             |
| `window is not defined` / hydration errors | Use the editor in a client component (`'use client'`).                                                  |
| Content looks different after saving       | Render it with `RichTextViewer`, which applies the same content styles.                                 |

## License

MIT © jsdev-robin
