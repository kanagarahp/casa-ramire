var e=Object.defineProperty,t=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t,t.exports),e=null),t.exports),n=(t,n)=>{let r={};for(var i in t)e(r,i,{get:t[i],enumerable:!0});return n||e(r,Symbol.toStringTag,{value:`Module`}),r};(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var r=`casa-ramire:state`,i=13e4,a=`Parkir Mobil`,o={owner:{label:`Owner / Super Admin`,short:`SUPER ADMIN`},staff:{label:`Staf Operasional`,short:`STAFF ADMIN`}},s={kosong:{label:`Kosong`,badge:`badge-amber`},booking:{label:`Booking`,badge:`badge-blue`},terisi:{label:`Terisi`,badge:`badge-green`}},c={unpaid:{label:`Belum Bayar`,badge:`badge-amber`},paid:{label:`Lunas`,badge:`badge-green`}},l=[{key:`harian`,label:`Harian`,unit:`hari`,kind:`days`},{key:`mingguan`,label:`Mingguan`,unit:`minggu`,kind:`weeks`},{key:`1`,label:`1 Bulan`,unit:`bulan`,kind:`months`,months:1},{key:`3`,label:`3 Bulan`,unit:`bulan`,kind:`months`,months:3},{key:`6`,label:`6 Bulan`,unit:`bulan`,kind:`months`,months:6},{key:`12`,label:`12 Bulan (1 Tahun)`,unit:`bulan`,kind:`months`,months:12}],u=l.map(e=>e.key),d=[`Virtual Account BCA`,`Virtual Account Mandiri`,`QRIS All Payment`,`Transfer Bank`,`Tunai / Cash`],f=[{name:`Owner Casa Ramire`,username:`owner`,password:`123456`,role:`owner`},{name:`Admin (Staf Kasir)`,username:`admin`,password:`123456`,role:`staff`}],p={lantai2:{harian:15e4,mingguan:85e4,1:22e5,3:63e5,6:12e6,12:23e6},lantai3:{harian:14e4,mingguan:8e5,1:21e5,3:6e6,6:115e5,12:22e6}},m=[{name:a,price:i,active:!0},{name:`Kulkas Dalam Kamar`,price:75e3,active:!0},{name:`Dispenser & Aqua`,price:5e4,active:!0}],h=[{name:`Diskon Awal Tahun`,code:`AWALTAHUN`,type:`rupiah`,value:2e5,active:!0,maxUses:1,usedCount:0},{name:`Promo Mahasiswa 5%`,code:`MAHASISWA5`,type:`persen`,value:5,active:!0,maxUses:0,usedCount:0}],g=[{name:`Cuci Kering Setrika`,category:`Laundry`,price:7e3,unit:`kg`,active:!0},{name:`Cuci Kering`,category:`Laundry`,price:5e3,unit:`kg`,active:!0},{name:`Setrika Saja`,category:`Laundry`,price:4e3,unit:`kg`,active:!0},{name:`Bed Cover`,category:`Laundry`,price:25e3,unit:`pcs`,active:!0},{name:`Sepatu`,category:`Laundry`,price:2e4,unit:`pasang`,active:!0},{name:`Laundry Express 24 Jam`,category:`Laundry`,price:1e4,unit:`kg`,active:!0},{name:`Bersih Kamar`,category:`Kebersihan`,price:5e4,unit:`kali`,active:!0},{name:`Air Galon Isi Ulang`,category:`Lainnya`,price:2e4,unit:`galon`,active:!0}],_=[`Laundry`,`Kebersihan`,`Lainnya`],v={pending:{label:`Menunggu`,badge:`badge-amber`},confirmed:{label:`Dikonversi`,badge:`badge-green`},rejected:{label:`Ditolak`,badge:`badge-gray`}},y=[`Gaji HK / Kebersihan`,`Listrik`,`WiFi / Internet`,`Sampah & Keamanan`,`Maintenance`,`Lain-lain`],b={tagihan:`Halo Kak {nama} 👋

Berikut tagihan sewa Kamar {kamar} Casa Ramire sebesar *{nominal}* (jatuh tempo: {jatuh_tempo}).

Pembayaran dapat dilakukan via VA / QRIS. Terima kasih!`,manual:`Halo Kak {nama} (Kamar {kamar}) 👋

Terbit invoice layanan #{no_invoice} untuk *{item_layanan}* sebesar *{nominal}*.

Mohon dapat dibayarkan via VA / QRIS. Terima kasih!`,reminder:`PENGINGAT SEWA CASA RAMIRE ⚠️

Halo Kak {nama}, sewa Kamar {kamar} Anda berakhir pada *{jatuh_tempo}*. Total tagihan *{nominal}*.

Silakan lakukan perpanjangan agar kamar tetap nyaman untuk Anda. Terima kasih!`},x=[{token:`{nama}`,desc:`Nama penghuni`},{token:`{kamar}`,desc:`Nomor kamar`},{token:`{nominal}`,desc:`Nominal (Rp)`},{token:`{jatuh_tempo}`,desc:`Tanggal jatuh tempo`},{token:`{no_invoice}`,desc:`Nomor invoice`},{token:`{item_layanan}`,desc:`Item layanan`}],S=5e5,C=new Set([`home`,`login`]),ee={propertyName:`Casa Ramire`,tagline:`Kos nyaman, tenang, dan strategis.`,description:`Kamar deluxe dengan fasilitas lengkap di lingkungan yang tenang. Cocok untuk mahasiswa dan pekerja yang ingin tinggal jangka panjang.`,address:`Kos Casa Ramire, Yogyakarta`,whatsapp:`081116623661`,email:`casaramirejogja@gmail.com`,mapsUrl:`https://www.google.com/maps/search/?api=1&query=casa+ramire+kost+jogja`,mapsEmbedUrl:`https://maps.google.com/maps?q=casa%20ramire%20kost%20jogja&z=16&output=embed`,facilities:`AC, WiFi, kasur, lemari, meja kerja, kamar mandi dalam`,depositDefault:S,catalogAdminKey:``,catalogPublishedAt:``,paymentInstructions:``,dokuEnabled:!1},te=[{path:`dashboard`,label:`Dashboard`,icon:`LayoutDashboard`},{path:`pos`,label:`POS / Kasir`,icon:`ShoppingCart`},{path:`bookings`,label:`Booking Online`,icon:`Inbox`},{path:`rooms`,label:`Status Kamar`,icon:`Building2`},{path:`gallery`,label:`Galeri Landing`,icon:`Image`},{path:`pricing`,label:`Pricelist & Diskon`,icon:`Tags`},{path:`addons`,label:`Master Add-On`,icon:`CirclePlus`},{path:`tenants`,label:`Penghuni & Kontrak`,icon:`Users`},{path:`financial`,label:`Financial & Keuangan`,icon:`Wallet`},{path:`billing`,label:`Sewa & Verifikasi Kas`,icon:`ReceiptText`},{path:`content`,label:`Konten & WA Preview`,icon:`MessageSquareText`},{path:`users`,label:`Manajemen Akun`,icon:`UserCog`,ownerOnly:!0}],ne={dashboard:{title:`Dashboard`,subtitle:`Ringkasan operasional properti`},pos:{title:`POS / Kasir`,subtitle:`Penjualan layanan dan produk properti`},bookings:{title:`Booking Online`,subtitle:`Permintaan booking dari landing page`},rooms:{title:`Status Kamar`,subtitle:`Inventaris dan okupansi kamar`},gallery:{title:`Galeri Landing`,subtitle:`Foto yang tampil di halaman publik`},pricing:{title:`Pricelist & Diskon`,subtitle:`Strategi tarif dan promo`},addons:{title:`Master Add-On`,subtitle:`Layanan tambahan berbayar`},tenants:{title:`Penghuni & Kontrak`,subtitle:`Direktori dan riwayat sewa`},financial:{title:`Financial & Keuangan`,subtitle:`Jurnal, invoice, dan laba rugi`},billing:{title:`Sewa & Verifikasi Kas`,subtitle:`Tagihan dan konfirmasi pembayaran`},content:{title:`Konten & WA Preview`,subtitle:`Template pesan otomatis`},users:{title:`Manajemen Akun`,subtitle:`Akses staf dan keamanan`}},re=new Set([...te.map(e=>e.path),...C]);function ie(){let e=String(window.location.hash||``).replace(/^#\/?/,``).split(`?`)[0].trim();return e&&re.has(e)?e:`home`}function ae(e,{replace:t=!1}={}){let n=`#/${re.has(e)?e:`home`}`;window.location.hash!==n&&(t?window.history.replaceState(null,``,n):window.location.hash=n)}function oe(e){window.addEventListener(`hashchange`,e)}var se=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],ce=(e,t)=>e>>>t|e<<32-t;function le(e){return typeof e==`string`?new TextEncoder().encode(e):new Uint8Array(e)}function ue(e){return(e>>>0).toString(16).padStart(8,`0`)}function de(e){let t=le(e),n=t.length,r=n*8,i=Math.ceil((n+9)/64)*64,a=new Uint8Array(i);a.set(t),a[n]=128;let o=new DataView(a.buffer);o.setUint32(i-8,Math.floor(r/4294967296)),o.setUint32(i-4,r>>>0);let s=1779033703,c=3144134277,l=1013904242,u=2773480762,d=1359893119,f=2600822924,p=528734635,m=1541459225,h=new Uint32Array(64);for(let e=0;e<i;e+=64){for(let t=0;t<16;t+=1)h[t]=o.getUint32(e+t*4);for(let e=16;e<64;e+=1){let t=ce(h[e-15],7)^ce(h[e-15],18)^h[e-15]>>>3,n=ce(h[e-2],17)^ce(h[e-2],19)^h[e-2]>>>10;h[e]=h[e-16]+t+h[e-7]+n>>>0}let t=s,n=c,r=l,i=u,a=d,g=f,_=p,v=m;for(let e=0;e<64;e+=1){let o=ce(a,6)^ce(a,11)^ce(a,25),s=a&g^~a&_,c=v+o+s+se[e]+h[e]>>>0,l=(ce(t,2)^ce(t,13)^ce(t,22))+(t&n^t&r^n&r)>>>0;v=_,_=g,g=a,a=i+c>>>0,i=r,r=n,n=t,t=c+l>>>0}s=s+t>>>0,c=c+n>>>0,l=l+r>>>0,u=u+i>>>0,d=d+a>>>0,f=f+g>>>0,p=p+_>>>0,m=m+v>>>0}return[s,c,l,u,d,f,p,m].map(ue).join(``)}var fe=`casa-ramire::credentials::v2`;function pe(e){return de(`${fe}:${String(e)}`)}function me(e,t){return t?pe(e)===t:!1}function he(){let e=[],t=1;for(let n of[`2`,`3`])for(let r=1;r<=21;r+=1)e.push({id:t,nomor:`${n}${String(r).padStart(2,`0`)}`,lantai:n,status:`kosong`,tenantId:null,booking:null,photo:``,photoUrl:``}),t+=1;return e}function ge(e){return e.map((e,t)=>({id:t+1,...e}))}function _e(){let e=new Date().toISOString();return{version:8,meta:{createdAt:e,updatedAt:e},session:null,users:f.map((t,n)=>({id:n+1,name:t.name,username:t.username,passHash:pe(t.password),role:t.role,active:!0,createdAt:e})),rooms:he(),gallery:[],tenants:[],bills:[],manualInvoices:[],expenses:[],expenseCategories:[...y],addons:ge(m),promos:ge(h),posProducts:ge(g),posSales:[],pricing:structuredClone(p),templates:{...b},settings:{...ee}}}var ve=new Map;function ye(){try{let e=`__casa_ramire_probe__`;return window.localStorage.setItem(e,`1`),window.localStorage.removeItem(e),!0}catch{return!1}}var be=ye(),xe={get(e){try{let t=be?window.localStorage.getItem(e):ve.get(e);return t?JSON.parse(t):null}catch{return null}},set(e,t){try{let n=JSON.stringify(t);return be?window.localStorage.setItem(e,n):ve.set(e,n),!0}catch(e){return console.warn(`[storage] Gagal menyimpan data:`,e),!1}},remove(e){try{be?window.localStorage.removeItem(e):ve.delete(e)}catch{}},getRaw(e){try{return be?window.localStorage.getItem(e):ve.get(e)??null}catch{return null}},setRaw(e,t){try{return be?window.localStorage.setItem(e,t):ve.set(e,t),!0}catch{return!1}}},Se=Te(),Ce=new Set;function we(e){let t=_e(),n=Number(e.version)||0,r={...t,...e,version:8,meta:{...t.meta,...e.meta||{}},pricing:{...t.pricing,...e.pricing||{}},templates:{...t.templates,...e.templates||{}},settings:{...t.settings,...e.settings||{}}};for(let e of[`users`,`rooms`,`gallery`,`tenants`,`bills`,`manualInvoices`,`expenses`,`expenseCategories`,`addons`,`promos`,`posProducts`,`posSales`])Array.isArray(r[e])||(r[e]=t[e]);if(r.rooms=r.rooms.map(e=>({photo:``,photoUrl:``,...e})),r.gallery=r.gallery.map((e,t)=>({id:e.id??t+1,caption:``,photo:``,photoUrl:``,createdAt:``,...e})),n<5&&(r.settings.email||(r.settings.email=t.settings.email),r.settings.mapsUrl||(r.settings.mapsUrl=t.settings.mapsUrl),r.settings.mapsEmbedUrl||(r.settings.mapsEmbedUrl=t.settings.mapsEmbedUrl)),r.promos=r.promos.map((e,t)=>{let n=`PROMO${e.id??t+1}`;return{...e,code:String(e.code||n).toUpperCase().replace(/[^A-Z0-9-]/g,``),maxUses:Math.max(0,Number(e.maxUses)||0),usedCount:Math.max(0,Number(e.usedCount)||0)}}),n<5&&(r.addons=r.addons.map(e=>/parkir/i.test(String(e.name||``))?{...e,name:`Parkir Mobil`,price:i}:e)),r.posProducts=r.posProducts.map((e,t)=>({...e,id:e.id??t+1,name:String(e.name||``).trim(),category:String(e.category||`Lainnya`).trim(),price:Math.max(0,Number(e.price)||0),unit:String(e.unit||``).trim(),active:e.active!==!1,createdAt:e.createdAt||``})),r.posSales=r.posSales.map((e,t)=>({...e,id:e.id??t+1,number:e.number||`POS/${e.date||``}/${String(t+1).padStart(4,`0`)}`,date:e.date||``,items:Array.isArray(e.items)?e.items:[],subtotal:Math.max(0,Number(e.subtotal)||0),discount:Math.max(0,Number(e.discount)||0),total:Math.max(0,Number(e.total)||0),method:e.method||`Tunai / Cash`,amountPaid:Math.max(0,Number(e.amountPaid)||0),change:Math.max(0,Number(e.change)||0),customerName:e.customerName||``,customerPhone:e.customerPhone||``,customerEmail:e.customerEmail||``,tenantId:e.tenantId??null,roomNumber:e.roomNumber||``,note:e.note||``,status:e.status===`unpaid`?`unpaid`:`paid`,dueDate:e.dueDate||``,invoiceId:e.invoiceId??null,invoiceNumber:e.invoiceNumber||``,paidAt:e.paidAt||(e.status===`paid`?e.createdAt||``:null),createdAt:e.createdAt||``})),r.manualInvoices=r.manualInvoices.map(e=>({source:`manual`,items:[],posSaleId:null,...e,items:Array.isArray(e.items)?e.items:[]})),n<6&&(typeof r.settings.paymentInstructions!=`string`&&(r.settings.paymentInstructions=t.settings.paymentInstructions),typeof r.settings.dokuEnabled!=`boolean`&&(r.settings.dokuEnabled=t.settings.dokuEnabled)),r.tenants=r.tenants.map(e=>({email:``,deposit:0,depositPaid:0,depositRefunded:0,depositHistory:[],...e,depositHistory:Array.isArray(e.depositHistory)?e.depositHistory:[]})),r.rooms=r.rooms.map(e=>e.booking?{...e,booking:{email:``,depositPaid:0,depositRefunded:0,depositHistory:[],...e.booking,depositHistory:Array.isArray(e.booking.depositHistory)?e.booking.depositHistory:[]}}:e),r.settings.whatsapp||(r.settings.whatsapp=t.settings.whatsapp),n<3){let e=r.users.some(e=>String(e.username).toLowerCase()===`admin`),n=r.users.find(e=>String(e.username).toLowerCase()===`rian`);if(!e&&n)n.username=`admin`,n.name=`Admin (Staf Kasir)`;else if(!e){let e=t.users.find(e=>e.username===`admin`);if(e){let t=r.users.reduce((e,t)=>Math.max(e,Number(t.id)||0),0)+1;r.users.push({...e,id:t})}}}if(r.session){let e=r.users.find(e=>String(e.id)===String(r.session.userId));e&&e.active||(r.session=null)}return r}function Te(){let e=xe.get(r);if(e&&typeof e==`object`)return we(e);let t=_e();return xe.set(r,t),t}function w(){return Se}function Ee(e){return Ce.add(e),()=>Ce.delete(e)}function De(){for(let e of Ce)try{e(Se)}catch(e){console.error(`[store] listener error`,e)}}function T(e){e(Se),Se.meta={...Se.meta,updatedAt:new Date().toISOString()},xe.set(r,Se),De()}function Oe(e){Se=we(e||_e()),xe.set(r,Se),De()}function ke(){let e=Se;T(t=>{let n=_e();t.rooms=n.rooms,t.tenants=[],t.bills=[],t.manualInvoices=[],t.expenses=[],t.expenseCategories=n.expenseCategories,t.posSales=[],t.users=e.users,t.session=e.session,t.pricing=e.pricing,t.addons=e.addons,t.promos=e.promos,t.templates=e.templates,t.settings=e.settings})}function Ae(){Se=_e(),xe.set(r,Se),De()}function E(e=[]){return e.reduce((e,t)=>Math.max(e,Number(t?.id)||0),0)+1}function je(e,t=[]){let n=new Date;return`${e}/${`${n.getFullYear()}${String(n.getMonth()+1).padStart(2,`0`)}`}/${String(E(t)).padStart(4,`0`)}`}function Me(){let{session:e,users:t}=w();return e?.userId&&t.find(t=>String(t.id)===String(e.userId)&&t.active)||null}function Ne(){return Me()?.role===`owner`}function Pe(){if(!Ne())throw Error(`Aksi ini hanya dapat dilakukan oleh owner.`)}function Fe(e,t){let n=w(),r=String(e||``).trim().toLowerCase(),i=n.users.find(e=>e.username.toLowerCase()===r);return i?i.active?me(t,i.passHash)?(T(e=>{e.session={userId:i.id,issuedAt:new Date().toISOString()}}),{ok:!0,user:i}):{ok:!1,error:`Password salah. Silakan coba lagi.`}:{ok:!1,error:`Akun ini sedang dinonaktifkan. Hubungi owner.`}:{ok:!1,error:`Username tidak ditemukan.`}}function Ie(){T(e=>{e.session=null})}function Le(e,t,n=null){let r=String(e||``).trim().toLowerCase();if(!/^[a-z0-9._-]{3,20}$/.test(r))throw Error(`Username 3–20 karakter, hanya huruf, angka, titik, garis bawah, atau strip.`);if(t.some(e=>e.username.toLowerCase()===r&&String(e.id)!==String(n)))throw Error(`Username sudah digunakan.`);return r}function Re(e){if(String(e||``).length<6)throw Error(`Password minimal 6 karakter.`);return String(e)}function ze({name:e,username:t,password:n,role:r=`staff`}){Pe();let i=w(),a=String(e||``).trim();if(!a)throw Error(`Nama lengkap wajib diisi.`);let o=Le(t,i.users);if(Re(n),![`owner`,`staff`].includes(r))throw Error(`Role tidak valid.`);let s={id:E(i.users),name:a,username:o,passHash:pe(n),role:r,active:!0,createdAt:new Date().toISOString()};return T(e=>{e.users.push(s)}),s}function Be(e,{name:t,role:n,active:r}){Pe();let i=w(),a=i.users.find(t=>String(t.id)===String(e));if(!a)throw Error(`Pengguna tidak ditemukan.`);if(t!==void 0&&!String(t).trim())throw Error(`Nama lengkap wajib diisi.`);if(n!==void 0&&![`owner`,`staff`].includes(n))throw Error(`Role tidak valid.`);let o=n??a.role,s=r??a.active;if(a.role===`owner`&&(o!==`owner`||s===!1)&&i.users.filter(e=>e.role===`owner`&&e.active&&e.id!==a.id).length===0)throw Error(`Minimal harus ada satu owner aktif.`);return T(i=>{let a=i.users.find(t=>String(t.id)===String(e));t!==void 0&&(a.name=String(t).trim()),n!==void 0&&(a.role=n),r!==void 0&&(a.active=!!r),a.updatedAt=new Date().toISOString(),!a.active&&String(i.session?.userId)===String(a.id)&&(i.session=null)}),w().users.find(t=>String(t.id)===String(e))}function Ve(e,t){if(Pe(),!w().users.find(t=>String(t.id)===String(e)))throw Error(`Pengguna tidak ditemukan.`);Re(t),T(n=>{let r=n.users.find(t=>String(t.id)===String(e));r.passHash=pe(t),r.updatedAt=new Date().toISOString()})}function He(e){Pe();let t=w(),n=t.users.find(t=>String(t.id)===String(e));if(!n)throw Error(`Pengguna tidak ditemukan.`);if(String(n.id)===String(t.session?.userId))throw Error(`Anda tidak dapat menghapus akun yang sedang digunakan.`);if(n.role===`owner`&&t.users.filter(e=>e.role===`owner`&&e.active).length<=1)throw Error(`Minimal harus ada satu owner aktif.`);T(t=>{t.users=t.users.filter(t=>String(t.id)!==String(e))})}async function Ue({username:e,newPassword:t,recoveryKey:n}){let r=String(e||``).trim().toLowerCase(),i=String(n||``).trim();if(!r)throw Error(`Username owner wajib diisi.`);if(!i)throw Error(`Kunci admin wajib diisi.`);Re(t);let a=w(),o=a.users.find(e=>e.username.toLowerCase()===r);if(!o)throw Error(`Username owner tidak ditemukan di perangkat ini.`);if(o.role!==`owner`)throw Error(`Reset mandiri hanya untuk akun owner. Minta owner mereset akun staf.`);let s=String(a.settings?.catalogAdminKey||``).trim()===i;if(!s){let e;try{e=await fetch(`/api/state`,{headers:{Accept:`application/json`,"x-admin-key":i},cache:`no-store`})}catch{throw Error(`Tidak dapat memverifikasi kunci admin. Periksa koneksi internet atau masukkan kunci yang tersimpan di perangkat ini.`)}if(e.status===401)throw Error(`Kunci admin tidak valid.`);if(!e.ok)throw Error(`Verifikasi kunci admin gagal. Coba lagi.`);s=!0}if(!s)throw Error(`Kunci admin tidak valid.`);return T(e=>{let n=e.users.find(e=>e.username.toLowerCase()===r);n.passHash=pe(t),n.updatedAt=new Date().toISOString()}),w().users.find(e=>e.username.toLowerCase()===r)}function We(e,t){let n=Me();if(!n)throw Error(`Sesi tidak valid.`);if(!me(e,n.passHash))throw Error(`Password saat ini salah.`);Re(t),T(e=>{let r=e.users.find(e=>String(e.id)===String(n.id));r.passHash=pe(t),r.updatedAt=new Date().toISOString()})}var Ge=864e5;function D(e){if(typeof e==`number`)return Number.isFinite(e)?e:0;let t=String(e??``).replace(/[^\d.-]/g,``),n=Number(t);return Number.isFinite(n)?n:0}function O(e){return`Rp${Math.round(D(e)).toLocaleString(`id-ID`)}`}function Ke(e=new Date){let t=e instanceof Date?e:new Date(e);return Number.isNaN(t.getTime())?``:`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,`0`)}-${String(t.getDate()).padStart(2,`0`)}`}function k(){return Ke(new Date)}function qe(e){if(!e)return null;let[t,n,r]=String(e).slice(0,10).split(`-`).map(Number);if(!t||!n||!r)return null;let i=new Date(t,n-1,r);return Number.isNaN(i.getTime())?null:i}function A(e,t){let n=qe(e)||new Date;return n.setDate(n.getDate()+Number(t||0)),Ke(n)}function Je(e,t){let n=qe(e)||new Date,r=n.getDate();n.setDate(1),n.setMonth(n.getMonth()+Number(t||0));let i=new Date(n.getFullYear(),n.getMonth()+1,0).getDate();return n.setDate(Math.min(r,i)),Ke(n)}function Ye(e,t){let n=qe(e),r=qe(t);return!n||!r?0:Math.round((r.getTime()-n.getTime())/Ge)}function j(e,t={}){let n=e instanceof Date?e:qe(e);return n?n.toLocaleDateString(`id-ID`,{day:`2-digit`,month:`short`,year:`numeric`,...t}):`—`}function Xe(e){return j(e,{weekday:`long`,day:`numeric`,month:`long`,year:`numeric`})}function Ze(e){let t=e instanceof Date?e:new Date(e);return Number.isNaN(t.getTime())?`—`:t.toLocaleString(`id-ID`,{day:`2-digit`,month:`short`,year:`numeric`,hour:`2-digit`,minute:`2-digit`})}function Qe(e=new Date){let t=e instanceof Date?e:qe(e)||new Date(e);return!t||Number.isNaN(t.getTime())?``:`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,`0`)}`}function $e(e,t=new Date){return Qe(e)===Qe(t)}function et(e){let t=String(e??``).replace(/\D/g,``);return t?(t.startsWith(`0`)?t=`62${t.slice(1)}`:t.startsWith(`620`)?t=`62${t.slice(3)}`:t.startsWith(`8`)&&(t=`62${t}`),t):``}function tt(e,t=``){return`https://wa.me/${et(e)}${t?`?text=${encodeURIComponent(t)}`:``}`}function nt(e=``){return String(e).trim().split(/\s+/).map(e=>e.replace(/[^\p{L}\p{N}]/gu,``)).filter(Boolean).slice(0,2).map(e=>e.charAt(0).toUpperCase()).join(``)||`?`}var M=t((e=>{var t=[[`path`,{d:`m7 7 10 10`}],[`path`,{d:`M17 7v10H7`}]],n=[[`path`,{d:`m12 19-7-7 7-7`}],[`path`,{d:`M19 12H5`}]],r=[[`path`,{d:`M5 12h14`}],[`path`,{d:`m12 5 7 7-7 7`}]],i=[[`path`,{d:`M7 7h10v10`}],[`path`,{d:`M7 17 17 7`}]],a=[[`path`,{d:`M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z`}],[`path`,{d:`m9 12 2 2 4-4`}]],o=[[`rect`,{width:`20`,height:`12`,x:`2`,y:`6`,rx:`2`}],[`circle`,{cx:`12`,cy:`12`,r:`2`}],[`path`,{d:`M6 12h.01M18 12h.01`}]],s=[[`path`,{d:`M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8`}],[`path`,{d:`M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4`}],[`path`,{d:`M12 4v6`}],[`path`,{d:`M2 18h20`}]],c=[[`path`,{d:`M10 12h4`}],[`path`,{d:`M10 8h4`}],[`path`,{d:`M14 21v-3a2 2 0 0 0-4 0v3`}],[`path`,{d:`M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2`}],[`path`,{d:`M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16`}]],l=[[`path`,{d:`M16 14v2.2l1.6 1`}],[`path`,{d:`M16 2v4`}],[`path`,{d:`M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5`}],[`path`,{d:`M3 10h5`}],[`path`,{d:`M8 2v4`}],[`circle`,{cx:`16`,cy:`16`,r:`6`}]],u=[[`path`,{d:`M8 2v4`}],[`path`,{d:`M16 2v4`}],[`rect`,{width:`18`,height:`18`,x:`3`,y:`4`,rx:`2`}],[`path`,{d:`M3 10h18`}],[`path`,{d:`M8 14h.01`}],[`path`,{d:`M12 14h.01`}],[`path`,{d:`M16 14h.01`}],[`path`,{d:`M8 18h.01`}],[`path`,{d:`M12 18h.01`}],[`path`,{d:`M16 18h.01`}]],d=[[`path`,{d:`M8 2v4`}],[`path`,{d:`M16 2v4`}],[`rect`,{width:`18`,height:`18`,x:`3`,y:`4`,rx:`2`}],[`path`,{d:`M3 10h18`}]],f=[[`path`,{d:`M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2`}],[`circle`,{cx:`7`,cy:`17`,r:`2`}],[`path`,{d:`M9 17h6`}],[`circle`,{cx:`17`,cy:`17`,r:`2`}]],p=[[`path`,{d:`M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z`}],[`path`,{d:`M21.21 15.89A10 10 0 1 1 8 2.83`}]],m=[[`path`,{d:`M20 6 9 17l-5-5`}]],h=[[`path`,{d:`m6 9 6 6 6-6`}]],g=[[`path`,{d:`m15 18-6-6 6-6`}]],_=[[`path`,{d:`m9 18 6-6-6-6`}]],v=[[`path`,{d:`m18 15-6-6-6 6`}]],y=[[`circle`,{cx:`12`,cy:`12`,r:`10`}],[`line`,{x1:`12`,x2:`12`,y1:`8`,y2:`12`}],[`line`,{x1:`12`,x2:`12.01`,y1:`16`,y2:`16`}]],b=[[`circle`,{cx:`12`,cy:`12`,r:`10`}],[`path`,{d:`m9 12 2 2 4-4`}]];e.AlertTriangle=[[`path`,{d:`m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3`}],[`path`,{d:`M12 9v4`}],[`path`,{d:`M12 17h.01`}]],e.ArrowDownRight=t,e.ArrowLeft=n,e.ArrowRight=r,e.ArrowUpRight=i,e.BadgeCheck=a,e.Banknote=o,e.BedDouble=s,e.Building2=c,e.Calendar=d,e.CalendarClock=l,e.CalendarDays=u,e.Car=f,e.Check=m,e.CheckCircle2=b,e.ChevronDown=h,e.ChevronLeft=g,e.ChevronRight=_,e.ChevronUp=v,e.Circle=[[`circle`,{cx:`12`,cy:`12`,r:`10`}]],e.CircleAlert=y,e.CircleCheck=b,e.CircleDollarSign=[[`circle`,{cx:`12`,cy:`12`,r:`10`}],[`path`,{d:`M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8`}],[`path`,{d:`M12 18V6`}]],e.CirclePlus=[[`circle`,{cx:`12`,cy:`12`,r:`10`}],[`path`,{d:`M8 12h8`}],[`path`,{d:`M12 8v8`}]],e.CircleX=[[`circle`,{cx:`12`,cy:`12`,r:`10`}],[`path`,{d:`m15 9-6 6`}],[`path`,{d:`m9 9 6 6`}]],e.ClipboardList=[[`rect`,{width:`8`,height:`4`,x:`8`,y:`2`,rx:`1`,ry:`1`}],[`path`,{d:`M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2`}],[`path`,{d:`M12 11h4`}],[`path`,{d:`M12 16h4`}],[`path`,{d:`M8 11h.01`}],[`path`,{d:`M8 16h.01`}]],e.Clock=[[`path`,{d:`M12 6v6l4 2`}],[`circle`,{cx:`12`,cy:`12`,r:`10`}]],e.Coffee=[[`path`,{d:`M10 2v2`}],[`path`,{d:`M14 2v2`}],[`path`,{d:`M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1`}],[`path`,{d:`M6 2v2`}]],e.Coins=[[`circle`,{cx:`8`,cy:`8`,r:`6`}],[`path`,{d:`M18.09 10.37A6 6 0 1 1 10.34 18`}],[`path`,{d:`M7 6h1v4`}],[`path`,{d:`m16.71 13.88.7.71-2.82 2.82`}]],e.Copy=[[`rect`,{width:`14`,height:`14`,x:`8`,y:`8`,rx:`2`,ry:`2`}],[`path`,{d:`M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2`}]],e.CreditCard=[[`rect`,{width:`20`,height:`14`,x:`2`,y:`5`,rx:`2`}],[`line`,{x1:`2`,x2:`22`,y1:`10`,y2:`10`}]],e.DatabaseBackup=[[`ellipse`,{cx:`12`,cy:`5`,rx:`9`,ry:`3`}],[`path`,{d:`M3 12a9 3 0 0 0 5 2.69`}],[`path`,{d:`M21 9.3V5`}],[`path`,{d:`M3 5v14a9 3 0 0 0 6.47 2.88`}],[`path`,{d:`M12 12v4h4`}],[`path`,{d:`M13 20a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L12 16`}]],e.DoorClosed=[[`path`,{d:`M10 12h.01`}],[`path`,{d:`M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14`}],[`path`,{d:`M2 20h20`}]],e.DoorOpen=[[`path`,{d:`M11 20H2`}],[`path`,{d:`M11 4.562v16.157a1 1 0 0 0 1.242.97L19 20V5.562a2 2 0 0 0-1.515-1.94l-4-1A2 2 0 0 0 11 4.561z`}],[`path`,{d:`M11 4H8a2 2 0 0 0-2 2v14`}],[`path`,{d:`M14 12h.01`}],[`path`,{d:`M22 20h-3`}]],e.Download=[[`path`,{d:`M12 15V3`}],[`path`,{d:`M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4`}],[`path`,{d:`m7 10 5 5 5-5`}]],e.Droplets=[[`path`,{d:`M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z`}],[`path`,{d:`M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97`}]],e.ExternalLink=[[`path`,{d:`M15 3h6v6`}],[`path`,{d:`M10 14 21 3`}],[`path`,{d:`M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6`}]],e.Eye=[[`path`,{d:`M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0`}],[`circle`,{cx:`12`,cy:`12`,r:`3`}]],e.EyeOff=[[`path`,{d:`M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49`}],[`path`,{d:`M14.084 14.158a3 3 0 0 1-4.242-4.242`}],[`path`,{d:`M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143`}],[`path`,{d:`m2 2 20 20`}]],e.FilePlus2=[[`path`,{d:`M11.35 22H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v5.35`}],[`path`,{d:`M14 2v5a1 1 0 0 0 1 1h5`}],[`path`,{d:`M14 19h6`}],[`path`,{d:`M17 16v6`}]],e.FileText=[[`path`,{d:`M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z`}],[`path`,{d:`M14 2v5a1 1 0 0 0 1 1h5`}],[`path`,{d:`M10 9H8`}],[`path`,{d:`M16 13H8`}],[`path`,{d:`M16 17H8`}]],e.Filter=[[`path`,{d:`M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z`}]],e.Globe2=[[`path`,{d:`M21.54 15H17a2 2 0 0 0-2 2v4.54`}],[`path`,{d:`M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17`}],[`path`,{d:`M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05`}],[`circle`,{cx:`12`,cy:`12`,r:`10`}]],e.HandCoins=[[`path`,{d:`M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17`}],[`path`,{d:`m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9`}],[`path`,{d:`m2 16 6 6`}],[`circle`,{cx:`16`,cy:`9`,r:`2.9`}],[`circle`,{cx:`6`,cy:`5`,r:`3`}]],e.House=[[`path`,{d:`M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8`}],[`path`,{d:`M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z`}]],e.Image=[[`rect`,{width:`18`,height:`18`,x:`3`,y:`3`,rx:`2`,ry:`2`}],[`circle`,{cx:`9`,cy:`9`,r:`2`}],[`path`,{d:`m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21`}]],e.Inbox=[[`polyline`,{points:`22 12 16 12 14 15 10 15 8 12 2 12`}],[`path`,{d:`M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z`}]],e.Info=[[`circle`,{cx:`12`,cy:`12`,r:`10`}],[`path`,{d:`M12 16v-4`}],[`path`,{d:`M12 8h.01`}]],e.KeyRound=[[`path`,{d:`M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z`}],[`circle`,{cx:`16.5`,cy:`7.5`,r:`.5`,fill:`currentColor`}]],e.Landmark=[[`path`,{d:`M10 18v-7`}],[`path`,{d:`M11.12 2.198a2 2 0 0 1 1.76.006l7.866 3.847c.476.233.31.949-.22.949H3.474c-.53 0-.695-.716-.22-.949z`}],[`path`,{d:`M14 18v-7`}],[`path`,{d:`M18 18v-7`}],[`path`,{d:`M3 22h18`}],[`path`,{d:`M6 18v-7`}]],e.Laptop=[[`path`,{d:`M18 5a2 2 0 0 1 2 2v8.526a2 2 0 0 0 .212.897l1.068 2.127a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45l1.068-2.127A2 2 0 0 0 4 15.526V7a2 2 0 0 1 2-2z`}],[`path`,{d:`M20.054 15.987H3.946`}]],e.LayoutDashboard=[[`rect`,{width:`7`,height:`9`,x:`3`,y:`3`,rx:`1`}],[`rect`,{width:`7`,height:`5`,x:`14`,y:`3`,rx:`1`}],[`rect`,{width:`7`,height:`9`,x:`14`,y:`12`,rx:`1`}],[`rect`,{width:`7`,height:`5`,x:`3`,y:`16`,rx:`1`}]],e.LayoutGrid=[[`rect`,{width:`7`,height:`7`,x:`3`,y:`3`,rx:`1`}],[`rect`,{width:`7`,height:`7`,x:`14`,y:`3`,rx:`1`}],[`rect`,{width:`7`,height:`7`,x:`14`,y:`14`,rx:`1`}],[`rect`,{width:`7`,height:`7`,x:`3`,y:`14`,rx:`1`}]],e.List=[[`path`,{d:`M3 5h.01`}],[`path`,{d:`M3 12h.01`}],[`path`,{d:`M3 19h.01`}],[`path`,{d:`M8 5h13`}],[`path`,{d:`M8 12h13`}],[`path`,{d:`M8 19h13`}]],e.Loader2=[[`path`,{d:`M21 12a9 9 0 1 1-6.219-8.56`}]],e.Lock=[[`rect`,{width:`18`,height:`11`,x:`3`,y:`11`,rx:`2`,ry:`2`}],[`path`,{d:`M7 11V7a5 5 0 0 1 10 0v4`}]],e.LockKeyhole=[[`circle`,{cx:`12`,cy:`16`,r:`1`}],[`rect`,{x:`3`,y:`10`,width:`18`,height:`12`,rx:`2`}],[`path`,{d:`M7 10V7a5 5 0 0 1 10 0v3`}]],e.LogIn=[[`path`,{d:`m10 17 5-5-5-5`}],[`path`,{d:`M15 12H3`}],[`path`,{d:`M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4`}]],e.LogOut=[[`path`,{d:`m16 17 5-5-5-5`}],[`path`,{d:`M21 12H9`}],[`path`,{d:`M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4`}]],e.MapPin=[[`path`,{d:`M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0`}],[`circle`,{cx:`12`,cy:`10`,r:`3`}]],e.Menu=[[`path`,{d:`M4 5h16`}],[`path`,{d:`M4 12h16`}],[`path`,{d:`M4 19h16`}]],e.MessageCircle=[[`path`,{d:`M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719`}]],e.MessageSquare=[[`path`,{d:`M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z`}]],e.MessageSquareText=[[`path`,{d:`M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z`}],[`path`,{d:`M7 11h10`}],[`path`,{d:`M7 15h6`}],[`path`,{d:`M7 7h8`}]],e.Minus=[[`path`,{d:`M5 12h14`}]],e.MoreVertical=[[`circle`,{cx:`12`,cy:`12`,r:`1`}],[`circle`,{cx:`12`,cy:`5`,r:`1`}],[`circle`,{cx:`12`,cy:`19`,r:`1`}]],e.Package=[[`path`,{d:`M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z`}],[`path`,{d:`M12 22V12`}],[`polyline`,{points:`3.29 7 12 12 20.71 7`}],[`path`,{d:`m7.5 4.27 9 5.15`}]],e.Pencil=[[`path`,{d:`M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z`}],[`path`,{d:`m15 5 4 4`}]],e.Percent=[[`line`,{x1:`19`,x2:`5`,y1:`5`,y2:`19`}],[`circle`,{cx:`6.5`,cy:`6.5`,r:`2.5`}],[`circle`,{cx:`17.5`,cy:`17.5`,r:`2.5`}]],e.Phone=[[`path`,{d:`M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384`}]],e.PhoneCall=[[`path`,{d:`M13 2a9 9 0 0 1 9 9`}],[`path`,{d:`M13 6a5 5 0 0 1 5 5`}],[`path`,{d:`M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384`}]],e.PhoneOutgoing=[[`path`,{d:`m16 8 6-6`}],[`path`,{d:`M22 8V2h-6`}],[`path`,{d:`M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384`}]],e.PieChart=p,e.Plus=[[`path`,{d:`M5 12h14`}],[`path`,{d:`M12 5v14`}]],e.Printer=[[`path`,{d:`M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2`}],[`path`,{d:`M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6`}],[`rect`,{x:`6`,y:`14`,width:`12`,height:`8`,rx:`1`}]],e.Receipt=[[`path`,{d:`M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z`}],[`path`,{d:`M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8`}],[`path`,{d:`M12 17.5v-11`}]],e.ReceiptText=[[`path`,{d:`M13 16H8`}],[`path`,{d:`M14 8H8`}],[`path`,{d:`M16 12H8`}],[`path`,{d:`M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z`}]],e.RefreshCw=[[`path`,{d:`M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8`}],[`path`,{d:`M21 3v5h-5`}],[`path`,{d:`M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16`}],[`path`,{d:`M8 16H3v5`}]],e.Refrigerator=[[`path`,{d:`M5 6a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6Z`}],[`path`,{d:`M5 10h14`}],[`path`,{d:`M15 7v6`}]],e.Repeat=[[`path`,{d:`m17 2 4 4-4 4`}],[`path`,{d:`M3 11v-1a4 4 0 0 1 4-4h14`}],[`path`,{d:`m7 22-4-4 4-4`}],[`path`,{d:`M21 13v1a4 4 0 0 1-4 4H3`}]],e.RotateCcw=[[`path`,{d:`M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8`}],[`path`,{d:`M3 3v5h5`}]],e.Save=[[`path`,{d:`M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z`}],[`path`,{d:`M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7`}],[`path`,{d:`M7 3v4a1 1 0 0 0 1 1h7`}]],e.ScrollText=[[`path`,{d:`M15 12h-5`}],[`path`,{d:`M15 8h-5`}],[`path`,{d:`M19 17V5a2 2 0 0 0-2-2H4`}],[`path`,{d:`M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3`}]],e.Search=[[`path`,{d:`m21 21-4.34-4.34`}],[`circle`,{cx:`11`,cy:`11`,r:`8`}]],e.SearchX=[[`path`,{d:`m13.5 8.5-5 5`}],[`path`,{d:`m8.5 8.5 5 5`}],[`circle`,{cx:`11`,cy:`11`,r:`8`}],[`path`,{d:`m21 21-4.3-4.3`}]],e.Send=[[`path`,{d:`M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z`}],[`path`,{d:`m21.854 2.147-10.94 10.939`}]],e.Settings=[[`path`,{d:`M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915`}],[`circle`,{cx:`12`,cy:`12`,r:`3`}]],e.ShieldCheck=[[`path`,{d:`M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z`}],[`path`,{d:`m9 12 2 2 4-4`}]],e.ShoppingCart=[[`circle`,{cx:`8`,cy:`21`,r:`1`}],[`circle`,{cx:`19`,cy:`21`,r:`1`}],[`path`,{d:`M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12`}]],e.SlidersHorizontal=[[`path`,{d:`M10 5H3`}],[`path`,{d:`M12 19H3`}],[`path`,{d:`M14 3v4`}],[`path`,{d:`M16 17v4`}],[`path`,{d:`M21 12h-9`}],[`path`,{d:`M21 19h-5`}],[`path`,{d:`M21 5h-7`}],[`path`,{d:`M8 10v4`}],[`path`,{d:`M8 12H3`}]],e.Snowflake=[[`path`,{d:`m10 20-1.25-2.5L6 18`}],[`path`,{d:`M10 4 8.75 6.5 6 6`}],[`path`,{d:`m14 20 1.25-2.5L18 18`}],[`path`,{d:`m14 4 1.25 2.5L18 6`}],[`path`,{d:`m17 21-3-6h-4`}],[`path`,{d:`m17 3-3 6 1.5 3`}],[`path`,{d:`M2 12h6.5L10 9`}],[`path`,{d:`m20 10-1.5 2 1.5 2`}],[`path`,{d:`M22 12h-6.5L14 15`}],[`path`,{d:`m4 10 1.5 2L4 14`}],[`path`,{d:`m7 21 3-6-1.5-3`}],[`path`,{d:`m7 3 3 6h4`}]],e.Sofa=[[`path`,{d:`M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3`}],[`path`,{d:`M2 16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z`}],[`path`,{d:`M4 18v2`}],[`path`,{d:`M20 18v2`}],[`path`,{d:`M12 4v9`}]],e.Sparkles=[[`path`,{d:`M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z`}],[`path`,{d:`M20 2v4`}],[`path`,{d:`M22 4h-4`}],[`circle`,{cx:`4`,cy:`20`,r:`2`}]],e.Tags=[[`path`,{d:`M13.172 2a2 2 0 0 1 1.414.586l6.71 6.71a2.4 2.4 0 0 1 0 3.408l-4.592 4.592a2.4 2.4 0 0 1-3.408 0l-6.71-6.71A2 2 0 0 1 6 9.172V3a1 1 0 0 1 1-1z`}],[`path`,{d:`M2 7v6.172a2 2 0 0 0 .586 1.414l6.71 6.71a2.4 2.4 0 0 0 3.191.193`}],[`circle`,{cx:`10.5`,cy:`6.5`,r:`.5`,fill:`currentColor`}]],e.Trash2=[[`path`,{d:`M10 11v6`}],[`path`,{d:`M14 11v6`}],[`path`,{d:`M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6`}],[`path`,{d:`M3 6h18`}],[`path`,{d:`M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2`}]],e.TrendingDown=[[`path`,{d:`M16 17h6v-6`}],[`path`,{d:`m22 17-8.5-8.5-5 5L2 7`}]],e.TrendingUp=[[`path`,{d:`M16 7h6v6`}],[`path`,{d:`m22 7-8.5 8.5-5-5L2 17`}]],e.Unlock=[[`rect`,{width:`18`,height:`11`,x:`3`,y:`11`,rx:`2`,ry:`2`}],[`path`,{d:`M7 11V7a5 5 0 0 1 9.9-1`}]],e.Upload=[[`path`,{d:`M12 3v12`}],[`path`,{d:`m17 8-5-5-5 5`}],[`path`,{d:`M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4`}]],e.UploadCloud=[[`path`,{d:`M12 13v8`}],[`path`,{d:`M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242`}],[`path`,{d:`m8 17 4-4 4 4`}]],e.UserCheck=[[`path`,{d:`m16 11 2 2 4-4`}],[`path`,{d:`M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2`}],[`circle`,{cx:`9`,cy:`7`,r:`4`}]],e.UserCog=[[`path`,{d:`M10 15H6a4 4 0 0 0-4 4v2`}],[`path`,{d:`m14.305 16.53.923-.382`}],[`path`,{d:`m15.228 13.852-.923-.383`}],[`path`,{d:`m16.852 12.228-.383-.923`}],[`path`,{d:`m16.852 17.772-.383.924`}],[`path`,{d:`m19.148 12.228.383-.923`}],[`path`,{d:`m19.53 18.696-.382-.924`}],[`path`,{d:`m20.772 13.852.924-.383`}],[`path`,{d:`m20.772 16.148.924.383`}],[`circle`,{cx:`18`,cy:`15`,r:`3`}],[`circle`,{cx:`9`,cy:`7`,r:`4`}]],e.UserPlus=[[`path`,{d:`M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2`}],[`circle`,{cx:`9`,cy:`7`,r:`4`}],[`line`,{x1:`19`,x2:`19`,y1:`8`,y2:`14`}],[`line`,{x1:`22`,x2:`16`,y1:`11`,y2:`11`}]],e.UserRound=[[`circle`,{cx:`12`,cy:`8`,r:`5`}],[`path`,{d:`M20 21a8 8 0 0 0-16 0`}]],e.Users=[[`path`,{d:`M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2`}],[`path`,{d:`M16 3.128a4 4 0 0 1 0 7.744`}],[`path`,{d:`M22 21v-2a4 4 0 0 0-3-3.87`}],[`circle`,{cx:`9`,cy:`7`,r:`4`}]],e.Utensils=[[`path`,{d:`M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2`}],[`path`,{d:`M7 2v20`}],[`path`,{d:`M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7`}]],e.Wallet=[[`path`,{d:`M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1`}],[`path`,{d:`M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4`}]],e.WashingMachine=[[`path`,{d:`M3 6h3`}],[`path`,{d:`M17 6h.01`}],[`rect`,{width:`18`,height:`20`,x:`3`,y:`2`,rx:`2`}],[`circle`,{cx:`12`,cy:`13`,r:`5`}],[`path`,{d:`M12 18a2.5 2.5 0 0 0 0-5 2.5 2.5 0 0 1 0-5`}]],e.Wifi=[[`path`,{d:`M12 20h.01`}],[`path`,{d:`M2 8.82a15 15 0 0 1 20 0`}],[`path`,{d:`M5 12.859a10 10 0 0 1 14 0`}],[`path`,{d:`M8.5 16.429a5 5 0 0 1 7 0`}]],e.Wrench=[[`path`,{d:`M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z`}]],e.X=[[`path`,{d:`M18 6 6 18`}],[`path`,{d:`m6 6 12 12`}]],e.Zap=[[`path`,{d:`M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z`}]]}))(),rt={AlertTriangle:M.AlertTriangle,ArrowDownRight:M.ArrowDownRight,ArrowLeft:M.ArrowLeft,ArrowRight:M.ArrowRight,ArrowUpRight:M.ArrowUpRight,BadgeCheck:M.BadgeCheck,Banknote:M.Banknote,BedDouble:M.BedDouble,Building2:M.Building2,Calendar:M.Calendar,CalendarClock:M.CalendarClock,CalendarDays:M.CalendarDays,Car:M.Car,Check:M.Check,CheckCircle2:M.CheckCircle2,ChevronDown:M.ChevronDown,ChevronLeft:M.ChevronLeft,ChevronRight:M.ChevronRight,ChevronUp:M.ChevronUp,Circle:M.Circle,CircleAlert:M.CircleAlert,CircleCheck:M.CircleCheck,CircleDollarSign:M.CircleDollarSign,CirclePlus:M.CirclePlus,CircleX:M.CircleX,ClipboardList:M.ClipboardList,Clock:M.Clock,Coffee:M.Coffee,Coins:M.Coins,Copy:M.Copy,CreditCard:M.CreditCard,DatabaseBackup:M.DatabaseBackup,DoorClosed:M.DoorClosed,DoorOpen:M.DoorOpen,Download:M.Download,Droplets:M.Droplets,ExternalLink:M.ExternalLink,Eye:M.Eye,EyeOff:M.EyeOff,FilePlus2:M.FilePlus2,FileText:M.FileText,Filter:M.Filter,Globe2:M.Globe2,HandCoins:M.HandCoins,House:M.House,Image:M.Image,Info:M.Info,Inbox:M.Inbox,KeyRound:M.KeyRound,Landmark:M.Landmark,Laptop:M.Laptop,LayoutDashboard:M.LayoutDashboard,LayoutGrid:M.LayoutGrid,List:M.List,Loader2:M.Loader2,Lock:M.Lock,LockKeyhole:M.LockKeyhole,LogIn:M.LogIn,LogOut:M.LogOut,MapPin:M.MapPin,Menu:M.Menu,MessageCircle:M.MessageCircle,MessageSquare:M.MessageSquare,MessageSquareText:M.MessageSquareText,Minus:M.Minus,Package:M.Package,ShoppingCart:M.ShoppingCart,MoreVertical:M.MoreVertical,Pencil:M.Pencil,Percent:M.Percent,Phone:M.Phone,PhoneCall:M.PhoneCall,PhoneOutgoing:M.PhoneOutgoing,PieChart:M.PieChart,Plus:M.Plus,Printer:M.Printer,Receipt:M.Receipt,ReceiptText:M.ReceiptText,Refrigerator:M.Refrigerator,RefreshCw:M.RefreshCw,Repeat:M.Repeat,RotateCcw:M.RotateCcw,Save:M.Save,ScrollText:M.ScrollText,Search:M.Search,SearchX:M.SearchX,Send:M.Send,Settings:M.Settings,ShieldCheck:M.ShieldCheck,SlidersHorizontal:M.SlidersHorizontal,Snowflake:M.Snowflake,Sofa:M.Sofa,Sparkles:M.Sparkles,Tags:M.Tags,Trash2:M.Trash2,TrendingDown:M.TrendingDown,TrendingUp:M.TrendingUp,Unlock:M.Unlock,Upload:M.Upload,UploadCloud:M.UploadCloud,UserCheck:M.UserCheck,UserCog:M.UserCog,UserPlus:M.UserPlus,UserRound:M.UserRound,Users:M.Users,Utensils:M.Utensils,Wallet:M.Wallet,WashingMachine:M.WashingMachine,Wifi:M.Wifi,Wrench:M.Wrench,X:M.X,Zap:M.Zap};function it(e={}){return Object.entries(e).map(([e,t])=>`${e}="${String(t).replace(/"/g,`&quot;`)}"`).join(` `)}function N(e,t=`w-5 h-5`,n=2){let r=rt[e];return r?`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${n}" stroke-linecap="round" stroke-linejoin="round" class="${t}" aria-hidden="true" focusable="false">${r.map(([e,t])=>`<${e} ${it(t)} />`).join(``)}</svg>`:``}Object.keys(rt);var at={"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`};function P(e){return String(e??``).replace(/[&<>"']/g,e=>at[e])}function F(e,t,n,r){let i=t=>{let i=t.target.closest(n);i&&e.contains(i)&&r(t,i)};return e.addEventListener(t,i),()=>e.removeEventListener(t,i)}function ot(e,t,n=`application/json`){let r=new Blob([t],{type:n}),i=URL.createObjectURL(r),a=document.createElement(`a`);a.href=i,a.download=e,document.body.appendChild(a),a.click(),a.remove(),setTimeout(()=>URL.revokeObjectURL(i),1e3)}function st(e){return new Promise((t,n)=>{let r=new FileReader;r.onload=()=>t(String(r.result||``)),r.onerror=()=>n(r.error),r.readAsText(e)})}function ct(e,{maxDimension:t=900,quality:n=.62}={}){return new Promise((r,i)=>{if(!e||!/^image\/(jpeg|png|webp)$/.test(e.type)){i(Error(`Pilih foto berformat JPG, PNG, atau WebP.`));return}if(e.size>12582912){i(Error(`Ukuran file foto maksimal 12 MB.`));return}let a=URL.createObjectURL(e),o=new Image;o.onload=()=>{try{let e=Math.min(1,t/Math.max(o.width,o.height)),i=Math.max(1,Math.round(o.width*e)),s=Math.max(1,Math.round(o.height*e)),c=document.createElement(`canvas`);c.width=i,c.height=s;let l=c.getContext(`2d`);l.fillStyle=`#ffffff`,l.fillRect(0,0,i,s),l.drawImage(o,0,0,i,s);let u=n,d=c.toDataURL(`image/jpeg`,u);for(;d.length>38e4&&u>.32;)u-=.07,d=c.toDataURL(`image/jpeg`,u);URL.revokeObjectURL(a),r(d)}catch(e){URL.revokeObjectURL(a),i(e)}},o.onerror=()=>{URL.revokeObjectURL(a),i(Error(`Gagal membaca file foto.`))},o.src=a})}function I(e,t,n=`Memproses…`){e&&(t?(e.dataset.originalHtml=e.innerHTML,e.disabled=!0,e.textContent=n):(e.disabled=!1,e.dataset.originalHtml&&(e.innerHTML=e.dataset.originalHtml,delete e.dataset.originalHtml)))}var lt={success:{icon:`CheckCircle2`,color:`text-emerald-400`,border:`border-emerald-500/30`},error:{icon:`CircleX`,color:`text-rose-400`,border:`border-rose-500/30`},warning:{icon:`AlertTriangle`,color:`text-amber-400`,border:`border-amber-500/30`},info:{icon:`Info`,color:`text-sky-400`,border:`border-sky-500/30`}};function L(e,t=`success`,n=3400){let r=document.getElementById(`toast-root`);if(!r)return;let i=lt[t]||lt.success,a=document.createElement(`div`);a.className=`pointer-events-auto flex items-start gap-3 rounded-2xl border ${i.border} bg-stone-900 px-4 py-3 text-sm font-semibold text-white shadow-2xl transition duration-200 translate-y-2 opacity-0`,a.setAttribute(`role`,`status`),a.innerHTML=`
    <span class="shrink-0 ${i.color}">${N(i.icon,`w-5 h-5`)}</span>
    <span class="leading-snug">${P(e)}</span>
  `,r.appendChild(a),requestAnimationFrame(()=>{a.classList.remove(`translate-y-2`,`opacity-0`)}),setTimeout(()=>{a.classList.add(`translate-y-2`,`opacity-0`),setTimeout(()=>a.remove(),250)},n)}var ut=[`propertyName`,`tagline`,`description`,`address`,`whatsapp`,`email`,`mapsUrl`,`mapsEmbedUrl`,`facilities`,`catalogAdminKey`,`paymentInstructions`],dt=[`dokuEnabled`];function ft(e){return String(e??``).trim()}function R(){return w().settings||{}}function pt(e={}){return T(t=>{t.settings=t.settings||{};for(let n of ut)e[n]!==void 0&&(t.settings[n]=ft(e[n]));for(let n of dt)e[n]!==void 0&&(t.settings[n]=!!e[n])}),R()}function mt(){return(R().facilities||``).split(/[\n,;]+/).map(e=>e.trim()).filter(Boolean)}function z(){return!!R().dokuEnabled}var ht=15e3,gt=!1,B=!1,_t=0,vt=!1,yt=!1,bt=!1,xt=null,St=null,Ct=``,wt=null,Tt=!1;function Et(){document.visibilityState===`visible`&&Mt()}function Dt(){return String(R().catalogAdminKey||``).trim()}function Ot(e){let t=JSON.parse(JSON.stringify(e));return delete t.users,delete t.session,t.settings&&delete t.settings.catalogAdminKey,Array.isArray(t.rooms)&&(t.rooms=t.rooms.map(e=>{let t=String(e.photo||``);return{...e,photo:t.startsWith(`data:image/`)?``:t}})),Array.isArray(t.gallery)&&(t.gallery=t.gallery.map(e=>{let t=String(e.photo||``);return{...e,photo:t.startsWith(`data:image/`)?``:t}})),t}function kt(e){let t=w(),n=new Map((t.rooms||[]).filter(e=>e.photo).map(e=>[String(e.id),e.photo])),r=new Map((t.gallery||[]).filter(e=>e.photo).map(e=>[String(e.id),e.photo]));return{...e,users:t.users,session:t.session,settings:{...e.settings||{},catalogAdminKey:t.settings?.catalogAdminKey||``},rooms:(e.rooms||[]).map(e=>({...e,photo:n.get(String(e.id))||``})),gallery:(e.gallery||[]).map(e=>({...e,photo:r.get(String(e.id))||e.photo||``}))}}function At(e,t){let n=new Set((e.bills||[]).filter(e=>e.status===`paid`).map(e=>String(e.id))),r=(t.bills||[]).filter(e=>e.status===`paid`&&!n.has(String(e.id))),i=new Set((e.manualInvoices||[]).filter(e=>e.status===`paid`).map(e=>String(e.id))),a=(t.manualInvoices||[]).filter(e=>e.status===`paid`&&!i.has(String(e.id)));if(r.length){let e=r[0];L(`Pembayaran DOKU diterima: ${e.tenantName||`penghuni`} • ${O(e.amount)}`)}else if(a.length){let e=a[0];L(`Invoice lunas via DOKU: ${e.tenantName||`penghuni`} • ${O(e.amount)}`)}else for(let n of t.tenants||[]){let t=(e.tenants||[]).find(e=>String(e.id)===String(n.id));if(t&&n.endDate&&n.endDate>(t.endDate||``)){L(`Kontrak ${n.name} otomatis diperpanjang sampai ${n.endDate}.`);return}}}function jt(e,{notify:t=!0}={}){let n=w(),r=kt(e);vt=!0;try{Oe(r)}finally{vt=!1}B=!0,t&&At(n,r)}async function Mt(){let e=Dt();if(e&&!bt&&!(B&&(yt||xt))){bt=!0;try{let t=await fetch(`/api/state`,{headers:{Accept:`application/json`,"x-admin-key":e},cache:`no-store`}),n=t.headers.get(`content-type`)||``;if(!t.ok||!n.includes(`application/json`)){t.status===401&&!Tt&&(Tt=!0,L(`Kunci admin tidak valid. Periksa Pengaturan.`,`error`));return}Tt=!1;let r=await t.json();if(!r?.exists){B=!1,_t=0,await Nt({initial:!0});return}let i=Number(r.version)||0;if(!B){let e=Date.parse(w().meta?.updatedAt||0),t=Date.parse(r.state?.meta?.updatedAt||0);_t=i,t>e?jt(r.state):(B=!0,await Nt());return}i>_t&&(_t=i,jt(r.state))}catch(e){console.warn(`[sync] gagal mengambil data server`,e)}finally{bt=!1}}}async function Nt({initial:e=!1}={}){let t=Dt();if(t&&!yt){if(clearTimeout(xt),xt=null,bt)clearTimeout(xt),xt=setTimeout(()=>Nt({initial:e}),500);else if(!(!B&&!e&&(await Mt(),!B))){yt=!0;try{let e=await fetch(`/api/state`,{method:`PUT`,headers:{"Content-Type":`application/json`,"x-admin-key":t},body:JSON.stringify({state:Ot(w()),baseVersion:_t})});if(!(e.headers.get(`content-type`)||``).includes(`application/json`)){console.warn("[sync] API state tidak tersedia. Gunakan production atau `vercel dev`.");return}let n=await e.json().catch(()=>({}));if(e.status===409&&n?.conflict){_t=Number(n.version)||_t,n.state&&jt(n.state),L(`Data dari server baru saja diperbarui. Perubahan lokal terakhir mungkin perlu diulang.`,`warning`);return}if(!e.ok){console.warn(`[sync] gagal menyimpan state`,n);return}_t=Number(n.version)||_t,B=!0}catch(e){console.warn(`[sync] gagal mengirim state`,e)}finally{yt=!1}}}}function Pt(){if(vt)return;let e=Dt();e===Ct?e&&B&&(clearTimeout(xt),xt=setTimeout(()=>Nt(),700)):(Ct=e,B=!1,_t=0,e&&Mt())}function Ft(){gt||(gt=!0,Ct=Dt(),wt=Ee(Pt),window.addEventListener(`focus`,Et),document.addEventListener(`visibilitychange`,Et),St=setInterval(()=>{document.visibilityState===`visible`&&Mt()},ht),Ct&&Mt())}function It(){gt&&(gt=!1,B=!1,_t=0,clearTimeout(xt),clearInterval(St),window.removeEventListener(`focus`,Et),document.removeEventListener(`visibilitychange`,Et),wt?.(),wt=null)}function Lt(){Dt()&&Mt()}async function Rt(){if(!Dt())return!1;gt||Ft();for(let e=0;e<4&&!B;e+=1)bt||yt?await new Promise(e=>setTimeout(e,300)):(await Mt(),B||await Nt({initial:!0}));return B&&(yt&&await new Promise(e=>setTimeout(e,300)),await Nt()),B}var zt={sm:`sm:max-w-md`,md:`sm:max-w-lg`,lg:`sm:max-w-2xl`,xl:`sm:max-w-4xl`,full:`sm:max-w-6xl`},Bt=[],Vt=null;function Ht(e){return Array.from(e.querySelectorAll(`a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])`)).filter(e=>e.offsetParent!==null)}function Ut(e){if(!Bt.length)return;let t=Bt[Bt.length-1];if(e.key===`Escape`&&t.dismissible)e.preventDefault(),t.close();else if(e.key===`Tab`){let n=Ht(t.panel);if(!n.length)return;let r=n[0],i=n[n.length-1];e.shiftKey&&document.activeElement===r?(e.preventDefault(),i.focus()):!e.shiftKey&&document.activeElement===i&&(e.preventDefault(),r.focus())}}document.addEventListener(`keydown`,Ut);function V({title:e=``,subtitle:t=``,body:n=``,footer:r=``,size:i=`md`,dismissible:a=!0,onMount:o,onClose:s}={}){let c=document.getElementById(`modal-root`);if(!c)throw Error(`modal-root tidak ditemukan`);Bt.length||(Vt=document.activeElement,document.body.classList.add(`overflow-hidden`));let l=document.createElement(`div`);l.className=`modal-backdrop`,l.innerHTML=`
    <div class="modal-panel ${zt[i]||zt.md}" role="dialog" aria-modal="true" aria-label="${P(e)}">
      <div class="modal-head">
        <div class="min-w-0">
          <h2 class="text-lg font-extrabold text-stone-800 leading-tight truncate">${e}</h2>
          ${t?`<p class="text-xs text-stone-500 mt-0.5">${t}</p>`:``}
        </div>
        ${a?`<button type="button" class="btn-ghost btn-sm shrink-0" data-modal-close aria-label="Tutup dialog">${N(`X`,`w-5 h-5`)}</button>`:``}
      </div>
      <div class="modal-body">${n}</div>
      ${r?`<div class="modal-foot">${r}</div>`:``}
    </div>
  `;let u=l.querySelector(`.modal-panel`),d=!1,f=()=>{if(d)return;d=!0;let e=Bt.findIndex(e=>e.wrap===l);e>=0&&Bt.splice(e,1),l.remove(),Bt.length||(document.body.classList.remove(`overflow-hidden`),Vt&&typeof Vt.focus==`function`&&Vt.focus({preventScroll:!0}),Vt=null),s?.()},p={el:l,panel:u,close:f,dismissible:a};return Bt.push(p),l.addEventListener(`mousedown`,e=>{e.target===l&&a&&f()}),l.querySelectorAll(`[data-modal-close]`).forEach(e=>{e.addEventListener(`click`,f)}),c.appendChild(l),o?.(l,f),requestAnimationFrame(()=>{(u.querySelector(`.modal-body input:not([type="hidden"]), .modal-body select, .modal-body textarea`)||u.querySelector(`.modal-foot .btn-primary, .modal-foot .btn-danger, .modal-foot button`)||u.querySelector(`[data-modal-close]`))?.focus({preventScroll:!0})}),p}function Wt(){[...Bt].reverse().forEach(e=>e.close())}function H({title:e=`Konfirmasi`,message:t=`Apakah Anda yakin?`,confirmText:n=`Ya, Lanjutkan`,cancelText:r=`Batal`,danger:i=!1,iconName:a=`AlertTriangle`}={}){return new Promise(o=>{let s=!1,c=e=>{s||(s=!0,o(e))};V({title:e,size:`sm`,body:`
        <div class="flex items-start gap-3.5">
          <div class="w-11 h-11 rounded-2xl shrink-0 flex items-center justify-center ${i?`bg-rose-50 text-rose-600`:`bg-amber-50 text-amber-600`}">
            ${N(a,`w-6 h-6`)}
          </div>
          <div class="text-sm text-stone-600 leading-relaxed pt-0.5">${t}</div>
        </div>
      `,footer:`
        <button type="button" class="btn-outline btn-sm" data-cancel>${P(r)}</button>
        <button type="button" class="${i?`btn-danger`:`btn-primary`} btn-sm" data-confirm>${P(n)}</button>
      `,onMount(e,t){e.querySelector(`[data-cancel]`).addEventListener(`click`,()=>{c(!1),t()}),e.querySelector(`[data-confirm]`).addEventListener(`click`,()=>{c(!0),t()})},onClose(){c(!1)}})})}var Gt=`casa-ramire:booking-requests`;function Kt(){return String(R().catalogAdminKey||``).trim()}function qt(){let e=xe.get(Gt);return Array.isArray(e)?e:[]}function Jt(e){xe.set(Gt,e)}function Yt(){return`LOCAL-${Date.now().toString(36).toUpperCase()}`}function Xt(e,t){let n=Error(String(e?.error||t));return n.code=e?.code||``,n}async function Zt(e){let t;try{t=await fetch(`/api/bookings`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(e)})}catch(t){return Qt(e,t)}if(!(t.headers.get(`content-type`)||``).includes(`application/json`))return Qt(e,Error(`API booking tidak tersedia.`));let n=await t.json().catch(()=>({}));if(!t.ok)throw Xt(n,`Gagal mengirim booking.`);if(!n?.request)throw Error(`Server tidak mengembalikan data booking.`);return{...n.request,source:`server`}}function Qt(e,t){let n=new Date().toISOString(),r={id:`local-${Date.now()}`,code:Yt(),status:`pending`,source:`local`,createdAt:n,updatedAt:n,...e},i=qt();return i.unshift(r),Jt(i),r.offline=!0,r.offlineReason=t?.message||``,r}async function $t({status:e=``}={}){let t=Kt(),n=qt().map(e=>({...e,source:`local`}));if(!t)return{requests:n,offline:!0,reason:`Kunci admin belum diisi.`,promos:[]};let r;try{r=await fetch(`/api/bookings${e?`?status=${encodeURIComponent(e)}`:``}`,{headers:{Accept:`application/json`,"x-admin-key":t},cache:`no-store`})}catch(e){return{requests:n,offline:!0,reason:e.message,promos:[]}}if(!(r.headers.get(`content-type`)||``).includes(`application/json`))return{requests:n,offline:!0,reason:`API booking tidak tersedia.`,promos:[]};let i=await r.json().catch(()=>({}));if(!r.ok)return{requests:n,offline:!0,reason:String(i.error||`Gagal memuat booking online.`),promos:[]};let a=(Array.isArray(i.requests)?i.requests:[]).map(e=>({...e,source:`server`}));return{requests:[...n,...a].sort((e,t)=>String(t.createdAt).localeCompare(String(e.createdAt))),offline:!1,reason:``,promos:Array.isArray(i.promos)?i.promos:[]}}async function en({id:e,code:t,status:n,source:r}){if(r===`local`||String(t||``).startsWith(`LOCAL-`))return Jt(qt().map(t=>String(t.id)===String(e)?{...t,status:n,updatedAt:new Date().toISOString()}:t)),{ok:!0};let i=Kt();if(!i)throw Error(`Kunci admin belum diisi.`);let a=await fetch(`/api/bookings`,{method:`PATCH`,headers:{"Content-Type":`application/json`,"x-admin-key":i},body:JSON.stringify({id:e,status:n})});if(!(a.headers.get(`content-type`)||``).includes(`application/json`))throw Error(`API booking tidak tersedia.`);let o=await a.json().catch(()=>({}));if(!a.ok)throw Xt(o,`Gagal memperbarui booking.`);return o}function tn(e){return String(e)===`3`?`lantai3`:`lantai2`}function nn(e){return w().pricing[tn(e)]||{}}function rn(e,t){return D(nn(e)?.[t])}function an(){return D(w().settings?.depositDefault)||5e5}function on(e){return l.find(t=>t.key===String(e))||l[0]}function sn({periode:e,startDate:t,endDate:n}){let r=on(e),i=qe(t)?t:k();return r.kind===`months`?Je(i,r.months):r.kind===`days`?n&&Ye(i,n)>0?n:A(i,1):n&&Ye(i,n)>0?n:A(i,7)}function cn(e,t,n){if(e.kind===`months`)return e.months;let r=Math.max(1,Ye(t,n));return e.kind===`days`?r:Math.max(1,Math.ceil(r/7))}function ln(e,t){return t?t.type===`persen`?e*D(t.value)/100:D(t.value):0}function un({lantai:e,periode:t,startDate:n,endDate:r,promo:i=null,addons:a=[],depositEnabled:o=!1,depositValue:s=0,depositPaid:c=!0,payOption:l=`partial`}){let u=on(t),d=qe(n)?n:k(),f=sn({periode:u.key,startDate:d,endDate:r});if(u.kind!==`months`&&Ye(d,f)<=0)throw Error(`Tanggal selesai harus setelah tanggal mulai.`);let p=rn(e,u.key);if(!p)throw Error(`Tarif untuk periode ini belum diatur di Pricelist.`);let m=cn(u,d,f),h=u.kind===`months`?p:p*m,g=i?i.type===`persen`?h*D(i.value)/100:D(i.value)*(u.kind===`months`?u.months:1):0,_=Math.min(h,Math.max(0,Math.round(g))),v=(a||[]).reduce((e,t)=>e+D(t.price),0),y=u.kind===`months`?v*u.months:v,b=Math.max(0,h-_),x=b+y,S=o?Math.max(0,Math.round(D(s))):0,C=c?S:0,ee=Math.max(0,S-C),te=l===`full`,ne=rn(e,`1`)||Math.round(h/Math.max(1,m)),re=Math.max(0,Math.round(ne-ln(ne,i)))+v;return{periode:u.key,periodLabel:u.label,unitLabel:u.unit,units:m,startDate:d,endDate:f,rate:p,base:h,discount:_,rentTotal:b,addonMonthly:v,addonTotal:y,grandTotal:x,deposit:S,depositPaid:!!c,depositPaidAmount:C,depositOutstanding:ee,payOption:te?`full`:`partial`,payNow:C+(te?x:0),rentPaidNow:te?x:0,remaining:te?0:x,monthlyCharge:re,promo:i?{id:i.id,name:i.name,type:i.type,value:D(i.value)}:null}}function dn({activeOnly:e=!1}={}){let t=w().promos||[];return e?t.filter(e=>e.active):t}function fn(e){return e==null||e===``||e===`none`?null:w().promos.find(t=>String(t.id)===String(e)&&t.active)||null}function pn(e){return String(e||``).toUpperCase().replace(/[^A-Z0-9-]/g,``).slice(0,24)}function mn(e){let t=pn(e);return t&&(w().promos||[]).find(e=>e.active&&pn(e.code)===t)||null}function hn(e=[]){if(!Array.isArray(e)||!e.length)return;let t=new Map(e.map(e=>[pn(e.code),e]).filter(([e])=>e));(w().promos||[]).some(e=>{let n=t.get(pn(e.code));return n?Number(n.maxUses||0)!==Number(e.maxUses||0)||Number(n.usedCount||0)!==Number(e.usedCount||0):!1})&&T(e=>{for(let n of e.promos||[]){let e=t.get(pn(n.code));e&&(n.maxUses=Math.max(0,Number(e.maxUses)||0),n.usedCount=Math.max(0,Number(e.usedCount)||0))}})}function gn(){return{id:`car-parking`,name:a,price:i}}function _n(e=[]){return e.some(e=>String(e?.id)===`car-parking`||String(e?.name||``).toLowerCase()===`parkir mobil`)}function vn({id:e=null,name:t,code:n,type:r,value:i,active:a=!0,maxUses:o=0}){let s=String(t||``).trim();if(!s)throw Error(`Nama promo wajib diisi.`);if(![`rupiah`,`persen`].includes(r))throw Error(`Tipe diskon tidak valid.`);let c=D(i);if(c<=0)throw Error(`Nilai diskon harus lebih dari 0.`);if(r===`persen`&&c>100)throw Error(`Diskon persen maksimal 100%.`);let l=pn(n);if(l.length<3)throw Error(`Kode promo minimal 3 karakter (huruf/angka).`);if((w().promos||[]).find(t=>String(t.id)!==String(e)&&pn(t.code)===l))throw Error(`Kode promo ${l} sudah dipakai promo lain.`);let u=Math.max(0,Math.round(D(o)));T(t=>{if(e){let n=t.promos.find(t=>String(t.id)===String(e));if(!n)throw Error(`Promo tidak ditemukan.`);Object.assign(n,{name:s,code:l,type:r,value:c,active:!!a,maxUses:u,usedCount:Math.max(0,Number(n.usedCount)||0)})}else t.promos.push({id:E(t.promos),name:s,code:l,type:r,value:c,active:!!a,maxUses:u,usedCount:0})})}function yn(e){T(t=>{t.promos=t.promos.filter(t=>String(t.id)!==String(e))})}function bn(e){T(t=>{let n=t.promos.find(t=>String(t.id)===String(e));n&&(n.active=!n.active)})}function xn(e,t){let n=tn(e),r={...w().pricing[n]||{}};for(let e of l.map(e=>e.key)){let n=D(t?.[e]);if(n<=0)throw Error(`Semua tarif harus lebih dari 0.`);r[e]=n}T(e=>{e.pricing[n]=r})}var Sn={kosong:`Tersedia`,booking:`Booking`,terisi:`Terisi`};function Cn(e){return Array.isArray(e)?e:[]}function wn(e){return[...e].sort((e,t)=>String(e.nomor).localeCompare(String(t.nomor),void 0,{numeric:!0}))}function Tn({includeLocalPhotos:e=!1}={}){let t=w(),n=t.settings||{},r=wn(Cn(t.rooms)),i=r.filter(e=>e.status===`kosong`).length,a=r.filter(e=>e.status===`terisi`).length,o=r.filter(e=>e.status===`booking`).length;return{version:2,generatedAt:new Date().toISOString(),property:{name:String(n.propertyName||`Casa Ramire`).trim(),tagline:String(n.tagline||``).trim(),description:String(n.description||``).trim(),address:String(n.address||``).trim(),whatsapp:String(n.whatsapp||``).trim(),email:String(n.email||``).trim(),mapsUrl:String(n.mapsUrl||``).trim(),mapsEmbedUrl:String(n.mapsEmbedUrl||``).trim(),facilities:mt(),deposit:Number(n.depositDefault)||5e5},pricing:{lantai2:{...t.pricing?.lantai2||{}},lantai3:{...t.pricing?.lantai3||{}}},availability:{total:r.length,available:i,occupied:a,booked:o},gallery:Cn(t.gallery).map(t=>({id:t.id,caption:String(t.caption||``).trim(),url:e?t.photo||t.photoUrl||``:t.photoUrl||``})),promos:Cn(t.promos).filter(e=>e.active&&e.code).map(e=>({code:String(e.code||``).toUpperCase(),name:String(e.name||``),type:e.type===`persen`?`persen`:`rupiah`,value:Number(e.value)||0,maxUses:Math.max(0,Number(e.maxUses)||0),usedCount:Math.max(0,Number(e.usedCount)||0)})),rooms:r.map(e=>({id:e.id,nomor:e.nomor,lantai:e.lantai,status:e.status,statusLabel:Sn[e.status]||`Tersedia`,priceMonthly:rn(e.lantai,`1`)}))}}async function En(e,t){let n=await fetch(`/api/catalog/photo`,{method:`POST`,headers:{"Content-Type":`application/json`,"x-admin-key":e},body:JSON.stringify({dataUrl:t})}),r=n.headers.get(`content-type`)||``,i=r.includes(`application/json`)?await n.json().catch(()=>({})):{};if(!n.ok||!r.includes(`application/json`)||!i.url)throw Error(i.error||"Gagal mengunggah foto katalog. Pastikan API berjalan di production atau `vercel dev`.");return i.url}async function Dn({adminKey:e,onProgress:t}={}){let n=String(e||``).trim();if(!n)throw Error(`Kunci publikasi katalog belum diisi di Pengaturan.`);let r=w(),i=[...r.rooms.filter(e=>typeof e.photo==`string`&&e.photo.startsWith(`data:image/`)).map(e=>({kind:`room`,id:e.id,photo:e.photo,label:`Mengunggah foto kamar ${e.nomor}…`})),...(r.gallery||[]).filter(e=>typeof e.photo==`string`&&e.photo.startsWith(`data:image/`)).map((e,t)=>({kind:`gallery`,id:e.id,photo:e.photo,label:`Mengunggah foto galeri ${t+1}…`}))],a=[],o=0;for(let e of i){o+=1,t?.({current:o,total:i.length,label:e.label});let r=await En(n,e.photo);a.push({...e,url:r})}a.length&&T(e=>{for(let t of a){if(t.kind===`gallery`){let n=(e.gallery||[]).find(e=>String(e.id)===String(t.id));n&&(n.photoUrl=t.url,n.photo=``);continue}let n=e.rooms.find(e=>String(e.id)===String(t.id));n&&(n.photoUrl=t.url,n.photo=``)}}),t?.({current:i.length,total:i.length,label:`Menyimpan katalog…`});let s=Tn(),c=await fetch(`/api/catalog`,{method:`PUT`,headers:{"Content-Type":`application/json`,"x-admin-key":n},body:JSON.stringify({catalog:s})}),l=c.headers.get(`content-type`)||``,u=l.includes(`application/json`)?await c.json().catch(()=>({})):{};if(!c.ok||!l.includes(`application/json`))throw Error(u.error||"Gagal mempublikasikan katalog. Pastikan API berjalan di production atau `vercel dev`.");let d=u.updatedAt||new Date().toISOString();return Array.isArray(u.promos)&&u.promos.length&&hn(u.promos),T(e=>{e.settings=e.settings||{},e.settings.catalogPublishedAt=d}),{updatedAt:d,uploadedPhotos:a.length}}async function On(){let e=await fetch(`/api/catalog`,{headers:{Accept:`application/json`},cache:`no-store`}),t=e.headers.get(`content-type`)||``;if(!e.ok||!t.includes(`application/json`))return null;let n=await e.json();return!n?.published||!n.catalog?null:n.catalog}async function kn(){try{let e=await fetch(`/api/availability`,{headers:{Accept:`application/json`},cache:`no-store`}),t=e.headers.get(`content-type`)||``;if(!e.ok||!t.includes(`application/json`))return null;let n=await e.json().catch(()=>null);return!n?.exists||!n.availability?null:{availability:n.availability,rooms:Array.isArray(n.rooms)?n.rooms:[]}}catch{return null}}function An(){return String(R().catalogAdminKey||``).trim()}function jn(e){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(e||``).trim())}function Mn(e,t,n){return`mailto:${String(e||``).trim()}?${`subject=${encodeURIComponent(t)}&body=${encodeURIComponent(n)}`}`}function Nn(e,t,n){window.location.href=Mn(e,t,n)}async function Pn({to:e,subject:t,text:n}){let r=String(e||``).trim();if(!jn(r))throw Error(`Alamat email penerima tidak valid.`);let i=An();if(!i){let e=Error(`Kunci admin belum diisi. Buka Pengaturan terlebih dahulu.`);throw e.code=`EMAIL_NOT_CONFIGURED`,e}let a;try{a=await fetch(`/api/email/send`,{method:`POST`,headers:{"Content-Type":`application/json`,"x-admin-key":i},body:JSON.stringify({to:r,subject:t,text:n})})}catch{let e=Error(`Layanan email tidak dapat dihubungi.`);throw e.code=`EMAIL_NOT_CONFIGURED`,e}if(!(a.headers.get(`content-type`)||``).includes(`application/json`)){let e=Error(`Layanan email belum tersedia di server.`);throw e.code=`EMAIL_NOT_CONFIGURED`,e}let o=await a.json().catch(()=>({}));if(!a.ok){let e=Error(String(o.error||`Gagal mengirim email.`));throw e.code=o.code||(a.status===503?`EMAIL_NOT_CONFIGURED`:``),e}return o}function Fn(){return String(R().propertyName||`Casa Ramire`)}function In(){let e=R();return[``,Fn(),e.address?String(e.address):``,e.whatsapp?`WhatsApp: ${e.whatsapp}`:``,e.email?`Email: ${e.email}`:``].filter(Boolean).join(`
`)}function Ln({name:e,title:t,invoiceNumber:n,amount:r,dueDate:i,description:a,paymentUrl:o,expiresAt:s,paymentInstructions:c}){let l=`${t} — ${Fn()}`,u=String(c||``).trim();return{subject:l,text:[`Halo ${e||`Kak`},`,``,`${t}${n?` (${n})`:``}`,a?String(a):null,`Nominal: ${O(r)}`,i?`Jatuh tempo: ${j(i)}`:null,s?`Berlaku sampai: ${s}`:null,``,o?`Silakan lakukan pembayaran melalui link berikut:`:u||`Silakan lakukan pembayaran melalui transfer bank atau QRIS. Setelah membayar, kirim bukti pembayaran ke admin Casa Ramire.`,o||null,``,o?`Status pembayaran akan diperbarui otomatis setelah pembayaran berhasil.`:`Pembayaran akan diverifikasi oleh admin. Simpan pesan ini sebagai bukti tagihan.`,...In().split(`
`)].filter(e=>e!=null).join(`
`)}}async function Rn(e){let{subject:t,text:n}=Ln(e);try{return await Pn({to:e.to,subject:t,text:n}),{sent:!0,fallback:!1}}catch(r){if(r.code===`EMAIL_NOT_CONFIGURED`)return Nn(e.to,t,n),{sent:!1,fallback:!0,error:r};throw r}}var zn=Rn;function Bn(e=`w-10 h-10`){return`
    <svg viewBox="0 0 100 100" class="${e}" aria-hidden="true" focusable="false">
      <path d="M 20,40 L 50,15 L 80,40 L 80,80 L 20,80 Z" fill="none" stroke="#d4a359" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 50,65 Q 40,50 30,45 Q 45,45 50,65 Z" fill="#ffffff"/>
      <path d="M 50,65 Q 50,40 55,30 Q 65,45 50,65 Z" fill="#ffffff"/>
      <path d="M 50,65 Q 60,50 70,48 Q 60,60 50,65 Z" fill="#ffffff"/>
      <path d="M 50,65 Q 55,75 65,72 Q 55,80 50,65 Z" fill="#ffffff"/>
      <path d="M 50,65 L 45,75" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
    </svg>
  `}function Vn(e=`w-10 h-10 rounded-2xl`,t={}){let{light:n=!1}=t;return`
    <div class="${e} ${n?`bg-white/10`:`bg-brand`} flex items-center justify-center p-1.5 shadow-sm border border-gold/30 shrink-0">
      ${Bn(`w-full h-full`)}
    </div>
  `}function Hn({iconName:e,title:t,description:n,body:r}){return`
    <section class="card p-5">
      <div class="flex items-start gap-3">
        <span class="w-10 h-10 rounded-xl bg-brand-50 text-brand flex items-center justify-center shrink-0">
          ${N(e,`w-5 h-5`)}
        </span>
        <div class="min-w-0 flex-1">
          <h2 class="font-extrabold text-stone-800 text-sm">${t}</h2>
          <p class="text-xs text-stone-500 mt-0.5">${n}</p>
          <div class="mt-4">${r}</div>
        </div>
      </div>
    </section>
  `}function Un(){if(!Me())return;let e=w(),t=e.settings||{},n=Ne();V({title:`Pengaturan`,subtitle:`Akun, cadangan data, dan pemeliharaan sistem`,size:`lg`,body:`
      <div class="space-y-4">
        ${Hn({iconName:`KeyRound`,title:`Keamanan akun`,description:`Ganti password Anda secara berkala.`,body:`
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
                ${N(`Check`,`w-4 h-4`)} Simpan password
              </button>
            </form>
          `})}

        ${Hn({iconName:`DatabaseBackup`,title:`Cadangan & pemulihan data`,description:`Terakhir diperbarui: ${Ze(e.meta?.updatedAt)}`,body:`
            <div class="flex flex-wrap gap-2">
              <button type="button" class="btn-outline btn-sm" data-action="export-backup">
                ${N(`Download`,`w-4 h-4`)} Unduh backup JSON
              </button>
              <label class="btn-outline btn-sm cursor-pointer">
                ${N(`Upload`,`w-4 h-4`)} Pulihkan dari file
                <input type="file" accept="application/json,.json" class="hidden" data-import-input />
              </label>
            </div>
            <p class="hint mt-2">Backup mencakup seluruh data kamar, penghuni, tagihan, pengeluaran, dan pengaturan. Simpan file di tempat aman.</p>
          `})}

        ${Hn({iconName:`Globe2`,title:`Landing page & katalog publik`,description:`Atur informasi yang tampil di casaramire.com dan publikasikan katalog kamar.`,body:`
            <form id="settings-catalog-form" class="space-y-3">
              <div class="grid sm:grid-cols-2 gap-3">
                <div>
                  <label class="label" for="set-wa">Nomor WhatsApp admin</label>
                  <input id="set-wa" type="tel" class="input" value="${P(t.whatsapp||``)}" placeholder="cth: 08123456789" />
                  <p class="hint mt-1">Dipakai untuk tombol "Chat Admin" di landing page.</p>
                </div>
                <div>
                  <label class="label" for="set-email">Email properti</label>
                  <input id="set-email" type="email" class="input" value="${P(t.email||``)}" placeholder="casaramirejogja@gmail.com" />
                  <p class="hint mt-1">Tampil di landing page dan dipakai sebagai pengirim email tagihan.</p>
                </div>
              </div>

              <div>
                <label class="label" for="set-address">Alamat / lokasi</label>
                <input id="set-address" type="text" class="input" value="${P(t.address||``)}" placeholder="cth: Jl. Melati No. 10" />
              </div>

              <div>
                <label class="label" for="set-tagline">Tagline singkat</label>
                <input id="set-tagline" type="text" class="input" value="${P(t.tagline||``)}" placeholder="cth: Kos nyaman, tenang, dan strategis." />
              </div>

              <div>
                <label class="label" for="set-description">Deskripsi properti</label>
                <textarea id="set-description" rows="3" class="input" placeholder="Ceritakan suasana dan keunggulan Casa Ramire…">${P(t.description||``)}</textarea>
              </div>

              <div>
                <label class="label" for="set-facilities">Fasilitas</label>
                <textarea id="set-facilities" rows="2" class="input" placeholder="AC, WiFi, kasur, lemari…">${P(t.facilities||``)}</textarea>
                <p class="hint mt-1">Pisahkan dengan koma atau baris baru.</p>
              </div>

              <div class="grid sm:grid-cols-2 gap-3">
                <div>
                  <label class="label" for="set-maps">Link Google Maps (opsional)</label>
                  <input id="set-maps" type="url" class="input" value="${P(t.mapsUrl||``)}" placeholder="https://maps.google.com/…" />
                  <p class="hint mt-1">Dipakai untuk tombol "Buka di Google Maps".</p>
                </div>
                <div>
                  <label class="label" for="set-maps-embed">URL embed Google Maps</label>
                  <input id="set-maps-embed" type="url" class="input" value="${P(t.mapsEmbedUrl||``)}" placeholder="https://maps.google.com/maps?q=…&output=embed" />
                  <p class="hint mt-1">Titik peta yang tampil di landing page.</p>
                </div>
              </div>

              <div class="rounded-xl border border-line bg-cream/60 p-3">
                <label class="label" for="set-catalog-key">Kunci admin (katalog, sinkronisasi &amp; pembayaran)</label>
                <input id="set-catalog-key" type="password" class="input" value="${P(t.catalogAdminKey||``)}" placeholder="Masukkan kunci dari owner" autocomplete="off" />
                <p class="hint mt-1">Kunci ini hanya disimpan di perangkat ini. Dipakai untuk publikasi katalog, sinkronisasi data, email tagihan, dan (jika diaktifkan) link pembayaran DOKU. Jangan bagikan.</p>
                <p class="hint mt-1">Setelah kunci diisi, data akan disinkronkan otomatis ke landing page dan tombol Kirim Tagihan dapat memakai email.</p>
              </div>

              <div class="flex flex-wrap items-center gap-2">
                <button type="submit" class="btn-primary btn-sm">${N(`Save`,`w-4 h-4`)} Simpan profil</button>
                <button type="button" class="btn-gold btn-sm" data-action="publish-catalog">${N(`UploadCloud`,`w-4 h-4`)} Publikasikan katalog</button>
                <a href="#/home" class="btn-outline btn-sm" data-modal-close>${N(`ExternalLink`,`w-4 h-4`)} Buka landing page</a>
                <a href="#/gallery" class="btn-outline btn-sm" data-modal-close>${N(`Image`,`w-4 h-4`)} Kelola galeri</a>
              </div>
              <p class="hint" data-published-at>
                Terakhir dipublikasikan: ${t.catalogPublishedAt?Ze(t.catalogPublishedAt):`belum pernah`}.
              </p>
              <p class="hint">
                Tips: tambahkan foto di menu <b>Galeri Landing</b>, lalu klik Publikasikan. Foto yang sudah terbit otomatis dilepas
                dari penyimpanan lokal agar kuota browser tetap lega.
              </p>
            </form>
          `})}

        ${Hn({iconName:`Send`,title:`Pembayaran & tagihan email`,description:`Tagihan dapat dikirim ke email penghuni tanpa link DOKU.`,body:`
            <form id="settings-payment-form" class="space-y-3">
              <div>
                <label class="label" for="set-payment-instructions">Instruksi pembayaran di email</label>
                <textarea id="set-payment-instructions" rows="3" class="input" placeholder="cth: Transfer BCA 1234567890 a.n. Casa Ramire, lalu kirim bukti ke WhatsApp admin.">${P(t.paymentInstructions||``)}</textarea>
                <p class="hint mt-1">Dikirim bersama tagihan. Jika kosong, email memakai instruksi umum (transfer bank/QRIS dan konfirmasi ke admin).</p>
              </div>
              <label class="flex items-start gap-3 rounded-xl border border-line bg-cream/60 p-3 cursor-pointer">
                <input id="set-doku-enabled" type="checkbox" class="w-4 h-4 accent-brand mt-0.5" ${t.dokuEnabled?`checked`:``} />
                <span>
                  <span class="block text-xs font-bold text-stone-800">Aktifkan link pembayaran DOKU</span>
                  <span class="block text-[11px] text-stone-600 mt-0.5">Biarkan nonaktif selama akun/channel DOKU belum siap. Tagihan tetap bisa dikirim lewat email.</span>
                </span>
              </label>
              <button type="submit" class="btn-primary btn-sm">${N(`Save`,`w-4 h-4`)} Simpan pengaturan pembayaran</button>
            </form>
          `})}

        ${n?Hn({iconName:`ShieldCheck`,title:`Pemeliharaan data`,description:`Aksi di bawah ini tidak dapat dibatalkan. Unduh backup terlebih dahulu.`,body:`
                  <div class="flex flex-wrap gap-2">
                    <button type="button" class="btn-outline btn-sm" data-action="reset-operational">
                      ${N(`RotateCcw`,`w-4 h-4`)} Reset data operasional
                    </button>
                    <button type="button" class="btn-danger-soft btn-sm" data-action="factory-reset">
                      ${N(`AlertTriangle`,`w-4 h-4`)} Factory reset
                    </button>
                  </div>
                  <p class="hint mt-2">Reset operasional mengosongkan kamar, penghuni, tagihan, dan pengeluaran — konfigurasi & akun tetap. Factory reset mengembalikan semuanya ke kondisi awal.</p>
                `}):``}

        <div class="rounded-2xl border border-line bg-cream/60 p-4 text-xs text-stone-500 leading-relaxed">
          <p class="font-bold text-stone-700 mb-1">Tentang penyimpanan</p>
          Aplikasi ini menyimpan data di <code class="font-mono text-[11px] bg-white border border-line rounded px-1 py-0.5">localStorage</code> browser. Data tidak dikirim ke server. Gunakan backup rutin dan jangan membersihkan data situs ini tanpa cadangan.
        </div>
      </div>
    `,footer:`<button type="button" class="btn-outline btn-sm" data-modal-close>Tutup</button>`,onMount(e,t){let n=e.querySelector(`#settings-password-form`);n?.addEventListener(`submit`,t=>{t.preventDefault();let r=e.querySelector(`#pwd-current`).value,i=e.querySelector(`#pwd-new`).value;if(i!==e.querySelector(`#pwd-confirm`).value)L(`Konfirmasi password tidak cocok.`,`error`);else try{We(r,i),n.reset(),L(`Password berhasil diperbarui.`)}catch(e){L(e.message,`error`)}});let r=e.querySelector(`#settings-catalog-form`),i=()=>({whatsapp:e.querySelector(`#set-wa`).value,email:e.querySelector(`#set-email`).value,address:e.querySelector(`#set-address`).value,tagline:e.querySelector(`#set-tagline`).value,description:e.querySelector(`#set-description`).value,facilities:e.querySelector(`#set-facilities`).value,mapsUrl:e.querySelector(`#set-maps`).value,mapsEmbedUrl:e.querySelector(`#set-maps-embed`).value,catalogAdminKey:e.querySelector(`#set-catalog-key`).value}),a=()=>{let e=i();return pt(e),Lt(),e};r?.addEventListener(`submit`,e=>{e.preventDefault(),a(),L(`Profil landing page berhasil disimpan.`)}),e.querySelector(`#settings-payment-form`)?.addEventListener(`submit`,t=>{t.preventDefault(),pt({paymentInstructions:e.querySelector(`#set-payment-instructions`).value,dokuEnabled:e.querySelector(`#set-doku-enabled`).checked}),L(`Pengaturan pembayaran berhasil disimpan.`)}),e.querySelector(`[data-action="publish-catalog"]`)?.addEventListener(`click`,async t=>{let n=t.currentTarget,r=a();if(!r.whatsapp)L(`Isi nomor WhatsApp admin agar tombol chat di landing page berfungsi.`,`warning`),e.querySelector(`#set-wa`).focus();else if(!r.catalogAdminKey)L(`Isi kunci publikasi katalog terlebih dahulu.`,`error`),e.querySelector(`#set-catalog-key`).focus();else{I(n,!0,`Mempublikasikan katalog…`);try{let t=await Dn({adminKey:r.catalogAdminKey,onProgress:({label:e})=>{e&&(n.textContent=e)}}),i=e.querySelector(`[data-published-at]`);i&&(i.textContent=`Terakhir dipublikasikan: ${Ze(t.updatedAt)}.`),L(`Katalog berhasil dipublikasikan${t.uploadedPhotos?` (${t.uploadedPhotos} foto diunggah)`:``}.`)}catch(e){L(e.message,`error`)}finally{I(n,!1)}}}),e.querySelector(`[data-action="export-backup"]`)?.addEventListener(`click`,()=>{let e=JSON.parse(JSON.stringify(w()));e.settings&&delete e.settings.catalogAdminKey,ot(`casa-ramire-backup-${new Date().toISOString().slice(0,10)}.json`,JSON.stringify(e,null,2)),L(`Backup berhasil diunduh.`)});let o=e.querySelector(`[data-import-input]`);o?.addEventListener(`change`,async()=>{let e=o.files?.[0];if(e)try{let n=await st(e),r=JSON.parse(n);if(!r||!Array.isArray(r.rooms)||!Array.isArray(r.users))throw Error(`File backup tidak valid.`);if(!await H({title:`Pulihkan data dari backup?`,message:`Seluruh data saat ini akan <b>diganti</b> dengan isi file backup. Lanjutkan?`,confirmText:`Ya, pulihkan`,danger:!0}))return;let i=w().session,a=w().settings?.catalogAdminKey||``;Oe({...r,session:r.session||i,settings:{...r.settings||{},catalogAdminKey:a}}),L(`Data berhasil dipulihkan dari backup.`),t()}catch(e){L(e.message||`Gagal membaca file backup.`,`error`)}finally{o.value=``}}),e.querySelector(`[data-action="reset-operational"]`)?.addEventListener(`click`,async()=>{await H({title:`Reset data operasional?`,message:`Kamar akan dikosongkan dan data penghuni, tagihan, invoice, serta pengeluaran dihapus. Akun, pricelist, add-on, promo, dan template tetap disimpan.`,confirmText:`Ya, reset`,danger:!0})&&(ke(),L(`Data operasional berhasil direset.`),t())}),e.querySelector(`[data-action="factory-reset"]`)?.addEventListener(`click`,async()=>{await H({title:`Factory reset seluruh aplikasi?`,message:`Semua data termasuk akun kustom dan pengaturan akan dikembalikan ke kondisi awal (akun demo owner/admin). Tindakan ini tidak dapat dibatalkan.`,confirmText:`Ya, factory reset`,danger:!0})&&(Ae(),L(`Aplikasi dikembalikan ke kondisi awal.`,`warning`),t())})}})}var Wn=[`AC`,`WiFi`,`Kasur`,`Lemari`,`Meja kerja`,`Kamar mandi dalam`],Gn=[{pattern:/ac|pendingin|air conditioner/i,icon:`Snowflake`},{pattern:/wifi|internet/i,icon:`Wifi`},{pattern:/kasur|bed/i,icon:`BedDouble`},{pattern:/mandi|bath|shower/i,icon:`Bath`},{pattern:/lemari|wardrobe/i,icon:`DoorClosed`},{pattern:/meja|kerja|desk/i,icon:`Laptop`},{pattern:/parkir|parking/i,icon:`Car`},{pattern:/dapur|masak|kitchen/i,icon:`Utensils`},{pattern:/cuci|laundry|washing/i,icon:`WashingMachine`},{pattern:/kulkas|refrigerator/i,icon:`Refrigerator`},{pattern:/keamanan|cctv|security/i,icon:`ShieldCheck`},{pattern:/listrik|token/i,icon:`Zap`}],Kn={name:`Casa Ramire`,tagline:`Kos nyaman, tenang, dan strategis.`,description:`Kamar deluxe dengan fasilitas lengkap di lingkungan yang tenang. Cocok untuk mahasiswa dan pekerja yang ingin tinggal jangka panjang.`,address:`Kos Casa Ramire, Yogyakarta`,whatsapp:``,email:`casaramirejogja@gmail.com`,mapsUrl:`https://www.google.com/maps/search/?api=1&query=casa+ramire+kost+jogja`,mapsEmbedUrl:`https://maps.google.com/maps?q=casa%20ramire%20kost%20jogja&z=16&output=embed`,facilities:Wn,deposit:5e5};function qn(e){let t=e?.property||{},n=Array.isArray(t.facilities)?t.facilities:String(t.facilities||``).split(/[\n,;]+/).map(e=>e.trim()).filter(Boolean),r=Array.isArray(e?.rooms)?e.rooms:[],i=e?.availability||{total:r.length,available:r.filter(e=>e.status===`kosong`).length,occupied:r.filter(e=>e.status===`terisi`).length,booked:r.filter(e=>e.status===`booking`).length};return{version:e?.version||1,generatedAt:e?.generatedAt||``,property:{...Kn,...t,facilities:n.length?n:Wn},pricing:{lantai2:{},lantai3:{},...e?.pricing||{}},availability:i,gallery:Array.isArray(e?.gallery)?e.gallery.filter(e=>String(e?.url||``).trim()):[],promos:Array.isArray(e?.promos)?e.promos:[],rooms:r}}function Jn(e){return String(e)===`3`?`lantai3`:`lantai2`}function Yn(e){return e===`lantai3`?`3`:`2`}function Xn(e,t,n){return Number(e.pricing?.[Jn(t)]?.[n])||0}function Zn(e,t){let n=String(e?.whatsapp||``).trim();return n?tt(n,t):``}function Qn(e){return Gn.find(t=>t.pattern.test(e))?.icon||`Check`}function $n(e){return String(e||``).toUpperCase().replace(/[^A-Z0-9-]/g,``).slice(0,24)}function er(e,t){let n=$n(t);return n&&(e.promos||[]).find(e=>$n(e.code)===n)||null}function tr(e){if(!e)return 0;let t=Math.max(0,Number(e.maxUses)||0);return t?Math.max(0,t-(Number(e.usedCount)||0)):1/0}function nr(e,{floor:t,periode:n,startDate:r,endDate:a,promo:o,car:s}){let c=l.find(e=>e.key===String(n))||l[2],u=r||k(),d=``;d=c.kind===`months`?Je(u,c.months):c.kind===`days`?a&&Ye(u,a)>0?a:A(u,1):a&&Ye(u,a)>0?a:A(u,7);let f=Xn(e,t,c.key);if(!f)return{error:`Tarif untuk durasi ini belum tersedia. Hubungi admin.`};let p=1;if(c.kind===`months`)p=c.months;else{let e=Math.max(1,Ye(u,d));p=c.kind===`days`?e:Math.max(1,Math.ceil(e/7))}let m=c.kind===`months`?f:f*p,h=c.kind===`months`?c.months:1,g=o?o.type===`persen`?m*D(o.value)/100:D(o.value)*h:0,_=Math.min(m,Math.max(0,Math.round(g))),v=s?i*h:0,y=Math.max(0,m-_)+v;return{period:c,start:u,end:d,units:p,base:m,discount:_,carTotal:v,total:y,promo:o}}function rr(e){let t=e.property,n=e.gallery[0],r=Number(e.availability.available)||0;return`
    <div class="relative rounded-[2rem] overflow-hidden bg-brand shadow-xl aspect-[4/3] lg:aspect-[5/4]">
      ${n?`<img src="${P(n.url)}" alt="${P(n.caption||`Galeri ${t.name}`)}" class="w-full h-full object-cover" />`:`<div class="w-full h-full flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-brand via-brand-700 to-brand-600 text-white">
              ${Vn(`w-16 h-16 rounded-2xl`,{light:!0})}
              <p class="text-[10px] font-extrabold uppercase tracking-[0.22em] text-gold">Galeri segera hadir</p>
              <p class="text-sm text-stone-300 max-w-xs text-center px-6">Foto kamar dan suasana Casa Ramire akan tampil di sini.</p>
            </div>`}
      <div class="absolute inset-x-0 bottom-0 p-5 sm:p-6 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent">
        <p class="text-[10px] font-extrabold uppercase tracking-[0.22em] text-gold">${P(t.name)} · Kos Deluxe</p>
        <p class="text-white font-black text-xl sm:text-2xl mt-1">${P(n?.caption||`Suasana kamar & area Casa Ramire`)}</p>
        <div class="inline-flex items-center gap-3 rounded-xl bg-white/10 border border-white/15 px-3.5 py-2.5 backdrop-blur mt-4">
          <span class="w-9 h-9 rounded-lg bg-gold/15 text-gold flex items-center justify-center shrink-0">${N(`DoorOpen`,`w-4 h-4`)}</span>
          <div>
            <p class="text-[8px] font-extrabold uppercase tracking-wider text-stone-300">Kamar tersedia</p>
            <p class="text-lg font-black text-gold leading-tight">${r} kamar</p>
          </div>
        </div>
      </div>
    </div>
  `}function ir(e){let t=Number(e.availability.available)||0,n=e.rooms.filter(e=>e.status===`kosong`),r=[`2`,`3`].map(e=>({floor:e,rooms:n.filter(t=>String(t.lantai)===e)}));return`
    <section id="ketersediaan" class="scroll-mt-20 py-12 sm:py-16 bg-white border-y border-line">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="grid lg:grid-cols-[1.05fr_0.95fr] gap-6 items-stretch">
          <div class="card rounded-3xl p-6 sm:p-8 flex flex-col">
            <span class="badge-gold">Ketersediaan Kamar</span>
            <h2 class="page-title mt-3">Satu tipe kamar, banyak pilihan durasi.</h2>
            <p class="page-subtitle max-w-xl">
              Semua kamar bertipe Deluxe dengan fasilitas yang sama. Lihat nomor kamar yang masih tersedia,
              lalu pilih kamar dan durasi sewa saat booking.
            </p>

            <div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 mt-6 flex items-end justify-between gap-4">
              <div>
                <p class="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Kamar tersedia saat ini</p>
                <p class="text-4xl font-black text-emerald-900 leading-none mt-1.5">${t}</p>
                <p class="text-[11px] font-semibold text-emerald-800 mt-1">kamar siap ditempati</p>
              </div>
              <span class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">${N(`DoorOpen`,`w-6 h-6`)}</span>
            </div>

            <div class="rounded-2xl border border-line bg-cream/60 p-3.5 mt-4 text-[11px] text-stone-600 leading-relaxed">
              Klik nomor kamar di samping untuk langsung membuka form booking dengan kamar tersebut.
              Admin akan mengonfirmasi ketersediaan sebelum check-in.
            </div>

            <div class="flex flex-wrap items-center gap-2.5 mt-6">
              <button type="button" class="btn-primary px-5 py-3" data-book>${N(`CalendarClock`,`w-4 h-4`)} Booking Sekarang</button>
              ${Zn(e.property,`Halo Admin ${e.property.name}, saya mau tanya ketersediaan kamar.`)?`<a href="${Zn(e.property,`Halo Admin ${e.property.name}, saya mau tanya ketersediaan kamar.`)}" target="_blank" rel="noopener" class="btn-outline px-5 py-3 text-emerald-700">${N(`MessageCircle`,`w-4 h-4`)} Tanya Admin</a>`:``}
            </div>
          </div>

          <div class="card rounded-3xl p-6 sm:p-8">
            <div class="flex items-center justify-between gap-2">
              <p class="text-[11px] font-extrabold uppercase tracking-wider text-stone-500">Kamar yang masih tersedia</p>
              <span class="badge-green">${t} kamar</span>
            </div>
            <div class="space-y-4 mt-4">
              ${n.length?r.map(e=>`
                        <div>
                          <p class="text-xs font-bold text-stone-700 mb-2">Lantai ${e.floor}</p>
                          ${e.rooms.length?`<div class="flex flex-wrap gap-1.5">${e.rooms.map(e=>`<button type="button" class="badge-green normal-case tracking-normal hover:bg-emerald-200 transition" data-book-room="${P(e.id)}" data-book-floor="${P(e.lantai)}" title="Booking Kamar ${P(e.nomor)}">Kamar ${P(e.nomor)}</button>`).join(``)}</div>`:`<p class="text-xs text-stone-500 italic">Tidak ada kamar kosong di lantai ini.</p>`}
                        </div>`).join(``):`<div class="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 leading-relaxed">
                      <b>Belum ada kamar kosong.</b> Silakan hubungi admin untuk masuk daftar tunggu atau tanya jadwal kosong berikutnya.
                    </div>`}
            </div>
            <div class="rounded-2xl border border-amber-200 bg-amber-50 p-3.5 mt-5 text-[11px] text-amber-900 leading-relaxed">
              <b>Membawa mobil?</b> Ada tambahan parkir ${O(i)}/bulan. Pilih opsi mobil di form booking —
              biaya otomatis masuk ke estimasi.
            </div>
            <div class="rounded-2xl border border-line bg-cream/60 p-3.5 mt-3 text-[11px] text-stone-600 leading-relaxed">
              Deposit ${O(e.property.deposit||0)} dibayarkan saat check-in dan dikembalikan sesuai ketentuan.
            </div>
          </div>
        </div>
      </div>
    </section>
  `}function ar(e,t,n){let r=e.pricing?.[t]||{},i=Number(r[1])||0;return l.filter(e=>Number(r[e.key])>0).map(e=>{let t=Number(r[e.key])||0,a=e.months>1?Math.round(t/e.months):t,o=i&&e.months>1?Math.max(0,i*e.months-t):0;return`
        <div class="flex items-center justify-between gap-3 py-2.5 border-b border-line-soft last:border-0">
          <div>
            <p class="text-sm font-bold text-stone-800">${e.label}</p>
            <p class="text-[10px] text-stone-500">
              ${e.months>1?`≈ ${O(a)} / bulan`:e.months===1?`Tarif bulanan`:`Paket singkat`}
            </p>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <div class="text-right">
              <p class="text-sm font-black text-stone-800">${O(t)}</p>
              ${o>0?`<p class="text-[10px] font-bold text-emerald-700">Hemat ${O(o)}</p>`:``}
            </div>
            <button type="button" class="btn-outline btn-xs" data-book-floor="${n}" data-book-period="${e.key}">Pilih</button>
          </div>
        </div>
      `}).join(``)}function or(e,t){let n=Yn(t);return e.pricing?.[t],`
    <div class="card rounded-3xl p-5 sm:p-6 flex flex-col">
      <div class="flex items-start justify-between gap-3">
        <div>
          <span class="badge-gold">Lantai ${n}</span>
          <h3 class="text-xl font-black text-stone-800 mt-3">Tipe Deluxe · Lantai ${n}</h3>
          <p class="text-xs text-stone-500 mt-1">Fasilitas sama, harga menyesuaikan lantai.</p>
        </div>
        <span class="w-10 h-10 rounded-xl bg-brand-50 text-brand flex items-center justify-center shrink-0">${N(`Building2`,`w-5 h-5`)}</span>
      </div>

      <div class="mt-4">
        ${ar(e,t,n)||`<p class="text-sm text-stone-500">Hubungi admin untuk harga terbaru.</p>`}
      </div>

      <button type="button" class="btn-primary btn-sm mt-5 w-full" data-book-floor="${n}">
        ${N(`CalendarClock`,`w-4 h-4`)} Booking Lantai ${n}
      </button>
    </div>
  `}function sr(e){return e.gallery.length?`
    <div class="grid grid-cols-2 lg:grid-cols-3 gap-3">
      ${e.gallery.map((e,t)=>`
          <button type="button" data-gallery-index="${t}" class="group relative rounded-2xl overflow-hidden bg-brand-50 ${t===0?`col-span-2 aspect-[16/10]`:`aspect-square`}">
            <img src="${P(e.url)}" alt="${P(e.caption||`Galeri Casa Ramire ${t+1}`)}" loading="lazy" class="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
            <span class="absolute inset-x-0 bottom-0 p-3 text-left bg-gradient-to-t from-stone-950/75 to-transparent">
              <span class="text-white text-xs font-bold">${P(e.caption||`Foto ${t+1}`)}</span>
            </span>
          </button>`).join(``)}
    </div>
  `:`
      <div class="card p-10 text-center">
        <span class="w-14 h-14 rounded-2xl bg-brand-50 text-brand flex items-center justify-center mx-auto">${N(`Image`,`w-7 h-7`)}</span>
        <p class="font-extrabold text-stone-700 mt-4">Galeri foto sedang disiapkan</p>
        <p class="text-sm text-stone-500 mt-1 max-w-md mx-auto">Admin Casa Ramire akan menambahkan foto kamar dan area bersama. Sementara itu, silakan hubungi admin untuk jadwal survei.</p>
      </div>
    `}function cr(e){return e.property.facilities.map(e=>`
      <div class="card rounded-2xl p-4 flex items-center gap-3">
        <span class="w-10 h-10 rounded-xl bg-brand-50 text-brand flex items-center justify-center shrink-0">
          ${N(Qn(e),`w-5 h-5`)}
        </span>
        <p class="text-sm font-bold text-stone-700">${P(e)}</p>
      </div>
    `).join(``)}function lr(){return`
    <div class="bg-brand text-white border-b border-white/10">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center gap-2 text-[11px]">
        ${N(`Eye`,`w-4 h-4 text-gold shrink-0`)}
        <span class="font-semibold text-stone-200">Mode pratinjau admin — perubahan galeri dan profil baru terlihat publik setelah dipublikasikan.</span>
        <div class="ml-auto flex items-center gap-2">
          <button type="button" class="btn-gold btn-xs" data-action="open-settings">${N(`UploadCloud`,`w-3.5 h-3.5`)} Publikasikan</button>
          <a href="#/dashboard" class="btn-outline btn-xs border-white/20 bg-white/5 text-white hover:bg-white/10">Dashboard</a>
        </div>
      </div>
    </div>
  `}function ur(e,{preview:t}){let n=e.property,r=Zn(n,`Halo Admin ${n.name}, saya mau tanya ketersediaan kamar di Casa Ramire.`),a=Me()?`#/dashboard`:`#/login`,o=Me()?`Dashboard`:`Masuk Admin`,s=String(n.mapsUrl||``).trim(),c=String(n.mapsEmbedUrl||``).trim(),l=String(n.email||``).trim();return`
    <div data-view="home" class="min-h-dvh bg-cream">
      <header class="sticky top-0 z-40 bg-cream/90 backdrop-blur border-b border-line">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
          <a href="#/home" class="flex items-center gap-2.5 min-w-0" aria-label="${P(n.name)} — beranda">
            ${Vn(`w-10 h-10 rounded-xl`)}
            <span class="min-w-0">
              <span class="block text-sm font-extrabold text-stone-800 leading-tight truncate">${P(n.name)}</span>
              <span class="block text-[9px] font-extrabold uppercase tracking-[0.18em] text-gold-700">Kos Deluxe</span>
            </span>
          </a>

          <nav class="hidden lg:flex items-center gap-1 ml-6" aria-label="Navigasi landing page">
            <button type="button" class="btn-ghost btn-sm" data-scroll="ketersediaan">Ketersediaan</button>
            <button type="button" class="btn-ghost btn-sm" data-scroll="galeri">Galeri</button>
            <button type="button" class="btn-ghost btn-sm" data-scroll="harga">Harga</button>
            <button type="button" class="btn-ghost btn-sm" data-scroll="fasilitas">Fasilitas</button>
            <button type="button" class="btn-ghost btn-sm" data-scroll="lokasi">Lokasi</button>
          </nav>

          <div class="ml-auto flex items-center gap-2">
            <a href="${a}" class="btn-outline btn-sm hidden sm:inline-flex">${N(`LockKeyhole`,`w-4 h-4`)} ${o}</a>
            <button type="button" class="btn-primary btn-sm" data-book>${N(`CalendarClock`,`w-4 h-4`)} <span class="hidden sm:inline">Booking</span></button>
          </div>
        </div>
      </header>

      ${t?lr():``}

      <main>
        <section class="relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-b from-white via-cream to-cream"></div>
          <div class="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
            <div class="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center">
              <div class="animate-in">
                <span class="badge-gold">${P(n.name)} · Kos Deluxe</span>
                <h1 class="text-4xl sm:text-5xl font-black tracking-tight text-stone-800 mt-4 text-balance leading-[1.05]">
                  Kamar nyaman,<br class="hidden sm:block" /> hidup lebih tenang.
                </h1>
                <p class="text-base sm:text-lg text-stone-600 mt-4 max-w-xl leading-relaxed">
                  ${P(n.description)}
                </p>

                <div class="flex flex-wrap items-center gap-2.5 mt-7">
                  <button type="button" class="btn-primary px-5 py-3" data-book>
                    ${N(`CalendarClock`,`w-4 h-4`)} Booking Kamar
                  </button>
                  ${r?`<a href="${r}" target="_blank" rel="noopener" class="btn-outline px-5 py-3 text-emerald-700">${N(`MessageCircle`,`w-4 h-4`)} Chat WhatsApp</a>`:`<button type="button" class="btn-outline px-5 py-3" data-scroll="kontak">${N(`MessageCircle`,`w-4 h-4`)} Hubungi Admin</button>`}
                </div>

                <div class="inline-flex items-center gap-3.5 rounded-2xl bg-white border border-line p-4 mt-8">
                  <span class="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">${N(`DoorOpen`,`w-5 h-5`)}</span>
                  <div>
                    <p class="text-[9px] font-extrabold uppercase tracking-wider text-stone-500">Kamar tersedia</p>
                    <p class="text-2xl font-black text-emerald-700 leading-tight">${e.availability.available??0}</p>
                  </div>
                </div>

                <p class="text-[11px] text-stone-500 mt-4 flex items-center gap-1.5">
                  ${N(`MapPin`,`w-3.5 h-3.5 text-gold-700`)}
                  ${P(n.address||`Lokasi Casa Ramire`)}
                </p>
              </div>

              <div class="animate-in">${rr(e)}</div>
            </div>
          </div>
        </section>

        ${ir(e)}

        <section id="galeri" class="scroll-mt-20 py-12 sm:py-16">
          <div class="max-w-6xl mx-auto px-4 sm:px-6">
            <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div class="max-w-2xl">
                <span class="badge-gold">Galeri Casa Ramire</span>
                <h2 class="page-title mt-3">Lihat suasananya sebelum memutuskan.</h2>
                <p class="page-subtitle">
                  Foto asli kamar dan area properti. Semua kamar bertipe sama, jadi kamu sudah bisa membayangkan kenyamanannya.
                </p>
              </div>
              <button type="button" class="btn-primary btn-sm" data-book>${N(`CalendarClock`,`w-4 h-4`)} Booking setelah lihat</button>
            </div>
            <div class="mt-7">${sr(e)}</div>
          </div>
        </section>

        <section id="harga" class="scroll-mt-20 py-12 sm:py-16 bg-white border-y border-line">
          <div class="max-w-6xl mx-auto px-4 sm:px-6">
            <div class="max-w-2xl">
              <span class="badge-gold">Harga & Paket Sewa</span>
              <h2 class="page-title mt-3">Pilih durasi, harga langsung terlihat.</h2>
              <p class="page-subtitle">
                Semakin lama, semakin hemat per bulan. Kode promo bisa dipakai saat booking.
              </p>
            </div>

            <div class="grid md:grid-cols-2 gap-4 mt-7">
              ${or(e,`lantai2`)}
              ${or(e,`lantai3`)}
            </div>

            <p class="hint mt-4">
              * Harga dapat berubah sewaktu-waktu. Tambahan parkir mobil ${O(i)}/bulan.
              Deposit ${O(n.deposit||0)} dibayar saat check-in.
            </p>
          </div>
        </section>

        <section id="fasilitas" class="scroll-mt-20 py-12 sm:py-16">
          <div class="max-w-6xl mx-auto px-4 sm:px-6">
            <div class="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-12 items-start">
              <div>
                <span class="badge-gold">Fasilitas</span>
                <h2 class="page-title mt-3">Semua yang kamu butuhkan untuk tinggal nyaman.</h2>
                <p class="page-subtitle">
                  Fasilitas utama sudah termasuk dalam harga sewa. Ajukan kebutuhan tambahan ke admin.
                </p>
                <div class="card rounded-2xl p-4 mt-5 bg-cream/60">
                  <p class="text-[10px] font-extrabold uppercase tracking-wider text-stone-500">Deposit</p>
                  <p class="text-xl font-black text-stone-800 mt-1">${O(n.deposit||0)}</p>
                  <p class="hint mt-1">Deposit dikembalikan sesuai ketentuan saat check-out.</p>
                </div>
              </div>
              <div class="grid sm:grid-cols-2 gap-3">${cr(e)}</div>
            </div>
          </div>
        </section>

        <section id="lokasi" class="scroll-mt-20 py-12 sm:py-16 bg-white border-y border-line">
          <div class="max-w-6xl mx-auto px-4 sm:px-6">
            <div class="grid lg:grid-cols-[0.85fr_1.15fr] gap-8 items-start">
              <div>
                <span class="badge-gold">Lokasi</span>
                <h2 class="page-title mt-3">Cek titik lokasi Casa Ramire.</h2>
                <p class="page-subtitle">
                  Lihat posisi kos di Google Maps, lalu atur jadwal survei dengan admin.
                </p>
                <div class="space-y-2 mt-5">
                  <div class="card rounded-2xl p-4 flex items-start gap-3">
                    <span class="w-9 h-9 rounded-xl bg-brand-50 text-brand flex items-center justify-center shrink-0">${N(`MapPin`,`w-4 h-4`)}</span>
                    <div>
                      <p class="text-[10px] font-extrabold uppercase tracking-wider text-stone-500">Alamat</p>
                      <p class="text-sm font-semibold text-stone-800 mt-0.5">${P(n.address||`Casa Ramire`)}</p>
                    </div>
                  </div>
                  <div class="card rounded-2xl p-4 flex items-start gap-3">
                    <span class="w-9 h-9 rounded-xl bg-brand-50 text-brand flex items-center justify-center shrink-0">${N(`Clock`,`w-4 h-4`)}</span>
                    <div>
                      <p class="text-[10px] font-extrabold uppercase tracking-wider text-stone-500">Survei</p>
                      <p class="text-sm font-semibold text-stone-800 mt-0.5">Atur jadwal dengan admin</p>
                    </div>
                  </div>
                </div>
                ${s?`<a href="${P(s)}" target="_blank" rel="noopener" class="btn-primary btn-sm mt-4">${N(`ExternalLink`,`w-4 h-4`)} Buka di Google Maps</a>`:``}
              </div>
              <div class="rounded-3xl overflow-hidden border border-line bg-stone-100 shadow-sm">
                ${c?`<iframe src="${P(c)}" width="100%" height="380" style="border:0" loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade" title="Peta lokasi ${P(n.name)}"></iframe>`:`<div class="h-[380px] flex flex-col items-center justify-center gap-2 text-stone-500">
                        ${N(`MapPin`,`w-8 h-8`)}
                        <p class="text-sm font-bold">Peta belum diatur</p>
                      </div>`}
              </div>
            </div>
          </div>
        </section>

        <section id="kontak" class="scroll-mt-20 py-12 sm:py-16">
          <div class="max-w-6xl mx-auto px-4 sm:px-6">
            <div class="rounded-[2rem] bg-brand text-white overflow-hidden relative">
              <div class="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-gold/15 blur-3xl"></div>
              <div class="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-white/10 blur-2xl"></div>
              <div class="relative p-7 sm:p-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
                <div>
                  <span class="badge-gold">Hubungi Admin</span>
                  <h2 class="text-3xl sm:text-4xl font-black tracking-tight mt-3 text-balance">
                    Suka dengan kamarnya? Booking sekarang.
                  </h2>
                  <p class="text-sm text-stone-300 mt-3 max-w-xl leading-relaxed">
                    Isi form booking online, admin akan menghubungi kamu untuk konfirmasi kamar dan jadwal check-in.
                  </p>
                  <div class="flex flex-wrap gap-2.5 mt-6">
                    <button type="button" class="btn-gold px-5 py-3" data-book>${N(`CalendarClock`,`w-4 h-4`)} Booking Kamar</button>
                    ${r?`<a href="${r}" target="_blank" rel="noopener" class="btn-outline border-white/20 bg-white/5 text-white hover:bg-white/10 px-5 py-3">${N(`MessageCircle`,`w-4 h-4`)} Chat WhatsApp</a>`:``}
                  </div>
                </div>

                <div class="rounded-2xl bg-white/10 border border-white/15 p-5 space-y-4">
                  <div class="flex items-start gap-3">
                    <span class="w-9 h-9 rounded-xl bg-white/10 text-gold flex items-center justify-center shrink-0">${N(`MapPin`,`w-4 h-4`)}</span>
                    <div>
                      <p class="text-[10px] font-extrabold uppercase tracking-wider text-gold">Alamat</p>
                      <p class="text-sm font-semibold text-white mt-0.5">${P(n.address||`Casa Ramire`)}</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-3">
                    <span class="w-9 h-9 rounded-xl bg-white/10 text-gold flex items-center justify-center shrink-0">${N(`Phone`,`w-4 h-4`)}</span>
                    <div>
                      <p class="text-[10px] font-extrabold uppercase tracking-wider text-gold">WhatsApp Admin</p>
                      <p class="text-sm font-semibold text-white mt-0.5">${P(n.whatsapp||`Belum diatur`)}</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-3">
                    <span class="w-9 h-9 rounded-xl bg-white/10 text-gold flex items-center justify-center shrink-0">${N(`Send`,`w-4 h-4`)}</span>
                    <div class="min-w-0">
                      <p class="text-[10px] font-extrabold uppercase tracking-wider text-gold">Email</p>
                      ${l?`<a href="mailto:${P(l)}" class="text-sm font-semibold text-white mt-0.5 hover:text-gold break-all">${P(l)}</a>`:`<p class="text-sm font-semibold text-white mt-0.5">Belum diatur</p>`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer class="border-t border-line py-8">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2.5">
            ${Vn(`w-9 h-9 rounded-xl`)}
            <div>
              <p class="text-sm font-extrabold text-stone-800 leading-tight">${P(n.name)}</p>
              <p class="text-[10px] text-stone-500">Kos nyaman untuk tinggal jangka panjang.</p>
            </div>
          </div>
          <div class="flex items-center gap-3 text-[11px] font-semibold text-stone-500">
            <button type="button" class="hover:text-brand" data-scroll="galeri">Galeri</button>
            <button type="button" class="hover:text-brand" data-scroll="harga">Harga</button>
            <button type="button" class="hover:text-brand" data-scroll="lokasi">Lokasi</button>
            <button type="button" class="hover:text-brand" data-scroll="kontak">Kontak</button>
            <a href="${a}" class="hover:text-brand">${o}</a>
          </div>
          <p class="text-[10px] text-stone-400">© ${new Date().getFullYear()} ${P(n.name)}</p>
        </div>
      </footer>
    </div>
  `}function dr(e,t){return e.error?`<div class="flex items-start gap-2 text-rose-700">${N(`CircleAlert`,`w-4 h-4 shrink-0 mt-0.5`)}<span class="font-semibold">${P(e.error)}</span></div>`:`
    <div class="flex justify-between gap-3"><span class="text-stone-500">Sewa (${e.units} ${e.period.unit})</span><span class="font-bold">${O(e.base)}</span></div>
    ${e.discount>0?`<div class="flex justify-between gap-3 text-rose-700"><span>Diskon${e.promo?` (${P(e.promo.name)})`:``}</span><span class="font-bold">−${O(e.discount)}</span></div>`:``}
    ${e.carTotal>0?`<div class="flex justify-between gap-3 text-amber-800"><span>Parkir mobil</span><span class="font-bold">${O(e.carTotal)}</span></div>`:``}
    <div class="flex justify-between gap-3 pt-2 border-t border-line"><span class="font-bold text-stone-700">Total sewa</span><span class="font-extrabold text-stone-800">${O(e.total)}</span></div>
    <div class="flex justify-between gap-3"><span class="text-stone-500">Deposit (dibayar saat check-in)</span><span class="font-bold">${O(t)}</span></div>
    <p class="text-[10px] text-stone-600 pt-1">Periode: ${j(e.start)} — ${j(e.end)}</p>
  `}function fr(e,{floor:t=`2`,periode:n=`1`,roomId:r=``}={}){let a=``,o=String(t),s=String(n),c=String(r||``),u=(e.rooms||[]).filter(e=>e.status===`kosong`),d=Number(e.property.deposit)||0;V({title:`Booking Kamar`,subtitle:`${e.property.name} · isi data, admin akan mengonfirmasi ketersediaan.`,size:`lg`,body:`
      <form id="hm-form" class="space-y-5" novalidate>
        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label class="label" for="hm-name">Nama lengkap <span class="text-rose-500">*</span></label>
            <input id="hm-name" type="text" class="input" placeholder="Nama lengkap" required />
          </div>
          <div>
            <label class="label" for="hm-phone">No. WhatsApp <span class="text-rose-500">*</span></label>
            <input id="hm-phone" type="tel" class="input" placeholder="cth: 08123456789" required />
          </div>
          <div>
            <label class="label" for="hm-email">Email <span class="text-rose-500">*</span></label>
            <input id="hm-email" type="email" class="input" placeholder="nama@email.com" required />
            <p class="hint mt-1">Untuk konfirmasi & tagihan.</p>
          </div>
          <div>
            <label class="label" for="hm-job">Pekerjaan / instansi</label>
            <input id="hm-job" type="text" class="input" placeholder="Mahasiswa / Karyawan" />
          </div>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label class="label" for="hm-floor">Lantai</label>
            <select id="hm-floor" class="select">
              <option value="2" ${o===`2`?`selected`:``}>Lantai 2</option>
              <option value="3" ${o===`3`?`selected`:``}>Lantai 3</option>
            </select>
          </div>
          <div>
            <label class="label" for="hm-room">Pilihan kamar</label>
            <select id="hm-room" class="select"></select>
            <p class="hint mt-1">Kosongkan agar admin memilihkan.</p>
          </div>
          <div>
            <label class="label" for="hm-periode">Durasi sewa</label>
            <select id="hm-periode" class="select">
              ${l.map(e=>`<option value="${e.key}" ${e.key===s?`selected`:``}>${e.label}</option>`).join(``)}
            </select>
          </div>
          <div>
            <label class="label" for="hm-start">Tanggal mulai</label>
            <input id="hm-start" type="date" class="input" value="${k()}" />
          </div>
        </div>

        <div id="hm-end-wrap" class="hidden">
          <label class="label" for="hm-end">Tanggal selesai</label>
          <input id="hm-end" type="date" class="input" />
        </div>

        <label class="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/60 p-4 cursor-pointer">
          <input id="hm-car" type="checkbox" class="w-4 h-4 accent-brand mt-0.5" />
          <span>
            <span class="block text-xs font-bold text-stone-800">Saya membawa mobil</span>
            <span class="block text-[11px] text-stone-600 mt-0.5">Tambahan parkir ${O(i)}/bulan.</span>
          </span>
        </label>

        <div class="rounded-2xl border border-line bg-stone-50/60 p-4 space-y-3">
          <div class="flex items-center justify-between gap-2">
            <p class="text-[11px] font-extrabold uppercase tracking-wider text-stone-500">Kode promo</p>
            <span class="badge-gold">Opsional</span>
          </div>
          <div class="flex gap-2">
            <input id="hm-promo" type="text" class="input font-mono uppercase" placeholder="cth: MAHASISWA5" maxlength="24" autocomplete="off" />
            <button type="button" class="btn-outline btn-sm shrink-0" data-apply-promo>Terapkan</button>
          </div>
          <p id="hm-promo-status" class="text-[11px] text-stone-500">
            ${e.promos.length?`Masukkan kode promo dari admin, lalu klik Terapkan.`:`Belum ada kode promo aktif saat ini.`}
          </p>
        </div>

        <div class="rounded-2xl border border-line bg-stone-50/60 p-4 space-y-3">
          <p class="text-[11px] font-extrabold uppercase tracking-wider text-stone-500">Kontak darurat (opsional)</p>
          <div class="grid sm:grid-cols-3 gap-2">
            <input id="hm-ec-name" type="text" class="input input-sm" placeholder="Nama kontak" />
            <input id="hm-ec-relation" type="text" class="input input-sm" placeholder="Hubungan" />
            <input id="hm-ec-phone" type="tel" class="input input-sm" placeholder="No. telepon" />
          </div>
        </div>

        <div>
          <label class="label" for="hm-notes">Catatan / permintaan khusus</label>
          <textarea id="hm-notes" rows="2" class="input" placeholder="cth: minta kamar dekat jendela, rencana survei"></textarea>
        </div>

        <div id="hm-summary" class="rounded-2xl border border-line bg-cream/70 p-4 text-xs space-y-2"></div>
      </form>
    `,footer:`
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      <button type="submit" form="hm-form" class="btn-primary btn-sm" data-submit>${N(`Send`,`w-4 h-4`)} Kirim Booking</button>
    `,onMount(t,n){let r=e=>t.querySelector(e)?.value.trim()??``,i=t.querySelector(`#hm-summary`),o=t.querySelector(`#hm-promo`),s=t.querySelector(`#hm-promo-status`),l=t.querySelector(`#hm-floor`),f=t.querySelector(`#hm-room`),p=t.querySelector(`#hm-periode`),m=t.querySelector(`#hm-start`),h=t.querySelector(`#hm-end`),g=t.querySelector(`#hm-end-wrap`),_=t.querySelector(`[data-submit]`),v=e=>e===`harian`||e===`mingguan`,y=()=>{let e=u.filter(e=>String(e.lantai)===String(l.value));f.innerHTML=[`<option value="">Admin pilihkan</option>`,...e.map(e=>`<option value="${P(e.id)}" ${String(e.id)===String(c)?`selected`:``}>Kamar ${P(e.nomor)}</option>`)].join(``),e.some(e=>String(e.id)===String(c))||(c=``,f.value=``)};f.addEventListener(`change`,()=>{c=f.value});let b=()=>{let e=v(p.value);if(g.classList.toggle(`hidden`,!e),e){let e=p.value===`harian`?1:7,t=m.value||k();(!h.value||h.value<=t)&&(h.value=A(t,e))}},x=()=>{let n=er(e,a);return a&&!n?{error:`Kode promo tidak ditemukan atau sudah tidak aktif.`}:n&&tr(n)<=0?{error:`Kode promo ini sudah habis dipakai.`}:nr(e,{floor:t.querySelector(`#hm-floor`).value,periode:p.value,startDate:m.value,endDate:h.value,promo:n,car:!!t.querySelector(`#hm-car`).checked})},S=()=>{let e=x();return i.innerHTML=dr(e,d),e},C=()=>{if(!a){s.className=`text-[11px] text-stone-500`,s.textContent=e.promos.length?`Masukkan kode promo dari admin, lalu klik Terapkan.`:`Belum ada kode promo aktif saat ini.`;return}let t=er(e,a);if(!t){s.className=`text-[11px] font-bold text-rose-700`,s.textContent=`Kode promo tidak ditemukan atau sudah tidak aktif.`;return}let n=tr(t);if(n<=0){s.className=`text-[11px] font-bold text-rose-700`,s.textContent=`Kode promo ini sudah habis dipakai.`;return}let r=t.type===`persen`?`${D(t.value)}%`:O(t.value);s.className=`text-[11px] font-bold text-emerald-700`,s.textContent=`Promo ${t.name} (${r}) diterapkan.${Number.isFinite(n)?` Sisa kuota: ${n}.`:``}`};t.querySelector(`[data-apply-promo]`)?.addEventListener(`click`,()=>{let t=$n(o.value);if(!t){a=``,C(),S();return}let n=er(e,t);n?tr(n)<=0?(a=t,C(),S(),L(`Kode promo sudah habis dipakai.`,`error`)):(a=$n(n.code),o.value=a,C(),S(),L(`Kode promo diterapkan.`)):(a=t,C(),S(),L(`Kode promo tidak ditemukan.`,`error`))}),o.addEventListener(`input`,()=>{$n(o.value)!==a&&(a=``,C(),S())}),t.querySelector(`#hm-car`).addEventListener(`change`,S),l.addEventListener(`change`,()=>{y(),S()}),p.addEventListener(`change`,()=>{b(),S()}),m.addEventListener(`change`,()=>{if(v(p.value)){let e=p.value===`harian`?1:7;(!h.value||h.value<=m.value)&&(h.value=A(m.value,e))}S()}),h.addEventListener(`change`,S),y(),b(),C(),S(),t.querySelector(`#hm-form`).addEventListener(`submit`,async i=>{i.preventDefault();let o=S();if(o.error){L(o.error,`error`);return}let s=r(`#hm-name`),c=r(`#hm-phone`),l=r(`#hm-email`);if(s.length<2)return L(`Nama lengkap wajib diisi.`,`warning`);if(c.replace(/\D/g,``).length<8)return L(`Nomor WhatsApp tidak valid.`,`warning`);if(!jn(l))return L(`Alamat email tidak valid.`,`warning`);let d=u.find(e=>String(e.id)===String(f.value)),g={name:s,phone:c,email:l,job:r(`#hm-job`),notes:r(`#hm-notes`),emergencyContact:{name:r(`#hm-ec-name`),relation:r(`#hm-ec-relation`),phone:r(`#hm-ec-phone`)},floor:t.querySelector(`#hm-floor`).value,roomId:d?.id||``,roomNumber:d?.nomor||``,periode:p.value,startDate:m.value||k(),endDate:v(p.value)?h.value:``,car:!!t.querySelector(`#hm-car`).checked,promoCode:a,estimate:o.total};_.disabled=!0;try{let t=await Zt(g);n(),pr(e,t,o)}catch(e){L(e.message,`error`)}finally{_.disabled=!1}})}})}function pr(e,t,n){let r=e.property,a=Zn(r,`Halo Admin ${r.name}, saya sudah mengirim booking online dengan kode ${t.code} atas nama ${t.name}. Mohon konfirmasi ketersediaan kamar.`);V({title:`Booking Berhasil Dikirim`,subtitle:`Admin akan menghubungi kamu untuk konfirmasi.`,size:`md`,body:`
      <div class="space-y-4">
        <div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center">
          <span class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">${N(`CheckCircle2`,`w-6 h-6`)}</span>
          <p class="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 mt-3">Kode booking</p>
          <p class="text-2xl font-black text-emerald-900 font-mono">${P(t.code)}</p>
          <p class="text-[11px] text-emerald-800 mt-1">Simpan kode ini untuk komunikasi dengan admin.</p>
        </div>

        <div class="rounded-2xl border border-line bg-cream/60 p-4 text-xs space-y-2">
          <div class="flex justify-between gap-3"><span class="text-stone-500">Nama</span><b class="text-stone-800">${P(t.name)}</b></div>
          <div class="flex justify-between gap-3"><span class="text-stone-500">Email</span><b class="text-stone-800 break-all text-right">${P(t.email)}</b></div>
          <div class="flex justify-between gap-3"><span class="text-stone-500">Lantai</span><b class="text-stone-800">Lantai ${P(t.floor||`—`)}</b></div>
          ${t.roomNumber?`<div class="flex justify-between gap-3"><span class="text-stone-500">Kamar pilihan</span><b class="text-stone-800">Kamar ${P(t.roomNumber)}</b></div>`:``}
          <div class="flex justify-between gap-3"><span class="text-stone-500">Durasi</span><b class="text-stone-800">${P(n.period.label)}</b></div>
          <div class="flex justify-between gap-3"><span class="text-stone-500">Periode</span><b class="text-stone-800 text-right">${j(n.start)} — ${j(n.end)}</b></div>
          ${t.car?`<div class="flex justify-between gap-3"><span class="text-stone-500">Parkir mobil</span><b class="text-stone-800">${O(i)}/bulan</b></div>`:``}
          <div class="flex justify-between gap-3 pt-2 border-t border-line"><span class="text-stone-500">Estimasi total sewa</span><b class="text-stone-800">${O(n.total)}</b></div>
          <p class="text-[10px] text-stone-500">Deposit ${O(e.property.deposit||0)} dibayar saat check-in. Total final dikonfirmasi admin.</p>
        </div>

        ${t.offline?`<div class="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-[11px] text-amber-900">Mode lokal: API booking belum tersedia. Permintaan tersimpan di perangkat ini dan bisa diproses dari menu Booking Online.</div>`:`<div class="rounded-xl border border-line bg-white px-3 py-2.5 text-[11px] text-stone-600 leading-relaxed">Admin akan mengirim konfirmasi ke <b>${P(t.email)}</b> atau menghubungi WhatsApp <b>${P(t.phone)}</b>.</div>`}
      </div>
    `,footer:`
      <button type="button" class="btn-outline btn-sm" data-modal-close>Tutup</button>
      ${a?`<a href="${a}" target="_blank" rel="noopener" class="btn-primary btn-sm">${N(`MessageCircle`,`w-4 h-4`)} Konfirmasi ke Admin</a>`:``}
    `})}function mr(e,t){let n=e.gallery[t];n&&V({title:n.caption||`Galeri ${e.property.name}`,size:`full`,body:`<img src="${P(n.url)}" alt="${P(n.caption||`Foto galeri`)}" class="w-full h-auto rounded-xl" />`,footer:`<button type="button" class="btn-outline btn-sm" data-modal-close>Tutup</button>`})}function hr(e,t){e.querySelectorAll(`[data-scroll]`).forEach(t=>{t.addEventListener(`click`,()=>{let n=t.dataset.scroll;(n?e.querySelector(`#${n}`):null)?.scrollIntoView({behavior:`smooth`,block:`start`})})}),e.querySelectorAll(`[data-book]`).forEach(e=>{e.addEventListener(`click`,()=>fr(t))}),e.querySelectorAll(`[data-book-floor]`).forEach(e=>{e.addEventListener(`click`,()=>fr(t,{floor:e.dataset.bookFloor,periode:e.dataset.bookPeriod||`1`}))}),e.querySelectorAll(`[data-book-room]`).forEach(e=>{e.addEventListener(`click`,()=>fr(t,{floor:e.dataset.bookFloor,roomId:e.dataset.bookRoom}))}),e.querySelectorAll(`[data-gallery-index]`).forEach(e=>{e.addEventListener(`click`,()=>mr(t,Number(e.dataset.galleryIndex)))}),e.querySelector(`[data-action="open-settings"]`)?.addEventListener(`click`,()=>{Un()});let n=t.property;document.title=`${n.name} — Kos Deluxe Yogyakarta`;let r=document.querySelector(`meta[name="description"]`);r&&r.setAttribute(`content`,n.description||`${n.name} — kos deluxe, galeri foto, harga sewa, dan booking online.`)}function gr(e,t,n){e.innerHTML=ur(t,n),hr(e,t)}function _r(e){let t=!!Me(),n=`${Date.now()}-${Math.random().toString(36).slice(2)}`;e.dataset.homeRenderId=n;let r=qn(Tn({includeLocalPhotos:!0}));gr(e,r,{preview:t,source:t?`preview`:`local`}),!t&&(async()=>{try{let t=await On().catch(e=>(console.warn(`[home] gagal memuat katalog publik, memakai data lokal`,e),null));if(e.dataset.homeRenderId!==n||!e.querySelector(`[data-view="home"]`))return;let i=t?qn(t):r;t&&gr(e,i,{preview:!1,source:`published`});let a=await kn();if(!a||e.dataset.homeRenderId!==n||!e.querySelector(`[data-view="home"]`))return;i={...i,availability:a.availability,rooms:a.rooms.length?a.rooms:i.rooms},gr(e,i,{preview:!1,source:t?`published`:`local`})}catch(e){console.warn(`[home] gagal memuat data ketersediaan`,e)}})()}function vr(e,t){return e.tenants.find(e=>String(e.id)===String(t))||null}function yr(e,t){return e.rooms.find(e=>String(e.id)===String(t))||null}function br(e,t){let n=t.tenantId?vr(e,t.tenantId):null,r=t.roomId?yr(e,t.roomId):null,i=Math.max(0,Math.round(D(t.amount)));if(i<=0)throw Error(`Nominal tagihan harus lebih dari 0.`);let a=!!t.paid,o=new Date().toISOString(),s={id:E(e.bills),number:je(`INV`,e.bills),tenantId:n?.id??t.tenantId??null,roomId:r?.id??t.roomId??null,tenantName:n?.name||t.tenantName||`Tanpa nama`,phone:n?.phone||t.phone||``,email:n?.email||t.email||``,roomNumber:r?.nomor||t.roomNumber||`—`,type:t.type||`Sewa`,description:t.description||``,amount:i,paid:a?i:0,status:a?`paid`:`unpaid`,dueDate:t.dueDate||k(),periodStart:t.periodStart||null,periodEnd:t.periodEnd||null,source:t.source||`rent`,method:a?t.method||`Tunai / Cash`:``,note:t.note||``,createdAt:o,paidAt:a?o:null};return e.bills.push(s),s}function xr({tenantId:e,type:t,amount:n,dueDate:r,note:i=``}){let a=w().tenants.find(t=>String(t.id)===String(e));if(!a)throw Error(`Penghuni tidak ditemukan.`);if(!String(t||``).trim())throw Error(`Jenis tagihan wajib diisi.`);if(D(n)<=0)throw Error(`Nominal tagihan harus lebih dari 0.`);let o;return T(e=>{o=br(e,{tenantId:a.id,roomId:a.roomId,type:String(t).trim(),amount:n,dueDate:r||k(),note:i,source:`manual`})}),o}function Sr({status:e=null,tenantId:t=null}={}){return w().bills.filter(t=>!e||t.status===e).filter(e=>!t||String(e.tenantId)===String(t)).sort((e,t)=>e.status===t.status?String(e.dueDate).localeCompare(String(t.dueDate)):e.status===`unpaid`?-1:1)}function Cr(e){return w().bills.find(t=>String(t.id)===String(e))||null}function wr(e,{method:t=`Virtual Account BCA`,note:n=``}={}){let r=Cr(e);if(!r)throw Error(`Tagihan tidak ditemukan.`);return r.status===`paid`?r:(T(i=>{let a=i.bills.find(t=>String(t.id)===String(e)),o=Math.max(0,a.amount-D(a.paid)),s=new Date().toISOString();a.paid=a.amount,a.status=`paid`,a.paidAt=s,a.method=t,a.note=n;let c=vr(i,a.tenantId);c&&(c.totalPaid=Math.max(0,D(c.totalPaid)+o),c.payments=c.payments||[],c.payments.push({id:E(c.payments),date:k(),amount:o,type:r.type,method:t,note:n,billId:a.id}))}),Cr(e))}function Tr(e){let t=Cr(e);if(!t)throw Error(`Tagihan tidak ditemukan.`);return t.status===`paid`?(T(n=>{let r=n.bills.find(t=>String(t.id)===String(e));r.paid=0,r.status=`unpaid`,r.paidAt=null,r.method=``,r.note=``;let i=vr(n,r.tenantId);i&&(i.totalPaid=Math.max(0,D(i.totalPaid)-t.amount),i.payments=(i.payments||[]).filter(e=>String(e.billId)!==String(r.id)))}),Cr(e)):t}function Er(e){let t=Cr(e);t&&T(n=>{if(t.status===`paid`){let e=vr(n,t.tenantId);e&&(e.totalPaid=Math.max(0,D(e.totalPaid)-t.paid),e.payments=(e.payments||[]).filter(e=>String(e.billId)!==String(t.id)))}n.bills=n.bills.filter(t=>String(t.id)!==String(e))})}function Dr(){return[...w().manualInvoices].sort((e,t)=>t.id-e.id)}function Or({mode:e=`tenant`,tenantId:t=null,roomId:n=null,name:r=``,email:i=``,phone:a=``,item:o,amount:s,dueDate:c,date:l}){let u=w();if(!String(o||``).trim())throw Error(`Item layanan wajib diisi.`);if(D(s)<=0)throw Error(`Nominal invoice harus lebih dari 0.`);let d=null,f=null,p=``,m=``,h=``,g=`—`;if(e===`tenant`){if(d=u.tenants.find(e=>String(e.id)===String(t))||null,!d)throw Error(`Penghuni tidak ditemukan.`);f=u.rooms.find(e=>String(e.id)===String(d.roomId))||(n?u.rooms.find(e=>String(e.id)===String(n)):null)||null,p=d.name,m=d.email||``,h=d.phone||``,g=f?.nomor||d.roomNumber||`—`}else{if(p=String(r||``).trim(),!p)throw Error(`Nama penerima invoice wajib diisi.`);f=n&&u.rooms.find(e=>String(e.id)===String(n))||null,m=String(i||``).trim(),h=String(a||``).trim(),g=f?.nomor||`—`}let _;return T(t=>{let n={id:E(t.manualInvoices),number:je(`SRV`,t.manualInvoices),tenantId:d?.id??null,roomId:f?.id??null,tenantName:p,email:m,phone:h,roomNumber:g,mode:e===`tenant`?`tenant`:`non-tenant`,item:String(o).trim(),amount:Math.round(D(s)),paid:0,status:`unpaid`,dueDate:c||l||A(k(),7),method:``,note:``,createdAt:new Date().toISOString(),paidAt:null};t.manualInvoices.push(n),_=n}),_}function kr(e,t){return t?(e.posSales||[]).find(e=>t.posSaleId&&String(e.id)===String(t.posSaleId)||e.invoiceId&&String(e.invoiceId)===String(t.id)):null}function Ar(e,t,{method:n,note:r,paidAt:i}){if(!t.tenantId)return;let a=e.tenants.find(e=>String(e.id)===String(t.tenantId));a&&(a.payments=a.payments||[],!a.payments.some(e=>String(e.invoiceId)===String(t.id))&&a.payments.push({id:E(a.payments),date:k(),amount:D(t.amount),type:t.source===`pos`?`POS — ${t.item}`:`Invoice — ${t.item}`,method:n,note:r||t.number,invoiceId:t.id,createdAt:i}))}function jr(e,{method:t=`Virtual Account BCA`,note:n=``}={}){T(r=>{let i=r.manualInvoices.find(t=>String(t.id)===String(e));if(!i)throw Error(`Invoice tidak ditemukan.`);if(i.status===`paid`)return;let a=new Date().toISOString();i.paid=i.amount,i.amountPaid=i.amount,i.change=0,i.status=`paid`,i.paidAt=a,i.method=t,i.note=n;let o=kr(r,i);o&&(o.status=`paid`,o.paidAt=a,o.method=t,o.amountPaid=D(i.amount),o.change=0),Ar(r,i,{method:t,note:n,paidAt:a})})}function Mr(e){T(t=>{let n=t.manualInvoices.find(t=>String(t.id)===String(e));if(!n)return;n.paid=0,n.amountPaid=0,n.change=0,n.status=`unpaid`,n.paidAt=null,n.method=``;let r=kr(t,n);r&&(r.status=`unpaid`,r.paidAt=null,r.amountPaid=0,r.change=0,r.method=``);for(let e of t.tenants||[])e.payments=(e.payments||[]).filter(e=>String(e.invoiceId)!==String(n.id)&&String(e.billId)!==String(n.id))})}function Nr(e){T(t=>{let n=kr(t,t.manualInvoices.find(t=>String(t.id)===String(e)));n&&(t.posSales=(t.posSales||[]).filter(e=>String(e.id)!==String(n.id)));for(let n of t.tenants||[])n.payments=(n.payments||[]).filter(t=>String(t.invoiceId)!==String(e)&&String(t.billId)!==String(e));t.manualInvoices=t.manualInvoices.filter(t=>String(t.id)!==String(e))})}function Pr(){return String(R().catalogAdminKey||``).trim()}async function Fr(e){let t=Pr();if(!t)throw Error(`Kunci admin belum diisi. Buka Pengaturan → Landing page & katalog publik.`);if(!await Rt())throw Error(`Sinkronisasi data belum siap. Periksa koneksi dan kunci admin, lalu coba lagi.`);let n=await fetch(`/api/payments/doku/create`,{method:`POST`,headers:{"Content-Type":`application/json`,"x-admin-key":t},body:JSON.stringify(e)});if(!(n.headers.get(`content-type`)||``).includes(`application/json`))throw Error("API pembayaran DOKU tidak tersedia. Gunakan production atau jalankan `vercel dev`.");let r=await n.json().catch(()=>({}));if(!n.ok){let e=String(r.error||`Gagal membuat link pembayaran DOKU.`);throw/PAYMENT CHANNEL IS INACTIVE/i.test(e)?Error(`Channel DOKU masih nonaktif. Aktifkan QRIS/VA/e-wallet di DOKU Back Office terlebih dahulu.`):(/sinkronisasi/i.test(e),Error(e))}return r}function Ir(e){return Fr({kind:`bill`,recordId:e.id})}function Lr(e){return Fr({kind:`invoice`,recordId:e.id})}function Rr(e){return Fr({kind:`renewal`,renewal:e})}function zr(e){let t=String(e||``);return/^\d{14}$/.test(t)?`${t.slice(0,4)}-${t.slice(4,6)}-${t.slice(6,8)} ${t.slice(8,10)}:${t.slice(10,12)}`:t}function Br(e){if(navigator.clipboard?.writeText)return navigator.clipboard.writeText(e);let t=document.createElement(`textarea`);t.value=e,t.style.position=`fixed`,t.style.opacity=`0`,document.body.appendChild(t),t.select();try{document.execCommand(`copy`)}finally{t.remove()}return Promise.resolve()}function Vr({title:e=`Link Pembayaran DOKU`,subtitle:t=``,paymentUrl:n,invoiceNumber:r=``,amount:i=0,expiresAt:a=``,phone:o=``,email:s=``,recipientName:c=``,message:l=``}){if(!n){L(`Link pembayaran tidak tersedia.`,`error`);return}let u=`${l}${l?`

`:``}Link pembayaran: ${n}`,d=o?tt(o,u):``;V({title:e,subtitle:t,size:`md`,body:`
      <div class="space-y-4">
        <div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <div class="flex items-start gap-3">
            <span class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              ${N(`CreditCard`,`w-5 h-5`)}
            </span>
            <div class="min-w-0">
              <p class="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">Link pembayaran siap</p>
              <p class="text-xl font-black text-emerald-900 mt-1">${O(i)}</p>
              ${r?`<p class="text-[11px] font-semibold text-emerald-800 mt-0.5">${P(r)}</p>`:``}
            </div>
          </div>
        </div>

        <div>
          <label class="label" for="pay-link">Link DOKU</label>
          <div class="flex gap-2">
            <input id="pay-link" type="text" class="input font-mono text-[11px]" readonly value="${P(n)}" />
            <button type="button" class="btn-outline btn-sm shrink-0" data-copy-link>${N(`Copy`,`w-4 h-4`)} Salin</button>
          </div>
          ${a?`<p class="hint mt-1">Berlaku sampai: ${P(zr(a))}</p>`:``}
        </div>

        <div class="rounded-xl border border-line bg-cream/60 px-3 py-2.5 text-[11px] text-stone-600 leading-relaxed">
          Status pembayaran akan <b>otomatis diperbarui</b> setelah pelanggan membayar di halaman DOKU.
          Tidak perlu verifikasi manual.
        </div>

        <div class="flex flex-wrap gap-2">
          <a href="${P(n)}" target="_blank" rel="noopener" class="btn-primary btn-sm">
            ${N(`ExternalLink`,`w-4 h-4`)} Buka halaman pembayaran
          </a>
          ${d?`<a href="${d}" target="_blank" rel="noopener" class="btn-outline btn-sm text-emerald-700">
                  ${N(`MessageCircle`,`w-4 h-4`)} Kirim via WhatsApp
                </a>`:``}
          ${s?`<button type="button" class="btn-outline btn-sm text-brand" data-send-email>${N(`Send`,`w-4 h-4`)} Kirim via Email</button>`:``}
        </div>
      </div>
    `,footer:`<button type="button" class="btn-outline btn-sm" data-modal-close>Tutup</button>`,onMount(o,l){o.querySelector(`[data-copy-link]`)?.addEventListener(`click`,async()=>{try{await Br(n),L(`Link pembayaran disalin.`)}catch{o.querySelector(`#pay-link`)?.select(),L(`Salin link secara manual.`,`warning`)}}),o.querySelector(`[data-send-email]`)?.addEventListener(`click`,async o=>{let l=o.currentTarget;l.disabled=!0;try{(await zn({to:s,name:c||t,title:e,invoiceNumber:r,amount:i,paymentUrl:n,expiresAt:a})).sent?L(`Tagihan berhasil dikirim ke ${s}.`):L(`Email belum dikonfigurasi. Aplikasi email perangkat dibuka sebagai gantinya.`,`warning`)}catch(e){L(e.message,`error`)}finally{l.disabled=!1}}),o.querySelector(`[data-modal-close]`)?.addEventListener(`click`,l)}})}function U(e,t){if(!e)throw Error(t)}function Hr(){return w().rooms}function W(e){return w().rooms.find(t=>String(t.id)===String(e))||null}function G(e){return w().tenants.find(t=>String(t.id)===String(e))||null}function Ur({activeOnly:e=!1}={}){let t=w().tenants;return(e?t.filter(e=>e.status===`aktif`):[...t]).sort((e,t)=>e.name.localeCompare(t.name,`id`))}function Wr(e){if(!e)return null;if(e.roomId){let t=W(e.roomId);if(t)return t}return null}function Gr({nomor:e,lantai:t}){let n=String(e||``).trim(),r=String(t||``).trim();U(/^\d{2,4}$/.test(n),`Nomor kamar harus berupa 2–4 digit angka.`),U([`2`,`3`].includes(r),`Lantai tidak valid.`),U(!w().rooms.some(e=>e.nomor===n),`Kamar ${n} sudah ada.`),T(e=>{e.rooms.push({id:E(e.rooms),nomor:n,lantai:r,status:`kosong`,tenantId:null,booking:null,photo:``,photoUrl:``})})}function Kr(e){let t=String(e||``).trim();if(!t)return``;let n=/^data:image\/(jpeg|png|webp);base64,/i.test(t),r=/^https?:\/\//i.test(t),i=t.startsWith(`/api/catalog/photo`);return U(n||r||i,`Format foto tidak didukung.`),t}function qr(e,t){let n=W(e);U(n,`Kamar tidak ditemukan.`);let r=Kr(t),i=JSON.stringify(w()).length,a=String(n.photo||``).length;if(r&&i-a+r.length>46e5)throw Error(`Penyimpanan foto hampir penuh. Hapus foto kamar lain atau gunakan foto yang lebih kecil.`);return T(t=>{let n=t.rooms.find(t=>String(t.id)===String(e));n.photo=r,r||(n.photoUrl=``),n.photoUpdatedAt=new Date().toISOString()}),W(e)}function Jr(e){let t=W(e);t&&(U(t.status===`kosong`&&!t.booking,`Hanya kamar kosong tanpa booking yang dapat dihapus.`),T(t=>{t.rooms=t.rooms.filter(t=>String(t.id)!==String(e))}))}function Yr(e){let t=String(e.name||``).trim(),n=String(e.phone||``).trim(),r=String(e.email||``).trim();return U(t.length>=2,`Nama penghuni wajib diisi.`),U(n.length>=8,`Nomor WhatsApp wajib diisi dengan benar.`),r&&U(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r),`Format email tidak valid.`),U(u.includes(String(e.periode)),`Skema periode tidak valid.`),{name:t,phone:n,email:r}}function Xr(e){return(e||[]).filter(e=>e&&e.name).map(e=>({id:e.id??null,name:String(e.name),price:Math.max(0,Math.round(D(e.price)))}))}function Zr(e){let t=Xr(e.addons);return e.car&&!_n(t)&&t.push(gn()),t}function Qr(e){return{promoId:e.promo?.id??null,promoName:e.promo?.name??``,promoType:e.promo?.type??``,promoValue:e.promo?.value??0}}function $r(e,t){return un({lantai:e.lantai,periode:t.periode,startDate:t.startDate,endDate:t.endDate,promo:t.promo||null,addons:t.addons||[],depositEnabled:!!t.depositEnabled,depositValue:t.depositValue,depositPaid:t.depositPaidNow!==!1,payOption:t.payOption===`full`?`full`:`partial`})}function ei(e,{date:t=k(),method:n=`Tunai / Cash`,note:r=``}={}){let i=Math.max(0,Math.round(D(e)));return i?{id:Date.now()+Math.floor(Math.random()*1e3),type:`in`,amount:i,date:t,method:n,note:r,createdAt:new Date().toISOString()}:null}function ti(e,t){let n=W(e);U(n,`Kamar tidak ditemukan.`),U(n.status!==`terisi`,`Kamar sedang dihuni. Gunakan perpanjangan atau pindah kamar.`);let r=Yr(t),i=Zr(t),a=$r(n,{...t,addons:i});return T(n=>{let o=n.rooms.find(t=>String(t.id)===String(e));o.status=`booking`,o.tenantId=null,o.booking={name:r.name,phone:r.phone,email:r.email,job:String(t.job||``).trim(),notes:String(t.notes||``).trim(),emergencyContact:{name:String(t.emergencyContact?.name||``).trim(),relation:String(t.emergencyContact?.relation||``).trim(),phone:String(t.emergencyContact?.phone||``).trim()},periode:a.periode,startDate:a.startDate,endDate:a.endDate,addons:i,...Qr(a),base:a.base,discount:a.discount,rentTotal:a.rentTotal,addonTotal:a.addonTotal,grandTotal:a.grandTotal,deposit:a.deposit,depositPaid:a.depositPaidAmount,depositRefunded:0,depositHistory:a.depositPaidAmount?[ei(a.depositPaidAmount,{note:`Deposit booking`,date:k()})].filter(Boolean):[],payOption:a.payOption,payNow:a.payNow,remaining:a.remaining,monthlyCharge:a.monthlyCharge,createdAt:o.booking?.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString()}}),W(e)}function ni(e){let t=W(e);t&&(U(t.status===`booking`,`Kamar ini tidak memiliki booking aktif.`),T(t=>{let n=t.rooms.find(t=>String(t.id)===String(e));n.status=`kosong`,n.tenantId=null,n.booking=null}))}function ri(e,t,{amount:n,type:r,method:i=`Tunai / Cash`,note:a=``,billId:o=null,date:s}){let c=Math.max(0,Math.round(D(n)));c&&(e.payments=e.payments||[],e.payments.push({id:E(e.payments),date:s||k(),amount:c,type:r,method:i,note:a,billId:o}))}function ii(e,t,n,r,i,a=r.deposit){let o=new Date().toISOString(),s=Math.max(0,Math.round(D(a))),c=Array.isArray(n.depositHistory)?n.depositHistory:[],l={id:E(e.tenants),name:n.name,phone:n.phone,email:n.email||``,job:n.job||``,notes:n.notes||``,emergencyContact:n.emergencyContact||{name:``,relation:``,phone:``},roomId:t.id,roomNumber:t.nomor,floor:t.lantai,periode:r.periode,startDate:r.startDate,endDate:r.endDate,addons:Xr(n.addons),...Qr(r),base:r.base,discount:r.discount,rentTotal:r.rentTotal,addonTotal:r.addonTotal,contractTotal:r.grandTotal,monthlyCharge:r.monthlyCharge,deposit:r.deposit,depositPaid:s,depositRefunded:0,depositHistory:c.length?c:s?[ei(s,{note:`Deposit check-in`,date:r.startDate})].filter(Boolean):[],totalPaid:Math.max(0,Math.round(D(i))),status:`aktif`,checkinDate:r.startDate,checkoutDate:null,stayHistory:[{roomId:t.id,roomNumber:t.nomor,floor:t.lantai,from:r.startDate,to:null}],payments:[],createdAt:o,updatedAt:o};e.tenants.push(l);let u=l.totalPaid>=r.grandTotal-.5,d=r.grandTotal>0?br(e,{tenantId:l.id,roomId:t.id,type:`Sewa`,description:`${r.periodLabel} • ${r.startDate} s/d ${r.endDate}`,amount:r.grandTotal,paid:u,dueDate:r.startDate,periodStart:r.startDate,periodEnd:r.endDate,source:`rent`}):null;return s>0&&ri(l,e,{amount:s,type:`Deposit`,note:`Deposit check-in`,date:r.startDate}),l.totalPaid>0&&ri(l,e,{amount:l.totalPaid,type:`Sewa`,note:`Pembayaran check-in`,billId:d?.id??null,date:r.startDate}),t.status=`terisi`,t.tenantId=l.id,t.booking=null,l}function ai(e,t){let n=W(e);U(n,`Kamar tidak ditemukan.`),U(n.status===`kosong`,`Kamar ini tidak kosong. Muat ulang data.`);let r=Yr(t),i=Zr(t),a=$r(n,{...t,addons:i}),o=a.payOption===`full`?a.grandTotal:0,s;return T(n=>{s=ii(n,n.rooms.find(t=>String(t.id)===String(e)),{...r,job:t.job,notes:t.notes,emergencyContact:t.emergencyContact,addons:i},a,o,a.depositPaidAmount)}),s}function oi(e,{settle:t=!0}={}){let n=W(e);U(n?.booking,`Booking tidak ditemukan.`);let r=n.booking,i={periode:r.periode,startDate:r.startDate,endDate:r.endDate,periodLabel:r.periode===`harian`?`Harian`:r.periode===`mingguan`?`Mingguan`:`${r.periode} Bulan`,base:r.base,discount:r.discount,rentTotal:r.rentTotal,addonTotal:r.addonTotal,grandTotal:r.grandTotal,deposit:r.deposit,monthlyCharge:r.monthlyCharge,promo:r.promoId?{id:r.promoId,name:r.promoName,type:r.promoType,value:r.promoValue}:null},a=r.payOption===`full`?r.grandTotal:0,o=t?i.grandTotal:a,s;return T(t=>{s=ii(t,t.rooms.find(t=>String(t.id)===String(e)),{name:r.name,phone:r.phone,email:r.email||``,job:r.job,notes:r.notes,emergencyContact:r.emergencyContact,addons:r.addons,depositHistory:r.depositHistory||[]},i,o,D(r.depositPaid))}),s}function si(e,t){let n=G(e);U(n,`Penghuni tidak ditemukan.`),U(n.status===`aktif`,`Penghuni sudah tidak aktif.`);let r=Wr(n);U(r,`Kamar penghuni tidak ditemukan.`);let i=t.startDate||A(n.endDate,1);U(i>=n.endDate,`Tanggal mulai perpanjangan tidak boleh sebelum akhir kontrak berjalan.`);let a=Xr(t.addons??n.addons),o=$r(r,{...t,startDate:i,addons:a}),s=o.payOption===`full`?o.grandTotal:0;return T(t=>{let n=t.tenants.find(t=>String(t.id)===String(e));n.periode=o.periode,n.endDate=o.endDate,n.startDate=n.startDate||o.startDate,n.addons=a,Object.assign(n,Qr(o)),n.base=o.base,n.discount=o.discount,n.rentTotal=D(n.rentTotal)+o.rentTotal,n.addonTotal=D(n.addonTotal)+o.addonTotal,n.contractTotal=D(n.contractTotal)+o.grandTotal,n.monthlyCharge=o.monthlyCharge,n.totalPaid=D(n.totalPaid)+s,n.updatedAt=new Date().toISOString();let i=o.grandTotal>0?br(t,{tenantId:n.id,roomId:r.id,type:`Perpanjangan`,description:`${o.periodLabel} • ${o.startDate} s/d ${o.endDate}`,amount:o.grandTotal,paid:s>=o.grandTotal,dueDate:o.startDate,periodStart:o.startDate,periodEnd:o.endDate,source:`rent`}):null;s>0&&ri(n,t,{amount:s,type:`Perpanjangan`,note:`Pembayaran perpanjangan`,billId:i?.id??null,date:o.startDate})}),G(e)}function ci(e,t,n=k()){let r=G(e);U(r,`Penghuni tidak ditemukan.`),U(r.status===`aktif`,`Penghuni sudah tidak aktif.`);let i=Wr(r),a=W(t);return U(a,`Kamar tujuan tidak ditemukan.`),U(a.status===`kosong`,`Kamar tujuan tidak kosong.`),U(!i||i.id!==a.id,`Kamar tujuan sama dengan kamar saat ini.`),T(t=>{let r=t.tenants.find(t=>String(t.id)===String(e));if(i){let e=t.rooms.find(e=>String(e.id)===String(i.id));e&&(e.status=`kosong`,e.tenantId=null,e.booking=null)}let o=t.rooms.find(e=>String(e.id)===String(a.id));o.status=`terisi`,o.tenantId=r.id,o.booking=null,r.roomId=o.id,r.roomNumber=o.nomor,r.floor=o.lantai,r.updatedAt=new Date().toISOString();let s=r.stayHistory||[],c=[...s].reverse().find(e=>!e.to);c&&(c.to=n),s.push({roomId:o.id,roomNumber:o.nomor,floor:o.lantai,from:n,to:null}),r.stayHistory=s}),G(e)}function li(e,t=k()){let n=G(e);U(n,`Penghuni tidak ditemukan.`),U(n.status===`aktif`,`Penghuni sudah tidak aktif.`);let r=Wr(n);return T(n=>{let i=n.tenants.find(t=>String(t.id)===String(e));if(r){let e=n.rooms.find(e=>String(e.id)===String(r.id));e&&(e.status=`kosong`,e.tenantId=null,e.booking=null)}i.status=`checkout`,i.checkoutDate=t,i.roomId=null,i.updatedAt=new Date().toISOString();let a=[...i.stayHistory||[]].reverse().find(e=>!e.to);a&&(a.to=t)}),G(e)}function ui(e,t){let n=G(e);U(n,`Penghuni tidak ditemukan.`);let r=String(t.name??n.name).trim();return U(r.length>=2,`Nama penghuni wajib diisi.`),T(n=>{let i=n.tenants.find(t=>String(t.id)===String(e));i.name=r,t.phone!==void 0&&(i.phone=String(t.phone).trim()),t.email!==void 0&&(i.email=String(t.email).trim()),t.job!==void 0&&(i.job=String(t.job).trim()),t.notes!==void 0&&(i.notes=String(t.notes).trim()),t.emergencyContact!==void 0&&(i.emergencyContact={name:String(t.emergencyContact.name||``).trim(),relation:String(t.emergencyContact.relation||``).trim(),phone:String(t.emergencyContact.phone||``).trim()}),i.updatedAt=new Date().toISOString()}),G(e)}function di(e){let t=G(e);U(t,`Penghuni tidak ditemukan.`),U(t.status===`checkout`,`Checkout penghuni terlebih dahulu sebelum menghapus data.`),T(t=>{t.tenants=t.tenants.filter(t=>String(t.id)!==String(e)),t.bills.forEach(t=>{String(t.tenantId)===String(e)&&(t.tenantId=null)}),t.manualInvoices.forEach(t=>{String(t.tenantId)===String(e)&&(t.tenantId=null)})})}function fi(e){let t=w();return t.bills.filter(t=>String(t.tenantId)===String(e)&&t.status===`unpaid`).reduce((e,t)=>e+D(t.amount-t.paid),0)+t.manualInvoices.filter(t=>String(t.tenantId)===String(e)&&t.status===`unpaid`).reduce((e,t)=>e+D(t.amount-t.paid),0)}function pi(e){let t=e?.checkinDate||e?.startDate;if(!t)return 0;let n=e?.status===`aktif`?k():e?.checkoutDate||e?.endDate||k();return Math.max(0,Ye(t,n))}function mi(e){let t=pi(e);if(t<1){let t=e?.checkinDate||e?.startDate;return t&&t>k()?`Belum mulai`:`Baru check-in`}if(t<31)return`${t} hari`;let n=Math.floor(t/30);if(n<12){let e=t%30;return e?`${n} bln ${e} hr`:`${n} bulan`}let r=Math.floor(n/12),i=n%12;return i?`${r} thn ${i} bln`:`${r} tahun`}function hi(e,t={}){return U(G(e),`Penghuni tidak ditemukan.`),T(n=>{let r=n.tenants.find(t=>String(t.id)===String(e));r.pendingRenewal={paymentId:t.paymentId||``,amount:Math.max(0,Math.round(D(t.amount))),paymentUrl:String(t.paymentUrl||``),createdAt:t.createdAt||k(),expiresAt:t.expiresAt||``},r.updatedAt=new Date().toISOString()}),G(e)}function gi(e){return G(e)?(T(t=>{let n=t.tenants.find(t=>String(t.id)===String(e));n&&(n.pendingRenewal=null,n.updatedAt=new Date().toISOString())}),G(e)):null}function _i(){let e=w(),t=e.rooms,n=t.length,r=t.filter(e=>e.status===`terisi`).length,i=t.filter(e=>e.status===`kosong`).length,a=t.filter(e=>e.status===`booking`).length,o=Ei(),s=e.bills.filter(e=>e.status===`unpaid`).reduce((e,t)=>e+D(t.amount-t.paid),0),c=e.manualInvoices.filter(e=>e.status===`unpaid`).reduce((e,t)=>e+D(t.amount-t.paid),0);return{total:n,occupied:r,vacant:i,booking:a,occupancy:n?r/n*100:0,revenue:o.revenue,expenses:o.expenses,profit:o.net,posRevenue:o.posRevenue,outstanding:s+c,expiring:xi(7),pendingRenewals:Si(),overdue:wi(),checkins:yi(),unpaidBills:Ci(),floors:vi()}}function vi(){let e=w().rooms;return[...new Set(e.map(e=>e.lantai))].sort().map(t=>{let n=e.filter(e=>e.lantai===t),r=n.filter(e=>e.status===`terisi`).length,i=n.filter(e=>e.status===`kosong`).length,a=n.filter(e=>e.status===`booking`).length;return{floor:t,total:n.length,occupied:r,vacant:i,booking:a,occupancy:n.length?r/n.length*100:0}})}function yi(){return w().rooms.filter(e=>e.status===`booking`&&e.booking).map(e=>({room:e,booking:e.booking})).sort((e,t)=>String(e.booking.startDate).localeCompare(String(t.booking.startDate)))}function bi(e,t){let n=e.pendingRenewal;return n?!n.expiresAt||n.expiresAt>=t:!1}function xi(e=7){let t=k();return w().tenants.filter(e=>e.status===`aktif`&&e.endDate).filter(e=>!bi(e,t)).map(e=>({tenant:e,roomNumber:e.roomNumber,daysLeft:Ye(t,e.endDate)})).filter(t=>t.daysLeft<=e).sort((e,t)=>e.daysLeft-t.daysLeft)}function Si(){let e=k();return w().tenants.filter(t=>t.status===`aktif`&&t.pendingRenewal&&bi(t,e)).map(e=>({tenant:e,amount:D(e.pendingRenewal.amount),paymentUrl:e.pendingRenewal.paymentUrl||``,paymentId:e.pendingRenewal.paymentId||``,expiresAt:e.pendingRenewal.expiresAt||``})).sort((e,t)=>String(e.expiresAt).localeCompare(String(t.expiresAt)))}function Ci(){return w().bills.filter(e=>e.status===`unpaid`).sort((e,t)=>String(e.dueDate).localeCompare(String(t.dueDate)))}function wi(){let e=w(),t=k(),n=new Map;for(let r of e.bills){if(r.status===`paid`||!r.dueDate||r.dueDate>t)continue;let i=r.tenantId?e.tenants.find(e=>String(e.id)===String(r.tenantId)):null;if(!i||i.status!==`aktif`)continue;let a=String(i.id),o=Math.max(0,Ye(r.dueDate,t)),s=Math.max(0,D(r.amount)-D(r.paid));if(s<=0)continue;let c=n.get(a)||{tenant:i,name:i.name,phone:i.phone||``,roomNumber:i.roomNumber||`—`,daysOverdue:0,dueDate:r.dueDate,amount:0,bills:[]};c.amount+=s,c.daysOverdue=Math.max(c.daysOverdue,o),r.dueDate<c.dueDate&&(c.dueDate=r.dueDate),c.bills.push(r),n.set(a,c)}return[...n.values()].map(e=>({...e,bills:[...e.bills].sort((e,t)=>String(e.dueDate).localeCompare(String(t.dueDate)))})).sort((e,t)=>t.daysOverdue-e.daysOverdue||e.name.localeCompare(t.name,`id`))}function Ti(){let e=w(),t=[];for(let n of e.tenants.filter(e=>e.status===`aktif`)){let e=Math.max(0,D(n.monthlyCharge)),r=Math.max(0,D(n.totalPaid)),i=e,a=Math.max(0,r-e),o=Math.max(0,e-r);t.push({tenant:n,name:n.name,roomNumber:n.roomNumber||`—`,paid:r,monthlyCharge:e,recognized:i,deferred:a,outstanding:o})}return t.sort((e,t)=>e.name.localeCompare(t.name,`id`)),{rows:t,totalRecognized:t.reduce((e,t)=>e+t.recognized,0),totalDeferred:t.reduce((e,t)=>e+t.deferred,0),totalPaid:t.reduce((e,t)=>e+t.paid,0),totalOutstanding:t.reduce((e,t)=>e+t.outstanding,0)}}function Ei(e=new Date){let t=w(),n=Ti(),r=t.manualInvoices.filter(t=>t.source!==`pos`&&t.status===`paid`&&$e(t.paidAt,e)).reduce((e,t)=>e+D(t.paid),0),i=(t.posSales||[]).filter(t=>t.status===`paid`&&$e(t.date||t.createdAt,e)).reduce((e,t)=>e+D(t.total),0),a=t.expenses.filter(t=>$e(t.date,e)),o=a.reduce((e,t)=>e+D(t.amount),0),s=a.reduce((e,t)=>{let n=t.category||`Lain-lain`;return e[n]=(e[n]||0)+D(t.amount),e},{}),c=n.totalRecognized,l=c+r+i;return{rentRevenue:c,serviceRevenue:r,posRevenue:i,revenue:l,expenses:o,expenseByCategory:Object.entries(s).sort((e,t)=>t[1]-e[1]),net:l-o}}function Di(e=6,t=new Date){let n=w(),r=[];for(let n=e-1;n>=0;--n){let e=new Date(t.getFullYear(),t.getMonth()-n,1);r.push({key:Qe(e),label:e.toLocaleDateString(`id-ID`,{month:`short`}),income:0,expense:0})}let i=new Map(r.map(e=>[e.key,e]));for(let e of n.bills){if(e.status!==`paid`||!e.paidAt)continue;let t=i.get(Qe(e.paidAt));t&&(t.income+=D(e.paid))}for(let e of n.manualInvoices){if(e.source===`pos`||e.status!==`paid`||!e.paidAt)continue;let t=i.get(Qe(e.paidAt));t&&(t.income+=D(e.paid))}for(let e of n.posSales||[]){if(e.status!==`paid`)continue;let t=i.get(Qe(e.paidAt||e.date||e.createdAt));t&&(t.income+=D(e.total))}for(let e of n.expenses){let t=i.get(Qe(e.date));t&&(t.expense+=D(e.amount))}return r.map(e=>({...e,net:e.income-e.expense}))}function Oi(){return{...b,...w().templates||{}}}function ki(e){let t={...Oi(),...e};for(let[e,n]of Object.entries(t))if(!String(n||``).trim())throw Error(`Template "${e}" tidak boleh kosong.`);T(e=>{e.templates=t})}function Ai(e,t={}){return(Oi()[e]||``).replace(/\{([a-z_]+)\}/gi,(e,n)=>{let r=t[n];return r==null?e:String(r)})}var ji={nama:`Rani Putri`,kamar:`204`,nominal:O(22e5),jatuh_tempo:j(new Date().toISOString().slice(0,10)),no_invoice:`SRV/202610/0001`,item_layanan:`Laundry 5 Kg`};function Mi(e){let t=s[e]||s.kosong;return`<span class="${t.badge}">${t.label}</span>`}function Ni(e){let t=c[e]||c.unpaid;return`<span class="${t.badge}">${t.label}</span>`}function K({eyebrow:e=``,eyebrowClass:t=`badge-gold`,title:n=``,subtitle:r=``,actions:i=``}){return`
    <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
      <div class="min-w-0">
        ${e?`<span class="${t}">${P(e)}</span>`:``}
        <h1 class="page-title mt-2">${n}</h1>
        ${r?`<p class="page-subtitle">${r}</p>`:``}
      </div>
      ${i?`<div class="flex flex-wrap items-center gap-2 shrink-0">${i}</div>`:``}
    </div>
  `}var Pi={default:{card:`card`,label:`text-stone-600`,value:`text-stone-800`,iconBox:`bg-stone-100 text-stone-600`},green:{card:`card bg-emerald-50/60 border-emerald-200`,label:`text-emerald-800`,value:`text-emerald-900`,iconBox:`bg-emerald-100 text-emerald-700`},amber:{card:`card bg-amber-50/60 border-amber-200`,label:`text-amber-800`,value:`text-amber-900`,iconBox:`bg-amber-100 text-amber-700`},indigo:{card:`card bg-indigo-50/60 border-indigo-200`,label:`text-indigo-800`,value:`text-indigo-900`,iconBox:`bg-indigo-100 text-indigo-700`},teal:{card:`card bg-teal-50/60 border-teal-200`,label:`text-teal-800`,value:`text-teal-900`,iconBox:`bg-teal-100 text-teal-700`},brand:{card:`card bg-brand text-white border-brand`,label:`text-gold`,value:`text-white`,iconBox:`bg-white/10 text-gold`},rose:{card:`card bg-rose-50/60 border-rose-200`,label:`text-rose-800`,value:`text-rose-900`,iconBox:`bg-rose-100 text-rose-700`}};function q({label:e,value:t,iconName:n=`CircleDollarSign`,tone:r=`default`,hint:i=``}){let a=Pi[r]||Pi.default;return`
    <div class="${a.card} p-4 rounded-2xl">
      <div class="flex items-start justify-between gap-2">
        <p class="text-[11px] font-bold uppercase tracking-wider ${a.label}">${P(e)}</p>
        <span class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${a.iconBox}">${N(n,`w-4 h-4`)}</span>
      </div>
      <p class="text-2xl font-black mt-1.5 ${a.value}">${t}</p>
      ${i?`<p class="text-[11px] mt-1 ${a.label}">${i}</p>`:``}
    </div>
  `}function Fi(e,t=`Belum ada data.`){return`<tr><td colspan="${e}" class="px-4 py-10 text-center text-stone-600 text-sm">${P(t)}</td></tr>`}function Ii({iconName:e=`Inbox`,title:t=`Belum ada data`,description:n=``,action:r=``}){return`
    <div class="flex flex-col items-center justify-center text-center px-6 py-14">
      <div class="w-14 h-14 rounded-2xl bg-stone-100 text-stone-600 flex items-center justify-center mb-3">
        ${N(e,`w-7 h-7`)}
      </div>
      <h2 class="font-extrabold text-stone-700">${P(t)}</h2>
      ${n?`<p class="text-sm text-stone-500 mt-1 max-w-sm">${P(n)}</p>`:``}
      ${r?`<div class="mt-4">${r}</div>`:``}
    </div>
  `}function Li(e,t=`w-10 h-10 text-xs`){return`<span class="inline-flex items-center justify-center rounded-full bg-brand text-gold font-extrabold shrink-0 ${t}">${P(nt(e))}</span>`}function J({title:e,description:t=``,actions:n=``}){return`
    <div class="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-line">
      <div>
        <h2 class="font-extrabold text-stone-800 text-sm">${P(e)}</h2>
        ${t?`<p class="text-xs text-stone-500 mt-0.5">${P(t)}</p>`:``}
      </div>
      ${n?`<div class="flex items-center gap-2">${n}</div>`:``}
    </div>
  `}function Ri(e,t=`bg-emerald-500`){return`
    <div class="h-2 rounded-full bg-stone-200/80 overflow-hidden">
      <div class="h-full rounded-full ${t} transition-all duration-500" style="width:${Math.min(100,Math.max(0,Number(e)||0))}%"></div>
    </div>
  `}function zi(e){return`<p class="text-[11px] font-extrabold uppercase tracking-wider text-stone-600">${P(e)}</p>`}function Bi({activeOnly:e=!1}={}){let t=w().addons||[];return e?t.filter(e=>e.active):[...t]}function Vi({id:e=null,name:t,price:n,active:r=!0}){let i=String(t||``).trim(),a=Math.round(D(n));if(!i)throw Error(`Nama add-on wajib diisi.`);if(a<=0)throw Error(`Tarif add-on harus lebih dari 0.`);T(t=>{if(e){let n=t.addons.find(t=>String(t.id)===String(e));if(!n)throw Error(`Add-on tidak ditemukan.`);Object.assign(n,{name:i,price:a,active:!!r})}else t.addons.push({id:E(t.addons),name:i,price:a,active:!!r})})}function Hi(e){T(t=>{let n=t.addons.find(t=>String(t.id)===String(e));n&&(n.active=!n.active)})}function Ui(e){T(t=>{t.addons=t.addons.filter(t=>String(t.id)!==String(e))})}function Wi(e=`dep`){return`${e}-${Date.now()}-${Math.floor(Math.random()*1e4)}`}function Gi(e,t=k()){return String(e||t).slice(0,10)}function Ki(e,{kind:t,depositPaid:n,depositRefunded:r,fallbackDate:i}){let a=Array.isArray(e.depositHistory)?e.depositHistory:[];if(a.length)return a;let o=[];return n>0&&o.push({id:Wi(`dep-in`),type:`in`,kind:`payment`,amount:n,date:Gi(i),method:``,note:`Deposit tercatat sebelumnya`,createdAt:i||``}),r>0&&o.push({id:Wi(`dep-out`),type:`out`,kind:`refund`,amount:r,date:Gi(e.checkoutDate||i),method:``,note:`Pengembalian deposit sebelumnya`,createdAt:e.checkoutDate||``}),o}function qi(e){let t=Math.max(0,Math.round(D(e.deposit))),n=Math.max(0,Math.round(D(e.depositPaid))),r=Math.max(0,Math.round(D(e.depositRefunded))),i=Ki(e,{kind:`tenant`,depositPaid:n,depositRefunded:r,fallbackDate:e.checkinDate||e.startDate||e.createdAt});return{kind:`tenant`,id:e.id,tenantId:e.id,roomId:e.roomId,roomNumber:e.roomNumber||`—`,name:e.name,status:e.status,deposit:t,depositPaid:n,depositRefunded:r,depositHeld:Math.max(0,n-r),outstanding:Math.max(0,t-n),history:i,hasStoredHistory:Array.isArray(e.depositHistory)&&e.depositHistory.length>0}}function Ji(e){let t=e.booking,n=Math.max(0,Math.round(D(t.deposit))),r=Math.max(0,Math.round(D(t.depositPaid))),i=Math.max(0,Math.round(D(t.depositRefunded))),a=Ki(t,{kind:`booking`,depositPaid:r,depositRefunded:i,fallbackDate:t.createdAt||t.startDate});return{kind:`booking`,id:e.id,tenantId:null,roomId:e.id,roomNumber:e.nomor,name:t.name||`Booking`,status:`booking`,deposit:n,depositPaid:r,depositRefunded:i,depositHeld:Math.max(0,r-i),outstanding:Math.max(0,n-r),history:a,hasStoredHistory:Array.isArray(t.depositHistory)&&t.depositHistory.length>0}}function Yi(e,t,n){if(t===`booking`){let t=(e.rooms||[]).find(e=>String(e.id)===String(n));return t?.booking?{account:t.booking,room:t}:null}let r=(e.tenants||[]).find(e=>String(e.id)===String(n));return r?{account:r,tenant:r}:null}function Xi(){let e=w(),t=(e.tenants||[]).filter(e=>e.status===`aktif`||D(e.depositPaid)>D(e.depositRefunded)).map(e=>qi(e)),n=(e.rooms||[]).filter(e=>e.status===`booking`&&e.booking).map(e=>Ji(e));return[...t,...n].sort((e,t)=>String(e.roomNumber).localeCompare(String(t.roomNumber),void 0,{numeric:!0}))}function Zi(e,t){return Xi().find(n=>n.kind===e&&String(n.id)===String(t))||null}function Qi(){let e=Xi();return{accounts:e.length,target:e.reduce((e,t)=>e+t.deposit,0),paid:e.reduce((e,t)=>e+t.depositPaid,0),refunded:e.reduce((e,t)=>e+t.depositRefunded,0),held:e.reduce((e,t)=>e+t.depositHeld,0),outstanding:e.reduce((e,t)=>e+t.outstanding,0),unpaidCount:e.filter(e=>e.outstanding>0).length}}function $i(e,t,n){let r=Math.max(0,Math.round(D(n)));return T(n=>{let i=Yi(n,e,t);if(!i)throw Error(`Data deposit tidak ditemukan.`);i.account.deposit=r,i.account.updatedAt=new Date().toISOString()}),Zi(e,t)}function ea(e,t,n,{date:r=k(),method:i=`Tunai / Cash`,note:a=``,replaceHistory:o=!1}={}){let s=Math.max(0,Math.round(D(n))),c=null;return T(n=>{let l=Yi(n,e,t);if(!l)throw Error(`Data deposit tidak ditemukan.`);let{account:u}=l,d=Math.max(0,Math.round(D(u.depositPaid))),f=Array.isArray(u.depositHistory)?u.depositHistory:[],p=o?[]:[...f];if(!o&&!p.length&&d>0&&p.push({id:Wi(`dep-in`),type:`in`,kind:`payment`,amount:d,date:Gi(u.checkinDate||u.createdAt||r),method:``,note:`Deposit tercatat sebelumnya`,createdAt:``}),o)s>0&&p.push({id:Wi(`dep-in`),type:`in`,kind:`payment`,amount:s,date:Gi(r),method:i,note:a||`Impor status deposit`,createdAt:new Date().toISOString()});else{let e=s-d;e>0?p.push({id:Wi(`dep-in`),type:`in`,kind:`payment`,amount:e,date:Gi(r),method:i,note:a||`Pembayaran deposit`,createdAt:new Date().toISOString()}):e<0&&p.push({id:Wi(`dep-out`),type:`out`,kind:`adjustment`,amount:Math.abs(e),date:Gi(r),method:i,note:a||`Koreksi status deposit`,createdAt:new Date().toISOString()})}u.depositPaid=s,u.depositHistory=p,u.updatedAt=new Date().toISOString(),c=u}),c}function ta(e,t,n,{date:r=k(),method:i=`Tunai / Cash`,note:a=`Pengembalian deposit check-out`}={}){let o=Math.max(0,Math.round(D(n)));if(o<=0)throw Error(`Nominal pengembalian deposit harus lebih dari 0.`);let s=null;return T(n=>{let c=Yi(n,e,t);if(!c)throw Error(`Data deposit tidak ditemukan.`);let{account:l}=c,u=Math.max(0,Math.round(D(l.depositPaid))),d=Math.max(0,Math.round(D(l.depositRefunded))),f=Math.max(0,u-d);if(o>f)throw Error(`Nominal pengembalian melebihi deposit yang ditahan (${f}).`);let p=Array.isArray(l.depositHistory)?[...l.depositHistory]:[];!p.length&&u>0&&p.push({id:Wi(`dep-in`),type:`in`,kind:`payment`,amount:u,date:Gi(l.checkinDate||l.createdAt||r),method:``,note:`Deposit tercatat sebelumnya`,createdAt:``}),p.push({id:Wi(`dep-out`),type:`out`,kind:`refund`,amount:o,date:Gi(r),method:i,note:a,createdAt:new Date().toISOString()}),l.depositRefunded=d+o,l.depositHistory=p,l.updatedAt=new Date().toISOString(),s=l}),s}function na(){let e=w();return[...(e.tenants||[]).map(e=>qi(e)),...(e.rooms||[]).filter(e=>e.booking).map(e=>Ji(e))].flatMap(e=>e.history.map(t=>({...t,account:e,direction:t.type===`out`?`out`:`in`})))}var ra=e=>e===`harian`||e===`mingguan`;function ia(e){let t=dn({activeOnly:!0});return[`<option value="none" ${!e||e===`none`?`selected`:``}>Tanpa promo / diskon</option>`,...t.map(t=>{let n=t.type===`persen`?`${t.value}%`:O(t.value);return`<option value="${t.id}" ${String(t.id)===String(e)?`selected`:``}>${P(t.name)} — ${n}</option>`})].join(``)}function aa(){return[`<option value="">— Pilih layanan add-on —</option>`,...Bi({activeOnly:!0}).map(e=>`<option value="${e.id}">${P(e.name)} — ${O(e.price)}/bln</option>`)].join(``)}function oa(e){return e.length?e.map((e,t)=>`
      <div class="flex items-center justify-between gap-2 bg-white border border-amber-200 rounded-xl px-3 py-2">
        <div class="min-w-0">
          <p class="text-[11px] font-bold text-stone-700 truncate">${P(e.name)}</p>
          <p class="text-[10px] text-stone-500">${O(e.price)} / bulan</p>
        </div>
        <button type="button" class="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50" data-remove-addon="${t}" aria-label="Hapus ${P(e.name)}">
          ${N(`X`,`w-3.5 h-3.5`)}
        </button>
      </div>`).join(``):`<p class="text-[11px] text-stone-600 italic">Belum ada add-on dipilih.</p>`}function sa(e,t){let n=t===`extend`?`Total perpanjangan`:`Total tagihan sewa`;return[`<div class="flex justify-between gap-3"><span class="text-stone-500">Sewa (${e.units} ${e.unitLabel})</span><span class="font-bold">${O(e.base)}</span></div>`,e.discount>0?`<div class="flex justify-between gap-3 text-rose-700"><span>Diskon${e.promo?` (${P(e.promo.name)})`:``}</span><span class="font-bold">−${O(e.discount)}</span></div>`:``,e.addonTotal>0?`<div class="flex justify-between gap-3 text-amber-800"><span>Add-on</span><span class="font-bold">${O(e.addonTotal)}</span></div>`:``,`<div class="flex justify-between gap-3 pt-2 border-t border-line"><span class="font-bold text-stone-700">${n}</span><span class="font-extrabold text-stone-800">${O(e.grandTotal)}</span></div>`,e.deposit>0?`<div class="flex justify-between gap-3"><span class="text-stone-500">Deposit (jaminan)</span><span class="font-bold">${O(e.deposit)}</span></div>`:``,e.deposit>0&&!e.depositPaid?`<div class="flex justify-between gap-3 text-amber-800"><span>Deposit belum dibayar</span><span class="font-bold">${O(e.deposit)}</span></div>`:``,`<div class="flex justify-between gap-3 text-emerald-700"><span class="font-bold">Dibayar sekarang</span><span class="font-extrabold">${O(e.payNow)}</span></div>`,`<div class="flex justify-between gap-3 ${e.remaining>0?`text-rose-700`:`text-stone-500`}"><span class="font-semibold">Sisa tagihan</span><span class="font-extrabold">${O(e.remaining)}</span></div>`,`<div class="text-[10px] text-stone-600 pt-1">Periode: ${j(e.startDate)} — ${j(e.endDate)}</div>`].filter(Boolean).join(``)}function ca(e){return`
    <div class="flex items-start gap-2 text-rose-700">
      ${N(`CircleAlert`,`w-4 h-4 shrink-0 mt-0.5`)}
      <span class="font-semibold">${P(e)}</span>
    </div>
  `}var la={booking:{title:`Booking Kamar`,submit:`Simpan Booking`,iconName:`CalendarClock`},checkin:{title:`Check-in Kamar`,submit:`Proses Check-in`,iconName:`LogIn`},edit_booking:{title:`Edit Booking`,submit:`Simpan Perubahan`,iconName:`Pencil`},extend:{title:`Perpanjang Kontrak`,submit:`Simpan Perpanjangan`,iconName:`Repeat`}};function ua(e,t=`booking`,n=null){let r=W(e);if(!r){L(`Kamar tidak ditemukan.`,`error`);return}let i=n?G(n):null,a=r.booking,o=la[t]||la.booking,s=t===`extend`;if(s&&!i){L(`Data penghuni tidak ditemukan.`,`error`);return}if(t===`checkin`&&r.status!==`kosong`){L(`Kamar tidak kosong. Muat ulang halaman.`,`error`);return}let c=s?A(i.endDate,1):a?.startDate||k(),u=s?i.periode||`1`:a?.periode||`1`,d=s?`-`:a?.endDate||(ra(u)?A(c,u===`harian`?1:7):`-`),f=s?i.promoId||`none`:a?.promoId||`none`,p=(s?i.addons:a?.addons)||[],m=s?0:a?.deposit??an(),h=s?`full`:a?.payOption||(t===`checkin`?`full`:`partial`),g=s?!1:!a||a.deposit>0,_=s?!1:a&&a.deposit>0?Number(a.depositPaid)>0:!0,v=`
    <form id="bm-form" class="space-y-5" novalidate>
      ${s?`
      <div class="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-4">
        <div class="flex items-start gap-3">
          <span class="w-10 h-10 rounded-xl bg-white text-indigo-700 flex items-center justify-center shrink-0">${N(`UserCheck`,`w-5 h-5`)}</span>
          <div class="text-xs">
            <p class="font-extrabold text-stone-800 text-sm">${P(i.name)} — Kamar ${P(i.roomNumber||r.nomor)}</p>
            <p class="text-stone-600 mt-0.5">Kontrak berjalan: ${j(i.startDate)} — <b>${j(i.endDate)}</b></p>
            <p class="text-stone-500 mt-0.5">Perpanjangan dimulai otomatis sehari setelah kontrak berakhir.</p>
          </div>
        </div>
      </div>
    `:`
      <div class="grid sm:grid-cols-2 gap-3">
        <div>
          <label class="label" for="bm-name">Nama penghuni <span class="text-rose-500">*</span></label>
          <input id="bm-name" type="text" class="input" placeholder="Nama lengkap" value="${P(a?.name||``)}" required />
        </div>
        <div>
          <label class="label" for="bm-phone">No. WhatsApp <span class="text-rose-500">*</span></label>
          <input id="bm-phone" type="tel" class="input" placeholder="cth: 08123456789" value="${P(a?.phone||``)}" required />
        </div>
        <div>
          <label class="label" for="bm-email">Email penghuni</label>
          <input id="bm-email" type="email" class="input" placeholder="cth: nama@email.com" value="${P(a?.email||``)}" />
          <p class="hint mt-1">Dipakai untuk kirim tagihan & link pembayaran.</p>
        </div>
        <div class="sm:col-span-2">
          <label class="label" for="bm-job">Pekerjaan / Instansi</label>
          <input id="bm-job" type="text" class="input" placeholder="Mahasiswa / Karyawan" value="${P(a?.job||``)}" />
        </div>
      </div>
    `}

      <div class="grid sm:grid-cols-3 gap-3">
        <div>
          <label class="label" for="bm-periode">Skema periode</label>
          <select id="bm-periode" class="select">
            ${l.map(e=>`<option value="${e.key}" ${e.key===u?`selected`:``}>${e.label}</option>`).join(``)}
          </select>
        </div>
        <div>
          <label class="label" for="bm-start">Tanggal mulai</label>
          <input id="bm-start" type="date" class="input" value="${c}" />
        </div>
        <div id="bm-end-wrap" class="${ra(u)?``:`hidden`}">
          <label class="label" for="bm-end">Tanggal selesai</label>
          <input id="bm-end" type="date" class="input" value="${ra(u)?d:``}" />
        </div>
      </div>

      <div>
        <label class="label" for="bm-promo">Promo / diskon</label>
        <select id="bm-promo" class="select">${ia(f)}</select>
      </div>

      ${s?``:`
          <div class="rounded-2xl border border-line bg-stone-50/60 p-4 space-y-3">
            <p class="text-[11px] font-extrabold uppercase tracking-wider text-stone-500">Kontak darurat</p>
            <div class="grid sm:grid-cols-3 gap-2">
              <input id="bm-ec-name" type="text" class="input input-sm" placeholder="Nama kontak" value="${P(a?.emergencyContact?.name||``)}" />
              <input id="bm-ec-relation" type="text" class="input input-sm" placeholder="Hubungan" value="${P(a?.emergencyContact?.relation||``)}" />
              <input id="bm-ec-phone" type="tel" class="input input-sm" placeholder="No. telepon" value="${P(a?.emergencyContact?.phone||``)}" />
            </div>
          </div>
        `}

      <div class="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 space-y-3">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-extrabold uppercase tracking-wider text-amber-900">Layanan add-on</p>
          <span class="badge-gold">Opsional</span>
        </div>
        <div class="flex gap-2">
          <select id="bm-addon-select" class="select input-sm flex-1">${aa()}</select>
          <button type="button" class="btn-primary btn-sm shrink-0" data-add-addon>${N(`Plus`,`w-4 h-4`)} Tambah</button>
        </div>
        <div id="bm-addon-list" class="space-y-2">${oa(p)}</div>
      </div>

      <div class="grid sm:grid-cols-2 gap-4">
        ${s?``:`
            <div class="rounded-2xl border border-line bg-white p-4 space-y-2">
              <label class="flex items-center gap-2 cursor-pointer">
                <input id="bm-deposit-enabled" type="checkbox" class="w-4 h-4 accent-brand" ${g?`checked`:``} />
                <span class="text-xs font-bold text-stone-800">Kenakan deposit</span>
              </label>
              <div id="bm-deposit-wrap" class="${g?``:`hidden`} space-y-2">
                <input id="bm-deposit" type="number" min="0" step="1000" class="input input-sm" placeholder="Nominal deposit" value="${D(m)||``}" />
                <label class="flex items-center gap-2 cursor-pointer p-2 rounded-xl border border-line bg-white">
                  <input id="bm-deposit-paid" type="checkbox" class="w-4 h-4 accent-brand" ${_?`checked`:``} />
                  <span class="text-[11px] font-bold text-stone-700">Deposit sudah dibayar / diterima</span>
                </label>
              </div>
              <p class="hint">Deposit adalah uang jaminan, bukan DP sewa. Tidak dihitung sebagai pendapatan dan dikembalikan saat check-out sesuai ketentuan.</p>
            </div>
          `}
        <div class="rounded-2xl border border-line bg-white p-4 space-y-2">
          <p class="text-xs font-bold text-stone-800">Opsi pembayaran sewa</p>
          <label class="flex items-center gap-2 cursor-pointer p-2 rounded-xl border border-line hover:bg-stone-50">
            <input type="radio" name="bm-pay-option" value="partial" class="accent-brand" ${h===`partial`?`checked`:``} />
            <span class="text-xs font-semibold">${s?`Catat sebagai tagihan`:`Sewa belum dibayar (buat tagihan)`}</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer p-2 rounded-xl border border-line hover:bg-stone-50">
            <input type="radio" name="bm-pay-option" value="full" class="accent-brand" ${h===`full`?`checked`:``} />
            <span class="text-xs font-semibold">${s?`Lunas sekarang`:`Sewa lunas sekarang`}</span>
          </label>
        </div>
      </div>

      ${s?``:`
          <div>
            <label class="label" for="bm-notes">Catatan khusus / permintaan penghuni</label>
            <textarea id="bm-notes" rows="2" class="input" placeholder="cth: minta kamar dekat jendela">${P(a?.notes||``)}</textarea>
          </div>
        `}

      <div id="bm-summary" class="rounded-2xl border border-line bg-cream/70 p-4 text-xs space-y-2"></div>
    </form>
  `;V({title:`${o.title} — Kamar ${r.nomor}`,subtitle:s?`Perpanjang masa sewa penghuni aktif.`:`Lengkapi data untuk menghitung total otomatis.`,size:`xl`,body:v,footer:`
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      ${s&&z()?`<button type="button" class="btn-gold btn-sm" data-doku-extend>${N(`CreditCard`,`w-4 h-4`)} Buat Link DOKU</button>`:``}
      <button type="submit" form="bm-form" class="btn-primary btn-sm" data-submit>
        ${N(o.iconName,`w-4 h-4`)} ${o.submit}
      </button>
    `,onMount(e,n){let a=e.querySelector(`#bm-form`),o=e.querySelector(`#bm-summary`),s=e.querySelector(`#bm-addon-list`),c=e.querySelector(`#bm-periode`),l=e.querySelector(`#bm-start`),u=e.querySelector(`#bm-end`),d=e.querySelector(`#bm-end-wrap`),f=e.querySelector(`#bm-deposit-enabled`),m=e.querySelector(`#bm-deposit-paid`),h=e.querySelector(`#bm-deposit-wrap`),g=e.querySelector(`#bm-promo`),_=p.map(e=>({id:e.id??null,name:e.name,price:D(e.price)})),v=t=>e.querySelector(t)?.value.trim()??``,y=()=>e.querySelector(`input[name="bm-pay-option"]:checked`)?.value||`partial`,b=()=>fn(g.value);function x(){let e=ra(c.value);if(d.classList.toggle(`hidden`,!e),e){let e=c.value===`harian`?1:7,t=l.value||k();(!u.value||u.value<=t)&&(u.value=A(t,e))}}function S(){try{return un({lantai:r.lantai,periode:c.value,startDate:l.value,endDate:u.value||void 0,promo:b(),addons:_,depositEnabled:!!f?.checked,depositValue:D(v(`#bm-deposit`)),depositPaid:!!m?.checked,payOption:y()})}catch(e){return{error:e.message}}}function C(){let e=S();return e.error?(o.innerHTML=ca(e.error),null):(o.innerHTML=sa(e,t),e)}function ee(){s.innerHTML=oa(_),C()}a.addEventListener(`input`,e=>{e.target!==f&&C()}),a.addEventListener(`change`,e=>{e.target===c&&x(),e.target===f&&h.classList.toggle(`hidden`,!f.checked),C()}),l.addEventListener(`change`,()=>{if(ra(c.value)){let e=c.value===`harian`?1:7;(!u.value||u.value<=l.value)&&(u.value=A(l.value,e))}C()}),e.querySelector(`[data-add-addon]`)?.addEventListener(`click`,()=>{let t=e.querySelector(`#bm-addon-select`),n=Bi().find(e=>String(e.id)===String(t.value));n?_.some(e=>String(e.id)===String(n.id))?L(`Add-on ini sudah ditambahkan.`,`warning`):(_.push({id:n.id,name:n.name,price:n.price}),t.value=``,ee()):L(`Pilih layanan add-on terlebih dahulu.`,`warning`)}),s.addEventListener(`click`,e=>{let t=e.target.closest(`[data-remove-addon]`);t&&(_.splice(Number(t.dataset.removeAddon),1),ee())}),x(),C();let te=()=>({name:v(`#bm-name`),phone:v(`#bm-phone`),email:v(`#bm-email`),job:v(`#bm-job`),periode:c.value,startDate:l.value,endDate:u.value||void 0,promo:b(),addons:_,depositEnabled:!!f?.checked,depositValue:D(v(`#bm-deposit`)),depositPaidNow:!!m?.checked,payOption:y(),notes:v(`#bm-notes`),emergencyContact:{name:v(`#bm-ec-name`),relation:v(`#bm-ec-relation`),phone:v(`#bm-ec-phone`)}});e.querySelector(`[data-doku-extend]`)?.addEventListener(`click`,async()=>{if(!z()){L(`Link DOKU belum diaktifkan di Pengaturan.`,`warning`);return}let e=C();if(!e)return;let t=te();try{let r=await Rr({...e,tenantId:i.id,addons:t.addons});hi(i.id,{paymentId:r.invoiceNumber,amount:r.amount,paymentUrl:r.paymentUrl,createdAt:k(),expiresAt:A(k(),7)}),n(),Vr({title:`Link Pembayaran Perpanjangan`,subtitle:`${i.name} • Kamar ${i.roomNumber}`,paymentUrl:r.paymentUrl,invoiceNumber:r.invoiceNumber,amount:r.amount,expiresAt:r.expiresAt,phone:i.phone||``,email:i.email||``,recipientName:i.name||``,message:`Halo Kak ${i.name}, berikut tagihan perpanjangan sewa Kamar ${i.roomNumber} Casa Ramire sebesar ${O(e.grandTotal)}. Pembayaran dapat dilakukan melalui link DOKU berikut.`})}catch(e){L(e.message,`error`)}}),a.addEventListener(`submit`,e=>{if(e.preventDefault(),!C())return;let a=te();try{t===`booking`||t===`edit_booking`?(ti(r.id,a),L(`Booking kamar ${r.nomor} berhasil disimpan.`)):t===`checkin`?(ai(r.id,a),L(`${a.name} berhasil check-in di kamar ${r.nomor}.`)):t===`extend`&&(si(i.id,a),L(`Kontrak ${i.name} berhasil diperpanjang.`)),n()}catch(e){L(e.message,`error`)}})}})}function da(e){let t=W(e),n=t?.booking;if(!t||!n){L(`Booking tidak ditemukan.`,`error`);return}let r=n.payOption===`full`?n.grandTotal:0,i=Math.max(0,D(n.grandTotal)-r);V({title:`Check-in ${n.name}`,subtitle:`Kamar ${t.nomor} • ${j(n.startDate)}`,size:`md`,body:`
      <div class="space-y-4">
        <div class="rounded-2xl border border-line bg-cream/60 p-4 text-xs space-y-2">
          <div class="flex justify-between"><span class="text-stone-500">Nama</span><b class="text-stone-800">${P(n.name)}</b></div>
          <div class="flex justify-between"><span class="text-stone-500">WhatsApp</span><b class="text-stone-800">${P(n.phone)}</b></div>
          <div class="flex justify-between"><span class="text-stone-500">Email</span><b class="text-stone-800">${P(n.email||`—`)}</b></div>
          <div class="flex justify-between"><span class="text-stone-500">Periode</span><b class="text-stone-800">${j(n.startDate)} — ${j(n.endDate)}</b></div>
          <div class="flex justify-between"><span class="text-stone-500">Total sewa</span><b class="text-stone-800">${O(n.grandTotal)}</b></div>
          <div class="flex justify-between"><span class="text-stone-500">Deposit</span><b class="text-stone-800">${O(n.deposit)}</b></div>
          <div class="flex justify-between pt-2 border-t border-line"><span class="text-stone-500">Sisa sewa</span><b class="${i>0?`text-rose-700`:`text-emerald-700`}">${O(i)}</b></div>
        </div>
        ${i>0?`<div class="rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900 flex items-start gap-2">
                ${N(`AlertTriangle`,`w-4 h-4 shrink-0 mt-0.5`)}
                <span>Booking ini baru membayar deposit. Pilih <b>Tandai lunas</b> jika sisa sewa sudah diterima, atau <b>Check-in & tagih sisa</b> untuk mencatat tagihan.</span>
              </div>`:`<div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800 flex items-start gap-2">
                ${N(`CheckCircle2`,`w-4 h-4 shrink-0 mt-0.5`)}
                <span>Sewa sudah lunas. Penghuni siap check-in.</span>
              </div>`}
      </div>
    `,footer:`
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      ${i>0?`<button type="button" class="btn-outline btn-sm" data-checkin-unpaid>Check-in & tagih sisa</button>`:``}
      <button type="button" class="btn-primary btn-sm" data-checkin-settle>${N(`Check`,`w-4 h-4`)} ${i>0?`Tandai lunas & check-in`:`Check-in sekarang`}</button>
    `,onMount(e,r){let i=e=>{try{oi(t.id,{settle:e}),L(`${n.name} berhasil check-in di kamar ${t.nomor}.`),r()}catch(e){L(e.message,`error`)}};e.querySelector(`[data-checkin-settle]`)?.addEventListener(`click`,()=>i(!0)),e.querySelector(`[data-checkin-unpaid]`)?.addEventListener(`click`,()=>i(!1))}})}function fa(e){let t=G(e);if(!t)return;let n=fi(e),r=Zi(`tenant`,e),i=r?.depositHeld||0;V({title:`Check-out ${t.name}`,subtitle:`Kamar ${t.roomNumber||`-`} akan dikosongkan.`,size:`md`,body:`
      <div class="space-y-4">
        <div>
          <label class="label" for="co-date">Tanggal check-out</label>
          <input id="co-date" type="date" class="input" value="${k()}" />
        </div>
        ${n>0?`<div class="rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800 flex items-start gap-2">
                ${N(`AlertTriangle`,`w-4 h-4 shrink-0 mt-0.5`)}
                <span>Masih ada tunggakan <b>${O(n)}</b>. Check-out tetap dapat diproses, tagihan akan tetap tercatat.</span>
              </div>`:`<div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800 flex items-start gap-2">
                ${N(`CheckCircle2`,`w-4 h-4 shrink-0 mt-0.5`)}
                <span>Tidak ada tunggakan. Kamar siap dikosongkan.</span>
              </div>`}

        ${i>0?`<div class="rounded-2xl border border-amber-200 bg-amber-50 p-4 space-y-3">
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <p class="text-[11px] font-extrabold uppercase tracking-wider text-amber-800">Deposit ditahan</p>
                    <p class="text-xl font-black text-amber-900 mt-1">${O(i)}</p>
                  </div>
                  <span class="badge-amber">Jaminan</span>
                </div>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input id="co-refund-deposit" type="checkbox" class="w-4 h-4 accent-brand" checked />
                  <span class="text-xs font-bold text-stone-800">Kembalikan deposit saat check-out</span>
                </label>
                <div id="co-refund-wrap" class="grid sm:grid-cols-2 gap-2">
                  <div>
                    <label class="label" for="co-refund-amount">Nominal dikembalikan</label>
                    <input id="co-refund-amount" type="number" min="0" step="1000" class="input input-sm" value="${i}" />
                  </div>
                  <div>
                    <label class="label" for="co-refund-method">Metode</label>
                    <select id="co-refund-method" class="select">
                      ${d.map(e=>`<option value="${P(e)}">${P(e)}</option>`).join(``)}
                    </select>
                  </div>
                </div>
                <p class="text-[10px] text-amber-800 leading-relaxed">Pengembalian deposit dicatat sebagai kas keluar. Jika ada kerusakan, kurangi nominal atau hilangkan centang untuk menahan deposit.</p>
              </div>`:r&&r.outstanding>0?`<div class="rounded-2xl border border-line bg-stone-50 p-3.5 text-xs text-stone-600">
                  Deposit belum dibayar penuh. Sisa deposit yang belum disetor: <b>${O(r.outstanding)}</b>.
                </div>`:``}

        <p class="hint">Riwayat hunian, pembayaran, dan deposit tetap tersimpan pada profil penghuni.</p>
      </div>
    `,footer:`
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      <button type="button" class="btn-danger btn-sm" data-checkout>${N(`DoorOpen`,`w-4 h-4`)} Proses check-out</button>
    `,onMount(e,n){let r=e.querySelector(`#co-refund-deposit`),i=e.querySelector(`#co-refund-wrap`);r?.addEventListener(`change`,()=>{i?.classList.toggle(`hidden`,!r.checked)}),e.querySelector(`[data-checkout]`)?.addEventListener(`click`,()=>{let i=e.querySelector(`#co-date`).value||k();try{if(r?.checked){let n=D(e.querySelector(`#co-refund-amount`).value);n>0&&ta(`tenant`,t.id,n,{date:i,method:e.querySelector(`#co-refund-method`).value,note:`Pengembalian deposit check-out`})}li(t.id,i),L(`${t.name} berhasil check-out.`),n()}catch(e){L(e.message,`error`)}})}})}function pa(e){let t=G(e);if(!t)return;let n=Hr().filter(e=>e.status===`kosong`&&e.id!==t.roomId).sort((e,t)=>e.nomor.localeCompare(t.nomor,void 0,{numeric:!0}));V({title:`Pindah Kamar`,subtitle:`${t.name} • saat ini di kamar ${t.roomNumber||`—`}`,size:`md`,body:`
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
              <input id="mv-date" type="date" class="input" value="${k()}" />
            </div>
            <p class="hint">Riwayat kamar akan diperbarui otomatis.</p>
          `:`<div class="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">Tidak ada kamar kosong yang tersedia saat ini.</div>`}
      </div>
    `,footer:`
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      ${n.length?`<button type="button" class="btn-primary btn-sm" data-move>${N(`Repeat`,`w-4 h-4`)} Proses pindah</button>`:``}
    `,onMount(e,n){e.querySelector(`[data-move]`)?.addEventListener(`click`,()=>{let r=e.querySelector(`#mv-room`).value,i=e.querySelector(`#mv-date`).value||k();try{let e=ci(t.id,r,i);L(`${t.name} dipindahkan ke kamar ${e.roomNumber}.`),n()}catch(e){L(e.message,`error`)}})}})}function ma(e){let t=G(e);if(!t){L(`Penghuni tidak ditemukan.`,`error`);return}let n=t.roomId;n?ua(n,`extend`,t.id):L(`Penghuni tidak memiliki kamar aktif.`,`error`)}function ha(e){return e&&w().tenants.find(t=>String(t.id)===String(e))?.email||``}function ga(e){return String(e?.email||ha(e?.tenantId)||``).trim()}async function _a(e){return z()?Ir(e):null}async function va(e){return z()?Lr(e):null}async function ya(e){let t=ga(e);if(!t)throw Error(`Email penghuni belum diisi. Lengkapi email di data penghuni terlebih dahulu.`);let n=await _a(e);return{link:n,delivery:await Rn({to:t,name:e.tenantName||`Kak`,title:`Tagihan ${e.type||`Sewa`} Kamar ${e.roomNumber||`—`}`,invoiceNumber:e.number||n?.invoiceNumber||``,description:e.description||``,amount:e.amount,dueDate:e.dueDate,paymentUrl:n?.paymentUrl||``,expiresAt:n?.expiresAt||``,paymentInstructions:R().paymentInstructions||``})}}async function ba(e){let t=ga(e);if(!t)throw Error(`Email penerima invoice belum diisi.`);let n=await va(e);return{link:n,delivery:await Rn({to:t,name:e.tenantName||`Kak`,title:`Invoice ${e.item||`Layanan`}`,invoiceNumber:e.number||n?.invoiceNumber||``,description:e.item||``,amount:e.amount,dueDate:e.dueDate,paymentUrl:n?.paymentUrl||``,expiresAt:n?.expiresAt||``,paymentInstructions:R().paymentInstructions||``})}}function xa({kind:e=`bill`,id:t}){let n=w(),r=e===`invoice`?n.manualInvoices.find(e=>String(e.id)===String(t)):n.bills.find(e=>String(e.id)===String(t));if(!r){L(`Data tagihan tidak ditemukan.`,`error`);return}let i=r.status===`paid`;V({title:e===`invoice`?`Verifikasi Invoice Layanan`:`Verifikasi Pembayaran Sewa`,subtitle:`${r.tenantName||`—`} • Kamar ${r.roomNumber||`—`}`,size:`md`,body:`
      <div class="space-y-4">
        <div class="rounded-2xl border border-line bg-cream/60 p-4 text-xs space-y-2">
          <div class="flex justify-between gap-3"><span class="text-stone-500">Nomor</span><b class="text-stone-800 font-mono text-[11px]">${P(r.number||`—`)}</b></div>
          <div class="flex justify-between gap-3"><span class="text-stone-500">Jenis</span><b class="text-stone-800">${P(r.type||r.item||`—`)}</b></div>
          <div class="flex justify-between gap-3"><span class="text-stone-500">Jatuh tempo</span><b class="text-stone-800">${P(r.dueDate||`—`)}</b></div>
          <div class="flex justify-between gap-3 pt-2 border-t border-line"><span class="text-stone-500">Nominal</span><b class="text-stone-800 text-base">${O(r.amount)}</b></div>
        </div>

        ${i?`<div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800 flex items-start gap-2">
                ${N(`CheckCircle2`,`w-4 h-4 shrink-0 mt-0.5`)}
                <span>Pembayaran sudah diverifikasi${r.method?` via <b>${P(r.method)}</b>`:``}.</span>
              </div>`:``}

        <div>
          <label class="label" for="vf-method">Metode pembayaran</label>
          <select id="vf-method" class="select" ${i?`disabled`:``}>
            ${d.map(e=>`<option value="${e}" ${r.method===e?`selected`:``}>${e}</option>`).join(``)}
          </select>
        </div>
        <div>
          <label class="label" for="vf-note">Catatan pengirim / referensi</label>
          <input id="vf-note" type="text" class="input" placeholder="cth: transfer a.n. Budi / no. referensi" value="${P(r.note||``)}" ${i?`disabled`:``} />
        </div>
      </div>
    `,footer:`
      <button type="button" class="btn-outline btn-sm" data-modal-close>${i?`Tutup`:`Batal`}</button>
      ${i?``:`<button type="button" class="btn-primary btn-sm" data-confirm>${N(`ShieldCheck`,`w-4 h-4`)} Verifikasi & Tandai Lunas</button>`}
    `,onMount(n,r){n.querySelector(`[data-confirm]`)?.addEventListener(`click`,()=>{let i=n.querySelector(`#vf-method`).value,a=n.querySelector(`#vf-note`).value.trim();try{e===`invoice`?jr(t,{method:i,note:a}):wr(t,{method:i,note:a}),L(`Pembayaran berhasil diverifikasi.`),r()}catch(e){L(e.message,`error`)}})}})}function Sa(){let e=Ur({activeOnly:!0});e.length?V({title:`Buat Tagihan Baru`,subtitle:`Tagihan tambahan di luar sewa utama.`,size:`md`,body:`
      <form id="bill-form" class="space-y-4" novalidate>
        <div>
          <label class="label" for="bl-tenant">Penghuni / kamar</label>
          <select id="bl-tenant" class="select">
            ${e.map(e=>`<option value="${e.id}">${P(e.name)} — Kamar ${P(e.roomNumber||`—`)}</option>`).join(``)}
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
            <input id="bl-due" type="date" class="input" value="${A(k(),7)}" />
          </div>
        </div>
        <div>
          <label class="label" for="bl-note">Catatan</label>
          <input id="bl-note" type="text" class="input" placeholder="Opsional" />
        </div>
      </form>
    `,footer:`
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      <button type="submit" form="bill-form" class="btn-primary btn-sm" data-submit>${N(`ReceiptText`,`w-4 h-4`)} Simpan tagihan</button>
    `,onMount(e,t){e.querySelector(`#bill-form`).addEventListener(`submit`,n=>{n.preventDefault();try{xr({tenantId:e.querySelector(`#bl-tenant`).value,type:e.querySelector(`#bl-type`).value,amount:D(e.querySelector(`#bl-amount`).value),dueDate:e.querySelector(`#bl-due`).value||k(),note:e.querySelector(`#bl-note`).value.trim()}),L(`Tagihan baru berhasil dibuat.`),t()}catch(e){L(e.message,`error`)}})}}):L(`Belum ada penghuni aktif. Tambahkan penghuni terlebih dahulu.`,`warning`)}function Ca(e=``){let t=w(),n=new Map(t.tenants.map(e=>[String(e.id),e])),r=t.rooms.filter(e=>e.tenantId).sort((e,t)=>e.nomor.localeCompare(t.nomor,void 0,{numeric:!0})),i=r.find(t=>String(t.id)===String(e))||r[0]||null,a=e=>{let t=r.find(t=>String(t.id)===String(e));return n.get(String(t?.tenantId))?.name||``};V({title:`Buat Invoice Manual`,subtitle:`Untuk layanan non-sewa: laundry, perbaikan, fasilitas, dll.`,size:`md`,body:`
      <form id="invoice-form" class="space-y-4" novalidate>
        <div>
          <span class="label">Target invoice</span>
          <div class="grid grid-cols-2 gap-2">
            <label class="flex items-center gap-2 cursor-pointer rounded-xl border border-line p-2.5 hover:bg-stone-50">
              <input type="radio" name="iv-mode" value="tenant" class="accent-brand" ${r.length?`checked`:``} />
              <span class="text-xs font-bold text-stone-700">Tenant / penghuni</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer rounded-xl border border-line p-2.5 hover:bg-stone-50">
              <input type="radio" name="iv-mode" value="non-tenant" class="accent-brand" ${r.length?``:`checked`} />
              <span class="text-xs font-bold text-stone-700">Non tenant</span>
            </label>
          </div>
        </div>

        <div id="iv-tenant-section" class="space-y-3 ${r.length?``:`hidden`}">
          <div>
            <label class="label" for="iv-room">No. kamar</label>
            <select id="iv-room" class="select">
              ${r.map(e=>`<option value="${e.id}" ${i?.id===e.id?`selected`:``}>Kamar ${P(e.nomor)} — ${P(a(e.id))}</option>`).join(``)}
            </select>
          </div>
          <div class="rounded-xl border border-line bg-cream/60 px-3 py-2.5 text-xs">
            <span class="text-stone-500">Nama penghuni:</span>
            <b id="iv-tenant-name" class="text-stone-800">${P(i?a(i.id):`—`)}</b>
          </div>
        </div>

        <div id="iv-non-tenant-section" class="space-y-3 ${r.length?`hidden`:``}">
          <div>
            <label class="label" for="iv-name">Nama penerima</label>
            <input id="iv-name" type="text" class="input" placeholder="cth: Budi (laundry)" />
          </div>
          <div class="grid sm:grid-cols-2 gap-3">
            <div>
              <label class="label" for="iv-email">Email</label>
              <input id="iv-email" type="email" class="input" placeholder="nama@email.com" />
            </div>
            <div>
              <label class="label" for="iv-phone">No. telepon</label>
              <input id="iv-phone" type="tel" class="input" placeholder="cth: 08123456789" />
            </div>
          </div>
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
            <label class="label" for="iv-due">Tanggal</label>
            <input id="iv-due" type="date" class="input" value="${k()}" />
          </div>
        </div>
      </form>
    `,footer:`
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      <button type="submit" form="invoice-form" class="btn-primary btn-sm" data-submit>${N(`FilePlus2`,`w-4 h-4`)} Terbitkan invoice</button>
    `,onMount(e,t){let n=e.querySelector(`#iv-tenant-section`),i=e.querySelector(`#iv-non-tenant-section`),o=e.querySelector(`#iv-room`),s=e.querySelector(`#iv-tenant-name`),c=()=>e.querySelector(`input[name="iv-mode"]:checked`)?.value||`non-tenant`,l=()=>{let e=c()===`tenant`;n.classList.toggle(`hidden`,!e),i.classList.toggle(`hidden`,e)},u=()=>{o&&s&&(s.textContent=a(o.value)||`—`)};e.querySelectorAll(`input[name="iv-mode"]`).forEach(e=>{e.addEventListener(`change`,l)}),o?.addEventListener(`change`,u),l(),u(),e.querySelector(`#invoice-form`).addEventListener(`submit`,n=>{n.preventDefault();try{let n=c(),i=r.find(e=>String(e.id)===String(o?.value)),a=Or({mode:n,tenantId:n===`tenant`?i?.tenantId:null,roomId:n===`tenant`?i?.id:null,name:n===`non-tenant`?e.querySelector(`#iv-name`).value:``,email:n===`non-tenant`?e.querySelector(`#iv-email`).value:``,phone:n===`non-tenant`?e.querySelector(`#iv-phone`).value:``,item:e.querySelector(`#iv-item`).value,amount:D(e.querySelector(`#iv-amount`).value),dueDate:e.querySelector(`#iv-due`).value||k()});L(`Invoice manual berhasil diterbitkan.`),t(),setTimeout(()=>wa(a),0)}catch(e){L(e.message,`error`)}})}})}function wa(e){if(!e)return;let t=z();V({title:`Invoice Diterbitkan`,subtitle:`${e.number} • ${e.tenantName||`—`}`,size:`md`,body:`
      <div class="space-y-4">
        <div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p class="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">${P(e.item||`Invoice layanan`)}</p>
          <p class="text-2xl font-black text-emerald-900 mt-1">${O(e.amount)}</p>
          <p class="text-[11px] text-emerald-800 mt-0.5">Tanggal: ${j(e.dueDate)}</p>
        </div>
        <div class="rounded-2xl border border-line bg-cream/60 p-4 text-xs space-y-2">
          <div class="flex justify-between gap-3"><span class="text-stone-500">Nomor</span><b class="font-mono text-[11px] text-stone-800">${P(e.number)}</b></div>
          <div class="flex justify-between gap-3"><span class="text-stone-500">Penerima</span><b class="text-stone-800">${P(e.tenantName||`—`)}</b></div>
          <div class="flex justify-between gap-3"><span class="text-stone-500">Email</span><b class="text-stone-800">${P(e.email||`belum diisi`)}</b></div>
          <div class="flex justify-between gap-3"><span class="text-stone-500">Kamar</span><b class="text-stone-800">${P(e.roomNumber||`—`)}</b></div>
        </div>
        ${e.email?``:`<div class="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-[11px] text-amber-900">Email belum diisi. Tambahkan email agar tagihan bisa dikirim langsung.</div>`}
        <div class="rounded-xl border border-line bg-white px-3 py-2.5 text-[11px] text-stone-600 leading-relaxed">
          ${t?`Pilih <b>Buat Link DOKU</b> untuk menyalin link pembayaran, atau <b>Kirim Tagihan</b> untuk mengirimkannya langsung ke email penerima.`:`Klik <b>Kirim Tagihan</b> untuk mengirim rincian invoice ke email penerima. Link pembayaran DOKU belum diaktifkan.`}
        </div>
      </div>
    `,footer:`
      <button type="button" class="btn-outline btn-sm" data-modal-close>Tutup</button>
      ${t?`<button type="button" class="btn-outline btn-sm" data-doku>${N(`CreditCard`,`w-4 h-4`)} Buat Link DOKU</button>`:``}
      <button type="button" class="btn-primary btn-sm" data-send ${e.email?``:`disabled title="Email penerima belum diisi"`}>${N(`Send`,`w-4 h-4`)} Kirim Tagihan</button>
    `,onMount(t,n){t.querySelector(`[data-doku]`)?.addEventListener(`click`,async t=>{if(!z()){L(`Link DOKU belum diaktifkan di Pengaturan.`,`warning`);return}let r=t.currentTarget;I(r,!0,`Membuat link…`);try{let t=await Lr(e);n(),Vr({title:`Link Pembayaran Invoice`,subtitle:`${e.tenantName||`—`} • Kamar ${e.roomNumber||`—`}`,paymentUrl:t.paymentUrl,invoiceNumber:t.invoiceNumber,amount:t.amount,expiresAt:t.expiresAt,phone:e.phone||``,email:e.email||``,recipientName:e.tenantName||``,message:`Halo Kak ${e.tenantName||``}, berikut invoice ${e.item} sebesar ${O(e.amount)}.`})}catch(e){L(e.message,`error`)}finally{I(r,!1)}}),t.querySelector(`[data-send]`)?.addEventListener(`click`,async t=>{let r=t.currentTarget;if(!e.email)L(`Email penerima belum diisi.`,`warning`);else{I(r,!0,`Mengirim…`);try{let{delivery:t}=await ba(e);n(),L(t.sent?`Tagihan dikirim ke ${e.email}.`:`Email belum dikonfigurasi. Aplikasi email perangkat dibuka sebagai gantinya.`,t.sent?`success`:`warning`)}catch(e){L(e.message,`error`)}finally{I(r,!1)}}})}})}function Ta(e=`Tunai / Cash`){return d.map(t=>`<option value="${P(t)}" ${e===t?`selected`:``}>${P(t)}</option>`).join(``)}function Ea(e,t,n){let r=Zi(e,t);r?V({title:`Catat / Sesuaikan Deposit`,subtitle:`${r.name} • Kamar ${r.roomNumber}`,size:`md`,body:`
      <form id="deposit-adjust-form" class="space-y-4" novalidate>
        <div class="rounded-2xl border border-line bg-cream/60 p-4 text-xs space-y-1.5">
          <div class="flex justify-between gap-3"><span class="text-stone-500">Deposit ditargetkan</span><b class="text-stone-800">${O(r.deposit)}</b></div>
          <div class="flex justify-between gap-3"><span class="text-stone-500">Sudah diterima</span><b class="text-stone-800">${O(r.depositPaid)}</b></div>
          <div class="flex justify-between gap-3"><span class="text-stone-500">Sudah dikembalikan</span><b class="text-stone-800">${O(r.depositRefunded)}</b></div>
          <div class="flex justify-between gap-3 pt-1.5 border-t border-line"><span class="text-stone-500">Sisa deposit belum dibayar</span><b class="${r.outstanding?`text-rose-700`:`text-emerald-700`}">${O(r.outstanding)}</b></div>
        </div>

        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label class="label" for="dep-target">Deposit ditargetkan (Rp)</label>
            <input id="dep-target" type="number" min="0" step="1000" class="input" value="${r.deposit}" />
          </div>
          <div>
            <label class="label" for="dep-amount">Total sudah diterima (Rp)</label>
            <input id="dep-amount" type="number" min="0" step="1000" class="input" value="${r.depositPaid}" />
          </div>
        </div>
        <p class="hint">Masukkan total kumulatif, bukan tambahan. Contoh: sudah terima Rp500.000 → isi 500000.</p>
        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label class="label" for="dep-date">Tanggal</label>
            <input id="dep-date" type="date" class="input" value="${k()}" />
          </div>
          <div>
            <label class="label" for="dep-method">Metode</label>
            <select id="dep-method" class="select">${Ta()}</select>
          </div>
        </div>
        <div>
          <label class="label" for="dep-note">Catatan</label>
          <input id="dep-note" type="text" class="input" placeholder="cth: transfer BCA / pelunasan deposit" />
        </div>
        <div class="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-[11px] text-amber-900 leading-relaxed">
          Deposit adalah uang jaminan, bukan pendapatan. Uang masuk tetapi dicatat sebagai kewajiban sampai dikembalikan saat check-out.
        </div>
      </form>
    `,footer:`
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      <button type="submit" form="deposit-adjust-form" class="btn-primary btn-sm">${N(`Save`,`w-4 h-4`)} Simpan</button>
    `,onMount(r,i){r.querySelector(`#deposit-adjust-form`).addEventListener(`submit`,a=>{a.preventDefault();try{$i(e,t,r.querySelector(`#dep-target`).value),ea(e,t,r.querySelector(`#dep-amount`).value,{date:r.querySelector(`#dep-date`).value||k(),method:r.querySelector(`#dep-method`).value,note:r.querySelector(`#dep-note`).value}),L(`Status deposit berhasil diperbarui.`),i(),n?.()}catch(e){L(e.message,`error`)}})}}):L(`Data deposit tidak ditemukan.`,`error`)}function Da(e,t,n){let r=Zi(e,t);r?r.depositHeld<=0?L(`Tidak ada deposit yang bisa dikembalikan.`,`warning`):V({title:`Kembalikan Deposit`,subtitle:`${r.name} • Kamar ${r.roomNumber}`,size:`md`,body:`
      <form id="deposit-refund-form" class="space-y-4" novalidate>
        <div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs">
          <p class="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Deposit ditahan</p>
          <p class="text-2xl font-black text-emerald-900 mt-1">${O(r.depositHeld)}</p>
        </div>
        <div>
          <label class="label" for="ref-amount">Nominal dikembalikan (Rp)</label>
          <input id="ref-amount" type="number" min="0" step="1000" class="input" value="${r.depositHeld}" />
        </div>
        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label class="label" for="ref-date">Tanggal</label>
            <input id="ref-date" type="date" class="input" value="${k()}" />
          </div>
          <div>
            <label class="label" for="ref-method">Metode</label>
            <select id="ref-method" class="select">${Ta()}</select>
          </div>
        </div>
        <div>
          <label class="label" for="ref-note">Catatan</label>
          <input id="ref-note" type="text" class="input" value="Pengembalian deposit check-out" />
        </div>
      </form>
    `,footer:`
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      <button type="submit" form="deposit-refund-form" class="btn-danger btn-sm">${N(`ArrowDownRight`,`w-4 h-4`)} Kembalikan Deposit</button>
    `,onMount(r,i){r.querySelector(`#deposit-refund-form`).addEventListener(`submit`,a=>{a.preventDefault();try{ta(e,t,r.querySelector(`#ref-amount`).value,{date:r.querySelector(`#ref-date`).value||k(),method:r.querySelector(`#ref-method`).value,note:r.querySelector(`#ref-note`).value||`Pengembalian deposit check-out`}),L(`Pengembalian deposit berhasil dicatat.`),i(),n?.()}catch(e){L(e.message,`error`)}})}}):L(`Data deposit tidak ditemukan.`,`error`)}function Oa(e){let t=String(e??``).replace(/[^\d]/g,``);return t?Number(t):0}function ka(e,t){if(t===`,`){let t=[],n=``,r=!1;for(let i=0;i<e.length;i+=1){let a=e[i];a===`"`?r&&e[i+1]===`"`?(n+=`"`,i+=1):r=!r:a===`,`&&!r?(t.push(n),n=``):n+=a}return t.push(n),t}return e.split(t)}function Aa(e){let t=String(e||``).split(/\r?\n/).map(e=>e.trim()).filter(Boolean);if(!t.length)return[];let n=t[0].includes(`	`)?`	`:t[0].includes(`;`)?`;`:`,`,r=t.map(e=>ka(e,n).map(e=>e.trim())),i=r.findIndex(e=>e.some(e=>/no\s*kamar|kamar/i.test(e))&&e.some(e=>/deposit/i.test(e))),a=0,o=2,s=-1,c=r;if(i>=0){let e=r[i].map(e=>e.toLowerCase());a=e.findIndex(e=>/no\s*kamar|kamar/.test(e)),o=e.findIndex(e=>/deposit/.test(e)),s=e.findIndex(e=>/remark|catatan|keterangan/.test(e)),c=r.slice(i+1)}else o=r[0].length>=3&&Oa(r[0][1])===0?2:1;return c.map(e=>{let t=String(e[a]||``).replace(/[^\d]/g,``);if(!t)return null;let n=Oa(e[o]),r=s>=0?String(e[s]||``):``,i=/belum\s*bayar\s*deposit|deposit\s*belum/i.test(r);return{roomNumber:t,deposit:i?0:n,remarks:r,conflict:i&&n>0}}).filter(Boolean)}function ja(e){V({title:`Impor Status Deposit`,subtitle:`Tempel data dari Google Sheets. Status dicocokkan berdasarkan nomor kamar.`,size:`lg`,body:`
      <div class="space-y-4">
        <div class="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-[11px] text-amber-900 leading-relaxed">
          Format yang didukung: salin baris dari spreadsheet dengan kolom <b>No Kamar</b>, <b>Nama</b>, <b>Deposit</b>, dan <b>Remarks</b>.
          Impor ini menimpa status deposit akun yang nomor kamarnya cocok.
        </div>
        <div>
          <label class="label" for="dep-import-text">Data spreadsheet</label>
          <textarea id="dep-import-text" rows="10" class="input font-mono text-[11px]" placeholder="No Kamar&#9;Nama Penghuni&#9;...&#9;Deposit&#9;...&#9;Remarks&#10;201&#9;Lita&#9;...&#9;Rp0&#9;...&#9;&#10;202&#9;Yosefhin&#9;...&#9;Rp500.000&#9;...&#9;"></textarea>
        </div>
        <p class="hint">Baris dengan catatan “belum bayar deposit” akan dianggap belum dibayar.</p>
      </div>
    `,footer:`
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      <button type="button" class="btn-primary btn-sm" data-import>${N(`Upload`,`w-4 h-4`)} Impor</button>
    `,onMount(t,n){t.querySelector(`[data-import]`)?.addEventListener(`click`,()=>{let r=Aa(t.querySelector(`#dep-import-text`).value);if(!r.length){L(`Tidak ada baris data yang bisa dibaca.`,`warning`);return}let i=Xi(),a=new Map(i.map(e=>[String(e.roomNumber),e])),o=0,s=[],c=[];for(let e of r){let t=a.get(String(e.roomNumber));if(!t)s.push(e.roomNumber);else try{t.deposit<=0&&$i(t.kind,t.id,S),ea(t.kind,t.id,e.deposit,{date:k(),method:`Impor spreadsheet`,note:`Impor status deposit`,replaceHistory:!t.hasStoredHistory}),o+=1,e.conflict&&c.push(e.roomNumber)}catch(t){L(`Kamar ${e.roomNumber}: ${t.message}`,`error`)}}n(),L(`Impor deposit selesai: ${o} kamar diperbarui${s.length?`, ${s.length} tidak cocok`:``}.`,o?`success`:`warning`),c.length&&L(`Kamar dengan catatan “belum bayar deposit”: ${c.join(`, `)}.`,`warning`,6e3),e?.()})}})}function Ma(e,t,n,r){return`
    <button type="button" class="${r?`bg-brand text-white`:`bg-stone-100 text-stone-600 hover:bg-stone-200`} px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5" data-tab="${e}">
      ${N(n,`w-3.5 h-3.5`)} ${t}
    </button>
  `}function Na(e){let t=G(e);if(!t){L(`Penghuni tidak ditemukan.`,`error`);return}let n=w(),r=Wr(t),i=n.bills.filter(e=>String(e.tenantId)===String(t.id)).sort((e,t)=>t.id-e.id),a=n.manualInvoices.filter(e=>String(e.tenantId)===String(t.id)).sort((e,t)=>t.id-e.id),o=fi(t.id),s=Zi(`tenant`,t.id),c=[...i.map(e=>({key:`bill-${e.id}`,label:e.description||e.type,date:e.paidAt||e.dueDate,amount:e.status===`paid`?e.paid:e.amount,status:e.status,note:e.status===`paid`?e.method:`Belum dibayar`})),...a.map(e=>({key:`invoice-${e.id}`,label:`${e.item} (${e.number})`,date:e.paidAt||e.dueDate,amount:e.status===`paid`?e.paid:e.amount,status:e.status,note:e.status===`paid`?e.method:`Belum dibayar`}))],l=[...c],u=(t.payments||[]).filter(e=>String(e.type||``).toLowerCase()!==`deposit`).map(e=>({key:`payment-${e.id}`,label:e.type||`Pembayaran`,date:e.date||e.createdAt,amount:e.amount,status:`paid`,note:[e.method,e.note].filter(Boolean).join(` · `)}));u.length?(c.length=0,c.push(...u,...l.filter(e=>e.status!==`paid`))):D(t.depositPaid)>0&&c.unshift({key:`deposit`,label:`Deposit / jaminan`,date:t.checkinDate,amount:t.depositPaid,status:`paid`,note:`Deposit check-in`}),c.sort((e,t)=>String(t.date).localeCompare(String(e.date)));let d=c.filter(e=>e.status===`paid`).reduce((e,t)=>e+D(t.amount),0),f=c.filter(e=>e.status!==`paid`).reduce((e,t)=>e+D(t.amount),0),p=c.find(e=>e.status===`paid`)||null,m=t.status===`aktif`,h=t.stayHistory||[],g=pi(t),_=`
    <div class="space-y-5">
      <div class="rounded-2xl border border-line bg-cream/60 p-4">
        <div class="flex flex-wrap items-center gap-3">
          ${Li(t.name,`w-12 h-12 text-sm`)}
          <div class="min-w-0 flex-1">
            <h2 class="font-black text-stone-800 text-lg leading-tight">${P(t.name)}</h2>
            <p class="text-xs text-stone-500 mt-0.5">
              ${m?`Kamar ${P(r?.nomor||t.roomNumber||`—`)} · ${P(t.periode||``)} ${t.periode===`harian`?`hari`:t.periode===`mingguan`?`minggu`:`bulan`}`:`Sudah check-out`}
            </p>
            <p class="text-[11px] font-bold text-gold-700 mt-1 flex items-center gap-1.5">
              ${N(`Clock`,`w-3.5 h-3.5`)}
              ${m?`Sudah tinggal ${mi(t)}`:`Tinggal ${mi(t)}`}
              <span class="text-stone-400 font-normal">(${g} hari sejak ${j(t.checkinDate||t.startDate)})</span>
            </p>
          </div>
          <div class="flex items-center gap-2">
            <span class="${m?`badge-green`:`badge-gray`}">${m?`Aktif`:`Checkout`}</span>
            ${o>0?`<span class="badge-red">Tunggakan ${O(o)}</span>`:``}
          </div>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
          <div><p class="text-stone-600 font-bold uppercase text-[9px]">Mulai</p><p class="font-bold text-stone-700">${j(t.startDate)}</p></div>
          <div><p class="text-stone-600 font-bold uppercase text-[9px]">Berakhir</p><p class="font-bold text-stone-700">${j(t.endDate)}</p></div>
          <div><p class="text-stone-600 font-bold uppercase text-[9px]">Nilai kontrak</p><p class="font-bold text-stone-700">${O(t.contractTotal)}</p></div>
          <div><p class="text-stone-600 font-bold uppercase text-[9px]">Sisa tagihan</p><p class="font-bold ${o>0?`text-rose-700`:`text-emerald-700`}">${O(o)}</p></div>
        </div>
        <div class="mt-3 pt-3 border-t border-line-soft flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-stone-600">
          <span class="flex items-center gap-1.5">${N(`CreditCard`,`w-3.5 h-3.5 text-emerald-700`)} Pembayaran terakhir:
            <b class="text-stone-800">${p?`${j(p.date)} · ${O(p.amount)}`:`belum ada`}</b>
          </span>
          <span class="flex items-center gap-1.5">${N(`Repeat`,`w-3.5 h-3.5 text-gold-700`)} Pindah kamar:
            <b class="text-stone-800">${Math.max(0,h.length-1)} kali</b>
          </span>
        </div>
      </div>

      ${s?`<div class="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
              <div class="flex flex-wrap items-start gap-3">
                <span class="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">${N(`Landmark`,`w-5 h-5`)}</span>
                <div class="min-w-0 flex-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <p class="text-sm font-extrabold text-amber-900">Deposit / Jaminan</p>
                    ${s.deposit<=0?`<span class="badge-gray">Tanpa deposit</span>`:s.outstanding>0?`<span class="badge-amber">Belum lunas</span>`:`<span class="badge-green">Lunas</span>`}
                  </div>
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 text-[11px]">
                    <div><p class="text-amber-700 font-bold uppercase text-[9px]">Target</p><p class="font-black text-stone-800">${O(s.deposit)}</p></div>
                    <div><p class="text-amber-700 font-bold uppercase text-[9px]">Diterima</p><p class="font-black text-emerald-700">${O(s.depositPaid)}</p></div>
                    <div><p class="text-amber-700 font-bold uppercase text-[9px]">Dikembalikan</p><p class="font-black text-rose-700">${O(s.depositRefunded)}</p></div>
                    <div><p class="text-amber-700 font-bold uppercase text-[9px]">Sisa belum bayar</p><p class="font-black ${s.outstanding?`text-rose-700`:`text-emerald-700`}">${O(s.outstanding)}</p></div>
                  </div>
                  <p class="text-[10px] text-amber-800 mt-2">Deposit bukan DP dan bukan pendapatan. Dana ditahan sebagai kewajiban sampai check-out.</p>
                </div>
                <div class="flex flex-wrap gap-1.5 ml-auto">
                  <button type="button" class="btn-outline btn-xs" data-action="deposit-adjust">${N(`Pencil`,`w-3 h-3`)} Catat / Sesuaikan</button>
                  ${s.depositHeld>0?`<button type="button" class="btn-ghost btn-xs text-rose-600" data-action="deposit-refund">${N(`ArrowUpRight`,`w-3.5 h-3.5`)} Kembalikan</button>`:``}
                </div>
              </div>
            </div>`:``}

      <div class="flex flex-wrap gap-2 border-b border-line pb-2">
        ${Ma(`biodata`,`Biodata`,`UserRound`,!0)}
        ${Ma(`stay`,`Riwayat Kamar`,`ScrollText`,!1)}
        ${Ma(`payment`,`Riwayat Pembayaran`,`Receipt`,!1)}
      </div>

      <div id="dt-biodata" class="space-y-4">
        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label class="label" for="td-name">Nama lengkap</label>
            <input id="td-name" type="text" class="input" value="${P(t.name)}" />
          </div>
          <div>
            <label class="label" for="td-phone">No. WhatsApp</label>
            <input id="td-phone" type="tel" class="input" value="${P(t.phone)}" />
          </div>
          <div>
            <label class="label" for="td-email">Email</label>
            <input id="td-email" type="email" class="input" placeholder="nama@email.com" value="${P(t.email||``)}" />
          </div>
          <div>
            <label class="label" for="td-job">Pekerjaan / instansi</label>
            <input id="td-job" type="text" class="input" value="${P(t.job||``)}" />
          </div>
        </div>

        <div class="rounded-2xl border border-line bg-stone-50/60 p-4 space-y-3">
          <p class="text-[11px] font-extrabold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            ${N(`PhoneCall`,`w-3.5 h-3.5 text-rose-500`)} Kontak darurat
          </p>
          <div class="grid sm:grid-cols-3 gap-2">
            <div>
              <label class="label" for="td-ec-name">Nama</label>
              <input id="td-ec-name" type="text" class="input input-sm" value="${P(t.emergencyContact?.name||``)}" />
            </div>
            <div>
              <label class="label" for="td-ec-relation">Hubungan</label>
              <input id="td-ec-relation" type="text" class="input input-sm" value="${P(t.emergencyContact?.relation||``)}" />
            </div>
            <div>
              <label class="label" for="td-ec-phone">No. telepon</label>
              <input id="td-ec-phone" type="tel" class="input input-sm" value="${P(t.emergencyContact?.phone||``)}" />
            </div>
          </div>
        </div>

        <div>
          <label class="label" for="td-notes">Catatan admin</label>
          <textarea id="td-notes" rows="3" class="input bg-amber-50/40 border-amber-200" placeholder="Catatan khusus, permintaan, atau reminder">${P(t.notes||``)}</textarea>
        </div>
      </div>

      <div id="dt-stay" class="hidden">
        ${h.length?`<div class="overflow-x-auto">
                <table class="data-table">
                  <thead><tr><th>Kamar</th><th>Lantai</th><th>Mulai</th><th>Selesai</th></tr></thead>
                  <tbody>
                    ${h.map(e=>`
                        <tr>
                          <td class="font-bold text-stone-800">Kamar ${P(e.roomNumber)}</td>
                          <td>Lantai ${P(e.floor||`—`)}</td>
                          <td>${j(e.from)}</td>
                          <td>${e.to?j(e.to):`<span class="badge-green">Berjalan</span>`}</td>
                        </tr>`).join(``)}
                  </tbody>
                </table>
              </div>`:`<div class="rounded-2xl border border-line bg-stone-50 p-6 text-center text-sm text-stone-500">Belum ada riwayat kamar.</div>`}
      </div>

      <div id="dt-payment" class="hidden space-y-4">
        <div class="grid sm:grid-cols-4 gap-3">
          <div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-3">
            <p class="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Total dibayar</p>
            <p class="font-black text-emerald-900 text-lg">${O(d)}</p>
          </div>
          <div class="rounded-2xl border border-rose-200 bg-rose-50 p-3">
            <p class="text-[10px] font-bold uppercase tracking-wider text-rose-700">Belum dibayar</p>
            <p class="font-black text-rose-900 text-lg">${O(f)}</p>
          </div>
          <div class="rounded-2xl border border-line bg-white p-3">
            <p class="text-[10px] font-bold uppercase tracking-wider text-stone-600">Nilai kontrak</p>
            <p class="font-black text-stone-800 text-lg">${O(t.contractTotal)}</p>
          </div>
          <div class="rounded-2xl border border-amber-200 bg-amber-50 p-3">
            <p class="text-[10px] font-bold uppercase tracking-wider text-amber-800">Pembayaran terakhir</p>
            <p class="font-black text-amber-900 text-sm">${p?j(p.date):`—`}</p>
            <p class="text-[10px] text-amber-800">${p?O(p.amount):`Belum ada`}</p>
          </div>
        </div>

        <div class="overflow-x-auto rounded-2xl border border-line">
          <table class="data-table">
            <thead><tr><th>Item</th><th>Tanggal</th><th>Nominal</th><th>Status</th></tr></thead>
            <tbody>
              ${c.length?c.map(e=>`
                        <tr>
                          <td class="font-semibold text-stone-700">${P(e.label)}<p class="text-[10px] text-stone-600">${P(e.note||``)}</p></td>
                          <td class="whitespace-nowrap">${Ze(e.date)}</td>
                          <td class="font-bold ${e.status===`paid`?`text-stone-800`:`text-rose-700`}">${O(e.amount)}</td>
                          <td>${Ni(e.status)}</td>
                        </tr>`).join(``):`<tr><td colspan="4" class="text-center py-8 text-stone-600">Belum ada riwayat pembayaran.</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;V({title:`Detail Penghuni`,subtitle:`${t.name}${r?` • Kamar ${r.nomor}`:``}`,size:`xl`,body:_,footer:`
      <div class="w-full flex flex-wrap items-center justify-between gap-2">
        <div class="flex flex-wrap gap-2">
          ${m?`
            <button type="button" class="btn-outline btn-sm" data-action="extend">${N(`Repeat`,`w-4 h-4`)} Perpanjang</button>
            <button type="button" class="btn-outline btn-sm" data-action="move">${N(`ArrowRight`,`w-4 h-4`)} Pindah Kamar</button>
            <button type="button" class="btn-danger-soft btn-sm" data-action="checkout">${N(`DoorOpen`,`w-4 h-4`)} Check-out</button>
          `:`
            <button type="button" class="btn-danger-soft btn-sm" data-action="delete">${N(`Trash2`,`w-4 h-4`)} Hapus data</button>
          `}
        </div>
        <div class="flex flex-wrap gap-2">
          <button type="button" class="btn-outline btn-sm" data-modal-close>Tutup</button>
          <button type="button" class="btn-primary btn-sm" data-action="save">${N(`Check`,`w-4 h-4`)} Simpan perubahan</button>
        </div>
      </div>
    `,onMount(e,n){let r={biodata:e.querySelector(`#dt-biodata`),stay:e.querySelector(`#dt-stay`),payment:e.querySelector(`#dt-payment`)};e.querySelectorAll(`[data-tab]`).forEach(t=>{t.addEventListener(`click`,()=>{let n=t.dataset.tab;Object.entries(r).forEach(([e,t])=>t.classList.toggle(`hidden`,e!==n)),e.querySelectorAll(`[data-tab]`).forEach(e=>{e.className=`${e.dataset.tab===n?`bg-brand text-white`:`bg-stone-100 text-stone-600 hover:bg-stone-200`} px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5`})})}),e.querySelector(`[data-action="save"]`)?.addEventListener(`click`,()=>{try{ui(t.id,{name:e.querySelector(`#td-name`).value,phone:e.querySelector(`#td-phone`).value,email:e.querySelector(`#td-email`).value,job:e.querySelector(`#td-job`).value,notes:e.querySelector(`#td-notes`).value,emergencyContact:{name:e.querySelector(`#td-ec-name`).value,relation:e.querySelector(`#td-ec-relation`).value,phone:e.querySelector(`#td-ec-phone`).value}}),L(`Data penghuni berhasil diperbarui.`),n()}catch(e){L(e.message,`error`)}}),e.querySelector(`[data-action="deposit-adjust"]`)?.addEventListener(`click`,()=>{Ea(`tenant`,t.id,()=>{n(),setTimeout(()=>Na(t.id),0)})}),e.querySelector(`[data-action="deposit-refund"]`)?.addEventListener(`click`,()=>{Da(`tenant`,t.id,()=>{n(),setTimeout(()=>Na(t.id),0)})}),e.querySelector(`[data-action="extend"]`)?.addEventListener(`click`,()=>{n(),setTimeout(()=>ma(t.id),0)}),e.querySelector(`[data-action="move"]`)?.addEventListener(`click`,()=>{n(),setTimeout(()=>pa(t.id),0)}),e.querySelector(`[data-action="checkout"]`)?.addEventListener(`click`,()=>{n(),setTimeout(()=>fa(t.id),0)}),e.querySelector(`[data-action="delete"]`)?.addEventListener(`click`,async()=>{if(await H({title:`Hapus data penghuni?`,message:`Data <b>${P(t.name)}</b> akan dihapus permanen. Riwayat tagihan tetap tersimpan tanpa tautan ke profil ini.`,confirmText:`Ya, hapus`,danger:!0}))try{di(t.id),L(`Data penghuni berhasil dihapus.`),n()}catch(e){L(e.message,`error`)}})}})}var Pa=n({render:()=>Ua});function Fa(e){return e<0?`<span class="badge-red">Lewat ${Math.abs(e)} hari</span>`:e===0?`<span class="badge-red">Hari ini</span>`:`<span class="badge-amber">H-${e}</span>`}function Ia(e){return e.length?e.map(({room:e,booking:t})=>{let n=t.payOption===`full`;return`
        <tr>
          <td class="font-black text-stone-800 whitespace-nowrap">${P(e.nomor)}</td>
          <td>
            <button type="button" class="font-bold text-stone-800 hover:text-brand hover:underline text-left" data-action="tenant-booking" data-room="${e.id}">${P(t.name)}</button>
            <p class="text-[10px] text-stone-600">${P(t.phone)}</p>
          </td>
          <td class="whitespace-nowrap">${j(t.startDate)}</td>
          <td>${n?`<span class="badge-green">Lunas</span>`:`<span class="badge-amber">DP</span>`}</td>
          <td>
            <div class="flex items-center justify-end gap-1">
              <button type="button" class="btn-primary btn-xs" data-action="checkin" data-room="${e.id}">${N(`LogIn`,`w-3 h-3`)} Check-in</button>
              <button type="button" class="btn-outline btn-xs" data-action="edit-booking" data-room="${e.id}" title="Edit booking">${N(`Pencil`,`w-3 h-3`)}</button>
            </div>
          </td>
        </tr>`}).join(``):`<tr><td colspan="5">${Ii({iconName:`CalendarClock`,title:`Belum ada antrean booking`,description:`Booking baru akan muncul di sini untuk diproses check-in.`})}</td></tr>`}function La(e){return e.length?`<div class="divide-y divide-line-soft">
    ${e.map(({tenant:e,daysLeft:t})=>{let n=Ai(`reminder`,{nama:e.name,kamar:e.roomNumber,nominal:O(e.monthlyCharge),jatuh_tempo:j(e.endDate)});return`
          <div class="px-5 py-3.5 flex flex-wrap items-center gap-3">
            ${Li(e.name,`w-9 h-9 text-[10px]`)}
            <div class="min-w-0 flex-1">
              <button type="button" class="text-sm font-bold text-stone-800 hover:text-brand hover:underline text-left" data-action="detail" data-tenant="${e.id}">${P(e.name)}</button>
              <p class="text-[11px] text-stone-500">Kamar ${P(e.roomNumber||`—`)} · berakhir ${j(e.endDate)}</p>
            </div>
            <div class="flex items-center gap-2 ml-auto">
              ${Fa(t)}
              <a href="${tt(e.phone,n)}" target="_blank" rel="noopener" class="btn-ghost btn-xs text-emerald-700" title="Kirim pengingat WhatsApp">${N(`MessageCircle`,`w-4 h-4`)}</a>
              <button type="button" class="btn-outline btn-xs" data-action="extend" data-tenant="${e.id}">${N(`Repeat`,`w-3 h-3`)} Perpanjang</button>
            </div>
          </div>`}).join(``)}
  </div>`:Ii({iconName:`BadgeCheck`,title:`Semua kontrak aman`,description:`Tidak ada kontrak yang berakhir dalam 7 hari ke depan.`})}function Ra(e){return e.length?`<div class="divide-y divide-line-soft">
    ${e.map(({tenant:e,amount:t,expiresAt:n})=>`
        <div class="px-5 py-3.5 flex flex-wrap items-center gap-3">
          ${Li(e.name,`w-9 h-9 text-[10px]`)}
          <div class="min-w-0 flex-1">
            <button type="button" class="text-sm font-bold text-stone-800 hover:text-brand hover:underline text-left" data-action="detail" data-tenant="${e.id}">${P(e.name)}</button>
            <p class="text-[11px] text-stone-500">Kamar ${P(e.roomNumber||`—`)} · menunggu pembayaran perpanjangan</p>
            <p class="text-xs font-black text-amber-700 mt-0.5">${O(t)}</p>
          </div>
          <div class="flex items-center gap-2 ml-auto">
            ${n?`<span class="badge-amber normal-case tracking-normal">s/d ${j(n)}</span>`:``}
            <button type="button" class="btn-outline btn-xs" data-action="pending-link" data-tenant="${e.id}">${N(`ExternalLink`,`w-3 h-3`)} Buka link</button>
            <button type="button" class="btn-ghost btn-xs text-rose-600" data-action="pending-cancel" data-tenant="${e.id}">Batalkan</button>
          </div>
        </div>`).join(``)}
  </div>`:``}function za(e){return e<=0?`Jatuh tempo hari ini`:`Menunggak ${e} hari`}function Ba(e){let t=z();return e.length?`<div class="divide-y divide-line-soft">
    ${e.map(({tenant:e,daysOverdue:n,dueDate:r,amount:i,bills:a})=>{let o=Ai(`tagihan`,{nama:e.name,kamar:e.roomNumber,nominal:O(i),jatuh_tempo:j(r)});return`
          <div class="px-5 py-3.5 flex flex-wrap items-center gap-3">
            ${Li(e.name,`w-9 h-9 text-[10px]`)}
            <div class="min-w-0 flex-1">
              <button type="button" class="text-sm font-bold text-stone-800 hover:text-brand hover:underline text-left" data-action="detail" data-tenant="${e.id}">${P(e.name)}</button>
              <p class="text-[11px] text-stone-500">
                Kamar ${P(e.roomNumber||`—`)} · jatuh tempo ${j(r)}
                ${a.length>1?` · ${a.length} tagihan`:``}
              </p>
              <p class="text-xs font-black text-rose-700 mt-0.5">${O(i)}</p>
            </div>
            <div class="flex items-center gap-2 ml-auto">
              <span class="badge-red normal-case tracking-normal">${za(n)}</span>
              <a href="${tt(e.phone,o)}" target="_blank" rel="noopener" class="btn-ghost btn-xs text-emerald-700" title="Kirim tagihan WhatsApp">${N(`MessageCircle`,`w-4 h-4`)}</a>
              ${t?`<button type="button" class="btn-outline btn-xs" data-action="doku-link" data-id="${a[0].id}">${N(`CreditCard`,`w-3 h-3`)} Link DOKU</button>`:``}
              <button type="button" class="btn-primary btn-xs" data-action="verify-overdue" data-id="${a[0].id}">${N(`ShieldCheck`,`w-3 h-3`)} Verifikasi</button>
            </div>
          </div>`}).join(``)}
  </div>`:Ii({iconName:`BadgeCheck`,title:`Tidak ada tunggakan`,description:`Semua penghuni aktif sudah membayar tagihannya. Notifikasi otomatis hilang setelah pembayaran diverifikasi.`})}function Va(e){let t=Math.max(1,...e.flatMap(e=>[e.income,e.expense])),n=e[e.length-1]||{income:0,expense:0,net:0};return`
    <div class="flex flex-wrap items-center justify-between gap-3 mb-5 text-xs">
      <div>
        <p class="text-[10px] font-bold uppercase tracking-wider text-stone-600">Kas masuk bulan ini</p>
        <p class="font-black text-emerald-700 text-base">${O(n.income)}</p>
      </div>
      <div>
        <p class="text-[10px] font-bold uppercase tracking-wider text-stone-600">Kas keluar</p>
        <p class="font-black text-rose-700 text-base">${O(n.expense)}</p>
      </div>
      <div>
        <p class="text-[10px] font-bold uppercase tracking-wider text-stone-600">Net</p>
        <p class="font-black text-stone-800 text-base">${O(n.net)}</p>
      </div>
    </div>
    <div class="flex items-end justify-between gap-2 h-40">
      ${e.map(e=>{let n=e.income?Math.max(3,e.income/t*100):0,r=e.expense?Math.max(3,e.expense/t*100):0;return`
            <div class="flex-1 min-w-0 flex flex-col items-center gap-1.5">
              <div class="w-full h-32 flex items-end justify-center gap-1">
                <div class="w-3 rounded-t-md bg-emerald-500/90 transition-all" style="height:${n}%" title="Masuk ${O(e.income)}"></div>
                <div class="w-3 rounded-t-md bg-rose-400/90 transition-all" style="height:${r}%" title="Keluar ${O(e.expense)}"></div>
              </div>
              <span class="text-[9px] font-bold uppercase tracking-wider text-stone-600">${P(e.label)}</span>
            </div>`}).join(``)}
    </div>
    <div class="flex items-center gap-4 mt-4 text-[10px] font-semibold text-stone-500">
      <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span> Kas masuk</span>
      <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-sm bg-rose-400"></span> Pengeluaran</span>
    </div>
  `}function Ha(e){return e.length?e.map(e=>`
      <div>
        <div class="flex items-center justify-between text-xs mb-1.5">
          <span class="font-extrabold text-stone-700">Lantai ${P(e.floor)}</span>
          <span class="font-bold text-stone-500">${e.occupied}/${e.total} terisi · ${e.occupancy.toFixed(0)}%</span>
        </div>
        ${Ri(e.occupancy,e.occupancy>=70?`bg-emerald-500`:e.occupancy>=40?`bg-amber-400`:`bg-rose-400`)}
        <div class="flex flex-wrap gap-1.5 mt-2">
          <span class="badge-green">${e.occupied} terisi</span>
          <span class="badge-amber">${e.vacant} kosong</span>
          ${e.booking?`<span class="badge-blue">${e.booking} booking</span>`:``}
        </div>
      </div>`).join(``):`<p class="text-sm text-stone-600">Belum ada data lantai.</p>`}function Ua(e){let t=_i(),n=Di(6),r=k(),i=R();e.innerHTML=`
    <div data-view="dashboard" class="animate-in">
      ${K({eyebrow:`Enterprise Dashboard`,title:`Dashboard Casa Ramire ☕`,subtitle:`Monitor ${t.total} kamar, antrean check-in, dan kesehatan kas properti.`,actions:`
          <a href="#/rooms" class="btn-primary btn-sm">${N(`Building2`,`w-4 h-4`)} Kelola Kamar</a>
          <a href="#/billing" class="btn-outline btn-sm">${N(`ReceiptText`,`w-4 h-4`)} Verifikasi Kas</a>
        `})}

      ${i.catalogAdminKey?``:`<div class="card border-amber-200 bg-amber-50 p-4 mb-6 flex flex-wrap items-center gap-3">
              <span class="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">${N(`Send`,`w-5 h-5`)}</span>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-extrabold text-amber-900">Aktifkan sinkronisasi &amp; email tagihan</p>
                <p class="text-xs text-amber-800 mt-0.5">Masukkan kunci admin sekali di Pengaturan agar data tersinkron ke landing page dan tagihan bisa dikirim ke email penghuni.</p>
              </div>
              <button type="button" class="btn-gold btn-sm" data-action="open-settings">${N(`Settings`,`w-4 h-4`)} Buka Pengaturan</button>
            </div>`}

      <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        ${q({label:`Total Kamar`,value:t.total,iconName:`Building2`,hint:`2 lantai`})}
        ${q({label:`Terisi`,value:t.occupied,iconName:`UserCheck`,tone:`green`,hint:`${t.occupancy.toFixed(0)}% okupansi`})}
        ${q({label:`Kosong`,value:t.vacant,iconName:`DoorOpen`,tone:`amber`,hint:`Siap dipasarkan`})}
        ${q({label:`Booking`,value:t.booking,iconName:`CalendarClock`,tone:`indigo`,hint:`Menunggu check-in`})}
        ${q({label:`Okupansi`,value:`${t.occupancy.toFixed(1)}%`,iconName:`PieChart`,tone:`teal`,hint:`Okupansi saat ini`})}
        ${q({label:`Pendapatan Bulan Ini`,value:O(t.revenue),iconName:`Wallet`,tone:`brand`,hint:`Laba ${O(t.profit)}`})}
      </div>

      <div class="grid lg:grid-cols-2 gap-6 mb-6">
        <div class="card overflow-hidden">
          ${J({title:`Antrean Check-in`,description:`Booking yang menunggu diproses`,actions:`<span class="badge-blue">${t.checkins.length} booking</span>`})}
          <div class="table-wrap">
            <table class="data-table">
              <thead><tr><th>Kamar</th><th>Nama</th><th>Mulai</th><th>Status</th><th class="text-right">Aksi</th></tr></thead>
              <tbody>${Ia(t.checkins)}</tbody>
            </table>
          </div>
        </div>

        <div class="card overflow-hidden">
          ${J({title:`Akan Berakhir`,description:`Masa sewa tinggal 7 hari lagi (termasuk yang sudah lewat)`,actions:`<span class="badge-amber">${t.expiring.length} kontrak</span>`})}
          <div class="p-0">${La(t.expiring)}</div>
        </div>
      </div>

      ${t.pendingRenewals.length?`<div class="card overflow-hidden mb-6 border-amber-200">
              ${J({title:`Menunggu Pembayaran Perpanjangan`,description:`Link DOKU sudah dikirim, kontrak otomatis diperpanjang setelah dibayar`,actions:`<span class="badge-amber">${t.pendingRenewals.length} penghuni</span>`})}
              <div class="p-0">${Ra(t.pendingRenewals)}</div>
            </div>`:``}

      <div class="card overflow-hidden mb-6 border-rose-200">
        ${J({title:`Menunggak`,description:`Penghuni aktif yang belum melunasi tagihan lewat jatuh tempo`,actions:`
            <span class="badge-red">${t.overdue.length} penghuni</span>
            <a href="#/billing" class="btn-outline btn-xs">Lihat tagihan</a>
          `})}
        <div class="p-0">${Ba(t.overdue)}</div>
      </div>

      <div class="grid lg:grid-cols-2 gap-6 mb-6">
        <div class="card overflow-hidden">
          ${J({title:`Arus Kas 6 Bulan`,description:`Kas masuk dari tagihan, invoice & POS dibanding pengeluaran`})}
          <div class="p-5">${Va(n)}</div>
        </div>
        <div class="card overflow-hidden">
          ${J({title:`Okupansi per Lantai`,description:`Distribusi kamar terisi, kosong, dan booking`})}
          <div class="p-5 space-y-5">${Ha(t.floors)}</div>
        </div>
      </div>

      <div class="card overflow-hidden">
        ${J({title:`Tagihan Aktif`,description:`Menunggu verifikasi pembayaran · total ${O(t.unpaidBills.reduce((e,t)=>e+Number(t.amount||0),0))}`,actions:`<a href="#/billing" class="btn-outline btn-xs">Lihat semua</a>`})}
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Kamar</th><th>Penghuni</th><th>Jatuh Tempo</th><th>Nominal</th><th>Status</th><th class="text-right">Aksi</th></tr></thead>
            <tbody>
              ${t.unpaidBills.length?t.unpaidBills.map(e=>{let t=Ai(`tagihan`,{nama:e.tenantName,kamar:e.roomNumber,nominal:O(e.amount),jatuh_tempo:j(e.dueDate)}),n=e.dueDate&&e.dueDate<r;return`
                          <tr>
                            <td class="font-black text-stone-800">${P(e.roomNumber||`—`)}</td>
                            <td>
                              <p class="font-semibold text-stone-700">${P(e.tenantName||`—`)}</p>
                              <p class="text-[10px] text-stone-600">${P(e.type||``)}</p>
                            </td>
                            <td class="${n?`text-rose-700 font-bold`:``} whitespace-nowrap">${j(e.dueDate)}</td>
                            <td class="font-black text-amber-700 whitespace-nowrap">${O(e.amount)}</td>
                            <td>${Ni(e.status)}</td>
                            <td>
                              <div class="flex items-center justify-end gap-1">
                                <button type="button" class="btn-primary btn-xs" data-action="verify" data-id="${e.id}">${N(`ShieldCheck`,`w-3 h-3`)} Verifikasi</button>
                                ${e.phone?`<a href="${tt(e.phone,t)}" target="_blank" rel="noopener" class="btn-ghost btn-xs text-emerald-700" title="Kirim tagihan via WhatsApp">${N(`MessageCircle`,`w-4 h-4`)}</a>`:``}
                              </div>
                            </td>
                          </tr>`}).join(``):Fi(6,`Tidak ada tagihan aktif. Semua pembayaran sudah diverifikasi. 🎉`)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,F(e.querySelector(`[data-view="dashboard"]`),`click`,`[data-action]`,async(e,n)=>{let r=n.dataset.action;if(r===`open-settings`&&Un(),r===`pending-link`){let e=Number(n.dataset.tenant),r=t.pendingRenewals.find(t=>String(t.tenant.id)===String(e));if(!r)return;Vr({title:`Link Pembayaran Perpanjangan`,subtitle:`${r.tenant.name} • Kamar ${r.tenant.roomNumber}`,paymentUrl:r.paymentUrl,invoiceNumber:r.paymentId,amount:r.amount,expiresAt:r.expiresAt,phone:r.tenant.phone||``,message:`Halo Kak ${r.tenant.name}, berikut link pembayaran perpanjangan sewa Kamar ${r.tenant.roomNumber} Casa Ramire sebesar ${O(r.amount)}.`})}if(r===`pending-cancel`){let e=Number(n.dataset.tenant);if(!await H({title:`Tandai batal link perpanjangan?`,message:`Link akan disembunyikan dari dashboard dan penghuni kembali muncul di Akan Berakhir. Link DOKU yang sudah dibuat tetap bisa dibayar sampai kedaluwarsa; jika dibayar, kontrak tetap otomatis diperpanjang.`,confirmText:`Ya, tandai batal`,danger:!0}))return;gi(e),L(`Link perpanjangan ditandai batal di dashboard.`,`warning`)}if(r===`checkin`&&da(Number(n.dataset.room)),r===`edit-booking`&&ua(Number(n.dataset.room),`edit_booking`),r===`extend`&&ma(Number(n.dataset.tenant)),r===`detail`&&Na(Number(n.dataset.tenant)),r===`tenant-booking`&&ua(Number(n.dataset.room),`edit_booking`),r===`doku-link`){if(!z()){L(`Link DOKU belum diaktifkan. Aktifkan di Pengaturan setelah akun DOKU siap.`,`warning`);return}let e=Cr(Number(n.dataset.id));if(!e)return;let t=Ai(`tagihan`,{nama:e.tenantName||`Penghuni`,kamar:e.roomNumber||`—`,nominal:O(e.amount),jatuh_tempo:j(e.dueDate),no_invoice:e.number});Ir(e).then(n=>Vr({title:`Link Pembayaran — ${e.type||`Tagihan`}`,subtitle:`${e.tenantName||`—`} • Kamar ${e.roomNumber||`—`}`,paymentUrl:n.paymentUrl,invoiceNumber:n.invoiceNumber,amount:n.amount,expiresAt:n.expiresAt,phone:e.phone||``,message:t})).catch(e=>L(e.message,`error`))}(r===`verify`||r===`verify-overdue`)&&xa({kind:`bill`,id:Number(n.dataset.id)})})}function Wa(e){return(Number(e)||0).toLocaleString(`id-ID`,{maximumFractionDigits:2})}function Ga(e){return e.map(e=>`${e.name} ×${Wa(e.qty)}${e.unit?` ${e.unit}`:``}`).join(`, `)}function Y(e){return String(e??``).trim()}function Ka(e,t=0){return{...e,id:e.id??t+1,name:Y(e.name),category:Y(e.category)||`Lainnya`,price:Math.max(0,Math.round(D(e.price))),unit:Y(e.unit),active:e.active!==!1,createdAt:e.createdAt||``}}function qa({activeOnly:e=!1,category:t=``}={}){return(w().posProducts||[]).map(Ka).filter(t=>!e||t.active).filter(e=>!t||e.category===t).sort((e,t)=>e.category.localeCompare(t.category,`id`)||e.name.localeCompare(t.name,`id`))}function Ja(e){let t=(w().posProducts||[]).find(t=>String(t.id)===String(e));return t?Ka(t):null}function Ya(){let e=new Set(_);for(let t of qa())t.category&&e.add(t.category);return[...e].sort((e,t)=>e.localeCompare(t,`id`))}function Xa({id:e=null,name:t,category:n=`Lainnya`,price:r,unit:i=``,active:a=!0}){let o=Y(t),s=Y(n)||`Lainnya`,c=Y(i),l=Math.round(D(r));if(!o)throw Error(`Nama produk/layanan wajib diisi.`);if(l<=0)throw Error(`Harga produk/layanan harus lebih dari 0.`);let u=null;return T(t=>{if(Array.isArray(t.posProducts)||(t.posProducts=[]),e){let n=t.posProducts.find(t=>String(t.id)===String(e));if(!n)throw Error(`Produk/layanan tidak ditemukan.`);Object.assign(n,{name:o,category:s,price:l,unit:c,active:!!a,updatedAt:new Date().toISOString()}),u=n}else u={id:E(t.posProducts),name:o,category:s,price:l,unit:c,active:!!a,createdAt:new Date().toISOString()},t.posProducts.push(u)}),u}function Za(e){T(t=>{let n=(t.posProducts||[]).find(t=>String(t.id)===String(e));n&&(n.active=!n.active)})}function Qa(e){T(t=>{t.posProducts=(t.posProducts||[]).filter(t=>String(t.id)!==String(e))})}function $a({limit:e=300}={}){return[...w().posSales||[]].sort((e,t)=>String(t.createdAt||t.date||``).localeCompare(String(e.createdAt||e.date||``))||Number(t.id)-Number(e.id)).slice(0,Math.max(1,Number(e)||300))}function eo({items:e=[],discount:t=0,method:n=`Tunai / Cash`,amountPaid:r=null,customerName:i=``,customerPhone:a=``,customerEmail:o=``,tenantId:s=null,roomId:c=null,roomNumber:l=``,note:u=``,date:d=k(),status:f=`paid`,dueDate:p=``,withInvoice:m=null}={}){let h=w(),g=new Map((h.posProducts||[]).map(e=>[String(e.id),e])),_=[];for(let t of Array.isArray(e)?e:[]){let e=t?.productId?g.get(String(t.productId)):null,n=Y(e?.name||t?.name),r=Math.max(0,Math.round(D(e?e.price:t?.price))),i=Math.max(0,Math.round(D(t?.qty)*100)/100);if(!n)throw Error(`Ada item tanpa nama produk/layanan.`);if(i<=0)throw Error(`Jumlah untuk ${n} harus lebih dari 0.`);if(r<=0)throw Error(`Harga ${n} harus lebih dari 0.`);_.push({productId:e?.id??t?.productId??null,name:n,category:Y(e?.category||t?.category)||`Lainnya`,unit:Y(e?.unit||t?.unit),price:r,qty:i,subtotal:Math.round(r*i)})}if(!_.length)throw Error(`Keranjang masih kosong. Pilih produk/layanan terlebih dahulu.`);let v=f!==`unpaid`,y=_.reduce((e,t)=>e+t.subtotal,0),b=Math.min(y,Math.max(0,Math.round(D(t)))),x=Math.max(0,y-b),S=v?r===null||r===``?x:Math.round(D(r)):0;if(v&&S<x)throw Error(`Nominal pembayaran kurang dari total.`);let C=s&&(h.tenants||[]).find(e=>String(e.id)===String(s))||null,ee=c?(h.rooms||[]).find(e=>String(e.id)===String(c))||null:(h.rooms||[]).find(e=>String(e.id)===String(C?.roomId))||null,te=Me(),ne=new Date().toISOString(),re=p||A(k(),7),ie=!!C?.id||!v||!!m,ae=Ga(_),oe=null,se=null;return T(e=>{Array.isArray(e.posSales)||(e.posSales=[]);let t=E(e.posSales),r=je(`POS`,e.posSales);if(ie&&(Array.isArray(e.manualInvoices)||(e.manualInvoices=[]),se={id:E(e.manualInvoices),number:je(`SRV`,e.manualInvoices),tenantId:C?.id??null,roomId:ee?.id??null,tenantName:Y(i||C?.name)||`Pelanggan POS`,email:Y(o||C?.email),phone:Y(a||C?.phone),roomNumber:ee?.nomor||l||`—`,mode:C?.id?`tenant`:`non-tenant`,item:ae,items:_,subtotal:y,discount:b,amount:x,paid:v?x:0,amountPaid:v?S:0,change:v?Math.max(0,S-x):0,status:v?`paid`:`unpaid`,dueDate:re,method:v?Y(n)||`Tunai / Cash`:``,note:Y(u),source:`pos`,posSaleId:t,cashier:te?.name||``,createdAt:ne,paidAt:v?ne:null},e.manualInvoices.push(se)),oe={id:t,number:r,date:d||k(),items:_,subtotal:y,discount:b,total:x,method:v?Y(n)||`Tunai / Cash`:``,amountPaid:S,change:v?Math.max(0,S-x):0,customerName:Y(i||C?.name)||`Walk-in`,customerPhone:Y(a||C?.phone),customerEmail:Y(o||C?.email),tenantId:C?.id??null,roomNumber:ee?.nomor||l||``,note:Y(u),status:v?`paid`:`unpaid`,dueDate:ie?re:``,invoiceId:se?.id??null,invoiceNumber:se?.number||``,paidAt:v?ne:null,cashier:te?.name||``,createdAt:ne},e.posSales.push(oe),v&&C?.id&&se){let t=(e.tenants||[]).find(e=>String(e.id)===String(C.id));t&&(t.payments=t.payments||[],t.payments.push({id:E(t.payments),date:k(),amount:x,type:`POS — ${ae}`,method:Y(n)||`Tunai / Cash`,note:oe.number,invoiceId:se.id}))}}),{...oe,invoice:se}}function to(e){T(t=>{let n=(t.posSales||[]).find(t=>String(t.id)===String(e));if(n?.invoiceId){t.manualInvoices=(t.manualInvoices||[]).filter(e=>String(e.id)!==String(n.invoiceId));for(let e of t.tenants||[])e.payments=(e.payments||[]).filter(e=>String(e.invoiceId)!==String(n.invoiceId)&&String(e.billId)!==String(n.invoiceId))}t.posSales=(t.posSales||[]).filter(t=>String(t.id)!==String(e))})}function no(e=new Date){let t=w().posSales||[],n=k(),r=t.filter(t=>$e(t.date||t.createdAt,e)),i=r.filter(e=>e.status===`paid`),a=r.filter(e=>e.status===`unpaid`),o=t.filter(e=>String(e.date||``).slice(0,10)===n),s=o.filter(e=>e.status===`paid`);return{totalSales:t.length,monthCount:r.length,monthRevenue:i.reduce((e,t)=>e+D(t.total),0),monthOutstanding:a.reduce((e,t)=>e+D(t.total),0),unpaidCount:a.length,todayCount:o.length,todayRevenue:s.reduce((e,t)=>e+D(t.total),0),itemsSoldThisMonth:i.reduce((e,t)=>e+(t.items||[]).reduce((e,t)=>e+D(t.qty),0),0)}}var ro=n({render:()=>Po}),io=`kasir`,ao=``,oo=`semua`,X=[],Z={customerMode:`tenant`,tenantId:``,roomId:``,roomNumber:``,customerName:``,customerPhone:``,customerEmail:``,note:``,method:`Tunai / Cash`,discount:``,amountPaid:``,paymentMode:`later`,dueDate:A(k(),7),sendEmail:!0};function Q(e){return O(e)}function so(e){return(Number(e)||0).toLocaleString(`id-ID`,{maximumFractionDigits:2})}function co(e){return Math.max(0,Math.round((Number(e)||0)*100)/100)}function lo(){return X.map(e=>{let t=Ja(e.productId);if(!t)return null;let n=co(e.qty);return{...e,product:t,qty:n,subtotal:Math.round(t.price*n)}}).filter(Boolean)}function uo(){let e=lo(),t=e.reduce((e,t)=>e+t.subtotal,0),n=Math.min(t,Math.max(0,Math.round(D(Z.discount)))),r=Math.max(0,t-n),i=Z.amountPaid===``?r:Math.round(D(Z.amountPaid));return{lines:e,subtotal:t,discount:n,total:r,paid:i,change:Math.max(0,i-r),shortfall:Math.max(0,r-i)}}function fo(){let e=w(),t=new Map((e.tenants||[]).map(e=>[String(e.id),e]));return(e.rooms||[]).filter(e=>e.tenantId&&t.get(String(e.tenantId))?.status===`aktif`).map(e=>({room:e,tenant:t.get(String(e.tenantId))})).sort((e,t)=>String(e.room.nomor).localeCompare(String(t.room.nomor),void 0,{numeric:!0}))}function po(e){e&&(Z.tenantId=e.tenant.id,Z.roomId=e.room.id,Z.roomNumber=e.room.nomor,Z.customerName=e.tenant.name||``,Z.customerPhone=e.tenant.phone||``,Z.customerEmail=e.tenant.email||``)}function mo(){let e=fo();return e.length?e.find(e=>String(e.tenant.id)===String(Z.tenantId))||e[0]:null}function ho(e){let t=e.querySelector(`#pos-note`),n=e.querySelector(`#pos-method`),r=e.querySelector(`#pos-discount`),i=e.querySelector(`#pos-paid`),a=e.querySelector(`#pos-due-date`),o=e.querySelector(`#pos-send-email`),s=e.querySelector(`input[name="pos-customer-mode"]:checked`)?.value,c=e.querySelector(`input[name="pos-payment-mode"]:checked`)?.value;if(Z.customerMode=s===`tenant`?`tenant`:`non-tenant`,Z.paymentMode=c===`now`?`now`:`later`,t&&(Z.note=t.value),n&&(Z.method=n.value),r&&(Z.discount=r.value),i&&(Z.amountPaid=i.value),a&&(Z.dueDate=a.value),o&&(Z.sendEmail=o.checked&&!o.disabled),Z.customerMode===`tenant`){let t=e.querySelector(`#pos-tenant-select`);po(fo().find(e=>String(e.tenant.id)===String(t?.value||Z.tenantId))||mo());return}Z.tenantId=``,Z.roomId=``,Z.roomNumber=``;let l=e.querySelector(`#pos-customer-name`),u=e.querySelector(`#pos-customer-phone`),d=e.querySelector(`#pos-customer-email`);l&&(Z.customerName=l.value),u&&(Z.customerPhone=u.value),d&&(Z.customerEmail=d.value)}function go(){let e=lo();return e.length?`
    <div class="divide-y divide-line-soft">
      ${e.map(e=>`
          <div class="py-3 first:pt-0 last:pb-0">
            <div class="flex items-start gap-2">
              <div class="min-w-0 flex-1">
                <p class="text-xs font-extrabold text-stone-800 leading-snug">${P(e.product.name)}</p>
                <p class="text-[10px] text-stone-500 mt-0.5">${Q(e.product.price)} / ${P(e.product.unit||`item`)}</p>
              </div>
              <button type="button" class="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 shrink-0" data-pos-remove data-product="${e.product.id}" aria-label="Hapus ${P(e.product.name)}">
                ${N(`Trash2`,`w-3.5 h-3.5`)}
              </button>
            </div>
            <div class="flex items-center justify-between gap-2 mt-2">
              <div class="flex items-center gap-1">
                <button type="button" class="w-7 h-7 rounded-lg border border-line bg-white text-stone-600 hover:bg-stone-50 flex items-center justify-center" data-pos-minus data-product="${e.product.id}" aria-label="Kurangi jumlah">${N(`Minus`,`w-3.5 h-3.5`)}</button>
                <input
                  type="number"
                  min="0.01"
                  step="${String(e.product.unit).toLowerCase()===`kg`?`0.1`:`1`}"
                  value="${e.qty}"
                  class="w-16 h-7 rounded-lg border border-line bg-white px-1.5 text-center text-xs font-bold text-stone-800"
                  data-pos-qty
                  data-product="${e.product.id}"
                  aria-label="Jumlah ${P(e.product.name)}"
                />
                <button type="button" class="w-7 h-7 rounded-lg border border-line bg-white text-stone-600 hover:bg-stone-50 flex items-center justify-center" data-pos-plus data-product="${e.product.id}" aria-label="Tambah jumlah">${N(`Plus`,`w-3.5 h-3.5`)}</button>
              </div>
              <p class="text-xs font-black text-stone-800 whitespace-nowrap">${Q(e.subtotal)}</p>
            </div>
          </div>`).join(``)}
    </div>
  `:`
      <div class="rounded-2xl border border-dashed border-line bg-stone-50/70 px-4 py-8 text-center">
        <span class="w-11 h-11 rounded-2xl bg-white border border-line text-stone-500 flex items-center justify-center mx-auto">${N(`ShoppingCart`,`w-5 h-5`)}</span>
        <p class="text-xs font-bold text-stone-700 mt-3">Keranjang masih kosong</p>
        <p class="text-[11px] text-stone-500 mt-1">Pilih layanan di sebelah kiri untuk mulai transaksi.</p>
      </div>
    `}function _o(){let e=uo();return`
    <div class="space-y-1.5 text-xs">
      <div class="flex justify-between gap-3"><span class="text-stone-500">Subtotal</span><span class="font-bold text-stone-800">${Q(e.subtotal)}</span></div>
      ${e.discount>0?`<div class="flex justify-between gap-3 text-rose-700"><span>Diskon</span><span class="font-bold">−${Q(e.discount)}</span></div>`:``}
      <div class="flex justify-between gap-3 pt-2 border-t border-line"><span class="font-extrabold text-stone-700">Total</span><span class="font-black text-lg text-stone-900">${Q(e.total)}</span></div>
      ${Z.paymentMode===`now`&&Z.amountPaid!==``?`<div class="flex justify-between gap-3"><span class="text-stone-500">Uang diterima</span><span class="font-bold text-stone-800">${Q(e.paid)}</span></div>
             <div class="flex justify-between gap-3"><span class="text-stone-500">Kembalian</span><span class="font-bold ${e.shortfall?`text-rose-700`:`text-emerald-700`}">${e.shortfall?`Kurang ${Q(e.shortfall)}`:Q(e.change)}</span></div>`:``}
      ${Z.paymentMode===`later`?`<div class="flex justify-between gap-3 text-amber-800"><span>Status</span><span class="font-bold">Belum dibayar</span></div>`:``}
    </div>
  `}function vo(e){let t=e.querySelector(`#pos-cart-lines`),n=e.querySelector(`#pos-totals`),r=e.querySelector(`#pos-cart-count`),i=e.querySelector(`[data-pos-checkout]`);t&&(t.innerHTML=go()),n&&(n.innerHTML=_o()),r&&(r.textContent=`${lo().length} item`),i&&(i.disabled=lo().length===0)}function yo(e){return`
    <button type="button" class="text-left rounded-2xl border border-line bg-white p-3.5 hover:border-gold-300 hover:shadow-sm transition group" data-pos-add data-product="${e.id}">
      <div class="flex items-start justify-between gap-2">
        <span class="w-9 h-9 rounded-xl bg-brand-50 text-brand flex items-center justify-center shrink-0">${N(`Package`,`w-4 h-4`)}</span>
        <span class="badge-gray normal-case tracking-normal">${P(e.category)}</span>
      </div>
      <p class="text-xs font-extrabold text-stone-800 mt-2.5 leading-snug">${P(e.name)}</p>
      <div class="flex items-end justify-between gap-2 mt-2">
        <p class="text-sm font-black text-stone-900">${Q(e.price)}</p>
        <p class="text-[10px] text-stone-500">/ ${P(e.unit||`item`)}</p>
      </div>
      <p class="text-[10px] font-bold text-brand mt-2 group-hover:text-gold-700">+ Tambah</p>
    </button>
  `}function bo(){let e=ao.trim().toLowerCase(),t=qa({activeOnly:!0,category:oo===`semua`?``:oo}).filter(t=>!e||`${t.name} ${t.category} ${t.unit}`.toLowerCase().includes(e));return t.length?`<div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">${t.map(yo).join(``)}</div>`:Ii({iconName:`Package`,title:`Produk tidak ditemukan`,description:`Ubah kata kunci atau tambahkan produk/layanan baru dari menu Kelola Produk.`})}function xo(){return[`semua`,...Ya()].map(e=>`
      <button type="button" class="${oo===e?`chip-active`:`chip-idle`}" data-pos-category="${P(e)}">
        ${e===`semua`?`Semua`:P(e)}
      </button>`).join(``)}function So(){let e=Ne(),t=fo(),n=t.length?Z.customerMode:`non-tenant`;n!==Z.customerMode&&(Z.customerMode=n,t.length||(Z.paymentMode=`now`));let r=mo();n===`tenant`&&r&&po(r);let i=Z.paymentMode===`now`?`now`:`later`,a=n===`tenant`?r?.tenant.email||``:Z.customerEmail,o=jn(a);return`
    <div class="grid lg:grid-cols-[1.3fr_0.7fr] gap-5 items-start">
      <div class="space-y-4 min-w-0">
        <div class="card p-4">
          <div class="flex flex-col sm:flex-row sm:items-center gap-3">
            <div class="relative flex-1">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500">${N(`Search`,`w-3.5 h-3.5`)}</span>
              <input id="pos-search" type="search" class="input input-sm pl-8" placeholder="Cari layanan / produk…" value="${P(ao)}" />
            </div>
            ${e?`<button type="button" class="btn-outline btn-sm shrink-0" data-pos-manage>${N(`Package`,`w-4 h-4`)} Kelola Produk</button>`:``}
          </div>
          <div class="flex flex-wrap gap-1.5 mt-3" id="pos-categories">${xo()}</div>
        </div>

        <div class="card p-4">
          <div class="flex items-center justify-between gap-2 mb-3">
            <div>
              <h2 class="text-sm font-extrabold text-stone-800">Pilih Layanan</h2>
              <p class="text-[11px] text-stone-500">Harga mengikuti master POS yang diatur owner.</p>
            </div>
            <span class="badge-gold">${qa({activeOnly:!0}).length} aktif</span>
          </div>
          <div id="pos-products">${bo()}</div>
        </div>
      </div>

      <aside class="card rounded-3xl p-4 sm:p-5 lg:sticky lg:top-4">
        <div class="flex items-start justify-between gap-3 pb-3 border-b border-line">
          <div>
            <h2 class="text-sm font-extrabold text-stone-800">Keranjang</h2>
            <p class="text-[11px] text-stone-500" id="pos-cart-count">${lo().length} item</p>
          </div>
          <button type="button" class="btn-ghost btn-xs text-rose-600" data-pos-clear ${X.length?``:`disabled`}>Reset</button>
        </div>

        <div class="py-3" id="pos-cart-lines">${go()}</div>

        <div class="space-y-3 pt-3 border-t border-line">
          <div class="rounded-2xl border border-line bg-stone-50/60 p-3 space-y-2.5">
            <p class="text-[11px] font-extrabold uppercase tracking-wider text-stone-500">Pelanggan</p>
            <div class="grid grid-cols-2 gap-2">
              <label class="flex items-center gap-2 cursor-pointer rounded-xl border border-line bg-white p-2.5 hover:bg-stone-50 ${t.length?``:`opacity-50`}">
                <input type="radio" name="pos-customer-mode" value="tenant" class="accent-brand" ${n===`tenant`?`checked`:``} ${t.length?``:`disabled`} />
                <span class="text-xs font-bold text-stone-700">Penghuni</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer rounded-xl border border-line bg-white p-2.5 hover:bg-stone-50">
                <input type="radio" name="pos-customer-mode" value="non-tenant" class="accent-brand" ${n===`non-tenant`?`checked`:``} />
                <span class="text-xs font-bold text-stone-700">Non tenant</span>
              </label>
            </div>

            ${n===`tenant`?`
                  <div>
                    <label class="label" for="pos-tenant-select">Kamar / penghuni</label>
                    <select id="pos-tenant-select" class="select">
                      ${t.map(e=>`<option value="${e.tenant.id}" ${String(e.tenant.id)===String(r?.tenant.id)?`selected`:``}>Kamar ${P(e.room.nomor)} — ${P(e.tenant.name)}</option>`).join(``)}
                    </select>
                  </div>
                  <div class="rounded-xl border border-line bg-white px-3 py-2.5 text-[11px] space-y-1">
                    <div class="flex justify-between gap-2"><span class="text-stone-500">Nama</span><b class="text-stone-800 text-right">${P(r?.tenant.name||`—`)}</b></div>
                    <div class="flex justify-between gap-2"><span class="text-stone-500">Email</span><b class="text-stone-800 text-right break-all">${P(r?.tenant.email||`belum diisi`)}</b></div>
                    <div class="flex justify-between gap-2"><span class="text-stone-500">Telepon</span><b class="text-stone-800 text-right">${P(r?.tenant.phone||`—`)}</b></div>
                  </div>
                `:`
                  <div class="grid grid-cols-2 gap-2">
                    <div>
                      <label class="label" for="pos-customer-name">Nama pelanggan</label>
                      <input id="pos-customer-name" type="text" class="input input-sm" placeholder="Opsional" value="${P(Z.customerName)}" />
                    </div>
                    <div>
                      <label class="label" for="pos-customer-phone">No. telepon</label>
                      <input id="pos-customer-phone" type="tel" class="input input-sm" placeholder="Opsional" value="${P(Z.customerPhone)}" />
                    </div>
                  </div>
                  <div>
                    <label class="label" for="pos-customer-email">Email</label>
                    <input id="pos-customer-email" type="email" class="input input-sm" placeholder="nama@email.com (opsional)" value="${P(Z.customerEmail)}" />
                  </div>
                `}

            <label class="flex items-start gap-2.5 rounded-xl border border-line bg-white p-2.5 cursor-pointer ${o?``:`opacity-60`}">
              <input id="pos-send-email" type="checkbox" class="w-4 h-4 accent-brand mt-0.5" ${Z.sendEmail&&o?`checked`:``} ${o?``:`disabled`} />
              <span>
                <span class="block text-[11px] font-bold text-stone-700">Kirim invoice ke email pelanggan</span>
                <span class="block text-[10px] text-stone-500 mt-0.5" id="pos-email-hint">${o?P(a):`Email belum tersedia. Lengkapi dulu di profil penghuni atau isi email non tenant.`}</span>
              </span>
            </label>
          </div>

          <div class="rounded-2xl border border-line bg-stone-50/60 p-3 space-y-2.5">
            <p class="text-[11px] font-extrabold uppercase tracking-wider text-stone-500">Pembayaran</p>
            <div class="grid grid-cols-2 gap-2">
              <label class="flex items-center gap-2 cursor-pointer rounded-xl border border-line bg-white p-2.5 hover:bg-stone-50">
                <input type="radio" name="pos-payment-mode" value="now" class="accent-brand" ${i===`now`?`checked`:``} />
                <span class="text-xs font-bold text-stone-700">Lunas sekarang</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer rounded-xl border border-line bg-white p-2.5 hover:bg-stone-50">
                <input type="radio" name="pos-payment-mode" value="later" class="accent-brand" ${i===`later`?`checked`:``} />
                <span class="text-xs font-bold text-stone-700">Belum dibayar</span>
              </label>
            </div>

            ${i===`now`?`
                  <div class="grid grid-cols-2 gap-2">
                    <div>
                      <label class="label" for="pos-method">Metode bayar</label>
                      <select id="pos-method" class="select">
                        ${d.map(e=>`<option value="${P(e)}" ${Z.method===e?`selected`:``}>${P(e)}</option>`).join(``)}
                      </select>
                    </div>
                    <div>
                      <label class="label" for="pos-paid">Uang diterima (opsional)</label>
                      <input id="pos-paid" type="number" min="0" step="1000" class="input input-sm" placeholder="Uang pas" value="${P(Z.amountPaid)}" />
                    </div>
                  </div>
                `:`
                  <div>
                    <label class="label" for="pos-due-date">Jatuh tempo invoice</label>
                    <input id="pos-due-date" type="date" class="input input-sm" value="${P(Z.dueDate||A(k(),7))}" />
                  </div>
                  <p class="text-[10px] text-amber-800 leading-relaxed">Invoice akan tersimpan di profil penghuni/kamar sebagai tunggakan sampai pembayaran diverifikasi.</p>
                `}
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="label" for="pos-discount">Diskon (Rp)</label>
              <input id="pos-discount" type="number" min="0" step="500" class="input input-sm" placeholder="0" value="${P(Z.discount)}" />
            </div>
            <div>
              <label class="label" for="pos-note">Catatan</label>
              <input id="pos-note" type="text" class="input input-sm" placeholder="cth: antar jam 5 sore" value="${P(Z.note)}" />
            </div>
          </div>

          <div class="rounded-2xl border border-line bg-cream/70 p-3" id="pos-totals">${_o()}</div>

          <button type="button" class="btn-primary w-full py-3" data-pos-checkout ${lo().length?``:`disabled`}>
            ${i===`now`?`${N(`Check`,`w-4 h-4`)} Simpan Pembayaran`:`${N(`FilePlus2`,`w-4 h-4`)} Terbitkan Invoice`}
          </button>
          <p class="text-[10px] text-stone-500 text-center">${i===`now`?`Transaksi langsung tercatat sebagai pendapatan POS.`:`Invoice belum dihitung sebagai pendapatan sampai dibayar.`}</p>
        </div>
      </aside>
    </div>
  `}function Co(){let e=Ne(),t=$a(),n=no();return`
    <div class="space-y-5">
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-3">
        ${q({label:`Transaksi Hari Ini`,value:n.todayCount,iconName:`ReceiptText`,hint:Q(n.todayRevenue)})}
        ${q({label:`Pendapatan Hari Ini`,value:Q(n.todayRevenue),iconName:`Wallet`,tone:`green`})}
        ${q({label:`Transaksi Bulan Ini`,value:n.monthCount,iconName:`ShoppingCart`,hint:Q(n.monthRevenue)})}
        ${q({label:`Pendapatan POS Bulan Ini`,value:Q(n.monthRevenue),iconName:`Coins`,tone:`brand`})}
        ${q({label:`Tunggakan POS`,value:Q(n.monthOutstanding),iconName:`CircleAlert`,tone:n.monthOutstanding?`rose`:`default`,hint:`${n.unpaidCount} invoice belum dibayar`})}
      </div>

      <div class="card overflow-hidden">
        <div class="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-line">
          <div>
            <h2 class="text-sm font-extrabold text-stone-800">Riwayat Transaksi POS</h2>
            <p class="text-[11px] text-stone-500 mt-0.5">${t.length} transaksi terakhir. Struk dapat dicetak ulang.</p>
          </div>
          <span class="badge-gold">${Q(n.monthRevenue)} bulan ini</span>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>No. Struk</th><th>Waktu</th><th>Pelanggan</th><th>Item</th><th>Metode</th><th>Total</th><th>Status</th><th class="text-right">Aksi</th></tr></thead>
            <tbody>
              ${t.length?t.map(t=>{let n=(t.items||[]).map(e=>`${e.name} ×${so(e.qty)}`).join(`, `);return`
                          <tr>
                            <td class="font-mono text-[11px] font-bold text-stone-700 whitespace-nowrap">${P(t.number||`—`)}</td>
                            <td class="whitespace-nowrap text-[11px] text-stone-600">${Ze(t.createdAt||t.date)}</td>
                            <td>
                              <p class="font-bold text-stone-800">${P(t.customerName||`Walk-in`)}</p>
                              ${t.roomNumber?`<p class="text-[10px] text-stone-500">Kamar ${P(t.roomNumber)}</p>`:``}
                            </td>
                            <td class="max-w-[240px]"><p class="text-[11px] text-stone-600 truncate" title="${P(n)}">${P(n)}</p></td>
                            <td><span class="badge-gray normal-case tracking-normal">${P(t.method||`—`)}</span></td>
                            <td class="font-black text-stone-800 whitespace-nowrap">${Q(t.total)}</td>
                            <td>
                              ${Ni(t.status===`paid`?`paid`:`unpaid`)}
                              ${t.status!==`paid`&&t.dueDate?`<p class="text-[10px] text-rose-700 mt-0.5 whitespace-nowrap">s/d ${j(t.dueDate)}</p>`:``}
                            </td>
                            <td>
                              <div class="flex items-center justify-end gap-1">
                                ${t.status!==`paid`&&t.invoiceId?`<button type="button" class="btn-primary btn-xs" data-pos-verify data-invoice="${t.invoiceId}">${N(`ShieldCheck`,`w-3 h-3`)} Tandai Lunas</button>`:``}
                                <button type="button" class="btn-ghost btn-xs" data-pos-detail data-sale="${t.id}" title="Lihat struk">${N(`ReceiptText`,`w-3.5 h-3.5`)}</button>
                                ${e?`<button type="button" class="btn-ghost btn-xs text-rose-600" data-pos-delete-sale data-sale="${t.id}" title="Hapus transaksi">${N(`Trash2`,`w-3.5 h-3.5`)}</button>`:``}
                              </div>
                            </td>
                          </tr>`}).join(``):`<tr><td colspan="8" class="px-4 py-12 text-center text-sm text-stone-600">Belum ada transaksi POS. Mulai dari tab Kasir.</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `}function wo(){return io===`riwayat`?Co():So()}function To(e){e.querySelectorAll(`[data-pos-tab]`).forEach(e=>{e.className=`${e.dataset.posTab===io?`chip-active`:`chip-idle`} flex items-center gap-1.5`})}function Eo(e){let t=e.querySelector(`#pos-content`);t&&(t.innerHTML=wo(),To(e))}function Do(){X=[],Z={...Z,tenantId:``,roomId:``,roomNumber:``,customerName:``,customerPhone:``,customerEmail:``,note:``,method:`Tunai / Cash`,discount:``,amountPaid:``,dueDate:A(k(),7),sendEmail:!0}}function Oo(e){let t=R();return`
    <div class="rounded-2xl border border-line bg-white p-5 font-mono text-[11px] text-stone-700">
      <div class="text-center border-b border-dashed border-stone-300 pb-3">
        <p class="font-black text-sm tracking-wider text-stone-900">${P(t.propertyName||`Casa Ramire`)}</p>
        ${t.address?`<p class="text-[10px] text-stone-500 mt-0.5">${P(t.address)}</p>`:``}
        ${t.whatsapp?`<p class="text-[10px] text-stone-500">WA ${P(t.whatsapp)}</p>`:``}
      </div>
      <div class="py-3 border-b border-dashed border-stone-300 space-y-1">
        <div class="flex justify-between gap-2"><span>No.</span><b>${P(e.number||`—`)}</b></div>
        <div class="flex justify-between gap-2"><span>Tanggal</span><span>${Ze(e.createdAt||e.date)}</span></div>
        <div class="flex justify-between gap-2"><span>Kasir</span><span>${P(e.cashier||`—`)}</span></div>
        <div class="flex justify-between gap-2"><span>Pelanggan</span><span>${P(e.customerName||`Walk-in`)}</span></div>
        ${e.roomNumber?`<div class="flex justify-between gap-2"><span>Kamar</span><span>${P(e.roomNumber)}</span></div>`:``}
        <div class="flex justify-between gap-2"><span>Status</span><b class="${e.status===`paid`?`text-emerald-700`:`text-rose-700`}">${e.status===`paid`?`Lunas`:`Belum dibayar`}</b></div>
        ${e.status!==`paid`&&e.dueDate?`<div class="flex justify-between gap-2"><span>Jatuh tempo</span><span>${j(e.dueDate)}</span></div>`:``}
      </div>
      <div class="py-3 border-b border-dashed border-stone-300 space-y-2">
        ${(e.items||[]).map(e=>`
            <div>
              <p class="font-bold text-stone-800">${P(e.name)}</p>
              <div class="flex justify-between gap-2">
                <span>${so(e.qty)} ${P(e.unit||``)} × ${Q(e.price)}</span>
                <b>${Q(e.subtotal)}</b>
              </div>
            </div>`).join(``)}
      </div>
      <div class="py-3 space-y-1">
        <div class="flex justify-between gap-2"><span>Subtotal</span><span>${Q(e.subtotal)}</span></div>
        ${e.discount>0?`<div class="flex justify-between gap-2"><span>Diskon</span><span>−${Q(e.discount)}</span></div>`:``}
        <div class="flex justify-between gap-2 font-black text-sm text-stone-900 pt-1 border-t border-stone-300"><span>Total</span><span>${Q(e.total)}</span></div>
        ${e.status===`paid`?`<div class="flex justify-between gap-2"><span>${P(e.method||`Bayar`)}</span><span>${Q(e.amountPaid)}</span></div>
               <div class="flex justify-between gap-2"><span>Kembalian</span><span>${Q(e.change)}</span></div>`:`<div class="flex justify-between gap-2 text-rose-700"><span>Belum dibayar</span><span>${Q(e.total)}</span></div>`}
      </div>
      ${e.note?`<p class="border-t border-dashed border-stone-300 pt-2 text-[10px] text-stone-600">Catatan: ${P(e.note)}</p>`:``}
      <p class="text-center text-[10px] text-stone-500 pt-3">Terima kasih sudah menggunakan layanan kami.</p>
    </div>
  `}function ko(e){let t=R();return`
    <div class="center">
      <h1>${P(t.propertyName||`Casa Ramire`)}</h1>
      ${t.address?`<div class="muted">${P(t.address)}</div>`:``}
      ${t.whatsapp?`<div class="muted">WA ${P(t.whatsapp)}</div>`:``}
    </div>
    <div class="line"></div>
    <div class="row"><span>No.</span><span class="bold">${P(e.number||`—`)}</span></div>
    <div class="row"><span>Tanggal</span><span>${Ze(e.createdAt||e.date)}</span></div>
    <div class="row"><span>Kasir</span><span>${P(e.cashier||`—`)}</span></div>
    <div class="row"><span>Pelanggan</span><span>${P(e.customerName||`Walk-in`)}</span></div>
    ${e.roomNumber?`<div class="row"><span>Kamar</span><span>${P(e.roomNumber)}</span></div>`:``}
    <div class="row"><span>Status</span><span class="bold">${e.status===`paid`?`LUNAS`:`BELUM DIBAYAR`}</span></div>
    ${e.status!==`paid`&&e.dueDate?`<div class="row"><span>Jatuh tempo</span><span>${j(e.dueDate)}</span></div>`:``}
    <div class="line"></div>
    ${(e.items||[]).map(e=>`
        <div class="item">
          <div class="bold">${P(e.name)}</div>
          <div class="row"><span>${so(e.qty)} ${P(e.unit||``)} × ${Q(e.price)}</span><span>${Q(e.subtotal)}</span></div>
        </div>`).join(``)}
    <div class="line"></div>
    <div class="row"><span>Subtotal</span><span>${Q(e.subtotal)}</span></div>
    ${e.discount>0?`<div class="row"><span>Diskon</span><span>−${Q(e.discount)}</span></div>`:``}
    <div class="row total"><span>Total</span><span>${Q(e.total)}</span></div>
    ${e.status===`paid`?`<div class="row"><span>${P(e.method||`Bayar`)}</span><span>${Q(e.amountPaid)}</span></div>
           <div class="row"><span>Kembalian</span><span>${Q(e.change)}</span></div>`:`<div class="row"><span>Belum dibayar</span><span>${Q(e.total)}</span></div>`}
    ${e.note?`<div class="line"></div><div class="muted">Catatan: ${P(e.note)}</div>`:``}
    <div class="line"></div>
    <div class="center muted">Terima kasih sudah menggunakan layanan kami.</div>
  `}function Ao(e){let t=window.open(``,`_blank`,`width=420,height=680`);t?(t.document.write(`<!doctype html>
    <html lang="id"><head><meta charset="utf-8" /><title>${P(e.number||`Struk POS`)}</title>
    <style>
      * { box-sizing: border-box; }
      body { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 12px; color: #292524; margin: 0; padding: 18px; }
      .center { text-align: center; }
      .row { display: flex; justify-content: space-between; gap: 12px; }
      .muted { color: #78716c; font-size: 10px; }
      .bold { font-weight: 700; }
      .line { border-top: 1px dashed #a8a29e; margin: 8px 0; }
      .item { margin-bottom: 6px; }
      h1 { font-size: 15px; margin: 0 0 4px; letter-spacing: .08em; }
      .total { font-size: 15px; font-weight: 800; }
    </style></head>
    <body>${ko(e)}</body></html>`),t.document.close(),t.focus(),setTimeout(()=>t.print(),250)):L(`Popup diblokir browser. Izinkan popup untuk mencetak struk.`,`warning`)}function jo(e,{fresh:t=!1}={}){let n=e.status===`paid`;V({title:t?n?`Pembayaran Berhasil`:`Invoice POS Diterbitkan`:`${n?`Struk`:`Invoice`} ${e.number||`POS`}`,subtitle:`${e.customerName||`Walk-in`} • ${Q(e.total)}`,size:`md`,body:`
      <div class="space-y-4">
        ${t?`<div class="rounded-2xl border ${n?`border-emerald-200 bg-emerald-50`:`border-amber-200 bg-amber-50`} p-4 flex items-start gap-3">
                <span class="w-10 h-10 rounded-xl ${n?`bg-emerald-100 text-emerald-700`:`bg-amber-100 text-amber-700`} flex items-center justify-center shrink-0">${N(n?`CheckCircle2`:`FilePlus2`,`w-5 h-5`)}</span>
                <div>
                  <p class="text-sm font-extrabold ${n?`text-emerald-900`:`text-amber-900`}">${n?`Transaksi tersimpan`:`Invoice tersimpan sebagai tunggakan`}</p>
                  <p class="text-[11px] ${n?`text-emerald-800`:`text-amber-800`} mt-0.5">${n?`Pendapatan POS sudah masuk ke laporan keuangan.`:`Tagihan akan tetap terbuka sampai pembayaran diverifikasi.`}</p>
                </div>
              </div>`:``}
        ${Oo(e)}
      </div>
    `,footer:`
      <button type="button" class="btn-outline btn-sm" data-modal-close>Tutup</button>
      <button type="button" class="btn-primary btn-sm" data-print-receipt>${N(`Printer`,`w-4 h-4`)} Cetak Struk</button>
    `,onMount(t){t.querySelector(`[data-print-receipt]`)?.addEventListener(`click`,()=>Ao(e))}})}function Mo(e=null,t){if(!Ne()){L(`Kelola produk POS hanya dapat dilakukan oleh owner.`,`warning`);return}let n=e?Ja(e):null,r=Ya();V({title:n?`Edit Produk / Layanan`:`Tambah Produk / Layanan`,subtitle:`Nama, kategori, harga, dan satuan dipakai di kasir POS.`,size:`md`,body:`
      <form id="pos-product-form" class="space-y-3" novalidate>
        <div>
          <label class="label" for="pos-product-name">Nama produk / layanan</label>
          <input id="pos-product-name" type="text" class="input" placeholder="cth: Cuci Kering Setrika" value="${P(n?.name||``)}" />
        </div>
        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label class="label" for="pos-product-category">Kategori</label>
            <input id="pos-product-category" type="text" list="pos-category-list" class="input" placeholder="cth: Laundry" value="${P(n?.category||`Laundry`)}" />
            <datalist id="pos-category-list">
              ${r.map(e=>`<option value="${P(e)}"></option>`).join(``)}
            </datalist>
          </div>
          <div>
            <label class="label" for="pos-product-unit">Satuan</label>
            <input id="pos-product-unit" type="text" class="input" placeholder="kg / pcs / kali" value="${P(n?.unit||``)}" />
          </div>
        </div>
        <div>
          <label class="label" for="pos-product-price">Harga (Rp)</label>
          <input id="pos-product-price" type="number" min="0" step="500" class="input" placeholder="cth: 7000" value="${n?D(n.price):``}" />
        </div>
        <label class="flex items-center gap-2 cursor-pointer p-2.5 rounded-xl border border-line hover:bg-stone-50">
          <input id="pos-product-active" type="checkbox" class="w-4 h-4 accent-brand" ${n?n.active?`checked`:``:`checked`} />
          <span class="text-xs font-bold text-stone-700">Tampilkan di kasir</span>
        </label>
      </form>
    `,footer:`
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      <button type="submit" form="pos-product-form" class="btn-primary btn-sm">${N(`Check`,`w-4 h-4`)} Simpan</button>
    `,onMount(e,r){e.querySelector(`#pos-product-form`).addEventListener(`submit`,i=>{i.preventDefault();try{Xa({id:n?.id||null,name:e.querySelector(`#pos-product-name`).value,category:e.querySelector(`#pos-product-category`).value,unit:e.querySelector(`#pos-product-unit`).value,price:D(e.querySelector(`#pos-product-price`).value),active:e.querySelector(`#pos-product-active`).checked}),L(n?`Produk berhasil diperbarui.`:`Produk baru berhasil ditambahkan.`),r(),t?.()}catch(e){L(e.message,`error`)}})}})}function No(){Ne()?V({title:`Kelola Produk POS`,subtitle:`Tambah, ubah harga, nonaktifkan, atau hapus layanan.`,size:`lg`,body:`
      <div class="space-y-3">
        <div class="flex items-center justify-between gap-2">
          <p class="text-[11px] text-stone-500">Perubahan langsung dipakai di kasir.</p>
          <button type="button" class="btn-primary btn-sm" data-pm-add>${N(`Plus`,`w-4 h-4`)} Tambah Produk</button>
        </div>
        <div id="pos-pm-list" class="space-y-2"></div>
      </div>
    `,footer:`<button type="button" class="btn-outline btn-sm" data-modal-close>Tutup</button>`,onMount(e){let t=e.querySelector(`#pos-pm-list`),n=()=>{let e=qa();t.innerHTML=e.length?e.map(e=>`
                <div class="rounded-2xl border border-line bg-white px-3.5 py-3 flex flex-wrap items-center gap-2">
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2 flex-wrap">
                      <p class="text-xs font-extrabold text-stone-800">${P(e.name)}</p>
                      <span class="badge-gray normal-case tracking-normal">${P(e.category)}</span>
                      ${e.active?`<span class="badge-green">Aktif</span>`:`<span class="badge-gray">Nonaktif</span>`}
                    </div>
                    <p class="text-[11px] text-stone-500 mt-0.5">${Q(e.price)}${e.unit?` / ${P(e.unit)}`:``}</p>
                  </div>
                  <div class="flex items-center gap-1 ml-auto">
                    <button type="button" class="btn-outline btn-xs" data-pm-toggle="${e.id}">${e.active?`Nonaktifkan`:`Aktifkan`}</button>
                    <button type="button" class="btn-ghost btn-xs" data-pm-edit="${e.id}" title="Edit">${N(`Pencil`,`w-3.5 h-3.5`)}</button>
                    <button type="button" class="btn-ghost btn-xs text-rose-600" data-pm-delete="${e.id}" title="Hapus">${N(`Trash2`,`w-3.5 h-3.5`)}</button>
                  </div>
                </div>`).join(``):`<p class="text-sm text-stone-500 text-center py-8">Belum ada produk. Tambahkan layanan pertama.</p>`};n(),e.querySelector(`[data-pm-add]`)?.addEventListener(`click`,()=>{Mo(null,n)}),e.addEventListener(`click`,async e=>{let t=e.target.closest(`[data-pm-edit]`);if(t){Mo(Number(t.dataset.pmEdit),n);return}let r=e.target.closest(`[data-pm-toggle]`);if(r){Za(Number(r.dataset.pmToggle)),n(),L(`Status produk diperbarui.`);return}let i=e.target.closest(`[data-pm-delete]`);i&&await H({title:`Hapus produk?`,message:`Produk <b>${P(Ja(Number(i.dataset.pmDelete))?.name||``)}</b> akan dihapus dari kasir. Transaksi lama tetap menyimpan nama dan harga saat itu.`,confirmText:`Ya, hapus`,danger:!0})&&(Qa(Number(i.dataset.pmDelete)),n(),L(`Produk berhasil dihapus.`))})}}):L(`Kelola produk POS hanya dapat dilakukan oleh owner.`,`warning`)}function Po(e){e.innerHTML=`
    <div data-view="pos" class="animate-in">
      ${K({eyebrow:`Point of Sale`,title:`POS / Kasir 🧺`,subtitle:`Catat penjualan laundry dan layanan lain. Owner dapat menambah atau mengubah produk.`,actions:`
          ${Ne()?`<button type="button" class="btn-outline btn-sm" data-pos-manage>${N(`Package`,`w-4 h-4`)} Kelola Produk</button>`:``}
          <button type="button" class="btn-primary btn-sm" data-pos-new>${N(`ShoppingCart`,`w-4 h-4`)} Transaksi Baru</button>
        `})}

      <div class="flex flex-wrap gap-2 mb-5 border-b border-line pb-3">
        <button type="button" class="${io===`kasir`?`chip-active`:`chip-idle`} flex items-center gap-1.5" data-pos-tab="kasir">${N(`ShoppingCart`,`w-3.5 h-3.5`)} Kasir</button>
        <button type="button" class="${io===`riwayat`?`chip-active`:`chip-idle`} flex items-center gap-1.5" data-pos-tab="riwayat">${N(`ReceiptText`,`w-3.5 h-3.5`)} Riwayat</button>
      </div>

      <div id="pos-content"></div>
    </div>
  `;let t=e.querySelector(`[data-view="pos"]`);Eo(t),t.querySelectorAll(`[data-pos-tab]`).forEach(e=>{e.addEventListener(`click`,()=>{io=e.dataset.posTab===`riwayat`?`riwayat`:`kasir`,Eo(t)})}),F(t,`click`,`[data-pos-new]`,()=>{io=`kasir`,Eo(t)}),F(t,`click`,`[data-pos-category]`,(e,n)=>{oo=n.dataset.posCategory||`semua`;let r=t.querySelector(`#pos-categories`);r&&(r.innerHTML=xo());let i=t.querySelector(`#pos-products`);i&&(i.innerHTML=bo())}),F(t,`input`,`#pos-search`,(e,n)=>{ao=n.value;let r=t.querySelector(`#pos-products`);r&&(r.innerHTML=bo())}),F(t,`click`,`[data-pos-add]`,(e,n)=>{let r=Number(n.dataset.product),i=Ja(r);if(!i||!i.active){L(`Produk tidak tersedia.`,`warning`);return}let a=X.find(e=>Number(e.productId)===r);a?a.qty=co(a.qty+1):X.push({productId:r,qty:1}),vo(t)}),F(t,`click`,`[data-pos-plus]`,(e,n)=>{let r=Number(n.dataset.product),i=X.find(e=>Number(e.productId)===r);i&&(i.qty=co(i.qty+1),vo(t))}),F(t,`click`,`[data-pos-minus]`,(e,n)=>{let r=Number(n.dataset.product),i=X.find(e=>Number(e.productId)===r);i&&(i.qty=co(i.qty-1),i.qty<=0&&(X=X.filter(e=>Number(e.productId)!==r)),vo(t))}),F(t,`change`,`[data-pos-qty]`,(e,n)=>{let r=Number(n.dataset.product),i=X.find(e=>Number(e.productId)===r);i&&(i.qty=co(n.value),i.qty<=0&&(X=X.filter(e=>Number(e.productId)!==r)),vo(t))}),F(t,`click`,`[data-pos-remove]`,(e,n)=>{let r=Number(n.dataset.product);X=X.filter(e=>Number(e.productId)!==r),vo(t)}),F(t,`click`,`[data-pos-clear]`,()=>{X=[],Z.discount=``,Z.amountPaid=``,vo(t)});let n=()=>{ho(t);let e=t.querySelector(`#pos-totals`);e&&(e.innerHTML=_o())};F(t,`input`,`#pos-discount, #pos-paid, #pos-method`,n),F(t,`change`,`#pos-method`,n),F(t,`input`,`#pos-customer-name, #pos-customer-phone, #pos-note`,()=>{ho(t)}),F(t,`input`,`#pos-customer-email`,()=>{ho(t);let e=t.querySelector(`#pos-send-email`),n=t.querySelector(`#pos-email-hint`),r=jn(Z.customerEmail);e&&(e.disabled=!r,r||(e.checked=!1)),n&&(n.textContent=r?Z.customerEmail:`Email belum tersedia. Lengkapi dulu di profil penghuni atau isi email non tenant.`)}),F(t,`change`,`#pos-send-email`,()=>{ho(t)}),F(t,`change`,`input[name="pos-customer-mode"]`,(e,n)=>{ho(t),n.value===`tenant`?Z.paymentMode=`later`:(Z.tenantId=``,Z.roomId=``,Z.roomNumber=``,Z.customerName=``,Z.customerPhone=``,Z.customerEmail=``,Z.paymentMode=`now`),Eo(t)}),F(t,`change`,`#pos-tenant-select`,()=>{ho(t),Eo(t)}),F(t,`change`,`input[name="pos-payment-mode"]`,()=>{ho(t),Eo(t)}),F(t,`change`,`#pos-due-date`,()=>{ho(t)}),F(t,`click`,`[data-pos-checkout]`,async()=>{ho(t);let e=uo();if(!e.lines.length){L(`Keranjang masih kosong.`,`warning`);return}let n=Z.customerMode===`tenant`?mo():null;if(Z.customerMode===`tenant`&&!n){L(`Belum ada penghuni aktif. Pilih non tenant atau tambahkan penghuni dulu.`,`warning`);return}let r=n?.tenant.email||Z.customerEmail,i=!!Z.sendEmail;if(i&&!jn(r))L(`Email pelanggan belum valid. Isi email atau hapus centang kirim email.`,`warning`);else try{let a=Z.paymentMode!==`later`,o=eo({items:e.lines.map(e=>({productId:e.product.id,qty:e.qty})),discount:Z.discount,method:Z.method,amountPaid:Z.amountPaid,customerName:n?.tenant.name||Z.customerName,customerPhone:n?.tenant.phone||Z.customerPhone,customerEmail:r,tenantId:n?.tenant.id||null,roomId:n?.room.id||null,roomNumber:n?.room.nomor||``,note:Z.note,date:k(),status:a?`paid`:`unpaid`,dueDate:Z.dueDate,withInvoice:i||void 0});if(Do(),Eo(t),a?(jo(o,{fresh:!0}),L(`Pembayaran POS berhasil disimpan.`)):o.invoice?(wa(o.invoice),L(`Invoice POS berhasil diterbitkan.`)):(jo(o,{fresh:!0}),L(`Invoice POS berhasil diterbitkan.`)),i&&o.invoice)try{let{delivery:e}=await ba(o.invoice);L(e.sent?`Invoice dikirim ke ${r}.`:`Email belum dikonfigurasi. Aplikasi email perangkat dibuka sebagai gantinya.`,e.sent?`success`:`warning`)}catch(e){L(`Invoice tersimpan, tetapi email gagal dikirim: ${e.message}`,`error`)}}catch(e){L(e.message,`error`)}}),F(t,`click`,`[data-pos-manage]`,()=>{No()}),F(t,`click`,`[data-pos-detail]`,(e,t)=>{let n=$a().find(e=>String(e.id)===String(t.dataset.sale));n&&jo(n)}),F(t,`click`,`[data-pos-verify]`,(e,t)=>{let n=Number(t.dataset.invoice);n?xa({kind:`invoice`,id:n}):L(`Invoice terkait tidak ditemukan.`,`error`)}),F(t,`click`,`[data-pos-delete-sale]`,async(e,n)=>{if(!Ne()){L(`Hapus transaksi hanya dapat dilakukan oleh owner.`,`warning`);return}let r=$a().find(e=>String(e.id)===String(n.dataset.sale));await H({title:`Hapus transaksi POS?`,message:`Transaksi <b>${P(r?.number||``)}</b> sebesar <b>${Q(r?.total||0)}</b> akan dihapus permanen dan tidak lagi dihitung di laporan.`,confirmText:`Ya, hapus`,danger:!0})&&(to(Number(n.dataset.sale)),Eo(t),L(`Transaksi POS berhasil dihapus.`))})}var Fo=n({render:()=>Ko}),Io=`pending`,Lo=[],Ro=!0,zo=``,Bo=0,Vo=!1;function Ho(e){let t=v[e]||v.pending;return`<span class="${t.badge}">${t.label}</span>`}function Uo(e){return e.periode===`harian`?`Harian`:e.periode===`mingguan`?`Mingguan`:`${e.periode} bulan`}function Wo(e){if(!e.promoCode)return`—`;let t=mn(e.promoCode);return t?`${t.code} · ${t.type===`persen`?`${t.value}%`:O(t.value)}`:`${e.promoCode} (tidak aktif)`}function Go(e){let t=e.status===`pending`;return`
    <tr>
      <td>
        <p class="font-mono text-[11px] font-bold text-stone-700 whitespace-nowrap">${P(e.code)}</p>
        <p class="text-[10px] text-stone-500 mt-0.5">${Ze(e.createdAt)}</p>
        ${e.source===`local`?`<span class="badge-amber mt-1">Lokal (dev)</span>`:``}
      </td>
      <td>
        <p class="font-bold text-stone-800">${P(e.name)}</p>
        <p class="text-[10px] text-stone-600">${P(e.phone)}</p>
        <p class="text-[10px] text-stone-500 truncate max-w-[180px]">${P(e.email||`—`)}</p>
      </td>
      <td>
        <p class="font-semibold text-stone-700">${Uo(e)}</p>
        <p class="text-[10px] text-stone-600">${j(e.startDate)}${e.endDate?` — ${j(e.endDate)}`:``}</p>
        <p class="text-[10px] text-stone-500">${e.floor?`Lantai ${P(e.floor)}`:`Lantai fleksibel`}${e.roomNumber?` · Kamar ${P(e.roomNumber)}`:``}</p>
      </td>
      <td>
        ${e.car?`<span class="badge-blue">Mobil</span>`:`<span class="badge-gray">Tanpa mobil</span>`}
        <p class="text-[10px] text-stone-500 mt-1">${P(Wo(e))}</p>
      </td>
      <td class="font-bold whitespace-nowrap">${e.estimate?O(e.estimate):`—`}</td>
      <td>${Ho(e.status)}</td>
      <td>
        <div class="flex flex-wrap justify-end gap-1">
          ${t?`<button type="button" class="btn-primary btn-xs" data-action="convert" data-code="${P(e.code)}">${N(`UserPlus`,`w-3 h-3`)} Jadikan Booking</button>`:``}
          ${t?`<button type="button" class="btn-ghost btn-xs text-rose-600" data-action="reject" data-code="${P(e.code)}">Tolak</button>`:``}
        </div>
      </td>
    </tr>
  `}function Ko(e){let t=Io===`all`?Lo:Lo.filter(e=>e.status===Io),n=Lo.filter(e=>e.status===`pending`).length,r=Lo.filter(e=>e.status===`confirmed`).length,i=Lo.filter(e=>e.car).length;e.innerHTML=`
    <div data-view="bookings" class="animate-in">
      ${K({eyebrow:`Public Booking`,title:`Booking Online 📥`,subtitle:`Permintaan booking dari calon penghuni di landing page. Konversi menjadi booking kamar setelah dikonfirmasi.`,actions:`<button type="button" class="btn-outline btn-sm" data-action="refresh">${N(`RefreshCw`,`w-4 h-4`)} Muat ulang</button>`})}

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        ${q({label:`Menunggu`,value:n,iconName:`Inbox`,tone:n?`amber`:`default`})}
        ${q({label:`Sudah Dikonversi`,value:r,iconName:`CheckCircle2`,tone:`green`})}
        ${q({label:`Bawa Mobil`,value:i,iconName:`Car`,tone:`brand`,hint:`Surcharge Rp130.000/bln`})}
        ${q({label:`Total Permintaan`,value:Lo.length,iconName:`ClipboardList`})}
      </div>

      ${zo?`<div class="rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900 mb-4 flex items-start gap-2">
              ${N(`AlertTriangle`,`w-4 h-4 shrink-0 mt-0.5`)}
              <span>${P(zo)}</span>
            </div>`:``}

      <div class="card p-3 mb-5 flex flex-wrap items-center gap-2">
        ${[[`pending`,`Menunggu`],[`confirmed`,`Dikonversi`],[`rejected`,`Ditolak`],[`all`,`Semua`]].map(([e,t])=>`
            <button type="button" class="${Io===e?`chip-active`:`chip-idle`}" data-filter="${e}">
              ${t} (${e===`all`?Lo.length:Lo.filter(t=>t.status===e).length})
            </button>`).join(``)}
        <span class="ml-auto text-[10px] text-stone-500">${Ro?`Memuat…`:`Diperbarui ${new Date().toLocaleTimeString(`id-ID`)}`}</span>
      </div>

      <div class="card overflow-hidden">
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Kode</th>
                <th>Calon Penghuni</th>
                <th>Sewa</th>
                <th>Tambahan</th>
                <th>Estimasi</th>
                <th>Status</th>
                <th class="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              ${t.length?t.map(Go).join(``):`<tr><td colspan="7" class="py-10">${Ii({iconName:`Inbox`,title:Ro?`Memuat booking…`:`Belum ada booking online`,description:Ro?`Mohon tunggu sebentar.`:`Permintaan booking dari landing page akan muncul di sini.`})}</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,F(e.querySelector(`[data-view="bookings"]`),`click`,`[data-action], [data-filter]`,async(t,n)=>{let r=n.dataset.action;if(n.dataset.filter){Io=n.dataset.filter,Ko(e);return}if(r===`refresh`){Ro=!0,Ko(e),await qo(),e.querySelector(`[data-view="bookings"]`)&&Ko(e);return}let i=Lo.find(e=>e.code===n.dataset.code);if(i){if(r===`convert`)Yo(i,()=>{e.querySelector(`[data-view="bookings"]`)&&Ko(e)});else if(r===`reject`){if(!await H({title:`Tolak booking online?`,message:`Permintaan <b>${P(i.code)}</b> dari <b>${P(i.name)}</b> akan ditandai ditolak. Kuota promo dikembalikan.`,confirmText:`Ya, tolak`,danger:!0}))return;try{await en({...i,status:`rejected`}),i.status=`rejected`,L(`Booking online ditolak.`),Ko(e)}catch(e){L(e.message,`error`)}}}});let a=Date.now()-Bo>3e4;!Ro&&a?(Ro=!0,Ko(e)):Ro&&!Vo&&(Vo=!0,qo().then(()=>{e.querySelector(`[data-view="bookings"]`)&&Ko(e)}).finally(()=>{Vo=!1}))}async function qo(){let e=await $t();Lo=e.requests,zo=e.offline?`Mode lokal / API belum tersedia: ${e.reason||`perubahan hanya tersimpan di perangkat ini.`}`:``,e.promos?.length&&hn(e.promos),Bo=Date.now(),Ro=!1}function Jo(e){return Hr().filter(e=>e.status===`kosong`).sort((e,t)=>e.nomor.localeCompare(t.nomor,void 0,{numeric:!0}))}function Yo(e,t){let n=Jo(e.roomId);if(!n.length){L(`Tidak ada kamar kosong. Kosongkan kamar terlebih dahulu.`,`warning`);return}let r=n.find(t=>String(t.id)===String(e.roomId));V({title:`Konversi Booking ${e.code}`,subtitle:`${e.name} • ${Uo(e)}`,size:`lg`,body:`
      <div class="space-y-4">
        <div class="rounded-2xl border border-line bg-cream/60 p-4 text-xs grid sm:grid-cols-2 gap-2">
          <div class="flex justify-between gap-3"><span class="text-stone-500">Nama</span><b class="text-stone-800">${P(e.name)}</b></div>
          <div class="flex justify-between gap-3"><span class="text-stone-500">WhatsApp</span><b class="text-stone-800">${P(e.phone)}</b></div>
          <div class="flex justify-between gap-3"><span class="text-stone-500">Email</span><b class="text-stone-800">${P(e.email)}</b></div>
          <div class="flex justify-between gap-3"><span class="text-stone-500">Pekerjaan</span><b class="text-stone-800">${P(e.job||`—`)}</b></div>
          <div class="flex justify-between gap-3"><span class="text-stone-500">Mulai</span><b class="text-stone-800">${j(e.startDate)}</b></div>
          <div class="flex justify-between gap-3"><span class="text-stone-500">Durasi</span><b class="text-stone-800">${Uo(e)}</b></div>
          <div class="flex justify-between gap-3"><span class="text-stone-500">Mobil</span><b class="text-stone-800">${e.car?`Ya (+Rp130.000/bln)`:`Tidak`}</b></div>
          <div class="flex justify-between gap-3"><span class="text-stone-500">Kode promo</span><b class="text-stone-800">${P(Wo(e))}</b></div>
          ${e.notes?`<div class="sm:col-span-2 flex justify-between gap-3"><span class="text-stone-500">Catatan</span><b class="text-stone-800 text-right">${P(e.notes)}</b></div>`:``}
        </div>

        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label class="label" for="bk-room">Kamar untuk booking</label>
            <select id="bk-room" class="select">
              ${n.map(e=>`<option value="${e.id}" ${r?.id===e.id?`selected`:``}>Kamar ${P(e.nomor)} — Lantai ${P(e.lantai)}</option>`).join(``)}
            </select>
          </div>
          <div>
            <label class="label" for="bk-start">Tanggal mulai</label>
            <input id="bk-start" type="date" class="input" value="${e.startDate||k()}" />
          </div>
        </div>

        <div class="rounded-xl border border-line bg-white p-3 text-[11px] text-stone-600 leading-relaxed">
          Total final dihitung ulang memakai pricelist aktif. Promo hanya berlaku jika kodenya masih aktif di menu Pricelist.
        </div>

        <div id="bk-summary" class="rounded-2xl border border-line bg-cream/70 p-4 text-xs space-y-2"></div>
      </div>
    `,footer:`
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      <button type="button" class="btn-primary btn-sm" data-confirm>${N(`CalendarClock`,`w-4 h-4`)} Simpan sebagai Booking</button>
    `,onMount(n,r){let i=n.querySelector(`#bk-room`),a=n.querySelector(`#bk-start`),o=n.querySelector(`#bk-summary`),s=()=>{let t=Hr().find(e=>String(e.id)===String(i.value));if(!t)return o.innerHTML=`<span class="text-rose-700 font-semibold">Kamar tidak ditemukan.</span>`,null;try{let n=un({lantai:t.lantai,periode:e.periode,startDate:a.value||e.startDate,endDate:e.endDate||void 0,promo:mn(e.promoCode),addons:[],car:!!e.car,depositEnabled:!1,depositValue:0,payOption:`partial`});return o.innerHTML=`
            <div class="flex justify-between gap-3"><span class="text-stone-500">Sewa (${n.units} ${n.unitLabel})</span><span class="font-bold">${O(n.base)}</span></div>
            ${n.discount>0?`<div class="flex justify-between gap-3 text-rose-700"><span>Diskon${n.promo?` (${P(n.promo.name)})`:``}</span><span class="font-bold">−${O(n.discount)}</span></div>`:``}
            ${n.addonTotal>0?`<div class="flex justify-between gap-3 text-amber-800"><span>Parkir mobil</span><span class="font-bold">${O(n.addonTotal)}</span></div>`:``}
            <div class="flex justify-between gap-3 pt-2 border-t border-line"><span class="font-bold text-stone-700">Total sewa</span><span class="font-extrabold text-stone-800">${O(n.grandTotal)}</span></div>
            <p class="text-[10px] text-stone-500">${j(n.startDate)} — ${j(n.endDate)}</p>
          `,n}catch(e){return o.innerHTML=`<span class="text-rose-700 font-semibold">${P(e.message)}</span>`,null}};i.addEventListener(`change`,s),a.addEventListener(`change`,s),s(),n.querySelector(`[data-confirm]`)?.addEventListener(`click`,async()=>{let i=n.querySelector(`#bk-room`).value,a=n.querySelector(`#bk-start`).value||e.startDate;if(s())try{ti(i,{name:e.name,phone:e.phone,email:e.email,job:e.job,notes:e.notes,emergencyContact:e.emergencyContact,periode:e.periode,startDate:a,endDate:e.endDate||void 0,car:!!e.car,promo:mn(e.promoCode),addons:[],depositEnabled:!1,depositValue:0,payOption:`partial`}),await en({...e,status:`confirmed`}),e.status=`confirmed`,L(`Booking online berhasil dikonversi ke booking kamar.`),r(),t?.()}catch(e){L(e.message,`error`)}})}})}var Xo=n({render:()=>ls}),Zo=`all`,Qo=`all`,$o=``,es=xe.getRaw(`casa-ramire:room-view`)||`grid`,ts={kosong:`border-t-amber-400`,booking:`border-t-indigo-400`,terisi:`border-t-emerald-500`};function ns(e){e.querySelectorAll(`[data-floor]`).forEach(e=>{e.className=e.dataset.floor===Zo?`chip-active`:`chip-idle`}),e.querySelectorAll(`[data-status]`).forEach(e=>{e.className=e.dataset.status===Qo?`chip-active`:`chip-idle`}),e.querySelectorAll(`[data-viewmode]`).forEach(e=>{e.className=`p-2 rounded-lg transition ${e.dataset.viewmode===es?`bg-brand text-white shadow-sm`:`text-stone-500 hover:bg-stone-100`}`})}function rs(e){return O(nn(e.lantai)[1]||0)}function is(e){return`<button type="button" class="btn-ghost btn-xs ${e.photo||e.photoUrl?`text-brand`:`text-stone-600`}" data-action="photo" data-id="${e.id}" title="Unggah / ganti foto kamar">${N(`Camera`,`w-3.5 h-3.5`)} ${e.photo||e.photoUrl?`Foto`:`Tambah foto`}</button>`}function as(e){return e.status===`kosong`?`
      ${is(e)}
      <button type="button" class="btn-outline btn-xs" data-action="booking" data-id="${e.id}">${N(`CalendarClock`,`w-3 h-3`)} Booking</button>
      <button type="button" class="btn-primary btn-xs" data-action="checkin" data-id="${e.id}">${N(`LogIn`,`w-3 h-3`)} Check-in</button>
      ${Ne()?`<button type="button" class="btn-ghost btn-xs text-rose-600" data-action="delete-room" data-id="${e.id}" title="Hapus kamar">${N(`Trash2`,`w-3.5 h-3.5`)}</button>`:``}
    `:e.status===`booking`?`
      ${is(e)}
      <button type="button" class="btn-primary btn-xs" data-action="checkin" data-id="${e.id}">${N(`LogIn`,`w-3 h-3`)} Check-in</button>
      <button type="button" class="btn-outline btn-xs" data-action="edit-booking" data-id="${e.id}">${N(`Pencil`,`w-3 h-3`)} Edit</button>
      <button type="button" class="btn-ghost btn-xs text-rose-600" data-action="cancel-booking" data-id="${e.id}" title="Batalkan booking">${N(`X`,`w-3.5 h-3.5`)}</button>
    `:`
    ${is(e)}
    <button type="button" class="btn-outline btn-xs" data-action="detail" data-id="${e.id}">${N(`UserRound`,`w-3 h-3`)} Detail</button>
    <button type="button" class="btn-outline btn-xs" data-action="extend" data-id="${e.id}">${N(`Repeat`,`w-3 h-3`)} Perpanjang</button>
    <button type="button" class="btn-ghost btn-xs text-rose-600" data-action="checkout" data-id="${e.id}" title="Check-out">${N(`DoorOpen`,`w-3.5 h-3.5`)}</button>
  `}function os(e,t){return e.status===`terisi`&&t?`
      <button type="button" class="flex items-center gap-2 hover:text-brand text-left min-w-0" data-action="detail" data-id="${e.id}">
        ${Li(t.name,`w-7 h-7 text-[9px]`)}
        <span class="min-w-0">
          <span class="block text-xs font-bold text-stone-800 truncate">${P(t.name)}</span>
          <span class="block text-[10px] text-stone-600">Penghuni aktif</span>
        </span>
      </button>`:e.status===`booking`&&e.booking?`
      <button type="button" class="flex items-center gap-2 hover:text-brand text-left min-w-0" data-action="edit-booking" data-id="${e.id}">
        ${Li(e.booking.name,`w-7 h-7 text-[9px] bg-indigo-600`)}
        <span class="min-w-0">
          <span class="block text-xs font-bold text-stone-800 truncate">${P(e.booking.name)}</span>
          <span class="block text-[10px] text-indigo-500">Calon penghuni</span>
        </span>
      </button>`:`<span class="text-xs text-stone-600 italic">Siap dihuni</span>`}function ss(e,t){return e.length?`<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
    ${e.map(e=>{let n=e.tenantId?t.get(String(e.tenantId)):null;return`
          <div class="card border-t-4 ${ts[e.status]||`border-t-stone-300`} p-5 rounded-2xl card-hover flex flex-col">
            <div class="flex items-center justify-between gap-2 mb-2">
              ${Mi(e.status)}
              <span class="text-[10px] font-bold uppercase tracking-wider text-stone-600">Lantai ${P(e.lantai)}</span>
            </div>
            ${e.photo||e.photoUrl?`<img src="${P(e.photo||e.photoUrl)}" alt="Foto kamar ${P(e.nomor)}" loading="lazy" class="w-full h-32 object-cover rounded-xl border border-line-soft mb-3" />`:`<div class="w-full h-24 rounded-xl border border-dashed border-line bg-gradient-to-br from-brand-50 via-cream to-gold-50 mb-3 flex flex-col items-center justify-center gap-1 text-stone-400">
                    ${N(`Image`,`w-6 h-6`)}
                    <span class="text-[10px] font-bold uppercase tracking-wider">Belum ada foto</span>
                  </div>`}
            <div class="flex items-end justify-between gap-2">
              <div>
                <h2 class="text-2xl font-black text-stone-800 leading-none">Kamar ${P(e.nomor)}</h2>
                <p class="text-[10px] font-bold text-amber-700 uppercase tracking-wider mt-1">Deluxe</p>
              </div>
              <div class="text-right">
                <p class="text-[9px] text-stone-600 font-bold uppercase tracking-wider">Tarif / bulan</p>
                <p class="text-sm font-black text-stone-700">${rs(e)}</p>
              </div>
            </div>
            <div class="mt-4 pt-3 border-t border-line-soft flex-1">
              ${os(e,n)}
            </div>
            <div class="mt-3 flex flex-wrap justify-end gap-1.5">${as(e)}</div>
          </div>`}).join(``)}
  </div>`:Ii({iconName:`SearchX`,title:`Kamar tidak ditemukan`,description:`Coba ubah filter lantai/status atau kata kunci pencarian.`})}function cs(e,t){return e.length?`
    <div class="card overflow-hidden">
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr><th>Kamar</th><th>Lantai</th><th>Status</th><th>Penghuni</th><th>Tarif / bulan</th><th class="text-right">Aksi</th></tr></thead>
          <tbody>
            ${e.map(e=>{let n=e.tenantId?t.get(String(e.tenantId)):null;return`
                  <tr>
                    <td class="font-black text-stone-800">
                      <div class="flex items-center gap-2">
                        ${e.photo||e.photoUrl?`<img src="${P(e.photo||e.photoUrl)}" alt="Foto kamar ${P(e.nomor)}" loading="lazy" class="w-10 h-10 rounded-lg object-cover border border-line-soft shrink-0" />`:`<span class="w-10 h-10 rounded-lg border border-dashed border-line bg-cream text-stone-400 flex items-center justify-center shrink-0">${N(`Image`,`w-4 h-4`)}</span>`}
                        <span>Kamar ${P(e.nomor)}</span>
                      </div>
                    </td>
                    <td>Lantai ${P(e.lantai)}</td>
                    <td>${Mi(e.status)}</td>
                    <td>${os(e,n)}</td>
                    <td class="font-bold whitespace-nowrap">${rs(e)}</td>
                    <td><div class="flex flex-wrap justify-end gap-1.5">${as(e)}</div></td>
                  </tr>`}).join(``)}
          </tbody>
        </table>
      </div>
    </div>`:`<div class="card">${Ii({iconName:`SearchX`,title:`Kamar tidak ditemukan`,description:`Coba ubah filter lantai/status atau kata kunci pencarian.`})}</div>`}function ls(e){let t=Hr(),n={all:t.length,2:t.filter(e=>e.lantai===`2`).length,3:t.filter(e=>e.lantai===`3`).length,kosong:t.filter(e=>e.status===`kosong`).length,booking:t.filter(e=>e.status===`booking`).length,terisi:t.filter(e=>e.status===`terisi`).length};e.innerHTML=`
    <div data-view="rooms" class="animate-in">
      ${K({eyebrow:`Inventaris Kamar`,title:`Status & Manajemen Kamar 🏢`,subtitle:`Kelola ${t.length} kamar di lantai 2 dan 3. Filter, cari, dan proses check-in dari satu tempat.`,actions:`
          <button type="button" class="btn-primary btn-sm" data-action="add-room">${N(`Plus`,`w-4 h-4`)} Tambah Kamar</button>
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
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-stone-600">${N(`Search`,`w-3.5 h-3.5`)}</span>
              <input id="room-search" type="search" class="input input-sm pl-8" placeholder="Cari kamar / penghuni…" value="${P($o)}" />
            </div>
            <div class="flex bg-stone-100 rounded-xl p-1 shrink-0">
              <button type="button" class="p-2 rounded-lg" data-viewmode="grid" title="Tampilan grid" aria-label="Tampilan grid">${N(`LayoutGrid`,`w-4 h-4`)}</button>
              <button type="button" class="p-2 rounded-lg" data-viewmode="list" title="Tampilan daftar" aria-label="Tampilan daftar">${N(`List`,`w-4 h-4`)}</button>
            </div>
          </div>
        </div>
      </div>

      <div id="rooms-content"></div>

      <div class="mt-5 flex flex-wrap items-center gap-3 text-[10px] font-semibold text-stone-600">
        <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Terisi</span>
        <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-indigo-400"></span> Booking</span>
        <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Kosong</span>
      </div>
    </div>
  `;let r=e.querySelector(`[data-view="rooms"]`),i=r.querySelector(`#rooms-content`),a=r.querySelector(`#room-search`),o=()=>ns(r),s=()=>{let e=Ur(),n=new Map(e.map(e=>[String(e.id),e])),r=$o.trim().toLowerCase(),a=t.filter(e=>Zo===`all`||e.lantai===Zo).filter(e=>Qo===`all`||e.status===Qo).filter(e=>{if(!r)return!0;let t=e.tenantId?n.get(String(e.tenantId)):null;return[e.nomor,e.lantai,e.booking?.name||``,t?.name||``].join(` `).toLowerCase().includes(r)}).sort((e,t)=>e.nomor.localeCompare(t.nomor,void 0,{numeric:!0}));i.innerHTML=es===`grid`?ss(a,n):cs(a,n)};o(),s(),r.querySelectorAll(`[data-floor]`).forEach(e=>{e.addEventListener(`click`,()=>{Zo=e.dataset.floor,o(),s()})}),r.querySelectorAll(`[data-status]`).forEach(e=>{e.addEventListener(`click`,()=>{Qo=e.dataset.status,o(),s()})}),r.querySelectorAll(`[data-viewmode]`).forEach(e=>{e.addEventListener(`click`,()=>{es=e.dataset.viewmode,xe.setRaw(`casa-ramire:room-view`,es),o(),s()})}),a?.addEventListener(`input`,()=>{$o=a.value,s()}),F(r,`click`,`[data-action]`,async(e,n)=>{let r=n.dataset.action,i=Number(n.dataset.id),a=t.find(e=>e.id===i);if(r===`add-room`)us();else if(a){if(r===`photo`&&ds(a.id),r===`booking`&&ua(a.id,`booking`),r===`checkin`&&(a.status===`booking`?da(a.id):ua(a.id,`checkin`)),r===`edit-booking`&&ua(a.id,`edit_booking`),r===`detail`&&a.tenantId&&Na(a.tenantId),r===`extend`&&a.tenantId&&ma(a.tenantId),r===`checkout`&&a.tenantId&&fa(a.tenantId),r===`cancel-booking`){if(!await H({title:`Batalkan booking?`,message:`Booking kamar <b>${P(a.nomor)}</b>${a.booking?` oleh <b>${P(a.booking.name)}</b>`:``} akan dibatalkan dan kamar kembali kosong.`,confirmText:`Ya, batalkan`,danger:!0}))return;try{ni(a.id),L(`Booking berhasil dibatalkan.`)}catch(e){L(e.message,`error`)}}if(r===`delete-room`){if(!await H({title:`Hapus kamar?`,message:`Kamar <b>${P(a.nomor)}</b> akan dihapus dari inventaris.`,confirmText:`Ya, hapus`,danger:!0}))return;try{Jr(a.id),L(`Kamar berhasil dihapus.`)}catch(e){L(e.message,`error`)}}}})}function us(){V({title:`Tambah Kamar Baru`,subtitle:`Kamar akan langsung tersedia di inventaris.`,size:`sm`,body:`
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
      <button type="submit" form="room-form" class="btn-primary btn-sm" data-submit>${N(`Plus`,`w-4 h-4`)} Simpan kamar</button>
    `,onMount(e,t){e.querySelector(`#room-form`).addEventListener(`submit`,n=>{n.preventDefault();try{Gr({nomor:e.querySelector(`#nr-number`).value,lantai:e.querySelector(`#nr-floor`).value}),L(`Kamar baru berhasil ditambahkan.`),t()}catch(e){L(e.message,`error`)}})}})}function ds(e){let t=Hr().find(t=>String(t.id)===String(e));if(!t)return;let n=t.photo||t.photoUrl||``,r=null;V({title:`Foto Kamar ${t.nomor}`,subtitle:`Foto ini tampil di landing page / katalog publik.`,size:`md`,body:`
      <div class="space-y-4">
        <div class="rounded-2xl border border-line bg-cream/60 p-3">
          <div id="rp-preview-wrap" class="aspect-[4/3] rounded-xl overflow-hidden bg-white border border-line flex items-center justify-center">
            ${n?`<img id="rp-preview" src="${P(n)}" alt="Foto kamar ${P(t.nomor)}" class="w-full h-full object-cover" />`:`<div id="rp-preview" class="flex flex-col items-center justify-center gap-2 text-stone-400">
                    ${N(`Image`,`w-10 h-10`)}
                    <span class="text-xs font-bold">Belum ada foto</span>
                  </div>`}
          </div>
        </div>

        <div>
          <label class="label" for="rp-file">Pilih foto kamar</label>
          <input id="rp-file" type="file" accept="image/jpeg,image/png,image/webp" class="input file:mr-3 file:rounded-lg file:border-0 file:bg-brand file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-gold" />
          <p class="hint mt-1.5">JPG/PNG/WebP. Foto otomatis dikompres agar ringan dan cepat dibuka.</p>
        </div>

        <div class="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-[11px] text-amber-800 leading-relaxed">
          Setelah foto diunggah, buka <b>Pengaturan ? Landing page &amp; katalog</b> lalu klik <b>Publikasikan katalog</b> agar foto terlihat oleh pengunjung casaramire.com.
        </div>
      </div>
    `,footer:`
      ${n?`<button type="button" class="btn-ghost btn-sm text-rose-600" data-remove-photo>${N(`Trash2`,`w-4 h-4`)} Hapus foto</button>`:``}
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      <button type="button" class="btn-primary btn-sm" data-save-photo>${N(`Check`,`w-4 h-4`)} Simpan foto</button>
    `,onMount(e,n){let i=e.querySelector(`#rp-file`),a=e.querySelector(`#rp-preview-wrap`),o=e.querySelector(`[data-save-photo]`),s=e=>{e?a.innerHTML=`<img src="${P(e)}" alt="Pratinjau foto kamar ${P(t.nomor)}" class="w-full h-full object-cover" />`:a.innerHTML=`<div class="flex flex-col items-center justify-center gap-2 text-stone-400">
            ${N(`Image`,`w-10 h-10`)}
            <span class="text-xs font-bold">Belum ada foto</span>
          </div>`};i?.addEventListener(`change`,async()=>{let e=i.files?.[0];if(e){I(o,!0,`Mengompres foto…`);try{r=await ct(e),s(r),L(`Foto siap disimpan.`)}catch(e){L(e.message,`error`)}finally{I(o,!1)}}}),e.querySelector(`[data-remove-photo]`)?.addEventListener(`click`,()=>{r=``,s(``),L(`Foto akan dihapus saat disimpan.`,`warning`)}),o?.addEventListener(`click`,()=>{if(r===null)n();else try{qr(t.id,r),L(r?`Foto kamar berhasil disimpan.`:`Foto kamar dihapus.`),n()}catch(e){L(e.message,`error`)}})}})}function fs(){return[...w().gallery||[]]}function ps(e){return(w().gallery||[]).find(t=>String(t.id)===String(e))||null}function ms(e){return String(e?.photo||e?.photoUrl||``).trim()}function hs(e){let t=String(e||``).trim();if(!t)return``;let n=/^data:image\/(jpeg|png|webp);base64,/i.test(t),r=/^https?:\/\//i.test(t),i=t.startsWith(`/api/catalog/photo`);if(!n&&!r&&!i)throw Error(`Format foto tidak didukung.`);return t}function gs(e,t){if(JSON.stringify(w()).length-e+t>46e5)throw Error(`Penyimpanan foto hampir penuh. Hapus beberapa foto galeri atau gunakan foto yang lebih kecil.`)}function _s({photo:e,caption:t=``}={}){let n=hs(e);if(!n)throw Error(`Pilih foto terlebih dahulu.`);gs(0,n.length);let r=null;return T(e=>{e.gallery=Array.isArray(e.gallery)?e.gallery:[],r={id:E(e.gallery),caption:String(t||``).trim(),photo:n,photoUrl:``,createdAt:new Date().toISOString()},e.gallery.push(r)}),r}function vs(e,t={}){let n=ps(e);if(!n)throw Error(`Foto galeri tidak ditemukan.`);let r=ms(n),i=t.photo===void 0?r:hs(t.photo);return gs(r.length,i.length),T(n=>{let a=(n.gallery||[]).find(t=>String(t.id)===String(e));a&&(t.caption!==void 0&&(a.caption=String(t.caption).trim()),t.photo!==void 0&&(a.photo=i,i!==r&&(a.photoUrl=``)),a.updatedAt=new Date().toISOString())}),ps(e)}function ys(e){T(t=>{t.gallery=(t.gallery||[]).filter(t=>String(t.id)!==String(e))})}function bs(e,t){T(n=>{let r=n.gallery||[],i=r.findIndex(t=>String(t.id)===String(e)),a=i+Number(t||0);if(i<0||a<0||a>=r.length)return;let[o]=r.splice(i,1);r.splice(a,0,o)})}var xs=n({render:()=>Cs});function Ss(e,t,n){let r=ms(e),i=!!e.photoUrl;return`
    <article class="card rounded-2xl overflow-hidden flex flex-col">
      <div class="relative aspect-[4/3] bg-brand-50">
        ${r?`<img src="${P(r)}" alt="${P(e.caption||`Foto galeri ${t+1}`)}" loading="lazy" class="w-full h-full object-cover" />`:`<div class="w-full h-full flex flex-col items-center justify-center gap-1 text-stone-400">
                ${N(`Image`,`w-8 h-8`)}
                <span class="text-[10px] font-bold uppercase tracking-wider">Belum ada foto</span>
              </div>`}
        <span class="absolute left-2 top-2 ${i?`badge-green`:`badge-amber`} shadow-sm">
          ${i?`Terbit`:`Belum terbit`}
        </span>
        <div class="absolute right-2 top-2 flex flex-col gap-1">
          <button type="button" class="p-1.5 rounded-lg bg-white/90 text-stone-600 hover:text-brand" data-action="move" data-id="${e.id}" data-dir="-1" title="Naikkan" ${t===0?`disabled`:``}>${N(`ChevronUp`,`w-3.5 h-3.5`)}</button>
          <button type="button" class="p-1.5 rounded-lg bg-white/90 text-stone-600 hover:text-brand" data-action="move" data-id="${e.id}" data-dir="1" title="Turunkan" ${t===n-1?`disabled`:``}>${N(`ChevronDown`,`w-3.5 h-3.5`)}</button>
        </div>
      </div>
      <div class="p-4 flex flex-col flex-1">
        <p class="text-sm font-bold text-stone-800">${P(e.caption||`Foto ${t+1}`)}</p>
        <p class="text-[10px] text-stone-500 mt-0.5">${i?`Sudah tampil di landing page`:`Klik Publikasikan agar tampil`}</p>
        <div class="mt-auto pt-3 flex flex-wrap justify-end gap-1">
          <button type="button" class="btn-outline btn-xs" data-action="edit" data-id="${e.id}">${N(`Pencil`,`w-3 h-3`)} Edit</button>
          <button type="button" class="btn-ghost btn-xs text-rose-600" data-action="delete" data-id="${e.id}">${N(`Trash2`,`w-3.5 h-3.5`)} Hapus</button>
        </div>
      </div>
    </article>
  `}function Cs(e){let t=fs(),n=R(),r=t.filter(e=>e.photoUrl).length;e.innerHTML=`
    <div data-view="gallery" class="animate-in">
      ${K({eyebrow:`Landing Content`,title:`Galeri Landing Page 🖼️`,subtitle:`Foto suasana kamar dan properti yang tampil di landing page. Tidak ada lagi katalog per kamar.`,actions:`
          <button type="button" class="btn-outline btn-sm" data-action="publish">${N(`UploadCloud`,`w-4 h-4`)} Publikasikan</button>
          <button type="button" class="btn-primary btn-sm" data-action="add">${N(`Plus`,`w-4 h-4`)} Tambah Foto</button>
        `})}

      <div class="grid sm:grid-cols-3 gap-3 mb-5">
        <div class="card p-4">
          <p class="text-[10px] font-extrabold uppercase tracking-wider text-stone-500">Total Foto</p>
          <p class="text-2xl font-black text-stone-800 mt-1">${t.length}</p>
        </div>
        <div class="card p-4">
          <p class="text-[10px] font-extrabold uppercase tracking-wider text-stone-500">Sudah Terbit</p>
          <p class="text-2xl font-black text-emerald-700 mt-1">${r}</p>
        </div>
        <div class="card p-4">
          <p class="text-[10px] font-extrabold uppercase tracking-wider text-stone-500">Menunggu Publikasi</p>
          <p class="text-2xl font-black ${t.length-r>0?`text-amber-700`:`text-stone-800`} mt-1">${t.length-r}</p>
        </div>
      </div>

      <div class="rounded-2xl border border-line bg-white p-4 mb-5 text-xs text-stone-600 leading-relaxed">
        <b class="text-stone-800">Cara kerja:</b> unggah foto di sini, atur urutannya, lalu klik
        <b>Publikasikan</b>. Foto pertama menjadi gambar utama di bagian hero landing page.
        ${n.catalogAdminKey?``:`<span class="block mt-1 text-rose-700 font-semibold">Kunci admin belum diisi — buka Pengaturan untuk mengisi kunci publikasi.</span>`}
      </div>

      ${t.length?`<div class="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">${t.map((e,n)=>Ss(e,n,t.length)).join(``)}</div>`:`<div class="card">${Ii({iconName:`Image`,title:`Galeri masih kosong`,description:`Tambahkan foto kamar, area bersama, atau fasad properti. Foto akan tampil di landing page setelah dipublikasikan.`,action:`<button type="button" class="btn-primary btn-sm" data-action="add">${N(`Plus`,`w-4 h-4`)} Tambah Foto</button>`})}</div>`}

      <div class="card p-5 mt-5">
        <p class="text-[11px] font-extrabold uppercase tracking-wider text-stone-500">Ringkasan publikasi</p>
        <p class="text-sm text-stone-600 mt-1">
          Terakhir dipublikasikan:
          <b>${n.catalogPublishedAt?new Date(n.catalogPublishedAt).toLocaleString(`id-ID`):`belum pernah`}</b>.
          Harga sewa tetap diatur di menu Pricelist. Deposit saat ini ${O(n.depositDefault||0)}.
        </p>
      </div>
    </div>
  `,F(e.querySelector(`[data-view="gallery"]`),`click`,`[data-action]`,async(e,t)=>{let n=t.dataset.action,r=Number(t.dataset.id);if(n===`add`)ws();else if(n===`move`)bs(r,Number(t.dataset.dir));else if(n===`edit`)Ts(r);else if(n===`delete`){if(!await H({title:`Hapus foto galeri?`,message:`Foto ini akan dihapus dari galeri landing page setelah dipublikasikan ulang.`,confirmText:`Ya, hapus`,danger:!0}))return;ys(r),L(`Foto galeri dihapus.`)}else if(n===`publish`){let e=R();if(!e.catalogAdminKey){L(`Isi kunci admin di Pengaturan terlebih dahulu.`,`error`);return}I(t,!0,`Mempublikasikan…`);try{let n=await Dn({adminKey:e.catalogAdminKey,onProgress:({label:e})=>{e&&(t.textContent=e)}});L(`Galeri berhasil dipublikasikan${n.uploadedPhotos?` (${n.uploadedPhotos} foto diunggah)`:``}.`)}catch(e){L(e.message,`error`)}finally{I(t,!1)}}})}function ws(){let e=[],t=!1;V({title:`Tambah Foto Galeri`,subtitle:`Bisa pilih beberapa foto sekaligus. Foto otomatis dikompres.`,size:`md`,body:`
      <div class="space-y-4">
        <div>
          <label class="label" for="gal-files">Pilih foto</label>
          <input id="gal-files" type="file" accept="image/jpeg,image/png,image/webp" multiple class="input file:mr-3 file:rounded-lg file:border-0 file:bg-brand file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-gold" />
          <p class="hint mt-1.5">JPG/PNG/WebP. Maksimal 12 MB per file.</p>
        </div>
        <div id="gal-preview" class="grid grid-cols-3 gap-2"></div>
        <div>
          <label class="label" for="gal-caption">Keterangan (opsional)</label>
          <input id="gal-caption" type="text" class="input" placeholder="cth: Kamar Deluxe lantai 2" />
        </div>
      </div>
    `,footer:`
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      <button type="button" class="btn-primary btn-sm" data-save>${N(`Upload`,`w-4 h-4`)} Simpan foto</button>
    `,onMount(n,r){let i=n.querySelector(`#gal-files`),a=n.querySelector(`#gal-preview`),o=n.querySelector(`[data-save]`);i?.addEventListener(`change`,async()=>{let n=[...i.files||[]];if(n.length){t=!0,I(o,!0,`Mengompres foto…`);try{e=[];for(let t of n)e.push(await ct(t,{maxDimension:1200,quality:.66}));a.innerHTML=e.map((e,t)=>`<div class="aspect-square rounded-xl overflow-hidden bg-stone-100 border border-line">
                  <img src="${P(e)}" alt="Pratinjau ${t+1}" class="w-full h-full object-cover" />
                </div>`).join(``),L(`${e.length} foto siap disimpan.`)}catch(t){e=[],a.innerHTML=``,L(t.message,`error`)}finally{t=!1,I(o,!1)}}}),o?.addEventListener(`click`,()=>{if(t)return;if(!e.length){L(`Pilih foto terlebih dahulu.`,`warning`);return}let i=n.querySelector(`#gal-caption`).value;try{e.forEach((e,t)=>{_s({photo:e,caption:t===0?i:``})}),L(`${e.length} foto ditambahkan. Klik Publikasikan agar tampil di landing page.`),r()}catch(e){L(e.message,`error`)}})}})}function Ts(e){let t=ps(e);if(!t)return;let n=null;V({title:`Edit Foto Galeri`,size:`md`,body:`
      <div class="space-y-4">
        <div id="gal-edit-preview" class="aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 border border-line">
          ${ms(t)?`<img src="${P(ms(t))}" alt="Foto galeri" class="w-full h-full object-cover" />`:``}
        </div>
        <div>
          <label class="label" for="gal-edit-file">Ganti foto (opsional)</label>
          <input id="gal-edit-file" type="file" accept="image/jpeg,image/png,image/webp" class="input file:mr-3 file:rounded-lg file:border-0 file:bg-brand file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-gold" />
        </div>
        <div>
          <label class="label" for="gal-edit-caption">Keterangan</label>
          <input id="gal-edit-caption" type="text" class="input" value="${P(t.caption||``)}" />
        </div>
      </div>
    `,footer:`
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      <button type="button" class="btn-primary btn-sm" data-save>${N(`Check`,`w-4 h-4`)} Simpan</button>
    `,onMount(t,r){t.querySelector(`#gal-edit-file`)?.addEventListener(`change`,async e=>{let r=e.target.files?.[0];if(r)try{n=await ct(r,{maxDimension:1200,quality:.66}),t.querySelector(`#gal-edit-preview`).innerHTML=`<img src="${P(n)}" alt="Pratinjau foto baru" class="w-full h-full object-cover" />`,L(`Foto baru siap disimpan.`)}catch(e){L(e.message,`error`)}}),t.querySelector(`[data-save]`)?.addEventListener(`click`,()=>{try{vs(e,{caption:t.querySelector(`#gal-edit-caption`).value,...n?{photo:n}:{}}),L(`Foto galeri diperbarui. Publikasikan ulang agar perubahan tampil.`),r()}catch(e){L(e.message,`error`)}})}})}var Es=n({render:()=>ks});function Ds(e,t){return`
    <div class="card p-5 rounded-2xl">
      <div class="flex items-start justify-between gap-3 border-b border-line pb-3 mb-4">
        <div>
          <h2 class="font-black text-lg text-stone-800">Pricelist Lantai ${e}</h2>
          <p class="text-xs text-stone-500">Kamar Deluxe ${e===`2`?`201 – 221`:`301 – 321`}</p>
        </div>
        <button type="button" class="btn-primary btn-sm" data-save-floor="${e}">${N(`Check`,`w-4 h-4`)} Simpan</button>
      </div>
      <div class="grid grid-cols-2 gap-3">
        ${l.map(n=>`
          <div>
            <label class="label" for="rate-${e}-${n.key}">${n.label}</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-stone-600">Rp</span>
              <input
                id="rate-${e}-${n.key}"
                type="number"
                min="0"
                step="10000"
                class="input input-sm pl-9 font-bold"
                data-rate-floor="${e}"
                data-rate-period="${n.key}"
                value="${D(t[n.key])||``}"
              />
            </div>
          </div>`).join(``)}
      </div>
      <p class="hint mt-3">Tarif paket bulanan adalah total untuk seluruh periode, bukan per bulan.</p>
    </div>
  `}function Os(e){return e.type===`persen`?`<span class="badge-blue">Persen</span>`:`<span class="badge-gold">Rupiah</span>`}function ks(e){let t=dn(),n=nn(`2`),r=nn(`3`);e.innerHTML=`
    <div data-view="pricing" class="animate-in">
      ${K({eyebrow:`Pricing Strategy`,title:`Pricelist & Diskon Promo 🏷️`,subtitle:`Atur tarif harian sampai tahunan dan program promo untuk menarik penghuni.`,actions:`<button type="button" class="btn-primary btn-sm" data-action="add-promo">${N(`Plus`,`w-4 h-4`)} Tambah Promo</button>`})}

      <div class="grid lg:grid-cols-2 gap-5 mb-6">
        ${Ds(`2`,n)}
        ${Ds(`3`,r)}
      </div>

      <div class="card overflow-hidden">
        <div class="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-line">
          <div>
            <h2 class="font-extrabold text-stone-800 text-sm">Daftar Promo</h2>
            <p class="text-xs text-stone-500 mt-0.5">Diskon rupiah dihitung per bulan kontrak. Kode promo dipakai calon penghuni saat booking di landing page.</p>
          </div>
          <span class="badge-gold">${t.filter(e=>e.active).length} aktif</span>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Nama Promo</th><th>Kode</th><th>Tipe</th><th>Nilai Diskon</th><th>Kuota</th><th>Status</th><th class="text-right">Aksi</th></tr></thead>
            <tbody>
              ${t.length?t.map(e=>`
                        <tr>
                          <td class="font-bold text-stone-800">${P(e.name)}</td>
                          <td><span class="font-mono text-[11px] font-extrabold text-brand bg-brand-50 border border-brand/20 rounded px-1.5 py-0.5">${P(e.code||`—`)}</span></td>
                          <td>${Os(e)}</td>
                          <td class="font-bold whitespace-nowrap">${e.type===`persen`?`${D(e.value)}%`:`${O(e.value)} / bulan`}</td>
                          <td class="whitespace-nowrap text-xs">
                            ${Number(e.maxUses)>0?`<b>${D(e.usedCount)}</b> / ${D(e.maxUses)}`:`<b>${D(e.usedCount)}</b> / ∞`}
                            <p class="text-[10px] text-stone-500">${Number(e.maxUses)===1?`sekali pakai`:`multi pakai`}</p>
                          </td>
                          <td>${e.active?`<span class="badge-green">Aktif</span>`:`<span class="badge-gray">Nonaktif</span>`}</td>
                          <td>
                            <div class="flex items-center justify-end gap-1">
                              <button type="button" class="btn-outline btn-xs" data-action="toggle-promo" data-id="${e.id}">${e.active?`Nonaktifkan`:`Aktifkan`}</button>
                              <button type="button" class="btn-ghost btn-xs" data-action="edit-promo" data-id="${e.id}" title="Edit promo">${N(`Pencil`,`w-3.5 h-3.5`)}</button>
                              <button type="button" class="btn-ghost btn-xs text-rose-600" data-action="delete-promo" data-id="${e.id}" title="Hapus promo">${N(`Trash2`,`w-3.5 h-3.5`)}</button>
                            </div>
                          </td>
                        </tr>`).join(``):Fi(7,`Belum ada promo. Tambahkan promo pertama Anda.`)}
            </tbody>
          </table>
        </div>
      </div>

      <div class="card p-5 mt-5">
        ${zi(`Catatan perhitungan`)}
        <p class="text-xs text-stone-500 leading-relaxed mt-1.5">
          Diskon rupiah diterapkan per bulan kontrak; diskon persen dihitung dari total sewa. Add-on selalu dihitung per bulan.
          Deposit tidak termasuk pendapatan sewa. Semua perhitungan ini otomatis dipakai pada form booking, check-in, dan perpanjangan.
        </p>
      </div>
    </div>
  `;let i=e.querySelector(`[data-view="pricing"]`);i.querySelectorAll(`[data-save-floor]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.saveFloor,n={};i.querySelectorAll(`[data-rate-floor="${t}"]`).forEach(e=>{n[e.dataset.ratePeriod]=e.value});try{xn(t,n),L(`Pricelist lantai ${t} berhasil disimpan.`)}catch(e){L(e.message,`error`)}})}),F(i,`click`,`[data-action]`,async(e,t)=>{let n=t.dataset.action,r=Number(t.dataset.id);if(n===`add-promo`)As();else if(n===`edit-promo`)As(r);else if(n===`toggle-promo`)bn(r),L(`Status promo diperbarui.`);else if(n===`delete-promo`){if(!await H({title:`Hapus promo?`,message:`Promo <b>${P(dn().find(e=>e.id===r)?.name||``)}</b> akan dihapus. Kontrak yang sudah berjalan tidak terpengaruh.`,confirmText:`Ya, hapus`,danger:!0}))return;yn(r),L(`Promo berhasil dihapus.`)}})}function As(e=null){let t=e?dn().find(t=>t.id===e):null;V({title:t?`Edit Promo`:`Tambah Promo Baru`,subtitle:`Promo dapat diaktifkan atau dinonaktifkan kapan saja.`,size:`sm`,body:`
      <form id="promo-form" class="space-y-4" novalidate>
        <div>
          <label class="label" for="pr-name">Nama promo</label>
          <input id="pr-name" type="text" class="input" placeholder="cth: Promo Mahasiswa" value="${P(t?.name||``)}" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="label" for="pr-code">Kode promo</label>
            <input id="pr-code" type="text" class="input font-mono uppercase" placeholder="cth: MAHASISWA5" maxlength="24" value="${P(t?.code||``)}" />
          </div>
          <div>
            <label class="label" for="pr-max">Kuota pemakaian</label>
            <input id="pr-max" type="number" min="0" step="1" class="input" placeholder="0 = tanpa batas" value="${t?D(t.maxUses):0}" />
          </div>
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
            <input id="pr-value" type="number" min="1" step="1" class="input" placeholder="cth: 200000" value="${t?D(t.value):``}" />
          </div>
        </div>
        <label class="flex items-center gap-2 cursor-pointer p-2.5 rounded-xl border border-line hover:bg-stone-50">
          <input id="pr-active" type="checkbox" class="w-4 h-4 accent-brand" ${t?t.active?`checked`:``:`checked`} />
          <span class="text-xs font-bold text-stone-700">Aktifkan promo ini</span>
        </label>
        <p class="hint">Kode promo hanya bisa dipakai calon penghuni saat booking dari landing page. Isi kuota <b>1</b> untuk sekali pakai, <b>0</b> untuk tanpa batas. Setelah promo diubah, klik <b>Publikasikan</b> di Pengaturan/Galeri agar kode terbaru aktif di landing page.</p>
      </form>
    `,footer:`
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      <button type="submit" form="promo-form" class="btn-primary btn-sm" data-submit>${N(`Check`,`w-4 h-4`)} Simpan promo</button>
    `,onMount(e,n){e.querySelector(`#promo-form`).addEventListener(`submit`,r=>{r.preventDefault();try{vn({id:t?.id||null,name:e.querySelector(`#pr-name`).value,code:e.querySelector(`#pr-code`).value,maxUses:D(e.querySelector(`#pr-max`).value),type:e.querySelector(`#pr-type`).value,value:D(e.querySelector(`#pr-value`).value),active:e.querySelector(`#pr-active`).checked}),L(t?`Promo berhasil diperbarui.`:`Promo baru berhasil ditambahkan.`),n()}catch(e){L(e.message,`error`)}})}})}var js=n({render:()=>Ms});function Ms(e){let t=Bi(),n=t.filter(e=>e.active),r=n.reduce((e,t)=>e+D(t.price),0);e.innerHTML=`
    <div data-view="addons" class="animate-in">
      ${K({eyebrow:`Services & Amenities`,title:`Master Layanan Add-On 🚗`,subtitle:`Atur layanan tambahan yang bisa dipasang ke kontrak penghuni.`,actions:`<button type="button" class="btn-primary btn-sm" data-action="add-addon">${N(`Plus`,`w-4 h-4`)} Tambah Add-On</button>`})}

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        ${q({label:`Total Layanan`,value:t.length,iconName:`Sparkles`})}
        ${q({label:`Layanan Aktif`,value:n.length,iconName:`BadgeCheck`,tone:`green`})}
        ${q({label:`Potensi / Bulan`,value:O(r),iconName:`Coins`,tone:`brand`,hint:`Jika semua add-on terpasang`})}
        ${q({label:`Rata-rata Tarif`,value:O(n.length?r/n.length:0),iconName:`Percent`,tone:`amber`})}
      </div>

      <div class="card overflow-hidden">
        <div class="px-5 py-4 border-b border-line">
          <h2 class="font-extrabold text-stone-800 text-sm">Daftar Layanan</h2>
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
                              <span class="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">${N(`Sparkles`,`w-4 h-4`)}</span>
                              <span class="font-bold text-stone-800">${P(e.name)}</span>
                            </div>
                          </td>
                          <td class="font-black text-stone-800 whitespace-nowrap">${O(e.price)}</td>
                          <td>${e.active?`<span class="badge-green">Aktif</span>`:`<span class="badge-gray">Nonaktif</span>`}</td>
                          <td>
                            <div class="flex items-center justify-end gap-1">
                              <button type="button" class="btn-outline btn-xs" data-action="toggle" data-id="${e.id}">${e.active?`Nonaktifkan`:`Aktifkan`}</button>
                              <button type="button" class="btn-ghost btn-xs" data-action="edit" data-id="${e.id}" title="Edit add-on">${N(`Pencil`,`w-3.5 h-3.5`)}</button>
                              <button type="button" class="btn-ghost btn-xs text-rose-600" data-action="delete" data-id="${e.id}" title="Hapus add-on">${N(`Trash2`,`w-3.5 h-3.5`)}</button>
                            </div>
                          </td>
                        </tr>`).join(``):Fi(4,`Belum ada layanan add-on. Tambahkan layanan pertama Anda.`)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,F(e.querySelector(`[data-view="addons"]`),`click`,`[data-action]`,async(e,n)=>{let r=n.dataset.action,i=Number(n.dataset.id);if(r===`add-addon`)Ns();else if(r===`edit`)Ns(i);else if(r===`toggle`)Hi(i),L(`Status layanan diperbarui.`);else if(r===`delete`){if(!await H({title:`Hapus layanan add-on?`,message:`Layanan <b>${P(t.find(e=>e.id===i)?.name||``)}</b> akan dihapus dari master. Kontrak yang sudah berjalan tetap menyimpan data add-on.`,confirmText:`Ya, hapus`,danger:!0}))return;Ui(i),L(`Layanan add-on berhasil dihapus.`)}})}function Ns(e=null){let t=e?Bi().find(t=>t.id===e):null;V({title:t?`Edit Add-On`:`Tambah Master Add-On`,size:`sm`,body:`
      <form id="addon-form" class="space-y-4" novalidate>
        <div>
          <label class="label" for="ad-name">Nama layanan</label>
          <input id="ad-name" type="text" class="input" placeholder="cth: Parkir Mobil" value="${P(t?.name||``)}" />
        </div>
        <div>
          <label class="label" for="ad-price">Tarif per bulan (Rp)</label>
          <input id="ad-price" type="number" min="0" step="1000" class="input" placeholder="cth: 100000" value="${t?D(t.price):``}" />
        </div>
        <label class="flex items-center gap-2 cursor-pointer p-2.5 rounded-xl border border-line hover:bg-stone-50">
          <input id="ad-active" type="checkbox" class="w-4 h-4 accent-brand" ${t?t.active?`checked`:``:`checked`} />
          <span class="text-xs font-bold text-stone-700">Layanan tersedia untuk dipilih</span>
        </label>
      </form>
    `,footer:`
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      <button type="submit" form="addon-form" class="btn-primary btn-sm" data-submit>${N(`Check`,`w-4 h-4`)} Simpan</button>
    `,onMount(e,n){e.querySelector(`#addon-form`).addEventListener(`submit`,r=>{r.preventDefault();try{Vi({id:t?.id||null,name:e.querySelector(`#ad-name`).value,price:D(e.querySelector(`#ad-price`).value),active:e.querySelector(`#ad-active`).checked}),L(t?`Add-on berhasil diperbarui.`:`Add-on baru berhasil ditambahkan.`),n()}catch(e){L(e.message,`error`)}})}})}var Ps=n({render:()=>Bs}),Fs=`aktif`,Is=``;function Ls(e){return e.status===`aktif`?`<span class="badge-green">Aktif</span>`:`<span class="badge-gray">Checkout</span>`}function Rs(e){if(e.status!==`aktif`)return e.checkoutDate?`<span class="badge-gray">Keluar ${j(e.checkoutDate)}</span>`:`<span class="badge-gray">—</span>`;let t=Ye(k(),e.endDate);return t<0?`<span class="badge-red">Lewat ${Math.abs(t)} hari</span>`:t===0?`<span class="badge-red">Berakhir hari ini</span>`:t<=7?`<span class="badge-amber">H-${t}</span>`:`<span class="badge-green">${t} hari lagi</span>`}function zs(e){let t=fi(e.id),n=Ai(`reminder`,{nama:e.name,kamar:e.roomNumber||`—`,nominal:O(e.monthlyCharge),jatuh_tempo:j(e.endDate)}),r=e.status===`aktif`;return`
    <tr>
      <td>
        <div class="flex items-center gap-2.5">
          ${Li(e.name,`w-9 h-9 text-[10px]`)}
          <div class="min-w-0">
            <div class="flex items-center gap-1.5 flex-wrap">
              <button type="button" class="font-bold text-stone-800 hover:text-brand hover:underline text-left" data-action="detail" data-id="${e.id}">${P(e.name)}</button>
              ${e.checkinDate?`<span class="badge-gold" title="Lama tinggal sejak ${j(e.checkinDate)}">${P(mi(e))}</span>`:``}
            </div>
            <p class="text-[10px] text-stone-600 truncate">${P(e.job||`—`)} · ${P(e.phone)}</p>
            ${e.email?`<p class="text-[10px] text-stone-500 truncate">${P(e.email)}</p>`:``}
          </div>
        </div>
      </td>
      <td>
        <p class="font-semibold text-stone-700 whitespace-nowrap">${r?`Kamar ${P(e.roomNumber||`—`)}`:`—`}</p>
        <div class="mt-0.5">${Ls(e)}</div>
      </td>
      <td class="whitespace-nowrap">
        <p class="text-xs text-stone-600">${j(e.startDate)} — ${j(e.endDate)}</p>
        <div class="mt-0.5">${Rs(e)}</div>
      </td>
      <td class="font-bold whitespace-nowrap">${O(e.contractTotal)}</td>
      <td class="font-bold whitespace-nowrap ${t>0?`text-rose-700`:`text-emerald-700`}">${t>0?O(t):`Lunas`}</td>
      <td>
        <div class="flex flex-wrap items-center justify-end gap-1">
          <button type="button" class="btn-outline btn-xs" data-action="detail" data-id="${e.id}">${N(`UserRound`,`w-3 h-3`)} Detail</button>
          ${r?`
                <button type="button" class="btn-outline btn-xs" data-action="extend" data-id="${e.id}" title="Perpanjang kontrak">${N(`Repeat`,`w-3 h-3`)}</button>
                <button type="button" class="btn-ghost btn-xs" data-action="move" data-id="${e.id}" title="Pindah kamar">${N(`ArrowRight`,`w-3.5 h-3.5`)}</button>
                <a href="${tt(e.phone,n)}" target="_blank" rel="noopener" class="btn-ghost btn-xs text-emerald-700" title="Kirim WhatsApp">${N(`MessageCircle`,`w-4 h-4`)}</a>
                <button type="button" class="btn-ghost btn-xs text-rose-600" data-action="checkout" data-id="${e.id}" title="Check-out">${N(`DoorOpen`,`w-3.5 h-3.5`)}</button>
              `:``}
        </div>
      </td>
    </tr>
  `}function Bs(e){let t=Ur(),n=t.filter(e=>e.status===`aktif`),r=t.filter(e=>e.status===`checkout`),i=n.reduce((e,t)=>e+fi(t.id),0),a=n.reduce((e,t)=>e+Number(t.contractTotal||0),0);e.innerHTML=`
    <div data-view="tenants" class="animate-in">
      ${K({eyebrow:`Directory & Contracts`,title:`Data Penghuni & Kontrak 👥`,subtitle:`Direktori penghuni, kontak darurat, riwayat kamar, dan siklus kontrak.`,actions:`<a href="#/rooms" class="btn-primary btn-sm">${N(`UserPlus`,`w-4 h-4`)} Check-in Penghuni</a>`})}

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        ${q({label:`Penghuni Aktif`,value:n.length,iconName:`Users`,tone:`green`,hint:`${r.length} sudah checkout`})}
        ${q({label:`Nilai Kontrak Aktif`,value:O(a),iconName:`Wallet`,tone:`brand`})}
        ${q({label:`Total Tunggakan`,value:O(i),iconName:`CircleAlert`,tone:i>0?`rose`:`green`})}
        ${q({label:`Total Penghuni`,value:t.length,iconName:`ClipboardList`,hint:`Termasuk riwayat`})}
      </div>

      <div class="card p-3 mb-5 flex flex-col sm:flex-row sm:items-center gap-3">
        <div class="flex flex-wrap gap-2">
          <button type="button" class="chip-active" data-filter="aktif">Aktif (${n.length})</button>
          <button type="button" class="chip-idle" data-filter="checkout">Checkout (${r.length})</button>
          <button type="button" class="chip-idle" data-filter="semua">Semua (${t.length})</button>
        </div>
        <div class="relative sm:ml-auto sm:w-64">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-stone-600">${N(`Search`,`w-3.5 h-3.5`)}</span>
          <input id="tenant-search" type="search" class="input input-sm pl-8" placeholder="Cari nama / kamar / HP…" value="${P(Is)}" />
        </div>
      </div>

      <div id="tenants-content"></div>
    </div>
  `;let o=e.querySelector(`[data-view="tenants"]`),s=o.querySelector(`#tenants-content`),c=o.querySelector(`#tenant-search`),l=()=>{o.querySelectorAll(`[data-filter]`).forEach(e=>{e.className=e.dataset.filter===Fs?`chip-active`:`chip-idle`})},u=()=>{let e=Is.trim().toLowerCase(),n=t.filter(e=>Fs===`semua`||e.status===Fs).filter(t=>!e||[t.name,t.roomNumber||``,t.phone||``,t.job||``].join(` `).toLowerCase().includes(e));n.length?s.innerHTML=`
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
            <tbody>${n.map(zs).join(``)}</tbody>
          </table>
        </div>
      </div>
    `:s.innerHTML=`<div class="card">${Ii({iconName:`Users`,title:`Tidak ada penghuni`,description:Fs===`aktif`?`Belum ada penghuni aktif. Lakukan check-in dari menu Status Kamar.`:`Tidak ada data yang cocok dengan filter atau pencarian.`,action:`<a href="#/rooms" class="btn-primary btn-sm">${N(`Building2`,`w-4 h-4`)} Buka Status Kamar</a>`})}</div>`};l(),u(),o.querySelectorAll(`[data-filter]`).forEach(e=>{e.addEventListener(`click`,()=>{Fs=e.dataset.filter,l(),u()})}),c?.addEventListener(`input`,()=>{Is=c.value,u()}),F(o,`click`,`[data-action]`,(e,t)=>{let n=t.dataset.action,r=Number(t.dataset.id);n===`detail`&&Na(r),n===`extend`&&ma(r),n===`move`&&pa(r),n===`checkout`&&fa(r)})}function Vs(){return[...w().expenses].sort((e,t)=>e.date===t.date?t.id-e.id:String(t.date).localeCompare(String(e.date)))}function Hs(){return[...w().expenseCategories]}function Us({date:e,category:t,description:n,amount:r}){let i=String(n||``).trim(),a=String(t||``).trim(),o=Math.round(D(r));if(!i)throw Error(`Deskripsi pengeluaran wajib diisi.`);if(!a)throw Error(`Kategori wajib dipilih.`);if(o<=0)throw Error(`Nominal pengeluaran harus lebih dari 0.`);let s;return T(t=>{s={id:E(t.expenses),date:e||k(),category:a,description:i,amount:o,createdAt:new Date().toISOString()},t.expenses.push(s)}),s}function Ws(e,t){let n=String(t.description||``).trim(),r=String(t.category||``).trim(),i=Math.round(D(t.amount));if(!n)throw Error(`Deskripsi pengeluaran wajib diisi.`);if(!r)throw Error(`Kategori wajib dipilih.`);if(i<=0)throw Error(`Nominal pengeluaran harus lebih dari 0.`);T(a=>{let o=a.expenses.find(t=>String(t.id)===String(e));if(!o)throw Error(`Pengeluaran tidak ditemukan.`);o.date=t.date||o.date,o.category=r,o.description=n,o.amount=i,o.updatedAt=new Date().toISOString()})}function Gs(e){T(t=>{t.expenses=t.expenses.filter(t=>String(t.id)!==String(e))})}function Ks(e){let t=String(e||``).trim();if(!t)throw Error(`Nama kategori wajib diisi.`);if(w().expenseCategories.some(e=>e.toLowerCase()===t.toLowerCase()))throw Error(`Kategori sudah ada.`);return T(e=>{e.expenseCategories.push(t)}),t}function qs(e){if(w().expenseCategories.length<=1)throw Error(`Minimal harus ada satu kategori.`);T(t=>{t.expenseCategories=t.expenseCategories.filter(t=>t!==e)})}function Js(e){if(!e)return 0;let t=new Date(e).getTime();return Number.isFinite(t)?t:0}function Ys(e){return String(e||``).slice(0,10)}function Xs(e=[]){return e.map(e=>`${e.name} ×${(Number(e.qty)||0).toLocaleString(`id-ID`,{maximumFractionDigits:2})}${e.unit?` ${e.unit}`:``}`).join(`, `)}function Zs({key:e,date:t,sortDate:n,category:r,description:i,reference:a=``,party:o=``,roomNumber:s=``,method:c=``,direction:l=`in`,amount:u=0,sourceType:d=``,sourceId:f=null,isDeposit:p=!1}){return{key:e,date:Ys(t)||k(),sortDate:n||t||``,timestamp:Js(n||t),category:r,description:i,reference:a,party:o,roomNumber:s,method:c,direction:l,amount:Math.max(0,Math.round(D(u))),sourceType:d,sourceId:f,isDeposit:p}}function Qs(){let e=w(),t=[];for(let e of na())t.push(Zs({key:`deposit-${e.account.kind}-${e.account.id}-${e.id}`,date:e.date,sortDate:e.createdAt||e.date,category:e.direction===`out`?`Refund Deposit`:`Deposit / Jaminan`,description:e.direction===`out`?`Pengembalian deposit ${e.account.name}`:`Deposit ${e.account.name}`,reference:e.note||e.kind||``,party:e.account.name,roomNumber:e.account.roomNumber,method:e.method,direction:e.direction,amount:e.amount,sourceType:e.account.kind,sourceId:e.account.id,isDeposit:!0}));for(let n of e.bills||[])n.status!==`paid`||D(n.paid)<=0||t.push(Zs({key:`bill-${n.id}`,date:n.paidAt||n.dueDate,sortDate:n.paidAt||n.dueDate,category:n.type===`Sewa`?`Sewa Kamar`:`Tagihan Tambahan`,description:n.description||n.type||`Tagihan`,reference:n.number||``,party:n.tenantName||``,roomNumber:n.roomNumber||``,method:n.method||``,direction:`in`,amount:n.paid,sourceType:`bill`,sourceId:n.id}));for(let n of e.manualInvoices||[])n.source!==`pos`&&(n.status!==`paid`||D(n.paid)<=0||t.push(Zs({key:`invoice-${n.id}`,date:n.paidAt||n.dueDate,sortDate:n.paidAt||n.dueDate,category:`Invoice Layanan`,description:n.item||`Invoice layanan`,reference:n.number||``,party:n.tenantName||``,roomNumber:n.roomNumber||``,method:n.method||``,direction:`in`,amount:n.paid,sourceType:`invoice`,sourceId:n.id})));for(let n of e.posSales||[])n.status!==`paid`||D(n.total)<=0||t.push(Zs({key:`pos-${n.id}`,date:n.paidAt||n.date,sortDate:n.paidAt||n.date,category:`POS / Layanan`,description:Xs(n.items)||`Penjualan POS`,reference:n.number||``,party:n.customerName||``,roomNumber:n.roomNumber||``,method:n.method||``,direction:`in`,amount:n.total,sourceType:`pos`,sourceId:n.id}));for(let n of e.expenses||[])D(n.amount)<=0||t.push(Zs({key:`expense-${n.id}`,date:n.date,sortDate:n.createdAt||n.date,category:`Pengeluaran`,description:n.description||n.category||`Pengeluaran`,reference:n.category||``,method:`Kas`,direction:`out`,amount:n.amount,sourceType:`expense`,sourceId:n.id}));t.sort((e,t)=>e.timestamp-t.timestamp||e.key.localeCompare(t.key));let n=0;for(let e of t)n+=e.direction===`in`?e.amount:-e.amount,e.balanceAfter=n;return t}function $s(){return[...new Set(Qs().map(e=>e.category))].sort((e,t)=>e.localeCompare(t,`id`))}function ec({category:e=``,search:t=``,limit:n=300}={}){let r=String(t||``).trim().toLowerCase();return Qs().filter(t=>!e||t.category===e).filter(e=>!r||[e.description,e.category,e.reference,e.party,e.roomNumber,e.method].join(` `).toLowerCase().includes(r)).sort((e,t)=>t.timestamp-e.timestamp||t.key.localeCompare(e.key)).slice(0,Math.max(1,Number(n)||300))}function tc(){let e=Qs(),t=e.filter(e=>e.direction===`in`).reduce((e,t)=>e+t.amount,0),n=e.filter(e=>e.direction===`out`).reduce((e,t)=>e+t.amount,0),r=e.filter(e=>e.isDeposit&&e.direction===`in`).reduce((e,t)=>e+t.amount,0),i=e.filter(e=>e.isDeposit&&e.direction===`out`).reduce((e,t)=>e+t.amount,0),a=Qi();return{totalIn:t,totalOut:n,balance:t-n,depositIn:r,depositOut:i,depositHeld:a.held,depositOutstanding:a.outstanding,operatingIn:t-r,count:e.length}}var nc=n({render:()=>hc}),rc=`ledger`,ic=``,ac=``;function oc(e){return String(e?.email||w().tenants.find(t=>String(t.id)===String(e?.tenantId))?.email||``).trim()}var sc=[{id:`expenses`,label:`Jurnal Pengeluaran`,iconName:`ScrollText`},{id:`ledger`,label:`Buku Kas`,iconName:`Wallet`},{id:`deposits`,label:`Deposit & Jaminan`,iconName:`Landmark`},{id:`invoices`,label:`Invoice Manual`,iconName:`FileText`},{id:`accrual`,label:`Pendapatan Accrual`,iconName:`TrendingUp`},{id:`pnl`,label:`Laba Rugi`,iconName:`PieChart`}];function cc(){let e=Vs(),t=Hs(),n=e.filter(e=>$e(e.date)).reduce((e,t)=>e+D(t.amount),0),r=e.reduce((e,t)=>e+D(t.amount),0);return`
    <div class="space-y-5">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        ${q({label:`Pengeluaran Bulan Ini`,value:O(n),iconName:`TrendingDown`,tone:`rose`})}
        ${q({label:`Total Pengeluaran`,value:O(r),iconName:`Coins`})}
        ${q({label:`Jumlah Transaksi`,value:e.length,iconName:`Receipt`})}
        ${q({label:`Kategori Aktif`,value:t.length,iconName:`Tags`,tone:`amber`})}
      </div>

      <div class="card overflow-hidden">
        ${J({title:`Catatan Pengeluaran`,description:`Jurnal biaya operasional bulanan dan harian.`,actions:`
            <button type="button" class="btn-outline btn-xs" data-action="manage-categories">${N(`Tags`,`w-3.5 h-3.5`)} Kelola kategori</button>
            <button type="button" class="btn-primary btn-xs" data-action="add-expense">${N(`Plus`,`w-3.5 h-3.5`)} Catat pengeluaran</button>
          `})}
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Tanggal</th><th>Kategori</th><th>Uraian</th><th>Nominal</th><th class="text-right">Aksi</th></tr></thead>
            <tbody>
              ${e.length?e.map(e=>`
                        <tr>
                          <td class="whitespace-nowrap">${j(e.date)}</td>
                          <td><span class="badge-gray">${P(e.category)}</span></td>
                          <td class="font-semibold text-stone-700">${P(e.description)}</td>
                          <td class="font-black text-rose-700 whitespace-nowrap">${O(e.amount)}</td>
                          <td>
                            <div class="flex items-center justify-end gap-1">
                              <button type="button" class="btn-ghost btn-xs" data-action="edit-expense" data-id="${e.id}" title="Edit">${N(`Pencil`,`w-3.5 h-3.5`)}</button>
                              <button type="button" class="btn-ghost btn-xs text-rose-600" data-action="delete-expense" data-id="${e.id}" title="Hapus">${N(`Trash2`,`w-3.5 h-3.5`)}</button>
                            </div>
                          </td>
                        </tr>`).join(``):Fi(5,`Belum ada pengeluaran tercatat.`)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `}function lc(){let e=z(),t=Dr(),n=t.filter(e=>e.status===`unpaid`),r=t.filter(e=>e.status===`paid`&&$e(e.paidAt)),i=n.reduce((e,t)=>e+D(t.amount),0),a=r.reduce((e,t)=>e+D(t.paid),0);return`
    <div class="space-y-5">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        ${q({label:`Total Invoice`,value:t.length,iconName:`FileText`})}
        ${q({label:`Belum Dibayar`,value:O(i),iconName:`CircleAlert`,tone:n.length?`rose`:`green`,hint:`${n.length} invoice`})}
        ${q({label:`Lunas Bulan Ini`,value:O(a),iconName:`CheckCircle2`,tone:`green`,hint:`${r.length} invoice`})}
        ${q({label:`Nilai Layanan`,value:O(t.reduce((e,t)=>e+D(t.amount),0)),iconName:`HandCoins`})}
      </div>

      <div class="card overflow-hidden">
        ${J({title:`Invoice Layanan & Non-Sewa`,description:`Laundry, perbaikan, fasilitas, dan tagihan lain di luar sewa.`,actions:`<button type="button" class="btn-primary btn-xs" data-action="add-invoice">${N(`FilePlus2`,`w-3.5 h-3.5`)} Buat invoice</button>`})}
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>No. Invoice</th><th>Kamar / Tenant</th><th>Item Layanan</th><th>Nominal</th><th>Status</th><th class="text-right">Aksi</th></tr></thead>
            <tbody>
              ${t.length?t.map(t=>{let n=oc(t),r=Ai(`manual`,{nama:t.tenantName,kamar:t.roomNumber,nominal:O(t.amount),no_invoice:t.number,item_layanan:t.item,jatuh_tempo:j(t.dueDate)});return`
                          <tr>
                            <td class="font-mono text-[11px] font-bold text-stone-700 whitespace-nowrap">${P(t.number)}</td>
                            <td>
                              <p class="font-bold text-stone-800">${P(t.tenantName||`—`)}</p>
                              <p class="text-[10px] text-stone-600">Kamar ${P(t.roomNumber||`—`)}${n?` · ${P(n)}`:``}</p>
                            </td>
                            <td>
                              <p class="font-semibold text-stone-700">${P(t.item)}</p>
                              <p class="text-[10px] text-stone-500">${j(t.dueDate)}</p>
                            </td>
                            <td class="font-black text-stone-800 whitespace-nowrap">${O(t.amount)}</td>
                            <td>${Ni(t.status)}</td>
                            <td>
                              <div class="flex flex-wrap items-center justify-end gap-1">
                                ${t.status===`unpaid`?`${e?`<button type="button" class="btn-outline btn-xs" data-action="doku-invoice-link" data-id="${t.id}">${N(`CreditCard`,`w-3 h-3`)} Link DOKU</button>`:``}
                                       <button type="button" class="btn-outline btn-xs" data-action="email-invoice" data-id="${t.id}" ${n?``:`disabled title="Email belum diisi"`}>${N(`Send`,`w-3 h-3`)} Kirim Tagihan</button>
                                       <button type="button" class="btn-primary btn-xs" data-action="verify-invoice" data-id="${t.id}">${N(`ShieldCheck`,`w-3 h-3`)} Verifikasi</button>`:`<button type="button" class="btn-outline btn-xs" data-action="unverify-invoice" data-id="${t.id}">Batalkan</button>`}
                                ${t.phone?`<a href="${tt(t.phone,r)}" target="_blank" rel="noopener" class="btn-ghost btn-xs text-emerald-700" title="Kirim invoice via WhatsApp">${N(`MessageCircle`,`w-4 h-4`)}</a>`:``}
                                <button type="button" class="btn-ghost btn-xs text-rose-600" data-action="delete-invoice" data-id="${t.id}" title="Hapus invoice">${N(`Trash2`,`w-3.5 h-3.5`)}</button>
                              </div>
                            </td>
                          </tr>`}).join(``):Fi(6,`Belum ada invoice layanan. Buat invoice pertama Anda.`)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `}function uc(){let e=Ti();return`
    <div class="space-y-5">
      <div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-900 leading-relaxed">
        <p class="font-extrabold mb-1">Prinsip pengakuan pendapatan</p>
        Sewa dasar dan add-on diakui penuh sebagai pendapatan bulan berjalan. Pembayaran di atas nilai bulanan dicatat sebagai pendapatan dimuka.
        Deposit tidak diakui sebagai pendapatan karena merupakan kewajiban yang dapat dikembalikan.
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        ${q({label:`Diakui Bulan Ini`,value:O(e.totalRecognized),iconName:`TrendingUp`,tone:`green`})}
        ${q({label:`Pendapatan Dimuka`,value:O(e.totalDeferred),iconName:`CalendarClock`,tone:`amber`})}
        ${q({label:`Total Kas Masuk`,value:O(e.totalPaid),iconName:`Banknote`,tone:`brand`})}
        ${q({label:`Belum Tertagih`,value:O(e.totalOutstanding),iconName:`CircleAlert`,tone:e.totalOutstanding?`rose`:`green`})}
      </div>

      <div class="card overflow-hidden">
        ${J({title:`Rincian Pendapatan per Penghuni`,description:`Nilai kontrak bulanan, kas masuk, dan pendapatan dimuka.`})}
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Penghuni / Kamar</th><th>Total Kas Masuk</th><th>Sewa + Add-On</th><th>Diakui Bulan Ini</th><th>Dimuka</th><th>Belum Tertagih</th></tr></thead>
            <tbody>
              ${e.rows.length?e.rows.map(e=>`
                        <tr>
                          <td>
                            <p class="font-bold text-stone-800">${P(e.name)}</p>
                            <p class="text-[10px] text-stone-600">Kamar ${P(e.roomNumber)}</p>
                          </td>
                          <td class="font-bold whitespace-nowrap">${O(e.paid)}</td>
                          <td class="whitespace-nowrap">${O(e.monthlyCharge)}</td>
                          <td class="font-black text-emerald-700 whitespace-nowrap">${O(e.recognized)}</td>
                          <td class="font-bold text-amber-700 whitespace-nowrap">${O(e.deferred)}</td>
                          <td class="font-bold whitespace-nowrap ${e.outstanding>0?`text-rose-700`:`text-stone-600`}">${e.outstanding>0?O(e.outstanding):`—`}</td>
                        </tr>`).join(``):Fi(6,`Belum ada penghuni aktif untuk diakui pendapatannya.`)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `}function dc(){let e=Ei(),t=new Date().toLocaleDateString(`id-ID`,{month:`long`,year:`numeric`}),n=Math.max(1,...e.expenseByCategory.map(([,e])=>e));return`
    <div class="grid lg:grid-cols-2 gap-6">
      <div class="card p-6 space-y-4">
        <div class="flex items-center justify-between border-b border-line pb-3">
          <div>
            <h2 class="font-extrabold text-stone-800">Laporan Laba Rugi</h2>
            <p class="text-xs text-stone-500">Periode ${t}</p>
          </div>
          <span class="badge-gold">P&amp;L</span>
        </div>

        <div class="space-y-2.5 text-sm">
          <div class="flex justify-between gap-3"><span class="text-stone-600">Pendapatan sewa (accrual)</span><span class="font-bold text-stone-800">${O(e.rentRevenue)}</span></div>
          <div class="flex justify-between gap-3"><span class="text-stone-600">Invoice layanan (lunas)</span><span class="font-bold text-stone-800">${O(e.serviceRevenue)}</span></div>
          <div class="flex justify-between gap-3"><span class="text-stone-600">Penjualan POS (laundry &amp; layanan)</span><span class="font-bold text-stone-800">${O(e.posRevenue)}</span></div>
          <div class="flex justify-between gap-3 pt-2 border-t border-line"><span class="font-bold text-stone-700">Total pendapatan</span><span class="font-black text-emerald-700">${O(e.revenue)}</span></div>
          <div class="flex justify-between gap-3"><span class="text-stone-600">Pengeluaran operasional</span><span class="font-bold text-rose-700">−${O(e.expenses)}</span></div>
          <div class="flex justify-between gap-3 pt-3 border-t-2 border-stone-300 items-center">
            <span class="font-black text-stone-800">Laba / (rugi) bersih</span>
            <span class="font-black text-xl ${e.net>=0?`text-emerald-700`:`text-rose-700`}">${e.net<0?`−`:``}${O(Math.abs(e.net))}</span>
          </div>
        </div>
      </div>

      <div class="card p-6 space-y-4">
        <div class="flex items-center justify-between border-b border-line pb-3">
          <div>
            <h2 class="font-extrabold text-stone-800">Komposisi Pengeluaran</h2>
            <p class="text-xs text-stone-500">Berdasarkan kategori · ${t}</p>
          </div>
          <span class="badge-gray">${e.expenseByCategory.length} kategori</span>
        </div>

        ${e.expenseByCategory.length?`<div class="space-y-3.5">
                ${e.expenseByCategory.map(([e,t])=>`
                    <div>
                      <div class="flex justify-between text-xs mb-1">
                        <span class="font-bold text-stone-700">${P(e)}</span>
                        <span class="font-black text-stone-800">${O(t)}</span>
                      </div>
                      ${Ri(t/n*100,`bg-rose-400`)}
                    </div>`).join(``)}
              </div>`:Ii({iconName:`PieChart`,title:`Belum ada pengeluaran`,description:`Catat pengeluaran operasional untuk melihat komposisi biaya.`})}
      </div>
    </div>
  `}function fc(){let e=tc(),t=ec({category:ic,search:ac}),n=$s();return`
    <div class="space-y-5">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        ${q({label:`Kas Masuk`,value:O(e.totalIn),iconName:`ArrowDownRight`,tone:`green`,hint:`${e.count} transaksi`})}
        ${q({label:`Kas Keluar`,value:O(e.totalOut),iconName:`ArrowUpRight`,tone:`rose`})}
        ${q({label:`Saldo Kas`,value:O(e.balance),iconName:`Wallet`,tone:`brand`})}
        ${q({label:`Deposit Ditahan`,value:O(e.depositHeld),iconName:`Landmark`,tone:`amber`,hint:`Kewajiban, bukan pendapatan`})}
      </div>

      <div class="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 leading-relaxed">
        <p class="font-extrabold mb-1">Cara membaca buku kas</p>
        Deposit masuk sebagai <b>kas</b>, tetapi bukan pendapatan. Deposit dicatat sebagai kewajiban
        sampai dikembalikan saat check-out. Pendapatan operasional = kas masuk − deposit masuk.
        Nilai pendapatan operasional saat ini <b>${O(e.operatingIn)}</b>.
      </div>

      <div class="card overflow-hidden">
        <div class="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-line">
          <div>
            <h2 class="text-sm font-extrabold text-stone-800">Buku Kas &amp; Transaksi Terakhir</h2>
            <p class="text-[11px] text-stone-500 mt-0.5">Deposit, sewa, laundry/POS, invoice layanan, dan pengeluaran dalam satu catatan.</p>
          </div>
          <span class="badge-gold">${t.length} baris</span>
        </div>
        <div class="p-3 flex flex-col sm:flex-row gap-2 border-b border-line bg-cream/40">
          <select id="ledger-category" class="select input-sm sm:w-56">
            <option value="">Semua kategori</option>
            ${n.map(e=>`<option value="${P(e)}" ${ic===e?`selected`:``}>${P(e)}</option>`).join(``)}
          </select>
          <div class="relative flex-1">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500">${N(`Search`,`w-3.5 h-3.5`)}</span>
            <input id="ledger-search" type="search" class="input input-sm pl-8" placeholder="Cari keterangan / nama / nomor…" value="${P(ac)}" />
          </div>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Tanggal</th><th>Keterangan</th><th>Kategori</th><th>Metode</th><th>Masuk</th><th>Keluar</th><th>Saldo</th></tr></thead>
            <tbody>
              ${t.length?t.map(e=>`
                        <tr>
                          <td class="whitespace-nowrap text-[11px]">${j(e.date)}</td>
                          <td>
                            <p class="font-semibold text-stone-700">${P(e.description)}</p>
                            <p class="text-[10px] text-stone-500">${[e.party,e.roomNumber?`Kamar ${e.roomNumber}`:``,e.reference].filter(Boolean).map(P).join(` · `)}</p>
                          </td>
                          <td><span class="${e.isDeposit?`badge-amber`:`badge-gray`} normal-case tracking-normal">${P(e.category)}</span></td>
                          <td class="text-[11px] text-stone-600">${P(e.method||`—`)}</td>
                          <td class="font-bold text-emerald-700 whitespace-nowrap">${e.direction===`in`?O(e.amount):`—`}</td>
                          <td class="font-bold text-rose-700 whitespace-nowrap">${e.direction===`out`?O(e.amount):`—`}</td>
                          <td class="font-black text-stone-800 whitespace-nowrap">${O(e.balanceAfter)}</td>
                        </tr>`).join(``):Fi(7,`Belum ada transaksi keuangan yang cocok.`)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `}function pc(){let e=Xi(),t=Qi(),n=Ne();return`
    <div class="space-y-5">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        ${q({label:`Deposit Ditahan`,value:O(t.held),iconName:`Landmark`,tone:`amber`,hint:`Kewajiban yang harus dikembalikan`})}
        ${q({label:`Sudah Diterima`,value:O(t.paid),iconName:`ArrowDownRight`,tone:`green`})}
        ${q({label:`Belum Dibayar`,value:O(t.outstanding),iconName:`CircleAlert`,tone:t.outstanding?`rose`:`green`,hint:`${t.unpaidCount} kamar belum setor`})}
        ${q({label:`Sudah Dikembalikan`,value:O(t.refunded),iconName:`ArrowUpRight`})}
      </div>

      <div class="rounded-2xl border border-line bg-cream/60 p-4 text-xs text-stone-600 leading-relaxed">
        <b class="text-stone-800">Deposit = uang jaminan, bukan DP sewa.</b>
        Deposit tidak dihitung sebagai pendapatan. Saat check-out, deposit dikembalikan sesuai ketentuan.
        Gunakan tombol <b>Catat / Sesuaikan</b> untuk memperbarui status setoran deposit per kamar.
      </div>

      <div class="card overflow-hidden">
        <div class="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-line">
          <div>
            <h2 class="text-sm font-extrabold text-stone-800">Status Deposit per Kamar</h2>
            <p class="text-[11px] text-stone-500 mt-0.5">${e.length} penghuni aktif/booking · target ${O(t.target)}</p>
          </div>
          ${n?`<button type="button" class="btn-outline btn-sm" data-action="import-deposit">${N(`Upload`,`w-4 h-4`)} Impor Spreadsheet</button>`:``}
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Kamar</th><th>Penghuni</th><th>Target</th><th>Diterima</th><th>Dikembalikan</th><th>Sisa</th><th>Status</th><th class="text-right">Aksi</th></tr></thead>
            <tbody>
              ${e.length?e.map(e=>`
                        <tr>
                          <td class="font-black text-stone-800 whitespace-nowrap">${P(e.roomNumber)}</td>
                          <td>
                            <p class="font-bold text-stone-800">${P(e.name)}</p>
                            <p class="text-[10px] text-stone-500">${e.kind===`booking`?`Booking`:`Penghuni aktif`}</p>
                          </td>
                          <td class="whitespace-nowrap">${O(e.deposit)}</td>
                          <td class="font-bold text-emerald-700 whitespace-nowrap">${O(e.depositPaid)}</td>
                          <td class="font-bold text-rose-700 whitespace-nowrap">${O(e.depositRefunded)}</td>
                          <td class="font-black ${e.outstanding?`text-rose-700`:`text-emerald-700`} whitespace-nowrap">${O(e.outstanding)}</td>
                          <td>
                            ${e.kind===`booking`?`<span class="badge-blue">Booking</span> `:``}
                            ${e.deposit<=0?`<span class="badge-gray">Tanpa deposit</span>`:e.outstanding>0?`<span class="badge-amber">Belum lunas</span>`:`<span class="badge-green">Lunas</span>`}
                          </td>
                          <td>
                            <div class="flex items-center justify-end gap-1">
                              ${n?`<button type="button" class="btn-outline btn-xs" data-action="adjust-deposit" data-kind="${e.kind}" data-id="${e.id}">${N(`Pencil`,`w-3 h-3`)} Catat</button>`:``}
                              ${n&&e.depositHeld>0?`<button type="button" class="btn-ghost btn-xs text-rose-600" data-action="refund-deposit" data-kind="${e.kind}" data-id="${e.id}" title="Kembalikan deposit">${N(`ArrowUpRight`,`w-3.5 h-3.5`)}</button>`:``}
                            </div>
                          </td>
                        </tr>`).join(``):Fi(8,`Belum ada penghuni aktif atau booking.`)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `}function mc(){return rc===`ledger`?fc():rc===`deposits`?pc():rc===`invoices`?lc():rc===`accrual`?uc():rc===`pnl`?dc():cc()}function hc(e){e.innerHTML=`
    <div data-view="financial" class="animate-in">
      ${K({eyebrow:`Accounting System`,title:`Financial & Keuangan 📊`,subtitle:`Buku kas, deposit/jaminan, pengeluaran, invoice layanan, pendapatan accrual, dan laba rugi.`,actions:`
          <button type="button" class="btn-outline btn-sm" data-action="add-expense">${N(`Plus`,`w-4 h-4`)} Catat Pengeluaran</button>
          <button type="button" class="btn-primary btn-sm" data-action="add-invoice">${N(`FilePlus2`,`w-4 h-4`)} Buat Invoice</button>
        `})}

      <div class="flex flex-wrap gap-2 mb-5 border-b border-line pb-3" id="fin-tabs">
        ${sc.map(e=>`
          <button type="button" class="${rc===e.id?`chip-active`:`chip-idle`} flex items-center gap-1.5" data-tab="${e.id}">
            ${N(e.iconName,`w-3.5 h-3.5`)} ${e.label}
          </button>`).join(``)}
      </div>

      <div id="fin-content"></div>
    </div>
  `;let t=e.querySelector(`[data-view="financial"]`),n=t.querySelector(`#fin-content`),r=()=>{t.querySelectorAll(`[data-tab]`).forEach(e=>{e.className=`${e.dataset.tab===rc?`chip-active`:`chip-idle`} flex items-center gap-1.5`})},i=()=>{n.innerHTML=mc(),r()};t.querySelectorAll(`[data-tab]`).forEach(e=>{e.addEventListener(`click`,()=>{rc=e.dataset.tab,i()})}),i(),F(t,`change`,`#ledger-search`,(e,t)=>{ac=t.value,i()}),F(t,`change`,`#ledger-category`,(e,t)=>{ic=t.value,i()}),F(t,`click`,`[data-action]`,async(e,t)=>{let n=t.dataset.action,r=Number(t.dataset.id);if(n===`add-expense`)gc();else if(n===`import-deposit`)ja(i);else if(n===`adjust-deposit`)Ea(t.dataset.kind,r,i);else if(n===`refund-deposit`)Da(t.dataset.kind,r,i);else if(n===`add-invoice`)Ca();else if(n===`manage-categories`)_c();else if(n===`edit-expense`)gc(r);else if(n===`delete-expense`){if(!await H({title:`Hapus pengeluaran?`,message:`Catatan pengeluaran ini akan dihapus permanen.`,confirmText:`Ya, hapus`,danger:!0}))return;Gs(r),L(`Pengeluaran berhasil dihapus.`)}else if(n===`doku-invoice-link`){if(!z()){L(`Link DOKU belum diaktifkan. Aktifkan di Pengaturan setelah akun DOKU siap.`,`warning`);return}let e=Dr().find(e=>String(e.id)===String(r));if(!e)return;let t=Ai(`manual`,{nama:e.tenantName,kamar:e.roomNumber,nominal:O(e.amount),no_invoice:e.number,item_layanan:e.item,jatuh_tempo:j(e.dueDate)});try{let n=await Lr(e);Vr({title:`Link Pembayaran Invoice`,subtitle:`${e.tenantName||`—`} • Kamar ${e.roomNumber||`—`}`,paymentUrl:n.paymentUrl,invoiceNumber:n.invoiceNumber,amount:n.amount,expiresAt:n.expiresAt,phone:e.phone||``,email:oc(e),recipientName:e.tenantName||``,message:t})}catch(e){L(e.message,`error`)}}else if(n===`verify-invoice`)xa({kind:`invoice`,id:r});else if(n===`email-invoice`){let e=Dr().find(e=>String(e.id)===String(r));if(!e)return;let n=oc(e);if(!n){L(`Email penerima belum diisi.`,`warning`);return}t.disabled=!0;try{let{delivery:t}=await ba(e);L(t.sent?`Tagihan dikirim ke ${n}.`:`Email belum dikonfigurasi. Aplikasi email perangkat dibuka sebagai gantinya.`,t.sent?`success`:`warning`)}catch(e){L(e.message,`error`)}finally{t.disabled=!1}}else if(n===`unverify-invoice`)Mr(r),L(`Verifikasi invoice dibatalkan.`,`warning`);else if(n===`delete-invoice`){if(!await H({title:`Hapus invoice?`,message:`Invoice layanan ini akan dihapus permanen.`,confirmText:`Ya, hapus`,danger:!0}))return;Nr(r),L(`Invoice berhasil dihapus.`)}})}function gc(e=null){let t=e?Vs().find(t=>t.id===e):null,n=Hs();V({title:t?`Edit Pengeluaran`:`Catat Pengeluaran`,size:`md`,body:`
      <form id="expense-form" class="space-y-4" novalidate>
        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label class="label" for="ex-date">Tanggal</label>
            <input id="ex-date" type="date" class="input" value="${t?.date||k()}" />
          </div>
          <div>
            <label class="label" for="ex-category">Kategori</label>
            <select id="ex-category" class="select">
              ${n.map(e=>`<option value="${P(e)}" ${t?.category===e?`selected`:``}>${P(e)}</option>`).join(``)}
            </select>
          </div>
        </div>
        <div>
          <label class="label" for="ex-description">Uraian / deskripsi</label>
          <input id="ex-description" type="text" class="input" placeholder="cth: Token listrik lantai 2" value="${P(t?.description||``)}" />
        </div>
        <div>
          <label class="label" for="ex-amount">Nominal (Rp)</label>
          <input id="ex-amount" type="number" min="0" step="1000" class="input" placeholder="cth: 350000" value="${t?D(t.amount):``}" />
        </div>
      </form>
    `,footer:`
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      <button type="submit" form="expense-form" class="btn-primary btn-sm" data-submit>${N(`Check`,`w-4 h-4`)} Simpan</button>
    `,onMount(e,n){e.querySelector(`#expense-form`).addEventListener(`submit`,r=>{r.preventDefault();let i={date:e.querySelector(`#ex-date`).value||k(),category:e.querySelector(`#ex-category`).value,description:e.querySelector(`#ex-description`).value,amount:D(e.querySelector(`#ex-amount`).value)};try{t?Ws(t.id,i):Us(i),L(t?`Pengeluaran berhasil diperbarui.`:`Pengeluaran berhasil dicatat.`),n()}catch(e){L(e.message,`error`)}})}})}function _c(){V({title:`Kelola Kategori Pengeluaran`,subtitle:`Kategori dipakai untuk mengelompokkan jurnal biaya.`,size:`sm`,body:`
      <div class="space-y-4">
        <div class="flex gap-2">
          <input id="cat-input" type="text" class="input input-sm flex-1" placeholder="Nama kategori baru" />
          <button type="button" class="btn-primary btn-sm shrink-0" data-add-category>${N(`Plus`,`w-4 h-4`)} Tambah</button>
        </div>
        <div id="cat-list" class="space-y-1.5 max-h-64 overflow-y-auto"></div>
      </div>
    `,footer:`<button type="button" class="btn-outline btn-sm" data-modal-close>Tutup</button>`,onMount(e){let t=e.querySelector(`#cat-input`),n=e.querySelector(`#cat-list`),r=()=>{let e=Hs();n.innerHTML=e.map(e=>`
            <div class="flex items-center justify-between gap-2 rounded-xl border border-line bg-white px-3 py-2">
              <span class="text-xs font-semibold text-stone-700">${P(e)}</span>
              <button type="button" class="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50" data-remove-category="${P(e)}" aria-label="Hapus ${P(e)}">
                ${N(`X`,`w-3.5 h-3.5`)}
              </button>
            </div>`).join(``)};r(),e.querySelector(`[data-add-category]`)?.addEventListener(`click`,()=>{try{Ks(t.value),t.value=``,r(),L(`Kategori berhasil ditambahkan.`)}catch(e){L(e.message,`error`)}}),t.addEventListener(`keydown`,t=>{t.key===`Enter`&&(t.preventDefault(),e.querySelector(`[data-add-category]`)?.click())}),n.addEventListener(`click`,async e=>{let t=e.target.closest(`[data-remove-category]`);if(!t)return;let n=t.dataset.removeCategory;if(await H({title:`Hapus kategori?`,message:`Kategori <b>${P(n)}</b> akan dihapus. Pengeluaran lama tetap menyimpan nama kategori.`,confirmText:`Ya, hapus`,danger:!0}))try{qs(n),r(),L(`Kategori berhasil dihapus.`)}catch(e){L(e.message,`error`)}})}})}var vc=n({render:()=>Tc}),yc=`semua`,bc=``,xc=[{key:`semua`,label:`Semua`},{key:`unpaid`,label:`Belum Bayar`},{key:`paid`,label:`Lunas`}];function Sc(e){return e.status===`unpaid`&&!!e.dueDate&&e.dueDate<k()}function Cc(e){return String(e?.email||w().tenants.find(t=>String(t.id)===String(e?.tenantId))?.email||``).trim()}function wc(e){let t=Sc(e),n=Cc(e),r=z(),i=Ai(`tagihan`,{nama:e.tenantName||`Penghuni`,kamar:e.roomNumber||`—`,nominal:O(e.amount),jatuh_tempo:j(e.dueDate),no_invoice:e.number});return`
    <tr>
      <td class="font-mono text-[11px] font-bold text-stone-700 whitespace-nowrap">${P(e.number||`—`)}</td>
      <td>
        <p class="font-bold text-stone-800">${P(e.tenantName||`—`)}</p>
        <p class="text-[10px] text-stone-600">Kamar ${P(e.roomNumber||`—`)}</p>
        ${n?`<p class="text-[10px] text-stone-500 truncate max-w-[180px]">${P(n)}</p>`:``}
      </td>
      <td>
        <p class="font-semibold text-stone-700">${P(e.type||`Sewa`)}</p>
        ${e.description?`<p class="text-[10px] text-stone-600 max-w-[240px] truncate">${P(e.description)}</p>`:``}
      </td>
      <td class="font-black text-stone-800 whitespace-nowrap">${O(e.amount)}</td>
      <td class="whitespace-nowrap">
        <span class="${t?`text-rose-700 font-bold`:``}">${j(e.dueDate)}</span>
        ${t?`<p class="text-[10px] font-bold text-rose-600">Terlambat</p>`:``}
      </td>
      <td>${Ni(e.status)}</td>
      <td>
        <div class="flex flex-wrap items-center justify-end gap-1">
          ${e.status===`unpaid`?`
                ${r?`<button type="button" class="btn-outline btn-xs" data-action="doku-link" data-id="${e.id}">${N(`CreditCard`,`w-3 h-3`)} Link DOKU</button>`:``}
                <button type="button" class="btn-outline btn-xs" data-action="email-bill" data-id="${e.id}" ${n?``:`disabled title="Email penghuni belum diisi"`}>${N(`Send`,`w-3 h-3`)} Kirim Tagihan</button>
                <button type="button" class="btn-primary btn-xs" data-action="verify" data-id="${e.id}">${N(`ShieldCheck`,`w-3 h-3`)} Verifikasi</button>
                ${e.phone?`<a href="${tt(e.phone,i)}" target="_blank" rel="noopener" class="btn-ghost btn-xs text-emerald-700" title="Kirim tagihan via WhatsApp">${N(`MessageCircle`,`w-4 h-4`)}</a>`:``}
                <button type="button" class="btn-ghost btn-xs text-rose-600" data-action="delete" data-id="${e.id}" title="Hapus tagihan">${N(`Trash2`,`w-3.5 h-3.5`)}</button>
              `:`
                <button type="button" class="btn-outline btn-xs" data-action="unverify" data-id="${e.id}">Batalkan</button>
                <button type="button" class="btn-ghost btn-xs text-rose-600" data-action="delete" data-id="${e.id}" title="Hapus tagihan">${N(`Trash2`,`w-3.5 h-3.5`)}</button>
              `}
        </div>
      </td>
    </tr>
  `}function Tc(e){let t=Sr(),n=t.filter(e=>e.status===`unpaid`),r=t.filter(e=>e.status===`paid`&&$e(e.paidAt||e.dueDate)),i=n.reduce((e,t)=>e+Math.max(0,D(t.amount)-D(t.paid)),0),a=r.reduce((e,t)=>e+D(t.paid||t.amount),0),o=n.filter(Sc).length;e.innerHTML=`
    <div data-view="billing" class="animate-in">
      ${K({eyebrow:`Cash Verification`,title:`Sewa & Verifikasi Kas 🧾`,subtitle:`Pantau tagihan sewa, verifikasi pembayaran, dan kirim pengingat WhatsApp.`,actions:`
          <button type="button" class="btn-outline btn-sm" data-action="add-invoice">${N(`FilePlus2`,`w-4 h-4`)} Invoice Layanan</button>
          <button type="button" class="btn-primary btn-sm" data-action="add-bill">${N(`Plus`,`w-4 h-4`)} Buat Tagihan</button>
        `})}

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        ${q({label:`Belum Dibayar`,value:O(i),iconName:`CircleAlert`,tone:i>0?`rose`:`green`,hint:`${n.length} tagihan aktif`})}
        ${q({label:`Terverifikasi Bulan Ini`,value:O(a),iconName:`ShieldCheck`,tone:`green`,hint:`${r.length} tagihan lunas`})}
        ${q({label:`Lewat Jatuh Tempo`,value:o,iconName:`Clock`,tone:o>0?`amber`:`default`,hint:o>0?`Perlu ditindaklanjuti`:`Semua tepat waktu`})}
        ${q({label:`Total Tagihan`,value:t.length,iconName:`ReceiptText`,hint:`Nilai ${O(t.reduce((e,t)=>e+D(t.amount),0))}`})}
      </div>

      <div class="card p-3 mb-5 flex flex-col sm:flex-row sm:items-center gap-3">
        <div class="flex flex-wrap gap-2" id="bill-filters">
          ${xc.map(e=>`
            <button type="button" class="${yc===e.key?`chip-active`:`chip-idle`}" data-filter="${e.key}">
              ${e.label} (${e.key===`semua`?t.length:t.filter(t=>t.status===e.key).length})
            </button>`).join(``)}
        </div>
        <div class="relative sm:ml-auto sm:w-72">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-stone-600">${N(`Search`,`w-3.5 h-3.5`)}</span>
          <input id="bill-search" type="search" class="input input-sm pl-8" placeholder="Cari nomor / nama / kamar…" value="${P(bc)}" />
        </div>
      </div>

      <div id="bill-content"></div>
    </div>
  `;let s=e.querySelector(`[data-view="billing"]`),c=s.querySelector(`#bill-content`),l=s.querySelector(`#bill-search`),u=()=>{s.querySelectorAll(`[data-filter]`).forEach(e=>{e.className=e.dataset.filter===yc?`chip-active`:`chip-idle`})},d=()=>{let e=bc.trim().toLowerCase(),r=t.filter(e=>yc===`semua`||e.status===yc).filter(t=>!e||[t.number,t.tenantName,t.roomNumber,t.type,t.description].join(` `).toLowerCase().includes(e));r.length?c.innerHTML=`
      <div class="card overflow-hidden">
        ${J({title:`Daftar Tagihan Sewa`,description:`${r.length} tagihan ditampilkan · total ${O(r.reduce((e,t)=>e+D(t.amount),0))}`,actions:`<span class="badge-gold">${n.length} belum bayar</span>`})}
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
            <tbody>${r.map(wc).join(``)}</tbody>
          </table>
        </div>
      </div>
    `:c.innerHTML=`
        <div class="card">
          ${Ii({iconName:`ReceiptText`,title:`Tidak ada tagihan`,description:yc===`unpaid`?`Semua tagihan sudah lunas. Kerja bagus! 🎉`:`Belum ada tagihan yang cocok dengan filter atau pencarian.`,action:`<button type="button" class="btn-primary btn-sm" data-action="add-bill">${N(`Plus`,`w-4 h-4`)} Buat Tagihan</button>`})}
        </div>
      `};u(),d(),s.querySelectorAll(`[data-filter]`).forEach(e=>{e.addEventListener(`click`,()=>{yc=e.dataset.filter,u(),d()})}),l?.addEventListener(`input`,()=>{bc=l.value,d()}),F(s,`click`,`[data-action]`,async(e,t)=>{let n=t.dataset.action,r=Number(t.dataset.id);if(n===`add-bill`)Sa();else if(n===`add-invoice`)Ca();else if(n===`doku-link`){if(!z()){L(`Link DOKU belum diaktifkan. Aktifkan di Pengaturan setelah akun DOKU siap.`,`warning`);return}let e=Sr().find(e=>String(e.id)===String(r));if(!e)return;let t=Ai(`tagihan`,{nama:e.tenantName||`Penghuni`,kamar:e.roomNumber||`—`,nominal:O(e.amount),jatuh_tempo:j(e.dueDate),no_invoice:e.number});try{let n=await Ir(e);Vr({title:`Link Pembayaran — ${e.type||`Tagihan`}`,subtitle:`${e.tenantName||`—`} • Kamar ${e.roomNumber||`—`}`,paymentUrl:n.paymentUrl,invoiceNumber:n.invoiceNumber,amount:n.amount,expiresAt:n.expiresAt,phone:e.phone||``,email:Cc(e),recipientName:e.tenantName||``,message:t})}catch(e){L(e.message,`error`)}}else if(n===`verify`)xa({kind:`bill`,id:r});else if(n===`email-bill`){let e=Sr().find(e=>String(e.id)===String(r));if(!e)return;let n=Cc(e);if(!n){L(`Email penghuni belum diisi.`,`warning`);return}t.disabled=!0;try{let{delivery:t}=await ya(e);L(t.sent?`Tagihan dikirim ke ${n}.`:`Email belum dikonfigurasi. Aplikasi email perangkat dibuka sebagai gantinya.`,t.sent?`success`:`warning`)}catch(e){L(e.message,`error`)}finally{t.disabled=!1}}else if(n===`unverify`){if(!await H({title:`Batalkan verifikasi?`,message:`Tagihan akan kembali berstatus <b>belum dibayar</b> dan pembayaran penghuni akan dikurangi sesuai nominal tagihan.`,confirmText:`Ya, batalkan`,danger:!0}))return;try{Tr(r),L(`Verifikasi pembayaran dibatalkan.`,`warning`)}catch(e){L(e.message,`error`)}}else if(n===`delete`){if(!await H({title:`Hapus tagihan?`,message:`Tagihan akan dihapus permanen. Jika sudah lunas, riwayat pembayaran penghuni ikut disesuaikan.`,confirmText:`Ya, hapus`,danger:!0}))return;try{Er(r),L(`Tagihan berhasil dihapus.`)}catch(e){L(e.message,`error`)}}})}var Ec=n({render:()=>Nc}),Dc=[{id:`tagihan`,label:`Tagihan Sewa`,iconName:`ReceiptText`,description:`Dikirim saat menerbitkan tagihan sewa.`},{id:`manual`,label:`Invoice Layanan`,iconName:`FileText`,description:`Untuk invoice non-sewa seperti laundry atau perbaikan.`},{id:`reminder`,label:`Pengingat Kontrak`,iconName:`CalendarClock`,description:`Pengingat sebelum kontrak sewa berakhir.`}],$=`tagihan`,Oc=null;function kc(){return Oc||=Oi(),Oc}function Ac(e){return String(e||``).replace(/\{([a-z_]+)\}/gi,(e,t)=>{let n=ji[t];return n==null?e:String(n)})}function jc(){return Dc.map(e=>`
    <button type="button" class="${$===e.id?`chip-active`:`chip-idle`} flex items-center gap-1.5" data-tab="${e.id}">
      ${N(e.iconName,`w-3.5 h-3.5`)} ${e.label}
    </button>`).join(``)}function Mc(){return Dc.find(e=>e.id===$)||Dc[0]}function Nc(e){let t=kc(),n=Mc();e.innerHTML=`
    <div data-view="content" class="animate-in">
      ${K({eyebrow:`Communication Studio`,title:`Konten & WA Preview 💬`,subtitle:`Kelola template pesan otomatis dan lihat hasilnya sebelum dikirim ke penghuni.`,actions:`
          <button type="button" class="btn-outline btn-sm" data-action="reset-template">${N(`RotateCcw`,`w-4 h-4`)} Reset template</button>
          <button type="button" class="btn-primary btn-sm" data-action="save-templates">${N(`Check`,`w-4 h-4`)} Simpan semua</button>
        `})}

      <div class="flex flex-wrap gap-2 mb-5 border-b border-line pb-3" id="content-tabs">
        ${jc()}
      </div>

      <div class="grid lg:grid-cols-2 gap-6 items-start">
        <div class="card overflow-hidden">
          ${J({title:`Editor Template`,description:`Gunakan variabel agar pesan terisi otomatis.`,actions:`<span class="badge-gold" id="char-count">${String(t[$]||``).length} karakter</span>`})}
          <div class="p-5 space-y-4">
            <div>
              <label class="label" for="template-text">Isi pesan — <span id="active-template-label">${P(n.label)}</span></label>
              <textarea id="template-text" rows="13" class="input font-mono text-[12px] leading-relaxed" spellcheck="false">${P(t[$]||``)}</textarea>
              <p class="hint mt-2">${P(n.description)}</p>
            </div>

            <div>
              <p class="text-[11px] font-extrabold uppercase tracking-wider text-stone-600 mb-2">Sisipkan variabel</p>
              <div class="flex flex-wrap gap-1.5">
                ${x.map(e=>`
                  <button type="button" class="badge-gray hover:bg-brand hover:text-white hover:border-brand transition" data-token="${P(e.token)}" title="${P(e.desc)}">
                    ${N(`Plus`,`w-3 h-3`)} ${P(e.token)}
                  </button>`).join(``)}
              </div>
            </div>

            <div class="rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] text-amber-900 leading-relaxed flex items-start gap-2">
              ${N(`Info`,`w-3.5 h-3.5 shrink-0 mt-0.5`)}
              <span>Pesan hanya disiapkan sebagai tautan WhatsApp — tidak dikirim otomatis oleh aplikasi. Pastikan nomor penghuni sudah benar.</span>
            </div>
          </div>
        </div>

        <div class="card overflow-hidden">
          ${J({title:`Preview Pesan`,description:`Tampilan perkiraan di WhatsApp penerima.`,actions:`<button type="button" class="btn-outline btn-xs" data-action="copy">${N(`Copy`,`w-3.5 h-3.5`)} Salin</button>`})}
          <div class="p-5">
            <div class="rounded-2xl bg-[#e5ddd5] p-4 min-h-[300px] flex flex-col justify-end">
              <div class="max-w-[92%] self-start">
                <div class="rounded-xl rounded-tl-sm bg-white px-3.5 py-3 shadow-sm">
                  <p id="preview-text" class="text-[12px] text-stone-800 whitespace-pre-line leading-relaxed">${P(Ac(t[$]))}</p>
                  <p class="text-[9px] text-stone-600 text-right mt-1.5">${new Date().toLocaleTimeString(`id-ID`,{hour:`2-digit`,minute:`2-digit`})} ✓✓</p>
                </div>
                <p class="text-[9px] text-stone-500 mt-1.5">Casa Ramire · otomatis dari template</p>
              </div>
            </div>

            <div class="mt-4 rounded-xl border border-line bg-cream/60 p-3">
              <p class="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 mb-2">Data contoh</p>
              <div class="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
                ${Object.entries(ji).map(([e,t])=>`
                    <div class="flex justify-between gap-2">
                      <span class="text-stone-600 font-mono">{${P(e)}}</span>
                      <span class="font-semibold text-stone-700 truncate">${P(t)}</span>
                    </div>`).join(``)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;let r=e.querySelector(`[data-view="content"]`),i=r.querySelector(`#template-text`),a=r.querySelector(`#preview-text`),o=r.querySelector(`#char-count`),s=()=>{kc()[$]=i.value},c=()=>{s(),a.textContent=Ac(kc()[$]),o.textContent=`${i.value.length} karakter`},l=()=>{r.querySelector(`#content-tabs`).innerHTML=jc(),r.querySelector(`#active-template-label`).textContent=Mc().label,r.querySelector(`#template-text`).closest(`.space-y-4`).querySelector(`.hint`).textContent=Mc().description};F(r,`click`,`[data-tab]`,(e,t)=>{s(),$=t.dataset.tab,i.value=kc()[$]||``,l(),c()}),i.addEventListener(`input`,c),r.querySelectorAll(`[data-token]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.token,n=i.selectionStart??i.value.length,r=i.selectionEnd??i.value.length;i.value=`${i.value.slice(0,n)}${t}${i.value.slice(r)}`,i.focus(),i.setSelectionRange(n+t.length,n+t.length),c()})}),r.querySelector(`[data-action="save-templates"]`)?.addEventListener(`click`,()=>{s();try{ki(kc()),Oc=Oi(),L(`Template pesan berhasil disimpan.`)}catch(e){L(e.message,`error`)}}),r.querySelector(`[data-action="reset-template"]`)?.addEventListener(`click`,async()=>{await H({title:`Reset template ini?`,message:`Template <b>${P(Mc().label)}</b> akan dikembalikan ke bawaan. Perubahan yang belum disimpan akan hilang.`,confirmText:`Ya, reset`,danger:!0})&&(Oc=kc(),Oc[$]=b[$],i.value=Oc[$],c(),L(`Template dikembalikan ke bawaan. Tekan Simpan untuk menerapkan.`,`warning`))}),r.querySelector(`[data-action="copy"]`)?.addEventListener(`click`,async()=>{let e=Ac(kc()[$]);try{await navigator.clipboard.writeText(e),L(`Pesan berhasil disalin.`)}catch{let t=document.createElement(`textarea`);t.value=e,t.setAttribute(`readonly`,``),t.className=`fixed opacity-0 pointer-events-none`,document.body.appendChild(t),t.select(),document.execCommand(`copy`),t.remove(),L(`Pesan berhasil disalin.`)}})}var Pc=n({render:()=>Ic});function Fc(e){return e===`owner`?`<span class="badge-gold">Owner</span>`:`<span class="badge-blue">Staff</span>`}function Ic(e){if(!Ne()){e.innerHTML=`
      <div class="card animate-in">
        ${Ii({iconName:`Lock`,title:`Akses terbatas`,description:`Halaman manajemen akun hanya dapat diakses oleh owner.`,action:`<a href="#/dashboard" class="btn-primary btn-sm">${N(`LayoutDashboard`,`w-4 h-4`)} Kembali ke Dashboard</a>`})}
      </div>
    `;return}let t=[...w().users].sort((e,t)=>e.name.localeCompare(t.name,`id`)),n=Me(),r=t.filter(e=>e.active),i=t.filter(e=>e.role===`owner`),a=t.filter(e=>e.role===`staff`);e.innerHTML=`
    <div data-view="users" class="animate-in">
      ${K({eyebrow:`Access Control`,title:`Manajemen Akun 🔐`,subtitle:`Kelola akses owner dan staf operasional. Setiap perubahan langsung berlaku.`,actions:`<button type="button" class="btn-primary btn-sm" data-action="add-user">${N(`UserPlus`,`w-4 h-4`)} Tambah Akun</button>`})}

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        ${q({label:`Total Akun`,value:t.length,iconName:`Users`})}
        ${q({label:`Akun Aktif`,value:r.length,iconName:`UserCheck`,tone:`green`})}
        ${q({label:`Owner`,value:i.length,iconName:`ShieldCheck`,tone:`brand`})}
        ${q({label:`Staf`,value:a.length,iconName:`UserRound`,tone:`indigo`})}
      </div>

      <div class="card overflow-hidden">
        <div class="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-line">
          <div>
            <h2 class="font-extrabold text-stone-800 text-sm">Daftar Pengguna</h2>
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
                              ${Li(e.name,`w-9 h-9 text-[10px]`)}
                              <div class="min-w-0">
                                <p class="font-bold text-stone-800 flex items-center gap-1.5">
                                  ${P(e.name)}
                                  ${t?`<span class="badge-gray">Anda</span>`:``}
                                </p>
                                <p class="text-[10px] text-stone-600 font-mono">@${P(e.username)}</p>
                              </div>
                            </div>
                          </td>
                          <td>${Fc(e.role)}</td>
                          <td>
                            ${e.active?`<span class="badge-green">Aktif</span>`:`<span class="badge-red">Nonaktif</span>`}
                          </td>
                          <td class="whitespace-nowrap text-xs text-stone-500">${j(e.createdAt)}</td>
                          <td>
                            <div class="flex flex-wrap items-center justify-end gap-1">
                              <button type="button" class="btn-outline btn-xs" data-action="edit-user" data-id="${e.id}">${N(`Pencil`,`w-3 h-3`)} Edit</button>
                              <button type="button" class="btn-ghost btn-xs" data-action="reset-password" data-id="${e.id}" title="Reset password">${N(`KeyRound`,`w-3.5 h-3.5`)}</button>
                              <button type="button" class="btn-ghost btn-xs ${e.active?`text-amber-700`:`text-emerald-700`}" data-action="toggle-active" data-id="${e.id}" title="${e.active?`Nonaktifkan akun`:`Aktifkan akun`}" ${t?`disabled`:``}>
                                ${N(e.active?`Lock`:`Unlock`,`w-3.5 h-3.5`)}
                              </button>
                              <button type="button" class="btn-ghost btn-xs text-rose-600" data-action="delete-user" data-id="${e.id}" title="Hapus akun" ${t?`disabled`:``}>${N(`Trash2`,`w-3.5 h-3.5`)}</button>
                            </div>
                          </td>
                        </tr>`}).join(``):`<tr><td colspan="5" class="px-4 py-10 text-center text-stone-600 text-sm">Belum ada akun.</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>

      <p class="hint mt-3 flex items-center gap-1.5">
        ${N(`Info`,`w-3.5 h-3.5`)}
        Password disimpan dalam bentuk hash SHA-256 bersalt di perangkat ini, bukan teks asli.
      </p>
    </div>
  `,F(e.querySelector(`[data-view="users"]`),`click`,`[data-action]`,async(e,n)=>{let r=n.dataset.action,i=Number(n.dataset.id),a=t.find(e=>String(e.id)===String(i));if(r===`add-user`)Lc();else if(a){if(r===`edit-user`)Lc(a);else if(r===`reset-password`)Rc(a);else if(r===`toggle-active`){if(a.active&&!await H({title:`Nonaktifkan akun?`,message:`<b>${P(a.name)}</b> tidak akan bisa masuk sampai akun diaktifkan kembali.`,confirmText:`Ya, nonaktifkan`,danger:!0}))return;try{Be(a.id,{active:!a.active}),L(a.active?`Akun dinonaktifkan.`:`Akun diaktifkan kembali.`)}catch(e){L(e.message,`error`)}}else if(r===`delete-user`){if(!await H({title:`Hapus akun?`,message:`<b>${P(a.name)}</b> (@${P(a.username)}) akan dihapus permanen dan tidak dapat masuk lagi.`,confirmText:`Ya, hapus`,danger:!0}))return;try{He(a.id),L(`Akun berhasil dihapus.`)}catch(e){L(e.message,`error`)}}}})}function Lc(e=null){let t=!!e;V({title:t?`Edit Akun`:`Tambah Akun Baru`,subtitle:t?`@${e.username}`:`Akun baru dapat langsung digunakan setelah disimpan.`,size:`md`,body:`
      <form id="user-form" class="space-y-4" novalidate>
        <div>
          <label class="label" for="usr-name">Nama lengkap</label>
          <input id="usr-name" type="text" class="input" placeholder="cth: Rian Pratama" value="${P(e?.name||``)}" required />
        </div>
        <div>
          <label class="label" for="usr-username">Username</label>
          <input id="usr-username" type="text" class="input font-mono" placeholder="cth: admin" value="${P(e?.username||``)}" ${t?`disabled`:``} required />
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
      <button type="submit" form="user-form" class="btn-primary btn-sm">${N(`Check`,`w-4 h-4`)} ${t?`Simpan perubahan`:`Buat akun`}</button>
    `,onMount(n,r){n.querySelector(`#user-form`).addEventListener(`submit`,i=>{i.preventDefault();try{t?(Be(e.id,{name:n.querySelector(`#usr-name`).value,role:n.querySelector(`#usr-role`).value,active:n.querySelector(`#usr-active`).checked}),L(`Akun berhasil diperbarui.`)):(ze({name:n.querySelector(`#usr-name`).value,username:n.querySelector(`#usr-username`).value,password:n.querySelector(`#usr-password`).value,role:n.querySelector(`#usr-role`).value}),L(`Akun baru berhasil dibuat.`)),r()}catch(e){L(e.message,`error`)}})}})}function Rc(e){V({title:`Reset Password`,subtitle:`${e.name} · @${e.username}`,size:`sm`,body:`
      <form id="reset-form" class="space-y-4" novalidate>
        <div>
          <label class="label" for="rst-password">Password baru</label>
          <input id="rst-password" type="password" class="input" placeholder="Minimal 6 karakter" autocomplete="new-password" required />
        </div>
        <div>
          <label class="label" for="rst-confirm">Konfirmasi password</label>
          <input id="rst-confirm" type="password" class="input" autocomplete="new-password" required />
        </div>
        <p class="hint">Terakhir diperbarui: ${Ze(e.updatedAt||e.createdAt)}. Sampaikan password baru secara aman kepada pengguna.</p>
      </form>
    `,footer:`
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      <button type="submit" form="reset-form" class="btn-primary btn-sm">${N(`KeyRound`,`w-4 h-4`)} Reset password</button>
    `,onMount(t,n){t.querySelector(`#reset-form`).addEventListener(`submit`,r=>{r.preventDefault();let i=t.querySelector(`#rst-password`).value;if(i!==t.querySelector(`#rst-confirm`).value)L(`Konfirmasi password tidak cocok.`,`error`);else try{Ve(e.id,i),L(`Password berhasil direset.`),n()}catch(e){L(e.message,`error`)}})}})}var zc=[{icon:`Building2`,title:`42 kamar, satu dashboard`,desc:`Okupansi, booking, dan status kamar real-time.`},{icon:`ReceiptText`,title:`Tagihan & verifikasi kas`,desc:`VA, QRIS, dan pengingat WhatsApp dalam satu alur.`},{icon:`Wallet`,title:`Laporan keuangan rapi`,desc:`Accrual, jurnal pengeluaran, dan laba rugi.`}];function Bc(){return`
    <main class="min-h-dvh flex items-center justify-center p-4 sm:p-6">
      <div class="w-full max-w-4xl card overflow-hidden rounded-3xl shadow-xl animate-in">
        <div class="grid lg:grid-cols-2">
          <div class="bg-brand text-white p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden">
            <div class="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-gold/10 blur-2xl"></div>
            <div class="absolute -left-10 -bottom-10 w-48 h-48 rounded-full bg-white/5 blur-2xl"></div>

            <div class="relative">
              <div class="flex items-center gap-3">
                ${Vn(`w-12 h-12 rounded-2xl`)}
                <div>
                  <p class="font-extrabold tracking-wide text-lg leading-tight">CASA RAMIRE</p>
                  <p class="text-[10px] font-bold text-gold uppercase tracking-[0.22em]">Property Management OS</p>
                </div>
              </div>
              <p class="text-2xl lg:text-3xl font-black mt-8 tracking-tight text-balance">
                Kelola kos Anda dengan tenang.
              </p>
              <p class="text-sm text-stone-300 mt-2 leading-relaxed">
                Dari kamar kosong sampai laporan laba rugi — semua tercatat, rapi, dan siap dipakai.
              </p>
            </div>

            <ul class="relative space-y-3 mt-8">
              ${zc.map(e=>`
                <li class="flex items-start gap-3">
                  <span class="w-9 h-9 rounded-xl bg-white/10 text-gold flex items-center justify-center shrink-0">
                    ${N(e.icon,`w-[18px] h-[18px]`)}
                  </span>
                  <div>
                    <p class="text-[13px] font-bold">${P(e.title)}</p>
                    <p class="text-[11px] text-stone-400 leading-snug">${P(e.desc)}</p>
                  </div>
                </li>`).join(``)}
            </ul>

            <p class="relative text-[10px] text-stone-300 mt-8">
              © ${new Date().getFullYear()} Casa Ramire · Data tersimpan di perangkat ini
            </p>
          </div>

          <div class="p-7 sm:p-10 bg-white">
            <div class="mb-6">
              <span class="badge-gold">Masuk ke sistem</span>
              <h1 class="text-2xl font-black text-stone-800 mt-3 tracking-tight">Selamat datang kembali 👋</h1>
              <p class="text-sm text-stone-600 mt-1">Gunakan akun yang diberikan owner untuk melanjutkan.</p>
            </div>

            <form id="login-form" class="space-y-4" novalidate>
              <div>
                <label class="label" for="login-username">Username</label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">${N(`UserRound`,`w-4 h-4`)}</span>
                  <input id="login-username" name="username" type="text" class="input pl-9" placeholder="Masukkan username" autocomplete="username" required />
                </div>
              </div>

              <div>
                <div class="flex items-center justify-between gap-2 mb-1.5">
                  <label class="block text-xs font-bold text-stone-700" for="login-password">Password</label>
                  <button type="button" class="text-[11px] font-bold text-brand hover:underline" data-forgot-password>
                    Lupa password?
                  </button>
                </div>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">${N(`Lock`,`w-4 h-4`)}</span>
                  <input id="login-password" name="password" type="password" class="input pl-9 pr-11" placeholder="••••••••" autocomplete="current-password" required />
                  <button type="button" class="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100" data-toggle-password aria-label="Tampilkan password">
                    ${N(`Eye`,`w-4 h-4`)}
                  </button>
                </div>
              </div>

              <div id="login-error" class="hidden items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-semibold text-rose-700">
                ${N(`CircleAlert`,`w-4 h-4 shrink-0 mt-0.5`)}
                <span data-error-text></span>
              </div>

              <button type="submit" class="btn-primary w-full py-3" data-submit>
                ${N(`LogIn`,`w-4 h-4`)}
                <span>Masuk ke sistem</span>
              </button>
            </form>

            <a href="#/home" class="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-brand">
              ${N(`ArrowLeft`,`w-3.5 h-3.5`)} Kembali ke katalog kamar
            </a>
          </div>
        </div>
      </div>
    </main>
  `}function Vc(e){let t=e.querySelector(`#login-form`),n=e.querySelector(`#login-username`),r=e.querySelector(`#login-password`),i=e.querySelector(`#login-error`),a=e.querySelector(`[data-error-text]`),o=e.querySelector(`[data-submit]`),s=e=>{a.textContent=e,i.classList.remove(`hidden`),i.classList.add(`flex`)},c=()=>{i.classList.add(`hidden`),i.classList.remove(`flex`)};e.querySelector(`[data-toggle-password]`)?.addEventListener(`click`,e=>{let t=e.currentTarget,n=r.type===`password`;r.type=n?`text`:`password`,t.innerHTML=N(n?`EyeOff`:`Eye`,`w-4 h-4`),t.setAttribute(`aria-label`,n?`Sembunyikan password`:`Tampilkan password`)}),e.querySelector(`[data-forgot-password]`)?.addEventListener(`click`,()=>{Hc(n.value,e=>{n.value=e,r.focus()})}),t.addEventListener(`submit`,e=>{e.preventDefault(),c();let t=n.value.trim(),i=r.value;if(!t||!i){s(`Username dan password wajib diisi.`);return}o.disabled=!0,o.innerHTML=`${N(`Loader2`,`w-4 h-4 animate-spin`)}<span>Memeriksa…</span>`;let a=Fe(t,i);a.ok?L(`Selamat datang, ${a.user.name.split(` `)[0]}!`):(o.disabled=!1,o.innerHTML=`${N(`LogIn`,`w-4 h-4`)}<span>Masuk ke sistem</span>`,s(a.error),r.select())})}function Hc(e,t){V({title:`Reset Password Owner`,subtitle:`Pulihkan akses owner dengan kunci admin Casa Ramire.`,size:`md`,body:`
      <form id="reset-password-form" class="space-y-4" novalidate>
        <div class="rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900 leading-relaxed flex items-start gap-2">
          ${N(`Info`,`w-4 h-4 shrink-0 mt-0.5`)}
          <span>
            Reset hanya berlaku di <b>browser/perangkat ini</b>. Masukkan kunci admin yang dipakai untuk sinkronisasi/pembayaran.
            Nilainya ada di file <code class="font-mono text-[10px] bg-white/70 border border-amber-200 rounded px-1 py-0.5">.env.catalog</code>.
          </span>
        </div>

        <div>
          <label class="label" for="rp-username">Username owner</label>
          <input id="rp-username" type="text" class="input" value="${P(e||`owner`)}" autocomplete="username" required />
        </div>

        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label class="label" for="rp-new">Password baru</label>
            <input id="rp-new" type="password" class="input" placeholder="Minimal 6 karakter" autocomplete="new-password" required />
          </div>
          <div>
            <label class="label" for="rp-confirm">Konfirmasi password</label>
            <input id="rp-confirm" type="password" class="input" autocomplete="new-password" required />
          </div>
        </div>

        <div>
          <label class="label" for="rp-key">Kunci admin</label>
          <input id="rp-key" type="password" class="input font-mono text-xs" placeholder="casa_..." autocomplete="off" required />
          <p class="hint mt-1">Kunci ini tidak dikirim ke pihak lain. Verifikasi dilakukan ke server Casa Ramire atau kunci yang tersimpan di perangkat ini.</p>
        </div>

        <div id="rp-error" class="hidden items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-semibold text-rose-700">
          ${N(`CircleAlert`,`w-4 h-4 shrink-0 mt-0.5`)}
          <span data-rp-error></span>
        </div>
      </form>
    `,footer:`
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      <button type="submit" form="reset-password-form" class="btn-primary btn-sm" data-reset-submit>
        ${N(`KeyRound`,`w-4 h-4`)} Reset password
      </button>
    `,onMount(e,n){let r=e.querySelector(`#reset-password-form`),i=e.querySelector(`#rp-error`),a=e.querySelector(`[data-rp-error]`),o=e.querySelector(`[data-reset-submit]`),s=e=>{a.textContent=e,i.classList.remove(`hidden`),i.classList.add(`flex`)};r.addEventListener(`submit`,async r=>{r.preventDefault(),i.classList.add(`hidden`),i.classList.remove(`flex`);let a=e.querySelector(`#rp-username`).value.trim(),c=e.querySelector(`#rp-new`).value,l=e.querySelector(`#rp-confirm`).value,u=e.querySelector(`#rp-key`).value.trim();if(!a)s(`Username owner wajib diisi.`);else if(c.length<6)s(`Password baru minimal 6 karakter.`);else if(c!==l)s(`Konfirmasi password tidak cocok.`);else if(!u)s(`Kunci admin wajib diisi.`);else{I(o,!0,`Memverifikasi…`);try{await Ue({username:a,newPassword:c,recoveryKey:u}),L(`Password owner berhasil direset. Silakan masuk dengan password baru.`),n(),t?.(a)}catch(e){s(e.message||`Gagal mereset password.`)}finally{I(o,!1)}}})}})}function Uc(e,t){let n=te.filter(t=>!t.ownerOnly||e.role===`owner`),r=ne[t]||ne.dashboard,i=o[e.role]?.short||`STAFF`;return`
    <div class="flex h-dvh overflow-hidden">
      <aside
        id="sidebar"
        class="fixed lg:static inset-y-0 left-0 z-40 w-72 bg-brand text-white flex flex-col shrink-0 shadow-xl -translate-x-full lg:translate-x-0 transition-transform duration-200 ease-out"
        aria-label="Navigasi utama"
      >
        <div class="px-5 py-5 border-b border-white/10 flex items-center gap-3">
          ${Vn(`w-11 h-11 rounded-2xl`,{light:!0})}
          <div class="min-w-0">
            <p class="font-extrabold tracking-wider text-sm leading-tight">CASA RAMIRE</p>
            <p class="text-[9px] font-bold text-gold uppercase tracking-[0.18em]">Property Management</p>
          </div>
          <button class="lg:hidden ml-auto p-2 rounded-lg text-stone-300 hover:bg-white/10" data-action="close-menu" aria-label="Tutup menu">
            ${N(`X`,`w-5 h-5`)}
          </button>
        </div>

        <nav class="flex-1 overflow-y-auto scrollbar-none px-3 py-4 space-y-1" aria-label="Menu aplikasi">
          ${n.map(e=>`
              <a href="#/${e.path}" data-nav="${e.path}" class="nav-item ${e.path===t?`nav-item-active`:``}">
                ${N(e.icon,`w-[18px] h-[18px] shrink-0`)}
                <span class="truncate">${P(e.label)}</span>
              </a>`).join(``)}
        </nav>

        <div class="p-3 border-t border-white/10 space-y-2">
          <div class="flex items-center gap-2.5 rounded-xl bg-white/5 border border-white/10 p-2.5">
            ${Li(e.name,`w-9 h-9 text-[11px] bg-gold text-brand`)}
            <div class="min-w-0 flex-1">
              <p class="text-xs font-bold text-white truncate">${P(e.name)}</p>
              <p class="text-[9px] font-extrabold uppercase tracking-wider text-gold">${i}</p>
            </div>
          </div>
          <a href="#/home" data-close-drawer class="flex items-center justify-center gap-1.5 rounded-xl border border-gold/20 bg-gold/10 px-3 py-2 text-[11px] font-bold text-gold hover:bg-gold/20 transition">
            ${N(`Globe2`,`w-3.5 h-3.5`)} Lihat Landing Page
          </a>
          <div class="grid grid-cols-2 gap-2">
            <button type="button" class="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-bold text-stone-200 hover:bg-white/10 transition" data-action="settings">
              ${N(`Settings`,`w-3.5 h-3.5`)} Pengaturan
            </button>
            <button type="button" class="flex items-center justify-center gap-1.5 rounded-xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-[11px] font-bold text-rose-200 hover:bg-rose-500/20 transition" data-action="logout">
              ${N(`LogOut`,`w-3.5 h-3.5`)} Keluar
            </button>
          </div>
        </div>
      </aside>

      <div id="sidebar-overlay" class="hidden fixed inset-0 z-30 bg-stone-950/50 backdrop-blur-[1px] lg:hidden"></div>

      <div class="flex-1 flex flex-col min-w-0">
        <header class="h-16 shrink-0 bg-cream/90 backdrop-blur border-b border-line flex items-center gap-3 px-4 sm:px-6">
          <button type="button" class="lg:hidden btn-ghost btn-sm" data-action="open-menu" aria-label="Buka menu">
            ${N(`Menu`,`w-5 h-5`)}
          </button>
          <div class="min-w-0">
            <p id="topbar-title" class="text-sm font-extrabold text-stone-800 truncate">${P(r.title)}</p>
            <p id="topbar-subtitle" class="text-[11px] text-stone-600 truncate hidden sm:block">${P(r.subtitle)}</p>
          </div>
          <div class="ml-auto flex items-center gap-2 sm:gap-3">
            <span class="hidden md:flex items-center gap-1.5 text-[11px] font-semibold text-stone-500 bg-white border border-line rounded-xl px-3 py-2">
              ${N(`CalendarDays`,`w-3.5 h-3.5 text-gold-700`)}
              ${Xe(new Date)}
            </span>
            <button type="button" class="btn-ghost btn-sm" data-action="settings" title="Pengaturan" aria-label="Pengaturan">
              ${N(`Settings`,`w-4 h-4`)}
            </button>
            <div class="hidden sm:flex items-center gap-2 pl-2 border-l border-line">
              ${Li(e.name,`w-8 h-8 text-[10px]`)}
              <div class="hidden md:block leading-tight">
                <p class="text-[11px] font-bold text-stone-800 max-w-[140px] truncate">${P(e.name)}</p>
                <p class="text-[9px] font-extrabold uppercase tracking-wider text-gold-700">${i}</p>
              </div>
            </div>
          </div>
        </header>

        <main id="main-scroll" class="flex-1 overflow-y-auto">
          <div id="view" class="p-4 sm:p-6 lg:p-8 max-w-[1500px] mx-auto"></div>
        </main>
      </div>
    </div>
  `}function Wc(e){let t=e.querySelector(`#sidebar`),n=e.querySelector(`#sidebar-overlay`),r=e=>{t.classList.toggle(`-translate-x-full`,!e),t.classList.toggle(`translate-x-0`,e),n.classList.toggle(`hidden`,!e)};e.querySelector(`[data-action="open-menu"]`)?.addEventListener(`click`,()=>r(!0)),e.querySelector(`[data-action="close-menu"]`)?.addEventListener(`click`,()=>r(!1)),n?.addEventListener(`click`,()=>r(!1)),e.querySelectorAll(`[data-nav], [data-close-drawer]`).forEach(e=>{e.addEventListener(`click`,()=>r(!1))}),e.querySelectorAll(`[data-action="settings"]`).forEach(e=>{e.addEventListener(`click`,()=>Un())}),e.querySelector(`[data-action="logout"]`)?.addEventListener(`click`,()=>{Ie(),r(!1)})}function Gc(e,t,n){let r=ne[n]||ne.dashboard,i=e.querySelector(`#topbar-title`),a=e.querySelector(`#topbar-subtitle`);i&&(i.textContent=r.title),a&&(a.textContent=r.subtitle),e.querySelectorAll(`[data-nav]`).forEach(e=>{let t=e.dataset.nav===n;e.classList.toggle(`nav-item-active`,t),t?e.setAttribute(`aria-current`,`page`):e.removeAttribute(`aria-current`)});let s=o[t.role]?.short||`STAFF`,c=e.querySelector(`#sidebar [data-role-label]`);c&&(c.textContent=s)}var Kc=document.getElementById(`app`),qc={dashboard:Pa,pos:ro,bookings:Fo,rooms:Xo,gallery:xs,pricing:Es,addons:js,tenants:Ps,financial:nc,billing:vc,content:Ec,users:Pc},Jc=new Set(te.filter(e=>e.ownerOnly).map(e=>e.path)),Yc=null,Xc=null,Zc=!1;function Qc(){Zc||(Zc=!0,queueMicrotask(()=>{Zc=!1,el()}))}function $c(e){return`
    <div class="card p-8 text-center animate-in">
      <h1 class="font-black text-stone-800 text-lg">Terjadi kesalahan saat memuat halaman</h1>
      <p class="text-sm text-stone-500 mt-1 max-w-lg mx-auto">
        Coba muat ulang aplikasi. Jika masalah berlanjut, unduh backup data lalu lakukan pemulihan.
      </p>
      <pre class="mt-4 text-left text-[11px] text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-3 overflow-x-auto">${String(e?.message||e)}</pre>
      <button type="button" class="btn-primary btn-sm mt-4" onclick="location.reload()">Muat ulang</button>
    </div>
  `}function el(){let e=Me(),t=ie();if(t===`home`){Yc!==null&&Wt(),Yc=null,Xc=null,Kc.innerHTML=``;try{_r(Kc)}catch(e){console.error(`[app] failed to render landing page`,e),Kc.innerHTML=$c(e)}return}if(t===`login`&&e&&(ae(`dashboard`,{replace:!0}),t=`dashboard`),!e){It(),Yc!==null&&Wt(),Yc=null,Xc=null,t!==`login`&&ae(`login`,{replace:!0}),Kc.innerHTML=Bc(),Vc(Kc),document.title=`Masuk — Casa Ramire`;return}Ft(),Jc.has(t)&&!Ne()&&(L(`Halaman tersebut hanya dapat diakses oleh owner.`,`warning`),ae(`dashboard`,{replace:!0}),t=`dashboard`);let n=String(e.id);Yc===n?Gc(Kc,e,t):(Kc.innerHTML=Uc(e,t),Wc(Kc),Yc=n,Xc=null);let r=Kc.querySelector(`#view`);if(!r)return;let i=Xc!==t;r.innerHTML=``;let a=qc[t]||qc.dashboard;try{a.render(r)}catch(e){console.error(`[app] failed to render view`,t,e),r.innerHTML=$c(e)}i&&(Xc=t,document.getElementById(`main-scroll`)?.scrollTo({top:0}),document.title=`${ne[t]?.title||`Dashboard`} — Casa Ramire`)}Ee(Qc),oe(()=>Wt()),oe(Qc),window.location.hash||window.history.replaceState(null,``,Me()?`#/dashboard`:`#/home`),el();