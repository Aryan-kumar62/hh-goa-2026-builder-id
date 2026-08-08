import React, {useEffect, useRef, useState} from "react";
import heic2any from "heic2any";
import {Camera, Upload, Download, Share2, Sparkles, RotateCcw, X} from "lucide-react";

const TITLES = [
  "Terminal Wizard","Beachside Builder","Ship-It Surfer","Coconut CTO",
  "Monsoon Hacker","Future Maker","AI Alchemist","Goa Code Shaman"
];

const TEMPLATE = "/hh-goa-reference.png";

export default function App(){
  const [mode,setMode]=useState("id");
  const [file,setFile]=useState(null);
  const [url,setUrl]=useState("");
  const [name,setName]=useState("Amit Kumar");
  const [role,setRole]=useState("Software Development");
  const [stack,setStack]=useState("COCONUT  ·  VS CODE  ·  LO-FI BEATS");
  const [title,setTitle]=useState("Terminal Wizard");
  const [shipping,setShipping]=useState("Building the Future");
  const [builderId,setBuilderId]=useState("#HH-GOA-9884");
  const [generated,setGenerated]=useState("");
  const [busy,setBusy]=useState(false);
  const [camera,setCamera]=useState(false);
  const [captionCopied,setCaptionCopied]=useState(false);
  const inputRef=useRef(), videoRef=useRef(), streamRef=useRef(), canvasRef=useRef();

  useEffect(()=>()=>{if(url)URL.revokeObjectURL(url);stopCamera()},[url]);

  function stopCamera(){
    streamRef.current?.getTracks()?.forEach(t=>t.stop());
    streamRef.current=null; setCamera(false);
  }

  async function normalize(f){
    if(!f)return null;
    const n=f.name.toLowerCase();
    if(n.endsWith(".heic")||n.endsWith(".heif")||f.type==="image/heic"||f.type==="image/heif"){
      const out=await heic2any({blob:f,toType:"image/jpeg",quality:.94});
      return Array.isArray(out)?out[0]:out;
    }
    return f;
  }

  async function acceptFile(f){
    if(!f)return;
    if(f.size>15*1024*1024){alert("Maximum file size is 15MB.");return;}
    try{
      const nf=await normalize(f);
      const u=URL.createObjectURL(nf);
      if(url)URL.revokeObjectURL(url);
      setFile(nf);setUrl(u);setGenerated("");
    }catch(e){console.error(e);alert("Could not read this photo. Try JPG, PNG or HEIC.");}
  }

  async function startCamera(){
    try{
      const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:"user"},audio:false});
      streamRef.current=s;setCamera(true);
      setTimeout(()=>{if(videoRef.current){videoRef.current.srcObject=s;videoRef.current.play()}},50);
    }catch(e){alert("Camera permission was blocked. Please allow camera access.");}
  }

  function takePhoto(){
    const v=videoRef.current,c=document.createElement("canvas");
    c.width=v.videoWidth||1280;c.height=v.videoHeight||720;
    c.getContext("2d").drawImage(v,0,0,c.width,c.height);
    c.toBlob(b=>{acceptFile(new File([b],"webcam.jpg",{type:"image/jpeg"}));stopCamera()},"image/jpeg",.94);
  }

  function cover(ctx,img,x,y,w,h){
    const s=Math.max(w/img.width,h/img.height);
    const dw=img.width*s,dh=img.height*s;
    ctx.drawImage(img,x+(w-dw)/2,y+(h-dh)/2,dw,dh);
  }

  function fitText(ctx,text,maxWidth,start,weight="900",family="Arial"){
    let size=start;
    while(size>14){
      ctx.font=`${weight} ${size}px ${family}`;
      if(ctx.measureText(text).width<=maxWidth)return size;
      size--;
    }
    return 14;
  }

  function center(ctx,text,x,y,maxWidth,start,color="#123d28",weight="900",family="Arial"){
    const s=fitText(ctx,text,maxWidth,start,weight,family);
    ctx.fillStyle=color;ctx.font=`${weight} ${s}px ${family}`;
    ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(text,x,y);
  }

  function wrapCenter(ctx,text,x,y,maxWidth,start,color="#d71957",maxLines=2){
    const words=text.split(/\s+/);let lines=[],line="";
    ctx.font=`900 ${start}px Arial`;
    for(const word of words){
      const test=line?line+" "+word:word;
      if(ctx.measureText(test).width>maxWidth&&line){lines.push(line);line=word}
      else line=test;
    }
    if(line)lines.push(line);
    lines=lines.slice(0,maxLines);
    const lineH=start*1.03;
    ctx.fillStyle=color;ctx.textAlign="center";ctx.textBaseline="middle";
    lines.forEach((l,i)=>ctx.fillText(l,x,y+(i-(lines.length-1)/2)*lineH));
  }

  function clearArea(ctx,x,y,w,h,color="#fff5df"){
    ctx.fillStyle=color;ctx.fillRect(x,y,w,h);
  }

  async function generate(){
    if(!url){alert("Upload a photo first.");return;}
    setBusy(true);
    try{
      const [img,template]=await Promise.all([
        new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src=url}),
        new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src=TEMPLATE})
      ]);

      const c=canvasRef.current,ctx=c.getContext("2d");
      const W=1185,H=1779;
      c.width=W;c.height=H;

      // 1) Draw the supplied HH Goa artwork exactly as the base.
      ctx.drawImage(template,0,0,W,H);

      // 2) Replace only the sample portrait. The original decorative ring remains visible.
      // Coordinates are matched to the supplied reference image.
      const cx=592,cy=777,r=253;
      ctx.save();
      ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.clip();
      cover(ctx,img,cx-r,cy-r,2*r,2*r);
      ctx.restore();

      // Repaint the name plate interior, keeping the original gold/green border.
      clearArea(ctx,230,1106,725,83,"#063d20");
      center(ctx,(name||"YOUR NAME").toUpperCase(),592,1147,650,40,"#fffaf0","900","Arial");

      // Repaint the role pill interior.
      clearArea(ctx,310,1224,565,55,"#ffc928");
      center(ctx,(role||"SOFTWARE DEVELOPMENT").toUpperCase(),592,1252,500,23,"#d71957","900","Georgia");

      // Cover lower content area so user fields are cleanly replaced.
      clearArea(ctx,55,1285,1075,375,"#fff5df");

      // Preserve the three-column visual structure from the reference.
      ctx.strokeStyle="#d71957";ctx.lineWidth=2;ctx.setLineDash([8,8]);
      [393,790].forEach(x=>{ctx.beginPath();ctx.moveTo(x,1300);ctx.lineTo(x,1588);ctx.stroke()});
      ctx.setLineDash([]);

      // Left column — Builder Class + QR-style code.
      center(ctx,"✦  BUILDER CLASS  ✦",200,1316,320,17,"#123d28","900","Arial");
      wrapCenter(ctx,(title||"TERMINAL WIZARD").toUpperCase(),200,1375,300,28,"#d71957",2);

      // Deterministic QR-like graphic, matching the badge's square visual language.
      const qx=105,qy=1430,qs=170,n=21,cell=qs/n;
      ctx.fillStyle="#fff";ctx.fillRect(qx-7,qy-7,qs+14,qs+14);
      ctx.fillStyle="#075b38";
      const seed=[...(builderId||"HH-GOA-9884")].reduce((a,c)=>a+c.charCodeAt(0),0);
      function finder(px,py){
        ctx.fillRect(qx+px*cell,qy+py*cell,7*cell,7*cell);
        ctx.fillStyle="#fff";ctx.fillRect(qx+(px+1)*cell,qy+(py+1)*cell,5*cell,5*cell);
        ctx.fillStyle="#075b38";ctx.fillRect(qx+(px+2)*cell,qy+(py+2)*cell,3*cell,3*cell);
      }
      finder(0,0);finder(n-7,0);finder(0,n-7);
      for(let yy=0;yy<n;yy++)for(let xx=0;xx<n;xx++){
        if((xx<8&&yy<8)||(xx>=n-8&&yy<8)||(xx<8&&yy>=n-8))continue;
        if((xx*31+yy*17+seed+(xx^yy)*11)%13<6)
          ctx.fillRect(qx+xx*cell,qy+yy*cell,Math.ceil(cell),Math.ceil(cell));
      }

      // Middle column — Beach Bag.
      center(ctx,"✦  BEACH BAG  ✦",592,1316,320,17,"#123d28","900","Arial");
      center(ctx,"🥥   COCONUT",592,1370,310,20,"#123d28","800","Arial");
      center(ctx,"⌨   VS CODE",592,1415,310,20,"#123d28","800","Arial");
      center(ctx,"🎧   LO-FI BEATS",592,1460,310,20,"#123d28","800","Arial");
      center(ctx,(stack||"BUILD • SHIP • REPEAT").toUpperCase(),592,1525,320,15,"#123d28","900","Arial");

      // Right column — Currently Shipping + ID + barcode.
      center(ctx,"✦  CURRENTLY SHIPPING  ✦",985,1316,320,16,"#123d28","900","Arial");
      wrapCenter(ctx,(shipping||"BUILDING THE FUTURE").toUpperCase(),985,1378,320,27,"#d71957",2);
      center(ctx,"〰〰〰〰〰",985,1442,300,22,"#123d28","900","Arial");
      center(ctx,"BUILDER ID",985,1495,250,17,"#123d28","900","Arial");
      center(ctx,(builderId||"#HH-GOA-9884").toUpperCase(),985,1528,300,18,"#123d28","900","Arial");

      // Barcode.
      const bx=855,by=1550,bw=270,bh=65;
      ctx.fillStyle="#123d28";
      let pos=bx;
      const code=[...(builderId||"HHGOA2026")].map(ch=>ch.charCodeAt(0));
      let k=0;
      while(pos<bx+bw){
        const bar=1+(code[k%code.length]%4);
        ctx.fillRect(pos,by,bar,bh);
        pos+=bar+1+(code[(k+3)%code.length]%3);
        k++;
      }

      // Footer ribbon text is the only text on the original footer that we personalize.
      center(ctx,"✦  #FRAMEINGOA  ✦",592,1690,360,29,"#fffaf0","900","Arial");

      const data=c.toDataURL("image/png");
      setGenerated(data);
      return data;
    }catch(e){
      console.error(e);alert("Could not generate the card.");
    }finally{setBusy(false)}
  }

  async function download(){
    const d=generated||await generate();if(!d)return;
    const a=document.createElement("a");
    a.href=d;a.download=`HH-Goa-2026-${(name||"Builder").replace(/[^a-z0-9]+/gi,"-")}.png`;a.click();
  }

  async function share(){
    const d=generated||await generate();if(!d)return;
    const blob=await(await fetch(d)).blob();
    const f=new File([blob],"hh-goa-2026-builder-id.png",{type:"image/png"});
    const text=`Building in Goa, shipping from paradise 🌴⚡\n\n${name||"Builder"} — ${role||"Builder"}\n${title||"Builder"}\n\n#FrameInGoa #HHGoa2026`;
    try{
      if(navigator.share&&(!navigator.canShare||navigator.canShare({files:[f]}))){
        await navigator.share({title:"HH Goa 2026 Builder ID",text,files:[f]});return;
      }
    }catch(e){if(e?.name==="AbortError")return}
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,"_blank","noopener,noreferrer");
  }

  function reset(){
    stopCamera();
    if(url)URL.revokeObjectURL(url);
    setFile(null);setUrl("");setGenerated("");
    setName("Amit Kumar");setRole("Software Development");
    setStack("COCONUT  ·  VS CODE  ·  LO-FI BEATS");
    setTitle("Terminal Wizard");setShipping("Building the Future");setBuilderId("#HH-GOA-9884");
  }

  const caption=`Building in Goa, shipping from paradise 🌴⚡\n\n${name||"Builder"} — ${role||"Builder"}\n${title||"Builder"}\n\n#FrameInGoa #HHGoa2026`;

  return <div className="app">
    <header className="hero-head">
      <div className="mini-logo"><b>HH</b><span>GOA 2026</span></div>
      <div className="studio">2:47 PM<br/><b>STUDIO</b></div>
      <div className="hero-title">
        <div className="goa-script">गोवा</div>
        <h1>HACKER HOUSE</h1>
        <div className="hero-meta">GOA, INDIA&nbsp;&nbsp; · &nbsp;&nbsp;28 — 31 OCT 2026</div>
      </div>
      <div className="hero-right">BUILD IN GOA<br/><span>SHIP FROM PARADISE</span></div>
    </header>

    <main className="builder">
      <section className="upload-card">
        <div className="camera-symbol">⌾</div>
        <h2>UPLOAD YOUR PHOTO</h2>
        <p>or&nbsp; drag and drop here</p>
        {camera ? <div className="camera-box">
          <video ref={videoRef} playsInline muted/>
          <div className="camera-actions"><button onClick={takePhoto}>TAKE PHOTO</button><button onClick={stopCamera}><X size={18}/> CLOSE</button></div>
        </div> : <>
          <div className="upload-buttons">
            <button className="choose" onClick={()=>inputRef.current?.click()}>Choose Image <Upload size={17}/></button>
            <button className="webcam" onClick={startCamera}><Camera size={17}/> Webcam</button>
          </div>
          <div className="formats">PNG · JPG · HEIC · WEBP (MAX 15MB)</div>
        </>}
        <input ref={inputRef} hidden type="file" accept="image/*,.heic,.heif" onChange={e=>acceptFile(e.target.files?.[0])}/>
      </section>

      <section className="control-row">
        <button className={mode==="id"?"selected":""} onClick={()=>{setMode("id");setGenerated("")}}>BUILDER ID CARD</button>
        <button className={mode==="pfp"?"selected":""} onClick={()=>{setMode("pfp");setGenerated("")}}>PFP FRAME</button>
      </section>

      {mode==="id" && <section className="fields">
        <label>NAME<input value={name} onChange={e=>setName(e.target.value)} placeholder="Amit Kumar"/></label>
        <label>STACK / ROLE<input value={role} onChange={e=>setRole(e.target.value)} placeholder="Software Development"/></label>
        <label>STACK / BEACH BAG<input value={stack} onChange={e=>setStack(e.target.value)} placeholder="Coconut · VS Code · Lo-Fi Beats"/></label>
        <label>BUILDER TITLE<div className="title-input"><input value={title} onChange={e=>setTitle(e.target.value)}/><button onClick={()=>setTitle(TITLES[Math.floor(Math.random()*TITLES.length)])}><Sparkles size={17}/></button></div></label>
        <label>CURRENTLY SHIPPING<input value={shipping} onChange={e=>setShipping(e.target.value)} placeholder="Building the Future"/></label>
        <label>BUILDER ID<input value={builderId} onChange={e=>setBuilderId(e.target.value)} placeholder="#HH-GOA-9884"/></label>
      </section>}

      <section className="action-row">
        <button className="generate" disabled={!url||busy} onClick={generate}>{busy?"GENERATING...":"GENERATE MY CARD"} <Sparkles size={18}/></button>
        <button className="reset" onClick={reset}><RotateCcw size={16}/> RESET</button>
      </section>

      <section className="result-card">
        <div className="result-top"><span>YOUR HH GOA 2026 ID</span>{generated&&<b>READY ✓</b>}</div>
        <div className="result-stage">{generated?<img src={generated} alt="HH Goa 2026 generated ID card"/>:<div className="placeholder"><div>HH<br/>GOA<br/>2026</div><span>Upload a photo and generate your card</span></div>}</div>
        <div className="result-actions">
          <button onClick={download} disabled={!url}><Download size={18}/> DOWNLOAD PNG</button>
          <button onClick={share} disabled={!url}><Share2 size={18}/> SHARE TO X</button>
        </div>
        <div className="caption"><small>SHARE CAPTION</small><button onClick={()=>{navigator.clipboard?.writeText(caption);setCaptionCopied(true);setTimeout(()=>setCaptionCopied(false),1500)}}>{captionCopied?"COPIED":"COPY"}</button><p>{caption}</p></div>
      </section>
    </main>

    <footer><span>HACKER HOUSE GOA 2026</span><span>#FRAMEINGOA</span><span>BUILD · SHIP · REPEAT</span></footer>
    <canvas ref={canvasRef} hidden/>
  </div>
}
