// "use client";

// import { useReducer } from "react";

// type AudioState = {
//   readonly isPlaying: boolean;
//   readonly audio: HTMLAudioElement | null;
// };

// type AudioAction =
//   | { readonly type: "PLAY"; readonly audio: HTMLAudioElement }
//   | { readonly type: "END" };

// function audioReducer(state: AudioState, action: AudioAction): AudioState {
//   switch (action.type) {
//     case "PLAY":
//       return { isPlaying: true, audio: action.audio };
//     case "END":
//       return { ...state, isPlaying: false };
//   }
// }

// type AudioButtonProps = {
//   readonly audioUrl: string;
//   readonly word: string;
// };

// export function AudioButton({ audioUrl, word }: AudioButtonProps) {
//   const [state, dispatch] = useReducer(audioReducer, { isPlaying: false, audio: null });

//   function handlePlay() {
//     const audio = state.audio ?? new Audio(audioUrl);

//     if (!state.audio) {
//       audio.addEventListener("ended", () => dispatch({ type: "END" }));
//     }

//     dispatch({ type: "PLAY", audio });
//     audio.play().catch(() => dispatch({ type: "END" }));
//   }

//   return (
//     <button
//       onClick={handlePlay}
//       disabled={state.isPlaying}
//       className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-blue-600 dark:text-blue-400 transition-colors disabled:opacity-50"
//       aria-label={`Play pronunciation of ${word}`}
//     >
//       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//         <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
//       </svg>
//     </button>
//   );
// }