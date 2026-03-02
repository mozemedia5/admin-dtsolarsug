import { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Send,
  Facebook,
  Instagram,
  Twitter,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { branches } from '@/data';

export function Contact() {
  const [emailForm, setEmailForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [whatsappForm, setWhatsappForm] = useState({
    name: '',
    phone: '',
    message: '',
    branch: branches[0].id
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setShowSuccess(true);
    setEmailForm({ name: '', email: '', subject: '', message: '' });
    
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const handleWhatsappSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const branch = branches.find(b => b.id === whatsappForm.branch);
    if (branch) {
      const message = `Hello, my name is ${whatsappForm.name}. ${whatsappForm.message}`;
      const url = `https://wa.me/${branch.whatsapp}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    }
  };

  const mainBranch = branches.find(b => b.isMain) || branches[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 pb-6">
        <div className="container mx-auto px-4 pt-6">
          <h1 className="text-2xl font-bold text-white mb-2">Contact Us</h1>
          <p className="text-slate-400 text-sm">
            Get in touch with us through any of our channels
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Success Message */}
        {showSuccess && (
          <Alert className="mb-6 bg-emerald-900/20 border-emerald-500/30">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <AlertDescription className="text-emerald-300">
              Thank you for your message! We'll get back to you soon.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Call Us</p>
                    <a 
                      href={`tel:${mainBranch.phone}`}
                      className="text-white hover:text-blue-400 transition-colors"
                    >
                      {mainBranch.phone}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">WhatsApp</p>
                    <a 
                      href={`https://wa.me/${mainBranch.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-green-400 transition-colors"
                    >
                      {mainBranch.whatsapp}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Email</p>
                    <a 
                      href={`mailto:${mainBranch.email}`}
                      className="text-white hover:text-red-400 transition-colors text-sm"
                    >
                      {mainBranch.email}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Main Branch</p>
                    <p className="text-white text-sm">{mainBranch.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <div className="pt-4">
              <p className="text-sm text-slate-400 mb-3">Follow Us</p>
              <div className="flex gap-3">
                <a 
                  href="https://facebook.com/dtsolars"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <Facebook className="w-5 h-5 text-white" />
                </a>
                <a 
                  href="https://instagram.com/dtsolars"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                  <Instagram className="w-5 h-5 text-white" />
                </a>
                <a 
                  href="https://twitter.com/dtsolars"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center hover:bg-sky-600 transition-colors"
                >
                  <Twitter className="w-5 h-5 text-white" />
                </a>
                <a 
                  href={`https://wa.me/${mainBranch.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors"
                >
                  <MessageCircle className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Forms */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <Tabs defaultValue="email" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-slate-900 mb-6">
                    <TabsTrigger value="email" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Us
                    </TabsTrigger>
                    <TabsTrigger value="whatsapp" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="email">
                    <form onSubmit={handleEmailSubmit} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-slate-300">Your Name</Label>
                          <Input
                            id="name"
                            placeholder="John Doe"
                            value={emailForm.name}
                            onChange={(e) => setEmailForm({...emailForm, name: e.target.value})}
                            required
                            className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            value={emailForm.email}
                            onChange={(e) => setEmailForm({...emailForm, email: e.target.value})}
                            required
                            className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-600"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-slate-300">Subject</Label>
                        <Input
                          id="subject"
                          placeholder="How can we help?"
                          value={emailForm.subject}
                          onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})}
                          required
                          className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-600"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-slate-300">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Tell us more about your inquiry..."
                          value={emailForm.message}
                          onChange={(e) => setEmailForm({...emailForm, message: e.target.value})}
                          required
                          rows={5}
                          className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-600 resize-none"
                        />
                      </div>
                      <Button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="whatsapp">
                    <form onSubmit={handleWhatsappSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="wa-branch" className="text-slate-300">Select Branch</Label>
                        <select
                          id="wa-branch"
                          value={whatsappForm.branch}
                          onChange={(e) => setWhatsappForm({...whatsappForm, branch: e.target.value})}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          {branches.map(branch => (
                            <option key={branch.id} value={branch.id}>
                              {branch.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="wa-name" className="text-slate-300">Your Name</Label>
                        <Input
                          id="wa-name"
                          placeholder="John Doe"
                          value={whatsappForm.name}
                          onChange={(e) => setWhatsappForm({...whatsappForm, name: e.target.value})}
                          required
                          className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-600"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="wa-phone" className="text-slate-300">Your Phone Number</Label>
                        <Input
                          id="wa-phone"
                          placeholder="+256 7XX XXX XXX"
                          value={whatsappForm.phone}
                          onChange={(e) => setWhatsappForm({...whatsappForm, phone: e.target.value})}
                          required
                          className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-600"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="wa-message" className="text-slate-300">Message</Label>
                        <Textarea
                          id="wa-message"
                          placeholder="How can we help you?"
                          value={whatsappForm.message}
                          onChange={(e) => setWhatsappForm({...whatsappForm, message: e.target.value})}
                          required
                          rows={5}
                          className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-600 resize-none"
                        />
                      </div>
                      <Button 
                        type="submit"
                        className="w-full bg-green-500 hover:bg-green-600 text-white"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Open WhatsApp
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* All Branches Contact */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-white mb-4">Contact Any Branch</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {branches.map((branch) => (
              <Card key={branch.id} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <h3 className="font-medium text-white mb-1">{branch.name}</h3>
                  <p className="text-xs text-slate-400 mb-3">{branch.location}</p>
                  <div className="space-y-2">
                    <a 
                      href={`tel:${branch.phone}`}
                      className="flex items-center gap-2 text-sm text-slate-300 hover:text-blue-400"
                    >
                      <Phone className="w-4 h-4" />
                      {branch.phone}
                    </a>
                    <a 
                      href={`https://wa.me/${branch.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-slate-300 hover:text-green-400"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
