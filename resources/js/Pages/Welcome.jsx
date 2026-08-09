import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import Navbar from '@/Components/Landing/Navbar';
import Hero from '@/Components/Landing/Hero';
import PainPoints from '@/Components/Landing/PainPoints';
import AboutCoach from '@/Components/Landing/AboutCoach';
import Programs from '@/Components/Landing/Programs';
import Testimonials from '@/Components/Landing/Testimonials';
import LeadCapture from '@/Components/Landing/LeadCapture';
import FAQ from '@/Components/Landing/FAQ';
import Footer from '@/Components/Landing/Footer';
import Nutrition from '@/Components/Landing/Nutrition';

// FIX: Destructured auth prop from Inertia
export default function Welcome({ auth }) {
    return (
        <PublicLayout >
            <Head title="Accueil" />

            <div className="relative overflow-hidden bg-white text-black">


                {/* FIX: Removed m-0 which conflicted with mx-auto */}
                <main className="mx-auto ">
                    {/* FIX: Passed auth?.user properly as a JS expression */}
                    <Hero />

                    <AboutCoach />
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