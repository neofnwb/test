import{v as De,S as ye,w as be,x as Fe,y as Le,_ as Xe,j as z,Y as W,k as L,V as P,C as I,u as me,B as he,$ as V,a0 as We,K as ke,z as qe,Q as Ge,M as pe,X as Oe,E as Ve,I as He}from"./three.module.BO180ZY6.js";import{u as we}from"./Layout.astro_astro_type_script_index_1_lang.C7SCjpzP.js";import{s as ge}from"./frame.Bo8lNOOI.js";const Se=28,Ie=1.75,Ye=1.25,je=18,xe=2.5,Ne=1.15,$e={washA:[.1,.27,.3],washB:[.3,.19,.08],beams:[16762995,8381398,16766608,8841436]},Te=`
  float sdRoundRect(vec2 p, vec2 halfSize, float radius) {
    vec2 q = abs(p) - halfSize + radius;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - radius;
  }
`,Ke=`
  uniform vec2 uSize;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xy * uSize, 0.0, 1.0);
  }
`,Qe=`
  uniform sampler2D uMap;
  uniform vec2 uSize;
  uniform float uRadius;
  uniform vec2 uCover;
  uniform float uReveal;
  uniform vec2 uTilt;
  uniform float uLift;
  uniform float uDefocus;
  varying vec2 vUv;
  ${Te}
  void main() {
    vec2 px = (vUv - 0.5) * uSize;
    float d = sdRoundRect(px, uSize * 0.5, uRadius);
    float edge = fwidth(d);
    float mask = 1.0 - smoothstep(-edge, edge, d);

    vec2 uv = (vUv - 0.5) * uCover + 0.5;
    // Out of focus on the way in, sharp once it has landed: a bias into the
    // picture's own mip chain, which is a real defocus of the image rather
    // than a CSS blur of the whole box.
    vec3 color = texture2D(uMap, uv, uDefocus).rgb;

    // A sheen that travels across the face as it turns, so the picture reads as
    // sitting under a surface rather than being printed on the air.
    float along = dot(vUv - 0.5, normalize(vec2(1.0, 1.35)));
    float sheen = exp(-pow((along + uTilt.y * 0.9 - uTilt.x * 0.6) * 4.2, 2.0));
    color += sheen * (0.05 + 0.07 * uLift);

    // A hairline of light just inside the rounded edge.
    float rim = exp(-abs(d) / 1.4);
    color += rim * 0.12;


    gl_FragColor = vec4(color, mask * uReveal);
    #include <colorspace_fragment>
  }
`,Je=`
  uniform vec2 uSize;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xy * uSize, 0.0, 1.0);
  }
`,Ze=`
  uniform vec2 uSize;
  uniform vec2 uBox;
  uniform float uRadius;
  uniform float uSoftness;
  uniform float uStrength;
  varying vec2 vUv;
  ${Te}
  void main() {
    vec2 px = (vUv - 0.5) * uSize;
    float d = sdRoundRect(px, uBox * 0.5, uRadius);
    float shade = 1.0 - smoothstep(-uSoftness * 0.35, uSoftness, d);
    gl_FragColor = vec4(0.0, 0.0, 0.0, shade * shade * uStrength);
  }
`,et=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    // Clip space directly: a backdrop, not an object, so the camera never
    // moves it and it can never be clipped or put out of frame.
    gl_Position = vec4(position.xy * 2.0, 0.9999, 1.0);
  }
`,tt=`
  uniform vec2 uResolution;
  uniform float uScroll;
  uniform float uPresence;
  uniform float uTime;
  uniform vec3 uWashA;
  uniform vec3 uWashB;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  float wash(vec2 q, vec2 centre, float reach) {
    vec2 k = (q - centre) / reach;
    return exp(-dot(k, k));
  }

  void main() {
    float aspect = uResolution.x / uResolution.y;
    vec2 q = vec2((vUv.x - 0.5) * aspect, vUv.y);

    // Ink, not black: a blue-green night, lighter overhead.
    vec3 color = mix(vec3(0.024, 0.031, 0.043), vec3(0.047, 0.063, 0.082), vUv.y);

    // Two slow washes in the hub's colours, on a much slower parallax than the
    // page, so they read as far away.
    float travel = uScroll / uResolution.y * 0.22;
    // Each wash sways up and down its own side of the frame as the page moves
    // and never leaves it. They used to travel with the scroll, which carried
    // the teal one — the light in the lower left — off the bottom of the screen
    // just before the last section, as if it had been switched off.
    float teal = 0.3 + 0.16 * sin(travel * 2.6 + 0.9);
    float amber = 0.7 + 0.14 * sin(travel * 2.1 + 2.4);
    color += uWashA * wash(q, vec2(-0.48 * aspect, teal), 0.62) * 0.55;
    color += uWashB * wash(q, vec2(0.52 * aspect, amber), 0.55) * 0.42;

    // Dithered in floats. A slow gradient across a dark field is exactly what
    // eight bits per channel cannot hold without banding into rings.
    color += (hash(gl_FragCoord.xy + fract(uTime * 7.0)) - 0.5) / 255.0;

    gl_FragColor = vec4(color * uPresence, uPresence);
  }
`,ot=`
  attribute float aSize;
  attribute float aSeed;
  attribute float aDepth;
  uniform float uTime;
  uniform float uScroll;
  uniform float uHeight;
  uniform float uDistance;
  uniform float uPixelRatio;
  uniform float uPresence;
  varying float vAlpha;
  varying float vTone;
  void main() {
    float span = uHeight * 2.4;
    float parallax = mix(0.12, 0.85, aDepth);
    float rise = uTime * mix(4.0, 14.0, aSeed);
    float y = mod(position.y - uScroll * parallax + rise, span) - span * 0.5;
    float x = position.x + sin(uTime * 0.21 + aSeed * 6.2831) * mix(10.0, 26.0, aDepth);
    float z = mix(-1500.0, 160.0, aDepth);
    vec4 view = modelViewMatrix * vec4(x, y, z, 1.0);
    gl_Position = projectionMatrix * view;
    gl_PointSize = aSize * uPixelRatio * uDistance / max(-view.z, 1.0);
    float twinkle = 0.55 + 0.45 * sin(uTime * mix(0.5, 1.4, aSeed) + aSeed * 40.0);
    // The nearest few are big and soft — out-of-focus foreground — so they get
    // much less opacity to go with the size.
    float focus = aDepth > 0.93 ? 0.18 : 1.0;
    vAlpha = mix(0.25, 0.9, aDepth) * twinkle * focus * uPresence;
    vTone = aSeed;
  }
`,at=`
  varying float vAlpha;
  varying float vTone;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float light = smoothstep(0.5, 0.0, d);
    light *= light;
    vec3 gold = vec3(1.0, 0.84, 0.56);
    vec3 teal = vec3(0.58, 0.96, 0.9);
    vec3 color = vTone < 0.4 ? gold : (vTone < 0.75 ? teal : vec3(1.0));
    gl_FragColor = vec4(color, light * vAlpha * 0.55);
  }
`,nt=`
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uPhase;
  uniform float uPresence;
  varying vec2 vUv;
  void main() {
    float across = (vUv.x - 0.5) * 2.0;
    float core = exp(-across * across * 5.5);
    float breathe = 0.72 + 0.28 * sin(vUv.y * 7.0 + uTime * 0.5 + uPhase)
      * sin(vUv.y * 2.7 - uTime * 0.3 + uPhase * 1.7);
    float ends = smoothstep(0.0, 0.3, vUv.y) * smoothstep(1.0, 0.6, vUv.y);
    gl_FragColor = vec4(uColor, core * breathe * ends * 0.17 * uPresence);
  }
`,st=`
  uniform vec2 uSize;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xy * uSize, 0.0, 1.0);
  }
`;function R(n,s,r){return Math.min(Math.max(n,s),r)}function X(n,s,r){return n+(s-n)*r}function H(n,s,r,a){return n+(s-n)*(1-Math.exp(-r*a))}function it(n,s,r){const a=R((r-n)/(s-n),0,1);return a*a*(3-2*a)}function rt(n){let s=n>>>0;return()=>(s=s*1664525+1013904223>>>0,s/4294967296)}function ut(n,s,r){const a=-n/2,l=-s/2,u=Math.min(r,n/2,s/2),m=new He;return m.moveTo(a+u,l),m.lineTo(a+n-u,l),m.quadraticCurveTo(a+n,l,a+n,l+u),m.lineTo(a+n,l+s-u),m.quadraticCurveTo(a+n,l+s,a+n-u,l+s),m.lineTo(a+u,l+s),m.quadraticCurveTo(a,l+s,a,l+s-u),m.lineTo(a,l+u),m.quadraticCurveTo(a,l,a+u,l),m}function lt(n,s){return new Promise(r=>{n.load(s,a=>{a.colorSpace=ye,r(a)},void 0,()=>r(null))})}function ct(){const n=new be;n.add(new z(new Ge(20,14,20),new pe({color:1316637,side:Oe})));const s=(u,m,k,x)=>new z(new W(u,m),new pe({color:new I(k).multiplyScalar(x)})),r=s(4,12,16774110,5);r.position.set(-7,1,2),r.rotation.y=Math.PI/2;const a=s(3,10,12578800,4);a.position.set(7,-1,-2),a.rotation.y=-Math.PI/2;const l=s(10,3,16777215,2.2);return l.position.set(0,6.8,0),l.rotation.x=Math.PI/2,n.add(r,a,l),n}async function mt(n){const{canvas:s,reducedMotion:r}=n,a=n.palette??$e,l=()=>n.scrollAdjust?n.scrollAdjust(ge()):ge();let u;try{u=new De({canvas:s,antialias:!0,alpha:!0,powerPreference:"high-performance"})}catch{return!1}if(!u.getContext())return!1;const m=window.innerWidth<860||window.matchMedia("(pointer: coarse)").matches,k=Math.min(window.devicePixelRatio||1,m?Ye:Ie);u.setPixelRatio(k),u.setClearColor(0,0),u.outputColorSpace=ye;const x=new be,E=new Fe(Se,1,10,8e3),te=new Le(u);x.environment=te.fromScene(ct(),.03).texture,te.dispose();const Ae=new Xe,Me=Math.min(u.capabilities.getMaxAnisotropy(),8);let y=window.innerWidth,c=window.innerHeight,b=1;const B=new z(new W(1,1),new L({vertexShader:et,fragmentShader:tt,uniforms:{uResolution:{value:new P(y,c)},uScroll:{value:0},uPresence:{value:0},uTime:{value:0},uWashA:{value:new I().setRGB(a.washA[0],a.washA[1],a.washA[2])},uWashB:{value:new I().setRGB(a.washB[0],a.washB[1],a.washB[2])}},transparent:!0,depthTest:!1,depthWrite:!1}));B.frustumCulled=!1,B.renderOrder=-100,x.add(B);const oe=[],Re=[{x:-.43,z:-700,width:150,colour:a.beams[0],phase:0},{x:-.24,z:-1100,width:110,colour:a.beams[1],phase:1.7},{x:.27,z:-950,width:130,colour:a.beams[2],phase:3.1},{x:.46,z:-650,width:160,colour:a.beams[3],phase:4.4}];for(const t of Re){const o=new z(new W(1,1),new L({vertexShader:st,fragmentShader:nt,uniforms:{uSize:{value:new P(1,1)},uColor:{value:new I(t.colour)},uTime:{value:0},uPhase:{value:t.phase},uPresence:{value:0}},transparent:!0,depthWrite:!1,blending:me}));o.renderOrder=-90,o.frustumCulled=!1,x.add(o),oe.push({mesh:o,x:t.x,z:t.z,width:t.width,phase:t.phase})}const T=window.innerWidth<860?320:620,C=new he,Pe=new Float32Array(T*3),ae=new Float32Array(T),ne=new Float32Array(T),q=new Float32Array(T),se=new Float32Array(T),U=rt(21);for(let t=0;t<T;t+=1){se[t]=(U()-.5)*2.6;const o=U();q[t]=o,ne[t]=U(),ae[t]=o>.93?X(18,34,U()):X(1.6,5.2,U())}C.setAttribute("position",new V(Pe,3)),C.setAttribute("aSize",new V(ae,1)),C.setAttribute("aSeed",new V(ne,1)),C.setAttribute("aDepth",new V(q,1));const _=new L({vertexShader:ot,fragmentShader:at,uniforms:{uTime:{value:0},uScroll:{value:0},uHeight:{value:c},uDistance:{value:1},uPixelRatio:{value:k},uPresence:{value:0}},transparent:!0,depthWrite:!1,blending:me}),Y=new We(C,_);Y.frustumCulled=!1,Y.renderOrder=-70,x.add(Y);const j=[];await Promise.all(n.frames.map(async(t,o)=>{const d=t.querySelector("img");if(!d)return;const v=await lt(Ae,d.currentSrc||d.src);if(!v)return;v.anisotropy=Me;const A=v.image,w=new ke,S=new z(new he,new qe({color:16777215,map:v,emissive:16777215,emissiveMap:v,emissiveIntensity:.45,metalness:0,roughness:.4,clearcoat:1,clearcoatRoughness:.08,envMapIntensity:.8,transparent:!0,opacity:0})),e=new z(new W(1,1,36,36),new L({vertexShader:Ke,fragmentShader:Qe,uniforms:{uMap:{value:v},uSize:{value:new P(1,1)},uRadius:{value:20},uCover:{value:new P(1,1)},uReveal:{value:0},uTilt:{value:new P},uLift:{value:0},uDefocus:{value:0}},transparent:!0,depthTest:!1}));e.position.z=.8,e.renderOrder=2,e.frustumCulled=!1;const i=new z(new W(1,1),new L({vertexShader:Je,fragmentShader:Ze,uniforms:{uSize:{value:new P(1,1)},uBox:{value:new P(1,1)},uRadius:{value:24},uSoftness:{value:60},uStrength:{value:0}},transparent:!0,depthWrite:!1}));i.renderOrder=-10,i.frustumCulled=!1,w.add(i,S,e),x.add(w),j.push({element:t,image:d,group:w,slab:S,face:e,shadow:i,width:0,height:0,radius:20,side:o%2===0?-1:1,enter:0,enterSpeed:0,lag:0,lagSpeed:0,tiltX:0,tiltY:0,lift:0}),t.classList.add("is-3d");const h=A.naturalWidth/A.naturalHeight||1;e.userData.imageAspect=h}));function ze(t,o,d){t.width=o,t.height=d,t.radius=Number.parseFloat(getComputedStyle(t.element).borderTopLeftRadius)||20;const v=t.face.material.uniforms;v.uSize.value.set(o,d),v.uRadius.value=t.radius;const A=o/d,w=t.face.userData.imageAspect||1;A>w?v.uCover.value.set(1,w/A):v.uCover.value.set(A/w,1);const S=v.uCover.value;t.slab.geometry.dispose();const e=new Ve(ut(o,d,t.radius),{depth:je,bevelEnabled:!0,bevelThickness:xe,bevelSize:xe,bevelSegments:4,curveSegments:10});e.translate(0,0,-20.5);const i=e.getAttribute("position"),h=e.getAttribute("uv");for(let g=0;g<i.count;g+=1)h.setXY(g,R(i.getX(g)/o*S.x+.5,.003,.997),R(i.getY(g)/d*S.y+.5,.003,.997));h.needsUpdate=!0,t.slab.geometry=e;const f=140,M=t.shadow.material.uniforms;M.uSize.value.set(o+f*2,d+f*2),M.uBox.value.set(o*.92,d*.92),M.uRadius.value=t.radius+8,t.shadow.position.z=-108}function ie(){y=window.innerWidth,c=window.innerHeight,u.setSize(y,c,!1),E.aspect=y/c,b=c/2/Math.tan(Se*Math.PI/360),E.position.set(0,0,b),E.near=10,E.far=b+4e3,E.updateProjectionMatrix(),B.material.uniforms.uResolution.value.set(y,c),_.uniforms.uHeight.value=c,_.uniforms.uDistance.value=b;const t=C.getAttribute("position");for(let o=0;o<T;o+=1){const d=X(-1500,160,q[o]),v=(b-d)/b;t.setX(o,se[o]*y*.5*v),t.setY(o,o/T*c*2.4+q[o]*97)}t.needsUpdate=!0}const p={x:-9999,y:-9999,inside:!1};let re=l(),N=0,$=!1,K=0;const Ee=performance.now();function Ce(t){const o=t.element.getBoundingClientRect();return o.bottom>-c*.3&&o.top<c*1.3}function ue(){return document.hidden?!1:we(l(),c)>.001||j.some(Ce)}function le(t){if(!ue()){$=!1,u.clear();return}requestAnimationFrame(le);const o=Math.min((t-(K||t))/1e3,.05);K=t;const d=r?0:(t-Ee)/1e3,v=l(),A=o>0?(v-re)/o:0;re=v,N=H(N,r?0:A,9,o);const w=we(v,c),S=B.material.uniforms;S.uScroll.value=v,S.uPresence.value=w,S.uTime.value=d,_.uniforms.uTime.value=d,_.uniforms.uScroll.value=v,_.uniforms.uPresence.value=w;for(const e of oe){const i=(b-e.z)/b,h=c*1.9*i,f=c*3.2*i,M=((-v*.18+e.phase*400)%f+f)%f-f/2;e.mesh.position.set(e.x*y*i,M,e.z),e.mesh.rotation.z=Math.sin(d*.08+e.phase)*.05+e.x*.12;const g=e.mesh.material.uniforms;g.uSize.value.set(e.width*i,h),g.uTime.value=d,g.uPresence.value=w}for(const e of j){const i=e.element.getBoundingClientRect(),h=i.width,f=i.height;if(!h||!f)continue;(Math.abs(h-e.width)>.5||Math.abs(f-e.height)>.5)&&ze(e,h,f);const M=i.bottom>-f*.6&&i.top<c+f*.6;if(e.group.visible=M,!M)continue;const g=R((c-i.top)/(c*.5+f*.35),0,1);r?(e.enter=1,e.enterSpeed=0):(e.enterSpeed+=(30*(g-e.enter)-11*e.enterSpeed)*o,e.enter+=e.enterSpeed*o);const G=-(1-e.enter)*Ne,_e=r?0:R(-N*.018,-38,38);e.lagSpeed+=(30*(_e-e.lag)-11.5*e.lagSpeed)*o,e.lag+=e.lagSpeed*o;const ce=i.left+h/2,Q=i.top+f/2,J=p.inside&&p.x>=i.left&&p.x<=i.right&&p.y>=i.top&&p.y<=i.bottom,Be=J?R((p.x-ce)/(h/2),-1,1):0,Ue=J?R((Q-p.y)/(f/2),-1,1):0,ve=r?0:.16;e.tiltY=H(e.tiltY,Be*ve,7,o),e.tiltX=H(e.tiltX,-Ue*ve,7,o),e.lift=H(e.lift,J&&!r?1:0,6,o);const Z=r?0:R((Q-c/2)/(c/2+f/2),-1,1),de=e.side*Z*.16,ee=f/2;e.group.position.set(ce-y/2,c/2-Q-ee+ee*Math.cos(G)+e.lag,ee*Math.sin(G)+e.lift*36-Z*Z*40),e.group.rotation.set(G+e.tiltX+e.lagSpeed*9e-4,de+e.tiltY,0);const F=it(0,.5,e.enter);e.slab.material.opacity=F,e.slab.visible=F>.001;const O=e.face.material.uniforms;O.uReveal.value=F,O.uTilt.value.set(de+e.tiltY,G+e.tiltX),O.uLift.value=e.lift,O.uDefocus.value=(1-F)*4.5;const fe=e.shadow.material.uniforms;fe.uStrength.value=F*X(.62,.42,e.lift),fe.uSoftness.value=X(46,84,e.lift),e.shadow.position.x=e.tiltY*120,e.shadow.position.y=-26-e.lift*22+e.tiltX*90}u.render(x,E)}function D(){$||!ue()||($=!0,K=0,requestAnimationFrame(le))}return ie(),window.addEventListener("resize",()=>{ie(),D()},{passive:!0}),window.addEventListener("scroll",D,{passive:!0}),window.addEventListener("pointermove",t=>{p.x=t.clientX,p.y=t.clientY,p.inside=!0,D()},{passive:!0}),document.documentElement.addEventListener("pointerleave",()=>{p.inside=!1}),document.addEventListener("visibilitychange",D),D(),!0}export{mt as mountStory3D};
