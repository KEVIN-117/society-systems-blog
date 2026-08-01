import ReactMarkdown from 'react-markdown'
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import 'katex/dist/katex.min.css'


type Props = {
    content: string
}

export default function Post({ content }: Props) {

    return (
        <div className="p-6 border border-white/5 rounded-xl bg-black/20 shadow-inner">
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeRaw, rehypeKatex]}
                components={{
                    h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2 font-heading" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-white mt-6 mb-3 font-heading" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-xl font-bold text-white mt-5 mb-2 font-heading" {...props} />,
                    p: ({ node, ...props }) => <p className="mb-4 text-gray-300" {...props} />,
                    a: ({ node, ...props }) => <a className="text-[#00b4db] hover:text-[#72004c] underline transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 space-y-1 text-gray-300" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-300" {...props} />,
                    li: ({ node, ...props }) => <li className="marker:text-[#72004c]" {...props} />,
                    blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-[#72004c] pl-4 py-1 italic bg-[#72004c]/10 text-gray-400 mb-4 rounded-r-lg" {...props} />,
                    code: ({ node, inline, className, children, ...props }: any) => {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline && match ? (
                            <SyntaxHighlighter
                                style={oneDark}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        )
                    },
                    img: ({ node, ...props }) => <img className="rounded-xl shadow-lg border border-white/10 mx-auto my-6 max-w-full h-auto" loading="lazy" {...props} />,
                    table: ({ node, ...props }) => <div className="overflow-x-auto mb-4"><table className="w-full text-left border-collapse" {...props} /></div>,
                    th: ({ node, ...props }) => <th className="border-b border-white/10 p-3 bg-black/40 text-white font-medium" {...props} />,
                    td: ({ node, ...props }) => <td className="border-b border-white/5 p-3 text-gray-300" {...props} />
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    )
}
