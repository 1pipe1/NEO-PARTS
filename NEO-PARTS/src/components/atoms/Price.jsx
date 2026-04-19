const Price = ({ amount }) => {
  // Si amount no existe, le ponemos 0 por defecto para que no explote
  const safeAmount = amount || 0;

  return (
    <p className="mt-2 text-green-600 font-bold">${Number(safeAmount).toFixed(2)}</p>
  );
};

export default Price;
