export default function QuitPopup({ message, onConfirm, onCancel }) {
  return (
    <>
      <div className="font-medieval top-0 left-0 flex items-center justify-center h-screen w-screen absolute bg-black/45 backdrop-blur-sm z-50 px-4">
        <div className="bg-[#0f2444] border border-[#2d4f85] rounded-xl p-6 shadow-2xl text-center w-[300px] md:w-[420px]">
          <p className="text-lg text-[#64ffda] font-bold mb-4 tracking-wide">{message}</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-mono hover:bg-red-700 transition-colors"
            >
              Yes, Quit
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg font-mono hover:bg-slate-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
