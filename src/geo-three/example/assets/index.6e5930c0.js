var ho=Object.defineProperty,uo=Object.defineProperties;var fo=Object.getOwnPropertyDescriptors;var nt=Object.getOwnPropertySymbols;var fi=Object.prototype.hasOwnProperty,mi=Object.prototype.propertyIsEnumerable;var pi=(t,e,i)=>e in t?ho(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,X=(t,e)=>{for(var i in e||(e={}))fi.call(e,i)&&pi(t,i,e[i]);if(nt)for(var i of nt(e))mi.call(e,i)&&pi(t,i,e[i]);return t},Me=(t,e)=>uo(t,fo(e));var gi=(t,e)=>{var i={};for(var o in t)fi.call(t,o)&&e.indexOf(o)<0&&(i[o]=t[o]);if(t!=null&&nt)for(var o of nt(t))e.indexOf(o)<0&&mi.call(t,o)&&(i[o]=t[o]);return i};import{M as rt,G as mo,T as J,R as lt,L as ue,B as je,F as q,V as ye,a as D,b as Nt,c as Ht,d as ct,e as po,Q as go,t as K,f as Ae,g as ht,N as ze,h as vi,D as wi,U as vo,C as $e,i as wo,S as xi,j as Mi,k as xo,l as Mo,m as yi,n as yo,o as bi,P as bo,p as To,q as dt,r as Eo,s as Do,u as Po,v as Ro,w as Ie,x as Co,W as So,y as Lo,z as _o,E as Oo,A as Ao,H as zo,I as Io,K as fe,J as No,O as Ho,X as Bo,Y as Fo,Z as Vo,_ as ko,$ as Uo,a0 as Ti,a1 as Go,a2 as Zo,a3 as Wo}from"./vendor.1d39e390.js";const jo=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const n of s.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&o(n)}).observe(document,{childList:!0,subtree:!0});function i(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerpolicy&&(s.referrerPolicy=a.referrerpolicy),a.crossorigin==="use-credentials"?s.credentials="include":a.crossorigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(a){if(a.ep)return;a.ep=!0;const s=i(a);fetch(a.href,s)}};jo();class Xe{static createOffscreenCanvas(e,i){try{return new OffscreenCanvas(e,i)}catch{let a=document.createElement("canvas");return a.width=e,a.height=i,a}}}const ut=new Map;function $o(t,e,i){return ut.get(`${t}_${e}_${i}`)}function Xo(){ut.clear()}function qe(t){var e;t.childrenCache&&(t.childrenCache.forEach(qe),t.childrenCache=null,t.nodesLoaded=0),((e=t.children)==null?void 0:e.length)>0&&(t.children.forEach(i=>i instanceof E&&qe(i)),t.children=[]),t.dispose()}const me=class extends rt{constructor(t=null,e=null,i=me.root,o=0,a=0,s=0,n=null,r=null){super(n,r);this.mapView=null,this.parentNode=null,this.textureLoaded=!1,this.nodesLoaded=0,this.subdivided=!1,this.childrenCache=null,this.mapView=e,this.parentNode=t,this.location=i,this.level=o,this.x=a,this.y=s,ut.set(`${o}_${a}_${s}`,this);const l=e.nodeShouldAutoLoad();this.isMesh=!1,this.matrixAutoUpdate=!1,this.isTextureReady=l,this.objectsHolder=new mo,this.objectsHolder.visible=!l,this.add(this.objectsHolder),l&&this.initialize()}initialize(){}dispose(){this.mapView.provider.cancelTile(this.level,this.x,this.y),this.geometry=null,this.material=null,this.objectsHolder=null,this.mapView=null,this.parentNode=null,ut.delete(`${this.level}_${this.x}_${this.y}`)}createChildNodes(){}subdivide(){const t=this.mapView,e=Math.min(t.provider.actualMaxZoom,t.heightProvider.actualMaxZoom);this.subdivided||this.level+1>e||(this.subdivided=!0,this.childrenCache!==null?(this.childrenCache.forEach(i=>{i instanceof me&&(i.textureLoaded?i.show():i.hide())}),this.children=this.childrenCache,this.nodesLoaded>=me.childrens&&this.hide()):this.createChildNodes())}simplify(t,e){var i,o,a,s;!this.subdivided||(this.subdivided=!1,this.mapView.lowMemoryUsage||t>e/100||((i=this.parentNode)==null?void 0:i.subdivided)&&((a=(o=this.parentNode)==null?void 0:o.parentNode)==null?void 0:a.subdivided)?(((s=this.children)==null?void 0:s.length)&&(this.children.forEach(n=>n instanceof me&&qe(n)),this.children=[]),this.childrenCache&&(this.childrenCache.forEach(n=>n instanceof me&&qe(n)),this.childrenCache=null,this.nodesLoaded=0)):(this.childrenCache=this.children,this.childrenCache&&this.childrenCache.forEach(n=>{n.childrenCache&&n.children.length>1&&(n.childrenCache=null,n.nodesLoaded=0)})),this.show(),this.didSimplify())}didSimplify(){this.children=[this.objectsHolder]}show(){this.isMesh=!0,this.objectsHolder.visible=!0}isVisible(){return this.isMesh}hide(){this.isMesh=!1,this.objectsHolder.visible=!1}onTextureImage(t){if(t){const e=new J(t);e.generateMipmaps=!1,e.format=lt,e.magFilter=ue,e.minFilter=ue,e.needsUpdate=!0,this.material.map=e}}setMaterialValues(t){const e=this.material.userData;Object.keys(t).forEach(i=>{e.hasOwnProperty(i)&&(e[i].value=t[i])})}loadTexture(){if(!this.isTextureReady)return this.isTextureReady=!0,this.mapView.provider.fetchTile(this.level,this.x,this.y).then(t=>this.onTextureImage(t)).catch(()=>{const t=Xe.createOffscreenCanvas(1,1),e=t.getContext("2d");e.fillStyle="#FF0000",e.fillRect(0,0,1,1);const i=new J(t);i.generateMipmaps=!1,i.needsUpdate=!0,this.material.map=i}).catch(t=>{console.error("error fetching image",t)}).finally(()=>{!this.mapView||(this.textureLoaded=!0,this.nodeReady())})}nodeReady(){this.subdivided||this.show();const t=this.parentNode;t!==null?(t.nodesLoaded++,t.nodesLoaded>=me.childrens&&(t.children.forEach((e,i)=>{e instanceof me&&(e.subdivided?e.hide():e.show())}),t.subdivided===!0&&t.hide())):this.subdivided||this.show(),this.mapView.onNodeReady(this)}getNeighborsDirection(t){return null}getNeighbors(){return[]}};let E=me;E.baseGeometry=null;E.baseScale=null;E.childrens=4;E.root=-1;E.topLeft=0;E.topRight=1;E.bottomLeft=2;E.bottomRight=3;class Q extends je{constructor(e=1,i=1,o=1,a=1,s={skirt:!1,skirtDepth:10,uvs:!0}){super();const n=[],r=[],l=s.uvs?[]:void 0;Q.buildPlane(e,i,o,a,n,r,l),s.skirt&&Q.buildSkirt(e,i,o,a,s.skirtDepth,n,r,l),this.setIndex(n),this.setAttribute("position",new q(r,3)),s.uvs&&this.setAttribute("uv",new q(l,2))}static buildPlane(e=1,i=1,o=1,a=1,s,n,r){const l=e/2,c=i/2,h=o+1,m=a+1,u=e/o,w=i/a;for(let x=0;x<m;x++){const g=x*w-c;for(let b=0;b<h;b++){const f=b*u-l;n.push(f,0,g),r&&r.push(b/o,1-x/a)}}for(let x=0;x<a;x++)for(let g=0;g<o;g++){const b=g+h*x,f=g+h*(x+1),p=g+1+h*(x+1),v=g+1+h*x;s.push(b,f,v,f,p,v)}}static buildSkirt(e=1,i=1,o=1,a=1,s,n,r,l){const c=e/2,h=i/2,m=o+1,u=a+1,w=e/o,x=i/a;let g=r.length/3;for(let f=0;f<m;f++){const p=f*w-c,v=-h;r.push(p,-s,v),l&&l.push(f/o,1)}for(let f=0;f<o;f++){const p=f,v=f+1,T=f+g,y=f+g+1;n.push(v,T,p,v,y,T)}g=r.length/3;for(let f=0;f<m;f++){const p=f*w-c,v=a*x-h;r.push(p,-s,v),l&&l.push(f/o,0)}let b=m*u-o-1;for(let f=0;f<o;f++){const p=b+f,v=b+f+1,T=f+g,y=f+g+1;n.push(p,T,v,T,y,v)}g=r.length/3;for(let f=0;f<u;f++){const p=f*x-h,v=-c;r.push(v,-s,p),l&&l.push(0,1-f/a)}for(let f=0;f<a;f++){const p=f*u,v=(f+1)*u,T=f+g,y=f+g+1;n.push(p,T,v,T,y,v)}g=r.length/3;for(let f=0;f<u;f++){const p=f*x-h,v=o*w-c;r.push(v,-s,p),l&&l.push(1,1-f/a)}for(let f=0;f<a;f++){const p=f*u+a,v=(f+1)*u+a,T=f+g,y=f+g+1;n.push(v,T,p,v,y,T)}}}const be=class{static get(t,e){navigator.geolocation.getCurrentPosition(function(i){t(i.coords,i.timestamp)},e)}static datumsToSpherical(t,e,i,o=1){const a=e*be.EARTH_ORIGIN/180;let s=Math.log(Math.tan((90+t)*Math.PI/360))/(Math.PI/180);return s=s*be.EARTH_ORIGIN/180,i?i.set(a*o,s*o):new ye(a*o,s*o)}static sphericalToDatums(t,e){const i=t/be.EARTH_ORIGIN*180;let o=e/be.EARTH_ORIGIN*180;return o=180/Math.PI*(2*Math.atan(Math.exp(o*Math.PI/180))-Math.PI/2),{lat:Math.round(o*1e4)/1e4,lon:Math.round(i*1e4)/1e4}}static quadtreeToDatums(t,e,i){const o=Math.pow(2,t),a=e/o*360-180,s=Math.atan(Math.sinh(Math.PI*(1-2*i/o)));return{lat:180*(s/Math.PI),lon:a}}};let S=be;S.EARTH_RADIUS=6378137;S.EARTH_PERIMETER=2*Math.PI*be.EARTH_RADIUS;S.EARTH_ORIGIN=be.EARTH_PERIMETER/2;const Bt=class extends E{constructor(t=null,e=null,i=E.root,o=0,a=0,s=0){super(t,e,i,o,a,s,Bt.geometry,new Nt({wireframe:!1}));this.matrixAutoUpdate=!1}initialize(){return this.loadTexture()}createChildNodes(){const t=this.level+1,e=this.x*2,i=this.y*2,o=Object.getPrototypeOf(this).constructor;let a=new o(this,this.mapView,E.topLeft,t,e,i);a.scale.set(.5,1,.5),a.position.set(-.25,0,-.25),this.add(a),a.updateMatrix(),a.updateMatrixWorld(!0),a=new o(this,this.mapView,E.topRight,t,e+1,i),a.scale.set(.5,1,.5),a.position.set(.25,0,-.25),this.add(a),a.updateMatrix(),a.updateMatrixWorld(!0),a=new o(this,this.mapView,E.bottomLeft,t,e,i+1),a.scale.set(.5,1,.5),a.position.set(-.25,0,.25),this.add(a),a.updateMatrix(),a.updateMatrixWorld(!0),a=new o(this,this.mapView,E.bottomRight,t,e+1,i+1),a.scale.set(.5,1,.5),a.position.set(.25,0,.25),this.add(a),a.updateMatrix(),a.updateMatrixWorld(!0)}raycast(t,e){return this.isVisible()?super.raycast(t,e):!1}};let ce=Bt;ce.geometry=new Q(1,1,1,1,{skirt:!1});ce.baseGeometry=Bt.geometry;ce.baseScale=new D(S.EARTH_PERIMETER,1,S.EARTH_PERIMETER);class qo extends je{constructor(e=1,i=1,o=1,a=1,s=!1,n=10,r=null,l=!0){super();const c=[],h=[],m=[],u=[];Q.buildPlane(e,i,o,a,c,h,u);const w=r.data;for(let x=0,g=0;x<w.length&&g<h.length;x+=4,g+=3){const b=w[x],f=w[x+1],p=w[x+2],v=(b*65536+f*256+p)*.1-1e4;h[g+1]=v}s&&Q.buildSkirt(e,i,o,a,n,c,h,u),this.setIndex(c),this.setAttribute("position",new q(h,3)),this.setAttribute("normal",new q(m,3)),this.setAttribute("uv",new q(u,2)),l&&this.computeNormals(o,a)}computeNormals(e,i){const o=this.getAttribute("position");if(o!==void 0){let a=this.getAttribute("normal");const s=i*e;for(let g=0;g<s;g++)a.setXYZ(g,0,0,0);const n=new D,r=new D,l=new D,c=new D,h=new D,m=new D,u=new D,w=new D,x=i*e*6;for(let g=0;g<x;g+=3){const b=this.index.getX(g+0),f=this.index.getX(g+1),p=this.index.getX(g+2);n.fromBufferAttribute(o,b),r.fromBufferAttribute(o,f),l.fromBufferAttribute(o,p),u.subVectors(l,r),w.subVectors(n,r),u.cross(w),c.fromBufferAttribute(a,b),h.fromBufferAttribute(a,f),m.fromBufferAttribute(a,p),c.add(u),h.add(u),m.add(u),a.setXYZ(b,c.x,c.y,c.z),a.setXYZ(f,h.x,h.y,h.z),a.setXYZ(p,m.x,m.y,m.z)}this.normalizeNormals(),a.needsUpdate=!0}}}const ae=class extends E{constructor(t=null,e=null,i=E.root,o=0,a=0,s=0,n=ae.geometry,r=new Ht({color:0,emissive:16777215})){super(t,e,i,o,a,s,n,r);this.heightLoaded=!1,this.heightListeners=[],this.matrixAutoUpdate=!1;const l=e.nodeShouldAutoLoad();this.isHeightReady=l}initialize(){return super.initialize(),Promise.all([this.loadTexture(),this.loadHeightGeometry()])}dispose(){this.mapView.heightProvider.cancelTile(this.level,this.x,this.y),super.dispose()}onTextureImage(t){if(t){const e=new J(t);e.generateMipmaps=!1,e.format=lt,e.magFilter=ue,e.minFilter=ue,e.needsUpdate=!0,this.material.map=e}}loadTexture(){if(!this.isTextureReady)return this.isTextureReady=!0,this.mapView.provider.fetchTile(this.level,this.x,this.y).then(t=>this.onTextureImage(t)).finally(()=>{this.textureLoaded=!0,this.nodeReady()})}nodeReady(){!this.mapView||!this.heightLoaded||!this.textureLoaded||super.nodeReady()}createChildNodes(){const t=this.level+1;var e=Object.getPrototypeOf(this);const i=this.x*2,o=this.y*2;let a=new e.constructor(this,this.mapView,E.topLeft,t,i,o);a.scale.set(.5,1,.5),a.position.set(-.25,0,-.25),this.add(a),a.updateMatrix(),a.updateMatrixWorld(!0),a=new e.constructor(this,this.mapView,E.topRight,t,i+1,o),a.scale.set(.5,1,.5),a.position.set(.25,0,-.25),this.add(a),a.updateMatrix(),a.updateMatrixWorld(!0),a=new e.constructor(this,this.mapView,E.bottomLeft,t,i,o+1),a.scale.set(.5,1,.5),a.position.set(-.25,0,.25),this.add(a),a.updateMatrix(),a.updateMatrixWorld(!0),a=new e.constructor(this,this.mapView,E.bottomRight,t,i+1,o+1),a.scale.set(.5,1,.5),a.position.set(.25,0,.25),this.add(a),a.updateMatrix(),a.updateMatrixWorld(!0)}async handleParentOverZoomTile(t){throw new Error("not implemented")}async loadHeightGeometry(){if(this.isHeightReady||!this.mapView)return;this.isHeightReady=!0;const t=this.mapView.heightProvider;if(t===null)throw new Error("GeoThree: MapView.heightProvider provider is null.");try{const e=this.level;if(e>t.maxZoom&&e<=t.maxZoom+t.maxOverZoom){const i=this.parentNode;if(i.heightLoaded)await this.handleParentOverZoomTile();else{const o=new Promise(a=>{i.heightListeners.push(()=>this.handleParentOverZoomTile(a))});i.isHeightReady||i.loadHeightGeometry(),await o}}else{const i=await this.mapView.heightProvider.fetchTile(e,this.x,this.y);await this.onHeightImage(i)}}finally{this.mapView&&(this.heightLoaded=!0,this.heightListeners.forEach(e=>e()),this.nodeReady()),this.heightListeners=[]}}onHeightImage(t){const e=Xe.createOffscreenCanvas(ae.geometrySize+1,ae.geometrySize+1),i=e.getContext("2d");i.imageSmoothingEnabled=!1,i.drawImage(t,0,0,ae.tileSize,ae.tileSize,0,0,e.width,e.height);const o=i.getImageData(0,0,e.width,e.height),a=new qo(1,1,ae.geometrySize,ae.geometrySize,!0,10,o,!0);this.geometry=a}raycast(t,e){return this.isVisible()?super.raycast(t,e):!1}};let Y=ae;Y.tileSize=256;Y.geometrySize=16;Y.geometry=new Q(1,1,ae.geometrySize,ae.geometrySize);Y.baseGeometry=ce.geometry;Y.BASE_SCALE=new D(S.EARTH_PERIMETER,1,S.EARTH_PERIMETER);const Ei=new ct,Di=new D,Ft=new po,Vt=new D;class Ko{constructor(){this.subdivideDistance=120,this.simplifyDistance=400,this.testCenter=!0,this.pointOnly=!1,this.toHandle=new Set,this.handled=new Set}isChildReady(e){return e.isTextureReady&&(!(e instanceof Y)||e.isHeightReady)}handleNode(e,i,o,a,s,n=!1,r=!0,l=!0){if(!(e instanceof E)||i.has(e)||!e.mapView)return;i.add(e),e.getWorldPosition(Vt);var c=Di.distanceTo(Vt);const h=c/Math.pow(2,20-e.level);if(n=n||(this.pointOnly?Ft.containsPoint(Vt):Ft.intersectsObject(e)),r&&s>e.level&&h<this.subdivideDistance&&n){e.subdivide();const m=e.children;if(m)for(let u=0;u<m.length;u++){const w=m[u];w instanceof E&&this.handleNode(w,i,o,a,s,!1,!0,!1)}e.hide()}else if(l&&(e.level>s||(!n||a<e.level)&&h>this.simplifyDistance)&&e.parentNode){const m=e.parentNode;m.simplify(h,o.far),this.handleNode(m,i,o,a,s,!1,!1,!0)}else(!l&&!r||n||h<this.simplifyDistance)&&a<=e.level&&c<o.far&&(this.isChildReady(e)||e.initialize())}getChildrenToTraverse(e){const i=this.toHandle;i.clear();function o(a){a instanceof E&&!a.subdivided?i.add(a):a.children.forEach(s=>{a instanceof E&&o(s)})}return o(e),i}updateLOD(e,i,o,a,s=!1){if(!s&&this.lastMatrix&&this.lastMatrix.equals(i.matrixWorldInverse))return;this.lastMatrix||(this.lastMatrix=new ct),this.lastMatrix.copy(i.matrixWorldInverse),Ei.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),Ft.setFromProjectionMatrix(Ei),i.getWorldPosition(Di);const n=e.provider.minZoom,r=e.provider.maxZoom+e.provider.maxOverZoom,l=this.getChildrenToTraverse(e.children[0]);let c=this.handled;l.forEach(h=>this.handleNode(h,c,i,n,r)),c.clear()}}class Te{constructor(e,i){this.fulfilled=!1,this.rejected=!1,this.called=!1,this.cancelRunner=i;const o=s=>{this.fulfilled=!0,this.value=s,typeof this.onResolve=="function"&&(this.onResolve(this.value),this.called=!0)},a=this.rejectHandler=s=>{this.rejected=!0,this.value=s,typeof this.onReject=="function"&&(this.onReject(this.value),this.called=!0)};try{e(o,a)}catch(s){a(s)}}cancel(){return this.cancelRunner?(this.cancelRunner()||this.rejectHandler("cancelled"),!0):!1}then(e){return this.onResolve=e,this.fulfilled&&!this.called&&(this.called=!0,this.onResolve(this.value)),this}catch(e){return this.onReject=e,this.rejected&&!this.called&&(this.called=!0,this.onReject(this.value)),this}finally(e){return this}static resolve(e){return new Te(function(o,a){o(e)})}static reject(e){return new Te(function(o,a){a(e)})}static all(e){const i=[],o=[];function a(s,n){e.forEach((r,l)=>r.then(c=>{if(i.push(!0),o[l]=c,i.length===e.length)return s(o)}).catch(c=>n(c)))}return new Te(a)}}class Yo{constructor(){this.values=new Map,this.maxEntries=20}get(e){const i=this.values.has(e);let o;return i&&(o=this.values.get(e),this.values.delete(e),this.values.set(e,o)),o}put(e,i){if(this.values.size>=this.maxEntries){const o=this.values.keys().next().value;this.values.delete(o)}this.values.set(e,i)}}class Jo{constructor(e,i,o){this.abortController=new AbortController,this.load(e,i,o),this.url=e.url}async load(e,i,o){try{const a=ft[e.url],s=a.fetchOptions;s.signal=this.abortController.signal;const n=await fetch(e.url,s);let r;switch((s==null?void 0:s.output)||"arraybuffer"){case"json":r=await n.json();break;case"blob":r=await n.blob();break;case"text":r=await n.text();break;case"imageBitmap":{const l=await n.blob();r=await createImageBitmap(l,a);break}default:r=await n.arrayBuffer();break}i(r),delete ft[e.url]}catch(a){o(a),delete ft[e.url]}}cancel(){this.abortController.abort()}}const ft={},Pi=new go(Jo,50);class Ri{constructor(e={}){this.cache=new Yo,this.options=e}async load(e,i){e===void 0&&(e="");const o=this.cache.get(e);if(o!==void 0)return o;const a=X({},this.options);return a.fetchOptions=X(X({},a.fetchOptions||{}),i||{}),ft[e]=a,new Promise((s,n)=>{Pi.add(e,function(r,l){l instanceof Error?n(l):s(l)},n)}).then(s=>(s&&this.cache.put(e,s),s))}cancel(e){Pi.cancel(e)}}class Qo extends Ri{constructor(e={}){super(X({premultiplyAlpha:"none",colorSpaceConversion:"none"},e));this.options.fetchOptions=this.options.fetchOptions||{},this.options.fetchOptions.output||(this.options.fetchOptions.output="imageBitmap")}}let kt={},Ut={};function Ci(t){const e=JSON.stringify(t||{});return kt[e]||(kt[e]=new Qo(t)),kt[e]}function ea(t){const e=JSON.stringify(t||{});return Ut[e]||(Ut[e]=new Ri(t)),Ut[e]}class Gt{constructor(){this.name="",this.minZoom=0,this.maxZoom=20,this.maxOverZoom=0,this.zoomDelta=0,this.minLevelForZoomDelta=0,this.bounds=[],this.center=[],this.fetchingTilesPromises=new Map}get actualMaxZoom(){return this.maxZoom+this.maxOverZoom}fetchImage(e,i,o){return null}getMetaData(){}async fetchTileImage(e,i,o){const a=`${e}_${i}_${o}`,s=this.fetchingTilesPromises[a]=this.fetchImage(e,i,o);this.fetchingTilesPromises[a]=s;try{return await s}finally{delete this.fetchingTilesPromises[a]}}cancelTile(e,i,o){const a=`${e}_${i}_${o}`,s=this.fetchingTilesPromises[a];s&&(s.cancel(),delete this.fetchingTilesPromises[a])}async fetchTile(e,i,o){return this.fetchTileImage(e,i,o)}}const ta=Ci({imageOrientation:"flipY",fetchOptions:{credentials:"same-origin"}});function Si(t,e){if(t[0][2]===e)return t;if(t[0][2]<e){var i=[];return t.forEach(function(o){i=i.concat(K.getChildren(o))}),Si(i,e)}else{var t=t.map(function(a){const s=K.tileToBBOX(a);return K.pointToTile(s[0]+(s[2]-s[0])/2,s[1]+(s[3]-s[1])/2,e)});return t}}function ia(t,e){var i=Si(t,e);return i}class Li extends Gt{constructor(e){super();this.address=e}getImageBitmapLoader(){return ta}async fetchTileImage(e,i,o){const a=`${e}_${i}_${o}`;let s;if(this.zoomDelta<=0||this.minLevelForZoomDelta>e)s=this.fetchingTilesPromises[a]=this.fetchImage(e,i,o);else{const n=ia([[i,o,e]],e+this.zoomDelta).sort((l,c)=>c[1]-l[1]||l[0]-c[0]);let r;s=new Te((l,c)=>{Promise.all(r=n.map(h=>this.fetchImage(h[2],h[0],h[1]))).then(h=>{try{if(r=null,h=h.filter(T=>Boolean(T)),!h||!h.length)return l(null);const u=h[0].width*Math.floor(this.zoomDelta*2),w=u/Math.sqrt(h.length),x=Xe.createOffscreenCanvas(u,u);var m=x.getContext("2d");let g=n[0][1],b=0,f=0,p,v;h.forEach((T,y)=>{g!==n[y][1]&&(g=n[y][1],b=0,f+=1),p=b*w,v=f*w,m.save(),m.drawImage(T,p,v,w,w),m.restore(),b+=1}),l(createImageBitmap(x))}catch(u){c(u)}}).catch(function(h){r=null,c(h)})},function(){return r&&(r.forEach(l=>l.cancel()),r=null),!0})}this.fetchingTilesPromises[a]=s;try{return await s}finally{delete this.fetchingTilesPromises[a]}}fetchImage(e,i,o){const a=this.buildURL(e,i,o);return new Te(async(s,n)=>{try{const r=await this.getImageBitmapLoader().load(a);s(r)}catch(r){console.log("catched error",r),n(r)}},()=>(this.getImageBitmapLoader().cancel(a),!0))}}class _i extends Li{constructor(e="https://a.tile.openstreetmap.org/"){super(e);this.format="png"}buildURL(e,i,o){return this.address+e+"/"+i+"/"+o+"."+this.format}}class Oi extends je{constructor(e,i,o,a,s,n,r){super();const l=n+r;let c=0;const h=[],m=new D,u=new D,w=[],x=[],g=[],b=[];for(let f=0;f<=o;f++){const p=[],v=f/o;for(let T=0;T<=i;T++){const y=T/i;m.x=-e*Math.cos(a+y*s)*Math.sin(n+v*r),m.y=e*Math.cos(n+v*r),m.z=e*Math.sin(a+y*s)*Math.sin(n+v*r),x.push(m.x,m.y,m.z),u.set(m.x,m.y,m.z).normalize(),g.push(u.x,u.y,u.z),b.push(y,1-v),p.push(c++)}h.push(p)}for(let f=0;f<o;f++)for(let p=0;p<i;p++){const v=h[f][p+1],T=h[f][p],y=h[f+1][p],xe=h[f+1][p+1];(f!==0||n>0)&&w.push(v,T,xe),(f!==o-1||l<Math.PI)&&w.push(T,y,xe)}this.setIndex(w),this.setAttribute("position",new q(x,3)),this.setAttribute("normal",new q(g,3)),this.setAttribute("uv",new q(b,2))}}const Zt=class extends E{constructor(t=null,e=null,i=E.root,o=0,a=0,s=0){super(t,e,i,o,a,s,Zt.createGeometry(o,a,s),new Nt({wireframe:!1}));this.applyScaleNode(),this.matrixAutoUpdate=!1}initialize(){return this.loadTexture()}static createGeometry(t,e,i){const o=Math.pow(2,t),a=40,s=Math.floor(Zt.segments*(a/(t+1))/a),n=1/o*2*Math.PI,r=e*n,l=1/o*Math.PI,c=i*l;return new Oi(1,s,s,r,n,c,l)}applyScaleNode(){this.geometry.computeBoundingBox();const e=this.geometry.boundingBox.clone().getCenter(new D),i=new ct;i.compose(new D(-e.x,-e.y,-e.z),new Ae,new D(S.EARTH_RADIUS,S.EARTH_RADIUS,S.EARTH_RADIUS)),this.geometry.applyMatrix4(i),this.position.copy(e),this.updateMatrix(),this.updateMatrixWorld()}updateMatrix(){this.matrix.setPosition(this.position),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t=!1){(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorld.copy(this.matrix),this.matrixWorldNeedsUpdate=!1)}createChildNodes(){const t=this.level+1,e=this.x*2,i=this.y*2,o=Object.getPrototypeOf(this).constructor;let a=new o(this,this.mapView,E.topLeft,t,e,i);this.add(a),a.updateMatrix(),a.updateMatrixWorld(!0),a=new o(this,this.mapView,E.topRight,t,e+1,i),this.add(a),a.updateMatrix(),a.updateMatrixWorld(!0),a=new o(this,this.mapView,E.bottomLeft,t,e,i+1),this.add(a),a.updateMatrix(),a.updateMatrixWorld(!0),a=new o(this,this.mapView,E.bottomRight,t,e+1,i+1),this.add(a),a.updateMatrix(),a.updateMatrixWorld(!0)}raycast(t,e){return this.isVisible()?super.raycast(t,e):!1}};let mt=Zt;mt.baseGeometry=new Oi(S.EARTH_RADIUS,64,64,0,2*Math.PI,0,Math.PI);mt.baseScale=new D(1,1,1);mt.segments=80;const Ee=class extends Y{constructor(t=null,e=null,i=E.root,o=0,a=0,s=0){super(t,e,i,o,a,s,Ee.geometry,Ee.prepareMaterial(new Ht({map:Ee.EMPTY_TEXTURE})));this.heightMapLocation=[0,0,1,1],this.overZoomFactor=1,this.frustumCulled=!1}static prepareMaterial(t){return t.userData={heightMap:{value:Ee.EMPTY_TEXTURE},elevationDecoder:{value:Ee.ELEVATION_DECODER},heightMapLocation:{value:new ht}},t.onBeforeCompile=e=>{for(const i in t.userData)e.uniforms[i]=t.userData[i];e.vertexShader=`
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
			`)},t}onHeightImage(t){if(t){const e=new J(t);e.generateMipmaps=!1,e.format=lt,e.magFilter=ze,e.minFilter=ze,e.needsUpdate=!0,this.material.userData.heightMap.value=e}}async handleParentOverZoomTile(t){const e=K.tileToBBOX([this.x,this.y,this.level]),i=this.parent,o=i.overZoomFactor,a=K.tileToBBOX([i.x,i.y,i.level]),s=a[2]-a[0],n=a[3]-a[1];this.overZoomFactor=o*2,this.heightMapLocation[0]=i.heightMapLocation[0]+Math.floor((e[0]-a[0])/s*10)/10/o,this.heightMapLocation[1]=i.heightMapLocation[1]+Math.floor((e[1]-a[1])/n*10)/10/o,this.heightMapLocation[2]=this.heightMapLocation[3]=1/this.overZoomFactor,this.material.userData.heightMapLocation.value.set(...this.heightMapLocation),await this.onHeightImage(i.material.userData.heightMap.value),t&&t()}raycast(t,e){if(this.isVisible()){this.geometry=ce.geometry;const i=super.raycast(t,e);return this.geometry=Ee.geometry,i}return!1}};let De=Ee;De.ELEVATION_DECODER=[6553.6*255,25.6*255,.1*255,-1e4];De.EMPTY_TEXTURE=new J;De.geometrySize=256;De.geometry=new Q(1,1,Y.geometrySize,Y.geometrySize);De.baseGeometry=ce.geometry;De.baseScale=new D(S.EARTH_PERIMETER,1,S.EARTH_PERIMETER);class oa{constructor(){this.subdivisionRays=1,this.thresholdUp=.6,this.thresholdDown=.15,this.raycaster=new vi,this.mouse=new ye,this.powerDistance=!1,this.scaleDistance=!0}updateLOD(e,i,o,a){const s=[];for(let n=0;n<this.subdivisionRays;n++)this.mouse.set(Math.random()*2-1,Math.random()*2-1),this.raycaster.setFromCamera(this.mouse,i),this.raycaster.intersectObjects(e.children,!0,s);for(let n=0;n<s.length;n++){const r=s[n].object;let l=s[n].distance;if(this.powerDistance&&(l=Math.pow(l*2,r.level)),this.scaleDistance){const c=r.matrixWorld.elements;l=new D(c[0],c[1],c[2]).length()/l}if(l>this.thresholdUp){r.subdivide();return}else if(l<this.thresholdDown&&r.parentNode!==null){r.parentNode.simplify();return}}}}class aa{constructor(e=257){this.gridSize=e;const i=e-1;if(i&i-1)throw new Error(`Expected grid size to be 2^n+1, got ${e}.`);this.numTriangles=i*i*2-2,this.numParentTriangles=this.numTriangles-i*i,this.indices=new Uint32Array(this.gridSize*this.gridSize),this.coords=new Uint16Array(this.numTriangles*4);for(let o=0;o<this.numTriangles;o++){let a=o+2,s=0,n=0,r=0,l=0,c=0,h=0;for(a&1?r=l=c=i:s=n=h=i;(a>>=1)>1;){const u=s+r>>1,w=n+l>>1;a&1?(r=s,l=n,s=c,n=h):(s=r,n=l,r=c,l=h),c=u,h=w}const m=o*4;this.coords[m+0]=s,this.coords[m+1]=n,this.coords[m+2]=r,this.coords[m+3]=l}}createTile(e){return new sa(e,this)}}class sa{constructor(e,i){const o=i.gridSize;if(e.length!==o*o)throw new Error(`Expected terrain data of length ${o*o} (${o} x ${o}), got ${e.length}.`);this.terrain=e,this.martini=i,this.errors=new Float32Array(e.length),this.update()}update(){const{numTriangles:e,numParentTriangles:i,coords:o,gridSize:a}=this.martini,{terrain:s,errors:n}=this;for(let r=e-1;r>=0;r--){const l=r*4,c=o[l+0],h=o[l+1],m=o[l+2],u=o[l+3],w=c+m>>1,x=h+u>>1,g=w+x-h,b=x+c-w,f=(s[h*a+c]+s[u*a+m])/2,p=x*a+w,v=Math.abs(f-s[p]);if(n[p]=Math.max(n[p],v),r<i){const T=(h+b>>1)*a+(c+g>>1),y=(u+b>>1)*a+(m+g>>1);n[p]=Math.max(n[p],n[T],n[y])}}}getMesh(e=0,i=!1){const{gridSize:o,indices:a}=this.martini,{errors:s}=this;let n=0,r=0;const l=o-1;let c,h,m=0;const u=[],w=[],x=[],g=[];a.fill(0);function b(k,B,I,N,U,Z){const ie=k+I>>1,oe=B+N>>1;Math.abs(k-U)+Math.abs(B-Z)>1&&s[oe*o+ie]>e?(b(U,Z,k,B,ie,oe),b(I,N,U,Z,ie,oe)):(c=B*o+k,h=N*o+I,m=Z*o+U,a[c]===0&&(i&&(k===0?u.push(n):k===l&&w.push(n),B===0?x.push(n):B===l&&g.push(n)),a[c]=++n),a[h]===0&&(i&&(I===0?u.push(n):I===l&&w.push(n),N===0?x.push(n):N===l&&g.push(n)),a[h]=++n),a[m]===0&&(i&&(U===0?u.push(n):U===l&&w.push(n),Z===0?x.push(n):Z===l&&g.push(n)),a[m]=++n),r++)}b(0,0,l,l,l,0),b(l,l,0,0,0,l);let f=n*2,p=r*3;i&&(f+=(u.length+w.length+x.length+g.length)*2,p+=((u.length-1)*2+(w.length-1)*2+(x.length-1)*2+(g.length-1)*2)*3);const v=new Uint16Array(f),T=new Uint32Array(p);let y=0;function xe(k,B,I,N,U,Z){const ie=k+I>>1,oe=B+N>>1;if(Math.abs(k-U)+Math.abs(B-Z)>1&&s[oe*o+ie]>e)xe(U,Z,k,B,ie,oe),xe(I,N,U,Z,ie,oe);else{const We=a[B*o+k]-1,zt=a[N*o+I]-1,It=a[Z*o+U]-1;v[2*We]=k,v[2*We+1]=B,v[2*zt]=I,v[2*zt+1]=N,v[2*It]=U,v[2*It+1]=Z,T[y++]=We,T[y++]=zt,T[y++]=It}}if(xe(0,0,l,l,l,0),xe(l,l,0,0,0,l),i){let k=function(I){const N=I.length;for(let U=0;U<N-1;U++){const Z=I[U],ie=I[U+1],oe=B/2,We=(B+2)/2;v[B++]=v[2*Z],v[B++]=v[2*Z+1],T[y++]=Z,T[y++]=oe,T[y++]=ie,T[y++]=oe,T[y++]=We,T[y++]=ie}v[B++]=v[2*I[N-1]],v[B++]=v[2*I[N-1]+1]};u.sort((I,N)=>v[2*I+1]-v[2*N+1]),w.sort((I,N)=>v[2*N+1]-v[2*I+1]),x.sort((I,N)=>v[2*N]-v[2*I]),g.sort((I,N)=>v[2*I]-v[2*N]);let B=n*2;k(u),k(w),k(x),k(g)}return{vertices:v,triangles:T,numVerticesWithoutSkirts:n}}}const Pe=class extends Y{constructor(t=null,e=null,i=E.root,o=0,a=0,s=0,{elevationDecoder:n=[256*255,255,1/256*255,-32768],meshMaxError:r=50,exageration:l=1}={}){super(t,e,i,o,a,s,Pe.geometry,Pe.prepareMaterial(new Ht({map:Pe.emptyTexture,color:16777215,side:wi}),o,l));this.elevationDecoder=[256*255,255,1/256*255,-32768],this.exageration=1,this.meshMaxError=10,this.meshMaxError=t?t.meshMaxError:r,this.exageration=t?t.exageration:l,this.elevationDecoder=t?t.elevationDecoder:n,this.frustumCulled=!1}static prepareMaterial(t,e,i=1){return t.userData={heightMap:{value:Pe.emptyTexture},drawNormals:{value:0},drawBlack:{value:0},zoomlevel:{value:e},computeNormals:{value:1},drawTexture:{value:1}},t.onBeforeCompile=o=>{for(let a in t.userData)o.uniforms[a]=t.userData[a];o.vertexShader=`
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
				`)},t}static getTerrain(t,e,i){const o=e+1,a=new Float32Array(o*o);for(let s=0,n=0;n<e;n++)for(let r=0;r<e;r++,s++){const l=s*4,c=t[l+0],h=t[l+1],m=t[l+2];a[s+n]=c*i[0]/255+h*i[1]/255+m*i[2]/255+i[3]}for(let s=o*(o-1),n=0;n<o-1;n++,s++)a[s]=a[s-o];for(let s=o-1,n=0;n<o;n++,s+=o)a[s]=a[s-1];return a}static getMeshAttributes(t,e,i,o,a){const s=i+1,n=t.length/2,r=new Float32Array(n*3),l=new Float32Array(n*2),[c,h,m,u]=o||[0,0,i,i],w=(m-c)/i,x=(u-h)/i;for(let g=0;g<n;g++){const b=t[g*2],f=t[g*2+1],p=f*s+b;r[3*g+0]=b*w+c,r[3*g+1]=-e[p]*a,r[3*g+2]=-f*x+u,l[2*g+0]=b/i,l[2*g+1]=f/i}return{position:{value:r,size:3},uv:{value:l,size:2}}}async onHeightImage(t){if(t){const n=t.width,r=n+1;var e=Xe.createOffscreenCanvas(n,n),i=e.getContext("2d");i.imageSmoothingEnabled=!1,i.drawImage(t,0,0,n,n,0,0,e.width,e.height);var o=i.getImageData(0,0,e.width,e.height),a=o.data;const l=Pe.getTerrain(a,n,this.elevationDecoder),h=new aa(r).createTile(l),{vertices:m,triangles:u}=h.getMesh(typeof this.meshMaxError=="function"?this.meshMaxError(this.level):this.meshMaxError,!1),w=Pe.getMeshAttributes(m,l,n,[-.5,-.5,.5,.5],this.exageration);this.geometry=new je,this.geometry.setIndex(new vo(u,1)),this.geometry.setAttribute("position",new q(w.position.value,w.position.size)),this.geometry.setAttribute("uv",new q(w.uv.value,w.uv.size)),this.geometry.rotateX(Math.PI);var s=new J(t);s.generateMipmaps=!1,s.format=lt,s.magFilter=ze,s.minFilter=ze,s.needsUpdate=!0,this.material.userData.heightMap.value=s}}loadHeightGeometry(){if(this.mapView.heightProvider===null)throw new Error("GeoThree: MapView.heightProvider provider is null.");return this.mapView.heightProvider.fetchTile(this.level,this.x,this.y).then(async t=>this.onHeightImage(t)).finally(()=>{this.heightLoaded=!0,this.nodeReady()})}};let Ne=Pe;Ne.geometrySize=16;Ne.emptyTexture=new J;Ne.geometry=new Q(1,1,1,1);Ne.tileSize=256;Ne.baseScale=new D(S.EARTH_PERIMETER,1,S.EARTH_PERIMETER);const he=class extends rt{constructor(t=he.PLANAR,e=new _i,i=null,o=!1,a){super(void 0,new Nt({transparent:!0,opacity:0}));this.lod=null,this.provider=null,this.heightProvider=null,this.root=null,this.onNodeReady=null,this.lowMemoryUsage=!1,this.maxZoomForObjectHolders=14,Xo(),this.lod=new oa,this.provider=e,this.heightProvider=i,this.nodeAutoLoad=o,a?this.onNodeReady=a:this.onBeforeRender=(s,n,r,l,c,h)=>{this.lod.updateLOD(this,r,s,n)},this.setRoot(t)}nodeShouldAutoLoad(){return this.nodeAutoLoad}setRoot(t){if(typeof t=="number"){if(!he.mapModes.has(t))throw new Error("Map mode "+t+" does is not registered.");const e=he.mapModes.get(t);t=new e(null,this)}this.root!==null&&(this.remove(this.root),this.root=null),this.root=t,this.root!==null&&(this.geometry=this.root.constructor.baseGeometry,this.scale.copy(this.root.constructor.baseScale),this.root.mapView=this,this.add(this.root))}setProvider(t){t!==this.provider&&(this.provider=t,this.clear())}setHeightProvider(t){t!==this.heightProvider&&(this.heightProvider=t,this.clear())}clear(){return this.traverseVisible(function(t){t.childrenCache&&(t.childrenCache=null),t.initialize&&t.initialize()}),this}getMetaData(){this.provider.getMetaData()}raycast(t,e){return!1}};let Re=he;Re.PLANAR=200;Re.SPHERICAL=201;Re.HEIGHT=202;Re.HEIGHT_SHADER=203;Re.MARTINI=204;Re.mapModes=new Map([[he.PLANAR,ce],[he.SPHERICAL,mt],[he.HEIGHT,Y],[he.HEIGHT_SHADER,De],[he.MARTINI,Ne]]);class na extends Gt{constructor(){super(...arguments);this.resolution=256}fetchImage(e,i,o){return new Te((a,s)=>{const n=Xe.createOffscreenCanvas(this.resolution,this.resolution),r=n.getContext("2d"),l=new $e(65280),c=new $e(16711680),h=l.lerpHSL(c,(e-this.minZoom)/(this.maxZoom-this.minZoom));r.fillStyle=h.getStyle(),r.fillRect(0,0,this.resolution,this.resolution),r.fillStyle="#000000",r.textAlign="center",r.textBaseline="middle",r.font="bold "+this.resolution*.1+"px arial",r.fillText("("+e+")",this.resolution/2,this.resolution*.4),r.fillText("("+i+", "+o+")",this.resolution/2,this.resolution*.6),a(n)})}}class ra extends Gt{constructor(){super();this.name="local",this.minZoom=0,this.maxZoom=20}fetchTile(e,i,o){return Promise.resolve(null)}cancelTile(e,i,o){}}const Ai=ea({fetchOptions:{credentials:"same-origin"}}),la=Ci({imageOrientation:"flipY",fetchOptions:{credentials:"same-origin"}}),Wt="192.168.1.159";class ca extends Li{constructor(e=!1){super();this.name="local",this.local=e,this.terrarium=!e,this.minZoom=5,this.maxZoom=e?12:15}buildURL(e,i,o){return this.local?`https://${Wt}/data/elevation_25m/${e}/${i}/${o}.webp`:`https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${e}/${i}/${o}.png`}buildPeaksURL(e,i,o){return this.local?`https://${Wt}/data/full/${e}/${i}/${o}.pbf`:`https://api.maptiler.com/tiles/v3/${e}/${i}/${o}.pbf?key=V7KGiDaKQBCWTYsgsmxh`}getImageBitmapLoader(){return la}async fetchPeaks(e,i,o){const a=this.buildPeaksURL(e,i,o),s=await Ai.load(a);return wo.parse(s,{mvt:{tileIndex:{x:i,y:o,z:e},coordinates:"wgs84",layers:["mountain_peak"]}})}cancelTile(e,i,o){super.cancelTile(e,i,o);const a=this.buildPeaksURL(e,i,o);Ai.cancel(a)}}const W=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),jt=new Date,d={local:!1,shadows:!0,dayNightCycle:!1,generateColor:!1,debug:!1,geometrySize:W?320:512,debugGPUPicking:!1,readFeatures:!0,drawLines:!0,drawElevations:!1,dark:!1,fovFactor:28.605121612548828,outline:!0,wireframe:!1,drawNormals:!1,debugFeaturePoints:!1,computeNormals:!1,drawTexture:!0,mapMap:!1,stats:!1,exageration:1.622511863708496,outlineStroke:1,depthBiais:.23,depthMultiplier:11,depthPostMultiplier:.9277091026306152,secondsInDay:jt.getHours()*3600+jt.getMinutes()*60+jt.getSeconds(),elevation:-1,terrarium:!1,elevationDecoder:[6553.6*255,25.6*255,.1*255,-1e4],far:W?163e3:173e3,near:10};let zi={},Ke;function Ii(t){Ke||(Ke=document.createElement("canvas")),Ke.width=t.width,Ke.height=t.height;var e=Ke.getContext("2d");return e.drawImage(t,0,0),e.getImageData(0,0,t.width,t.height)}let Ye,pt,gt;function Ni(t,e,i,o){Ye=K.pointToTileFraction(i.lon,i.lat,o),pt=Ye[0]-Math.floor(Ye[0]),gt=1-(Ye[1]-Math.floor(Ye[1])),pt=pt*e[2]+e[0],gt=gt*e[3]+e[1];const a=Math.round(t.width*pt),s=Math.round(t.height*gt),n=(a+t.width*s)*4;return t.data.slice(n,n+4)}const pe=12,Ce=1/1e5;function Hi(t,e=0){let i=3735928559^e,o=1103547991^e;for(let a=0,s;a<t.length;a++)s=t.charCodeAt(a),i=Math.imul(i^s,2654435761),o=Math.imul(o^s,1597334677);return i=Math.imul(i^i>>>16,2246822507)^Math.imul(o^o>>>13,3266489909),o=Math.imul(o^o>>>16,2246822507)^Math.imul(i^i>>>13,3266489909),4294967296*(2097151&o)+(i>>>0)}class Bi extends xi{customProgramCacheKey(){const e=this.constructor.prototype;return e.cachedKey||(e.cachedKey=Hi(super.customProgramCacheKey())),e.cachedKey}onBeforeCompile(e){for(const i in this.userData)e.uniforms[i]=this.userData[i]}onBeforeRender(e,i,o,a,s,n){if(H.useSharedShader){const r=s.parent.parent;for(const l in r.userData)this.uniforms[l]=r.userData[l];this.uniformsNeedUpdate=!0}}}class Je extends xi{customProgramCacheKey(){return Je.cachedKey||(Je.cachedKey=Hi(super.customProgramCacheKey())),Je.cachedKey}onBeforeRender(e,i,o,a,s,n){for(const r in s.userData)this.uniforms[r]&&(this.uniforms[r].value=s.userData[r].value);this.uniformsNeedUpdate=!0}}const Fi=new J,He=new Je({depthWrite:!1,depthTest:!1,uniforms:{exageration:{value:1},depthTexture:{value:Fi},cameraNear:{value:10*Ce},cameraFar:{value:1e6*Ce},worldScale:{value:Ce}},vertexShader:`
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
// float getDigit(float num, float n) {
//    return mod((num / pow(10.0, n)), 10.0);
// }
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
	`,transparent:!1});Mi.shadowmap_pars_fragment=Mi.shadowmap_pars_fragment.replace("return shadow;","if (generateColor){return shadow*2.0; } else {return shadow;}");function ha(t,...e){return e.reduce((i,o)=>(i[o]=t[o],i),{})}function da(){const t=xo.phong,e=new Mo,i=e.load("terrain/savanna_green_d.webp",null,null),o=e.load("terrain/mntn_dark_d.webp",null,null),a=e.load("terrain/mntn_white_d.webp",null,null),s=e.load("terrain/snow1_d.webp",null,null);i.wrapS=o.wrapS=a.wrapS=yi,i.wrapT=o.wrapT=a.wrapT=yi;const n=new Bi({lights:!0,wireframe:!1,defines:{TANGENTSPACE_NORMALMAP:"",USE_DISPLACEMENTMAP:"",USE_NORMALMAP:""},uniforms:Object.assign(ha(t.uniforms,"diffuse","spotLights","spotLightShadows","rectAreaLights","ltc_1","ltc_2","ambientLightColor","directionalLightShadows","directionalLights","directionalShadowMatrix","directionalShadowMap","lightMap","lightMapIntensity","lightProbe","pointLights","pointLightShadows","pointShadowMap","pointShadowMatrix","hemisphereLights","spotShadowMap","spotShadowMatrix","map","opacity","displacementMap"),{textureGrass:{value:i},textureAltitude:{value:o},textureRock:{value:a},textureSnow:{value:s},drawNormals:{value:!1},computeNormals:{value:!1},drawTexture:{value:!1},elevationDecoder:{value:null},generateColor:{value:!1},drawBlack:{value:0},displacementScale:{value:1},emissive:{value:new $e(0)},specular:{value:new $e(3355443)},shininess:{value:10},displacementBias:{value:0},worldScale:{value:Ce}}),vertexShader:`
#define PHONG
#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <shadowmap_pars_vertex>
uniform bool computeNormals;
uniform float zoomlevel;
uniform float worldScale;
uniform vec4 elevationDecoder;
uniform vec4 displacementMapLocation;
varying vec4 vPosition;
uniform float tileY;
varying vec3 vViewPosition;
varying vec3 vComputedNormal;
varying float trueHeight;

float getPixelElevation(vec4 e) {
	// Convert encoded elevation value to meters
	return ((e.r * elevationDecoder.x + e.g * elevationDecoder.y  + e.b * elevationDecoder.z) + elevationDecoder.w);
}
float getElevation(vec2 coord) {
	vec4 e = texture2D(displacementMap, coord * displacementMapLocation.zw + displacementMapLocation.xy);
	return getPixelElevation(e);
}

float getElevationMean(vec2 coord, float width, float height) {
	float x0 = coord.x;
	float x1= coord.x;
	float y0 = coord.y;
	float y1= coord.y;
	if (x0 <= 0.0) {
		x1 = 1.0 / width;
	}
	if (x0 >= 1.0) {
		x1 = 1.0 - 1.0 / width;
	}
	if (y0 <= 0.0) {
		y1 = 1.0 / height;
	}
	if (y0 >= 1.0) {
		y1 = 1.0 - 1.0 / height;
	}
	if (x0 == x1 && y0 == y1) {
		return getElevation(coord);
	} else {
		return 2.0 * getElevation(vec2(x0,y0)) -  getElevation(vec2(x1,y1));
	}
}
void main() {

	vUv = vec2(position.x +  0.5, 0.5 - position.z );

	ivec2 size = textureSize(displacementMap, 0);
	float width = float(size.x) * displacementMapLocation.z;
	float height = float(size.y) * displacementMapLocation.w;
	float e = getElevationMean(vUv, width, height);
	vec3 objectNormal = vec3(0,1,0);
	
	#include <defaultnormal_vertex>
	#include <normal_vertex>


	#include <begin_vertex>
	transformed += vec3(0,e * displacementScale + displacementBias,0);
	#include <project_vertex>

	vViewPosition = - mvPosition.xyz;

	if (computeNormals) {
		float normalLength = 25.0;
		float sizeFactor = 1.0/ (8.0 * zoomlevel);
		float zoomFactor = 0.0;
		float level = zoomlevel ;
		if (displacementMapLocation.z != 1.0) {
			level -= log(1.0/displacementMapLocation.z)/log(2.0);
		}
		if (level < 12.0) {
			zoomFactor = 1.0 - 0.5/(12.0 -level);
		}
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
		float offset = 1.0 / width;
		float b = getElevationMean(vUv + vec2(0, -offset), width, height);
		float d = getElevationMean(vUv + vec2(-offset, 0), width, height);
		float f = getElevationMean(vUv + vec2(offset, 0), width, height);
		float h = getElevationMean(vUv + vec2(0, offset), width, height);
		vComputedNormal = normalize(vec3(mix(d - f , 0.0, zoomFactor), 30.0 / displacementScale, mix(b - h , 0.0, zoomFactor)));
	}
	#include <worldpos_vertex>
	if (computeNormals) {
		#include <shadowmap_vertex>
	}
	vPosition = modelMatrix * vec4(transformed, 1.0);
	vPosition.y = e;
}
`,fragmentShader:`
#define PHONG
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
// #include <bumpmap_pars_fragment>
#include <lightmap_pars_fragment>
// #include <emissivemap_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <normalmap_pars_fragment>
#define SNOW_HEIGHT 1300.0
#define BEACH_HEIGHT 140.5
#define GRASS_HEIGHT 2053.5
#define TREE_MIN_HEIGHT 1000.0
#define TREE_MAX_HEIGHT 1800.0
#define HASHSCALE1 .1031

// varying vec2 vUv;
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
	vec3 mat;
	lights.x = .0;
	lights.y = .1;
	// vec3 dir = normalize(pos-cameraPos);
	
	// float f = clamp(Noise(matPos.xz*.05, 2.0), 0.0,1.0);//*10.8;
	vec3 m = texture2D(textureAltitude, vUv*2.0).rgb;
	mat = m;
	// Should have used smoothstep to add colours, but left it using 'if' for sanity...
	if (normal.y < .5)
	{
		float v = normal.y;
		float c = (.5-normal.y) * 4.0;
		c = clamp(c*c, 0.1, 1.0);
		mat = mix(mat, texture2D(textureRock, vUv*4.0).rgb, c/1.6);
		lights.x+=.1;
	}
	// Grass. Use the normal to decide when to plonk grass down...
	if (matPos.y < GRASS_HEIGHT && normal.y > 0.65)
	{
		m = texture2D(textureGrass, vUv*4.0).rgb*1.6 * (normal.y- 0.65);
		mat = mix(mat, m, clamp((normal.y-0.65)*1.3 * (GRASS_HEIGHT-matPos.y)*0.003, 0.0, 1.0));
	}

	// if (matPos.y > TREE_MIN_HEIGHT && matPos.y < TREE_MAX_HEIGHT && normal.y > .22)
	// {
	// 	mat = vec3(.02+Noise(matPos.xz*5.0, 1.0)*.03, .05, .0);
	// 	normal = normalize(normal+vec3(Noise(matPos.xz*33.0, 1.0)*1.0-.5, .0, Noise(matPos.xz*33.0, 1.0)*1.0-.5));
		// lights.x = .0;
	// }
	
	// Snow topped mountains...
	if (matPos.y > SNOW_HEIGHT && normal.y > .22)
	{
		float snow = clamp(((matPos.y - SNOW_HEIGHT)*(normal.y-0.22)*3.5) * 0.0015, 0.0, 1.0);
		mat = mix(mat, texture2D(textureSnow, vUv).rgb, snow);
		lights.x += snow;
		// ambient+=snow *.3;
	}
	// Beach effect...
	// if (matPos.y < BEACH_HEIGHT)
	// {
	// 	if (normal.y > .4)
	// 	{
	// 		f = Noise(matPos.xz * .084, 1.0)*1.5;
	// 		f = clamp((BEACH_HEIGHT-f-matPos.y) * 1.34, 0.0, .67);
	// 		float t = (normal.y-.4);
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
	
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;

	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	if (computeNormals) {
		vec3 mapN = vComputedNormal.rbg;
		normal = perturbNormal2Arb( - vViewPosition, normal, mapN, 1.0 );
		// normal = normalize( cross( dFdx( vViewPosition.xyz ), dFdy( vViewPosition.xyz ) ) );
	}
	if (generateColor) {
		vec2 lights = vec2(0,0);
		diffuseColor *= mapTexelToLinear(vec4(TerrainColour(vPosition, vComputedNormal, lights), 1.0));
		// specularStrength = lights.x;
	} else {
		vec4 texelColor = texture2D(map, vUv * mapMapLocation.zw + mapMapLocation.xy);
		// texelColor = mapTexelToLinear( texelColor );
		diffuseColor *= texelColor;
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

	// #include <emissivemap_fragment>
	specularStrength =1.0;
	// accumulation
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_end>
	
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	gl_FragColor = vec4( outgoingLight, diffuseColor.a );
}
`});return n.map=Fi,n}const $t=new Bi({defines:{USE_DISPLACEMENTMAP:""},side:wi,name:"DepthMaterial",uniforms:{drawNormals:{value:!1},computeNormals:{value:!1},drawTexture:{value:!1},generateColor:{value:!1},elevationDecoder:{value:null},displacementMapLocation:{value:new ht},displacementScale:{value:1},displacementMap:{value:null},displacementBias:{value:0}},vertexShader:`
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
}`}),F=da();let Vi=0;const C=class extends Y{constructor(t,e,i,o,a,s){super(t,e,i,o,a,s,C.getDefaultGeometry(),C.useSharedShader?F:F.clone());this.fullGeometryLoaded=!1,this.displacementMapLocation=[0,0,1,1],this.mapMapLocation=[0,0,1,1],this.heightOverZoomFactor=1,this.overZoomFactor=1;const n={displacementMap:{value:null},map:{value:this.material.map},zoomlevel:{value:o},tileY:{value:s},displacementMapLocation:{value:this.displacementMapLocation},mapMapLocation:{value:this.mapMapLocation}};C.useSharedShader?this.userData=n:this.material.userData=n,this.frustumCulled=!1}static getDefaultGeometry(){return C.geometry||(C.geometry=C.getSoftGeometry(16,!0)),C.geometry}static getGeometry(t){const e=Math.log(1/Ce)*Math.LOG10E+1|0;let i=d.geometrySize/Math.max(Math.floor(e/2),1);t>pe&&(i/=Math.floor(Math.pow(2,t-pe)),i=Math.max(16,i));let o=C.geometries[i];return C.geometries[i]||(o=C.geometries[i]=new Q(1,1,i,i,{skirt:d.exageration>.1,skirtDepth:50*d.exageration*C.scaleRatio,uvs:!1})),o}static getSoftGeometry(t,e){let i;if(e)i=t;else{const a=Math.log(1/Ce)*Math.LOG10E+1|0;i=d.geometrySize/Math.max(Math.pow(2,Math.floor(a/2)-1),1),t<pe?(i/=Math.floor(Math.pow(2,Math.floor(pe-t))),i=Math.max(16,i)):t>pe&&(i/=Math.floor(Math.pow(2,t-pe)),i=Math.max(16,i))}let o=C.geometries[i];return C.geometries[i]||(o=C.geometries[i]=new Q(1,1,i,i,{skirt:d.exageration>.1,skirtDepth:50*d.exageration,uvs:!1})),o}initialize(){let t=2,e=this.parent;for(;t>0&&(!e.textureLoaded||!e.heightLoaded);)e=e.parent,t--;if(e&&e.textureLoaded&&e.heightLoaded){const i=K.tileToBBOX([this.x,this.y,this.level]),o=K.tileToBBOX([e.x,e.y,e.level]),a=o[2]-o[0],s=o[3]-o[1],n=this.level-e.level,r=Math.pow(10,n),l=Math.floor((i[0]-o[0])/a*r)/r,c=Math.floor((i[1]-o[1])/s*r)/r;if(!this.textureLoaded){const h=1/e.mapMapLocation[2],m=[0,0,1,1];m[0]=e.mapMapLocation[0]+l/h,m[1]=e.mapMapLocation[1]+c/h,m[2]=m[3]=1/Math.pow(2,h*n);const u=C.useSharedShader?e.userData:e.material.userData;this.setMaterialValues({map:u.map.value,mapMapLocation:m})}if(!this.heightLoaded){const h=e.displacementMapLocation,m=1/h[2],u=[0,0,1,1];u[0]=h[0]+l/m,u[1]=h[1]+c/m,u[2]=u[3]=1/(2*m*n);const w=C.useSharedShader?e.userData:e.material.userData;this.displacementMapLocation=u;const x=w.displacementMap.value;this.setMaterialValues({displacementMap:x,displacementMapLocation:u})}this.show()}return super.initialize()}dispose(){super.dispose(),this.pointsMesh=null}setMaterialValues(t){const e=C.useSharedShader?this.userData:this.material.userData;Object.keys(t).forEach(i=>{e.hasOwnProperty(i)&&(e[i].value=t[i])})}didSimplify(){this.lod?this.children=[this.objectsHolder,this.lod]:this.children=[this.objectsHolder]}show(){this.fullGeometryLoaded||this.constructLOD(),C.useLOD?(this.isMesh=!1,this.lod.visible=!0):this.isMesh=!0}isVisible(){return C.useLOD?this.lod&&this.lod.visible:this.isMesh}hide(){this.isMesh=!1,this.objectsHolder.visible=this.level!==this.mapView.maxZoomForObjectHolders,this.lod&&(this.lod.visible=!1)}constructLOD(){if(this.fullGeometryLoaded=!0,C.useLOD){const t=this.lod=new yo;for(let e=0;e<4;e++){let i=e>=3?e+1:e;const o=new rt(C.getSoftGeometry(this.level>pe?this.level+i:pe-i),this.material);o.frustumCulled=!1,o.castShadow=!0,o.receiveShadow=!0,o.customDepthMaterial=$t,o.updateMatrix(),o.updateMatrixWorld(!0),o.matrixAutoUpdate=!1,t.addLevel(o,700*Math.pow(e,5))}t.updateMatrix(),t.updateMatrixWorld(!0),t.frustumCulled=!1,t.matrixAutoUpdate=!1,this.add(t),this.isMesh=!1}else this.geometry=C.getGeometry(this.level)}loadTexture(){if(!this.isTextureReady)return this.isTextureReady=!0,this.mapView.provider.fetchTile(this.level,this.x,this.y).then(t=>this.onTextureImage(t)).finally(()=>{!this.mapView||(this.textureLoaded=!0,this.nodeReady())})}onTextureImage(t){if(this.parentNode&&t){this.mapMapLocation=[0,0,1,1];const e=new J(t);e.generateMipmaps=!1,e.magFilter=ue,e.minFilter=ue,e.needsUpdate=!0,this.setMaterialValues({map:e,mapMapLocation:this.mapMapLocation})}}async onHeightImage(t,e=!0){if(this.mapView&&t){e&&(this.displacementMapLocation=[0,0,1,1]);let i;if(t instanceof J?(i=t,this.setMaterialValues({displacementMap:t})):(i=new J(t),i.generateMipmaps=!1,i.flipY=!1,i.wrapS=bi,i.wrapT=bi,i.magFilter=ue,i.minFilter=ue,i.needsUpdate=!0,this.setMaterialValues({displacementMap:i,displacementMapLocation:this.displacementMapLocation})),this.level>this.mapView.maxZoomForObjectHolders)return;await this.mapView.heightProvider.fetchPeaks(this.level,this.x,this.y).then(o=>{if(!!this.mapView&&(o=o.filter(r=>r.properties.name&&r.properties.class==="peak"&&r.properties.ele!==void 0),o.length>0)){const r=d.elevationDecoder,l=[];var a=[],s=[];const c=new D(0,0,0),m=(C.useSharedShader?this.userData:this.material.userData).displacementMapLocation.value;let u,w=new ye,x,g;const b=Ii(i.image),f=C.scaleRatio;if(o.forEach((p,v)=>{if(u=p.geometry.coordinates,S.datumsToSpherical(u[1],u[0],w,f),c.set(w.x,0,-w.y),p.localCoords=this.worldToLocal(c),Math.abs(p.localCoords.x)<=.5&&Math.abs(p.localCoords.z)<=.5){const T=u.join(",");p.id=T,p.pointIndex=l.length,p.level=this.level,p.x=this.x,p.y=this.y,x=Ni(b,m,{lat:u[1],lon:u[0]},this.level);const y=p.properties.computedEle=Math.ceil(x[0]/255*r[0]+x[1]/255*r[1]+x[2]/255*r[2]+r[3]);p.localCoords.y=y,g=p.color=Vi=(Vi+1)%16777214,zi[g]=p,l.push(p),a.push((g>>16&255)/255,(g>>8&255)/255,(g&255)/255),s.push(p.localCoords.x,p.localCoords.y,p.localCoords.z)}}),s.length>0){const p=new je,v=new q(s,3);v.name="points",p.setAttribute("position",v);const T=new q(a,3);T.name="colors",p.setAttribute("color",T);var n=new bo(p,He);n.userData={},n.frustumCulled=!1,n.updateMatrix(),n.updateMatrixWorld(!0),this.pointsMesh=n,this.objectsHolder.add(n)}}}).catch(o=>{console.error("error fetching peaks",o)})}}async handleParentOverZoomTile(t){if(!this.mapView)return;const e=K.tileToBBOX([this.x,this.y,this.level]),i=this.parent,o=i.heightOverZoomFactor,a=K.tileToBBOX([i.x,i.y,i.level]),s=a[2]-a[0],n=a[3]-a[1];this.heightOverZoomFactor=o*2,this.displacementMapLocation[0]=i.displacementMapLocation[0]+Math.floor((e[0]-a[0])/s*10)/10/o,this.displacementMapLocation[1]=i.displacementMapLocation[1]+Math.floor((e[1]-a[1])/n*10)/10/o,this.displacementMapLocation[2]=this.displacementMapLocation[3]=1/this.heightOverZoomFactor,this.setMaterialValues({displacementMapLocation:this.displacementMapLocation});const r=C.useSharedShader?i.userData:i.material.userData;await this.onHeightImage(r.displacementMap.value,!1),t==null||t()}raycast(t,e){if(this.isVisible()){const i=this.geometry;this.geometry=ce.geometry;const o=rt.prototype.raycast.call(this,t,e);return this.geometry=i,o}return!1}};let H=C;H.useLOD=!0;H.useSharedShader=!0;H.baseGeometry=ce.geometry;H.scaleRatio=Ce;H.baseScale=new D(S.EARTH_PERIMETER*C.scaleRatio,Number(C.scaleRatio),S.EARTH_PERIMETER*C.scaleRatio);H.geometries={};H.geometrySize=4;H.maxZoomForPeaks=12;class ua extends _i{constructor(e=!1){super(e?`https://${Wt}/styles/terrain_no_label/`:"https://a.tile.openstreetmap.org/")}}class fa extends To{constructor(e,i,o,a,s=1){super(16777215);this.savedPosition=new D(0,0,0),this.coordinates=new ye,this.coordinates.copy(e),this.north=i,this.east=o,this.nadir=a,this.sun_distance=s,this.azimuth=0,this.elevation=0,this.localDate=new Date,this.castShadow=!0}setWorldPosition(e){this.savedPosition.set(e.x,e.y,e.z),this.updateDirectionalLight()}setPosition(e,i){this.coordinates.set(e,i),this.updateOrientation(!1),this.updateDirectionalLight()}setDate(e){this.localDate=e,this.updateOrientation(!1),this.updateDirectionalLight()}updateOrientation(e=!0){e&&(this.localDate=new Date);const o=new ma().getAzEl(this.coordinates.x,this.coordinates.y,this.localDate);this.azimuth=this._degreesToRadians(o.azimuth),this.elevation=this._degreesToRadians(o.elevation)}updateDirectionalLight(){const e=-2,i=180*this.elevation/Math.PI;if(i<e){this.intensity=0;return}else i<0&&i>=e?this.intensity=i/e:this.intensity=2;this.position.copy(this.north),this.position.multiplyScalar(this.sun_distance);const o=new Ae,a=new Ae;o.setFromAxisAngle(this.east,this.elevation),a.premultiply(o),o.setFromAxisAngle(this.nadir,this.azimuth),a.premultiply(o),this.position.applyQuaternion(a),this.position.add(this.savedPosition),this.target.position.copy(this.savedPosition)}_degreesToRadians(e){return e%360*Math.PI/180}}class ma{constructor(){this.a="some val"}getAzEl(e,i,o=new Date){const a=this._getJD(o),s=this._getTimeLocal(o),n=o.getTimezoneOffset()/-60,r=a+s/1440-n/24,l=this._calcTimeJulianCent(r);return this._calcAzEl(!1,l,s,e,i,n)}_getJD(e=new Date){let i=e.getMonth()+1,o=e.getDate(),a=e.getFullYear();this._isLeapYear(a)&&i===2?o>29&&(o=29):o>new Date(1900,i,0).getDate()&&(o=new Date(1900,i,0).getDate()),i<=2&&(a-=1,i+=12);const s=Math.floor(a/100),n=2-s+Math.floor(s/4);return Math.floor(365.25*(a+4716))+Math.floor(30.6001*(i+1))+o+n-1524.5}_getTimeLocal(e=new Date){let i=0;return i+=60*e.getHours(),i+=e.getMinutes(),i+=e.getSeconds()/60,i}_calcTimeJulianCent(e){return(e-2451545)/36525}_calcAzEl(e,i,o,a,s,n){const r={azimuth:0,elevation:0},l=this._calcEquationOfTime(i),c=this._calcSunDeclination(i),h=l+4*s-60*n;this._calcSunRadVector(i);let m=o+h;for(;m>1440;)m-=1440;let u=m/4-180;u<-180&&(u+=360);const w=this._degToRad(u);let x=Math.sin(this._degToRad(a))*Math.sin(this._degToRad(c))+Math.cos(this._degToRad(a))*Math.cos(this._degToRad(c))*Math.cos(w);x>1?x=1:x<-1&&(x=-1);const g=this._radToDeg(Math.acos(x)),b=Math.cos(this._degToRad(a))*Math.sin(this._degToRad(g));if(Math.abs(b)>.001){let y=(Math.sin(this._degToRad(a))*Math.cos(this._degToRad(g))-Math.sin(this._degToRad(c)))/b;Math.abs(y)>1&&(y<0?y=-1:y=1);var f=180-this._radToDeg(Math.acos(y));u>0&&(f=-f)}else a>0?f=180:f=0;f<0&&(f+=360);const p=90-g;if(p>85)var v=0;else{const y=Math.tan(this._degToRad(p));if(p>5)var v=58.1/y-.07/(y*y*y)+86e-6/(y*y*y*y*y);else if(p>-.575)var v=1735+p*(-518.2+p*(103.4+p*(-12.79+p*.711)));else var v=-20.774/y;v=v/3600}const T=g-v;return r.azimuth=Math.floor(f*100+.5)/100,r.elevation=Math.floor((90-T)*100+.5)/100,r}_isLeapYear(e){return e%4==0&&e%100!=0||e%400==0}_radToDeg(e){return 180*e/Math.PI}_degToRad(e){return Math.PI*e/180}_calcEquationOfTime(e){const i=this._calcObliquityCorrection(e),o=this._calcGeomMeanLongSun(e),a=this._calcEccentricityEarthOrbit(e),s=this._calcGeomMeanAnomalySun(e);let n=Math.tan(this._degToRad(i)/2);n*=n;const r=Math.sin(2*this._degToRad(o)),l=Math.sin(this._degToRad(s)),c=Math.cos(2*this._degToRad(o)),h=Math.sin(4*this._degToRad(o)),m=Math.sin(2*this._degToRad(s)),u=n*r-2*a*l+4*a*n*l*c-.5*n*n*h-1.25*a*a*m;return this._radToDeg(u)*4}_calcSunDeclination(e){const i=this._calcObliquityCorrection(e),o=this._calcSunApparentLong(e),a=Math.sin(this._degToRad(i))*Math.sin(this._degToRad(o));return this._radToDeg(Math.asin(a))}_calcSunRadVector(e){const i=this._calcSunTrueAnomaly(e),o=this._calcEccentricityEarthOrbit(e);return 1.000001018*(1-o*o)/(1+o*Math.cos(this._degToRad(i)))}_calcObliquityCorrection(e){const i=this._calcMeanObliquityOfEcliptic(e),o=125.04-1934.136*e;return i+.00256*Math.cos(this._degToRad(o))}_calcSunApparentLong(e){const i=this._calcSunTrueLong(e),o=125.04-1934.136*e;return i-.00569-.00478*Math.sin(this._degToRad(o))}_calcGeomMeanLongSun(e){let i=280.46646+e*(36000.76983+e*3032e-7);for(;i>360;)i-=360;for(;i<0;)i+=360;return i}_calcEccentricityEarthOrbit(e){return .016708634-e*(42037e-9+1267e-10*e)}_calcGeomMeanAnomalySun(e){return 357.52911+e*(35999.05029-1537e-7*e)}_calcSunTrueAnomaly(e){const i=this._calcGeomMeanAnomalySun(e),o=this._calcSunEqOfCenter(e);return i+o}_calcMeanObliquityOfEcliptic(e){const i=21.448-e*(46.815+e*(59e-5-e*.001813));return 23+(26+i/60)/60}_calcSunTrueLong(e){const i=this._calcGeomMeanLongSun(e),o=this._calcSunEqOfCenter(e);return i+o}_calcSunEqOfCenter(e){const i=this._calcGeomMeanAnomalySun(e),o=this._degToRad(i),a=Math.sin(o),s=Math.sin(o+o),n=Math.sin(o+o+o);return a*(1.914602-e*(.004817+14e-6*e))+s*(.019993-101e-6*e)+n*289e-6}}const se=Math.PI/180,Xt=180/Math.PI,pa=new URLSearchParams(window.location.search);pa.forEach((t,e)=>{try{d[e]=JSON.parse(t)}catch{d[e]=t}});function ki(){G.shadowMap.enabled=d.shadows&&d.dayNightCycle}function Be(t,e,i=!0,o=!0){try{if(!d.hasOwnProperty(t)){const n=window[t];typeof n=="function"&&n(e,i,o)}const a=d[t];if(t==="elevation"&&(typeof e=="string"&&(e=parseFloat(e)),Se!==void 0&&e<Se&&(e=Se)),xt&&a===e)return;d[t]=e;let s=e;switch(t){case"terrarium":e?d.elevationDecoder=[256*255,1*255,1/256*255,-32768]:d.elevationDecoder=[6553.6*255,25.6*255,.1*255,-1e4],F.uniforms.elevationDecoder.value=d.elevationDecoder,$t.uniforms.elevationDecoder.value=d.elevationDecoder;break;case"dayNightCycle":{if(!V){V=Ma(),O=new fa(new ye(45.05,5.47),new D(0,0,-1),new D(1,0,0),new D(0,-1,0),2),O.shadow.bias=-2e-4,O.shadow.mapSize.width=8192,O.shadow.mapSize.height=8192,O.shadow.camera.left=-1,O.shadow.camera.right=1,O.shadow.camera.top=.1,O.shadow.camera.bottom=-.5,O.shadow.camera.near=.1,O.shadow.camera.far=5,ne.add(V),ne.add(O),ne.add(O.target),M.getPosition(A),O.setWorldPosition(A);let n=new Date;const r=Math.floor(d.secondsInDay/3600),l=Math.floor((d.secondsInDay-r*3600)/60),c=d.secondsInDay-r*3600-l*60;n.setHours(r),n.setMinutes(l),n.setSeconds(c),O.setDate(n)}yt(),ni(),F.uniforms.computeNormals.value=Ue(),ki();break}case"shadows":{ki();break}case"drawTexture":{F.uniforms.drawTexture.value=Qt();break}case"elevation":{M.getPosition(A);const n=H.scaleRatio;M.moveTo(A.x,e*d.exageration*n,A.z),i&&(we(),i=!1);break}case"secondsInDay":{let n=new Date;const r=Math.floor(e/3600),l=Math.floor((e-r*3600)/60),c=e-r*3600-l*60;n.setHours(r),n.setMinutes(l),n.setSeconds(c),O&&(O.setDate(n),it()),s=n.toLocaleString(),ni();break}case"dark":{li.uniforms.get("outlineColor").value.set(d.dark?16777215:0),document.body.style.backgroundColor=d.dark?"black":"white";break}case"outline":{re.enabled=!Ot(),ot.renderToScreen=!re.enabled;break}case"near":{_.near=d.near*ve;break}case"far":{const n=H.scaleRatio;_.far=d.far*n,_.updateProjectionMatrix(),Ct(),He.uniforms.cameraNear.value=_.near,He.uniforms.cameraFar.value=_.far;break}case"readFeatures":{ge.style.visibility=d.readFeatures?"visible":"hidden";break}case"exageration":{F.uniforms.displacementScale.value=d.exageration,$t.uniforms.displacementScale.value=d.exageration,He.uniforms.exageration.value=d.exageration;break}case"depthBiais":case"outlineStroke":case"depthMultiplier":case"depthPostMultiplier":{li.uniforms.get("multiplierParameters").value.set(d.depthBiais,d.depthMultiplier,d.depthPostMultiplier,d.outlineStroke);break}case"wireframe":{F.wireframe=d.wireframe;break}case"debugFeaturePoints":{R&&Lt(n=>{n.objectsHolder.visible=d.debugFeaturePoints&&(n.isVisible()||n.level===R.maxZoomForObjectHolders&&n.parentNode.subdivided)});break}case"computeNormals":{yt(),F.uniforms.computeNormals.value=Ue();break}case"stats":{e?(de||(de=new Bo,de.showPanel(0)),document.body.appendChild(de.dom)):de&&document.body.removeChild(de.dom);break}case"drawNormals":{F.uniforms.computeNormals.value=Ue(),F.uniforms.drawNormals.value=d.drawNormals,F.uniforms.drawTexture.value=Qt();break}case"mapMap":{re.enabled=!Ot(),ot.renderToScreen=!re.enabled,yt(),it(),F.uniforms.computeNormals.value=Ue(),F.uniforms.drawTexture.value=Qt(),R&&(R.provider=ii(),e&&Ki("map"),i&&ti());break}case"geometrySize":{R&&i&&(oi(),Tt(),le(!0),i=!1);break}case"generateColor":{F.uniforms.computeNormals.value=Ue(),F.uniforms.generateColor.value=d.generateColor,F.uniforms.drawTexture.value=(d.debug||d.mapMap||d.generateColor)&&d.drawTexture,it();break}case"fovFactor":{_.fov=Et=si(),_.updateProjectionMatrix();break}case"debug":{re.enabled=!Ot(),ot.renderToScreen=!re.enabled,yt(),F.uniforms.computeNormals.value=Ue(),F.uniforms.drawTexture.value=(d.debug||d.mapMap||d.generateColor)&&d.drawTexture,R&&(R.provider=ii(),e&&Ki("debug"),i&&ti());break}}Qe[t]?Qe[t].checked=e:et[t]&&(et[t].value=e),ei[t]&&(ei[t].innerText=s),i&&le()}catch(a){console.error(a.toString()+" "+a.stack)}}class ga extends dt{constructor(){super(...arguments);this.screenOrientation=0,this.deviceOrientation={},this.deviceOrientationEnabled=!1,this.orientationAzimuth=0,this.orientationPolar=0,this.alphaOffsetAngle=0,this.betaOffsetAngle=0,this.gammaOffsetAngle=0,this.zee=new D(0,0,1),this.euler=new Fo,this.q0=new Ae,this.q1=new Ae,this.wordVec=new D,this.trucking=!1,this.zooming=!1,this.ignoreUpdateDispatch=!1}updateDeviceOrientationQuaternion(){var e=this.deviceOrientation.alpha?this.deviceOrientation.alpha*se+this.alphaOffsetAngle:0,i=this.deviceOrientation.beta?this.deviceOrientation.beta*se+this.betaOffsetAngle:0,o=this.deviceOrientation.gamma?this.deviceOrientation.gamma*se+this.gammaOffsetAngle:0,a=this.screenOrientation?this.screenOrientation*se:0;this.setObjectQuaternion(this._camera.quaternion,e,i,o,a),this._camera.getWorldDirection(this.wordVec),this.orientationAzimuth=Math.atan2(this.wordVec.x,this.wordVec.z)+Math.PI,this.orientationPolar=Math.atan2(this.wordVec.z,this.wordVec.y)+Math.PI}onDeviceOrientationChangeEvent(e){this.deviceOrientation=e,this.updateDeviceOrientationQuaternion(),this.dispatchEvent({type:"update",originalEvent:e})}onCompassNeedsCalibrationEvent(){console.log("onCompassNeedsCalibrationEvent")}onScreenOrientationChangeEvent(e){this.screenOrientation=window.orientation||0,this.dispatchEvent({type:"control",originalEvent:e})}startDeviceOrientation(){this.deviceOrientationEnabled||(this.deviceOrientationEnabled=!0,this.screenOrientation=window.orientation||0,this.onDeviceOrientationChangeEventBound=this.onDeviceOrientationChangeEvent.bind(this),this.onScreenOrientationChangeEventBound=this.onScreenOrientationChangeEvent.bind(this),this.onCompassNeedsCalibrationEventBound=this.onCompassNeedsCalibrationEvent.bind(this),window.addEventListener("orientationchange",this.onScreenOrientationChangeEventBound,!1),"ondeviceorientationabsolute"in window?window.addEventListener("deviceorientationabsolute",this.onDeviceOrientationChangeEventBound,!1):window.addEventListener("deviceorientation",this.onDeviceOrientationChangeEventBound,!1),window.addEventListener("compassneedscalibration",this.onCompassNeedsCalibrationEventBound,!1))}stopDeviceOrientation(){!this.deviceOrientationEnabled||(this.deviceOrientationEnabled=!1,this.rotateTo(this.orientationAzimuth,this.orientationPolar),window.removeEventListener("orientationchange",this.onScreenOrientationChangeEventBound,!1),"ondeviceorientationabsolute"in window?window.removeEventListener("deviceorientationabsolute",this.onDeviceOrientationChangeEventBound,!1):window.removeEventListener("deviceorientation",this.onDeviceOrientationChangeEventBound,!1),window.addEventListener("compassneedscalibration",this.onCompassNeedsCalibrationEventBound,!1))}setObjectQuaternion(e,i,o,a,s){this.q0.identity(),this.q1.set(-Math.sqrt(.5),0,0,Math.sqrt(.5)),this.euler.set(o,i,-a,"YXZ"),e.setFromEuler(this.euler),e.multiply(this.q1),e.multiply(this.q0.setFromAxisAngle(this.zee,-s))}rotate(e,i,o){if(this.deviceOrientationEnabled)this.updateAlphaOffsetAngle(this.alphaOffsetAngle+e),this.updateBetaOffsetAngle(this.betaOffsetAngle+i);else return super.rotate(e,i,o)}truck(e,i,o){return this.trucking=!0,super.truck(e,i,o)}zoom(e,i){return this.zooming=!0,super.zoom(e,i)}zoomTo(e,i){return this.zooming=!0,super.zoomTo(e,i)}dispatchEvent(e){this.ignoreUpdateDispatch&&e.type==="update"||(super.dispatchEvent(e),e.type==="update"&&(this.trucking=!1,this.zooming=!1))}update(e){return this.deviceOrientationEnabled?(this.ignoreUpdateDispatch=!0,super.update(e),this.updateDeviceOrientationQuaternion(),this.ignoreUpdateDispatch=!1,this.dispatchEvent({type:"update",originalEvent:null}),!0):super.update(e)}updateAlphaOffsetAngle(e){this.alphaOffsetAngle=e}updateBetaOffsetAngle(e){this.betaOffsetAngle=e}updateGammaOffsetAngle(e){this.gammaOffsetAngle=e}dispose(){this.stopDeviceOrientation(),super.dispose()}}class va extends Vo{constructor(){super("CustomOutlineEffect",`
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
`,{attributes:ko.DEPTH,blendFunction:Uo.AVERAGE,uniforms:new Map([["outlineColor",new Ti(new $e(d.dark?16777215:0))],["multiplierParameters",new Ti(new ht(d.depthBiais,d.depthMultiplier,d.depthPostMultiplier,d.outlineStroke))]])})}}dt.install({THREE:{MOUSE:Eo,Vector2:ye,Vector3:D,Vector4:ht,Quaternion:Ae,Matrix4:ct,Spherical:Do,Box3:Po,Sphere:Ro,Raycaster:vi,MathUtils:{DEG2RAD:Ie.DEG2RAD,clamp:Ie.clamp}}});function Ui(t,e){var i=!1;return function(){i||(t.apply(this,arguments),i=!0,setTimeout(function(){i=!1},e))}}function wa(t,e){var i=null;return function(){i&&(clearTimeout(i),i=null),i=setTimeout(function(...o){t.apply(this,...o),i=null},e)}}const vt=window.devicePixelRatio;let Gi=[];const A=new D(0,0,0);let Zi=0,Wi=-1,z,qt=!1,Se;const ji=new Co;let L=null,R;const $i=1e-5;let ee;const Fe=W?170:120;let te=null,Ve=!1,j=window.innerWidth,$=window.innerHeight,Le=window.innerWidth,_e=window.innerHeight,Xi=1,Kt=!1,wt=!1,Yt=!1,xt=!0,de;const Mt=document.getElementById("canvas"),ge=document.getElementById("canvas4");document.getElementById("video");const P=ge.getContext("2d");Mt.addEventListener("touchstart",()=>ji.getDelta(),{passive:!0});const G=new So({canvas:Mt,antialias:!1,alpha:!0,powerPreference:"high-performance",depth:!1,stencil:!1});G.physicallyCorrectLights=!0;G.shadowMap.type=Lo;G.shadowMap.enabled=!1;G.setClearColor(0,0);const Jt=new _o(100,100,{generateMipmaps:!1,stencilBuffer:!1,depthBuffer:!1,minFilter:ze,magFilter:ze}),ke=new Oo(G,{});function Ue(){return d.computeNormals||d.drawNormals||d.generateColor||(d.debug||d.mapMap||d.shadows)&&d.dayNightCycle}function Qt(){return(d.debug||d.mapMap||d.generateColor)&&d.drawTexture}function xa(){return d.dayNightCycle}function Ma(){if(V)return;V=new Go,V.scale.setScalar(1e8);const t={turbidity:0,rayleigh:.5,mieCoefficient:.005,mieDirectionalG:.7,inclination:.48,azimuth:.25,exposure:G.toneMappingExposure},e=V.material.uniforms;e.turbidity.value=t.turbidity,e.rayleigh.value=t.rayleigh,e.mieCoefficient.value=t.mieCoefficient,e.mieDirectionalG.value=t.mieDirectionalG;const i=Math.PI*(t.inclination-.5),o=2*Math.PI*(t.azimuth-.5),a=new D;return a.x=Math.cos(o),a.y=Math.sin(o)*Math.sin(i),a.z=Math.sin(o)*Math.cos(i),e.sunPosition.value.copy(a),V}const ne=new Ao;let qi;function Ki(t){const e=qi!==t;qi=t,Lt(i=>{const o=H.useSharedShader?i.userData:i.material.userData;i.isVisible()&&(e||!(o.map&&o.map.value))&&(o.map.value=null,i.isTextureReady=!1,i.initialize())})}function yt(){it(),!!V&&(V.visible=O.visible=xa())}let Qe={},ei={},et={},bt,Yi;const ya=document.getElementById("compass"),Ji=document.getElementById("compass_slice"),Qi=document.getElementById("compass_label");document.body.style.backgroundColor=d.dark?"black":"white";const ba=document.getElementById("camera_button");ba.style.visibility=W?"visible":"hidden";Object.keys(d).forEach(t=>{const e=document.getElementById(t);if(!!e){if(e.type==="checkbox")Qe[t]=e,Qe[t].onchange=i=>Be(t,i.target.checked),Qe[t].checked=d[t];else if(e.type==="range"){et[t]=e,et[t].oninput=o=>Be(t,o.target.value),et[t].value=d[t];let i=document.getElementById(t+"Label");i&&(ei[t]=i)}}}),bt=document.getElementById("selectedPeakLabel"),Yi=document.getElementById("selectedPeak");const Ta=new zo(Mt);Ta.on("tap",function(t){te=new ye(t.center.x,t.center.y),le(!0)});const Ge=new ca(d.local),Tt=wa(function(t=!1){!Yt||!R||!z||R.lod.updateLOD(R,_,G,ne,t)},W?200:0);function eo(){if(ya){let t;M.deviceOrientationEnabled?t=M.orientationAzimuth*Xt%360:t=M.azimuthAngle*Xt%360,Qi&&(Qi.innerText=t.toFixed()+"\xB0");const e=Et*j/$;Ji.style.backgroundImage=`conic-gradient(transparent 0deg,transparent ${180-e/2}deg, #15BFCC ${180-e/2}deg, #15BFCC ${180+e/2}deg, transparent ${180+e/2}deg)`,Ji.style.transform=`rotateZ(${-t-180}deg)`}}function ti(t=!1){M.getPosition(A),Tt(t),eo(),le()}function Ea(){const t=H.scaleRatio;Ge.maxOverZoom=W?0:2,W?(tt.subdivideDistance=60*t,tt.simplifyDistance=160*t):(tt.subdivideDistance=70*t,tt.simplifyDistance=170*t)}const tt=new Ko;Ea();function ii(){let t;return d.mapMap?(t=new ua(d.local),t.zoomDelta=2):d.debug?t=new na:t=new ra,t.minZoom=5,t.maxZoom=Ge.maxZoom+Ge.maxOverZoom,t.minLevelForZoomDelta=11,t}function Da(t){if(le(),z&&qt&&t.level>Ge.maxZoom-3){const e=K.tileToBBOX([t.x,t.y,t.level]);z.lat>=e[1]&&z.lat<=e[3]&&z.lon>=e[0]&&z.lon<=e[2]&&to(z,t)}}function oi(){if(!xt)return;R!==void 0&&(ne.remove(R),qe(R.root));const t=ii();R=new Re(null,t,Ge,!1,Da),R.lowMemoryUsage=!0,R.maxZoomForObjectHolders=13,R.setRoot(new H(null,R,E.root,0,0,0)),R.lod=tt,R.updateMatrixWorld(!0),ne.add(R)}let ai=(screen.orientation||{}).type;function si(){if(W){const t=j>$?$/j:j/$;return(/landscape/.test(ai)?t:1)*d.fovFactor}return d.fovFactor}let Et=si();const ve=H.scaleRatio,_=new Io(Et,j/$,d.near*ve,d.far*ve);window.addEventListener("orientationchange",function(t){ai=t.target.screen.orientation.type,_.fov=Et=si(),_.updateProjectionMatrix(),M.azimuthRotateSpeed=M.polarRotateSpeed=Dt()/St,eo()},!1);_.position.set(0,0,$i);const M=new ga(_,Mt);function we(){M.update(1)}function Dt(){if(W){const t=j>$?$/j:j/$;return(/landscape/.test(ai)?t:1)*-.12}else return-.1}M.azimuthRotateSpeed=Dt();M.polarRotateSpeed=Dt();M.minZoom=1;M.maxZoom=20;M.truckSpeed=1/$i*1e5*ve;M.mouseButtons.wheel=dt.ACTION.ZOOM;M.touches.two=dt.ACTION.TOUCH_ZOOM_TRUCK;M.verticalDragToForward=!0;M.saveState();let Pt=5,Rt=.05;if(!W){const t={W:87,A:65,S:83,D:68,ARROW_LEFT:37,ARROW_UP:38,ARROW_RIGHT:39,ARROW_DOWN:40},e=new fe(t.W,16.666),i=new fe(t.A,16.666),o=new fe(t.S,16.666),a=new fe(t.D,16.666);i.addEventListener("holding",function(c){M.truck(-Pt*ve*c.deltaTime,0,!1),M.update(c.deltaTime)}),a.addEventListener("holding",function(c){M.truck(Pt*ve*c.deltaTime,0,!1),M.update(c.deltaTime)}),e.addEventListener("holding",function(c){M.forward(Pt*ve*c.deltaTime,!1),M.update(c.deltaTime)}),o.addEventListener("holding",function(c){M.forward(-Pt*ve*c.deltaTime,!1),M.update(c.deltaTime)});const s=new fe(t.ARROW_LEFT,16.666),n=new fe(t.ARROW_RIGHT,16.666),r=new fe(t.ARROW_UP,16.666),l=new fe(t.ARROW_DOWN,16.666);s.addEventListener("holding",function(c){M.rotate(Rt*Ie.DEG2RAD*c.deltaTime,0,!0),M.update(c.deltaTime)}),n.addEventListener("holding",function(c){M.rotate(-Rt*Ie.DEG2RAD*c.deltaTime,0,!0),M.update(c.deltaTime)}),r.addEventListener("holding",function(c){M.rotate(0,-Rt*Ie.DEG2RAD*c.deltaTime,!0),M.update(c.deltaTime)}),l.addEventListener("holding",function(c){M.rotate(0,Rt*Ie.DEG2RAD*c.deltaTime,!0),M.update(c.deltaTime)})}let O,V;const Oe=new No(16777215);ne.add(Oe);function it(){d.mapMap&&d.dayNightCycle?Oe.intensity=1:d.generateColor?Oe.intensity=d.dayNightCycle?2:3:Oe.intensity=3}function ni(){if(!V)return;const t=Math.PI/2-O.elevation,e=Math.PI-O.azimuth,i=new D;i.setFromSphericalCoords(1,t,e),V.material.uniforms.sunPosition.value.copy(i)}function Ct(){Zi=Ga(),window.nsWebViewBridge&&window.nsWebViewBridge.emit("viewingDistance",Zi)}function Pa(t,e=!1,i=!0){if(t===z)return;M.getPosition(A);const o=H.scaleRatio,a=S.sphericalToDatums(A.x/o,-A.z/o);at(null);const s=S.datumsToSpherical(t.lat,t.lon,null,o);if(e){const n=At(a,t),r=d.elevation;let l=r;t.altitude&&(Wi=t.altitude+100,l=Wi);const c=n>1e5?11e3*d.exageration:l;co({from:{x:A.x,y:-A.z,progress:0},to:Me(X({},s),{progress:1}),duration:Math.min(n/20,3e3),preventComputeFeatures:!0,onUpdate:h=>{const w=h,{progress:m}=w,u=gi(w,["progress"]);if(m<=.5){const x=2*m;M.moveTo(u.x,(r+x*(c-r))*d.exageration*o,-u.y,!1)}else{const x=(m-.5)*2;M.moveTo(u.x,(c+x*(l-c))*d.exageration*o,-u.y,!1)}we()},onEnd:()=>{z=t,Be("elevation",l,!1),Ct(),ri()}})}else t.altitude&&Be("elevation",t.altitude,!1),M.moveTo(s.x,d.elevation*d.exageration*o,-s.y,!1),Ct(),i&&we(),V&&(O.setPosition(t.lat,t.lon),M.getPosition(A),O.setWorldPosition(A),it(),ni())}window.setPosition=Pa;function to(t=z,e,i=60){if(qt=!1,t){const o=Ra(t,e);if(o===-1e5||isNaN(o))qt=!0;else{const a=Se||o,s=d.elevation-a;Se=o,s>0&&s<500&&Be("elevation",Se+Math.max(s,i))}}else Se=void 0}function Ra(t,e){const i=R.heightProvider.maxZoom;let o=i,a;for(;!e&&o>i-3;)a=K.pointToTileFraction(t.lon,t.lat,o),e=$o(a[2],Math.floor(a[0]),Math.floor(a[1])),o-=1;if(e&&e.heightLoaded&&e.userData.displacementMap.value){const s=e.userData.displacementMap.value,n=e.userData.displacementMapLocation.value,r=Ni(Ii(s.image),n,t,e.level),l=d.elevationDecoder;return r[0]/255*l[0]+r[1]/255*l[1]+r[2]/255*l[2]+l[3]}else return-1e5}let ri;function Ca(t){ri=Ui(function(){window.electron&&window.electron.ipcRenderer.send("message",Me(X({},z),{altitude:d.elevation})),window.nsWebViewBridge&&window.nsWebViewBridge.emit("position",Me(X({},z),{altitude:d.elevation}))},t)}Ca(100);function Sa(){M.getPosition(A);const t=H.scaleRatio,e=S.sphericalToDatums(A.x/t,-A.z/t);(!z||z.lat!==e.lat||z.lon!==e.lon)&&(O&&O.setWorldPosition(A),z=e,to(),ri())}M.addEventListener("update",()=>{Ve||Sa(),ti()});M.addEventListener("controlend",()=>{Tt(),M.getPosition(A);const t=H.scaleRatio,e=S.sphericalToDatums(A.x/t,-A.z/t);(!z||z.lat!==e.lat||z.lon!==e.lon||z.altitude!==d.elevation)&&(z=Me(X({},e),{altitude:d.elevation}),Ct()),le(!0)});let St=_.zoom;M.addEventListener("control",t=>{const e=M.zooming,i=M.trucking;St!==_.zoom&&(St=_.zoom,M.azimuthRotateSpeed=M.polarRotateSpeed=Dt()/St),we(),L&&i&&so(),e&&window.nsWebViewBridge&&window.nsWebViewBridge.emit("zoom",_.zoom),le()});class La extends Zo{constructor(e,i){super(e,i)}render(e,i,o,a,s){R.visible=!1,super.render(e,i,o,a,s),R.visible=!0}}const ot=new Ho(ne,_);ke.addPass(ot);const li=new va,re=new La(_,li);re.renderToScreen=!0;re.enabled=!Ot();ot.renderToScreen=!re.enabled;ke.addPass(re);let io=0;function oo(){let t,e,i=Oe.visible;Oe.visible=!1,V&&(t=V.visible,e=O.visible,V.visible=!1,O.visible=!1),He.uniforms.depthTexture.value=ke.depthTexture,Lt(o=>{const a=o.isVisible();a&&(o.wasVisible=a,o.hide()),o.objectsHolder.visible=a||o.level===R.maxZoomForObjectHolders&&o.parentNode.subdivided}),d.debugFeaturePoints&&G.render(ne,_),G.setRenderTarget(Jt),G.clear(),G.render(ne,_),G.setRenderTarget(null),Ba(),He.uniforms.depthTexture.value=null,Lt(o=>{o.wasVisible&&(delete o.wasVisible,o.show()),o.objectsHolder.visible=o.isVisible()&&d.debugFeaturePoints||o.level===R.maxZoomForObjectHolders&&o.parentNode.subdivided}),V&&(V.visible=t,O.visible=e),Oe.visible=i}const _a=Ui(oo,W?300:100);document.body.onresize=function(){Yt=!0,j=window.innerWidth,$=window.innerHeight;const t=j/$;t>1?(Le=800,_e=Math.round(Le/t)):(_e=800,Le=Math.round(_e*t)),io=Fe/$*_e,ge.width=Math.floor(j*vt),ge.height=Math.floor($*vt),Xi=1+(vt-1)/2,G.setSize(j,$),G.setPixelRatio(Xi),ee=new Uint8Array(Le*_e*4),Jt.setSize(Le,_e),ke.setSize(j,$),_.aspect=t,_.updateProjectionMatrix(),!R&&z&&oi(),Tt(),le(!0)};document.body.onresize();we();function Oa(t){const e=t.clone();e.project(_);const i=j/2,o=$/2;return e.x=e.x*i+i,e.y=-(e.y*o)+o,e.z=_.position.distanceTo(t),e}function ci(t,e){e(t),t.children.forEach(i=>{i instanceof E&&ci(i,e)}),t.childrenCache&&t.childrenCache.forEach(i=>{i instanceof E&&ci(i,e)})}function Lt(t){R&&ci(R.children[0],t)}function ao(t,e,i,o,a,s,n=!1){const r=e.split(" ");let l="",c=1;for(let h=0;h<r.length;h++){const m=l+(h>0?" ":"")+r[h];t.measureText(m).width>a&&h>0?(n||t.fillText(l,i,o),l=r[h],o+=s,c++):l=m}if(n||t.fillText(l,i,o),n)return{x:i+t.measureText(l).width,y:o,nbLines:c}}function Aa(t,e,i,o,a,s){o<2*s&&(s=o/2),a<2*s&&(s=a/2),t.beginPath(),t.moveTo(e+s,i),t.arcTo(e+o,i,e+o,i+a,s),t.arcTo(e+o,i+a,e,i+a,s),t.arcTo(e,i+a,e,i,s),t.arcTo(e,i,e+o,i,s),t.closePath()}function za(t,e){return t.length>e?t.slice(0,e-1)+"\u2026":t}function Ia(){const t={lat:L.geometry.coordinates[1],lon:L.geometry.coordinates[0],altitude:L.properties.ele},e=At(z,t);bt.innerText=L.properties.name+" "+L.properties.ele+"m("+Math.round(e/100)/10+"km)"}function so(){if(window.nsWebViewBridge){let t=0;if(L){M.getPosition(A);const e=H.scaleRatio,i=S.sphericalToDatums(A.x/e,-A.z/e),o={lat:L.geometry.coordinates[1],lon:L.geometry.coordinates[0],altitude:L.properties.ele};t=At(i,o)}window.nsWebViewBridge.emit("selected",L?Me(X({},L),{distance:t}):null)}}function at(t){te=null,t!==L&&(L=t,so(),bt&&(L?Ia():bt.innerText=null,Yi.style.visibility=L?"visible":"hidden"))}function hi(t){return d.local?L&&t.properties.osmid===L.properties.osmid:L&&t.properties.name===L.properties.name&&t.properties.ele===L.properties.ele}function di(t){return Math.sqrt(Math.pow(te.x-t.x,2)+Math.pow(te.y-t.y,2))}const Ze=W?26:44;function Na(){if(!d.readFeatures||Ve)return;const t=new Array(j);let e=-1e4,i;const o=[],a=H.scaleRatio;Gi.forEach(r=>{const l=S.datumsToSpherical(r.geometry.coordinates[1],r.geometry.coordinates[0],null,a),c=r.properties.ele||0;A.set(l.x,c*d.exageration*a,-l.y);const h=Oa(A),m=Math.floor(h.x),u=h.y,w=h.z;if(u<Fe-20||w>d.far*a+1e3||w/c>d.far*a/3e3)return;c>e&&(i=m,e=c),(t[m]=t[m]||[]).push(Me(X({},r),{x:m,y:u,z:w}))});let s=i;function n(r,l,c){const h=t.slice(r,l).filter(u=>Boolean(u)).flat();if(h.length===0)return s+=c,!0;let m;if(te&&te.x>=r&&te.x<=l){const u=h.reduce((w,x)=>di(w)<di(x)?w:x);di(u)<20&&(m=u,at(m))}if(!m&&L){const u=h.findIndex(w=>hi(w));u!==-1&&(m=h[u])}m||(m=h.reduce((u,w)=>Math.pow(u.properties.ele,2)>Math.pow(w.properties.ele,2)?u:w)),s=m.x+c,o.push(m)}for(s=i-Ze/2;s<j;)!n(s,s+Ze,Ze);for(s=i-Ze;s>=0;)!n(s-Ze,s,-Ze);ui(o)}const st=15,no=-Math.PI/4,Ha=Math.round(Fe/Math.cos(no)-20),ro=-16,lo=21,_t=!W;function ui(t){const e=vt,i=t.length;P.save(),P.clearRect(0,0,ge.width,ge.height),P.scale(e,e);const o=d.dark?"white":"black",a=d.dark?"#000000":"#ffffff";let s,n,r,l,c,h,m,u,w,x;for(let g=0;g<i;g++){s=t[g],n=s.y,r=L&&hi(s),d.drawLines&&n>Fe&&(P.beginPath(),P.strokeStyle=o,P.lineWidth=r?3:1,P.moveTo(s.x,Fe),P.lineTo(s.x,n),P.closePath(),P.stroke()),P.save(),P.translate(s.x,Fe),P.rotate(no),r?P.font=`bold ${st}px Noto Sans`:P.font=`${st}px Noto Sans`,l=_t?s.properties.name:za(s.properties.name,30),c=P.measureText(l).width,h=Math.min(c,Ha);let b={y:_t&&d.drawElevations?st:0,x:_t?0:h};_t&&c!==h&&(b=ao(P,l,5,0,h,st,!0));let f=h+10,p;if(d.drawElevations&&(p=s.properties.ele+"m",m=P.measureText(p).width,f+=m-5),te&&(u=P.getTransform().inverse(),w=new DOMPoint(te.x*e,te.y*e),x=w.matrixTransform(u),x.x>=0&&x.x<f&&x.y<-ro&&x.y>=-(lo+b.y))){let v=L!==s;if(at(s),v)return P.restore(),P.restore(),ui(t)}P.fillStyle=a+"cc",Aa(P,0,ro,f,lo+b.y,8),P.fill(),P.fillStyle=o,b.y!==0?ao(P,l,5,0,h,st):P.fillText(l,5,0),d.drawElevations&&(P.font="normal 11px Courier",P.fillText(p,b.x+10,b.y)),P.restore()}P.restore(),te&&L&&(at(null),ui(t))}function Ba(){const t=Le;G.readRenderTargetPixels(Jt,0,0,Le,_e,ee);const e=[],i=[];let o=Boolean(L),a;function s(r){const l=e.indexOf(a);if(l===-1){const c=zi[a];if(c){e.push(a);const h=X({},c);return i.push(h),o&&hi(c)&&(o=!1),h}}else return i[l]}const n=ee.length-io*4*t;for(let r=0;r<n;r+=4)if(ee[r+3]!==0&&(ee[r]!==0||ee[r+1]!==0||ee[r+2]!==0)){const l=(ee[r]<<16)+(ee[r+1]<<8)+ee[r+2];a!==l&&(a&&s(),a=l)}else a&&(s(),a=null);a&&(s(),a=null),o&&at(null),Gi=i}function Ot(){return(d.debug||d.mapMap||d.generateColor)&&!d.outline}function Fa(t){ke.render(ji.getDelta()),!Ve&&d.readFeatures&&ee&&(t?oo():_a()),Na()}function le(t=!1){!Yt||(!wt&&t&&(wt=t),Kt||(Kt=!0,requestAnimationFrame(Va)))}function Va(){Kt=!1,!(!G||!ke||!R)&&(Fa(wt),wt=!1,de&&de.update())}document.addEventListener("DOMContentLoaded",function(){const t=Object.assign({},d,{setPosition:{lat:45.1811,lon:5.8141,altitude:2144},setAzimuth:0,terrarium:Ge.terrarium});Ua(t)});function co({from:t,to:e,duration:i,onUpdate:o,onEnd:a,preventComputeFeatures:s}){Ve=s,Ve&&P.clearRect(0,0,ge.width,ge.height),new Wo({onRender:o,onFinish:()=>{a&&a(),Ve=!1,le(!0)}}).tween(t,e,i)}function ka(t,e=!0,i=!0){const o=M.azimuthAngle*Xt%360;o!==t&&(Math.abs(t-360-o)<Math.abs(t-o)&&(t=t-360),e?co({from:{progress:o},to:{progress:t},duration:200,onUpdate:function(a){M.azimuthAngle=a.progress*se,we()}}):(M.azimuthAngle=t*se,i&&we()))}window.setAzimuth=ka;function Ua(t){try{xt=!1,Object.keys(t).sort().forEach(e=>{const i=t[e];Be(e,i,!1,!1)}),xt=!0,R||oi(),we(),le(!0)}catch(e){console.error(e)}}function At(t,e){const i=(t.latitude||t.lat)*se,o=(t.longitude||t.lon)*se,a=(e.latitude||e.lat)*se,s=(e.longitude||e.lon)*se;return Math.round(Math.acos(Math.sin(a)*Math.sin(i)+Math.cos(a)*Math.cos(i)*Math.cos(o-s))*S.EARTH_RADIUS)}function Ga(){if(!z)return 0;var t=new D(0,0,-_.far);t.applyMatrix4(_.matrixWorld);const e=H.scaleRatio,i=S.sphericalToDatums(t.x/e,-t.z/e);return At(z,i)}
