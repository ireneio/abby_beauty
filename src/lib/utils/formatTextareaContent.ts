export default function formatTextareaContent(content: string) {
    return content.replaceAll('\n\n', '<br /><br />').replaceAll('\n', '<br />')
}
