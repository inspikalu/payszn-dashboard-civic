import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function CTA({
  onLogin,
  user,
}: {
  onLogin: () => Promise<void>;
  user: any;
}) {
  const router = useRouter();

  return (
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
                onClick={() => (user ? router.push("/dashboard") : onLogin())}
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
  );
}
