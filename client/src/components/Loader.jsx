const Loader = ({loading}) => {
    return (
        <>
            {
                loading &&
                <div className="">
                    <div className="border-4 border-gray-200 border-t-blue-500 rounded-full w-6 h-6 animate-spin"></div>
                </div>
            }
        </>
    )
}

export default Loader