import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

import Hero from '@/Components/Landing/Hero';
import AboutCoachGSAP from '@/Components/Landing/AboutCoach';
import PainPoints from '@/Components/Landing/PainPoints';
import Nutrition from '@/Components/Landing/Nutrition';
import Programs from '@/Components/Landing/Programs';
import Testimonials from '@/Components/Landing/Testimonials';
import LeadCapture from '@/Components/Landing/LeadCapture';
import FAQ from '@/Components/Landing/FAQ';
import Footer from '@/Components/Landing/Footer';

export default function Welcome({ auth }) {
    return (
        <PublicLayout>
            <Head title="Accueil" />

            <div className="relative overflow-x-clip bg-slate-950 text-white">

                <main>
                    <Hero />

                    <AboutCoachGSAP />

                    <PainPoints />

                    <Nutrition />

                    <Programs />

                    <Testimonials />

                    <LeadCapture />

                    <FAQ />
                </main>

                <Footer />

            </div>
        </PublicLayout>
    );
}