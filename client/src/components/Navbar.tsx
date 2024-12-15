

function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white shadow-sm dark:bg-gray-950/90">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-14 items-center">
          <a className="flex items-center gap-2" href="#">
            <p className="font-bold text-lg">ROS Log Viewer</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="m8 3 4 8 5-5 5 15H2L8 3z"></path>
            </svg>
          </a>

          {/* Navigation Links */}
          <nav className="hidden md:flex gap-6">
            <a
              className="font-medium text-sm transition-colors hover:underline"
              href="#"
            >
              Home
            </a>
            <a
              className="font-medium text-sm transition-colors hover:underline"
              href="#"
            >
              About
            </a>
            <a
              className="font-medium text-sm transition-colors hover:underline"
              href="#"
            >
              Services
            </a>
            <a
              className="font-medium text-sm transition-colors hover:underline"
              href="#"
            >
              Contact
            </a>
          </nav>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
