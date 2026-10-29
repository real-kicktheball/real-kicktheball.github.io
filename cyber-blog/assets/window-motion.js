(() => {
  if(self!==top)return;
  const running=new WeakMap();
  const shape=[
    'polygon(0 0,33% 0,67% 0,100% 0,100% 40%,100% 80%,100% 100%,67% 100%,33% 100%,0 100%,0 80%,0 40%)',
    'polygon(0 0,33% 0,67% 0,100% 0,96% 40%,88% 80%,78% 100%,60% 100%,40% 100%,22% 100%,12% 80%,4% 40%)',
    'polygon(12% 0,34% 0,66% 0,88% 0,83% 40%,72% 80%,62% 100%,54% 100%,46% 100%,38% 100%,28% 80%,17% 40%)',
    'polygon(43% 0,47% 0,53% 0,57% 0,57% 40%,56% 80%,55% 100%,52% 100%,48% 100%,45% 100%,44% 80%,43% 40%)'
  ];
  window.blogWindowMotion=(shell,launcher,direction)=>{
    running.get(shell)?.cancel();
    if(!launcher||!shell.animate||matchMedia('(prefers-reduced-motion: reduce)').matches||document.hidden)return Promise.resolve();
    const from=shell.getBoundingClientRect(),to=launcher.getBoundingClientRect();
    if(!from.width||!from.height||!to.width)return Promise.resolve();
    const dx=to.left+to.width/2-from.left-from.width/2,dy=to.top+to.height/2-from.top-from.height/2;
    const sx=Math.min(.22,to.width/from.width),sy=Math.min(.06,to.height/from.height);
    const skew=Math.max(-12,Math.min(12,dx/from.width*8));
    const frames=[
      {offset:0,transform:'translate(0px,0px) scale(1,1)',clipPath:shape[0],opacity:1},
      {offset:.3,transform:`translate(${dx*.08}px,${dy*.08}px) scale(.96,.84) skewX(${skew*.35}deg)`,clipPath:shape[1],opacity:1},
      {offset:.68,transform:`translate(${dx*.57}px,${dy*.56}px) scale(.53,.4) skewX(${skew}deg)`,clipPath:shape[2],opacity:.95},
      {offset:1,transform:`translate(${dx}px,${dy}px) scale(${sx},${sy})`,clipPath:shape[3],opacity:0}
    ];
    shell.classList.add('window-motion-active');shell.style.willChange='transform,clip-path,opacity';
    shell.style.transformOrigin='center center';
    const keyframes=direction==='restore'?[...frames].reverse().map(frame=>({...frame,offset:1-frame.offset})):frames;
    const animation=shell.animate(keyframes,{duration:560,easing:'linear',fill:'forwards'});
    running.set(shell,animation);
    return animation.finished.catch(()=>{}).then(()=>{
      if(running.get(shell)!==animation)return;
      running.delete(shell);animation.cancel();shell.classList.remove('window-motion-active');
      shell.style.removeProperty('will-change');shell.style.removeProperty('transform-origin');
    });
  };
})();
