import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

import Hero from '@/Components/Landing/Hero';
import AboutCoach from '@/Components/Landing/AboutCoach';
import Services from '@/Components/Landing/Services';
import Transformations from '@/Components/Landing/Transformations';
import Reviews from '@/Components/Landing/Reviews';
import Programs from '@/Components/Landing/Programs';
import Contact from '@/Components/Landing/Contact';
import Footer from '@/Components/Landing/Footer';

export default function Welcome({
    auth,
    heroConfig       = {},
    aboutConfig      = {},
    services         = [],
    servicesConfig   = {},
    programs         = [],
    programsConfig   = {},
    reviews          = [],
    reviewsConfig    = {},
}) {
    return (
        <PublicLayout>
            <Head title="Accueil" />

            <div className="relative overflow-x-clip bg-white text-slate-900 font-sans selection:bg-[var(--color-primary)] selection:text-slate-900">
                <main>
                    <Hero config={heroConfig} />

                    <AboutCoach config={aboutConfig} />
                    <Services   services={services}   sectionConfig={servicesConfig} />
                    <Transformations />
                    <Reviews    reviews={reviews}     sectionConfig={reviewsConfig} />
                    <Programs   programs={programs}   sectionConfig={programsConfig} />
                    <Contact />
                </main>

                <Footer />
            </div>
        </PublicLayout>
    );
}
