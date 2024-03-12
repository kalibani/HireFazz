import React from 'react';

const UnlockCard = () => {
  return (
    <div className="flex gap-x-10 mt-16 items-center">
      <div className="relative">
        <div className="w-[640px] h-[334px] bg-gray-400 rounded-md z-10 relative"></div>
        <div className="w-[640px] h-[334px] bg-primary rounded-md -top-[0.5rem] -left-[0.5rem] absolute "></div>
      </div>
      <div className="text-left space-y-4">
        <h4 className="text-3xl font-medium">Screening CV automation</h4>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras at magna
          sit amet urna facilisis ullamcorper. In id velit a leo dictum
          tincidunt ac vitae dolor. In id velit a leo dictum tincidunt ac vitae
          dolor. In id velit a leo dictum tincidunt ac vitae dolor.
        </p>
      </div>
    </div>
  );
};

export default UnlockCard;
