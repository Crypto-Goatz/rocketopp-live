"use client"

import Link from "next/link"
import { Leaf, Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react"

export default function EcosprayFooter() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/clients/ecospray" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-white text-lg">EcoSpray</span>
                <span className="text-green-400 text-sm ml-1">Solutions</span>
              </div>
            </Link>
            <p className="text-zinc-400 text-sm mb-4 max-w-md">
              Pittsburgh&apos;s trusted spray foam insulation experts. We help homeowners and
              businesses save energy, improve comfort, and protect their properties.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-zinc-500 hover:text-green-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-zinc-500 hover:text-green-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/clients/ecospray" className="block text-sm text-zinc-400 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="#services" className="block text-sm text-zinc-400 hover:text-white transition-colors">
                Services
              </Link>
              <Link href="#benefits" className="block text-sm text-zinc-400 hover:text-white transition-colors">
                Benefits
              </Link>
              <Link href="#process" className="block text-sm text-zinc-400 hover:text-white transition-colors">
                How It Works
              </Link>
              <Link href="/clients/ecospray/contact" className="block text-sm text-zinc-400 hover:text-white transition-colors">
                Get a Quote
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact Us</h4>
            <div className="space-y-3">
              <a
                href="tel:+14125551234"
                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-green-500" />
                (412) 555-1234
              </a>
              <a
                href="mailto:info@ecospraysolutions.com"
                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-green-500" />
                info@ecospraysolutions.com
              </a>
              <div className="flex items-start gap-2 text-sm text-zinc-400">
                <MapPin className="w-4 h-4 text-green-500 mt-0.5" />
                <span>
                  Murrysville, PA<br />
                  Serving Pittsburgh & Western PA
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} EcoSpray Solutions. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-zinc-500">
            <span>PA License #123456</span>
            <span>|</span>
            <span>Fully Insured</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
