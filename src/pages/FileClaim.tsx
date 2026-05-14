import React, { useState, useEffect } from 'react';
import api from '../api';
import { Send, ShieldCheck, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FileClaim = () => {
  const [policies, setPolicies] = useState<any[]>([]);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ insuranceId: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load available policies for the dropdown
    const fetchPolicies = async () => {
      const res = await api.get('/Insurances');
      setPolicies(res.data);
    };
    fetchPolicies();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/Claims', {
        insuranceId: parseInt(formData.insuranceId),
        description: formData.description,
        dateFiled: new Date().toISOString(),
        status: "Pending"
      });
      setStep(3); // Success step
    } catch (err) {
      alert("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-xl mx-auto">
        
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`h-2 flex-1 rounded-full mx-1 ${step >= i ? 'bg-praxent-blue' : 'bg-gray-100'}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <h1 className="text-3xl font-bold mb-2">What happened?</h1>
            <p className="text-gray-500 mb-8">Select the policy you are claiming against.</p>
            
            <div className="space-y-3">
              {policies.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setFormData({ ...formData, insuranceId: p.id }); setStep(2); }}
                  className="w-full p-5 border-2 border-gray-100 rounded-xl text-left hover:border-praxent-blue hover:bg-blue-50 transition-all flex justify-between items-center group"
                >
                  <div>
                    <div className="font-bold text-lg">{p.policyName}</div>
                    <div className="text-sm text-gray-500">{p.insuranceType}</div>
                  </div>
                  <ChevronRight className="text-gray-300 group-hover:text-praxent-blue" />
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="animate-in fade-in">
            <h1 className="text-3xl font-bold mb-2">Claim Details</h1>
            <p className="text-gray-500 mb-8">Please describe the incident in detail.</p>
            
            <textarea
              required
              rows={5}
              className="w-full p-4 border-2 border-gray-100 rounded-xl focus:border-praxent-blue outline-none transition-all mb-6"
              placeholder="e.g. My basement flooded due to a burst pipe on Tuesday night..."
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-praxent-blue text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-blue-700 disabled:bg-gray-300"
            >
              {isSubmitting ? "Processing..." : <><Send size={20} /> Submit Claim</>}
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="text-center animate-in zoom-in">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck size={40} />
            </div>
            <h1 className="text-3xl font-bold mb-2">Claim Received</h1>
            <p className="text-gray-500 mb-8 text-lg">Your reference number is #CL-{Math.floor(Math.random() * 10000)}.</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileClaim;