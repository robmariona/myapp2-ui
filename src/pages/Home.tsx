import React from 'react';
import { Shield, Car, Heart, Home as HomeIcon, Eye, Target } from 'lucide-react';

const Home = () => {
  return (
    <div className="font-sans text-gray-900">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center text-white">
        <img 
          src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1200" 
          className="absolute inset-0 w-full h-full object-cover brightness-50"
          alt="Insurance Hero"
        />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl font-bold mb-4">Securing Your Future, Today.</h1>
          <p className="text-xl max-w-2xl mx-auto">Innovative insurance solutions for families, drivers, and homeowners.</p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12">
        <div className="flex gap-4">
          <Target className="text-praxent-blue shrink-0" size={40} />
          <div>
            <h2 className="text-2xl font-bold mb-2">Our Mission</h2>
            <p className="text-gray-600">To provide transparent, tech-driven insurance that puts the customer back in control of their protection.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Eye className="text-praxent-blue shrink-0" size={40} />
          <div>
            <h2 className="text-2xl font-bold mb-2">Our Vision</h2>
            <p className="text-gray-600">Becoming the global standard for digital-first insurance services through automation and trust.</p>
          </div>
        </div>
      </section>

      {/* Policies / Services */}
      <section className="py-16 bg-gray-50 px-4">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold">Comprehensive Policies</h2>
        </div>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <PolicyCard icon={<Car />} title="Auto Protection" img="https://images.unsplash.com/photo-1533558701576-23c65e0272fb?auto=format&fit=crop&q=80&w=400" />
          <PolicyCard icon={<Heart />} title="Health & Life" img="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=400" />
          <PolicyCard icon={<HomeIcon />} title="Homeowner Security" img="https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=400" />
        </div>
      </section>
    </div>
  );
};

const PolicyCard = ({ icon, title, img }: { icon: any, title: string, img: string }) => (
  <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-gray-100">
    <img src={img} className="h-48 w-full object-cover" alt={title} />
    <div className="p-6 flex items-center gap-3">
      <span className="text-praxent-blue">{icon}</span>
      <h3 className="text-xl font-bold">{title}</h3>
    </div>
  </div>
);

export default Home;