const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="flex flex-col items-center justify-center text-center h-full">
            <img src="/logo.png" alt="Logo" className="w-36 mb-2" />
            <p className="text-gray-300">Making your travel dreams come true</p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 p-0">
              <li>
                <a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a>
              </li>
              <li>
                <a href="/trips" className="text-gray-300 hover:text-white transition-colors">Trips</a>
              </li>
              <li>
                <a href="/account" className="text-gray-300 hover:text-white transition-colors">Account</a>
              </li>
              <li><a href="/about" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-center md:text-left">
            <h4 className="font-bold text-lg mb-4">Contact Us</h4>
            <div className="space-y-2 text-gray-300">
              <p>Email: info@travalog.com</p>
              <p>Phone: +1 234 567 890</p>
              <p>Address: 123 Travel Street, Adventure City</p>
            </div>
            <div className="mt-4 flex justify-center md:justify-start space-x-4">
              {/* Social Media Icons */}
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                □
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                □
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                □
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>© 2024 TravelPal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;