import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ShieldAlert, Send, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { Helmet } from 'react-helmet';


const ReportScam = () => {
  const [formData, setFormData] = useState({
    identifier: '',
    scamType: '',
    description: '',
    city: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' }); // 'success' or 'error'
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();

  const indianCities = [
    { name: 'Delhi', lat: 28.6139, lng: 77.2090 },
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
    { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
    { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
    { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
    { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
    { name: 'Pune', lat: 18.5204, lng: 73.8567 },
    { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
    { name: 'Other', lat: 20.5937, lng: 78.9629 }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setStatus({ type: 'error', message: 'You must be logged in to report a scam' });
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      const selectedCity = indianCities.find(c => c.name === formData.city) || indianCities[indianCities.length - 1];
      
      const payload = {
        ...formData,
        location: {
          city: selectedCity.name,
          lat: selectedCity.lat,
          lng: selectedCity.lng
        }
      };

      await api.post('/scams', payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setStatus({ type: 'success', message: 'Scam report submitted successfully! Thank you for protecting the community.' });
      setFormData({ identifier: '', scamType: '', description: '', city: '' });
      
    } catch (error) {
      console.error('Error submitting report:', error);
      setStatus({ 
        type: 'error', 
        message: error.response?.data?.message || 'Failed to submit report. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Helmet>
        <title>Report a Scam | Community Protection | ScamShield</title>
        <meta name="description" content="Help protect your community by reporting phone numbers, URLs, or UPI IDs used for scams and fraud. Your report can save someone from financial loss." />
      </Helmet>
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden relative">
        
        {/* Decorative Header */}
        <div className="h-32 bg-gradient-to-r from-danger-500 to-orange-500 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm relative z-10 shadow-lg border border-white/30">
            <ShieldAlert className="w-10 h-10 text-white" strokeWidth={2} />
          </div>
        </div>

        <div className="p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Report a Scam</h1>
            <p className="text-slate-500 dark:text-slate-400">Help protect others by sharing details about the scam you encountered.</p>
          </div>

          {status.message && (
            <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 border ${
              status.type === 'success' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400' 
                : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400'
            }`}>
              {status.type === 'success' ? (
                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              )}
              <p className="font-medium">{status.message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="identifier" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Phone Number, URL, or UPI ID <span className="text-danger-500">*</span>
              </label>
              <input
                type="text"
                id="identifier"
                name="identifier"
                required
                value={formData.identifier}
                onChange={handleChange}
                placeholder="e.g. +91 9876543210 or user@upi"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="scamType" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Type of Scam <span className="text-danger-500">*</span>
              </label>
              <select
                id="scamType"
                name="scamType"
                required
                value={formData.scamType}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: `right 1rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em`, paddingRight: `3rem` }}
              >
                <option value="" disabled>Select the closest match</option>
                <option value="OTP Scam">OTP Scam</option>
                <option value="UPI Fraud">UPI Fraud</option>
                <option value="Phishing">Phishing Link / Website</option>
                <option value="Fake Job">Fake Job Offer</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="city" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                City <span className="text-danger-500">*</span>
              </label>
              <select
                id="city"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: `right 1rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em`, paddingRight: `3rem` }}
              >
                <option value="" disabled>Select City</option>
                {indianCities.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Detailed Description <span className="text-danger-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows="5"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe how the scam happened, what they asked for, and any other relevant details..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary bg-danger-600 hover:bg-danger-700 text-white border-0 shadow-lg shadow-danger-500/30 py-4 flex items-center justify-center gap-2 group transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Submitting Report...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                  Submit Scam Report
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportScam;
