"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useInView } from "react-intersection-observer";
import {
  BookOpenCheck, Sparkles, Users, Wand2, Play, Star,
  Zap, Shield, Globe, ArrowRight, Laptop, Cloud, Check,
  BrainCircuit, Palette, Lightbulb, Share2
} from "lucide-react";
import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const features = [
    {
      icon: <Wand2 className="h-8 w-8 text-violet-400" />,
      title: "AI-Powered Storytelling",
      description: "Dynamic narratives that adapt to your choices in real-time using advanced AI technology.",
    },
    {
      icon: <Users className="h-8 w-8 text-blue-400" />,
      title: "Collaborative Creation",
      description: "Create and share stories with friends, building immersive worlds together.",
    },
    {
      icon: <BookOpenCheck className="h-8 w-8 text-emerald-400" />,
      title: "Personalized Experience",
      description: "Every story is unique, shaped by your decisions and preferences.",
    },
    {
      icon: <Cloud className="h-8 w-8 text-sky-400" />,
      title: "Cloud Sync",
      description: "Access your stories from any device with seamless cloud synchronization.",
    },
  ];

  const stats = [
    { number: "100K+", label: "Active Users", icon: <Users className="h-5 w-5 text-violet-400" /> },
    { number: "1M+", label: "Stories Created", icon: <BookOpenCheck className="h-5 w-5 text-blue-400" /> },
    { number: "50+", label: "AI Models", icon: <Laptop className="h-5 w-5 text-emerald-400" /> },
    { number: "99.9%", label: "Uptime", icon: <Zap className="h-5 w-5 text-sky-400" /> },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for beginners exploring AI storytelling",
      features: [
        "5 AI-powered stories per month",
        "Basic story templates",
        "Community support",
        "Cloud storage (1GB)",
      ],
    },
    {
      name: "Pro",
      price: "$19",
      description: "For serious storytellers and content creators",
      popular: true,
      features: [
        "Unlimited AI-powered stories",
        "Premium story templates",
        "Priority support",
        "Cloud storage (50GB)",
        "Collaboration tools",
        "Advanced AI features",
      ],
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For organizations and large teams",
      features: [
        "Custom AI model training",
        "Dedicated support",
        "Unlimited storage",
        "Advanced analytics",
        "API access",
        "Custom integrations",
      ],
    },
  ];

  const testimonials = [
    {
      quote: "StoryAI has revolutionized how we create interactive content for our audience.",
      author: "Sarah Johnson",
      role: "Content Director",
      company: "MediaTech",
    },
    {
      quote: "The AI-powered storytelling capabilities are simply mind-blowing.",
      author: "Michael Chen",
      role: "Creative Writer",
      company: "StoryLabs",
    },
    {
      quote: "Our engagement rates have increased by 300% since using StoryAI.",
      author: "Emily Rodriguez",
      role: "Marketing Lead",
      company: "Engage Digital",
    },
  ];

  const workflowSteps = [
    {
      icon: <Lightbulb className="h-8 w-8 text-violet-400" />,
      title: "Generate Ideas",
      description: "Let AI inspire your storytelling with unique plot suggestions and character concepts.",
    },
    {
      icon: <Palette className="h-8 w-8 text-blue-400" />,
      title: "Craft Your Story",
      description: "Write and edit with AI assistance, ensuring engaging and coherent narratives.",
    },
    {
      icon: <Share2 className="h-8 w-8 text-emerald-400" />,
      title: "Share & Collaborate",
      description: "Publish your stories and collaborate with other creators in real-time.",
    },
    {
      icon: <BrainCircuit className="h-8 w-8 text-sky-400" />,
      title: "Analyze & Improve",
      description: "Get AI-powered insights to enhance your storytelling and engage readers.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0d0312]">
      {/* Navigation */}
      <nav className="fixed w-full nav-blur z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-violet-400" />
              <span className="text-white text-xl font-bold">StoryAI</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-white/80 hover:text-white transition-colors">Features</Link>
              <Link href="#workflow" className="text-white/80 hover:text-white transition-colors">How It Works</Link>
              <Link href="#testimonials" className="text-white/80 hover:text-white transition-colors">Testimonials</Link>
            </div>
            <div className="flex items-center space-x-4">
              {isSignedIn ? (
                <>
                  <Button variant={"default"} className="text-black bg-white hover:bg-white/80 cursor-pointer" onClick={() => router.push("/dashboard")}>Dashboard</Button>
                  <UserButton />
                </>
              ) : (
                <>
                  <span className="text-white hover:text-white/80 p-2 rounded-md cursor-pointer">
                    <SignInButton />
                  </span>
                  <span className="bg-violet-600 text-white p-2 rounded-md hover:bg-violet-700 font-semibold cursor-pointer">
                    <SignUpButton />
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 grid-pattern opacity-20"></div>
        <div className="max-w-7xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block"
          >
            {/* <span className="inline-flex items-center px-4 py-1.5 rounded-full glass-card text-white text-sm mb-8">
              <Star className="h-4 w-4 mr-2 text-violet-400" /> New: AI Story Templates Available
            </span> */}
          </motion.div>
          <div className="mb-8">
            <div className="relative mirror-text" data-text="The AI Story Generator">
              <h1 className="text-6xl md:text-7xl font-bold tracking-tight neon-text bg-clip-text text-transparent bg-gradient-to-r from-[#a855f7] via-white to-[#3b82f6] mirror-reflection-8">
                The AI Story Generator
              </h1>
              <h1 className="text-6xl md:text-7xl font-bold tracking-tight neon-text bg-clip-text text-transparent bg-gradient-to-r from-[#a855f7] via-white to-[#3b82f6] mirror-reflection-7">
                The AI Story Generator
              </h1>
              <h1 className="text-6xl md:text-7xl font-bold tracking-tight neon-text bg-clip-text text-transparent bg-gradient-to-r from-[#a855f7] via-white to-[#3b82f6] mirror-reflection-6">
                The AI Story Generator
              </h1>
              <h1 className="text-6xl md:text-7xl font-bold tracking-tight neon-text bg-clip-text text-transparent bg-gradient-to-r from-[#a855f7] via-white to-[#3b82f6] mirror-reflection-5">
                The AI Story Generator
              </h1>
              <h1 className="text-6xl md:text-7xl font-bold tracking-tight neon-text bg-clip-text text-transparent bg-gradient-to-r from-[#a855f7] via-white to-[#3b82f6] mirror-reflection-4">
                The AI Story Generator
              </h1>
              <h1 className="text-6xl md:text-7xl font-bold tracking-tight neon-text bg-clip-text text-transparent bg-gradient-to-r from-[#a855f7] via-white to-[#3b82f6] mirror-reflection-3">
                The AI Story Generator
              </h1>
              <h1 className="text-6xl md:text-7xl font-bold tracking-tight neon-text bg-clip-text text-transparent bg-gradient-to-r from-[#a855f7] via-white to-[#3b82f6] mirror-reflection-2">
                The AI Story Generator
              </h1>
              <h1 className="text-6xl md:text-7xl font-bold tracking-tight neon-text bg-clip-text text-transparent bg-gradient-to-r from-[#a855f7] via-white to-[#3b82f6] mirror-reflection">
                The AI Story Generator
              </h1>
              <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6 neon-text bg-clip-text text-transparent bg-gradient-to-r from-[#a855f7] via-white to-[#3b82f6] relative">
                The AI Story Generator
              </h1>
            </div>
            <p className="text-xl text-white/80 mb-8">
              Transform your ideas into captivating stories and stunning videos with the power of AI. Create, collaborate, and bring your narratives to life.
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {isSignedIn ? (
              <Button 
                size="lg" 
                className="bg-violet-600 text-white hover:bg-violet-700 font-semibold px-8 h-12 text-lg group cursor-pointer"
                onClick={() => router.push("/dashboard")}
              >
                Go to Dashboard <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            ) : (
              <span className="bg-violet-600 hover:bg-violet-700 rounded-md font-semibold cursor-pointer">
                <SignUpButton mode="modal">
                  <Button size="lg" className="text-white font-semibold px-8 h-12 text-lg group">
                    Start Creating Free <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </SignUpButton>
              </span>
            )}
            <Button size="lg" variant="outline" className="text-white bg-black border-white/80 hover:bg-white/90 font-semibold px-8 h-12 text-lg cursor-pointer">
              <Play className="mr-2 h-4 w-4" /> Watch Demo
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 glass-card">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center p-6 rounded-xl glass-card"
              >
                <div className="flex items-center justify-center mb-4">{stat.icon}</div>
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-white/60">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" ref={ref} className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8 }}
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
            >
              Powerful Features for Creative Minds
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white/80 text-lg max-w-2xl mx-auto"
            >
              Everything you need to create engaging, interactive stories powered by cutting-edge AI technology.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <Card className="feature-card p-6">
                  <div className="mb-4 p-3 glass-card rounded-lg inline-block">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                  <p className="text-white/80 leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Trust Section */}
      {/* <div className="py-16 px-4 sm:px-6 lg:px-8 glass-card">
        <div className="max-w-7xl mx-auto text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center justify-center space-x-3 p-4 glass-card rounded-xl"
            >
              <Shield className="h-6 w-6 text-violet-400" />
              <span className="text-white/80">Enterprise-grade Security</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center justify-center space-x-3 p-4 glass-card rounded-xl"
            >
              <Zap className="h-6 w-6 text-blue-400" />
              <span className="text-white/80">Lightning-fast Performance</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex items-center justify-center space-x-3 p-4 glass-card rounded-xl"
            >
              <Globe className="h-6 w-6 text-emerald-400" />
              <span className="text-white/80">Global Infrastructure</span>
            </motion.div>
          </div>
        </div>
      </div> */}

      {/* Workflow Section */}
      <div id="workflow" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8 }}
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
            >
              How It Works
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white/80 text-lg max-w-2xl mx-auto"
            >
              Create compelling stories in four simple steps
            </motion.p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 hidden lg:block">
              <div className="workflow-line"></div>
            </div>
            {workflowSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="relative z-10"
              >
                <Card className="feature-card p-6 text-center">
                  <div className="mb-4 p-3 glass-card rounded-lg inline-block mx-auto">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">{step.title}</h3>
                  <p className="text-white/80 leading-relaxed">{step.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8 }}
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
            >
              What Our Users Say
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <Card className="testimonial-card p-8">
                  <div className="mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 inline-block" />
                    ))}
                  </div>
                  <p className="text-white/90 text-lg mb-6">"{testimonial.quote}"</p>
                  <div>
                    <p className="text-white font-semibold">{testimonial.author}</p>
                    <p className="text-white/60">{testimonial.role}</p>
                    <p className="text-white/60">{testimonial.company}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-24 px-4 sm:px-6 lg:px-8 glass-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8 }}
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
            >
              Choose Your Plan
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white/80 text-lg max-w-2xl mx-auto"
            >
              Flexible pricing options for creators of all sizes
            </motion.p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <Card className={`pricing-card p-8 ${plan.popular ? 'pricing-popular' : ''}`}>
                  {plan.popular && (
                    <span className="bg-violet-600 text-white px-3 py-1 rounded-full text-sm font-medium absolute top-4 right-4">
                      Popular
                    </span>
                  )}
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    {plan.price !== "Custom" && <span className="text-white/60">/month</span>}
                  </div>
                  <p className="text-white/80 mb-6">{plan.description}</p>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-white/80">
                        <Check className="h-5 w-5 text-violet-400 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full ${plan.popular ? 'bg-violet-600 hover:bg-violet-700' : 'bg-white/10 hover:bg-white/20'} text-white`}>
                    Get Started
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {/* <div className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="glass-card rounded-2xl p-12"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl sm:text-4xl font-bold text-white mb-6"
            >
              Ready to Begin Your Journey?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-white/80 mb-8"
            >
              Join thousands of storytellers creating unique, AI-powered narratives today.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-x-4"
            >
              <Button size="lg" className="bg-violet-600 text-white hover:bg-violet-700 font-semibold px-8">
                Get Started Free
              </Button>
              <Button size="lg" variant="outline" className="text-white bg-black border-white/80 hover:bg-white/90 font-semibold px-8 cursor-pointer">
                Schedule Demo
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div> */}

      {/* Footer */}
      <footer className="glass-card py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
            <div>
              <h4 className="text-white font-semibold mb-4 text-lg">Product</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="text-white/60 hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#" className="text-white/60 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#" className="text-white/60 hover:text-white transition-colors">Use Cases</Link></li>
                <li><Link href="#" className="text-white/60 hover:text-white transition-colors">Updates</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-lg">Company</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="text-white/60 hover:text-white transition-colors">About</Link></li>
                <li><Link href="#" className="text-white/60 hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="text-white/60 hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="#" className="text-white/60 hover:text-white transition-colors">Press</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-lg">Resources</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="text-white/60 hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="#" className="text-white/60 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="#" className="text-white/60 hover:text-white transition-colors">Community</Link></li>
                <li><Link href="#" className="text-white/60 hover:text-white transition-colors">API</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-lg">Legal</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="text-white/60 hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="#" className="text-white/60 hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="#" className="text-white/60 hover:text-white transition-colors">Security</Link></li>
                <li><Link href="#" className="text-white/60 hover:text-white transition-colors">Status</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <Sparkles className="h-6 w-6 text-violet-400" />
                <span className="text-white/60">© 2025 StoryAI. All rights reserved.</span>
              </div>
              <div className="flex space-x-6">
                <Link href="#" className="text-white/60 hover:text-white transition-colors">
                  Twitter
                </Link>
                <Link href="#" className="text-white/60 hover:text-white transition-colors">
                  GitHub
                </Link>
                <Link href="#" className="text-white/60 hover:text-white transition-colors">
                  Discord
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}