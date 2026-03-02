import { useState, useEffect } from 'react';
import { getAllReviews, deleteReview, approveReview } from '@/lib/dataService';
import type { Review } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Check, Star, MessageSquare, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const data = await getAllReviews();
      setReviews(data);
    } catch (error) {
      console.error('Error loading reviews:', error);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveReview(id);
      await loadReviews();
      setSuccess('Review approved');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Approve failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    try {
      await deleteReview(id);
      await loadReviews();
      setSuccess('Review deleted');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Delete failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Review Management</h2>
        <p className="text-slate-400">Moderate customer reviews and feedback</p>
      </div>

      {error && (
        <Alert variant="destructive" className="bg-red-950/50 border-red-900">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-950/50 border-green-900">
          <AlertDescription className="text-green-400">{success}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium text-white">{review.userName}</p>
                  <p className="text-sm text-slate-400">{new Date(review.date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-white font-medium">{review.rating}</span>
                  </div>
                  {review.verified ? (
                    <Badge className="bg-green-500/20 text-green-400">Verified</Badge>
                  ) : (
                    <Badge className="bg-yellow-500/20 text-yellow-400">Pending</Badge>
                  )}
                </div>
              </div>
              
              <p className="text-slate-300 mb-4">{review.comment}</p>
              
              <div className="flex gap-2">
                {!review.verified && (
                  <Button
                    size="sm"
                    onClick={() => handleApprove(review.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(review.id)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {reviews.length === 0 && (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <MessageSquare className="w-16 h-16 text-slate-600 mb-4" />
            <p className="text-slate-400 text-lg">No reviews yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
