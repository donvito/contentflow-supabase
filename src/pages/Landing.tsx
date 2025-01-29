import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  BarChart3,
  Users,
  MessageSquare,
  ArrowRight,
  Menu,
  X,
  Layout
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setShowLoginModal(false);
    }
  };

  React.useEffect(() => {
    if (showLoginModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLoginModal]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      setLoading(true);
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to sign in');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <Layout className="h-6 w-6 text-[#6C5CE7]" />
              <span className="text-xl font-bold text-gray-900 ml-3">
                ContentFlow
              </span>
            </div>
            <nav className="hidden md:flex items-center space-x-10">
              <a href="#features" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Features
              </a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Testimonials
              </a>
              <button
                onClick={() => setShowLoginModal(true)}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                Sign In
              </button>
              <Link to="/signup" className="ml-4">
                <Button size="sm" className="px-5">Get Started Free</Button>
              </Link>
            </nav>
            <button
              className="md:hidden text-gray-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-sm border-b border-gray-200">
            <div className="px-4 pt-3 pb-4 space-y-2">
              <a href="#features" className="block px-3 py-2.5 text-gray-600 font-medium text-sm rounded-lg hover:bg-gray-50">
                Features
              </a>
              <a href="#testimonials" className="block px-3 py-2.5 text-gray-600 font-medium text-sm rounded-lg hover:bg-gray-50">
                Testimonials
              </a>
              <button
                onClick={() => setShowLoginModal(true)}
                className="block w-full text-left px-3 py-2.5 text-gray-600 font-medium text-sm rounded-lg hover:bg-gray-50"
              >
                Sign In
              </button>
              <Link to="/signup" className="block mt-3">
                <Button className="w-full justify-center">Get Started Free</Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      <section className="pt-32 pb-20 bg-gradient-to-b from-[#6C5CE7]/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Plan & Organize Your Content
                <br />
                Like Never Before
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl lg:max-w-none mx-auto">
                Plan, organize, and track your content ideas in one place. The perfect
                tool for content creators to stay organized and consistent.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link to="/signup">
                  <Button size="lg" className="inline-flex items-center">
                    Start Free <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <button
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-600 hover:text-gray-900 inline-flex items-center"
                >
                  Learn More <ArrowRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#6C5CE7]/30 to-[#4169E1]/30 rounded-3xl transform rotate-2 blur-2xl opacity-20" />
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2400&q=80"
                alt="Content Creation Dashboard"
                className="rounded-2xl shadow-2xl w-full relative z-10"
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/10" />
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Powerful tools to help you manage your content and grow your influence.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Calendar,
                title: 'Content Planning',
                description: 'Plan and schedule your content with a visual calendar.'
              },
              {
                icon: BarChart3,
                title: 'Content Tracking',
                description: 'Track your content ideas and publishing schedule.'
              },
              {
                icon: MessageSquare,
                title: 'Content Library',
                description: 'Store and organize your content drafts in one place.'
              },
              {
                icon: MessageSquare,
                title: 'Advanced Features',
                description: 'Access advanced features like content analytics and team collaboration.'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <feature.icon className="w-12 h-12 text-[#6C5CE7] mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Loved by Influencers
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              See what content creators are saying about our platform.
            </p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src="/images/twitter_hero.jpg"
                alt="Twitter Background"
                className="w-full h-full object-cover opacity-5"
              />
            </div>
            <div className="relative grid md:grid-cols-3 gap-8">
              {[
                {
                  quote: "This platform has completely transformed how I manage my content. It's a game-changer!",
                  author: "Sarah Johnson",
                  role: "Lifestyle Influencer",
                  image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=60&h=60&q=80"
                },
                {
                  quote: "The analytics features have helped me grow my audience by 300% in just 3 months.",
                  author: "Mike Thompson",
                  role: "Tech Reviewer",
                  image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=60&h=60&q=80"
                },
                {
                  quote: "Finally, a platform that understands what content creators really need. Absolutely love it!",
                  author: "Emily Rodriguez",
                  role: "Food Blogger",
                  image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=60&h=60&q=80"
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <p className="text-gray-600 mb-4">{testimonial.quote}</p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.image}
                      alt={testimonial.author}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.author}</p>
                      <p className="text-gray-500 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#6C5CE7] to-[#4169E1] rounded-2xl py-12 px-8 md:py-16 md:px-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Get Your Content Organized?
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Join creators who use our platform to create better content.
            </p>
            <Link to="/signup">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-[#6C5CE7] hover:bg-blue-50"
              >
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center">
                <Layout className="h-6 w-6 text-[#6C5CE7]" />
                <span className="text-xl font-bold text-gray-900 ml-2">
                  ContentFlow
                </span>
              </div>
              <p className="mt-2 text-gray-600">
                Making content management effortless for influencers.
              </p>
            </div>
            {[
              {
                title: 'Product',
                links: ['Features', 'API']
              },
              {
                title: 'Company',
                links: ['About', 'Blog']
              },
              {
                title: 'Support',
                links: ['Help Center', 'Contact', 'Privacy']
              }
            ].map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold text-gray-900 mb-3">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href="#" className="text-gray-600 hover:text-gray-900">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} ContentFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 relative"
          >
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <Layout className="h-6 w-6 text-[#6C5CE7]" />
              <span className="text-xl font-bold text-gray-900">ContentFlow</span>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Welcome Back</h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] text-gray-900"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#6C5CE7] text-white py-2 px-4 rounded-md hover:bg-[#6C5CE7]/90 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-[#6C5CE7] hover:underline"
                onClick={() => setShowLoginModal(false)}
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};