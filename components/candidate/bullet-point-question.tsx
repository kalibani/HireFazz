import React from 'react';

const BulletPointQuestion = ({
  total,
  index,
}: {
  total: number;
  index: number;
}) => {
  return (
    <div className="my-4 flex gap-x-4">
      {total > 0 &&
        [...Array(total)].map((_, i) => (
          <div
            key={i}
            className={`size-4 rounded-full ${i === index ? 'border border-white bg-transparent' : 'bg-white'}`}
          />
        ))}
    </div>
  );
};

export default BulletPointQuestion;
