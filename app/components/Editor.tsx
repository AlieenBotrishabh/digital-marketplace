"use client";

import { Button } from '@/components/ui/button';
import { EditorContent, JSONContent, useEditor, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export const MenuBar = ({editor} : {editor : Editor | null}) => {
    if(!editor)
    {
        return null;
    }

    return (
        <div className='flex flex-wrap gap-5'>
            <Button className={editor.isActive("heading", { level: 1 }) ? "bg-blue-600" : "bg-gray-100"} onClick={() => editor.chain().focus().toggleHeading({level : 1}).run()} type='button'>H1</Button>
            <Button className={editor.isActive("heading", { level: 2 }) ? "bg-blue-600" : "bg-gray-100"} onClick={() => editor.chain().focus().toggleHeading({level : 2}).run()} type='button'>H2</Button>
            <Button className={editor.isActive("heading", { level: 3 }) ? "bg-blue-600" : "bg-gray-100"} onClick={() => editor.chain().focus().toggleHeading({level : 3}).run()} type='button'>H3</Button>
            <Button className={editor.isActive("bold") ? "bg-blue-600" : "bg-gray-100"} onClick={() => editor.chain().focus().toggleBold().run()} type='button'>Bold</Button>
            <Button className={editor.isActive("italic") ? "bg-blue-600" : "bg-gray-100"} onClick={() => editor.chain().focus().toggleItalic().run()} type='button'>Italic</Button>
            <Button className={editor.isActive("strike") ? "bg-blue-600" : "bg-gray-100"} onClick={() => editor.chain().focus().toggleStrike().run()} type='button'>Strike</Button>
        </div>
    )
}

export function TipTapEditor({setJson, json} : {setJson : any, json : JSONContent | null})
{
    const editor = useEditor({
        extensions: [StarterKit],
        content: json ?? "<p>Hello World</p>",
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: "focus:outline-none min-h-[150px] prose prose-sm sm:prose-base"
            }
        },
        onUpdate : ({editor}) => {
        setJson(editor.getJSON());
        }
    })

    return (
        <div>
            <MenuBar editor={editor} />
            <EditorContent className='rounded-lg border border-gray-200 m-2 p-2 min-h-[150px mt-2]' editor={editor} />
        </div>
    )
}