import Link from "next/link"

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center space-x-3 ${className}`}>
      <div className="relative">
        {/* Shopping cart icon with modern design */}
        <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
          <svg
            className="w-7 h-7 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8m-8 0a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4z"
            />
          </svg>
        </div>
        {/* Small accent dot */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-sm"></div>
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold font-display text-gradient">Cartify</span>
        <span className="text-xs text-muted-foreground -mt-1 font-medium tracking-wide">Shop Smart</span>
      </div>
    </Link>
  )
}
