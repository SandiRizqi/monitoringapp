type LoadingScreenProps = {
  z?: number;
};

const LoadingScreen = ({ z = 80 }: LoadingScreenProps) => {
  return (
    <div
      className={`fixed inset-0 z-[${z}] flex flex-col items-center justify-center bg-white backdrop-blur-sm pointer-events-auto`}
    >
      <div className="w-14 h-14 border-[6px] border-indigo-300 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="mt-3 text-sm text-gray-700 font-medium animate-pulse">
        Loading...
      </p>
    </div>
  );
};

export default LoadingScreen;
