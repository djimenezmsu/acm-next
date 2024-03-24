'use client'
import { useEffect, useRef, useState } from "react"
import { Icon } from "../material/icon"

export function ImageInput(
    {
        name
    }:
        {
            name: string
        }
) {
    const hiddenRef = useRef(null as HTMLInputElement | null)
    const imageRef = useRef(null as HTMLImageElement | null)
    const [files, setFiles] = useState(null as File | null)
    useEffect(() => {
        const reader = new FileReader();
        reader.onload = (event) => {
            imageRef.current!.src = event.target!.result!.toString()
        }
        if (files)
            reader.readAsDataURL(files)
    }, [files]);

    return (
        <>
            <label className="p-2 w-80 h-80 rounded-2xl bg-surface-container hover:cursor-pointer flex flex-col gap-3 items-center justify-center hover:bg-surface-container-high transition-colors" htmlFor={name}>
                {
                    (files) ?
                        <img className={`rounded-xl object-cover w-full h-full`} ref={imageRef}></img>
                        :
                        <>
                            <Icon icon="add_photo_alternate"></Icon>
                            <p>Add Image</p>
                        </>
                }
            </label>
            <input name={name} id={name} type="file" accept="image/jpeg" hidden ref={hiddenRef}
                onClick={
                    (event) => {
                        if (files) {
                            event.preventDefault()
                            setFiles(null)
                        }
                    }
                }
                onChange={
                    () => {
                        if (hiddenRef.current && hiddenRef.current.files && hiddenRef.current.files[0]) {
                            setFiles(hiddenRef.current.files[0])
                        }
                    }
                } />
        </>
    )
}