var fMain;
var fs;
var fsSize=150;
var frameStep=2;
var fcs;
var fch;
var img;
var button;
var started=false;

var capture;
var nothing;


var message="By Dave Webb @crispysmokedweb"
+" // "
+"A two minute journey into recent moments, nearby spaces that are neither here, nor now."
+" // "
+"An instantaneous action occupies a time and a space that never exist again. When we observe, we are really examining our sense impressions and recollections, plus prior assumptions. In these times when video meetings have become a norm for many more of us, there is that sense that here and now do not have a single objective point. That instant is divided between my blink and you observing it, from another place a few milliseconds later. What happen in the time between those two moments? Where did the blink, in fact occur? .My now is someone else’s past. Their now is my future. We are meeting, not in a place, but as an arrangement of electrons in a server. Here and Now are not what we thought they were."
+" // "
+"This does not work on mobile, sorry. You will need a desktop browser with a webcam";
var reader, title;

function preload(){
  fMain = loadFont("Bitter-Regular.ttf");
}

function fillArrayWithNumbers(n) {
  var arr = Array.apply(null, Array(n));
  return arr.map(function (x, i) { return {i:i}});
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  var winRef=min(windowWidth, windowHeight);
  // createCanvas(winRef, winRef);
  fs=new FrameStore(fsSize);
  iw=winRef/2;
  ih=winRef/2;
  img=createImage(iw,ih);
  button=new Button(winRef*0.8,winRef*0.125,winRef*0.15,'other');

  capture = createCapture(VIDEO);
  capture.hide();
  capture.elt.setAttribute('playsinline', '');
  fcs=new FrameChunksSlit(fs,(width-winRef)/2,0,winRef,winRef);
  fch=new FrameChunksShuffle(fs,(width-winRef)/2,0,winRef,winRef);
  reader=new Reader(message,winRef*0.2,winRef*0.25,winRef*0.7,winRef*0.7,0.035);
  title=new Reader("OTHERwhere ELSEwhen",winRef*0.2,winRef*0,winRef*0.5,winRef*0.25,0.15);
}

function draw() {
  if(capture && frameCount%frameStep===0){
    var ch=capture.height;
    var cw=capture.width;
    img.copy(capture, cw*0.5-ch*0.5,0,ch, ch, 0, 0, iw, ih);
    // console.log()
    fs.addFrame(img);
  }
  background(40);
  if(started){
    fch.run();
  } else {
    title.show(true);
    reader.show(false);
    button.show();

  }

}

function mouseClicked(){
  if(button.click()){
    started=true;
  }
}

function Button(x,y,s,label){
  var hover=false;
  
  this.click=function(){
    return hover;
  };
  
  this.show=function(){
    hover=dist(mouseX, mouseY,x,y)<s/2;
    push();
    translate(x,y);
    fill(128);
    if(hover){
      fill(0,200,100);
    }
    stroke(255);
    strokeWeight(s*0.02);
    ellipse(0,0,s);
    fill(255);
    noStroke();
    textSize(s/3);
    textAlign(CENTER, CENTER);
    text(label,0,-s*0.1);
    pop();
  }
}

function Reader(message,x,y,w,h,s){
  var words;
  var textMaxY=0;
  var textSizeRel=s;
  var yOff=0;
  
  analyseText(w,h);
  
  this.show=function(ca){
    renderText(x,y,w,h,yOff,ca);
  };
  
  function analyseText(w,h){
    var splitWords=message.split(' ');
    var ts=w*textSizeRel;
    var pitch=ts*1.2;
    var space=ts*0.25;
    var xOff=0;
    var yOff=pitch;
    textFont(fMain);
    fill(40);
    noStroke();
    textSize(ts);
    textAlign(CENTER, CENTER);
    words=splitWords.map(function(word){
      if(word==="/"){
        yOff+=pitch;
        xOff=0;
        word=" ";
      } else if(word==="//"){
        yOff+=pitch*2;
        xOff=0;
        word=" ";
      }
        var wordBits={word:word};
        var tb=fMain.textBounds(word,0,0,ts);
        wordBits.w=tb.w;
        wordBits.h=tb.h;
        wordBits.ts=ts;
        var tcx=tb.w/2;
        var tcy=tb.h/2;
        // console.log(word+tb.w);
        if(xOff+space+tb.w>w){
          yOff+=pitch;
          xOff=0;
          wordBits.x=xOff+tcx;
          wordBits.y=yOff;
          xOff+=tb.w;
        } else {
          xOff+=space;
          wordBits.x=xOff+tcx;
          wordBits.y=yOff;
          xOff+=tb.w;
        }
        wordBits.flipH=false;//random(10)<1.5;
        wordBits.flipV=false;//random(10)<2;
        wordBits.flipCycle=random(0.02,0.07);
        wordBits.noiseShift=false;//random(10)<5;
        return wordBits;
      
    });
    textMaxY=yOff+pitch;
  }
  
  function renderText(x,y,w,h,yOff,ca){
    push();
    translate(x,y);
    blendMode(BLEND);
    fill(0);
    rectMode(CORNER);
    noStroke();
    rect(0,0,w,h);
    var ts=w*textSizeRel;
    blendMode(ADD);
    textFont(fMain);
    fill(255);
    noStroke();
    textSize(ts);
    textAlign(CENTER, CENTER);
    words.forEach(function(word){
      placeWord(word,x,y,w,h,yOff,ca);
    });
    pop();
  }
  
  function placeWord(word,x,y,w,h,yOff,ca){
    if(word.y-yOff>-w*textSizeRel && word.y-yOff<h+w*textSizeRel){
      push();
      translate(word.x,word.y-yOff);
      var shift=(noise(word.x/100, word.y/10+frameCount/10)-0.5)*word.ts*0.5;
  
      var sh=word.flipH?sin(frameCount*word.flipCycle):1;
      var sv=word.flipV?sin(frameCount*word.flipCycle*0.7):1;
      // if(!word.flipH && !word.flipV){
      //   var ns=noise(word.x/150, word.y/150+frameCount/250);
      //   sh=0.15+ns*1.3;
      //   sv=0.15+ns*1.3;
      // }
      if(word.noiseShift){
        var nx=noise(word.x/100, word.y/100+frameCount/200)-0.5;
        var ny=noise(7+word.x/110, word.y/90+frameCount/185)-0.5;
        translate(nx*word.ts, ny*word.ts);
      } else {
        scale(sh,sv);
      }
      if(ca){
        fill(255,0,0);
        text(word.word,0,word.ts*-0.2-shift);
        fill(0,255,0);
        text(word.word,-shift*0.707,word.ts*-0.2+shift*0.35);
        fill(0,0,255);
        text(word.word,shift*0.707,word.ts*-0.2+shift*0.35);
      } else {
        fill(255);
        text(word.word,0,word.ts*-0.2-shift);
      }
      pop();
    }
  }
}

function FrameChunksShuffle(fs,x,y,dw,dh){
  var numFrames=49;
  var numSteps=7;
  var hSteps=numSteps;
  var hStep;
  var vStep;
  var frameOrder=fillArrayWithNumbers(numFrames);
  var frameStep=2;
  var paused=false;
  var slits;
  var myCount=0;
  
  var slitStarted=false;
  hStep=dw/hSteps;
  vStep=hStep;
  frameOrder.forEach(function(fr,i){
    // translate((i%hSteps+0.5)*hStep, (floor(i/hSteps)+0.5)*vStep);
    var tw=1*1/hSteps;//random(0.1,1);
    var xOff=(i%hSteps)*1/hSteps;//random(1-tw);
    var yOff=floor(i/hSteps)*1/hSteps;//random(1-tw);
    fr.slit=false;//random(10)<1;
    fr.x=xOff;
    fr.y=yOff;
    fr.w=tw;
    fr.h=tw;
    fr.occW=1;
    fr.occH=1;
    fr.i=0;
    fr.ho=1;//random(10)<5?-1:1;
    fr.rot=0;//floor(random(4));
    fr.col=color(random(255),random(255),random(255));
    fr.tint=false;random(10)<1;
  });
  
  this.run=function(){
    myCount++;
    var fl=fs.getSize();
    imageMode(CENTER);
    rectMode(CENTER);
    // if(fl>0){
    //   image(fs.getFrame(0), 0,0);
    // }
    push();
    translate(x,y);
    
    for(var i=0; i<numFrames; i++){
      var foi=frameOrder[i].i;
      // var d=dist(hSteps/2,hSteps/2,i%hSteps,floor(i/hSteps));
      // var frd=floor(d)*5;
        
      if(foi<fl){//foi<fl
        var fi=fs.getFrame((foi));//foi
        // console.log(fi.width, fi.height, hStep, vStep);
        push();
        translate((i%hSteps+0.5)*hStep, (floor(i/hSteps)+0.5)*vStep);
        // console.log(d);
        rotate(frameOrder[i].rot*PI/2);
        scale(frameOrder[i].ho,1);
        if(frameOrder[i].slit){
          fi=fs.getFrame(0);
          image(fi, -hStep/4,0, hStep/2, vStep,
              0, 0, fi.width/2, fi.height);
          image(fs.getSlits(),hStep/4,0,hStep/2, vStep, 0,0,fi.width/4,fi.height);
        } else {
          image(fi, 0,0, hStep*frameOrder[i].occW, vStep*frameOrder[i].occH,
              fi.width*frameOrder[i].x, fi.height*frameOrder[i].y, fi.width*frameOrder[i].w, fi.height*frameOrder[i].h );
          if(frameOrder[i].tint){
            fill(red(frameOrder[i].col),green(frameOrder[i].col),blue(frameOrder[i].col),100);
            noStroke();
            rect(0,0,hStep,vStep);
          }
          // fill(255,0,200);
          // rect(0,0,hStep,vStep);
        }
        pop();
      }
      // var tw=(1.1+sin((frameCount+i*10)*PI/500))*1/hSteps;
      // frameOrder[i].w=tw;
      // frameOrder[i].h=tw;
      
    }
    pop();
    if(myCount>120 && myCount%10===0){
      var i=floor(random(frameOrder.length));
      mutate(i);
    }
  };
  
  function mutate(i){
    var fr=frameOrder[i];
    var tw=random(0.6,1)*1/hSteps;
    frameOrder[i].w=tw;
    frameOrder[i].h=tw;
    var xOff=(i%hSteps+0.5)*1/hSteps-tw/2;//random(1-tw);
    var yOff=(floor(i/hSteps)+0.5)*1/hSteps-tw/2;//random(1-tw);
    frameOrder[i].x=xOff;
    frameOrder[i].y=yOff;
    fr.ho=random(10)<5?-1:1;
    fr.rot=floor(random(4));
    frameOrder[i].i=floor(random(fs.getSize()));
  }
}

function FrameChunksSlit(fs,x,y,dw,dh){
  var numSteps=2;
  var numFrames=4;
  var numSteps=2;
  var hSteps=numSteps;
  var hStep;
  var vStep;
  var frameOrder=fillArrayWithNumbers(numFrames);
  // console.log(frameOrder);
  var frameStep=2;
  var paused=false;
  var slits;
  var slitStarted=false;
  // var img;

  hStep=dw/hSteps;
  vStep=hStep
  // iw=dw/2;
  // ih=dh/2;
  // img=createImage(iw,ih);
  frameOrder.forEach(function(fr,i){
    var tw=random(0.1,1);
    var xOff=random(1-tw);
    var yOff=random(1-tw);
    fr.slit=true;//random(10)<2;
    fr.x=xOff;
    fr.y=yOff;
    fr.w=tw;
    fr.h=tw;
    fr.ho=i<2?(i%2==0?1:-1):(i%2==0?-1:1);//random(10)<5?-1:1;
    fr.rot=floor(i/2)%2==0?0:2;;//i<2?0:i==2?3:1;
    // fr.rot=i<2?0:i==2?3:1;//floor(i/2)%2==0?0:2;//floor(random(4));
    fr.col=color(random(255),random(255),random(255));
    fr.tint=random(10)<1;
  });
  
  this.run=function(){
    var fl=fs.getSize();
    imageMode(CENTER);
    // if(fl>0){
    //   image(fs.getFrame(0), 0,0);
    // }
    push();
    translate(x,y);
    for(var i=0; i<numFrames; i++){
      var foi=0;//frameOrder[i].i;
      if(foi<fl){
        var fi=fs.getFrame(foi);
        // console.log(fi.width, fi.height, hStep, vStep);
        push();
        translate((i%hSteps+0.5)*hStep, (floor(i/hSteps)+0.5)*vStep);
        rotate(frameOrder[i].rot*PI/2);
        scale(frameOrder[i].ho,1);
        if(frameOrder[i].slit){
          fi=fs.getFrame(0);
          image(fi, 0,0, hStep, vStep,
              0, 0, fi.width, fi.height);
          image(fs.getSlits(),hStep/4,0,hStep/2, vStep, 0,0,fi.width/4,fi.height);
        } else {
        // if(frameOrder[i].tint){
        //   tint(frameOrder[i].col);
        //   // filter(INVERT);
        // } else {
        //   tint(255);
        // }
          image(fi, 0,0, hStep, vStep,
              fi.width*frameOrder[i].x, fi.height*frameOrder[i].y, fi.width*frameOrder[i].w, fi.height*frameOrder[i].h );
        }
        pop();
      }
  
    }
    pop();
  };
}