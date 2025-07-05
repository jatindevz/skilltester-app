// src/app/page.jsx

"use client";

import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link";
import { useEffect, useState } from "react";
import { LucideTarget, LucidePencilRuler, LucideMap, LucideBookOpen, LucideFileQuestion, LucideBrainCircuit, Eye, EyeOff } from "lucide-react";
import ScrollReveal from '@/components/ScrollReveal';
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import PageNav from "@/components/PageNav";


// Define the validation schema
const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

const emailSchema = z.string().email();

export default function Home() {
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const router = useRouter()
  const [isSubmit, setIsSubmit] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Add dialog open state


  const form = useForm ({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  })

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setIsEmailValid(emailSchema.safeParse(value).success);
  };

  useEffect(() => {
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (target) {
        e.preventDefault();
        const id = target.getAttribute('href').substring(1);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleAnchorClick);
    }, 5000); // wait 5 seconds

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);


  // Set form email when dialog opens
  useEffect(() => {
    if (isDialogOpen) {
      form.setValue("email", email);
    }
  }, [isDialogOpen, email, form]);


  const onSubmit = async (data) => {
    setIsSubmit(true)
    try {
      const res = await axios.post('/api/auth/register', data)
      toast.success(res.data.message)
      router.replace(`/dashboard`)
    } catch (error) {
      toast.error(error.response?.data.message ?? "Registration failed")
    } finally {
      setIsSubmit(false)
    }
  }

  return (
    <main className="bg-[#051014] text-[#C2D6D6] min-h-screen overflow-hidden">
      {/* Navbar */}
      <PageNav />

      {/* Hero Section */}
      <ScrollReveal>
        <section className="relative flex flex-col md:flex-row items-center justify-between px-9 py-24 max-w-7xl mx-auto">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#A599B5]/10 rounded-full filter blur-3xl opacity-20"></div>
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#ACBDBA]/10 rounded-full filter blur-3xl opacity-20"></div>

          <div className="max-w-xl relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Master Your Field with <span className="bg-gradient-to-r from-[#ACBDBA] to-[#A599B5] bg-clip-text text-transparent">AI-Powered</span> Insights
            </h1>
            <p className="text-lg text-[#ACBDBA] mb-8 leading-relaxed">
              Discover your weak spots and get a personalized roadmap with curated resources and challenges to become an expert in your field.
            </p>
            <div className="flex space-x-4">
              <Link href="#signup">
                <Button className="bg-gradient-to-r from-[#A599B5] to-[#ACBDBA] hover:from-[#A599B5]/90 hover:to-[#ACBDBA]/90 px-8 py-6 text-lg font-medium transition-all duration-300 shadow-lg shadow-[#A599B5]/30 text-[#051014]">
                  Start Learning Now
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button className="border-[#2E2F2F]  hover:bg-[#2E2F2F]/50 px-8 py-6 text-lg font-medium transition-all duration-300 text-[#C2D6D6] hover:text-[#C2D6D6] ">
                  How It Works
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative mt-16 md:mt-0">
            <div className="absolute -top-6 -left-6 w-full h-full rounded-2xl border-2 border-[#A599B5]/30 z-0"></div>
            <div className="relative z-10">
              <Image
                src="/ai.jpg"
                alt="AI Learning"
                width={600}
                height={400}
                className="rounded-xl shadow-2xl transform transition-all duration-500 hover:scale-105 border border-[#2E2F2F]"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#ACBDBA]/20 rounded-full filter blur-xl"></div>
          </div>
        </section>
      </ScrollReveal>

      {/* Features Section */}
      <ScrollReveal>
        <section id="features" className="py-28 px-6 relative overflow-hidden">
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#A599B5]/10 rounded-full filter blur-3xl"></div>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="text-sm font-medium bg-[#2E2F2F] text-[#A599B5] px-4 py-2 rounded-full inline-block mb-4">
              Powerful Features
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#C2D6D6]">Everything You Need to Level Up</h2>
            <p className="text-lg text-[#ACBDBA]">Our AI-powered platform provides personalized learning paths tailored to your unique skill gaps.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10">
            {[
              {
                icon: <LucideTarget className="text-[#A599B5] w-8 h-8 mb-4" />,
                title: "Skill Detection",
                description: "Tell us what you're working on—we'll tailor quizzes to match your exact skill level and goals."
              },
              {
                icon: <LucidePencilRuler className="text-[#A599B5] w-8 h-8 mb-4" />,
                title: "Adaptive Quizzes",
                description: "Dynamic questions that adjust difficulty based on your responses for precise skill measurement."
              },
              {
                icon: <LucideMap className="text-[#A599B5] w-8 h-8 mb-4" />,
                title: "Smart Roadmap",
                description: "AI analyzes your results and provides a step-by-step path to mastery with curated resources."
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-[#051014] border border-[#2E2F2F] p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:border-[#A599B5]/30 hover:translate-y-[-5px]"
              >
                <div className="bg-[#2E2F2F] w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[#C2D6D6]">{feature.title}</h3>
                <p className="text-[#ACBDBA] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* How It Works Section */}
      <ScrollReveal>
        <section id="how-it-works" className="py-28 px-6 max-w-5xl mx-auto relative">
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#ACBDBA]/10 rounded-full filter blur-3xl"></div>
          <div className="text-center mb-16">
            <span className="text-sm font-medium bg-[#2E2F2F] text-[#A599B5] px-4 py-2 rounded-full inline-block mb-4">
              Simple Process
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#C2D6D6]">How It Works</h2>
            <p className="text-lg text-[#ACBDBA] max-w-2xl mx-auto">Get from skill assessment to mastery in just three simple steps.</p>
          </div>
          <div className="space-y-12 relative">
            <div className="absolute top-0 left-8 h-full w-0.5 bg-gradient-to-b from-[#2E2F2F] via-[#A599B5]/50 to-[#2E2F2F] transform translate-x-[15px] md:translate-x-[19px]"></div>

            {[
              {
                icon: <LucideBookOpen className="text-[#A599B5] w-6 h-6" />,
                title: "Choose Your Skills",
                description: "Select the specific technologies or domains you want to master from our extensive catalog."
              },
              {
                icon: <LucideFileQuestion className="text-[#A599B5] w-6 h-6" />,
                title: "Take the Quiz",
                description: "Answer our AI-generated questions that adapt to your knowledge level in real-time."
              },
              {
                icon: <LucideBrainCircuit className="text-[#A599B5] w-6 h-6" />,
                title: "Analyze & Learn",
                description: "Receive detailed insights and a personalized learning path with recommended resources."
              }
            ].map((step, index) => (
              <div key={index} className="flex items-start space-x-8 relative group">
                <div className="flex-shrink-0 relative">
                  <div className="w-10 h-10 rounded-full bg-[#2E2F2F] border-2 border-[#A599B5]/50 flex items-center justify-center group-hover:bg-[#A599B5]/10 group-hover:border-[#A599B5] transition-all duration-300">
                    {step.icon}
                  </div>
                  {index < 2 && (
                    <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-0.5 h-12 bg-[#2E2F2F] group-hover:bg-[#A599B5]/50 transition-all duration-300"></div>
                  )}
                </div>
                <div className="pt-1">
                  <h4 className="text-xl font-semibold mb-2 group-hover:text-[#A599B5] transition-colors duration-300 text-[#C2D6D6]">
                    <span className="text-[#A599B5] mr-2">{index + 1}.</span>
                    {step.title}
                  </h4>
                  <p className="text-[#ACBDBA] leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>


      {/* Footer Signup Section */}
      <ScrollReveal>
        <footer id="signup" className="py-20 px-6   ">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#ACBDBA]/10 rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#ACBDBA]/10 rounded-full filter blur-3xl"></div>
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-sm font-medium bg-[#2E2F2F] text-[#A599B5] px-4 py-2 rounded-full inline-block mb-4">
              Get Started
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#C2D6D6]">Let AI Design Your Perfect Learning Path</h2>
            <p className="text-lg text-[#ACBDBA] mb-10 max-w-2xl mx-auto">
              No more guesswork. Learn exactly what you need, when you need it, with our intelligent skill gap analysis.
            </p>
            <div className="max-w-md mx-auto bg-[#2E2F2F]/50 border border-[#2E2F2F] rounded-xl p-1 flex px-3 items-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow bg-transparent border-none outline-none ring-0 focus:ring-0 focus:outline-none focus:border-none text-[#C2D6D6] px-4 py-3 placeholder-[#ACBDBA]/50"
                value={email}
                onChange={handleEmailChange}
              />

              <Form {...form}>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="bg-gradient-to-r from-[#A599B5] to-[#ACBDBA] hover:from-[#A599B5]/90 hover:to-[#ACBDBA]/90 px-6 py-3 font-medium transition-all duration-300 text-[#051014] shadow-md hover:shadow-lg shadow-[#A599B5]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!isEmailValid}
                    >
                      Sign Up Free
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-[425px] bg-[#051014] border border-[#2E2F2F] text-[#C2D6D6]">
                    <DialogHeader>
                      <DialogTitle className="text-[#C2D6D6]">Create Account</DialogTitle>
                      <DialogDescription className="text-[#ACBDBA]">
                        Add your details below to get started.
                      </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* Email (read-only inside dialog) */}
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#ACBDBA]">Email</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                readOnly
                                type="email"
                                className="bg-transparent border rounded-2xl text-[#C2D6D6] px-4 py-3 placeholder-[#ACBDBA]/50"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Username */}
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#ACBDBA]">Username</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="bg-transparent border rounded-2xl text-[#C2D6D6] px-4 py-3 placeholder-[#ACBDBA]/50"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Password */}
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#ACBDBA]">Password</FormLabel>
                            <FormControl>
                              <PasswordInput field={field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        disabled={isSubmit}
                        className="bg-gradient-to-r from-[#A599B5] to-[#ACBDBA] hover:from-[#A599B5]/90 hover:to-[#ACBDBA]/90 text-[#051014] font-medium transition-all duration-300 w-full"
                      >
                        {isSubmit ? "Creating Account..." : "Create Account"}
                      </Button>

                      <p className="text-[#ACBDBA]/50 text-sm text-center">
                        Already have an account?{" "}
                        <Link href="/login">
                          <span className="text-[#A599B5] cursor-pointer">Sign In</span>
                        </Link>
                      </p>
                    </form>
                  </DialogContent>
                </Dialog>
              </Form>
            </div>
              <p className="text-[#ACBDBA]">
                Already have an account?{' '}
                <a href="/login" className="text-[#A599B5] hover:underline font-medium">
                  Login
                </a>
              </p>
          </div>
        </footer>
      </ScrollReveal>

      {/* Footer Bottom */}
      <footer className="py-8 px-6 border-t border-[#2E2F2F]/50 bg-[#051014]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-xl font-bold bg-gradient-to-r from-[#ACBDBA] to-[#A599B5] bg-clip-text text-transparent mb-4 md:mb-0">
            SkillGap AI
          </div>
          <div className="text-center text-xs text-[#ACBDBA]/50">
            © {new Date().getFullYear()} SkillGap AI. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#ACBDBA]">
            <a href="#" className="hover:text-[#A599B5] transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="hover:text-[#A599B5] transition-colors duration-300">Terms of Service</a>
            <a href="#" className="hover:text-[#A599B5] transition-colors duration-300">Contact Us</a>
            <a href="#" className="hover:text-[#A599B5] transition-colors duration-300">Careers</a>
            <a href="#" className="hover:text-[#A599B5] transition-colors duration-300">FAQ</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

const PasswordInput = ({ field }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        {...field}
        type={showPassword ? "text" : "password"}
        autoComplete="off"
        className="bg-transparent border rounded-2xl text-[#C2D6D6] px-4 py-3 placeholder-[#ACBDBA]/50 pr-10"
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#ACBDBA] hover:text-[#A599B5] transition-colors"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <EyeOff size={18} />
        ) : (
          <Eye size={18} />
        )}
      </button>
    </div>
  );
};