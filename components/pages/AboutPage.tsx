import React from 'react';
import { motion } from 'framer-motion';
import { Twitter, Linkedin } from 'lucide-react';

const TeamCard: React.FC<{ name: string; role: string; imageUrl: string; }> = ({ name, role, imageUrl }) => {
    return (
        <motion.div 
            whileHover={{ y: -5, scale: 1.02 }}
            className="text-center bg-[var(--card-bg)] border border-[var(--border-color)] backdrop-blur-md p-6 rounded-2xl shadow-lg shadow-[var(--shadow-color-rgb)]/10"
        >
            <img src={imageUrl} alt={name} className="w-32 h-32 rounded-full mx-auto mb-4 border-2 border-[var(--border-color)]"/>
            <h3 className="font-heading font-bold text-xl">{name}</h3>
            <p className="text-[var(--accent-color)]">{role}</p>
            <div className="flex justify-center space-x-3 mt-4">
                <a href="#" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"><Twitter size={18}/></a>
                <a href="#" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"><Linkedin size={18}/></a>
            </div>
        </motion.div>
    )
};

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
        >
            <h1 className="font-heading text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--brand-gold)] via-[var(--brand-green)] to-[var(--brand-blue)]">
                The African Creative <br/> Renaissance on Hedera.
            </h1>
            <p className="mt-6 text-lg text-[var(--text-secondary)] leading-relaxed">
                CreatorCash was born from a simple yet powerful idea: to build a bridge between Africa's immense creative talent and the limitless potential of Web3. We believe the future of art is decentralized, transparent, and empowering for creators. By leveraging Hedera's fast, secure, and sustainable network, we're providing African artists, musicians, and storytellers with the tools to share their work with the world and build sovereign careers.
            </p>
        </motion.div>

        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="my-24"
        >
            <h2 className="text-center font-heading text-3xl md:text-4xl font-bold mb-12">Our Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <TeamCard name="ABUDHABI" role="Smart-Contract Engineer" imageUrl="https://res.cloudinary.com/dwiewdn6f/image/upload/v1761752167/Azqui_iclgcc.jpg" />
                <TeamCard name="Muhammed Oluwafemi 
" role="Product Manager" imageUrl="https://res.cloudinary.com/dwiewdn6f/image/upload/v1761751966/productmanager_wvaozf.jpg" />
                <TeamCard name="Abimbola obafisayo" role="Frontend Engineer" imageUrl="https://res.cloudinary.com/dwiewdn6f/image/upload/v1761751966/frontenddeveloper_p7kesf.jpg" />
                <TeamCard name="Mr. Jay" role="Backend Engineer" imageUrl="https://res.cloudinary.com/dwiewdn6f/image/upload/v1761751966/backendDeveloper_upf7kr.jpg" />
            </div>
        </motion.div>
        
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="my-24"
        >
            <h2 className="text-center font-heading text-3xl md:text-4xl font-bold mb-12">Partners & Supporters</h2>
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
                 <p className="font-bold text-2xl text-[var(--text-secondary)]/60">Hedera</p>
                 <p className="font-bold text-2xl text-[var(--text-secondary)]/60">HashPack</p>
                 <p className="font-bold text-2xl text-[var(--text-secondary)]/60">The HBAR Foundation</p>
                 <p className="font-bold text-2xl text-[var(--text-secondary)]/60">AfroFuture DAO</p>
            </div>
        </motion.div>

    </div>
  );
};

export default AboutPage;