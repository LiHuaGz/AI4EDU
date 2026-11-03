/** Compute Engine 0.177.0 */
import{$e as il,$f as Al,Ae as jt,Af as _l,Be as Za,Bf as bl,Ce as Xa,Cf as Mn,De as Xo,Df as On,Ee as Ja,Ef as yl,Fd as Yo,Fe as Jo,Ff as vl,Ge as kr,Gf as xl,He as Dt,Hf as wl,Ie as _t,If as Ir,Je as Qa,Jf as qt,Ke as el,Kf as Et,Le as bt,Lf as $l,Ma as Ua,Me as Lr,Mf as Ht,Ne as Qo,Nf as wn,Oe as yt,Of as Mr,Pe as nl,Pf as Or,Qe as tl,Qf as El,Re as rl,Rf as Cl,Se as Ar,Sf as Wt,Te as ol,Tf as Ur,Ue as ei,Ve as Rr,Vf as Sl,We as Vt,Wf as zl,Xe as Tr,Xf as Pl,Ye as In,Yf as ri,Ze as vt,Zf as kl,_e as Gr,_f as Ll,af as xt,ag as Br,bd as Ba,bf as sl,cd as ja,ce as Da,cf as ni,df as al,ef as ll,ff as Nr,gf as ul,hf as fl,if as ti,jf as cl,kf as p,lf as pl,me as Ko,mf as wt,ne as Va,oe as Pr,pe as qa,qe as ht,qf as dl,re as Fn,rf as ml,se as Ha,sf as Qn,te as Wa,tf as hl,ue as gt,uf as gl,ve as cn,vf as Fr,we as nn,wf as $t,xe as Ya,xf as Ie,ye as Ka,yf as Y,ze as Zo,zf as ne}from"./chunk-IAWBIWQT.js";import{a as Wo}from"./chunk-NWAYRMFS.js";import{F as Ma,H as Oa}from"./chunk-6SZSAWSK.js";import{e as fn}from"./chunk-CG7IRENN.js";import{Gb as Ta,Pm as Ho,Qm as zr,Ri as un,Sc as Bo,Uc as Ga,Wd as Na,Wl as qo,Xd as Fa,bb as La,bf as jo,cb as Jn,eb as Aa,fa as D,ga as C,i as Fe,j as mt,jb as xn,jf as Do,pa as b,qb as Mo,qg as Ia,rb as Oo,sa as en,sb as Ra,se as Sr,va as Io}from"./chunk-H7TXMTPU.js";import{r as Vo}from"./chunk-DGOFHF5R.js";import{f as Uo}from"./chunk-WUTXP56J.js";import{Da as Se,Gb as Gn,Jb as Bt,Oa as q,R as Ce,U as xa,Xb as Qe,kc as Ve,l as vn,m as Xn,mb as wa,mc as Fo,pc as Sa,sb as $a,tb as Ea,ub as dt,uc as X,wb as Ca}from"./chunk-3RIARUF2.js";import{W as za,X as Pa,_ as ka,b as fe,j as Nn}from"./chunk-3MTZVSJG.js";var $p=new Set(["Add","Subtract","Negate","Multiply","Divide","Rational","Power","Sqrt","Root"]);function Gl(e){if(D(e))return!e.isComplex&&e.isFinite===!0;if(!b(e)||!$p.has(e.operator))return!1;if(e.operator==="Power"){let n=e.ops[1];if(n===void 0||!D(n)||!(Math.abs(n.re)<=4096))return!1}return e.ops.every(Gl)}function Ct(e){if(!Gl(e))return;let n=D(e)?e:e.evaluate();return D(n)&&!n.isComplex&&n.isFinite===!0?n:void 0}function Yt(e){if(!D(e))return;let n=e.numericValue,t=typeof n=="number"?new fe(n):n.bignumRe;return t!==void 0&&t.isFinite()?t:void 0}function si(e,n,t){let r=()=>{let i=fe.ZERO;for(let s of e){let a=Yt(s);if(a===void 0)return;i=i.add(a)}if(n.length>0){let s=fe.ZERO;for(let a of n){let l=Yt(a);if(l===void 0)return;s=s.add(l)}i=i.add(s.mul(fe.PI))}return i},o=fe.precision;try{fe.precision=50;let i=r();if(i===void 0)return;if(i.isZero())return t(i);let s=i.significand<0n?-i.significand:i.significand,a=i.exponent+s.toString().length;if(a>1e4)return;fe.precision=Math.max(50,a+30);let l=r();return l===void 0?void 0:t(l)}finally{fe.precision=o}}var Ep=26e6,Cp=5e4,Sp=1e-4,Nl=`
uniform highp uint _gpu_zero_u;
highp float _gpu_opq(highp float v) {
  return uintBitsToFloat(floatBitsToUint(v) ^ _gpu_zero_u);
}

highp vec2 _gpu_two_sum(highp float fa, highp float fb) {
  highp float a = _gpu_opq(fa);
  highp float b = _gpu_opq(fb);
  highp float s = _gpu_opq(a + b);
  highp float bb = _gpu_opq(s - a);
  return vec2(s, _gpu_opq(a - _gpu_opq(s - bb)) + _gpu_opq(b - bb));
}

highp vec2 _gpu_two_prod(highp float fa, highp float fb) {
  highp float a = _gpu_opq(fa);
  highp float b = _gpu_opq(fb);
  highp float p = _gpu_opq(a * b);
  highp uint ua = floatBitsToUint(a);
  highp uint ub = floatBitsToUint(b);
  if (!(abs(p) >= 1e-30 && abs(p) <= 1e30) || (ua & 0x7F800000u) == 0u || (ub & 0x7F800000u) == 0u) return vec2(p, 0.0);
  highp uint up = floatBitsToUint(p);
  highp uint ma = (ua & 0x7FFFFFu) | 0x800000u;
  highp uint mb = (ub & 0x7FFFFFu) | 0x800000u;
  highp uint mp = (up & 0x7FFFFFu) | 0x800000u;
  highp int sc = int((ua >> 23) & 0xFFu) + int((ub >> 23) & 0xFFu) - 300;
  highp int s = int((up >> 23) & 0xFFu) - 150 - sc;
  highp uint a1 = ma >> 12;
  highp uint a0 = ma & 0xFFFu;
  highp uint b1 = mb >> 12;
  highp uint b0 = mb & 0xFFFu;
  highp uint lo = a0 * b0 + ((a1 * b0 + a0 * b1) << 12) + ((a1 * b1) << 24);
  highp uint d = lo - (mp << uint(s));
  highp int r = (d & 0x80000000u) != 0u ? -int(~d + 1u) : int(d);
  highp float sgn = ((ua ^ ub) & 0x80000000u) != 0u ? -1.0 : 1.0;
  highp int h = sc / 2;
  return vec2(p, sgn * float(r) * uintBitsToFloat(uint(h + 127) << 23) * uintBitsToFloat(uint(sc - h + 127) << 23));
}

highp vec4 _gpu_xred_fix(highp vec4 a) {
  highp float r = a.x;
  highp float lo = a.y;
  highp float k = floor(_gpu_opq((r + lo) * 0.636619772) + 0.5);
  highp vec2 t = _gpu_two_sum(r, -(k * 1.5703125));
  r = t.x;
  lo += t.y;
  t = _gpu_two_sum(r, -(k * 4.8375129699707031e-4));
  r = t.x;
  lo += t.y;
  lo -= k * 7.5495336204767227e-8 + k * 2.5632829192545614e-12;
  highp float q = a.z + k;
  return vec4(r, lo, q - 4.0 * floor(q / 4.0), a.w);
}

highp vec4 _gpu_xred(highp float x, highp float khi, highp float klo, highp float xmax) {
  highp vec2 pe = _gpu_two_prod(x, khi);
  highp vec2 qe = _gpu_two_prod(x, klo);
  highp float p = pe.x;
  highp float k = floor(_gpu_opq(p * 0.636619772) + 0.5);
  highp float kh = floor(k / 4096.0);
  highp float kl = k - kh * 4096.0;
  highp vec2 s = _gpu_two_sum((kh * 1.5703125) * 4096.0, kl * 1.5703125);
  highp float r = _gpu_opq(p - s.x);
  highp vec2 t = _gpu_two_sum(r, -(kh * 4.8375129699707031e-4) * 4096.0);
  r = t.x;
  highp float lo = t.y;
  t = _gpu_two_sum(r, -(kl * 4.8375129699707031e-4));
  r = t.x;
  lo += t.y;
  t = _gpu_two_sum(r, -(kh * 7.5495336204767227e-8) * 4096.0);
  r = t.x;
  lo += t.y;
  t = _gpu_two_sum(r, -(kl * 7.5495336204767227e-8));
  r = t.x;
  lo += t.y;
  lo -= k * 2.5632829192545614e-12 + k * 6.1230317691118863e-17;
  t = _gpu_two_sum(r, -s.y);
  r = t.x;
  lo += t.y;
  t = _gpu_two_sum(r, pe.y);
  r = t.x;
  lo += t.y;
  t = _gpu_two_sum(r, qe.x);
  r = t.x;
  lo += t.y + qe.y;
  return _gpu_xred_fix(vec4(r, lo, k, abs(x) <= xmax ? 1.0 : 0.0));
}

highp vec4 _gpu_xred_add(highp vec4 a, highp vec4 b) {
  highp vec2 s = _gpu_two_sum(a.x, b.x);
  return _gpu_xred_fix(vec4(s.x, a.y + b.y + s.y, a.z + b.z, a.w * b.w));
}

highp vec2 _gpu_xsin(highp vec4 a) {
  highp vec2 rr = _gpu_two_sum(a.x, a.y);
  highp float rh = rr.x;
  highp float rl = rr.y;
  highp float r2 = rh * rh;
  highp float ts = (rh * r2) * (-0.166666667 + r2 * (8.33333333e-3 + r2 * (-1.98412698e-4 + r2 * 2.75573192e-6)));
  highp vec2 sn = _gpu_two_sum(rh, (rl - 0.5 * rl * r2) + ts);
  highp vec2 p2 = _gpu_two_prod(rh, rh);
  highp float tc = (p2.x * p2.x) * (4.16666667e-2 + p2.x * (-1.38888889e-3 + p2.x * (2.48015873e-5 + p2.x * -2.75573192e-7)));
  highp vec2 c1 = _gpu_two_sum(1.0, -0.5 * p2.x);
  highp vec2 cs = _gpu_two_sum(c1.x, c1.y + (-0.5 * (p2.y + 2.0 * rh * rl) + tc));
  if (a.z == 0.0) return sn;
  if (a.z == 1.0) return cs;
  if (a.z == 2.0) return -sn;
  return -cs;
}

highp float _gpu_xfract(highp vec2 s, highp float ohi, highp float olo, highp float ok) {
  highp float sx = _gpu_opq(s.x);
  highp float sy = _gpu_opq(s.y);
  highp vec2 pe = _gpu_two_prod(sx, ohi);
  highp vec2 a = _gpu_two_sum(pe.x, -floor(pe.x));
  highp float small = a.y + (pe.y + sy * ohi + sx * olo);
  highp float h = _gpu_opq(a.x + small);
  if (h >= 1.0) {
    highp float d = _gpu_opq(a.x - 1.0) + small;
    h = d >= 0.0 ? d : 0.99999994;
  }
  if (h < 0.0) {
    h = _gpu_opq(h + 1.0);
    if (h >= 1.0) h = 0.99999994;
  }
  return ok > 0.5 ? h : uintBitsToFloat(0x7FC00000u);
}

highp float _gpu_xhash_sin(highp vec4 a, highp float ohi, highp float olo) {
  return _gpu_xfract(_gpu_xsin(a), ohi, olo, a.w);
}

highp float _gpu_xhash_cos(highp vec4 a, highp float ohi, highp float olo) {
  highp float q = a.z + 1.0;
  return _gpu_xfract(_gpu_xsin(vec4(a.x, a.y, q - 4.0 * floor(q / 4.0), a.w)), ohi, olo, a.w);
}
`,oi=new WeakMap;function Rl(e){let n=e.naming;if(n===void 0)return;let t=oi.get(n);return t===void 0&&(t={bounds:[],warnings:[]},oi.set(n,t)),t}function Fl(e,n){let t=e.naming===void 0?void 0:oi.get(e.naming),r=[],o=[];if(t===void 0)return{bounds:r,warnings:o};for(let{bound:i,text:s}of t.bounds)n.includes(s)&&!r.some(a=>a.operand===i.operand&&a.maxAbs===i.maxAbs)&&r.push({...i});for(let{warning:i,text:s}of t.warnings)n.includes(s)&&!o.some(a=>a.code===i.code&&a.value===i.value)&&o.push({...i});return{bounds:r,warnings:o}}var zp=new Set(["Sin","Cos","Tan","Cot","Sec","Csc"]);function jr(e){let n=Ct(e);return n===void 0?void 0:n.re}function Il(e){if(!b(e))return!1;let n=t=>{let r=jr(t);return r!==void 0&&Math.abs(r)>=1e3};if(e.operator==="Multiply"&&e.ops.some(n))return!0;if(e.operator==="Divide"){let t=e.ops[1]===void 0?void 0:jr(e.ops[1]);if(t!==void 0&&t!==0&&Math.abs(t)<=.001)return!0}return e.operator==="Dot"&&e.ops.some(t=>(b(t,"List")||b(t,"Tuple"))&&t.ops.some(n))?!0:e.ops.some(Il)}function Dr(e){let n=(t,r,o)=>{if(!b(t))return!1;if(zp.has(t.operator))return o||t.ops.some(Il)||t.ops.some(i=>n(i,!1,!1));if(!r)return t.ops.some(i=>n(i,!1,!1));switch(t.operator){case"Multiply":{let i=t.ops.some(s=>{let a=jr(s);return a!==void 0&&Math.abs(a)>=1e3});return t.ops.some(s=>n(s,!0,o||i))}case"Divide":{let i=t.ops[1]===void 0?void 0:jr(t.ops[1]),s=i!==void 0&&i!==0&&Math.abs(i)<=.001;return n(t.ops[0],!0,o||s)||t.ops[1]!==void 0&&n(t.ops[1],!1,!1)}case"Negate":case"Add":case"Subtract":case"Abs":return t.ops.some(i=>n(i,!0,o));default:return t.ops.some(i=>n(i,!1,!1))}};return n(e,!0,!1)}function Ml(e,n){return n===void 0||n.size===0||!b(e)?!1:n.has(e.operator)||e.ops.some(t=>Ml(t,n))}function Ol(e,n){return C(e)?n.varsKeys?.has(e.symbol)===!0?!0:n.boundVars?.has(e.symbol)===!0?!1:e.value===void 0:!1}function ii(e,n){if(C(e))return e.type.matches("integer")?2**24:Ol(e,n)?1/0:void 0;let t=o=>{if(D(o)){if(o.isComplex)return;let i=o.re;return Number.isInteger(i)&&Math.abs(i)<2**24?1:Number.isInteger(i*256)&&Math.abs(i)<2**16?256:void 0}if(C(o))return o.type.matches("integer")?1:void 0;if(b(o)){if(["Floor","Ceil","Round","Truncate"].includes(o.operator))return o.nops===1&&o.ops[0]!==void 0&&ii(o.ops[0],n)!==void 0?1:void 0;if(["Add","Subtract","Negate"].includes(o.operator)){let i=1;for(let s of o.ops){let a=t(s);if(a===void 0)return;a===256&&(i=256)}return i}if(o.operator==="Multiply")return o.ops.every(i=>t(i)===1)?1:void 0}},r=t(e);if(r!==void 0)return r===1?2**24:2**16}function Pp(e,n,t){let r,o=e;if(b(e,"Multiply")&&e.nops===2){let[_,x]=D(e.ops[0])?[e.ops[0],e.ops[1]]:[e.ops[1],e.ops[0]];if(!D(_)||_.isComplex||!Number.isFinite(_.re)||Math.abs(_.re)>Cp)return;r=_,o=x}if(!b(o,"Sin")&&!b(o,"Cos")||p.isComplexValued(o))return;let i=o.ops[0];if(i===void 0)return;let s=[],a=[],l=[],u=_=>D(_)&&!_.isComplex&&Number.isFinite(_.re),f=_=>t(_)==="scalar"&&!p.isComplexValued(_),c=e.engine,m=(_,x,v)=>{if(!f(v))return!1;let E=ii(v,n);return E===void 0?!1:(s.push({k:_,pi:x,x:v,exactBelow:E}),!0)},d=_=>{let x=Ct(_);if(x!==void 0)return a.push(x),!0;let v=p.piMultiple(_),E=v===void 0?void 0:Ct(v);if(E!==void 0)return l.push(E),!0;let S=v!==void 0,$=v??_;if(b($,"Negate")&&$.ops[0]!==void 0)return m(c.number(-1),S,$.ops[0]);if(b($,"Multiply")){let N=$.ops.findIndex(u);if(N>=0){let I=$.ops.filter((O,F)=>F!==N);return I.length!==1?!1:m($.ops[N],S,I[0])}}if(!S&&b($,"Dot")&&$.nops===2){let[N,I]=$.ops,[O,F]=b(I,"List")||b(I,"Tuple")?[N,I]:[I,N];if(!(b(F,"List")||b(F,"Tuple"))||!F.ops.every(u)||t(O)!==F.nops||O.isPure===!1)return!1;let w=z=>{if(C(O))return Ol(O,n)?1/0:void 0;if(b(O,"List")||b(O,"Tuple")){let G=O.ops[z];return G===void 0?void 0:ii(G,n)}};for(let z=0;z<F.nops;z++){if(F.ops[z].re===0)continue;let G=w(z);if(G===void 0)return!1;s.push({k:F.ops[z],pi:!1,x:{vector:O,index:z},exactBelow:G})}return!0}return m(c.One,S,$)};if((b(i,"Add")?i.ops:[i]).every(d)&&!(s.length===0||s.length>4))return{outer:r,trig:o.operator,terms:s,literals:a,piFactors:l}}function Tl(e,n){if(e===void 0)return{hi:1,lo:0,residual:0};let t=fe.precision;try{fe.precision=50;let r=Yt(e)??new fe(e.re);n&&(r=r.mul(fe.PI));let o=Math.fround(r.toNumber()),i=r.sub(new fe(o)),s=Math.fround(i.toNumber()),a=Math.abs(i.sub(new fe(s)).toNumber());return{hi:o,lo:s,residual:a}}finally{fe.precision=t}}function kp(e){if(!Number.isFinite(e))return e;let n=Math.fround(e);return n>e&&(n=Math.fround(n*(1-2**-24))),n}var Lp=["x","y","z","w"];function St(e,n,t,r,o,i,s){if(Ml(n,o.foldExcludedOps)||!Dr(n))return;let a=v=>{let E=s();return Rl(o)?.warnings.push({text:E,warning:{code:"float32-unsafe-argument",kind:"correctness",value:n.toString(),message:`The operand of \`${e}\` amplifies a trigonometric value by a constant of magnitude 1000 or more, so its float32 value on ${o.language??"a shader"} can have no relation to the exact value (a sine hash such as \`fract(43758.5\xB7sin(12.9898\xB7x))\`). ${v}`}}),E},l=o.language==="glsl"&&t&&i(n)==="scalar"?Pp(n,o,i):void 0;if(l===void 0)return a(o.language==="glsl"?"The exact form covers `Mod(O\xB7sin(\u03A3 K\xB7x + c), 1)` (or `cos`, or a `Dot` with a list of numbers) with |O| \u2264 50000 and each x an input or an integer-valued expression.":"This target has no exact form.");let u;if(l.literals.length+l.piFactors.length>0&&(u=si(l.literals,l.piFactors,v=>{let E=fe.PI.div(2),S=v.div(E).round(),$=v.sub(S.mul(E)),N=S.sub(S.div(4).floor().mul(4)).toNumber(),I=Math.fround($.toNumber()),O=Math.fround($.sub(new fe(I)).toNumber());return{hi:I,lo:O,q:N}}),u===void 0))return a("The constant term of the trigonometric argument is too large to reduce exactly.");let f=n.engine,c=Tl(l.outer,!1),m=[],d=[];for(let v of l.terms){let E=Tl(v.k,v.pi),S,$;if("vector"in v.x){let I=v.x.vector,O=b(I,"List")||b(I,"Tuple")?I.ops[v.x.index]:void 0;S=O!==void 0?r(O):`(${r(I)}).${Lp[v.x.index]}`,$=f.function("At",[v.x.vector,f.number(v.x.index+1)]).toString()}else S=r(v.x),$=v.x.toString();let N=kp(Math.min(Ep/Math.abs(E.hi),E.residual>0?Sp/(Math.abs(c.hi)*E.residual):1/0,v.exactBelow));m.push(`_gpu_xred(${S}, ${Y(E.hi,"glsl")}, ${Y(E.lo,"glsl")}, ${Y(N,"glsl")})`),d.push({operand:$,maxAbs:N})}u!==void 0&&(u.hi!==0||u.lo!==0||u.q!==0)&&m.push(`vec4(${Y(u.hi,"glsl")}, ${Y(u.lo,"glsl")}, ${Y(u.q,"glsl")}, 1.0)`);let g=m.reduce((v,E)=>`_gpu_xred_add(${v}, ${E})`),_=`_gpu_xhash_${l.trig==="Sin"?"sin":"cos"}(${g}, ${Y(c.hi,"glsl")}, ${Y(c.lo,"glsl")})`,x=Rl(o);for(let v of d)x?.bounds.push({bound:v,text:_});return _}function Bl(e,n,t,r){let o=r===1?"f32":`vec${r}f`,i=r===1?4:r===2?8:16;return{symbol:e,name:n,struct:`CE_List_${o}`,group:t.group,binding:t.binding,element:o,components:r,lengthOffset:0,dataOffset:i,stride:i,minBindingSize:2*i}}function jl(e){let n=new Set,t=`
`;for(let r of e)n.has(r.struct)||(n.add(r.struct),t+=`struct ${r.struct} { len: u32, data: array<${r.element}> }
`);for(let r of e)t+=`@group(${r.group}) @binding(${r.binding}) var<storage, read> ${r.name}: ${r.struct};
`;return t}function ai(e,n){return n===1?`_gpu_sbat_${e}`:`_gpu_sbatp${n}_${e}`}function li(e,n){return`_gpu_sb${e}_${n}`}function Dl(e){return`f32(min(${e}.len, arrayLength(&${e}.data)))`}function Vl(e,n){return new RegExp(`(?<![\\w$.])${n}\\.(len|data)\\b`).test(e)}function ql(e){let n=new Set,t="",r=/(?<![\w$])_gpu_sb(at|atp[234]|sum|prod|max|min|mean)_([A-Za-z_]\w*)\s*\(/g,o;for(;(o=r.exec(e))!==null;){let i=`${o[1]}_${o[2]}`;if(n.has(i))continue;n.add(i);let s=o[1],a=o[2];s==="at"?t+=Ul(a,1):s.startsWith("atp")?t+=Ul(a,Number(s.slice(3))):t+=Ap(s,a)}return t}function Ul(e,n){let t=n===1?"f32":`vec${n}f`,r=n===1?"_gpu_nan()":`${t}(_gpu_nan())`;return`
fn ${ai(e,n)}(_gpu_i: f32) -> ${t} {
  // 1-based; negative counts from the end; anything else \u2192 NaN. The list
  // has ${e}.len elements, and a len above the elements that the buffer
  // holds gives NaN. The float guard runs before the int cast; the int
  // guard catches the rounding of f32(len) above 2^24.
  let _gpu_n = ${e}.len;
  let _gpu_b = f32(_gpu_n);
  if (_gpu_n > arrayLength(&${e}.data) || _gpu_isnonfinite(_gpu_i) || !(_gpu_i >= -_gpu_b && _gpu_i <= _gpu_b) || _gpu_i != floor(_gpu_i) || _gpu_i == 0.0) {
    return ${r};
  }
  let _gpu_k = i32(_gpu_i);
  let _gpu_j = select(i32(_gpu_n) + _gpu_k, _gpu_k - 1, _gpu_k > 0);
  if (_gpu_j < 0 || u32(_gpu_j) >= _gpu_n) {
    return ${r};
  }
  return ${e}.data[_gpu_j];
}
`}function Ap(e,n){let t=`fn ${li(e,n)}() -> f32 {
  // A len above the elements that the buffer holds gives NaN.
  let _gpu_n = ${n}.len;`,r=(a,l)=>`  for (var _gpu_k = ${a}; _gpu_k < _gpu_n; _gpu_k++) {
    ${l}
  }`,o=`${n}.data[_gpu_k]`,i=`_gpu_n > arrayLength(&${n}.data)`;if(e==="max"||e==="min")return`
${t}
  if (_gpu_n == 0u || ${i}) {
    return _gpu_nan();
  }
  var _gpu_a = ${n}.data[0];
${r("1u",`_gpu_a = _gpu_${e}(_gpu_a, ${o});`)}
  return _gpu_a;
}
`;if(e==="mean")return`
${t}
  if (_gpu_n == 0u || ${i}) {
    return _gpu_nan();
  }
  var _gpu_a = 0.0;
${r("0u",`_gpu_a += ${o};`)}
  return _gpu_a / f32(_gpu_n);
}
`;let s=e==="sum";return`
${t}
  if (${i}) {
    return _gpu_nan();
  }
  var _gpu_a = ${s?"0.0":"1.0"};
${r("0u",`_gpu_a ${s?"+=":"*="} ${o};`)}
  return _gpu_a;
}
`}var Rp=1e4,Tp=1e6,Gp=8,Np=2e3,Hl=100;function Wl(e,n,t){if(n.userFunctions===void 0||!Bo(e))return e;let r=e.engine,o=new ui(r,n,t);if(!o.mentionsUserCall(e))return e;let i;try{i=o.expand(e,Yl,Fp,new Set)}catch(a){if(a===zt)return e;throw a}if(i===e||!o.sharesACallAcrossBodies())return e;let s=Gp*o.sourceSize(e);if(o.writtenSize(i)>s||Ip(i,s)>s||i.isValid!==!0)return e;for(let a of o.substituted)n.symbolDeps?.add(a);return i}var Yl=new Set,Fp="";function Ip(e,n){let t=[],r=new Set,o=c=>{if(!r.has(c)){if(r.add(c),b(c))for(let m of c.ops)o(m);t.push(c)}};o(e),t.reverse();let i=[-1],s=new Map,a=(c,m,d)=>{let g=`${c}:${m}:${d}`,_=s.get(g);return _===void 0&&(_=i.length,i.push(c),s.set(g,_)),_},l=new Map;t.forEach((c,m)=>l.set(c,m));let u=new Map([[e,new Set([0])]]),f=0;for(let c of t){let m=u.get(c);if(f+=m.size,f>n)return f;if(!b(c))continue;let d=new Set(Pr(c).map(g=>g.index));c.ops.forEach((g,_)=>{let x=u.get(g);if(x===void 0&&u.set(g,x=new Set),d.has(_))for(let v of m)x.add(a(v,l.get(c),_));else for(let v of m)x.add(v)})}return f}var zt=Symbol("over budget"),ui=class{constructor(n,t,r){this.engine=n;this.target=t;this.options=r}engine;target;options;calls=new Map;bodiesOf=new Map;nodes=new WeakMap;frames=[];mentions=new WeakMap;ids=new WeakMap;idOfSpelling=new Map;paths=new WeakMap;distinctNodes=0;pureSeen=new Set;substituted=new Set;substitutions=0;isShaderScalar(n){let t=this.target.loweredSymbolType?.(n);return t==="f32"||t==="float"}isHeadOverridden(n){return this.options.isOverridden(n)||this.target.unrollSkipHeads?.has(n)===!0||this.target.overridesHead?.(n)===!0}isUserFunction(n){return this.isHeadOverridden(n)?!1:p.userFunctionLiteral(this.engine,n)!==void 0}sourceSize(n){let t=$t(n),r=new Set,o=new Set,i=[n];for(;i.length>0;){let s=i.pop();if(o.has(s)||!b(s))continue;o.add(s),i.push(...s.ops);let a=s.operator;if(r.has(a)||!this.isUserFunction(a))continue;r.add(a);let l=p.userFunctionLiteral(this.engine,a);l!==void 0&&(t+=$t(l.ops[0]),i.push(l.ops[0]))}return t}writtenSize(n){let t=new Map,r=[n],o=new Set;for(;r.length>0;){let u=r.pop();if(!o.has(u)&&(o.add(u),!!b(u)))for(let f of u.ops)t.set(f,(t.get(f)??0)+1),r.push(f)}let i=u=>(t.get(u)??0)>=2&&this.pathCount(u)>=Va,s=new Map,a=u=>{let f=s.get(u);if(f!==void 0)return f;let c=1;if(b(u))for(let m of u.ops)c+=i(m)?1:a(m);return s.set(u,c),c},l=a(n);for(let u of o)i(u)&&(l+=a(u));return l}charge(n){this.pathCount(n)}pathCount(n){let t=this.paths.get(n);if(t!==void 0)return t;let r=1;if(b(n)){for(let o of n.ops)if(r+=this.pathCount(o),r>Tp)throw zt}if(this.paths.set(n,r),this.distinctNodes+=1,this.distinctNodes>Rp)throw zt;return r}checkPure(n){if(!Bo(n,this.pureSeen))throw zt}idOf(n){let t=this.ids.get(n);if(t!==void 0)return t;let r=b(n)?`${n.operator}(${n.ops.map(i=>this.idOf(i)).join(",")})`:JSON.stringify(n.json),o=this.idOfSpelling.get(r);return o===void 0&&(o=this.idOfSpelling.size,this.idOfSpelling.set(r,o)),this.ids.set(n,o),o}callKey(n,t){return`${n}(${t.map(r=>this.idOf(r)).join(",")})`}mentionsUserCall(n){if(!b(n))return!1;let t=this.mentions.get(n);if(t!==void 0)return t;let r=this.isUserFunction(n.operator)||n.ops.some(o=>this.mentionsUserCall(o));return this.mentions.set(n,r),r}sharesACallAcrossBodies(){for(let n of this.bodiesOf.values())if(n.size>1)return!0;return!1}expand(n,t,r,o){if(!b(n)||!this.mentionsUserCall(n)||n.operator==="Function"||this.isHeadOverridden(n.operator))return n;if(t.size>0){let u=this.expandNode(n,t,r,o);return this.charge(u),u}let i=this.nodes.get(n);if(i!==void 0){for(let u of i.keys)this.record(u,r);return i.result}let s={body:r,keys:new Set};this.frames.push(s);let a;try{a=this.expandNode(n,t,r,o)}finally{this.frames.pop()}this.charge(a),this.nodes.set(n,{result:a,keys:s.keys});let l=this.frames[this.frames.length-1];if(l!==void 0&&l.body===r)for(let u of s.keys)l.keys.add(u);return a}record(n,t){let r=this.bodiesOf.get(n);r===void 0&&(r=new Set,this.bodiesOf.set(n,r)),r.add(t);let o=this.frames[this.frames.length-1];o!==void 0&&o.body===t&&o.keys.add(n)}expandNode(n,t,r,o){let i=this.unrolledClause(n,t,r,o);if(i!==void 0)return i;let s=un(n);if((n.operator==="Sum"||n.operator==="Product")&&s.length>0)throw zt;if(s.length>0){if(n.localScope===void 0)return n;let u=new Set([...t,...s]),f=n.ops.map(m=>this.expand(m,u,r,o));if(f.every((m,d)=>m===n.ops[d]))return n;let c=Ia(n.localScope,this.engine,n.operator,f);return c===void 0?n:this.engine.function(n.operator,f,{scope:c})}let a=n.ops.map(u=>this.expand(u,t,r,o)),l=n.operator;if(this.isUserFunction(l)&&!t.has(l)&&!o.has(l)){let u=this.callKey(l,a);this.record(u,r);let f=t.size===0,c=f?this.calls.get(u):void 0;if(c!==void 0)return c;for(let d of a)this.checkPure(d);let m=p.substitutedUserFunctionBody(this.engine,l,a,this.target,t.size>0?Mp(t):void 0,d=>this.isShaderScalar(d));if(m!==void 0){if(this.substitutions+=1,this.substitutions>Np)throw zt;o.add(l);let d;try{d=this.expand(m,t,u,o)}finally{o.delete(l)}return this.substituted.add(l),f&&this.calls.set(u,d),d}}if(a.every((u,f)=>u===n.ops[f]))return n;if(l==="Which"){let u=this.nestedWhich(a);if(u!==void 0)return u}return this.engine.function(l,a)}nestedWhich(n){if(n.length<6||n.length%2!==0)return;let t=n[n.length-2];if(!C(t)||t.symbol!=="True")return;let r=this.engine.function("Which",n.slice(n.length-4),{form:"structural"});for(let o=n.length-6;o>=0;o-=2)r=this.engine.function("Which",[n[o],n[o+1],this.engine.True,r],{form:"structural"});return r}unrolledClause(n,t,r,o){let i=n.operator;if(i!=="Sum"&&i!=="Product"||n.nops!==2)return;let[s,a]=n.ops;if(!b(a,"Limits")||a.nops!==3)return;let[l,u,f]=a.ops;if(!this.mentionsUserCall(s)||!C(l))return;let c=l.symbol;if(!D(u)||!D(f))return;let m=u.re,d=f.re;if(!Number.isSafeInteger(m)||!Number.isSafeInteger(d)||d<m)return;let g=d-m+1;if(g>Hl||!Fr(g,$t(s),Hl)||s.isPure!==!0||(this.checkPure(s),p.isComplexValuedUnderIndices(s,[c]))||zr(s).has(c))return;let x=[];for(let v=m;v<=d;v++){let E=s.subs({[c]:this.engine.number(v)});x.push(this.expand(E,t,r,o))}return x.length===1?x[0]:this.engine.function(i==="Sum"?"Add":"Multiply",x,{form:"structural"})}};function Mp(e){return{scalarNames:Yl,localNames:e}}var Me=5e4;function Pt(e,n,t=Me){let r=new Map,o=new Map,i=[],s=[],a=new Set,l=[[e,0,Kl(e,n?.isCallerMapped)]];for(;l.length>0;){let y=l[l.length-1],[k,A,R]=y;if(A<R.length){y[1]=A+1;let W=R[A];r.has(W)||l.push([W,0,Kl(W,n?.isCallerMapped)]);continue}if(l.pop(),r.has(k))continue;let T=R.map(W=>r.get(W)),U=b(k)&&R.length!==k.nops,M=b(k)?`${U?`R${k.nops}`:""}${k.operator}(${T.join(",")})`:C(k)?`S${k.symbol}`:`L${JSON.stringify(k.json)}`,j=o.get(M);j===void 0&&(j=i.length,o.set(M,j),i.push(k),s.push(T),U&&a.add(j)),r.set(k,j)}let u=r.get(e),f=i.length,c=new Map,m=y=>{let k=c.get(y);if(k===void 0){let A=i[y];k=b(A)&&!a.has(y)?Op(A):new Array(s[y].length).fill(void 0),c.set(y,k)}return k},d=new Map,g=y=>{let k=d.get(y);if(k===void 0){let A=i[y];k=b(A)&&!a.has(y)?qa(A):s[y].map((R,T)=>T),d.set(y,k)}return k},_=new Map,x=y=>{let k=_.get(y);if(k===void 0){k=new Set;let A=i[y];C(A)&&k.add(A.symbol);for(let R of s[y])for(let T of x(R))k.add(T);_.set(y,k)}return k},v=[new Set],E=[-1],S=[void 0],$=(y,k)=>{for(let A=k;A>=0;A=E[A]){if(v[A].has(y))return!0;let R=S[A];if(R!==void 0){if(R.opaque)return!1;if(R.boundNames.length>0){let T=x(y);if(R.boundNames.some(U=>T.has(U)))return!1}}}return!1},N=y=>{for(let k=y;k>=0;k=E[k])if(S[k]?.inert===!0)return!0;return!1},I=0,O=[[u,0,0]];for(v[0].add(u),I=1;O.length>0;){let y=O[O.length-1],[k,A,R]=y,T=g(k);if(R>=T.length){O.pop();continue}y[2]=R+1;let U=T[R],M=s[k][U],j=A,W=m(k)[U];if(W!==void 0&&(j=v.length,v.push(new Set),E.push(A),S.push(W)),I+=1,I>t)return I;if(!N(j)){if($(M,j))continue;v[j].add(M)}O.push([M,j,0])}let F=new Array(f);for(let y=0;y<f;y++)F[y]=n!==void 0&&n.isCallerMapped(i[y]);let w=new Array(f).fill(0);w[u]=1;for(let y=f-1;y>=0;y--)if(!F[y])for(let k of s[y])w[k]=Math.min(2,w[k]+w[y]);let z=new Array(f);for(let y=0;y<f;y++)z[y]=n!==void 0&&n.share!==!1&&y!==u&&w[y]>=2&&n.mayRecord(i[y]);let G=new Array(f),h=new Array(f),L=0;for(let y=0;y<f;y++){let k=1;for(let R of s[y])k+=G[R];G[y]=k;let A=1;if(F[y])A=k;else for(let R of s[y])A+=z[R]?1:h[R];h[y]=A,z[y]&&(L+=A)}return Math.max(I,L+h[u])}function Op(e){let n=new Array(e.nops).fill(void 0),t=e.operator;if(t==="Block"){let o=un(e);for(let i=0;i<e.nops;i++)n[i]={inert:!1,opaque:!1,boundNames:o};return n}if(t==="Function"||t==="Loop"){let o=un(e);for(let i=0;i<e.nops;i++)n[i]=i===0?{inert:!1,opaque:!0,boundNames:o}:{inert:!0,opaque:!1,boundNames:o};return n}let r=e.operatorDefinition;if(r?.scoped===!0){let o=Number.POSITIVE_INFINITY;try{for(let s of r.bindingSites?.(e.ops,"post")??[])s.path.length>0&&(o=Math.min(o,s.path[0]))}catch{o=Number.POSITIVE_INFINITY}Number.isFinite(o)||(o=0);let i=un(e);for(let s=0;s<e.nops;s++)n[s]=s<o?{inert:!1,opaque:!0,boundNames:i}:{inert:!0,opaque:o===0,boundNames:i}}for(let o of Pr(e)){let i=n[o.index];n[o.index]={inert:o.inert||(i?.inert??!1),opaque:i?.opaque??!1,boundNames:i?.boundNames??[]}}return n}function Kl(e,n){if(!b(e))return[];if(e.operator==="When"&&e.nops===2&&n?.(e)!==!0){if(C(e.ops[1],"True"))return[e.ops[0]];if(C(e.ops[1],"False"))return[]}return e.ops}var qe={__proto__:null,Add:["+",11],Negate:["-",14],Subtract:["-",11],Multiply:["*",12],Divide:["/",13],Equal:["==",8],NotEqual:["!=",8],LessEqual:["<=",9],GreaterEqual:[">=",9],Less:["<",9],Greater:[">",9],And:["&&",4],Or:["||",3],Not:["!",14]};function re(e){return e?.language==="wgsl"?"vec2f":"vec2"}function He(e){return e?.language==="wgsl"?"vec3f":"vec3"}function Kt(e){let n=e.hoist?.unit;if(n!==void 0)return b(n,"Assign")?n.ops[1]:b(n,"Declare")?p.declareValueOperand(n.ops):n}var Zl=["sin","cos","sign"];function Le(e,n,t){return kt(e,n(e),t)}function kt(e,n,t){return b(e)?(t?.operators?.(e.operator)??qe[e.operator])===void 0?n:`(${n})`:n}function ce(e){return Ie(NaN,e?.language)}var tn=new WeakSet,Zt=new WeakSet;function Vr(e){return e?.language==="wgsl"?"atan2":"atan"}var fi={Less:"lessThan",LessEqual:"lessThanEqual",Greater:"greaterThan",GreaterEqual:"greaterThanEqual",Equal:"equal",NotEqual:"notEqual"},Xl={Less:"<",LessEqual:"<=",Greater:">",GreaterEqual:">=",Equal:"==",NotEqual:"!="};function qr(e,n){return n?.language==="wgsl"?`vec${e}<bool>`:`bvec${e}`}function rn(e,n){return n?.language==="wgsl"?`vec${e}f`:`vec${e}`}function te(e){return X(e.type.type)}var $n=/^(?:[iub]?vec[234]|mat[234]|array\s*<|(?:float|f32|int|i32|uint|u32|bool)\s*\[)/,Jl=/^(?:[iub]?vec[234]\s*\[|array\s*<\s*vec)/,Ql=/\b(?:[iub]?vec[234]|mat[234]|array\s*<|(?:float|f32|int|i32|uint|u32|bool)\s*\[)/;function Hr(e){let n=0;for(let t of e)if(t==="("||t==="[")n++;else if(t===")"||t==="]")n--;else if(t===" "&&n===0)return`(${e})`;return e}function we(e){let n=e.trim();return/^[A-Za-z_]\w*(?:\.\w+|\[\d+\])*$/.test(n)||/^[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?$/.test(n)}var eu={__proto__:null,True:"true",False:"false",Pi:"3.14159265359",ExponentialE:"2.71828182846",GoldenRatio:"1.61803398875",CatalanConstant:"0.91596559417",EulerGamma:"0.57721566490"};function he(e,n){return Y(e,n)}function En(e){return e?"f32":"float"}function ae(e,n){return n?`vec${e}f`:`vec${e}`}var nu=2**24,Yr=new WeakMap;function Wr(e,n){return Number.isInteger(e)&&Number.isInteger(n)&&e>=-nu&&n<=nu&&e<=n}function ci(e,n,t,r,o){if(!e.boundVars||!Wr(t,r))return;let i=Yr.get(e.boundVars);i||Yr.set(e.boundVars,i=new Map);let s=e.var(n);s!==void 0&&i.set(n,{min:t,max:r,code:o,reference:s})}function pi(e){e.boundVars&&Yr.delete(e.boundVars)}function di(e,n,t,r=0){if(r>32)return;if(D(e))return!e.isComplex&&Wr(e.re,e.re)?{min:e.re,max:e.re,code:String(e.re)}:void 0;if(C(e)){let l=n.boundVars?Yr.get(n.boundVars)?.get(e.symbol):void 0;return l&&l.reference===n.var(e.symbol)?l:void 0}if(!b(e)||Fn(e)||!t(e.operator)||!["Add","Subtract","Negate","Multiply"].includes(e.operator))return;let o=e.ops.map(l=>di(l,n,t,r+1));if(o.some(l=>l===void 0))return;let i=o;if(e.operator==="Negate"&&i.length===1){let l=i[0];return{min:-l.max,max:-l.min,code:`(-(${l.code}))`}}if(e.operator==="Subtract"&&i.length===2){let[l,u]=i,f=l.min-u.max,c=l.max-u.min;return Wr(f,c)?{min:f,max:c,code:`(${l.code} - ${u.code})`}:void 0}if(!["Add","Multiply"].includes(e.operator)||i.length===0)return;let s=e.operator==="Multiply",a=i[0];for(let l of i.slice(1)){let u=s?[a.min*l.min,a.min*l.max,a.max*l.min,a.max*l.max]:[a.min+l.min,a.max+l.max],f=Math.min(...u),c=Math.max(...u);if(!Wr(f,c))return;a={min:f,max:c,code:`(${a.code} ${s?"*":"+"} ${l.code})`}}return a}function mi(e){let n=new Set,t=r=>{if(!n.has(r)){if(n.add(r),C(r))return on(r.type.type)!==void 0&&p.localShapeFrameOf(r.symbol)===void 0?r:void 0;if(!(!b(r)||r.operator==="Function"))for(let o of r.ops){let i=t(o);if(i!==void 0)return i}}};return t(e)}function on(e){return p.pointOrPointListUnion(e)}function Bn(e){return e!==void 0&&e.width===1&&(e.element==="i"||e.element==="u")}function Un(e){let n=iu(e);if(/^(float|double|half|f16|f32|f64)$/.test(n))return{element:"f",width:1};if(/^(int|i32)$/.test(n))return{element:"i",width:1};if(/^(uint|u32)$/.test(n))return{element:"u",width:1};if(n==="bool")return{element:"b",width:1};let t=/^([ibu]?)vec([234])$/.exec(n);if(t)return{element:t[1]||"f",width:Number(t[2])};let r=/^vec([234])([fhiu])$/.exec(n);if(r)return{element:r[2]==="h"?"f":r[2],width:Number(r[1])};let o=/^vec([234])<\s*([a-z0-9]+)\s*>$/.exec(n);if(o){let i=Un(o[2]);return i===void 0||i.width!==1?void 0:{element:i.element,width:Number(o[1])}}}function Xt(e,n){return e.width===1?e.element==="b"?"bool":e.element==="i"?n?"i32":"int":e.element==="u"?n?"u32":"uint":En(n):e.element==="f"?ae(e.width,n):n?`vec${e.width}<${e.element==="b"?"bool":e.element==="i"?"i32":"u32"}>`:`${e.element}vec${e.width}`}var tu=new WeakMap;function hi(e){let n=new Map,t=new Map;for(let{name:r,type:o,ref:i}of e){let s=Un(o);t.set(r,{spelling:o.trim(),value:s,ref:i??r}),n.set(r,s===void 0?p.LOCAL_UNSHAPED:s.width>=2?s.width:s.element==="b"?p.LOCAL_BOOLEAN:p.LOCAL_SCALAR)}return tu.set(n,t),n}function Oe(e){if(!C(e))return;let n=p.localShapeFrameOf(e.symbol);if(n!==void 0)return tu.get(n)?.get(e.symbol)}function gi(e,n,t=new Set){if(!(!b(e)||t.has(e))){if(t.add(e),e.operator==="Assign"&&C(e.ops[0])&&n.has(e.ops[0].symbol))return e.ops[0].symbol;for(let r of e.ops){let o=gi(r,n,t);if(o!==void 0)return o}}}function _i(e,n){if(n.length===0)return e;let t=e.language==="wgsl",r=new Map(n.map(o=>{let i=o.ref??o.name;return[o.name,Bn(Un(o.type))?`${t?"f32":"float"}(${i})`:i]}));return{...e,var:o=>r.get(o)??e.var(o),...p.withBoundScope(e,[...r.keys()])}}function ru(e,n){let t=new RegExp(`(?<![\\w.])${n}(?!\\w)`);for(let r of e.split(`
`))if(t.test(r))return r.startsWith(`${n} = `)?!t.test(r.slice(n.length+3)):!1;return!1}function Cn(e){return yi(e,!1)===En(!1)}function Kr(e){if(typeof e=="string"||e.kind!=="list")return;let n=X(e.elements);if(typeof n=="string"||n.kind!=="tuple")return;let t=n.elements.length;if(t<2||t>4)return{decline:`the points of the base have ${t} coordinates, and a shader vector holds 2 to 4`};for(let r=0;r<t;r++)if(!Cn(n.elements[r].type))return{decline:`coordinate ${r+1} of the points of the base (type \`${Ce(n.elements[r].type)}\`) is not a REAL scalar \u2014 a shader vector's components are single floats`};return t}function bi(e){let n=/^vec([234])/.exec(e);return n===null?1:Number(n[1])}function Lt(e){if(e=X(e),typeof e!="string"){if(e.kind==="tuple")return e.elements.every(n=>Cn(n.type))?e.elements.length:void 0;if(e.kind==="list"&&e.dimensions?.length===1)return Cn(e.elements)?e.dimensions[0]:void 0}}function yi(e,n){if(e===void 0||e==="unknown"||e==="any")return En(n);if(e=X(e),q(e,"color"))return ae(3,n);if(Ve(e))return ae(2,n);if(q(e,"boolean"))return"bool";if(q(e,"number"))return En(n);let t=Lt(e);if(t!==void 0&&t>=2&&t<=4)return ae(t,n)}function pe(e,n){let t=Oe(e);if(t!==void 0)return Bn(t.value)?En(n):t.value&&Xt(t.value,n);if(C(e)&&p.isLocalBoolean(e.symbol))return"bool";if(mi(e)!==void 0)return;if((!C(e)||!p.localShapeFrameOf(e.symbol))&&(q(te(e),"color")||Nr(e)!==void 0))return ae(3,n);if(p.isComplexValued(e))return ae(2,n);let r=p.aggregateComponentCount(e);if(r!==void 0)return r<2||r>4?void 0:Up(e)?ae(r,n):void 0;if(!p.isNonScalarShape(e))return e.type.matches("boolean")?"bool":En(n)}function Up(e){if(b(e,"Tuple")||b(e,"List"))return e.ops.every(t=>Cn(te(t)));let n=te(e);return typeof n!="string"&&(n.kind==="tuple"||n.kind==="list")?Lt(n)!==void 0:!0}var Zr=new WeakMap,ou=["strict"];function iu(e){return e.trim().replace(/^((lowp|mediump|highp|flat|smooth|noperspective|centroid)\s+)+/,"")}function su(e){let n=iu(e);if(/^d?mat[234](x[234])?([fh]|<\s*\w+\s*>)?$/.test(n))return{kind:"matrix",spelling:n};if(/^array\s*<.*>$/.test(n)||/\[\s*\d*\s*\]$/.test(n))return{kind:"array",spelling:n}}var au=new Set(["Add","Subtract","Multiply","Divide","Negate","Power","Square","Sqrt","Root","Exp","Ln","Log","Abs","Sign","Floor","Ceil","Round","Truncate","Fract","Mod","Sin","Cos","Tan","Arcsin","Arccos","Arctan","Sinh","Cosh","Tanh"]),lu=new Set(["Less","LessEqual","Greater","GreaterEqual","Equal","NotEqual","And","Or","Not"]);function uu(e,n,t){let r=n.find(c=>c.name===e);if(r!==void 0)return{type:Un(r.type)};let o=/^(.+)\.([a-z]{1,4})$/.exec(e),i=o===null?void 0:n.find(c=>c.name===o[1]);if(o===null||i===void 0){let c=n.length===0?"This shader declares no outputs.":`The outputs are ${n.map(d=>`"${d.name}" (\`${d.type}\`)`).join(", ")}.`,m=n.find(d=>(Un(d.type)?.width??1)>=2);return{error:`"${e}" is not an output of the shader. A body statement must assign a declared output, or components of a vector output${m===void 0?"":` (\`${m.name}.x\`)`}. ${c}`}}let s=o[2],a=Un(i.type),l=c=>({error:`"${e}" selects the components "${s}" of the output "${i.name}" (\`${i.type}\`), but ${c}.`});if(a===void 0||a.width<2)return l("the output is not a vector");let u=t?["xyzw","rgba"]:["xyzw","rgba","stpq"],f=u.find(c=>[...s].every(m=>c.includes(m)));return f===void 0?l(`these letters are not all from one of the sets ${u.map(c=>`"${c}"`).join(", ")}`):[...s].some(c=>f.indexOf(c)>=a.width)?l(`the vector has only ${a.width} components`):new Set(s).size!==s.length?l("an assignment cannot write a component more than once"):{type:{element:a.element,width:s.length},base:i.name,letters:s}}function vi(e,n,t){return e.width!==n.width?!1:e.element===n.element?!0:t===void 0?!1:n.element==="f"?e.element==="i"||e.element==="u":t>=400&&e.element==="i"&&n.element==="u"}function $i(e,n,t){let r=bl(e,n);return`${re(t)}(${Y(r.re,t?.language)}, ${Y(r.im,t?.language)})`}function Ei(e,n,t){if(b(e)&&["Rgb","Hsv","Hsl","Tuple"].includes(e.operator)&&!Fn(e,t.cse?.harvestOptions)&&!t.foldExcludedOps?.has(e.operator)){let r="_gpu_srgb_to_oklch(";if(n.startsWith(r)&&n.endsWith(")"))return`_gpu_srgb_roundtrip(${n.slice(r.length,-1)})`}return`_gpu_oklch_to_srgb(${n})`}function $e(e,n){let t=n[0]?.engine;if(t===void 0)return!1;try{let r=t.function(e,[...n],{form:"structural"}).type;return Ve(Fo(r.type))}catch{return!1}}function Xr(e,n){if(fl(e,n)==="complex")throw new Error(`Could not compile \`${e}\`: its value is not real for these operands, and the shader targets have no complex lane for it`)}function be(e,n,t){return p.isComplexValued(e)?n(e):(On(void 0,e),`${re(t)}(${n(e)}, 0.0)`)}function wi(e){return e=X(e),Ve(Fo(e))?!1:Se(e,"number")}function Jt(e){let n=X(e);if(n==="tuple")return"this type does not give the number or the types of the elements";if(typeof n=="string"||n.kind!=="tuple")return;let t=n.elements.length;if(t<2)return`a tuple of ${t} element${t===1?"":"s"} has no shader type (there is no \`vec1\`)`;if(!(t<=4&&n.elements.every(r=>q(r.type,"boolean")))){for(let r=0;r<t;r++)if(!wi(n.elements[r].type))return`element ${r+1} of the tuple (type \`${Ce(n.elements[r].type)}\`) is not a real scalar \u2014 a shader vector or array of floats holds only real scalars`}}function Bp(e){if(b(e,"List")||b(e,"Tuple"))return e.ops.every(t=>!p.isNonScalarShape(t));if(p.isComplexValued(e))return!0;if(C(e)&&p.localShapeFrameOf(e.symbol)!==void 0){let t=Oe(e);return t?.value===void 0||t.value.element==="f"}let n=p.withoutAbsentArms(te(e));return typeof n=="string"?!0:n.kind==="tuple"?n.elements.every(t=>wi(t.type)):n.kind==="list"&&n.dimensions?.length===1?wi(n.elements):!1}function Ue(e){let n=p.vectorComponentCount(e);if(n!==void 0)return Bp(e)?n:void 0}function Tt(e){if(e.length===0)return;let n;for(let t of e){if(!p.isNonScalarShape(t))return;let r=p.aggregateComponentCount(t);if(r===void 0||r<2||r>4||n!==void 0&&r!==n)return;n=r}return n}function sn(e,n){if(e.length===0)throw new Error(`Could not compile \`${n}\`: an empty tuple/list has no GPU lowering \u2014 neither GLSL nor WGSL has a zero-length array type.`);for(let[t,r]of e.entries()){if(!p.isNonScalarShape(r))continue;let o=p.aggregateComponentCount(r),i=o===void 0?"a matrix/tensor value":`${o} component${o===1?"":"s"} \u2014 a complex value or a nested tuple/list`;throw new Error(`Could not compile \`${n}\`: element ${t+1} (\`${r.toString()}\`) is itself vector-valued (${i}) and has no GPU lowering; a ${n} constructor takes scalar components.`)}}function et(e,n){let t=Ue(e);return t===void 0?ce(n):`${n?.language==="wgsl"?`vec${t}f`:`vec${t}`}(${ce(n)})`}function Ci(e,n){let t=/_gpu_[A-Za-z0-9_]+\s*\(/.exec(e);if(t!==null)return`it calls the preamble helper \`${t[0].slice(0,-1).trim()}\`, which is declared with scalar float/f32 parameters.`;if(n!==void 0){if(/\?|[<>]=?|[=!]=/.test(e))return"it branches on a comparison, which a shader requires to be a scalar bool.";if(!e.includes(n))return"it does not use the operand at all, so its result is a scalar."}}function Jr(e,n){if(e===null)return;let t=p.piMultiple(e);return t!==void 0&&V(t)==="scalar"?an(t,n,!1):void 0}function nt(e,n){if(e===null)return;let t=p.imaginaryPiMultiple(e);return t!==void 0&&V(t)==="scalar"?an(t,n,!1):void 0}function an(e,n,t,r){if(p.isComplexValued(e)||V(e)!=="scalar")return e;if(b(e,"Multiply")&&e.nops===2){let[o,i]=D(e.ops[0])?[e.ops[0],e.ops[1]]:[e.ops[1],e.ops[0]];if(!D(o)||!b(i,"Add"))return e;let s=fu(i,n,t,o,r);return s===i?e:e.engine.function("Multiply",[o,s])}return b(e,"Add")?fu(e,n,t,void 0,r):e}function jp(e,n){if(!b(e)||n.constantFold===!1||e.isPure!==!0||e.unknowns.length>0)return;let t=e.engine;if(!e.symbols.every(a=>t.symbol(a).isConstant)||p.reachesExcludedName(e,n))return;let r=a=>D(a)&&!a.isComplex&&a.isFinite===!0,o=e.evaluate();if(r(o)&&D(o)&&o.isExact)return o;let i=e.N();if(!r(i))return;let s=Math.max(1,Math.ceil(Math.log10(Math.abs(i.re)+1)));return t.precision>=s+12?i:void 0}function fu(e,n,t,r,o){if(!b(e,"Add"))return e;let i=[],s=[],a=[];for(let f of e.ops){let c=Ct(f);if(c!==void 0){i.push(c);continue}if(t){let d=p.piMultiple(f),g=d===void 0?void 0:Ct(d);if(g!==void 0){s.push(g);continue}}let m=o===void 0?void 0:jp(f,o);if(m!==void 0){i.push(m);continue}a.push(f)}if(i.length+s.length===0)return e;let l=si(i,s,f=>{let c=t?fe.PI.mul(n):new fe(n);if(r!==void 0){let m=Yt(r);if(m===void 0||m.isZero())return;c=c.div(m.abs())}if(!(f.abs().cmp(c.div(2))<=0))return f.sub(f.div(c).round().mul(c)).toNumber()});if(l===void 0)return e;let u=e.engine;return l===0?a.length===0?u.Zero:a.length===1?a[0]:u.function("Add",a):u.function("Add",[...a,u.number(l)])}function V(e){if(p.isComplexValued(e)||!p.isNonScalarShape(e)&&!Dp(e))return"scalar";let n=Ue(e);if(n!==void 0)return n;if((b(e,"List")||b(e,"Tuple"))&&Tt(e.ops)!==void 0)return"array";if(b(e,"Matrix"))return"matrix";let t=te(e);return typeof t!="string"&&t.kind==="list"&&(t.dimensions?.length??0)>=2?"matrix":"array"}function Dp(e){let n=te(e);return q(n,vn)&&!q(n,"string")}function We(e){return typeof e=="number"?`vec${e}`:e}function Si(e,n){if(e==null||n===null||n===void 0)return;let t=V(e),r=V(n);if(typeof t=="number")return r==="scalar"||r===t?t:void 0;if(typeof r=="number")return t==="scalar"?r:void 0}function zi(e,n,t,r){return n===void 0||V(e)!=="scalar"?t(e):`${rn(n,r)}(${t(e)})`}function Pi(e){if(b(e,"Matrix")){let t=e.ops[0];if(!b(t)||t.nops===0)return;let r=t.ops,o=b(r[0])?r[0].nops:0;return o>0&&r.every(i=>b(i)&&i.nops===o)?[r.length,o]:void 0}let n=te(e);if(typeof n!="string"&&n.kind==="list"){let t=n.dimensions;if(t?.length===2&&t[0]>0&&t[1]>0)return[t[0],t[1]]}}var xi=/(?:array|[iub]?vec[234]|mat[234]x[234]|atomic|ptr)\s*</y;function Ae(e){let n=e.trim(),t=/^([A-Za-z_]\w*(?:\s*<[^<>()]*>)?(?:\s*\[\d+\])?)\s*\(/.exec(n);if(t===null)return;let r=0,o=t[0].length,i=[];for(let s=t[0].length-1;s<n.length;s++){if((s===0||!/[\w$]/.test(n[s-1]))&&(xi.lastIndex=s,xi.test(n))){let a=1,l=xi.lastIndex;for(;l<n.length&&a>0;l++)n[l]==="<"?a++:n[l]===">"&&a--;if(a>0)return;s=l-1;continue}if(n[s]==="(")++r===1&&(o=s+1);else if(n[s]===","&&r===1)i.push(n.slice(o,s).trim()),o=s+1;else if(n[s]===")"&&--r===0){if(s!==n.length-1)return;let a=n.slice(o,s).trim();return(a!==""||i.length>0)&&i.push(a),{callee:t[1].trim(),argCount:i.length,operands:i}}}}function Vp(e,n){let t=new RegExp(`(?:^|\\n)[^\\S\\n]*(?:fn[^\\S\\n]+|[A-Za-z_]\\w*(?:\\[\\d+\\])?[^\\S\\n]+)${e}[^\\S\\n]*\\(([^)]*)\\)`).exec(n);return t===null?!1:!/[iub]?vec[234]|mat[234]|array\s*<|\[\s*\d+\s*\]/.test(t[1])}var qp=["dot","length","distance","determinant","any","all"];function Hp(e){let n=new RegExp(`\\b(?:${qp.join("|")})\\s*\\(`,"g"),t="",r=0,o;for(;(o=n.exec(e))!==null;){let i=0,s=-1;for(let a=o.index+o[0].length-1;a<e.length;a++)if(e[a]==="(")i++;else if(e[a]===")"&&--i===0){s=a;break}if(s<0)break;t+=e.slice(r,o.index)+"0.0",r=s+1,n.lastIndex=r}return t+e.slice(r)}function cu(e){let n=/\b([iub]?vec[234][fhiu]?)\s*\(/g,t;for(;(t=n.exec(e))!==null;){let r=0;for(let o=t.index+t[0].length-1;o<e.length;o++)if(e[o]==="(")r++;else if(e[o]===")"&&--r===0){let i=Hp(e.slice(t.index+t[0].length,o)),s=/\b(?:[iub]?vec[234]|mat[234]|array\s*<|(?:float|f32)\s*\[)/.exec(i);if(s!==null)return`it packs its operands into a \`${t[1]}\` constructor, which has no room for the aggregate \`${s[0].trim()}\` value standing in each slot.`;break}}}function pu(e){return e?.gpuShapeRules}var du=new WeakMap;function mu(e){let n=e[0];return e.length===1&&n!==void 0&&(b(n,"Tuple")||b(n,"PointList"))&&Vt(n)}function ge(e,n=()=>!0){return typeof e=="function"&&du.set(e,n),e}var hu=new WeakMap;function pn(e,n){return typeof e=="function"&&hu.set(e,n),e}function tt(e,n,t){return(r,o)=>{let i=r[n];if(r.length!==2||i===null||i===void 0||ne(i)!==t)return;let s=Ae(o);if(!(s?.callee!==e||s.argCount!==1))return new Set([n])}}var ki=e=>e.length===1&&b(e[0],"List"),Li=e=>e.length===1;function Rt(e){let n=[...e].sort((t,r)=>t-r).map(t=>`${t+1}`);return n.length===0?"nowhere":n.length===1?`in argument ${n[0]}`:`in arguments ${n.slice(0,-1).join(", ")} and ${n[n.length-1]}`}function gu(e,n){let t=Ae(e);return t===void 0?!1:$n.test(t.callee)?!Jl.test(t.callee):n.has(t.callee)?t.operands.some(r=>gu(r,n)):!1}function Wp(e){if(e===void 0)return;let n=Ae(e);if(n===void 0)return;let t=/^vec([234])f?$/.exec(n.callee);return t===null?void 0:Number(t[1])}function _u(e,n){let t=Ae(e);if(t===void 0)return;let r=n.get(t.callee);if(r!==void 0){let o=t.operands.map(i=>gu(i,n));if(o.some(i=>i)){let i=o.findIndex((s,a)=>!s&&!r.has(a));if(i>=0)return`the shader builtin \`${t.callee}\` takes a scalar only ${Rt(r)}, but the emitted call \`${e.trim()}\` has a scalar in argument ${i+1}, where the overload requires the \`vecN\` genType; the scalar is not promoted to a vector.`}}for(let o of t.operands){let i=_u(o,n);if(i!==void 0)return i}}var Yp=new Set(["Variance","Hypot","Arctan2","Haversine","GammaLn","Beta","Erf","Erfc","ErfInv","Heaviside","Sinc","FresnelC","FresnelS","BesselJ","Arccot","Arcsch","InverseHaversine","Gamma","Factorial","Digamma","Trigamma","PolyGamma","Zeta","HurwitzZeta","LerchPhi","PolyLog","Sign","Smoothstep"]);function bu(e,n){return p.REAL_ONLY_BY_DEFINITION.has(e)||Yp.has(e)||p.stringHelperIsRealOnly(e,n)}function Ai(e,n,t,r,o,i){let s=n.map(V);if(typeof i=="function"){if(du.get(i)?.(n)===!0)return;let N=hu.get(i)?.(n,t);if(N!==void 0&&N.size>0)return Ai(e,n.filter((I,O)=>!N.has(O)),t,r,o)}let a=$=>{throw new Error(`Could not compile \`${e}\`: ${$}`)},l=Ae(t),u=()=>{if(l===void 0||l.argCount!==n.length)return;let $=r.vectorOnlySlots.get(l.callee);if($===void 0)return;let N=s.findIndex((I,O)=>$.has(O)&&I==="scalar");N>=0&&a(`the shader builtin \`${l.callee}\` is declared over the \`vecN\` genType ${Rt($)} in this language \u2014 it has no scalar overload there \u2014 but argument ${N+1} lowers to a scalar; the scalar is not promoted to a vector.`)};if(s.every($=>$==="scalar")){u();return}let f=new Set(s.filter($=>typeof $=="number")),c=()=>{f.size>1&&a(`its operands lower to shader vectors of different widths (${[...f].map($=>`vec${$}`).join(", ")}); the componentwise builtins and operators require ONE genType.`)},m=s.includes("matrix"),d=s.includes("array"),g=l;if(g===void 0){let $=qe[e]?.[0];if($===void 0||!/^[-+*/]$/.test($)){if(we(t))return;(d||m)&&a(`the compound shader lowering \`${t}\` is built from the genType-polymorphic builtins and operators, which have no ${m?"`matN`":"array"} reading, so the operand shapes (${s.map(We).join(", ")}) have no lowering.`),c();let w=cu(t);w!==void 0&&a(`the shader lowering \`${t}\` cannot take the non-scalar operand shapes (${s.map(We).join(", ")}) \u2014 ${w}`);return}if(d&&a("an operand lowers to a shader ARRAY (`float[N]` / `array<f32, N>`), which has no arithmetic operators \u2014 only scalars, `vecN` and `matN` values do."),!m){c();return}let N=[];for(let w=0;w<s.length;w++){let z=s[w];if(z!=="matrix"){N.push(z);continue}let G=Pi(n[w]);if(G!==void 0&&G[1]===1&&G[0]>=2&&G[0]<=4&&b(n[w],"Matrix")){N.push(G[0]);continue}(G===void 0||G[0]!==G[1]||G[0]<2||G[0]>4)&&a(`its operand \`${n[w].toString()}\` lowers to a matrix with no native square \`matN\` (N = 2\u20134) shader type`+(G!==void 0?` (its dimensions are ${G[0]}\xD7${G[1]})`:" (its dimensions are not statically known)")+`, so the shader operator \`${$}\` has no overload for it.`),N.push({mat:G[0]})}let I=w=>typeof w=="number"?`vec${w}`:w==="scalar"?w:`mat${w.mat}`,O=`(${N.map(I).join(", ")})`,F=new Set(N.flatMap(w=>w==="scalar"?[]:[typeof w=="number"?w:w.mat]));if(!N.some(w=>typeof w=="object")){F.size>1&&a(`its operands lower to shader vectors of different widths ${O}; the componentwise operators require ONE genType.`);return}if(n.length===1){r.matrixNegate||a(`the shader unary \`-\` is declared over scalars and \`vecN\` only in this language; it has no overload for the ${I(N[0])} operand.`);return}if($!=="*"){N.some(w=>typeof w=="number")&&a(`a \`matN\` and a \`vecN\` operand combine only under \`*\` (matrix-vector product), not \`${$}\`.`),r.matrixArithmetic($,N.every(w=>typeof w=="object"))||a(`the shader operator \`${$}\` has no overload for the operand shapes ${O}.`),F.size>1&&a(`the componentwise \`${$}\` requires matrices of the SAME dimensions, but the operand shapes are ${O}.`);return}F.size>1&&a(`under \`*\` the matrix and vector dimensions must agree (\`matCxR * vecC\`, \`matKxR * matCxK\`), but the operand shapes ${O} do not.`);return}let{callee:_,argCount:x}=g;if($n.test(_))return;if(_.startsWith("_gpu_")){if(x!==n.length||!Vp(_,o(`${_}(`)))return;let $=Ci(t);$!==void 0&&a(`the shader lowering \`${t}\` cannot take the non-scalar operand shapes (${s.map(We).join(", ")}) \u2014 ${$}`);return}(m||d)&&a(`the shader builtin \`${_}\` is declared over scalar and \`vecN\` genTypes; it has no ${m?"`matN`":"array"} overload, so the operand shapes (${s.map(We).join(", ")}) have no lowering.`),c();let v=cu(t);v!==void 0&&a(`the shader lowering \`${t}\` cannot take the non-scalar operand shapes (${s.map(We).join(", ")}) \u2014 ${v}`);let E=s.map(($,N)=>$!=="scalar"||x!==n.length?$:Wp(g.operands[N])??$);if(f.size===1&&E.includes("scalar")){let $=r.scalarGenTypeSlots.get(_);if($===void 0&&a(`the shader builtin \`${_}\` requires MATCHING genType arguments, but it is applied to a vec${[...f][0]} operand and a scalar one; the scalar is not promoted to a vector.`),x===n.length){let I=E.findIndex((O,F)=>O==="scalar"&&!$.has(F));I>=0&&a(`the shader builtin \`${_}\` takes a scalar only ${Rt($)}, but here the scalar stands in argument ${I+1}, where the overload requires the vec${[...f][0]} genType; the scalar is not promoted to a vector.`)}let N=_u(t,r.scalarGenTypeSlots);N!==void 0&&a(N)}let S=r.mandatoryScalarSlots.get(_);if(S!==void 0&&x===n.length){let $=s.findIndex((N,I)=>S.has(I)&&N!=="scalar");$>=0&&a(`the shader builtin \`${_}\` requires a SCALAR ${Rt(S)} \u2014 that argument is not genType-polymorphic, so there is no overload with a ${We(s[$])} standing there \u2014 but argument ${$+1} lowers to a ${We(s[$])}.`)}u()}function yu(e){let n=new Set,t=r=>{if(C(r)&&n.has(r.symbol))return ae(3,e);let o=V(r);if(o==="matrix"){let i=Pi(r);if(i===void 0)return;let[s,a]=i;return e?`mat${a}x${s}f`:s===a?`mat${a}`:`mat${a}x${s}`}if(o==="array"){let i=te(r);if(typeof i!="string"&&i.kind==="tuple"&&i.elements.length>4&&Jt(i)===void 0){let l=i.elements.length;return e?`array<f32, ${l}>`:`float[${l}]`}if(typeof i=="string"||i.kind!=="list")return;let s=i.dimensions?.length===1?i.dimensions[0]:void 0;if(s===void 0||!(s>0))return;let a=Kr(i);return typeof a=="number"?e?`array<vec${a}f, ${s}>`:`vec${a}[${s}]`:e?`array<f32, ${s}>`:`float[${s}]`}return pe(r,e)};return Zr.set(t,n),t}function At(e,n){if(p.isComplexValued(e))return;let t=o=>{let i=At(o,n);return i!==void 0&&"element"in i&&i.element==="f"&&i.width===1};if(D(e))return{element:"f",width:1};if(C(e)){let o=Oe(e);return o!==void 0?Bn(o.value)?{element:"f",width:1}:o.value??su(o.spelling):e.symbol==="True"||e.symbol==="False"?{element:"b",width:1}:e.isConstant===!0&&e.type.matches("real")?{element:"f",width:1}:void 0}if(!b(e))return;let r=e.operator;if(r==="Matrix"){let o=Pi(e);if(o===void 0)return;let[i,s]=o;if(s===1){let a=e.ops[0];return(b(a)?a.ops.map(u=>b(u)?u.ops[0]:u):[]).every(t)?i>=2&&i<=4?{element:"f",width:i}:{kind:"array",spelling:n?`array<f32, ${i}>`:`float[${i}]`}:void 0}return i!==s||i>4?s>=2&&s<=4?{kind:"array",spelling:n?`array<vec${s}f, ${i}>`:`vec${s}[${i}]`}:void 0:{kind:"matrix",spelling:n?`mat${s}x${i}f`:`mat${s}`}}if(r==="Tuple"||r==="List"){if(!e.ops.every(t))return;let o=e.nops;return o>=2&&o<=4?{element:"f",width:o}:{kind:"array",spelling:n?`array<f32, ${o}>`:`float[${o}]`}}if(au.has(r))return e.nops>0&&e.ops.every(t)?{element:"f",width:1}:void 0;if(lu.has(r))return e.nops>0&&e.ops.every(o=>{let i=At(o,n);return i!==void 0&&"element"in i&&i.width===1})?{element:"b",width:1}:void 0;if(r==="If"&&e.nops===3){let o=At(e.ops[1],n),i=At(e.ops[2],n);if(o!==void 0&&i!==void 0&&"element"in o&&"element"in i&&o.element===i.element&&o.width===i.width)return o}}function ye(e,n,t){return Gr(e,n,t)}function dn(e,n,t){if(n.some(r=>!xt(r,t)&&ye(r,t)))throw new Error(`Could not compile \`${e}\`: an operand contains code supplied by the caller (a \`vars\` source, a \`functions\` or \`operators\` entry, or a \`compile\` handler), and this shader form writes the operand more than once, so that code would run more than once.`)}function ve(e,n,t,r=!1){if(!eo(n,t,r))throw new Error(`Could not compile \`${e}\`: its code would be computed in a statement ahead of the rest of its statement, and code supplied by the caller (a \`vars\` source, a \`functions\` or \`operators\` entry, or a \`compile\` handler) would then run out of the order of the interpreter.`)}var Qr=new Map;function vu(e,n){let t=Qr.get(e);t===void 0&&(t=[],Qr.set(e,t)),t.push(p.compileParents().length);try{return n()}finally{t.pop(),t.length===0&&Qr.delete(e)}}function Kp(e){let n=e.hoist===void 0?void 0:Qr.get(e.hoist),t=n?.[n.length-1];if(t!==void 0){let r=p.compileParents()[t];if(r!==void 0)return r}return Kt(e)}function eo(e,n,t=!1){let r=Kp(n);if(e===void 0)return r===void 0||!ye(r,n);let o=!t&&e.some(u=>ye(u,n)),i=e.some(u=>p.foldValueImpure(u));if(!o&&!i)return!0;if(r===void 0)return!o;let s=new Set(e);if(ye(r,n,u=>s.has(u)||xt(u,n)))return!1;if(!o)return!0;let a=u=>{let f=new Map,c=new Set,m=new Set,d=!1,g=(v,E,S)=>{if(S===null||v.has(E))return d=!0,0;if(S===void 0)return 0;v.add(E);let $=_(S);return v.delete(E),$},_=v=>{let E=f.get(v);if(E!==void 0)return E;let S=v===u?1:0;if(C(v)){let $=v.symbol,N=jt($,n);N!==void 0?S+=g(m,$,N):il($,n)||(S+=g(c,$,v.engine._getSymbolValue($)))}else if(Io(v))for(let $ of v.values)S+=_($);else if(b(v)){for(let I of v.ops)S+=_(I);let $=v.operator,N=jt($,n);if(N!==void 0)S+=g(m,$,N);else{let I=Zo(v.engine,$);if(I!==void 0)S+=g(m,$,I);else{let O=Yo(v.engine.lookupDefinition($))?.clauses;if(O!==void 0&&O.length>0)if(m.has($))d=!0;else{m.add($);for(let F of O)S+=_(F.literal);m.delete($)}}}}return f.set(v,S),S},x=_(r);return d?void 0:x};if(e.some(u=>ye(u,n)&&a(u)!==1)||Zp(r,s,n))return!1;let l=new Map;for(let u of e)l.set(u,0);return jn(r,l)===0}function Zp(e,n,t){let r=new Set,o=new Set,i=!1,s=(l,u,f)=>{if(l.has(u))return!1;l.add(u);let c=a(f);return l.delete(u),c},a=l=>{if(i)return!1;if(n.has(l))return i=!0,!1;if(C(l)){let m=l.symbol,d=jt(m,t);if(d===null)return!0;if(d!==void 0)return s(o,m,d);if(t.varsKeys?.has(m)===!0)return!0;if(t.boundVars?.has(m)===!0)return!1;let g=l.engine._getSymbolValue(m);return g!==void 0&&s(r,m,g)}if(Io(l)){for(let m of l.values)if(a(m))return!0;return!1}if(!b(l))return!1;for(let m of l.ops)if(a(m))return!0;if(i)return!1;let u=l.operator,f=jt(u,t);if(f===null)return!0;if(f!==void 0)return s(o,u,f);let c=Zo(l.engine,u);if(c!==void 0)return s(o,u,c);for(let m of Yo(l.engine.lookupDefinition(u))?.clauses??[])if(s(o,u,m.literal))return!0;return!1};return a(e)}function de(e,n,t,r,o=!1){if(dn(e,[n],r),!p.foldValueImpure(n))return t(n);if(!p.canHoist(r)||!o&&V(n)!=="scalar")throw new Error(`Could not compile \`${e}\`: an impure (Random) operand cannot be bound to a temporary at this position \u2014 a repeated draw would shift every later value in the shader.`);Ye(e,[n],r),ve(e,[n],r);let i=p.tempVar(r),s=o?re(r):r.language==="wgsl"?"f32":"float",a=r.language==="wgsl"?`var ${i}: ${s}`:`${s} ${i}`;return p.hoistStatement(r,`${a} = ${t(n)};`),Be([n],r),i}var Sn;function xu(e,n){let t=0;for(;t<e.length&&t<n.length&&e[t]===n[t];)t+=1;if(t===n.length)return!0;if(t===e.length||t===0)return!1;let r=e[t-1];if(!b(r))return!1;let o=(l,u)=>l===u||C(l)&&l.engine._getSymbolValue(l.symbol)===u,i=r.ops,s=i.findIndex(l=>o(l,e[t])),a=-1;for(let l=i.length-1;l>=0&&a<0;l--)o(i[l],n[t])&&(a=l);return s>=0&&a>=0&&s<a}var wu=Symbol("gpuDrawOrder");function Qt(e){let n=new Error(e);return n[wu]=!0,n}function Xp(e){let n=new Set,t=r=>{if(n.has(r))return!1;if(n.add(r),C(r)){if(!p.foldValueImpure(r))return!1;let o=r.engine._getSymbolValue(r.symbol);return o!==void 0&&t(o)}if(!b(r))return!1;if(Ti(r)){let o=r.engine.lookupDefinition(r.operator);if(!mt(o)||o.operator.isUserFunctionDefinition||o.operator.drawsRandom!==!0)return!0}return r.ops.some(t)};return t(e)}function er(e){return Sn!==void 0&&p.foldValueImpure(e)}function $u(e,n,t){if(Sn!==void 0||!(e instanceof Error)||e[wu]!==!0||t===void 0||Xp(t))return;let r={inline:!1,reordered:!1};Sn=r;let o;try{o=n()}finally{Sn=void 0}if(r.reordered)throw e;return o}var Ri=new WeakMap;function Ye(e,n,t){if(Sn!==void 0)return;let r=()=>{throw Qt(`Could not compile \`${e}\`: an operand that draws a random value would be bound to a temporary ahead of the rest of its statement, and a draw written before it would then come after it.`)},o=t.hoist,i=Kt(t),s=o===void 0?void 0:Ri.get(o),a=n.find(x=>p.foldValueImpure(x))??n[0],l=1,u=2,f=new Map,c=x=>{let v=f.get(x);if(v!==void 0)return v;let E=0;if(x===a)E=l;else if(s?.has(x))E=0;else if(C(x))E=p.foldValueImpure(x)?u:0;else if(b(x)){for(let S of x.ops)if(E=c(S),E!==0)break;E===0&&Ti(x)&&(E=u)}return f.set(x,E),E},m=()=>{if(i===void 0)return!1;let x=new Map,v=n.reduce((E,S)=>E+jn(S,x),0);return jn(i,x)===v},d=(x,v)=>{let E=v.get(x);if(E!==void 0)return E;let S=x===a?1:0;if(b(x))for(let $ of x.ops)S+=d($,v);return v.set(x,S),S},g=i===void 0?0:c(i);g===u&&r();let _=i!==void 0&&d(i,new Map)>1;(g===0||_)&&!m()&&r()}function Be(e,n){let t=n.hoist;if(t===void 0)return;let r=Ri.get(t)??new Set;for(let o of e)r.add(o);Ri.set(t,r)}function Ti(e){if(!b(e)||e.operator==="WithRandomSeed"||!p.foldValueImpure(e))return!1;if(!e.ops.some(t=>p.foldValueImpure(t)))return!0;let n=e.engine.lookupDefinition(e.operator);return mt(n)?n.operator.drawsRandom||n.operator.isUserFunctionDefinition:Fe(n)}function jn(e,n=new Map){let t=n.get(e);if(t!==void 0)return t;let r=0;if(C(e))r=p.foldValueImpure(e)?1:0;else if(b(e)){for(let o of e.ops)r+=jn(o,n);Ti(e)&&(r+=1)}return n.set(e,r),r}var Ke=34028234663852886e22;function Eu(e){let n=V(e);return n==="scalar"?e.type.matches("finite_real"):typeof n!="number"?!1:e.type.matches("list<finite_real>")||e.type.matches(`tuple<${Array(n).fill("finite_real").join(", ")}>`)}var Jp=new Set(["Sin","Cos","Tanh","Arctan","Abs","Floor","Ceil","Round","Truncate","Fract","Sign","Clamp","Min","Max","ElementMin","ElementMax","Smoothstep","Random"]);function ln(e,n,t=!1){let r=!1;if(!Eu(e)){if(V(e)!=="scalar")return!1;r=!0}return Cu(()=>{try{return Ni(n,r)?.finite(e,t)===!0}catch(o){if(o instanceof Error&&o.name==="CancellationError")throw o;return!1}})}function Cu(e){let n=zn.left;zn.left=ed;try{return e()}finally{zn.left=n}}function Ni(e,n){let t=e.cse?.harvestOptions;if(t===void 0)return;let r=e.gpuParameterFacts,o=e.userFunctions===void 0?void 0:zu.get(e.userFunctions),i=h=>o==="all"||o?.has(h)===!0,s=new Map,a=new Map,l=h=>b(h)?p.foldedRealNumber(h,e):void 0,u=new Set,f=h=>e.varsKeys?.has(h)===!0||t.isVarsKey?.(h)===!0,c=h=>{let L=h.engine._getSymbolValue(h.symbol);if(L!==void 0&&!(f(h.symbol)||e.boundVars?.has(h.symbol)===!0)&&e.var(h.symbol)===void 0)return p.foldedValueInRadians(L,e)},m=(h,L=!1)=>{let y=L?a:s,k=y.get(h);if(k!==void 0)return k;let A=b(h)&&(h.operator==="Add"||h.operator==="Subtract"||h.operator==="Negate"),R=!1;if(D(h))R=h.type.matches("finite_real")&&h.im===0&&Math.abs(h.re)<=Ke;else if(C(h)&&r?.get(h.symbol)?.finite===!0)R=!0;else if(C(h)&&i(h.symbol))R=!1;else if(C(h)){let T=c(h),U=T??h.engine._getSymbolValue(h.symbol),M=f(h.symbol),j=M&&h.valueDefinition?.isConstant!==!0&&(e.var(h.symbol)===h.symbol||e.hostInputVars?.has(h.symbol)===!0);R=(T!==void 0||h.valueDefinition?.inferredType!==!0)&&(!n||T!==void 0||Eu(h))&&(!M||j)&&(U===void 0||!u.has(h.symbol)&&(u.add(h.symbol),m(U))),u.delete(h.symbol)}else if(b(h)&&t.isOverriddenOperator?.(h.operator)!==!0&&h.ops.every((T,U)=>m(T,L&&A||h.operator==="Divide"&&U===1))){let T=l(h);if(T!==void 0&&Number.isFinite(T)&&Math.abs(T)<=Ke)return y.set(h,!0),!0;if(h.operator==="Multiply")R=g(h.ops);else if(h.operator==="Power")R=L&&E(h)||S(h)!==void 0;else if(A){let U=[],M=j=>{b(j)&&(j.operator==="Add"||j.operator==="Subtract"||j.operator==="Negate")?j.ops.forEach(M):U.push(j)};M(h),R=_(U)}else if(h.operator==="List"||h.operator==="Tuple")R=!0;else if(h.operator==="Divide")R=x(h);else if(h.operator==="Mod")R=v(h);else if(h.operator==="Abs"&&h.nops===1&&(ti(h.op1)||cl(h.op1)||p.isComplexValued(h.op1))){let U=V(h.op1),M=typeof U=="number"&&ti(h.op1)&&!p.isComplexValued(h.op1)?d(h.op1):void 0;R=typeof U=="number"&&M!==void 0&&U*M*M*(1+2**-10)<=Ke/2}else(r!==void 0||n)&&h.operator==="Smoothstep"&&!h.type.matches("finite_real")?R=D(h.op1)&&D(h.op2)&&!h.op1.isSame(h.op2):Jp.has(h.operator)?R=!0:R=G(h)?.finite===!0}return y.set(h,R),R},d=(h,L=0)=>{if(D(h))return h.im===0&&Number.isFinite(h.re)?Math.abs(h.re):void 0;if(b(h)&&(h.operator==="List"||h.operator==="Tuple")){let T=0;for(let U of h.ops){let M=d(U,L+1);if(M===void 0)return;T=Math.max(T,M)}return T}if(C(h)){let T=r?.get(h.symbol);if(T?.finite===!0)return T.magnitude;if(i(h.symbol))return;let U=c(h);if(U!==void 0)return L<8?d(U,L+1):void 0}else{if(b(h)&&(h.operator==="Sin"||h.operator==="Cos"||h.operator==="Tanh")&&(h.type.matches("real")||n&&m(h.op1)))return 1;if(b(h)&&h.operator==="Arctan"&&h.nops===1&&(h.type.matches("real")||n&&m(h.op1)))return Math.PI/2;if(b(h)&&h.operator==="Random"&&h.nops===0)return 1;if(b(h)&&h.operator==="Power"&&D(h.op2)){let T=$(h.op1);if(T!==void 0&&E(h))return Math.max(1,T)**h.op2.re*(1+2**-10);let U=S(h);if(U!==void 0)return U}else if(b(h)&&h.operator==="Divide"&&h.nops===2&&!D(h.op2)&&m(h)){let T=d(h.op1,L+1),U=w(h.op2);if(T!==void 0&&U!==void 0&&x(h))return T/U*(1+2**-20)}else if(b(h)&&h.operator==="Multiply"){let T=1;for(let U of h.ops){let M=d(U,L+1);if(M===void 0){T=NaN;break}T*=M}if(Number.isFinite(T))return T}else if(b(h)&&h.nops===1&&(h.operator==="Floor"||h.operator==="Ceil"||h.operator==="Round"||h.operator==="Truncate")&&!p.isComplexValued(h.op1)){let T=d(h.op1,L+1);if(T!==void 0)return T+1}else{if(b(h)&&h.operator==="Fract"&&h.nops===1&&!p.isComplexValued(h.op1)&&!Dr(h.op1)&&m(h))return 1;if(b(h)&&h.operator==="Mod"&&h.nops===2&&!p.isComplexValued(h.op1)&&!p.isComplexValued(h.op2)&&!Dr(h.op1)&&m(h)){if(D(h.op2)&&h.op2.im===0&&h.op2.re===1)return 1;let T=d(h.op1,L+1),U=d(h.op2,L+1);if(T!==void 0&&U!==void 0)return U+(T+U)*2**-16}else if(b(h)&&m(h)){let T=G(h);if(T?.finite===!0&&T.magnitude!==void 0)return T.magnitude}}}if(C(h)){if(h.valueDefinition?.isConstant===!0&&!f(h.symbol)&&h.unknowns.length===0){let T=h.N();if(T.im===0&&Number.isFinite(T.re))return Math.abs(T.re)}}else{let T=l(h);if(T!==void 0&&Number.isFinite(T))return Math.abs(T)}if(b(h)&&(h.operator==="Add"||h.operator==="Subtract"||h.operator==="Negate"||h.operator==="Abs"||h.operator==="Min"||h.operator==="Max")){let T=h.operator==="Add"||h.operator==="Subtract",U=!T&&h.operator!=="Negate",M=0;for(let j of h.ops){if(U&&(V(j)!=="scalar"||p.isComplexValued(j)))return;let W=d(j,L+1);if(W===void 0)return;M=T?M+W:Math.max(M,W)}return Number.isFinite(M)?M:void 0}if(!C(h)||r?.has(h.symbol)===!0||i(h.symbol)||c(h)!==void 0||h.valueDefinition?.inferredType===!0)return;let y=h.type.type;if(typeof y!="object"||y.kind!=="numeric")return;let{lower:k,upper:A}=y;if(k===void 0||A===void 0)return;let R=Math.max(Math.abs(k),Math.abs(A));return Number.isFinite(R)?R:void 0},g=h=>{let L=1,y=0,k=!0;for(let A of h){let R=d(A);R===void 0?y+=1:(L*=Math.max(1,R),D(A)&&R<=1&&(A.operator!=="Rational"||Math.abs(A.numerator.re)===1&&A.denominator.re<=2**126)||(k=!1))}return y===1?k:y===0&&Number.isFinite(L)&&L<=Ke/2},_=h=>{let L=0,y=0;for(let k of h){let A=d(k)??N(k);A===void 0?y+=1:L+=A}return Number.isFinite(L)?y===0?L<=Ke/2:y===1&&L<=2**100:!1},x=h=>{if(!b(h)||h.nops!==2)return!1;if(!D(h.op2)){let k=w(h.op2),A=d(h.op2);if(k===void 0||!(k>=2**-126)||A===void 0||A>2**126)return!1;let R=d(h.op1);return R===void 0?k>=2:R/k<=Ke/2}if(h.op2.im!==0)return!1;let L=Math.abs(h.op2.re);if(!(L>=2**-126&&L<=2**126))return!1;let y=d(h.op1);return y===void 0?L>=2:y/L<=Ke/2},v=h=>{if(!b(h)||h.nops!==2)return!1;let L=h.op2;if(D(L)&&L.im===0&&L.re===1)return!0;let y;if(D(L))y=L.im===0?Math.abs(L.re):void 0;else if(!n&&C(L)&&r?.has(L.symbol)!==!0&&!i(L.symbol)&&c(L)===void 0&&L.valueDefinition?.inferredType!==!0){let R=L.type.type;if(typeof R=="object"&&R.kind==="numeric"){let{lower:T,upper:U}=R;T!==void 0&&T>0?y=T:U!==void 0&&U<0&&(y=-U)}}if(y===void 0||!(y>=2**-126))return!1;let k=d(h.op1),A=d(L);return k===void 0||A===void 0||A>2**126?!1:k/y<=Ke/2&&k+A<=Ke/2},E=h=>{if(!b(h)||!D(h.op2)||h.op2.im!==0)return!1;let L=h.op2.re;if(!Number.isInteger(L)||L<2||L>4)return!1;let y=$(h.op1);return y!==void 0&&Math.max(1,y)**L*(1+2**-10)<=Ke/2},S=h=>{if(!b(h,"Power")||!D(h.op2)||h.op2.im!==0)return;let L=-h.op2.re;if(!Number.isInteger(L)||L<2||L>4)return;let y=$(h.op1);if(y===void 0||Math.max(1,y)**L*(1+2**-10)>2**126)return;let k=w(h.op1);if(k===void 0)return;let A=k**L*(1-2**-20);if(!(A>=2**-126))return;let R=1/A*(1+2**-20);return R<=Ke/2?R:void 0},$=h=>{let L=y=>(b(y)&&y.operator==="Negate"&&(y=y.op1),b(y)&&y.operator==="Multiply"?N(y):I(y));if(b(h)&&(h.operator==="Add"||h.operator==="Subtract")){let y=0;for(let k of h.ops){let A=L(k);if(A===void 0)return;y+=A}return Number.isFinite(y)?y:void 0}return L(h)},N=h=>{if(!b(h)||h.operator!=="Multiply")return;let L=1,y=0,k=0;for(let A of h.ops){if(D(A)){if(A.operator==="Rational")return;y+=1}else k+=1;let R=I(A);if(R===void 0)return;L*=R}if(!(y===0||k!==1))return Number.isFinite(L)?L:void 0},I=h=>{if(D(h))return h.im===0&&Number.isFinite(h.re)?Math.abs(h.re):void 0;if(b(h)&&(h.operator==="Sin"||h.operator==="Cos"))return h.nops===1&&(h.type.matches("real")||n&&m(h.op1))?1:void 0;if(!C(h)||r?.has(h.symbol)===!0||i(h.symbol)||c(h)!==void 0||h.valueDefinition?.inferredType===!0)return;let L=h.type.type;if(typeof L!="object"||L.kind!=="numeric")return;let{lower:y,upper:k}=L;if(y===void 0||k===void 0)return;let A=Math.max(Math.abs(y),Math.abs(k));return Number.isFinite(A)?A:void 0},O=h=>Rr(h)!==void 0,F=(h,L=0)=>{if(L>32||!m(h)||O(h))return;let y=(A,R,T,U=1)=>{let M=U*11754943508222875e-54,j=[A-T-M,R+T+M];return Math.max(-j[0],j[1])<=Ke/2?j:void 0};if(D(h))return h.im===0?y(h.re,h.re,Math.abs(h.re)*2**-23):void 0;if(C(h)){let A=r?.get(h.symbol);if(A?.finite===!0)return A.range;let R=c(h);if(R!==void 0)return F(R,L+1)}else if(b(h)){let A=h.operator;if(A==="Negate"&&h.nops===1){let T=F(h.op1,L+1);if(T!==void 0)return[-T[1],-T[0]]}else if((A==="Add"||A==="Subtract")&&h.nops>=1){let T=0,U=0,M=0,j=!0;if(h.ops.forEach((W,ue)=>{let ie=j?F(W,L+1):void 0;if(ie===void 0){j=!1;return}A==="Subtract"&&ue>0?(T-=ie[1],U-=ie[0]):(T+=ie[0],U+=ie[1]),M+=Math.max(-ie[0],ie[1])}),j)return y(T,U,h.nops*2**-22*M,h.nops)}else if(A==="Multiply"&&h.nops>=1){let T=h.ops.filter(O),U=1,M=1,j=T.length<=1&&T.length<h.nops,W=(K,Q)=>{if(K===void 0)return;let Z=Math.min(K[0]*Q,K[1]*Q),H=Math.max(K[0]*Q,K[1]*Q);if(!((Z>0||H<0)&&Math.min(Math.abs(Z),Math.abs(H))<2**-100))return y(Z,H,2**-20*Math.max(-Z,H))};for(let K of h.ops){if(!j)break;if(O(K))continue;let Q=F(K,L+1);if(Q===void 0){j=!1;break}let Z=[U*Q[0],U*Q[1],M*Q[0],M*Q[1]];if(U=Math.min(...Z),M=Math.max(...Z),(U>0||M<0)&&Math.min(Math.abs(U),Math.abs(M))<2**-100){j=!1;break}}let ue=j&&Number.isFinite(U)&&Number.isFinite(M)?y(U,M,h.nops*2**-22*Math.max(-U,M)):void 0,ie=T[0]===void 0?void 0:Rr(T[0]);if(ie!==void 0&&(ue=W(ue,1/ie.q),ie.p!==1&&(ue=W(ue,ie.p))),ue!==void 0)return ue}else if(A==="Divide"&&h.nops===2&&D(h.op2)&&!O(h.op2)&&h.op2.im===0&&Math.abs(h.op2.re)>=2**-126&&Math.abs(h.op2.re)<=2**126){let T=F(h.op1,L+1),U=h.op2.re;if(T!==void 0){let M=T[0]/U,j=T[1]/U;return y(Math.min(M,j),Math.max(M,j),2**-21*Math.max(Math.abs(M),Math.abs(j)))}}else{let T=G(h)?.range;if(T!==void 0)return T}let R=l(h);return R!==void 0&&Number.isFinite(R)?y(R,R,Math.abs(R)*2**-23):void 0}let k=d(h);return k===void 0?void 0:[-k,k]},w=(h,L=0)=>{if(L>32||!m(h,!0)||O(h))return;let y=A=>Number.isFinite(A)&&A>=2**-126?A:void 0;if(D(h))return h.im===0?y(Math.abs(h.re)*(1-2**-23)):void 0;if(b(h,"Cos")&&h.nops===1){if(h.engine.angularUnit!=="rad")return;let A=F(h.op1,L+1);if(A===void 0)return;let R=Math.max(-A[0],A[1]);return R<Math.PI/2?y(Math.cos(R)-Qp):void 0}if(b(h,"Power")&&D(h.op2)&&h.op2.im===0&&Number.isInteger(h.op2.re)&&h.op2.re>=2&&h.op2.re<=4){let A=w(h.op1,L+1);return A===void 0?void 0:y(A**h.op2.re*(1-2**-20))}if(b(h,"Multiply")){let A=h.ops.filter(O);if(A.length>1||A.length===h.nops)return;let R=1;for(let U of h.ops){if(O(U))continue;let M=w(U,L+1);if(M===void 0||(R*=M,!(R>=2**-100)))return}R*=1-h.nops*2**-22;let T=A[0]===void 0?void 0:Rr(A[0]);if(T!==void 0){if(R=R/T.q*(1-2**-20),!(R>=2**-100))return;R*=Math.abs(T.p)*(1-2**-20)}return y(R)}let k=F(h,L+1);if(!(k===void 0||k[0]<=0&&k[1]>=0))return y(Math.min(Math.abs(k[0]),Math.abs(k[1])))},z=new Map,G=h=>{if(!b(h))return;if(z.has(h))return z.get(h);z.set(h,void 0);let L=h.operator;if(h.engine.angularUnit!=="rad"||e.boundVars?.has(L)===!0||r?.has(L)===!0||t.isOverriddenOperator?.(L)===!0||e.unrollSkipHeads?.has(L)===!0||e.overridesHead?.(L)===!0)return;if(no.includes(L)||no.length>=8){zn.refusals+=1;return}let y;try{y=p.userFunctionLiteral(h.engine,L)}catch(H){if(H instanceof Error&&H.name==="CancellationError")throw H;return}if(y===void 0||!b(y,"Function"))return;let k=y.ops.slice(1);if(k.length!==h.nops)return;let A=y.ops[0];if(b(A,"Block")){if(A.nops!==1)return;A=A.ops[0]}let R=to(y.ops[0]),T=k.map(H=>xn(H));if(k.some(H=>Jn(H))||T.some(H=>H===""||R.has(H))||new Set(T).size!==T.length)return;let U=new Map;for(let H=0;H<T.length;H++){let P=h.ops[H];if(V(P)!=="scalar"||!m(P))return;U.set(T[H],{finite:!0,magnitude:d(P),range:F(P)})}let M=new Set(e.boundVars??[]);for(let H of T)M.add(H);let j={...e,boundVars:M,gpuParameterFacts:U},W=[L,[...M].sort().join(","),...T.map(H=>{let P=U.get(H);return`${P.magnitude}:${P.range?.[0]}:${P.range?.[1]}`})].join("\0"),ie=(e.userFunctions===void 0?void 0:Gi.get(e.userFunctions))?.get(W)?.find(H=>H.written===o&&nd(H.target,j));if(ie!==void 0)return z.set(h,ie.fact),ie.fact;if(zn.left<=0){zn.refusals+=1;return}zn.left-=1;let K=Ni(j,!0);if(K===void 0)return;let Q=zn.refusals;no.push(L);let Z;try{let H=K.finite(A);Z={finite:H,magnitude:H?K.magnitude(A):void 0,range:H?K.range(A):void 0}}finally{no.pop()}if(z.set(h,Z),e.userFunctions!==void 0&&zn.refusals===Q){let H=Gi.get(e.userFunctions);H===void 0&&Gi.set(e.userFunctions,H=new Map);let P=H.get(W),B={target:j,written:o,fact:Z};P===void 0?H.set(W,[B]):P.push(B)}return Z};return{finite:m,magnitude:h=>d(h),range:h=>F(h)}}var Qp=2**-6,no=[],zn={left:0,refusals:0},ed=4096,Gi=new WeakMap;function nd(e,n){let t=e,r=n,o=Object.keys(t);if(o.length!==Object.keys(r).length)return!1;for(let i of o)if(!(i==="boundVars"||i==="gpuParameterFacts")&&(!(i in r)||t[i]!==r[i]))return!1;return!0}var Su=new WeakMap,zu=new WeakMap;function to(e){let n=new Set,t=(r,o)=>{if(b(r)){if(!o)for(let i of un(r))n.add(i);(r.operator==="Assign"||r.operator==="Declare")&&C(r.op1)&&n.add(r.op1.symbol);for(let i of r.ops)t(i,!1)}};return t(e,!0),n}function Pu(e,n){let t=n.userFunctions,r=n.cse?.harvestOptions;if(t===void 0||r===void 0)return;let o=e.engine,i=z=>r.isOverriddenOperator?.(z)===!0||n.unrollSkipHeads?.has(z)===!0||n.overridesHead?.(z)===!0,s=new Set,a=!1,l=new Map,u=z=>{if(l.has(z))return l.get(z);let G;if(!i(z))try{G=p.userFunctionLiteral(o,z)}catch(h){if(h instanceof Error&&h.name==="CancellationError")throw h;a=!0}return l.set(z,G),G},f=[],c=new Map,m=new Set,d=new Set,g=new Map,_=0,x=[[e,void 0]],v=(z,G)=>{if(c.has(z)||!b(G,"Function"))return;let h=G.ops[0],L=to(h),y=G.ops.slice(1),k=y.map(A=>xn(A));c.set(z,{names:k,stable:y.map((A,R)=>!Jn(A)&&k[R]!==""&&!L.has(k[R]))}),x.push([h,z])},E=new Map,S=(z,G,h,L=E)=>{if(C(z)){let M=z.symbol;if(h.has(M)||G!==void 0&&c.get(G).names.includes(M))return;let j=u(M);if(j!==void 0)m.add(M),v(M,j);else if(!d.has(M)){d.add(M);let W=o._getSymbolValue(M);W!==void 0&&x.push([W,void 0])}return}if(!b(z)||a)return;if(++_>1e5){a=!0;return}if(h.size===0){let M=g.get(G);if(M===void 0&&g.set(G,M=new Set),M.has(z))return;M.add(z)}let y=z.operator;(y==="Assign"||y==="Declare")&&C(z.op1)&&s.add(z.op1.symbol);let k=u(y);k!==void 0&&(h.has(y)?m.add(y):f.push({caller:G,callee:y,args:z.ops,bound:h,indices:L}),v(y,k));let A=G===void 0?[]:c.get(G).names,R=un(z).filter(M=>!A.includes(M));for(let M of R){let j=u(M);j!==void 0&&(m.add(M),v(M,j))}let T=R.length===0?h:new Set([...h,...R]),U=L;if(R.length>0){let M=new Map(L);for(let W of R)M.delete(W);let j=td(z);j!==void 0&&R.includes(j[0])&&M.set(j[0],j[1]),U=M.size===0?E:M}for(let M of z.ops)S(M,G,T,U)};for(;x.length>0;){let[z,G]=x.pop();S(z,G,new Set)}if(zu.set(t,a?"all":s),a||c.size===0)return;let $=new Map;for(let[z,{stable:G}]of c)$.set(z,G.map(h=>h&&!m.has(z)));for(let z of f)z.args.length!==c.get(z.callee).names.length&&$.get(z.callee).fill(!1);let N=new Map;for(let[z,{names:G}]of c)N.set(z,G.map(()=>{}));let I=z=>{if(z.caller===void 0&&z.indices.size===0)return n;let G=z.caller===void 0?[]:c.get(z.caller).names,h=new Map;G.forEach((y,k)=>{y!==""&&h.set(y,{finite:$.get(z.caller)[k],magnitude:N.get(z.caller)[k]})});for(let[y,k]of z.indices)h.set(y,k);let L=new Set(n.boundVars??[]);for(let y of G)y!==""&&L.add(y);for(let y of z.indices.keys())L.add(y);return{...n,boundVars:L,gpuParameterFacts:h}},O=(z,G,h)=>G.size===0?!1:C(z)?G.has(z.symbol)&&!h.has(z.symbol):b(z)?G.has(z.operator)||z.ops.some(L=>O(L,G,h)):!1,F=!0;for(;F;){F=!1;for(let z of f){let G=$.get(z.callee);if(!G.some(L=>L))continue;let h=I(z);z.args.forEach((L,y)=>{G[y]&&(O(L,z.bound,z.indices)||!ln(L,h))&&(G[y]=!1,F=!0)})}}for(let z=0;z<=c.size;z++){let G=new Map;for(let[h,{names:L}]of c)G.set(h,L.map(()=>-1));for(let h of f){let L=$.get(h.callee),y=G.get(h.callee),k=L.some(A=>A)?Ni(I(h),!0):void 0;Cu(()=>h.args.forEach((A,R)=>{let T=L[R]?k?.magnitude(A):void 0,U=y[R];y[R]=T===void 0||U===void 0?void 0:Math.max(U,T)}))}for(let h of G.values())h.forEach((L,y)=>{L===-1&&(h[y]=void 0)});for(let[h,L]of G)N.set(h,L)}let w=new Map;for(let[z,G]of $)w.set(z,G.map((h,L)=>({finite:h,magnitude:h?N.get(z)[L]:void 0})));Su.set(t,w)}function ku(e,n,t,r,o,i){let s=o.userFunctions===void 0?void 0:Su.get(o.userFunctions)?.get(e);if(s===void 0)return;let a=to(r),l=new Map;return n.forEach((u,f)=>{if(t[f]!==(i?"f32":"float")||a.has(u))return;let c=s[f];c?.finite===!0&&l.set(u,c)}),l.size===0?void 0:l}function Fi(e,n,t,r,o){let i=new Map(o.gpuParameterFacts??[]);i.delete(n);let s=Lu(e,n,t,r);return s!==void 0&&i.set(n,s),i.size===0?void 0:i}function Lu(e,n,t,r){if(t===void 0||r===void 0||!Number.isInteger(t)||!Number.isInteger(r))return;let o=Math.max(Math.abs(t),Math.abs(r));if(!(o>2**24)&&!un(e).includes(n)&&!to(e).has(n))return{finite:!0,magnitude:o,range:[t,r]}}function td(e){if(!b(e)||e.nops!==2||e.operator!=="Sum"&&e.operator!=="Product")return;let n=e.ops[1];if(!b(n,"Limits")||n.nops!==3)return;let[t,r,o]=n.ops;if(!C(t)||!D(r)||!D(o)||r.im!==0||o.im!==0)return;let i=Lu(e.ops[0],t.symbol,r.re,o.re);return i===void 0?void 0:[t.symbol,i]}function oo(e,n,t){if(!/\breturn\b/.test(n))return;let r=n.split(`
`),o=r.length===1;for(let i of r){let s=i.length-i.trimStart().length;for(let a of i.matchAll(/\breturn\b/g))if(!(!o&&a.index===s))throw new Error(`Could not compile ${nn(e)}: an early \`Return\` here has no ${t.toUpperCase()} lowering \u2014 the emitted source would place a \`return\` where the language requires an expression (\`${i.trim()}\`). A shader function returns once, at the end of its body, so a \`Return\` inside a conditional \u2014 or one that IS the body's final value \u2014 cannot be emitted. Rewrite it as a conditional VALUE, or evaluate instead.`)}}function Ii(e,n,t){let r=n.includes(`
`);if(!r&&!/\breturn\b/.test(n))return;let o=t.toUpperCase(),i=(r?n.split(`
`)[0]:n).trim();throw new Error(`Could not compile ${nn(e)}: this route emits a single ${o} EXPRESSION, but the body lowers to ${r?"a statement sequence":"a bare `return` statement"} (\`${i}${r?"\u2026":""}\`). ${o} has no expression-level block or immediately-invoked function to wrap statements in, so there is no valid emission for this position. Compile a statement body with compile() instead \u2014 that route emits a function body.`)}function hn(e,n,t){let r=In(n);if(r===void 0)return;let o=t.toUpperCase();if(r==="Assign"){if(t!=="wgsl")return;throw new Error(`Could not compile ${nn(e)}: this route emits a single WGSL EXPRESSION, but the body is an assignment. WGSL assignment is a STATEMENT (unlike GLSL, where it is an operator), so the emitted \`\u2026 = <target> = <value>\` is not valid source. Compile a statement body with compile() instead \u2014 that route emits a function body.`)}throw new Error(`Could not compile ${nn(e)}: this route emits a single ${o} EXPRESSION, but the body is a declaration. A declaration is a STATEMENT in ${o}, so the emitted \`${t==="wgsl"?"var s: f32":"float s"}\`-shaped source is not valid in an expression position \u2014 and it carries no initializer, so the declared value would be silently DROPPED. Compile a statement body with compile() instead \u2014 that route emits a function body.`)}function mn(e){let n=new Set,t=r=>{if(n.has(r))return!1;if(n.add(r),C(r)){let i=r.engine._getSymbolValue(r.symbol);return i!==void 0&&t(i)}if(!b(r))return!1;let o=r.operator;return o==="Sum"||o==="Product"||o==="Block"||o==="Loop"?!0:r.ops.some(t)};return t(e)}function Au(e,n){let t=e.engine.lookupDefinition(n),r=[];return mt(t)?r.push(t.operator.signature?.type):Fe(t)&&r.push(t.value.type?.type,t.value.value?.type?.type),r.some(o=>{let i=wa(o);return i==="any"||i?.includes("scope")===!0||i?.includes("state")===!0})}function rd(e,n,t){if(!b(e))return!1;let r=new Set;return e.ops.some(o=>{if(b(o,"Declare")){let i=o.ops[0];if(C(i))r.add(i.symbol);else if(b(i,"Tuple")||b(i,"List")||b(i,"Delimiter")||b(i,"Sequence"))for(let a of i.ops)C(a)&&r.add(a.symbol);let s=p.declareValueOperand(o.ops);return s!==void 0&&rt(s,n,t)}if(b(o,"Assign")){let i=o.ops[0];return!C(i)||!r.has(i.symbol)?!0:rt(o.ops[1],n,t)}return rt(o,n,t)})}function rt(e,n,t=new Set){if(n.has(e))return!1;if(C(e)){if(Au(e,e.symbol))return!0;if(!p.foldValueImpure(e)||t.has(e.symbol))return!1;let o=e.engine._getSymbolValue(e.symbol);if(o===void 0)return!0;t.add(e.symbol);try{return rt(o,n,t)}finally{t.delete(e.symbol)}}if(!b(e)||!p.foldValueImpure(e))return!1;if(e.operator==="Block")return rd(e,n,t);let r=e.operator;return r==="Assign"||r==="Declare"||r==="Assume"||e.ops.some(o=>rt(o,n,t))?!0:Au(e,r)}function nr(e,n,t){if(!p.canHoist(t)||tn.has(t.hoist))return;let r=Kt(t);if(r===void 0)return;if(e.some(p.hasObservableEffect)){if(e.some(S=>rt(S,new Set)))return;if(Sn===void 0){let S=new Map,$=e.map(I=>jn(I,S)),N=$.reduce((I,O)=>I+O,0);if(jn(r,S)!==N||$.some(I=>I>1)){if(e.some(mn))throw Qt("Could not compile the selection: a clause needs statements and draws a random value, and a draw of the rest of the statement could then change places with its draws.");return}}}if(!eo(e,t)||rt(r,new Set(e)))return;let o=t.language==="wgsl",i=e.filter((S,$)=>$%2===1),s=ir("Which",e),l=(i.some(S=>!ro(S,t))?i.filter(S=>!ro(S,t)):i).map(S=>s&&V(S)==="scalar"?ae(2,o):pe(S,o));if(l.some(S=>S===void 0)||new Set(l).size!==1)return;let u=l[0];if(!/^(float|vec[234]|f32|vec[234]f)$/.test(u)&&!C(e[e.length-2],"True"))return;let f=t.hoist,c=(S,$)=>{let N=f.stmts.length;$&&Zt.add(f);let I;try{I=$?vu(f,S):S()}finally{Zt.delete(f)}let O=f.stmts.splice(N).map(F=>F.replace(/;\s*$/,""));return{code:I,stmts:O}},m=S=>S.map($=>`  ${$.replace(/\n/g,`
  `)}`),d=S=>/[;{}]\s*$/.test(S)?S:`${S};`,g=p.tempVar(t),_=i.find(S=>Ue(S))??null,x=s?`${re(t)}(${ce(t)})`:et(_,t),v=S=>{if(S>=e.length)return[`${g} = ${x}`];let $=e[S],N=e[S+1];if(C($,"True")){let w=c(()=>n(N,S+1),!0);return[...w.stmts,`${g} = ${w.code}`]}let I=c(()=>n($,S),S>0),O=c(()=>n(N,S+1),!0),F=[...O.stmts,`${g} = ${O.code}`];return[...I.stmts,`if (${I.code}) {`,...m(F),"} else {",...m(v(S+2)),"}"]},E=v(0);return p.hoistStatement(t,o?`var ${g}: ${u};`:`${u} ${g};`,E.map(d).join(`
`)),g}function Tu(e,n,t){if(!n.some(i=>mn(i.body)||i.guard!==void 0&&mn(i.guard))&&!(Xe(t)&&Gt(Mi(n),t))||p.hasObservableEffect(e))return;let r=e.engine,o=n.flatMap(i=>[i.test===void 0?r.True:i.guard===void 0||C(i.guard,"True")?r.False:i.guard,i.body]);if(!ir("Which",o)&&eo([...o,...n.flatMap(i=>i.comparisons)],t))return nr(o,(i,s)=>{let a=n[Math.floor(s/2)];if(s%2===1)return Ze("Match",a.compileBody,t);let l=a.test;return s===0?l():Ze("Match",l,t)},t)}function Mi(e){return e.length===0||e[0].test===void 0?[]:e.flatMap((n,t)=>[n.body,...n.guard===void 0?[]:[n.guard],...t===0?[]:n.comparisons])}function Xe(e){return p.canHoist(e)&&!tn.has(e.hoist)}function tr(e){let n=new Set,t=new Set,r=!1,o=i=>{if(!r){if(C(i)){let s=i.symbol;if(t.has(s))return;let a=i.engine._getSymbolValue(s);if(a===void 0)return;t.add(s),o(a),t.delete(s);return}if(b(i)){if(n.has(i)){r=!0;return}n.add(i);for(let s of i.ops)o(s)}}};return o(e),r}var od=new Set(["Zeta","HurwitzZeta","LerchPhi","PolyLog","PolyGamma","Digamma","Trigamma","BesselJ","FresnelC","FresnelS","GCD","LCM","Mandelbrot","Julia"]);function rr(e,n){if(n.language!=="wgsl")return!1;let t=new Set,r=new Set,o=i=>{if(C(i)){let a=i.symbol;if(r.has(a))return!1;let l=i.engine._getSymbolValue(a);if(l===void 0)return!1;r.add(a);let u=o(l);return r.delete(a),u}if(!b(i)||t.has(i))return!1;if(t.add(i),od.has(i.operator)||p.foldValueImpure(i)&&!i.ops.some(a=>p.foldValueImpure(a)))return!0;let s=i.engine.lookupDefinition(i.operator);return Fe(s)||mt(s)&&s.operator.isUserFunctionDefinition?!0:i.ops.some(o)};return o(e)}function Ze(e,n,t){let r=p.canHoist(t)?t.hoist:void 0;if(r!==void 0&&Zt.has(r))return Zt.delete(r),n();let o=r?.stmts.length??0,i=r!==void 0&&tn.has(r);r!==void 0&&tn.add(r);let s;try{s=n()}finally{r!==void 0&&!i&&tn.delete(r)}if(r!==void 0&&r.stmts.length>o)throw r.stmts.length=o,Qt(`Could not compile \`${e}\`: a conditionally-evaluated branch contains a multi-statement construct (a loop-form Sum/Product, or an impure operand bound to a hoisted temporary). Hoisting it out of the branch would run it unconditionally \u2014 a shader conditional is an expression, not a statement \u2014 which changes the result whenever the branch draws from the random stream.`);return s}function Pn(e,n,t,r){let o=r?.language==="wgsl";return n==="1.0"&&t==="0.0"?`${o?"f32":"float"}(${e})`:o?`select(${t}, ${n}, ${e})`:`((${e}) ? (${n}) : (${t}))`}function Gu(e){if(b(e,"Tuple"))return!0;let n=te(e);return typeof n!="string"&&n.kind==="tuple"}function Oi(e,n){for(let t of n)if(t!=null&&!(!b(t,"List")&&!b(t,"Tuple"))&&V(t)==="array")throw new Error(`Could not compile \`${e}\`: the value \`${t.toString()}\` lowers to a shader ARRAY, and a selection (a GLSL ternary, a WGSL \`select\`) chooses between scalars or vectors only.`)}function io(e,n,t){if(t.language!=="wgsl")return;let r=o=>b(o)&&o.operator!=="Function"&&(o.operator==="Return"||o.ops.some(r));if(!n.some(r)&&n.some(o=>p.foldValueImpure(o)))throw Qt(`Could not compile \`${e}\`: a branch draws a random value, and the WGSL selection \`select(\u2026)\` computes every branch, so a branch that is not taken would still advance the random stream and shift every later draw in the shader.`)}function or(e,n,t){if(Gt(n,t))throw new Error(`Could not compile \`${e}\`: a branch contains code supplied by the caller (a \`vars\` source, a \`functions\` or \`operators\` entry, or a \`compile\` handler), and the WGSL selection \`select(\u2026)\` computes every branch, so that code would run even when its branch is not taken.`)}function Gt(e,n){return n.language==="wgsl"&&e.some(t=>ye(t,n))}function so(e,n,t){if(t.language!=="wgsl")return;let r=o=>i=>b(i)&&i.operator!=="Function"&&i.operator!=="Block"&&(i.operator===o||i.ops.some(r(o)));if(!n.some(r("Return"))&&n.some(r("Assign")))throw new Error(`Could not compile \`${e}\`: a branch assigns a variable, and the WGSL selection \`select(\u2026)\` takes expressions, where an assignment is a statement in WGSL. Such a selection compiles as an \`if\` statement only where its value is discarded: a statement of a block that is not the block's value, or a loop body.`)}function xe(e){throw new Error(`Could not compile \`Which\`: ${e}`)}function ir(e,n){return p.liveSelectionArms({operator:e,ops:n}).some(t=>p.isComplexValued(t))}function ro(e,n){return C(e,"Missing")||C(e,"Undefined")?n.boundVars?.has(e.symbol)!==!0&&n.varsKeys?.has(e.symbol)!==!0:D(e)&&Number.isNaN(e.re)&&e.im===0}function id(e,n,t){if(n)return`${re(t)}(${ce(t)})`;let r=e.find(o=>!ro(o,t)&&Ue(o))??null;return et(r,t)}function sr(e,n,t,r,o,i){if(i!==void 0&&ro(n,o))return id(i,r,o);if(!r||p.isComplexValued(n))return t;let s=V(n)==="scalar";if(!s||!Se(n.type.type,"number"))throw new Error(`Could not compile \`${e}\`: the value \`${n.toString()}\` is not a ${s?"number":"scalar"}, and another value of the selection is complex.`);return`${re(o)}(${t}, 0.0)`}function Nu(e){if(C(e,"True")||C(e,"False"))return;if(b(e,"List")){for(let i of e.ops)C(i,"True")||C(i,"False")||p.isBooleanValued(i)&&!p.isComplexValued(i)&&!p.isNonScalarShape(i)||xe(`a literal list condition needs provably boolean scalar cells (\`True\`/\`False\` or a scalar comparison); the cell \`${i.toString()}\` is not one, and the interpreter only selects when every cell evaluates to a boolean.`);let o=e.nops;return(o<2||o>4)&&xe(`a ${o}-element list condition has no GPU vector lowering (only vec2\u2013vec4 are shader values).`),o}let n=e.operator,t=b(e)?e.ops:[];if(Vo(n)){let o;for(let i of t){p.isComplexValued(i)&&xe(`a complex-valued operand (\`${i.toString()}\`) in an element-wise condition is lowered as a \`vec2\` of (re, im), which has no cell meaning in a selection.`),Gu(i)&&xe(`a tuple operand (\`${i.toString()}\`) in an element-wise condition has no element-wise reading \u2014 the interpreter binds a tuple atomically.`);let s=Ue(i);if(s===void 0){p.isNonScalarShape(i)&&xe(`the condition operand \`${i.toString()}\` is not a shader scalar and has no static vec2\u2013vec4 shape (an unknown-length list, a matrix, or a 5+-element list).`);continue}o!==void 0&&o!==s&&xe(`an element-wise condition mixes vec${o} and vec${s} operands.`),o=s}return o===void 0?void 0:((n==="Equal"||n==="NotEqual")&&t.length>2&&xe(`an n-ary \`${n}\` over a collection operand has no faithful element-wise lowering \u2014 the interpreter's n-ary form switches shape on how many operands are collections at run time, so no pairwise conjunction matches it.`),fi[n]===void 0&&xe(`the relation \`${n}\` has no componentwise shader form.`),o)}if(n==="And"||n==="Or"||n==="Not"){let o;for(let i of t){let s=Nu(i);s!==void 0&&(o!==void 0&&o!==s&&xe(`an element-wise \`${n}\` mixes vec${o} and vec${s} operands.`),o=s)}return o}if(p.isComplexValued(e))return;let r=p.vectorComponentCount(e);if(r!==void 0)return e.type.matches("indexed_collection<boolean>")||xe(`the condition \`${e.toString()}\` is a collection of \`${e.type.toString()}\`, not of booleans.`),r;p.isNonScalarShape(e)&&xe(`the condition \`${e.toString()}\` is not a shader scalar and has no static vec2\u2013vec4 shape.`)}function Ru(e,n,t){if(e.length===1)return e[0];if(t.language==="wgsl")return`(${e.join(" & ")})`;let r=rn(n,t);return`${qr(n,t)}(${e.map(o=>`${r}(${o})`).join(" * ")})`}function sd(e,n,t){if(e.length===1)return e[0];if(t.language==="wgsl")return`(${e.join(" | ")})`;let r=rn(n,t);return`${qr(n,t)}(${e.map(o=>`${r}(${o})`).join(" + ")})`}function Fu(e,n,t,r){let o=qr(n,r),i=rn(n,r);if(C(e,"True"))return`${o}(true)`;if(C(e,"False"))return`${o}(false)`;if(b(e,"List"))return`${o}(${e.ops.map(l=>C(l,"True")?"true":C(l,"False")?"false":t(l)).join(", ")})`;let s=e.operator,a=b(e)?e.ops:[];if(Vo(s)){let l=r.language==="wgsl"?Xl[s]:fi[s];l===void 0&&xe(`the relation \`${s}\` has no componentwise shader form.`);let u=(d,g)=>{let _=g?de(s,d,t,r):t(d);return Ue(d)===void 0?`${i}(${_})`:_},f=a.some((d,g)=>g>=1&&g<=a.length-2&&d.isPure===!1),c=a.map(d=>u(d,f&&d.isPure===!1)),m=[];for(let d=0;d<c.length-1;d++)m.push(r.language==="wgsl"?`((${c[d]}) ${l} (${c[d+1]}))`:`${l}(${c[d]}, ${c[d+1]})`);return Ru(m,n,r)}if(s==="And"||s==="Or"||s==="Not"){let l=a.map(u=>Fu(u,n,t,r));if(s==="Not"){if(l.length!==1)throw new Error("Could not compile `Not`: expected one argument");return r.language==="wgsl"?`(!(${l[0]}))`:`not(${l[0]})`}return s==="And"?Ru(l,n,r):sd(l,n,r)}return!p.isComplexValued(e)&&p.vectorComponentCount(e)!==void 0?t(e):`${o}(${t(e)})`}function Iu(e,n,t){let r;for(let l=0;l<e.length;l+=2){let u=Nu(e[l]);u!==void 0&&(r!==void 0&&r!==u&&xe(`the conditions of an element-wise selection mix vec${r} and vec${u}.`),r=u)}if(r===void 0)return null;let o=r,i=rn(o,t),s=l=>{p.isComplexValued(l)&&xe(`an element-wise selection cannot have a complex-valued arm (\`${l.toString()}\`) \u2014 a compiled complex value is a \`vec2\` of (re, im), which has no cell convention inside a selection.`),Gu(l)&&xe(`an element-wise selection cannot have a tuple arm (\`${l.toString()}\`) \u2014 a lifted point would be a list of points, which is not a GPU value.`),(C(l,"True")||C(l,"False")||l.type.matches("boolean")||l.type.matches("indexed_collection<boolean>"))&&xe(`an element-wise selection cannot have a boolean-valued arm (\`${l.toString()}\`) \u2014 a GPU selection produces one numeric vector, and there is no boolean-cell convention. Use numeric arms (e.g. 1 and 0) instead.`);let u=Ue(l);if(u===o)return n(l);if(u===void 0&&!p.isNonScalarShape(l))return`${i}(${n(l)})`;xe(`the arm \`${l.toString()}\` does not fit the vec${o} shape of the element-wise conditions (the interpreter answers \`incompatible-dimensions\`).`)},a=`${i}(${ce(t)})`;for(let l=e.length-2;l>=0;l-=2){let u=s(e[l+1]);if(C(e[l],"True")){a=u;continue}let f=Fu(e[l],o,n,t);a=t.language==="wgsl"?`select(${a}, ${u}, ${f})`:`mix(${a}, ${u}, ${f})`}return a}function ad(e,n){return!p.foldValueImpure(e)&&!ye(e,n)}function ld(e,n,t,r,o,i){if(t.length===0)throw new Error(`Could not compile \`${e}\`: needs at least one argument`);if(t.length===1)return Le(t[0],r,i);let s=t.map(V),a=o?.scalarGenTypeSlots.get(e),l=a!==void 0&&t.length>2,u=`${e}(${r(t[0])}, ${r(t[1])})`,f=s[0];for(let c=1;c<t.length;c++){if(c>1&&(u=`${e}(${u}, ${r(t[c])})`),l){let m=[f,s[c]],d=m.findIndex((g,_)=>g==="scalar"&&!a.has(_)&&m[1-_]!=="scalar");if(d>=0)throw new Error(`Could not compile \`${n}\`: the shader builtin \`${e}\` takes a scalar only ${Rt(a)}, but the emitted call \`${u}\` has a scalar in argument ${d+1}, where the overload requires the \`vecN\` genType; the scalar is not promoted to a vector.`)}f==="scalar"&&(f=s[c])}return u}function Ui(e,n,t,r,o){let i=()=>ld(e,n,t,r,pu(o),o);if(t.length<2||t.some(g=>p.isComplexValued(g)))return i();let s=t.map(V),a=t.every(g=>ln(g,o,!0));if(a&&new Set(s).size===1&&(s[0]==="scalar"||typeof s[0]=="number")||!s.every(g=>g==="scalar"||typeof g=="number"))return i();let l=new Set(s.filter(g=>typeof g=="number"));if(l.size>1)return i();let u=l.size===1?[...l][0]:void 0,f=u===void 0?"":ae(u,o.language==="wgsl"),c=t.map((g,_)=>u!==void 0&&s[_]==="scalar"?`${f}(${r(g)})`:r(g)),m=a?e:`_gpu_${e}${u??""}`,d=c[0];for(let g=1;g<c.length;g++)d=`${m}(${d}, ${c[g]})`;return d}function ao(e,n,t){let r=Ae(n),o,i;if(r!==void 0&&$n.test(r.callee)){if(r.operands.some(d=>Ql.test(d)))return;let c=r.operands.length;if(c===0)return;let m=/^([iub]?)vec([234])([fhiu]?)\s*(<[^<>]*>)?$/.exec(r.callee.trim());if(m!==null){let d=Number(m[2]);if(c===d)return r.operands;if(c>d)return;if(c===1&&/^[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?$/.test(r.operands[0].trim()))return Array.from({length:d},()=>r.operands[0]);if(r.operands.every(_=>we(_)))return["x","y","z","w"].slice(0,d).map(_=>`${n.trim()}.${_}`);if(!Xe(t)&&ad(e,t))return["x","y","z","w"].slice(0,d).map(_=>`${n.trim()}.${_}`);o=d,i=t.language==="wgsl"&&m[3]===""&&m[4]===void 0?"":r.callee.trim()}else{let d=/^mat([234])(?:x([234]))?/.exec(r.callee.trim());if(d!==null){let g=Number(d[1]),_=d[2]===void 0?g:Number(d[2]);if(c!==g*_)return}return r.operands}}if(o===void 0){let c=V(e);if(typeof c!="number")return;o=c}let s=["x","y","z","w"].slice(0,o);if(/^[A-Za-z_]\w*$/.test(n))return s.map(c=>`${n}.${c}`);if(!p.canHoist(t))return;let a=p.foldValueImpure(e);a&&Ye(e.operator,[e],t),ve(C(e)?e.symbol:e.operator,[e],t);let l=p.tempVar(t),u=i??(t.language==="wgsl"?`vec${o}f`:`vec${o}`),f=t.language==="wgsl"?u===""?`var ${l}`:`var ${l}: ${u}`:`${u} ${l}`;return p.hoistStatement(t,`${f} = ${n};`),a&&Be([e],t),s.map(c=>`${l}.${c}`)}function Bi(e,n,t,r,o){if(t.length===0)throw new Error(`Could not compile \`${n}\`: needs at least one argument`);let i=t.map(V),s=t.map(c=>c.isCollection&&c.count===0),a=t.map((c,m)=>s[m]?"":r(c)),l=a.map((c,m)=>{if(s[m]||i[m]!=="scalar")return!0;let d=Ae(c);return d!==void 0&&$n.test(d.callee)}),u=c=>{let m=c[0];for(let d=1;d<c.length;d++)m=`_gpu_${e}(${m}, ${c[d]})`;return m};if(!l.some(c=>c))return a.length===1?kt(t[0],a[0],o):t.every(c=>ln(c,o,!0))?a.slice(1).reduce((c,m)=>`${e}(${c}, ${m})`,a[0]):u(a);let f=[];for(let c=0;c<t.length;c++){if(s[c])continue;if(!l[c]){f.push(a[c]);continue}let m=ao(t[c],a[c],o);if(m===void 0)throw new Error(`Could not compile \`${n}\`: the operand \`${t[c].toString()}\` lowers to a shader ${We(i[c])} with no compile-time component list, so there is nothing for the reduction to fold over \u2014 a shader has no dynamic iteration here, and the \`${e}\` builtin is componentwise, not a reduction.`);f.push(...m)}return f.length===0?`(${ce(o)})`:t.every((c,m)=>s[m]||ln(c,o,!0))?`(${f.slice(1).reduce((c,m)=>`${e}(${c}, ${m})`,f[0])})`:`(${u(f)})`}function ji(e,n,t,r){let o=e==="GCD"?"_gpu_gcd":"_gpu_lcm",i=[];for(let a of n){if(a==null)throw new Error(`Could not compile \`${e}\`: missing argument`);if(a.isCollection&&a.count===0)continue;let l=t(a),u=Ae(l);if(!(V(a)!=="scalar"||u!==void 0&&$n.test(u.callee))){i.push(l);continue}let c=ao(a,l,r);if(c===void 0)throw new Error(`Could not compile \`${e}\`: the operand \`${a.toString()}\` lowers to a shader ${We(V(a))} with no compile-time component list, so there is nothing for the fold to run over.`);i.push(...c)}if(i.length===0)return Y(e==="GCD"?0:1,r.language);if(i.length===1)return`abs(${i[0]})`;let s=i[0];for(let a=1;a<i.length;a++)s=`${o}(${s}, ${i[a]})`;return s}function ar(e){return en(e)?e.string?.toLowerCase()??null:null}function Di(e,n,t,r){let o=ne(n);if(o!==void 0&&Number.isInteger(o))return o.toString();if(p.isComplexValued(n))throw new Error(`Could not compile \`${e}\`: the integer operand \`${n.toString()}\` is complex, and a shader has no conversion from a complex value to an integer.`);return`${r?.language==="wgsl"?"i32":"int"}(${t(n)})`}var Ou=100;function Vi(e,n,t){if(D(n)&&!Number.isFinite(n.re)||n.type.matches("infinity")||n.type.matches("nan"))throw new Error(`Could not compile \`${e}\`: the ${t} bound \`${n.toString()}\` is not a finite number \u2014 an infinite or NaN bound has no terminating loop.`)}var Uu=8;function Nt(e,n,t){let r=typeof t=="number"?t:void 0;return(t==="scalar"||r!==void 0)&&n>=2&&n<=4?`_gpu_pow${n}${r===void 0?"":`_v${r}`}(${e})`:`_gpu_powi${r??""}(${e}, ${he(n)})`}function Bu(e,n){let t=new Set,r=/(?<![\w$])(_gpu_pow([234])(?:_v([234]))?)\s*\(/g,o="";for(let i of e.matchAll(r)){let s=i[1];if(t.has(s))continue;t.add(s);let a=i[3]?ae(Number(i[3]),n):n?"f32":"float",l=i[2]==="2"?"return x * x;":i[2]==="3"?"return x * x * x;":`${n?"let":a} s = x * x; return s * s;`;o+=n?`
fn ${s}(x: ${a}) -> ${a} { ${l} }
`:`
${a} ${s}(${a} x) { ${l} }
`}return o}var Mu=8,qi=([e,n],t,r)=>{if(e==null||n===null||n===void 0)throw new Error("Could not compile `Binomial`: need two arguments");let o=ne(n);if(o===void 0||!Number.isInteger(o)||o<0)throw new Error("Could not compile `Binomial`: only a literal non-negative integer second operand compiles \u2014 anything else is inert in the interpreter.");if(o>Mu)throw new Error(`Could not compile \`Binomial\`: a second operand above ${Mu} would unroll to ${o} factors.`);if(p.isComplexValued(e))throw new Error("Could not compile `Binomial`: a complex first operand has no GPU lowering.");if(D(e)&&!Number.isFinite(e.re)||e.type.matches("infinity")||e.type.matches("nan"))throw new Error("Could not compile `Binomial`: a statically non-finite first operand evaluates to NaN in the interpreter, not a falling factorial.");if(o===0){if(e.isPure===!1)throw new Error("Could not compile `Binomial`: a second operand of 0 discards the first, but an impure (Random) first operand is still drawn by the interpreter.");return Y(1,r.language)}if(o===1)return Le(e,t,r);let i=de("Binomial",e,t,r),s=[`(${i})`];for(let l=1;l<o;l++)s.push(`((${i}) - ${Y(l,r.language)})`);let a=1;for(let l=2;l<=o;l++)a*=l;return`((${s.join(" * ")}) / ${Y(a,r.language)})`};function ud(e){if(b(e,"Square")&&e.ops.length===1||b(e,"Power")&&e.ops.length===2&&ne(e.ops[1])===2)return e.ops[0]}function ju(e,n,t,r){let o=e==="Sum"?"0.0":"1.0",i=e==="Sum"?" + ":" * ";if(n.isCollection&&n.count===0)return o;let s=e==="Sum"?ud(n):void 0,a=s===void 0?void 0:V(s);if(s!==void 0&&s.isPure&&typeof a=="number"&&!p.isComplexValued(n)&&!Fn(n,r.cse?.harvestOptions)&&!r.foldExcludedOps?.has(n.operator)){let d=t(s),g=ye(s,r);if(g&&!p.canHoist(r)&&dn("Sum",[s],r),!we(d)&&p.canHoist(r)){g&&ve("Sum",[s],r);let _=p.tempVar(r),x=r.language==="wgsl"?`vec${a}f`:`vec${a}`,v=r.language==="wgsl"?`var ${_}: ${x}`:`${x} ${_}`;p.hoistStatement(r,`${v} = ${d};`),d=_}return`dot(${d}, ${d})`}let l=V(n),u=t(n),f=Ae(u);if(!(!p.isComplexValued(n)&&(l!=="scalar"||f!==void 0&&$n.test(f.callee))))throw new Error(`Could not compile \`${e}\`: the operand \`${n.toString()}\` is not a collection (type \`${n.type.toString()}\`), so there is nothing to reduce over \u2014 this is the collection form of ${e}, which takes no indexing set.`);let m=ao(n,u,r);if(m===void 0)throw new Error(`Could not compile \`${e}\`: the operand \`${n.toString()}\` lowers to a shader ${We(l)} with no compile-time component list, so there is nothing for the reduction to fold over \u2014 a shader has no dynamic iteration here.`);return`(${m.map(d=>`(${d})`).join(i)})`}function Hi(e,n){let t=p.bigOpBoundConstant(e);if(t!==void 0)return t;let r=p.foldedRealNumber(e,n);if(r===void 0||!Number.isFinite(r)||Math.fround(r)!==r)return;let o=Math.floor(r);return o>=-(2**31)&&o<2**31-1?o:void 0}var fd=new Set(["int","i32","u32","uint","float","f32","floor"]);function Wi(e){let n=e.trim();if(/^-?\d+(?:\.\d*)?$/.test(n)||/^[A-Za-z_]\w*$/.test(n))return!0;let t=/^([A-Za-z_]\w*)\((.*)\)$/.exec(n);if(t===null||!fd.has(t[1]))return!1;let r=t[2],o=0;for(let i of r)if(i==="(")o+=1;else if(i===")"){if(o===0)return!1;o-=1}return o===0&&Wi(r)}function Yi(e,n){let t=[],r=[...n];for(let o=e.length-1;o>=0;o--){let[i,s]=e[o],a=new RegExp(`(?<![\\w$])${i}(?![\\w$])`);r.some(l=>a.test(l))&&(t.unshift(e[o]),r.push(s))}return t}function Ki(e,n,t,r){let o=pe(t,r)??(r?"f32":"float");return r?`let ${e}: ${o} = ${n};`:`${o} ${e} = ${n};`}function lr(e,n){return p.compileValueOperand(e,n,qe.Multiply[1])}var lo=new Set([..."abs acos acosh all any arrayLength asin asinh atan atan2 atanh".split(" "),..."atomicAdd atomicAnd atomicCompareExchangeWeak atomicExchange atomicLoad atomicMax atomicMin atomicOr atomicStore atomicSub atomicXor".split(" "),..."bitcast ceil clamp cos cosh countLeadingZeros countOneBits countTrailingZeros cross degrees determinant distance dot dot4I8Packed dot4U8Packed dpdx dpdxCoarse dpdxFine dpdy dpdyCoarse dpdyFine exp exp2 extractBits faceForward firstLeadingBit firstTrailingBit floor fma fract frexp fwidth fwidthCoarse fwidthFine insertBits inverseSqrt ldexp length log log2 max min mix modf normalize pack2x16float pack2x16snorm pack2x16unorm pack4x8snorm pack4x8unorm pack4xI8 pack4xI8Clamp pack4xU8 pack4xU8Clamp pow quadBroadcast quadSwapDiagonal quadSwapX quadSwapY quantizeToF16 radians reflect refract reverseBits round saturate select sign sin sinh smoothstep sqrt step storageBarrier subgroupAdd subgroupAll subgroupAnd subgroupAny subgroupBallot subgroupBroadcast subgroupBroadcastFirst subgroupElect subgroupExclusiveAdd subgroupExclusiveMul subgroupInclusiveAdd subgroupInclusiveMul subgroupMax subgroupMin subgroupMul subgroupOr subgroupShuffle subgroupShuffleDown subgroupShuffleUp subgroupShuffleXor subgroupXor tan tanh textureBarrier textureDimensions textureGather textureGatherCompare textureLoad textureNumLayers textureNumLevels textureNumSamples textureSample textureSampleBaseClampToEdge textureSampleBias textureSampleCompare textureSampleCompareLevel textureSampleGrad textureSampleLevel textureStore transpose trunc unpack2x16float unpack2x16snorm unpack2x16unorm unpack4x8snorm unpack4x8unorm unpack4xI8 unpack4xU8 workgroupBarrier workgroupUniformLoad".split(" "),..."bool f16 f32 i32 u32 array atomic ptr sampler sampler_comparison buffer_view".split(" "),...[2,3,4].flatMap(e=>["","f","h","i","u"].map(n=>`vec${e}${n}`)),...[2,3,4].flatMap(e=>[2,3,4].flatMap(n=>["","f","h"].map(t=>`mat${e}x${n}${t}`))),..."texture_1d texture_2d texture_2d_array texture_3d texture_cube texture_cube_array texture_depth_2d texture_depth_2d_array texture_depth_cube texture_depth_cube_array texture_depth_multisampled_2d texture_external texture_multisampled_2d texture_storage_1d texture_storage_2d texture_storage_2d_array texture_storage_3d".split(" ")]);function uo(e){let n=te(e);return n==="tuple"||typeof n!="string"&&(n.kind==="tuple"||n.kind==="union")?!1:e.type.matches("indexed_collection<any>")}function cd(e,n,t,r){if(!b(e,"PointList"))return{decline:"the operand is not a symbolic `PointList` application, and only that shape has a statically known point count"};let o=e.ops;if(n>=o.length)return{decline:`the points have arity ${o.length}, so there is no coordinate ${n+1}`};let i;for(let f=0;f<o.length;f++){let c=o[f];if(uo(c)){let m=p.aggregateComponentCount(c);if(m===void 0)return{decline:`source component ${f+1} (type \`${c.type.toString()}\`) has no statically known length, and a shader vector must have one`};if(m<2||m>4)return{decline:`source component ${f+1} has ${m} elements, and a shader vector holds 2 to 4`};i=i===void 0?m:Math.min(i,m)}else if(!q(te(c),"number"))return{decline:`component ${f+1} (type \`${c.type.toString()}\`) is neither a list source nor a provably scalar numeric slot, so it has no \`vecN\` broadcast`}}if(i===void 0)return{decline:"no component is a list source, so this is not a point LIST"};for(let f=0;f<o.length;f++)if(f!==n&&!o[f].isPure)return{decline:`component ${f+1} is impure, and the projection would discard it unevaluated`};let s=o[n];if(!uo(s))return`${r.language==="wgsl"?`vec${i}f`:`vec${i}`}(${t(s)})`;let a=p.aggregateComponentCount(s),l=t(s);if(a===i)return l;let u="xyzw".slice(0,i);return we(l)?`${l}.${u}`:`(${l}).${u}`}function ur(e,n){return new Error(`Could not compile \`${e}\`: its value has the type \`${n.type.toString()}\`, which has no shader type, and the calls of the functions that give such a value would be written out more than ${$l} times. If the value reads a symbol that can be a point or a list of points, declare that symbol with the point type (\`tuple<real, real>\`).`)}function Ft(e,n){let t=n!==void 0&&n>=2&&n<=4?n:2;return`ce.declare('${e}', 'tuple<${Array(t).fill("real").join(", ")}>')`}function Zi(e,n,t,r,o=!1){let i=Ft(n,r.arity);return`Could not compile \`${e}\`: "${n}" has the type \`${t.type.toString()}\`, which admits a point and a list of points. A shader value cannot be both: a point is a vector (\`vec2\`, \`vec3\`, \`vec4\`) and a list of points is an array. `+(o?`Declare "${n}" as a point (\`${i}\`).`:`Declare "${n}" as a point (\`${i}\`), or assign a point to "${n}" and do not map it with \`vars\`, so that the shader uses its value.`)}function pd(e,n){return n.boundVars?.has(e)===!0?!0:n.varsKeys?.has(e)!==!0&&n.var(e)!==void 0}function fo(e,n,t,r){let o=n==="x"?0:n==="y"?1:2,i=`Point${n.toUpperCase()}`,s=C(e)?on(e.type.type):void 0;if(s!==void 0&&C(e)){let u=pd(e.symbol,r),f=p.localShapeFrameOf(e.symbol)?.get(e.symbol);if(u&&f!==void 0&&f>=2&&f<=4){if(f<=o)throw new Error(`Could not compile \`${i}\`: the point has arity ${f} \u2014 no ${["first","second","third"][o]} coordinate.`);return Dn(t(e),n)}throw new Error(Zi(i,e.symbol,e,s,u))}if(!C(e)&&on(e.type.type)!==void 0)throw new Error(`Could not compile \`${i}\`: \`${e.toString()}\` has the type \`${e.type.toString()}\`, which admits a point and a list of points. A shader value cannot be both: a point is a vector (\`vec2\`, \`vec3\`, \`vec4\`) and a list of points is an array. Make the value a point (a tuple such as \`tuple<real, real>\`).`);let a=te(e),l=typeof a!="string"?a.kind==="tuple"?a.elements.length:a.kind==="list"&&a.dimensions?.length===1&&a.dimensions[0]>=2&&a.dimensions[0]<=4&&a.elements!==void 0&&q(a.elements,"number")?a.dimensions[0]:void 0:void 0;if(l===void 0&&e.type.matches("indexed_collection<any>")){let u=cd(e,o,t,r);if(typeof u=="string")return u;throw new Error(`Could not compile \`Point${n.toUpperCase()}\`: a list of points has no GPU lowering (a point must be a single vec2/vec3/vec4): ${u.decline}.`)}if(l!==void 0&&l<=o)throw new Error(`Could not compile \`Point${n.toUpperCase()}\`: the point has arity ${l} \u2014 no ${["first","second","third"][o]} coordinate.`);return Dn(t(e),n)}function Dn(e,n){let t=e.trim();if(t===Ie(NaN))return n.length===1?t:`vec${n.length}(${t})`;if(we(t))return`${t}.${n}`;let r=/^[A-Za-z_]\w*\(/.exec(t);if(r!==null&&t.endsWith(")")){let o=0,i=!0;for(let s=r[0].length-1;s<t.length;s++)if(t[s]==="(")o+=1;else if(t[s]===")"&&(o-=1,o===0&&s!==t.length-1)){i=!1;break}if(i)return`${t}.${n}`}return`(${t}).${n}`}function Xi(e){if(b(e,"List")||b(e,"Tuple")){let t=e.ops;for(let r=0;r<t.length;r++){if(p.isNonScalarShape(t[r]))return`element ${r+1} of the base is itself an aggregate (type \`${t[r].type.toString()}\`), so it is not one component of a shader vector`;if(!q(te(t[r]),"number"))return`element ${r+1} of the base (type \`${t[r].type.toString()}\`) is not provably scalar numeric, and a shader value has no other element domain here`}return}let n=te(e);if(typeof n!="string"){if(n.kind==="tuple"){for(let t=0;t<n.elements.length;t++)if(!Cn(n.elements[t].type))return`slot ${t+1} of the base tuple (type \`${Ce(n.elements[t].type)}\`) is not a REAL scalar \u2014 a shader vector's components are single floats, and a shader value has no other element domain here`;return}if(n.kind==="list")return Cn(n.elements)?void 0:`the base's element type \`${Ce(n.elements)}\` is not a REAL scalar \u2014 a shader vector's components are single floats, and a shader value has no other element domain here`}return`the base (type \`${e.type.toString()}\`) states no element type, so its elements are not provably scalar numeric`}function dd(e){if(!C(e)||p.localShapeFrameOf(e.symbol)===void 0)return"unframed";let n=Oe(e);if(n?.value!==void 0&&n.value.element!=="f")return`the base is declared "${n.spelling}" by the caller, whose components are not floats \u2014 a positional shader access reads one float component, and neither language converts between the component types`}function po(e){let n=Oe(e);if(n===void 0){if(C(e)&&p.isLocalBoolean(e.symbol))return{decline:"the index is a shader `bool`, and a positional access indexes by a number \u2014 neither language converts a boolean to one"};if(C(e)&&p.localShapeFrameOf(e.symbol)){let r=p.aggregateComponentCount(e);if(r!==void 0)return{decline:`the index is the local name "${e.symbol}", which holds an aggregate of ${r} components, not a scalar number \u2014 a positional shader access indexes by a float, and neither language converts an aggregate to one`}}return}let t=n.value;return t===void 0||t.width>1||t.element==="b"?{decline:`the index is declared "${n.spelling}" by the caller, which is not a scalar number \u2014 a positional shader access indexes by a float, and neither language converts to one implicitly`}:t.element==="f"||Bn(t)?void 0:{cast:!0}}function md(e,n){let t=e.symbol,r=n==="uniform-struct"?`the base "${t}" is a list parameter of the uniform parameter struct`:`the base "${t}" is ${n}-backed (storage hint)`;if(p.localShapeFrameOf(t)!==void 0)return{decline:`${r}, but here "${t}" is a declared or local name whose shape comes from its declaration, not from the engine type the hint applies to \u2014 a name with a storage hint must be a free symbol of the expression`};let o=Gn(e.type.type),i=e.type.toString();if(typeof o=="string"||o.kind!=="list")return{decline:`${r}, which requires a one-dimensional fixed-length list of numbers, but its type is \`${i}\``};let s=o.dimensions??[];if(s.length>1)return{decline:`${r}, which requires a ONE-dimensional list laid out in the texture, but its type \`${i}\` is ${s.length}-dimensional`};let a=s[0]??-1;if(a<0)return{decline:`${r}, but its type \`${i}\` states no static length, and the texture read bounds the index by the list's declared length`};if(a===0)return{decline:`${r}, but its type \`${i}\` is an empty list, which has no element to read`};let l=Xi(e);return l!==void 0?{decline:`${r}, and ${l}`}:{count:a,storage:n}}function Du(e,n){if(e===null)return{decline:"it has no base operand"};if(C(e)){let a=n.storage?.get(e.symbol);if(a!==void 0)return md(e,a)}let t=te(e);if(C(e,"Missing")||C(e,"Undefined")||t==="missing")return{decline:"the base is the absence marker (`Missing` or `Undefined`), which has no shader value to index into"};if(!b(e,"List")&&!b(e,"Tuple")&&p.isComplexValued(e))return{decline:"the base is a complex value (lowered as `vec2(re, im)` by the complex convention), not an indexable collection"};if(b(e,"Dictionary")||typeof t!="string"&&(t.kind==="dictionary"||t.kind==="record"))return{decline:`the base is a dictionary (type \`${e.type.toString()}\`) and a shader has no keyed lookup \u2014 only positional access into a value of static shape`};if(t==="tuple")return{decline:"the base is an unparameterized `tuple`, which states no arity, so there is no static element count to index against"};let r=p.aggregateComponentCount(e),o=!1;if(r===void 0&&b(e)&&e.operator!=="List"&&e.operator!=="Tuple"){let a=e.type.type,l=p.typeWithFreeInputsAsNumbers(e,n);l!==a&&(r=Lt(l),o=r!==void 0)}if(r===void 0){if(C(e)){let a=Oe(e);if(a!==void 0&&a.value===void 0)return{decline:`the base is the caller-declared name "${e.symbol}", whose declared shader type \`${a.spelling}\` is not one this target reads \u2014 it parses the scalar spellings and the two-to-four component vector spellings of both languages (\`vec3\`, \`ivec3\`, \`vec3f\`, \`vec3<f32>\`), and no array, matrix or struct type. The declaration decides the shape of a declared name, so no static element count reaches the analysis (the engine type \`${e.type.toString()}\` is not consulted for a declared name)`}}return typeof t!="string"&&t.kind==="list"?(t.dimensions?.length??0)>=2?{decline:`the base (type \`${e.type.toString()}\`) is multi-axis; only a one-dimensional base has a positional shader lowering`}:{decline:`the base (type \`${e.type.toString()}\`) has no statically known length, and a shader value must have one`}:{decline:`the base (type \`${e.type.toString()}\`) is not a statically counted collection`}}if(r<0)return{decline:`the base (type \`${e.type.toString()}\`) has no statically known length, and a shader value must have one`};if(r===0)return{decline:"the base is empty, and neither shader language has a zero-length value type"};if(r===1)return{decline:"the base has 1 element: there is no `vec1`, and a 1-element aggregate has no shader value shape of its own"};if(o)return{count:r};let i=dd(e);if(i!=="unframed")return i===void 0?{count:r}:{decline:i};let s=Xi(e);return s!==void 0?{decline:s}:{count:r}}function mo(e,n){if(!Number.isInteger(e)||e===0)return null;let t=e>0?e-1:n+e;return t>=0&&t<n?t:null}function ho(e,n,t,r){if(b(e,"List")||b(e,"Tuple"))return r(e.ops[n]);let o=r(e),i=t<=4?`.${"xyzw"[n]}`:`[${n}]`;return we(o)?`${o}${i}`:`(${o})${i}`}function Vu(e,n,t){return!(b(e,"List")||b(e,"Tuple"))&&t<=4&&n.every(o=>o!==null)}function qu(e,n,t){return Vu(e,n,t)?1:n.filter(r=>r!==null).length}function Hu(e,n,t,r,o){if(Vu(e,n,t)){let a=r(e),l=n.map(u=>"xyzw"[u]).join("");return we(a)?`${a}.${l}`:`(${a}).${l}`}let i=o.language==="wgsl"?`vec${n.length}f`:`vec${n.length}`,s=n.map(a=>a===null?ce(o):ho(e,a,t,r));return`${i}(${s.join(", ")})`}function Wu(e){return C(e,"True")||C(e,"False")?"bool":D(e)?!e.isComplex&&Number.isInteger(e.re)?"int":"other-literal":en(e)||C(e,"Missing")||C(e,"Undefined")||b(e,"List")||b(e,"Tuple")||b(e,"Dictionary")?"other-literal":q(te(e),"boolean")?"dyn-bool":"dyn"}function Yu(e,n,t){let r=t.language==="wgsl",o=l=>r?`vec${l}f`:`vec${l}`,i=(l,u,f)=>r?`array<vec${l}f, ${u}>(${f.join(", ")})`:`vec${l}[${u}](${f.join(", ")})`;if(b(e,"PointList")){let l=e.ops;if(l.length<2||l.length>4)return{decline:`the points of the base have ${l.length} coordinates, and a shader vector holds 2 to 4`};let u,f=[];for(let d=0;d<l.length;d++){let g=l[d];if(uo(g)){let _=p.aggregateComponentCount(g);if(_===void 0||_<1)return{decline:`source component ${d+1} of the point list (type \`${g.type.toString()}\`) has no statically known length, and a shader array must have one`};let x=Xi(g);if(x!==void 0)return{decline:`in source component ${d+1}, ${x}`};if(!g.isPure)return{decline:`source component ${d+1} of the point list is impure, and the array of points references it once per point`};f.push(_),u=u===void 0?_:Math.min(u,_)}else{if(!q(te(g),"number")||p.isComplexValued(g))return{decline:`component ${d+1} of the point list (type \`${g.type.toString()}\`) is neither a list source nor a provably real scalar`};if(!g.isPure)return{decline:`component ${d+1} of the point list is impure, and the array of points references it once per point`};f.push(void 0)}}if(u===void 0)return{decline:"no component is a list source, so this is not a point LIST"};let c=u,m=d=>`${o(l.length)}(${l.map((g,_)=>f[_]===void 0?n(g):ho(g,d,f[_],n)).join(", ")})`;return{m:l.length,n:c,point:m,source:()=>i(l.length,c,Array.from({length:c},(d,g)=>m(g)))}}let s=Kr(te(e));if(typeof s!="number")return s;let a=b(e,"List")?e.nops:p.aggregateComponentCount(e);return a===void 0||a<1?{decline:`the base (type \`${e.type.toString()}\`) has no statically known number of points, and a shader array must have one`}:{m:s,n:a,point:l=>{if(b(e,"List"))return n(e.ops[l]);let u=n(e);return we(u)?`${u}[${l}]`:`(${u})[${l}]`},source:()=>n(e)}}function Ku(e,n,t,r,o,i){let{m:s,n:a}=e,l=o.language==="wgsl",u=`${l?`vec${s}f`:`vec${s}`}(${ce(o)})`;if((b(t,"List")||q(te(t),vn))&&i("the index is a collection, so the result is a list of points, which has no shader value shape here"),C(t,"Missing")||C(t,"Undefined")||q(te(t),"missing"))return n.isPure||i("the access folds to a vector of NaN components, which would DISCARD the impure base unevaluated"),u;if((p.isComplexValued(t)||!Se(te(t),"number"))&&i(`the index (type \`${t.type.toString()}\`) is not a real number, so it selects no point`),D(t)&&n.isPure){let x=mo(t.re,a);return x===null?u:e.point(x)}let f=po(t);f!==void 0&&"decline"in f&&i(f.decline);let c=r(t),m=f===void 0?c:`${l?"f32":"float"}(${c})`,d=s===2?8:16,g=ns(n,a,d,r,o);if(g!==void 0&&"name"in g)return`_gpu_atp_${g.name}_${s}_${a}(${m})`;l&&_o(n,a,d,i);let _=g!==void 0?g.code:e.source();return`_gpu_atp${s}_${a}(${_}, ${m})`}function Zu(e,n,t){let r=t?"wgsl":"glsl",o=Ie(NaN,r),{guard:i,doc:s}=kn(n,r);return t?`
fn _gpu_atp${e}_${n}(v: array<vec${e}f, ${n}>, i: f32) -> vec${e}f {
${s}
  if (${i}) {
    return vec${e}f(${o});
  }
  let k = i32(i);
  var a = v;
  return a[select(${n} + k, k - 1, k > 0)];
}
`:`
vec${e} _gpu_atp${e}_${n}(vec${e} v[${n}], float i) {
${s}
  if (${i})
    return vec${e}(${o});
  int k = int(i);
  return v[(k > 0) ? k - 1 : ${n} + k];
}
`}function Xu(e){let n=new Map,t=/(?<![\w$])_gpu_atp([234])_(\d+)\s*\(/g,r;for(;(r=t.exec(e))!==null;)n.set(`${r[1]}_${r[2]}`,[Number(r[1]),Number(r[2])]);return[...n.values()]}function qn(e,n){return e!=null&&C(e)&&n.storage?.get(e.symbol)==="storage-buffer"&&!Ji(e.symbol,n)}function Ji(e,n){return n.boundVars?.has(e)===!0||p.localShapeFrameOf(e)!==void 0}function hd(e){let t=`the list "${e.symbol}" is in a storage buffer (storage hint)`,r=Gn(e.type.type),o=e.type.toString();if(typeof r=="string"||r.kind!=="list")return{decline:`${t}, which requires a list of numbers or of points, but its type is \`${o}\``};if((r.dimensions?.length??0)>1)return{decline:`${t}, which requires a ONE-dimensional list, but its type \`${o}\` has ${r.dimensions.length} dimensions`};let i=X(r.elements);if(typeof i!="string"&&i.kind==="tuple"){let s=i.elements.length;return s>=2&&s<=4&&i.elements.every(a=>Cn(a.type))?s:{decline:`${t}, and its elements (type \`${Ce(r.elements)}\`) are not points of 2 to 4 real coordinates, which is the element shape of a storage-buffer list besides a real number`}}return Cn(r.elements)?1:{decline:`${t}, and its element type \`${Ce(r.elements)}\` is not a real number or a point of 2 to 4 real coordinates; a complex number, a boolean, a string or a nested list has no storage-buffer layout`}}function go(e,n,t,r){let o=l=>{throw new Error(`Could not compile \`${r}\`: ${l}.`)};t.language!=="wgsl"&&o(`the list "${e.symbol}" is in a storage buffer (storage hint), and the ${t.language??"GPU"} target has no storage buffers`),(p.localShapeFrameOf(e.symbol)!==void 0||t.boundVars?.has(e.symbol))&&o(`the list "${e.symbol}" is in a storage buffer (storage hint), but here "${e.symbol}" is a local or bound name, not the free symbol of the expression that the hint applies to`);let i=hd(e);typeof i!="number"&&o(i.decline);let s=Qi(e,n);(!/^[A-Za-z_]\w*$/.test(s)||s.startsWith("_gpu_"))&&o(`the list "${e.symbol}" is in a storage buffer (storage hint) and maps to \`${s}\`, which is not a plain identifier without the reserved prefix \`_gpu_\`; the compilation declares the buffer under that name`),s.startsWith("CE_List_")&&o(`the list "${e.symbol}" is in a storage buffer (storage hint) and maps to \`${s}\`, which starts with \`CE_List_\`, the prefix of the struct names that the compilation declares for its buffers`),lo.has(s)&&o(`the list "${e.symbol}" is in a storage buffer (storage hint) and maps to \`${s}\`, which is a predeclared function or type of WGSL; a buffer declared under that name hides the built-in that the compiled code calls`);let a=t.storageBuffersRead;if(a!==void 0){for(let[l,u]of a)l!==e.symbol&&u.name===s&&o(`the lists "${l}" and "${e.symbol}" are in storage buffers (storage hint) and both map to \`${s}\`; each buffer needs its own WGSL name`);a.set(e.symbol,{name:s,components:i})}return{name:s,components:i}}function Ju(e,n,t,r,o){(b(n,"List")||q(te(n),vn)&&!q(te(n),"string"))&&o(`the index is a collection, and the list "${e.symbol}" is in a storage buffer, whose length is known only at run time; only a scalar index has a lowering`),(C(n,"Missing")||C(n,"Undefined")||p.isComplexValued(n)||!Se(te(n),"number"))&&o(`the index (type \`${n.type.toString()}\`) is not a real number, so it selects no element`);let i=po(n);i!==void 0&&"decline"in i&&o(i.decline);let{name:s,components:a}=go(e,t,r,"At");if(D(n)){let f=n.re;if(!Number.isInteger(f)||Math.fround(f)!==f){let c=ce(r);return a===1?c:`vec${a}f(${c})`}}let l=D(n)?Y(n.re,r.language):t(n),u=i===void 0?l:`f32(${l})`;return`${ai(s,a)}(${u})`}function fr(e,n,t,r,o){let i=t[0];if(t.length!==1||!qn(i,o))throw new Error(`Could not compile \`${e}\`: an operand is a list in a storage buffer, and only \`${e}\` of that list alone has a lowering`);let{name:s,components:a}=go(i,r,o,e);if(a!==1)throw new Error(`Could not compile \`${e}\`: the list "${i.symbol}" in a storage buffer holds points, and only a list of numbers has a reduction; read the points with \`At\``);return`${li(n,s)}()`}function Qu(e,n,t){let r=[];for(let[o,i]of n??[]){let s=t.get(o);s===void 0||!Vl(e,s.name)||r.push(Bl(o,s.name,i,s.components))}return{layouts:r,declarations:r.length>0?jl(r):""}}var co;function Qi(e,n){let t=co;co=e.symbol;try{return n(e)}finally{co=t}}function es(e,n,t){let r=n.get(e);if(!(r===void 0||co===e))throw r==="uniform-struct"?new Error(`Could not compile \`${e}\`: the list parameter is packed in the uniform parameter struct of \`compileFieldFunction()\` as an array of \`vec4f\`, which is not a value of the list's own type: it can be read only through a positional access (\`At(${e}, i)\`). Here it is referenced as a whole \u2014 as an operand, in a reduction, or as a bare value \u2014 which has no lowering.`):r==="storage-buffer"?new Error(`Could not compile \`${e}\`: the symbol is a list in a storage buffer (compile option \`storage: { ${e}: { kind: 'storage-buffer', \u2026 } }\`), whose length is known only at run time, and a shader value must have a length known at compile time. On the ${t} target it can be read only through \`At(${e}, i)\`, \`Length(${e})\`, and \`Sum\`, \`Product\`, \`Max\`, \`Min\` or \`Mean\` of \`${e}\` alone. Here it is referenced as a whole (as an operand, an argument or a bare value), which has no lowering.`):new Error(`Could not compile \`${e}\`: the symbol is ${r}-backed (compile option \`storage: { ${e}: '${r}' }\`), and a texture has no shader value of its own on the ${t} target: it can be read only through a positional access (\`At(${e}, i)\`). Here it is referenced as a whole \u2014 as an operand, in a reduction, or as a bare value \u2014 which has no lowering.`)}function ef(e,n){let t=n?"wgsl":"glsl",r=Ie(NaN,t),{guard:o,doc:i}=kn(e,t);if(n){let a=e<=4?`v: vec${e}f`:`v: array<f32, ${e}>`,l=e<=4?"":`  var a = v;
`,u=e<=4?"v":"a";return`
fn _gpu_at${e}(${a}, i: f32) -> f32 {
${i}
  if (${o}) {
    return ${r};
  }
  let k = i32(i);
${l}  return ${u}[select(${e} + k, k - 1, k > 0)];
}
`}let s=e<=4?`vec${e} v`:`float v[${e}]`;return`
float _gpu_at${e}(${s}, float i) {
${i}
  if (${o})
    return ${r};
  int k = int(i);
  return v[(k > 0) ? k - 1 : ${e} + k];
}
`}var Vn=8192;function ns(e,n,t,r,o){if(o.language!=="wgsl"||n*t<=Vn||!C(e)||o.boundVars?.has(e.symbol)||o.inputLocals?.has(e.symbol)||o.storage?.get(e.symbol)!==void 0)return;let i=r(e);return/^[A-Za-z_]\w*$/.test(i)&&!i.startsWith("_gpu_")?{name:i}:{code:i}}function ts(e){let n=/^array<(f32|vec([234])f), (\d+)>$/.exec(e);return n===null?void 0:(n[2]===void 0?4:n[2]==="2"?8:16)*Number(n[3])}function _o(e,n,t,r){let o=n*t;if(o<=Vn)return;let i=C(e)?`"${e.symbol}"`:"the base",s=C(e)?e.symbol:"S";r(`the read copies ${i} (${n} elements, ${o} bytes) into a function-scope variable, and WGSL guarantees only ${Vn} bytes of them per function. A free list symbol of this size is read with no copy when it, or the identifier \`vars\` maps it to, is a \`var<storage>\` declaration; use the storage kind 'storage-buffer' (\`storage: { ${s}: { kind: 'storage-buffer', group, binding } }\`) to read it from a storage buffer`)}function nf(e,n){let t=Ie(NaN,"wgsl"),{guard:r,doc:o}=kn(n,"wgsl","_gpu_i");return`
fn _gpu_at_${e}_${n}(_gpu_i: f32) -> f32 {
${o}
  if (${r}) {
    return ${t};
  }
  let _gpu_k = i32(_gpu_i);
  return ${e}[select(${n} + _gpu_k, _gpu_k - 1, _gpu_k > 0)];
}
`}function tf(e,n,t){let r=Ie(NaN,"wgsl"),{guard:o,doc:i}=kn(t,"wgsl","_gpu_i");return`
fn _gpu_atp_${e}_${n}_${t}(_gpu_i: f32) -> vec${n}f {
${i}
  if (${o}) {
    return vec${n}f(${r});
  }
  let _gpu_k = i32(_gpu_i);
  return ${e}[select(${t} + _gpu_k, _gpu_k - 1, _gpu_k > 0)];
}
`}function rf(e){let n=new Set,t=[],r=[],o=/(?<![\w$])_gpu_at_([A-Za-z_]\w*?)_(\d+)\s*\(/g,i;for(;(i=o.exec(e))!==null;){let a=`n:${i[1]}_${i[2]}`;n.has(a)||(n.add(a),t.push([i[1],Number(i[2])]))}let s=/(?<![\w$])_gpu_atp_([A-Za-z_]\w*?)_([234])_(\d+)\s*\(/g;for(;(i=s.exec(e))!==null;){let a=`p:${i[1]}_${i[2]}_${i[3]}`;n.has(a)||(n.add(a),r.push([i[1],Number(i[2]),Number(i[3])]))}return{numbers:t,points:r}}function kn(e,n,t="i"){let r=Y(e,n);return{guard:`!(${t} >= -${r} && ${t} <= ${r}) || ${t} != floor(${t}) || ${t} == 0.0`,doc:`  // 1-based; negative counts from the end; anything else \u2192 NaN.
  // The guard runs entirely in float space: it rejects NaN, \xB1\u221E, huge
  // finite values, non-integers and 0 BEFORE the int cast (undefined
  // outside int range), and makes both languages' out-of-bounds rules
  // (GLSL UB / WGSL indeterminate) unreachable.`}}function of(e){let n=Ie(NaN,"glsl"),{guard:t,doc:r}=kn(e,"glsl");return`
float _gpu_texat${e}(sampler2D v, float i) {
${r}
  if (${t})
    return ${n};
  int k = int(i);
  k = (k > 0) ? k - 1 : ${e} + k;
  // Row-major in a texture of run-time width; the host guarantees at least
  // ${e} texels, so the coordinate is in range whenever the guard passed.
  int w = textureSize(v, 0).x;
  return texelFetch(v, ivec2(k % w, k / w), 0).r;
}
`}function sf(e){return ff(e,/(?<![\w$])_gpu_at(\d+)\s*\(/g)}function af(e,n){let t=Ie(NaN,"wgsl"),{guard:r,doc:o}=kn(n,"wgsl","_gpu_i");return`
fn _gpu_texat_${e}_${n}(_gpu_i: f32) -> f32 {
${o}
  if (${r}) {
    return ${t};
  }
  var _gpu_k = i32(_gpu_i);
  _gpu_k = select(${n} + _gpu_k, _gpu_k - 1, _gpu_k > 0);
  // Row-major in a texture of run-time width; the host guarantees at least
  // ${n} texels, so the coordinate is in range whenever the guard passed.
  let _gpu_w = i32(textureDimensions(${e}, 0).x);
  return textureLoad(${e}, vec2i(_gpu_k % _gpu_w, _gpu_k / _gpu_w), 0).r;
}
`}function lf(e){return ff(e,/(?<![\w$])_gpu_texat(\d+)\s*\(/g)}function uf(e){let n=new Set,t=[],r=/(?<![\w$])_gpu_texat_([A-Za-z_]\w*?)_(\d+)\s*\(/g,o;for(;(o=r.exec(e))!==null;){let i=`${o[1]}_${o[2]}`;n.has(i)||(n.add(i),t.push([o[1],Number(o[2])]))}return t}function ff(e,n){let t=new Set,r;for(;(r=n.exec(e))!==null;)t.add(Number(r[1]));return[...t].sort((o,i)=>o-i)}var gd=new Set(["attribute","const","uniform","varying","buffer","shared","coherent","volatile","restrict","readonly","writeonly","layout","centroid","flat","smooth","noperspective","patch","sample","in","out","inout","precision","invariant","precise","subroutine","lowp","mediump","highp","struct","break","continue","do","for","while","switch","case","default","if","else","discard","return","void","bool","int","uint","float","double","vec2","vec3","vec4","dvec2","dvec3","dvec4","bvec2","bvec3","bvec4","ivec2","ivec3","ivec4","uvec2","uvec3","uvec4","mat2","mat3","mat4","mat2x2","mat2x3","mat2x4","mat3x2","mat3x3","mat3x4","mat4x2","mat4x3","mat4x4","dmat2","dmat3","dmat4","sampler2D","sampler3D","samplerCube","sampler2DArray","sampler2DShadow","samplerCubeShadow","isampler2D","usampler2D","atomic_uint","image2D","true","false","filter","texture","asm","class","union","enum","typedef","template","this","packed","goto","inline","noinline","public","static","extern","external","interface","long","short","half","fixed","unsigned","superp","input","output","hvec2","hvec3","hvec4","fvec2","fvec3","fvec4","sizeof","cast","namespace","using"]),_d=new Set(["alias","break","case","const","const_assert","continue","continuing","default","diagnostic","discard","else","enable","false","fn","for","if","let","loop","override","requires","return","struct","switch","true","var","while","bool","f16","f32","i32","u32","vec2","vec3","vec4","vec2f","vec3f","vec4f","vec2i","vec3i","vec4i","vec2u","vec3u","vec4u","mat2x2","mat2x3","mat2x4","mat3x2","mat3x3","mat3x4","mat4x2","mat4x3","mat4x4","array","atomic","ptr","sampler","sampler_comparison","texture_1d","texture_2d","texture_2d_array","texture_3d","texture_cube","texture_cube_array","texture_multisampled_2d","function","private","workgroup","uniform","storage","read","write","read_write","texture","sample","filter","as","async","attribute","auto","binding","cast","compile","do","enum","extern","external","inline","instance","interface","match","namespace","new","null","of","operator","public","reference","self","set","shared","static","super","template","this","typedef","union","unless","using","virtual","where"]);function bd(e){return e==="wgsl"?_d:e==="glsl"?gd:new Set}function je(e,n){if(bd(n).has(e))throw new Error(`"${e}" is a reserved word in ${n??"this shader language"} and cannot be used as a variable name. Rename it before compiling to a GPU target (fail closed, D6).`);return e}var cf={vertex:new Set(["gl_VertexID","gl_InstanceID","gl_Position","gl_PointSize","gl_ClipDistance","gl_DepthRange"]),fragment:new Set(["gl_FragCoord","gl_FrontFacing","gl_PointCoord","gl_FragDepth","gl_PrimitiveID","gl_SampleID","gl_SamplePosition","gl_Layer","gl_ViewportIndex","gl_ClipDistance","gl_DepthRange"]),compute:new Set(["gl_NumWorkGroups","gl_WorkGroupID","gl_LocalInvocationID","gl_GlobalInvocationID","gl_LocalInvocationIndex","gl_WorkGroupSize"])},pf={vertex:[{name:"gl_Position",type:"vec4"},{name:"gl_PointSize",type:"float"}],fragment:[{name:"gl_FragDepth",type:"float"}]},df={vertex:{gl_VertexID:"int",gl_InstanceID:"int",gl_Position:"vec4",gl_PointSize:"float",gl_ClipDistance:"float[]"},fragment:{gl_FragCoord:"vec4",gl_FrontFacing:"bool",gl_PointCoord:"vec2",gl_FragDepth:"float",gl_PrimitiveID:"int",gl_SampleID:"int",gl_SamplePosition:"vec2",gl_Layer:"int",gl_ViewportIndex:"int",gl_ClipDistance:"float[]"}};var mf=new Map,yd=/^(?:fn[^\S\n]+([A-Za-z_]\w*)|(?:(?:highp|mediump|lowp)[^\S\n]+)?[A-Za-z_]\w*(?:\[\d+\])?[^\S\n]+([A-Za-z_]\w*))[^\S\n]*\(/;function vd(e){let n=mf.get(e);if(n!==void 0)return n;let t=[],r=[],o="",i,s=0;for(let a of e.split(`
`)){if(r.length===0&&a.trim()===""){o+=`
`;continue}r.push(a);let l=a.replace(/\/\/.*$/,"");if(i===void 0){let u=yd.exec(l);u!==null&&(i=u[1]??u[2])}for(let u of l)u==="{"?s+=1:u==="}"&&(s-=1);i!==void 0&&s===0&&l.includes("}")&&(t.push({name:i,source:r.join(`
`),lead:o,reference:new RegExp(`(?<![\\w$])${i}(?![\\w$])`),calls:[]}),r=[],o="",i=void 0)}for(let a=0;a<t.length;a++)for(let l=0;l<a;l++)t[l].reference.test(t[a].source)&&t[a].calls.push(l);return mf.set(e,t),t}function _e(e,n){let t=vd(n),r=t.map(i=>i.reference.test(e));for(let i=t.length-1;i>=0;i--)if(r[i])for(let s of t[i].calls)r[s]=!0;let o="";for(let i of t.filter((s,a)=>r[a]))o+=`${o===""?i.lead||`
`:i.lead}${i.source}
`;return o}function cr(e,n,t,r,o,i=1){let s=typeof e=="string"?e:"Round",a=(w,z)=>typeof e=="string"?`${e}(${w})`:e(w,z),l=ne(t);if(l!==void 0&&(l===0||!Number.isFinite(l)))throw new Error(`Could not compile \`${s}\` with a step of ${l}: the result is NaN, and the ${o.language??"GPU"} target has no NaN literal.`);let u=l!==void 0?Y(Math.abs(l),o.language):`abs(${de(s,t,r,o)})`;if(V(n)==="scalar"){let w=de(s,n,r,o);return`_gpu_step_fix(${`${a(`${i===1?"_gpu_step_quotient":"_gpu_half_step_quotient"}(${w}, ${u})`,!0)} * ${u}`}, ${w}, ${u})`}let f=V(n);if(typeof f!="number")throw new Error(`Could not compile \`${s}\` with a step: the operand is not a scalar or a vector.`);let c=o.language==="wgsl",m=ae(f,c),d=(w,z,G,h,L)=>{if(c)return`select(${w}, ${z}, ${G} ${h} ${L})`;let y={"<=":"lessThanEqual",">":"greaterThan","==":"equal"}[h];return`mix(${w}, ${z}, ${y}(${G}, ${L}))`},g=p.canHoist(o),_=(w,z)=>{if(!g||/^[A-Za-z_]\w*$/.test(w))return w;let G=p.tempVar(o);return p.hoistStatement(o,c?`var ${G}: ${z} = ${w};`:`${z} ${G} = ${w};`),G},x=_(de(s,n,r,o),m),v=l!==void 0?u:_(u,En(c)),E=_(`(${x} / ${v})`,m),S=l!==void 0?"1.17549435e-38":c?`select(0.0, 1.17549435e-38, ${v} < 3.4e38)`:`(${v} < 3.4e38 ? 1.17549435e-38 : 0.0)`,$=_(d(E,`(sign(${x}) * ${S})`,E,"==",`${m}(0.0)`),m),N=i===1?`round(${$})`:`(round(${$} * 2.0) * 0.5)`,I=_(d($,N,`abs(${$} - ${N})`,"<=",`4.8e-7 * abs(${$})`),m),O=`(${a(I,!1)} * ${v})`,F=l!==void 0?`abs(${E})`:`(abs(${E}) * sign(${v}))`;return`(${d(O,x,F,">",`${m}(3.4e38)`)})`}function bo(e,n,t,r){if(n==="to-even")return r?`round(${e})`:`roundEven(${e})`;if(t)return`${{"away-from-zero":"_gpu_round","toward-zero":"_gpu_round_tz","toward-positive-infinity":"_gpu_round_up","toward-negative-infinity":"_gpu_round_down"}[n]}(${e})`;let o=l=>`ceil(0.5 + 0.5 * sign(${l} - 0.5))`,i=l=>`floor(0.5 + 0.5 * sign(${l} - 0.5))`,s=/^[\w.]+$/.test(e)?e:`(${e})`,a=`floor(abs(${e}))`;switch(n){case"away-from-zero":return`(sign(${e}) * (${a} + ${o(`abs(${e}) - ${a}`)}))`;case"toward-zero":return`(sign(${e}) * (${a} + ${i(`abs(${e}) - ${a}`)}))`;case"toward-positive-infinity":return`(floor(${e}) + ${o(`${s} - floor(${e})`)})`;case"toward-negative-infinity":return`(ceil(${e}) - ${o(`ceil(${e}) - ${s}`)})`}}function hf(e,n){let t=ae(e,n);return n?`
fn _gpu_powi${e}(x: ${t}, n: f32) -> ${t} {
  if (n == 0.0) { return ${t}(1.0); }
  if (n == 2.0) { return x * x; }
  if (n == 3.0) { return x * x * x; }
  if (n == 4.0) { let s = x * x; return s * s; }
  let r = pow(abs(x), ${t}(n));
  if ((abs(n) % 2.0) == 1.0) { return select(${t}(1.0), ${t}(-1.0), x < ${t}(0.0)) * r; }
  return r;
}
`:`
${t} _gpu_powi${e}(${t} x, float n) {
  if (n == 0.0) return ${t}(1.0);
  if (n == 2.0) return x * x;
  if (n == 3.0) return x * x * x;
  if (n == 4.0) { ${t} s = x * x; return s * s; }
  ${t} r = pow(abs(x), ${t}(n));
  if (mod(abs(n), 2.0) == 1.0) return mix(${t}(1.0), ${t}(-1.0), lessThan(x, ${t}(0.0))) * r;
  return r;
}
`}function gf(e){let n=/(?<![\w$])_gpu_powi\s*\(/.test(e),t=new Set,r=/(?<![\w$])_gpu_powi([234])\s*\(/g,o;for(;(o=r.exec(e))!==null;)t.add(Number(o[1]));return[...n?["scalar"]:[],...[...t].sort((i,s)=>i-s)]}var yo=[2,3,4];function _f(e){return(e?[["_gpu_fmod","f32"],...yo.map(t=>[`_gpu_fmod${t}`,`vec${t}f`])]:[["_gpu_fmod","float"],...yo.map(t=>[`_gpu_fmod${t}`,`vec${t}`])]).map(([t,r])=>e?`fn ${t}(x: ${r}, y: ${r}) -> ${r} {
  let r = x % y;
  let p = sign(r) * sign(y);
  return (r - y * ((p - abs(p)) * 0.5)) % y;
}`:`${r} ${t}(${r} x, ${r} y) {
  ${r} r = mod(mod(x, y), y);
  r = r + y * (1.0 - step(0.0, r * sign(y)));
  return r - y * step(abs(y), r * sign(y));
}`).join(`
`)}var rs=`
${_f(!1)}
`,os=`
${_f(!0)}
`;function pr(e,n,t,r){if(p.isComplexValued(e)||p.isComplexValued(n))return;let o=r.language==="wgsl",i=V(e),s=V(n),a=m=>m==="scalar"||typeof m=="number";if(!a(i)||!a(s))return;if(i==="scalar"&&s==="scalar")return`_gpu_fmod(${t(e)}, ${t(n)})`;if(typeof i=="number"&&typeof s=="number"&&i!==s)return;let l=typeof i=="number"?i:s,u=ae(l,o),f=i==="scalar"?`${u}(${t(e)})`:t(e),c=s==="scalar"?`${u}(${t(n)})`:t(n);return`_gpu_fmod${l}(${f}, ${c})`}var is=`
fn _gpu_tanh(x: f32) -> f32 {
  return select(tanh(x), sign(x), abs(x) > 10.0);
}
${yo.map(e=>`fn _gpu_tanh${e}(x: vec${e}f) -> vec${e}f {
  return select(tanh(x), sign(x), abs(x) > vec${e}f(10.0));
}`).join(`
`)}
`;function ss(e,n,t){if(t.language!=="wgsl")return`tanh(${n(e)})`;let r=V(e);return r==="scalar"?`_gpu_tanh(${n(e)})`:typeof r=="number"?`_gpu_tanh${r}(${n(e)})`:`tanh(${n(e)})`}function bf(e){let n="0x7FFFFFFFu",t="0x7F800000u",r=[1,...yo],o=u=>u===1?"":`${u}`,i=(u,f)=>`_gpu_isnan${o(u)}(${f})`,s=(u,f,c,m)=>e?`select(${f}, ${c}, ${m})`:u===1?`(${m} ? ${c} : ${f})`:`mix(${f}, ${c}, ${m})`,a=[];for(let u of r){let f=e?u===1?"f32":`vec${u}f`:u===1?"float":`vec${u}`;for(let[c,m,d]of[["_gpu_isnan",">","greaterThan"],["_gpu_isnonfinite",">=","greaterThanEqual"]]){let g=`${c}${o(u)}`;if(e){let _=u===1?"u32":`vec${u}u`,x=u===1?"bool":`vec${u}<bool>`,v=E=>u===1?E:`${_}(${E})`;a.push(`fn ${g}(x: ${f}) -> ${x} {
  return (bitcast<${_}>(x) & ${v(n)}) ${m} ${v(t)};
}`)}else u===1?a.push(`bool ${g}(float x) {
  return (floatBitsToUint(x) & ${n}) ${m} ${t};
}`):a.push(`bvec${u} ${g}(vec${u} x) {
  return ${d}(floatBitsToUint(x) & ${n}, uvec${u}(${t}));
}`)}}let l=(u,f,c,m)=>e?`fn ${u}(${f.map(d=>`${d}: ${c}`).join(", ")}) -> ${c} {
  return ${m};
}`:`${c} ${u}(${f.map(d=>`${c} ${d}`).join(", ")}) {
  return ${m};
}`;for(let u of r){let f=e?u===1?"f32":`vec${u}f`:u===1?"float":`vec${u}`,c=o(u);for(let x of["max","min"])a.push(l(`_gpu_${x}${c}`,["a","b"],f,s(u,s(u,`${x}(a, b)`,"b",i(u,"b")),"a",i(u,"a"))));a.push(l(`_gpu_clamp${c}`,["x","lo","hi"],f,s(u,s(u,s(u,"min(max(x, lo), hi)","hi",i(u,"hi")),"lo",i(u,"lo")),"x",i(u,"x")))),a.push(l(`_gpu_sign${c}`,["x"],f,s(u,"sign(x)","x",i(u,"x"))));for(let x of["sin","cos"]){let v=`_gpu_isnonfinite${c}(x)`;if(e){let E=u===1?"bitcast<f32>(bits)":`${f}(bitcast<f32>(bits))`;a.push(`fn _gpu_${x}${c}(x: ${f}) -> ${f} {
  let bits = 0x7fc00000u;
  return select(${x}(x), ${E}, ${v});
}`)}else{let E=u===1?"intBitsToFloat(0x7FC00000)":`${f}(intBitsToFloat(0x7FC00000))`;a.push(l(`_gpu_${x}${c}`,["x"],f,s(u,`${x}(x)`,E,v)))}}let m=x=>u===1?x:`${f}(${x})`;a.push(l(`_gpu_hermite${c}`,["t"],f,`t * t * (${m("3.0")} - 2.0 * t)`));let d=e||u===1?"e0 == e1":"equal(e0, e1)",g=e||u===1?"x < e0":"lessThan(x, e0)",_=s(u,`_gpu_hermite${c}(min(max((x - e0) / (e1 - e0), ${m("0.0")}), ${m("1.0")}))`,s(u,m("1.0"),m("0.0"),g),d);a.push(l(`_gpu_smoothstep${c}`,["e0","e1","x"],f,s(u,s(u,s(u,_,"x",i(u,"x")),"e1",i(u,"e1")),"e0",i(u,"e0"))))}return a.join(`
`)}function Ln(e,n,t,r){if(xd.test(t)||ln(n,r,!0))return`${e}(${t})`;let o=V(n);return o==="scalar"?`_gpu_${e}(${t})`:typeof o=="number"?`_gpu_${e}${o}(${t})`:`${e}(${t})`}var xd=/^\(?-?\d+(?:\.\d*)?(?:e[-+]?\d+)?\)?$/,as=`
${bf(!1)}
`,ls=`
${bf(!0)}
`;function us(e,n,t,r,o){if(t.length!==3||t.some(u=>u==null)||t.some(u=>p.isComplexValued(u)))return;let i=t.map(V);if(e==="clamp"&&i.every(u=>u==="scalar")&&t.every(u=>ln(u,o,!0))){let[u,f,c]=t.map(m=>r(m));return`min(max(${u}, ${f}), ${c})`}if(i.every(u=>u==="scalar"))return`_gpu_${e}(${t.map(u=>r(u)).join(", ")})`;let s=i[n];if(typeof s!="number"||!i.every(u=>u==="scalar"||u===s))return;let a=ae(s,o.language==="wgsl"),l=t.map((u,f)=>i[f]==="scalar"?`${a}(${r(u)})`:r(u));return e==="clamp"&&t.every(u=>ln(u,o,!0))?`min(max(${l[0]}, ${l[1]}), ${l[2]})`:`_gpu_${e}${s}(${l.join(", ")})`}function dr(e,n,t,r){return`${e}(${be(n,t,r)})`}var yf=new Set(["Rgb","Hsv","Hsl","Oklab","Oklch"]),vf=new Set(["oklch","oklab","lab","rgb","hsl","hsv"]);function fs(e,n,t){let r=e.slice(0,3),o=`${He(t)}(${r.map(s=>n(s)).join(", ")})`;return r.every(s=>D(s)&&s.im===0&&Number.isFinite(s.re))?o:`_gpu_finite_color(${o})`}function De(e,n,t,r){if(b(n,"List"))throw new Error(`Could not compile \`${e}\`: a list is not a color \u2014 a color operand must be a color, a color string or a tuple of 3 or 4 components.`);if(!b(n)||n.operator!=="Tuple"){if(yt(n))throw new Error(`Could not compile \`${e}\`: this operator takes a COLOR, and a tuple is color COMPONENTS, not a color. Build a color from the components first \u2014 \`AsRgb((r, g, b))\` reads them as 0-1 sRGB, and \`ColorFromColorspace(components, space)\` reads them in any named space.`);if(ul(n))throw new Error(`Could not compile \`${e}\`: cannot settle the color space of the operand at compile time \u2014 it holds a converted color at one of the positions its value comes from, and a shader color is a bare vector with no run-time tag, so the channels cannot be converted back to OKLCh.`);return C(n)&&r?.loweredSymbolType!==void 0&&Zr.get(r.loweredSymbolType)?.add(n.symbol),wd(t(n),Nr(n))}let o=n.ops;if(o.length<3||o.length>4)throw new Error(`Could not compile \`${e}\`: a tuple of ${o.length} components is not a color \u2014 a color tuple has 3 components, or 4 with the fourth read as alpha.`);return An(e,o),sn(o.slice(0,3),He(r)),`_gpu_srgb_to_oklch(${He(r)}(${o.slice(0,3).map(i=>t(i)).join(", ")}))`}function ot(e,n,t,r){if(!(b(n)&&n.operator==="Tuple")&&yt(n)){let i=p.aggregateComponentCount(n);if(i===4&&xf(e),i!==void 0&&i!==3)throw new Error(`Could not compile \`${e}\`: a tuple of ${i} components is not a color \u2014 color components are 3 channels, or 4 with the fourth read as alpha.`);return`_gpu_srgb_to_oklch(${t(n)})`}return De(e,n,t,r)}function wd(e,n){switch(n){case"rgb":return`_gpu_srgb_to_oklch(${e})`;case"oklab":return`_gpu_oklab_to_oklch(${e})`;case"hsl":return`_gpu_srgb_to_oklch(_gpu_hsl_to_rgb(${e}))`;case"hsv":return`_gpu_srgb_to_oklch(_gpu_hsv_to_rgb(${e}))`;default:return e}}function An(e,n){n.length<=3||xf(e)}function xf(e){throw new Error(`Could not compile \`${e}\`: an alpha (4th) operand is not representable on the GPU target \u2014 color values are \`vec3\` (OKLCh) end to end, with no alpha channel. Drop the alpha operand and pass it separately (e.g. as a uniform) at the framebuffer boundary.`)}var cs=new WeakMap;function ps(){return{frames:[],counters:0,spatialCounter:void 0,stage:void 0,hostFrame:!1,varNames:void 0}}function $f(e){let n={};e.gpuRandomRoot=n,cs.set(n,ps())}function Rn(e){let n=e.gpuRandomRoot??e,t=cs.get(n);return t===void 0&&(t=ps(),cs.set(n,t)),t}function Ef(e){let n=Rn(e);n.frames.length=0,n.counters=0,n.spatialCounter=void 0,p.resetNaming(e)}function ds(e){return`_gpu_rnd_n${e.counters++}`}var it="_gpu_rnd_n";function $d(e,n){return n==="wgsl"?`&${e}`:e}function wf(e,n,t){let r=i=>`0x${(i>>>0).toString(16).padStart(8,"0")}u`;return`${t==="wgsl"?"vec2<u32>":"uvec2"}(${r(e)}, ${r(n)})`}function mr(e){let n=Ed(e),t=Sn;if(t===void 0)return n;t.inline&&(t.reordered=!0);let r=[...p.compileParents()];if(t.last!==void 0&&!xu(t.last,r)&&(t.reordered=!0),t.last=r,!Xe(e))return t.inline=!0,n;let o=r[r.length-1],i=o!==void 0&&b(o)?o.op1:void 0;if((o===void 0||!b(o)?[]:b(o,"Random")&&b(i,"Interval")?i.ops.map(l=>b(l,"Open")||b(l,"Closed")?l.op1:l):o.ops).some(l=>!xt(l,e)&&ye(l,e)))throw new Error("Could not compile `Random`: an operand of the draw contains code supplied by the caller (a `vars` source, a `functions` or `operators` entry, or a `compile` handler), and the draw, bound to a temporary ahead of the statement, would run before that code.");ve("Random",o===void 0?void 0:[o],e,!0);let a=p.tempVar(e);return p.hoistStatement(e,e.language==="wgsl"?`let ${a}: f32 = ${n};`:`float ${a} = ${n};`),a}function Ed(e){let n=Rn(e),t=e.language,r=n.frames[n.frames.length-1];if(r!==void 0)return`_gpu_rnd_draw(${r.seed}, ${$d(r.counter,t)})`;if(n.hostFrame)throw new Error("Could not compile `Random()`: an unframed draw has no shader form while a host `WithRandomSeed` frame is active \u2014 a shader invocation cannot share the host's mutable draw counter, and fragments run in parallel. GPU frames must be LEXICAL: move the `WithRandomSeed(seed, \u2026)` inside the compiled expression.");if(t==="wgsl")throw new Error("Could not compile `Random()`: an unframed draw has no WGSL form \u2014 a shader has no live random stream, and WGSL has no `gl_FragCoord` built-in to derive spatial noise from. Wrap the draw in `WithRandomSeed(seed, \u2026)`, whose seed may be an invocation-varying expression.");if(n.stage!==void 0&&n.stage!=="fragment")throw new Error(`Could not compile \`Random()\`: an unframed draw compiles to \`gl_FragCoord\`-derived spatial noise, which exists only in a fragment shader (this is a \`${n.stage}\` shader). Wrap the draw in \`WithRandomSeed(seed, \u2026)\` to get a stage-independent stream.`);return n.spatialCounter??=ds(n),`_gpu_rnd_draw(uvec2(floatBitsToUint(gl_FragCoord.x), floatBitsToUint(gl_FragCoord.y)), ${n.spatialCounter})`}function Cf(e){let n=new Set,t=new Set,r=(s,a)=>{if(t.has(a))return;t.add(a);let l=s.engine;if(l===void 0)return;let u=p.userFunctionLiteral(l,a);u!==void 0&&u.ops.length>0&&i(u.ops[0])},o=new Set,i=s=>{if(!o.has(s)){if(o.add(s),C(s)){bt(s)||Lr(s)?n.add(s.symbol):r(s,s.symbol);return}if(b(s)){typeof s.operator=="string"&&s.operator!==""&&r(s,s.operator);for(let a of s.ops)i(a)}}};return e!==void 0&&i(e),n}function Sf(e){let n=new Map,t=new Set,r=new Set,o=(a,l)=>{if(t.has(l))return;t.add(l);let u=a.engine;if(u===void 0)return;let f=p.userFunctionLiteral(u,l);f!==void 0&&f.ops.length>0&&s(f.ops[0])},i=new Set,s=a=>{if(!i.has(a)){if(i.add(a),C(a)){let l=on(a.type.type);l!==void 0&&!n.has(a.symbol)&&n.set(a.symbol,Zi(a.symbol,a.symbol,a,l));let u=l===void 0&&!n.has(a.symbol)?Jt(a.type.type):void 0;if(u!==void 0&&n.set(a.symbol,`Could not compile \`${a.symbol}\`: "${a.symbol}" has the type \`${a.type.toString()}\`, and ${u}. A shader can read a tuple of 2 to 4 real numbers (a point) as a vector, and a longer tuple of real numbers as an array.`),o(a,a.symbol),!r.has(a.symbol)){r.add(a.symbol);let f=a.engine?._getSymbolValue(a.symbol);f!==void 0&&s(f)}return}if(b(a)){typeof a.operator=="string"&&a.operator!==""&&o(a,a.operator);for(let l of a.ops)s(l)}}};return e!==void 0&&s(e),n}function zf(e,n,t,r,o){if(o().has(n))return!1;for(let i of Object.keys(r)){if(i===t)continue;if(i===n)return!1;let s=r[i];if(typeof s!="string")continue;let a=s.trim();if(a===e||a===n)return!1}return!0}function Pf(e,n,t){for(let r of Object.keys(e)){if(!t().has(r))continue;let o=e[r];if(typeof o!="string")continue;let i=/^\s*([A-Za-z_][A-Za-z0-9_]*)(?:\.[A-Za-z_][A-Za-z0-9_]*|\[[0-9]+\])*\s*$/.exec(o)?.[1];if(!(i===void 0||i===r)&&n().has(i))throw new Error(`Could not compile: the \`vars\` entry for \`${r}\` reads the uniform \`${i}\`, but the compiled code declares or writes the symbol \`${i}\`, which the shader emits with the same name. The shader would read that variable instead of the uniform. Rename the uniform or the symbol.`)}}function hr(e,n){let t=n.language??"GPU";return`${e} is not supported on the ${t} target: a shader expression has no general collection indexing. Only \`Random()\`, \`Random(Interval(a, b))\` and \`Random(Range(\u2026))\` compile \u2014 the closed-form domains.`}function kf(e,n,t){if(b(e,"Interval")){if(e.nops!==2)throw new Error("Random(Interval(a, b)): expects two endpoints");let r=f=>b(f,"Open")||b(f,"Closed")?f.op1:f,o=r(e.op1),i=r(e.op2);for(let[f,c]of[["lower",o],["upper",i]])if(!c.canonical.isPure)throw new Error(`Could not compile \`Random(Interval(a, b))\`: the ${f} endpoint is not pure \u2014 a shader expression has no statement to evaluate it into once, so the endpoint is spliced (and would run) more than once per draw. Hoist the draw out of the endpoint.`);let s=ne(o),a=ne(i);if(s!==void 0&&a!==void 0){if(!(a>s))throw new Error(`Random(Interval(${s}, ${a})): the interval is empty or reversed \u2014 there is no uniform distribution to draw from.`);return`(${he(s)} + ${mr(t)} * ${he(a-s)})`}if(dn("Random",[o],t),!xt(i,t)&&ye(i,t))throw new Error("Could not compile `Random(Interval(a, b))`: the upper endpoint contains code supplied by the caller (a `vars` source, a `functions` or `operators` entry, or a `compile` handler), and the draw would run before that code.");let l=n(o),u=n(i);return`((${l}) + ${mr(t)} * ((${u}) - (${l})))`}if(b(e,"Range")){let r=Ga(e);if(r===void 0||!Number.isFinite(r))throw new Error("Could not compile `Random(Range(\u2026))`: the GPU target requires a Range with constant, finite bounds \u2014 a symbolic or unbounded range has no known element count to draw from.");if(r===0)throw new Error("Random(Range(\u2026)): the range is empty (no elements).");let o=e.ops,i,s;if(o.length===1?(i=1,s=1):o.length===2?(i=o[0].re,s=o[1].re>=o[0].re?1:-1):(i=o[0].re,s=o[2].re),!Number.isFinite(i)||!Number.isFinite(s))throw new Error("Random(Range(\u2026)): the GPU target requires constant numeric bounds.");let a=`floor(${mr(t)} * ${he(r)})`,l=s<0?"-":"+",u=Math.abs(s);return u===1?`(${he(i)} ${l} ${a})`:`(${he(i)} ${l} ${he(u)} * ${a})`}throw new Error(hr("Random(collection)",t))}function Lf(e,n,t){let r=t.language;if(en(e)){let[u,f]=Uo(e.string);return wf(u,f,r)}if(e.type.matches("string"))throw new Error("Could not compile `WithRandomSeed(seed, \u2026)`: a string seed that is not a compile-time literal cannot be folded in a shader \u2014 GLSL and WGSL have no strings. Use a literal string, a numeric seed, or fold the seed on the host.");let o=e.canonical;if(!o.isPure)throw new Error("Could not compile `WithRandomSeed(seed, \u2026)`: the seed expression is not pure \u2014 the folded seed is spliced at EVERY draw site of the frame, so it would be evaluated once per draw. Use a compile-time constant or a single shader-supplied symbol.");let i=ne(o)??ne(o.N());if(i!==void 0){let[u,f]=Uo(i);return wf(u,f,r)}let s=C(o)?o.symbol:void 0;if(s===void 0)throw new Error("Could not compile `WithRandomSeed(seed, \u2026)`: a COMPUTED seed expression has no shader form \u2014 the folded seed is spliced at every draw site of the frame, so it would be recomputed per draw. Use a compile-time constant seed (host-identical stream) or a single shader-supplied symbol (its own stream).");let a=t.var(s);if(a!==void 0)throw Rn(t).varNames?.has(s)?new Error(`Could not compile \`WithRandomSeed(${s}, \u2026)\`: a seed supplied through \`vars\` (\`${s}\` \u2192 \`${a}\`) is the HOST-UNIFORM row of the seed ABI, which is not implemented: the host folds an f64 seed with \`foldSeed\` into TWO words, while a shader can only reinterpret the f32 bits it receives (\`seedHi = 0u\`), so the shader would silently draw a DIFFERENT stream than the host. Use either a compile-time literal seed \u2014 the host-identical stream \u2014 or an explicitly invocation-varying seed symbol that is NOT in \`vars\`, which owns its own stream.`):new Error(`Could not compile \`WithRandomSeed(${s}, \u2026)\`: the seed resolves to the shader constant \`${a}\`, which the seed ABI cannot fold. Use a compile-time numeric or string seed.`);let l=n(o).trim();return r==="wgsl"?`vec2<u32>(bitcast<u32>(${l}), 0u)`:`uvec2(floatBitsToUint(${l}), 0u)`}var st=256;function at(e,n){if(!(n<=st))throw new gt({code:"inline-collection-too-large",kind:"capability",message:`Could not compile \`${e}\`: a constant collection of ${n} elements is above the ${st} elements a shader array constructor takes on this target. Ship the collection as a texture (a \`storage: sampler2D\` input, read with \`At\`) instead.`})}function Rf(e,n,t,r){let o=g=>{throw new Error(`Could not compile \`${e}\`: ${g}`)};p.isComplexValued(n)&&o(`a complex-valued operand (\`${n.toString()}\`) is lowered as a \`vec2\` of (re, im), which has no element-wise reading \u2014 a componentwise shader builtin would treat its real and imaginary parts as two independent elements.`),Ue(n)===void 0&&o(`the operand \`${n.toString()}\` has no static vec2\u2013vec4 shape (an unknown-length list, a matrix, or a 5+-element list), so it is not a shader vector and the componentwise builtins do not apply to it.`);let i=t.collection(),s=(sl(n,r)||ye(n,r))&&!/^[A-Za-z_]\w*$/.test(i);if(e==="Square")return/^[A-Za-z_]\w*$/.test(i)?`(${i} * ${i})`:Nt(i,2,V(n));let a=t.element(i),l=`_gpu_tanh(${i})`;if(a===l||a===`(1.0 / ${l})`)return a.replace(l,`_gpu_tanh${Ue(n)}(${i})`);let u=Ue(n),f=ln(n,r,!0),c=a,m=a;for(let g of Zl){let _=`_gpu_${g}(${i})`;c=c.split(_).join(f?`${g}(${i})`:`_gpu_${g}${u}(${i})`),m=m.split(_).join(i)}s&&c.split(i).length>2&&o(`the operand \`${n.toString()}\` draws a random value or contains code supplied by the caller, and the lowering \`${a}\` uses it more than once, so each use would run that code again.`);let d=Ci(m.split(i).join("_operand"),"_operand");return d!==void 0&&o(`the scalar shader lowering \`${a}\` is not componentwise \u2014 ${d} A shader has no element loop, so a non-componentwise lowering cannot be broadcast over a \`vecN\` at all.`),c}function vo(e,n,t,r){let o={First:1,Second:2,Third:3,Last:-1}[e],i=te(n),s=f=>typeof f!="string"&&f.kind==="tuple"&&f.elements.length>=2&&f.elements.length<=4&&f.elements.every(c=>q(c.type,"boolean"))?f.elements.length:void 0,a,l=Oe(n),u=l?.value;if(u!==void 0&&u.element==="b"&&u.width>=2&&u.width<=4)a=u.width;else if(l===void 0&&C(n)&&s(i)!==void 0)a=s(i);else if(l===void 0&&(b(n,"At")||b(n,"When")||b(n,"If")||b(n,"Which"))&&typeof i!="string"&&i.kind==="union"&&i.types.includes("missing")){let f=X(Qe({kind:"union",types:i.types.filter(c=>c!=="missing")}));typeof f!="string"&&f.kind==="tuple"&&f.elements.length>=2&&f.elements.length<=4&&Jt(f)===void 0&&s(f)===void 0&&(a=f.elements.length)}if(a!==void 0){let f=o===-1?a:o;if(f>a)throw new Error(`Could not compile \`${e}\`: the operand (type \`${n.type.toString()}\`) is a vector of ${a} components, which has no element at the position ${f}.`);return Dn(t(n),"xyzw"[f-1])}try{return Tf([n,n.engine.number(o)],t,r)}catch(f){throw f instanceof Error&&!(f instanceof gt)&&f.message.startsWith("Could not compile `At`: ")?new Error(`Could not compile \`${e}\` (read as \`At\` with the index ${o}): `+f.message.slice(24)):f}}function Tf(e,n,t){let r=y=>{throw new Error(`Could not compile \`At\`: ${y}.`)};e.length<2&&r("it has no index operand"),e.length>2&&r(`this lowering reads one index, and it was given ${e.length-1}. The compiler rewrites a chained access \`At(x, i, j)\` to the nested access \`At(At(x, i), j)\` before it calls this lowering`);let o=e[0],i=e[1];if(qn(o,t))return Ju(o,i,n,t,r);let s=C(o)&&t.storage?.get(o.symbol)!==void 0?void 0:Yu(o,n,t);if(s!==void 0)return"decline"in s&&r(s.decline),!o.isPure&&!i.isPure&&r("both the base and the index are impure, and neither shader language specifies the order in which a call evaluates its arguments"),Ku(s,o,i,n,t,r);let a=Du(o,t);"decline"in a&&r(a.decline);let l=a.count,u=t.language==="wgsl",f=a.storage,c,m=y=>{if(f==="uniform-struct"&&t.storageRead!==void 0)return t.storageRead(o.symbol,l,y);c??=Qi(o,n);let k=c;return u?(/^[A-Za-z_]\w*$/.test(k)||r(`the base "${o.symbol}" is ${f}-backed (storage hint) and maps to \`${k}\`, which is not a plain identifier; a WGSL texture is a module-scope binding and the texel-read helper names it directly`),`_gpu_texat_${k}_${l}(${y})`):`_gpu_texat${l}(${k}, ${y})`};!o.isPure&&!i.isPure&&r("both the base and the index are impure, and neither shader language specifies the order in which a call evaluates its arguments");let d=b(o,"List")||b(o,"Tuple")?o.ops:void 0,g=d!==void 0,_=y=>{o.isPure||r(y)},x=(y,k)=>{let A=d;for(let R=0;R<A.length;R++){if(A[R].isPure)continue;let T=y.filter(U=>U===R).length;T===0&&r(`element ${R+1} of the literal base is impure and the ${k} does not select it, so folding would discard it unevaluated`),T>1&&r(`element ${R+1} of the literal base is impure and the ${k} selects it ${T} times, which would evaluate it more than once`)}},v=y=>{(y==="base"?o:i).isPure||r(`the access folds to the NaN spelling, which would DISCARD the impure ${y} unevaluated`)};if(b(i,"List")){let y=i.ops,k=y.map(Wu),A=k.indexOf("other-literal");A>=0&&r(`entry ${A+1} of the index list (\`${y[A].toString()}\`) is a literal that is not an integer, so it selects no element and the list is not an index gather at all`);let R=new Set(k),T=R.has("int")||R.has("dyn"),U=R.has("bool")||R.has("dyn-bool");T&&U&&r("the index list mixes integer entries with boolean ones, so it is neither a gather nor a mask"),R.has("dyn-bool")&&r("the index is a boolean mask with runtime-valued entries: its result LENGTH depends on how many of them are true at run time, so it has no static shader value shape. This shape has no shader lowering at all \u2014 it is not a missing tier");let M;if(R.has("bool"))y.length!==l&&r(`the index is a boolean mask of length ${y.length}, but the base has ${l} elements \u2014 a mask's length must equal the collection's`),M=[],y.forEach((W,ue)=>{C(W,"True")&&M.push(ue)});else if(R.has("dyn")){let W=k.filter(ue=>ue==="dyn").length;r(`the index list has ${W} runtime-valued integer ${W===1?"entry":"entries"}; a static-count DYNAMIC gather is not lowered in this version (no witness requested it yet) \u2014 the helpers it needs are the same ones the scalar form already emits`),M=[]}else M=y.map(W=>mo(W.re,l));let j=M.length;if(j===0&&r("the index selects 0 elements, and neither shader language has a zero-length value type"),j===1&&r("the index selects exactly 1 element, which CE types as a 1-element LIST (pinned: `At(L, [2])` \u2192 `[20]`), and no shader value has that shape \u2014 there is no `vec1`"),j>4&&r(`the index selects ${j} elements, so the RESULT would be a \`vec${j}\`, and a shader vector holds 2 to 4`),f!==void 0){let W=u?`vec${j}f`:`vec${j}`,ue=M.map(ie=>ie===null?ce(t):m(Y(ie+1,t.language)));return`${W}(${ue.join(", ")})`}if(g)x(M.filter(W=>W!==null),"gather");else{let W=qu(o,M,l);W===0?_("the gather selects no element of the base, so its emission would DISCARD the impure base unevaluated"):W>1&&_("the gather emits a constructor that references the impure base more than once, which would evaluate it more than once")}return Hu(o,M,l,n,t)}let E=te(i);if(C(i,"Missing")||C(i,"Undefined")||q(E,"missing"))return v("base"),v("index"),ce(t);en(i)&&r("the index is a string key, and only a dictionary base takes one \u2014 a positional shader access indexes by number"),p.isComplexValued(i)&&r("the index is a complex value, which lowers to a `vec2(re, im)`; the interpreter reads its real part, and a shader has no such reading of a vector in an index position");let S=po(i);if(S!==void 0&&"decline"in S&&r(S.decline),D(i)){let y=mo(i.re,l);return y===null?(v("base"),ce(t)):f!==void 0?m(Y(i.re,t.language)):(g&&x([y],"access"),ho(o,y,l,n))}if(q(E,vn)&&!q(E,"string")){let y=p.aggregateComponentCount(i);(y===void 0||y<0)&&r(`the index is a collection (type \`${i.type.toString()}\`) with no statically known length, so there is no static count to emit a result shape against`),r(`the index is a collection of ${y} runtime-valued entries; a static-count DYNAMIC gather is not lowered in this version (no witness requested it yet)`)}Se(E,"number")||r(`the index (type \`${i.type.toString()}\`) is provably not a number, so it selects no element and \`At\` has no value to project`);let $=f===void 0?ns(o,l,4,n,t):void 0,N=$!==void 0&&"name"in $?$.name:void 0,I=$!==void 0&&"code"in $?$.code:void 0,O=()=>I??=n(o),F=C(o)&&!t.boundVars?.has(o.symbol)&&t.inputLocals?.has(o.symbol)===!0,w=C(o)&&Wa(o.symbol,t.boundVars)?t.var(o.symbol):void 0,z=w!==void 0&&/^[A-Za-z_]\w*$/.test(w),G=di(i,t,y=>!t.foldExcludedOps?.has(y)&&t.operators?.(y)===qe[y]&&t.functions?.(y)===Tn[y]);if(f===void 0&&G&&G.min>=1&&G.max<=l&&(t.language!=="wgsl"||l<=4||N!==void 0||F||z||p.canHoist(t)&&!tn.has(t.hoist))){if(N!==void 0)return`${N}[${G.code} - 1]`;let y=O();if(t.language==="wgsl"&&l>4&&!F&&!(z&&y===w)){_o(o,l,4,r),(!p.canHoist(t)||tn.has(t.hoist))&&r("WGSL indexes a list value with a run-time index only after it copies the list to a local variable, and this position has no place for the statement of that copy");let k=p.foldValueImpure(o);k&&Ye("At",[o],t),ve("At",[o],t);let A=p.tempVar(t);p.hoistStatement(t,`var ${A} = ${y};`),k&&Be([o],t),y=A}return`${we(y)?y:`(${y})`}[${G.code} - 1]`}let h=n(i),L=S===void 0?h:`${u?"f32":"float"}(${h})`;return N!==void 0?`_gpu_at_${N}_${l}(${L})`:f===void 0||!C(o)?(u&&l>4&&_o(o,l,4,r),`_gpu_at${l}(${O()}, ${L})`):m(L)}function Gf(e,n,t,r=0){if(r>64)return!1;if(D(e))return!0;if(C(e)){if(e.symbol===n||t.storage?.get(e.symbol)!==void 0&&!Ji(e.symbol,t))return!0;let s=t.var(e.symbol);return!t.varsKeys?.has(e.symbol)&&(s===void 0||we(s))}if(!b(e)||!e.isPure||Fn(e)||t.foldExcludedOps?.has(e.operator))return!1;let o=Tn[e.operator],i=qe[e.operator];return o===void 0&&i===void 0||t.functions?.(e.operator)!==o||i!==void 0&&t.operators?.(e.operator)!==i?!1:e.ops.every(s=>Gf(s,n,t,r+1))}function Af(e,n,t,r){if(!n[0])throw new Error(`Could not compile \`${e}\`: no body`);if(!n[1]&&qn(n[0],r))return fr(e,e==="Sum"?"sum":"prod",n,t,r);if(!n[1])return ju(e,n[0],t,r);if(p.assertScalarBigOpBody(e,n[0]),n.length>2)throw new Error(`Could not compile \`${e}\`: multi-index (${n.length-1} indexing sets) is not supported in GPU targets`);let o=n[1];if(!b(o,"Limits"))throw new Error(`Could not compile \`${e}\`: expected Limits indexing set`);let i=o.ops,s=C(i[0])?i[0].symbol:"_",a=p.isComplexValuedUnderIndices(n[0],[s]),l=K=>p.withRealLoopIndices([s],K);Vi(e,i[1],"lower"),Vi(e,i[2],"upper");let u=Hi(i[1],r),f=Hi(i[2],r);p.assertSafeBigOpBounds(e,[i[1],i[2]],r);let c=e==="Sum",m=c?"+":"*",d=r.language==="wgsl",g=re(r),_=a?void 0:l(()=>p.aggregateComponentCount(n[0]));if(_!==void 0&&(_<2||_>4))throw new Error(`Could not compile \`${e}\`: each term is a list of ${_} elements, and a shader has no accumulator for a list of that length (only a vector of 2 to 4 components).`);let x=a?`${g}(${c?"0.0":"1.0"}, 0.0)`:_!==void 0?`${ae(_,d)}(${c?"0.0":"1.0"})`:c?"0.0":"1.0",v=a?ae(2,d):_!==void 0?ae(_,d):d?"f32":"float",E=(K,Q)=>a&&!c?`_gpu_cmul(${K}, ${Q})`:`${K} ${m} ${Q}`,S=u!==void 0&&f!==void 0;if(S&&u>f)return x;let $=Gf(n[0],s,r);if(S&&Fr(f-u+1,$t(n[0]),Ou)){let K=Q=>{let Z=r.hoist?.stmts,H=Z?.length??0,P=[],B=0,se=0;for(let oe=u;oe<=f;oe++){let Ge=he(oe),Ne=p.withBoundScope(r,[s]),Ot=Ne.boundVars,_n={stmts:[],boundVars:Ot,unit:n[0]},Kn={...r,var:Ut=>Ut===s?Ge:r.var(Ut),...Ne,hoist:p.canHoist(r)?_n:void 0,gpuParameterFacts:Fi(n[0],s,oe,oe,r)};$&&ci(Kn,s,oe,oe,String(oe));let bn;try{bn=l(()=>p.compileValueOperand(n[0],Kn))}finally{pi(Kn)}if(_n.stmts.length===0){B+=1,P.push(`(${bn})`);continue}if(se+=1,p.foldValueImpure(n[0])&&Ye(e,[n[0]],r),ve(e,[n[0]],r),/^[A-Za-z_$][\w$]*$/.test(bn)){p.hoistStatement(r,..._n.stmts),p.foldValueImpure(n[0])&&Be([n[0]],r),P.push(`(${bn})`);continue}let Zn=p.tempVar(r),$r=d?`var ${Zn}: ${v}`:`${v} ${Zn}`;p.hoistStatement(r,..._n.stmts,`${$r} = ${bn};`),p.foldValueImpure(n[0])&&Be([n[0]],r),P.push(`(${Zn})`)}if(B>0&&se>0&&ye(n[0],r))throw new Error(`Could not compile \`${e}\`: some unrolled terms are computed in statements ahead of the expression and others stay in it, and code supplied by the caller (a \`vars\` source, a \`functions\` or \`operators\` entry, or a \`compile\` handler) in the terms would then run out of the order of the interpreter.`);let le=`(${P.reduce((oe,Ge)=>E(oe,Ge))})`;return Z!==void 0&&Q.length>0&&Z.splice(H,0,...Yi(Q,[le,...Z.slice(H)]).map(([oe,Ge,Ne])=>Ki(oe,Ge,Ne,d))),le};return p.canHoist(r)?p.hoistLoopInvariants(n[0],[s],r,K,Q=>pe(Q,d)!==void 0).result:K([])}let N=p.tempVar(r),I=d?"i32":"int",O=-(2**31),F=2**31-1;for(let[K,Q,Z]of[["lower",u,F],["upper",f,F-1]])if(Q!==void 0&&(Q<O||Q>Z))throw new Error(`Could not compile \`${e}\`: the ${K} bound ${Q} is outside the range of the 32-bit loop counter (${O} to ${Z}).`);let w=p.withBoundScope(r,[s]),z=w.boundVars,G={stmts:[],boundVars:z,unit:n[0]},h={...r,var:K=>K===s?d?`f32(${s})`:`float(${s})`:r.var(K),...w,hoist:G,gpuParameterFacts:Fi(n[0],s,u,f,r)};$&&S&&ci(h,s,u,f,s);let{bindings:L,result:y}=p.hoistLoopInvariants(n[0],[s],r,()=>l(()=>{try{return r.cse?.enabled?(p.openCseSession(n[0],h,r.cse.harvestOptions),p.compileCseRoot(n[0],h,0,()=>p.compileValueOperand(n[0],h))):p.compileValueOperand(n[0],h)}finally{pi(h)}}),K=>pe(K,d)!==void 0),k=(K,Q)=>{let Z=Oe(K),H=Z?.value;if(Z===void 0||H!==void 0&&H.width===1&&H.element==="f"){let P=p.compile(K,r);return d?`i32(floor(${P}))`:`int(floor(${P}))`}if(H!==void 0&&H.width===1&&H.element==="i")return Z.ref;if(H!==void 0&&H.width===1&&H.element==="u")return d?`i32(${Z.ref})`:`int(${Z.ref})`;throw new Error(`Could not compile \`${e}\`: the ${Q} bound \`${K.toString()}\` is declared "${Z.spelling}" by the caller, which is not a scalar number \u2014 a loop bound must be one.`)},A=u!==void 0?String(u):k(i[1],"lower"),R=f!==void 0?String(f):k(i[2],"upper");je(s,r.language);let T=d?`var ${N}: ${v}`:`${v} ${N}`,U=d?`var ${s}: ${I}`:`${I} ${s}`,M=K=>/([A-Za-z_]\w*)\)*$/.exec(K.trim())?.[1]===s,j=f===void 0&&(!Wi(R)||M(R))?p.tempVar(r):"",W=j===""?[]:[d?`let ${j}: ${I} = ${R};`:`${I} ${j} = ${R};`],ue=j===""?R:j,ie=[...W,...Yi(L,[y,...G.stmts]).map(([K,Q,Z])=>Ki(K,Q,Z,d)),`${T} = ${x};`,`for (${U} = ${A}; ${s} <= ${ue}; ${s}++) {`,...G.stmts.map(K=>K.split(`
`).map(Q=>`  ${Q}`).join(`
`)),a&&!c?`  ${N} = ${E(N,y)};`:`  ${N} ${m}= ${y};`,"}"];return p.canHoist(r)?(p.foldValueImpure(n[0])&&Ye(e,[n[0]],r),ve(e,n,r),p.hoistStatement(r,ie.join(`
`)),p.foldValueImpure(n[0])&&Be([n[0]],r),N):[...ie,`return ${N};`].join(`
`)}var Tn={__proto__:null,Add:(e,n,t)=>{if(e.length===0)return"0.0";if(e.length===1)return Hr(n(e[0]));if(!e.some(u=>p.isComplexValued(u)))return Mn(e.map(u=>n(u)),"0.0","+",t.language);for(let u of e)On("Add",u);if(e.some(u=>vl(u))){let u=re(t);return e.map(f=>{let c=n(f);return p.isComplexValued(f)?c:`${u}(${c}, 0.0)`}).join(" + ")}let o=e.map(u=>yl(u,n,t.language)),i=[],s=[];for(let u of o)u.re!==null&&i.push(u.re),u.im!==null&&s.push(u.im);let a=Mn(i,"0.0","+",t.language),l=Mn(s,"0.0","+",t.language);return`${re(t)}(${a}, ${l})`},Multiply:(e,n,t)=>{if(e.length===0)return"1.0";if(e.length===1)return Hr(n(e[0]));if(!e.some(u=>p.isComplexValued(u)))return Mn(e.map(u=>lr(u,t)),"1.0","*",t.language);for(let u of e)On("Multiply",u);let o=e.findIndex(u=>C(u,"ImaginaryUnit")||D(u)&&u.re===0&&u.isComplex);if(o>=0){let u=e[o],f=C(u,"ImaginaryUnit")?1:u.im,c=e.filter((g,_)=>_!==o),m=re(t);if(c.length===0)return`${m}(0.0, ${Y(f,t.language)})`;let d=c.filter(g=>p.isComplexValued(g));if(d.length===0){let g=c.map(x=>lr(x,t));f!==1&&g.unshift(Y(f,t.language));let _=Mn(g,"1.0","*",t.language);return`${m}(0.0, ${_})`}if(d.length===1&&C(d[0])){let g=n(d[0]),_=/^[A-Za-z_][A-Za-z0-9_]*$/.test(g)?g:`(${g})`,x=c.filter(S=>S!==d[0]).map(S=>lr(S,t));f!==1&&x.unshift(Y(f,t.language));let v=`${m}(-${_}.y, ${_}.x)`,E=Mn(x,"1.0","*",t.language);return E==="1.0"?v:`(${E} * ${v})`}}let i=[],s=[];for(let u of e)p.isComplexValued(u)?s.push(n(u)):i.push(lr(u,t));let a=Mn(i,"1.0","*",t.language),l=s[0];for(let u=1;u<s.length;u++)l=`_gpu_cmul(${l}, ${s[u]})`;return a!=="1.0"&&(l=`(${a} * ${l})`),l},Divide:(e,n,t)=>{if(e.length===0)return"1.0";if(e.length===1)return n(e[0]);let r=p.isComplexValued(e[0]),o=e.length>=2&&p.isComplexValued(e[1]);if(!r&&!o){if(e.length===2){let a=ne(e[0]),l=ne(e[1]);return a!==void 0&&l!==void 0&&l!==0?Y(a/l,t.language):l===1?n(e[0]):`(${n(e[0])}) / (${n(e[1])})`}let s=`(${n(e[0])})`;for(let a=1;a<e.length;a++)s=`${s} / (${n(e[a])})`;return s}for(let s of e)On("Divide",s);return r&&o?`_gpu_cdiv(${n(e[0])}, ${n(e[1])})`:r&&!o?`((${n(e[0])}) / (${n(e[1])}))`:`_gpu_cdiv(${re(t)}(${n(e[0])}, 0.0), ${n(e[1])})`},Negate:([e],n,t)=>{if(e===null)throw new Error("Could not compile `Negate`: no argument");let r=ne(e);return r!==void 0?Y(-r,t.language):D(e)&&e.isComplex?`${re(t)}(${Y(-e.re,t.language)}, ${Y(-e.im,t.language)})`:C(e,"ImaginaryUnit")?`${re(t)}(0.0, -1.0)`:`(-(${n(e)}))`},Abs:(e,n,t)=>p.isComplexValued(e[0])?`length(${n(e[0])})`:p.isNonNegative(e[0])?Le(e[0],n,t):`abs(${n(e[0])})`,Arccos:(e,n,t)=>p.isComplexValued(e[0])?`_gpu_cacos(${n(e[0])})`:$e("Arccos",e)?`_gpu_cacos(${be(e[0],n,t)})`:`acos(${n(e[0])})`,Arcsin:(e,n,t)=>p.isComplexValued(e[0])?`_gpu_casin(${n(e[0])})`:$e("Arcsin",e)?`_gpu_casin(${be(e[0],n,t)})`:`asin(${n(e[0])})`,Arctan:(e,n)=>p.isComplexValued(e[0])?`_gpu_catan(${n(e[0])})`:`atan(${n(e[0])})`,At:ge((e,n,t)=>Tf(e,n,t)),Ceil:(e,n,t)=>e.length>1&&e[1]!==null?cr("ceil",e[0],e[1],n,t):p.isIntegerValued(e[0])?Le(e[0],n,t):`ceil(${n(e[0])})`,Clamp:(e,n,t)=>us("clamp",0,e,n,t)??`clamp(${e.map(r=>n(r)).join(", ")})`,Cos:(e,n,t)=>{if(p.isComplexValued(e[0]))return`_gpu_ccos(${n(e[0])})`;let r=Jr(e[0],2);return r!==void 0?`_gpu_cospi(${n(r)})`:Ln("cos",e[0],n(an(e[0],2,!0,t)),t)},Degrees:"radians",Exp:(e,n)=>p.isComplexValued(e[0])?`_gpu_cexp(${n(e[0])})`:`exp(${n(e[0])})`,Exp2:"exp2",First:ge((e,n,t)=>vo("First",e[0],n,t)),Second:ge((e,n,t)=>vo("Second",e[0],n,t)),Third:ge((e,n,t)=>vo("Third",e[0],n,t)),Last:ge((e,n,t)=>vo("Last",e[0],n,t)),PointX:(e,n,t)=>fo(e[0],"x",n,t),PointY:(e,n,t)=>fo(e[0],"y",n,t),PointZ:(e,n,t)=>fo(e[0],"z",n,t),Floor:(e,n,t)=>e.length>1&&e[1]!==null?cr("floor",e[0],e[1],n,t):p.isIntegerValued(e[0])?Le(e[0],n,t):`floor(${n(e[0])})`,Fract:(e,n,t)=>{let r=e[0];if(r==null)throw new Error("Could not compile `Fract`: missing argument");let o=()=>`fract(${n(r)})`;return St("Fract",r,!0,n,t,V,o)??o()},Ln:(e,n,t)=>p.isComplexValued(e[0])?`_gpu_cln(${n(e[0])})`:e[0]?.isNegative===!0&&$e("Ln",e)?`_gpu_cln(${be(e[0],n,t)})`:`log(${n(e[0])})`,Log2:"log2",Max:ge((e,n,t)=>e.some(r=>qn(r,t))?fr("Max","max",e,n,t):Bi("max","Max",e,n,t)),Min:ge((e,n,t)=>e.some(r=>qn(r,t))?fr("Min","min",e,n,t):Bi("min","Min",e,n,t)),Mean:ge((e,n,t)=>{if(e.some(r=>qn(r,t)))return fr("Mean","mean",e,n,t);throw new Error(`Could not compile \`Mean\`: the operator is known to the engine but target '${t.language??"unknown"}' has no lowering for it.`)}),ElementMax:(e,n,t)=>Ui("max","ElementMax",e,n,t),ElementMin:(e,n,t)=>Ui("min","ElementMin",e,n,t),Mix:"mix",If:(e,n,t)=>{if(e.length!==3)throw new Error("Could not compile `If`: wrong number of arguments");Oi("If",[e[1],e[2]]);let r=ir("If",e),o=[e[1],e[2]],i=u=>sr("If",e[u],n(e[u],u),r,t,o);if(mn(e[1])||mn(e[2])||Xe(t)&&(tr(e[1])||tr(e[2])||rr(e[1],t)||rr(e[2],t)||er(e[1])||er(e[2])||Gt([e[1],e[2]],t))){let u=nr([e[0],e[1],e[0].engine.True,e[2]],(f,c)=>c===1||c===3?sr("If",f,n(f,c===3?2:c),r,t,o):n(f,c),t);if(u!==void 0)return u}so("If",e,t),io("If",[e[1],e[2]],t);let s=n(e[0],0),a=Ze("If",()=>i(1),t),l=Ze("If",()=>i(2),t);return or("If",[e[1],e[2]],t),Pn(s,a,l,t)},When:(e,n,t)=>{if(e.length!==2)throw new Error("Could not compile `When`: expected exactly 2 arguments (expr, cond)");if(p.assertScalarCondition(e[1]),C(e[1],"True"))return`(${n(e[0],0)})`;if(C(e[1],"False"))return et(e[0],t);if(mn(e[0])||Xe(t)&&(tr(e[0])||rr(e[0],t)||er(e[0])||Gt([e[0]],t))){let i=nr([e[1],e[0]],(s,a)=>n(s,a===0?1:0),t);if(i!==void 0)return i}so("When",e,t),io("When",[e[0]],t);let r=n(e[1],1),o=Ze("When",()=>n(e[0],0),t);return or("When",[e[0]],t),Pn(r,o,et(e[0],t),t)},Which:(e,n,t)=>{if(e.length<2||e.length%2!==0)throw new Error("Could not compile `Which`: expected condition/value pairs");Oi("Which",e.filter((m,d)=>d%2===1));let r=ir("Which",e),o=e.filter((m,d)=>d%2===1),i=m=>sr("Which",e[m],n(e[m],m),r,t,o),s=e.findIndex((m,d)=>d%2===0&&C(m,"True")),a=s===0?[]:e.slice(1,s===-1?e.length:s+2),l=Xe(t);if(e.some((m,d)=>d>0&&(mn(m)||l&&(tr(m)||rr(m,t)||er(m))))||l&&Gt(a,t)){let m=nr(e,(d,g)=>g%2===1?sr("Which",d,n(d,g),r,t,o):n(d,g),t);if(m!==void 0)return m}so("Which",e,t),io("Which",e.slice(1),t);let u=e.filter((m,d)=>d%2===1).find(m=>Ue(m))??null,f=m=>{if(m>=e.length)return r?`${re(t)}(${ce(t)})`:et(u,t);let d=e[m],g=S=>m===0?S():Ze("Which",S,t);if(C(d,"True"))return`(${g(()=>i(m+1))})`;let _=m;for(;_+3<e.length&&!C(e[_+2],"True")&&e[m+1].isPure&&e[_+2].isPure&&e[_+3].isPure&&e[_+3].isSame(e[m+1]);)_+=2;let x=g(()=>n(d,m)),v=[];for(let S=m+2;S<=_;S+=2)v.push(Ze("Which",()=>n(e[S],S),t));let E=v.length===0?x:[x,...v].map(S=>`(${S})`).join(" || ");return Pn(E,Ze("Which",()=>i(m+1),t),f(_+2),t)},c=f(0);return or("Which",a,t),c},Match:(e,n,t)=>{dn("Match",[e[0]],t),e[0].isPure===!1&&ve("Match",[e[0]],t);let r=!1,o,i=p.compileMatchTernary(e[0].engine,e,t,{ternary:(s,a,l)=>(r=!0,Pn(s,a,l,t)),eq:"==",noMatch:ce(t),allowStrings:!1,arm:s=>Ze("Match",s,t),statement:s=>(o=s,Tu(e[0],s,t))});return r&&or("Match",o===void 0?e.slice(1):Mi(o),t),i},Power:(e,n,t)=>{let r=e[0],o=e[1];if(r===null)throw new Error("Could not compile `Power`: no argument");if(o==null)throw new Error("Could not compile `Power`: expected two operands, got one");let i=p.negativeBaseFloatPower(e);if(p.isComplexValued(r)||p.isComplexValued(o)){if(C(r,"ExponentialE")){let d=o!==null?p.eulerPiSplit(o):void 0;if(d!==void 0&&V(d.u)==="scalar"&&(d.a===void 0||V(d.a)==="scalar")){let g=an(d.u,2,!1);return d.a===void 0?`_gpu_cossinpi(${n(g)})`:`(exp(${n(d.a)}) * _gpu_cossinpi(${n(g)}))`}return`_gpu_cexp(${n(o)})`}On("Power",r),On("Power",o);let f=re(t),c=p.isComplexValued(r)?n(r):`${f}(${n(r)}, 0.0)`;if(typeof i=="object")return`_gpu_cpowrr(${c}, ${Y(i.value,t.language)}, ${i.oddNumerator?"-1.0":"1.0"})`;let m=p.isComplexValued(o)?n(o):`${f}(${n(o)}, 0.0)`;return`_gpu_cpow(${c}, ${m})`}let s=ne(r),a=ne(o);if(s!==void 0&&a!==void 0){let f=Math.pow(s,a);if(Number.isNaN(f)){if($e("Power",e))return $i(s,a,t);let c=_l(s,o,a);if(c!==void 0)return Y(c,t.language)}return Y(f,t.language)}let l=p.realPowerExponent(e)??(typeof i=="object"?i:void 0);if(l!==void 0){let f=de("Power",r,n,t),c=Si(r,o),m=x=>c===void 0?Y(x,t.language):`${rn(c,t)}(${Y(x,t.language)})`,d=`pow(abs(${f}), ${m(l.value)})`;if(!l.oddNumerator)return d;let g=t.language==="wgsl"||c===void 0?`${f} < ${m(0)}`:`lessThan(${f}, ${m(0)})`;return`(${t.language==="wgsl"?`select(${m(1)}, ${m(-1)}, ${g})`:c===void 0?`(${g} ? -1.0 : 1.0)`:`mix(${m(1)}, ${m(-1)}, ${g})`} * ${d})`}if($e("Power",e))return`_gpu_cpow(${be(r,n,t)}, ${be(o,n,t)})`;let u=Si(r,o);if(a===0){let f=V(r);return f==="scalar"?"1.0":typeof f=="number"?`${rn(f,t)}(1.0)`:`_gpu_powi(${n(r)}, 0.0)`}if(a===1)return Hr(n(r));if(C(r,"ExponentialE")&&V(o)==="scalar"&&n(r)==="2.71828182846")return`exp(${n(o)})`;if(a===.5)return`sqrt(${n(r)})`;if(s===2)return`exp2(${n(o)})`;if(a!==void 0&&Number.isInteger(a)){let f=a,c=Math.abs(f),m;if(c===1)m=`(${n(r)})`;else if((C(r)||D(r))&&c<=Uu){let d=n(r);m=/^[A-Za-z_]\w*$|^-?[0-9]+(?:\.[0-9]*)?$/.test(d)?`(${Array(c).fill(d).join(" * ")})`:Nt(d,c,V(r))}else m=Nt(n(r),c,V(r));return f<0?`(1.0 / ${m})`:m}if(p.isIntegerValued(o)&&!p.isNonNegative(r)&&V(o)==="scalar"){let f=V(r),c=typeof f=="number"?f:void 0;if(f==="scalar"||c!==void 0)return`_gpu_powi${c??""}(${n(r)}, ${n(o)})`}return`pow(${zi(r,u,n,t)}, ${zi(o,u,n,t)})`},Radians:"radians",Round:(e,n,t)=>{let r=V(e[0])==="scalar",o=e[0].engine.roundingTies,i=s=>bo(s,o,r,t.language==="wgsl");return e.length<2?p.isIntegerValued(e[0])?Le(e[0],n,t):i(r?n(e[0]):de("Round",e[0],n,t)):cr((s,a)=>bo(s,o,a,t.language==="wgsl"),e[0],e[1],n,t,.5)},Sign:(e,n,t)=>Ln("sign",e[0],n(e[0]),t),Sin:(e,n,t)=>{if(p.isComplexValued(e[0]))return`_gpu_csin(${n(e[0])})`;let r=Jr(e[0],2);return r!==void 0?`_gpu_sinpi(${n(r)})`:Ln("sin",e[0],n(an(e[0],2,!0,t)),t)},Smoothstep:(e,n,t)=>us("smoothstep",2,e,n,t)??`smoothstep(${e.map(r=>n(r)).join(", ")})`,Sqrt:(e,n,t)=>{if(p.isComplexValued(e[0]))return`_gpu_csqrt(${n(e[0])})`;let r=ne(e[0]);return r!==void 0?r<0?`${re(t)}(0.0, ${Y(Math.sqrt(-r),t.language)})`:Y(Math.sqrt(r),t.language):e[0]?.isNegative===!0&&$e("Sqrt",e)?`_gpu_csqrt(${be(e[0],n,t)})`:`sqrt(${n(e[0])})`},Step:"step",Tan:(e,n,t)=>{if(p.isComplexValued(e[0]))return`_gpu_ctan(${n(e[0])})`;let r=Jr(e[0],1);return r!==void 0?`_gpu_tanpi(${n(r)})`:`tan(${n(an(e[0],1,!0,t))})`},Truncate:(e,n,t)=>e.length>1&&e[1]!==null?cr("trunc",e[0],e[1],n,t):p.isIntegerValued(e[0])?Le(e[0],n,t):`trunc(${n(e[0])})`,Real:(e,n,t)=>p.isComplexValued(e[0])?`(${n(e[0])}).x`:Le(e[0],n,t),Imaginary:(e,n)=>p.isComplexValued(e[0])?`(${n(e[0])}).y`:"0.0",Argument:(e,n,t)=>{if(p.isComplexValued(e[0])){let o=de("Argument",e[0],n,t,!0),i=Ae(o);return i!==void 0&&/^vec2f?$/.test(i.callee)&&i.operands.length===2?`${Vr(t)}(${i.operands[1]}, ${i.operands[0]})`:`${Vr(t)}(${Dn(o,"y")}, ${Dn(o,"x")})`}let r=de("Argument",e[0],n,t);return Pn(`${r} >= 0.0`,"0.0",Pn(`${r} < 0.0`,"3.14159265359",Ie(NaN),t),t)},Conjugate:(e,n,t)=>{if(p.isComplexValued(e[0])){let r=re(t),o=de("Conjugate",e[0],n,t,!0);return`${r}(${Dn(o,"x")}, -${Dn(o,"y")})`}return Le(e[0],n,t)},Remainder:([e,n],t,r)=>{if(e===null||n===null)throw new Error("Could not compile `Remainder`: missing argument");let o=a=>bo(a,"toward-positive-infinity",V(e)==="scalar"&&V(n)==="scalar",r.language==="wgsl");if(dn("Remainder",[e,n],r),p.foldValueImpure(e)||p.foldValueImpure(n)){if(!p.canHoist(r)||V(e)!=="scalar"||V(n)!=="scalar")throw new Error("Could not compile `Remainder`: an impure (Random) operand cannot be bound to a temporary at this position \u2014 a repeated draw would shift every later value in the shader.");Ye("Remainder",[e,n],r),ve("Remainder",[e,n],r);let a=p.tempVar(r),l=p.tempVar(r),u=f=>r.language==="wgsl"?`var ${f}: f32`:`float ${f}`;return p.hoistStatement(r,`${u(a)} = ${t(e)};`,`${u(l)} = ${t(n)};`),Be([e,n],r),`(${a} - ${l} * ${o(`${a} / ${l}`)})`}let i=`(${t(e)})`,s=`(${t(n)})`;return`(${i} - ${s} * ${o(`${i} / ${s}`)})`},Cot:([e],n,t)=>{if(e===null)throw new Error("Could not compile `Cot`: no argument");if(dn("Cot",[e],t),p.isComplexValued(e)){if(p.foldValueImpure(e)){if(!p.canHoist(t))throw new Error("Could not compile `Cot`: an impure (Random) complex operand cannot be bound to a temporary at this position \u2014 a repeated draw would shift every later value in the shader.");Ye("Cot",[e],t),ve("Cot",[e],t);let i=p.tempVar(t),s=t.language==="wgsl"?`var ${i}: ${re(t)}`:`${re(t)} ${i}`;return p.hoistStatement(t,`${s} = ${n(e)};`),Be([e],t),`_gpu_cdiv(_gpu_ccos(${i}), _gpu_csin(${i}))`}let o=n(e);return`_gpu_cdiv(_gpu_ccos(${o}), _gpu_csin(${o}))`}if(p.foldValueImpure(e)){if(!p.canHoist(t)||V(e)!=="scalar")throw new Error("Could not compile `Cot`: an impure (Random) operand cannot be bound to a temporary at this position \u2014 a repeated draw would shift every later value in the shader.");Ye("Cot",[e],t),ve("Cot",[e],t);let o=p.tempVar(t),i=t.language==="wgsl"?`var ${o}: f32`:`float ${o}`;return p.hoistStatement(t,`${i} = ${n(an(e,1,!0,t))};`),Be([e],t),`(_gpu_cos(${o}) / _gpu_sin(${o}))`}let r=n(an(e,1,!0,t));return`(${Ln("cos",e,r,t)} / ${Ln("sin",e,r,t)})`},Csc:([e],n,t)=>{if(e===null)throw new Error("Could not compile `Csc`: no argument");return p.isComplexValued(e)?`_gpu_cdiv(${re(t)}(1.0, 0.0), _gpu_csin(${n(e)}))`:`(1.0 / ${Ln("sin",e,n(an(e,2,!0,t)),t)})`},Sec:([e],n,t)=>{if(e===null)throw new Error("Could not compile `Sec`: no argument");return p.isComplexValued(e)?`_gpu_cdiv(${re(t)}(1.0, 0.0), _gpu_ccos(${n(e)}))`:`(1.0 / ${Ln("cos",e,n(an(e,2,!0,t)),t)})`},Arccot:([e],n)=>{if(e===null)throw new Error("Could not compile `Arccot`: no argument");return`(1.5707963267948966 - atan(${n(e)}))`},Arccsc:([e],n,t)=>{if(e===null)throw new Error("Could not compile `Arccsc`: no argument");return p.isComplexValued(e)||$e("Arccsc",[e])?dr("_gpu_cacsc",e,n,t):`asin(1.0 / (${n(e)}))`},Arcsec:([e],n,t)=>{if(e===null)throw new Error("Could not compile `Arcsec`: no argument");return p.isComplexValued(e)||$e("Arcsec",[e])?dr("_gpu_casec",e,n,t):`acos(1.0 / (${n(e)}))`},Sinh:(e,n)=>{if(p.isComplexValued(e[0])){let t=nt(e[0],2);return t!==void 0?`_gpu_ipi_sinh(${n(t)})`:`_gpu_csinh(${n(e[0])})`}return`sinh(${n(e[0])})`},Cosh:(e,n)=>{if(p.isComplexValued(e[0])){let t=nt(e[0],2);return t!==void 0?`_gpu_ipi_cosh(${n(t)})`:`_gpu_ccosh(${n(e[0])})`}return`cosh(${n(e[0])})`},Tanh:(e,n,t)=>{if(p.isComplexValued(e[0])){let r=nt(e[0],1);return r!==void 0?`_gpu_ipi_tanh(${n(r)})`:`_gpu_ctanh(${n(e[0])})`}return ss(e[0],n,t)},Coth:([e],n,t)=>{if(e===null)throw new Error("Could not compile `Coth`: no argument");if(p.isComplexValued(e)){let r=nt(e,1);if(r!==void 0)return`_gpu_ipi_coth(${n(r)})`;let o=de("Coth",e,n,t,!0);return`_gpu_cdiv(_gpu_ccosh(${o}), _gpu_csinh(${o}))`}return`(1.0 / ${ss(e,n,t)})`},Csch:([e],n,t)=>{if(e===null)throw new Error("Could not compile `Csch`: no argument");if(p.isComplexValued(e)){let r=nt(e,2);return r!==void 0?`_gpu_ipi_csch(${n(r)})`:`_gpu_cdiv(${re(t)}(1.0, 0.0), _gpu_csinh(${n(e)}))`}return`(1.0 / sinh(${n(e)}))`},Sech:([e],n,t)=>{if(e===null)throw new Error("Could not compile `Sech`: no argument");if(p.isComplexValued(e)){let r=nt(e,2);return r!==void 0?`_gpu_ipi_sech(${n(r)})`:`_gpu_cdiv(${re(t)}(1.0, 0.0), _gpu_ccosh(${n(e)}))`}return`(1.0 / cosh(${n(e)}))`},Arcosh:(e,n,t)=>p.isComplexValued(e[0])?`_gpu_cacosh(${n(e[0])})`:$e("Arcosh",e)?`_gpu_cacosh(${be(e[0],n,t)})`:`acosh(${n(e[0])})`,Arsinh:(e,n)=>p.isComplexValued(e[0])?`_gpu_casinh(${n(e[0])})`:`asinh(${n(e[0])})`,Artanh:(e,n,t)=>p.isComplexValued(e[0])?`_gpu_catanh(${n(e[0])})`:$e("Artanh",e)?`_gpu_catanh(${be(e[0],n,t)})`:`atanh(${n(e[0])})`,Arcoth:([e],n,t)=>{if(e===null)throw new Error("Could not compile `Arcoth`: no argument");return p.isComplexValued(e)||$e("Arcoth",[e])?dr("_gpu_cacoth",e,n,t):`atanh(1.0 / (${n(e)}))`},Arcsch:([e],n)=>{if(e===null)throw new Error("Could not compile `Arcsch`: no argument");return`asinh(1.0 / (${n(e)}))`},Arsech:([e],n,t)=>{if(e===null)throw new Error("Could not compile `Arsech`: no argument");return p.isComplexValued(e)||$e("Arsech",[e])?dr("_gpu_casech",e,n,t):`acosh(1.0 / (${n(e)}))`},Arctan2:(e,n,t)=>{if(e.length<2)throw new Error("Could not compile `Arctan2`: need two arguments");return`${Vr(t)}(${n(e[0])}, ${n(e[1])})`},Hypot:([e,n],t)=>{if(e===null||n===null)throw new Error("Could not compile `Hypot`: need two arguments");return`length(vec2(${t(e)}, ${t(n)}))`},Haversine:([e],n,t)=>{if(e===null)throw new Error("Could not compile `Haversine`: no argument");return`((1.0 - ${Ln("cos",e,n(e),t)}) * 0.5)`},InverseHaversine:([e],n)=>{if(e===null)throw new Error("Could not compile `InverseHaversine`: no argument");return`(2.0 * asin(sqrt(${n(e)})))`},Gamma:(e,n,t)=>{let r=e[0];if(!r)throw new Error("Could not compile `Gamma`: no argument");if(e.length>1)throw new Error(`Could not compile \`Gamma\`: the two-operand form is the upper incomplete gamma \u0393(s, z), which has no ${t.language??"GPU"} lowering (\`_gpu_gamma\` is the COMPLETE \u0393).`);return`_gpu_gamma(${n(r)})`},GammaLn:([e],n)=>{if(e===null)throw new Error("Could not compile `GammaLn`: no argument");return`_gpu_gammaln(${n(e)})`},Factorial:([e],n)=>{if(e===null)throw new Error("Could not compile `Factorial`: no argument");return`_gpu_gamma(${n(e)} + 1.0)`},Beta:([e,n],t,r)=>{if(e===null||n===null)throw new Error("Could not compile `Beta`: need two arguments");let o=de("Beta",e,t,r),i=de("Beta",n,t,r);return`(_gpu_gamma(${o}) * _gpu_gamma(${i}) / _gpu_gamma(${o} + ${i}))`},Erf:([e],n)=>{if(e===null)throw new Error("Could not compile `Erf`: no argument");return`_gpu_erf(${n(e)})`},Digamma:([e],n)=>{if(e===null)throw new Error("Could not compile `Digamma`: no argument");return`_gpu_digamma(${n(e)})`},Trigamma:([e],n)=>{if(e===null)throw new Error("Could not compile `Trigamma`: no argument");return`_gpu_trigamma(${n(e)})`},PolyGamma:(e,n)=>{if(e.length!==2||e[0]===null||e[1]===null)throw new Error("Could not compile `PolyGamma`: need two arguments");return`_gpu_polygamma(${n(e[0])}, ${n(e[1])})`},Zeta:(e,n)=>{if(e.length===1)return`_gpu_zeta(${n(e[0])})`;if(e.length===2)return`_gpu_zeta_generalized(${n(e[0])}, ${n(e[1])})`;throw new Error("Could not compile `Zeta`: it takes one or two operands")},HurwitzZeta:(e,n)=>{if(e.length!==2)throw new Error("Could not compile `HurwitzZeta`: only the two-operand form `HurwitzZeta(s, a)` compiles");return Xr("HurwitzZeta",e),`_gpu_hurwitz_zeta(${n(e[0])}, ${n(e[1])})`},LerchPhi:(e,n)=>{if(e.length!==3)throw new Error("Could not compile `LerchPhi`: it takes exactly three operands");return Xr("LerchPhi",e),`_gpu_lerch_phi(${n(e[0])}, ${n(e[1])}, ${n(e[2])})`},PolyLog:(e,n)=>{if(e.length!==2)throw new Error("Could not compile `PolyLog`: it takes exactly two operands");return Xr("PolyLog",e),`_gpu_poly_log(${n(e[0])}, ${n(e[1])})`},Binomial:qi,Choose:qi,Erfc:([e],n)=>{if(e===null)throw new Error("Could not compile `Erfc`: no argument");return`(1.0 - _gpu_erf(${n(e)}))`},ErfInv:([e],n)=>{if(e===null)throw new Error("Could not compile `ErfInv`: no argument");return`_gpu_erfinv(${n(e)})`},Heaviside:([e],n)=>{if(e===null)throw new Error("Could not compile `Heaviside`: no argument");return`_gpu_heaviside(${n(e)})`},Sinc:([e],n)=>{if(e===null)throw new Error("Could not compile `Sinc`: no argument");return`_gpu_sinc(${n(e)})`},FresnelC:([e],n)=>{if(e===null)throw new Error("Could not compile `FresnelC`: no argument");return`_gpu_fresnelC(${n(e)})`},FresnelS:([e],n)=>{if(e===null)throw new Error("Could not compile `FresnelS`: no argument");return`_gpu_fresnelS(${n(e)})`},BesselJ:([e,n],t,r)=>{if(e===null||n===null)throw new Error("Could not compile `BesselJ`: need two arguments");return`_gpu_besselJ(${r?.language==="wgsl"?"i32":"int"}(${t(e)}), ${t(n)})`},Lb:"log2",Log:(e,n,t)=>{if(e.length===0)throw new Error("Could not compile `Log`: no argument");if(e.some(r=>p.isComplexValued(r))||e.some(r=>r.isNegative===!0)&&$e("Log",e)){let r=`_gpu_cln(${be(e[0],n,t)})`;return e.length===1?`(${r} * 0.4342944819032518)`:`_gpu_cdiv(${r}, _gpu_cln(${be(e[1],n,t)}))`}return e.length===1?`(log(${n(e[0])}) / log(10.0))`:p.fixedLogBase(e)===2?`log2(${n(e[0])})`:`(log(${n(e[0])}) / log(${n(e[1])}))`},Log10:([e],n)=>{if(e===null)throw new Error("Could not compile `Log10`: no argument");return`(log(${n(e)}) * 0.4342944819032518)`},Lg:([e],n)=>{if(e===null)throw new Error("Could not compile `Lg`: no argument");return`(log(${n(e)}) * 0.4342944819032518)`},Square:([e],n)=>{if(e===null)throw new Error("Could not compile `Square`: no argument");if(C(e)||D(e)){let r=n(e);if(/^[A-Za-z_]\w*$|^-?[0-9]+(?:\.[0-9]*)?$/.test(r))return`(${r} * ${r})`;let o=V(e);return Nt(r,2,o)}let t=V(e);return Nt(n(e),2,t)},Root:([e,n],t,r)=>{if(e===null)throw new Error("Could not compile `Root`: no argument");if(p.isComplexValued(e)||n!=null&&p.isComplexValued(n)){if(n!=null&&p.isComplexValued(n))throw new Error("Could not compile `Root`: a complex degree has no shader lowering.");let l=re(r),u=de("Root",e,t,r,!0);if(n==null)return`_gpu_csqrt(${u})`;let f=ne(n);if(f!==void 0){let d=Y(1/f,r.language),g=`_gpu_cpow(${u}, ${l}(${d}, 0.0))`;return!Number.isInteger(f)||f%2===0?g:Pn(`(${u}).y == 0.0`,`${l}(sign((${u}).x) * pow(abs((${u}).x), ${d}), 0.0)`,g,r)}let c=de("Root",n,t,r),m=r.language==="wgsl"?`abs(${c}) % 2.0 == 1.0`:`mod(abs(${c}), 2.0) == 1.0`;return Pn(`(${u}).y == 0.0 && fract(${c}) == 0.0 && ${m}`,`${l}(sign((${u}).x) * pow(abs((${u}).x), 1.0 / (${c})), 0.0)`,`_gpu_cpow(${u}, ${l}(1.0 / (${c}), 0.0))`,r)}if(n==null)return`sqrt(${t(e)})`;let o=ne(n);if(o===2)return`sqrt(${t(e)})`;let i=ne(e);if(i!==void 0&&o!==void 0){let l=Math.pow(i,1/o);if(Number.isNaN(l)){let u=i<0?p.realRootDegreeTerms(n):void 0;if(i<0&&(Number.isInteger(o)&&o%2!==0||u?.oddNumerator===!0))return Y(-Math.pow(-i,1/o),r.language);if(u!==void 0)return Y(Math.pow(-i,1/o),r.language);if($e("Root",[e,n]))return $i(i,1/o,r)}return Y(l,r.language)}if($e("Root",[e,n]))return`_gpu_cpow(${be(e,t,r)}, ${re(r)}(1.0 / (${t(n)}), 0.0))`;let s=p.realRootDegreeTerms(n);if(o!==void 0&&(Number.isInteger(o)&&o%2!==0||s?.oddNumerator===!0)){let l=de("Root",e,t,r);return`(sign(${l}) * pow(abs(${l}), ${Y(1/o,r.language)}))`}if(o!==void 0&&s!==void 0)return`pow(abs(${t(e)}), ${Y(1/o,r.language)})`;let a=t(n);return`pow(${t(e)}, 1.0 / ${/^[\w.]+$/.test(a)?a:`(${a})`})`},GamutMap:(e,n,t)=>{if(e.length===0)throw new Error("Could not compile `GamutMap`: no argument");let r=De("GamutMap",e[0],n,t),o=e.length>=2&&e[1]!==null?e[1]:void 0,i="srgb";if(o!==void 0){let s=ar(o);if(s===null)throw new Error("Could not compile `GamutMap`: the gamut must be a string literal on a shader target");i=s}if(i==="srgb")return`_gpu_gamut_map_oklch(${r})`;if(i==="display-p3")return`_gpu_gamut_map_oklch_p3(${r})`;throw new Error(`Could not compile \`GamutMap\`: unknown gamut "${i}" \u2014 the gamut is "srgb" or "display-p3".`)},ColorMix:(e,n,t)=>{if(e.length<2)throw new Error("Could not compile `ColorMix`: need two colors");let r=De("ColorMix",e[0],n,t),o=De("ColorMix",e[1],n,t),i=e.length>=3?n(e[2]):"0.5";return`_gpu_color_mix(${r}, ${o}, ${i})`},ColorContrast:([e,n],t,r)=>{if(e===null||n===null)throw new Error("Could not compile `ColorContrast`: need two colors");return`_gpu_apca(${De("ColorContrast",e,t,r)}, ${De("ColorContrast",n,t,r)})`},ContrastingColor:ge((e,n,t)=>{if(e.length===0)throw new Error("Could not compile `ContrastingColor`: no argument");let r=(f,c,m)=>t?.language==="wgsl"?`select(${m}, ${c}, ${f})`:`(${f} ? ${c} : ${m})`;if(e.slice(0,3).some(f=>f.isPure===!1))throw new Error("Could not compile `ContrastingColor`: an impure (Random) operand cannot be bound to a temporary at this position \u2014 a repeated draw would shift every later value in the shader.");t!==void 0&&dn("ContrastingColor",e.slice(0,3),t);let o=(f,c)=>{if(t===void 0||f.unknowns.length===0||/^[A-Za-z_]\w*$/.test(c)||!p.canHoist(t))return c;let m=p.tempVar(t),d=He(t),g=t.language==="wgsl"?`var ${m}: ${d}`:`${d} ${m}`;return p.hoistStatement(t,`${g} = ${c};`),m},i=o(e[0],De("ContrastingColor",e[0],n,t));if(e.length>=3){let f=o(e[1],De("ContrastingColor",e[1],n,t)),c=o(e[2],De("ContrastingColor",e[2],n,t));return r(`abs(_gpu_apca(${f}, ${i})) >= abs(_gpu_apca(${c}, ${i}))`,f,c)}let a=t?.language==="wgsl"?"vec3f":"vec3",l=`${a}(0.0)`,u=`${a}(1.0, 0.0, 0.0)`;return r(`abs(_gpu_apca(${u}, ${i})) >= abs(_gpu_apca(${l}, ${i}))`,u,l)}),ColorToColorspace:([e,n],t,r)=>{if(e===null||n===null)throw new Error("Could not compile `ColorToColorspace`: need color and space");let o=ar(n);if(o===null)throw new Error("Could not compile `ColorToColorspace`: space must be a string literal");let i=ot("ColorToColorspace",e,t,r);switch(o){case"oklch":return i;case"oklab":case"lab":return`_gpu_oklch_to_oklab(${i})`;case"rgb":return Ei(e,i,r);case"hsl":return`_gpu_rgb_to_hsl(_gpu_oklch_to_srgb(${i}))`;case"hsv":return`_gpu_rgb_to_hsv(_gpu_oklch_to_srgb(${i}))`;default:throw new Error(`Could not compile \`ColorToColorspace\`: unsupported space "${o}" on GPU target`)}},ColorFromColorspace:([e,n],t,r)=>{if(e===null||n===null)throw new Error("Could not compile `ColorFromColorspace`: need components and space");let o=ar(n);if(o===null)throw new Error("Could not compile `ColorFromColorspace`: space must be a string literal");let i=b(e)&&yf.has(e.operator)?e:null;if(b(e)&&e.operator==="List")throw new Error("Could not compile `ColorFromColorspace`: a list is not a color component vector \u2014 the operand must be a tuple or a color.");i?An("ColorFromColorspace",i.ops):b(e)&&e.operator==="Tuple"&&An("ColorFromColorspace",e.ops),i&&sn(i.ops.slice(0,3),He(r));let s=i?`${He(r)}(${i.ops.slice(0,3).map(a=>t(a)).join(", ")})`:t(e);if(!vf.has(o))throw new Error(`Could not compile \`ColorFromColorspace\`: unsupported space "${o}" on GPU target`);return s},Color:([e],n,t)=>{if(e===null)throw new Error("Could not compile `Color`: no argument");let r=ar(e);if(r===null)throw new Error("Could not compile `Color`: argument must be a string literal on GPU target");let o=ja(r);if(o===null)throw new Error(`Could not compile \`Color\`: invalid color string "${r}"`);if((o&255)!==255)throw new Error(`Could not compile \`Color\`: the color string "${r}" carries an alpha channel, which is not representable on the GPU target \u2014 color values are \`vec3\` (OKLCh) end to end, with no alpha channel. Use a fully opaque color and pass the alpha separately (e.g. as a uniform) at the framebuffer boundary.`);let i=o>>>24&255,s=o>>>16&255,a=o>>>8&255,l=Ba({r:i,g:s,b:a});return`${He(t)}(${Y(l.L)}, ${Y(l.C)}, ${Y(l.H)})`},Rgb:(e,n,t)=>{if(e.length<3)throw new Error("Could not compile `Rgb`: need 3 components");return An("Rgb",e),`_gpu_srgb_to_oklch(${He(t)}(${n(e[0])}, ${n(e[1])}, ${n(e[2])}))`},Hsv:(e,n,t)=>{if(e.length<3)throw new Error("Could not compile `Hsv`: need 3 components");return An("Hsv",e),`_gpu_srgb_to_oklch(_gpu_hsv_to_rgb(${He(t)}(${n(e[0])}, ${n(e[1])}, ${n(e[2])})))`},Hsl:(e,n,t)=>{if(e.length<3)throw new Error("Could not compile `Hsl`: need 3 components");return An("Hsl",e),`_gpu_srgb_to_oklch(_gpu_hsl_to_rgb(${He(t)}(${n(e[0])}, ${n(e[1])}, ${n(e[2])})))`},Oklab:(e,n,t)=>{if(e.length<3)throw new Error("Could not compile `Oklab`: need 3 components");return An("Oklab",e),`_gpu_oklab_to_oklch(${fs(e,n,t)})`},Oklch:(e,n,t)=>{if(e.length<3)throw new Error("Could not compile `Oklch`: need 3 components");return An("Oklch",e),fs(e,n,t)},AsOklch:([e],n,t)=>{if(e===null)throw new Error("Could not compile `AsOklch`: no argument");return kt(e,ot("AsOklch",e,n,t),t)},AsOklab:([e],n,t)=>{if(e===null)throw new Error("Could not compile `AsOklab`: no argument");return`_gpu_oklch_to_oklab(${ot("AsOklab",e,n,t)})`},AsRgb:([e],n,t)=>{if(e===null)throw new Error("Could not compile `AsRgb`: no argument");return Ei(e,ot("AsRgb",e,n,t),t)},AsHsv:([e],n,t)=>{if(e===null)throw new Error("Could not compile `AsHsv`: no argument");return`_gpu_rgb_to_hsv(_gpu_oklch_to_srgb(${ot("AsHsv",e,n,t)}))`},AsHsl:([e],n,t)=>{if(e===null)throw new Error("Could not compile `AsHsl`: no argument");return`_gpu_rgb_to_hsl(_gpu_oklch_to_srgb(${ot("AsHsl",e,n,t)}))`},Mandelbrot:([e,n],t,r)=>{if(e===null||n===null)throw new Error("Could not compile `Mandelbrot`: missing arguments");let o=Di("Mandelbrot",n,t,r);return`_fractal_mandelbrot(${be(e,t,r)}, ${o})`},Julia:([e,n,t],r,o)=>{if(e===null||n===null||t===null)throw new Error("Could not compile `Julia`: missing arguments");let i=Di("Julia",t,r,o);return`_fractal_julia(${be(e,r,o)}, ${be(n,r,o)}, ${i})`},Cross:"cross",Distance:"distance",Dot:"dot",Norm:ge((e,n,t)=>{if(e.length>1)throw new Error(`Could not compile \`Norm\`: only the default L2 norm compiles on the ${t.language??"GPU"} target.`);let r=e[0];if((b(r,"Tuple")||b(r,"PointList"))&&Vt(r)){let o=Tr(r,t);if(typeof o=="string")throw new Error(`Could not compile \`Norm\`: a point with a broadcasting component, and ${o}.`);return n(o)}if(b(r,"Tuple")||b(r,"List")){if(Vt(r))throw new Error("Could not compile `Norm`: a point with a broadcasting component.");let o=r.nops;if(o===0||o>4)throw new Error(`Could not compile \`Norm\`: the ${t.language??"GPU"} 'length()' builtin only accepts 2-4 component vectors (got ${o}).`);if(r.ops.some(i=>p.isComplexValued(i))){let i=r.ops.map(s=>{if(p.isComplexValued(s))return`length(${n(s)})`;if(V(s)!=="scalar")throw new Error(`Could not compile \`Norm\`: the entry \`${s.toString()}\` is not a scalar, so it has no modulus beside a complex entry.`);return n(s)});return o===1?i[0]:`length(${rn(o,t)}(${i.join(", ")}))`}return o===1?`abs(${n(r.op1)})`:`length(${n(r)})`}return`length(${n(r)})`},mu),Length:ge((e,n,t)=>{if(e.length===1&&qn(e[0],t))return Dl(go(e[0],n,t,"Length").name);throw new Error(`Could not compile \`Length\`: the collection element count is not supported on the ${t.language??"GPU"} target: the '${t.language??"GPU"}' 'length()' builtin is the Euclidean norm (CE 'Norm'), not a count.`)}),Normalize:"normalize",Reflect:"reflect",Refract:"refract",Sum:ge((e,n,t)=>Af("Sum",e,n,t),Li),Product:ge((e,n,t)=>Af("Product",e,n,t),Li),Range:(e,n,t)=>{if(e.length<2||e.length>3)throw new Error("Could not compile `Range`: GPU compile expects 2 or 3 arguments (lo, hi, step?)");let r=e[0].re,o=e[1].re,i=e.length===3?e[2].re:1;if(!Number.isFinite(r)||!Number.isFinite(o)||!Number.isFinite(i))throw new Error("Could not compile `Range`: GPU compile requires constant numeric bounds (non-constant ranges must be materialized at JS host then uploaded as a uniform)");if(i===0)throw new Error("Could not compile `Range`: step cannot be zero");let s=Wo(r,o,i);if(s===0)throw new Error("Could not compile `Range`: empty range (lo > hi for positive step, or lo < hi for negative step)");at("Range",s);let a=[];for(let f=0;f<s;f++)a.push(r+f*i);return`${t.language==="wgsl"?`array<f32, ${s}>`:`float[${s}]`}(${a.map(f=>he(f,t.language)).join(", ")})`},Loop:(e,n,t)=>{if(!e[0])throw new Error("Could not compile `Loop`: no body");if(!e[1])throw new Error("Could not compile `Loop`: no indexing set");let r=e.slice(1);p.assertBreakLeavesWholeLoop(r,e[0]);let o=t.language==="wgsl",i=o?"i32":"int",s=d=>o?`f32(${d})`:`float(${d})`,a=[],l=[],u=[];for(let d of r){if(!b(d,"Element"))throw new Error("Could not compile `Loop`: expected Element(index, Range(lo, hi))");let g=d.ops[0],_=d.ops[1];if(!C(g))throw new Error("Could not compile `Loop`: index must be a symbol");if(!b(_,"Range"))throw new Error("Could not compile `Loop`: expected Range(lo, hi)");let x=g.symbol;if(je(x,t.language),a.includes(x))throw new Error(`Could not compile \`Loop\` on this target: two Element clauses use the same index \`${x}\``);let v=a.find(h=>_.has(h));if(v!==void 0)throw new Error(`Could not compile \`Loop\` on this target: the \`Range\` of the index \`${x}\` reads the outer index \`${v}\`, and the bounds of a shader loop must be known at compile time`);let E=_.ops[0].re,S=_.ops[1].re;if(!Number.isFinite(E)&&!D(_.ops[0])||!Number.isFinite(S)&&!D(_.ops[1]))throw new Error("Could not compile `Loop` on this target: the bounds of the `Range` must be numbers known at compile time (a number literal, or a symbol with a value)");let $=Math.floor(E),N=Math.floor(S);if(!Number.isFinite($)||!Number.isFinite(N))throw new Error("Could not compile `Loop`: bounds must be finite numbers");let I=1;if(_.ops.length>=3){let h=_.ops[2].re;if(!Number.isInteger(h)||h===0)throw new Error("Could not compile `Loop` on this target: the step of the `Range` must be a non-zero integer known at compile time");I=h}let O=o?`var ${x}: ${i}`:`${i} ${x}`,F=I>0?`${x} <= ${N}`:`${x} >= ${N}`,w=I===1?`${x}++`:`${x} += ${I}`;a.push(x),l.push(`for (${O} = ${$}; ${F}; ${w}) {`);let z=d.ops[2];if(z===void 0||C(z,"Nothing")){u.push(void 0);continue}if(!q(z.type.type,"boolean"))throw new Error(`Could not compile \`Loop\` on this target: the guard of the index \`${x}\` is not a boolean (type \`${z.type.toString()}\`)`);if(mn(z))throw new Error(`Could not compile \`Loop\` on this target: the guard of the index \`${x}\` needs statements, which a shader \`if\` condition cannot hold`);let G=[...a];u.push(p.compile(z,{...t,var:h=>G.includes(h)?s(h):t.var(h),...p.withBoundScope(t,G)}))}let f=p.compileStatementList(e[0],{...t,var:d=>a.includes(d)?s(d):t.var(d),...p.withBoundScope(t,a)}),c=d=>d.split(`
`).map(g=>`  ${g}`).join(`
`),m=f;for(let d=l.length-1;d>=0;d--){let g=u[d];g!==void 0&&(m=`if (${g}) {
${c(m)}
}`),m=`${l[d]}
${c(m)}
}`}return m},GCD:ge((e,n,t)=>ji("GCD",e,n,t)),LCM:ge((e,n,t)=>ji("LCM",e,n,t)),Variance:ge((e,n,t)=>{let r;if(e.length===1&&b(e[0],"List"))r=e[0].ops;else if(e.length>=2)r=e;else throw new Error("Could not compile `Variance`: GPU target requires a List argument or at least 2 scalar arguments");let o=r.length;if(o<2)throw new Error("Could not compile `Variance`: need at least 2 elements");let i=r.map(u=>de("Variance",u,n,t)),a=`((${i.join(" + ")}) / ${he(o)})`;return`((${i.map(u=>`(${u} - ${a}) * (${u} - ${a})`).join(" + ")}) / ${he(o-1)})`},ki),Median:ge((e,n,t)=>{let r;if(e.length===1&&b(e[0],"List"))r=e[0].ops;else if(e.length>=1)r=e;else throw new Error("Could not compile `Median`: GPU target requires a List argument or at least 1 scalar argument");let o=r.length;if(o===0)throw new Error("Could not compile `Median`: empty list");if(o>8)throw new Error(`Could not compile \`Median\`: GPU target supports up to 8 elements via inline sorting network (got ${o}). For larger lists, compute on the CPU and pass the result as a uniform.`);let i=r.map(s=>n(s));return o===1?kt(r[0],i[0],t):`_gpu_median_${o}(${i.join(", ")})`},ki),Random:ge((e,n,t)=>{if(e.length===0)return mr(t);if(e.length===1)return kf(e[0],n,t);throw new Error("Could not compile `Random`: expects at most one operand, the DOMAIN to draw from (`Random()`, `Random(Interval(a, b))`, `Random(Range(\u2026))`). The seed argument was removed by the Random family redesign \u2014 seed with `WithRandomSeed(seed, body)`.")},e=>e.length===1),WithRandomSeed:(e,n,t)=>{if(e.length!==2)throw new Error("Could not compile `WithRandomSeed(seed, body)`: expects exactly two operands");let r=Rn(t),o=Lf(e[0],n,t),i=ds(r);r.frames.push({seed:o,counter:i});try{return Le(e[1],n,t)}finally{r.frames.pop()}},RandomChoice:(e,n,t)=>{throw new Error(hr("RandomChoice(domain, k)",t))},RandomSample:(e,n,t)=>{throw new Error(hr("RandomSample(xs, k)",t))},RandomShuffle:(e,n,t)=>{throw new Error(hr("RandomShuffle(xs)",t))},Apply:(e,n,t)=>{let r=Nf(e,t);if(typeof r=="string")throw new Error(`Could not compile \`Apply\`: ${r}`);return Le(r,n,t)},Function:()=>{throw new Error("Anonymous functions (Function) are not supported in GPU targets")}};pn(Tn.Power,tt("exp2",0,2));pn(Tn.Clamp,hs("min",0));pn(Tn.ElementMax,hs("max"));pn(Tn.ElementMin,hs("min"));function hs(e,n){return(t,r)=>{if(Ae(r)?.callee!==e||t.some(a=>a==null)||t.some(a=>p.isComplexValued(a)))return;let o=t.map(V);if(n!==void 0&&typeof o[n]!="number"||new Set(o.filter(a=>typeof a=="number")).size!==1||!o.every(a=>a==="scalar"||typeof a=="number"))return;let s=new Set;return o.forEach((a,l)=>{a==="scalar"&&s.add(l)}),s.size>0?s:void 0}}function Nf(e,n){try{e=Mr(e)??e}catch(d){return d.message.replace(/^Could not compile `Apply`: /,"")}if(Or(e))return El(e,n.language??"gpu");let[t,...r]=e;if(t===void 0)return"missing function";let o=r,i=b(t,"Derivative")?p.appliedDerivativeLiteral(e):t;if(!b(i,"Function"))return b(t,"Derivative")?`${p.appliedDerivativeDeclineReason(e)}, and target '${n.language}' has no numerical derivative.`:`only a function literal or the derivative of a function compiles as the callee on target '${n.language}'.`;let s=Za(i,o);s!==void 0&&(o=s);let a=i.ops.slice(1);if(a.length!==o.length)return`the function takes ${a.length} parameter(s) but ${o.length} argument(s) are supplied.`;let l={};for(let[d,g]of a.entries()){let _=Jn(g)?"":xn(g);if(!_)return"a parameter of the function is not a plain name.";l[_]=o[d]}let u=i.ops[0],f=b(u,"Block")&&u.nops===1?u.op1:u;if(b(f,"Block"))return"the body of the function has more than one statement.";if(!o.every(d=>d.isPure===!0))return"an argument has an effect, which the substitution would repeat.";let c=zr(f);for(let[d,g]of Object.entries(l)){if(c.has(d))return`the body of the function rebinds \`${d}\`.`;for(let _ of g.symbols)if(c.has(_))return`the body of the function binds \`${_}\`, which an argument reads.`}if(Da(i.type.type)&&o.some(ms))return Cd(i,f,Object.keys(l),o,n);let m=p.appliedArgumentTypeMismatch(i,o,!1);return m!==void 0?m:f.subs(l)}function Cd(e,n,t,r,o){let i,s=[];for(let l of r){if(!ms(l)){s.push(void 0);continue}let u=Sd(l);if(u===void 0)return`the function applies to each element of the argument \`${l.toString()}\`, but target '${o.language}' cannot write out its elements: its length is not known at compile time, or it has more than ${st} elements.`;if(i!==void 0&&u.length!==i)return`the function applies to each element of collection arguments of different lengths (${i} and ${u.length}).`;i=u.length,s.push(u)}let a=[];for(let l=0;l<(i??0);l++){let u=r.map((f,c)=>s[c]?.[l]??f);if(u.some((f,c)=>s[c]!==void 0&&ms(f))){let f=Nf([e,...u],o);if(typeof f=="string")return f;a.push(f)}else{let f=p.appliedArgumentTypeMismatch(e,u,!1);if(f!==void 0)return f;let c={};for(let[m,d]of t.entries())c[d]=u[m];a.push(n.subs(c))}}return e.engine.function("List",a)}function ms(e){if(Na(e))return!0;let n=Gn(e.type.type);return q(n,Xn)&&!q(n,"string")&&!(typeof n=="object"&&n.kind==="tuple")}function Sd(e){let n=e.engine;if(b(e,"List"))return e.nops<=st?e.ops:void 0;if(b(e,"Range")&&(e.nops===2||e.nops===3)){let r=e.ops[0].re,o=e.ops[1].re,i=e.nops===3?e.ops[2].re:1;if(![r,o,i].every(Number.isFinite)||i===0)return;let s=Wo(r,o,i);return s>st?void 0:Array.from({length:s},(a,l)=>n.number(r+l*i))}let t=V(e);if(typeof t=="number")return Array.from({length:t},(r,o)=>n.function("At",[e,n.number(o+1)]))}function gr(e,n,t,r,o){let i=e[0];if(!b(i))return n(i);let s=i.ops;if(s.length===0)return n(i);let a=s.length,l=s[0],u=b(l)?l.nops:0;if(u===1&&s.every(f=>b(f)&&f.nops===1)){let f=s.map(c=>n(b(c)?c.ops[0]:c));return a>=2&&a<=4?`${t(a)}(${f.join(", ")})`:(at("Matrix",a),`${o(a)}(${f.join(", ")})`)}if(a===u&&a>=2&&a<=4&&s.every(f=>b(f)&&f.nops===u)){let f=[];for(let c=0;c<u;c++){let m=s.map(d=>n(b(d)?d.ops[c]:d));f.push(`${t(a)}(${m.join(", ")})`)}return`${r(a)}(${f.join(", ")})`}return n(i)}function Re(e,n){return["x","y"].map(t=>n?`if ((bitcast<u32>(${e}.${t}) & 0x7FFFFFFFu) > 0x7F800000u) { return vec2f(${e}.${t}); }`:`if ((floatBitsToUint(${e}.${t}) & 0x7FFFFFFFu) > 0x7F800000u) return vec2(${e}.${t});`).join(`
  `)}var gs={__proto__:null,_gpu_cmul:{deps:[],glsl:`vec2 _gpu_cmul(vec2 a, vec2 b) {
  return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}`,wgsl:`fn _gpu_cmul(a: vec2f, b: vec2f) -> vec2f {
  return vec2f(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}`},_gpu_cdiv:{deps:[],glsl:`vec2 _gpu_cdiv(vec2 a, vec2 b) {
  float d = b.x * b.x + b.y * b.y;
  return vec2((a.x * b.x + a.y * b.y) / d, (a.y * b.x - a.x * b.y) / d);
}`,wgsl:`fn _gpu_cdiv(a: vec2f, b: vec2f) -> vec2f {
  let d = b.x * b.x + b.y * b.y;
  return vec2f((a.x * b.x + a.y * b.y) / d, (a.y * b.x - a.x * b.y) / d);
}`},_gpu_cexp:{deps:[],glsl:`vec2 _gpu_cexp(vec2 z) {
  ${Re("z",!1)}
  float e = exp(z.x);
  return vec2(e * cos(z.y), e * sin(z.y));
}`,wgsl:`fn _gpu_cexp(z: vec2f) -> vec2f {
  ${Re("z",!0)}
  let e = exp(z.x);
  return vec2f(e * cos(z.y), e * sin(z.y));
}`},_gpu_cln:{deps:[],glsl:`vec2 _gpu_cln(vec2 z) {
  ${Re("z",!1)}
  return vec2(log(length(z)), atan(z.y, z.x));
}`,wgsl:`fn _gpu_cln(z: vec2f) -> vec2f {
  ${Re("z",!0)}
  return vec2f(log(length(z)), atan2(z.y, z.x));
}`},_gpu_cpow:{deps:["_gpu_cexp","_gpu_cmul","_gpu_cln"],glsl:`vec2 _gpu_cpow(vec2 z, vec2 w) {
  if (z.x == 0.0 && z.y == 0.0 && w.x > 0.0) return vec2(0.0);
  return _gpu_cexp(_gpu_cmul(w, _gpu_cln(z)));
}`,wgsl:`fn _gpu_cpow(z: vec2f, w: vec2f) -> vec2f {
  if (z.x == 0.0 && z.y == 0.0 && w.x > 0.0) { return vec2f(0.0); }
  return _gpu_cexp(_gpu_cmul(w, _gpu_cln(z)));
}`},_gpu_cpowrr:{deps:["_gpu_cpow"],glsl:`vec2 _gpu_cpowrr(vec2 z, float e, float s) {
  if (z.y == 0.0 && z.x < 0.0) return vec2(s * pow(-z.x, e), 0.0);
  return _gpu_cpow(z, vec2(e, 0.0));
}`,wgsl:`fn _gpu_cpowrr(z: vec2f, e: f32, s: f32) -> vec2f {
  if (z.y == 0.0 && z.x < 0.0) { return vec2f(s * pow(-z.x, e), 0.0); }
  return _gpu_cpow(z, vec2f(e, 0.0));
}`},_gpu_csqrt:{deps:[],glsl:`vec2 _gpu_csqrt(vec2 z) {
  ${Re("z",!1)}
  float r = length(z);
  float theta = atan(z.y, z.x);
  return sqrt(r) * vec2(cos(theta * 0.5), sin(theta * 0.5));
}`,wgsl:`fn _gpu_csqrt(z: vec2f) -> vec2f {
  ${Re("z",!0)}
  let r = length(z);
  let theta = atan2(z.y, z.x);
  return sqrt(r) * vec2f(cos(theta * 0.5), sin(theta * 0.5));
}`},_gpu_csin:{deps:[],glsl:`vec2 _gpu_csin(vec2 z) {
  ${Re("z",!1)}
  return vec2(sin(z.x) * cosh(z.y), cos(z.x) * sinh(z.y));
}`,wgsl:`fn _gpu_csin(z: vec2f) -> vec2f {
  ${Re("z",!0)}
  return vec2f(sin(z.x) * cosh(z.y), cos(z.x) * sinh(z.y));
}`},_gpu_ccos:{deps:[],glsl:`vec2 _gpu_ccos(vec2 z) {
  ${Re("z",!1)}
  return vec2(cos(z.x) * cosh(z.y), -sin(z.x) * sinh(z.y));
}`,wgsl:`fn _gpu_ccos(z: vec2f) -> vec2f {
  ${Re("z",!0)}
  return vec2f(cos(z.x) * cosh(z.y), -sin(z.x) * sinh(z.y));
}`},_gpu_ctan:{deps:["_gpu_cdiv","_gpu_csin","_gpu_ccos"],glsl:`vec2 _gpu_ctan(vec2 z) {
  return _gpu_cdiv(_gpu_csin(z), _gpu_ccos(z));
}`,wgsl:`fn _gpu_ctan(z: vec2f) -> vec2f {
  return _gpu_cdiv(_gpu_csin(z), _gpu_ccos(z));
}`},_gpu_csinh:{deps:[],glsl:`vec2 _gpu_csinh(vec2 z) {
  ${Re("z",!1)}
  return vec2(sinh(z.x) * cos(z.y), cosh(z.x) * sin(z.y));
}`,wgsl:`fn _gpu_csinh(z: vec2f) -> vec2f {
  ${Re("z",!0)}
  return vec2f(sinh(z.x) * cos(z.y), cosh(z.x) * sin(z.y));
}`},_gpu_ccosh:{deps:[],glsl:`vec2 _gpu_ccosh(vec2 z) {
  ${Re("z",!1)}
  return vec2(cosh(z.x) * cos(z.y), sinh(z.x) * sin(z.y));
}`,wgsl:`fn _gpu_ccosh(z: vec2f) -> vec2f {
  ${Re("z",!0)}
  return vec2f(cosh(z.x) * cos(z.y), sinh(z.x) * sin(z.y));
}`},_gpu_ctanh:{deps:["_gpu_cdiv","_gpu_csinh","_gpu_ccosh"],glsl:`vec2 _gpu_ctanh(vec2 z) {
  return _gpu_cdiv(_gpu_csinh(z), _gpu_ccosh(z));
}`,wgsl:`fn _gpu_ctanh(z: vec2f) -> vec2f {
  return _gpu_cdiv(_gpu_csinh(z), _gpu_ccosh(z));
}`},_gpu_chypot:{deps:[],glsl:`float _gpu_chypot(float x, float y) {
  float ax = abs(x);
  float ay = abs(y);
  float m = max(ax, ay);
  if (m == 0.0) return 0.0;
  float n = min(ax, ay) / m;
  return m * sqrt(1.0 + n * n);
}`,wgsl:`fn _gpu_chypot(x: f32, y: f32) -> f32 {
  let ax = abs(x);
  let ay = abs(y);
  let m = max(ax, ay);
  if (m == 0.0) { return 0.0; }
  let n = min(ax, ay) / m;
  return m * sqrt(1.0 + n * n);
}`},_gpu_clog1p:{deps:[],glsl:`float _gpu_clog1p(float x) {
  if (x >= 0.5) return log(1.0 + x);
  float s = x / (2.0 + x);
  float t = s * s;
  return 2.0 * s * (1.0 + t * (0.3333333333333333 + t * (0.2 + t * (0.14285714285714285 + t * (0.1111111111111111 + t * 0.09090909090909091)))));
}`,wgsl:`fn _gpu_clog1p(x: f32) -> f32 {
  if (x >= 0.5) { return log(1.0 + x); }
  let s = x / (2.0 + x);
  let t = s * s;
  return 2.0 * s * (1.0 + t * (0.3333333333333333 + t * (0.2 + t * (0.14285714285714285 + t * (0.1111111111111111 + t * 0.09090909090909091)))));
}`},_gpu_casinhr:{deps:["_gpu_clog1p"],glsl:`float _gpu_casinhr(float v) {
  float a = abs(v);
  float r = a > 1.0e9 ? log(a) + 0.6931471805599453 : _gpu_clog1p(a + a * a / (1.0 + sqrt(1.0 + a * a)));
  return v < 0.0 ? -r : r;
}`,wgsl:`fn _gpu_casinhr(v: f32) -> f32 {
  let a = abs(v);
  let r = select(_gpu_clog1p(a + a * a / (1.0 + sqrt(1.0 + a * a))), log(a) + 0.6931471805599453, a > 1.0e9);
  return select(r, -r, v < 0.0);
}`},_gpu_czsign:{deps:[],glsl:`float _gpu_czsign(float y, float s) {
  return (y < 0.0 || (y == 0.0 && s < 0.0)) ? -1.0 : 1.0;
}`,wgsl:`fn _gpu_czsign(y: f32, s: f32) -> f32 {
  return select(1.0, -1.0, y < 0.0 || (y == 0.0 && s < 0.0));
}`},_gpu_csqrts:{deps:["_gpu_chypot","_gpu_czsign"],glsl:`vec2 _gpu_csqrts(float x, float y, float s) {
  if (x == 0.0 && y == 0.0) return vec2(0.0);
  float h = _gpu_chypot(x, y);
  if (x >= 0.0) {
    float t = sqrt(0.5 * x + 0.5 * h);
    return vec2(t, y / (2.0 * t));
  }
  float t = sqrt(0.5 * h - 0.5 * x);
  return vec2(abs(y) / (2.0 * t), _gpu_czsign(y, s) * t);
}`,wgsl:`fn _gpu_csqrts(x: f32, y: f32, s: f32) -> vec2f {
  if (x == 0.0 && y == 0.0) { return vec2f(0.0); }
  let h = _gpu_chypot(x, y);
  if (x >= 0.0) {
    let t = sqrt(0.5 * x + 0.5 * h);
    return vec2f(t, y / (2.0 * t));
  }
  let t = sqrt(0.5 * h - 0.5 * x);
  return vec2f(abs(y) / (2.0 * t), _gpu_czsign(y, s) * t);
}`},_gpu_casin_core:{deps:["_gpu_csqrts","_gpu_casinhr"],glsl:`vec2 _gpu_casin_core(float x0, float y0, float s) {
  float x = x0;
  float y = y0;
  float k = 0.0;
  if (max(abs(x), abs(y)) > 1.0e37) {
    x = x * 0.0625;
    y = y * 0.0625;
    k = 2.772588722239781;
  }
  vec2 a = _gpu_csqrts(1.0 - x, -y, -s);
  vec2 b = _gpu_csqrts(1.0 + x, y, s);
  float im = _gpu_casinhr(a.x * b.y - a.y * b.x);
  return vec2(atan(x, a.x * b.x - a.y * b.y), im < 0.0 ? im - k : im + k);
}`,wgsl:`fn _gpu_casin_core(x0: f32, y0: f32, s: f32) -> vec2f {
  var x = x0;
  var y = y0;
  var k = 0.0;
  if (max(abs(x), abs(y)) > 1.0e37) {
    x = x * 0.0625;
    y = y * 0.0625;
    k = 2.772588722239781;
  }
  let a = _gpu_csqrts(1.0 - x, -y, -s);
  let b = _gpu_csqrts(1.0 + x, y, s);
  let im = _gpu_casinhr(a.x * b.y - a.y * b.x);
  return vec2f(atan2(x, a.x * b.x - a.y * b.y), select(im + k, im - k, im < 0.0));
}`},_gpu_casin:{deps:["_gpu_casin_core"],glsl:`vec2 _gpu_casin(vec2 z) {
  return _gpu_casin_core(z.x, z.y, z.x > 0.0 ? -1.0 : 1.0);
}`,wgsl:`fn _gpu_casin(z: vec2f) -> vec2f {
  return _gpu_casin_core(z.x, z.y, select(1.0, -1.0, z.x > 0.0));
}`},_gpu_cacos:{deps:["_gpu_csqrts","_gpu_casinhr"],glsl:`vec2 _gpu_cacos(vec2 z) {
  float x = z.x;
  float y = z.y;
  float k = 0.0;
  if (max(abs(x), abs(y)) > 1.0e37) {
    x = x * 0.0625;
    y = y * 0.0625;
    k = 2.772588722239781;
  }
  float s = z.x > 0.0 ? -1.0 : 1.0;
  vec2 a = _gpu_csqrts(1.0 - x, -y, -s);
  vec2 b = _gpu_csqrts(1.0 + x, y, s);
  float im = _gpu_casinhr(b.x * a.y - b.y * a.x);
  return vec2(2.0 * atan(a.x, b.x), im < 0.0 ? im - k : im + k);
}`,wgsl:`fn _gpu_cacos(z: vec2f) -> vec2f {
  var x = z.x;
  var y = z.y;
  var k = 0.0;
  if (max(abs(x), abs(y)) > 1.0e37) {
    x = x * 0.0625;
    y = y * 0.0625;
    k = 2.772588722239781;
  }
  let s = select(1.0, -1.0, z.x > 0.0);
  let a = _gpu_csqrts(1.0 - x, -y, -s);
  let b = _gpu_csqrts(1.0 + x, y, s);
  let im = _gpu_casinhr(b.x * a.y - b.y * a.x);
  return vec2f(2.0 * atan2(a.x, b.x), select(im + k, im - k, im < 0.0));
}`},_gpu_catanh_core:{deps:["_gpu_chypot","_gpu_clog1p","_gpu_czsign"],glsl:`vec2 _gpu_catanh_core(float x, float y, float s) {
  if (_gpu_chypot(x, y) > 1.0e18) {
    float h4 = _gpu_chypot(0.25 * x, 0.25 * y);
    float q = y / 8.0 / h4 / h4;
    return vec2(x / 16.0 / h4 / h4, q == 0.0 ? _gpu_czsign(y, s) * 1.5707963267948966 : 0.5 * atan(q, -1.0));
  }
  float ax = abs(x);
  float u = 1.0 - ax;
  float d = u * u + y * y;
  float re = d < 1.0e-30 ? 0.5 * (log(_gpu_chypot(1.0 + ax, y)) - log(_gpu_chypot(u, y))) : 0.25 * _gpu_clog1p(4.0 * ax / d);
  float m = u * (1.0 + ax) - y * y;
  float im = 2.0 * y == 0.0 ? (m < 0.0 ? _gpu_czsign(y, s) * 1.5707963267948966 : 0.0) : 0.5 * atan(2.0 * y, m);
  return vec2(x < 0.0 ? -re : re, im);
}`,wgsl:`fn _gpu_catanh_core(x: f32, y: f32, s: f32) -> vec2f {
  if (_gpu_chypot(x, y) > 1.0e18) {
    let h4 = _gpu_chypot(0.25 * x, 0.25 * y);
    let q = y / 8.0 / h4 / h4;
    return vec2f(x / 16.0 / h4 / h4, select(0.5 * atan2(q, -1.0), _gpu_czsign(y, s) * 1.5707963267948966, q == 0.0));
  }
  let ax = abs(x);
  let u = 1.0 - ax;
  let d = u * u + y * y;
  let re = select(0.25 * _gpu_clog1p(4.0 * ax / d), 0.5 * (log(_gpu_chypot(1.0 + ax, y)) - log(_gpu_chypot(u, y))), d < 1.0e-30);
  let m = u * (1.0 + ax) - y * y;
  let im = select(0.5 * atan2(2.0 * y, m), select(0.0, _gpu_czsign(y, s) * 1.5707963267948966, m < 0.0), 2.0 * y == 0.0);
  return vec2f(select(re, -re, x < 0.0), im);
}`},_gpu_catanh:{deps:["_gpu_catanh_core"],glsl:`vec2 _gpu_catanh(vec2 z) {
  return _gpu_catanh_core(z.x, z.y, z.x > 0.0 ? -1.0 : 1.0);
}`,wgsl:`fn _gpu_catanh(z: vec2f) -> vec2f {
  return _gpu_catanh_core(z.x, z.y, select(1.0, -1.0, z.x > 0.0));
}`},_gpu_catan:{deps:["_gpu_catanh_core","_gpu_inf"],glsl:`vec2 _gpu_catan(vec2 z) {
  if (z.x == 0.0 && abs(z.y) == 1.0) return vec2(_gpu_inf(), _gpu_inf());
  vec2 r = _gpu_catanh_core(-z.y, z.x, z.y < 0.0 ? -1.0 : 1.0);
  return vec2(r.y, -r.x);
}`,wgsl:`fn _gpu_catan(z: vec2f) -> vec2f {
  if (z.x == 0.0 && abs(z.y) == 1.0) { return vec2f(_gpu_inf(), _gpu_inf()); }
  let r = _gpu_catanh_core(-z.y, z.x, select(1.0, -1.0, z.y < 0.0));
  return vec2f(r.y, -r.x);
}`},_gpu_casinh:{deps:["_gpu_casin_core"],glsl:`vec2 _gpu_casinh(vec2 z) {
  vec2 r = _gpu_casin_core(-z.y, z.x, z.y < 0.0 ? -1.0 : 1.0);
  return vec2(r.y, -r.x);
}`,wgsl:`fn _gpu_casinh(z: vec2f) -> vec2f {
  let r = _gpu_casin_core(-z.y, z.x, select(1.0, -1.0, z.y < 0.0));
  return vec2f(r.y, -r.x);
}`},_gpu_cacosh:{deps:["_gpu_csqrts","_gpu_casinhr"],glsl:`vec2 _gpu_cacosh(vec2 z) {
  float x = z.x;
  float y = z.y;
  float k = 0.0;
  if (max(abs(x), abs(y)) > 1.0e37) {
    x = x * 0.0625;
    y = y * 0.0625;
    k = 2.772588722239781;
  }
  vec2 a = _gpu_csqrts(x - 1.0, y, 1.0);
  vec2 b = _gpu_csqrts(x + 1.0, y, 1.0);
  return vec2(_gpu_casinhr(a.x * b.x + a.y * b.y) + k, 2.0 * atan(a.y, b.x));
}`,wgsl:`fn _gpu_cacosh(z: vec2f) -> vec2f {
  var x = z.x;
  var y = z.y;
  var k = 0.0;
  if (max(abs(x), abs(y)) > 1.0e37) {
    x = x * 0.0625;
    y = y * 0.0625;
    k = 2.772588722239781;
  }
  let a = _gpu_csqrts(x - 1.0, y, 1.0);
  let b = _gpu_csqrts(x + 1.0, y, 1.0);
  return vec2f(_gpu_casinhr(a.x * b.x + a.y * b.y) + k, 2.0 * atan2(a.y, b.x));
}`},_gpu_cinv:{deps:[],glsl:`vec2 _gpu_cinv(vec2 z) {
  if (abs(z.x) >= abs(z.y)) {
    float r = z.y / z.x;
    float d = z.x + z.y * r;
    return vec2(1.0 / d, -r / d);
  }
  float r = z.x / z.y;
  float d = z.x * r + z.y;
  return vec2(r / d, -1.0 / d);
}`,wgsl:`fn _gpu_cinv(z: vec2f) -> vec2f {
  if (abs(z.x) >= abs(z.y)) {
    let r = z.y / z.x;
    let d = z.x + z.y * r;
    return vec2f(1.0 / d, -r / d);
  }
  let r = z.x / z.y;
  let d = z.x * r + z.y;
  return vec2f(r / d, -1.0 / d);
}`},_gpu_cln2z:{deps:["_gpu_chypot"],glsl:`float _gpu_cln2z(vec2 z) {
  return 45.054566736396445 - log(_gpu_chypot(z.x * 18446744073709551616.0, z.y * 18446744073709551616.0));
}`,wgsl:`fn _gpu_cln2z(z: vec2f) -> f32 {
  return 45.054566736396445 - log(_gpu_chypot(z.x * 18446744073709551616.0, z.y * 18446744073709551616.0));
}`},_gpu_cinvpm:{deps:["_gpu_cinv","_gpu_chypot"],glsl:`vec2 _gpu_cinvpm(vec2 z, float t) {
  vec2 w = _gpu_cinv(z);
  if (_gpu_chypot(z.x, z.y) > 2.0) return vec2(1.0 + t * w.x, t * w.y);
  float nx = z.x + t;
  return vec2(nx * w.x - z.y * w.y, nx * w.y + z.y * w.x);
}`,wgsl:`fn _gpu_cinvpm(z: vec2f, t: f32) -> vec2f {
  let w = _gpu_cinv(z);
  if (_gpu_chypot(z.x, z.y) > 2.0) { return vec2f(1.0 + t * w.x, t * w.y); }
  let nx = z.x + t;
  return vec2f(nx * w.x - z.y * w.y, nx * w.y + z.y * w.x);
}`},_gpu_cacsc:{deps:["_gpu_cinv","_gpu_cinvpm","_gpu_csqrts","_gpu_casinhr","_gpu_cln2z"],glsl:`vec2 _gpu_cacsc(vec2 z) {
  float s = z.y == 0.0 ? (z.x > 0.0 ? -1.0 : 1.0) : (z.y > 0.0 ? -1.0 : 1.0);
  if (_gpu_chypot(z.x, z.y) < 1.0e-18 && (z.x != 0.0 || z.y != 0.0)) return vec2(atan(z.x, abs(z.y)), s * _gpu_cln2z(z));
  vec2 w = _gpu_cinv(z);
  vec2 p = _gpu_cinvpm(z, -1.0);
  vec2 q = _gpu_cinvpm(z, 1.0);
  vec2 a = _gpu_csqrts(p.x, p.y, -s);
  vec2 b = _gpu_csqrts(q.x, q.y, s);
  return vec2(atan(w.x, a.x * b.x - a.y * b.y), _gpu_casinhr(a.x * b.y - a.y * b.x));
}`,wgsl:`fn _gpu_cacsc(z: vec2f) -> vec2f {
  let s = select(select(1.0, -1.0, z.y > 0.0), select(1.0, -1.0, z.x > 0.0), z.y == 0.0);
  if (_gpu_chypot(z.x, z.y) < 1.0e-18 && (z.x != 0.0 || z.y != 0.0)) { return vec2f(atan2(z.x, abs(z.y)), s * _gpu_cln2z(z)); }
  let w = _gpu_cinv(z);
  let p = _gpu_cinvpm(z, -1.0);
  let q = _gpu_cinvpm(z, 1.0);
  let a = _gpu_csqrts(p.x, p.y, -s);
  let b = _gpu_csqrts(q.x, q.y, s);
  return vec2f(atan2(w.x, a.x * b.x - a.y * b.y), _gpu_casinhr(a.x * b.y - a.y * b.x));
}`},_gpu_casec:{deps:["_gpu_cinvpm","_gpu_csqrts","_gpu_casinhr","_gpu_cln2z"],glsl:`vec2 _gpu_casec(vec2 z) {
  float s = z.y == 0.0 ? (z.x > 0.0 ? -1.0 : 1.0) : (z.y > 0.0 ? -1.0 : 1.0);
  if (_gpu_chypot(z.x, z.y) < 1.0e-18 && (z.x != 0.0 || z.y != 0.0)) return vec2(atan(abs(z.y), z.x), -s * _gpu_cln2z(z));
  vec2 p = _gpu_cinvpm(z, -1.0);
  vec2 q = _gpu_cinvpm(z, 1.0);
  vec2 a = _gpu_csqrts(p.x, p.y, -s);
  vec2 b = _gpu_csqrts(q.x, q.y, s);
  return vec2(2.0 * atan(a.x, b.x), _gpu_casinhr(b.x * a.y - b.y * a.x));
}`,wgsl:`fn _gpu_casec(z: vec2f) -> vec2f {
  let s = select(select(1.0, -1.0, z.y > 0.0), select(1.0, -1.0, z.x > 0.0), z.y == 0.0);
  if (_gpu_chypot(z.x, z.y) < 1.0e-18 && (z.x != 0.0 || z.y != 0.0)) { return vec2f(atan2(abs(z.y), z.x), -s * _gpu_cln2z(z)); }
  let p = _gpu_cinvpm(z, -1.0);
  let q = _gpu_cinvpm(z, 1.0);
  let a = _gpu_csqrts(p.x, p.y, -s);
  let b = _gpu_csqrts(q.x, q.y, s);
  return vec2f(2.0 * atan2(a.x, b.x), _gpu_casinhr(b.x * a.y - b.y * a.x));
}`},_gpu_casech:{deps:["_gpu_cinvpm","_gpu_csqrts","_gpu_casinhr","_gpu_cln2z","_gpu_inf"],glsl:`vec2 _gpu_casech(vec2 z) {
  if (z.x == 0.0 && z.y == 0.0) return vec2(_gpu_inf(), 0.0);
  if (_gpu_chypot(z.x, z.y) < 1.0e-18) return vec2(_gpu_cln2z(z), z.y == 0.0 && z.x < 0.0 ? 3.141592653589793 : -atan(z.y, z.x));
  float s = z.y > 0.0 ? -1.0 : 1.0;
  vec2 p = _gpu_cinvpm(z, -1.0);
  vec2 q = _gpu_cinvpm(z, 1.0);
  vec2 a = _gpu_csqrts(-p.x, -p.y, s);
  vec2 b = _gpu_csqrts(q.x, q.y, s);
  return vec2(_gpu_casinhr(a.x * b.x + a.y * b.y), 2.0 * atan(a.y, b.x));
}`,wgsl:`fn _gpu_casech(z: vec2f) -> vec2f {
  if (z.x == 0.0 && z.y == 0.0) { return vec2f(_gpu_inf(), 0.0); }
  if (_gpu_chypot(z.x, z.y) < 1.0e-18) { return vec2f(_gpu_cln2z(z), select(-atan2(z.y, z.x), 3.141592653589793, z.y == 0.0 && z.x < 0.0)); }
  let s = select(1.0, -1.0, z.y > 0.0);
  let p = _gpu_cinvpm(z, -1.0);
  let q = _gpu_cinvpm(z, 1.0);
  let a = _gpu_csqrts(-p.x, -p.y, s);
  let b = _gpu_csqrts(q.x, q.y, s);
  return vec2f(_gpu_casinhr(a.x * b.x + a.y * b.y), 2.0 * atan2(a.y, b.x));
}`},_gpu_cacoth:{deps:["_gpu_chypot","_gpu_clog1p"],glsl:`vec2 _gpu_cacoth(vec2 z) {
  float x = z.x;
  float y = z.y;
  if (_gpu_chypot(x, y) > 1.0e18) {
    float h4 = _gpu_chypot(0.25 * x, 0.25 * y);
    return vec2(x / 16.0 / h4 / h4, -y / 16.0 / h4 / h4);
  }
  float ax = abs(x);
  float u = 1.0 - ax;
  float d = u * u + y * y;
  float re = d < 1.0e-30 ? 0.5 * (log(_gpu_chypot(1.0 + ax, y)) - log(_gpu_chypot(u, y))) : 0.25 * _gpu_clog1p(4.0 * ax / d);
  float m = (ax - 1.0) * (ax + 1.0) + y * y;
  float im = 2.0 * y == 0.0 ? (m < 0.0 ? (x > 0.0 ? -1.5707963267948966 : 1.5707963267948966) : 0.0) : 0.5 * atan(-2.0 * y, m);
  return vec2(x < 0.0 ? -re : re, im);
}`,wgsl:`fn _gpu_cacoth(z: vec2f) -> vec2f {
  let x = z.x;
  let y = z.y;
  if (_gpu_chypot(x, y) > 1.0e18) {
    let h4 = _gpu_chypot(0.25 * x, 0.25 * y);
    return vec2f(x / 16.0 / h4 / h4, -y / 16.0 / h4 / h4);
  }
  let ax = abs(x);
  let u = 1.0 - ax;
  let d = u * u + y * y;
  let re = select(0.25 * _gpu_clog1p(4.0 * ax / d), 0.5 * (log(_gpu_chypot(1.0 + ax, y)) - log(_gpu_chypot(u, y))), d < 1.0e-30);
  let m = (ax - 1.0) * (ax + 1.0) + y * y;
  let im = select(0.5 * atan2(-2.0 * y, m), select(0.0, select(1.5707963267948966, -1.5707963267948966, x > 0.0), m < 0.0), 2.0 * y == 0.0);
  return vec2f(select(re, -re, x < 0.0), im);
}`}};function Ff(e,n){let t=new Set;for(let a of Object.keys(gs))e.includes(a)&&t.add(a);if(t.size===0)return"";let r=new Set;function o(a){if(r.has(a))return;let l=gs[a];if(l){for(let u of l.deps)o(u);r.add(a)}}for(let a of t)o(a);let i=n==="wgsl"?"wgsl":"glsl",s=[];for(let a of r)s.push(gs[a][i]);return`
`+s.join(`

`)+`
`}var _s=`
float _gpu_gamma(float z) {
  const float PI = 3.14159265358979;
  // Gamma has a pole at every non-positive integer, and the reflection
  // formula below cannot see it: sin(PI * z) is not exactly 0 there in
  // floating point, so Gamma(-2.0) came back as a large finite number. The
  // interpreter answers the undirected infinity at a pole; its float
  // projection is Infinity (pole-encoding ruling 2026-08-28 \u2014 the magnitude
  // survives, the missing direction does not). The lower bound keeps
  // -Infinity out of the guard: it satisfies z == floor(z) but is not a
  // pole, and Gamma(-Infinity) is NaN in the interpreter's numeric lane.
  if (z <= 0.0 && z == floor(z) && z >= -3.4028234663852886e38) return _gpu_inf();
  // Gamma(+Infinity) is +Infinity; the Lanczos sum below gives NaN for it.
  if (z > 3.4028234663852886e38) return z;
  float w = z;
  if (z < 0.5) w = 1.0 - z;
  w -= 1.0;
  float x = 0.99999999999980993;
  x += 676.5203681218851 / (w + 1.0);
  x += -1259.1392167224028 / (w + 2.0);
  x += 771.32342877765313 / (w + 3.0);
  x += -176.61502916214059 / (w + 4.0);
  x += 12.507343278686905 / (w + 5.0);
  x += -0.13857109526572012 / (w + 6.0);
  x += 9.9843695780195716e-6 / (w + 7.0);
  x += 1.5056327351493116e-7 / (w + 8.0);
  float t = w + 7.5;
  float g = sqrt(2.0 * PI) * pow(t, w + 0.5) * exp(-t) * x;
  if (z < 0.5) return PI / (sin(PI * z) * g);
  return g;
}

float _gpu_gammaln(float z) {
  const float PI = 3.14159265358979;
  // ln|Gamma(z)|, as the interpreter answers on the real axis: +Infinity at
  // a pole (a non-positive integer), and the reflection formula
  // ln(PI) - ln|sin(PI z)| - lnGamma(1 - z) for z < 0. |sin(PI z)| is
  // sin(PI fract(z)); the product PI z loses its fraction for a large |z|.
  if (z <= 0.0 && z == floor(z) && z >= -3.4028234663852886e38) return _gpu_inf();
  if (z < 0.0) {
    float w = 1.0 - z;
    float w3 = w * w * w;
    float lw = w * log(w) - w - 0.5 * log(w)
      + 0.5 * log(2.0 * PI)
      + 1.0 / (12.0 * w)
      - 1.0 / (360.0 * w3)
      + 1.0 / (1260.0 * w3 * w * w);
    return log(PI) - log(sin(PI * (z - floor(z)))) - lw;
  }
  float z3 = z * z * z;
  return z * log(z) - z - 0.5 * log(z)
    + 0.5 * log(2.0 * PI)
    + 1.0 / (12.0 * z)
    - 1.0 / (360.0 * z3)
    + 1.0 / (1260.0 * z3 * z * z);
}
`,bs=`
fn _gpu_gamma(z: f32) -> f32 {
  let PI = 3.14159265358979;
  // See the GLSL preamble: a non-positive integer is a pole the reflection
  // formula misses; the pole answers the float projection of the undirected
  // infinity, which is +Infinity (pole-encoding ruling 2026-08-28), from the
  // WGSL _gpu_inf() helper (GPU_INF_PREAMBLE_WGSL). The lower
  // bound keeps -Infinity out of the guard (it is not a pole). (No
  // backticks in this comment: it lives inside a TypeScript template
  // literal, which one would terminate.)
  if (z <= 0.0 && z == floor(z) && z >= -3.4028234663852886e38) { return _gpu_inf(); }
  // Gamma(+Infinity) is +Infinity; the Lanczos sum below gives NaN for it.
  if (z > 3.4028234663852886e38) { return z; }
  var w = z;
  if (z < 0.5) { w = 1.0 - z; }
  w = w - 1.0;
  var x = 0.99999999999980993;
  x = x + 676.5203681218851 / (w + 1.0);
  x = x + -1259.1392167224028 / (w + 2.0);
  x = x + 771.32342877765313 / (w + 3.0);
  x = x + -176.61502916214059 / (w + 4.0);
  x = x + 12.507343278686905 / (w + 5.0);
  x = x + -0.13857109526572012 / (w + 6.0);
  x = x + 9.9843695780195716e-6 / (w + 7.0);
  x = x + 1.5056327351493116e-7 / (w + 8.0);
  let t = w + 7.5;
  let g = sqrt(2.0 * PI) * pow(t, w + 0.5) * exp(-t) * x;
  if (z < 0.5) { return PI / (sin(PI * z) * g); }
  return g;
}

fn _gpu_gammaln(z: f32) -> f32 {
  let PI = 3.14159265358979;
  // See the GLSL preamble: ln|Gamma(z)|, +Infinity at a pole, reflection for
  // z < 0.
  if (z <= 0.0 && z == floor(z) && z >= -3.4028234663852886e38) { return _gpu_inf(); }
  if (z < 0.0) {
    let w = 1.0 - z;
    let w3 = w * w * w;
    let lw = w * log(w) - w - 0.5 * log(w)
      + 0.5 * log(2.0 * PI)
      + 1.0 / (12.0 * w)
      - 1.0 / (360.0 * w3)
      + 1.0 / (1260.0 * w3 * w * w);
    return log(PI) - log(sin(PI * (z - floor(z)))) - lw;
  }
  let z3 = z * z * z;
  return z * log(z) - z - 0.5 * log(z)
    + 0.5 * log(2.0 * PI)
    + 1.0 / (12.0 * z)
    - 1.0 / (360.0 * z3)
    + 1.0 / (1260.0 * z3 * z * z);
}
`,ys=`
float _gpu_digamma(float x) {
  const float PI = 3.14159265358979;
  // A pole (a non-positive integer) answers the float projection of the
  // interpreter's undirected infinity, +Infinity, as _gpu_gamma does. The
  // lower bound keeps -inf out: it satisfies x == floor(x), and the
  // interpreter answers NaN there.
  if (x <= 0.0 && x == floor(x))
    return x >= -3.4028234663852886e38 ? _gpu_inf() : _gpu_nan();
  float result = 0.0;
  float z = x;
  if (x < 0.0) {
    // cot(PI x) = cot(PI r) with r = x - round(x), which is exact: the
    // product PI x keeps only an absolute accuracy next to an integer.
    float r = x - floor(x + 0.5);
    result = -PI / tan(PI * r);
    z = 1.0 - x;
  }
  for (int k = 0; k < 6; k++) {
    if (z >= 6.0) break;
    result -= 1.0 / z;
    z += 1.0;
  }
  float z2 = 1.0 / (z * z);
  return result + (log(z) - 0.5 / z -
    z2 * (1.0 / 12.0 - z2 * (1.0 / 120.0 - z2 * (1.0 / 252.0 - z2 / 240.0))));
}

float _gpu_trigamma(float x) {
  const float PI = 3.14159265358979;
  if (x <= 0.0 && x == floor(x)) // a pole, and -inf: see _gpu_digamma
    return x >= -3.4028234663852886e38 ? _gpu_inf() : _gpu_nan();
  float result = 0.0;
  float sgn = 1.0;
  float z = x;
  if (x < 0.0) {
    float sr = sin(PI * (x - floor(x + 0.5)));
    result = PI * PI / (sr * sr);
    sgn = -1.0;
    z = 1.0 - x;
  }
  float t = 0.0;
  for (int k = 0; k < 6; k++) {
    if (z >= 6.0) break;
    t += 1.0 / (z * z);
    z += 1.0;
  }
  float z2 = 1.0 / (z * z);
  t += 1.0 / z + 0.5 * z2 +
    z2 / z * (1.0 / 6.0 - z2 * (1.0 / 30.0 - z2 * (1.0 / 42.0 - z2 / 30.0)));
  return result + sgn * t;
}

float _gpu_polygamma(float n, float x) {
  if (n == 0.0) return _gpu_digamma(x);
  if (n == 1.0) return _gpu_trigamma(x);
  if (n != floor(n) || n < 0.0 || n > 24.0) return _gpu_nan();
  if (x <= 0.0 && x == floor(x)) // a pole, and -inf: see _gpu_digamma
    return x >= -3.4028234663852886e38 ? _gpu_inf() : _gpu_nan();
  if (x < -4096.0) return _gpu_nan(); // one term per unit of |x|
  if (x > 3.4e38) return 0.0; // +inf
  float fact = 1.0;
  for (int j = 2; j <= 24; j++) {
    if (float(j) > n) break;
    fact *= float(j);
  }
  float lf = log(fact);
  float n1 = n + 1.0;
  // With an odd power n + 1, a term at a negative z is negative.
  bool oddPower = mod(n1, 2.0) == 1.0;
  float sum = 0.0;
  float mag = 0.0;
  float xmax = 0.0;
  float z = x;
  for (int k = 0; k < 4132; k++) {
    if (z >= n + 10.0) break;
    float e = lf - n1 * log(abs(z));
    float t = exp(e);
    sum += (z < 0.0 && oddPower) ? -t : t;
    mag += t;
    xmax = max(xmax, abs(e));
    z += 1.0;
  }
  // The asymptotic series of the double kernel, from a = n!/z^(n+1):
  // (n-1)!/z^n + n!/(2 z^(n+1)) + sum B_2k (2k+n-1)!/((2k)! z^(2k+n)).
  float a = exp(lf - n1 * log(z));
  float tail = a * z / n + 0.5 * a;
  float f = a * n1 / (2.0 * z);
  float b[10] = float[10](
    1.0 / 6.0, -1.0 / 30.0, 1.0 / 42.0, -1.0 / 30.0, 5.0 / 66.0,
    -691.0 / 2730.0, 7.0 / 6.0, -3617.0 / 510.0, 43867.0 / 798.0,
    -174611.0 / 330.0
  );
  float prev = 3.0e38;
  for (int k = 1; k <= 10; k++) {
    float term = b[k - 1] * f;
    if (abs(term) >= prev) break;
    tail += term;
    prev = abs(term);
    float m = float(2 * k);
    f = f * (m + n) * (m + n + 1.0) / ((m + 1.0) * (m + 2.0) * z * z);
  }
  float res = sum + tail;
  // 500 = 3e-5 / 6e-8: the terms of both signs cancel where res is small
  // against their sizes. The ratio, not a product, so that nothing
  // overflows next to f32's largest value.
  if (x < 0.0 && oddPower && !((mag + abs(tail)) / abs(res) <= 500.0 / (6.0 + xmax)))
    return _gpu_nan();
  return mod(n, 2.0) == 0.0 ? -res : res;
}
`,vs=`
fn _gpu_digamma(x: f32) -> f32 {
  let PI = 3.14159265358979;
  // See the GLSL preamble: +Infinity at a pole, NaN at -inf.
  if (x <= 0.0 && x == floor(x)) {
    return select(_gpu_nan(), _gpu_inf(), x >= -3.4028234663852886e38);
  }
  var result: f32 = 0.0;
  var z: f32 = x;
  if (x < 0.0) {
    let r = x - floor(x + 0.5);
    result = -PI / tan(PI * r);
    z = 1.0 - x;
  }
  for (var k: i32 = 0; k < 6; k = k + 1) {
    if (z >= 6.0) { break; }
    result = result - 1.0 / z;
    z = z + 1.0;
  }
  let z2 = 1.0 / (z * z);
  return result + (log(z) - 0.5 / z -
    z2 * (1.0 / 12.0 - z2 * (1.0 / 120.0 - z2 * (1.0 / 252.0 - z2 / 240.0))));
}

fn _gpu_trigamma(x: f32) -> f32 {
  let PI = 3.14159265358979;
  if (x <= 0.0 && x == floor(x)) { // a pole, and -inf: see _gpu_digamma
    return select(_gpu_nan(), _gpu_inf(), x >= -3.4028234663852886e38);
  }
  var result: f32 = 0.0;
  var sgn: f32 = 1.0;
  var z: f32 = x;
  if (x < 0.0) {
    let sr = sin(PI * (x - floor(x + 0.5)));
    result = PI * PI / (sr * sr);
    sgn = -1.0;
    z = 1.0 - x;
  }
  var t: f32 = 0.0;
  for (var k: i32 = 0; k < 6; k = k + 1) {
    if (z >= 6.0) { break; }
    t = t + 1.0 / (z * z);
    z = z + 1.0;
  }
  let z2 = 1.0 / (z * z);
  t = t + (1.0 / z + 0.5 * z2 +
    z2 / z * (1.0 / 6.0 - z2 * (1.0 / 30.0 - z2 * (1.0 / 42.0 - z2 / 30.0))));
  return result + sgn * t;
}

fn _gpu_polygamma(n: f32, x: f32) -> f32 {
  if (n == 0.0) { return _gpu_digamma(x); }
  if (n == 1.0) { return _gpu_trigamma(x); }
  if (n != floor(n) || n < 0.0 || n > 24.0) { return _gpu_nan(); }
  if (x <= 0.0 && x == floor(x)) { // a pole, and -inf: see _gpu_digamma
    return select(_gpu_nan(), _gpu_inf(), x >= -3.4028234663852886e38);
  }
  if (x < -4096.0) { return _gpu_nan(); } // one term per unit of |x|
  if (x > 3.4e38) { return 0.0; } // +inf
  var fact: f32 = 1.0;
  for (var j: i32 = 2; j <= 24; j = j + 1) {
    if (f32(j) > n) { break; }
    fact = fact * f32(j);
  }
  let lf = log(fact);
  let n1 = n + 1.0;
  // With an odd power n + 1, a term at a negative z is negative.
  let oddPower = (n1 % 2.0) == 1.0;
  var sum: f32 = 0.0;
  var mag: f32 = 0.0;
  var xmax: f32 = 0.0;
  var z: f32 = x;
  for (var k: i32 = 0; k < 4132; k = k + 1) {
    if (z >= n + 10.0) { break; }
    let e = lf - n1 * log(abs(z));
    let t = exp(e);
    sum = sum + select(t, -t, z < 0.0 && oddPower);
    mag = mag + t;
    xmax = max(xmax, abs(e));
    z = z + 1.0;
  }
  // See the GLSL preamble: the asymptotic series from a = n!/z^(n+1).
  let a = exp(lf - n1 * log(z));
  var tail: f32 = a * z / n + 0.5 * a;
  var f: f32 = a * n1 / (2.0 * z);
  let b = array<f32, 10>(
    1.0 / 6.0, -1.0 / 30.0, 1.0 / 42.0, -1.0 / 30.0, 5.0 / 66.0,
    -691.0 / 2730.0, 7.0 / 6.0, -3617.0 / 510.0, 43867.0 / 798.0,
    -174611.0 / 330.0
  );
  var prev: f32 = 3.0e38;
  for (var k: i32 = 1; k <= 10; k = k + 1) {
    let term = b[k - 1] * f;
    if (abs(term) >= prev) { break; }
    tail = tail + term;
    prev = abs(term);
    let m = f32(2 * k);
    f = f * (m + n) * (m + n + 1.0) / ((m + 1.0) * (m + 2.0) * z * z);
  }
  let res = sum + tail;
  // See the GLSL preamble: 500 = 3e-5 / 6e-8, as a ratio.
  if (x < 0.0 && oddPower && !((mag + abs(tail)) / abs(res) <= 500.0 / (6.0 + xmax))) {
    return _gpu_nan();
  }
  return select(res, -res, (n % 2.0) == 0.0);
}
`,xs=`
float _gpu_zeta_pow(float x, float e) {
  if (x >= 0.0) return pow(x, e);
  if (e != floor(e)) return _gpu_nan();
  float r = pow(-x, e);
  if (mod(abs(e), 2.0) == 1.0) return -r;
  return r;
}

float _gpu_hurwitz_zeta_em(float s, float a, float sm1) {
  int n = int(ceil(15.0 - a));
  if (n < 0) n = 0;
  float sum = 0.0;
  float z = a;
  for (int k = 0; k < n; k++) {
    sum += _gpu_zeta_pow(z, -s);
    z += 1.0;
  }
  // Tail: closed-form integral + half-term (DLMF 25.11.9). The integral
  // term is the pole at s = 1: it uses sm1 = s - 1 as the caller knows it.
  sum += pow(z, -sm1) / sm1 + 0.5 * pow(z, -s);
  // Bernoulli correction series, same ten B_2j as BERNOULLI_2K
  // (special-functions.ts); u carries the term divided by B_2j.
  float b[10] = float[10](
    1.0 / 6.0, -1.0 / 30.0, 1.0 / 42.0, -1.0 / 30.0, 5.0 / 66.0,
    -691.0 / 2730.0, 7.0 / 6.0, -3617.0 / 510.0, 43867.0 / 798.0,
    -174611.0 / 330.0
  );
  float u = (s / 2.0) * pow(z, -(s + 1.0));
  float prevAbs = 3.0e38;
  for (int j = 1; j <= 10; j++) {
    float term = u * b[j - 1];
    if (abs(term) >= prevAbs) break;
    sum += term;
    prevAbs = abs(term);
    float m = float(2 * j);
    u = u * (s + m - 1.0) * (s + m) / ((m + 1.0) * (m + 2.0) * z * z);
  }
  return sum;
}

// Gamma(x) / (2 pi)^x for x >= 1, as vec2(value, error estimate in units of
// the f32 rounding error 6e-8). Stirling's series after a shift to y >= 8:
// (y/(2 pi e))^y sqrt(2 pi/y) e^corr, divided by x (x+1) ... (y-1) and
// multiplied by (2 pi)^(y-x). Neither Gamma(x) nor (2 pi)^x is formed (they
// overflow f32 near x = 35 and x = 48), and the largest pow argument is
// about y log2(y/(2 pi e)), 15 at x = 25.5, where the Lanczos _gpu_gamma
// calls pow with an argument of about 126, and 122 at x = 64, the end of
// the range _gpu_riemann_zeta uses.
vec2 _gpu_zeta_gamma_2pi(float x) {
  const float PI = 3.14159265358979;
  float p = 1.0;
  float y = x;
  for (int k = 0; k < 8; k++) {
    if (y >= 8.0) break;
    p *= y;
    y += 1.0;
  }
  float y2 = y * y;
  float corr = (1.0 / 12.0 - (1.0 / 360.0 - 1.0 / (1260.0 * y2)) / y2) / y;
  float base = y / 17.079468445347132; // y / (2 pi e)
  float v = pow(base, y) * sqrt(2.0 * PI / y) * (exp(corr) / p) *
    pow(2.0 * PI, y - x);
  return vec2(v, abs(v) * (12.0 + abs(y * log2(base)) + y));
}

// zeta(s), with sm1 = s - 1 passed by a caller that knows it more exactly
// than s - 1.0 can recover it from a rounded s.
float _gpu_riemann_zeta(float s, float sm1) {
  const float PI = 3.14159265358979;
  if (sm1 == 0.0) return _gpu_inf(); // pole
  if (s == 0.0) return -0.5;
  if (s < 0.0) {
    if (s == floor(s) && mod(s, 2.0) == 0.0) return 0.0; // trivial zero
    // Below s = -63 the f32 error passes 3e-5 in an f32 model whose log2 is
    // 2.5 ulp off, and near s = -64.8 pow(y / (2 pi e), y) overflows.
    if (s < -63.0) return _gpu_nan();
    // sin(PI s/2) = (-1)^n sin(PI (s/2 - n)): s/2 - n is exact, so the
    // sine keeps its relative accuracy next to an even s.
    float hs = s / 2.0;
    float n = floor(hs + 0.5);
    float sinHalfPiS = sin(PI * (hs - n));
    if (mod(n, 2.0) != 0.0) sinHalfPiS = -sinHalfPiS;
    // 1 - s is rounded, but its distance to the pole, -s, is exact.
    float oneMinusS = 1.0 - s;
    // 2^s pi^(s-1) Gamma(1-s) = 2 Gamma(1-s)/(2 pi)^(1-s). From 1 - s = 8
    // on, from Stirling's series: with the Lanczos Gamma, zeta(s) was up to
    // 3.3e-5 off near s = -22 in an f32 model whose log2 is 2.5 ulp off.
    if (oneMinusS >= 8.0)
      return 2.0 * _gpu_zeta_gamma_2pi(oneMinusS).x * sinHalfPiS *
        _gpu_hurwitz_zeta_em(oneMinusS, 1.0, -s);
    return pow(2.0, s) * pow(PI, s - 1.0) * sinHalfPiS *
      _gpu_gamma(oneMinusS) * _gpu_hurwitz_zeta_em(oneMinusS, 1.0, -s);
  }
  return _gpu_hurwitz_zeta_em(s, 1.0, sm1);
}

float _gpu_zeta(float s) {
  return _gpu_riemann_zeta(s, s - 1.0);
}

// zeta(s, 1+h) = sum C(-s,k) h^k zeta(s+k), |h| < 1 \u2014 no cancellation,
// since each zeta(s+k) reflects to Re >= 0. See zetaNearOneComplex. The
// stop tolerance is near the f32 epsilon (1.2e-7), and 100 terms reach it
// for every s >= -24.5. Below, the series answers NaN: with _gpu_zeta
// defined down to s = -63, 46 of 1500 values of zeta(s, a) for s from -63.5
// to -24.5 were more than 3e-5 off.
float _gpu_zeta_near_one(float s, float h) {
  if (s < -24.5) return _gpu_nan();
  float sum = _gpu_zeta(s);
  float c = 1.0;
  float hk = 1.0;
  float largest = abs(sum);
  int small = 0;
  for (int k = 1; k < 100; k++) {
    hk *= h;
    if (hk == 0.0) break;
    // f = 1 - k - s is exact when s is near 1 - k, and s + k - 1 = -f is
    // then the exact distance from s + k to the pole of zeta.
    float f = float(1 - k) - s;
    if (f == 0.0) return sum + c * hk * (-1.0 / float(k));
    c = c * f / float(k);
    float term = c * hk * _gpu_riemann_zeta(s + float(k), -f);
    sum += term;
    float size = abs(term);
    largest = max(largest, size);
    if (size <= 1e-7 * largest) {
      if (++small == 2) break;
    } else small = 0;
  }
  return sum;
}

// 1 - e^(-y) for y >= 0, without the cancellation of 1.0 - exp(-y) at a
// small y (a Taylor polynomial below y = 0.25).
float _gpu_zeta_em1(float y) {
  if (y < 0.25) {
    float r = 1.0 - y / 7.0;
    r = 1.0 - y / 6.0 * r;
    r = 1.0 - y / 5.0 * r;
    r = 1.0 - y / 4.0 * r;
    r = 1.0 - y / 3.0 * r;
    r = 1.0 - y / 2.0 * r;
    return y * r;
  }
  return 1.0 - exp(-y);
}

// zeta(s, b) for 0 < b <= 1 and s < 1 by Hermite's integral (DLMF
// 25.11.29): b^(-s)/2 + b^(1-s)/(s-1) plus
// 2 int_0^inf sin(s atan(t/b)) (b^2 + t^2)^(-s/2) / (e^(2 pi t) - 1) dt.
// The two closed terms are one product, b^(-s) (s - 1 + 2b) / (2 (s - 1)):
// 2b - 1 is exact for b >= 1/4, so the factor s + (2b - 1) has a single
// rounding, relative to itself, where the two terms cancel (at s = 1/2,
// b = 0.3 they are 0.91 and -1.10 and the value is 0.011). The integrand is formed
// in one exp, so that a large -s does not overflow before e^(-2 pi t)
// applies. 8-point Gauss-Legendre panels, b/2 wide from t = 0 and doubling
// up to 1 wide (the integrand varies on the scale b next to t = 0, and has
// poles at t = +-i), until the panel mean is below 1e-9 of the largest one
// past the peak of the envelope at t = -s/(2 pi). Returns vec2(value, error
// estimate in units of the f32 rounding error 6e-8): the rounding of the
// closed product and, for each node, of its exp argument, of the log of
// b^2 + t^2 (times s/2), and of the sine argument s atan(t/b). vec2(0,
// 3e38) when 40 panels do not reach the stopping test (b >= 2^-10 takes
// at most 17 on s from -3 to 1).
vec2 _gpu_zeta_hermite(float s, float b) {
  const float PI = 3.14159265358979;
  const float gx[4] = float[4](0.1834346424956498, 0.5255324099163290,
    0.7966664774136267, 0.9602898564975363);
  const float gw[4] = float[4](0.3626837833783620, 0.3137066458778873,
    0.2223810344533745, 0.1012285362903763);
  float k = pow(b, -s) / (2.0 * (s - 1.0));
  // max() keeps a fast-math compiler from reassociating the sum into
  // (s + 2b) - 1, which loses s next to s = 0 (6.7% off at s = -1e-6,
  // b = 1/2 on an Apple GPU, where 2b - 1 = 0).
  float c = s + max(2.0 * b - 1.0, -1.0);
  float closed = k * c;
  float err = abs(k) * (abs(c) + (b < 0.25 ? 1.0 : 0.0)) +
    abs(closed) * (4.0 + abs(s * log2(b)));
  float b2 = b * b;
  float tPeak = max(0.0, -s / (2.0 * PI));
  float sum = 0.0;
  float largest = 0.0;
  float x = 0.0;
  bool done = false;
  for (int p = 0; p < 40; p++) {
    float w = x == 0.0 ? 0.5 * b : min(x, 1.0);
    float cc = x + 0.5 * w;
    float r = 0.5 * w;
    float size = 0.0;
    for (int i = 0; i < 4; i++) {
      for (int j = 0; j < 2; j++) {
        float t = cc + (j == 0 ? -r : r) * gx[i];
        float y = 2.0 * PI * t;
        float lr = log(b2 + t * t);
        float ex = -0.5 * s * lr - y - log(_gpu_zeta_em1(y));
        float th = s * atan(t / b);
        float q = r * gw[i] * exp(ex);
        float f = q * sin(th);
        sum += f;
        size += abs(f);
        err += 2.0 * (abs(f) * (6.0 + abs(ex) + 0.5 * abs(s) * (2.0 + abs(lr))) +
          q * abs(th));
      }
    }
    x += w;
    float mean = size / w;
    largest = max(largest, mean);
    if (x > tPeak && x >= 1.0 && mean <= 1e-9 * largest) {
      done = true;
      break;
    }
  }
  if (!done) return vec2(0.0, 3.0e38);
  float v = closed + 2.0 * sum;
  return vec2(v, err + 2.0 * abs(v));
}

// zeta(s, b) for s <= -3 and 0 < b <= 1 by Hurwitz's formula, the Fourier
// series in the base point:
// 2 Gamma(1-s)/(2 pi)^(1-s) sum_k sin(2 pi k b + pi s/2) / k^(1-s). Its
// terms fall like k^(s-1) and do not cancel; 64 of them leave a tail below
// 64^s/(-s) of the prefactor, 1.3e-6 at s = -3. The sine argument is
// reduced exactly: pi (2 frac(k b) + (s/2 mod 2)), minus its nearest
// integer n, with the sign (-1)^n. Returns vec2(value, error estimate in
// units of 6e-8): the pow roundings, the rounding of the argument (about
// 20 k units of each term's size), the tail and the prefactor.
vec2 _gpu_zeta_fourier(float s, float b) {
  const float PI = 3.14159265358979;
  vec2 g = _gpu_zeta_gamma_2pi(1.0 - s);
  float hs = s / 2.0;
  float ps = hs - 2.0 * floor(hs / 2.0);
  float sum = 0.0;
  float err = 0.0;
  for (int k = 1; k <= 64; k++) {
    float fk = float(k);
    float kb = fk * b;
    float ph = 2.0 * (kb - floor(kb)) + ps;
    float n = floor(ph + 0.5);
    float sn = sin(PI * (ph - n));
    if (mod(n, 2.0) != 0.0) sn = -sn;
    float pk = pow(fk, s - 1.0);
    float t = sn * pk;
    sum += t;
    err += abs(t) * (4.0 + abs((s - 1.0) * log2(fk))) + pk * (fk * 20.0);
  }
  float tail = pow(64.0, s) / (-s);
  return vec2(2.0 * g.x * sum,
    2.0 * g.x * (err + tail / 6.0e-8 + 2.0 * abs(sum)) + 2.0 * g.y * abs(sum));
}

// zeta(s, a) for a > 0 and -24.5 <= s < 1 from the base point b = a - m in
// (0, 1]: zeta(s, a) = zeta(s, b) - sum_{j<m} (b + j)^(-s). zeta(s, b) is
// the Fourier series for s <= -3, the Taylor series in b for b < 2^-10
// (zeta(s, b) = b^(-s) + zeta(s, 1 + b), where Hermite's integral would
// need more panels), and Hermite's integral otherwise. NaN when the error
// estimate exceeds 3e-5 of the value (next to a zero of zeta(s, a)).
float _gpu_zeta_shifted(float s, float a) {
  float m = ceil(a) - 1.0;
  float b = a - m;
  vec2 r;
  if (s <= -3.0) r = _gpu_zeta_fourier(s, b);
  else if (b < 0.0009765625) {
    float t = pow(b, -s);
    float zn = _gpu_zeta_near_one(s, b);
    r = vec2(zn + t, 64.0 * abs(zn) + abs(t) * (3.0 + abs(s * log2(b))));
  } else r = _gpu_zeta_hermite(s, b);
  float z = r.x;
  float err = r.y;
  // m <= 123: the caller keeps a below 4 * edge <= 124.
  for (int j = 0; j < 128; j++) {
    if (float(j) >= m) break;
    float br = b + float(j);
    float t = pow(br, -s);
    z -= t;
    err += abs(t) * (3.0 + float(j) + abs(s * log2(br)));
  }
  err += abs(z) * (m + 2.0);
  if (!(6.0e-8 * err <= 3.0e-5 * abs(z))) return _gpu_nan();
  return z;
}

float _gpu_hurwitz_zeta(float s, float a) {
  if (s == 1.0) return _gpu_inf(); // pole, every base point a
  if (s == 0.0) return 0.5 - a;
  if (a == 1.0) return _gpu_zeta(s);
  bool aNonposInt = a <= 0.0 && a == floor(a);
  if (aNonposInt && s > 0.0) return _gpu_inf(); // (a+k) = 0 term diverges
  if (a < 0.0 && s != floor(s)) return _gpu_nan(); // complex value
  if (a < -1.0e6) return _gpu_nan();
  float edge = max(12.0, ceil(abs(s)) + 6.0);
  // Where the Euler-Maclaurin terms cancel: s < 1/2 short of a = 4 * edge,
  // and 1/2 <= s < 1 below a = 1 (the zeros of zeta(s, a) there).
  if (a > 0.0 && s >= -24.5 && s < 1.0 && (s < 0.5 ? a < 4.0 * edge : a < 1.0))
    return _gpu_zeta_shifted(s, a);
  if (s >= 0.0 || a >= 4.0 * edge) return _gpu_hurwitz_zeta_em(s, a, s - 1.0);
  // Shift a to 1+h (|h| <= 3/4) and expand in Taylor series \u2014 see
  // hurwitzZetaComplex's doc comment for why EM alone cancels here.
  float m = floor(a - 0.5);
  float h = a - m - 1.0;
  if (abs(h) > 0.75) return _gpu_hurwitz_zeta_em(s, a, s - 1.0);
  float z = _gpu_zeta_near_one(s, h);
  int steps = int(abs(m));
  for (int j = 0; j < steps; j++) {
    float br = m > 0.0 ? h + 1.0 + float(j) : a + float(j);
    if (br == 0.0) continue;
    float t = _gpu_zeta_pow(br, -s);
    z = m > 0.0 ? z - t : z + t;
  }
  return z;
}

float _gpu_zeta_generalized(float s, float a) {
  if (s == 1.0) return _gpu_inf(); // pole, every base point a
  if (a > 0.0) return _gpu_hurwitz_zeta(s, a);
  if (a == 0.0) return _gpu_zeta(s);
  if (a < -1.0e6) return _gpu_nan();
  int n = int(ceil(-a));
  float sum = 0.0;
  for (int k = 0; k < n; k++) sum += pow(-(a + float(k)), -s);
  float cur = a + float(n);
  if (cur == 0.0) cur = 1.0; // drop the (k + a) = 0 term
  return sum + _gpu_hurwitz_zeta(s, cur);
}
`,ws=`
fn _gpu_zeta_pow(x: f32, e: f32) -> f32 {
  if (x >= 0.0) { return pow(x, e); }
  if (e != floor(e)) { return _gpu_nan(); }
  let r = pow(-x, e);
  if ((abs(e) % 2.0) == 1.0) { return -r; }
  return r;
}

fn _gpu_hurwitz_zeta_em(s: f32, a: f32, sm1: f32) -> f32 {
  var n: i32 = i32(ceil(15.0 - a));
  if (n < 0) { n = 0; }
  var sum: f32 = 0.0;
  var z: f32 = a;
  for (var k: i32 = 0; k < n; k = k + 1) {
    sum = sum + _gpu_zeta_pow(z, -s);
    z = z + 1.0;
  }
  // The integral term is the pole at s = 1: it uses sm1 = s - 1 as the
  // caller knows it.
  sum = sum + pow(z, -sm1) / sm1 + 0.5 * pow(z, -s);
  let b = array<f32, 10>(
    1.0 / 6.0, -1.0 / 30.0, 1.0 / 42.0, -1.0 / 30.0, 5.0 / 66.0,
    -691.0 / 2730.0, 7.0 / 6.0, -3617.0 / 510.0, 43867.0 / 798.0,
    -174611.0 / 330.0
  );
  var u: f32 = (s / 2.0) * pow(z, -(s + 1.0));
  var prevAbs: f32 = 3.0e38;
  for (var j: i32 = 1; j <= 10; j = j + 1) {
    let term = u * b[j - 1];
    if (abs(term) >= prevAbs) { break; }
    sum = sum + term;
    prevAbs = abs(term);
    let m = f32(2 * j);
    u = u * (s + m - 1.0) * (s + m) / ((m + 1.0) * (m + 2.0) * z * z);
  }
  return sum;
}

// Gamma(x) / (2 pi)^x for x >= 1, with an error estimate, from Stirling's
// series \u2014 see GLSL's _gpu_zeta_gamma_2pi.
fn _gpu_zeta_gamma_2pi(x: f32) -> vec2<f32> {
  let PI = 3.14159265358979;
  var p: f32 = 1.0;
  var y: f32 = x;
  for (var k: i32 = 0; k < 8; k = k + 1) {
    if (y >= 8.0) { break; }
    p = p * y;
    y = y + 1.0;
  }
  let y2 = y * y;
  let corr = (1.0 / 12.0 - (1.0 / 360.0 - 1.0 / (1260.0 * y2)) / y2) / y;
  let base = y / 17.079468445347132; // y / (2 pi e)
  let v = pow(base, y) * sqrt(2.0 * PI / y) * (exp(corr) / p) *
    pow(2.0 * PI, y - x);
  return vec2<f32>(v, abs(v) * (12.0 + abs(y * log2(base)) + y));
}

// zeta(s), with sm1 = s - 1 \u2014 see GLSL's _gpu_riemann_zeta.
fn _gpu_riemann_zeta(s: f32, sm1: f32) -> f32 {
  let PI = 3.14159265358979;
  if (sm1 == 0.0) { return _gpu_inf(); } // pole
  if (s == 0.0) { return -0.5; }
  if (s < 0.0) {
    if (s == floor(s) && (s % 2.0) == 0.0) { return 0.0; } // trivial zero
    if (s < -63.0) { return _gpu_nan(); } // see the GLSL version
    // sin(PI s/2) = (-1)^n sin(PI (s/2 - n)), with s/2 - n exact.
    let hs = s / 2.0;
    let n = floor(hs + 0.5);
    var sinHalfPiS = sin(PI * (hs - n));
    if ((n % 2.0) != 0.0) { sinHalfPiS = -sinHalfPiS; }
    // 1 - s is rounded, but its distance to the pole, -s, is exact.
    let oneMinusS = 1.0 - s;
    // 2 Gamma(1-s)/(2 pi)^(1-s) from Stirling's series from 1 - s = 8 on.
    if (oneMinusS >= 8.0) {
      return 2.0 * _gpu_zeta_gamma_2pi(oneMinusS).x * sinHalfPiS *
        _gpu_hurwitz_zeta_em(oneMinusS, 1.0, -s);
    }
    return pow(2.0, s) * pow(PI, s - 1.0) * sinHalfPiS *
      _gpu_gamma(oneMinusS) * _gpu_hurwitz_zeta_em(oneMinusS, 1.0, -s);
  }
  return _gpu_hurwitz_zeta_em(s, 1.0, sm1);
}

fn _gpu_zeta(s: f32) -> f32 {
  return _gpu_riemann_zeta(s, s - 1.0);
}

// zeta(s, 1+h) = sum C(-s,k) h^k zeta(s+k) \u2014 see GLSL's _gpu_zeta_near_one.
fn _gpu_zeta_near_one(s: f32, h: f32) -> f32 {
  if (s < -24.5) { return _gpu_nan(); } // see the GLSL version
  var sum = _gpu_zeta(s);
  var c = 1.0;
  var hk = 1.0;
  var largest = abs(sum);
  var small = 0;
  for (var k = 1; k < 100; k = k + 1) {
    hk = hk * h;
    if (hk == 0.0) { break; }
    // f = 1 - k - s, exact when s is near 1 - k (see the GLSL version).
    let f = f32(1 - k) - s;
    if (f == 0.0) { return sum + c * hk * (-1.0 / f32(k)); }
    c = c * f / f32(k);
    let term = c * hk * _gpu_riemann_zeta(s + f32(k), -f);
    sum = sum + term;
    let size = abs(term);
    largest = max(largest, size);
    if (size <= 1e-7 * largest) {
      small = small + 1;
      if (small == 2) { break; }
    } else { small = 0; }
  }
  return sum;
}

// 1 - e^(-y) for y >= 0 \u2014 see GLSL's _gpu_zeta_em1.
fn _gpu_zeta_em1(y: f32) -> f32 {
  if (y < 0.25) {
    var r = 1.0 - y / 7.0;
    r = 1.0 - y / 6.0 * r;
    r = 1.0 - y / 5.0 * r;
    r = 1.0 - y / 4.0 * r;
    r = 1.0 - y / 3.0 * r;
    r = 1.0 - y / 2.0 * r;
    return y * r;
  }
  return 1.0 - exp(-y);
}

// zeta(s, b) for 0 < b <= 1 and s < 1 by Hermite's integral, as
// vec2(value, error estimate) \u2014 see GLSL's _gpu_zeta_hermite.
fn _gpu_zeta_hermite(s: f32, b: f32) -> vec2<f32> {
  let PI = 3.14159265358979;
  let gx = array<f32, 4>(0.1834346424956498, 0.5255324099163290,
    0.7966664774136267, 0.9602898564975363);
  let gw = array<f32, 4>(0.3626837833783620, 0.3137066458778873,
    0.2223810344533745, 0.1012285362903763);
  let k = pow(b, -s) / (2.0 * (s - 1.0));
  // max() blocks a fast-math reassociation \u2014 see the GLSL version.
  let c = s + max(2.0 * b - 1.0, -1.0);
  let closed = k * c;
  var lowB: f32 = 0.0;
  if (b < 0.25) { lowB = 1.0; }
  var err = abs(k) * (abs(c) + lowB) + abs(closed) * (4.0 + abs(s * log2(b)));
  let b2 = b * b;
  let tPeak = max(0.0, -s / (2.0 * PI));
  var sum: f32 = 0.0;
  var largest: f32 = 0.0;
  var x: f32 = 0.0;
  var done = false;
  for (var p: i32 = 0; p < 40; p = p + 1) {
    var w: f32 = min(x, 1.0);
    if (x == 0.0) { w = 0.5 * b; }
    let cc = x + 0.5 * w;
    let r = 0.5 * w;
    var size: f32 = 0.0;
    for (var i: i32 = 0; i < 4; i = i + 1) {
      for (var j: i32 = 0; j < 2; j = j + 1) {
        var d = r;
        if (j == 0) { d = -r; }
        let t = cc + d * gx[i];
        let y = 2.0 * PI * t;
        let lr = log(b2 + t * t);
        let ex = -0.5 * s * lr - y - log(_gpu_zeta_em1(y));
        let th = s * atan(t / b);
        let q = r * gw[i] * exp(ex);
        let f = q * sin(th);
        sum = sum + f;
        size = size + abs(f);
        err = err + 2.0 * (abs(f) * (6.0 + abs(ex) + 0.5 * abs(s) * (2.0 + abs(lr))) +
          q * abs(th));
      }
    }
    x = x + w;
    let mean = size / w;
    largest = max(largest, mean);
    if (x > tPeak && x >= 1.0 && mean <= 1e-9 * largest) {
      done = true;
      break;
    }
  }
  if (!done) { return vec2<f32>(0.0, 3.0e38); }
  let v = closed + 2.0 * sum;
  return vec2<f32>(v, err + 2.0 * abs(v));
}

// zeta(s, b) for s <= -3 and 0 < b <= 1 by Hurwitz's formula, as
// vec2(value, error estimate) \u2014 see GLSL's _gpu_zeta_fourier.
fn _gpu_zeta_fourier(s: f32, b: f32) -> vec2<f32> {
  let PI = 3.14159265358979;
  let g = _gpu_zeta_gamma_2pi(1.0 - s);
  let hs = s / 2.0;
  let ps = hs - 2.0 * floor(hs / 2.0);
  var sum: f32 = 0.0;
  var err: f32 = 0.0;
  for (var k: i32 = 1; k <= 64; k = k + 1) {
    let fk = f32(k);
    let kb = fk * b;
    let ph = 2.0 * (kb - floor(kb)) + ps;
    let n = floor(ph + 0.5);
    var sn = sin(PI * (ph - n));
    if ((n % 2.0) != 0.0) { sn = -sn; }
    let pk = pow(fk, s - 1.0);
    let t = sn * pk;
    sum = sum + t;
    err = err + abs(t) * (4.0 + abs((s - 1.0) * log2(fk))) + pk * (fk * 20.0);
  }
  let tail = pow(64.0, s) / (-s);
  return vec2<f32>(2.0 * g.x * sum,
    2.0 * g.x * (err + tail / 6.0e-8 + 2.0 * abs(sum)) + 2.0 * g.y * abs(sum));
}

// zeta(s, a) for a > 0 and -24.5 <= s < 1 from the base point b = a - m
// in (0, 1] \u2014 see GLSL's _gpu_zeta_shifted.
fn _gpu_zeta_shifted(s: f32, a: f32) -> f32 {
  let m = ceil(a) - 1.0;
  let b = a - m;
  var r: vec2<f32>;
  if (s <= -3.0) {
    r = _gpu_zeta_fourier(s, b);
  } else if (b < 0.0009765625) {
    let t = pow(b, -s);
    let zn = _gpu_zeta_near_one(s, b);
    r = vec2<f32>(zn + t, 64.0 * abs(zn) + abs(t) * (3.0 + abs(s * log2(b))));
  } else {
    r = _gpu_zeta_hermite(s, b);
  }
  var z = r.x;
  var err = r.y;
  // m <= 123: the caller keeps a below 4 * edge <= 124.
  for (var j: i32 = 0; j < 128; j = j + 1) {
    if (f32(j) >= m) { break; }
    let br = b + f32(j);
    let t = pow(br, -s);
    z = z - t;
    err = err + abs(t) * (3.0 + f32(j) + abs(s * log2(br)));
  }
  err = err + abs(z) * (m + 2.0);
  if (!(6.0e-8 * err <= 3.0e-5 * abs(z))) { return _gpu_nan(); }
  return z;
}

fn _gpu_hurwitz_zeta(s: f32, a: f32) -> f32 {
  if (s == 1.0) { return _gpu_inf(); } // pole, every base point a
  if (s == 0.0) { return 0.5 - a; }
  if (a == 1.0) { return _gpu_zeta(s); }
  let aNonposInt = a <= 0.0 && a == floor(a);
  if (aNonposInt && s > 0.0) { return _gpu_inf(); } // (a+k) = 0 diverges
  if (a < 0.0 && s != floor(s)) { return _gpu_nan(); } // complex value
  if (a < -1.0e6) { return _gpu_nan(); }
  let edge = max(12.0, ceil(abs(s)) + 6.0);
  // Where the Euler-Maclaurin terms cancel \u2014 see the GLSL version.
  var shifted = false;
  if (s < 0.5) { shifted = a < 4.0 * edge; } else { shifted = a < 1.0; }
  if (a > 0.0 && s >= -24.5 && s < 1.0 && shifted) { return _gpu_zeta_shifted(s, a); }
  if (s >= 0.0 || a >= 4.0 * edge) { return _gpu_hurwitz_zeta_em(s, a, s - 1.0); }
  // Shift a to 1+h (|h| <= 3/4) and expand in Taylor series \u2014 see
  // hurwitzZetaComplex's doc comment for why EM alone cancels here.
  let m = floor(a - 0.5);
  let h = a - m - 1.0;
  if (abs(h) > 0.75) { return _gpu_hurwitz_zeta_em(s, a, s - 1.0); }
  var z = _gpu_zeta_near_one(s, h);
  let steps = i32(abs(m));
  for (var j = 0; j < steps; j = j + 1) {
    var br: f32;
    if (m > 0.0) { br = h + 1.0 + f32(j); } else { br = a + f32(j); }
    if (br == 0.0) { continue; }
    let t = _gpu_zeta_pow(br, -s);
    if (m > 0.0) { z = z - t; } else { z = z + t; }
  }
  return z;
}

fn _gpu_zeta_generalized(s: f32, a: f32) -> f32 {
  if (s == 1.0) { return _gpu_inf(); } // pole, every base point a
  if (a > 0.0) { return _gpu_hurwitz_zeta(s, a); }
  if (a == 0.0) { return _gpu_zeta(s); }
  if (a < -1.0e6) { return _gpu_nan(); }
  let n = i32(ceil(-a));
  var sum: f32 = 0.0;
  for (var k: i32 = 0; k < n; k = k + 1) { sum = sum + pow(-(a + f32(k)), -s); }
  var cur = a + f32(n);
  if (cur == 0.0) { cur = 1.0; } // drop the (k + a) = 0 term
  return sum + _gpu_hurwitz_zeta(s, cur);
}
`;var $s=`
vec2 _gpu_lerch_series(float z, float s, float a) {
  int n0 = a < 0.0 ? int(ceil(-a)) : 0;
  float az = abs(z);
  float sum = 0.0;
  float zk = 1.0;
  float prev = 3.0e38;
  // For the error estimate: the terms weighted by the roundings of z^k (k
  // of them), their moduli, and the range of |a + k| (pow(b, -s) is within
  // about 6e-8 (2 + |s log2 b|) relative on a GPU).
  float err = 0.0;
  float sizes = 0.0;
  float bmin = 3.0e38;
  float bmax = 0.0;
  int settled = 0;
  for (int k = 0; k < n0 + 4096; k++) {
    float b = a + float(k);
    float t = (b != 0.0) ? zk * _gpu_zeta_pow(b, -s) : 0.0;
    sum += t;
    float size = abs(t);
    err += size * (2.0 + float(k));
    sizes += size;
    if (b != 0.0) {
      bmin = min(bmin, abs(b));
      bmax = max(bmax, abs(b));
    }
    if (b > 0.0) {
      float rho = max(size / prev, az);
      if (size == 0.0 ||
          (size < prev && rho < 1.0 &&
           size * rho / (1.0 - rho) <= 1e-7 * abs(sum))) {
        settled++;
        if (settled == 3) {
          float lb = max(abs(log2(bmin)), abs(log2(bmax)));
          float bound = 6.0e-8 * (err + sizes * (2.0 + abs(s * lb)));
          if (!(bound <= 3.0e-5 * abs(sum))) return vec2(0.0);
          // A GPU flushes a term below the smallest normal f32 (1.2e-38) to
          // zero. The flushed tail is at most 1.2e-38 / (1 - |z|): decline
          // unless that is below 2^-24 of the sum. (Not rho: after a flushed
          // term, prev can be 0 and rho 0/0.)
          if (abs(sum) * (1.0 - az) < 1.9721523e-31) return vec2(0.0);
          return vec2(sum, 1.0);
        }
      } else {
        settled = 0;
      }
      prev = size;
    }
    zk *= z;
  }
  return vec2(0.0);
}

vec2 _gpu_lerch_euler(float z, float s, float a) {
  int n0 = a <= 0.0 ? int(floor(-a)) + 1 : 0;
  float head = 0.0;
  float zn = 1.0;
  float largest = 0.0;
  for (int k = 0; k < n0; k++) {
    float b = a + float(k);
    float t = (b != 0.0) ? zn * _gpu_zeta_pow(b, -s) : 0.0;
    head += t;
    largest = max(largest, abs(t));
    zn *= z;
  }
  float b0 = a + float(n0);
  float w[65];
  int nterm = 0;
  float sum = 0.0;
  float zPow = 1.0;
  int settled = 0;
  for (int k = 0; k < 64; k++) {
    float cur = zPow * pow(b0 + float(k), -s);
    float inc;
    if (k == 0) {
      nterm = 1;
      w[1] = cur;
      inc = 0.5 * cur;
    } else {
      float tmp = w[1];
      w[1] = cur;
      for (int j = 1; j <= nterm - 1; j++) {
        float dum = w[j + 1];
        w[j + 1] = 0.5 * (w[j] + tmp);
        tmp = dum;
      }
      if (nterm >= 64) return vec2(0.0);
      w[nterm + 1] = 0.5 * (w[nterm] + tmp);
      if (abs(w[nterm + 1]) <= abs(w[nterm])) {
        nterm++;
        inc = 0.5 * w[nterm];
      } else {
        inc = w[nterm + 1];
      }
    }
    sum += inc;
    zPow *= z;
    if (k > 4 && abs(inc) <= 1e-7 * abs(sum)) {
      settled++;
      if (settled == 3) {
        // A GPU flushes a term below the smallest normal f32 (1.2e-38) to
        // zero: decline unless the terms the stopping rule reads, down to
        // 1e-7 of the sum, are normal.
        if (abs(sum) < 1.9721523e-31) return vec2(0.0);
        float tail = zn * sum;
        float res = head + tail;
        if (max(largest, abs(tail)) > 100.0 * abs(res)) return vec2(0.0);
        return vec2(res, 1.0);
      }
    } else {
      settled = 0;
    }
  }
  return vec2(0.0);
}

// 1 - e^(-t) for t >= 0, by its Taylor series below 1/4, where
// 1.0 - exp(-t) would cancel.
float _gpu_lerch_em(float t) {
  if (t < 0.25)
    return t * (1.0 - t / 2.0 * (1.0 - t / 3.0 * (1.0 - t / 4.0 *
      (1.0 - t / 5.0 * (1.0 - t / 6.0 * (1.0 - t / 7.0))))));
  return 1.0 - exp(-t);
}

// ln Gamma(s) for s > 0: shift the argument to x >= 8 (ln Gamma(s) =
// ln Gamma(x) - ln(s (s+1) ... (x-1))), then the Stirling series. Within
// about 1e-6 absolute. _gpu_gamma is not used here: its Lanczos sum
// cancels in f32 near s = 0.
float _gpu_lerch_lgamma(float s) {
  float p = 1.0;
  float x = s;
  for (int k = 0; k < 8; k++) {
    if (x >= 8.0) break;
    p *= x;
    x += 1.0;
  }
  float x2 = x * x;
  float corr = (1.0 / 12.0 - (1.0 / 360.0 - 1.0 / (1260.0 * x2)) / x2) / x;
  return (x - 0.5) * log(x) - x + (0.91893853320467274 + corr) - log(p);
}

// 1 / (1 - z e^(-t)) for t >= 0 and z < 1, without cancellation: for
// 0 < z < 1 the denominator is (1 - z) + z (1 - e^(-t)), two terms >= 0.
float _gpu_lerch_g(float z, float t) {
  if (z < 0.0) return 1.0 / (1.0 - z * exp(-t));
  return 1.0 / ((1.0 - z) + z * _gpu_lerch_em(t));
}

// One step of the polynomials P_m(w) = (1 - w)^(m+1) Phi(w, -m, a), in
// place: P_(m+1)(w) = (1 - w)(a P_m + w P_m') + (m + 1) w P_m, that is
// p'_k = (a + k) p_k + (m + 2 - a - k) p_(k-1), from P_0 = 1. It follows from
// Phi(w, -m-1, a) = (a + w d/dw) Phi(w, -m, a). Updated from the top so
// each entry still reads the previous row's values. c holds
// LERCH_MAX_N + 2 entries.
void _gpu_lerch_pstep(inout float c[18], float a, int m) {
  for (int k = m + 1; k >= 0; k--) {
    float hi = k <= m ? (a + float(k)) * c[k] : 0.0;
    float lo = k >= 1 ? (float(m + 2) - a - float(k)) * c[k - 1] : 0.0;
    c[k] = hi + lo;
  }
}

// Phi(w, -n, a) = v sum_k p_k u^k v^(n-k), v = 1/(1 - w), u = w v, from
// the coefficients of P_n: returns vec2(the sum without its factor v, the
// sum of the moduli of its terms), by Horner in u with the powers of v
// carried along. For w < -1, |u| and |v| are at most 1, so nothing
// overflows. The caller applies the factor v, or folds it into an
// exponent (see _gpu_lerch_integral).
vec2 _gpu_lerch_poly(float c[18], int n, float u, float v) {
  float au = abs(u);
  float av = abs(v);
  float r = c[n];
  float ra = abs(c[n]);
  float vp = v;
  float avp = av;
  for (int k = n - 1; k >= 0; k--) {
    r = r * u + c[k] * vp;
    ra = ra * au + abs(c[k]) * avp;
    vp *= v;
    avp *= av;
  }
  return vec2(r, ra);
}

// Phi(z, -n, a) for an integer 0 <= n <= LERCH_MAX_N: a rational function
// of z, for every real z != 1 and every a (the (k + a) = 0 term is 0^n = 0,
// dropped as the series drops it). It has no branch cut, so it holds for
// z > 1 too. Returns vec2(value, 1), or vec2(0, 0) when the terms cancel so
// far that the error estimate exceeds 3e-5 of the value (next to a zero of
// Phi); the caller then tries its other methods.
vec2 _gpu_lerch_rational(float z, int n, float a) {
  const float EPS = 6.0e-8;
  float c[18];
  for (int i = 0; i < 18; i++) c[i] = 0.0;
  c[0] = 1.0;
  for (int m = 0; m < n; m++) _gpu_lerch_pstep(c, a, m);
  float v = 1.0 / (1.0 - z);
  vec2 q = _gpu_lerch_poly(c, n, z * v, v);
  if (!(EPS * (float(n + 4) * q.y) <= 3.0e-5 * abs(q.x))) return vec2(0.0);
  return vec2(q.x * v, 1.0);
}

// Phi(z,s,a) for real z < 1 (z != 0) and a > 0, from
//   Phi(z,s,a) = 1/Gamma(s) Int_0^inf t^(s-1) e^(-a t) / (1 - z e^(-t)) dt
// for s > 0, whose integrand is positive, so the sum has no cancellation at
// any z. For s <= 0 (not an integer) it integrates by parts n = ceil(-s)
// times first:
//   Phi(z,s,a) = 1/Gamma(s+n) Int_0^inf t^(s+n-1) e^(-a t) R_n(z e^(-t)) dt,
// R_n(w) = Phi(w, -n, a): the n-th derivative in t of
// e^(-a t)/(1 - z e^(-t)) is (-1)^n e^(-a t) R_n(z e^(-t)), and the n signs
// (-1) of the parts cancel it. That integrand is positive for 0 < z < 1
// and changes sign for z < 0, where the error estimate measures the
// cancellation. A negative a (s > 0 is then an integer) is first shifted to
// a + n0 in (0, 1] by Phi(a) = sum_{k<n0} z^k (a+k)^(-s) + z^n0 Phi(a+n0).
// With tau = a t the integral is a^(-(s+n)) times an integral against the
// density tau^(s+n-1) e^(-tau) / Gamma(s+n). Its pieces: [0, e0] in closed
// form from the first two Taylor terms of the integrand's smooth factor,
// R_n(z) and -R_(n+1)(z); [e0, lam] (lam = min(1, 1/a)) in panels of width
// <= 3 in ln t, which resolves the t^(s+n-1) singularity and, for z near 1,
// the pole at t = ln z < 0; then panels in t up to where 1/(1 - z e^(-t))
// has reached 1 (t = ln(-z) + 17 for z < 0) and the density is negligible
// (tau = s + n + 30; for a > 1 and z < 0 the integrand decays like
// e^(-(a-1) t) before that). A linear panel starting at x is at most 2x
// wide (the singularity at t = 0), at most 8/a wide (e^(-a t)), and at most
// max(4/(1 + n/4), 0.6 |x - L|) wide, L = ln|z|: the poles of the integrand
// sit at t = L +- i pi (of order n + 1), so a panel far from the step at L
// may be a fixed fraction of its distance to it, and next to it the panels
// narrow as n grows. So the panel count does not grow with |z|: in
// measurements the whole f32 range (|z| up to 3.4e38) takes at most 22
// panels. Below z = -1 the factor 1/(1 - z e^(-t)) is carried as its log,
// -softplus(L - t), inside the exponent of the density: the factor runs from
// about 1/|z| to 1 and the density e^(-a t) down past e^(-88), so each alone
// can fall under the smallest normal f32, which a GPU flushes to zero (the
// value at z = -3e38 was 3% off), where their product does not. Every panel
// is an 8-point Gauss-Legendre rule, at most 28 panels (224 integrand
// values, each a Horner sum of n + 1 terms); past that it declines.
// Returns vec2(value, 1) or vec2(0, 0) where it cannot vouch for the value:
// the error estimate adds, in units of the f32 rounding error EPS, the
// errors of the shifted terms, of each node (its exp argument, and the
// moduli of the terms of R_n), of the closed-form head, of ln Gamma(s+n)
// and of a^(-(s+n)), and declines above 3e-5 of the value.
vec2 _gpu_lerch_integral(float z, float s, float a) {
  const float EPS = 6.0e-8;
  const float PI = 3.14159265358979;
  const float gx[4] = float[4](0.1834346424956498, 0.5255324099163290,
    0.7966664774136267, 0.9602898564975363);
  const float gw[4] = float[4](0.3626837833783620, 0.3137066458778873,
    0.2223810344533745, 0.1012285362903763);
  int n = s > 0.0 ? 0 : int(ceil(-s));
  float sn = s + float(n);
  int n0 = a < 0.0 ? int(ceil(-a)) : 0;
  float head = 0.0;
  float zk = 1.0;
  float err = 0.0;
  for (int k = 0; k < n0; k++) {
    float bk = a + float(k);
    float t = zk * _gpu_zeta_pow(bk, -s);
    head += t;
    err += abs(t) * (2.0 + float(k) + abs(s * log2(abs(bk))));
    zk *= z;
  }
  a += float(n0);
  float c[18];
  for (int i = 0; i < 18; i++) c[i] = 0.0;
  c[0] = 1.0;
  for (int m = 0; m < n; m++) _gpu_lerch_pstep(c, a, m);
  float lg = _gpu_lerch_lgamma(sn);
  float lam = min(1.0, 1.0 / a);
  float delta = z > 0.0 ? -log(z) : PI;
  float e0 = 1e-3 * min(lam, delta);
  float la = log(a);
  float tau0 = a * e0;
  float L = z < 0.0 ? log(-z) : log(z);
  bool big = z < -1.0;
  // With the factor in the exponent, every node also carries e^S,
  // S = min(a, 1) L, the size of the largest nodes (about |z|^(-min(a,1))),
  // so that the nodes of a value near the smallest normal f32 do not flush
  // to zero one by one; the sum is divided by e^S at the end, inside one
  // exp (at z = -1e35 a value of 6e-37 was 0.4% off without it).
  float S = big ? min(a, 1.0) * L : 0.0;
  float lG0 = 0.0;
  float v0h = 1.0 / (1.0 - z);
  float u0 = z * v0h;
  if (big) {
    lG0 = -(L + log(1.0 + exp(-L)));
    v0h = exp(lG0);
    u0 = -exp(L + lG0);
  }
  vec2 f0 = _gpu_lerch_poly(c, n, u0, v0h);
  float c1[18] = c;
  _gpu_lerch_pstep(c1, a, n);
  vec2 f1 = _gpu_lerch_poly(c1, n + 1, u0, v0h);
  float p0 = big ? exp(sn * log(tau0) - lg + lG0 + S) : exp(sn * log(tau0) - lg) * v0h;
  float d1 = -f1.x / a;
  float sum = p0 * (f0.x / sn + d1 * tau0 / (sn + 1.0));
  // The head's error: the rounding of Phi(z, -n, a) and Phi(z, -n-1, a),
  // bounded by the moduli of their terms, and the exp that gives p0.
  float ferr = abs(p0) * ((f0.y / sn + f1.y / a * tau0 / (sn + 1.0)) * float(n + 5)) +
    abs(sum) * (abs(sn * log(tau0)) + abs(lg) + abs(L));
  float v0 = log(e0);
  float v1 = log(lam);
  float nlog = max(1.0, ceil((v1 - v0) / 3.0));
  float hv = (v1 - v0) / nlog;
  float TG = max(L, 0.0) + 17.0;
  float tw = (sn + 30.0) / a;
  float tEnd = tw;
  if (z < 0.0) tEnd = max(tw, a > 1.0 ? min(TG, (sn + 30.0) / (a - 1.0)) : TG);
  float hW = 8.0 / a;
  float x = lam;
  for (int p = 0; p < 28; p++) {
    bool logPanel = float(p) < nlog;
    if (!logPanel && x >= tEnd) break;
    float w = logPanel ? hv :
      min(min(2.0 * x, hW), max(4.0 / (1.0 + 0.25 * float(n)), 0.6 * abs(x - L)));
    float cc = logPanel ? v0 + (float(p) + 0.5) * hv : x + 0.5 * w;
    float r = 0.5 * w;
    for (int i = 0; i < 4; i++) {
      for (int j = 0; j < 2; j++) {
        float u = cc + (j == 0 ? -r : r) * gx[i];
        float t = logPanel ? exp(u) : u;
        float tau = a * t;
        float e = logPanel ? sn * (u + la) : (sn - 1.0) * log(tau);
        float vn;
        float un;
        float lG = 0.0;
        if (big) {
          float xs = L - t;
          lG = -(max(xs, 0.0) + log(1.0 + exp(-abs(xs))));
          vn = exp(lG);
          un = -exp(xs + lG);
        } else {
          vn = _gpu_lerch_g(z, t);
          un = z * exp(-t) * vn;
        }
        vec2 pv = _gpu_lerch_poly(c, n, un, vn);
        float ex = e - tau - lg;
        float q = r * gw[i] * ((logPanel ? 1.0 : a) * (big ? exp(ex + lG + S) : exp(ex) * vn));
        sum += q * pv.x;
        ferr += q * (abs(pv.x) * ((abs(e) + tau) + (abs(lG) + abs(L))) +
          pv.y * (float(n + 3) + t));
      }
    }
    if (!logPanel) x += w;
  }
  if (x < tEnd) return vec2(0.0); // the panel budget ran out
  float scaled = big ? (sum < 0.0 ? -1.0 : 1.0) * exp(log(abs(sum)) - (S + sn * la))
                     : pow(a, -sn) * sum;
  float tail = zk * scaled;
  float res = head + tail;
  float rel = ferr / abs(sum) + (8.0 + abs(lg)) +
    ((float(n0) + 2.0) + (abs(sn * log2(a)) + S));
  float bound = EPS * (err + abs(tail) * rel);
  if (!(bound <= 3.0e-5 * abs(res))) return vec2(0.0);
  return vec2(res, 1.0);
}

// The three ways _gpu_lerch_hermite computes h = e^x x^(-sig) Gamma(sig, x)
// at a complex x = (x.x, x.y), sig >= 1. Each returns vec4(Re h, Im h,
// err, ok), with err an estimate of the absolute error of h in units of
// the f32 rounding error.
//
// An integer sig = n + 1: Gamma(n+1, x) = n! e^(-x) sum_{k<=n} x^k / k!,
// so h = (1/x) sum_{j<=n} n!/(n-j)! x^(-j), summed from the inside out.
vec4 _gpu_lerch_h_integer(float sig, vec2 x) {
  int n = int(sig) - 1;
  float d = x.x * x.x + x.y * x.y;
  float ir = x.x / d;
  float ii = -x.y / d;
  float ix = sqrt(ir * ir + ii * ii);
  float rr = 1.0;
  float ri = 0.0;
  float ra = 1.0; // the same sum over the moduli
  for (int j = 1; j <= n; j++) {
    float tr = ir * rr - ii * ri;
    float ti = ir * ri + ii * rr;
    rr = 1.0 + float(j) * tr;
    ri = float(j) * ti;
    ra = 1.0 + float(j) * ix * ra;
  }
  return vec4(rr * ir - ri * ii, rr * ii + ri * ir, (float(n) + 3.0) * ra * ix, 1.0);
}

// |x| < sig: h = e^x x^(-sig) Gamma(sig) - sum_k x^k / (sig (sig+1) ... (sig+k)),
// whose terms decrease from the first. (The continued fraction loses
// digits in f32 there: 8% at sig = 12.9, x = -0.01 - 3.14i.)
vec4 _gpu_lerch_h_series(float sig, vec2 x) {
  float tr = 1.0 / sig;
  float ti = 0.0;
  float sr = tr;
  float si = 0.0;
  float sa = tr;
  int k = 1;
  for (k = 1; k < 100; k++) {
    float f = sig + float(k);
    float nr = (tr * x.x - ti * x.y) / f;
    ti = (tr * x.y + ti * x.x) / f;
    tr = nr;
    sr += tr;
    si += ti;
    float ta = abs(tr) + abs(ti);
    sa += ta;
    if (ta < 1e-8 * (abs(sr) + abs(si))) break;
  }
  float er = x.x - sig * log(sqrt(x.x * x.x + x.y * x.y)) + _gpu_lerch_lgamma(sig);
  // arg x. At z = -1, x.x is -0.0, and the two-argument atan of Apple's
  // GPU (ANGLE Metal and WebGPU) then answers the wrong branch, so the
  // imaginary axis is taken explicitly.
  float arg = x.x == 0.0 ? (x.y < 0.0 ? -1.5707963267949 : 1.5707963267949) : atan(x.y, x.x);
  float ei = x.y - sig * arg;
  float m = exp(er);
  return vec4(m * cos(ei) - sr, m * sin(ei) - si,
    m * (24.0 + abs(er) + abs(ei)) + (float(k) + 3.0) * sa, 1.0);
}

// |x| >= sig: Legendre's continued fraction for h, by the modified Lentz
// method, at most 200 steps.
vec4 _gpu_lerch_h_cf(float sig, vec2 x) {
  const float FPMIN = 1e-30;
  float br = x.x - sig + 1.0;
  float bi = x.y;
  float cr = 1e30;
  float ci = 0.0;
  float dd = br * br + bi * bi;
  float dr = br / dd;
  float di = -bi / dd;
  float hr = dr;
  float hi = di;
  for (int i = 1; i < 200; i++) {
    float an = -float(i) * (float(i) - sig);
    br += 2.0;
    dr = an * dr + br;
    di = an * di + bi;
    if (abs(dr) + abs(di) < FPMIN) dr = FPMIN;
    float cc = cr * cr + ci * ci;
    cr = br + an * cr / cc;
    ci = bi - an * ci / cc;
    if (abs(cr) + abs(ci) < FPMIN) cr = FPMIN;
    dd = dr * dr + di * di;
    dr = dr / dd;
    di = -di / dd;
    float er = dr * cr - di * ci;
    float ei = dr * ci + di * cr;
    float nr = hr * er - hi * ei;
    hi = hr * ei + hi * er;
    hr = nr;
    if (abs(er - 1.0) + abs(ei) < 1e-7)
      return vec4(hr, hi, 35.0 * sqrt(hr * hr + hi * hi), 1.0);
  }
  return vec4(0.0);
}

// Phi(z,s,a) for real z != 0, 1 and s <= 0, from the Hermite-type
// representation (valid for a > 0):
//   Phi(z,s,a) = 1/(2 a^s) + a^(1-s) h - 2 Int_0^inf
//     sin(t log z - s arctan(t/a)) / ((a^2+t^2)^(s/2) (e^(2 pi t) - 1)) dt,
// with h = e^x x^(s-1) Gamma(1-s, x) at x = -a log z. (The middle term is
// z^(-a) (-log z)^(s-1) Gamma(1-s, -a log z): e^x = z^(-a) and
// x^(1-s) = a^(1-s) (-log z)^(1-s) for a real a > 0.) For z < 0,
// log z = ln|z| + i pi; the three terms are then complex and their sum is
// real, so only the real parts are summed, and the integrand's real part
// is sin(t ln|z| - s arctan(t/a)) cosh(pi t) / (e^(2 pi t) - 1). First a is
// shifted to b = a + m >= 1, which keeps |Im x| = pi b >= pi and the
// integrand's branch points at t = +-ib clear of the real axis. The
// integral is an 8-point Gauss-Legendre rule on at most 16 panels up to
// where e^(-pi t) (b^2+t^2)^(-s/2) is negligible, each panel at most 1.5
// wide (poles at t = +-i) and at most 4/|ln|z|| wide (the oscillation);
// past 16 panels it declines. Returns vec2(value, 1) or vec2(0, 0) where
// the error estimate (the pow and exp arguments, h's own error, and the
// cancellation between the terms) exceeds 3e-5 of the value.
vec2 _gpu_lerch_hermite(float z, float s, float a) {
  const float EPS = 6.0e-8;
  const float PI = 3.14159265358979;
  const float gx[4] = float[4](0.1834346424956498, 0.5255324099163290,
    0.7966664774136267, 0.9602898564975363);
  const float gw[4] = float[4](0.3626837833783620, 0.3137066458778873,
    0.2223810344533745, 0.1012285362903763);
  if (s < -30.0) return vec2(0.0);
  int m = a < 1.0 ? int(ceil(1.0 - a)) : 0;
  float head = 0.0;
  float zk = 1.0;
  float err = 0.0;
  for (int k = 0; k < m; k++) {
    float bk = a + float(k);
    if (bk != 0.0) {
      float t = zk * _gpu_zeta_pow(bk, -s);
      head += t;
      err += abs(t) * (2.0 + float(k) + abs(s * log2(abs(bk))));
    }
    zk *= z;
  }
  float b = a + float(m);
  float L = log(abs(z));
  float sig = 1.0 - s;
  vec2 x = vec2(-b * L, z < 0.0 ? -b * PI : 0.0);
  vec4 h;
  if (sig == floor(sig)) h = _gpu_lerch_h_integer(sig, x);
  else if (sqrt(x.x * x.x + x.y * x.y) < sig) h = _gpu_lerch_h_series(sig, x);
  else h = _gpu_lerch_h_cf(sig, x);
  if (h.w < 0.5) return vec2(0.0);
  float t1 = 0.5 * pow(b, -s);
  float bs = pow(b, sig);
  float t2 = bs * h.x;
  // |h| up to a factor sqrt(2), without squaring: near z = 1 an integer
  // order gives an h near 1e25, whose square overflows f32.
  float t2abs = bs * (abs(h.x) + abs(h.y));
  float q3 = max(-s, 0.0);
  float t3end = (21.0 + q3 * log(1.0 + (q3 + 7.0) / b)) / PI;
  float n3 = ceil(t3end / min(1.5, 4.0 / max(abs(L), 1e-3)));
  if (n3 > 16.0) return vec2(0.0);
  float h3 = t3end / n3;
  float t3 = 0.0;
  float a3 = 0.0;
  float b2 = b * b;
  for (int p = 0; p < 16; p++) {
    if (float(p) >= n3) break;
    float c = (float(p) + 0.5) * h3;
    float r = 0.5 * h3;
    for (int i = 0; i < 4; i++) {
      for (int j = 0; j < 2; j++) {
        float t = c + (j == 0 ? -r : r) * gx[i];
        float y = 2.0 * PI * t;
        float q = exp(-y);
        float omq = _gpu_lerch_em(y);
        float K = z < 0.0 ? exp(-PI * t) * (1.0 + q) / (2.0 * omq) : q / omq;
        float f = sin(t * L - s * atan(t / b)) *
          exp(-0.5 * s * log(b2 + t * t)) * K;
        float wf = r * gw[i] * f;
        t3 += wf;
        a3 += abs(wf) * ((6.0 + 10.0 * t) +
          (abs(s) * (2.0 + 0.5 * log2(b2 + t * t)) + abs(t * L)));
      }
    }
  }
  t3 = -2.0 * t3;
  a3 = 2.0 * a3;
  float phi = t1 + t2 + t3;
  float res = head + zk * phi;
  float e1 = t1 * (2.0 + abs(s * log2(b)));
  float e2 = t2abs * (2.0 + abs(sig * log2(b))) + bs * h.z;
  float ephi = (e1 + e2) + (a3 + 3.0 * (t1 + t2abs + abs(t3)));
  float bound = EPS * (err + abs(zk) * (ephi + (float(m) + 2.0) * abs(phi)) + abs(res));
  // An infinite res passes the test above (inf <= inf) although it is a
  // term past the f32 range, not the value: Phi(-0.5, -30, 10) = 8.0e28
  // was -inf. The other methods then answer, or the call is NaN.
  if (!(bound <= 3.0e-5 * abs(res)) || !(abs(res) < 3.4e38)) return vec2(0.0);
  return vec2(res, 1.0);
}

// Phi(z,s,a) for s <= 0: the integral after n integrations by parts (a
// non-integer s >= -LERCH_MAX_N with a > 0), and where it declines the
// Hermite form.
vec2 _gpu_lerch_negative(float z, float s, float a) {
  if (s != floor(s) && a > 0.0 && s >= -16.0) {
    vec2 r = _gpu_lerch_integral(z, s, a);
    if (r.y > 0.5) return r;
  }
  return _gpu_lerch_hermite(z, s, a);
}

// Phi(z,s,a) as vec2(value, 1), or vec2(0, 0) where the value is complex
// or no method can vouch for it. The cases, in order: z = 1 is the Hurwitz
// zeta; z = 0 keeps only the k = 0 term; s = 0 is 1/(1 - z); a
// non-positive integer s >= -LERCH_MAX_N is the rational function of
// _gpu_lerch_rational, for every z, where it does not decline; a
// non-positive integer a with s > 0 is the pole (+inf); a < 0 with a
// non-integer s is complex; z > 1 is on the branch cut unless s is a
// non-positive integer, where Phi has no cut (the Hermite form). Past
// z = -1 and at z = -1: the positive integral for s > 0, and for s <= 0
// _gpu_lerch_negative. Inside the unit interval: the Euler transform
// (z < 0, s > 0) or the direct series, and where those decline the
// integral (s > 0) or _gpu_lerch_negative (s <= 0).
vec2 _gpu_lerch_core(float z, float s, float a) {
  if (z == 1.0) return vec2(_gpu_hurwitz_zeta(s, a), 1.0);
  if (z == 0.0) return vec2(_gpu_zeta_pow(a, -s), 1.0); // only the k = 0 term survives
  if (s == 0.0) return vec2(1.0 / (1.0 - z), 1.0);
  if (s < 0.0 && s == floor(s) && s >= -16.0) {
    vec2 q = _gpu_lerch_rational(z, int(-s), a);
    if (q.y > 0.5) return q;
  }
  bool aNonposInt = a <= 0.0 && a == floor(a);
  if (aNonposInt && s > 0.0) return vec2(_gpu_inf(), 1.0); // (k+a) = 0 diverges, z != 0
  if (a < 0.0 && s != floor(s)) return vec2(0.0); // complex value
  if (a < -1.0e6) return vec2(0.0); // one term per unit of -a
  if (z > 1.0) {
    if (s > 0.0 || s != floor(s)) return vec2(0.0); // on the branch cut
    return _gpu_lerch_hermite(z, s, a);
  }
  if (z < -1.0) return s > 0.0 ? _gpu_lerch_integral(z, s, a) : _gpu_lerch_negative(z, s, a);
  if (z < 0.0 && s > 0.0) {
    vec2 e = _gpu_lerch_euler(z, s, a);
    return e.y > 0.5 ? e : _gpu_lerch_integral(z, s, a);
  }
  if (z == -1.0) return _gpu_lerch_negative(z, s, a); // s < 0: the series diverges
  vec2 r = _gpu_lerch_series(z, s, a);
  if (r.y > 0.5) return r;
  return s > 0.0 ? _gpu_lerch_integral(z, s, a) : _gpu_lerch_negative(z, s, a);
}

// Phi(z, s, a) for z < 0, -30 <= s <= -3 and |a| < 100, from the Fourier
// modes of the base point b = a moved into (0, 1] (the form of
// lerchModesComplex, numerics/lerch-phi.ts, for a real z < 0):
//   Phi(z, s, b) = 2 Gamma(1-s) e^(-b L) sum_{m = 1, 3, 5, ...}
//     (L^2 + pi^2 m^2)^((s-1)/2) cos(pi (b m + (s-1) (1/2 + atan(L/(pi m))/pi))),
// L = ln|z|: the modes n and 1 - n of the sum over all integers n, paired.
// The terms fall like m^(s-1) and do not cancel the way the Hermite form's
// terms do below z = -1. The sum stops when the bound m (pi m)^(s-1)/(2|s|)
// on the modes left out, taken against the first one, is below 1e-9, and
// after 128 modes at most (ln|z| near 7 at s = -4). The phase is kept in
// units of pi and reduced to [-1/2, 1/2] before the cosine; b m and
// (s-1)/2 are reduced modulo 2 exactly. The modes are summed relative to
// the first one, and the factor 2 Gamma(1-s) e^(-bL) (L^2 + pi^2)^((s-1)/2)
// is one exp. a <= 0 adds the terms z^j (a+j)^(-s) before b; a > 1 uses
// Phi(z,s,a) = z^(-m) (Phi(z,s,b) - sum_{j<m} z^j (b+j)^(-s)). With c = 1
// (only with a = 1) the value is z Phi(z, s, 1) = Li_s(z): the factor
// z = -e^L goes into the exponent of the scale, so that Li_s(z) does not
// pass through Phi, which falls below the smallest normal f32 (1.18e-38)
// before Li_s(z) does. Returns vec2(value, 1), or vec2(0, 0) when the error
// estimate (the roundings of the exp and log arguments and of the phase,
// the modes left out, ln Gamma and the shift, in units of 6e-8) exceeds
// 3e-5 of the value, when the value is not a finite normal f32, or when
// z^(-m), the shifted sum or z^m is not: a GPU flushes a value below
// 1.18e-38 to 0, and a value past 3.4e38 is inf. The test is
// rerr <= 500 |res| (500 = 3e-5 / 6e-8): EPS rerr and 3e-5 |res| themselves
// fall below 1.18e-38 when |res| is below about 4e-34.
vec2 _gpu_lerch_modes(float z, float s, float a, float c) {
  const float EPS = 6.0e-8;
  const float FLUSH = 2.0e-31; // 1.18e-38 / EPS
  const float PI = 3.14159265358979;
  if (s < -30.0 || abs(a) >= 100.0) return vec2(0.0);
  float b = a;
  float pre = 0.0;
  float post = 0.0;
  if (a <= 0.0) {
    pre = floor(-a) + 1.0;
    b = a + pre;
  } else if (a > 1.0) {
    post = ceil(a) - 1.0;
    b = a - post;
  }
  float head = 0.0;
  float herr = 0.0;
  float zk = 1.0;
  for (int j = 0; j < 128; j++) {
    if (float(j) >= pre) break;
    float bj = a + float(j);
    if (bj != 0.0) {
      float t = zk * _gpu_zeta_pow(bj, -s);
      head += t;
      herr += abs(t) * (3.0 + float(j) + abs(s * log2(abs(bj))));
    }
    zk *= z;
  }
  float L = log(-z);
  float sm1 = s - 1.0;
  float hs = 0.5 * sm1;
  float ps = hs - 2.0 * floor(0.5 * hs); // (s-1)/2 modulo 2
  float L2 = L * L;
  float lr1 = log(L2 + PI * PI);
  float sum = 0.0;
  float err = 0.0;
  float tail = 0.0;
  for (int n = 1; n <= 128; n++) {
    float m = float(2 * n - 1);
    float x = PI * m;
    float lr = log(L2 + x * x);
    float at = atan(L / x) / PI;
    float bm = b * m;
    float P = (bm - 2.0 * floor(0.5 * bm)) + ps + sm1 * at;
    float k = floor(P + 0.5);
    float cs = cos(PI * (P - k));
    if (mod(k, 2.0) != 0.0) cs = -cs;
    float ex = hs * (lr - lr1);
    float mag = exp(ex);
    float t = mag * cs;
    sum += t;
    err += abs(t) * (4.0 + abs(ex)) +
      mag * (abs(hs) * (abs(lr) + abs(lr1)) + PI * (abs(P) + abs(sm1) * abs(at) + b * m));
    tail = mag * m / (-2.0 * s);
    if (tail <= 1e-9) break;
  }
  float lg = _gpu_lerch_lgamma(1.0 - s);
  float scale = 2.0 * exp(lg + hs * lr1 - (b - c) * L);
  float phib = scale * sum;
  if (!(scale < 3.4e38 && abs(phib) < 3.4e38)) return vec2(0.0);
  float eb = scale * (err + tail / EPS + 4.0 * abs(sum)) +
    abs(phib) * (abs(lg) + abs(hs * lr1) + abs((b - c) * L) + 12.0);
  // A GPU flushes a scale or Phi(z, s, b) below 1.18e-38 to 0: count the
  // loss (FLUSH = 1.18e-38 in units of EPS) rather than decline, since
  // next to the terms that a > 1 subtracts it can be negligible.
  if (scale < 1.18e-38 || abs(phib) < 1.18e-38) eb += FLUSH * (1.0 + abs(sum));
  if (c > 0.5) phib = -phib; // z = -e^L
  float res;
  float rerr;
  if (post > 0.0) {
    float acc = phib;
    float aerr = eb;
    float zj = 1.0;
    for (int j = 0; j < 128; j++) {
      if (float(j) >= post) break;
      float bj = b + float(j);
      float t = zj * pow(bj, -s);
      acc -= t;
      aerr += abs(t) * (3.0 + float(j) + abs(s * log2(bj)));
      zj *= z;
    }
    float zinv = pow(-z, -post);
    if (!(zinv >= 1.18e-38 && zinv < 3.4e38 && abs(acc) >= 1.18e-38 && abs(acc) < 3.4e38))
      return vec2(0.0);
    float sg = mod(post, 2.0) == 0.0 ? 1.0 : -1.0;
    res = sg * zinv * acc;
    rerr = zinv * (aerr + abs(acc) * (post + 2.0)) + abs(res) * abs(post * log2(-z));
  } else {
    if (!(abs(zk) >= 1.18e-38 && abs(zk) < 3.4e38)) return vec2(0.0);
    res = head + zk * phib;
    rerr = herr + abs(zk) * (eb + abs(phib) * (pre + 2.0));
  }
  // 500.0 * abs(res) is +inf for abs(res) > 6.8e35, and an error estimate
  // that overflowed to +inf passed the test inf <= inf: an infinite
  // estimate must decline.
  if (!(abs(res) >= 1.18e-38 && abs(res) < 3.4e38) ||
      !(rerr < 3.4e38 && rerr <= 500.0 * abs(res)))
    return vec2(0.0);
  return vec2(res, 1.0);
}

// Where every method of _gpu_lerch_core declines, z < 0 with s <= -3 tries
// the Fourier modes last, so that the values the other methods answer do
// not change.
float _gpu_lerch_phi(float z, float s, float a) {
  vec2 r = _gpu_lerch_core(z, s, a);
  if (r.y > 0.5) return r.x;
  if (z < 0.0 && s <= -3.0 && !(a < 0.0 && s != floor(s))) {
    r = _gpu_lerch_modes(z, s, a, 0.0);
    if (r.y > 0.5) return r.x;
  }
  return _gpu_nan();
}

// Li_s(z) for z < -1 and a real s < 0 that is not an integer, by
// Jonquiere's inversion formula (DLMF 25.12.13 with the Hurwitz zeta form):
//   Li_s(z) = Re[(2 pi)^s e^(i pi s/2) / Gamma(s) zeta(1 - s, A)]
//             - cos(pi s) Li_s(1/z),   A = 1/2 - i ln(-z) / (2 pi).
// zeta(1 - s, A) (1 - s > 1) is summed by Euler-Maclaurin: 12 terms, the
// tail integral, the half term and up to 8 Bernoulli corrections, in
// complex f32. 1/Gamma(s) = sin(pi s) Gamma(1 - s) / pi, with sin(pi s)
// taken from the distance of s to its nearest integer. Returns
// vec2(value, 1), or vec2(0, 0) when Li_s(1/z) declines, when the value is
// not a finite normal f32, or when the error estimate exceeds 3e-5 of the
// value. The estimate counts, for each value that a GPU can flush to 0
// (below 1.18e-38), the loss of 1.18e-38 (FLUSH, in units of EPS): the
// terms of zeta(1 - s, A), of which |A|^(s-1) falls below 1.18e-38 near
// z = -1e38 when s is near -30, and the terms of Li_s(1/z).
vec2 _gpu_poly_log_inversion(float s, float z) {
  const float EPS = 6.0e-8;
  const float FLUSH = 2.0e-31; // 1.18e-38 / EPS
  const float PI = 3.14159265358979;
  const float B[8] = float[8](1.0 / 6.0, -1.0 / 30.0, 1.0 / 42.0, -1.0 / 30.0,
    5.0 / 66.0, -691.0 / 2730.0, 7.0 / 6.0, -3617.0 / 510.0);
  float ai = -log(-z) / (2.0 * PI);
  float sig = 1.0 - s;
  float zr = 0.0;
  float zi = 0.0;
  float zerr = 0.0;
  for (int k = 0; k < 12; k++) {
    float wr = 0.5 + float(k);
    float lnw = 0.5 * log(wr * wr + ai * ai);
    float ph = -sig * atan(ai, wr);
    float m = exp(-sig * lnw);
    zr += m * cos(ph);
    zi += m * sin(ph);
    zerr += m * (4.0 + abs(sig * lnw) + abs(ph));
  }
  float wr = 12.5;
  float lnw = 0.5 * log(wr * wr + ai * ai);
  float th = atan(ai, wr);
  // w^(1 - sig) / (sig - 1), with 1 - sig = s taken from s itself: near
  // s = 0, (1 - s) - 1 would keep only a few digits of s.
  float m1 = exp(s * lnw) / -s;
  float p1 = s * th;
  zr += m1 * cos(p1);
  zi += m1 * sin(p1);
  zerr += abs(m1) * (4.0 + abs(s * lnw) + abs(p1));
  // w^(-sig) / 2
  float m0 = exp(-sig * lnw);
  float p0 = -sig * th;
  zr += 0.5 * m0 * cos(p0);
  zi += 0.5 * m0 * sin(p0);
  zerr += 0.5 * m0 * (4.0 + abs(sig * lnw) + abs(p0));
  // Bernoulli terms B_2j (sig)_(2j-1) / (2j)! w^(-sig-2j+1): u starts at
  // (sig/2) w^(-sig-1) and gains (sig+2j-1)(sig+2j) / ((2j+1)(2j+2) w^2).
  float mu1 = exp((-sig - 1.0) * lnw);
  float pu1 = (-sig - 1.0) * th;
  float ur = sig / 2.0 * mu1 * cos(pu1);
  float ui = sig / 2.0 * mu1 * sin(pu1);
  float w2r = wr * wr - ai * ai;
  float w2i = 2.0 * wr * ai;
  float w2d = w2r * w2r + w2i * w2i;
  float iw2r = w2r / w2d;
  float iw2i = -w2i / w2d;
  float prev = 3.0e38;
  for (int j = 1; j <= 8; j++) {
    float tr = ur * B[j - 1];
    float ti = ui * B[j - 1];
    float ta = abs(tr) + abs(ti);
    if (ta >= prev) break;
    zr += tr;
    zi += ti;
    zerr += ta * (10.0 + abs(sig * lnw));
    prev = ta;
    float mm = float(2 * j);
    float c = (sig + mm - 1.0) * (sig + mm) / ((mm + 1.0) * (mm + 2.0));
    float nr = c * (ur * iw2r - ui * iw2i);
    ui = c * (ur * iw2i + ui * iw2r);
    ur = nr;
  }
  zerr += 44.0 * FLUSH; // at most 22 terms in each of zr and zi
  float n = floor(s + 0.5);
  float d = s - n;
  float sgn = mod(n, 2.0) == 0.0 ? 1.0 : -1.0;
  float lg1 = _gpu_lerch_lgamma(sig);
  float fm = sgn * sin(PI * d) * exp(s * log(2.0 * PI) + lg1) / PI;
  float fre = fm * cos(0.5 * PI * s);
  float fim = fm * sin(0.5 * PI * s);
  float first = fre * zr - fim * zi;
  float firstErr = abs(fm) * zerr +
    abs(fm) * sqrt(zr * zr + zi * zi) * (30.0 + abs(lg1) + abs(s * 2.7));
  // Li_s(1/z): for |1/z| <= 1/2 its own series sum_k (1/z)^k k^(-s), with
  // an error estimate, stopped when the tail after the term t is below
  // t rho/(1-rho) <= 1e-8 of the sum, rho = |1/z| ((k+1)/k)^(-s): the ratio
  // of the next term to t, which bounds every later ratio because it
  // decreases with k for s < 0. (The ratio |1/z| alone does not bound it:
  // the second term is 2^(-s) |1/z| times the first, 0.6 of it at
  // z = -8.7e8, s = -29, where the sum stopped after one term and the value
  // was 9.6 times too large.) Closer to the rim _gpu_lerch_negative (the
  // integral, then the Hermite form) at 1/z.
  float iz = 1.0 / z;
  float li = 0.0;
  float lierr = 0.0;
  if (iz >= -0.5) {
    float wk = 1.0;
    float prev = 3.0e38;
    bool done = false;
    for (int k = 1; k < 200; k++) {
      wk *= iz;
      float t = wk * pow(float(k), -s);
      li += t;
      float size = abs(t);
      lierr += size * (2.0 + float(k) + abs(s * log2(float(k)))) + FLUSH;
      float rho = -iz * pow(float(k + 1) / float(k), -s);
      if (size < prev && rho < 1.0 && size * rho / (1.0 - rho) <= 1e-8 * abs(li)) {
        done = true;
        break;
      }
      prev = size;
    }
    if (!done) return vec2(0.0);
  } else {
    vec2 inner = _gpu_lerch_negative(iz, s, 1.0);
    if (inner.y < 0.5) return vec2(0.0);
    li = iz * inner.x;
    lierr = 500.0 * abs(li); // the inner value is within 3e-5 = 500 EPS
  }
  float res = first - sgn * cos(PI * d) * li;
  // In units of EPS; the test is bound <= (3e-5 / EPS) |res|, since
  // EPS bound and 3e-5 |res| fall below 1.18e-38 for a small |res|.
  float bound = ((firstErr + 4.0 * abs(first)) + (lierr + 2.0 * abs(li))) + 4.0 * FLUSH;
  // An estimate that overflowed to +inf declines (500.0 * abs(res) is +inf
  // for abs(res) > 6.8e35, and inf <= inf passes).
  if (!(abs(res) >= 1.18e-38 && abs(res) < 3.4e38) ||
      !(bound < 3.4e38 && bound <= 500.0 * abs(res)))
    return vec2(0.0);
  return vec2(res, 1.0);
}

// PolyLog(s, z). The integer orders the interpreter answers in closed form
// come first, so the shader agrees with it there: z = 0 is 0; the orders 1,
// 0 and -1 are -ln(1 - z), z/(1 - z) and z/(1 - z)^2, with a pole (+inf)
// at z = 1; an order -n, 2 <= n <= 12, is the Eulerian closed form
// z * sum_k A(n,k) z^k / (1 - z)^(n+1), which for |z| > 1 is summed in
// u = z/(1 - z) and v = 1/(1 - z) (|u|, |v| <= 1 for z < -1) so that it does
// not overflow. Every other order uses Li_s(z) = z * Phi(z, s, 1), and where
// that declines below z = -1 with a negative non-integer order, Jonquiere's
// inversion formula (_gpu_poly_log_inversion). NaN on the cut z > 1 (except
// the orders above) and where both decline.
float _gpu_poly_log(float s, float z) {
  if (z == 0.0) return 0.0;
  if (s == 1.0) {
    if (z == 1.0) return _gpu_inf();
    return z < 1.0 ? -log(1.0 - z) : _gpu_nan();
  }
  if (s == 0.0) {
    if (z == 1.0) return _gpu_inf();
    return z / (1.0 - z);
  }
  if (s == -1.0) {
    if (z == 1.0) return _gpu_inf();
    return z / ((1.0 - z) * (1.0 - z));
  }
  if (s <= -2.0 && s >= -12.0 && s == floor(s) && z != 1.0) {
    int n = int(-s);
    // Row n of the Eulerian numbers, built in place from row 0 = [1]:
    // A(m,k) = (k+1) A(m-1,k) + (m-k) A(m-1,k-1), updated from the top so
    // each entry still reads the previous row's values.
    float row[13];
    row[0] = 1.0;
    for (int i = 1; i < 13; i++) row[i] = 0.0;
    for (int m = 1; m <= n; m++) {
      for (int k = m - 1; k >= 1; k--)
        row[k] = float(k + 1) * row[k] + float(m - k) * row[k - 1];
    }
    if (abs(z) > 1.0) {
      // sum_k A(n,k) u^(k+1) v^(n-k) = u v sum_k A(n,k) u^k v^(n-1-k)
      float v = 1.0 / (1.0 - z);
      float u = z * v;
      float r = row[n - 1];
      float vp = v;
      for (int k = n - 2; k >= 0; k--) {
        r = r * u + row[k] * vp;
        vp *= v;
      }
      return u * v * r;
    }
    float p = 0.0;
    for (int k = n - 1; k >= 0; k--) p = p * z + row[k];
    float den = 1.0;
    for (int i = 0; i <= n; i++) den *= 1.0 - z;
    return z * p / den;
  }
  // Below z = -1, Phi(z, s, 1) = Li_s(z)/z falls below the smallest normal
  // f32 before Li_s(z) does, and the 3e-5 test of the methods behind
  // _gpu_lerch_core falls below it (a GPU flushes both sides to 0) when
  // |Phi| < 1.18e-38 / 3e-5 = 3.9e-34: the inversion and the modes (with the
  // factor z in the exponent) answer there instead.
  vec2 r = _gpu_lerch_core(z, s, 1.0);
  if (r.y > 0.5 && (z >= -1.0 || (abs(r.x) >= 3.9e-34 && abs(z * r.x) < 3.4e38)))
    return z * r.x;
  if (z < -1.0 && s < 0.0 && s != floor(s)) {
    vec2 v = _gpu_poly_log_inversion(s, z);
    if (v.y > 0.5) return v.x;
  }
  if (z < 0.0 && s <= -3.0) {
    r = _gpu_lerch_modes(z, s, 1.0, 1.0);
    if (r.y > 0.5) return r.x;
  }
  return _gpu_nan();
}
`,Es=`
fn _gpu_lerch_series(z: f32, s: f32, a: f32) -> vec2<f32> {
  var n0: i32 = 0;
  if (a < 0.0) { n0 = i32(ceil(-a)); }
  let az = abs(z);
  var sum: f32 = 0.0;
  var zk: f32 = 1.0;
  var prev: f32 = 3.0e38;
  // The error estimate: see the GLSL preamble.
  var err: f32 = 0.0;
  var sizes: f32 = 0.0;
  var bmin: f32 = 3.0e38;
  var bmax: f32 = 0.0;
  var settled: i32 = 0;
  for (var k: i32 = 0; k < n0 + 4096; k = k + 1) {
    let b = a + f32(k);
    var t: f32 = 0.0;
    if (b != 0.0) { t = zk * _gpu_zeta_pow(b, -s); }
    sum = sum + t;
    let size = abs(t);
    err = err + size * (2.0 + f32(k));
    sizes = sizes + size;
    if (b != 0.0) {
      bmin = min(bmin, abs(b));
      bmax = max(bmax, abs(b));
    }
    if (b > 0.0) {
      let rho = max(size / prev, az);
      if (size == 0.0 ||
          (size < prev && rho < 1.0 &&
           size * rho / (1.0 - rho) <= 1e-7 * abs(sum))) {
        settled = settled + 1;
        if (settled == 3) {
          let lb = max(abs(log2(bmin)), abs(log2(bmax)));
          let bound = 6.0e-8 * (err + sizes * (2.0 + abs(s * lb)));
          if (!(bound <= 3.0e-5 * abs(sum))) { return vec2<f32>(0.0); }
          if (abs(sum) * (1.0 - az) < 1.9721523e-31) { return vec2<f32>(0.0); }
          return vec2<f32>(sum, 1.0);
        }
      } else {
        settled = 0;
      }
      prev = size;
    }
    zk = zk * z;
  }
  return vec2<f32>(0.0);
}

fn _gpu_lerch_euler(z: f32, s: f32, a: f32) -> vec2<f32> {
  var n0: i32 = 0;
  if (a <= 0.0) { n0 = i32(floor(-a)) + 1; }
  var head: f32 = 0.0;
  var zn: f32 = 1.0;
  var largest: f32 = 0.0;
  for (var k: i32 = 0; k < n0; k = k + 1) {
    let b = a + f32(k);
    var t: f32 = 0.0;
    if (b != 0.0) { t = zn * _gpu_zeta_pow(b, -s); }
    head = head + t;
    largest = max(largest, abs(t));
    zn = zn * z;
  }
  let b0 = a + f32(n0);
  var w: array<f32, 65>;
  var nterm: i32 = 0;
  var sum: f32 = 0.0;
  var zPow: f32 = 1.0;
  var settled: i32 = 0;
  for (var k: i32 = 0; k < 64; k = k + 1) {
    let cur = zPow * pow(b0 + f32(k), -s);
    var inc: f32;
    if (k == 0) {
      nterm = 1;
      w[1] = cur;
      inc = 0.5 * cur;
    } else {
      var tmp = w[1];
      w[1] = cur;
      for (var j: i32 = 1; j <= nterm - 1; j = j + 1) {
        let dum = w[j + 1];
        w[j + 1] = 0.5 * (w[j] + tmp);
        tmp = dum;
      }
      if (nterm >= 64) { return vec2<f32>(0.0); }
      w[nterm + 1] = 0.5 * (w[nterm] + tmp);
      if (abs(w[nterm + 1]) <= abs(w[nterm])) {
        nterm = nterm + 1;
        inc = 0.5 * w[nterm];
      } else {
        inc = w[nterm + 1];
      }
    }
    sum = sum + inc;
    zPow = zPow * z;
    if (k > 4 && abs(inc) <= 1e-7 * abs(sum)) {
      settled = settled + 1;
      if (settled == 3) {
        if (abs(sum) < 1.9721523e-31) { return vec2<f32>(0.0); }
        let tail = zn * sum;
        let res = head + tail;
        if (max(largest, abs(tail)) > 100.0 * abs(res)) { return vec2<f32>(0.0); }
        return vec2<f32>(res, 1.0);
      }
    } else {
      settled = 0;
    }
  }
  return vec2<f32>(0.0);
}

// 1 - e^(-t), t >= 0: see the GLSL preamble.
fn _gpu_lerch_em(t: f32) -> f32 {
  if (t < 0.25) {
    return t * (1.0 - t / 2.0 * (1.0 - t / 3.0 * (1.0 - t / 4.0 *
      (1.0 - t / 5.0 * (1.0 - t / 6.0 * (1.0 - t / 7.0))))));
  }
  return 1.0 - exp(-t);
}

// ln Gamma(s) for s > 0: see the GLSL preamble.
fn _gpu_lerch_lgamma(s: f32) -> f32 {
  var p: f32 = 1.0;
  var x: f32 = s;
  for (var k: i32 = 0; k < 8; k = k + 1) {
    if (x >= 8.0) { break; }
    p = p * x;
    x = x + 1.0;
  }
  let x2 = x * x;
  let corr = (1.0 / 12.0 - (1.0 / 360.0 - 1.0 / (1260.0 * x2)) / x2) / x;
  return (x - 0.5) * log(x) - x + (0.91893853320467274 + corr) - log(p);
}

fn _gpu_lerch_g(z: f32, t: f32) -> f32 {
  if (z < 0.0) { return 1.0 / (1.0 - z * exp(-t)); }
  return 1.0 / ((1.0 - z) + z * _gpu_lerch_em(t));
}

// One step of the polynomials P_m of Phi(w, -m, a): see the GLSL preamble.
fn _gpu_lerch_pstep(c: ptr<function, array<f32, 18>>, a: f32, m: i32) {
  for (var k: i32 = m + 1; k >= 0; k = k - 1) {
    var hi: f32 = 0.0;
    var lo: f32 = 0.0;
    if (k <= m) { hi = (a + f32(k)) * (*c)[k]; }
    if (k >= 1) { lo = (f32(m + 2) - a - f32(k)) * (*c)[k - 1]; }
    (*c)[k] = hi + lo;
  }
}

// Phi(w, -n, a) without its factor v, and the sum of the moduli of its
// terms: see the GLSL preamble.
fn _gpu_lerch_poly(c: ptr<function, array<f32, 18>>, n: i32, u: f32, v: f32) -> vec2<f32> {
  let au = abs(u);
  let av = abs(v);
  var r = (*c)[n];
  var ra = abs((*c)[n]);
  var vp = v;
  var avp = av;
  for (var k: i32 = n - 1; k >= 0; k = k - 1) {
    r = r * u + (*c)[k] * vp;
    ra = ra * au + abs((*c)[k]) * avp;
    vp = vp * v;
    avp = avp * av;
  }
  return vec2<f32>(r, ra);
}

// Phi(z, -n, a) for an integer n, in closed form: see the GLSL preamble.
fn _gpu_lerch_rational(z: f32, n: i32, a: f32) -> vec2<f32> {
  let EPS = 6.0e-8;
  var c: array<f32, 18>;
  c[0] = 1.0;
  for (var m: i32 = 0; m < n; m = m + 1) { _gpu_lerch_pstep(&c, a, m); }
  let v = 1.0 / (1.0 - z);
  let q = _gpu_lerch_poly(&c, n, z * v, v);
  if (!(EPS * (f32(n + 4) * q.y) <= 3.0e-5 * abs(q.x))) { return vec2<f32>(0.0); }
  return vec2<f32>(q.x * v, 1.0);
}

// Phi(z,s,a) for z < 1 by the integral (after n integrations by parts for
// s <= 0): see the GLSL preamble.
fn _gpu_lerch_integral(z: f32, s: f32, a0: f32) -> vec2<f32> {
  let EPS = 6.0e-8;
  let PI = 3.14159265358979;
  let gx = array<f32, 4>(0.1834346424956498, 0.5255324099163290,
    0.7966664774136267, 0.9602898564975363);
  let gw = array<f32, 4>(0.3626837833783620, 0.3137066458778873,
    0.2223810344533745, 0.1012285362903763);
  var n: i32 = 0;
  if (s <= 0.0) { n = i32(ceil(-s)); }
  let sn = s + f32(n);
  var n0: i32 = 0;
  if (a0 < 0.0) { n0 = i32(ceil(-a0)); }
  var head: f32 = 0.0;
  var zk: f32 = 1.0;
  var err: f32 = 0.0;
  for (var k: i32 = 0; k < n0; k = k + 1) {
    let bk = a0 + f32(k);
    let t = zk * _gpu_zeta_pow(bk, -s);
    head = head + t;
    err = err + abs(t) * (2.0 + f32(k) + abs(s * log2(abs(bk))));
    zk = zk * z;
  }
  let a = a0 + f32(n0);
  var c: array<f32, 18>;
  c[0] = 1.0;
  for (var m: i32 = 0; m < n; m = m + 1) { _gpu_lerch_pstep(&c, a, m); }
  let lg = _gpu_lerch_lgamma(sn);
  let lam = min(1.0, 1.0 / a);
  var delta = PI;
  if (z > 0.0) { delta = -log(z); }
  let e0 = 1e-3 * min(lam, delta);
  let la = log(a);
  let tau0 = a * e0;
  var L: f32;
  if (z < 0.0) { L = log(-z); } else { L = log(z); }
  let big = z < -1.0;
  // The shift S: see the GLSL preamble.
  var S: f32 = 0.0;
  if (big) { S = min(a, 1.0) * L; }
  var lG0: f32 = 0.0;
  var v0h = 1.0 / (1.0 - z);
  var u0 = z * v0h;
  if (big) {
    lG0 = -(L + log(1.0 + exp(-L)));
    v0h = exp(lG0);
    u0 = -exp(L + lG0);
  }
  let f0 = _gpu_lerch_poly(&c, n, u0, v0h);
  var c1 = c;
  _gpu_lerch_pstep(&c1, a, n);
  let f1 = _gpu_lerch_poly(&c1, n + 1, u0, v0h);
  var p0: f32;
  if (big) { p0 = exp(sn * log(tau0) - lg + lG0 + S); } else { p0 = exp(sn * log(tau0) - lg) * v0h; }
  let d1 = -f1.x / a;
  var sum = p0 * (f0.x / sn + d1 * tau0 / (sn + 1.0));
  var ferr = abs(p0) * ((f0.y / sn + f1.y / a * tau0 / (sn + 1.0)) * f32(n + 5)) +
    abs(sum) * (abs(sn * log(tau0)) + abs(lg) + abs(L));
  let v0 = log(e0);
  let v1 = log(lam);
  let nlog = max(1.0, ceil((v1 - v0) / 3.0));
  let hv = (v1 - v0) / nlog;
  let TG = max(L, 0.0) + 17.0;
  let tw = (sn + 30.0) / a;
  var tEnd = tw;
  if (z < 0.0) {
    if (a > 1.0) { tEnd = max(tw, min(TG, (sn + 30.0) / (a - 1.0))); } else { tEnd = max(tw, TG); }
  }
  let hW = 8.0 / a;
  var x = lam;
  for (var p: i32 = 0; p < 28; p = p + 1) {
    let logPanel = f32(p) < nlog;
    if (!logPanel && x >= tEnd) { break; }
    var w: f32;
    var cc: f32;
    if (logPanel) {
      w = hv;
      cc = v0 + (f32(p) + 0.5) * hv;
    } else {
      w = min(min(2.0 * x, hW), max(4.0 / (1.0 + 0.25 * f32(n)), 0.6 * abs(x - L)));
      cc = x + 0.5 * w;
    }
    let r = 0.5 * w;
    for (var i: i32 = 0; i < 4; i = i + 1) {
      for (var j: i32 = 0; j < 2; j = j + 1) {
        let u = cc + select(r, -r, j == 0) * gx[i];
        var t = u;
        var e: f32;
        var scale: f32 = a;
        if (logPanel) {
          t = exp(u);
          e = sn * (u + la);
          scale = 1.0;
        } else {
          e = (sn - 1.0) * log(a * t);
        }
        let tau = a * t;
        var vn: f32;
        var un: f32;
        var lG: f32 = 0.0;
        if (big) {
          let xs = L - t;
          lG = -(max(xs, 0.0) + log(1.0 + exp(-abs(xs))));
          vn = exp(lG);
          un = -exp(xs + lG);
        } else {
          vn = _gpu_lerch_g(z, t);
          un = z * exp(-t) * vn;
        }
        let pv = _gpu_lerch_poly(&c, n, un, vn);
        let ex = e - tau - lg;
        var f: f32;
        if (big) { f = exp(ex + lG + S); } else { f = exp(ex) * vn; }
        let q = r * gw[i] * (scale * f);
        sum = sum + q * pv.x;
        ferr = ferr + q * (abs(pv.x) * ((abs(e) + tau) + (abs(lG) + abs(L))) +
          pv.y * (f32(n + 3) + t));
      }
    }
    if (!logPanel) { x = x + w; }
  }
  if (x < tEnd) { return vec2<f32>(0.0); } // the panel budget ran out
  var scaled: f32;
  if (big) {
    scaled = select(1.0, -1.0, sum < 0.0) * exp(log(abs(sum)) - (S + sn * la));
  } else {
    scaled = pow(a, -sn) * sum;
  }
  let tail = zk * scaled;
  let res = head + tail;
  let rel = ferr / abs(sum) + (8.0 + abs(lg)) +
    ((f32(n0) + 2.0) + (abs(sn * log2(a)) + S));
  let bound = EPS * (err + abs(tail) * rel);
  if (!(bound <= 3.0e-5 * abs(res))) { return vec2<f32>(0.0); }
  return vec2<f32>(res, 1.0);
}

// h = e^x x^(-sig) Gamma(sig, x), integer sig: see the GLSL preamble.
fn _gpu_lerch_h_integer(sig: f32, x: vec2<f32>) -> vec4<f32> {
  let n = i32(sig) - 1;
  let d = x.x * x.x + x.y * x.y;
  let ir = x.x / d;
  let ii = -x.y / d;
  let ix = sqrt(ir * ir + ii * ii);
  var rr: f32 = 1.0;
  var ri: f32 = 0.0;
  var ra: f32 = 1.0;
  for (var j: i32 = 1; j <= n; j = j + 1) {
    let tr = ir * rr - ii * ri;
    let ti = ir * ri + ii * rr;
    rr = 1.0 + f32(j) * tr;
    ri = f32(j) * ti;
    ra = 1.0 + f32(j) * ix * ra;
  }
  return vec4<f32>(rr * ir - ri * ii, rr * ii + ri * ir, (f32(n) + 3.0) * ra * ix, 1.0);
}

// h for |x| < sig, by the series: see the GLSL preamble.
fn _gpu_lerch_h_series(sig: f32, x: vec2<f32>) -> vec4<f32> {
  var tr: f32 = 1.0 / sig;
  var ti: f32 = 0.0;
  var sr: f32 = tr;
  var si: f32 = 0.0;
  var sa: f32 = tr;
  var k: i32 = 1;
  for (k = 1; k < 100; k = k + 1) {
    let f = sig + f32(k);
    let nr = (tr * x.x - ti * x.y) / f;
    ti = (tr * x.y + ti * x.x) / f;
    tr = nr;
    sr = sr + tr;
    si = si + ti;
    let ta = abs(tr) + abs(ti);
    sa = sa + ta;
    if (ta < 1e-8 * (abs(sr) + abs(si))) { break; }
  }
  let er = x.x - sig * log(sqrt(x.x * x.x + x.y * x.y)) + _gpu_lerch_lgamma(sig);
  // arg x, with the imaginary axis taken explicitly (see the GLSL preamble:
  // atan2 of Apple's GPU answers the wrong branch at x.x = -0.0).
  var arg = atan2(x.y, x.x);
  if (x.x == 0.0) { arg = select(1.5707963267949, -1.5707963267949, x.y < 0.0); }
  let ei = x.y - sig * arg;
  let m = exp(er);
  return vec4<f32>(m * cos(ei) - sr, m * sin(ei) - si,
    m * (24.0 + abs(er) + abs(ei)) + (f32(k) + 3.0) * sa, 1.0);
}

// h for |x| >= sig, by the continued fraction: see the GLSL preamble.
fn _gpu_lerch_h_cf(sig: f32, x: vec2<f32>) -> vec4<f32> {
  let FPMIN = 1e-30;
  var br = x.x - sig + 1.0;
  let bi = x.y;
  var cr: f32 = 1e30;
  var ci: f32 = 0.0;
  var dd = br * br + bi * bi;
  var dr = br / dd;
  var di = -bi / dd;
  var hr = dr;
  var hi = di;
  for (var i: i32 = 1; i < 200; i = i + 1) {
    let an = -f32(i) * (f32(i) - sig);
    br = br + 2.0;
    dr = an * dr + br;
    di = an * di + bi;
    if (abs(dr) + abs(di) < FPMIN) { dr = FPMIN; }
    let cc = cr * cr + ci * ci;
    cr = br + an * cr / cc;
    ci = bi - an * ci / cc;
    if (abs(cr) + abs(ci) < FPMIN) { cr = FPMIN; }
    dd = dr * dr + di * di;
    dr = dr / dd;
    di = -di / dd;
    let er = dr * cr - di * ci;
    let ei = dr * ci + di * cr;
    let nr = hr * er - hi * ei;
    hi = hr * ei + hi * er;
    hr = nr;
    if (abs(er - 1.0) + abs(ei) < 1e-7) {
      return vec4<f32>(hr, hi, 35.0 * sqrt(hr * hr + hi * hi), 1.0);
    }
  }
  return vec4<f32>(0.0);
}

// Phi(z,s,a) for s <= 0 by the Hermite-type representation: see the GLSL
// preamble.
fn _gpu_lerch_hermite(z: f32, s: f32, a: f32) -> vec2<f32> {
  let EPS = 6.0e-8;
  let PI = 3.14159265358979;
  let gx = array<f32, 4>(0.1834346424956498, 0.5255324099163290,
    0.7966664774136267, 0.9602898564975363);
  let gw = array<f32, 4>(0.3626837833783620, 0.3137066458778873,
    0.2223810344533745, 0.1012285362903763);
  if (s < -30.0) { return vec2<f32>(0.0); }
  var m: i32 = 0;
  if (a < 1.0) { m = i32(ceil(1.0 - a)); }
  var head: f32 = 0.0;
  var zk: f32 = 1.0;
  var err: f32 = 0.0;
  for (var k: i32 = 0; k < m; k = k + 1) {
    let bk = a + f32(k);
    if (bk != 0.0) {
      let t = zk * _gpu_zeta_pow(bk, -s);
      head = head + t;
      err = err + abs(t) * (2.0 + f32(k) + abs(s * log2(abs(bk))));
    }
    zk = zk * z;
  }
  let b = a + f32(m);
  let L = log(abs(z));
  let sig = 1.0 - s;
  var xi: f32 = 0.0;
  if (z < 0.0) { xi = -b * PI; }
  let x = vec2<f32>(-b * L, xi);
  var h: vec4<f32>;
  if (sig == floor(sig)) {
    h = _gpu_lerch_h_integer(sig, x);
  } else if (sqrt(x.x * x.x + x.y * x.y) < sig) {
    h = _gpu_lerch_h_series(sig, x);
  } else {
    h = _gpu_lerch_h_cf(sig, x);
  }
  if (h.w < 0.5) { return vec2<f32>(0.0); }
  let t1 = 0.5 * pow(b, -s);
  let bs = pow(b, sig);
  let t2 = bs * h.x;
  let t2abs = bs * (abs(h.x) + abs(h.y)); // no square: see the GLSL preamble
  let q3 = max(-s, 0.0);
  let t3end = (21.0 + q3 * log(1.0 + (q3 + 7.0) / b)) / PI;
  let n3 = ceil(t3end / min(1.5, 4.0 / max(abs(L), 1e-3)));
  if (n3 > 16.0) { return vec2<f32>(0.0); }
  let h3 = t3end / n3;
  var t3: f32 = 0.0;
  var a3: f32 = 0.0;
  let b2 = b * b;
  for (var p: i32 = 0; p < 16; p = p + 1) {
    if (f32(p) >= n3) { break; }
    let c = (f32(p) + 0.5) * h3;
    let r = 0.5 * h3;
    for (var i: i32 = 0; i < 4; i = i + 1) {
      for (var j: i32 = 0; j < 2; j = j + 1) {
        let t = c + select(r, -r, j == 0) * gx[i];
        let y = 2.0 * PI * t;
        let q = exp(-y);
        let omq = _gpu_lerch_em(y);
        var K = q / omq;
        if (z < 0.0) { K = exp(-PI * t) * (1.0 + q) / (2.0 * omq); }
        let f = sin(t * L - s * atan(t / b)) *
          exp(-0.5 * s * log(b2 + t * t)) * K;
        let wf = r * gw[i] * f;
        t3 = t3 + wf;
        a3 = a3 + abs(wf) * ((6.0 + 10.0 * t) +
          (abs(s) * (2.0 + 0.5 * log2(b2 + t * t)) + abs(t * L)));
      }
    }
  }
  t3 = -2.0 * t3;
  a3 = 2.0 * a3;
  let phi = t1 + t2 + t3;
  let res = head + zk * phi;
  let e1 = t1 * (2.0 + abs(s * log2(b)));
  let e2 = t2abs * (2.0 + abs(sig * log2(b))) + bs * h.z;
  let ephi = (e1 + e2) + (a3 + 3.0 * (t1 + t2abs + abs(t3)));
  let bound = EPS * (err + abs(zk) * (ephi + (f32(m) + 2.0) * abs(phi)) + abs(res));
  // See the GLSL version: an infinite res is a term that overflowed.
  if (!(bound <= 3.0e-5 * abs(res)) || !(abs(res) < 3.4e38)) { return vec2<f32>(0.0); }
  return vec2<f32>(res, 1.0);
}

// Phi(z,s,a) for s <= 0: the integral after n integrations by parts, then
// the Hermite form (see the GLSL preamble).
fn _gpu_lerch_negative(z: f32, s: f32, a: f32) -> vec2<f32> {
  if (s != floor(s) && a > 0.0 && s >= -16.0) {
    let r = _gpu_lerch_integral(z, s, a);
    if (r.y > 0.5) { return r; }
  }
  return _gpu_lerch_hermite(z, s, a);
}

// Phi(z,s,a) as vec2(value, 1), or vec2(0, 0): see the GLSL preamble.
fn _gpu_lerch_core(z: f32, s: f32, a: f32) -> vec2<f32> {
  if (z == 1.0) { return vec2<f32>(_gpu_hurwitz_zeta(s, a), 1.0); }
  if (z == 0.0) { return vec2<f32>(_gpu_zeta_pow(a, -s), 1.0); }
  if (s == 0.0) { return vec2<f32>(1.0 / (1.0 - z), 1.0); }
  if (s < 0.0 && s == floor(s) && s >= -16.0) {
    let q = _gpu_lerch_rational(z, i32(-s), a);
    if (q.y > 0.5) { return q; }
  }
  let aNonposInt = a <= 0.0 && a == floor(a);
  if (aNonposInt && s > 0.0) { return vec2<f32>(_gpu_inf(), 1.0); }
  if (a < 0.0 && s != floor(s)) { return vec2<f32>(0.0); }
  if (a < -1.0e6) { return vec2<f32>(0.0); }
  if (z > 1.0) {
    if (s > 0.0 || s != floor(s)) { return vec2<f32>(0.0); }
    return _gpu_lerch_hermite(z, s, a);
  }
  if (z < -1.0) {
    if (s > 0.0) { return _gpu_lerch_integral(z, s, a); }
    return _gpu_lerch_negative(z, s, a);
  }
  if (z < 0.0 && s > 0.0) {
    let e = _gpu_lerch_euler(z, s, a);
    if (e.y > 0.5) { return e; }
    return _gpu_lerch_integral(z, s, a);
  }
  if (z == -1.0) { return _gpu_lerch_negative(z, s, a); }
  let r = _gpu_lerch_series(z, s, a);
  if (r.y > 0.5) { return r; }
  if (s > 0.0) { return _gpu_lerch_integral(z, s, a); }
  return _gpu_lerch_negative(z, s, a);
}

// Phi(z, s, a) for z < 0 and -30 <= s <= -3 from the Fourier modes of the
// base point: see the GLSL preamble.
fn _gpu_lerch_modes(z: f32, s: f32, a: f32, c: f32) -> vec2<f32> {
  let EPS = 6.0e-8;
  let FLUSH = 2.0e-31; // 1.18e-38 / EPS
  let PI = 3.14159265358979;
  if (s < -30.0 || abs(a) >= 100.0) { return vec2<f32>(0.0); }
  var b = a;
  var pre: f32 = 0.0;
  var post: f32 = 0.0;
  if (a <= 0.0) {
    pre = floor(-a) + 1.0;
    b = a + pre;
  } else if (a > 1.0) {
    post = ceil(a) - 1.0;
    b = a - post;
  }
  var head: f32 = 0.0;
  var herr: f32 = 0.0;
  var zk: f32 = 1.0;
  for (var j: i32 = 0; j < 128; j = j + 1) {
    if (f32(j) >= pre) { break; }
    let bj = a + f32(j);
    if (bj != 0.0) {
      let t = zk * _gpu_zeta_pow(bj, -s);
      head = head + t;
      herr = herr + abs(t) * (3.0 + f32(j) + abs(s * log2(abs(bj))));
    }
    zk = zk * z;
  }
  let L = log(-z);
  let sm1 = s - 1.0;
  let hs = 0.5 * sm1;
  let ps = hs - 2.0 * floor(0.5 * hs); // (s-1)/2 modulo 2
  let L2 = L * L;
  let lr1 = log(L2 + PI * PI);
  var sum: f32 = 0.0;
  var err: f32 = 0.0;
  var tail: f32 = 0.0;
  for (var n: i32 = 1; n <= 128; n = n + 1) {
    let m = f32(2 * n - 1);
    let x = PI * m;
    let lr = log(L2 + x * x);
    let at = atan(L / x) / PI;
    let bm = b * m;
    let P = (bm - 2.0 * floor(0.5 * bm)) + ps + sm1 * at;
    let k = floor(P + 0.5);
    var cs = cos(PI * (P - k));
    if ((k % 2.0) != 0.0) { cs = -cs; }
    let ex = hs * (lr - lr1);
    let mag = exp(ex);
    let t = mag * cs;
    sum = sum + t;
    err = err + abs(t) * (4.0 + abs(ex)) +
      mag * (abs(hs) * (abs(lr) + abs(lr1)) + PI * (abs(P) + abs(sm1) * abs(at) + b * m));
    tail = mag * m / (-2.0 * s);
    if (tail <= 1e-9) { break; }
  }
  let lg = _gpu_lerch_lgamma(1.0 - s);
  let scale = 2.0 * exp(lg + hs * lr1 - (b - c) * L);
  var phib = scale * sum;
  if (!(scale < 3.4e38 && abs(phib) < 3.4e38)) { return vec2<f32>(0.0); }
  var eb = scale * (err + tail / EPS + 4.0 * abs(sum)) +
    abs(phib) * (abs(lg) + abs(hs * lr1) + abs((b - c) * L) + 12.0);
  if (scale < 1.18e-38 || abs(phib) < 1.18e-38) { eb = eb + FLUSH * (1.0 + abs(sum)); }
  if (c > 0.5) { phib = -phib; } // z = -e^L
  var res: f32;
  var rerr: f32;
  if (post > 0.0) {
    var acc = phib;
    var aerr = eb;
    var zj: f32 = 1.0;
    for (var j: i32 = 0; j < 128; j = j + 1) {
      if (f32(j) >= post) { break; }
      let bj = b + f32(j);
      let t = zj * pow(bj, -s);
      acc = acc - t;
      aerr = aerr + abs(t) * (3.0 + f32(j) + abs(s * log2(bj)));
      zj = zj * z;
    }
    let zinv = pow(-z, -post);
    if (!(zinv >= 1.18e-38 && zinv < 3.4e38 && abs(acc) >= 1.18e-38 && abs(acc) < 3.4e38)) {
      return vec2<f32>(0.0);
    }
    var sg: f32 = -1.0;
    if ((post % 2.0) == 0.0) { sg = 1.0; }
    res = sg * zinv * acc;
    rerr = zinv * (aerr + abs(acc) * (post + 2.0)) + abs(res) * abs(post * log2(-z));
  } else {
    if (!(abs(zk) >= 1.18e-38 && abs(zk) < 3.4e38)) { return vec2<f32>(0.0); }
    res = head + zk * phib;
    rerr = herr + abs(zk) * (eb + abs(phib) * (pre + 2.0));
  }
  // An estimate that overflowed to +inf declines: see the GLSL form.
  if (!(abs(res) >= 1.18e-38 && abs(res) < 3.4e38) ||
      !(rerr < 3.4e38 && rerr <= 500.0 * abs(res))) {
    return vec2<f32>(0.0);
  }
  return vec2<f32>(res, 1.0);
}

// The Fourier modes last, where every other method declines \u2014 see the GLSL
// preamble.
fn _gpu_lerch_phi(z: f32, s: f32, a: f32) -> f32 {
  let r = _gpu_lerch_core(z, s, a);
  if (r.y > 0.5) { return r.x; }
  if (z < 0.0 && s <= -3.0 && !(a < 0.0 && s != floor(s))) {
    let q = _gpu_lerch_modes(z, s, a, 0.0);
    if (q.y > 0.5) { return q.x; }
  }
  return _gpu_nan();
}

// Li_s(z) for z < -1 and a negative non-integer s, by Jonquiere's
// inversion formula: see the GLSL preamble.
fn _gpu_poly_log_inversion(s: f32, z: f32) -> vec2<f32> {
  let EPS = 6.0e-8;
  let FLUSH = 2.0e-31; // 1.18e-38 / EPS
  let PI = 3.14159265358979;
  let B = array<f32, 8>(1.0 / 6.0, -1.0 / 30.0, 1.0 / 42.0, -1.0 / 30.0,
    5.0 / 66.0, -691.0 / 2730.0, 7.0 / 6.0, -3617.0 / 510.0);
  let ai = -log(-z) / (2.0 * PI);
  let sig = 1.0 - s;
  var zr: f32 = 0.0;
  var zi: f32 = 0.0;
  var zerr: f32 = 0.0;
  for (var k: i32 = 0; k < 12; k = k + 1) {
    let wk = 0.5 + f32(k);
    let lnwk = 0.5 * log(wk * wk + ai * ai);
    let ph = -sig * atan2(ai, wk);
    let m = exp(-sig * lnwk);
    zr = zr + m * cos(ph);
    zi = zi + m * sin(ph);
    zerr = zerr + m * (4.0 + abs(sig * lnwk) + abs(ph));
  }
  let wr = 12.5;
  let lnw = 0.5 * log(wr * wr + ai * ai);
  let th = atan2(ai, wr);
  // w^(1 - sig) / (sig - 1), from s itself (see the GLSL preamble).
  let m1 = exp(s * lnw) / -s;
  let p1 = s * th;
  zr = zr + m1 * cos(p1);
  zi = zi + m1 * sin(p1);
  zerr = zerr + abs(m1) * (4.0 + abs(s * lnw) + abs(p1));
  let m0 = exp(-sig * lnw);
  let p0 = -sig * th;
  zr = zr + 0.5 * m0 * cos(p0);
  zi = zi + 0.5 * m0 * sin(p0);
  zerr = zerr + 0.5 * m0 * (4.0 + abs(sig * lnw) + abs(p0));
  let mu1 = exp((-sig - 1.0) * lnw);
  let pu1 = (-sig - 1.0) * th;
  var ur = sig / 2.0 * mu1 * cos(pu1);
  var ui = sig / 2.0 * mu1 * sin(pu1);
  let w2r = wr * wr - ai * ai;
  let w2i = 2.0 * wr * ai;
  let w2d = w2r * w2r + w2i * w2i;
  let iw2r = w2r / w2d;
  let iw2i = -w2i / w2d;
  var prev: f32 = 3.0e38;
  for (var j: i32 = 1; j <= 8; j = j + 1) {
    let tr = ur * B[j - 1];
    let ti = ui * B[j - 1];
    let ta = abs(tr) + abs(ti);
    if (ta >= prev) { break; }
    zr = zr + tr;
    zi = zi + ti;
    zerr = zerr + ta * (10.0 + abs(sig * lnw));
    prev = ta;
    let mm = f32(2 * j);
    let c = (sig + mm - 1.0) * (sig + mm) / ((mm + 1.0) * (mm + 2.0));
    let nr = c * (ur * iw2r - ui * iw2i);
    ui = c * (ur * iw2i + ui * iw2r);
    ur = nr;
  }
  zerr = zerr + 44.0 * FLUSH; // at most 22 terms in each of zr and zi
  let n = floor(s + 0.5);
  let d = s - n;
  let sgn = select(-1.0, 1.0, n % 2.0 == 0.0);
  let lg1 = _gpu_lerch_lgamma(sig);
  let fm = sgn * sin(PI * d) * exp(s * log(2.0 * PI) + lg1) / PI;
  let fre = fm * cos(0.5 * PI * s);
  let fim = fm * sin(0.5 * PI * s);
  let first = fre * zr - fim * zi;
  let firstErr = abs(fm) * zerr +
    abs(fm) * sqrt(zr * zr + zi * zi) * (30.0 + abs(lg1) + abs(s * 2.7));
  let iz = 1.0 / z;
  var li: f32 = 0.0;
  var lierr: f32 = 0.0;
  if (iz >= -0.5) {
    var wk: f32 = 1.0;
    var prevT: f32 = 3.0e38;
    var done = false;
    for (var k: i32 = 1; k < 200; k = k + 1) {
      wk = wk * iz;
      let t = wk * pow(f32(k), -s);
      li = li + t;
      let size = abs(t);
      lierr = lierr + size * (2.0 + f32(k) + abs(s * log2(f32(k)))) + FLUSH;
      let rho = -iz * pow(f32(k + 1) / f32(k), -s);
      if (size < prevT && rho < 1.0 && size * rho / (1.0 - rho) <= 1e-8 * abs(li)) {
        done = true;
        break;
      }
      prevT = size;
    }
    if (!done) { return vec2<f32>(0.0); }
  } else {
    let inner = _gpu_lerch_negative(iz, s, 1.0);
    if (inner.y < 0.5) { return vec2<f32>(0.0); }
    li = iz * inner.x;
    lierr = 500.0 * abs(li);
  }
  let res = first - sgn * cos(PI * d) * li;
  let bound = ((firstErr + 4.0 * abs(first)) + (lierr + 2.0 * abs(li))) + 4.0 * FLUSH;
  if (!(abs(res) >= 1.18e-38 && abs(res) < 3.4e38) ||
      !(bound < 3.4e38 && bound <= 500.0 * abs(res))) {
    return vec2<f32>(0.0);
  }
  return vec2<f32>(res, 1.0);
}

// PolyLog(s, z): see _gpu_poly_log in GPU_LERCH_PREAMBLE_GLSL for the
// cases (closed forms for the orders 1, 0, -1 and -2 ... -12, then
// z * Phi(z, s, 1), then the inversion formula).
fn _gpu_poly_log(s: f32, z: f32) -> f32 {
  if (z == 0.0) { return 0.0; }
  if (s == 1.0) {
    if (z == 1.0) { return _gpu_inf(); }
    if (z < 1.0) { return -log(1.0 - z); }
    return _gpu_nan();
  }
  if (s == 0.0) {
    if (z == 1.0) { return _gpu_inf(); }
    return z / (1.0 - z);
  }
  if (s == -1.0) {
    if (z == 1.0) { return _gpu_inf(); }
    return z / ((1.0 - z) * (1.0 - z));
  }
  if (s <= -2.0 && s >= -12.0 && s == floor(s) && z != 1.0) {
    let n = i32(-s);
    var row: array<f32, 13>;
    row[0] = 1.0;
    for (var i: i32 = 1; i < 13; i = i + 1) { row[i] = 0.0; }
    for (var m: i32 = 1; m <= n; m = m + 1) {
      for (var k: i32 = m - 1; k >= 1; k = k - 1) {
        row[k] = f32(k + 1) * row[k] + f32(m - k) * row[k - 1];
      }
    }
    if (abs(z) > 1.0) {
      let v = 1.0 / (1.0 - z);
      let u = z * v;
      var r = row[n - 1];
      var vp = v;
      for (var k: i32 = n - 2; k >= 0; k = k - 1) {
        r = r * u + row[k] * vp;
        vp = vp * v;
      }
      return u * v * r;
    }
    var p: f32 = 0.0;
    for (var k: i32 = n - 1; k >= 0; k = k - 1) { p = p * z + row[k]; }
    var den: f32 = 1.0;
    for (var i: i32 = 0; i <= n; i = i + 1) { den = den * (1.0 - z); }
    return z * p / den;
  }
  // Below z = -1 a small Phi(z, s, 1) is left to the inversion and the
  // modes: see the GLSL preamble.
  let r = _gpu_lerch_core(z, s, 1.0);
  if (r.y > 0.5 && (z >= -1.0 || (abs(r.x) >= 3.9e-34 && abs(z * r.x) < 3.4e38))) {
    return z * r.x;
  }
  if (z < -1.0 && s < 0.0 && s != floor(s)) {
    let v = _gpu_poly_log_inversion(s, z);
    if (v.y > 0.5) { return v.x; }
  }
  if (z < 0.0 && s <= -3.0) {
    let q = _gpu_lerch_modes(z, s, 1.0, 1.0);
    if (q.y > 0.5) { return q.x; }
  }
  return _gpu_nan();
}
`,Cs=`
float _gpu_erf(float x) {
  float ax = abs(x);
  float t = 1.0 / (1.0 + 0.3275911 * ax);
  float y = ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t;
  float result = 1.0 - y * exp(-ax * ax);
  return x < 0.0 ? -result : result;
}

float _gpu_erfinv(float x) {
  float pi = 3.14159265358979;
  float x2 = x * x;
  float x3 = x * x2;
  float x5 = x3 * x2;
  float x7 = x5 * x2;
  float x9 = x7 * x2;
  return sqrt(pi) * 0.5 * (x + (pi / 12.0) * x3 + (7.0 * pi * pi / 480.0) * x5 + (127.0 * pi * pi * pi / 40320.0) * x7 + (4369.0 * pi * pi * pi * pi / 5806080.0) * x9);
}
`,Ss=`
fn _gpu_erf(x: f32) -> f32 {
  let ax = abs(x);
  let t = 1.0 / (1.0 + 0.3275911 * ax);
  let y = ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t;
  let result = 1.0 - y * exp(-ax * ax);
  if (x < 0.0) { return -result; }
  return result;
}

fn _gpu_erfinv(x: f32) -> f32 {
  let pi = 3.14159265358979;
  let x2 = x * x;
  let x3 = x * x2;
  let x5 = x3 * x2;
  let x7 = x5 * x2;
  let x9 = x7 * x2;
  return sqrt(pi) * 0.5 * (x + (pi / 12.0) * x3 + (7.0 * pi * pi / 480.0) * x5 + (127.0 * pi * pi * pi / 40320.0) * x7 + (4369.0 * pi * pi * pi * pi / 5806080.0) * x9);
}
`,zs=`
float _gpu_heaviside(float x) {
  if ((floatBitsToUint(x) & 0x7FFFFFFFu) > 0x7F800000u) return x;
  if (x < 0.0) return 0.0;
  if (x > 0.0) return 1.0;
  return 0.5;
}
`,Ps=`
fn _gpu_heaviside(x: f32) -> f32 {
  if ((bitcast<u32>(x) & 0x7FFFFFFFu) > 0x7F800000u) { return x; }
  if (x < 0.0) { return 0.0; }
  if (x > 0.0) { return 1.0; }
  return 0.5;
}
`,ks=`
float _gpu_sinc(float x) {
  if (abs(x) < 1e-10) return 1.0;
  return sin(x) / x;
}
`,Ls=`
fn _gpu_sinc(x: f32) -> f32 {
  if (abs(x) < 1e-10) { return 1.0; }
  return sin(x) / x;
}
`,As=`
float _gpu_polevl(float x, float c[12], int n) {
  float ans = c[0];
  for (int i = 1; i < n; i++) ans = ans * x + c[i];
  return ans;
}
`,Rs=`
fn _gpu_polevl(x: f32, c: array<f32, 12>, n: i32) -> f32 {
  var ans = c[0];
  for (var i: i32 = 1; i < n; i++) { ans = ans * x + c[i]; }
  return ans;
}
`,Ts=`
float _gpu_fresnelC(float x_in) {
  float sgn = x_in < 0.0 ? -1.0 : 1.0;
  float x = abs(x_in);

  if (x < 1.6) {
    float x2 = x * x;
    float t = x2 * x2;
    float cn[6] = float[6](
      -4.98843114573573548651e-8, 9.50428062829859605134e-6,
      -6.45191435683965050962e-4, 1.88843319396703850064e-2,
      -2.05525900955013891793e-1, 9.99999999999999998822e-1
    );
    float cd[7] = float[7](
      3.99982968972495980367e-12, 9.15439215774657478799e-10,
      1.25001862479598821474e-7, 1.22262789024179030997e-5,
      8.68029542941784300606e-4, 4.12142090722199792936e-2, 1.0
    );
    return sgn * x * _gpu_polevl(t, cn, 6) / _gpu_polevl(t, cd, 7);
  }

  if (x < 36.0) {
    float x2 = x * x;
    float t = 3.14159265358979 * x2;
    float u = 1.0 / (t * t);
    float fn[10] = float[10](
      4.21543555043677546506e-1, 1.43407919780758885261e-1,
      1.15220955073585758835e-2, 3.450179397825740279e-4,
      4.63613749287867322088e-6, 3.05568983790257605827e-8,
      1.02304514164907233465e-10, 1.72010743268161828879e-13,
      1.34283276233062758925e-16, 3.76329711269987889006e-20
    );
    float fd[11] = float[11](
      1.0, 7.51586398353378947175e-1,
      1.16888925859191382142e-1, 6.44051526508858611005e-3,
      1.55934409164153020873e-4, 1.8462756734893054587e-6,
      1.12699224763999035261e-8, 3.60140029589371370404e-11,
      5.8875453362157841001e-14, 4.52001434074129701496e-17,
      1.25443237090011264384e-20
    );
    float gn[11] = float[11](
      5.04442073643383265887e-1, 1.97102833525523411709e-1,
      1.87648584092575249293e-2, 6.84079380915393090172e-4,
      1.15138826111884280931e-5, 9.82852443688422223854e-8,
      4.45344415861750144738e-10, 1.08268041139020870318e-12,
      1.37555460633261799868e-15, 8.36354435630677421531e-19,
      1.86958710162783235106e-22
    );
    float gd[12] = float[12](
      1.0, 1.47495759925128324529,
      3.37748989120019970451e-1, 2.53603741420338795122e-2,
      8.14679107184306179049e-4, 1.27545075667729118702e-5,
      1.04314589657571990585e-7, 4.60680728146520428211e-10,
      1.10273215066240270757e-12, 1.38796531259578871258e-15,
      8.39158816283118707363e-19, 1.86958710162783236342e-22
    );
    float f = 1.0 - u * _gpu_polevl(u, fn, 10) / _gpu_polevl(u, fd, 11);
    float g = (1.0 / t) * _gpu_polevl(u, gn, 11) / _gpu_polevl(u, gd, 12);
    float z = 1.5707963267948966 * x2;
    float c = cos(z);
    float s = sin(z);
    return sgn * (0.5 + (f * s - g * c) / (3.14159265358979 * x));
  }

  return sgn * 0.5;
}
`,Gs=`
fn _gpu_fresnelC(x_in: f32) -> f32 {
  let sgn: f32 = select(1.0, -1.0, x_in < 0.0);
  let x = abs(x_in);

  if (x < 1.6) {
    let x2 = x * x;
    let t = x2 * x2;
    var cn = array<f32, 12>(
      -4.98843114573573548651e-8, 9.50428062829859605134e-6,
      -6.45191435683965050962e-4, 1.88843319396703850064e-2,
      -2.05525900955013891793e-1, 9.99999999999999998822e-1,
      0.0, 0.0, 0.0, 0.0, 0.0, 0.0
    );
    var cd = array<f32, 12>(
      3.99982968972495980367e-12, 9.15439215774657478799e-10,
      1.25001862479598821474e-7, 1.22262789024179030997e-5,
      8.68029542941784300606e-4, 4.12142090722199792936e-2, 1.0,
      0.0, 0.0, 0.0, 0.0, 0.0
    );
    return sgn * x * _gpu_polevl(t, cn, 6) / _gpu_polevl(t, cd, 7);
  }

  if (x < 36.0) {
    let x2 = x * x;
    let t = 3.14159265358979 * x2;
    let u = 1.0 / (t * t);
    var fn = array<f32, 12>(
      4.21543555043677546506e-1, 1.43407919780758885261e-1,
      1.15220955073585758835e-2, 3.450179397825740279e-4,
      4.63613749287867322088e-6, 3.05568983790257605827e-8,
      1.02304514164907233465e-10, 1.72010743268161828879e-13,
      1.34283276233062758925e-16, 3.76329711269987889006e-20,
      0.0, 0.0
    );
    var fd = array<f32, 12>(
      1.0, 7.51586398353378947175e-1,
      1.16888925859191382142e-1, 6.44051526508858611005e-3,
      1.55934409164153020873e-4, 1.8462756734893054587e-6,
      1.12699224763999035261e-8, 3.60140029589371370404e-11,
      5.8875453362157841001e-14, 4.52001434074129701496e-17,
      1.25443237090011264384e-20, 0.0
    );
    var gn = array<f32, 12>(
      5.04442073643383265887e-1, 1.97102833525523411709e-1,
      1.87648584092575249293e-2, 6.84079380915393090172e-4,
      1.15138826111884280931e-5, 9.82852443688422223854e-8,
      4.45344415861750144738e-10, 1.08268041139020870318e-12,
      1.37555460633261799868e-15, 8.36354435630677421531e-19,
      1.86958710162783235106e-22, 0.0
    );
    var gd = array<f32, 12>(
      1.0, 1.47495759925128324529,
      3.37748989120019970451e-1, 2.53603741420338795122e-2,
      8.14679107184306179049e-4, 1.27545075667729118702e-5,
      1.04314589657571990585e-7, 4.60680728146520428211e-10,
      1.10273215066240270757e-12, 1.38796531259578871258e-15,
      8.39158816283118707363e-19, 1.86958710162783236342e-22
    );
    let f = 1.0 - u * _gpu_polevl(u, fn, 10) / _gpu_polevl(u, fd, 11);
    let g = (1.0 / t) * _gpu_polevl(u, gn, 11) / _gpu_polevl(u, gd, 12);
    let z = 1.5707963267948966 * x2;
    let c = cos(z);
    let s = sin(z);
    return sgn * (0.5 + (f * s - g * c) / (3.14159265358979 * x));
  }

  return sgn * 0.5;
}
`,Ns=`
float _gpu_fresnelS(float x_in) {
  float sgn = x_in < 0.0 ? -1.0 : 1.0;
  float x = abs(x_in);

  if (x < 1.6) {
    float x2 = x * x;
    float t = x2 * x2;
    float sn[6] = float[6](
      -2.99181919401019853726e3, 7.08840045257738576863e5,
      -6.29741486205862506537e7, 2.54890880573376359104e9,
      -4.42979518059697779103e10, 3.18016297876567817986e11
    );
    float sd[7] = float[7](
      1.0, 2.81376268889994315696e2, 4.55847810806532581675e4,
      5.1734388877009640073e6, 4.19320245898111231129e8, 2.2441179564534092094e10,
      6.07366389490084914091e11
    );
    return sgn * x * x2 * _gpu_polevl(t, sn, 6) / _gpu_polevl(t, sd, 7);
  }

  if (x < 36.0) {
    float x2 = x * x;
    float t = 3.14159265358979 * x2;
    float u = 1.0 / (t * t);
    float fn[10] = float[10](
      4.21543555043677546506e-1, 1.43407919780758885261e-1,
      1.15220955073585758835e-2, 3.450179397825740279e-4,
      4.63613749287867322088e-6, 3.05568983790257605827e-8,
      1.02304514164907233465e-10, 1.72010743268161828879e-13,
      1.34283276233062758925e-16, 3.76329711269987889006e-20
    );
    float fd[11] = float[11](
      1.0, 7.51586398353378947175e-1,
      1.16888925859191382142e-1, 6.44051526508858611005e-3,
      1.55934409164153020873e-4, 1.8462756734893054587e-6,
      1.12699224763999035261e-8, 3.60140029589371370404e-11,
      5.8875453362157841001e-14, 4.52001434074129701496e-17,
      1.25443237090011264384e-20
    );
    float gn[11] = float[11](
      5.04442073643383265887e-1, 1.97102833525523411709e-1,
      1.87648584092575249293e-2, 6.84079380915393090172e-4,
      1.15138826111884280931e-5, 9.82852443688422223854e-8,
      4.45344415861750144738e-10, 1.08268041139020870318e-12,
      1.37555460633261799868e-15, 8.36354435630677421531e-19,
      1.86958710162783235106e-22
    );
    float gd[12] = float[12](
      1.0, 1.47495759925128324529,
      3.37748989120019970451e-1, 2.53603741420338795122e-2,
      8.14679107184306179049e-4, 1.27545075667729118702e-5,
      1.04314589657571990585e-7, 4.60680728146520428211e-10,
      1.10273215066240270757e-12, 1.38796531259578871258e-15,
      8.39158816283118707363e-19, 1.86958710162783236342e-22
    );
    float f = 1.0 - u * _gpu_polevl(u, fn, 10) / _gpu_polevl(u, fd, 11);
    float g = (1.0 / t) * _gpu_polevl(u, gn, 11) / _gpu_polevl(u, gd, 12);
    float z = 1.5707963267948966 * x2;
    float c = cos(z);
    float s = sin(z);
    return sgn * (0.5 - (f * c + g * s) / (3.14159265358979 * x));
  }

  return sgn * 0.5;
}
`,Fs=`
fn _gpu_fresnelS(x_in: f32) -> f32 {
  let sgn: f32 = select(1.0, -1.0, x_in < 0.0);
  let x = abs(x_in);

  if (x < 1.6) {
    let x2 = x * x;
    let t = x2 * x2;
    var sn = array<f32, 12>(
      -2.99181919401019853726e3, 7.08840045257738576863e5,
      -6.29741486205862506537e7, 2.54890880573376359104e9,
      -4.42979518059697779103e10, 3.18016297876567817986e11,
      0.0, 0.0, 0.0, 0.0, 0.0, 0.0
    );
    var sd = array<f32, 12>(
      1.0, 2.81376268889994315696e2, 4.55847810806532581675e4,
      5.1734388877009640073e6, 4.19320245898111231129e8, 2.2441179564534092094e10,
      6.07366389490084914091e11,
      0.0, 0.0, 0.0, 0.0, 0.0
    );
    return sgn * x * x2 * _gpu_polevl(t, sn, 6) / _gpu_polevl(t, sd, 7);
  }

  if (x < 36.0) {
    let x2 = x * x;
    let t = 3.14159265358979 * x2;
    let u = 1.0 / (t * t);
    var fn = array<f32, 12>(
      4.21543555043677546506e-1, 1.43407919780758885261e-1,
      1.15220955073585758835e-2, 3.450179397825740279e-4,
      4.63613749287867322088e-6, 3.05568983790257605827e-8,
      1.02304514164907233465e-10, 1.72010743268161828879e-13,
      1.34283276233062758925e-16, 3.76329711269987889006e-20,
      0.0, 0.0
    );
    var fd = array<f32, 12>(
      1.0, 7.51586398353378947175e-1,
      1.16888925859191382142e-1, 6.44051526508858611005e-3,
      1.55934409164153020873e-4, 1.8462756734893054587e-6,
      1.12699224763999035261e-8, 3.60140029589371370404e-11,
      5.8875453362157841001e-14, 4.52001434074129701496e-17,
      1.25443237090011264384e-20, 0.0
    );
    var gn = array<f32, 12>(
      5.04442073643383265887e-1, 1.97102833525523411709e-1,
      1.87648584092575249293e-2, 6.84079380915393090172e-4,
      1.15138826111884280931e-5, 9.82852443688422223854e-8,
      4.45344415861750144738e-10, 1.08268041139020870318e-12,
      1.37555460633261799868e-15, 8.36354435630677421531e-19,
      1.86958710162783235106e-22, 0.0
    );
    var gd = array<f32, 12>(
      1.0, 1.47495759925128324529,
      3.37748989120019970451e-1, 2.53603741420338795122e-2,
      8.14679107184306179049e-4, 1.27545075667729118702e-5,
      1.04314589657571990585e-7, 4.60680728146520428211e-10,
      1.10273215066240270757e-12, 1.38796531259578871258e-15,
      8.39158816283118707363e-19, 1.86958710162783236342e-22
    );
    let f = 1.0 - u * _gpu_polevl(u, fn, 10) / _gpu_polevl(u, fd, 11);
    let g = (1.0 / t) * _gpu_polevl(u, gn, 11) / _gpu_polevl(u, gd, 12);
    let z = 1.5707963267948966 * x2;
    let c = cos(z);
    let s = sin(z);
    return sgn * (0.5 - (f * c + g * s) / (3.14159265358979 * x));
  }

  return sgn * 0.5;
}
`,Is=`
float _gpu_factorial(int n) {
  float f = 1.0;
  for (int i = 2; i <= n; i++) f *= float(i);
  return f;
}

float _gpu_besselJ_series(int n, float x) {
  float halfX = x / 2.0;
  float negQ = -(x * x) / 4.0;
  float term = 1.0;
  for (int i = 1; i <= n; i++) term /= float(i);
  float s = term;
  for (int k = 1; k <= 60; k++) {
    term *= negQ / (float(k) * float(n + k));
    s += term;
    if (abs(term) < abs(s) * 1e-7) break;
  }
  return s * pow(halfX, float(n));
}

float _gpu_besselJ_asymptotic(int n, float x) {
  float mu = 4.0 * float(n) * float(n);
  float P = 1.0;
  float Q = 0.0;
  float ak = 1.0;
  float e8x = 8.0 * x;
  for (int k = 1; k <= 12; k++) {
    float twokm1 = float(2 * k - 1);
    ak *= mu - twokm1 * twokm1;
    float denom = _gpu_factorial(k) * pow(e8x, float(k));
    float contrib = ak / denom;
    if (k == 1 || k == 3 || k == 5 || k == 7 || k == 9 || k == 11) {
      if (((k - 1) / 2) % 2 == 0) Q += contrib;
      else Q -= contrib;
    } else {
      if ((k / 2) % 2 == 1) P -= contrib;
      else P += contrib;
    }
    if (abs(contrib) < 1e-7) break;
  }
  float chi = x - (float(n) / 2.0 + 0.25) * 3.14159265358979;
  return sqrt(2.0 / (3.14159265358979 * x)) * (P * cos(chi) - Q * sin(chi));
}

float _gpu_besselJ(int n, float x) {
  if (x == 0.0) return n == 0 ? 1.0 : 0.0;
  float sgn = 1.0;
  if (n < 0) {
    n = -n;
    if (n % 2 != 0) sgn = -1.0;
  }
  if (x < 0.0) {
    x = -x;
    if (n % 2 != 0) sgn *= -1.0;
  }
  if (x > 25.0 + float(n * n) / 2.0) return sgn * _gpu_besselJ_asymptotic(n, x);
  if (x < 5.0 + float(n)) return sgn * _gpu_besselJ_series(n, x);
  int M = max(n + 20, int(ceil(x)) + 30);
  if (M > 200) return sgn * _gpu_besselJ_series(n, x);
  float vals[201];
  float jp1 = 0.0;
  float jk = 1.0;
  vals[M] = jk;
  for (int k = M; k >= 1; k--) {
    float jm1 = (2.0 * float(k) / x) * jk - jp1;
    jp1 = jk;
    jk = jm1;
    vals[k - 1] = jk;
  }
  float norm = vals[0];
  for (int k = 2; k <= M; k += 2) norm += 2.0 * vals[k];
  return sgn * vals[n] / norm;
}
`,Ms=`
fn _gpu_factorial(n: i32) -> f32 {
  var f: f32 = 1.0;
  for (var i: i32 = 2; i <= n; i++) { f *= f32(i); }
  return f;
}

fn _gpu_besselJ_series(n_in: i32, x: f32) -> f32 {
  let halfX = x / 2.0;
  let negQ = -(x * x) / 4.0;
  var term: f32 = 1.0;
  for (var i: i32 = 1; i <= n_in; i++) { term /= f32(i); }
  var s = term;
  for (var k: i32 = 1; k <= 60; k++) {
    term *= negQ / (f32(k) * f32(n_in + k));
    s += term;
    if (abs(term) < abs(s) * 1e-7) { break; }
  }
  return s * pow(halfX, f32(n_in));
}

fn _gpu_besselJ_asymptotic(n_in: i32, x: f32) -> f32 {
  let mu = 4.0 * f32(n_in) * f32(n_in);
  var P: f32 = 1.0;
  var Q: f32 = 0.0;
  var ak: f32 = 1.0;
  let e8x = 8.0 * x;
  for (var k: i32 = 1; k <= 12; k++) {
    let twokm1 = f32(2 * k - 1);
    ak *= mu - twokm1 * twokm1;
    let denom = _gpu_factorial(k) * pow(e8x, f32(k));
    let contrib = ak / denom;
    if (k == 1 || k == 3 || k == 5 || k == 7 || k == 9 || k == 11) {
      if (((k - 1) / 2) % 2 == 0) { Q += contrib; }
      else { Q -= contrib; }
    } else {
      if ((k / 2) % 2 == 1) { P -= contrib; }
      else { P += contrib; }
    }
    if (abs(contrib) < 1e-7) { break; }
  }
  let chi = x - (f32(n_in) / 2.0 + 0.25) * 3.14159265358979;
  return sqrt(2.0 / (3.14159265358979 * x)) * (P * cos(chi) - Q * sin(chi));
}

fn _gpu_besselJ(n_in: i32, x_in: f32) -> f32 {
  var n = n_in;
  var x = x_in;
  if (x == 0.0) { return select(0.0, 1.0, n == 0); }
  var sgn: f32 = 1.0;
  if (n < 0) {
    n = -n;
    if (n % 2 != 0) { sgn = -1.0; }
  }
  if (x < 0.0) {
    x = -x;
    if (n % 2 != 0) { sgn *= -1.0; }
  }
  if (x > 25.0 + f32(n * n) / 2.0) { return sgn * _gpu_besselJ_asymptotic(n, x); }
  if (x < 5.0 + f32(n)) { return sgn * _gpu_besselJ_series(n, x); }
  var M = max(n + 20, i32(ceil(x)) + 30);
  if (M > 200) { return sgn * _gpu_besselJ_series(n, x); }
  var vals: array<f32, 201>;
  var jp1: f32 = 0.0;
  var jk: f32 = 1.0;
  vals[M] = jk;
  for (var k: i32 = M; k >= 1; k--) {
    let jm1 = (2.0 * f32(k) / x) * jk - jp1;
    jp1 = jk;
    jk = jm1;
    vals[k - 1] = jk;
  }
  var norm = vals[0];
  for (var k2: i32 = 2; k2 <= M; k2 += 2) { norm += 2.0 * vals[k2]; }
  return sgn * vals[n] / norm;
}
`,Os=`
float _fractal_mandelbrot(vec2 c, int maxIter) {
  vec2 z = vec2(0.0, 0.0);
  for (int i = 0; i < maxIter; i++) {
    z = vec2(z.x*z.x - z.y*z.y + c.x, 2.0*z.x*z.y + c.y);
    if (dot(z, z) > 4.0)
      return clamp((float(i) - log2(log2(dot(z, z))) + 4.0) / float(maxIter), 0.0, 1.0);
  }
  return 1.0;
}

float _fractal_julia(vec2 z, vec2 c, int maxIter) {
  for (int i = 0; i < maxIter; i++) {
    z = vec2(z.x*z.x - z.y*z.y + c.x, 2.0*z.x*z.y + c.y);
    if (dot(z, z) > 4.0)
      return clamp((float(i) - log2(log2(dot(z, z))) + 4.0) / float(maxIter), 0.0, 1.0);
  }
  return 1.0;
}
`,Us=`
fn _fractal_mandelbrot(c: vec2f, maxIter: i32) -> f32 {
  var z = vec2f(0.0, 0.0);
  for (var i: i32 = 0; i < maxIter; i++) {
    z = vec2f(z.x*z.x - z.y*z.y + c.x, 2.0*z.x*z.y + c.y);
    if (dot(z, z) > 4.0) {
      return clamp((f32(i) - log2(log2(dot(z, z))) + 4.0) / f32(maxIter), 0.0, 1.0);
    }
  }
  return 1.0;
}

fn _fractal_julia(z_in: vec2f, c: vec2f, maxIter: i32) -> f32 {
  var z = z_in;
  for (var i: i32 = 0; i < maxIter; i++) {
    z = vec2f(z.x*z.x - z.y*z.y + c.x, 2.0*z.x*z.y + c.y);
    if (dot(z, z) > 4.0) {
      return clamp((f32(i) - log2(log2(dot(z, z))) + 4.0) / f32(maxIter), 0.0, 1.0);
    }
  }
  return 1.0;
}
`,Bs=`
float _gpu_gcd(float a, float b) {
  a = abs(a); b = abs(b);
  if (a == 0.0) return b;
  if (b == 0.0) return a;
  if (floor(a) == a && floor(b) == b && a < 16777216.0 && b < 16777216.0) {
    for (int i = 0; i < 64; i++) {
      if (b == 0.0) break;
      float t = mod(a, b);
      a = b;
      b = t;
    }
    return a;
  }
  float mn = min(a, b);
  float tol = 1e-6 * max(a, b);
  for (int i = 0; i < 64; i++) {
    if (b <= tol) break;
    float t = mod(a, b);
    a = b;
    b = t;
  }
  return a > mn ? mn : a;
}

float _gpu_lcm(float a, float b) {
  if (a == 0.0 || b == 0.0) return 0.0;
  return abs(a) / _gpu_gcd(a, b) * abs(b);
}
`,js=`
fn _gpu_gcd(a_in: f32, b_in: f32) -> f32 {
  var a = abs(a_in); var b = abs(b_in);
  if (a == 0.0) { return b; }
  if (b == 0.0) { return a; }
  if (floor(a) == a && floor(b) == b && a < 16777216.0 && b < 16777216.0) {
    for (var i: i32 = 0; i < 64; i++) {
      if (b == 0.0) { break; }
      let t = a % b;
      a = b;
      b = t;
    }
    return a;
  }
  let mn = min(a, b);
  let tol = 1e-6 * max(a, b);
  for (var i: i32 = 0; i < 64; i++) {
    if (b <= tol) { break; }
    let t = a % b;
    a = b;
    b = t;
  }
  if (a > mn) { return mn; }
  return a;
}

fn _gpu_lcm(a: f32, b: f32) -> f32 {
  if (a == 0.0 || b == 0.0) { return 0.0; }
  return abs(a) / _gpu_gcd(a, b) * abs(b);
}
`,Ds=`
uvec3 _gpu_pcg3d(uvec3 v) {
  v = v * 1664525u + 1013904223u;
  v.x += v.y*v.z; v.y += v.z*v.x; v.z += v.x*v.y;
  v ^= v >> 16u;
  v.x += v.y*v.z; v.y += v.z*v.x; v.z += v.x*v.y;
  return v;
}
float _gpu_rnd_draw(uvec2 seed, inout uint n) {
  uvec3 w = _gpu_pcg3d(uvec3(seed.x, seed.y, n));
  n = n + 1u;
  return float(w.x >> 8u) * (1.0 / 16777216.0);
}
`,Vs=`
fn _gpu_pcg3d(v_in: vec3<u32>) -> vec3<u32> {
  var v = v_in * 1664525u + 1013904223u;
  v.x += v.y*v.z; v.y += v.z*v.x; v.z += v.x*v.y;
  v = v ^ (v >> vec3<u32>(16u));
  v.x += v.y*v.z; v.y += v.z*v.x; v.z += v.x*v.y;
  return v;
}
fn _gpu_rnd_draw(seed: vec2<u32>, n: ptr<private, u32>) -> f32 {
  let w = _gpu_pcg3d(vec3<u32>(seed.x, seed.y, *n));
  *n = *n + 1u;
  return f32(w.x >> 8u) * (1.0 / 16777216.0);
}
`,qs=`
float _gpu_median_2(float a, float b) {
  return (a + b) * 0.5;
}
float _gpu_median_3(float a, float b, float c) {
  return max(min(a, b), min(max(a, b), c));
}
float _gpu_median_4(float a, float b, float c, float d) {
  float lo = max(min(a, b), min(c, d));
  float hi = min(max(a, b), max(c, d));
  return (lo + hi) * 0.5;
}
float _gpu_median_5(float a, float b, float c, float d, float e) {
  float t; float v0=a,v1=b,v2=c,v3=d,v4=e;
  t=min(v0,v1); v1=max(v0,v1); v0=t;
  t=min(v3,v4); v4=max(v3,v4); v3=t;
  t=min(v2,v4); v4=max(v2,v4); v2=t;
  t=min(v2,v3); v3=max(v2,v3); v2=t;
  t=min(v0,v3); v3=max(v0,v3); v0=t;
  t=min(v0,v2); v2=max(v0,v2); v0=t;
  t=min(v1,v4); v4=max(v1,v4); v1=t;
  t=min(v1,v3); v3=max(v1,v3); v1=t;
  t=min(v1,v2); v2=max(v1,v2); v1=t;
  return v2;
}
float _gpu_median_6(float a, float b, float c, float d, float e, float f) {
  float t; float v0=a,v1=b,v2=c,v3=d,v4=e,v5=f;
  t=min(v0,v1); v1=max(v0,v1); v0=t;
  t=min(v2,v3); v3=max(v2,v3); v2=t;
  t=min(v4,v5); v5=max(v4,v5); v4=t;
  t=min(v0,v2); v2=max(v0,v2); v0=t;
  t=min(v1,v3); v3=max(v1,v3); v1=t;
  t=min(v0,v4); v4=max(v0,v4); v0=t;
  t=min(v1,v5); v5=max(v1,v5); v1=t;
  t=min(v2,v4); v4=max(v2,v4); v2=t;
  t=min(v1,v2); v2=max(v1,v2); v1=t;
  t=min(v3,v5); v5=max(v3,v5); v3=t;
  t=min(v3,v4); v4=max(v3,v4); v3=t;
  return (v2 + v3) * 0.5;
}
float _gpu_median_7(float a, float b, float c, float d, float e, float f, float g) {
  float t; float v0=a,v1=b,v2=c,v3=d,v4=e,v5=f,v6=g;
  t=min(v0,v1); v1=max(v0,v1); v0=t;
  t=min(v2,v3); v3=max(v2,v3); v2=t;
  t=min(v4,v5); v5=max(v4,v5); v4=t;
  t=min(v0,v2); v2=max(v0,v2); v0=t;
  t=min(v1,v3); v3=max(v1,v3); v1=t;
  t=min(v4,v6); v6=max(v4,v6); v4=t;
  t=min(v0,v4); v4=max(v0,v4); v0=t;
  t=min(v1,v5); v5=max(v1,v5); v1=t;
  t=min(v2,v6); v6=max(v2,v6); v2=t;
  t=min(v1,v2); v2=max(v1,v2); v1=t;
  t=min(v3,v5); v5=max(v3,v5); v3=t;
  t=min(v2,v4); v4=max(v2,v4); v2=t;
  t=min(v3,v4); v4=max(v3,v4); v3=t;
  return v3;
}
float _gpu_median_8(float a, float b, float c, float d, float e, float f, float g, float h) {
  float t; float v0=a,v1=b,v2=c,v3=d,v4=e,v5=f,v6=g,v7=h;
  t=min(v0,v1); v1=max(v0,v1); v0=t;
  t=min(v2,v3); v3=max(v2,v3); v2=t;
  t=min(v4,v5); v5=max(v4,v5); v4=t;
  t=min(v6,v7); v7=max(v6,v7); v6=t;
  t=min(v0,v2); v2=max(v0,v2); v0=t;
  t=min(v1,v3); v3=max(v1,v3); v1=t;
  t=min(v4,v6); v6=max(v4,v6); v4=t;
  t=min(v5,v7); v7=max(v5,v7); v5=t;
  t=min(v0,v4); v4=max(v0,v4); v0=t;
  t=min(v1,v5); v5=max(v1,v5); v1=t;
  t=min(v2,v6); v6=max(v2,v6); v2=t;
  t=min(v3,v7); v7=max(v3,v7); v3=t;
  t=min(v1,v2); v2=max(v1,v2); v1=t;
  t=min(v3,v4); v4=max(v3,v4); v3=t;
  t=min(v5,v6); v6=max(v5,v6); v5=t;
  t=min(v3,v5); v5=max(v3,v5); v3=t;
  t=min(v2,v4); v4=max(v2,v4); v2=t;
  t=min(v3,v4); v4=max(v3,v4); v3=t;
  return (v3 + v4) * 0.5;
}
`,Hs=`
fn _gpu_median_2(a: f32, b: f32) -> f32 {
  return (a + b) * 0.5;
}
fn _gpu_median_3(a: f32, b: f32, c: f32) -> f32 {
  return max(min(a, b), min(max(a, b), c));
}
fn _gpu_median_4(a: f32, b: f32, c: f32, d: f32) -> f32 {
  let lo = max(min(a, b), min(c, d));
  let hi = min(max(a, b), max(c, d));
  return (lo + hi) * 0.5;
}
fn _gpu_median_5(a: f32, b: f32, c: f32, d: f32, e: f32) -> f32 {
  var v0=a; var v1=b; var v2=c; var v3=d; var v4=e; var t: f32;
  t=min(v0,v1); v1=max(v0,v1); v0=t;
  t=min(v3,v4); v4=max(v3,v4); v3=t;
  t=min(v2,v4); v4=max(v2,v4); v2=t;
  t=min(v2,v3); v3=max(v2,v3); v2=t;
  t=min(v0,v3); v3=max(v0,v3); v0=t;
  t=min(v0,v2); v2=max(v0,v2); v0=t;
  t=min(v1,v4); v4=max(v1,v4); v1=t;
  t=min(v1,v3); v3=max(v1,v3); v1=t;
  t=min(v1,v2); v2=max(v1,v2); v1=t;
  return v2;
}
fn _gpu_median_6(a: f32, b: f32, c: f32, d: f32, e: f32, f: f32) -> f32 {
  var v0=a; var v1=b; var v2=c; var v3=d; var v4=e; var v5=f; var t: f32;
  t=min(v0,v1); v1=max(v0,v1); v0=t;
  t=min(v2,v3); v3=max(v2,v3); v2=t;
  t=min(v4,v5); v5=max(v4,v5); v4=t;
  t=min(v0,v2); v2=max(v0,v2); v0=t;
  t=min(v1,v3); v3=max(v1,v3); v1=t;
  t=min(v0,v4); v4=max(v0,v4); v0=t;
  t=min(v1,v5); v5=max(v1,v5); v1=t;
  t=min(v2,v4); v4=max(v2,v4); v2=t;
  t=min(v1,v2); v2=max(v1,v2); v1=t;
  t=min(v3,v5); v5=max(v3,v5); v3=t;
  t=min(v3,v4); v4=max(v3,v4); v3=t;
  return (v2 + v3) * 0.5;
}
fn _gpu_median_7(a: f32, b: f32, c: f32, d: f32, e: f32, f: f32, g: f32) -> f32 {
  var v0=a; var v1=b; var v2=c; var v3=d; var v4=e; var v5=f; var v6=g; var t: f32;
  t=min(v0,v1); v1=max(v0,v1); v0=t;
  t=min(v2,v3); v3=max(v2,v3); v2=t;
  t=min(v4,v5); v5=max(v4,v5); v4=t;
  t=min(v0,v2); v2=max(v0,v2); v0=t;
  t=min(v1,v3); v3=max(v1,v3); v1=t;
  t=min(v4,v6); v6=max(v4,v6); v4=t;
  t=min(v0,v4); v4=max(v0,v4); v0=t;
  t=min(v1,v5); v5=max(v1,v5); v1=t;
  t=min(v2,v6); v6=max(v2,v6); v2=t;
  t=min(v1,v2); v2=max(v1,v2); v1=t;
  t=min(v3,v5); v5=max(v3,v5); v3=t;
  t=min(v2,v4); v4=max(v2,v4); v2=t;
  t=min(v3,v4); v4=max(v3,v4); v3=t;
  return v3;
}
fn _gpu_median_8(a: f32, b: f32, c: f32, d: f32, e: f32, f: f32, g: f32, h: f32) -> f32 {
  var v0=a; var v1=b; var v2=c; var v3=d; var v4=e; var v5=f; var v6=g; var v7=h; var t: f32;
  t=min(v0,v1); v1=max(v0,v1); v0=t;
  t=min(v2,v3); v3=max(v2,v3); v2=t;
  t=min(v4,v5); v5=max(v4,v5); v4=t;
  t=min(v6,v7); v7=max(v6,v7); v6=t;
  t=min(v0,v2); v2=max(v0,v2); v0=t;
  t=min(v1,v3); v3=max(v1,v3); v1=t;
  t=min(v4,v6); v6=max(v4,v6); v4=t;
  t=min(v5,v7); v7=max(v5,v7); v5=t;
  t=min(v0,v4); v4=max(v0,v4); v0=t;
  t=min(v1,v5); v5=max(v1,v5); v1=t;
  t=min(v2,v6); v6=max(v2,v6); v2=t;
  t=min(v3,v7); v7=max(v3,v7); v3=t;
  t=min(v1,v2); v2=max(v1,v2); v1=t;
  t=min(v3,v4); v4=max(v3,v4); v3=t;
  t=min(v5,v6); v6=max(v5,v6); v5=t;
  t=min(v3,v5); v5=max(v3,v5); v3=t;
  t=min(v2,v4); v4=max(v2,v4); v2=t;
  t=min(v3,v4); v4=max(v3,v4); v3=t;
  return (v3 + v4) * 0.5;
}
`,If=`
float _gpu_srgb_to_linear(float c) {
  if (c != c) return c;
  float a = abs(c);
  if (a <= 0.04045) return c / 12.92;
  return sign(c) * pow((a + 0.055) / 1.055, 2.4);
}

float _gpu_linear_to_srgb(float c) {
  if (c != c) return c;
  float a = abs(c);
  if (a <= 0.0031308) return 12.92 * c;
  return sign(c) * (1.055 * pow(a, 1.0 / 2.4) - 0.055);
}

vec3 _gpu_srgb_to_oklab(vec3 rgb) {
  float r = _gpu_srgb_to_linear(rgb.x);
  float g = _gpu_srgb_to_linear(rgb.y);
  float b = _gpu_srgb_to_linear(rgb.z);
  float lc = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  float mc = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  float sc = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
  if (lc != lc || mc != mc || sc != sc) return vec3(lc + mc + sc);
  float l_ = sign(lc) * pow(abs(lc), 1.0 / 3.0);
  float m_ = sign(mc) * pow(abs(mc), 1.0 / 3.0);
  float s_ = sign(sc) * pow(abs(sc), 1.0 / 3.0);
  return vec3(
    0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_
  );
}

vec3 _gpu_oklab_to_srgb(vec3 lab) {
  float l_ = lab.x + 0.3963377774 * lab.y + 0.2158037573 * lab.z;
  float m_ = lab.x - 0.1055613458 * lab.y - 0.0638541728 * lab.z;
  float s_ = lab.x - 0.0894841775 * lab.y - 1.291485548 * lab.z;
  float l = l_ * l_ * l_;
  float m = m_ * m_ * m_;
  float s = s_ * s_ * s_;
  float r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  float g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  float b = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  return vec3(_gpu_linear_to_srgb(r), _gpu_linear_to_srgb(g), _gpu_linear_to_srgb(b));
}

vec3 _gpu_oklab_to_oklch(vec3 lab) {
  float C = length(lab.yz);
  float H = atan(lab.z, lab.y) * (180.0 / 3.14159265359);
  if (H < 0.0) H += 360.0;
  return vec3(lab.x, C, H);
}

vec3 _gpu_oklch_to_oklab(vec3 lch) {
  float h_rad = lch.z * (3.14159265359 / 180.0);
  return vec3(lch.x, lch.y * cos(h_rad), lch.y * sin(h_rad));
}

vec3 _gpu_srgb_to_oklch(vec3 rgb) {
  return _gpu_oklab_to_oklch(_gpu_srgb_to_oklab(rgb));
}

vec3 _gpu_oklch_to_srgb(vec3 lch) {
  return _gpu_oklab_to_srgb(_gpu_oklch_to_oklab(lch));
}

bool _gpu_in_srgb_gamut(vec3 rgb) {
  return all(greaterThanEqual(rgb, vec3(-1e-6))) && all(lessThanEqual(rgb, vec3(1.000001)));
}

vec3 _gpu_srgb_to_p3(vec3 rgb) {
  float r = _gpu_srgb_to_linear(rgb.x);
  float g = _gpu_srgb_to_linear(rgb.y);
  float b = _gpu_srgb_to_linear(rgb.z);
  return vec3(
    _gpu_linear_to_srgb(0.8224619687 * r + 0.1775380313 * g),
    _gpu_linear_to_srgb(0.0331941989 * r + 0.9668058011 * g),
    _gpu_linear_to_srgb(0.0170826307 * r + 0.0723974407 * g + 0.9105199286 * b)
  );
}

vec3 _gpu_p3_to_srgb(vec3 p3) {
  float r = _gpu_srgb_to_linear(p3.x);
  float g = _gpu_srgb_to_linear(p3.y);
  float b = _gpu_srgb_to_linear(p3.z);
  return vec3(
    _gpu_linear_to_srgb(1.2249401763 * r - 0.2249401763 * g),
    _gpu_linear_to_srgb(-0.0420569547 * r + 1.0420569547 * g),
    _gpu_linear_to_srgb(-0.0196375546 * r - 0.0786360456 * g + 1.0982736 * b)
  );
}

vec3 _gpu_oklch_to_gamut(vec3 lch, bool p3) {
  vec3 rgb = _gpu_oklch_to_srgb(lch);
  if (p3) return _gpu_srgb_to_p3(rgb);
  return rgb;
}

float _gpu_gamut_delta_e(vec3 c, vec3 lch, bool p3) {
  vec3 a = _gpu_srgb_to_oklab(p3 ? _gpu_p3_to_srgb(c) : c);
  vec3 b = _gpu_oklch_to_oklab(lch);
  float dL = a.x - b.x;
  float da = a.y - b.y;
  float db = a.z - b.z;
  return sqrt(dL * dL + da * da + db * db);
}

vec3 _gpu_gamut_map_oklch_in(vec3 lch, bool p3) {
  float L = lch.x;
  float C = lch.y;
  float H = lch.z;
  if (L != L || C != C || H != H) return vec3(L + C + H);
  if (!(abs(L) <= 3.4028234663852886e38 && abs(C) <= 3.4028234663852886e38 && abs(H) <= 3.4028234663852886e38))
    return vec3(intBitsToFloat(0x7FC00000));
  if (L >= 1.0) return vec3(1.0);
  if (L <= 0.0) return vec3(0.0);
  if (C < 0.0) {
    C = -C;
    H = H + 180.0;
  }
  vec3 origin = _gpu_oklch_to_gamut(vec3(L, C, H), p3);
  vec3 clipped = clamp(origin, 0.0, 1.0);
  if (_gpu_in_srgb_gamut(origin)) return clipped;
  if (_gpu_gamut_delta_e(clipped, vec3(L, C, H), p3) < 0.02) return clipped;
  float lo = 0.0;
  float hi = C;
  bool loInGamut = true;
  for (int i = 0; i < 24; i++) {
    if (hi - lo <= 0.0001) break;
    float chroma = (lo + hi) / 2.0;
    vec3 current = _gpu_oklch_to_gamut(vec3(L, chroma, H), p3);
    if (loInGamut && _gpu_in_srgb_gamut(current)) {
      lo = chroma;
    } else {
      clipped = clamp(current, 0.0, 1.0);
      float e = _gpu_gamut_delta_e(clipped, vec3(L, chroma, H), p3);
      if (e < 0.02) {
        if (0.02 - e < 0.0001) return clipped;
        loInGamut = false;
        lo = chroma;
      } else {
        hi = chroma;
      }
    }
  }
  return clipped;
}

vec3 _gpu_gamut_map_oklch(vec3 lch) {
  return _gpu_gamut_map_oklch_in(lch, false);
}

vec3 _gpu_gamut_map_oklch_p3(vec3 lch) {
  return _gpu_p3_to_srgb(_gpu_gamut_map_oklch_in(lch, true));
}

vec3 _gpu_gamut_map_srgb(vec3 rgb) {
  if (rgb.x != rgb.x || rgb.y != rgb.y || rgb.z != rgb.z)
    return vec3(rgb.x + rgb.y + rgb.z);
  if (_gpu_in_srgb_gamut(rgb)) return clamp(rgb, 0.0, 1.0);
  if (!(abs(rgb.x) <= 3.4028234663852886e38 && abs(rgb.y) <= 3.4028234663852886e38 && abs(rgb.z) <= 3.4028234663852886e38))
    return clamp(rgb, 0.0, 1.0);
  return _gpu_gamut_map_oklch(_gpu_srgb_to_oklch(rgb));
}

vec3 _gpu_hsl_to_rgb(vec3 hsl) {
  float h = mod(hsl.x, 360.0);
  if (h != h || hsl.y != hsl.y || hsl.z != hsl.z) return vec3(h + hsl.y + hsl.z);
  float s = clamp(hsl.y, 0.0, 1.0);
  float l = clamp(hsl.z, 0.0, 1.0);
  float c = (1.0 - abs(2.0 * l - 1.0)) * s;
  float h6 = h / 60.0;
  float x = c * (1.0 - abs(mod(h6, 2.0) - 1.0));
  float r = 0.0;
  float g = 0.0;
  float b = 0.0;
  if (h6 < 1.0)      { r = c; g = x; b = 0.0; }
  else if (h6 < 2.0) { r = x; g = c; b = 0.0; }
  else if (h6 < 3.0) { r = 0.0; g = c; b = x; }
  else if (h6 < 4.0) { r = 0.0; g = x; b = c; }
  else if (h6 < 5.0) { r = x; g = 0.0; b = c; }
  else               { r = c; g = 0.0; b = x; }
  float m = l - c / 2.0;
  return vec3(r + m, g + m, b + m);
}

vec3 _gpu_rgb_to_hsl(vec3 rgb_in) {
  if (rgb_in.x != rgb_in.x || rgb_in.y != rgb_in.y || rgb_in.z != rgb_in.z)
    return vec3(rgb_in.x + rgb_in.y + rgb_in.z);
  vec3 rgb = _gpu_gamut_map_srgb(rgb_in);
  float maxc = max(max(rgb.x, rgb.y), rgb.z);
  float minc = min(min(rgb.x, rgb.y), rgb.z);
  float l = (maxc + minc) / 2.0;
  float d = maxc - minc;
  if (d < 1e-6) return vec3(0.0, 0.0, l);
  float s = d / (1.0 - abs(2.0 * l - 1.0));
  float h;
  if (maxc == rgb.x)      h = mod((rgb.y - rgb.z) / d, 6.0);
  else if (maxc == rgb.y) h = (rgb.z - rgb.x) / d + 2.0;
  else                    h = (rgb.x - rgb.y) / d + 4.0;
  h *= 60.0;
  if (h < 0.0) h += 360.0;
  return vec3(h, s, l);
}

vec3 _gpu_hsv_to_rgb(vec3 hsv) {
  float h = mod(hsv.x, 360.0);
  if (h != h || hsv.y != hsv.y || hsv.z != hsv.z) return vec3(h + hsv.y + hsv.z);
  float s = clamp(hsv.y, 0.0, 1.0);
  float v = clamp(hsv.z, 0.0, 1.0);
  float c = v * s;
  float h6 = h / 60.0;
  float x = c * (1.0 - abs(mod(h6, 2.0) - 1.0));
  float r = 0.0;
  float g = 0.0;
  float b = 0.0;
  if (h6 < 1.0)      { r = c; g = x; b = 0.0; }
  else if (h6 < 2.0) { r = x; g = c; b = 0.0; }
  else if (h6 < 3.0) { r = 0.0; g = c; b = x; }
  else if (h6 < 4.0) { r = 0.0; g = x; b = c; }
  else if (h6 < 5.0) { r = x; g = 0.0; b = c; }
  else               { r = c; g = 0.0; b = x; }
  float m = v - c;
  return vec3(r + m, g + m, b + m);
}

vec3 _gpu_rgb_to_hsv(vec3 rgb_in) {
  if (rgb_in.x != rgb_in.x || rgb_in.y != rgb_in.y || rgb_in.z != rgb_in.z)
    return vec3(rgb_in.x + rgb_in.y + rgb_in.z);
  vec3 rgb = _gpu_gamut_map_srgb(rgb_in);
  float maxc = max(max(rgb.x, rgb.y), rgb.z);
  float minc = min(min(rgb.x, rgb.y), rgb.z);
  float v = maxc;
  float d = maxc - minc;
  if (d < 1e-6) return vec3(0.0, 0.0, v);
  float s = (maxc < 1e-6) ? 0.0 : d / maxc;
  float h;
  if (maxc == rgb.x)      h = mod((rgb.y - rgb.z) / d, 6.0);
  else if (maxc == rgb.y) h = (rgb.z - rgb.x) / d + 2.0;
  else                    h = (rgb.x - rgb.y) / d + 4.0;
  h *= 60.0;
  if (h < 0.0) h += 360.0;
  return vec3(h, s, v);
}

vec3 _gpu_color_mix(vec3 lch1, vec3 lch2, float t) {
  float L = mix(lch1.x, lch2.x, t);
  float C = mix(lch1.y, lch2.y, t);
  bool a1 = lch1.y < 1e-6;
  bool a2 = lch2.y < 1e-6;
  float H;
  if (a1 && a2) {
    H = lch1.z;
  } else if (a1) {
    H = lch2.z;
  } else if (a2) {
    H = lch1.z;
  } else {
    float dh = lch2.z - lch1.z;
    if (dh > 180.0) dh -= 360.0;
    if (dh < -180.0) dh += 360.0;
    H = lch1.z + dh * t;
    if (H < 0.0) H += 360.0;
    if (H >= 360.0) H -= 360.0;
  }
  return vec3(L, C, H);
}

float _gpu_apca_luma(vec3 srgb) {
  if (srgb.x != srgb.x || srgb.y != srgb.y || srgb.z != srgb.z)
    return srgb.x + srgb.y + srgb.z;
  float Y = 0.2126729 * sign(srgb.x) * pow(abs(srgb.x), 2.4)
          + 0.7151522 * sign(srgb.y) * pow(abs(srgb.y), 2.4)
          + 0.0721750 * sign(srgb.z) * pow(abs(srgb.z), 2.4);
  return Y >= 0.022 ? Y : Y + pow(0.022 - Y, 1.414);
}

float _gpu_apca(vec3 lch_bg, vec3 lch_fg) {
  float Ybg = _gpu_apca_luma(_gpu_oklch_to_srgb(lch_bg));
  float Yfg = _gpu_apca_luma(_gpu_oklch_to_srgb(lch_fg));
  if (Ybg != Ybg || Yfg != Yfg) return Ybg + Yfg;
  float C = 0.0;
  if (abs(Ybg - Yfg) >= 0.0005) {
    if (Ybg > Yfg) C = (pow(Ybg, 0.56) - pow(Yfg, 0.57)) * 1.14;
    else           C = (pow(Ybg, 0.65) - pow(Yfg, 0.62)) * 1.14;
  }
  if (abs(C) < 0.1) return 0.0;
  return C > 0.0 ? C - 0.027 : C + 0.027;
}
`,Mf=`
fn _gpu_srgb_to_linear(c: f32) -> f32 {
  if (c != c) { return c; }
  let a = abs(c);
  if (a <= 0.04045) { return c / 12.92; }
  return sign(c) * pow((a + 0.055) / 1.055, 2.4);
}

fn _gpu_linear_to_srgb(c: f32) -> f32 {
  if (c != c) { return c; }
  let a = abs(c);
  if (a <= 0.0031308) { return 12.92 * c; }
  return sign(c) * (1.055 * pow(a, 1.0 / 2.4) - 0.055);
}

fn _gpu_srgb_to_oklab(rgb: vec3f) -> vec3f {
  let r = _gpu_srgb_to_linear(rgb.x);
  let g = _gpu_srgb_to_linear(rgb.y);
  let b = _gpu_srgb_to_linear(rgb.z);
  let lc = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  let mc = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  let sc = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
  if (lc != lc || mc != mc || sc != sc) { return vec3f(lc + mc + sc); }
  let l_ = sign(lc) * pow(abs(lc), 1.0 / 3.0);
  let m_ = sign(mc) * pow(abs(mc), 1.0 / 3.0);
  let s_ = sign(sc) * pow(abs(sc), 1.0 / 3.0);
  return vec3f(
    0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_
  );
}

fn _gpu_oklab_to_srgb(lab: vec3f) -> vec3f {
  let l_ = lab.x + 0.3963377774 * lab.y + 0.2158037573 * lab.z;
  let m_ = lab.x - 0.1055613458 * lab.y - 0.0638541728 * lab.z;
  let s_ = lab.x - 0.0894841775 * lab.y - 1.291485548 * lab.z;
  let l = l_ * l_ * l_;
  let m = m_ * m_ * m_;
  let s = s_ * s_ * s_;
  let r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  let g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  let b = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  return vec3f(_gpu_linear_to_srgb(r), _gpu_linear_to_srgb(g), _gpu_linear_to_srgb(b));
}

fn _gpu_oklab_to_oklch(lab: vec3f) -> vec3f {
  let C = length(lab.yz);
  var H = atan2(lab.z, lab.y) * (180.0 / 3.14159265359);
  if (H < 0.0) { H = H + 360.0; }
  return vec3f(lab.x, C, H);
}

fn _gpu_oklch_to_oklab(lch: vec3f) -> vec3f {
  let h_rad = lch.z * (3.14159265359 / 180.0);
  return vec3f(lch.x, lch.y * cos(h_rad), lch.y * sin(h_rad));
}

fn _gpu_srgb_to_oklch(rgb: vec3f) -> vec3f {
  return _gpu_oklab_to_oklch(_gpu_srgb_to_oklab(rgb));
}

fn _gpu_oklch_to_srgb(lch: vec3f) -> vec3f {
  return _gpu_oklab_to_srgb(_gpu_oklch_to_oklab(lch));
}

fn _gpu_in_srgb_gamut(rgb: vec3f) -> bool {
  return all(rgb >= vec3f(-1e-6)) && all(rgb <= vec3f(1.000001));
}

fn _gpu_srgb_to_p3(rgb: vec3f) -> vec3f {
  let r = _gpu_srgb_to_linear(rgb.x);
  let g = _gpu_srgb_to_linear(rgb.y);
  let b = _gpu_srgb_to_linear(rgb.z);
  return vec3f(
    _gpu_linear_to_srgb(0.8224619687 * r + 0.1775380313 * g),
    _gpu_linear_to_srgb(0.0331941989 * r + 0.9668058011 * g),
    _gpu_linear_to_srgb(0.0170826307 * r + 0.0723974407 * g + 0.9105199286 * b)
  );
}

fn _gpu_p3_to_srgb(p3: vec3f) -> vec3f {
  let r = _gpu_srgb_to_linear(p3.x);
  let g = _gpu_srgb_to_linear(p3.y);
  let b = _gpu_srgb_to_linear(p3.z);
  return vec3f(
    _gpu_linear_to_srgb(1.2249401763 * r - 0.2249401763 * g),
    _gpu_linear_to_srgb(-0.0420569547 * r + 1.0420569547 * g),
    _gpu_linear_to_srgb(-0.0196375546 * r - 0.0786360456 * g + 1.0982736 * b)
  );
}

fn _gpu_oklch_to_gamut(lch: vec3f, p3: bool) -> vec3f {
  let rgb = _gpu_oklch_to_srgb(lch);
  if (p3) { return _gpu_srgb_to_p3(rgb); }
  return rgb;
}

fn _gpu_gamut_delta_e(c: vec3f, lch: vec3f, p3: bool) -> f32 {
  let a = _gpu_srgb_to_oklab(select(c, _gpu_p3_to_srgb(c), p3));
  let b = _gpu_oklch_to_oklab(lch);
  let dL = a.x - b.x;
  let da = a.y - b.y;
  let db = a.z - b.z;
  return sqrt(dL * dL + da * da + db * db);
}

fn _gpu_gamut_map_oklch_in(lch: vec3f, p3: bool) -> vec3f {
  let L = lch.x;
  var C = lch.y;
  var H = lch.z;
  if (L != L || C != C || H != H) { return vec3f(L + C + H); }
  if (!(abs(L) <= 3.4028234663852886e38 && abs(C) <= 3.4028234663852886e38 && abs(H) <= 3.4028234663852886e38)) {
    return vec3f(_gpu_nan());
  }
  if (L >= 1.0) { return vec3f(1.0); }
  if (L <= 0.0) { return vec3f(0.0); }
  if (C < 0.0) {
    C = -C;
    H = H + 180.0;
  }
  let origin = _gpu_oklch_to_gamut(vec3f(L, C, H), p3);
  var clipped = clamp(origin, vec3f(0.0), vec3f(1.0));
  if (_gpu_in_srgb_gamut(origin)) { return clipped; }
  if (_gpu_gamut_delta_e(clipped, vec3f(L, C, H), p3) < 0.02) { return clipped; }
  var lo: f32 = 0.0;
  var hi: f32 = C;
  var loInGamut = true;
  for (var i: i32 = 0; i < 24; i = i + 1) {
    if (hi - lo <= 0.0001) { break; }
    let chroma = (lo + hi) / 2.0;
    let current = _gpu_oklch_to_gamut(vec3f(L, chroma, H), p3);
    if (loInGamut && _gpu_in_srgb_gamut(current)) {
      lo = chroma;
    } else {
      clipped = clamp(current, vec3f(0.0), vec3f(1.0));
      let e = _gpu_gamut_delta_e(clipped, vec3f(L, chroma, H), p3);
      if (e < 0.02) {
        if (0.02 - e < 0.0001) { return clipped; }
        loInGamut = false;
        lo = chroma;
      } else {
        hi = chroma;
      }
    }
  }
  return clipped;
}

fn _gpu_gamut_map_oklch(lch: vec3f) -> vec3f {
  return _gpu_gamut_map_oklch_in(lch, false);
}

fn _gpu_gamut_map_oklch_p3(lch: vec3f) -> vec3f {
  return _gpu_p3_to_srgb(_gpu_gamut_map_oklch_in(lch, true));
}

fn _gpu_gamut_map_srgb(rgb: vec3f) -> vec3f {
  if (rgb.x != rgb.x || rgb.y != rgb.y || rgb.z != rgb.z) {
    return vec3f(rgb.x + rgb.y + rgb.z);
  }
  if (_gpu_in_srgb_gamut(rgb)) { return clamp(rgb, vec3f(0.0), vec3f(1.0)); }
  if (!(abs(rgb.x) <= 3.4028234663852886e38 && abs(rgb.y) <= 3.4028234663852886e38 && abs(rgb.z) <= 3.4028234663852886e38)) {
    return clamp(rgb, vec3f(0.0), vec3f(1.0));
  }
  return _gpu_gamut_map_oklch(_gpu_srgb_to_oklch(rgb));
}

fn _gpu_hsl_to_rgb(hsl: vec3f) -> vec3f {
  let h = hsl.x - 360.0 * floor(hsl.x / 360.0);
  if (h != h || hsl.y != hsl.y || hsl.z != hsl.z) { return vec3f(h + hsl.y + hsl.z); }
  let s = clamp(hsl.y, 0.0, 1.0);
  let l = clamp(hsl.z, 0.0, 1.0);
  let c = (1.0 - abs(2.0 * l - 1.0)) * s;
  let h6 = h / 60.0;
  let x = c * (1.0 - abs((h6 - 2.0 * floor(h6 / 2.0)) - 1.0));
  var r: f32 = 0.0;
  var g: f32 = 0.0;
  var b: f32 = 0.0;
  if (h6 < 1.0)      { r = c; g = x; b = 0.0; }
  else if (h6 < 2.0) { r = x; g = c; b = 0.0; }
  else if (h6 < 3.0) { r = 0.0; g = c; b = x; }
  else if (h6 < 4.0) { r = 0.0; g = x; b = c; }
  else if (h6 < 5.0) { r = x; g = 0.0; b = c; }
  else               { r = c; g = 0.0; b = x; }
  let m = l - c / 2.0;
  return vec3f(r + m, g + m, b + m);
}

fn _gpu_rgb_to_hsl(rgb_in: vec3f) -> vec3f {
  if (rgb_in.x != rgb_in.x || rgb_in.y != rgb_in.y || rgb_in.z != rgb_in.z) {
    return vec3f(rgb_in.x + rgb_in.y + rgb_in.z);
  }
  let rgb = _gpu_gamut_map_srgb(rgb_in);
  let maxc = max(max(rgb.x, rgb.y), rgb.z);
  let minc = min(min(rgb.x, rgb.y), rgb.z);
  let l = (maxc + minc) / 2.0;
  let d = maxc - minc;
  if (d < 1e-6) { return vec3f(0.0, 0.0, l); }
  let s = d / (1.0 - abs(2.0 * l - 1.0));
  var h: f32;
  if (maxc == rgb.x) {
    let v = (rgb.y - rgb.z) / d;
    h = v - 6.0 * floor(v / 6.0);
  } else if (maxc == rgb.y) {
    h = (rgb.z - rgb.x) / d + 2.0;
  } else {
    h = (rgb.x - rgb.y) / d + 4.0;
  }
  h = h * 60.0;
  if (h < 0.0) { h = h + 360.0; }
  return vec3f(h, s, l);
}

fn _gpu_hsv_to_rgb(hsv: vec3f) -> vec3f {
  let h = hsv.x - 360.0 * floor(hsv.x / 360.0);
  if (h != h || hsv.y != hsv.y || hsv.z != hsv.z) { return vec3f(h + hsv.y + hsv.z); }
  let s = clamp(hsv.y, 0.0, 1.0);
  let v = clamp(hsv.z, 0.0, 1.0);
  let c = v * s;
  let h6 = h / 60.0;
  let x = c * (1.0 - abs((h6 - 2.0 * floor(h6 / 2.0)) - 1.0));
  var r: f32 = 0.0;
  var g: f32 = 0.0;
  var b: f32 = 0.0;
  if (h6 < 1.0)      { r = c; g = x; b = 0.0; }
  else if (h6 < 2.0) { r = x; g = c; b = 0.0; }
  else if (h6 < 3.0) { r = 0.0; g = c; b = x; }
  else if (h6 < 4.0) { r = 0.0; g = x; b = c; }
  else if (h6 < 5.0) { r = x; g = 0.0; b = c; }
  else               { r = c; g = 0.0; b = x; }
  let m = v - c;
  return vec3f(r + m, g + m, b + m);
}

fn _gpu_rgb_to_hsv(rgb_in: vec3f) -> vec3f {
  if (rgb_in.x != rgb_in.x || rgb_in.y != rgb_in.y || rgb_in.z != rgb_in.z) {
    return vec3f(rgb_in.x + rgb_in.y + rgb_in.z);
  }
  let rgb = _gpu_gamut_map_srgb(rgb_in);
  let maxc = max(max(rgb.x, rgb.y), rgb.z);
  let minc = min(min(rgb.x, rgb.y), rgb.z);
  let v = maxc;
  let d = maxc - minc;
  if (d < 1e-6) { return vec3f(0.0, 0.0, v); }
  var s: f32 = 0.0;
  if (maxc >= 1e-6) { s = d / maxc; }
  var h: f32;
  if (maxc == rgb.x) {
    let q = (rgb.y - rgb.z) / d;
    h = q - 6.0 * floor(q / 6.0);
  } else if (maxc == rgb.y) {
    h = (rgb.z - rgb.x) / d + 2.0;
  } else {
    h = (rgb.x - rgb.y) / d + 4.0;
  }
  h = h * 60.0;
  if (h < 0.0) { h = h + 360.0; }
  return vec3f(h, s, v);
}

fn _gpu_color_mix(lch1: vec3f, lch2: vec3f, t: f32) -> vec3f {
  let L = mix(lch1.x, lch2.x, t);
  let C = mix(lch1.y, lch2.y, t);
  let a1 = lch1.y < 1e-6;
  let a2 = lch2.y < 1e-6;
  var H: f32;
  if (a1 && a2) {
    H = lch1.z;
  } else if (a1) {
    H = lch2.z;
  } else if (a2) {
    H = lch1.z;
  } else {
    var dh = lch2.z - lch1.z;
    if (dh > 180.0) { dh = dh - 360.0; }
    if (dh < -180.0) { dh = dh + 360.0; }
    H = lch1.z + dh * t;
    if (H < 0.0) { H = H + 360.0; }
    if (H >= 360.0) { H = H - 360.0; }
  }
  return vec3f(L, C, H);
}

fn _gpu_apca_luma(srgb: vec3f) -> f32 {
  if (srgb.x != srgb.x || srgb.y != srgb.y || srgb.z != srgb.z) {
    return srgb.x + srgb.y + srgb.z;
  }
  let Y = 0.2126729 * sign(srgb.x) * pow(abs(srgb.x), 2.4)
        + 0.7151522 * sign(srgb.y) * pow(abs(srgb.y), 2.4)
        + 0.0721750 * sign(srgb.z) * pow(abs(srgb.z), 2.4);
  return select(Y + pow(0.022 - Y, 1.414), Y, Y >= 0.022);
}

fn _gpu_apca(lch_bg: vec3f, lch_fg: vec3f) -> f32 {
  let Ybg = _gpu_apca_luma(_gpu_oklch_to_srgb(lch_bg));
  let Yfg = _gpu_apca_luma(_gpu_oklch_to_srgb(lch_fg));
  if (Ybg != Ybg || Yfg != Yfg) { return Ybg + Yfg; }
  var C = 0.0;
  if (abs(Ybg - Yfg) >= 0.0005) {
    if (Ybg > Yfg) {
      C = (pow(Ybg, 0.56) - pow(Yfg, 0.57)) * 1.14;
    } else {
      C = (pow(Ybg, 0.65) - pow(Yfg, 0.62)) * 1.14;
    }
  }
  if (abs(C) < 0.1) { return 0.0; }
  return select(C + 0.027, C - 0.027, C > 0.0);
}
`,zd=`
vec3 _gpu_srgb_roundtrip(vec3 rgb) {
  if (abs(rgb.x) <= 3.4028234663852886e38 && abs(rgb.y) <= 3.4028234663852886e38 && abs(rgb.z) <= 3.4028234663852886e38) return rgb;
  return _gpu_oklch_to_srgb(_gpu_srgb_to_oklch(rgb));
}
`,Pd=`
fn _gpu_srgb_roundtrip(rgb: vec3f) -> vec3f {
  if (abs(rgb.x) <= 3.4028234663852886e38 && abs(rgb.y) <= 3.4028234663852886e38 && abs(rgb.z) <= 3.4028234663852886e38) { return rgb; }
  return _gpu_oklch_to_srgb(_gpu_srgb_to_oklch(rgb));
}
`,kd=`
vec3 _gpu_finite_color(vec3 c) {
  if (abs(c.x) <= 3.4028234663852886e38 && abs(c.y) <= 3.4028234663852886e38 && abs(c.z) <= 3.4028234663852886e38) return c;
  return vec3(intBitsToFloat(0x7FC00000));
}
`,Ld=`
fn _gpu_finite_color(c: vec3f) -> vec3f {
  if (abs(c.x) <= 3.4028234663852886e38 && abs(c.y) <= 3.4028234663852886e38 && abs(c.z) <= 3.4028234663852886e38) { return c; }
  return vec3f(_gpu_nan());
}
`,Of=If+zd+kd,Uf=Mf+Pd+Ld,Bf=`
float _gpu_nan() {
  return intBitsToFloat(0x7FC00000);
}
`,Ws=`
float _gpu_inf() {
  return intBitsToFloat(0x7F800000);
}
`,_r=`
fn _gpu_nan() -> f32 {
  let bits = 0x7fc00000u;
  return bitcast<f32>(bits);
}
`,jf=`
fn _gpu_inf() -> f32 {
  let bits = 0x7f800000u;
  return bitcast<f32>(bits);
}
`,Ys=`
float _gpu_powi(float x, float n) {
  if (n == 0.0) return 1.0;
  if (n == 2.0) return x * x;
  if (n == 3.0) return x * x * x;
  if (n == 4.0) { float s = x * x; return s * s; }
  float r = pow(abs(x), n);
  if (x < 0.0 && mod(abs(n), 2.0) == 1.0) return -r;
  return r;
}
`,Ks=`
fn _gpu_powi(x: f32, n: f32) -> f32 {
  if (n == 0.0) { return 1.0; }
  if (n == 2.0) { return x * x; }
  if (n == 3.0) { return x * x * x; }
  if (n == 4.0) { let s = x * x; return s * s; }
  let r = pow(abs(x), n);
  if (x < 0.0 && (abs(n) % 2.0) == 1.0) { return -r; }
  return r;
}
`,Df=`
vec2 _gpu_cossinpi(float u) {
  if ((floatBitsToUint(u) & 0x7FFFFFFFu) >= 0x7F800000u) return vec2(intBitsToFloat(0x7FC00000));
  float r = u - 2.0 * floor(u / 2.0 + 0.5);
  float q = floor(2.0 * r + 0.5);
  float t = r - q / 2.0;
  float c = cos(3.141592653589793 * t);
  float s = sin(3.141592653589793 * t);
  float k = q + 4.0 - 4.0 * floor((q + 4.0) / 4.0);
  vec2 v = vec2(s, -c);
  if (k == 0.0) v = vec2(c, s);
  if (k == 1.0) v = vec2(-s, c);
  if (k == 2.0) v = vec2(-c, -s);
  return vec2(v.x == 0.0 ? 0.0 : v.x, v.y == 0.0 ? 0.0 : v.y);
}
float _gpu_sinpi(float u) {
  return _gpu_cossinpi(u).y;
}
float _gpu_cospi(float u) {
  return _gpu_cossinpi(u).x;
}
float _gpu_tanpi(float u) {
  vec2 cs = _gpu_cossinpi(u);
  if (cs.x == 0.0) return _gpu_inf();
  return cs.y == 0.0 ? 0.0 : cs.y / cs.x;
}
vec2 _gpu_ipi_sinh(float u) {
  return vec2(0.0, _gpu_cossinpi(u).y);
}
vec2 _gpu_ipi_cosh(float u) {
  return vec2(_gpu_cossinpi(u).x, 0.0);
}
vec2 _gpu_ipi_tanh(float u) {
  vec2 cs = _gpu_cossinpi(u);
  if (cs.x == 0.0) return vec2(_gpu_inf(), _gpu_inf());
  return vec2(0.0, cs.y == 0.0 ? 0.0 : cs.y / cs.x);
}
vec2 _gpu_ipi_csch(float u) {
  vec2 cs = _gpu_cossinpi(u);
  if (cs.y == 0.0) return vec2(_gpu_inf(), _gpu_inf());
  return vec2(0.0, -1.0 / cs.y);
}
vec2 _gpu_ipi_sech(float u) {
  vec2 cs = _gpu_cossinpi(u);
  if (cs.x == 0.0) return vec2(_gpu_inf(), _gpu_inf());
  return vec2(1.0 / cs.x, 0.0);
}
vec2 _gpu_ipi_coth(float u) {
  vec2 cs = _gpu_cossinpi(u);
  if (cs.y == 0.0) return vec2(_gpu_inf(), _gpu_inf());
  return vec2(0.0, cs.x == 0.0 ? 0.0 : -cs.x / cs.y);
}
`,Vf=`
fn _gpu_cossinpi(u: f32) -> vec2f {
  let bits = 0x7fc00000u;
  if ((bitcast<u32>(u) & 0x7FFFFFFFu) >= 0x7F800000u) { return vec2f(bitcast<f32>(bits)); }
  let r = u - 2.0 * floor(u / 2.0 + 0.5);
  let q = floor(2.0 * r + 0.5);
  let t = r - q / 2.0;
  let c = cos(3.141592653589793 * t);
  let s = sin(3.141592653589793 * t);
  let k = q + 4.0 - 4.0 * floor((q + 4.0) / 4.0);
  var v = vec2f(s, -c);
  if (k == 0.0) { v = vec2f(c, s); }
  if (k == 1.0) { v = vec2f(-s, c); }
  if (k == 2.0) { v = vec2f(-c, -s); }
  return vec2f(select(v.x, 0.0, v.x == 0.0), select(v.y, 0.0, v.y == 0.0));
}
fn _gpu_sinpi(u: f32) -> f32 {
  return _gpu_cossinpi(u).y;
}
fn _gpu_cospi(u: f32) -> f32 {
  return _gpu_cossinpi(u).x;
}
fn _gpu_tanpi(u: f32) -> f32 {
  let cs = _gpu_cossinpi(u);
  if (cs.x == 0.0) { return _gpu_inf(); }
  return select(cs.y / cs.x, 0.0, cs.y == 0.0);
}
fn _gpu_ipi_sinh(u: f32) -> vec2f {
  return vec2f(0.0, _gpu_cossinpi(u).y);
}
fn _gpu_ipi_cosh(u: f32) -> vec2f {
  return vec2f(_gpu_cossinpi(u).x, 0.0);
}
fn _gpu_ipi_tanh(u: f32) -> vec2f {
  let cs = _gpu_cossinpi(u);
  if (cs.x == 0.0) { return vec2f(_gpu_inf(), _gpu_inf()); }
  return vec2f(0.0, select(cs.y / cs.x, 0.0, cs.y == 0.0));
}
fn _gpu_ipi_csch(u: f32) -> vec2f {
  let cs = _gpu_cossinpi(u);
  if (cs.y == 0.0) { return vec2f(_gpu_inf(), _gpu_inf()); }
  return vec2f(0.0, -1.0 / cs.y);
}
fn _gpu_ipi_sech(u: f32) -> vec2f {
  let cs = _gpu_cossinpi(u);
  if (cs.x == 0.0) { return vec2f(_gpu_inf(), _gpu_inf()); }
  return vec2f(1.0 / cs.x, 0.0);
}
fn _gpu_ipi_coth(u: f32) -> vec2f {
  let cs = _gpu_cossinpi(u);
  if (cs.y == 0.0) { return vec2f(_gpu_inf(), _gpu_inf()); }
  return vec2f(0.0, select(-cs.x / cs.y, 0.0, cs.x == 0.0));
}
`,qf=`
float _gpu_round(float x) {
  float a = abs(x);
  float m = floor(a);
  return sign(x) * (m + step(0.5, a - m));
}
float _gpu_round_tz(float x) {
  float a = abs(x);
  float m = floor(a);
  return sign(x) * (m + (1.0 - step(a - m, 0.5)));
}
float _gpu_round_up(float x) {
  float m = floor(x);
  return m + step(0.5, x - m);
}
float _gpu_round_down(float x) {
  float m = ceil(x);
  return m - step(0.5, m - x);
}
float _gpu_step_quotient(float x, float k) {
  float q = x / k;
  if (q == 0.0 && x != 0.0 && k < 3.4e38) return sign(x) * 1.17549435e-38;
  float r = round(q);
  return abs(q - r) <= 4.8e-7 * abs(q) ? r : q;
}
float _gpu_half_step_quotient(float x, float k) {
  float q = x / k;
  if (q == 0.0 && x != 0.0 && k < 3.4e38) return sign(x) * 1.17549435e-38;
  float r = round(q * 2.0) * 0.5;
  return abs(q - r) <= 4.8e-7 * abs(q) ? r : q;
}
float _gpu_step_fix(float m, float x, float k) {
  return k != 0.0 && abs(x / k) > 3.4e38 ? x : m;
}
`,Hf=`
fn _gpu_round(x: f32) -> f32 {
  let a = abs(x);
  let m = floor(a);
  return sign(x) * (m + step(0.5, a - m));
}
fn _gpu_round_tz(x: f32) -> f32 {
  let a = abs(x);
  let m = floor(a);
  return sign(x) * (m + (1.0 - step(a - m, 0.5)));
}
fn _gpu_round_up(x: f32) -> f32 {
  let m = floor(x);
  return m + step(0.5, x - m);
}
fn _gpu_round_down(x: f32) -> f32 {
  let m = ceil(x);
  return m - step(0.5, m - x);
}
fn _gpu_step_quotient(x: f32, k: f32) -> f32 {
  let q = x / k;
  if (q == 0.0 && x != 0.0 && k < 3.4e38) { return sign(x) * 1.17549435e-38; }
  let r = round(q);
  return select(q, r, abs(q - r) <= 4.8e-7 * abs(q));
}
fn _gpu_half_step_quotient(x: f32, k: f32) -> f32 {
  let q = x / k;
  if (q == 0.0 && x != 0.0 && k < 3.4e38) { return sign(x) * 1.17549435e-38; }
  let r = round(q * 2.0) * 0.5;
  return select(q, r, abs(q - r) <= 4.8e-7 * abs(q));
}
fn _gpu_step_fix(m: f32, x: f32, k: f32) -> f32 {
  return select(m, x, k != 0.0 && abs(x / k) > 3.4e38);
}
`;var lt=class{getOperators(){return qe}_functionsMemo;getFunctions(){let n=this.getLanguageSpecificFunctions();return this._functionsMemo?.languageSpecific!==n&&(this._functionsMemo={languageSpecific:n,merged:Object.assign(Object.create(null),Tn,n)}),this._functionsMemo.merged}getConstants(){return eu}getShapeRules(){return{scalarGenTypeSlots:new Map([["mix",new Set([2])],["refract",new Set([2])]]),mandatoryScalarSlots:new Map([["refract",new Set([2])]]),vectorOnlySlots:new Map([["cross",new Set([0,1])],["dot",new Set([0,1])],["faceForward",new Set([0,1,2])],["normalize",new Set([0])],["reflect",new Set([0,1])],["refract",new Set([0,1])]]),matrixArithmetic:(n,t)=>n==="*"||t&&(n==="+"||n==="-"),matrixNegate:!1}}createTarget(n={}){let t=this.getFunctions(),r=this.getConstants(),o=this.languageId==="wgsl"?"vec2f":"vec2",i=this.getShapeRules(),s={language:this.languageId,isRealOnlyLowering:bu,supportedModes:ou,loweredSymbolType:yu(this.languageId==="wgsl"),maxInlineElements:st,gpuShapeRules:i,beginCompilation:Ef,hoistScalarInvariants:!0,unrollComprehensions:!0,appliesFunctionLiteralsOnly:!0,assignmentValue:(a,l,u)=>q(te(a),"color")?De("Assign",a,f=>f===a?l:p.compileValueOperand(f,u),u):l,cseCanMaterialize:Xe,cseMaterialize:(a,l,u,f)=>{if(!Xe(f))return!1;let c=pe(a,f.language==="wgsl");return c===void 0?!1:(p.hoistStatement(f,f.language==="wgsl"?`let ${l}: ${c} = ${u};`:`${c} ${l} = ${u};`),!0)},bareStatementBlocks:this.languageId==="glsl"||this.languageId==="wgsl",recompileStatement:$u,lazyOperand:(a,l,u)=>Ze(a,l,u),valueBlock:(a,l,u,f,c)=>{if(!p.canHoist(f)||tn.has(f.hoist))return;let m=c!==void 0&&p.foldValueImpure(c);m&&Ye("Block",[c],f),ve("Block",c===void 0?void 0:[c],f);let d=f.language==="wgsl",g=pe(a,d);if(g===void 0)return;let _=p.tempVar(f),x=p.joinShaderStatements([...l,`${_} = ${u}`]).split(`
`).map(v=>`  ${v}`).join(`
`);return p.hoistStatement(f,d?`var ${_}: ${g};`:`${g} ${_};`,`{
${x}
}`),m&&Be([c],f),_},mangleId:a=>je(a,this.languageId),selection:(a,l,u)=>Iu(a,l,u),broadcastUnary:(a,l,u,f)=>Rf(a,l,u,f),checkOperandShapes:(a,l,u)=>Ai(a,l,u,i,f=>this.preambleFor(f),t[a]),operators:a=>qe[a],functions:a=>t[a],constant:a=>a==="ImaginaryUnit"?`${o}(0.0, 1.0)`:r[a],var:a=>{if(a==="ImaginaryUnit")return`${o}(0.0, 1.0)`;if(a in r)return r[a]},string:a=>{throw new Error(`Could not compile the string literal ${JSON.stringify(a)}: it is not supported on the ${this.languageId} target: the shader languages have no text type \u2014 no string, no character, no grapheme-cluster indexing \u2014 so there is no value a quoted literal could lower to.`)},number:a=>he(a,this.languageId),complex:(a,l)=>`${o}(${he(a,this.languageId)}, ${he(l,this.languageId)})`,absence:{numeric:{make:()=>ce({language:this.languageId})}},indent:0,ws:a=>a??"",preamble:"",declare:(a,l)=>{let u=l??(this.languageId==="wgsl"?"f32":"float"),f=this.languageId==="wgsl"?ts(u):void 0;if(f!==void 0&&f>Vn)throw new Error(`Could not compile \`Block\`: the local "${a}" (\`${u}\`, ${f} bytes) is a function-scope variable, and WGSL guarantees only ${Vn} bytes of them per function. Read the list where it is, from a storage buffer (the storage kind 'storage-buffer'), instead of copying it into a local.`);return this.languageId==="wgsl"?`var ${a}: ${u}`:`${u} ${a}`},block:a=>{if(a.length===0)return"";let l=a.length-1;if(/^\s*(for|while)\b/.test(a[l]))throw new Error(`Could not compile \`${this.languageId.toUpperCase()}\`: a Loop (or other statement-form construct) cannot be the final statement of a block \u2014 a shader block must evaluate to a typed value.`);let u=this.languageId==="wgsl"?/^([^\s()[\]{}'"=,:;]+) = /.exec(a[l]):null;return u!==null?a.push(`return ${u[1]}`):a[l]=`return ${a[l]}`,p.joinShaderStatements(a)},naming:{counter:0,usedNames:new Set},...n};if(s.constantFold!==!1&&s.foldEmittedConstant===void 0){let a=xl(s.varsKeys,s.var);s.foldEmittedConstant=(l,u)=>wl(u,a)}return $f(s),s}targetExtension;withTargetExtension(n,t){let r=this.targetExtension;this.targetExtension=n;try{return t()}finally{this.targetExtension=r}}emittedUserFunctionNames(){return[...this.currentUserFunctions?.defs?.keys()??[]]}createTargetFor(n,t,r={}){let o=this.createTarget(r),i=this.targetExtension;i!==void 0&&(i.storage!==void 0&&(o.storage=new Map([...o.storage??[],...i.storage])),o.storageRead=i.storageRead,o.hostInputVars=i.hostInputVars,i.onReturn!==void 0&&(o.onReturn=i.onReturn));let s=0;o.checkDefinitionBody=(c,m,d)=>{let g=m.cse,_={...ht(c,{...g?.harvestOptions,admitPureUserFunctions:!0}),share:d&&g?.enabled===!0},x=Pt(c,_);if(d||(s+=x),x>Me||s>Me)throw new Error(`Could not compile: the ${this.languageId.toUpperCase()} code of the user-defined functions that the expression calls would have more than ${Me.toLocaleString("en-US")} nodes. A subexpression that several paths reach is written once for each path when the shader cannot compute it once: the paths go through different branches of an \`If\`, the subexpression reads a \`vars\` source that is not a variable or a field of a variable (\`u.c\`), it is not pure, or the \`cse\` option is false. A call that is written in place of its definition is written in full at each call site.`)};let a=Cf(n);if(a.size>0){let c=o.mangleId;o.mangleId=m=>{if(a.has(m))throw new Error(`Could not compile \`${m}\`: the symbol is text-typed, which is not supported on the ${this.languageId} target: the shader languages have no text type \u2014 no string, no character, no grapheme-cluster indexing \u2014 so it would be emitted as a bare identifier and declared as a numeric uniform.`);return c?c(m):m}}let l=o.storage;if(l!==void 0&&l.size>0){let c=o.var,m=o.mangleId,d=this.languageId;o.var=g=>(es(g,l,d),c(g)),o.mangleId=g=>(es(g,l,d),m?m(g):g)}let u=Sf(n);if(u.size>0){let c=o.var,m=o.mangleId;o.var=d=>{let g=c(d),_=u.get(d);if(g!==void 0&&_!==void 0&&o.varsKeys?.has(d)===!0)throw new Error(_);return g},o.mangleId=d=>{let g=u.get(d);if(g!==void 0)throw new Error(g);return m?m(d):d}}let f=Rn(o);if(f.stage=t,f.hostFrame=n?.engine?._randomFrame!==void 0,r.naming===void 0&&(o.naming=p.newNamingContext(n,[o.preamble])),this.currentUserFunctions=void 0,!("userFunctions"in r)){let c=this.newUserFunctions();c.root=o,o.userFunctions=c,this.currentUserFunctions=c}return o}currentUserFunctions;userFunctionDefs(n){let t=this.currentUserFunctions,r=t?.defs;return!t||!r||r.size===0||(p.pruneUnreferencedVariantBases(t,n),r.size===0)?"":[...r.values()].join(`

`)+`
`}newUserFunctions(){let n=this.languageId,t=n==="wgsl",r=new Map,o=(s,a,l,u)=>this.declareGPUFunction(s,a,l,u),i=(s,a,l,u,f)=>{if(u.length===0||l.ret!==(t?"f32":"float"))return;let c=u[0].engine;if(!p.userFunctionParamsAreScalar(c,s))return;let m,d,g=u.map((E,S)=>{if(l.complex[S]||l.colors[S])return;let $=pe(E,t);if($===l.params[S])return!1;if(l.params[S]!==(t?"f32":"float")||$===void 0||!/^vec[234]f?$/.test($)||(t?!$.endsWith("f"):$.endsWith("f"))||!p.isShaderVectorListArg(E))return;let N=bi($);if(p.aggregateComponentCount(E)===N&&!(m!==void 0&&m!==N))return m=N,d=$,!0});if(m===void 0||d===void 0||g.some(E=>E===void 0))return;let _=f.userFunctions;if(_===void 0)return;let x=g.map(E=>E?"1":"0").join(""),v=p.registryHelperName(_,`${s}#each${m}_${x}`);if(!_.defs.has(v)){let E=u.map((N,I)=>[`a${I}`,g[I]?d:l.params[I]]),S=["x","y","z","w"].slice(0,m),$=`${d}(${S.map(N=>`${a}(${u.map((I,O)=>g[O]?`a${O}.${N}`:`a${O}`).join(", ")})`).join(", ")})`;_.defs.set(v,o(v,d,E,$))}return`${v}(${u.map(E=>p.compileValueOperand(E,f)).join(", ")})`};return{defs:new Map,compiling:new Set,lowering:{noRecursion:!0,staticReturnType:!0,define:({id:s,name:a,params:l,body:u,literal:f,target:c,parameterTypes:m,extraParams:d})=>{let g=Ht(u,c,{scalarNames:new Set,localNames:new Set(l)},ur),_=Et(g,c,new Set([...l,...wn(g).written]));je(a,n);for(let y of l)je(y,n);let x=d??[];for(let y of x)je(y.name,n);let v=f.engine,E=b(f)?f.ops.slice(1):[],S=new Map,$=new Map,N=[],I=[],O=l.map((y,k)=>{let A=m?.[k]??p.userFunctionParamType(v,s,k),R=E[k]?.type?.type,T=A===void 0||A==="unknown"?R:A,U=yi(T,t);if(N.push(T!==void 0&&q(X(T),"color")),U===void 0)throw new Error(`Could not compile \`${s}\`: parameter "${y}" has no static ${n.toUpperCase()} type \u2014 only scalars, booleans, colors, complex values and 2\u20134 component vectors have one, and a shader function signature must be fully typed. Declare a narrower signature for "${s}".`);let M=T!==void 0&&Ve(T),j=M?2:N[k]?3:Lt(T??"unknown")??0;return S.set(y,M),I.push(M),$.set(y,U==="bool"?p.LOCAL_BOOLEAN:j>=2?j:p.LOCAL_SCALAR),U}),F=p.withLocalShapeFrame(S,$,()=>x.map(y=>{let k=pe(y.expr,t);if(k===void 0)throw new Error(`Could not compile \`${s}\`: the hoisted value \`${y.expr.toString()}\` has no static ${n.toUpperCase()} type, so no variant of "${s}" takes it as a parameter.`);return{shader:k,complex:p.isComplexValued(y.expr)}}),!0);x.forEach((y,k)=>{let{shader:A,complex:R}=F[k],T=R?2:bi(A);S.set(y.name,R),$.set(y.name,A==="bool"?p.LOCAL_BOOLEAN:T>=2?T:p.LOCAL_SCALAR)});let w=ku(s,l,O,_,c,t),{ret:z,code:G}=p.withLocalShapeFrame(S,$,()=>{let y=pe(_,t),k=y===void 0?mi(_):void 0;if(k!==void 0&&C(k))throw new Error(`Could not compile \`${s}\`: the return value reads "${k.symbol}", which has the type \`${k.type.toString()}\`. That type admits a point and a list of points, so the return value has no static ${n.toUpperCase()} type. Declare "${k.symbol}" as a point (\`${Ft(k.symbol,on(k.type.type)?.arity)}\`).`);if(y===void 0)throw new Error(`Could not compile \`${s}\`: the return value has no static ${n.toUpperCase()} type \u2014 only scalars, booleans, colors, complex values and 2\u20134 component vectors have one.`);let A=p.compileFunctionBody(_,{...c,gpuParameterFacts:w,onReturn:R=>{let T=R===void 0?void 0:pe(R,t);if(T!==y)throw new Error(`Could not compile \`${s}\`: a \`Return\` in this body yields `+(T===void 0?`a value with no static ${n.toUpperCase()} type`:`a "${T}" value`)+`, but "${s}" is declared to return "${y}" (the shape of the body's own final value). ${n.toUpperCase()} has no implicit conversion between them, and a shader function has a single return type. Make every \`Return\` \u2014 and the body's final value \u2014 the same shape.`)}});return p.recordUserFunctionLane(c,s,a,_),{ret:y,code:A}},!0);oo(s,G,n);let h=[...l,...x.map(y=>y.name)],L=[...O,...F.map(y=>y.shader)];return r.set(a,{names:h,params:L,colors:[...N,...x.map(()=>!1)],complex:[...I,...F.map(y=>y.complex)],ret:z}),o(a,z,h.map((y,k)=>[y,L[k]]),G)},call:({id:s,name:a,args:l,target:u,held:f})=>{let c=r.get(a);if(c===void 0)throw new Error(`Internal: no synthesized signature for "${s}"`);let m=f===void 0?l:[...l,...f];if(m.length!==c.params.length)throw new Error(`Could not compile \`${s}\`: called with ${m.length} argument(s) but declared with ${c.params.length} \u2014 a ${n.toUpperCase()} call must match its declaration exactly (there are no optional or variadic parameters).`);if(f===void 0){let g=i(s,a,c,m,u);if(g!==void 0)return g}let d=m.map((g,_)=>{let x=pe(g,t),v=x===void 0?Oe(g):void 0;if(v!==void 0)throw new Error(`Could not compile \`${s}\`: argument ${_+1} \`${g.toString()}\` is declared "${v.spelling}" by the caller \u2014 a type with no static ${n.toUpperCase()} value shape here (only scalars, booleans and 2\u20134 component vectors have one), so it cannot be matched against parameter "${c.names[_]}" (declared "${c.params[_]}").`);if(x===void 0)throw new Error(`Could not compile \`${s}\`: argument ${_+1} is a collection with no static ${n.toUpperCase()} shape (only 2\u20134 component vectors have one), and a shader has no runtime broadcast dispatch to apply "${s}" element-wise.`);if(c.complex[_]&&x===(t?"f32":"float")&&x!==c.params[_])return`${re(u)}(${p.compileValueOperand(g,u)}, 0.0)`;if(x!==c.params[_])throw new Error(`Could not compile \`${s}\`: argument ${_+1} \`${g.toString()}\` lowers to "${x}" but parameter "${c.names[_]}" is declared "${c.params[_]}" \u2014 ${n.toUpperCase()} has no implicit conversion between them. Declare a matching signature for "${s}".`);return c.colors[_]?De(s,g,E=>p.compileValueOperand(E,u),u):p.compileValueOperand(g,u)});return`${a}(${d.join(", ")})`},value:({id:s})=>{throw new Error(`Could not compile \`${s}\`: a user-defined function cannot be used as a VALUE on target '${n}' \u2014 the shader languages have no function values (no higher-order operands, no function pointers). Call it instead.`)}}}}declareGPUFunction(n,t,r,o){let i=this.languageId==="wgsl"?`fn ${n}(${r.map(([s,a])=>`${s}: ${a}`).join(", ")}) -> ${t}`:`${t} ${n}(${r.map(([s,a])=>`${a} ${s}`).join(", ")})`;if(o.includes(`
`)){let s=o.split(`
`).map(a=>`  ${a}`).join(`
`);return`${i} {
${s}
}`}return`${i} {
  return ${o};
}`}compileDeclaredFunctionBody(n,t,r,o){o===void 0&&(n=fn(n));let i=t.map(([m,d])=>({name:m,type:d})),s=new Map,a=this.createTargetFor(n,void 0,{constantFold:r?.constantFold,inputWrites:new Set,inputLocals:s}),l=a.var;a.var=m=>s.get(m)??l(m);let u=p.namingContext(a);for(let[m]of t)u.usedNames.add(m);for(let m of o??[])s.set(m,p.tempVar(a));let f=_i(a,i);p.beginRootPreprocessing(n,f);let c=p.withLocalShapeFrame(new Map,hi(i),()=>p.compileFunctionBody(Et(Ht(n,f,{scalarNames:new Set,localNames:new Set(i.map(m=>m.name))},ur),f,new Set([...i.map(m=>m.name),...wn(n).written])),f));if(oo("this function body",c,this.languageId),o===void 0&&a.inputWrites.size>0)return this.compileDeclaredFunctionBody(n,t,r,[...a.inputWrites]);if(s.size>0){let m={};p.withReferences(m,n,f),c=this.withInputLocalCopies(c,s,m.freeSymbolTypes)}return c}compile(n,t={}){let r=t.storage===void 0?void 0:wt(t.storage,[n],this.createTarget(),{vars:t.vars,functions:t.functions});try{return Qn(n,t.vars,()=>Ir(n,t,o=>this.compileOrThrow(o,t,r)))}catch(o){if(Nn(o,n.engine._deadlineFrame),t.fallback!==!0)throw o;let i=o.message;return console.warn(`Compilation fallback for "${n.operator}" (target: ${this.languageId}): ${i}`),p.buildInterpreterFallback(n,i,this.languageId,this.createTarget(),t.vars?new Set(Object.keys(t.vars)):void 0,cn(o,i))}}compileOrThrow(n,t={},r,o){let i=n;if(this.languageId!=="wgsl"){for(let[w,z]of r??[])if(z==="storage-buffer")throw new Error(`Could not compile \`${w}\`: the storage kind 'storage-buffer' of "${w}" is not supported on the ${this.languageId} target, because WebGL2 has no storage buffers. Compile to 'wgsl', or give "${w}" the storage kind 'sampler2D'.`)}n=fn(n);let s=Qa(void 0,t.functions),a,l=n,u=()=>a??=wn(l,t.vars),f=()=>u().all;t.vars!==void 0&&Pf(t.vars,()=>u().written,f);let c=w=>Ha(t.vars?.[w],/^[A-Za-z_][A-Za-z0-9_]*$/.test(w)?w:void 0,(z,G)=>zf(z,G,w,t.vars??{},f));n=_t(n,{skipHeads:s,iterationBudget:t.iterationBudget,readsLiveSource:c,unrollComprehensions:!0});let{functions:m,vars:d}=t,g=this.getFunctions(),_=this.getConstants(),x=this.languageId==="wgsl"?"vec2f":"vec2",v=new Map,E=this.createTargetFor(n,void 0,{inputWrites:new Set,inputLocals:v,varsKeys:d?new Set(Object.keys(d)):void 0,foldExcludedOps:m?new Set(Object.keys(m)):void 0,unrollSkipHeads:s,constantFold:t.constantFold,storage:r,storageBufferBindings:pl(t.storage),storageBuffersRead:new Map,mode:t.mode,functions:w=>{if(m&&Object.hasOwn(m,w)){let z=dl(m[w]);if(typeof z=="string")return z;if(typeof z=="function")return z.name||w}return g[w]},constant:w=>w==="ImaginaryUnit"?`${x}(0.0, 1.0)`:_[w],var:w=>{let z=v.get(w);if(z!==void 0)return z;if(d&&Object.hasOwn(d,w)){let G=d[w];return typeof G=="string"&&/^[A-Za-z_]\w*$/.test(G)&&je(G,this.languageId),G}if(w==="ImaginaryUnit")return`${x}(0.0, 1.0)`;if(w in _)return _[w]},naming:p.newNamingContext(n,[t.preamble,...d?Object.values(d):[]])});for(let w of o??[])v.set(w,p.tempVar(E));p.beginRootPreprocessing(n,E),n=Et(Ht(n,E,void 0,ur),E,u().written),n=_t(Wl(p.inlineCollectionValuedCallsAtRoot(n,E,"list<any>"),E,{isOverridden:w=>m!==void 0&&Object.hasOwn(m,w)||d!==void 0&&Object.hasOwn(d,w)}),{skipHeads:s,iterationBudget:t.iterationBudget,readsLiveSource:c,unrollComprehensions:!0,explicitPointNorm:w=>{let z=Tr(w,E);return typeof z=="string"?void 0:z}}),d&&(Rn(E).varNames=new Set(Object.keys(d)));let S={isOverriddenOperator:w=>m!==void 0&&Object.hasOwn(m,w),isStringVar:c,isVarsKey:w=>d!==void 0&&Object.hasOwn(d,w)};if(Pt(n,{...ht(n,{...S,admitPureUserFunctions:!0}),share:t.cse!==!1})>Me)throw new Error(`Could not compile: the ${this.languageId.toUpperCase()} code for this expression would have more than ${Me.toLocaleString("en-US")} nodes. A subexpression that several paths reach is written once for each path when the shader cannot compute it once: the paths go through different branches of an \`If\`, the subexpression reads a \`vars\` source that is not a variable or a field of a variable (\`u.c\`), it is not pure, or the \`cse\` option is false.`);p.openCseSession(n,E,{enabled:t.cse,...S}),Pu(n,E);let N=p.compileCseRoot(n,E,0,()=>p.compileFunctionBody(n,E));if(oo("this expression",N,this.languageId),o===void 0&&E.inputWrites.size>0)return this.compileOrThrow(i,t,r,[...E.inputWrites]);let I={target:this.languageId,success:!0,code:N},O=this.preambleFor(N);if(E.storageBufferBindings!==void 0){let w=Qu(`${N}
${O}`,E.storageBufferBindings,E.storageBuffersRead??new Map);w.layouts.length>0&&(I.storageBuffers=w.layouts,O=w.declarations+O)}O&&(I.preamble=O);let F=Fl(E,`${N}
${O??""}`);F.bounds.length>0&&(I.float32Bounds=F.bounds),F.warnings.length>0&&(I.warnings=F.warnings),p.withReferences(I,n,E,d?new Set(Object.keys(d)):void 0);for(let w of I.storageBuffers??[]){let z=I.freeSymbolTypes?.[w.symbol];z!==void 0&&(z.lowered=w.struct)}return v.size>0&&(I.code=this.withInputLocalCopies(I.code,v,I.freeSymbolTypes,w=>d!==void 0&&Object.hasOwn(d,w)?d[w]:w)),I}withInputLocalCopies(n,t,r,o=i=>i){let i=this.languageId==="wgsl",s=[...this.currentUserFunctions?.defs?.values()??[]].join(`
`),a=[];for(let[u,f]of t){if(new RegExp(`\\b${f}\\b`).test(s))throw new Error(`Could not compile \`Assign\`: the body writes "${u}", an input of the shader, and a user-defined function that the body calls reads "${u}". The body writes a local copy of the input, because the shader cannot write an input, and the function, which is declared outside the body, cannot read that local.`);let c=r?.[u]?.lowered;if(c===void 0)throw new Error(`Could not compile \`Assign\`: the body writes "${u}", an input of the shader, and the shader type of "${u}" is not known, so the local copy that the body writes cannot be declared.`);let m=i?ts(c):void 0;if(m!==void 0&&m>Vn)throw new Error(`Could not compile \`Assign\`: the body writes "${u}", an input of the shader, so it reads and writes a local copy of it, and the copy (\`${c}\`, ${m} bytes) is larger than the ${Vn} bytes of function-scope variables that WGSL guarantees per function. Write a new name instead of "${u}", or read "${u}" from a storage buffer (the storage kind 'storage-buffer'), which the body cannot write.`);let d=ru(n,f)?"":` = ${o(u)}`;a.push(i?`var ${f}: ${c}${d};`:`${c} ${f}${d};`)}let l=n;if(!l.includes(`
`)){let u=/^([A-Za-z_]\w*) = /.exec(l)?.[1];l=u!==void 0&&[...t.values()].includes(u)?`${l};
return ${u};`:`return ${l};`}return[...a,l].join(`
`)}preambleFor(n){let t=this.userFunctionDefs(n);t&&(n=`${n}
${t}`);let r="",o=this.languageId==="wgsl",i=Ff(n,this.languageId),s=!o&&i.includes("_gpu_inf(");s&&(r+=Ws),r+=i;let a=sf(n),l=Xu(n),u=lf(n),f=/_gpu_(hurwitz_)?zeta/.test(n),c=/_gpu_(lerch|poly_log)/.test(n),m=/_gpu_(di|tri|poly)gamma\(/.test(n);!o&&(n.includes("_gpu_nan")||a.length>0||l.length>0||u.length>0||f||c||m)&&(r+=Bf),!o&&!s&&(n.includes("_gpu_inf")||n.includes("_gpu_gamma")||/_gpu_ipi_\w+\(/.test(n)||n.includes("_gpu_tanpi")||f||c||m)&&(r+=Ws);for(let d of a)r+=ef(d,o);for(let[d,g]of l)r+=Zu(d,g,o);for(let d of u)r+=of(d);if(o)for(let[d,g]of uf(n))r+=af(d,g);if(o){let d=rf(n);for(let[g,_]of d.numbers)r+=nf(g,_);for(let[g,_,x]of d.points)r+=tf(g,_,x)}if(o){let d=ql(n);d&&(r+=d,n=`${n}
${d}`)}r+=Bu(n,o);for(let d of gf(n))r+=d==="scalar"?o?Ks:Ys:hf(d,o);if(r+=_e(n,o?os:rs),o&&(r+=_e(n,is)),r+=_e(n,o?ls:as),r+=_e(n,o?Hf:qf),r+=_e(n,o?Vf:Df),o||(r+=_e(n,Nl)),r+=_e(f||c?`${n} _gpu_gamma(`:n,o?bs:_s),r+=_e(n,o?vs:ys),r+=_e(c?`${n} _gpu_zeta_pow( _gpu_hurwitz_zeta(`:n,o?ws:xs),r+=_e(n,o?Es:$s),r+=_e(n,o?Ss:Cs),n.includes("_gpu_heaviside")&&(r+=this.languageId==="wgsl"?Ps:zs),n.includes("_gpu_sinc")&&(r+=this.languageId==="wgsl"?Ls:ks),n.includes("_gpu_fresnel")&&(r+=this.languageId==="wgsl"?Rs:As),n.includes("_gpu_fresnelC")&&(r+=this.languageId==="wgsl"?Gs:Ts),n.includes("_gpu_fresnelS")&&(r+=this.languageId==="wgsl"?Fs:Ns),r+=_e(n,o?Ms:Is),r+=_e(n,o?Us:Os),n.includes("_gpu_rnd_draw")){let d=[...new Set(n.match(new RegExp(`${it}\\d+`,"g"))??[])].sort((g,_)=>Number(g.slice(it.length))-Number(_.slice(it.length)));r+=`
`+d.map(g=>this.languageId==="wgsl"?`var<private> ${g}: u32 = 0u;
`:`uint ${g} = 0u;
`).join(""),r+=_e(n,o?Vs:Ds)}if(r+=_e(n,o?js:Bs),r+=_e(n,o?Hs:qs),r+=_e(n,o?Uf:Of),o){let d=`${r}
${n}`;/(?<![\w$])_gpu_inf\(/.test(d)&&(r=jf+r),/(?<![\w$])_gpu_nan\(/.test(d)&&(r=_r+r)}return t?r?`${r}
${t}`:t:r}compileToSource(n,t={}){if(n=fn(n),hn("compileToSource()",n,this.languageId),t.storage!==void 0&&Object.keys(t.storage).length>0)throw new Error("compileToSource() does not support the `storage` option: a sampler-backed read needs a helper declaration, and this route returns a bare expression with no preamble channel. Use `compile()`, whose result carries the preamble.");let r=this.createTargetFor(n,void 0,{userFunctions:void 0,constantFold:t.constantFold}),o=Et(n,r,wn(n).written);if(o!==n&&Pt(o,{...ht(o),share:!1})>Me)throw new Error(`Could not compile \`compileToSource()\`: the ${this.languageId.toUpperCase()} code would have more than ${Me.toLocaleString("en-US")} nodes. A subexpression that several paths reach is written once for each path on this route, which has no common-subexpression pass. Use \`compile()\`, or assign the subexpression to a variable of its own (\`Block\`).`);let i=p.compile(o,r);return Ii("compileToSource()",i,this.languageId),i}compileShaderBody(n,t,r=[],o,i=[],s=[],a){let l=this.languageId==="wgsl";if(t==="compute"&&n.length>0)throw new Error(`Could not compile the body statement "${n[0].variable}" of \`compileShader()\`: a compute shader from \`compileShader()\` cannot write a result. It has no outputs and no storage buffer, so the statement would assign a name that the shader does not declare. To compute values on the GPU, use \`compile()\` or \`WGSLTarget.compileFieldFunction()\`.`);let u=[...s,...l?[]:pf[t]??[]],f=n.map(w=>{let z=uu(w.variable,u,l);if("error"in z)throw new Error(`Could not compile the body statement "${w.variable}" of \`compileShader()\`: ${z.error}`);return z});n=n.map(w=>({...w,expression:fn(w.expression)}));let c=0;for(let w of n)c+=Pt(w.expression,{...ht(w.expression),share:!1});if(c>Me)throw new Error(`Could not compile \`compileShader()\`: the ${this.languageId.toUpperCase()} code of the body statements would have more than ${Me.toLocaleString("en-US")} nodes. A subexpression that several paths reach is written once for each path in a body statement. Assign the subexpression to a variable of its own (\`Block\`).`);let m=new Set;for(let w of r){if(m.has(w.name))throw new Error(`Could not compile: the shader declaration \`${w.name}\` is declared more than once (as an input and as a uniform): two storage classes cannot share one name, and a body referencing it names neither unambiguously. Rename one of them.`);m.add(w.name)}let d=[...r];if(!l)for(let w of[...s,...Object.entries(df[t]??{}).map(([z,G])=>({name:z,type:G}))])m.has(w.name)||(m.add(w.name),d.push({name:w.name,type:w.type}));let g=this.createTargetFor(n[0]?.expression,t,{constantFold:o,naming:p.newNamingContext(n.map(w=>w.expression),n.map(w=>w.variable))}),_=new Set,x=!1,v=g.var.bind(g);g.var=w=>{let z=v(w);return x&&z===void 0&&_.add(w),z};let E=_i(g,d),S=new Set([...d.map(w=>w.name),...i]),$=[],N=0;x=!0;let I=p.withLocalShapeFrame(new Map,hi(d),()=>n.map((w,z)=>{hn(`compileShader() body statement "${w.variable}"`,w.expression,this.languageId);let G=gi(w.expression,new Set(r.map(Z=>Z.name)));if(G!==void 0)throw new Error(`Could not compile the body statement "${w.variable}" of \`compileShader()\`: it assigns "${G}", a declared input or uniform of the shader, which is read-only in ${this.languageId.toUpperCase()}. Assign a local copy of it instead (\`Block(y \u2254 ${G}; y \u2254 y + 1; y)\`).`);p.beginRootPreprocessing(w.expression,E);let h=Et(Ht(w.expression,E,{scalarNames:new Set,localNames:S},ur),E,new Set([...S,...wn(w.expression).written]));if($[z]=h,N+=Pt(h,{...ht(h),share:!1}),N>Me)throw new Error(`Could not compile \`compileShader()\`: the ${this.languageId.toUpperCase()} code of the body statements would have more than ${Me.toLocaleString("en-US")} nodes. A subexpression that several paths reach is written once for each path in a body statement. Assign the subexpression to a variable of its own (\`Block\`).`);let L=p.compileStatementBody(h,E),{stmts:y}=L,{code:k}=L;Ii(`compileShader() body statement "${w.variable}"`,k,this.languageId);let A=f[z].type,R=h,T=C(R)?d.find(Z=>Z.name===R.symbol):void 0,U=T===void 0?void 0:Un(T.type),M=A!==void 0&&A.element!=="f"&&U!==void 0&&Bn(U),j=M?U:At(R,l),W=j===void 0?p.aggregateComponentCount(R):void 0,ue=Z=>`Could not compile the body statement "${w.variable}" of \`compileShader()\`: the value ${Z}, and the target "${w.variable}" has the type \`${Xt(A,l)}\`.`,ie=`${this.languageId.toUpperCase()} does not convert the one to the other in an assignment. Give the value the type of the target, or declare the output with the type of the value.`;if(A!==void 0&&W!==void 0&&W>0&&W!==A.width)throw new Error(`${ue(`has ${W} components`)} ${ie}`);if(M&&vi(U,A,a))k=T.ref??T.name;else if(A!==void 0&&j!==void 0&&(!("element"in j)||!vi(j,A,a))){let Z=`has the type \`${"element"in j?Xt(j,l):j.spelling}\``;throw"element"in j&&j.element==="f"&&A.element!=="f"?new Error(`${ue(Z)} \`compileShader()\` computes float values, and cannot assign an integer output. Declare the output with a float type (\`${Xt({element:"f",width:A.width},l)}\`).`):new Error(`${ue(Z)} ${ie}`)}let{base:K,letters:Q}=f[z];if(l&&K!==void 0&&Q!==void 0&&Q.length>1){if(j===void 0&&W===void 0)throw new Error(`Could not compile the body statement "${w.variable}" of \`compileShader()\`: the number of components of the value cannot be determined, and WGSL assigns a target of ${Q.length} components one component at a time. Assign the whole output, or one component in each statement (\`${K}.${Q[0]}\`).`);let Z=p.tempVar(E),H=[...Q].map((se,le)=>[`${K}.${se}`,`${Z}.${"xyzw"[le]}`]),[P,B]=H.pop();return{variable:P,code:B,stmts:[...y,`let ${Z} = ${k};`,...H.map(([se,le])=>`${se} = ${le};`)]}}return{variable:w.variable,code:k,stmts:y}}));x=!1;let O=new Set([...r.map(w=>w.name),...i]),F=new Set;for(let w of $)for(let z of p.analyzeReferences(w,E,O).freeSymbols)!O.has(z)&&!(this.languageId==="glsl"&&cf[t]?.has(z)===!0)&&_.has(z)&&F.add(z);if(F.size>0)throw new Error(`Could not compile \`compileShader()\`: the body reads ${[...F].map(w=>`"${w}"`).join(", ")}, which no input or uniform of the shader declares. The emitted ${this.languageId.toUpperCase()} would read an undeclared name. Declare each name as an input or a uniform, or assign it a value.`);return I}};function Zs(e,n,t="List"){at(t,e.length);let r=Tt(e);return r!==void 0?`vec${r}[${e.length}](${e.map(o=>n(o)).join(", ")})`:(sn(e,e.length>=2&&e.length<=4?`vec${e.length}`:"float[]"),e.length===2?`vec2(${e.map(o=>n(o)).join(", ")})`:e.length===3?`vec3(${e.map(o=>n(o)).join(", ")})`:e.length===4?`vec4(${e.map(o=>n(o)).join(", ")})`:`float[${e.length}](${e.map(o=>n(o)).join(", ")})`)}var Yf={__proto__:null,Inversesqrt:"inversesqrt",Mod:([e,n],t,r)=>{if(e===null||n===null)throw new Error("Could not compile `Mod`: missing argument");let o=()=>ne(n)===1?`fract(fract(${t(e)}))`:pr(e,n,t,r)??`mod(${t(e)}, ${t(n)})`;return St("Mod",e,ne(n)===1,t,r,V,o)??o()},List:(e,n)=>Zs(e,n,"List"),Matrix:(e,n)=>gr(e,n,t=>`vec${t}`,t=>`mat${t}`,t=>`float[${t}]`),Tuple:(e,n)=>Zs(e,n,"Tuple"),PointList:(e,n)=>(sn(e,e.length>=2&&e.length<=4?`vec${e.length}`:"float[]"),Zs(e,n,"PointList"))};pn(Yf.Mod,tt("fract",1,1));var Ad={scalarGenTypeSlots:new Map([["min",new Set([1])],["max",new Set([1])],["clamp",new Set([1,2])],["mix",new Set([2])],["step",new Set([0])],["smoothstep",new Set([0,1])],["mod",new Set([1])],["refract",new Set([2])]]),mandatoryScalarSlots:new Map([["refract",new Set([2])]]),vectorOnlySlots:new Map([["cross",new Set([0,1])]]),matrixArithmetic:()=>!0,matrixNegate:!0},Wf=class extends lt{languageId="glsl";getLanguageSpecificFunctions(){return Yf}getShapeRules(){return Ad}compileFunction(n,t,r,o,i){hn("compileFunction()",n,this.languageId);let s=this.compileDeclaredFunctionBody(n,o,i),a=o.map(([f,c])=>`${c} ${f}`).join(", "),l=this.preambleFor(s),u=l?`${l}
`:"";if(s.includes(`
`)){let f=s.split(`
`).map(c=>`  ${c}`).join(`
`);return`${u}${r} ${t}(${a}) {
${f}
}`}return`${u}${r} ${t}(${a}) {
  return ${s};
}`}compileShader(n){let{type:t,version:r="300 es",inputs:o=[],outputs:i=[],uniforms:s=[],body:a,constantFold:l}=n;if(t!=="vertex"&&t!=="fragment")throw new Error(`Could not compile \`compileShader()\`: the GLSL target writes only vertex and fragment shaders, not a "${String(t)}" shader. GLSL ES 3.00 (WebGL 2) has no compute stage. For a compute shader, use the WGSL target.`);let u=Number.parseInt(r,10);if(!Number.isFinite(u)||u<300)throw new Error(`GLSL version "${r}" is not supported: ES 3.00+ (or desktop 3.30+) is required`);let f=`#version ${r}

`;t==="fragment"&&(f+=`precision highp float;
precision highp int;

`);for(let d of o)f+=`in ${d.type} ${d.name};
`;o.length>0&&(f+=`
`);for(let d of i)f+=`out ${d.type} ${d.name};
`;i.length>0&&(f+=`
`);for(let d of s)f+=`uniform ${d.type} ${d.name};
`;s.length>0&&(f+=`
`);let c=this.compileShaderBody(a,t,[...o,...s],l,i.map(d=>d.name),i,/es/i.test(r)?void 0:u),m=this.preambleFor(c.map(d=>[...d.stmts,d.code].join(`
`)).join(`
`));m&&(f+=`${m}
`),f+=`void main() {
`;for(let d of c){for(let g of d.stmts)f+=g.split(`
`).map(_=>`  ${_}
`).join("");f+=`  ${d.variable} = ${d.code};
`}return f+=`}
`,f}};var xo=1024,Kf=65536,Zf=/^[A-Za-z][A-Za-z0-9_]*$/;function ut(e){throw new Error(`Invalid option of compileFieldFunction(): ${e}`)}function Pe(e){return{success:!1,diagnostic:e,function:"",helpers:{},paramsStructSource:"",params:[],paramsSize:0}}var Rd=`A parameter of a field function is a real or integer scalar, a point (a tuple of 2, 3 or 4 real numbers), or a numeric list of known length with at most ${xo} elements, in the uniform parameter struct. A list of numbers or points of unknown length, or with more than ${xo} elements, can be read from a storage buffer instead: \`storage: { <name>: { kind: 'storage-buffer', group, binding } }\`. A storage buffer cannot hold complex numbers, text, booleans or lists of lists either.`;function ze(e,n){return Pe({code:"unsupported-parameter",kind:"capability",message:`Could not compile with \`compileFieldFunction()\`: the parameter "${e}" ${n}. ${Rd}`,binding:e})}function Jf(e,n,t){return`_gpu_pat${t}_${e.length}_${e}_${n}`}function Td(e,n,t){let{guard:r,doc:o}=kn(t,"wgsl","_gpu_i"),i=Y(t,"wgsl");return`fn ${Jf(e,n,t)}(_gpu_i: f32) -> f32 {
${o}
  if (${r}) {
    return _gpu_nan();
  }
  let _gpu_s = select(${i} + _gpu_i, _gpu_i - 1.0, _gpu_i > 0.0);
  let _gpu_e = floor(_gpu_s / 4.0);
  return ${e}.${n}[i32(_gpu_e)][i32(_gpu_s - 4.0 * _gpu_e)];
}
`}function Gd(e){let n=new Map,t=0,r="",o=e.length;for(;t<o;){for(;t<o&&/\s/.test(e[t]);)t++;if(t>=o)break;if(e.startsWith("//",t)){let f=e.indexOf(`
`,t),c=f<0?o:f+1;r+=e.slice(t,c),t=c;continue}let i=t,s=0,a=!1;for(;t<o;t++){if(e.startsWith("//",t)){let c=e.indexOf(`
`,t);t=c<0?o-1:c;continue}let f=e[t];if(f==="{")s++,a=!0;else if(f==="}"){if(s--,s===0&&a){t++;break}}else if(f===";"&&s===0&&!a){t++;break}}let l=e.slice(i,t),u=/^(?:@\w+(?:\([^)]*\))?\s+)*(?:fn|struct|const|override|alias|var(?:<[^>]*>)?)\s+([A-Za-z_]\w*)/.exec(l);if(u===null)throw new Error(`Internal: compileFieldFunction() cannot read the helper text \`${l.slice(0,60)}\``);n.set(u[1],`${r}${l.trim()}
`),r=""}return n}function Qf(e){if(typeof e=="string"||e.kind!=="tuple")return;let n=e.elements.length;if(!(n<2||n>4))return e.elements.every(t=>q(t.type,"number")&&!Ve(t.type)&&!q(t.type,"nan"))?n:void 0}function Nd(e,n){let t=new Set,r=o=>{if(t.has(o))return!0;if(t.add(o),C(o)){let s=e.lookupDefinition(o.symbol);return Fe(s)&&s.value.isConstant===!0}if(!b(o))return!0;let i;try{i=p.userFunctionLiteral(e,o.operator)}catch{return!1}return i===void 0&&o.ops.every(r)};return r(n)}function Fd(e,n){let t=e.lookupDefinition(n);if(t!==void 0&&"operator"in t)return t.operator;if(Fe(t))return t.value}function Id(e,n){if(e.lookupDefinition(n)!==void 0)return n;let t=/^(.+?)(?:User|Copy)\d*$/.exec(n);return t!==null&&e.lookupDefinition(t[1])!==void 0?t[1]:n}function Md(e,n,t,r){let o=l=>{let u=e.lookupDefinition(l);return Fe(u)?u.value.type.type:void 0},i=(l,u=new Set)=>{if(u.has(l))return[];if(u.add(l),Object.hasOwn(n,l)){let c=r.get(l),m=o(l);return c!==void 0&&m!==void 0&&!q(m,c)?[l]:[]}let f=t.inlined.get(l);return f===void 0?[]:f.reads.flatMap(c=>i(c,u))},s=l=>`Declare ${l.map(u=>`"${u}" (\`ce.declare('${u}', '${e.box(u).type}')\`)`).join(" and ")} before its first assignment`,a=l=>l.map(u=>`"${u}"`).join(" and ");for(let[l,u]of t.functions)for(let f of Ta(u)){let c=i(f.name);if(c.length===0)continue;let m=Id(e,l),d=c.length===1&&c[0]===f.name?`the parameter "${f.name}"`:`"${f.name}", whose value reads the parameter${c.length>1?"s":""} ${a(c)}`;throw new Error(`Could not compile with \`compileFieldFunction()\`: the user-defined function "${m}" reads ${d}, and the body of "${m}" was typed when "${f.name}" had the type \`${f.before.toString()}\`. A field function reads ${a(c)} from the buffer with no fact of the value (as \`${f.now.toString()}\` for "${f.name}"), so the types that the callers of "${m}" read are outdated. ${s(c)} and before "${m}" is defined.`)}for(let[l,{value:u}]of t.inlined){let f=e.lookupDefinition(l);if(!Fe(f))continue;let c=f.value.type;if(c.isUnknown||q(u.type.type,c.type))continue;let m=i(l);if(m.length===0)continue;let d=f.value.inferredType,g=C(u)&&m.length===1?`Declare "${m[0]}" (\`ce.declare('${m[0]}', '${c.toString()}')\`) before its first assignment`:`Declare ${a(m)} before the first assignment with types for which the value of "${l}" is a \`${c.toString()}\``;throw new Error(`Could not compile with \`compileFieldFunction()\`: the value of "${l}" is compiled in place, and "${l}" has the ${d?"inferred":"declared"} type \`${c.toString()}\`. A field function reads ${a(m)} from the buffer with no fact of the value, and the value of "${l}" then has the type \`${u.type.toString()}\`. `+(d?`${s(m)}.`:`${g}, or declare "${l}" as \`${u.type.toString()}\`.`))}}function Xs(e,n){return Math.ceil(n/e)*e}function Od(e,n,t){let r=[];try{for(let o of n){let i=e.lookupDefinition(o);if(!Fe(i))continue;let s=i.value;if(s.isConstant||!s.inferredType)continue;let a=s.storedValue;if(a===void 0||a.operator==="Function")continue;let l=Gn(a.type.type),u=typeof l!="string"&&l.kind==="list"&&l.dimensions?.length===1?l.dimensions[0]:void 0,f=Qf(l),c=a.type.matches("real")?"real":u!==void 0&&u>0&&a.type.matches("list<real>")?`list<real^${u}>`:f!==void 0?`tuple<${Array(f).fill("real").join(", ")}>`:a.type.type;r.push({def:s,snapshot:s._checkpointSnapshot()}),s.value=void 0,s.type=e.type(c)}return t()}finally{for(let{def:o,snapshot:i}of r.reverse())o._restoreCheckpointSnapshot(i);r.length>0&&(e._noteStateEvent({kind:"value-write",ephemeral:!1,callable:!1}),e._noteStateEvent({kind:"type-write",callableBefore:!1,callableAfter:!1}))}}function Xf(e){let n=new Set,t=/^\s*(?:\/\/[^\n]*\n\s*)*fn\s+\w+\s*\(([^)]*)\)/.exec(e);for(let r of(t?.[1]??"").matchAll(/([A-Za-z_]\w*)\s*:/g))n.add(r[1]);for(let r of e.matchAll(/\b(?:let|var)\s+([A-Za-z_]\w*)/g))n.add(r[1]);return n}function Ud(e){let n=new Set,t=new Set,r=o=>{if(!(!b(o)||t.has(o))&&(t.add(o),o.operator!=="Function")){o.operator==="Assign"&&C(o.ops[0])&&n.add(o.ops[0].symbol);for(let i of o.ops)r(i)}};return r(e),n}function ec(e,n,t){let{name:r,coordinates:o,paramsStruct:i="CEParams",paramsVariable:s="ce_params",storage:a,constantFold:l}=t,u=[["name",r],["paramsStruct",i],["paramsVariable",s]];Array.isArray(o)||ut("`coordinates` must be an array of symbol names"),o.forEach((P,B)=>u.push([`coordinates[${B}]`,P]));let f=new Set;for(let[P,B]of u)(typeof B!="string"||!Zf.test(B))&&ut(`\`${P}\` must be a WGSL identifier that starts with a letter, not ${JSON.stringify(B)}`),je(B,"wgsl"),lo.has(B)&&ut(`\`${P}\` is "${B}", a predeclared function or type of WGSL, which a declaration of that name would hide`),B.startsWith("CE_List_")&&ut(`\`${P}\` is "${B}", which starts with \`CE_List_\`, the prefix of the struct names that the compilation declares for its storage buffers`),f.has(B)&&ut(`the name "${B}" is used for two of the declared names`),f.add(B);let c=new Set(o),m={};for(let P of o)m[P]=P;let d=wt(a,[n],e.createTarget(),{vars:m});for(let P of d?.keys()??[])c.has(P)&&ut(`the storage hint names the coordinate "${P}"`),f.has(P)&&ut(`the storage hint names "${P}", which is a declared name`);let g=n.engine,_;try{_=e.bodyShape(n)}catch(P){return Nn(P,g._deadlineFrame),Pe(cn(P))}let x;try{x=Ir(n,{vars:m},P=>{let B=wn(P,m),se=[],le=new Map;for(let J of B.all){if(c.has(J)||d?.has(J))continue;let me=g.lookupDefinition(J);if(!Fe(me)||me.value.isConstant)continue;let ke=me.value.value;ke===void 0||b(ke,"Function")||ke.type.matches("function")||(Nd(g,ke)?se.push(J):le.set(J,ke))}let oe=e.createTarget(),Ge={...oe,userFunctions:oe.userFunctions??{defs:new Map,compiling:new Set}},Ne=new Map,Ot=new Set([...o,...se,...le.keys()]),_n=[],Kn=p.analyzeReferences(P,Ge,Ot,Ne).freeSymbols,bn=new Set,Zn=[],$r=J=>{bn.has(J)||(bn.add(J),Zn.push(J))},Ut=new Set;for(;Kn.length>0;){let J=Kn.pop(),me=le.get(J);if(me===void 0){_n.includes(J)||_n.push(J);continue}Ut.has(J)||(Ut.add(J),$r(J),Kn.push(...p.analyzeReferences(me,Ge,Ot,Ne).freeSymbols))}let xp=new Map(_n.map(J=>[J,(Ne.get(J)??g.symbol(J)).type])),ha=[],ga=[],No,_a=(J,me,ke)=>{for(let yn of p.analyzeReferences(J,oe,new Set([...o,...le.keys()])).freeSymbols){c.has(yn)&&me.add(yn);let Cr=le.get(yn);Cr!==void 0&&!ke.has(yn)&&(ke.add(yn),$r(yn),_a(Cr,me,ke))}},ba=new Set,ya=J=>{if(ba.has(J))return;ba.add(J);let me=p.userFunctionLiteral(g,J);if(me===void 0)return;No===void 0&&wn(me,m).written.has(s)&&(No=J);let ke=Fd(g,J);ke!==void 0&&ga.push([J,ke]);let yn=new Set;_a(me,yn,new Set);for(let Cr of yn)ha.push([J,Cr]);Er(me)},va=new Set,Er=J=>{if(!va.has(J)){if(va.add(J),C(J))ya(J.symbol);else if(b(J)){ya(J.operator);for(let me of J.ops)Er(me)}}};for(Er(P);Zn.length>0;)Er(le.get(Zn.pop()));let wp=new Map([...bn].map(J=>{let me=le.get(J),ke=p.analyzeReferences(me,oe,Ot).freeSymbols;return[J,{value:me,reads:ke}]}));return{free:_n,types:xp,assigned:Ud(P),captures:ha,functions:ga,inlined:wp,written:B.written,declaring:No}})}catch(P){return Nn(P,g._deadlineFrame),Pe(cn(P))}for(let P of x.assigned)if(c.has(P)||x.free.includes(P)&&!d?.has(P))return Pe({code:"unsupported-parameter",kind:"capability",message:`Could not compile with \`compileFieldFunction()\`: the body assigns "${P}", which is ${c.has(P)?"a coordinate":"a parameter"} of the field function, and a field function cannot write its inputs. Declare a local first (\`Declare(${P}, "real")\`), or assign another name.`,binding:P});let v=x.captures[0];if(v!==void 0){let[P,B]=v;return Pe({code:"unsupported-parameter",kind:"capability",message:`Could not compile with \`compileFieldFunction()\`: the user-defined function "${P}" reads the coordinate "${B}", which it does not take as a parameter. A coordinate is an argument of the field function, and a user-defined function is declared outside it. Pass "${B}" to the function as an argument.`,binding:B})}let E=[],S=new Map,$=new Map;for(let P of[...x.free].sort()){if(c.has(P)||d?.has(P))continue;if(!Zf.test(P))return ze(P,"is not a WGSL identifier, so it cannot be a field of the parameter struct");try{je(P,"wgsl")}catch{return ze(P,"is a reserved word of WGSL")}let B=x.types.get(P),se=Gn(B.type);if(typeof se!="string"&&se.kind==="list"){let oe=B.toString(),Ge=se.dimensions;if(Ge==null||Ge.length!==1)return ze(P,`has the type \`${oe}\`, a list with no known length or with more than one axis`);let Ne=Ge[0];if(Ne<1)return ze(P,`has the type \`${oe}\`, a list with no known length or with no element`);if(Ne>xo)return ze(P,`is a list of ${Ne} elements, more than the limit of ${xo} of the parameter struct`);if(!B.matches("list<real>")&&!B.matches("list<number>"))return ze(P,`has the type \`${oe}\`, and only a list of real numbers can be a field of the parameter struct`);if(Ve(se.elements))return ze(P,`has the type \`${oe}\`, a list of complex numbers`);$.set(P,{n:Ne,ceType:oe});continue}let le=on(B.type);if(le!==void 0)return ze(P,`has the type \`${B.toString()}\`, which admits a point and a list of points, and a field of the parameter struct has one fixed type. Declare "${P}" as a point (\`${Ft(P,le.arity)}\`)`);if(typeof se!="string"&&se.kind==="tuple"){let oe=Qf(se);if(oe===void 0)return ze(P,`has the type \`${B.toString()}\`, and only a point of 2, 3 or 4 real numbers (a tuple such as \`tuple<real, real>\` or \`tuple<number, number, number>\`, with no complex or \`NaN\` component) can be a field of the parameter struct`);S.set(P,oe);continue}if(B.matches("boolean"))return ze(P,"is a boolean");if(B.matches("string")||B.matches("character"))return ze(P,"is text");if(typeof se!="string"&&Ve(se)||Ve(B.type))return ze(P,"is a complex number");E.push(P)}if(E.length+S.size+$.size>0&&x.written.has(s))return Pe({code:"unsupported-parameter",kind:"capability",message:x.declaring!==void 0?`Could not compile with \`compileFieldFunction()\`: a user-defined function that the expression calls declares "${s}", the name of the parameter struct variable, which hides the struct in its body. Choose another \`paramsVariable\`.`:`Could not compile with \`compileFieldFunction()\`: the body declares "${s}", the name of the parameter struct variable. Choose another \`paramsVariable\`.`,binding:s});for(let P of[...E,...S.keys(),...$.keys()])m[P]=`${s}.${P}`;let N=new Map,I={storage:new Map([...$.keys()].map(P=>[P,"uniform-struct"])),storageRead:(P,B,se)=>{let le=$.get(P);if(le===void 0||le.n!==B)throw new Error(`Could not compile with \`compileFieldFunction()\`: the list parameter "${P}" is read as a list of ${B} elements, but its field in the parameter struct has ${le?.n??"no"} elements.`);let oe=Jf(s,P,B);return N.has(oe)||N.set(oe,Td(s,P,B)),`${oe}(${se})`},hostInputVars:new Set([...E,...S.keys()]),onReturn:P=>{let B=P===void 0?void 0:pe(P,!0);if(B!=="f32")throw new Error("Could not compile with `compileFieldFunction()`: a `Return` in the body yields "+(B===void 0?"a value with no static WGSL type":`a \`${B}\` value`)+", and a field function returns a real scalar (`f32`).")}},O,F,w,z=new Map;for(let P of Object.keys(m)){let B=g.lookupDefinition(P);Fe(B)&&z.set(P,B.value.type.type)}try{O=Qn(n,m,()=>Od(g,Object.keys(m),()=>{Md(g,m,x,z);let P=e.withTargetExtension(I,()=>e.compile(n,{vars:m,storage:a,constantFold:l,fallback:!1}));return w=pe(n,!0),P})),F=e.emittedUserFunctionNames(),O.success&&e.assertBody(n,O.code,_)}catch(P){return Nn(P,g._deadlineFrame),Pe(cn(P))}if(!O.success)return Pe(O.diagnostic??cn(O.error??"Compilation failed"));if(w!=="f32")return Pe({code:"unsupported-result",kind:"capability",message:"Could not compile with `compileFieldFunction()`: the value of the expression "+(w===void 0?"has no static WGSL type":`has the WGSL type \`${w}\``)+", and a field function returns a real scalar (`f32`)."});for(let P of O.freeSymbols??[])if(!c.has(P)&&!d?.has(P)&&!Object.hasOwn(m,P))return Pe({code:"compile-error",kind:"capability",message:`Could not compile with \`compileFieldFunction()\`: the compiled code reads "${P}", which is not a coordinate, a parameter or a storage binding of the field function.`,binding:P});let G=P=>O.freeSymbolTypes?.[P]?.lowered;for(let P of o){let B=G(P);if(B!==void 0&&B!=="f32")return Pe({code:"unsupported-parameter",kind:"capability",message:`Could not compile with \`compileFieldFunction()\`: the coordinate "${P}" is read as \`${B}\`, and a coordinate is an \`f32\` argument.`,binding:P})}for(let P of E){let B=G(P);if(B!==void 0&&B!=="f32")return ze(P,`is read as \`${B}\``)}for(let[P,B]of S){let se=G(P);if(se!==void 0&&se!==`vec${B}f`)return ze(P,`is a point of ${B} components read as \`${se}\``)}let h=new Set(O.freeSymbols??[]),L=[],y=0;for(let P of E)h.has(P)&&(L.push({name:P,ceType:x.types.get(P).toString(),wgslType:"f32",offset:y,size:4}),y+=4);for(let[P,B]of S)h.has(P)&&(y=Xs(B===2?8:16,y),L.push({name:P,ceType:x.types.get(P).toString(),wgslType:`vec${B}f`,offset:y,size:4*B}),y+=4*B);for(let[P,{n:B,ceType:se}]of $){if(!h.has(P))continue;let le=Math.ceil(B/4);y=Xs(16,y),L.push({name:P,ceType:se,wgslType:`array<vec4f, ${le}>`,offset:y,size:16*le,length:B}),y+=16*le}let k=Xs(16,y);if(k>Kf)return Pe({code:"unsupported-parameter",kind:"capability",message:`Could not compile with \`compileFieldFunction()\`: the parameter struct takes ${k} bytes, more than the ${Kf} bytes of a uniform buffer binding that WebGPU guarantees (\`maxUniformBufferBindingSize\`). Read the largest lists from storage buffers instead: \`storage: { <name>: { kind: 'storage-buffer', group, binding } }\`.`});let A=L.length===0?"":`struct ${i} {
${L.map(P=>`  ${P.name}: ${P.wgslType},
`).join("")}}
`,R=new Map;for(let P of F){let B=/^(_[A-Za-z]+)(.*)$/.exec(P);if(B===null)return Pe(cn(`Internal: compileFieldFunction() cannot rename the function "${P}"`));R.set(P,`${B[1]}_${r.length}_${r}${B[2]}`)}let T=R.size===0?void 0:new RegExp(`(?<![\\w$.])(${[...R.keys()].sort((P,B)=>B.length-P.length).join("|")})(?![\\w$])`,"g"),U=P=>T===void 0?P:P.replace(T,B=>R.get(B)??B),M={};for(let[P,B]of Gd(U(O.preamble??"")))M[P]=B;let j=new Set(R.values()),W=U(O.code);for(let P of j){let B=M[P];if(B!==void 0&&Xf(B).has(s))return Pe({code:"unsupported-parameter",kind:"capability",message:`Could not compile with \`compileFieldFunction()\`: a user-defined function that the expression calls declares "${s}", the name of the parameter struct variable, which hides the struct in its body. Choose another \`paramsVariable\`.`,binding:s})}if(Xf(`fn _f() {
${W}
}`).has(s))return Pe({code:"unsupported-parameter",kind:"capability",message:`Could not compile with \`compileFieldFunction()\`: the body declares "${s}", the name of the parameter struct variable. Choose another \`paramsVariable\`.`,binding:s});let ie=[...Object.keys(M).filter(P=>new RegExp(`^${it}\\d+$`).test(P)).map(P=>`${P} = 0u;`),...W.includes(`
`)?W.split(`
`):[`return ${W};`]],K=o.map(P=>`${P}: f32`).join(", "),Q=ie.map(P=>`  ${P}`).join(`
`),Z=`fn ${r}(${K}) -> f32 {
${Q}
}
`;for(let[P,B]of N)M[P]=B;N.size>0&&M._gpu_nan===void 0&&(M._gpu_nan=`${_r.trim()}
`);let H={success:!0,function:Z,helpers:M,paramsStructSource:A,params:L,paramsSize:k};return O.warnings!==void 0&&(H.warnings=O.warnings),O.storageBuffers!==void 0&&(H.storageBuffers=O.storageBuffers),H}function Js(e,n,t="List"){at(t,e.length);let r=Tt(e);return r!==void 0?`array<vec${r}f, ${e.length}>(${e.map(o=>n(o)).join(", ")})`:(sn(e,e.length>=2&&e.length<=4?`vec${e.length}f`:"array<f32>"),e.length===2?`vec2f(${e.map(o=>n(o)).join(", ")})`:e.length===3?`vec3f(${e.map(o=>n(o)).join(", ")})`:e.length===4?`vec4f(${e.map(o=>n(o)).join(", ")})`:`array<f32, ${e.length}>(${e.map(o=>n(o)).join(", ")})`)}var sc={__proto__:null,Inversesqrt:"inverseSqrt",Mod:([e,n],t,r)=>{if(e===null||n===null)throw new Error("Could not compile `Mod`: missing argument");let o=()=>{if(ne(n)===1)return`fract(fract(${t(e)}))`;let i=pr(e,n,t,r);if(i!==void 0)return i;if(p.foldValueImpure(e)||p.foldValueImpure(n))throw new Error("Could not compile `Mod`: an impure (Random) operand of this shape would be drawn more than once \u2014 a repeated draw would shift every later value in the shader.");let s=`(${t(e)})`,a=`(${t(n)})`,l=`(sign(${s} % ${a}) * sign(${a}))`;return`(((${s} % ${a}) - ${a} * ((${l} - abs(${l})) * 0.5)) % ${a})`};return St("Mod",e,ne(n)===1,t,r,V,o)??o()},Hypot:([e,n],t)=>{if(e===null||n===null)throw new Error("Could not compile `Hypot`: need two arguments");return`length(vec2f(${t(e)}, ${t(n)}))`},List:(e,n)=>Js(e,n,"List"),Matrix:(e,n)=>gr(e,n,t=>`vec${t}f`,t=>`mat${t}x${t}f`,t=>`array<f32, ${t}>`),Tuple:(e,n)=>Js(e,n,"Tuple"),PointList:(e,n)=>(sn(e,e.length>=2&&e.length<=4?`vec${e.length}f`:"array<f32>"),Js(e,n,"PointList"))};pn(sc.Mod,tt("fract",1,1));var Bd={float:"f32",int:"i32",uint:"u32",bool:"bool",vec2:"vec2f",vec3:"vec3f",vec4:"vec4f",ivec2:"vec2i",ivec3:"vec3i",ivec4:"vec4i",uvec2:"vec2u",uvec3:"vec3u",uvec4:"vec4u",bvec2:"vec2<bool>",bvec3:"vec3<bool>",bvec4:"vec4<bool>",mat2:"mat2x2f",mat3:"mat3x3f",mat4:"mat4x4f"};function Hn(e){return Bd[e]??e}function nc(e,n){return e&&/^(i32|u32|vec[234][iu]|vec[234]<[iu]32>)$/.test(Hn(n.replace(/\s+/g,"")))?" @interpolate(flat)":""}function tc(e,n){let t=new Map,r=(o,i)=>`${o??0}:${i}`;for(let o of n){if(o.slot===void 0)continue;let i=r(o.key,o.slot),s=t.get(i);if(s!==void 0)throw new Error(`Could not compile \`compileShader()\`: "${s}" and "${o.name}" have the same ${e} (${o.key===void 0?"":`group ${o.key}, `}${o.slot}). WGSL refuses two declarations at one ${e}. Give each one its own ${e}, or leave it out to get a free one.`);t.set(i,o.name)}return n.map(o=>{if(o.slot!==void 0)return o.slot;let i=0;for(;t.has(r(o.key,i));)i+=1;return t.set(r(o.key,i),o.name),i})}function ac(e,n){if(!b(e))return;if(e.operator==="Assign"&&C(e.ops[0])&&n.has(e.ops[0].symbol))return e.ops[0].symbol;let t=n;for(let r of e.ops){let o=ac(r,t);if(o!==void 0)return o;if(e.operator==="Block"&&b(r,"Declare")&&C(r.ops[0])&&t.has(r.ops[0].symbol)){let i=new Set(t);i.delete(r.ops[0].symbol),t=i}}}var jd={scalarGenTypeSlots:new Map([["mix",new Set([2])],["refract",new Set([2])]]),mandatoryScalarSlots:new Map([["refract",new Set([2])]]),vectorOnlySlots:new Map([["cross",new Set([0,1])],["dot",new Set([0,1])],["faceForward",new Set([0,1,2])],["normalize",new Set([0])],["reflect",new Set([0,1])],["refract",new Set([0,1])]]),matrixArithmetic:(e,n)=>e==="*"||n&&(e==="+"||e==="-"),matrixNegate:!1};function lc(e){if(!b(e,"Block")||e.nops===0)return!1;let n=e.ops[e.nops-1];return b(n,"Block")?vt(n)||lc(n):!1}function rc(e,n){let t=vt(n),r=!t&&lc(n);return!t&&!r&&hn(e,n,"wgsl"),{tailAssignment:t,nestedTailAssignment:r}}function oc(e,n,t,r){let o=t.split(`
`);if(r.tailAssignment){let i=/^return\s+([^\s;]+);?$/.exec(o[o.length-1]);(o.length<2||i===null||!o[o.length-2].startsWith(`${i[1]} = `))&&hn(e,n,"wgsl")}r.nestedTailAssignment&&(o.length<2||!/^return\s+[A-Za-z_]\w*;?$/.test(o[o.length-1]))&&hn(e,n,"wgsl")}var ic=class extends lt{languageId="wgsl";getLanguageSpecificFunctions(){return sc}getShapeRules(){return jd}compileFieldFunction(n,t){return ec({compile:(r,o)=>this.compile(r,o),createTarget:()=>this.createTarget(),withTargetExtension:(r,o)=>this.withTargetExtension(r,o),emittedUserFunctionNames:()=>this.emittedUserFunctionNames(),bodyShape:r=>rc("compileFieldFunction()",r),assertBody:(r,o,i)=>oc("compileFieldFunction()",r,o,i)},n,t)}compileFunction(n,t,r,o,i){let s=rc("compileFunction()",n),a=ac(n,new Set(o.map(([m])=>m)));if(a!==void 0)throw new Error(`Could not compile with \`compileFunction()\`: the body assigns the parameter "${a}", and a WGSL function parameter is an immutable value. Assign a local copy of it instead (\`Block(y \u2254 ${a}; y \u2254 y + 1; y)\`).`);let l=this.compileDeclaredFunctionBody(n,o,i);oc("compileFunction()",n,l,s);let u=o.map(([m,d])=>`${m}: ${Hn(d)}`).join(", "),f=this.preambleFor(l),c=f?`${f}
`:"";if(l.includes(`
`)){let m=l.split(`
`).map(d=>`  ${d}`).join(`
`);return`${c}fn ${t}(${u}) -> ${Hn(r)} {
${m}
}`}return`${c}fn ${t}(${u}) -> ${Hn(r)} {
  return ${l};
}`}declareGPUFunction(n,t,r,o){let i=o.split(`
`).map(s=>s.trimStart());for(let[s]of r)if(i.some(a=>a.startsWith(`${s} = `)))throw new Error(`Could not compile \`${n}\`: the body assigns the parameter "${s}", and a WGSL function parameter is an immutable value. Assign a local copy of it instead (\`Block(y \u2254 ${s}; y \u2254 y + 1; y)\`).`);return super.declareGPUFunction(n,t,r,o)}compileShader(n){let{type:t,inputs:r=[],outputs:o=[],uniforms:i=[],workgroupSize:s,body:a,constantFold:l}=n;if(t==="compute"){if(o.length>0)throw new Error("Could not compile `compileShader()`: a WGSL compute shader has no stage outputs, and its entry point cannot return a value. Remove the `outputs` option.");let F=r.filter(w=>!w.builtin).map(w=>w.name);if(F.length>0)throw new Error(`Could not compile \`compileShader()\`: these compute shader inputs have no \`builtin\`: ${F.map(w=>`"${w}"`).join(", ")}. A compute shader input must be a built-in value (\`global_invocation_id\`, \`local_invocation_id\`, ...); pass other values as uniforms.`)}for(let[F,w]of[["uniform",i],["input",r.filter(z=>!z.builtin)],["output",o.filter(z=>!z.builtin)]]){let z=w.filter(G=>/\bbool\b/.test(Hn(G.type))).map(G=>`"${G.name}"`);if(z.length>0)throw new Error(`Could not compile \`compileShader()\`: the ${F} ${z.join(", ")} has a boolean type, which WGSL does not allow for a ${F}. Use \`u32\` (or \`uint\`) with 0 and 1.`)}let u=F=>{let w=F.filter(G=>!G.builtin),z=tc("location",w.map(G=>({name:G.name,slot:G.location})));return new Map(w.map((G,h)=>[G.name,z[h]]))},f=u(r),c=u(o),m=tc("binding",i.map(F=>({name:F.name,slot:F.binding,key:F.group??0}))),d="",g=`${t[0].toUpperCase()}${t.slice(1)}Input`;if(r.length>0){d+=`struct ${g} {
`;for(let F of r){let w=F.builtin?`@builtin(${F.builtin})`:`@location(${f.get(F.name)})${nc(t==="fragment",F.type)}`;d+=`  ${w} ${F.name}: ${Hn(F.type)},
`}d+=`};

`}if(o.length>0){d+=`struct ${t==="vertex"?"VertexOutput":"FragmentOutput"} {
`;for(let w of o){let z=w.builtin?`@builtin(${w.builtin})`:`@location(${c.get(w.name)})${nc(t==="vertex",w.type)}`;d+=`  ${z} ${w.name}: ${Hn(w.type)},
`}d+=`};

`}for(let[F,w]of i.entries()){let z=w.group??0,G=m[F];d+=`@group(${z}) @binding(${G}) var<uniform> ${w.name}: ${Hn(w.type)};
`}i.length>0&&(d+=`
`);let _=`@${t}`,x=t==="compute"&&s?`@workgroup_size(${s.join(", ")})
`:"",v=r.length>0,E=o.length>0,S=t==="vertex"?"VertexOutput":"FragmentOutput",$=v?`input: ${g}`:"",N=E?` -> ${S}`:"",I=this.compileShaderBody(a,t,[...r.map(F=>({name:F.name,type:F.type,ref:`input.${F.name}`})),...i],l,[],o.map(F=>({name:`output.${F.name}`,type:F.type}))),O=this.preambleFor(I.map(F=>[...F.stmts,F.code].join(`
`)).join(`
`));O&&(d+=`${O}
`),d+=`${_}
${x}fn main(${$})${N} {
`,E&&(d+=`  var output: ${S};
`);for(let F of I){for(let w of F.stmts)d+=w.split(`
`).map(z=>`  ${z}
`).join("");d+=`  ${F.variable} = ${F.code};
`}return E&&(d+=`  return output;
`),d+=`}
`,d}};var Mc={__proto__:null,True:"True",False:"False"},Oc=new Set(["and","as","assert","async","await","break","class","continue","def","del","elif","else","except","finally","for","from","global","if","import","in","is","lambda","None","nonlocal","not","or","pass","raise","return","try","while","with","yield"]);function uc(e){if(Oc.has(e))throw new Error(`"${e}" is a reserved word in python and cannot be used as a variable name. Rename it, or map it to another name with \`vars\`, before compiling to Python (fail closed, D6).`);if(!Uc.test(e))throw new Error(`"${e}" is not a Python identifier and cannot be used as a variable name. Rename it, or map it to another name with \`vars\`, before compiling to Python (fail closed, D6).`);return e}function ft(e){if(Oc.has(e)||e in Mc)throw new Error(`"${e}" is a reserved word in python and cannot be used as a function, parameter or index name. Rename it before compiling to Python (fail closed, D6).`);if(!Uc.test(e))throw new Error(`"${e}" is not a Python identifier and cannot be used as a function, parameter or index name. Rename it before compiling to Python (fail closed, D6).`);return e}var Uc=/^[\p{XID_Start}_]\p{XID_Continue}*$/u;function qd(e){if(e.normalize("NFKC")===e)return e;let n=r=>`_u${r.codePointAt(0).toString(16).toUpperCase()}_`,t="";for(let r of e)t+=r.normalize("NFKC")===r?r:n(r);if(t.normalize("NFKC")===t)return t;t="";for(let r of e)t+=r.codePointAt(0)<128?r:n(r);return t}function ia(e){return e.split(/("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')/)}var vr=/[\p{XID_Start}_]\p{XID_Continue}*/gu;function wo(e,n){let t=ia(e),r=new Set(n.outside??[]);for(let f=0;f<t.length;f+=2)for(let c of t[f].match(vr)??[])r.add(c);let o=new Map;for(let f of r){let c=f.normalize("NFKC"),m=o.get(c);m===void 0?o.set(c,[f]):m.push(f)}let i=[...o].filter(([,f])=>f.length>1),s=new Map,a=f=>s.get(f)??f;if(i.length===0)return{body:e,name:a};let l=new Set(n.hostNames());for(let f of n.callerSources??[])for(let c of ia(f).filter((m,d)=>d%2===0))for(let m of c.match(vr)??[])l.add(m);let u=new Set(o.keys());for(let[f,c]of i){let m=c.filter(g=>l.has(g));if(m.length>1)throw new Error(`Could not compile to Python: the inputs "${m[0]}" and "${m[1]}" are the same name for Python ("${f}"), because Python reads each identifier in its NFKC normal form, so the host cannot give them two values. Rename one of them, or map it to another name with \`vars\` (fail closed, D6).`);let d=m[0]??c.find(g=>g===f)??c[0];for(let g of c){if(g===d)continue;let _=qd(g),x=_;for(let v=1;u.has(x.normalize("NFKC"));v++)x=`${_}_${v}`;u.add(x.normalize("NFKC")),s.set(g,x)}}for(let f=0;f<t.length;f+=2)t[f]=t[f].replace(vr,a);return{body:t.join(""),name:a}}var Hd=new Set("ArithmeticError AssertionError AttributeError BaseException BaseExceptionGroup BlockingIOError BrokenPipeError BufferError BytesWarning ChildProcessError ConnectionAbortedError ConnectionError ConnectionRefusedError ConnectionResetError DeprecationWarning EOFError Ellipsis EncodingWarning EnvironmentError Exception ExceptionGroup FileExistsError FileNotFoundError FloatingPointError FutureWarning GeneratorExit IOError ImportError ImportWarning IndentationError IndexError InterruptedError IsADirectoryError KeyError KeyboardInterrupt LookupError MemoryError ModuleNotFoundError NameError NotADirectoryError NotImplemented NotImplementedError OSError OverflowError PendingDeprecationWarning PermissionError ProcessLookupError PythonFinalizationError RecursionError ReferenceError ResourceWarning RuntimeError RuntimeWarning StopAsyncIteration StopIteration SyntaxError SyntaxWarning SystemError SystemExit TabError TimeoutError TypeError UnboundLocalError UnicodeDecodeError UnicodeEncodeError UnicodeError UnicodeTranslateError UnicodeWarning UserWarning ValueError Warning ZeroDivisionError __import__ abs aiter all anext any ascii bin bool breakpoint bytearray bytes callable chr classmethod compile complex copyright credits delattr dict dir divmod enumerate eval exec exit filter float format frozenset getattr globals hasattr hash help hex id input int isinstance issubclass iter len license list locals map max memoryview min next object oct open ord pow print property quit range repr reversed round set setattr slice sorted staticmethod str sum super tuple type vars zip np math cmath scipy".split(" "));function Wd(e){let n=ia(e).map((s,a)=>a%2===0?s:'""').join(""),t=new Set,r=[...n.matchAll(vr)],o=s=>{let a=1;for(let l=s;l<n.length;l++)if("([{".includes(n[l]))a+=1;else if(")]}".includes(n[l])&&--a===0)return l;return n.length},i=[];for(let s of r){let a=s.index,l=a+s[0].length;if(n[a-1]===".")continue;let u=n.slice(l).match(/^\s*(\S)/)?.[1],f=i.some(([c,m])=>a>=c&&l<=m);if((u==="("||u==="."||f)&&t.add(s[0].normalize("NFKC")),s[0]==="isinstance"&&u==="("){let c=n.indexOf("(",l)+1,m=o(c),d=0;for(let g=c;g<m;g++)if("([{".includes(n[g]))d+=1;else if(")]}".includes(n[g]))d-=1;else if(n[g]===","&&d===0){i.push([g,m]);break}}if(s[0]==="except"){let c=n.indexOf(":",l);i.push([l,c<0?n.length:c])}}return t}function br(e,n){let t;for(let r of n){let o=r.normalize("NFKC");if(!(!Hd.has(o)&&!o.startsWith("_ce_"))&&(t??=Wd(e),t.has(o)))throw new Error(`"${r}" is the name of a Python builtin or module ("${o}") that the compiled Python code uses, and cannot be used as a symbol, parameter or function name. Rename it before compiling to Python (fail closed).`)}}function fc(e){return Object.values(e??{}).filter(n=>typeof n=="string")}var Qs={__proto__:null,Pi:"np.pi",ExponentialE:"np.e",ImaginaryUnit:"1j",Infinity:"np.inf",NaN:"np.nan",Indeterminate:"np.nan",GoldenRatio:"((1 + np.sqrt(5)) / 2)",CatalanConstant:"0.915965594177219015054603514932384110774",EulerGamma:"0.5772156649015328606065120900824024310421"};function sa(e,n,t){return`(lambda _q: max(0, int((_q + (0 if float(${e}).is_integer() and float(${n}).is_integer() and float(${t}).is_integer() else min(${1e-12} * (1 + abs(_q)), ${.001}))) // 1) + 1))((${n} - ${e}) / ${t})`}function $o(e,n){let t=ne(e);return t!==void 0?`${Math.max(0,Math.round(t))}`:`max(0, ${Yd(e,n)})`}function Yd(e,n){return`int(np.floor((${n(e)}) + 0.5))`}function cc(e,n,t,r){let o=ne(t);if(o!==void 0){let l=Math.round(o);return Math.abs(l)>Number.MAX_SAFE_INTEGER?e==="Take"?`${n}[:]`:`${n}[:0]`:e==="Take"?l<0?`${n}[${l}:]`:`${n}[:${l}]`:l<0?`${n}[:${l}]`:`${n}[${l}:]`}let i=e==="Take"?"_l[_n:] if _n < 0 else _l[:_n]":"_l[:_n] if _n < 0 else _l[_n:]",s=Number.MAX_SAFE_INTEGER,a=`int(np.clip(np.floor((${r(t)}) + 0.5), -${s}, ${s}))`;return`(lambda _l, _n: ${i})(${n}, ${a})`}function wr(e,n){let t=r=>{if(Lr(r))return!0;if(bt(r))return!1;let o=dt(X(r.type.type));return o!==void 0&&o!=="never"&&q(X(o),"character")};if(n.some(t))throw new Error(`Could not compile \`${e}\`: a character participant. A character is one UAX #29 grapheme cluster, and this target has no stdlib grapheme segmentation or code-point-sequence ordering to reproduce the interpreter's character semantics. The interpreter evaluates it instead.`)}function Bc(e,n){for(let t of n){let r=Qo(t);if(r!==null)throw new Error(`Could not compile \`${e}\`: a ${r} participant. The interpreter compares it as ONE value, whereas the emitted Python looks inside it: a dictionary or record has no positional lowering, and a tuple is mapped over element-wise by \`np.less\` (\`Equal(Tuple(1, 2), List(1, 2))\` answered \`True\`) where a point binds atomically. The interpreter evaluates it instead.`)}}function Kd(e){let n=(t,r,o)=>{if(typeof t=="object"&&t.kind==="reference"&&t.def!==void 0){let a=xa(t);if(o?.has(a))return!1;o=new Set(o).add(a)}let i=X(t);if(typeof i=="string")return!r&&i==="tuple";if(i.kind==="tuple")return!r;if(i.kind==="union")return i.types.some(a=>n(a,r,o));let s=Sr(i);return s===void 0?!1:n(s,!1,o)};return n(e.type.type,!0)}function Zd(e,n){if(n.some(Kd))throw new Error(`Could not compile \`${e}\`: a participant whose ELEMENTS are tuples (a point list). \`np.less([(1, 2)], [(3, 4)])\` looks inside each point and answers \`[[True, True]]\`, whereas the interpreter broadcasts to an inert point comparison (\`[(1, 2) < (3, 4)]\`). Only the EQUALITY family admits point lists (whole-value \`_ce_eqcoll\`). The interpreter evaluates it instead.`)}function Xd(e,n){if(n.some(tl))throw new Error(`Could not compile \`${e}\`: string-valued operands are not supported by this target (the lowering is numeric: a raw \`==\` that skips the interpreter's text conditioning). The interpreter evaluates it instead.`)}function Jd(e){return e.length!==2||!e.some(bt)||e.some(n=>{let t=X(n.type.type);return t!=="never"&&q(t,"number")})||e.some(n=>Qo(n)!==null)?!1:!e.some(n=>gn(n)||Ar(n))}function Qd(e,n){if(ol(n))throw new Error(`Could not compile \`${e}\`: an ordering that mixes a string operand with an operand that is not provably a string. The interpreter leaves such a comparison symbolic (\`Less("a", 1)\` stays inert), whereas NumPy coerces the number to a string and answers a plausible-looking boolean (\`np.less(["a", 10], ["b", 9])\` \u2192 \`[True, True]\`). An ordering whose operands are ALL provably strings does compile \u2014 the interpreter compares strings the same way. The interpreter evaluates it instead.`)}var em=new Set(["Add","Subtract","Multiply","Divide","Negate","Power","Square","Sqrt","Root","Abs","Floor","Ceil","Round","Sign","Mod","Min","Max","Sum","Product","Length","Exp","Ln","Log","Sin","Cos","Tan","Arctan","Arctan2","Arcsin","Arccos","Sinh","Cosh","Tanh","Dot","Norm","Hypot","Gamma","Factorial","Random","RandomInteger"]);function pc(e,n,t,r){if(n.length<2)throw new Error(`Could not compile \`${e}\`: expected at least two arguments`);let o=n.filter(gn).length,i=n.map(_=>Gr(_,r)),s=_=>new Error(`Could not compile \`${e}\`: an operand runs code that the caller supplied (a \`vars\` or \`functions\` entry), and ${_}. The interpreter evaluates it instead.`);n.length===2&&n.every(yt)&&n.every(nl)||Bc(e,n),wr(e,n);let l=Jd(n),u=o>=2&&n.every(rl);if(!l&&!u&&Xd(e,n),l){let _=e==="Equal"?"==":"!=";return`((${t(n[0])}) ${_} (${t(n[1])}))`}if(o===1){let _=n.findIndex(gn),x=F=>{let w=X(F);return w!=="never"&&q(w,"number")},v=n[_],E=v.type.matches("list<any>")?dt(X(v.type.type)):void 0;if(E===void 0||!x(E)||!n.every((F,w)=>w===_||x(F.type.type)))throw new Error(`Could not compile \`${e}\`: a single collection operand broadcasts element-wise in the interpreter (a list of booleans, not a boolean). The Python target compiles that shape only for an ordered list of numbers whose other operands are numbers.`);if(i.some((F,w)=>F&&w!==_))throw s("the element-wise form evaluates it once for each element");let S=p.tempVar(r),$=n.map((F,w)=>w===_?S:t(F)),N=e==="Equal"?"==":"!=",I=[];for(let F=0;F<n.length-1;F++)I.push(`((${$[F]}) ${N} (${$[F+1]}))`);return`[${I.length===1?I[0]:`(${I.join(" and ")})`} for ${S} in ${t(v)}]`}if(o>=2){let _=(v,E)=>{let S=`_ce_eqcoll(${t(v)}, ${t(E)})`;return e==="Equal"?S:`(not ${S})`};if(n.length===2)return _(n[0],n[1]);if(i.some(v=>v))throw s("this chain splices a middle operand twice and skips the operands after a false pair");let x=[];for(let v=0;v<n.length-1;v++)x.push(_(n[v],n[v+1]));return`(${x.join(" and ")})`}let f=_=>!D(_)&&!(b(_)&&typeof _.operator=="string"&&em.has(_.operator)),c=(_,x)=>{let v=t(_),E=t(x),S=f(_)&&f(x)?`(${v}) is not None and `:"";if(S==="")return`((${v}) ${e==="Equal"?"==":"!="} (${E}))`;let $=`(${S}(${v}) == (${E}))`;return e==="Equal"?$:`(not ${$})`},m=(_,x)=>f(n[_])&&f(n[x]),d=_=>(_===0||_===n.length-1)&&!(_+1<n.length&&m(_,_+1))&&!(_>=1&&m(_-1,_));if(i.some((_,x)=>_&&(!d(x)||x>=2)))return nm(e,n,i,t,r,f,s);if(n.length===2)return c(n[0],n[1]);let g=[];for(let _=0;_<n.length-1;_++)g.push(c(n[_],n[_+1]));return`(${g.join(" and ")})`}function nm(e,n,t,r,o,i,s){let a=o.bindExpr;if(a===void 0)throw s("this target cannot bind it to a temporary");let l=t.lastIndexOf(!0);if(e==="Equal"&&n.length>2){for(let v=1;v<l;v++)if(ni(n[v-1])||ni(n[v]))throw s("a pair before it may read an absent operand, which stops the chain here but not in the interpreter")}let u=n.map(v=>r(v)),f=(v,E)=>E<l&&!D(v)&&!en(v)&&!(C(v)&&v.isConstant),c=n.map((v,E)=>t[E]||f(v,E)?p.tempVar(o):void 0),m=v=>c[v]??u[v],d=(v,E)=>{let S=i(n[v])&&i(n[E])?`(${m(v)}) is not None and `:"";if(S==="")return`((${m(v)}) ${e==="Equal"?"==":"!="} (${m(E)}))`;let $=`(${S}(${m(v)}) == (${m(E)}))`;return e==="Equal"?$:`(not ${$})`},g=v=>{let E=v+1<n.length?` and ${g(v+1)}`:"",S=`${d(v-1,v)}${E}`,$=c[v];return $===void 0?S:a([[$,u[v]]],S)},_=`(${g(1)})`,x=c[0];return x===void 0?_:a([[x,u[0]]],_)}function Mt(e,n,t=!1){if(D(e)&&!e.isComplex&&Number.isFinite(e.re))return String(Math.floor(e.re));let r=p.compile(e,n);return!t||e.type.matches("integer")?r:`int((${r}) // 1)`}function tm(e,n){return D(e)&&!e.isComplex&&Number.isFinite(e.re)?String(Math.floor(e.re)+1):`${Mt(e,n,!0)} + 1`}function dc(e,n,t){if(!n[0])throw new Error(`Could not compile \`${e}\`: no body`);if(!n[1])throw new Error(`Could not compile \`${e}\`: no indexing set`);p.assertScalarBigOpBody(e,n[0]);let r=n[0],o=()=>new Error(`Could not compile \`${e}\`: the body is a statement or a block of statements, and the Python lowering of \`${e}\` is a generator expression, whose element is an expression. The loop form of \`${e}\` is written only where the \`${e}\` is the value of a statement (a function body, a statement of a block, or the right side of an assignment there).`);if(In(r)!==void 0||b(r,"Block")&&r.nops>1){let g=rm(e,n,t);if(g!==void 0)return g;throw o()}let i=n.slice(2),s=g=>D(g)&&!g.isComplex&&Number.isFinite(g.re),a=i.some(g=>!b(g,"Limits")||!s(g.ops[1])||!s(g.ops[2])),l=0,{forClauses:u,idxTarget:f}=jc(e,n.slice(1),t,a?g=>l++===0?g:p.tempVar(t):void 0),c=g=>e==="Sum"?`sum(${g})`:`math.prod(${g})`,m=n.length===2?n[1]:void 0;if(t.cseBind!==void 0&&b(m,"Limits")&&C(m.ops[0])){let[,g,_]=m.ops,x=N=>D(N)&&!N.isComplex&&Number.isFinite(N.re)?Math.floor(N.re):void 0,v=x(g),E=x(_),S=N=>x(N)!==void 0||C(N),$=v!==void 0&&E!==void 0;if($&&v<=E||!$&&S(g)&&S(_)){let{bindings:N,result:I}=p.hoistLoopInvariants(r,[m.ops[0].symbol],t,()=>p.compile(r,f));if(I.includes(`
`))throw o();let O=c(`${I} ${u.join(" ")}`);if(N.length>0){let F=t.cseBind(N.map(([z,G])=>[z,G]),O);if($)return F;let w=`${Mt(g,t,!0)} <= ${Mt(_,t,!0)}`;return`(${F} if ${w} else ${e==="Sum"?"0":"1"})`}return O}}let d=p.compile(r,f);if(d.includes(`
`))throw o();return c(`${d} ${u.join(" ")}`)}function jc(e,n,t,r){let o=[],i=t;for(let s of n){if(!b(s,"Limits"))throw new Error(`Could not compile \`${e}\`: expected a Limits indexing set`);let a=s.ops,l=a[0];if(!C(l))throw new Error(`Could not compile \`${e}\`: index must be a symbol`);let u=ft(l.symbol),f=r?.(u)??u,c=a[1],m=a[2];if(c===void 0||m===void 0||C(m,"Nothing")||m.isInfinity||c.isInfinity)throw new Error(`Could not compile \`${e}\`: an unbounded range is not supported`);p.assertSafeBigOpBounds(e,[c,m],i);let d=Mt(c,i,!0),g=tm(m,i);o.push(`for ${f} in range(${d}, ${g})`);let _=i;i={..._,var:x=>x===u?f:_.var(x),...p.withBoundScope(_,[u])}}return{forClauses:o,idxTarget:i}}function mc(e,n){let t={stmts:[],boundVars:n.boundVars,unit:e},r=p.compileCseRoot(e,{...n,hoist:t});if(t.stmts.length===0)return r;let o=r.includes(`
`)||/^return\b/.test(r)||/^[^\s()[\]{}'"=,:]+ = /.test(r);return[...t.stmts,o?r:`return ${r}`].join(`
`)}function rm(e,n,t){if(!p.canHoist(t))return;let r=t.hoist.unit,o=$=>b($,e)&&$.nops===n.length&&$.ops.every((N,I)=>N===n[I]);if(!(o(r)||b(r,"Assign")&&o(r.ops[1])||b(r,"Declare")&&o(p.declareValueOperand(r.ops))||b(r,"Return")&&o(r.ops[0])))return;let s=n[0],a=($,N)=>{if(!b($)||$.operator==="Function")return!1;let I=$.operator;return I==="Return"||(I==="Break"||I==="Continue")&&!N?!0:$.ops.some(O=>a(O,N||I==="Loop"))};if(a(s,!1))return;let l=p.tempVar(t),u={...t,cse:al(t)},{forClauses:f,idxTarget:c}=jc(e,n.slice(1),u,()=>p.tempVar(t)),m={stmts:[],boundVars:c.boundVars,unit:s},d=p.withFreshBlockLocals(()=>p.compile(s,{...c,hoist:m})),g=[...m.stmts,...d.split(`
`)],_=g.pop(),x=/^return (.+)$/.exec(_),v=/^([^\s()[\]{}'"=,:]+) = /.exec(_),E;if(x!==null&&x[1]!=="None")E=x[1];else if(x===null&&v!==null)g.push(_),E=v[1];else if(g.length===0&&!/^(?:if|for|while)\b/.test(_))E=_;else return;g.push(`${l} ${e==="Sum"?"+=":"*="} ${E}`);let S=g.join(`
`);for(let $=f.length-1;$>=0;$--)S=`${f[$]}:
${To(S)}`;return p.hoistStatement(t,`${l} = ${e==="Sum"?"0":"1"}`,S),l}function To(e){return(e.trim()===""?"pass":e).split(`
`).map(t=>`    ${t}`).join(`
`)}function Go(e,n){if(C(e,"Nothing"))return"";if(!b(e))return p.compile(e,n);let t=e.operator;if(t==="Break")return"break";if(t==="Continue")return"continue";if(t==="Return")return`return ${p.compileOp(e,0,n,0,e.ops[0])}`;if(t==="If")return yp(e.ops,n,e);let r=t==="Declare"&&b(e.ops[0],"Tuple");if(t==="Block"||r){let o=r?[e]:e.ops,i=r?void 0:e,s=p.withImplicitLocalDeclares(o.flatMap(u=>p.desugarPatternDeclare(u,n)??[u]).flatMap(u=>p.desugarPatternAssign(u,n)??[u]),n,i),a=s.flatMap(u=>b(u,"Declare")&&C(u.ops[0])?[u.ops[0].symbol]:[]);p.assertNoUseBeforeDeclare(s),p.assertLocalsAssignedBeforeRead(s,a),p.classifyLocalReads(s,a,i,n);let l=u=>{let f=p.loopBodyTempTarget(s,n),c=u===void 0?f:{...f,var:d=>u.get(d)??f.var(d)},m=(d,g,_)=>{let x=c.var(_)??_,v=p.declareValueOperand(g);if(v===void 0)return"";let E=g.indexOf(v),S=E<0?p.compile(v,c):p.compileOp(d,E,c,0,v);return p.assertExpressionValue(S,c,"Declare",_),`${x} = ${S}`};return p.withCseScope(e,-1,c,()=>s.map(d=>b(d,"Declare")&&C(d.ops[0])?m(d,d.ops,d.ops[0].symbol):Go(d,c)).filter(d=>d!=="").join(`
`))};return a.length===0?l():p.withFreshBlockLocals(()=>l(new Map(a.map(u=>[u,p.freshBlockLocalName(n)]))))}if(t==="Assign"&&b(e.ops[0],"Tuple")){let o=p.desugarPatternAssign(e,n);if(o!==null){let i=p.loopBodyTempTarget(o,n);return o.map(s=>Go(s,i)).filter(s=>s!=="").join(`
`)}}return t==="Loop"?qc(e.ops,n,e):p.compileOp(e,-1,n,0,e)}function om(e,n){if(b(e,"Range")&&e.nops>=2&&e.nops<=3){let[t,r,o]=e.ops,i=f=>f!==void 0&&D(f)&&!f.isComplex&&Number.isSafeInteger(f.re)?f.re:void 0,s=i(t),a=i(r),l=o===void 0?void 0:i(o);if(s!==void 0&&a!==void 0&&(o===void 0||l!==void 0)){let f=l??(a>=s?1:-1);return f===0?"[]":f===1?`range(${s}, ${a+1})`:f>0?`range(${s}, ${a+1}, ${f})`:`range(${s}, ${a-1}, ${f})`}let u=(f,c)=>c!==void 0||!D(f);if(o===void 0&&u(t,s)&&u(r,a)){let f=Mt(t,n),c=Mt(r,n);return`(lambda _a, _b: (range(int(_a), int(_b) + 1) if _b >= _a else range(int(_a), int(_b) - 1, -1)) if float(_a).is_integer() and float(_b).is_integer() else (lambda _s: [_a + _s * _i for _i in range(${sa("_a","_b","_s")})])(1 if _b >= _a else -1))(${f}, ${c})`}}if(e.type.matches("string"))throw new Error("Could not compile `Loop`: cannot iterate a string on this target \u2014 its elements are UAX #29 grapheme clusters and Python has no stdlib grapheme segmentation, so the emitted loop would walk code points instead. The interpreter evaluates it.");return wr("Loop",[e]),p.compile(e,n)}var Dc=new WeakMap;function Eo(e,n,t){let r=p.newNamingContext(e,n,t),o=new Set(e.unknowns),i=new Set,s=[...e.symbols];for(;s.length>0;){let a=s.pop();if(i.has(a))continue;i.add(a);let l=e.engine._getSymbolValue(a);if(l!==void 0){for(let u of l.unknowns)o.add(u);s.push(...l.symbols)}}for(let a of n??[])if(typeof a=="string")for(let l of a.match(vr)??[])o.add(l);return Dc.set(r,o),r}function im(e,n){if(n.var(e)!==void 0)return!0;let t=n.naming;return t!==void 0&&Dc.get(t)?.has(e)===!0}function Vc(e,n,t=!1){let r=p.elementClauseBinders(e,n);r.forEach((a,l)=>{let u=a.clause.ops[2];if(!(u===void 0||C(u,"Nothing"))){for(let f=l+1;f<r.length;f++)for(let c of r[f].names)if(u.has(c))throw new Error(`Could not compile \`Comprehension\`: the guard of clause ${l+1} names \`${c}\`, which a later clause binds; in a Python comprehension that name is the later loop's variable, unassigned at that point, where the interpreter reads the enclosing one. The interpreter evaluates it instead.`)}});let o=[],i=[],s=n;for(let a of r){let l=om(a.clause.ops[1],s);for(let _ of a.names)ft(_);let u=s,f=new Set(a.names),c=new Map;if(t){for(let _ of a.names)if(im(_,u)){let x=p.tempVar(u);c.set(_,x),i.push(x)}}s={...u,var:_=>f.has(_)?c.get(_)??_:u.var(_),...p.withBoundScope(u,a.names)};let m=c.size===0?a.pyPattern:a.pyPattern.replace(/[^\s(),]+/g,_=>c.get(_)??_),d=a.clause.ops[2],g=d!==void 0&&!C(d,"Nothing")?` if ${p.compileGuardTest(d,s,pt)}`:"";o.push(`for ${m} in ${l}${g}:`)}return{headers:o,bodyTarget:s,renamed:i}}function sm(e){return e.some(n=>b(n,"Element")&&n.nops>=3&&!C(n.ops[2],"Nothing"))}function qc(e,n,t){if(!e[0])throw new Error("Could not compile `Loop`: no body");let r=e[0],o=e.slice(1),i,s=n,a=[];if(o.length===0)i=["while True:"];else{if(sm(o))throw new Error("Could not compile `Loop`: a guarded `Element` clause has no Python statement form. The interpreter evaluates it instead.");p.assertBreakLeavesWholeLoop(o,r),{headers:i,bodyTarget:s,renamed:a}=Vc(o,n,!0)}let l=To(p.withWritableLoopIndices(a,()=>p.withCseScope(t,0,s,()=>Go(r,s))));for(let u=i.length-1;u>=0;u--)l=u===i.length-1?`${i[u]}
${l}`:`${i[u]}
${To(l)}`;return l}function am(e,n,t){if(!e[0])throw new Error("Could not compile `Comprehension`: no body");if(!e[1])throw new Error("Could not compile `Comprehension`: no indexing set");let r=e[0];if(b(r,"Block")){if(r.nops!==1)throw new Error("Could not compile `Comprehension`: a multi-statement body has no Python list-comprehension form.");r=r.ops[0]}if(Yn(r))throw new Error("Could not compile `Comprehension`: the body is a statement, which has no place in a Python list comprehension.");fa("Comprehension",r);let{headers:o,bodyTarget:i}=Vc(e.slice(1),n),s=p.withCseScope(t,0,i,()=>p.compile(r,i)),a=o.map(l=>l.slice(0,-1)).join(" ");return`[${s} ${a}]`}function ea(e,n,t,r,o){let i=X(n.type.type);if(Se(Qe(i),"number")&&Pl(t))throw new Error(`Could not compile \`${e}\`: an element of the collection may be absent, which this target spells as \`nan\`, and the searched value may be a number, which could be \`NaN\`; the interpreter keeps the two apart. The interpreter evaluates it instead.`);if(C(n,"Missing")||C(n,"Undefined")||Bt(i)&&Se(Qe(i),"number"))throw new Error(`Could not compile \`${e}\`: the searched value may be the absent value \`Missing\`, which this target spells as \`nan\` and could not tell from a \`NaN\` element. The interpreter evaluates it instead.`);return o(r(n))}var aa={__proto__:null,Add:["+",11],Negate:["-",14],Subtract:["-",11],Multiply:["*",12],Divide:["/",13],Power:["**",15],LessEqual:["<=",9],GreaterEqual:[">=",9],Less:["<",9],Greater:[">",9],And:["and",4],Or:["or",3],Not:["not",14]};function Hc(e,n,t){let r=n.trim();return r.startsWith("-")||r.startsWith("+")?`(${n})`:b(e)?(t?.operators?.(e.operator)??aa[e.operator])===void 0?n:`(${n})`:n}function gn(e){let n=e.type;return n.matches("string")?!1:n.matches("list<any>")||n.matches("indexed_collection<any>")}function lm(e){let n=e.rank;return n>0?n:Wc(e.type.type)}function Wc(e){let n=X(e);if(typeof n!="object"||n.kind!=="list"||n.dimensions===null)return;let t=n.dimensions?.length??1;if(q(n.elements,"number"))return t;let r=Wc(n.elements);return r===void 0?void 0:t+r}function hc(e){if(!(e===void 0||e<=2))throw new Error("Could not compile `Norm`: above rank 2 the interpreter computes only the Frobenius norm (the order 2, which is also the default), and `np.linalg.norm` raises for any explicit order on an input with more than two axes.")}function um(e){let n=e.type.type;for(let t=0;n!==void 0&&t<16;t++){if(q(n,"finite_number"))return!0;n=Sr(n)}return!1}function fm(e){let n=e.type.type;for(let t=0;n!==void 0&&t<16;t++){if(q(n,"integer"))return"integer";n=Sr(n)}return um(e)?"finite":"any"}function Te(e,n,t){let r=n===void 0?"":`, ${n}`,o=t!=="integer"&&(n===void 0||n==="2"||n==="'fro'"||n==="_p"),i=o?`(lambda _m: np.linalg.norm(_a * 2.0**600${r}) * 2.0**-600 if 0 < _m < 2.0**-500 else np.linalg.norm(_a * 2.0**-600${r}) * 2.0**600 if _m > 2.0**500 else np.linalg.norm(_a${r}))(np.max(np.abs(_a), initial=0))`:`np.linalg.norm(${t==="any"?"_a":e}${r})`;if(t!=="any")return o?`(lambda _a: ${i})(np.asarray(${e}))`:i;let s="_a.dtype.kind in 'fc'";return`(lambda _a: float('inf') if ${s} and np.isinf(_a).any() else (float('nan') if ${s} and np.isnan(_a).any() else ${i}))(np.asarray(${e}))`}function na(e,n,t,r){let o="float('nan')";return`(lambda _x: np.abs(_x) if np.ndim(_x) == 0 else ${t==="vector"?`${Te("_x",n,r)} if np.ndim(_x) == 1 else ${o}`:`${Te("_x",n,r)} if np.ndim(_x) <= 2 else ${t==="two"?Te("_x",void 0,r):o}`})(${e})`}function cm(e,n,t,r){let o="float('nan')";return Ao(e,n,t,i=>`(np.abs(_x) if _p > 0 else ${o}) if np.ndim(_x) == 0 else (${Te("_x","_p",r)} if _p > 0 else ${o}) if np.ndim(_x) == 1 else (${Yc(i,r)}) if np.ndim(_x) == 2 else (${Te("_x",void 0,r)} if _p == 2 else ${o})`)}function Yc(e,n){let r=`${Te("_x","_p",n)} if _p == 1 or _p == 2 or _p == np.inf else float('nan')`;return e===void 0?r:`${Te("_x","'fro'",n)} if ${e} else ${r}`}function Ao(e,n,t,r){return q(t,"number")||!Se(t,"string")?`(lambda _x, _p: ${r(void 0)})(${e}, ${n})`:`(lambda _x, _q: (lambda _p: ${r("(isinstance(_q, str) and _q == 'Frobenius')")})(({'Infinity': np.inf, 'Frobenius': 2}.get(_q, float('nan')) if isinstance(_q, str) else _q)))(${e}, ${n})`}var Kc=`def _ce_cplx(_v):
    return complex(_v) if isinstance(_v, (int, float)) and not isinstance(_v, bool) else _v
def _ce_cisreal(_v):
    return _v.imag == 0 if isinstance(_v, (complex, np.complexfloating)) else True
def _ce_creal(_v):
    return _v.real if isinstance(_v, (complex, np.complexfloating)) else _v
def _ce_creal_elems(_v):
    if isinstance(_v, (list, tuple)):
        return [_ce_creal_elems(_x) for _x in _v]
    if hasattr(_v, 'ndim') and _v.ndim > 0:
        return np.asarray([_ce_creal_elems(_x) for _x in _v])
    if hasattr(_v, 'ndim') and _v.ndim == 0:
        _v = _v.item()
    return _ce_creal(_v) if _ce_cisreal(_v) else float('nan')`,Zc=`def _ce_bcast_apply(_op, _arrs):
    if _op == 'clip':
        return np.clip(_arrs[0], _arrs[1], _arrs[2])
    if _op == 'smoothstep':
        return _ce_smoothstep(_arrs[0], _arrs[1], _arrs[2])
    _pair = np.maximum if _op == 'max' else np.minimum
    _r = _arrs[0]
    for _a in _arrs[1:]:
        _r = _pair(_r, _a)
    return _r

def _ce_bcast(_op, *args):
    _arrs = [np.asarray(a) for a in args]
    _cols = [a for a in _arrs if a.ndim > 0]
    if not _cols:
        return np.asarray(_ce_bcast_apply(_op, _arrs))
    _n = _cols[0].shape[0]
    if any(a.shape[0] != _n for a in _cols) or _n == 0:
        return np.asarray(float('nan'))
    if all(a.shape == _cols[0].shape for a in _cols):
        return np.asarray(_ce_bcast_apply(_op, _arrs))
    return np.asarray([
        _ce_bcast(_op, *[(a[_i] if a.ndim > 0 else a) for a in _arrs])
        for _i in range(_n)
    ])
`,Xc=`def _ce_rref(_m):
    _a = np.asarray(_m, dtype=float).copy()
    _rows, _cols = _a.shape
    _r = 0
    for _c in range(_cols):
        if _r >= _rows:
            break
        _piv = _r + int(np.argmax(np.abs(_a[_r:, _c])))
        if _a[_piv, _c] == 0:
            continue
        _a[[_piv, _r]] = _a[[_r, _piv]]
        _a[_r] = _a[_r] / _a[_r, _c]
        for _k in range(_rows):
            if _k != _r:
                _a[_k] = _a[_k] - _a[_k, _c] * _a[_r]
        _r += 1
    return _a
`,Jc=`def _ce_eqcoll(_a, _b):
    _al = isinstance(_a, (list, tuple, np.ndarray))
    _bl = isinstance(_b, (list, tuple, np.ndarray))
    if _al != _bl:
        return False
    if not _al:
        try:
            return bool(_a == _b)
        except TypeError:
            return False
    try:
        _x = np.asarray(_a)
        _y = np.asarray(_b)
        if _x.dtype.kind in 'iuf' and _y.dtype.kind in 'iuf':
            if _x.shape != _y.shape:
                return False
            with np.errstate(invalid='ignore'):
                return bool(np.all(_x == _y))
    except (ValueError, TypeError):
        pass
    if len(_a) != len(_b):
        return False
    return all(_ce_eqcoll(_x, _y) for _x, _y in zip(_a, _b))
`,Qc=`def _ce_same(_a, _b):
    if isinstance(_a, np.ndarray) or isinstance(_b, np.ndarray):
        return _ce_same(np.asarray(_a).tolist(), np.asarray(_b).tolist())
    if isinstance(_a, (bool, np.bool_)) != isinstance(_b, (bool, np.bool_)):
        return False
    if isinstance(_a, tuple) and isinstance(_b, tuple):
        return len(_a) == len(_b) and all(_ce_same(_x, _y) for _x, _y in zip(_a, _b))
    if isinstance(_a, list) and isinstance(_b, list):
        return len(_a) == len(_b) and all(_ce_same(_x, _y) for _x, _y in zip(_a, _b))
    if isinstance(_a, (float, np.floating)) and isinstance(_b, (float, np.floating)) and _a != _a and _b != _b:
        return True
    return bool(_a == _b)

def _ce_indexof(_l, _v):
    for _i, _x in enumerate(_l):
        if _ce_same(_x, _v):
            return _i + 1
    return 0
`;function Co(e,n){return`(lambda _x: (lambda _y: np.where(np.isinf(_y) & (_x != 0) & (np.abs(_x) < ${Math.PI/2}), _y, np.where(np.isinf(_y) | (np.abs(_y) * np.minimum(np.abs(_x), ${Pa}.0) * ${za} >= 1), np.inf, _y))[()])(${n}))(${e})`}function So(e,n){return ep(e,n==="cos"?"_pc":n==="sin"?"_ps":n==="tan"?"(np.where(_pc == 0, np.inf, _ps / np.where(_pc == 0, 1.0, _pc)) + 0.0)[()]":"(_pc + 1j * _ps)")}function ep(e,n){return`(lambda _pu: (lambda _pr: (lambda _pq: (lambda _pt, _pk: (lambda _c0, _s0: (lambda _pc, _ps: ${n})((np.select([_pk == 0, _pk == 1, _pk == 2], [_c0, -_s0, -_c0], _s0) + 0.0)[()], (np.select([_pk == 0, _pk == 1, _pk == 2], [_s0, _c0, -_s0], -_c0) + 0.0)[()]))(np.cos(np.pi * _pt), np.sin(np.pi * _pt)))(_pr - _pq / 2, (_pq + 4) % 4))(np.floor(2 * _pr + 0.5)))(_pu - 2 * np.floor(_pu / 2 + 0.5)))(${e})`}function It(e,n){let t="complex(np.inf, np.inf)",r=(i,s)=>`(np.where(${s} == 0, ${t}, 1j * ${i} / np.where(${s} == 0, 1.0, ${s})) + 0.0)[()]`,o={Sinh:"(1j * _ps + 0.0)",Cosh:"(_pc + 0j)",Tanh:r("_ps","_pc"),Csch:r("-1.0","_ps"),Sech:`(np.where(_pc == 0, ${t}, 1.0 / np.where(_pc == 0, 1.0, _pc) + 0j))[()]`,Coth:r("-_pc","_ps")}[n];return ep(e,o)}function gc(e){return e===1/0?"float('inf')":e===-1/0?"-float('inf')":Number.isNaN(e)?"float('nan')":String(e)}var ct=!1;function np(){return`import math
def _ce_pow_branch(_e):
    if not math.isfinite(_e) or _e == math.floor(_e):
        return None
    _tol = max(5e-324, abs(_e) * 4 * 2.220446049250313e-16, abs(_e) * 10.0 ** (1 - ${Oa()}))
    _x = _e
    _a = float(math.floor(_x))
    _h1, _k1, _h, _k = 1.0, 0.0, _a, 1.0
    if not abs(_h / _k - _e) <= _tol:
        while _x - _a > 1e-15 * _k * _k:
            _x = 1 / (_x - _a)
            _a = float(math.floor(_x))
            _h, _h1 = _h1 + _a * _h, _h
            _k, _k1 = _k1 + _a * _k, _k
            if abs(_h / _k - _e) <= _tol:
                break
    if not (math.isfinite(_h) and math.isfinite(_k)) or _k == 0:
        return None
    if abs(_h / _k - _e) > _tol:
        return None
    if (12 / math.pi ** 2) * _k * _k * _tol > ${Ma}:
        return None
    return (_h, _k)
def _ce_pow_real(_x, _y):
    if not (math.isfinite(_x) and _x < 0 and math.isfinite(_y)):
        return None
    _t = _ce_pow_branch(_y)
    if _t is None or _t[1] % 2 == 0:
        return None
    _m = float(np.power(-_x, _y))
    if not math.isfinite(_m):
        return None
    return -_m if _t[0] % 2 != 0 else _m
def _ce_cos_sin_pi(_v):
    _r = _v - 2 * math.floor(_v / 2 + 0.5)
    _q = math.floor(2 * _r + 0.5)
    _t = _r - _q / 2
    _c = math.cos(math.pi * _t)
    _s = 0.0 if _t == 0 else math.sin(math.pi * _t)
    return [(_c, _s), (-_s, _c), (-_c, -_s), (_s, -_c)][(_q + 4) % 4]
def _ce_pow_real_part(_v):
    if isinstance(_v, complex):
        return _v.real if _v.imag == 0 else None
    return float(_v)
def _ce_pow(_x, _y, _f=None):
    if np.ndim(_x) == 0 and np.ndim(_y) == 0:
        _xr = _ce_pow_real_part(_x)
        _yr = _ce_pow_real_part(_y)
        if _xr is not None and _yr is not None:
            _r = _ce_pow_real(_xr, _yr)
            if _r is not None:
                return _r
            if _xr < 0 and math.isfinite(_xr) and math.isfinite(_yr) and _yr != math.floor(_yr):
                _m = float(np.power(-_xr, _yr))
                _c, _s = _ce_cos_sin_pi(_yr)
                return complex(0.0 if _c == 0 else _m * _c, 0.0 if _s == 0 else _m * _s)
        return _x ** _y if _f is None else _f(_x, _y)
    _xa, _ya = np.broadcast_arrays(np.asarray(_x), np.asarray(_y))
    _r = np.array(_xa ** _ya if _f is None else _f(_xa, _ya), copy=True)
    _m = (np.real(_xa) < 0) & (np.imag(_xa) == 0) & (np.imag(_ya) == 0)
    for _i in zip(*np.nonzero(_m)):
        _v = _ce_pow_real(float(np.real(_xa[_i])), float(np.real(_ya[_i])))
        if _v is not None:
            _r[_i] = _v
    return _r
`}function zo(e,n,t,r,o=1){let[i,s]=t,a=d=>typeof n=="string"?`${n}(${d})`:n(d);if(i==null)throw new Error(`Could not compile \`${e}\`: no argument`);if(s==null)return a(r(i));let l=o===1?"_ce_q":"(_ce_q * 2)",u=o===1?"np.round(_ce_q)":"(np.round(_ce_q * 2) / 2)",f="__import__('fractions').Fraction",m=`(lambda _ce_q: (lambda _ce_n: np.where(_ce_n & (${`np.vectorize(lambda _ce_a, _ce_b, _ce_r: ${f}(repr(float(_ce_a))) == ${f}(float(_ce_r)) * ${f}(repr(float(_ce_b))), otypes=[bool])(_ce_x, _ce_k, ${u})`} if np.any(_ce_n) else False), ${u}, _ce_q))(np.isfinite(_ce_q) & (np.abs(${l} - np.round(${l})) <= 8.881784197001252e-16 * np.abs(${l}))))(np.where((_ce_x / _ce_k == 0) & (_ce_x != 0) & np.isfinite(_ce_k), np.sign(_ce_x) * 5e-324, _ce_x / _ce_k))`;return`(lambda _ce_x, _ce_k: np.where(np.isinf(_ce_x / _ce_k) & np.isfinite(_ce_x) & (_ce_k != 0), _ce_x, ${a(m)} * _ce_k))(np.asarray(${r(i)}, dtype=float), np.abs(${r(s)}))`}var tp=`def _ce_smoothstep(_e0, _e1, _x):
    _e0 = np.asarray(_e0, dtype=float)
    _e1 = np.asarray(_e1, dtype=float)
    _x = np.asarray(_x, dtype=float)
    with np.errstate(divide='ignore', invalid='ignore'):
        _t = np.clip((_x - _e0) / (_e1 - _e0), 0.0, 1.0)
    _r = np.where(_e0 == _e1, np.where(_x < _e0, 0.0, 1.0), _t * _t * (3.0 - 2.0 * _t))
    _r = np.where(np.isnan(_e0) | np.isnan(_e1) | np.isnan(_x), np.nan, _r)
    return _r[()]`,rp=`def _ce_round(_x, _ties):
    _a = np.abs(_x)
    _m = np.floor(_a)
    _d = _a - _m
    if _ties == 'away-from-zero':
        _away = True
    elif _ties == 'toward-zero':
        _away = False
    elif _ties == 'toward-positive-infinity':
        _away = np.greater(_x, 0)
    else:
        _away = np.less(_x, 0)
    return np.sign(_x) * (_m + np.logical_or(_d > 0.5, np.logical_and(_d == 0.5, _away)))
`;function la(e,n){return n==="to-even"?`np.round(${e})`:ct?`(lambda _x: (lambda _a: (lambda _m: np.sign(_x) * (_m + np.logical_or(_a - _m > 0.5, np.logical_and(_a - _m == 0.5, ${{"away-from-zero":"True","toward-zero":"False","toward-positive-infinity":"np.greater(_x, 0)","toward-negative-infinity":"np.less(_x, 0)"}[n]}))))(np.floor(_a)))(np.abs(_x)))(${e})`:`_ce_round(${e}, '${n}')`}var _c="9007199254740991.0";function ua(e){return`(np.any(np.asarray(${e}) > ${_c}) or np.any(np.asarray(${e}) < -${_c}))`}var op="np.asarray(_a).dtype.kind == 'f' or np.asarray(_b).dtype.kind == 'f' or np.result_type(_a if np.isscalar(_a) else np.asarray(_a), _b if np.isscalar(_b) else np.asarray(_b)).kind == 'f'";function ip(e,n){return`${e} + ': ' + str(${n}) + ' is beyond the safe integer range of compiled code (+/-9007199254740991); evaluate with the interpreter for the exact result'`}var sp=`def _ce_int_operands(_op, _all, _a, _b):
    _all = _all or ${op}
    for _x in (_a, _b):
        if _all and ${ua("_x")}:
            raise ValueError(${ip("_op","_x")})
    return (_a, _b)
def _ce_remainder(_a, _b):
    _ce_int_operands('Remainder', True, _a, _b)
    _q = _a / _b
    _m = np.floor(np.abs(_q))
    _d = np.abs(_q) - _m
    return _a - _b * (np.sign(_q) * (_m + np.logical_or(_d > 0.5, np.logical_and(_d == 0.5, np.greater(_q, 0)))))`;function bc(e,n,t,r){let o=r(n),i=r(t),s=m=>D(m)&&!m.isComplex&&!ka(m.re);if(e==="Mod"&&s(n)&&s(t))return`np.mod(${o}, ${i})`;if(!ct)return e==="Mod"?`np.mod(*_ce_int_operands('Mod', False, ${o}, ${i}))`:`_ce_remainder(${o}, ${i})`;let a=m=>`(_ for _ in ()).throw(ValueError(${ip(`'${e}'`,m)}))`,l=m=>e==="Mod"?`_f and ${ua(m)}`:ua(m),u=e==="Mod"?"np.mod(_a, _b)":`(_a - _b * ${la("_a / _b","toward-positive-infinity")})`,f=`${a("_a")} if ${l("_a")} else ${a("_b")} if ${l("_b")} else ${u}`;return`(lambda _a, _b: ${e==="Mod"?`(lambda _f: ${f})(${op})`:f})(${o}, ${i})`}var ap=`def _ce_ord(_f, _a, _b):
    def _ce_ord_len(_x):
        if isinstance(_x, np.ndarray):
            return len(_x) if _x.ndim > 0 else None
        if isinstance(_x, (list, tuple)):
            return len(_x)
        return None
    _la = _ce_ord_len(_a)
    _lb = _ce_ord_len(_b)
    if _la is not None and _lb is not None and _la != _lb:
        raise ValueError('incompatible dimensions')
    return _f(_a, _b)
`,lp=`def _ce_listpos(_op, _n, _i):
    if isinstance(_i, (bool, np.bool_)) or not isinstance(_i, (int, float, np.integer, np.floating)) or not float(_i).is_integer():
        raise IndexError(_op + ': the index is not an integer at run time')
    _k = int(_i)
    if _k == 0 or _k > _n or _k < -_n:
        raise IndexError(_op + ': the index ' + str(_k) + ' is not a position of the list at run time')
    return _k - 1 if _k > 0 else _n + _k
def _ce_listcopy(_op, _l):
    if isinstance(_l, str):
        raise TypeError(_op + ': the operand is a string at run time, and this target cannot split a string into characters')
    return list(_l)
def _ce_replaceat(_l, _i, _v):
    _o = _ce_listcopy('ReplaceAt', _l)
    _o[_ce_listpos('ReplaceAt', len(_o), _i)] = _v
    return _o
def _ce_deleteat(_l, _i):
    _o = _ce_listcopy('DeleteAt', _l)
    del _o[_ce_listpos('DeleteAt', len(_o), _i)]
    return _o
def _ce_insert(_l, _i, _v):
    _o = _ce_listcopy('Insert', _l)
    _o.insert(_ce_listpos('Insert', len(_o) + 1, _i), _v)
    return _o
def _ce_replaceat_inplace(_l, *_u):
    if isinstance(_l, str):
        _l = _ce_listcopy('ReplaceAt', _l)
    for _k in range(0, len(_u), 2):
        _l[_ce_listpos('ReplaceAt', len(_l), _u[_k])] = _u[_k + 1]
    return _l
def _ce_owned_copy(_x):
    return _x if isinstance(_x, str) else _ce_listcopy('Fold', _x)
`,ta=new WeakSet,up=`def _ce_predicate(_f, _kind, _mode):
    def _p(_x):
        _v = _f(_x)
        if isinstance(_v, (bool, np.bool_)):
            return bool(_v)
        if _mode == 'prefix':
            return False
        _absent = _v is None or (isinstance(_v, (float, np.floating)) and _v != _v)
        if _mode == 'select' and _absent:
            return False
        if _absent:
            raise TypeError(_kind + ' predicate returned an absent value, which the interpreter combines by Kleene logic')
        raise TypeError(_kind + ' predicate must return "True" or "False"')
    return _p
`,fp=`import math
import scipy.special
_ce_ug_zc = [float(scipy.special.zetac(_k)) / _k for _k in range(2, 48)]
def _ce_ug_cf(_s, _z):
    _b = _z + 1 - _s
    _c = 1e300
    _d = 1 / _b
    _h = _d
    _n = 0
    for _i in range(1, 5001):
        _an = -_i * (_i - _s)
        _b += 2
        _d = _an * _d + _b
        if abs(_d) < 1e-300:
            _d = 1e-300
        _c = _b + _an / _c
        if abs(_c) < 1e-300:
            _c = 1e-300
        _d = 1 / _d
        _e = _d * _c
        _h *= _e
        _n = _n + 1 if abs(_e - 1) < 8.881784197001252e-16 else 0
        if _n >= 3:
            return _h
    return math.nan
def _ce_ug_h(_s, _z):
    if _z >= 1 or _s > 0.5 or _s < -4096:
        return _ce_ug_cf(_s, _z)
    _m = round(-_s)
    _a = _s + _m
    if abs(_a) < 1e-200:
        _h = float(scipy.special.exp1(_z)) * math.exp(_z)
    else:
        _l = -0.5772156649015329 * _a + (_a - math.log1p(_a))
        _p = -_a
        for _c in _ce_ug_zc:
            _p *= -_a
            _l += _c * _p
        _t = 1.0
        _sum = 0.0
        for _k in range(1, 200):
            _t *= -_z / _k
            _d = _t / (_a + _k)
            _sum += _d
            if abs(_d) < 1e-17 * abs(_sum):
                break
        _h = math.exp(_z) * (math.expm1(_l - _a * math.log(_z)) / _a - _sum)
    for _k in range(_m):
        _h = (1 - _z * _h) / (1 - _a)
        _a -= 1
    return _h
def _ce_ug1(_s, _z, _reg):
    if math.isnan(_s) or math.isnan(_z):
        return math.nan
    if math.isinf(_s):
        if math.isinf(_z) or (_s < 0 and (_reg or _z <= 0)):
            return math.nan
        if _reg:
            return 1.0
        if _z < 0:
            return math.nan
        return math.inf if _s > 0 or _z < 1 else 0.0
    if _z < 0:
        return math.nan
    _int = _s <= 0 and _s == math.floor(_s)
    if _reg and _int:
        return 0.0 if _z > 0 else math.nan
    if _z == 0:
        if _s > 0:
            return 1.0 if _reg else float(scipy.special.gamma(_s))
        if _reg:
            return math.copysign(math.inf, scipy.special.gammasgn(_s))
        return math.inf if _int else float(scipy.special.gamma(_s))
    if _z == math.inf:
        return math.copysign(0.0, scipy.special.gammasgn(_s)) if _reg else 0.0
    if _s > 0.5 and not _reg:
        _q = float(scipy.special.gammaincc(_s, _z))
        if _q > 1e-300 and _z < _s + 1:
            return float(np.exp(scipy.special.gammaln(_s) + math.log(_q)))
    _h = _ce_ug_h(_s, _z)
    if not _h > 0:
        return math.nan
    _lg = _s * math.log(_z) - _z + math.log(_h)
    _g = float(_h * np.power(_z, _s) * np.exp(-_z))
    if not 2.2250738585072014e-308 <= _g < math.inf:
        _g = math.nan
    if not _reg:
        return _g if _g == _g else float(np.exp(_lg))
    _G = float(scipy.special.gamma(_s))
    if _g == _g and 2.2250738585072014e-308 <= abs(_G) < math.inf:
        return _g / _G
    _lG = scipy.special.gammaln(_s) if abs(_s) > 1e-300 else -math.log(abs(_s))
    return float(scipy.special.gammasgn(_s) * np.exp(_lg - _lG))
def _ce_ugamma(_s, _z, _reg):
    _s = np.asarray(_s)
    _z = np.asarray(_z)
    _nr = (np.imag(_s) != 0) | (np.imag(_z) != 0)
    with np.errstate(all='ignore'):
        _s, _z = np.broadcast_arrays(np.asarray(np.real(_s), dtype=float), np.asarray(np.real(_z), dtype=float))
        _nr = np.broadcast_to(_nr, _s.shape)
        _q = scipy.special.gammaincc(_s, _z)
        _r = np.array(_q if _reg else _q * scipy.special.gamma(_s), dtype=float)
        _slow = ~(_s >= 1e-20) | np.isinf(_s)
        if not _reg:
            _slow = _slow | ((_z > 0) & ~((_q > 1e-300) & (np.abs(_r) < np.inf)))
        for _i in np.flatnonzero(_slow & ~_nr):
            _r.flat[_i] = _ce_ug1(float(_s.flat[_i]), float(_z.flat[_i]), _reg)
        _r[_nr] = np.nan
    return _r[()]
`;function yc(e){let n=e;return(n.includes("_ce_cplx(")||n.includes("_ce_cisreal(")||n.includes("_ce_creal(")||n.includes("_ce_creal_elems("))&&(n=`${Kc}
${n}`),n.includes("_ce_rref(")&&(n=`${Xc}
${n}`),n.includes("_ce_bcast(")&&(n=`${Zc}
${n}`),n.includes("_ce_eqcoll(")&&(n=`${Jc}
${n}`),n.includes("_ce_indexof(")&&(n=`${Qc}
${n}`),n.includes("_ce_ord(")&&(n=`${ap}
${n}`),n.includes("_ce_round(")&&(n=`${rp}
${n}`),(n.includes("_ce_smoothstep(")||n.includes("_ce_bcast('smoothstep'"))&&(n=`${tp}
${n}`),(n.includes("_ce_int_operands(")||n.includes("_ce_remainder("))&&(n=`${sp}
${n}`),n.includes("_ce_pow(")&&(n=`${np()}
${n}`),/_ce_(replaceat|replaceat_inplace|owned_copy|deleteat|insert)\(/.test(n)&&(n=`${lp}
${n}`),n.includes("_ce_predicate(")&&(n=`${up}
${n}`),n.includes("_ce_ugamma(")&&(n=`${fp}
${n}`),n}function pm(e,n){let t=n.includes(`
`);if(!t&&!/\breturn\b/.test(n.replace(/"(?:[^"\\]|\\.)*"/g,'""')))return;let r=(t?n.split(`
`)[0]:n).trim();throw new Error(`Could not compile ${nn(e)}: this route emits a single Python EXPRESSION, but the body lowers to ${t?"a statement sequence":"a bare `return` statement"} (\`${r}${t?"\u2026":""}\`). Python has no expression-level block, and \`return\`/\`for\`/\`while\` are statements, so there is no valid emission for this position. Compile a statement body with compileFunction() instead \u2014 that route emits a \`def\`.`)}function fa(e,n){let t=In(n);if(t!==void 0)throw new Error(`Could not compile ${nn(e)}: this route emits a single Python EXPRESSION, but the body `+(t==="Assign"?"is an assignment. Python assignment is a STATEMENT (this target does not emit the walrus operator), so the emitted `s = x` is not valid in an expression position.":"is a declaration. Python has no declaration statement, so this target emits the EMPTY string for it \u2014 the declared name and its initializer would be silently DROPPED.")+" Give the block a VALUE statement (`Block(s \u2254 x; s)`) and compile it with compileFunction() instead \u2014 that route emits a `def`.")}function vc(e,n){let t=new RegExp(`(?<![\\w.])${n}(?!\\w)`);for(let r of e.split(`
`))if(t.test(r))return r.startsWith(`${n} = `)?!t.test(r.slice(n.length+3)):!1;return!1}function dm(e,n){if(cp(e,n),vt(n))return;let t=In(n);if(t!==void 0)throw pp(e,t)}function cp(e,n,t=!1){let r=t?pa:Yn,o=n;for(;b(o,"Block")&&o.ops.length>0;)o=o.ops[o.ops.length-1];if(o=p.tailValue(o,!0),b(o,"If")&&(r(o.ops[1])||r(o.ops[2])))throw new Error(`Could not compile ${nn(e)}: the body's value statement is a selection whose branches are statements, which Python writes as an \`if:\`/\`else:\` block \u2014 and a block cannot be returned, so this route would emit \`return if \u2026:\`. Give the block a VALUE statement (\`Block(If(c, r \u2254 1, r \u2254 2); r)\`), which compiles to the \`if\` block followed by \`return r\`.`);if(t&&b(o,"If")){let i=Ro(o);if(i.has("control")&&i.has("value"))throw new Error(`Could not compile ${nn(e)}: the body's value statement is a selection that mixes a control-flow branch (\`Break\`, \`Continue\` or a loop) with a value branch. Python writes such a selection as an \`if:\`/\`else:\` block, which has no value, so the value of the other branch would be lost.`)}}function mm(e,n,t){if(!vt(n))return;let r=t.split(`
`),o=/^return\s+([^\s;]+);?$/.exec(r[r.length-1]);if(!(r.length>1&&o!==null&&r[r.length-2].startsWith(`${o[1]} = `)))throw pp(e,In(n)??"Assign")}function pp(e,n){return new Error(`Could not compile ${nn(e)}: the body's value statement is `+(n==="Assign"?"an assignment":"a declaration (which this target emits as nothing at all)")+`, and a Python statement cannot be returned \u2014 this route would emit \`return ${n==="Assign"?"s = x":""}\`, which does not parse. Give the block a VALUE statement (\`Block(s \u2254 x; s)\`), which compiles to \`def f(x):\\n    s = x\\n    return s\`.`)}function xc(e,n,t,r,o){let i=t.length===1?"float('nan')":"None",s=!1,a=t.map(u=>gn(u)?`${e}(${r(u)})`:gp(u)||Sa(u.type.type)?(s=!0,`(lambda _v: float('nan') if _v is None else (${i} if np.size(_v) == 0 else ${e}(_v)))(${r(u)})`):r(u));if(a.length===0)return e==="np.max"?"-np.inf":"np.inf";if(a.length>1&&s)return`(lambda _ys: float('nan') if len(_ys) == 0 else ${e}(_ys))([_y for _y in (${a.join(", ")}) if _y is not None])`;if(a.length===1&&!gn(t[0]))return Hc(t[0],a[0],o);let l=a[0];for(let u=1;u<a.length;u++)l=`${n}(${l}, ${a[u]})`;return l}function wc(e,n,t){if(e[0]==null)throw new Error("Could not compile `Transpose`: missing argument");let r=t?`${t}(${n(e[0])})`:n(e[0]);if(e.length<3)return`np.transpose(${r})`;if(e.length>3||e[1]==null||e[2]==null)throw new Error("Could not compile `Transpose`: only the (value) and (value, axis1, axis2) forms compile.");return`np.swapaxes(${r}, int(${n(e[1])}) - 1, int(${n(e[2])}) - 1)`}function $c(e,n){if(n!==void 0&&(kr(p.collectionElementTypeOf(n))||Dt(n.type.type,!1)))throw new Error(`Could not compile \`${e}\`: a built-in fold over elements that are collections. The interpreter evaluates it instead.`)}var Ec={"np.mean":"Mean","np.median":"Median","np.var":"Variance","np.std":"StandardDeviation"};function Po(e,n,t,r=""){if(n.length===0||n[0]==null)throw new Error(`Could not compile \`${e}\`: no argument`);let o=n.length===1?n[0]:void 0;if(o!==void 0&&!kr(dt(X(o.type.type)))&&!Dt(o.type.type,!0)&&Dt(o.type.type,!1)){let s=Ec[e]??e;return`(lambda _d: ${e}(_d${r}) if np.ndim(_d) <= 1 else (_ for _ in ()).throw(TypeError('${s}: an element of the data is a list at run time')))(${t(o)})`}if(n.some(s=>kr(dt(X(s.type.type)))||Dt(s.type.type,!1)))throw new Error(`Could not compile \`${Ec[e]??e}\`: an element of the data is a collection (a list, a string, a set or a dictionary). The interpreter evaluates it instead.`);if(n.length===1)return`${e}(${t(n[0])}${r})`;let i=n.map(s=>gn(s)?`*${t(s)}`:t(s));return`${e}([${i.join(", ")}]${r})`}function ko(e,n,t,r){if(n.length<2)throw new Error(`Could not compile \`${e}\`: expected at least two operands`);if(Bc(r,n),wr(r,n),Zd(r,n),Qd(r,n),n.length===2)return`_ce_ord(${e}, ${t(n[0])}, ${t(n[1])})`;let o=n.map((s,a)=>`_r${a}`),i=`_ce_ord(${e}, ${o[0]}, ${o[1]})`;for(let s=1;s<n.length-1;s++)i=`np.logical_and(${i}, _ce_ord(${e}, ${o[s]}, ${o[s+1]}))`;return`(lambda ${o.join(", ")}: ${i})(${n.map(s=>t(s)).join(", ")})`}function Cc(e,n,t,r){if(t.length===0||t[0]==null)throw new Error(`Could not compile \`${n}\`: no operand`);dp(e,t,"list<boolean>");let o=r(t[0]);for(let i=1;i<t.length;i++)o=`_ce_ord(${n}, ${o}, ${r(t[i])})`;return o}var hm=new Set(["Not","Argument"]);function dp(e,n,t){n.forEach((r,o)=>{let i=X(r.type.type);if(!(i!=="never"&&q(i,"boolean"))&&!(i!=="never"&&!bt(r)&&q(i,t)))throw new Error(`Could not compile \`${e}\`: operand ${o+1} has the type \`${r.type.toString()}\`. A logical connective over a collection compiles only when every operand is a boolean or a collection of the type \`${t}\`. The interpreter evaluates it instead.`)})}function Sc(e,n,t){if(n.length===0)return"[]";let r=n.findIndex(i=>C(i,"Missing")||C(i,"Undefined"));if(r>=0)throw new Error(`Could not compile \`${e}\`: operand ${r+1} is absent, and the interpreter answers \`Missing\` for the whole join. The interpreter evaluates it instead.`);let o=i=>yt(i)||!Se(X(i.type.type),vn);return`[${n.map((i,s)=>o(i)?t(i):`*${ee(e,i,t,s+1)}`).join(", ")}]`}function ee(e,n,t,r){if(n&&n.type.matches("string"))throw new Error(`Could not compile \`${e}\`: a string collection \u2014 a string's elements are UAX #29 grapheme clusters and Python has no stdlib grapheme segmentation, so the emitted code would walk code points instead. The interpreter evaluates it.`);if(n&&wr(e,[n]),n&&Ur(n))throw new Error(`Could not compile \`${e}\`: ${r!==void 0?`operand ${r}`:"the operand"} may be text at run time (type \`${n.type.toString()}\`), and Python has no stdlib grapheme segmentation. The interpreter evaluates it.`);if(!n||!(n.type.matches("list<any>")||n.type.matches("indexed_collection<any>")))throw new Error(`Could not compile \`${e}\`: ${r!==void 0?`operand ${r}`:"operand"} is not an indexed collection (list/vector/range).`);return t(n)}function gm(e){let n=Qe(X(e.type.type));return mp(Ca(n))}function mp(e){let n=e===void 0?void 0:Qe(X(e)),t=n!==void 0&&typeof n!="string"&&n.kind==="union"&&!q(n,"number")&&n.types.some(o=>{let i=X(o);return i==="unknown"||i==="any"||q(i,"number")});return n!==void 0&&!t&&n!=="unknown"&&n!=="any"&&n!=="never"?q(n,"number")?"float('nan')":"None":`((lambda _c: float('nan') if len(_c) > 0 and all(isinstance(_x, (int, float, complex, np.number)) and not isinstance(_x, (bool, np.bool_)) for _x in _c) else None)([_x for _x in ${t?"list(_l)":"list(_l)[:10]"} if _x is not None]) if isinstance(_l, (list, tuple, np.ndarray)) else None)`}function hp(e,n){let t=gm(e);if(n===void 0||!Number.isInteger(n)||n===0)return{absent:t,outOfRange:t};let r=X(e.type.type),o=hl(r,n),i=o===void 0?t:mp(o),s=X(Qe(r)),a=typeof s!="string"&&s.kind==="tuple";return{absent:gl(e,n)?"float('nan')":a?"None":t,outOfRange:i}}function Lo(e,n,t,r){let o;if(n!==void 0&&Bt(n.type.type)){let l=Qe(X(n.type.type));l==="never"||q(l,"string")||!q(l,Xn)||Ur(n)?o=ee(e,n,r):(wr(e,[n]),o=r(n))}else o=ee(e,n,r);let{absent:i,outOfRange:s}=hp(n,t<0?t:t+1),a=t<0?`_l[${t}] if len(_l) >= ${-t}`:`_l[${t}] if len(_l) > ${t}`;return`(lambda _l: ${i} if _l is None else (${a} else ${s}))(${o})`}function gp(e){let n=X(e.type.type);return n==="unknown"||n==="any"||n==="value"||n==="string"?!1:typeof n=="object"&&n.kind==="union"?n.types.some(t=>q(t,Xn)):q(n,Xn)}function _m(e){let n=t=>{let r=X(t);return typeof r=="string"?!1:r.kind==="broadcastable"?!0:r.kind==="union"&&r.types.some(n)};return n(e.type.type)}function bm(e){return q(X(e.type.type),"number")}function Ee(e,n,t,r=[],o){p.assertCallbackAnnotations(e,n,r);let i=Ll[e];if(i!==void 0&&n!==void 0&&Al(e,n)){if(i==="select"){let s=$a(X(n.type.type));if(s===void 0||Se(s,"nan"))throw new Error(`Could not compile \`${e}\` to Python: the predicate may return \`NaN\``+(s===void 0?"":` (its result type is \`${Ce(s)}\`)`)+", which this target cannot tell apart from the absent value `Missing`. The interpreter reports `NaN` as a predicate result that is not a boolean, and skips `Missing`. The interpreter evaluates it instead.")}return`_ce_predicate(${zc(e,n,t,r,o)}, '${e}', '${i}')`}return zc(e,n,t,r,o)}function zc(e,n,t,r,o){return p.withCheckedCallback(e,n,r,void 0,()=>(ym(e,n,r),vm(e,n,t)),o)}function ca(e,n=new Set){if(n.has(e)||(n.add(e),p.isNominalAtomicType(e)))return!1;let t=X(e);return t==="unknown"||t==="any"||t==="value"||t==="expression"||t==="never"||q(t,"string")?!1:typeof t!="string"&&t.kind==="union"?t.types.some(r=>ca(r,n)):q(t,"collection")}function ym(e,n,t){let r=n&&(qo(n)??n);if(!r||!b(r,"Function"))return;let o=r.ops.slice(1),i=X(r.type.type),s=typeof i!="string"&&i.kind==="signature"?i.args:void 0,a;for(let[l,u]of t.entries()){let f=o[l];if(f===void 0)break;if(u===void 0||!ca(u))continue;let c=Mo(f),m=c!==void 0&&Oo(c),d=s?.[l]?.type,g=(c===void 0||c==="unknown")&&(d===void 0||!ca(d));if(!m&&!g)continue;let _=xn(f);if(a??=Ho(r.ops[0]),!(!_||!a.has(_)))throw m?new Error(`Could not compile \`${e}\`: parameter ${l+1} of the function receives a value of the type \`${Ce(u)}\`, which can be a collection, and it is declared \`${Ce(c)}\`. The interpreter binds the collection whole and maps each element-wise operator of the body over it. The Python lambda reads the parameter as a scalar, and the Python operators repeat or concatenate a list. Declare the parameter with a collection type (for example \`list<number>\`).`):new Error(`Could not compile \`${e}\`: parameter ${l+1} of the function receives a value of the type \`${Ce(u)}\`, which can be a collection, but the function is compiled with this parameter read as a scalar`+(d===void 0?"":` (its type is \`${Ce(d)}\`)`)+". The Python operators repeat or concatenate a list where the interpreter maps over it. The interpreter evaluates it instead.")}}function vm(e,n,t){let r=n&&(qo(n)??n);if(r&&b(r,"Function"))return t(r);if(r&&C(r)){let o={Add:"+",Subtract:"-",Multiply:"*",Divide:"/"}[r.symbol];if(o!==void 0)return`(lambda _a, _b: _a ${o} _b)`}throw new Error(`Could not compile \`${e}\`: the function operand has no Python form (only function literals and binary arithmetic operator symbols lower to a Python lambda).`)}var xm=e=>`${e} == ${e}`,Wn=e=>p.isAtomicSource(e)?e:`(${e})`,ma=/^[\w.]+$/,xr=e=>`isinstance(${e}, (bool, np.bool_))`,pt={decidedNumber:xm,and:"and",not:"not ",undecided:"None",trueValue:"True",falseValue:"False",isTrue:e=>`${e} is not None and ${e}`,isFalse:e=>`${e} is not None and not ${e}`,isUndecided:e=>`${e} is None`,kleeneOfValue:(e,n)=>`((${n?`not ${e}`:e}) if ${xr(e)} else None)`,ternary:(e,n,t)=>`(${n} if ${e} else ${t})`,bind:(e,n,t)=>`(lambda ${e.join(", ")}: ${n})(${t.join(", ")})`};p.conditionDialects.set("python",pt);function Pc(e){return b(e,"When")||Bt(e.type.type)}function ra(e,n){let t=e.filter(o=>o!==void 0&&!_p(o,n)),r=(t.length>0?t:e).flatMap(o=>o===void 0?[]:[o.type.type]);return p.absenceKind(r,n)==="object"?"None":"float('nan')"}function _p(e,n){return!C(e,"Missing")&&!C(e,"Undefined")?!1:n.boundVars?.has(e.symbol)!==!0&&n.varsKeys?.has(e.symbol)!==!0}function oa(e,n,t,r){return t==="None"&&_p(e,r)?"None":n()}function bp(e){let n=e.test;return n.kind==="value"?!0:n.kind==="connective"?n.operands.some(bp):!1}function kc(e,n,t,r,o,i="float('nan')"){let s=p.conditionDecidability(e,o.bindExpr!==void 0,o);if(s===null)return`((${n}) if (${r(e)}) else (${t}))`;if(s.test.kind==="value"||s.test.kind==="connective"){let u=s.test.kind==="connective",{expr:f,negate:c}=u?{expr:e,negate:!1}:p.peelNegations(e),m=u?p.kleeneCondition(s,o,pt):r(f),d=g=>`((${n}) if (${xr(g)} and ${c?`not ${g}`:g}) else ((${t}) if ${xr(g)} else ${i}))`;return ma.test(m)?d(m):`(lambda _CND: ${d("_CND")})(${m})`}let{value:a,bindings:l}=p.withConditionOperands(s.test.operands,o,o.bindExpr!==void 0,u=>{let f=r(e);return u.length===0?`((${n}) if (${f}) else (${t}))`:`(((${n}) if (${f}) else (${t})) if (${u.join(" and ")}) else ${i})`},pt);return l.length===0?a:o.bindExpr(l,a)}function Yn(e){if(e===void 0)return!1;if(In(e)==="Assign")return!0;if(!b(e))return!1;let n=e.operator;return n==="Break"||n==="Continue"||n==="Return"||n==="Loop"?!0:n==="Block"?e.ops.length!==1||Yn(e.ops[0]):n==="If"?Yn(e.ops[1])||Yn(e.ops[2]):!1}function pa(e){if(!Yn(e))return!1;let n=e;for(;b(n,"Block")&&n.ops.length>0;)n=n.ops[n.ops.length-1];return b(n,"If")?pa(n.ops[1])||pa(n.ops[2]):!(b(n)&&["Break","Continue","Return","Loop"].includes(n.operator))}function Ro(e,n=new Set){return e===void 0||C(e,"Nothing")?n:b(e,"Block")?(e.ops.length>0&&Ro(e.ops[e.ops.length-1],n),n):b(e,"If")?(Ro(e.ops[1],n),Ro(e.ops[2],n),n):(b(e)&&["Break","Continue","Loop"].includes(e.operator)?n.add("control"):n.add("value"),n)}function yp(e,n,t){let r=e[0];if(r===void 0||e[1]===void 0)throw new Error("Could not compile `If`: wrong number of arguments");let o=m=>p.withCseScope(t,m,n,()=>Go(e[m],n)),i=m=>p.compileOp(t,0,n,0,m),s=(m,d)=>`${m}
${To(d)}`,a=e.length>2&&e[2]!==void 0,l=p.conditionDecidability(r,!0,n);if(l===null){let m=s(`if ${i(r)}:`,o(1));return a?`${m}
${s("else:",o(2))}`:m}let u=l.test.kind;if(u==="value"||u==="connective"){let m=u==="connective",{expr:d,negate:g}=m?{expr:r,negate:!1}:p.peelNegations(r),_=m?p.withCseOperand(t,0,n,()=>p.kleeneCondition(l,n,pt)):i(d),x="",v=_;ma.test(_)||(v=p.tempVar(n),x=`${v} = ${_}
`);let E=xr(v),S=s(`if ${E} and ${g?`not ${v}`:v}:`,o(1));return a&&(S+=`
${s(`elif ${E}:`,o(2))}`),x+S}let{value:f,bindings:c}=p.withConditionOperands(l.test.operands,n,!0,m=>{let d=i(r);if(a){let _=`${s(`if ${d}:`,o(1))}
${s("else:",o(2))}`;return m.length===0?_:s(`if ${m.join(" and ")}:`,_)}let g=m.length===0?d:[...m,`(${d})`].join(" and ");return s(`if ${g}:`,o(1))},pt);return c.length===0?f:`${c.map(([m,d])=>`${m} = ${d}`).join(`
`)}
${f}`}function Lc([e,n],t,r){let o=r?"GammaRegularized":"Gamma";if(e==null||n==null)throw new Error(`Could not compile \`${o}\`: missing argument`);if(!r){let l=[e,n].find(u=>p.isProvablyNonReal(u));if(l!==void 0)throw new gt({code:"non-real-operand",kind:"capability",message:`Could not compile \`Gamma\`: the operand \`${l.toString()}\` is certainly not a real number, and this target's lowering of the upper incomplete gamma is real-only.`})}let i=t(e),s=t(n),a=ne(e);if(a!==void 0){if(r&&a>=1e-20)return`scipy.special.gammaincc(${i}, ${s})`;if(!r&&ct&&a>=25e-5&&a<=7.5)return`(scipy.special.gammaincc(${i}, ${s}) * scipy.special.gamma(${i}))`}return`_ce_ugamma(${i}, ${s}, ${r?"True":"False"})`}function wm(e,n,t,r,o){let i=n.isCollection===!0||n.type.matches("collection<any>");if(i?n.type.matches("collection<real>"):!p.isComplexValued(n))return`${e}(${r(n)})`;let s=p.tempVar(o);return i?`(lambda ${s}: ${e}(_ce_creal_elems(${s})))(${r(n)})`:`(lambda ${s}: (${e}(_ce_creal(${s})) if _ce_cisreal(${s}) else ${t(s)}))(${r(n)})`}var $m={__proto__:null,Arcsin:{fn:"asin",cut:"real"},Arccos:{fn:"acos",cut:"real"},Arctan:{fn:"atan",cut:"atan"},Arsinh:{fn:"asinh",cut:"asinh"},Arcosh:{fn:"acosh",cut:"above"},Artanh:{fn:"atanh",cut:"real"},Arccsc:{fn:"asin",cut:"real",at0:"complex(float('nan'), float('nan'))"},Arcsec:{fn:"acos",cut:"real",at0:"complex(float('nan'), float('nan'))"},Arccot:{fn:"atan",cut:"atan"},Arcsch:{fn:"asinh",cut:"asinh",at0:"complex(float('nan'), float('nan'))"},Arsech:{fn:"acosh",cut:"above",at0:"complex(float('inf'), 0.0)"},Arcoth:{fn:"atanh",cut:"real",at0:"complex(0.0, np.pi / 2)"}};function Je(e,n){return(t,r,o)=>{let i=t[0];if(i==null)throw new Error(`Could not compile \`${e}\`: no argument`);let s=i.isCollection===!0||i.type.matches("collection<any>");if(s?i.type.matches("collection<real>"):!p.isComplexValued(i))return typeof n=="string"?`${n}(${r(i)})`:n(t,r,o);let{fn:a,cut:l,at0:u}=$m[e],f=u!==void 0||e==="Arccot",c=(g,_)=>{let x=l==="real"?`(complex(${g}.real, -0.0 if ${g}.real > 0 else 0.0) if ${_}.imag == 0 else ${g})`:l==="above"?`(complex(${g}.real, 0.0) if ${_}.imag == 0 else ${g})`:`(complex(-0.0 if ${g}.imag < 0 else 0.0, ${g}.imag) if ${_}.real == 0 else ${g})`,v=`cmath.${a}(${x})`;return a==="atanh"?`(complex(${g}.real * float('inf'), 0.0) if ${g}.imag == 0 and abs(${g}.real) == 1 else ${v})`:a==="atan"?`(complex(float('inf'), float('inf')) if ${g}.real == 0 and abs(${g}.imag) == 1 else ${v})`:v},m=p.tempVar(o),d;if(!f)d=`lambda ${m}: ${c(m,m)}`;else{let g=p.tempVar(o),_=`(lambda ${g}: ${c(g,m)})(1 / ${m})`,x=e==="Arccot"?`complex(cmath.phase(complex(${m}.real, 1.0)), 0.0) if ${m}.imag == 0`:`${u} if ${m} == 0`;d=`lambda ${m}: ${x} else ${_}`}return s?`np.vectorize(${d}, otypes=[complex])(${r(i)})`:`(${d})(${r(i)})`}}function Em(e,n,t){if(!b(e,"Function"))return;let r=e.ops.slice(1),o;for(let[i,s]of n.entries()){let a=r[i];if(a===void 0)break;if(s.isCollection!==!0&&!Ar(s)||p.isNominalAtomicType(s.type.type))continue;let l=Fa(s),u=jo(s)||l,f=Mo(a)??"unknown";if(l&&f!=="never"&&q(X(f),"string"))continue;let c=Ra(f);if(!c&&!Oo(f))continue;let m=xn(a);if((t||!c||u)&&(o??=Ho(e.ops[0]),!m||!o.has(m)))continue;if(l)throw new Error(`Could not compile \`${t?"ApplyWhole":"Apply"}\`: argument ${i+1} is a string, and the body reads the parameter \`${m}\`, which is not declared \`string\`: the Python operators \`*\` and \`+\` repeat or concatenate a string where the interpreter does not. Declare the parameter \`string\`.`);let d=c&&!t&&!u?"the interpreter maps the function over the elements of the collection, and the Python target has no such map for a function literal":`the body reads the parameter \`${m}\` as a scalar, while the interpreter binds the collection whole and maps each element-wise operator over it (the Python operators repeat or concatenate a list)`;throw new Error(`Could not compile \`${t?"ApplyWhole":"Apply"}\`: argument ${i+1} has the type \`${s.type.toString()}\`, which can be a collection, and its parameter is not declared with a collection type: ${d}. Declare the parameter with a collection type (for example \`list<number>\`).`)}}function vp(e,n,t,r){let o=t?"ApplyWhole":"Apply";if(e[0]==null)throw new Error(`Could not compile \`${o}\`: missing function`);if(b(e[0],"Function")){n=p.checkedAppliedLiteralCompile(e[0],e.slice(1),n);let i=e[0],s=t?void 0:p.appliedLiteralNamedPointCall(i,e.slice(1),e.slice(1).map(l=>n(l)),n,()=>n(i),r);if(s!==void 0)return s;let a=t?void 0:p.appliedLiteralPointListCall(i,e.slice(1),e.slice(1).map(l=>n(l)),n,()=>n(i),r);if(a!==void 0)return a;if(!t&&i.nops===e.length&&Ua(i.type.type)&&e.slice(1).some(l=>(ll(l,r)??0)>0||Ka(l.type.type)))return p.emitUserFunctionCall(`(${n(i)})`,e.slice(1),r,e.slice(1).map(()=>!1),!0);Em(e[0],e.slice(1),t)}return`(${n(e[0])})(${e.slice(1).map(i=>n(i)).join(", ")})`}var da={__proto__:null,Add:(e,n)=>e.length===0?"0":e.length===1?n(e[0]):e.map(t=>n(t)).join(" + "),Multiply:(e,n)=>e.length===0?"1":e.length===1?n(e[0]):e.map(t=>Wn(n(t))).join(" * "),Negate:(e,n)=>`(-(${n(e[0])}))`,Divide:(e,n)=>{if(e.length===0)return"1";if(e.length===1)return n(e[0]);if(e.length===2)return`(${n(e[0])}) / (${n(e[1])})`;let t=`(${n(e[0])})`;for(let r=1;r<e.length;r++)t=`${t} / (${n(e[r])})`;return t},Sin:(e,n)=>{if(p.isComplexValued(e[0]))return`cmath.sin(${n(e[0])})`;let t=p.piMultiple(e[0]);return t!==void 0?So(n(t),"sin"):`np.sin(${n(e[0])})`},Cos:(e,n)=>{if(p.isComplexValued(e[0]))return`cmath.cos(${n(e[0])})`;let t=p.piMultiple(e[0]);return t!==void 0?So(n(t),"cos"):`np.cos(${n(e[0])})`},Tan:(e,n)=>{if(p.isComplexValued(e[0]))return`cmath.tan(${n(e[0])})`;let t=p.piMultiple(e[0]);return t!==void 0?So(n(t),"tan"):Co(n(e[0]),"np.tan(_x)")},Arcsin:Je("Arcsin","np.arcsin"),Arccos:Je("Arccos","np.arccos"),Arctan:Je("Arctan","np.arctan"),Arctan2:"np.arctan2",Sinh:(e,n)=>{if(p.isComplexValued(e[0])){let t=p.imaginaryPiMultiple(e[0]);return t!==void 0?It(n(t),"Sinh"):`cmath.sinh(${n(e[0])})`}return`np.sinh(${n(e[0])})`},Cosh:(e,n)=>{if(p.isComplexValued(e[0])){let t=p.imaginaryPiMultiple(e[0]);return t!==void 0?It(n(t),"Cosh"):`cmath.cosh(${n(e[0])})`}return`np.cosh(${n(e[0])})`},Tanh:(e,n)=>{if(p.isComplexValued(e[0])){let t=p.imaginaryPiMultiple(e[0]);return t!==void 0?It(n(t),"Tanh"):`cmath.tanh(${n(e[0])})`}return`np.tanh(${n(e[0])})`},Arsinh:Je("Arsinh","np.arcsinh"),Arcosh:Je("Arcosh","np.arccosh"),Artanh:Je("Artanh","np.arctanh"),Cot:([e],n)=>{if(e===null)throw new Error("Could not compile `Cot`: no argument");return p.isComplexValued(e)?`(np.cos(${n(e)}) / np.sin(${n(e)}))`:Co(n(e),"1 / np.tan(_x)")},Csc:([e],n)=>{if(e===null)throw new Error("Could not compile `Csc`: no argument");return p.isComplexValued(e)?`(1 / np.sin(${n(e)}))`:Co(n(e),"1 / np.sin(_x)")},Sec:([e],n)=>{if(e===null)throw new Error("Could not compile `Sec`: no argument");return p.isComplexValued(e)?`(1 / np.cos(${n(e)}))`:Co(n(e),"1 / np.cos(_x)")},Degrees:([e],n)=>{if(e===null)throw new Error("Could not compile `Degrees`: no argument");return`(${Wn(n(e))} * np.pi / 180)`},Arccot:Je("Arccot",([e],n)=>{if(e===null)throw new Error("Could not compile `Arccot`: no argument");return`(np.pi / 2 - np.arctan(${n(e)}))`}),Arccsc:Je("Arccsc",([e],n)=>{if(e===null)throw new Error("Could not compile `Arccsc`: no argument");return`np.arcsin(1 / (${n(e)}))`}),Arcsec:Je("Arcsec",([e],n)=>{if(e===null)throw new Error("Could not compile `Arcsec`: no argument");return`np.arccos(1 / (${n(e)}))`}),Coth:([e],n)=>{if(e===null)throw new Error("Could not compile `Coth`: no argument");let t=p.isComplexValued(e)?p.imaginaryPiMultiple(e):void 0;return t!==void 0?It(n(t),"Coth"):`(np.cosh(${n(e)}) / np.sinh(${n(e)}))`},Csch:([e],n)=>{if(e===null)throw new Error("Could not compile `Csch`: no argument");let t=p.isComplexValued(e)?p.imaginaryPiMultiple(e):void 0;return t!==void 0?It(n(t),"Csch"):`(1 / np.sinh(${n(e)}))`},Sech:([e],n)=>{if(e===null)throw new Error("Could not compile `Sech`: no argument");let t=p.isComplexValued(e)?p.imaginaryPiMultiple(e):void 0;return t!==void 0?It(n(t),"Sech"):`(1 / np.cosh(${n(e)}))`},Arcoth:Je("Arcoth",([e],n)=>{if(e===null)throw new Error("Could not compile `Arcoth`: no argument");return`np.arctanh(1 / (${n(e)}))`}),Arcsch:Je("Arcsch",([e],n)=>{if(e===null)throw new Error("Could not compile `Arcsch`: no argument");return`np.arcsinh(1 / (${n(e)}))`}),Arsech:Je("Arsech",([e],n)=>{if(e===null)throw new Error("Could not compile `Arsech`: no argument");return`np.arccosh(1 / (${n(e)}))`}),Lb:"np.log2",Square:([e],n)=>{if(e===null)throw new Error("Could not compile `Square`: no argument");return`np.square(${n(e)})`},Fract:([e],n)=>{if(e===null)throw new Error("Could not compile `Fract`: no argument");return`np.modf(${n(e)})[0]`},Exp:(e,n)=>p.isComplexValued(e[0])?`cmath.exp(${n(e[0])})`:`np.exp(${n(e[0])})`,Ln:(e,n)=>p.isComplexValued(e[0])?(p.recordPromotion("Ln",e),`cmath.log(${n(e[0])})`):p.promotesRadicalToComplex("Ln",e)?`np.emath.log(${n(e[0])})`:`np.log(${n(e[0])})`,Log:(e,n)=>{let t=p.promotesRadicalToComplex("Log",e),r=p.fixedLogBase(e);if(r!==void 0)return t?`np.emath.log${r}(${n(e[0])})`:`np.log${r}(${n(e[0])})`;if(e.length===2){let o=t?"np.emath.log":"np.log";return`(${o}(${n(e[0])}) / ${o}(${n(e[1])}))`}return"np.log10"},Log10:"np.log10",Log2:"np.log2",Exp2:"np.exp2",Power:(e,n,t)=>{if(e.length!==2)return"np.power";let r=p.negativeBaseFloatPower(e),o=!ct;if(C(e[0],"ExponentialE")){let s=p.eulerPiSplit(e[1]);if(s!==void 0){let a=So(n(s.u),"exp");return s.a===void 0?a:`(np.exp(${n(s.a)}) * ${a})`}}if(p.isComplexValued(e[0])||p.isComplexValued(e[1]))return p.recordPromotion("Power",e),r!==void 0&&o?`_ce_pow(${n(e[0])}, ${n(e[1])})`:`(${Wn(n(e[0]))} ** ${Wn(n(e[1]))})`;let i=p.realPowerExponent(e)??(typeof r=="object"?r:void 0);if(i!==void 0){let s=p.tempVar(t),a=`np.power(np.abs(${s}), ${i.value})`,l=i.oddNumerator?`(np.where(${s} < 0, -1.0, 1.0) * ${a})`:a;return`(lambda ${s}: ${l})(${n(e[0])})`}return p.promotesRadicalToComplex("Power",e)?r==="runtime"&&o?`_ce_pow(${n(e[0])}, ${n(e[1])}, np.emath.power)`:`np.emath.power(${n(e[0])}, ${n(e[1])})`:r==="runtime"?o?`_ce_pow(${n(e[0])}, ${n(e[1])})`:`(${Wn(n(e[0]))} ** ${Wn(n(e[1]))})`:`np.power(${n(e[0])}, ${n(e[1])})`},Sqrt:(e,n)=>p.isComplexValued(e[0])?(p.recordPromotion("Sqrt",e),`cmath.sqrt(${n(e[0])})`):p.promotesRadicalToComplex("Sqrt",e)?`np.emath.sqrt(${n(e[0])})`:`np.sqrt(${n(e[0])})`,Root:(e,n)=>{if(e.length!==2)return"np.power";let[t,r]=e;if(p.isComplexValued(t)||p.isComplexValued(r))return p.recordPromotion("Root",e),`(lambda _z, _n: complex(np.sign(_z.real) * np.power(abs(_z.real), 1.0 / _n.real)) if _z.imag == 0 and _n.imag == 0 and _n.real % 2 == 1 else _z ** (1.0 / _n))(complex(${n(t)}), complex(${n(r)}))`;let o=ne(r),i=p.realRootDegreeTerms(r);if(o!==void 0&&(Number.isInteger(o)&&o%2!==0||i?.oddNumerator===!0)){let s=n(t);return`(np.sign(${s}) * np.power(np.abs(${s}), 1.0 / ${n(r)}))`}return o!==void 0&&i!==void 0?`np.power(np.abs(${n(t)}), 1.0 / ${n(r)})`:p.promotesRadicalToComplex("Root",e)?`np.emath.power(${n(t)}, 1.0 / ${n(r)})`:`np.power(${n(t)}, 1.0 / ${n(r)})`},Abs:(e,n)=>p.isComplexValued(e[0])?`abs(${n(e[0])})`:`np.abs(${n(e[0])})`,Sign:(e,n,t)=>wm("np.sign",e[0],r=>`${r} / abs(${r})`,n,t),Floor:(e,n)=>zo("Floor","np.floor",e,n),Ceil:(e,n)=>zo("Ceil","np.ceil",e,n),Round:(e,n)=>{let t=e[0];if(t==null)throw new Error("Could not compile `Round`: no argument");let r=t.engine.roundingTies;return e.length<2?la(n(t),r):zo("Round",o=>la(o,r),e,n,.5)},Truncate:(e,n)=>zo("Truncate","np.trunc",e,n),Min:(e,n,t)=>xc("np.min","np.minimum",e,n,t),Max:(e,n,t)=>xc("np.max","np.maximum",e,n,t),ElementMax:(e,n)=>{if(!e.some(gn)){if(e.length===1)return b(e[0])?`(${n(e[0])})`:n(e[0]);let t=n(e[0]);for(let r=1;r<e.length;r++)t=`np.maximum(${t}, ${n(e[r])})`;return t}return`_ce_bcast('max', ${e.map(t=>n(t)).join(", ")})`},ElementMin:(e,n)=>{if(!e.some(gn)){if(e.length===1)return b(e[0])?`(${n(e[0])})`:n(e[0]);let t=n(e[0]);for(let r=1;r<e.length;r++)t=`np.minimum(${t}, ${n(e[r])})`;return t}return`_ce_bcast('min', ${e.map(t=>n(t)).join(", ")})`},Smoothstep:(e,n)=>e.some(gn)?`_ce_bcast('smoothstep', ${e.map(t=>n(t)).join(", ")})`:`_ce_smoothstep(${e.map(t=>n(t)).join(", ")})`,Clamp:(e,n)=>e.some(gn)?`_ce_bcast('clip', ${n(e[0])}, ${n(e[1])}, ${n(e[2])})`:`np.clip(${n(e[0])}, ${n(e[1])}, ${n(e[2])})`,Mod:([e,n],t)=>{if(e===null||n===null)throw new Error("Could not compile `Mod`: missing argument");return D(n)&&n.re===1&&!n.isComplex?`np.mod(${t(e)}, ${t(n)})`:bc("Mod",e,n,t)},Remainder:([e,n],t)=>{if(e===null||n===null)throw new Error("Could not compile `Remainder`: missing argument");return bc("Remainder",e,n,t)},Real:"np.real",Imaginary:"np.imag",Argument:(e,n)=>{if(e.length!==1)throw new Error("Could not compile `Argument`: expected one operand");return`np.angle(np.add(${n(e[0])}, 0))`},Conjugate:"np.conj",Sum:(e,n,t)=>dc("Sum",e,t),Product:(e,n,t)=>dc("Product",e,t),Mean:(e,n)=>Po("np.mean",e,n),Median:(e,n)=>Po("np.median",e,n),Variance:(e,n)=>Po("np.var",e,n,", ddof=1"),StandardDeviation:(e,n)=>Po("np.std",e,n,", ddof=1"),Covariance:([e,n],t)=>{if(e==null||n==null)throw new Error("Could not compile `Covariance`: expected two collection arguments");return`np.cov(${t(e)}, ${t(n)})[0][1]`},PopulationCovariance:([e,n],t)=>{if(e==null||n==null)throw new Error("Could not compile `PopulationCovariance`: expected two collection arguments");return`np.cov(${t(e)}, ${t(n)}, ddof=0)[0][1]`},Correlation:([e,n],t)=>{if(e==null||n==null)throw new Error("Could not compile `Correlation`: expected two collection arguments");return`np.corrcoef(${t(e)}, ${t(n)})[0][1]`},Dot:(e,n)=>{if(e[0]==null||e[1]==null)throw new Error("Could not compile `Dot`: missing argument");if(e.some(t=>p.isTupleOfTuples(t)))throw new Error("Could not compile `Dot`: a tuple of tuples is one point with nested coordinates, which the interpreter does not contract; write a list of points or a matrix.");if(e.some(t=>!jo(t)&&Do(t)))throw new Error("Could not compile `Dot`: a list of points has no single numpy spelling \u2014 `np.dot` contracts it as a matrix, but the interpreter answers one inner product per point.");if(e.some(t=>Pc(t)))throw new Error("Could not compile `Dot`: a restricted operand is absent when its condition is false, and `np.dot` has no answer for an absent operand where the interpreter answers the absence marker.");return`np.dot(${n(e[0])}, ${n(e[1])})`},Cross:(e,n)=>{if(e[0]==null||e[1]==null)throw new Error("Could not compile `Cross`: missing argument");if(e.some(t=>Pc(t)))throw new Error("Could not compile `Cross`: a restricted operand is absent when its condition is false, and `np.cross` has no answer for an absent operand where the interpreter answers the absence marker.");return`np.cross(${n(e[0])}, ${n(e[1])})`},Norm:(e,n)=>{if(e[0]==null)throw new Error("Could not compile `Norm`: missing argument");if(Do(e[0]))throw new Error("Could not compile `Norm`: a list of points has no numpy spelling \u2014 `np.linalg.norm` flattens it into one scalar, but the interpreter answers one norm per point.");let t=e[0].type.type;if(Bt(t)){let a=dt(X(Qe(t)));if(a!==void 0&&Ea(a))throw new Error("Could not compile `Norm`: a list of points that may hold absent points has no numpy spelling \u2014 `np.linalg.norm` flattens it into one scalar, but the interpreter answers one norm per point.")}let r=fm(e[0]);if(e.length<2)return Te(n(e[0]),void 0,r);let o=e[1],i=lm(e[0]);if(en(o)){let a={Infinity:"np.inf",Frobenius:"'fro'"}[o.string];if(a===void 0)throw new Error(`Could not compile \`Norm\`: the norm type "${o.string}" has no numpy spelling.`);return o.string==="Frobenius"&&i!==2?Te(n(e[0]),void 0,r):i===void 0?e[0].type.matches("number")?`np.abs(${n(e[0])})`:na(n(e[0]),a,"matrix",r):(hc(i),Te(n(e[0]),a,r))}let s=i===void 0&&e[0].type.matches("number");if(o.isSame(2)){if(i!==void 0&&i>=3)return Te(n(e[0]),void 0,r);if(s)return`np.abs(${n(e[0])})`;if(i===void 0)return na(n(e[0]),n(o),"two",r)}else if(!D(o)&&!o.isInfinity){let a=o.type.type;return s?Ao(n(e[0]),n(o),a,()=>"np.abs(_x) if _p > 0 else float('nan')"):i===void 0?cm(n(e[0]),n(o),a,r):i>=3?Ao(n(e[0]),n(o),a,()=>`${Te("_x",void 0,r)} if _p == 2 else float('nan')`):Ao(n(e[0]),n(o),a,l=>i===1?`${Te("_x","_p",r)} if _p > 0 else float('nan')`:Yc(l,r))}if(D(o)&&!(o.re>0))throw new Error("Could not compile `Norm`: the interpreter defines norms only for a positive order, but `np.linalg.norm` answers a value for this order.");if(i===2&&D(o)&&!o.isSame(1)&&!o.isSame(2)&&!(o.isInfinity&&o.isPositive===!0))throw new Error("Could not compile `Norm`: the interpreter defines matrix norms only for orders 1, 2 and +Infinity \u2014 `np.linalg.norm` would raise or diverge for this order.");if(i===void 0){if(s)return`np.abs(${n(e[0])})`;let a=o.isSame(1)||o.isInfinity===!0&&o.isPositive===!0;return na(n(e[0]),n(o),a?"matrix":"vector",r)}return hc(i),Te(n(e[0]),n(o),r)},Determinant:"np.linalg.det",Inverse:"np.linalg.inv",Transpose:(e,n)=>wc(e,n),MatrixMultiply:"np.matmul",ConjugateTranspose:(e,n)=>wc(e,n,"np.conjugate"),Diagonal:"np.diag",MatrixPower:"np.linalg.matrix_power",Rank:(e,n)=>{if(e[0]==null)throw new Error("Could not compile `Rank`: missing argument");let t=ei(e[0]);if(t!==void 0)throw new Error(`Could not compile \`Rank\`: the operand ${t}.`);return`np.ndim(${n(e[0])})`},RowReduce:(e,n)=>`_ce_rref(${n(e[0])})`,Equal:(e,n,t)=>pc("Equal",e,n,t),NotEqual:(e,n,t)=>pc("NotEqual",e,n,t),Less:(e,n)=>ko("np.less",e,n,"Less"),LessEqual:(e,n)=>ko("np.less_equal",e,n,"LessEqual"),Greater:(e,n)=>ko("np.greater",e,n,"Greater"),GreaterEqual:(e,n)=>ko("np.greater_equal",e,n,"GreaterEqual"),And:(e,n)=>Cc("And","np.logical_and",e,n),Or:(e,n)=>Cc("Or","np.logical_or",e,n),Not:(e,n)=>{if(e.length!==1)throw new Error("Could not compile `Not`: expected one operand");return dp("Not",e,"tensor<boolean>"),`np.logical_not(${n(e[0])})`},If:(e,n,t)=>{if(e.length!==3)throw new Error("Could not compile `If`: wrong number of arguments");if(Yn(e[1])||Yn(e[2]))return yp(e,t,p.cseParentNode());let r=ra([e[1],e[2]],t);return kc(e[0],oa(e[1],()=>n(e[1],1),r,t),oa(e[2],()=>n(e[2],2),r,t),o=>n(o),t,r)},When:(e,n,t)=>{if(e.length!==2)throw new Error("Could not compile `When`: expected exactly 2 arguments (expr, cond)");if(p.assertScalarCondition(e[1],t),C(e[1],"True"))return`(${n(e[0],0)})`;let r=ra([e[0]],t);if(C(e[1],"False"))return r;let o=p.conditionDecidability(e[1],t.bindExpr!==void 0,t);if(o===null||!bp(o)){let m=n(e[1]);return`((${n(e[0],0)}) if (${m}) else ${r})`}let i=o.test.kind==="connective",{expr:s,negate:a}=i?{expr:e[1],negate:!1}:p.peelNegations(e[1]),l=i?p.kleeneCondition(o,t,pt):n(s),u=n(e[0],0),f=m=>`((${u}) if (${xr(m)} and ${a?`not ${m}`:m}) else ${r})`;if(ma.test(l))return f(l);let c=p.tempVar(t);return`(lambda ${c}: ${f(c)})(${l})`},Which:(e,n,t)=>{if(e.length<2||e.length%2!==0)throw new Error("Could not compile `Which`: expected condition/value pairs");for(let i=0;i<e.length;i+=2)p.assertScalarCondition(e[i],t);let r=ra(e.filter((i,s)=>s%2===1),t),o=i=>{if(i>=e.length)return r;let s=e[i],a=e[i+1],l=()=>oa(a,()=>n(a,i+1),r,t);return C(s,"True")?`(${l()})`:kc(s,l(),o(i+2),u=>i===0?n(u):n(u,i),t,r)};return o(0)},Match:()=>{throw new Error("Could not compile `Match`: pattern matching is not supported by the Python compile target in v1.")},Loop:(e,n,t)=>qc(e,t,p.cseParentNode()),Comprehension:(e,n,t)=>am(e,t,p.cseParentNode()),Erf:"scipy.special.erf",Erfc:"scipy.special.erfc",Gamma:(e,n)=>{let t=e[0];if(t==null)throw new Error("Could not compile `Gamma`: no argument");return e.length<2?`scipy.special.gamma(${n(t)})`:Lc(e,n,!1)},GammaLn:([e],n,t)=>{if(e===null)throw new Error("Could not compile `GammaLn`: no argument");let r="Could not compile `GammaLn`: scipy.special.loggamma takes another branch than the interpreter off the real axis; the compiled value would differ",o=()=>new gt({code:"non-real-operand",kind:"capability",message:`${r}.`});if(p.isProvablyNonReal(e))throw o();let i=e.isCollection===!0||e.type.matches("collection<any>");if(i?e.type.matches("collection<real>"):!p.isComplexValued(e))return`scipy.special.gammaln(${n(e)})`;if(!p.runtimeRealGuards)throw o();let s=`(_ for _ in ()).throw(ValueError('${r}'))`,a=p.tempVar(t);return i?`(lambda ${a}: scipy.special.gammaln(_ce_creal_elems(${a})) if np.all(np.isreal(${a})) else ${s})(${n(e)})`:`(lambda ${a}: scipy.special.gammaln(_ce_creal(${a})) if _ce_cisreal(${a}) else ${s})(${n(e)})`},Factorial:([e],n)=>{if(e===null)throw new Error("Could not compile `Factorial`: no argument");return`scipy.special.gamma((${n(e)}) + 1)`},GammaRegularized:(e,n)=>Lc(e,n,!0),BetaRegularized:([e,n,t],r)=>{if(e===null||n===null||t===null)throw new Error("Could not compile `BetaRegularized`: missing argument");return`scipy.special.betainc(${r(n)}, ${r(t)}, ${r(e)})`},List:(e,n)=>`[${e.map(t=>n(t)).join(", ")}]`,Matrix:(e,n)=>`np.array(${n(e[0])})`,Tuple:(e,n)=>{let t=e.map(r=>n(r));return t.length===1?`(${t[0]},)`:`(${t.join(", ")})`},Sequence:(e,n)=>`np.array([${e.map(t=>n(t)).join(", ")}])`,Range:(e,n)=>{if(e.length===0)return"[]";if(e.some(o=>o!=null&&zl(o)))throw new Error("Could not compile `Range`: a non-finite bound does not materialize.");let t=e.length===1?"1":n(e[0]),r=e.length===1?n(e[0]):n(e[1]);return e.length<=2?`(lambda _a, _b: (lambda _s: [float(_a + _s * _i) for _i in range(${sa("_a","_b","_s")})])(1 if _b >= _a else -1))(${t}, ${r})`:`(lambda _a, _b, _s: [] if _s == 0 else [float(_a + _s * _i) for _i in range(${sa("_a","_b","_s")})])(${t}, ${r}, ${n(e[2])})`},Function:(e,n,t)=>{if(e[0]==null)throw new Error("Could not compile `Function`: missing body");let r=e[0];for(;b(r,"Block")&&r.nops===1;)r=r.ops[0];if(b(r,"Block"))throw new Error("Could not compile `Function`: a multi-statement (Block) body has no Python lambda form.");p.assertNoDestructuringParams(e.slice(1)),p.assertNoRestParams(e.slice(1));let o=e.slice(1).map(u=>ft(xn(u)||"_")),i={...t,localFunctions:t.lexicalFunctions??t.localFunctions},s=p.compile(r.canonical,{...i,var:u=>o.includes(u)?u:t.var(u),...p.withBoundScope(i,o)}),a=[],l=[];return e.slice(1).forEach((u,f)=>{let c=Aa(u);if(c===void 0){a.push(o[f]);return}a.push(`${o[f]}=None`),l.push([o[f],n(La(c))])}),l.length===0?`(lambda ${a.join(", ")}: ${s})`:`(lambda ${a.join(", ")}: (lambda ${l.map(([u])=>u).join(", ")}: ${s})(${l.map(([u,f])=>`${f} if (lambda _c: ${yr})(${u}) else ${u}`).join(", ")}))`},Length:(e,n)=>`len(${ee("Length",e[0],n)})`,Count:(e,n)=>{if(e.length!==1)throw new Error("Could not compile `Count`: only the single-argument cardinality form compiles; the value and predicate forms (`Count(xs, v)`, `Count(xs, p)`) are not supported.");return`len(${ee("Count",e[0],n)})`},IsEmpty:(e,n)=>`(len(${ee("IsEmpty",e[0],n)}) == 0)`,At:(e,n,t)=>{let r=e[0],o=e[1];if(r==null||o==null||e.length!==2)throw new Error("Could not compile `At`: this lowering reads one index. The compiler rewrites a chained access `At(x, i, j)` to the nested access `At(At(x, i), j)` before it calls this lowering.");if(Ar(o)||_m(o))throw new Error(`Could not compile \`At\`: the index (type \`${o.type.toString()}\`) is or may be a collection (a gather or a mask), and the Python target lowers only a scalar index. The interpreter evaluates it.`);if(Ur(r))throw new Error(`Could not compile \`At\`: the first operand may be text at run time (type \`${r.type.toString()}\`), and Python has no stdlib grapheme segmentation. The interpreter evaluates it.`);let i=el.staticTypeOf(r,t);if(!(!q(i,"string")&&q(i,Xn))){if(!gp(r))throw new Error("Could not compile `At`: operand is not an indexed collection (list/vector/range).");if(!bm(o))throw new Error(`Could not compile \`At\`: the first operand is not provably an indexed collection (type \`${r.type.toString()}\`) and the index is not provably numeric, so a keyed (dictionary) access cannot be ruled out.`)}let{absent:a,outOfRange:l}=hp(r,D(o)&&Number.isInteger(o.re)?o.re:void 0);return`(lambda _l, _i: (${a} if _l is None else float('nan')) if not isinstance(_l, (list, tuple, np.ndarray)) else (_l[int(_i) - 1] if 1 <= _i <= len(_l) else (_l[int(_i)] if -len(_l) <= _i <= -1 else ${l})))(${n(r)}, ${n(o)})`},First:(e,n)=>Lo("First",e[0],0,n),Second:(e,n)=>Lo("Second",e[0],1,n),Third:(e,n)=>Lo("Third",e[0],2,n),Last:(e,n)=>Lo("Last",e[0],-1,n),Rest:(e,n)=>`${ee("Rest",e[0],n)}[1:]`,Most:(e,n)=>`${ee("Most",e[0],n)}[:-1]`,Take:(e,n)=>{let t=ee("Take",e[0],n);if(e[1]==null)throw new Error("Could not compile `Take`: missing count");return cc("Take",t,e[1],n)},Drop:(e,n)=>{let t=ee("Drop",e[0],n);if(e[1]==null)throw new Error("Could not compile `Drop`: missing count");return cc("Drop",t,e[1],n)},Reverse:(e,n)=>`${ee("Reverse",e[0],n)}[::-1]`,Pipe:(e,n)=>n(kl(e)),Sort:(e,n)=>{if(e.length>1)throw new Error("Could not compile `Sort`: a custom comparator is not supported; only the default ascending numeric sort is.");return`sorted(${ee("Sort",e[0],n)})`},Ordering:(e,n)=>{if(e.length>1)throw new Error("Could not compile `Ordering`: a custom ordering function is not supported.");return`(lambda _l: [_i + 1 for _i in sorted(range(len(_l)), key=lambda _j: _l[_j])])(${ee("Ordering",e[0],n)})`},Join:(e,n)=>Sc("Join",e,n),ListJoin:(e,n)=>Sc("ListJoin",e,n),Append:(e,n)=>{let t=ee("Append",e[0],n),r=e.slice(1).map(o=>n(o));return`[*${t}${r.map(o=>`, ${o}`).join("")}]`},ReplaceAt:(e,n)=>{if(e[1]==null||e[2]==null)throw new Error("Could not compile `ReplaceAt`: missing argument");if(ta.has(e)){let r=[],o=e;for(;r.unshift(n(o[1]),n(o[2])),!!b(o[0],"ReplaceAt");)o=o[0].ops;return`_ce_replaceat_inplace(${n(o[0])}, ${r.join(", ")})`}return`_ce_replaceat(${ee("ReplaceAt",e[0],n)}, ${n(e[1])}, ${n(e[2])})`},DeleteAt:(e,n)=>{if(e[1]==null)throw new Error("Could not compile `DeleteAt`: missing index");return`_ce_deleteat(${ee("DeleteAt",e[0],n)}, ${n(e[1])})`},Insert:(e,n)=>{if(e[1]==null||e[2]==null)throw new Error("Could not compile `Insert`: missing argument");return`_ce_insert(${ee("Insert",e[0],n)}, ${n(e[1])}, ${n(e[2])})`},IndexOf:(e,n)=>{let t=ee("IndexOf",e[0],n);if(e[1]==null)throw new Error("Could not compile `IndexOf`: missing value");return ea("IndexOf",e[1],e[0],n,r=>`_ce_indexof(${t}, ${r})`)},Contains:(e,n)=>{e[0]&&Br("Contains",e[0]);let t=ee("Contains",e[0],n);if(e[1]==null)throw new Error("Could not compile `Contains`: missing value");return ea("Contains",e[1],e[0],n,r=>`(_ce_indexof(${t}, ${r}) > 0)`)},Unique:(e,n)=>(e[0]&&Br("Unique",e[0]),`list(dict.fromkeys(${ee("Unique",e[0],n)}))`),Zip:(e,n)=>e.length===0?"[]":(p.assertLockstepSourcesPure("Zip",e,1),`[list(_t) for _t in zip(${e.map((r,o)=>ee("Zip",r,n,o+1)).join(", ")})]`),Linspace:(e,n)=>{if(e[0]==null)throw new Error("Could not compile `Linspace`: missing argument");let t=e[1]==null?"1":n(e[0]),r=e[1]==null?n(e[0]):n(e[1]),o=e[2]==null?"50":n(e[2]);return`[float(_v) for _v in np.linspace(${t}, ${r}, max(0, int(${o})))]`},Map:(e,n)=>{if(e[1]==null)throw new Error("Could not compile `Map`: missing source collection");if(e.length>2){let o=e.slice(1);p.assertLockstepSourcesPure("Map",o,2);let i=o.map((a,l)=>ee("Map",a,n,l+2));if(C(e[0])&&p.isBinaryInfixValueOperator(e[0].symbol)&&o.length!==2)throw new Error(`Could not compile \`Map\`: the operator symbol '${e[0].symbol}' used as the mapping compiles to a two-argument function, and ${o.length} collections supply ${o.length} arguments per call. The interpreter evaluates it instead.`);return`(lambda _f, *_ls: [_f(*_t) for _t in zip(*_ls)])(${Ee("Map",e[0],n,p.zipCallbackArgTypes("Map",o,2),o)}, ${i.join(", ")})`}let t=ee("Map",e[1],n),r=Ee("Map",e[0],n,[p.collectionElementTypeOf(e[1])],[e[1]]);return`(lambda _f: [_f(_x) for _x in ${t}])(${r})`},Filter:(e,n)=>{let t=ee("Filter",e[0],n);if(e[1]==null)throw new Error("Could not compile `Filter`: missing predicate");let r=Ee("Filter",e[1],n,[p.collectionElementTypeOf(e[0])],[e[0]]);return`(lambda _f: [_x for _x in ${t} if _f(_x)])(${r})`},CountIf:(e,n)=>{let t=ee("CountIf",e[0],n);if(e[1]==null)throw new Error("Could not compile `CountIf`: missing predicate");let r=Ee("CountIf",e[1],n,[p.collectionElementTypeOf(e[0])],[e[0]]);return`(lambda _f: sum(1 for _x in ${t} if _f(_x)))(${r})`},Find:(e,n)=>{let t=ee("Find",e[0],n);if(e[1]==null)throw new Error("Could not compile `Find`: missing predicate");let r=Ee("Find",e[1],n,[p.collectionElementTypeOf(e[0])],[e[0]]);return`(lambda _f: next((_x for _x in ${t} if _f(_x)), float('nan')))(${r})`},IndexWhere:(e,n)=>{let t=ee("IndexWhere",e[0],n);if(e[1]==null)throw new Error("Could not compile `IndexWhere`: missing predicate");let r=Ee("IndexWhere",e[1],n,[p.collectionElementTypeOf(e[0])],[e[0]]);return`(lambda _f: next((_i + 1 for _i, _x in enumerate(${t}) if _f(_x)), 0))(${r})`},Position:(e,n)=>{let t=ee("Position",e[0],n);if(e[1]==null)throw new Error("Could not compile `Position`: missing predicate");let r=Ee("Position",e[1],n,[p.collectionElementTypeOf(e[0])],[e[0]]);return`(lambda _f: [_i + 1 for _i, _x in enumerate(${t}) if _f(_x)])(${r})`},Any:(e,n)=>{let t=ee("Any",e[0],n);if(e[1]==null)throw new Error("Could not compile `Any`: only the predicate form compiles.");ri("Any",e[0],e[1]);let r=Ee("Any",e[1],n,[p.collectionElementTypeOf(e[0])],[e[0]]);return`(lambda _f: any(_f(_x) for _x in ${t}))(${r})`},All:(e,n)=>{let t=ee("All",e[0],n);if(e[1]==null)throw new Error("Could not compile `All`: only the predicate form compiles.");ri("All",e[0],e[1]);let r=Ee("All",e[1],n,[p.collectionElementTypeOf(e[0])],[e[0]]);return`(lambda _f: all(_f(_x) for _x in ${t}))(${r})`},TakeWhile:(e,n)=>{let t=ee("TakeWhile",e[0],n);if(e[1]==null)throw new Error("Could not compile `TakeWhile`: missing predicate");return`(lambda _f, _l: _l[:next((_i for _i, _x in enumerate(_l) if not _f(_x)), len(_l))])(${Ee("TakeWhile",e[1],n,[p.collectionElementTypeOf(e[0])],[e[0]])}, ${t})`},DropWhile:(e,n)=>{let t=ee("DropWhile",e[0],n);if(e[1]==null)throw new Error("Could not compile `DropWhile`: missing predicate");return`(lambda _f, _l: _l[next((_i for _i, _x in enumerate(_l) if not _f(_x)), len(_l)):])(${Ee("DropWhile",e[1],n,[p.collectionElementTypeOf(e[0])],[e[0]])}, ${t})`},FlatMap:(e,n)=>{let t=ee("FlatMap",e[0],n);if(e[1]==null)throw new Error("Could not compile `FlatMap`: missing mapping function");return`(lambda _f, _l: [_y for _x in _l for _y in (lambda _r: _r if isinstance(_r, list) else [_r])(_f(_x))])(${Ee("FlatMap",e[1],n,[p.collectionElementTypeOf(e[0])],[e[0]])}, ${t})`},Reduce:(e,n,t)=>{let r=ee("Reduce",e[0],n),o=e[1],i=e[2];if(o==null)throw new Error("Could not compile `Reduce`: missing combiner");let s=C(o)&&Ko(o,t)?{Add:"sum(_l)",Multiply:'__import__("math").prod(_l)',Min:"min(_l)",Max:"max(_l)"}[o.symbol]:void 0;if(s!==void 0)return $c("Reduce",e[0]),i!=null?`(lambda _l: ${{"sum(_l)":`sum(_l, ${n(i)})`,'__import__("math").prod(_l)':`__import__("math").prod(_l, start=${n(i)})`,"min(_l)":`min([${n(i)}, *_l])`,"max(_l)":`max([${n(i)}, *_l])`}[s]})(${r})`:`(lambda _l: float('nan') if len(_l) == 0 else ${s})(${r})`;if(b(o,"Function")&&Xo(o,2)||C(o)){if(i==null)throw new Error("Could not compile `Reduce`: a custom combiner compiles only with an explicit initial value.");Jo("Reduce",o,i);let a=Ja(o);for(let f of a??[])ta.add(f);let l;try{l=Ee("Reduce",o,n,[p.foldAccumulatorArgType(e[0],o,i),p.collectionElementTypeOf(e[0])],[void 0,e[0]])}finally{for(let f of a??[])ta.delete(f)}let u=a!==void 0?`_ce_owned_copy(${n(i)})`:n(i);return`__import__('functools').reduce(${l}, ${r}, ${u})`}throw new Error("Could not compile `Reduce`: the combiner has no compiled function form on the Python target.")},Scan:(e,n,t)=>{let r=ee("Scan",e[0],n),o=e[1],i=e[2];if(o==null)throw new Error("Could not compile `Scan`: missing combiner");let s=C(o)&&Ko(o,t)?{Add:"(lambda _a, _b: _a + _b)",Multiply:"(lambda _a, _b: _a * _b)",Min:"(lambda _a, _b: min(_a, _b))",Max:"(lambda _a, _b: max(_a, _b))"}[o.symbol]:void 0;s!==void 0?$c("Scan",e[0]):Jo("Scan",o,i);let a=s??(b(o,"Function")&&Xo(o,2)||C(o)?Ee("Scan",o,n,[p.foldAccumulatorArgType(e[0],o,i),p.collectionElementTypeOf(e[0])],[void 0,e[0]]):void 0);if(a===void 0)throw new Error("Could not compile `Scan`: the combiner has no compiled function form on the Python target.");return i!=null?`list(__import__('itertools').accumulate(${r}, ${a}, initial=${n(i)}))[1:]`:`list(__import__('itertools').accumulate(${r}, ${a}))`},Tabulate:(e,n)=>{if(e[0]==null||e[1]==null)throw new Error("Could not compile `Tabulate`: missing argument");if(e.length>3)throw new Error("Could not compile `Tabulate`: only the 1-D and 2-D forms compile.");for(let i=1;i<e.length;i++){let s=ne(e[i]);if(s!==void 0&&Math.round(s)<=0)throw new Error(`Could not compile \`Tabulate\`: a statically non-positive dimension (${s}) gives a constant empty list.`)}let t=Ee("Tabulate",e[0],n,["integer","integer"]),r=$o(e[1],n);return e.length===2?`(lambda _f: [_f(_i + 1) for _i in range(${r})])(${t})`:`(lambda _f: [[_f(_i + 1, _j + 1) for _j in range(${$o(e[2],n)})] for _i in range(${r})])(${t})`},Fill:(e,n)=>{let t=e[1];if(e[0]==null||t==null)throw new Error("Could not compile `Fill`: missing argument");if(!b(t)||t.ops.length!==2)throw new Error("Could not compile `Fill`: only the (function, (rows, cols)) form compiles.");let r=Ee("Fill",e[0],n,["integer","integer"]),o=$o(t.ops[0],n);return`(lambda _f: [[_f(_i + 1, _j + 1) for _j in range(${$o(t.ops[1],n)})] for _i in range(${o})])(${r})`},Boole:(e,n)=>{if(e[0]==null)throw new Error("Could not compile `Boole`: missing argument");if(!p.isBooleanValued(e[0]))throw new Error("Could not compile `Boole`: the argument is not provably boolean.");return`(1 if ${n(e[0])} else 0)`},KroneckerDelta:(e,n)=>{if(e.length===0||e[0]==null)throw new Error("Could not compile `KroneckerDelta`: missing argument");return e.length===1?`(1 if ${n(e[0])} == 0 else 0)`:`(lambda *_v: 1 if _v[0] is not None and all(_x == _v[0] for _x in _v) else 0)(${e.map(t=>n(t)).join(", ")})`},Element:(e,n)=>{if(e[0]==null||e[1]==null)throw new Error("Could not compile `Element`: missing argument");Br("Element",e[1]);let t=ee("Element",e[1],n);return ea("Element",e[0],e[1],n,r=>`(_ce_indexof(${t}, ${r}) > 0)`)},Identity:(e,n,t)=>{if(e[0]==null)throw new Error("Could not compile `Identity`: missing argument");return Hc(e[0],n(e[0]),t)},Apply:(e,n,t)=>{if(e[0]==null)throw new Error("Could not compile `Apply`: missing function");if(e=Mr(e)??e,Or(e))throw new Error(Cl(e));if(b(e[0],"Function")){let r=e[0].ops.slice(1);if(!r.some(o=>Jn(o))&&!Xa(e[0],e.length-1))throw new Error(`Could not compile \`Apply\`: the function takes ${r.length} parameter(s) but ${e.length-1} argument(s) are supplied. `+(r.length===0?"The interpreter ignores the arguments of a function with no parameter, and the Python call raises a `TypeError`.":"The interpreter gives an `unexpected-argument` error, and the Python call raises a `TypeError`."))}return vp(e,n,!1,t)},Flatten:(e,n)=>{if(e[1]!=null)throw new Error("Could not compile `Flatten`: an explicit depth is not supported on the Python target.");return`(lambda _l: (lambda _f: _f(_f, _l))(lambda _f, _x: [_y for _e in _x for _y in (_f(_f, _e) if isinstance(_e, list) else [_e])]))(${ee("Flatten",e[0],n)})`},Shape:(e,n)=>{if(e[0]==null)throw new Error("Could not compile `Shape`: missing argument");let t=ei(e[0]);if(t!==void 0)throw new Error(`Could not compile \`Shape\`: the operand ${t}.`);return`list(np.shape(${n(e[0])}))`},Reshape:(e,n)=>{let t=ee("Reshape",e[0],n),r=e[1];if(r==null)throw new Error("Could not compile `Reshape`: missing shape");if(!b(r)||r.ops.length===0||r.ops.length>2)throw new Error("Could not compile `Reshape`: only a 1-D or 2-D target shape compiles.");return`np.resize(np.asarray(${t}), (${r.ops.map(o=>n(o)).join(", ")},)).tolist()`},Trace:(e,n)=>{if(e.length>1)throw new Error("Could not compile `Trace`: explicit axes do not compile.");return`${p.linearAlgebraLane([e[0]])==="complex"?"complex":"float"}(np.trace(np.asarray(${ee("Trace",e[0],n)})))`}};da.ApplyWhole=(e,n,t)=>vp(e,n,!0,t);var Ac=["strict","complex","auto"],Cm=new Set(["Erf","Erfc","Lb","Log2","Log10","Exp2","Determinant","Inverse","MatrixMultiply","MatrixPower","Cross","Diagonal"]),Sm=new Set(["GammaRegularized"]);function zm(e,n){return p.REAL_ONLY_BY_DEFINITION.has(e)||Sm.has(e)?!0:p.stringHelperIsRealOnly(e,n)&&!Cm.has(e)}function Rc(e,n,t){let r=[];for(let o of n){let i=e.engine.symbol(o).type?.type;i===void 0||!Sl(i)||r.push([t(o),`"${o}" (type \`${p.declaredTypeText(i)}\`) is compiled as a Python sequence, and compiled code does not accept a string for it: it would read the string as code points, not as characters. Pass a list, or declare the parameter \`string\` to compile text.`])}return r}var Tc=e=>`__import__("builtins").isinstance(${e}, __import__("builtins").str)`,Gc=e=>`__import__("builtins").TypeError(${JSON.stringify(e)})`;function Nc(e,n,t,r){let o=new Set(p.analyzeReferences(e,n,new Set(t)).freeSymbols),i=p.collectionReadInputs(e,o).map(r);if(i.length===0)return;let s=X(Qe(e.type.type)),a=s!=="never"&&s!=="unknown"&&s!=="any"&&q(s,"number");return{test:i.join(" or "),value:a?"float('nan')":"None"}}function Fc(e,n,t){return n.includes(e)?`${t} is None`:`__import__("builtins").globals().get(${JSON.stringify(t.normalize("NFKC"))}) is None`}var yr="_c is None or (isinstance(_c, (float, complex, np.floating, np.complexfloating)) and cmath.isnan(_c))",Ic=class{includeImports;useScipy;constructor(n={}){this.includeImports=n.includeImports??!1,this.useScipy=n.useScipy??!1}getOperators(){return aa}getFunctions(){return da}createTarget(n={}){return{language:"python",shapeDispatch:Ya,isRealOnlyLowering:zm,supportedModes:Ac,complexLift:t=>`_ce_cplx(${t})`,complexIsReal:t=>`_ce_cisreal(${t})`,complexReal:t=>`_ce_creal(${t})`,complexRealElements:t=>`_ce_creal_elems(${t})`,realGuard:(t,r,o)=>t.length===0?`(${r})`:`((${r}) if (${t.join(" and ")}) else ${o==="boolean"?"False":"float('nan')"})`,chainOp:"and",bindExpr:(t,r)=>`(lambda ${t.map(o=>o[0]).join(", ")}: ${r})(${t.map(o=>o[1]).join(", ")})`,cseBind:(t,r)=>`[${r} ${t.map(([o,i])=>`for ${o} in [${i}]`).join(" ")}][0]`,shareSymbolSquares:!1,valueTailSelections:!1,broadcastUnary:(t,r,o,i)=>{let s=p.tempVar(i);return`[${o.element(s)} for ${s} in ${o.collection()}]`},collectionAwareHeads:hm,operators:t=>aa[t],functions:t=>da[t],var:t=>Qs[t],mangleId:uc,constant:t=>Qs[t]??Mc[t],complex:(t,r)=>`complex(${gc(t)}, ${gc(r)})`,string:t=>JSON.stringify(t),dictionary:t=>`{${t.map(([r,o])=>`${JSON.stringify(r)}: ${o}`).join(", ")}}`,number:t=>isFinite(t)?t.toString():t===1/0?"np.inf":t===-1/0?"-np.inf":"np.nan",indent:0,ws:t=>t??"",preamble:"",absence:{numeric:{make:()=>"math.nan",isAbsent:t=>`(lambda _c: ${yr})(${t})`,coalesce:(t,r)=>`(lambda _c: ${r} if (${yr}) else _c)(${t})`},object:{nullLiteral:"None",isNull:t=>`(${t} is None)`,isAbsent:t=>`(lambda _c: ${yr})(${t})`,coalesce:(t,r)=>`(lambda _c: ${r} if (${yr}) else _c)(${t})`},raise:t=>`(_ for _ in ()).throw(ValueError(${t}))`,writtenSymbol:"numeric"},bareStatementBlocks:!0,declare:t=>"",block:t=>{if(t.length===0)return"";let r=t.length-1;if(/^(for|while)\b/.test(t[r]))t.push("return None");else{if(/^if\b/.test(t[r]))throw new Error("Could not compile `Block`: the block's value statement is a selection whose branches are statements, which Python writes as an `if:`/`else:` block \u2014 a block cannot be returned, and its value is not `None`. Give the block a VALUE statement after the selection.");if(!/^return\b/.test(t[r])&&!/\nreturn\b[^\n]*$/.test(t[r])){let o=/^([^\s()[\]{}'"=,:]+) = /.exec(t[r]);o!==null?t.push(`return ${o[1]}`):t[r]=`return ${t[r]}`}}return t.join(`
`)},naming:{counter:0,usedNames:new Set},...n}}makeVarResolver(n,t){return r=>{if(t?.includes(r))return r;if(n&&Object.hasOwn(n,r)){let o=n[r];return typeof o!="string"?Wn(JSON.stringify(o)):(/^[A-Za-z_]\w*$/.test(o)&&uc(o),/["']/.test(o)?`(${o})`:Wn(o))}return Qs[r]}}compile(n,t={}){t.storage!==void 0&&wt(t.storage,[n],this.createTarget(),{vars:t.vars,functions:t.functions});let r=t.mode;try{return Qn(n,t.vars,()=>ml(r,Ac,o=>this.compileOrThrow(n,o===r?t:{...t,mode:o})))}catch(o){if(Nn(o,n.engine._deadlineFrame),t.fallback!==!0)throw o;let i=o.message;return console.warn(`Compilation fallback for "${n.operator}" (target: python): ${i}`),p.buildInterpreterFallback(n,i,"python",this.createTarget(),t.vars?new Set(Object.keys(t.vars)):void 0,cn(o,i))}}compileOrThrow(n,t={},r){let o=n;n=fn(n),n=Wt(n),n=_t(n,{iterationBudget:t.iterationBudget,readsLiveSource:g=>typeof t.vars?.[g]=="string"});let i=t.vars,s=this.makeVarResolver(i),a=new Map,l=this.createTarget({var:g=>a.get(g)??s(g),inputWrites:new Set,inputLocals:a,varsKeys:i?new Set(Object.keys(i)):void 0,constantFold:t.constantFold,mode:t.mode,naming:Eo(n,[t.preamble,...i?Object.values(i):[]])}),u=qt(n,l,{vars:i});u!==n&&(n=_t(u,{iterationBudget:t.iterationBudget,readsLiveSource:g=>typeof t.vars?.[g]=="string"})),p.openCseSession(n,l,{enabled:t.cse,isStringVar:g=>i!==void 0&&typeof i[g]=="string",isVarsKey:g=>i!==void 0&&Object.prototype.hasOwnProperty.call(i,g)});for(let g of r??[])a.set(g,p.tempVar(l));cp("compile()",n,!0);let f=mc(n,l);if(r===void 0&&l.inputWrites.size>0)return this.compileOrThrow(o,t,[...l.inputWrites]);let c=[...a].filter(([,g])=>!vc(f,g)).map(([g,_])=>`${_} = ${s(g)??g}`);c.length>0&&(f=[...c,f].join(`
`)),f=wo(f,{callerSources:fc(i),hostNames:()=>p.analyzeReferences(n,l,i?new Set(Object.keys(i)):void 0).freeSymbols}).body;let m=yc(f);br(m,n.symbols.filter(g=>typeof i?.[g]!="string")),this.includeImports&&(m=this.withImports(m));let d={target:"python",success:!0,code:m};return p.withReferences(d,n,l,i?new Set(Object.keys(i)):void 0)}withImports(n){let t=`import numpy as np
`;return t+=`import cmath
`,this.useScipy&&(t+=`import scipy.special
`),/\bmath\./.test(n)&&(t+=`import math
`),`${t}
${n}`}compileToSource(n,t={}){fa("compileToSource()",n),n=fn(n),n=Wt(n);let r=t.vars,o=this.createTarget({var:this.makeVarResolver(r),varsKeys:r?new Set(Object.keys(r)):void 0,constantFold:t.constantFold,mode:t.mode,naming:Eo(n,[t.preamble,...r?Object.values(r):[]])}),i=Qn(n,r,()=>(n=qt(n,o,{vars:r}),p.openCseSession(n,o,{enabled:t.cse,isStringVar:a=>r!==void 0&&typeof r[a]=="string",isVarsKey:a=>r!==void 0&&Object.prototype.hasOwnProperty.call(r,a)}),p.compileCseRoot(n,o)));pm("compileToSource()",i);let s=yc(wo(i,{callerSources:fc(r),hostNames:()=>p.analyzeReferences(n,o,r?new Set(Object.keys(r)):void 0).freeSymbols}).body);return br(s,n.symbols.filter(a=>typeof r?.[a]!="string")),this.includeImports?this.withImports(s):s}compileFunction(n,t,r,o,i){dm("compileFunction()",n),ft(t);for(let d of r)ft(d);n=fn(n),n=Wt(n);let s=this.createTarget({var:this.makeVarResolver(void 0,r),constantFold:i?.constantFold,naming:Eo(n,void 0,r),inputWrites:new Set});n=qt(n,s),p.openCseSession(n,s,{enabled:i?.cse});let a=mc(n,s);mm("compileFunction()",n,a);let l=wo(a,{outside:[t,...r],hostNames:()=>[t,...p.analyzeReferences(n,s).freeSymbols.filter(d=>!r.includes(d))]});a=l.body;let u=[...s.inputWrites].filter(d=>!r.includes(d)&&!vc(a,l.name(d)));if(u.length>0){if(r.includes("__import__")||n.symbols.includes("__import__"))throw new Error('"__import__" cannot be used as a symbol or parameter name in a Python function that assigns a module global. Rename it before compiling to Python (fail closed).');a=[...u.map(d=>`${l.name(d)} = __import__("builtins").globals().get(${JSON.stringify(l.name(d).normalize("NFKC"))})`),/^return\b/.test(a)||a.includes(`
`)?a:`return ${a}`].join(`
`)}let f=r.map(l.name).join(", "),c="";this.includeImports&&(c+=`import numpy as np
`,c+=`import cmath
`,this.useScipy&&(c+=`import scipy.special
`),/\bmath\./.test(a)&&(c+=`import math
`),c+=`
`),(a.includes("_ce_cplx(")||a.includes("_ce_cisreal(")||a.includes("_ce_creal(")||a.includes("_ce_creal_elems("))&&(c+=`${Kc}
`),a.includes("_ce_rref(")&&(c+=`${Xc}
`),a.includes("_ce_bcast(")&&(c+=`${Zc}
`),a.includes("_ce_eqcoll(")&&(c+=`${Jc}
`),a.includes("_ce_indexof(")&&(c+=`${Qc}
`),a.includes("_ce_ord(")&&(c+=`${ap}
`),(a.includes("_ce_smoothstep(")||a.includes("_ce_bcast('smoothstep'"))&&(c+=`${tp}
`),a.includes("_ce_round(")&&(c+=`${rp}
`),(a.includes("_ce_int_operands(")||a.includes("_ce_remainder("))&&(c+=`${sp}
`),a.includes("_ce_pow(")&&(c+=`${np()}
`),/_ce_(replaceat|replaceat_inplace|owned_copy|deleteat|insert)\(/.test(a)&&(c+=`${lp}
`),a.includes("_ce_predicate(")&&(c+=`${up}
`),a.includes("_ce_ugamma(")&&(c+=`${fp}
`),c+=`def ${l.name(t)}(${f}):
`,o&&(c+=`    r"""${o}"""
`);for(let[d,g]of Rc(n,r,l.name))c+=`    if ${Tc(d)}:
        raise ${Gc(g)}
`;let m=Nc(n,s,r,d=>Fc(d,r,l.name(d)));if(m!==void 0&&(c+=`    if ${m.test}:
        return ${m.value}
`),a.includes(`
`)){let d=a.split(`
`).map(g=>`    ${g}`).join(`
`);c+=`${d}
`}else/^return\b/.test(a)?c+=`    ${a}
`:c+=`    return ${a}
`;return br(c,[t,...r,...n.symbols].map(l.name)),c}compileVectorized(n,t,r,o,i){ft(t);let a=this.compileFunction(n,`_${t}_scalar`,r,o,i)+`
`;return a+=`# Vectorized version
`,a+=`${t} = np.vectorize(_${t}_scalar)
`,br(a,[t]),a}compileLambda(n,t,r){fa("compileLambda()",n);for(let d of t)ft(d);n=fn(n),n=Wt(n);let o=this.createTarget({var:this.makeVarResolver(void 0,t),constantFold:r?.constantFold,naming:Eo(n,void 0,t)});n=qt(n,o),p.openCseSession(n,o,{enabled:r?.cse});let i,s=ct;ct=!0;try{i=p.compileCseRoot(n,o)}finally{ct=s}if(i.includes(`
`))throw new Error("Could not compile `compileLambda`: a multi-statement construct (loop-form Sum/Product, Loop, or Block) cannot be a Python lambda body \u2014 use compileFunction instead.");for(let[d,g]of[["_ce_bcast(","ElementMax/ElementMin/Clamp over a collection operand"],["_ce_rref(","RowReduce"],["_ce_indexof(","IndexOf"],["_ce_eqcoll(","equality over a collection or tuple operand"],["_ce_ord(","an ordering over a collection operand"],["_ce_pow(","a power whose base may be negative"],["_ce_round(","Round"],["_ce_predicate(","a predicate whose result is not provably a boolean"],["_ce_ugamma(","an upper incomplete gamma whose order is not known to be positive"],["_ce_cplx(","the complex lift of the complex modes"],["_ce_cisreal(","the realness test of the complex modes"],["_ce_creal(","the real projection of the complex modes"],["_ce_creal_elems(","the element-wise real projection of the complex modes"]])if(i.includes(d))throw new Error(`Could not compile \`compileLambda\`: ${g} needs the module-level ${d.slice(0,-1)} helper, which cannot ride along a bare lambda \u2014 use compileFunction instead.`);let a=wo(i,{outside:t,hostNames:()=>p.analyzeReferences(n,o).freeSymbols.filter(d=>!t.includes(d))}),l=t.map(a.name).join(", "),u=a.body,f=Rc(n,t,a.name);f.length>0&&(u=`${f.map(([d,g])=>`(_ for _ in ()).throw(${Gc(g)}) if ${Tc(d)} else `).join("")}(${u})`);let c=Nc(n,o,t,d=>Fc(d,t,a.name(d)));c!==void 0&&(u=`${c.value} if (${c.test}) else (${u})`);let m=`lambda ${l}: ${u}`;return br(m,[...t,...n.symbols].map(a.name)),m}};export{lt as a,Wf as b,ic as c,Ic as d};
