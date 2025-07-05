import React from 'react'
import Link from "next/link";
import { Button } from "@/components/ui/button"

const PageNav = () => {
  return (
      <nav className="flex justify-between items-center p-5 bg-[#051014]/90 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-[#2E2F2F]">
          <div className="text-2xl font-bold bg-gradient-to-r from-[#ACBDBA] to-[#A599B5] bg-clip-text text-transparent">SkillGap AI</div>
          <div className="flex items-center space-x-6">
              <div className="hidden md:flex space-x-8">
                  <a href="#features" className="hover:text-[#A599B5] transition-colors duration-300 font-medium">Features</a>
                  <a href="#how-it-works" className="hover:text-[#A599B5] transition-colors duration-300 font-medium">How it Works</a>
              </div>
              <Link href="#signup">
                  <Button className="bg-gradient-to-r from-[#A599B5] to-[#ACBDBA] hover:from-[#A599B5]/90 hover:to-[#ACBDBA]/90 text-[#051014] transition-all duration-300 shadow-lg shadow-[#A599B5]/20">
                      Get Started
                  </Button>
              </Link>
          </div>
      </nav>
  )
}

export default PageNav