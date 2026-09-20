import { CheckCircle2, CircleDot } from 'lucide-react';

const NORMAL_STEPS = [
    { key: 'pending', label: 'En attente' },
    { key: 'confirmed', label: 'Confirmée' },
    { key: 'processing', label: 'En préparation' },
    { key: 'shipped', label: 'Expédiée' },
    { key: 'out_for_delivery', label: 'En livraison' },
    { key: 'delivered', label: 'Terminée' }
];

export default function OrderStatusStepper({ status }) {
    const isSpecialState = status === 'cancelled' || status === 'returned';
    
    // Find index of current status
    const currentIndex = NORMAL_STEPS.findIndex(step => step.key === status);
    
    // If it's a special state, we still want to show the stepper but perhaps fade it
    const activeIndex = isSpecialState ? -1 : currentIndex;

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm overflow-x-auto print:hidden">
            <div className="min-w-[600px]">
                <div className="flex items-center justify-between relative">
                    {/* Background Line */}
                    <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-100 rounded-full" />
                    
                    {/* Progress Line */}
                    {!isSpecialState && activeIndex > 0 && (
                        <div 
                            className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-[#9de500] rounded-full transition-all duration-500 ease-in-out"
                            style={{ width: `calc(${(activeIndex / (NORMAL_STEPS.length - 1)) * 100}% - 24px)` }}
                        />
                    )}

                    {NORMAL_STEPS.map((step, index) => {
                        const isCompleted = index <= activeIndex;
                        const isCurrent = index === activeIndex;

                        return (
                            <div key={step.key} className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
                                <div className={`
                                    flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white
                                    ${isCompleted ? 'border-[#9de500] text-[#9de500]' : 'border-slate-200 text-slate-300'}
                                    ${isCurrent ? 'ring-4 ring-[#9de500]/20' : ''}
                                `}>
                                    {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <CircleDot className="h-4 w-4" />}
                                </div>
                                <span className={`text-xs font-bold uppercase tracking-wider ${isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
            
            {isSpecialState && (
                <div className="mt-6 flex items-center justify-center rounded-xl bg-rose-50 p-4 text-sm font-bold text-rose-700">
                    La commande a été {status === 'cancelled' ? 'annulée' : 'retournée'}.
                </div>
            )}
        </section>
    );
}
