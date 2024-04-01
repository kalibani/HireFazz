import React from 'react';

const CardDiscover = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className=" space-y-2">
      <p className="text-base font-bold lg:text-xl">{title}</p>
      <p
        className="text-sm text-[#917B7D] lg:max-w-[487px] lg:text-lg"
        dangerouslySetInnerHTML={{ __html: description }} // changes this have if possible
      />
    </div>
  );
};
export default CardDiscover;
