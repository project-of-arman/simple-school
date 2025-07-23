import Navbar from '@/components/ui/navbar';
import HeroCarousel from '@/components/home/hero-carousel';
import MarqueeNotice from '@/components/home/marquee-notice';
import NoticeBoard from '@/components/home/notice-board';
import TeacherProfiles from '@/components/home/teacher-profiles';
import ImportantLinks from '@/components/home/important-links';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <HeroCarousel />
       
        </section>
        
        {/* Navbar - positioned after carousel */}
        <div className="sticky top-0 z-50 -mx-4 sm:-mx-6 lg:-mx-8 mb-8">
          <Navbar />
         
        </div>
         <div className="z-50 -mx-4 sm:-mx-6 lg:-mx-8 mb-8">
         <MarqueeNotice />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <NoticeBoard />
            <ImportantLinks />
            <TeacherProfiles />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-3">
                <a href="#" className="block text-blue-600 hover:text-blue-800 transition-colors">
                  • Online Admission
                </a>
                <a href="#" className="block text-blue-600 hover:text-blue-800 transition-colors">
                  • Academic Calendar
                </a>
                <a href="#" className="block text-blue-600 hover:text-blue-800 transition-colors">
                  • Student Portal
                </a>
                <a href="#" className="block text-blue-600 hover:text-blue-800 transition-colors">
                  • Teacher Portal
                </a>
                <a href="#" className="block text-blue-600 hover:text-blue-800 transition-colors">
                  • Parent Portal
                </a>
              </div>
            </div>

            {/* Educational Boards */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Educational Boards</h3>
              <div className="space-y-3">
                <a href="https://www.educationboard.gov.bd" target="_blank" rel="noopener noreferrer" 
                   className="block text-blue-600 hover:text-blue-800 transition-colors">
                  • Education Board Bangladesh
                </a>
                <a href="https://www.moedu.gov.bd" target="_blank" rel="noopener noreferrer"
                   className="block text-blue-600 hover:text-blue-800 transition-colors">
                  • Ministry of Education
                </a>
                <a href="https://www.nctb.gov.bd" target="_blank" rel="noopener noreferrer"
                   className="block text-blue-600 hover:text-blue-800 transition-colors">  
                  • NCTB
                </a>
              </div>
            </div>

            {/* School Statistics */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">School Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Students:</span>
                  <span className="font-semibold">1,250</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Teachers:</span>
                  <span className="font-semibold">45</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Classes:</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Success Rate:</span>
                  <span className="font-semibold text-green-600">98.5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <p className="text-gray-300">123 School Street</p>
              <p className="text-gray-300">Dhaka, Bangladesh</p>
              <p className="text-gray-300">Phone: +880-2-123456789</p>
              <p className="text-gray-300">Email: info@schoolname.edu.bd</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Academics</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Admissions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <p className="text-gray-300">Stay connected with our school community</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 School Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}