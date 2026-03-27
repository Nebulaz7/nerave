import { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp, Code2 } from 'lucide-react';

interface SDKCodePanelProps {
  title?: string;
  code: string;
  defaultOpen?: boolean;
}

export default function SDKCodePanel({ title = 'SDK Code', code, defaultOpen = false }: SDKCodePanelProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Simple syntax highlighting
  function highlight(raw: string): string {
    return raw
      .replace(/(\/\/.*)/g, '<span class="comment">$1</span>')
      .replace(/\b(import|from|const|let|var|await|async|new|return|if|else|export|function|try|catch)\b/g, '<span class="keyword">$1</span>')
      .replace(/('[^']*'|"[^"]*"|`[^`]*`)/g, '<span class="string">$1</span>')
      .replace(/\b(\d+)\b/g, '<span class="number">$1</span>')
      .replace(/(\.\w+)\s*\(/g, '<span class="function">$1</span>(');
  }

  return (
    <div className="sdk-panel">
      <div className="sdk-panel-header" onClick={() => setOpen(!open)}>
        <div className="sdk-label">
          <Code2 size={14} />
          {title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {open && (
            <button className="copy-btn" onClick={(e) => { e.stopPropagation(); handleCopy(); }}>
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          )}
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>
      {open && (
        <div className="sdk-panel-body">
          <pre dangerouslySetInnerHTML={{ __html: highlight(code) }} />
        </div>
      )}
    </div>
  );
}
