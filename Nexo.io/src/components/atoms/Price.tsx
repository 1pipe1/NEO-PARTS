type PriceProps = {
  amount?: number;
};

const Price = ({ amount }: PriceProps) => {
  const safeAmount = amount ?? 0;

  return (
    <p className="mt-2 text-black font-bold">
      ${Number(safeAmount).toFixed(0)}
    </p>
  );
};

export default Price;
