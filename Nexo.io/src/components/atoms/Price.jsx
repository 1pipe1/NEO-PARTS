const Price = ({ amount }) => {
  // Si amount no existe, le ponemos 0 por defecto para que no explote
  const safeAmount = amount || 0;

  return (
    <p className="mt-2 text-black font-bold">${Number(safeAmount).toFixed(0)}</p>
  );
};

export default Price;
