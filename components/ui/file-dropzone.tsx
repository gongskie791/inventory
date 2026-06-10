"use client"

import { Upload } from "lucide-react"
import { useRef, useState } from "react"

export function FileDropzone() {
    // tracks if user is dragging a file over the zone
    const [isDragging, setIsDragging] = useState(false)
    // stores the file the user picked or dropped
    const [preview, setPreview] = useState<string | null>(null)
    // reference to the hidden file input so we can click it programmatically
    const inputRef = useRef<HTMLInputElement>(null)

    function pickFile(picked: File) {
        setPreview(URL.createObjectURL(picked))
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault()
        setIsDragging(false)
        const dropped = e.dataTransfer.files[0]
        if (dropped) pickFile(dropped)
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const selected = e.target.files?.[0]
        if (selected) pickFile(selected)
    }

    return (
        <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg overflow-hidden cursor-pointer transition-colors
                ${isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-white hover:bg-gray-50"} col-span-2`}
        >
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleChange}
            />

            {preview ? (
                // show the image preview
                <img src={preview} alt="preview" className="w-full h-48 object-cover" />
            ) : (
                <div className="flex flex-col items-center gap-2 p-10">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <p className="text-sm text-gray-700 font-medium">
                        Drag & Drop or{" "}
                        <span className="text-blue-500">Choose file</span>{" "}
                        to upload
                    </p>
                    <p className="text-xs text-gray-400">PNG, JPG, WEBP</p>
                </div>
            )}
        </div>
    )
}
