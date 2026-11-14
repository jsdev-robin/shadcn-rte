'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  ArrowUpDown,
  Baseline,
  Bold,
  ChevronDown,
  ChevronUp,
  Code,
  CodeXml,
  Download,
  Heading1,
  Heading2,
  Highlighter,
  Image as ImageIcon,
  IndentDecrease,
  IndentIncrease,
  Italic,
  Link2,
  List,
  ListChecks,
  ListOrdered,
  Maximize2,
  Minimize2,
  Minus,
  Quote,
  Redo2,
  RemoveFormatting,
  RotateCcw,
  Search,
  Smile,
  Strikethrough,
  Subscript,
  Superscript,
  Table as TableIcon,
  TableProperties,
  Trash2,
  Type as TypeIcon,
  Underline as UnderlineIcon,
  Undo2,
  Unlink,
  Video as VideoIcon,
  X,
  type LucideIcon,
} from 'lucide-react';
import * as React from 'react';

export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  minHeight?: number;
  maxHeight?: number;
  maxFileSizeMB?: number;
  maxLength?: number;
  onImageUpload?: (file: File) => Promise<string>;
  onVideoUpload?: (file: File) => Promise<string>;
  onError?: (message: string) => void;
  onSuccess?: (message: string) => void;
}

interface Format {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strike: boolean;
  sub: boolean;
  sup: boolean;
  ul: boolean;
  ol: boolean;
  check: boolean;
  left: boolean;
  center: boolean;
  right: boolean;
  justify: boolean;
  code: boolean;
  link: boolean;
  inTable: boolean;
  block: string;
  size: string;
}

const INITIAL_FORMAT: Format = {
  bold: false,
  italic: false,
  underline: false,
  strike: false,
  sub: false,
  sup: false,
  ul: false,
  ol: false,
  check: false,
  left: false,
  center: false,
  right: false,
  justify: false,
  code: false,
  link: false,
  inTable: false,
  block: 'p',
  size: '',
};

const EMPTY_HTML = '<p><br></p>';
const MEDIA_SELECTOR = 'img,video,iframe,table,hr';
const BLOCK_TAGS = new Set([
  'P',
  'DIV',
  'H1',
  'H2',
  'H3',
  'H4',
  'BLOCKQUOTE',
  'PRE',
  'LI',
  'TD',
  'TH',
]);

const BLOCK_OPTIONS = [
  { value: 'p', label: 'Paragraph' },
  { value: 'h1', label: 'Heading 1' },
  { value: 'h2', label: 'Heading 2' },
  { value: 'h3', label: 'Heading 3' },
  { value: 'h4', label: 'Heading 4' },
  { value: 'blockquote', label: 'Quote' },
  { value: 'pre', label: 'Code block' },
];

const FONT_FAMILIES = [
  'Arial',
  'Georgia',
  'Verdana',
  'Tahoma',
  'Trebuchet MS',
  'Courier New',
];
const FONT_SIZES = ['12', '14', '16', '18', '20', '24', '30', '36', '48'];
const LINE_HEIGHTS = ['1.2', '1.5', '1.7', '2', '2.5'];

const EMOJIS = [
  '😀',
  '😂',
  '😊',
  '😍',
  '🤔',
  '😎',
  '😢',
  '😡',
  '👍',
  '👎',
  '👏',
  '🙏',
  '💪',
  '🎉',
  '🔥',
  '⭐',
  '❤️',
  '💡',
  '✅',
  '❌',
  '⚠️',
  '📌',
  '📎',
  '📅',
  '🚀',
  '🎯',
  '💬',
  '📝',
  '🔗',
  '🔒',
  '🌍',
  '☀️',
];

const SYMBOLS = [
  '©',
  '®',
  '™',
  '§',
  '¶',
  '°',
  '±',
  '×',
  '÷',
  '≠',
  '≤',
  '≥',
  '≈',
  '∞',
  '√',
  'π',
  '€',
  '£',
  '¥',
  '৳',
  '←',
  '→',
  '↑',
  '↓',
  '•',
  '…',
  '—',
  '–',
  '«',
  '»',
  '✓',
  '✗',
  '★',
  '☆',
  '♥',
  '♦',
  '№',
  'µ',
  'Ω',
  '∑',
];

const charGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(8, 1fr)',
  gap: 4,
};

const TEXT_COLORS = [
  '#000000',
  '#4b5563',
  '#9ca3af',
  '#ffffff',
  '#dc2626',
  '#ea580c',
  '#d97706',
  '#16a34a',
  '#0891b2',
  '#2563eb',
  '#7c3aed',
  '#db2777',
];

const HIGHLIGHT_COLORS = [
  '#fef08a',
  '#bbf7d0',
  '#bfdbfe',
  '#fbcfe8',
  '#fed7aa',
  '#ddd6fe',
  '#fecaca',
  '#e5e7eb',
  '#fde047',
  '#86efac',
  '#93c5fd',
  '#f9a8d4',
];

const ALIGN_MARGINS: Record<string, [string, string]> = {
  left: ['0', 'auto'],
  center: ['auto', 'auto'],
  right: ['auto', '0'],
};

const ALLOWED_TAGS = new Set([
  'P',
  'BR',
  'DIV',
  'SPAN',
  'B',
  'STRONG',
  'I',
  'EM',
  'U',
  'S',
  'STRIKE',
  'DEL',
  'SUB',
  'SUP',
  'CODE',
  'PRE',
  'BLOCKQUOTE',
  'H1',
  'H2',
  'H3',
  'H4',
  'UL',
  'OL',
  'LI',
  'A',
  'IMG',
  'VIDEO',
  'SOURCE',
  'IFRAME',
  'TABLE',
  'THEAD',
  'TBODY',
  'TR',
  'TH',
  'TD',
  'HR',
  'MARK',
]);

const DROP_TAGS = new Set([
  'SCRIPT',
  'STYLE',
  'NOSCRIPT',
  'OBJECT',
  'EMBED',
  'FORM',
  'META',
  'LINK',
  'TEMPLATE',
  'TITLE',
  'HEAD',
  'SVG',
  'MATH',
  'BUTTON',
  'TEXTAREA',
  'SELECT',
  'AUDIO',
]);

const ATTRS: Record<string, string[]> = {
  A: ['title'],
  IMG: ['alt', 'title'],
  VIDEO: ['controls', 'loop', 'muted', 'playsinline'],
  SOURCE: ['type'],
  IFRAME: ['allowfullscreen', 'frameborder', 'title'],
  TD: ['colspan', 'rowspan'],
  TH: ['colspan', 'rowspan'],
  UL: ['data-checklist'],
  LI: ['data-checked'],
  OL: ['start'],
};

const SAFE_STYLE = new Set([
  'color',
  'background-color',
  'text-align',
  'font-size',
  'font-family',
  'font-weight',
  'font-style',
  'text-decoration',
  'width',
  'max-width',
  'height',
  'margin-left',
  'margin-right',
  'display',
  'aspect-ratio',
  'line-height',
]);

const EMBED_HOSTS = [
  'https://www.youtube.com/embed/',
  'https://www.youtube-nocookie.com/embed/',
  'https://player.vimeo.com/video/',
];

const CONTENT_CSS = `
.rte-content{line-height:1.7;word-break:break-word}
.rte-content:focus{outline:none}
.rte-content>*+*{margin-top:.75em}
.rte-content h1{font-size:2em;font-weight:700;line-height:1.2}
.rte-content h2{font-size:1.5em;font-weight:700;line-height:1.3}
.rte-content h3{font-size:1.25em;font-weight:600;line-height:1.4}
.rte-content h4{font-size:1.05em;font-weight:600}
.rte-content blockquote{border-left:4px solid color-mix(in srgb,currentColor 25%,transparent);padding-left:1em;font-style:italic;opacity:.85}
.rte-content pre{background:color-mix(in srgb,currentColor 8%,transparent);border-radius:.5rem;padding:.75rem 1rem;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.875em;white-space:pre-wrap;overflow-x:auto}
.rte-content code{background:color-mix(in srgb,currentColor 10%,transparent);border-radius:.3em;padding:.15em .35em;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.9em}
.rte-content pre code{background:none;padding:0}
.rte-content ul{list-style:disc;padding-left:1.5em}
.rte-content ol{list-style:decimal;padding-left:1.5em}
.rte-content li>ul,.rte-content li>ol{margin-top:.25em}
.rte-content ul[data-checklist]{list-style:none;padding-left:0}
.rte-content ul[data-checklist] li{position:relative;padding-left:1.8em}
.rte-content ul[data-checklist] li::before{content:'';position:absolute;left:0;top:.4em;width:1em;height:1em;border:2px solid currentColor;border-radius:.25em;opacity:.65;cursor:pointer;box-sizing:border-box}
.rte-content ul[data-checklist] li[data-checked='true']::before{content:'\\2713';display:flex;align-items:center;justify-content:center;font-size:.75em;font-weight:700;opacity:1}
.rte-content ul[data-checklist] li[data-checked='true']{text-decoration:line-through;opacity:.65}
.rte-content a{color:#2563eb;text-decoration:underline;cursor:pointer}
.rte-content img,.rte-content video{max-width:100%;border-radius:.5rem}
.rte-content iframe{max-width:100%;border:0;border-radius:.5rem}
.rte-content table{border-collapse:collapse;width:100%;table-layout:fixed}
.rte-content th,.rte-content td{border:1px solid color-mix(in srgb,currentColor 25%,transparent);padding:.5em .75em;vertical-align:top;min-width:2em}
.rte-content th{background:color-mix(in srgb,currentColor 8%,transparent);font-weight:600;text-align:left}
.rte-content hr{border:0;border-top:1px solid color-mix(in srgb,currentColor 25%,transparent);margin:1.5em 0}
.rte-editor iframe{pointer-events:none}
.rte-editor .rte-selected{outline:2px solid #3b82f6;outline-offset:2px}
::highlight(rte-find){background-color:#fde68a;color:#000}
::highlight(rte-find-current){background-color:#fb923c;color:#000}
`;

const BORDER = '1px solid color-mix(in srgb, currentColor 20%, transparent)';
const MUTED_BACKGROUND = 'color-mix(in srgb, currentColor 5%, transparent)';
const DANGER = '#dc2626';

const iconButtonStyle: React.CSSProperties = { height: 32, width: 32 };
const smallIconButtonStyle: React.CSSProperties = { height: 28, width: 28 };
const iconStyle: React.CSSProperties = { height: 16, width: 16 };
const rowStyle = (gap: number): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap,
});
const columnStyle = (gap: number): React.CSSProperties => ({
  display: 'flex',
  flexDirection: 'column',
  gap,
});
const selectTriggerStyle = (width: number): React.CSSProperties => ({
  height: 32,
  width,
  fontSize: 12,
});

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const normalizeUrl = (raw: string) => {
  const value = raw.trim();
  if (!value) return '';
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return `mailto:${value}`;
  if (/^([a-z][a-z0-9+.-]*:|\/|#)/i.test(value)) return value;
  return `https://${value}`;
};

const safeUrl = (value: string | null, kind: 'link' | 'image' | 'video') => {
  const url = (value ?? '').trim();
  if (!url) return null;
  if (kind === 'link')
    return /^(https?:|mailto:|tel:|\/|#)/i.test(url) ? url : null;
  if (/^https?:\/\//i.test(url) || url.startsWith('/')) return url;
  const dataPattern =
    kind === 'image'
      ? /^data:image\/(png|jpe?g|gif|webp|avif|bmp);base64,/i
      : /^data:video\/(mp4|webm|ogg);base64,/i;
  return dataPattern.test(url) ? url : null;
};

const cleanStyle = (raw: string) =>
  raw
    .split(';')
    .map((declaration) => {
      const index = declaration.indexOf(':');
      if (index < 0) return '';
      const property = declaration.slice(0, index).trim().toLowerCase();
      const val = declaration.slice(index + 1).trim();
      const safe =
        SAFE_STYLE.has(property) &&
        val &&
        !/url\(|expression|javascript:|@import|[<>\\]/i.test(val);
      return safe ? `${property}:${val}` : '';
    })
    .filter(Boolean)
    .join(';');

const cleanNode = (node: Node): Node | null => {
  if (node.nodeType === Node.TEXT_NODE)
    return document.createTextNode(node.textContent ?? '');
  if (!(node instanceof Element)) return null;

  const tag = node.tagName;
  if (DROP_TAGS.has(tag)) return null;

  const appendChildren = (target: Node) =>
    node.childNodes.forEach((child) => {
      const cleaned = cleanNode(child);
      if (cleaned) target.appendChild(cleaned);
    });

  const unwrap = () => {
    const fragment = document.createDocumentFragment();
    appendChildren(fragment);
    return fragment;
  };

  if (!ALLOWED_TAGS.has(tag)) return unwrap();

  const out = document.createElement(tag.toLowerCase());
  const style = cleanStyle(node.getAttribute('style') ?? '');
  if (style) out.setAttribute('style', style);

  (ATTRS[tag] ?? []).forEach((name) => {
    const attr = node.getAttribute(name);
    if (attr !== null) out.setAttribute(name, attr);
  });

  if (tag === 'A') {
    const href = safeUrl(node.getAttribute('href'), 'link');
    if (!href) return unwrap();
    out.setAttribute('href', href);
    if (node.getAttribute('target') === '_blank') {
      out.setAttribute('target', '_blank');
      out.setAttribute('rel', 'noopener noreferrer');
    }
  }

  if (tag === 'IMG') {
    const src = safeUrl(node.getAttribute('src'), 'image');
    if (!src) return null;
    out.setAttribute('src', src);
    return out;
  }

  if (tag === 'SOURCE') {
    const src = safeUrl(node.getAttribute('src'), 'video');
    if (!src) return null;
    out.setAttribute('src', src);
    return out;
  }

  if (tag === 'VIDEO') {
    const src = node.getAttribute('src');
    if (src) {
      const safe = safeUrl(src, 'video');
      if (!safe) return null;
      out.setAttribute('src', safe);
    }
  }

  if (tag === 'IFRAME') {
    const src = node.getAttribute('src') ?? '';
    if (!EMBED_HOSTS.some((host) => src.startsWith(host))) return null;
    out.setAttribute('src', src);
    return out;
  }

  if (tag === 'BR' || tag === 'HR') return out;

  appendChildren(out);
  return out;
};

const sanitizeHtml = (html: string) => {
  if (typeof window === 'undefined') return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const container = document.createElement('div');
  doc.body.childNodes.forEach((child) => {
    const cleaned = cleanNode(child);
    if (cleaned) container.appendChild(cleaned);
  });
  return container.innerHTML;
};

const parseVideoUrl = (raw: string) => {
  const youtube = raw.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );
  if (youtube)
    return { embed: true, src: `https://www.youtube.com/embed/${youtube[1]}` };
  const vimeo = raw.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo)
    return { embed: true, src: `https://player.vimeo.com/video/${vimeo[1]}` };
  const direct = safeUrl(raw, 'video');
  return direct ? { embed: false, src: direct } : null;
};

const buildTable = (rows: number, cols: number) => {
  const body = Array.from({ length: rows }, (_, row) => {
    const cells = Array.from({ length: cols }, () =>
      row === 0 ? '<th><br></th>' : '<td><br></td>',
    ).join('');
    return `<tr>${cells}</tr>`;
  }).join('');
  return `<table><tbody>${body}</tbody></table><p><br></p>`;
};

const readFile = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const queryState = (command: string) => {
  try {
    return document.queryCommandState(command);
  } catch {
    return false;
  }
};

const resolveBackground = () => {
  for (const element of [document.body, document.documentElement]) {
    const color = getComputedStyle(element).backgroundColor;
    if (color && color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent')
      return color;
  }
  return 'Canvas';
};

interface TableContext {
  cell: HTMLTableCellElement;
  table: HTMLTableElement;
  row: HTMLTableRowElement;
}

const TABLE_ACTIONS: { id: string; label: string; destructive?: boolean }[] = [
  { id: 'rowAbove', label: 'Insert row above' },
  { id: 'rowBelow', label: 'Insert row below' },
  { id: 'columnLeft', label: 'Insert column left' },
  { id: 'columnRight', label: 'Insert column right' },
  { id: 'toggleHeader', label: 'Toggle header row' },
  { id: 'deleteRow', label: 'Delete row', destructive: true },
  { id: 'deleteColumn', label: 'Delete column', destructive: true },
  { id: 'deleteTable', label: 'Delete table', destructive: true },
];

const newCell = (tag: string) => {
  const cell = document.createElement(tag);
  cell.innerHTML = '<br>';
  return cell;
};

const emptyRowLike = (row: HTMLTableRowElement) => {
  const clone = row.cloneNode(false) as HTMLTableRowElement;
  Array.from(row.cells).forEach(() => clone.appendChild(newCell('td')));
  return clone;
};

const insertColumn = (context: TableContext, after: boolean) => {
  const index = context.cell.cellIndex;
  Array.from(context.table.rows).forEach((row) => {
    const reference = row.cells[index];
    if (!reference) return;
    row.insertBefore(
      newCell(reference.tagName.toLowerCase()),
      after ? reference.nextSibling : reference,
    );
  });
};

const TABLE_OPERATIONS: Record<string, (context: TableContext) => void> = {
  rowAbove: ({ row }) => {
    row.parentNode?.insertBefore(emptyRowLike(row), row);
  },
  rowBelow: ({ row }) => {
    row.parentNode?.insertBefore(emptyRowLike(row), row.nextSibling);
  },
  columnLeft: (context) => insertColumn(context, false),
  columnRight: (context) => insertColumn(context, true),
  toggleHeader: ({ table }) => {
    const first = table.rows[0];
    if (!first) return;
    const next = first.cells[0]?.tagName === 'TH' ? 'td' : 'th';
    Array.from(first.cells).forEach((cell) => {
      const swap = document.createElement(next);
      Array.from(cell.attributes).forEach((attribute) =>
        swap.setAttribute(attribute.name, attribute.value),
      );
      swap.innerHTML = cell.innerHTML;
      cell.replaceWith(swap);
    });
  },
  deleteRow: ({ row, table }) => {
    row.remove();
    if (!table.rows.length) table.remove();
  },
  deleteColumn: ({ cell, table }) => {
    const index = cell.cellIndex;
    Array.from(table.rows).forEach((row) => row.cells[index]?.remove());
    if (!table.rows[0]?.cells.length) table.remove();
  },
  deleteTable: ({ table }) => table.remove(),
};

const ToolbarContext = React.createContext(false);

function ToolButton({
  label,
  icon: Icon,
  onClick,
  active = false,
  disabled = false,
  ignoreToolbarDisabled = false,
}: {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  ignoreToolbarDisabled?: boolean;
}) {
  const toolbarDisabled = React.useContext(ToolbarContext);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant={active ? 'secondary' : 'ghost'}
          size="icon"
          style={iconButtonStyle}
          aria-label={label}
          aria-pressed={active}
          disabled={disabled || (toolbarDisabled && !ignoreToolbarDisabled)}
          onClick={onClick}
        >
          <Icon style={iconStyle} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function ToolPopover({
  label,
  icon: Icon,
  active = false,
  width = 288,
  open,
  onOpenChange,
  onOpen,
  children,
}: {
  label: string;
  icon: LucideIcon;
  active?: boolean;
  width?: number | 'auto';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onOpen?: () => void;
  children: (close: () => void) => React.ReactNode;
}) {
  const toolbarDisabled = React.useContext(ToolbarContext);
  const [inner, setInner] = React.useState(false);
  const isOpen = open ?? inner;
  const setOpen = (next: boolean) => {
    if (onOpenChange) onOpenChange(next);
    else setInner(next);
    if (next) onOpen?.();
  };
  return (
    <Popover open={isOpen} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant={active ? 'secondary' : 'ghost'}
              size="icon"
              style={iconButtonStyle}
              aria-label={label}
              disabled={toolbarDisabled}
            >
              <Icon style={iconStyle} />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
      <PopoverContent
        style={{ width }}
        align="start"
        onCloseAutoFocus={(event) => event.preventDefault()}
      >
        {children(() => setOpen(false))}
      </PopoverContent>
    </Popover>
  );
}

function ColorTool({
  label,
  icon,
  colors,
  onPick,
  onReset,
}: {
  label: string;
  icon: LucideIcon;
  colors: string[];
  onPick: (color: string) => void;
  onReset: () => void;
}) {
  const [hex, setHex] = React.useState('#2563eb');
  const validHex = /^#[0-9a-f]{6}$/i.test(hex);
  return (
    <ToolPopover label={label} icon={icon} width={256}>
      {(close) => (
        <div style={columnStyle(12)}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 28px)',
              gap: 6,
            }}
          >
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                aria-label={color}
                style={{
                  height: 28,
                  width: 28,
                  padding: 0,
                  borderRadius: 6,
                  border: BORDER,
                  backgroundColor: color,
                  cursor: 'pointer',
                }}
                onClick={() => {
                  onPick(color);
                  close();
                }}
              />
            ))}
          </div>
          <div style={rowStyle(8)}>
            <input
              type="color"
              value={validHex ? hex : '#000000'}
              onChange={(event) => setHex(event.target.value)}
              style={{
                height: 32,
                width: 40,
                padding: 2,
                borderRadius: 4,
                border: BORDER,
                background: 'transparent',
                cursor: 'pointer',
              }}
            />
            <Input
              value={hex}
              onChange={(event) => setHex(event.target.value)}
              style={{ height: 32 }}
            />
            <Button
              type="button"
              size="sm"
              disabled={!validHex}
              onClick={() => {
                onPick(hex);
                close();
              }}
            >
              Apply
            </Button>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            style={{ width: '100%' }}
            onClick={() => {
              onReset();
              close();
            }}
          >
            Reset
          </Button>
        </div>
      )}
    </ToolPopover>
  );
}

const findTextRanges = (
  root: HTMLElement,
  query: string,
  matchCase: boolean,
) => {
  const ranges: Range[] = [];
  if (!query) return ranges;
  const needle = matchCase ? query : query.toLowerCase();
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const content = node.textContent ?? '';
    const haystack = matchCase ? content : content.toLowerCase();
    if (haystack.length !== content.length) continue;
    let index = haystack.indexOf(needle);
    while (index !== -1) {
      const range = document.createRange();
      range.setStart(node, index);
      range.setEnd(node, index + needle.length);
      ranges.push(range);
      index = haystack.indexOf(needle, index + needle.length);
    }
  }
  return ranges;
};

type HighlightLike = { priority: number };

const getHighlightApi = () => {
  const registry = (
    window as unknown as {
      CSS?: { highlights?: Map<string, HighlightLike> };
    }
  ).CSS?.highlights;
  const Ctor = (
    window as unknown as {
      Highlight?: new (...ranges: Range[]) => HighlightLike;
    }
  ).Highlight;
  return registry && Ctor ? { registry, Ctor } : null;
};

const htmlToText = (html: string) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.body.querySelectorAll('br').forEach((br) => br.replaceWith('\n'));
  doc.body
    .querySelectorAll('p,div,h1,h2,h3,h4,blockquote,pre,li,tr')
    .forEach((element) => element.append('\n'));
  doc.body.querySelectorAll('td,th').forEach((cell) => cell.append('\t'));
  return (doc.body.textContent ?? '').replace(/\n{3,}/g, '\n\n').trim();
};

const buildExportDocument = (html: string) =>
  `<!doctype html><html><head><meta charset="utf-8"><title>Document</title><style>body{font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:800px;margin:2rem auto;padding:0 1rem}${CONTENT_CSS}</style></head><body><div class="rte-content">${html}</div></body></html>`;

const downloadFile = (name: string, content: string, type: string) => {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
};

interface MenuItem {
  key: string;
  label: string;
  onSelect: () => void;
  separatorBefore?: boolean;
}

function ToolMenu({
  label,
  icon: Icon,
  items,
  disabled = false,
  ignoreToolbarDisabled = false,
}: {
  label: string;
  icon: LucideIcon;
  items: MenuItem[];
  disabled?: boolean;
  ignoreToolbarDisabled?: boolean;
}) {
  const toolbarDisabled = React.useContext(ToolbarContext);
  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              style={iconButtonStyle}
              aria-label={label}
              disabled={disabled || (toolbarDisabled && !ignoreToolbarDisabled)}
            >
              <Icon style={iconStyle} />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
      <DropdownMenuContent onCloseAutoFocus={(event) => event.preventDefault()}>
        {items.map((item) => (
          <React.Fragment key={item.key}>
            {item.separatorBefore && <DropdownMenuSeparator />}
            <DropdownMenuItem onSelect={item.onSelect}>
              {item.label}
            </DropdownMenuItem>
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const SLASH_COMMANDS = [
  {
    key: 'h1',
    label: 'Heading 1',
    hint: 'Large section heading',
    keywords: 'h1 title',
  },
  {
    key: 'h2',
    label: 'Heading 2',
    hint: 'Medium section heading',
    keywords: 'h2 subtitle',
  },
  {
    key: 'h3',
    label: 'Heading 3',
    hint: 'Small section heading',
    keywords: 'h3',
  },
  {
    key: 'bullet',
    label: 'Bullet list',
    hint: 'Simple unordered list',
    keywords: 'ul unordered',
  },
  {
    key: 'numbered',
    label: 'Numbered list',
    hint: 'Ordered list',
    keywords: 'ol ordered',
  },
  {
    key: 'checklist',
    label: 'Checklist',
    hint: 'Track tasks',
    keywords: 'todo task',
  },
  {
    key: 'quote',
    label: 'Quote',
    hint: 'Highlight a quote',
    keywords: 'blockquote',
  },
  {
    key: 'code',
    label: 'Code block',
    hint: 'Monospaced block',
    keywords: 'pre',
  },
  {
    key: 'divider',
    label: 'Divider',
    hint: 'Horizontal line',
    keywords: 'hr line',
  },
  { key: 'table', label: 'Table', hint: '3 × 3 table', keywords: 'grid' },
];

function BubbleButton({
  label,
  icon: Icon,
  active = false,
  onClick,
}: {
  label: string;
  icon: LucideIcon;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      size="icon"
      variant={active ? 'secondary' : 'ghost'}
      style={smallIconButtonStyle}
      aria-label={label}
      aria-pressed={active}
      title={label}
      onClick={onClick}
    >
      <Icon style={iconStyle} />
    </Button>
  );
}

function Divider() {
  return (
    <Separator
      orientation="vertical"
      style={{ margin: '0 4px', height: 24, width: 1 }}
    />
  );
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write something...',
  disabled = false,
  style,
  minHeight = 240,
  maxHeight = 600,
  maxFileSizeMB = 10,
  maxLength,
  onImageUpload,
  onVideoUpload,
  onError,
  onSuccess,
}: RichTextEditorProps) {
  const uid = React.useId();
  const ref = React.useRef<HTMLDivElement>(null);
  const saved = React.useRef<Range | null>(null);
  const lastEmitted = React.useRef(value);
  const initialValue = React.useRef(value);
  const onChangeRef = React.useRef(onChange);
  React.useEffect(() => {
    onChangeRef.current = onChange;
  });

  const [mode, setMode] = React.useState<'visual' | 'source'>('visual');
  const [source, setSource] = React.useState('');
  const [fullscreen, setFullscreen] = React.useState(false);
  const [fullscreenBackground, setFullscreenBackground] =
    React.useState('Canvas');
  const [isEmpty, setIsEmpty] = React.useState(!value);
  const [stats, setStats] = React.useState({ words: 0, chars: 0 });
  const [fmt, setFmt] = React.useState<Format>(INITIAL_FORMAT);
  const [media, setMedia] = React.useState<HTMLElement | null>(null);
  const mediaRef = React.useRef<HTMLElement | null>(null);
  const [, force] = React.useReducer((count: number) => count + 1, 0);

  const selectMedia = (element: HTMLElement | null) => {
    mediaRef.current = element;
    setMedia(element);
  };

  const [linkOpen, setLinkOpen] = React.useState(false);
  const [linkUrl, setLinkUrl] = React.useState('');
  const [linkText, setLinkText] = React.useState('');
  const [linkNewTab, setLinkNewTab] = React.useState(true);
  const [imageUrl, setImageUrl] = React.useState('');
  const [imageAlt, setImageAlt] = React.useState('');
  const [videoUrl, setVideoUrl] = React.useState('');
  const [tableHover, setTableHover] = React.useState({ rows: 0, cols: 0 });
  const [findOpen, setFindOpen] = React.useState(false);
  const [findQuery, setFindQuery] = React.useState('');
  const [replaceText, setReplaceText] = React.useState('');
  const [matchCase, setMatchCase] = React.useState(false);
  const [findIndex, setFindIndex] = React.useState(0);
  const [findCount, setFindCount] = React.useState(0);
  const [findTick, setFindTick] = React.useState(0);
  const findRanges = React.useRef<Range[]>([]);
  const [bubble, setBubble] = React.useState<{
    top: number;
    bottom: number;
    left: number;
  } | null>(null);
  const [slash, setSlash] = React.useState<{
    query: string;
    top: number;
    bottom: number;
    left: number;
  } | null>(null);
  const [slashIndex, setSlashIndex] = React.useState(0);
  const [selectedCount, setSelectedCount] = React.useState(0);
  const slashQuery = React.useRef<string | null>(null);
  const slashDismissed = React.useRef(false);
  const mouseDown = React.useRef(false);
  const plainPaste = React.useRef(false);
  const syncRef = React.useRef<() => void>(() => {});

  const toolsDisabled = disabled || mode === 'source';

  const closestIn = (node: Node | null | undefined, selector: string) => {
    const element =
      node instanceof Element ? node : (node?.parentElement ?? null);
    const found = element?.closest(selector) ?? null;
    return found && ref.current?.contains(found) ? found : null;
  };

  const closestBlock = (node: Node | null) => {
    let current: Node | null = node;
    while (current && current !== ref.current) {
      if (current instanceof Element && BLOCK_TAGS.has(current.tagName))
        return current;
      current = current.parentNode;
    }
    return null;
  };

  const refreshMeta = React.useCallback(() => {
    const element = ref.current;
    if (!element) return;
    const text = element.innerText;
    const trimmed = text.trim();
    setIsEmpty(!trimmed && !element.querySelector(MEDIA_SELECTOR));
    setStats({
      words: trimmed ? trimmed.split(/\s+/).length : 0,
      chars: text.replace(/\n/g, '').length,
    });
  }, []);

  const emit = React.useCallback(() => {
    const element = ref.current;
    if (!element) return;
    refreshMeta();
    const empty =
      !element.innerText.trim() && !element.querySelector(MEDIA_SELECTOR);
    const html = empty ? '' : sanitizeHtml(element.innerHTML);
    if (html === lastEmitted.current) return;
    lastEmitted.current = html;
    onChangeRef.current(html);
  }, [refreshMeta]);

  const updateFormat = React.useCallback(() => {
    const element = ref.current;
    const selection = document.getSelection();
    if (!element || !selection || !selection.rangeCount) return;
    const node = selection.anchorNode;
    if (!node || !element.contains(node)) return;
    const target = node instanceof Element ? node : node.parentElement;
    const find = (selector: string) => {
      const found = target?.closest(selector) ?? null;
      return found && element.contains(found) ? found : null;
    };
    const block = find('h1,h2,h3,h4,pre,blockquote');
    setFmt({
      bold: queryState('bold'),
      italic: queryState('italic'),
      underline: queryState('underline'),
      strike: queryState('strikeThrough'),
      sub: queryState('subscript'),
      sup: queryState('superscript'),
      ul: queryState('insertUnorderedList'),
      ol: queryState('insertOrderedList'),
      check: Boolean(find('ul[data-checklist]')),
      left: queryState('justifyLeft'),
      center: queryState('justifyCenter'),
      right: queryState('justifyRight'),
      justify: queryState('justifyFull'),
      code: Boolean(find('code')),
      link: Boolean(find('a')),
      inTable: Boolean(find('td,th')),
      block: block ? block.tagName.toLowerCase() : 'p',
      size: target
        ? String(Math.round(parseFloat(getComputedStyle(target).fontSize)))
        : '',
    });
  }, []);

  const restore = () => {
    const element = ref.current;
    if (!element) return;
    const selection = document.getSelection();
    const live =
      selection &&
      selection.rangeCount > 0 &&
      element.contains(selection.getRangeAt(0).commonAncestorContainer);
    if (live) return;
    element.focus({ preventScroll: true });
    if (saved.current && selection) {
      selection.removeAllRanges();
      selection.addRange(saved.current);
    }
  };

  const run = (command: string, commandValue?: string, css = false) => {
    restore();
    document.execCommand('styleWithCSS', false, String(css));
    document.execCommand(command, false, commandValue);
    emit();
    updateFormat();
  };

  const insertHtml = (html: string) => {
    restore();
    document.execCommand('insertHTML', false, html);
    emit();
  };

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (value === lastEmitted.current && element.innerHTML !== '') return;
    element.innerHTML = sanitizeHtml(value) || EMPTY_HTML;
    lastEmitted.current = value;
    selectMedia(null);
    refreshMeta();
  }, [value, mode, refreshMeta]);

  React.useEffect(() => {
    if (mode === 'visual')
      document.execCommand('defaultParagraphSeparator', false, 'p');
  }, [mode]);

  React.useEffect(() => {
    const handler = () => {
      const selection = document.getSelection();
      const element = ref.current;
      if (!selection || !element || !selection.rangeCount) return;
      const range = selection.getRangeAt(0);
      if (!element.contains(range.commonAncestorContainer)) return;
      saved.current = range.cloneRange();
      updateFormat();
    };
    document.addEventListener('selectionchange', handler);
    return () => document.removeEventListener('selectionchange', handler);
  }, [updateFormat]);

  React.useEffect(() => {
    if (!fullscreen) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setFullscreen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [fullscreen]);

  React.useEffect(() => {
    ref.current
      ?.querySelectorAll('.rte-selected')
      .forEach((node) => node.classList.remove('rte-selected'));
    media?.classList.add('rte-selected');
  }, [media]);

  React.useEffect(() => {
    const api = getHighlightApi();
    const clear = () => {
      api?.registry.delete('rte-find');
      api?.registry.delete('rte-find-current');
    };
    const element = ref.current;
    if (!findOpen || mode !== 'visual' || !element || !findQuery) {
      findRanges.current = [];
      setFindCount(0);
      return clear;
    }
    const ranges = findTextRanges(element, findQuery, matchCase);
    findRanges.current = ranges;
    setFindCount(ranges.length);
    if (!ranges.length) return clear;
    const index = Math.min(findIndex, ranges.length - 1);
    if (api) {
      const current = new api.Ctor(ranges[index]);
      current.priority = 1;
      api.registry.set('rte-find', new api.Ctor(...ranges));
      api.registry.set('rte-find-current', current);
    }
    ranges[index].startContainer.parentElement?.scrollIntoView({
      block: 'nearest',
    });
    return clear;
  }, [findOpen, findQuery, matchCase, findIndex, findTick, value, mode]);

  const applyBlock = (tag: string) => run('formatBlock', `<${tag}>`);

  const applyFontSize = (size: string) => {
    restore();
    document.execCommand('styleWithCSS', false, 'false');
    document.execCommand('fontSize', false, '7');
    ref.current?.querySelectorAll('font[size="7"]').forEach((font) => {
      const span = document.createElement('span');
      span.style.fontSize = `${size}px`;
      while (font.firstChild) span.appendChild(font.firstChild);
      font.replaceWith(span);
    });
    emit();
    updateFormat();
  };

  const toggleInlineCode = () => {
    restore();
    const selection = document.getSelection();
    const code = closestIn(selection?.anchorNode, 'code');
    if (code && !code.closest('pre')) {
      code.replaceWith(...Array.from(code.childNodes));
      emit();
      updateFormat();
      return;
    }
    const text = selection?.toString() ?? '';
    if (!text) return;
    document.execCommand(
      'insertHTML',
      false,
      `<code>${escapeHtml(text)}</code>`,
    );
    emit();
    updateFormat();
  };

  const toggleChecklist = () => {
    restore();
    const anchor = () => document.getSelection()?.anchorNode;
    if (closestIn(anchor(), 'ul[data-checklist]')) {
      document.execCommand('insertUnorderedList');
      emit();
      updateFormat();
      return;
    }
    if (!closestIn(anchor(), 'ul')) document.execCommand('insertUnorderedList');
    const list = closestIn(anchor(), 'ul');
    list?.setAttribute('data-checklist', '');
    list?.querySelectorAll(':scope > li').forEach((item) => {
      item.setAttribute(
        'data-checked',
        item.getAttribute('data-checked') ?? 'false',
      );
    });
    emit();
    updateFormat();
  };

  const clearFormatting = () => {
    run('removeFormat');
    run('unlink');
    run('formatBlock', '<p>');
  };

  const resetContent = () => {
    const element = ref.current;
    if (!element) return;
    element.innerHTML = sanitizeHtml(initialValue.current) || EMPTY_HTML;
    selectMedia(null);
    emit();
    updateFormat();
  };

  const prefillLink = () => {
    const anchor = closestIn(
      saved.current?.startContainer,
      'a',
    ) as HTMLAnchorElement | null;
    setLinkUrl(anchor?.getAttribute('href') ?? '');
    setLinkText(anchor?.textContent ?? saved.current?.toString() ?? '');
    setLinkNewTab(anchor ? anchor.target === '_blank' : true);
  };

  const applyLink = () => {
    const href = safeUrl(normalizeUrl(linkUrl), 'link');
    if (!href) {
      onError?.('Invalid URL');
      return;
    }
    restore();
    const element = ref.current;
    if (!element) return;
    const selection = document.getSelection();
    const anchor = closestIn(
      selection?.anchorNode,
      'a',
    ) as HTMLAnchorElement | null;
    const style = (item: HTMLAnchorElement) => {
      item.setAttribute('href', href);
      if (linkNewTab) {
        item.setAttribute('target', '_blank');
        item.setAttribute('rel', 'noopener noreferrer');
        return;
      }
      item.removeAttribute('target');
      item.removeAttribute('rel');
    };
    if (anchor) {
      style(anchor);
      if (linkText) anchor.textContent = linkText;
      emit();
      updateFormat();
      return;
    }
    if (selection?.isCollapsed) {
      document.execCommand(
        'insertHTML',
        false,
        `<a href="${escapeHtml(href)}">${escapeHtml(linkText || href)}</a>`,
      );
    } else {
      document.execCommand('createLink', false, href);
    }
    Array.from(element.querySelectorAll('a'))
      .filter((item) => item.getAttribute('href') === href)
      .forEach(style);
    emit();
    updateFormat();
  };

  const insertImage = (src: string, alt = '') => {
    const safe = safeUrl(normalizeUrl(src), 'image');
    if (!safe) {
      onError?.('Invalid image URL');
      return;
    }
    insertHtml(
      `<img src="${escapeHtml(safe)}" alt="${escapeHtml(alt)}" style="max-width:100%;height:auto;display:block">`,
    );
  };

  const insertVideo = (raw: string) => {
    const parsed = parseVideoUrl(normalizeUrl(raw));
    if (!parsed) {
      onError?.('Invalid video URL');
      return;
    }
    const html = parsed.embed
      ? `<iframe src="${parsed.src}" allowfullscreen frameborder="0" style="width:100%;aspect-ratio:16/9;display:block"></iframe>`
      : `<video src="${escapeHtml(parsed.src)}" controls style="max-width:100%;display:block"></video>`;
    insertHtml(`${html}<p><br></p>`);
  };

  const insertFiles = async (files: File[]) => {
    for (const file of files) {
      if (file.size > maxFileSizeMB * 1024 * 1024) {
        onError?.(`${file.name} is larger than ${maxFileSizeMB}MB`);
        continue;
      }
      const isVideo = file.type.startsWith('video/');
      try {
        const uploader = isVideo ? onVideoUpload : onImageUpload;
        const src = uploader ? await uploader(file) : await readFile(file);
        if (isVideo) insertVideo(src);
        else insertImage(src, file.name.replace(/\.[^.]+$/, ''));
      } catch {
        onError?.(`Failed to upload ${file.name}`);
      }
    }
  };

  const tableContext = () => {
    const cell = closestIn(
      saved.current?.startContainer,
      'td,th',
    ) as HTMLTableCellElement | null;
    const table = cell?.closest('table') ?? null;
    const row = cell?.parentElement as HTMLTableRowElement | null;
    return cell && table && row ? { cell, table, row } : null;
  };

  const runTableAction = (id: string) => {
    const context = tableContext();
    if (!context) return;
    TABLE_OPERATIONS[id]?.(context);
    emit();
    updateFormat();
  };

  const moveCell = (cell: HTMLTableCellElement, backwards: boolean) => {
    const cells = Array.from(
      cell.closest('table')?.querySelectorAll('th,td') ?? [],
    );
    const target = cells[cells.indexOf(cell) + (backwards ? -1 : 1)];
    const selection = document.getSelection();
    if (!target || !selection) return;
    const range = document.createRange();
    range.selectNodeContents(target);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const setMediaWidth = (percent: number) => {
    const element = mediaRef.current;
    if (!element) return;
    element.style.width = `${percent}%`;
    emit();
    force();
  };

  const setMediaAlign = (align: string) => {
    const element = mediaRef.current;
    if (!element) return;
    const [left, right] = ALIGN_MARGINS[align];
    element.style.display = 'block';
    element.style.marginLeft = left;
    element.style.marginRight = right;
    emit();
    force();
  };

  const setMediaAlt = (alt: string) => {
    const element = mediaRef.current;
    if (!element) return;
    element.setAttribute('alt', alt);
    emit();
    force();
  };

  const removeMedia = () => {
    mediaRef.current?.remove();
    selectMedia(null);
    emit();
  };

  const transformCase = (kind: 'upper' | 'lower' | 'title') => {
    restore();
    const text = document.getSelection()?.toString() ?? '';
    if (!text) return;
    const next =
      kind === 'upper'
        ? text.toUpperCase()
        : kind === 'lower'
          ? text.toLowerCase()
          : text
              .toLowerCase()
              .replace(
                /(^|\s)(\S)/g,
                (_match, space: string, char: string) =>
                  space + char.toUpperCase(),
              );
    document.execCommand('insertText', false, next);
    emit();
    updateFormat();
  };

  const applyLineHeight = (height: string) => {
    restore();
    const element = ref.current;
    const selection = document.getSelection();
    if (!element || !selection || !selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    element
      .querySelectorAll<HTMLElement>(
        'p,h1,h2,h3,h4,blockquote,pre,li,td,th,div',
      )
      .forEach((block) => {
        if (!range.intersectsNode(block)) return;
        if (height) block.style.lineHeight = height;
        else block.style.removeProperty('line-height');
        if (!block.getAttribute('style')) block.removeAttribute('style');
      });
    emit();
    updateFormat();
  };

  const insertChar = (char: string) => run('insertText', char);

  const renderChar = (char: string) => (
    <Button
      key={char}
      type="button"
      variant="ghost"
      size="icon"
      style={{ height: 32, width: 32, fontSize: 18 }}
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => insertChar(char)}
    >
      {char}
    </Button>
  );

  const stepFind = (delta: number) => {
    if (!findCount) return;
    setFindIndex(
      (index) =>
        (Math.min(index, findCount - 1) + delta + findCount) % findCount,
    );
  };

  const replaceRange = (range: Range, text: string) => {
    const node = range.startContainer;
    if (node.nodeType !== Node.TEXT_NODE) return;
    (node as Text).replaceData(
      range.startOffset,
      range.endOffset - range.startOffset,
      text,
    );
  };

  const replaceCurrent = () => {
    const ranges = findRanges.current;
    if (!ranges.length) return;
    const index = Math.min(findIndex, ranges.length - 1);
    replaceRange(ranges[index], replaceText);
    const keepsMatch = (
      matchCase ? replaceText : replaceText.toLowerCase()
    ).includes(matchCase ? findQuery : findQuery.toLowerCase());
    setFindIndex(keepsMatch ? index + 1 : index);
    emit();
    setFindTick((tick) => tick + 1);
  };

  const replaceAll = () => {
    const ranges = findRanges.current;
    if (!ranges.length) return;
    [...ranges].reverse().forEach((range) => replaceRange(range, replaceText));
    setFindIndex(0);
    emit();
    setFindTick((tick) => tick + 1);
  };

  const currentHtml = () => sanitizeHtml(lastEmitted.current);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      onSuccess?.('Copied to clipboard');
    } catch {
      onError?.('Failed to copy');
    }
  };

  const printContent = () => {
    const win = window.open('', '_blank');
    if (!win) {
      onError?.('Allow pop-ups to print');
      return;
    }
    win.document.write(buildExportDocument(currentHtml()));
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 300);
  };

  const markdownActions: Record<string, () => void> = {
    '#': () => run('formatBlock', '<h1>'),
    '##': () => run('formatBlock', '<h2>'),
    '###': () => run('formatBlock', '<h3>'),
    '####': () => run('formatBlock', '<h4>'),
    '>': () => run('formatBlock', '<blockquote>'),
    '-': () => run('insertUnorderedList'),
    '*': () => run('insertUnorderedList'),
    '1.': () => run('insertOrderedList'),
    '[]': toggleChecklist,
    '```': () => run('formatBlock', '<pre>'),
  };

  const performSlash = (key: string) => {
    switch (key) {
      case 'h1':
        return run('formatBlock', '<h1>');
      case 'h2':
        return run('formatBlock', '<h2>');
      case 'h3':
        return run('formatBlock', '<h3>');
      case 'bullet':
        return run('insertUnorderedList');
      case 'numbered':
        return run('insertOrderedList');
      case 'checklist':
        return toggleChecklist();
      case 'quote':
        return run('formatBlock', '<blockquote>');
      case 'code':
        return run('formatBlock', '<pre>');
      case 'divider':
        return run('insertHorizontalRule');
      case 'table':
        return insertHtml(buildTable(3, 3));
    }
  };

  const slashItems = slash
    ? SLASH_COMMANDS.filter(
        (item) =>
          !slash.query ||
          `${item.label} ${item.keywords}`
            .toLowerCase()
            .includes(slash.query.toLowerCase()),
      )
    : [];

  const syncFloating = () => {
    const element = ref.current;
    const selection = document.getSelection();
    const inEditor = Boolean(
      element &&
      selection &&
      selection.rangeCount &&
      selection.anchorNode &&
      selection.focusNode &&
      element.contains(selection.anchorNode) &&
      element.contains(selection.focusNode),
    );
    if (!element || !selection || !inEditor || mode !== 'visual' || disabled) {
      setBubble(null);
      setSlash(null);
      setSelectedCount(0);
      return;
    }

    if (selection.isCollapsed) {
      setBubble(null);
      setSelectedCount(0);
      const block = closestBlock(selection.anchorNode);
      if (block && (block.tagName === 'P' || block.tagName === 'DIV')) {
        const probe = document.createRange();
        probe.selectNodeContents(block);
        probe.setEnd(selection.anchorNode as Node, selection.anchorOffset);
        const match = /^\/([a-z0-9]*)$/i.exec(probe.toString());
        if (match) {
          if (slashDismissed.current) {
            setSlash(null);
            return;
          }
          const query = match[1].toLowerCase();
          if (slashQuery.current !== query) {
            slashQuery.current = query;
            setSlashIndex(0);
          }
          const rect = block.getBoundingClientRect();
          setSlash((prev) =>
            prev &&
            prev.query === query &&
            prev.top === rect.top &&
            prev.bottom === rect.bottom &&
            prev.left === rect.left
              ? prev
              : { query, top: rect.top, bottom: rect.bottom, left: rect.left },
          );
          return;
        }
      }
      slashDismissed.current = false;
      slashQuery.current = null;
      setSlash(null);
      return;
    }

    setSlash(null);
    const text = selection.toString().trim();
    setSelectedCount(text ? text.split(/\s+/).length : 0);
    if (mouseDown.current || mediaRef.current) {
      setBubble(null);
      return;
    }
    const rect = selection.getRangeAt(0).getBoundingClientRect();
    if (!rect.width && !rect.height) {
      setBubble(null);
      return;
    }
    const left = rect.left + rect.width / 2;
    setBubble((prev) =>
      prev &&
      prev.top === rect.top &&
      prev.bottom === rect.bottom &&
      prev.left === left
        ? prev
        : { top: rect.top, bottom: rect.bottom, left },
    );
  };
  React.useEffect(() => {
    syncRef.current = syncFloating;
  });

  const runSlash = (item: { key: string }) => {
    const selection = document.getSelection();
    if (!selection || !selection.rangeCount || !selection.anchorNode) return;
    const block = closestBlock(selection.anchorNode);
    if (!block) return;
    const range = document.createRange();
    range.selectNodeContents(block);
    range.setEnd(selection.anchorNode, selection.anchorOffset);
    range.deleteContents();
    if (!block.textContent) {
      block.innerHTML = '<br>';
      const caret = document.createRange();
      caret.setStart(block, 0);
      caret.collapse(true);
      selection.removeAllRanges();
      selection.addRange(caret);
    }
    slashQuery.current = null;
    slashDismissed.current = false;
    setSlash(null);
    performSlash(item.key);
  };

  React.useEffect(() => {
    const sync = () => syncRef.current();
    const release = () => {
      mouseDown.current = false;
      sync();
    };
    document.addEventListener('selectionchange', sync);
    document.addEventListener('mouseup', release);
    window.addEventListener('scroll', sync, true);
    window.addEventListener('resize', sync);
    return () => {
      document.removeEventListener('selectionchange', sync);
      document.removeEventListener('mouseup', release);
      window.removeEventListener('scroll', sync, true);
      window.removeEventListener('resize', sync);
    };
  }, []);

  React.useEffect(() => {
    document
      .querySelector('[data-rte-slash-active]')
      ?.scrollIntoView({ block: 'nearest' });
  }, [slashIndex, slash?.query]);

  React.useEffect(() => {
    const element = ref.current;
    if (!element || !maxLength) return;
    const handler = (event: InputEvent) => {
      if (event.inputType !== 'insertText') return;
      const selection = document.getSelection();
      if (selection && !selection.isCollapsed) return;
      if (element.innerText.replace(/\n/g, '').length >= maxLength)
        event.preventDefault();
    };
    element.addEventListener('beforeinput', handler);
    return () => element.removeEventListener('beforeinput', handler);
  }, [mode, maxLength]);

  const handleMarkdown = (event: React.KeyboardEvent) => {
    const selection = document.getSelection();
    if (
      !selection ||
      !selection.rangeCount ||
      !selection.isCollapsed ||
      !selection.anchorNode
    )
      return;
    const block = closestBlock(selection.anchorNode);
    if (!block || (block.tagName !== 'P' && block.tagName !== 'DIV')) return;
    const range = document.createRange();
    range.selectNodeContents(block);
    range.setEnd(selection.anchorNode, selection.anchorOffset);
    const action = markdownActions[range.toString()];
    if (!action) return;
    event.preventDefault();
    range.deleteContents();
    if (!block.textContent) {
      block.innerHTML = '<br>';
      const caret = document.createRange();
      caret.setStart(block, 0);
      caret.collapse(true);
      selection.removeAllRanges();
      selection.addRange(caret);
    }
    action();
  };

  const handleTab = (event: React.KeyboardEvent) => {
    const node = document.getSelection()?.anchorNode;
    if (closestIn(node, 'li')) {
      event.preventDefault();
      run(event.shiftKey ? 'outdent' : 'indent');
      return;
    }
    const cell = closestIn(node, 'td,th') as HTMLTableCellElement | null;
    if (cell) {
      event.preventDefault();
      moveCell(cell, event.shiftKey);
      return;
    }
    if (closestIn(node, 'pre')) {
      event.preventDefault();
      document.execCommand('insertText', false, '  ');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const mod = event.ctrlKey || event.metaKey;
    const key = event.key.toLowerCase();
    plainPaste.current = mod && event.shiftKey && key === 'v';
    if (slash && slashItems.length) {
      const count = slashItems.length;
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const step = event.key === 'ArrowDown' ? 1 : -1;
        setSlashIndex(
          (index) => (Math.min(index, count - 1) + step + count) % count,
        );
        return;
      }
      if (event.key === 'Enter' || event.key === 'Tab') {
        event.preventDefault();
        runSlash(slashItems[Math.min(slashIndex, count - 1)]);
        return;
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        event.nativeEvent.stopPropagation();
        slashDismissed.current = true;
        setSlash(null);
        return;
      }
    }
    if (mod && key === 'k') {
      event.preventDefault();
      setLinkOpen(true);
      prefillLink();
      return;
    }
    if (mod && event.shiftKey && key === 'x') {
      event.preventDefault();
      run('strikeThrough');
      return;
    }
    if (event.key === 'Tab') {
      handleTab(event);
      return;
    }
    if (event.key === ' ') {
      handleMarkdown(event);
      return;
    }
    if (event.key === 'Enter' && !event.shiftKey) {
      requestAnimationFrame(() => {
        const item = closestIn(document.getSelection()?.anchorNode, 'li');
        if (!item?.parentElement?.hasAttribute('data-checklist')) return;
        item.setAttribute('data-checked', 'false');
        emit();
      });
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    const plain = plainPaste.current;
    plainPaste.current = false;
    const files = Array.from(event.clipboardData.files).filter((file) =>
      /^(image|video)\//.test(file.type),
    );
    event.preventDefault();
    if (files.length) {
      void insertFiles(files);
      return;
    }
    const html = event.clipboardData.getData('text/html');
    if (html && !plain) {
      document.execCommand('insertHTML', false, sanitizeHtml(html));
      return;
    }
    const text = event.clipboardData.getData('text/plain');
    const url = text.trim();
    if (/^https?:\/\/\S+$/i.test(url)) {
      const selection = document.getSelection();
      if (selection && !selection.isCollapsed) {
        document.execCommand('createLink', false, url);
        return;
      }
      document.execCommand(
        'insertHTML',
        false,
        `<a href="${escapeHtml(url)}">${escapeHtml(url)}</a>&nbsp;`,
      );
      return;
    }
    document.execCommand('insertText', false, text);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    const files = Array.from(event.dataTransfer.files).filter((file) =>
      /^(image|video)\//.test(file.type),
    );
    if (!files.length) return;
    event.preventDefault();
    const positioned = document as unknown as {
      caretPositionFromPoint?: (
        x: number,
        y: number,
      ) => { offsetNode: Node; offset: number } | null;
    };
    let range: Range | null =
      document.caretRangeFromPoint?.(event.clientX, event.clientY) ?? null;
    const position = positioned.caretPositionFromPoint?.(
      event.clientX,
      event.clientY,
    );
    if (!range && position) {
      range = document.createRange();
      range.setStart(position.offsetNode, position.offset);
    }
    const selection = document.getSelection();
    if (range && selection) {
      selection.removeAllRanges();
      selection.addRange(range);
      saved.current = range.cloneRange();
    }
    void insertFiles(files);
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (['IMG', 'VIDEO', 'IFRAME'].includes(target.tagName)) {
      const range = document.createRange();
      range.selectNode(target);
      const selection = document.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      selectMedia(target);
      return;
    }
    selectMedia(null);
    if (disabled) return;
    const item = target.closest('li');
    if (!item || !item.parentElement?.hasAttribute('data-checklist')) return;
    const offset = event.clientX - item.getBoundingClientRect().left;
    if (offset < 0 || offset > 26) return;
    item.setAttribute(
      'data-checked',
      item.getAttribute('data-checked') === 'true' ? 'false' : 'true',
    );
    emit();
  };

  const handleInput = () => {
    if (mediaRef.current && !ref.current?.contains(mediaRef.current))
      selectMedia(null);
    emit();
    updateFormat();
  };

  const toggleSource = () => {
    if (mode === 'visual') {
      setSource(lastEmitted.current);
      setMode('source');
      return;
    }
    setMode('visual');
  };

  const toggleFullscreen = () => {
    if (!fullscreen) setFullscreenBackground(resolveBackground());
    setFullscreen((current) => !current);
  };

  const keepFocus = (event: React.MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (
      !event.currentTarget.contains(target) ||
      target.closest('input,textarea')
    )
      return;
    event.preventDefault();
  };

  const rootStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    borderRadius: 6,
    border: BORDER,
    opacity: disabled ? 0.6 : 1,
    ...(fullscreen
      ? {
          position: 'fixed',
          inset: 0,
          zIndex: 40,
          borderRadius: 0,
          backgroundColor: fullscreenBackground,
        }
      : null),
    ...style,
  };

  return (
    <TooltipProvider delayDuration={300}>
      <style>{CONTENT_CSS}</style>
      <div style={rootStyle}>
        <ToolbarContext.Provider value={toolsDisabled}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 2,
              padding: 6,
              borderBottom: BORDER,
              background: MUTED_BACKGROUND,
            }}
            onMouseDown={keepFocus}
          >
            <ToolButton label="Undo" icon={Undo2} onClick={() => run('undo')} />
            <ToolButton label="Redo" icon={Redo2} onClick={() => run('redo')} />
            <Divider />
            <Select
              value={fmt.block}
              onValueChange={applyBlock}
              disabled={toolsDisabled}
            >
              <SelectTrigger
                style={selectTriggerStyle(124)}
                aria-label="Block type"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                onCloseAutoFocus={(event) => event.preventDefault()}
              >
                {BLOCK_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value=""
              onValueChange={(font) => run('fontName', font, true)}
              disabled={toolsDisabled}
            >
              <SelectTrigger
                style={selectTriggerStyle(104)}
                aria-label="Font family"
              >
                <SelectValue placeholder="Font" />
              </SelectTrigger>
              <SelectContent
                onCloseAutoFocus={(event) => event.preventDefault()}
              >
                {FONT_FAMILIES.map((font) => (
                  <SelectItem
                    key={font}
                    value={font}
                    style={{ fontFamily: font }}
                  >
                    {font}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={FONT_SIZES.includes(fmt.size) ? fmt.size : ''}
              onValueChange={applyFontSize}
              disabled={toolsDisabled}
            >
              <SelectTrigger
                style={selectTriggerStyle(76)}
                aria-label="Font size"
              >
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent
                onCloseAutoFocus={(event) => event.preventDefault()}
              >
                {FONT_SIZES.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Divider />
            <ToolButton
              label="Bold (Ctrl+B)"
              icon={Bold}
              active={fmt.bold}
              onClick={() => run('bold')}
            />
            <ToolButton
              label="Italic (Ctrl+I)"
              icon={Italic}
              active={fmt.italic}
              onClick={() => run('italic')}
            />
            <ToolButton
              label="Underline (Ctrl+U)"
              icon={UnderlineIcon}
              active={fmt.underline}
              onClick={() => run('underline')}
            />
            <ToolButton
              label="Strikethrough (Ctrl+Shift+X)"
              icon={Strikethrough}
              active={fmt.strike}
              onClick={() => run('strikeThrough')}
            />
            <ToolButton
              label="Inline code"
              icon={Code}
              active={fmt.code}
              onClick={toggleInlineCode}
            />
            <ToolButton
              label="Subscript"
              icon={Subscript}
              active={fmt.sub}
              onClick={() => run('subscript')}
            />
            <ToolButton
              label="Superscript"
              icon={Superscript}
              active={fmt.sup}
              onClick={() => run('superscript')}
            />
            <Divider />
            <ColorTool
              label="Text color"
              icon={Baseline}
              colors={TEXT_COLORS}
              onPick={(color) => run('foreColor', color, true)}
              onReset={() => run('foreColor', 'currentColor', true)}
            />
            <ColorTool
              label="Highlight"
              icon={Highlighter}
              colors={HIGHLIGHT_COLORS}
              onPick={(color) => run('hiliteColor', color, true)}
              onReset={() => run('hiliteColor', 'transparent', true)}
            />
            <Divider />
            <ToolButton
              label="Align left"
              icon={AlignLeft}
              active={fmt.left}
              onClick={() => run('justifyLeft', undefined, true)}
            />
            <ToolButton
              label="Align center"
              icon={AlignCenter}
              active={fmt.center}
              onClick={() => run('justifyCenter', undefined, true)}
            />
            <ToolButton
              label="Align right"
              icon={AlignRight}
              active={fmt.right}
              onClick={() => run('justifyRight', undefined, true)}
            />
            <ToolButton
              label="Justify"
              icon={AlignJustify}
              active={fmt.justify}
              onClick={() => run('justifyFull', undefined, true)}
            />
            <Divider />
            <ToolButton
              label="Bullet list"
              icon={List}
              active={fmt.ul && !fmt.check}
              onClick={() => run('insertUnorderedList')}
            />
            <ToolButton
              label="Numbered list"
              icon={ListOrdered}
              active={fmt.ol}
              onClick={() => run('insertOrderedList')}
            />
            <ToolButton
              label="Checklist"
              icon={ListChecks}
              active={fmt.check}
              onClick={toggleChecklist}
            />
            <ToolButton
              label="Decrease indent"
              icon={IndentDecrease}
              onClick={() => run('outdent', undefined, true)}
            />
            <ToolButton
              label="Increase indent"
              icon={IndentIncrease}
              onClick={() => run('indent', undefined, true)}
            />
            <Divider />
            <ToolPopover
              label="Link (Ctrl+K)"
              icon={Link2}
              active={fmt.link}
              open={linkOpen}
              onOpenChange={setLinkOpen}
              onOpen={prefillLink}
            >
              {(close) => (
                <div style={columnStyle(12)}>
                  <div style={columnStyle(6)}>
                    <Label htmlFor={`${uid}-link-url`}>URL</Label>
                    <Input
                      id={`${uid}-link-url`}
                      value={linkUrl}
                      placeholder="https://example.com"
                      onChange={(event) => setLinkUrl(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key !== 'Enter') return;
                        event.preventDefault();
                        applyLink();
                        close();
                      }}
                    />
                  </div>
                  <div style={columnStyle(6)}>
                    <Label htmlFor={`${uid}-link-text`}>Text</Label>
                    <Input
                      id={`${uid}-link-text`}
                      value={linkText}
                      placeholder="Link text"
                      onChange={(event) => setLinkText(event.target.value)}
                    />
                  </div>
                  <div
                    style={{
                      ...rowStyle(8),
                      justifyContent: 'space-between',
                    }}
                  >
                    <Label htmlFor={`${uid}-link-tab`}>Open in new tab</Label>
                    <Switch
                      id={`${uid}-link-tab`}
                      checked={linkNewTab}
                      onCheckedChange={setLinkNewTab}
                    />
                  </div>
                  <div style={{ ...rowStyle(8), justifyContent: 'flex-end' }}>
                    {fmt.link && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          run('unlink');
                          close();
                        }}
                      >
                        Remove
                      </Button>
                    )}
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        applyLink();
                        close();
                      }}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              )}
            </ToolPopover>
            <ToolButton
              label="Remove link"
              icon={Unlink}
              disabled={!fmt.link}
              onClick={() => run('unlink')}
            />
            <ToolPopover label="Image" icon={ImageIcon} width={320}>
              {(close) => (
                <Tabs defaultValue="upload" style={columnStyle(12)}>
                  <TabsList
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      width: '100%',
                    }}
                  >
                    <TabsTrigger value="upload">Upload</TabsTrigger>
                    <TabsTrigger value="url">URL</TabsTrigger>
                  </TabsList>
                  <TabsContent value="upload">
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(event) => {
                        const files = Array.from(event.target.files ?? []);
                        event.target.value = '';
                        close();
                        void insertFiles(files);
                      }}
                    />
                  </TabsContent>
                  <TabsContent value="url" style={columnStyle(12)}>
                    <Input
                      value={imageUrl}
                      placeholder="https://example.com/image.png"
                      onChange={(event) => setImageUrl(event.target.value)}
                    />
                    <Input
                      value={imageAlt}
                      placeholder="Alt text"
                      onChange={(event) => setImageAlt(event.target.value)}
                    />
                    <Button
                      type="button"
                      size="sm"
                      style={{ width: '100%' }}
                      disabled={!imageUrl.trim()}
                      onClick={() => {
                        insertImage(imageUrl, imageAlt);
                        setImageUrl('');
                        setImageAlt('');
                        close();
                      }}
                    >
                      Insert image
                    </Button>
                  </TabsContent>
                </Tabs>
              )}
            </ToolPopover>
            <ToolPopover label="Video" icon={VideoIcon} width={320}>
              {(close) => (
                <Tabs defaultValue="url" style={columnStyle(12)}>
                  <TabsList
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      width: '100%',
                    }}
                  >
                    <TabsTrigger value="url">URL</TabsTrigger>
                    <TabsTrigger value="upload">Upload</TabsTrigger>
                  </TabsList>
                  <TabsContent value="url" style={columnStyle(12)}>
                    <Input
                      value={videoUrl}
                      placeholder="YouTube, Vimeo or .mp4 link"
                      onChange={(event) => setVideoUrl(event.target.value)}
                    />
                    <Button
                      type="button"
                      size="sm"
                      style={{ width: '100%' }}
                      disabled={!videoUrl.trim()}
                      onClick={() => {
                        insertVideo(videoUrl);
                        setVideoUrl('');
                        close();
                      }}
                    >
                      Insert video
                    </Button>
                  </TabsContent>
                  <TabsContent value="upload">
                    <Input
                      type="file"
                      accept="video/*"
                      onChange={(event) => {
                        const files = Array.from(event.target.files ?? []);
                        event.target.value = '';
                        close();
                        void insertFiles(files);
                      }}
                    />
                  </TabsContent>
                </Tabs>
              )}
            </ToolPopover>
            <ToolPopover label="Table" icon={TableIcon} width="auto">
              {(close) => (
                <div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(8, 20px)',
                      gap: 4,
                    }}
                    onMouseLeave={() => setTableHover({ rows: 0, cols: 0 })}
                  >
                    {Array.from({ length: 64 }, (_, index) => {
                      const rows = Math.floor(index / 8) + 1;
                      const cols = (index % 8) + 1;
                      const on =
                        rows <= tableHover.rows && cols <= tableHover.cols;
                      return (
                        <button
                          key={index}
                          type="button"
                          aria-label={`${rows} by ${cols} table`}
                          style={{
                            height: 20,
                            width: 20,
                            padding: 0,
                            borderRadius: 2,
                            border: BORDER,
                            cursor: 'pointer',
                            background: on ? 'currentColor' : 'transparent',
                          }}
                          onMouseEnter={() => setTableHover({ rows, cols })}
                          onClick={() => {
                            insertHtml(buildTable(rows, cols));
                            close();
                          }}
                        />
                      );
                    })}
                  </div>
                  <p
                    style={{
                      marginTop: 8,
                      textAlign: 'center',
                      fontSize: 12,
                      opacity: 0.7,
                    }}
                  >
                    {tableHover.rows} × {tableHover.cols}
                  </p>
                </div>
              )}
            </ToolPopover>
            {fmt.inTable && (
              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        style={iconButtonStyle}
                        aria-label="Table options"
                      >
                        <TableProperties style={iconStyle} />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Table options</TooltipContent>
                </Tooltip>
                <DropdownMenuContent
                  onCloseAutoFocus={(event) => event.preventDefault()}
                >
                  {TABLE_ACTIONS.map((action) => (
                    <React.Fragment key={action.label}>
                      {action.label === 'Delete row' && (
                        <DropdownMenuSeparator />
                      )}
                      <DropdownMenuItem
                        style={
                          action.destructive ? { color: DANGER } : undefined
                        }
                        onSelect={() => runTableAction(action.id)}
                      >
                        {action.label}
                      </DropdownMenuItem>
                    </React.Fragment>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <ToolButton
              label="Divider"
              icon={Minus}
              onClick={() => run('insertHorizontalRule')}
            />
            <ToolButton
              label="Clear formatting"
              icon={RemoveFormatting}
              onClick={clearFormatting}
            />
            <Divider />
            <ToolMenu
              label="Change case"
              icon={TypeIcon}
              items={[
                {
                  key: 'upper',
                  label: 'UPPERCASE',
                  onSelect: () => transformCase('upper'),
                },
                {
                  key: 'lower',
                  label: 'lowercase',
                  onSelect: () => transformCase('lower'),
                },
                {
                  key: 'title',
                  label: 'Title Case',
                  onSelect: () => transformCase('title'),
                },
              ]}
            />
            <ToolMenu
              label="Line height"
              icon={ArrowUpDown}
              items={[
                ...LINE_HEIGHTS.map((height) => ({
                  key: height,
                  label: height,
                  onSelect: () => applyLineHeight(height),
                })),
                {
                  key: 'default',
                  label: 'Default',
                  separatorBefore: true,
                  onSelect: () => applyLineHeight(''),
                },
              ]}
            />
            <ToolPopover label="Emoji & symbols" icon={Smile} width={320}>
              {() => (
                <Tabs defaultValue="emoji" style={columnStyle(12)}>
                  <TabsList
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      width: '100%',
                    }}
                  >
                    <TabsTrigger value="emoji">Emoji</TabsTrigger>
                    <TabsTrigger value="symbols">Symbols</TabsTrigger>
                  </TabsList>
                  <TabsContent value="emoji">
                    <div style={charGridStyle}>{EMOJIS.map(renderChar)}</div>
                  </TabsContent>
                  <TabsContent value="symbols">
                    <div style={charGridStyle}>{SYMBOLS.map(renderChar)}</div>
                  </TabsContent>
                </Tabs>
              )}
            </ToolPopover>
            <ToolPopover
              label="Find & replace"
              icon={Search}
              width={320}
              open={findOpen}
              onOpenChange={setFindOpen}
            >
              {() => (
                <div style={columnStyle(12)}>
                  <div style={columnStyle(6)}>
                    <Label htmlFor={`${uid}-find`}>Find</Label>
                    <Input
                      id={`${uid}-find`}
                      value={findQuery}
                      placeholder="Search text"
                      onChange={(event) => {
                        setFindQuery(event.target.value);
                        setFindIndex(0);
                      }}
                      onKeyDown={(event) => {
                        if (event.key !== 'Enter') return;
                        event.preventDefault();
                        stepFind(event.shiftKey ? -1 : 1);
                      }}
                    />
                  </div>
                  <div style={columnStyle(6)}>
                    <Label htmlFor={`${uid}-replace`}>Replace with</Label>
                    <Input
                      id={`${uid}-replace`}
                      value={replaceText}
                      placeholder="Replacement"
                      onChange={(event) => setReplaceText(event.target.value)}
                    />
                  </div>
                  <div
                    style={{ ...rowStyle(6), justifyContent: 'space-between' }}
                  >
                    <div style={rowStyle(4)}>
                      <Button
                        type="button"
                        size="sm"
                        variant={matchCase ? 'secondary' : 'outline'}
                        aria-pressed={matchCase}
                        aria-label="Match case"
                        style={{ height: 28, padding: '0 8px', fontSize: 12 }}
                        onClick={() => {
                          setMatchCase((current) => !current);
                          setFindIndex(0);
                        }}
                      >
                        Aa
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        style={smallIconButtonStyle}
                        aria-label="Previous match"
                        disabled={!findCount}
                        onClick={() => stepFind(-1)}
                      >
                        <ChevronUp style={iconStyle} />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        style={smallIconButtonStyle}
                        aria-label="Next match"
                        disabled={!findCount}
                        onClick={() => stepFind(1)}
                      >
                        <ChevronDown style={iconStyle} />
                      </Button>
                    </div>
                    <span style={{ fontSize: 12, opacity: 0.7 }}>
                      {findQuery
                        ? findCount
                          ? `${Math.min(findIndex, findCount - 1) + 1} / ${findCount}`
                          : 'No matches'
                        : ''}
                    </span>
                  </div>
                  <div style={{ ...rowStyle(8), justifyContent: 'flex-end' }}>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={!findCount}
                      onClick={replaceCurrent}
                    >
                      Replace
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      disabled={!findCount}
                      onClick={replaceAll}
                    >
                      Replace all
                    </Button>
                  </div>
                </div>
              )}
            </ToolPopover>
            <div style={{ ...rowStyle(2), marginLeft: 'auto' }}>
              <ToolMenu
                label="Export"
                icon={Download}
                ignoreToolbarDisabled
                items={[
                  {
                    key: 'copy-html',
                    label: 'Copy HTML',
                    onSelect: () => void copyToClipboard(currentHtml()),
                  },
                  {
                    key: 'copy-text',
                    label: 'Copy plain text',
                    onSelect: () =>
                      void copyToClipboard(htmlToText(currentHtml())),
                  },
                  {
                    key: 'download',
                    label: 'Download .html',
                    separatorBefore: true,
                    onSelect: () =>
                      downloadFile(
                        'document.html',
                        buildExportDocument(currentHtml()),
                        'text/html',
                      ),
                  },
                  { key: 'print', label: 'Print', onSelect: printContent },
                ]}
              />
              <ToolPopover label="Reset content" icon={RotateCcw} width={240}>
                {(close) => (
                  <div style={columnStyle(12)}>
                    <p style={{ fontSize: 14 }}>
                      Reset the editor to its initial content?
                    </p>
                    <div style={{ ...rowStyle(8), justifyContent: 'flex-end' }}>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={close}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          resetContent();
                          close();
                        }}
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                )}
              </ToolPopover>
              <ToolButton
                label="HTML source"
                icon={CodeXml}
                active={mode === 'source'}
                disabled={disabled}
                ignoreToolbarDisabled
                onClick={toggleSource}
              />
              <ToolButton
                label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                icon={fullscreen ? Minimize2 : Maximize2}
                disabled={false}
                ignoreToolbarDisabled
                onClick={toggleFullscreen}
              />
            </div>
          </div>
        </ToolbarContext.Provider>

        {media && mode === 'visual' && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 4,
              padding: '6px 8px',
              borderBottom: BORDER,
              background: MUTED_BACKGROUND,
            }}
            onMouseDown={keepFocus}
          >
            <span
              style={{
                marginRight: 4,
                fontSize: 12,
                fontWeight: 500,
                opacity: 0.7,
              }}
            >
              {media.tagName === 'IMG' ? 'Image' : 'Video'}
            </span>
            {[25, 50, 75, 100].map((percent) => (
              <Button
                key={percent}
                type="button"
                size="sm"
                variant={
                  media.style.width === `${percent}%` ? 'secondary' : 'ghost'
                }
                style={{ height: 28, padding: '0 8px', fontSize: 12 }}
                onClick={() => setMediaWidth(percent)}
              >
                {percent}%
              </Button>
            ))}
            <Separator
              orientation="vertical"
              style={{ margin: '0 4px', height: 20, width: 1 }}
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              style={smallIconButtonStyle}
              aria-label="Align left"
              onClick={() => setMediaAlign('left')}
            >
              <AlignLeft style={iconStyle} />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              style={smallIconButtonStyle}
              aria-label="Align center"
              onClick={() => setMediaAlign('center')}
            >
              <AlignCenter style={iconStyle} />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              style={smallIconButtonStyle}
              aria-label="Align right"
              onClick={() => setMediaAlign('right')}
            >
              <AlignRight style={iconStyle} />
            </Button>
            {media.tagName === 'IMG' && (
              <Input
                value={media.getAttribute('alt') ?? ''}
                placeholder="Alt text"
                style={{ marginLeft: 4, height: 28, width: 176, fontSize: 12 }}
                onChange={(event) => setMediaAlt(event.target.value)}
              />
            )}
            <div style={{ ...rowStyle(4), marginLeft: 'auto' }}>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                style={{ ...smallIconButtonStyle, color: DANGER }}
                aria-label="Delete"
                onClick={removeMedia}
              >
                <Trash2 style={iconStyle} />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                style={smallIconButtonStyle}
                aria-label="Close"
                onClick={() => selectMedia(null)}
              >
                <X style={iconStyle} />
              </Button>
            </div>
          </div>
        )}

        <div
          style={{
            position: 'relative',
            overflow: 'auto',
            flex: fullscreen ? 1 : undefined,
            maxHeight: fullscreen ? undefined : maxHeight,
          }}
        >
          {mode === 'visual' ? (
            <>
              {isEmpty && (
                <div
                  style={{
                    position: 'absolute',
                    left: 16,
                    top: 12,
                    pointerEvents: 'none',
                    opacity: 0.5,
                  }}
                >
                  {placeholder}
                </div>
              )}
              <div
                ref={ref}
                contentEditable={!disabled}
                suppressContentEditableWarning
                spellCheck
                role="textbox"
                aria-multiline="true"
                aria-label="Rich text editor"
                className="rte-content rte-editor"
                style={{ padding: '12px 16px', minHeight }}
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                onDrop={handleDrop}
                onMouseDown={() => {
                  mouseDown.current = true;
                  setBubble(null);
                }}
                onClick={handleClick}
              />
            </>
          ) : (
            <Textarea
              value={source}
              spellCheck={false}
              style={{
                width: '100%',
                minHeight,
                borderRadius: 0,
                border: 0,
                boxShadow: 'none',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                fontSize: 14,
              }}
              onChange={(event) => {
                setSource(event.target.value);
                const clean = sanitizeHtml(event.target.value);
                lastEmitted.current = clean;
                onChange(clean);
              }}
            />
          )}
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            padding: '6px 12px',
            borderTop: BORDER,
            background: MUTED_BACKGROUND,
            fontSize: 12,
            opacity: 0.8,
          }}
        >
          <span>
            {stats.words} words,{' '}
            <span
              style={{
                color:
                  maxLength && stats.chars > maxLength ? DANGER : undefined,
              }}
            >
              {stats.chars}
              {maxLength ? ` / ${maxLength}` : ''}
            </span>{' '}
            characters
            {stats.words > 0 &&
              ` · ${Math.max(1, Math.ceil(stats.words / 200))} min read`}
            {selectedCount > 0 && ` · ${selectedCount} selected`}
          </span>
          <span>Ctrl+K link, / commands, # heading, - list, [] checklist</span>
        </div>
      </div>

      {bubble && mode === 'visual' && !disabled && (
        <div
          className="bg-popover text-popover-foreground rounded-md border shadow-md"
          role="toolbar"
          aria-label="Text formatting"
          style={{
            position: 'fixed',
            zIndex: 60,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            padding: 4,
            left: Math.min(
              Math.max(bubble.left, 200),
              Math.max(200, window.innerWidth - 200),
            ),
            ...(bubble.top < 56
              ? { top: bubble.bottom + 8, transform: 'translateX(-50%)' }
              : { top: bubble.top - 8, transform: 'translate(-50%, -100%)' }),
          }}
          onMouseDown={keepFocus}
        >
          <BubbleButton
            label="Bold"
            icon={Bold}
            active={fmt.bold}
            onClick={() => run('bold')}
          />
          <BubbleButton
            label="Italic"
            icon={Italic}
            active={fmt.italic}
            onClick={() => run('italic')}
          />
          <BubbleButton
            label="Underline"
            icon={UnderlineIcon}
            active={fmt.underline}
            onClick={() => run('underline')}
          />
          <BubbleButton
            label="Strikethrough"
            icon={Strikethrough}
            active={fmt.strike}
            onClick={() => run('strikeThrough')}
          />
          <BubbleButton
            label="Inline code"
            icon={Code}
            active={fmt.code}
            onClick={toggleInlineCode}
          />
          <Divider />
          <BubbleButton
            label="Link"
            icon={Link2}
            active={fmt.link}
            onClick={() => {
              setLinkOpen(true);
              prefillLink();
            }}
          />
          <BubbleButton
            label="Highlight"
            icon={Highlighter}
            onClick={() => run('hiliteColor', HIGHLIGHT_COLORS[0], true)}
          />
          <Divider />
          <BubbleButton
            label="Heading 1"
            icon={Heading1}
            active={fmt.block === 'h1'}
            onClick={() => applyBlock(fmt.block === 'h1' ? 'p' : 'h1')}
          />
          <BubbleButton
            label="Heading 2"
            icon={Heading2}
            active={fmt.block === 'h2'}
            onClick={() => applyBlock(fmt.block === 'h2' ? 'p' : 'h2')}
          />
          <BubbleButton
            label="Quote"
            icon={Quote}
            active={fmt.block === 'blockquote'}
            onClick={() =>
              applyBlock(fmt.block === 'blockquote' ? 'p' : 'blockquote')
            }
          />
          <Divider />
          <BubbleButton
            label="Clear formatting"
            icon={RemoveFormatting}
            onClick={clearFormatting}
          />
        </div>
      )}

      {slash && mode === 'visual' && !disabled && slashItems.length > 0 && (
        <div
          className="bg-popover text-popover-foreground rounded-md border shadow-md"
          role="listbox"
          aria-label="Commands"
          style={{
            position: 'fixed',
            zIndex: 60,
            width: 232,
            maxHeight: 280,
            overflowY: 'auto',
            padding: 4,
            left: Math.max(8, Math.min(slash.left, window.innerWidth - 240)),
            ...(slash.bottom + 288 > window.innerHeight && slash.top > 296
              ? { bottom: window.innerHeight - slash.top + 4 }
              : { top: slash.bottom + 4 }),
          }}
          onMouseDown={(event) => event.preventDefault()}
        >
          {slashItems.map((item, index) => {
            const active =
              index === Math.min(slashIndex, slashItems.length - 1);
            return (
              <button
                key={item.key}
                type="button"
                role="option"
                aria-selected={active}
                data-rte-slash-active={active ? 'true' : undefined}
                onMouseEnter={() => setSlashIndex(index)}
                onClick={() => runSlash(item)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  width: '100%',
                  padding: '6px 8px',
                  border: 0,
                  borderRadius: 4,
                  color: 'inherit',
                  textAlign: 'left',
                  cursor: 'pointer',
                  background: active
                    ? 'color-mix(in srgb, currentColor 10%, transparent)'
                    : 'transparent',
                }}
              >
                <span style={{ fontSize: 14 }}>{item.label}</span>
                <span style={{ fontSize: 12, opacity: 0.6 }}>{item.hint}</span>
              </button>
            );
          })}
        </div>
      )}
    </TooltipProvider>
  );
}

export function RichTextViewer({
  value,
  style,
}: {
  value: string;
  style?: React.CSSProperties;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (ref.current) ref.current.innerHTML = sanitizeHtml(value);
  }, [value]);
  return (
    <>
      <style>{CONTENT_CSS}</style>
      <div ref={ref} className="rte-content" style={style} />
    </>
  );
}
