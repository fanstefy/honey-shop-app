const Spinner: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999]">
      <div className="animate-buzz text-5xl">🐝</div>
    </div>
  );
};

export default Spinner;
