import React from "react";
import { motion, MotionValue } from "framer-motion";
import { ArrowRight, Zap, Wallet, CreditCard } from "lucide-react";
import { Button } from "../ui/button";
import { useScroll, useTransform } from "framer-motion";

export default function Hero({
  heroRef,
}: {
  heroRef: React.RefObject<HTMLDivElement>;
}) {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  return (
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
            Fast, secure, and developer-friendly SDK for blockchain transactions
            with instant settlements and multi-wallet support.
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
              <div className="mt-2 text-xs text-green-400">+8.3% this week</div>
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
  );
}
