import React, { useState } from 'react';
import { MapPin, Send, CheckCircle2, Clock, MessageSquare } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'traveller-support',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
          Contact <span className="ai-gradient-text">Traveller Team</span>
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Have questions about your trip request, agency registration, or booking escrow? We're here to help 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Contact Info Cards */}
        <div className="space-y-6 lg:col-span-1">
          
          <div className="glass-card rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 font-bold text-sm">
              <MapPin className="w-5 h-5" /> Regional Offices
            </div>
            
            <div className="space-y-3 pt-2 text-xs text-gray-600 dark:text-gray-300">
              <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/60 space-y-1">
                <span className="font-bold text-gray-900 dark:text-white block">Gangtok Office (Sikkim Hub)</span>
                <p>MG Marg, Below Tourism Department, Gangtok, Sikkim 737101</p>
              </div>

              <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/60 space-y-1">
                <span className="font-bold text-gray-900 dark:text-white block">Shimla Office (Himachal Hub)</span>
                <p>Near The Ridge, Mall Road, Shimla, Himachal Pradesh 171001</p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-600 font-bold">
              <Clock className="w-4 h-4" /> Support Response SLA
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Average email response time: <strong>under 45 minutes</strong> during active business hours (9 AM – 9 PM IST).
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-purple-600 font-bold">
              <MessageSquare className="w-4 h-4" /> Emergency Traveller Line
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              +91 (03592) 280-999 (24/7 On-Trip Emergency Hotline)
            </p>
          </div>

        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="glass-card rounded-3xl p-8 sm:p-10 shadow-xl">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Message Received!</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                  Thank you for reaching out, {formData.name}. One of our destination specialists will respond to {formData.email} shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-full text-xs font-bold text-blue-600 dark:text-blue-400 border border-blue-500/30 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Send Us a Message</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="rahul@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="traveller-support">Traveller Query</option>
                      <option value="agency-registration">Agency KYC & Onboarding</option>
                      <option value="payment-escrow">Razorpay Payment Inquiry</option>
                      <option value="feedback">Product Feedback</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe how we can help you..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl text-white font-bold text-sm bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/25 active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
