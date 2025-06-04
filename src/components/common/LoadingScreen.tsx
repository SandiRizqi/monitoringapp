const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center  z-50">
            <div className="flex flex-col items-center">
                <div className="w-14 h-14 border-4 border-greensecondarycolor border-t-transparent rounded-full animate-spin"></div>
            </div>
        </div>
    )
}


export default LoadingScreen;