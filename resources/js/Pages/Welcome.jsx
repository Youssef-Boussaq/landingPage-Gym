import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import Hero from '@/Components/Landing/Hero';
import Footer from '@/Components/Landing/Footer';
import AboutCoachGSAP from '@/Components/Landing/AboutCoach/AboutCoachGSAP';
import FitYounessStudio from '@/Components/Landing/PainPoints';
// import Programs from '@/Components/Landing/Programs';

// import FitYounessStudio from '@/Components/Landing/PainPoints';
// import Contact from '@/Components/Landing/Contact';


export default function Welcome({ auth }) {
    return (
        <PublicLayout>
            <Head title="Accueil" />

            <div className="relative overflow-x-clip bg-slate-950 text-white">

                <main>
                    <Hero />
                    <AboutCoachGSAP />
                    <FitYounessStudio />

                </main>

                <Footer />

            </div>
        </PublicLayout>
    );
}