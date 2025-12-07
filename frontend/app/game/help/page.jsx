"use client"

import { HelpCircle, Book, Mail, MessageCircle, FileText, Search } from "lucide-react"
import { useState } from "react"

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "How do I create my first colony?",
          a: "Navigate to the Colony page and click on 'Create New Colony'. Fill in the required information and click submit."
        },
        {
          q: "What are Ant Coins and how do I earn them?",
          a: "Ant Coins are the in-app currency. You can earn them by completing tasks, participating in events, and achieving milestones."
        }
      ]
    },
    {
      category: "Account & Profile",
      questions: [
        {
          q: "How do I update my profile?",
          a: "Go to the 'My' page from the sidebar. You can edit your profile information, update stats, and customize your settings."
        },
        {
          q: "What are XP and VP?",
          a: "XP (Experience Points) measures your overall progress. VP (Victory Points) represents your achievements and success in the platform."
        }
      ]
    },
    {
      category: "Features",
      questions: [
        {
          q: "How does the ranking system work?",
          a: "Rankings are calculated based on XP, VP, colony size, and activity. Check the Ranking page to see global and personal standings."
        },
        {
          q: "Can I schedule meetings with other members?",
          a: "Yes! Use the Meeting page to schedule both video calls and in-person meetings with your colony members."
        }
      ]
    }
  ]

  const supportOptions = [
    {
      icon: Book,
      title: "Documentation",
      description: "Browse our comprehensive guides and tutorials",
      action: "View Docs",
      color: "bg-blue-500"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      action: "Start Chat",
      color: "bg-green-500"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us an email and we'll respond within 24 hours",
      action: "Send Email",
      color: "bg-purple-500"
    },
    {
      icon: FileText,
      title: "Submit Ticket",
      description: "Create a support ticket for technical issues",
      action: "Create Ticket",
      color: "bg-orange-500"
    }
  ]

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-4">
          <HelpCircle className="w-10 h-10 text-purple-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">How can we help you?</h1>
        <p className="text-gray-600 text-lg">Search our knowledge base or contact support</p>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for help articles..."
            className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-gray-300 bg-white text-base focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          />
          <Search className="w-6 h-6 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Support Options */}
      <div className="grid grid-cols-4 gap-6 mb-12">
        {supportOptions.map((option, index) => (
          <SupportCard key={index} {...option} />
        ))}
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        
        <div className="space-y-8">
          {faqs.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-bold text-purple-600 mb-4">{section.category}</h3>
              <div className="space-y-4">
                {section.questions.map((faq, idx) => (
                  <FAQItem key={idx} question={faq.q} answer={faq.a} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="mt-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-8 text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Still need help?</h3>
        <p className="text-gray-700 mb-4">Our support team is here to assist you</p>
        <button className="bg-purple-400 text-white font-semibold px-8 py-3 rounded-full hover:bg-purple-500 transition-colors">
          Contact Support
        </button>
      </div>
    </div>
  )
}

function SupportCard({ icon: Icon, title, description, action, color }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
      <div className={`w-12 h-12 ${color} bg-opacity-10 rounded-lg flex items-center justify-center mb-4`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <button className="text-purple-600 text-sm font-medium hover:underline">
        {action} →
      </button>
    </div>
  )
}

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-start justify-between text-left group"
      >
        <span className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors pr-4">
          {question}
        </span>
        <span className="text-purple-400 text-xl flex-shrink-0">
          {isOpen ? "−" : "+"}
        </span>
      </button>
      {isOpen && (
        <p className="mt-3 text-gray-600 text-sm leading-relaxed">
          {answer}
        </p>
      )}
    </div>
  )
}
