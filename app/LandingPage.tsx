"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Wallet,
  Zap,
  Shield,
  Code,
  Globe,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { usePrivy, useLogin } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const privy = usePrivy();
  const router = useRouter();

  const { login: PrivyLogin } = useLogin({
    onComplete: ({ user, isNewUser, wasAlreadyAuthenticated, loginMethod }) => {
      router.push("/dashboard");
      console.log(user, isNewUser, wasAlreadyAuthenticated, loginMethod);
      // Any logic you'd like to execute if the user is/becomes authenticated while this
      // component is mounted
    },
    onError: (error) => {
      console.log(error);
      // Any logic you'd like to execute after a user exits the login flow or there is an error
    },
  });
  const [isScrolled, setIsScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <div className="min-h-screen bg-[#050510] text-white overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 z-0">
          <AnimatedBackground />
        </div>

        {/* Header */}
        <header
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled
              ? "bg-[#050510]/90 backdrop-blur-md py-3 shadow-lg"
              : "py-5"
          }`}
        >
          <div className="container mx-auto flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">PaySZN</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="#features"
                className="text-sm hover:text-purple-400 transition-colors"
              >
                Features
              </Link>
              <Link
                href="#developers"
                className="text-sm hover:text-purple-400 transition-colors"
              >
                Developers
              </Link>
              <Link
                href="#pricing"
                className="text-sm hover:text-purple-400 transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="#docs"
                className="text-sm hover:text-purple-400 transition-colors"
              >
                Documentation
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="hidden sm:flex border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:text-white"
                onClick={() => privy.login()}
              >
                Log In
              </Button>
              <Button
                className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                onClick={() =>
                  privy.authenticated
                    ? router.push("/dashboard")
                    : privy.login()
                }
              >
                Get Started
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section
          ref={heroRef}
          className="relative pt-32 pb-20 md:pt-40 md:pb-32 z-10"
        >
          <div className="container mx-auto px-4">
            <motion.div
              style={{ opacity, scale }}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-purple-500"
              >
                Seamless Crypto Payments for Modern dApps
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
              >
                Fast, secure, and developer-friendly SDK for blockchain
                transactions with instant settlements and multi-wallet support.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-lg py-6 px-8">
                  Start Integrating <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  className="border-purple-500 text-purple-400 hover:bg-purple-500/10 text-lg py-6 px-8"
                >
                  View Documentation
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Floating Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="max-w-5xl mx-auto mt-16 relative"
          >
            <div className="bg-[#0a0a1a] rounded-xl shadow-2xl shadow-purple-500/10 border border-purple-500/20 overflow-hidden">
              <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>dashboard.payszn.io</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                <div className="bg-[#111125] p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium text-gray-400">
                      Total Balance
                    </h3>
                    <CreditCard className="h-4 w-4 text-purple-400" />
                  </div>
                  <p className="text-2xl font-bold">$6,446,500</p>
                  <div className="mt-2 text-xs text-green-400">
                    +12.5% this month
                  </div>
                </div>
                <div className="bg-[#111125] p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium text-gray-400">
                      Transactions
                    </h3>
                    <Zap className="h-4 w-4 text-blue-400" />
                  </div>
                  <p className="text-2xl font-bold">1,245</p>
                  <div className="mt-2 text-xs text-green-400">
                    +8.3% this week
                  </div>
                </div>
                <div className="bg-[#111125] p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium text-gray-400">
                      Connected Wallets
                    </h3>
                    <Wallet className="h-4 w-4 text-purple-400" />
                  </div>
                  <p className="text-2xl font-bold">5,678</p>
                  <div className="mt-2 text-xs text-green-400">
                    +15.2% this month
                  </div>
                </div>
              </div>
            </div>

            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur-xl opacity-20 -z-10"></div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 relative z-10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Powerful Features
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Everything you need to accept crypto payments and build amazing
                financial experiences
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Developer Section */}
        <section id="developers" className="py-20 relative z-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Built for Developers, <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
                    By Developers
                  </span>
                </h2>
                <p className="text-gray-300 mb-8">
                  Our SDK is designed with developer experience in mind. Simple
                  integration, comprehensive documentation, and powerful tools
                  to help you build faster.
                </p>

                <div className="space-y-4">
                  {developerFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-purple-500/20 flex items-center justify-center mt-1">
                        <ArrowRight className="h-3 w-3 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">
                          {feature.title}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Button className="mt-8 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600">
                  Explore Documentation
                </Button>
              </div>

              {/* Updated Code Section - SDK Example */}
              <div className="bg-[#0a0a1a] rounded-xl p-6 border border-gray-800">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
                <pre className="text-sm font-mono overflow-x-auto p-4 bg-[#050510] rounded-lg">
                  <code className="text-gray-300">
                    <span className="text-purple-400">
                      // Import the SDK components
                    </span>
                    {"\n"}
                    <span className="text-blue-400">import</span>{" "}
                    {" { PaySZNProvider, PaymentButton, PaymentModalWrapper } "}
                    <span className="text-blue-400">from</span>{" "}
                    <span className="text-green-400">'payszn-sdk'</span>;
                    {"\n\n"}
                    <span className="text-blue-400">const</span> Home = () =&gt;{" "}
                    {"{"}
                    {"\n  "}
                    <span className="text-blue-400">return</span> ({"\n    "}
                    <span className="text-blue-400">&lt;PaySZNProvider</span>
                    {"\n      "}
                    apiKey=
                    <span className="text-green-400">"Your_api_Key"</span>
                    {"\n      "}
                    initialAmount={"{"}0.01{"}"}
                    {"\n    "}
                    <span className="text-blue-400">&gt;</span>
                    {"\n      "}
                    <span className="text-blue-400">&lt;div</span> className=
                    <span className="text-green-400">
                      "flex h-screen items-center justify-center"
                    </span>
                    <span className="text-blue-400">&gt;</span>
                    {"\n        "}
                    <span className="text-blue-400">&lt;div</span> className=
                    <span className="text-green-400">"w-40"</span>
                    <span className="text-blue-400">&gt;</span>
                    {"\n          "}
                    <span className="text-blue-400">
                      &lt;PaymentButton /&gt;
                    </span>
                    {"\n        "}
                    <span className="text-blue-400">&lt;/div&gt;</span>
                    {"\n        "}
                    <span className="text-blue-400">
                      &lt;PaymentModalWrapper /&gt;
                    </span>
                    {"\n      "}
                    <span className="text-blue-400">&lt;/div&gt;</span>
                    {"\n    "}
                    <span className="text-blue-400">
                      &lt;/PaySZNProvider&gt;
                    </span>
                    {"\n  "}
                    );{"\n"}
                    {"}"};{"\n\n"}
                    <span className="text-blue-400">export default</span> Home;
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative z-10">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-2xl p-8 md:p-12 relative overflow-hidden">
              {/* Background elements */}
              <div className="absolute top-0 left-0 right-0 bottom-0 opacity-20">
                <div className="absolute top-0 left-0 w-40 h-40 bg-purple-500 rounded-full filter blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-500 rounded-full filter blur-3xl"></div>
              </div>

              <div className="relative z-10 text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Ready to revolutionize your payment experience?
                </h2>
                <p className="text-lg text-gray-300 mb-8">
                  Join thousands of developers building the future of financial
                  applications with PaySZN.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    className="bg-white text-purple-900 hover:bg-gray-100 text-lg py-6 px-8"
                    onClick={() =>
                      privy.authenticated
                        ? router.push("/dashboard")
                        : privy.login()
                    }
                  >
                    Get Started for Free
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 text-lg py-6 px-8"
                  >
                    Contact Sales
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-gray-800 relative z-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
              <div className="col-span-2 lg:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-bold">PaySZN</span>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  Fast, secure, and developer-friendly crypto payment SDK for
                  seamless blockchain transactions.
                </p>
                <div className="flex gap-4">
                  <a href="#" className="text-gray-400 hover:text-white">
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white">
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white">
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Product</h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white text-sm"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white text-sm"
                    >
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white text-sm"
                    >
                      Security
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white text-sm"
                    >
                      Roadmap
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white text-sm"
                    >
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white text-sm"
                    >
                      API Reference
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white text-sm"
                    >
                      Guides
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white text-sm"
                    >
                      SDK
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white text-sm"
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white text-sm"
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white text-sm"
                    >
                      Careers
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white text-sm"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white text-sm"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white text-sm"
                    >
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white text-sm"
                    >
                      Cookie Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white text-sm"
                    >
                      Compliance
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} PaySZN. All rights reserved.
              </p>
              <div className="mt-4 md:mt-0">
                <select className="bg-[#111125] text-gray-400 text-sm rounded-md px-3 py-1 border border-gray-800">
                  <option>English (US)</option>
                  <option>Español</option>
                  <option>Français</option>
                  <option>Deutsch</option>
                </select>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

// Animated Background Component
function AnimatedBackground() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxYTFhMzAiIGQ9Ik0zNiAxOGgtMTJ2MTJoMTJ6Ii8+PHBhdGggc3Ryb2tlPSIjMWExYTMwIiBzdHJva2Utb3BhY2l0eT0iLjUiIGQ9Ik0zMCAwdjYwbTMwLTMwSDBtNjAgMEgwbTYwLTMwSDBtNjAgMEgwIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>

      {/* Gradient blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000"></div>

      {/* Particles */}
      <div className="absolute inset-0">
        <Particles />
      </div>
    </div>
  );
}

// Particles Component
function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;

      constructor() {
        this.x = Math.random() * (canvas?.width || 0);
        this.y = Math.random() * (canvas?.height || 0);
        this.size = Math.random() * 2;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.color = `rgba(255, 255, 255, ${Math.random() * 0.5})`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (canvas) {
          if (this.x > canvas.width) this.x = 0;
          else if (this.x < 0) this.x = canvas.width;

          if (this.y > canvas.height) this.y = 0;
          else if (this.y < 0) this.y = canvas.height;
        }
      }

      draw() {
        if (ctx) {
          ctx.fillStyle = this.color;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    const initParticles = () => {
      particles = [];
      const particleCount = Math.floor((canvas.width * canvas.height) / 10000);

      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}

// Feature Card Component
function FeatureCard({
  icon: Icon,
  title,
  description,
  index,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-[#0a0a1a] border border-gray-800 rounded-xl p-6 hover:border-purple-500/50 transition-colors group"
    >
      <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
        <Icon className="h-6 w-6 text-purple-400" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  );
}

// Data
const features = [
  {
    icon: Zap,
    title: "Instant Settlements",
    description:
      "Process transactions in seconds with our lightning-fast settlement system across multiple blockchains.",
  },
  {
    icon: Wallet,
    title: "Multi-Wallet Support",
    description:
      "Connect with MetaMask, WalletConnect, Coinbase Wallet and more with a single integration.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Bank-grade security with end-to-end encryption and compliance with industry standards.",
  },
  {
    icon: Code,
    title: "Developer Friendly",
    description:
      "Simple API, comprehensive documentation, and SDKs for all major programming languages.",
  },
  {
    icon: Globe,
    title: "Global Payments",
    description:
      "Accept payments from anywhere in the world with support for multiple currencies and chains.",
  },
  {
    icon: CreditCard,
    title: "Customizable Checkout",
    description:
      "Fully customizable checkout experience to match your brand and user experience.",
  },
];

const developerFeatures = [
  {
    title: "Simple Integration",
    description:
      "Integrate PaySZN into your application with just a few lines of code.",
  },
  {
    title: "Comprehensive Documentation",
    description:
      "Detailed guides, API references, and examples to help you get started quickly.",
  },
  {
    title: "Webhooks & Events",
    description:
      "Real-time notifications for payment events to keep your systems in sync.",
  },
  {
    title: "Testing Environment",
    description:
      "Sandbox environment for testing your integration before going live.",
  },
];
