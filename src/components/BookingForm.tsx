
import React, { useState } from 'react';

const BookingForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.notes,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', notes: '' });
      } else {
        setError(data.error || 'Something went wrong. Please try again later.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setError('Unable to submit form. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white p-12 rounded-lg shadow-xl text-center animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 bg-[#4a0000] rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-3xl font-bold mb-4 serif italic text-black">Inquiry Received</h3>
        <p className="text-gray-600 mb-8 leading-relaxed max-w-md mx-auto">
          Your brand vision has been successfully delivered. Our team will review the details and initiate a dialogue within 24 hours.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-[10px] uppercase tracking-[0.4em] font-bold text-black border-b border-black pb-1 hover:opacity-50 transition-opacity"
        >
          Submit Another Inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 md:p-16 rounded-lg shadow-2xl relative">
      <h3 className="text-4xl mb-10 serif italic text-black">Initiate Strategy</h3>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs uppercase tracking-widest font-bold">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <label className="block text-[10px] uppercase tracking-widest mb-3 font-bold text-black opacity-60">Full Name</label>
          <input
            type="text"
            name="name"
            required
            placeholder="Jane Doe"
            disabled={isSubmitting}
            className="w-full bg-[#f8f8f8] text-black border-b border-black/20 py-4 px-4 outline-none focus:bg-white focus:border-black transition-all text-sm placeholder:text-black/30 font-medium disabled:opacity-50"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest mb-3 font-bold text-black opacity-60">Email Address</label>
          <input
            type="email"
            name="email"
            required
            placeholder="jane@brand.com"
            disabled={isSubmitting}
            className="w-full bg-[#f8f8f8] text-black border-b border-black/20 py-4 px-4 outline-none focus:bg-white focus:border-black transition-all text-sm placeholder:text-black/30 font-medium disabled:opacity-50"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
      </div>

      <div className="mb-12">
        <label className="block text-[10px] uppercase tracking-widest mb-3 font-bold text-black opacity-60">The Vision (Tell us about your brand)</label>
        <textarea
          name="message"
          rows={3}
          required
          disabled={isSubmitting}
          placeholder="What is the legacy you wish to build?"
          className="w-full bg-[#f8f8f8] text-black border-b border-black/20 py-4 px-4 outline-none focus:bg-white focus:border-black transition-all text-sm placeholder:italic placeholder:text-black/30 font-medium disabled:opacity-50"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full bg-black text-white py-5 rounded-full font-bold uppercase tracking-[0.3em] text-[11px] transition-all duration-300 shadow-xl flex items-center justify-center gap-3 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800 hover:scale-[1.02] active:scale-95'
          }`}
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending Inquiry...
          </>
        ) : "Submit Inquiry"}
      </button>

      <p className="mt-6 text-[9px] text-center text-gray-400 uppercase tracking-widest font-medium">
        Secure transmission via FORM Creative growth systems.
      </p>
    </form>
  );
};

export default BookingForm;
