import React from 'react';
import { Download, FileText, CheckCircle2, ExternalLink } from 'lucide-react';

export default function DigitalFileInfo({ format, size, fileName, hasLink }) {
    return (
        <div className="border border-[#e5e7eb] bg-[#f0efe7]/40 p-5 font-favorit">
            <div className="mb-4 flex items-center justify-between border-b border-[#e5e7eb] pb-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#000000]">
                    Spécifications Numériques
                </span>
                <span className="flex items-center gap-1 text-[11px] font-medium tracking-[0.025em] text-[#000000]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    Accès instantané
                </span>
            </div>

            <ul className="space-y-2.5 text-[12px] tracking-[0.025em]">
                <li className="flex items-center justify-between">
                    <span className="text-[#666666] uppercase">Format</span>
                    <span className="font-semibold text-[#000000]">{format}</span>
                </li>
                <li className="flex items-center justify-between">
                    <span className="text-[#666666] uppercase">Taille du fichier</span>
                    <span className="font-semibold text-[#000000]">{size}</span>
                </li>
                {fileName && (
                    <li className="flex items-center justify-between gap-4">
                        <span className="text-[#666666] uppercase">Nom du fichier</span>
                        <span className="truncate max-w-[200px] font-medium text-[#000000]" title={fileName}>
                            {fileName}
                        </span>
                    </li>
                )}
                <li className="flex items-center justify-between">
                    <span className="text-[#666666] uppercase">Mode de livraison</span>
                    <span className="font-semibold text-[#000000]">Téléchargement direct + Email</span>
                </li>
            </ul>
        </div>
    );
}
