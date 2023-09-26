const Chip = ({
  children,
  isActive,
  onClick
}: {
  children: React.ReactNode,
  isActive: boolean,
  onClick: () => void
}) => {
  return (
    <div
      className={`${!isActive ? 'in' : ''}active chip-container`}
      onClick={onClick}
    >
      <div className={`chip ${!isActive ? 'in' : ''}active type-tag-1`}>
        {children}
      </div>
    </div>
  );
};

export default Chip;