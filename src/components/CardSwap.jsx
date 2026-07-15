"use client";

import React, { Children, cloneElement, forwardRef, isValidElement, useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import './CardSwap.css';

export const Card = forwardRef(({ customClass, ...rest }, ref) => (
  <div ref={ref} {...rest} className={`card ${customClass ?? ''} ${rest.className ?? ''}`.trim()} />
));
Card.displayName = 'Card';

const makeSlot = (i, distX, distY, total) => ({
  x: i * distX,
  y: -i * distY,
  scale: Math.max(0.9, 1 - i * 0.012),
  zIndex: total - i
});
const placeNow = (el, slot, skew) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    scale: slot.scale,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: false
  });

const CardSwap = ({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  onCardClick,
  manualSwapSignal = 0,
  skewAmount = 6,
  easing = 'elastic',
  children
}) => {
  const autoConfig =
    easing === 'elastic'
      ? {
          ease: 'elastic.out(0.6,0.9)',
          durDrop: 1.35,
          durMove: 1.25,
          durReturn: 1.25,
          promoteOverlap: 0.58,
          returnDelay: 0.24
        }
      : {
          ease: 'power1.inOut',
          durDrop: 0.8,
          durMove: 0.8,
          durReturn: 0.8,
          promoteOverlap: 0.45,
          returnDelay: 0.2
        };
  const manualConfig = {
    ease: 'power2.out',
    durDrop: 0.45,
    durMove: 0.5,
    durReturn: 0.5,
    promoteOverlap: 0.82,
    returnDelay: 0.03
  };

  const childArr = useMemo(() => Children.toArray(children), [children]);
  const refs = useMemo(
    () => childArr.map(() => React.createRef()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [childArr.length]
  );

  const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));

  const tlRef = useRef(null);
  const intervalRef = useRef();
  const isAnimatingRef = useRef(false);
  const pendingManualSwapRef = useRef(false);
  const swapRef = useRef(null);
  const manualSwapRef = useRef(null);
  const container = useRef(null);

  useEffect(() => {
    const total = refs.length;
    const dropDistance = Math.max(height * 1.08, 320);
    refs.forEach((r, i) => placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount));

    const swap = (isManual = false) => {
      if (order.current.length < 2) return;
      if (isAnimatingRef.current) return;

      isAnimatingRef.current = true;
      const activeConfig = isManual ? manualConfig : autoConfig;

      const [front, ...rest] = order.current;
      const elFront = refs[front].current;
      const tl = gsap.timeline();
      tlRef.current = tl;

      tl.to(elFront, {
        y: `+=${dropDistance}`,
        duration: activeConfig.durDrop,
        ease: activeConfig.ease
      });

      tl.addLabel('promote', `-=${activeConfig.durDrop * activeConfig.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs[idx].current;
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
        tl.set(el, { zIndex: slot.zIndex }, 'promote');
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            scale: slot.scale,
            duration: activeConfig.durMove,
            ease: activeConfig.ease
          },
          `promote+=${i * 0.15}`
        );
      });

      const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
      tl.addLabel('return', `promote+=${activeConfig.durMove * activeConfig.returnDelay}`);
      tl.call(
        () => {
          gsap.set(elFront, { zIndex: backSlot.zIndex });
        },
        undefined,
        'return'
      );
      tl.to(
        elFront,
        {
          x: backSlot.x,
          y: backSlot.y,
          scale: backSlot.scale,
          duration: activeConfig.durReturn,
          ease: activeConfig.ease
        },
        'return'
      );

      tl.call(() => {
        order.current = [...rest, front];
        isAnimatingRef.current = false;
        if (pendingManualSwapRef.current) {
          pendingManualSwapRef.current = false;
          window.setTimeout(() => manualSwapRef.current?.(), 0);
        }
      });
    };

    swapRef.current = swap;
    manualSwapRef.current = () => {
      clearInterval(intervalRef.current);
      if (isAnimatingRef.current) {
        pendingManualSwapRef.current = true;
        tlRef.current?.timeScale(4);
        return;
      }
      swap(true);
      intervalRef.current = window.setInterval(swap, delay);
    };
    intervalRef.current = window.setInterval(swap, delay);

    const node = container.current;

    if (pauseOnHover) {
      const pause = () => {
        tlRef.current?.pause();
        clearInterval(intervalRef.current);
      };
      const resume = () => {
        tlRef.current?.play();
        clearInterval(intervalRef.current);
        intervalRef.current = window.setInterval(swap, delay);
      };
      node.addEventListener('mouseenter', pause);
      node.addEventListener('mouseleave', resume);
      return () => {
        node.removeEventListener('mouseenter', pause);
        node.removeEventListener('mouseleave', resume);
        clearInterval(intervalRef.current);
      };
    }

    return () => {
      clearInterval(intervalRef.current);
      tlRef.current?.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing, height]);

  useEffect(() => {
    if (manualSwapSignal === 0) return;
    manualSwapRef.current?.();
  }, [manualSwapSignal]);

  // GSAP needs stable DOM refs for the stacked card transforms.
  // eslint-disable-next-line react-hooks/refs
  const rendered = childArr.map((child, i) =>
    isValidElement(child)
      ? cloneElement(child, {
          key: i,
          ref: node => {
            refs[i].current = node;
          },
          style: { width, height, ...(child.props.style ?? {}) },
          onPointerDown: e => {
            e.stopPropagation();
            child.props.onPointerDown?.(e);
            onCardClick?.(i);
            manualSwapRef.current?.();
          }
        })
      : child
  );

  return (
    <div
      ref={container}
      className="card-swap-container"
      style={{ width, height }}
      onPointerDown={event => {
        event.stopPropagation();
        manualSwapRef.current?.();
      }}
    >
      {rendered}
    </div>
  );
};

export default CardSwap;
