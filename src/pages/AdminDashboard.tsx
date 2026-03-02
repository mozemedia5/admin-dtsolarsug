import { useState, useEffect } from 'react';
import { getAnalytics } from '@/lib/dataService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Tag, MessageSquare, Star, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading analytics...</div>
      </div>
    );
  }

  const stats = [
    {
      name: 'Total Products',
      value: analytics?.totalProducts || 0,
      icon: Package,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Active Promotions',
      value: analytics?.totalPromotions || 0,
      icon: Tag,
      color: 'from-orange-500 to-amber-500'
    },
    {
      name: 'Customer Reviews',
      value: analytics?.totalReviews || 0,
      icon: MessageSquare,
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Average Rating',
      value: analytics?.averageRating?.toFixed(1) || '0.0',
      icon: Star,
      color: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h2>
        <p className="text-slate-400">Welcome to the DT Solars administration panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">{stat.name}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Products by Category */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            Products by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(analytics?.productsByCategory || {}).map(([category, count]) => (
              <div key={category} className="text-center">
                <div className="bg-slate-800 rounded-lg p-4">
                  <p className="text-2xl font-bold text-white">{count as number}</p>
                  <p className="text-sm text-slate-400 mt-1 capitalize">
                    {category.replace('-', ' ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Reviews */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-orange-500" />
            Recent Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics?.recentReviews?.length > 0 ? (
              analytics.recentReviews.map((review: any) => (
                <div key={review.id} className="bg-slate-800 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-white">{review.userName}</p>
                      <p className="text-sm text-slate-400">{new Date(review.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-white font-medium">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm">{review.comment}</p>
                  {review.verified && (
                    <Badge className="mt-2 bg-green-500/20 text-green-400 border-green-500/30">
                      Verified
                    </Badge>
                  )}
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-center py-8">No reviews yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
