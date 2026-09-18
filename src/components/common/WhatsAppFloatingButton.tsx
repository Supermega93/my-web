import React from 'react';

/**
 * Floating WhatsApp contact button for Mega AI Labs.
 * Fixed to the bottom-left corner with mobile safe-area support,
 * desktop tooltip, and official WhatsApp brand styling.
 */
export const WhatsAppFloatingButton: React.FC = () => {
  const whatsappUrl =
    'https://wa.me/27644611412?text=Hi%20Mega%20AI%20Labs%2C%20I%20would%20like%20to%20know%20more%20about%20your%20services.';

  return (
    <div
      id="whatsapp-floating-container"
      className="fixed z-40 group pointer-events-auto bottom-[max(18px,env(safe-area-inset-bottom,18px))] left-[max(18px,env(safe-area-inset-left,18px))] sm:bottom-[max(24px,env(safe-area-inset-bottom,24px))] sm:left-[max(24px,env(safe-area-inset-left,24px))]"
    >
      {/* Desktop Tooltip */}
      <div
        id="whatsapp-tooltip"
        role="tooltip"
        className="hidden sm:block absolute left-full bottom-1/2 translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-900/95 text-white text-xs font-medium rounded-lg shadow-lg border border-slate-700/60 whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none transition-all duration-200 -translate-x-1 group-hover:translate-x-0 group-focus-within:translate-x-0"
      >
        Chat with us on WhatsApp
        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900/95" />
      </div>

      {/* Floating Action Button */}
      <a
        id="whatsapp-floating-button"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Mega AI Labs on WhatsApp"
        className="relative flex items-center justify-center w-12 h-12 sm:w-[50px] sm:h-[50px] rounded-full bg-[#25D366] text-white shadow-[0_8px_20px_-4px_rgba(37,211,102,0.45),0_2px_8px_rgba(0,0,0,0.15)] hover:shadow-[0_10px_25px_-3px_rgba(37,211,102,0.6),0_4px_12px_rgba(0,0,0,0.2)] hover:bg-[#20bd5a] hover:scale-105 active:scale-95 transition-all duration-200 border border-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 cursor-pointer"
      >
        {/* Official WhatsApp Logo SVG */}
        <svg
          viewBox="0 0 32 32"
          className="w-6 h-6 sm:w-7 sm:h-7 fill-white"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M16 2C8.268 2 2 8.268 2 16c0 2.65.733 5.13 2.008 7.258L2.3 29.7l6.63-1.66A13.92 13.92 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.645c-2.316 0-4.482-.693-6.292-1.884l-.45-.297-4.148 1.04 1.077-3.992-.303-.464A11.597 11.597 0 014.355 16c0-6.42 5.225-11.645 11.645-11.645s11.645 5.225 11.645 11.645-5.225 11.645-11.645 11.645zm6.44-8.735c-.352-.176-2.083-1.028-2.406-1.145-.323-.117-.558-.176-.793.176-.235.352-.91 1.145-1.115 1.38-.205.234-.41.263-.762.087-.352-.176-1.487-.548-2.832-1.748-1.047-.933-1.753-2.085-1.958-2.438-.205-.352-.022-.543.154-.718.158-.158.352-.41.528-.616.176-.205.235-.352.352-.586.117-.235.059-.44-.03-.616-.088-.176-.792-1.908-1.085-2.612-.286-.686-.576-.593-.792-.604l-.675-.012c-.234 0-.615.088-.938.44-.323.352-1.232 1.203-1.232 2.933s1.261 3.402 1.437 3.637c.176.234 2.482 3.79 6.012 5.314.84.363 1.496.58 2.007.742.843.268 1.61.23 2.217.14.676-.101 2.083-.85 2.376-1.67.293-.82.293-1.524.205-1.671-.088-.147-.322-.235-.674-.41z" />
        </svg>

        <span className="sr-only">Chat with Mega AI Labs on WhatsApp</span>
      </a>
    </div>
  );
};
