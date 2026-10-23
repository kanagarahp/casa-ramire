/** Brand marks shared by the login screen and the app shell. */

export function logoMark(className = 'w-10 h-10') {
  return `
    <svg viewBox="0 0 100 100" class="${className}" aria-hidden="true" focusable="false">
      <path d="M 20,40 L 50,15 L 80,40 L 80,80 L 20,80 Z" fill="none" stroke="#d4a359" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 50,65 Q 40,50 30,45 Q 45,45 50,65 Z" fill="#ffffff"/>
      <path d="M 50,65 Q 50,40 55,30 Q 65,45 50,65 Z" fill="#ffffff"/>
      <path d="M 50,65 Q 60,50 70,48 Q 60,60 50,65 Z" fill="#ffffff"/>
      <path d="M 50,65 Q 55,75 65,72 Q 55,80 50,65 Z" fill="#ffffff"/>
      <path d="M 50,65 L 45,75" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
    </svg>
  `;
}

export function brandMark(className = 'w-10 h-10 rounded-2xl', opts = {}) {
  const { light = false } = opts;
  return `
    <div class="${className} ${light ? 'bg-white/10' : 'bg-brand'} flex items-center justify-center p-1.5 shadow-sm border border-gold/30 shrink-0">
      ${logoMark('w-full h-full')}
    </div>
  `;
}
