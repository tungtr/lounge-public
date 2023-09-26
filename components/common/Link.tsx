const Link = ({
  children,
  onClick
}: {
  children?: React.ReactNode,
  onClick: () => void
}) => {
  return (
    <span
      className='link type-tag-1'
      onClick={onClick}
    >
      {children}
    </span>
  );
};

export default Link;