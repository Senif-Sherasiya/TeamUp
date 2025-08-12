import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Users, TerminalSquare, Mail, Info } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-white to-slate-100 dark:from-[#0f0f0f] dark:via-[#131313] dark:to-[#1a1a1a] text-gray-900 dark:text-white transition-colors duration-500">
      <header className="py-6 px-4 md:px-12 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight">TeamUp</h1>
        <div className="space-x-2">
          <Link to="/login">
            <Button variant="ghost" className="text-base">Login</Button>
          </Link>
          <Link to="/signup">
            <Button className="text-base px-6 py-2 rounded-xl">Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="px-6 md:px-20 pt-20 pb-36 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6"
        >
          Find Teammates for <br /> <span className="text-primary dark:text-blue-400">Projects & Hackathons</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          TeamUp helps developers and students connect, collaborate, and conquer ideas together. Whether it's your side project, next hackathon, or startup – find the right people here.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex justify-center gap-4 flex-wrap"
        >
          <Link to="/login">
            <Button className="text-base px-6 py-2 rounded-xl">Explore Projects</Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" className="text-base px-6 py-2 rounded-xl">
              Browse Hackathons
            </Button>
          </Link>
        </motion.div>
      </main>

      <section className="px-6 md:px-20 pb-24">
        <div className="grid md:grid-cols-3 gap-8 text-left">
          <FeatureCard
            title="Post Your Idea"
            desc="Start something cool. Describe your project or hackathon idea and invite others to join you."
            Icon={Sparkles}
          />
          <FeatureCard
            title="Find Your Squad"
            desc="Filter projects or hackathon teams by skills, tech stack, and interests to find your perfect match."
            Icon={Users}
          />
          <FeatureCard
            title="Build & Ship Together"
            desc="Collaborate easily, manage roles, and get stuff done with your dream team."
            Icon={TerminalSquare}
          />
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white/60 dark:bg-zinc-900 px-6 md:px-20 py-20 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-4xl mx-auto text-center">
          <Info className="mx-auto mb-4 w-8 h-8 text-primary dark:text-blue-400" />
          <h2 className="text-3xl font-bold mb-4">About TeamUp</h2>
          <p className="text-muted-foreground text-lg">
            TeamUp is built by developers, for developers. We believe in empowering makers to find the right teammates for side projects, hackathons, and startups. Whether you're a student or a seasoned engineer — TeamUp is your launchpad to building awesome things with the right people.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-6 md:px-20 py-20 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-4xl mx-auto text-center">
          <Mail className="mx-auto mb-4 w-8 h-8 text-primary dark:text-blue-400" />
          <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
          <p className="text-muted-foreground text-lg mb-6">
            Got feedback, suggestions, or partnership ideas? We’d love to hear from you!
          </p>
          <a
            href="mailto:team@TeamUp.io"
            className="text-base font-medium underline hover:text-blue-600 transition-colors"
          >
            team@TeamUp.io
          </a>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ title, desc, Icon }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="p-6 rounded-2xl bg-white/70 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md backdrop-blur-md"
    >
      <div className="mb-4">
        <Icon className="w-7 h-7 text-primary dark:text-blue-400" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{desc}</p>
    </motion.div>
  );
}
