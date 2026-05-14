import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertCircle, CheckCircle2, Send } from 'lucide-react';

const ClaimForm = () => {
    const [insuranceId, setInsuranceId] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [insurances, setInsurances] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const API_BASE = 'https://localhost:44331/api';
    const token = localStorage.getItem('token');
    const headers = { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    // Load available policies for the dropdown
    useEffect(() => {
        const fetchInsurances = async () => {
            try {
                const res = await axios.get(`${API_BASE}/Insurances`, { headers });
                setInsurances(res.data);
            } catch (err) {
                console.error("Failed to load policies:", err);
                setError("Could not load insurance policies. Please check your connection.");
            }
        };
        fetchInsurances();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setLoading(true);

        // Principal QA Tip: Ensure we are sending valid data types
        const claimPayload = {
            InsuranceId: parseInt(insuranceId),
    Description: description
        };

        try {
            await axios.post(`${API_BASE}/Claims`, claimPayload, { headers });
            setSuccess(true);
            setDescription("");
            setInsuranceId("");
        } catch (err: any) {
            console.error("Claim Submission Error:", err.response?.data);
            
            if (err.response?.data?.errors) {
                // Extracts specific validation messages like the "description" error you saw
                const messages = Object.values(err.response.data.errors).flat().join(", ");
                setError(messages);
            } else {
                setError(err.response?.data || "Failed to submit claim. Ensure all fields are valid.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Submit New Claim</h2>

            {error && (
                <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 border border-red-100">
                    <AlertCircle size={18} /> {error}
                </div>
            )}

            {success && (
                <div className="mb-4 bg-green-50 text-green-600 p-3 rounded-lg flex items-center gap-2 border border-green-100">
                    <CheckCircle2 size={18} /> Claim submitted successfully!
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Related Policy</label>
                    <select 
                        required
                        className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-praxent-blue outline-none transition-all"
                        value={insuranceId}
                        onChange={(e) => setInsuranceId(e.target.value)}
                    >
                        <option value="">Select a policy...</option>
                        {insurances.map((ins) => (
                            <option key={ins.id} value={ins.id}>
                                {ins.policyName} (ID: {ins.id})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Claim Description</label>
                    <textarea 
                        required
                        placeholder="Please describe the incident in detail..."
                        className="w-full p-2.5 border rounded-lg h-32 focus:ring-2 focus:ring-praxent-blue outline-none transition-all"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <button 
                    disabled={loading}
                    type="submit" 
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-white transition-all ${
                        loading ? 'bg-gray-400' : 'bg-gray-900 hover:bg-black'
                    }`}
                >
                    <Send size={18} />
                    {loading ? 'Submitting...' : 'Submit Claim'}
                </button>
            </form>
        </div>
    );
};

export default ClaimForm;