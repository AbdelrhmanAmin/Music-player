import { useState, useRef, useEffect } from "react";
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai";
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi";
import { IconContext } from "react-icons";
import formatTime from "../../utils/formatDuration";

const SEEK_PADDING = 0.3;

const Player = () => {
  const playerRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const onPlay = () => {
    playerRef.current?.play();
    setIsPlaying(true);
  };
  const onPause = () => {
    playerRef.current?.pause();
    setIsPlaying(false);
  };
  const [seek, setSeek] = useState(0);
  const updateSeek = (range: number) => {
    if (playerRef.current) {
      const duration = playerRef.current.duration || 0;
      const seekTime = (range / 100) * duration;
      playerRef.current.currentTime = seekTime;
      setSeek(range);
      if (!isPlaying) {
        setIsPlaying(true);
        playerRef.current.play();
      }
    }
  };

  useEffect(() => {
    playerRef.current = new Audio("https://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/race1.ogg");
    playerRef.current.addEventListener("timeupdate", () => {
      if (playerRef.current) {
        const { currentTime, duration } = playerRef.current;
        const seek = (currentTime / duration) * 100;
        setSeek(seek);
      }
    });
    return () => {
      playerRef.current?.pause();
      playerRef.current?.removeEventListener("timeupdate", () => {});
    };
  }, []);

  return (
    <div className="flex flex-col space-y-5 bg-black p-4 shadow-2xl">
      <input
        type="range"
        className="transparent h-1.5 w-full cursor-pointer appearance-none rounded-lg border-transparent bg-neutral-200"
        style={{
          background: `linear-gradient(to right, #27AE60 ${seek + SEEK_PADDING}%, #E5E7EB ${seek}%)`,
        }}
        min={0}
        max={100}
        value={seek}
        onChange={(e) => updateSeek(Number(e.target.value))}
      />
      <div className="flex items-center justify-between">
        <span>{formatTime(playerRef.current?.currentTime)}</span>
        <div className="flex items-center justify-center">
          <button className="text-green-600 hover:text-green-400 transition-colors">
            <IconContext.Provider value={{ size: "3em" }}>
              <BiSkipPrevious />
            </IconContext.Provider>
          </button>
          {!isPlaying ? (
            <button
              onClick={onPlay}
              className="text-green-600 hover:text-green-400 transition-colors"
            >
              <IconContext.Provider value={{ size: "3em" }}>
                <AiFillPlayCircle />
              </IconContext.Provider>
            </button>
          ) : (
            <button
              onClick={onPause}
              className="text-green-600 hover:text-green-400 transition-colors"
            >
              <IconContext.Provider value={{ size: "3em" }}>
                <AiFillPauseCircle />
              </IconContext.Provider>
            </button>
          )}
          <button className="text-green-600 hover:text-green-400 transition-colors">
            <IconContext.Provider value={{ size: "3em" }}>
              <BiSkipNext />
            </IconContext.Provider>
          </button>
        </div>
        <span>{formatTime(playerRef.current?.duration)}</span>
      </div>
    </div>
  );
};

export default Player;
