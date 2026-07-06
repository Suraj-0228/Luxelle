import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Swal from 'sweetalert2';

export default function Login() {
  const { login, isAdmin } = useAuth();
  const toastService = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [touched, setTouched] = useState({});

  const validateEmail = (val) => {
    if (!val) return 'Email is Required!!';
    if (val === 'admin@example.com' || val === 'admin@luxelle.com') return null;
    const emailRegex = /^[a-zA-Z0-9._-]+@gmail\.com$/;
    if (!emailRegex.test(val)) {
      return 'Email must be a valid (example@gmail.com)';
    }
    return null;
  };

  const emailError = touched.email ? validateEmail(email) : null;
  const passwordError = touched.password && !password ? 'Password is Required!!' : null;

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    const mailErr = validateEmail(email);
    if (mailErr || !password) return;

    setErrorMsg('');

    try {
      const user = await login({ email, password });
      Swal.fire({
        title: 'Welcome Back!',
        text: `Login Successful. Welcome to Luxelle, ${user.username}!`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        backdrop: `rgba(0,0,0,0.6)`
      });

      if (user.isAdmin) {
        navigate('/admin/products');
      } else {
        navigate(returnUrl);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login Failed';
      setErrorMsg(msg);
      toastService.show(msg, 'error');
    }
  };

  const isFormInvalid = !!validateEmail(email) || !password;

  return (
    <div className="min-h-screen flex bg-white mx-4 my-8 lg:m-20 border border-gray-400">
      {/* Left Column: Editorial Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src="https://i.pinimg.com/736x/1e/89/e5/1e89e56b2b92189dbf79442fc0e94a87.jpg"
          alt="Luxelle Fashion"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-16">
          <blockquote className="text-white max-w-lg">
            <p className="text-3xl font-serif italic mb-4">"Style is a way to say who you are without having to speak."</p>
            <footer className="text-sm font-medium tracking-widest uppercase">— Rachel Zoe</footer>
          </blockquote>
        </div>
      </div>

      {/* Right Column: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16">
        <div className="w-full max-w-sm space-y-10">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-serif font-bold text-gray-900 tracking-tight">Welcome Back</h2>
            <p className="mt-2 text-sm text-gray-500">Sign in to access your curated wishlist and orders.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {errorMsg && (
              <div className="bg-red-50 text-red-600 p-4 rounded-sm text-sm flex items-start">
                <svg className="h-5 w-5 text-red-400 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errorMsg}
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label htmlFor="email-address" className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                <input
                  id="email-address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur('email')}
                  required
                  className="block w-full border border-gray-400 rounded-sm shadow-sm focus:ring-black focus:border-black sm:text-sm py-3 px-4 bg-gray-55 placeholder-gray-400 text-gray-900 transition-colors"
                  placeholder="you@example.com"
                />
                {emailError && <div className="text-red-600 font-semibold text-xs mt-1">{emailError}</div>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-xs font-bold uppercase tracking-widest text-gray-500">Password</label>
                  <div className="text-xs">
                    <a href="#" onClick={(e) => e.preventDefault()} className="font-semibold text-red-500 hover:text-red-600 transition-colors cursor-pointer">Forgot password?</a>
                  </div>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => handleBlur('password')}
                    required
                    className="block w-full border border-gray-400 rounded-sm shadow-sm focus:ring-black focus:border-black sm:text-sm py-3 px-4 bg-gray-55 placeholder-gray-400 text-gray-900 transition-colors pr-12"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  >
                    {!showPassword ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
                {passwordError && <div className="text-red-600 font-semibold text-xs mt-1">{passwordError}</div>}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isFormInvalid}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-sm shadow-sm text-sm font-bold uppercase tracking-widest text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Sign In
              </button>
            </div>
          </form>

          <div className="text-center relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-900"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 bg-white text-xs text-gray-400 uppercase tracking-widest">New to Luxelle?</span>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/register"
              className="w-full inline-flex justify-center py-4 px-4 border border-gray-900 hover:bg-black hover:text-white duration-300 rounded-sm shadow-sm text-sm font-bold uppercase tracking-widest text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all"
            >
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
