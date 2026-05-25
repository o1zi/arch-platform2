'use client'

interface SocialFloatProps {
  whatsapp?: string | null
  snapchat_url?: string | null
  tiktok_url?: string | null
  whatsapp_note?: string | null
}

export function SocialFloat({ whatsapp, snapchat_url, tiktok_url, whatsapp_note }: SocialFloatProps) {
  const hasAny = whatsapp || snapchat_url || tiktok_url
  if (!hasAny) return null

  const waLink = whatsapp
    ? `https://wa.me/${whatsapp.replace(/\D/g, '')}${whatsapp_note ? `?text=${encodeURIComponent(whatsapp_note)}` : ''}`
    : null

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-center gap-3">
      {/* TikTok */}
      {tiktok_url && (
        <a
          href={tiktok_url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="TikTok"
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
          style={{ backgroundColor: '#000000' }}
        >
          {/* TikTok SVG logo */}
          <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
          </svg>
        </a>
      )}

      {/* Snapchat */}
      {snapchat_url && (
        <a
          href={snapchat_url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Snapchat"
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
          style={{ backgroundColor: '#FFFC00' }}
        >
          {/* Snapchat ghost SVG */}
          <svg viewBox="0 0 24 24" fill="black" className="w-6 h-6">
            <path d="M12.206 1c-.758 0-3.804.214-5.143 3.265-.39.908-.31 2.465-.27 3.235l-.003.052c-.014.177-.032.398-.059.578-.132.016-.284.025-.464.025-.372 0-.783-.068-1.142-.198-.03-.011-.062-.016-.093-.016-.179 0-.334.143-.334.322 0 .155.108.287.26.319.033.007.068.015.105.022.532.108 1.065.362 1.127.686.012.064.016.13.012.195-.065 1.136-.834 2.93-1.665 3.766-.146.146-.177.37-.079.554.104.194.314.288.542.236.248-.057.516-.087.793-.087.356 0 .615.06.74.1.367.116.625.389.794.598.508.62 1.064 1.584 3.037 1.584.224 0 .453-.012.686-.037.181-.019.366-.028.553-.028.19 0 .378.009.561.028.233.025.462.037.686.037 1.979 0 2.538-.966 3.043-1.584.169-.209.425-.482.792-.597.126-.04.387-.1.743-.1.277 0 .545.03.793.087.232.053.44-.04.545-.238.098-.184.067-.408-.079-.554-.831-.836-1.6-2.63-1.665-3.766a1.153 1.153 0 0 1 .012-.195c.062-.324.595-.578 1.127-.686.037-.007.072-.015.105-.022a.323.323 0 0 0 .26-.319c0-.18-.155-.324-.334-.324-.031 0-.063.005-.093.016-.359.13-.77.198-1.142.198-.183 0-.335-.009-.468-.025-.027-.18-.045-.401-.059-.578l-.003-.052c.04-.77.12-2.327-.27-3.235C16.01 1.214 12.964 1 12.206 1z"/>
          </svg>
        </a>
      )}

      {/* WhatsApp */}
      {waLink && (
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
          style={{ backgroundColor: '#25D366' }}
        >
          <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
          </svg>
        </a>
      )}
    </div>
  )
}
