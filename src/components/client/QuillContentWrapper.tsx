export default function QuillContentWrapper({ content }: { content: string }) {
    return (
        <div className="ql-snow">
            <div
                className="ql-editor"
                style={{ padding: 0 }}
                dangerouslySetInnerHTML={{ __html: content }}
            >
            </div>
        </div>
    )
}