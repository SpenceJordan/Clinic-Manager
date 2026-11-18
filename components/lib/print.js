
// Print views are built as HTML strings. html`...` escapes every value put into it, so a name like
// <img onerror=...> prints as text instead of running. Nested html`` pieces and arrays of them are kept as markup.
export const MARKUP=Symbol("markup");
export const escHtml=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
export const htmlPart=v=>Array.isArray(v)?v.map(htmlPart).join(""):(v&&v[MARKUP]!==undefined?v[MARKUP]:escHtml(v));
export function html(strings,...vals){
  const out=strings.reduce((acc,str,i)=>acc+str+(i<vals.length?htmlPart(vals[i]):""),"");
  return{[MARKUP]:out,toString:()=>out};
}
