import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DonutChart from '../components/DonutChart';
import ScoreGraph from '../components/ScoreGraph';
import { BookOpen, FileText, TrendingUp, Award } from 'lucide-react';
import api from '../utils/api';

function Dashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [stats, setStats] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      window.history.replaceState({}, '', '/dashboard');
    }

    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      navigate('/');
      return;
    }

    fetchUserData();
    fetchDashboardData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  const fetchDashboardData = async () => {
    try {
      const [statsRes, resultsRes] = await Promise.all([
        api.get('/user/stats'),
        api.get('/user/results')
      ]);
      setStats(statsRes.data);
      setResults(resultsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setStats({ easy: 0, medium: 0, hard: 0 });
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name || 'User'}!</h1>
          <p className="text-gray-600">Here's your learning progress</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats?.easy || 0}</span>
            </div>
            <p className="text-sm text-gray-600">Easy Solved</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats?.medium || 0}</span>
            </div>
            <p className="text-sm text-gray-600">Medium Solved</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats?.hard || 0}</span>
            </div>
            <p className="text-sm text-gray-600">Hard Solved</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{results?.length || 0}</span>
            </div>
            <p className="text-sm text-gray-600">Tests Taken</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <DonutChart stats={stats} />
          <ScoreGraph results={results} />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/practice')}
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Start Practice</p>
                <p className="text-sm text-gray-600">Solve random questions</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/test')}
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-secondary hover:bg-secondary/5 transition-all group"
            >
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center group-hover:bg-secondary/20">
                <FileText className="w-6 h-6 text-secondary" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Take Mock Test</p>
                <p className="text-sm text-gray-600">Company-specific tests</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;