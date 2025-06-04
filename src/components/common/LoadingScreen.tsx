const LoadingScreen = () => {
    return (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm">
            <div className="w-14 h-14 border-[6px] border-indigo-300 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="mt-3 text-sm text-gray-700 font-medium animate-pulse">
                Loading map...
            </p>
        </div>
    )
}


export default LoadingScreen;