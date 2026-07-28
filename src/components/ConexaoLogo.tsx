interface ConexaoLogoProps {
  className?: string;
}

export function ConexaoLogo({ className = "w-14 h-14" }: ConexaoLogoProps) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 152 65 A 62 62 0 0 1 155 125" stroke="#22c55e" strokeWidth="9" strokeLinecap="round" />
      <path d="M 141 53 L 163 60 L 148 78 Z" fill="#22c55e" />
      <path d="M 48 135 A 62 62 0 0 1 45 75" stroke="#16a34a" strokeWidth="9" strokeLinecap="round" />
      <path d="M 59 147 L 37 140 L 52 122 Z" fill="#16a34a" />
      <g transform="translate(162, 95)">
        <circle cx="0" cy="0" r="15" fill="#e2e8f0" stroke="#475569" strokeWidth="2.5" />
        <circle cx="0" cy="-4" r="5.5" fill="#64748b" />
        <path d="M -9 9 C -9 5, -5 3, 0 3 C 5 3, 9 5, 9 9 Z" fill="#64748b" />
      </g>
      <g transform="translate(38, 105)">
        <circle cx="0" cy="0" r="15" fill="#e2e8f0" stroke="#475569" strokeWidth="2.5" />
        <circle cx="0" cy="-4" r="5.5" fill="#64748b" />
        <path d="M -9 9 C -9 5, -5 3, 0 3 C 5 3, 9 5, 9 9 Z" fill="#64748b" />
      </g>
      <g transform="translate(100, 35)">
        <circle cx="0" cy="0" r="15" fill="#e2e8f0" stroke="#475569" strokeWidth="2.5" />
        <circle cx="0" cy="-4" r="5.5" fill="#64748b" />
        <path d="M -9 9 C -9 5, -5 3, 0 3 C 5 3, 9 5, 9 9 Z" fill="#64748b" />
      </g>
      <text x="100" y="93" textAnchor="middle" fill="#94a3b8" fontSize="13" fontWeight="bold" letterSpacing="1.2">CONEXÃO</text>
      <text x="100" y="132" textAnchor="middle" fill="#ffffff" fontSize="33" fontWeight="900" letterSpacing="-1">B2B</text>
    </svg>
  );
}
