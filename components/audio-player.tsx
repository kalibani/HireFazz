import { memo, useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import * as dateFns from "date-fns";
import { Play, Pause, Download, ChevronDown } from "lucide-react";

import { Progress } from "@/components/ui/progress";

type audioPlayerProps = {
  selectedVoice: any;
  selectVoice: (v: {}) => void;
  handlePlayVoice: (v: any) => void;
  onExpand: (v: boolean) => void;
  stream: any;
};

const AudioPlayer = ({
  selectedVoice,
  selectVoice,
  handlePlayVoice,
  onExpand,
  stream,
}: audioPlayerProps) => {
  const [isPlaying, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState({
    playedSeconds: 0,
    played: 0,
    loadedSeconds: 0,
    loaded: 1,
  });
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [toggle, setToggle] = useState(false);

  const audioRef = useRef(null);

  const handleAudioProgress = (p: any) => {
    const currenTime = p.playedSeconds;
    if (isNaN(duration))
      // duration is NotaNumber at Beginning.
      return;
    setAudioProgress((currenTime / duration) * 100);
  };
  useEffect(() => {
    if (audioProgress === 100) {
      setTimeout(() => {
        setAudioProgress(0);
        handlePlayVoice(selectedVoice);
      }, 900);
    }
  }, [audioProgress]);

  useEffect(() => {
    if (progress.loadedSeconds > 0) {
      setPlaying(selectedVoice.isPlaying);
    }
  }, [selectedVoice, progress]);

  return (
    <div className="shadow shadow-slate-200/80 ring-1 ring-slate-900/5 py-4 px-4 fixed bottom-0 z-10 bg-white">
      <div className="flex items-start gap-2.5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              Voice Preview for {selectedVoice.category} / {selectedVoice.name}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center space-x-2 rtl:space-x-reverse w-screen">
              <button
                className="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                type="button"
                onClick={() => {
                  setToggle(!toggle);
                  handlePlayVoice(selectedVoice);
                }}
              >
                {isPlaying ? (
                  <Pause
                    className="w-4 h-4 text-gray-800"
                    fill="text-gray-800"
                  />
                ) : (
                  <Play
                    className="w-4 h-4 text-gray-800"
                    fill="text-gray-800"
                  />
                )}
              </button>
              <Progress
                value={audioProgress}
                className="w-[60%]"
                indicatorColor="bg-gray-900"
              />
              <span className="inline-flex self-center items-center p-2 text-sm font-medium text-gray-400 dark:text-white">
                {dateFns.format(
                  Math.round(progress.playedSeconds) * 1000,
                  "mm:ss"
                )}{" "}
                / {dateFns.format(Math.round(duration) * 1000, "mm:ss")}
              </span>
              <a href={selectedVoice.preview_url} download>
                <span>
                  <Download color="#301a32" strokeWidth={1.75} />
                </span>
              </a>
              <button onClick={() => onExpand(true)}>
                {/* <button className="p-2"> */}
                <ChevronDown
                  className="h-6 w-6"
                  color="#301a32"
                  strokeWidth={1.75}
                />
                {/* </button> */}
              </button>
            </div>
          </div>
        </div>
      </div>

      <ReactPlayer
        url={selectedVoice.preview_url}
        playing={isPlaying}
        height={0}
        width={0}
        ref={audioRef}
        onDuration={setDuration}
        // onEnded={() => handlePlayVoice(selectedVoice)}
        onProgress={(p) => {
          setProgress(p);
          handleAudioProgress(p);
        }}
      />
    </div>
  );
};

export default memo(AudioPlayer);
