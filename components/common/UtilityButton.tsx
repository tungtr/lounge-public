// Assets
import { LuX, LuChevronLeft } from 'react-icons/lu';

const UtilityButton = ({
  type='close',
  onClick
}: {
  type: string
  onClick: () => void
}) => {
  const commonClass = 'utility-button';

  return (
    <div
      className='utility-button-container'
      onClick={onClick}
    >
      {type === 'close' && <LuX className={commonClass} />}
      {type === 'back' && <LuChevronLeft className={commonClass} />}
    </div>
  );
};

export default UtilityButton;