import  { useState } from 'react';
import { Check, AlertCircle, Upload, Loader2 } from 'lucide-react';

const NextLevelForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    document: null
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setIsUploading(true);
      // Simulate upload delay
      setTimeout(() => {
        setIsUploading(false);
        setIsSubmitted(true);
      }, 2000);
    } else {
      setIsError(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-indigo-900 flex items-center justify-center p-4 overflow-hidden">
      <div className="relative bg-white bg-opacity-10 rounded-2xl backdrop-blur-lg shadow-xl p-8 w-full max-w-md animate-fade-in">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-pink-500 to-yellow-500 opacity-20 animate-pulse" style={{animationDuration: '3s'}}></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white mb-6 text-center animate-slide-down">Get in Touch</h2>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="animate-slide-up" style={{animationDelay: '0.1s'}}>
                <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 border border-gray-300 focus:border-white focus:ring-2 focus:ring-white text-white placeholder-gray-400 transition-all duration-300 ease-in-out hover:bg-opacity-30"
                  placeholder="Bama"
                />
              </div>
              <div className="animate-slide-up" style={{animationDelay: '0.2s'}}>
                <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 border border-gray-300 focus:border-white focus:ring-2 focus:ring-white text-white placeholder-gray-400 transition-all duration-300 ease-in-out hover:bg-opacity-30"
                  placeholder="bama@example.com"
                />
              </div>
              <div className="animate-slide-up" style={{animationDelay: '0.3s'}}>
                <label htmlFor="message" className="block text-sm font-medium text-gray-200 mb-1">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 border border-gray-300 focus:border-white focus:ring-2 focus:ring-white text-white placeholder-gray-400 transition-all duration-300 ease-in-out hover:bg-opacity-30"
                  placeholder="Your message here..."
                ></textarea>
              </div>
              <div className="animate-slide-up" style={{animationDelay: '0.4s'}}>
                <label htmlFor="document" className="block text-sm font-medium text-gray-200 mb-1">Upload Document</label>
                <div className="relative">
                  <input
                    type="file"
                    id="document"
                    name="document"
                    onChange={handleChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="document"
                    className="flex items-center justify-center w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 border border-gray-300 text-white cursor-pointer hover:bg-opacity-30 transition-all duration-300 ease-in-out"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    {formData.document ? formData.document.name : "Choose a file"}
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:from-pink-600 hover:to-yellow-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 animate-pulse"
                disabled={isUploading}
              >
                {isUploading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="animate-spin mr-2" />
                    Uploading...
                  </span>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          ) : (
            <div className="text-center animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6 animate-bounce">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2">Thank You!</h3>
              <p className="text-gray-200">Your message and document have been successfully sent. Well get back to you soon!</p>
            </div>
          )}
          {isError && (
            <div className="mt-4 p-4 bg-red-100 bg-opacity-20 rounded-lg flex items-center animate-shake">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-sm text-red-200">Please fill out all fields before submitting.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NextLevelForm;