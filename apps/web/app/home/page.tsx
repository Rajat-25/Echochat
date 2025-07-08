'use client';

import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';

const Home = () => {
  const text=' Your world, one chat at a time ' 
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div className='bg-[#0F0F0F] h-[calc(100vh-4rem)]  flex flex-col justify-center items-center gap-y-[2rem] '>
      <h2
        ref={ref}
        className='text-xl text-white text-center sm:text-4xl font-bold tracking-tighter md:text-6xl md:leading-[4rem]'
      >
        {text.split('').map((letter, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{
              duration: 0.2,
              delay: index * 0.1,
            }}
          >
            {letter}
          </motion.span>
        ))}
      </h2>

      <Link
        href='/signin'
        className='bg-[var(--color-auth-form-btn)] hover:scale-105 transition-transform duration-300 text-white text-lg font-semibold rounded-full px-6 py-3 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white'
      >
        Start Conversation
      </Link>
    </div>
  );
};

export default Home;
