import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import apiService from '../services/api';
import { Lock, ArrowLeft, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');
    
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [tokenValid, setTokenValid] = useState(true);

    useEffect(() => {
        if (!token) {
            setTokenValid(false);
            setError('Invalid or missing reset token');
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await apiService.resetPassword(token, newPassword);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    if (!tokenValid) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
                <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Reset Link</h2>
                    <p className="text-gray-600 mb-6">The password reset link is invalid or has expired.</p>
                    <Link to="/forgot-password" className="btn-primary inline-block">
                        Request New Link
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
                <Link to="/login" className="flex items-center text-gray-600 hover:text-harykims-600 mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                </Link>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Set New Password</h2>
                    <p className="text-gray-600 mt-2">
                        Enter your new password below.
                    </p>
                </div>

                {success && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                            <span className="text-green-700 font-medium">Password reset successfully!</span>
                            <p className="text-sm text-green-600">Redirecting to login...</p>
                        </div>
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
                            New Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="input-field pl-10 pr-12"
                                placeholder="Enter new password"
                                required
                                minLength={6}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="input-field pl-10"
                                placeholder="Confirm new password"
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
                            'Reset Password'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
