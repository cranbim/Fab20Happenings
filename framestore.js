function FrameStore(numFrames, frameStep){
  var store=[];
  var slits=null;
  var temp;
  var maxStore=numFrames;
  
  this.getSize=function(){
    return store.length;
  };
  
  this.getFrame=function(idx){
    return store[idx];
  };
  
  this.addFrame=function(frame){
    store.unshift(frame.get());
    if(store.length>maxStore){
      store.pop();
    }
    addSlice(frame);
  };
  
  function addSlice(frame){
    if(slits===null){
      slits=createImage(frame.width,frame.height);
      
    }
    // console.log(frameCount);
    // temp=createImage(numFrames,frame.height);
    slits.copy(slits,0,0,frame.width-1,frame.height,1,0,frame.width-1,frame.height);
    // slits=temp.get();
    slits.copy(frame,floor(frame.width/2),0,1,frame.height,0,0,1,frame.height);
  }
  
  this.getSlits=function(){
    // console.log(slits);
    return slits;
  }
  

}