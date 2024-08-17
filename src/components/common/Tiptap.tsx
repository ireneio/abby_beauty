import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { useEffect } from 'react'

type Props = any

const Tiptap = ({ setValue, name, initialContent }: Props) => {
  const editor = useEditor({
    extensions: [Document, Paragraph, Text],
    editorProps: {
        attributes: {
          class: 'min-h-[6rem] rounded-lg border border-zinc-950/10 data-[hover]:border-zinc-950/20 dark:border-white/10 dark:data-[hover]:border-white/20 bg-transparent dark:bg-white/5 px-[calc(theme(spacing[3.5])-1px)] py-[calc(theme(spacing[2.5])-1px)] sm:px-[calc(theme(spacing[3])-1px)] sm:py-[calc(theme(spacing[1.5])-1px)] focus:outline-none',
        },
      },
    content: '',
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      // Update the form field value
      setValue(name, content);
    },
  })

  useEffect(() => {    
    if (editor && initialContent) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  return <EditorContent editor={editor} />
}

export default Tiptap
