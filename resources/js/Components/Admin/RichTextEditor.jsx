import React, { useCallback, useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";

import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    Code,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Link as LinkIcon,
    Image as ImageIcon,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Undo2,
    Redo2,
    Highlighter,
    Minus,
    Upload,
    Link2,
    X,
    Loader2,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/* Toolbar building blocks                                                    */
/* -------------------------------------------------------------------------- */

function ToolbarButton({
    onClick,
    isActive,
    disabled,
    title,
    children,
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`
                inline-flex h-8 w-8 items-center justify-center rounded-md
                text-slate-600 transition-colors duration-150
                hover:bg-slate-100 hover:text-slate-900
                disabled:pointer-events-none disabled:opacity-40
                focus:outline-none focus-visible:ring-2
                focus-visible:ring-indigo-500/60
                ${isActive
                    ? "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700"
                    : ""
                }
            `}
        >
            {children}
        </button>
    );
}

function ToolbarDivider() {
    return (
        <div className="mx-1 h-6 w-px shrink-0 bg-slate-200" />
    );
}

function ColorSwatch({ color, onClick, isActive }) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={color}
            className={`
                h-5 w-5 rounded-full border transition-transform
                hover:scale-110
                ${isActive
                    ? "ring-2 ring-offset-1 ring-indigo-500"
                    : "border-slate-300"
                }
            `}
            style={{ backgroundColor: color }}
        />
    );
}

const TEXT_COLORS = [
    "#0f172a",
    "#dc2626",
    "#ea580c",
    "#16a34a",
    "#2563eb",
    "#7c3aed",
];

/* -------------------------------------------------------------------------- */
/* Image menu                                                                 */
/* -------------------------------------------------------------------------- */

function ImageMenu({
    editor,
    fileInputRef,
    uploading,
    uploadError,
    onFileChange,
    onClose,
}) {
    const [imageUrl, setImageUrl] = useState("");

    const insertUrlImage = () => {
        const url = imageUrl.trim();

        if (!url) {
            return;
        }

        if (!/^https?:\/\//i.test(url)) {
            return;
        }

        editor
            .chain()
            .focus()
            .setImage({
                src: url,
                alt: "Image",
            })
            .run();

        setImageUrl("");
        onClose();
    };

    return (
        <div
            className="
                absolute right-0 top-10 z-50 w-80
                rounded-xl border border-slate-200
                bg-white p-3 shadow-xl shadow-slate-300/30
            "
        >
            <div className="mb-3 flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold text-slate-800">
                        Insérer une image
                    </p>

                    <p className="mt-0.5 text-xs text-slate-400">
                        Choisissez un fichier ou utilisez une URL
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="
                        rounded-md p-1 text-slate-400
                        hover:bg-slate-100 hover:text-slate-600
                    "
                >
                    <X size={16} />
                </button>
            </div>

            {/* Upload file */}
            <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="
                    flex w-full items-center gap-3 rounded-lg
                    border border-slate-200 px-3 py-2.5
                    text-left transition-colors
                    hover:border-indigo-200
                    hover:bg-indigo-50
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                "
            >
                <span
                    className="
                        flex h-9 w-9 items-center justify-center
                        rounded-lg bg-indigo-50 text-indigo-600
                    "
                >
                    {uploading ? (
                        <Loader2
                            size={18}
                            className="animate-spin"
                        />
                    ) : (
                        <Upload size={18} />
                    )}
                </span>

                <span>
                    <span className="block text-sm font-medium text-slate-700">
                        {uploading
                            ? "Téléchargement..."
                            : "Depuis un fichier"}
                    </span>

                    <span className="block text-xs text-slate-400">
                        JPG, PNG ou WebP — 5 MB max
                    </span>
                </span>
            </button>

            <div className="my-3 flex items-center gap-2">
                <div className="h-px flex-1 bg-slate-200" />

                <span className="text-[11px] uppercase text-slate-400">
                    ou
                </span>

                <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* URL */}
            <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600">
                    URL de l'image
                </label>

                <div className="flex gap-2">
                    <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                insertUrlImage();
                            }

                            if (e.key === "Escape") {
                                onClose();
                            }
                        }}
                        placeholder="https://exemple.com/image.jpg"
                        className="
                            min-w-0 flex-1 rounded-lg
                            border border-slate-200
                            px-3 py-2 text-xs text-slate-700
                            outline-none
                            placeholder:text-slate-400
                            focus:border-indigo-400
                            focus:ring-2 focus:ring-indigo-500/10
                        "
                    />

                    <button
                        type="button"
                        onClick={insertUrlImage}
                        disabled={!imageUrl.trim()}
                        className="
                            inline-flex items-center justify-center
                            rounded-lg bg-indigo-600 px-3
                            text-xs font-medium text-white
                            transition-colors
                            hover:bg-indigo-700
                            disabled:cursor-not-allowed
                            disabled:opacity-40
                        "
                    >
                        Ajouter
                    </button>
                </div>
            </div>

            {/* Error */}
            {uploadError && (
                <div
                    className="
                        mt-3 rounded-lg border border-red-100
                        bg-red-50 px-3 py-2
                        text-xs text-red-600
                    "
                >
                    {uploadError}
                </div>
            )}
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Toolbar                                                                    */
/* -------------------------------------------------------------------------- */

function Toolbar({
    editor,
    fileInputRef,
    uploading,
    uploadError,
    onImageFileChange,
    showImageMenu,
    setShowImageMenu,
}) {
    const setLink = useCallback(() => {
        if (!editor) return;

        const previousUrl = editor.getAttributes("link").href;

        const url = window.prompt(
            "URL du lien",
            previousUrl || "https://"
        );

        if (url === null) return;

        if (url === "") {
            editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .unsetLink()
                .run();

            return;
        }

        let finalUrl = url.trim();

        if (
            !/^https?:\/\//i.test(finalUrl) &&
            !finalUrl.startsWith("mailto:")
        ) {
            finalUrl = `https://${finalUrl}`;
        }

        editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({
                href: finalUrl,
            })
            .run();
    }, [editor]);

    if (!editor) return null;

    return (
        <div
            className="
                flex flex-wrap items-center gap-0.5
                border-b border-slate-200
                bg-white/80 px-2 py-1.5
                backdrop-blur-sm
            "
        >
            {/* History */}

            <ToolbarButton
                onClick={() =>
                    editor.chain().focus().undo().run()
                }
                disabled={!editor.can().undo()}
                title="Annuler"
            >
                <Undo2 size={16} strokeWidth={2} />
            </ToolbarButton>

            <ToolbarButton
                onClick={() =>
                    editor.chain().focus().redo().run()
                }
                disabled={!editor.can().redo()}
                title="Rétablir"
            >
                <Redo2 size={16} strokeWidth={2} />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Headings */}

            <ToolbarButton
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .toggleHeading({ level: 1 })
                        .run()
                }
                isActive={editor.isActive("heading", {
                    level: 1,
                })}
                title="Titre 1"
            >
                <Heading1 size={16} strokeWidth={2} />
            </ToolbarButton>

            <ToolbarButton
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .toggleHeading({ level: 2 })
                        .run()
                }
                isActive={editor.isActive("heading", {
                    level: 2,
                })}
                title="Titre 2"
            >
                <Heading2 size={16} strokeWidth={2} />
            </ToolbarButton>

            <ToolbarButton
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .toggleHeading({ level: 3 })
                        .run()
                }
                isActive={editor.isActive("heading", {
                    level: 3,
                })}
                title="Titre 3"
            >
                <Heading3 size={16} strokeWidth={2} />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Basic marks */}

            <ToolbarButton
                onClick={() =>
                    editor.chain().focus().toggleBold().run()
                }
                isActive={editor.isActive("bold")}
                title="Gras"
            >
                <Bold size={16} strokeWidth={2} />
            </ToolbarButton>

            <ToolbarButton
                onClick={() =>
                    editor.chain().focus().toggleItalic().run()
                }
                isActive={editor.isActive("italic")}
                title="Italique"
            >
                <Italic size={16} strokeWidth={2} />
            </ToolbarButton>

            <ToolbarButton
                onClick={() =>
                    editor.chain().focus().toggleUnderline().run()
                }
                isActive={editor.isActive("underline")}
                title="Souligné"
            >
                <UnderlineIcon size={16} strokeWidth={2} />
            </ToolbarButton>

            <ToolbarButton
                onClick={() =>
                    editor.chain().focus().toggleStrike().run()
                }
                isActive={editor.isActive("strike")}
                title="Barré"
            >
                <Strikethrough size={16} strokeWidth={2} />
            </ToolbarButton>

            <ToolbarButton
                onClick={() =>
                    editor.chain().focus().toggleCode().run()
                }
                isActive={editor.isActive("code")}
                title="Code"
            >
                <Code size={16} strokeWidth={2} />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Alignment */}

            <ToolbarButton
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .setTextAlign("left")
                        .run()
                }
                isActive={editor.isActive({
                    textAlign: "left",
                })}
                title="Aligner à gauche"
            >
                <AlignLeft size={16} strokeWidth={2} />
            </ToolbarButton>

            <ToolbarButton
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .setTextAlign("center")
                        .run()
                }
                isActive={editor.isActive({
                    textAlign: "center",
                })}
                title="Centrer"
            >
                <AlignCenter size={16} strokeWidth={2} />
            </ToolbarButton>

            <ToolbarButton
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .setTextAlign("right")
                        .run()
                }
                isActive={editor.isActive({
                    textAlign: "right",
                })}
                title="Aligner à droite"
            >
                <AlignRight size={16} strokeWidth={2} />
            </ToolbarButton>

            <ToolbarButton
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .setTextAlign("justify")
                        .run()
                }
                isActive={editor.isActive({
                    textAlign: "justify",
                })}
                title="Justifier"
            >
                <AlignJustify size={16} strokeWidth={2} />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Lists */}

            <ToolbarButton
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .toggleBulletList()
                        .run()
                }
                isActive={editor.isActive("bulletList")}
                title="Liste à puces"
            >
                <List size={16} strokeWidth={2} />
            </ToolbarButton>

            <ToolbarButton
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .toggleOrderedList()
                        .run()
                }
                isActive={editor.isActive("orderedList")}
                title="Liste numérotée"
            >
                <ListOrdered size={16} strokeWidth={2} />
            </ToolbarButton>

            <ToolbarButton
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .toggleBlockquote()
                        .run()
                }
                isActive={editor.isActive("blockquote")}
                title="Citation"
            >
                <Quote size={16} strokeWidth={2} />
            </ToolbarButton>

            <ToolbarButton
                onClick={() =>
                    editor.chain().focus().setHorizontalRule().run()
                }
                title="Ligne horizontale"
            >
                <Minus size={16} strokeWidth={2} />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Link */}

            <ToolbarButton
                onClick={setLink}
                isActive={editor.isActive("link")}
                title="Insérer un lien"
            >
                <LinkIcon size={16} strokeWidth={2} />
            </ToolbarButton>

            {/* Image */}

            <div className="relative">
                <ToolbarButton
                    onClick={() =>
                        setShowImageMenu((current) => !current)
                    }
                    title="Insérer une image"
                    disabled={uploading}
                >
                    {uploading ? (
                        <Loader2
                            size={16}
                            className="animate-spin"
                        />
                    ) : (
                        <ImageIcon size={16} strokeWidth={2} />
                    )}
                </ToolbarButton>

                {showImageMenu && (
                    <ImageMenu
                        editor={editor}
                        fileInputRef={fileInputRef}
                        uploading={uploading}
                        uploadError={uploadError}
                        onFileChange={onImageFileChange}
                        onClose={() => setShowImageMenu(false)}
                    />
                )}
            </div>

            <ToolbarButton
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .toggleHighlight()
                        .run()
                }
                isActive={editor.isActive("highlight")}
                title="Surligner"
            >
                <Highlighter size={16} strokeWidth={2} />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Text colors */}

            <div className="flex items-center gap-1 px-1">
                {TEXT_COLORS.map((color) => (
                    <ColorSwatch
                        key={color}
                        color={color}
                        isActive={editor.isActive("textStyle", {
                            color,
                        })}
                        onClick={() =>
                            editor
                                .chain()
                                .focus()
                                .setColor(color)
                                .run()
                        }
                    />
                ))}
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Main component                                                             */
/* -------------------------------------------------------------------------- */

export default function RichTextEditor({
    content = "<p>Commencez à écrire ici…</p>",
    value,
    onChange,

    placeholder = "Commencez à écrire ici…",

    /**
     * Route Laravel utilisée pour uploader les images.
     *
     * Exemple :
     * admin.products.description-images.store
     */
    uploadRoute = "admin.products.description-images.store",

    /**
     * Optionnel.
     */
    uploadToken = null,

    /**
     * Optionnel.
     */
    productId = null,

    /**
     * Optionnel :
     * permet de gérer l'upload depuis le parent.
     *
     * async (file) => url
     */
    onImageUpload,
}) {
    const fileInputRef = useRef(null);

    const [showImageMenu, setShowImageMenu] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");

    /*
     * Support de `value` ou `content`.
     *
     * Si tu utilises :
     *
     * <RichTextEditor value={description} ... />
     *
     * value est prioritaire.
     */
    const initialContent =
        value !== undefined ? value : content;

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),

            Underline,

            Link.configure({
                openOnClick: false,
                autolink: true,
                HTMLAttributes: {
                    class:
                        "text-indigo-600 underline decoration-indigo-300 underline-offset-2 hover:decoration-indigo-500",
                },
            }),

            Image.configure({
                allowBase64: false,
                HTMLAttributes: {
                    class:
                        "mx-auto my-4 max-w-full rounded-lg shadow-sm",
                },
            }),

            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),

            TextStyle,

            Color,

            Highlight.configure({
                multicolor: true,
            }),
        ],

        content: initialContent,

        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML());
        },

        editorProps: {
            attributes: {
                "data-placeholder": placeholder,

                class:
                    "prose prose-slate max-w-none focus:outline-none min-h-[280px] px-6 py-5 " +
                    "prose-headings:font-semibold prose-headings:tracking-tight " +
                    "prose-p:leading-relaxed prose-p:text-slate-700 " +
                    "prose-blockquote:border-l-4 prose-blockquote:border-indigo-200 prose-blockquote:text-slate-500 prose-blockquote:not-italic " +
                    "prose-code:rounded prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-indigo-600 " +
                    "prose-code:before:content-none prose-code:after:content-none",
            },
        },
    });

    /* ---------------------------------------------------------------------- */
    /* Update editor when external value changes                              */
    /* ---------------------------------------------------------------------- */

    useEffect(() => {
        if (!editor) return;

        const nextContent =
            value !== undefined ? value : content;

        const currentContent = editor.getHTML();

        if (
            nextContent !== undefined &&
            nextContent !== currentContent
        ) {
            editor.commands.setContent(nextContent, false);
        }
    }, [editor, value, content]);

    /* ---------------------------------------------------------------------- */
    /* CSRF                                                                    */
    /* ---------------------------------------------------------------------- */

    const getCsrfToken = () => {
        return document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");
    };

    /* ---------------------------------------------------------------------- */
    /* Upload image                                                            */
    /* ---------------------------------------------------------------------- */

    const uploadImage = useCallback(
        async (file) => {
            if (!editor || !file) return;

            /* Validate type */
            if (!file.type.startsWith("image/")) {
                setUploadError(
                    "Veuillez sélectionner une image valide."
                );
                return;
            }

            /* Validate size */
            if (file.size > 5 * 1024 * 1024) {
                setUploadError(
                    "L'image ne doit pas dépasser 5 MB."
                );
                return;
            }

            setUploadError("");
            setUploading(true);

            try {
                let imageUrl;

                /*
                 * ----------------------------------------------------------
                 * Option 1 :
                 * onImageUpload fourni par le parent
                 * ----------------------------------------------------------
                 */
                if (onImageUpload) {
                    imageUrl = await onImageUpload(file);
                } else {
                    /*
                     * ------------------------------------------------------
                     * Option 2 :
                     * Upload Laravel
                     * ------------------------------------------------------
                     */

                    const formData = new FormData();

                    formData.append("image", file);

                    if (productId) {
                        formData.append(
                            "product_id",
                            productId
                        );
                    }

                    if (uploadToken) {
                        formData.append(
                            "upload_token",
                            uploadToken
                        );
                    }

                    const response = await fetch(
                        route(uploadRoute),
                        {
                            method: "POST",

                            body: formData,

                            credentials: "same-origin",

                            headers: {
                                Accept: "application/json",

                                "X-CSRF-TOKEN":
                                    getCsrfToken() || "",

                                "X-Requested-With":
                                    "XMLHttpRequest",
                            },
                        }
                    );

                    const data =
                        await response.json();

                    if (!response.ok) {
                        throw new Error(
                            data.message ||
                            "Échec du téléchargement de l'image."
                        );
                    }

                    imageUrl = data.url;
                }

                if (!imageUrl) {
                    throw new Error(
                        "L'upload n'a retourné aucune URL."
                    );
                }

                /*
                 * Insert image into Tiptap
                 */
                editor
                    .chain()
                    .focus()
                    .setImage({
                        src: imageUrl,
                        alt:
                            file.name ||
                            "Image du produit",
                    })
                    .run();

                setShowImageMenu(false);
                setUploadError("");
            } catch (error) {
                console.error(
                    "Image upload failed:",
                    error
                );

                setUploadError(
                    error?.message ||
                    "Impossible de télécharger l'image."
                );
            } finally {
                setUploading(false);

                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            }
        },
        [
            editor,
            onImageUpload,
            productId,
            uploadToken,
            uploadRoute,
        ]
    );

    /* ---------------------------------------------------------------------- */
    /* File input                                                              */
    /* ---------------------------------------------------------------------- */

    const handleImageFileChange = async (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        await uploadImage(file);
    };

    /* ---------------------------------------------------------------------- */
    /* Character count                                                        */
    /* ---------------------------------------------------------------------- */

    const characterCount = editor
        ? editor.getText().length
        : 0;

    /* ---------------------------------------------------------------------- */
    /* Render                                                                  */
    /* ---------------------------------------------------------------------- */

    return (
        <div className="mx-auto w-full max-w-3xl">
            <div
                className="
                    overflow-visible rounded-xl
                    border border-slate-200
                    bg-white shadow-sm
                    ring-1 ring-slate-900/5
                "
            >
                {/* Header */}

                <div
                    className="
                        flex items-center justify-between
                        border-b border-slate-100
                        px-4 py-2.5
                    "
                >
                    <span className="text-sm font-medium text-slate-500">
                        Éditeur de texte
                    </span>

                    <span className="text-xs text-slate-400">
                        {editor
                            ? `${characterCount} caractères`
                            : ""}
                    </span>
                </div>

                {/* Toolbar */}

                <div className="sticky top-0 z-20">
                    <Toolbar
                        editor={editor}
                        fileInputRef={fileInputRef}
                        uploading={uploading}
                        uploadError={uploadError}
                        onImageFileChange={
                            handleImageFileChange
                        }
                        showImageMenu={showImageMenu}
                        setShowImageMenu={
                            setShowImageMenu
                        }
                    />
                </div>

                {/* Hidden file input */}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={handleImageFileChange}
                />

                {/* Editor */}

                <div className="bg-white">
                    <EditorContent
                        editor={editor}
                    />
                </div>

                {/* Placeholder */}

                <style>{`
                    .ProseMirror p.is-editor-empty:first-child::before {
                        content: attr(data-placeholder);
                        float: left;
                        color: #94a3b8;
                        pointer-events: none;
                        height: 0;
                    }

                    .ProseMirror:focus {
                        outline: none;
                    }

                    .ProseMirror img {
                        cursor: default;
                    }

                    .ProseMirror img.ProseMirror-selectednode {
                        outline: 3px solid rgba(99, 102, 241, 0.35);
                    }
                `}</style>
            </div>
        </div>
    );
}