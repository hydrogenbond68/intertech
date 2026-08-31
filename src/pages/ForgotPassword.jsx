import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../services/api';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            await apiService.requestPasswordReset(email);
            setSuccess(true);
            setEmail('');
        } catch (err) {
            setError(err.message || 'Failed to send reset link');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
                <Link to="/login" className="flex items-center text-gray-600 hover:text-harykims-600 mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                </Link>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
                    <p className="text-gray-600 mt-2">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                {success && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-green-700">
                            Password reset link sent to your email!
                        </span>
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <span className="text-red-700">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field pl-10"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary"
                    >
                        {loading ? (
                            <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                        ) : (
                            'Send Reset Link'
                        )}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Remember your password?{' '}
                    <Link to="/login" className="text-harykims-600 hover:text-harykims-700 font-medium">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
