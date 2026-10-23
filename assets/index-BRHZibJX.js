var e=Object.defineProperty,t=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t,t.exports),e=null),t.exports),n=(t,n)=>{let r={};for(var i in t)e(r,i,{get:t[i],enumerable:!0});return n||e(r,Symbol.toStringTag,{value:`Module`}),r};(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var r=`casa-ramire:state`,i={owner:{label:`Owner / Super Admin`,short:`SUPER ADMIN`},staff:{label:`Staf Operasional`,short:`STAFF ADMIN`}},a={kosong:{label:`Kosong`,badge:`badge-amber`},booking:{label:`Booking`,badge:`badge-blue`},terisi:{label:`Terisi`,badge:`badge-green`}},o={unpaid:{label:`Belum Bayar`,badge:`badge-amber`},paid:{label:`Lunas`,badge:`badge-green`}},s=[{key:`harian`,label:`Harian`,unit:`hari`,kind:`days`},{key:`mingguan`,label:`Mingguan`,unit:`minggu`,kind:`weeks`},{key:`1`,label:`1 Bulan`,unit:`bulan`,kind:`months`,months:1},{key:`3`,label:`3 Bulan`,unit:`bulan`,kind:`months`,months:3},{key:`6`,label:`6 Bulan`,unit:`bulan`,kind:`months`,months:6},{key:`12`,label:`12 Bulan (1 Tahun)`,unit:`bulan`,kind:`months`,months:12}],c=s.map(e=>e.key),l=[`Virtual Account BCA`,`Virtual Account Mandiri`,`QRIS All Payment`,`Transfer Bank`,`Tunai / Cash`],u=[{name:`Owner Casa Ramire`,username:`owner`,password:`123456`,role:`owner`},{name:`Rian (Staf Kasir)`,username:`rian`,password:`123456`,role:`staff`}],d={lantai2:{harian:15e4,mingguan:85e4,1:22e5,3:63e5,6:12e6,12:23e6},lantai3:{harian:14e4,mingguan:8e5,1:21e5,3:6e6,6:115e5,12:22e6}},f=[{name:`Parkir Mobil`,price:1e5,active:!0},{name:`Kulkas Dalam Kamar`,price:75e3,active:!0},{name:`Dispenser & Aqua`,price:5e4,active:!0}],p=[{name:`Diskon Awal Tahun`,type:`rupiah`,value:2e5,active:!0},{name:`Promo Mahasiswa 5%`,type:`persen`,value:5,active:!0}],m=[`Gaji HK / Kebersihan`,`Listrik`,`WiFi / Internet`,`Sampah & Keamanan`,`Maintenance`,`Lain-lain`],h={tagihan:`Halo Kak {nama} 👋

Berikut tagihan sewa Kamar {kamar} Casa Ramire sebesar *{nominal}* (jatuh tempo: {jatuh_tempo}).

Pembayaran dapat dilakukan via VA / QRIS. Terima kasih!`,manual:`Halo Kak {nama} (Kamar {kamar}) 👋

Terbit invoice layanan #{no_invoice} untuk *{item_layanan}* sebesar *{nominal}*.

Mohon dapat dibayarkan via VA / QRIS. Terima kasih!`,reminder:`PENGINGAT SEWA CASA RAMIRE ⚠️

Halo Kak {nama}, sewa Kamar {kamar} Anda berakhir pada *{jatuh_tempo}*. Total tagihan *{nominal}*.

Silakan lakukan perpanjangan agar kamar tetap nyaman untuk Anda. Terima kasih!`},g=[{token:`{nama}`,desc:`Nama penghuni`},{token:`{kamar}`,desc:`Nomor kamar`},{token:`{nominal}`,desc:`Nominal (Rp)`},{token:`{jatuh_tempo}`,desc:`Tanggal jatuh tempo`},{token:`{no_invoice}`,desc:`Nomor invoice`},{token:`{item_layanan}`,desc:`Item layanan`}],_=[{path:`dashboard`,label:`Dashboard`,icon:`LayoutDashboard`},{path:`rooms`,label:`Status Kamar`,icon:`Building2`},{path:`pricing`,label:`Pricelist & Diskon`,icon:`Tags`},{path:`addons`,label:`Master Add-On`,icon:`CirclePlus`},{path:`tenants`,label:`Penghuni & Kontrak`,icon:`Users`},{path:`financial`,label:`Financial & Keuangan`,icon:`Wallet`},{path:`billing`,label:`Sewa & Verifikasi Kas`,icon:`ReceiptText`},{path:`content`,label:`Konten & WA Preview`,icon:`MessageSquareText`},{path:`users`,label:`Manajemen Akun`,icon:`UserCog`,ownerOnly:!0}],v={dashboard:{title:`Dashboard`,subtitle:`Ringkasan operasional properti`},rooms:{title:`Status Kamar`,subtitle:`Inventaris dan okupansi kamar`},pricing:{title:`Pricelist & Diskon`,subtitle:`Strategi tarif dan promo`},addons:{title:`Master Add-On`,subtitle:`Layanan tambahan berbayar`},tenants:{title:`Penghuni & Kontrak`,subtitle:`Direktori dan riwayat sewa`},financial:{title:`Financial & Keuangan`,subtitle:`Jurnal, invoice, dan laba rugi`},billing:{title:`Sewa & Verifikasi Kas`,subtitle:`Tagihan dan konfirmasi pembayaran`},content:{title:`Konten & WA Preview`,subtitle:`Template pesan otomatis`},users:{title:`Manajemen Akun`,subtitle:`Akses staf dan keamanan`}},y=new Set(_.map(e=>e.path));function b(){let e=String(window.location.hash||``).replace(/^#\/?/,``).split(`?`)[0].trim();return y.has(e)?e:`dashboard`}function ee(e,{replace:t=!1}={}){let n=`#/${y.has(e)?e:`dashboard`}`;window.location.hash!==n&&(t?window.history.replaceState(null,``,n):window.location.hash=n)}function x(e){window.addEventListener(`hashchange`,e)}var te=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],S=(e,t)=>e>>>t|e<<32-t;function ne(e){return typeof e==`string`?new TextEncoder().encode(e):new Uint8Array(e)}function re(e){return(e>>>0).toString(16).padStart(8,`0`)}function ie(e){let t=ne(e),n=t.length,r=n*8,i=Math.ceil((n+9)/64)*64,a=new Uint8Array(i);a.set(t),a[n]=128;let o=new DataView(a.buffer);o.setUint32(i-8,Math.floor(r/4294967296)),o.setUint32(i-4,r>>>0);let s=1779033703,c=3144134277,l=1013904242,u=2773480762,d=1359893119,f=2600822924,p=528734635,m=1541459225,h=new Uint32Array(64);for(let e=0;e<i;e+=64){for(let t=0;t<16;t+=1)h[t]=o.getUint32(e+t*4);for(let e=16;e<64;e+=1){let t=S(h[e-15],7)^S(h[e-15],18)^h[e-15]>>>3,n=S(h[e-2],17)^S(h[e-2],19)^h[e-2]>>>10;h[e]=h[e-16]+t+h[e-7]+n>>>0}let t=s,n=c,r=l,i=u,a=d,g=f,_=p,v=m;for(let e=0;e<64;e+=1){let o=S(a,6)^S(a,11)^S(a,25),s=a&g^~a&_,c=v+o+s+te[e]+h[e]>>>0,l=(S(t,2)^S(t,13)^S(t,22))+(t&n^t&r^n&r)>>>0;v=_,_=g,g=a,a=i+c>>>0,i=r,r=n,n=t,t=c+l>>>0}s=s+t>>>0,c=c+n>>>0,l=l+r>>>0,u=u+i>>>0,d=d+a>>>0,f=f+g>>>0,p=p+_>>>0,m=m+v>>>0}return[s,c,l,u,d,f,p,m].map(re).join(``)}var ae=`casa-ramire::credentials::v2`;function oe(e){return ie(`${ae}:${String(e)}`)}function se(e,t){return t?oe(e)===t:!1}function ce(){let e=[],t=1;for(let n of[`2`,`3`])for(let r=1;r<=21;r+=1)e.push({id:t,nomor:`${n}${String(r).padStart(2,`0`)}`,lantai:n,status:`kosong`,tenantId:null,booking:null}),t+=1;return e}function le(e){return e.map((e,t)=>({id:t+1,...e}))}function ue(){let e=new Date().toISOString();return{version:2,meta:{createdAt:e,updatedAt:e},session:null,users:u.map((t,n)=>({id:n+1,name:t.name,username:t.username,passHash:oe(t.password),role:t.role,active:!0,createdAt:e})),rooms:ce(),tenants:[],bills:[],manualInvoices:[],expenses:[],expenseCategories:[...m],addons:le(f),promos:le(p),pricing:structuredClone(d),templates:{...h},settings:{propertyName:`Casa Ramire`,depositDefault:5e5,address:`Kos Casa Ramire`}}}var de=new Map;function fe(){try{let e=`__casa_ramire_probe__`;return window.localStorage.setItem(e,`1`),window.localStorage.removeItem(e),!0}catch{return!1}}var pe=fe(),C={get(e){try{let t=pe?window.localStorage.getItem(e):de.get(e);return t?JSON.parse(t):null}catch{return null}},set(e,t){try{let n=JSON.stringify(t);return pe?window.localStorage.setItem(e,n):de.set(e,n),!0}catch(e){return console.warn(`[storage] Gagal menyimpan data:`,e),!1}},remove(e){try{pe?window.localStorage.removeItem(e):de.delete(e)}catch{}},getRaw(e){try{return pe?window.localStorage.getItem(e):de.get(e)??null}catch{return null}},setRaw(e,t){try{return pe?window.localStorage.setItem(e,t):de.set(e,t),!0}catch{return!1}}},w=ge(),me=new Set;function he(e){let t=ue(),n={...t,...e,version:2,meta:{...t.meta,...e.meta||{}},pricing:{...t.pricing,...e.pricing||{}},templates:{...t.templates,...e.templates||{}},settings:{...t.settings,...e.settings||{}}};for(let e of[`users`,`rooms`,`tenants`,`bills`,`manualInvoices`,`expenses`,`expenseCategories`,`addons`,`promos`])Array.isArray(n[e])||(n[e]=t[e]);if(n.session){let e=n.users.find(e=>String(e.id)===String(n.session.userId));e&&e.active||(n.session=null)}return n}function ge(){let e=C.get(r);if(e&&typeof e==`object`)return he(e);let t=ue();return C.set(r,t),t}function T(){return w}function _e(e){return me.add(e),()=>me.delete(e)}function ve(){for(let e of me)try{e(w)}catch(e){console.error(`[store] listener error`,e)}}function E(e){e(w),w.meta={...w.meta,updatedAt:new Date().toISOString()},C.set(r,w),ve()}function ye(e){w=he(e||ue()),C.set(r,w),ve()}function be(){let e=w;E(t=>{let n=ue();t.rooms=n.rooms,t.tenants=[],t.bills=[],t.manualInvoices=[],t.expenses=[],t.expenseCategories=n.expenseCategories,t.users=e.users,t.session=e.session,t.pricing=e.pricing,t.addons=e.addons,t.promos=e.promos,t.templates=e.templates,t.settings=e.settings})}function xe(){w=ue(),C.set(r,w),ve()}function D(e=[]){return e.reduce((e,t)=>Math.max(e,Number(t?.id)||0),0)+1}function Se(e,t=[]){let n=new Date;return`${e}/${`${n.getFullYear()}${String(n.getMonth()+1).padStart(2,`0`)}`}/${String(D(t)).padStart(4,`0`)}`}function Ce(){let{session:e,users:t}=T();return e?.userId&&t.find(t=>String(t.id)===String(e.userId)&&t.active)||null}function we(){return Ce()?.role===`owner`}function Te(){if(!we())throw Error(`Aksi ini hanya dapat dilakukan oleh owner.`)}function Ee(e,t){let n=T(),r=String(e||``).trim().toLowerCase(),i=n.users.find(e=>e.username.toLowerCase()===r);return i?i.active?se(t,i.passHash)?(E(e=>{e.session={userId:i.id,issuedAt:new Date().toISOString()}}),{ok:!0,user:i}):{ok:!1,error:`Password salah. Silakan coba lagi.`}:{ok:!1,error:`Akun ini sedang dinonaktifkan. Hubungi owner.`}:{ok:!1,error:`Username tidak ditemukan.`}}function De(){E(e=>{e.session=null})}function Oe(e,t,n=null){let r=String(e||``).trim().toLowerCase();if(!/^[a-z0-9._-]{3,20}$/.test(r))throw Error(`Username 3–20 karakter, hanya huruf, angka, titik, garis bawah, atau strip.`);if(t.some(e=>e.username.toLowerCase()===r&&String(e.id)!==String(n)))throw Error(`Username sudah digunakan.`);return r}function ke(e){if(String(e||``).length<6)throw Error(`Password minimal 6 karakter.`);return String(e)}function Ae({name:e,username:t,password:n,role:r=`staff`}){Te();let i=T(),a=String(e||``).trim();if(!a)throw Error(`Nama lengkap wajib diisi.`);let o=Oe(t,i.users);if(ke(n),![`owner`,`staff`].includes(r))throw Error(`Role tidak valid.`);let s={id:D(i.users),name:a,username:o,passHash:oe(n),role:r,active:!0,createdAt:new Date().toISOString()};return E(e=>{e.users.push(s)}),s}function je(e,{name:t,role:n,active:r}){Te();let i=T(),a=i.users.find(t=>String(t.id)===String(e));if(!a)throw Error(`Pengguna tidak ditemukan.`);if(t!==void 0&&!String(t).trim())throw Error(`Nama lengkap wajib diisi.`);if(n!==void 0&&![`owner`,`staff`].includes(n))throw Error(`Role tidak valid.`);let o=n??a.role,s=r??a.active;if(a.role===`owner`&&(o!==`owner`||s===!1)&&i.users.filter(e=>e.role===`owner`&&e.active&&e.id!==a.id).length===0)throw Error(`Minimal harus ada satu owner aktif.`);return E(i=>{let a=i.users.find(t=>String(t.id)===String(e));t!==void 0&&(a.name=String(t).trim()),n!==void 0&&(a.role=n),r!==void 0&&(a.active=!!r),a.updatedAt=new Date().toISOString(),!a.active&&String(i.session?.userId)===String(a.id)&&(i.session=null)}),T().users.find(t=>String(t.id)===String(e))}function Me(e,t){if(Te(),!T().users.find(t=>String(t.id)===String(e)))throw Error(`Pengguna tidak ditemukan.`);ke(t),E(n=>{let r=n.users.find(t=>String(t.id)===String(e));r.passHash=oe(t),r.updatedAt=new Date().toISOString()})}function Ne(e){Te();let t=T(),n=t.users.find(t=>String(t.id)===String(e));if(!n)throw Error(`Pengguna tidak ditemukan.`);if(String(n.id)===String(t.session?.userId))throw Error(`Anda tidak dapat menghapus akun yang sedang digunakan.`);if(n.role===`owner`&&t.users.filter(e=>e.role===`owner`&&e.active).length<=1)throw Error(`Minimal harus ada satu owner aktif.`);E(t=>{t.users=t.users.filter(t=>String(t.id)!==String(e))})}function Pe(e,t){let n=Ce();if(!n)throw Error(`Sesi tidak valid.`);if(!se(e,n.passHash))throw Error(`Password saat ini salah.`);ke(t),E(e=>{let r=e.users.find(e=>String(e.id)===String(n.id));r.passHash=oe(t),r.updatedAt=new Date().toISOString()})}var Fe={"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`};function O(e){return String(e??``).replace(/[&<>"']/g,e=>Fe[e])}function k(e,t,n,r){let i=t=>{let i=t.target.closest(n);i&&e.contains(i)&&r(t,i)};return e.addEventListener(t,i),()=>e.removeEventListener(t,i)}function Ie(e,t,n=`application/json`){let r=new Blob([t],{type:n}),i=URL.createObjectURL(r),a=document.createElement(`a`);a.href=i,a.download=e,document.body.appendChild(a),a.click(),a.remove(),setTimeout(()=>URL.revokeObjectURL(i),1e3)}function Le(e){return new Promise((t,n)=>{let r=new FileReader;r.onload=()=>t(String(r.result||``)),r.onerror=()=>n(r.error),r.readAsText(e)})}var A=t((e=>{var t=[[`path`,{d:`m7 7 10 10`}],[`path`,{d:`M17 7v10H7`}]],n=[[`path`,{d:`M5 12h14`}],[`path`,{d:`m12 5 7 7-7 7`}]],r=[[`path`,{d:`M7 7h10v10`}],[`path`,{d:`M7 17 17 7`}]],i=[[`path`,{d:`M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z`}],[`path`,{d:`m9 12 2 2 4-4`}]],a=[[`rect`,{width:`20`,height:`12`,x:`2`,y:`6`,rx:`2`}],[`circle`,{cx:`12`,cy:`12`,r:`2`}],[`path`,{d:`M6 12h.01M18 12h.01`}]],o=[[`path`,{d:`M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8`}],[`path`,{d:`M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4`}],[`path`,{d:`M12 4v6`}],[`path`,{d:`M2 18h20`}]],s=[[`path`,{d:`M10 12h4`}],[`path`,{d:`M10 8h4`}],[`path`,{d:`M14 21v-3a2 2 0 0 0-4 0v3`}],[`path`,{d:`M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2`}],[`path`,{d:`M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16`}]],c=[[`path`,{d:`M16 14v2.2l1.6 1`}],[`path`,{d:`M16 2v4`}],[`path`,{d:`M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5`}],[`path`,{d:`M3 10h5`}],[`path`,{d:`M8 2v4`}],[`circle`,{cx:`16`,cy:`16`,r:`6`}]],l=[[`path`,{d:`M8 2v4`}],[`path`,{d:`M16 2v4`}],[`rect`,{width:`18`,height:`18`,x:`3`,y:`4`,rx:`2`}],[`path`,{d:`M3 10h18`}],[`path`,{d:`M8 14h.01`}],[`path`,{d:`M12 14h.01`}],[`path`,{d:`M16 14h.01`}],[`path`,{d:`M8 18h.01`}],[`path`,{d:`M12 18h.01`}],[`path`,{d:`M16 18h.01`}]],u=[[`path`,{d:`M8 2v4`}],[`path`,{d:`M16 2v4`}],[`rect`,{width:`18`,height:`18`,x:`3`,y:`4`,rx:`2`}],[`path`,{d:`M3 10h18`}]],d=[[`path`,{d:`M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2`}],[`circle`,{cx:`7`,cy:`17`,r:`2`}],[`path`,{d:`M9 17h6`}],[`circle`,{cx:`17`,cy:`17`,r:`2`}]],f=[[`path`,{d:`M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z`}],[`path`,{d:`M21.21 15.89A10 10 0 1 1 8 2.83`}]],p=[[`path`,{d:`M20 6 9 17l-5-5`}]],m=[[`path`,{d:`m6 9 6 6 6-6`}]],h=[[`path`,{d:`m15 18-6-6 6-6`}]],g=[[`path`,{d:`m9 18 6-6-6-6`}]],_=[[`path`,{d:`m18 15-6-6-6 6`}]],v=[[`circle`,{cx:`12`,cy:`12`,r:`10`}],[`line`,{x1:`12`,x2:`12`,y1:`8`,y2:`12`}],[`line`,{x1:`12`,x2:`12.01`,y1:`16`,y2:`16`}]],y=[[`circle`,{cx:`12`,cy:`12`,r:`10`}],[`path`,{d:`m9 12 2 2 4-4`}]];e.AlertTriangle=[[`path`,{d:`m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3`}],[`path`,{d:`M12 9v4`}],[`path`,{d:`M12 17h.01`}]],e.ArrowDownRight=t,e.ArrowRight=n,e.ArrowUpRight=r,e.BadgeCheck=i,e.Banknote=a,e.BedDouble=o,e.Building2=s,e.Calendar=u,e.CalendarClock=c,e.CalendarDays=l,e.Car=d,e.Check=p,e.CheckCircle2=y,e.ChevronDown=m,e.ChevronLeft=h,e.ChevronRight=g,e.ChevronUp=_,e.Circle=[[`circle`,{cx:`12`,cy:`12`,r:`10`}]],e.CircleAlert=v,e.CircleCheck=y,e.CircleDollarSign=[[`circle`,{cx:`12`,cy:`12`,r:`10`}],[`path`,{d:`M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8`}],[`path`,{d:`M12 18V6`}]],e.CirclePlus=[[`circle`,{cx:`12`,cy:`12`,r:`10`}],[`path`,{d:`M8 12h8`}],[`path`,{d:`M12 8v8`}]],e.CircleX=[[`circle`,{cx:`12`,cy:`12`,r:`10`}],[`path`,{d:`m15 9-6 6`}],[`path`,{d:`m9 9 6 6`}]],e.ClipboardList=[[`rect`,{width:`8`,height:`4`,x:`8`,y:`2`,rx:`1`,ry:`1`}],[`path`,{d:`M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2`}],[`path`,{d:`M12 11h4`}],[`path`,{d:`M12 16h4`}],[`path`,{d:`M8 11h.01`}],[`path`,{d:`M8 16h.01`}]],e.Clock=[[`path`,{d:`M12 6v6l4 2`}],[`circle`,{cx:`12`,cy:`12`,r:`10`}]],e.Coffee=[[`path`,{d:`M10 2v2`}],[`path`,{d:`M14 2v2`}],[`path`,{d:`M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1`}],[`path`,{d:`M6 2v2`}]],e.Coins=[[`circle`,{cx:`8`,cy:`8`,r:`6`}],[`path`,{d:`M18.09 10.37A6 6 0 1 1 10.34 18`}],[`path`,{d:`M7 6h1v4`}],[`path`,{d:`m16.71 13.88.7.71-2.82 2.82`}]],e.Copy=[[`rect`,{width:`14`,height:`14`,x:`8`,y:`8`,rx:`2`,ry:`2`}],[`path`,{d:`M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2`}]],e.CreditCard=[[`rect`,{width:`20`,height:`14`,x:`2`,y:`5`,rx:`2`}],[`line`,{x1:`2`,x2:`22`,y1:`10`,y2:`10`}]],e.DatabaseBackup=[[`ellipse`,{cx:`12`,cy:`5`,rx:`9`,ry:`3`}],[`path`,{d:`M3 12a9 3 0 0 0 5 2.69`}],[`path`,{d:`M21 9.3V5`}],[`path`,{d:`M3 5v14a9 3 0 0 0 6.47 2.88`}],[`path`,{d:`M12 12v4h4`}],[`path`,{d:`M13 20a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L12 16`}]],e.DoorOpen=[[`path`,{d:`M11 20H2`}],[`path`,{d:`M11 4.562v16.157a1 1 0 0 0 1.242.97L19 20V5.562a2 2 0 0 0-1.515-1.94l-4-1A2 2 0 0 0 11 4.561z`}],[`path`,{d:`M11 4H8a2 2 0 0 0-2 2v14`}],[`path`,{d:`M14 12h.01`}],[`path`,{d:`M22 20h-3`}]],e.Download=[[`path`,{d:`M12 15V3`}],[`path`,{d:`M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4`}],[`path`,{d:`m7 10 5 5 5-5`}]],e.Droplets=[[`path`,{d:`M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z`}],[`path`,{d:`M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97`}]],e.ExternalLink=[[`path`,{d:`M15 3h6v6`}],[`path`,{d:`M10 14 21 3`}],[`path`,{d:`M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6`}]],e.Eye=[[`path`,{d:`M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0`}],[`circle`,{cx:`12`,cy:`12`,r:`3`}]],e.EyeOff=[[`path`,{d:`M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49`}],[`path`,{d:`M14.084 14.158a3 3 0 0 1-4.242-4.242`}],[`path`,{d:`M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143`}],[`path`,{d:`m2 2 20 20`}]],e.FilePlus2=[[`path`,{d:`M11.35 22H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v5.35`}],[`path`,{d:`M14 2v5a1 1 0 0 0 1 1h5`}],[`path`,{d:`M14 19h6`}],[`path`,{d:`M17 16v6`}]],e.FileText=[[`path`,{d:`M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z`}],[`path`,{d:`M14 2v5a1 1 0 0 0 1 1h5`}],[`path`,{d:`M10 9H8`}],[`path`,{d:`M16 13H8`}],[`path`,{d:`M16 17H8`}]],e.Filter=[[`path`,{d:`M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z`}]],e.HandCoins=[[`path`,{d:`M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17`}],[`path`,{d:`m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9`}],[`path`,{d:`m2 16 6 6`}],[`circle`,{cx:`16`,cy:`9`,r:`2.9`}],[`circle`,{cx:`6`,cy:`5`,r:`3`}]],e.House=[[`path`,{d:`M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8`}],[`path`,{d:`M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z`}]],e.Inbox=[[`polyline`,{points:`22 12 16 12 14 15 10 15 8 12 2 12`}],[`path`,{d:`M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z`}]],e.Info=[[`circle`,{cx:`12`,cy:`12`,r:`10`}],[`path`,{d:`M12 16v-4`}],[`path`,{d:`M12 8h.01`}]],e.KeyRound=[[`path`,{d:`M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z`}],[`circle`,{cx:`16.5`,cy:`7.5`,r:`.5`,fill:`currentColor`}]],e.Landmark=[[`path`,{d:`M10 18v-7`}],[`path`,{d:`M11.12 2.198a2 2 0 0 1 1.76.006l7.866 3.847c.476.233.31.949-.22.949H3.474c-.53 0-.695-.716-.22-.949z`}],[`path`,{d:`M14 18v-7`}],[`path`,{d:`M18 18v-7`}],[`path`,{d:`M3 22h18`}],[`path`,{d:`M6 18v-7`}]],e.LayoutDashboard=[[`rect`,{width:`7`,height:`9`,x:`3`,y:`3`,rx:`1`}],[`rect`,{width:`7`,height:`5`,x:`14`,y:`3`,rx:`1`}],[`rect`,{width:`7`,height:`9`,x:`14`,y:`12`,rx:`1`}],[`rect`,{width:`7`,height:`5`,x:`3`,y:`16`,rx:`1`}]],e.LayoutGrid=[[`rect`,{width:`7`,height:`7`,x:`3`,y:`3`,rx:`1`}],[`rect`,{width:`7`,height:`7`,x:`14`,y:`3`,rx:`1`}],[`rect`,{width:`7`,height:`7`,x:`14`,y:`14`,rx:`1`}],[`rect`,{width:`7`,height:`7`,x:`3`,y:`14`,rx:`1`}]],e.List=[[`path`,{d:`M3 5h.01`}],[`path`,{d:`M3 12h.01`}],[`path`,{d:`M3 19h.01`}],[`path`,{d:`M8 5h13`}],[`path`,{d:`M8 12h13`}],[`path`,{d:`M8 19h13`}]],e.Loader2=[[`path`,{d:`M21 12a9 9 0 1 1-6.219-8.56`}]],e.Lock=[[`rect`,{width:`18`,height:`11`,x:`3`,y:`11`,rx:`2`,ry:`2`}],[`path`,{d:`M7 11V7a5 5 0 0 1 10 0v4`}]],e.LogIn=[[`path`,{d:`m10 17 5-5-5-5`}],[`path`,{d:`M15 12H3`}],[`path`,{d:`M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4`}]],e.LogOut=[[`path`,{d:`m16 17 5-5-5-5`}],[`path`,{d:`M21 12H9`}],[`path`,{d:`M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4`}]],e.MapPin=[[`path`,{d:`M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0`}],[`circle`,{cx:`12`,cy:`10`,r:`3`}]],e.Menu=[[`path`,{d:`M4 5h16`}],[`path`,{d:`M4 12h16`}],[`path`,{d:`M4 19h16`}]],e.MessageCircle=[[`path`,{d:`M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719`}]],e.MessageSquare=[[`path`,{d:`M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z`}]],e.MessageSquareText=[[`path`,{d:`M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z`}],[`path`,{d:`M7 11h10`}],[`path`,{d:`M7 15h6`}],[`path`,{d:`M7 7h8`}]],e.MoreVertical=[[`circle`,{cx:`12`,cy:`12`,r:`1`}],[`circle`,{cx:`12`,cy:`5`,r:`1`}],[`circle`,{cx:`12`,cy:`19`,r:`1`}]],e.Pencil=[[`path`,{d:`M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z`}],[`path`,{d:`m15 5 4 4`}]],e.Percent=[[`line`,{x1:`19`,x2:`5`,y1:`5`,y2:`19`}],[`circle`,{cx:`6.5`,cy:`6.5`,r:`2.5`}],[`circle`,{cx:`17.5`,cy:`17.5`,r:`2.5`}]],e.Phone=[[`path`,{d:`M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384`}]],e.PhoneCall=[[`path`,{d:`M13 2a9 9 0 0 1 9 9`}],[`path`,{d:`M13 6a5 5 0 0 1 5 5`}],[`path`,{d:`M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384`}]],e.PhoneOutgoing=[[`path`,{d:`m16 8 6-6`}],[`path`,{d:`M22 8V2h-6`}],[`path`,{d:`M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384`}]],e.PieChart=f,e.Plus=[[`path`,{d:`M5 12h14`}],[`path`,{d:`M12 5v14`}]],e.Printer=[[`path`,{d:`M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2`}],[`path`,{d:`M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6`}],[`rect`,{x:`6`,y:`14`,width:`12`,height:`8`,rx:`1`}]],e.Receipt=[[`path`,{d:`M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z`}],[`path`,{d:`M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8`}],[`path`,{d:`M12 17.5v-11`}]],e.ReceiptText=[[`path`,{d:`M13 16H8`}],[`path`,{d:`M14 8H8`}],[`path`,{d:`M16 12H8`}],[`path`,{d:`M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z`}]],e.RefreshCw=[[`path`,{d:`M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8`}],[`path`,{d:`M21 3v5h-5`}],[`path`,{d:`M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16`}],[`path`,{d:`M8 16H3v5`}]],e.Refrigerator=[[`path`,{d:`M5 6a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6Z`}],[`path`,{d:`M5 10h14`}],[`path`,{d:`M15 7v6`}]],e.Repeat=[[`path`,{d:`m17 2 4 4-4 4`}],[`path`,{d:`M3 11v-1a4 4 0 0 1 4-4h14`}],[`path`,{d:`m7 22-4-4 4-4`}],[`path`,{d:`M21 13v1a4 4 0 0 1-4 4H3`}]],e.RotateCcw=[[`path`,{d:`M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8`}],[`path`,{d:`M3 3v5h5`}]],e.ScrollText=[[`path`,{d:`M15 12h-5`}],[`path`,{d:`M15 8h-5`}],[`path`,{d:`M19 17V5a2 2 0 0 0-2-2H4`}],[`path`,{d:`M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3`}]],e.Search=[[`path`,{d:`m21 21-4.34-4.34`}],[`circle`,{cx:`11`,cy:`11`,r:`8`}]],e.SearchX=[[`path`,{d:`m13.5 8.5-5 5`}],[`path`,{d:`m8.5 8.5 5 5`}],[`circle`,{cx:`11`,cy:`11`,r:`8`}],[`path`,{d:`m21 21-4.3-4.3`}]],e.Send=[[`path`,{d:`M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z`}],[`path`,{d:`m21.854 2.147-10.94 10.939`}]],e.Settings=[[`path`,{d:`M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915`}],[`circle`,{cx:`12`,cy:`12`,r:`3`}]],e.ShieldCheck=[[`path`,{d:`M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z`}],[`path`,{d:`m9 12 2 2 4-4`}]],e.SlidersHorizontal=[[`path`,{d:`M10 5H3`}],[`path`,{d:`M12 19H3`}],[`path`,{d:`M14 3v4`}],[`path`,{d:`M16 17v4`}],[`path`,{d:`M21 12h-9`}],[`path`,{d:`M21 19h-5`}],[`path`,{d:`M21 5h-7`}],[`path`,{d:`M8 10v4`}],[`path`,{d:`M8 12H3`}]],e.Sparkles=[[`path`,{d:`M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z`}],[`path`,{d:`M20 2v4`}],[`path`,{d:`M22 4h-4`}],[`circle`,{cx:`4`,cy:`20`,r:`2`}]],e.Tags=[[`path`,{d:`M13.172 2a2 2 0 0 1 1.414.586l6.71 6.71a2.4 2.4 0 0 1 0 3.408l-4.592 4.592a2.4 2.4 0 0 1-3.408 0l-6.71-6.71A2 2 0 0 1 6 9.172V3a1 1 0 0 1 1-1z`}],[`path`,{d:`M2 7v6.172a2 2 0 0 0 .586 1.414l6.71 6.71a2.4 2.4 0 0 0 3.191.193`}],[`circle`,{cx:`10.5`,cy:`6.5`,r:`.5`,fill:`currentColor`}]],e.Trash2=[[`path`,{d:`M10 11v6`}],[`path`,{d:`M14 11v6`}],[`path`,{d:`M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6`}],[`path`,{d:`M3 6h18`}],[`path`,{d:`M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2`}]],e.TrendingDown=[[`path`,{d:`M16 17h6v-6`}],[`path`,{d:`m22 17-8.5-8.5-5 5L2 7`}]],e.TrendingUp=[[`path`,{d:`M16 7h6v6`}],[`path`,{d:`m22 7-8.5 8.5-5-5L2 17`}]],e.Unlock=[[`rect`,{width:`18`,height:`11`,x:`3`,y:`11`,rx:`2`,ry:`2`}],[`path`,{d:`M7 11V7a5 5 0 0 1 9.9-1`}]],e.Upload=[[`path`,{d:`M12 3v12`}],[`path`,{d:`m17 8-5-5-5 5`}],[`path`,{d:`M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4`}]],e.UserCheck=[[`path`,{d:`m16 11 2 2 4-4`}],[`path`,{d:`M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2`}],[`circle`,{cx:`9`,cy:`7`,r:`4`}]],e.UserCog=[[`path`,{d:`M10 15H6a4 4 0 0 0-4 4v2`}],[`path`,{d:`m14.305 16.53.923-.382`}],[`path`,{d:`m15.228 13.852-.923-.383`}],[`path`,{d:`m16.852 12.228-.383-.923`}],[`path`,{d:`m16.852 17.772-.383.924`}],[`path`,{d:`m19.148 12.228.383-.923`}],[`path`,{d:`m19.53 18.696-.382-.924`}],[`path`,{d:`m20.772 13.852.924-.383`}],[`path`,{d:`m20.772 16.148.924.383`}],[`circle`,{cx:`18`,cy:`15`,r:`3`}],[`circle`,{cx:`9`,cy:`7`,r:`4`}]],e.UserPlus=[[`path`,{d:`M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2`}],[`circle`,{cx:`9`,cy:`7`,r:`4`}],[`line`,{x1:`19`,x2:`19`,y1:`8`,y2:`14`}],[`line`,{x1:`22`,x2:`16`,y1:`11`,y2:`11`}]],e.UserRound=[[`circle`,{cx:`12`,cy:`8`,r:`5`}],[`path`,{d:`M20 21a8 8 0 0 0-16 0`}]],e.Users=[[`path`,{d:`M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2`}],[`path`,{d:`M16 3.128a4 4 0 0 1 0 7.744`}],[`path`,{d:`M22 21v-2a4 4 0 0 0-3-3.87`}],[`circle`,{cx:`9`,cy:`7`,r:`4`}]],e.Wallet=[[`path`,{d:`M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1`}],[`path`,{d:`M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4`}]],e.Wifi=[[`path`,{d:`M12 20h.01`}],[`path`,{d:`M2 8.82a15 15 0 0 1 20 0`}],[`path`,{d:`M5 12.859a10 10 0 0 1 14 0`}],[`path`,{d:`M8.5 16.429a5 5 0 0 1 7 0`}]],e.Wrench=[[`path`,{d:`M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z`}]],e.X=[[`path`,{d:`M18 6 6 18`}],[`path`,{d:`m6 6 12 12`}]],e.Zap=[[`path`,{d:`M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z`}]]}))(),Re={AlertTriangle:A.AlertTriangle,ArrowDownRight:A.ArrowDownRight,ArrowRight:A.ArrowRight,ArrowUpRight:A.ArrowUpRight,BadgeCheck:A.BadgeCheck,Banknote:A.Banknote,BedDouble:A.BedDouble,Building2:A.Building2,Calendar:A.Calendar,CalendarClock:A.CalendarClock,CalendarDays:A.CalendarDays,Car:A.Car,Check:A.Check,CheckCircle2:A.CheckCircle2,ChevronDown:A.ChevronDown,ChevronLeft:A.ChevronLeft,ChevronRight:A.ChevronRight,ChevronUp:A.ChevronUp,Circle:A.Circle,CircleAlert:A.CircleAlert,CircleCheck:A.CircleCheck,CircleDollarSign:A.CircleDollarSign,CirclePlus:A.CirclePlus,CircleX:A.CircleX,ClipboardList:A.ClipboardList,Clock:A.Clock,Coffee:A.Coffee,Coins:A.Coins,Copy:A.Copy,CreditCard:A.CreditCard,DatabaseBackup:A.DatabaseBackup,DoorOpen:A.DoorOpen,Download:A.Download,Droplets:A.Droplets,ExternalLink:A.ExternalLink,Eye:A.Eye,EyeOff:A.EyeOff,FilePlus2:A.FilePlus2,FileText:A.FileText,Filter:A.Filter,HandCoins:A.HandCoins,House:A.House,Info:A.Info,Inbox:A.Inbox,KeyRound:A.KeyRound,Landmark:A.Landmark,LayoutDashboard:A.LayoutDashboard,LayoutGrid:A.LayoutGrid,List:A.List,Loader2:A.Loader2,Lock:A.Lock,LogIn:A.LogIn,LogOut:A.LogOut,MapPin:A.MapPin,Menu:A.Menu,MessageCircle:A.MessageCircle,MessageSquare:A.MessageSquare,MessageSquareText:A.MessageSquareText,MoreVertical:A.MoreVertical,Pencil:A.Pencil,Percent:A.Percent,Phone:A.Phone,PhoneCall:A.PhoneCall,PhoneOutgoing:A.PhoneOutgoing,PieChart:A.PieChart,Plus:A.Plus,Printer:A.Printer,Receipt:A.Receipt,ReceiptText:A.ReceiptText,Refrigerator:A.Refrigerator,RefreshCw:A.RefreshCw,Repeat:A.Repeat,RotateCcw:A.RotateCcw,ScrollText:A.ScrollText,Search:A.Search,SearchX:A.SearchX,Send:A.Send,Settings:A.Settings,ShieldCheck:A.ShieldCheck,SlidersHorizontal:A.SlidersHorizontal,Sparkles:A.Sparkles,Tags:A.Tags,Trash2:A.Trash2,TrendingDown:A.TrendingDown,TrendingUp:A.TrendingUp,Unlock:A.Unlock,Upload:A.Upload,UserCheck:A.UserCheck,UserCog:A.UserCog,UserPlus:A.UserPlus,UserRound:A.UserRound,Users:A.Users,Wallet:A.Wallet,Wifi:A.Wifi,Wrench:A.Wrench,X:A.X,Zap:A.Zap};function ze(e={}){return Object.entries(e).map(([e,t])=>`${e}="${String(t).replace(/"/g,`&quot;`)}"`).join(` `)}function j(e,t=`w-5 h-5`,n=2){let r=Re[e];return r?`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${n}" stroke-linecap="round" stroke-linejoin="round" class="${t}" aria-hidden="true" focusable="false">${r.map(([e,t])=>`<${e} ${ze(t)} />`).join(``)}</svg>`:``}Object.keys(Re);var Be={sm:`sm:max-w-md`,md:`sm:max-w-lg`,lg:`sm:max-w-2xl`,xl:`sm:max-w-4xl`,full:`sm:max-w-6xl`},M=[],Ve=null;function He(e){return Array.from(e.querySelectorAll(`a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])`)).filter(e=>e.offsetParent!==null)}function Ue(e){if(!M.length)return;let t=M[M.length-1];if(e.key===`Escape`&&t.dismissible)e.preventDefault(),t.close();else if(e.key===`Tab`){let n=He(t.panel);if(!n.length)return;let r=n[0],i=n[n.length-1];e.shiftKey&&document.activeElement===r?(e.preventDefault(),i.focus()):!e.shiftKey&&document.activeElement===i&&(e.preventDefault(),r.focus())}}document.addEventListener(`keydown`,Ue);function N({title:e=``,subtitle:t=``,body:n=``,footer:r=``,size:i=`md`,dismissible:a=!0,onMount:o,onClose:s}={}){let c=document.getElementById(`modal-root`);if(!c)throw Error(`modal-root tidak ditemukan`);M.length||(Ve=document.activeElement,document.body.classList.add(`overflow-hidden`));let l=document.createElement(`div`);l.className=`modal-backdrop`,l.innerHTML=`
    <div class="modal-panel ${Be[i]||Be.md}" role="dialog" aria-modal="true" aria-label="${O(e)}">
      <div class="modal-head">
        <div class="min-w-0">
          <h2 class="text-lg font-extrabold text-stone-800 leading-tight truncate">${e}</h2>
          ${t?`<p class="text-xs text-stone-500 mt-0.5">${t}</p>`:``}
        </div>
        ${a?`<button type="button" class="btn-ghost btn-sm shrink-0" data-modal-close aria-label="Tutup dialog">${j(`X`,`w-5 h-5`)}</button>`:``}
      </div>
      <div class="modal-body">${n}</div>
      ${r?`<div class="modal-foot">${r}</div>`:``}
    </div>
  `;let u=l.querySelector(`.modal-panel`),d=!1,f=()=>{if(d)return;d=!0;let e=M.findIndex(e=>e.wrap===l);e>=0&&M.splice(e,1),l.remove(),M.length||(document.body.classList.remove(`overflow-hidden`),Ve&&typeof Ve.focus==`function`&&Ve.focus({preventScroll:!0}),Ve=null),s?.()},p={el:l,panel:u,close:f,dismissible:a};return M.push(p),l.addEventListener(`mousedown`,e=>{e.target===l&&a&&f()}),l.querySelectorAll(`[data-modal-close]`).forEach(e=>{e.addEventListener(`click`,f)}),c.appendChild(l),o?.(l,f),requestAnimationFrame(()=>{(u.querySelector(`.modal-body input:not([type="hidden"]), .modal-body select, .modal-body textarea`)||u.querySelector(`.modal-foot .btn-primary, .modal-foot .btn-danger, .modal-foot button`)||u.querySelector(`[data-modal-close]`))?.focus({preventScroll:!0})}),p}function We(){[...M].reverse().forEach(e=>e.close())}function P({title:e=`Konfirmasi`,message:t=`Apakah Anda yakin?`,confirmText:n=`Ya, Lanjutkan`,cancelText:r=`Batal`,danger:i=!1,iconName:a=`AlertTriangle`}={}){return new Promise(o=>{let s=!1,c=e=>{s||(s=!0,o(e))};N({title:e,size:`sm`,body:`
        <div class="flex items-start gap-3.5">
          <div class="w-11 h-11 rounded-2xl shrink-0 flex items-center justify-center ${i?`bg-rose-50 text-rose-600`:`bg-amber-50 text-amber-600`}">
            ${j(a,`w-6 h-6`)}
          </div>
          <div class="text-sm text-stone-600 leading-relaxed pt-0.5">${t}</div>
        </div>
      `,footer:`
        <button type="button" class="btn-outline btn-sm" data-cancel>${O(r)}</button>
        <button type="button" class="${i?`btn-danger`:`btn-primary`} btn-sm" data-confirm>${O(n)}</button>
      `,onMount(e,t){e.querySelector(`[data-cancel]`).addEventListener(`click`,()=>{c(!1),t()}),e.querySelector(`[data-confirm]`).addEventListener(`click`,()=>{c(!0),t()})},onClose(){c(!1)}})})}var Ge={success:{icon:`CheckCircle2`,color:`text-emerald-400`,border:`border-emerald-500/30`},error:{icon:`CircleX`,color:`text-rose-400`,border:`border-rose-500/30`},warning:{icon:`AlertTriangle`,color:`text-amber-400`,border:`border-amber-500/30`},info:{icon:`Info`,color:`text-sky-400`,border:`border-sky-500/30`}};function F(e,t=`success`,n=3400){let r=document.getElementById(`toast-root`);if(!r)return;let i=Ge[t]||Ge.success,a=document.createElement(`div`);a.className=`pointer-events-auto flex items-start gap-3 rounded-2xl border ${i.border} bg-stone-900 px-4 py-3 text-sm font-semibold text-white shadow-2xl transition duration-200 translate-y-2 opacity-0`,a.setAttribute(`role`,`status`),a.innerHTML=`
    <span class="shrink-0 ${i.color}">${j(i.icon,`w-5 h-5`)}</span>
    <span class="leading-snug">${O(e)}</span>
  `,r.appendChild(a),requestAnimationFrame(()=>{a.classList.remove(`translate-y-2`,`opacity-0`)}),setTimeout(()=>{a.classList.add(`translate-y-2`,`opacity-0`),setTimeout(()=>a.remove(),250)},n)}var Ke=864e5;function I(e){if(typeof e==`number`)return Number.isFinite(e)?e:0;let t=String(e??``).replace(/[^\d.-]/g,``),n=Number(t);return Number.isFinite(n)?n:0}function L(e){return`Rp${Math.round(I(e)).toLocaleString(`id-ID`)}`}function qe(e=new Date){let t=e instanceof Date?e:new Date(e);return Number.isNaN(t.getTime())?``:`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,`0`)}-${String(t.getDate()).padStart(2,`0`)}`}function R(){return qe(new Date)}function z(e){if(!e)return null;let[t,n,r]=String(e).slice(0,10).split(`-`).map(Number);if(!t||!n||!r)return null;let i=new Date(t,n-1,r);return Number.isNaN(i.getTime())?null:i}function B(e,t){let n=z(e)||new Date;return n.setDate(n.getDate()+Number(t||0)),qe(n)}function Je(e,t){let n=z(e)||new Date,r=n.getDate();n.setDate(1),n.setMonth(n.getMonth()+Number(t||0));let i=new Date(n.getFullYear(),n.getMonth()+1,0).getDate();return n.setDate(Math.min(r,i)),qe(n)}function V(e,t){let n=z(e),r=z(t);return!n||!r?0:Math.round((r.getTime()-n.getTime())/Ke)}function H(e,t={}){let n=e instanceof Date?e:z(e);return n?n.toLocaleDateString(`id-ID`,{day:`2-digit`,month:`short`,year:`numeric`,...t}):`—`}function Ye(e){return H(e,{weekday:`long`,day:`numeric`,month:`long`,year:`numeric`})}function Xe(e){let t=e instanceof Date?e:new Date(e);return Number.isNaN(t.getTime())?`—`:t.toLocaleString(`id-ID`,{day:`2-digit`,month:`short`,year:`numeric`,hour:`2-digit`,minute:`2-digit`})}function Ze(e=new Date){let t=e instanceof Date?e:z(e)||new Date(e);return!t||Number.isNaN(t.getTime())?``:`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,`0`)}`}function Qe(e,t=new Date){return Ze(e)===Ze(t)}function $e(e){let t=String(e??``).replace(/\D/g,``);return t?(t.startsWith(`0`)?t=`62${t.slice(1)}`:t.startsWith(`620`)?t=`62${t.slice(3)}`:t.startsWith(`8`)&&(t=`62${t}`),t):``}function et(e,t=``){return`https://wa.me/${$e(e)}${t?`?text=${encodeURIComponent(t)}`:``}`}function tt(e=``){return String(e).trim().split(/\s+/).map(e=>e.replace(/[^\p{L}\p{N}]/gu,``)).filter(Boolean).slice(0,2).map(e=>e.charAt(0).toUpperCase()).join(``)||`?`}function nt(){let e=T(),t=e.rooms,n=t.length,r=t.filter(e=>e.status===`terisi`).length,i=t.filter(e=>e.status===`kosong`).length,a=t.filter(e=>e.status===`booking`).length,o=st(),s=e.bills.filter(e=>e.status===`unpaid`).reduce((e,t)=>e+I(t.amount-t.paid),0),c=e.manualInvoices.filter(e=>e.status===`unpaid`).reduce((e,t)=>e+I(t.amount-t.paid),0),l=e.expenses.filter(e=>Qe(e.date)).reduce((e,t)=>e+I(t.amount),0);return{total:n,occupied:r,vacant:i,booking:a,occupancy:n?r/n*100:0,revenue:o.totalRecognized,expenses:l,profit:o.totalRecognized-l,outstanding:s+c,expiring:at(7),checkins:it(),unpaidBills:ot(),floors:rt()}}function rt(){let e=T().rooms;return[...new Set(e.map(e=>e.lantai))].sort().map(t=>{let n=e.filter(e=>e.lantai===t),r=n.filter(e=>e.status===`terisi`).length,i=n.filter(e=>e.status===`kosong`).length,a=n.filter(e=>e.status===`booking`).length;return{floor:t,total:n.length,occupied:r,vacant:i,booking:a,occupancy:n.length?r/n.length*100:0}})}function it(){return T().rooms.filter(e=>e.status===`booking`&&e.booking).map(e=>({room:e,booking:e.booking})).sort((e,t)=>String(e.booking.startDate).localeCompare(String(t.booking.startDate)))}function at(e=7){let t=R();return T().tenants.filter(e=>e.status===`aktif`&&e.endDate).map(e=>({tenant:e,roomNumber:e.roomNumber,daysLeft:V(t,e.endDate)})).filter(t=>t.daysLeft<=e).sort((e,t)=>e.daysLeft-t.daysLeft)}function ot(){return T().bills.filter(e=>e.status===`unpaid`).sort((e,t)=>String(e.dueDate).localeCompare(String(t.dueDate)))}function st(){let e=T(),t=[];for(let n of e.tenants.filter(e=>e.status===`aktif`)){let e=Math.max(0,I(n.monthlyCharge)),r=Math.max(0,I(n.totalPaid)),i=e,a=Math.max(0,r-e),o=Math.max(0,e-r);t.push({tenant:n,name:n.name,roomNumber:n.roomNumber||`—`,paid:r,monthlyCharge:e,recognized:i,deferred:a,outstanding:o})}return t.sort((e,t)=>e.name.localeCompare(t.name,`id`)),{rows:t,totalRecognized:t.reduce((e,t)=>e+t.recognized,0),totalDeferred:t.reduce((e,t)=>e+t.deferred,0),totalPaid:t.reduce((e,t)=>e+t.paid,0),totalOutstanding:t.reduce((e,t)=>e+t.outstanding,0)}}function ct(e=new Date){let t=T(),n=st(),r=t.manualInvoices.filter(t=>t.status===`paid`&&Qe(t.paidAt,e)).reduce((e,t)=>e+I(t.paid),0),i=t.expenses.filter(t=>Qe(t.date,e)),a=i.reduce((e,t)=>e+I(t.amount),0),o=i.reduce((e,t)=>{let n=t.category||`Lain-lain`;return e[n]=(e[n]||0)+I(t.amount),e},{}),s=n.totalRecognized,c=s+r;return{rentRevenue:s,serviceRevenue:r,revenue:c,expenses:a,expenseByCategory:Object.entries(o).sort((e,t)=>t[1]-e[1]),net:c-a}}function lt(e=6,t=new Date){let n=T(),r=[];for(let n=e-1;n>=0;--n){let e=new Date(t.getFullYear(),t.getMonth()-n,1);r.push({key:Ze(e),label:e.toLocaleDateString(`id-ID`,{month:`short`}),income:0,expense:0})}let i=new Map(r.map(e=>[e.key,e]));for(let e of n.bills){if(e.status!==`paid`||!e.paidAt)continue;let t=i.get(Ze(e.paidAt));t&&(t.income+=I(e.paid))}for(let e of n.manualInvoices){if(e.status!==`paid`||!e.paidAt)continue;let t=i.get(Ze(e.paidAt));t&&(t.income+=I(e.paid))}for(let e of n.expenses){let t=i.get(Ze(e.date));t&&(t.expense+=I(e.amount))}return r.map(e=>({...e,net:e.income-e.expense}))}function ut(){return{...h,...T().templates||{}}}function dt(e){let t={...ut(),...e};for(let[e,n]of Object.entries(t))if(!String(n||``).trim())throw Error(`Template "${e}" tidak boleh kosong.`);E(e=>{e.templates=t})}function ft(e,t={}){return(ut()[e]||``).replace(/\{([a-z_]+)\}/gi,(e,n)=>{let r=t[n];return r==null?e:String(r)})}var pt={nama:`Rani Putri`,kamar:`204`,nominal:L(22e5),jatuh_tempo:H(new Date().toISOString().slice(0,10)),no_invoice:`SRV/202610/0001`,item_layanan:`Laundry 5 Kg`};function mt(e){let t=a[e]||a.kosong;return`<span class="${t.badge}">${t.label}</span>`}function ht(e){let t=o[e]||o.unpaid;return`<span class="${t.badge}">${t.label}</span>`}function U({eyebrow:e=``,eyebrowClass:t=`badge-gold`,title:n=``,subtitle:r=``,actions:i=``}){return`
    <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
      <div class="min-w-0">
        ${e?`<span class="${t}">${O(e)}</span>`:``}
        <h1 class="page-title mt-2">${n}</h1>
        ${r?`<p class="page-subtitle">${r}</p>`:``}
      </div>
      ${i?`<div class="flex flex-wrap items-center gap-2 shrink-0">${i}</div>`:``}
    </div>
  `}var gt={default:{card:`card`,label:`text-stone-600`,value:`text-stone-800`,iconBox:`bg-stone-100 text-stone-600`},green:{card:`card bg-emerald-50/60 border-emerald-200`,label:`text-emerald-800`,value:`text-emerald-900`,iconBox:`bg-emerald-100 text-emerald-700`},amber:{card:`card bg-amber-50/60 border-amber-200`,label:`text-amber-800`,value:`text-amber-900`,iconBox:`bg-amber-100 text-amber-700`},indigo:{card:`card bg-indigo-50/60 border-indigo-200`,label:`text-indigo-800`,value:`text-indigo-900`,iconBox:`bg-indigo-100 text-indigo-700`},teal:{card:`card bg-teal-50/60 border-teal-200`,label:`text-teal-800`,value:`text-teal-900`,iconBox:`bg-teal-100 text-teal-700`},brand:{card:`card bg-brand text-white border-brand`,label:`text-gold`,value:`text-white`,iconBox:`bg-white/10 text-gold`},rose:{card:`card bg-rose-50/60 border-rose-200`,label:`text-rose-800`,value:`text-rose-900`,iconBox:`bg-rose-100 text-rose-700`}};function W({label:e,value:t,iconName:n=`CircleDollarSign`,tone:r=`default`,hint:i=``}){let a=gt[r]||gt.default;return`
    <div class="${a.card} p-4 rounded-2xl">
      <div class="flex items-start justify-between gap-2">
        <p class="text-[11px] font-bold uppercase tracking-wider ${a.label}">${O(e)}</p>
        <span class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${a.iconBox}">${j(n,`w-4 h-4`)}</span>
      </div>
      <p class="text-2xl font-black mt-1.5 ${a.value}">${t}</p>
      ${i?`<p class="text-[11px] mt-1 ${a.label}">${i}</p>`:``}
    </div>
  `}function _t(e,t=`Belum ada data.`){return`<tr><td colspan="${e}" class="px-4 py-10 text-center text-stone-400 text-sm">${O(t)}</td></tr>`}function G({iconName:e=`Inbox`,title:t=`Belum ada data`,description:n=``,action:r=``}){return`
    <div class="flex flex-col items-center justify-center text-center px-6 py-14">
      <div class="w-14 h-14 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mb-3">
        ${j(e,`w-7 h-7`)}
      </div>
      <h2 class="font-extrabold text-stone-700">${O(t)}</h2>
      ${n?`<p class="text-sm text-stone-500 mt-1 max-w-sm">${O(n)}</p>`:``}
      ${r?`<div class="mt-4">${r}</div>`:``}
    </div>
  `}function K(e,t=`w-10 h-10 text-xs`){return`<span class="inline-flex items-center justify-center rounded-full bg-brand text-gold font-extrabold shrink-0 ${t}">${O(tt(e))}</span>`}function q({title:e,description:t=``,actions:n=``}){return`
    <div class="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-line">
      <div>
        <h2 class="font-extrabold text-stone-800 text-sm">${O(e)}</h2>
        ${t?`<p class="text-xs text-stone-500 mt-0.5">${O(t)}</p>`:``}
      </div>
      ${n?`<div class="flex items-center gap-2">${n}</div>`:``}
    </div>
  `}function vt(e,t=`bg-emerald-500`){return`
    <div class="h-2 rounded-full bg-stone-200/80 overflow-hidden">
      <div class="h-full rounded-full ${t} transition-all duration-500" style="width:${Math.min(100,Math.max(0,Number(e)||0))}%"></div>
    </div>
  `}function yt(e){return`<p class="text-[11px] font-extrabold uppercase tracking-wider text-stone-400">${O(e)}</p>`}function bt({activeOnly:e=!1}={}){let t=T().addons||[];return e?t.filter(e=>e.active):[...t]}function xt({id:e=null,name:t,price:n,active:r=!0}){let i=String(t||``).trim(),a=Math.round(I(n));if(!i)throw Error(`Nama add-on wajib diisi.`);if(a<=0)throw Error(`Tarif add-on harus lebih dari 0.`);E(t=>{if(e){let n=t.addons.find(t=>String(t.id)===String(e));if(!n)throw Error(`Add-on tidak ditemukan.`);Object.assign(n,{name:i,price:a,active:!!r})}else t.addons.push({id:D(t.addons),name:i,price:a,active:!!r})})}function St(e){E(t=>{let n=t.addons.find(t=>String(t.id)===String(e));n&&(n.active=!n.active)})}function Ct(e){E(t=>{t.addons=t.addons.filter(t=>String(t.id)!==String(e))})}function wt(e,t){return e.tenants.find(e=>String(e.id)===String(t))||null}function Tt(e,t){return e.rooms.find(e=>String(e.id)===String(t))||null}function Et(e,t){let n=t.tenantId?wt(e,t.tenantId):null,r=t.roomId?Tt(e,t.roomId):null,i=Math.max(0,Math.round(I(t.amount)));if(i<=0)throw Error(`Nominal tagihan harus lebih dari 0.`);let a=!!t.paid,o=new Date().toISOString(),s={id:D(e.bills),number:Se(`INV`,e.bills),tenantId:n?.id??t.tenantId??null,roomId:r?.id??t.roomId??null,tenantName:n?.name||t.tenantName||`Tanpa nama`,phone:n?.phone||t.phone||``,roomNumber:r?.nomor||t.roomNumber||`—`,type:t.type||`Sewa`,description:t.description||``,amount:i,paid:a?i:0,status:a?`paid`:`unpaid`,dueDate:t.dueDate||R(),periodStart:t.periodStart||null,periodEnd:t.periodEnd||null,source:t.source||`rent`,method:a?t.method||`Tunai / Cash`:``,note:t.note||``,createdAt:o,paidAt:a?o:null};return e.bills.push(s),s}function Dt({tenantId:e,type:t,amount:n,dueDate:r,note:i=``}){let a=T().tenants.find(t=>String(t.id)===String(e));if(!a)throw Error(`Penghuni tidak ditemukan.`);if(!String(t||``).trim())throw Error(`Jenis tagihan wajib diisi.`);if(I(n)<=0)throw Error(`Nominal tagihan harus lebih dari 0.`);let o;return E(e=>{o=Et(e,{tenantId:a.id,roomId:a.roomId,type:String(t).trim(),amount:n,dueDate:r||R(),note:i,source:`manual`})}),o}function Ot({status:e=null,tenantId:t=null}={}){return T().bills.filter(t=>!e||t.status===e).filter(e=>!t||String(e.tenantId)===String(t)).sort((e,t)=>e.status===t.status?String(e.dueDate).localeCompare(String(t.dueDate)):e.status===`unpaid`?-1:1)}function kt(e){return T().bills.find(t=>String(t.id)===String(e))||null}function At(e,{method:t=`Virtual Account BCA`,note:n=``}={}){let r=kt(e);if(!r)throw Error(`Tagihan tidak ditemukan.`);return r.status===`paid`?r:(E(i=>{let a=i.bills.find(t=>String(t.id)===String(e)),o=Math.max(0,a.amount-I(a.paid)),s=new Date().toISOString();a.paid=a.amount,a.status=`paid`,a.paidAt=s,a.method=t,a.note=n;let c=wt(i,a.tenantId);c&&(c.totalPaid=Math.max(0,I(c.totalPaid)+o),c.payments=c.payments||[],c.payments.push({id:D(c.payments),date:R(),amount:o,type:r.type,method:t,note:n,billId:a.id}))}),kt(e))}function jt(e){let t=kt(e);if(!t)throw Error(`Tagihan tidak ditemukan.`);return t.status===`paid`?(E(n=>{let r=n.bills.find(t=>String(t.id)===String(e));r.paid=0,r.status=`unpaid`,r.paidAt=null,r.method=``,r.note=``;let i=wt(n,r.tenantId);i&&(i.totalPaid=Math.max(0,I(i.totalPaid)-t.amount),i.payments=(i.payments||[]).filter(e=>String(e.billId)!==String(r.id)))}),kt(e)):t}function Mt(e){let t=kt(e);t&&E(n=>{if(t.status===`paid`){let e=wt(n,t.tenantId);e&&(e.totalPaid=Math.max(0,I(e.totalPaid)-t.paid),e.payments=(e.payments||[]).filter(e=>String(e.billId)!==String(t.id)))}n.bills=n.bills.filter(t=>String(t.id)!==String(e))})}function Nt(){return[...T().manualInvoices].sort((e,t)=>t.id-e.id)}function Pt({roomId:e,item:t,amount:n,dueDate:r}){let i=T(),a=i.rooms.find(t=>String(t.id)===String(e));if(!a)throw Error(`Kamar tidak ditemukan.`);if(!String(t||``).trim())throw Error(`Item layanan wajib diisi.`);if(I(n)<=0)throw Error(`Nominal invoice harus lebih dari 0.`);let o=a.tenantId?i.tenants.find(e=>String(e.id)===String(a.tenantId)):null,s=a.status===`booking`?a.booking:null,c=o?.name||s?.name||`Calon Tenant`,l=o?.phone||s?.phone||``,u;return E(e=>{let i={id:D(e.manualInvoices),number:Se(`SRV`,e.manualInvoices),tenantId:o?.id??null,roomId:a.id,tenantName:c,phone:l,roomNumber:a.nomor,item:String(t).trim(),amount:Math.round(I(n)),paid:0,status:`unpaid`,dueDate:r||B(R(),7),method:``,note:``,createdAt:new Date().toISOString(),paidAt:null};e.manualInvoices.push(i),u=i}),u}function Ft(e,{method:t=`Virtual Account BCA`,note:n=``}={}){E(r=>{let i=r.manualInvoices.find(t=>String(t.id)===String(e));if(!i)throw Error(`Invoice tidak ditemukan.`);i.status!==`paid`&&(i.paid=i.amount,i.status=`paid`,i.paidAt=new Date().toISOString(),i.method=t,i.note=n)})}function It(e){E(t=>{let n=t.manualInvoices.find(t=>String(t.id)===String(e));n&&(n.paid=0,n.status=`unpaid`,n.paidAt=null,n.method=``)})}function Lt(e){E(t=>{t.manualInvoices=t.manualInvoices.filter(t=>String(t.id)!==String(e))})}function Rt(e){return String(e)===`3`?`lantai3`:`lantai2`}function zt(e){return T().pricing[Rt(e)]||{}}function Bt(e,t){return I(zt(e)?.[t])}function Vt(){return I(T().settings?.depositDefault)||5e5}function Ht(e){return s.find(t=>t.key===String(e))||s[0]}function Ut({periode:e,startDate:t,endDate:n}){let r=Ht(e),i=z(t)?t:R();return r.kind===`months`?Je(i,r.months):r.kind===`days`?n&&V(i,n)>0?n:B(i,1):n&&V(i,n)>0?n:B(i,7)}function Wt(e,t,n){if(e.kind===`months`)return e.months;let r=Math.max(1,V(t,n));return e.kind===`days`?r:Math.max(1,Math.ceil(r/7))}function Gt(e,t){return t?t.type===`persen`?e*I(t.value)/100:I(t.value):0}function Kt({lantai:e,periode:t,startDate:n,endDate:r,promo:i=null,addons:a=[],depositEnabled:o=!1,depositValue:s=0,payOption:c=`partial`}){let l=Ht(t),u=z(n)?n:R(),d=Ut({periode:l.key,startDate:u,endDate:r});if(l.kind!==`months`&&V(u,d)<=0)throw Error(`Tanggal selesai harus setelah tanggal mulai.`);let f=Bt(e,l.key);if(!f)throw Error(`Tarif untuk periode ini belum diatur di Pricelist.`);let p=Wt(l,u,d),m=l.kind===`months`?f:f*p,h=i?i.type===`persen`?m*I(i.value)/100:I(i.value)*(l.kind===`months`?l.months:1):0,g=Math.min(m,Math.max(0,Math.round(h))),_=(a||[]).reduce((e,t)=>e+I(t.price),0),v=l.kind===`months`?_*l.months:_,y=Math.max(0,m-g),b=y+v,ee=o?Math.max(0,Math.round(I(s))):0,x=c===`full`,te=Bt(e,`1`)||Math.round(m/Math.max(1,p)),S=Math.max(0,Math.round(te-Gt(te,i)))+_;return{periode:l.key,periodLabel:l.label,unitLabel:l.unit,units:p,startDate:u,endDate:d,rate:f,base:m,discount:g,rentTotal:y,addonMonthly:_,addonTotal:v,grandTotal:b,deposit:ee,payOption:x?`full`:`partial`,payNow:ee+(x?b:0),rentPaidNow:x?b:0,remaining:x?0:b,monthlyCharge:S,promo:i?{id:i.id,name:i.name,type:i.type,value:I(i.value)}:null}}function qt({activeOnly:e=!1}={}){let t=T().promos||[];return e?t.filter(e=>e.active):t}function Jt(e){return e==null||e===``||e===`none`?null:T().promos.find(t=>String(t.id)===String(e)&&t.active)||null}function Yt({id:e=null,name:t,type:n,value:r,active:i=!0}){let a=String(t||``).trim();if(!a)throw Error(`Nama promo wajib diisi.`);if(![`rupiah`,`persen`].includes(n))throw Error(`Tipe diskon tidak valid.`);let o=I(r);if(o<=0)throw Error(`Nilai diskon harus lebih dari 0.`);if(n===`persen`&&o>100)throw Error(`Diskon persen maksimal 100%.`);E(t=>{if(e){let r=t.promos.find(t=>String(t.id)===String(e));if(!r)throw Error(`Promo tidak ditemukan.`);Object.assign(r,{name:a,type:n,value:o,active:!!i})}else t.promos.push({id:D(t.promos),name:a,type:n,value:o,active:!!i})})}function Xt(e){E(t=>{t.promos=t.promos.filter(t=>String(t.id)!==String(e))})}function Zt(e){E(t=>{let n=t.promos.find(t=>String(t.id)===String(e));n&&(n.active=!n.active)})}function Qt(e,t){let n=Rt(e),r={...T().pricing[n]||{}};for(let e of s.map(e=>e.key)){let n=I(t?.[e]);if(n<=0)throw Error(`Semua tarif harus lebih dari 0.`);r[e]=n}E(e=>{e.pricing[n]=r})}function J(e,t){if(!e)throw Error(t)}function $t(){return T().rooms}function Y(e){return T().rooms.find(t=>String(t.id)===String(e))||null}function X(e){return T().tenants.find(t=>String(t.id)===String(e))||null}function en({activeOnly:e=!1}={}){let t=T().tenants;return(e?t.filter(e=>e.status===`aktif`):[...t]).sort((e,t)=>e.name.localeCompare(t.name,`id`))}function tn(e){if(!e)return null;if(e.roomId){let t=Y(e.roomId);if(t)return t}return null}function nn({nomor:e,lantai:t}){let n=String(e||``).trim(),r=String(t||``).trim();J(/^\d{2,4}$/.test(n),`Nomor kamar harus berupa 2–4 digit angka.`),J([`2`,`3`].includes(r),`Lantai tidak valid.`),J(!T().rooms.some(e=>e.nomor===n),`Kamar ${n} sudah ada.`),E(e=>{e.rooms.push({id:D(e.rooms),nomor:n,lantai:r,status:`kosong`,tenantId:null,booking:null})})}function rn(e){let t=Y(e);t&&(J(t.status===`kosong`&&!t.booking,`Hanya kamar kosong tanpa booking yang dapat dihapus.`),E(t=>{t.rooms=t.rooms.filter(t=>String(t.id)!==String(e))}))}function an(e){let t=String(e.name||``).trim(),n=String(e.phone||``).trim();return J(t.length>=2,`Nama penghuni wajib diisi.`),J(n.length>=8,`Nomor WhatsApp wajib diisi dengan benar.`),J(c.includes(String(e.periode)),`Skema periode tidak valid.`),{name:t,phone:n}}function on(e){return(e||[]).filter(e=>e&&e.name).map(e=>({id:e.id??null,name:String(e.name),price:Math.max(0,Math.round(I(e.price)))}))}function sn(e){return{promoId:e.promo?.id??null,promoName:e.promo?.name??``,promoType:e.promo?.type??``,promoValue:e.promo?.value??0}}function cn(e,t){return Kt({lantai:e.lantai,periode:t.periode,startDate:t.startDate,endDate:t.endDate,promo:t.promo||null,addons:t.addons||[],depositEnabled:!!t.depositEnabled,depositValue:t.depositValue,payOption:t.payOption===`full`?`full`:`partial`})}function ln(e,t){let n=Y(e);J(n,`Kamar tidak ditemukan.`),J(n.status!==`terisi`,`Kamar sedang dihuni. Gunakan perpanjangan atau pindah kamar.`);let r=an(t),i=on(t.addons),a=cn(n,{...t,addons:i});return E(n=>{let o=n.rooms.find(t=>String(t.id)===String(e));o.status=`booking`,o.tenantId=null,o.booking={name:r.name,phone:r.phone,job:String(t.job||``).trim(),notes:String(t.notes||``).trim(),emergencyContact:{name:String(t.emergencyContact?.name||``).trim(),relation:String(t.emergencyContact?.relation||``).trim(),phone:String(t.emergencyContact?.phone||``).trim()},periode:a.periode,startDate:a.startDate,endDate:a.endDate,addons:i,...sn(a),base:a.base,discount:a.discount,rentTotal:a.rentTotal,addonTotal:a.addonTotal,grandTotal:a.grandTotal,deposit:a.deposit,payOption:a.payOption,payNow:a.payNow,remaining:a.remaining,monthlyCharge:a.monthlyCharge,createdAt:o.booking?.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString()}}),Y(e)}function un(e){let t=Y(e);t&&(J(t.status===`booking`,`Kamar ini tidak memiliki booking aktif.`),E(t=>{let n=t.rooms.find(t=>String(t.id)===String(e));n.status=`kosong`,n.tenantId=null,n.booking=null}))}function dn(e,t,{amount:n,type:r,method:i=`Tunai / Cash`,note:a=``,billId:o=null,date:s}){let c=Math.max(0,Math.round(I(n)));c&&(e.payments=e.payments||[],e.payments.push({id:D(e.payments),date:s||R(),amount:c,type:r,method:i,note:a,billId:o}))}function fn(e,t,n,r,i){let a=new Date().toISOString(),o={id:D(e.tenants),name:n.name,phone:n.phone,job:n.job||``,notes:n.notes||``,emergencyContact:n.emergencyContact||{name:``,relation:``,phone:``},roomId:t.id,roomNumber:t.nomor,floor:t.lantai,periode:r.periode,startDate:r.startDate,endDate:r.endDate,addons:on(n.addons),...sn(r),base:r.base,discount:r.discount,rentTotal:r.rentTotal,addonTotal:r.addonTotal,contractTotal:r.grandTotal,monthlyCharge:r.monthlyCharge,deposit:r.deposit,depositPaid:r.deposit,totalPaid:Math.max(0,Math.round(I(i))),status:`aktif`,checkinDate:r.startDate,checkoutDate:null,stayHistory:[{roomId:t.id,roomNumber:t.nomor,floor:t.lantai,from:r.startDate,to:null}],payments:[],createdAt:a,updatedAt:a};e.tenants.push(o);let s=o.totalPaid>=r.grandTotal-.5,c=r.grandTotal>0?Et(e,{tenantId:o.id,roomId:t.id,type:`Sewa`,description:`${r.periodLabel} • ${r.startDate} s/d ${r.endDate}`,amount:r.grandTotal,paid:s,dueDate:r.startDate,periodStart:r.startDate,periodEnd:r.endDate,source:`rent`}):null;return r.deposit>0&&dn(o,e,{amount:r.deposit,type:`Deposit`,note:`Deposit check-in`,date:r.startDate}),o.totalPaid>0&&dn(o,e,{amount:o.totalPaid,type:`Sewa`,note:`Pembayaran check-in`,billId:c?.id??null,date:r.startDate}),t.status=`terisi`,t.tenantId=o.id,t.booking=null,o}function pn(e,t){let n=Y(e);J(n,`Kamar tidak ditemukan.`),J(n.status===`kosong`,`Kamar ini tidak kosong. Muat ulang data.`);let r=an(t),i=on(t.addons),a=cn(n,{...t,addons:i}),o=a.payOption===`full`?a.grandTotal:0,s;return E(n=>{s=fn(n,n.rooms.find(t=>String(t.id)===String(e)),{...r,job:t.job,notes:t.notes,emergencyContact:t.emergencyContact,addons:i},a,o)}),s}function mn(e,{settle:t=!0}={}){let n=Y(e);J(n?.booking,`Booking tidak ditemukan.`);let r=n.booking,i={periode:r.periode,startDate:r.startDate,endDate:r.endDate,periodLabel:r.periode===`harian`?`Harian`:r.periode===`mingguan`?`Mingguan`:`${r.periode} Bulan`,base:r.base,discount:r.discount,rentTotal:r.rentTotal,addonTotal:r.addonTotal,grandTotal:r.grandTotal,deposit:r.deposit,monthlyCharge:r.monthlyCharge,promo:r.promoId?{id:r.promoId,name:r.promoName,type:r.promoType,value:r.promoValue}:null},a=r.payOption===`full`?r.grandTotal:0,o=t?i.grandTotal:a,s;return E(t=>{s=fn(t,t.rooms.find(t=>String(t.id)===String(e)),{name:r.name,phone:r.phone,job:r.job,notes:r.notes,emergencyContact:r.emergencyContact,addons:r.addons},i,o)}),s}function hn(e,t){let n=X(e);J(n,`Penghuni tidak ditemukan.`),J(n.status===`aktif`,`Penghuni sudah tidak aktif.`);let r=tn(n);J(r,`Kamar penghuni tidak ditemukan.`);let i=t.startDate||B(n.endDate,1);J(i>=n.endDate,`Tanggal mulai perpanjangan tidak boleh sebelum akhir kontrak berjalan.`);let a=on(t.addons??n.addons),o=cn(r,{...t,startDate:i,addons:a}),s=o.payOption===`full`?o.grandTotal:0;return E(t=>{let n=t.tenants.find(t=>String(t.id)===String(e));n.periode=o.periode,n.endDate=o.endDate,n.startDate=n.startDate||o.startDate,n.addons=a,Object.assign(n,sn(o)),n.base=o.base,n.discount=o.discount,n.rentTotal=I(n.rentTotal)+o.rentTotal,n.addonTotal=I(n.addonTotal)+o.addonTotal,n.contractTotal=I(n.contractTotal)+o.grandTotal,n.monthlyCharge=o.monthlyCharge,n.totalPaid=I(n.totalPaid)+s,n.updatedAt=new Date().toISOString();let i=o.grandTotal>0?Et(t,{tenantId:n.id,roomId:r.id,type:`Perpanjangan`,description:`${o.periodLabel} • ${o.startDate} s/d ${o.endDate}`,amount:o.grandTotal,paid:s>=o.grandTotal,dueDate:o.startDate,periodStart:o.startDate,periodEnd:o.endDate,source:`rent`}):null;s>0&&dn(n,t,{amount:s,type:`Perpanjangan`,note:`Pembayaran perpanjangan`,billId:i?.id??null,date:o.startDate})}),X(e)}function gn(e,t,n=R()){let r=X(e);J(r,`Penghuni tidak ditemukan.`),J(r.status===`aktif`,`Penghuni sudah tidak aktif.`);let i=tn(r),a=Y(t);return J(a,`Kamar tujuan tidak ditemukan.`),J(a.status===`kosong`,`Kamar tujuan tidak kosong.`),J(!i||i.id!==a.id,`Kamar tujuan sama dengan kamar saat ini.`),E(t=>{let r=t.tenants.find(t=>String(t.id)===String(e));if(i){let e=t.rooms.find(e=>String(e.id)===String(i.id));e&&(e.status=`kosong`,e.tenantId=null,e.booking=null)}let o=t.rooms.find(e=>String(e.id)===String(a.id));o.status=`terisi`,o.tenantId=r.id,o.booking=null,r.roomId=o.id,r.roomNumber=o.nomor,r.floor=o.lantai,r.updatedAt=new Date().toISOString();let s=r.stayHistory||[],c=[...s].reverse().find(e=>!e.to);c&&(c.to=n),s.push({roomId:o.id,roomNumber:o.nomor,floor:o.lantai,from:n,to:null}),r.stayHistory=s}),X(e)}function _n(e,t=R()){let n=X(e);J(n,`Penghuni tidak ditemukan.`),J(n.status===`aktif`,`Penghuni sudah tidak aktif.`);let r=tn(n);return E(n=>{let i=n.tenants.find(t=>String(t.id)===String(e));if(r){let e=n.rooms.find(e=>String(e.id)===String(r.id));e&&(e.status=`kosong`,e.tenantId=null,e.booking=null)}i.status=`checkout`,i.checkoutDate=t,i.roomId=null,i.updatedAt=new Date().toISOString();let a=[...i.stayHistory||[]].reverse().find(e=>!e.to);a&&(a.to=t)}),X(e)}function vn(e,t){let n=X(e);J(n,`Penghuni tidak ditemukan.`);let r=String(t.name??n.name).trim();return J(r.length>=2,`Nama penghuni wajib diisi.`),E(n=>{let i=n.tenants.find(t=>String(t.id)===String(e));i.name=r,t.phone!==void 0&&(i.phone=String(t.phone).trim()),t.job!==void 0&&(i.job=String(t.job).trim()),t.notes!==void 0&&(i.notes=String(t.notes).trim()),t.emergencyContact!==void 0&&(i.emergencyContact={name:String(t.emergencyContact.name||``).trim(),relation:String(t.emergencyContact.relation||``).trim(),phone:String(t.emergencyContact.phone||``).trim()}),i.updatedAt=new Date().toISOString()}),X(e)}function yn(e){let t=X(e);J(t,`Penghuni tidak ditemukan.`),J(t.status===`checkout`,`Checkout penghuni terlebih dahulu sebelum menghapus data.`),E(t=>{t.tenants=t.tenants.filter(t=>String(t.id)!==String(e)),t.bills.forEach(t=>{String(t.tenantId)===String(e)&&(t.tenantId=null)}),t.manualInvoices.forEach(t=>{String(t.tenantId)===String(e)&&(t.tenantId=null)})})}function bn(e){let t=T();return t.bills.filter(t=>String(t.tenantId)===String(e)&&t.status===`unpaid`).reduce((e,t)=>e+I(t.amount-t.paid),0)+t.manualInvoices.filter(t=>String(t.tenantId)===String(e)&&t.status===`unpaid`).reduce((e,t)=>e+I(t.amount-t.paid),0)}var xn=e=>e===`harian`||e===`mingguan`;function Sn(e){let t=qt({activeOnly:!0});return[`<option value="none" ${!e||e===`none`?`selected`:``}>Tanpa promo / diskon</option>`,...t.map(t=>{let n=t.type===`persen`?`${t.value}%`:L(t.value);return`<option value="${t.id}" ${String(t.id)===String(e)?`selected`:``}>${O(t.name)} — ${n}</option>`})].join(``)}function Cn(){return[`<option value="">— Pilih layanan add-on —</option>`,...bt({activeOnly:!0}).map(e=>`<option value="${e.id}">${O(e.name)} — ${L(e.price)}/bln</option>`)].join(``)}function wn(e){return e.length?e.map((e,t)=>`
      <div class="flex items-center justify-between gap-2 bg-white border border-amber-200 rounded-xl px-3 py-2">
        <div class="min-w-0">
          <p class="text-[11px] font-bold text-stone-700 truncate">${O(e.name)}</p>
          <p class="text-[10px] text-stone-500">${L(e.price)} / bulan</p>
        </div>
        <button type="button" class="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50" data-remove-addon="${t}" aria-label="Hapus ${O(e.name)}">
          ${j(`X`,`w-3.5 h-3.5`)}
        </button>
      </div>`).join(``):`<p class="text-[11px] text-stone-400 italic">Belum ada add-on dipilih.</p>`}function Tn(e,t){let n=t===`extend`?`Total perpanjangan`:`Total tagihan sewa`;return[`<div class="flex justify-between gap-3"><span class="text-stone-500">Sewa (${e.units} ${e.unitLabel})</span><span class="font-bold">${L(e.base)}</span></div>`,e.discount>0?`<div class="flex justify-between gap-3 text-rose-700"><span>Diskon${e.promo?` (${O(e.promo.name)})`:``}</span><span class="font-bold">−${L(e.discount)}</span></div>`:``,e.addonTotal>0?`<div class="flex justify-between gap-3 text-amber-800"><span>Add-on</span><span class="font-bold">${L(e.addonTotal)}</span></div>`:``,`<div class="flex justify-between gap-3 pt-2 border-t border-line"><span class="font-bold text-stone-700">${n}</span><span class="font-extrabold text-stone-800">${L(e.grandTotal)}</span></div>`,e.deposit>0?`<div class="flex justify-between gap-3"><span class="text-stone-500">Deposit (jaminan)</span><span class="font-bold">${L(e.deposit)}</span></div>`:``,`<div class="flex justify-between gap-3 text-emerald-700"><span class="font-bold">Dibayar sekarang</span><span class="font-extrabold">${L(e.payNow)}</span></div>`,`<div class="flex justify-between gap-3 ${e.remaining>0?`text-rose-700`:`text-stone-500`}"><span class="font-semibold">Sisa tagihan</span><span class="font-extrabold">${L(e.remaining)}</span></div>`,`<div class="text-[10px] text-stone-400 pt-1">Periode: ${H(e.startDate)} — ${H(e.endDate)}</div>`].filter(Boolean).join(``)}function En(e){return`
    <div class="flex items-start gap-2 text-rose-700">
      ${j(`CircleAlert`,`w-4 h-4 shrink-0 mt-0.5`)}
      <span class="font-semibold">${O(e)}</span>
    </div>
  `}var Dn={booking:{title:`Booking Kamar`,submit:`Simpan Booking`,iconName:`CalendarClock`},checkin:{title:`Check-in Kamar`,submit:`Proses Check-in`,iconName:`LogIn`},edit_booking:{title:`Edit Booking`,submit:`Simpan Perubahan`,iconName:`Pencil`},extend:{title:`Perpanjang Kontrak`,submit:`Simpan Perpanjangan`,iconName:`Repeat`}};function On(e,t=`booking`,n=null){let r=Y(e);if(!r){F(`Kamar tidak ditemukan.`,`error`);return}let i=n?X(n):null,a=r.booking,o=Dn[t]||Dn.booking,c=t===`extend`;if(c&&!i){F(`Data penghuni tidak ditemukan.`,`error`);return}if(t===`checkin`&&r.status!==`kosong`){F(`Kamar tidak kosong. Muat ulang halaman.`,`error`);return}let l=c?B(i.endDate,1):a?.startDate||R(),u=c?i.periode||`1`:a?.periode||`1`,d=c?`-`:a?.endDate||(xn(u)?B(l,u===`harian`?1:7):`-`),f=c?i.promoId||`none`:a?.promoId||`none`,p=(c?i.addons:a?.addons)||[],m=c?0:a?.deposit??Vt(),h=c?`full`:a?.payOption||(t===`checkin`?`full`:`partial`),g=c?!1:!a||a.deposit>0,_=`
    <form id="bm-form" class="space-y-5" novalidate>
      ${c?`
      <div class="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-4">
        <div class="flex items-start gap-3">
          <span class="w-10 h-10 rounded-xl bg-white text-indigo-700 flex items-center justify-center shrink-0">${j(`UserCheck`,`w-5 h-5`)}</span>
          <div class="text-xs">
            <p class="font-extrabold text-stone-800 text-sm">${O(i.name)} — Kamar ${O(i.roomNumber||r.nomor)}</p>
            <p class="text-stone-600 mt-0.5">Kontrak berjalan: ${H(i.startDate)} — <b>${H(i.endDate)}</b></p>
            <p class="text-stone-500 mt-0.5">Perpanjangan dimulai otomatis sehari setelah kontrak berakhir.</p>
          </div>
        </div>
      </div>
    `:`
      <div class="grid sm:grid-cols-2 gap-3">
        <div>
          <label class="label" for="bm-name">Nama penghuni <span class="text-rose-500">*</span></label>
          <input id="bm-name" type="text" class="input" placeholder="Nama lengkap" value="${O(a?.name||``)}" required />
        </div>
        <div>
          <label class="label" for="bm-phone">No. WhatsApp <span class="text-rose-500">*</span></label>
          <input id="bm-phone" type="tel" class="input" placeholder="cth: 08123456789" value="${O(a?.phone||``)}" required />
        </div>
        <div class="sm:col-span-2">
          <label class="label" for="bm-job">Pekerjaan / Instansi</label>
          <input id="bm-job" type="text" class="input" placeholder="Mahasiswa / Karyawan" value="${O(a?.job||``)}" />
        </div>
      </div>
    `}

      <div class="grid sm:grid-cols-3 gap-3">
        <div>
          <label class="label" for="bm-periode">Skema periode</label>
          <select id="bm-periode" class="select">
            ${s.map(e=>`<option value="${e.key}" ${e.key===u?`selected`:``}>${e.label}</option>`).join(``)}
          </select>
        </div>
        <div>
          <label class="label" for="bm-start">Tanggal mulai</label>
          <input id="bm-start" type="date" class="input" value="${l}" />
        </div>
        <div id="bm-end-wrap" class="${xn(u)?``:`hidden`}">
          <label class="label" for="bm-end">Tanggal selesai</label>
          <input id="bm-end" type="date" class="input" value="${xn(u)?d:``}" />
        </div>
      </div>

      <div>
        <label class="label" for="bm-promo">Promo / diskon</label>
        <select id="bm-promo" class="select">${Sn(f)}</select>
      </div>

      ${c?``:`
          <div class="rounded-2xl border border-line bg-stone-50/60 p-4 space-y-3">
            <p class="text-[11px] font-extrabold uppercase tracking-wider text-stone-500">Kontak darurat</p>
            <div class="grid sm:grid-cols-3 gap-2">
              <input id="bm-ec-name" type="text" class="input input-sm" placeholder="Nama kontak" value="${O(a?.emergencyContact?.name||``)}" />
              <input id="bm-ec-relation" type="text" class="input input-sm" placeholder="Hubungan" value="${O(a?.emergencyContact?.relation||``)}" />
              <input id="bm-ec-phone" type="tel" class="input input-sm" placeholder="No. telepon" value="${O(a?.emergencyContact?.phone||``)}" />
            </div>
          </div>
        `}

      <div class="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 space-y-3">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-extrabold uppercase tracking-wider text-amber-900">Layanan add-on</p>
          <span class="badge-gold">Opsional</span>
        </div>
        <div class="flex gap-2">
          <select id="bm-addon-select" class="select input-sm flex-1">${Cn()}</select>
          <button type="button" class="btn-primary btn-sm shrink-0" data-add-addon>${j(`Plus`,`w-4 h-4`)} Tambah</button>
        </div>
        <div id="bm-addon-list" class="space-y-2">${wn(p)}</div>
      </div>

      <div class="grid sm:grid-cols-2 gap-4">
        ${c?``:`
            <div class="rounded-2xl border border-line bg-white p-4 space-y-2">
              <label class="flex items-center gap-2 cursor-pointer">
                <input id="bm-deposit-enabled" type="checkbox" class="w-4 h-4 accent-brand" ${g?`checked`:``} />
                <span class="text-xs font-bold text-stone-800">Kenakan deposit</span>
              </label>
              <div id="bm-deposit-wrap" class="${g?``:`hidden`}">
                <input id="bm-deposit" type="number" min="0" step="1000" class="input input-sm" placeholder="Nominal deposit" value="${I(m)||``}" />
              </div>
              <p class="hint">Deposit adalah jaminan, tidak dihitung sebagai pendapatan sewa.</p>
            </div>
          `}
        <div class="rounded-2xl border border-line bg-white p-4 space-y-2">
          <p class="text-xs font-bold text-stone-800">Opsi pembayaran</p>
          <label class="flex items-center gap-2 cursor-pointer p-2 rounded-xl border border-line hover:bg-stone-50">
            <input type="radio" name="bm-pay-option" value="partial" class="accent-brand" ${h===`partial`?`checked`:``} />
            <span class="text-xs font-semibold">${c?`Catat sebagai tagihan`:`Deposit saja (DP)`}</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer p-2 rounded-xl border border-line hover:bg-stone-50">
            <input type="radio" name="bm-pay-option" value="full" class="accent-brand" ${h===`full`?`checked`:``} />
            <span class="text-xs font-semibold">${c?`Lunas sekarang`:`Deposit + sewa (lunas)`}</span>
          </label>
        </div>
      </div>

      ${c?``:`
          <div>
            <label class="label" for="bm-notes">Catatan khusus / permintaan penghuni</label>
            <textarea id="bm-notes" rows="2" class="input" placeholder="cth: minta kamar dekat jendela">${O(a?.notes||``)}</textarea>
          </div>
        `}

      <div id="bm-summary" class="rounded-2xl border border-line bg-cream/70 p-4 text-xs space-y-2"></div>
    </form>
  `;N({title:`${o.title} — Kamar ${r.nomor}`,subtitle:c?`Perpanjang masa sewa penghuni aktif.`:`Lengkapi data untuk menghitung total otomatis.`,size:`xl`,body:_,footer:`
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      <button type="submit" form="bm-form" class="btn-primary btn-sm" data-submit>
        ${j(o.iconName,`w-4 h-4`)} ${o.submit}
      </button>
    `,onMount(e,n){let a=e.querySelector(`#bm-form`),o=e.querySelector(`#bm-summary`),s=e.querySelector(`#bm-addon-list`),c=e.querySelector(`#bm-periode`),l=e.querySelector(`#bm-start`),u=e.querySelector(`#bm-end`),d=e.querySelector(`#bm-end-wrap`),f=e.querySelector(`#bm-deposit-enabled`),m=e.querySelector(`#bm-deposit-wrap`),h=e.querySelector(`#bm-promo`),g=p.map(e=>({id:e.id??null,name:e.name,price:I(e.price)})),_=t=>e.querySelector(t)?.value.trim()??``,v=()=>e.querySelector(`input[name="bm-pay-option"]:checked`)?.value||`partial`,y=()=>Jt(h.value);function b(){let e=xn(c.value);if(d.classList.toggle(`hidden`,!e),e){let e=c.value===`harian`?1:7,t=l.value||R();(!u.value||u.value<=t)&&(u.value=B(t,e))}}function ee(){try{return Kt({lantai:r.lantai,periode:c.value,startDate:l.value,endDate:u.value||void 0,promo:y(),addons:g,depositEnabled:!!f?.checked,depositValue:I(_(`#bm-deposit`)),payOption:v()})}catch(e){return{error:e.message}}}function x(){let e=ee();return e.error?(o.innerHTML=En(e.error),null):(o.innerHTML=Tn(e,t),e)}function te(){s.innerHTML=wn(g),x()}a.addEventListener(`input`,e=>{e.target!==f&&x()}),a.addEventListener(`change`,e=>{e.target===c&&b(),e.target===f&&m.classList.toggle(`hidden`,!f.checked),x()}),l.addEventListener(`change`,()=>{if(xn(c.value)){let e=c.value===`harian`?1:7;(!u.value||u.value<=l.value)&&(u.value=B(l.value,e))}x()}),e.querySelector(`[data-add-addon]`)?.addEventListener(`click`,()=>{let t=e.querySelector(`#bm-addon-select`),n=bt().find(e=>String(e.id)===String(t.value));n?g.some(e=>String(e.id)===String(n.id))?F(`Add-on ini sudah ditambahkan.`,`warning`):(g.push({id:n.id,name:n.name,price:n.price}),t.value=``,te()):F(`Pilih layanan add-on terlebih dahulu.`,`warning`)}),s.addEventListener(`click`,e=>{let t=e.target.closest(`[data-remove-addon]`);t&&(g.splice(Number(t.dataset.removeAddon),1),te())}),b(),x(),a.addEventListener(`submit`,e=>{if(e.preventDefault(),!x())return;let a={name:_(`#bm-name`),phone:_(`#bm-phone`),job:_(`#bm-job`),periode:c.value,startDate:l.value,endDate:u.value||void 0,promo:y(),addons:g,depositEnabled:!!f?.checked,depositValue:I(_(`#bm-deposit`)),payOption:v(),notes:_(`#bm-notes`),emergencyContact:{name:_(`#bm-ec-name`),relation:_(`#bm-ec-relation`),phone:_(`#bm-ec-phone`)}};try{t===`booking`||t===`edit_booking`?(ln(r.id,a),F(`Booking kamar ${r.nomor} berhasil disimpan.`)):t===`checkin`?(pn(r.id,a),F(`${a.name} berhasil check-in di kamar ${r.nomor}.`)):t===`extend`&&(hn(i.id,a),F(`Kontrak ${i.name} berhasil diperpanjang.`)),n()}catch(e){F(e.message,`error`)}})}})}function kn(e){let t=Y(e),n=t?.booking;if(!t||!n){F(`Booking tidak ditemukan.`,`error`);return}let r=n.payOption===`full`?n.grandTotal:0,i=Math.max(0,I(n.grandTotal)-r);N({title:`Check-in ${n.name}`,subtitle:`Kamar ${t.nomor} • ${H(n.startDate)}`,size:`md`,body:`
      <div class="space-y-4">
        <div class="rounded-2xl border border-line bg-cream/60 p-4 text-xs space-y-2">
          <div class="flex justify-between"><span class="text-stone-500">Nama</span><b class="text-stone-800">${O(n.name)}</b></div>
          <div class="flex justify-between"><span class="text-stone-500">WhatsApp</span><b class="text-stone-800">${O(n.phone)}</b></div>
          <div class="flex justify-between"><span class="text-stone-500">Periode</span><b class="text-stone-800">${H(n.startDate)} — ${H(n.endDate)}</b></div>
          <div class="flex justify-between"><span class="text-stone-500">Total sewa</span><b class="text-stone-800">${L(n.grandTotal)}</b></div>
          <div class="flex justify-between"><span class="text-stone-500">Deposit</span><b class="text-stone-800">${L(n.deposit)}</b></div>
          <div class="flex justify-between pt-2 border-t border-line"><span class="text-stone-500">Sisa sewa</span><b class="${i>0?`text-rose-700`:`text-emerald-700`}">${L(i)}</b></div>
        </div>
        ${i>0?`<div class="rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900 flex items-start gap-2">
                ${j(`AlertTriangle`,`w-4 h-4 shrink-0 mt-0.5`)}
                <span>Booking ini baru membayar deposit. Pilih <b>Tandai lunas</b> jika sisa sewa sudah diterima, atau <b>Check-in & tagih sisa</b> untuk mencatat tagihan.</span>
              </div>`:`<div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800 flex items-start gap-2">
                ${j(`CheckCircle2`,`w-4 h-4 shrink-0 mt-0.5`)}
                <span>Sewa sudah lunas. Penghuni siap check-in.</span>
              </div>`}
      </div>
    `,footer:`
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      ${i>0?`<button type="button" class="btn-outline btn-sm" data-checkin-unpaid>Check-in & tagih sisa</button>`:``}
      <button type="button" class="btn-primary btn-sm" data-checkin-settle>${j(`Check`,`w-4 h-4`)} ${i>0?`Tandai lunas & check-in`:`Check-in sekarang`}</button>
    `,onMount(e,r){let i=e=>{try{mn(t.id,{settle:e}),F(`${n.name} berhasil check-in di kamar ${t.nomor}.`),r()}catch(e){F(e.message,`error`)}};e.querySelector(`[data-checkin-settle]`)?.addEventListener(`click`,()=>i(!0)),e.querySelector(`[data-checkin-unpaid]`)?.addEventListener(`click`,()=>i(!1))}})}function An(e){let t=X(e);if(!t)return;let n=bn(e);N({title:`Check-out ${t.name}`,subtitle:`Kamar ${t.roomNumber||`—`} akan dikosongkan.`,size:`md`,body:`
      <div class="space-y-4">
        <div>
          <label class="label" for="co-date">Tanggal check-out</label>
          <input id="co-date" type="date" class="input" value="${R()}" />
        </div>
        ${n>0?`<div class="rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800 flex items-start gap-2">
                ${j(`AlertTriangle`,`w-4 h-4 shrink-0 mt-0.5`)}
                <span>Masih ada tunggakan <b>${L(n)}</b>. Check-out tetap dapat diproses, tagihan akan tetap tercatat.</span>
              </div>`:`<div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800 flex items-start gap-2">
                ${j(`CheckCircle2`,`w-4 h-4 shrink-0 mt-0.5`)}
                <span>Tidak ada tunggakan. Kamar siap dikosongkan.</span>
              </div>`}
        <p class="hint">Riwayat hunian dan pembayaran tetap tersimpan pada profil penghuni.</p>
      </div>
    `,footer:`
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      <button type="button" class="btn-danger btn-sm" data-checkout>${j(`DoorOpen`,`w-4 h-4`)} Proses check-out</button>
    `,onMount(e,n){e.querySelector(`[data-checkout]`)?.addEventListener(`click`,()=>{let r=e.querySelector(`#co-date`).value||R();try{_n(t.id,r),F(`${t.name} berhasil check-out.`),n()}catch(e){F(e.message,`error`)}})}})}function jn(e){let t=X(e);if(!t)return;let n=$t().filter(e=>e.status===`kosong`&&e.id!==t.roomId).sort((e,t)=>e.nomor.localeCompare(t.nomor,void 0,{numeric:!0}));N({title:`Pindah Kamar`,subtitle:`${t.name} • saat ini di kamar ${t.roomNumber||`—`}`,size:`md`,body:`
      <div class="space-y-4">
        ${n.length?`
            <div>
              <label class="label" for="mv-room">Kamar tujuan</label>
              <select id="mv-room" class="select">
                ${n.map(e=>`<option value="${e.id}">Kamar ${e.nomor} — Lantai ${e.lantai}</option>`).join(``)}
              </select>
            </div>
            <div>
              <label class="label" for="mv-date">Tanggal efektif pindah</label>
              <input id="mv-date" type="date" class="input" value="${R()}" />
            </div>
            <p class="hint">Riwayat kamar akan diperbarui otomatis.</p>
          `:`<div class="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">Tidak ada kamar kosong yang tersedia saat ini.</div>`}
      </div>
    `,footer:`
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      ${n.length?`<button type="button" class="btn-primary btn-sm" data-move>${j(`Repeat`,`w-4 h-4`)} Proses pindah</button>`:``}
    `,onMount(e,n){e.querySelector(`[data-move]`)?.addEventListener(`click`,()=>{let r=e.querySelector(`#mv-room`).value,i=e.querySelector(`#mv-date`).value||R();try{let e=gn(t.id,r,i);F(`${t.name} dipindahkan ke kamar ${e.roomNumber}.`),n()}catch(e){F(e.message,`error`)}})}})}function Mn(e){let t=X(e);if(!t){F(`Penghuni tidak ditemukan.`,`error`);return}let n=t.roomId;n?On(n,`extend`,t.id):F(`Penghuni tidak memiliki kamar aktif.`,`error`)}function Nn({kind:e=`bill`,id:t}){let n=T(),r=e===`invoice`?n.manualInvoices.find(e=>String(e.id)===String(t)):n.bills.find(e=>String(e.id)===String(t));if(!r){F(`Data tagihan tidak ditemukan.`,`error`);return}let i=r.status===`paid`;N({title:e===`invoice`?`Verifikasi Invoice Layanan`:`Verifikasi Pembayaran Sewa`,subtitle:`${r.tenantName||`—`} • Kamar ${r.roomNumber||`—`}`,size:`md`,body:`
      <div class="space-y-4">
        <div class="rounded-2xl border border-line bg-cream/60 p-4 text-xs space-y-2">
          <div class="flex justify-between gap-3"><span class="text-stone-500">Nomor</span><b class="text-stone-800 font-mono text-[11px]">${O(r.number||`—`)}</b></div>
          <div class="flex justify-between gap-3"><span class="text-stone-500">Jenis</span><b class="text-stone-800">${O(r.type||r.item||`—`)}</b></div>
          <div class="flex justify-between gap-3"><span class="text-stone-500">Jatuh tempo</span><b class="text-stone-800">${O(r.dueDate||`—`)}</b></div>
          <div class="flex justify-between gap-3 pt-2 border-t border-line"><span class="text-stone-500">Nominal</span><b class="text-stone-800 text-base">${L(r.amount)}</b></div>
        </div>

        ${i?`<div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800 flex items-start gap-2">
                ${j(`CheckCircle2`,`w-4 h-4 shrink-0 mt-0.5`)}
                <span>Pembayaran sudah diverifikasi${r.method?` via <b>${O(r.method)}</b>`:``}.</span>
              </div>`:``}

        <div>
          <label class="label" for="vf-method">Metode pembayaran</label>
          <select id="vf-method" class="select" ${i?`disabled`:``}>
            ${l.map(e=>`<option value="${e}" ${r.method===e?`selected`:``}>${e}</option>`).join(``)}
          </select>
        </div>
        <div>
          <label class="label" for="vf-note">Catatan pengirim / referensi</label>
          <input id="vf-note" type="text" class="input" placeholder="cth: transfer a.n. Budi / no. referensi" value="${O(r.note||``)}" ${i?`disabled`:``} />
        </div>
      </div>
    `,footer:`
      <button type="button" class="btn-outline btn-sm" data-modal-close>${i?`Tutup`:`Batal`}</button>
      ${i?``:`<button type="button" class="btn-primary btn-sm" data-confirm>${j(`ShieldCheck`,`w-4 h-4`)} Verifikasi & Tandai Lunas</button>`}
    `,onMount(n,r){n.querySelector(`[data-confirm]`)?.addEventListener(`click`,()=>{let i=n.querySelector(`#vf-method`).value,a=n.querySelector(`#vf-note`).value.trim();try{e===`invoice`?Ft(t,{method:i,note:a}):At(t,{method:i,note:a}),F(`Pembayaran berhasil diverifikasi.`),r()}catch(e){F(e.message,`error`)}})}})}function Pn(){let e=en({activeOnly:!0});e.length?N({title:`Buat Tagihan Baru`,subtitle:`Tagihan tambahan di luar sewa utama.`,size:`md`,body:`
      <form id="bill-form" class="space-y-4" novalidate>
        <div>
          <label class="label" for="bl-tenant">Penghuni / kamar</label>
          <select id="bl-tenant" class="select">
            ${e.map(e=>`<option value="${e.id}">${O(e.name)} — Kamar ${O(e.roomNumber||`—`)}</option>`).join(``)}
          </select>
        </div>
        <div>
          <label class="label" for="bl-type">Jenis tagihan</label>
          <input id="bl-type" type="text" list="bill-type-list" class="input" placeholder="cth: Listrik bulan ini" value="Tagihan Tambahan" />
          <datalist id="bill-type-list">
            <option value="Tagihan Tambahan"></option>
            <option value="Listrik"></option>
            <option value="Air"></option>
            <option value="Kebersihan"></option>
            <option value="Denda Keterlambatan"></option>
            <option value="Kerusakan"></option>
          </datalist>
        </div>
        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label class="label" for="bl-amount">Nominal (Rp)</label>
            <input id="bl-amount" type="number" min="0" step="1000" class="input" placeholder="cth: 150000" />
          </div>
          <div>
            <label class="label" for="bl-due">Jatuh tempo</label>
            <input id="bl-due" type="date" class="input" value="${B(R(),7)}" />
          </div>
        </div>
        <div>
          <label class="label" for="bl-note">Catatan</label>
          <input id="bl-note" type="text" class="input" placeholder="Opsional" />
        </div>
      </form>
    `,footer:`
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      <button type="submit" form="bill-form" class="btn-primary btn-sm" data-submit>${j(`ReceiptText`,`w-4 h-4`)} Simpan tagihan</button>
    `,onMount(e,t){e.querySelector(`#bill-form`).addEventListener(`submit`,n=>{n.preventDefault();try{Dt({tenantId:e.querySelector(`#bl-tenant`).value,type:e.querySelector(`#bl-type`).value,amount:I(e.querySelector(`#bl-amount`).value),dueDate:e.querySelector(`#bl-due`).value||R(),note:e.querySelector(`#bl-note`).value.trim()}),F(`Tagihan baru berhasil dibuat.`),t()}catch(e){F(e.message,`error`)}})}}):F(`Belum ada penghuni aktif. Tambahkan penghuni terlebih dahulu.`,`warning`)}function Fn(e=``){let t=[...T().rooms].sort((e,t)=>e.nomor.localeCompare(t.nomor,void 0,{numeric:!0})),n=e=>{let t=(e.tenantId?T().tenants.find(t=>String(t.id)===String(e.tenantId)):null)?.name||e.booking?.name||``;return`Kamar ${e.nomor}${t?` — ${t}`:` — kosong`}`};N({title:`Buat Invoice Manual`,subtitle:`Untuk layanan non-sewa: laundry, perbaikan, fasilitas, dll.`,size:`md`,body:`
      <form id="invoice-form" class="space-y-4" novalidate>
        <div>
          <label class="label" for="iv-room">Kamar target</label>
          <select id="iv-room" class="select">
            ${t.map(t=>`<option value="${t.id}" ${String(t.id)===String(e)?`selected`:``}>${O(n(t))}</option>`).join(``)}
          </select>
        </div>
        <div>
          <label class="label" for="iv-item">Item layanan</label>
          <input id="iv-item" type="text" class="input" placeholder="cth: Laundry 5 Kg / Ganti kunci" />
        </div>
        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label class="label" for="iv-amount">Nominal (Rp)</label>
            <input id="iv-amount" type="number" min="0" step="1000" class="input" placeholder="cth: 50000" />
          </div>
          <div>
            <label class="label" for="iv-due">Jatuh tempo</label>
            <input id="iv-due" type="date" class="input" value="${B(R(),7)}" />
          </div>
        </div>
      </form>
    `,footer:`
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      <button type="submit" form="invoice-form" class="btn-primary btn-sm" data-submit>${j(`FilePlus2`,`w-4 h-4`)} Terbitkan invoice</button>
    `,onMount(e,t){e.querySelector(`#invoice-form`).addEventListener(`submit`,n=>{n.preventDefault();try{Pt({roomId:e.querySelector(`#iv-room`).value,item:e.querySelector(`#iv-item`).value,amount:I(e.querySelector(`#iv-amount`).value),dueDate:e.querySelector(`#iv-due`).value||R()}),F(`Invoice manual berhasil diterbitkan.`),t()}catch(e){F(e.message,`error`)}})}})}function In(e,t,n,r){return`
    <button type="button" class="${r?`bg-brand text-white`:`bg-stone-100 text-stone-600 hover:bg-stone-200`} px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5" data-tab="${e}">
      ${j(n,`w-3.5 h-3.5`)} ${t}
    </button>
  `}function Ln(e){let t=X(e);if(!t){F(`Penghuni tidak ditemukan.`,`error`);return}let n=T(),r=tn(t),i=n.bills.filter(e=>String(e.tenantId)===String(t.id)).sort((e,t)=>t.id-e.id),a=n.manualInvoices.filter(e=>String(e.tenantId)===String(t.id)).sort((e,t)=>t.id-e.id),o=bn(t.id),s=[...i.map(e=>({key:`bill-${e.id}`,label:e.description||e.type,date:e.paidAt||e.dueDate,amount:e.status===`paid`?e.paid:e.amount,status:e.status,note:e.status===`paid`?e.method:`Belum dibayar`})),...a.map(e=>({key:`invoice-${e.id}`,label:`${e.item} (${e.number})`,date:e.paidAt||e.dueDate,amount:e.status===`paid`?e.paid:e.amount,status:e.status,note:e.status===`paid`?e.method:`Belum dibayar`}))].sort((e,t)=>String(t.date).localeCompare(String(e.date)));I(t.depositPaid)>0&&s.unshift({key:`deposit`,label:`Deposit / jaminan`,date:t.checkinDate,amount:t.depositPaid,status:`paid`,note:`Deposit check-in`});let c=s.filter(e=>e.status===`paid`).reduce((e,t)=>e+I(t.amount),0),l=s.filter(e=>e.status!==`paid`).reduce((e,t)=>e+I(t.amount),0),u=t.status===`aktif`,d=t.stayHistory||[],f=`
    <div class="space-y-5">
      <div class="rounded-2xl border border-line bg-cream/60 p-4">
        <div class="flex flex-wrap items-center gap-3">
          ${K(t.name,`w-12 h-12 text-sm`)}
          <div class="min-w-0 flex-1">
            <h3 class="font-black text-stone-800 text-lg leading-tight">${O(t.name)}</h3>
            <p class="text-xs text-stone-500 mt-0.5">
              ${u?`Kamar ${O(r?.nomor||t.roomNumber||`—`)} · ${O(t.periode||``)} ${t.periode===`harian`?`hari`:t.periode===`mingguan`?`minggu`:`bulan`}`:`Sudah check-out`}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <span class="${u?`badge-green`:`badge-gray`}">${u?`Aktif`:`Checkout`}</span>
            ${o>0?`<span class="badge-red">Tunggakan ${L(o)}</span>`:``}
          </div>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
          <div><p class="text-stone-400 font-bold uppercase text-[9px]">Mulai</p><p class="font-bold text-stone-700">${H(t.startDate)}</p></div>
          <div><p class="text-stone-400 font-bold uppercase text-[9px]">Berakhir</p><p class="font-bold text-stone-700">${H(t.endDate)}</p></div>
          <div><p class="text-stone-400 font-bold uppercase text-[9px]">Nilai kontrak</p><p class="font-bold text-stone-700">${L(t.contractTotal)}</p></div>
          <div><p class="text-stone-400 font-bold uppercase text-[9px]">Sisa tagihan</p><p class="font-bold ${o>0?`text-rose-700`:`text-emerald-700`}">${L(o)}</p></div>
        </div>
      </div>

      <div class="flex flex-wrap gap-2 border-b border-line pb-2">
        ${In(`biodata`,`Biodata`,`UserRound`,!0)}
        ${In(`stay`,`Riwayat Kamar`,`ScrollText`,!1)}
        ${In(`payment`,`Riwayat Pembayaran`,`Receipt`,!1)}
      </div>

      <div id="dt-biodata" class="space-y-4">
        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label class="label" for="td-name">Nama lengkap</label>
            <input id="td-name" type="text" class="input" value="${O(t.name)}" />
          </div>
          <div>
            <label class="label" for="td-phone">No. WhatsApp</label>
            <input id="td-phone" type="tel" class="input" value="${O(t.phone)}" />
          </div>
          <div class="sm:col-span-2">
            <label class="label" for="td-job">Pekerjaan / instansi</label>
            <input id="td-job" type="text" class="input" value="${O(t.job||``)}" />
          </div>
        </div>

        <div class="rounded-2xl border border-line bg-stone-50/60 p-4 space-y-3">
          <p class="text-[11px] font-extrabold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            ${j(`PhoneCall`,`w-3.5 h-3.5 text-rose-500`)} Kontak darurat
          </p>
          <div class="grid sm:grid-cols-3 gap-2">
            <div>
              <label class="label" for="td-ec-name">Nama</label>
              <input id="td-ec-name" type="text" class="input input-sm" value="${O(t.emergencyContact?.name||``)}" />
            </div>
            <div>
              <label class="label" for="td-ec-relation">Hubungan</label>
              <input id="td-ec-relation" type="text" class="input input-sm" value="${O(t.emergencyContact?.relation||``)}" />
            </div>
            <div>
              <label class="label" for="td-ec-phone">No. telepon</label>
              <input id="td-ec-phone" type="tel" class="input input-sm" value="${O(t.emergencyContact?.phone||``)}" />
            </div>
          </div>
        </div>

        <div>
          <label class="label" for="td-notes">Catatan admin</label>
          <textarea id="td-notes" rows="3" class="input bg-amber-50/40 border-amber-200" placeholder="Catatan khusus, permintaan, atau reminder">${O(t.notes||``)}</textarea>
        </div>
      </div>

      <div id="dt-stay" class="hidden">
        ${d.length?`<div class="overflow-x-auto">
                <table class="data-table">
                  <thead><tr><th>Kamar</th><th>Lantai</th><th>Mulai</th><th>Selesai</th></tr></thead>
                  <tbody>
                    ${d.map(e=>`
                        <tr>
                          <td class="font-bold text-stone-800">Kamar ${O(e.roomNumber)}</td>
                          <td>Lantai ${O(e.floor||`—`)}</td>
                          <td>${H(e.from)}</td>
                          <td>${e.to?H(e.to):`<span class="badge-green">Berjalan</span>`}</td>
                        </tr>`).join(``)}
                  </tbody>
                </table>
              </div>`:`<div class="rounded-2xl border border-line bg-stone-50 p-6 text-center text-sm text-stone-500">Belum ada riwayat kamar.</div>`}
      </div>

      <div id="dt-payment" class="hidden space-y-4">
        <div class="grid sm:grid-cols-3 gap-3">
          <div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-3">
            <p class="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Total dibayar</p>
            <p class="font-black text-emerald-900 text-lg">${L(c)}</p>
          </div>
          <div class="rounded-2xl border border-rose-200 bg-rose-50 p-3">
            <p class="text-[10px] font-bold uppercase tracking-wider text-rose-700">Belum dibayar</p>
            <p class="font-black text-rose-900 text-lg">${L(l)}</p>
          </div>
          <div class="rounded-2xl border border-line bg-white p-3">
            <p class="text-[10px] font-bold uppercase tracking-wider text-stone-400">Nilai kontrak</p>
            <p class="font-black text-stone-800 text-lg">${L(t.contractTotal)}</p>
          </div>
        </div>

        <div class="overflow-x-auto rounded-2xl border border-line">
          <table class="data-table">
            <thead><tr><th>Item</th><th>Tanggal</th><th>Nominal</th><th>Status</th></tr></thead>
            <tbody>
              ${s.length?s.map(e=>`
                        <tr>
                          <td class="font-semibold text-stone-700">${O(e.label)}<p class="text-[10px] text-stone-400">${O(e.note||``)}</p></td>
                          <td class="whitespace-nowrap">${Xe(e.date)}</td>
                          <td class="font-bold ${e.status===`paid`?`text-stone-800`:`text-rose-700`}">${L(e.amount)}</td>
                          <td>${ht(e.status)}</td>
                        </tr>`).join(``):`<tr><td colspan="4" class="text-center py-8 text-stone-400">Belum ada riwayat pembayaran.</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;N({title:`Detail Penghuni`,subtitle:`${t.name}${r?` • Kamar ${r.nomor}`:``}`,size:`xl`,body:f,footer:`
      <div class="w-full flex flex-wrap items-center justify-between gap-2">
        <div class="flex flex-wrap gap-2">
          ${u?`
            <button type="button" class="btn-outline btn-sm" data-action="extend">${j(`Repeat`,`w-4 h-4`)} Perpanjang</button>
            <button type="button" class="btn-outline btn-sm" data-action="move">${j(`ArrowRight`,`w-4 h-4`)} Pindah Kamar</button>
            <button type="button" class="btn-danger-soft btn-sm" data-action="checkout">${j(`DoorOpen`,`w-4 h-4`)} Check-out</button>
          `:`
            <button type="button" class="btn-danger-soft btn-sm" data-action="delete">${j(`Trash2`,`w-4 h-4`)} Hapus data</button>
          `}
        </div>
        <div class="flex flex-wrap gap-2">
          <button type="button" class="btn-outline btn-sm" data-modal-close>Tutup</button>
          <button type="button" class="btn-primary btn-sm" data-action="save">${j(`Check`,`w-4 h-4`)} Simpan perubahan</button>
        </div>
      </div>
    `,onMount(e,n){let r={biodata:e.querySelector(`#dt-biodata`),stay:e.querySelector(`#dt-stay`),payment:e.querySelector(`#dt-payment`)};e.querySelectorAll(`[data-tab]`).forEach(t=>{t.addEventListener(`click`,()=>{let n=t.dataset.tab;Object.entries(r).forEach(([e,t])=>t.classList.toggle(`hidden`,e!==n)),e.querySelectorAll(`[data-tab]`).forEach(e=>{e.className=`${e.dataset.tab===n?`bg-brand text-white`:`bg-stone-100 text-stone-600 hover:bg-stone-200`} px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5`})})}),e.querySelector(`[data-action="save"]`)?.addEventListener(`click`,()=>{try{vn(t.id,{name:e.querySelector(`#td-name`).value,phone:e.querySelector(`#td-phone`).value,job:e.querySelector(`#td-job`).value,notes:e.querySelector(`#td-notes`).value,emergencyContact:{name:e.querySelector(`#td-ec-name`).value,relation:e.querySelector(`#td-ec-relation`).value,phone:e.querySelector(`#td-ec-phone`).value}}),F(`Data penghuni berhasil diperbarui.`),n()}catch(e){F(e.message,`error`)}}),e.querySelector(`[data-action="extend"]`)?.addEventListener(`click`,()=>{n(),setTimeout(()=>Mn(t.id),0)}),e.querySelector(`[data-action="move"]`)?.addEventListener(`click`,()=>{n(),setTimeout(()=>jn(t.id),0)}),e.querySelector(`[data-action="checkout"]`)?.addEventListener(`click`,()=>{n(),setTimeout(()=>An(t.id),0)}),e.querySelector(`[data-action="delete"]`)?.addEventListener(`click`,async()=>{if(await P({title:`Hapus data penghuni?`,message:`Data <b>${O(t.name)}</b> akan dihapus permanen. Riwayat tagihan tetap tersimpan tanpa tautan ke profil ini.`,confirmText:`Ya, hapus`,danger:!0}))try{yn(t.id),F(`Data penghuni berhasil dihapus.`),n()}catch(e){F(e.message,`error`)}})}})}var Rn=n({render:()=>Wn});function zn(e){return e<0?`<span class="badge-red">Lewat ${Math.abs(e)} hari</span>`:e===0?`<span class="badge-red">Hari ini</span>`:`<span class="badge-amber">H-${e}</span>`}function Bn(e){return e.length?e.map(({room:e,booking:t})=>{let n=t.payOption===`full`;return`
        <tr>
          <td class="font-black text-stone-800 whitespace-nowrap">${O(e.nomor)}</td>
          <td>
            <button type="button" class="font-bold text-stone-800 hover:text-brand hover:underline text-left" data-action="tenant-booking" data-room="${e.id}">${O(t.name)}</button>
            <p class="text-[10px] text-stone-400">${O(t.phone)}</p>
          </td>
          <td class="whitespace-nowrap">${H(t.startDate)}</td>
          <td>${n?`<span class="badge-green">Lunas</span>`:`<span class="badge-amber">DP</span>`}</td>
          <td>
            <div class="flex items-center justify-end gap-1">
              <button type="button" class="btn-primary btn-xs" data-action="checkin" data-room="${e.id}">${j(`LogIn`,`w-3 h-3`)} Check-in</button>
              <button type="button" class="btn-outline btn-xs" data-action="edit-booking" data-room="${e.id}" title="Edit booking">${j(`Pencil`,`w-3 h-3`)}</button>
            </div>
          </td>
        </tr>`}).join(``):`<tr><td colspan="5">${G({iconName:`CalendarClock`,title:`Belum ada antrean booking`,description:`Booking baru akan muncul di sini untuk diproses check-in.`})}</td></tr>`}function Vn(e){return e.length?`<div class="divide-y divide-line-soft">
    ${e.map(({tenant:e,daysLeft:t})=>{let n=ft(`reminder`,{nama:e.name,kamar:e.roomNumber,nominal:L(e.monthlyCharge),jatuh_tempo:H(e.endDate)});return`
          <div class="px-5 py-3.5 flex flex-wrap items-center gap-3">
            ${K(e.name,`w-9 h-9 text-[10px]`)}
            <div class="min-w-0 flex-1">
              <button type="button" class="text-sm font-bold text-stone-800 hover:text-brand hover:underline text-left" data-action="detail" data-tenant="${e.id}">${O(e.name)}</button>
              <p class="text-[11px] text-stone-500">Kamar ${O(e.roomNumber||`—`)} · berakhir ${H(e.endDate)}</p>
            </div>
            <div class="flex items-center gap-2 ml-auto">
              ${zn(t)}
              <a href="${et(e.phone,n)}" target="_blank" rel="noopener" class="btn-ghost btn-xs text-emerald-700" title="Kirim pengingat WhatsApp">${j(`MessageCircle`,`w-4 h-4`)}</a>
              <button type="button" class="btn-outline btn-xs" data-action="extend" data-tenant="${e.id}">${j(`Repeat`,`w-3 h-3`)} Perpanjang</button>
            </div>
          </div>`}).join(``)}
  </div>`:G({iconName:`BadgeCheck`,title:`Semua kontrak aman`,description:`Tidak ada kontrak yang berakhir dalam 7 hari ke depan.`})}function Hn(e){let t=Math.max(1,...e.flatMap(e=>[e.income,e.expense])),n=e[e.length-1]||{income:0,expense:0,net:0};return`
    <div class="flex flex-wrap items-center justify-between gap-3 mb-5 text-xs">
      <div>
        <p class="text-[10px] font-bold uppercase tracking-wider text-stone-400">Kas masuk bulan ini</p>
        <p class="font-black text-emerald-700 text-base">${L(n.income)}</p>
      </div>
      <div>
        <p class="text-[10px] font-bold uppercase tracking-wider text-stone-400">Kas keluar</p>
        <p class="font-black text-rose-700 text-base">${L(n.expense)}</p>
      </div>
      <div>
        <p class="text-[10px] font-bold uppercase tracking-wider text-stone-400">Net</p>
        <p class="font-black text-stone-800 text-base">${L(n.net)}</p>
      </div>
    </div>
    <div class="flex items-end justify-between gap-2 h-40">
      ${e.map(e=>{let n=e.income?Math.max(3,e.income/t*100):0,r=e.expense?Math.max(3,e.expense/t*100):0;return`
            <div class="flex-1 min-w-0 flex flex-col items-center gap-1.5">
              <div class="w-full h-32 flex items-end justify-center gap-1">
                <div class="w-3 rounded-t-md bg-emerald-500/90 transition-all" style="height:${n}%" title="Masuk ${L(e.income)}"></div>
                <div class="w-3 rounded-t-md bg-rose-400/90 transition-all" style="height:${r}%" title="Keluar ${L(e.expense)}"></div>
              </div>
              <span class="text-[9px] font-bold uppercase tracking-wider text-stone-400">${O(e.label)}</span>
            </div>`}).join(``)}
    </div>
    <div class="flex items-center gap-4 mt-4 text-[10px] font-semibold text-stone-500">
      <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span> Kas masuk</span>
      <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-sm bg-rose-400"></span> Pengeluaran</span>
    </div>
  `}function Un(e){return e.length?e.map(e=>`
      <div>
        <div class="flex items-center justify-between text-xs mb-1.5">
          <span class="font-extrabold text-stone-700">Lantai ${O(e.floor)}</span>
          <span class="font-bold text-stone-500">${e.occupied}/${e.total} terisi · ${e.occupancy.toFixed(0)}%</span>
        </div>
        ${vt(e.occupancy,e.occupancy>=70?`bg-emerald-500`:e.occupancy>=40?`bg-amber-400`:`bg-rose-400`)}
        <div class="flex flex-wrap gap-1.5 mt-2">
          <span class="badge-green">${e.occupied} terisi</span>
          <span class="badge-amber">${e.vacant} kosong</span>
          ${e.booking?`<span class="badge-blue">${e.booking} booking</span>`:``}
        </div>
      </div>`).join(``):`<p class="text-sm text-stone-400">Belum ada data lantai.</p>`}function Wn(e){let t=nt(),n=lt(6),r=R();e.innerHTML=`
    <div data-view="dashboard" class="animate-in">
      ${U({eyebrow:`Enterprise Dashboard`,title:`Dashboard Casa Ramire ☕`,subtitle:`Monitor ${t.total} kamar, antrean check-in, dan kesehatan kas properti.`,actions:`
          <a href="#/rooms" class="btn-primary btn-sm">${j(`Building2`,`w-4 h-4`)} Kelola Kamar</a>
          <a href="#/billing" class="btn-outline btn-sm">${j(`ReceiptText`,`w-4 h-4`)} Verifikasi Kas</a>
        `})}

      <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        ${W({label:`Total Kamar`,value:t.total,iconName:`Building2`,hint:`2 lantai`})}
        ${W({label:`Terisi`,value:t.occupied,iconName:`UserCheck`,tone:`green`,hint:`${t.occupancy.toFixed(0)}% okupansi`})}
        ${W({label:`Kosong`,value:t.vacant,iconName:`DoorOpen`,tone:`amber`,hint:`Siap dipasarkan`})}
        ${W({label:`Booking`,value:t.booking,iconName:`CalendarClock`,tone:`indigo`,hint:`Menunggu check-in`})}
        ${W({label:`Okupansi`,value:`${t.occupancy.toFixed(1)}%`,iconName:`PieChart`,tone:`teal`,hint:`Okupansi saat ini`})}
        ${W({label:`Pendapatan Bulan Ini`,value:L(t.revenue),iconName:`Wallet`,tone:`brand`,hint:`Laba ${L(t.profit)}`})}
      </div>

      <div class="grid lg:grid-cols-2 gap-6 mb-6">
        <div class="card overflow-hidden">
          ${q({title:`Antrean Check-in`,description:`Booking yang menunggu diproses`,actions:`<span class="badge-blue">${t.checkins.length} booking</span>`})}
          <div class="table-wrap">
            <table class="data-table">
              <thead><tr><th>Kamar</th><th>Nama</th><th>Mulai</th><th>Status</th><th class="text-right">Aksi</th></tr></thead>
              <tbody>${Bn(t.checkins)}</tbody>
            </table>
          </div>
        </div>

        <div class="card overflow-hidden">
          ${q({title:`Kontrak Akan Berakhir`,description:`H-7 dan kontrak yang sudah lewat`,actions:`<span class="badge-red">${t.expiring.length} kontrak</span>`})}
          <div class="p-0">${Vn(t.expiring)}</div>
        </div>
      </div>

      <div class="grid lg:grid-cols-2 gap-6 mb-6">
        <div class="card overflow-hidden">
          ${q({title:`Arus Kas 6 Bulan`,description:`Kas masuk dari tagihan & invoice dibanding pengeluaran`})}
          <div class="p-5">${Hn(n)}</div>
        </div>
        <div class="card overflow-hidden">
          ${q({title:`Okupansi per Lantai`,description:`Distribusi kamar terisi, kosong, dan booking`})}
          <div class="p-5 space-y-5">${Un(t.floors)}</div>
        </div>
      </div>

      <div class="card overflow-hidden">
        ${q({title:`Tagihan Aktif`,description:`Menunggu verifikasi pembayaran · total ${L(t.unpaidBills.reduce((e,t)=>e+Number(t.amount||0),0))}`,actions:`<a href="#/billing" class="btn-outline btn-xs">Lihat semua</a>`})}
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Kamar</th><th>Penghuni</th><th>Jatuh Tempo</th><th>Nominal</th><th>Status</th><th class="text-right">Aksi</th></tr></thead>
            <tbody>
              ${t.unpaidBills.length?t.unpaidBills.map(e=>{let t=ft(`tagihan`,{nama:e.tenantName,kamar:e.roomNumber,nominal:L(e.amount),jatuh_tempo:H(e.dueDate)}),n=e.dueDate&&e.dueDate<r;return`
                          <tr>
                            <td class="font-black text-stone-800">${O(e.roomNumber||`—`)}</td>
                            <td>
                              <p class="font-semibold text-stone-700">${O(e.tenantName||`—`)}</p>
                              <p class="text-[10px] text-stone-400">${O(e.type||``)}</p>
                            </td>
                            <td class="${n?`text-rose-700 font-bold`:``} whitespace-nowrap">${H(e.dueDate)}</td>
                            <td class="font-black text-amber-700 whitespace-nowrap">${L(e.amount)}</td>
                            <td>${ht(e.status)}</td>
                            <td>
                              <div class="flex items-center justify-end gap-1">
                                <button type="button" class="btn-primary btn-xs" data-action="verify" data-id="${e.id}">${j(`ShieldCheck`,`w-3 h-3`)} Verifikasi</button>
                                ${e.phone?`<a href="${et(e.phone,t)}" target="_blank" rel="noopener" class="btn-ghost btn-xs text-emerald-700" title="Kirim tagihan via WhatsApp">${j(`MessageCircle`,`w-4 h-4`)}</a>`:``}
                              </div>
                            </td>
                          </tr>`}).join(``):_t(6,`Tidak ada tagihan aktif. Semua pembayaran sudah diverifikasi. 🎉`)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,k(e.querySelector(`[data-view="dashboard"]`),`click`,`[data-action]`,(e,t)=>{let n=t.dataset.action;n===`checkin`&&kn(Number(t.dataset.room)),n===`edit-booking`&&On(Number(t.dataset.room),`edit_booking`),n===`extend`&&Mn(Number(t.dataset.tenant)),n===`detail`&&Ln(Number(t.dataset.tenant)),n===`tenant-booking`&&On(Number(t.dataset.room),`edit_booking`),n===`verify`&&Nn({kind:`bill`,id:Number(t.dataset.id)})})}var Gn=n({render:()=>rr}),Kn=`all`,qn=`all`,Jn=``,Yn=C.getRaw(`casa-ramire:room-view`)||`grid`,Xn={kosong:`border-t-amber-400`,booking:`border-t-indigo-400`,terisi:`border-t-emerald-500`};function Zn(e){e.querySelectorAll(`[data-floor]`).forEach(e=>{e.className=e.dataset.floor===Kn?`chip-active`:`chip-idle`}),e.querySelectorAll(`[data-status]`).forEach(e=>{e.className=e.dataset.status===qn?`chip-active`:`chip-idle`}),e.querySelectorAll(`[data-viewmode]`).forEach(e=>{e.className=`p-2 rounded-lg transition ${e.dataset.viewmode===Yn?`bg-brand text-white shadow-sm`:`text-stone-500 hover:bg-stone-100`}`})}function Qn(e){return L(zt(e.lantai)[1]||0)}function $n(e){return e.status===`kosong`?`
      <button type="button" class="btn-outline btn-xs" data-action="booking" data-id="${e.id}">${j(`CalendarClock`,`w-3 h-3`)} Booking</button>
      <button type="button" class="btn-primary btn-xs" data-action="checkin" data-id="${e.id}">${j(`LogIn`,`w-3 h-3`)} Check-in</button>
      ${we()?`<button type="button" class="btn-ghost btn-xs text-rose-600" data-action="delete-room" data-id="${e.id}" title="Hapus kamar">${j(`Trash2`,`w-3.5 h-3.5`)}</button>`:``}
    `:e.status===`booking`?`
      <button type="button" class="btn-primary btn-xs" data-action="checkin" data-id="${e.id}">${j(`LogIn`,`w-3 h-3`)} Check-in</button>
      <button type="button" class="btn-outline btn-xs" data-action="edit-booking" data-id="${e.id}">${j(`Pencil`,`w-3 h-3`)} Edit</button>
      <button type="button" class="btn-ghost btn-xs text-rose-600" data-action="cancel-booking" data-id="${e.id}" title="Batalkan booking">${j(`X`,`w-3.5 h-3.5`)}</button>
    `:`
    <button type="button" class="btn-outline btn-xs" data-action="detail" data-id="${e.id}">${j(`UserRound`,`w-3 h-3`)} Detail</button>
    <button type="button" class="btn-outline btn-xs" data-action="extend" data-id="${e.id}">${j(`Repeat`,`w-3 h-3`)} Perpanjang</button>
    <button type="button" class="btn-ghost btn-xs text-rose-600" data-action="checkout" data-id="${e.id}" title="Check-out">${j(`DoorOpen`,`w-3.5 h-3.5`)}</button>
  `}function er(e,t){return e.status===`terisi`&&t?`
      <button type="button" class="flex items-center gap-2 hover:text-brand text-left min-w-0" data-action="detail" data-id="${e.id}">
        ${K(t.name,`w-7 h-7 text-[9px]`)}
        <span class="min-w-0">
          <span class="block text-xs font-bold text-stone-800 truncate">${O(t.name)}</span>
          <span class="block text-[10px] text-stone-400">Penghuni aktif</span>
        </span>
      </button>`:e.status===`booking`&&e.booking?`
      <button type="button" class="flex items-center gap-2 hover:text-brand text-left min-w-0" data-action="edit-booking" data-id="${e.id}">
        ${K(e.booking.name,`w-7 h-7 text-[9px] bg-indigo-600`)}
        <span class="min-w-0">
          <span class="block text-xs font-bold text-stone-800 truncate">${O(e.booking.name)}</span>
          <span class="block text-[10px] text-indigo-500">Calon penghuni</span>
        </span>
      </button>`:`<span class="text-xs text-stone-400 italic">Siap dihuni</span>`}function tr(e,t){return e.length?`<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
    ${e.map(e=>{let n=e.tenantId?t.get(String(e.tenantId)):null;return`
          <div class="card border-t-4 ${Xn[e.status]||`border-t-stone-300`} p-5 rounded-2xl card-hover flex flex-col">
            <div class="flex items-center justify-between gap-2 mb-2">
              ${mt(e.status)}
              <span class="text-[10px] font-bold uppercase tracking-wider text-stone-400">Lantai ${O(e.lantai)}</span>
            </div>
            <div class="flex items-end justify-between gap-2">
              <div>
                <h3 class="text-2xl font-black text-stone-800 leading-none">Kamar ${O(e.nomor)}</h3>
                <p class="text-[10px] font-bold text-amber-700 uppercase tracking-wider mt-1">Deluxe</p>
              </div>
              <div class="text-right">
                <p class="text-[9px] text-stone-400 font-bold uppercase tracking-wider">Tarif / bulan</p>
                <p class="text-sm font-black text-stone-700">${Qn(e)}</p>
              </div>
            </div>
            <div class="mt-4 pt-3 border-t border-line-soft flex-1">
              ${er(e,n)}
            </div>
            <div class="mt-3 flex flex-wrap justify-end gap-1.5">${$n(e)}</div>
          </div>`}).join(``)}
  </div>`:G({iconName:`SearchX`,title:`Kamar tidak ditemukan`,description:`Coba ubah filter lantai/status atau kata kunci pencarian.`})}function nr(e,t){return e.length?`
    <div class="card overflow-hidden">
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr><th>Kamar</th><th>Lantai</th><th>Status</th><th>Penghuni</th><th>Tarif / bulan</th><th class="text-right">Aksi</th></tr></thead>
          <tbody>
            ${e.map(e=>{let n=e.tenantId?t.get(String(e.tenantId)):null;return`
                  <tr>
                    <td class="font-black text-stone-800">Kamar ${O(e.nomor)}</td>
                    <td>Lantai ${O(e.lantai)}</td>
                    <td>${mt(e.status)}</td>
                    <td>${er(e,n)}</td>
                    <td class="font-bold whitespace-nowrap">${Qn(e)}</td>
                    <td><div class="flex flex-wrap justify-end gap-1.5">${$n(e)}</div></td>
                  </tr>`}).join(``)}
          </tbody>
        </table>
      </div>
    </div>`:`<div class="card">${G({iconName:`SearchX`,title:`Kamar tidak ditemukan`,description:`Coba ubah filter lantai/status atau kata kunci pencarian.`})}</div>`}function rr(e){let t=$t(),n={all:t.length,2:t.filter(e=>e.lantai===`2`).length,3:t.filter(e=>e.lantai===`3`).length,kosong:t.filter(e=>e.status===`kosong`).length,booking:t.filter(e=>e.status===`booking`).length,terisi:t.filter(e=>e.status===`terisi`).length};e.innerHTML=`
    <div data-view="rooms" class="animate-in">
      ${U({eyebrow:`Inventaris Kamar`,title:`Status & Manajemen Kamar 🏢`,subtitle:`Kelola ${t.length} kamar di lantai 2 dan 3. Filter, cari, dan proses check-in dari satu tempat.`,actions:`
          <button type="button" class="btn-primary btn-sm" data-action="add-room">${j(`Plus`,`w-4 h-4`)} Tambah Kamar</button>
        `})}

      <div class="card p-3 mb-5 flex flex-col gap-3">
        <div class="flex flex-wrap items-center gap-2">
          <button type="button" class="chip-active" data-floor="all">Semua (${n.all})</button>
          <button type="button" class="chip-idle" data-floor="2">Lantai 2 (${n[2]})</button>
          <button type="button" class="chip-idle" data-floor="3">Lantai 3 (${n[3]})</button>
          <div class="hidden sm:block w-px h-6 bg-line mx-1"></div>
          <button type="button" class="chip-idle" data-status="all">Semua status</button>
          <button type="button" class="chip-idle" data-status="kosong">Kosong (${n.kosong})</button>
          <button type="button" class="chip-idle" data-status="booking">Booking (${n.booking})</button>
          <button type="button" class="chip-idle" data-status="terisi">Terisi (${n.terisi})</button>

          <div class="ml-auto flex items-center gap-2 w-full sm:w-auto">
            <div class="relative flex-1 sm:w-56">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">${j(`Search`,`w-3.5 h-3.5`)}</span>
              <input id="room-search" type="search" class="input input-sm pl-8" placeholder="Cari kamar / penghuni…" value="${O(Jn)}" />
            </div>
            <div class="flex bg-stone-100 rounded-xl p-1 shrink-0">
              <button type="button" class="p-2 rounded-lg" data-viewmode="grid" title="Tampilan grid" aria-label="Tampilan grid">${j(`LayoutGrid`,`w-4 h-4`)}</button>
              <button type="button" class="p-2 rounded-lg" data-viewmode="list" title="Tampilan daftar" aria-label="Tampilan daftar">${j(`List`,`w-4 h-4`)}</button>
            </div>
          </div>
        </div>
      </div>

      <div id="rooms-content"></div>

      <div class="mt-5 flex flex-wrap items-center gap-3 text-[10px] font-semibold text-stone-400">
        <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Terisi</span>
        <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-indigo-400"></span> Booking</span>
        <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Kosong</span>
      </div>
    </div>
  `;let r=e.querySelector(`[data-view="rooms"]`),i=r.querySelector(`#rooms-content`),a=r.querySelector(`#room-search`),o=()=>Zn(r),s=()=>{let e=en(),n=new Map(e.map(e=>[String(e.id),e])),r=Jn.trim().toLowerCase(),a=t.filter(e=>Kn===`all`||e.lantai===Kn).filter(e=>qn===`all`||e.status===qn).filter(e=>{if(!r)return!0;let t=e.tenantId?n.get(String(e.tenantId)):null;return[e.nomor,e.lantai,e.booking?.name||``,t?.name||``].join(` `).toLowerCase().includes(r)}).sort((e,t)=>e.nomor.localeCompare(t.nomor,void 0,{numeric:!0}));i.innerHTML=Yn===`grid`?tr(a,n):nr(a,n)};o(),s(),r.querySelectorAll(`[data-floor]`).forEach(e=>{e.addEventListener(`click`,()=>{Kn=e.dataset.floor,o(),s()})}),r.querySelectorAll(`[data-status]`).forEach(e=>{e.addEventListener(`click`,()=>{qn=e.dataset.status,o(),s()})}),r.querySelectorAll(`[data-viewmode]`).forEach(e=>{e.addEventListener(`click`,()=>{Yn=e.dataset.viewmode,C.setRaw(`casa-ramire:room-view`,Yn),o(),s()})}),a?.addEventListener(`input`,()=>{Jn=a.value,s()}),k(r,`click`,`[data-action]`,async(e,n)=>{let r=n.dataset.action,i=Number(n.dataset.id),a=t.find(e=>e.id===i);if(r===`add-room`)ir();else if(a){if(r===`booking`&&On(a.id,`booking`),r===`checkin`&&(a.status===`booking`?kn(a.id):On(a.id,`checkin`)),r===`edit-booking`&&On(a.id,`edit_booking`),r===`detail`&&a.tenantId&&Ln(a.tenantId),r===`extend`&&a.tenantId&&Mn(a.tenantId),r===`checkout`&&a.tenantId&&An(a.tenantId),r===`cancel-booking`){if(!await P({title:`Batalkan booking?`,message:`Booking kamar <b>${O(a.nomor)}</b>${a.booking?` oleh <b>${O(a.booking.name)}</b>`:``} akan dibatalkan dan kamar kembali kosong.`,confirmText:`Ya, batalkan`,danger:!0}))return;try{un(a.id),F(`Booking berhasil dibatalkan.`)}catch(e){F(e.message,`error`)}}if(r===`delete-room`){if(!await P({title:`Hapus kamar?`,message:`Kamar <b>${O(a.nomor)}</b> akan dihapus dari inventaris.`,confirmText:`Ya, hapus`,danger:!0}))return;try{rn(a.id),F(`Kamar berhasil dihapus.`)}catch(e){F(e.message,`error`)}}}})}function ir(){N({title:`Tambah Kamar Baru`,subtitle:`Kamar akan langsung tersedia di inventaris.`,size:`sm`,body:`
      <form id="room-form" class="space-y-4" novalidate>
        <div>
          <label class="label" for="nr-number">Nomor kamar</label>
          <input id="nr-number" type="text" inputmode="numeric" class="input" placeholder="cth: 222" />
        </div>
        <div>
          <label class="label" for="nr-floor">Lantai</label>
          <select id="nr-floor" class="select">
            <option value="2">Lantai 2</option>
            <option value="3">Lantai 3</option>
          </select>
        </div>
      </form>
    `,footer:`
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      <button type="submit" form="room-form" class="btn-primary btn-sm" data-submit>${j(`Plus`,`w-4 h-4`)} Simpan kamar</button>
    `,onMount(e,t){e.querySelector(`#room-form`).addEventListener(`submit`,n=>{n.preventDefault();try{nn({nomor:e.querySelector(`#nr-number`).value,lantai:e.querySelector(`#nr-floor`).value}),F(`Kamar baru berhasil ditambahkan.`),t()}catch(e){F(e.message,`error`)}})}})}var ar=n({render:()=>cr});function or(e,t){return`
    <div class="card p-5 rounded-2xl">
      <div class="flex items-start justify-between gap-3 border-b border-line pb-3 mb-4">
        <div>
          <h3 class="font-black text-lg text-stone-800">Pricelist Lantai ${e}</h3>
          <p class="text-xs text-stone-500">Kamar Deluxe ${e===`2`?`201 – 221`:`301 – 321`}</p>
        </div>
        <button type="button" class="btn-primary btn-sm" data-save-floor="${e}">${j(`Check`,`w-4 h-4`)} Simpan</button>
      </div>
      <div class="grid grid-cols-2 gap-3">
        ${s.map(n=>`
          <div>
            <label class="label" for="rate-${e}-${n.key}">${n.label}</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-stone-400">Rp</span>
              <input
                id="rate-${e}-${n.key}"
                type="number"
                min="0"
                step="10000"
                class="input input-sm pl-9 font-bold"
                data-rate-floor="${e}"
                data-rate-period="${n.key}"
                value="${I(t[n.key])||``}"
              />
            </div>
          </div>`).join(``)}
      </div>
      <p class="hint mt-3">Tarif paket bulanan adalah total untuk seluruh periode, bukan per bulan.</p>
    </div>
  `}function sr(e){return e.type===`persen`?`<span class="badge-blue">Persen</span>`:`<span class="badge-gold">Rupiah</span>`}function cr(e){let t=qt(),n=zt(`2`),r=zt(`3`);e.innerHTML=`
    <div data-view="pricing" class="animate-in">
      ${U({eyebrow:`Pricing Strategy`,title:`Pricelist & Diskon Promo 🏷️`,subtitle:`Atur tarif harian sampai tahunan dan program promo untuk menarik penghuni.`,actions:`<button type="button" class="btn-primary btn-sm" data-action="add-promo">${j(`Plus`,`w-4 h-4`)} Tambah Promo</button>`})}

      <div class="grid lg:grid-cols-2 gap-5 mb-6">
        ${or(`2`,n)}
        ${or(`3`,r)}
      </div>

      <div class="card overflow-hidden">
        <div class="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-line">
          <div>
            <h3 class="font-extrabold text-stone-800 text-sm">Daftar Promo</h3>
            <p class="text-xs text-stone-500 mt-0.5">Diskon rupiah dihitung per bulan kontrak.</p>
          </div>
          <span class="badge-gold">${t.filter(e=>e.active).length} aktif</span>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Nama Promo</th><th>Tipe</th><th>Nilai Diskon</th><th>Status</th><th class="text-right">Aksi</th></tr></thead>
            <tbody>
              ${t.length?t.map(e=>`
                        <tr>
                          <td class="font-bold text-stone-800">${O(e.name)}</td>
                          <td>${sr(e)}</td>
                          <td class="font-bold whitespace-nowrap">${e.type===`persen`?`${I(e.value)}%`:`${L(e.value)} / bulan`}</td>
                          <td>${e.active?`<span class="badge-green">Aktif</span>`:`<span class="badge-gray">Nonaktif</span>`}</td>
                          <td>
                            <div class="flex items-center justify-end gap-1">
                              <button type="button" class="btn-outline btn-xs" data-action="toggle-promo" data-id="${e.id}">${e.active?`Nonaktifkan`:`Aktifkan`}</button>
                              <button type="button" class="btn-ghost btn-xs" data-action="edit-promo" data-id="${e.id}" title="Edit promo">${j(`Pencil`,`w-3.5 h-3.5`)}</button>
                              <button type="button" class="btn-ghost btn-xs text-rose-600" data-action="delete-promo" data-id="${e.id}" title="Hapus promo">${j(`Trash2`,`w-3.5 h-3.5`)}</button>
                            </div>
                          </td>
                        </tr>`).join(``):_t(5,`Belum ada promo. Tambahkan promo pertama Anda.`)}
            </tbody>
          </table>
        </div>
      </div>

      <div class="card p-5 mt-5">
        ${yt(`Catatan perhitungan`)}
        <p class="text-xs text-stone-500 leading-relaxed mt-1.5">
          Diskon rupiah diterapkan per bulan kontrak; diskon persen dihitung dari total sewa. Add-on selalu dihitung per bulan.
          Deposit tidak termasuk pendapatan sewa. Semua perhitungan ini otomatis dipakai pada form booking, check-in, dan perpanjangan.
        </p>
      </div>
    </div>
  `;let i=e.querySelector(`[data-view="pricing"]`);i.querySelectorAll(`[data-save-floor]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.saveFloor,n={};i.querySelectorAll(`[data-rate-floor="${t}"]`).forEach(e=>{n[e.dataset.ratePeriod]=e.value});try{Qt(t,n),F(`Pricelist lantai ${t} berhasil disimpan.`)}catch(e){F(e.message,`error`)}})}),k(i,`click`,`[data-action]`,async(e,t)=>{let n=t.dataset.action,r=Number(t.dataset.id);if(n===`add-promo`)lr();else if(n===`edit-promo`)lr(r);else if(n===`toggle-promo`)Zt(r),F(`Status promo diperbarui.`);else if(n===`delete-promo`){if(!await P({title:`Hapus promo?`,message:`Promo <b>${O(qt().find(e=>e.id===r)?.name||``)}</b> akan dihapus. Kontrak yang sudah berjalan tidak terpengaruh.`,confirmText:`Ya, hapus`,danger:!0}))return;Xt(r),F(`Promo berhasil dihapus.`)}})}function lr(e=null){let t=e?qt().find(t=>t.id===e):null;N({title:t?`Edit Promo`:`Tambah Promo Baru`,subtitle:`Promo dapat diaktifkan atau dinonaktifkan kapan saja.`,size:`sm`,body:`
      <form id="promo-form" class="space-y-4" novalidate>
        <div>
          <label class="label" for="pr-name">Nama promo</label>
          <input id="pr-name" type="text" class="input" placeholder="cth: Promo Mahasiswa" value="${O(t?.name||``)}" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="label" for="pr-type">Tipe diskon</label>
            <select id="pr-type" class="select">
              <option value="rupiah" ${t?.type===`persen`?``:`selected`}>Rupiah / bulan</option>
              <option value="persen" ${t?.type===`persen`?`selected`:``}>Persen (%)</option>
            </select>
          </div>
          <div>
            <label class="label" for="pr-value">Nilai</label>
            <input id="pr-value" type="number" min="1" step="1" class="input" placeholder="cth: 200000" value="${t?I(t.value):``}" />
          </div>
        </div>
        <label class="flex items-center gap-2 cursor-pointer p-2.5 rounded-xl border border-line hover:bg-stone-50">
          <input id="pr-active" type="checkbox" class="w-4 h-4 accent-brand" ${t?t.active?`checked`:``:`checked`} />
          <span class="text-xs font-bold text-stone-700">Aktifkan promo ini</span>
        </label>
        <p class="hint">Diskon rupiah berlaku per bulan sewa. Diskon persen dihitung dari total nilai sewa.</p>
      </form>
    `,footer:`
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      <button type="submit" form="promo-form" class="btn-primary btn-sm" data-submit>${j(`Check`,`w-4 h-4`)} Simpan promo</button>
    `,onMount(e,n){e.querySelector(`#promo-form`).addEventListener(`submit`,r=>{r.preventDefault();try{Yt({id:t?.id||null,name:e.querySelector(`#pr-name`).value,type:e.querySelector(`#pr-type`).value,value:I(e.querySelector(`#pr-value`).value),active:e.querySelector(`#pr-active`).checked}),F(t?`Promo berhasil diperbarui.`:`Promo baru berhasil ditambahkan.`),n()}catch(e){F(e.message,`error`)}})}})}var ur=n({render:()=>dr});function dr(e){let t=bt(),n=t.filter(e=>e.active),r=n.reduce((e,t)=>e+I(t.price),0);e.innerHTML=`
    <div data-view="addons" class="animate-in">
      ${U({eyebrow:`Services & Amenities`,title:`Master Layanan Add-On 🚗`,subtitle:`Atur layanan tambahan yang bisa dipasang ke kontrak penghuni.`,actions:`<button type="button" class="btn-primary btn-sm" data-action="add-addon">${j(`Plus`,`w-4 h-4`)} Tambah Add-On</button>`})}

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        ${W({label:`Total Layanan`,value:t.length,iconName:`Sparkles`})}
        ${W({label:`Layanan Aktif`,value:n.length,iconName:`BadgeCheck`,tone:`green`})}
        ${W({label:`Potensi / Bulan`,value:L(r),iconName:`Coins`,tone:`brand`,hint:`Jika semua add-on terpasang`})}
        ${W({label:`Rata-rata Tarif`,value:L(n.length?r/n.length:0),iconName:`Percent`,tone:`amber`})}
      </div>

      <div class="card overflow-hidden">
        <div class="px-5 py-4 border-b border-line">
          <h3 class="font-extrabold text-stone-800 text-sm">Daftar Layanan</h3>
          <p class="text-xs text-stone-500 mt-0.5">Tarif add-on dihitung per bulan dan otomatis masuk ke tagihan sewa.</p>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Nama Add-On</th><th>Tarif / Bulan</th><th>Status</th><th class="text-right">Aksi</th></tr></thead>
            <tbody>
              ${t.length?t.map(e=>`
                        <tr>
                          <td>
                            <div class="flex items-center gap-2.5">
                              <span class="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">${j(`Sparkles`,`w-4 h-4`)}</span>
                              <span class="font-bold text-stone-800">${O(e.name)}</span>
                            </div>
                          </td>
                          <td class="font-black text-stone-800 whitespace-nowrap">${L(e.price)}</td>
                          <td>${e.active?`<span class="badge-green">Aktif</span>`:`<span class="badge-gray">Nonaktif</span>`}</td>
                          <td>
                            <div class="flex items-center justify-end gap-1">
                              <button type="button" class="btn-outline btn-xs" data-action="toggle" data-id="${e.id}">${e.active?`Nonaktifkan`:`Aktifkan`}</button>
                              <button type="button" class="btn-ghost btn-xs" data-action="edit" data-id="${e.id}" title="Edit add-on">${j(`Pencil`,`w-3.5 h-3.5`)}</button>
                              <button type="button" class="btn-ghost btn-xs text-rose-600" data-action="delete" data-id="${e.id}" title="Hapus add-on">${j(`Trash2`,`w-3.5 h-3.5`)}</button>
                            </div>
                          </td>
                        </tr>`).join(``):_t(4,`Belum ada layanan add-on. Tambahkan layanan pertama Anda.`)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,k(e.querySelector(`[data-view="addons"]`),`click`,`[data-action]`,async(e,n)=>{let r=n.dataset.action,i=Number(n.dataset.id);if(r===`add-addon`)fr();else if(r===`edit`)fr(i);else if(r===`toggle`)St(i),F(`Status layanan diperbarui.`);else if(r===`delete`){if(!await P({title:`Hapus layanan add-on?`,message:`Layanan <b>${O(t.find(e=>e.id===i)?.name||``)}</b> akan dihapus dari master. Kontrak yang sudah berjalan tetap menyimpan data add-on.`,confirmText:`Ya, hapus`,danger:!0}))return;Ct(i),F(`Layanan add-on berhasil dihapus.`)}})}function fr(e=null){let t=e?bt().find(t=>t.id===e):null;N({title:t?`Edit Add-On`:`Tambah Master Add-On`,size:`sm`,body:`
      <form id="addon-form" class="space-y-4" novalidate>
        <div>
          <label class="label" for="ad-name">Nama layanan</label>
          <input id="ad-name" type="text" class="input" placeholder="cth: Parkir Mobil" value="${O(t?.name||``)}" />
        </div>
        <div>
          <label class="label" for="ad-price">Tarif per bulan (Rp)</label>
          <input id="ad-price" type="number" min="0" step="1000" class="input" placeholder="cth: 100000" value="${t?I(t.price):``}" />
        </div>
        <label class="flex items-center gap-2 cursor-pointer p-2.5 rounded-xl border border-line hover:bg-stone-50">
          <input id="ad-active" type="checkbox" class="w-4 h-4 accent-brand" ${t?t.active?`checked`:``:`checked`} />
          <span class="text-xs font-bold text-stone-700">Layanan tersedia untuk dipilih</span>
        </label>
      </form>
    `,footer:`
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      <button type="submit" form="addon-form" class="btn-primary btn-sm" data-submit>${j(`Check`,`w-4 h-4`)} Simpan</button>
    `,onMount(e,n){e.querySelector(`#addon-form`).addEventListener(`submit`,r=>{r.preventDefault();try{xt({id:t?.id||null,name:e.querySelector(`#ad-name`).value,price:I(e.querySelector(`#ad-price`).value),active:e.querySelector(`#ad-active`).checked}),F(t?`Add-on berhasil diperbarui.`:`Add-on baru berhasil ditambahkan.`),n()}catch(e){F(e.message,`error`)}})}})}var pr=n({render:()=>yr}),mr=`aktif`,hr=``;function gr(e){return e.status===`aktif`?`<span class="badge-green">Aktif</span>`:`<span class="badge-gray">Checkout</span>`}function _r(e){if(e.status!==`aktif`)return e.checkoutDate?`<span class="badge-gray">Keluar ${H(e.checkoutDate)}</span>`:`<span class="badge-gray">—</span>`;let t=V(R(),e.endDate);return t<0?`<span class="badge-red">Lewat ${Math.abs(t)} hari</span>`:t===0?`<span class="badge-red">Berakhir hari ini</span>`:t<=7?`<span class="badge-amber">H-${t}</span>`:`<span class="badge-green">${t} hari lagi</span>`}function vr(e){let t=bn(e.id),n=ft(`reminder`,{nama:e.name,kamar:e.roomNumber||`—`,nominal:L(e.monthlyCharge),jatuh_tempo:H(e.endDate)}),r=e.status===`aktif`;return`
    <tr>
      <td>
        <div class="flex items-center gap-2.5">
          ${K(e.name,`w-9 h-9 text-[10px]`)}
          <div class="min-w-0">
            <button type="button" class="font-bold text-stone-800 hover:text-brand hover:underline text-left" data-action="detail" data-id="${e.id}">${O(e.name)}</button>
            <p class="text-[10px] text-stone-400 truncate">${O(e.job||`—`)} · ${O(e.phone)}</p>
          </div>
        </div>
      </td>
      <td>
        <p class="font-semibold text-stone-700 whitespace-nowrap">${r?`Kamar ${O(e.roomNumber||`—`)}`:`—`}</p>
        <div class="mt-0.5">${gr(e)}</div>
      </td>
      <td class="whitespace-nowrap">
        <p class="text-xs text-stone-600">${H(e.startDate)} — ${H(e.endDate)}</p>
        <div class="mt-0.5">${_r(e)}</div>
      </td>
      <td class="font-bold whitespace-nowrap">${L(e.contractTotal)}</td>
      <td class="font-bold whitespace-nowrap ${t>0?`text-rose-700`:`text-emerald-700`}">${t>0?L(t):`Lunas`}</td>
      <td>
        <div class="flex flex-wrap items-center justify-end gap-1">
          <button type="button" class="btn-outline btn-xs" data-action="detail" data-id="${e.id}">${j(`UserRound`,`w-3 h-3`)} Detail</button>
          ${r?`
                <button type="button" class="btn-outline btn-xs" data-action="extend" data-id="${e.id}" title="Perpanjang kontrak">${j(`Repeat`,`w-3 h-3`)}</button>
                <button type="button" class="btn-ghost btn-xs" data-action="move" data-id="${e.id}" title="Pindah kamar">${j(`ArrowRight`,`w-3.5 h-3.5`)}</button>
                <a href="${et(e.phone,n)}" target="_blank" rel="noopener" class="btn-ghost btn-xs text-emerald-700" title="Kirim WhatsApp">${j(`MessageCircle`,`w-4 h-4`)}</a>
                <button type="button" class="btn-ghost btn-xs text-rose-600" data-action="checkout" data-id="${e.id}" title="Check-out">${j(`DoorOpen`,`w-3.5 h-3.5`)}</button>
              `:``}
        </div>
      </td>
    </tr>
  `}function yr(e){let t=en(),n=t.filter(e=>e.status===`aktif`),r=t.filter(e=>e.status===`checkout`),i=n.reduce((e,t)=>e+bn(t.id),0),a=n.reduce((e,t)=>e+Number(t.contractTotal||0),0);e.innerHTML=`
    <div data-view="tenants" class="animate-in">
      ${U({eyebrow:`Directory & Contracts`,title:`Data Penghuni & Kontrak 👥`,subtitle:`Direktori penghuni, kontak darurat, riwayat kamar, dan siklus kontrak.`,actions:`<a href="#/rooms" class="btn-primary btn-sm">${j(`UserPlus`,`w-4 h-4`)} Check-in Penghuni</a>`})}

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        ${W({label:`Penghuni Aktif`,value:n.length,iconName:`Users`,tone:`green`,hint:`${r.length} sudah checkout`})}
        ${W({label:`Nilai Kontrak Aktif`,value:L(a),iconName:`Wallet`,tone:`brand`})}
        ${W({label:`Total Tunggakan`,value:L(i),iconName:`CircleAlert`,tone:i>0?`rose`:`green`})}
        ${W({label:`Total Penghuni`,value:t.length,iconName:`ClipboardList`,hint:`Termasuk riwayat`})}
      </div>

      <div class="card p-3 mb-5 flex flex-col sm:flex-row sm:items-center gap-3">
        <div class="flex flex-wrap gap-2">
          <button type="button" class="chip-active" data-filter="aktif">Aktif (${n.length})</button>
          <button type="button" class="chip-idle" data-filter="checkout">Checkout (${r.length})</button>
          <button type="button" class="chip-idle" data-filter="semua">Semua (${t.length})</button>
        </div>
        <div class="relative sm:ml-auto sm:w-64">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">${j(`Search`,`w-3.5 h-3.5`)}</span>
          <input id="tenant-search" type="search" class="input input-sm pl-8" placeholder="Cari nama / kamar / HP…" value="${O(hr)}" />
        </div>
      </div>

      <div id="tenants-content"></div>
    </div>
  `;let o=e.querySelector(`[data-view="tenants"]`),s=o.querySelector(`#tenants-content`),c=o.querySelector(`#tenant-search`),l=()=>{o.querySelectorAll(`[data-filter]`).forEach(e=>{e.className=e.dataset.filter===mr?`chip-active`:`chip-idle`})},u=()=>{let e=hr.trim().toLowerCase(),n=t.filter(e=>mr===`semua`||e.status===mr).filter(t=>!e||[t.name,t.roomNumber||``,t.phone||``,t.job||``].join(` `).toLowerCase().includes(e));n.length?s.innerHTML=`
      <div class="card overflow-hidden">
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Penghuni</th>
                <th>Kamar &amp; Status</th>
                <th>Masa Sewa</th>
                <th>Nilai Kontrak</th>
                <th>Tunggakan</th>
                <th class="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>${n.map(vr).join(``)}</tbody>
          </table>
        </div>
      </div>
    `:s.innerHTML=`<div class="card">${G({iconName:`Users`,title:`Tidak ada penghuni`,description:mr===`aktif`?`Belum ada penghuni aktif. Lakukan check-in dari menu Status Kamar.`:`Tidak ada data yang cocok dengan filter atau pencarian.`,action:`<a href="#/rooms" class="btn-primary btn-sm">${j(`Building2`,`w-4 h-4`)} Buka Status Kamar</a>`})}</div>`};l(),u(),o.querySelectorAll(`[data-filter]`).forEach(e=>{e.addEventListener(`click`,()=>{mr=e.dataset.filter,l(),u()})}),c?.addEventListener(`input`,()=>{hr=c.value,u()}),k(o,`click`,`[data-action]`,(e,t)=>{let n=t.dataset.action,r=Number(t.dataset.id);n===`detail`&&Ln(r),n===`extend`&&Mn(r),n===`move`&&jn(r),n===`checkout`&&An(r)})}function br(){return[...T().expenses].sort((e,t)=>e.date===t.date?t.id-e.id:String(t.date).localeCompare(String(e.date)))}function xr(){return[...T().expenseCategories]}function Sr({date:e,category:t,description:n,amount:r}){let i=String(n||``).trim(),a=String(t||``).trim(),o=Math.round(I(r));if(!i)throw Error(`Deskripsi pengeluaran wajib diisi.`);if(!a)throw Error(`Kategori wajib dipilih.`);if(o<=0)throw Error(`Nominal pengeluaran harus lebih dari 0.`);let s;return E(t=>{s={id:D(t.expenses),date:e||R(),category:a,description:i,amount:o,createdAt:new Date().toISOString()},t.expenses.push(s)}),s}function Cr(e,t){let n=String(t.description||``).trim(),r=String(t.category||``).trim(),i=Math.round(I(t.amount));if(!n)throw Error(`Deskripsi pengeluaran wajib diisi.`);if(!r)throw Error(`Kategori wajib dipilih.`);if(i<=0)throw Error(`Nominal pengeluaran harus lebih dari 0.`);E(a=>{let o=a.expenses.find(t=>String(t.id)===String(e));if(!o)throw Error(`Pengeluaran tidak ditemukan.`);o.date=t.date||o.date,o.category=r,o.description=n,o.amount=i,o.updatedAt=new Date().toISOString()})}function wr(e){E(t=>{t.expenses=t.expenses.filter(t=>String(t.id)!==String(e))})}function Tr(e){let t=String(e||``).trim();if(!t)throw Error(`Nama kategori wajib diisi.`);if(T().expenseCategories.some(e=>e.toLowerCase()===t.toLowerCase()))throw Error(`Kategori sudah ada.`);return E(e=>{e.expenseCategories.push(t)}),t}function Er(e){if(T().expenseCategories.length<=1)throw Error(`Minimal harus ada satu kategori.`);E(t=>{t.expenseCategories=t.expenseCategories.filter(t=>t!==e)})}var Dr=n({render:()=>Fr}),Or=`expenses`,kr=[{id:`expenses`,label:`Jurnal Pengeluaran`,iconName:`ScrollText`},{id:`invoices`,label:`Invoice Manual`,iconName:`FileText`},{id:`accrual`,label:`Pendapatan Accrual`,iconName:`TrendingUp`},{id:`pnl`,label:`Laba Rugi`,iconName:`PieChart`}];function Ar(){let e=br(),t=xr(),n=e.filter(e=>Qe(e.date)).reduce((e,t)=>e+I(t.amount),0),r=e.reduce((e,t)=>e+I(t.amount),0);return`
    <div class="space-y-5">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        ${W({label:`Pengeluaran Bulan Ini`,value:L(n),iconName:`TrendingDown`,tone:`rose`})}
        ${W({label:`Total Pengeluaran`,value:L(r),iconName:`Coins`})}
        ${W({label:`Jumlah Transaksi`,value:e.length,iconName:`Receipt`})}
        ${W({label:`Kategori Aktif`,value:t.length,iconName:`Tags`,tone:`amber`})}
      </div>

      <div class="card overflow-hidden">
        ${q({title:`Catatan Pengeluaran`,description:`Jurnal biaya operasional bulanan dan harian.`,actions:`
            <button type="button" class="btn-outline btn-xs" data-action="manage-categories">${j(`Tags`,`w-3.5 h-3.5`)} Kelola kategori</button>
            <button type="button" class="btn-primary btn-xs" data-action="add-expense">${j(`Plus`,`w-3.5 h-3.5`)} Catat pengeluaran</button>
          `})}
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Tanggal</th><th>Kategori</th><th>Uraian</th><th>Nominal</th><th class="text-right">Aksi</th></tr></thead>
            <tbody>
              ${e.length?e.map(e=>`
                        <tr>
                          <td class="whitespace-nowrap">${H(e.date)}</td>
                          <td><span class="badge-gray">${O(e.category)}</span></td>
                          <td class="font-semibold text-stone-700">${O(e.description)}</td>
                          <td class="font-black text-rose-700 whitespace-nowrap">${L(e.amount)}</td>
                          <td>
                            <div class="flex items-center justify-end gap-1">
                              <button type="button" class="btn-ghost btn-xs" data-action="edit-expense" data-id="${e.id}" title="Edit">${j(`Pencil`,`w-3.5 h-3.5`)}</button>
                              <button type="button" class="btn-ghost btn-xs text-rose-600" data-action="delete-expense" data-id="${e.id}" title="Hapus">${j(`Trash2`,`w-3.5 h-3.5`)}</button>
                            </div>
                          </td>
                        </tr>`).join(``):_t(5,`Belum ada pengeluaran tercatat.`)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `}function jr(){let e=Nt(),t=e.filter(e=>e.status===`unpaid`),n=e.filter(e=>e.status===`paid`&&Qe(e.paidAt)),r=t.reduce((e,t)=>e+I(t.amount),0),i=n.reduce((e,t)=>e+I(t.paid),0);return`
    <div class="space-y-5">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        ${W({label:`Total Invoice`,value:e.length,iconName:`FileText`})}
        ${W({label:`Belum Dibayar`,value:L(r),iconName:`CircleAlert`,tone:t.length?`rose`:`green`,hint:`${t.length} invoice`})}
        ${W({label:`Lunas Bulan Ini`,value:L(i),iconName:`CheckCircle2`,tone:`green`,hint:`${n.length} invoice`})}
        ${W({label:`Nilai Layanan`,value:L(e.reduce((e,t)=>e+I(t.amount),0)),iconName:`HandCoins`})}
      </div>

      <div class="card overflow-hidden">
        ${q({title:`Invoice Layanan & Non-Sewa`,description:`Laundry, perbaikan, fasilitas, dan tagihan lain di luar sewa.`,actions:`<button type="button" class="btn-primary btn-xs" data-action="add-invoice">${j(`FilePlus2`,`w-3.5 h-3.5`)} Buat invoice</button>`})}
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>No. Invoice</th><th>Kamar / Tenant</th><th>Item Layanan</th><th>Nominal</th><th>Status</th><th class="text-right">Aksi</th></tr></thead>
            <tbody>
              ${e.length?e.map(e=>{let t=ft(`manual`,{nama:e.tenantName,kamar:e.roomNumber,nominal:L(e.amount),no_invoice:e.number,item_layanan:e.item,jatuh_tempo:H(e.dueDate)});return`
                          <tr>
                            <td class="font-mono text-[11px] font-bold text-stone-700 whitespace-nowrap">${O(e.number)}</td>
                            <td>
                              <p class="font-bold text-stone-800">${O(e.tenantName||`—`)}</p>
                              <p class="text-[10px] text-stone-400">Kamar ${O(e.roomNumber||`—`)}</p>
                            </td>
                            <td class="font-semibold text-stone-700">${O(e.item)}</td>
                            <td class="font-black text-stone-800 whitespace-nowrap">${L(e.amount)}</td>
                            <td>${ht(e.status)}</td>
                            <td>
                              <div class="flex flex-wrap items-center justify-end gap-1">
                                ${e.status===`unpaid`?`<button type="button" class="btn-primary btn-xs" data-action="verify-invoice" data-id="${e.id}">${j(`ShieldCheck`,`w-3 h-3`)} Verifikasi</button>`:`<button type="button" class="btn-outline btn-xs" data-action="unverify-invoice" data-id="${e.id}">Batalkan</button>`}
                                ${e.phone?`<a href="${et(e.phone,t)}" target="_blank" rel="noopener" class="btn-ghost btn-xs text-emerald-700" title="Kirim invoice via WhatsApp">${j(`MessageCircle`,`w-4 h-4`)}</a>`:``}
                                <button type="button" class="btn-ghost btn-xs text-rose-600" data-action="delete-invoice" data-id="${e.id}" title="Hapus invoice">${j(`Trash2`,`w-3.5 h-3.5`)}</button>
                              </div>
                            </td>
                          </tr>`}).join(``):_t(6,`Belum ada invoice layanan. Buat invoice pertama Anda.`)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `}function Mr(){let e=st();return`
    <div class="space-y-5">
      <div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-900 leading-relaxed">
        <p class="font-extrabold mb-1">Prinsip pengakuan pendapatan</p>
        Sewa dasar dan add-on diakui penuh sebagai pendapatan bulan berjalan. Pembayaran di atas nilai bulanan dicatat sebagai pendapatan dimuka.
        Deposit tidak diakui sebagai pendapatan karena merupakan kewajiban yang dapat dikembalikan.
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        ${W({label:`Diakui Bulan Ini`,value:L(e.totalRecognized),iconName:`TrendingUp`,tone:`green`})}
        ${W({label:`Pendapatan Dimuka`,value:L(e.totalDeferred),iconName:`CalendarClock`,tone:`amber`})}
        ${W({label:`Total Kas Masuk`,value:L(e.totalPaid),iconName:`Banknote`,tone:`brand`})}
        ${W({label:`Belum Tertagih`,value:L(e.totalOutstanding),iconName:`CircleAlert`,tone:e.totalOutstanding?`rose`:`green`})}
      </div>

      <div class="card overflow-hidden">
        ${q({title:`Rincian Pendapatan per Penghuni`,description:`Nilai kontrak bulanan, kas masuk, dan pendapatan dimuka.`})}
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Penghuni / Kamar</th><th>Total Kas Masuk</th><th>Sewa + Add-On</th><th>Diakui Bulan Ini</th><th>Dimuka</th><th>Belum Tertagih</th></tr></thead>
            <tbody>
              ${e.rows.length?e.rows.map(e=>`
                        <tr>
                          <td>
                            <p class="font-bold text-stone-800">${O(e.name)}</p>
                            <p class="text-[10px] text-stone-400">Kamar ${O(e.roomNumber)}</p>
                          </td>
                          <td class="font-bold whitespace-nowrap">${L(e.paid)}</td>
                          <td class="whitespace-nowrap">${L(e.monthlyCharge)}</td>
                          <td class="font-black text-emerald-700 whitespace-nowrap">${L(e.recognized)}</td>
                          <td class="font-bold text-amber-700 whitespace-nowrap">${L(e.deferred)}</td>
                          <td class="font-bold whitespace-nowrap ${e.outstanding>0?`text-rose-700`:`text-stone-400`}">${e.outstanding>0?L(e.outstanding):`—`}</td>
                        </tr>`).join(``):_t(6,`Belum ada penghuni aktif untuk diakui pendapatannya.`)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `}function Nr(){let e=ct(),t=new Date().toLocaleDateString(`id-ID`,{month:`long`,year:`numeric`}),n=Math.max(1,...e.expenseByCategory.map(([,e])=>e));return`
    <div class="grid lg:grid-cols-2 gap-6">
      <div class="card p-6 space-y-4">
        <div class="flex items-center justify-between border-b border-line pb-3">
          <div>
            <h3 class="font-extrabold text-stone-800">Laporan Laba Rugi</h3>
            <p class="text-xs text-stone-500">Periode ${t}</p>
          </div>
          <span class="badge-gold">P&amp;L</span>
        </div>

        <div class="space-y-2.5 text-sm">
          <div class="flex justify-between gap-3"><span class="text-stone-600">Pendapatan sewa (accrual)</span><span class="font-bold text-stone-800">${L(e.rentRevenue)}</span></div>
          <div class="flex justify-between gap-3"><span class="text-stone-600">Pendapatan layanan (lunas)</span><span class="font-bold text-stone-800">${L(e.serviceRevenue)}</span></div>
          <div class="flex justify-between gap-3 pt-2 border-t border-line"><span class="font-bold text-stone-700">Total pendapatan</span><span class="font-black text-emerald-700">${L(e.revenue)}</span></div>
          <div class="flex justify-between gap-3"><span class="text-stone-600">Pengeluaran operasional</span><span class="font-bold text-rose-700">−${L(e.expenses)}</span></div>
          <div class="flex justify-between gap-3 pt-3 border-t-2 border-stone-300 items-center">
            <span class="font-black text-stone-800">Laba / (rugi) bersih</span>
            <span class="font-black text-xl ${e.net>=0?`text-emerald-700`:`text-rose-700`}">${e.net<0?`−`:``}${L(Math.abs(e.net))}</span>
          </div>
        </div>
      </div>

      <div class="card p-6 space-y-4">
        <div class="flex items-center justify-between border-b border-line pb-3">
          <div>
            <h3 class="font-extrabold text-stone-800">Komposisi Pengeluaran</h3>
            <p class="text-xs text-stone-500">Berdasarkan kategori · ${t}</p>
          </div>
          <span class="badge-gray">${e.expenseByCategory.length} kategori</span>
        </div>

        ${e.expenseByCategory.length?`<div class="space-y-3.5">
                ${e.expenseByCategory.map(([e,t])=>`
                    <div>
                      <div class="flex justify-between text-xs mb-1">
                        <span class="font-bold text-stone-700">${O(e)}</span>
                        <span class="font-black text-stone-800">${L(t)}</span>
                      </div>
                      ${vt(t/n*100,`bg-rose-400`)}
                    </div>`).join(``)}
              </div>`:G({iconName:`PieChart`,title:`Belum ada pengeluaran`,description:`Catat pengeluaran operasional untuk melihat komposisi biaya.`})}
      </div>
    </div>
  `}function Pr(){return Or===`invoices`?jr():Or===`accrual`?Mr():Or===`pnl`?Nr():Ar()}function Fr(e){e.innerHTML=`
    <div data-view="financial" class="animate-in">
      ${U({eyebrow:`Accounting System`,title:`Financial & Keuangan 📊`,subtitle:`Jurnal pengeluaran, invoice layanan, pendapatan accrual, dan laba rugi.`,actions:`
          <button type="button" class="btn-outline btn-sm" data-action="add-expense">${j(`Plus`,`w-4 h-4`)} Catat Pengeluaran</button>
          <button type="button" class="btn-primary btn-sm" data-action="add-invoice">${j(`FilePlus2`,`w-4 h-4`)} Buat Invoice</button>
        `})}

      <div class="flex flex-wrap gap-2 mb-5 border-b border-line pb-3" id="fin-tabs">
        ${kr.map(e=>`
          <button type="button" class="${Or===e.id?`chip-active`:`chip-idle`} flex items-center gap-1.5" data-tab="${e.id}">
            ${j(e.iconName,`w-3.5 h-3.5`)} ${e.label}
          </button>`).join(``)}
      </div>

      <div id="fin-content"></div>
    </div>
  `;let t=e.querySelector(`[data-view="financial"]`),n=t.querySelector(`#fin-content`),r=()=>{t.querySelectorAll(`[data-tab]`).forEach(e=>{e.className=`${e.dataset.tab===Or?`chip-active`:`chip-idle`} flex items-center gap-1.5`})},i=()=>{n.innerHTML=Pr(),r()};t.querySelectorAll(`[data-tab]`).forEach(e=>{e.addEventListener(`click`,()=>{Or=e.dataset.tab,i()})}),i(),k(t,`click`,`[data-action]`,async(e,t)=>{let n=t.dataset.action,r=Number(t.dataset.id);if(n===`add-expense`)Ir();else if(n===`add-invoice`)Fn();else if(n===`manage-categories`)Lr();else if(n===`edit-expense`)Ir(r);else if(n===`delete-expense`){if(!await P({title:`Hapus pengeluaran?`,message:`Catatan pengeluaran ini akan dihapus permanen.`,confirmText:`Ya, hapus`,danger:!0}))return;wr(r),F(`Pengeluaran berhasil dihapus.`)}else if(n===`verify-invoice`)Nn({kind:`invoice`,id:r});else if(n===`unverify-invoice`)It(r),F(`Verifikasi invoice dibatalkan.`,`warning`);else if(n===`delete-invoice`){if(!await P({title:`Hapus invoice?`,message:`Invoice layanan ini akan dihapus permanen.`,confirmText:`Ya, hapus`,danger:!0}))return;Lt(r),F(`Invoice berhasil dihapus.`)}})}function Ir(e=null){let t=e?br().find(t=>t.id===e):null,n=xr();N({title:t?`Edit Pengeluaran`:`Catat Pengeluaran`,size:`md`,body:`
      <form id="expense-form" class="space-y-4" novalidate>
        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label class="label" for="ex-date">Tanggal</label>
            <input id="ex-date" type="date" class="input" value="${t?.date||R()}" />
          </div>
          <div>
            <label class="label" for="ex-category">Kategori</label>
            <select id="ex-category" class="select">
              ${n.map(e=>`<option value="${O(e)}" ${t?.category===e?`selected`:``}>${O(e)}</option>`).join(``)}
            </select>
          </div>
        </div>
        <div>
          <label class="label" for="ex-description">Uraian / deskripsi</label>
          <input id="ex-description" type="text" class="input" placeholder="cth: Token listrik lantai 2" value="${O(t?.description||``)}" />
        </div>
        <div>
          <label class="label" for="ex-amount">Nominal (Rp)</label>
          <input id="ex-amount" type="number" min="0" step="1000" class="input" placeholder="cth: 350000" value="${t?I(t.amount):``}" />
        </div>
      </form>
    `,footer:`
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      <button type="submit" form="expense-form" class="btn-primary btn-sm" data-submit>${j(`Check`,`w-4 h-4`)} Simpan</button>
    `,onMount(e,n){e.querySelector(`#expense-form`).addEventListener(`submit`,r=>{r.preventDefault();let i={date:e.querySelector(`#ex-date`).value||R(),category:e.querySelector(`#ex-category`).value,description:e.querySelector(`#ex-description`).value,amount:I(e.querySelector(`#ex-amount`).value)};try{t?Cr(t.id,i):Sr(i),F(t?`Pengeluaran berhasil diperbarui.`:`Pengeluaran berhasil dicatat.`),n()}catch(e){F(e.message,`error`)}})}})}function Lr(){N({title:`Kelola Kategori Pengeluaran`,subtitle:`Kategori dipakai untuk mengelompokkan jurnal biaya.`,size:`sm`,body:`
      <div class="space-y-4">
        <div class="flex gap-2">
          <input id="cat-input" type="text" class="input input-sm flex-1" placeholder="Nama kategori baru" />
          <button type="button" class="btn-primary btn-sm shrink-0" data-add-category>${j(`Plus`,`w-4 h-4`)} Tambah</button>
        </div>
        <div id="cat-list" class="space-y-1.5 max-h-64 overflow-y-auto"></div>
      </div>
    `,footer:`<button type="button" class="btn-outline btn-sm" data-modal-close>Tutup</button>`,onMount(e){let t=e.querySelector(`#cat-input`),n=e.querySelector(`#cat-list`),r=()=>{let e=xr();n.innerHTML=e.map(e=>`
            <div class="flex items-center justify-between gap-2 rounded-xl border border-line bg-white px-3 py-2">
              <span class="text-xs font-semibold text-stone-700">${O(e)}</span>
              <button type="button" class="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50" data-remove-category="${O(e)}" aria-label="Hapus ${O(e)}">
                ${j(`X`,`w-3.5 h-3.5`)}
              </button>
            </div>`).join(``)};r(),e.querySelector(`[data-add-category]`)?.addEventListener(`click`,()=>{try{Tr(t.value),t.value=``,r(),F(`Kategori berhasil ditambahkan.`)}catch(e){F(e.message,`error`)}}),t.addEventListener(`keydown`,t=>{t.key===`Enter`&&(t.preventDefault(),e.querySelector(`[data-add-category]`)?.click())}),n.addEventListener(`click`,async e=>{let t=e.target.closest(`[data-remove-category]`);if(!t)return;let n=t.dataset.removeCategory;if(await P({title:`Hapus kategori?`,message:`Kategori <b>${O(n)}</b> akan dihapus. Pengeluaran lama tetap menyimpan nama kategori.`,confirmText:`Ya, hapus`,danger:!0}))try{Er(n),r(),F(`Kategori berhasil dihapus.`)}catch(e){F(e.message,`error`)}})}})}var Rr=n({render:()=>Ur}),Z=`semua`,zr=``,Br=[{key:`semua`,label:`Semua`},{key:`unpaid`,label:`Belum Bayar`},{key:`paid`,label:`Lunas`}];function Vr(e){return e.status===`unpaid`&&!!e.dueDate&&e.dueDate<R()}function Hr(e){let t=Vr(e),n=ft(`tagihan`,{nama:e.tenantName||`Penghuni`,kamar:e.roomNumber||`—`,nominal:L(e.amount),jatuh_tempo:H(e.dueDate),no_invoice:e.number});return`
    <tr>
      <td class="font-mono text-[11px] font-bold text-stone-700 whitespace-nowrap">${O(e.number||`—`)}</td>
      <td>
        <p class="font-bold text-stone-800">${O(e.tenantName||`—`)}</p>
        <p class="text-[10px] text-stone-400">Kamar ${O(e.roomNumber||`—`)}</p>
      </td>
      <td>
        <p class="font-semibold text-stone-700">${O(e.type||`Sewa`)}</p>
        ${e.description?`<p class="text-[10px] text-stone-400 max-w-[240px] truncate">${O(e.description)}</p>`:``}
      </td>
      <td class="font-black text-stone-800 whitespace-nowrap">${L(e.amount)}</td>
      <td class="whitespace-nowrap">
        <span class="${t?`text-rose-700 font-bold`:``}">${H(e.dueDate)}</span>
        ${t?`<p class="text-[10px] font-bold text-rose-600">Terlambat</p>`:``}
      </td>
      <td>${ht(e.status)}</td>
      <td>
        <div class="flex flex-wrap items-center justify-end gap-1">
          ${e.status===`unpaid`?`
                <button type="button" class="btn-primary btn-xs" data-action="verify" data-id="${e.id}">${j(`ShieldCheck`,`w-3 h-3`)} Verifikasi</button>
                ${e.phone?`<a href="${et(e.phone,n)}" target="_blank" rel="noopener" class="btn-ghost btn-xs text-emerald-700" title="Kirim tagihan via WhatsApp">${j(`MessageCircle`,`w-4 h-4`)}</a>`:``}
                <button type="button" class="btn-ghost btn-xs text-rose-600" data-action="delete" data-id="${e.id}" title="Hapus tagihan">${j(`Trash2`,`w-3.5 h-3.5`)}</button>
              `:`
                <button type="button" class="btn-outline btn-xs" data-action="unverify" data-id="${e.id}">Batalkan</button>
                <button type="button" class="btn-ghost btn-xs text-rose-600" data-action="delete" data-id="${e.id}" title="Hapus tagihan">${j(`Trash2`,`w-3.5 h-3.5`)}</button>
              `}
        </div>
      </td>
    </tr>
  `}function Ur(e){let t=Ot(),n=t.filter(e=>e.status===`unpaid`),r=t.filter(e=>e.status===`paid`&&Qe(e.paidAt||e.dueDate)),i=n.reduce((e,t)=>e+Math.max(0,I(t.amount)-I(t.paid)),0),a=r.reduce((e,t)=>e+I(t.paid||t.amount),0),o=n.filter(Vr).length;e.innerHTML=`
    <div data-view="billing" class="animate-in">
      ${U({eyebrow:`Cash Verification`,title:`Sewa & Verifikasi Kas 🧾`,subtitle:`Pantau tagihan sewa, verifikasi pembayaran, dan kirim pengingat WhatsApp.`,actions:`
          <button type="button" class="btn-outline btn-sm" data-action="add-invoice">${j(`FilePlus2`,`w-4 h-4`)} Invoice Layanan</button>
          <button type="button" class="btn-primary btn-sm" data-action="add-bill">${j(`Plus`,`w-4 h-4`)} Buat Tagihan</button>
        `})}

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        ${W({label:`Belum Dibayar`,value:L(i),iconName:`CircleAlert`,tone:i>0?`rose`:`green`,hint:`${n.length} tagihan aktif`})}
        ${W({label:`Terverifikasi Bulan Ini`,value:L(a),iconName:`ShieldCheck`,tone:`green`,hint:`${r.length} tagihan lunas`})}
        ${W({label:`Lewat Jatuh Tempo`,value:o,iconName:`Clock`,tone:o>0?`amber`:`default`,hint:o>0?`Perlu ditindaklanjuti`:`Semua tepat waktu`})}
        ${W({label:`Total Tagihan`,value:t.length,iconName:`ReceiptText`,hint:`Nilai ${L(t.reduce((e,t)=>e+I(t.amount),0))}`})}
      </div>

      <div class="card p-3 mb-5 flex flex-col sm:flex-row sm:items-center gap-3">
        <div class="flex flex-wrap gap-2" id="bill-filters">
          ${Br.map(e=>`
            <button type="button" class="${Z===e.key?`chip-active`:`chip-idle`}" data-filter="${e.key}">
              ${e.label} (${e.key===`semua`?t.length:t.filter(t=>t.status===e.key).length})
            </button>`).join(``)}
        </div>
        <div class="relative sm:ml-auto sm:w-72">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">${j(`Search`,`w-3.5 h-3.5`)}</span>
          <input id="bill-search" type="search" class="input input-sm pl-8" placeholder="Cari nomor / nama / kamar…" value="${O(zr)}" />
        </div>
      </div>

      <div id="bill-content"></div>
    </div>
  `;let s=e.querySelector(`[data-view="billing"]`),c=s.querySelector(`#bill-content`),l=s.querySelector(`#bill-search`),u=()=>{s.querySelectorAll(`[data-filter]`).forEach(e=>{e.className=e.dataset.filter===Z?`chip-active`:`chip-idle`})},d=()=>{let e=zr.trim().toLowerCase(),r=t.filter(e=>Z===`semua`||e.status===Z).filter(t=>!e||[t.number,t.tenantName,t.roomNumber,t.type,t.description].join(` `).toLowerCase().includes(e));r.length?c.innerHTML=`
      <div class="card overflow-hidden">
        ${q({title:`Daftar Tagihan Sewa`,description:`${r.length} tagihan ditampilkan · total ${L(r.reduce((e,t)=>e+I(t.amount),0))}`,actions:`<span class="badge-gold">${n.length} belum bayar</span>`})}
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>No. Tagihan</th>
                <th>Penghuni</th>
                <th>Jenis</th>
                <th>Nominal</th>
                <th>Jatuh Tempo</th>
                <th>Status</th>
                <th class="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>${r.map(Hr).join(``)}</tbody>
          </table>
        </div>
      </div>
    `:c.innerHTML=`
        <div class="card">
          ${G({iconName:`ReceiptText`,title:`Tidak ada tagihan`,description:Z===`unpaid`?`Semua tagihan sudah lunas. Kerja bagus! 🎉`:`Belum ada tagihan yang cocok dengan filter atau pencarian.`,action:`<button type="button" class="btn-primary btn-sm" data-action="add-bill">${j(`Plus`,`w-4 h-4`)} Buat Tagihan</button>`})}
        </div>
      `};u(),d(),s.querySelectorAll(`[data-filter]`).forEach(e=>{e.addEventListener(`click`,()=>{Z=e.dataset.filter,u(),d()})}),l?.addEventListener(`input`,()=>{zr=l.value,d()}),k(s,`click`,`[data-action]`,async(e,t)=>{let n=t.dataset.action,r=Number(t.dataset.id);if(n===`add-bill`)Pn();else if(n===`add-invoice`)Fn();else if(n===`verify`)Nn({kind:`bill`,id:r});else if(n===`unverify`){if(!await P({title:`Batalkan verifikasi?`,message:`Tagihan akan kembali berstatus <b>belum dibayar</b> dan pembayaran penghuni akan dikurangi sesuai nominal tagihan.`,confirmText:`Ya, batalkan`,danger:!0}))return;try{jt(r),F(`Verifikasi pembayaran dibatalkan.`,`warning`)}catch(e){F(e.message,`error`)}}else if(n===`delete`){if(!await P({title:`Hapus tagihan?`,message:`Tagihan akan dihapus permanen. Jika sudah lunas, riwayat pembayaran penghuni ikut disesuaikan.`,confirmText:`Ya, hapus`,danger:!0}))return;try{Mt(r),F(`Tagihan berhasil dihapus.`)}catch(e){F(e.message,`error`)}}})}var Wr=n({render:()=>Xr}),Gr=[{id:`tagihan`,label:`Tagihan Sewa`,iconName:`ReceiptText`,description:`Dikirim saat menerbitkan tagihan sewa.`},{id:`manual`,label:`Invoice Layanan`,iconName:`FileText`,description:`Untuk invoice non-sewa seperti laundry atau perbaikan.`},{id:`reminder`,label:`Pengingat Kontrak`,iconName:`CalendarClock`,description:`Pengingat sebelum kontrak sewa berakhir.`}],Q=`tagihan`,Kr=null;function $(){return Kr||=ut(),Kr}function qr(e){return String(e||``).replace(/\{([a-z_]+)\}/gi,(e,t)=>{let n=pt[t];return n==null?e:String(n)})}function Jr(){return Gr.map(e=>`
    <button type="button" class="${Q===e.id?`chip-active`:`chip-idle`} flex items-center gap-1.5" data-tab="${e.id}">
      ${j(e.iconName,`w-3.5 h-3.5`)} ${e.label}
    </button>`).join(``)}function Yr(){return Gr.find(e=>e.id===Q)||Gr[0]}function Xr(e){let t=$(),n=Yr();e.innerHTML=`
    <div data-view="content" class="animate-in">
      ${U({eyebrow:`Communication Studio`,title:`Konten & WA Preview 💬`,subtitle:`Kelola template pesan otomatis dan lihat hasilnya sebelum dikirim ke penghuni.`,actions:`
          <button type="button" class="btn-outline btn-sm" data-action="reset-template">${j(`RotateCcw`,`w-4 h-4`)} Reset template</button>
          <button type="button" class="btn-primary btn-sm" data-action="save-templates">${j(`Check`,`w-4 h-4`)} Simpan semua</button>
        `})}

      <div class="flex flex-wrap gap-2 mb-5 border-b border-line pb-3" id="content-tabs">
        ${Jr()}
      </div>

      <div class="grid lg:grid-cols-2 gap-6 items-start">
        <div class="card overflow-hidden">
          ${q({title:`Editor Template`,description:`Gunakan variabel agar pesan terisi otomatis.`,actions:`<span class="badge-gold" id="char-count">${String(t[Q]||``).length} karakter</span>`})}
          <div class="p-5 space-y-4">
            <div>
              <label class="label" for="template-text">Isi pesan — <span id="active-template-label">${O(n.label)}</span></label>
              <textarea id="template-text" rows="13" class="input font-mono text-[12px] leading-relaxed" spellcheck="false">${O(t[Q]||``)}</textarea>
              <p class="hint mt-2">${O(n.description)}</p>
            </div>

            <div>
              <p class="text-[11px] font-extrabold uppercase tracking-wider text-stone-400 mb-2">Sisipkan variabel</p>
              <div class="flex flex-wrap gap-1.5">
                ${g.map(e=>`
                  <button type="button" class="badge-gray hover:bg-brand hover:text-white hover:border-brand transition" data-token="${O(e.token)}" title="${O(e.desc)}">
                    ${j(`Plus`,`w-3 h-3`)} ${O(e.token)}
                  </button>`).join(``)}
              </div>
            </div>

            <div class="rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] text-amber-900 leading-relaxed flex items-start gap-2">
              ${j(`Info`,`w-3.5 h-3.5 shrink-0 mt-0.5`)}
              <span>Pesan hanya disiapkan sebagai tautan WhatsApp — tidak dikirim otomatis oleh aplikasi. Pastikan nomor penghuni sudah benar.</span>
            </div>
          </div>
        </div>

        <div class="card overflow-hidden">
          ${q({title:`Preview Pesan`,description:`Tampilan perkiraan di WhatsApp penerima.`,actions:`<button type="button" class="btn-outline btn-xs" data-action="copy">${j(`Copy`,`w-3.5 h-3.5`)} Salin</button>`})}
          <div class="p-5">
            <div class="rounded-2xl bg-[#e5ddd5] p-4 min-h-[300px] flex flex-col justify-end">
              <div class="max-w-[92%] self-start">
                <div class="rounded-xl rounded-tl-sm bg-white px-3.5 py-3 shadow-sm">
                  <p id="preview-text" class="text-[12px] text-stone-800 whitespace-pre-line leading-relaxed">${O(qr(t[Q]))}</p>
                  <p class="text-[9px] text-stone-400 text-right mt-1.5">${new Date().toLocaleTimeString(`id-ID`,{hour:`2-digit`,minute:`2-digit`})} ✓✓</p>
                </div>
                <p class="text-[9px] text-stone-500 mt-1.5">Casa Ramire · otomatis dari template</p>
              </div>
            </div>

            <div class="mt-4 rounded-xl border border-line bg-cream/60 p-3">
              <p class="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 mb-2">Data contoh</p>
              <div class="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
                ${Object.entries(pt).map(([e,t])=>`
                    <div class="flex justify-between gap-2">
                      <span class="text-stone-400 font-mono">{${O(e)}}</span>
                      <span class="font-semibold text-stone-700 truncate">${O(t)}</span>
                    </div>`).join(``)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;let r=e.querySelector(`[data-view="content"]`),i=r.querySelector(`#template-text`),a=r.querySelector(`#preview-text`),o=r.querySelector(`#char-count`),s=()=>{$()[Q]=i.value},c=()=>{s(),a.textContent=qr($()[Q]),o.textContent=`${i.value.length} karakter`},l=()=>{r.querySelector(`#content-tabs`).innerHTML=Jr(),r.querySelector(`#active-template-label`).textContent=Yr().label,r.querySelector(`#template-text`).closest(`.space-y-4`).querySelector(`.hint`).textContent=Yr().description};k(r,`click`,`[data-tab]`,(e,t)=>{s(),Q=t.dataset.tab,i.value=$()[Q]||``,l(),c()}),i.addEventListener(`input`,c),r.querySelectorAll(`[data-token]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.token,n=i.selectionStart??i.value.length,r=i.selectionEnd??i.value.length;i.value=`${i.value.slice(0,n)}${t}${i.value.slice(r)}`,i.focus(),i.setSelectionRange(n+t.length,n+t.length),c()})}),r.querySelector(`[data-action="save-templates"]`)?.addEventListener(`click`,()=>{s();try{dt($()),Kr=ut(),F(`Template pesan berhasil disimpan.`)}catch(e){F(e.message,`error`)}}),r.querySelector(`[data-action="reset-template"]`)?.addEventListener(`click`,async()=>{await P({title:`Reset template ini?`,message:`Template <b>${O(Yr().label)}</b> akan dikembalikan ke bawaan. Perubahan yang belum disimpan akan hilang.`,confirmText:`Ya, reset`,danger:!0})&&(Kr=$(),Kr[Q]=h[Q],i.value=Kr[Q],c(),F(`Template dikembalikan ke bawaan. Tekan Simpan untuk menerapkan.`,`warning`))}),r.querySelector(`[data-action="copy"]`)?.addEventListener(`click`,async()=>{let e=qr($()[Q]);try{await navigator.clipboard.writeText(e),F(`Pesan berhasil disalin.`)}catch{let t=document.createElement(`textarea`);t.value=e,t.setAttribute(`readonly`,``),t.className=`fixed opacity-0 pointer-events-none`,document.body.appendChild(t),t.select(),document.execCommand(`copy`),t.remove(),F(`Pesan berhasil disalin.`)}})}var Zr=n({render:()=>$r});function Qr(e){return e===`owner`?`<span class="badge-gold">Owner</span>`:`<span class="badge-blue">Staff</span>`}function $r(e){if(!we()){e.innerHTML=`
      <div class="card animate-in">
        ${G({iconName:`Lock`,title:`Akses terbatas`,description:`Halaman manajemen akun hanya dapat diakses oleh owner.`,action:`<a href="#/dashboard" class="btn-primary btn-sm">${j(`LayoutDashboard`,`w-4 h-4`)} Kembali ke Dashboard</a>`})}
      </div>
    `;return}let t=[...T().users].sort((e,t)=>e.name.localeCompare(t.name,`id`)),n=Ce(),r=t.filter(e=>e.active),i=t.filter(e=>e.role===`owner`),a=t.filter(e=>e.role===`staff`);e.innerHTML=`
    <div data-view="users" class="animate-in">
      ${U({eyebrow:`Access Control`,title:`Manajemen Akun 🔐`,subtitle:`Kelola akses owner dan staf operasional. Setiap perubahan langsung berlaku.`,actions:`<button type="button" class="btn-primary btn-sm" data-action="add-user">${j(`UserPlus`,`w-4 h-4`)} Tambah Akun</button>`})}

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        ${W({label:`Total Akun`,value:t.length,iconName:`Users`})}
        ${W({label:`Akun Aktif`,value:r.length,iconName:`UserCheck`,tone:`green`})}
        ${W({label:`Owner`,value:i.length,iconName:`ShieldCheck`,tone:`brand`})}
        ${W({label:`Staf`,value:a.length,iconName:`UserRound`,tone:`indigo`})}
      </div>

      <div class="card overflow-hidden">
        <div class="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-line">
          <div>
            <h3 class="font-extrabold text-stone-800 text-sm">Daftar Pengguna</h3>
            <p class="text-xs text-stone-500 mt-0.5">Owner dapat mengelola semua akun; staf hanya akses operasional.</p>
          </div>
          <span class="badge-gray">${r.length} aktif</span>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Pengguna</th>
                <th>Role</th>
                <th>Status</th>
                <th>Dibuat</th>
                <th class="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              ${t.length?t.map(e=>{let t=String(e.id)===String(n?.id);return`
                        <tr>
                          <td>
                            <div class="flex items-center gap-2.5">
                              ${K(e.name,`w-9 h-9 text-[10px]`)}
                              <div class="min-w-0">
                                <p class="font-bold text-stone-800 flex items-center gap-1.5">
                                  ${O(e.name)}
                                  ${t?`<span class="badge-gray">Anda</span>`:``}
                                </p>
                                <p class="text-[10px] text-stone-400 font-mono">@${O(e.username)}</p>
                              </div>
                            </div>
                          </td>
                          <td>${Qr(e.role)}</td>
                          <td>
                            ${e.active?`<span class="badge-green">Aktif</span>`:`<span class="badge-red">Nonaktif</span>`}
                          </td>
                          <td class="whitespace-nowrap text-xs text-stone-500">${H(e.createdAt)}</td>
                          <td>
                            <div class="flex flex-wrap items-center justify-end gap-1">
                              <button type="button" class="btn-outline btn-xs" data-action="edit-user" data-id="${e.id}">${j(`Pencil`,`w-3 h-3`)} Edit</button>
                              <button type="button" class="btn-ghost btn-xs" data-action="reset-password" data-id="${e.id}" title="Reset password">${j(`KeyRound`,`w-3.5 h-3.5`)}</button>
                              <button type="button" class="btn-ghost btn-xs ${e.active?`text-amber-700`:`text-emerald-700`}" data-action="toggle-active" data-id="${e.id}" title="${e.active?`Nonaktifkan akun`:`Aktifkan akun`}" ${t?`disabled`:``}>
                                ${j(e.active?`Lock`:`Unlock`,`w-3.5 h-3.5`)}
                              </button>
                              <button type="button" class="btn-ghost btn-xs text-rose-600" data-action="delete-user" data-id="${e.id}" title="Hapus akun" ${t?`disabled`:``}>${j(`Trash2`,`w-3.5 h-3.5`)}</button>
                            </div>
                          </td>
                        </tr>`}).join(``):`<tr><td colspan="5" class="px-4 py-10 text-center text-stone-400 text-sm">Belum ada akun.</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>

      <p class="hint mt-3 flex items-center gap-1.5">
        ${j(`Info`,`w-3.5 h-3.5`)}
        Password disimpan dalam bentuk hash SHA-256 bersalt di perangkat ini, bukan teks asli.
      </p>
    </div>
  `,k(e.querySelector(`[data-view="users"]`),`click`,`[data-action]`,async(e,n)=>{let r=n.dataset.action,i=Number(n.dataset.id),a=t.find(e=>String(e.id)===String(i));if(r===`add-user`)ei();else if(a){if(r===`edit-user`)ei(a);else if(r===`reset-password`)ti(a);else if(r===`toggle-active`){if(a.active&&!await P({title:`Nonaktifkan akun?`,message:`<b>${O(a.name)}</b> tidak akan bisa masuk sampai akun diaktifkan kembali.`,confirmText:`Ya, nonaktifkan`,danger:!0}))return;try{je(a.id,{active:!a.active}),F(a.active?`Akun dinonaktifkan.`:`Akun diaktifkan kembali.`)}catch(e){F(e.message,`error`)}}else if(r===`delete-user`){if(!await P({title:`Hapus akun?`,message:`<b>${O(a.name)}</b> (@${O(a.username)}) akan dihapus permanen dan tidak dapat masuk lagi.`,confirmText:`Ya, hapus`,danger:!0}))return;try{Ne(a.id),F(`Akun berhasil dihapus.`)}catch(e){F(e.message,`error`)}}}})}function ei(e=null){let t=!!e;N({title:t?`Edit Akun`:`Tambah Akun Baru`,subtitle:t?`@${e.username}`:`Akun baru dapat langsung digunakan setelah disimpan.`,size:`md`,body:`
      <form id="user-form" class="space-y-4" novalidate>
        <div>
          <label class="label" for="usr-name">Nama lengkap</label>
          <input id="usr-name" type="text" class="input" placeholder="cth: Rian Pratama" value="${O(e?.name||``)}" required />
        </div>
        <div>
          <label class="label" for="usr-username">Username</label>
          <input id="usr-username" type="text" class="input font-mono" placeholder="cth: rian" value="${O(e?.username||``)}" ${t?`disabled`:``} required />
          <p class="hint mt-1">${t?`Username tidak dapat diubah.`:`3–20 karakter: huruf, angka, titik, garis bawah, atau strip.`}</p>
        </div>
        ${t?``:`<div>
                <label class="label" for="usr-password">Password awal</label>
                <input id="usr-password" type="password" class="input" placeholder="Minimal 6 karakter" autocomplete="new-password" required />
              </div>`}
        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label class="label" for="usr-role">Role</label>
            <select id="usr-role" class="select">
              <option value="staff" ${e?.role===`owner`?``:`selected`}>Staf Operasional</option>
              <option value="owner" ${e?.role===`owner`?`selected`:``}>Owner / Super Admin</option>
            </select>
          </div>
          ${t?`<div class="flex items-end pb-2.5">
                  <label class="flex items-center gap-2 text-xs font-bold text-stone-700 cursor-pointer">
                    <input id="usr-active" type="checkbox" class="w-4 h-4 rounded border-stone-300 accent-brand" ${e.active?`checked`:``} />
                    Akun aktif
                  </label>
                </div>`:``}
        </div>
      </form>
    `,footer:`
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      <button type="submit" form="user-form" class="btn-primary btn-sm">${j(`Check`,`w-4 h-4`)} ${t?`Simpan perubahan`:`Buat akun`}</button>
    `,onMount(n,r){n.querySelector(`#user-form`).addEventListener(`submit`,i=>{i.preventDefault();try{t?(je(e.id,{name:n.querySelector(`#usr-name`).value,role:n.querySelector(`#usr-role`).value,active:n.querySelector(`#usr-active`).checked}),F(`Akun berhasil diperbarui.`)):(Ae({name:n.querySelector(`#usr-name`).value,username:n.querySelector(`#usr-username`).value,password:n.querySelector(`#usr-password`).value,role:n.querySelector(`#usr-role`).value}),F(`Akun baru berhasil dibuat.`)),r()}catch(e){F(e.message,`error`)}})}})}function ti(e){N({title:`Reset Password`,subtitle:`${e.name} · @${e.username}`,size:`sm`,body:`
      <form id="reset-form" class="space-y-4" novalidate>
        <div>
          <label class="label" for="rst-password">Password baru</label>
          <input id="rst-password" type="password" class="input" placeholder="Minimal 6 karakter" autocomplete="new-password" required />
        </div>
        <div>
          <label class="label" for="rst-confirm">Konfirmasi password</label>
          <input id="rst-confirm" type="password" class="input" autocomplete="new-password" required />
        </div>
        <p class="hint">Terakhir diperbarui: ${Xe(e.updatedAt||e.createdAt)}. Sampaikan password baru secara aman kepada pengguna.</p>
      </form>
    `,footer:`
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      <button type="submit" form="reset-form" class="btn-primary btn-sm">${j(`KeyRound`,`w-4 h-4`)} Reset password</button>
    `,onMount(t,n){t.querySelector(`#reset-form`).addEventListener(`submit`,r=>{r.preventDefault();let i=t.querySelector(`#rst-password`).value;if(i!==t.querySelector(`#rst-confirm`).value)F(`Konfirmasi password tidak cocok.`,`error`);else try{Me(e.id,i),F(`Password berhasil direset.`),n()}catch(e){F(e.message,`error`)}})}})}function ni(e=`w-10 h-10`){return`
    <svg viewBox="0 0 100 100" class="${e}" aria-hidden="true" focusable="false">
      <path d="M 20,40 L 50,15 L 80,40 L 80,80 L 20,80 Z" fill="none" stroke="#d4a359" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 50,65 Q 40,50 30,45 Q 45,45 50,65 Z" fill="#ffffff"/>
      <path d="M 50,65 Q 50,40 55,30 Q 65,45 50,65 Z" fill="#ffffff"/>
      <path d="M 50,65 Q 60,50 70,48 Q 60,60 50,65 Z" fill="#ffffff"/>
      <path d="M 50,65 Q 55,75 65,72 Q 55,80 50,65 Z" fill="#ffffff"/>
      <path d="M 50,65 L 45,75" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
    </svg>
  `}function ri(e=`w-10 h-10 rounded-2xl`,t={}){let{light:n=!1}=t;return`
    <div class="${e} ${n?`bg-white/10`:`bg-brand`} flex items-center justify-center p-1.5 shadow-sm border border-gold/30 shrink-0">
      ${ni(`w-full h-full`)}
    </div>
  `}var ii=[{icon:`Building2`,title:`42 kamar, satu dashboard`,desc:`Okupansi, booking, dan status kamar real-time.`},{icon:`ReceiptText`,title:`Tagihan & verifikasi kas`,desc:`VA, QRIS, dan pengingat WhatsApp dalam satu alur.`},{icon:`Wallet`,title:`Laporan keuangan rapi`,desc:`Accrual, jurnal pengeluaran, dan laba rugi.`}];function ai(){return`
    <div class="min-h-dvh flex items-center justify-center p-4 sm:p-6">
      <div class="w-full max-w-4xl card overflow-hidden rounded-3xl shadow-xl animate-in">
        <div class="grid lg:grid-cols-2">
          <div class="bg-brand text-white p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden">
            <div class="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-gold/10 blur-2xl"></div>
            <div class="absolute -left-10 -bottom-10 w-48 h-48 rounded-full bg-white/5 blur-2xl"></div>

            <div class="relative">
              <div class="flex items-center gap-3">
                ${ri(`w-12 h-12 rounded-2xl`)}
                <div>
                  <p class="font-extrabold tracking-wide text-lg leading-tight">CASA RAMIRE</p>
                  <p class="text-[10px] font-bold text-gold uppercase tracking-[0.22em]">Property Management OS</p>
                </div>
              </div>
              <h1 class="text-2xl lg:text-3xl font-black mt-8 tracking-tight text-balance">
                Kelola kos Anda dengan tenang.
              </h1>
              <p class="text-sm text-stone-300 mt-2 leading-relaxed">
                Dari kamar kosong sampai laporan laba rugi — semua tercatat, rapi, dan siap dipakai.
              </p>
            </div>

            <ul class="relative space-y-3 mt-8">
              ${ii.map(e=>`
                <li class="flex items-start gap-3">
                  <span class="w-9 h-9 rounded-xl bg-white/10 text-gold flex items-center justify-center shrink-0">
                    ${j(e.icon,`w-[18px] h-[18px]`)}
                  </span>
                  <div>
                    <p class="text-[13px] font-bold">${O(e.title)}</p>
                    <p class="text-[11px] text-stone-400 leading-snug">${O(e.desc)}</p>
                  </div>
                </li>`).join(``)}
            </ul>

            <p class="relative text-[10px] text-stone-500 mt-8">
              © ${new Date().getFullYear()} Casa Ramire · Data tersimpan di perangkat ini
            </p>
          </div>

          <div class="p-7 sm:p-10 bg-white">
            <div class="mb-6">
              <span class="badge-gold">Masuk ke sistem</span>
              <h2 class="text-2xl font-black text-stone-800 mt-3 tracking-tight">Selamat datang kembali 👋</h2>
              <p class="text-sm text-stone-500 mt-1">Gunakan akun yang diberikan owner untuk melanjutkan.</p>
            </div>

            <form id="login-form" class="space-y-4" novalidate>
              <div>
                <label class="label" for="login-username">Username</label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">${j(`UserRound`,`w-4 h-4`)}</span>
                  <input id="login-username" name="username" type="text" class="input pl-9" placeholder="cth: owner" autocomplete="username" required />
                </div>
              </div>

              <div>
                <label class="label" for="login-password">Password</label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">${j(`Lock`,`w-4 h-4`)}</span>
                  <input id="login-password" name="password" type="password" class="input pl-9 pr-11" placeholder="••••••••" autocomplete="current-password" required />
                  <button type="button" class="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100" data-toggle-password aria-label="Tampilkan password">
                    ${j(`Eye`,`w-4 h-4`)}
                  </button>
                </div>
              </div>

              <div id="login-error" class="hidden items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-semibold text-rose-700">
                ${j(`CircleAlert`,`w-4 h-4 shrink-0 mt-0.5`)}
                <span data-error-text></span>
              </div>

              <button type="submit" class="btn-primary w-full py-3" data-submit>
                ${j(`LogIn`,`w-4 h-4`)}
                <span>Masuk ke sistem</span>
              </button>
            </form>

            <div class="mt-6 rounded-2xl border border-line bg-cream/60 p-4">
              <p class="text-[11px] font-extrabold uppercase tracking-wider text-stone-500">Akun demo</p>
              <div class="mt-2 grid grid-cols-2 gap-2">
                <button type="button" class="btn-outline btn-sm justify-start" data-demo="owner">
                  ${j(`ShieldCheck`,`w-4 h-4 text-brand`)}
                  <span class="text-left leading-tight">Owner<br><span class="text-[10px] font-semibold text-stone-500">owner / 123456</span></span>
                </button>
                <button type="button" class="btn-outline btn-sm justify-start" data-demo="staff">
                  ${j(`UserRound`,`w-4 h-4 text-brand`)}
                  <span class="text-left leading-tight">Staf<br><span class="text-[10px] font-semibold text-stone-500">rian / 123456</span></span>
                </button>
              </div>
              <p class="hint mt-2">Klik kartu untuk mengisi otomatis, lalu tekan Masuk.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `}function oi(e){let t=e.querySelector(`#login-form`),n=e.querySelector(`#login-username`),r=e.querySelector(`#login-password`),i=e.querySelector(`#login-error`),a=e.querySelector(`[data-error-text]`),o=e.querySelector(`[data-submit]`),s=e=>{a.textContent=e,i.classList.remove(`hidden`),i.classList.add(`flex`)},c=()=>{i.classList.add(`hidden`),i.classList.remove(`flex`)};e.querySelector(`[data-toggle-password]`)?.addEventListener(`click`,e=>{let t=e.currentTarget,n=r.type===`password`;r.type=n?`text`:`password`,t.innerHTML=j(n?`EyeOff`:`Eye`,`w-4 h-4`),t.setAttribute(`aria-label`,n?`Sembunyikan password`:`Tampilkan password`)}),e.querySelectorAll(`[data-demo]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.demo===`owner`;n.value=t?`owner`:`rian`,r.value=`123456`,c(),r.focus()})}),t.addEventListener(`submit`,e=>{e.preventDefault(),c();let t=n.value.trim(),i=r.value;if(!t||!i){s(`Username dan password wajib diisi.`);return}o.disabled=!0,o.innerHTML=`${j(`Loader2`,`w-4 h-4 animate-spin`)}<span>Memeriksa…</span>`;let a=Ee(t,i);a.ok?F(`Selamat datang, ${a.user.name.split(` `)[0]}!`):(o.disabled=!1,o.innerHTML=`${j(`LogIn`,`w-4 h-4`)}<span>Masuk ke sistem</span>`,s(a.error),r.select())})}function si({iconName:e,title:t,description:n,body:r}){return`
    <section class="card p-5">
      <div class="flex items-start gap-3">
        <span class="w-10 h-10 rounded-xl bg-brand-50 text-brand flex items-center justify-center shrink-0">
          ${j(e,`w-5 h-5`)}
        </span>
        <div class="min-w-0 flex-1">
          <h3 class="font-extrabold text-stone-800 text-sm">${t}</h3>
          <p class="text-xs text-stone-500 mt-0.5">${n}</p>
          <div class="mt-4">${r}</div>
        </div>
      </div>
    </section>
  `}function ci(){if(!Ce())return;let e=T(),t=we();N({title:`Pengaturan`,subtitle:`Akun, cadangan data, dan pemeliharaan sistem`,size:`lg`,body:`
      <div class="space-y-4">
        ${si({iconName:`KeyRound`,title:`Keamanan akun`,description:`Ganti password Anda secara berkala.`,body:`
            <form id="settings-password-form" class="space-y-3" novalidate>
              <div class="grid sm:grid-cols-2 gap-3">
                <div>
                  <label class="label" for="pwd-current">Password saat ini</label>
                  <input id="pwd-current" type="password" class="input" autocomplete="current-password" required />
                </div>
                <div>
                  <label class="label" for="pwd-new">Password baru</label>
                  <input id="pwd-new" type="password" class="input" autocomplete="new-password" placeholder="Minimal 6 karakter" required />
                </div>
              </div>
              <div>
                <label class="label" for="pwd-confirm">Konfirmasi password baru</label>
                <input id="pwd-confirm" type="password" class="input" autocomplete="new-password" required />
              </div>
              <button type="submit" class="btn-primary btn-sm">
                ${j(`Check`,`w-4 h-4`)} Simpan password
              </button>
            </form>
          `})}

        ${si({iconName:`DatabaseBackup`,title:`Cadangan & pemulihan data`,description:`Terakhir diperbarui: ${Xe(e.meta?.updatedAt)}`,body:`
            <div class="flex flex-wrap gap-2">
              <button type="button" class="btn-outline btn-sm" data-action="export-backup">
                ${j(`Download`,`w-4 h-4`)} Unduh backup JSON
              </button>
              <label class="btn-outline btn-sm cursor-pointer">
                ${j(`Upload`,`w-4 h-4`)} Pulihkan dari file
                <input type="file" accept="application/json,.json" class="hidden" data-import-input />
              </label>
            </div>
            <p class="hint mt-2">Backup mencakup seluruh data kamar, penghuni, tagihan, pengeluaran, dan pengaturan. Simpan file di tempat aman.</p>
          `})}

        ${t?si({iconName:`ShieldCheck`,title:`Pemeliharaan data`,description:`Aksi di bawah ini tidak dapat dibatalkan. Unduh backup terlebih dahulu.`,body:`
                  <div class="flex flex-wrap gap-2">
                    <button type="button" class="btn-outline btn-sm" data-action="reset-operational">
                      ${j(`RotateCcw`,`w-4 h-4`)} Reset data operasional
                    </button>
                    <button type="button" class="btn-danger-soft btn-sm" data-action="factory-reset">
                      ${j(`AlertTriangle`,`w-4 h-4`)} Factory reset
                    </button>
                  </div>
                  <p class="hint mt-2">Reset operasional mengosongkan kamar, penghuni, tagihan, dan pengeluaran — konfigurasi & akun tetap. Factory reset mengembalikan semuanya ke kondisi awal.</p>
                `}):``}

        <div class="rounded-2xl border border-line bg-cream/60 p-4 text-xs text-stone-500 leading-relaxed">
          <p class="font-bold text-stone-700 mb-1">Tentang penyimpanan</p>
          Aplikasi ini menyimpan data di <code class="font-mono text-[11px] bg-white border border-line rounded px-1 py-0.5">localStorage</code> browser. Data tidak dikirim ke server. Gunakan backup rutin dan jangan membersihkan data situs ini tanpa cadangan.
        </div>
      </div>
    `,footer:`<button type="button" class="btn-outline btn-sm" data-modal-close>Tutup</button>`,onMount(e,t){let n=e.querySelector(`#settings-password-form`);n?.addEventListener(`submit`,t=>{t.preventDefault();let r=e.querySelector(`#pwd-current`).value,i=e.querySelector(`#pwd-new`).value;if(i!==e.querySelector(`#pwd-confirm`).value)F(`Konfirmasi password tidak cocok.`,`error`);else try{Pe(r,i),n.reset(),F(`Password berhasil diperbarui.`)}catch(e){F(e.message,`error`)}}),e.querySelector(`[data-action="export-backup"]`)?.addEventListener(`click`,()=>{let e=T();Ie(`casa-ramire-backup-${new Date().toISOString().slice(0,10)}.json`,JSON.stringify(e,null,2)),F(`Backup berhasil diunduh.`)});let r=e.querySelector(`[data-import-input]`);r?.addEventListener(`change`,async()=>{let e=r.files?.[0];if(e)try{let n=await Le(e),r=JSON.parse(n);if(!r||!Array.isArray(r.rooms)||!Array.isArray(r.users))throw Error(`File backup tidak valid.`);if(!await P({title:`Pulihkan data dari backup?`,message:`Seluruh data saat ini akan <b>diganti</b> dengan isi file backup. Lanjutkan?`,confirmText:`Ya, pulihkan`,danger:!0}))return;let i=T().session;ye({...r,session:r.session||i}),F(`Data berhasil dipulihkan dari backup.`),t()}catch(e){F(e.message||`Gagal membaca file backup.`,`error`)}finally{r.value=``}}),e.querySelector(`[data-action="reset-operational"]`)?.addEventListener(`click`,async()=>{await P({title:`Reset data operasional?`,message:`Kamar akan dikosongkan dan data penghuni, tagihan, invoice, serta pengeluaran dihapus. Akun, pricelist, add-on, promo, dan template tetap disimpan.`,confirmText:`Ya, reset`,danger:!0})&&(be(),F(`Data operasional berhasil direset.`),t())}),e.querySelector(`[data-action="factory-reset"]`)?.addEventListener(`click`,async()=>{await P({title:`Factory reset seluruh aplikasi?`,message:`Semua data termasuk akun kustom dan pengaturan akan dikembalikan ke kondisi awal (akun demo owner/rian). Tindakan ini tidak dapat dibatalkan.`,confirmText:`Ya, factory reset`,danger:!0})&&(xe(),F(`Aplikasi dikembalikan ke kondisi awal.`,`warning`),t())})}})}function li(e,t){let n=_.filter(t=>!t.ownerOnly||e.role===`owner`),r=v[t]||v.dashboard,a=i[e.role]?.short||`STAFF`;return`
    <div class="flex h-dvh overflow-hidden">
      <aside
        id="sidebar"
        class="fixed lg:static inset-y-0 left-0 z-40 w-72 bg-brand text-white flex flex-col shrink-0 shadow-xl -translate-x-full lg:translate-x-0 transition-transform duration-200 ease-out"
        aria-label="Navigasi utama"
      >
        <div class="px-5 py-5 border-b border-white/10 flex items-center gap-3">
          ${ri(`w-11 h-11 rounded-2xl`,{light:!0})}
          <div class="min-w-0">
            <p class="font-extrabold tracking-wider text-sm leading-tight">CASA RAMIRE</p>
            <p class="text-[9px] font-bold text-gold uppercase tracking-[0.18em]">Property Management</p>
          </div>
          <button class="lg:hidden ml-auto p-2 rounded-lg text-stone-300 hover:bg-white/10" data-action="close-menu" aria-label="Tutup menu">
            ${j(`X`,`w-5 h-5`)}
          </button>
        </div>

        <nav class="flex-1 overflow-y-auto scrollbar-none px-3 py-4 space-y-1" aria-label="Menu aplikasi">
          ${n.map(e=>`
              <a href="#/${e.path}" data-nav="${e.path}" class="nav-item ${e.path===t?`nav-item-active`:``}">
                ${j(e.icon,`w-[18px] h-[18px] shrink-0`)}
                <span class="truncate">${O(e.label)}</span>
              </a>`).join(``)}
        </nav>

        <div class="p-3 border-t border-white/10 space-y-2">
          <div class="flex items-center gap-2.5 rounded-xl bg-white/5 border border-white/10 p-2.5">
            ${K(e.name,`w-9 h-9 text-[11px] bg-gold text-brand`)}
            <div class="min-w-0 flex-1">
              <p class="text-xs font-bold text-white truncate">${O(e.name)}</p>
              <p class="text-[9px] font-extrabold uppercase tracking-wider text-gold">${a}</p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <button type="button" class="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-bold text-stone-200 hover:bg-white/10 transition" data-action="settings">
              ${j(`Settings`,`w-3.5 h-3.5`)} Pengaturan
            </button>
            <button type="button" class="flex items-center justify-center gap-1.5 rounded-xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-[11px] font-bold text-rose-200 hover:bg-rose-500/20 transition" data-action="logout">
              ${j(`LogOut`,`w-3.5 h-3.5`)} Keluar
            </button>
          </div>
        </div>
      </aside>

      <div id="sidebar-overlay" class="hidden fixed inset-0 z-30 bg-stone-950/50 backdrop-blur-[1px] lg:hidden"></div>

      <div class="flex-1 flex flex-col min-w-0">
        <header class="h-16 shrink-0 bg-cream/90 backdrop-blur border-b border-line flex items-center gap-3 px-4 sm:px-6">
          <button type="button" class="lg:hidden btn-ghost btn-sm" data-action="open-menu" aria-label="Buka menu">
            ${j(`Menu`,`w-5 h-5`)}
          </button>
          <div class="min-w-0">
            <p id="topbar-title" class="text-sm font-extrabold text-stone-800 truncate">${O(r.title)}</p>
            <p id="topbar-subtitle" class="text-[11px] text-stone-600 truncate hidden sm:block">${O(r.subtitle)}</p>
          </div>
          <div class="ml-auto flex items-center gap-2 sm:gap-3">
            <span class="hidden md:flex items-center gap-1.5 text-[11px] font-semibold text-stone-500 bg-white border border-line rounded-xl px-3 py-2">
              ${j(`CalendarDays`,`w-3.5 h-3.5 text-gold-700`)}
              ${Ye(new Date)}
            </span>
            <button type="button" class="btn-ghost btn-sm" data-action="settings" title="Pengaturan" aria-label="Pengaturan">
              ${j(`Settings`,`w-4 h-4`)}
            </button>
            <div class="hidden sm:flex items-center gap-2 pl-2 border-l border-line">
              ${K(e.name,`w-8 h-8 text-[10px]`)}
              <div class="hidden md:block leading-tight">
                <p class="text-[11px] font-bold text-stone-800 max-w-[140px] truncate">${O(e.name)}</p>
                <p class="text-[9px] font-extrabold uppercase tracking-wider text-gold-700">${a}</p>
              </div>
            </div>
          </div>
        </header>

        <main id="main-scroll" class="flex-1 overflow-y-auto">
          <div id="view" class="p-4 sm:p-6 lg:p-8 max-w-[1500px] mx-auto"></div>
        </main>
      </div>
    </div>
  `}function ui(e){let t=e.querySelector(`#sidebar`),n=e.querySelector(`#sidebar-overlay`),r=e=>{t.classList.toggle(`-translate-x-full`,!e),t.classList.toggle(`translate-x-0`,e),n.classList.toggle(`hidden`,!e)};e.querySelector(`[data-action="open-menu"]`)?.addEventListener(`click`,()=>r(!0)),e.querySelector(`[data-action="close-menu"]`)?.addEventListener(`click`,()=>r(!1)),n?.addEventListener(`click`,()=>r(!1)),e.querySelectorAll(`[data-nav]`).forEach(e=>{e.addEventListener(`click`,()=>r(!1))}),e.querySelectorAll(`[data-action="settings"]`).forEach(e=>{e.addEventListener(`click`,()=>ci())}),e.querySelector(`[data-action="logout"]`)?.addEventListener(`click`,()=>{De(),r(!1)})}function di(e,t,n){let r=v[n]||v.dashboard,a=e.querySelector(`#topbar-title`),o=e.querySelector(`#topbar-subtitle`);a&&(a.textContent=r.title),o&&(o.textContent=r.subtitle),e.querySelectorAll(`[data-nav]`).forEach(e=>{let t=e.dataset.nav===n;e.classList.toggle(`nav-item-active`,t),t?e.setAttribute(`aria-current`,`page`):e.removeAttribute(`aria-current`)});let s=i[t.role]?.short||`STAFF`,c=e.querySelector(`#sidebar [data-role-label]`);c&&(c.textContent=s)}var fi=document.getElementById(`app`),pi={dashboard:Rn,rooms:Gn,pricing:ar,addons:ur,tenants:pr,financial:Dr,billing:Rr,content:Wr,users:Zr},mi=new Set(_.filter(e=>e.ownerOnly).map(e=>e.path)),hi=null,gi=null,_i=!1;function vi(){_i||(_i=!0,queueMicrotask(()=>{_i=!1,bi()}))}function yi(e){return`
    <div class="card p-8 text-center animate-in">
      <h2 class="font-black text-stone-800 text-lg">Terjadi kesalahan saat memuat halaman</h2>
      <p class="text-sm text-stone-500 mt-1 max-w-lg mx-auto">
        Coba muat ulang aplikasi. Jika masalah berlanjut, unduh backup data lalu lakukan pemulihan.
      </p>
      <pre class="mt-4 text-left text-[11px] text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-3 overflow-x-auto">${String(e?.message||e)}</pre>
      <button type="button" class="btn-primary btn-sm mt-4" onclick="location.reload()">Muat ulang</button>
    </div>
  `}function bi(){let e=Ce();if(!e){hi!==null&&We(),hi=null,gi=null,fi.innerHTML=ai(),oi(fi),document.title=`Masuk — Casa Ramire`;return}let t=b();mi.has(t)&&!we()&&(F(`Halaman tersebut hanya dapat diakses oleh owner.`,`warning`),ee(`dashboard`,{replace:!0}),t=`dashboard`);let n=String(e.id);hi===n?di(fi,e,t):(fi.innerHTML=li(e,t),ui(fi),hi=n,gi=null);let r=fi.querySelector(`#view`);if(!r)return;let i=gi!==t;r.innerHTML=``;let a=pi[t]||pi.dashboard;try{a.render(r)}catch(e){console.error(`[app] failed to render view`,t,e),r.innerHTML=yi(e)}i&&(gi=t,document.getElementById(`main-scroll`)?.scrollTo({top:0}),document.title=`${v[t]?.title||`Dashboard`} — Casa Ramire`)}_e(vi),x(vi),window.location.hash||window.history.replaceState(null,``,`#/dashboard`),bi();