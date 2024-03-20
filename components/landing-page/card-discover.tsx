import React from 'react';

const CardDiscover = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="space-y-2">
      <p className="text-base font-bold">{title}</p>
      <p
        className="max-w-[487px] text-[#917B7D]"
        dangerouslySetInnerHTML={{ __html: description }} // changes this have if possible
      />
    </div>
  );
};
export default CardDiscover;
