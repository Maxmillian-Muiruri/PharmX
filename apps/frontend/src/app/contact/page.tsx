export function ContactPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-6">Contact Us</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Get in Touch</h2>
            <div className="space-y-4 text-slate-600">
              <div>
                <p className="font-semibold text-slate-900">Email</p>
                <p>support@pharmx.com</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Phone</p>
                <p>+1 (555) 123-4567</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Hours</p>
                <p>Monday - Friday: 8am - 6pm</p>
                <p>Saturday - Sunday: 10am - 4pm</p>
              </div>
            </div>
          </div>

          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                Name
              </label>
              <input
                id="name"
                type="text"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-semibold"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
