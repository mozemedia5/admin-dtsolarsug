import { useState, useEffect } from 'react';
import { 
  MapPin, 
  Phone, 
  MessageCircle, 
  Mail, 
  Clock, 
  Navigation,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { branches, getNearestBranch } from '@/data';
import { useGeolocation } from '@/hooks';

interface BranchesProps {
  onPageChange: (page: string) => void;
}

export function Branches({ onPageChange }: BranchesProps) {
  const [selectedBranch, setSelectedBranch] = useState(branches[0]);
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);
  const { latitude, longitude, error, loading, requestLocation } = useGeolocation();

  useEffect(() => {
    if (latitude && longitude) {
      setUserLocation({ lat: latitude, lng: longitude });
      const nearest = getNearestBranch(latitude, longitude);
      setSelectedBranch(nearest);
    }
  }, [latitude, longitude]);

  const handleGetDirections = (branch: typeof branches[0]) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${branch.coordinates.lat},${branch.coordinates.lng}`;
    window.open(url, '_blank');
  };

  const handleViewOnMap = (branch: typeof branches[0]) => {
    const url = `https://www.google.com/maps?q=${branch.coordinates.lat},${branch.coordinates.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 pb-6">
        <div className="container mx-auto px-4 pt-6">
          <h1 className="text-2xl font-bold text-white mb-2">Our Branches</h1>
          <p className="text-slate-400 text-sm">
            Visit any of our 4 branches across Uganda for quality products and services
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Location Permission */}
        {!userLocation && !loading && (
          <Alert className="mb-6 bg-slate-800 border-slate-700">
            <Navigation className="w-4 h-4 text-orange-400" />
            <AlertDescription className="flex items-center justify-between">
              <span className="text-slate-300">Allow location access to find your nearest branch</span>
              <Button 
                size="sm" 
                onClick={requestLocation}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Find Nearest
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="mb-6 bg-red-900/20 border-red-500/30">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <AlertDescription className="text-red-300">
              {error}. You can manually select a branch below.
            </AlertDescription>
          </Alert>
        )}

        {userLocation && (
          <Alert className="mb-6 bg-emerald-900/20 border-emerald-500/30">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <AlertDescription className="text-emerald-300">
              Nearest branch: <strong>{selectedBranch.name}</strong>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Branch List */}
          <div className="lg:col-span-1 space-y-3">
            <h2 className="text-lg font-semibold text-white mb-3">Select a Branch</h2>
            {branches.map((branch) => (
              <Card 
                key={branch.id}
                className={`cursor-pointer transition-all ${
                  selectedBranch.id === branch.id
                    ? 'bg-orange-500/10 border-orange-500/50'
                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                }`}
                onClick={() => setSelectedBranch(branch)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      selectedBranch.id === branch.id
                        ? 'bg-orange-500 text-white'
                        : 'bg-slate-700 text-slate-400'
                    }`}>
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-white text-sm truncate">{branch.name}</h3>
                        {branch.isMain && (
                          <Badge className="bg-amber-500 text-white text-[10px]">Main</Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate">{branch.location}</p>
                      <p className="text-xs text-orange-400 mt-1">{branch.phone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Branch Details */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700 h-full">
              <CardContent className="p-6">
                {/* Branch Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-xl font-bold text-white">{selectedBranch.name}</h2>
                      {selectedBranch.isMain && (
                        <Badge className="bg-amber-500 text-white">Main Branch</Badge>
                      )}
                    </div>
                    <p className="text-slate-400 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {selectedBranch.address}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewOnMap(selectedBranch)}
                      className="border-slate-600 text-slate-300 hover:text-white"
                    >
                      <MapPin className="w-4 h-4 mr-1" />
                      View Map
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleGetDirections(selectedBranch)}
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      <Navigation className="w-4 h-4 mr-1" />
                      Directions
                    </Button>
                  </div>
                </div>

                {/* Map Placeholder */}
                <div className="aspect-video bg-slate-700 rounded-xl mb-6 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800" />
                  <div className="relative text-center">
                    <div className="w-16 h-16 mx-auto mb-3 bg-orange-500/20 rounded-full flex items-center justify-center">
                      <MapPin className="w-8 h-8 text-orange-400" />
                    </div>
                    <p className="text-white font-medium">{selectedBranch.location}</p>
                    <p className="text-slate-400 text-sm">Google Maps Integration</p>
                    <Button
                      size="sm"
                      onClick={() => handleViewOnMap(selectedBranch)}
                      className="mt-3 bg-white/10 hover:bg-white/20 text-white"
                    >
                      Open in Google Maps
                    </Button>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">WhatsApp</p>
                      <a 
                        href={`https://wa.me/${selectedBranch.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-green-400 transition-colors"
                      >
                        {selectedBranch.whatsapp}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Phone</p>
                      <a 
                        href={`tel:${selectedBranch.phone}`}
                        className="text-white hover:text-blue-400 transition-colors"
                      >
                        {selectedBranch.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
                    <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Email</p>
                      <a 
                        href={`mailto:${selectedBranch.email}`}
                        className="text-white hover:text-red-400 transition-colors"
                      >
                        {selectedBranch.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
                    <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Working Hours</p>
                      <p className="text-white text-sm">{selectedBranch.workingHours.weekdays}</p>
                    </div>
                  </div>
                </div>

                {/* Working Hours Detail */}
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-400" />
                    Working Hours
                  </h3>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <div>
                      <p className="text-xs text-slate-500">Monday - Friday</p>
                      <p className="text-white text-sm">{selectedBranch.workingHours.weekdays}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Saturday</p>
                      <p className="text-white text-sm">{selectedBranch.workingHours.saturday}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Sunday</p>
                      <p className="text-white text-sm">{selectedBranch.workingHours.sunday}</p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-3 mt-6">
                  <Button
                    onClick={() => onPageChange('preorder')}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Pre-Order from this Branch
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onPageChange('contact')}
                    className="border-slate-600 text-slate-300 hover:text-white"
                  >
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* All Branches Summary */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-white mb-4">All Branch Locations</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {branches.map((branch) => (
              <Card key={branch.id} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-orange-400" />
                    <h3 className="font-medium text-white text-sm">{branch.name}</h3>
                  </div>
                  <p className="text-xs text-slate-400 mb-2">{branch.location}</p>
                  <a 
                    href={`tel:${branch.phone}`}
                    className="text-xs text-orange-400 hover:text-orange-300"
                  >
                    {branch.phone}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
