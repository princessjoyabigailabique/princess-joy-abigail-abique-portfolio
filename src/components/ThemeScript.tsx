/** Runs before paint to avoid theme flash. Respects OS preference for first-time visitors. */
export default function ThemeScript() {
  const code = `(function(){var r=document.documentElement;try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}r.setAttribute('data-theme',t);}catch(e){r.setAttribute('data-theme','dark');}try{if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){r.setAttribute('data-intro-pending','true');window.__abiqueIntroStartedAt=performance.now();window.setTimeout(function(){r.removeAttribute('data-intro-pending');if(document.body)document.body.classList.remove('has-intro-overlay');},3500);}}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
