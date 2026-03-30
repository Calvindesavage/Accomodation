import Link from "next/link";
import { Home } from "lucide-react";

const footerLink = "text-[rgba(255,255,255,0.35)] hover:text-[#f97316] transition-colors text-sm";

export default function Footer() {
  return (
    <footer className="mt-auto" style={{ borderTop: "1px solid rgba(249,115,22,0.12)", background: "#0f0a00" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}>
                <Home className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-extrabold text-white">
                Res<span className="text-[#f97316]">Plug</span>
              </span>
            </div>
            <p className="text-[rgba(255,255,255,0.35)] text-sm leading-relaxed">
              Student accommodation marketplace connecting students with
              verified landlords across South Africa.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-3 text-sm">For Students</h3>
            <ul className="space-y-2">
              <li><Link href="/listings" className={footerLink}>Browse Listings</Link></li>
              <li><Link href="/register" className={footerLink}>Create Account</Link></li>
              <li><Link href="/favorites" className={footerLink}>Saved Listings</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-3 text-sm">For Landlords</h3>
            <ul className="space-y-2">
              <li><Link href="/register" className={footerLink}>List Your Property</Link></li>
              <li><Link href="/dashboard" className={footerLink}>Manage Listings</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-3 text-sm">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className={footerLink}>Help Center</a></li>
              <li><a href="#" className={footerLink}>Safety Tips</a></li>
              <li><a href="#" className={footerLink}>Terms of Service</a></li>
              <li><a href="#" className={footerLink}>Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 text-sm text-center text-[rgba(255,255,255,0.25)]" style={{ borderTop: "1px solid rgba(249,115,22,0.08)" }}>
          &copy; {new Date().getFullYear()} ResPlug. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
