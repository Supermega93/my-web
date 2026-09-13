import { Product } from '../../types.ts';
import { STOREFRONT_MEDIA } from '../../constants/media.ts';
import { Button } from '../common/Button.tsx';
import { StatusBadge } from '../common/StatusBadge.tsx';
import { ArrowRight, ShoppingCart, Check, Monitor, BookOpen } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onViewDetails: (productId: string) => void;
  onBuyNow: (product: Product) => void;
  featured?: boolean;
}

export function ProductCard({
  product,
  onViewDetails,
  onBuyNow,
  featured = false,
}: ProductCardProps) {
  const meta = product.parsedMetadata || {};
  const isEa = product.type === 'ea';

  // Determine accurate image fallback
  const fallbackImage = isEa
    ? STOREFRONT_MEDIA.flagshipEa.imageUrl
    : (product.id === 'prod_ebook_ai_prompt'
        ? STOREFRONT_MEDIA.paidEbook2.coverUrl
        : STOREFRONT_MEDIA.paidEbook1.coverUrl);

  return (
    <div
      className={`group relative flex flex-col bg-[#111827] border rounded-xl overflow-hidden transition-all duration-200 hover:border-slate-700 hover:shadow-xl ${
        featured ? 'border-emerald-500/40 bg-gradient-to-b from-slate-900/90 to-[#111827]' : 'border-slate-800'
      }`}
    >
      {/* Product Image Stage */}
      <div className="relative h-48 w-full overflow-hidden bg-[#070B14] flex items-center justify-center border-b border-slate-800/80 p-3">
        {isEa ? (
          <div className="w-36 h-36 rounded-lg overflow-hidden border border-slate-700/60 shadow-lg bg-[#070B14] flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <img
              src={product.image_url || fallbackImage}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full aspect-square object-contain rounded-lg"
            />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center p-2 group-hover:scale-105 transition-transform duration-300">
            <img
              src={product.image_url || fallbackImage}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="max-h-40 w-auto object-contain filter drop-shadow-[0_16px_28px_rgba(0,0,0,0.85)]"
            />
          </div>
        )}

        <div className="absolute top-3 left-3 flex items-center gap-2">
          <StatusBadge status={product.type} type="type" size="sm" />
          {featured && (
            <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-emerald-500 text-slate-950 font-bold rounded-full">
              Flagship System
            </span>
          )}
        </div>

        {product.platform && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950/90 border border-slate-800 text-[11px] text-slate-300 font-mono">
            {isEa ? <Monitor className="w-3.5 h-3.5 text-emerald-400" /> : <BookOpen className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{product.platform}</span>
          </div>
        )}
      </div>

      {/* Body Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
            {product.name}
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed">
            {product.short_description || product.description}
          </p>

          {/* Quick Specs / Features preview */}
          {meta.features && meta.features.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5">
              {meta.features.slice(0, 3).map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="truncate">{feat}</span>
                </div>
              ))}
            </div>
          )}

          {/* Ebook Highlights preview */}
          {meta.highlights && meta.highlights.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5">
              {meta.highlights.slice(0, 2).map((h, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span className="truncate">{h}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pricing and Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-500 block">Instant Access</span>
            <span className="text-xl font-bold text-slate-100 font-mono">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-xs text-slate-400 ml-1">USD</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(product.id)}
            >
              View Details
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onBuyNow(product)}
              icon={<ShoppingCart className="w-3.5 h-3.5 text-slate-950" />}
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
