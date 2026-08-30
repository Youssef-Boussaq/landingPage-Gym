import { Award, ArrowRight, Dumbbell, Star, Utensils, UserCheck } from 'lucide-react';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '../Icon/SocialIcons';
import CountUp from '../CountUp';
import HighlightItem from '../HighlightItem';
import StatCard from '../StatCard';

export default function AboutCoach() {
    return (
        <section id="about" className="relative bg-white py-20 sm:py-28 text-slate-900 overflow-hidden">

            {/* Background Accent Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#9de500]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 mx-auto max-w-4xl px-6 lg:px-8 text-center">

                {/* Badge */}
                <div className="font-inter font-semibold inline-flex items-center gap-2 rounded-full border border-[#9de500] bg-[#9de500]/20 px-4 py-1.5 text-xs uppercase tracking-widest text-slate-900 mb-6">
                    <Dumbbell className="h-4 w-4" />
                    <span>About The Coach</span>
                </div>

                {/* Main Title */}
                <h2 className="font-archivo text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-slate-900 leading-none">
                    FIT YOUNESS
                </h2>

                {/* Subtitle */}
                <p className="font-inter text-[#5b9e00] font-bold text-lg sm:text-xl mt-3 flex items-center justify-center gap-2">
                    <Award className="h-5 w-5" />
                    <span>IFBB Certified Personal Trainer & Nutritionist</span>
                </p>

                {/* Bio Copy */}
                <p className="font-inter text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mt-6">
                    Your fitness guide & coach dedicated to helping you reach your goals.
                    Whether you want to build muscle, burn fat, or optimize your performance,
                    I provide custom training and nutrition plans built around your lifestyle.
                </p>

                {/* Key Stats Grid with Count-Up Animations */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-12 max-w-3xl mx-auto">

                    {/* 124K+ Community Card */}
                    <StatCard>
                        <div className="flex items-center gap-2 mb-2.5">
                            <div className="flex -space-x-2 transition-all duration-300 group-hover:space-x-0.5">
                                <img className="inline-block h-7 w-7 rounded-full ring-2 ring-slate-900/80 object-cover" src="/images/user1.jpg" alt="User 1" />
                                <img className="inline-block h-7 w-7 rounded-full ring-2 ring-slate-900/80 object-cover" src="/images/user2.jpg" alt="User 2" />
                                <img className="inline-block h-7 w-7 rounded-full ring-2 ring-slate-900/80 object-cover" src="/images/user3.jpg" alt="User 3" />
                            </div>
                            <div className="flex items-center text-amber-400 group-hover:scale-105 transition-transform duration-300">
                                <Star className="w-3.5 h-3.5 fill-amber-400" />
                                <Star className="w-3.5 h-3.5 fill-amber-400" />
                                <Star className="w-3.5 h-3.5 fill-amber-400" />
                                <Star className="w-3.5 h-3.5 fill-amber-400" />
                                <Star className="w-3.5 h-3.5 fill-amber-400" />
                            </div>
                        </div>

                        <div className="text-3xl font-extrabold text-white font-archivo group-hover:text-[#9de500] transition-colors duration-300">
                            <CountUp end={124} suffix="K+" duration={2000} />
                        </div>
                        <div className="text-xs text-gray-300/80 mt-1 uppercase font-semibold tracking-wider">
                            Community Followers
                        </div>
                    </StatCard>

                    {/* IFBB Card */}
                    <StatCard>
                        <div className="text-3xl font-extrabold text-[#9de500] font-archivo group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_2px_10px_rgba(157,229,0,0.3)]">
                            IFBB
                        </div>
                        <div className="text-xs text-gray-300/80 mt-1 uppercase font-semibold tracking-wider">
                            Internationally Certified
                        </div>
                    </StatCard>

                    {/* Custom Coaching Card */}
                    <StatCard>
                        <div className="text-3xl font-extrabold text-white font-archivo group-hover:text-[#9de500] transition-colors duration-300">
                            <CountUp end={100} suffix="%" duration={1800} />
                        </div>
                        <div className="text-xs text-gray-300/80 mt-1 uppercase font-semibold tracking-wider">
                            Custom Coaching
                        </div>
                    </StatCard>

                </div>

                {/* Animated Highlights Section */}
                <div className="mt-10 max-w-2xl mx-auto text-left">
                    <ul className="space-y-3.5">
                        <HighlightItem
                            icon={Dumbbell}
                            text="Custom workout programming with form analysis and posture corrections."
                            delay={100}
                        />
                        <HighlightItem
                            icon={Utensils}
                            text="Flexible meal plans tailored to your food preferences without restrictive diets."
                            delay={250}
                        />
                        <HighlightItem
                            icon={UserCheck}
                            text="1-on-1 check-ins & ongoing accountability to guarantee results."
                            delay={400}
                        />
                    </ul>
                </div>

                {/* CTA Button & Social Media Icons */}
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
                    <a
                        href="#lead-capture"
                        className="font-inter font-bold inline-flex items-center gap-3 rounded-full bg-[#9de500] px-8 py-4 text-sm uppercase tracking-wider text-black transition-all duration-300 hover:bg-[#8cd000] hover:scale-105 hover:shadow-lg"
                    >
                        <span>Start Your Transformation</span>
                        <ArrowRight className="h-4 w-4" />
                    </a>

                    {/* Social Media Links */}
                    <div className="flex items-center gap-4 py-3 px-6 rounded-full bg-slate-100 border border-slate-200 shadow-sm">
                        <a
                            href="https://facebook.com/fityounessm"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-blue-600 transition-colors"
                            aria-label="Facebook"
                        >
                            <FacebookIcon className="w-6 h-6" />
                        </a>

                        <a
                            href="https://instagram.com/fityounessm"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-pink-600 transition-colors"
                            aria-label="Instagram"
                        >
                            <InstagramIcon className="w-6 h-6" />
                        </a>

                        <a
                            href="https://youtube.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-red-600 transition-colors"
                            aria-label="YouTube"
                        >
                            <YoutubeIcon className="w-6 h-6" />
                        </a>
                    </div>
                </div>

            </div>
        </section>
    );
}