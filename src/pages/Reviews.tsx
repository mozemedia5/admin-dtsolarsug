import { useState } from 'react';
import { 
  Star, 
  User,
  CheckCircle2,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { reviews, products, branches } from '@/data';
import type { Review } from '@/types';

export function ReviewsPage() {
  const [filter, setFilter] = useState<'all' | 'product' | 'branch'>('all');

  const filteredReviews = reviews.filter(review => {
    if (filter === 'product') return !!review.productId;
    if (filter === 'branch') return !!review.branchId;
    return true;
  });

  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  const getReviewSubject = (review: Review) => {
    if (review.productId) {
      const product = products.find(p => p.id === review.productId);
      return { type: 'Product', name: product?.name || 'Unknown Product' };
    }
    if (review.branchId) {
      const branch = branches.find(b => b.id === review.branchId);
      return { type: 'Branch', name: branch?.name || 'Unknown Branch' };
    }
    return { type: 'General', name: 'DT Solars' };
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'text-amber-400 fill-amber-400'
                : 'text-slate-600'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 pb-6">
        <div className="container mx-auto px-4 pt-6">
          <h1 className="text-2xl font-bold text-white mb-2">Customer Reviews</h1>
          <p className="text-slate-400 text-sm">
            See what our customers say about our products and services
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Rating Summary */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="text-center">
                <p className="text-5xl font-bold text-white">{averageRating.toFixed(1)}</p>
                <div className="flex justify-center gap-1 my-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(averageRating)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-600'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-slate-400 text-sm">Based on {reviews.length} reviews</p>
              </div>

              <div className="flex-1 w-full sm:w-auto">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = reviews.filter(r => r.rating === rating).length;
                  const percentage = (count / reviews.length) * 100;
                  return (
                    <div key={rating} className="flex items-center gap-3 mb-2">
                      <span className="text-sm text-slate-400 w-8">{rating}★</span>
                      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-400 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-slate-500 w-10">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'all', label: 'All Reviews' },
            { id: 'product', label: 'Product Reviews' },
            { id: 'branch', label: 'Branch Reviews' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as typeof filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === tab.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {filteredReviews.map((review) => {
            const subject = getReviewSubject(review);
            return (
              <Card key={review.id} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{review.userName}</p>
                        <div className="flex items-center gap-2">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                    </div>
                    {review.verified && (
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>

                  <p className="text-slate-400 text-sm mb-3 leading-relaxed">
                    {review.comment}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                    <div>
                      <Badge variant="outline" className="border-slate-600 text-slate-400 text-[10px]">
                        {subject.type}: {subject.name}
                      </Badge>
                    </div>
                    <span className="text-xs text-slate-500">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredReviews.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-800 rounded-full flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-white font-medium mb-2">No reviews found</h3>
            <p className="text-slate-400 text-sm">Be the first to leave a review!</p>
          </div>
        )}

        {/* Write Review CTA */}
        <div className="mt-8 text-center">
          <p className="text-slate-400 mb-4">Have you purchased from us? We'd love to hear from you!</p>
          <a 
            href="https://wa.me/256751800773?text=I%20would%20like%20to%20leave%20a%20review"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <MessageSquare className="w-4 h-4 mr-2" />
              Leave a Review
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
