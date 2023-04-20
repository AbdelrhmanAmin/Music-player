import { useEffect, useRef, useState } from "react";
import { IconContext } from "react-icons";
import { AiFillPauseCircle, AiFillPlayCircle } from "react-icons/ai";
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi";
import {
  BsFillVolumeDownFill,
  BsFillVolumeMuteFill,
  BsFillVolumeOffFill,
  BsFillVolumeUpFill,
} from "react-icons/bs";
import formatTime from "../../utils/formatDuration";

const SEEK_PADDING = 0.1;

const Player = () => {
  const playerRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(20);
  const onPlay = () => {
    playerRef.current?.play();
    setIsPlaying(true);
  };
  const onPause = () => {
    playerRef.current?.pause();
    setIsPlaying(false);
  };
  const onVolumeChange = (volume: number) => {
    if (playerRef.current) {
      playerRef.current.volume = volume / 100;
      setVolume(volume);
    }
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
    playerRef.current = new Audio(
      "https://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/race1.ogg"
    );
    // to initialize the volume
    onVolumeChange(volume);
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
          background: `linear-gradient(to right, #27AE60 ${
            seek + SEEK_PADDING
          }%, #E5E7EB ${seek}%)`,
        }}
        min={0}
        max={100}
        value={seek}
        onChange={(e) => updateSeek(Number(e.target.value))}
      />
      <div className="flex items-center justify-center space-x-2">
        <VolumeController value={volume} onChange={onVolumeChange} />
      </div>
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

const VolumeIcons = (volume: number) => {
  const options = {
    0: <BsFillVolumeMuteFill />,
    1: <BsFillVolumeOffFill />,
    2: <BsFillVolumeDownFill />,
    3: <BsFillVolumeUpFill />,
  };

  if (volume === 0) {
    return options[0];
  }
  if (volume < 15) {
    return options[1];
  }
  if (volume < 30) {
    return options[2];
  }
  return options[3];
};

const VolumeController = ({
  onChange,
  value,
}: {
  onChange: (range: number) => void;
  value: number;
}) => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <button
        className="text-green-600 hover:text-green-400 transition-colors"
        onClick={() => {
          if (value === 0) {
            onChange(20);
          } else {
            onChange(0);
          }
        }}
      >
        <IconContext.Provider value={{ size: "1.5em" }}>
          {VolumeIcons(value)}
        </IconContext.Provider>
      </button>
      <input
        type="range"
        className="transparent h-1.5 w-24 cursor-pointer appearance-none rounded-lg border-transparent bg-neutral-200"
        style={{
          background: `linear-gradient(to right, #27AE60 ${
            value + SEEK_PADDING
          }%, #E5E7EB ${value}%)`,
        }}
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
};
