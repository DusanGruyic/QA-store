import { useState } from "react";
import { createPortal } from "react-dom";

export default function IFrame({ children }) {
    const [ref, setRef] = useState();
    const container = ref?.contentWindow?.document?.body;

    return (
        <iframe
            ref={setRef}
            className="border-2 ml-10 border-indigo-200 w-3/4 h-56 mb-5 rounded-lg bg-gray-200 shadow-2xl"
        >
            {container && createPortal(children, container)}
        </iframe>
    );
}
