'use client';

import * as runtime from 'react/jsx-runtime';
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  CodeBlock,
  CodeBlockCode,
  CodeBlockGroup,
} from '@/app/components/blog/code-block';

const useMDXComponent = (code: string) => {
  const fn = new Function(code);
  return fn({ ...runtime }).default;
};

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      aria-label={copied ? 'Copied' : 'Copy code'}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}

function BlogLink({
  href,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isExternal = href?.startsWith('http');
  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="group relative inline-flex w-fit items-center select-none text-foreground font-normal before:pointer-events-none before:absolute before:left-0 before:top-[1.5em] before:h-[0.05em] before:w-full before:bg-current before:content-[''] before:origin-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)] hover:before:origin-right hover:before:scale-x-100"
      {...props}
    >
      <span>{children}</span>
      <svg
        className="ml-[0.3em] size-[0.55em]"
        fill="none"
        viewBox="0 0 10 10"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}

function HeadingLink({
  href,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={href}
      className="group relative inline-flex w-fit items-center select-none text-foreground no-underline before:pointer-events-none before:absolute before:left-0 before:top-[1.5em] before:h-[0.05em] before:w-full before:bg-current before:content-[''] before:origin-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)] hover:before:origin-right hover:before:scale-x-100"
      {...props}
    >
      <span>{children}</span>
      <svg
        className="ml-[0.3em] size-[0.55em] translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:transition-none"
        fill="none"
        viewBox="0 0 10 10"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}

function createHeading(level: 2 | 3 | 4) {
  const Tag = `h${level}` as const;
  return function Heading({
    children,
    id,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) {
    const getTextContent = (node: React.ReactNode): string => {
      if (typeof node === 'string') return node;
      if (typeof node === 'number') return String(node);
      if (Array.isArray(node)) return node.map(getTextContent).join('');
      if (node && typeof node === 'object' && 'props' in node) {
        const element = node as React.ReactElement<{
          children?: React.ReactNode;
        }>;
        return getTextContent(element.props.children);
      }
      return '';
    };

    const text = getTextContent(children);

    return (
      <Tag id={id} {...props}>
        {id ? <HeadingLink href={`#${id}`}>{text}</HeadingLink> : children}
      </Tag>
    );
  };
}

const mdxComponents = {
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  pre: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  code: ({
    className,
    children,
    ...props
  }: {
    className?: string;
    children?: React.ReactNode;
  } & React.HTMLAttributes<HTMLElement>) => {
    const match = /language-(\w+)/.exec(className || '');
    if (match) {
      const code = String(children).trim();
      return (
        <CodeBlock className="my-4">
          <CodeBlockGroup className="border-b border-border px-4 py-2">
            <span className="text-xs text-muted-foreground">{match[1]}</span>
            <CopyButton code={code} />
          </CodeBlockGroup>
          <CodeBlockCode code={code} language={match[1]} />
        </CodeBlock>
      );
    }
    return (
      <code
        className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground"
        {...props}
      >
        {children}
      </code>
    );
  },
  a: BlogLink,
};

export function PostContent({ content }: { content: string }) {
  const Component = useMDXComponent(content);

  return (
    <div
      className={cn(
        'prose prose-neutral max-w-none',
        'prose-headings:font-noto-serif prose-headings:tracking-tight prose-headings:font-semibold prose-headings:text-foreground [&_:is(h2,h3,h4)_a]:text-foreground',
        'prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4',
        'prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3',
        'prose-p:text-foreground prose-p:leading-7',
        'prose-a:no-underline prose-a:text-foreground',
        'prose-strong:text-foreground prose-strong:font-semibold',
        'prose-ul:text-foreground prose-ol:text-foreground',
        'prose-li:text-foreground prose-li:marker:text-muted-foreground',
        'prose-blockquote:border-l-border prose-blockquote:text-muted-foreground prose-blockquote:not-italic',
        'prose-hr:border-border',
        'prose-pre:bg-transparent prose-pre:p-0',
        'prose-code:before:content-none prose-code:after:content-none prose-code:text-foreground prose-code:bg-muted',
        'prose-img:rounded-lg',
        'prose-table:text-foreground prose-th:text-foreground prose-td:text-foreground prose-thead:border-border prose-tr:border-border',
      )}
    >
      <Component components={mdxComponents} />
    </div>
  );
}
