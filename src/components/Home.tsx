import { DollarSign } from "lucide-react";
import { DashboardPreview } from "./DashboardPreview";
import { LoginFooter } from "./Footer";
import { features, stats } from "@/constants/previews";
import { Card, CardContent } from "./ui/card";
import { SignIn } from "./SignIn";

export function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">FineApp</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
          {/* Left Side - Hero */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                Controle suas{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  finanças
                </span>{" "}
                de forma inteligente
              </h1>
              <p className="text-xl text-neutral-300 leading-relaxed">
                O FineApp é sua ferramenta completa para gestão financeira
                pessoal. Organize, analise e otimize seus gastos com facilidade
                e segurança.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg mx-auto mb-3">
                    <stat.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-neutral-400">{stat.label}</div>
                </div>
              ))}
            </div>

            <SignIn />
          </div>

          {/* Right Side - Features */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="bg-neutral-800/50 border-neutral-700 hover:bg-neutral-800/70 transition-all duration-300 hover:scale-105"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                          <feature.icon className="w-6 h-6 text-blue-400" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-neutral-400 text-sm leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Preview Section */}
      <div className="py-20 bg-neutral-800/30">
        <div className="container mx-auto px-6">
          <DashboardPreview />
        </div>
      </div>

      {/* Footer */}
      <LoginFooter />

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
