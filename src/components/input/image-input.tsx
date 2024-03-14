'use client'
import { useRef } from "react"

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
    return (
        <>
            <label className="w-80 h-80 rounded-2xl bg-surface-container p-2 " htmlFor={name}>
                <img className="rounded 2xl" ref={imageRef}></img>
            </label>
            <input name={name} id={name} type="file" hidden ref={hiddenRef} onChange={
                (event) => {if (hiddenRef.current) imageRef.current!.src = hiddenRef.current.value; }
            }/>
        </>
    )
}