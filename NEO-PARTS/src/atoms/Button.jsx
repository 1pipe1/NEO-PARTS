
const Button = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
    >
      {text}
    </button>
  );
};

export default Button;
