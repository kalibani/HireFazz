"use client";

import { memo, useState, useRef, useEffect, useLayoutEffect } from "react";
import ReactPlayer from "react-player";
import * as dateFns from "date-fns";
import { Play, Pause, Download, ChevronDown, Loader2 } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { useProModal } from "@/hooks/use-pro-modal";
import { MAX_FREE_COUNTS } from "@/constant";
import UseMidtrans from "@/hooks/use-midtrans";
import { useUser } from "@/hooks/use-user";
import { downloadBlobFile } from "@/lib/utils";
import toast from "react-hot-toast";

type audioPlayerProps = {
  selectedVoice: any;
  selectVoice: (v: {}) => void;
  handlePlayVoice: (v: any) => void;
  onExpand: (v: boolean) => void;
  stream: any;
  selectedVoiceTemp: {};
  updateUserLimit?: () => void;
};

const AudioPlayer = ({
  selectedVoice,
  selectVoice,
  handlePlayVoice,
  onExpand,
  stream,
  selectedVoiceTemp,
  updateUserLimit,
}: audioPlayerProps) => {
  const [isReady, setReady] = useState(false);
  const [isPlaying, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState({
    playedSeconds: 0,
    played: 0,
    loadedSeconds: 0,
    loaded: 1,
  });
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState(false);
  // const [toggle, setToggle] = useState(false);

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

  useLayoutEffect(() => {
    if (isReady) {
      setPlaying(selectedVoice.isPlaying);
    }
  }, [selectedVoice, isReady]);

  useEffect(() => {
    if (stream && Object.keys(selectedVoice).length === 0) {
      selectVoice(selectedVoiceTemp);
    }
  }, [stream]);

  const { apiLimitCount, onOpen, setPayAsYouGoPriceVisible } = useProModal();
  const isFreeTrialLimited = apiLimitCount === MAX_FREE_COUNTS;
  const { subscriptionType } = useUser();

  const { isLoading, successResult, error, isClosed, pendingResult } =
    UseMidtrans();

  const handleDownload = async () => {
    // if (subscriptionType !== "PREMIUM" && isFreeTrialLimited && stream) {
    //   setPayAsYouGoPriceVisible(true);
    //   onOpen();
    // } else {
    setIsDownloading(true);
    const url = stream || selectedVoice.preview_url;
    downloadBlobFile(url, `berrylabs-${selectedVoice.name}`);
    if (!isFreeTrialLimited && stream) {
      // @ts-ignore
      // updateUserLimit();
    }
    setIsDownloading(false);
    // }
  };

  useEffect(() => {
    if (Object.keys(successResult).length > 0 && stream) {
      const url = stream;
      downloadBlobFile(url, `berrylabs-${selectedVoice.name}`);
    }
  }, [successResult]);

  useEffect(() => {
    if (Object.keys(pendingResult).length > 0) {
      toast.success("Pembayaran Anda Tertunda, Silakan Selesaikan Pembayaran", {
        duration: 2000,
      });
    }
  }, [pendingResult]);

  return (
    <div className="shadow shadow-slate-200/80 ring-1 ring-slate-900/5 py-4 px-4 sticky bottom-0 z-10 bg-white mt-4 w-full">
      <div className="flex items-start gap-2.5 w-full">
        <div className="flex flex-col gap-1 w-full">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              Voice Preview for {selectedVoice.category} / {selectedVoice.name}
            </span>
          </div>
          <div className="flex items-center gap-6 w-full">
            <div className="flex items-center space-x-2 rtl:space-x-reverse w-full">
              <button
                className="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                type="button"
                onClick={() => handlePlayVoice(selectedVoice)}
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
                className="flex-1"
                indicatorColor="bg-gray-900"
              />
              <span className="inline-flex self-center items-center p-2 text-sm font-medium text-gray-400 dark:text-white">
                {/* @ts-ignore */}
                {dateFns.format(
                  Math.round(progress.playedSeconds) * 1000,
                  "mm:ss"
                )}{" "}
                {/* @ts-ignore */}/{" "}
                {dateFns.format(Math.round(duration) * 1000, "mm:ss")}
              </span>
              {stream && isReady ? (
                <span className="relative flex h-3 w-3 bottom-3 -right-9">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75 "></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                </span>
              ) : null}
              <button onClick={() => handleDownload()} className="relative">
                <span>
                  {isDownloading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Download color="#301a32" strokeWidth={1.75} />
                  )}
                </span>
              </button>
              <button onClick={() => onExpand(false)}>
                <ChevronDown
                  className="h-6 w-6"
                  color="#301a32"
                  strokeWidth={1.75}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <ReactPlayer
        url={stream || selectedVoice.preview_url}
        playing={isPlaying}
        height={0}
        width={0}
        ref={audioRef}
        onReady={() => setReady(true)}
        onDuration={setDuration}
        // onEnded={() => handlePlayVoice(selectedVoice)}
        onProgress={(p) => {
          setProgress(p);
          handleAudioProgress(p);
        }}
        config={{
          file: {
            forceAudio: true,
          },
        }}
      />
    </div>
  );
};

export default memo(AudioPlayer);
