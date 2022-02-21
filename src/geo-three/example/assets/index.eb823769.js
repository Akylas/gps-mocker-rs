var no=Object.defineProperty,ro=Object.defineProperties;var lo=Object.getOwnPropertyDescriptors;var at=Object.getOwnPropertySymbols;var ui=Object.prototype.hasOwnProperty,fi=Object.prototype.propertyIsEnumerable;var mi=(t,e,i)=>e in t?no(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,oe=(t,e)=>{for(var i in e||(e={}))ui.call(e,i)&&mi(t,i,e[i]);if(at)for(var i of at(e))fi.call(e,i)&&mi(t,i,e[i]);return t},We=(t,e)=>ro(t,lo(e));var pi=(t,e)=>{var i={};for(var o in t)ui.call(t,o)&&e.indexOf(o)<0&&(i[o]=t[o]);if(t!=null&&at)for(var o of at(t))e.indexOf(o)<0&&fi.call(t,o)&&(i[o]=t[o]);return i};import{M as st,G as co,T as K,R as nt,L as de,B as je,F as X,V as xe,a as D,b as zt,c as It,d as rt,e as ho,Q as uo,t as q,f as Oe,g as lt,N as Ae,h as gi,D as fo,U as mo,C as $e,i as po,S as vi,j as wi,k as go,l as vo,m as xi,n as wo,o as Mi,P as xo,p as Mo,q as ct,r as yo,s as bo,u as To,v as Eo,w as ze,x as Do,W as Po,y as Lo,z as Ro,E as So,A as Co,H as _o,I as Oo,K as ue,J as Ao,O as zo,X as Io,Y as No,Z as Ho,_ as Fo,$ as Bo,a0 as yi,a1 as Vo,a2 as Uo,a3 as ko}from"./vendor.1d39e390.js";const Go=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const n of s.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&o(n)}).observe(document,{childList:!0,subtree:!0});function i(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerpolicy&&(s.referrerPolicy=a.referrerpolicy),a.crossorigin==="use-credentials"?s.credentials="include":a.crossorigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(a){if(a.ep)return;a.ep=!0;const s=i(a);fetch(a.href,s)}};Go();class Xe{static createOffscreenCanvas(e,i){try{return new OffscreenCanvas(e,i)}catch{let a=document.createElement("canvas");return a.width=e,a.height=i,a}}}const ht=new Map;function Zo(t,e,i){return ht.get(`${t}_${e}_${i}`)}function Wo(){ht.clear()}function qe(t){var e;t.childrenCache&&(t.childrenCache.forEach(qe),t.childrenCache=null,t.nodesLoaded=0),((e=t.children)==null?void 0:e.length)>0&&(t.children.forEach(i=>i instanceof E&&qe(i)),t.children=[]),t.dispose()}const fe=class extends st{constructor(t=null,e=null,i=fe.root,o=0,a=0,s=0,n=null,r=null){super(n,r);this.mapView=null,this.parentNode=null,this.textureLoaded=!1,this.nodesLoaded=0,this.subdivided=!1,this.childrenCache=null,this.mapView=e,this.parentNode=t,this.location=i,this.level=o,this.x=a,this.y=s,ht.set(`${o}_${a}_${s}`,this);const l=e.nodeShouldAutoLoad();this.isMesh=!1,this.matrixAutoUpdate=!1,this.isTextureReady=l,this.objectsHolder=new co,this.objectsHolder.visible=!l,this.add(this.objectsHolder),l&&this.initialize()}initialize(){}dispose(){this.mapView.provider.cancelTile(this.level,this.x,this.y),this.geometry=null,this.material=null,this.objectsHolder=null,this.mapView=null,this.parentNode=null,ht.delete(`${this.level}_${this.x}_${this.y}`)}createChildNodes(){}subdivide(){const t=this.mapView,e=Math.min(t.provider.actualMaxZoom,t.heightProvider.actualMaxZoom);this.subdivided||this.level+1>e||(this.subdivided=!0,this.childrenCache!==null?(this.childrenCache.forEach(i=>{i instanceof fe&&(i.textureLoaded?i.show():i.hide())}),this.children=this.childrenCache,this.nodesLoaded>=fe.childrens&&this.hide()):this.createChildNodes())}simplify(t,e){var i,o,a,s;!this.subdivided||(this.subdivided=!1,this.mapView.lowMemoryUsage||t>e/100||((i=this.parentNode)==null?void 0:i.subdivided)&&((a=(o=this.parentNode)==null?void 0:o.parentNode)==null?void 0:a.subdivided)?(((s=this.children)==null?void 0:s.length)&&(this.children.forEach(n=>n instanceof fe&&qe(n)),this.children=[]),this.childrenCache&&(this.childrenCache.forEach(n=>n instanceof fe&&qe(n)),this.childrenCache=null,this.nodesLoaded=0)):(this.childrenCache=this.children,this.childrenCache&&this.childrenCache.forEach(n=>{n.childrenCache&&n.children.length>1&&(n.childrenCache=null,n.nodesLoaded=0)})),this.show(),this.didSimplify())}didSimplify(){this.children=[this.objectsHolder]}show(){this.isMesh=!0,this.objectsHolder.visible=!0}isVisible(){return this.isMesh}hide(){this.isMesh=!1,this.objectsHolder.visible=!1}onTextureImage(t){if(t){const e=new K(t);e.generateMipmaps=!1,e.format=nt,e.magFilter=de,e.minFilter=de,e.needsUpdate=!0,this.material.map=e}}setMaterialValues(t){const e=this.material.userData;Object.keys(t).forEach(i=>{e.hasOwnProperty(i)&&(e[i].value=t[i])})}loadTexture(){if(!this.isTextureReady)return this.isTextureReady=!0,this.mapView.provider.fetchTile(this.level,this.x,this.y).then(t=>this.onTextureImage(t)).catch(()=>{const t=Xe.createOffscreenCanvas(1,1),e=t.getContext("2d");e.fillStyle="#FF0000",e.fillRect(0,0,1,1);const i=new K(t);i.generateMipmaps=!1,i.needsUpdate=!0,this.material.map=i}).catch(t=>{console.error("error fetching image",t)}).finally(()=>{!this.mapView||(this.textureLoaded=!0,this.nodeReady())})}nodeReady(){this.subdivided||this.show();const t=this.parentNode;t!==null?(t.nodesLoaded++,t.nodesLoaded>=fe.childrens&&(t.children.forEach((e,i)=>{e instanceof fe&&(e.subdivided?e.hide():e.show())}),t.subdivided===!0&&t.hide())):this.subdivided||this.show(),this.mapView.onNodeReady(this)}getNeighborsDirection(t){return null}getNeighbors(){return[]}};let E=fe;E.baseGeometry=null;E.baseScale=null;E.childrens=4;E.root=-1;E.topLeft=0;E.topRight=1;E.bottomLeft=2;E.bottomRight=3;class J extends je{constructor(e=1,i=1,o=1,a=1,s={skirt:!1,skirtDepth:10,uvs:!0}){super();const n=[],r=[],l=s.uvs?[]:void 0;J.buildPlane(e,i,o,a,n,r,l),s.skirt&&J.buildSkirt(e,i,o,a,s.skirtDepth,n,r,l),this.setIndex(n),this.setAttribute("position",new X(r,3)),s.uvs&&this.setAttribute("uv",new X(l,2))}static buildPlane(e=1,i=1,o=1,a=1,s,n,r){const l=e/2,c=i/2,h=o+1,m=a+1,u=e/o,w=i/a;for(let x=0;x<m;x++){const g=x*w-c;for(let b=0;b<h;b++){const f=b*u-l;n.push(f,0,g),r&&r.push(b/o,1-x/a)}}for(let x=0;x<a;x++)for(let g=0;g<o;g++){const b=g+h*x,f=g+h*(x+1),p=g+1+h*(x+1),v=g+1+h*x;s.push(b,f,v,f,p,v)}}static buildSkirt(e=1,i=1,o=1,a=1,s,n,r,l){const c=e/2,h=i/2,m=o+1,u=a+1,w=e/o,x=i/a;let g=r.length/3;for(let f=0;f<m;f++){const p=f*w-c,v=-h;r.push(p,-s,v),l&&l.push(f/o,1)}for(let f=0;f<o;f++){const p=f,v=f+1,T=f+g,y=f+g+1;n.push(v,T,p,v,y,T)}g=r.length/3;for(let f=0;f<m;f++){const p=f*w-c,v=a*x-h;r.push(p,-s,v),l&&l.push(f/o,0)}let b=m*u-o-1;for(let f=0;f<o;f++){const p=b+f,v=b+f+1,T=f+g,y=f+g+1;n.push(p,T,v,T,y,v)}g=r.length/3;for(let f=0;f<u;f++){const p=f*x-h,v=-c;r.push(v,-s,p),l&&l.push(0,1-f/a)}for(let f=0;f<a;f++){const p=f*u,v=(f+1)*u,T=f+g,y=f+g+1;n.push(p,T,v,T,y,v)}g=r.length/3;for(let f=0;f<u;f++){const p=f*x-h,v=o*w-c;r.push(v,-s,p),l&&l.push(1,1-f/a)}for(let f=0;f<a;f++){const p=f*u+a,v=(f+1)*u+a,T=f+g,y=f+g+1;n.push(v,T,p,v,y,T)}}}const Me=class{static get(t,e){navigator.geolocation.getCurrentPosition(function(i){t(i.coords,i.timestamp)},e)}static datumsToSpherical(t,e,i,o=1){const a=e*Me.EARTH_ORIGIN/180;let s=Math.log(Math.tan((90+t)*Math.PI/360))/(Math.PI/180);return s=s*Me.EARTH_ORIGIN/180,i?i.set(a*o,s*o):new xe(a*o,s*o)}static sphericalToDatums(t,e){const i=t/Me.EARTH_ORIGIN*180;let o=e/Me.EARTH_ORIGIN*180;return o=180/Math.PI*(2*Math.atan(Math.exp(o*Math.PI/180))-Math.PI/2),{lat:Math.round(o*1e4)/1e4,lon:Math.round(i*1e4)/1e4}}static quadtreeToDatums(t,e,i){const o=Math.pow(2,t),a=e/o*360-180,s=Math.atan(Math.sinh(Math.PI*(1-2*i/o)));return{lat:180*(s/Math.PI),lon:a}}};let S=Me;S.EARTH_RADIUS=6378137;S.EARTH_PERIMETER=2*Math.PI*Me.EARTH_RADIUS;S.EARTH_ORIGIN=Me.EARTH_PERIMETER/2;const Nt=class extends E{constructor(t=null,e=null,i=E.root,o=0,a=0,s=0){super(t,e,i,o,a,s,Nt.geometry,new zt({wireframe:!1}));this.matrixAutoUpdate=!1}initialize(){return this.loadTexture()}createChildNodes(){const t=this.level+1,e=this.x*2,i=this.y*2,o=Object.getPrototypeOf(this).constructor;let a=new o(this,this.mapView,E.topLeft,t,e,i);a.scale.set(.5,1,.5),a.position.set(-.25,0,-.25),this.add(a),a.updateMatrix(),a.updateMatrixWorld(!0),a=new o(this,this.mapView,E.topRight,t,e+1,i),a.scale.set(.5,1,.5),a.position.set(.25,0,-.25),this.add(a),a.updateMatrix(),a.updateMatrixWorld(!0),a=new o(this,this.mapView,E.bottomLeft,t,e,i+1),a.scale.set(.5,1,.5),a.position.set(-.25,0,.25),this.add(a),a.updateMatrix(),a.updateMatrixWorld(!0),a=new o(this,this.mapView,E.bottomRight,t,e+1,i+1),a.scale.set(.5,1,.5),a.position.set(.25,0,.25),this.add(a),a.updateMatrix(),a.updateMatrixWorld(!0)}raycast(t,e){return this.isVisible()?super.raycast(t,e):!1}};let re=Nt;re.geometry=new J(1,1,1,1,{skirt:!1});re.baseGeometry=Nt.geometry;re.baseScale=new D(S.EARTH_PERIMETER,1,S.EARTH_PERIMETER);class jo extends je{constructor(e=1,i=1,o=1,a=1,s=!1,n=10,r=null,l=!0){super();const c=[],h=[],m=[],u=[];J.buildPlane(e,i,o,a,c,h,u);const w=r.data;for(let x=0,g=0;x<w.length&&g<h.length;x+=4,g+=3){const b=w[x],f=w[x+1],p=w[x+2],v=(b*65536+f*256+p)*.1-1e4;h[g+1]=v}s&&J.buildSkirt(e,i,o,a,n,c,h,u),this.setIndex(c),this.setAttribute("position",new X(h,3)),this.setAttribute("normal",new X(m,3)),this.setAttribute("uv",new X(u,2)),l&&this.computeNormals(o,a)}computeNormals(e,i){const o=this.getAttribute("position");if(o!==void 0){let a=this.getAttribute("normal");const s=i*e;for(let g=0;g<s;g++)a.setXYZ(g,0,0,0);const n=new D,r=new D,l=new D,c=new D,h=new D,m=new D,u=new D,w=new D,x=i*e*6;for(let g=0;g<x;g+=3){const b=this.index.getX(g+0),f=this.index.getX(g+1),p=this.index.getX(g+2);n.fromBufferAttribute(o,b),r.fromBufferAttribute(o,f),l.fromBufferAttribute(o,p),u.subVectors(l,r),w.subVectors(n,r),u.cross(w),c.fromBufferAttribute(a,b),h.fromBufferAttribute(a,f),m.fromBufferAttribute(a,p),c.add(u),h.add(u),m.add(u),a.setXYZ(b,c.x,c.y,c.z),a.setXYZ(f,h.x,h.y,h.z),a.setXYZ(p,m.x,m.y,m.z)}this.normalizeNormals(),a.needsUpdate=!0}}}const ae=class extends E{constructor(t=null,e=null,i=E.root,o=0,a=0,s=0,n=ae.geometry,r=new It({color:0,emissive:16777215})){super(t,e,i,o,a,s,n,r);this.heightLoaded=!1,this.heightListeners=[],this.matrixAutoUpdate=!1;const l=e.nodeShouldAutoLoad();this.isHeightReady=l}initialize(){return super.initialize(),Promise.all([this.loadTexture(),this.loadHeightGeometry()])}dispose(){this.mapView.heightProvider.cancelTile(this.level,this.x,this.y),super.dispose()}onTextureImage(t){if(t){const e=new K(t);e.generateMipmaps=!1,e.format=nt,e.magFilter=de,e.minFilter=de,e.needsUpdate=!0,this.material.map=e}}loadTexture(){if(!this.isTextureReady)return this.isTextureReady=!0,this.mapView.provider.fetchTile(this.level,this.x,this.y).then(t=>this.onTextureImage(t)).finally(()=>{this.textureLoaded=!0,this.nodeReady()})}nodeReady(){!this.mapView||!this.heightLoaded||!this.textureLoaded||super.nodeReady()}createChildNodes(){const t=this.level+1;var e=Object.getPrototypeOf(this);const i=this.x*2,o=this.y*2;let a=new e.constructor(this,this.mapView,E.topLeft,t,i,o);a.scale.set(.5,1,.5),a.position.set(-.25,0,-.25),this.add(a),a.updateMatrix(),a.updateMatrixWorld(!0),a=new e.constructor(this,this.mapView,E.topRight,t,i+1,o),a.scale.set(.5,1,.5),a.position.set(.25,0,-.25),this.add(a),a.updateMatrix(),a.updateMatrixWorld(!0),a=new e.constructor(this,this.mapView,E.bottomLeft,t,i,o+1),a.scale.set(.5,1,.5),a.position.set(-.25,0,.25),this.add(a),a.updateMatrix(),a.updateMatrixWorld(!0),a=new e.constructor(this,this.mapView,E.bottomRight,t,i+1,o+1),a.scale.set(.5,1,.5),a.position.set(.25,0,.25),this.add(a),a.updateMatrix(),a.updateMatrixWorld(!0)}async handleParentOverZoomTile(t){throw new Error("not implemented")}async loadHeightGeometry(){if(this.isHeightReady||!this.mapView)return;this.isHeightReady=!0;const t=this.mapView.heightProvider;if(t===null)throw new Error("GeoThree: MapView.heightProvider provider is null.");try{const e=this.level;if(e>t.maxZoom&&e<=t.maxZoom+t.maxOverZoom){const i=this.parentNode;if(i.heightLoaded)await this.handleParentOverZoomTile();else{const o=new Promise(a=>{i.heightListeners.push(()=>this.handleParentOverZoomTile(a))});i.isHeightReady||i.loadHeightGeometry(),await o}}else{const i=await this.mapView.heightProvider.fetchTile(e,this.x,this.y);await this.onHeightImage(i)}}finally{this.mapView&&(this.heightLoaded=!0,this.heightListeners.forEach(e=>e()),this.nodeReady()),this.heightListeners=[]}}onHeightImage(t){const e=Xe.createOffscreenCanvas(ae.geometrySize+1,ae.geometrySize+1),i=e.getContext("2d");i.imageSmoothingEnabled=!1,i.drawImage(t,0,0,ae.tileSize,ae.tileSize,0,0,e.width,e.height);const o=i.getImageData(0,0,e.width,e.height),a=new jo(1,1,ae.geometrySize,ae.geometrySize,!0,10,o,!0);this.geometry=a}raycast(t,e){return this.isVisible()?super.raycast(t,e):!1}};let Y=ae;Y.tileSize=256;Y.geometrySize=16;Y.geometry=new J(1,1,ae.geometrySize,ae.geometrySize);Y.baseGeometry=re.geometry;Y.BASE_SCALE=new D(S.EARTH_PERIMETER,1,S.EARTH_PERIMETER);const bi=new rt,Ti=new D,Ht=new ho,Ft=new D;class $o{constructor(){this.subdivideDistance=120,this.simplifyDistance=400,this.testCenter=!0,this.pointOnly=!1,this.toHandle=new Set,this.handled=new Set}isChildReady(e){return e.isTextureReady&&(!(e instanceof Y)||e.isHeightReady)}handleNode(e,i,o,a,s,n=!1,r=!0,l=!0){if(!(e instanceof E)||i.has(e)||!e.mapView)return;i.add(e),e.getWorldPosition(Ft);var c=Ti.distanceTo(Ft);const h=c/Math.pow(2,20-e.level);if(n=n||(this.pointOnly?Ht.containsPoint(Ft):Ht.intersectsObject(e)),r&&s>e.level&&h<this.subdivideDistance&&n){e.subdivide();const m=e.children;if(m)for(let u=0;u<m.length;u++){const w=m[u];w instanceof E&&this.handleNode(w,i,o,a,s,!1,!0,!1)}e.hide()}else if(l&&(e.level>s||(!n||a<e.level)&&h>this.simplifyDistance)&&e.parentNode){const m=e.parentNode;m.simplify(h,o.far),this.handleNode(m,i,o,a,s,!1,!1,!0)}else(!l&&!r||n||h<this.simplifyDistance)&&a<=e.level&&c<o.far&&(this.isChildReady(e)||e.initialize())}getChildrenToTraverse(e){const i=this.toHandle;i.clear();function o(a){a instanceof E&&!a.subdivided?i.add(a):a.children.forEach(s=>{a instanceof E&&o(s)})}return o(e),i}updateLOD(e,i,o,a,s=!1){if(!s&&this.lastMatrix&&this.lastMatrix.equals(i.matrixWorldInverse))return;this.lastMatrix||(this.lastMatrix=new rt),this.lastMatrix.copy(i.matrixWorldInverse),bi.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),Ht.setFromProjectionMatrix(bi),i.getWorldPosition(Ti);const n=e.provider.minZoom,r=e.provider.maxZoom+e.provider.maxOverZoom,l=this.getChildrenToTraverse(e.children[0]);let c=this.handled;l.forEach(h=>this.handleNode(h,c,i,n,r)),c.clear()}}class ye{constructor(e,i){this.fulfilled=!1,this.rejected=!1,this.called=!1,this.cancelRunner=i;const o=s=>{this.fulfilled=!0,this.value=s,typeof this.onResolve=="function"&&(this.onResolve(this.value),this.called=!0)},a=this.rejectHandler=s=>{this.rejected=!0,this.value=s,typeof this.onReject=="function"&&(this.onReject(this.value),this.called=!0)};try{e(o,a)}catch(s){a(s)}}cancel(){return this.cancelRunner?(this.cancelRunner()||this.rejectHandler("cancelled"),!0):!1}then(e){return this.onResolve=e,this.fulfilled&&!this.called&&(this.called=!0,this.onResolve(this.value)),this}catch(e){return this.onReject=e,this.rejected&&!this.called&&(this.called=!0,this.onReject(this.value)),this}finally(e){return this}static resolve(e){return new ye(function(o,a){o(e)})}static reject(e){return new ye(function(o,a){a(e)})}static all(e){const i=[],o=[];function a(s,n){e.forEach((r,l)=>r.then(c=>{if(i.push(!0),o[l]=c,i.length===e.length)return s(o)}).catch(c=>n(c)))}return new ye(a)}}class Xo{constructor(){this.values=new Map,this.maxEntries=20}get(e){const i=this.values.has(e);let o;return i&&(o=this.values.get(e),this.values.delete(e),this.values.set(e,o)),o}put(e,i){if(this.values.size>=this.maxEntries){const o=this.values.keys().next().value;this.values.delete(o)}this.values.set(e,i)}}class qo{constructor(e,i,o){this.abortController=new AbortController,this.load(e,i,o),this.url=e.url}async load(e,i,o){try{const a=dt[e.url],s=a.fetchOptions;s.signal=this.abortController.signal;const n=await fetch(e.url,s);let r;switch((s==null?void 0:s.output)||"arraybuffer"){case"json":r=await n.json();break;case"blob":r=await n.blob();break;case"text":r=await n.text();break;case"imageBitmap":{const l=await n.blob();r=await createImageBitmap(l,a);break}default:r=await n.arrayBuffer();break}i(r),delete dt[e.url]}catch(a){o(a),delete dt[e.url]}}cancel(){this.abortController.abort()}}const dt={},Ei=new uo(qo,50);class Di{constructor(e={}){this.cache=new Xo,this.options=e}async load(e,i){e===void 0&&(e="");const o=this.cache.get(e);if(o!==void 0)return o;const a=oe({},this.options);return a.fetchOptions=oe(oe({},a.fetchOptions||{}),i||{}),dt[e]=a,new Promise((s,n)=>{Ei.add(e,function(r,l){l instanceof Error?n(l):s(l)},n)}).then(s=>(s&&this.cache.put(e,s),s))}cancel(e){Ei.cancel(e)}}class Yo extends Di{constructor(e={}){super(oe({premultiplyAlpha:"none",colorSpaceConversion:"none"},e));this.options.fetchOptions=this.options.fetchOptions||{},this.options.fetchOptions.output||(this.options.fetchOptions.output="imageBitmap")}}let Bt={},Vt={};function Pi(t){const e=JSON.stringify(t||{});return Bt[e]||(Bt[e]=new Yo(t)),Bt[e]}function Ko(t){const e=JSON.stringify(t||{});return Vt[e]||(Vt[e]=new Di(t)),Vt[e]}class Ut{constructor(){this.name="",this.minZoom=0,this.maxZoom=20,this.maxOverZoom=0,this.zoomDelta=0,this.minLevelForZoomDelta=0,this.bounds=[],this.center=[],this.fetchingTilesPromises=new Map}get actualMaxZoom(){return this.maxZoom+this.maxOverZoom}fetchImage(e,i,o){return null}getMetaData(){}async fetchTileImage(e,i,o){const a=`${e}_${i}_${o}`,s=this.fetchingTilesPromises[a]=this.fetchImage(e,i,o);this.fetchingTilesPromises[a]=s;try{return await s}finally{delete this.fetchingTilesPromises[a]}}cancelTile(e,i,o){const a=`${e}_${i}_${o}`,s=this.fetchingTilesPromises[a];s&&(s.cancel(),delete this.fetchingTilesPromises[a])}async fetchTile(e,i,o){return this.fetchTileImage(e,i,o)}}const Jo=Pi({imageOrientation:"flipY",fetchOptions:{credentials:"same-origin"}});function Li(t,e){if(t[0][2]===e)return t;if(t[0][2]<e){var i=[];return t.forEach(function(o){i=i.concat(q.getChildren(o))}),Li(i,e)}else{var t=t.map(function(a){const s=q.tileToBBOX(a);return q.pointToTile(s[0]+(s[2]-s[0])/2,s[1]+(s[3]-s[1])/2,e)});return t}}function Qo(t,e){var i=Li(t,e);return i}class Ri extends Ut{constructor(e){super();this.address=e}getImageBitmapLoader(){return Jo}async fetchTileImage(e,i,o){const a=`${e}_${i}_${o}`;let s;if(this.zoomDelta<=0||this.minLevelForZoomDelta>e)s=this.fetchingTilesPromises[a]=this.fetchImage(e,i,o);else{const n=Qo([[i,o,e]],e+this.zoomDelta).sort((l,c)=>c[1]-l[1]||l[0]-c[0]);let r;s=new ye((l,c)=>{Promise.all(r=n.map(h=>this.fetchImage(h[2],h[0],h[1]))).then(h=>{try{if(r=null,h=h.filter(T=>Boolean(T)),!h||!h.length)return l(null);const u=h[0].width*Math.floor(this.zoomDelta*2),w=u/Math.sqrt(h.length),x=Xe.createOffscreenCanvas(u,u);var m=x.getContext("2d");let g=n[0][1],b=0,f=0,p,v;h.forEach((T,y)=>{g!==n[y][1]&&(g=n[y][1],b=0,f+=1),p=b*w,v=f*w,m.save(),m.drawImage(T,p,v,w,w),m.restore(),b+=1}),l(createImageBitmap(x))}catch(u){c(u)}}).catch(function(h){r=null,c(h)})},function(){return r&&(r.forEach(l=>l.cancel()),r=null),!0})}this.fetchingTilesPromises[a]=s;try{return await s}finally{delete this.fetchingTilesPromises[a]}}fetchImage(e,i,o){const a=this.buildURL(e,i,o);return new ye(async(s,n)=>{try{const r=await this.getImageBitmapLoader().load(a);s(r)}catch(r){console.log("catched error",r),n(r)}},()=>(this.getImageBitmapLoader().cancel(a),!0))}}class Si extends Ri{constructor(e="https://a.tile.openstreetmap.org/"){super(e);this.format="png"}buildURL(e,i,o){return this.address+e+"/"+i+"/"+o+"."+this.format}}class Ci extends je{constructor(e,i,o,a,s,n,r){super();const l=n+r;let c=0;const h=[],m=new D,u=new D,w=[],x=[],g=[],b=[];for(let f=0;f<=o;f++){const p=[],v=f/o;for(let T=0;T<=i;T++){const y=T/i;m.x=-e*Math.cos(a+y*s)*Math.sin(n+v*r),m.y=e*Math.cos(n+v*r),m.z=e*Math.sin(a+y*s)*Math.sin(n+v*r),x.push(m.x,m.y,m.z),u.set(m.x,m.y,m.z).normalize(),g.push(u.x,u.y,u.z),b.push(y,1-v),p.push(c++)}h.push(p)}for(let f=0;f<o;f++)for(let p=0;p<i;p++){const v=h[f][p+1],T=h[f][p],y=h[f+1][p],we=h[f+1][p+1];(f!==0||n>0)&&w.push(v,T,we),(f!==o-1||l<Math.PI)&&w.push(T,y,we)}this.setIndex(w),this.setAttribute("position",new X(x,3)),this.setAttribute("normal",new X(g,3)),this.setAttribute("uv",new X(b,2))}}const kt=class extends E{constructor(t=null,e=null,i=E.root,o=0,a=0,s=0){super(t,e,i,o,a,s,kt.createGeometry(o,a,s),new zt({wireframe:!1}));this.applyScaleNode(),this.matrixAutoUpdate=!1}initialize(){return this.loadTexture()}static createGeometry(t,e,i){const o=Math.pow(2,t),a=40,s=Math.floor(kt.segments*(a/(t+1))/a),n=1/o*2*Math.PI,r=e*n,l=1/o*Math.PI,c=i*l;return new Ci(1,s,s,r,n,c,l)}applyScaleNode(){this.geometry.computeBoundingBox();const e=this.geometry.boundingBox.clone().getCenter(new D),i=new rt;i.compose(new D(-e.x,-e.y,-e.z),new Oe,new D(S.EARTH_RADIUS,S.EARTH_RADIUS,S.EARTH_RADIUS)),this.geometry.applyMatrix4(i),this.position.copy(e),this.updateMatrix(),this.updateMatrixWorld()}updateMatrix(){this.matrix.setPosition(this.position),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t=!1){(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorld.copy(this.matrix),this.matrixWorldNeedsUpdate=!1)}createChildNodes(){const t=this.level+1,e=this.x*2,i=this.y*2,o=Object.getPrototypeOf(this).constructor;let a=new o(this,this.mapView,E.topLeft,t,e,i);this.add(a),a.updateMatrix(),a.updateMatrixWorld(!0),a=new o(this,this.mapView,E.topRight,t,e+1,i),this.add(a),a.updateMatrix(),a.updateMatrixWorld(!0),a=new o(this,this.mapView,E.bottomLeft,t,e,i+1),this.add(a),a.updateMatrix(),a.updateMatrixWorld(!0),a=new o(this,this.mapView,E.bottomRight,t,e+1,i+1),this.add(a),a.updateMatrix(),a.updateMatrixWorld(!0)}raycast(t,e){return this.isVisible()?super.raycast(t,e):!1}};let ut=kt;ut.baseGeometry=new Ci(S.EARTH_RADIUS,64,64,0,2*Math.PI,0,Math.PI);ut.baseScale=new D(1,1,1);ut.segments=80;const be=class extends Y{constructor(t=null,e=null,i=E.root,o=0,a=0,s=0){super(t,e,i,o,a,s,be.geometry,be.prepareMaterial(new It({map:be.EMPTY_TEXTURE})));this.heightMapLocation=[0,0,1,1],this.overZoomFactor=1,this.frustumCulled=!1}static prepareMaterial(t){return t.userData={heightMap:{value:be.EMPTY_TEXTURE},elevationDecoder:{value:be.ELEVATION_DECODER},heightMapLocation:{value:new lt}},t.onBeforeCompile=e=>{for(const i in t.userData)e.uniforms[i]=t.userData[i];e.vertexShader=`
			uniform sampler2D heightMap;
			uniform vec4 heightMapLocation;
			uniform vec4 elevationDecoder;
			float getPixelElevation(vec4 e) {
				// Convert encoded elevation value to meters
				return ((e.r * elevationDecoder.x + e.g * elevationDecoder.y  + e.b * elevationDecoder.z) + elevationDecoder.w) * exageration;
			}
			float getElevation(vec2 coord) {
				vec4 e = texture2D(heightMap, coord * heightMapLocation.zw + heightMapLocation.xy);
				return getPixelElevation(e);
			}
			`+e.vertexShader,e.vertexShader=e.vertexShader.replace("#include <fog_vertex>",`
			#include <fog_vertex>
	
			// Calculate height of the title
			float _height = getElevation(vUv);
			vec3 _transformed = position + _height * normal;
	
			// Vertex position based on height
			gl_Position = projectionMatrix * modelViewMatrix * vec4(_transformed, 1.0);
			`)},t}onHeightImage(t){if(t){const e=new K(t);e.generateMipmaps=!1,e.format=nt,e.magFilter=Ae,e.minFilter=Ae,e.needsUpdate=!0,this.material.userData.heightMap.value=e}}async handleParentOverZoomTile(t){const e=q.tileToBBOX([this.x,this.y,this.level]),i=this.parent,o=i.overZoomFactor,a=q.tileToBBOX([i.x,i.y,i.level]),s=a[2]-a[0],n=a[3]-a[1];this.overZoomFactor=o*2,this.heightMapLocation[0]=i.heightMapLocation[0]+Math.floor((e[0]-a[0])/s*10)/10/o,this.heightMapLocation[1]=i.heightMapLocation[1]+Math.floor((e[1]-a[1])/n*10)/10/o,this.heightMapLocation[2]=this.heightMapLocation[3]=1/this.overZoomFactor,this.material.userData.heightMapLocation.value.set(...this.heightMapLocation),await this.onHeightImage(i.material.userData.heightMap.value),t&&t()}raycast(t,e){if(this.isVisible()){this.geometry=re.geometry;const i=super.raycast(t,e);return this.geometry=be.geometry,i}return!1}};let Te=be;Te.ELEVATION_DECODER=[6553.6*255,25.6*255,.1*255,-1e4];Te.EMPTY_TEXTURE=new K;Te.geometrySize=256;Te.geometry=new J(1,1,Y.geometrySize,Y.geometrySize);Te.baseGeometry=re.geometry;Te.baseScale=new D(S.EARTH_PERIMETER,1,S.EARTH_PERIMETER);class ea{constructor(){this.subdivisionRays=1,this.thresholdUp=.6,this.thresholdDown=.15,this.raycaster=new gi,this.mouse=new xe,this.powerDistance=!1,this.scaleDistance=!0}updateLOD(e,i,o,a){const s=[];for(let n=0;n<this.subdivisionRays;n++)this.mouse.set(Math.random()*2-1,Math.random()*2-1),this.raycaster.setFromCamera(this.mouse,i),this.raycaster.intersectObjects(e.children,!0,s);for(let n=0;n<s.length;n++){const r=s[n].object;let l=s[n].distance;if(this.powerDistance&&(l=Math.pow(l*2,r.level)),this.scaleDistance){const c=r.matrixWorld.elements;l=new D(c[0],c[1],c[2]).length()/l}if(l>this.thresholdUp){r.subdivide();return}else if(l<this.thresholdDown&&r.parentNode!==null){r.parentNode.simplify();return}}}}class ta{constructor(e=257){this.gridSize=e;const i=e-1;if(i&i-1)throw new Error(`Expected grid size to be 2^n+1, got ${e}.`);this.numTriangles=i*i*2-2,this.numParentTriangles=this.numTriangles-i*i,this.indices=new Uint32Array(this.gridSize*this.gridSize),this.coords=new Uint16Array(this.numTriangles*4);for(let o=0;o<this.numTriangles;o++){let a=o+2,s=0,n=0,r=0,l=0,c=0,h=0;for(a&1?r=l=c=i:s=n=h=i;(a>>=1)>1;){const u=s+r>>1,w=n+l>>1;a&1?(r=s,l=n,s=c,n=h):(s=r,n=l,r=c,l=h),c=u,h=w}const m=o*4;this.coords[m+0]=s,this.coords[m+1]=n,this.coords[m+2]=r,this.coords[m+3]=l}}createTile(e){return new ia(e,this)}}class ia{constructor(e,i){const o=i.gridSize;if(e.length!==o*o)throw new Error(`Expected terrain data of length ${o*o} (${o} x ${o}), got ${e.length}.`);this.terrain=e,this.martini=i,this.errors=new Float32Array(e.length),this.update()}update(){const{numTriangles:e,numParentTriangles:i,coords:o,gridSize:a}=this.martini,{terrain:s,errors:n}=this;for(let r=e-1;r>=0;r--){const l=r*4,c=o[l+0],h=o[l+1],m=o[l+2],u=o[l+3],w=c+m>>1,x=h+u>>1,g=w+x-h,b=x+c-w,f=(s[h*a+c]+s[u*a+m])/2,p=x*a+w,v=Math.abs(f-s[p]);if(n[p]=Math.max(n[p],v),r<i){const T=(h+b>>1)*a+(c+g>>1),y=(u+b>>1)*a+(m+g>>1);n[p]=Math.max(n[p],n[T],n[y])}}}getMesh(e=0,i=!1){const{gridSize:o,indices:a}=this.martini,{errors:s}=this;let n=0,r=0;const l=o-1;let c,h,m=0;const u=[],w=[],x=[],g=[];a.fill(0);function b(U,B,z,N,k,Z){const te=U+z>>1,ie=B+N>>1;Math.abs(U-k)+Math.abs(B-Z)>1&&s[ie*o+te]>e?(b(k,Z,U,B,te,ie),b(z,N,k,Z,te,ie)):(c=B*o+U,h=N*o+z,m=Z*o+k,a[c]===0&&(i&&(U===0?u.push(n):U===l&&w.push(n),B===0?x.push(n):B===l&&g.push(n)),a[c]=++n),a[h]===0&&(i&&(z===0?u.push(n):z===l&&w.push(n),N===0?x.push(n):N===l&&g.push(n)),a[h]=++n),a[m]===0&&(i&&(k===0?u.push(n):k===l&&w.push(n),Z===0?x.push(n):Z===l&&g.push(n)),a[m]=++n),r++)}b(0,0,l,l,l,0),b(l,l,0,0,0,l);let f=n*2,p=r*3;i&&(f+=(u.length+w.length+x.length+g.length)*2,p+=((u.length-1)*2+(w.length-1)*2+(x.length-1)*2+(g.length-1)*2)*3);const v=new Uint16Array(f),T=new Uint32Array(p);let y=0;function we(U,B,z,N,k,Z){const te=U+z>>1,ie=B+N>>1;if(Math.abs(U-k)+Math.abs(B-Z)>1&&s[ie*o+te]>e)we(k,Z,U,B,te,ie),we(z,N,k,Z,te,ie);else{const Ze=a[B*o+U]-1,Ot=a[N*o+z]-1,At=a[Z*o+k]-1;v[2*Ze]=U,v[2*Ze+1]=B,v[2*Ot]=z,v[2*Ot+1]=N,v[2*At]=k,v[2*At+1]=Z,T[y++]=Ze,T[y++]=Ot,T[y++]=At}}if(we(0,0,l,l,l,0),we(l,l,0,0,0,l),i){let U=function(z){const N=z.length;for(let k=0;k<N-1;k++){const Z=z[k],te=z[k+1],ie=B/2,Ze=(B+2)/2;v[B++]=v[2*Z],v[B++]=v[2*Z+1],T[y++]=Z,T[y++]=ie,T[y++]=te,T[y++]=ie,T[y++]=Ze,T[y++]=te}v[B++]=v[2*z[N-1]],v[B++]=v[2*z[N-1]+1]};u.sort((z,N)=>v[2*z+1]-v[2*N+1]),w.sort((z,N)=>v[2*N+1]-v[2*z+1]),x.sort((z,N)=>v[2*N]-v[2*z]),g.sort((z,N)=>v[2*z]-v[2*N]);let B=n*2;U(u),U(w),U(x),U(g)}return{vertices:v,triangles:T,numVerticesWithoutSkirts:n}}}const Ee=class extends Y{constructor(t=null,e=null,i=E.root,o=0,a=0,s=0,{elevationDecoder:n=[256*255,255,1/256*255,-32768],meshMaxError:r=50,exageration:l=1}={}){super(t,e,i,o,a,s,Ee.geometry,Ee.prepareMaterial(new It({map:Ee.emptyTexture,color:16777215,side:fo}),o,l));this.elevationDecoder=[256*255,255,1/256*255,-32768],this.exageration=1,this.meshMaxError=10,this.meshMaxError=t?t.meshMaxError:r,this.exageration=t?t.exageration:l,this.elevationDecoder=t?t.elevationDecoder:n,this.frustumCulled=!1}static prepareMaterial(t,e,i=1){return t.userData={heightMap:{value:Ee.emptyTexture},drawNormals:{value:0},drawBlack:{value:0},zoomlevel:{value:e},computeNormals:{value:1},drawTexture:{value:1}},t.onBeforeCompile=o=>{for(let a in t.userData)o.uniforms[a]=t.userData[a];o.vertexShader=`
				uniform bool computeNormals;
				uniform float zoomlevel;
				uniform sampler2D heightMap;
				`+o.vertexShader,o.fragmentShader=`
				uniform bool drawNormals;
				uniform bool drawTexture;
				uniform bool drawBlack;
				`+o.fragmentShader,o.fragmentShader=o.fragmentShader.replace("#include <dithering_fragment>",`
				if(drawBlack) {
					gl_FragColor = vec4( 0.0,0.0,0.0, 1.0 );
				} else if(drawNormals) {
					gl_FragColor = vec4( ( 0.5 * vNormal + 0.5 ), 1.0 );
				} else if (!drawTexture) {
					gl_FragColor = vec4( 0.0,0.0,0.0, 0.0 );
				}`),o.vertexShader=o.vertexShader.replace("#include <fog_vertex>",`
				#include <fog_vertex>

				// queried pixels:
				// +-----------+
				// |   |   |   |
				// | a | b | c |
				// |   |   |   |
				// +-----------+
				// |   |   |   |
				// | d | e | f |
				// |   |   |   |
				// +-----------+
				// |   |   |   |
				// | g | h | i |
				// |   |   |   |
				// +-----------+

					// if (computeNormals) {
					// 	float e = getElevation(vUv, 0.0);
					// 	ivec2 size = textureSize(heightMap, 0);
					// 	float offset = 1.0 / float(size.x);
					// 	float a = getElevation(vUv + vec2(-offset, -offset), 0.0);
					// 	float b = getElevation(vUv + vec2(0, -offset), 0.0);
					// 	float c = getElevation(vUv + vec2(offset, -offset), 0.0);
					// 	float d = getElevation(vUv + vec2(-offset, 0), 0.0);
					// 	float f = getElevation(vUv + vec2(offset, 0), 0.0);
					// 	float g = getElevation(vUv + vec2(-offset, offset), 0.0);
					// 	float h = getElevation(vUv + vec2(0, offset), 0.0);
					// 	float i = getElevation(vUv + vec2(offset,offset), 0.0);


					// 	float normalLength = 500.0 / zoomlevel;

					// 	vec3 v0 = vec3(0.0, 0.0, 0.0);
					// 	vec3 v1 = vec3(0.0, normalLength, 0.0);
					// 	vec3 v2 = vec3(normalLength, 0.0, 0.0);
					// 	v0.z = (e + d + g + h) / 4.0;
					// 	v1.z = (e+ b + a + d) / 4.0;
					// 	v2.z = (e+ h + i + f) / 4.0;
					// 	vNormal = (normalize(cross(v2 - v0, v1 - v0))).rbg;
					// }
				`)},t}static getTerrain(t,e,i){const o=e+1,a=new Float32Array(o*o);for(let s=0,n=0;n<e;n++)for(let r=0;r<e;r++,s++){const l=s*4,c=t[l+0],h=t[l+1],m=t[l+2];a[s+n]=c*i[0]/255+h*i[1]/255+m*i[2]/255+i[3]}for(let s=o*(o-1),n=0;n<o-1;n++,s++)a[s]=a[s-o];for(let s=o-1,n=0;n<o;n++,s+=o)a[s]=a[s-1];return a}static getMeshAttributes(t,e,i,o,a){const s=i+1,n=t.length/2,r=new Float32Array(n*3),l=new Float32Array(n*2),[c,h,m,u]=o||[0,0,i,i],w=(m-c)/i,x=(u-h)/i;for(let g=0;g<n;g++){const b=t[g*2],f=t[g*2+1],p=f*s+b;r[3*g+0]=b*w+c,r[3*g+1]=-e[p]*a,r[3*g+2]=-f*x+u,l[2*g+0]=b/i,l[2*g+1]=f/i}return{position:{value:r,size:3},uv:{value:l,size:2}}}async onHeightImage(t){if(t){const n=t.width,r=n+1;var e=Xe.createOffscreenCanvas(n,n),i=e.getContext("2d");i.imageSmoothingEnabled=!1,i.drawImage(t,0,0,n,n,0,0,e.width,e.height);var o=i.getImageData(0,0,e.width,e.height),a=o.data;const l=Ee.getTerrain(a,n,this.elevationDecoder),h=new ta(r).createTile(l),{vertices:m,triangles:u}=h.getMesh(typeof this.meshMaxError=="function"?this.meshMaxError(this.level):this.meshMaxError,!1),w=Ee.getMeshAttributes(m,l,n,[-.5,-.5,.5,.5],this.exageration);this.geometry=new je,this.geometry.setIndex(new mo(u,1)),this.geometry.setAttribute("position",new X(w.position.value,w.position.size)),this.geometry.setAttribute("uv",new X(w.uv.value,w.uv.size)),this.geometry.rotateX(Math.PI);var s=new K(t);s.generateMipmaps=!1,s.format=nt,s.magFilter=Ae,s.minFilter=Ae,s.needsUpdate=!0,this.material.userData.heightMap.value=s}}loadHeightGeometry(){if(this.mapView.heightProvider===null)throw new Error("GeoThree: MapView.heightProvider provider is null.");return this.mapView.heightProvider.fetchTile(this.level,this.x,this.y).then(async t=>this.onHeightImage(t)).finally(()=>{this.heightLoaded=!0,this.nodeReady()})}};let Ie=Ee;Ie.geometrySize=16;Ie.emptyTexture=new K;Ie.geometry=new J(1,1,1,1);Ie.tileSize=256;Ie.baseScale=new D(S.EARTH_PERIMETER,1,S.EARTH_PERIMETER);const le=class extends st{constructor(t=le.PLANAR,e=new Si,i=null,o=!1,a){super(void 0,new zt({transparent:!0,opacity:0}));this.lod=null,this.provider=null,this.heightProvider=null,this.root=null,this.onNodeReady=null,this.lowMemoryUsage=!1,this.maxZoomForObjectHolders=14,Wo(),this.lod=new ea,this.provider=e,this.heightProvider=i,this.nodeAutoLoad=o,a?this.onNodeReady=a:this.onBeforeRender=(s,n,r,l,c,h)=>{this.lod.updateLOD(this,r,s,n)},this.setRoot(t)}nodeShouldAutoLoad(){return this.nodeAutoLoad}setRoot(t){if(typeof t=="number"){if(!le.mapModes.has(t))throw new Error("Map mode "+t+" does is not registered.");const e=le.mapModes.get(t);t=new e(null,this)}this.root!==null&&(this.remove(this.root),this.root=null),this.root=t,this.root!==null&&(this.geometry=this.root.constructor.baseGeometry,this.scale.copy(this.root.constructor.baseScale),this.root.mapView=this,this.add(this.root))}setProvider(t){t!==this.provider&&(this.provider=t,this.clear())}setHeightProvider(t){t!==this.heightProvider&&(this.heightProvider=t,this.clear())}clear(){return this.traverseVisible(function(t){t.childrenCache&&(t.childrenCache=null),t.initialize&&t.initialize()}),this}getMetaData(){this.provider.getMetaData()}raycast(t,e){return!1}};let De=le;De.PLANAR=200;De.SPHERICAL=201;De.HEIGHT=202;De.HEIGHT_SHADER=203;De.MARTINI=204;De.mapModes=new Map([[le.PLANAR,re],[le.SPHERICAL,ut],[le.HEIGHT,Y],[le.HEIGHT_SHADER,Te],[le.MARTINI,Ie]]);class oa extends Ut{constructor(){super(...arguments);this.resolution=256}fetchImage(e,i,o){return new ye((a,s)=>{const n=Xe.createOffscreenCanvas(this.resolution,this.resolution),r=n.getContext("2d"),l=new $e(65280),c=new $e(16711680),h=l.lerpHSL(c,(e-this.minZoom)/(this.maxZoom-this.minZoom));r.fillStyle=h.getStyle(),r.fillRect(0,0,this.resolution,this.resolution),r.fillStyle="#000000",r.textAlign="center",r.textBaseline="middle",r.font="bold "+this.resolution*.1+"px arial",r.fillText("("+e+")",this.resolution/2,this.resolution*.4),r.fillText("("+i+", "+o+")",this.resolution/2,this.resolution*.6),a(n)})}}class aa extends Ut{constructor(){super();this.name="local",this.minZoom=0,this.maxZoom=20}fetchTile(e,i,o){return Promise.resolve(null)}cancelTile(e,i,o){}}const _i=Ko({fetchOptions:{credentials:"same-origin"}}),sa=Pi({imageOrientation:"flipY",fetchOptions:{credentials:"same-origin"}}),Gt="192.168.1.51";class na extends Ri{constructor(e=!1){super();this.name="local",this.local=e,this.terrarium=!e,this.minZoom=5,this.maxZoom=e?12:15}buildURL(e,i,o){return this.local?`https://${Gt}/data/elevation_25m/${e}/${i}/${o}.webp`:`https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${e}/${i}/${o}.png`}buildPeaksURL(e,i,o){return this.local?`https://${Gt}/data/full/${e}/${i}/${o}.pbf`:`https://api.maptiler.com/tiles/v3/${e}/${i}/${o}.pbf?key=V7KGiDaKQBCWTYsgsmxh`}getImageBitmapLoader(){return sa}async fetchPeaks(e,i,o){const a=this.buildPeaksURL(e,i,o),s=await _i.load(a);return po.parse(s,{mvt:{tileIndex:{x:i,y:o,z:e},coordinates:"wgs84",layers:["mountain_peak"]}})}cancelTile(e,i,o){super.cancelTile(e,i,o);const a=this.buildPeaksURL(e,i,o);_i.cancel(a)}}const j=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),Zt=new Date,d={local:!1,shadows:!0,dayNightCycle:!1,generateColor:!1,debug:!1,geometrySize:j?320:512,debugGPUPicking:!1,readFeatures:!0,drawLines:!0,drawElevations:!1,dark:!1,fovFactor:28.605121612548828,outline:!0,wireframe:!1,drawNormals:!1,debugFeaturePoints:!1,computeNormals:!1,drawTexture:!0,mapMap:!1,stats:!1,exageration:1.622511863708496,outlineStroke:1,depthBiais:.23,depthMultiplier:11,depthPostMultiplier:.9277091026306152,secondsInDay:Zt.getHours()*3600+Zt.getMinutes()*60+Zt.getSeconds(),elevation:-1,terrarium:!1,elevationDecoder:[6553.6*255,25.6*255,.1*255,-1e4],far:173e3,near:10};let Oi={},Ye;function Ai(t){Ye||(Ye=document.createElement("canvas")),Ye.width=t.width,Ye.height=t.height;var e=Ye.getContext("2d");return e.drawImage(t,0,0),e.getImageData(0,0,t.width,t.height)}let Ke,ft,mt;function zi(t,e,i,o){Ke=q.pointToTileFraction(i.lon,i.lat,o),ft=Ke[0]-Math.floor(Ke[0]),mt=1-(Ke[1]-Math.floor(Ke[1])),ft=ft*e[2]+e[0],mt=mt*e[3]+e[1];const a=Math.round(t.width*ft),s=Math.round(t.height*mt),n=(a+t.width*s)*4;return t.data.slice(n,n+4)}const me=12,Pe=1/1e5;class Ii extends vi{onBeforeCompile(e){for(const i in this.userData)e.uniforms[i]=this.userData[i]}onBeforeRender(e,i,o,a,s,n){if(H.useSharedShader){const r=s.parent.parent;for(const l in r.userData)this.uniforms[l]=r.userData[l];this.uniformsNeedUpdate=!0}}}class ra extends vi{onBeforeRender(e,i,o,a,s,n){for(const r in s.userData)this.uniforms[r]&&(this.uniforms[r].value=s.userData[r].value);this.uniformsNeedUpdate=!0}}const Ni=new K,Ne=new ra({depthWrite:!1,depthTest:!1,uniforms:{exageration:{value:1},depthTexture:{value:Ni},cameraNear:{value:10*Pe},cameraFar:{value:1e6*Pe},worldScale:{value:Pe}},vertexShader:`
#include <packing>
attribute vec4 color;

uniform sampler2D depthTexture;
uniform float cameraNear;
uniform float cameraFar;
uniform float exageration;

varying vec2 vUv;
varying float depth;
varying vec4 vColor;

float readDepth(const in vec2 uv) {
return texture2D(depthTexture, uv).r;
}
float getViewZ(const in float depth) {
return perspectiveDepthToViewZ(depth, cameraNear, cameraFar);
}
float readZDepth(vec2 uv) {
return viewZToOrthographicDepth( getViewZ(readDepth(uv)), cameraNear, cameraFar );
}
void main() {
float elevation  = position.y;
vec4 mvPosition = modelViewMatrix * vec4( position.x,  elevation * exageration, position.z, 1.0 );
// mvPosition.z -= pow(getDigit(elevation, 2.0), 2.0) * mvPosition.z / 1000.0;
// mvPosition.z -= (elevation / 1000.0 - floor(elevation / 1000.0)) * mvPosition.z / 1000.0;
gl_Position = projectionMatrix * mvPosition;
gl_PointSize = 6.0;
float depthFromPosition = viewZToOrthographicDepth(mvPosition.z, cameraNear, cameraFar);
vec3 coord = gl_Position.xyz / gl_Position.w;
vUv =(coord.xy + 1.0) * 0.5 ;
float depthAtPoint = readZDepth(vUv);
if (depthAtPoint > cameraFar || depthFromPosition > depthAtPoint) {
	depth = -1.0;
	vColor = vec4( 0.0, 0.0, 0.0, 0.0);
} else {
	depth = depthAtPoint;
	vColor = color;
}
}
	`,fragmentShader:`
#include <packing>
varying vec4 vColor;
varying float depth;

void main() {
	if (depth < 0.0 ) {
		discard;
	}
	gl_FragColor = vColor;
}
	`,transparent:!1});wi.shadowmap_pars_fragment=wi.shadowmap_pars_fragment.replace("return shadow;","if (generateColor){return shadow*2.0; } else {return shadow;}");function la(t,...e){return e.reduce((i,o)=>(i[o]=t[o],i),{})}function ca(){const t=go.phong,e=new vo,i=e.load("terrain/savanna_green_d.webp",null,null),o=e.load("terrain/mntn_dark_d.webp",null,null),a=e.load("terrain/mntn_white_d.webp",null,null),s=e.load("terrain/snow1_d.webp",null,null);i.wrapS=o.wrapS=a.wrapS=xi,i.wrapT=o.wrapT=a.wrapT=xi;const n=new Ii({lights:!0,wireframe:!1,defines:{TANGENTSPACE_NORMALMAP:"",USE_DISPLACEMENTMAP:"",USE_NORMALMAP:""},uniforms:Object.assign(la(t.uniforms,"diffuse","spotLights","spotLightShadows","rectAreaLights","ltc_1","ltc_2","ambientLightColor","directionalLightShadows","directionalLights","directionalShadowMatrix","directionalShadowMap","lightMap","lightMapIntensity","lightProbe","pointLights","pointLightShadows","pointShadowMap","pointShadowMatrix","hemisphereLights","spotShadowMap","spotShadowMatrix","map","opacity","displacementMap"),{textureGrass:{value:i},textureAltitude:{value:o},textureRock:{value:a},textureSnow:{value:s},drawNormals:{value:!1},computeNormals:{value:!1},drawShadows:{value:!1},drawTexture:{value:!1},elevationDecoder:{value:null},generateColor:{value:!1},drawBlack:{value:0},displacementScale:{value:1},normalLength:{value:1},emissive:{value:new $e(0)},specular:{value:new $e(3355443)},shininess:{value:10},displacementBias:{value:0},worldScale:{value:Pe}}),vertexShader:`
#define PHONG
#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <shadowmap_pars_vertex>
uniform bool computeNormals;
uniform bool drawShadows;
uniform float zoomlevel;
uniform float worldScale;
uniform float normalLength;
uniform float zoomFactor;
uniform vec4 elevationDecoder;
uniform vec4 displacementMapLocation;
uniform vec2 displacementRes;
varying vec4 vPosition;
uniform float tileY;
varying vec3 vViewPosition;
varying vec3 vComputedNormal;
varying float trueHeight;
uniform bool generateColor;

float getPixelElevation(vec4 e) {
	// Convert encoded elevation value to meters
	return ((e.r * elevationDecoder.x + e.g * elevationDecoder.y  + e.b * elevationDecoder.z) + elevationDecoder.w);
}
float getElevation(vec2 coord) {
	vec4 e = texture2D(displacementMap, coord * displacementMapLocation.zw + displacementMapLocation.xy);
	return getPixelElevation(e);
}

float getElevationMean(vec2 coord) {
	float x0 = coord.x;
	float x1= coord.x;
	float y0 = coord.y;
	float y1= coord.y;
	if (x0 <= 0.0) {
		x1 = 1.0 * displacementRes.x;
	}
	if (x0 >= 1.0) {
		x1 = 1.0 - 1.0  * displacementRes.x;
	}
	if (y0 <= 0.0) {
		y1 = 1.0 * displacementRes.y;
	}
	if (y0 >= 1.0) {
		y1 = 1.0 - 1.0 * displacementRes.y;
	}
	if (x0 == x1 && y0 == y1) {
		return getElevation(coord);
	} else {
		return 2.0 * getElevation(vec2(x0,y0)) -  getElevation(vec2(x1,y1));
	}
}
void main() {

	vUv = vec2(position.x +  0.5, 0.5 - position.z );

	float e = getElevationMean(vUv);
	vec3 transformedNormal = normalMatrix * vec3(0,1,0);
	vNormal = normalize( transformedNormal );
	vec3 transformed = vec3( position ) + vec3(0,e * displacementScale + displacementBias,0);
	#include <project_vertex>
	vViewPosition = - mvPosition.xyz;

	if (computeNormals) {

		vec3 offset = vec3(displacementRes, 0);
		float b = getElevation(vUv  - offset.zy);
		float d = getElevation(vUv - offset.xz);
		float f = getElevation(vUv + offset.xz);
		float h = getElevation(vUv + offset.zy);
		// float b = getElevationMean(vUv  - offset.zy);
		// float d = getElevationMean(vUv - offset.xz);
		// float f = getElevationMean(vUv + offset.xz);
		// float h = getElevationMean(vUv + offset.zy);
		vComputedNormal = normalize(vec3(mix(d - f , 0.0, zoomFactor), mix(b - h , 0.0, zoomFactor), normalLength));
	}
	#include <worldpos_vertex>
	if (drawShadows) {
		#include <shadowmap_vertex>
	}
	if (generateColor) {
		vPosition = modelMatrix * vec4(transformed, 1.0);
		vPosition.y = e;
	}
}
`,fragmentShader:`
#define PHONG
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <lightmap_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in GeometricContext geometry, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometry.normal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in GeometricContext geometry, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong
#define Material_LightProbeLOD( material )	(0)
#include <normalmap_pars_fragment>
#define SNOW_HEIGHT 1300.0
#define BEACH_HEIGHT 140.5
#define GRASS_HEIGHT 2053.5
#define TREE_MIN_HEIGHT 1000.0
#define TREE_MAX_HEIGHT 1800.0
#define HASHSCALE1 .1031

uniform bool drawNormals;
uniform bool computeNormals;
uniform bool generateColor;
uniform bool drawTexture;
uniform bool drawBlack;
uniform vec4 mapMapLocation;
uniform float zoomlevel;
varying vec4 vPosition;
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float worldScale;
uniform float opacity;
uniform sampler2D textureGrass;
uniform sampler2D textureAltitude;
uniform sampler2D textureRock;
uniform sampler2D textureSnow;
varying vec3 vComputedNormal;

#include <shadowmap_pars_fragment>


vec2 add = vec2(1.0, 0.0);
//  1 out, 2 in...
float Hash12(vec2 p)
{
	vec3 p3  = fract(vec3(p.xyx) * HASHSCALE1);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}
float Noise( in vec2 x, float factor )
{
    vec2 p = floor(x*factor/worldScale);
    vec2 f = fract(x*factor/worldScale);
    f = f*f*(3.0-2.0*f);
    float res = mix(mix( Hash12(p),          Hash12(p + add.xy),f.x),
                    mix( Hash12(p + add.yx), Hash12(p + add.xx),f.x),f.y);
    return res;
}
vec3 TerrainColour(vec4 matPos, vec3 normal, vec2 lights)
{
	float slope = normal.y;
	vec3 mat;
	// lights.x = .0;
	// lights.y = .1;
	// vec3 dir = normalize(pos-cameraPos);
	
	// float f = clamp(Noise(matPos.xz*.05, 2.0), 0.0,1.0);//*10.8;
	vec3 m = texture2D(textureAltitude, vUv*2.0).rgb;
	mat = m;
	// Should have used smoothstep to add colours, but left it using 'if' for sanity...
	if (slope < .5)
	{
		float c = (.5-slope) * 4.0;
		c = clamp(c*c, 0.1, 1.0);
		mat = mix(mat, texture2D(textureRock, vUv*4.0).rgb, c/1.6);
		// lights.x+=.1;
	}
	// Grass. Use the normal to decide when to plonk grass down...
	if (matPos.y < GRASS_HEIGHT && slope > 0.65)
	{
		m = texture2D(textureGrass, vUv*4.0).rgb*1.6 * (slope- 0.65);
		mat = mix(mat, m, clamp((slope-0.65)*1.3 * (GRASS_HEIGHT-matPos.y)*0.003, 0.0, 1.0));
	}

	// if (matPos.y > TREE_MIN_HEIGHT && matPos.y < TREE_MAX_HEIGHT && slope > .22)
	// {
	// 	mat = vec3(.02+Noise(matPos.xz*5.0, 1.0)*.03, .05, .0);
	// 	normal = normalize(normal+vec3(Noise(matPos.xz*33.0, 1.0)*1.0-.5, .0, Noise(matPos.xz*33.0, 1.0)*1.0-.5));
		// lights.x = .0;
	// }
	
	// Snow topped mountains...
	if (matPos.y > SNOW_HEIGHT && slope > .22)
	{
		float snow = clamp(((matPos.y - SNOW_HEIGHT)*(slope-0.22)*3.5) * 0.0015, 0.0, 1.0);
		mat = mix(mat, texture2D(textureSnow, vUv).rgb, snow);
		// lights.x += snow;
		// ambient+=snow *.3;
	}
	// Beach effect...
	// if (matPos.y < BEACH_HEIGHT)
	// {
	// 	if (slope > .4)
	// 	{
	// 		f = Noise(matPos.xz * .084, 1.0)*1.5;
	// 		f = clamp((BEACH_HEIGHT-f-matPos.y) * 1.34, 0.0, .67);
	// 		float t = (slope-.4);
	// 		t = (t*t);
	// 		mat = mix(mat, vec3(.09+t, .07+t, .03+t), f);
	// 	}
	// 	// Cheap under water darkening...it's wet after all...
	// 	if (matPos.y < 0.0)
	// 	{
	// 		mat *= .2;
	// 	}
	// }
	return mat;
}
void main() {
	

	vec3 normal = normalize( vNormal );
	if (computeNormals) {
		normal = perturbNormal2Arb( - vViewPosition, normal, vComputedNormal, 1.0 );
	}

	if(drawBlack) {
		gl_FragColor = vec4( 0.0,0.0,0.0, 1.0 );
		return;
	} else if(drawNormals) {
		gl_FragColor = vec4(packNormalToRGB(normal), opacity);
		return;
	} else if (!drawTexture) {
		gl_FragColor = vec4( 0.0,0.0,0.0, 0.0);
		return;
	}
	float specularStrength = 1.0;

	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	if (generateColor) {
		vec2 lights = vec2(0,0);
		diffuseColor *= mapTexelToLinear(vec4(TerrainColour(vPosition, vComputedNormal.rbg, lights), 1.0));
		// specularStrength = lights.x;
	} else {
		vec4 texelColor = texture2D(map, vUv * mapMapLocation.zw + mapMapLocation.xy);
		// texelColor = mapTexelToLinear( texelColor );
		diffuseColor *= texelColor;
	}


	specularStrength =1.0;
	// accumulation
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_end>
	
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	gl_FragColor = vec4( outgoingLight, diffuseColor.a );
}
`});return n.map=Ni,n}const Wt=new Ii({defines:{USE_DISPLACEMENTMAP:""},name:"DepthMaterial",uniforms:{elevationDecoder:{value:null},displacementMapLocation:{value:new lt},displacementScale:{value:1},displacementMap:{value:null},displacementBias:{value:0}},vertexShader:`
#include <displacementmap_pars_vertex>
uniform vec4 elevationDecoder;
uniform vec4 displacementMapLocation;

float getPixelElevation(vec4 e) {
	// Convert encoded elevation value to meters
	return ((e.r * elevationDecoder.x + e.g * elevationDecoder.y  + e.b * elevationDecoder.z) + elevationDecoder.w);
}
float getElevation(vec2 coord) {
	vec4 e = texture2D(displacementMap, coord * displacementMapLocation.zw + displacementMapLocation.xy);
	return getPixelElevation(e);
}
void main() {
	vec2 vUv = vec2(position.x +  0.5, 0.5 - position.z );
    vec3 pos = position + vec3(0,getElevation(vUv) * displacementScale  + displacementBias,0);
    gl_Position = projectionMatrix * viewMatrix *  modelMatrix * vec4(pos, 1.0);
}
`,fragmentShader:`
// #include <common>
#include <packing>
void main() {
	gl_FragColor = packDepthToRGBA( gl_FragCoord.z );
}`}),F=ca();let Hi=0;const R=class extends Y{constructor(t,e,i,o,a,s){super(t,e,i,o,a,s,R.getDefaultGeometry(),R.useSharedShader?F:F.clone());this.fullGeometryLoaded=!1,this.displacementMapLocation=[0,0,1,1],this.mapMapLocation=[0,0,1,1],this.heightOverZoomFactor=1,this.overZoomFactor=1;const n={displacementMap:{value:null},map:{value:this.material.map},zoomlevel:{value:o},tileY:{value:s},displacementMapLocation:{value:this.displacementMapLocation},displacementRes:{value:[0,0]},zoomFactor:{value:this.getZoomFactor()},mapMapLocation:{value:this.mapMapLocation}};R.useSharedShader?this.userData=n:this.material.userData=n,this.frustumCulled=!1}static getDefaultGeometry(){return R.geometry||(R.geometry=R.getSoftGeometry(16,!0)),R.geometry}static getGeometry(t){const e=Math.log(1/Pe)*Math.LOG10E+1|0;let i=d.geometrySize/Math.max(Math.floor(e/2),1);t>me&&(i/=Math.floor(Math.pow(2,t-me)),i=Math.max(16,i));let o=R.geometries[i];return R.geometries[i]||(o=R.geometries[i]=new J(1,1,i,i,{skirt:d.exageration>.1,skirtDepth:50*d.exageration*R.scaleRatio,uvs:!1})),o}static getSoftGeometry(t,e){let i;if(e)i=t;else{const a=Math.log(1/Pe)*Math.LOG10E+1|0;i=d.geometrySize/Math.max(Math.pow(2,Math.floor(a/2)-1),1),t<me?(i/=Math.floor(Math.pow(2,Math.floor(me-t))),i=Math.max(16,i)):t>me&&(i/=Math.floor(Math.pow(2,t-me)),i=Math.max(16,i))}let o=R.geometries[i];return R.geometries[i]||(o=R.geometries[i]=new J(1,1,i,i,{skirt:d.exageration>.1,skirtDepth:50*d.exageration,uvs:!1})),o}getZoomFactor(){let t=0,e=this.level;return this.displacementMapLocation[2]!==1&&(e-=Math.log(1/this.displacementMapLocation[2])/Math.log(2)),e<12&&(t=1-.5/(12-e)),t}initialize(){let t=2,e=this.parent;for(;t>0&&(!e.textureLoaded||!e.heightLoaded);)e=e.parent,t--;if(e&&e.textureLoaded&&e.heightLoaded){const i=q.tileToBBOX([this.x,this.y,this.level]),o=q.tileToBBOX([e.x,e.y,e.level]),a=o[2]-o[0],s=o[3]-o[1],n=this.level-e.level,r=Math.pow(10,n),l=Math.floor((i[0]-o[0])/a*r)/r,c=Math.floor((i[1]-o[1])/s*r)/r;if(!this.textureLoaded){const h=1/e.mapMapLocation[2],m=[0,0,1,1];m[0]=e.mapMapLocation[0]+l/h,m[1]=e.mapMapLocation[1]+c/h,m[2]=m[3]=1/Math.pow(2,h*n);const u=R.useSharedShader?e.userData:e.material.userData;this.setMaterialValues({map:u.map.value,mapMapLocation:m})}if(!this.heightLoaded){const h=e.displacementMapLocation,m=1/h[2],u=[0,0,1,1];u[0]=h[0]+l/m,u[1]=h[1]+c/m,u[2]=u[3]=1/(2*m*n);const w=R.useSharedShader?e.userData:e.material.userData;this.displacementMapLocation=u;const x=w.displacementMap.value;this.setMaterialValues({displacementMap:x,displacementMapLocation:u,displacementRes:[1/(x.image.width*u[2]),1/(x.image.height*u[3])],zoomFactor:this.getZoomFactor()})}this.show()}return super.initialize()}dispose(){super.dispose(),this.pointsMesh=null}setMaterialValues(t){const e=R.useSharedShader?this.userData:this.material.userData;Object.keys(t).forEach(i=>{e.hasOwnProperty(i)&&(e[i].value=t[i])})}didSimplify(){this.lod?this.children=[this.objectsHolder,this.lod]:this.children=[this.objectsHolder]}show(){this.fullGeometryLoaded||this.constructLOD(),R.useLOD?(this.isMesh=!1,this.lod.visible=!0):this.isMesh=!0}isVisible(){return R.useLOD?this.lod&&this.lod.visible:this.isMesh}hide(){this.isMesh=!1,this.objectsHolder.visible=this.level!==this.mapView.maxZoomForObjectHolders,this.lod&&(this.lod.visible=!1)}constructLOD(){if(this.fullGeometryLoaded=!0,R.useLOD){const t=this.lod=new wo;for(let e=0;e<4;e++){let i=e>=3?e+1:e;const o=new st(R.getSoftGeometry(this.level>me?this.level+i:me-i),this.material);o.frustumCulled=!1,o.castShadow=!0,o.receiveShadow=!0,o.customDepthMaterial=Wt,o.updateMatrix(),o.updateMatrixWorld(!0),o.matrixAutoUpdate=!1,t.addLevel(o,700*Math.pow(e,5))}t.updateMatrix(),t.updateMatrixWorld(!0),t.frustumCulled=!1,t.matrixAutoUpdate=!1,this.add(t),this.isMesh=!1}else this.geometry=R.getGeometry(this.level)}loadTexture(){if(!this.isTextureReady)return this.isTextureReady=!0,this.mapView.provider.fetchTile(this.level,this.x,this.y).then(t=>this.onTextureImage(t)).finally(()=>{!this.mapView||(this.textureLoaded=!0,this.nodeReady())})}onTextureImage(t){if(this.parentNode&&t){this.mapMapLocation=[0,0,1,1];const e=new K(t);e.generateMipmaps=!1,e.magFilter=de,e.minFilter=de,e.needsUpdate=!0,this.setMaterialValues({map:e,mapMapLocation:this.mapMapLocation})}}async onHeightImage(t,e=!0){if(this.mapView&&t){e&&(this.displacementMapLocation=[0,0,1,1]);let i;if(t instanceof K?(i=t,this.setMaterialValues({displacementMap:t,displacementMapLocation:this.displacementMapLocation,displacementRes:[1/(i.image.width*this.displacementMapLocation[2]),1/(i.image.height*this.displacementMapLocation[3])]})):(i=new K(t),i.generateMipmaps=!1,i.flipY=!1,i.wrapS=Mi,i.wrapT=Mi,i.magFilter=de,i.minFilter=de,i.needsUpdate=!0,this.setMaterialValues({displacementMap:i,displacementMapLocation:this.displacementMapLocation,displacementRes:[1/(i.image.width*this.displacementMapLocation[2]),1/(i.image.height*this.displacementMapLocation[3])],zoomFactor:this.getZoomFactor()})),this.level>this.mapView.maxZoomForObjectHolders)return;await this.mapView.heightProvider.fetchPeaks(this.level,this.x,this.y).then(o=>{if(!!this.mapView&&(o=o.filter(r=>r.properties.name&&r.properties.class==="peak"&&r.properties.ele!==void 0),o.length>0)){const r=d.elevationDecoder,l=[];var a=[],s=[];const c=new D(0,0,0),m=(R.useSharedShader?this.userData:this.material.userData).displacementMapLocation.value;let u,w=new xe,x,g;const b=Ai(i.image),f=R.scaleRatio;if(o.forEach((p,v)=>{if(u=p.geometry.coordinates,S.datumsToSpherical(u[1],u[0],w,f),c.set(w.x,0,-w.y),p.localCoords=this.worldToLocal(c),Math.abs(p.localCoords.x)<=.5&&Math.abs(p.localCoords.z)<=.5){const T=u.join(",");p.id=T,p.pointIndex=l.length,p.level=this.level,p.x=this.x,p.y=this.y,x=zi(b,m,{lat:u[1],lon:u[0]},this.level);const y=p.properties.computedEle=Math.ceil(x[0]/255*r[0]+x[1]/255*r[1]+x[2]/255*r[2]+r[3]);p.localCoords.y=y,g=p.color=Hi=(Hi+1)%16777214,Oi[g]=p,l.push(p),a.push((g>>16&255)/255,(g>>8&255)/255,(g&255)/255),s.push(p.localCoords.x,p.localCoords.y,p.localCoords.z)}}),s.length>0){const p=new je,v=new X(s,3);v.name="points",p.setAttribute("position",v);const T=new X(a,3);T.name="colors",p.setAttribute("color",T);var n=new xo(p,Ne);n.userData={},n.frustumCulled=!1,n.updateMatrix(),n.updateMatrixWorld(!0),this.pointsMesh=n,this.objectsHolder.add(n)}}}).catch(o=>{console.error("error fetching peaks",o)})}}async handleParentOverZoomTile(t){if(!this.mapView)return;const e=q.tileToBBOX([this.x,this.y,this.level]),i=this.parent,o=i.heightOverZoomFactor,a=q.tileToBBOX([i.x,i.y,i.level]),s=a[2]-a[0],n=a[3]-a[1];this.heightOverZoomFactor=o*2,this.displacementMapLocation[0]=i.displacementMapLocation[0]+Math.floor((e[0]-a[0])/s*10)/10/o,this.displacementMapLocation[1]=i.displacementMapLocation[1]+Math.floor((e[1]-a[1])/n*10)/10/o,this.displacementMapLocation[2]=this.displacementMapLocation[3]=1/this.heightOverZoomFactor;const r=R.useSharedShader?i.userData:i.material.userData;await this.onHeightImage(r.displacementMap.value,!1),t==null||t()}raycast(t,e){if(this.isVisible()){const i=this.geometry;this.geometry=re.geometry;const o=st.prototype.raycast.call(this,t,e);return this.geometry=i,o}return!1}};let H=R;H.useLOD=!0;H.useSharedShader=!0;H.baseGeometry=re.geometry;H.scaleRatio=Pe;H.baseScale=new D(S.EARTH_PERIMETER*R.scaleRatio,Number(R.scaleRatio),S.EARTH_PERIMETER*R.scaleRatio);H.geometries={};H.geometrySize=4;H.maxZoomForPeaks=12;class ha extends Si{constructor(e=!1){super(e?`https://${Gt}/styles/terrain_no_label/`:"https://a.tile.openstreetmap.org/")}}class da extends Mo{constructor(e,i,o,a,s=1){super(16777215);this.savedPosition=new D(0,0,0),this.coordinates=new xe,this.coordinates.copy(e),this.north=i,this.east=o,this.nadir=a,this.sun_distance=s,this.azimuth=0,this.elevation=0,this.localDate=new Date,this.castShadow=!0}setWorldPosition(e){this.savedPosition.set(e.x,e.y,e.z),this.updateDirectionalLight()}setPosition(e,i){this.coordinates.set(e,i),this.updateOrientation(!1),this.updateDirectionalLight()}setDate(e){this.localDate=e,this.updateOrientation(!1),this.updateDirectionalLight()}updateOrientation(e=!0){e&&(this.localDate=new Date);const o=new ua().getAzEl(this.coordinates.x,this.coordinates.y,this.localDate);this.azimuth=this._degreesToRadians(o.azimuth),this.elevation=this._degreesToRadians(o.elevation)}updateDirectionalLight(){const e=-2,i=180*this.elevation/Math.PI;if(i<e){this.intensity=0;return}else i<0&&i>=e?this.intensity=i/e:this.intensity=2;this.position.copy(this.north),this.position.multiplyScalar(this.sun_distance);const o=new Oe,a=new Oe;o.setFromAxisAngle(this.east,this.elevation),a.premultiply(o),o.setFromAxisAngle(this.nadir,this.azimuth),a.premultiply(o),this.position.applyQuaternion(a),this.position.add(this.savedPosition),this.target.position.copy(this.savedPosition)}_degreesToRadians(e){return e%360*Math.PI/180}}class ua{constructor(){this.a="some val"}getAzEl(e,i,o=new Date){const a=this._getJD(o),s=this._getTimeLocal(o),n=o.getTimezoneOffset()/-60,r=a+s/1440-n/24,l=this._calcTimeJulianCent(r);return this._calcAzEl(!1,l,s,e,i,n)}_getJD(e=new Date){let i=e.getMonth()+1,o=e.getDate(),a=e.getFullYear();this._isLeapYear(a)&&i===2?o>29&&(o=29):o>new Date(1900,i,0).getDate()&&(o=new Date(1900,i,0).getDate()),i<=2&&(a-=1,i+=12);const s=Math.floor(a/100),n=2-s+Math.floor(s/4);return Math.floor(365.25*(a+4716))+Math.floor(30.6001*(i+1))+o+n-1524.5}_getTimeLocal(e=new Date){let i=0;return i+=60*e.getHours(),i+=e.getMinutes(),i+=e.getSeconds()/60,i}_calcTimeJulianCent(e){return(e-2451545)/36525}_calcAzEl(e,i,o,a,s,n){const r={azimuth:0,elevation:0},l=this._calcEquationOfTime(i),c=this._calcSunDeclination(i),h=l+4*s-60*n;this._calcSunRadVector(i);let m=o+h;for(;m>1440;)m-=1440;let u=m/4-180;u<-180&&(u+=360);const w=this._degToRad(u);let x=Math.sin(this._degToRad(a))*Math.sin(this._degToRad(c))+Math.cos(this._degToRad(a))*Math.cos(this._degToRad(c))*Math.cos(w);x>1?x=1:x<-1&&(x=-1);const g=this._radToDeg(Math.acos(x)),b=Math.cos(this._degToRad(a))*Math.sin(this._degToRad(g));if(Math.abs(b)>.001){let y=(Math.sin(this._degToRad(a))*Math.cos(this._degToRad(g))-Math.sin(this._degToRad(c)))/b;Math.abs(y)>1&&(y<0?y=-1:y=1);var f=180-this._radToDeg(Math.acos(y));u>0&&(f=-f)}else a>0?f=180:f=0;f<0&&(f+=360);const p=90-g;if(p>85)var v=0;else{const y=Math.tan(this._degToRad(p));if(p>5)var v=58.1/y-.07/(y*y*y)+86e-6/(y*y*y*y*y);else if(p>-.575)var v=1735+p*(-518.2+p*(103.4+p*(-12.79+p*.711)));else var v=-20.774/y;v=v/3600}const T=g-v;return r.azimuth=Math.floor(f*100+.5)/100,r.elevation=Math.floor((90-T)*100+.5)/100,r}_isLeapYear(e){return e%4==0&&e%100!=0||e%400==0}_radToDeg(e){return 180*e/Math.PI}_degToRad(e){return Math.PI*e/180}_calcEquationOfTime(e){const i=this._calcObliquityCorrection(e),o=this._calcGeomMeanLongSun(e),a=this._calcEccentricityEarthOrbit(e),s=this._calcGeomMeanAnomalySun(e);let n=Math.tan(this._degToRad(i)/2);n*=n;const r=Math.sin(2*this._degToRad(o)),l=Math.sin(this._degToRad(s)),c=Math.cos(2*this._degToRad(o)),h=Math.sin(4*this._degToRad(o)),m=Math.sin(2*this._degToRad(s)),u=n*r-2*a*l+4*a*n*l*c-.5*n*n*h-1.25*a*a*m;return this._radToDeg(u)*4}_calcSunDeclination(e){const i=this._calcObliquityCorrection(e),o=this._calcSunApparentLong(e),a=Math.sin(this._degToRad(i))*Math.sin(this._degToRad(o));return this._radToDeg(Math.asin(a))}_calcSunRadVector(e){const i=this._calcSunTrueAnomaly(e),o=this._calcEccentricityEarthOrbit(e);return 1.000001018*(1-o*o)/(1+o*Math.cos(this._degToRad(i)))}_calcObliquityCorrection(e){const i=this._calcMeanObliquityOfEcliptic(e),o=125.04-1934.136*e;return i+.00256*Math.cos(this._degToRad(o))}_calcSunApparentLong(e){const i=this._calcSunTrueLong(e),o=125.04-1934.136*e;return i-.00569-.00478*Math.sin(this._degToRad(o))}_calcGeomMeanLongSun(e){let i=280.46646+e*(36000.76983+e*3032e-7);for(;i>360;)i-=360;for(;i<0;)i+=360;return i}_calcEccentricityEarthOrbit(e){return .016708634-e*(42037e-9+1267e-10*e)}_calcGeomMeanAnomalySun(e){return 357.52911+e*(35999.05029-1537e-7*e)}_calcSunTrueAnomaly(e){const i=this._calcGeomMeanAnomalySun(e),o=this._calcSunEqOfCenter(e);return i+o}_calcMeanObliquityOfEcliptic(e){const i=21.448-e*(46.815+e*(59e-5-e*.001813));return 23+(26+i/60)/60}_calcSunTrueLong(e){const i=this._calcGeomMeanLongSun(e),o=this._calcSunEqOfCenter(e);return i+o}_calcSunEqOfCenter(e){const i=this._calcGeomMeanAnomalySun(e),o=this._degToRad(i),a=Math.sin(o),s=Math.sin(o+o),n=Math.sin(o+o+o);return a*(1.914602-e*(.004817+14e-6*e))+s*(.019993-101e-6*e)+n*289e-6}}const se=Math.PI/180,jt=180/Math.PI,fa=new URLSearchParams(window.location.search);fa.forEach((t,e)=>{try{d[e]=JSON.parse(t)}catch{d[e]=t}});function Fi(){G.shadowMap.enabled=F.uniforms.drawShadows.value=d.shadows&&d.dayNightCycle}function He(t,e,i=!0,o=!0){try{if(!d.hasOwnProperty(t)){const n=window[t];typeof n=="function"&&n(e,i,o)}const a=d[t];if(t==="elevation"&&(typeof e=="string"&&(e=parseFloat(e)),Le!==void 0&&e<Le&&(e=Le)),vt&&a===e)return;d[t]=e;let s=e;switch(t){case"terrarium":e?d.elevationDecoder=[256*255,1*255,1/256*255,-32768]:d.elevationDecoder=[6553.6*255,25.6*255,.1*255,-1e4],F.uniforms.elevationDecoder.value=d.elevationDecoder,Wt.uniforms.elevationDecoder.value=d.elevationDecoder;break;case"dayNightCycle":{if(!V){V=va(),C=new da(new xe(45.05,5.47),new D(0,0,-1),new D(1,0,0),new D(0,-1,0),2),C.shadow.bias=-2e-4,C.shadow.mapSize.width=8192,C.shadow.mapSize.height=8192,C.shadow.camera.left=-1,C.shadow.camera.right=1,C.shadow.camera.top=.1,C.shadow.camera.bottom=-.5,C.shadow.camera.near=.1,C.shadow.camera.far=5,ne.add(V),ne.add(C),ne.add(C.target),M.getPosition(_),C.setWorldPosition(_);let n=new Date;const r=Math.floor(d.secondsInDay/3600),l=Math.floor((d.secondsInDay-r*3600)/60),c=d.secondsInDay-r*3600-l*60;n.setHours(r),n.setMinutes(l),n.setSeconds(c),C.setDate(n)}xt(),ai(),F.uniforms.computeNormals.value=Ue(),Fi();break}case"shadows":{Fi();break}case"drawTexture":{F.uniforms.drawTexture.value=Kt();break}case"elevation":{M.getPosition(_);const n=H.scaleRatio;M.moveTo(_.x,e*d.exageration*n,_.z),i&&(ve(),i=!1);break}case"secondsInDay":{let n=new Date;const r=Math.floor(e/3600),l=Math.floor((e-r*3600)/60),c=e-r*3600-l*60;n.setHours(r),n.setMinutes(l),n.setSeconds(c),C&&(C.setDate(n),tt()),s=n.toLocaleString(),ai();break}case"dark":{document.body.style.backgroundColor=d.dark?"black":"white",ni.uniforms.get("outlineColor").value.set(d.dark?16777215:0);break}case"outline":{_e.enabled=!di(),Rt.renderToScreen=!_e.enabled;break}case"near":{A.near=d.near*ge;break}case"far":{const n=H.scaleRatio;A.far=d.far*n,A.updateProjectionMatrix(),Pt(),Ne.uniforms.cameraNear.value=A.near,Ne.uniforms.cameraFar.value=A.far;break}case"readFeatures":{pe.style.visibility=d.readFeatures?"visible":"hidden";break}case"exageration":{F.uniforms.displacementScale.value=d.exageration,F.uniforms.normalLength.value=30/d.exageration,Wt.uniforms.displacementScale.value=d.exageration,Ne.uniforms.exageration.value=d.exageration;break}case"depthBiais":case"outlineStroke":case"depthMultiplier":case"depthPostMultiplier":{ni.uniforms.get("multiplierParameters").value.set(d.depthBiais,d.depthMultiplier,d.depthPostMultiplier,d.outlineStroke);break}case"wireframe":{F.wireframe=d.wireframe;break}case"debugFeaturePoints":{L&&St(n=>{n.objectsHolder.visible=d.debugFeaturePoints&&(n.isVisible()||n.level===L.maxZoomForObjectHolders&&n.parentNode.subdivided)});break}case"computeNormals":{xt(),F.uniforms.computeNormals.value=Ue();break}case"stats":{e?(ce||(ce=new Io,ce.showPanel(0)),document.body.appendChild(ce.dom)):ce&&document.body.removeChild(ce.dom);break}case"drawNormals":{F.uniforms.computeNormals.value=Ue(),F.uniforms.drawNormals.value=d.drawNormals,F.uniforms.drawTexture.value=Kt();break}case"mapMap":{_e.enabled=!di(),Rt.renderToScreen=!_e.enabled,xt(),tt(),F.uniforms.computeNormals.value=Ue(),F.uniforms.drawTexture.value=Kt(),L&&(L.provider=ei(),e&&$i("map"),i&&Qt());break}case"geometrySize":{L&&i&&(ti(),yt(),he(!0),i=!1);break}case"generateColor":{F.uniforms.computeNormals.value=Ue(),F.uniforms.generateColor.value=d.generateColor,F.uniforms.drawTexture.value=(d.debug||d.mapMap||d.generateColor)&&d.drawTexture,tt();break}case"fovFactor":{A.fov=bt=oi(),A.updateProjectionMatrix();break}case"debug":{_e.enabled=!di(),Rt.renderToScreen=!_e.enabled,xt(),F.uniforms.computeNormals.value=Ue(),F.uniforms.drawTexture.value=(d.debug||d.mapMap||d.generateColor)&&d.drawTexture,L&&(L.provider=ei(),e&&$i("debug"),i&&Qt());break}}Je[t]?Je[t].checked=e:Qe[t]&&(Qe[t].value=e),Jt[t]&&(Jt[t].innerText=s),i&&he()}catch(a){console.error(a.toString()+" "+a.stack)}}class ma extends ct{constructor(){super(...arguments);this.screenOrientation=0,this.deviceOrientation={},this.deviceOrientationEnabled=!1,this.orientationAzimuth=0,this.orientationPolar=0,this.alphaOffsetAngle=0,this.betaOffsetAngle=0,this.gammaOffsetAngle=0,this.zee=new D(0,0,1),this.euler=new No,this.q0=new Oe,this.q1=new Oe,this.wordVec=new D,this.trucking=!1,this.zooming=!1,this.ignoreUpdateDispatch=!1}updateDeviceOrientationQuaternion(){var e=this.deviceOrientation.alpha?this.deviceOrientation.alpha*se+this.alphaOffsetAngle:0,i=this.deviceOrientation.beta?this.deviceOrientation.beta*se+this.betaOffsetAngle:0,o=this.deviceOrientation.gamma?this.deviceOrientation.gamma*se+this.gammaOffsetAngle:0,a=this.screenOrientation?this.screenOrientation*se:0;this.setObjectQuaternion(this._camera.quaternion,e,i,o,a),this._camera.getWorldDirection(this.wordVec),this.orientationAzimuth=Math.atan2(this.wordVec.x,this.wordVec.z)+Math.PI,this.orientationPolar=Math.atan2(this.wordVec.z,this.wordVec.y)+Math.PI}onDeviceOrientationChangeEvent(e){this.deviceOrientation=e,this.updateDeviceOrientationQuaternion(),this.dispatchEvent({type:"update",originalEvent:e})}onCompassNeedsCalibrationEvent(){console.log("onCompassNeedsCalibrationEvent")}onScreenOrientationChangeEvent(e){this.screenOrientation=window.orientation||0,this.dispatchEvent({type:"control",originalEvent:e})}startDeviceOrientation(){this.deviceOrientationEnabled||(this.deviceOrientationEnabled=!0,this.screenOrientation=window.orientation||0,this.onDeviceOrientationChangeEventBound=this.onDeviceOrientationChangeEvent.bind(this),this.onScreenOrientationChangeEventBound=this.onScreenOrientationChangeEvent.bind(this),this.onCompassNeedsCalibrationEventBound=this.onCompassNeedsCalibrationEvent.bind(this),window.addEventListener("orientationchange",this.onScreenOrientationChangeEventBound,!1),"ondeviceorientationabsolute"in window?window.addEventListener("deviceorientationabsolute",this.onDeviceOrientationChangeEventBound,!1):window.addEventListener("deviceorientation",this.onDeviceOrientationChangeEventBound,!1),window.addEventListener("compassneedscalibration",this.onCompassNeedsCalibrationEventBound,!1))}stopDeviceOrientation(){!this.deviceOrientationEnabled||(this.deviceOrientationEnabled=!1,this.rotateTo(this.orientationAzimuth,this.orientationPolar),window.removeEventListener("orientationchange",this.onScreenOrientationChangeEventBound,!1),"ondeviceorientationabsolute"in window?window.removeEventListener("deviceorientationabsolute",this.onDeviceOrientationChangeEventBound,!1):window.removeEventListener("deviceorientation",this.onDeviceOrientationChangeEventBound,!1),window.addEventListener("compassneedscalibration",this.onCompassNeedsCalibrationEventBound,!1))}setObjectQuaternion(e,i,o,a,s){this.q0.identity(),this.q1.set(-Math.sqrt(.5),0,0,Math.sqrt(.5)),this.euler.set(o,i,-a,"YXZ"),e.setFromEuler(this.euler),e.multiply(this.q1),e.multiply(this.q0.setFromAxisAngle(this.zee,-s))}rotate(e,i,o){if(this.deviceOrientationEnabled)this.updateAlphaOffsetAngle(this.alphaOffsetAngle+e),this.updateBetaOffsetAngle(this.betaOffsetAngle+i);else return super.rotate(e,i,o)}truck(e,i,o){return this.trucking=!0,super.truck(e,i,o)}zoom(e,i){return this.zooming=!0,super.zoom(e,i)}zoomTo(e,i){return this.zooming=!0,super.zoomTo(e,i)}dispatchEvent(e){this.ignoreUpdateDispatch&&e.type==="update"||(super.dispatchEvent(e),e.type==="update"&&(this.trucking=!1,this.zooming=!1))}update(e){return this.deviceOrientationEnabled?(this.ignoreUpdateDispatch=!0,super.update(e),this.updateDeviceOrientationQuaternion(),this.ignoreUpdateDispatch=!1,this.dispatchEvent({type:"update",originalEvent:null}),!0):super.update(e)}updateAlphaOffsetAngle(e){this.alphaOffsetAngle=e}updateBetaOffsetAngle(e){this.betaOffsetAngle=e}updateGammaOffsetAngle(e){this.gammaOffsetAngle=e}dispose(){this.stopDeviceOrientation(),super.dispose()}}class pa extends Ho{constructor(){super("CustomOutlineEffect",`
uniform vec3 weights;
uniform vec3 outlineColor;
uniform vec4 multiplierParameters;

float readZDepth(vec2 uv) {
	return viewZToOrthographicDepth( getViewZ(readDepth(uv)), cameraNear, cameraFar );
}
void mainImage(const in vec4 inputColor, const in vec2 uv, const in float depth, out vec4 outputColor) {
	float zdepth = viewZToOrthographicDepth( getViewZ(depth), cameraNear, cameraFar );
	vec3 offset = vec3( texelSize * multiplierParameters.w, 0.0 );
	float depthDiff = abs(zdepth - readZDepth(uv + offset.xz))
					+ abs(zdepth - readZDepth(uv - offset.xz))
					+ abs(zdepth - readZDepth(uv + offset.zy))
					+ abs(zdepth - readZDepth(uv - offset.zy));
	depthDiff = depthDiff * multiplierParameters.y;
	depthDiff = pow(depthDiff, multiplierParameters.x);
	// depthDiff = depthDiff * multiplierParameters.z;
	vec4 outlineColor = vec4(outlineColor, depthDiff);
	outputColor = vec4(mix(inputColor, outlineColor, depthDiff));
}
`,{attributes:Fo.DEPTH,blendFunction:Bo.AVERAGE,uniforms:new Map([["outlineColor",new yi(new $e(d.dark?16777215:0))],["multiplierParameters",new yi(new lt(d.depthBiais,d.depthMultiplier,d.depthPostMultiplier,d.outlineStroke))]])})}}ct.install({THREE:{MOUSE:yo,Vector2:xe,Vector3:D,Vector4:lt,Quaternion:Oe,Matrix4:rt,Spherical:bo,Box3:To,Sphere:Eo,Raycaster:gi,MathUtils:{DEG2RAD:ze.DEG2RAD,clamp:ze.clamp}}});function Bi(t,e){var i=!1;return function(){i||(t.apply(this,arguments),i=!0,setTimeout(function(){i=!1},e))}}function ga(t,e){var i=null;return function(){i&&(clearTimeout(i),i=null),i=setTimeout(function(...o){t.apply(this,...o),i=null},e)}}const pt=window.devicePixelRatio;let Vi=[];const _=new D(0,0,0);let Ui=-1,I,$t=!1,Le;const ki=new Do;let O=null,L;const Gi=1e-5;let Q;const Fe=j?170:120;let ee=null,Be=!1,W=window.innerWidth,$=window.innerHeight,Re=window.innerWidth,Se=window.innerHeight,Zi=1,Xt=!1,gt=!1,qt=!1,vt=!0,ce;const wt=document.getElementById("canvas"),pe=document.getElementById("canvas4");document.getElementById("video");const P=pe.getContext("2d");wt.addEventListener("touchstart",()=>ki.getDelta(),{passive:!0});const G=new Po({canvas:wt,antialias:!1,alpha:!0,powerPreference:"high-performance",stencil:!1});G.physicallyCorrectLights=!0;G.shadowMap.type=Lo;G.shadowMap.enabled=!1;G.setClearColor(0,0);const Yt=new Ro(100,100,{generateMipmaps:!1,stencilBuffer:!1,depthBuffer:!1,minFilter:Ae,magFilter:Ae}),Ve=new So(G,{});function Ue(){return d.computeNormals||d.drawNormals||d.generateColor||(d.debug||d.mapMap||d.shadows)&&d.dayNightCycle}function Kt(){return(d.debug||d.mapMap||d.generateColor)&&d.drawTexture}function Wi(){return d.dayNightCycle}function va(){if(V)return;V=new Vo,V.scale.setScalar(1e8);const t={turbidity:0,rayleigh:.5,mieCoefficient:.005,mieDirectionalG:.7,inclination:.48,azimuth:.25,exposure:G.toneMappingExposure},e=V.material.uniforms;e.turbidity.value=t.turbidity,e.rayleigh.value=t.rayleigh,e.mieCoefficient.value=t.mieCoefficient,e.mieDirectionalG.value=t.mieDirectionalG;const i=Math.PI*(t.inclination-.5),o=2*Math.PI*(t.azimuth-.5),a=new D;return a.x=Math.cos(o),a.y=Math.sin(o)*Math.sin(i),a.z=Math.sin(o)*Math.cos(i),e.sunPosition.value.copy(a),V}const ne=new Co;let ji;function $i(t){const e=ji!==t;ji=t,St(i=>{const o=H.useSharedShader?i.userData:i.material.userData;i.isVisible()&&(e||!(o.map&&o.map.value))&&(o.map.value=null,i.isTextureReady=!1,i.initialize())})}function xt(){tt(),!!V&&(C.visible=Wi(),V.visible=Wi())}let Je={},Jt={},Qe={},Mt,Xi;const wa=document.getElementById("compass"),qi=document.getElementById("compass_slice"),Yi=document.getElementById("compass_label"),xa=document.getElementById("camera_button");xa.style.visibility=j?"visible":"hidden";Object.keys(d).forEach(t=>{const e=document.getElementById(t);if(!!e){if(e.type==="checkbox")Je[t]=e,Je[t].onchange=i=>He(t,i.target.checked),Je[t].checked=d[t];else if(e.type==="range"){Qe[t]=e,Qe[t].oninput=o=>He(t,o.target.value),Qe[t].value=d[t];let i=document.getElementById(t+"Label");i&&(Jt[t]=i)}}}),Mt=document.getElementById("selectedPeakLabel"),Xi=document.getElementById("selectedPeak");const Ma=new _o(wt);Ma.on("tap",function(t){ee=new xe(t.center.x,t.center.y),he(!0)});const ke=new na(d.local),yt=ga(function(t=!1){!qt||!L||!I||L.lod.updateLOD(L,A,G,ne,t)},j?200:0);function Ki(){if(wa){let t;M.deviceOrientationEnabled?t=M.orientationAzimuth*jt%360:t=M.azimuthAngle*jt%360,Yi&&(Yi.innerText=t.toFixed()+"\xB0");const e=bt*W/$;qi.style.backgroundImage=`conic-gradient(transparent 0deg,transparent ${180-e/2}deg, #15BFCC ${180-e/2}deg, #15BFCC ${180+e/2}deg, transparent ${180+e/2}deg)`,qi.style.transform=`rotateZ(${-t-180}deg)`}}function Qt(t=!1){M.getPosition(_),yt(t),Ki(),he()}function ya(){const t=H.scaleRatio;ke.maxOverZoom=j?0:2,j?(et.subdivideDistance=60*t,et.simplifyDistance=160*t):(et.subdivideDistance=70*t,et.simplifyDistance=170*t)}const et=new $o;ya();function ei(){let t;return d.mapMap?(t=new ha(d.local),t.zoomDelta=2):d.debug?t=new oa:t=new aa,t.minZoom=5,t.maxZoom=ke.maxZoom+ke.maxOverZoom,t.minLevelForZoomDelta=11,t}function ba(t){if(he(),I&&$t&&t.level>ke.maxZoom-3){const e=q.tileToBBOX([t.x,t.y,t.level]);I.lat>=e[1]&&I.lat<=e[3]&&I.lon>=e[0]&&I.lon<=e[2]&&Ji(I,t)}}function ti(){if(!vt)return;L!==void 0&&(ne.remove(L),qe(L.root));const t=ei();L=new De(null,t,ke,!1,ba),L.lowMemoryUsage=!0,L.maxZoomForObjectHolders=13,L.setRoot(new H(null,L,E.root,0,0,0)),L.lod=et,L.updateMatrixWorld(!0),ne.add(L)}let ii=(screen.orientation||{}).type;function oi(){if(j){const t=W>$?$/W:W/$;return(/landscape/.test(ii)?t:1)*d.fovFactor}return d.fovFactor}let bt=oi();const ge=H.scaleRatio,A=new Oo(bt,W/$,d.near*ge,d.far*ge);window.addEventListener("orientationchange",function(t){ii=t.target.screen.orientation.type,A.fov=bt=oi(),A.updateProjectionMatrix(),M.azimuthRotateSpeed=M.polarRotateSpeed=Tt()/Lt,Ki()},!1);A.position.set(0,0,Gi);const M=new ma(A,wt);function ve(){M.update(1)}function Tt(){if(j){const t=W>$?$/W:W/$;return(/landscape/.test(ii)?t:1)*-.12}else return-.1}M.azimuthRotateSpeed=Tt();M.polarRotateSpeed=Tt();M.minZoom=1;M.maxZoom=20;M.truckSpeed=1/Gi*1e5*ge;M.mouseButtons.wheel=ct.ACTION.ZOOM;M.touches.two=ct.ACTION.TOUCH_ZOOM_TRUCK;M.verticalDragToForward=!0;M.saveState();let Et=5,Dt=.05;if(!j){const t={W:87,A:65,S:83,D:68,ARROW_LEFT:37,ARROW_UP:38,ARROW_RIGHT:39,ARROW_DOWN:40},e=new ue(t.W,16.666),i=new ue(t.A,16.666),o=new ue(t.S,16.666),a=new ue(t.D,16.666);i.addEventListener("holding",function(c){M.truck(-Et*ge*c.deltaTime,0,!1),M.update(c.deltaTime)}),a.addEventListener("holding",function(c){M.truck(Et*ge*c.deltaTime,0,!1),M.update(c.deltaTime)}),e.addEventListener("holding",function(c){M.forward(Et*ge*c.deltaTime,!1),M.update(c.deltaTime)}),o.addEventListener("holding",function(c){M.forward(-Et*ge*c.deltaTime,!1),M.update(c.deltaTime)});const s=new ue(t.ARROW_LEFT,16.666),n=new ue(t.ARROW_RIGHT,16.666),r=new ue(t.ARROW_UP,16.666),l=new ue(t.ARROW_DOWN,16.666);s.addEventListener("holding",function(c){M.rotate(Dt*ze.DEG2RAD*c.deltaTime,0,!0),M.update(c.deltaTime)}),n.addEventListener("holding",function(c){M.rotate(-Dt*ze.DEG2RAD*c.deltaTime,0,!0),M.update(c.deltaTime)}),r.addEventListener("holding",function(c){M.rotate(0,-Dt*ze.DEG2RAD*c.deltaTime,!0),M.update(c.deltaTime)}),l.addEventListener("holding",function(c){M.rotate(0,Dt*ze.DEG2RAD*c.deltaTime,!0),M.update(c.deltaTime)})}let C,V;const Ce=new Ao(16777215);ne.add(Ce);function tt(){(d.mapMap||d.debug)&&d.dayNightCycle?Ce.intensity=1:d.generateColor?Ce.intensity=d.dayNightCycle?2:3:Ce.intensity=3}function ai(){if(!V)return;const t=Math.PI/2-C.elevation,e=Math.PI-C.azimuth,i=new D;i.setFromSphericalCoords(1,t,e),V.material.uniforms.sunPosition.value.copy(i)}function Pt(){ka()}function Ta(t,e=!1,i=!0){if(t===I)return;M.getPosition(_);const o=H.scaleRatio,a=S.sphericalToDatums(_.x/o,-_.z/o);it(null);const s=S.datumsToSpherical(t.lat,t.lon,null,o);if(e){const n=_t(a,t),r=d.elevation;let l=r;t.altitude&&(Ui=t.altitude+100,l=Ui);const c=n>1e5?11e3*d.exageration:l;so({from:{x:_.x,y:-_.z,progress:0},to:We(oe({},s),{progress:1}),duration:Math.min(n/20,3e3),preventComputeFeatures:!0,onUpdate:h=>{const w=h,{progress:m}=w,u=pi(w,["progress"]);if(m<=.5){const x=2*m;M.moveTo(u.x,(r+x*(c-r))*d.exageration*o,-u.y,!1)}else{const x=(m-.5)*2;M.moveTo(u.x,(c+x*(l-c))*d.exageration*o,-u.y,!1)}ve()},onEnd:()=>{I=t,He("elevation",l,!1),Pt(),si()}})}else t.altitude&&He("elevation",t.altitude,!1),M.moveTo(s.x,d.elevation*d.exageration*o,-s.y,!1),Pt(),i&&ve(),V&&(C.setPosition(t.lat,t.lon),M.getPosition(_),C.setWorldPosition(_),tt(),ai())}window.setPosition=Ta;function Ji(t=I,e,i=60){if($t=!1,t){const o=Ea(t,e);if(o===-1e5||isNaN(o))$t=!0;else{const a=Le||o,s=d.elevation-a;Le=o,s>0&&s<500&&He("elevation",Le+Math.max(s,i))}}else Le=void 0}function Ea(t,e){const i=L.heightProvider.maxZoom;let o=i,a;for(;!e&&o>i-3;)a=q.pointToTileFraction(t.lon,t.lat,o),e=Zo(a[2],Math.floor(a[0]),Math.floor(a[1])),o-=1;if(e&&e.heightLoaded&&e.userData.displacementMap.value){const s=e.userData.displacementMap.value,n=e.userData.displacementMapLocation.value,r=zi(Ai(s.image),n,t,e.level),l=d.elevationDecoder;return r[0]/255*l[0]+r[1]/255*l[1]+r[2]/255*l[2]+l[3]}else return-1e5}let si;function Da(t){si=Bi(function(){},t)}Da(100);function Pa(){M.getPosition(_);const t=H.scaleRatio,e=S.sphericalToDatums(_.x/t,-_.z/t);(!I||I.lat!==e.lat||I.lon!==e.lon)&&(C&&C.setWorldPosition(_),I=e,Ji(),si())}M.addEventListener("update",()=>{Be||Pa(),Qt()});M.addEventListener("controlend",()=>{yt(),M.getPosition(_);const t=H.scaleRatio,e=S.sphericalToDatums(_.x/t,-_.z/t);(!I||I.lat!==e.lat||I.lon!==e.lon||I.altitude!==d.elevation)&&(I=We(oe({},e),{altitude:d.elevation}),Pt()),he(!0)});let Lt=A.zoom;M.addEventListener("control",t=>{M.zooming;const e=M.trucking;Lt!==A.zoom&&(Lt=A.zoom,M.azimuthRotateSpeed=M.polarRotateSpeed=Tt()/Lt),ve(),O&&e&&za()});function La(t,e){window.nsWebViewBridge&&window.nsWebViewBridge.emit(t,typeof e=="function"?e():e)}class Ra extends Uo{constructor(e,i){super(e,i)}render(e,i,o,a,s){L.visible=!1,super.render(e,i,o,a,s),L.visible=!0}}const Rt=new zo(ne,A);Ve.addPass(Rt);const ni=new pa,_e=new Ra(A,ni);Ve.addPass(_e);let Qi=0;function eo(){let t,e,i=Ce.visible;Ce.visible=!1,V&&(t=V.visible,e=C.visible,V.visible=!1,C.visible=!1),Ne.uniforms.depthTexture.value=Ve.depthTexture,St(o=>{const a=o.isVisible();a&&(o.wasVisible=a,o.hide()),o.objectsHolder.visible=a||o.level===L.maxZoomForObjectHolders&&o.parentNode.subdivided}),d.debugFeaturePoints&&G.render(ne,A),G.setRenderTarget(Yt),G.clear(),G.render(ne,A),G.setRenderTarget(null),Ha(),Ne.uniforms.depthTexture.value=null,St(o=>{o.wasVisible&&(delete o.wasVisible,o.show()),o.objectsHolder.visible=o.isVisible()&&d.debugFeaturePoints||o.level===L.maxZoomForObjectHolders&&o.parentNode.subdivided}),V&&(V.visible=t,C.visible=e),Ce.visible=i}const Sa=Bi(eo,j?300:100);document.body.onresize=function(){qt=!0,W=window.innerWidth,$=window.innerHeight;const t=W/$;t>1?(Re=800,Se=Math.round(Re/t)):(Se=800,Re=Math.round(Se*t)),Qi=Fe/$*Se,pe.width=Math.floor(W*pt),pe.height=Math.floor($*pt),Zi=1+(pt-1)/2,G.setSize(W,$),G.setPixelRatio(Zi),Q=new Uint8Array(Re*Se*4),Yt.setSize(Re,Se),Ve.setSize(W,$),A.aspect=t,A.updateProjectionMatrix(),!L&&I&&ti(),yt(),he(!0)};document.body.onresize();ve();function Ca(t){const e=t.clone();e.project(A);const i=W/2,o=$/2;return e.x=e.x*i+i,e.y=-(e.y*o)+o,e.z=A.position.distanceTo(t),e}function ri(t,e){e(t),t.children.forEach(i=>{i instanceof E&&ri(i,e)}),t.childrenCache&&t.childrenCache.forEach(i=>{i instanceof E&&ri(i,e)})}function St(t){L&&ri(L.children[0],t)}function to(t,e,i,o,a,s,n=!1){const r=e.split(" ");let l="",c=1;for(let h=0;h<r.length;h++){const m=l+(h>0?" ":"")+r[h];t.measureText(m).width>a&&h>0?(n||t.fillText(l,i,o),l=r[h],o+=s,c++):l=m}if(n||t.fillText(l,i,o),n)return{x:i+t.measureText(l).width,y:o,nbLines:c}}function _a(t,e,i,o,a,s){o<2*s&&(s=o/2),a<2*s&&(s=a/2),t.beginPath(),t.moveTo(e+s,i),t.arcTo(e+o,i,e+o,i+a,s),t.arcTo(e+o,i+a,e,i+a,s),t.arcTo(e,i+a,e,i,s),t.arcTo(e,i,e+o,i,s),t.closePath()}function Oa(t,e){return t.length>e?t.slice(0,e-1)+"\u2026":t}function Aa(){const t={lat:O.geometry.coordinates[1],lon:O.geometry.coordinates[0],altitude:O.properties.ele},e=_t(I,t);Mt.innerText=O.properties.name+" "+O.properties.ele+"m("+Math.round(e/100)/10+"km)"}function za(){La("selected",()=>{let t=0;if(O){M.getPosition(_);const e=H.scaleRatio,i=S.sphericalToDatums(_.x/e,-_.z/e),o={lat:O.geometry.coordinates[1],lon:O.geometry.coordinates[0],altitude:O.properties.ele};return t=_t(i,o),We(oe({},O),{distance:t})}})}function it(t){ee=null,t!==O&&(O=t,Mt&&(O?Aa():Mt.innerText=null,Xi.style.visibility=O?"visible":"hidden"))}function li(t){return d.local?O&&t.properties.osmid===O.properties.osmid:O&&t.properties.name===O.properties.name&&t.properties.ele===O.properties.ele}function ci(t){return Math.sqrt(Math.pow(ee.x-t.x,2)+Math.pow(ee.y-t.y,2))}const Ge=j?26:44;function Ia(){if(!d.readFeatures||Be)return;const t=new Array(W);let e=-1e4,i;const o=[],a=H.scaleRatio;Vi.forEach(r=>{const l=S.datumsToSpherical(r.geometry.coordinates[1],r.geometry.coordinates[0],null,a),c=r.properties.ele||0;_.set(l.x,c*d.exageration*a,-l.y);const h=Ca(_),m=Math.floor(h.x),u=h.y,w=h.z;if(u<Fe-20||w>d.far*a+1e3||w/c>d.far*a/3e3)return;c>e&&(i=m,e=c),(t[m]=t[m]||[]).push(We(oe({},r),{x:m,y:u,z:w}))});let s=i;function n(r,l,c){const h=t.slice(r,l).filter(u=>Boolean(u)).flat();if(h.length===0)return s+=c,!0;let m;if(ee&&ee.x>=r&&ee.x<=l){const u=h.reduce((w,x)=>ci(w)<ci(x)?w:x);ci(u)<20&&(m=u,it(m))}if(!m&&O){const u=h.findIndex(w=>li(w));u!==-1&&(m=h[u])}m||(m=h.reduce((u,w)=>Math.pow(u.properties.ele,2)>Math.pow(w.properties.ele,2)?u:w)),s=m.x+c,o.push(m)}for(s=i-Ge/2;s<W;)!n(s,s+Ge,Ge);for(s=i-Ge;s>=0;)!n(s-Ge,s,-Ge);hi(o)}const ot=15,io=-Math.PI/4,Na=Math.round(Fe/Math.cos(io)-20),oo=-16,ao=21,Ct=!j;function hi(t){const e=pt,i=t.length;P.save(),P.clearRect(0,0,pe.width,pe.height),P.scale(e,e);const o=d.dark?"white":"black",a=d.dark?"#000000":"#ffffff";let s,n,r,l,c,h,m,u,w,x;for(let g=0;g<i;g++){s=t[g],n=s.y,r=O&&li(s),d.drawLines&&n>Fe&&(P.beginPath(),P.strokeStyle=o,P.lineWidth=r?3:1,P.moveTo(s.x,Fe),P.lineTo(s.x,n),P.closePath(),P.stroke()),P.save(),P.translate(s.x,Fe),P.rotate(io),r?P.font=`bold ${ot}px Noto Sans`:P.font=`${ot}px Noto Sans`,l=Ct?s.properties.name:Oa(s.properties.name,30),c=P.measureText(l).width,h=Math.min(c,Na);let b={y:Ct&&d.drawElevations?ot:0,x:Ct?0:h};Ct&&c!==h&&(b=to(P,l,5,0,h,ot,!0));let f=h+10,p;if(d.drawElevations&&(p=s.properties.ele+"m",m=P.measureText(p).width,f+=m-5),ee&&(u=P.getTransform().inverse(),w=new DOMPoint(ee.x*e,ee.y*e),x=w.matrixTransform(u),x.x>=0&&x.x<f&&x.y<-oo&&x.y>=-(ao+b.y))){let v=O!==s;if(it(s),v)return P.restore(),P.restore(),hi(t)}P.fillStyle=a+"cc",_a(P,0,oo,f,ao+b.y,8),P.fill(),P.fillStyle=o,b.y!==0?to(P,l,5,0,h,ot):P.fillText(l,5,0),d.drawElevations&&(P.font="normal 11px Courier",P.fillText(p,b.x+10,b.y)),P.restore()}P.restore(),ee&&O&&(it(null),hi(t))}function Ha(){const t=Re;G.readRenderTargetPixels(Yt,0,0,Re,Se,Q);const e=[],i=[];let o=Boolean(O),a;function s(r){const l=e.indexOf(a);if(l===-1){const c=Oi[a];if(c){e.push(a);const h=oe({},c);return i.push(h),o&&li(c)&&(o=!1),h}}else return i[l]}const n=Q.length-Qi*4*t;for(let r=0;r<n;r+=4)if(Q[r+3]!==0&&(Q[r]!==0||Q[r+1]!==0||Q[r+2]!==0)){const l=(Q[r]<<16)+(Q[r+1]<<8)+Q[r+2];a!==l&&(a&&s(),a=l)}else a&&(s(),a=null);a&&(s(),a=null),o&&it(null),Vi=i}function di(){return(d.debug||d.mapMap||d.generateColor)&&!d.outline}function Fa(t){Ve.render(ki.getDelta()),!Be&&d.readFeatures&&Q&&(t?eo():Sa()),Ia()}function he(t=!1){!qt||(!gt&&t&&(gt=t),Xt||(Xt=!0,requestAnimationFrame(Ba)))}function Ba(){Xt=!1,!(!G||!Ve||!L)&&(Fa(gt),gt=!1,ce&&ce.update())}document.addEventListener("DOMContentLoaded",function(){const t=Object.assign({},d,{setPosition:{lat:45.1811,lon:5.8141,altitude:2144},setAzimuth:0,terrarium:ke.terrarium});Ua(t)});function so({from:t,to:e,duration:i,onUpdate:o,onEnd:a,preventComputeFeatures:s}){Be=s,Be&&P.clearRect(0,0,pe.width,pe.height),new ko({onRender:o,onFinish:()=>{a&&a(),Be=!1,he(!0)}}).tween(t,e,i)}function Va(t,e=!0,i=!0){const o=M.azimuthAngle*jt%360;o!==t&&(Math.abs(t-360-o)<Math.abs(t-o)&&(t=t-360),e?so({from:{progress:o},to:{progress:t},duration:200,onUpdate:function(a){M.azimuthAngle=a.progress*se,ve()}}):(M.azimuthAngle=t*se,i&&ve()))}window.setAzimuth=Va;function Ua(t){try{vt=!1,Object.keys(t).sort().forEach(e=>{const i=t[e];He(e,i,!1,!1)}),vt=!0,L||ti(),ve(),he(!0)}catch(e){console.error(e)}}function _t(t,e){const i=(t.latitude||t.lat)*se,o=(t.longitude||t.lon)*se,a=(e.latitude||e.lat)*se,s=(e.longitude||e.lon)*se;return Math.round(Math.acos(Math.sin(a)*Math.sin(i)+Math.cos(a)*Math.cos(i)*Math.cos(o-s))*S.EARTH_RADIUS)}function ka(){if(!I)return 0;var t=new D(0,0,-A.far);t.applyMatrix4(A.matrixWorld);const e=H.scaleRatio,i=S.sphericalToDatums(t.x/e,-t.z/e);return _t(I,i)}
