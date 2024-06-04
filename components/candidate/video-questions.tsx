import React from 'react';
import EmptyVideo from './empty-video';
import BulletPointQuestion from './bullet-point-question';

const VideoQuestions = ({
  videoUrl,
  videoKey,
  totalQuestion,
  isQuestion,
}: {
  videoUrl: string;
  videoKey: number;
  totalQuestion: number;
  isQuestion: boolean;
}) => {
  return (
    <div className="my-2 ">
      {!videoUrl ? (
        <EmptyVideo />
      ) : (
        <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-xl shadow-md">
          <video controls key={videoKey} className="h-full w-full object-cover">
            <source src={videoUrl} />
          </video>
        </div>
      )}
      {isQuestion && (
        <BulletPointQuestion index={videoKey} total={totalQuestion} />
      )}
    </div>
  );
};

export default VideoQuestions;
