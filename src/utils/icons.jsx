
const { useEffect, useRef } = React;

export function Icon({ name, className = "w-4 h-4", ...props }) {
  const iconRef = useRef(null);

  useEffect(() => {
    if (!iconRef.current) return;
    try {
      if (window.lucide && window.lucide.icons) {
        // Find icon by name in kebab-case, camelCase, or PascalCase
        const camelCase = name.replace(/-([a-z0-9])/g, (_, ch) => ch.toUpperCase());
        const pascalCase = camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
        const iconDef = window.lucide.icons[name] || window.lucide.icons[camelCase] || window.lucide.icons[pascalCase];

        if (iconDef && typeof iconDef.toSvg === 'function') {
          iconRef.current.innerHTML = iconDef.toSvg({ class: className });
          return;
        }
      }

      // Safe fallback if iconDef.toSvg is not found
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        const parent = iconRef.current.parentElement;
        if (parent) {
          window.lucide.createIcons({ root: parent });
        }
      }
    } catch (e) {
      // Silently catch any icon rendering error
    }
  }, [name, className]);

  return (
    <span 
      ref={iconRef} 
      data-lucide={name} 
      className={`inline-flex items-center justify-center shrink-0 ${className}`} 
      {...props} 
    />
  );
}
