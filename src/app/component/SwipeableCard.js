'use client'
// src/components/SwipeableCard.js
import React, { useState } from 'react';
import { useSprings, animated } from 'react-spring';
import { useGesture } from '@use-gesture/react';

const to = (i) => ({ x: 0, y: i * 4, scale: 1, rot: -10 + Math.random() * 20, delay: i * 100 });
const from = () => ({ x: 0, rot: 0, scale: 1.5, y: -1000 });
const trans = (r, s) => `perspective(1500px) rotateX(30deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`;

const SwipeableCard = ({ cards }) => {
  const [gone] = useState(() => new Set());
  const [props, set] = useSprings(cards.length, (i) => ({ ...to(i), from: from() }));

  const bind = useGesture(
    ({ args: [index], down, movement: [mx], direction: [xDir], velocity }) => {
      const trigger = velocity > 0.2;
      const dir = xDir < 0 ? -1 : 1;

      if (!down && trigger) gone.add(index);

      set((i) => {
        if (index !== i) return;
        const isGone = gone.has(index);
        const x = isGone ? (200 + window.innerWidth) * dir : down ? mx : 0;
        const rot = mx / 100 + (isGone ? dir * 10 * velocity : 0);
        const scale = down ? 1.1 : 1;
        return { x, rot, scale, delay: undefined, config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 } };
      });

      if (!down && gone.size === cards.length) setTimeout(() => gone.clear() || set((i) => to(i)), 600);
    }
  );

  return props.map(({ x, y, rot, scale }, i) => (
    <animated.div
      key={i}
      style={{ transform: y.to((y) => `translate3d(0,${y}px,0)`) }}
      className="absolute w-full h-full"
    >
      <animated.div
        {...bind(i)}
        style={{
          transform: x.to((x) => `translate3d(${x}px,0,0)`).to((t) => `${t} ${trans(rot, scale)}`),
        }}
        className="w-full h-full flex items-center justify-center bg-white border border-gray-300 rounded-lg shadow-lg"
      >
        {cards[i]}
      </animated.div>
    </animated.div>
  ));
};

export default SwipeableCard;
