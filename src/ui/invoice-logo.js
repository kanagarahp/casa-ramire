/**
 * Casa Ramire brand mark used by the invoice preview.
 * The same geometry is mirrored in api/_lib/invoice.js for the PDF.
 */
export function invoiceLogoMark(className = 'w-12 h-14') {
  return `
    <svg viewBox="300 60 380 430" class="${className}" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
      <path d="M 330 430 L 330 230 L 512 90 L 672 232 L 648 256 L 648 430" fill="none" stroke="#c99a4a" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 330 430 C 390 485 590 485 648 430" fill="none" stroke="#c99a4a" stroke-width="14" stroke-linecap="round"/>
      <path d="M 515 365 C 500 305 512 215 562 170 C 598 225 590 315 548 355 Z" fill="#ffffff"/>
      <path d="M 505 360 C 465 325 415 292 388 278 C 414 330 460 368 500 388 Z" fill="#ffffff"/>
      <path d="M 548 360 C 598 325 648 305 680 305 C 660 352 610 388 560 395 Z" fill="#ffffff"/>
      <path d="M 535 410 C 585 393 638 403 678 435 C 625 466 575 450 532 425 Z" fill="#ffffff"/>
      <path d="M 468 468 L 545 292" fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>
      <path d="M 505 398 L 632 330" fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>
      <path d="M 525 392 L 612 432" fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>
    </svg>
  `;
}
