# shadcn-rte API Reference

Full reference for the components exported by `shadcn-rte`.

```tsx
import { RichTextEditor, RichTextViewer } from 'shadcn-rte';
```

## `RichTextEditor`

A controlled rich text editor. The value is HTML, and every change is sanitized before `onChange` is called.

### Props

| Prop            | Type                              | Default                | Description                                                                            |
| --------------- | --------------------------------- | ---------------------- | -------------------------------------------------------------------------------------- |
| `value`         | `string`                          | required               | HTML content of the editor                                                             |
| `onChange`      | `(value: string) => void`         | required               | Called with sanitized HTML. Empty content is `''`.                                     |
| `placeholder`   | `string`                          | `'Write something...'` | Shown when the editor is empty                                                         |
| `disabled`      | `boolean`                         | `false`                | Disables editing, the toolbar, and slash commands                                      |
| `style`         | `React.CSSProperties`             |                        | Applied to the outer wrapper. Merged over the defaults.                                |
| `minHeight`     | `number`                          | `240`                  | Minimum height of the content area, in px                                              |
| `maxHeight`     | `number`                          | `600`                  | Maximum height of the content area before it scrolls, in px                            |
| `maxFileSizeMB` | `number`                          | `10`                   | Largest file accepted for image or video upload                                        |
| `maxLength`     | `number`                          |                        | Maximum number of visible characters. Excess typing is blocked.                        |
| `onImageUpload` | `(file: File) => Promise<string>` |                        | Uploads an image and returns its URL. Without it, the image is inserted as a data URL. |
| `onVideoUpload` | `(file: File) => Promise<string>` |                        | Uploads a video and returns its URL. Without it, the video is inserted as a data URL.  |
| `onError`       | `(message: string) => void`       |                        | Called with a message when an action fails                                             |
| `onSuccess`     | `(message: string) => void`       |                        | Called after a successful action, such as copying content                              |

### Behavior notes

- **Controlled value:** when `value` changes from outside the editor, the content is replaced. Changes made inside the editor are not overwritten while they match the last emitted value.
- **Empty content:** an empty editor emits `''`, not `'<p><br></p>'`.
- **Source mode:** the HTML source toggle edits raw HTML. Edits are sanitized as you type.
- **Reset:** the reset button restores the `value` that was passed in on first render.
- **Fullscreen:** press `Esc` to exit.

### Example

```tsx
import { useState } from 'react';
import { RichTextEditor } from 'shadcn-rte';

export function PostForm() {
  const [content, setContent] = useState('');

  return (
    <RichTextEditor
      value={content}
      onChange={setContent}
      maxLength={5000}
      onImageUpload={async (file) => {
        const form = new FormData();
        form.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: form });
        const { url } = await res.json();
        return url;
      }}
      onError={(message) => toast.error(message)}
      onSuccess={(message) => toast.success(message)}
    />
  );
}
```

## `RichTextViewer`

Displays saved HTML with the same sanitizer and styles as the editor. It is read-only.

### Props

| Prop    | Type                  | Description                    |
| ------- | --------------------- | ------------------------------ |
| `value` | `string`              | HTML to display                |
| `style` | `React.CSSProperties` | Applied to the wrapper element |

### Example

```tsx
import { RichTextViewer } from 'shadcn-rte';

export function Article({ html }: { html: string }) {
  return <RichTextViewer value={html} style={{ maxWidth: 720 }} />;
}
```

## Supported HTML

The sanitizer keeps only these elements:

- **Text:** `p`, `br`, `div`, `span`, `strong`, `b`, `em`, `i`, `u`, `s`, `strike`, `del`, `sub`, `sup`, `code`, `pre`, `mark`, `blockquote`
- **Headings:** `h1`, `h2`, `h3`, `h4`
- **Lists:** `ul`, `ol`, `li`. Checklists use `data-checklist` on `ul` and `data-checked` on `li`.
- **Links and media:** `a`, `img`, `video`, `source`, `iframe`
- **Tables:** `table`, `thead`, `tbody`, `tr`, `th`, `td`
- **Other:** `hr`

Elements not on this list are removed, and their text content is kept.

### Allowed attributes

| Element    | Attributes                                        |
| ---------- | ------------------------------------------------- |
| `a`        | `href`, `title`, `target`, `rel`                  |
| `img`      | `src`, `alt`, `title`                             |
| `video`    | `src`, `controls`, `loop`, `muted`, `playsinline` |
| `source`   | `src`, `type`                                     |
| `iframe`   | `src`, `allowfullscreen`, `frameborder`, `title`  |
| `td`, `th` | `colspan`, `rowspan`                              |
| `ol`       | `start`                                           |
| `ul`, `li` | `data-checklist`, `data-checked`                  |

### Allowed inline styles

`color`, `background-color`, `text-align`, `font-size`, `font-family`, `font-weight`, `font-style`, `text-decoration`, `width`, `max-width`, `height`, `margin-left`, `margin-right`, `display`, `aspect-ratio`, `line-height`.

### Allowed URLs

- **Links:** `http:`, `https:`, `mailto:`, `tel:`, relative paths starting with `/`, and anchors starting with `#`
- **Images:** `http(s)` URLs, relative paths, and `data:image/` URLs for png, jpeg, gif, webp, avif, and bmp
- **Videos:** `http(s)` URLs, relative paths, and `data:video/` URLs for mp4, webm, and ogg
- **Embeds (`iframe`):** YouTube, YouTube nocookie, and Vimeo player URLs only

Links that `target="_blank"` get `rel="noopener noreferrer"` added.

## Exports summary

| Export                | Kind      |
| --------------------- | --------- |
| `RichTextEditor`      | Component |
| `RichTextViewer`      | Component |
| `RichTextEditorProps` | Type      |
