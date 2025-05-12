import { developerFeatures } from "./constants";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

function Developers() {
  return (
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
              integration, comprehensive documentation, and powerful tools to
              help you build faster.
            </p>

            <div className="space-y-4">
              {developerFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-purple-500/20 flex items-center justify-center mt-1">
                    <ArrowRight className="h-3 w-3 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{feature.title}</h3>
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
                <span className="text-green-400">'payszn-sdk'</span>;{"\n\n"}
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
                <span className="text-blue-400">&lt;PaymentButton /&gt;</span>
                {"\n        "}
                <span className="text-blue-400">&lt;/div&gt;</span>
                {"\n        "}
                <span className="text-blue-400">
                  &lt;PaymentModalWrapper /&gt;
                </span>
                {"\n      "}
                <span className="text-blue-400">&lt;/div&gt;</span>
                {"\n    "}
                <span className="text-blue-400">&lt;/PaySZNProvider&gt;</span>
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
  );
}

export default Developers;
