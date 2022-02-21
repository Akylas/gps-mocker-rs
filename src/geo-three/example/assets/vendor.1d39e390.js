var zu=Object.defineProperty,Vu=Object.defineProperties;var ku=Object.getOwnPropertyDescriptors;var Ml=Object.getOwnPropertySymbols;var Hu=Object.prototype.hasOwnProperty,Gu=Object.prototype.propertyIsEnumerable;var ba=(r,e,t)=>e in r?zu(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t,en=(r,e)=>{for(var t in e||(e={}))Hu.call(e,t)&&ba(r,t,e[t]);if(Ml)for(var t of Ml(e))Gu.call(e,t)&&ba(r,t,e[t]);return r},Kn=(r,e)=>Vu(r,ku(e));var Sa=(r,e,t)=>(ba(r,typeof e!="symbol"?e+"":e,t),t);var Wu={clone:function(r){var e={};for(var t in r)e[t]=r[t];return e},reduce:function(r,e,t,n){for(var i in r)r[i]-=(e[i]-t[i])*n;return r}};function Xu(r,e){for(var t=0;t<e.length;t++){var n=e[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(r,n.key,n)}}function rs(r,e,t){return e in r?Object.defineProperty(r,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):r[e]=t,r}function Ta(){}function qu(r){return r}var hM=function(){function r(n){var i=this;(function(g,v){if(!(g instanceof v))throw new TypeError("Cannot call a class as a function")})(this,r),rs(this,"tween",void 0),rs(this,"isTweening",void 0),rs(this,"finish",void 0),rs(this,"cancel",void 0);var s=0,a=null,o=null,l=[],c=n.onRender||Ta,h=n.stateReducer||Wu,u=n.onFinish||Ta,d=n.onCancel||Ta,f=function g(){if(a!==null){var v=i.now();o=function(w){for(var m,p,b=h.clone(a),M=l.length-1;M>=0;M--)(m=l[M]).end<w||(p=(m.end-w)/m.duration,b=h.reduce(b,m.toState,m.fromState,m.easing(p)));return b}(v),c(o),function(w){for(var m=l.length-1;m>=0;m--)if(l[m].end>=w)return!0;return!1}(v)?s=i.scheduleAnimationFrame(g):i.finish()}};this.isTweening=function(){return!!a},this.finish=function(){a!==null&&(u(a),a=null,o=null)},this.cancel=function(){a!==null&&(window.cancelAnimationFrame&&(window.cancelAnimationFrame(s),s=0),d(),a=null,o=null)},this.tween=function(g,v,w,m){var p=this.now(),b={duration:w,end:p+w,fromState:a===null?g:a,toState:v,easing:m||qu};(function(M){for(var E=[],D=l.length-1;D>=0;D--)l[D].end>M&&E.push(l[D]);l=E})(p),l.push(b),a=v,s=this.scheduleAnimationFrame(f)}}var e,t;return e=r,(t=[{key:"scheduleAnimationFrame",value:function(n){return window.requestAnimationFrame(n)}},{key:"now",value:function(){return window.performance&&window.performance.now?window.performance.now():Date.now?Date.now():new Date().getTime()}}])&&Xu(e.prototype,t),r}();/*!
 * camera-controls
 * https://github.com/yomotsu/camera-controls
 * (c) 2017 @yomotsu
 * Released under the MIT License.
 *//*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */var Ea=function(r,e){return Ea=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n}||function(t,n){for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(t[i]=n[i])},Ea(r,e)};function Yu(r,e){if(typeof e!="function"&&e!==null)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");Ea(r,e);function t(){this.constructor=r}r.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}var Ee;(function(r){r[r.NONE=0]="NONE",r[r.ROTATE=1]="ROTATE",r[r.TRUCK=2]="TRUCK",r[r.OFFSET=3]="OFFSET",r[r.DOLLY=4]="DOLLY",r[r.ZOOM=5]="ZOOM",r[r.TOUCH_ROTATE=6]="TOUCH_ROTATE",r[r.TOUCH_TRUCK=7]="TOUCH_TRUCK",r[r.TOUCH_OFFSET=8]="TOUCH_OFFSET",r[r.TOUCH_DOLLY=9]="TOUCH_DOLLY",r[r.TOUCH_ZOOM=10]="TOUCH_ZOOM",r[r.TOUCH_DOLLY_TRUCK=11]="TOUCH_DOLLY_TRUCK",r[r.TOUCH_DOLLY_OFFSET=12]="TOUCH_DOLLY_OFFSET",r[r.TOUCH_ZOOM_TRUCK=13]="TOUCH_ZOOM_TRUCK",r[r.TOUCH_ZOOM_OFFSET=14]="TOUCH_ZOOM_OFFSET"})(Ee||(Ee={}));function ei(r){return r.isPerspectiveCamera}function Fn(r){return r.isOrthographicCamera}var vi=Math.PI*2,wl=Math.PI/2,bl=1e-5;function at(r,e){return e===void 0&&(e=bl),Math.abs(r)<e}function ot(r,e,t){return t===void 0&&(t=bl),at(r-e,t)}function Sl(r,e){return Math.round(r/e)*e}function cr(r){return isFinite(r)?r:r<0?-Number.MAX_VALUE:Number.MAX_VALUE}function hr(r){return Math.abs(r)<Number.MAX_VALUE?r:r*(1/0)}function Aa(r,e){e.set(0,0),r.forEach(function(t){e.x+=t.clientX,e.y+=t.clientY}),e.x/=r.length,e.y/=r.length}function Ca(r,e){return Fn(r)?(console.warn(e+" is not supported in OrthographicCamera"),!0):!1}function Tl(r){return r.invert?r.invert():r.inverse(),r}var Zu=function(){function r(){this._listeners={}}return r.prototype.addEventListener=function(e,t){var n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)},r.prototype.removeEventListener=function(e,t){var n=this._listeners,i=n[e];if(i!==void 0){var s=i.indexOf(t);s!==-1&&i.splice(s,1)}},r.prototype.removeAllEventListeners=function(e){if(!e){this._listeners={};return}Array.isArray(this._listeners[e])&&(this._listeners[e].length=0)},r.prototype.dispatchEvent=function(e){var t=this._listeners,n=t[e.type];if(n!==void 0){e.target=this;for(var i=n.slice(0),s=0,a=i.length;s<a;s++)i[s].call(this,e)}},r}(),El=typeof window!="undefined",ju=El&&/Mac/.test(navigator.platform),Al=!(El&&"PointerEvent"in window),Ju=Object.freeze(Ee),ss=1/8,we,Cl,as,La,zt,Ve,Qe,xi,dn,fn,ti,tn,ur,dr,Ll,Ra,Rl,Pl,Pa,os,uM=function(r){Yu(e,r);function e(t,n){var i=r.call(this)||this;if(i.minPolarAngle=0,i.maxPolarAngle=Math.PI,i.minAzimuthAngle=-1/0,i.maxAzimuthAngle=1/0,i.minDistance=0,i.maxDistance=1/0,i.infinityDolly=!1,i.minZoom=.01,i.maxZoom=1/0,i.dampingFactor=.05,i.draggingDampingFactor=.25,i.azimuthRotateSpeed=1,i.polarRotateSpeed=1,i.dollySpeed=1,i.truckSpeed=2,i.dollyToCursor=!1,i.dragToOffset=!1,i.verticalDragToForward=!1,i.boundaryFriction=0,i.restThreshold=.01,i.colliderMeshes=[],i.cancel=function(){},i._enabled=!0,i._state=Ee.NONE,i._viewport=null,i._dollyControlAmount=0,i._hasRested=!0,i._boundaryEnclosesCamera=!1,i._needsUpdate=!0,i._updatedLastTime=!1,i._activePointers=[],i._truckInternal=function(R,F,z){if(ei(i._camera)){var P=Ve.copy(i._camera.position).sub(i._target),ne=i._camera.getEffectiveFOV()*we.MathUtils.DEG2RAD,U=P.length()*Math.tan(ne*.5),N=i.truckSpeed*R*U/i._elementRect.w,H=i.truckSpeed*F*U/i._elementRect.w;i.verticalDragToForward?(z?i.setFocalOffset(i._focalOffsetEnd.x+N,i._focalOffsetEnd.y,i._focalOffsetEnd.z,!0):i.truck(N,0,!0),i.forward(-H,!0)):z?i.setFocalOffset(i._focalOffsetEnd.x+N,i._focalOffsetEnd.y+H,i._focalOffsetEnd.z,!0):i.truck(N,H,!0)}else if(Fn(i._camera)){var V=i._camera,N=R*(V.right-V.left)/V.zoom/i._elementRect.z,H=F*(V.top-V.bottom)/V.zoom/i._elementRect.w;z?i.setFocalOffset(i._focalOffsetEnd.x+N,i._focalOffsetEnd.y+H,i._focalOffsetEnd.z,!0):i.truck(N,H,!0)}},i._rotateInternal=function(R,F){var z=vi*i.azimuthRotateSpeed*R/i._elementRect.w,P=vi*i.polarRotateSpeed*F/i._elementRect.w;i.rotate(z,P,!0)},i._dollyInternal=function(R,F,z){var P=Math.pow(.95,-R*i.dollySpeed),ne=i._sphericalEnd.radius*P,U=i._sphericalEnd.radius,N=U*(R>=0?-1:1);i.dollyTo(ne),i.infinityDolly&&(ne<i.minDistance||i.maxDistance===i.minDistance)&&(i._camera.getWorldDirection(Ve),i._targetEnd.add(Ve.normalize().multiplyScalar(N)),i._target.add(Ve.normalize().multiplyScalar(N))),i.dollyToCursor&&(i._dollyControlAmount+=i._sphericalEnd.radius-U,i.infinityDolly&&(ne<i.minDistance||i.maxDistance===i.minDistance)&&(i._dollyControlAmount-=N),i._dollyControlCoord.set(F,z))},i._zoomInternal=function(R,F,z){var P=Math.pow(.95,R*i.dollySpeed);i.zoomTo(i._zoom*P),i.dollyToCursor&&(i._dollyControlAmount=i._zoomEnd,i._dollyControlCoord.set(F,z))},typeof we=="undefined"&&console.error("camera-controls: `THREE` is undefined. You must first run `CameraControls.install( { THREE: THREE } )`. Check the docs for further information."),i._camera=t,i._yAxisUpSpace=new we.Quaternion().setFromUnitVectors(i._camera.up,as),i._yAxisUpSpaceInverse=Tl(i._yAxisUpSpace.clone()),i._state=Ee.NONE,i._domElement=n,i._domElement.style.touchAction="none",i._target=new we.Vector3,i._targetEnd=i._target.clone(),i._focalOffset=new we.Vector3,i._focalOffsetEnd=i._focalOffset.clone(),i._spherical=new we.Spherical().setFromVector3(Ve.copy(i._camera.position).applyQuaternion(i._yAxisUpSpace)),i._sphericalEnd=i._spherical.clone(),i._zoom=i._camera.zoom,i._zoomEnd=i._zoom,i._nearPlaneCorners=[new we.Vector3,new we.Vector3,new we.Vector3,new we.Vector3],i._updateNearPlaneCorners(),i._boundary=new we.Box3(new we.Vector3(-1/0,-1/0,-1/0),new we.Vector3(1/0,1/0,1/0)),i._target0=i._target.clone(),i._position0=i._camera.position.clone(),i._zoom0=i._zoom,i._focalOffset0=i._focalOffset.clone(),i._dollyControlAmount=0,i._dollyControlCoord=new we.Vector2,i.mouseButtons={left:Ee.ROTATE,middle:Ee.DOLLY,right:Ee.TRUCK,wheel:ei(i._camera)?Ee.DOLLY:Fn(i._camera)?Ee.ZOOM:Ee.NONE,shiftLeft:Ee.NONE},i.touches={one:Ee.TOUCH_ROTATE,two:ei(i._camera)?Ee.TOUCH_DOLLY_TRUCK:Fn(i._camera)?Ee.TOUCH_ZOOM_TRUCK:Ee.NONE,three:Ee.TOUCH_TRUCK},i._elementRect=new we.Vector4,i._domElement){var s=new we.Vector2,a=new we.Vector2,o=new we.Vector2,l=function(){i._state=Ee.NONE,i._activePointers.length=0,_()},c=function(R){if(!!i._enabled){var F={pointerId:R.pointerId,clientX:R.clientX,clientY:R.clientY};switch(i._activePointers.push(F),R.button){case we.MOUSE.LEFT:i._state=R.shiftKey?i.mouseButtons.shiftLeft:i.mouseButtons.left;break;case we.MOUSE.MIDDLE:i._state=i.mouseButtons.middle;break;case we.MOUSE.RIGHT:i._state=i.mouseButtons.right;break}if(R.pointerType==="touch")switch(i._activePointers.length){case 1:i._state=i.touches.one;break;case 2:i._state=i.touches.two;break;case 3:i._state=i.touches.three;break}i._domElement.ownerDocument.removeEventListener("pointermove",d,{passive:!1}),i._domElement.ownerDocument.removeEventListener("pointerup",v),i._domElement.ownerDocument.addEventListener("pointermove",d,{passive:!1}),i._domElement.ownerDocument.addEventListener("pointerup",v),E()}},h=function(R){if(!!i._enabled){var F={pointerId:0,clientX:R.clientX,clientY:R.clientY};switch(i._activePointers.push(F),R.button){case we.MOUSE.LEFT:i._state=R.shiftKey?i.mouseButtons.shiftLeft:i.mouseButtons.left;break;case we.MOUSE.MIDDLE:i._state=i.mouseButtons.middle;break;case we.MOUSE.RIGHT:i._state=i.mouseButtons.right;break}i._domElement.ownerDocument.removeEventListener("mousemove",f),i._domElement.ownerDocument.removeEventListener("mouseup",w),i._domElement.ownerDocument.addEventListener("mousemove",f),i._domElement.ownerDocument.addEventListener("mouseup",w),E()}},u=function(R){if(!!i._enabled){switch(R.preventDefault(),Array.prototype.forEach.call(R.changedTouches,function(F){var z={pointerId:F.identifier,clientX:F.clientX,clientY:F.clientY};i._activePointers.push(z)}),i._activePointers.length){case 1:i._state=i.touches.one;break;case 2:i._state=i.touches.two;break;case 3:i._state=i.touches.three;break}i._domElement.ownerDocument.removeEventListener("touchmove",g,{passive:!1}),i._domElement.ownerDocument.removeEventListener("touchend",m),i._domElement.ownerDocument.addEventListener("touchmove",g,{passive:!1}),i._domElement.ownerDocument.addEventListener("touchend",m),E()}},d=function(R){R.cancelable&&R.preventDefault();var F=R.pointerId,z=i._findPointerById(F);!z||(z.clientX=R.clientX,z.clientY=R.clientY,D())},f=function(R){var F=i._findPointerById(0);!F||(F.clientX=R.clientX,F.clientY=R.clientY,D())},g=function(R){R.cancelable&&R.preventDefault(),Array.prototype.forEach.call(R.changedTouches,function(F){var z=F.identifier,P=i._findPointerById(z);!P||(P.clientX=F.clientX,P.clientY=F.clientY)}),D()},v=function(R){var F=R.pointerId,z=i._findPointerById(F);if(z&&i._activePointers.splice(i._activePointers.indexOf(z),1),R.pointerType==="touch")switch(i._activePointers.length){case 0:i._state=Ee.NONE;break;case 1:i._state=i.touches.one;break;case 2:i._state=i.touches.two;break;case 3:i._state=i.touches.three;break}else i._state=Ee.NONE;_()},w=function(){var R=i._findPointerById(0);R&&i._activePointers.splice(i._activePointers.indexOf(R),1),i._state=Ee.NONE,_()},m=function(R){switch(Array.prototype.forEach.call(R.changedTouches,function(F){var z=F.identifier,P=i._findPointerById(z);P&&i._activePointers.splice(i._activePointers.indexOf(P),1)}),i._activePointers.length){case 0:i._state=Ee.NONE;break;case 1:i._state=i.touches.one;break;case 2:i._state=i.touches.two;break;case 3:i._state=i.touches.three;break}_()},p=-1,b=function(R){if(!(!i._enabled||i.mouseButtons.wheel===Ee.NONE)){if(R.preventDefault(),i.dollyToCursor||i.mouseButtons.wheel===Ee.ROTATE||i.mouseButtons.wheel===Ee.TRUCK){var F=performance.now();p-F<1e3&&i._getClientRect(i._elementRect),p=F}var z=ju?-1:-3,P=R.deltaMode===1?R.deltaY/z:R.deltaY/(z*10),ne=i.dollyToCursor?(R.clientX-i._elementRect.x)/i._elementRect.z*2-1:0,U=i.dollyToCursor?(R.clientY-i._elementRect.y)/i._elementRect.w*-2+1:0;switch(i.mouseButtons.wheel){case Ee.ROTATE:{i._rotateInternal(R.deltaX,R.deltaY);break}case Ee.TRUCK:{i._truckInternal(R.deltaX,R.deltaY,!1);break}case Ee.OFFSET:{i._truckInternal(R.deltaX,R.deltaY,!0);break}case Ee.DOLLY:{i._dollyInternal(-P,ne,U);break}case Ee.ZOOM:{i._zoomInternal(-P,ne,U);break}}i.dispatchEvent({type:"control"})}},M=function(R){!i._enabled||R.preventDefault()},E=function(){if(!!i._enabled){Aa(i._activePointers,zt),i._getClientRect(i._elementRect),s.copy(zt),a.copy(zt);var R=i._activePointers.length>=2;if(R){var F=zt.x-i._activePointers[1].clientX,z=zt.y-i._activePointers[1].clientY,P=Math.sqrt(F*F+z*z);o.set(0,P);var ne=(i._activePointers[0].clientX+i._activePointers[1].clientX)*.5,U=(i._activePointers[0].clientY+i._activePointers[1].clientY)*.5;a.set(ne,U)}i.dispatchEvent({type:"controlstart"})}},D=function(){if(!!i._enabled){Aa(i._activePointers,zt);var R=a.x-zt.x,F=a.y-zt.y;switch(a.copy(zt),i._state){case Ee.ROTATE:case Ee.TOUCH_ROTATE:{i._rotateInternal(R,F);break}case Ee.DOLLY:case Ee.ZOOM:{var z=i.dollyToCursor?(s.x-i._elementRect.x)/i._elementRect.z*2-1:0,P=i.dollyToCursor?(s.y-i._elementRect.y)/i._elementRect.w*-2+1:0;i._state===Ee.DOLLY?i._dollyInternal(F*ss,z,P):i._zoomInternal(F*ss,z,P);break}case Ee.TOUCH_DOLLY:case Ee.TOUCH_ZOOM:case Ee.TOUCH_DOLLY_TRUCK:case Ee.TOUCH_ZOOM_TRUCK:case Ee.TOUCH_DOLLY_OFFSET:case Ee.TOUCH_ZOOM_OFFSET:{var ne=zt.x-i._activePointers[1].clientX,U=zt.y-i._activePointers[1].clientY,N=Math.sqrt(ne*ne+U*U),H=o.y-N;o.set(0,N);var z=i.dollyToCursor?(a.x-i._elementRect.x)/i._elementRect.z*2-1:0,P=i.dollyToCursor?(a.y-i._elementRect.y)/i._elementRect.w*-2+1:0;i._state===Ee.TOUCH_DOLLY||i._state===Ee.TOUCH_DOLLY_TRUCK||i._state===Ee.TOUCH_DOLLY_OFFSET?i._dollyInternal(H*ss,z,P):i._zoomInternal(H*ss,z,P),i._state===Ee.TOUCH_DOLLY_TRUCK||i._state===Ee.TOUCH_ZOOM_TRUCK?i._truckInternal(R,F,!1):(i._state===Ee.TOUCH_DOLLY_OFFSET||i._state===Ee.TOUCH_ZOOM_OFFSET)&&i._truckInternal(R,F,!0);break}case Ee.TRUCK:case Ee.TOUCH_TRUCK:{i._truckInternal(R,F,!1);break}case Ee.OFFSET:case Ee.TOUCH_OFFSET:{i._truckInternal(R,F,!0);break}}i.dispatchEvent({type:"control"})}},_=function(){Aa(i._activePointers,zt),a.copy(zt),i._activePointers.length===0&&(i._domElement.ownerDocument.removeEventListener("pointermove",d,{passive:!1}),i._domElement.ownerDocument.removeEventListener("pointerup",v),i._domElement.ownerDocument.removeEventListener("touchmove",g,{passive:!1}),i._domElement.ownerDocument.removeEventListener("touchend",m)),i.dispatchEvent({type:"controlend"})};i._domElement.addEventListener("pointerdown",c),Al&&i._domElement.addEventListener("mousedown",h),Al&&i._domElement.addEventListener("touchstart",u),i._domElement.addEventListener("pointercancel",v),i._domElement.addEventListener("wheel",b,{passive:!1}),i._domElement.addEventListener("contextmenu",M),i._removeAllEventListeners=function(){i._domElement.removeEventListener("pointerdown",c),i._domElement.removeEventListener("mousedown",h),i._domElement.removeEventListener("touchstart",u),i._domElement.removeEventListener("pointercancel",v),i._domElement.removeEventListener("wheel",b,{passive:!1}),i._domElement.removeEventListener("contextmenu",M),i._domElement.ownerDocument.removeEventListener("pointermove",d,{passive:!1}),i._domElement.ownerDocument.removeEventListener("mousemove",f),i._domElement.ownerDocument.removeEventListener("touchmove",g,{passive:!1}),i._domElement.ownerDocument.removeEventListener("pointerup",v),i._domElement.ownerDocument.removeEventListener("mouseup",w),i._domElement.ownerDocument.removeEventListener("touchend",m)},i.cancel=function(){l(),i.dispatchEvent({type:"controlend"})}}return i.update(0),i}return e.install=function(t){we=t.THREE,Cl=Object.freeze(new we.Vector3(0,0,0)),as=Object.freeze(new we.Vector3(0,1,0)),La=Object.freeze(new we.Vector3(0,0,1)),zt=new we.Vector2,Ve=new we.Vector3,Qe=new we.Vector3,xi=new we.Vector3,dn=new we.Vector3,fn=new we.Vector3,ti=new we.Vector3,tn=new we.Spherical,ur=new we.Spherical,dr=new we.Box3,Ll=new we.Box3,Ra=new we.Sphere,Rl=new we.Quaternion,Pl=new we.Quaternion,Pa=new we.Matrix4,os=new we.Raycaster},Object.defineProperty(e,"ACTION",{get:function(){return Ju},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"camera",{get:function(){return this._camera},set:function(t){this._camera=t,this.updateCameraUp(),this._camera.updateProjectionMatrix(),this._updateNearPlaneCorners(),this._needsUpdate=!0},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"enabled",{get:function(){return this._enabled},set:function(t){this._enabled=t,t||this.cancel()},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"active",{get:function(){return!this._hasRested},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"currentAction",{get:function(){return this._state},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"distance",{get:function(){return this._spherical.radius},set:function(t){this._spherical.radius===t&&this._sphericalEnd.radius===t||(this._spherical.radius=t,this._sphericalEnd.radius=t,this._needsUpdate=!0)},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"azimuthAngle",{get:function(){return this._spherical.theta},set:function(t){this._spherical.theta===t&&this._sphericalEnd.theta===t||(this._spherical.theta=t,this._sphericalEnd.theta=t,this._needsUpdate=!0)},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"polarAngle",{get:function(){return this._spherical.phi},set:function(t){this._spherical.phi===t&&this._sphericalEnd.phi===t||(this._spherical.phi=t,this._sphericalEnd.phi=t,this._needsUpdate=!0)},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"boundaryEnclosesCamera",{get:function(){return this._boundaryEnclosesCamera},set:function(t){this._boundaryEnclosesCamera=t,this._needsUpdate=!0},enumerable:!1,configurable:!0}),e.prototype.addEventListener=function(t,n){r.prototype.addEventListener.call(this,t,n)},e.prototype.removeEventListener=function(t,n){r.prototype.removeEventListener.call(this,t,n)},e.prototype.rotate=function(t,n,i){return i===void 0&&(i=!1),this.rotateTo(this._sphericalEnd.theta+t,this._sphericalEnd.phi+n,i)},e.prototype.rotateAzimuthTo=function(t,n){return n===void 0&&(n=!1),this.rotateTo(this._sphericalEnd.theta+t,this._sphericalEnd.phi,n)},e.prototype.rotatePolarTo=function(t,n){return n===void 0&&(n=!1),this.rotateTo(this._sphericalEnd.theta,this._sphericalEnd.phi+t,n)},e.prototype.rotateTo=function(t,n,i){i===void 0&&(i=!1);var s=we.MathUtils.clamp(t,this.minAzimuthAngle,this.maxAzimuthAngle),a=we.MathUtils.clamp(n,this.minPolarAngle,this.maxPolarAngle);this._sphericalEnd.theta=s,this._sphericalEnd.phi=a,this._sphericalEnd.makeSafe(),this._needsUpdate=!0,i||(this._spherical.theta=this._sphericalEnd.theta,this._spherical.phi=this._sphericalEnd.phi);var o=!i||ot(this._spherical.theta,this._sphericalEnd.theta,this.restThreshold)&&ot(this._spherical.phi,this._sphericalEnd.phi,this.restThreshold);return this._createOnRestPromise(o)},e.prototype.dolly=function(t,n){return n===void 0&&(n=!1),this.dollyTo(this._sphericalEnd.radius-t,n)},e.prototype.dollyTo=function(t,n){n===void 0&&(n=!1);var i=this._sphericalEnd.radius,s=we.MathUtils.clamp(t,this.minDistance,this.maxDistance),a=this.colliderMeshes.length>=1;if(a){var o=this._collisionTest(),l=ot(o,this._spherical.radius),c=i>s;if(!c&&l)return Promise.resolve();this._sphericalEnd.radius=Math.min(s,o)}else this._sphericalEnd.radius=s;this._needsUpdate=!0,n||(this._spherical.radius=this._sphericalEnd.radius);var h=!n||ot(this._spherical.radius,this._sphericalEnd.radius,this.restThreshold);return this._createOnRestPromise(h)},e.prototype.zoom=function(t,n){return n===void 0&&(n=!1),this.zoomTo(this._zoomEnd+t,n)},e.prototype.zoomTo=function(t,n){n===void 0&&(n=!1),this._zoomEnd=we.MathUtils.clamp(t,this.minZoom,this.maxZoom),this._needsUpdate=!0,n||(this._zoom=this._zoomEnd);var i=!n||ot(this._zoom,this._zoomEnd,this.restThreshold);return this._createOnRestPromise(i)},e.prototype.pan=function(t,n,i){return i===void 0&&(i=!1),console.warn("`pan` has been renamed to `truck`"),this.truck(t,n,i)},e.prototype.truck=function(t,n,i){i===void 0&&(i=!1),this._camera.updateMatrix(),dn.setFromMatrixColumn(this._camera.matrix,0),fn.setFromMatrixColumn(this._camera.matrix,1),dn.multiplyScalar(t),fn.multiplyScalar(-n);var s=Ve.copy(dn).add(fn),a=Qe.copy(this._targetEnd).add(s);return this.moveTo(a.x,a.y,a.z,i)},e.prototype.forward=function(t,n){n===void 0&&(n=!1),Ve.setFromMatrixColumn(this._camera.matrix,0),Ve.crossVectors(this._camera.up,Ve),Ve.multiplyScalar(t);var i=Qe.copy(this._targetEnd).add(Ve);return this.moveTo(i.x,i.y,i.z,n)},e.prototype.moveTo=function(t,n,i,s){s===void 0&&(s=!1);var a=Ve.set(t,n,i).sub(this._targetEnd);this._encloseToBoundary(this._targetEnd,a,this.boundaryFriction),this._needsUpdate=!0,s||this._target.copy(this._targetEnd);var o=!s||ot(this._target.x,this._targetEnd.x,this.restThreshold)&&ot(this._target.y,this._targetEnd.y,this.restThreshold)&&ot(this._target.z,this._targetEnd.z,this.restThreshold);return this._createOnRestPromise(o)},e.prototype.fitToBox=function(t,n,i){var s=i===void 0?{}:i,a=s.paddingLeft,o=a===void 0?0:a,l=s.paddingRight,c=l===void 0?0:l,h=s.paddingBottom,u=h===void 0?0:h,d=s.paddingTop,f=d===void 0?0:d,g=[],v=t.isBox3?dr.copy(t):dr.setFromObject(t);v.isEmpty()&&(console.warn("camera-controls: fitTo() cannot be used with an empty box. Aborting"),Promise.resolve());var w=Sl(this._sphericalEnd.theta,wl),m=Sl(this._sphericalEnd.phi,wl);g.push(this.rotateTo(w,m,n));var p=Ve.setFromSpherical(this._sphericalEnd).normalize(),b=Rl.setFromUnitVectors(p,La),M=ot(Math.abs(p.y),1);M&&b.multiply(Pl.setFromAxisAngle(as,w));var E=Ll.makeEmpty();Qe.copy(v.min).applyQuaternion(b),E.expandByPoint(Qe),Qe.copy(v.min).setX(v.max.x).applyQuaternion(b),E.expandByPoint(Qe),Qe.copy(v.min).setY(v.max.y).applyQuaternion(b),E.expandByPoint(Qe),Qe.copy(v.max).setZ(v.min.z).applyQuaternion(b),E.expandByPoint(Qe),Qe.copy(v.min).setZ(v.max.z).applyQuaternion(b),E.expandByPoint(Qe),Qe.copy(v.max).setY(v.min.y).applyQuaternion(b),E.expandByPoint(Qe),Qe.copy(v.max).setX(v.min.x).applyQuaternion(b),E.expandByPoint(Qe),Qe.copy(v.max).applyQuaternion(b),E.expandByPoint(Qe),b.setFromUnitVectors(La,p),E.min.x-=o,E.min.y-=u,E.max.x+=c,E.max.y+=f;var D=E.getSize(Ve),_=E.getCenter(Qe).applyQuaternion(b);if(ei(this._camera)){var R=this.getDistanceToFitBox(D.x,D.y,D.z);g.push(this.moveTo(_.x,_.y,_.z,n)),g.push(this.dollyTo(R,n)),g.push(this.setFocalOffset(0,0,0,n))}else if(Fn(this._camera)){var F=this._camera,z=F.right-F.left,P=F.top-F.bottom,ne=Math.min(z/D.x,P/D.y);g.push(this.moveTo(_.x,_.y,_.z,n)),g.push(this.zoomTo(ne,n)),g.push(this.setFocalOffset(0,0,0,n))}return Promise.all(g)},e.prototype.fitTo=function(t,n,i){return i===void 0&&(i={}),console.warn("camera-controls: fitTo() has been renamed to fitToBox()"),this.fitToBox(t,n,i)},e.prototype.fitToSphere=function(t,n){var i=[],s=t instanceof we.Sphere,a=s?Ra.copy(t):$u(t,Ra);if(i.push(this.moveTo(a.center.x,a.center.y,a.center.z,n)),ei(this._camera)){var o=this.getDistanceToFitSphere(a.radius);i.push(this.dollyTo(o,n))}else if(Fn(this._camera)){var l=this._camera.right-this._camera.left,c=this._camera.top-this._camera.bottom,h=2*a.radius,u=Math.min(l/h,c/h);i.push(this.zoomTo(u,n))}return i.push(this.setFocalOffset(0,0,0,n)),Promise.all(i)},e.prototype.setLookAt=function(t,n,i,s,a,o,l){l===void 0&&(l=!1);var c=Qe.set(s,a,o),h=Ve.set(t,n,i);this._targetEnd.copy(c),this._sphericalEnd.setFromVector3(h.sub(c).applyQuaternion(this._yAxisUpSpace)),this.normalizeRotations(),this._needsUpdate=!0,l||(this._target.copy(this._targetEnd),this._spherical.copy(this._sphericalEnd));var u=!l||ot(this._target.x,this._targetEnd.x,this.restThreshold)&&ot(this._target.y,this._targetEnd.y,this.restThreshold)&&ot(this._target.z,this._targetEnd.z,this.restThreshold)&&ot(this._spherical.theta,this._sphericalEnd.theta,this.restThreshold)&&ot(this._spherical.phi,this._sphericalEnd.phi,this.restThreshold)&&ot(this._spherical.radius,this._sphericalEnd.radius,this.restThreshold);return this._createOnRestPromise(u)},e.prototype.lerpLookAt=function(t,n,i,s,a,o,l,c,h,u,d,f,g,v){v===void 0&&(v=!1);var w=Ve.set(s,a,o),m=Qe.set(t,n,i);tn.setFromVector3(m.sub(w).applyQuaternion(this._yAxisUpSpace));var p=xi.set(u,d,f),b=Qe.set(l,c,h);ur.setFromVector3(b.sub(p).applyQuaternion(this._yAxisUpSpace)),this._targetEnd.copy(w.lerp(p,g));var M=ur.theta-tn.theta,E=ur.phi-tn.phi,D=ur.radius-tn.radius;this._sphericalEnd.set(tn.radius+D*g,tn.phi+E*g,tn.theta+M*g),this.normalizeRotations(),this._needsUpdate=!0,v||(this._target.copy(this._targetEnd),this._spherical.copy(this._sphericalEnd));var _=!v||ot(this._target.x,this._targetEnd.x,this.restThreshold)&&ot(this._target.y,this._targetEnd.y,this.restThreshold)&&ot(this._target.z,this._targetEnd.z,this.restThreshold)&&ot(this._spherical.theta,this._sphericalEnd.theta,this.restThreshold)&&ot(this._spherical.phi,this._sphericalEnd.phi,this.restThreshold)&&ot(this._spherical.radius,this._sphericalEnd.radius,this.restThreshold);return this._createOnRestPromise(_)},e.prototype.setPosition=function(t,n,i,s){return s===void 0&&(s=!1),this.setLookAt(t,n,i,this._targetEnd.x,this._targetEnd.y,this._targetEnd.z,s)},e.prototype.setTarget=function(t,n,i,s){s===void 0&&(s=!1);var a=this.getPosition(Ve);return this.setLookAt(a.x,a.y,a.z,t,n,i,s)},e.prototype.setFocalOffset=function(t,n,i,s){s===void 0&&(s=!1),this._focalOffsetEnd.set(t,n,i),this._needsUpdate=!0,s||this._focalOffset.copy(this._focalOffsetEnd);var a=!s||ot(this._focalOffset.x,this._focalOffsetEnd.x,this.restThreshold)&&ot(this._focalOffset.y,this._focalOffsetEnd.y,this.restThreshold)&&ot(this._focalOffset.z,this._focalOffsetEnd.z,this.restThreshold);return this._createOnRestPromise(a)},e.prototype.setOrbitPoint=function(t,n,i){dn.setFromMatrixColumn(this._camera.matrixWorldInverse,0),fn.setFromMatrixColumn(this._camera.matrixWorldInverse,1),ti.setFromMatrixColumn(this._camera.matrixWorldInverse,2);var s=Ve.set(t,n,i),a=s.distanceTo(this._camera.position),o=s.sub(this._camera.position);dn.multiplyScalar(o.x),fn.multiplyScalar(o.y),ti.multiplyScalar(o.z),Ve.copy(dn).add(fn).add(ti),Ve.z=Ve.z+a,this.dollyTo(a,!1),this.setFocalOffset(-Ve.x,Ve.y,-Ve.z,!1),this.moveTo(t,n,i,!1)},e.prototype.setBoundary=function(t){if(!t){this._boundary.min.set(-1/0,-1/0,-1/0),this._boundary.max.set(1/0,1/0,1/0),this._needsUpdate=!0;return}this._boundary.copy(t),this._boundary.clampPoint(this._targetEnd,this._targetEnd),this._needsUpdate=!0},e.prototype.setViewport=function(t,n,i,s){if(t===null){this._viewport=null;return}this._viewport=this._viewport||new we.Vector4,typeof t=="number"?this._viewport.set(t,n,i,s):this._viewport.copy(t)},e.prototype.getDistanceToFitBox=function(t,n,i){if(Ca(this._camera,"getDistanceToFitBox"))return this._spherical.radius;var s=t/n,a=this._camera.getEffectiveFOV()*we.MathUtils.DEG2RAD,o=this._camera.aspect,l=s<o?n:t/o;return l*.5/Math.tan(a*.5)+i*.5},e.prototype.getDistanceToFit=function(t,n,i){return console.warn("camera-controls: getDistanceToFit() has been renamed to getDistanceToFitBox()"),this.getDistanceToFitBox(t,n,i)},e.prototype.getDistanceToFitSphere=function(t){if(Ca(this._camera,"getDistanceToFitSphere"))return this._spherical.radius;var n=this._camera.getEffectiveFOV()*we.MathUtils.DEG2RAD,i=Math.atan(Math.tan(n*.5)*this._camera.aspect)*2,s=1<this._camera.aspect?n:i;return t/Math.sin(s*.5)},e.prototype.getTarget=function(t){var n=!!t&&t.isVector3?t:new we.Vector3;return n.copy(this._targetEnd)},e.prototype.getPosition=function(t){var n=!!t&&t.isVector3?t:new we.Vector3;return n.setFromSpherical(this._sphericalEnd).applyQuaternion(this._yAxisUpSpaceInverse).add(this._targetEnd)},e.prototype.getFocalOffset=function(t){var n=!!t&&t.isVector3?t:new we.Vector3;return n.copy(this._focalOffsetEnd)},e.prototype.normalizeRotations=function(){this._sphericalEnd.theta=this._sphericalEnd.theta%vi,this._sphericalEnd.theta<0&&(this._sphericalEnd.theta+=vi),this._spherical.theta+=vi*Math.round((this._sphericalEnd.theta-this._spherical.theta)/vi)},e.prototype.reset=function(t){t===void 0&&(t=!1);var n=[this.setLookAt(this._position0.x,this._position0.y,this._position0.z,this._target0.x,this._target0.y,this._target0.z,t),this.setFocalOffset(this._focalOffset0.x,this._focalOffset0.y,this._focalOffset0.z,t),this.zoomTo(this._zoom0,t)];return Promise.all(n)},e.prototype.saveState=function(){this._target0.copy(this._target),this._position0.copy(this._camera.position),this._zoom0=this._zoom},e.prototype.updateCameraUp=function(){this._yAxisUpSpace.setFromUnitVectors(this._camera.up,as),Tl(this._yAxisUpSpaceInverse.copy(this._yAxisUpSpace))},e.prototype.update=function(t){var n=this._state===Ee.NONE?this.dampingFactor:this.draggingDampingFactor,i=Math.min(n*t*60,1),s=this._sphericalEnd.theta-this._spherical.theta,a=this._sphericalEnd.phi-this._spherical.phi,o=this._sphericalEnd.radius-this._spherical.radius,l=Ve.subVectors(this._targetEnd,this._target),c=Qe.subVectors(this._focalOffsetEnd,this._focalOffset);if(!at(s)||!at(a)||!at(o)||!at(l.x)||!at(l.y)||!at(l.z)||!at(c.x)||!at(c.y)||!at(c.z)?(this._spherical.set(this._spherical.radius+o*i,this._spherical.phi+a*i,this._spherical.theta+s*i),this._target.add(l.multiplyScalar(i)),this._focalOffset.add(c.multiplyScalar(i)),this._needsUpdate=!0):(this._spherical.copy(this._sphericalEnd),this._target.copy(this._targetEnd),this._focalOffset.copy(this._focalOffsetEnd)),this._dollyControlAmount!==0){if(ei(this._camera)){var h=this._camera,u=Ve.setFromSpherical(this._sphericalEnd).applyQuaternion(this._yAxisUpSpaceInverse).normalize().negate(),d=Qe.copy(u).cross(h.up).normalize();d.lengthSq()===0&&(d.x=1);var f=xi.crossVectors(d,u),g=this._sphericalEnd.radius*Math.tan(h.getEffectiveFOV()*we.MathUtils.DEG2RAD*.5),v=this._sphericalEnd.radius-this._dollyControlAmount,w=(v-this._sphericalEnd.radius)/this._sphericalEnd.radius,m=Ve.copy(this._targetEnd).add(d.multiplyScalar(this._dollyControlCoord.x*g*h.aspect)).add(f.multiplyScalar(this._dollyControlCoord.y*g));this._targetEnd.lerp(m,w),this._target.copy(this._targetEnd)}else if(Fn(this._camera)){var h=this._camera,p=Ve.set(this._dollyControlCoord.x,this._dollyControlCoord.y,(h.near+h.far)/(h.near-h.far)).unproject(h),b=Qe.set(0,0,-1).applyQuaternion(h.quaternion),M=b.dot(h.up),E=at(M)?-p.dot(h.up):-p.dot(h.up)/M,m=xi.copy(p).add(b.multiplyScalar(E));this._targetEnd.lerp(m,1-h.zoom/this._dollyControlAmount),this._target.copy(this._targetEnd)}this._dollyControlAmount=0}var D=this._collisionTest();this._spherical.radius=Math.min(this._spherical.radius,D),this._spherical.makeSafe(),this._camera.position.setFromSpherical(this._spherical).applyQuaternion(this._yAxisUpSpaceInverse).add(this._target),this._camera.lookAt(this._target);var _=!at(this._focalOffset.x)||!at(this._focalOffset.y)||!at(this._focalOffset.z);_&&(this._camera.updateMatrix(),dn.setFromMatrixColumn(this._camera.matrix,0),fn.setFromMatrixColumn(this._camera.matrix,1),ti.setFromMatrixColumn(this._camera.matrix,2),dn.multiplyScalar(this._focalOffset.x),fn.multiplyScalar(-this._focalOffset.y),ti.multiplyScalar(this._focalOffset.z),Ve.copy(dn).add(fn).add(ti),this._camera.position.add(Ve)),this._boundaryEnclosesCamera&&this._encloseToBoundary(this._camera.position.copy(this._target),Ve.setFromSpherical(this._spherical).applyQuaternion(this._yAxisUpSpaceInverse),1);var R=this._zoomEnd-this._zoom;this._zoom+=R*i,this._camera.zoom!==this._zoom&&(at(R)&&(this._zoom=this._zoomEnd),this._camera.zoom=this._zoom,this._camera.updateProjectionMatrix(),this._updateNearPlaneCorners(),this._needsUpdate=!0);var F=this._needsUpdate;return F&&!this._updatedLastTime?(this._hasRested=!1,this.dispatchEvent({type:"wake"}),this.dispatchEvent({type:"update"})):F?(this.dispatchEvent({type:"update"}),at(s,this.restThreshold)&&at(a,this.restThreshold)&&at(o,this.restThreshold)&&at(l.x,this.restThreshold)&&at(l.y,this.restThreshold)&&at(l.z,this.restThreshold)&&at(c.x,this.restThreshold)&&at(c.y,this.restThreshold)&&at(c.z,this.restThreshold)&&!this._hasRested&&(this._hasRested=!0,this.dispatchEvent({type:"rest"}))):!F&&this._updatedLastTime&&this.dispatchEvent({type:"sleep"}),this._updatedLastTime=F,this._needsUpdate=!1,F},e.prototype.toJSON=function(){return JSON.stringify({enabled:this._enabled,minDistance:this.minDistance,maxDistance:cr(this.maxDistance),minZoom:this.minZoom,maxZoom:cr(this.maxZoom),minPolarAngle:this.minPolarAngle,maxPolarAngle:cr(this.maxPolarAngle),minAzimuthAngle:cr(this.minAzimuthAngle),maxAzimuthAngle:cr(this.maxAzimuthAngle),dampingFactor:this.dampingFactor,draggingDampingFactor:this.draggingDampingFactor,dollySpeed:this.dollySpeed,truckSpeed:this.truckSpeed,dollyToCursor:this.dollyToCursor,verticalDragToForward:this.verticalDragToForward,target:this._targetEnd.toArray(),position:Ve.setFromSpherical(this._sphericalEnd).add(this._targetEnd).toArray(),zoom:this._zoomEnd,focalOffset:this._focalOffsetEnd.toArray(),target0:this._target0.toArray(),position0:this._position0.toArray(),zoom0:this._zoom0,focalOffset0:this._focalOffset0.toArray()})},e.prototype.fromJSON=function(t,n){n===void 0&&(n=!1);var i=JSON.parse(t),s=Ve.fromArray(i.position);this.enabled=i.enabled,this.minDistance=i.minDistance,this.maxDistance=hr(i.maxDistance),this.minZoom=i.minZoom,this.maxZoom=hr(i.maxZoom),this.minPolarAngle=i.minPolarAngle,this.maxPolarAngle=hr(i.maxPolarAngle),this.minAzimuthAngle=hr(i.minAzimuthAngle),this.maxAzimuthAngle=hr(i.maxAzimuthAngle),this.dampingFactor=i.dampingFactor,this.draggingDampingFactor=i.draggingDampingFactor,this.dollySpeed=i.dollySpeed,this.truckSpeed=i.truckSpeed,this.dollyToCursor=i.dollyToCursor,this.verticalDragToForward=i.verticalDragToForward,this._target0.fromArray(i.target0),this._position0.fromArray(i.position0),this._zoom0=i.zoom0,this._focalOffset0.fromArray(i.focalOffset0),this.moveTo(i.target[0],i.target[1],i.target[2],n),tn.setFromVector3(s.sub(this._targetEnd).applyQuaternion(this._yAxisUpSpace)),this.rotateTo(tn.theta,tn.phi,n),this.zoomTo(i.zoom,n),this.setFocalOffset(i.focalOffset[0],i.focalOffset[1],i.focalOffset[2],n),this._needsUpdate=!0},e.prototype.dispose=function(){this._removeAllEventListeners()},e.prototype._findPointerById=function(t){var n=null;return this._activePointers.some(function(i){return i.pointerId===t?(n=i,!0):!1}),n},e.prototype._encloseToBoundary=function(t,n,i){var s=n.lengthSq();if(s===0)return t;var a=Qe.copy(n).add(t),o=this._boundary.clampPoint(a,xi),l=o.sub(a),c=l.lengthSq();if(c===0)return t.add(n);if(c===s)return t;if(i===0)return t.add(n).add(l);var h=1+i*c/n.dot(l);return t.add(Qe.copy(n).multiplyScalar(h)).add(l.multiplyScalar(1-i))},e.prototype._updateNearPlaneCorners=function(){if(ei(this._camera)){var t=this._camera,n=t.near,i=t.getEffectiveFOV()*we.MathUtils.DEG2RAD,s=Math.tan(i*.5)*n,a=s*t.aspect;this._nearPlaneCorners[0].set(-a,-s,0),this._nearPlaneCorners[1].set(a,-s,0),this._nearPlaneCorners[2].set(a,s,0),this._nearPlaneCorners[3].set(-a,s,0)}else if(Fn(this._camera)){var t=this._camera,o=1/t.zoom,l=t.left*o,c=t.right*o,h=t.top*o,u=t.bottom*o;this._nearPlaneCorners[0].set(l,h,0),this._nearPlaneCorners[1].set(c,h,0),this._nearPlaneCorners[2].set(c,u,0),this._nearPlaneCorners[3].set(l,u,0)}},e.prototype._collisionTest=function(){var t=1/0,n=this.colliderMeshes.length>=1;if(!n||Ca(this._camera,"_collisionTest"))return t;var i=Ve.setFromSpherical(this._spherical).divideScalar(this._spherical.radius);Pa.lookAt(Cl,i,this._camera.up);for(var s=0;s<4;s++){var a=Qe.copy(this._nearPlaneCorners[s]);a.applyMatrix4(Pa);var o=xi.addVectors(this._target,a);os.set(o,i),os.far=this._spherical.radius+1;var l=os.intersectObjects(this.colliderMeshes);l.length!==0&&l[0].distance<t&&(t=l[0].distance)}return t},e.prototype._getClientRect=function(t){var n=this._domElement.getBoundingClientRect();return t.x=n.left,t.y=n.top,this._viewport?(t.x+=this._viewport.x,t.y+=n.height-this._viewport.w-this._viewport.y,t.z=this._viewport.z,t.w=this._viewport.w):(t.z=n.width,t.w=n.height),t},e.prototype._createOnRestPromise=function(t){var n=this;return t?Promise.resolve():(this._hasRested=!1,this.dispatchEvent({type:"transitionstart"}),new Promise(function(i){var s=function(){n.removeEventListener("rest",s),i()};n.addEventListener("rest",s)}))},e.prototype._removeAllEventListeners=function(){},e}(Zu);function $u(r,e){var t=e,n=t.center;r.traverse(function(s){!s.isMesh||dr.expandByObject(s)}),dr.getCenter(n);var i=0;return r.traverse(function(s){if(!!s.isMesh){var a=s,o=a.geometry.clone();if(o.applyMatrix4(a.matrixWorld),o.isBufferGeometry)for(var l=o,c=l.attributes.position,h=0,u=c.count;h<u;h++)Ve.fromBufferAttribute(c,h),i=Math.max(i,n.distanceToSquared(Ve));else for(var c=o.attributes.position,d=new we.Vector3,h=0,u=c.count;h<u;h++)d.fromBufferAttribute(c,h),i=Math.max(i,n.distanceToSquared(d))}}),t.radius=Math.sqrt(i),t}var Qu=typeof globalThis!="undefined"?globalThis:typeof window!="undefined"?window:typeof global!="undefined"?global:typeof self!="undefined"?self:{},Dl={exports:{}};/*! Hammer.JS - v2.0.7 - 2016-04-22
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2016 Jorik Tangelder;
 * Licensed under the MIT license */(function(r){(function(e,t,n,i){var s=["","webkit","Moz","MS","ms","o"],a=t.createElement("div"),o="function",l=Math.round,c=Math.abs,h=Date.now;function u(x,y,L){return setTimeout(b(x,L),y)}function d(x,y,L){return Array.isArray(x)?(f(x,L[y],L),!0):!1}function f(x,y,L){var B;if(!!x)if(x.forEach)x.forEach(y,L);else if(x.length!==i)for(B=0;B<x.length;)y.call(L,x[B],B,x),B++;else for(B in x)x.hasOwnProperty(B)&&y.call(L,x[B],B,x)}function g(x,y,L){var B="DEPRECATED METHOD: "+y+`
`+L+` AT 
`;return function(){var K=new Error("get-stack-trace"),pe=K&&K.stack?K.stack.replace(/^[^\(]+?[\n$]/gm,"").replace(/^\s+at\s+/gm,"").replace(/^Object.<anonymous>\s*\(/gm,"{anonymous}()@"):"Unknown Stack Trace",ze=e.console&&(e.console.warn||e.console.log);return ze&&ze.call(e.console,B,pe),x.apply(this,arguments)}}var v;typeof Object.assign!="function"?v=function(y){if(y===i||y===null)throw new TypeError("Cannot convert undefined or null to object");for(var L=Object(y),B=1;B<arguments.length;B++){var K=arguments[B];if(K!==i&&K!==null)for(var pe in K)K.hasOwnProperty(pe)&&(L[pe]=K[pe])}return L}:v=Object.assign;var w=g(function(y,L,B){for(var K=Object.keys(L),pe=0;pe<K.length;)(!B||B&&y[K[pe]]===i)&&(y[K[pe]]=L[K[pe]]),pe++;return y},"extend","Use `assign`."),m=g(function(y,L){return w(y,L,!0)},"merge","Use `assign`.");function p(x,y,L){var B=y.prototype,K;K=x.prototype=Object.create(B),K.constructor=x,K._super=B,L&&v(K,L)}function b(x,y){return function(){return x.apply(y,arguments)}}function M(x,y){return typeof x==o?x.apply(y&&y[0]||i,y):x}function E(x,y){return x===i?y:x}function D(x,y,L){f(z(y),function(B){x.addEventListener(B,L,!1)})}function _(x,y,L){f(z(y),function(B){x.removeEventListener(B,L,!1)})}function R(x,y){for(;x;){if(x==y)return!0;x=x.parentNode}return!1}function F(x,y){return x.indexOf(y)>-1}function z(x){return x.trim().split(/\s+/g)}function P(x,y,L){if(x.indexOf&&!L)return x.indexOf(y);for(var B=0;B<x.length;){if(L&&x[B][L]==y||!L&&x[B]===y)return B;B++}return-1}function ne(x){return Array.prototype.slice.call(x,0)}function U(x,y,L){for(var B=[],K=[],pe=0;pe<x.length;){var ze=y?x[pe][y]:x[pe];P(K,ze)<0&&B.push(x[pe]),K[pe]=ze,pe++}return L&&(y?B=B.sort(function(bt,Nt){return bt[y]>Nt[y]}):B=B.sort()),B}function N(x,y){for(var L,B,K=y[0].toUpperCase()+y.slice(1),pe=0;pe<s.length;){if(L=s[pe],B=L?L+K:y,B in x)return B;pe++}return i}var H=1;function V(){return H++}function W(x){var y=x.ownerDocument||x;return y.defaultView||y.parentWindow||e}var ae=/mobile|tablet|ip(ad|hone|od)|android/i,me="ontouchstart"in e,q=N(e,"PointerEvent")!==i,Y=me&&ae.test(navigator.userAgent),de="touch",ue="pen",xe="mouse",Xe="kinect",Q=25,Se=1,Te=2,oe=4,ge=8,Ue=1,X=2,te=4,ie=8,fe=16,re=X|te,Ce=ie|fe,Pe=re|Ce,Be=["x","y"],Je=["clientX","clientY"];function A(x,y){var L=this;this.manager=x,this.callback=y,this.element=x.element,this.target=x.options.inputTarget,this.domHandler=function(B){M(x.options.enable,[x])&&L.handler(B)},this.init()}A.prototype={handler:function(){},init:function(){this.evEl&&D(this.element,this.evEl,this.domHandler),this.evTarget&&D(this.target,this.evTarget,this.domHandler),this.evWin&&D(W(this.element),this.evWin,this.domHandler)},destroy:function(){this.evEl&&_(this.element,this.evEl,this.domHandler),this.evTarget&&_(this.target,this.evTarget,this.domHandler),this.evWin&&_(W(this.element),this.evWin,this.domHandler)}};function T(x){var y,L=x.options.inputClass;return L?y=L:q?y=pi:Y?y=gi:me?y=G:y=At,new y(x,J)}function J(x,y,L){var B=L.pointers.length,K=L.changedPointers.length,pe=y&Se&&B-K==0,ze=y&(oe|ge)&&B-K==0;L.isFirst=!!pe,L.isFinal=!!ze,pe&&(x.session={}),L.eventType=y,j(x,L),x.emit("hammer.input",L),x.recognize(L),x.session.prevInput=L}function j(x,y){var L=x.session,B=y.pointers,K=B.length;L.firstInput||(L.firstInput=I(y)),K>1&&!L.firstMultiple?L.firstMultiple=I(y):K===1&&(L.firstMultiple=!1);var pe=L.firstInput,ze=L.firstMultiple,xt=ze?ze.center:pe.center,bt=y.center=le(B);y.timeStamp=h(),y.deltaTime=y.timeStamp-pe.timeStamp,y.angle=ve(xt,bt),y.distance=se(xt,bt),ye(L,y),y.offsetDirection=ce(y.deltaX,y.deltaY);var Nt=$(y.deltaTime,y.deltaX,y.deltaY);y.overallVelocityX=Nt.x,y.overallVelocityY=Nt.y,y.overallVelocity=c(Nt.x)>c(Nt.y)?Nt.x:Nt.y,y.scale=ze?Ie(ze.pointers,B):1,y.rotation=ze?Me(ze.pointers,B):0,y.maxPointers=L.prevInput?y.pointers.length>L.prevInput.maxPointers?y.pointers.length:L.prevInput.maxPointers:y.pointers.length,_e(L,y);var un=x.element;R(y.srcEvent.target,un)&&(un=y.srcEvent.target),y.target=un}function ye(x,y){var L=y.center,B=x.offsetDelta||{},K=x.prevDelta||{},pe=x.prevInput||{};(y.eventType===Se||pe.eventType===oe)&&(K=x.prevDelta={x:pe.deltaX||0,y:pe.deltaY||0},B=x.offsetDelta={x:L.x,y:L.y}),y.deltaX=K.x+(L.x-B.x),y.deltaY=K.y+(L.y-B.y)}function _e(x,y){var L=x.lastInterval||y,B=y.timeStamp-L.timeStamp,K,pe,ze,xt;if(y.eventType!=ge&&(B>Q||L.velocity===i)){var bt=y.deltaX-L.deltaX,Nt=y.deltaY-L.deltaY,un=$(B,bt,Nt);pe=un.x,ze=un.y,K=c(un.x)>c(un.y)?un.x:un.y,xt=ce(bt,Nt),x.lastInterval=y}else K=L.velocity,pe=L.velocityX,ze=L.velocityY,xt=L.direction;y.velocity=K,y.velocityX=pe,y.velocityY=ze,y.direction=xt}function I(x){for(var y=[],L=0;L<x.pointers.length;)y[L]={clientX:l(x.pointers[L].clientX),clientY:l(x.pointers[L].clientY)},L++;return{timeStamp:h(),pointers:y,center:le(y),deltaX:x.deltaX,deltaY:x.deltaY}}function le(x){var y=x.length;if(y===1)return{x:l(x[0].clientX),y:l(x[0].clientY)};for(var L=0,B=0,K=0;K<y;)L+=x[K].clientX,B+=x[K].clientY,K++;return{x:l(L/y),y:l(B/y)}}function $(x,y,L){return{x:y/x||0,y:L/x||0}}function ce(x,y){return x===y?Ue:c(x)>=c(y)?x<0?X:te:y<0?ie:fe}function se(x,y,L){L||(L=Be);var B=y[L[0]]-x[L[0]],K=y[L[1]]-x[L[1]];return Math.sqrt(B*B+K*K)}function ve(x,y,L){L||(L=Be);var B=y[L[0]]-x[L[0]],K=y[L[1]]-x[L[1]];return Math.atan2(K,B)*180/Math.PI}function Me(x,y){return ve(y[1],y[0],Je)+ve(x[1],x[0],Je)}function Ie(x,y){return se(y[0],y[1],Je)/se(x[0],x[1],Je)}var ht={mousedown:Se,mousemove:Te,mouseup:oe},qe="mousedown",Wt="mousemove mouseup";function At(){this.evEl=qe,this.evWin=Wt,this.pressed=!1,A.apply(this,arguments)}p(At,A,{handler:function(y){var L=ht[y.type];L&Se&&y.button===0&&(this.pressed=!0),L&Te&&y.which!==1&&(L=oe),!!this.pressed&&(L&oe&&(this.pressed=!1),this.callback(this.manager,L,{pointers:[y],changedPointers:[y],pointerType:xe,srcEvent:y}))}});var pa={pointerdown:Se,pointermove:Te,pointerup:oe,pointercancel:ge,pointerout:ge},$r={2:de,3:ue,4:xe,5:Xe},or="pointerdown",cn="pointermove pointerup pointercancel";e.MSPointerEvent&&!e.PointerEvent&&(or="MSPointerDown",cn="MSPointerMove MSPointerUp MSPointerCancel");function pi(){this.evEl=or,this.evWin=cn,A.apply(this,arguments),this.store=this.manager.session.pointerEvents=[]}p(pi,A,{handler:function(y){var L=this.store,B=!1,K=y.type.toLowerCase().replace("ms",""),pe=pa[K],ze=$r[y.pointerType]||y.pointerType,xt=ze==de,bt=P(L,y.pointerId,"pointerId");pe&Se&&(y.button===0||xt)?bt<0&&(L.push(y),bt=L.length-1):pe&(oe|ge)&&(B=!0),!(bt<0)&&(L[bt]=y,this.callback(this.manager,pe,{pointers:L,changedPointers:[y],pointerType:ze,srcEvent:y}),B&&L.splice(bt,1))}});var Qr={touchstart:Se,touchmove:Te,touchend:oe,touchcancel:ge},ma="touchstart",mi="touchstart touchmove touchend touchcancel";function Kr(){this.evTarget=ma,this.evWin=mi,this.started=!1,A.apply(this,arguments)}p(Kr,A,{handler:function(y){var L=Qr[y.type];if(L===Se&&(this.started=!0),!!this.started){var B=lr.call(this,y,L);L&(oe|ge)&&B[0].length-B[1].length==0&&(this.started=!1),this.callback(this.manager,L,{pointers:B[0],changedPointers:B[1],pointerType:de,srcEvent:y})}}});function lr(x,y){var L=ne(x.touches),B=ne(x.changedTouches);return y&(oe|ge)&&(L=U(L.concat(B),"identifier",!0)),[L,B]}var es={touchstart:Se,touchmove:Te,touchend:oe,touchcancel:ge},ga="touchstart touchmove touchend touchcancel";function gi(){this.evTarget=ga,this.targetIds={},A.apply(this,arguments)}p(gi,A,{handler:function(y){var L=es[y.type],B=va.call(this,y,L);!B||this.callback(this.manager,L,{pointers:B[0],changedPointers:B[1],pointerType:de,srcEvent:y})}});function va(x,y){var L=ne(x.touches),B=this.targetIds;if(y&(Se|Te)&&L.length===1)return B[L[0].identifier]=!0,[L,L];var K,pe,ze=ne(x.changedTouches),xt=[],bt=this.target;if(pe=L.filter(function(Nt){return R(Nt.target,bt)}),y===Se)for(K=0;K<pe.length;)B[pe[K].identifier]=!0,K++;for(K=0;K<ze.length;)B[ze[K].identifier]&&xt.push(ze[K]),y&(oe|ge)&&delete B[ze[K].identifier],K++;if(!!xt.length)return[U(pe.concat(xt),"identifier",!0),xt]}var S=2500,O=25;function G(){A.apply(this,arguments);var x=b(this.handler,this);this.touch=new gi(this.manager,x),this.mouse=new At(this.manager,x),this.primaryTouch=null,this.lastTouches=[]}p(G,A,{handler:function(y,L,B){var K=B.pointerType==de,pe=B.pointerType==xe;if(!(pe&&B.sourceCapabilities&&B.sourceCapabilities.firesTouchEvents)){if(K)k.call(this,L,B);else if(pe&&De.call(this,B))return;this.callback(y,L,B)}},destroy:function(){this.touch.destroy(),this.mouse.destroy()}});function k(x,y){x&Se?(this.primaryTouch=y.changedPointers[0].identifier,Z.call(this,y)):x&(oe|ge)&&Z.call(this,y)}function Z(x){var y=x.changedPointers[0];if(y.identifier===this.primaryTouch){var L={x:y.clientX,y:y.clientY};this.lastTouches.push(L);var B=this.lastTouches,K=function(){var pe=B.indexOf(L);pe>-1&&B.splice(pe,1)};setTimeout(K,S)}}function De(x){for(var y=x.srcEvent.clientX,L=x.srcEvent.clientY,B=0;B<this.lastTouches.length;B++){var K=this.lastTouches[B],pe=Math.abs(y-K.x),ze=Math.abs(L-K.y);if(pe<=O&&ze<=O)return!0}return!1}var Ae=N(a.style,"touchAction"),Oe=Ae!==i,Re="compute",He="auto",Fe="manipulation",Ne="none",et="pan-x",Xt="pan-y",Ge=wn();function Mn(x,y){this.manager=x,this.set(y)}Mn.prototype={set:function(x){x==Re&&(x=this.compute()),Oe&&this.manager.element.style&&Ge[x]&&(this.manager.element.style[Ae]=x),this.actions=x.toLowerCase().trim()},update:function(){this.set(this.manager.options.touchAction)},compute:function(){var x=[];return f(this.manager.recognizers,function(y){M(y.options.enable,[y])&&(x=x.concat(y.getTouchAction()))}),nt(x.join(" "))},preventDefaults:function(x){var y=x.srcEvent,L=x.offsetDirection;if(this.manager.session.prevented){y.preventDefault();return}var B=this.actions,K=F(B,Ne)&&!Ge[Ne],pe=F(B,Xt)&&!Ge[Xt],ze=F(B,et)&&!Ge[et];if(K){var xt=x.pointers.length===1,bt=x.distance<2,Nt=x.deltaTime<250;if(xt&&bt&&Nt)return}if(!(ze&&pe)&&(K||pe&&L&re||ze&&L&Ce))return this.preventSrc(y)},preventSrc:function(x){this.manager.session.prevented=!0,x.preventDefault()}};function nt(x){if(F(x,Ne))return Ne;var y=F(x,et),L=F(x,Xt);return y&&L?Ne:y||L?y?et:Xt:F(x,Fe)?Fe:He}function wn(){if(!Oe)return!1;var x={},y=e.CSS&&e.CSS.supports;return["auto","manipulation","pan-y","pan-x","pan-x pan-y","none"].forEach(function(L){x[L]=y?e.CSS.supports("touch-action",L):!0}),x}var Jt=1,gt=2,It=4,Ze=8,Ft=Ze,wt=16,hn=32;function bn(x){this.options=v({},this.defaults,x||{}),this.id=V(),this.manager=null,this.options.enable=E(this.options.enable,!0),this.state=Jt,this.simultaneous={},this.requireFail=[]}bn.prototype={defaults:{},set:function(x){return v(this.options,x),this.manager&&this.manager.touchAction.update(),this},recognizeWith:function(x){if(d(x,"recognizeWith",this))return this;var y=this.simultaneous;return x=ts(x,this),y[x.id]||(y[x.id]=x,x.recognizeWith(this)),this},dropRecognizeWith:function(x){return d(x,"dropRecognizeWith",this)?this:(x=ts(x,this),delete this.simultaneous[x.id],this)},requireFailure:function(x){if(d(x,"requireFailure",this))return this;var y=this.requireFail;return x=ts(x,this),P(y,x)===-1&&(y.push(x),x.requireFailure(this)),this},dropRequireFailure:function(x){if(d(x,"dropRequireFailure",this))return this;x=ts(x,this);var y=P(this.requireFail,x);return y>-1&&this.requireFail.splice(y,1),this},hasRequireFailures:function(){return this.requireFail.length>0},canRecognizeWith:function(x){return!!this.simultaneous[x.id]},emit:function(x){var y=this,L=this.state;function B(K){y.manager.emit(K,x)}L<Ze&&B(y.options.event+vl(L)),B(y.options.event),x.additionalEvent&&B(x.additionalEvent),L>=Ze&&B(y.options.event+vl(L))},tryEmit:function(x){if(this.canEmit())return this.emit(x);this.state=hn},canEmit:function(){for(var x=0;x<this.requireFail.length;){if(!(this.requireFail[x].state&(hn|Jt)))return!1;x++}return!0},recognize:function(x){var y=v({},x);if(!M(this.options.enable,[this,y])){this.reset(),this.state=hn;return}this.state&(Ft|wt|hn)&&(this.state=Jt),this.state=this.process(y),this.state&(gt|It|Ze|wt)&&this.tryEmit(y)},process:function(x){},getTouchAction:function(){},reset:function(){}};function vl(x){return x&wt?"cancel":x&Ze?"end":x&It?"move":x&gt?"start":""}function xl(x){return x==fe?"down":x==ie?"up":x==X?"left":x==te?"right":""}function ts(x,y){var L=y.manager;return L?L.get(x):x}function Kt(){bn.apply(this,arguments)}p(Kt,bn,{defaults:{pointers:1},attrTest:function(x){var y=this.options.pointers;return y===0||x.pointers.length===y},process:function(x){var y=this.state,L=x.eventType,B=y&(gt|It),K=this.attrTest(x);return B&&(L&ge||!K)?y|wt:B||K?L&oe?y|Ze:y&gt?y|It:gt:hn}});function ns(){Kt.apply(this,arguments),this.pX=null,this.pY=null}p(ns,Kt,{defaults:{event:"pan",threshold:10,pointers:1,direction:Pe},getTouchAction:function(){var x=this.options.direction,y=[];return x&re&&y.push(Xt),x&Ce&&y.push(et),y},directionTest:function(x){var y=this.options,L=!0,B=x.distance,K=x.direction,pe=x.deltaX,ze=x.deltaY;return K&y.direction||(y.direction&re?(K=pe===0?Ue:pe<0?X:te,L=pe!=this.pX,B=Math.abs(x.deltaX)):(K=ze===0?Ue:ze<0?ie:fe,L=ze!=this.pY,B=Math.abs(x.deltaY))),x.direction=K,L&&B>y.threshold&&K&y.direction},attrTest:function(x){return Kt.prototype.attrTest.call(this,x)&&(this.state&gt||!(this.state&gt)&&this.directionTest(x))},emit:function(x){this.pX=x.deltaX,this.pY=x.deltaY;var y=xl(x.direction);y&&(x.additionalEvent=this.options.event+y),this._super.emit.call(this,x)}});function xa(){Kt.apply(this,arguments)}p(xa,Kt,{defaults:{event:"pinch",threshold:0,pointers:2},getTouchAction:function(){return[Ne]},attrTest:function(x){return this._super.attrTest.call(this,x)&&(Math.abs(x.scale-1)>this.options.threshold||this.state&gt)},emit:function(x){if(x.scale!==1){var y=x.scale<1?"in":"out";x.additionalEvent=this.options.event+y}this._super.emit.call(this,x)}});function _a(){bn.apply(this,arguments),this._timer=null,this._input=null}p(_a,bn,{defaults:{event:"press",pointers:1,time:251,threshold:9},getTouchAction:function(){return[He]},process:function(x){var y=this.options,L=x.pointers.length===y.pointers,B=x.distance<y.threshold,K=x.deltaTime>y.time;if(this._input=x,!B||!L||x.eventType&(oe|ge)&&!K)this.reset();else if(x.eventType&Se)this.reset(),this._timer=u(function(){this.state=Ft,this.tryEmit()},y.time,this);else if(x.eventType&oe)return Ft;return hn},reset:function(){clearTimeout(this._timer)},emit:function(x){this.state===Ft&&(x&&x.eventType&oe?this.manager.emit(this.options.event+"up",x):(this._input.timeStamp=h(),this.manager.emit(this.options.event,this._input)))}});function ya(){Kt.apply(this,arguments)}p(ya,Kt,{defaults:{event:"rotate",threshold:0,pointers:2},getTouchAction:function(){return[Ne]},attrTest:function(x){return this._super.attrTest.call(this,x)&&(Math.abs(x.rotation)>this.options.threshold||this.state&gt)}});function Ma(){Kt.apply(this,arguments)}p(Ma,Kt,{defaults:{event:"swipe",threshold:10,velocity:.3,direction:re|Ce,pointers:1},getTouchAction:function(){return ns.prototype.getTouchAction.call(this)},attrTest:function(x){var y=this.options.direction,L;return y&(re|Ce)?L=x.overallVelocity:y&re?L=x.overallVelocityX:y&Ce&&(L=x.overallVelocityY),this._super.attrTest.call(this,x)&&y&x.offsetDirection&&x.distance>this.options.threshold&&x.maxPointers==this.options.pointers&&c(L)>this.options.velocity&&x.eventType&oe},emit:function(x){var y=xl(x.offsetDirection);y&&this.manager.emit(this.options.event+y,x),this.manager.emit(this.options.event,x)}});function is(){bn.apply(this,arguments),this.pTime=!1,this.pCenter=!1,this._timer=null,this._input=null,this.count=0}p(is,bn,{defaults:{event:"tap",pointers:1,taps:1,interval:300,time:250,threshold:9,posThreshold:10},getTouchAction:function(){return[Fe]},process:function(x){var y=this.options,L=x.pointers.length===y.pointers,B=x.distance<y.threshold,K=x.deltaTime<y.time;if(this.reset(),x.eventType&Se&&this.count===0)return this.failTimeout();if(B&&K&&L){if(x.eventType!=oe)return this.failTimeout();var pe=this.pTime?x.timeStamp-this.pTime<y.interval:!0,ze=!this.pCenter||se(this.pCenter,x.center)<y.posThreshold;this.pTime=x.timeStamp,this.pCenter=x.center,!ze||!pe?this.count=1:this.count+=1,this._input=x;var xt=this.count%y.taps;if(xt===0)return this.hasRequireFailures()?(this._timer=u(function(){this.state=Ft,this.tryEmit()},y.interval,this),gt):Ft}return hn},failTimeout:function(){return this._timer=u(function(){this.state=hn},this.options.interval,this),hn},reset:function(){clearTimeout(this._timer)},emit:function(){this.state==Ft&&(this._input.tapCount=this.count,this.manager.emit(this.options.event,this._input))}});function Sn(x,y){return y=y||{},y.recognizers=E(y.recognizers,Sn.defaults.preset),new wa(x,y)}Sn.VERSION="2.0.7",Sn.defaults={domEvents:!1,touchAction:Re,enable:!0,inputTarget:null,inputClass:null,preset:[[ya,{enable:!1}],[xa,{enable:!1},["rotate"]],[Ma,{direction:re}],[ns,{direction:re},["swipe"]],[is],[is,{event:"doubletap",taps:2},["tap"]],[_a]],cssProps:{userSelect:"none",touchSelect:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}};var Ou=1,_l=2;function wa(x,y){this.options=v({},Sn.defaults,y||{}),this.options.inputTarget=this.options.inputTarget||x,this.handlers={},this.session={},this.recognizers=[],this.oldCssProps={},this.element=x,this.input=T(this),this.touchAction=new Mn(this,this.options.touchAction),yl(this,!0),f(this.options.recognizers,function(L){var B=this.add(new L[0](L[1]));L[2]&&B.recognizeWith(L[2]),L[3]&&B.requireFailure(L[3])},this)}wa.prototype={set:function(x){return v(this.options,x),x.touchAction&&this.touchAction.update(),x.inputTarget&&(this.input.destroy(),this.input.target=x.inputTarget,this.input.init()),this},stop:function(x){this.session.stopped=x?_l:Ou},recognize:function(x){var y=this.session;if(!y.stopped){this.touchAction.preventDefaults(x);var L,B=this.recognizers,K=y.curRecognizer;(!K||K&&K.state&Ft)&&(K=y.curRecognizer=null);for(var pe=0;pe<B.length;)L=B[pe],y.stopped!==_l&&(!K||L==K||L.canRecognizeWith(K))?L.recognize(x):L.reset(),!K&&L.state&(gt|It|Ze)&&(K=y.curRecognizer=L),pe++}},get:function(x){if(x instanceof bn)return x;for(var y=this.recognizers,L=0;L<y.length;L++)if(y[L].options.event==x)return y[L];return null},add:function(x){if(d(x,"add",this))return this;var y=this.get(x.options.event);return y&&this.remove(y),this.recognizers.push(x),x.manager=this,this.touchAction.update(),x},remove:function(x){if(d(x,"remove",this))return this;if(x=this.get(x),x){var y=this.recognizers,L=P(y,x);L!==-1&&(y.splice(L,1),this.touchAction.update())}return this},on:function(x,y){if(x!==i&&y!==i){var L=this.handlers;return f(z(x),function(B){L[B]=L[B]||[],L[B].push(y)}),this}},off:function(x,y){if(x!==i){var L=this.handlers;return f(z(x),function(B){y?L[B]&&L[B].splice(P(L[B],y),1):delete L[B]}),this}},emit:function(x,y){this.options.domEvents&&Bu(x,y);var L=this.handlers[x]&&this.handlers[x].slice();if(!(!L||!L.length)){y.type=x,y.preventDefault=function(){y.srcEvent.preventDefault()};for(var B=0;B<L.length;)L[B](y),B++}},destroy:function(){this.element&&yl(this,!1),this.handlers={},this.session={},this.input.destroy(),this.element=null}};function yl(x,y){var L=x.element;if(!!L.style){var B;f(x.options.cssProps,function(K,pe){B=N(L.style,pe),y?(x.oldCssProps[B]=L.style[B],L.style[B]=K):L.style[B]=x.oldCssProps[B]||""}),y||(x.oldCssProps={})}}function Bu(x,y){var L=t.createEvent("Event");L.initEvent(x,!0,!0),L.gesture=y,y.target.dispatchEvent(L)}v(Sn,{INPUT_START:Se,INPUT_MOVE:Te,INPUT_END:oe,INPUT_CANCEL:ge,STATE_POSSIBLE:Jt,STATE_BEGAN:gt,STATE_CHANGED:It,STATE_ENDED:Ze,STATE_RECOGNIZED:Ft,STATE_CANCELLED:wt,STATE_FAILED:hn,DIRECTION_NONE:Ue,DIRECTION_LEFT:X,DIRECTION_RIGHT:te,DIRECTION_UP:ie,DIRECTION_DOWN:fe,DIRECTION_HORIZONTAL:re,DIRECTION_VERTICAL:Ce,DIRECTION_ALL:Pe,Manager:wa,Input:A,TouchAction:Mn,TouchInput:gi,MouseInput:At,PointerEventInput:pi,TouchMouseInput:G,SingleTouchInput:Kr,Recognizer:bn,AttrRecognizer:Kt,Tap:is,Pan:ns,Swipe:Ma,Pinch:xa,Rotate:ya,Press:_a,on:D,off:_,each:f,merge:m,extend:w,assign:v,inherit:p,bindFn:b,prefixed:N});var Uu=typeof e!="undefined"?e:typeof self!="undefined"?self:{};Uu.Hammer=Sn,typeof i=="function"&&i.amd?i(function(){return Sn}):r.exports?r.exports=Sn:e[n]=Sn})(window,document,"Hammer")})(Dl);var dM=Dl.exports;/**
 * @license
 * Copyright 2010-2021 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Da="135",fM={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},Ku=0,Il=1,ed=2,Fl=1,td=2,fr=3,_i=0,lt=1,pn=2,Nl=1,mn=0,pr=1,Ol=2,Bl=3,Ul=4,nd=5,yi=100,id=101,rd=102,zl=103,Vl=104,sd=200,ad=201,od=202,ld=203,kl=204,Hl=205,cd=206,hd=207,ud=208,dd=209,fd=210,pd=0,md=1,gd=2,Ia=3,vd=4,xd=5,_d=6,yd=7,ls=0,Md=1,wd=2,ni=0,bd=1,Sd=2,Td=3,Ed=4,Ad=5,Gl=300,mr=301,gr=302,Fa=303,Na=304,cs=306,Oa=307,Ba=1e3,qt=1001,Ua=1002,_t=1003,Wl=1004,Xl=1005,Vt=1006,Cd=1007,hs=1008,nn=1009,Ld=1010,Rd=1011,vr=1012,Pd=1013,xr=1014,Nn=1015,Mi=1016,Dd=1017,Id=1018,Fd=1019,ii=1020,Nd=1021,On=1022,Ct=1023,Od=1024,Bd=1025,Ud=Ct,ri=1026,si=1027,zd=1028,Vd=1029,kd=1030,Hd=1031,Gd=1032,Wd=1033,ql=33776,Yl=33777,Zl=33778,jl=33779,Jl=35840,$l=35841,Ql=35842,Kl=35843,Xd=36196,ec=37492,tc=37496,qd=37808,Yd=37809,Zd=37810,jd=37811,Jd=37812,$d=37813,Qd=37814,Kd=37815,ef=37816,tf=37817,nf=37818,rf=37819,sf=37820,af=37821,of=36492,lf=37840,cf=37841,hf=37842,uf=37843,df=37844,ff=37845,pf=37846,mf=37847,gf=37848,vf=37849,xf=37850,_f=37851,yf=37852,Mf=37853,wf=2200,bf=2201,Sf=2202,us=2300,ds=2301,za=2302,wi=2400,bi=2401,fs=2402,Va=2500,nc=2501,Tf=0,kt=3e3,ps=3001,ka=3007,Ha=3002,ic=3004,rc=3005,sc=3006,ac=3200,Ef=3201,Si=0,Af=1,Ga=7680,Cf=519,_r=35044,ms=35048,oc="300 es";class Tn{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const i=this._listeners[e];if(i!==void 0){const s=i.indexOf(t);s!==-1&&i.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let s=0,a=i.length;s<a;s++)i[s].call(this,e);e.target=null}}}const St=[];for(let r=0;r<256;r++)St[r]=(r<16?"0":"")+r.toString(16);let gs=1234567;const yr=Math.PI/180,Mr=180/Math.PI;function rn(){const r=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(St[r&255]+St[r>>8&255]+St[r>>16&255]+St[r>>24&255]+"-"+St[e&255]+St[e>>8&255]+"-"+St[e>>16&15|64]+St[e>>24&255]+"-"+St[t&63|128]+St[t>>8&255]+"-"+St[t>>16&255]+St[t>>24&255]+St[n&255]+St[n>>8&255]+St[n>>16&255]+St[n>>24&255]).toUpperCase()}function Ot(r,e,t){return Math.max(e,Math.min(t,r))}function Wa(r,e){return(r%e+e)%e}function Lf(r,e,t,n,i){return n+(r-e)*(i-n)/(t-e)}function Rf(r,e,t){return r!==e?(t-r)/(e-r):0}function wr(r,e,t){return(1-t)*r+t*e}function Pf(r,e,t,n){return wr(r,e,1-Math.exp(-t*n))}function Df(r,e=1){return e-Math.abs(Wa(r,e*2)-e)}function If(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e),r*r*(3-2*r))}function Ff(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e),r*r*r*(r*(r*6-15)+10))}function Nf(r,e){return r+Math.floor(Math.random()*(e-r+1))}function Of(r,e){return r+Math.random()*(e-r)}function Bf(r){return r*(.5-Math.random())}function Uf(r){return r!==void 0&&(gs=r%2147483647),gs=gs*16807%2147483647,(gs-1)/2147483646}function zf(r){return r*yr}function Vf(r){return r*Mr}function Xa(r){return(r&r-1)==0&&r!==0}function kf(r){return Math.pow(2,Math.ceil(Math.log(r)/Math.LN2))}function lc(r){return Math.pow(2,Math.floor(Math.log(r)/Math.LN2))}function Hf(r,e,t,n,i){const s=Math.cos,a=Math.sin,o=s(t/2),l=a(t/2),c=s((e+n)/2),h=a((e+n)/2),u=s((e-n)/2),d=a((e-n)/2),f=s((n-e)/2),g=a((n-e)/2);switch(i){case"XYX":r.set(o*h,l*u,l*d,o*c);break;case"YZY":r.set(l*d,o*h,l*u,o*c);break;case"ZXZ":r.set(l*u,l*d,o*h,o*c);break;case"XZX":r.set(o*h,l*g,l*f,o*c);break;case"YXY":r.set(l*f,o*h,l*g,o*c);break;case"ZYZ":r.set(l*g,l*f,o*h,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}var pM=Object.freeze({__proto__:null,DEG2RAD:yr,RAD2DEG:Mr,generateUUID:rn,clamp:Ot,euclideanModulo:Wa,mapLinear:Lf,inverseLerp:Rf,lerp:wr,damp:Pf,pingpong:Df,smoothstep:If,smootherstep:Ff,randInt:Nf,randFloat:Of,randFloatSpread:Bf,seededRandom:Uf,degToRad:zf,radToDeg:Vf,isPowerOfTwo:Xa,ceilPowerOfTwo:kf,floorPowerOfTwo:lc,setQuaternionFromProperEuler:Hf});class ee{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e,t){return t!==void 0?(console.warn("THREE.Vector2: .add() now only accepts one argument. Use .addVectors( a, b ) instead."),this.addVectors(e,t)):(this.x+=e.x,this.y+=e.y,this)}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e,t){return t!==void 0?(console.warn("THREE.Vector2: .sub() now only accepts one argument. Use .subVectors( a, b ) instead."),this.subVectors(e,t)):(this.x-=e.x,this.y-=e.y,this)}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=this.x<0?Math.ceil(this.x):Math.floor(this.x),this.y=this.y<0?Math.ceil(this.y):Math.floor(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t,n){return n!==void 0&&console.warn("THREE.Vector2: offset has been removed from .fromBufferAttribute()."),this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*n-a*i+e.x,this.y=s*i+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}ee.prototype.isVector2=!0;class Tt{constructor(){this.elements=[1,0,0,0,1,0,0,0,1],arguments.length>0&&console.error("THREE.Matrix3: the constructor no longer reads arguments. use .set() instead.")}set(e,t,n,i,s,a,o,l,c){const h=this.elements;return h[0]=e,h[1]=i,h[2]=o,h[3]=t,h[4]=s,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,s=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],g=n[8],v=i[0],w=i[3],m=i[6],p=i[1],b=i[4],M=i[7],E=i[2],D=i[5],_=i[8];return s[0]=a*v+o*p+l*E,s[3]=a*w+o*b+l*D,s[6]=a*m+o*M+l*_,s[1]=c*v+h*p+u*E,s[4]=c*w+h*b+u*D,s[7]=c*m+h*M+u*_,s[2]=d*v+f*p+g*E,s[5]=d*w+f*b+g*D,s[8]=d*m+f*M+g*_,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*s*h+n*o*l+i*s*c-i*a*l}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=h*a-o*c,d=o*l-h*s,f=c*s-a*l,g=t*u+n*d+i*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return e[0]=u*v,e[1]=(i*c-h*n)*v,e[2]=(o*n-i*a)*v,e[3]=d*v,e[4]=(h*t-i*l)*v,e[5]=(i*s-o*t)*v,e[6]=f*v,e[7]=(n*l-c*t)*v,e[8]=(a*t-n*s)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,s,a,o){const l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-i*c,i*l,-i*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){const n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=t,n[4]*=t,n[7]*=t,this}rotate(e){const t=Math.cos(e),n=Math.sin(e),i=this.elements,s=i[0],a=i[3],o=i[6],l=i[1],c=i[4],h=i[7];return i[0]=t*s+n*l,i[3]=t*a+n*c,i[6]=t*o+n*h,i[1]=-n*s+t*l,i[4]=-n*a+t*c,i[7]=-n*o+t*h,this}translate(e,t){const n=this.elements;return n[0]+=e*n[2],n[3]+=e*n[5],n[6]+=e*n[8],n[1]+=t*n[2],n[4]+=t*n[5],n[7]+=t*n[8],this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}Tt.prototype.isMatrix3=!0;function cc(r){if(r.length===0)return-1/0;let e=r[0];for(let t=1,n=r.length;t<n;++t)r[t]>e&&(e=r[t]);return e}function vs(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function hc(r,e=0){let t=3735928559^e,n=1103547991^e;for(let i=0,s;i<r.length;i++)s=r.charCodeAt(i),t=Math.imul(t^s,2654435761),n=Math.imul(n^s,1597334677);return t=Math.imul(t^t>>>16,2246822507)^Math.imul(n^n>>>13,3266489909),n=Math.imul(n^n>>>16,2246822507)^Math.imul(t^t>>>13,3266489909),4294967296*(2097151&n)+(t>>>0)}let Ti;class Ei{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement=="undefined")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Ti===void 0&&(Ti=vs("canvas")),Ti.width=e.width,Ti.height=e.height;const n=Ti.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=Ti}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}}let Gf=0;class Et extends Tn{constructor(e=Et.DEFAULT_IMAGE,t=Et.DEFAULT_MAPPING,n=qt,i=qt,s=Vt,a=hs,o=Ct,l=nn,c=1,h=kt){super();Object.defineProperty(this,"id",{value:Gf++}),this.uuid=rn(),this.name="",this.image=e,this.mipmaps=[],this.mapping=t,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new ee(0,0),this.repeat=new ee(1,1),this.center=new ee(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Tt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.encoding=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.image=e.image,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.encoding=e.encoding,this.userData=JSON.parse(JSON.stringify(e.userData)),this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.5,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,mapping:this.mapping,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,type:this.type,encoding:this.encoding,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};if(this.image!==void 0){const i=this.image;if(i.uuid===void 0&&(i.uuid=rn()),!t&&e.images[i.uuid]===void 0){let s;if(Array.isArray(i)){s=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?s.push(qa(i[a].image)):s.push(qa(i[a]))}else s=qa(i);e.images[i.uuid]={uuid:i.uuid,url:s}}n.image=i.uuid}return JSON.stringify(this.userData)!=="{}"&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Gl)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ba:e.x=e.x-Math.floor(e.x);break;case qt:e.x=e.x<0?0:1;break;case Ua:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ba:e.y=e.y-Math.floor(e.y);break;case qt:e.y=e.y<0?0:1;break;case Ua:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&this.version++}}Et.DEFAULT_IMAGE=void 0;Et.DEFAULT_MAPPING=Gl;Et.prototype.isTexture=!0;function qa(r){return typeof HTMLImageElement!="undefined"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&r instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&r instanceof ImageBitmap?Ei.getDataURL(r):r.data?{data:Array.prototype.slice.call(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}class it{constructor(e=0,t=0,n=0,i=1){this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e,t){return t!==void 0?(console.warn("THREE.Vector4: .add() now only accepts one argument. Use .addVectors( a, b ) instead."),this.addVectors(e,t)):(this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this)}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e,t){return t!==void 0?(console.warn("THREE.Vector4: .sub() now only accepts one argument. Use .subVectors( a, b ) instead."),this.subVectors(e,t)):(this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this)}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*i+a[12]*s,this.y=a[1]*t+a[5]*n+a[9]*i+a[13]*s,this.z=a[2]*t+a[6]*n+a[10]*i+a[14]*s,this.w=a[3]*t+a[7]*n+a[11]*i+a[15]*s,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,s;const a=.01,o=.1,l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],g=l[9],v=l[2],w=l[6],m=l[10];if(Math.abs(h-d)<a&&Math.abs(u-v)<a&&Math.abs(g-w)<a){if(Math.abs(h+d)<o&&Math.abs(u+v)<o&&Math.abs(g+w)<o&&Math.abs(c+f+m-3)<o)return this.set(1,0,0,0),this;t=Math.PI;const b=(c+1)/2,M=(f+1)/2,E=(m+1)/2,D=(h+d)/4,_=(u+v)/4,R=(g+w)/4;return b>M&&b>E?b<a?(n=0,i=.707106781,s=.707106781):(n=Math.sqrt(b),i=D/n,s=_/n):M>E?M<a?(n=.707106781,i=0,s=.707106781):(i=Math.sqrt(M),n=D/i,s=R/i):E<a?(n=.707106781,i=.707106781,s=0):(s=Math.sqrt(E),n=_/s,i=R/s),this.set(n,i,s,t),this}let p=Math.sqrt((w-g)*(w-g)+(u-v)*(u-v)+(d-h)*(d-h));return Math.abs(p)<.001&&(p=1),this.x=(w-g)/p,this.y=(u-v)/p,this.z=(d-h)/p,this.w=Math.acos((c+f+m-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=this.x<0?Math.ceil(this.x):Math.floor(this.x),this.y=this.y<0?Math.ceil(this.y):Math.floor(this.y),this.z=this.z<0?Math.ceil(this.z):Math.floor(this.z),this.w=this.w<0?Math.ceil(this.w):Math.floor(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t,n){return n!==void 0&&console.warn("THREE.Vector4: offset has been removed from .fromBufferAttribute()."),this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}it.prototype.isVector4=!0;class Yt extends Tn{constructor(e,t,n={}){super();this.width=e,this.height=t,this.depth=1,this.scissor=new it(0,0,e,t),this.scissorTest=!1,this.viewport=new it(0,0,e,t),this.texture=new Et(void 0,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.encoding),this.texture.isRenderTargetTexture=!0,this.texture.image={width:e,height:t,depth:1},this.texture.generateMipmaps=n.generateMipmaps!==void 0?n.generateMipmaps:!1,this.texture.internalFormat=n.internalFormat!==void 0?n.internalFormat:null,this.texture.minFilter=n.minFilter!==void 0?n.minFilter:Vt,this.depthBuffer=n.depthBuffer!==void 0?n.depthBuffer:!0,this.stencilBuffer=n.stencilBuffer!==void 0?n.stencilBuffer:!1,this.depthTexture=n.depthTexture!==void 0?n.depthTexture:null}setTexture(e){e.image={width:this.width,height:this.height,depth:this.depth},this.texture=e}setSize(e,t,n=1){(this.width!==e||this.height!==t||this.depth!==n)&&(this.width=e,this.height=t,this.depth=n,this.texture.image.width=e,this.texture.image.height=t,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.width=e.width,this.height=e.height,this.depth=e.depth,this.viewport.copy(e.viewport),this.texture=e.texture.clone(),this.texture.image=en({},this.texture.image),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.depthTexture=e.depthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}Yt.prototype.isWebGLRenderTarget=!0;class Wf extends Yt{constructor(e,t,n){super(e,t);const i=this.texture;this.texture=[];for(let s=0;s<n;s++)this.texture[s]=i.clone()}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,s=this.texture.length;i<s;i++)this.texture[i].image.width=e,this.texture[i].image.height=t,this.texture[i].image.depth=n;this.dispose()}return this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t),this}copy(e){this.dispose(),this.width=e.width,this.height=e.height,this.depth=e.depth,this.viewport.set(0,0,this.width,this.height),this.scissor.set(0,0,this.width,this.height),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.depthTexture=e.depthTexture,this.texture.length=0;for(let t=0,n=e.texture.length;t<n;t++)this.texture[t]=e.texture[t].clone();return this}}Wf.prototype.isWebGLMultipleRenderTargets=!0;class br extends Yt{constructor(e,t,n={}){super(e,t,n);this.samples=4,this.ignoreDepthForMultisampleCopy=n.ignoreDepth!==void 0?n.ignoreDepth:!0,this.useRenderToTexture=n.useRenderToTexture!==void 0?n.useRenderToTexture:!1,this.useRenderbuffer=this.useRenderToTexture===!1}copy(e){return super.copy.call(this,e),this.samples=e.samples,this.useRenderToTexture=e.useRenderToTexture,this.useRenderbuffer=e.useRenderbuffer,this}}br.prototype.isWebGLMultisampleRenderTarget=!0;class Ht{constructor(e=0,t=0,n=0,i=1){this._x=e,this._y=t,this._z=n,this._w=i}static slerp(e,t,n,i){return console.warn("THREE.Quaternion: Static .slerp() has been deprecated. Use qm.slerpQuaternions( qa, qb, t ) instead."),n.slerpQuaternions(e,t,i)}static slerpFlat(e,t,n,i,s,a,o){let l=n[i+0],c=n[i+1],h=n[i+2],u=n[i+3];const d=s[a+0],f=s[a+1],g=s[a+2],v=s[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u;return}if(o===1){e[t+0]=d,e[t+1]=f,e[t+2]=g,e[t+3]=v;return}if(u!==v||l!==d||c!==f||h!==g){let w=1-o;const m=l*d+c*f+h*g+u*v,p=m>=0?1:-1,b=1-m*m;if(b>Number.EPSILON){const E=Math.sqrt(b),D=Math.atan2(E,m*p);w=Math.sin(w*D)/E,o=Math.sin(o*D)/E}const M=o*p;if(l=l*w+d*M,c=c*w+f*M,h=h*w+g*M,u=u*w+v*M,w===1-o){const E=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=E,c*=E,h*=E,u*=E}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,i,s,a){const o=n[i],l=n[i+1],c=n[i+2],h=n[i+3],u=s[a],d=s[a+1],f=s[a+2],g=s[a+3];return e[t]=o*g+h*u+l*f-c*d,e[t+1]=l*g+h*d+c*u-o*f,e[t+2]=c*g+h*f+o*d-l*u,e[t+3]=h*g-o*u-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t){if(!(e&&e.isEuler))throw new Error("THREE.Quaternion: .setFromEuler() now expects an Euler rotation rather than a Vector3 and order.");const n=e._x,i=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(i/2),u=o(s/2),d=l(n/2),f=l(i/2),g=l(s/2);switch(a){case"XYZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"YZX":this._x=d*h*u+c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u-d*f*g;break;case"XZY":this._x=d*h*u-c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t!==!1&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],s=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=n+o+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(s-c)*f,this._z=(a-i)*f}else if(n>o&&n>u){const f=2*Math.sqrt(1+n-o-u);this._w=(h-l)/f,this._x=.25*f,this._y=(i+a)/f,this._z=(s+c)/f}else if(o>u){const f=2*Math.sqrt(1+o-n-u);this._w=(s-c)/f,this._x=(i+a)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+u-n-o);this._w=(a-i)/f,this._x=(s+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ot(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e,t){return t!==void 0?(console.warn("THREE.Quaternion: .multiply() now only accepts one argument. Use .multiplyQuaternions( a, b ) instead."),this.multiplyQuaternions(e,t)):this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,s=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+i*c-s*l,this._y=i*h+a*l+s*o-n*c,this._z=s*h+a*c+n*l-i*o,this._w=a*h-n*o-i*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,i=this._y,s=this._z,a=this._w;let o=a*e._w+n*e._x+i*e._y+s*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=i,this._z=s,this;const l=1-o*o;if(l<=Number.EPSILON){const f=1-t;return this._w=f*a+t*this._w,this._x=f*n+t*this._x,this._y=f*i+t*this._y,this._z=f*s+t*this._z,this.normalize(),this._onChangeCallback(),this}const c=Math.sqrt(l),h=Math.atan2(c,o),u=Math.sin((1-t)*h)/c,d=Math.sin(t*h)/c;return this._w=a*u+this._w*d,this._x=n*u+this._x*d,this._y=i*u+this._y*d,this._z=s*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){this.copy(e).slerp(t,n)}random(){const e=Math.random(),t=Math.sqrt(1-e),n=Math.sqrt(e),i=2*Math.PI*Math.random(),s=2*Math.PI*Math.random();return this.set(t*Math.cos(i),n*Math.sin(s),n*Math.cos(s),t*Math.sin(i))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}}Ht.prototype.isQuaternion=!0;class C{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e,t){return t!==void 0?(console.warn("THREE.Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead."),this.addVectors(e,t)):(this.x+=e.x,this.y+=e.y,this.z+=e.z,this)}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e,t){return t!==void 0?(console.warn("THREE.Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead."),this.subVectors(e,t)):(this.x-=e.x,this.y-=e.y,this.z-=e.z,this)}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e,t){return t!==void 0?(console.warn("THREE.Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead."),this.multiplyVectors(e,t)):(this.x*=e.x,this.y*=e.y,this.z*=e.z,this)}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return e&&e.isEuler||console.error("THREE.Vector3: .applyEuler() now expects an Euler rotation rather than a Vector3 and order."),this.applyQuaternion(uc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(uc.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*i,this.y=s[1]*t+s[4]*n+s[7]*i,this.z=s[2]*t+s[5]*n+s[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,s=e.elements,a=1/(s[3]*t+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*i+s[12])*a,this.y=(s[1]*t+s[5]*n+s[9]*i+s[13])*a,this.z=(s[2]*t+s[6]*n+s[10]*i+s[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=l*t+a*i-o*n,h=l*n+o*t-s*i,u=l*i+s*n-a*t,d=-s*t-a*n-o*i;return this.x=c*l+d*-s+h*-o-u*-a,this.y=h*l+d*-a+u*-s-c*-o,this.z=u*l+d*-o+c*-a-h*-s,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*i,this.y=s[1]*t+s[5]*n+s[9]*i,this.z=s[2]*t+s[6]*n+s[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=this.x<0?Math.ceil(this.x):Math.floor(this.x),this.y=this.y<0?Math.ceil(this.y):Math.floor(this.y),this.z=this.z<0?Math.ceil(this.z):Math.floor(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e,t){return t!==void 0?(console.warn("THREE.Vector3: .cross() now only accepts one argument. Use .crossVectors( a, b ) instead."),this.crossVectors(e,t)):this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,s=e.z,a=t.x,o=t.y,l=t.z;return this.x=i*l-s*o,this.y=s*a-n*l,this.z=n*o-i*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Ya.copy(this).projectOnVector(e),this.sub(Ya)}reflect(e){return this.sub(Ya.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Ot(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t,n){return n!==void 0&&console.warn("THREE.Vector3: offset has been removed from .fromBufferAttribute()."),this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=(Math.random()-.5)*2,t=Math.random()*Math.PI*2,n=Math.sqrt(1-e**2);return this.x=n*Math.cos(t),this.y=n*Math.sin(t),this.z=e,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}C.prototype.isVector3=!0;const Ya=new C,uc=new Ht;class sn{constructor(e=new C(1/0,1/0,1/0),t=new C(-1/0,-1/0,-1/0)){this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){let t=1/0,n=1/0,i=1/0,s=-1/0,a=-1/0,o=-1/0;for(let l=0,c=e.length;l<c;l+=3){const h=e[l],u=e[l+1],d=e[l+2];h<t&&(t=h),u<n&&(n=u),d<i&&(i=d),h>s&&(s=h),u>a&&(a=u),d>o&&(o=d)}return this.min.set(t,n,i),this.max.set(s,a,o),this}setFromBufferAttribute(e){let t=1/0,n=1/0,i=1/0,s=-1/0,a=-1/0,o=-1/0;for(let l=0,c=e.count;l<c;l++){const h=e.getX(l),u=e.getY(l),d=e.getZ(l);h<t&&(t=h),u<n&&(n=u),d<i&&(i=d),h>s&&(s=h),u>a&&(a=u),d>o&&(o=d)}return this.min.set(t,n,i),this.max.set(s,a,o),this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Sr.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e){return this.makeEmpty(),this.expandByObject(e)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e){e.updateWorldMatrix(!1,!1);const t=e.geometry;t!==void 0&&(t.boundingBox===null&&t.computeBoundingBox(),Za.copy(t.boundingBox),Za.applyMatrix4(e.matrixWorld),this.union(Za));const n=e.children;for(let i=0,s=n.length;i<s;i++)this.expandByObject(n[i]);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,Sr),Sr.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Tr),xs.subVectors(this.max,Tr),Ai.subVectors(e.a,Tr),Ci.subVectors(e.b,Tr),Li.subVectors(e.c,Tr),Bn.subVectors(Ci,Ai),Un.subVectors(Li,Ci),ai.subVectors(Ai,Li);let t=[0,-Bn.z,Bn.y,0,-Un.z,Un.y,0,-ai.z,ai.y,Bn.z,0,-Bn.x,Un.z,0,-Un.x,ai.z,0,-ai.x,-Bn.y,Bn.x,0,-Un.y,Un.x,0,-ai.y,ai.x,0];return!ja(t,Ai,Ci,Li,xs)||(t=[1,0,0,0,1,0,0,0,1],!ja(t,Ai,Ci,Li,xs))?!1:(_s.crossVectors(Bn,Un),t=[_s.x,_s.y,_s.z],ja(t,Ai,Ci,Li,xs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return Sr.copy(e).clamp(this.min,this.max).sub(e).length()}getBoundingSphere(e){return this.getCenter(e.center),e.radius=this.getSize(Sr).length()*.5,e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(En[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),En[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),En[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),En[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),En[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),En[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),En[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),En[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(En),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}sn.prototype.isBox3=!0;const En=[new C,new C,new C,new C,new C,new C,new C,new C],Sr=new C,Za=new sn,Ai=new C,Ci=new C,Li=new C,Bn=new C,Un=new C,ai=new C,Tr=new C,xs=new C,_s=new C,oi=new C;function ja(r,e,t,n,i){for(let s=0,a=r.length-3;s<=a;s+=3){oi.fromArray(r,s);const o=i.x*Math.abs(oi.x)+i.y*Math.abs(oi.y)+i.z*Math.abs(oi.z),l=e.dot(oi),c=t.dot(oi),h=n.dot(oi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Xf=new sn,dc=new C,Ja=new C,$a=new C;class Ri{constructor(e=new C,t=-1){this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Xf.setFromPoints(e).getCenter(n);let i=0;for(let s=0,a=e.length;s<a;s++)i=Math.max(i,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){$a.subVectors(e,this.center);const t=$a.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.add($a.multiplyScalar(i/n)),this.radius+=i}return this}union(e){return Ja.subVectors(e.center,this.center).normalize().multiplyScalar(e.radius),this.expandByPoint(dc.copy(e.center).add(Ja)),this.expandByPoint(dc.copy(e.center).sub(Ja)),this}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const An=new C,Qa=new C,ys=new C,zn=new C,Ka=new C,Ms=new C,eo=new C;class li{constructor(e=new C,t=new C(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.direction).multiplyScalar(e).add(this.origin)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,An)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.direction).multiplyScalar(n).add(this.origin)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=An.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(An.copy(this.direction).multiplyScalar(t).add(this.origin),An.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){Qa.copy(e).add(t).multiplyScalar(.5),ys.copy(t).sub(e).normalize(),zn.copy(this.origin).sub(Qa);const s=e.distanceTo(t)*.5,a=-this.direction.dot(ys),o=zn.dot(this.direction),l=-zn.dot(ys),c=zn.lengthSq(),h=Math.abs(1-a*a);let u,d,f,g;if(h>0)if(u=a*l-o,d=a*o-l,g=s*h,u>=0)if(d>=-g)if(d<=g){const v=1/h;u*=v,d*=v,f=u*(u+a*d+2*o)+d*(a*u+d+2*l)+c}else d=s,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;else d=-s,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;else d<=-g?(u=Math.max(0,-(-a*s+o)),d=u>0?-s:Math.min(Math.max(-s,-l),s),f=-u*u+d*(d+2*l)+c):d<=g?(u=0,d=Math.min(Math.max(-s,-l),s),f=d*(d+2*l)+c):(u=Math.max(0,-(a*s+o)),d=u>0?s:Math.min(Math.max(-s,-l),s),f=-u*u+d*(d+2*l)+c);else d=a>0?-s:s,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;return n&&n.copy(this.direction).multiplyScalar(u).add(this.origin),i&&i.copy(ys).multiplyScalar(d).add(Qa),f}intersectSphere(e,t){An.subVectors(e.center,this.origin);const n=An.dot(this.direction),i=An.dot(An)-n*n,s=e.radius*e.radius;if(i>s)return null;const a=Math.sqrt(s-i),o=n-a,l=n+a;return o<0&&l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,s,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,i=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,i=(e.min.x-d.x)*c),h>=0?(s=(e.min.y-d.y)*h,a=(e.max.y-d.y)*h):(s=(e.max.y-d.y)*h,a=(e.min.y-d.y)*h),n>a||s>i||((s>n||n!==n)&&(n=s),(a<i||i!==i)&&(i=a),u>=0?(o=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),n>l||o>i)||((o>n||n!==n)&&(n=o),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,An)!==null}intersectTriangle(e,t,n,i,s){Ka.subVectors(t,e),Ms.subVectors(n,e),eo.crossVectors(Ka,Ms);let a=this.direction.dot(eo),o;if(a>0){if(i)return null;o=1}else if(a<0)o=-1,a=-a;else return null;zn.subVectors(this.origin,e);const l=o*this.direction.dot(Ms.crossVectors(zn,Ms));if(l<0)return null;const c=o*this.direction.dot(Ka.cross(zn));if(c<0||l+c>a)return null;const h=-o*zn.dot(eo);return h<0?null:this.at(h/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Le{constructor(){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],arguments.length>0&&console.error("THREE.Matrix4: the constructor no longer reads arguments. use .set() instead.")}set(e,t,n,i,s,a,o,l,c,h,u,d,f,g,v,w){const m=this.elements;return m[0]=e,m[4]=t,m[8]=n,m[12]=i,m[1]=s,m[5]=a,m[9]=o,m[13]=l,m[2]=c,m[6]=h,m[10]=u,m[14]=d,m[3]=f,m[7]=g,m[11]=v,m[15]=w,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Le().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,i=1/Pi.setFromMatrixColumn(e,0).length(),s=1/Pi.setFromMatrixColumn(e,1).length(),a=1/Pi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){e&&e.isEuler||console.error("THREE.Matrix4: .makeRotationFromEuler() now expects a Euler rotation rather than a Vector3 and order.");const t=this.elements,n=e.x,i=e.y,s=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(s),u=Math.sin(s);if(e.order==="XYZ"){const d=a*h,f=a*u,g=o*h,v=o*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=f+g*c,t[5]=d-v*c,t[9]=-o*l,t[2]=v-d*c,t[6]=g+f*c,t[10]=a*l}else if(e.order==="YXZ"){const d=l*h,f=l*u,g=c*h,v=c*u;t[0]=d+v*o,t[4]=g*o-f,t[8]=a*c,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=f*o-g,t[6]=v+d*o,t[10]=a*l}else if(e.order==="ZXY"){const d=l*h,f=l*u,g=c*h,v=c*u;t[0]=d-v*o,t[4]=-a*u,t[8]=g+f*o,t[1]=f+g*o,t[5]=a*h,t[9]=v-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const d=a*h,f=a*u,g=o*h,v=o*u;t[0]=l*h,t[4]=g*c-f,t[8]=d*c+v,t[1]=l*u,t[5]=v*c+d,t[9]=f*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const d=a*l,f=a*c,g=o*l,v=o*c;t[0]=l*h,t[4]=v-d*u,t[8]=g*u+f,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=f*u+g,t[10]=d-v*u}else if(e.order==="XZY"){const d=a*l,f=a*c,g=o*l,v=o*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+v,t[5]=a*h,t[9]=f*u-g,t[2]=g*u-f,t[6]=o*h,t[10]=v*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(qf,e,Yf)}lookAt(e,t,n){const i=this.elements;return Zt.subVectors(e,t),Zt.lengthSq()===0&&(Zt.z=1),Zt.normalize(),Vn.crossVectors(n,Zt),Vn.lengthSq()===0&&(Math.abs(n.z)===1?Zt.x+=1e-4:Zt.z+=1e-4,Zt.normalize(),Vn.crossVectors(n,Zt)),Vn.normalize(),ws.crossVectors(Zt,Vn),i[0]=Vn.x,i[4]=ws.x,i[8]=Zt.x,i[1]=Vn.y,i[5]=ws.y,i[9]=Zt.y,i[2]=Vn.z,i[6]=ws.z,i[10]=Zt.z,this}multiply(e,t){return t!==void 0?(console.warn("THREE.Matrix4: .multiply() now only accepts one argument. Use .multiplyMatrices( a, b ) instead."),this.multiplyMatrices(e,t)):this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,s=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],g=n[2],v=n[6],w=n[10],m=n[14],p=n[3],b=n[7],M=n[11],E=n[15],D=i[0],_=i[4],R=i[8],F=i[12],z=i[1],P=i[5],ne=i[9],U=i[13],N=i[2],H=i[6],V=i[10],W=i[14],ae=i[3],me=i[7],q=i[11],Y=i[15];return s[0]=a*D+o*z+l*N+c*ae,s[4]=a*_+o*P+l*H+c*me,s[8]=a*R+o*ne+l*V+c*q,s[12]=a*F+o*U+l*W+c*Y,s[1]=h*D+u*z+d*N+f*ae,s[5]=h*_+u*P+d*H+f*me,s[9]=h*R+u*ne+d*V+f*q,s[13]=h*F+u*U+d*W+f*Y,s[2]=g*D+v*z+w*N+m*ae,s[6]=g*_+v*P+w*H+m*me,s[10]=g*R+v*ne+w*V+m*q,s[14]=g*F+v*U+w*W+m*Y,s[3]=p*D+b*z+M*N+E*ae,s[7]=p*_+b*P+M*H+E*me,s[11]=p*R+b*ne+M*V+E*q,s[15]=p*F+b*U+M*W+E*Y,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],f=e[14],g=e[3],v=e[7],w=e[11],m=e[15];return g*(+s*l*u-i*c*u-s*o*d+n*c*d+i*o*f-n*l*f)+v*(+t*l*f-t*c*d+s*a*d-i*a*f+i*c*h-s*l*h)+w*(+t*c*u-t*o*f-s*a*u+n*a*f+s*o*h-n*c*h)+m*(-i*o*h-t*l*u+t*o*d+i*a*u-n*a*d+n*l*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],f=e[11],g=e[12],v=e[13],w=e[14],m=e[15],p=u*w*c-v*d*c+v*l*f-o*w*f-u*l*m+o*d*m,b=g*d*c-h*w*c-g*l*f+a*w*f+h*l*m-a*d*m,M=h*v*c-g*u*c+g*o*f-a*v*f-h*o*m+a*u*m,E=g*u*l-h*v*l-g*o*d+a*v*d+h*o*w-a*u*w,D=t*p+n*b+i*M+s*E;if(D===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const _=1/D;return e[0]=p*_,e[1]=(v*d*s-u*w*s-v*i*f+n*w*f+u*i*m-n*d*m)*_,e[2]=(o*w*s-v*l*s+v*i*c-n*w*c-o*i*m+n*l*m)*_,e[3]=(u*l*s-o*d*s-u*i*c+n*d*c+o*i*f-n*l*f)*_,e[4]=b*_,e[5]=(h*w*s-g*d*s+g*i*f-t*w*f-h*i*m+t*d*m)*_,e[6]=(g*l*s-a*w*s-g*i*c+t*w*c+a*i*m-t*l*m)*_,e[7]=(a*d*s-h*l*s+h*i*c-t*d*c-a*i*f+t*l*f)*_,e[8]=M*_,e[9]=(g*u*s-h*v*s-g*n*f+t*v*f+h*n*m-t*u*m)*_,e[10]=(a*v*s-g*o*s+g*n*c-t*v*c-a*n*m+t*o*m)*_,e[11]=(h*o*s-a*u*s-h*n*c+t*u*c+a*n*f-t*o*f)*_,e[12]=E*_,e[13]=(h*v*i-g*u*i+g*n*d-t*v*d-h*n*w+t*u*w)*_,e[14]=(g*o*i-a*v*i-g*n*l+t*v*l+a*n*w-t*o*w)*_,e[15]=(a*u*i-h*o*i+h*n*l-t*u*l-a*n*d+t*o*d)*_,this}scale(e){const t=this.elements,n=e.x,i=e.y,s=e.z;return t[0]*=n,t[4]*=i,t[8]*=s,t[1]*=n,t[5]*=i,t[9]*=s,t[2]*=n,t[6]*=i,t[10]*=s,t[3]*=n,t[7]*=i,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),s=1-n,a=e.x,o=e.y,l=e.z,c=s*a,h=s*o;return this.set(c*a+n,c*o-i*l,c*l+i*o,0,c*o+i*l,h*o+n,h*l-i*a,0,c*l-i*o,h*l+i*a,s*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,s,a){return this.set(1,n,s,0,e,1,a,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,s=t._x,a=t._y,o=t._z,l=t._w,c=s+s,h=a+a,u=o+o,d=s*c,f=s*h,g=s*u,v=a*h,w=a*u,m=o*u,p=l*c,b=l*h,M=l*u,E=n.x,D=n.y,_=n.z;return i[0]=(1-(v+m))*E,i[1]=(f+M)*E,i[2]=(g-b)*E,i[3]=0,i[4]=(f-M)*D,i[5]=(1-(d+m))*D,i[6]=(w+p)*D,i[7]=0,i[8]=(g+b)*_,i[9]=(w-p)*_,i[10]=(1-(d+v))*_,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;let s=Pi.set(i[0],i[1],i[2]).length();const a=Pi.set(i[4],i[5],i[6]).length(),o=Pi.set(i[8],i[9],i[10]).length();this.determinant()<0&&(s=-s),e.x=i[12],e.y=i[13],e.z=i[14],an.copy(this);const c=1/s,h=1/a,u=1/o;return an.elements[0]*=c,an.elements[1]*=c,an.elements[2]*=c,an.elements[4]*=h,an.elements[5]*=h,an.elements[6]*=h,an.elements[8]*=u,an.elements[9]*=u,an.elements[10]*=u,t.setFromRotationMatrix(an),n.x=s,n.y=a,n.z=o,this}makePerspective(e,t,n,i,s,a){a===void 0&&console.warn("THREE.Matrix4: .makePerspective() has been redefined and has a new signature. Please check the docs.");const o=this.elements,l=2*s/(t-e),c=2*s/(n-i),h=(t+e)/(t-e),u=(n+i)/(n-i),d=-(a+s)/(a-s),f=-2*a*s/(a-s);return o[0]=l,o[4]=0,o[8]=h,o[12]=0,o[1]=0,o[5]=c,o[9]=u,o[13]=0,o[2]=0,o[6]=0,o[10]=d,o[14]=f,o[3]=0,o[7]=0,o[11]=-1,o[15]=0,this}makeOrthographic(e,t,n,i,s,a){const o=this.elements,l=1/(t-e),c=1/(n-i),h=1/(a-s),u=(t+e)*l,d=(n+i)*c,f=(a+s)*h;return o[0]=2*l,o[4]=0,o[8]=0,o[12]=-u,o[1]=0,o[5]=2*c,o[9]=0,o[13]=-d,o[2]=0,o[6]=0,o[10]=-2*h,o[14]=-f,o[3]=0,o[7]=0,o[11]=0,o[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}Le.prototype.isMatrix4=!0;const Pi=new C,an=new Le,qf=new C(0,0,0),Yf=new C(1,1,1),Vn=new C,ws=new C,Zt=new C,fc=new Le,pc=new Ht;class Di{constructor(e=0,t=0,n=0,i=Di.DefaultOrder){this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,s=i[0],a=i[4],o=i[8],l=i[1],c=i[5],h=i[9],u=i[2],d=i[6],f=i[10];switch(t){case"XYZ":this._y=Math.asin(Ot(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ot(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(Ot(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-Ot(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Ot(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Ot(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return fc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(fc,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return pc.setFromEuler(this),this.setFromQuaternion(pc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}toVector3(e){return e?e.set(this._x,this._y,this._z):new C(this._x,this._y,this._z)}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}}Di.prototype.isEuler=!0;Di.DefaultOrder="XYZ";Di.RotationOrders=["XYZ","YZX","ZXY","XZY","YXZ","ZYX"];class mc{constructor(){this.mask=1|0}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=4294967295|0}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!=0}isEnabled(e){return(this.mask&(1<<e|0))!=0}}let Zf=0;const gc=new C,Ii=new Ht,Cn=new Le,bs=new C,Er=new C,jf=new C,Jf=new Ht,vc=new C(1,0,0),xc=new C(0,1,0),_c=new C(0,0,1),$f={type:"added"},yc={type:"removed"};class $e extends Tn{constructor(){super();Object.defineProperty(this,"id",{value:Zf++}),this.uuid=rn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=$e.DefaultUp.clone();const e=new C,t=new Di,n=new Ht,i=new C(1,1,1);function s(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Le},normalMatrix:{value:new Tt}}),this.matrix=new Le,this.matrixWorld=new Le,this.matrixAutoUpdate=$e.DefaultMatrixAutoUpdate,this.matrixWorldNeedsUpdate=!1,this.layers=new mc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ii.setFromAxisAngle(e,t),this.quaternion.multiply(Ii),this}rotateOnWorldAxis(e,t){return Ii.setFromAxisAngle(e,t),this.quaternion.premultiply(Ii),this}rotateX(e){return this.rotateOnAxis(vc,e)}rotateY(e){return this.rotateOnAxis(xc,e)}rotateZ(e){return this.rotateOnAxis(_c,e)}translateOnAxis(e,t){return gc.copy(e).applyQuaternion(this.quaternion),this.position.add(gc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(vc,e)}translateY(e){return this.translateOnAxis(xc,e)}translateZ(e){return this.translateOnAxis(_c,e)}localToWorld(e){return e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return e.applyMatrix4(Cn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?bs.copy(e):bs.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),Er.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Cn.lookAt(Er,bs,this.up):Cn.lookAt(bs,Er,this.up),this.quaternion.setFromRotationMatrix(Cn),i&&(Cn.extractRotation(i.matrixWorld),Ii.setFromRotationMatrix(Cn),this.quaternion.premultiply(Ii.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent($f)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(yc)),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){for(let e=0;e<this.children.length;e++){const t=this.children[e];t.parent=null,t.dispatchEvent(yc)}return this.children.length=0,this}attach(e){return this.updateWorldMatrix(!0,!1),Cn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Cn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Cn),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Er,e,jf),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Er,Jf,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){const i=this.children;for(let s=0,a=i.length;s<a;s++)i[s].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{}},n.metadata={version:4.5,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),JSON.stringify(this.userData)!=="{}"&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON()));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];s(e.shapes,u)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));i.material=o}else i.material=s(e.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];i.animations.push(s(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),u=a(e.shapes),d=a(e.skeletons),f=a(e.animations);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f)}return n.object=i,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}$e.DefaultUp=new C(0,1,0);$e.DefaultMatrixAutoUpdate=!0;$e.prototype.isObject3D=!0;const on=new C,Ln=new C,to=new C,Rn=new C,Fi=new C,Ni=new C,Mc=new C,no=new C,io=new C,ro=new C;class vt{constructor(e=new C,t=new C,n=new C){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),on.subVectors(e,t),i.cross(on);const s=i.lengthSq();return s>0?i.multiplyScalar(1/Math.sqrt(s)):i.set(0,0,0)}static getBarycoord(e,t,n,i,s){on.subVectors(i,t),Ln.subVectors(n,t),to.subVectors(e,t);const a=on.dot(on),o=on.dot(Ln),l=on.dot(to),c=Ln.dot(Ln),h=Ln.dot(to),u=a*c-o*o;if(u===0)return s.set(-2,-1,-1);const d=1/u,f=(c*l-o*h)*d,g=(a*h-o*l)*d;return s.set(1-f-g,g,f)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,Rn),Rn.x>=0&&Rn.y>=0&&Rn.x+Rn.y<=1}static getUV(e,t,n,i,s,a,o,l){return this.getBarycoord(e,t,n,i,Rn),l.set(0,0),l.addScaledVector(s,Rn.x),l.addScaledVector(a,Rn.y),l.addScaledVector(o,Rn.z),l}static isFrontFacing(e,t,n,i){return on.subVectors(n,t),Ln.subVectors(e,t),on.cross(Ln).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return on.subVectors(this.c,this.b),Ln.subVectors(this.a,this.b),on.cross(Ln).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return vt.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return vt.getBarycoord(e,this.a,this.b,this.c,t)}getUV(e,t,n,i,s){return vt.getUV(e,this.a,this.b,this.c,t,n,i,s)}containsPoint(e){return vt.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return vt.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,s=this.c;let a,o;Fi.subVectors(i,n),Ni.subVectors(s,n),no.subVectors(e,n);const l=Fi.dot(no),c=Ni.dot(no);if(l<=0&&c<=0)return t.copy(n);io.subVectors(e,i);const h=Fi.dot(io),u=Ni.dot(io);if(h>=0&&u<=h)return t.copy(i);const d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(n).addScaledVector(Fi,a);ro.subVectors(e,s);const f=Fi.dot(ro),g=Ni.dot(ro);if(g>=0&&f<=g)return t.copy(s);const v=f*c-l*g;if(v<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(n).addScaledVector(Ni,o);const w=h*g-f*u;if(w<=0&&u-h>=0&&f-g>=0)return Mc.subVectors(s,i),o=(u-h)/(u-h+(f-g)),t.copy(i).addScaledVector(Mc,o);const m=1/(w+v+d);return a=v*m,o=d*m,t.copy(n).addScaledVector(Fi,a).addScaledVector(Ni,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}let Qf=0;class Lt extends Tn{constructor(){super();Object.defineProperty(this,"id",{value:Qf++}),this.uuid=rn(),this.name="",this.type="Material",this.fog=!0,this.blending=pr,this.side=_i,this.vertexColors=!1,this.opacity=1,this.format=Ct,this.transparent=!1,this.blendSrc=kl,this.blendDst=Hl,this.blendEquation=yi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.depthFunc=Ia,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Cf,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ga,this.stencilZFail=Ga,this.stencilZPass=Ga,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn("THREE.Material: '"+t+"' parameter is undefined.");continue}if(t==="shading"){console.warn("THREE."+this.type+": .shading has been removed. Use the boolean .flatShading instead."),this.flatShading=n===Nl;continue}const i=this[t];if(i===void 0){console.warn("THREE."+this.type+": '"+t+"' is not a property of this material.");continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.5,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==pr&&(n.blending=this.blending),this.side!==_i&&(n.side=this.side),this.vertexColors&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.format!==Ct&&(n.format=this.format),this.transparent===!0&&(n.transparent=this.transparent),n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.stencilWrite=this.stencilWrite,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,this.rotation&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaToCoverage===!0&&(n.alphaToCoverage=this.alphaToCoverage),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=this.premultipliedAlpha),this.wireframe===!0&&(n.wireframe=this.wireframe),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=this.flatShading),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),JSON.stringify(this.userData)!=="{}"&&(n.userData=this.userData);function i(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(t){const s=i(e.textures),a=i(e.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.fog=e.fog,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.format=e.format,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let s=0;s!==i;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}Lt.prototype.isMaterial=!0;const wc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ln={h:0,s:0,l:0},Ss={h:0,s:0,l:0};function so(r,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?r+(e-r)*6*t:t<1/2?e:t<2/3?r+(e-r)*6*(2/3-t):r}function ao(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function oo(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}class be{constructor(e,t,n){return t===void 0&&n===void 0?this.set(e):this.setRGB(e,t,n)}set(e){return e&&e.isColor?this.copy(e):typeof e=="number"?this.setHex(e):typeof e=="string"&&this.setStyle(e),this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,this}setRGB(e,t,n){return this.r=e,this.g=t,this.b=n,this}setHSL(e,t,n){if(e=Wa(e,1),t=Ot(t,0,1),n=Ot(n,0,1),t===0)this.r=this.g=this.b=n;else{const i=n<=.5?n*(1+t):n+t-n*t,s=2*n-i;this.r=so(s,i,e+1/3),this.g=so(s,i,e),this.b=so(s,i,e-1/3)}return this}setStyle(e){function t(i){i!==void 0&&parseFloat(i)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let n;if(n=/^((?:rgb|hsl)a?)\(([^\)]*)\)/.exec(e)){let i;const s=n[1],a=n[2];switch(s){case"rgb":case"rgba":if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return this.r=Math.min(255,parseInt(i[1],10))/255,this.g=Math.min(255,parseInt(i[2],10))/255,this.b=Math.min(255,parseInt(i[3],10))/255,t(i[4]),this;if(i=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return this.r=Math.min(100,parseInt(i[1],10))/100,this.g=Math.min(100,parseInt(i[2],10))/100,this.b=Math.min(100,parseInt(i[3],10))/100,t(i[4]),this;break;case"hsl":case"hsla":if(i=/^\s*(\d*\.?\d+)\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a)){const o=parseFloat(i[1])/360,l=parseInt(i[2],10)/100,c=parseInt(i[3],10)/100;return t(i[4]),this.setHSL(o,l,c)}break}}else if(n=/^\#([A-Fa-f\d]+)$/.exec(e)){const i=n[1],s=i.length;if(s===3)return this.r=parseInt(i.charAt(0)+i.charAt(0),16)/255,this.g=parseInt(i.charAt(1)+i.charAt(1),16)/255,this.b=parseInt(i.charAt(2)+i.charAt(2),16)/255,this;if(s===6)return this.r=parseInt(i.charAt(0)+i.charAt(1),16)/255,this.g=parseInt(i.charAt(2)+i.charAt(3),16)/255,this.b=parseInt(i.charAt(4)+i.charAt(5),16)/255,this}return e&&e.length>0?this.setColorName(e):this}setColorName(e){const t=wc[e.toLowerCase()];return t!==void 0?this.setHex(t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copyGammaToLinear(e,t=2){return this.r=Math.pow(e.r,t),this.g=Math.pow(e.g,t),this.b=Math.pow(e.b,t),this}copyLinearToGamma(e,t=2){const n=t>0?1/t:1;return this.r=Math.pow(e.r,n),this.g=Math.pow(e.g,n),this.b=Math.pow(e.b,n),this}convertGammaToLinear(e){return this.copyGammaToLinear(this,e),this}convertLinearToGamma(e){return this.copyLinearToGamma(this,e),this}copySRGBToLinear(e){return this.r=ao(e.r),this.g=ao(e.g),this.b=ao(e.b),this}copyLinearToSRGB(e){return this.r=oo(e.r),this.g=oo(e.g),this.b=oo(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(){return this.r*255<<16^this.g*255<<8^this.b*255<<0}getHexString(){return("000000"+this.getHex().toString(16)).slice(-6)}getHSL(e){const t=this.r,n=this.g,i=this.b,s=Math.max(t,n,i),a=Math.min(t,n,i);let o,l;const c=(a+s)/2;if(a===s)o=0,l=0;else{const h=s-a;switch(l=c<=.5?h/(s+a):h/(2-s-a),s){case t:o=(n-i)/h+(n<i?6:0);break;case n:o=(i-t)/h+2;break;case i:o=(t-n)/h+4;break}o/=6}return e.h=o,e.s=l,e.l=c,e}getStyle(){return"rgb("+(this.r*255|0)+","+(this.g*255|0)+","+(this.b*255|0)+")"}offsetHSL(e,t,n){return this.getHSL(ln),ln.h+=e,ln.s+=t,ln.l+=n,this.setHSL(ln.h,ln.s,ln.l),this}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(ln),e.getHSL(Ss);const n=wr(ln.h,Ss.h,t),i=wr(ln.s,Ss.s,t),s=wr(ln.l,Ss.l,t);return this.setHSL(n,i,s),this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),e.normalized===!0&&(this.r/=255,this.g/=255,this.b/=255),this}toJSON(){return this.getHex()}}be.NAMES=wc;be.prototype.isColor=!0;be.prototype.r=1;be.prototype.g=1;be.prototype.b=1;class lo extends Lt{constructor(e){super();this.type="MeshBasicMaterial",this.color=new be(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=ls,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this}}lo.prototype.isMeshBasicMaterial=!0;const rt=new C,Ts=new ee;class ut{constructor(e,t,n){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n===!0,this.usage=_r,this.updateRange={offset:0,count:-1},this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}copyColorsArray(e){const t=this.array;let n=0;for(let i=0,s=e.length;i<s;i++){let a=e[i];a===void 0&&(console.warn("THREE.BufferAttribute.copyColorsArray(): color is undefined",i),a=new be),t[n++]=a.r,t[n++]=a.g,t[n++]=a.b}return this}copyVector2sArray(e){const t=this.array;let n=0;for(let i=0,s=e.length;i<s;i++){let a=e[i];a===void 0&&(console.warn("THREE.BufferAttribute.copyVector2sArray(): vector is undefined",i),a=new ee),t[n++]=a.x,t[n++]=a.y}return this}copyVector3sArray(e){const t=this.array;let n=0;for(let i=0,s=e.length;i<s;i++){let a=e[i];a===void 0&&(console.warn("THREE.BufferAttribute.copyVector3sArray(): vector is undefined",i),a=new C),t[n++]=a.x,t[n++]=a.y,t[n++]=a.z}return this}copyVector4sArray(e){const t=this.array;let n=0;for(let i=0,s=e.length;i<s;i++){let a=e[i];a===void 0&&(console.warn("THREE.BufferAttribute.copyVector4sArray(): vector is undefined",i),a=new it),t[n++]=a.x,t[n++]=a.y,t[n++]=a.z,t[n++]=a.w}return this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Ts.fromBufferAttribute(this,t),Ts.applyMatrix3(e),this.setXY(t,Ts.x,Ts.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)rt.fromBufferAttribute(this,t),rt.applyMatrix3(e),this.setXYZ(t,rt.x,rt.y,rt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)rt.x=this.getX(t),rt.y=this.getY(t),rt.z=this.getZ(t),rt.applyMatrix4(e),this.setXYZ(t,rt.x,rt.y,rt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)rt.x=this.getX(t),rt.y=this.getY(t),rt.z=this.getZ(t),rt.applyNormalMatrix(e),this.setXYZ(t,rt.x,rt.y,rt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)rt.x=this.getX(t),rt.y=this.getY(t),rt.z=this.getZ(t),rt.transformDirection(e),this.setXYZ(t,rt.x,rt.y,rt.z);return this}set(e,t=0){return this.array.set(e,t),this}getX(e){return this.array[e*this.itemSize]}setX(e,t){return this.array[e*this.itemSize]=t,this}getY(e){return this.array[e*this.itemSize+1]}setY(e,t){return this.array[e*this.itemSize+1]=t,this}getZ(e){return this.array[e*this.itemSize+2]}setZ(e,t){return this.array[e*this.itemSize+2]=t,this}getW(e){return this.array[e*this.itemSize+3]}setW(e,t){return this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e*=this.itemSize,this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.prototype.slice.call(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==_r&&(e.usage=this.usage),(this.updateRange.offset!==0||this.updateRange.count!==-1)&&(e.updateRange=this.updateRange),e}}ut.prototype.isBufferAttribute=!0;class bc extends ut{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Sc extends ut{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class Kf extends ut{constructor(e,t,n){super(new Uint16Array(e),t,n)}}Kf.prototype.isFloat16BufferAttribute=!0;class yt extends ut{constructor(e,t,n){super(new Float32Array(e),t,n)}}let ep=0;const $t=new Le,co=new $e,Oi=new C,jt=new sn,Ar=new sn,Mt=new C;class st extends Tn{constructor(){super();Object.defineProperty(this,"id",{value:ep++}),this.uuid=rn(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(cc(e)>65535?Sc:bc)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new Tt().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return $t.makeRotationFromQuaternion(e),this.applyMatrix4($t),this}rotateX(e){return $t.makeRotationX(e),this.applyMatrix4($t),this}rotateY(e){return $t.makeRotationY(e),this.applyMatrix4($t),this}rotateZ(e){return $t.makeRotationZ(e),this.applyMatrix4($t),this}translate(e,t,n){return $t.makeTranslation(e,t,n),this.applyMatrix4($t),this}scale(e,t,n){return $t.makeScale(e,t,n),this.applyMatrix4($t),this}lookAt(e){return co.lookAt(e),co.updateMatrix(),this.applyMatrix4(co.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Oi).negate(),this.translate(Oi.x,Oi.y,Oi.z),this}setFromPoints(e){const t=[];for(let n=0,i=e.length;n<i;n++){const s=e[n];t.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new yt(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new sn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const s=t[n];jt.setFromBufferAttribute(s),this.morphTargetsRelative?(Mt.addVectors(this.boundingBox.min,jt.min),this.boundingBox.expandByPoint(Mt),Mt.addVectors(this.boundingBox.max,jt.max),this.boundingBox.expandByPoint(Mt)):(this.boundingBox.expandByPoint(jt.min),this.boundingBox.expandByPoint(jt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ri);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new C,1/0);return}if(e){const n=this.boundingSphere.center;if(jt.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){const o=t[s];Ar.setFromBufferAttribute(o),this.morphTargetsRelative?(Mt.addVectors(jt.min,Ar.min),jt.expandByPoint(Mt),Mt.addVectors(jt.max,Ar.max),jt.expandByPoint(Mt)):(jt.expandByPoint(Ar.min),jt.expandByPoint(Ar.max))}jt.getCenter(n);let i=0;for(let s=0,a=e.count;s<a;s++)Mt.fromBufferAttribute(e,s),i=Math.max(i,n.distanceToSquared(Mt));if(t)for(let s=0,a=t.length;s<a;s++){const o=t[s],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Mt.fromBufferAttribute(o,c),l&&(Oi.fromBufferAttribute(e,c),Mt.add(Oi)),i=Math.max(i,n.distanceToSquared(Mt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.array,i=t.position.array,s=t.normal.array,a=t.uv.array,o=i.length/3;t.tangent===void 0&&this.setAttribute("tangent",new ut(new Float32Array(4*o),4));const l=t.tangent.array,c=[],h=[];for(let z=0;z<o;z++)c[z]=new C,h[z]=new C;const u=new C,d=new C,f=new C,g=new ee,v=new ee,w=new ee,m=new C,p=new C;function b(z,P,ne){u.fromArray(i,z*3),d.fromArray(i,P*3),f.fromArray(i,ne*3),g.fromArray(a,z*2),v.fromArray(a,P*2),w.fromArray(a,ne*2),d.sub(u),f.sub(u),v.sub(g),w.sub(g);const U=1/(v.x*w.y-w.x*v.y);!isFinite(U)||(m.copy(d).multiplyScalar(w.y).addScaledVector(f,-v.y).multiplyScalar(U),p.copy(f).multiplyScalar(v.x).addScaledVector(d,-w.x).multiplyScalar(U),c[z].add(m),c[P].add(m),c[ne].add(m),h[z].add(p),h[P].add(p),h[ne].add(p))}let M=this.groups;M.length===0&&(M=[{start:0,count:n.length}]);for(let z=0,P=M.length;z<P;++z){const ne=M[z],U=ne.start,N=ne.count;for(let H=U,V=U+N;H<V;H+=3)b(n[H+0],n[H+1],n[H+2])}const E=new C,D=new C,_=new C,R=new C;function F(z){_.fromArray(s,z*3),R.copy(_);const P=c[z];E.copy(P),E.sub(_.multiplyScalar(_.dot(P))).normalize(),D.crossVectors(R,P);const U=D.dot(h[z])<0?-1:1;l[z*4]=E.x,l[z*4+1]=E.y,l[z*4+2]=E.z,l[z*4+3]=U}for(let z=0,P=M.length;z<P;++z){const ne=M[z],U=ne.start,N=ne.count;for(let H=U,V=U+N;H<V;H+=3)F(n[H+0]),F(n[H+1]),F(n[H+2])}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new ut(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const i=new C,s=new C,a=new C,o=new C,l=new C,c=new C,h=new C,u=new C;if(e)for(let d=0,f=e.count;d<f;d+=3){const g=e.getX(d+0),v=e.getX(d+1),w=e.getX(d+2);i.fromBufferAttribute(t,g),s.fromBufferAttribute(t,v),a.fromBufferAttribute(t,w),h.subVectors(a,s),u.subVectors(i,s),h.cross(u),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,w),o.add(h),l.add(h),c.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(w,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)i.fromBufferAttribute(t,d+0),s.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),h.subVectors(a,s),u.subVectors(i,s),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}merge(e,t){if(!(e&&e.isBufferGeometry)){console.error("THREE.BufferGeometry.merge(): geometry not an instance of THREE.BufferGeometry.",e);return}t===void 0&&(t=0,console.warn("THREE.BufferGeometry.merge(): Overwriting original geometry, starting at offset=0. Use BufferGeometryUtils.mergeBufferGeometries() for lossless merge."));const n=this.attributes;for(const i in n){if(e.attributes[i]===void 0)continue;const a=n[i].array,o=e.attributes[i],l=o.array,c=o.itemSize*t,h=Math.min(l.length,a.length-c);for(let u=0,d=c;u<h;u++,d++)a[d]=l[u]}return this}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Mt.fromBufferAttribute(e,t),Mt.normalize(),e.setXYZ(t,Mt.x,Mt.y,Mt.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,u=o.normalized,d=new c.constructor(l.length*h);let f=0,g=0;for(let v=0,w=l.length;v<w;v++){o.isInterleavedBufferAttribute?f=l[v]*o.data.stride+o.offset:f=l[v]*h;for(let m=0;m<h;m++)d[g++]=c[f++]}return new ut(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new st,n=this.index.array,i=this.attributes;for(const o in i){const l=i[o],c=e(l,n);t.setAttribute(o,c)}const s=this.morphAttributes;for(const o in s){const l=[],c=s[o];for(let h=0,u=c.length;h<u;h++){const d=c[h],f=e(d,n);l.push(f)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.5,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const i={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){const f=c[u];h.push(f.toJSON(e.data))}h.length>0&&(i[l]=h,s=!0)}s&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const i=e.attributes;for(const c in i){const h=i[c];this.setAttribute(c,h.clone(t))}const s=e.morphAttributes;for(const c in s){const h=[],u=s[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,h=a.length;c<h;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,e.parameters!==void 0&&(this.parameters=Object.assign({},e.parameters)),this}dispose(){this.dispatchEvent({type:"dispose"})}}st.prototype.isBufferGeometry=!0;const Tc=new Le,Bi=new li,ho=new Ri,kn=new C,Hn=new C,Gn=new C,uo=new C,fo=new C,po=new C,Es=new C,As=new C,Cs=new C,Ls=new ee,Rs=new ee,Ps=new ee,mo=new C,Ds=new C;class Rt extends $e{constructor(e=new st,t=new lo){super();this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e){return super.copy(e),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=e.material,this.geometry=e.geometry,this}updateMorphTargets(){const e=this.geometry;if(e.isBufferGeometry){const t=e.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){const o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}else{const t=e.morphTargets;t!==void 0&&t.length>0&&console.error("THREE.Mesh.updateMorphTargets() no longer supports THREE.Geometry. Use THREE.BufferGeometry instead.")}}raycast(e,t){const n=this.geometry,i=this.material,s=this.matrixWorld;if(i===void 0||(n.boundingSphere===null&&n.computeBoundingSphere(),ho.copy(n.boundingSphere),ho.applyMatrix4(s),e.ray.intersectsSphere(ho)===!1)||(Tc.copy(s).invert(),Bi.copy(e.ray).applyMatrix4(Tc),n.boundingBox!==null&&Bi.intersectsBox(n.boundingBox)===!1))return;let a;if(n.isBufferGeometry){const o=n.index,l=n.attributes.position,c=n.morphAttributes.position,h=n.morphTargetsRelative,u=n.attributes.uv,d=n.attributes.uv2,f=n.groups,g=n.drawRange;if(o!==null)if(Array.isArray(i))for(let v=0,w=f.length;v<w;v++){const m=f[v],p=i[m.materialIndex],b=Math.max(m.start,g.start),M=Math.min(o.count,Math.min(m.start+m.count,g.start+g.count));for(let E=b,D=M;E<D;E+=3){const _=o.getX(E),R=o.getX(E+1),F=o.getX(E+2);a=Is(this,p,e,Bi,l,c,h,u,d,_,R,F),a&&(a.faceIndex=Math.floor(E/3),a.face.materialIndex=m.materialIndex,t.push(a))}}else{const v=Math.max(0,g.start),w=Math.min(o.count,g.start+g.count);for(let m=v,p=w;m<p;m+=3){const b=o.getX(m),M=o.getX(m+1),E=o.getX(m+2);a=Is(this,i,e,Bi,l,c,h,u,d,b,M,E),a&&(a.faceIndex=Math.floor(m/3),t.push(a))}}else if(l!==void 0)if(Array.isArray(i))for(let v=0,w=f.length;v<w;v++){const m=f[v],p=i[m.materialIndex],b=Math.max(m.start,g.start),M=Math.min(l.count,Math.min(m.start+m.count,g.start+g.count));for(let E=b,D=M;E<D;E+=3){const _=E,R=E+1,F=E+2;a=Is(this,p,e,Bi,l,c,h,u,d,_,R,F),a&&(a.faceIndex=Math.floor(E/3),a.face.materialIndex=m.materialIndex,t.push(a))}}else{const v=Math.max(0,g.start),w=Math.min(l.count,g.start+g.count);for(let m=v,p=w;m<p;m+=3){const b=m,M=m+1,E=m+2;a=Is(this,i,e,Bi,l,c,h,u,d,b,M,E),a&&(a.faceIndex=Math.floor(m/3),t.push(a))}}}else n.isGeometry&&console.error("THREE.Mesh.raycast() no longer supports THREE.Geometry. Use THREE.BufferGeometry instead.")}}Rt.prototype.isMesh=!0;function tp(r,e,t,n,i,s,a,o){let l;if(e.side===lt?l=n.intersectTriangle(a,s,i,!0,o):l=n.intersectTriangle(i,s,a,e.side!==pn,o),l===null)return null;Ds.copy(o),Ds.applyMatrix4(r.matrixWorld);const c=t.ray.origin.distanceTo(Ds);return c<t.near||c>t.far?null:{distance:c,point:Ds.clone(),object:r}}function Is(r,e,t,n,i,s,a,o,l,c,h,u){kn.fromBufferAttribute(i,c),Hn.fromBufferAttribute(i,h),Gn.fromBufferAttribute(i,u);const d=r.morphTargetInfluences;if(s&&d){Es.set(0,0,0),As.set(0,0,0),Cs.set(0,0,0);for(let g=0,v=s.length;g<v;g++){const w=d[g],m=s[g];w!==0&&(uo.fromBufferAttribute(m,c),fo.fromBufferAttribute(m,h),po.fromBufferAttribute(m,u),a?(Es.addScaledVector(uo,w),As.addScaledVector(fo,w),Cs.addScaledVector(po,w)):(Es.addScaledVector(uo.sub(kn),w),As.addScaledVector(fo.sub(Hn),w),Cs.addScaledVector(po.sub(Gn),w)))}kn.add(Es),Hn.add(As),Gn.add(Cs)}r.isSkinnedMesh&&(r.boneTransform(c,kn),r.boneTransform(h,Hn),r.boneTransform(u,Gn));const f=tp(r,e,t,n,kn,Hn,Gn,mo);if(f){o&&(Ls.fromBufferAttribute(o,c),Rs.fromBufferAttribute(o,h),Ps.fromBufferAttribute(o,u),f.uv=vt.getUV(mo,kn,Hn,Gn,Ls,Rs,Ps,new ee)),l&&(Ls.fromBufferAttribute(l,c),Rs.fromBufferAttribute(l,h),Ps.fromBufferAttribute(l,u),f.uv2=vt.getUV(mo,kn,Hn,Gn,Ls,Rs,Ps,new ee));const g={a:c,b:h,c:u,normal:new C,materialIndex:0};vt.getNormal(kn,Hn,Gn,g.normal),f.face=g}return f}class Ui extends st{constructor(e=1,t=1,n=1,i=1,s=1,a=1){super();this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:s,depthSegments:a};const o=this;i=Math.floor(i),s=Math.floor(s),a=Math.floor(a);const l=[],c=[],h=[],u=[];let d=0,f=0;g("z","y","x",-1,-1,n,t,e,a,s,0),g("z","y","x",1,-1,n,t,-e,a,s,1),g("x","z","y",1,1,e,n,t,i,a,2),g("x","z","y",1,-1,e,n,-t,i,a,3),g("x","y","z",1,-1,e,t,n,i,s,4),g("x","y","z",-1,-1,e,t,-n,i,s,5),this.setIndex(l),this.setAttribute("position",new yt(c,3)),this.setAttribute("normal",new yt(h,3)),this.setAttribute("uv",new yt(u,2));function g(v,w,m,p,b,M,E,D,_,R,F){const z=M/_,P=E/R,ne=M/2,U=E/2,N=D/2,H=_+1,V=R+1;let W=0,ae=0;const me=new C;for(let q=0;q<V;q++){const Y=q*P-U;for(let de=0;de<H;de++){const ue=de*z-ne;me[v]=ue*p,me[w]=Y*b,me[m]=N,c.push(me.x,me.y,me.z),me[v]=0,me[w]=0,me[m]=D>0?1:-1,h.push(me.x,me.y,me.z),u.push(de/_),u.push(1-q/R),W+=1}}for(let q=0;q<R;q++)for(let Y=0;Y<_;Y++){const de=d+Y+H*q,ue=d+Y+H*(q+1),xe=d+(Y+1)+H*(q+1),Xe=d+(Y+1)+H*q;l.push(de,ue,Xe),l.push(ue,xe,Xe),ae+=6}o.addGroup(f,ae,F),f+=ae,d+=W}}static fromJSON(e){return new Ui(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function zi(r){const e={};for(const t in r){e[t]={};for(const n in r[t]){const i=r[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function Pt(r){const e={};for(let t=0;t<r.length;t++){const n=zi(r[t]);for(const i in n)e[i]=n[i]}return e}const Ec={clone:zi,merge:Pt};var np=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ip=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class gn extends Lt{constructor(e){super();this.type="ShaderMaterial",this.defines={},this.uniforms={},this.vertexShader=np,this.fragmentShader=ip,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv2:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&(e.attributes!==void 0&&console.error("THREE.ShaderMaterial: attributes should now be defined in THREE.BufferGeometry instead."),this.setValues(e))}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=zi(e.uniforms),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?t.uniforms[i]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[i]={type:"m4",value:a.toArray()}:t.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}gn.prototype.isShaderMaterial=!0;class Fs extends $e{constructor(){super();this.type="Camera",this.matrixWorldInverse=new Le,this.projectionMatrix=new Le,this.projectionMatrixInverse=new Le}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(-t[8],-t[9],-t[10]).normalize()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}Fs.prototype.isCamera=!0;class Bt extends Fs{constructor(e=50,t=1,n=.1,i=2e3){super();this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Mr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(yr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Mr*2*Math.atan(Math.tan(yr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(e,t,n,i,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(yr*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,s=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*i/l,t-=a.offsetY*n/c,i*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+i,t,t-n,e,this.far),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}Bt.prototype.isPerspectiveCamera=!0;const Vi=90,ki=1;class go extends $e{constructor(e,t,n){super();if(this.type="CubeCamera",n.isWebGLCubeRenderTarget!==!0){console.error("THREE.CubeCamera: The constructor now expects an instance of WebGLCubeRenderTarget as third parameter.");return}this.renderTarget=n;const i=new Bt(Vi,ki,e,t);i.layers=this.layers,i.up.set(0,-1,0),i.lookAt(new C(1,0,0)),this.add(i);const s=new Bt(Vi,ki,e,t);s.layers=this.layers,s.up.set(0,-1,0),s.lookAt(new C(-1,0,0)),this.add(s);const a=new Bt(Vi,ki,e,t);a.layers=this.layers,a.up.set(0,0,1),a.lookAt(new C(0,1,0)),this.add(a);const o=new Bt(Vi,ki,e,t);o.layers=this.layers,o.up.set(0,0,-1),o.lookAt(new C(0,-1,0)),this.add(o);const l=new Bt(Vi,ki,e,t);l.layers=this.layers,l.up.set(0,-1,0),l.lookAt(new C(0,0,1)),this.add(l);const c=new Bt(Vi,ki,e,t);c.layers=this.layers,c.up.set(0,-1,0),c.lookAt(new C(0,0,-1)),this.add(c)}update(e,t){this.parent===null&&this.updateMatrixWorld();const n=this.renderTarget,[i,s,a,o,l,c]=this.children,h=e.xr.enabled,u=e.getRenderTarget();e.xr.enabled=!1;const d=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0),e.render(t,i),e.setRenderTarget(n,1),e.render(t,s),e.setRenderTarget(n,2),e.render(t,a),e.setRenderTarget(n,3),e.render(t,o),e.setRenderTarget(n,4),e.render(t,l),n.texture.generateMipmaps=d,e.setRenderTarget(n,5),e.render(t,c),e.setRenderTarget(u),e.xr.enabled=h}}class Ns extends Et{constructor(e,t,n,i,s,a,o,l,c,h){e=e!==void 0?e:[],t=t!==void 0?t:mr;super(e,t,n,i,s,a,o,l,c,h);this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}Ns.prototype.isCubeTexture=!0;class Ac extends Yt{constructor(e,t,n){Number.isInteger(t)&&(console.warn("THREE.WebGLCubeRenderTarget: constructor signature is now WebGLCubeRenderTarget( size, options )"),t=n);super(e,e,t);t=t||{},this.texture=new Ns(void 0,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.encoding),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Vt,this.texture._needsFlipEnvMap=!1}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.format=Ct,this.texture.encoding=t.encoding,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new Ui(5,5,5),s=new gn({name:"CubemapFromEquirect",uniforms:zi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:lt,blending:mn});s.uniforms.tEquirect.value=t;const a=new Rt(i,s),o=t.minFilter;return t.minFilter===hs&&(t.minFilter=Vt),new go(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,n,i){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,i);e.setRenderTarget(s)}}Ac.prototype.isWebGLCubeRenderTarget=!0;const vo=new C,rp=new C,sp=new Tt;class Pn{constructor(e=new C(1,0,0),t=0){this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=vo.subVectors(n,t).cross(rp.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(this.normal).multiplyScalar(-this.distanceToPoint(e)).add(e)}intersectLine(e,t){const n=e.delta(vo),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/i;return s<0||s>1?null:t.copy(n).multiplyScalar(s).add(e.start)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||sp.getNormalMatrix(e),i=this.coplanarPoint(vo).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}Pn.prototype.isPlane=!0;const Hi=new Ri,Os=new C;class Bs{constructor(e=new Pn,t=new Pn,n=new Pn,i=new Pn,s=new Pn,a=new Pn){this.planes=[e,t,n,i,s,a]}set(e,t,n,i,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(i),o[4].copy(s),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e){const t=this.planes,n=e.elements,i=n[0],s=n[1],a=n[2],o=n[3],l=n[4],c=n[5],h=n[6],u=n[7],d=n[8],f=n[9],g=n[10],v=n[11],w=n[12],m=n[13],p=n[14],b=n[15];return t[0].setComponents(o-i,u-l,v-d,b-w).normalize(),t[1].setComponents(o+i,u+l,v+d,b+w).normalize(),t[2].setComponents(o+s,u+c,v+f,b+m).normalize(),t[3].setComponents(o-s,u-c,v-f,b-m).normalize(),t[4].setComponents(o-a,u-h,v-g,b-p).normalize(),t[5].setComponents(o+a,u+h,v+g,b+p).normalize(),this}intersectsObject(e){const t=e.geometry;return t.boundingSphere===null&&t.computeBoundingSphere(),Hi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld),this.intersectsSphere(Hi)}intersectsSprite(e){return Hi.center.set(0,0,0),Hi.radius=.7071067811865476,Hi.applyMatrix4(e.matrixWorld),this.intersectsSphere(Hi)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(Os.x=i.normal.x>0?e.max.x:e.min.x,Os.y=i.normal.y>0?e.max.y:e.min.y,Os.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(Os)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Cc(){let r=null,e=!1,t=null,n=null;function i(s,a){t(s,a),n=r.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=r.requestAnimationFrame(i),e=!0)},stop:function(){r.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){r=s}}}function ap(r,e){const t=e.isWebGL2,n=new WeakMap;function i(c,h){const u=c.array,d=c.usage,f=r.createBuffer();r.bindBuffer(h,f),r.bufferData(h,u,d),c.onUploadCallback();let g=5126;return u instanceof Float32Array?g=5126:u instanceof Float64Array?console.warn("THREE.WebGLAttributes: Unsupported data buffer format: Float64Array."):u instanceof Uint16Array?c.isFloat16BufferAttribute?t?g=5131:console.warn("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2."):g=5123:u instanceof Int16Array?g=5122:u instanceof Uint32Array?g=5125:u instanceof Int32Array?g=5124:u instanceof Int8Array?g=5120:(u instanceof Uint8Array||u instanceof Uint8ClampedArray)&&(g=5121),{buffer:f,type:g,bytesPerElement:u.BYTES_PER_ELEMENT,version:c.version}}function s(c,h,u){const d=h.array,f=h.updateRange;r.bindBuffer(u,c),f.count===-1?r.bufferSubData(u,0,d):(t?r.bufferSubData(u,f.offset*d.BYTES_PER_ELEMENT,d,f.offset,f.count):r.bufferSubData(u,f.offset*d.BYTES_PER_ELEMENT,d.subarray(f.offset,f.offset+f.count)),f.count=-1)}function a(c){return c.isInterleavedBufferAttribute&&(c=c.data),n.get(c)}function o(c){c.isInterleavedBufferAttribute&&(c=c.data);const h=n.get(c);h&&(r.deleteBuffer(h.buffer),n.delete(c))}function l(c,h){if(c.isGLBufferAttribute){const d=n.get(c);(!d||d.version<c.version)&&n.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);const u=n.get(c);u===void 0?n.set(c,i(c,h)):u.version<c.version&&(s(u.buffer,c,h),u.version=c.version)}return{get:a,remove:o,update:l}}class xo extends st{constructor(e=1,t=1,n=1,i=1){super();this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const s=e/2,a=t/2,o=Math.floor(n),l=Math.floor(i),c=o+1,h=l+1,u=e/o,d=t/l,f=[],g=[],v=[],w=[];for(let m=0;m<h;m++){const p=m*d-a;for(let b=0;b<c;b++){const M=b*u-s;g.push(M,-p,0),v.push(0,0,1),w.push(b/o),w.push(1-m/l)}}for(let m=0;m<l;m++)for(let p=0;p<o;p++){const b=p+c*m,M=p+c*(m+1),E=p+1+c*(m+1),D=p+1+c*m;f.push(b,M,D),f.push(M,E,D)}this.setIndex(f),this.setAttribute("position",new yt(g,3)),this.setAttribute("normal",new yt(v,3)),this.setAttribute("uv",new yt(w,2))}static fromJSON(e){return new xo(e.width,e.height,e.widthSegments,e.heightSegments)}}var op=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vUv ).g;
#endif`,lp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,cp=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,hp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,up=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vUv2 ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,dp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,fp="vec3 transformed = vec3( position );",pp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,mp=`vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 f0, const in float f90, const in float roughness ) {
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
	float D = D_GGX( alpha, dotNH );
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif`,gp=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vUv );
		vec2 dSTdy = dFdy( vUv );
		float Hll = bumpScale * texture2D( bumpMap, vUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = vec3( dFdx( surf_pos.x ), dFdx( surf_pos.y ), dFdx( surf_pos.z ) );
		vec3 vSigmaY = vec3( dFdy( surf_pos.x ), dFdy( surf_pos.y ), dFdy( surf_pos.z ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,vp=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#pragma unroll_loop_start
	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
		plane = clippingPlanes[ i ];
		if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
	}
	#pragma unroll_loop_end
	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
		bool clipped = true;
		#pragma unroll_loop_start
		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
		}
		#pragma unroll_loop_end
		if ( clipped ) discard;
	#endif
#endif`,xp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,_p=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,yp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Mp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,wp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,bp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Sp=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Tp=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 color ) { return dot( color, vec3( 0.3333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
struct GeometricContext {
	vec3 position;
	vec3 normal;
	vec3 viewDir;
#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal;
#endif
};
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float linearToRelativeLuminance( const in vec3 color ) {
	vec3 weights = vec3( 0.2126, 0.7152, 0.0722 );
	return dot( weights, color.rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}`,Ep=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_maxMipLevel 8.0
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_maxTileSize 256.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		float texelSize = 1.0 / ( 3.0 * cubeUV_maxTileSize );
		vec2 uv = getUV( direction, face ) * ( faceSize - 1.0 );
		vec2 f = fract( uv );
		uv += 0.5 - f;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		if ( mipInt < cubeUV_maxMipLevel ) {
			uv.y += 2.0 * cubeUV_maxTileSize;
		}
		uv.y += filterInt * 2.0 * cubeUV_minTileSize;
		uv.x += 3.0 * max( 0.0, cubeUV_maxTileSize - 2.0 * faceSize );
		uv *= texelSize;
		vec3 tl = envMapTexelToLinear( texture2D( envMap, uv ) ).rgb;
		uv.x += texelSize;
		vec3 tr = envMapTexelToLinear( texture2D( envMap, uv ) ).rgb;
		uv.y += texelSize;
		vec3 br = envMapTexelToLinear( texture2D( envMap, uv ) ).rgb;
		uv.x -= texelSize;
		vec3 bl = envMapTexelToLinear( texture2D( envMap, uv ) ).rgb;
		vec3 tm = mix( tl, tr, f.x );
		vec3 bm = mix( bl, br, f.x );
		return mix( tm, bm, f.y );
	}
	#define r0 1.0
	#define v0 0.339
	#define m0 - 2.0
	#define r1 0.8
	#define v1 0.276
	#define m1 - 1.0
	#define r4 0.4
	#define v4 0.046
	#define m4 2.0
	#define r5 0.305
	#define v5 0.016
	#define m5 3.0
	#define r6 0.21
	#define v6 0.0038
	#define m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= r1 ) {
			mip = ( r0 - roughness ) * ( m1 - m0 ) / ( r0 - r1 ) + m0;
		} else if ( roughness >= r4 ) {
			mip = ( r1 - roughness ) * ( m4 - m1 ) / ( r1 - r4 ) + m1;
		} else if ( roughness >= r5 ) {
			mip = ( r4 - roughness ) * ( m5 - m4 ) / ( r4 - r5 ) + m4;
		} else if ( roughness >= r6 ) {
			mip = ( r5 - roughness ) * ( m6 - m5 ) / ( r5 - r6 ) + m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), m0, cubeUV_maxMipLevel );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Ap=`vec3 transformedNormal = objectNormal;
#ifdef USE_INSTANCING
	mat3 m = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( m[ 0 ], m[ 0 ] ), dot( m[ 1 ], m[ 1 ] ), dot( m[ 2 ], m[ 2 ] ) );
	transformedNormal = m * transformedNormal;
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	vec3 transformedTangent = ( modelViewMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Cp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Lp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vUv ).x * displacementScale + displacementBias );
#endif`,Rp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vUv );
	emissiveColor.rgb = emissiveMapTexelToLinear( emissiveColor ).rgb;
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Pp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Dp="gl_FragColor = linearToOutputTexel( gl_FragColor );",Ip=`
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 GammaToLinear( in vec4 value, in float gammaFactor ) {
	return vec4( pow( value.rgb, vec3( gammaFactor ) ), value.a );
}
vec4 LinearToGamma( in vec4 value, in float gammaFactor ) {
	return vec4( pow( value.rgb, vec3( 1.0 / gammaFactor ) ), value.a );
}
vec4 sRGBToLinear( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 LinearTosRGB( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 RGBEToLinear( in vec4 value ) {
	return vec4( value.rgb * exp2( value.a * 255.0 - 128.0 ), 1.0 );
}
vec4 LinearToRGBE( in vec4 value ) {
	float maxComponent = max( max( value.r, value.g ), value.b );
	float fExp = clamp( ceil( log2( maxComponent ) ), -128.0, 127.0 );
	return vec4( value.rgb / exp2( fExp ), ( fExp + 128.0 ) / 255.0 );
}
vec4 RGBMToLinear( in vec4 value, in float maxRange ) {
	return vec4( value.rgb * value.a * maxRange, 1.0 );
}
vec4 LinearToRGBM( in vec4 value, in float maxRange ) {
	float maxRGB = max( value.r, max( value.g, value.b ) );
	float M = clamp( maxRGB / maxRange, 0.0, 1.0 );
	M = ceil( M * 255.0 ) / 255.0;
	return vec4( value.rgb / ( M * maxRange ), M );
}
vec4 RGBDToLinear( in vec4 value, in float maxRange ) {
	return vec4( value.rgb * ( ( maxRange / 255.0 ) / value.a ), 1.0 );
}
vec4 LinearToRGBD( in vec4 value, in float maxRange ) {
	float maxRGB = max( value.r, max( value.g, value.b ) );
	float D = max( maxRange / maxRGB, 1.0 );
	D = clamp( floor( D ) / 255.0, 0.0, 1.0 );
	return vec4( value.rgb * ( D * ( 255.0 / maxRange ) ), D );
}`,Fp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
		envColor = envMapTexelToLinear( envColor );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 envColor = textureCubeUV( envMap, reflectVec, 0.0 );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Np=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Op=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Bp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) ||defined( PHONG )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Up=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,zp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Vp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,kp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Hp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Gp=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return texture2D( gradientMap, coord ).rgb;
	#else
		return ( coord.x < 0.7 ) ? vec3( 0.7 ) : vec3( 1.0 );
	#endif
}`,Wp=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vUv2 );
	vec3 lightMapIrradiance = lightMapTexelToLinear( lightMapTexel ).rgb * lightMapIntensity;
	#ifndef PHYSICALLY_CORRECT_LIGHTS
		lightMapIrradiance *= PI;
	#endif
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,Xp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,qp=`vec3 diffuse = vec3( 1.0 );
GeometricContext geometry;
geometry.position = mvPosition.xyz;
geometry.normal = normalize( transformedNormal );
geometry.viewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( -mvPosition.xyz );
GeometricContext backGeometry;
backGeometry.position = geometry.position;
backGeometry.normal = -geometry.normal;
backGeometry.viewDir = geometry.viewDir;
vLightFront = vec3( 0.0 );
vIndirectFront = vec3( 0.0 );
#ifdef DOUBLE_SIDED
	vLightBack = vec3( 0.0 );
	vIndirectBack = vec3( 0.0 );
#endif
IncidentLight directLight;
float dotNL;
vec3 directLightColor_Diffuse;
vIndirectFront += getAmbientLightIrradiance( ambientLightColor );
vIndirectFront += getLightProbeIrradiance( lightProbe, geometry.normal );
#ifdef DOUBLE_SIDED
	vIndirectBack += getAmbientLightIrradiance( ambientLightColor );
	vIndirectBack += getLightProbeIrradiance( lightProbe, backGeometry.normal );
#endif
#if NUM_POINT_LIGHTS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		getPointLightInfo( pointLights[ i ], geometry, directLight );
		dotNL = dot( geometry.normal, directLight.direction );
		directLightColor_Diffuse = directLight.color;
		vLightFront += saturate( dotNL ) * directLightColor_Diffuse;
		#ifdef DOUBLE_SIDED
			vLightBack += saturate( - dotNL ) * directLightColor_Diffuse;
		#endif
	}
	#pragma unroll_loop_end
#endif
#if NUM_SPOT_LIGHTS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		getSpotLightInfo( spotLights[ i ], geometry, directLight );
		dotNL = dot( geometry.normal, directLight.direction );
		directLightColor_Diffuse = directLight.color;
		vLightFront += saturate( dotNL ) * directLightColor_Diffuse;
		#ifdef DOUBLE_SIDED
			vLightBack += saturate( - dotNL ) * directLightColor_Diffuse;
		#endif
	}
	#pragma unroll_loop_end
#endif
#if NUM_DIR_LIGHTS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		getDirectionalLightInfo( directionalLights[ i ], geometry, directLight );
		dotNL = dot( geometry.normal, directLight.direction );
		directLightColor_Diffuse = directLight.color;
		vLightFront += saturate( dotNL ) * directLightColor_Diffuse;
		#ifdef DOUBLE_SIDED
			vLightBack += saturate( - dotNL ) * directLightColor_Diffuse;
		#endif
	}
	#pragma unroll_loop_end
#endif
#if NUM_HEMI_LIGHTS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
		vIndirectFront += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry.normal );
		#ifdef DOUBLE_SIDED
			vIndirectBack += getHemisphereLightIrradiance( hemisphereLights[ i ], backGeometry.normal );
		#endif
	}
	#pragma unroll_loop_end
#endif`,Yp=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
uniform vec3 lightProbe[ 9 ];
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( PHYSICALLY_CORRECT_LIGHTS )
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#else
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, const in GeometricContext geometry, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in GeometricContext geometry, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometry.position;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in GeometricContext geometry, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometry.position;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Zp=`#if defined( USE_ENVMAP )
	#ifdef ENVMAP_MODE_REFRACTION
		uniform float refractionRatio;
	#endif
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#if defined( ENVMAP_TYPE_CUBE_UV )
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#if defined( ENVMAP_TYPE_CUBE_UV )
			vec3 reflectVec;
			#ifdef ENVMAP_MODE_REFLECTION
				reflectVec = reflect( - viewDir, normal );
				reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			#else
				reflectVec = refract( - viewDir, normal, refractionRatio );
			#endif
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
#endif`,jp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Jp=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in GeometricContext geometry, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometry.normal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in GeometricContext geometry, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon
#define Material_LightProbeLOD( material )	(0)`,$p=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Qp=`varying vec3 vViewPosition;
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
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometry.viewDir, geometry.normal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in GeometricContext geometry, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong
#define Material_LightProbeLOD( material )	(0)`,Kp=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( geometryNormal ) ), abs( dFdy( geometryNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	#ifdef SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULARINTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vUv ).a;
		#endif
		#ifdef USE_SPECULARCOLORMAP
			specularColorFactor *= specularColorMapTexelToLinear( texture2D( specularColorMap, vUv ) ).rgb;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( ior - 1.0 ) / ( ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEENCOLORMAP
		material.sheenColor *= sheenColorMapTexelToLinear( texture2D( sheenColorMap, vUv ) ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEENROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vUv ).a;
	#endif
#endif`,em=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
};
vec3 clearcoatSpecular = vec3( 0.0 );
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	vec3 FssEss = specularColor * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = specularColor + ( 1.0 - specularColor ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometry.normal;
		vec3 viewDir = geometry.viewDir;
		vec3 position = geometry.position;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometry.normal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometry.clearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecular += ccIrradiance * BRDF_GGX( directLight.direction, geometry.viewDir, geometry.clearcoatNormal, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		reflectedLight.directSpecular += irradiance * BRDF_Sheen( directLight.direction, geometry.viewDir, geometry.normal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometry.viewDir, geometry.normal, material.specularColor, material.specularF90, material.roughness );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecular += clearcoatRadiance * EnvironmentBRDF( geometry.clearcoatNormal, geometry.viewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	computeMultiscattering( geometry.normal, geometry.viewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	vec3 diffuse = material.diffuseColor * ( 1.0 - ( singleScattering + multiScattering ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,tm=`
GeometricContext geometry;
geometry.position = - vViewPosition;
geometry.normal = normal;
geometry.viewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
#ifdef USE_CLEARCOAT
	geometry.clearcoatNormal = clearcoatNormal;
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometry, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= all( bvec2( directLight.visible, receiveShadow ) ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometry, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometry, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= all( bvec2( directLight.visible, receiveShadow ) ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometry, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, geometry, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= all( bvec2( directLight.visible, receiveShadow ) ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometry, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometry, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	irradiance += getLightProbeIrradiance( lightProbe, geometry.normal );
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry.normal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,nm=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vUv2 );
		vec3 lightMapIrradiance = lightMapTexelToLinear( lightMapTexel ).rgb * lightMapIntensity;
		#ifndef PHYSICALLY_CORRECT_LIGHTS
			lightMapIrradiance *= PI;
		#endif
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometry.normal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	radiance += getIBLRadiance( geometry.viewDir, geometry.normal, material.roughness );
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometry.viewDir, geometry.clearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,im=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometry, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometry, material, reflectedLight );
#endif`,rm=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,sm=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,am=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,om=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,lm=`#ifdef USE_MAP
	vec4 texelColor = texture2D( map, vUv );
	texelColor = mapTexelToLinear( texelColor );
	diffuseColor *= texelColor;
#endif`,cm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,hm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
#endif
#ifdef USE_MAP
	vec4 mapTexel = texture2D( map, uv );
	diffuseColor *= mapTexelToLinear( mapTexel );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,um=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	uniform mat3 uvTransform;
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,dm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vUv );
	metalnessFactor *= texelMetalness.b;
#endif`,fm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,pm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] > 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1, 2 ) * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,mm=`#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform vec2 morphTargetsTextureSize;
		vec3 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset, const in int stride ) {
			float texelIndex = float( vertexIndex * stride + offset );
			float y = floor( texelIndex / morphTargetsTextureSize.x );
			float x = texelIndex - y * morphTargetsTextureSize.x;
			vec3 morphUV = vec3( ( x + 0.5 ) / morphTargetsTextureSize.x, y / morphTargetsTextureSize.y, morphTargetIndex );
			return texture( morphTargetsTexture, morphUV ).xyz;
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,gm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			#ifndef USE_MORPHNORMALS
				if ( morphTargetInfluences[ i ] > 0.0 ) transformed += getMorph( gl_VertexID, i, 0, 1 ) * morphTargetInfluences[ i ];
			#else
				if ( morphTargetInfluences[ i ] > 0.0 ) transformed += getMorph( gl_VertexID, i, 0, 2 ) * morphTargetInfluences[ i ];
			#endif
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,vm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = vec3( dFdx( vViewPosition.x ), dFdx( vViewPosition.y ), dFdx( vViewPosition.z ) );
	vec3 fdy = vec3( dFdy( vViewPosition.x ), dFdy( vViewPosition.y ), dFdy( vViewPosition.z ) );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	#ifdef USE_TANGENT
		vec3 tangent = normalize( vTangent );
		vec3 bitangent = normalize( vBitangent );
		#ifdef DOUBLE_SIDED
			tangent = tangent * faceDirection;
			bitangent = bitangent * faceDirection;
		#endif
		#if defined( TANGENTSPACE_NORMALMAP ) || defined( USE_CLEARCOAT_NORMALMAP )
			mat3 vTBN = mat3( tangent, bitangent, normal );
		#endif
	#endif
#endif
vec3 geometryNormal = normal;`,xm=`#ifdef OBJECTSPACE_NORMALMAP
	normal = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( TANGENTSPACE_NORMALMAP )
	vec3 mapN = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	#ifdef USE_TANGENT
		normal = normalize( vTBN * mapN );
	#else
		normal = perturbNormal2Arb( - vViewPosition, normal, mapN, faceDirection );
	#endif
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,_m=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ym=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Mm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,wm=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef OBJECTSPACE_NORMALMAP
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( TANGENTSPACE_NORMALMAP ) || defined ( USE_CLEARCOAT_NORMALMAP ) )
	vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm, vec3 mapN, float faceDirection ) {
		vec3 q0 = vec3( dFdx( eye_pos.x ), dFdx( eye_pos.y ), dFdx( eye_pos.z ) );
		vec3 q1 = vec3( dFdy( eye_pos.x ), dFdy( eye_pos.y ), dFdy( eye_pos.z ) );
		vec2 st0 = dFdx( vUv.st );
		vec2 st1 = dFdy( vUv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : faceDirection * inversesqrt( det );
		return normalize( T * ( mapN.x * scale ) + B * ( mapN.y * scale ) + N * mapN.z );
	}
#endif`,bm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = geometryNormal;
#endif`,Sm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	#ifdef USE_TANGENT
		clearcoatNormal = normalize( vTBN * clearcoatMapN );
	#else
		clearcoatNormal = perturbNormal2Arb( - vViewPosition, clearcoatNormal, clearcoatMapN, faceDirection );
	#endif
#endif`,Tm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif`,Em=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= transmissionAlpha + 0.1;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Am=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float linearClipZ, const in float near, const in float far ) {
	return linearClipZ * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float invClipZ, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * invClipZ - far );
}`,Cm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Lm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Rm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Pm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Dm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Im=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Fm=`#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		varying vec4 vSpotShadowCoord[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );
		bool inFrustum = all( inFrustumVec );
		bvec2 frustumTestVec = bvec2( inFrustum, shadowCoord.z <= 1.0 );
		bool frustumTest = all( frustumTestVec );
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ), 
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ), 
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ), 
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ), 
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ), 
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ), 
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,Nm=`#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform mat4 spotShadowMatrix[ NUM_SPOT_LIGHT_SHADOWS ];
		varying vec4 vSpotShadowCoord[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Om=`#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SPOT_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0
		vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		vec4 shadowWorldPosition;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
		vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias, 0 );
		vSpotShadowCoord[ i ] = spotShadowMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
		vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
	#endif
#endif`,Bm=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Um=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,zm=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	#ifdef BONE_TEXTURE
		uniform highp sampler2D boneTexture;
		uniform int boneTextureSize;
		mat4 getBoneMatrix( const in float i ) {
			float j = i * 4.0;
			float x = mod( j, float( boneTextureSize ) );
			float y = floor( j / float( boneTextureSize ) );
			float dx = 1.0 / float( boneTextureSize );
			float dy = 1.0 / float( boneTextureSize );
			y = dy * ( y + 0.5 );
			vec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );
			vec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );
			vec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );
			vec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );
			mat4 bone = mat4( v1, v2, v3, v4 );
			return bone;
		}
	#else
		uniform mat4 boneMatrices[ MAX_BONES ];
		mat4 getBoneMatrix( const in float i ) {
			mat4 bone = boneMatrices[ int(i) ];
			return bone;
		}
	#endif
#endif`,Vm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,km=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Hm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Gm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Wm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Xm=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return toneMappingExposure * color;
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,qm=`#ifdef USE_TRANSMISSION
	float transmissionAlpha = 1.0;
	float transmissionFactor = transmission;
	float thicknessFactor = thickness;
	#ifdef USE_TRANSMISSIONMAP
		transmissionFactor *= texture2D( transmissionMap, vUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		thicknessFactor *= texture2D( thicknessMap, vUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmission = getIBLVolumeRefraction(
		n, v, roughnessFactor, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, ior, thicknessFactor,
		attenuationColor, attenuationDistance );
	totalDiffuse = mix( totalDiffuse, transmission.rgb, transmissionFactor );
	transmissionAlpha = mix( transmissionAlpha, transmission.a, transmissionFactor );
#endif`,Ym=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	vec3 getVolumeTransmissionRay( vec3 n, vec3 v, float thickness, float ior, mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( float roughness, float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( vec2 fragCoord, float roughness, float ior ) {
		float framebufferLod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		#ifdef TEXTURE_LOD_EXT
			return texture2DLodEXT( transmissionSamplerMap, fragCoord.xy, framebufferLod );
		#else
			return texture2D( transmissionSamplerMap, fragCoord.xy, framebufferLod );
		#endif
	}
	vec3 applyVolumeAttenuation( vec3 radiance, float transmissionDistance, vec3 attenuationColor, float attenuationDistance ) {
		if ( attenuationDistance == 0.0 ) {
			return radiance;
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance * radiance;
		}
	}
	vec4 getIBLVolumeRefraction( vec3 n, vec3 v, float roughness, vec3 diffuseColor, vec3 specularColor, float specularF90,
		vec3 position, mat4 modelMatrix, mat4 viewMatrix, mat4 projMatrix, float ior, float thickness,
		vec3 attenuationColor, float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 attenuatedColor = applyVolumeAttenuation( transmittedLight.rgb, length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		return vec4( ( 1.0 - F ) * attenuatedColor * diffuseColor, transmittedLight.a );
	}
#endif`,Zm=`#if ( defined( USE_UV ) && ! defined( UVS_VERTEX_ONLY ) )
	varying vec2 vUv;
#endif`,jm=`#ifdef USE_UV
	#ifdef UVS_VERTEX_ONLY
		vec2 vUv;
	#else
		varying vec2 vUv;
	#endif
	uniform mat3 uvTransform;
#endif`,Jm=`#ifdef USE_UV
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
#endif`,$m=`#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
	varying vec2 vUv2;
#endif`,Qm=`#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
	attribute vec2 uv2;
	varying vec2 vUv2;
	uniform mat3 uv2Transform;
#endif`,Km=`#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
	vUv2 = ( uv2Transform * vec3( uv2, 1 ) ).xy;
#endif`,eg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION )
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const tg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,ng=`uniform sampler2D t2D;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	gl_FragColor = mapTexelToLinear( texColor );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
}`,ig=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,rg=`#include <envmap_common_pars_fragment>
uniform float opacity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	vec3 vReflect = vWorldDirection;
	#include <envmap_fragment>
	gl_FragColor = envColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <encodings_fragment>
}`,sg=`#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,ag=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,og=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,lg=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,cg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,hg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	vec4 texColor = texture2D( tEquirect, sampleUV );
	gl_FragColor = mapTexelToLinear( texColor );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
}`,ug=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <color_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,dg=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,fg=`#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,pg=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel= texture2D( lightMap, vUv2 );
		reflectedLight.indirectDiffuse += lightMapTexelToLinear( lightMapTexel ).rgb * lightMapIntensity;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,mg=`#define LAMBERT
varying vec3 vLightFront;
varying vec3 vIndirectFront;
#ifdef DOUBLE_SIDED
	varying vec3 vLightBack;
	varying vec3 vIndirectBack;
#endif
#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <envmap_pars_vertex>
#include <bsdfs>
#include <lights_pars_begin>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <lights_lambert_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,gg=`uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
varying vec3 vLightFront;
varying vec3 vIndirectFront;
#ifdef DOUBLE_SIDED
	varying vec3 vLightBack;
	varying vec3 vIndirectBack;
#endif
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <fog_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <specularmap_fragment>
	#include <emissivemap_fragment>
	#ifdef DOUBLE_SIDED
		reflectedLight.indirectDiffuse += ( gl_FrontFacing ) ? vIndirectFront : vIndirectBack;
	#else
		reflectedLight.indirectDiffuse += vIndirectFront;
	#endif
	#include <lightmap_fragment>
	reflectedLight.indirectDiffuse *= BRDF_Lambert( diffuseColor.rgb );
	#ifdef DOUBLE_SIDED
		reflectedLight.directDiffuse = ( gl_FrontFacing ) ? vLightFront : vLightBack;
	#else
		reflectedLight.directDiffuse = vLightFront;
	#endif
	reflectedLight.directDiffuse *= BRDF_Lambert( diffuseColor.rgb ) * getShadowMask();
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vg=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,xg=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
		matcapColor = matcapTexelToLinear( matcapColor );
	#else
		vec4 matcapColor = vec4( 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,_g=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( TANGENTSPACE_NORMALMAP )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( TANGENTSPACE_NORMALMAP )
	vViewPosition = - mvPosition.xyz;
#endif
}`,yg=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( TANGENTSPACE_NORMALMAP )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
}`,Mg=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,wg=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,bg=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Sg=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULARINTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
	#ifdef USE_SPECULARCOLORMAP
		uniform sampler2D specularColorMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEENCOLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEENROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <bsdfs>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometry.clearcoatNormal, geometry.viewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + clearcoatSpecular * material.clearcoat;
	#endif
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Tg=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Eg=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ag=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <color_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Cg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Lg=`#include <common>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Rg=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
}`,Pg=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Dg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
}`,ke={alphamap_fragment:op,alphamap_pars_fragment:lp,alphatest_fragment:cp,alphatest_pars_fragment:hp,aomap_fragment:up,aomap_pars_fragment:dp,begin_vertex:fp,beginnormal_vertex:pp,bsdfs:mp,bumpmap_pars_fragment:gp,clipping_planes_fragment:vp,clipping_planes_pars_fragment:xp,clipping_planes_pars_vertex:_p,clipping_planes_vertex:yp,color_fragment:Mp,color_pars_fragment:wp,color_pars_vertex:bp,color_vertex:Sp,common:Tp,cube_uv_reflection_fragment:Ep,defaultnormal_vertex:Ap,displacementmap_pars_vertex:Cp,displacementmap_vertex:Lp,emissivemap_fragment:Rp,emissivemap_pars_fragment:Pp,encodings_fragment:Dp,encodings_pars_fragment:Ip,envmap_fragment:Fp,envmap_common_pars_fragment:Np,envmap_pars_fragment:Op,envmap_pars_vertex:Bp,envmap_physical_pars_fragment:Zp,envmap_vertex:Up,fog_vertex:zp,fog_pars_vertex:Vp,fog_fragment:kp,fog_pars_fragment:Hp,gradientmap_pars_fragment:Gp,lightmap_fragment:Wp,lightmap_pars_fragment:Xp,lights_lambert_vertex:qp,lights_pars_begin:Yp,lights_toon_fragment:jp,lights_toon_pars_fragment:Jp,lights_phong_fragment:$p,lights_phong_pars_fragment:Qp,lights_physical_fragment:Kp,lights_physical_pars_fragment:em,lights_fragment_begin:tm,lights_fragment_maps:nm,lights_fragment_end:im,logdepthbuf_fragment:rm,logdepthbuf_pars_fragment:sm,logdepthbuf_pars_vertex:am,logdepthbuf_vertex:om,map_fragment:lm,map_pars_fragment:cm,map_particle_fragment:hm,map_particle_pars_fragment:um,metalnessmap_fragment:dm,metalnessmap_pars_fragment:fm,morphnormal_vertex:pm,morphtarget_pars_vertex:mm,morphtarget_vertex:gm,normal_fragment_begin:vm,normal_fragment_maps:xm,normal_pars_fragment:_m,normal_pars_vertex:ym,normal_vertex:Mm,normalmap_pars_fragment:wm,clearcoat_normal_fragment_begin:bm,clearcoat_normal_fragment_maps:Sm,clearcoat_pars_fragment:Tm,output_fragment:Em,packing:Am,premultiplied_alpha_fragment:Cm,project_vertex:Lm,dithering_fragment:Rm,dithering_pars_fragment:Pm,roughnessmap_fragment:Dm,roughnessmap_pars_fragment:Im,shadowmap_pars_fragment:Fm,shadowmap_pars_vertex:Nm,shadowmap_vertex:Om,shadowmask_pars_fragment:Bm,skinbase_vertex:Um,skinning_pars_vertex:zm,skinning_vertex:Vm,skinnormal_vertex:km,specularmap_fragment:Hm,specularmap_pars_fragment:Gm,tonemapping_fragment:Wm,tonemapping_pars_fragment:Xm,transmission_fragment:qm,transmission_pars_fragment:Ym,uv_pars_fragment:Zm,uv_pars_vertex:jm,uv_vertex:Jm,uv2_pars_fragment:$m,uv2_pars_vertex:Qm,uv2_vertex:Km,worldpos_vertex:eg,background_vert:tg,background_frag:ng,cube_vert:ig,cube_frag:rg,depth_vert:sg,depth_frag:ag,distanceRGBA_vert:og,distanceRGBA_frag:lg,equirect_vert:cg,equirect_frag:hg,linedashed_vert:ug,linedashed_frag:dg,meshbasic_vert:fg,meshbasic_frag:pg,meshlambert_vert:mg,meshlambert_frag:gg,meshmatcap_vert:vg,meshmatcap_frag:xg,meshnormal_vert:_g,meshnormal_frag:yg,meshphong_vert:Mg,meshphong_frag:wg,meshphysical_vert:bg,meshphysical_frag:Sg,meshtoon_vert:Tg,meshtoon_frag:Eg,points_vert:Ag,points_frag:Cg,shadow_vert:Lg,shadow_frag:Rg,sprite_vert:Pg,sprite_frag:Dg},he={common:{diffuse:{value:new be(16777215)},opacity:{value:1},map:{value:null},uvTransform:{value:new Tt},uv2Transform:{value:new Tt},alphaMap:{value:null},alphaTest:{value:0}},specularmap:{specularMap:{value:null}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1}},emissivemap:{emissiveMap:{value:null}},bumpmap:{bumpMap:{value:null},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalScale:{value:new ee(1,1)}},displacementmap:{displacementMap:{value:null},displacementScale:{value:1},displacementBias:{value:0}},roughnessmap:{roughnessMap:{value:null}},metalnessmap:{metalnessMap:{value:null}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new be(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotShadowMap:{value:[]},spotShadowMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new be(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaTest:{value:0},uvTransform:{value:new Tt}},sprite:{diffuse:{value:new be(16777215)},opacity:{value:1},center:{value:new ee(.5,.5)},rotation:{value:0},map:{value:null},alphaMap:{value:null},alphaTest:{value:0},uvTransform:{value:new Tt}}},vn={basic:{uniforms:Pt([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.fog]),vertexShader:ke.meshbasic_vert,fragmentShader:ke.meshbasic_frag},lambert:{uniforms:Pt([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.fog,he.lights,{emissive:{value:new be(0)}}]),vertexShader:ke.meshlambert_vert,fragmentShader:ke.meshlambert_frag},phong:{uniforms:Pt([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.fog,he.lights,{emissive:{value:new be(0)},specular:{value:new be(1118481)},shininess:{value:30}}]),vertexShader:ke.meshphong_vert,fragmentShader:ke.meshphong_frag},standard:{uniforms:Pt([he.common,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.roughnessmap,he.metalnessmap,he.fog,he.lights,{emissive:{value:new be(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ke.meshphysical_vert,fragmentShader:ke.meshphysical_frag},toon:{uniforms:Pt([he.common,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.gradientmap,he.fog,he.lights,{emissive:{value:new be(0)}}]),vertexShader:ke.meshtoon_vert,fragmentShader:ke.meshtoon_frag},matcap:{uniforms:Pt([he.common,he.bumpmap,he.normalmap,he.displacementmap,he.fog,{matcap:{value:null}}]),vertexShader:ke.meshmatcap_vert,fragmentShader:ke.meshmatcap_frag},points:{uniforms:Pt([he.points,he.fog]),vertexShader:ke.points_vert,fragmentShader:ke.points_frag},dashed:{uniforms:Pt([he.common,he.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ke.linedashed_vert,fragmentShader:ke.linedashed_frag},depth:{uniforms:Pt([he.common,he.displacementmap]),vertexShader:ke.depth_vert,fragmentShader:ke.depth_frag},normal:{uniforms:Pt([he.common,he.bumpmap,he.normalmap,he.displacementmap,{opacity:{value:1}}]),vertexShader:ke.meshnormal_vert,fragmentShader:ke.meshnormal_frag},sprite:{uniforms:Pt([he.sprite,he.fog]),vertexShader:ke.sprite_vert,fragmentShader:ke.sprite_frag},background:{uniforms:{uvTransform:{value:new Tt},t2D:{value:null}},vertexShader:ke.background_vert,fragmentShader:ke.background_frag},cube:{uniforms:Pt([he.envmap,{opacity:{value:1}}]),vertexShader:ke.cube_vert,fragmentShader:ke.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ke.equirect_vert,fragmentShader:ke.equirect_frag},distanceRGBA:{uniforms:Pt([he.common,he.displacementmap,{referencePosition:{value:new C},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ke.distanceRGBA_vert,fragmentShader:ke.distanceRGBA_frag},shadow:{uniforms:Pt([he.lights,he.fog,{color:{value:new be(0)},opacity:{value:1}}]),vertexShader:ke.shadow_vert,fragmentShader:ke.shadow_frag}};vn.physical={uniforms:Pt([vn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatNormalScale:{value:new ee(1,1)},clearcoatNormalMap:{value:null},sheen:{value:0},sheenColor:{value:new be(0)},sheenColorMap:{value:null},sheenRoughness:{value:0},sheenRoughnessMap:{value:null},transmission:{value:0},transmissionMap:{value:null},transmissionSamplerSize:{value:new ee},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},attenuationDistance:{value:0},attenuationColor:{value:new be(0)},specularIntensity:{value:0},specularIntensityMap:{value:null},specularColor:{value:new be(1,1,1)},specularColorMap:{value:null}}]),vertexShader:ke.meshphysical_vert,fragmentShader:ke.meshphysical_frag};function Ig(r,e,t,n,i){const s=new be(0);let a=0,o,l,c=null,h=0,u=null;function d(g,v){let w=!1,m=v.isScene===!0?v.background:null;m&&m.isTexture&&(m=e.get(m));const p=r.xr,b=p.getSession&&p.getSession();b&&b.environmentBlendMode==="additive"&&(m=null),m===null?f(s,a):m&&m.isColor&&(f(m,1),w=!0),(r.autoClear||w)&&r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil),m&&(m.isCubeTexture||m.mapping===cs)?(l===void 0&&(l=new Rt(new Ui(1,1,1),new gn({name:"BackgroundCubeMaterial",uniforms:zi(vn.cube.uniforms),vertexShader:vn.cube.vertexShader,fragmentShader:vn.cube.fragmentShader,side:lt,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(M,E,D){this.matrixWorld.copyPosition(D.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(l)),l.material.uniforms.envMap.value=m,l.material.uniforms.flipEnvMap.value=m.isCubeTexture&&m.isRenderTargetTexture===!1?-1:1,(c!==m||h!==m.version||u!==r.toneMapping)&&(l.material.needsUpdate=!0,c=m,h=m.version,u=r.toneMapping),g.unshift(l,l.geometry,l.material,0,0,null)):m&&m.isTexture&&(o===void 0&&(o=new Rt(new xo(2,2),new gn({name:"BackgroundMaterial",uniforms:zi(vn.background.uniforms),vertexShader:vn.background.vertexShader,fragmentShader:vn.background.fragmentShader,side:_i,depthTest:!1,depthWrite:!1,fog:!1})),o.geometry.deleteAttribute("normal"),Object.defineProperty(o.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(o)),o.material.uniforms.t2D.value=m,m.matrixAutoUpdate===!0&&m.updateMatrix(),o.material.uniforms.uvTransform.value.copy(m.matrix),(c!==m||h!==m.version||u!==r.toneMapping)&&(o.material.needsUpdate=!0,c=m,h=m.version,u=r.toneMapping),g.unshift(o,o.geometry,o.material,0,0,null))}function f(g,v){t.buffers.color.setClear(g.r,g.g,g.b,v,i)}return{getClearColor:function(){return s},setClearColor:function(g,v=1){s.set(g),a=v,f(s,a)},getClearAlpha:function(){return a},setClearAlpha:function(g){a=g,f(s,a)},render:d}}function Fg(r,e,t,n){const i=r.getParameter(34921),s=n.isWebGL2?null:e.get("OES_vertex_array_object"),a=n.isWebGL2||s!==null,o={},l=v(null);let c=l;function h(U,N,H,V,W){let ae=!1;if(a){const me=g(V,H,N);c!==me&&(c=me,d(c.object)),ae=w(V,W),ae&&m(V,W)}else{const me=N.wireframe===!0;(c.geometry!==V.id||c.program!==H.id||c.wireframe!==me)&&(c.geometry=V.id,c.program=H.id,c.wireframe=me,ae=!0)}U.isInstancedMesh===!0&&(ae=!0),W!==null&&t.update(W,34963),ae&&(_(U,N,H,V),W!==null&&r.bindBuffer(34963,t.get(W).buffer))}function u(){return n.isWebGL2?r.createVertexArray():s.createVertexArrayOES()}function d(U){return n.isWebGL2?r.bindVertexArray(U):s.bindVertexArrayOES(U)}function f(U){return n.isWebGL2?r.deleteVertexArray(U):s.deleteVertexArrayOES(U)}function g(U,N,H){const V=H.wireframe===!0;let W=o[U.id];W===void 0&&(W={},o[U.id]=W);let ae=W[N.id];ae===void 0&&(ae={},W[N.id]=ae);let me=ae[V];return me===void 0&&(me=v(u()),ae[V]=me),me}function v(U){const N=[],H=[],V=[];for(let W=0;W<i;W++)N[W]=0,H[W]=0,V[W]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:N,enabledAttributes:H,attributeDivisors:V,object:U,attributes:{},index:null}}function w(U,N){const H=c.attributes,V=U.attributes;let W=0;for(const ae in V){const me=H[ae],q=V[ae];if(me===void 0||me.attribute!==q||me.data!==q.data)return!0;W++}return c.attributesNum!==W||c.index!==N}function m(U,N){const H={},V=U.attributes;let W=0;for(const ae in V){const me=V[ae],q={};q.attribute=me,me.data&&(q.data=me.data),H[ae]=q,W++}c.attributes=H,c.attributesNum=W,c.index=N}function p(){const U=c.newAttributes;for(let N=0,H=U.length;N<H;N++)U[N]=0}function b(U){M(U,0)}function M(U,N){const H=c.newAttributes,V=c.enabledAttributes,W=c.attributeDivisors;H[U]=1,V[U]===0&&(r.enableVertexAttribArray(U),V[U]=1),W[U]!==N&&((n.isWebGL2?r:e.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](U,N),W[U]=N)}function E(){const U=c.newAttributes,N=c.enabledAttributes;for(let H=0,V=N.length;H<V;H++)N[H]!==U[H]&&(r.disableVertexAttribArray(H),N[H]=0)}function D(U,N,H,V,W,ae){n.isWebGL2===!0&&(H===5124||H===5125)?r.vertexAttribIPointer(U,N,H,W,ae):r.vertexAttribPointer(U,N,H,V,W,ae)}function _(U,N,H,V){if(n.isWebGL2===!1&&(U.isInstancedMesh||V.isInstancedBufferGeometry)&&e.get("ANGLE_instanced_arrays")===null)return;p();const W=V.attributes,ae=H.getAttributes(),me=N.defaultAttributeValues;for(const q in ae){const Y=ae[q];if(Y.location>=0){let de=W[q];if(de===void 0&&(q==="instanceMatrix"&&U.instanceMatrix&&(de=U.instanceMatrix),q==="instanceColor"&&U.instanceColor&&(de=U.instanceColor)),de!==void 0){const ue=de.normalized,xe=de.itemSize,Xe=t.get(de);if(Xe===void 0)continue;const Q=Xe.buffer,Se=Xe.type,Te=Xe.bytesPerElement;if(de.isInterleavedBufferAttribute){const oe=de.data,ge=oe.stride,Ue=de.offset;if(oe&&oe.isInstancedInterleavedBuffer){for(let X=0;X<Y.locationSize;X++)M(Y.location+X,oe.meshPerAttribute);U.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=oe.meshPerAttribute*oe.count)}else for(let X=0;X<Y.locationSize;X++)b(Y.location+X);r.bindBuffer(34962,Q);for(let X=0;X<Y.locationSize;X++)D(Y.location+X,xe/Y.locationSize,Se,ue,ge*Te,(Ue+xe/Y.locationSize*X)*Te)}else{if(de.isInstancedBufferAttribute){for(let oe=0;oe<Y.locationSize;oe++)M(Y.location+oe,de.meshPerAttribute);U.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=de.meshPerAttribute*de.count)}else for(let oe=0;oe<Y.locationSize;oe++)b(Y.location+oe);r.bindBuffer(34962,Q);for(let oe=0;oe<Y.locationSize;oe++)D(Y.location+oe,xe/Y.locationSize,Se,ue,xe*Te,xe/Y.locationSize*oe*Te)}}else if(me!==void 0){const ue=me[q];if(ue!==void 0)switch(ue.length){case 2:r.vertexAttrib2fv(Y.location,ue);break;case 3:r.vertexAttrib3fv(Y.location,ue);break;case 4:r.vertexAttrib4fv(Y.location,ue);break;default:r.vertexAttrib1fv(Y.location,ue)}}}}E()}function R(){P();for(const U in o){const N=o[U];for(const H in N){const V=N[H];for(const W in V)f(V[W].object),delete V[W];delete N[H]}delete o[U]}}function F(U){if(o[U.id]===void 0)return;const N=o[U.id];for(const H in N){const V=N[H];for(const W in V)f(V[W].object),delete V[W];delete N[H]}delete o[U.id]}function z(U){for(const N in o){const H=o[N];if(H[U.id]===void 0)continue;const V=H[U.id];for(const W in V)f(V[W].object),delete V[W];delete H[U.id]}}function P(){ne(),c!==l&&(c=l,d(c.object))}function ne(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:h,reset:P,resetDefaultState:ne,dispose:R,releaseStatesOfGeometry:F,releaseStatesOfProgram:z,initAttributes:p,enableAttribute:b,disableUnusedAttributes:E}}function Ng(r,e,t,n){const i=n.isWebGL2;let s;function a(c){s=c}function o(c,h){r.drawArrays(s,c,h),t.update(h,s,1)}function l(c,h,u){if(u===0)return;let d,f;if(i)d=r,f="drawArraysInstanced";else if(d=e.get("ANGLE_instanced_arrays"),f="drawArraysInstancedANGLE",d===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}d[f](s,c,h,u),t.update(h,s,u)}this.setMode=a,this.render=o,this.renderInstances=l}function Og(r,e,t){let n;function i(){if(n!==void 0)return n;if(e.has("EXT_texture_filter_anisotropic")===!0){const _=e.get("EXT_texture_filter_anisotropic");n=r.getParameter(_.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function s(_){if(_==="highp"){if(r.getShaderPrecisionFormat(35633,36338).precision>0&&r.getShaderPrecisionFormat(35632,36338).precision>0)return"highp";_="mediump"}return _==="mediump"&&r.getShaderPrecisionFormat(35633,36337).precision>0&&r.getShaderPrecisionFormat(35632,36337).precision>0?"mediump":"lowp"}const a=typeof WebGL2RenderingContext!="undefined"&&r instanceof WebGL2RenderingContext||typeof WebGL2ComputeRenderingContext!="undefined"&&r instanceof WebGL2ComputeRenderingContext;let o=t.precision!==void 0?t.precision:"highp";const l=s(o);l!==o&&(console.warn("THREE.WebGLRenderer:",o,"not supported, using",l,"instead."),o=l);const c=a||e.has("WEBGL_draw_buffers"),h=t.logarithmicDepthBuffer===!0,u=r.getParameter(34930),d=r.getParameter(35660),f=r.getParameter(3379),g=r.getParameter(34076),v=r.getParameter(34921),w=r.getParameter(36347),m=r.getParameter(36348),p=r.getParameter(36349),b=d>0,M=a||e.has("OES_texture_float"),E=b&&M,D=a?r.getParameter(36183):0;return{isWebGL2:a,drawBuffers:c,getMaxAnisotropy:i,getMaxPrecision:s,precision:o,logarithmicDepthBuffer:h,maxTextures:u,maxVertexTextures:d,maxTextureSize:f,maxCubemapSize:g,maxAttributes:v,maxVertexUniforms:w,maxVaryings:m,maxFragmentUniforms:p,vertexTextures:b,floatFragmentTextures:M,floatVertexTextures:E,maxSamples:D}}function Bg(r){const e=this;let t=null,n=0,i=!1,s=!1;const a=new Pn,o=new Tt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d,f){const g=u.length!==0||d||n!==0||i;return i=d,t=h(u,f,0),n=u.length,g},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1,c()},this.setState=function(u,d,f){const g=u.clippingPlanes,v=u.clipIntersection,w=u.clipShadows,m=r.get(u);if(!i||g===null||g.length===0||s&&!w)s?h(null):c();else{const p=s?0:n,b=p*4;let M=m.clippingState||null;l.value=M,M=h(g,d,b,f);for(let E=0;E!==b;++E)M[E]=t[E];m.clippingState=M,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=p}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,f,g){const v=u!==null?u.length:0;let w=null;if(v!==0){if(w=l.value,g!==!0||w===null){const m=f+v*4,p=d.matrixWorldInverse;o.getNormalMatrix(p),(w===null||w.length<m)&&(w=new Float32Array(m));for(let b=0,M=f;b!==v;++b,M+=4)a.copy(u[b]).applyMatrix4(p,o),a.normal.toArray(w,M),w[M+3]=a.constant}l.value=w,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,w}}function Ug(r){let e=new WeakMap;function t(a,o){return o===Fa?a.mapping=mr:o===Na&&(a.mapping=gr),a}function n(a){if(a&&a.isTexture&&a.isRenderTargetTexture===!1){const o=a.mapping;if(o===Fa||o===Na)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=r.getRenderTarget(),h=new Ac(l.height/2);return h.fromEquirectangularTexture(r,a),e.set(a,h),r.setRenderTarget(c),a.addEventListener("dispose",i),t(h.texture,a.mapping)}else return null}}return a}function i(a){const o=a.target;o.removeEventListener("dispose",i);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function s(){e=new WeakMap}return{get:n,dispose:s}}class _o extends Fs{constructor(e=-1,t=1,n=1,i=-1,s=.1,a=2e3){super();this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let s=n-e,a=n+e,o=i+t,l=i-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}_o.prototype.isOrthographicCamera=!0;class Us extends gn{constructor(e){super(e);this.type="RawShaderMaterial"}}Us.prototype.isRawShaderMaterial=!0;const Gi=4,Wn=8,xn=Math.pow(2,Wn),Lc=[.125,.215,.35,.446,.526,.582],Rc=Wn-Gi+1+Lc.length,Wi=20,ci={[kt]:0,[ps]:1,[Ha]:2,[ic]:3,[rc]:4,[sc]:5,[ka]:6},yo=new _o,{_lodPlanes:Cr,_sizeLods:Pc,_sigmas:zs}=kg(),Dc=new be;let Mo=null;const hi=(1+Math.sqrt(5))/2,Xi=1/hi,Ic=[new C(1,1,1),new C(-1,1,1),new C(1,1,-1),new C(-1,1,-1),new C(0,hi,Xi),new C(0,hi,-Xi),new C(Xi,0,hi),new C(-Xi,0,hi),new C(hi,Xi,0),new C(-hi,Xi,0)];class zg{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._blurMaterial=Hg(Wi),this._equirectShader=null,this._cubemapShader=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100){Mo=this._renderer.getRenderTarget();const s=this._allocateTargets();return this._sceneToCubeUV(e,n,i,s),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e){return this._fromTexture(e)}fromCubemap(e){return this._fromTexture(e)}compileCubemapShader(){this._cubemapShader===null&&(this._cubemapShader=Oc(),this._compileMaterial(this._cubemapShader))}compileEquirectangularShader(){this._equirectShader===null&&(this._equirectShader=Nc(),this._compileMaterial(this._equirectShader))}dispose(){this._blurMaterial.dispose(),this._cubemapShader!==null&&this._cubemapShader.dispose(),this._equirectShader!==null&&this._equirectShader.dispose();for(let e=0;e<Cr.length;e++)Cr[e].dispose()}_cleanup(e){this._pingPongRenderTarget.dispose(),this._renderer.setRenderTarget(Mo),e.scissorTest=!1,Vs(e,0,0,e.width,e.height)}_fromTexture(e){Mo=this._renderer.getRenderTarget();const t=this._allocateTargets(e);return this._textureToCubeUV(e,t),this._applyPMREM(t),this._cleanup(t),t}_allocateTargets(e){const t={magFilter:_t,minFilter:_t,generateMipmaps:!1,type:nn,format:Ud,encoding:Vg(e)?e.encoding:Ha,depthBuffer:!1},n=Fc(t);return n.depthBuffer=!e,this._pingPongRenderTarget=Fc(t),n}_compileMaterial(e){const t=new Rt(Cr[0],e);this._renderer.compile(t,yo)}_sceneToCubeUV(e,t,n,i){const s=90,a=1,o=new Bt(s,a,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.outputEncoding,f=h.toneMapping;h.getClearColor(Dc),h.toneMapping=ni,h.outputEncoding=kt,h.autoClear=!1;const g=new lo({name:"PMREM.Background",side:lt,depthWrite:!1,depthTest:!1}),v=new Rt(new Ui,g);let w=!1;const m=e.background;m?m.isColor&&(g.color.copy(m),e.background=null,w=!0):(g.color.copy(Dc),w=!0);for(let p=0;p<6;p++){const b=p%3;b==0?(o.up.set(0,l[p],0),o.lookAt(c[p],0,0)):b==1?(o.up.set(0,0,l[p]),o.lookAt(0,c[p],0)):(o.up.set(0,l[p],0),o.lookAt(0,0,c[p])),Vs(i,b*xn,p>2?xn:0,xn,xn),h.setRenderTarget(i),w&&h.render(v,o),h.render(e,o)}v.geometry.dispose(),v.material.dispose(),h.toneMapping=f,h.outputEncoding=d,h.autoClear=u,e.background=m}_setEncoding(e,t){e.value=ci[t.encoding]}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===mr||e.mapping===gr;i?this._cubemapShader==null&&(this._cubemapShader=Oc()):this._equirectShader==null&&(this._equirectShader=Nc());const s=i?this._cubemapShader:this._equirectShader,a=new Rt(Cr[0],s),o=s.uniforms;o.envMap.value=e,i||o.texelSize.value.set(1/e.image.width,1/e.image.height),this._setEncoding(o.inputEncoding,e),this._setEncoding(o.outputEncoding,t.texture),Vs(t,0,0,3*xn,2*xn),n.setRenderTarget(t),n.render(a,yo)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;for(let i=1;i<Rc;i++){const s=Math.sqrt(zs[i]*zs[i]-zs[i-1]*zs[i-1]),a=Ic[(i-1)%Ic.length];this._blur(e,i-1,i,s,a)}t.autoClear=n}_blur(e,t,n,i,s){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,i,"latitudinal",s),this._halfBlur(a,e,n,n,i,"longitudinal",s)}_halfBlur(e,t,n,i,s,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new Rt(Cr[i],c),d=c.uniforms,f=Pc[n]-1,g=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*Wi-1),v=s/g,w=isFinite(s)?1+Math.floor(h*v):Wi;w>Wi&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${w} samples when the maximum is set to ${Wi}`);const m=[];let p=0;for(let D=0;D<Wi;++D){const _=D/v,R=Math.exp(-_*_/2);m.push(R),D==0?p+=R:D<w&&(p+=2*R)}for(let D=0;D<m.length;D++)m[D]=m[D]/p;d.envMap.value=e.texture,d.samples.value=w,d.weights.value=m,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o),d.dTheta.value=g,d.mipInt.value=Wn-n,this._setEncoding(d.inputEncoding,e.texture),this._setEncoding(d.outputEncoding,e.texture);const b=Pc[i],M=3*Math.max(0,xn-2*b),E=(i===0?0:2*xn)+2*b*(i>Wn-Gi?i-Wn+Gi:0);Vs(t,M,E,3*b,2*b),l.setRenderTarget(t),l.render(u,yo)}}function Vg(r){return r===void 0||r.type!==nn?!1:r.encoding===kt||r.encoding===ps||r.encoding===ka}function kg(){const r=[],e=[],t=[];let n=Wn;for(let i=0;i<Rc;i++){const s=Math.pow(2,n);e.push(s);let a=1/s;i>Wn-Gi?a=Lc[i-Wn+Gi-1]:i==0&&(a=0),t.push(a);const o=1/(s-1),l=-o/2,c=1+o/2,h=[l,l,c,l,c,c,l,l,c,c,l,c],u=6,d=6,f=3,g=2,v=1,w=new Float32Array(f*d*u),m=new Float32Array(g*d*u),p=new Float32Array(v*d*u);for(let M=0;M<u;M++){const E=M%3*2/3-1,D=M>2?0:-1,_=[E,D,0,E+2/3,D,0,E+2/3,D+1,0,E,D,0,E+2/3,D+1,0,E,D+1,0];w.set(_,f*d*M),m.set(h,g*d*M);const R=[M,M,M,M,M,M];p.set(R,v*d*M)}const b=new st;b.setAttribute("position",new ut(w,f)),b.setAttribute("uv",new ut(m,g)),b.setAttribute("faceIndex",new ut(p,v)),r.push(b),n>Gi&&n--}return{_lodPlanes:r,_sizeLods:e,_sigmas:t}}function Fc(r){const e=new Yt(3*xn,3*xn,r);return e.texture.mapping=cs,e.texture.name="PMREM.cubeUv",e.scissorTest=!0,e}function Vs(r,e,t,n,i){r.viewport.set(e,t,n,i),r.scissor.set(e,t,n,i)}function Hg(r){const e=new Float32Array(r),t=new C(0,1,0);return new Us({name:"SphericalGaussianBlur",defines:{n:r},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:e},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:t},inputEncoding:{value:ci[kt]},outputEncoding:{value:ci[kt]}},vertexShader:wo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			${bo()}

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

				gl_FragColor = linearToOutputTexel( gl_FragColor );

			}
		`,blending:mn,depthTest:!1,depthWrite:!1})}function Nc(){const r=new ee(1,1);return new Us({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null},texelSize:{value:r},inputEncoding:{value:ci[kt]},outputEncoding:{value:ci[kt]}},vertexShader:wo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform vec2 texelSize;

			${bo()}

			#include <common>

			void main() {

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				vec2 f = fract( uv / texelSize - 0.5 );
				uv -= f * texelSize;
				vec3 tl = envMapTexelToLinear( texture2D ( envMap, uv ) ).rgb;
				uv.x += texelSize.x;
				vec3 tr = envMapTexelToLinear( texture2D ( envMap, uv ) ).rgb;
				uv.y += texelSize.y;
				vec3 br = envMapTexelToLinear( texture2D ( envMap, uv ) ).rgb;
				uv.x -= texelSize.x;
				vec3 bl = envMapTexelToLinear( texture2D ( envMap, uv ) ).rgb;

				vec3 tm = mix( tl, tr, f.x );
				vec3 bm = mix( bl, br, f.x );
				gl_FragColor.rgb = mix( tm, bm, f.y );

				gl_FragColor = linearToOutputTexel( gl_FragColor );

			}
		`,blending:mn,depthTest:!1,depthWrite:!1})}function Oc(){return new Us({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},inputEncoding:{value:ci[kt]},outputEncoding:{value:ci[kt]}},vertexShader:wo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			${bo()}

			void main() {

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb = envMapTexelToLinear( textureCube( envMap, vec3( - vOutputDirection.x, vOutputDirection.yz ) ) ).rgb;
				gl_FragColor = linearToOutputTexel( gl_FragColor );

			}
		`,blending:mn,depthTest:!1,depthWrite:!1})}function wo(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 position;
		attribute vec2 uv;
		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function bo(){return`

		uniform int inputEncoding;
		uniform int outputEncoding;

		#include <encodings_pars_fragment>

		vec4 inputTexelToLinear( vec4 value ) {

			if ( inputEncoding == 0 ) {

				return value;

			} else if ( inputEncoding == 1 ) {

				return sRGBToLinear( value );

			} else if ( inputEncoding == 2 ) {

				return RGBEToLinear( value );

			} else if ( inputEncoding == 3 ) {

				return RGBMToLinear( value, 7.0 );

			} else if ( inputEncoding == 4 ) {

				return RGBMToLinear( value, 16.0 );

			} else if ( inputEncoding == 5 ) {

				return RGBDToLinear( value, 256.0 );

			} else {

				return GammaToLinear( value, 2.2 );

			}

		}

		vec4 linearToOutputTexel( vec4 value ) {

			if ( outputEncoding == 0 ) {

				return value;

			} else if ( outputEncoding == 1 ) {

				return LinearTosRGB( value );

			} else if ( outputEncoding == 2 ) {

				return LinearToRGBE( value );

			} else if ( outputEncoding == 3 ) {

				return LinearToRGBM( value, 7.0 );

			} else if ( outputEncoding == 4 ) {

				return LinearToRGBM( value, 16.0 );

			} else if ( outputEncoding == 5 ) {

				return LinearToRGBD( value, 256.0 );

			} else {

				return LinearToGamma( value, 2.2 );

			}

		}

		vec4 envMapTexelToLinear( vec4 color ) {

			return inputTexelToLinear( color );

		}
	`}function Gg(r){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture&&o.isRenderTargetTexture===!1){const l=o.mapping,c=l===Fa||l===Na,h=l===mr||l===gr;if(c||h){if(e.has(o))return e.get(o).texture;{const u=o.image;if(c&&u&&u.height>0||h&&u&&i(u)){const d=r.getRenderTarget();t===null&&(t=new zg(r));const f=c?t.fromEquirectangular(o):t.fromCubemap(o);return e.set(o,f),r.setRenderTarget(d),o.addEventListener("dispose",s),f.texture}else return null}}}return o}function i(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function s(o){const l=o.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function Wg(r){const e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=r.getExtension("WEBGL_depth_texture")||r.getExtension("MOZ_WEBGL_depth_texture")||r.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=r.getExtension("EXT_texture_filter_anisotropic")||r.getExtension("MOZ_EXT_texture_filter_anisotropic")||r.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=r.getExtension("WEBGL_compressed_texture_s3tc")||r.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=r.getExtension("WEBGL_compressed_texture_pvrtc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=r.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(n){n.isWebGL2?t("EXT_color_buffer_float"):(t("WEBGL_depth_texture"),t("OES_texture_float"),t("OES_texture_half_float"),t("OES_texture_half_float_linear"),t("OES_standard_derivatives"),t("OES_element_index_uint"),t("OES_vertex_array_object"),t("ANGLE_instanced_arrays")),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture")},get:function(n){const i=t(n);return i===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function Xg(r,e,t,n){const i={},s=new WeakMap;function a(u){const d=u.target;d.index!==null&&e.remove(d.index);for(const g in d.attributes)e.remove(d.attributes[g]);d.removeEventListener("dispose",a),delete i[d.id];const f=s.get(d);f&&(e.remove(f),s.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(u,d){return i[d.id]===!0||(d.addEventListener("dispose",a),i[d.id]=!0,t.memory.geometries++),d}function l(u){const d=u.attributes;for(const g in d)e.update(d[g],34962);const f=u.morphAttributes;for(const g in f){const v=f[g];for(let w=0,m=v.length;w<m;w++)e.update(v[w],34962)}}function c(u){const d=[],f=u.index,g=u.attributes.position;let v=0;if(f!==null){const p=f.array;v=f.version;for(let b=0,M=p.length;b<M;b+=3){const E=p[b+0],D=p[b+1],_=p[b+2];d.push(E,D,D,_,_,E)}}else{const p=g.array;v=g.version;for(let b=0,M=p.length/3-1;b<M;b+=3){const E=b+0,D=b+1,_=b+2;d.push(E,D,D,_,_,E)}}const w=new(cc(d)>65535?Sc:bc)(d,1);w.version=v;const m=s.get(u);m&&e.remove(m),s.set(u,w)}function h(u){const d=s.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return s.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function qg(r,e,t,n){const i=n.isWebGL2;let s;function a(d){s=d}let o,l;function c(d){o=d.type,l=d.bytesPerElement}function h(d,f){r.drawElements(s,f,o,d*l),t.update(f,s,1)}function u(d,f,g){if(g===0)return;let v,w;if(i)v=r,w="drawElementsInstanced";else if(v=e.get("ANGLE_instanced_arrays"),w="drawElementsInstancedANGLE",v===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}v[w](s,f,o,d*l,g),t.update(f,s,g)}this.setMode=a,this.setIndex=c,this.render=h,this.renderInstances=u}function Yg(r){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,a,o){switch(t.calls++,a){case 4:t.triangles+=o*(s/3);break;case 1:t.lines+=o*(s/2);break;case 3:t.lines+=o*(s-1);break;case 2:t.lines+=o*s;break;case 0:t.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function i(){t.frame++,t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}class So extends Et{constructor(e=null,t=1,n=1,i=1){super(null);this.image={data:e,width:t,height:n,depth:i},this.magFilter=_t,this.minFilter=_t,this.wrapR=qt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.needsUpdate=!0}}So.prototype.isDataTexture2DArray=!0;function Zg(r,e){return r[0]-e[0]}function jg(r,e){return Math.abs(e[1])-Math.abs(r[1])}function Bc(r,e){let t=1;const n=e.isInterleavedBufferAttribute?e.data.array:e.array;n instanceof Int8Array?t=127:n instanceof Int16Array?t=32767:n instanceof Int32Array?t=2147483647:console.error("THREE.WebGLMorphtargets: Unsupported morph attribute data type: ",n),r.divideScalar(t)}function Jg(r,e,t){const n={},i=new Float32Array(8),s=new WeakMap,a=new C,o=[];for(let c=0;c<8;c++)o[c]=[c,0];function l(c,h,u,d){const f=c.morphTargetInfluences;if(e.isWebGL2===!0){const g=h.morphAttributes.position.length;let v=s.get(h);if(v===void 0||v.count!==g){v!==void 0&&v.texture.dispose();const p=h.morphAttributes.normal!==void 0,b=h.morphAttributes.position,M=h.morphAttributes.normal||[],E=h.attributes.position.count,D=p===!0?2:1;let _=E*D,R=1;_>e.maxTextureSize&&(R=Math.ceil(_/e.maxTextureSize),_=e.maxTextureSize);const F=new Float32Array(_*R*4*g),z=new So(F,_,R,g);z.format=Ct,z.type=Nn;const P=D*4;for(let ne=0;ne<g;ne++){const U=b[ne],N=M[ne],H=_*R*4*ne;for(let V=0;V<U.count;V++){a.fromBufferAttribute(U,V),U.normalized===!0&&Bc(a,U);const W=V*P;F[H+W+0]=a.x,F[H+W+1]=a.y,F[H+W+2]=a.z,F[H+W+3]=0,p===!0&&(a.fromBufferAttribute(N,V),N.normalized===!0&&Bc(a,N),F[H+W+4]=a.x,F[H+W+5]=a.y,F[H+W+6]=a.z,F[H+W+7]=0)}}v={count:g,texture:z,size:new ee(_,R)},s.set(h,v)}let w=0;for(let p=0;p<f.length;p++)w+=f[p];const m=h.morphTargetsRelative?1:1-w;d.getUniforms().setValue(r,"morphTargetBaseInfluence",m),d.getUniforms().setValue(r,"morphTargetInfluences",f),d.getUniforms().setValue(r,"morphTargetsTexture",v.texture,t),d.getUniforms().setValue(r,"morphTargetsTextureSize",v.size)}else{const g=f===void 0?0:f.length;let v=n[h.id];if(v===void 0||v.length!==g){v=[];for(let M=0;M<g;M++)v[M]=[M,0];n[h.id]=v}for(let M=0;M<g;M++){const E=v[M];E[0]=M,E[1]=f[M]}v.sort(jg);for(let M=0;M<8;M++)M<g&&v[M][1]?(o[M][0]=v[M][0],o[M][1]=v[M][1]):(o[M][0]=Number.MAX_SAFE_INTEGER,o[M][1]=0);o.sort(Zg);const w=h.morphAttributes.position,m=h.morphAttributes.normal;let p=0;for(let M=0;M<8;M++){const E=o[M],D=E[0],_=E[1];D!==Number.MAX_SAFE_INTEGER&&_?(w&&h.getAttribute("morphTarget"+M)!==w[D]&&h.setAttribute("morphTarget"+M,w[D]),m&&h.getAttribute("morphNormal"+M)!==m[D]&&h.setAttribute("morphNormal"+M,m[D]),i[M]=_,p+=_):(w&&h.hasAttribute("morphTarget"+M)===!0&&h.deleteAttribute("morphTarget"+M),m&&h.hasAttribute("morphNormal"+M)===!0&&h.deleteAttribute("morphNormal"+M),i[M]=0)}const b=h.morphTargetsRelative?1:1-p;d.getUniforms().setValue(r,"morphTargetBaseInfluence",b),d.getUniforms().setValue(r,"morphTargetInfluences",i)}}return{update:l}}function $g(r,e,t,n){let i=new WeakMap;function s(l){const c=n.render.frame,h=l.geometry,u=e.get(l,h);return i.get(u)!==c&&(e.update(u),i.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),t.update(l.instanceMatrix,34962),l.instanceColor!==null&&t.update(l.instanceColor,34962)),u}function a(){i=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:s,dispose:a}}class Uc extends Et{constructor(e=null,t=1,n=1,i=1){super(null);this.image={data:e,width:t,height:n,depth:i},this.magFilter=_t,this.minFilter=_t,this.wrapR=qt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.needsUpdate=!0}}Uc.prototype.isDataTexture3D=!0;const zc=new Et,Vc=new So,kc=new Uc,Hc=new Ns,Gc=[],Wc=[],Xc=new Float32Array(16),qc=new Float32Array(9),Yc=new Float32Array(4);function qi(r,e,t){const n=r[0];if(n<=0||n>0)return r;const i=e*t;let s=Gc[i];if(s===void 0&&(s=new Float32Array(i),Gc[i]=s),e!==0){n.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,r[a].toArray(s,o)}return s}function Ut(r,e){if(r.length!==e.length)return!1;for(let t=0,n=r.length;t<n;t++)if(r[t]!==e[t])return!1;return!0}function Dt(r,e){for(let t=0,n=e.length;t<n;t++)r[t]=e[t]}function ks(r,e){let t=Wc[e];t===void 0&&(t=new Int32Array(e),Wc[e]=t);for(let n=0;n!==e;++n)t[n]=r.allocateTextureUnit();return t}function Qg(r,e){const t=this.cache;t[0]!==e&&(r.uniform1f(this.addr,e),t[0]=e)}function Kg(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ut(t,e))return;r.uniform2fv(this.addr,e),Dt(t,e)}}function ev(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(r.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Ut(t,e))return;r.uniform3fv(this.addr,e),Dt(t,e)}}function tv(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ut(t,e))return;r.uniform4fv(this.addr,e),Dt(t,e)}}function nv(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(Ut(t,e))return;r.uniformMatrix2fv(this.addr,!1,e),Dt(t,e)}else{if(Ut(t,n))return;Yc.set(n),r.uniformMatrix2fv(this.addr,!1,Yc),Dt(t,n)}}function iv(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(Ut(t,e))return;r.uniformMatrix3fv(this.addr,!1,e),Dt(t,e)}else{if(Ut(t,n))return;qc.set(n),r.uniformMatrix3fv(this.addr,!1,qc),Dt(t,n)}}function rv(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(Ut(t,e))return;r.uniformMatrix4fv(this.addr,!1,e),Dt(t,e)}else{if(Ut(t,n))return;Xc.set(n),r.uniformMatrix4fv(this.addr,!1,Xc),Dt(t,n)}}function sv(r,e){const t=this.cache;t[0]!==e&&(r.uniform1i(this.addr,e),t[0]=e)}function av(r,e){const t=this.cache;Ut(t,e)||(r.uniform2iv(this.addr,e),Dt(t,e))}function ov(r,e){const t=this.cache;Ut(t,e)||(r.uniform3iv(this.addr,e),Dt(t,e))}function lv(r,e){const t=this.cache;Ut(t,e)||(r.uniform4iv(this.addr,e),Dt(t,e))}function cv(r,e){const t=this.cache;t[0]!==e&&(r.uniform1ui(this.addr,e),t[0]=e)}function hv(r,e){const t=this.cache;Ut(t,e)||(r.uniform2uiv(this.addr,e),Dt(t,e))}function uv(r,e){const t=this.cache;Ut(t,e)||(r.uniform3uiv(this.addr,e),Dt(t,e))}function dv(r,e){const t=this.cache;Ut(t,e)||(r.uniform4uiv(this.addr,e),Dt(t,e))}function fv(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.safeSetTexture2D(e||zc,i)}function pv(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||kc,i)}function mv(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.safeSetTextureCube(e||Hc,i)}function gv(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||Vc,i)}function vv(r){switch(r){case 5126:return Qg;case 35664:return Kg;case 35665:return ev;case 35666:return tv;case 35674:return nv;case 35675:return iv;case 35676:return rv;case 5124:case 35670:return sv;case 35667:case 35671:return av;case 35668:case 35672:return ov;case 35669:case 35673:return lv;case 5125:return cv;case 36294:return hv;case 36295:return uv;case 36296:return dv;case 35678:case 36198:case 36298:case 36306:case 35682:return fv;case 35679:case 36299:case 36307:return pv;case 35680:case 36300:case 36308:case 36293:return mv;case 36289:case 36303:case 36311:case 36292:return gv}}function xv(r,e){r.uniform1fv(this.addr,e)}function _v(r,e){const t=qi(e,this.size,2);r.uniform2fv(this.addr,t)}function yv(r,e){const t=qi(e,this.size,3);r.uniform3fv(this.addr,t)}function Mv(r,e){const t=qi(e,this.size,4);r.uniform4fv(this.addr,t)}function wv(r,e){const t=qi(e,this.size,4);r.uniformMatrix2fv(this.addr,!1,t)}function bv(r,e){const t=qi(e,this.size,9);r.uniformMatrix3fv(this.addr,!1,t)}function Sv(r,e){const t=qi(e,this.size,16);r.uniformMatrix4fv(this.addr,!1,t)}function Tv(r,e){r.uniform1iv(this.addr,e)}function Ev(r,e){r.uniform2iv(this.addr,e)}function Av(r,e){r.uniform3iv(this.addr,e)}function Cv(r,e){r.uniform4iv(this.addr,e)}function Lv(r,e){r.uniform1uiv(this.addr,e)}function Rv(r,e){r.uniform2uiv(this.addr,e)}function Pv(r,e){r.uniform3uiv(this.addr,e)}function Dv(r,e){r.uniform4uiv(this.addr,e)}function Iv(r,e,t){const n=e.length,i=ks(t,n);r.uniform1iv(this.addr,i);for(let s=0;s!==n;++s)t.safeSetTexture2D(e[s]||zc,i[s])}function Fv(r,e,t){const n=e.length,i=ks(t,n);r.uniform1iv(this.addr,i);for(let s=0;s!==n;++s)t.setTexture3D(e[s]||kc,i[s])}function Nv(r,e,t){const n=e.length,i=ks(t,n);r.uniform1iv(this.addr,i);for(let s=0;s!==n;++s)t.safeSetTextureCube(e[s]||Hc,i[s])}function Ov(r,e,t){const n=e.length,i=ks(t,n);r.uniform1iv(this.addr,i);for(let s=0;s!==n;++s)t.setTexture2DArray(e[s]||Vc,i[s])}function Bv(r){switch(r){case 5126:return xv;case 35664:return _v;case 35665:return yv;case 35666:return Mv;case 35674:return wv;case 35675:return bv;case 35676:return Sv;case 5124:case 35670:return Tv;case 35667:case 35671:return Ev;case 35668:case 35672:return Av;case 35669:case 35673:return Cv;case 5125:return Lv;case 36294:return Rv;case 36295:return Pv;case 36296:return Dv;case 35678:case 36198:case 36298:case 36306:case 35682:return Iv;case 35679:case 36299:case 36307:return Fv;case 35680:case 36300:case 36308:case 36293:return Nv;case 36289:case 36303:case 36311:case 36292:return Ov}}function Uv(r,e,t){this.id=r,this.addr=t,this.cache=[],this.setValue=vv(e.type)}function Zc(r,e,t){this.id=r,this.addr=t,this.cache=[],this.size=e.size,this.setValue=Bv(e.type)}Zc.prototype.updateCache=function(r){const e=this.cache;r instanceof Float32Array&&e.length!==r.length&&(this.cache=new Float32Array(r.length)),Dt(e,r)};function jc(r){this.id=r,this.seq=[],this.map={}}jc.prototype.setValue=function(r,e,t){const n=this.seq;for(let i=0,s=n.length;i!==s;++i){const a=n[i];a.setValue(r,e[a.id],t)}};const To=/(\w+)(\])?(\[|\.)?/g;function Jc(r,e){r.seq.push(e),r.map[e.id]=e}function zv(r,e,t){const n=r.name,i=n.length;for(To.lastIndex=0;;){const s=To.exec(n),a=To.lastIndex;let o=s[1];const l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===i){Jc(t,c===void 0?new Uv(o,r,e):new Zc(o,r,e));break}else{let u=t.map[o];u===void 0&&(u=new jc(o),Jc(t,u)),t=u}}}function Xn(r,e){this.seq=[],this.map={};const t=r.getProgramParameter(e,35718);for(let n=0;n<t;++n){const i=r.getActiveUniform(e,n),s=r.getUniformLocation(e,i.name);zv(i,s,this)}}Xn.prototype.setValue=function(r,e,t,n){const i=this.map[e];i!==void 0&&i.setValue(r,t,n)};Xn.prototype.setOptional=function(r,e,t){const n=e[t];n!==void 0&&this.setValue(r,t,n)};Xn.upload=function(r,e,t,n){for(let i=0,s=e.length;i!==s;++i){const a=e[i],o=t[a.id];o.needsUpdate!==!1&&a.setValue(r,o.value,n)}};Xn.seqWithValue=function(r,e){const t=[];for(let n=0,i=r.length;n!==i;++n){const s=r[n];s.id in e&&t.push(s)}return t};function $c(r,e,t){const n=r.createShader(e);return r.shaderSource(n,t),r.compileShader(n),n}let Vv=0;function kv(r){const e=r.split(`
`);for(let t=0;t<e.length;t++)e[t]=t+1+": "+e[t];return e.join(`
`)}function Qc(r){switch(r){case kt:return["Linear","( value )"];case ps:return["sRGB","( value )"];case Ha:return["RGBE","( value )"];case ic:return["RGBM","( value, 7.0 )"];case rc:return["RGBM","( value, 16.0 )"];case sc:return["RGBD","( value, 256.0 )"];case ka:return["Gamma","( value, float( GAMMA_FACTOR ) )"];default:return console.warn("THREE.WebGLProgram: Unsupported encoding:",r),["Linear","( value )"]}}function Kc(r,e,t){const n=r.getShaderParameter(e,35713),i=r.getShaderInfoLog(e).trim();return n&&i===""?"":t.toUpperCase()+`

`+i+`

`+kv(r.getShaderSource(e))}function ui(r,e){const t=Qc(e);return"vec4 "+r+"( vec4 value ) { return "+t[0]+"ToLinear"+t[1]+"; }"}function Hv(r,e){const t=Qc(e);return"vec4 "+r+"( vec4 value ) { return LinearTo"+t[0]+t[1]+"; }"}function Gv(r,e){let t;switch(e){case bd:t="Linear";break;case Sd:t="Reinhard";break;case Td:t="OptimizedCineon";break;case Ed:t="ACESFilmic";break;case Ad:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+r+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function Wv(r){return[r.extensionDerivatives||r.envMapCubeUV||r.bumpMap||r.tangentSpaceNormalMap||r.clearcoatNormalMap||r.flatShading||r.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(r.extensionFragDepth||r.logarithmicDepthBuffer)&&r.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",r.extensionDrawBuffers&&r.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(r.extensionShaderTextureLOD||r.envMap||r.transmission)&&r.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Lr).join(`
`)}function Xv(r){const e=[];for(const t in r){const n=r[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function qv(r,e){const t={},n=r.getProgramParameter(e,35721);for(let i=0;i<n;i++){const s=r.getActiveAttrib(e,i),a=s.name;let o=1;s.type===35674&&(o=2),s.type===35675&&(o=3),s.type===35676&&(o=4),t[a]={type:s.type,location:r.getAttribLocation(e,a),locationSize:o}}return t}function Lr(r){return r!==""}function eh(r,e){return r.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function th(r,e){return r.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Yv=/^[ \t]*#include +<([\w\d./]+)>/gm;function Eo(r){return r.replace(Yv,Zv)}function Zv(r,e){const t=ke[e];if(t===void 0)throw new Error("Can not resolve #include <"+e+">");return Eo(t)}const jv=/#pragma unroll_loop[\s]+?for \( int i \= (\d+)\; i < (\d+)\; i \+\+ \) \{([\s\S]+?)(?=\})\}/g,Jv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function nh(r){return r.replace(Jv,ih).replace(jv,$v)}function $v(r,e,t,n){return console.warn("WebGLProgram: #pragma unroll_loop shader syntax is deprecated. Please use #pragma unroll_loop_start syntax instead."),ih(r,e,t,n)}function ih(r,e,t,n){let i="";for(let s=parseInt(e);s<parseInt(t);s++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return i}function rh(r){let e="precision "+r.precision+` float;
precision `+r.precision+" int;";return r.precision==="highp"?e+=`
#define HIGH_PRECISION`:r.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Qv(r){let e="SHADOWMAP_TYPE_BASIC";return r.shadowMapType===Fl?e="SHADOWMAP_TYPE_PCF":r.shadowMapType===td?e="SHADOWMAP_TYPE_PCF_SOFT":r.shadowMapType===fr&&(e="SHADOWMAP_TYPE_VSM"),e}function Kv(r){let e="ENVMAP_TYPE_CUBE";if(r.envMap)switch(r.envMapMode){case mr:case gr:e="ENVMAP_TYPE_CUBE";break;case cs:case Oa:e="ENVMAP_TYPE_CUBE_UV";break}return e}function ex(r){let e="ENVMAP_MODE_REFLECTION";if(r.envMap)switch(r.envMapMode){case gr:case Oa:e="ENVMAP_MODE_REFRACTION";break}return e}function tx(r){let e="ENVMAP_BLENDING_NONE";if(r.envMap)switch(r.combine){case ls:e="ENVMAP_BLENDING_MULTIPLY";break;case Md:e="ENVMAP_BLENDING_MIX";break;case wd:e="ENVMAP_BLENDING_ADD";break}return e}function nx(r,e,t,n){const i=r.getContext(),s=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=Qv(t),c=Kv(t),h=ex(t),u=tx(t),d=r.gammaFactor>0?r.gammaFactor:1,f=t.isWebGL2?"":Wv(t),g=Xv(s),v=i.createProgram();let w,m,p=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(w=[g].filter(Lr).join(`
`),w.length>0&&(w+=`
`),m=[f,g].filter(Lr).join(`
`),m.length>0&&(m+=`
`)):(w=[rh(t),"#define SHADER_NAME "+t.shaderName,g,t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.supportsVertexTextures?"#define VERTEX_TEXTURES":"","#define GAMMA_FACTOR "+d,"#define MAX_BONES "+t.maxBones,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMap&&t.objectSpaceNormalMap?"#define OBJECTSPACE_NORMALMAP":"",t.normalMap&&t.tangentSpaceNormalMap?"#define TANGENTSPACE_NORMALMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.displacementMap&&t.supportsVertexTextures?"#define USE_DISPLACEMENTMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularIntensityMap?"#define USE_SPECULARINTENSITYMAP":"",t.specularColorMap?"#define USE_SPECULARCOLORMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEENCOLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEENROUGHNESSMAP":"",t.vertexTangents?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUvs?"#define USE_UV":"",t.uvsVertexOnly?"#define UVS_VERTEX_ONLY":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.useVertexTexture?"#define BONE_TEXTURE":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphTargets&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",t.morphTargets&&t.isWebGL2?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Lr).join(`
`),m=[f,rh(t),"#define SHADER_NAME "+t.shaderName,g,"#define GAMMA_FACTOR "+d,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMap&&t.objectSpaceNormalMap?"#define OBJECTSPACE_NORMALMAP":"",t.normalMap&&t.tangentSpaceNormalMap?"#define TANGENTSPACE_NORMALMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularIntensityMap?"#define USE_SPECULARINTENSITYMAP":"",t.specularColorMap?"#define USE_SPECULARCOLORMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEENCOLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEENROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUvs?"#define USE_UV":"",t.uvsVertexOnly?"#define UVS_VERTEX_ONLY":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.physicallyCorrectLights?"#define PHYSICALLY_CORRECT_LIGHTS":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"",(t.extensionShaderTextureLOD||t.envMap)&&t.rendererExtensionShaderTextureLod?"#define TEXTURE_LOD_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==ni?"#define TONE_MAPPING":"",t.toneMapping!==ni?ke.tonemapping_pars_fragment:"",t.toneMapping!==ni?Gv("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.format===On?"#define OPAQUE":"",ke.encodings_pars_fragment,t.map?ui("mapTexelToLinear",t.mapEncoding):"",t.matcap?ui("matcapTexelToLinear",t.matcapEncoding):"",t.envMap?ui("envMapTexelToLinear",t.envMapEncoding):"",t.emissiveMap?ui("emissiveMapTexelToLinear",t.emissiveMapEncoding):"",t.specularColorMap?ui("specularColorMapTexelToLinear",t.specularColorMapEncoding):"",t.sheenColorMap?ui("sheenColorMapTexelToLinear",t.sheenColorMapEncoding):"",t.lightMap?ui("lightMapTexelToLinear",t.lightMapEncoding):"",Hv("linearToOutputTexel",t.outputEncoding),t.depthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Lr).join(`
`)),a=Eo(a),a=eh(a,t),a=th(a,t),o=Eo(o),o=eh(o,t),o=th(o,t),a=nh(a),o=nh(o),t.isWebGL2&&t.isRawShaderMaterial!==!0&&(p=`#version 300 es
`,w=["precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+w,m=["#define varying in",t.glslVersion===oc?"":"out highp vec4 pc_fragColor;",t.glslVersion===oc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const b=p+w+a,M=p+m+o,E=$c(i,35633,b),D=$c(i,35632,M);if(i.attachShader(v,E),i.attachShader(v,D),t.index0AttributeName!==void 0?i.bindAttribLocation(v,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(v,0,"position"),i.linkProgram(v),r.debug.checkShaderErrors){const F=i.getProgramInfoLog(v).trim(),z=i.getShaderInfoLog(E).trim(),P=i.getShaderInfoLog(D).trim();let ne=!0,U=!0;if(i.getProgramParameter(v,35714)===!1){ne=!1;const N=Kc(i,E,"vertex"),H=Kc(i,D,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(v,35715)+`

Program Info Log: `+F+`
`+N+`
`+H)}else F!==""?console.warn("THREE.WebGLProgram: Program Info Log:",F):(z===""||P==="")&&(U=!1);U&&(this.diagnostics={runnable:ne,programLog:F,vertexShader:{log:z,prefix:w},fragmentShader:{log:P,prefix:m}})}i.deleteShader(E),i.deleteShader(D);let _;this.getUniforms=function(){return _===void 0&&(_=new Xn(i,v)),_};let R;return this.getAttributes=function(){return R===void 0&&(R=qv(i,v)),R},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(v),this.program=void 0},this.name=t.shaderName,this.id=Vv++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=E,this.fragmentShader=D,this}function ix(r,e,t,n,i,s,a){const o=[],l=i.isWebGL2,c=i.logarithmicDepthBuffer,h=i.floatVertexTextures,u=i.maxVertexUniforms,d=i.vertexTextures;let f=i.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"},v=["precision","isWebGL2","supportsVertexTextures","outputEncoding","instancing","instancingColor","map","mapEncoding","matcap","matcapEncoding","envMap","envMapMode","envMapEncoding","envMapCubeUV","lightMap","lightMapEncoding","aoMap","emissiveMap","emissiveMapEncoding","bumpMap","normalMap","objectSpaceNormalMap","tangentSpaceNormalMap","clearcoat","clearcoatMap","clearcoatRoughnessMap","clearcoatNormalMap","displacementMap","specularMap",,"roughnessMap","metalnessMap","gradientMap","alphaMap","alphaTest","combine","vertexColors","vertexAlphas","vertexTangents","vertexUvs","uvsVertexOnly","fog","useFog","fogExp2","flatShading","sizeAttenuation","logarithmicDepthBuffer","skinning","maxBones","useVertexTexture","morphTargets","morphNormals","morphTargetsCount","premultipliedAlpha","numDirLights","numPointLights","numSpotLights","numHemiLights","numRectAreaLights","numDirLightShadows","numPointLightShadows","numSpotLightShadows","shadowMapEnabled","shadowMapType","toneMapping","physicallyCorrectLights","doubleSided","flipSided","numClippingPlanes","numClipIntersection","depthPacking","dithering","format","specularIntensityMap","specularColorMap","specularColorMapEncoding","transmission","transmissionMap","thicknessMap","sheen","sheenColorMap","sheenColorMapEncoding","sheenRoughnessMap"];function w(_){const F=_.skeleton.bones;if(h)return 1024;{const P=Math.floor((u-20)/4),ne=Math.min(P,F.length);return ne<F.length?(console.warn("THREE.WebGLRenderer: Skeleton has "+F.length+" bones. This GPU supports "+ne+"."),0):ne}}function m(_){let R;return _&&_.isTexture?R=_.encoding:_&&_.isWebGLRenderTarget?(console.warn("THREE.WebGLPrograms.getTextureEncodingFromMap: don't use render targets as textures. Use their .texture property instead."),R=_.texture.encoding):R=kt,R}function p(_,R,F,z,P){const ne=z.fog,U=_.isMeshStandardMaterial?z.environment:null,N=(_.isMeshStandardMaterial?t:e).get(_.envMap||U),H=g[_.type],V=P.isSkinnedMesh?w(P):0;_.precision!==null&&(f=i.getMaxPrecision(_.precision),f!==_.precision&&console.warn("THREE.WebGLProgram.getParameters:",_.precision,"not supported, using",f,"instead."));let W,ae;if(H){const ue=vn[H];W=ue.vertexShader,ae=ue.fragmentShader}else W=_.vertexShader,ae=_.fragmentShader;const me=r.getRenderTarget(),q=_.alphaTest>0,Y=_.clearcoat>0;return{isWebGL2:l,shaderID:H,shaderName:_.type,vertexShader:W,fragmentShader:ae,defines:_.defines,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:f,instancing:P.isInstancedMesh===!0,instancingColor:P.isInstancedMesh===!0&&P.instanceColor!==null,supportsVertexTextures:d,outputEncoding:me!==null?m(me.texture):r.outputEncoding,map:!!_.map,mapEncoding:m(_.map),matcap:!!_.matcap,matcapEncoding:m(_.matcap),envMap:!!N,envMapMode:N&&N.mapping,envMapEncoding:m(N),envMapCubeUV:!!N&&(N.mapping===cs||N.mapping===Oa),lightMap:!!_.lightMap,lightMapEncoding:m(_.lightMap),aoMap:!!_.aoMap,emissiveMap:!!_.emissiveMap,emissiveMapEncoding:m(_.emissiveMap),bumpMap:!!_.bumpMap,normalMap:!!_.normalMap,objectSpaceNormalMap:_.normalMapType===Af,tangentSpaceNormalMap:_.normalMapType===Si,clearcoat:Y,clearcoatMap:Y&&!!_.clearcoatMap,clearcoatRoughnessMap:Y&&!!_.clearcoatRoughnessMap,clearcoatNormalMap:Y&&!!_.clearcoatNormalMap,displacementMap:!!_.displacementMap,roughnessMap:!!_.roughnessMap,metalnessMap:!!_.metalnessMap,specularMap:!!_.specularMap,specularIntensityMap:!!_.specularIntensityMap,specularColorMap:!!_.specularColorMap,specularColorMapEncoding:m(_.specularColorMap),alphaMap:!!_.alphaMap,alphaTest:q,gradientMap:!!_.gradientMap,sheen:_.sheen>0,sheenColorMap:!!_.sheenColorMap,sheenColorMapEncoding:m(_.sheenColorMap),sheenRoughnessMap:!!_.sheenRoughnessMap,transmission:_.transmission>0,transmissionMap:!!_.transmissionMap,thicknessMap:!!_.thicknessMap,combine:_.combine,vertexTangents:!!_.normalMap&&!!P.geometry&&!!P.geometry.attributes.tangent,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!P.geometry&&!!P.geometry.attributes.color&&P.geometry.attributes.color.itemSize===4,vertexUvs:!!_.map||!!_.bumpMap||!!_.normalMap||!!_.specularMap||!!_.alphaMap||!!_.emissiveMap||!!_.roughnessMap||!!_.metalnessMap||!!_.clearcoatMap||!!_.clearcoatRoughnessMap||!!_.clearcoatNormalMap||!!_.displacementMap||!!_.transmissionMap||!!_.thicknessMap||!!_.specularIntensityMap||!!_.specularColorMap||!!_.sheenColorMap||_.sheenRoughnessMap,uvsVertexOnly:!(!!_.map||!!_.bumpMap||!!_.normalMap||!!_.specularMap||!!_.alphaMap||!!_.emissiveMap||!!_.roughnessMap||!!_.metalnessMap||!!_.clearcoatNormalMap||_.transmission>0||!!_.transmissionMap||!!_.thicknessMap||!!_.specularIntensityMap||!!_.specularColorMap||_.sheen>0||!!_.sheenColorMap||!!_.sheenRoughnessMap)&&!!_.displacementMap,fog:!!ne,useFog:_.fog,fogExp2:ne&&ne.isFogExp2,flatShading:!!_.flatShading,sizeAttenuation:_.sizeAttenuation,logarithmicDepthBuffer:c,skinning:P.isSkinnedMesh===!0&&V>0,maxBones:V,useVertexTexture:h,morphTargets:!!P.geometry&&!!P.geometry.morphAttributes.position,morphNormals:!!P.geometry&&!!P.geometry.morphAttributes.normal,morphTargetsCount:!!P.geometry&&!!P.geometry.morphAttributes.position?P.geometry.morphAttributes.position.length:0,numDirLights:R.directional.length,numPointLights:R.point.length,numSpotLights:R.spot.length,numRectAreaLights:R.rectArea.length,numHemiLights:R.hemi.length,numDirLightShadows:R.directionalShadowMap.length,numPointLightShadows:R.pointShadowMap.length,numSpotLightShadows:R.spotShadowMap.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,format:_.format,dithering:_.dithering,shadowMapEnabled:r.shadowMap.enabled&&F.length>0,shadowMapType:r.shadowMap.type,toneMapping:_.toneMapped?r.toneMapping:ni,physicallyCorrectLights:r.physicallyCorrectLights,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===pn,flipSided:_.side===lt,depthPacking:_.depthPacking!==void 0?_.depthPacking:!1,index0AttributeName:_.index0AttributeName,extensionDerivatives:_.extensions&&_.extensions.derivatives,extensionFragDepth:_.extensions&&_.extensions.fragDepth,extensionDrawBuffers:_.extensions&&_.extensions.drawBuffers,extensionShaderTextureLOD:_.extensions&&_.extensions.shaderTextureLOD,rendererExtensionFragDepth:l||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:l||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:l||n.has("EXT_shader_texture_lod"),customProgramCacheKey:_.customProgramCacheKey()}}function b(_){const R=[];if(_.shaderID?R.push(_.shaderID):(R.push(hc(_.fragmentShader)),R.push(hc(_.vertexShader))),_.defines!==void 0)for(const F in _.defines)R.push(F),R.push(_.defines[F]);if(_.isRawShaderMaterial===!1){for(let F=0;F<v.length;F++)R.push(_[v[F]]);R.push(r.outputEncoding),R.push(r.gammaFactor)}return R.push(_.customProgramCacheKey),R.join()}function M(_){const R=g[_.type];let F;if(R){const z=vn[R];F=Ec.clone(z.uniforms)}else F=_.uniforms;return F}function E(_,R){let F;for(let z=0,P=o.length;z<P;z++){const ne=o[z];if(ne.cacheKey===R){F=ne,++F.usedTimes;break}}return F===void 0&&(F=new nx(r,R,_,s),o.push(F)),F}function D(_){if(--_.usedTimes==0){const R=o.indexOf(_);o[R]=o[o.length-1],o.pop(),_.destroy()}}return{getParameters:p,getProgramCacheKey:b,getUniforms:M,acquireProgram:E,releaseProgram:D,programs:o}}function rx(){let r=new WeakMap;function e(s){let a=r.get(s);return a===void 0&&(a={},r.set(s,a)),a}function t(s){r.delete(s)}function n(s,a,o){r.get(s)[a]=o}function i(){r=new WeakMap}return{get:e,remove:t,update:n,dispose:i}}function sx(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.program!==e.program?r.program.id-e.program.id:r.material.id!==e.material.id?r.material.id-e.material.id:r.z!==e.z?r.z-e.z:r.id-e.id}function sh(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.z!==e.z?e.z-r.z:r.id-e.id}function ah(r){const e=[];let t=0;const n=[],i=[],s=[],a={id:-1};function o(){t=0,n.length=0,i.length=0,s.length=0}function l(f,g,v,w,m,p){let b=e[t];const M=r.get(v);return b===void 0?(b={id:f.id,object:f,geometry:g,material:v,program:M.program||a,groupOrder:w,renderOrder:f.renderOrder,z:m,group:p},e[t]=b):(b.id=f.id,b.object=f,b.geometry=g,b.material=v,b.program=M.program||a,b.groupOrder=w,b.renderOrder=f.renderOrder,b.z=m,b.group=p),t++,b}function c(f,g,v,w,m,p){const b=l(f,g,v,w,m,p);v.transmission>0?i.push(b):v.transparent===!0?s.push(b):n.push(b)}function h(f,g,v,w,m,p){const b=l(f,g,v,w,m,p);v.transmission>0?i.unshift(b):v.transparent===!0?s.unshift(b):n.unshift(b)}function u(f,g){n.length>1&&n.sort(f||sx),i.length>1&&i.sort(g||sh),s.length>1&&s.sort(g||sh)}function d(){for(let f=t,g=e.length;f<g;f++){const v=e[f];if(v.id===null)break;v.id=null,v.object=null,v.geometry=null,v.material=null,v.program=null,v.group=null}}return{opaque:n,transmissive:i,transparent:s,init:o,push:c,unshift:h,finish:d,sort:u}}function ax(r){let e=new WeakMap;function t(i,s){let a;return e.has(i)===!1?(a=new ah(r),e.set(i,[a])):s>=e.get(i).length?(a=new ah(r),e.get(i).push(a)):a=e.get(i)[s],a}function n(){e=new WeakMap}return{get:t,dispose:n}}function ox(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new C,color:new be};break;case"SpotLight":t={position:new C,direction:new C,color:new be,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new C,color:new be,distance:0,decay:0};break;case"HemisphereLight":t={direction:new C,skyColor:new be,groundColor:new be};break;case"RectAreaLight":t={color:new be,position:new C,halfWidth:new C,halfHeight:new C};break}return r[e.id]=t,t}}}function lx(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ee};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ee};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ee,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[e.id]=t,t}}}let cx=0;function hx(r,e){return(e.castShadow?1:0)-(r.castShadow?1:0)}function ux(r,e){const t=new ox,n=lx(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotShadow:[],spotShadowMap:[],spotShadowMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[]};for(let h=0;h<9;h++)i.probe.push(new C);const s=new C,a=new Le,o=new Le;function l(h,u){let d=0,f=0,g=0;for(let F=0;F<9;F++)i.probe[F].set(0,0,0);let v=0,w=0,m=0,p=0,b=0,M=0,E=0,D=0;h.sort(hx);const _=u!==!0?Math.PI:1;for(let F=0,z=h.length;F<z;F++){const P=h[F],ne=P.color,U=P.intensity,N=P.distance,H=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)d+=ne.r*U*_,f+=ne.g*U*_,g+=ne.b*U*_;else if(P.isLightProbe)for(let V=0;V<9;V++)i.probe[V].addScaledVector(P.sh.coefficients[V],U);else if(P.isDirectionalLight){const V=t.get(P);if(V.color.copy(P.color).multiplyScalar(P.intensity*_),P.castShadow){const W=P.shadow,ae=n.get(P);ae.shadowBias=W.bias,ae.shadowNormalBias=W.normalBias,ae.shadowRadius=W.radius,ae.shadowMapSize=W.mapSize,i.directionalShadow[v]=ae,i.directionalShadowMap[v]=H,i.directionalShadowMatrix[v]=P.shadow.matrix,M++}i.directional[v]=V,v++}else if(P.isSpotLight){const V=t.get(P);if(V.position.setFromMatrixPosition(P.matrixWorld),V.color.copy(ne).multiplyScalar(U*_),V.distance=N,V.coneCos=Math.cos(P.angle),V.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),V.decay=P.decay,P.castShadow){const W=P.shadow,ae=n.get(P);ae.shadowBias=W.bias,ae.shadowNormalBias=W.normalBias,ae.shadowRadius=W.radius,ae.shadowMapSize=W.mapSize,i.spotShadow[m]=ae,i.spotShadowMap[m]=H,i.spotShadowMatrix[m]=P.shadow.matrix,D++}i.spot[m]=V,m++}else if(P.isRectAreaLight){const V=t.get(P);V.color.copy(ne).multiplyScalar(U),V.halfWidth.set(P.width*.5,0,0),V.halfHeight.set(0,P.height*.5,0),i.rectArea[p]=V,p++}else if(P.isPointLight){const V=t.get(P);if(V.color.copy(P.color).multiplyScalar(P.intensity*_),V.distance=P.distance,V.decay=P.decay,P.castShadow){const W=P.shadow,ae=n.get(P);ae.shadowBias=W.bias,ae.shadowNormalBias=W.normalBias,ae.shadowRadius=W.radius,ae.shadowMapSize=W.mapSize,ae.shadowCameraNear=W.camera.near,ae.shadowCameraFar=W.camera.far,i.pointShadow[w]=ae,i.pointShadowMap[w]=H,i.pointShadowMatrix[w]=P.shadow.matrix,E++}i.point[w]=V,w++}else if(P.isHemisphereLight){const V=t.get(P);V.skyColor.copy(P.color).multiplyScalar(U*_),V.groundColor.copy(P.groundColor).multiplyScalar(U*_),i.hemi[b]=V,b++}}p>0&&(e.isWebGL2||r.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=he.LTC_FLOAT_1,i.rectAreaLTC2=he.LTC_FLOAT_2):r.has("OES_texture_half_float_linear")===!0?(i.rectAreaLTC1=he.LTC_HALF_1,i.rectAreaLTC2=he.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),i.ambient[0]=d,i.ambient[1]=f,i.ambient[2]=g;const R=i.hash;(R.directionalLength!==v||R.pointLength!==w||R.spotLength!==m||R.rectAreaLength!==p||R.hemiLength!==b||R.numDirectionalShadows!==M||R.numPointShadows!==E||R.numSpotShadows!==D)&&(i.directional.length=v,i.spot.length=m,i.rectArea.length=p,i.point.length=w,i.hemi.length=b,i.directionalShadow.length=M,i.directionalShadowMap.length=M,i.pointShadow.length=E,i.pointShadowMap.length=E,i.spotShadow.length=D,i.spotShadowMap.length=D,i.directionalShadowMatrix.length=M,i.pointShadowMatrix.length=E,i.spotShadowMatrix.length=D,R.directionalLength=v,R.pointLength=w,R.spotLength=m,R.rectAreaLength=p,R.hemiLength=b,R.numDirectionalShadows=M,R.numPointShadows=E,R.numSpotShadows=D,i.version=cx++)}function c(h,u){let d=0,f=0,g=0,v=0,w=0;const m=u.matrixWorldInverse;for(let p=0,b=h.length;p<b;p++){const M=h[p];if(M.isDirectionalLight){const E=i.directional[d];E.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),E.direction.sub(s),E.direction.transformDirection(m),d++}else if(M.isSpotLight){const E=i.spot[g];E.position.setFromMatrixPosition(M.matrixWorld),E.position.applyMatrix4(m),E.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),E.direction.sub(s),E.direction.transformDirection(m),g++}else if(M.isRectAreaLight){const E=i.rectArea[v];E.position.setFromMatrixPosition(M.matrixWorld),E.position.applyMatrix4(m),o.identity(),a.copy(M.matrixWorld),a.premultiply(m),o.extractRotation(a),E.halfWidth.set(M.width*.5,0,0),E.halfHeight.set(0,M.height*.5,0),E.halfWidth.applyMatrix4(o),E.halfHeight.applyMatrix4(o),v++}else if(M.isPointLight){const E=i.point[f];E.position.setFromMatrixPosition(M.matrixWorld),E.position.applyMatrix4(m),f++}else if(M.isHemisphereLight){const E=i.hemi[w];E.direction.setFromMatrixPosition(M.matrixWorld),E.direction.transformDirection(m),E.direction.normalize(),w++}}}return{setup:l,setupView:c,state:i}}function oh(r,e){const t=new ux(r,e),n=[],i=[];function s(){n.length=0,i.length=0}function a(u){n.push(u)}function o(u){i.push(u)}function l(u){t.setup(n,u)}function c(u){t.setupView(n,u)}return{init:s,state:{lightsArray:n,shadowsArray:i,lights:t},setupLights:l,setupLightsView:c,pushLight:a,pushShadow:o}}function dx(r,e){let t=new WeakMap;function n(s,a=0){let o;return t.has(s)===!1?(o=new oh(r,e),t.set(s,[o])):a>=t.get(s).length?(o=new oh(r,e),t.get(s).push(o)):o=t.get(s)[a],o}function i(){t=new WeakMap}return{get:n,dispose:i}}class lh extends Lt{constructor(e){super();this.type="MeshDepthMaterial",this.depthPacking=ac,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}lh.prototype.isMeshDepthMaterial=!0;class ch extends Lt{constructor(e){super();this.type="MeshDistanceMaterial",this.referencePosition=new C,this.nearDistance=1,this.farDistance=1e3,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.fog=!1,this.setValues(e)}copy(e){return super.copy(e),this.referencePosition.copy(e.referencePosition),this.nearDistance=e.nearDistance,this.farDistance=e.farDistance,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}ch.prototype.isMeshDistanceMaterial=!0;const fx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,px=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function hh(r,e,t){let n=new Bs;const i=new ee,s=new ee,a=new it,o=new lh({depthPacking:Ef}),l=new ch,c={},h=t.maxTextureSize,u={0:lt,1:_i,2:pn},d=new gn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ee},radius:{value:4}},vertexShader:fx,fragmentShader:px}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new st;g.setAttribute("position",new ut(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new Rt(g,d),w=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Fl,this.render=function(M,E,D){if(w.enabled===!1||w.autoUpdate===!1&&w.needsUpdate===!1||M.length===0)return;const _=r.getRenderTarget(),R=r.getActiveCubeFace(),F=r.getActiveMipmapLevel(),z=r.state;z.setBlending(mn),z.buffers.color.setClear(1,1,1,1),z.buffers.depth.setTest(!0),z.setScissorTest(!1);for(let P=0,ne=M.length;P<ne;P++){const U=M[P],N=U.shadow;if(N===void 0){console.warn("THREE.WebGLShadowMap:",U,"has no shadow.");continue}if(N.autoUpdate===!1&&N.needsUpdate===!1)continue;i.copy(N.mapSize);const H=N.getFrameExtents();if(i.multiply(H),s.copy(N.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(s.x=Math.floor(h/H.x),i.x=s.x*H.x,N.mapSize.x=s.x),i.y>h&&(s.y=Math.floor(h/H.y),i.y=s.y*H.y,N.mapSize.y=s.y)),N.map===null&&!N.isPointLightShadow&&this.type===fr){const W={minFilter:Vt,magFilter:Vt,format:Ct};N.map=new Yt(i.x,i.y,W),N.map.texture.name=U.name+".shadowMap",N.mapPass=new Yt(i.x,i.y,W),N.camera.updateProjectionMatrix()}if(N.map===null){const W={minFilter:_t,magFilter:_t,format:Ct};N.map=new Yt(i.x,i.y,W),N.map.texture.name=U.name+".shadowMap",N.camera.updateProjectionMatrix()}r.setRenderTarget(N.map),r.clear();const V=N.getViewportCount();for(let W=0;W<V;W++){const ae=N.getViewport(W);a.set(s.x*ae.x,s.y*ae.y,s.x*ae.z,s.y*ae.w),z.viewport(a),N.updateMatrices(U,W),n=N.getFrustum(),b(E,D,N.camera,U,this.type)}!N.isPointLightShadow&&this.type===fr&&m(N,D),N.needsUpdate=!1}w.needsUpdate=!1,r.setRenderTarget(_,R,F)};function m(M,E){const D=e.update(v);d.defines.VSM_SAMPLES!==M.blurSamples&&(d.defines.VSM_SAMPLES=M.blurSamples,f.defines.VSM_SAMPLES=M.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),d.uniforms.shadow_pass.value=M.map.texture,d.uniforms.resolution.value=M.mapSize,d.uniforms.radius.value=M.radius,r.setRenderTarget(M.mapPass),r.clear(),r.renderBufferDirect(E,null,D,d,v,null),f.uniforms.shadow_pass.value=M.mapPass.texture,f.uniforms.resolution.value=M.mapSize,f.uniforms.radius.value=M.radius,r.setRenderTarget(M.map),r.clear(),r.renderBufferDirect(E,null,D,f,v,null)}function p(M,E,D,_,R,F,z){let P=null;const ne=_.isPointLight===!0?M.customDistanceMaterial:M.customDepthMaterial;if(ne!==void 0?P=ne:P=_.isPointLight===!0?l:o,r.localClippingEnabled&&D.clipShadows===!0&&D.clippingPlanes.length!==0||D.displacementMap&&D.displacementScale!==0||D.alphaMap&&D.alphaTest>0){const U=P.uuid,N=D.uuid;let H=c[U];H===void 0&&(H={},c[U]=H);let V=H[N];V===void 0&&(V=P.clone(),H[N]=V),P=V}return P.visible=D.visible,P.wireframe=D.wireframe,z===fr?P.side=D.shadowSide!==null?D.shadowSide:D.side:P.side=D.shadowSide!==null?D.shadowSide:u[D.side],P.alphaMap=D.alphaMap,P.alphaTest=D.alphaTest,P.clipShadows=D.clipShadows,P.clippingPlanes=D.clippingPlanes,P.clipIntersection=D.clipIntersection,P.displacementMap=D.displacementMap,P.displacementScale=D.displacementScale,P.displacementBias=D.displacementBias,P.wireframeLinewidth=D.wireframeLinewidth,P.linewidth=D.linewidth,_.isPointLight===!0&&P.isMeshDistanceMaterial===!0&&(P.referencePosition.setFromMatrixPosition(_.matrixWorld),P.nearDistance=R,P.farDistance=F),P}function b(M,E,D,_,R){if(M.visible===!1)return;if(M.layers.test(E.layers)&&(M.isMesh||M.isLine||M.isPoints)&&(M.castShadow||M.receiveShadow&&R===fr)&&(!M.frustumCulled||n.intersectsObject(M))){M.modelViewMatrix.multiplyMatrices(D.matrixWorldInverse,M.matrixWorld);const P=e.update(M),ne=M.material;if(Array.isArray(ne)){const U=P.groups;for(let N=0,H=U.length;N<H;N++){const V=U[N],W=ne[V.materialIndex];if(W&&W.visible){const ae=p(M,P,W,_,D.near,D.far,R);ae.onBeforeRender(this,null,D,P,M,V),r.renderBufferDirect(D,null,P,ae,M,V)}}}else if(ne.visible){const U=p(M,P,ne,_,D.near,D.far,R);U.onBeforeRender(this,null,D,P,M,null),r.renderBufferDirect(D,null,P,U,M,null)}}const z=M.children;for(let P=0,ne=z.length;P<ne;P++)b(z[P],E,D,_,R)}}function mx(r,e,t){const n=t.isWebGL2;function i(){let I=!1;const le=new it;let $=null;const ce=new it(0,0,0,0);return{setMask:function(se){$!==se&&!I&&(r.colorMask(se,se,se,se),$=se)},setLocked:function(se){I=se},setClear:function(se,ve,Me,Ie,ht){ht===!0&&(se*=Ie,ve*=Ie,Me*=Ie),le.set(se,ve,Me,Ie),ce.equals(le)===!1&&(r.clearColor(se,ve,Me,Ie),ce.copy(le))},reset:function(){I=!1,$=null,ce.set(-1,0,0,0)}}}function s(){let I=!1,le=null,$=null,ce=null;return{setTest:function(se){se?ue(2929):xe(2929)},setMask:function(se){le!==se&&!I&&(r.depthMask(se),le=se)},setFunc:function(se){if($!==se){if(se)switch(se){case pd:r.depthFunc(512);break;case md:r.depthFunc(519);break;case gd:r.depthFunc(513);break;case Ia:r.depthFunc(515);break;case vd:r.depthFunc(514);break;case xd:r.depthFunc(518);break;case _d:r.depthFunc(516);break;case yd:r.depthFunc(517);break;default:r.depthFunc(515)}else r.depthFunc(515);$=se}},setLocked:function(se){I=se},setClear:function(se){ce!==se&&(r.clearDepth(se),ce=se)},reset:function(){I=!1,le=null,$=null,ce=null}}}function a(){let I=!1,le=null,$=null,ce=null,se=null,ve=null,Me=null,Ie=null,ht=null;return{setTest:function(qe){I||(qe?ue(2960):xe(2960))},setMask:function(qe){le!==qe&&!I&&(r.stencilMask(qe),le=qe)},setFunc:function(qe,Wt,At){($!==qe||ce!==Wt||se!==At)&&(r.stencilFunc(qe,Wt,At),$=qe,ce=Wt,se=At)},setOp:function(qe,Wt,At){(ve!==qe||Me!==Wt||Ie!==At)&&(r.stencilOp(qe,Wt,At),ve=qe,Me=Wt,Ie=At)},setLocked:function(qe){I=qe},setClear:function(qe){ht!==qe&&(r.clearStencil(qe),ht=qe)},reset:function(){I=!1,le=null,$=null,ce=null,se=null,ve=null,Me=null,Ie=null,ht=null}}}const o=new i,l=new s,c=new a;let h={},u={},d=null,f=!1,g=null,v=null,w=null,m=null,p=null,b=null,M=null,E=!1,D=null,_=null,R=null,F=null,z=null;const P=r.getParameter(35661);let ne=!1,U=0;const N=r.getParameter(7938);N.indexOf("WebGL")!==-1?(U=parseFloat(/^WebGL (\d)/.exec(N)[1]),ne=U>=1):N.indexOf("OpenGL ES")!==-1&&(U=parseFloat(/^OpenGL ES (\d)/.exec(N)[1]),ne=U>=2);let H=null,V={};const W=r.getParameter(3088),ae=r.getParameter(2978),me=new it().fromArray(W),q=new it().fromArray(ae);function Y(I,le,$){const ce=new Uint8Array(4),se=r.createTexture();r.bindTexture(I,se),r.texParameteri(I,10241,9728),r.texParameteri(I,10240,9728);for(let ve=0;ve<$;ve++)r.texImage2D(le+ve,0,6408,1,1,0,6408,5121,ce);return se}const de={};de[3553]=Y(3553,3553,1),de[34067]=Y(34067,34069,6),o.setClear(0,0,0,1),l.setClear(1),c.setClear(0),ue(2929),l.setFunc(Ia),Ue(!1),X(Il),ue(2884),oe(mn);function ue(I){h[I]!==!0&&(r.enable(I),h[I]=!0)}function xe(I){h[I]!==!1&&(r.disable(I),h[I]=!1)}function Xe(I,le){return u[I]!==le?(r.bindFramebuffer(I,le),u[I]=le,n&&(I===36009&&(u[36160]=le),I===36160&&(u[36009]=le)),!0):!1}function Q(I){return d!==I?(r.useProgram(I),d=I,!0):!1}const Se={[yi]:32774,[id]:32778,[rd]:32779};if(n)Se[zl]=32775,Se[Vl]=32776;else{const I=e.get("EXT_blend_minmax");I!==null&&(Se[zl]=I.MIN_EXT,Se[Vl]=I.MAX_EXT)}const Te={[sd]:0,[ad]:1,[od]:768,[kl]:770,[fd]:776,[ud]:774,[cd]:772,[ld]:769,[Hl]:771,[dd]:775,[hd]:773};function oe(I,le,$,ce,se,ve,Me,Ie){if(I===mn){f===!0&&(xe(3042),f=!1);return}if(f===!1&&(ue(3042),f=!0),I!==nd){if(I!==g||Ie!==E){if((v!==yi||p!==yi)&&(r.blendEquation(32774),v=yi,p=yi),Ie)switch(I){case pr:r.blendFuncSeparate(1,771,1,771);break;case Ol:r.blendFunc(1,1);break;case Bl:r.blendFuncSeparate(0,0,769,771);break;case Ul:r.blendFuncSeparate(0,768,0,770);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}else switch(I){case pr:r.blendFuncSeparate(770,771,1,771);break;case Ol:r.blendFunc(770,1);break;case Bl:r.blendFunc(0,769);break;case Ul:r.blendFunc(0,768);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}w=null,m=null,b=null,M=null,g=I,E=Ie}return}se=se||le,ve=ve||$,Me=Me||ce,(le!==v||se!==p)&&(r.blendEquationSeparate(Se[le],Se[se]),v=le,p=se),($!==w||ce!==m||ve!==b||Me!==M)&&(r.blendFuncSeparate(Te[$],Te[ce],Te[ve],Te[Me]),w=$,m=ce,b=ve,M=Me),g=I,E=null}function ge(I,le){I.side===pn?xe(2884):ue(2884);let $=I.side===lt;le&&($=!$),Ue($),I.blending===pr&&I.transparent===!1?oe(mn):oe(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.premultipliedAlpha),l.setFunc(I.depthFunc),l.setTest(I.depthTest),l.setMask(I.depthWrite),o.setMask(I.colorWrite);const ce=I.stencilWrite;c.setTest(ce),ce&&(c.setMask(I.stencilWriteMask),c.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),c.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),ie(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?ue(32926):xe(32926)}function Ue(I){D!==I&&(I?r.frontFace(2304):r.frontFace(2305),D=I)}function X(I){I!==Ku?(ue(2884),I!==_&&(I===Il?r.cullFace(1029):I===ed?r.cullFace(1028):r.cullFace(1032))):xe(2884),_=I}function te(I){I!==R&&(ne&&r.lineWidth(I),R=I)}function ie(I,le,$){I?(ue(32823),(F!==le||z!==$)&&(r.polygonOffset(le,$),F=le,z=$)):xe(32823)}function fe(I){I?ue(3089):xe(3089)}function re(I){I===void 0&&(I=33984+P-1),H!==I&&(r.activeTexture(I),H=I)}function Ce(I,le){H===null&&re();let $=V[H];$===void 0&&($={type:void 0,texture:void 0},V[H]=$),($.type!==I||$.texture!==le)&&(r.bindTexture(I,le||de[I]),$.type=I,$.texture=le)}function Pe(){const I=V[H];I!==void 0&&I.type!==void 0&&(r.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function Be(){try{r.compressedTexImage2D.apply(r,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Je(){try{r.texSubImage2D.apply(r,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function A(){try{r.texStorage2D.apply(r,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function T(){try{r.texImage2D.apply(r,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function J(){try{r.texImage3D.apply(r,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function j(I){me.equals(I)===!1&&(r.scissor(I.x,I.y,I.z,I.w),me.copy(I))}function ye(I){q.equals(I)===!1&&(r.viewport(I.x,I.y,I.z,I.w),q.copy(I))}function _e(){r.disable(3042),r.disable(2884),r.disable(2929),r.disable(32823),r.disable(3089),r.disable(2960),r.disable(32926),r.blendEquation(32774),r.blendFunc(1,0),r.blendFuncSeparate(1,0,1,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(513),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(519,0,4294967295),r.stencilOp(7680,7680,7680),r.clearStencil(0),r.cullFace(1029),r.frontFace(2305),r.polygonOffset(0,0),r.activeTexture(33984),r.bindFramebuffer(36160,null),n===!0&&(r.bindFramebuffer(36009,null),r.bindFramebuffer(36008,null)),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),h={},H=null,V={},u={},d=null,f=!1,g=null,v=null,w=null,m=null,p=null,b=null,M=null,E=!1,D=null,_=null,R=null,F=null,z=null,me.set(0,0,r.canvas.width,r.canvas.height),q.set(0,0,r.canvas.width,r.canvas.height),o.reset(),l.reset(),c.reset()}return{buffers:{color:o,depth:l,stencil:c},enable:ue,disable:xe,bindFramebuffer:Xe,useProgram:Q,setBlending:oe,setMaterial:ge,setFlipSided:Ue,setCullFace:X,setLineWidth:te,setPolygonOffset:ie,setScissorTest:fe,activeTexture:re,bindTexture:Ce,unbindTexture:Pe,compressedTexImage2D:Be,texImage2D:T,texImage3D:J,texStorage2D:A,texSubImage2D:Je,scissor:j,viewport:ye,reset:_e}}function gx(r,e,t,n,i,s,a){const o=i.isWebGL2,l=i.maxTextures,c=i.maxCubemapSize,h=i.maxTextureSize,u=i.maxSamples,f=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):void 0,g=new WeakMap;let v,w=!1;try{w=typeof OffscreenCanvas!="undefined"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(A,T){return w?new OffscreenCanvas(A,T):vs("canvas")}function p(A,T,J,j){let ye=1;if((A.width>j||A.height>j)&&(ye=j/Math.max(A.width,A.height)),ye<1||T===!0)if(typeof HTMLImageElement!="undefined"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&A instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&A instanceof ImageBitmap){const _e=T?lc:Math.floor,I=_e(ye*A.width),le=_e(ye*A.height);v===void 0&&(v=m(I,le));const $=J?m(I,le):v;return $.width=I,$.height=le,$.getContext("2d").drawImage(A,0,0,I,le),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+A.width+"x"+A.height+") to ("+I+"x"+le+")."),$}else return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+A.width+"x"+A.height+")."),A;return A}function b(A){return Xa(A.width)&&Xa(A.height)}function M(A){return o?!1:A.wrapS!==qt||A.wrapT!==qt||A.minFilter!==_t&&A.minFilter!==Vt}function E(A,T){return A.generateMipmaps&&T&&A.minFilter!==_t&&A.minFilter!==Vt}function D(A){r.generateMipmap(A)}function _(A,T,J){if(o===!1)return T;if(A!==null){if(r[A]!==void 0)return r[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let j=T;return T===6403&&(J===5126&&(j=33326),J===5131&&(j=33325),J===5121&&(j=33321)),T===6407&&(J===5126&&(j=34837),J===5131&&(j=34843),J===5121&&(j=32849)),T===6408&&(J===5126&&(j=34836),J===5131&&(j=34842),J===5121&&(j=32856)),(j===33325||j===33326||j===34842||j===34836)&&e.get("EXT_color_buffer_float"),j}function R(A,T,J){return E(A,J)===!0?Math.log2(Math.max(T.width,T.height))+1:A.mipmaps.length>0?A.mipmaps.length:1}function F(A){return A===_t||A===Wl||A===Xl?9728:9729}function z(A){const T=A.target;T.removeEventListener("dispose",z),ne(T),T.isVideoTexture&&g.delete(T),a.memory.textures--}function P(A){const T=A.target;T.removeEventListener("dispose",P),U(T)}function ne(A){const T=n.get(A);T.__webglInit!==void 0&&(r.deleteTexture(T.__webglTexture),n.remove(A))}function U(A){const T=A.texture,J=n.get(A),j=n.get(T);if(!!A){if(j.__webglTexture!==void 0&&(r.deleteTexture(j.__webglTexture),a.memory.textures--),A.depthTexture&&A.depthTexture.dispose(),A.isWebGLCubeRenderTarget)for(let ye=0;ye<6;ye++)r.deleteFramebuffer(J.__webglFramebuffer[ye]),J.__webglDepthbuffer&&r.deleteRenderbuffer(J.__webglDepthbuffer[ye]);else r.deleteFramebuffer(J.__webglFramebuffer),J.__webglDepthbuffer&&r.deleteRenderbuffer(J.__webglDepthbuffer),J.__webglMultisampledFramebuffer&&r.deleteFramebuffer(J.__webglMultisampledFramebuffer),J.__webglColorRenderbuffer&&r.deleteRenderbuffer(J.__webglColorRenderbuffer),J.__webglDepthRenderbuffer&&r.deleteRenderbuffer(J.__webglDepthRenderbuffer);if(A.isWebGLMultipleRenderTargets)for(let ye=0,_e=T.length;ye<_e;ye++){const I=n.get(T[ye]);I.__webglTexture&&(r.deleteTexture(I.__webglTexture),a.memory.textures--),n.remove(T[ye])}n.remove(T),n.remove(A)}}let N=0;function H(){N=0}function V(){const A=N;return A>=l&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+l),N+=1,A}function W(A,T){const J=n.get(A);if(A.isVideoTexture&&re(A),A.version>0&&J.__version!==A.version){const j=A.image;if(j===void 0)console.warn("THREE.WebGLRenderer: Texture marked for update but image is undefined");else if(j.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Xe(J,A,T);return}}t.activeTexture(33984+T),t.bindTexture(3553,J.__webglTexture)}function ae(A,T){const J=n.get(A);if(A.version>0&&J.__version!==A.version){Xe(J,A,T);return}t.activeTexture(33984+T),t.bindTexture(35866,J.__webglTexture)}function me(A,T){const J=n.get(A);if(A.version>0&&J.__version!==A.version){Xe(J,A,T);return}t.activeTexture(33984+T),t.bindTexture(32879,J.__webglTexture)}function q(A,T){const J=n.get(A);if(A.version>0&&J.__version!==A.version){Q(J,A,T);return}t.activeTexture(33984+T),t.bindTexture(34067,J.__webglTexture)}const Y={[Ba]:10497,[qt]:33071,[Ua]:33648},de={[_t]:9728,[Wl]:9984,[Xl]:9986,[Vt]:9729,[Cd]:9985,[hs]:9987};function ue(A,T,J){if(J?(r.texParameteri(A,10242,Y[T.wrapS]),r.texParameteri(A,10243,Y[T.wrapT]),(A===32879||A===35866)&&r.texParameteri(A,32882,Y[T.wrapR]),r.texParameteri(A,10240,de[T.magFilter]),r.texParameteri(A,10241,de[T.minFilter])):(r.texParameteri(A,10242,33071),r.texParameteri(A,10243,33071),(A===32879||A===35866)&&r.texParameteri(A,32882,33071),(T.wrapS!==qt||T.wrapT!==qt)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),r.texParameteri(A,10240,F(T.magFilter)),r.texParameteri(A,10241,F(T.minFilter)),T.minFilter!==_t&&T.minFilter!==Vt&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),e.has("EXT_texture_filter_anisotropic")===!0){const j=e.get("EXT_texture_filter_anisotropic");if(T.type===Nn&&e.has("OES_texture_float_linear")===!1||o===!1&&T.type===Mi&&e.has("OES_texture_half_float_linear")===!1)return;(T.anisotropy>1||n.get(T).__currentAnisotropy)&&(r.texParameterf(A,j.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,i.getMaxAnisotropy())),n.get(T).__currentAnisotropy=T.anisotropy)}}function xe(A,T){A.__webglInit===void 0&&(A.__webglInit=!0,T.addEventListener("dispose",z),A.__webglTexture=r.createTexture(),a.memory.textures++)}function Xe(A,T,J){let j=3553;T.isDataTexture2DArray&&(j=35866),T.isDataTexture3D&&(j=32879),xe(A,T),t.activeTexture(33984+J),t.bindTexture(j,A.__webglTexture),r.pixelStorei(37440,T.flipY),r.pixelStorei(37441,T.premultiplyAlpha),r.pixelStorei(3317,T.unpackAlignment),r.pixelStorei(37443,0);const ye=M(T)&&b(T.image)===!1,_e=p(T.image,ye,!1,h),I=b(_e)||o,le=s.convert(T.format);let $=s.convert(T.type),ce=_(T.internalFormat,le,$,T.encoding);ue(j,T,I);let se;const ve=T.mipmaps;if(T.isDepthTexture)ce=6402,o?T.type===Nn?ce=36012:T.type===xr?ce=33190:T.type===ii?ce=35056:ce=33189:T.type===Nn&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),T.format===ri&&ce===6402&&T.type!==vr&&T.type!==xr&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),T.type=vr,$=s.convert(T.type)),T.format===si&&ce===6402&&(ce=34041,T.type!==ii&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),T.type=ii,$=s.convert(T.type))),t.texImage2D(3553,0,ce,_e.width,_e.height,0,le,$,null);else if(T.isDataTexture)if(ve.length>0&&I){for(let Me=0,Ie=ve.length;Me<Ie;Me++)se=ve[Me],t.texImage2D(3553,Me,ce,se.width,se.height,0,le,$,se.data);T.generateMipmaps=!1}else t.texImage2D(3553,0,ce,_e.width,_e.height,0,le,$,_e.data);else if(T.isCompressedTexture)for(let Me=0,Ie=ve.length;Me<Ie;Me++)se=ve[Me],T.format!==Ct&&T.format!==On?le!==null?t.compressedTexImage2D(3553,Me,ce,se.width,se.height,0,se.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):t.texImage2D(3553,Me,ce,se.width,se.height,0,le,$,se.data);else if(T.isDataTexture2DArray)t.texImage3D(35866,0,ce,_e.width,_e.height,_e.depth,0,le,$,_e.data);else if(T.isDataTexture3D)t.texImage3D(32879,0,ce,_e.width,_e.height,_e.depth,0,le,$,_e.data);else{const Me=R(T,_e,I),Ie=o&&T.isVideoTexture!==!0,ht=A.__version===void 0;if(ve.length>0&&I){Ie&&ht&&t.texStorage2D(3553,Me,ce,ve[0].width,ve[0].height);for(let qe=0,Wt=ve.length;qe<Wt;qe++)se=ve[qe],Ie?t.texSubImage2D(3553,qe,0,0,le,$,se):t.texImage2D(3553,qe,ce,le,$,se);T.generateMipmaps=!1}else Ie?(ht&&t.texStorage2D(3553,Me,ce,_e.width,_e.height),t.texSubImage2D(3553,0,0,0,le,$,_e)):t.texImage2D(3553,0,ce,le,$,_e)}E(T,I)&&D(j),A.__version=T.version,T.onUpdate&&T.onUpdate(T)}function Q(A,T,J){if(T.image.length!==6)return;xe(A,T),t.activeTexture(33984+J),t.bindTexture(34067,A.__webglTexture),r.pixelStorei(37440,T.flipY),r.pixelStorei(37441,T.premultiplyAlpha),r.pixelStorei(3317,T.unpackAlignment),r.pixelStorei(37443,0);const j=T&&(T.isCompressedTexture||T.image[0].isCompressedTexture),ye=T.image[0]&&T.image[0].isDataTexture,_e=[];for(let Me=0;Me<6;Me++)!j&&!ye?_e[Me]=p(T.image[Me],!1,!0,c):_e[Me]=ye?T.image[Me].image:T.image[Me];const I=_e[0],le=b(I)||o,$=s.convert(T.format),ce=s.convert(T.type),se=_(T.internalFormat,$,ce,T.encoding);ue(34067,T,le);let ve;if(j)for(let Me=0;Me<6;Me++){ve=_e[Me].mipmaps;for(let Ie=0;Ie<ve.length;Ie++){const ht=ve[Ie];T.format!==Ct&&T.format!==On?$!==null?t.compressedTexImage2D(34069+Me,Ie,se,ht.width,ht.height,0,ht.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):t.texImage2D(34069+Me,Ie,se,ht.width,ht.height,0,$,ce,ht.data)}}else{ve=T.mipmaps;for(let Me=0;Me<6;Me++)if(ye){t.texImage2D(34069+Me,0,se,_e[Me].width,_e[Me].height,0,$,ce,_e[Me].data);for(let Ie=0;Ie<ve.length;Ie++){const qe=ve[Ie].image[Me].image;t.texImage2D(34069+Me,Ie+1,se,qe.width,qe.height,0,$,ce,qe.data)}}else{t.texImage2D(34069+Me,0,se,$,ce,_e[Me]);for(let Ie=0;Ie<ve.length;Ie++){const ht=ve[Ie];t.texImage2D(34069+Me,Ie+1,se,$,ce,ht.image[Me])}}}E(T,le)&&D(34067),A.__version=T.version,T.onUpdate&&T.onUpdate(T)}function Se(A,T,J,j,ye){const _e=s.convert(J.format),I=s.convert(J.type),le=_(J.internalFormat,_e,I,J.encoding);n.get(T).__hasExternalTextures||(ye===32879||ye===35866?t.texImage3D(ye,0,le,T.width,T.height,T.depth,0,_e,I,null):t.texImage2D(ye,0,le,T.width,T.height,0,_e,I,null)),t.bindFramebuffer(36160,A),T.useRenderToTexture?f.framebufferTexture2DMultisampleEXT(36160,j,ye,n.get(J).__webglTexture,0,fe(T)):r.framebufferTexture2D(36160,j,ye,n.get(J).__webglTexture,0),t.bindFramebuffer(36160,null)}function Te(A,T,J){if(r.bindRenderbuffer(36161,A),T.depthBuffer&&!T.stencilBuffer){let j=33189;if(J||T.useRenderToTexture){const ye=T.depthTexture;ye&&ye.isDepthTexture&&(ye.type===Nn?j=36012:ye.type===xr&&(j=33190));const _e=fe(T);T.useRenderToTexture?f.renderbufferStorageMultisampleEXT(36161,_e,j,T.width,T.height):r.renderbufferStorageMultisample(36161,_e,j,T.width,T.height)}else r.renderbufferStorage(36161,j,T.width,T.height);r.framebufferRenderbuffer(36160,36096,36161,A)}else if(T.depthBuffer&&T.stencilBuffer){const j=fe(T);J&&T.useRenderbuffer?r.renderbufferStorageMultisample(36161,j,35056,T.width,T.height):T.useRenderToTexture?f.renderbufferStorageMultisampleEXT(36161,j,35056,T.width,T.height):r.renderbufferStorage(36161,34041,T.width,T.height),r.framebufferRenderbuffer(36160,33306,36161,A)}else{const j=T.isWebGLMultipleRenderTargets===!0?T.texture[0]:T.texture,ye=s.convert(j.format),_e=s.convert(j.type),I=_(j.internalFormat,ye,_e,j.encoding),le=fe(T);J&&T.useRenderbuffer?r.renderbufferStorageMultisample(36161,le,I,T.width,T.height):T.useRenderToTexture?f.renderbufferStorageMultisampleEXT(36161,le,I,T.width,T.height):r.renderbufferStorage(36161,I,T.width,T.height)}r.bindRenderbuffer(36161,null)}function oe(A,T){if(T&&T.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(36160,A),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(T.depthTexture).__webglTexture||T.depthTexture.image.width!==T.width||T.depthTexture.image.height!==T.height)&&(T.depthTexture.image.width=T.width,T.depthTexture.image.height=T.height,T.depthTexture.needsUpdate=!0),W(T.depthTexture,0);const j=n.get(T.depthTexture).__webglTexture,ye=fe(T);if(T.depthTexture.format===ri)T.useRenderToTexture?f.framebufferTexture2DMultisampleEXT(36160,36096,3553,j,0,ye):r.framebufferTexture2D(36160,36096,3553,j,0);else if(T.depthTexture.format===si)T.useRenderToTexture?f.framebufferTexture2DMultisampleEXT(36160,33306,3553,j,0,ye):r.framebufferTexture2D(36160,33306,3553,j,0);else throw new Error("Unknown depthTexture format")}function ge(A){const T=n.get(A),J=A.isWebGLCubeRenderTarget===!0;if(A.depthTexture&&!T.__autoAllocateDepthBuffer){if(J)throw new Error("target.depthTexture not supported in Cube render targets");oe(T.__webglFramebuffer,A)}else if(J){T.__webglDepthbuffer=[];for(let j=0;j<6;j++)t.bindFramebuffer(36160,T.__webglFramebuffer[j]),T.__webglDepthbuffer[j]=r.createRenderbuffer(),Te(T.__webglDepthbuffer[j],A,!1)}else t.bindFramebuffer(36160,T.__webglFramebuffer),T.__webglDepthbuffer=r.createRenderbuffer(),Te(T.__webglDepthbuffer,A,!1);t.bindFramebuffer(36160,null)}function Ue(A,T,J){const j=n.get(A);T!==void 0&&Se(j.__webglFramebuffer,A,A.texture,36064,3553),J!==void 0&&ge(A)}function X(A){const T=A.texture,J=n.get(A),j=n.get(T);A.addEventListener("dispose",P),A.isWebGLMultipleRenderTargets!==!0&&(j.__webglTexture===void 0&&(j.__webglTexture=r.createTexture()),j.__version=T.version,a.memory.textures++);const ye=A.isWebGLCubeRenderTarget===!0,_e=A.isWebGLMultipleRenderTargets===!0,I=T.isDataTexture3D||T.isDataTexture2DArray,le=b(A)||o;if(o&&T.format===On&&(T.type===Nn||T.type===Mi)&&(T.format=Ct,console.warn("THREE.WebGLRenderer: Rendering to textures with RGB format is not supported. Using RGBA format instead.")),ye){J.__webglFramebuffer=[];for(let $=0;$<6;$++)J.__webglFramebuffer[$]=r.createFramebuffer()}else if(J.__webglFramebuffer=r.createFramebuffer(),_e)if(i.drawBuffers){const $=A.texture;for(let ce=0,se=$.length;ce<se;ce++){const ve=n.get($[ce]);ve.__webglTexture===void 0&&(ve.__webglTexture=r.createTexture(),a.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");else if(A.useRenderbuffer)if(o){J.__webglMultisampledFramebuffer=r.createFramebuffer(),J.__webglColorRenderbuffer=r.createRenderbuffer(),r.bindRenderbuffer(36161,J.__webglColorRenderbuffer);const $=s.convert(T.format),ce=s.convert(T.type),se=_(T.internalFormat,$,ce,T.encoding),ve=fe(A);r.renderbufferStorageMultisample(36161,ve,se,A.width,A.height),t.bindFramebuffer(36160,J.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(36160,36064,36161,J.__webglColorRenderbuffer),r.bindRenderbuffer(36161,null),A.depthBuffer&&(J.__webglDepthRenderbuffer=r.createRenderbuffer(),Te(J.__webglDepthRenderbuffer,A,!0)),t.bindFramebuffer(36160,null)}else console.warn("THREE.WebGLRenderer: WebGLMultisampleRenderTarget can only be used with WebGL2.");if(ye){t.bindTexture(34067,j.__webglTexture),ue(34067,T,le);for(let $=0;$<6;$++)Se(J.__webglFramebuffer[$],A,T,36064,34069+$);E(T,le)&&D(34067),t.unbindTexture()}else if(_e){const $=A.texture;for(let ce=0,se=$.length;ce<se;ce++){const ve=$[ce],Me=n.get(ve);t.bindTexture(3553,Me.__webglTexture),ue(3553,ve,le),Se(J.__webglFramebuffer,A,ve,36064+ce,3553),E(ve,le)&&D(3553)}t.unbindTexture()}else{let $=3553;I&&(o?$=T.isDataTexture3D?32879:35866:console.warn("THREE.DataTexture3D and THREE.DataTexture2DArray only supported with WebGL2.")),t.bindTexture($,j.__webglTexture),ue($,T,le),Se(J.__webglFramebuffer,A,T,36064,$),E(T,le)&&D($),t.unbindTexture()}A.depthBuffer&&ge(A)}function te(A){const T=b(A)||o,J=A.isWebGLMultipleRenderTargets===!0?A.texture:[A.texture];for(let j=0,ye=J.length;j<ye;j++){const _e=J[j];if(E(_e,T)){const I=A.isWebGLCubeRenderTarget?34067:3553,le=n.get(_e).__webglTexture;t.bindTexture(I,le),D(I),t.unbindTexture()}}}function ie(A){if(A.useRenderbuffer)if(o){const T=A.width,J=A.height;let j=16384;const ye=[36064],_e=A.stencilBuffer?33306:36096;A.depthBuffer&&ye.push(_e),A.ignoreDepthForMultisampleCopy||(A.depthBuffer&&(j|=256),A.stencilBuffer&&(j|=1024));const I=n.get(A);t.bindFramebuffer(36008,I.__webglMultisampledFramebuffer),t.bindFramebuffer(36009,I.__webglFramebuffer),A.ignoreDepthForMultisampleCopy&&(r.invalidateFramebuffer(36008,[_e]),r.invalidateFramebuffer(36009,[_e])),r.blitFramebuffer(0,0,T,J,0,0,T,J,j,9728),r.invalidateFramebuffer(36008,ye),t.bindFramebuffer(36008,null),t.bindFramebuffer(36009,I.__webglMultisampledFramebuffer)}else console.warn("THREE.WebGLRenderer: WebGLMultisampleRenderTarget can only be used with WebGL2.")}function fe(A){return o&&(A.useRenderbuffer||A.useRenderToTexture)?Math.min(u,A.samples):0}function re(A){const T=a.render.frame;g.get(A)!==T&&(g.set(A,T),A.update())}let Ce=!1,Pe=!1;function Be(A,T){A&&A.isWebGLRenderTarget&&(Ce===!1&&(console.warn("THREE.WebGLTextures.safeSetTexture2D: don't use render targets as textures. Use their .texture property instead."),Ce=!0),A=A.texture),W(A,T)}function Je(A,T){A&&A.isWebGLCubeRenderTarget&&(Pe===!1&&(console.warn("THREE.WebGLTextures.safeSetTextureCube: don't use cube render targets as textures. Use their .texture property instead."),Pe=!0),A=A.texture),q(A,T)}this.allocateTextureUnit=V,this.resetTextureUnits=H,this.setTexture2D=W,this.setTexture2DArray=ae,this.setTexture3D=me,this.setTextureCube=q,this.rebindTextures=Ue,this.setupRenderTarget=X,this.updateRenderTargetMipmap=te,this.updateMultisampleRenderTarget=ie,this.setupDepthRenderbuffer=ge,this.setupFrameBufferTexture=Se,this.safeSetTexture2D=Be,this.safeSetTextureCube=Je}function vx(r,e,t){const n=t.isWebGL2;function i(s){let a;if(s===nn)return 5121;if(s===Dd)return 32819;if(s===Id)return 32820;if(s===Fd)return 33635;if(s===Ld)return 5120;if(s===Rd)return 5122;if(s===vr)return 5123;if(s===Pd)return 5124;if(s===xr)return 5125;if(s===Nn)return 5126;if(s===Mi)return n?5131:(a=e.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(s===Nd)return 6406;if(s===On)return 6407;if(s===Ct)return 6408;if(s===Od)return 6409;if(s===Bd)return 6410;if(s===ri)return 6402;if(s===si)return 34041;if(s===zd)return 6403;if(s===Vd)return 36244;if(s===kd)return 33319;if(s===Hd)return 33320;if(s===Gd)return 36248;if(s===Wd)return 36249;if(s===ql||s===Yl||s===Zl||s===jl)if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(s===ql)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(s===Yl)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(s===Zl)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(s===jl)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(s===Jl||s===$l||s===Ql||s===Kl)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(s===Jl)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(s===$l)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(s===Ql)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(s===Kl)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(s===Xd)return a=e.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if((s===ec||s===tc)&&(a=e.get("WEBGL_compressed_texture_etc"),a!==null)){if(s===ec)return a.COMPRESSED_RGB8_ETC2;if(s===tc)return a.COMPRESSED_RGBA8_ETC2_EAC}if(s===qd||s===Yd||s===Zd||s===jd||s===Jd||s===$d||s===Qd||s===Kd||s===ef||s===tf||s===nf||s===rf||s===sf||s===af||s===lf||s===cf||s===hf||s===uf||s===df||s===ff||s===pf||s===mf||s===gf||s===vf||s===xf||s===_f||s===yf||s===Mf)return a=e.get("WEBGL_compressed_texture_astc"),a!==null?s:null;if(s===of)return a=e.get("EXT_texture_compression_bptc"),a!==null?s:null;if(s===ii)return n?34042:(a=e.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null)}return{convert:i}}class uh extends Bt{constructor(e=[]){super();this.cameras=e}}uh.prototype.isArrayCamera=!0;class Rr extends $e{constructor(){super();this.type="Group"}}Rr.prototype.isGroup=!0;const xx={type:"move"};class Ao{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Rr,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Rr,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new C,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new C),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Rr,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new C,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new C),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,s=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred")if(o!==null&&(i=t.getPose(e.targetRaySpace,n),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(xx))),c&&e.hand){a=!0;for(const v of e.hand.values()){const w=t.getJointPose(v,n);if(c.joints[v.jointName]===void 0){const p=new Rr;p.matrixAutoUpdate=!1,p.visible=!1,c.joints[v.jointName]=p,c.add(p)}const m=c.joints[v.jointName];w!==null&&(m.matrix.fromArray(w.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.jointRadius=w.radius),m.visible=w!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;c.inputState.pinching&&d>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));return o!==null&&(o.visible=i!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}}class Hs extends Et{constructor(e,t,n,i,s,a,o,l,c,h){if(h=h!==void 0?h:ri,h!==ri&&h!==si)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===ri&&(n=vr),n===void 0&&h===si&&(n=ii);super(null,i,s,a,o,l,h,n,c);this.image={width:e,height:t},this.magFilter=o!==void 0?o:_t,this.minFilter=l!==void 0?l:_t,this.flipY=!1,this.generateMipmaps=!1}}Hs.prototype.isDepthTexture=!0;class _x extends Tn{constructor(e,t){super();const n=this;let i=null,s=1,a=null,o="local-floor";const l=e.extensions.has("WEBGL_multisampled_render_to_texture");let c=null,h=null,u=null,d=null,f=!1,g=null;const v=t.getContextAttributes();let w=null,m=null;const p=[],b=new Map,M=new Bt;M.layers.enable(1),M.viewport=new it;const E=new Bt;E.layers.enable(2),E.viewport=new it;const D=[M,E],_=new uh;_.layers.enable(1),_.layers.enable(2);let R=null,F=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let Y=p[q];return Y===void 0&&(Y=new Ao,p[q]=Y),Y.getTargetRaySpace()},this.getControllerGrip=function(q){let Y=p[q];return Y===void 0&&(Y=new Ao,p[q]=Y),Y.getGripSpace()},this.getHand=function(q){let Y=p[q];return Y===void 0&&(Y=new Ao,p[q]=Y),Y.getHandSpace()};function z(q){const Y=b.get(q.inputSource);Y&&Y.dispatchEvent({type:q.type,data:q.inputSource})}function P(){b.forEach(function(q,Y){q.disconnect(Y)}),b.clear(),R=null,F=null,e.setRenderTarget(w),d=null,u=null,h=null,i=null,m=null,me.stop(),n.isPresenting=!1,n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(q){s=q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){o=q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return a},this.getBaseLayer=function(){return u!==null?u:d},this.getBinding=function(){return h},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(q){if(i=q,i!==null){if(w=e.getRenderTarget(),i.addEventListener("select",z),i.addEventListener("selectstart",z),i.addEventListener("selectend",z),i.addEventListener("squeeze",z),i.addEventListener("squeezestart",z),i.addEventListener("squeezeend",z),i.addEventListener("end",P),i.addEventListener("inputsourceschange",ne),v.xrCompatible!==!0&&await t.makeXRCompatible(),i.renderState.layers===void 0||e.capabilities.isWebGL2===!1){const Y={antialias:i.renderState.layers===void 0?v.antialias:!0,alpha:v.alpha,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:s};d=new XRWebGLLayer(i,t,Y),i.updateRenderState({baseLayer:d}),m=new Yt(d.framebufferWidth,d.framebufferHeight)}else{f=v.antialias;let Y=null,de=null,ue=null;v.depth&&(ue=v.stencil?35056:33189,Y=v.stencil?si:ri,de=v.stencil?ii:vr);const xe={colorFormat:v.alpha||f?32856:32849,depthFormat:ue,scaleFactor:s};h=new XRWebGLBinding(i,t),u=h.createProjectionLayer(xe),i.updateRenderState({layers:[u]}),f?m=new br(u.textureWidth,u.textureHeight,{format:Ct,type:nn,depthTexture:new Hs(u.textureWidth,u.textureHeight,de,void 0,void 0,void 0,void 0,void 0,void 0,Y),stencilBuffer:v.stencil,ignoreDepth:u.ignoreDepthValues,useRenderToTexture:l}):m=new Yt(u.textureWidth,u.textureHeight,{format:v.alpha?Ct:On,type:nn,depthTexture:new Hs(u.textureWidth,u.textureHeight,de,void 0,void 0,void 0,void 0,void 0,void 0,Y),stencilBuffer:v.stencil,ignoreDepth:u.ignoreDepthValues})}this.setFoveation(0),a=await i.requestReferenceSpace(o),me.setContext(i),me.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}};function ne(q){const Y=i.inputSources;for(let de=0;de<p.length;de++)b.set(Y[de],p[de]);for(let de=0;de<q.removed.length;de++){const ue=q.removed[de],xe=b.get(ue);xe&&(xe.dispatchEvent({type:"disconnected",data:ue}),b.delete(ue))}for(let de=0;de<q.added.length;de++){const ue=q.added[de],xe=b.get(ue);xe&&xe.dispatchEvent({type:"connected",data:ue})}}const U=new C,N=new C;function H(q,Y,de){U.setFromMatrixPosition(Y.matrixWorld),N.setFromMatrixPosition(de.matrixWorld);const ue=U.distanceTo(N),xe=Y.projectionMatrix.elements,Xe=de.projectionMatrix.elements,Q=xe[14]/(xe[10]-1),Se=xe[14]/(xe[10]+1),Te=(xe[9]+1)/xe[5],oe=(xe[9]-1)/xe[5],ge=(xe[8]-1)/xe[0],Ue=(Xe[8]+1)/Xe[0],X=Q*ge,te=Q*Ue,ie=ue/(-ge+Ue),fe=ie*-ge;Y.matrixWorld.decompose(q.position,q.quaternion,q.scale),q.translateX(fe),q.translateZ(ie),q.matrixWorld.compose(q.position,q.quaternion,q.scale),q.matrixWorldInverse.copy(q.matrixWorld).invert();const re=Q+ie,Ce=Se+ie,Pe=X-fe,Be=te+(ue-fe),Je=Te*Se/Ce*re,A=oe*Se/Ce*re;q.projectionMatrix.makePerspective(Pe,Be,Je,A,re,Ce)}function V(q,Y){Y===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices(Y.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(i===null)return;_.near=E.near=M.near=q.near,_.far=E.far=M.far=q.far,(R!==_.near||F!==_.far)&&(i.updateRenderState({depthNear:_.near,depthFar:_.far}),R=_.near,F=_.far);const Y=q.parent,de=_.cameras;V(_,Y);for(let xe=0;xe<de.length;xe++)V(de[xe],Y);_.matrixWorld.decompose(_.position,_.quaternion,_.scale),q.position.copy(_.position),q.quaternion.copy(_.quaternion),q.scale.copy(_.scale),q.matrix.copy(_.matrix),q.matrixWorld.copy(_.matrixWorld);const ue=q.children;for(let xe=0,Xe=ue.length;xe<Xe;xe++)ue[xe].updateMatrixWorld(!0);de.length===2?H(_,M,E):_.projectionMatrix.copy(M.projectionMatrix)},this.getCamera=function(){return _},this.getFoveation=function(){if(u!==null)return u.fixedFoveation;if(d!==null)return d.fixedFoveation},this.setFoveation=function(q){u!==null&&(u.fixedFoveation=q),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=q)};let W=null;function ae(q,Y){if(c=Y.getViewerPose(a),g=Y,c!==null){const ue=c.views;d!==null&&(e.setRenderTargetFramebuffer(m,d.framebuffer),e.setRenderTarget(m));let xe=!1;ue.length!==_.cameras.length&&(_.cameras.length=0,xe=!0);for(let Xe=0;Xe<ue.length;Xe++){const Q=ue[Xe];let Se=null;if(d!==null)Se=d.getViewport(Q);else{const oe=h.getViewSubImage(u,Q);Se=oe.viewport,Xe===0&&(e.setRenderTargetTextures(m,oe.colorTexture,u.ignoreDepthValues?void 0:oe.depthStencilTexture),e.setRenderTarget(m))}const Te=D[Xe];Te.matrix.fromArray(Q.transform.matrix),Te.projectionMatrix.fromArray(Q.projectionMatrix),Te.viewport.set(Se.x,Se.y,Se.width,Se.height),Xe===0&&_.matrix.copy(Te.matrix),xe===!0&&_.cameras.push(Te)}}const de=i.inputSources;for(let ue=0;ue<p.length;ue++){const xe=p[ue],Xe=de[ue];xe.update(Xe,Y,a)}W&&W(q,Y),g=null}const me=new Cc;me.setAnimationLoop(ae),this.setAnimationLoop=function(q){W=q},this.dispose=function(){}}}function yx(r){function e(m,p){m.fogColor.value.copy(p.color),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function t(m,p,b,M,E){p.isMeshBasicMaterial?n(m,p):p.isMeshLambertMaterial?(n(m,p),l(m,p)):p.isMeshToonMaterial?(n(m,p),h(m,p)):p.isMeshPhongMaterial?(n(m,p),c(m,p)):p.isMeshStandardMaterial?(n(m,p),p.isMeshPhysicalMaterial?d(m,p,E):u(m,p)):p.isMeshMatcapMaterial?(n(m,p),f(m,p)):p.isMeshDepthMaterial?(n(m,p),g(m,p)):p.isMeshDistanceMaterial?(n(m,p),v(m,p)):p.isMeshNormalMaterial?(n(m,p),w(m,p)):p.isLineBasicMaterial?(i(m,p),p.isLineDashedMaterial&&s(m,p)):p.isPointsMaterial?a(m,p,b,M):p.isSpriteMaterial?o(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function n(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map),p.alphaMap&&(m.alphaMap.value=p.alphaMap),p.specularMap&&(m.specularMap.value=p.specularMap),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const b=r.get(p).envMap;b&&(m.envMap.value=b,m.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity);let M;p.map?M=p.map:p.specularMap?M=p.specularMap:p.displacementMap?M=p.displacementMap:p.normalMap?M=p.normalMap:p.bumpMap?M=p.bumpMap:p.roughnessMap?M=p.roughnessMap:p.metalnessMap?M=p.metalnessMap:p.alphaMap?M=p.alphaMap:p.emissiveMap?M=p.emissiveMap:p.clearcoatMap?M=p.clearcoatMap:p.clearcoatNormalMap?M=p.clearcoatNormalMap:p.clearcoatRoughnessMap?M=p.clearcoatRoughnessMap:p.specularIntensityMap?M=p.specularIntensityMap:p.specularColorMap?M=p.specularColorMap:p.transmissionMap?M=p.transmissionMap:p.thicknessMap?M=p.thicknessMap:p.sheenColorMap?M=p.sheenColorMap:p.sheenRoughnessMap&&(M=p.sheenRoughnessMap),M!==void 0&&(M.isWebGLRenderTarget&&(M=M.texture),M.matrixAutoUpdate===!0&&M.updateMatrix(),m.uvTransform.value.copy(M.matrix));let E;p.aoMap?E=p.aoMap:p.lightMap&&(E=p.lightMap),E!==void 0&&(E.isWebGLRenderTarget&&(E=E.texture),E.matrixAutoUpdate===!0&&E.updateMatrix(),m.uv2Transform.value.copy(E.matrix))}function i(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity}function s(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function a(m,p,b,M){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*b,m.scale.value=M*.5,p.map&&(m.map.value=p.map),p.alphaMap&&(m.alphaMap.value=p.alphaMap),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);let E;p.map?E=p.map:p.alphaMap&&(E=p.alphaMap),E!==void 0&&(E.matrixAutoUpdate===!0&&E.updateMatrix(),m.uvTransform.value.copy(E.matrix))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map),p.alphaMap&&(m.alphaMap.value=p.alphaMap),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);let b;p.map?b=p.map:p.alphaMap&&(b=p.alphaMap),b!==void 0&&(b.matrixAutoUpdate===!0&&b.updateMatrix(),m.uvTransform.value.copy(b.matrix))}function l(m,p){p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap)}function c(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap),p.bumpMap&&(m.bumpMap.value=p.bumpMap,m.bumpScale.value=p.bumpScale,p.side===lt&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,m.normalScale.value.copy(p.normalScale),p.side===lt&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias)}function h(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap),p.bumpMap&&(m.bumpMap.value=p.bumpMap,m.bumpScale.value=p.bumpScale,p.side===lt&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,m.normalScale.value.copy(p.normalScale),p.side===lt&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias)}function u(m,p){m.roughness.value=p.roughness,m.metalness.value=p.metalness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap),p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap),p.bumpMap&&(m.bumpMap.value=p.bumpMap,m.bumpScale.value=p.bumpScale,p.side===lt&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,m.normalScale.value.copy(p.normalScale),p.side===lt&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),r.get(p).envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function d(m,p,b){u(m,p),m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap)),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap),p.clearcoatNormalMap&&(m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),m.clearcoatNormalMap.value=p.clearcoatNormalMap,p.side===lt&&m.clearcoatNormalScale.value.negate())),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=b.texture,m.transmissionSamplerSize.value.set(b.width,b.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap)}function f(m,p){p.matcap&&(m.matcap.value=p.matcap),p.bumpMap&&(m.bumpMap.value=p.bumpMap,m.bumpScale.value=p.bumpScale,p.side===lt&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,m.normalScale.value.copy(p.normalScale),p.side===lt&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias)}function g(m,p){p.displacementMap&&(m.displacementMap.value=p.displacementMap,m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias)}function v(m,p){p.displacementMap&&(m.displacementMap.value=p.displacementMap,m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),m.referencePosition.value.copy(p.referencePosition),m.nearDistance.value=p.nearDistance,m.farDistance.value=p.farDistance}function w(m,p){p.bumpMap&&(m.bumpMap.value=p.bumpMap,m.bumpScale.value=p.bumpScale,p.side===lt&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,m.normalScale.value.copy(p.normalScale),p.side===lt&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias)}return{refreshFogUniforms:e,refreshMaterialUniforms:t}}function Mx(){const r=vs("canvas");return r.style.display="block",r}function tt(r={}){const e=r.canvas!==void 0?r.canvas:Mx(),t=r.context!==void 0?r.context:null,n=r.alpha!==void 0?r.alpha:!1,i=r.depth!==void 0?r.depth:!0,s=r.stencil!==void 0?r.stencil:!0,a=r.antialias!==void 0?r.antialias:!1,o=r.premultipliedAlpha!==void 0?r.premultipliedAlpha:!0,l=r.preserveDrawingBuffer!==void 0?r.preserveDrawingBuffer:!1,c=r.powerPreference!==void 0?r.powerPreference:"default",h=r.failIfMajorPerformanceCaveat!==void 0?r.failIfMajorPerformanceCaveat:!1;let u=null,d=null;const f=[],g=[];this.domElement=e,this.debug={checkShaderErrors:!0},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.gammaFactor=2,this.outputEncoding=kt,this.physicallyCorrectLights=!1,this.toneMapping=ni,this.toneMappingExposure=1;const v=this;let w=!1,m=0,p=0,b=null,M=-1,E=null;const D=new it,_=new it;let R=null,F=e.width,z=e.height,P=1,ne=null,U=null;const N=new it(0,0,F,z),H=new it(0,0,F,z);let V=!1;const W=[],ae=new Bs;let me=!1,q=!1,Y=null;const de=new Le,ue=new C,xe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Xe(){return b===null?P:1}let Q=t;function Se(S,O){for(let G=0;G<S.length;G++){const k=S[G],Z=e.getContext(k,O);if(Z!==null)return Z}return null}try{const S={alpha:n,depth:i,stencil:s,antialias:a,premultipliedAlpha:o,preserveDrawingBuffer:l,powerPreference:c,failIfMajorPerformanceCaveat:h};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Da}`),e.addEventListener("webglcontextlost",Me,!1),e.addEventListener("webglcontextrestored",Ie,!1),Q===null){const O=["webgl2","webgl","experimental-webgl"];if(v.isWebGL1Renderer===!0&&O.shift(),Q=Se(O,S),Q===null)throw Se(O)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}Q.getShaderPrecisionFormat===void 0&&(Q.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(S){throw console.error("THREE.WebGLRenderer: "+S.message),S}let Te,oe,ge,Ue,X,te,ie,fe,re,Ce,Pe,Be,Je,A,T,J,j,ye,_e,I,le,$,ce;function se(){Te=new Wg(Q),oe=new Og(Q,Te,r),Te.init(oe),$=new vx(Q,Te,oe),ge=new mx(Q,Te,oe),W[0]=1029,Ue=new Yg(Q),X=new rx,te=new gx(Q,Te,ge,X,oe,$,Ue),ie=new Ug(v),fe=new Gg(v),re=new ap(Q,oe),ce=new Fg(Q,Te,re,oe),Ce=new Xg(Q,re,Ue,ce),Pe=new $g(Q,Ce,re,Ue),_e=new Jg(Q,oe,te),J=new Bg(X),Be=new ix(v,ie,fe,Te,oe,ce,J),Je=new yx(X),A=new ax(X),T=new dx(Te,oe),ye=new Ig(v,ie,ge,Pe,o),j=new hh(v,Pe,oe),I=new Ng(Q,Te,Ue,oe),le=new qg(Q,Te,Ue,oe),Ue.programs=Be.programs,v.capabilities=oe,v.extensions=Te,v.properties=X,v.renderLists=A,v.shadowMap=j,v.state=ge,v.info=Ue}se();const ve=new _x(v,Q);this.xr=ve,this.getContext=function(){return Q},this.getContextAttributes=function(){return Q.getContextAttributes()},this.forceContextLoss=function(){const S=Te.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){const S=Te.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return P},this.setPixelRatio=function(S){S!==void 0&&(P=S,this.setSize(F,z,!1))},this.getSize=function(S){return S.set(F,z)},this.setSize=function(S,O,G){if(ve.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}F=S,z=O,e.width=Math.floor(S*P),e.height=Math.floor(O*P),G!==!1&&(e.style.width=S+"px",e.style.height=O+"px"),this.setViewport(0,0,S,O)},this.getDrawingBufferSize=function(S){return S.set(F*P,z*P).floor()},this.setDrawingBufferSize=function(S,O,G){F=S,z=O,P=G,e.width=Math.floor(S*G),e.height=Math.floor(O*G),this.setViewport(0,0,S,O)},this.getCurrentViewport=function(S){return S.copy(D)},this.getViewport=function(S){return S.copy(N)},this.setViewport=function(S,O,G,k){S.isVector4?N.set(S.x,S.y,S.z,S.w):N.set(S,O,G,k),ge.viewport(D.copy(N).multiplyScalar(P).floor())},this.getScissor=function(S){return S.copy(H)},this.setScissor=function(S,O,G,k){S.isVector4?H.set(S.x,S.y,S.z,S.w):H.set(S,O,G,k),ge.scissor(_.copy(H).multiplyScalar(P).floor())},this.getScissorTest=function(){return V},this.setScissorTest=function(S){ge.setScissorTest(V=S)},this.setOpaqueSort=function(S){ne=S},this.setTransparentSort=function(S){U=S},this.getClearColor=function(S){return S.copy(ye.getClearColor())},this.setClearColor=function(){ye.setClearColor.apply(ye,arguments)},this.getClearAlpha=function(){return ye.getClearAlpha()},this.setClearAlpha=function(){ye.setClearAlpha.apply(ye,arguments)},this.clear=function(S,O,G){let k=0;(S===void 0||S)&&(k|=16384),(O===void 0||O)&&(k|=256),(G===void 0||G)&&(k|=1024),Q.clear(k)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",Me,!1),e.removeEventListener("webglcontextrestored",Ie,!1),A.dispose(),T.dispose(),X.dispose(),ie.dispose(),fe.dispose(),Pe.dispose(),ce.dispose(),ve.dispose(),ve.removeEventListener("sessionstart",$r),ve.removeEventListener("sessionend",or),Y&&(Y.dispose(),Y=null),cn.stop()};function Me(S){S.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function Ie(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;const S=Ue.autoReset,O=j.enabled,G=j.autoUpdate,k=j.needsUpdate,Z=j.type;se(),Ue.autoReset=S,j.enabled=O,j.autoUpdate=G,j.needsUpdate=k,j.type=Z}function ht(S){const O=S.target;O.removeEventListener("dispose",ht),qe(O)}function qe(S){Wt(S),X.remove(S)}function Wt(S){const O=X.get(S).programs;O!==void 0&&O.forEach(function(G){Be.releaseProgram(G)})}this.renderBufferDirect=function(S,O,G,k,Z,De){O===null&&(O=xe);const Ae=Z.isMesh&&Z.matrixWorld.determinant()<0,Oe=ga(S,O,G,k,Z);ge.setMaterial(k,Ae);let Re=G.index;const He=G.attributes.position;if(Re===null){if(He===void 0||He.count===0)return}else if(Re.count===0)return;let Fe=1;k.wireframe===!0&&(Re=Ce.getWireframeAttribute(G),Fe=2),ce.setup(Z,k,Oe,G,Re);let Ne,et=I;Re!==null&&(Ne=re.get(Re),et=le,et.setIndex(Ne));const Xt=Re!==null?Re.count:He.count,Ge=G.drawRange.start*Fe,Mn=G.drawRange.count*Fe,nt=De!==null?De.start*Fe:0,wn=De!==null?De.count*Fe:1/0,Jt=Math.max(Ge,nt),gt=Math.min(Xt,Ge+Mn,nt+wn)-1,It=Math.max(0,gt-Jt+1);if(It!==0){if(Z.isMesh)k.wireframe===!0?(ge.setLineWidth(k.wireframeLinewidth*Xe()),et.setMode(1)):et.setMode(4);else if(Z.isLine){let Ze=k.linewidth;Ze===void 0&&(Ze=1),ge.setLineWidth(Ze*Xe()),Z.isLineSegments?et.setMode(1):Z.isLineLoop?et.setMode(2):et.setMode(3)}else Z.isPoints?et.setMode(0):Z.isSprite&&et.setMode(4);if(Z.isInstancedMesh)et.renderInstances(Jt,It,Z.count);else if(G.isInstancedBufferGeometry){const Ze=Math.min(G.instanceCount,G._maxInstanceCount);et.renderInstances(Jt,It,Ze)}else et.render(Jt,It)}},this.compile=function(S,O){d=T.get(S),d.init(),g.push(d),S.traverseVisible(function(G){G.isLight&&G.layers.test(O.layers)&&(d.pushLight(G),G.castShadow&&d.pushShadow(G))}),d.setupLights(v.physicallyCorrectLights),S.traverse(function(G){const k=G.material;if(k)if(Array.isArray(k))for(let Z=0;Z<k.length;Z++){const De=k[Z];lr(De,S,G)}else lr(k,S,G)}),g.pop(),d=null};let At=null;function pa(S){At&&At(S)}function $r(){cn.stop()}function or(){cn.start()}const cn=new Cc;cn.setAnimationLoop(pa),typeof window!="undefined"&&cn.setContext(window),this.setAnimationLoop=function(S){At=S,ve.setAnimationLoop(S),S===null?cn.stop():cn.start()},ve.addEventListener("sessionstart",$r),ve.addEventListener("sessionend",or),this.render=function(S,O){if(O!==void 0&&O.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;S.autoUpdate===!0&&S.updateMatrixWorld(),O.parent===null&&O.updateMatrixWorld(),ve.enabled===!0&&ve.isPresenting===!0&&(ve.cameraAutoUpdate===!0&&ve.updateCamera(O),O=ve.getCamera()),S.isScene===!0&&S.onBeforeRender(v,S,O,b),d=T.get(S,g.length),d.init(),g.push(d),de.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),ae.setFromProjectionMatrix(de),q=this.localClippingEnabled,me=J.init(this.clippingPlanes,q,O),u=A.get(S,f.length),u.init(),f.push(u),pi(S,O,0,v.sortObjects),u.finish(),v.sortObjects===!0&&u.sort(ne,U),me===!0&&J.beginShadows();const G=d.state.shadowsArray;if(j.render(G,S,O),me===!0&&J.endShadows(),this.info.autoReset===!0&&this.info.reset(),ye.render(u,S),d.setupLights(v.physicallyCorrectLights),O.isArrayCamera){const k=O.cameras;for(let Z=0,De=k.length;Z<De;Z++){const Ae=k[Z];Qr(u,S,Ae,Ae.viewport)}}else Qr(u,S,O);b!==null&&(te.updateMultisampleRenderTarget(b),te.updateRenderTargetMipmap(b)),S.isScene===!0&&S.onAfterRender(v,S,O),ge.buffers.depth.setTest(!0),ge.buffers.depth.setMask(!0),ge.buffers.color.setMask(!0),ge.setPolygonOffset(!1),ce.resetDefaultState(),M=-1,E=null,g.pop(),g.length>0?d=g[g.length-1]:d=null,f.pop(),f.length>0?u=f[f.length-1]:u=null};function pi(S,O,G,k){if(S.visible===!1)return;if(S.layers.test(O.layers)){if(S.isGroup)G=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(O);else if(S.isLight)d.pushLight(S),S.castShadow&&d.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||ae.intersectsSprite(S)){k&&ue.setFromMatrixPosition(S.matrixWorld).applyMatrix4(de);const Ae=Pe.update(S),Oe=S.material;Oe.visible&&u.push(S,Ae,Oe,G,ue.z,null)}}else if((S.isMesh||S.isLine||S.isPoints)&&(S.isSkinnedMesh&&S.skeleton.frame!==Ue.render.frame&&(S.skeleton.update(),S.skeleton.frame=Ue.render.frame),!S.frustumCulled||ae.intersectsObject(S))){k&&ue.setFromMatrixPosition(S.matrixWorld).applyMatrix4(de);const Ae=Pe.update(S),Oe=S.material;if(Array.isArray(Oe)){const Re=Ae.groups;for(let He=0,Fe=Re.length;He<Fe;He++){const Ne=Re[He],et=Oe[Ne.materialIndex];et&&et.visible&&u.push(S,Ae,et,G,ue.z,Ne)}}else Oe.visible&&u.push(S,Ae,Oe,G,ue.z,null)}}const De=S.children;for(let Ae=0,Oe=De.length;Ae<Oe;Ae++)pi(De[Ae],O,G,k)}function Qr(S,O,G,k){const Z=S.opaque,De=S.transmissive,Ae=S.transparent;d.setupLightsView(G),De.length>0&&ma(Z,O,G),k&&ge.viewport(D.copy(k)),Z.length>0&&mi(Z,O,G),De.length>0&&mi(De,O,G),Ae.length>0&&mi(Ae,O,G)}function ma(S,O,G){if(Y===null){const Ae=a===!0&&oe.isWebGL2===!0?br:Yt;Y=new Ae(1024,1024,{generateMipmaps:!0,type:$.convert(Mi)!==null?Mi:nn,minFilter:hs,magFilter:_t,wrapS:qt,wrapT:qt,useRenderToTexture:Te.has("WEBGL_multisampled_render_to_texture")})}const k=v.getRenderTarget();v.setRenderTarget(Y),v.clear();const Z=v.toneMapping;v.toneMapping=ni,mi(S,O,G),v.toneMapping=Z,te.updateMultisampleRenderTarget(Y),te.updateRenderTargetMipmap(Y),v.setRenderTarget(k)}function mi(S,O,G){const k=O.isScene===!0?O.overrideMaterial:null;for(let Z=0,De=S.length;Z<De;Z++){const Ae=S[Z],Oe=Ae.object,Re=Ae.geometry,He=k===null?Ae.material:k,Fe=Ae.group;Oe.layers.test(G.layers)&&Kr(Oe,O,G,Re,He,Fe)}}function Kr(S,O,G,k,Z,De){S.onBeforeRender(v,O,G,k,Z,De),S.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),Z.onBeforeRender(v,O,G,k,S,De),Z.transparent===!0&&Z.side===pn?(Z.side=lt,Z.needsUpdate=!0,v.renderBufferDirect(G,O,k,Z,S,De),Z.side=_i,Z.needsUpdate=!0,v.renderBufferDirect(G,O,k,Z,S,De),Z.side=pn):v.renderBufferDirect(G,O,k,Z,S,De),S.onAfterRender(v,O,G,k,Z,De)}function lr(S,O,G){O.isScene!==!0&&(O=xe);const k=X.get(S),Z=d.state.lights,De=d.state.shadowsArray,Ae=Z.state.version,Oe=Be.getParameters(S,Z.state,De,O,G),Re=Be.getProgramCacheKey(Oe);let He=k.programs;k.environment=S.isMeshStandardMaterial?O.environment:null,k.fog=O.fog,k.envMap=(S.isMeshStandardMaterial?fe:ie).get(S.envMap||k.environment),He===void 0&&(S.addEventListener("dispose",ht),He=new Map,k.programs=He);let Fe=He.get(Re);if(Fe!==void 0){if(k.currentProgram===Fe&&k.lightsStateVersion===Ae)return es(S,Oe),Fe}else Oe.uniforms=Be.getUniforms(S),S.onBuild(G,Oe,v),S.onBeforeCompile(Oe,v),Fe=Be.acquireProgram(Oe,Re),He.set(Re,Fe),k.uniforms=Oe.uniforms;const Ne=k.uniforms;(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(Ne.clippingPlanes=J.uniform),es(S,Oe),k.needsLights=va(S),k.lightsStateVersion=Ae,k.needsLights&&(Ne.ambientLightColor.value=Z.state.ambient,Ne.lightProbe.value=Z.state.probe,Ne.directionalLights.value=Z.state.directional,Ne.directionalLightShadows.value=Z.state.directionalShadow,Ne.spotLights.value=Z.state.spot,Ne.spotLightShadows.value=Z.state.spotShadow,Ne.rectAreaLights.value=Z.state.rectArea,Ne.ltc_1.value=Z.state.rectAreaLTC1,Ne.ltc_2.value=Z.state.rectAreaLTC2,Ne.pointLights.value=Z.state.point,Ne.pointLightShadows.value=Z.state.pointShadow,Ne.hemisphereLights.value=Z.state.hemi,Ne.directionalShadowMap.value=Z.state.directionalShadowMap,Ne.directionalShadowMatrix.value=Z.state.directionalShadowMatrix,Ne.spotShadowMap.value=Z.state.spotShadowMap,Ne.spotShadowMatrix.value=Z.state.spotShadowMatrix,Ne.pointShadowMap.value=Z.state.pointShadowMap,Ne.pointShadowMatrix.value=Z.state.pointShadowMatrix);const et=Fe.getUniforms(),Xt=Xn.seqWithValue(et.seq,Ne);return k.currentProgram=Fe,k.uniformsList=Xt,Fe}function es(S,O){const G=X.get(S);G.outputEncoding=O.outputEncoding,G.instancing=O.instancing,G.skinning=O.skinning,G.morphTargets=O.morphTargets,G.morphNormals=O.morphNormals,G.morphTargetsCount=O.morphTargetsCount,G.numClippingPlanes=O.numClippingPlanes,G.numIntersection=O.numClipIntersection,G.vertexAlphas=O.vertexAlphas,G.vertexTangents=O.vertexTangents}function ga(S,O,G,k,Z){O.isScene!==!0&&(O=xe),te.resetTextureUnits();const De=O.fog,Ae=k.isMeshStandardMaterial?O.environment:null,Oe=b===null?v.outputEncoding:b.texture.encoding,Re=(k.isMeshStandardMaterial?fe:ie).get(k.envMap||Ae),He=k.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,Fe=!!k.normalMap&&!!G.attributes.tangent,Ne=!!G.morphAttributes.position,et=!!G.morphAttributes.normal,Xt=G.morphAttributes.position?G.morphAttributes.position.length:0,Ge=X.get(k),Mn=d.state.lights;if(me===!0&&(q===!0||S!==E)){const wt=S===E&&k.id===M;J.setState(k,S,wt)}let nt=!1;k.version===Ge.__version?(Ge.needsLights&&Ge.lightsStateVersion!==Mn.state.version||Ge.outputEncoding!==Oe||Z.isInstancedMesh&&Ge.instancing===!1||!Z.isInstancedMesh&&Ge.instancing===!0||Z.isSkinnedMesh&&Ge.skinning===!1||!Z.isSkinnedMesh&&Ge.skinning===!0||Ge.envMap!==Re||k.fog&&Ge.fog!==De||Ge.numClippingPlanes!==void 0&&(Ge.numClippingPlanes!==J.numPlanes||Ge.numIntersection!==J.numIntersection)||Ge.vertexAlphas!==He||Ge.vertexTangents!==Fe||Ge.morphTargets!==Ne||Ge.morphNormals!==et||oe.isWebGL2===!0&&Ge.morphTargetsCount!==Xt)&&(nt=!0):(nt=!0,Ge.__version=k.version);let wn=Ge.currentProgram;nt===!0&&(wn=lr(k,O,Z));let Jt=!1,gt=!1,It=!1;const Ze=wn.getUniforms(),Ft=Ge.uniforms;if(ge.useProgram(wn.program)&&(Jt=!0,gt=!0,It=!0),k.id!==M&&(M=k.id,gt=!0),Jt||E!==S){if(Ze.setValue(Q,"projectionMatrix",S.projectionMatrix),oe.logarithmicDepthBuffer&&Ze.setValue(Q,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),E!==S&&(E=S,gt=!0,It=!0),k.isShaderMaterial||k.isMeshPhongMaterial||k.isMeshToonMaterial||k.isMeshStandardMaterial||k.envMap){const wt=Ze.map.cameraPosition;wt!==void 0&&wt.setValue(Q,ue.setFromMatrixPosition(S.matrixWorld))}(k.isMeshPhongMaterial||k.isMeshToonMaterial||k.isMeshLambertMaterial||k.isMeshBasicMaterial||k.isMeshStandardMaterial||k.isShaderMaterial)&&Ze.setValue(Q,"isOrthographic",S.isOrthographicCamera===!0),(k.isMeshPhongMaterial||k.isMeshToonMaterial||k.isMeshLambertMaterial||k.isMeshBasicMaterial||k.isMeshStandardMaterial||k.isShaderMaterial||k.isShadowMaterial||Z.isSkinnedMesh)&&Ze.setValue(Q,"viewMatrix",S.matrixWorldInverse)}if(Z.isSkinnedMesh){Ze.setOptional(Q,Z,"bindMatrix"),Ze.setOptional(Q,Z,"bindMatrixInverse");const wt=Z.skeleton;wt&&(oe.floatVertexTextures?(wt.boneTexture===null&&wt.computeBoneTexture(),Ze.setValue(Q,"boneTexture",wt.boneTexture,te),Ze.setValue(Q,"boneTextureSize",wt.boneTextureSize)):Ze.setOptional(Q,wt,"boneMatrices"))}return!!G&&(G.morphAttributes.position!==void 0||G.morphAttributes.normal!==void 0)&&_e.update(Z,G,k,wn),(gt||Ge.receiveShadow!==Z.receiveShadow)&&(Ge.receiveShadow=Z.receiveShadow,Ze.setValue(Q,"receiveShadow",Z.receiveShadow)),gt&&(Ze.setValue(Q,"toneMappingExposure",v.toneMappingExposure),Ge.needsLights&&gi(Ft,It),De&&k.fog&&Je.refreshFogUniforms(Ft,De),Je.refreshMaterialUniforms(Ft,k,P,z,Y),Xn.upload(Q,Ge.uniformsList,Ft,te)),k.isShaderMaterial&&k.uniformsNeedUpdate===!0&&(Xn.upload(Q,Ge.uniformsList,Ft,te),k.uniformsNeedUpdate=!1),k.isSpriteMaterial&&Ze.setValue(Q,"center",Z.center),Ze.setValue(Q,"modelViewMatrix",Z.modelViewMatrix),Ze.setValue(Q,"normalMatrix",Z.normalMatrix),Ze.setValue(Q,"modelMatrix",Z.matrixWorld),wn}function gi(S,O){S.ambientLightColor.needsUpdate=O,S.lightProbe.needsUpdate=O,S.directionalLights.needsUpdate=O,S.directionalLightShadows.needsUpdate=O,S.pointLights.needsUpdate=O,S.pointLightShadows.needsUpdate=O,S.spotLights.needsUpdate=O,S.spotLightShadows.needsUpdate=O,S.rectAreaLights.needsUpdate=O,S.hemisphereLights.needsUpdate=O}function va(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return m},this.getActiveMipmapLevel=function(){return p},this.getRenderTarget=function(){return b},this.setRenderTargetTextures=function(S,O,G){X.get(S.texture).__webglTexture=O,X.get(S.depthTexture).__webglTexture=G;const k=X.get(S);k.__hasExternalTextures=!0,k.__hasExternalTextures&&(k.__autoAllocateDepthBuffer=G===void 0,k.__autoAllocateDepthBuffer||S.useRenderToTexture&&(console.warn("render-to-texture extension was disabled because an external texture was provided"),S.useRenderToTexture=!1,S.useRenderbuffer=!0))},this.setRenderTargetFramebuffer=function(S,O){const G=X.get(S);G.__webglFramebuffer=O,G.__useDefaultFramebuffer=O===void 0},this.setRenderTarget=function(S,O=0,G=0){b=S,m=O,p=G;let k=!0;if(S){const Re=X.get(S);Re.__useDefaultFramebuffer!==void 0?(ge.bindFramebuffer(36160,null),k=!1):Re.__webglFramebuffer===void 0?te.setupRenderTarget(S):Re.__hasExternalTextures&&te.rebindTextures(S,X.get(S.texture).__webglTexture,X.get(S.depthTexture).__webglTexture)}let Z=null,De=!1,Ae=!1;if(S){const Re=S.texture;(Re.isDataTexture3D||Re.isDataTexture2DArray)&&(Ae=!0);const He=X.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Z=He[O],De=!0):S.useRenderbuffer?Z=X.get(S).__webglMultisampledFramebuffer:Z=He,D.copy(S.viewport),_.copy(S.scissor),R=S.scissorTest}else D.copy(N).multiplyScalar(P).floor(),_.copy(H).multiplyScalar(P).floor(),R=V;if(ge.bindFramebuffer(36160,Z)&&oe.drawBuffers&&k){let Re=!1;if(S)if(S.isWebGLMultipleRenderTargets){const He=S.texture;if(W.length!==He.length||W[0]!==36064){for(let Fe=0,Ne=He.length;Fe<Ne;Fe++)W[Fe]=36064+Fe;W.length=He.length,Re=!0}}else(W.length!==1||W[0]!==36064)&&(W[0]=36064,W.length=1,Re=!0);else(W.length!==1||W[0]!==1029)&&(W[0]=1029,W.length=1,Re=!0);Re&&(oe.isWebGL2?Q.drawBuffers(W):Te.get("WEBGL_draw_buffers").drawBuffersWEBGL(W))}if(ge.viewport(D),ge.scissor(_),ge.setScissorTest(R),De){const Re=X.get(S.texture);Q.framebufferTexture2D(36160,36064,34069+O,Re.__webglTexture,G)}else if(Ae){const Re=X.get(S.texture),He=O||0;Q.framebufferTextureLayer(36160,36064,Re.__webglTexture,G||0,He)}M=-1},this.readRenderTargetPixels=function(S,O,G,k,Z,De,Ae){if(!(S&&S.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Oe=X.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&Ae!==void 0&&(Oe=Oe[Ae]),Oe){ge.bindFramebuffer(36160,Oe);try{const Re=S.texture,He=Re.format,Fe=Re.type;if(He!==Ct&&$.convert(He)!==Q.getParameter(35739)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Ne=Fe===Mi&&(Te.has("EXT_color_buffer_half_float")||oe.isWebGL2&&Te.has("EXT_color_buffer_float"));if(Fe!==nn&&$.convert(Fe)!==Q.getParameter(35738)&&!(Fe===Nn&&(oe.isWebGL2||Te.has("OES_texture_float")||Te.has("WEBGL_color_buffer_float")))&&!Ne){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}Q.checkFramebufferStatus(36160)===36053?O>=0&&O<=S.width-k&&G>=0&&G<=S.height-Z&&Q.readPixels(O,G,k,Z,$.convert(He),$.convert(Fe),De):console.error("THREE.WebGLRenderer.readRenderTargetPixels: readPixels from renderTarget failed. Framebuffer not complete.")}finally{const Re=b!==null?X.get(b).__webglFramebuffer:null;ge.bindFramebuffer(36160,Re)}}},this.copyFramebufferToTexture=function(S,O,G=0){const k=Math.pow(2,-G),Z=Math.floor(O.image.width*k),De=Math.floor(O.image.height*k);let Ae=$.convert(O.format);oe.isWebGL2&&(Ae===6407&&(Ae=32849),Ae===6408&&(Ae=32856)),te.setTexture2D(O,0),Q.copyTexImage2D(3553,G,Ae,S.x,S.y,Z,De,0),ge.unbindTexture()},this.copyTextureToTexture=function(S,O,G,k=0){const Z=O.image.width,De=O.image.height,Ae=$.convert(G.format),Oe=$.convert(G.type);te.setTexture2D(G,0),Q.pixelStorei(37440,G.flipY),Q.pixelStorei(37441,G.premultiplyAlpha),Q.pixelStorei(3317,G.unpackAlignment),O.isDataTexture?Q.texSubImage2D(3553,k,S.x,S.y,Z,De,Ae,Oe,O.image.data):O.isCompressedTexture?Q.compressedTexSubImage2D(3553,k,S.x,S.y,O.mipmaps[0].width,O.mipmaps[0].height,Ae,O.mipmaps[0].data):Q.texSubImage2D(3553,k,S.x,S.y,Ae,Oe,O.image),k===0&&G.generateMipmaps&&Q.generateMipmap(3553),ge.unbindTexture()},this.copyTextureToTexture3D=function(S,O,G,k,Z=0){if(v.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const De=S.max.x-S.min.x+1,Ae=S.max.y-S.min.y+1,Oe=S.max.z-S.min.z+1,Re=$.convert(k.format),He=$.convert(k.type);let Fe;if(k.isDataTexture3D)te.setTexture3D(k,0),Fe=32879;else if(k.isDataTexture2DArray)te.setTexture2DArray(k,0),Fe=35866;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}Q.pixelStorei(37440,k.flipY),Q.pixelStorei(37441,k.premultiplyAlpha),Q.pixelStorei(3317,k.unpackAlignment);const Ne=Q.getParameter(3314),et=Q.getParameter(32878),Xt=Q.getParameter(3316),Ge=Q.getParameter(3315),Mn=Q.getParameter(32877),nt=G.isCompressedTexture?G.mipmaps[0]:G.image;Q.pixelStorei(3314,nt.width),Q.pixelStorei(32878,nt.height),Q.pixelStorei(3316,S.min.x),Q.pixelStorei(3315,S.min.y),Q.pixelStorei(32877,S.min.z),G.isDataTexture||G.isDataTexture3D?Q.texSubImage3D(Fe,Z,O.x,O.y,O.z,De,Ae,Oe,Re,He,nt.data):G.isCompressedTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),Q.compressedTexSubImage3D(Fe,Z,O.x,O.y,O.z,De,Ae,Oe,Re,nt.data)):Q.texSubImage3D(Fe,Z,O.x,O.y,O.z,De,Ae,Oe,Re,He,nt),Q.pixelStorei(3314,Ne),Q.pixelStorei(32878,et),Q.pixelStorei(3316,Xt),Q.pixelStorei(3315,Ge),Q.pixelStorei(32877,Mn),Z===0&&k.generateMipmaps&&Q.generateMipmap(Fe),ge.unbindTexture()},this.initTexture=function(S){te.setTexture2D(S,0),ge.unbindTexture()},this.resetState=function(){m=0,p=0,b=null,ge.reset(),ce.reset()},typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}tt.prototype.isWebGLRenderer=!0;class wx extends tt{}wx.prototype.isWebGL1Renderer=!0;class Yi extends $e{constructor(){super();this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.overrideMaterial=null,this.autoUpdate=!0,typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.autoUpdate=e.autoUpdate,this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t}}Yi.prototype.isScene=!0;class Pr{constructor(e,t){this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=_r,this.updateRange={offset:0,count:-1},this.version=0,this.uuid=rn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,s=this.stride;i<s;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=rn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=rn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.prototype.slice.call(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}Pr.prototype.isInterleavedBuffer=!0;const pt=new C;class Dr{constructor(e,t,n,i=!1){this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i===!0}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)pt.x=this.getX(t),pt.y=this.getY(t),pt.z=this.getZ(t),pt.applyMatrix4(e),this.setXYZ(t,pt.x,pt.y,pt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)pt.x=this.getX(t),pt.y=this.getY(t),pt.z=this.getZ(t),pt.applyNormalMatrix(e),this.setXYZ(t,pt.x,pt.y,pt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)pt.x=this.getX(t),pt.y=this.getY(t),pt.z=this.getZ(t),pt.transformDirection(e),this.setXYZ(t,pt.x,pt.y,pt.z);return this}setX(e,t){return this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){return this.data.array[e*this.data.stride+this.offset]}getY(e){return this.data.array[e*this.data.stride+this.offset+1]}getZ(e){return this.data.array[e*this.data.stride+this.offset+2]}getW(e){return this.data.array[e*this.data.stride+this.offset+3]}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e=e*this.data.stride+this.offset,this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=s,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interlaved buffer attribute will deinterleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return new ut(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Dr(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interlaved buffer attribute will deinterleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}Dr.prototype.isInterleavedBufferAttribute=!0;class dh extends Lt{constructor(e){super();this.type="SpriteMaterial",this.color=new be(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this}}dh.prototype.isSpriteMaterial=!0;let Zi;const Ir=new C,ji=new C,Ji=new C,$i=new ee,Fr=new ee,fh=new Le,Gs=new C,Nr=new C,Ws=new C,ph=new ee,Co=new ee,mh=new ee;class bx extends $e{constructor(e){super();if(this.type="Sprite",Zi===void 0){Zi=new st;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Pr(t,5);Zi.setIndex([0,1,2,0,2,3]),Zi.setAttribute("position",new Dr(n,3,0,!1)),Zi.setAttribute("uv",new Dr(n,2,3,!1))}this.geometry=Zi,this.material=e!==void 0?e:new dh,this.center=new ee(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),ji.setFromMatrixScale(this.matrixWorld),fh.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Ji.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&ji.multiplyScalar(-Ji.z);const n=this.material.rotation;let i,s;n!==0&&(s=Math.cos(n),i=Math.sin(n));const a=this.center;Xs(Gs.set(-.5,-.5,0),Ji,a,ji,i,s),Xs(Nr.set(.5,-.5,0),Ji,a,ji,i,s),Xs(Ws.set(.5,.5,0),Ji,a,ji,i,s),ph.set(0,0),Co.set(1,0),mh.set(1,1);let o=e.ray.intersectTriangle(Gs,Nr,Ws,!1,Ir);if(o===null&&(Xs(Nr.set(-.5,.5,0),Ji,a,ji,i,s),Co.set(0,1),o=e.ray.intersectTriangle(Gs,Ws,Nr,!1,Ir),o===null))return;const l=e.ray.origin.distanceTo(Ir);l<e.near||l>e.far||t.push({distance:l,point:Ir.clone(),uv:vt.getUV(Ir,Gs,Nr,Ws,ph,Co,mh,new ee),face:null,object:this})}copy(e){return super.copy(e),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}bx.prototype.isSprite=!0;function Xs(r,e,t,n,i,s){$i.subVectors(r,t).addScalar(.5).multiply(n),i!==void 0?(Fr.x=s*$i.x-i*$i.y,Fr.y=i*$i.x+s*$i.y):Fr.copy($i),r.copy(e),r.x+=Fr.x,r.y+=Fr.y,r.applyMatrix4(fh)}const qs=new C,gh=new C;class mM extends $e{constructor(){super();this._currentLevel=0,this.type="LOD",Object.defineProperties(this,{levels:{enumerable:!0,value:[]},isLOD:{value:!0}}),this.autoUpdate=!0}copy(e){super.copy(e,!1);const t=e.levels;for(let n=0,i=t.length;n<i;n++){const s=t[n];this.addLevel(s.object.clone(),s.distance)}return this.autoUpdate=e.autoUpdate,this}addLevel(e,t=0){t=Math.abs(t);const n=this.levels;let i;for(i=0;i<n.length&&!(t<n[i].distance);i++);return n.splice(i,0,{distance:t,object:e}),this.add(e),this}getCurrentLevel(){return this._currentLevel}getObjectForDistance(e){const t=this.levels;if(t.length>0){let n,i;for(n=1,i=t.length;n<i&&!(e<t[n].distance);n++);return t[n-1].object}return null}raycast(e,t){if(this.levels.length>0){qs.setFromMatrixPosition(this.matrixWorld);const i=e.ray.origin.distanceTo(qs);this.getObjectForDistance(i).raycast(e,t)}}update(e){const t=this.levels;if(t.length>1){qs.setFromMatrixPosition(e.matrixWorld),gh.setFromMatrixPosition(this.matrixWorld);const n=qs.distanceTo(gh)/e.zoom;t[0].object.visible=!0;let i,s;for(i=1,s=t.length;i<s&&n>=t[i].distance;i++)t[i-1].object.visible=!1,t[i].object.visible=!0;for(this._currentLevel=i-1;i<s;i++)t[i].object.visible=!1}}toJSON(e){const t=super.toJSON(e);this.autoUpdate===!1&&(t.object.autoUpdate=!1),t.object.levels=[];const n=this.levels;for(let i=0,s=n.length;i<s;i++){const a=n[i];t.object.levels.push({object:a.object.uuid,distance:a.distance})}return t}}const vh=new C,xh=new it,_h=new it,Sx=new C,yh=new Le;class Mh extends Rt{constructor(e,t){super(e,t);this.type="SkinnedMesh",this.bindMode="attached",this.bindMatrix=new Le,this.bindMatrixInverse=new Le}copy(e){return super.copy(e),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,this}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new it,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.x=t.getX(n),e.y=t.getY(n),e.z=t.getZ(n),e.w=t.getW(n);const s=1/e.manhattanLength();s!==1/0?e.multiplyScalar(s):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode==="attached"?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode==="detached"?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}boneTransform(e,t){const n=this.skeleton,i=this.geometry;xh.fromBufferAttribute(i.attributes.skinIndex,e),_h.fromBufferAttribute(i.attributes.skinWeight,e),vh.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let s=0;s<4;s++){const a=_h.getComponent(s);if(a!==0){const o=xh.getComponent(s);yh.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),t.addScaledVector(Sx.copy(vh).applyMatrix4(yh),a)}}return t.applyMatrix4(this.bindMatrixInverse)}}Mh.prototype.isSkinnedMesh=!0;class Tx extends $e{constructor(){super();this.type="Bone"}}Tx.prototype.isBone=!0;class Ex extends Et{constructor(e=null,t=1,n=1,i,s,a,o,l,c=_t,h=_t,u,d){super(null,a,o,l,c,h,i,s,u,d);this.image={data:e,width:t,height:n},this.magFilter=c,this.minFilter=h,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.needsUpdate=!0}}Ex.prototype.isDataTexture=!0;class Lo extends ut{constructor(e,t,n,i=1){typeof n=="number"&&(i=n,n=!1,console.error("THREE.InstancedBufferAttribute: The constructor now expects normalized as the third argument."));super(e,t,n);this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}Lo.prototype.isInstancedBufferAttribute=!0;const wh=new Le,bh=new Le,Ys=[],Or=new Rt;class Ax extends Rt{constructor(e,t,n){super(e,t);this.instanceMatrix=new Lo(new Float32Array(n*16),16),this.instanceColor=null,this.count=n,this.frustumCulled=!1}copy(e){return super.copy(e),this.instanceMatrix.copy(e.instanceMatrix),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}raycast(e,t){const n=this.matrixWorld,i=this.count;if(Or.geometry=this.geometry,Or.material=this.material,Or.material!==void 0)for(let s=0;s<i;s++){this.getMatrixAt(s,wh),bh.multiplyMatrices(n,wh),Or.matrixWorld=bh,Or.raycast(e,Ys);for(let a=0,o=Ys.length;a<o;a++){const l=Ys[a];l.instanceId=s,l.object=this,t.push(l)}Ys.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Lo(new Float32Array(this.instanceMatrix.count*3),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}}Ax.prototype.isInstancedMesh=!0;class Br extends Lt{constructor(e){super();this.type="LineBasicMaterial",this.color=new be(16777215),this.linewidth=1,this.linecap="round",this.linejoin="round",this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this}}Br.prototype.isLineBasicMaterial=!0;const Sh=new C,Th=new C,Eh=new Le,Ro=new li,Zs=new Ri;class Po extends $e{constructor(e=new st,t=new Br){super();this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e){return super.copy(e),this.material=e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.isBufferGeometry)if(e.index===null){const t=e.attributes.position,n=[0];for(let i=1,s=t.count;i<s;i++)Sh.fromBufferAttribute(t,i-1),Th.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=Sh.distanceTo(Th);e.setAttribute("lineDistance",new yt(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");else e.isGeometry&&console.error("THREE.Line.computeLineDistances() no longer supports THREE.Geometry. Use THREE.BufferGeometry instead.");return this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,s=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Zs.copy(n.boundingSphere),Zs.applyMatrix4(i),Zs.radius+=s,e.ray.intersectsSphere(Zs)===!1)return;Eh.copy(i).invert(),Ro.copy(e.ray).applyMatrix4(Eh);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=new C,h=new C,u=new C,d=new C,f=this.isLineSegments?2:1;if(n.isBufferGeometry){const g=n.index,w=n.attributes.position;if(g!==null){const m=Math.max(0,a.start),p=Math.min(g.count,a.start+a.count);for(let b=m,M=p-1;b<M;b+=f){const E=g.getX(b),D=g.getX(b+1);if(c.fromBufferAttribute(w,E),h.fromBufferAttribute(w,D),Ro.distanceSqToSegment(c,h,d,u)>l)continue;d.applyMatrix4(this.matrixWorld);const R=e.ray.origin.distanceTo(d);R<e.near||R>e.far||t.push({distance:R,point:u.clone().applyMatrix4(this.matrixWorld),index:b,face:null,faceIndex:null,object:this})}}else{const m=Math.max(0,a.start),p=Math.min(w.count,a.start+a.count);for(let b=m,M=p-1;b<M;b+=f){if(c.fromBufferAttribute(w,b),h.fromBufferAttribute(w,b+1),Ro.distanceSqToSegment(c,h,d,u)>l)continue;d.applyMatrix4(this.matrixWorld);const D=e.ray.origin.distanceTo(d);D<e.near||D>e.far||t.push({distance:D,point:u.clone().applyMatrix4(this.matrixWorld),index:b,face:null,faceIndex:null,object:this})}}}else n.isGeometry&&console.error("THREE.Line.raycast() no longer supports THREE.Geometry. Use THREE.BufferGeometry instead.")}updateMorphTargets(){const e=this.geometry;if(e.isBufferGeometry){const t=e.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){const o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}else{const t=e.morphTargets;t!==void 0&&t.length>0&&console.error("THREE.Line.updateMorphTargets() does not support THREE.Geometry. Use THREE.BufferGeometry instead.")}}}Po.prototype.isLine=!0;const Ah=new C,Ch=new C;class Do extends Po{constructor(e,t){super(e,t);this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.isBufferGeometry)if(e.index===null){const t=e.attributes.position,n=[];for(let i=0,s=t.count;i<s;i+=2)Ah.fromBufferAttribute(t,i),Ch.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+Ah.distanceTo(Ch);e.setAttribute("lineDistance",new yt(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");else e.isGeometry&&console.error("THREE.LineSegments.computeLineDistances() no longer supports THREE.Geometry. Use THREE.BufferGeometry instead.");return this}}Do.prototype.isLineSegments=!0;class Cx extends Po{constructor(e,t){super(e,t);this.type="LineLoop"}}Cx.prototype.isLineLoop=!0;class Lh extends Lt{constructor(e){super();this.type="PointsMaterial",this.color=new be(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this}}Lh.prototype.isPointsMaterial=!0;const Rh=new Le,Io=new li,js=new Ri,Js=new C;class Lx extends $e{constructor(e=new st,t=new Lh){super();this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e){return super.copy(e),this.material=e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,s=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),js.copy(n.boundingSphere),js.applyMatrix4(i),js.radius+=s,e.ray.intersectsSphere(js)===!1)return;Rh.copy(i).invert(),Io.copy(e.ray).applyMatrix4(Rh);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o;if(n.isBufferGeometry){const c=n.index,u=n.attributes.position;if(c!==null){const d=Math.max(0,a.start),f=Math.min(c.count,a.start+a.count);for(let g=d,v=f;g<v;g++){const w=c.getX(g);Js.fromBufferAttribute(u,w),Ph(Js,w,l,i,e,t,this)}}else{const d=Math.max(0,a.start),f=Math.min(u.count,a.start+a.count);for(let g=d,v=f;g<v;g++)Js.fromBufferAttribute(u,g),Ph(Js,g,l,i,e,t,this)}}else console.error("THREE.Points.raycast() no longer supports THREE.Geometry. Use THREE.BufferGeometry instead.")}updateMorphTargets(){const e=this.geometry;if(e.isBufferGeometry){const t=e.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){const o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}else{const t=e.morphTargets;t!==void 0&&t.length>0&&console.error("THREE.Points.updateMorphTargets() does not support THREE.Geometry. Use THREE.BufferGeometry instead.")}}}Lx.prototype.isPoints=!0;function Ph(r,e,t,n,i,s,a){const o=Io.distanceSqToPoint(r);if(o<t){const l=new C;Io.closestPointToPoint(r,l),l.applyMatrix4(n);const c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;s.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,object:a})}}class Rx extends Et{constructor(e,t,n,i,s,a,o,l,c){super(e,t,n,i,s,a,o,l,c);this.format=o!==void 0?o:On,this.minFilter=a!==void 0?a:Vt,this.magFilter=s!==void 0?s:Vt,this.generateMipmaps=!1;const h=this;function u(){h.needsUpdate=!0,e.requestVideoFrameCallback(u)}"requestVideoFrameCallback"in e&&e.requestVideoFrameCallback(u)}clone(){return new this.constructor(this.image).copy(this)}update(){const e=this.image;"requestVideoFrameCallback"in e===!1&&e.readyState>=e.HAVE_CURRENT_DATA&&(this.needsUpdate=!0)}}Rx.prototype.isVideoTexture=!0;class Px extends Et{constructor(e,t,n,i,s,a,o,l,c,h,u,d){super(null,a,o,l,c,h,i,s,u,d);this.image={width:t,height:n},this.mipmaps=e,this.flipY=!1,this.generateMipmaps=!1}}Px.prototype.isCompressedTexture=!0;class Dx extends Et{constructor(e,t,n,i,s,a,o,l,c){super(e,t,n,i,s,a,o,l,c);this.needsUpdate=!0}}Dx.prototype.isCanvasTexture=!0;new C;new C;new C;new vt;class Qt{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,i=this.getPoint(0),s=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),s+=n.distanceTo(i),t.push(s),i=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){const n=this.getLengths();let i=0;const s=n.length;let a;t?a=t:a=e*n[s-1];let o=0,l=s-1,c;for(;o<=l;)if(i=Math.floor(o+(l-o)/2),c=n[i]-a,c<0)o=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===a)return i/(s-1);const h=n[i],d=n[i+1]-h,f=(a-h)/d;return(i+f)/(s-1)}getTangent(e,t){const n=1e-4;let i=e-n,s=e+n;i<0&&(i=0),s>1&&(s=1);const a=this.getPoint(i),o=this.getPoint(s),l=t||(a.isVector2?new ee:new C);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t){const n=new C,i=[],s=[],a=[],o=new C,l=new Le;for(let f=0;f<=e;f++){const g=f/e;i[f]=this.getTangentAt(g,new C)}s[0]=new C,a[0]=new C;let c=Number.MAX_VALUE;const h=Math.abs(i[0].x),u=Math.abs(i[0].y),d=Math.abs(i[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(i[0],n).normalize(),s[0].crossVectors(i[0],o),a[0].crossVectors(i[0],s[0]);for(let f=1;f<=e;f++){if(s[f]=s[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(i[f-1],i[f]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(Ot(i[f-1].dot(i[f]),-1,1));s[f].applyMatrix4(l.makeRotationAxis(o,g))}a[f].crossVectors(i[f],s[f])}if(t===!0){let f=Math.acos(Ot(s[0].dot(s[e]),-1,1));f/=e,i[0].dot(o.crossVectors(s[0],s[e]))>0&&(f=-f);for(let g=1;g<=e;g++)s[g].applyMatrix4(l.makeRotationAxis(i[g],f*g)),a[g].crossVectors(i[g],s[g])}return{tangents:i,normals:s,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.5,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class $s extends Qt{constructor(e=0,t=0,n=1,i=1,s=0,a=Math.PI*2,o=!1,l=0){super();this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=i,this.aStartAngle=s,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t){const n=t||new ee,i=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const a=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=i;for(;s>i;)s-=i;s<Number.EPSILON&&(a?s=0:s=i),this.aClockwise===!0&&!a&&(s===i?s=-i:s=s-i);const o=this.aStartAngle+e*s;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*h-f*u+this.aX,c=d*u+f*h+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}$s.prototype.isEllipseCurve=!0;class Dh extends $s{constructor(e,t,n,i,s,a){super(e,t,n,n,i,s,a);this.type="ArcCurve"}}Dh.prototype.isArcCurve=!0;function Fo(){let r=0,e=0,t=0,n=0;function i(s,a,o,l){r=s,e=o,t=-3*s+3*a-2*o-l,n=2*s-2*a+o+l}return{initCatmullRom:function(s,a,o,l,c){i(a,o,c*(o-s),c*(l-a))},initNonuniformCatmullRom:function(s,a,o,l,c,h,u){let d=(a-s)/c-(o-s)/(c+h)+(o-a)/h,f=(o-a)/h-(l-a)/(h+u)+(l-o)/u;d*=h,f*=h,i(a,o,d,f)},calc:function(s){const a=s*s,o=a*s;return r+e*s+t*a+n*o}}}const Qs=new C,No=new Fo,Oo=new Fo,Bo=new Fo;class Ih extends Qt{constructor(e=[],t=!1,n="centripetal",i=.5){super();this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=i}getPoint(e,t=new C){const n=t,i=this.points,s=i.length,a=(s-(this.closed?0:1))*e;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/s)+1)*s:l===0&&o===s-1&&(o=s-2,l=1);let c,h;this.closed||o>0?c=i[(o-1)%s]:(Qs.subVectors(i[0],i[1]).add(i[0]),c=Qs);const u=i[o%s],d=i[(o+1)%s];if(this.closed||o+2<s?h=i[(o+2)%s]:(Qs.subVectors(i[s-1],i[s-2]).add(i[s-1]),h=Qs),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(u),f),v=Math.pow(u.distanceToSquared(d),f),w=Math.pow(d.distanceToSquared(h),f);v<1e-4&&(v=1),g<1e-4&&(g=v),w<1e-4&&(w=v),No.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,g,v,w),Oo.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,g,v,w),Bo.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,g,v,w)}else this.curveType==="catmullrom"&&(No.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),Oo.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),Bo.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return n.set(No.calc(l),Oo.calc(l),Bo.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new C().fromArray(i))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}Ih.prototype.isCatmullRomCurve3=!0;function Fh(r,e,t,n,i){const s=(n-e)*.5,a=(i-t)*.5,o=r*r,l=r*o;return(2*t-2*n+s+a)*l+(-3*t+3*n-2*s-a)*o+s*r+t}function Ix(r,e){const t=1-r;return t*t*e}function Fx(r,e){return 2*(1-r)*r*e}function Nx(r,e){return r*r*e}function Ur(r,e,t,n){return Ix(r,e)+Fx(r,t)+Nx(r,n)}function Ox(r,e){const t=1-r;return t*t*t*e}function Bx(r,e){const t=1-r;return 3*t*t*r*e}function Ux(r,e){return 3*(1-r)*r*r*e}function zx(r,e){return r*r*r*e}function zr(r,e,t,n,i){return Ox(r,e)+Bx(r,t)+Ux(r,n)+zx(r,i)}class Uo extends Qt{constructor(e=new ee,t=new ee,n=new ee,i=new ee){super();this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new ee){const n=t,i=this.v0,s=this.v1,a=this.v2,o=this.v3;return n.set(zr(e,i.x,s.x,a.x,o.x),zr(e,i.y,s.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}Uo.prototype.isCubicBezierCurve=!0;class Nh extends Qt{constructor(e=new C,t=new C,n=new C,i=new C){super();this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new C){const n=t,i=this.v0,s=this.v1,a=this.v2,o=this.v3;return n.set(zr(e,i.x,s.x,a.x,o.x),zr(e,i.y,s.y,a.y,o.y),zr(e,i.z,s.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}Nh.prototype.isCubicBezierCurve3=!0;class Ks extends Qt{constructor(e=new ee,t=new ee){super();this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new ee){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t){const n=t||new ee;return n.copy(this.v2).sub(this.v1).normalize(),n}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}Ks.prototype.isLineCurve=!0;class Vx extends Qt{constructor(e=new C,t=new C){super();this.type="LineCurve3",this.isLineCurve3=!0,this.v1=e,this.v2=t}getPoint(e,t=new C){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class zo extends Qt{constructor(e=new ee,t=new ee,n=new ee){super();this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new ee){const n=t,i=this.v0,s=this.v1,a=this.v2;return n.set(Ur(e,i.x,s.x,a.x),Ur(e,i.y,s.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}zo.prototype.isQuadraticBezierCurve=!0;class Oh extends Qt{constructor(e=new C,t=new C,n=new C){super();this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new C){const n=t,i=this.v0,s=this.v1,a=this.v2;return n.set(Ur(e,i.x,s.x,a.x),Ur(e,i.y,s.y,a.y),Ur(e,i.z,s.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}Oh.prototype.isQuadraticBezierCurve3=!0;class Vo extends Qt{constructor(e=[]){super();this.type="SplineCurve",this.points=e}getPoint(e,t=new ee){const n=t,i=this.points,s=(i.length-1)*e,a=Math.floor(s),o=s-a,l=i[a===0?a:a-1],c=i[a],h=i[a>i.length-2?i.length-1:a+1],u=i[a>i.length-3?i.length-1:a+2];return n.set(Fh(o,l.x,c.x,h.x,u.x),Fh(o,l.y,c.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new ee().fromArray(i))}return this}}Vo.prototype.isSplineCurve=!0;var Bh=Object.freeze({__proto__:null,ArcCurve:Dh,CatmullRomCurve3:Ih,CubicBezierCurve:Uo,CubicBezierCurve3:Nh,EllipseCurve:$s,LineCurve:Ks,LineCurve3:Vx,QuadraticBezierCurve:zo,QuadraticBezierCurve3:Oh,SplineCurve:Vo});class kx extends Qt{constructor(){super();this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);e.equals(t)||this.curves.push(new Ks(t,e))}getPoint(e,t){const n=e*this.getLength(),i=this.getCurveLengths();let s=0;for(;s<i.length;){if(i[s]>=n){const a=i[s]-n,o=this.curves[s],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}s++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,i=this.curves.length;n<i;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let i=0,s=this.curves;i<s.length;i++){const a=s[i],o=a&&a.isEllipseCurve?e*2:a&&(a.isLineCurve||a.isLineCurve3)?1:a&&a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){const h=l[c];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const i=e.curves[t];this.curves.push(i.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const i=this.curves[t];e.curves.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const i=e.curves[t];this.curves.push(new Bh[i.type]().fromJSON(i))}return this}}class ko extends kx{constructor(e){super();this.type="Path",this.currentPoint=new ee,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new Ks(this.currentPoint.clone(),new ee(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,i){const s=new zo(this.currentPoint.clone(),new ee(e,t),new ee(n,i));return this.curves.push(s),this.currentPoint.set(n,i),this}bezierCurveTo(e,t,n,i,s,a){const o=new Uo(this.currentPoint.clone(),new ee(e,t),new ee(n,i),new ee(s,a));return this.curves.push(o),this.currentPoint.set(s,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new Vo(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,i,s,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,n,i,s,a),this}absarc(e,t,n,i,s,a){return this.absellipse(e,t,n,n,i,s,a),this}ellipse(e,t,n,i,s,a,o,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,n,i,s,a,o,l),this}absellipse(e,t,n,i,s,a,o,l){const c=new $s(e,t,n,i,s,a,o,l);if(this.curves.length>0){const u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class Vr extends ko{constructor(e){super(e);this.uuid=rn(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,i=this.holes.length;n<i;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const i=e.holes[t];this.holes.push(i.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const i=this.holes[t];e.holes.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const i=e.holes[t];this.holes.push(new ko().fromJSON(i))}return this}}const Hx={triangulate:function(r,e,t=2){const n=e&&e.length,i=n?e[0]*t:r.length;let s=Uh(r,0,i,t,!0);const a=[];if(!s||s.next===s.prev)return a;let o,l,c,h,u,d,f;if(n&&(s=Yx(r,e,s,t)),r.length>80*t){o=c=r[0],l=h=r[1];for(let g=t;g<i;g+=t)u=r[g],d=r[g+1],u<o&&(o=u),d<l&&(l=d),u>c&&(c=u),d>h&&(h=d);f=Math.max(c-o,h-l),f=f!==0?1/f:0}return kr(s,a,t,o,l,f),a}};function Uh(r,e,t,n,i){let s,a;if(i===r_(r,e,t,n)>0)for(s=e;s<t;s+=n)a=kh(s,r[s],r[s+1],a);else for(s=t-n;s>=e;s-=n)a=kh(s,r[s],r[s+1],a);return a&&ea(a,a.next)&&(Gr(a),a=a.next),a}function qn(r,e){if(!r)return r;e||(e=r);let t=r,n;do if(n=!1,!t.steiner&&(ea(t,t.next)||dt(t.prev,t,t.next)===0)){if(Gr(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function kr(r,e,t,n,i,s,a){if(!r)return;!a&&s&&Qx(r,n,i,s);let o=r,l,c;for(;r.prev!==r.next;){if(l=r.prev,c=r.next,s?Wx(r,n,i,s):Gx(r)){e.push(l.i/t),e.push(r.i/t),e.push(c.i/t),Gr(r),r=c.next,o=c.next;continue}if(r=c,r===o){a?a===1?(r=Xx(qn(r),e,t),kr(r,e,t,n,i,s,2)):a===2&&qx(r,e,t,n,i,s):kr(qn(r),e,t,n,i,s,1);break}}}function Gx(r){const e=r.prev,t=r,n=r.next;if(dt(e,t,n)>=0)return!1;let i=r.next.next;for(;i!==r.prev;){if(Qi(e.x,e.y,t.x,t.y,n.x,n.y,i.x,i.y)&&dt(i.prev,i,i.next)>=0)return!1;i=i.next}return!0}function Wx(r,e,t,n){const i=r.prev,s=r,a=r.next;if(dt(i,s,a)>=0)return!1;const o=i.x<s.x?i.x<a.x?i.x:a.x:s.x<a.x?s.x:a.x,l=i.y<s.y?i.y<a.y?i.y:a.y:s.y<a.y?s.y:a.y,c=i.x>s.x?i.x>a.x?i.x:a.x:s.x>a.x?s.x:a.x,h=i.y>s.y?i.y>a.y?i.y:a.y:s.y>a.y?s.y:a.y,u=Ho(o,l,e,t,n),d=Ho(c,h,e,t,n);let f=r.prevZ,g=r.nextZ;for(;f&&f.z>=u&&g&&g.z<=d;){if(f!==r.prev&&f!==r.next&&Qi(i.x,i.y,s.x,s.y,a.x,a.y,f.x,f.y)&&dt(f.prev,f,f.next)>=0||(f=f.prevZ,g!==r.prev&&g!==r.next&&Qi(i.x,i.y,s.x,s.y,a.x,a.y,g.x,g.y)&&dt(g.prev,g,g.next)>=0))return!1;g=g.nextZ}for(;f&&f.z>=u;){if(f!==r.prev&&f!==r.next&&Qi(i.x,i.y,s.x,s.y,a.x,a.y,f.x,f.y)&&dt(f.prev,f,f.next)>=0)return!1;f=f.prevZ}for(;g&&g.z<=d;){if(g!==r.prev&&g!==r.next&&Qi(i.x,i.y,s.x,s.y,a.x,a.y,g.x,g.y)&&dt(g.prev,g,g.next)>=0)return!1;g=g.nextZ}return!0}function Xx(r,e,t){let n=r;do{const i=n.prev,s=n.next.next;!ea(i,s)&&zh(i,n,n.next,s)&&Hr(i,s)&&Hr(s,i)&&(e.push(i.i/t),e.push(n.i/t),e.push(s.i/t),Gr(n),Gr(n.next),n=r=s),n=n.next}while(n!==r);return qn(n)}function qx(r,e,t,n,i,s){let a=r;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&t_(a,o)){let l=Vh(a,o);a=qn(a,a.next),l=qn(l,l.next),kr(a,e,t,n,i,s),kr(l,e,t,n,i,s);return}o=o.next}a=a.next}while(a!==r)}function Yx(r,e,t,n){const i=[];let s,a,o,l,c;for(s=0,a=e.length;s<a;s++)o=e[s]*n,l=s<a-1?e[s+1]*n:r.length,c=Uh(r,o,l,n,!1),c===c.next&&(c.steiner=!0),i.push(e_(c));for(i.sort(Zx),s=0;s<i.length;s++)jx(i[s],t),t=qn(t,t.next);return t}function Zx(r,e){return r.x-e.x}function jx(r,e){if(e=Jx(r,e),e){const t=Vh(e,r);qn(e,e.next),qn(t,t.next)}}function Jx(r,e){let t=e;const n=r.x,i=r.y;let s=-1/0,a;do{if(i<=t.y&&i>=t.next.y&&t.next.y!==t.y){const d=t.x+(i-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(d<=n&&d>s){if(s=d,d===n){if(i===t.y)return t;if(i===t.next.y)return t.next}a=t.x<t.next.x?t:t.next}}t=t.next}while(t!==e);if(!a)return null;if(n===s)return a;const o=a,l=a.x,c=a.y;let h=1/0,u;t=a;do n>=t.x&&t.x>=l&&n!==t.x&&Qi(i<c?n:s,i,l,c,i<c?s:n,i,t.x,t.y)&&(u=Math.abs(i-t.y)/(n-t.x),Hr(t,r)&&(u<h||u===h&&(t.x>a.x||t.x===a.x&&$x(a,t)))&&(a=t,h=u)),t=t.next;while(t!==o);return a}function $x(r,e){return dt(r.prev,r,e.prev)<0&&dt(e.next,r,r.next)<0}function Qx(r,e,t,n){let i=r;do i.z===null&&(i.z=Ho(i.x,i.y,e,t,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==r);i.prevZ.nextZ=null,i.prevZ=null,Kx(i)}function Kx(r){let e,t,n,i,s,a,o,l,c=1;do{for(t=r,r=null,s=null,a=0;t;){for(a++,n=t,o=0,e=0;e<c&&(o++,n=n.nextZ,!!n);e++);for(l=c;o>0||l>0&&n;)o!==0&&(l===0||!n||t.z<=n.z)?(i=t,t=t.nextZ,o--):(i=n,n=n.nextZ,l--),s?s.nextZ=i:r=i,i.prevZ=s,s=i;t=n}s.nextZ=null,c*=2}while(a>1);return r}function Ho(r,e,t,n,i){return r=32767*(r-t)*i,e=32767*(e-n)*i,r=(r|r<<8)&16711935,r=(r|r<<4)&252645135,r=(r|r<<2)&858993459,r=(r|r<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,r|e<<1}function e_(r){let e=r,t=r;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==r);return t}function Qi(r,e,t,n,i,s,a,o){return(i-a)*(e-o)-(r-a)*(s-o)>=0&&(r-a)*(n-o)-(t-a)*(e-o)>=0&&(t-a)*(s-o)-(i-a)*(n-o)>=0}function t_(r,e){return r.next.i!==e.i&&r.prev.i!==e.i&&!n_(r,e)&&(Hr(r,e)&&Hr(e,r)&&i_(r,e)&&(dt(r.prev,r,e.prev)||dt(r,e.prev,e))||ea(r,e)&&dt(r.prev,r,r.next)>0&&dt(e.prev,e,e.next)>0)}function dt(r,e,t){return(e.y-r.y)*(t.x-e.x)-(e.x-r.x)*(t.y-e.y)}function ea(r,e){return r.x===e.x&&r.y===e.y}function zh(r,e,t,n){const i=na(dt(r,e,t)),s=na(dt(r,e,n)),a=na(dt(t,n,r)),o=na(dt(t,n,e));return!!(i!==s&&a!==o||i===0&&ta(r,t,e)||s===0&&ta(r,n,e)||a===0&&ta(t,r,n)||o===0&&ta(t,e,n))}function ta(r,e,t){return e.x<=Math.max(r.x,t.x)&&e.x>=Math.min(r.x,t.x)&&e.y<=Math.max(r.y,t.y)&&e.y>=Math.min(r.y,t.y)}function na(r){return r>0?1:r<0?-1:0}function n_(r,e){let t=r;do{if(t.i!==r.i&&t.next.i!==r.i&&t.i!==e.i&&t.next.i!==e.i&&zh(t,t.next,r,e))return!0;t=t.next}while(t!==r);return!1}function Hr(r,e){return dt(r.prev,r,r.next)<0?dt(r,e,r.next)>=0&&dt(r,r.prev,e)>=0:dt(r,e,r.prev)<0||dt(r,r.next,e)<0}function i_(r,e){let t=r,n=!1;const i=(r.x+e.x)/2,s=(r.y+e.y)/2;do t.y>s!=t.next.y>s&&t.next.y!==t.y&&i<(t.next.x-t.x)*(s-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==r);return n}function Vh(r,e){const t=new Go(r.i,r.x,r.y),n=new Go(e.i,e.x,e.y),i=r.next,s=e.prev;return r.next=e,e.prev=r,t.next=i,i.prev=t,n.next=t,t.prev=n,s.next=n,n.prev=s,n}function kh(r,e,t,n){const i=new Go(r,e,t);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function Gr(r){r.next.prev=r.prev,r.prev.next=r.next,r.prevZ&&(r.prevZ.nextZ=r.nextZ),r.nextZ&&(r.nextZ.prevZ=r.prevZ)}function Go(r,e,t){this.i=r,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=null,this.prevZ=null,this.nextZ=null,this.steiner=!1}function r_(r,e,t,n){let i=0;for(let s=e,a=t-n;s<t;s+=n)i+=(r[a]-r[s])*(r[s+1]+r[a+1]),a=s;return i}class Yn{static area(e){const t=e.length;let n=0;for(let i=t-1,s=0;s<t;i=s++)n+=e[i].x*e[s].y-e[s].x*e[i].y;return n*.5}static isClockWise(e){return Yn.area(e)<0}static triangulateShape(e,t){const n=[],i=[],s=[];Hh(e),Gh(n,e);let a=e.length;t.forEach(Hh);for(let l=0;l<t.length;l++)i.push(a),a+=t[l].length,Gh(n,t[l]);const o=Hx.triangulate(n,i);for(let l=0;l<o.length;l+=3)s.push(o.slice(l,l+3));return s}}function Hh(r){const e=r.length;e>2&&r[e-1].equals(r[0])&&r.pop()}function Gh(r,e){for(let t=0;t<e.length;t++)r.push(e[t].x),r.push(e[t].y)}class Ki extends st{constructor(e=new Vr([new ee(.5,.5),new ee(-.5,.5),new ee(-.5,-.5),new ee(.5,-.5)]),t={}){super();this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const n=this,i=[],s=[];for(let o=0,l=e.length;o<l;o++){const c=e[o];a(c)}this.setAttribute("position",new yt(i,3)),this.setAttribute("uv",new yt(s,2)),this.computeVertexNormals();function a(o){const l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1;let u=t.depth!==void 0?t.depth:1,d=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:f-.1,v=t.bevelOffset!==void 0?t.bevelOffset:0,w=t.bevelSegments!==void 0?t.bevelSegments:3;const m=t.extrudePath,p=t.UVGenerator!==void 0?t.UVGenerator:s_;t.amount!==void 0&&(console.warn("THREE.ExtrudeBufferGeometry: amount has been renamed to depth."),u=t.amount);let b,M=!1,E,D,_,R;m&&(b=m.getSpacedPoints(h),M=!0,d=!1,E=m.computeFrenetFrames(h,!1),D=new C,_=new C,R=new C),d||(w=0,f=0,g=0,v=0);const F=o.extractPoints(c);let z=F.shape;const P=F.holes;if(!Yn.isClockWise(z)){z=z.reverse();for(let X=0,te=P.length;X<te;X++){const ie=P[X];Yn.isClockWise(ie)&&(P[X]=ie.reverse())}}const U=Yn.triangulateShape(z,P),N=z;for(let X=0,te=P.length;X<te;X++){const ie=P[X];z=z.concat(ie)}function H(X,te,ie){return te||console.error("THREE.ExtrudeGeometry: vec does not exist"),te.clone().multiplyScalar(ie).add(X)}const V=z.length,W=U.length;function ae(X,te,ie){let fe,re,Ce;const Pe=X.x-te.x,Be=X.y-te.y,Je=ie.x-X.x,A=ie.y-X.y,T=Pe*Pe+Be*Be,J=Pe*A-Be*Je;if(Math.abs(J)>Number.EPSILON){const j=Math.sqrt(T),ye=Math.sqrt(Je*Je+A*A),_e=te.x-Be/j,I=te.y+Pe/j,le=ie.x-A/ye,$=ie.y+Je/ye,ce=((le-_e)*A-($-I)*Je)/(Pe*A-Be*Je);fe=_e+Pe*ce-X.x,re=I+Be*ce-X.y;const se=fe*fe+re*re;if(se<=2)return new ee(fe,re);Ce=Math.sqrt(se/2)}else{let j=!1;Pe>Number.EPSILON?Je>Number.EPSILON&&(j=!0):Pe<-Number.EPSILON?Je<-Number.EPSILON&&(j=!0):Math.sign(Be)===Math.sign(A)&&(j=!0),j?(fe=-Be,re=Pe,Ce=Math.sqrt(T)):(fe=Pe,re=Be,Ce=Math.sqrt(T/2))}return new ee(fe/Ce,re/Ce)}const me=[];for(let X=0,te=N.length,ie=te-1,fe=X+1;X<te;X++,ie++,fe++)ie===te&&(ie=0),fe===te&&(fe=0),me[X]=ae(N[X],N[ie],N[fe]);const q=[];let Y,de=me.concat();for(let X=0,te=P.length;X<te;X++){const ie=P[X];Y=[];for(let fe=0,re=ie.length,Ce=re-1,Pe=fe+1;fe<re;fe++,Ce++,Pe++)Ce===re&&(Ce=0),Pe===re&&(Pe=0),Y[fe]=ae(ie[fe],ie[Ce],ie[Pe]);q.push(Y),de=de.concat(Y)}for(let X=0;X<w;X++){const te=X/w,ie=f*Math.cos(te*Math.PI/2),fe=g*Math.sin(te*Math.PI/2)+v;for(let re=0,Ce=N.length;re<Ce;re++){const Pe=H(N[re],me[re],fe);Se(Pe.x,Pe.y,-ie)}for(let re=0,Ce=P.length;re<Ce;re++){const Pe=P[re];Y=q[re];for(let Be=0,Je=Pe.length;Be<Je;Be++){const A=H(Pe[Be],Y[Be],fe);Se(A.x,A.y,-ie)}}}const ue=g+v;for(let X=0;X<V;X++){const te=d?H(z[X],de[X],ue):z[X];M?(_.copy(E.normals[0]).multiplyScalar(te.x),D.copy(E.binormals[0]).multiplyScalar(te.y),R.copy(b[0]).add(_).add(D),Se(R.x,R.y,R.z)):Se(te.x,te.y,0)}for(let X=1;X<=h;X++)for(let te=0;te<V;te++){const ie=d?H(z[te],de[te],ue):z[te];M?(_.copy(E.normals[X]).multiplyScalar(ie.x),D.copy(E.binormals[X]).multiplyScalar(ie.y),R.copy(b[X]).add(_).add(D),Se(R.x,R.y,R.z)):Se(ie.x,ie.y,u/h*X)}for(let X=w-1;X>=0;X--){const te=X/w,ie=f*Math.cos(te*Math.PI/2),fe=g*Math.sin(te*Math.PI/2)+v;for(let re=0,Ce=N.length;re<Ce;re++){const Pe=H(N[re],me[re],fe);Se(Pe.x,Pe.y,u+ie)}for(let re=0,Ce=P.length;re<Ce;re++){const Pe=P[re];Y=q[re];for(let Be=0,Je=Pe.length;Be<Je;Be++){const A=H(Pe[Be],Y[Be],fe);M?Se(A.x,A.y+b[h-1].y,b[h-1].x+ie):Se(A.x,A.y,u+ie)}}}xe(),Xe();function xe(){const X=i.length/3;if(d){let te=0,ie=V*te;for(let fe=0;fe<W;fe++){const re=U[fe];Te(re[2]+ie,re[1]+ie,re[0]+ie)}te=h+w*2,ie=V*te;for(let fe=0;fe<W;fe++){const re=U[fe];Te(re[0]+ie,re[1]+ie,re[2]+ie)}}else{for(let te=0;te<W;te++){const ie=U[te];Te(ie[2],ie[1],ie[0])}for(let te=0;te<W;te++){const ie=U[te];Te(ie[0]+V*h,ie[1]+V*h,ie[2]+V*h)}}n.addGroup(X,i.length/3-X,0)}function Xe(){const X=i.length/3;let te=0;Q(N,te),te+=N.length;for(let ie=0,fe=P.length;ie<fe;ie++){const re=P[ie];Q(re,te),te+=re.length}n.addGroup(X,i.length/3-X,1)}function Q(X,te){let ie=X.length;for(;--ie>=0;){const fe=ie;let re=ie-1;re<0&&(re=X.length-1);for(let Ce=0,Pe=h+w*2;Ce<Pe;Ce++){const Be=V*Ce,Je=V*(Ce+1),A=te+fe+Be,T=te+re+Be,J=te+re+Je,j=te+fe+Je;oe(A,T,J,j)}}}function Se(X,te,ie){l.push(X),l.push(te),l.push(ie)}function Te(X,te,ie){ge(X),ge(te),ge(ie);const fe=i.length/3,re=p.generateTopUV(n,i,fe-3,fe-2,fe-1);Ue(re[0]),Ue(re[1]),Ue(re[2])}function oe(X,te,ie,fe){ge(X),ge(te),ge(fe),ge(te),ge(ie),ge(fe);const re=i.length/3,Ce=p.generateSideWallUV(n,i,re-6,re-3,re-2,re-1);Ue(Ce[0]),Ue(Ce[1]),Ue(Ce[3]),Ue(Ce[1]),Ue(Ce[2]),Ue(Ce[3])}function ge(X){i.push(l[X*3+0]),i.push(l[X*3+1]),i.push(l[X*3+2])}function Ue(X){s.push(X.x),s.push(X.y)}}}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return a_(t,n,e)}static fromJSON(e,t){const n=[];for(let s=0,a=e.shapes.length;s<a;s++){const o=t[e.shapes[s]];n.push(o)}const i=e.options.extrudePath;return i!==void 0&&(e.options.extrudePath=new Bh[i.type]().fromJSON(i)),new Ki(n,e.options)}}const s_={generateTopUV:function(r,e,t,n,i){const s=e[t*3],a=e[t*3+1],o=e[n*3],l=e[n*3+1],c=e[i*3],h=e[i*3+1];return[new ee(s,a),new ee(o,l),new ee(c,h)]},generateSideWallUV:function(r,e,t,n,i,s){const a=e[t*3],o=e[t*3+1],l=e[t*3+2],c=e[n*3],h=e[n*3+1],u=e[n*3+2],d=e[i*3],f=e[i*3+1],g=e[i*3+2],v=e[s*3],w=e[s*3+1],m=e[s*3+2];return Math.abs(o-h)<Math.abs(a-c)?[new ee(a,1-l),new ee(c,1-u),new ee(d,1-g),new ee(v,1-m)]:[new ee(o,1-l),new ee(h,1-u),new ee(f,1-g),new ee(w,1-m)]}};function a_(r,e,t){if(t.shapes=[],Array.isArray(r))for(let n=0,i=r.length;n<i;n++){const s=r[n];t.shapes.push(s.uuid)}else t.shapes.push(r.uuid);return e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class Wo extends st{constructor(e=new Vr([new ee(0,.5),new ee(-.5,-.5),new ee(.5,-.5)]),t=12){super();this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const n=[],i=[],s=[],a=[];let o=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let h=0;h<e.length;h++)c(e[h]),this.addGroup(o,l,h),o+=l,l=0;this.setIndex(n),this.setAttribute("position",new yt(i,3)),this.setAttribute("normal",new yt(s,3)),this.setAttribute("uv",new yt(a,2));function c(h){const u=i.length/3,d=h.extractPoints(t);let f=d.shape;const g=d.holes;Yn.isClockWise(f)===!1&&(f=f.reverse());for(let w=0,m=g.length;w<m;w++){const p=g[w];Yn.isClockWise(p)===!0&&(g[w]=p.reverse())}const v=Yn.triangulateShape(f,g);for(let w=0,m=g.length;w<m;w++){const p=g[w];f=f.concat(p)}for(let w=0,m=f.length;w<m;w++){const p=f[w];i.push(p.x,p.y,0),s.push(0,0,1),a.push(p.x,p.y)}for(let w=0,m=v.length;w<m;w++){const p=v[w],b=p[0]+u,M=p[1]+u,E=p[2]+u;n.push(b,M,E),l+=3}}}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return o_(t,e)}static fromJSON(e,t){const n=[];for(let i=0,s=e.shapes.length;i<s;i++){const a=t[e.shapes[i]];n.push(a)}return new Wo(n,e.curveSegments)}}function o_(r,e){if(e.shapes=[],Array.isArray(r))for(let t=0,n=r.length;t<n;t++){const i=r[t];e.shapes.push(i.uuid)}else e.shapes.push(r.uuid);return e}class l_ extends Lt{constructor(e){super();this.type="ShadowMaterial",this.color=new be(0),this.transparent=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this}}l_.prototype.isShadowMaterial=!0;class Wh extends Lt{constructor(e){super();this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new be(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new be(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Si,this.normalScale=new ee(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this}}Wh.prototype.isMeshStandardMaterial=!0;class c_ extends Wh{constructor(e){super();this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ee(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Ot(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.sheenColor=new be(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=0,this.attenuationColor=new be(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new be(1,1,1),this.specularColorMap=null,this._sheen=0,this._clearcoat=0,this._transmission=0,this.setValues(e)}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.ior=e.ior,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}c_.prototype.isMeshPhysicalMaterial=!0;class h_ extends Lt{constructor(e){super();this.type="MeshPhongMaterial",this.color=new be(16777215),this.specular=new be(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new be(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Si,this.normalScale=new ee(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=ls,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.specular.copy(e.specular),this.shininess=e.shininess,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this}}h_.prototype.isMeshPhongMaterial=!0;class u_ extends Lt{constructor(e){super();this.defines={TOON:""},this.type="MeshToonMaterial",this.color=new be(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new be(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Si,this.normalScale=new ee(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.gradientMap=e.gradientMap,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.alphaMap=e.alphaMap,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this}}u_.prototype.isMeshToonMaterial=!0;class d_ extends Lt{constructor(e){super();this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Si,this.normalScale=new ee(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.flatShading=e.flatShading,this}}d_.prototype.isMeshNormalMaterial=!0;class f_ extends Lt{constructor(e){super();this.type="MeshLambertMaterial",this.color=new be(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new be(0),this.emissiveIntensity=1,this.emissiveMap=null,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=ls,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this}}f_.prototype.isMeshLambertMaterial=!0;class p_ extends Lt{constructor(e){super();this.defines={MATCAP:""},this.type="MeshMatcapMaterial",this.color=new be(16777215),this.matcap=null,this.map=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Si,this.normalScale=new ee(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.defines={MATCAP:""},this.color.copy(e.color),this.matcap=e.matcap,this.map=e.map,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.alphaMap=e.alphaMap,this.flatShading=e.flatShading,this}}p_.prototype.isMeshMatcapMaterial=!0;class m_ extends Br{constructor(e){super();this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}}m_.prototype.isLineDashedMaterial=!0;const ct={arraySlice:function(r,e,t){return ct.isTypedArray(r)?new r.constructor(r.subarray(e,t!==void 0?t:r.length)):r.slice(e,t)},convertArray:function(r,e,t){return!r||!t&&r.constructor===e?r:typeof e.BYTES_PER_ELEMENT=="number"?new e(r):Array.prototype.slice.call(r)},isTypedArray:function(r){return ArrayBuffer.isView(r)&&!(r instanceof DataView)},getKeyframeOrder:function(r){function e(i,s){return r[i]-r[s]}const t=r.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n},sortedArray:function(r,e,t){const n=r.length,i=new r.constructor(n);for(let s=0,a=0;a!==n;++s){const o=t[s]*e;for(let l=0;l!==e;++l)i[a++]=r[o+l]}return i},flattenJSON:function(r,e,t,n){let i=1,s=r[0];for(;s!==void 0&&s[n]===void 0;)s=r[i++];if(s===void 0)return;let a=s[n];if(a!==void 0)if(Array.isArray(a))do a=s[n],a!==void 0&&(e.push(s.time),t.push.apply(t,a)),s=r[i++];while(s!==void 0);else if(a.toArray!==void 0)do a=s[n],a!==void 0&&(e.push(s.time),a.toArray(t,t.length)),s=r[i++];while(s!==void 0);else do a=s[n],a!==void 0&&(e.push(s.time),t.push(a)),s=r[i++];while(s!==void 0)},subclip:function(r,e,t,n,i=30){const s=r.clone();s.name=e;const a=[];for(let l=0;l<s.tracks.length;++l){const c=s.tracks[l],h=c.getValueSize(),u=[],d=[];for(let f=0;f<c.times.length;++f){const g=c.times[f]*i;if(!(g<t||g>=n)){u.push(c.times[f]);for(let v=0;v<h;++v)d.push(c.values[f*h+v])}}u.length!==0&&(c.times=ct.convertArray(u,c.times.constructor),c.values=ct.convertArray(d,c.values.constructor),a.push(c))}s.tracks=a;let o=1/0;for(let l=0;l<s.tracks.length;++l)o>s.tracks[l].times[0]&&(o=s.tracks[l].times[0]);for(let l=0;l<s.tracks.length;++l)s.tracks[l].shift(-1*o);return s.resetDuration(),s},makeClipAdditive:function(r,e=0,t=r,n=30){n<=0&&(n=30);const i=t.tracks.length,s=e/n;for(let a=0;a<i;++a){const o=t.tracks[a],l=o.ValueTypeName;if(l==="bool"||l==="string")continue;const c=r.tracks.find(function(m){return m.name===o.name&&m.ValueTypeName===l});if(c===void 0)continue;let h=0;const u=o.getValueSize();o.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(h=u/3);let d=0;const f=c.getValueSize();c.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(d=f/3);const g=o.times.length-1;let v;if(s<=o.times[0]){const m=h,p=u-h;v=ct.arraySlice(o.values,m,p)}else if(s>=o.times[g]){const m=g*u+h,p=m+u-h;v=ct.arraySlice(o.values,m,p)}else{const m=o.createInterpolant(),p=h,b=u-h;m.evaluate(s),v=ct.arraySlice(m.resultBuffer,p,b)}l==="quaternion"&&new Ht().fromArray(v).normalize().conjugate().toArray(v);const w=c.times.length;for(let m=0;m<w;++m){const p=m*f+d;if(l==="quaternion")Ht.multiplyQuaternionsFlat(c.values,p,v,0,c.values,p);else{const b=f-d*2;for(let M=0;M<b;++M)c.values[p+M]-=v[M]}}}return r.blendMode=nc,r}};class Zn{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let n=this._cachedIndex,i=t[n],s=t[n-1];e:{t:{let a;n:{i:if(!(e<i)){for(let o=n+2;;){if(i===void 0){if(e<s)break i;return n=t.length,this._cachedIndex=n,this.afterEnd_(n-1,e,s)}if(n===o)break;if(s=i,i=t[++n],e<i)break t}a=t.length;break n}if(!(e>=s)){const o=t[1];e<o&&(n=2,s=o);for(let l=n-2;;){if(s===void 0)return this._cachedIndex=0,this.beforeStart_(0,e,i);if(n===l)break;if(i=s,s=t[--n-1],e>=s)break t}a=n,n=0;break n}break e}for(;n<a;){const o=n+a>>>1;e<t[o]?a=o:n=o+1}if(i=t[n],s=t[n-1],s===void 0)return this._cachedIndex=0,this.beforeStart_(0,e,i);if(i===void 0)return n=t.length,this._cachedIndex=n,this.afterEnd_(n-1,s,e)}this._cachedIndex=n,this.intervalChanged_(n,s,i)}return this.interpolate_(n,s,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i;for(let a=0;a!==i;++a)t[a]=n[s+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}Zn.prototype.beforeStart_=Zn.prototype.copySampleValue_;Zn.prototype.afterEnd_=Zn.prototype.copySampleValue_;class g_ extends Zn{constructor(e,t,n,i){super(e,t,n,i);this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:wi,endingEnd:wi}}intervalChanged_(e,t,n){const i=this.parameterPositions;let s=e-2,a=e+1,o=i[s],l=i[a];if(o===void 0)switch(this.getSettings_().endingStart){case bi:s=e,o=2*t-n;break;case fs:s=i.length-2,o=t+i[s]-i[s+1];break;default:s=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case bi:a=e,l=2*n-t;break;case fs:a=1,l=n+i[1]-i[0];break;default:a=e-1,l=t}const c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=s*h,this._offsetNext=a*h}interpolate_(e,t,n,i){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,g=(n-t)/(i-t),v=g*g,w=v*g,m=-d*w+2*d*v-d*g,p=(1+d)*w+(-1.5-2*d)*v+(-.5+d)*g+1,b=(-1-f)*w+(1.5+f)*v+.5*g,M=f*w-f*v;for(let E=0;E!==o;++E)s[E]=m*a[h+E]+p*a[c+E]+b*a[l+E]+M*a[u+E];return s}}class Xh extends Zn{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=(n-t)/(i-t),u=1-h;for(let d=0;d!==o;++d)s[d]=a[c+d]*u+a[l+d]*h;return s}}class v_ extends Zn{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}}class _n{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=ct.convertArray(t,this.TimeBufferType),this.values=ct.convertArray(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:ct.convertArray(e.times,Array),values:ct.convertArray(e.values,Array)};const i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new v_(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Xh(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new g_(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case us:t=this.InterpolantFactoryMethodDiscrete;break;case ds:t=this.InterpolantFactoryMethodLinear;break;case za:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return us;case this.InterpolantFactoryMethodLinear:return ds;case this.InterpolantFactoryMethodSmooth:return za}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e}return this}trim(e,t){const n=this.times,i=n.length;let s=0,a=i-1;for(;s!==i&&n[s]<e;)++s;for(;a!==-1&&n[a]>t;)--a;if(++a,s!==0||a!==i){s>=a&&(a=Math.max(a,1),s=a-1);const o=this.getValueSize();this.times=ct.arraySlice(n,s,a),this.values=ct.arraySlice(this.values,s*o,a*o)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!=0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);const n=this.times,i=this.values,s=n.length;s===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==s;o++){const l=n[o];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(i!==void 0&&ct.isTypedArray(i))for(let o=0,l=i.length;o!==l;++o){const c=i[o];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){const e=ct.arraySlice(this.times),t=ct.arraySlice(this.values),n=this.getValueSize(),i=this.getInterpolation()===za,s=e.length-1;let a=1;for(let o=1;o<s;++o){let l=!1;const c=e[o],h=e[o+1];if(c!==h&&(o!==1||c!==e[0]))if(i)l=!0;else{const u=o*n,d=u-n,f=u+n;for(let g=0;g!==n;++g){const v=t[u+g];if(v!==t[d+g]||v!==t[f+g]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];const u=o*n,d=a*n;for(let f=0;f!==n;++f)t[d+f]=t[u+f]}++a}}if(s>0){e[a]=e[s];for(let o=s*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=ct.arraySlice(e,0,a),this.values=ct.arraySlice(t,0,a*n)):(this.times=e,this.values=t),this}clone(){const e=ct.arraySlice(this.times,0),t=ct.arraySlice(this.values,0),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,i}}_n.prototype.TimeBufferType=Float32Array;_n.prototype.ValueBufferType=Float32Array;_n.prototype.DefaultInterpolation=ds;class er extends _n{}er.prototype.ValueTypeName="bool";er.prototype.ValueBufferType=Array;er.prototype.DefaultInterpolation=us;er.prototype.InterpolantFactoryMethodLinear=void 0;er.prototype.InterpolantFactoryMethodSmooth=void 0;class qh extends _n{}qh.prototype.ValueTypeName="color";class ia extends _n{}ia.prototype.ValueTypeName="number";class x_ extends Zn{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(i-t);let c=e*o;for(let h=c+o;c!==h;c+=4)Ht.slerpFlat(s,0,a,c-o,a,c,l);return s}}class Wr extends _n{InterpolantFactoryMethodLinear(e){return new x_(this.times,this.values,this.getValueSize(),e)}}Wr.prototype.ValueTypeName="quaternion";Wr.prototype.DefaultInterpolation=ds;Wr.prototype.InterpolantFactoryMethodSmooth=void 0;class tr extends _n{}tr.prototype.ValueTypeName="string";tr.prototype.ValueBufferType=Array;tr.prototype.DefaultInterpolation=us;tr.prototype.InterpolantFactoryMethodLinear=void 0;tr.prototype.InterpolantFactoryMethodSmooth=void 0;class ra extends _n{}ra.prototype.ValueTypeName="vector";class Yh{constructor(e,t=-1,n,i=Va){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=rn(),this.duration<0&&this.resetDuration()}static parse(e){const t=[],n=e.tracks,i=1/(e.fps||1);for(let a=0,o=n.length;a!==o;++a)t.push(y_(n[a]).scale(i));const s=new this(e.name,e.duration,t,e.blendMode);return s.uuid=e.uuid,s}static toJSON(e){const t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode};for(let s=0,a=n.length;s!==a;++s)t.push(_n.toJSON(n[s]));return i}static CreateFromMorphTargetSequence(e,t,n,i){const s=t.length,a=[];for(let o=0;o<s;o++){let l=[],c=[];l.push((o+s-1)%s,o,(o+1)%s),c.push(0,1,0);const h=ct.getKeyframeOrder(l);l=ct.sortedArray(l,1,h),c=ct.sortedArray(c,1,h),!i&&l[0]===0&&(l.push(s),c.push(c[0])),a.push(new ia(".morphTargetInfluences["+t[o].name+"]",l,c).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){const i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){const i={},s=/^([\w-]*?)([\d]+)$/;for(let o=0,l=e.length;o<l;o++){const c=e[o],h=c.name.match(s);if(h&&h.length>1){const u=h[1];let d=i[u];d||(i[u]=d=[]),d.push(c)}}const a=[];for(const o in i)a.push(this.CreateFromMorphTargetSequence(o,i[o],t,n));return a}static parseAnimation(e,t){if(!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;const n=function(u,d,f,g,v){if(f.length!==0){const w=[],m=[];ct.flattenJSON(f,w,m,g),w.length!==0&&v.push(new u(d,w,m))}},i=[],s=e.name||"default",a=e.fps||30,o=e.blendMode;let l=e.length||-1;const c=e.hierarchy||[];for(let u=0;u<c.length;u++){const d=c[u].keys;if(!(!d||d.length===0))if(d[0].morphTargets){const f={};let g;for(g=0;g<d.length;g++)if(d[g].morphTargets)for(let v=0;v<d[g].morphTargets.length;v++)f[d[g].morphTargets[v]]=-1;for(const v in f){const w=[],m=[];for(let p=0;p!==d[g].morphTargets.length;++p){const b=d[g];w.push(b.time),m.push(b.morphTarget===v?1:0)}i.push(new ia(".morphTargetInfluence["+v+"]",w,m))}l=f.length*(a||1)}else{const f=".bones["+t[u].name+"]";n(ra,f+".position",d,"pos",i),n(Wr,f+".quaternion",d,"rot",i),n(ra,f+".scale",d,"scl",i)}}return i.length===0?null:new this(s,l,i,o)}resetDuration(){const e=this.tracks;let t=0;for(let n=0,i=e.length;n!==i;++n){const s=this.tracks[n];t=Math.max(t,s.times[s.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let t=0;t<this.tracks.length;t++)e.push(this.tracks[t].clone());return new this.constructor(this.name,this.duration,e,this.blendMode)}toJSON(){return this.constructor.toJSON(this)}}function __(r){switch(r.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return ia;case"vector":case"vector2":case"vector3":case"vector4":return ra;case"color":return qh;case"quaternion":return Wr;case"bool":case"boolean":return er;case"string":return tr}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+r)}function y_(r){if(r.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=__(r.type);if(r.times===void 0){const t=[],n=[];ct.flattenJSON(r.keys,t,n,"value"),r.times=t,r.values=n}return e.parse!==void 0?e.parse(r):new e(r.name,r.times,r.values,r.interpolation)}const nr={enabled:!1,files:{},add:function(r,e){this.enabled!==!1&&(this.files[r]=e)},get:function(r){if(this.enabled!==!1)return this.files[r]},remove:function(r){delete this.files[r]},clear:function(){this.files={}}};class M_{constructor(e,t,n){const i=this;let s=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(h){o++,s===!1&&i.onStart!==void 0&&i.onStart(h,a,o),s=!0},this.itemEnd=function(h){a++,i.onProgress!==void 0&&i.onProgress(h,a,o),a===o&&(s=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){const u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){const f=c[u],g=c[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return g}return null}}}const w_=new M_;class jn{constructor(e){this.manager=e!==void 0?e:w_,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const n=this;return new Promise(function(i,s){n.load(e,i,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}const Dn={};class b_ extends jn{constructor(e){super(e)}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=nr.get(e);if(s!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(s),this.manager.itemEnd(e)},0),s;if(Dn[e]!==void 0){Dn[e].push({onLoad:t,onProgress:n,onError:i});return}Dn[e]=[],Dn[e].push({onLoad:t,onProgress:n,onError:i});const a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"});fetch(a).then(o=>{if(o.status===200||o.status===0){o.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received.");const l=Dn[e],c=o.body.getReader(),h=o.headers.get("Content-Length"),u=h?parseInt(h):0,d=u!==0;let f=0;return new ReadableStream({start(g){v();function v(){c.read().then(({done:w,value:m})=>{if(w)g.close();else{f+=m.byteLength;const p=new ProgressEvent("progress",{lengthComputable:d,loaded:f,total:u});for(let b=0,M=l.length;b<M;b++){const E=l[b];E.onProgress&&E.onProgress(p)}g.enqueue(m),v()}})}}})}else throw Error(`fetch for "${o.url}" responded with ${o.status}: ${o.statusText}`)}).then(o=>{const l=new Response(o);switch(this.responseType){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then(c=>new DOMParser().parseFromString(c,this.mimeType));case"json":return l.json();default:return l.text()}}).then(o=>{nr.add(e,o);const l=Dn[e];delete Dn[e];for(let c=0,h=l.length;c<h;c++){const u=l[c];u.onLoad&&u.onLoad(o)}this.manager.itemEnd(e)}).catch(o=>{const l=Dn[e];delete Dn[e];for(let c=0,h=l.length;c<h;c++){const u=l[c];u.onError&&u.onError(o)}this.manager.itemError(e),this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}}class Zh extends jn{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,a=nr.get(e);if(a!==void 0)return s.manager.itemStart(e),setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0),a;const o=vs("img");function l(){h(),nr.add(e,this),t&&t(this),s.manager.itemEnd(e)}function c(u){h(),i&&i(u),s.manager.itemError(e),s.manager.itemEnd(e)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.substr(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),s.manager.itemStart(e),o.src=e,o}}class S_ extends jn{constructor(e){super(e)}load(e,t,n,i){const s=new Ns,a=new Zh(this.manager);a.setCrossOrigin(this.crossOrigin),a.setPath(this.path);let o=0;function l(c){a.load(e[c],function(h){s.images[c]=h,o++,o===6&&(s.needsUpdate=!0,t&&t(s))},void 0,i)}for(let c=0;c<e.length;++c)l(c);return s}}class T_ extends jn{constructor(e){super(e)}load(e,t,n,i){const s=new Et,a=new Zh(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){s.image=o,s.needsUpdate=!0,t!==void 0&&t(s)},n,i),s}}class yn extends $e{constructor(e,t=1){super();this.type="Light",this.color=new be(e),this.intensity=t}dispose(){}copy(e){return super.copy(e),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}}yn.prototype.isLight=!0;class E_ extends yn{constructor(e,t,n){super(e,n);this.type="HemisphereLight",this.position.copy($e.DefaultUp),this.updateMatrix(),this.groundColor=new be(t)}copy(e){return yn.prototype.copy.call(this,e),this.groundColor.copy(e.groundColor),this}}E_.prototype.isHemisphereLight=!0;const jh=new Le,Jh=new C,$h=new C;class Xo{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ee(512,512),this.map=null,this.mapPass=null,this.matrix=new Le,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Bs,this._frameExtents=new ee(1,1),this._viewportCount=1,this._viewports=[new it(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Jh.setFromMatrixPosition(e.matrixWorld),t.position.copy(Jh),$h.setFromMatrixPosition(e.target.matrixWorld),t.lookAt($h),t.updateMatrixWorld(),jh.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(jh),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(t.projectionMatrix),n.multiply(t.matrixWorldInverse)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class Qh extends Xo{constructor(){super(new Bt(50,1,.5,500));this.focus=1}updateMatrices(e){const t=this.camera,n=Mr*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height,s=e.distance||t.far;(n!==t.fov||i!==t.aspect||s!==t.far)&&(t.fov=n,t.aspect=i,t.far=s,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}Qh.prototype.isSpotLightShadow=!0;class A_ extends yn{constructor(e,t,n=0,i=Math.PI/3,s=0,a=1){super(e,t);this.type="SpotLight",this.position.copy($e.DefaultUp),this.updateMatrix(),this.target=new $e,this.distance=n,this.angle=i,this.penumbra=s,this.decay=a,this.shadow=new Qh}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}A_.prototype.isSpotLight=!0;const Kh=new Le,Xr=new C,qo=new C;class eu extends Xo{constructor(){super(new Bt(90,1,.5,500));this._frameExtents=new ee(4,2),this._viewportCount=6,this._viewports=[new it(2,1,1,1),new it(0,1,1,1),new it(3,1,1,1),new it(1,1,1,1),new it(3,0,1,1),new it(1,0,1,1)],this._cubeDirections=[new C(1,0,0),new C(-1,0,0),new C(0,0,1),new C(0,0,-1),new C(0,1,0),new C(0,-1,0)],this._cubeUps=[new C(0,1,0),new C(0,1,0),new C(0,1,0),new C(0,1,0),new C(0,0,1),new C(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,i=this.matrix,s=e.distance||n.far;s!==n.far&&(n.far=s,n.updateProjectionMatrix()),Xr.setFromMatrixPosition(e.matrixWorld),n.position.copy(Xr),qo.copy(n.position),qo.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(qo),n.updateMatrixWorld(),i.makeTranslation(-Xr.x,-Xr.y,-Xr.z),Kh.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Kh)}}eu.prototype.isPointLightShadow=!0;class C_ extends yn{constructor(e,t,n=0,i=1){super(e,t);this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new eu}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}C_.prototype.isPointLight=!0;class tu extends Xo{constructor(){super(new _o(-5,5,5,-5,.5,500))}}tu.prototype.isDirectionalLightShadow=!0;class L_ extends yn{constructor(e,t){super(e,t);this.type="DirectionalLight",this.position.copy($e.DefaultUp),this.updateMatrix(),this.target=new $e,this.shadow=new tu}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}L_.prototype.isDirectionalLight=!0;class R_ extends yn{constructor(e,t){super(e,t);this.type="AmbientLight"}}R_.prototype.isAmbientLight=!0;class P_ extends yn{constructor(e,t,n=10,i=10){super(e,t);this.type="RectAreaLight",this.width=n,this.height=i}get power(){return this.intensity*this.width*this.height*Math.PI}set power(e){this.intensity=e/(this.width*this.height*Math.PI)}copy(e){return super.copy(e),this.width=e.width,this.height=e.height,this}toJSON(e){const t=super.toJSON(e);return t.object.width=this.width,t.object.height=this.height,t}}P_.prototype.isRectAreaLight=!0;class nu{constructor(){this.coefficients=[];for(let e=0;e<9;e++)this.coefficients.push(new C)}set(e){for(let t=0;t<9;t++)this.coefficients[t].copy(e[t]);return this}zero(){for(let e=0;e<9;e++)this.coefficients[e].set(0,0,0);return this}getAt(e,t){const n=e.x,i=e.y,s=e.z,a=this.coefficients;return t.copy(a[0]).multiplyScalar(.282095),t.addScaledVector(a[1],.488603*i),t.addScaledVector(a[2],.488603*s),t.addScaledVector(a[3],.488603*n),t.addScaledVector(a[4],1.092548*(n*i)),t.addScaledVector(a[5],1.092548*(i*s)),t.addScaledVector(a[6],.315392*(3*s*s-1)),t.addScaledVector(a[7],1.092548*(n*s)),t.addScaledVector(a[8],.546274*(n*n-i*i)),t}getIrradianceAt(e,t){const n=e.x,i=e.y,s=e.z,a=this.coefficients;return t.copy(a[0]).multiplyScalar(.886227),t.addScaledVector(a[1],2*.511664*i),t.addScaledVector(a[2],2*.511664*s),t.addScaledVector(a[3],2*.511664*n),t.addScaledVector(a[4],2*.429043*n*i),t.addScaledVector(a[5],2*.429043*i*s),t.addScaledVector(a[6],.743125*s*s-.247708),t.addScaledVector(a[7],2*.429043*n*s),t.addScaledVector(a[8],.429043*(n*n-i*i)),t}add(e){for(let t=0;t<9;t++)this.coefficients[t].add(e.coefficients[t]);return this}addScaledSH(e,t){for(let n=0;n<9;n++)this.coefficients[n].addScaledVector(e.coefficients[n],t);return this}scale(e){for(let t=0;t<9;t++)this.coefficients[t].multiplyScalar(e);return this}lerp(e,t){for(let n=0;n<9;n++)this.coefficients[n].lerp(e.coefficients[n],t);return this}equals(e){for(let t=0;t<9;t++)if(!this.coefficients[t].equals(e.coefficients[t]))return!1;return!0}copy(e){return this.set(e.coefficients)}clone(){return new this.constructor().copy(this)}fromArray(e,t=0){const n=this.coefficients;for(let i=0;i<9;i++)n[i].fromArray(e,t+i*3);return this}toArray(e=[],t=0){const n=this.coefficients;for(let i=0;i<9;i++)n[i].toArray(e,t+i*3);return e}static getBasisAt(e,t){const n=e.x,i=e.y,s=e.z;t[0]=.282095,t[1]=.488603*i,t[2]=.488603*s,t[3]=.488603*n,t[4]=1.092548*n*i,t[5]=1.092548*i*s,t[6]=.315392*(3*s*s-1),t[7]=1.092548*n*s,t[8]=.546274*(n*n-i*i)}}nu.prototype.isSphericalHarmonics3=!0;class Yo extends yn{constructor(e=new nu,t=1){super(void 0,t);this.sh=e}copy(e){return super.copy(e),this.sh.copy(e.sh),this}fromJSON(e){return this.intensity=e.intensity,this.sh.fromArray(e.sh),this}toJSON(e){const t=super.toJSON(e);return t.object.sh=this.sh.toArray(),t}}Yo.prototype.isLightProbe=!0;class D_{static decodeText(e){if(typeof TextDecoder!="undefined")return new TextDecoder().decode(e);let t="";for(let n=0,i=e.length;n<i;n++)t+=String.fromCharCode(e[n]);try{return decodeURIComponent(escape(t))}catch{return t}}static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.substr(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}class I_ extends st{constructor(){super();this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}clone(){return new this.constructor().copy(this)}toJSON(){const e=super.toJSON(this);return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}}I_.prototype.isInstancedBufferGeometry=!0;class F_ extends jn{constructor(e){super(e);typeof createImageBitmap=="undefined"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch=="undefined"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"}}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,a=nr.get(e);if(a!==void 0)return s.manager.itemStart(e),setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0),a;const o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader,fetch(e,o).then(function(l){return l.blob()}).then(function(l){return createImageBitmap(l,Object.assign(s.options,{colorSpaceConversion:"none"}))}).then(function(l){nr.add(e,l),t&&t(l),s.manager.itemEnd(e)}).catch(function(l){i&&i(l),s.manager.itemError(e),s.manager.itemEnd(e)}),s.manager.itemStart(e)}}F_.prototype.isImageBitmapLoader=!0;let sa;const N_={getContext:function(){return sa===void 0&&(sa=new(window.AudioContext||window.webkitAudioContext)),sa},setContext:function(r){sa=r}};class O_ extends jn{constructor(e){super(e)}load(e,t,n,i){const s=this,a=new b_(this.manager);a.setResponseType("arraybuffer"),a.setPath(this.path),a.setRequestHeader(this.requestHeader),a.setWithCredentials(this.withCredentials),a.load(e,function(o){try{const l=o.slice(0);N_.getContext().decodeAudioData(l,function(h){t(h)})}catch(l){i?i(l):console.error(l),s.manager.itemError(e)}},n,i)}}class B_ extends Yo{constructor(e,t,n=1){super(void 0,n);const i=new be().set(e),s=new be().set(t),a=new C(i.r,i.g,i.b),o=new C(s.r,s.g,s.b),l=Math.sqrt(Math.PI),c=l*Math.sqrt(.75);this.sh.coefficients[0].copy(a).add(o).multiplyScalar(l),this.sh.coefficients[1].copy(a).sub(o).multiplyScalar(c)}}B_.prototype.isHemisphereLightProbe=!0;class U_ extends Yo{constructor(e,t=1){super(void 0,t);const n=new be().set(e);this.sh.coefficients[0].set(n.r,n.g,n.b).multiplyScalar(2*Math.sqrt(Math.PI))}}U_.prototype.isAmbientLightProbe=!0;class gM{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=iu(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=iu();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function iu(){return(typeof performance=="undefined"?Date:performance).now()}class z_ extends $e{constructor(e){super();this.type="Audio",this.listener=e,this.context=e.context,this.gain=this.context.createGain(),this.gain.connect(e.getInput()),this.autoplay=!1,this.buffer=null,this.detune=0,this.loop=!1,this.loopStart=0,this.loopEnd=0,this.offset=0,this.duration=void 0,this.playbackRate=1,this.isPlaying=!1,this.hasPlaybackControl=!0,this.source=null,this.sourceType="empty",this._startedAt=0,this._progress=0,this._connected=!1,this.filters=[]}getOutput(){return this.gain}setNodeSource(e){return this.hasPlaybackControl=!1,this.sourceType="audioNode",this.source=e,this.connect(),this}setMediaElementSource(e){return this.hasPlaybackControl=!1,this.sourceType="mediaNode",this.source=this.context.createMediaElementSource(e),this.connect(),this}setMediaStreamSource(e){return this.hasPlaybackControl=!1,this.sourceType="mediaStreamNode",this.source=this.context.createMediaStreamSource(e),this.connect(),this}setBuffer(e){return this.buffer=e,this.sourceType="buffer",this.autoplay&&this.play(),this}play(e=0){if(this.isPlaying===!0){console.warn("THREE.Audio: Audio is already playing.");return}if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}this._startedAt=this.context.currentTime+e;const t=this.context.createBufferSource();return t.buffer=this.buffer,t.loop=this.loop,t.loopStart=this.loopStart,t.loopEnd=this.loopEnd,t.onended=this.onEnded.bind(this),t.start(this._startedAt,this._progress+this.offset,this.duration),this.isPlaying=!0,this.source=t,this.setDetune(this.detune),this.setPlaybackRate(this.playbackRate),this.connect()}pause(){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this.isPlaying===!0&&(this._progress+=Math.max(this.context.currentTime-this._startedAt,0)*this.playbackRate,this.loop===!0&&(this._progress=this._progress%(this.duration||this.buffer.duration)),this.source.stop(),this.source.onended=null,this.isPlaying=!1),this}stop(){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this._progress=0,this.source.stop(),this.source.onended=null,this.isPlaying=!1,this}connect(){if(this.filters.length>0){this.source.connect(this.filters[0]);for(let e=1,t=this.filters.length;e<t;e++)this.filters[e-1].connect(this.filters[e]);this.filters[this.filters.length-1].connect(this.getOutput())}else this.source.connect(this.getOutput());return this._connected=!0,this}disconnect(){if(this.filters.length>0){this.source.disconnect(this.filters[0]);for(let e=1,t=this.filters.length;e<t;e++)this.filters[e-1].disconnect(this.filters[e]);this.filters[this.filters.length-1].disconnect(this.getOutput())}else this.source.disconnect(this.getOutput());return this._connected=!1,this}getFilters(){return this.filters}setFilters(e){return e||(e=[]),this._connected===!0?(this.disconnect(),this.filters=e.slice(),this.connect()):this.filters=e.slice(),this}setDetune(e){if(this.detune=e,this.source.detune!==void 0)return this.isPlaying===!0&&this.source.detune.setTargetAtTime(this.detune,this.context.currentTime,.01),this}getDetune(){return this.detune}getFilter(){return this.getFilters()[0]}setFilter(e){return this.setFilters(e?[e]:[])}setPlaybackRate(e){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this.playbackRate=e,this.isPlaying===!0&&this.source.playbackRate.setTargetAtTime(this.playbackRate,this.context.currentTime,.01),this}getPlaybackRate(){return this.playbackRate}onEnded(){this.isPlaying=!1}getLoop(){return this.hasPlaybackControl===!1?(console.warn("THREE.Audio: this Audio has no playback control."),!1):this.loop}setLoop(e){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this.loop=e,this.isPlaying===!0&&(this.source.loop=this.loop),this}setLoopStart(e){return this.loopStart=e,this}setLoopEnd(e){return this.loopEnd=e,this}getVolume(){return this.gain.gain.value}setVolume(e){return this.gain.gain.setTargetAtTime(e,this.context.currentTime,.01),this}}class V_{constructor(e,t,n){this.binding=e,this.valueSize=n;let i,s,a;switch(t){case"quaternion":i=this._slerp,s=this._slerpAdditive,a=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case"string":case"bool":i=this._select,s=this._select,a=this._setAdditiveIdentityOther,this.buffer=new Array(n*5);break;default:i=this._lerp,s=this._lerpAdditive,a=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=i,this._mixBufferRegionAdditive=s,this._setIdentity=a,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){const n=this.buffer,i=this.valueSize,s=e*i+i;let a=this.cumulativeWeight;if(a===0){for(let o=0;o!==i;++o)n[s+o]=n[o];a=t}else{a+=t;const o=t/a;this._mixBufferRegion(n,s,0,o,i)}this.cumulativeWeight=a}accumulateAdditive(e){const t=this.buffer,n=this.valueSize,i=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,i,0,e,n),this.cumulativeWeightAdditive+=e}apply(e){const t=this.valueSize,n=this.buffer,i=e*t+t,s=this.cumulativeWeight,a=this.cumulativeWeightAdditive,o=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,s<1){const l=t*this._origIndex;this._mixBufferRegion(n,i,l,1-s,t)}a>0&&this._mixBufferRegionAdditive(n,i,this._addIndex*t,1,t);for(let l=t,c=t+t;l!==c;++l)if(n[l]!==n[l+t]){o.setValue(n,i);break}}saveOriginalState(){const e=this.binding,t=this.buffer,n=this.valueSize,i=n*this._origIndex;e.getValue(t,i);for(let s=n,a=i;s!==a;++s)t[s]=t[i+s%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){const e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){const e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let n=e;n<t;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){const e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[t+n]=this.buffer[e+n]}_select(e,t,n,i,s){if(i>=.5)for(let a=0;a!==s;++a)e[t+a]=e[n+a]}_slerp(e,t,n,i){Ht.slerpFlat(e,t,e,t,e,n,i)}_slerpAdditive(e,t,n,i,s){const a=this._workIndex*s;Ht.multiplyQuaternionsFlat(e,a,e,t,e,n),Ht.slerpFlat(e,t,e,t,e,a,i)}_lerp(e,t,n,i,s){const a=1-i;for(let o=0;o!==s;++o){const l=t+o;e[l]=e[l]*a+e[n+o]*i}}_lerpAdditive(e,t,n,i,s){for(let a=0;a!==s;++a){const o=t+a;e[o]=e[o]+e[n+a]*i}}}const Zo="\\[\\]\\.:\\/",k_=new RegExp("["+Zo+"]","g"),jo="[^"+Zo+"]",H_="[^"+Zo.replace("\\.","")+"]",G_=/((?:WC+[\/:])*)/.source.replace("WC",jo),W_=/(WCOD+)?/.source.replace("WCOD",H_),X_=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",jo),q_=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",jo),Y_=new RegExp("^"+G_+W_+X_+q_+"$"),Z_=["material","materials","bones"];class j_{constructor(e,t,n){const i=n||Ke.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();const n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){const n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,s=n.length;i!==s;++i)n[i].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class Ke{constructor(e,t,n){this.path=t,this.parsedPath=n||Ke.parseTrackName(t),this.node=Ke.findNode(e,this.parsedPath.nodeName)||e,this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new Ke.Composite(e,t,n):new Ke(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(k_,"")}static parseTrackName(e){const t=Y_.exec(e);if(!t)throw new Error("PropertyBinding: Cannot parse trackName: "+e);const n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){const s=n.nodeName.substring(i+1);Z_.indexOf(s)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=s)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(!t||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){const n=function(s){for(let a=0;a<s.length;a++){const o=s[a];if(o.name===t||o.uuid===t)return o;const l=n(o.children);if(l)return l}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,n=t.objectName,i=t.propertyName;let s=t.propertyIndex;if(e||(e=Ke.findNode(this.rootNode,t.nodeName)||this.rootNode,this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.error("THREE.PropertyBinding: Trying to update node for track: "+this.path+" but it wasn't found.");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}const a=e[i];if(a===void 0){const c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?o=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(s!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(e.geometry.isBufferGeometry){if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}else{console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences on THREE.Geometry. Use THREE.BufferGeometry instead.",this);return}}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=s}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}Ke.Composite=j_;Ke.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Ke.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Ke.prototype.GetterByBindingType=[Ke.prototype._getValue_direct,Ke.prototype._getValue_array,Ke.prototype._getValue_arrayElement,Ke.prototype._getValue_toArray];Ke.prototype.SetterByBindingTypeAndVersioning=[[Ke.prototype._setValue_direct,Ke.prototype._setValue_direct_setNeedsUpdate,Ke.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Ke.prototype._setValue_array,Ke.prototype._setValue_array_setNeedsUpdate,Ke.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Ke.prototype._setValue_arrayElement,Ke.prototype._setValue_arrayElement_setNeedsUpdate,Ke.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Ke.prototype._setValue_fromArray,Ke.prototype._setValue_fromArray_setNeedsUpdate,Ke.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];class J_{constructor(e,t,n=null,i=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=n,this.blendMode=i;const s=t.tracks,a=s.length,o=new Array(a),l={endingStart:wi,endingEnd:wi};for(let c=0;c!==a;++c){const h=s[c].createInterpolant(null);o[c]=h,h.settings=l}this._interpolantSettings=l,this._interpolants=o,this._propertyBindings=new Array(a),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._weightInterpolant=null,this.loop=bf,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,n){if(e.fadeOut(t),this.fadeIn(t),n){const i=this._clip.duration,s=e._clip.duration,a=s/i,o=i/s;e.warp(1,a,t),this.warp(o,1,t)}return this}crossFadeTo(e,t,n){return e.crossFadeFrom(this,t,n)}stopFading(){const e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,n){const i=this._mixer,s=i.time,a=this.timeScale;let o=this._timeScaleInterpolant;o===null&&(o=i._lendControlInterpolant(),this._timeScaleInterpolant=o);const l=o.parameterPositions,c=o.sampleValues;return l[0]=s,l[1]=s+n,c[0]=e/a,c[1]=t/a,this}stopWarping(){const e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,n,i){if(!this.enabled){this._updateWeight(e);return}const s=this._startTime;if(s!==null){const l=(e-s)*n;if(l<0||n===0)return;this._startTime=null,t=n*l}t*=this._updateTimeScale(e);const a=this._updateTime(t),o=this._updateWeight(e);if(o>0){const l=this._interpolants,c=this._propertyBindings;switch(this.blendMode){case nc:for(let h=0,u=l.length;h!==u;++h)l[h].evaluate(a),c[h].accumulateAdditive(o);break;case Va:default:for(let h=0,u=l.length;h!==u;++h)l[h].evaluate(a),c[h].accumulate(i,o)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;const n=this._weightInterpolant;if(n!==null){const i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(this.stopFading(),i===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;const n=this._timeScaleInterpolant;n!==null&&(t*=n.evaluate(e)[0],e>n.parameterPositions[1]&&(this.stopWarping(),t===0?this.paused=!0:this.timeScale=t))}return this._effectiveTimeScale=t,t}_updateTime(e){const t=this._clip.duration,n=this.loop;let i=this.time+e,s=this._loopCount;const a=n===Sf;if(e===0)return s===-1?i:a&&(s&1)==1?t-i:i;if(n===wf){s===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(i>=t)i=t;else if(i<0)i=0;else{this.time=i;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e<0?-1:1})}}else{if(s===-1&&(e>=0?(s=0,this._setEndings(!0,this.repetitions===0,a)):this._setEndings(this.repetitions===0,!0,a)),i>=t||i<0){const o=Math.floor(i/t);i-=t*o,s+=Math.abs(o);const l=this.repetitions-s;if(l<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,i=e>0?t:0,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e>0?1:-1});else{if(l===1){const c=e<0;this._setEndings(c,!c,a)}else this._setEndings(!1,!1,a);this._loopCount=s,this.time=i,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:o})}}else this.time=i;if(a&&(s&1)==1)return t-i}return i}_setEndings(e,t,n){const i=this._interpolantSettings;n?(i.endingStart=bi,i.endingEnd=bi):(e?i.endingStart=this.zeroSlopeAtStart?bi:wi:i.endingStart=fs,t?i.endingEnd=this.zeroSlopeAtEnd?bi:wi:i.endingEnd=fs)}_scheduleFading(e,t,n){const i=this._mixer,s=i.time;let a=this._weightInterpolant;a===null&&(a=i._lendControlInterpolant(),this._weightInterpolant=a);const o=a.parameterPositions,l=a.sampleValues;return o[0]=s,l[0]=t,o[1]=s+e,l[1]=n,this}}class $_ extends Tn{constructor(e){super();this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1}_bindAction(e,t){const n=e._localRoot||this._root,i=e._clip.tracks,s=i.length,a=e._propertyBindings,o=e._interpolants,l=n.uuid,c=this._bindingsByRootAndName;let h=c[l];h===void 0&&(h={},c[l]=h);for(let u=0;u!==s;++u){const d=i[u],f=d.name;let g=h[f];if(g!==void 0)a[u]=g;else{if(g=a[u],g!==void 0){g._cacheIndex===null&&(++g.referenceCount,this._addInactiveBinding(g,l,f));continue}const v=t&&t._propertyBindings[u].binding.parsedPath;g=new V_(Ke.create(n,f,v),d.ValueTypeName,d.getValueSize()),++g.referenceCount,this._addInactiveBinding(g,l,f),a[u]=g}o[u].resultBuffer=g.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){const n=(e._localRoot||this._root).uuid,i=e._clip.uuid,s=this._actionsByClip[i];this._bindAction(e,s&&s.knownActions[0]),this._addInactiveAction(e,i,n)}const t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){const s=t[n];s.useCount++==0&&(this._lendBinding(s),s.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){const t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){const s=t[n];--s.useCount==0&&(s.restoreOriginalState(),this._takeBackBinding(s))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;const e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){const t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,n){const i=this._actions,s=this._actionsByClip;let a=s[t];if(a===void 0)a={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,s[t]=a;else{const o=a.knownActions;e._byClipCacheIndex=o.length,o.push(e)}e._cacheIndex=i.length,i.push(e),a.actionByRoot[n]=e}_removeInactiveAction(e){const t=this._actions,n=t[t.length-1],i=e._cacheIndex;n._cacheIndex=i,t[i]=n,t.pop(),e._cacheIndex=null;const s=e._clip.uuid,a=this._actionsByClip,o=a[s],l=o.knownActions,c=l[l.length-1],h=e._byClipCacheIndex;c._byClipCacheIndex=h,l[h]=c,l.pop(),e._byClipCacheIndex=null;const u=o.actionByRoot,d=(e._localRoot||this._root).uuid;delete u[d],l.length===0&&delete a[s],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){const t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){const s=t[n];--s.referenceCount==0&&this._removeInactiveBinding(s)}}_lendAction(e){const t=this._actions,n=e._cacheIndex,i=this._nActiveActions++,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_takeBackAction(e){const t=this._actions,n=e._cacheIndex,i=--this._nActiveActions,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_addInactiveBinding(e,t,n){const i=this._bindingsByRootAndName,s=this._bindings;let a=i[t];a===void 0&&(a={},i[t]=a),a[n]=e,e._cacheIndex=s.length,s.push(e)}_removeInactiveBinding(e){const t=this._bindings,n=e.binding,i=n.rootNode.uuid,s=n.path,a=this._bindingsByRootAndName,o=a[i],l=t[t.length-1],c=e._cacheIndex;l._cacheIndex=c,t[c]=l,t.pop(),delete o[s],Object.keys(o).length===0&&delete a[i]}_lendBinding(e){const t=this._bindings,n=e._cacheIndex,i=this._nActiveBindings++,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_takeBackBinding(e){const t=this._bindings,n=e._cacheIndex,i=--this._nActiveBindings,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_lendControlInterpolant(){const e=this._controlInterpolants,t=this._nActiveControlInterpolants++;let n=e[t];return n===void 0&&(n=new Xh(new Float32Array(2),new Float32Array(2),1,this._controlInterpolantsResultBuffer),n.__cacheIndex=t,e[t]=n),n}_takeBackControlInterpolant(e){const t=this._controlInterpolants,n=e.__cacheIndex,i=--this._nActiveControlInterpolants,s=t[i];e.__cacheIndex=i,t[i]=e,s.__cacheIndex=n,t[n]=s}clipAction(e,t,n){const i=t||this._root,s=i.uuid;let a=typeof e=="string"?Yh.findByName(i,e):e;const o=a!==null?a.uuid:e,l=this._actionsByClip[o];let c=null;if(n===void 0&&(a!==null?n=a.blendMode:n=Va),l!==void 0){const u=l.actionByRoot[s];if(u!==void 0&&u.blendMode===n)return u;c=l.knownActions[0],a===null&&(a=c._clip)}if(a===null)return null;const h=new J_(this,a,t,n);return this._bindAction(h,c),this._addInactiveAction(h,o,s),h}existingAction(e,t){const n=t||this._root,i=n.uuid,s=typeof e=="string"?Yh.findByName(n,e):e,a=s?s.uuid:e,o=this._actionsByClip[a];return o!==void 0&&o.actionByRoot[i]||null}stopAllAction(){const e=this._actions,t=this._nActiveActions;for(let n=t-1;n>=0;--n)e[n].stop();return this}update(e){e*=this.timeScale;const t=this._actions,n=this._nActiveActions,i=this.time+=e,s=Math.sign(e),a=this._accuIndex^=1;for(let c=0;c!==n;++c)t[c]._update(i,e,s,a);const o=this._bindings,l=this._nActiveBindings;for(let c=0;c!==l;++c)o[c].apply(a);return this}setTime(e){this.time=0;for(let t=0;t<this._actions.length;t++)this._actions[t].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){const t=this._actions,n=e.uuid,i=this._actionsByClip,s=i[n];if(s!==void 0){const a=s.knownActions;for(let o=0,l=a.length;o!==l;++o){const c=a[o];this._deactivateAction(c);const h=c._cacheIndex,u=t[t.length-1];c._cacheIndex=null,c._byClipCacheIndex=null,u._cacheIndex=h,t[h]=u,t.pop(),this._removeInactiveBindingsForAction(c)}delete i[n]}}uncacheRoot(e){const t=e.uuid,n=this._actionsByClip;for(const a in n){const o=n[a].actionByRoot,l=o[t];l!==void 0&&(this._deactivateAction(l),this._removeInactiveAction(l))}const i=this._bindingsByRootAndName,s=i[t];if(s!==void 0)for(const a in s){const o=s[a];o.restoreOriginalState(),this._removeInactiveBinding(o)}}uncacheAction(e,t){const n=this.existingAction(e,t);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}}$_.prototype._controlInterpolantsResultBuffer=new Float32Array(1);class Gt{constructor(e){typeof e=="string"&&(console.warn("THREE.Uniform: Type parameter is no longer needed."),e=arguments[1]),this.value=e}clone(){return new Gt(this.value.clone===void 0?this.value:this.value.clone())}}class Q_ extends Pr{constructor(e,t,n=1){super(e,t);this.meshPerAttribute=n}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}clone(e){const t=super.clone(e);return t.meshPerAttribute=this.meshPerAttribute,t}toJSON(e){const t=super.toJSON(e);return t.isInstancedInterleavedBuffer=!0,t.meshPerAttribute=this.meshPerAttribute,t}}Q_.prototype.isInstancedInterleavedBuffer=!0;class vM{constructor(e,t,n=0,i=1/0){this.ray=new li(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new mc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t&&t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t&&t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}intersectObject(e,t=!0,n=[]){return Jo(e,this,n,t),n.sort(ru),n}intersectObjects(e,t=!0,n=[]){for(let i=0,s=e.length;i<s;i++)Jo(e[i],this,n,t);return n.sort(ru),n}}function ru(r,e){return r.distance-e.distance}function Jo(r,e,t,n){if(r.layers.test(e.layers)&&r.raycast(e,t),n===!0){const i=r.children;for(let s=0,a=i.length;s<a;s++)Jo(i[s],e,t,!0)}}class xM{constructor(e=1,t=0,n=0){return this.radius=e,this.phi=t,this.theta=n,this}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){const e=1e-6;return this.phi=Math.max(e,Math.min(Math.PI-e,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(Ot(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}const Jn=new C,aa=new Le,$o=new Le;class K_ extends Do{constructor(e){const t=su(e),n=new st,i=[],s=[],a=new be(0,0,1),o=new be(0,1,0);for(let c=0;c<t.length;c++){const h=t[c];h.parent&&h.parent.isBone&&(i.push(0,0,0),i.push(0,0,0),s.push(a.r,a.g,a.b),s.push(o.r,o.g,o.b))}n.setAttribute("position",new yt(i,3)),n.setAttribute("color",new yt(s,3));const l=new Br({vertexColors:!0,depthTest:!1,depthWrite:!1,toneMapped:!1,transparent:!0});super(n,l);this.type="SkeletonHelper",this.isSkeletonHelper=!0,this.root=e,this.bones=t,this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1}updateMatrixWorld(e){const t=this.bones,n=this.geometry,i=n.getAttribute("position");$o.copy(this.root.matrixWorld).invert();for(let s=0,a=0;s<t.length;s++){const o=t[s];o.parent&&o.parent.isBone&&(aa.multiplyMatrices($o,o.matrixWorld),Jn.setFromMatrixPosition(aa),i.setXYZ(a,Jn.x,Jn.y,Jn.z),aa.multiplyMatrices($o,o.parent.matrixWorld),Jn.setFromMatrixPosition(aa),i.setXYZ(a+1,Jn.x,Jn.y,Jn.z),a+=2)}n.getAttribute("position").needsUpdate=!0,super.updateMatrixWorld(e)}}function su(r){const e=[];r&&r.isBone&&e.push(r);for(let t=0;t<r.children.length;t++)e.push.apply(e,su(r.children[t]));return e}class e0 extends Do{constructor(e=10,t=10,n=4473924,i=8947848){n=new be(n),i=new be(i);const s=t/2,a=e/t,o=e/2,l=[],c=[];for(let d=0,f=0,g=-o;d<=t;d++,g+=a){l.push(-o,0,g,o,0,g),l.push(g,0,-o,g,0,o);const v=d===s?n:i;v.toArray(c,f),f+=3,v.toArray(c,f),f+=3,v.toArray(c,f),f+=3,v.toArray(c,f),f+=3}const h=new st;h.setAttribute("position",new yt(l,3)),h.setAttribute("color",new yt(c,3));const u=new Br({vertexColors:!0,toneMapped:!1});super(h,u);this.type="GridHelper"}}const t0=new Float32Array(1);new Int32Array(t0.buffer);Qt.create=function(r,e){return console.log("THREE.Curve.create() has been deprecated"),r.prototype=Object.create(Qt.prototype),r.prototype.constructor=r,r.prototype.getPoint=e,r};ko.prototype.fromPoints=function(r){return console.warn("THREE.Path: .fromPoints() has been renamed to .setFromPoints()."),this.setFromPoints(r)};e0.prototype.setColors=function(){console.error("THREE.GridHelper: setColors() has been deprecated, pass them in the constructor instead.")};K_.prototype.update=function(){console.error("THREE.SkeletonHelper: update() no longer needs to be called.")};jn.prototype.extractUrlBase=function(r){return console.warn("THREE.Loader: .extractUrlBase() has been deprecated. Use THREE.LoaderUtils.extractUrlBase() instead."),D_.extractUrlBase(r)};jn.Handlers={add:function(){console.error("THREE.Loader: Handlers.add() has been removed. Use LoadingManager.addHandler() instead.")},get:function(){console.error("THREE.Loader: Handlers.get() has been removed. Use LoadingManager.getHandler() instead.")}};sn.prototype.center=function(r){return console.warn("THREE.Box3: .center() has been renamed to .getCenter()."),this.getCenter(r)};sn.prototype.empty=function(){return console.warn("THREE.Box3: .empty() has been renamed to .isEmpty()."),this.isEmpty()};sn.prototype.isIntersectionBox=function(r){return console.warn("THREE.Box3: .isIntersectionBox() has been renamed to .intersectsBox()."),this.intersectsBox(r)};sn.prototype.isIntersectionSphere=function(r){return console.warn("THREE.Box3: .isIntersectionSphere() has been renamed to .intersectsSphere()."),this.intersectsSphere(r)};sn.prototype.size=function(r){return console.warn("THREE.Box3: .size() has been renamed to .getSize()."),this.getSize(r)};Ri.prototype.empty=function(){return console.warn("THREE.Sphere: .empty() has been renamed to .isEmpty()."),this.isEmpty()};Bs.prototype.setFromMatrix=function(r){return console.warn("THREE.Frustum: .setFromMatrix() has been renamed to .setFromProjectionMatrix()."),this.setFromProjectionMatrix(r)};Tt.prototype.flattenToArrayOffset=function(r,e){return console.warn("THREE.Matrix3: .flattenToArrayOffset() has been deprecated. Use .toArray() instead."),this.toArray(r,e)};Tt.prototype.multiplyVector3=function(r){return console.warn("THREE.Matrix3: .multiplyVector3() has been removed. Use vector.applyMatrix3( matrix ) instead."),r.applyMatrix3(this)};Tt.prototype.multiplyVector3Array=function(){console.error("THREE.Matrix3: .multiplyVector3Array() has been removed.")};Tt.prototype.applyToBufferAttribute=function(r){return console.warn("THREE.Matrix3: .applyToBufferAttribute() has been removed. Use attribute.applyMatrix3( matrix ) instead."),r.applyMatrix3(this)};Tt.prototype.applyToVector3Array=function(){console.error("THREE.Matrix3: .applyToVector3Array() has been removed.")};Tt.prototype.getInverse=function(r){return console.warn("THREE.Matrix3: .getInverse() has been removed. Use matrixInv.copy( matrix ).invert(); instead."),this.copy(r).invert()};Le.prototype.extractPosition=function(r){return console.warn("THREE.Matrix4: .extractPosition() has been renamed to .copyPosition()."),this.copyPosition(r)};Le.prototype.flattenToArrayOffset=function(r,e){return console.warn("THREE.Matrix4: .flattenToArrayOffset() has been deprecated. Use .toArray() instead."),this.toArray(r,e)};Le.prototype.getPosition=function(){return console.warn("THREE.Matrix4: .getPosition() has been removed. Use Vector3.setFromMatrixPosition( matrix ) instead."),new C().setFromMatrixColumn(this,3)};Le.prototype.setRotationFromQuaternion=function(r){return console.warn("THREE.Matrix4: .setRotationFromQuaternion() has been renamed to .makeRotationFromQuaternion()."),this.makeRotationFromQuaternion(r)};Le.prototype.multiplyToArray=function(){console.warn("THREE.Matrix4: .multiplyToArray() has been removed.")};Le.prototype.multiplyVector3=function(r){return console.warn("THREE.Matrix4: .multiplyVector3() has been removed. Use vector.applyMatrix4( matrix ) instead."),r.applyMatrix4(this)};Le.prototype.multiplyVector4=function(r){return console.warn("THREE.Matrix4: .multiplyVector4() has been removed. Use vector.applyMatrix4( matrix ) instead."),r.applyMatrix4(this)};Le.prototype.multiplyVector3Array=function(){console.error("THREE.Matrix4: .multiplyVector3Array() has been removed.")};Le.prototype.rotateAxis=function(r){console.warn("THREE.Matrix4: .rotateAxis() has been removed. Use Vector3.transformDirection( matrix ) instead."),r.transformDirection(this)};Le.prototype.crossVector=function(r){return console.warn("THREE.Matrix4: .crossVector() has been removed. Use vector.applyMatrix4( matrix ) instead."),r.applyMatrix4(this)};Le.prototype.translate=function(){console.error("THREE.Matrix4: .translate() has been removed.")};Le.prototype.rotateX=function(){console.error("THREE.Matrix4: .rotateX() has been removed.")};Le.prototype.rotateY=function(){console.error("THREE.Matrix4: .rotateY() has been removed.")};Le.prototype.rotateZ=function(){console.error("THREE.Matrix4: .rotateZ() has been removed.")};Le.prototype.rotateByAxis=function(){console.error("THREE.Matrix4: .rotateByAxis() has been removed.")};Le.prototype.applyToBufferAttribute=function(r){return console.warn("THREE.Matrix4: .applyToBufferAttribute() has been removed. Use attribute.applyMatrix4( matrix ) instead."),r.applyMatrix4(this)};Le.prototype.applyToVector3Array=function(){console.error("THREE.Matrix4: .applyToVector3Array() has been removed.")};Le.prototype.makeFrustum=function(r,e,t,n,i,s){return console.warn("THREE.Matrix4: .makeFrustum() has been removed. Use .makePerspective( left, right, top, bottom, near, far ) instead."),this.makePerspective(r,e,n,t,i,s)};Le.prototype.getInverse=function(r){return console.warn("THREE.Matrix4: .getInverse() has been removed. Use matrixInv.copy( matrix ).invert(); instead."),this.copy(r).invert()};Pn.prototype.isIntersectionLine=function(r){return console.warn("THREE.Plane: .isIntersectionLine() has been renamed to .intersectsLine()."),this.intersectsLine(r)};Ht.prototype.multiplyVector3=function(r){return console.warn("THREE.Quaternion: .multiplyVector3() has been removed. Use is now vector.applyQuaternion( quaternion ) instead."),r.applyQuaternion(this)};Ht.prototype.inverse=function(){return console.warn("THREE.Quaternion: .inverse() has been renamed to invert()."),this.invert()};li.prototype.isIntersectionBox=function(r){return console.warn("THREE.Ray: .isIntersectionBox() has been renamed to .intersectsBox()."),this.intersectsBox(r)};li.prototype.isIntersectionPlane=function(r){return console.warn("THREE.Ray: .isIntersectionPlane() has been renamed to .intersectsPlane()."),this.intersectsPlane(r)};li.prototype.isIntersectionSphere=function(r){return console.warn("THREE.Ray: .isIntersectionSphere() has been renamed to .intersectsSphere()."),this.intersectsSphere(r)};vt.prototype.area=function(){return console.warn("THREE.Triangle: .area() has been renamed to .getArea()."),this.getArea()};vt.prototype.barycoordFromPoint=function(r,e){return console.warn("THREE.Triangle: .barycoordFromPoint() has been renamed to .getBarycoord()."),this.getBarycoord(r,e)};vt.prototype.midpoint=function(r){return console.warn("THREE.Triangle: .midpoint() has been renamed to .getMidpoint()."),this.getMidpoint(r)};vt.prototypenormal=function(r){return console.warn("THREE.Triangle: .normal() has been renamed to .getNormal()."),this.getNormal(r)};vt.prototype.plane=function(r){return console.warn("THREE.Triangle: .plane() has been renamed to .getPlane()."),this.getPlane(r)};vt.barycoordFromPoint=function(r,e,t,n,i){return console.warn("THREE.Triangle: .barycoordFromPoint() has been renamed to .getBarycoord()."),vt.getBarycoord(r,e,t,n,i)};vt.normal=function(r,e,t,n){return console.warn("THREE.Triangle: .normal() has been renamed to .getNormal()."),vt.getNormal(r,e,t,n)};Vr.prototype.extractAllPoints=function(r){return console.warn("THREE.Shape: .extractAllPoints() has been removed. Use .extractPoints() instead."),this.extractPoints(r)};Vr.prototype.extrude=function(r){return console.warn("THREE.Shape: .extrude() has been removed. Use ExtrudeGeometry() instead."),new Ki(this,r)};Vr.prototype.makeGeometry=function(r){return console.warn("THREE.Shape: .makeGeometry() has been removed. Use ShapeGeometry() instead."),new Wo(this,r)};ee.prototype.fromAttribute=function(r,e,t){return console.warn("THREE.Vector2: .fromAttribute() has been renamed to .fromBufferAttribute()."),this.fromBufferAttribute(r,e,t)};ee.prototype.distanceToManhattan=function(r){return console.warn("THREE.Vector2: .distanceToManhattan() has been renamed to .manhattanDistanceTo()."),this.manhattanDistanceTo(r)};ee.prototype.lengthManhattan=function(){return console.warn("THREE.Vector2: .lengthManhattan() has been renamed to .manhattanLength()."),this.manhattanLength()};C.prototype.setEulerFromRotationMatrix=function(){console.error("THREE.Vector3: .setEulerFromRotationMatrix() has been removed. Use Euler.setFromRotationMatrix() instead.")};C.prototype.setEulerFromQuaternion=function(){console.error("THREE.Vector3: .setEulerFromQuaternion() has been removed. Use Euler.setFromQuaternion() instead.")};C.prototype.getPositionFromMatrix=function(r){return console.warn("THREE.Vector3: .getPositionFromMatrix() has been renamed to .setFromMatrixPosition()."),this.setFromMatrixPosition(r)};C.prototype.getScaleFromMatrix=function(r){return console.warn("THREE.Vector3: .getScaleFromMatrix() has been renamed to .setFromMatrixScale()."),this.setFromMatrixScale(r)};C.prototype.getColumnFromMatrix=function(r,e){return console.warn("THREE.Vector3: .getColumnFromMatrix() has been renamed to .setFromMatrixColumn()."),this.setFromMatrixColumn(e,r)};C.prototype.applyProjection=function(r){return console.warn("THREE.Vector3: .applyProjection() has been removed. Use .applyMatrix4( m ) instead."),this.applyMatrix4(r)};C.prototype.fromAttribute=function(r,e,t){return console.warn("THREE.Vector3: .fromAttribute() has been renamed to .fromBufferAttribute()."),this.fromBufferAttribute(r,e,t)};C.prototype.distanceToManhattan=function(r){return console.warn("THREE.Vector3: .distanceToManhattan() has been renamed to .manhattanDistanceTo()."),this.manhattanDistanceTo(r)};C.prototype.lengthManhattan=function(){return console.warn("THREE.Vector3: .lengthManhattan() has been renamed to .manhattanLength()."),this.manhattanLength()};it.prototype.fromAttribute=function(r,e,t){return console.warn("THREE.Vector4: .fromAttribute() has been renamed to .fromBufferAttribute()."),this.fromBufferAttribute(r,e,t)};it.prototype.lengthManhattan=function(){return console.warn("THREE.Vector4: .lengthManhattan() has been renamed to .manhattanLength()."),this.manhattanLength()};$e.prototype.getChildByName=function(r){return console.warn("THREE.Object3D: .getChildByName() has been renamed to .getObjectByName()."),this.getObjectByName(r)};$e.prototype.renderDepth=function(){console.warn("THREE.Object3D: .renderDepth has been removed. Use .renderOrder, instead.")};$e.prototype.translate=function(r,e){return console.warn("THREE.Object3D: .translate() has been removed. Use .translateOnAxis( axis, distance ) instead."),this.translateOnAxis(e,r)};$e.prototype.getWorldRotation=function(){console.error("THREE.Object3D: .getWorldRotation() has been removed. Use THREE.Object3D.getWorldQuaternion( target ) instead.")};$e.prototype.applyMatrix=function(r){return console.warn("THREE.Object3D: .applyMatrix() has been renamed to .applyMatrix4()."),this.applyMatrix4(r)};Object.defineProperties($e.prototype,{eulerOrder:{get:function(){return console.warn("THREE.Object3D: .eulerOrder is now .rotation.order."),this.rotation.order},set:function(r){console.warn("THREE.Object3D: .eulerOrder is now .rotation.order."),this.rotation.order=r}},useQuaternion:{get:function(){console.warn("THREE.Object3D: .useQuaternion has been removed. The library now uses quaternions by default.")},set:function(){console.warn("THREE.Object3D: .useQuaternion has been removed. The library now uses quaternions by default.")}}});Rt.prototype.setDrawMode=function(){console.error("THREE.Mesh: .setDrawMode() has been removed. The renderer now always assumes THREE.TrianglesDrawMode. Transform your geometry via BufferGeometryUtils.toTrianglesDrawMode() if necessary.")};Object.defineProperties(Rt.prototype,{drawMode:{get:function(){return console.error("THREE.Mesh: .drawMode has been removed. The renderer now always assumes THREE.TrianglesDrawMode."),Tf},set:function(){console.error("THREE.Mesh: .drawMode has been removed. The renderer now always assumes THREE.TrianglesDrawMode. Transform your geometry via BufferGeometryUtils.toTrianglesDrawMode() if necessary.")}}});Mh.prototype.initBones=function(){console.error("THREE.SkinnedMesh: initBones() has been removed.")};Bt.prototype.setLens=function(r,e){console.warn("THREE.PerspectiveCamera.setLens is deprecated. Use .setFocalLength and .filmGauge for a photographic setup."),e!==void 0&&(this.filmGauge=e),this.setFocalLength(r)};Object.defineProperties(yn.prototype,{onlyShadow:{set:function(){console.warn("THREE.Light: .onlyShadow has been removed.")}},shadowCameraFov:{set:function(r){console.warn("THREE.Light: .shadowCameraFov is now .shadow.camera.fov."),this.shadow.camera.fov=r}},shadowCameraLeft:{set:function(r){console.warn("THREE.Light: .shadowCameraLeft is now .shadow.camera.left."),this.shadow.camera.left=r}},shadowCameraRight:{set:function(r){console.warn("THREE.Light: .shadowCameraRight is now .shadow.camera.right."),this.shadow.camera.right=r}},shadowCameraTop:{set:function(r){console.warn("THREE.Light: .shadowCameraTop is now .shadow.camera.top."),this.shadow.camera.top=r}},shadowCameraBottom:{set:function(r){console.warn("THREE.Light: .shadowCameraBottom is now .shadow.camera.bottom."),this.shadow.camera.bottom=r}},shadowCameraNear:{set:function(r){console.warn("THREE.Light: .shadowCameraNear is now .shadow.camera.near."),this.shadow.camera.near=r}},shadowCameraFar:{set:function(r){console.warn("THREE.Light: .shadowCameraFar is now .shadow.camera.far."),this.shadow.camera.far=r}},shadowCameraVisible:{set:function(){console.warn("THREE.Light: .shadowCameraVisible has been removed. Use new THREE.CameraHelper( light.shadow.camera ) instead.")}},shadowBias:{set:function(r){console.warn("THREE.Light: .shadowBias is now .shadow.bias."),this.shadow.bias=r}},shadowDarkness:{set:function(){console.warn("THREE.Light: .shadowDarkness has been removed.")}},shadowMapWidth:{set:function(r){console.warn("THREE.Light: .shadowMapWidth is now .shadow.mapSize.width."),this.shadow.mapSize.width=r}},shadowMapHeight:{set:function(r){console.warn("THREE.Light: .shadowMapHeight is now .shadow.mapSize.height."),this.shadow.mapSize.height=r}}});Object.defineProperties(ut.prototype,{length:{get:function(){return console.warn("THREE.BufferAttribute: .length has been deprecated. Use .count instead."),this.array.length}},dynamic:{get:function(){return console.warn("THREE.BufferAttribute: .dynamic has been deprecated. Use .usage instead."),this.usage===ms},set:function(){console.warn("THREE.BufferAttribute: .dynamic has been deprecated. Use .usage instead."),this.setUsage(ms)}}});ut.prototype.setDynamic=function(r){return console.warn("THREE.BufferAttribute: .setDynamic() has been deprecated. Use .setUsage() instead."),this.setUsage(r===!0?ms:_r),this};ut.prototype.copyIndicesArray=function(){console.error("THREE.BufferAttribute: .copyIndicesArray() has been removed.")},ut.prototype.setArray=function(){console.error("THREE.BufferAttribute: .setArray has been removed. Use BufferGeometry .setAttribute to replace/resize attribute buffers")};st.prototype.addIndex=function(r){console.warn("THREE.BufferGeometry: .addIndex() has been renamed to .setIndex()."),this.setIndex(r)};st.prototype.addAttribute=function(r,e){return console.warn("THREE.BufferGeometry: .addAttribute() has been renamed to .setAttribute()."),!(e&&e.isBufferAttribute)&&!(e&&e.isInterleavedBufferAttribute)?(console.warn("THREE.BufferGeometry: .addAttribute() now expects ( name, attribute )."),this.setAttribute(r,new ut(arguments[1],arguments[2]))):r==="index"?(console.warn("THREE.BufferGeometry.addAttribute: Use .setIndex() for index attribute."),this.setIndex(e),this):this.setAttribute(r,e)};st.prototype.addDrawCall=function(r,e,t){t!==void 0&&console.warn("THREE.BufferGeometry: .addDrawCall() no longer supports indexOffset."),console.warn("THREE.BufferGeometry: .addDrawCall() is now .addGroup()."),this.addGroup(r,e)};st.prototype.clearDrawCalls=function(){console.warn("THREE.BufferGeometry: .clearDrawCalls() is now .clearGroups()."),this.clearGroups()};st.prototype.computeOffsets=function(){console.warn("THREE.BufferGeometry: .computeOffsets() has been removed.")};st.prototype.removeAttribute=function(r){return console.warn("THREE.BufferGeometry: .removeAttribute() has been renamed to .deleteAttribute()."),this.deleteAttribute(r)};st.prototype.applyMatrix=function(r){return console.warn("THREE.BufferGeometry: .applyMatrix() has been renamed to .applyMatrix4()."),this.applyMatrix4(r)};Object.defineProperties(st.prototype,{drawcalls:{get:function(){return console.error("THREE.BufferGeometry: .drawcalls has been renamed to .groups."),this.groups}},offsets:{get:function(){return console.warn("THREE.BufferGeometry: .offsets has been renamed to .groups."),this.groups}}});Pr.prototype.setDynamic=function(r){return console.warn("THREE.InterleavedBuffer: .setDynamic() has been deprecated. Use .setUsage() instead."),this.setUsage(r===!0?ms:_r),this};Pr.prototype.setArray=function(){console.error("THREE.InterleavedBuffer: .setArray has been removed. Use BufferGeometry .setAttribute to replace/resize attribute buffers")};Ki.prototype.getArrays=function(){console.error("THREE.ExtrudeGeometry: .getArrays() has been removed.")};Ki.prototype.addShapeList=function(){console.error("THREE.ExtrudeGeometry: .addShapeList() has been removed.")};Ki.prototype.addShape=function(){console.error("THREE.ExtrudeGeometry: .addShape() has been removed.")};Yi.prototype.dispose=function(){console.error("THREE.Scene: .dispose() has been removed.")};Gt.prototype.onUpdate=function(){return console.warn("THREE.Uniform: .onUpdate() has been removed. Use object.onBeforeRender() instead."),this};Object.defineProperties(Lt.prototype,{wrapAround:{get:function(){console.warn("THREE.Material: .wrapAround has been removed.")},set:function(){console.warn("THREE.Material: .wrapAround has been removed.")}},overdraw:{get:function(){console.warn("THREE.Material: .overdraw has been removed.")},set:function(){console.warn("THREE.Material: .overdraw has been removed.")}},wrapRGB:{get:function(){return console.warn("THREE.Material: .wrapRGB has been removed."),new be}},shading:{get:function(){console.error("THREE."+this.type+": .shading has been removed. Use the boolean .flatShading instead.")},set:function(r){console.warn("THREE."+this.type+": .shading has been removed. Use the boolean .flatShading instead."),this.flatShading=r===Nl}},stencilMask:{get:function(){return console.warn("THREE."+this.type+": .stencilMask has been removed. Use .stencilFuncMask instead."),this.stencilFuncMask},set:function(r){console.warn("THREE."+this.type+": .stencilMask has been removed. Use .stencilFuncMask instead."),this.stencilFuncMask=r}},vertexTangents:{get:function(){console.warn("THREE."+this.type+": .vertexTangents has been removed.")},set:function(){console.warn("THREE."+this.type+": .vertexTangents has been removed.")}}});Object.defineProperties(gn.prototype,{derivatives:{get:function(){return console.warn("THREE.ShaderMaterial: .derivatives has been moved to .extensions.derivatives."),this.extensions.derivatives},set:function(r){console.warn("THREE. ShaderMaterial: .derivatives has been moved to .extensions.derivatives."),this.extensions.derivatives=r}}});tt.prototype.clearTarget=function(r,e,t,n){console.warn("THREE.WebGLRenderer: .clearTarget() has been deprecated. Use .setRenderTarget() and .clear() instead."),this.setRenderTarget(r),this.clear(e,t,n)};tt.prototype.animate=function(r){console.warn("THREE.WebGLRenderer: .animate() is now .setAnimationLoop()."),this.setAnimationLoop(r)};tt.prototype.getCurrentRenderTarget=function(){return console.warn("THREE.WebGLRenderer: .getCurrentRenderTarget() is now .getRenderTarget()."),this.getRenderTarget()};tt.prototype.getMaxAnisotropy=function(){return console.warn("THREE.WebGLRenderer: .getMaxAnisotropy() is now .capabilities.getMaxAnisotropy()."),this.capabilities.getMaxAnisotropy()};tt.prototype.getPrecision=function(){return console.warn("THREE.WebGLRenderer: .getPrecision() is now .capabilities.precision."),this.capabilities.precision};tt.prototype.resetGLState=function(){return console.warn("THREE.WebGLRenderer: .resetGLState() is now .state.reset()."),this.state.reset()};tt.prototype.supportsFloatTextures=function(){return console.warn("THREE.WebGLRenderer: .supportsFloatTextures() is now .extensions.get( 'OES_texture_float' )."),this.extensions.get("OES_texture_float")};tt.prototype.supportsHalfFloatTextures=function(){return console.warn("THREE.WebGLRenderer: .supportsHalfFloatTextures() is now .extensions.get( 'OES_texture_half_float' )."),this.extensions.get("OES_texture_half_float")};tt.prototype.supportsStandardDerivatives=function(){return console.warn("THREE.WebGLRenderer: .supportsStandardDerivatives() is now .extensions.get( 'OES_standard_derivatives' )."),this.extensions.get("OES_standard_derivatives")};tt.prototype.supportsCompressedTextureS3TC=function(){return console.warn("THREE.WebGLRenderer: .supportsCompressedTextureS3TC() is now .extensions.get( 'WEBGL_compressed_texture_s3tc' )."),this.extensions.get("WEBGL_compressed_texture_s3tc")};tt.prototype.supportsCompressedTexturePVRTC=function(){return console.warn("THREE.WebGLRenderer: .supportsCompressedTexturePVRTC() is now .extensions.get( 'WEBGL_compressed_texture_pvrtc' )."),this.extensions.get("WEBGL_compressed_texture_pvrtc")};tt.prototype.supportsBlendMinMax=function(){return console.warn("THREE.WebGLRenderer: .supportsBlendMinMax() is now .extensions.get( 'EXT_blend_minmax' )."),this.extensions.get("EXT_blend_minmax")};tt.prototype.supportsVertexTextures=function(){return console.warn("THREE.WebGLRenderer: .supportsVertexTextures() is now .capabilities.vertexTextures."),this.capabilities.vertexTextures};tt.prototype.supportsInstancedArrays=function(){return console.warn("THREE.WebGLRenderer: .supportsInstancedArrays() is now .extensions.get( 'ANGLE_instanced_arrays' )."),this.extensions.get("ANGLE_instanced_arrays")};tt.prototype.enableScissorTest=function(r){console.warn("THREE.WebGLRenderer: .enableScissorTest() is now .setScissorTest()."),this.setScissorTest(r)};tt.prototype.initMaterial=function(){console.warn("THREE.WebGLRenderer: .initMaterial() has been removed.")};tt.prototype.addPrePlugin=function(){console.warn("THREE.WebGLRenderer: .addPrePlugin() has been removed.")};tt.prototype.addPostPlugin=function(){console.warn("THREE.WebGLRenderer: .addPostPlugin() has been removed.")};tt.prototype.updateShadowMap=function(){console.warn("THREE.WebGLRenderer: .updateShadowMap() has been removed.")};tt.prototype.setFaceCulling=function(){console.warn("THREE.WebGLRenderer: .setFaceCulling() has been removed.")};tt.prototype.allocTextureUnit=function(){console.warn("THREE.WebGLRenderer: .allocTextureUnit() has been removed.")};tt.prototype.setTexture=function(){console.warn("THREE.WebGLRenderer: .setTexture() has been removed.")};tt.prototype.setTexture2D=function(){console.warn("THREE.WebGLRenderer: .setTexture2D() has been removed.")};tt.prototype.setTextureCube=function(){console.warn("THREE.WebGLRenderer: .setTextureCube() has been removed.")};tt.prototype.getActiveMipMapLevel=function(){return console.warn("THREE.WebGLRenderer: .getActiveMipMapLevel() is now .getActiveMipmapLevel()."),this.getActiveMipmapLevel()};Object.defineProperties(tt.prototype,{shadowMapEnabled:{get:function(){return this.shadowMap.enabled},set:function(r){console.warn("THREE.WebGLRenderer: .shadowMapEnabled is now .shadowMap.enabled."),this.shadowMap.enabled=r}},shadowMapType:{get:function(){return this.shadowMap.type},set:function(r){console.warn("THREE.WebGLRenderer: .shadowMapType is now .shadowMap.type."),this.shadowMap.type=r}},shadowMapCullFace:{get:function(){console.warn("THREE.WebGLRenderer: .shadowMapCullFace has been removed. Set Material.shadowSide instead.")},set:function(){console.warn("THREE.WebGLRenderer: .shadowMapCullFace has been removed. Set Material.shadowSide instead.")}},context:{get:function(){return console.warn("THREE.WebGLRenderer: .context has been removed. Use .getContext() instead."),this.getContext()}},vr:{get:function(){return console.warn("THREE.WebGLRenderer: .vr has been renamed to .xr"),this.xr}},gammaInput:{get:function(){return console.warn("THREE.WebGLRenderer: .gammaInput has been removed. Set the encoding for textures via Texture.encoding instead."),!1},set:function(){console.warn("THREE.WebGLRenderer: .gammaInput has been removed. Set the encoding for textures via Texture.encoding instead.")}},gammaOutput:{get:function(){return console.warn("THREE.WebGLRenderer: .gammaOutput has been removed. Set WebGLRenderer.outputEncoding instead."),!1},set:function(r){console.warn("THREE.WebGLRenderer: .gammaOutput has been removed. Set WebGLRenderer.outputEncoding instead."),this.outputEncoding=r===!0?ps:kt}},toneMappingWhitePoint:{get:function(){return console.warn("THREE.WebGLRenderer: .toneMappingWhitePoint has been removed."),1},set:function(){console.warn("THREE.WebGLRenderer: .toneMappingWhitePoint has been removed.")}}});Object.defineProperties(hh.prototype,{cullFace:{get:function(){console.warn("THREE.WebGLRenderer: .shadowMap.cullFace has been removed. Set Material.shadowSide instead.")},set:function(){console.warn("THREE.WebGLRenderer: .shadowMap.cullFace has been removed. Set Material.shadowSide instead.")}},renderReverseSided:{get:function(){console.warn("THREE.WebGLRenderer: .shadowMap.renderReverseSided has been removed. Set Material.shadowSide instead.")},set:function(){console.warn("THREE.WebGLRenderer: .shadowMap.renderReverseSided has been removed. Set Material.shadowSide instead.")}},renderSingleSided:{get:function(){console.warn("THREE.WebGLRenderer: .shadowMap.renderSingleSided has been removed. Set Material.shadowSide instead.")},set:function(){console.warn("THREE.WebGLRenderer: .shadowMap.renderSingleSided has been removed. Set Material.shadowSide instead.")}}});Object.defineProperties(Yt.prototype,{wrapS:{get:function(){return console.warn("THREE.WebGLRenderTarget: .wrapS is now .texture.wrapS."),this.texture.wrapS},set:function(r){console.warn("THREE.WebGLRenderTarget: .wrapS is now .texture.wrapS."),this.texture.wrapS=r}},wrapT:{get:function(){return console.warn("THREE.WebGLRenderTarget: .wrapT is now .texture.wrapT."),this.texture.wrapT},set:function(r){console.warn("THREE.WebGLRenderTarget: .wrapT is now .texture.wrapT."),this.texture.wrapT=r}},magFilter:{get:function(){return console.warn("THREE.WebGLRenderTarget: .magFilter is now .texture.magFilter."),this.texture.magFilter},set:function(r){console.warn("THREE.WebGLRenderTarget: .magFilter is now .texture.magFilter."),this.texture.magFilter=r}},minFilter:{get:function(){return console.warn("THREE.WebGLRenderTarget: .minFilter is now .texture.minFilter."),this.texture.minFilter},set:function(r){console.warn("THREE.WebGLRenderTarget: .minFilter is now .texture.minFilter."),this.texture.minFilter=r}},anisotropy:{get:function(){return console.warn("THREE.WebGLRenderTarget: .anisotropy is now .texture.anisotropy."),this.texture.anisotropy},set:function(r){console.warn("THREE.WebGLRenderTarget: .anisotropy is now .texture.anisotropy."),this.texture.anisotropy=r}},offset:{get:function(){return console.warn("THREE.WebGLRenderTarget: .offset is now .texture.offset."),this.texture.offset},set:function(r){console.warn("THREE.WebGLRenderTarget: .offset is now .texture.offset."),this.texture.offset=r}},repeat:{get:function(){return console.warn("THREE.WebGLRenderTarget: .repeat is now .texture.repeat."),this.texture.repeat},set:function(r){console.warn("THREE.WebGLRenderTarget: .repeat is now .texture.repeat."),this.texture.repeat=r}},format:{get:function(){return console.warn("THREE.WebGLRenderTarget: .format is now .texture.format."),this.texture.format},set:function(r){console.warn("THREE.WebGLRenderTarget: .format is now .texture.format."),this.texture.format=r}},type:{get:function(){return console.warn("THREE.WebGLRenderTarget: .type is now .texture.type."),this.texture.type},set:function(r){console.warn("THREE.WebGLRenderTarget: .type is now .texture.type."),this.texture.type=r}},generateMipmaps:{get:function(){return console.warn("THREE.WebGLRenderTarget: .generateMipmaps is now .texture.generateMipmaps."),this.texture.generateMipmaps},set:function(r){console.warn("THREE.WebGLRenderTarget: .generateMipmaps is now .texture.generateMipmaps."),this.texture.generateMipmaps=r}}});z_.prototype.load=function(r){console.warn("THREE.Audio: .load has been deprecated. Use THREE.AudioLoader instead.");const e=this;return new O_().load(r,function(n){e.setBuffer(n)}),this};go.prototype.updateCubeMap=function(r,e){return console.warn("THREE.CubeCamera: .updateCubeMap() is now .update()."),this.update(r,e)};go.prototype.clear=function(r,e,t,n){return console.warn("THREE.CubeCamera: .clear() is now .renderTarget.clear()."),this.renderTarget.clear(r,e,t,n)};Ei.crossOrigin=void 0;Ei.loadTexture=function(r,e,t,n){console.warn("THREE.ImageUtils.loadTexture has been deprecated. Use THREE.TextureLoader() instead.");const i=new T_;i.setCrossOrigin(this.crossOrigin);const s=i.load(r,t,void 0,n);return e&&(s.mapping=e),s};Ei.loadTextureCube=function(r,e,t,n){console.warn("THREE.ImageUtils.loadTextureCube has been deprecated. Use THREE.CubeTextureLoader() instead.");const i=new S_;i.setCrossOrigin(this.crossOrigin);const s=i.load(r,t,void 0,n);return e&&(s.mapping=e),s};Ei.loadCompressedTexture=function(){console.error("THREE.ImageUtils.loadCompressedTexture has been removed. Use THREE.DDSLoader instead.")};Ei.loadCompressedTextureCube=function(){console.error("THREE.ImageUtils.loadCompressedTextureCube has been removed. Use THREE.DDSLoader instead.")};typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Da}}));typeof window!="undefined"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Da);/**
 * postprocessing v6.23.3 build Mon Dec 06 2021
 * https://github.com/vanruesc/postprocessing
 * Copyright 2021 Raoul van Rüschen
 * @license Zlib
 */var n0="varying vec2 vUv;void main(){vUv=position.xy*0.5+0.5;gl_Position=vec4(position.xy,1.0,1.0);}",i0=`#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
uniform float opacity;varying vec2 vUv;void main(){vec4 texel=texture2D(inputBuffer,vUv);gl_FragColor=opacity*texel;
#include <encodings_fragment>
}`,r0=class extends gn{constructor(){super({type:"CopyMaterial",uniforms:{inputBuffer:new Gt(null),opacity:new Gt(1)},fragmentShader:i0,vertexShader:n0,blending:mn,depthWrite:!1,depthTest:!1});this.toneMapped=!1}},s0=`#include <common>
#include <packing>
#include <dithering_pars_fragment>
#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
#ifdef GL_FRAGMENT_PRECISION_HIGH
uniform highp sampler2D depthBuffer;
#else
uniform mediump sampler2D depthBuffer;
#endif
uniform vec2 resolution;uniform vec2 texelSize;uniform float cameraNear;uniform float cameraFar;uniform float aspect;uniform float time;varying vec2 vUv;float readDepth(const in vec2 uv){
#if DEPTH_PACKING == 3201
return unpackRGBAToDepth(texture2D(depthBuffer,uv));
#else
return texture2D(depthBuffer,uv).r;
#endif
}float getViewZ(const in float depth){
#ifdef PERSPECTIVE_CAMERA
return perspectiveDepthToViewZ(depth,cameraNear,cameraFar);
#else
return orthographicDepthToViewZ(depth,cameraNear,cameraFar);
#endif
}FRAGMENT_HEADvoid main(){FRAGMENT_MAIN_UVvec4 color0=texture2D(inputBuffer,UV);vec4 color1=vec4(0.0);FRAGMENT_MAIN_IMAGEgl_FragColor=color0;
#ifdef ENCODE_OUTPUT
#include <encodings_fragment>
#endif
#include <dithering_fragment>
}`,a0="uniform vec2 resolution;uniform vec2 texelSize;uniform float cameraNear;uniform float cameraFar;uniform float aspect;uniform float time;varying vec2 vUv;VERTEX_HEADvoid main(){vUv=position.xy*0.5+0.5;VERTEX_MAIN_SUPPORTgl_Position=vec4(position.xy,1.0,1.0);}",o0=class extends gn{constructor(r=null,e=null,t=null,n,i=!1){super({type:"EffectMaterial",defines:{DEPTH_PACKING:"0",ENCODE_OUTPUT:"1"},uniforms:{inputBuffer:new Gt(null),depthBuffer:new Gt(null),resolution:new Gt(new ee),texelSize:new Gt(new ee),cameraNear:new Gt(.3),cameraFar:new Gt(1e3),aspect:new Gt(1),time:new Gt(0)},blending:mn,depthWrite:!1,depthTest:!1,dithering:i});this.toneMapped=!1,r!==null&&this.setShaderParts(r),e!==null&&this.setDefines(e),t!==null&&this.setUniforms(t),this.adoptCameraSettings(n)}get depthPacking(){return Number(this.defines.DEPTH_PACKING)}set depthPacking(r){this.defines.DEPTH_PACKING=r.toFixed(0),this.needsUpdate=!0}setShaderParts(r){return this.fragmentShader=s0.replace(Ye.FRAGMENT_HEAD,r.get(Ye.FRAGMENT_HEAD)).replace(Ye.FRAGMENT_MAIN_UV,r.get(Ye.FRAGMENT_MAIN_UV)).replace(Ye.FRAGMENT_MAIN_IMAGE,r.get(Ye.FRAGMENT_MAIN_IMAGE)),this.vertexShader=a0.replace(Ye.VERTEX_HEAD,r.get(Ye.VERTEX_HEAD)).replace(Ye.VERTEX_MAIN_SUPPORT,r.get(Ye.VERTEX_MAIN_SUPPORT)),this.needsUpdate=!0,this}setDefines(r){for(const e of r.entries())this.defines[e[0]]=e[1];return this.needsUpdate=!0,this}setUniforms(r){for(const e of r.entries())this.uniforms[e[0]]=e[1];return this}adoptCameraSettings(r=null){r!==null&&(this.uniforms.cameraNear.value=r.near,this.uniforms.cameraFar.value=r.far,r instanceof Bt?this.defines.PERSPECTIVE_CAMERA="1":delete this.defines.PERSPECTIVE_CAMERA,this.needsUpdate=!0)}setSize(r,e){const t=Math.max(r,1),n=Math.max(e,1);this.uniforms.resolution.value.set(t,n),this.uniforms.texelSize.value.set(1/t,1/n),this.uniforms.aspect.value=t/n}},Ye={FRAGMENT_HEAD:"FRAGMENT_HEAD",FRAGMENT_MAIN_UV:"FRAGMENT_MAIN_UV",FRAGMENT_MAIN_IMAGE:"FRAGMENT_MAIN_IMAGE",VERTEX_HEAD:"VERTEX_HEAD",VERTEX_MAIN_SUPPORT:"VERTEX_MAIN_SUPPORT"},l0=new Fs,$n=null;function c0(){if($n===null){const r=new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),e=new Float32Array([0,0,2,0,0,2]);$n=new st,$n.setAttribute!==void 0?($n.setAttribute("position",new ut(r,3)),$n.setAttribute("uv",new ut(e,2))):($n.addAttribute("position",new ut(r,3)),$n.addAttribute("uv",new ut(e,2)))}return $n}var ir=class{constructor(r="Pass",e=new Yi,t=l0){this.name=r,this.scene=e,this.camera=t,this.screen=null,this.rtt=!0,this.needsSwap=!0,this.needsDepthTexture=!1,this.enabled=!0}get renderToScreen(){return!this.rtt}set renderToScreen(r){if(this.rtt===r){const e=this.getFullscreenMaterial();e!==null&&(e.needsUpdate=!0),this.rtt=!r}}isEnabled(){return this.enabled}setEnabled(r){this.enabled=r}getFullscreenMaterial(){return this.screen!==null?this.screen.material:null}setFullscreenMaterial(r){let e=this.screen;e!==null?e.material=r:(e=new Rt(c0(),r),e.frustumCulled=!1,this.scene===null&&(this.scene=new Yi),this.scene.add(e),this.screen=e)}getDepthTexture(){return null}setDepthTexture(r,e=0){}render(r,e,t,n,i){throw new Error("Render method not implemented!")}setSize(r,e){}initialize(r,e,t){}dispose(){const r=this.getFullscreenMaterial();r!==null&&r.dispose();for(const e of Object.keys(this)){const t=this[e];if(t!==null&&typeof t.dispose=="function"){if(t instanceof Yi)continue;this[e].dispose()}}}},h0=class extends ir{constructor(){super("ClearMaskPass",null,null);this.needsSwap=!1}render(r,e,t,n,i){const s=r.state.buffers.stencil;s.setLocked(!1),s.setTest(!1)}},Qo=new be,au=class extends ir{constructor(r=!0,e=!0,t=!1){super("ClearPass",null,null);this.needsSwap=!1,this.color=r,this.depth=e,this.stencil=t,this.overrideClearColor=null,this.overrideClearAlpha=-1}render(r,e,t,n,i){const s=this.overrideClearColor,a=this.overrideClearAlpha,o=r.getClearAlpha(),l=s!==null,c=a>=0;l?(Qo.copy(r.getClearColor(Qo)),r.setClearColor(s,c?a:o)):c&&r.setClearAlpha(a),r.setRenderTarget(this.renderToScreen?null:e),r.clear(this.color,this.depth,this.stencil),l?r.setClearColor(Qo,o):c&&r.setClearAlpha(o)}},Ko=!1,ou=class{constructor(r=null){this.originalMaterials=new Map,this.material=null,this.materials=null,this.materialsBackSide=null,this.materialsDoubleSide=null,this.materialsFlatShaded=null,this.materialsFlatShadedBackSide=null,this.materialsFlatShadedDoubleSide=null,this.setMaterial(r),this.meshCount=0,this.replaceMaterial=e=>{if(e.isMesh){let t;if(e.material.flatShading)switch(e.material.side){case pn:t=this.materialsFlatShadedDoubleSide;break;case lt:t=this.materialsFlatShadedBackSide;break;default:t=this.materialsFlatShaded;break}else switch(e.material.side){case pn:t=this.materialsDoubleSide;break;case lt:t=this.materialsBackSide;break;default:t=this.materials;break}this.originalMaterials.set(e,e.material),e.isSkinnedMesh?e.material=t[2]:e.isInstancedMesh?e.material=t[1]:e.material=t[0],++this.meshCount}}}setMaterial(r){if(this.disposeMaterials(),this.material=r,r!==null){const e=this.materials=[r.clone(),r.clone(),r.clone()];for(const t of e)t.uniforms=Object.assign({},r.uniforms),t.side=_i;e[2].skinning=!0,this.materialsBackSide=e.map(t=>{const n=t.clone();return n.uniforms=Object.assign({},r.uniforms),n.side=lt,n}),this.materialsDoubleSide=e.map(t=>{const n=t.clone();return n.uniforms=Object.assign({},r.uniforms),n.side=pn,n}),this.materialsFlatShaded=e.map(t=>{const n=t.clone();return n.uniforms=Object.assign({},r.uniforms),n.flatShading=!0,n}),this.materialsFlatShadedBackSide=e.map(t=>{const n=t.clone();return n.uniforms=Object.assign({},r.uniforms),n.flatShading=!0,n.side=lt,n}),this.materialsFlatShadedDoubleSide=e.map(t=>{const n=t.clone();return n.uniforms=Object.assign({},r.uniforms),n.flatShading=!0,n.side=pn,n})}}render(r,e,t){const n=r.shadowMap.enabled;if(r.shadowMap.enabled=!1,Ko){const i=this.originalMaterials;this.meshCount=0,e.traverse(this.replaceMaterial),r.render(e,t);for(const s of i)s[0].material=s[1];this.meshCount!==i.size&&i.clear()}else{const i=e.overrideMaterial;e.overrideMaterial=this.material,r.render(e,t),e.overrideMaterial=i}r.shadowMap.enabled=n}disposeMaterials(){if(this.material!==null){const r=this.materials.concat(this.materialsBackSide).concat(this.materialsDoubleSide).concat(this.materialsFlatShaded).concat(this.materialsFlatShadedBackSide).concat(this.materialsFlatShadedDoubleSide);for(const e of r)e.dispose()}}dispose(){this.originalMaterials.clear(),this.disposeMaterials()}static get workaroundEnabled(){return Ko}static set workaroundEnabled(r){Ko=r}},_M=class extends ir{constructor(r,e,t=null){super("RenderPass",r,e);this.needsSwap=!1,this.clearPass=new au,this.overrideMaterialManager=t===null?null:new ou(t),this.backgroundDisabled=!1,this.shadowMapDisabled=!1,this.selection=null}get renderToScreen(){return super.renderToScreen}set renderToScreen(r){super.renderToScreen=r,this.clearPass.renderToScreen=r}get overrideMaterial(){const r=this.overrideMaterialManager;return r!==null?r.material:null}set overrideMaterial(r){const e=this.overrideMaterialManager;r!==null?e!==null?e.setMaterial(r):this.overrideMaterialManager=new ou(r):e!==null&&(e.dispose(),this.overrideMaterialManager=null)}get clear(){return this.clearPass.enabled}set clear(r){this.clearPass.enabled=r}getSelection(){return this.selection}setSelection(r){this.selection=r}isBackgroundDisabled(){return this.backgroundDisabled}setBackgroundDisabled(r){this.backgroundDisabled=r}isShadowMapDisabled(){return this.shadowMapDisabled}setShadowMapDisabled(r){this.shadowMapDisabled=r}getClearPass(){return this.clearPass}render(r,e,t,n,i){const s=this.scene,a=this.camera,o=this.selection,l=a.layers.mask,c=s.background,h=r.shadowMap.autoUpdate,u=this.renderToScreen?null:e;o!==null&&a.layers.set(o.getLayer()),this.shadowMapDisabled&&(r.shadowMap.autoUpdate=!1),(this.backgroundDisabled||this.clearPass.overrideClearColor!==null)&&(s.background=null),this.clear&&this.clearPass.render(r,e),r.setRenderTarget(u),this.overrideMaterialManager!==null?this.overrideMaterialManager.render(r,s,a):r.render(s,a),a.layers.mask=l,s.background=c,r.shadowMap.autoUpdate=h}},mt={SKIP:0,ADD:1,ALPHA:2,AVERAGE:3,COLOR_BURN:4,COLOR_DODGE:5,DARKEN:6,DIFFERENCE:7,EXCLUSION:8,LIGHTEN:9,MULTIPLY:10,DIVIDE:11,NEGATION:12,NORMAL:13,OVERLAY:14,REFLECT:15,SCREEN:16,SOFT_LIGHT:17,SUBTRACT:18},u0="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return min(x+y,1.0)*opacity+x*(1.0-opacity);}",d0="vec3 blend(const in vec3 x,const in vec3 y,const in float opacity){return y*opacity+x*(1.0-opacity);}vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){float a=min(y.a,opacity);return vec4(blend(x.rgb,y.rgb,a),max(x.a,a));}",f0="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return(x+y)*0.5*opacity+x*(1.0-opacity);}",p0="float blend(const in float x,const in float y){return(y==0.0)? y : max(1.0-(1.0-x)/y,0.0);}vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec4 z=vec4(blend(x.r,y.r),blend(x.g,y.g),blend(x.b,y.b),blend(x.a,y.a));return z*opacity+x*(1.0-opacity);}",m0="float blend(const in float x,const in float y){return(y==1.0)? y : min(x/(1.0-y),1.0);}vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec4 z=vec4(blend(x.r,y.r),blend(x.g,y.g),blend(x.b,y.b),blend(x.a,y.a));return z*opacity+x*(1.0-opacity);}",g0="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return min(x,y)*opacity+x*(1.0-opacity);}",v0="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return abs(x-y)*opacity+x*(1.0-opacity);}",x0="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return(x+y-2.0*x*y)*opacity+x*(1.0-opacity);}",_0="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return max(x,y)*opacity+x*(1.0-opacity);}",y0="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return x*y*opacity+x*(1.0-opacity);}",M0="float blend(const in float x,const in float y){return(y>0.0)? min(x/y,1.0): 1.0;}vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec4 z=vec4(blend(x.r,y.r),blend(x.g,y.g),blend(x.b,y.b),blend(x.a,y.a));return z*opacity+x*(1.0-opacity);}",w0="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return(1.0-abs(1.0-x-y))*opacity+x*(1.0-opacity);}",b0="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return y*opacity+x*(1.0-opacity);}",S0="float blend(const in float x,const in float y){return(x<0.5)?(2.0*x*y):(1.0-2.0*(1.0-x)*(1.0-y));}vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec4 z=vec4(blend(x.r,y.r),blend(x.g,y.g),blend(x.b,y.b),blend(x.a,y.a));return z*opacity+x*(1.0-opacity);}",T0="float blend(const in float x,const in float y){return(y==1.0)? y : min(x*x/(1.0-y),1.0);}vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec4 z=vec4(blend(x.r,y.r),blend(x.g,y.g),blend(x.b,y.b),blend(x.a,y.a));return z*opacity+x*(1.0-opacity);}",E0="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return(1.0-(1.0-x)*(1.0-y))*opacity+x*(1.0-opacity);}",A0="float blend(const in float x,const in float y){return(y<0.5)?(2.0*x*y+x*x*(1.0-2.0*y)):(sqrt(x)*(2.0*y-1.0)+2.0*x*(1.0-y));}vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec4 z=vec4(blend(x.r,y.r),blend(x.g,y.g),blend(x.b,y.b),blend(x.a,y.a));return z*opacity+x*(1.0-opacity);}",C0="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return max(x+y-1.0,0.0)*opacity+x*(1.0-opacity);}",L0=new Map([[mt.SKIP,null],[mt.ADD,u0],[mt.ALPHA,d0],[mt.AVERAGE,f0],[mt.COLOR_BURN,p0],[mt.COLOR_DODGE,m0],[mt.DARKEN,g0],[mt.DIFFERENCE,v0],[mt.EXCLUSION,x0],[mt.LIGHTEN,_0],[mt.MULTIPLY,y0],[mt.DIVIDE,M0],[mt.NEGATION,w0],[mt.NORMAL,b0],[mt.OVERLAY,S0],[mt.REFLECT,T0],[mt.SCREEN,E0],[mt.SOFT_LIGHT,A0],[mt.SUBTRACT,C0]]),R0=class extends Tn{constructor(r,e=1){super();this.blendFunction=r,this.opacity=new Gt(e)}getBlendFunction(){return this.blendFunction}setBlendFunction(r){this.blendFunction=r,this.dispatchEvent({type:"change"})}getShaderCode(){return L0.get(this.blendFunction)}},yM=class extends Tn{constructor(r,e,{attributes:t=di.NONE,blendFunction:n=mt.SCREEN,defines:i=new Map,uniforms:s=new Map,extensions:a=null,vertexShader:o=null}={}){super();this.name=r,this.attributes=t,this.fragmentShader=e,this.vertexShader=o,this.defines=i,this.uniforms=s,this.extensions=a,this.blendMode=new R0(n),this.blendMode.addEventListener("change",l=>this.setChanged())}setChanged(){this.dispatchEvent({type:"change"})}getAttributes(){return this.attributes}setAttributes(r){this.attributes=r,this.setChanged()}getFragmentShader(){return this.fragmentShader}setFragmentShader(r){this.fragmentShader=r,this.setChanged()}getVertexShader(){return this.vertexShader}setVertexShader(r){this.vertexShader=r,this.setChanged()}setDepthTexture(r,e=0){}update(r,e,t){}setSize(r,e){}initialize(r,e,t){}dispose(){for(const r of Object.keys(this)){const e=this[r];if(e!==null&&typeof e.dispose=="function"){if(e instanceof Yi)continue;this[r].dispose()}}}},di={NONE:0,DEPTH:1,CONVOLUTION:2};function el(r,e){const t=[];let n;for(;(n=r.exec(e))!==null;)t.push(n[1]);return t}function lu(r,e,t){let n,i;for(const s of e){n="$1"+r+s.charAt(0).toUpperCase()+s.slice(1),i=new RegExp("([^\\.])(\\b"+s+"\\b)","g");for(const a of t.entries())a[1]!==null&&t.set(a[0],a[1].replace(i,n))}}function P0(r,e,t,n,i,s,a){const o=/(?:\w+\s+(\w+)\([\w\s,]*\)\s*{[^}]+})/g,l=/(?:varying\s+\w+\s+(\w*))/g,c=e.blendMode,h=new Map([["fragment",e.getFragmentShader()],["vertex",e.getVertexShader()]]),u=h.get("fragment")!==void 0&&/mainImage/.test(h.get("fragment")),d=h.get("fragment")!==void 0&&/mainUv/.test(h.get("fragment"));let f=[],g=[],v=!1,w=!1;if(h.get("fragment")===void 0)console.error("Missing fragment shader",e);else if(d&&(a&di.CONVOLUTION)!=0)console.error("Effects that transform UV coordinates are incompatible with convolution effects",e);else if(!u&&!d)console.error("The fragment shader contains neither a mainImage nor a mainUv function",e);else{if(d&&(t.set(Ye.FRAGMENT_MAIN_UV,t.get(Ye.FRAGMENT_MAIN_UV)+"	"+r+`MainUv(UV);
`),v=!0),h.get("vertex")!==null&&/mainSupport/.test(h.get("vertex"))){let m="	"+r+"MainSupport(";/mainSupport *\([\w\s]*?uv\s*?\)/.test(h.get("vertex"))&&(m+="vUv"),m+=`);
`,t.set(Ye.VERTEX_MAIN_SUPPORT,t.get(Ye.VERTEX_MAIN_SUPPORT)+m),f=f.concat(el(l,h.get("vertex"))),g=g.concat(f).concat(el(o,h.get("vertex")))}if(g=g.concat(el(o,h.get("fragment"))),g=g.concat(Array.from(e.defines.keys()).map(m=>m.replace(/\([\w\s,]*\)/g,""))),g=g.concat(Array.from(e.uniforms.keys())),e.uniforms.forEach((m,p)=>s.set(r+p.charAt(0).toUpperCase()+p.slice(1),m)),e.defines.forEach((m,p)=>i.set(r+p.charAt(0).toUpperCase()+p.slice(1),m)),lu(r,g,i),lu(r,g,h),n.set(c.blendFunction,c),u){const m=/MainImage *\([\w\s,]*?depth[\w\s,]*?\)/;let p=r+"MainImage(color0, UV, ";(a&di.DEPTH)!=0&&m.test(h.get("fragment"))&&(p+="depth, ",w=!0),p+=`color1);
	`;const b=r+"BlendOpacity";s.set(b,c.opacity),p+="color0 = blend"+c.getBlendFunction()+"(color0, color1, "+b+`);

	`,t.set(Ye.FRAGMENT_MAIN_IMAGE,t.get(Ye.FRAGMENT_MAIN_IMAGE)+p),t.set(Ye.FRAGMENT_HEAD,t.get(Ye.FRAGMENT_HEAD)+"uniform float "+b+`;

`)}t.set(Ye.FRAGMENT_HEAD,t.get(Ye.FRAGMENT_HEAD)+h.get("fragment")+`
`),h.get("vertex")!==null&&t.set(Ye.VERTEX_HEAD,t.get(Ye.VERTEX_HEAD)+h.get("vertex")+`
`)}return{varyings:f,transformedUv:v,readDepth:w}}var MM=class extends ir{constructor(r,...e){super("EffectPass");this.setFullscreenMaterial(new o0(null,null,null,r)),this.effects=e.sort((t,n)=>n.attributes-t.attributes),this.skipRendering=!1,this.uniforms=0,this.varyings=0,this.minTime=1,this.maxTime=Number.POSITIVE_INFINITY}get encodeOutput(){return this.getFullscreenMaterial().defines.ENCODE_OUTPUT!==void 0}set encodeOutput(r){if(this.encodeOutput!==r){const e=this.getFullscreenMaterial();e.needsUpdate=!0,r?e.defines.ENCODE_OUTPUT="1":delete e.defines.ENCODE_OUTPUT}}get dithering(){return this.getFullscreenMaterial().dithering}set dithering(r){const e=this.getFullscreenMaterial();e.dithering!==r&&(e.dithering=r,e.needsUpdate=!0)}verifyResources(r){const e=r.capabilities;let t=Math.min(e.maxFragmentUniforms,e.maxVertexUniforms);this.uniforms>t&&console.warn("The current rendering context doesn't support more than "+t+" uniforms, but "+this.uniforms+" were defined"),t=e.maxVaryings,this.varyings>t&&console.warn("The current rendering context doesn't support more than "+t+" varyings, but "+this.varyings+" were defined")}updateMaterial(){const r=/\bblend\b/g,e=new Map([[Ye.FRAGMENT_HEAD,""],[Ye.FRAGMENT_MAIN_UV,""],[Ye.FRAGMENT_MAIN_IMAGE,""],[Ye.VERTEX_HEAD,""],[Ye.VERTEX_MAIN_SUPPORT,""]]),t=new Map,n=new Map,i=new Map,s=new Set;let a=0,o=0,l=0,c=!1,h=!1,u;for(const f of this.effects)if(f.blendMode.getBlendFunction()===mt.SKIP)l|=f.getAttributes()&di.DEPTH;else if((l&di.CONVOLUTION)!=0&&(f.getAttributes()&di.CONVOLUTION)!=0)console.error("Convolution effects cannot be merged",f);else if(l|=f.getAttributes(),u=P0("e"+a++,f,e,t,n,i,l),o+=u.varyings.length,c=c||u.transformedUv,h=h||u.readDepth,f.extensions!==null)for(const g of f.extensions)s.add(g);for(const f of t.values())e.set(Ye.FRAGMENT_HEAD,e.get(Ye.FRAGMENT_HEAD)+f.getShaderCode().replace(r,"blend"+f.getBlendFunction())+`
`);(l&di.DEPTH)!=0?(h&&e.set(Ye.FRAGMENT_MAIN_IMAGE,`float depth = readDepth(UV);

	`+e.get(Ye.FRAGMENT_MAIN_IMAGE)),this.needsDepthTexture=this.getDepthTexture()===null):this.needsDepthTexture=!1,c?(e.set(Ye.FRAGMENT_MAIN_UV,`vec2 transformedUv = vUv;
`+e.get(Ye.FRAGMENT_MAIN_UV)),n.set("UV","transformedUv")):n.set("UV","vUv"),e.forEach((f,g,v)=>v.set(g,f.trim().replace(/^#/,`
#`))),this.uniforms=i.size,this.varyings=o,this.skipRendering=a===0,this.needsSwap=!this.skipRendering;const d=this.getFullscreenMaterial();if(d.setShaderParts(e),d.setDefines(n),d.setUniforms(i),d.extensions={},s.size>0)for(const f of s)d.extensions[f]=!0;this.needsUpdate=!1}recompile(r){this.updateMaterial(),r!==void 0&&this.verifyResources(r)}getDepthTexture(){return this.getFullscreenMaterial().uniforms.depthBuffer.value}setDepthTexture(r,e=ac){const t=this.getFullscreenMaterial();t.uniforms.depthBuffer.value=r,t.depthPacking=e,t.needsUpdate=!0;for(const n of this.effects)n.setDepthTexture(r,e)}render(r,e,t,n,i){const s=this.getFullscreenMaterial(),a=s.uniforms.time.value+n;this.needsUpdate&&this.recompile(r);for(const o of this.effects)o.update(r,e,n);(!this.skipRendering||this.renderToScreen)&&(s.uniforms.inputBuffer.value=e.texture,s.uniforms.time.value=a<=this.maxTime?a:this.minTime,r.setRenderTarget(this.renderToScreen?null:t),r.render(this.scene,this.camera))}setSize(r,e){this.getFullscreenMaterial().setSize(r,e);for(const t of this.effects)t.setSize(r,e)}initialize(r,e,t){for(const n of this.effects)n.initialize(r,e,t),n.addEventListener("change",i=>this.handleEvent(i));if(this.updateMaterial(),this.verifyResources(r),t!==void 0&&t!==nn){const n=this.getFullscreenMaterial();n.defines.FRAMEBUFFER_PRECISION_HIGH="1"}}dispose(){super.dispose();for(const r of this.effects)r.dispose()}handleEvent(r){switch(r.type){case"change":this.needsUpdate=!0;break}}},D0=class extends ir{constructor(r,e){super("MaskPass",r,e);this.needsSwap=!1,this.clearPass=new au(!1,!1,!0),this.inverse=!1}get clear(){return this.clearPass.enabled}set clear(r){this.clearPass.enabled=r}render(r,e,t,n,i){const s=r.getContext(),a=r.state.buffers,o=this.scene,l=this.camera,c=this.clearPass,h=this.inverse?0:1,u=1-h;a.color.setMask(!1),a.depth.setMask(!1),a.color.setLocked(!0),a.depth.setLocked(!0),a.stencil.setTest(!0),a.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),a.stencil.setFunc(s.ALWAYS,h,4294967295),a.stencil.setClear(u),a.stencil.setLocked(!0),this.clear&&(this.renderToScreen?c.render(r,null):(c.render(r,e),c.render(r,t))),this.renderToScreen?(r.setRenderTarget(null),r.render(o,l)):(r.setRenderTarget(e),r.render(o,l),r.setRenderTarget(t),r.render(o,l)),a.color.setLocked(!1),a.depth.setLocked(!1),a.stencil.setLocked(!1),a.stencil.setFunc(s.EQUAL,1,4294967295),a.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),a.stencil.setLocked(!0)}},I0=class extends ir{constructor(r,e="inputBuffer"){super("ShaderPass");this.setFullscreenMaterial(r),this.uniform=null,this.setInput(e)}setInput(r){const e=this.getFullscreenMaterial();if(this.uniform=null,e!==null){const t=e.uniforms;t!==void 0&&t[r]!==void 0&&(this.uniform=t[r])}}render(r,e,t,n,i){this.uniform!==null&&e!==null&&(this.uniform.value=e.texture),r.setRenderTarget(this.renderToScreen?null:t),r.render(this.scene,this.camera)}initialize(r,e,t){if(t!==void 0&&t!==nn){const n=this.getFullscreenMaterial();n.defines.FRAMEBUFFER_PRECISION_HIGH="1"}}},tl=1/1e3,F0=1e3,N0=class{constructor(){this.previousTime=0,this.currentTime=0,this.delta=0,this.fixedDelta=1e3/60,this.elapsed=0,this.timescale=1,this.fixedDeltaEnabled=!1}setFixedDeltaEnabled(r){return this.fixedDeltaEnabled=r,this}setAutoResetEnabled(r){return typeof document!="undefined"&&document.hidden!==void 0&&(r?document.addEventListener("visibilitychange",this):document.removeEventListener("visibilitychange",this)),this}getDelta(){return this.delta*tl}getFixedDelta(){return this.fixedDelta*tl}setFixedDelta(r){return this.fixedDelta=r*F0,this}getElapsed(){return this.elapsed*tl}getTimescale(){return this.timescale}setTimescale(r){return this.timescale=r,this}update(r){return this.fixedDeltaEnabled?this.delta=this.fixedDelta:(this.previousTime=this.currentTime,this.currentTime=r!==void 0?r:performance.now(),this.delta=this.currentTime-this.previousTime),this.delta*=this.timescale,this.elapsed+=this.delta,this}reset(){return this.delta=0,this.elapsed=0,this.currentTime=performance.now(),this}handleEvent(r){document.hidden||(this.currentTime=performance.now())}dispose(){typeof document!="undefined"&&document.removeEventListener("visibilitychange",this)}},wM=class{constructor(r=null,{depthBuffer:e=!0,stencilBuffer:t=!1,alpha:n=!1,multisampling:i=0,frameBufferType:s}={}){this.renderer=r,this.inputBuffer=null,this.outputBuffer=null,this.renderer!==null&&(this.renderer.autoClear=!1,this.inputBuffer=this.createBuffer(e,t,s,i),this.outputBuffer=this.inputBuffer.clone()),this.copyPass=new I0(new r0),this.alpha=n,this.depthTexture=null,this.passes=[],this.timer=new N0,this.autoRenderToScreen=!0}get multisampling(){return this.inputBuffer instanceof br?this.inputBuffer.samples:0}set multisampling(r){const e=this.inputBuffer,t=this.multisampling;t>0&&r>0?(this.inputBuffer.samples=r,this.outputBuffer.samples=r):t!==r&&(this.inputBuffer.dispose(),this.outputBuffer.dispose(),this.inputBuffer=this.createBuffer(e.depthBuffer,e.stencilBuffer,e.texture.type,r),this.inputBuffer.depthTexture=this.depthTexture,this.outputBuffer=this.inputBuffer.clone())}getTimer(){return this.timer}getRenderer(){return this.renderer}replaceRenderer(r,e=!0){const t=this.renderer;if(t!==null&&t!==r){const n=t.getSize(new ee),i=r.getSize(new ee),s=t.domElement.parentNode;this.renderer=r,this.renderer.autoClear=!1,n.equals(i)||this.setSize(),e&&s!==null&&(s.removeChild(t.domElement),s.appendChild(r.domElement))}return t}createDepthTexture(){const r=this.depthTexture=new Hs;return this.inputBuffer.depthTexture=r,this.inputBuffer.dispose(),this.inputBuffer.stencilBuffer?(r.format=si,r.type=ii):r.type=xr,r}deleteDepthTexture(){if(this.depthTexture!==null){this.depthTexture.dispose(),this.depthTexture=null,this.inputBuffer.depthTexture=null,this.inputBuffer.dispose();for(const r of this.passes)r.setDepthTexture(null)}}createBuffer(r,e,t,n){const i=this.renderer,s=i.getContext(),a=i.getDrawingBufferSize(new ee),l={format:!(this.alpha||s.getContextAttributes().alpha)&&t===nn?On:Ct,minFilter:Vt,magFilter:Vt,stencilBuffer:e,depthBuffer:r,type:t},c=n>0?new br(a.width,a.height,l):new Yt(a.width,a.height,l);return n>0&&(c.samples=n),c.texture.name="EffectComposer.Buffer",c.texture.generateMipmaps=!1,c}addPass(r,e){const t=this.passes,n=this.renderer,i=n.getDrawingBufferSize(new ee),s=n.getContext().getContextAttributes().alpha,a=this.inputBuffer.texture.type;if(r.setSize(i.width,i.height),r.initialize(n,s,a),this.autoRenderToScreen&&(t.length>0&&(t[t.length-1].renderToScreen=!1),r.renderToScreen&&(this.autoRenderToScreen=!1)),e!==void 0?t.splice(e,0,r):t.push(r),this.autoRenderToScreen&&(t[t.length-1].renderToScreen=!0),r.needsDepthTexture||this.depthTexture!==null)if(this.depthTexture===null){const o=this.createDepthTexture();for(r of t)r.setDepthTexture(o)}else r.setDepthTexture(this.depthTexture)}removePass(r){const e=this.passes,t=e.indexOf(r);if(t!==-1&&e.splice(t,1).length>0){if(this.depthTexture!==null){const s=(o,l)=>o||l.needsDepthTexture;e.reduce(s,!1)||(r.getDepthTexture()===this.depthTexture&&r.setDepthTexture(null),this.deleteDepthTexture())}this.autoRenderToScreen&&t===e.length&&(r.renderToScreen=!1,e.length>0&&(e[e.length-1].renderToScreen=!0))}}removeAllPasses(){const r=this.passes;this.deleteDepthTexture(),r.length>0&&(this.autoRenderToScreen&&(r[r.length-1].renderToScreen=!1),this.passes=[])}render(r){const e=this.renderer,t=this.copyPass;let n=this.inputBuffer,i=this.outputBuffer,s=!1,a,o,l;r===void 0&&(r=this.timer.update().getDelta());for(const c of this.passes)c.isEnabled()&&(c.render(e,n,i,r,s),c.needsSwap&&(s&&(t.renderToScreen=c.renderToScreen,a=e.getContext(),o=e.state.buffers.stencil,o.setFunc(a.NOTEQUAL,1,4294967295),t.render(e,n,i,r,s),o.setFunc(a.EQUAL,1,4294967295)),l=n,n=i,i=l),c instanceof D0?s=!0:c instanceof h0&&(s=!1))}setSize(r,e,t){const n=this.renderer;if(r===void 0||e===void 0){const o=n.getSize(new ee);r=o.width,e=o.height}else n.setSize(r,e,t);const i=n.getDrawingBufferSize(new ee),s=this.inputBuffer,a=this.outputBuffer;s.setSize(i.width,i.height),a.setSize(i.width,i.height);for(const o of this.passes)o.setSize(i.width,i.height)}reset(){this.dispose(),this.autoRenderToScreen=!0}dispose(){for(const r of this.passes)r.dispose();this.passes=[],this.inputBuffer!==null&&this.inputBuffer.dispose(),this.outputBuffer!==null&&this.outputBuffer.dispose(),this.deleteDepthTexture(),this.copyPass.dispose(),this.timer.dispose()}};new C;new Le;new be;new C;new C;var cu={exports:{}};(function(r,e){(function(t,n){r.exports=n()})(Qu,function(){var t=function(){function n(f){return a.appendChild(f.dom),f}function i(f){for(var g=0;g<a.children.length;g++)a.children[g].style.display=g===f?"block":"none";s=f}var s=0,a=document.createElement("div");a.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000",a.addEventListener("click",function(f){f.preventDefault(),i(++s%a.children.length)},!1);var o=(performance||Date).now(),l=o,c=0,h=n(new t.Panel("FPS","#0ff","#002")),u=n(new t.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var d=n(new t.Panel("MB","#f08","#201"));return i(0),{REVISION:16,dom:a,addPanel:n,showPanel:i,begin:function(){o=(performance||Date).now()},end:function(){c++;var f=(performance||Date).now();if(u.update(f-o,200),f>l+1e3&&(h.update(1e3*c/(f-l),100),l=f,c=0,d)){var g=performance.memory;d.update(g.usedJSHeapSize/1048576,g.jsHeapSizeLimit/1048576)}return f},update:function(){o=this.end()},domElement:a,setMode:i}};return t.Panel=function(n,i,s){var a=1/0,o=0,l=Math.round,c=l(window.devicePixelRatio||1),h=80*c,u=48*c,d=3*c,f=2*c,g=3*c,v=15*c,w=74*c,m=30*c,p=document.createElement("canvas");p.width=h,p.height=u,p.style.cssText="width:80px;height:48px";var b=p.getContext("2d");return b.font="bold "+9*c+"px Helvetica,Arial,sans-serif",b.textBaseline="top",b.fillStyle=s,b.fillRect(0,0,h,u),b.fillStyle=i,b.fillText(n,d,f),b.fillRect(g,v,w,m),b.fillStyle=s,b.globalAlpha=.9,b.fillRect(g,v,w,m),{dom:p,update:function(M,E){a=Math.min(a,M),o=Math.max(o,M),b.fillStyle=s,b.globalAlpha=1,b.fillRect(0,0,h,v),b.fillStyle=i,b.fillText(l(M)+" "+n+" ("+l(a)+"-"+l(o)+")",d,f),b.drawImage(p,g+c,v,w-c,m,g,v,w-c,m),b.fillRect(g+w-c,v,c,m),b.fillStyle=s,b.globalAlpha=.9,b.fillRect(g+w-c,v,c,l((1-M/E)*m))}}},t})})(cu);var bM=cu.exports;class oa extends Rt{constructor(){const e=oa.SkyShader,t=new gn({name:"SkyShader",fragmentShader:e.fragmentShader,vertexShader:e.vertexShader,uniforms:Ec.clone(e.uniforms),side:lt,depthWrite:!1});super(new Ui(1,1,1),t)}}oa.prototype.isSky=!0;oa.SkyShader={uniforms:{turbidity:{value:2},rayleigh:{value:1},mieCoefficient:{value:.005},mieDirectionalG:{value:.8},sunPosition:{value:new C},up:{value:new C(0,1,0)}},vertexShader:`
		uniform vec3 sunPosition;
		uniform float rayleigh;
		uniform float turbidity;
		uniform float mieCoefficient;
		uniform vec3 up;

		varying vec3 vWorldPosition;
		varying vec3 vSunDirection;
		varying float vSunfade;
		varying vec3 vBetaR;
		varying vec3 vBetaM;
		varying float vSunE;

		// constants for atmospheric scattering
		const float e = 2.71828182845904523536028747135266249775724709369995957;
		const float pi = 3.141592653589793238462643383279502884197169;

		// wavelength of used primaries, according to preetham
		const vec3 lambda = vec3( 680E-9, 550E-9, 450E-9 );
		// this pre-calcuation replaces older TotalRayleigh(vec3 lambda) function:
		// (8.0 * pow(pi, 3.0) * pow(pow(n, 2.0) - 1.0, 2.0) * (6.0 + 3.0 * pn)) / (3.0 * N * pow(lambda, vec3(4.0)) * (6.0 - 7.0 * pn))
		const vec3 totalRayleigh = vec3( 5.804542996261093E-6, 1.3562911419845635E-5, 3.0265902468824876E-5 );

		// mie stuff
		// K coefficient for the primaries
		const float v = 4.0;
		const vec3 K = vec3( 0.686, 0.678, 0.666 );
		// MieConst = pi * pow( ( 2.0 * pi ) / lambda, vec3( v - 2.0 ) ) * K
		const vec3 MieConst = vec3( 1.8399918514433978E14, 2.7798023919660528E14, 4.0790479543861094E14 );

		// earth shadow hack
		// cutoffAngle = pi / 1.95;
		const float cutoffAngle = 1.6110731556870734;
		const float steepness = 1.5;
		const float EE = 1000.0;

		float sunIntensity( float zenithAngleCos ) {
			zenithAngleCos = clamp( zenithAngleCos, -1.0, 1.0 );
			return EE * max( 0.0, 1.0 - pow( e, -( ( cutoffAngle - acos( zenithAngleCos ) ) / steepness ) ) );
		}

		vec3 totalMie( float T ) {
			float c = ( 0.2 * T ) * 10E-18;
			return 0.434 * c * MieConst;
		}

		void main() {

			vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
			vWorldPosition = worldPosition.xyz;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			gl_Position.z = gl_Position.w; // set z to camera.far

			vSunDirection = normalize( sunPosition );

			vSunE = sunIntensity( dot( vSunDirection, up ) );

			vSunfade = 1.0 - clamp( 1.0 - exp( ( sunPosition.y / 450000.0 ) ), 0.0, 1.0 );

			float rayleighCoefficient = rayleigh - ( 1.0 * ( 1.0 - vSunfade ) );

			// extinction (absorbtion + out scattering)
			// rayleigh coefficients
			vBetaR = totalRayleigh * rayleighCoefficient;

			// mie coefficients
			vBetaM = totalMie( turbidity ) * mieCoefficient;

		}`,fragmentShader:`
		varying vec3 vWorldPosition;
		varying vec3 vSunDirection;
		varying float vSunfade;
		varying vec3 vBetaR;
		varying vec3 vBetaM;
		varying float vSunE;

		uniform float mieDirectionalG;
		uniform vec3 up;

		const vec3 cameraPos = vec3( 0.0, 0.0, 0.0 );

		// constants for atmospheric scattering
		const float pi = 3.141592653589793238462643383279502884197169;

		const float n = 1.0003; // refractive index of air
		const float N = 2.545E25; // number of molecules per unit volume for air at 288.15K and 1013mb (sea level -45 celsius)

		// optical length at zenith for molecules
		const float rayleighZenithLength = 8.4E3;
		const float mieZenithLength = 1.25E3;
		// 66 arc seconds -> degrees, and the cosine of that
		const float sunAngularDiameterCos = 0.999956676946448443553574619906976478926848692873900859324;

		// 3.0 / ( 16.0 * pi )
		const float THREE_OVER_SIXTEENPI = 0.05968310365946075;
		// 1.0 / ( 4.0 * pi )
		const float ONE_OVER_FOURPI = 0.07957747154594767;

		float rayleighPhase( float cosTheta ) {
			return THREE_OVER_SIXTEENPI * ( 1.0 + pow( cosTheta, 2.0 ) );
		}

		float hgPhase( float cosTheta, float g ) {
			float g2 = pow( g, 2.0 );
			float inverse = 1.0 / pow( 1.0 - 2.0 * g * cosTheta + g2, 1.5 );
			return ONE_OVER_FOURPI * ( ( 1.0 - g2 ) * inverse );
		}

		void main() {

			vec3 direction = normalize( vWorldPosition - cameraPos );

			// optical length
			// cutoff angle at 90 to avoid singularity in next formula.
			float zenithAngle = acos( max( 0.0, dot( up, direction ) ) );
			float inverse = 1.0 / ( cos( zenithAngle ) + 0.15 * pow( 93.885 - ( ( zenithAngle * 180.0 ) / pi ), -1.253 ) );
			float sR = rayleighZenithLength * inverse;
			float sM = mieZenithLength * inverse;

			// combined extinction factor
			vec3 Fex = exp( -( vBetaR * sR + vBetaM * sM ) );

			// in scattering
			float cosTheta = dot( direction, vSunDirection );

			float rPhase = rayleighPhase( cosTheta * 0.5 + 0.5 );
			vec3 betaRTheta = vBetaR * rPhase;

			float mPhase = hgPhase( cosTheta, mieDirectionalG );
			vec3 betaMTheta = vBetaM * mPhase;

			vec3 Lin = pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * ( 1.0 - Fex ), vec3( 1.5 ) );
			Lin *= mix( vec3( 1.0 ), pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * Fex, vec3( 1.0 / 2.0 ) ), clamp( pow( 1.0 - dot( up, vSunDirection ), 5.0 ), 0.0, 1.0 ) );

			// nightsky
			float theta = acos( direction.y ); // elevation --> y-axis, [-pi/2, pi/2]
			float phi = atan( direction.z, direction.x ); // azimuth --> x-axis [-pi/2, pi/2]
			vec2 uv = vec2( phi, theta ) / vec2( 2.0 * pi, pi ) + vec2( 0.5, 0.0 );
			vec3 L0 = vec3( 0.1 ) * Fex;

			// composition + solar disc
			float sundisk = smoothstep( sunAngularDiameterCos, sunAngularDiameterCos + 0.00002, cosTheta );
			L0 += ( vSunE * 19000.0 * Fex ) * sundisk;

			vec3 texColor = ( Lin + L0 ) * 0.04 + vec3( 0.0, 0.0003, 0.00075 );

			vec3 retColor = pow( texColor, vec3( 1.0 / ( 1.2 + ( 1.2 * vSunfade ) ) ) );

			gl_FragColor = vec4( retColor, 1.0 );

			#include <tonemapping_fragment>
			#include <encodings_fragment>

		}`};function hu(r,e){for(let t=0;t<r.length;t++){const n=r[t];e(n)}}function uu(r,e,t,n){this.callbacks={success:[e],error:[t]},this.url=r,this.success=(...i)=>{hu(this.callbacks.success,s=>{s(r,...i)})},this.error=i=>{hu(this.callbacks.success,s=>{s(r,i)})},this.cancel=()=>{n.cancel(this)},this.task=null}class du{constructor(){this.list={}}get(e){return this.list[e]}has(e){return typeof this.get(e)=="object"}length(){return this.keys().length}keys(){return Object.keys(this.list)}shift(){const e=this.keys();return e.length===0?null:this.pull(e[0])}pull(e){const t=this.get(e);return typeof t=="object"?(this.remove(e),t):null}push(e){return this.list[e.url]=e,this}remove(e){return delete this.list[e],this}}function fu(r,e){return r.has(e)===!1}function pu(r,e){if(r.has(e.url)===!1)return!1;const t=r.get(e.url);return t.callbacks.error.push(e.callbacks.error[0]),t.callbacks.success.push(e.callbacks.success[0]),e.task=t.task,!0}class O0{constructor(e,t=1,n=void 0){this.concurrentJobs=t,this.queue=new du,this.loading=new du,this.LoadTaskClass=e,this.onEntrySuccess=null,this.onEntryError=null,this.startTimeoutTime=typeof n=="undefined"?50:n,this.startTimeout=null}add(e){return pu(this.loading,e)?this:(pu(this.queue,e)===!1&&this.queue.push(e),this)}start(){if(this.loading.length()>=this.concurrentJobs)return!1;if(this.startTimeout!==null&&clearTimeout(this.startTimeout),this.startTimeoutTime===null)return this.forceStart();this.startTimeout=setTimeout(()=>{let e=!1;for(;e===!1&&this.loading.length()<this.concurrentJobs;)e=this.forceStart()===!1},this.startTimeoutTime)}forceStart(){const e=this.queue.shift();if(e===null)return!1;this.loading.push(e);const t=e.url,n=this.LoadTaskClass;return e.task=new n(e,(...i)=>{fu(this.loading,t)||(e.success(...i),this.loading.remove(t),this.start(),this.onEntrySuccess!==null&&this.onEntrySuccess(e,i))},i=>{fu(this.loading,t)||(e.error(i),this.loading.remove(t),this.start(),this.onEntryError!==null&&this.onEntryError(e,i))}),!0}cancel(e){if(this.queue.remove(e),this.loading.has(e)){const t=this.loading.pull(e);return t.task!==null&&typeof t.task.cancel=="function"&&t.task.cancel(),!0}return!1}}class B0{constructor(e,t=1,n=void 0){Sa(this,"add",(e,t,n)=>{const i=new uu(e,t,n,this);return this.core.add(i).start(),i});Sa(this,"cancel",e=>{let t=e;e instanceof uu&&(t=e.url),this.core.cancel(t)&&this.core.start()});this.core=new O0(e,t,n)}}function SM(r,e=1,t=void 0){const n=new B0(r,e,t);this.add=n.add,this.cancel=n.cancel}var U0=Math.PI/180,z0=180/Math.PI;function mu(r){var e=gu(r[0]+1,r[2]),t=gu(r[0],r[2]),n=vu(r[1]+1,r[2]),i=vu(r[1],r[2]);return[t,n,e,i]}function V0(r){var e=mu(r),t={type:"Polygon",coordinates:[[[e[0],e[3]],[e[0],e[1]],[e[2],e[1]],[e[2],e[3]],[e[0],e[3]]]]};return t}function gu(r,e){return r/Math.pow(2,e)*360-180}function vu(r,e){var t=Math.PI-2*Math.PI*r/Math.pow(2,e);return z0*Math.atan(.5*(Math.exp(t)-Math.exp(-t)))}function nl(r,e,t){var n=bu(r,e,t);return n[0]=Math.floor(n[0]),n[1]=Math.floor(n[1]),n}function xu(r){return[[r[0]*2,r[1]*2,r[2]+1],[r[0]*2+1,r[1]*2,r[2]+1],[r[0]*2+1,r[1]*2+1,r[2]+1],[r[0]*2,r[1]*2+1,r[2]+1]]}function _u(r){return[r[0]>>1,r[1]>>1,r[2]-1]}function yu(r){return xu(_u(r))}function k0(r,e){for(var t=yu(r),n=0;n<t.length;n++)if(!Mu(e,t[n]))return!1;return!0}function Mu(r,e){for(var t=0;t<r.length;t++)if(wu(r[t],e))return!0;return!1}function wu(r,e){return r[0]===e[0]&&r[1]===e[1]&&r[2]===e[2]}function H0(r){for(var e="",t=r[2];t>0;t--){var n=0,i=1<<t-1;(r[0]&i)!=0&&n++,(r[1]&i)!=0&&(n+=2),e+=n.toString()}return e}function G0(r){for(var e=0,t=0,n=r.length,i=n;i>0;i--){var s=1<<i-1,a=+r[n-i];a===1&&(e|=s),a===2&&(t|=s),a===3&&(e|=s,t|=s)}return[e,t,n]}function W0(r){var e=nl(r[0],r[1],32),t=nl(r[2],r[3],32),n=[e[0],e[1],t[0],t[1]],i=X0(n);if(i===0)return[0,0,0];var s=n[0]>>>32-i,a=n[1]>>>32-i;return[s,a,i]}function X0(r){for(var e=28,t=0;t<e;t++){var n=1<<32-(t+1);if((r[0]&n)!=(r[2]&n)||(r[1]&n)!=(r[3]&n))return t}return e}function bu(r,e,t){var n=Math.sin(e*U0),i=Math.pow(2,t),s=i*(r/360+.5),a=i*(.5-.25*Math.log((1+n)/(1-n))/Math.PI);return s=s%i,s<0&&(s=s+i),[s,a,t]}var TM={tileToGeoJSON:V0,tileToBBOX:mu,getChildren:xu,getParent:_u,getSiblings:yu,hasTile:Mu,hasSiblings:k0,tilesEqual:wu,tileToQuadkey:H0,quadkeyToTile:G0,pointToTile:nl,bboxToTile:W0,pointToTileFraction:bu};function We(r,e,t){return e in r?Object.defineProperty(r,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):r[e]=t,r}function q0(r){const e=r.length;if(e<=1)return[r];const t=[];let n,i;for(let s=0;s<e;s++){const a=Y0(r[s]);a!==0&&(i===void 0&&(i=a<0),i===a<0?(n&&t.push(n),n=[r[s]]):n&&n.push(r[s]))}return n&&t.push(n),t}function Y0(r){let e=0;for(let t=0,n=r.length-1,i,s;t<r.length;n=t++)i=r[t],s=r[n],e+=(s[0]-i[0])*(i[1]+s[1]);return e}function Z0(r,e,t){e&&t&&(r===1?e.id=t.readVarint():r===2?j0(t,e):r===3?e.type=t.readVarint():r===4&&(e._geometry=t.pos))}function j0(r,e){const t=r.readVarint()+r.pos;for(;r.pos<t;){const n=e._keys[r.readVarint()],i=e._values[r.readVarint()];e.properties[n]=i}}class il{static get types(){return["Unknown","Point","LineString","Polygon"]}constructor(e,t,n,i,s){We(this,"properties",void 0),We(this,"extent",void 0),We(this,"type",void 0),We(this,"id",void 0),We(this,"_pbf",void 0),We(this,"_geometry",void 0),We(this,"_keys",void 0),We(this,"_values",void 0),this.properties={},this.extent=n,this.type=0,this.id=null,this._pbf=e,this._geometry=-1,this._keys=i,this._values=s,e.readFields(Z0,this,t)}loadGeometry(){const e=this._pbf;e.pos=this._geometry;const t=e.readVarint()+e.pos;let n=1,i=0,s=0,a=0;const o=[];let l;for(;e.pos<t;){if(i<=0){const c=e.readVarint();n=c&7,i=c>>3}if(i--,n===1||n===2)s+=e.readSVarint(),a+=e.readSVarint(),n===1&&(l&&o.push(l),l=[]),l&&l.push([s,a]);else if(n===7)l&&l.push(l[0].slice());else throw new Error("unknown command ".concat(n))}return l&&o.push(l),o}bbox(){const e=this._pbf;e.pos=this._geometry;const t=e.readVarint()+e.pos;let n=1,i=0,s=0,a=0,o=1/0,l=-1/0,c=1/0,h=-1/0;for(;e.pos<t;){if(i<=0){const u=e.readVarint();n=u&7,i=u>>3}if(i--,n===1||n===2)s+=e.readSVarint(),a+=e.readSVarint(),s<o&&(o=s),s>l&&(l=s),a<c&&(c=a),a>h&&(h=a);else if(n!==7)throw new Error("unknown command ".concat(n))}return[o,c,l,h]}_toGeoJSON(e){let t=this.loadGeometry(),n=il.types[this.type],i,s;switch(this.type){case 1:const o=[];for(i=0;i<t.length;i++)o[i]=t[i][0];t=o,e(t,this);break;case 2:for(i=0;i<t.length;i++)e(t[i],this);break;case 3:for(t=q0(t),i=0;i<t.length;i++)for(s=0;s<t[i].length;s++)e(t[i][s],this);break}t.length===1?t=t[0]:n="Multi".concat(n);const a={type:"Feature",geometry:{type:n,coordinates:t},properties:this.properties};return this.id!==null&&(a.id=this.id),a}toGeoJSON(e){if(typeof e=="function")return this._toGeoJSON(e);const{x:t,y:n,z:i}=e,s=this.extent*Math.pow(2,i),a=this.extent*t,o=this.extent*n;function l(c){for(let h=0;h<c.length;h++){const u=c[h];u[0]=(u[0]+a)*360/s-180;const d=180-(u[1]+o)*360/s;u[1]=360/Math.PI*Math.atan(Math.exp(d*Math.PI/180))-90}}return this._toGeoJSON(l)}}class J0{constructor(e,t){We(this,"version",void 0),We(this,"name",void 0),We(this,"extent",void 0),We(this,"length",void 0),We(this,"_pbf",void 0),We(this,"_keys",void 0),We(this,"_values",void 0),We(this,"_features",void 0),this.version=1,this.name="",this.extent=4096,this.length=0,this._pbf=e,this._keys=[],this._values=[],this._features=[],e.readFields($0,this,t),this.length=this._features.length}feature(e){if(e<0||e>=this._features.length)throw new Error("feature index out of bounds");this._pbf.pos=this._features[e];const t=this._pbf.readVarint()+this._pbf.pos;return new il(this._pbf,t,this.extent,this._keys,this._values)}}function $0(r,e,t){e&&t&&(r===15?e.version=t.readVarint():r===1?e.name=t.readString():r===5?e.extent=t.readVarint():r===2?e._features.push(t.pos):r===3?e._keys.push(t.readString()):r===4&&e._values.push(Q0(t)))}function Q0(r){let e=null;const t=r.readVarint()+r.pos;for(;r.pos<t;){const n=r.readVarint()>>3;e=n===1?r.readString():n===2?r.readFloat():n===3?r.readDouble():n===4?r.readVarint64():n===5?r.readVarint():n===6?r.readSVarint():n===7?r.readBoolean():null}return e}class K0{constructor(e,t){We(this,"layers",void 0),this.layers=e.readFields(ey,{},t)}}function ey(r,e,t){if(r===3&&t){const n=new J0(t,t.readVarint()+t.pos);n.length&&e&&(e[n.name]=n)}}function rl(r,e={}){const{start:t=0,end:n=r.length}=e,i=e.size||2;let s=0;for(let a=t,o=n-i;a<n;a+=i)s+=(r[a]-r[o])*(r[a+1]+r[o+1]),o=a;return s/2}function ty(r,e,t,n){t=t||2;const i=e&&e.length,s=i?e[0]*t:r.length;let a=Su(r,0,s,t,!0,n&&n[0]);const o=[];if(!a||a.next===a.prev)return o;let l,c,h,u,d,f,g;if(i&&(a=ay(r,e,a,t,n)),r.length>80*t){u=c=r[0],d=h=r[1];for(let v=t;v<s;v+=t)f=r[v],g=r[v+1],f<u&&(u=f),g<d&&(d=g),f>c&&(c=f),g>h&&(h=g);l=Math.max(c-u,h-d),l=l!==0?1/l:0}return qr(a,o,t,u,d,l),o}function Su(r,e,t,n,i,s){let a,o;if(s===void 0&&(s=rl(r,{start:e,end:t,size:n})),i===s<0)for(a=e;a<t;a+=n)o=Au(a,r[a],r[a+1],o);else for(a=t-n;a>=e;a-=n)o=Au(a,r[a],r[a+1],o);return o&&la(o,o.next)&&(Zr(o),o=o.next),o}function Qn(r,e){if(!r)return r;e||(e=r);let t=r,n;do if(n=!1,!t.steiner&&(la(t,t.next)||ft(t.prev,t,t.next)===0)){if(Zr(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function qr(r,e,t,n,i,s,a){if(!r)return;!a&&s&&uy(r,n,i,s);let o=r,l,c;for(;r.prev!==r.next;){if(l=r.prev,c=r.next,s?iy(r,n,i,s):ny(r)){e.push(l.i/t),e.push(r.i/t),e.push(c.i/t),Zr(r),r=c.next,o=c.next;continue}if(r=c,r===o){a?a===1?(r=ry(Qn(r),e,t),qr(r,e,t,n,i,s,2)):a===2&&sy(r,e,t,n,i,s):qr(Qn(r),e,t,n,i,s,1);break}}}function ny(r){const e=r.prev,t=r,n=r.next;if(ft(e,t,n)>=0)return!1;let i=r.next.next;for(;i!==r.prev;){if(rr(e.x,e.y,t.x,t.y,n.x,n.y,i.x,i.y)&&ft(i.prev,i,i.next)>=0)return!1;i=i.next}return!0}function iy(r,e,t,n){const i=r.prev,s=r,a=r.next;if(ft(i,s,a)>=0)return!1;const o=i.x<s.x?i.x<a.x?i.x:a.x:s.x<a.x?s.x:a.x,l=i.y<s.y?i.y<a.y?i.y:a.y:s.y<a.y?s.y:a.y,c=i.x>s.x?i.x>a.x?i.x:a.x:s.x>a.x?s.x:a.x,h=i.y>s.y?i.y>a.y?i.y:a.y:s.y>a.y?s.y:a.y,u=sl(o,l,e,t,n),d=sl(c,h,e,t,n);let f=r.prevZ,g=r.nextZ;for(;f&&f.z>=u&&g&&g.z<=d;){if(f!==r.prev&&f!==r.next&&rr(i.x,i.y,s.x,s.y,a.x,a.y,f.x,f.y)&&ft(f.prev,f,f.next)>=0||(f=f.prevZ,g!==r.prev&&g!==r.next&&rr(i.x,i.y,s.x,s.y,a.x,a.y,g.x,g.y)&&ft(g.prev,g,g.next)>=0))return!1;g=g.nextZ}for(;f&&f.z>=u;){if(f!==r.prev&&f!==r.next&&rr(i.x,i.y,s.x,s.y,a.x,a.y,f.x,f.y)&&ft(f.prev,f,f.next)>=0)return!1;f=f.prevZ}for(;g&&g.z<=d;){if(g!==r.prev&&g!==r.next&&rr(i.x,i.y,s.x,s.y,a.x,a.y,g.x,g.y)&&ft(g.prev,g,g.next)>=0)return!1;g=g.nextZ}return!0}function ry(r,e,t){let n=r;do{const i=n.prev,s=n.next.next;!la(i,s)&&Tu(i,n,n.next,s)&&Yr(i,s)&&Yr(s,i)&&(e.push(i.i/t),e.push(n.i/t),e.push(s.i/t),Zr(n),Zr(n.next),n=r=s),n=n.next}while(n!==r);return Qn(n)}function sy(r,e,t,n,i,s){let a=r;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&py(a,o)){let l=Eu(a,o);a=Qn(a,a.next),l=Qn(l,l.next),qr(a,e,t,n,i,s),qr(l,e,t,n,i,s);return}o=o.next}a=a.next}while(a!==r)}function ay(r,e,t,n,i){const s=[];let a,o,l,c,h;for(a=0,o=e.length;a<o;a++)l=e[a]*n,c=a<o-1?e[a+1]*n:r.length,h=Su(r,l,c,n,!1,i&&i[a+1]),h===h.next&&(h.steiner=!0),s.push(fy(h));for(s.sort(oy),a=0;a<s.length;a++)ly(s[a],t),t=Qn(t,t.next);return t}function oy(r,e){return r.x-e.x}function ly(r,e){if(e=cy(r,e),e){const t=Eu(e,r);Qn(e,e.next),Qn(t,t.next)}}function cy(r,e){let t=e;const n=r.x,i=r.y;let s=-1/0,a;do{if(i<=t.y&&i>=t.next.y&&t.next.y!==t.y){const d=t.x+(i-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(d<=n&&d>s){if(s=d,d===n){if(i===t.y)return t;if(i===t.next.y)return t.next}a=t.x<t.next.x?t:t.next}}t=t.next}while(t!==e);if(!a)return null;if(n===s)return a;const o=a,l=a.x,c=a.y;let h=1/0,u;t=a;do n>=t.x&&t.x>=l&&n!==t.x&&rr(i<c?n:s,i,l,c,i<c?s:n,i,t.x,t.y)&&(u=Math.abs(i-t.y)/(n-t.x),Yr(t,r)&&(u<h||u===h&&(t.x>a.x||t.x===a.x&&hy(a,t)))&&(a=t,h=u)),t=t.next;while(t!==o);return a}function hy(r,e){return ft(r.prev,r,e.prev)<0&&ft(e.next,r,r.next)<0}function uy(r,e,t,n){let i=r;do i.z===null&&(i.z=sl(i.x,i.y,e,t,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==r);i.prevZ.nextZ=null,i.prevZ=null,dy(i)}function dy(r){let e,t,n=1,i,s,a,o,l,c;do{for(s=r,r=null,c=null,i=0;s;){for(i++,o=s,a=0,t=0;t<n&&(a++,o=o.nextZ,!!o);t++);for(l=n;a>0||l>0&&o;)a!==0&&(l===0||!o||s.z<=o.z)?(e=s,s=s.nextZ,a--):(e=o,o=o.nextZ,l--),c?c.nextZ=e:r=e,e.prevZ=c,c=e;s=o}c.nextZ=null,n*=2}while(i>1);return r}function sl(r,e,t,n,i){return r=32767*(r-t)*i,e=32767*(e-n)*i,r=(r|r<<8)&16711935,r=(r|r<<4)&252645135,r=(r|r<<2)&858993459,r=(r|r<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,r|e<<1}function fy(r){let e=r,t=r;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==r);return t}function rr(r,e,t,n,i,s,a,o){return(i-a)*(e-o)-(r-a)*(s-o)>=0&&(r-a)*(n-o)-(t-a)*(e-o)>=0&&(t-a)*(s-o)-(i-a)*(n-o)>=0}function py(r,e){return r.next.i!==e.i&&r.prev.i!==e.i&&!my(r,e)&&(Yr(r,e)&&Yr(e,r)&&gy(r,e)&&(ft(r.prev,r,e.prev)||ft(r,e.prev,e))||la(r,e)&&ft(r.prev,r,r.next)>0&&ft(e.prev,e,e.next)>0)}function ft(r,e,t){return(e.y-r.y)*(t.x-e.x)-(e.x-r.x)*(t.y-e.y)}function la(r,e){return r.x===e.x&&r.y===e.y}function Tu(r,e,t,n){const i=ha(ft(r,e,t)),s=ha(ft(r,e,n)),a=ha(ft(t,n,r)),o=ha(ft(t,n,e));return!!(i!==s&&a!==o||i===0&&ca(r,t,e)||s===0&&ca(r,n,e)||a===0&&ca(t,r,n)||o===0&&ca(t,e,n))}function ca(r,e,t){return e.x<=Math.max(r.x,t.x)&&e.x>=Math.min(r.x,t.x)&&e.y<=Math.max(r.y,t.y)&&e.y>=Math.min(r.y,t.y)}function ha(r){return r>0?1:r<0?-1:0}function my(r,e){let t=r;do{if(t.i!==r.i&&t.next.i!==r.i&&t.i!==e.i&&t.next.i!==e.i&&Tu(t,t.next,r,e))return!0;t=t.next}while(t!==r);return!1}function Yr(r,e){return ft(r.prev,r,r.next)<0?ft(r,e,r.next)>=0&&ft(r,r.prev,e)>=0:ft(r,e,r.prev)<0||ft(r,r.next,e)<0}function gy(r,e){let t=r,n=!1;const i=(r.x+e.x)/2,s=(r.y+e.y)/2;do t.y>s!=t.next.y>s&&t.next.y!==t.y&&i<(t.next.x-t.x)*(s-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==r);return n}function Eu(r,e){const t=new al(r.i,r.x,r.y),n=new al(e.i,e.x,e.y),i=r.next,s=e.prev;return r.next=e,e.prev=r,t.next=i,i.prev=t,n.next=t,t.prev=n,s.next=n,n.prev=s,n}function Au(r,e,t,n){const i=new al(r,e,t);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function Zr(r){r.next.prev=r.prev,r.prev.next=r.next,r.prevZ&&(r.prevZ.nextZ=r.nextZ),r.nextZ&&(r.nextZ.prevZ=r.prevZ)}function al(r,e,t){this.i=r,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=null,this.prevZ=null,this.nextZ=null,this.steiner=!1}function vy(r){const e=r.indices.length,t="Polygon";if(e<=1)return{type:t,data:r.data,areas:[[rl(r.data)]],indices:[r.indices]};const n=[],i=[];let s=[],a=[],o,l=0;for(let c,h=0,u;h<e;h++){u=r.indices[h]-l,c=r.indices[h+1]-l||r.data.length;const d=r.data.slice(u,c),f=rl(d);if(f===0){const g=r.data.slice(0,u),v=r.data.slice(c);r.data=g.concat(v),l+=c-u;continue}o===void 0&&(o=f<0),o===f<0?(a.length&&(n.push(s),i.push(a)),a=[u],s=[f]):(s.push(f),a.push(u))}return s&&n.push(s),a.length&&i.push(a),{type:t,areas:n,indices:i,data:r.data}}function xy(r,e,t,n){for(let i=0,s=r.length;i<s;i+=2){r[i]=(r[i]+e)*360/n-180;const a=180-(r[i+1]+t)*360/n;r[i+1]=360/Math.PI*Math.atan(Math.exp(a*Math.PI/180))-90}}function _y(r,e,t){e&&t&&(r===1?e.id=t.readVarint():r===2?yy(t,e):r===3?e.type=t.readVarint():r===4&&(e._geometry=t.pos))}function yy(r,e){const t=r.readVarint()+r.pos;for(;r.pos<t;){const n=e._keys[r.readVarint()],i=e._values[r.readVarint()];e.properties[n]=i}}let Cu,fi,ol,ua,ll,cl,jr;class My{constructor(e,t,n,i,s,a){We(this,"properties",void 0),We(this,"extent",void 0),We(this,"type",void 0),We(this,"id",void 0),We(this,"_pbf",void 0),We(this,"_geometry",void 0),We(this,"_keys",void 0),We(this,"_values",void 0),We(this,"_geometryInfo",void 0),this.properties={},this.extent=n,this.type=0,this.id=null,this._pbf=e,this._geometry=-1,this._keys=i,this._values=s,this._geometryInfo=a,e.readFields(_y,this,t)}loadGeometry(){const e=this._pbf;e.pos=this._geometry,Cu=e.readVarint()+e.pos,fi=1,ua=0,ll=0,cl=0,jr=0;const t=[],n=[];for(;e.pos<Cu;)if(ua<=0&&(ol=e.readVarint(),fi=ol&7,ua=ol>>3),ua--,fi===1||fi===2)ll+=e.readSVarint(),cl+=e.readSVarint(),fi===1&&t.push(jr),n.push(ll,cl),jr+=2;else if(fi===7){if(jr>0){const i=t[t.length-1];n.push(n[i],n[i+1]),jr+=2}}else throw new Error("unknown command ".concat(fi));return{data:n,indices:t}}_toBinaryCoordinates(e){const t=this.loadGeometry();let n;e(t.data,this);const i=2;switch(this.type){case 1:this._geometryInfo.pointFeaturesCount++,this._geometryInfo.pointPositionsCount+=t.indices.length,n=en({type:"Point"},t);break;case 2:this._geometryInfo.lineFeaturesCount++,this._geometryInfo.linePathsCount+=t.indices.length,this._geometryInfo.linePositionsCount+=t.data.length/i,n=en({type:"LineString"},t);break;case 3:n=vy(t),this._geometryInfo.polygonFeaturesCount++,this._geometryInfo.polygonObjectsCount+=n.indices.length;for(const a of n.indices)this._geometryInfo.polygonRingsCount+=a.length;this._geometryInfo.polygonPositionsCount+=n.data.length/i;break;default:throw new Error("Invalid geometry type: ".concat(this.type))}const s={type:"Feature",geometry:n,properties:this.properties};return this.id!==null&&(s.id=this.id),s}toBinaryCoordinates(e){return typeof e=="function"?this._toBinaryCoordinates(e):this._toBinaryCoordinates(xy)}}class wy{constructor(e,t){We(this,"version",void 0),We(this,"name",void 0),We(this,"extent",void 0),We(this,"length",void 0),We(this,"_pbf",void 0),We(this,"_keys",void 0),We(this,"_values",void 0),We(this,"_features",void 0),this.version=1,this.name="",this.extent=4096,this.length=0,this._pbf=e,this._keys=[],this._values=[],this._features=[],e.readFields(by,this,t),this.length=this._features.length}feature(e,t){if(e<0||e>=this._features.length)throw new Error("feature index out of bounds");this._pbf.pos=this._features[e];const n=this._pbf.readVarint()+this._pbf.pos;return new My(this._pbf,n,this.extent,this._keys,this._values,t)}}function by(r,e,t){e&&t&&(r===15?e.version=t.readVarint():r===1?e.name=t.readString():r===5?e.extent=t.readVarint():r===2?e._features.push(t.pos):r===3?e._keys.push(t.readString()):r===4&&e._values.push(Sy(t)))}function Sy(r){let e=null;const t=r.readVarint()+r.pos;for(;r.pos<t;){const n=r.readVarint()>>3;e=n===1?r.readString():n===2?r.readFloat():n===3?r.readDouble():n===4?r.readVarint64():n===5?r.readVarint():n===6?r.readSVarint():n===7?r.readBoolean():null}return e}class Ty{constructor(e,t){We(this,"layers",void 0),this.layers=e.readFields(Ey,{},t)}}function Ey(r,e,t){if(r===3&&t){const n=new wy(t,t.readVarint()+t.pos);n.length&&e&&(e[n.name]=n)}}function Ay(r,e,t){const n=Cy(r),i=Object.keys(n).filter(s=>n[s]!==Array);return Ly(r,en({propArrayTypes:n},e),{numericPropKeys:t&&t.numericPropKeys||i,PositionDataType:t?t.PositionDataType:Float32Array})}function Cy(r){const e={};for(const t of r)if(t.properties)for(const n in t.properties){const i=t.properties[n];e[n]=Ny(i,e[n])}return e}function Ly(r,e,t){const{pointPositionsCount:n,pointFeaturesCount:i,linePositionsCount:s,linePathsCount:a,lineFeaturesCount:o,polygonPositionsCount:l,polygonObjectsCount:c,polygonRingsCount:h,polygonFeaturesCount:u,propArrayTypes:d,coordLength:f}=e,{numericPropKeys:g=[],PositionDataType:v=Float32Array}=t,w=r[0]&&"id"in r[0],m=r.length>65535?Uint32Array:Uint16Array,p={type:"Point",positions:new v(n*f),globalFeatureIds:new m(n),featureIds:i>65535?new Uint32Array(n):new Uint16Array(n),numericProps:{},properties:[],fields:[]},b={type:"LineString",pathIndices:s>65535?new Uint32Array(a+1):new Uint16Array(a+1),positions:new v(s*f),globalFeatureIds:new m(s),featureIds:o>65535?new Uint32Array(s):new Uint16Array(s),numericProps:{},properties:[],fields:[]},M={type:"Polygon",polygonIndices:l>65535?new Uint32Array(c+1):new Uint16Array(c+1),primitivePolygonIndices:l>65535?new Uint32Array(h+1):new Uint16Array(h+1),positions:new v(l*f),triangles:[],globalFeatureIds:new m(l),featureIds:u>65535?new Uint32Array(l):new Uint16Array(l),numericProps:{},properties:[],fields:[]};for(const D of[p,b,M])for(const _ of g){const R=d[_];D.numericProps[_]=new R(D.positions.length/f)}b.pathIndices[a]=s,M.polygonIndices[c]=l,M.primitivePolygonIndices[h]=l;const E={pointPosition:0,pointFeature:0,linePosition:0,linePath:0,lineFeature:0,polygonPosition:0,polygonObject:0,polygonRing:0,polygonFeature:0,feature:0};for(const D of r){const _=D.geometry,R=D.properties||{};switch(_.type){case"Point":Ry(_,p,E,f,R),p.properties.push(dl(R,g)),w&&p.fields.push({id:D.id}),E.pointFeature++;break;case"LineString":Py(_,b,E,f,R),b.properties.push(dl(R,g)),w&&b.fields.push({id:D.id}),E.lineFeature++;break;case"Polygon":Dy(_,M,E,f,R),M.properties.push(dl(R,g)),w&&M.fields.push({id:D.id}),E.polygonFeature++;break;default:throw new Error("Invalid geometry type")}E.feature++}return Fy(p,b,M,f)}function Ry(r,e,t,n,i){e.positions.set(r.data,t.pointPosition*n);const s=r.data.length/n;ul(e,i,t.pointPosition,s),e.globalFeatureIds.fill(t.feature,t.pointPosition,t.pointPosition+s),e.featureIds.fill(t.pointFeature,t.pointPosition,t.pointPosition+s),t.pointPosition+=s}function Py(r,e,t,n,i){e.positions.set(r.data,t.linePosition*n);const s=r.data.length/n;ul(e,i,t.linePosition,s),e.globalFeatureIds.fill(t.feature,t.linePosition,t.linePosition+s),e.featureIds.fill(t.lineFeature,t.linePosition,t.linePosition+s);for(let a=0,o=r.indices.length;a<o;++a){const l=r.indices[a],c=a===o-1?r.data.length:r.indices[a+1];e.pathIndices[t.linePath++]=t.linePosition,t.linePosition+=(c-l)/n}}function Dy(r,e,t,n,i){e.positions.set(r.data,t.polygonPosition*n);const s=r.data.length/n;ul(e,i,t.polygonPosition,s),e.globalFeatureIds.fill(t.feature,t.polygonPosition,t.polygonPosition+s),e.featureIds.fill(t.polygonFeature,t.polygonPosition,t.polygonPosition+s);for(let a=0,o=r.indices.length;a<o;++a){const l=t.polygonPosition;e.polygonIndices[t.polygonObject++]=l;const c=r.areas[a],h=r.indices[a],u=r.indices[a+1];for(let f=0,g=h.length;f<g;++f){const v=h[f],w=f===g-1?u===void 0?r.data.length:u[0]:h[f+1];e.primitivePolygonIndices[t.polygonRing++]=t.polygonPosition,t.polygonPosition+=(w-v)/n}const d=t.polygonPosition;Iy(e,c,h,{startPosition:l,endPosition:d,coordLength:n})}}function Iy(r,e,t,{startPosition:n,endPosition:i,coordLength:s}){const a=n*s,o=i*s,l=r.positions.subarray(a,o),c=t[0],h=t.slice(1).map(d=>(d-c)/s),u=ty(l,h,s,e);for(let d=0,f=u.length;d<f;++d)r.triangles.push(n+u[d])}function hl(r,e){const t={};for(const n in r)t[n]={value:r[n],size:e};return t}function Fy(r,e,t,n){return{points:Kn(en({},r),{positions:{value:r.positions,size:n},globalFeatureIds:{value:r.globalFeatureIds,size:1},featureIds:{value:r.featureIds,size:1},numericProps:hl(r.numericProps,1)}),lines:Kn(en({},e),{positions:{value:e.positions,size:n},pathIndices:{value:e.pathIndices,size:1},globalFeatureIds:{value:e.globalFeatureIds,size:1},featureIds:{value:e.featureIds,size:1},numericProps:hl(e.numericProps,1)}),polygons:Kn(en({},t),{positions:{value:t.positions,size:n},polygonIndices:{value:t.polygonIndices,size:1},primitivePolygonIndices:{value:t.primitivePolygonIndices,size:1},triangles:{value:new Uint32Array(t.triangles),size:1},globalFeatureIds:{value:t.globalFeatureIds,size:1},featureIds:{value:t.featureIds,size:1},numericProps:hl(t.numericProps,1)})}}function ul(r,e,t,n){for(const i in r.numericProps)if(i in e){const s=e[i];r.numericProps[i].fill(s,t,t+n)}}function dl(r,e){const t={};for(const n in r)e.includes(n)||(t[n]=r[n]);return t}function Ny(r,e){return e===Array||!Number.isFinite(r)?Array:e===Float64Array||Math.fround(r)!==r?Float64Array:Float32Array}var fl={};/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */fl.read=function(r,e,t,n,i){var s,a,o=i*8-n-1,l=(1<<o)-1,c=l>>1,h=-7,u=t?i-1:0,d=t?-1:1,f=r[e+u];for(u+=d,s=f&(1<<-h)-1,f>>=-h,h+=o;h>0;s=s*256+r[e+u],u+=d,h-=8);for(a=s&(1<<-h)-1,s>>=-h,h+=n;h>0;a=a*256+r[e+u],u+=d,h-=8);if(s===0)s=1-c;else{if(s===l)return a?NaN:(f?-1:1)*(1/0);a=a+Math.pow(2,n),s=s-c}return(f?-1:1)*a*Math.pow(2,s-n)};fl.write=function(r,e,t,n,i,s){var a,o,l,c=s*8-i-1,h=(1<<c)-1,u=h>>1,d=i===23?Math.pow(2,-24)-Math.pow(2,-77):0,f=n?0:s-1,g=n?1:-1,v=e<0||e===0&&1/e<0?1:0;for(e=Math.abs(e),isNaN(e)||e===1/0?(o=isNaN(e)?1:0,a=h):(a=Math.floor(Math.log(e)/Math.LN2),e*(l=Math.pow(2,-a))<1&&(a--,l*=2),a+u>=1?e+=d/l:e+=d*Math.pow(2,1-u),e*l>=2&&(a++,l/=2),a+u>=h?(o=0,a=h):a+u>=1?(o=(e*l-1)*Math.pow(2,i),a=a+u):(o=e*Math.pow(2,u-1)*Math.pow(2,i),a=0));i>=8;r[t+f]=o&255,f+=g,o/=256,i-=8);for(a=a<<i|o,c+=i;c>0;r[t+f]=a&255,f+=g,a/=256,c-=8);r[t+f-g]|=v*128};var Oy=je,da=fl;function je(r){this.buf=ArrayBuffer.isView&&ArrayBuffer.isView(r)?r:new Uint8Array(r||0),this.pos=0,this.type=0,this.length=this.buf.length}je.Varint=0;je.Fixed64=1;je.Bytes=2;je.Fixed32=5;var pl=(1<<16)*(1<<16),Lu=1/pl,By=12,Ru=typeof TextDecoder=="undefined"?null:new TextDecoder("utf8");je.prototype={destroy:function(){this.buf=null},readFields:function(r,e,t){for(t=t||this.length;this.pos<t;){var n=this.readVarint(),i=n>>3,s=this.pos;this.type=n&7,r(i,e,this),this.pos===s&&this.skip(n)}return e},readMessage:function(r,e){return this.readFields(r,e,this.readVarint()+this.pos)},readFixed32:function(){var r=fa(this.buf,this.pos);return this.pos+=4,r},readSFixed32:function(){var r=Du(this.buf,this.pos);return this.pos+=4,r},readFixed64:function(){var r=fa(this.buf,this.pos)+fa(this.buf,this.pos+4)*pl;return this.pos+=8,r},readSFixed64:function(){var r=fa(this.buf,this.pos)+Du(this.buf,this.pos+4)*pl;return this.pos+=8,r},readFloat:function(){var r=da.read(this.buf,this.pos,!0,23,4);return this.pos+=4,r},readDouble:function(){var r=da.read(this.buf,this.pos,!0,52,8);return this.pos+=8,r},readVarint:function(r){var e=this.buf,t,n;return n=e[this.pos++],t=n&127,n<128||(n=e[this.pos++],t|=(n&127)<<7,n<128)||(n=e[this.pos++],t|=(n&127)<<14,n<128)||(n=e[this.pos++],t|=(n&127)<<21,n<128)?t:(n=e[this.pos],t|=(n&15)<<28,Uy(t,r,this))},readVarint64:function(){return this.readVarint(!0)},readSVarint:function(){var r=this.readVarint();return r%2==1?(r+1)/-2:r/2},readBoolean:function(){return Boolean(this.readVarint())},readString:function(){var r=this.readVarint()+this.pos,e=this.pos;return this.pos=r,r-e>=By&&Ru?Qy(this.buf,e,r):$y(this.buf,e,r)},readBytes:function(){var r=this.readVarint()+this.pos,e=this.buf.subarray(this.pos,r);return this.pos=r,e},readPackedVarint:function(r,e){if(this.type!==je.Bytes)return r.push(this.readVarint(e));var t=In(this);for(r=r||[];this.pos<t;)r.push(this.readVarint(e));return r},readPackedSVarint:function(r){if(this.type!==je.Bytes)return r.push(this.readSVarint());var e=In(this);for(r=r||[];this.pos<e;)r.push(this.readSVarint());return r},readPackedBoolean:function(r){if(this.type!==je.Bytes)return r.push(this.readBoolean());var e=In(this);for(r=r||[];this.pos<e;)r.push(this.readBoolean());return r},readPackedFloat:function(r){if(this.type!==je.Bytes)return r.push(this.readFloat());var e=In(this);for(r=r||[];this.pos<e;)r.push(this.readFloat());return r},readPackedDouble:function(r){if(this.type!==je.Bytes)return r.push(this.readDouble());var e=In(this);for(r=r||[];this.pos<e;)r.push(this.readDouble());return r},readPackedFixed32:function(r){if(this.type!==je.Bytes)return r.push(this.readFixed32());var e=In(this);for(r=r||[];this.pos<e;)r.push(this.readFixed32());return r},readPackedSFixed32:function(r){if(this.type!==je.Bytes)return r.push(this.readSFixed32());var e=In(this);for(r=r||[];this.pos<e;)r.push(this.readSFixed32());return r},readPackedFixed64:function(r){if(this.type!==je.Bytes)return r.push(this.readFixed64());var e=In(this);for(r=r||[];this.pos<e;)r.push(this.readFixed64());return r},readPackedSFixed64:function(r){if(this.type!==je.Bytes)return r.push(this.readSFixed64());var e=In(this);for(r=r||[];this.pos<e;)r.push(this.readSFixed64());return r},skip:function(r){var e=r&7;if(e===je.Varint)for(;this.buf[this.pos++]>127;);else if(e===je.Bytes)this.pos=this.readVarint()+this.pos;else if(e===je.Fixed32)this.pos+=4;else if(e===je.Fixed64)this.pos+=8;else throw new Error("Unimplemented type: "+e)},writeTag:function(r,e){this.writeVarint(r<<3|e)},realloc:function(r){for(var e=this.length||16;e<this.pos+r;)e*=2;if(e!==this.length){var t=new Uint8Array(e);t.set(this.buf),this.buf=t,this.length=e}},finish:function(){return this.length=this.pos,this.pos=0,this.buf.subarray(0,this.length)},writeFixed32:function(r){this.realloc(4),ar(this.buf,r,this.pos),this.pos+=4},writeSFixed32:function(r){this.realloc(4),ar(this.buf,r,this.pos),this.pos+=4},writeFixed64:function(r){this.realloc(8),ar(this.buf,r&-1,this.pos),ar(this.buf,Math.floor(r*Lu),this.pos+4),this.pos+=8},writeSFixed64:function(r){this.realloc(8),ar(this.buf,r&-1,this.pos),ar(this.buf,Math.floor(r*Lu),this.pos+4),this.pos+=8},writeVarint:function(r){if(r=+r||0,r>268435455||r<0){zy(r,this);return}this.realloc(4),this.buf[this.pos++]=r&127|(r>127?128:0),!(r<=127)&&(this.buf[this.pos++]=(r>>>=7)&127|(r>127?128:0),!(r<=127)&&(this.buf[this.pos++]=(r>>>=7)&127|(r>127?128:0),!(r<=127)&&(this.buf[this.pos++]=r>>>7&127)))},writeSVarint:function(r){this.writeVarint(r<0?-r*2-1:r*2)},writeBoolean:function(r){this.writeVarint(Boolean(r))},writeString:function(r){r=String(r),this.realloc(r.length*4),this.pos++;var e=this.pos;this.pos=Ky(this.buf,r,this.pos);var t=this.pos-e;t>=128&&Pu(e,t,this),this.pos=e-1,this.writeVarint(t),this.pos+=t},writeFloat:function(r){this.realloc(4),da.write(this.buf,r,this.pos,!0,23,4),this.pos+=4},writeDouble:function(r){this.realloc(8),da.write(this.buf,r,this.pos,!0,52,8),this.pos+=8},writeBytes:function(r){var e=r.length;this.writeVarint(e),this.realloc(e);for(var t=0;t<e;t++)this.buf[this.pos++]=r[t]},writeRawMessage:function(r,e){this.pos++;var t=this.pos;r(e,this);var n=this.pos-t;n>=128&&Pu(t,n,this),this.pos=t-1,this.writeVarint(n),this.pos+=n},writeMessage:function(r,e,t){this.writeTag(r,je.Bytes),this.writeRawMessage(e,t)},writePackedVarint:function(r,e){e.length&&this.writeMessage(r,Hy,e)},writePackedSVarint:function(r,e){e.length&&this.writeMessage(r,Gy,e)},writePackedBoolean:function(r,e){e.length&&this.writeMessage(r,qy,e)},writePackedFloat:function(r,e){e.length&&this.writeMessage(r,Wy,e)},writePackedDouble:function(r,e){e.length&&this.writeMessage(r,Xy,e)},writePackedFixed32:function(r,e){e.length&&this.writeMessage(r,Yy,e)},writePackedSFixed32:function(r,e){e.length&&this.writeMessage(r,Zy,e)},writePackedFixed64:function(r,e){e.length&&this.writeMessage(r,jy,e)},writePackedSFixed64:function(r,e){e.length&&this.writeMessage(r,Jy,e)},writeBytesField:function(r,e){this.writeTag(r,je.Bytes),this.writeBytes(e)},writeFixed32Field:function(r,e){this.writeTag(r,je.Fixed32),this.writeFixed32(e)},writeSFixed32Field:function(r,e){this.writeTag(r,je.Fixed32),this.writeSFixed32(e)},writeFixed64Field:function(r,e){this.writeTag(r,je.Fixed64),this.writeFixed64(e)},writeSFixed64Field:function(r,e){this.writeTag(r,je.Fixed64),this.writeSFixed64(e)},writeVarintField:function(r,e){this.writeTag(r,je.Varint),this.writeVarint(e)},writeSVarintField:function(r,e){this.writeTag(r,je.Varint),this.writeSVarint(e)},writeStringField:function(r,e){this.writeTag(r,je.Bytes),this.writeString(e)},writeFloatField:function(r,e){this.writeTag(r,je.Fixed32),this.writeFloat(e)},writeDoubleField:function(r,e){this.writeTag(r,je.Fixed64),this.writeDouble(e)},writeBooleanField:function(r,e){this.writeVarintField(r,Boolean(e))}};function Uy(r,e,t){var n=t.buf,i,s;if(s=n[t.pos++],i=(s&112)>>4,s<128||(s=n[t.pos++],i|=(s&127)<<3,s<128)||(s=n[t.pos++],i|=(s&127)<<10,s<128)||(s=n[t.pos++],i|=(s&127)<<17,s<128)||(s=n[t.pos++],i|=(s&127)<<24,s<128)||(s=n[t.pos++],i|=(s&1)<<31,s<128))return sr(r,i,e);throw new Error("Expected varint not more than 10 bytes")}function In(r){return r.type===je.Bytes?r.readVarint()+r.pos:r.pos+1}function sr(r,e,t){return t?e*4294967296+(r>>>0):(e>>>0)*4294967296+(r>>>0)}function zy(r,e){var t,n;if(r>=0?(t=r%4294967296|0,n=r/4294967296|0):(t=~(-r%4294967296),n=~(-r/4294967296),t^4294967295?t=t+1|0:(t=0,n=n+1|0)),r>=18446744073709552e3||r<-18446744073709552e3)throw new Error("Given varint doesn't fit into 10 bytes");e.realloc(10),Vy(t,n,e),ky(n,e)}function Vy(r,e,t){t.buf[t.pos++]=r&127|128,r>>>=7,t.buf[t.pos++]=r&127|128,r>>>=7,t.buf[t.pos++]=r&127|128,r>>>=7,t.buf[t.pos++]=r&127|128,r>>>=7,t.buf[t.pos]=r&127}function ky(r,e){var t=(r&7)<<4;e.buf[e.pos++]|=t|((r>>>=3)?128:0),!!r&&(e.buf[e.pos++]=r&127|((r>>>=7)?128:0),!!r&&(e.buf[e.pos++]=r&127|((r>>>=7)?128:0),!!r&&(e.buf[e.pos++]=r&127|((r>>>=7)?128:0),!!r&&(e.buf[e.pos++]=r&127|((r>>>=7)?128:0),!!r&&(e.buf[e.pos++]=r&127)))))}function Pu(r,e,t){var n=e<=16383?1:e<=2097151?2:e<=268435455?3:Math.floor(Math.log(e)/(Math.LN2*7));t.realloc(n);for(var i=t.pos-1;i>=r;i--)t.buf[i+n]=t.buf[i]}function Hy(r,e){for(var t=0;t<r.length;t++)e.writeVarint(r[t])}function Gy(r,e){for(var t=0;t<r.length;t++)e.writeSVarint(r[t])}function Wy(r,e){for(var t=0;t<r.length;t++)e.writeFloat(r[t])}function Xy(r,e){for(var t=0;t<r.length;t++)e.writeDouble(r[t])}function qy(r,e){for(var t=0;t<r.length;t++)e.writeBoolean(r[t])}function Yy(r,e){for(var t=0;t<r.length;t++)e.writeFixed32(r[t])}function Zy(r,e){for(var t=0;t<r.length;t++)e.writeSFixed32(r[t])}function jy(r,e){for(var t=0;t<r.length;t++)e.writeFixed64(r[t])}function Jy(r,e){for(var t=0;t<r.length;t++)e.writeSFixed64(r[t])}function fa(r,e){return(r[e]|r[e+1]<<8|r[e+2]<<16)+r[e+3]*16777216}function ar(r,e,t){r[t]=e,r[t+1]=e>>>8,r[t+2]=e>>>16,r[t+3]=e>>>24}function Du(r,e){return(r[e]|r[e+1]<<8|r[e+2]<<16)+(r[e+3]<<24)}function $y(r,e,t){for(var n="",i=e;i<t;){var s=r[i],a=null,o=s>239?4:s>223?3:s>191?2:1;if(i+o>t)break;var l,c,h;o===1?s<128&&(a=s):o===2?(l=r[i+1],(l&192)==128&&(a=(s&31)<<6|l&63,a<=127&&(a=null))):o===3?(l=r[i+1],c=r[i+2],(l&192)==128&&(c&192)==128&&(a=(s&15)<<12|(l&63)<<6|c&63,(a<=2047||a>=55296&&a<=57343)&&(a=null))):o===4&&(l=r[i+1],c=r[i+2],h=r[i+3],(l&192)==128&&(c&192)==128&&(h&192)==128&&(a=(s&15)<<18|(l&63)<<12|(c&63)<<6|h&63,(a<=65535||a>=1114112)&&(a=null))),a===null?(a=65533,o=1):a>65535&&(a-=65536,n+=String.fromCharCode(a>>>10&1023|55296),a=56320|a&1023),n+=String.fromCharCode(a),i+=o}return n}function Qy(r,e,t){return Ru.decode(r.subarray(e,t))}function Ky(r,e,t){for(var n=0,i,s;n<e.length;n++){if(i=e.charCodeAt(n),i>55295&&i<57344)if(s)if(i<56320){r[t++]=239,r[t++]=191,r[t++]=189,s=i;continue}else i=s-55296<<10|i-56320|65536,s=null;else{i>56319||n+1===e.length?(r[t++]=239,r[t++]=191,r[t++]=189):s=i;continue}else s&&(r[t++]=239,r[t++]=191,r[t++]=189,s=null);i<128?r[t++]=i:(i<2048?r[t++]=i>>6|192:(i<65536?r[t++]=i>>12|224:(r[t++]=i>>18|240,r[t++]=i>>12&63|128),r[t++]=i>>6&63|128),r[t++]=i&63|128)}return t}var Iu=Oy;function Fu(r,e){e=eM(e);const t=[];if(e){const n=e.gis.format==="binary",i={coordLength:2,pointPositionsCount:0,pointFeaturesCount:0,linePositionsCount:0,linePathsCount:0,lineFeaturesCount:0,polygonPositionsCount:0,polygonObjectsCount:0,polygonRingsCount:0,polygonFeaturesCount:0};if(r.byteLength>0){const s=n?new Ty(new Iu(r)):new K0(new Iu(r)),a=e.mvt;(Array.isArray(a.layers)?a.layers:Object.keys(s.layers)).forEach(l=>{const c=s.layers[l],h=Kn(en({},a),{layerName:l});if(!!c)for(let u=0;u<c.length;u++){const d=c.feature(u,i),f=n?nM(d,h):tM(d,h);t.push(f)}})}if(n){const s=Ay(t,i);return s.byteLength=r.byteLength,s}}return t}function eM(r){if(r){r=Kn(en({},r),{mvt:r.mvt||{},gis:r.gis||{}});const e=r.coordinates==="wgs84",{tileIndex:t}=r,n=t&&Number.isFinite(t.x)&&Number.isFinite(t.y)&&Number.isFinite(t.z);if(e&&!n)throw new Error("MVT Loader: WGS84 coordinates need tileIndex property. Check documentation.")}return r}function tM(r,e){const t=r.toGeoJSON(e.coordinates==="wgs84"?e.tileIndex:iM);return e.layerProperty&&(t.properties[e.layerProperty]=e.layerName),t}function nM(r,e){const t=r.toBinaryCoordinates(e.coordinates==="wgs84"?e.tileIndex:rM);return e.layerProperty&&t.properties&&(t.properties[e.layerProperty]=e.layerName),t}function iM(r,e){const{extent:t}=e;for(let n=0;n<r.length;n++){const i=r[n];i[0]/=t,i[1]/=t}}function rM(r,e){const{extent:t}=e;for(let n=0,i=r.length;n<i;++n)r[n]/=t}const sM="3.1.3",aM={name:"Mapbox Vector Tile",id:"mvt",module:"mvt",version:sM,extensions:["mvt","pbf"],mimeTypes:["application/vnd.mapbox-vector-tile","application/x-protobuf"],worker:!0,category:"geometry",options:{mvt:{coordinates:"local",layerProperty:"layerName",layers:null,tileIndex:null}}},EM=Kn(en({},aM),{parse:async(r,e)=>Fu(r,e),parseSync:Fu,binary:!0});/*!
 * hold-event
 * https://github.com/yomotsu/hold-event
 * (c) 2020 @yomotsu
 * Released under the MIT License.
 */var Jr;(function(r){r.HOLD_START="holdStart",r.HOLD_END="holdEnd",r.HOLDING="holding"})(Jr||(Jr={}));/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */var ml=function(r,e){return ml=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n}||function(t,n){for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(t[i]=n[i])},ml(r,e)};function gl(r,e){if(typeof e!="function"&&e!==null)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");ml(r,e);function t(){this.constructor=r}r.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}var oM=function(){function r(){this._listeners={}}return r.prototype.addEventListener=function(e,t){var n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)},r.prototype.removeEventListener=function(e,t){var n=this._listeners,i=n[e];if(i!==void 0){var s=i.indexOf(t);s!==-1&&i.splice(s,1)}},r.prototype.dispatchEvent=function(e){var t=this._listeners,n=t[e.type];if(n!==void 0){e.target=this;for(var i=n.slice(0),s=0,a=i.length;s<a;s++)i[s].call(this,e)}},r}(),Nu=function(r){gl(e,r);function e(t){var n=r.call(this)||this;return n._enabled=!0,n._holding=!1,n._intervalId=-1,n._deltaTime=0,n._elapsedTime=0,n._lastTime=0,n._holdStart=function(i){if(!!n._enabled&&!n._holding){n._deltaTime=0,n._elapsedTime=0,n._lastTime=performance.now(),n.dispatchEvent({type:Jr.HOLD_START,deltaTime:n._deltaTime,elapsedTime:n._elapsedTime,originalEvent:i}),n._holding=!0;var s=function(){n._intervalId=n.holdIntervalDelay?window.setTimeout(s,n.holdIntervalDelay):window.requestAnimationFrame(s);var a=performance.now();n._deltaTime=a-n._lastTime,n._elapsedTime+=n._deltaTime,n._lastTime=performance.now(),n.dispatchEvent({type:Jr.HOLDING,deltaTime:n._deltaTime,elapsedTime:n._elapsedTime})};n._intervalId=n.holdIntervalDelay?window.setTimeout(s,n.holdIntervalDelay):window.requestAnimationFrame(s)}},n._holdEnd=function(i){if(!!n._enabled&&!!n._holding){var s=performance.now();n._deltaTime=s-n._lastTime,n._elapsedTime+=n._deltaTime,n._lastTime=performance.now(),n.dispatchEvent({type:Jr.HOLD_END,deltaTime:n._deltaTime,elapsedTime:n._elapsedTime,originalEvent:i}),window.clearTimeout(n._intervalId),window.cancelAnimationFrame(n._intervalId),n._holding=!1}},n.holdIntervalDelay=t,n}return Object.defineProperty(e.prototype,"enabled",{get:function(){return this._enabled},set:function(t){this._enabled!==t&&(this._enabled=t,this._enabled||this._holdEnd())},enumerable:!1,configurable:!0}),e}(oM);(function(r){gl(e,r);function e(t,n){var i=r.call(this,n)||this;i._holdStart=i._holdStart.bind(i),i._holdEnd=i._holdEnd.bind(i);var s=i._holdStart,a=i._holdEnd;return t.addEventListener("mousedown",s),document.addEventListener("mouseup",a),window.addEventListener("blur",i._holdEnd),i}return e})(Nu);var AM=function(r){gl(e,r);function e(t,n){var i=r.call(this,n)||this;i._holdStart=i._holdStart.bind(i),i._holdEnd=i._holdEnd.bind(i);var s=function(o){lM(o)||o.keyCode===t&&i._holdStart(o)},a=function(o){o.keyCode===t&&i._holdEnd(o)};return document.addEventListener("keydown",s),document.addEventListener("keyup",a),window.addEventListener("blur",i._holdEnd),i}return e}(Nu);function lM(r){var e=r.target;return e.tagName==="INPUT"||e.tagName==="SELECT"||e.tagName==="TEXTAREA"||e.isContentEditable}export{mt as $,Yi as A,st as B,be as C,pn as D,wM as E,yt as F,Rr as G,dM as H,Bt as I,R_ as J,AM as K,Vt as L,Rt as M,_t as N,_M as O,Lx as P,SM as Q,On as R,gn as S,Et as T,Sc as U,ee as V,tt as W,bM as X,Di as Y,yM as Z,di as _,C as a,Gt as a0,oa as a1,MM as a2,hM as a3,lo as b,h_ as c,Le as d,Bs as e,Ht as f,it as g,vM as h,EM as i,ke as j,vn as k,T_ as l,Ba as m,mM as n,qt as o,L_ as p,uM as q,fM as r,xM as s,TM as t,sn as u,Ri as v,pM as w,gM as x,td as y,Yt as z};
